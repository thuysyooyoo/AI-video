/**
 * Data-visualization cards — HTML/CSS visuals that convey DETAILED info (tables,
 * stat comparisons, spec lists) so viewers grasp specifics, not just a slogan.
 * Each is built with a 4-5 layer effect stack via <FxStack> for a "sịn" look:
 *   1) gradient glow blob backing   2) gradient border frame   3) glass panel
 *   4) animated scan-line sheen      5) content (staggered rows)
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { voicePop, grammar, glow } from "../anim";
import { useStyle } from "../style-context";
import { DISPLAY_FONT, BODY_FONT } from "../fonts";

const grad = (a: string, b: string) => `linear-gradient(120deg, ${a}, ${b})`;

/** 4-5 layer effect wrapper around a card — premium depth + animated sheen. */
const FxStack: React.FC<{
  accent: string;
  accent2: string;
  e: number;
  slideX?: number;
  w?: number;
  children: React.ReactNode;
}> = ({ accent, accent2, e, slideX = 0, w = 880, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();
  const s = voicePop(frame, fps, recipe.motionVoice);
  const sheen = (frame % (fps * 3)) / (fps * 3); // 0..1 loop every 3s (fps-independent)
  return (
    <AbsoluteFill style={{ opacity: e }}>
      {/* dim+blur the video behind so the card reads */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(7px)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: w, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])}) translateX(${slideX}px)` }}>
          {/* layer 1: glow blob */}
          <div style={{ position: "absolute", inset: -60, background: `radial-gradient(ellipse, ${accent}55, transparent 70%)`, filter: "blur(40px)" }} />
          {/* layer 2: gradient border frame */}
          <div style={{ position: "relative", padding: 4, borderRadius: 30, background: grad(accent, accent2), boxShadow: glow(accent, true) }}>
            {/* layer 3: glass panel */}
            <div style={{ position: "relative", borderRadius: 26, overflow: "hidden",
              background: "rgba(18,18,24,0.92)", backdropFilter: "blur(12px)", padding: "30px 34px" }}>
              {/* layer 4: moving sheen */}
              <div style={{ position: "absolute", top: 0, bottom: 0, width: 160,
                left: `${interpolate(sheen, [0, 1], [-20, 120])}%`,
                background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.10), transparent)",
                pointerEvents: "none" }} />
              {/* layer 5: content */}
              <div style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Spec / info table — rows of label : value, staggered reveal. */
export const InfoTable: React.FC<{
  title?: string;
  rows: { k: string; v: string }[];
  accent: string;
  accent2: string;
}> = ({ title, rows, accent, accent2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  // GAP B: data grammar — firm slide-in
  const g = grammar("data", frame, fps, durationInFrames);
  const e = g.opacity;
  return (
    <FxStack accent={accent} accent2={accent2} e={e} slideX={g.slideX}>
      {title ? (
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: 46, fontWeight: 900, color: "#fff",
          textTransform: "uppercase", marginBottom: 18, textAlign: "center" }}>{title}</div>
      ) : null}
      {rows.slice(0, 5).map((r, i) => {
        const sp = voicePop(frame, fps, recipe.motionVoice, 6 + i * 5);
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 6px", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
            opacity: sp, transform: `translateX(${interpolate(sp, [0, 1], [40, 0])}px)` }}>
            <span style={{ fontFamily: BODY_FONT, fontSize: 36, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{r.k}</span>
            <span style={{ fontFamily: DISPLAY_FONT, fontSize: 40, fontWeight: 800, color: accent }}>{r.v}</span>
          </div>
        );
      })}
    </FxStack>
  );
};

/** Stat comparison — two metrics side by side with bars (vd before/after numbers). */
export const StatCompare: React.FC<{
  title?: string;
  leftLabel: string;
  leftVal: number;
  rightLabel: string;
  rightVal: number;
  unit?: string;
  accent: string;
  accent2: string;
}> = ({ title, leftLabel, leftVal, rightLabel, rightVal, unit = "", accent, accent2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  // GAP B: data grammar — firm slide-in
  const gm = grammar("data", frame, fps, durationInFrames);
  const e = gm.opacity;
  const p = voicePop(frame, fps, recipe.motionVoice);
  const max = Math.max(leftVal, rightVal, 1);
  const bar = (label: string, val: number, c: string) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: BODY_FONT, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{label}</div>
      <div style={{ height: 54, background: "rgba(255,255,255,0.12)", borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ height: "100%", width: `${interpolate(p, [0, 1], [0, (val / max) * 100])}%`,
          background: c, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "flex-end",
          paddingRight: 14, color: "#fff", fontFamily: DISPLAY_FONT, fontSize: 30, fontWeight: 900 }}>
          {Math.round(interpolate(p, [0, 1], [0, val]))}{unit}
        </div>
      </div>
    </div>
  );
  return (
    <FxStack accent={accent} accent2={accent2} e={e} slideX={gm.slideX} w={900}>
      {title ? (
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: 44, fontWeight: 900, color: "#fff",
          textTransform: "uppercase", marginBottom: 22, textAlign: "center" }}>{title}</div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {bar(leftLabel, leftVal, "rgba(255,255,255,0.4)")}
        {bar(rightLabel, rightVal, accent)}
      </div>
    </FxStack>
  );
};
