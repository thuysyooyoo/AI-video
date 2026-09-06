"""Cross-platform setup for TISA AI EDITOR AGENT.

Checks system prerequisites, creates .venv, installs Python packages and runs
npm ci. System-level tools are reported, never installed implicitly.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VENV = ROOT / ".venv"


def version(command: list[str]) -> str | None:
    executable = shutil.which(command[0])
    if not executable:
        return None
    try:
        result = subprocess.run(
            [executable, *command[1:]],
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
        )
    except OSError:
        return None
    lines = (result.stdout or result.stderr).strip().splitlines()
    return lines[0] if lines else "detected"


def run(command: list[str]) -> None:
    print("  >", " ".join(command))
    subprocess.run(command, cwd=ROOT, check=True)


def venv_python() -> Path:
    if sys.platform == "win32":
        return VENV / "Scripts" / "python.exe"
    return VENV / "bin" / "python"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()

    checks = {
        "Python 3.10+": sys.version_info >= (3, 10),
        "Node.js": version(["node", "--version"]),
        "npm": version(["npm", "--version"]),
        "ffmpeg": version(["ffmpeg", "-version"]),
        "ffprobe": version(["ffprobe", "-version"]),
    }
    print(f"TISA AI EDITOR AGENT setup at {ROOT}\n")
    missing = []
    for label, value in checks.items():
        if value:
            shown = sys.version.split()[0] if label.startswith("Python") else value
            print(f"[OK] {label}: {shown}")
        else:
            print(f"[MISSING] {label}")
            missing.append(label)

    if missing:
        print("\nInstall the missing system tools, reopen the terminal, then run setup again.")
        return 1
    if args.check_only:
        print("\nSystem prerequisites are available.")
        return 0

    if not VENV.exists():
        run([sys.executable, "-m", "venv", str(VENV)])
    python = str(venv_python())
    run([python, "-m", "pip", "install", "--upgrade", "pip"])
    run([python, "-m", "pip", "install", "-r", "requirements.txt"])
    npm = "npm.cmd" if sys.platform == "win32" else "npm"
    run([npm, "ci"])

    print("\nProject dependencies installed. Next checks:")
    print(f"  {python} scripts/doctor.py")
    print("  npm run typecheck")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
