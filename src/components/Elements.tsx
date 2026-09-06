/**
 * Element graphics — animated VECTOR shapes (SVG/CSS), the "decorative + illustrative"
 * layer that makes a reel feel full & produced (not just styled text). No clipart,
 * no emoji fonts — every shape is drawn by path/CSS and colored by the theme accent.
 *
 * Two kinds:
 *  - Ambient decorative: drift behind/around content for the whole segment (sparkles,
 *    orbiting dotted ring, floating dots, rays) — subtle, low opacity.
 *  - Illustrative pop: fly in at a keyword to emphasise (curved arrow, bracket,
 *    drawn circle, check, cross, starburst) — accent-colored, short-lived.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { voicePop, grammar, floatY } from "../anim";
import { useStyle } from "../style-context";
import { faceAwareTopPad, useLayout } from "../layout";
import { MetaphorMark, isMetaphorKind } from "./Metaphors";

// ---------- AMBIENT DECORATIVE (full-segment, subtle) ----------

/** Sparkles + floating accent dots drifting across the frame — low opacity ambient. */
export const AmbientSparkles: React.FC<{ accent: string; accent2: string }> = ({
  accent,
  accent2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  // GAP B: ambient grammar — just fades in/out (no slide), idles naturally via floatY
  const g = grammar("ambient", frame, fps, durationInFrames);
  const e = g.opacity * 0.7;
  // face ellipse: center (~48%, faceCenterYPct), radii ~22% x 26% → dim sparkles inside
  const inFace = (x: number, y: number) =>
    ((x - 48) / 22) ** 2 + ((y - faceCenterYPct) / 26) ** 2 < 1;
  const items = Array.from({ length: 14 }, (_, i) => {
    const seed = (i * 7919) % 1000;
    const x = (seed % 100);
    const y = ((seed * 3) % 100);
    const drift = floatY(frame + i * 14, 14 + (i % 4) * 6, 70 + i * 9);
    const tw = 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 23) / 18));
    const star = i % 3 === 0;
    const sz = star ? 26 : 8 + (i % 3) * 3;
    const faceDim = inFace(x, y) ? 0.25 : 1; // don't clutter the speaker's face
    return { x, y, drift, tw: tw * faceDim, sz, star, c: i % 2 ? accent2 : accent, key: i };
  });
  return (
    <AbsoluteFill style={{ opacity: e, pointerEvents: "none" }}>
      {items.map((it) =>
        it.star ? (
          <svg key={it.key} width={it.sz} height={it.sz} viewBox="0 0 24 24"
            style={{ position: "absolute", left: `${it.x}%`, top: `${it.y}%`,
              transform: `translateY(${it.drift}px) rotate(${frame + it.key * 30}deg)`, opacity: it.tw * 0.55 }}>
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill={it.c} />
          </svg>
        ) : (
          <div key={it.key} style={{ position: "absolute", left: `${it.x}%`, top: `${it.y}%`,
            width: it.sz, height: it.sz, borderRadius: "50%", background: it.c,
            opacity: it.tw * 0.4, transform: `translateY(${it.drift}px)`, filter: "blur(1px)" }} />
        )
      )}
    </AbsoluteFill>
  );
};

/** Slowly orbiting dotted ring — premium ambient framing element. */
// OrbitRing removed by owner decision (decorative ring over the speaker = noise)


// ---------- ILLUSTRATIVE POP (keyword emphasis) ----------

type IllusKind =
  | "curved-arrow" | "bracket" | "circle-draw" | "check" | "cross" | "starburst"
  | "metaphor-process" | "metaphor-speed" | "metaphor-quality" | "metaphor-money" | "metaphor-idea";

const ILLUS_PATHS: Record<string, string> = {
  "curved-arrow": "M 30 200 C 120 60, 320 60, 380 150 M 380 150 L 348 120 M 380 150 L 408 112",
  "circle-draw": "M 80 100 C 160 40, 460 40, 520 110 C 575 170, 540 230, 440 250 C 300 280, 120 272, 70 230 C 20 195, 25 130, 80 96",
  check: "M 60 130 L 130 200 L 260 60",
  cross: "M 60 60 L 220 220 M 220 60 L 60 220",
};

/** A drawn illustrative mark that "draws itself" via animated stroke at a keyword. */
export const IllusMark: React.FC<{ kind?: IllusKind; accent: string }> = ({
  kind = "circle-draw",
  accent,
}) => {
  // semantic metaphors render via MetaphorMark (recipe-driven material) — P5
  if (isMetaphorKind(kind)) return <MetaphorMark kind={kind} accent={accent} />;
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  // GAP B: mark grammar — opacity only; draw-on is the entrance character
  const gm = grammar("mark", frame, fps, durationInFrames);
  const e = gm.opacity;
  const draw = voicePop(frame, fps, recipe.motionVoice);
  // place mark in the free band above/below the face, not on it
  const padTop = faceAwareTopPad(faceCenterYPct, 0, 240);

  if (kind === "starburst") {
    const rays = 12;
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: padTop, opacity: e }}>
        <svg width={460} height={460} viewBox="0 0 460 460" style={{ transform: `scale(${interpolate(draw, [0, 1], [0.3, 1])}) rotate(${interpolate(draw, [0, 1], [-30, 0])}deg)` }}>
          {Array.from({ length: rays }, (_, i) => {
            const a = (i / rays) * Math.PI * 2;
            const r1 = 90, r2 = 200;
            return <line key={i} x1={230 + Math.cos(a) * r1} y1={230 + Math.sin(a) * r1}
              x2={230 + Math.cos(a) * r2} y2={230 + Math.sin(a) * r2}
              stroke={accent} strokeWidth="10" strokeLinecap="round" opacity={0.85} />;
          })}
        </svg>
      </AbsoluteFill>
    );
  }

  const d = ILLUS_PATHS[kind] ?? ILLUS_PATHS["circle-draw"];
  const { strokeDasharray, strokeDashoffset } = evolvePath(interpolate(draw, [0, 1], [0, 1]), d);
  const vb = kind === "curved-arrow" ? "0 0 440 260" : kind === "circle-draw" ? "0 0 600 320" : "0 0 280 280";
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: padTop, opacity: e }}>
      <svg width={kind === "circle-draw" ? 620 : 440} viewBox={vb} style={{ overflow: "visible" }}>
        <path d={d} fill="none" stroke={accent} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 10px ${accent}aa)` }} />
      </svg>
    </AbsoluteFill>
  );
};
