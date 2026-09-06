/**
 * Transition + ambient motion overlays — Tier 1.
 * Color-wipe between segments and a subtle animated gradient/zoom-line backdrop
 * that keeps the frame "moving" even on a static talking head.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Transition } from "../edl-types";

const msToFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// ColorWipe was removed: an opaque plate crossing the frame hides the speaker
// and reads as a render glitch on talking-head content. Legacy "color-wipe"
// entries in old EDLs fall back to ZoomBlur in TransitionLayer below.

const Flash: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = Math.max(1, Math.round(durationInFrames * 0.35));
  const opacity = interpolate(frame, [0, mid, durationInFrames], [0, 0.42 * intensity, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: color, opacity, mixBlendMode: "screen" }} />;
};

const ZoomBlur: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.28 * intensity;
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 50%, ${color}66, transparent 58%)`,
        transform: `scale(${1 + Math.sin(p * Math.PI) * 0.08})`,
        filter: `blur(${8 + 12 * intensity}px)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

export const TransitionLayer: React.FC<{
  transitions: Transition[];
  accent: string;
  accent2: string;
  highlight: string;
}> = ({ transitions, accent, accent2, highlight }) => {
  const { fps } = useVideoConfig();
  const colorFor = (t: Transition) =>
    t.colorRole === "accent2" ? accent2 : t.colorRole === "highlight" ? highlight : accent;
  return (
    <>
      {transitions.map((t, i) => {
        const from = msToFrames(t.startMs, fps);
        const dur = Math.max(1, msToFrames(t.endMs - t.startMs, fps));
        const color = colorFor(t);
        return (
          <Sequence key={`transition-${i}`} from={from} durationInFrames={dur}>
            {t.type === "flash" ? (
              <Flash color={color} intensity={t.intensity} />
            ) : (
              // zoom-blur, and legacy color-wipe entries downgraded to it
              <ZoomBlur color={color} intensity={t.intensity} />
            )}
          </Sequence>
        );
      })}
    </>
  );
};

/**
 * Bottom 30-35% blur + dark gradient vignette so captions are punchy, high-contrast,
 * and exceptionally readable over any footage (matching news/editorial viral reels).
 */
export const ReadabilityScrim: React.FC<{ mode?: 'subtle' | 'blur-vignette' }> = ({ mode = 'blur-vignette' }) => {
  if (mode === 'subtle') {
    return (
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Top subtle vignette for header/status safety */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "18%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
        }}
      />
      {/* Bottom 34% blur layer with gradient mask */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "36%",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* Bottom 36% dark vignette gradient: deep dark at bottom, fading to transparent towards center */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "38%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.76) 35%, rgba(0,0,0,0.35) 70%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
