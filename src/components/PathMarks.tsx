/**
 * Hand-drawn SVG path emphasis marks — premium, abstract, no clipart.
 * A stroke "draws itself" (animated dash) around/under a keyword to emphasise it,
 * the way a pro editor circles or underlines a word. Uses evolvePath for the
 * draw-on effect. These are vector marks, fully on-brand (accent colored).
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { voicePop, grammar } from "../anim";
import { useStyle } from "../style-context";
import { topBandStyle, faceAwareTopPad, useLayout } from "../layout";
import { DISPLAY_FONT } from "../fonts";

type MarkKind = "circle" | "underline" | "arrow";

const PATHS: Record<MarkKind, string> = {
  // rough hand-drawn ellipse around a word
  circle:
    "M 60 70 C 120 30, 480 30, 540 70 C 590 105, 560 150, 480 160 C 360 175, 120 172, 70 150 C 25 130, 30 95, 70 66",
  // wavy underline
  underline: "M 40 30 C 160 10, 320 50, 460 25 C 500 18, 540 30, 560 28",
  // arrow pointing down-right to the word
  arrow: "M 40 30 C 140 40, 220 60, 300 120 M 300 120 L 270 95 M 300 120 L 320 85",
};

/** Keyword with an animated drawn mark behind/under it. */
export const PathMark: React.FC<{
  text: string;
  accent: string;
  kind?: MarkKind;
}> = ({ text, accent, kind = "circle" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  // GAP B: mark grammar — opacity only; SVG stroke draw-on stays as the entrance character
  const g = grammar("mark", frame, fps, durationInFrames);
  const e = g.opacity;
  const draw = voicePop(frame, fps, recipe.motionVoice);
  const d = PATHS[kind];
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    interpolate(draw, [0, 1], [0, 1]),
    d,
  );

  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct, 30), opacity: e }}>
      <div style={{ position: "relative", display: "inline-block", padding: "0 40px" }}>
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontSize: 84,
            textTransform: "uppercase",
            color: "#fff",
            textShadow: "0 6px 20px rgba(0,0,0,0.55)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {text}
        </div>
        <svg
          viewBox="0 0 600 200"
          style={{
            position: "absolute",
            left: "50%",
            top: kind === "underline" ? "78%" : "50%",
            transform: "translate(-50%, -50%)",
            width: "130%",
            height: kind === "underline" ? "60%" : "150%",
            overflow: "visible",
            zIndex: 1,
          }}
        >
          <path
            d={d}
            fill="none"
            stroke={accent}
            strokeWidth={kind === "circle" ? 9 : 12}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 8px ${accent}aa)` }}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
