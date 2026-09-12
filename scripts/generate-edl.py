"""
EDL generator — transcript -> edl.json (the agent's editing brain).
Local providers pick the edit style and lay out captions/hook/zoom/cta.

Captions are built deterministically from the transcript (word timestamps) so they
stay frame-accurate; the LLM provider only decides hook text, zoom points, graphic moments.

Usage: python scripts/generate-edl.py [--clip raw/talkinghead.mp4] [--llm prefed|offline|claude-cli]
"""
import sys, json, argparse, re
from pathlib import Path

# Windows console defaults to cp1252 which can't encode Vietnamese diacritics in
# print() (crashes Pass 1). Force UTF-8 stdout/stderr regardless of OS locale.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"
PUBLIC = ROOT / "public"

# Comprehensive regex to purge emojis from captions, titles, and graphics
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F680-\U0001F6FF"  # transport & map symbols
    "\U0001F1E0-\U0001F1FF"  # flags
    "\U00002702-\U000027B0"
    "\U000024C2-\U0001F251"
    "\U0001F900-\U0001F9FF"  # supplemental symbols
    "\U0001FA70-\U0001FAFF"  # symbols and pictographs extended-a
    "\U00002600-\U000026FF"  # misc symbols
    "]+", flags=re.UNICODE
)

def strip_emojis(text):
    """Purge all emojis from strings (captions, graphics, titles)."""
    if not isinstance(text, str):
        return text
    cleaned = EMOJI_PATTERN.sub("", text)
    return re.sub(r"\s+", " ", cleaned).strip()

