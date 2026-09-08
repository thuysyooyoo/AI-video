#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR/.."
AGENTS_SKILLS="$REPO_ROOT/.agents/skills"
TARGET_DIR="$HOME/.gemini/config/skills"

if [ ! -d "$AGENTS_SKILLS" ]; then
    echo "[ERROR] Cannot find directory: $AGENTS_SKILLS"
    exit 1
fi

echo "Syncing skills to: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

for skill in "$AGENTS_SKILLS"/*; do
    if [ -d "$skill" ]; then
        skill_name="$(basename "$skill")"
        echo " - Syncing $skill_name ..."
        rm -rf "$TARGET_DIR/$skill_name"
        cp -r "$skill" "$TARGET_DIR/$skill_name"
    fi
done

echo "[SUCCESS] All skills synchronized to ~/.gemini/config/skills!"
