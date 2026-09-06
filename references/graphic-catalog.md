# Graphic Catalog, 26 types, when to use, required fields

Source of truth: `ALLOWED_TYPES` + `plan_item_to_graphic()` in `scripts/generate-edl.py`.
Missing a required field → the engine **demotes** to `kinetic-statement` (no error, but the intent is lost).

## Pick the type by MEANING (intent → type)

| What is being said | Type | Required fields besides `text` |
|---|---|---|
| Strong closing line, declaration | `kinetic-statement` |, |
| Text revealed behind a bright edge (soft reveal) | `mask-reveal` |, |
| Short keyword on a glass strip | `glass-strip` |, |
| Emphasize a keyword with a hand-drawn stroke | `path-mark` | `kind`: circle\|underline\|arrow |
| Abstract concept (with a caption) | `shape-3d` | `shape`: cube\|sphere\|torus\|diamond |
| EXTREME emphasis point (≤2 per video!) | `illus-mark` | `illus`: curved-arrow\|bracket\|circle-draw\|check\|cross\|starburst\|metaphor-process\|metaphor-speed\|metaphor-quality\|metaphor-money\|metaphor-idea |
| Listing STEPS/a process | `step-flow` | `items`: [2-4 steps] |
| The video's MAIN roadmap (full-scene) | `premium-roadmap` | `items`: [3 steps] |
| Comparing/contrasting 2 sides | `comparison` | `left`, `right` |
| 2 options as icon cards | `dual-icon-cards` | `left`, `right` |
| Listing benefits/points | `list-reveal` | `items`: [2-4 points], optional `rank` (int, highlights the top point) |
| Introducing a person/product name | `lower-third-pro` | optional `subtitle` |
| Benefit/course/advice (neon card) | `neon-icon-card` | `icon`: course-access\|advice\|confidence\|process\|warning\|progress\|video-course\|magnet\|quality\|idea; optional `emphasis` |
| DON'T/avoid/eliminate | `negative-slash-card` |, |
| Short premium label (**≤ 3-4 words**, longer shrinks/overflows the text) | `diamond-label` |, |
| Regular short label | `badge` |, |
| Card emphasizing 1 point | `callout` | optional `warningMode: true` (warning colors) |
| Light-pen sweep across the text | `highlight-reveal` |, |
| Number counting up | `number-counter` | `value` (number), optional `suffix` ("%", "tr"...) |
| % as a donut | `donut-stat` | `value` |
| % as a bar | `bar-stat` | `value` |
| Progress bar | `progress-bar` | `value` |
| COMPARING 2 numbers (double bar) | `stat-compare` | `leftLabel`, `leftVal`, `rightLabel`, `rightVal` (numbers), optional `unit` |
| Spec TABLE, 3-5 rows | `info-table` | `rows`: [{k, v}] |
| Glass card holding text | `glass-card` |, |
| Color wipe between sections | `color-wipe` |, (usually left to the engine's auto transitions) |

Optional fields shared by all types: `anchor` (top|center|bottom, the engine auto-avoids the face
via face-zones when omitted), `visualWeight` (micro|minor|major|scene).

## Anti-patterns (lessons from v7/v8, see the CHANGELOG lore)

- ❌ Stuffing graphics to "fill empty space", the quota is a CEILING. Short breathing gaps = professional.
- ❌ Scattering `illus-mark` (aimless circles, meaningless starbursts), max 2, only at extreme emphasis points. The engine caps at 2 but do not rely on that.
- ❌ Data graphics with NO real number (empty value/leftVal), the engine demotes them but a good slot is wasted; only use them when the transcript HAS a number.
- ❌ `comparison` when there is no real two-sided contrast in the speech.
- ❌ Long text: kinetic-statement ≤ 52 readable characters; a list item ≤ 4-5 words.
- ❌ The same type repeated back-to-back (3 kinetic-statements in a row), vary types for visual rhythm.