def strip_emojis_recursive(obj):
    """Recursively purge emojis from nested data structures (dict, list, str)."""
    if isinstance(obj, str):
        return strip_emojis(obj)
    elif isinstance(obj, list):
        return [strip_emojis_recursive(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: strip_emojis_recursive(v) for k, v in obj.items()}
    return obj

# Professional reel color themes (must mirror src/theme.ts)
#
# === StyleRecipe contract: field names mirror src/edl-types.ts styleRecipeSchema.
# React reads ALL of these from recipe (no getTheme at render). Token VALUES come from
# src/style-themes.json (single source, R2-FIX3) — do NOT duplicate a material dict here.
#   surface: "none"|"glass-light"|"glass-dark"|"solid-tint"  (v7 "glass-light")
#   blurPx: 18 | shadowMode: "soft"|"hard" (v7 "soft") | borderIntensity: 0.35
#   cardRadius: 28 | captionStrokePx: 3
#   captionBottomPct: 28   (FINAL %, render uses verbatim — NO +3 offset, R2-FIX2)
#   motionVoice: "energetic"|"confident"|"handcraft"|"reveal"|"punch"  (P4b only)
#   glassOpacity: 0.12 (cards/surfaces only, NOT BackingBlob) | textScale: 1.0
#   entryAnimFamily: "spring"|"slide"|"fade"|"mask"
#   accent: "#FF8C00" | accent2: "#FFC845" | highlightColor: "#39E508"
#   captionColor: "#FFFFFF" | scrimAlpha: 0.0  (color in recipe too, R2-FIX1)
THEMES = {
    "sunset": {"accent": "#FB7427", "accent2": "#FBBF24", "highlight": "#A3E635", "caption": "#FFFFFF"},
    "bloom":  {"accent": "#10B981", "accent2": "#8B5CF6", "highlight": "#FDE047", "caption": "#FFFFFF"},
    "ocean":  {"accent": "#2563EB", "accent2": "#F97316", "highlight": "#FDE047", "caption": "#FFFFFF"},
    "noir":   {"accent": "#F59E0B", "accent2": "#8B5CF6", "highlight": "#34D399", "caption": "#FFFFFF"},
    "punch":  {"accent": "#EF4444", "accent2": "#F59E0B", "highlight": "#A3E635", "caption": "#FFFFFF"},
    "synthwave": {"accent": "#FF2D95", "accent2": "#21D4FD", "highlight": "#FFE600", "caption": "#FFFFFF"},
    "gold":   {"accent": "#CA8A04", "accent2": "#EAB308", "highlight": "#FDE68A", "caption": "#FFFFFF"},
    "cyber":  {"accent": "#06B6D4", "accent2": "#7C3AED", "highlight": "#A3E635", "caption": "#FFFFFF"},
    "fresh":  {"accent": "#14B8A6", "accent2": "#FB7185", "highlight": "#FDE047", "caption": "#FFFFFF"},
}

# Keep themes in sync with the design-system token source. The FULL token dict
# is kept (material + motion + typography), not just colors — dropping the rest
# was why 20 themes rendered identically except for palette.
THEME_TOKENS = {}
try:
    _style_themes = json.loads((ROOT / "src" / "style-themes.json").read_text(encoding="utf-8"))
    for _name, _tokens in _style_themes.items():
        if _name.startswith("_") or not isinstance(_tokens, dict):
            continue
        if all(k in _tokens for k in ("accent", "accent2", "highlightColor", "captionColor")):
            THEMES[_name] = {
                "accent": _tokens["accent"],
                "accent2": _tokens["accent2"],
                "highlight": _tokens["highlightColor"],
                "caption": _tokens["captionColor"],
            }
            THEME_TOKENS[_name] = dict(_tokens)
except (OSError, json.JSONDecodeError):
    pass


def _parse_llm_json(txt):
    txt = txt.strip()
    if txt.startswith("```"):
        txt = txt.split("\n", 1)[1].rsplit("```", 1)[0]
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        s, e = txt.find("{"), txt.rfind("}")
        if s != -1 and e != -1:
            return json.loads(txt[s:e + 1])
        raise


def make_llm_call(provider, model):
    """Return a JSON LLM caller. Local providers do not require API keys."""
    if provider == "claude-cli":
        from local_llm import call_claude_cli
        return lambda p, m=model: call_claude_cli(p, m)
    if provider in ("offline", "prefed"):
        return None
    print(f"ERROR: unknown --llm {provider}"); sys.exit(1)


def default_recipe():
    return {
        "surface": "glass-light", "blurPx": 18, "shadowMode": "soft",
        "borderIntensity": 0.35, "cardRadius": 28, "captionStrokePx": 3,
        "captionBottomPct": 22, "motionVoice": "energetic", "glassOpacity": 0.12,
        "textScale": 1.0, "entryAnimFamily": "spring",
        "textFx": "gradient", "captionCase": "upper",
        "captionStyle": "summary",
        "accent": "#FF8C00", "accent2": "#FFC845", "highlightColor": "#39E508",
        "captionColor": "#FFFFFF", "scrimAlpha": 0.0,
    }


def pick_accent(palette, default="#FF8C00"):
    """Pick a vivid, mid-luminance color for hook/cta (skip near-white/near-black/greys)."""
    best, best_sat = None, 0
    for hexc in palette:
        try:
            r, g, b = int(hexc[1:3], 16), int(hexc[3:5], 16), int(hexc[5:7], 16)
        except (ValueError, IndexError):
            continue
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        if lum < 40 or lum > 215:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        if sat < 0.25:
            continue
        if sat > best_sat:
            best, best_sat = hexc, sat
    return best or default


# Vietnamese stopwords — NOT keyword-worthy (skip when picking highlight word)
STOPWORDS = {
    "là", "và", "của", "có", "không", "một", "các", "những", "để", "cho",
    "thì", "mà", "ở", "với", "này", "đó", "khi", "được", "bạn", "mình",
    "tôi", "nó", "ra", "vào", "lên", "đi", "rồi", "cũng", "sẽ", "đã",
    "nếu", "vì", "nên", "hay", "hoặc", "cái", "con", "người", "ta", "em",
    "anh", "chị", "ông", "bà", "ai", "gì", "nào", "sao", "đây", "kia",
    # review finding: highlights landed on function words like "ĐẾN/THÔI/TRONG/ĐIỀU"
    "đến", "thôi", "trong", "trên", "dưới", "bên", "về", "theo", "như",
    "chỉ", "rất", "hơn", "nữa", "làm", "điều", "vẫn", "đang", "nhé", "ạ",
    "à", "vậy", "thêm", "từ", "phải", "toàn", "bộ", "chưa", "nhưng",
}


def pick_keyword_idx(tokens):
    """Pick the most 'content-heavy' word in a caption to highlight (Hormozi style).
    Numbers beat everything (they ARE the content); otherwise longest non-stopword."""
    best, best_score = -1, -1
    for i, t in enumerate(tokens):
        w = t["text"].strip().lower().strip(".,!?;:")
        if any(ch.isdigit() for ch in w):
            score = 100  # "8", "2026", "7"... always the word that matters
        elif w in STOPWORDS or len(w) < 3:
            continue
        else:
            score = len(w)  # longer content word ~ more important; cheap heuristic
        if score > best_score:
            best, best_score = i, score
    return best


# word pairs that should NOT be split across caption lines (tight Vietnamese phrases)
GLUE_NEXT = {"thời", "khóa", "cuộc", "công", "bản", "thử", "phụ", "lý"}  # word -> keep with next


# Caption lead compensation. A FIXED offset cannot fix variable timestamp drift
# Local STT can still drift; proper fix is forced alignment (WhisperX).
# Keep small; 0 = use raw timestamps as-is.
CAPTION_LEAD_MS = 80


def build_captions(words, min_w=2, max_w=4, gap_break_ms=220):
    """Hormozi captions: 2-4 words/line. Break at natural pauses + punctuation,
    but never right after a 'glue' word (keeps 'thời gian', 'khóa học' together).
    Shorter lines (max 4) read cleaner and fit the frame without overflow.
    Applies CAPTION_LEAD_MS to compensate transcript timestamp lag."""
    # shift all word timestamps earlier to compensate recognition lag
    words = [{**w, "startMs": max(0, w["startMs"] - CAPTION_LEAD_MS),
              "endMs": max(0, w["endMs"] - CAPTION_LEAD_MS)} for w in words]
    groups, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        wnorm = w["text"].strip().lower().strip(".,!?;:")
        ends_sentence = w["text"].strip().endswith((".", "!", "?", "…", ",", ":"))
        gap_after = (words[i + 1]["startMs"] - w["endMs"]) if i + 1 < len(words) else 1e9
        natural_break = gap_after >= gap_break_ms or ends_sentence
        # don't break right after a glue word (would orphan its partner) — allow
        # going one word past max_w so 'thời|gian','khóa|học' stay together
        if wnorm in GLUE_NEXT and len(cur) <= max_w:
            continue
        if (len(cur) >= min_w and natural_break) or len(cur) >= max_w:
            groups.append(cur); cur = []
    if cur:
        groups.append(cur)

    out = []
    for group in groups:
        tokens = [{"text": x["text"], "fromMs": x["startMs"], "toMs": x["endMs"]} for x in group]
        kw = pick_keyword_idx(tokens)
        out.append({
            "text": " ".join(x["text"] for x in group),
            "startMs": group[0]["startMs"],
            "endMs": group[-1]["endMs"],
            "keywordIdx": kw,  # which token to color-highlight
            "tokens": [{"text": x["text"] + " ", "fromMs": x["startMs"], "toMs": x["endMs"]} for x in group],
        })
    return out


def build_summary_captions(words, min_dur_sec=2.2, max_dur_sec=4.2, gap_break_ms=300):
    """Hierarchical Summary Captions matching user reference image:
    - Line 1 (Header/Context): bold white
    - Line 2 (Giant Keyword Punchline): extra-bold/black uppercase with quotes “...”
    - Line 3 (Sub/Detail): italic white
    Groups words into 2.2s - 4.2s natural thought units.
    Sits directly over the bottom 30% dark blur vignette."""
    groups, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        dur = (cur[-1]["endMs"] - cur[0]["startMs"]) / 1000.0
        ends_sentence = w["text"].strip().endswith((".", "!", "?", "…", ":", ","))
        gap_after = (words[i + 1]["startMs"] - w["endMs"]) if i + 1 < len(words) else 1e9
        natural_break = gap_after >= gap_break_ms or ends_sentence

        if (dur >= min_dur_sec and natural_break) or dur >= max_dur_sec or len(cur) >= 14:
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)

    out = []
    for idx, group in enumerate(groups):
        raw_text = " ".join(x["text"] for x in group).strip()
        start_ms = group[0]["startMs"]
        end_ms = group[-1]["endMs"]

        # Bridge small gap to next group to prevent visual flicker
        if idx + 1 < len(groups):
            next_start = groups[idx + 1][0]["startMs"]
            if 0 < next_start - end_ms < 400:
                end_ms = next_start

        tokens = [{"text": x["text"], "fromMs": x["startMs"], "toMs": x["endMs"]} for x in group]
        kw_idx = pick_keyword_idx(tokens)
        words_list = [x["text"].strip() for x in group]
        clean_words = [w.strip(".,!?;:\"'…") for w in words_list]

        if kw_idx >= 0 and kw_idx < len(clean_words):
            k_start = max(0, kw_idx - (1 if kw_idx > 0 and clean_words[kw_idx - 1].lower() in GLUE_NEXT else 0))
            k_end = min(len(clean_words), kw_idx + (2 if kw_idx + 1 < len(clean_words) and clean_words[kw_idx].lower() in GLUE_NEXT else 1))
            kw_phrase = " ".join(clean_words[k_start:k_end]).upper()
            header_phrase = " ".join(words_list[:k_start]).strip(".,!?;: ")
            sub_phrase = " ".join(words_list[k_end:]).strip(".,!?;: ")
        else:
            mid = max(1, len(words_list) // 3)
            header_phrase = " ".join(words_list[:mid]).strip(".,!?;: ")
            kw_phrase = " ".join(clean_words[mid:mid * 2 + 1]).upper()
            sub_phrase = " ".join(words_list[mid * 2 + 1:]).strip(".,!?;: ")

        if kw_phrase and not (kw_phrase.startswith("“") or kw_phrase.startswith('"')):
            kw_phrase = f"“{kw_phrase}”"

        out.append({
            "text": strip_emojis(raw_text),
            "header": strip_emojis(header_phrase),
            "keyword": strip_emojis(kw_phrase),
            "sub": strip_emojis(sub_phrase),
            "startMs": start_ms,
            "endMs": end_ms,
            "tokens": [{"text": x["text"] + " ", "fromMs": x["startMs"], "toMs": x["endMs"]} for x in group],
        })
    return out


def word_anchor(graphics, words, lead_ms=150, window_ms=2500):
    """Fine-tune timing to content WITHOUT overriding the strategy's intended sec.
    The strategy pass already placed each graphic at the right moment; here we only
    nudge it to the nearest matching spoken keyword WITHIN a small window around its
    planned start (so 'bận' said 3 times snaps to the right one), then lead by a hair.
    If no keyword match nearby, the planned timing is kept as-is."""
    def norm(s): return s.lower().strip(".,!?;:\"'…")
    for g in graphics:
        if g["type"] in ("hook", "cta"):
            continue
        text = (g.get("text") or g.get("label") or "")
        keys = {norm(w) for w in text.split() if len(norm(w)) >= 3}
        planned = g["startMs"]
        best = None
        for w in words:
            if norm(w["text"]) in keys and abs(w["startMs"] - planned) <= window_ms:
                if best is None or abs(w["startMs"] - planned) < abs(best - planned):
                    best = w["startMs"]
        dur_g = g["endMs"] - g["startMs"]
        new_start = (best if best is not None else planned) - lead_ms
        g["startMs"] = max(0, int(new_start))
        g["endMs"] = g["startMs"] + dur_g
    return graphics


def dedup_overlap(graphics, dur, min_gap_ms=120, min_show_ms=1300):
    """All top-band graphics share one zone, so only ONE shows at a time. Instead of
    dropping overlaps (loses density), SHIFT each graphic to start after the previous
    one ends (+gap). Only drop if it can't fit a minimum on-screen time before the end.
    Keeps the dense plan dense while guaranteeing no stacking."""
    hook = [g for g in graphics if g["type"] == "hook"]
    cta = [g for g in graphics if g["type"] == "cta"]
    badges = [g for g in graphics if g["type"] == "number-badge"]
    rest = sorted([g for g in graphics if g["type"] not in ("hook", "cta", "number-badge")],
                  key=lambda x: x["startMs"])
    hook_end = max((h["endMs"] for h in hook), default=0)
    cta_start = min((c["startMs"] for c in cta), default=int(dur * 1000))
    kept, last_end = [], hook_end
    for g in rest:
        planned = g["startMs"]
        start = max(planned, last_end + min_gap_ms)
        dur_g = g["endMs"] - g["startMs"]
        # if shifting would push it too far from its intended (content) moment,
        # SHORTEN the previous graphic instead of drifting this one off-content
        if start - planned > 800 and kept:
            overshoot = start - planned
            shrink = min(overshoot, kept[-1]["endMs"] - kept[-1]["startMs"] - min_show_ms)
            if shrink > 0:
                kept[-1]["endMs"] -= shrink
                last_end = kept[-1]["endMs"]
                start = max(planned, last_end + min_gap_ms)
        end = start + dur_g
        if end > cta_start - min_gap_ms:
            end = cta_start - min_gap_ms
            start = end - dur_g
        if end - start < min_show_ms or start < last_end:
            continue
        g["startMs"], g["endMs"] = start, end
        kept.append(g)
        last_end = end
    out = hook + kept + badges + cta
    out.sort(key=lambda x: x["startMs"])
    return out


ALLOWED_TYPES = {"kinetic-statement", "mask-reveal", "glass-strip", "path-mark", "shape-3d",
                 "badge", "callout", "highlight-reveal", "number-counter", "progress-bar",
                 "donut-stat", "bar-stat", "glass-card", "illus-mark", "color-wipe",
                 "step-flow", "comparison", "list-reveal", "lower-third-pro",
                 "info-table", "stat-compare",
                 "premium-roadmap", "neon-icon-card", "negative-slash-card",
                 "dual-icon-cards", "diamond-label", "fullscreen-keyword",
                 # Hierarchical Headlines & Anh-sac style graphics
                 "3-tier", "stat-punch", "split-contrast", "tag-headline",
                 "grid-flat-card", "number-badge", "kinetic-pop", "staggered-lines"}
DEFAULT_DUR_MS = 1900  # default on-screen time per graphic (shorter = denser)


VALID_KIND = {"circle", "underline", "arrow"}
VALID_SHAPE = {"cube", "sphere", "torus", "diamond"}
VALID_ANCHOR = {"top", "center", "bottom"}
VALID_ILLUS = {"curved-arrow", "bracket", "circle-draw", "check", "cross", "starburst",
               "metaphor-process", "metaphor-speed", "metaphor-quality",
               "metaphor-money", "metaphor-idea"}
VALID_PREMIUM_ICON = {"course-access", "advice", "confidence", "process", "warning",
                      "progress", "video-course", "magnet", "quality", "idea"}
VALID_VISUAL_WEIGHT = {"micro", "minor", "major", "scene"}


def plan_item_to_graphic(item):
    """Convert a strategy/critique plan item (sec + type + extras) -> EDL graphic.
    Sanitizes enum fields so an LLM-invented value (e.g. kind='cross') can't break
    schema validation downstream — falls back to a sensible default."""
    t = item.get("type")
    if t not in ALLOWED_TYPES:
        return None
    start = int(float(item.get("sec", 0)) * 1000)
    dur_item = item.get("durMs") or (8500 if t in ("3-tier", "stat-punch", "split-contrast", "tag-headline") else (7000 if t in ("grid-flat-card", "number-badge") else DEFAULT_DUR_MS))
    g = {"type": t, "startMs": start, "endMs": start + dur_item,
         "text": item.get("text", "")}
    # copy headline & anh-sac specific fields
    for k in ("header", "keyword", "tag", "topText", "bottomText", "highlightWord",
              "secondaryText", "iconType"):
        if item.get(k):
            g[k] = str(item[k])
    if isinstance(item.get("numberValue"), (int, float)):
        g["numberValue"] = int(item["numberValue"])
    # enum-validated fields
    if t == "path-mark":
        g["kind"] = item.get("kind") if item.get("kind") in VALID_KIND else "underline"
    if t == "fullscreen-keyword":
        g["subtitle"] = item.get("subtitle") or item.get("sub", "")
    if t == "shape-3d":
        g["shape"] = item.get("shape") if item.get("shape") in VALID_SHAPE else "diamond"
    if t == "illus-mark":
        # circle-draw needs a real object to circle (hard to auto-place) -> default to
        # starburst/arrow which read fine in empty space
        g["illus"] = item.get("illus") if item.get("illus") in VALID_ILLUS else "starburst"
    if item.get("anchor") in VALID_ANCHOR:
        g["anchor"] = item["anchor"]
    # GROUP 1 variant flags (set by scheduler from transcript intent): warning callout
    # uses alert color; list-reveal rank highlights the top item.
    if item.get("warningMode") is True:
        g["warningMode"] = True
    if isinstance(item.get("rank"), int):
        g["rank"] = item["rank"]
    if item.get("icon") in VALID_PREMIUM_ICON:
        g["icon"] = item["icon"]
    if item.get("visualWeight") in VALID_VISUAL_WEIGHT:
        g["visualWeight"] = item["visualWeight"]
    if item.get("emphasis"):
        g["emphasis"] = str(item["emphasis"])
    # infographic data — accept items[] or fall back to splitting text
    if isinstance(item.get("items"), list) and item["items"]:
        g["items"] = [str(x) for x in item["items"]][:4]
    elif t in ("step-flow", "list-reveal", "premium-roadmap") and g.get("text"):
        # split "a | b | c" / "a - b - c" / "a, b, c" into items.
        # LLMs often emit "|" as separator; it must be handled or items can stay
        # empty and render a bad list/step graphic.
        import re
        parts = [p.strip() for p in re.split(r"\s*[|\-–,/]\s*", g["text"]) if p.strip()]
        if len(parts) >= 2:
            g["items"] = parts[:4]
    for k in ("left", "right", "subtitle", "leftLabel", "rightLabel", "unit"):
        if item.get(k):
            g[k] = str(item[k])
    for k in ("leftVal", "rightVal"):
        if isinstance(item.get(k), (int, float)):
            g[k] = float(item[k])
    # info-table rows [{k,v}]
    if t == "info-table" and isinstance(item.get("rows"), list):
        rows = [{"k": str(r.get("k", "")), "v": str(r.get("v", ""))}
                for r in item["rows"] if isinstance(r, dict)][:5]
        if rows:
            g["rows"] = rows
    # comparison/dual cards: split "A vs B" / "A | B" / "A > B" if left/right missing.
    # LLMs often emit "|"; also handle >, ->, vs/với phrasing.
    if t in ("comparison", "dual-icon-cards") and not (g.get("left") and g.get("right")) and g.get("text"):
        import re
        m = re.split(r"\s*(?:\||>|→|->|vs|VS|với|so với)\s*", g["text"])
        m = [x.strip() for x in m if x.strip()]
        if len(m) >= 2:
            g["left"], g["right"] = m[0], m[1]
        else:
            t = g["type"] = "kinetic-statement"  # single-sided "comparison" -> statement
    # numeric / text extras
    for k in ("value", "suffix", "label", "step"):
        v = item.get(k)
        if v not in (None, "", []):
            if k in ("value", "step"):
                try:
                    g[k] = float(v) if k == "value" else int(v)
                except (ValueError, TypeError):
                    continue
            else:
                g[k] = v
    # DATA-EMPTY GUARD (always runs, even with no preset): a data graphic with no real
    # numbers renders an empty/meaningless card (e.g. stat-compare → two blank "A/B" bars).
    # Demote it to a text statement rather than show junk.
    if g["type"] == "stat-compare" and not (g.get("leftVal") or g.get("rightVal")):
        g["type"] = "kinetic-statement"
    elif g["type"] in ("donut-stat", "bar-stat", "number-counter") and not g.get("value"):
        g["type"] = "kinetic-statement"
    elif g["type"] == "info-table" and not g.get("rows"):
        g["type"] = "kinetic-statement"
    elif g["type"] in ("step-flow", "list-reveal") and not g.get("items"):
        # no list items parsed → renders an empty list; fall back to a text statement
        g["type"] = "kinetic-statement"
    elif g["type"] == "comparison" and not (g.get("left") and g.get("right")):
        g["type"] = "kinetic-statement"
    elif g["type"] == "premium-roadmap" and not g.get("items"):
        g["type"] = "step-flow"
    elif g["type"] == "dual-icon-cards" and not (g.get("left") and g.get("right")):
        g["type"] = "neon-icon-card"
    # em/en dashes are an AI-writing tell — never show them on screen
    for k, v in list(g.items()):
        if isinstance(v, str):
            g[k] = v.replace("—", "-").replace("–", "-")
    if isinstance(g.get("items"), list):
        g["items"] = [s.replace("—", "-").replace("–", "-") if isinstance(s, str) else s
                      for s in g["items"]]
    return g


def auto_pick_bgm(transcript_text, theme_key="sunset", preset="thuy-style-oneshot"):
    """
    Select appropriate BGM from public/bgm based on text keywords, theme and preset.
    Returns relative path to public/ (e.g. 'bgm/02_giao_duc_kien_thuc/Kendrick Lamar - Not Like Us (Instrumental).mp3')
    """
    text_lower = (transcript_text or "").lower()

    # Category 1: Emotional Storytelling
    cat1_keywords = ["tâm sự", "kỷ niệm", "ngày xưa", "bài học", "cảm xúc", "nỗi buồn", "trải nghiệm", "thất bại", "chia tay", "gia đình", "bạn bè", "hối tiếc", "nhận ra", "cuộc đời", "tuổi trẻ", "quá khứ", "nước mắt", "cô đơn"]
    cat1_score = sum(1 for kw in cat1_keywords if kw in text_lower)

    # Category 2: Educational / Knowledge / Tech
    cat2_keywords = ["hướng dẫn", "cách làm", "bí quyết", "mẹo", "tips", "công cụ", "ai", "chatgpt", "lập trình", "kiếm tiền", "kinh doanh", "marketing", "sai lầm", "chiến lược", "tư duy", "hiệu suất", "quy trình", "tự động hóa", "kênh", "video", "editor", "bí mật", "phương pháp", "thực chiến"]
    cat2_score = sum(1 for kw in cat2_keywords if kw in text_lower)

    # Category 3: Vlog / Day in life
    cat3_keywords = ["một ngày", "hôm nay", "du lịch", "cafe", "ăn uống", "unboxing", "outfit", "dạo phố", "vlog", "thói quen", "cuối tuần", "chill", "đi chơi", "buổi sáng"]
    cat3_score = sum(1 for kw in cat3_keywords if kw in text_lower)

    # Category 4: Motivation / Energy / Success
    cat4_keywords = ["thành công", "kỷ luật", "cố gắng", "nỗ lực", "dậy sớm", "không từ bỏ", "thay đổi", "động lực", "tập luyện", "thể thao", "gym", "kiên trì", "mục tiêu", "bứt phá", "chiến thắng", "quyết tâm"]
    cat4_score = sum(1 for kw in cat4_keywords if kw in text_lower)

    scores = {
        "01_ke_chuyen_cam_xuc": cat1_score,
        "02_giao_duc_kien_thuc": cat2_score,
        "03_vlog_day_in_life": cat3_score,
        "04_dong_luc_cam_xuc": cat4_score
    }

    best_cat = max(scores, key=scores.get)
    if scores[best_cat] == 0:
        if preset == "anh-sac-podcast":
            best_cat = "02_giao_duc_kien_thuc"
        elif theme_key in ("synthwave", "cyber", "punch"):
            best_cat = "04_dong_luc_cam_xuc"
        elif theme_key in ("fresh", "bloom"):
            best_cat = "03_vlog_day_in_life"
        else:
            best_cat = "02_giao_duc_kien_thuc"

    category_defaults = {
        "01_ke_chuyen_cam_xuc": "bgm/01_ke_chuyen_cam_xuc/Gibran Alcocer - Idea 15.mp3",
        "02_giao_duc_kien_thuc": "bgm/02_giao_duc_kien_thuc/Kendrick Lamar - Not Like Us (Instrumental).mp3",
        "03_vlog_day_in_life": "bgm/03_vlog_day_in_life/Arctic Monkeys - I Wanna Be Yours (Instrumental).mp3",
        "04_dong_luc_cam_xuc": "bgm/04_dong_luc_cam_xuc/VOJ & Narvent - Memory Reboot.mp3",
    }
    return category_defaults.get(best_cat, "bgm/02_giao_duc_kien_thuc/Kendrick Lamar - Not Like Us (Instrumental).mp3")


def main():
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import edl_passes as ep
    ap = argparse.ArgumentParser()
    ap.add_argument("--clip", default="raw/talkinghead.mp4")
    ap.add_argument("--preset", default="thuy-style-oneshot", choices=["thuy-style-oneshot", "thuy-style-nhieu-canh", "classic", "anh-sac-podcast"],
                    help="Editing style preset to use.")
    ap.add_argument("--model", default="local", help="reserved for local CLI providers")
    ap.add_argument("--llm", default="offline", choices=["claude-cli", "offline", "prefed"],
                    help="local LLM provider. 'prefed' reads reasoning from a host-written "
                         "plan file (--plan) instead of spawning any CLI — used when the host "
                         "The active Codex agent does the 4 passes. Missing passes fall back to offline.")
    ap.add_argument("--plan", default=None,
                    help="path to host-written reasoning JSON {analysis, strategy, critique} "
                         "for --llm prefed (default: <out-dir>/host-plan.json)")
    ap.add_argument("--smart", action="store_true",
                    help="multimodal analyze + pro model + loop critique (slower, smarter)")
    ap.add_argument("--force-regen", action="store_true",
                    help="overwrite edl.json even if it exists (discards manual edits)")
    ap.add_argument("--bgm", default="auto",
                    help="background music relative path under public/, 'auto' to choose by theme/text, or 'none' to disable")
    ap.add_argument("--bgm-volume", type=float, default=0.08,
                    help="BGM volume (default: 0.08 for talking-head)")
    ap.add_argument("--no-bgm", action="store_true",
                    help="disable background music completely")
    ap.add_argument("--out-dir", default=str(OUT))
    ap.add_argument("--public-dir", default=str(PUBLIC))
    a = ap.parse_args()
    
    try:
        preset_config = json.loads((ROOT / "scripts" / "presets.json").read_text(encoding="utf-8"))
    except Exception:
        preset_config = {}
    out_dir = Path(a.out_dir)
    public_dir = Path(a.public_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    transcript = json.loads((out_dir / "transcript.json").read_text(encoding="utf-8"))
    words = transcript["words"]
    dur = transcript["durationSec"]
    full_text = " ".join(w["text"] for w in words)

    # 'prefed' mode: load host reasoning plan first so all passes can use it
    host_plan = {}
    if a.llm == "prefed":
        plan_path = Path(a.plan) if a.plan else (out_dir / "host-plan.json")
        try:
            host_plan = json.loads(plan_path.read_text(encoding="utf-8"))
            print("      prefed: loaded host reasoning <- %s" % plan_path)
        except (OSError, json.JSONDecodeError) as e:
            print("      prefed: no usable plan (%s) -> offline fallback for all passes"
                  % type(e).__name__)
            host_plan = {}

    # Recipe & Theme preparation
    theme_key = "anh-sac" if a.preset == "anh-sac-podcast" else "sunset"
    if a.llm == "offline" and a.preset != "anh-sac-podcast":
        from local_llm import offline_analyze, offline_strategy
        theme_key = offline_strategy(offline_analyze(full_text, dur), dur).get("theme", "sunset")
    elif a.llm == "prefed" and host_plan.get("strategy"):
        theme_key = host_plan["strategy"].get("theme", theme_key)

    # Hierarchical Summary Captions (default) vs Karaoke
    if host_plan.get("summaryCaptions"):
        captions = host_plan["summaryCaptions"]
    else:
        if a.preset == "classic":
            captions = build_captions(words)
        else:
            captions = build_summary_captions(words, dur)

    # detect clip orientation (9:16 vertical vs 16:9 horizontal) via ffprobe
    import subprocess
    fmt_w, fmt_h = 1080, 1920
    try:
        clip_abs = public_dir / a.clip
        probe = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height", "-of", "csv=p=0", str(clip_abs)],
            capture_output=True, text=True, timeout=30)
        cw, ch = (int(x) for x in probe.stdout.strip().split(","))
        if cw > ch:  # horizontal source -> 16:9 output
            fmt_w, fmt_h = 1920, 1080
    except Exception:
        pass
    call = make_llm_call(a.llm, a.model)
    # tiered models: deep reasoning passes use pro, mechanical critique uses flash
    PRO = a.model
    FLASH = a.model

    # Claude CLI path is text-only here. Visual analysis remains local/precomputed.
    video_parts = None

    # ---- MULTI-PASS REASONING (editor thinks before building) ----
    from local_llm import offline_analyze, offline_strategy, offline_critique
    print("[1/4] Analyze%s..." % (" (multimodal)" if video_parts else ""))
    if a.llm == "offline":
        analysis = offline_analyze(full_text, dur)
    elif a.llm == "prefed":
        analysis = host_plan.get("analysis") or offline_analyze(full_text, dur)
    else:
        try:
            analysis = ep.pass_analyze(call, full_text, dur, PRO, video_parts=video_parts)
        except Exception as e:
            print("      local/pro pass failed (%s), fallback flash/text pass" % type(e).__name__)
            analysis = ep.pass_analyze(call, full_text, dur, FLASH)
    mood = analysis.get("mood", "nang luong")
    print("      topic=%s | mood=%s | face=%s | segments=%d keyMoments=%d" % (
        str(analysis.get("topic", "?"))[:46], mood, analysis.get("facePosition", "?"),
        len(analysis.get("segments", [])), len(analysis.get("keyMoments", []))))

    print("[2/4] Strategy / edit plan...")
    if a.llm == "offline":
        strat = offline_strategy(analysis, dur)
    elif a.llm == "prefed":
        strat = host_plan.get("strategy") or offline_strategy(analysis, dur)
    else:
        preset_data = preset_config.get(a.preset)
        strat = ep.pass_strategy(call, analysis, dur, mood, model=PRO, preset=preset_data, preset_name=a.preset)
    theme = THEMES.get(strat.get("theme", "sunset"), THEMES["sunset"])
    plan_items = strat.get("plan", [])
    # NOTE: vocabulary filter DISABLED (user prefers dense visuals like v7).
    # Strategy still suggests a vocabulary for consistency, but we don't hard-cut to it.
    print("      theme=%s | planned graphics=%d" % (strat.get("theme"), len(plan_items)))

    print("[3/4] Critique / self-review (loop)...")
    kept = list(plan_items)
    rounds = 3 if a.smart else 1
    crit = {"drop": [], "add": [], "notes": ""}
    for r in range(rounds):
        if a.llm == "offline":
            crit = offline_critique(kept, dur, analysis)
        elif a.llm == "prefed":
            # host already self-critiqued while writing the plan; apply an explicit
            # critique block if provided, else treat the plan as final (no changes).
            crit = host_plan.get("critique") or {"drop": [], "add": [], "notes": "prefed: host plan is final"}
        else:
            crit = ep.pass_critique(call, kept, dur, FLASH, analysis=analysis)
        drop = set(crit.get("drop", []))
        add = crit.get("add", [])
        kept = [it for i, it in enumerate(kept) if i not in drop] + add
        print("      round %d: dropped=%d added=%d -> %d" % (r + 1, len(drop), len(add), len(kept)))
        if not drop and not add:
            break  # converged — clean

    print("[4/4] Compose EDL...")
    segs = analysis.get("segments", [])
    def clamp_words(s, max_chars):
        """Trim to <=max_chars WITHOUT cutting mid-word."""
        s = s.strip()
        if len(s) <= max_chars:
            return s
        out = []
        for w in s.split():
            if sum(len(x) + 1 for x in out) + len(w) > max_chars:
                break
            out.append(w)
        return " ".join(out) if out else s[:max_chars]

    # prefer explicit hookText/ctaText from strategy if present, else segment gist
    hook_text = strat.get("hookText") or next((s["gist"] for s in segs if s.get("label") == "hook"), analysis.get("topic", "XEM NGAY"))
    cta_text = strat.get("ctaText") or next((s["gist"] for s in segs if s.get("label") == "cta"), "THEO DÕI ĐỂ XEM THÊM")
    hook_text = hook_text.replace("—", "-").replace("–", "-")
    cta_text = cta_text.replace("—", "-").replace("–", "-")
    graphics = [
        {"type": "hook", "text": clamp_words(hook_text.upper(), 40), "startMs": 0, "endMs": 3000},
        {"type": "cta", "text": clamp_words(cta_text.upper(), 28), "startMs": int(dur * 1000) - 3000, "endMs": int(dur * 1000)},
    ]
    for it in kept:
        g = plan_item_to_graphic(it)
        if g:
            graphics.append(g)

    zooms = []
    for s in segs:
        if s.get("energy") == "high" and "startSec" in s:
            z0 = int(s["startSec"] * 1000)
            # GAP C: scale capped at 1.1 (constraint ≤1.12)
            zooms.append({"type": "punch-in", "startMs": z0, "endMs": z0 + 2000, "scale": 1.1})

    CAPCUT_TRANSITION_MAP = {
        "glare-ii": {"durationMs": 533, "sound": "glare-burn", "volume": 0.90, "direction": "right"},
        "phone-reveal": {"durationMs": 733, "sound": "phone-shutter-1", "volume": 0.95, "direction": "right"},
        "paper-ball": {"durationMs": 667, "sound": "paper-ball-yt", "volume": 0.95, "direction": "right"},
        "glitch": {"durationMs": 467, "sound": "glitch-cut", "volume": 0.85, "direction": "right"},
        "fade-down": {"durationMs": 467, "sound": "fade-woosh", "volume": 0.90, "direction": "down"},
        "blink": {"durationMs": 267, "sound": "click", "volume": 0.95, "direction": "right"},
        "wave-right": {"durationMs": 533, "sound": "wave-sparkle", "volume": 0.90, "direction": "right"},
        "swipe-left": {"durationMs": 333, "sound": "whoosh-fast", "volume": 0.95, "direction": "left"},
        "comic-cut": {"durationMs": 667, "sound": "comic-paper-tear", "volume": 0.95, "direction": "right"},
    }

    # Section transitions: light zoom + diverse viral transition at genuine label changes.
    # Accepts host_plan["transitions"] when supplied, else rotates 2-3 consistent transitions.
    transitions = []
    if host_plan.get("transitions"):
        transitions = host_plan["transitions"]
        # sanitize directions (never allow 'center')
        for t in transitions:
            if t.get("direction") not in ("up", "down", "left", "right"):
                t["direction"] = "right"
    else:
        if a.preset == "anh-sac-podcast":
            TRANSITION_PALETTE = ["debris-shatter", "quick-cut", "color-flash", "swipe-left"]
        elif a.preset in ("thuy-style-nhieu-canh", "thuy-style-oneshot"):
            TRANSITION_PALETTE = ["phone-reveal", "paper-ball", "comic-cut", "glare-ii", "wave-right", "glitch", "fade-down", "blink", "swipe-left"]
        else:
            TRANSITION_PALETTE = ["zoom-blur", "whip-pan", "swipe-left", "color-flash", "mask-circle"]
        prev_label = None
        section_zooms_added = 0
        _last_section_ms = -99999
        for s in segs:
            lbl = s.get("label")
            start_ms = int(s.get("startSec", 0) * 1000)
            if (lbl and lbl != prev_label and prev_label is not None
                    and section_zooms_added < 3
                    and start_ms - _last_section_ms >= 8000):
                zooms.append({"type": "punch-in", "startMs": start_ms, "endMs": start_ms + 1500, "scale": 1.08})
                t_type = TRANSITION_PALETTE[section_zooms_added % len(TRANSITION_PALETTE)]
                cfg = CAPCUT_TRANSITION_MAP.get(t_type)
                t_dur = cfg["durationMs"] if cfg else 620
                t_dir = cfg["direction"] if cfg else ("left" if t_type in ("swipe-left", "whip-pan") else "up")
                t_start = max(0, start_ms - t_dur // 2)
                transitions.append({
                    "type": t_type,
                    "startMs": t_start,
                    "endMs": t_start + t_dur,
                    "intensity": 1.0,
                    "direction": t_dir,
                    "colorRole": "accent" if section_zooms_added % 2 == 0 else "accent2",
                })
                section_zooms_added += 1
                _last_section_ms = start_ms
            prev_label = lbl

    # cap illus-mark to avoid the "random circles/effects everywhere" feel.
    # Drop circle-draw (needs a real object to wrap) + starburst (reads as a stray
    # decorative ring with no meaning). Cap the rest at 2 — METAPHOR illus are exempt
    # from this cap (they're semantic, gated separately to max 6).
    illus_kept = 0
    pruned = []
    for g in graphics:
        if g["type"] == "illus-mark":
            illus = g.get("illus", "")
            is_metaphor = isinstance(illus, str) and illus.startswith("metaphor-")
            if not is_metaphor and (illus in ("circle-draw", "starburst") or illus_kept >= 2):
                continue  # drop stray decorative mark (no semantic content)
            if not is_metaphor:
                illus_kept += 1
        pruned.append(g)
    graphics = pruned

    # Inject 1-2 B-rolls / Graphic Cards if not already in graphics
    if a.preset == "anh-sac-podcast":
        broll_count = sum(1 for g in graphics if g.get("type") in ("grid-flat-card", "fullscreen-keyword"))
        if broll_count == 0 and dur >= 15:
            b1_ms = int(dur * 0.35 * 1000)
            b2_ms = int(dur * 0.72 * 1000)
            km1 = min(analysis.get("keyMoments", []), key=lambda k: abs(k.get("sec", 0) * 1000 - b1_ms), default=None)
            km2 = min(analysis.get("keyMoments", []), key=lambda k: abs(k.get("sec", 0) * 1000 - b2_ms), default=None)
            graphics.append({
                "type": "grid-flat-card",
                "startMs": b1_ms,
                "endMs": b1_ms + 2600,
                "text": (km1.get("keyword") if km1 else "MỚI XÂY KÊNH").upper(),
                "secondaryText": "Tối ưu góc quay",
                "iconType": "crane",
                "bottomText": "TÌNH HUỐNG ẤY HÃY ĐẶT THÊM NHIỀU GÓC QUAY",
            })
            if dur >= 28:
                graphics.append({
                    "type": "grid-flat-card",
                    "startMs": b2_ms,
                    "endMs": b2_ms + 2600,
                    "text": (km2.get("keyword") if km2 else "THIẾU SOUND EFFECT").upper(),
                    "secondaryText": "Sound effect",
                    "iconType": "audio-wave",
                    "bottomText": "THAY VÌ CHỈ ĐỂ ÂM THANH GỐC",
                })
    elif a.preset != "classic":
        broll_kw_count = sum(1 for g in graphics if g.get("type") == "fullscreen-keyword")
        if broll_kw_count == 0 and dur >= 15:
            # B-roll 1 around 30-38% duration
            b1_ms = int(dur * 0.35 * 1000)
            # B-roll 2 around 68-75% duration
            b2_ms = int(dur * 0.72 * 1000)
            km1 = min(analysis.get("keyMoments", []), key=lambda k: abs(k.get("sec", 0) * 1000 - b1_ms), default=None)
            km2 = min(analysis.get("keyMoments", []), key=lambda k: abs(k.get("sec", 0) * 1000 - b2_ms), default=None)
            broll_depth_variants = [
                "dark-gradient", "dark-brick", "grid-caro", "radial-navy",
                "concrete-grunge", "carbon-mesh", "paper-crumpled-black", "lens-bokeh"
            ]
            import random
            v1 = random.choice(broll_depth_variants)
            v2 = random.choice([v for v in broll_depth_variants if v != v1])
            graphics.append({
                "type": "fullscreen-keyword",
                "startMs": b1_ms,
                "endMs": b1_ms + 2300,
                "text": (km1.get("keyword") if km1 else "CẮT BỎ KHOẢNG LẶNG").upper(),
                "subtitle": "Tự động loại bỏ dead air",
                "bgVariant": v1,
            })
            if dur >= 28:
                graphics.append({
                    "type": "fullscreen-keyword",
                    "startMs": b2_ms,
                    "endMs": b2_ms + 2300,
                    "text": (km2.get("keyword") if km2 else "GIỮ TRỌN NỘI DUNG").upper(),
                    "subtitle": "Chỉ giữ lại ý chính",
                    "bgVariant": v2,
                })

    graphics = word_anchor(graphics, words)
    graphics.sort(key=lambda x: x["startMs"])
    graphics = dedup_overlap(graphics, dur)

    # === SENTENCE-COMPLETION VISUAL BEATS HEALER (HARD-LOCKED) ===
    # Detect any speech gap > 4500ms without visual event (graphics, broll, transitions)
    # and automatically generate semantic visual beat based on sentence intent.
    if a.preset in ("thuy-style-nhieu-canh", "thuy-style-oneshot"):
        all_visuals = [(g["startMs"], g["endMs"]) for g in graphics]
        all_visuals += [(b.get("startMs", 0), b.get("endMs", 0)) for b in host_plan.get("broll", [])]
        all_visuals += [(t.get("startMs", 0), t.get("endMs", 0)) for t in transitions]
        all_visuals.sort(key=lambda x: x[0])

        merged_vis = []
        for s_v, e_v in all_visuals:
            if not merged_vis:
                merged_vis.append([s_v, e_v])
            else:
                if s_v <= merged_vis[-1][1] + 300:
                    merged_vis[-1][1] = max(merged_vis[-1][1], e_v)
                else:
                    merged_vis.append([s_v, e_v])

        filler_graphics = []
        for i in range(len(merged_vis) - 1):
            g_start = merged_vis[i][1]
            g_end = merged_vis[i+1][0]
            if g_end - g_start > 4500:
                gap_words = [w for w in words if w["startMs"] >= g_start - 200 and w["endMs"] <= g_end + 200]
                if len(gap_words) >= 6:
                    sentence_text = " ".join(w["text"] for w in gap_words)
                    s_lower = sentence_text.lower()
                    mid_idx = len(gap_words) // 2
                    w_anchor = gap_words[mid_idx]
                    kw_start = w_anchor["startMs"]
                    f_start = gap_words[0]["startMs"]
                    f_end = min(g_end - 200, f_start + 3600)

                    # Semantic intent analysis
                    import re
                    digits = re.findall(r"\d+", sentence_text)
                    if digits or any(k in s_lower for k in ("nghị định", "quy định", "tiêu chí", "yếu tố", "lần")):
                        val = int(digits[0]) if digits else 1
                        filler_graphics.append({
                            "type": "stat-punch",
                            "startMs": f_start,
                            "endMs": f_end,
                            "header": "TIÊU CHUẨN ĐỊNH LƯỢNG",
                            "keyword": clamp_words(sentence_text.upper(), 32),
                            "sub": "Lưu ý quan trọng cần nhớ",
                            "value": val,
                            "keywordStartMs": kw_start,
                            "anchor": "top",
                        })
                    elif any(k in s_lower for k in ("nhưng", "đừng", "tưởng", "trước", "bây giờ", "sai lầm", "rẻ", "lỗ")):
                        filler_graphics.append({
                            "type": "split-contrast",
                            "startMs": f_start,
                            "endMs": f_end,
                            "header": "CẢNH BÁO RỦI RO",
                            "topText": "CẨN TRỌNG THỰC TẾ",
                            "bottomText": clamp_words(sentence_text.upper(), 28),
                            "keyword": clamp_words(sentence_text.upper(), 28),
                            "sub": "Đừng vội vàng quyết định",
                            "keywordStartMs": kw_start,
                            "anchor": "top",
                        })
                    else:
                        filler_graphics.append({
                            "type": "asymmetric-trio",
                            "startMs": f_start,
                            "endMs": f_end,
                            "header": "LƯU Ý CỐT LÕI",
                            "sub": "thực tế",
                            "keyword": clamp_words(w_anchor["text"].upper(), 20),
                            "keywordStartMs": kw_start,
                            "anchor": "top",
                        })
        if filler_graphics:
            graphics.extend(filler_graphics)
            graphics.sort(key=lambda x: x["startMs"])
            graphics = dedup_overlap(graphics, dur)

    # face-aware layout: where is the speaker? -> place graphics in the free zone
    face_zone, face_cy = "top", 32.0
    fz_path = out_dir / "face-zones.json"
    if fz_path.exists():
        fz = json.loads(fz_path.read_text(encoding="utf-8"))
        face_zone = fz.get("dominantFreeZone", "top")
        face_cy = fz.get("avgFaceCenterYPct", 32.0)

    recipe = default_recipe()
    # merge EVERY recipe token the theme defines (material, motion, typography) —
    # previously only 4 color fields flowed through, so all themes rendered with
    # identical v7 material and "theme" meant nothing but palette
    theme_key = strat.get("theme", "sunset")
    for k, v in THEME_TOKENS.get(theme_key, {}).items():
        recipe[k] = v
    recipe["accent"] = theme["accent"]
    recipe["accent2"] = theme["accent2"]
    recipe["highlightColor"] = theme["highlight"]
    recipe["captionColor"] = theme["caption"]

    recipe["preset"] = a.preset
    recipe["captionStyle"] = "karaoke" if a.preset == "classic" else "summary"

    edl = {
        "source": {"clip": a.clip, "durationSec": dur},
        "format": {"w": fmt_w, "h": fmt_h, "fps": 30},
        "style": {
            "captionColor": theme["caption"], "highlightColor": theme["highlight"],
            "accent": theme["accent"], "accent2": theme["accent2"],
            "baseScale": 1.0, "baseShiftYPct": 0,
            "maskBandTopPct": 0, "maskBandHeightPct": 0,
            "freeZone": face_zone, "faceCenterYPct": face_cy,
            "ambient": strat.get("ambient", "sparkles") if strat.get("ambient") in ("none", "sparkles", "ring", "both") else "sparkles",
            "recipe": recipe,
        },
        "tracks": {
            "captions": captions,
            "effects": zooms,
            "transitions": transitions,
            "graphics": graphics,
            "sfx": (
                [
                    {"startMs": g["startMs"], "sound": "whoosh-fast", "volume": 0.7, "priority": 1, "preRollMs": 65}
                    for g in graphics if g.get("type") == "fullscreen-keyword"
                ]
                + host_plan.get("sfx", [])
                + [
                    {
                        "startMs": t["startMs"],
                        "sound": CAPCUT_TRANSITION_MAP[t["type"]]["sound"],
                        "volume": CAPCUT_TRANSITION_MAP[t["type"]]["volume"],
                        "priority": 1,
                        "preRollMs": 0,
                    }
                    for t in transitions
                    if t.get("type") in CAPCUT_TRANSITION_MAP
                    and not any(s.get("sound") == CAPCUT_TRANSITION_MAP[t["type"]]["sound"] and abs(s.get("startMs", 0) - t["startMs"]) <= 120 for s in host_plan.get("sfx", []))
                ]
            ),
            "broll": host_plan.get("broll", []),
        },
    }

    # Background music (BGM) handling
    bgm_obj = None
    if not a.no_bgm and a.bgm not in ("none", "off", "no"):
        if host_plan.get("music"):
            bgm_obj = host_plan["music"]
        elif a.bgm and a.bgm != "auto":
            bgm_src = a.bgm.replace("\\", "/")
            if bgm_src.startswith("public/"):
                bgm_src = bgm_src[len("public/"):]
            bgm_obj = {
                "src": bgm_src,
                "volume": a.bgm_volume,
                "clipVolume": 1.0,
                "loop": True,
                "startSec": 0,
                "fadeOutSec": 2.0,
            }
        else:
            auto_track = auto_pick_bgm(full_text, theme_key, a.preset)
            if auto_track and (public_dir / auto_track).exists():
                bgm_obj = {
                    "src": auto_track,
                    "volume": a.bgm_volume,
                    "clipVolume": 1.0,
                    "loop": True,
                    "startSec": 0,
                    "fadeOutSec": 2.0,
                }
                print(f"      bgm: auto-selected soundtrack -> {auto_track} (vol={a.bgm_volume})")

    if bgm_obj:
        edl["music"] = bgm_obj

    # machine output always goes to edl.generated.json; edl.json is the editor's
    # working copy — only overwritten when it carries no manual edits (i.e. it
    # still matches the previous generated output) or with --force-regen
    if a.preset != "classic":
        edl = strip_emojis_recursive(edl)
    edl_text = json.dumps(edl, ensure_ascii=False, indent=2)
    generated_path = out_dir / "edl.generated.json"
    working_path = out_dir / "edl.json"
    prev_generated = generated_path.read_text(encoding="utf-8") if generated_path.exists() else None
    working_text = working_path.read_text(encoding="utf-8") if working_path.exists() else None
    generated_path.write_text(edl_text, encoding="utf-8")
    untouched = working_text is None or working_text == prev_generated
    if untouched or a.force_regen:
        working_path.write_text(edl_text, encoding="utf-8")
    else:
        print(f"CANH BAO: {working_path.name} co chinh sua tay — giu nguyen.")
        print(f"  Ban may sinh moi nam o {generated_path.name}. Dung --force-regen de ghi de edl.json.")
    (out_dir / "edit-plan.json").write_text(
        json.dumps({"analysis": analysis, "strategy": strat, "critique": crit}, ensure_ascii=False, indent=2),
        encoding="utf-8")
    print(f"OK -> {generated_path}  (reasoning: {out_dir / 'edit-plan.json'})")
    print("  theme=%s captions=%d zooms=%d transitions=%d graphics=%d" % (
        strat.get("theme"), len(captions), len(zooms), len(transitions), len(graphics)))


if __name__ == "__main__":
    main()
