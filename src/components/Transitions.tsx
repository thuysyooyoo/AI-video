/**
 * Transition + ambient motion overlays — Tier 1.
 * Supports 5 viral transition families matching TikTok/Reels short-form standards:
 *   1. Quick Cut (quick-cut, glitch-cut)
 *   2. Swipe / Slide (swipe-left, swipe-right, swipe-up)
 *   3. Zoom / Whip (zoom-blur, whip-pan)
 *   4. Blend / Mask (mask-circle, blend-fade)
 *   5. Color Flash (flash, color-flash, light-leak)
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Transition } from "../edl-types";
import {
  GlareIITwoLayer,
  PhoneRevealTwoLayer,
  PaperBallTwoLayer,
  GlitchTwoLayer,
  FadeDownTwoLayer,
  BlinkTwoLayer,
  WaveRightTwoLayer,
  SwipeLeftTwoLayer,
  ComicCutTwoLayer,
} from "./CapCutTwoLayerTransitions";

const msToFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// --- 1. Flash & Light Leaks ---
const Flash: React.FC<{ color?: string; intensity?: number }> = ({ color = "#FFFFFF", intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = Math.max(1, Math.round(durationInFrames * 0.3));
  const opacity = interpolate(frame, [0, mid, durationInFrames], [0, 0.45 * intensity, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: color, opacity, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

const ColorFlash: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = Math.max(1, Math.round(durationInFrames * 0.35));
  const opacity = interpolate(frame, [0, mid, durationInFrames], [0, 0.58 * intensity, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${color} 0%, ${color}88 45%, transparent 75%)`,
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const LightLeak: React.FC<{ color: string; accent2: string; intensity?: number }> = ({
  color,
  accent2,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.72 * intensity;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "screen", pointerEvents: "none" }}>
      {/* Top-left flare drifting down-right */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${color}EE 0%, ${color}66 40%, transparent 70%)`,
          transform: `translate(${p * 180}px, ${p * 140}px) scale(${1 + p * 0.2})`,
          filter: "blur(32px)",
        }}
      />
      {/* Bottom-right flare drifting up-left */}
      <div
        style={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 850,
          height: 850,
          borderRadius: "50%",
          background: `radial-gradient(circle at 60% 60%, ${accent2}DD 0%, ${accent2}55 45%, transparent 75%)`,
          transform: `translate(${-p * 140}px, ${-p * 160}px) scale(${1 + p * 0.15})`,
          filter: "blur(28px)",
        }}
      />
    </AbsoluteFill>
  );
};

// --- 2. Quick Cut & Glitch Cut ---
const QuickCut: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 2, durationInFrames], [0, 0.42 * intensity, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(circle at 50% 50%, #FFFFFF 0%, ${color}44 40%, transparent 80%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const GlitchCut: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = Math.sin(p * Math.PI) * 26 * intensity;
  const opacity = Math.sin(p * Math.PI) * 0.75 * intensity;

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      {/* Top 33% slice - cyan shifted */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "33.33%",
          transform: `translateX(${shift}px)`,
          background: "linear-gradient(90deg, rgba(0, 255, 255, 0.28) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Mid 33% slice - magenta/accent shifted */}
      <div
        style={{
          position: "absolute",
          top: "33.33%",
          left: 0,
          right: 0,
          height: "33.34%",
          transform: `translateX(${-shift * 1.35}px)`,
          background: `linear-gradient(90deg, transparent 40%, ${color}66 100%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* Bottom 33% slice - cyan shifted */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "33.33%",
          transform: `translateX(${shift * 0.75}px)`,
          background: "linear-gradient(90deg, rgba(0, 255, 255, 0.22) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 5px)",
          opacity: 0.45,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

// --- 3. Swipe / Slide (Kinetic Light Blade) ---
export const DirectionalSwipe: React.FC<{
  direction: "left" | "right" | "up" | "down";
  color: string;
  intensity?: number;
}> = ({ direction, color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.88 * intensity;

  if (direction === "up" || direction === "down") {
    const isUp = direction === "up";
    const yPct = interpolate(p, [0, 1], isUp ? [110, -40] : [-40, 110]);
    return (
      <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${yPct}%`,
            height: 380,
            background: isUp
              ? `linear-gradient(to top, transparent 0%, ${color}44 65%, ${color} 100%)`
              : `linear-gradient(to bottom, transparent 0%, ${color}44 65%, ${color} 100%)`,
            boxShadow: `0 0 45px 12px ${color}`,
            filter: "blur(6px)",
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>
    );
  }

  const isLeft = direction === "left";
  const xPct = interpolate(p, [0, 1], isLeft ? [110, -40] : [-40, 110]);
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${xPct}%`,
          width: 380,
          background: isLeft
            ? `linear-gradient(to left, transparent 0%, ${color}44 65%, ${color} 100%)`
            : `linear-gradient(to right, transparent 0%, ${color}44 65%, ${color} 100%)`,
          boxShadow: `0 0 45px 12px ${color}`,
          filter: "blur(6px)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

// --- 4. Zoom & Whip ---
const ZoomBlur: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.38 * intensity;
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 50%, ${color}77, transparent 65%)`,
        transform: `scale(${1 + Math.sin(p * Math.PI) * 0.09})`,
        filter: `blur(${8 + 14 * intensity}px)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const WhipPan: React.FC<{ direction?: "left" | "right"; color: string; intensity?: number }> = ({
  direction = "right",
  color,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.65 * intensity;
  const transX = interpolate(
    p,
    [0, 1],
    direction === "left" ? [800, -800] : [-800, 800]
  );

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -100,
          transform: `translateX(${transX}px)`,
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 14px, ${color}55 16px, transparent 20px)`,
          filter: `blur(${10 * intensity}px)`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

// --- 5. Blend / Mask ---
const MaskCircle: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radius = interpolate(p, [0, 1], [0, 150]);
  const opacity = Math.sin(p * Math.PI) * 0.85 * intensity;

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(circle at 50% 50%, ${color}44 0%, ${color} 50%, transparent 60%)`,
        maskImage: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, radius - 15)}%, black ${radius}%, transparent ${radius + 15}%)`,
        WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, radius - 15)}%, black ${radius}%, transparent ${radius + 15}%)`,
        filter: "blur(8px)",
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const BlendFade: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.42 * intensity;
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, ${color}33 50%, rgba(0,0,0,0.6) 100%)`,
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
    />
  );
};

const DebrisShatter: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.sin(p * Math.PI) * 0.95 * intensity;
  const transTL = interpolate(p, [0, 0.5, 1], [-300, 0, 300]);
  const transBR = interpolate(p, [0, 0.5, 1], [300, 0, -300]);
  const rot = interpolate(p, [0, 1], [-35, 35]);

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      {/* Top Left Shard */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: -20,
          width: 380,
          height: 380,
          backgroundColor: "#111111",
          clipPath: "polygon(0 0, 100% 25%, 70% 100%, 0 80%)",
          transform: `translate(${transTL}px, ${transTL * 0.4}px) rotate(${rot}deg)`,
        }}
      />
      {/* Top Right Shard */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -30,
          width: 320,
          height: 320,
          backgroundColor: "#181818",
          clipPath: "polygon(30% 0, 100% 0, 100% 80%, 40% 100%)",
          transform: `translate(${-transTL * 0.8}px, ${transTL * 0.3}px) rotate(${-rot}deg)`,
        }}
      />
      {/* Bottom Left Shard */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -30,
          width: 360,
          height: 360,
          backgroundColor: "#141414",
          clipPath: "polygon(0 40%, 60% 0, 100% 70%, 30% 100%)",
          transform: `translate(${transBR * 0.8}px, ${-transBR * 0.3}px) rotate(${rot}deg)`,
        }}
      />
      {/* Bottom Right Shard */}
      <div
        style={{
          position: "absolute",
          bottom: -30,
          right: -20,
          width: 400,
          height: 400,
          backgroundColor: "#0A0A0A",
          clipPath: "polygon(40% 0, 100% 30%, 80% 100%, 0 70%)",
          transform: `translate(${transBR}px, ${transBR * 0.4}px) rotate(${-rot}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

// --- 6. CapCut Suite Transitions ---

export const GlareII: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bloom = Math.sin(p * Math.PI) * intensity;
  const scale = interpolate(p, [0, 0.4, 1], [0.85, 1.35, 1.6]);
  const streakScaleX = interpolate(p, [0, 0.35, 1], [0.3, 2.4, 3.2]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* 1. Warm radial optical core */}
      <div
        style={{
          position: "absolute",
          inset: -200,
          background: `radial-gradient(ellipse 65% 55% at 50% 50%, #FFFFFF 0%, #FFF4C2 22%, #FFC83B 45%, #FF7A00 70%, transparent 85%)`,
          opacity: bloom * 0.92,
          transform: `scale(${scale})`,
          filter: "blur(24px)",
          mixBlendMode: "screen",
        }}
      />
      {/* 2. Anamorphic horizontal flare streak */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "-50%",
          right: "-50%",
          height: 220,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,248,220,0.2) 20%, rgba(255,255,255,0.95) 50%, rgba(255,248,220,0.2) 80%, transparent 100%)",
          opacity: bloom * 0.95,
          transform: `scaleX(${streakScaleX})`,
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />
      {/* 3. Secondary warm ambient wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFEBB3",
          opacity: bloom * 0.38,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

export const PhoneRevealOverlay: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(p, [0, 0.4, 0.65, 1], [0.72, 0.95, 1.25, 4.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bezelOpacity = interpolate(p, [0, 0.15, 0.72, 0.95], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 520,
          height: 1040,
          borderRadius: 68,
          border: "10px solid #2B2D31",
          boxShadow: `0 0 0 4px #4A4D55, 0 35px 80px rgba(0,0,0,0.85), 0 0 40px rgba(255,255,255,0.2)`,
          position: "relative",
          transform: `scale(${scale})`,
          opacity: bezelOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 22,
            width: 140,
            height: 36,
            borderRadius: 20,
            backgroundColor: "#000000",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        />
        {/* Top Status Bar: 11:17 */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 36,
            color: "#FFFFFF",
            fontFamily: "system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            zIndex: 10,
          }}
        >
          11:17
        </div>
        {/* Home Bar Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            width: 160,
            height: 5,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.75)",
            zIndex: 10,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const CapCutGlitch: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const noiseStep = Math.floor(frame % 4);
  const shift = (noiseStep === 0 ? 32 : noiseStep === 1 ? -28 : noiseStep === 2 ? 45 : -18) * intensity;
  const opacity = Math.sin(p * Math.PI) * 0.9 * intensity;

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      {/* Cyan split */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${shift}px)`,
          background: "rgba(0, 255, 255, 0.35)",
          mixBlendMode: "screen",
        }}
      />
      {/* Magenta split */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-shift * 1.2}px)`,
          background: "rgba(255, 0, 255, 0.35)",
          mixBlendMode: "screen",
        }}
      />
      {/* Horizontal sliced displacement bands */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: 0,
          right: 0,
          height: "18%",
          transform: `translateX(${shift * 1.5}px)`,
          background: "linear-gradient(90deg, rgba(0,255,255,0.4), rgba(255,255,255,0.7), transparent)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: 0,
          right: 0,
          height: "14%",
          transform: `translateX(${-shift * 1.8}px)`,
          background: "linear-gradient(90deg, transparent, rgba(255,0,255,0.4), rgba(255,255,255,0.8))",
          mixBlendMode: "screen",
        }}
      />
      {/* Scanline CRT overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* 1-frame flash inversion */}
      {p > 0.45 && p < 0.55 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: 0.75,
            mixBlendMode: "difference",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export const FadeDownTransition: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yPct = interpolate(p, [0, 1], [-100, 100]);
  const opacity = Math.sin(p * Math.PI) * 0.95 * intensity;

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      {/* Sweeping vertical dark gradient with motion blur lines */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${yPct}%`,
          height: 600,
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.6) 60%, transparent 100%)",
          filter: "blur(12px)",
        }}
      />
      {/* Leading white/light edge blade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${yPct + 15}%`,
          height: 40,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.85), transparent)",
          boxShadow: "0 0 35px 10px rgba(255,255,255,0.7)",
          filter: "blur(6px)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

