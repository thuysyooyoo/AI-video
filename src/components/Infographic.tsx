/**
 * Designed infographic components — structured motion-graphics that VISUALIZE
 * content (steps, lists, comparisons, stats), the way a motion designer composes
 * them: multi-element, layered, staggered reveal, gradient + depth. Pure React/CSS,
 * theme-colored. This is "graphics design", not single-stroke vector.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enterExit, voicePop, grammar, glow } from "../anim";
import { useStyle } from "../style-context";
import { DISPLAY_FONT, BODY_FONT } from "../fonts";

const grad = (a: string, b: string) => `linear-gradient(120deg, ${a}, ${b})`;

const InfoStage: React.FC<{ e: number; children: React.ReactNode; align?: "center" | "flex-start"; placement?: 'center' | 'top-safe' }> = ({
  e,
  children,
  align = "center",
  placement = 'top-safe',
}) => {
  const isCenter = placement === 'center';
  return (
    <AbsoluteFill style={{ opacity: e }}>
      {isCenter ? (
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} />
      ) : (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 32%, transparent 48%)" }} />
      )}
      <AbsoluteFill style={{ alignItems: align, justifyContent: isCenter ? "center" : "flex-start", paddingTop: isCenter ? 0 : 180, paddingLeft: align === "flex-start" ? 90 : 0 }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Numbered step flow (1→2→3) — staggered cards with connecting flow. */
export const StepFlow: React.FC<{ steps: string[]; accent: string; accent2: string; placement?: 'center' | 'top-safe' }> = ({
  steps,
  accent,
  accent2,
  placement = 'top-safe',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  // GAP B: data grammar — step flows are structured data
  const g = grammar("data", frame, fps, durationInFrames);
  const e = g.opacity;
  const items = steps.slice(0, 4);
  const isCenter = placement === 'center';
  return (
    <InfoStage e={e} placement={placement}>
      <div style={{ display: "flex", flexDirection: "column", gap: isCenter ? 18 : 14, width: 880 }}>
        {items.map((s, i) => {
          const sp = voicePop(frame, fps, recipe.motionVoice, i * 6);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: isCenter ? 22 : 18,
                transform: `translateX(${interpolate(sp, [0, 1], [-120, 0])}px)`,
                opacity: sp,
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: isCenter ? 22 : 18,
                padding: isCenter ? "18px 26px" : "14px 22px",
                boxShadow: glow(accent),
              }}
            >
              <div style={{ minWidth: isCenter ? 72 : 56, height: isCenter ? 72 : 56, borderRadius: isCenter ? 18 : 14, background: grad(accent, accent2),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: DISPLAY_FONT, fontSize: isCenter ? 44 : 36, fontWeight: 900, color: "#fff" }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: BODY_FONT, fontSize: isCenter ? 40 : 34, fontWeight: 700, color: "#fff" }}>{s}</div>
            </div>
          );
        })}
      </div>
    </InfoStage>
  );
};

/** Two-column comparison (vs) — left/right cards slide in from sides. */
export const Comparison: React.FC<{ left: string; right: string; accent: string; accent2: string; placement?: 'center' | 'top-safe' }> = ({
  left,
  right,
  accent,
  accent2,
  placement = 'top-safe',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  const gm = grammar("data", frame, fps, durationInFrames);
  const e = gm.opacity;
  const sp = voicePop(frame, fps, recipe.motionVoice);
  const isCenter = placement === 'center';
  const card = (txt: string, c: string, from: number, label: string) => (
    <div style={{ flex: 1, transform: `translateX(${interpolate(sp, [0, 1], [from, 0])}px)`,
      background: "rgba(255,255,255,0.10)", backdropFilter: "blur(14px)",
      border: `2px solid ${c}`, borderRadius: 22, padding: isCenter ? "26px 20px" : "22px 18px", textAlign: "center" }}>
      <div style={{ fontFamily: DISPLAY_FONT, fontSize: isCenter ? 28 : 26, fontWeight: 900, color: c, textTransform: "uppercase", marginBottom: isCenter ? 10 : 8 }}>{label}</div>
      <div style={{ fontFamily: BODY_FONT, fontSize: isCenter ? 38 : 34, fontWeight: 700, color: "#fff" }}>{txt}</div>
    </div>
  );
  return (
    <InfoStage e={e} placement={placement}>
      <div style={{ display: "flex", gap: 16, width: 920, alignItems: "stretch", position: "relative" }}>
        {card(left, accent, -200, "Trước")}
        <div style={{ alignSelf: "center", fontFamily: DISPLAY_FONT, fontSize: isCenter ? 48 : 44, fontWeight: 900,
          color: "#fff", transform: `scale(${sp})` }}>VS</div>
        {card(right, accent2, 200, "Sau")}
      </div>
    </InfoStage>
  );
};

/** Bulleted list reveal — items pop one by one with accent bullets in top safe zone. */
export const ListReveal: React.FC<{ items: string[]; accent: string; rank?: number; placement?: 'center' | 'top-safe' }> = ({ items, accent, rank, placement = 'top-safe' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  const g = grammar("data", frame, fps, durationInFrames);
  const e = g.opacity;
  const isCenter = placement === 'center';
  return (
    <InfoStage e={e} align="flex-start" placement={placement}>
      <div style={{ display: "flex", flexDirection: "column", gap: isCenter ? 16 : 14 }}>
        {items.slice(0, 4).map((s, i) => {
          const sp = voicePop(frame, fps, recipe.motionVoice, i * 7);
          const isTop = rank != null && i === rank - 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: isCenter ? 18 : 16,
              transform: `translateX(${interpolate(sp, [0, 1], [-80, 0])}px)`, opacity: sp }}>
              <div style={{ width: isTop ? (isCenter ? 34 : 28) : (isCenter ? 26 : 22), height: isTop ? (isCenter ? 34 : 28) : (isCenter ? 26 : 22), borderRadius: isCenter ? 8 : 6,
                background: accent, boxShadow: glow(accent, isTop), transform: "rotate(45deg)", flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY_FONT, fontSize: isTop ? (isCenter ? 56 : 46) : (isCenter ? 48 : 40), fontWeight: isTop ? 900 : 800,
                color: "#fff", textShadow: `0 4px 14px rgba(0,0,0,${isCenter ? 0.6 : 0.8})` }}>{s}</span>
            </div>
          );
        })}
      </div>
    </InfoStage>
  );
};

/** Pro lower-third — designed name/label bar (multi-layer, accent block + text). */
export const LowerThirdPro: React.FC<{ title: string; subtitle?: string; accent: string; accent2: string }> = ({
  title,
  subtitle,
  accent,
  accent2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames, 12);
  const sp = voicePop(frame, fps, recipe.motionVoice);
  const w = interpolate(sp, [0, 1], [0, 100]);
  // sit ABOVE caption band (which is at ~28%) so the two don't collide / hit UI
  const padBottom = Math.round(height * 0.36);
  return (
    <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-end", paddingBottom: padBottom, paddingLeft: 70, opacity: e }}>
      <div style={{ position: "relative" }}>
        {/* accent block grows in */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: grad(accent, accent2), borderRadius: 8 }} />
        <div style={{ overflow: "hidden", width: `${w}%` }}>
          <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", padding: "14px 30px 14px 34px", borderRadius: "0 14px 14px 0", whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: DISPLAY_FONT, fontSize: 50, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>{title}</div>
            {subtitle ? <div style={{ fontFamily: BODY_FONT, fontSize: 30, fontWeight: 600, color: accent }}>{subtitle}</div> : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
