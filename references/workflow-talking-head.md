# Workflow A, Talking-head

Speaking-person clip → cut silences/filler words → captions + graphics + zoom → render 9:16.
Cwd for every command = the kit root.

## Diagram

```text
clip.mp4 (from the user)
  → public/raw/<clip>.mp4              [Step 1: place the clip]
  → run-pipeline.py                     [Step 2: STT → silence-cut → face-zones → EDL]
  → out/edl.json                        [Step 3: review/adjust]
  → --render / render:edl               [Step 4: out/final.mp4]
  → feedback → edit the edl → re-render [Step 5: iterate]
```

## Step 1, Place the clip

- Copy the user's clip into `public/raw/` (keep the original name, no spaces if possible).
- Vertical 9:16 is standard; horizontal still works (the format follows the EDL).

## Step 2, Run the pipeline

The clip path is **relative to `public/`**, pass `raw/<clip>.mp4`,
do NOT pass `public/raw/...`.

Pick the reasoning mode in this priority order:

| Mode | When | Command |
|---|---|---|
| `prefed` (recommended) | You (the agent) do the reasoning per [edl-reasoning-talking-head.md](edl-reasoning-talking-head.md); you need the transcript first: run the pipeline with `--llm offline` (fast, no CLI) to get transcript + face-zones, then write `out/host-plan.json`, then `python scripts/generate-edl.py --clip "raw/<tight>.mp4" --llm prefed --force-regen` → `npm run render:edl` | see the playbook |
| `claude-cli` (legacy) | The user explicitly wants the legacy Claude CLI provider and it is on PATH | `python scripts/run-pipeline.py raw/<clip>.mp4 --llm claude-cli --smart --render` |
| `offline` | Deterministic fallback, no LLM | `python scripts/run-pipeline.py raw/<clip>.mp4 --llm offline --render` |

Prefed is safe: whichever pass the host-plan is missing, the engine falls back to offline for that
pass, the pipeline does not break.

**Theme:** only `prefed` guarantees the user's chosen theme (set in the host-plan). With
`claude-cli`/`offline`, after gen, check `strategy.theme` in
`out/edit-plan.json`; if it drifted, fix the `style` block in `edl.json` using the theme
tokens from `src/style-themes.json`.

Useful flags: `--keep-silence` (skip silence cutting), `--max-gap-ms 400` (sparser jump-cuts),
`--stt-model medium` (more accurate Vietnamese STT, slower), `--open` (open the video when done).

**Timestamp note:** after silence-cut, every timestamp in the EDL is measured on
`public/raw/<clip>-tight.mp4` (the ALREADY-CUT clip), NOT the original clip. When cross-checking
content, watch the tight clip.

## Step 3, Review the EDL before render (if not rendering directly with --render)

1. `python scripts/validate-edl-risk.py out/edl.json`, lint (overlaps, long text, empty data).
2. Read `out/edl.json` yourself and check against the principles: graphic quota = CEILING; captions match the transcript; no graphic covering the face (see `style.freeZone`).
3. Preview for the user (optional): `npm run studio:edl`, restart Studio after each edl.json edit.

## Step 4, Render

- If `--render` was used at step 2, you are done: `out/final.mp4`.
- Rendering separately after edits: `npm run render:edl`.

## Step 5, Iterate on feedback

- **Small edits** (caption typo, color change, remove 1 graphic): edit `out/edl.json` DIRECTLY → `npm run render:edl`. Keep the parts the user already likes.
- **Big direction change** (new theme, re-cut): rerun the pipeline. `edl.json` NOT hand-edited → the pipeline updates it automatically. Hand-edited → you **MUST use `--force-regen`**; if you forget the flag the pipeline only prints a warning and **renders the OLD version** (the different-clip guard does not block the same clip), the new version sits in `out/edl.generated.json`.
- **Keep hand edits + take the new parts:** diff `edl.json` against `edl.generated.json`, merge the parts you want by hand (no force-regen).
- Caption wrong due to STT (wrong Vietnamese diacritics): fix the text in `tracks.captions[].text`, and remember to fix the matching `tokens[].text` if present.
- Round done: ask the user if they are happy, record feedback into the learning layer (Phase 05).
