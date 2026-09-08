/**
 * Caption and Hierarchical Idea Headline Layer
 * Upgraded to meet all user requirements:
 * 1. "normal": Jumping karaoke subtitles (4-6 words/chunk, sentence-case, active word highlighted in #FFE600, 46px clean text).
 * 2. "3-tier": Dòng từ khóa ngoặc kép in hoa bôi đậm màu vàng rực (#FFE600).
 * 3. "stat-punch": Số và từ khẳng định khổng lồ bôi đậm màu vàng rực (#FFE600).
 * 4. "split-contrast": Hiệu ứng chạy chữ so le từng dòng (Dòng trên slide-down frame 0, dòng dưới slide-up frame 14), từ khóa bôi vàng.
 * 5. "tag-headline": Thẻ tag pill vàng + tiêu đề có từ khóa bôi vàng rực rỡ.
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
import type { Caption } from "../edl-types";
import { DISPLAY_FONT, BODY_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from "../fonts";
import { useStyle } from "../style-context";
import {
  GlowAmbientHeadline,
  AsymmetricTrioHeadline,
  StackedContrastHeadline,
  MultiBlockFlowHeadline,
} from "./AnhSacKineticTypo";

export const Captions: React.FC<{
  captions: Caption[];
  color: string;
  highlight: string;
  accent?: string;
  preset?: string;
  activeGraphicIntervals?: Array<{ startMs: number; endMs: number }>;
}> = ({ captions, color, highlight, accent = "#FF8C00", preset = "thuy-style-oneshot", activeGraphicIntervals = [] }) => {
  const { fps } = useVideoConfig();
  const isClassic = preset === "classic";
  const isAnhSac = preset === "anh-sac-podcast";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {captions.map((cap, i) => {
        const from = Math.round((cap.startMs / 1000) * fps);
        const end = Math.round((cap.endMs / 1000) * fps);
        const dur = Math.max(1, end - from);

        // Enforce Mutual Exclusivity:
        // For thuy-style-oneshot, drop sequence only if overlap exceeds 150ms.
        // For anh-sac-podcast, mutual exclusion is handled dynamically per-frame inside AnhSacKineticCaptionLine.
        if (!isClassic && !isAnhSac) {
          const overlapsGraphic = activeGraphicIntervals.some((g) => {
            const overlapDuration = Math.min(cap.endMs, g.endMs) - Math.max(cap.startMs, g.startMs);
            return overlapDuration > 150;
          });
          if (overlapsGraphic) {
            return null;
          }
        }

        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {isClassic ? (
              // Classic preset: always render normal karaoke jumping subtitles
              <NormalJumpingTranscriptLine cap={cap} color={color} highlight={highlight} />
            ) : isAnhSac ? (
              // Anh-sac-podcast preset: render signature punchy kinetic bounce subtitles
              cap.headlineStyle && cap.headlineStyle !== "normal" ? (
                <HeadlineRenderer cap={cap} color={color} highlight={highlight} accent={accent} />
              ) : (
                <AnhSacKineticCaptionLine
                  cap={cap}
                  color={color}
                  highlight={highlight}
                  accent={accent}
                  activeGraphicIntervals={activeGraphicIntervals}
                />
              )
            ) : (
              // Thuy-style-oneshot: route through headline dispatcher
              <HeadlineRenderer cap={cap} color={color} highlight={highlight} accent={accent} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const HeadlineRenderer: React.FC<{
  cap: Caption;
  color: string;
  highlight: string;
  accent: string;
}> = ({ cap, color, highlight, accent }) => {
  const style = cap.headlineStyle ?? "normal";

  switch (style) {
    case "3-tier":
      return <ThreeTierHeadline cap={cap} accent={accent} />;
    case "stat-punch":
      return <StatPunchHeadline cap={cap} accent={accent} />;
    case "split-contrast":
      return <SplitContrastHeadline cap={cap} accent={accent} />;
    case "tag-headline":
      return <TagHeadline cap={cap} accent={accent} highlight={highlight} />;
    case "kinetic-pop":
      return <KineticPopHeadline cap={cap} accent={accent} highlight={highlight} />;
    case "staggered-lines":
      return <StaggeredLinesHeadline cap={cap} accent={accent} highlight={highlight} />;
    case "glow-ambient":
      return <GlowAmbientHeadline cap={cap} accent={accent} />;
    case "asymmetric-trio":
      return <AsymmetricTrioHeadline cap={cap} accent={accent} highlight={highlight} />;
    case "stacked-contrast":
      return <StackedContrastHeadline cap={cap} accent={accent} highlight={highlight} />;
    case "multiblock-flow":
      return <MultiBlockFlowHeadline cap={cap} accent={accent} highlight={highlight} />;
    case "normal":
    default:
      return <NormalJumpingTranscriptLine cap={cap} color={color} highlight={highlight} />;
  }
};

/**
 * Style 1: 3-Tier Classic (Reference: media_1788688710730.png)
 * Line 1 (Context): ~54px bold white
 * Line 2 (Giant Quoted Keyword): ~104px extra bold italic uppercase, VIBRANT YELLOW (#FFE600), intense glow/drop shadow
 * Line 3 (Sub/Question): ~50px italic white
 * Sits directly on bottom 30% blur scrim (~20% from bottom)
 */
