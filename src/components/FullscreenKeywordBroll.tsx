/**
 * Fullscreen Kinetic Keyword B-Roll — 100% full-frame (1080x1920)
 * Visual pattern interrupt that displays massive, impactful keyword typography
 * over a dark cinematic backdrop.
 * Features:
 * - Highlighted keyword in vibrant yellow (#FFE600)
 * - Staggered sequential line reveal for bullet items (matching speech pacing)
 * - Zero emojis, high contrast, pro motion design
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enterExit, popSpring, glow } from "../anim";
import { DISPLAY_FONT, BODY_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from "../fonts";
import { useStyle } from "../style-context";

export type BrollBgVariant =
  | "pure-black"
  | "grid-caro"
  | "paper-crumpled-black"
  | "paper-crumpled-white"
  | "dark-gradient"
  | "dark-brick"
  | "blurred-speaker"
  | "radial-navy"
  | "concrete-grunge"
  | "carbon-mesh"
  | "lens-bokeh";

export const FullscreenKeywordBroll: React.FC<{
  text: string;
  subtitle?: string;
  accent: string;
  accent2: string;
  bgVariant?: BrollBgVariant;
  bgCustomImage?: string;
  sourceClip?: string;
}> = ({
  text,
  subtitle,
  accent,
  accent2,
  bgVariant = "grid-caro",
  bgCustomImage,
  sourceClip,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();

  const e = enterExit(frame, fps, durationInFrames, 10);
  const s = popSpring(frame, fps, 3);
  const lineW = interpolate(popSpring(frame, fps, 8), [0, 1], [0, 100]);

  // Ambient Camera Motion: Ken Burns slow zoom + Micro parallax drift
  const zoom = interpolate(frame, [0, durationInFrames], [1.02, 1.09], {
    extrapolateRight: "clamp",
  });
  const driftX = Math.sin((frame / 90) * Math.PI * 2) * 7;
  const driftY = Math.cos((frame / 110) * Math.PI * 2) * 5;

  const isWhiteBg = bgVariant === "paper-crumpled-white";

  // Parse main text & subtitle
  let mainWord = text;
  let subText = subtitle;
  if (!subText && text.includes("|")) {
    const parts = text.split("|").map((p) => p.trim());
    mainWord = parts[0];
    subText = parts.slice(1).join(" ");
  }

  // Format main title with yellow highlight on punch words
  // e.g., "3 LỖI KHI QUAY" -> "3 LỖI" yellow, "KHI QUAY" white
  // e.g., "CẮT BỎ KHOẢNG LẶNG" -> "CẮT BỎ" white, "KHOẢNG LẶNG" yellow
  const titleWords = mainWord.split(/\s+/);
  const is3Loi = mainWord.includes("3 LỖI") || mainWord.includes("LỖI");
  const isCatBo = mainWord.includes("KHOẢNG LẶNG");

  // Check if subtitle has multiple items (split by • or | or \n)
  const items = subText
    ? subText.split(/[•|\n]/).map((x) => x.trim()).filter(Boolean)
    : [];
  const isMultiItem = items.length > 1;

  // Colors adapted to background
  const defaultTextColor = isWhiteBg ? "#111111" : "#FFFFFF";
  const highlightTextColor = isWhiteBg ? "#D97706" : "#FFE600";
  const underlineGradient = isWhiteBg
    ? "linear-gradient(90deg, #D97706, #B45309)"
    : `linear-gradient(90deg, #FFE600, ${accent})`;

  return (
    <AbsoluteFill
      style={{
        opacity: e,
        backgroundColor: isWhiteBg ? "#F4F4F4" : "#000000",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 1. Dynamic Layered Background with Ambient Motion */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoom}) translate(${driftX}px, ${driftY}px)`,
          transformOrigin: "center center",
        }}
      >
        <BrollBackgroundLayer
          variant={bgVariant}
          customImage={bgCustomImage}
          sourceClip={sourceClip}
        />
      </AbsoluteFill>

      {/* 2. Soft Depth Vignette Scrim */}
      <AbsoluteFill
        style={{
          background: isWhiteBg
            ? "radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.12) 100%)"
            : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.78) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 3. Subtle geometric framing borders */}
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: isWhiteBg
            ? `1px solid rgba(0,0,0,0.12)`
            : `1px solid rgba(255,255,255,0.07)`,
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />

      {/* Main Kinetic Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 960,
          padding: "0 40px",
        }}
      >
        {/* Massive Main Keyword with High-Contrast Yellow Highlight */}
        <div
          style={{
            transform: `scale(${interpolate(s, [0, 1], [0.75, 1])}) translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
            fontFamily: DISPLAY_FONT,
            fontWeight: 950,
            fontSize: mainWord.length > 18 ? 86 : mainWord.length > 12 ? 104 : 124,
            textTransform: "uppercase",
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            letterSpacing: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {titleWords.map((w, idx) => {
            const clean = w.replace(/[“”,.?!]/g, "").toUpperCase();
            let isHighlight = false;
            if (is3Loi && (clean === "3" || clean === "LỖI")) isHighlight = true;
            if (isCatBo && (clean === "KHOẢNG" || clean === "LẶNG")) isHighlight = true;
            if (/\d+/.test(clean)) isHighlight = true;
            if (clean === "AUTO" || clean === "MIỄN" || clean === "BẮT" || clean === "BUỘC" || clean === "THÔNG" || clean === "TIN") isHighlight = true;
            const textColor = isHighlight ? highlightTextColor : defaultTextColor;
            const shadowColor = isWhiteBg
              ? (isHighlight ? "0 2px 12px rgba(217,119,6,0.35)" : "0 2px 10px rgba(0,0,0,0.2)")
              : (isHighlight ? "0 0 28px rgba(255,230,0,0.55), 0 8px 32px rgba(0,0,0,0.95)" : `0 8px 32px rgba(0,0,0,0.9), ${glow(accent, true)}`);

            return (
              <span
                key={idx}
                style={{
                  color: textColor,
                  textShadow: shadowColor,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* Dynamic accent underline */}
        <div
          style={{
            height: 10,
            width: `${lineW}%`,
            maxWidth: 360,
            margin: "24px auto 0",
            borderRadius: 999,
            background: underlineGradient,
            boxShadow: isWhiteBg ? "0 2px 12px rgba(217,119,6,0.5)" : glow("#FFE600", true),
          }}
        />

        {/* Subtitle / Staggered sequential line reveal */}
        {isMultiItem ? (
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "flex-start",
              width: "100%",
              maxWidth: 720,
            }}
          >
            {items.map((item, idx) => {
              // Staggered reveal delay: item 0 at frame 16, item 1 at frame 44, item 2 at frame 72 (~1s apart)
              const delay = 16 + idx * 28;
              const sp = popSpring(frame, fps, delay);
              const translateY = interpolate(sp, [0, 1], [30, 0]);
              const translateX = interpolate(sp, [0, 1], [-20, 0]);

              return (
                <div
                  key={idx}
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px)`,
                    opacity: sp,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    background: isWhiteBg ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                    border: isWhiteBg ? "1px solid rgba(0,0,0,0.14)" : "1px solid rgba(255,230,0,0.22)",
                    borderRadius: 18,
                    padding: "16px 28px",
                    width: "100%",
                    boxShadow: isWhiteBg ? "0 4px 16px rgba(0,0,0,0.08)" : "0 6px 24px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Number Badge */}
                  <div
                    style={{
                      background: highlightTextColor,
                      color: isWhiteBg ? "#FFFFFF" : "#000000",
                      fontFamily: DISPLAY_FONT,
                      fontWeight: 900,
                      fontSize: 26,
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: isWhiteBg ? "0 2px 8px rgba(217,119,6,0.3)" : "0 0 16px rgba(255,230,0,0.45)",
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* Item Text */}
                  <div
                    style={{
                      fontFamily: DISPLAY_FONT,
                      fontSize: 42,
                      fontWeight: 800,
                      color: defaultTextColor,
                      textShadow: isWhiteBg ? "0 1px 4px rgba(0,0,0,0.15)" : "0 4px 14px rgba(0,0,0,0.85)",
                    }}
                  >
                    {item.replace(/^\d+[\.\-\s\/]+\s*/, '')}
                  </div>
                </div>
              );
            })}
          </div>
        ) : subText ? (
          <div
            style={{
              marginTop: 28,
              transform: `translateY(${interpolate(popSpring(frame, fps, 12), [0, 1], [30, 0])}px)`,
              opacity: popSpring(frame, fps, 12),
              fontFamily: BODY_FONT,
              fontSize: 44,
              fontWeight: 700,
              color: isWhiteBg ? "#333333" : "#EDEDE8",
              lineHeight: 1.35,
              textShadow: isWhiteBg ? "0 1px 4px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.8)",
              maxWidth: 820,
            }}
          >
            {subText}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const BrollBackgroundLayer: React.FC<{
  variant: BrollBgVariant;
  customImage?: string;
  sourceClip?: string;
}> = ({ variant, customImage, sourceClip }) => {
  if (customImage) {
    return (
      <Img
        src={staticFile(customImage)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  switch (variant) {
    case "grid-caro":
      return (
        <AbsoluteFill style={{ backgroundColor: "#020617" }}>
          <Img
            src={staticFile("broll-bg/grid-caro.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      );

    case "paper-crumpled-black":
      return (
        <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
          <Img
            src={staticFile("broll-bg/paper-crumpled-black.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      );

    case "paper-crumpled-white":
      return (
        <AbsoluteFill style={{ backgroundColor: "#F8F8F8" }}>
          <Img
            src={staticFile("broll-bg/paper-crumpled-white.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      );

    case "dark-gradient":
      return (
        <AbsoluteFill style={{ backgroundColor: "#050505" }}>
          <Img
            src={staticFile("broll-bg/dark-gradient-depth.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      );

    case "dark-brick":
      return (
        <AbsoluteFill style={{ backgroundColor: "#0C0C0C" }}>
          <Img
            src={staticFile("broll-bg/dark-brick-wall.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      );

    case "blurred-speaker":
      if (sourceClip) {
        return (
          <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
            <OffthreadVideo
              src={staticFile(sourceClip)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(32px) brightness(0.32) contrast(1.18)",
                transform: "scale(1.15)", // avoid blur edge leakage
              }}
            />
          </AbsoluteFill>
        );
      }
      return <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }} />;

    case "radial-navy":
      return (
        <AbsoluteFill style={{ backgroundColor: "#050814" }}>
          <Img
            src={staticFile("broll-bg/radial-navy-glow.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );

    case "concrete-grunge":
      return (
        <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
          <Img
            src={staticFile("broll-bg/concrete-dark-grunge.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );

    case "carbon-mesh":
      return (
        <AbsoluteFill style={{ backgroundColor: "#050505" }}>
          <Img
            src={staticFile("broll-bg/carbon-mesh-studio.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );

    case "lens-bokeh":
      return (
        <AbsoluteFill style={{ backgroundColor: "#050402" }}>
          <Img
            src={staticFile("broll-bg/lens-bokeh-abstract.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );

    case "pure-black":
    default:
      return <AbsoluteFill style={{ backgroundColor: "#000000" }} />;
  }
};
