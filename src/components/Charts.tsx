/**
 * Simple animated vector charts + keyword emphasis marks (SVG, no assets).
 * DonutStat / BarStat visualize a number; CircleMark / UnderlineMark draw a
 * hand-drawn-style emphasis around a keyword.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { voicePop, grammar, glow } from "../anim";
import { topBandStyle, faceAwareTopPad, useLayout } from "../layout";
import { useStyle } from "../style-context";

/** Donut showing a percentage value (e.g. "100%"). */
export const DonutStat: React.FC<{ value: number; label?: string; accent: string }> = ({
  value,
  label = "",
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  // GAP B: data grammar — firm slide-in, no overshoot (trustworthy data feel)
  const g = grammar("data", frame, fps, durationInFrames);
  const e = g.opacity;
  const p = voicePop(frame, fps, recipe.motionVoice);
  const r = 120;
  const circ = 2 * Math.PI * r;
  const dash = interpolate(p, [0, 1], [0, (value / 100) * circ]);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 10), opacity: e }}>
      <div style={{ textAlign: "center", transform: `translateX(${g.slideX}px)` }}>
        <svg width={300} height={300} viewBox="0 0 300 300">
          <circle cx="150" cy="150" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="28" />
          <circle
            cx="150" cy="150" r={r} fill="none" stroke={accent} strokeWidth="28"
            strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 150 150)"
          />
          <text x="150" y="168" textAnchor="middle" fontSize="72" fontWeight="900" fill="#fff">
            {Math.round(interpolate(p, [0, 1], [0, value]))}%
          </text>
        </svg>
        {label ? <div style={{ color: "#fff", fontSize: 44, fontWeight: 700 }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** Horizontal bar that grows to a value — for comparisons/stats. */
export const BarStat: React.FC<{ value: number; label?: string; accent: string }> = ({
  value,
  label = "",
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  // GAP B: data grammar — firm, no overshoot
  const g = grammar("data", frame, fps, durationInFrames);
  const e = g.opacity;
  const p = voicePop(frame, fps, recipe.motionVoice);
  const pct = Math.min(value, 100);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 40), opacity: e }}>
      <div style={{ width: 780, transform: `translateX(${g.slideX}px)` }}>
        {label ? <div style={{ color: "#fff", fontSize: 42, fontWeight: 800, marginBottom: 16 }}>{label}</div> : null}
        <div style={{ height: 60, background: "rgba(255,255,255,0.18)", borderRadius: 16, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${interpolate(p, [0, 1], [0, pct])}%`,
              background: accent,
              borderRadius: 16,
              boxShadow: glow(accent),
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 18,
              color: "#fff",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            {Math.round(interpolate(p, [0, 1], [0, value]))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
