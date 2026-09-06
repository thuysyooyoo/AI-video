/**
 * B-roll hook stack (workflow B) — the classic TikTok "text over footage" format:
 *   1. hook title: 1-2 lines, each on its own dark rounded strip, rounded chunky
 *      font; line colors come from the theme (highlight then captionColor)
 *   2. sub-hook: handwritten script line (usually in parentheses)
 *   3. CTA: small handwritten line, may carry emoji ("Chi tiết ở caption 👇👇")
 * Theme variation = colors + boldness only, per owner spec.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ROUND_FONT, SCRIPT_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from "../fonts";
import { useStyle } from "../style-context";

/** Hook title: stacked strips near the top. Lines from graphic.items (or text split by |). */
export const BrollHookTitle: React.FC<{ lines: string[]; accent: string }> = ({ lines, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "13%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 980 }}>
        {lines.map((line, i) => {
          const s = spring({ frame: frame - i * 5, fps, config: { damping: 13, mass: 0.6 } });
          // line 1 carries the theme highlight (yellow in the reference), the
          // rest stay captionColor — "đổi màu và cách bold" is all theme-driven
          const color = i === 0 ? recipe.highlightColor : recipe.captionColor;
          return (
            <div
              key={i}
              style={{
                transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                opacity: s,
                background: "rgba(10,10,12,0.88)",
                borderRadius: 12,
                padding: "10px 30px 12px",
                fontFamily: ROUND_FONT,
                fontWeight: 800,
                // shrink long lines instead of overflowing the safe width
                fontSize: line.length > 34 ? 42 : line.length > 26 ? 50 : 58,
                color,
                textAlign: "center",
                lineHeight: VI_SAFE_LINE_HEIGHT,
                paddingTop: `calc(10px + ${VI_DIACRITIC_PAD})`,
                textShadow: "0 3px 10px rgba(0,0,0,0.4)",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Handwritten sub-hook line(s), sits in the lower-middle area. */
export const BrollSubHook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();
  const s = spring({ frame: frame - 12, fps, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "62%",
          maxWidth: 760,
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
          fontFamily: SCRIPT_FONT,
          fontSize: 42,
          color: recipe.captionColor,
          textAlign: "center",
          lineHeight: 1.35,
          WebkitTextStroke: "1px rgba(0,0,0,0.55)",
          paintOrder: "stroke fill",
          textShadow: "0 3px 12px rgba(0,0,0,0.65)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Small handwritten CTA with a gentle idle bob (emoji welcome: "👇👇"). */
export const BrollCta: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();
  const s = spring({ frame: frame - 24, fps, config: { damping: 15 } });
  const bob = Math.sin(frame / 14) * 4;
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "71.5%",
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [18, 0]) + bob}px)`,
          fontFamily: SCRIPT_FONT,
          fontSize: 34,
          color: recipe.captionColor,
          textAlign: "center",
          WebkitTextStroke: "1px rgba(0,0,0,0.5)",
          paintOrder: "stroke fill",
          textShadow: "0 3px 10px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