export const ThreeTierHeadline: React.FC<{ cap: Caption; accent: string }> = ({ cap, accent }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const recipe = useStyle();

  // Strict Bottom 30% zone (Y >= 70%):
  // Sit cleanly on bottom dark scrim (4% from bottom = ~76px)
  const paddingBottom = Math.round((height * 4) / 100);
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.92, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [24, 0]);

  // Enforce rule: Max 6 words per line for 3-tier style
  const limitWords = (str: string, maxWords: number = 6) => {
    const words = str.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(" ");
  };

  let header = limitWords(cap.header?.trim() ?? "", 6);
  let keyword = limitWords(cap.keyword?.trim() ?? "", 6);
  let sub = limitWords(cap.sub?.trim() ?? "", 6);

  if (!header && !keyword) {
    const raw = cap.text.trim();
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      header = limitWords(lines[0], 6);
      keyword = limitWords(lines[1], 6);
      sub = limitWords(lines.slice(2).join(" "), 6);
    } else if (lines.length === 2) {
      header = limitWords(lines[0], 6);
      keyword = limitWords(lines[1], 6);
    } else {
      keyword = limitWords(raw, 6);
    }
  }

  let formattedKeyword = keyword.toUpperCase();
  if (formattedKeyword && !formattedKeyword.startsWith("“") && !formattedKeyword.startsWith('"')) {
    formattedKeyword = `“${formattedKeyword}”`;
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%", // Strictly 30% bottom zone (Y: 70% -> 100%)
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // CHÍNH GIỮA 30% DƯỚI!
          alignItems: "center",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            maxWidth: 980,
            textAlign: "center",
          }}
        >
          {/* Line 1: Header / Context (White) */}
          {header ? (
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 800,
                fontSize: 42 * recipe.textScale,
                color: "#FFFFFF",
                lineHeight: VI_SAFE_LINE_HEIGHT,
                paddingTop: VI_DIACRITIC_PAD,
                textShadow: "0 4px 16px rgba(0,0,0,0.85)",
              }}
            >
              {header}
            </div>
          ) : null}

          {/* Line 2: Giant KEYWORD Punchline (Vibrant Yellow #FFE600) */}
          {formattedKeyword ? (
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 950,
                fontStyle: "italic",
                fontSize: Math.min(84, Math.max(62, (84 * 18) / Math.max(18, formattedKeyword.length))) * recipe.textScale,
                color: "#FFE600",
                letterSpacing: -0.5,
                lineHeight: VI_SAFE_LINE_HEIGHT,
                paddingTop: VI_DIACRITIC_PAD,
                textShadow: `0 0 28px rgba(255,230,0,0.55), 0 8px 30px rgba(0,0,0,0.95)`,
                transform: "skewX(-3deg)",
              }}
            >
              {formattedKeyword}
            </div>
          ) : null}

          {/* Line 3: Sub / Concluding takeaway or question (White) */}
          {sub ? (
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 38 * recipe.textScale,
                color: "#FFFFFF",
                lineHeight: VI_SAFE_LINE_HEIGHT,
                paddingTop: VI_DIACRITIC_PAD,
                textShadow: "0 4px 16px rgba(0,0,0,0.85)",
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Style 2: Stat / Number / Ordinal Punch (Reference: media_1788688641617.png & media_1788688358136.png)
 * Giant punchline text: ~115px extra bold italic display font uppercase, VIBRANT YELLOW (#FFE600)
 * Descriptor line below: ~52px italic white
 * Position: Upper safe zone (~24% from top)
 */
export const StatPunchHeadline: React.FC<{ cap: Caption; accent: string }> = ({ cap, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.45 } });
  const scale = interpolate(pop, [0, 1], [0.78, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [28, 0]);

  const punchText = (cap.keyword || cap.header || cap.text).toUpperCase().split(/\s+/).slice(0, 6).join(" ");
  const descriptor = (cap.sub || "").split(/\s+/).slice(0, 6).join(" ");

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%", // Strictly 30% top zone (Y: 0% -> 30%)
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // CHÍNH GIỮA 30% TRÊN!
          alignItems: "center",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            maxWidth: 960,
            textAlign: "center",
          }}
        >
          {/* Massive Punch / Stat in Vibrant Yellow */}
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 950,
              fontStyle: "italic",
              fontSize: Math.min(96, Math.max(72, (96 * 14) / Math.max(14, punchText.length))) * recipe.textScale,
              color: "#FFE600",
              letterSpacing: 0.5,
              lineHeight: VI_SAFE_LINE_HEIGHT,
              paddingTop: VI_DIACRITIC_PAD,
              textShadow: `0 0 32px rgba(255,230,0,0.55), 0 10px 36px rgba(0,0,0,0.95)`,
              transform: "skewX(-3deg)",
            }}
          >
            {punchText}
          </div>

          {/* Descriptor in White */}
          {descriptor ? (
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: 42 * recipe.textScale,
                color: "#FFFFFF",
                lineHeight: VI_SAFE_LINE_HEIGHT,
                paddingTop: VI_DIACRITIC_PAD,
                textShadow: "0 6px 20px rgba(0,0,0,0.9)",
              }}
            >
              {descriptor}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Style 3: Split Contrast Top/Bottom (Reference: media_1788688694570.png)
 * FEATURES STAGGERED LINE-BY-LINE ANIMATION:
 * - Top line slides down from frame 0
 * - Bottom line slides up staggered at frame 14 (~0.47s delay)
 * - Highlights keyword in vibrant yellow (#FFE600)
 */
export const SplitContrastHeadline: React.FC<{ cap: Caption; accent: string }> = ({ cap, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  // Top line spring (starts at frame 0)
  const topPop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const topY = interpolate(topPop, [0, 1], [-35, 0]);
  const topOpacity = interpolate(topPop, [0, 1], [0, 1]);
  const topScale = interpolate(topPop, [0, 1], [0.88, 1]);

  // Bottom line spring (staggered delay: starts at frame 14 ~470ms)
  const bottomFrame = Math.max(0, frame - 14);
  const bottomPop = spring({ frame: bottomFrame, fps, config: { damping: 14, mass: 0.5 } });
  const bottomY = interpolate(bottomPop, [0, 1], [35, 0]);
  const bottomOpacity = interpolate(bottomPop, [0, 1], [0, 1]);
  const bottomScale = interpolate(bottomPop, [0, 1], [0.88, 1]);

  const topText = cap.topText || cap.header || "NÓI CHUYỆN LIÊN TỤC";
  const bottomText = cap.bottomText || cap.keyword || cap.sub || "vừa đi vừa quay ONE-SHOT";

  // Split top text into words and highlight the keyword "LIÊN TỤC" in yellow
  const topWords = topText.split(/\s+/).slice(0, 6);
  const bottomWords = bottomText.split(/\s+/).slice(0, 7);

  const highlightWordsSet = new Set(
    (cap.highlightWord || cap.keyword || "LIÊN THÔNG DỮ LIỆU SỐ HẢI QUAN QUẢN LÝ CHẤT LƯỢNG ONE-SHOT")
      .toUpperCase()
      .split(/\s+/)
      .map((s) => s.replace(/[“”,.?!]/g, "").trim())
      .filter(Boolean)
  );

  return (
    <AbsoluteFill>
      {/* Top Banner Phrase: centered exactly in top 30% zone (Y: 0% -> 30%) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${topY}px) scale(${topScale})`,
            opacity: topOpacity,
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 66 * recipe.textScale,
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            textTransform: "uppercase",
            transformOrigin: "center center",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {topWords.map((w, idx) => {
            const clean = w.replace(/[“”,.?!]/g, "").toUpperCase();
            const isHighlight = highlightWordsSet.has(clean) || clean === "LIÊN" || clean === "TỤC" || clean === "CAO" || clean === "SỐ";
            return (
              <span
                key={idx}
                style={{
                  color: isHighlight ? "#FFE600" : "#FFFFFF",
                  textShadow: isHighlight
                    ? "0 0 24px rgba(255,230,0,0.5), 0 8px 26px rgba(0,0,0,0.95)"
                    : "0 8px 26px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom Phrase: centered exactly in bottom 30% zone (Y: 70% -> 100%) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${bottomY}px) scale(${bottomScale})`,
            opacity: bottomOpacity,
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 64 * recipe.textScale,
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            transformOrigin: "center center",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {bottomWords.map((w, idx) => {
            const clean = w.replace(/[“”,.?!]/g, "").toUpperCase();
            const isHighlight = highlightWordsSet.has(clean) || clean === "ONE-SHOT" || clean === "ONESHOT" || clean === "XUẤT" || clean === "LƯỢNG" || clean === "QUAN";
            return (
              <span
                key={idx}
                style={{
                  color: isHighlight ? "#FFE600" : "#FFFFFF",
                  textShadow: isHighlight
                    ? "0 0 24px rgba(255,230,0,0.5), 0 8px 26px rgba(0,0,0,0.95)"
                    : "0 8px 26px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)",
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

/**
 * Style 4: Tag Badge + Highlighted Headline (Reference: media_1788688479347.png)
 * Pill tag: Bright yellow background (#FFE600), black bold uppercase text
 * Headline: ~82px extra bold uppercase, highlighted word in bright yellow (#FFE600), others white
 * Sub: ~46px italic white
 * Sits in lower-center area (~22% from bottom)
 */
export const TagHeadline: React.FC<{ cap: Caption; accent: string; highlight: string }> = ({
  cap,
  accent,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const recipe = useStyle();

  const paddingBottom = Math.round((height * 7) / 100);
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.9, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [22, 0]);

  const tagText = (cap.tag || "TÍNH NĂNG MỚI").toUpperCase().split(/\s+/).slice(0, 4).join(" ");
  const headlineText = (cap.header || cap.text || "").split(/\s+/).slice(0, 6).join(" ");
  const highlightPhrase = (cap.highlightWord || cap.keyword || "TỰ ĐỘNG").toUpperCase();
  const subText = (cap.sub || "").split(/\s+/).slice(0, 6).join(" ");

  const highlightWordsSet = new Set(
    highlightPhrase.split(/\s+/).map((s) => s.replace(/[“”,.?!]/g, "").trim()).filter(Boolean)
  );

  const words = headlineText.split(/\s+/);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%", // Strictly 30% bottom zone (Y: 70% -> 100%)
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // CHÍNH GIỮA 30% DƯỚI!
          alignItems: "center",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            maxWidth: 960,
            textAlign: "center",
          }}
        >
        {/* Yellow Pill Tag */}
        <div
          style={{
            background: "#FFE600",
            color: "#000000",
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontSize: 28 * recipe.textScale,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "8px 26px",
            borderRadius: 999,
            boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
          }}
        >
          {tagText}
        </div>

        {/* Main Headline with Highlighted Word in Yellow */}
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 950,
            fontSize: 82 * recipe.textScale,
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            textTransform: "uppercase",
            textShadow: "0 8px 30px rgba(0,0,0,0.95)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {words.map((w, idx) => {
            const clean = w.replace(/[“”,.?!]/g, "").toUpperCase();
            const isHighlight = highlightWordsSet.has(clean);
            return (
              <span
                key={idx}
                style={{
                  color: isHighlight ? "#FFE600" : "#FFFFFF",
                  textShadow: isHighlight
                    ? "0 0 24px rgba(255,230,0,0.5), 0 8px 28px rgba(0,0,0,0.9)"
                    : "0 8px 28px rgba(0,0,0,0.9)",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* Optional Subtext */}
        {subText ? (
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 46 * recipe.textScale,
              color: "#EDEDE8",
              textShadow: "0 4px 16px rgba(0,0,0,0.85)",
            }}
          >
            {subText}
          </div>
        ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Normal Jumping Transcript Line:
 * 4–6 words per chunk, sentence-case (chữ thường, vừa đủ nhìn ~46px),
 * Active word currently spoken bounces and highlights in vibrant yellow (#FFE600),
 * Other words in the chunk remain clean white (#FFFFFF).
 * Sits directly on bottom 30% blur scrim.
 */
const NormalJumpingTranscriptLine: React.FC<{
  cap: Caption;
  color: string;
  highlight: string;
}> = ({ cap, color, highlight }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const recipe = useStyle();

  const paddingBottom = Math.round((height * 18) / 100);
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [10, 0]);

  const tokens = cap.tokens ?? [{ text: cap.text, fromMs: cap.startMs, toMs: cap.endMs }];
  const absMs = cap.startMs + (frame / fps) * 1000;
  const hasMultipleTokens = tokens.length > 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          display: "flex",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          gap: 14,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 980,
          padding: "0 24px",
          textAlign: "center",
          fontSize: 52 * recipe.textScale,
          fontWeight: 800,
          fontFamily: DISPLAY_FONT,
          textTransform: "none",
          lineHeight: VI_SAFE_LINE_HEIGHT,
          paddingTop: VI_DIACRITIC_PAD,
        }}
      >
        {hasMultipleTokens ? (
          tokens.map((token, i) => {
            const isActive = token.fromMs <= absMs && token.toMs > absMs;
            const c = isActive ? "#FFE600" : "#FFFFFF";
            return (
              <span
                key={i}
                style={{
                  color: c,
                  display: "inline-block",
                  fontWeight: isActive ? 950 : 800,
                  transform: isActive ? "scale(1.15) translateY(-3px)" : "scale(1)",
                  textShadow: isActive
                    ? "0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)"
                    : "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)",
                  transition: "transform 0.08s ease, color 0.08s ease",
                }}
              >
                {token.text.trim()}
              </span>
            );
          })
        ) : (
          <span
            style={{
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            {cap.text}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * AnhSacKineticCaptionLine:
 * The signature viral text motion animation seen in Anh Sac & Top Tier Creators:
 * 1. ALL CAPS Montserrat 900 bold typography, with crisp black stroke & 3D shadow.
 * 2. Entire phrase bounces into view with spring pop (scale 0.82 -> 1.0, translateY 14 -> 0).
 * 3. Word-by-word active bounce: As each word is spoken, it leaps forward (scale 1.26x, translateY -6px),
 *    illuminates in vibrant yellow (#FFE600) or brand orange (#FF6B00), and casts an intense glow.
 * 4. Micro-settle: When the word finishes, it snaps cleanly back into line, creating a lively
 *    rhythmic pulse that keeps viewers glued to the screen!
 * 5. Positioned strictly in the bottom safe band (centered inside the bottom 30% band).
 */
export const AnhSacKineticCaptionLine: React.FC<{
  cap: Caption;
  color: string;
  highlight: string;
  accent: string;
  activeGraphicIntervals?: Array<{ startMs: number; endMs: number }>;
}> = ({ cap, color, highlight, accent, activeGraphicIntervals = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const absMs = cap.startMs + (frame / fps) * 1000;
  // Dynamic per-frame mutual exclusion: if a graphic is on screen right now, do not render subtitle
  const isOverlapping = activeGraphicIntervals.some(
    (g) => absMs >= g.startMs && absMs <= g.endMs
  );
  if (isOverlapping) return null;

  // Entrance spring for phrase
  const phrasePop = spring({
    frame,
    fps,
    config: { damping: 11, mass: 0.45, stiffness: 180 },
  });
  const phraseScale = interpolate(phrasePop, [0, 1], [0.84, 1]);
  const phraseY = interpolate(phrasePop, [0, 1], [14, 0]);
  const phraseOpacity = interpolate(phrasePop, [0, 1], [0, 1]);

  const tokens = cap.tokens ?? [{ text: cap.text, fromMs: cap.startMs, toMs: cap.endMs }];
  const hasMultipleTokens = tokens.length > 1;

  // Words that should punch in brand orange #FF6B00 instead of yellow #FFE600
  const isSpecialKeyword = (txt: string) => {
    const clean = txt.toUpperCase().replace(/[^A-Z0-9À-Ỹ]/g, "");
    return ["37", "3", "1", "2", "GS1", "HS", "HẢI", "QUAN", "QLCL", "LUẬT", "ĐẠT", "GIẢM", "XUẤT"].includes(clean);
  };

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        position: "absolute",
        top: "auto",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30%", // Strictly within 30% bottom safe band
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // CHÍNH GIỮA 30% DƯỚI!
        alignItems: "center",
        padding: "0 36px",
      }}
    >
      <div
        style={{
          transform: `translateY(${phraseY}px) scale(${phraseScale})`,
          opacity: phraseOpacity,
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 14px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 960,
          textAlign: "center",
          fontSize: 52 * recipe.textScale,
          fontWeight: 900,
          fontFamily: DISPLAY_FONT,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          lineHeight: VI_SAFE_LINE_HEIGHT,
          paddingTop: VI_DIACRITIC_PAD,
        }}
      >
        {hasMultipleTokens ? (
          tokens.map((token, i) => {
            const isActive = token.fromMs <= absMs && token.toMs > absMs;
            const wordElapsedMs = Math.max(0, absMs - token.fromMs);
            const wordElapsedFrames = (wordElapsedMs / 1000) * fps;

            // Word-level spring pop when active
            const wordSpring = spring({
              frame: wordElapsedFrames,
              fps,
              config: { damping: 8, mass: 0.35, stiffness: 240 },
            });

            const wordScale = isActive ? interpolate(wordSpring, [0, 1], [1.0, 1.28]) : 1;
            const wordTranslateY = isActive ? interpolate(wordSpring, [0, 1], [0, -6]) : 0;
            const isOrange = isSpecialKeyword(token.text);
            const activeColor = isOrange ? accent : highlight;

            const textColor = isActive ? activeColor : "#FFFFFF";
            const textShadow = isActive
              ? "0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)"
              : "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)";

            return (
              <span
                key={i}
                style={{
                  color: textColor,
                  display: "inline-block",
                  fontWeight: 900,
                  transform: `translateY(${wordTranslateY}px) scale(${wordScale})`,
                  transformOrigin: "center bottom",
                  textShadow,
                  transition: "color 0.08s ease",
                }}
              >
                {token.text.trim()}
              </span>
            );
          })
        ) : (
          <span
            style={{
              color: "#FFFFFF",
              textShadow:
                "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            {cap.text}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Style 6: Kinetic Pop (Reference: Anh Sac Style frame_002, frame_010)
 * 1 Giant focal word (130–160px bold uppercase) + secondary phrase (44–52px bold)
 * Centered on chest / upper-middle band with explosive spring.
 */
export const KineticPopHeadline: React.FC<{
  cap: Caption;
  accent?: string;
  highlight?: string;
}> = ({ cap, accent = "#FF6B00", highlight = "#FFE600" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Punch-in explosive spring (scale 0.45 -> 1.0)
  const pop = spring({ frame, fps, config: { damping: 9, mass: 0.38, stiffness: 220 } });
  const scale = interpolate(pop, [0, 1], [0.45, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const glow = interpolate(pop, [0, 0.6, 1], [0, 1, 0.45]);

  const rawText = cap.text.trim();
  let focalWord = cap.keyword?.trim() || cap.highlightWord?.trim() || "";
  let remainingText = cap.header?.trim() || "";

  if (!focalWord) {
    const words = rawText.split(/\s+/);
    if (words.length > 0) {
      focalWord = words[0];
      remainingText = words.slice(1).join(" ");
    }
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "30%", // strictly within 30% top safe band
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // CHÍNH GIỮA 30% TRÊN!
        alignItems: "center",
        zIndex: 15,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          maxWidth: 960,
          textAlign: "center",
        }}
      >
        {/* Giant Focal Word */}
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 132,
            fontWeight: 950,
            fontStyle: "italic",
            color: accent,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)',
            transform: "skewX(-3deg)",
          }}
        >
          {focalWord}
        </div>

        {/* Remaining / Supporting Text */}
        {remainingText ? (
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 48,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1.25,
              marginTop: 10,
              textShadow:
                "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            {remainingText}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Style 7: Staggered Lines (Reference: Anh Sac Style frame_010)
 * 2 or 3 lines of alternating size and weight, staggered vertically
 */
export const StaggeredLinesHeadline: React.FC<{
  cap: Caption;
  accent?: string;
  highlight?: string;
}> = ({ cap, accent = "#FF6B00", highlight = "#FFE600" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered springs for each line
  const pop1 = spring({ frame, fps, config: { damping: 11, mass: 0.4 } });
  const scale1 = interpolate(pop1, [0, 1], [0.65, 1]);
  const y1 = interpolate(pop1, [0, 1], [-25, 0]);

  const frame2 = Math.max(0, frame - 5);
  const pop2 = spring({ frame: frame2, fps, config: { damping: 10, mass: 0.38 } });
  const scale2 = interpolate(pop2, [0, 1], [0.55, 1]);

  const frame3 = Math.max(0, frame - 10);
  const pop3 = spring({ frame: frame3, fps, config: { damping: 11, mass: 0.4 } });
  const scale3 = interpolate(pop3, [0, 1], [0.65, 1]);
  const y3 = interpolate(pop3, [0, 1], [25, 0]);

  const lines = cap.text.split("\n").map((l) => l.trim()).filter(Boolean);
  const l1 = cap.header || (lines[0] ?? "");
  const l2 = cap.keyword || (lines[1] ?? (lines.length === 1 ? "" : lines[0]));
  const l3 = cap.sub || (lines[2] ?? "");

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30%", // strictly within 30% bottom safe band
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // CHÍNH GIỮA 30% DƯỚI!
        alignItems: "center",
        zIndex: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 40px",
          maxWidth: 960,
          textAlign: "center",
          gap: 10,
        }}
      >
        {l1 ? (
          <div
            style={{
              transform: `translateY(${y1}px) scale(${scale1})`,
              opacity: interpolate(pop1, [0, 1], [0, 1]),
              fontFamily: DISPLAY_FONT,
              fontSize: 48,
              fontWeight: 800,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            {l1}
          </div>
        ) : null}

        {l2 ? (
          <div
            style={{
              transform: `scale(${scale2})`,
              opacity: interpolate(pop2, [0, 1], [0, 1]),
              fontFamily: DISPLAY_FONT,
              fontSize: 84,
              fontWeight: 950,
              color: accent,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              textShadow: "0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)",
            }}
          >
            {l2}
          </div>
        ) : null}

        {l3 ? (
          <div
            style={{
              transform: `translateY(${y3}px) scale(${scale3})`,
              opacity: interpolate(pop3, [0, 1], [0, 1]),
              fontFamily: DISPLAY_FONT,
              fontSize: 44,
              fontWeight: 800,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            {l3}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
