"""Package TISA AI EDITOR AGENT using a strict allowlist."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
PACKAGE_NAME = "tisa-ai-editor-agent"

DIRS = [".agents", "agents", "docs", "goldens", "public/bgm", "public/sfx", "references", "scripts", "src"]
FILES = [
    "SKILL.md",
    "README.md",
    "package.json",
    "package-lock.json",
    "requirements.txt",
    "remotion.config.ts",
    "tsconfig.json",
    ".gitignore",
]
EXCLUDE_PARTS = {"__pycache__", ".venv", "node_modules", "dist"}
EXCLUDE_SUFFIXES = {".pyc", ".zip"}
MUST_EXIST = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/cai-dat-cong-cu.md",
    "references/huong-dan-su-dung.md",
    "references/quy-trinh-van-hanh.md",
    "references/bo-prompt-mau.md",
    "references/workflow-talking-head.md",
    "references/workflow-broll-hook.md",
    "scripts/setup.py",
    "scripts/doctor.py",
    "scripts/run-pipeline.py",
    "scripts/run-broll-pipeline.py",
    "public/sfx",
]


def should_skip(path: Path) -> bool:
    return any(part in EXCLUDE_PARTS for part in path.parts) or path.suffix in EXCLUDE_SUFFIXES


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-zip", action="store_true")
    args = parser.parse_args()

    missing = [item for item in MUST_EXIST if not (ROOT / item).exists()]
    if missing:
        print("PACK FAILED — missing required paths:")
        for item in missing:
            print(f"  - {item}")
        return 1

    version = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
    destination = DIST / PACKAGE_NAME
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)

    count = 0
    for directory in DIRS:
        source_dir = ROOT / directory
        for source in source_dir.rglob("*"):
            if source.is_dir() or should_skip(source):
                continue
            relative = source.relative_to(ROOT)
            target = destination / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
            count += 1
    for filename in FILES:
        shutil.copy2(ROOT / filename, destination / filename)
        count += 1

    for directory in ("memory", "public/raw", "public/music", "out"):
        target = destination / directory
        target.mkdir(parents=True, exist_ok=True)
        (target / ".gitkeep").write_text("", encoding="utf-8")

    if not list((destination / "public/sfx").glob("*")):
        print("PACK FAILED — public/sfx is empty")
        return 1

    print(f"Packed {count} files -> {destination}")
    if not args.no_zip:
        archive = DIST / f"TISA-AI-EDITOR-AGENT-v{version}.zip"
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
            for source in destination.rglob("*"):
                if source.is_file():
                    bundle.write(source, source.relative_to(DIST))
        print(f"Zip -> {archive} ({archive.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
