/**
 * Preset definitions — the single source of truth for style branching.
 * Both Reel.tsx (render) and Python pipeline (EDL generation) read from this.
 */

export type PresetName = "thuy-style-oneshot" | "thuy-style-nhieu-canh" | "classic" | "anh-sac-podcast";

export interface PresetConfig {
  /** Display name */
  name: string;
  /** Hide subtitle when headline/b-roll/graphic is active */
  captionMutualExclusion: boolean;
  /** Render SVG line-art icons inside PremiumCard / NeonIconCard */
  iconsEnabled: boolean;
  /** Allow boxy card graphics (NeonIconCard, PremiumCard, NegativeSlashCard, DualIconCards, DiamondLabel, PremiumRoadmap) */
  allowBoxyCards: boolean;
  /** Allow emoji characters in captions/graphics */
  allowEmojis: boolean;
  /** Use Hierarchical Idea Headlines (3-tier, stat-punch, split-contrast, tag-headline) */
  useHierarchicalHeadlines: boolean;
  /** Bottom scrim style */
  scrimMode: "subtle" | "blur-vignette" | "top-only" | "none";
  /** Card/graphic placement zone */
  cardPlacement: "center" | "top-safe";
  /** B-roll duration matches full spoken sentence length */
  dynamicBrollDuration: boolean;
  /** Auto-inject 1-2 fullscreen-keyword B-rolls */
  injectFullscreenBroll: boolean;
}

export const PRESETS: Record<PresetName, PresetConfig> = {
  "thuy-style-oneshot": {
    name: "Thuy Style One Shot",
    captionMutualExclusion: true,
    iconsEnabled: false,
    allowBoxyCards: false,
    allowEmojis: false,
    useHierarchicalHeadlines: true,
    scrimMode: "blur-vignette",
    cardPlacement: "top-safe",
    dynamicBrollDuration: true,
    injectFullscreenBroll: true,
  },
  "thuy-style-nhieu-canh": {
    name: "Thuy Style Nhiều Cảnh",
    captionMutualExclusion: true,
    iconsEnabled: false,
    allowBoxyCards: false,
    allowEmojis: false,
    useHierarchicalHeadlines: true,
    scrimMode: "top-only",
    cardPlacement: "top-safe",
    dynamicBrollDuration: true,
    injectFullscreenBroll: true,
  },
  classic: {
    name: "Classic Style",
    captionMutualExclusion: false,
    iconsEnabled: true,
    allowBoxyCards: true,
    allowEmojis: true,
    useHierarchicalHeadlines: false,
    scrimMode: "subtle",
    cardPlacement: "center",
    dynamicBrollDuration: false,
    injectFullscreenBroll: false,
  },
  "anh-sac-podcast": {
    name: "Anh Sắc Podcast Style",
    captionMutualExclusion: true,
    iconsEnabled: true,
    allowBoxyCards: false,
    allowEmojis: false,
    useHierarchicalHeadlines: true,
    scrimMode: "subtle",
    cardPlacement: "center",
    dynamicBrollDuration: true,
    injectFullscreenBroll: true,
  },
};

export const getPreset = (name?: string): PresetConfig =>
  PRESETS[(name as PresetName) ?? "thuy-style-oneshot"] ?? PRESETS["thuy-style-oneshot"];