export const BlinkTransition: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progressClose = interpolate(p, [0, 0.45, 0.55, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const topY = interpolate(progressClose, [0, 1], [-150, 960]);
  const botY = interpolate(progressClose, [0, 1], [2070, 960]);
  const dip = (1 - progressClose) * 220;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* Upper eyelid */}
        <path
          d={`M -50 -50 L 1130 -50 L 1130 ${topY} Q 540 ${topY + dip} -50 ${topY} Z`}
          fill="#000000"
        />
        {/* Lower eyelid */}
        <path
          d={`M -50 1970 L 1130 1970 L 1130 ${botY} Q 540 ${botY - dip} -50 ${botY} Z`}
          fill="#000000"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: topY - 20,
          height: 40,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          filter: "blur(14px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: botY - 20,
          height: 40,
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          filter: "blur(14px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const WaveRightTransition: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = interpolate(p, [0, 1], [-400, 1400]);
  const waveOpacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", opacity: waveOpacity * intensity }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path
          d={`M -200 0 L ${x} 0 C ${x + 180} 300, ${x - 120} 600, ${x + 220} 960 C ${x - 150} 1300, ${x + 160} 1600, ${x} 1920 L -200 1920 Z`}
          fill="#FFFFFF"
        />
        <circle cx={x + 120} cy="420" r="32" fill="#FFFFFF" />
        <circle cx={x + 70} cy="780" r="48" fill="#FFFFFF" />
        <circle cx={x + 160} cy="1150" r="26" fill="#FFFFFF" />
        <circle cx={x + 90} cy="1480" r="38" fill="#FFFFFF" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x - 40,
          width: 140,
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.95))",
          filter: "blur(16px)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

