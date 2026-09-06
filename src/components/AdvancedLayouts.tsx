/**
 * Vector layout components (no external image assets — pure CSS/SVG).
 * GlassCard is a frosted step card used to present numbered steps/benefits,
 * a common pro talking-head device that needs no footage.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enterExit, voicePop, floatY, glow, entryByFamily } from "../anim";
import { topBandStyle, faceAwareTopPad, useLayout } from "../layout";
import { useStyle, surfaceStyle } from "../style-context";

/**
 * Glassmorphism step card — frosted card listing a numbered step, slides in.
 * Color-coded step number; pure CSS, no asset needed.
 */
export const GlassCard: React.FC<{
  step?: number;
  title: string;
  accent: string;
}> = ({ step, title, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames);
  const s = voicePop(frame, fps, recipe.motionVoice);
  // entryByFamily (P4b secondary): GlassCard is one of 2-3 components that wire it
  const entryStyle = entryByFamily(recipe.entryAnimFamily, frame, fps, recipe.motionVoice);
  // spring entry: slide from right; other families use entryByFamily transform instead
  const tx = recipe.entryAnimFamily && recipe.entryAnimFamily !== "spring"
    ? 0
    : interpolate(s, [0, 1], [400, 0]);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 20) }}>
      <div
        style={{
          transform: recipe.entryAnimFamily && recipe.entryAnimFamily !== "spring"
            ? entryStyle.transform
            : `translateX(${tx}px) translateY(${floatY(frame, 5)}px)`,
          opacity: e,
          width: 820,
          // surface/blur/border/radius driven by recipe (R2-FIX1); shadow by shadowMode
          ...surfaceStyle(recipe),
          padding: "32px 40px",
          display: "flex",
          alignItems: "center",
          gap: 28,
          boxShadow: glow(accent, recipe.shadowMode === "hard"),
        }}
      >
        {step != null ? (
          <div
            style={{
              minWidth: 92,
              height: 92,
              borderRadius: 24,
              background: accent,
              color: "#fff",
              fontSize: 56,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {step}
          </div>
        ) : null}
        <div style={{ color: "#fff", fontSize: 46, fontWeight: 800, lineHeight: 1.2 }}>
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
