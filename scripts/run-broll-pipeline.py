"""
B-roll + caption hook pipeline (workflow B) — the TikTok "text over footage"
format: 1 hook title (1-2 lines on dark strips) + 1 handwritten sub-hook +
1 CTA, static over the whole clip. No STT, no silence-cut, no face detection.

Usage:
  python scripts/run-broll-pipeline.py raw/beach.mp4 ^
      --hook "3 Thói Quen Nhỏ Giúp Phụ Nữ|Giữ Năng Lượng Mềm Mại" ^
      --subhook "(Ngay cả khi bạn thấy mệt mỏi và chưa biết bắt đầu từ đâu)" ^
      --cta "Chi tiết ở caption 👇👇" ^
      --theme bloom --render
"""
import argparse
import sys
from pathlib import Path

from pipeline_common import (
    archive_previous_project, load_theme_recipe, write_edl_guarded,
    render_final, probe_clip,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "out"

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip", help="b-roll clip, path relative to public/ (e.g. raw/beach.mp4)")
    ap.add_argument("--hook", required=True,
                    help="hook title; split lines with | (e.g. 'Dòng 1|Dòng 2')")
    ap.add_argument("--subhook", default="", help="handwritten sub-hook line (optional)")
    ap.add_argument("--cta", default="", help="CTA line, emoji ok (optional)")
    ap.add_argument("--theme", default="sunset", help="theme key from src/style-themes.json")
    ap.add_argument("--music", default="",
                    help="background music file: path relative to public/ (e.g. music/chill.mp3) "
                         "or an absolute path (auto-copied into public/music/)")
    ap.add_argument("--music-volume", type=float, default=0.7, help="music loudness 0..1")
    ap.add_argument("--music-start", type=float, default=0.0,
                    help="start the music at this second of the file (skip intro)")
    ap.add_argument("--keep-clip-audio", action="store_true",
                    help="keep the b-roll's own audio at low volume under the music (default: muted)")
    ap.add_argument("--force-regen", action="store_true",
                    help="overwrite out/edl.json even if it has manual edits")
    ap.add_argument("--render", action="store_true", help="render out/final.mp4 when done")
    ap.add_argument("--open", action="store_true", help="open the video when done (implies --render)")
    a = ap.parse_args()
    if a.open:
        a.render = True

    clip_abs = PUBLIC / a.clip
    if not clip_abs.exists():
        print(f"LỖI: không tìm thấy clip: {clip_abs}")
        print("  Đặt clip vào public/ và truyền đường dẫn tương đối, vd: raw/beach.mp4")
        sys.exit(1)

    OUT.mkdir(exist_ok=True)
    archive_previous_project(OUT, Path(a.clip).stem)

    # background music: resolve to a path under public/ (Remotion staticFile)
    music_rel = ""
    if a.music:
        m = Path(a.music)
        if m.is_absolute() or not (PUBLIC / a.music).exists():
            if not m.exists():
                print(f"LỖI: không tìm thấy file nhạc: {a.music}")
                sys.exit(1)
            dest = PUBLIC / "music" / m.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists():
                import shutil
                shutil.copy(str(m), str(dest))
            music_rel = f"music/{m.name}"
        else:
            music_rel = a.music

    print("[1] Đọc thông số clip...")
    dur, w, h = probe_clip(clip_abs)
    fmt_w, fmt_h = (1920, 1080) if w > h else (1080, 1920)
    dur_ms = int(dur * 1000)
    print(f"    {w}x{h}, {dur:.1f}s -> khung {fmt_w}x{fmt_h}")

    print(f"[2] Dựng EDL b-roll (theme {a.theme})...")
    recipe = load_theme_recipe(a.theme)
    hook_lines = [s.strip() for s in a.hook.split("|") if s.strip()][:2]
    graphics = [{"type": "broll-hook", "startMs": 0, "endMs": dur_ms,
                 "text": a.hook, "items": hook_lines}]
    if a.subhook:
        graphics.append({"type": "broll-subhook", "startMs": 0, "endMs": dur_ms, "text": a.subhook})
    if a.cta:
        graphics.append({"type": "broll-cta", "startMs": 0, "endMs": dur_ms, "text": a.cta})

    # b-roll footage audio is muted by default (usually wind/street noise);
    # --keep-clip-audio keeps it low under the music
    clip_vol = 0.25 if a.keep_clip_audio else 0.0
    edl = {
        "source": {"clip": a.clip, "durationSec": round(dur, 2), "volume": clip_vol},
        **({"music": {"src": music_rel, "volume": a.music_volume,
                      "clipVolume": clip_vol, "startSec": a.music_start,
                      "loop": True, "fadeOutSec": 1.5}} if music_rel else {}),
        "format": {"w": fmt_w, "h": fmt_h, "fps": 30},
        "style": {
            "captionColor": recipe["captionColor"], "highlightColor": recipe["highlightColor"],
            "accent": recipe["accent"], "accent2": recipe["accent2"],
            "baseScale": 1.0, "baseShiftYPct": 0,
            "maskBandTopPct": 0, "maskBandHeightPct": 0,
            "freeZone": "top", "faceCenterYPct": 50.0,
            "ambient": "none",
            "recipe": recipe,
        },
        "tracks": {"captions": [], "effects": [], "transitions": [],
                   "graphics": graphics, "sfx": [], "broll": []},
    }
    write_edl_guarded(OUT, edl, force=a.force_regen)
    print(f"    hook {len(hook_lines)} dòng | subhook: {'có' if a.subhook else 'không'} | cta: {'có' if a.cta else 'không'}")

    if not a.render:
        print("\n[3] DONE. Render với: npm run render:edl (hoặc thêm --render)")
        return
    print("[3] Render (Remotion)...")
    render_final(OUT, open_after=a.open)


if __name__ == "__main__":
    main()