export const ComicCutTransition: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.sin(p * Math.PI) * 0.95 * intensity;
  const splitShift = interpolate(p, [0.35, 1], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, #000000 24%, transparent 25%)",
          backgroundSize: "16px 16px",
          opacity: 0.65,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          transform: `translate(${-splitShift}px, ${-splitShift * 0.5}px)`,
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
          background: "rgba(255,255,255,0.85)",
          borderBottom: "8px solid #000000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
          transform: `translate(${splitShift}px, ${splitShift * 0.5}px)`,
          clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)",
          background: "rgba(255,255,255,0.85)",
          borderTop: "8px solid #000000",
        }}
      />
    </AbsoluteFill>
  );
};

export const PaperBallTransition: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.sin(p * Math.PI) * intensity;
  const foldScale = interpolate(p, [0, 0.45, 1], [0.1, 1.05, 1.8]);
  const rot = interpolate(p, [0, 1], [-25, 25]);

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          width: 900,
          height: 1400,
          transform: `scale(${foldScale}) rotate(${rot}deg)`,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "55%",
            height: "55%",
            background: "linear-gradient(135deg, #F5F5F0 0%, #D8D8CE 100%)",
            clipPath: "polygon(0 0, 100% 20%, 75% 100%, 0 85%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 0,
            width: "50%",
            height: "50%",
            background: "linear-gradient(225deg, #FFFFFF 0%, #C4C4BA 100%)",
            clipPath: "polygon(20% 0, 100% 0, 100% 90%, 0 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            width: "80%",
            height: "45%",
            background: "linear-gradient(315deg, #FFFFFF 0%, #C8C8BD 100%)",
            clipPath: "polygon(0 25%, 85% 0, 100% 100%, 15% 100%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const renderTransition = (t: Transition, color: string, accent2: string) => {
  switch (t.type) {
    case "flash":
      return <Flash color="#FFFFFF" intensity={t.intensity} />;
    case "color-flash":
      return <ColorFlash color={color} intensity={t.intensity} />;
    case "light-leak":
      return <LightLeak color={color} accent2={accent2} intensity={t.intensity} />;
    case "quick-cut":
      return <QuickCut color={color} intensity={t.intensity} />;
    case "glitch-cut":
    case "glitch":
      return <CapCutGlitch intensity={t.intensity} />;
    case "swipe-left":
      return <DirectionalSwipe direction="left" color={color} intensity={t.intensity} />;
    case "swipe-right":
      return <DirectionalSwipe direction="right" color={color} intensity={t.intensity} />;
    case "swipe-up":
      return <DirectionalSwipe direction="up" color={color} intensity={t.intensity} />;
    case "whip-pan":
      return <WhipPan direction={t.direction === "left" ? "left" : "right"} color={color} intensity={t.intensity} />;
    case "mask-circle":
      return <MaskCircle color={color} intensity={t.intensity} />;
    case "blend-fade":
      return <BlendFade color={color} intensity={t.intensity} />;
    case "debris-shatter":
      return <DebrisShatter intensity={t.intensity} />;
    case "glare-ii":
      return <GlareII intensity={t.intensity} />;
    case "phone-reveal":
      return <PhoneRevealOverlay intensity={t.intensity} />;
    case "fade-down":
      return <FadeDownTransition intensity={t.intensity} />;
    case "blink":
      return <BlinkTransition intensity={t.intensity} />;
    case "wave-right":
      return <WaveRightTransition intensity={t.intensity} />;
    case "comic-cut":
      return <ComicCutTransition intensity={t.intensity} />;
    case "paper-ball":
      return <PaperBallTransition intensity={t.intensity} />;
    case "zoom-blur":
    case "color-wipe": // legacy fallback
    default:
      return <ZoomBlur color={color} intensity={t.intensity} />;
  }
};

