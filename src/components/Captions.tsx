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

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {captions.map((cap, i) => {
        const from = Math.round((cap.startMs / 1000) * fps);
        const end = Math.round((cap.endMs / 1000) * fps);
        const dur = Math.max(1, end - from);

        // Enforce Mutual Exclusivity (only for thuy-style-oneshot):
        // If a B-roll or graphic is active during this caption's interval,
        // and this is a normal caption, hide it.
        if (!isClassic) {
          const overlapsGraphic = activeGraphicIntervals.some(
            (g) => Math.max(cap.startMs, g.startMs) < Math.min(cap.endMs, g.endMs)
          );
          if (overlapsGraphic && cap.headlineStyle === "normal") {
            return null;
          }
        }

        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {isClassic ? (
              // Classic preset: always render normal karaoke jumping subtitles
              <NormalJumpingTranscriptLine cap={cap} color={color} highlight={highlight} />
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
const ThreeTierHeadline: React.FC<{ cap: Caption; accent: string }> = ({ cap, accent }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const recipe = useStyle();

  const paddingBottom = Math.round((height * 20) / 100);
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.92, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [24, 0]);

  let header = cap.header?.trim() ?? "";
  let keyword = cap.keyword?.trim() ?? "";
  let sub = cap.sub?.trim() ?? "";

  if (!header && !keyword) {
    const raw = cap.text.trim();
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      header = lines[0];
      keyword = lines[1];
      sub = lines.slice(2).join(" ");
    } else if (lines.length === 2) {
      header = lines[0];
      keyword = lines[1];
    } else {
      keyword = raw;
    }
  }

  let formattedKeyword = keyword.toUpperCase();
  if (formattedKeyword && !formattedKeyword.startsWith("“") && !formattedKeyword.startsWith('"')) {
    formattedKeyword = `“${formattedKeyword}”`;
  }

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
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          maxWidth: 960,
          padding: "0 30px",
          textAlign: "center",
        }}
      >
        {/* Line 1: Header / Context (White) */}
        {header ? (
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: 54 * recipe.textScale,
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
              fontSize: Math.min(104, Math.max(76, (104 * 16) / Math.max(16, formattedKeyword.length))) * recipe.textScale,
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
              fontSize: 50 * recipe.textScale,
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
    </AbsoluteFill>
  );
};

/**
 * Style 2: Stat / Number / Ordinal Punch (Reference: media_1788688641617.png & media_1788688358136.png)
 * Giant punchline text: ~115px extra bold italic display font uppercase, VIBRANT YELLOW (#FFE600)
 * Descriptor line below: ~52px italic white
 * Position: Upper safe zone (~24% from top)
 */
const StatPunchHeadline: React.FC<{ cap: Caption; accent: string }> = ({ cap, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.45 } });
  const scale = interpolate(pop, [0, 1], [0.78, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [28, 0]);

  const punchText = (cap.keyword || cap.header || cap.text).toUpperCase();
  const descriptor = cap.sub || "";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "24%",
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
          padding: "0 30px",
          textAlign: "center",
        }}
      >
        {/* Massive Punch / Stat in Vibrant Yellow */}
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 950,
            fontStyle: "italic",
            fontSize: Math.min(115, Math.max(82, (115 * 14) / Math.max(14, punchText.length))) * recipe.textScale,
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
              fontSize: 52 * recipe.textScale,
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
const SplitContrastHeadline: React.FC<{ cap: Caption; accent: string }> = ({ cap, accent }) => {
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
  const topWords = topText.split(/\s+/);
  const bottomWords = bottomText.split(/\s+/);

  return (
    <AbsoluteFill>
      {/* Top Banner Phrase: Frame 0 entrance */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${topY}px) scale(${topScale})`,
          opacity: topOpacity,
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 72 * recipe.textScale,
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            textTransform: "uppercase",
            transform: "skewX(-3deg)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {topWords.map((w, idx) => {
            const clean = w.replace(/[“”,.?!]/g, "").toUpperCase();
            const isHighlight = clean === "LIÊN" || clean === "TỤC" || clean === "CAO";
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

      {/* Bottom Chest Phrase: Frame 14 staggered entrance */}
      <div
        style={{
          position: "absolute",
          top: "56%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${bottomY}px) scale(${bottomScale})`,
          opacity: bottomOpacity,
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 74 * recipe.textScale,
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            transform: "skewX(-3deg)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {bottomWords.map((w, idx) => {
            const clean = w.replace(/[“”,.?!]/g, "").toUpperCase();
            const isHighlight = clean === "ONE-SHOT" || clean === "ONESHOT" || clean === "XUẤT";
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
const TagHeadline: React.FC<{ cap: Caption; accent: string; highlight: string }> = ({
  cap,
  accent,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const recipe = useStyle();

  const paddingBottom = Math.round((height * 22) / 100);
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.9, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const translateY = interpolate(pop, [0, 1], [22, 0]);

  const tagText = (cap.tag || "TÍNH NĂNG MỚI").toUpperCase();
  const headlineText = cap.header || cap.text || "";
  const highlightPhrase = (cap.highlightWord || cap.keyword || "TỰ ĐỘNG").toUpperCase();
  const subText = cap.sub || "";

  const highlightWordsSet = new Set(
    highlightPhrase.split(/\s+/).map((s) => s.replace(/[“”,.?!]/g, "").trim()).filter(Boolean)
  );

  const words = headlineText.split(/\s+/);

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
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          maxWidth: 960,
          padding: "0 30px",
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
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 920,
          padding: "0 36px",
          textAlign: "center",
          fontSize: 46 * recipe.textScale, // Vừa đủ nhìn, thanh thoát
          fontWeight: 700,
          fontFamily: DISPLAY_FONT,
          textTransform: "none", // Chữ thường (sentence-case)
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
                  fontWeight: isActive ? 900 : 700,
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  textShadow: isActive
                    ? "0 0 22px rgba(255,230,0,0.5), 0 4px 16px rgba(0,0,0,0.95)"
                    : "0 4px 14px rgba(0,0,0,0.9)",
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
              textShadow: "0 4px 16px rgba(0,0,0,0.95)",
            }}
          >
            {cap.text}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};
