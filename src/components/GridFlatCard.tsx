/**
 * GridFlatCard & NumberBadge — Anh Sac Style motion graphic visuals.
 * Replicates the signature viral aesthetic observed in the reference video:
 * 1. Clean graph paper grid backdrop (F6F7FA with subtle gridlines)
 * 2. 2D flat vector iconography & illustrations
 * 3. Mixed typography: Heavy Bold Sans-Serif + Handwritten Script
 * 4. Animated black geometric debris / shards flying in from corners
 * 5. Floating gradient Number Badge (1, 2, 3, 4, 5...)
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DISPLAY_FONT, BODY_FONT, SCRIPT_FONT, VI_SAFE_LINE_HEIGHT } from "../fonts";

export interface GridFlatCardProps {
  title: string;
  secondaryText?: string;
  iconType?: "crane" | "timeline" | "audio-wave" | "camera" | "book" | "warning" | "lightbulb";
  subtitle?: string; // bottom spoken subtitle
  accent?: string;
  accent2?: string;
}

export const GridFlatCard: React.FC<GridFlatCardProps> = ({
  title,
  secondaryText,
  iconType = "timeline",
  subtitle,
  accent = "#FF6B00",
  accent2 = "#1A1A1A",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for main content
  const pop = spring({ frame, fps, config: { damping: 13, mass: 0.6 } });
  const contentScale = interpolate(pop, [0, 1], [0.88, 1]);
  const contentOpacity = interpolate(pop, [0, 1], [0, 1]);

  // Shards / debris animation (flying in from corners from frame 0 to 14)
  const shardP = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F6F7FA",
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.055) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(0, 0, 0, 0.055) 1.5px, transparent 1.5px)",
        backgroundSize: "52px 52px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 1. Flying Debris / Shatter Shards in corners */}
      <DebrisShards progress={shardP} />

      {/* 2. Main Illustration & Typography Centerpiece */}
      <div
        style={{
          transform: `scale(${contentScale})`,
          opacity: contentOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          padding: "0 40px",
          maxWidth: 960,
        }}
      >
        {/* Top Header / Title */}
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 76,
            fontWeight: 900,
            color: accent,
            letterSpacing: "0.02em",
            textAlign: "center",
            lineHeight: VI_SAFE_LINE_HEIGHT,
            marginBottom: secondaryText ? 6 : 28,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        {/* Secondary cursive script line (e.g. "Sound effect") */}
        {secondaryText ? (
          <div
            style={{
              fontFamily: SCRIPT_FONT,
              fontSize: 82,
              fontWeight: 400,
              color: accent2,
              textAlign: "center",
              marginTop: -16,
              marginBottom: 36,
              transform: "rotate(-3deg)",
            }}
          >
            {secondaryText}
          </div>
        ) : null}

        {/* Flat Vector Icon Illustration */}
        <div style={{ margin: "20px 0 30px 0" }}>
          <FlatIllustration type={iconType} accent={accent} accent2={accent2} />
        </div>
      </div>

      {/* 3. Bottom Spoken Subtitle (matching frame_006, frame_011) */}
      {subtitle ? (
        <div
          style={{
            position: "absolute",
            bottom: 280,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: BODY_FONT,
              fontSize: 38,
              fontWeight: 800,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.35,
              textTransform: "uppercase",
              textShadow:
                "-2.5px -2.5px 0 #000, 2.5px -2.5px 0 #000, -2.5px 2.5px 0 #000, 2.5px 2.5px 0 #000, 0 5px 18px rgba(0,0,0,0.85)",
              padding: "0 24px",
              maxWidth: 780,
            }}
          >
            {subtitle}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * 2D Flat Illustrations for common video/creative concepts
 */
const FlatIllustration: React.FC<{
  type: string;
  accent: string;
  accent2: string;
}> = ({ type, accent, accent2 }) => {
  switch (type) {
    case "audio-wave":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* Speaker icon */}
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke={accent2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          {/* Orange pill button with waveform bars */}
          <div
            style={{
              background: accent,
              borderRadius: 36,
              padding: "26px 44px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: `0 14px 32px ${accent}55`,
            }}
          >
            <div style={{ width: 10, height: 18, background: "#FFF", borderRadius: 5 }} />
            <div style={{ width: 10, height: 32, background: "#FFF", borderRadius: 5 }} />
            <div style={{ width: 10, height: 52, background: "#FFF", borderRadius: 5 }} />
            <div style={{ width: 10, height: 36, background: "#FFF", borderRadius: 5 }} />
            <div style={{ width: 10, height: 20, background: "#FFF", borderRadius: 5 }} />
          </div>
        </div>
      );

    case "timeline":
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Arrow with 3 giay text */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <svg width="320" height="28" viewBox="0 0 320 28">
              <line x1="10" y1="14" x2="310" y2="14" stroke="#777" strokeWidth="2.5" />
              <polygon points="10,14 24,7 24,21" fill="#777" />
              <polygon points="310,14 296,7 296,21" fill="#777" />
            </svg>
          </div>
          {/* Black progress bar pill with cursors and play button */}
          <div
            style={{
              width: 520,
              height: 140,
              background: accent2,
              borderRadius: 32,
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "0 32px",
              boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
            }}
          >
            {/* Orange Play triangle */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "22px solid transparent",
                borderBottom: "22px solid transparent",
                borderLeft: `36px solid ${accent}`,
                marginRight: 28,
              }}
            />
            {/* Cursor Arrow Left */}
            <div style={{ position: "absolute", left: 140, top: -24 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#FFF" stroke={accent2} strokeWidth="1.5">
                <path d="M12 2 L4 18 L12 15 L20 18 Z" />
              </svg>
            </div>
            {/* Cursor Arrow Right */}
            <div style={{ position: "absolute", right: 130, top: -24 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#FFF" stroke={accent2} strokeWidth="1.5">
                <path d="M12 2 L4 18 L12 15 L20 18 Z" />
              </svg>
            </div>
          </div>
        </div>
      );

    case "crane":
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Construction crane + avatar silhouette */}
          <svg width="400" height="260" viewBox="0 0 400 260" fill="none">
            {/* Crane Arm */}
            <line x1="20" y1="60" x2="380" y2="60" stroke={accent2} strokeWidth="6" />
            <line x1="20" y1="75" x2="380" y2="75" stroke={accent2} strokeWidth="3" />
            <line x1="310" y1="60" x2="310" y2="260" stroke={accent2} strokeWidth="8" />
            {/* Tower cross braces */}
            <line x1="330" y1="60" x2="330" y2="260" stroke={accent2} strokeWidth="4" />
            <line x1="310" y1="90" x2="330" y2="110" stroke={accent2} strokeWidth="2" />
            <line x1="310" y1="130" x2="330" y2="150" stroke={accent2} strokeWidth="2" />
            <line x1="310" y1="170" x2="330" y2="190" stroke={accent2} strokeWidth="2" />
            {/* Cable + Hook */}
            <line x1="150" y1="60" x2="150" y2="125" stroke={accent2} strokeWidth="3" />
            <path d="M150 125 C 145 135, 155 145, 147 150" stroke={accent2} strokeWidth="4" fill="none" />
            {/* Avatar Head */}
            <circle cx="150" cy="180" r="38" fill={accent2} />
            {/* Avatar Shoulders */}
            <path d="M95 255 C 95 215, 205 215, 205 255 Z" fill={accent2} />
          </svg>
        </div>
      );

    case "camera":
      return (
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke={accent2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" stroke={accent} strokeWidth="3" />
        </svg>
      );

    case "warning":
      return (
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill={accent} />
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.5" fill="#FFF" />
        </svg>
      );

    case "lightbulb":
    default:
      return (
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2">
          <path d="M9 18h6M10 22h4M15 8a6 6 0 1 0-7.8 5.7c.5.5.8 1.1.8 1.8v.5h6v-.5c0-.7.3-1.3.8-1.8A5.98 5.98 0 0 0 15 8z" />
        </svg>
      );
  }
};

/**
 * 4 Dark Shards / Debris flying inward from corners
 */
export const DebrisShards: React.FC<{ progress: number }> = ({ progress }) => {
  const transTopLeft = interpolate(progress, [0, 1], [-220, 0]);
  const transTopRight = interpolate(progress, [0, 1], [220, 0]);
  const transBottomLeft = interpolate(progress, [0, 1], [-220, 0]);
  const transBottomRight = interpolate(progress, [0, 1], [220, 0]);
  const rotateTL = interpolate(progress, [0, 1], [-45, 0]);
  const rotateBR = interpolate(progress, [0, 1], [45, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 2 }}>
      {/* Top-Right Shard */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -40,
          width: 260,
          height: 260,
          backgroundColor: "#141414",
          clipPath: "polygon(30% 0, 100% 0, 100% 75%, 45% 100%)",
          transform: `translate(${transTopRight}px, ${-transTopRight * 0.5}px) rotate(${rotateBR}deg)`,
          filter: "blur(0.5px)",
        }}
      />

      {/* Bottom-Left Shard */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -30,
          width: 320,
          height: 320,
          backgroundColor: "#141414",
          clipPath: "polygon(0 35%, 55% 0, 100% 65%, 40% 100%, 0 90%)",
          transform: `translate(${transBottomLeft}px, ${-transBottomLeft * 0.5}px) rotate(${rotateTL}deg)`,
          filter: "blur(1px)",
        }}
      />

      {/* Top-Left Minor Shard */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: -40,
          width: 140,
          height: 180,
          backgroundColor: "#1E1E1E",
          clipPath: "polygon(0 0, 100% 40%, 60% 100%, 0 70%)",
          transform: `translate(${transTopLeft}px, 0px)`,
        }}
      />

      {/* Bottom-Right Minor Shard */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          right: -35,
          width: 160,
          height: 200,
          backgroundColor: "#1E1E1E",
          clipPath: "polygon(35% 0, 100% 30%, 75% 100%, 0 80%)",
          transform: `translate(${transBottomRight}px, 0px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Floating Number Badge (e.g. "5") in top-right corner
 */
export const NumberBadge: React.FC<{
  number: number;
  accent?: string;
}> = ({ number, accent = "#FF6B00" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.5, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        right: 48,
        width: 145,
        height: 145,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, #FFA726 0%, ${accent} 70%, #E65100 100%)`,
        boxShadow: "0 14px 30px rgba(230, 81, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        opacity,
        zIndex: 25,
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 86,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1,
          marginTop: -3,
          textShadow: "0 3px 8px rgba(0,0,0,0.3)",
        }}
      >
        {number}
      </div>
    </div>
  );
};
