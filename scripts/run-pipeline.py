"""
Full local-first pipeline orchestrator.

Default path uses no API key:
  STT: local faster-whisper
  EDL reasoning: deterministic offline rules or a host plan written by Codex
  Media/render helpers: ffmpeg, OpenCV, Remotion

Usage:
  python scripts/run-pipeline.py raw/talkinghead.mp4 --llm offline --render
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
PUBLIC = ROOT / "public"
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)
PY = sys.executable


def run(cmd, **kw):
    print(f"  $ {' '.join(str(c) for c in cmd)}")
    return subprocess.run(cmd, check=True, **kw)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip", help="path relative to public/, e.g. raw/talkinghead.mp4")
    ap.add_argument("--keep-silence", action="store_true", help="skip silence removal")
    ap.add_argument("--max-gap-ms", type=int, default=300)
    ap.add_argument("--smart", action="store_true", help="deeper multi-pass critique where provider supports it")

    ap.add_argument("--stt", default="local",
                    choices=["local", "faster-whisper"],
                    help="speech-to-text provider; default is local faster-whisper")
    ap.add_argument("--stt-model", default="small", help="faster-whisper local model size")
    ap.add_argument("--language", default="vi")
    # cpu default: 'auto' hard-crashes on machines with a GPU but no cuDNN
    ap.add_argument("--device", default="cpu", help="cpu (safe default) | cuda | auto")
    ap.add_argument("--compute-type", default="auto")

    ap.add_argument("--llm", default="offline", choices=["claude-cli", "offline", "prefed"],
                    help="EDL reasoning provider; default is deterministic offline. 'prefed' reads "
                         "host-written reasoning (--plan) — recommended when running through Codex.")
    ap.add_argument("--plan", default=None,
                    help="host-written reasoning JSON for --llm prefed (default out/host-plan.json)")
    ap.add_argument("--preset", default="anh-sac-podcast",
                    choices=["thuy-style-oneshot", "thuy-style-nhieu-canh", "classic", "anh-sac-podcast"],
                    help="editing style preset to use")
    ap.add_argument("--force-regen", action="store_true",
                    help="overwrite out/edl.json even if it has manual edits")
    ap.add_argument("--bgm", default="auto",
                    help="background music relative path under public/, 'auto' to choose by theme/text, or 'none' to disable")
    ap.add_argument("--bgm-volume", type=float, default=0.22,
                    help="BGM volume (default: 0.22 for talking-head)")
    ap.add_argument("--no-bgm", action="store_true",
                    help="disable background music completely")
    ap.add_argument("--render", action="store_true",
                    help="render out/final.mp4 with Remotion after the pipeline")
    ap.add_argument("--open", action="store_true",
                    help="open the rendered video when done (implies --render)")
    a = ap.parse_args()
    if a.open:
        a.render = True

    clip_abs = PUBLIC / a.clip
    if not clip_abs.exists():
        print(f"ERROR: clip not found: {clip_abs}"); sys.exit(1)

    # a new clip must not silently clobber the previous project's work
    from pipeline_common import archive_previous_project
    archive_previous_project(OUT, Path(a.clip).stem)

    print("[1] Extract audio...")
    run(["ffmpeg", "-y", "-i", str(clip_abs), "-ar", "16000", "-ac", "1",
         str(OUT / "audio.wav")], capture_output=True)

    print(f"[2] Transcribe ({a.stt})...")
    stt_cmd = [
        PY, str(SCRIPTS / "transcribe.py"), str(OUT / "audio.wav"),
        "--engine", a.stt,
        "--local-model", a.stt_model,
        "--language", a.language,
        "--device", a.device,
        "--compute-type", a.compute_type,
    ]
    run(stt_cmd)

    final_clip = a.clip
    if not a.keep_silence:
        print("[3] Silence-cut (default ON)...")
        run([PY, str(SCRIPTS / "silence-cut.py"), "--clip", a.clip,
             "--max-gap-ms", str(a.max_gap_ms)])
        shutil.copy(OUT / "transcript-tight.json", OUT / "transcript.json")
        # name per source clip so multiple projects don't clobber each other
        tight_name = f"{Path(a.clip).stem}-tight.mp4"
        tight_pub = PUBLIC / "raw" / tight_name
        shutil.copy(OUT / "tight.mp4", tight_pub)
        final_clip = f"raw/{tight_name}"
        report = json.loads((OUT / "cut-report.json").read_text(encoding="utf-8"))
        print(f"    cut {report['removedSec']}s ({report['removedPct']}%), "
              f"{report['segments']} jump-cuts -> {final_clip}")
    else:
        print("[3] Silence-cut SKIPPED (--keep-silence)")

    print("[3b] Face-zone detection (local OpenCV)...")
    run([PY, str(SCRIPTS / "detect-face-zones.py"), final_clip])

    print(f"[4] Generate EDL ({a.llm}, {a.preset})...")
    edl_cmd = [
        PY, str(SCRIPTS / "generate-edl.py"),
        "--clip", final_clip,
        "--preset", a.preset,
        "--llm", a.llm,
    ]
    if a.plan:
        edl_cmd += ["--plan", a.plan]
    if a.smart:
        edl_cmd.append("--smart")
    if a.force_regen:
        edl_cmd.append("--force-regen")
    if a.no_bgm:
        edl_cmd.append("--no-bgm")
    else:
        edl_cmd += ["--bgm", a.bgm, "--bgm-volume", str(a.bgm_volume)]
    run(edl_cmd)

    if not a.render:
        print("\n[5] DONE. Render with:")
        print("    python scripts/run-pipeline.py ... --render   (hoac)")
        print("    npm run render:edl")
        return

    # guard: never render an edl.json that belongs to a different clip —
    # a leftover working copy from another project would silently win
    edl = json.loads((OUT / "edl.json").read_text(encoding="utf-8"))
    edl_clip = edl.get("source", {}).get("clip")
    if edl_clip != final_clip:
        print(f"LOI: out/edl.json thuoc clip khac ({edl_clip}), khong phai {final_clip}.")
        print("  Dung --force-regen de sinh lai EDL cho clip nay,")
        print("  hoac render EDL do rieng: npm run render:edl")
        sys.exit(1)

    print("[5] Render (Remotion)...")
    # edl.json is the single source of truth; the {edl} props wrapper is
    # regenerated right before render so a stale copy can never be used
    npx = "npx.cmd" if sys.platform == "win32" else "npx"
    run(["node", str(SCRIPTS / "make-render-props.mjs")], cwd=ROOT)
    final_mp4 = OUT / "final.mp4"
    run([npx, "remotion", "render", "Reel", str(final_mp4),
         f"--props={OUT / 'edl-props.json'}"], cwd=ROOT)
    print(f"\n[6] DONE -> {final_mp4}")
    if a.open:
        try:
            if sys.platform == "win32":
                import os
                os.startfile(final_mp4)
            else:
                run(["open" if sys.platform == "darwin" else "xdg-open", str(final_mp4)])
        except Exception as e:  # render already succeeded — opening is best-effort
            print(f"  (khong mo duoc video tu dong: {e})")


if __name__ == "__main__":
    main()
