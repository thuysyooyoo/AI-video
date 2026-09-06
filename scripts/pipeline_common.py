"""
Shared pipeline helpers — used by run-pipeline.py (talking-head) and
run-broll-pipeline.py (b-roll hook). Single home for behaviors both branches
must agree on: project archiving, theme -> style block, guarded EDL writes,
and the Remotion render step.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def archive_previous_project(out_dir: Path, new_clip_stem: str) -> None:
    """A new clip must not clobber the previous project's work: move the old
    edl (may hold manual edits) + final video into out/archive/<clip>/."""
    prev_edl = out_dir / "edl.json"
    if not prev_edl.exists():
        return
    try:
        prev_clip = json.loads(prev_edl.read_text(encoding="utf-8")).get("source", {}).get("clip", "")
        prev_stem = Path(prev_clip).stem.removesuffix("-tight")
        if prev_stem and prev_stem != new_clip_stem:
            arch = out_dir / "archive" / prev_stem
            arch.mkdir(parents=True, exist_ok=True)
            for name in ("edl.json", "edl.generated.json", "edit-plan.json", "final.mp4"):
                src = out_dir / name
                if src.exists():
                    shutil.move(str(src), str(arch / name))
            print(f"[0] Clip cu '{prev_stem}' da duoc luu vao {arch} (khong bi ghi de).")
    except (json.JSONDecodeError, OSError) as e:
        print(f"[0] CANH BAO: khong archive duoc project cu ({type(e).__name__})")


# v7 baseline material — mirrors default_recipe() in generate-edl.py
V7_RECIPE = {
    "surface": "glass-light", "blurPx": 18, "shadowMode": "soft",
    "borderIntensity": 0.35, "cardRadius": 28, "captionStrokePx": 3,
    "captionBottomPct": 28, "motionVoice": "energetic", "glassOpacity": 0.12,
    "textScale": 1.0, "entryAnimFamily": "spring",
    "textFx": "gradient", "captionCase": "upper",
    "accent": "#FF8C00", "accent2": "#FFC845", "highlightColor": "#39E508",
    "captionColor": "#FFFFFF", "scrimAlpha": 0.0,
}


def load_theme_recipe(theme_key: str) -> dict:
    """Full recipe for a theme: v7 defaults overlaid with EVERY token the theme
    defines in style-themes.json (material + motion + typography + color)."""
    recipe = dict(V7_RECIPE)
    try:
        themes = json.loads((ROOT / "src" / "style-themes.json").read_text(encoding="utf-8"))
        tokens = themes.get(theme_key)
        if isinstance(tokens, dict):
            recipe.update(tokens)
        else:
            print(f"CANH BAO: theme '{theme_key}' khong ton tai -> dung v7 baseline (sunset).")
    except (OSError, json.JSONDecodeError):
        pass
    return recipe


def write_edl_guarded(out_dir: Path, edl: dict, force: bool = False) -> Path:
    """Machine output -> edl.generated.json; edl.json (working copy) only
    overwritten when untouched or with force. Same contract as generate-edl.py."""
    text = json.dumps(edl, ensure_ascii=False, indent=2)
    generated = out_dir / "edl.generated.json"
    working = out_dir / "edl.json"
    prev_generated = generated.read_text(encoding="utf-8") if generated.exists() else None
    working_text = working.read_text(encoding="utf-8") if working.exists() else None
    generated.write_text(text, encoding="utf-8")
    if working_text is None or working_text == prev_generated or force:
        working.write_text(text, encoding="utf-8")
    else:
        print(f"CANH BAO: {working.name} co chinh sua tay - giu nguyen. "
              f"Ban moi o {generated.name}; dung --force-regen de ghi de.")
    return working


def render_final(out_dir: Path, open_after: bool = False) -> Path:
    """Regenerate the {edl} props wrapper and render out/final.mp4 with Remotion."""
    npx = "npx.cmd" if sys.platform == "win32" else "npx"
    subprocess.run(["node", str(ROOT / "scripts" / "make-render-props.mjs")], check=True, cwd=ROOT)
    final_mp4 = out_dir / "final.mp4"
    subprocess.run([npx, "remotion", "render", "Reel", str(final_mp4),
                    f"--props={out_dir / 'edl-props.json'}"], check=True, cwd=ROOT)
    print(f"\nDONE -> {final_mp4}")
    if open_after:
        try:
            if sys.platform == "win32":
                import os
                os.startfile(final_mp4)
            else:
                subprocess.run(["open" if sys.platform == "darwin" else "xdg-open", str(final_mp4)], check=True)
        except Exception as e:  # render already succeeded — opening is best-effort
            print(f"  (khong mo duoc video tu dong: {e})")
    return final_mp4


def probe_clip(clip_abs: Path):
    """Return (durationSec, width, height) via ffprobe."""
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-show_entries", "format=duration",
         "-of", "json", str(clip_abs)],
        capture_output=True, text=True, timeout=30, check=True)
    info = json.loads(r.stdout)
    w = int(info["streams"][0]["width"])
    h = int(info["streams"][0]["height"])
    dur = float(info["format"]["duration"])
    return dur, w, h
