/**
 * Semantic metaphor marks (P5) — self-drawn SVG that EXPLAINS a concept (gears=process,
 * lightbulb=idea), filling the gap when a clip has no numbers (counter/stat useless).
 * NOT clipart / emoji / icon-font. Material is recipe-driven (the real differentiator):
 *   noir (glass-dark) → wireframe stroke + glow, no fill
 *   bloom (glass-light) → soft-filled shape
 * Mirrors IllusMark mechanics (enterExit, popSpring, face-safe band). <200 LOC.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { voicePop, grammar } from "../anim";
import { faceAwareTopPad, useLayout } from "../layout";
import { useStyle } from "../style-context";

export const isMetaphorKind = (kind?: string): boolean =>
  !!kind && kind.startsWith("metaphor-");

/** Per-metaphor SVG primitives. Drawn in a 240x240 viewBox, centered. */
const SHAPES: Record<string, (stroke: string, fill: string, sw: number) => React.ReactNode> = {
  // gears = process / "cách làm / quy trình"
  "metaphor-process": (stroke, fill, sw) => (
    <>
      {[{ cx: 95, cy: 120, r: 46 }, { cx: 165, cy: 150, r: 32 }].map((g, gi) => (
        <g key={gi}>
          <circle cx={g.cx} cy={g.cy} r={g.r} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx={g.cx} cy={g.cy} r={g.r * 0.42} fill="none" stroke={stroke} strokeWidth={sw} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={g.cx + Math.cos(a) * g.r} y1={g.cy + Math.sin(a) * g.r}
              x2={g.cx + Math.cos(a) * (g.r + sw * 1.6)} y2={g.cy + Math.sin(a) * (g.r + sw * 1.6)}
              stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
          })}
        </g>
      ))}
    </>
  ),
  // stopwatch = speed / "nhanh / tức thì"
  "metaphor-speed": (stroke, fill, sw) => (
    <>
      <circle cx={120} cy={135} r={64} fill={fill} stroke={stroke} strokeWidth={sw} />
      <rect x={104} y={52} width={32} height={18} rx={6} fill={stroke} />
      <line x1={120} y1={135} x2={120} y2={92} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1={120} y1={135} x2={156} y2={150} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {[200, 215, 230].map((x, i) => (
        <line key={i} x1={x} y1={120 + i * 16} x2={x + 22} y2={120 + i * 16} stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" opacity={0.7} />
      ))}
    </>
  ),
  // shield + check = quality / "chuẩn / loại 1 / đẹp"
  "metaphor-quality": (stroke, fill, sw) => (
    <>
      <path d="M120 56 L186 86 V140 C186 180 156 206 120 220 C84 206 54 180 54 140 V86 Z"
        fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M92 134 L114 158 L156 104" fill="none" stroke={stroke} strokeWidth={sw * 1.1} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // coin stack = money / "giá / lãi"
  "metaphor-money": (stroke, fill, sw) => (
    <>
      {[178, 146, 114].map((y, i) => (
        <g key={i}>
          <ellipse cx={120} cy={y} rx={62} ry={22} fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
      ))}
      <text x={120} y={122} fontSize={34} fontWeight={900} fill={stroke} textAnchor="middle">$</text>
    </>
  ),
  // lightbulb = idea / "mẹo / bí quyết"
  "metaphor-idea": (stroke, fill, sw) => (
    <>
      <circle cx={120} cy={110} r={56} fill={fill} stroke={stroke} strokeWidth={sw} />
      <rect x={100} y={162} width={40} height={30} rx={6} fill={fill} stroke={stroke} strokeWidth={sw} />
      <line x1={104} y1={178} x2={136} y2={178} stroke={stroke} strokeWidth={sw * 0.7} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={120 + Math.cos(a) * 72} y1={110 + Math.sin(a) * 72}
          x2={120 + Math.cos(a) * 92} y2={110 + Math.sin(a) * 92}
          stroke={stroke} strokeWidth={sw} strokeLinecap="round" opacity={0.8} />;
      })}
    </>
  ),
};

export const MetaphorMark: React.FC<{ kind: string; accent: string }> = ({ kind, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { faceCenterYPct } = useLayout();
  const recipe = useStyle();
  // GAP B: mark grammar — opacity-only envelope; popSpring-style draw stays in SVG scale
  const gm = grammar("mark", frame, fps, durationInFrames);
  const e = gm.opacity;
  const s = voicePop(frame, fps, recipe.motionVoice);
  const padTop = faceAwareTopPad(faceCenterYPct, 0, 240);

  // recipe-driven material: noir → wireframe (no fill) + glow; bloom → soft-filled
  const wireframe = recipe.surface === "glass-dark" || recipe.shadowMode === "hard";
  const stroke = accent;
  const fill = wireframe ? "none" : `${accent}33`;
  const sw = wireframe ? 7 : 5;
  const draw = SHAPES[kind] ?? SHAPES["metaphor-idea"];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: padTop, opacity: e }}>
      <svg width={300} height={300} viewBox="0 0 240 240"
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`,
          filter: wireframe ? `drop-shadow(0 0 12px ${accent}cc)` : `drop-shadow(0 6px 16px rgba(0,0,0,0.4))`,
        }}>
        {draw(stroke, fill, sw)}
      </svg>
    </AbsoluteFill>
  );
};
