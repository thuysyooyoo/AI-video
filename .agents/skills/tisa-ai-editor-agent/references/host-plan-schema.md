# Schema for `out/host-plan.json` (mode `--llm prefed`)

The agent does the reasoning itself, then writes this file BEFORE calling
`python scripts/generate-edl.py --llm prefed` (or `run-pipeline.py --llm prefed`).
3 top-level blocks; any missing block → the engine falls back to offline mode for that block (nothing breaks).

```json
{
  "analysis": {
    "topic": "main topic in 1 sentence",
    "audience": "who is watching",
    "mood": "premium|energetic|friendly|urgent|inspirational",
    "facePosition": "left|center|right",
    "segments": [
      {"label": "hook|problem|point|proof|cta", "startSec": 0, "endSec": 8,
       "gist": "the segment's main idea", "energy": "low|mid|high"}
    ],
    "keyMoments": [
      {"sec": 12.5, "keyword": "phrase worth emphasizing", "why": "why",
       "visualIdea": "number|concept|contrast|emphasis"}
    ]
  },
  "strategy": {
    "theme": "<theme key LOCKED at the interview, see style-menu.md, do NOT change it>",
    "ambient": "none|sparkles|ring|both",
    "hookText": "HOOK 3-6 TỪ GIẬT TÍT",
    "ctaText": "CTA 2-4 TỪ",
    "plan": [
      {"sec": 5.2, "type": "<type, see graphic-catalog.md>", "text": "short content",
       "reason": "why this graphic at this second"}
    ]
  },
  "critique": {"drop": [], "add": [], "notes": "host plan is final"}
}
```

## Important rules (matching the compose code)

- **`strategy.theme` = the theme key the user chose at the interview.** A misspelled key → the engine silently falls back to `sunset`. Do NOT change the theme yourself.
- **Timestamps = seconds on the TIGHT clip** (after silence-cut), taken from `out/transcript.json` (already remapped). `sec` is a float, in seconds.
- **Hook/CTA are auto-generated:** the engine creates the hook graphic (0-3s, from `hookText`) and the CTA (last 3s, from `ctaText`); do NOT add them to `plan[]`.
- **Zoom is auto-generated** from `segments[].energy == "high"` (punch-in for the first 2s of the segment). Transitions are auto-generated at `label` changes (max 3). → energy/label are your rhythm levers.
- **`plan[]` item fields per type** (required to avoid demotion, see graphic-catalog.md):
  - `step-flow`/`list-reveal`/`premium-roadmap`: add `"items": ["...", "..."]` (2-4 elements; missing → demoted to kinetic-statement).
  - `comparison`/`dual-icon-cards`: add `"left"`, `"right"` (missing → demoted).
  - `number-counter`/`donut-stat`/`bar-stat`: add `"value"` (number; missing → demoted), optional `"suffix"`.
  - `stat-compare`: `"leftLabel"`, `"leftVal"`, `"rightLabel"`, `"rightVal"` (numbers), optional `"unit"`.
  - `info-table`: `"rows": [{"k": "label", "v": "value"}]` (3-5 rows; missing → demoted).
  - `path-mark`: `"kind": "circle|underline|arrow"`; `shape-3d`: `"shape": "cube|sphere|torus|diamond"`;
    `illus-mark`: a valid `"illus"` (see catalog); `neon-icon-card`: a valid `"icon"` + optional `"emphasis"`.
  - `lower-third-pro`: optional `"subtitle"`. Warning `callout`: `"warningMode": true`.
- **Leave `critique` empty** (`{"drop": [], "add": [], "notes": "host plan is final"}`), you already self-critiqued while writing the plan. Only use drop/add when you want the engine to modify your own plan (rare).
- The engine handles post-processing itself: word-anchor (snaps graphics to the keyword within ±2.5s), overlap prevention, illus-mark cap ≤2, data-empty demotion. Just set `sec` from the transcript, the engine fine-tunes.
