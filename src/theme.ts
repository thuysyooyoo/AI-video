/**
 * Color themes — refined with ui-ux-pro-max palette guidance (coordinated, high
 * contrast for muted-watch reels). Each theme = primary accent, secondary accent,
 * highlight (active word), caption color. Picked by mood in the EDL generator.
 */
/** Motion "voices" a theme speaks — limits a video to 2-3 consistent feels (Trụ 1). */
export type Voice = "energetic" | "confident" | "handcraft" | "reveal" | "punch";

export type Theme = {
  name: string;
  accent: string; // primary — hooks, badges, keyword
  accent2: string; // secondary — alternating graphics, variety
  highlight: string; // active spoken word
  caption: string; // default caption text
  voices: Voice[]; // 2-3 motion grammars allowed in this theme
  // OPTIONAL material tokens (R2-FIX3). Present for design-system themes (noir/bloom)
  // sourced from style-themes.json; absent for legacy flat themes (→ v7 defaults).
  surface?: "none" | "glass-light" | "glass-dark" | "solid-tint";
  shadowMode?: "soft" | "hard";
  glassOpacity?: number;
  scrimAlpha?: number;
  cardRadius?: number;
};

/**
 * Design-system material+color tokens live in ONE place: src/style-themes.json
 * (read by both this adapter and Python generate-edl.py, no drift).
 * Merge them onto the legacy flat THEMES below so getTheme() exposes material too.
 */
import styleThemes from "./style-themes.json";

export const THEMES: Record<string, Theme> = {
  // warm, energetic — coaching/sales. orange→amber, lime highlight
  sunset: { name: "sunset", accent: "#FB7427", accent2: "#FBBF24", highlight: "#A3E635", caption: "#FFFFFF", voices: ["energetic", "punch"] },
  // beauty/female/lifestyle — emerald+violet (ui-ux-pro-max beauty palette), vivid highlight
  bloom: { name: "bloom", accent: "#10B981", accent2: "#8B5CF6", highlight: "#FDE047", caption: "#FFFFFF", voices: ["energetic", "reveal"] },
  // tech/education — blue+orange CTA (ui-ux-pro-max saas), yellow highlight
  ocean: { name: "ocean", accent: "#2563EB", accent2: "#F97316", highlight: "#FDE047", caption: "#FFFFFF", voices: ["confident", "handcraft"] },
  // luxury/authority — gold+violet on dark (ui-ux-pro-max fintech-luxury), mint highlight
  noir: { name: "noir", accent: "#F59E0B", accent2: "#8B5CF6", highlight: "#34D399", caption: "#FFFFFF", voices: ["confident", "reveal"] },
  // urgency/news — red+amber, lime highlight
  punch: { name: "punch", accent: "#EF4444", accent2: "#F59E0B", highlight: "#A3E635", caption: "#FFFFFF", voices: ["punch", "energetic"] },
  // synthwave/retro — neon pink+cyan (ui-ux-pro-max synthwave style)
  synthwave: { name: "synthwave", accent: "#FF2D95", accent2: "#21D4FD", highlight: "#FFE600", caption: "#FFFFFF", voices: ["energetic", "punch"] },
  // premium luxury — deep gold on dark (ui-ux-pro-max luxury palette)
  gold: { name: "gold", accent: "#CA8A04", accent2: "#EAB308", highlight: "#FDE68A", caption: "#FFFFFF", voices: ["confident", "reveal"] },
  // cyber/tech — electric cyan + violet
  cyber: { name: "cyber", accent: "#06B6D4", accent2: "#7C3AED", highlight: "#A3E635", caption: "#FFFFFF", voices: ["confident", "handcraft"] },
  // fresh/wellness — mint + coral
  fresh: { name: "fresh", accent: "#14B8A6", accent2: "#FB7185", highlight: "#FDE047", caption: "#FFFFFF", voices: ["energetic", "handcraft"] },
  // premium semantic pack — dark gold reference-style visuals
  "premium-gold": { name: "premium-gold", accent: "#F7E56B", accent2: "#F59E0B", highlight: "#FDE68A", caption: "#FFFFFF", voices: ["confident", "reveal"] },
  // thriller/luxury — amber highlights over olive-noir shadows
  "amber-olive-noir": { name: "amber-olive-noir", accent: "#D1B66F", accent2: "#76602E", highlight: "#F7D77A", caption: "#F8F3E7", voices: ["confident", "reveal"] },
  // beauty/editorial — bright, soft, high polish
  "porcelain-editorial": { name: "porcelain-editorial", accent: "#E85D75", accent2: "#4F46E5", highlight: "#F59E0B", caption: "#FFFFFF", voices: ["reveal", "handcraft"] },
  // warning/sales urgency — black-red impact
  "obsidian-red": { name: "obsidian-red", accent: "#F43F5E", accent2: "#F97316", highlight: "#FDE047", caption: "#FFFFFF", voices: ["punch", "confident"] },
  // authority/luxury — deep green + antique gold
  "forest-luxury": { name: "forest-luxury", accent: "#C8A44D", accent2: "#2DD4BF", highlight: "#A7F3D0", caption: "#F6F1E6", voices: ["confident", "handcraft"] },
  // business/education — cobalt + amber
  "cobalt-authority": { name: "cobalt-authority", accent: "#3B82F6", accent2: "#F59E0B", highlight: "#67E8F9", caption: "#FFFFFF", voices: ["confident", "energetic"] },
  // premium feminine noir — rose + violet
  "rose-noir": { name: "rose-noir", accent: "#F472B6", accent2: "#A78BFA", highlight: "#FDE68A", caption: "#FFF7FB", voices: ["reveal", "confident"] },
  // minimal expert — low decoration, high contrast type
  "graphite-minimal": { name: "graphite-minimal", accent: "#E5E7EB", accent2: "#38BDF8", highlight: "#FACC15", caption: "#FFFFFF", voices: ["confident", "reveal"] },
  // AI/SaaS — mint + indigo, glass light
  "mint-tech": { name: "mint-tech", accent: "#2DD4BF", accent2: "#6366F1", highlight: "#FDE047", caption: "#FFFFFF", voices: ["handcraft", "confident"] },
  // science/analysis — violet + cyan
  "violet-lab": { name: "violet-lab", accent: "#8B5CF6", accent2: "#22D3EE", highlight: "#FDE047", caption: "#FFFFFF", voices: ["reveal", "handcraft"] },
  // documentary/warm education — muted cream + blue contrast
  "documentary-cream": { name: "documentary-cream", accent: "#E2B866", accent2: "#2563EB", highlight: "#FCD34D", caption: "#FFF9EC", voices: ["handcraft", "confident"] },
};

// overlay material tokens from the single-source JSON onto matching themes (noir/bloom)
const themeTokens = styleThemes as unknown as Record<string, Record<string, unknown>>;
for (const [name, tokens] of Object.entries(themeTokens)) {
  if (name.startsWith("_") || typeof tokens !== "object") continue; // skip _doc
  if (THEMES[name]) Object.assign(THEMES[name], tokens);
}

export const getTheme = (name?: string): Theme => THEMES[name ?? "sunset"] ?? THEMES.sunset;
