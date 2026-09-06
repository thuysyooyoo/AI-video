/**
 * Advanced motion-graphics — Tier 1 (self-generated, no external assets).
 * Polished enter+exit animation: spring overshoot in, idle float, ease-out exit,
 * colored glow for depth. All driven by spring/interpolate; fill text/number only.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enterExit, voicePop, floatY, glow } from "../anim";
import { topBandStyle, faceAwareTopPad, useLayout } from "../layout";
import { useStyle } from "../style-context";

/** Callout card with accent bar — lives in TOP band (above face/caption). */
export const AnimatedCallout: React.FC<{
  text: string;
  accent: string;
  anchor?: "top" | "center" | "bottom";
}> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames);
  const s = voicePop(frame, fps, recipe.motionVoice);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct) }}>
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-3, 0])}deg) translateY(${floatY(frame)}px)`,
          opacity: e,
          background: "#fff",
          borderLeft: `12px solid ${accent}`,
          color: "#141414",
          fontSize: 48,
          fontWeight: 800,
          padding: "20px 32px",
          borderRadius: 20,
          maxWidth: 820,
          textAlign: "left",
          boxShadow: glow(accent, true),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Highlighter-pen reveal: text revealed by a colored bar wiping across. */
export const HighlightReveal: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames);
  const wipe = voicePop(frame, fps, recipe.motionVoice);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 40), opacity: e }}>
      <div style={{ position: "relative", display: "inline-block", padding: "10px 22px", transform: `translateY(${floatY(frame, 4)}px)` }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: accent,
            transformOrigin: "left center",
            transform: `scaleX(${wipe})`,
            borderRadius: 10,
            boxShadow: glow(accent),
          }}
        />
        <span style={{ position: "relative", color: wipe > 0.5 ? "#fff" : "#141414", fontSize: 78, fontWeight: 900 }}>
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Big number counter that rolls up with glow — for stats/prices. */
export const NumberCounter: React.FC<{
  value: number;
  suffix?: string;
  label?: string;
  accent: string;
}> = ({ value, suffix = "", label = "", accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames);
  const s = voicePop(frame, fps, recipe.motionVoice);
  const n = Math.round(interpolate(s, [0, 1], [0, value]));
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 10), opacity: e }}>
      <div style={{ textAlign: "center", transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) translateY(${floatY(frame)}px)` }}>
        <div style={{ color: accent, fontSize: 150, fontWeight: 900, textShadow: glow(accent, true) }}>
          {n}
          {suffix}
        </div>
        {label ? <div style={{ color: "#fff", fontSize: 48, fontWeight: 700 }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** Progress bar that fills with a glow — visual rhythm/structure marker. */
export const ProgressBar: React.FC<{ accent: string; label?: string }> = ({ accent, label }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames);
  const p = voicePop(frame, fps, recipe.motionVoice);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 40), opacity: e }}>
      <div style={{ width: 760 }}>
        {label ? <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginBottom: 14 }}>{label}</div> : null}
        <div style={{ height: 24, background: "rgba(255,255,255,0.22)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${p * 100}%`, background: accent, borderRadius: 999, boxShadow: glow(accent) }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Badge that pops with a bounce + glow — for short tags. */
export const BadgePop: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames);
  const s = voicePop(frame, fps, recipe.motionVoice);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct), opacity: e }}>
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0, 1])}) rotate(${interpolate(s, [0, 1.3], [0, -6], { extrapolateRight: "clamp" })}deg) translateY(${floatY(frame, 5)}px)`,
          background: accent,
          color: "#fff",
          fontSize: 56,
          fontWeight: 900,
          padding: "16px 38px",
          borderRadius: 999,
          boxShadow: glow(accent, true),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
