"""
Preflight check — verify every runtime the kit needs before running the pipeline.

Usage:
  python scripts/doctor.py

Exit code 0 = san sang; 1 = thieu runtime bat buoc.
"""
import shutil
import subprocess
import sys
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]

OK = "  [OK] "
ERR = "  [LỖI] "
WARN = "  [CHÚ Ý] "


def version_of(cmd: list[str]) -> str | None:
    """Return first line of a --version style command, or None if missing/broken."""
    exe = shutil.which(cmd[0])
    if not exe:
        return None
    try:
        # run the resolved path: on Windows a bare "claude" (npm .cmd shim)
        # is found by which() but not by CreateProcess
        r = subprocess.run([exe] + cmd[1:], capture_output=True, text=True, timeout=20)
        out = (r.stdout or r.stderr).strip().splitlines()
        return out[0] if out else "(không rõ phiên bản)"
    except Exception:
        return None


def main() -> int:
    print(f"Kiểm tra môi trường TISA AI EDITOR AGENT tại {ROOT}\n")
    errors = 0

    # --- Python ---
    if sys.version_info >= (3, 10):
        print(f"{OK}Python {sys.version.split()[0]}")
    else:
        print(f"{ERR}Python {sys.version.split()[0]} — cần Python 3.10 trở lên.")
        errors += 1

    # --- Node.js ---
    node = version_of(["node", "--version"])
    if node:
        try:
            major = int(node.lstrip("v").split(".")[0])
        except ValueError:
            major = 0
        if major >= 18:
            print(f"{OK}Node.js {node}")
        else:
            print(f"{ERR}Node.js {node} — cần Node 18 trở lên. Tải tại https://nodejs.org")
            errors += 1
    else:
        print(f"{ERR}Không tìm thấy Node.js. Tải tại https://nodejs.org rồi mở lại terminal.")
        errors += 1

    # --- ffmpeg / ffprobe ---
    for tool in ("ffmpeg", "ffprobe"):
        v = version_of([tool, "-version"])
        if v:
            print(f"{OK}{v.split('Copyright')[0].strip()}")
        else:
            print(f"{ERR}Không tìm thấy {tool} trong PATH. "
                  f"Windows: 'winget install Gyan.FFmpeg' rồi mở lại terminal.")
            errors += 1

    # --- npm deps (Remotion) ---
    if (ROOT / "node_modules" / "remotion").exists():
        print(f"{OK}node_modules đã cài (Remotion sẵn sàng)")
    else:
        print(f"{ERR}Chưa cài npm dependencies. Chạy: npm install (trong {ROOT})")
        errors += 1

    # --- Python deps: STT + face detection ---
    missing_mods = []
    for mod in ("faster_whisper", "cv2", "numpy"):
        try:
            __import__(mod)
        except ImportError:
            missing_mods.append(mod)
    if missing_mods:
        print(f"{ERR}Thiếu Python package: {', '.join(missing_mods)}. "
              f"Chạy: pip install -r requirements.txt")
        errors += 1
    else:
        print(f"{OK}Python deps đã cài (faster-whisper, OpenCV, numpy)")
        cache = Path.home() / ".cache" / "huggingface" / "hub"
        has_model = cache.exists() and any(cache.glob("models--*faster-whisper*"))
        if has_model:
            print(f"{OK}Model whisper đã có trong cache")
        else:
            print(f"{WARN}Model whisper (~460MB) sẽ tự tải ở LẦN CHẠY ĐẦU — "
                  f"máy có thể 'đứng im' vài phút, đó là đang tải, không phải treo.")

    # --- Claude CLI (legacy optional provider) ---
    claude = version_of(["claude", "--version"])
    if claude:
        print(f"{OK}Claude CLI {claude} (dùng cho --llm claude-cli)")
    else:
        print(f"{WARN}Không thấy Claude CLI — không ảnh hưởng khi dùng Codex với "
              f"--llm offline hoặc --llm prefed.")

    print()
    if errors:
        print(f"KẾT QUẢ: thiếu {errors} thành phần bắt buộc — sửa các dòng [LỖI] ở trên rồi chạy lại.")
        return 1
    print("KẾT QUẢ: môi trường sẵn sàng. Dùng $tisa-ai-editor-agent trong Codex để bắt đầu dựng.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
