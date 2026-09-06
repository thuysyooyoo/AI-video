/**
 * StyleContext — exposes the resolved StyleRecipe to every graphic/caption component.
 * resolveStyle reads edl.style.recipe ONLY (R2-FIX1/R2-FIX3): material AND color are
 * already baked into the recipe by the Python compiler. There is NO getTheme / themeName
 * lookup at render and NO reading of the legacy flat style.* color fields.
 * Mirrors the existing LayoutContext pattern (layout.ts).
 */
import { createContext, useContext, type CSSProperties } from "react";
import { styleRecipeSchema, type StyleRecipe, type Edl } from "./edl-types";

// default = v7 baseline (zod fills every field). Used when a component renders
// outside a provider (defensive) — real value comes from Reel's provider.
const DEFAULT_RECIPE: StyleRecipe = styleRecipeSchema.parse({});

export const StyleContext = createContext<StyleRecipe>(DEFAULT_RECIPE);
export const useStyle = (): StyleRecipe => useContext(StyleContext);

/** Resolve the recipe React renders from. Reads style.recipe only (color + material). */
export const resolveStyle = (style: Edl["style"]): StyleRecipe => {
  // recipe is always present (schema defaults it); parse-guard against hand-written EDLs.
  return styleRecipeSchema.parse(style.recipe ?? {});
};

/**
 * Shared CSS for a glass/solid card surface driven by the recipe (DRY across
 * GlassCard / GlassStrip / GraphicShell card surfaces). glassOpacity applies to
 * CARDS only (NOT BackingBlob — FIX 5). noir glass-dark → dark tint; solid-tint →
 * opaque fallback for dark footage where blur won't read (Q4).
 */
export const surfaceStyle = (r: StyleRecipe): CSSProperties => {
  const base: CSSProperties = {
    border: `1px solid rgba(255,255,255,${r.borderIntensity})`,
    borderRadius: r.cardRadius,
  };
  if (r.surface === "none") return { ...base, background: "transparent", border: "none" };
  if (r.surface === "solid-tint") return { ...base, background: `rgba(10,12,20,${0.6 + r.glassOpacity})` };
  const tint = r.surface === "glass-dark" ? "10,12,20" : "255,255,255";
  return {
    ...base,
    background: `rgba(${tint},${r.glassOpacity})`,
    backdropFilter: `blur(${r.blurPx}px)`,
    WebkitBackdropFilter: `blur(${r.blurPx}px)`,
  };
};
