/**
 * Layout zones — prevents caption/graphics/face overlap (the #1 visual bug).
 * The 1080x1920 frame is split into fixed bands. Each overlay type lives in ONE
 * band so nothing stacks on the speaker's face (typically ~28%-58% height) or on
 * the caption.
 *
 *   0%   ┌───────────────┐
 *        │  TOP band     │  hooks, badges, callouts, highlight-reveal
 *  26%   ├───────────────┤
 *        │  FACE (clear) │  <- keep empty: speaker's face lives here
 *  60%   ├───────────────┤
 *        │  CAPTION band │  Hormozi captions only
 *  84%   ├───────────────┤
 *        │  BOTTOM band  │  cta, lower-third, progress
 * 100%   └───────────────┘
 *
 * Values are top-padding / bottom-padding in px for a 1920px-tall frame.
 */
export const H = 1920;

export const ZONES = {
  topPad: 150,
  topBandBottom: 0.26 * H,
  captionPaddingBottom: 360,
  bottomPad: 220,
} as const;

/**
 * Platform-safe zones (% of frame) — TikTok/Reels/Shorts UI overlays the edges:
 * bottom ~25% (post caption, action buttons, seek bar), right ~14% (like/share),
 * top ~8% (sometimes). Keep content inside these.
 */
export const SAFE = {
  bottomPct: 25, // keep captions/CTA above this
  topPct: 8,
  rightPct: 14,
} as const;

/** ONE consistent edge margin (px @1080 ref) — the invisible signature. Use everywhere
 * instead of scattered 60/70/90 values. */
export const MARGIN = 64;

import { createContext, useContext, type CSSProperties } from "react";
import { useVideoConfig } from "remotion";

/** Scale factor vs the 1080-wide design reference — multiply px values so layouts
 * hold at 16:9 (1920w) and 9:16 (1080w). */
export const useScale = (): number => {
  const { width } = useVideoConfig();
  return width / 1080;
};

/**
 * Face-aware layout context. Reel sets faceCenterYPct + freeZone from detection;
 * graphics read it so the top band sits ABOVE the speaker's head wherever it is.
 */
export const LayoutContext = createContext<{ faceCenterYPct: number; freeZone: string }>({
  faceCenterYPct: 32,
  freeZone: "top",
});
export const useLayout = () => useContext(LayoutContext);

/** Anchor a graphic into the TOP band, clamped to sit above the detected face. */
export const topBandStyle = (extraTop = 0): CSSProperties => ({
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: ZONES.topPad + extraTop,
});

/**
 * Face-aware top padding. If there's enough room ABOVE the head, place the graphic
 * there. If the face sits too high (head top within ~22% of frame), there's no room
 * up top — drop the graphic BELOW the face instead (just under the chin), so it
 * never lands on the face. graphicH ≈ height of the graphic block.
 */
export const faceAwareTopPad = (
  faceCenterYPct: number,
  extraTop = 0,
  graphicH = 320,
  frameH = H,
): number => {
  const headTopPx = ((faceCenterYPct - 16) / 100) * frameH;
  const roomAbove = headTopPx - 40;
  if (roomAbove >= graphicH) {
    return Math.max(60, headTopPx - graphicH);
  }
  // face too high -> place graphic below the chin
  return ((faceCenterYPct + 18) / 100) * frameH + extraTop;
};

/** Anchor a graphic into the BOTTOM band (below the caption). */
export const bottomBandStyle = (): CSSProperties => ({
  alignItems: "center",
  justifyContent: "flex-end",
  paddingBottom: ZONES.bottomPad,
});

/** Full-center — ONLY for CTA at the very end (no caption competing). */
export const centerStyle: CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
};
