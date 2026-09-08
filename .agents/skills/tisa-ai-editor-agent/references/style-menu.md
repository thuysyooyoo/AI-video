# Style Menu, 7 families mapping 20 themes

Each family has 1 **default** theme + alternate themes. Theme keys live in
`src/style-themes.json` (the single token source, read by both Python + TS).
When the user picks a family → use the default theme, unless the content's vibe fits an alternate better.

| # | Family | Default theme | Alternates | Vibe / matching niches | Texture |
|---|---|---|---|---|---|
| 1 | **Edu Analysis** | `ocean` | `mint-tech`, `cobalt-authority`, `violet-lab` | Education, tech, data analysis, business, trustworthy blue | glass-dark, confident motion; chart-heavy when the content has lots of numbers |
| 2 | **Bold Sales** | `sunset` | `obsidian-red`, `punch` | Sales, promotions, high energy, hot orange/red, strong spring | glass-light, energetic motion |
| 3 | **Luxury Authority** | `premium-gold` | `noir`, `forest-luxury`, `amber-olive-noir`, `gold` | Authority, premium, real estate/finance, classy gold/black | dark, deep shadows |
| 4 | **Beauty Lifestyle** | `bloom` | `porcelain-editorial`, `rose-noir` | Beauty, spa, feminine lifestyle, editorial pink/pastel | bright, soft |
| 5 | **Creator Neon** | `synthwave` | `cyber` | Creators, AI, gaming, new tech, purple/neon | glow, fast motion |
| 6 | **Minimal Expert** | `graphite-minimal` | `documentary-cream` | Minimalist experts, interviews, documentary, muted gray/cream | flat, NO gradients, sentence-case (textFx solid) |
| 7 | **Warm Coaching** | `fresh` | `gold` | Coaching, personal sharing, community, friendly fresh green/warm gold | warm, light spring |

(Merged 2026-07-08: Clean Edu + Analysis Business shared the same vibe → Edu Analysis. 7 families is the CEILING
for V1; new families are only added when the learning layer shows real demand.)

## How to propose (3-4 options, never show all)

1. Prioritize the family the user picks most often (from `memory/user-style-profile.md`), put it first, marked "(Recommended)".
2. Add 2-3 more families that match the clip's content topic (the "Vibe / niches" column above).
3. Describe each option in 1 line: family name + dominant colors + feel. Do NOT mention theme key names in the options (technical detail), use them only internally when writing the EDL/host-plan.

## Override

- The user specifies a theme key directly → use it as-is, no family mapping needed.
- The user describes a vibe that matches no family ("xanh lá đậm kiểu rừng", deep forest green) → pick the closest theme (`forest-luxury`) and tell the user which theme it was mapped to.
