"""
Local LLM providers for EDL generation.

Default target is Claude CLI. The command can be customized with CLAUDE_CLI_CMD:
  - default: claude -p {prompt}
  - with placeholder: set CLAUDE_CLI_CMD="claude -p {prompt}"
  - append prompt:     set CLAUDE_CLI_CMD="claude -p"

All providers return parsed JSON. No network/API key is required by this module.
"""
import json
import os
import re
import shlex
import subprocess


def parse_json_text(txt):
    txt = txt.strip()
    if txt.startswith("```"):
        txt = txt.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        start_obj, end_obj = txt.find("{"), txt.rfind("}")
        start_arr, end_arr = txt.find("["), txt.rfind("]")
        candidates = []
        if start_obj != -1 and end_obj != -1:
            candidates.append(txt[start_obj:end_obj + 1])
        if start_arr != -1 and end_arr != -1:
            candidates.append(txt[start_arr:end_arr + 1])
        for c in candidates:
            try:
                return json.loads(c)
            except json.JSONDecodeError:
                pass
        raise


def prompt_to_text(prompt):
    if isinstance(prompt, str):
        return prompt
    parts = []
    for part in prompt:
        if isinstance(part, dict) and "text" in part:
            parts.append(part["text"])
    return "\n\n".join(parts)


def call_claude_cli(prompt, _model=None, timeout=600):
    prompt_text = prompt_to_text(prompt)
    cmd_tpl = os.environ.get("CLAUDE_CLI_CMD", "claude -p")
    if "{prompt}" in cmd_tpl:
        cmd = [x.format(prompt=prompt_text) for x in shlex.split(cmd_tpl)]
    else:
        cmd = shlex.split(cmd_tpl) + [prompt_text]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8",
                          errors="replace", timeout=timeout)
    if proc.returncode != 0:
        raise RuntimeError(f"claude cli failed ({proc.returncode}): {proc.stderr.strip()}")
    return parse_json_text(proc.stdout)


def _sentences(text):
    chunks = [x.strip() for x in re.split(r"(?<=[.!?])\s+|\s{2,}", text) if x.strip()]
    if not chunks:
        chunks = [text.strip()]
    return chunks


def offline_analyze(transcript_text, dur):
    chunks = _sentences(transcript_text)
    seg_count = min(6, max(4, int(dur // 12) if dur else 4))
    step = max(dur / seg_count, 1)
    labels = ["hook", "problem", "point", "proof", "point", "cta"]
    segments = []
    for i in range(seg_count):
        s = i * step
        e = dur if i == seg_count - 1 else (i + 1) * step
        gist = chunks[min(i, len(chunks) - 1)][:120]
        segments.append({
            "label": labels[min(i, len(labels) - 1)],
            "startSec": round(s, 2),
            "endSec": round(e, 2),
            "gist": gist,
            "energy": "high" if i in (0, seg_count - 1) else "mid",
            "visualBeat": gist,
        })
    key_moments = []
    for i, seg in enumerate(segments):
        key_moments.append({
            "sec": round(seg["startSec"] + 0.7, 2),
            "keyword": seg["gist"].split(" ")[0] if seg["gist"] else "ý chính",
            "why": "offline segment beat",
            "visualIdea": "statement",
        })
    return {
        "topic": chunks[0][:100] if chunks else "Talking-head reel",
        "audience": "general Vietnamese audience",
        "mood": "sang",
        "facePosition": "center",
        "segments": segments,
        "keyMoments": key_moments,
    }


def offline_strategy(analysis, dur, preset=None):
    theme = (preset or {}).get("themeLock") or "cobalt-authority"
    plan = []
    type_cycle = ["kinetic-statement", "callout", "highlight-reveal", "glass-strip", "badge"]
    for i, moment in enumerate(analysis.get("keyMoments", [])):
        txt = moment.get("keyword") or moment.get("visualIdea") or "Ý CHÍNH"
        plan.append({
            "sec": float(moment.get("sec", 0)),
            "type": type_cycle[i % len(type_cycle)],
            "text": " ".join(str(txt).split()[:6]).upper(),
            "reason": "offline local fallback",
            "shape": "",
            "kind": "",
            "value": None,
            "suffix": "",
        })
    if dur > 12:
        plan.append({
            "sec": max(3, dur * 0.45),
            "type": "list-reveal",
            "text": "Vấn đề | Cách làm | Kết quả",
            "items": ["VẤN ĐỀ", "CÁCH LÀM", "KẾT QUẢ"],
            "reason": "offline structure",
            "shape": "",
            "kind": "",
            "value": None,
            "suffix": "",
        })
    return {
        "theme": theme,
        "ambient": "sparkles",
        "hookText": str(analysis.get("topic", "XEM NGAY"))[:36].upper(),
        "ctaText": "XEM TIẾP",
        "plan": plan,
    }


def offline_critique(_plan_items, _dur, _analysis=None):
    return {"drop": [], "add": [], "notes": "offline local fallback; no critique changes"}
