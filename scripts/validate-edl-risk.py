"""
EDL risk validator — catches common render/visual problems before Remotion render.

This is not a schema validator. Zod already validates shape at render time. This
script checks editorial/render risks that still pass schema:
  - overlapping non-transition graphics
  - data visuals without data
  - text likely too long for fixed-format components
  - missing sourceClip files for embedded mockup scenes
  - very sparse transitions or SFX candidates

Usage:
  python scripts/validate-edl-risk.py out/edl.json
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

TRANSITION_TYPES = {"color-wipe"}
STRUCTURAL_TYPES = {"hook", "cta"}
DATA_TYPES = {"number-counter", "donut-stat", "bar-stat", "stat-compare", "info-table"}
ITEM_TYPES = {"step-flow", "list-reveal", "premium-roadmap"}
COMPARE_TYPES = {"comparison", "dual-icon-cards"}
HEADLINE_TYPES = {"asymmetric-trio", "stacked-contrast", "multiblock-flow", "3-tier", "split-contrast", "stat-punch", "tag-headline", "glow-ambient"}
SFX_TYPES = {
    "hook", "cta", "kinetic", "lower-third", "color-wipe", "kinetic-statement",
    "mask-reveal", "glass-strip", "badge", "callout", "highlight-reveal",
    "number-counter", "donut-stat", "bar-stat", "progress-bar", "glass-card",
    "step-flow", "comparison", "list-reveal", "lower-third-pro", "info-table",
    "stat-compare", "illus-mark", "path-mark", "shape-3d", "premium-roadmap",
    "neon-icon-card", "negative-slash-card", "dual-icon-cards", "diamond-label",
    "ad-comparison-scene",
}


def ms(sec):
    return int(sec * 1000)


def warn(out, code, message):
    out.append({"code": code, "message": message})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("edl")
    ap.add_argument("--public-dir", default=str(PUBLIC))
    a = ap.parse_args()

    edl_path = Path(a.edl)
    public_dir = Path(a.public_dir)
    edl = json.loads(edl_path.read_text(encoding="utf-8"))
    tracks = edl.get("tracks", {})
    graphics = sorted(tracks.get("graphics", []), key=lambda g: g.get("startMs", 0))
    transitions = sorted(tracks.get("transitions", []), key=lambda t: t.get("startMs", 0))
    explicit_sfx = tracks.get("sfx", [])
    captions = tracks.get("captions", [])
    duration_ms = ms(float(edl.get("source", {}).get("durationSec", 0)))
    warnings = []

    body = [g for g in graphics if g.get("type") not in STRUCTURAL_TYPES | TRANSITION_TYPES]
    for prev, cur in zip(body, body[1:]):
        if cur.get("startMs", 0) < prev.get("endMs", 0) - 80:
            warn(
                warnings,
                "graphic-overlap",
                f"{prev.get('type')}@{prev.get('startMs')} overlaps {cur.get('type')}@{cur.get('startMs')}",
            )

    for g in graphics:
        t = g.get("type")
        txt = str(g.get("text", "") or "")
        if len(txt) > 52 and t in {"badge", "diamond-label", "highlight-reveal", "negative-slash-card"}:
            warn(warnings, "text-too-long", f"{t}@{g.get('startMs')} has {len(txt)} chars")
        if t in DATA_TYPES:
            has_data = bool(g.get("value") or g.get("rows") or g.get("leftVal") or g.get("rightVal"))
            if not has_data:
                warn(warnings, "data-empty", f"{t}@{g.get('startMs')} has no usable data")
        if t in ITEM_TYPES and not g.get("items"):
            warn(warnings, "items-empty", f"{t}@{g.get('startMs')} has no items")
        if t in COMPARE_TYPES and not (g.get("left") and g.get("right")):
            warn(warnings, "compare-incomplete", f"{t}@{g.get('startMs')} lacks left/right")
        if g.get("sourceClip"):
            clip = Path(str(g["sourceClip"]))
            if not clip.is_absolute():
                clip = public_dir / clip
            if not clip.exists():
                warn(warnings, "sourceclip-missing", f"{t}@{g.get('startMs')} missing {g['sourceClip']}")
        if g.get("endMs", 0) > duration_ms + 100:
            warn(warnings, "beyond-duration", f"{t}@{g.get('startMs')} ends after source duration")

    legacy_transition_count = sum(1 for g in graphics if g.get("type") in TRANSITION_TYPES)
    transition_count = len(transitions) + legacy_transition_count
    if duration_ms >= 30000 and transition_count == 0:
        warn(warnings, "no-transitions", "No transition graphics in a 30s+ EDL")

    sfx_candidates = len(explicit_sfx) or (
        sum(1 for g in graphics if g.get("type") in SFX_TYPES)
        + sum(1 for t in transitions if t.get("type") in SFX_TYPES)
    )
    event_count = len(graphics) + len(transitions)
    if event_count and sfx_candidates / event_count < 0.65:
        warn(warnings, "sfx-low-coverage", f"SFX mapping covers {sfx_candidates}/{event_count} events")

    if captions:
        long_caps = [c for c in captions if len(str(c.get("text", ""))) > 34]
        if long_caps:
            warn(warnings, "caption-long", f"{len(long_caps)} captions exceed 34 chars")
        
        # Check Vietnamese orthography for common Whisper errors
        vi_typos = ["thỏ mái", "đắt lực", "ông kinh", "ông Kinh", "mít ro", "hoặc máy", "chằm âm", "khoác học", "canh chị"]
        for i, c in enumerate(captions):
            txt = str(c.get("text", "")).lower()
            for typo in vi_typos:
                if typo.lower() in txt:
                    warn(warnings, "vietnamese-spelling-error", f"Caption {i} contains Whisper typo '{typo}': {c.get('text')}")
            
            # Check token vs word consistency
            words = c.get("text", "").split()
            tokens = c.get("tokens", [])
            if tokens and len(words) != len(tokens):
                warn(warnings, "token-word-mismatch", f"Caption {i} word count ({len(words)}) != token count ({len(tokens)})")


    # Check Locked Relative Audio Ratios (BGM / Voice & SFX / Voice)
    voice_vol = float(edl.get("source", {}).get("volume", 1.0))
    music = edl.get("music") or tracks.get("music")
    if music:
        bgm_vol = float(music.get("volume", 0))
        bgm_ratio = bgm_vol / voice_vol if voice_vol > 0 else bgm_vol
        if bgm_ratio > 0.09:
            warn(warnings, "bgm-voice-ratio-too-high",
                 f"BGM/Voice ratio ({bgm_ratio:.3f}) exceeds max allowed ratio 0.09 (BGM: {bgm_vol}, Voice: {voice_vol}). "
                 f"Must lock BGM to 0.05-0.08 of Voice volume (recommended BGM: {voice_vol * 0.06:.3f}).")
        elif bgm_vol > 0 and bgm_ratio < 0.03 and not music.get("disabled"):
            warn(warnings, "bgm-voice-ratio-too-quiet",
                 f"BGM/Voice ratio ({bgm_ratio:.3f}) is inaudible (< 0.03). Keep in 0.05-0.08 range.")

    for s in explicit_sfx:
        s_vol = float(s.get("volume", 0.5))
        if s_vol > voice_vol * 0.90:
            warn(warnings, "sfx-louder-than-voice",
                 f"SFX '{s.get('sound')}' volume ({s_vol}) exceeds 0.90x Voice volume ({voice_vol}). Keep under 0.85x.")

    # Check Headline Two-Phase in timing
    for g in graphics:
        t = g.get("type")
        if t in HEADLINE_TYPES:
            kw_ms = g.get("keywordStartMs")
            if kw_ms is None:
                warn(warnings, "headline-missing-keyword-timing", f"Headline {t}@{g.get('startMs')} lacks 'keywordStartMs'. Two-Phase dynamic reveal requires keyword onset timestamp.")
            elif kw_ms < g.get("startMs", 0) or kw_ms > g.get("endMs", 0):
                warn(warnings, "headline-keyword-timing-out-of-range", f"Headline {t}@{g.get('startMs')} keywordStartMs ({kw_ms}) is outside [{g.get('startMs')}, {g.get('endMs')}].")

    # Check Caption constraints
    if captions:
        for i, c in enumerate(captions):
            words = str(c.get("text", "")).split()
            if len(words) > 6:
                warn(warnings, "caption-chunk-too-long", f"Caption {i} has {len(words)} words (> 6 words max): '{c.get('text')}'")

    # Check B-roll assets existence
    brolls = tracks.get("broll", [])
    for b in brolls:
        src = b.get("src")
        if src:
            src_p = public_dir / src if not Path(src).is_absolute() else Path(src)
            if not src_p.exists():
                warn(warnings, "broll-file-missing", f"B-roll file not found: {src}")

    # Check CapCut Transitions and SFX coupling
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
    preset = edl.get("style", {}).get("recipe", {}).get("preset", "")
    is_thuy = preset in ("thuy-style-nhieu-canh", "thuy-style-oneshot")

    for i, t in enumerate(transitions):
        t_type = t.get("type")
        if is_thuy and t_type not in CAPCUT_TRANSITION_MAP:
            warn(warnings, "non-capcut-transition", f"Transition {i} '{t_type}' is not one of the approved 9 CapCut transitions.")
        t_dir = t.get("direction", "up")
        if t_dir not in ("up", "down", "left", "right"):
            warn(warnings, "invalid-transition-direction", f"Transition {i} '{t_type}' has invalid direction '{t_dir}'. Must be one of ['up', 'down', 'left', 'right'].")
        if t_type in CAPCUT_TRANSITION_MAP:
            expected_sound = CAPCUT_TRANSITION_MAP[t_type]["sound"]
            t_start = t.get("startMs", 0)
            has_sfx = any(s.get("sound") == expected_sound and abs(s.get("startMs", 0) - t_start) <= 200 for s in explicit_sfx)
            if not has_sfx:
                warn(warnings, "transition-missing-sfx", f"Transition {i} '{t_type}'@{t_start} lacks matching SFX '{expected_sound}' in tracks.sfx.")

    out = {
        "edl": str(edl_path),
        "graphics": len(graphics),
        "captions": len(captions),
        "broll": len(brolls),
        "transitions": transition_count,
        "sfx": len(explicit_sfx),
        "warnings": warnings,
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    if warnings:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