export const TransitionLayer: React.FC<{
  transitions: Transition[];
  sourceClip?: string;
  brolls?: Array<{ startMs: number; endMs: number; src?: string }>;
  accent: string;
  accent2: string;
  highlight: string;
}> = ({ transitions, sourceClip, brolls = [], accent, accent2, highlight }) => {
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
            <TransitionItemWrapper
              transition={t}
              color={color}
              accent2={accent2}
              sourceClip={sourceClip}
              brolls={brolls}
              fromFrame={from}
              durationInFrames={dur}
            />
          </Sequence>
        );
      })}
    </>
  );
};

const TransitionItemWrapper: React.FC<{
  transition: Transition;
  color: string;
  accent2: string;
  sourceClip?: string;
  brolls: Array<{ startMs: number; endMs: number; src?: string }>;
  fromFrame: number;
  durationInFrames: number;
}> = ({ transition: t, color, accent2, sourceClip, brolls, fromFrame, durationInFrames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const defaultClip = sourceClip ? staticFile(sourceClip) : staticFile("raw/clip_goc-tight.mp4");
  let clipA = defaultClip;
  let clipB = defaultClip;
  let startFromA = fromFrame;
  let startFromB = fromFrame;

  const transMid = (t.startMs + t.endMs) / 2;
  const enteringBroll = brolls.find((b) => Math.abs(b.startMs - transMid) <= 1500 && b.src);
  const exitingBroll = brolls.find((b) => Math.abs(b.endMs - transMid) <= 1500 && b.src);

  if (enteringBroll) {
    clipA = defaultClip;
    startFromA = fromFrame;
    clipB = staticFile(enteringBroll.src!);
    startFromB = 0;
  } else if (exitingBroll) {
    clipA = staticFile(exitingBroll.src!);
    startFromA = Math.max(0, fromFrame - Math.round((exitingBroll.startMs / 1000) * 30));
    clipB = defaultClip;
    startFromB = fromFrame;
  }

  switch (t.type) {
    case "paper-ball":
      return (
        <PaperBallTwoLayer
          clipA={clipA}
          clipB={clipB}
          progress={p}
          cardWidth={1080}
          cardHeight={1920}
          startFromA={startFromA}
          startFromB={startFromB}
        />
      );
    case "comic-cut":
      return (
        <ComicCutTwoLayer
          clipA={clipA}
          clipB={clipB}
          progress={p}
          cardWidth={1080}
          cardHeight={1920}
          startFromA={startFromA}
          startFromB={startFromB}
        />
      );
    case "phone-reveal":
      return (
        <PhoneRevealTwoLayer
          clipA={clipA}
          clipB={clipB}
          progress={p}
          cardWidth={1080}
          cardHeight={1920}
          startFromA={startFromA}
          startFromB={startFromB}
        />
      );
    case "glare-ii":
      return <GlareIITwoLayer clipA={clipA} clipB={clipB} progress={p} intensity={1.25} startFromA={startFromA} startFromB={startFromB} />;
    case "glitch":
      return <GlitchTwoLayer clipA={clipA} clipB={clipB} progress={p} startFromA={startFromA} startFromB={startFromB} />;
    case "fade-down":
      return <FadeDownTwoLayer clipA={clipA} clipB={clipB} progress={p} startFromA={startFromA} startFromB={startFromB} />;
    case "blink":
      return <BlinkTwoLayer clipA={clipA} clipB={clipB} progress={p} startFromA={startFromA} startFromB={startFromB} />;
    case "wave-right":
      return <WaveRightTwoLayer clipA={clipA} clipB={clipB} progress={p} startFromA={startFromA} startFromB={startFromB} />;
    case "swipe-left":
      return <SwipeLeftTwoLayer clipA={clipA} clipB={clipB} progress={p} startFromA={startFromA} startFromB={startFromB} />;
    default:
      return renderTransition(t, color, accent2);
  }
};

/**
 * Bottom 30-35% blur + dark gradient vignette so captions are punchy, high-contrast,
 * and exceptionally readable over any footage (matching news/editorial viral reels).
 */
export const ReadabilityScrim: React.FC<{ mode?: 'subtle' | 'blur-vignette' | 'top-only' | 'none' }> = ({ mode = 'blur-vignette' }) => {
  if (mode === 'none') {
    return null;
  }

  if (mode === 'top-only') {
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* Top subtle vignette for header/status safety - ZERO blur and ZERO dark gradient at bottom */}
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
      </AbsoluteFill>
    );
  }

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
