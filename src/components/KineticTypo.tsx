/**
 * High-end kinetic typography — the "luxury" graphic layer (no icons).
 * Few but refined: gradient text, mask wipe reveals, word stagger, thin glass
 * panels. This is how premium / Hormozi-style reels emphasise points — type, not clipart.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { enterExit, voicePop, floatY, entryByFamily } from "../anim";
import { topBandStyle, faceAwareTopPad, useLayout } from "../layout";
import { DISPLAY_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from "../fonts";
import { ShellBackdrop } from "./GraphicShell";
import { useStyle } from "../style-context";
import { pickEmphasisIndex } from "../text-emphasis";

const grad = (a: string, b: string) => `linear-gradient(100deg, ${a}, ${b})`;

/** Word-stagger statement: big words rise + fade in one by one, with a gradient sweep. */
export const KineticStatement: React.FC<{
  text: string;
  accent: string;
  accent2: string;
}> = ({ text, accent, accent2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames, 14);
  const entryStyle = entryByFamily(recipe.entryAnimFamily, frame, fps, recipe.motionVoice);
  const words = text.split(" ");
  // emphasise a CONTENT word (number/noun), not whatever sits mid-sentence
  const emphasisIdx = pickEmphasisIndex(words);
  const solid = recipe.textFx === "solid";
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 20), opacity: e }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <ShellBackdrop accent={accent} accent2={accent2} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 18px",
          justifyContent: "center",
          maxWidth: 920,
          fontFamily: DISPLAY_FONT,
          fontWeight: solid ? 800 : 900,
          fontSize: 90 * recipe.textScale,
          textTransform: recipe.captionCase === "sentence" ? "none" : "uppercase",
          lineHeight: VI_SAFE_LINE_HEIGHT,
          paddingTop: VI_DIACRITIC_PAD,
          // entryByFamily: apply transform only; opacity stays on outer enterExit envelope
          transform: entryStyle.transform,
        }}
      >
        {words.map((w, i) => {
          const s = voicePop(frame, fps, recipe.motionVoice, i * 4);
          const emphasised = i === emphasisIdx;
          // solid textFx: emphasis = flat accent color (no bg-clip gradient —
          // a two-color sweep inside one word reads as machine-made)
          const emphasisStyle = emphasised
            ? solid
              ? { color: accent }
              : {
                  backgroundImage: grad(accent, accent2),
                  WebkitBackgroundClip: "text" as const,
                  backgroundClip: "text",
                  color: "transparent",
                }
            : { color: "#fff" };
          return (
            <span
              key={i}
              style={{
                transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
                opacity: s,
                ...emphasisStyle,
                WebkitTextStroke: emphasised || solid ? "0" : "2px rgba(0,0,0,0.5)",
                textShadow: "0 6px 22px rgba(0,0,0,0.5)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      </div>
    </AbsoluteFill>
  );
};

/** Mask-wipe reveal: text wiped in left→right behind a moving edge (premium reveal). */
export const MaskReveal: React.FC<{ text: string; accent: string; accent2: string }> = ({
  text,
  accent,
  accent2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames, 12);
  const wipe = interpolate(voicePop(frame, fps, recipe.motionVoice), [0, 1], [0, 100]);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 40), opacity: e }}>
      <div style={{ position: "relative", transform: `translateY(${floatY(frame, 4)}px)` }}>
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: recipe.textFx === "solid" ? 800 : 900,
            fontSize: 84,
            textTransform: recipe.captionCase === "sentence" ? "none" : "uppercase",
            color: "#fff",
            WebkitTextStroke: recipe.textFx === "solid" ? "0" : "2px rgba(0,0,0,0.4)",
            // reveal mask
            clipPath: `inset(0 ${100 - wipe}% 0 0)`,
            textShadow: "0 6px 22px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
        {/* moving accent edge — solid textFx keeps a single flat color */}
        <div
          style={{
            position: "absolute",
            top: -6,
            bottom: -6,
            left: `${wipe}%`,
            width: 8,
            background: recipe.textFx === "solid" ? accent : grad(accent, accent2),
            opacity: wipe < 99 ? 1 : 0,
            boxShadow: `0 0 20px ${accent}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Thin glass strip with gradient keyword — subtle, premium lower emphasis. */
export const GlassStrip: React.FC<{ text: string; accent: string; accent2: string }> = ({
  text,
  accent,
  accent2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames, 12);
  const s = voicePop(frame, fps, recipe.motionVoice);
  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 30), opacity: e }}>
      <div
        style={{
          transform: `translateY(${interpolate(s, [0, 1], [-40, floatY(frame, 4)])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
          // recipe-driven blur/border/radius; gradient overlay kept (kinetic-typo look)
          background: `rgba(255,255,255,${recipe.glassOpacity})`,
          backdropFilter: `blur(${recipe.blurPx}px)`,
          WebkitBackdropFilter: `blur(${recipe.blurPx}px)`,
          border: `1px solid rgba(255,255,255,${recipe.borderIntensity})`,
          borderRadius: recipe.cardRadius,
          padding: "18px 40px",
          fontFamily: DISPLAY_FONT,
          fontWeight: recipe.textFx === "solid" ? 700 : 800,
          fontSize: 56,
          textTransform: recipe.captionCase === "sentence" ? "none" : undefined,
          // solid textFx: quiet glass + accent edge instead of a gradient wash
          ...(recipe.textFx === "solid"
            ? { borderLeft: `5px solid ${accent}` }
            : {
                backgroundImage: `linear-gradient(rgba(255,255,255,0.10),rgba(255,255,255,0.10)), ${grad(accent, accent2)}`,
                WebkitBackgroundClip: "padding-box" as const,
              }),
          color: "#fff",
          textShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
