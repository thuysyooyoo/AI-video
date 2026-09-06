/**
 * Multi-layer graphic shell — wraps a graphic's content with depth layers so it
 * looks "produced", not flat:
 *   layer 0: soft gradient blob backing (depth)
 *   layer 1: animated dot particles drifting (life)
 *   layer 2: accent corner ticks that fly in (framing)
 *   layer 3: the content (children)
 * All frame-driven & deterministic. Use inside any top-band graphic.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { popSpring, floatY } from "../anim";

/** Soft radial gradient blob behind content — adds depth without a hard box. */
export const BackingBlob: React.FC<{ accent: string; accent2: string; w?: number; h?: number }> = ({
  accent,
  accent2,
  w = 760,
  h = 360,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps);
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        left: "50%",
        top: "50%",
        transform: `translate(-50%,-50%) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        opacity: interpolate(s, [0, 1], [0, 0.55]),
        background: `radial-gradient(ellipse at 40% 40%, ${accent}66, ${accent2}22 55%, transparent 72%)`,
        filter: "blur(18px)",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  );
};

/** Drifting dot particles around the content — subtle motion/life. */
export const Particles: React.FC<{ accent: string; count?: number }> = ({ accent, count = 10 }) => {
  const frame = useCurrentFrame();
  // deterministic pseudo-random positions from index
  const dots = Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rx = (seed / 233280) * 2 - 1; // -1..1
    const ry = (((i * 4 + 7) % 13) / 13) * 2 - 1;
    const drift = floatY(frame + i * 20, 10 + (i % 3) * 4, 60 + i * 8);
    const size = 6 + (i % 3) * 4;
    return { x: 50 + rx * 42, y: 50 + ry * 38, drift, size, key: i };
  });
  return (
    <>
      {dots.map((d) => (
        <div
          key={d.key}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: accent,
            opacity: 0.45,
            transform: `translateY(${d.drift}px)`,
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
};

/** Accent corner ticks that fly in to frame the content. */
export const CornerTicks: React.FC<{ accent: string; w?: number; h?: number }> = ({
  accent,
  w = 700,
  h = 300,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps);
  const off = interpolate(s, [0, 1], [40, 0]);
  const op = interpolate(s, [0, 1], [0, 0.9]);
  const tick = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 46, height: 46, borderColor: accent, opacity: op, ...style }} />
  );
  return (
    <div style={{ position: "absolute", width: w, height: h, left: "50%", top: "50%",
      transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
      {tick({ top: -off, left: -off, borderTop: `5px solid`, borderLeft: `5px solid`, borderTopLeftRadius: 8 })}
      {tick({ bottom: -off, right: -off, borderBottom: `5px solid`, borderRight: `5px solid`, borderBottomRightRadius: 8 })}
    </div>
  );
};

/** Convenience: all backdrop layers behind a graphic (blob + particles + ticks). */
export const ShellBackdrop: React.FC<{ accent: string; accent2: string }> = ({ accent, accent2 }) => (
  <>
    <BackingBlob accent={accent} accent2={accent2} />
    <Particles accent={accent} />
    <CornerTicks accent={accent} />
  </>
);
