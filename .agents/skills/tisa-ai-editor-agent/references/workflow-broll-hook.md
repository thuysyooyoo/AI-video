# Workflow B, B-roll + caption hook

The TikTok "text over footage" format: **1 hook title (1-2 lines on a black strip)
+ 1 handwritten sub-hook + 1 CTA**. Text is static for the whole clip, appearing with
an automatic stagger (hook → subhook → CTA). The theme only changes colors and weight. NO STT, NO silence
cutting, NO face detection, NO other graphics (the b-roll is the visual by itself).

## Input needed from the user

1. **1 b-roll clip** (local file, vertical 9:16 is standard; horizontal auto-switches to 16:9).
2. **Topic / hook text.** If the user only gives a topic: YOU PROPOSE 3 hook options
   (2-line title + subhook + CTA) for the user to pick, following the formula:
   - Title: number + benefit + audience ("3 Thói Quen Nhỏ Giúp Phụ Nữ | Giữ Năng Lượng Mềm Mại"), each line ≤ 30 characters looks best (longer auto-shrinks the text).
   - Sub-hook: an empathetic sentence in parentheses, e.g. "(Ngay cả khi bạn...)".
   - CTA: a short action + emoji, e.g. "Chi tiết ở caption 👇👇".
3. **Style** (interview at SKILL.md Step 2): the theme decides line 1's color (highlightColor)
   + text color (captionColor). Soft feminine vibe → `bloom`/`porcelain-editorial`;
   high energy → `sunset`; minimal → `graphite-minimal`.

## Run

```powershell
python scripts/run-broll-pipeline.py raw/<clip>.mp4 `
  --hook "Dòng 1|Dòng 2" `
  --subhook "(Câu đồng cảm trong ngoặc)" `
  --cta "Chi tiết ở caption 👇👇" `
  --theme bloom `
  --music "D:\nhac\chill.mp3" --render --open
```

**Background music** (b-roll almost always needs it): `--music <file>` accepts an absolute path
(auto-copied into `public/music/`) or a path relative to `public/`. Default music volume 0.7,
the clip's original audio is MUTED; to keep the original audio low under the music: `--keep-clip-audio` (0.25).
Adjust volume: `--music-volume 0.5`. Music shorter than the clip loops automatically.
Ask the user whether they have a music file; the kit ships NO music (copyright), the user provides it.

- Clip paths are relative to `public/` (copy the user's clip into `public/raw/` first).
- Multi-line hook: separate lines with `|` (max 2 lines).
- `--render` renders in the same command; without it the run stops at `out/edl.json` (hand-edit → `npm run render:edl`).
- The engine auto-archives the previous project to `out/archive/<clip>/` when the clip changes.
- Short clips (~10-30s) render much faster than talking-head (~1-3 minutes).

## Iterate

- Edit text: change `text`/`items` in `tracks.graphics[]` of `out/edl.json` → `npm run render:edl`.
- Change theme/colors: rerun with `--theme <key> --force-regen` (or edit the `style` block in edl.json).
- The overwrite guard works like workflow A: hand edits are kept, use `--force-regen` to overwrite deliberately.

## Technical notes (for agent debugging)

- 3 graphic types: `broll-hook` (items = the lines), `broll-subhook`, `broll-cta`, rendered in `src/components/BrollHook.tsx`.
- Fonts: Baloo 2 (title, rounded bold) + Patrick Hand (handwriting), both verified with the Vietnamese subset.
- Positions: title top 13%, subhook 62%, CTA 71.5% (avoiding the subject in the center of the frame).
- The EDL is generated deterministically by `run-broll-pipeline.py` (no LLM/host-plan needed; the only reasoning is WRITING the hook text, which is your job at the Input step).
