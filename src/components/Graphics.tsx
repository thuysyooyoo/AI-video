/**
 * Motion-graphic overlays mapped from EDL graphics track.
 * hook (spring scale-in title), cta (end call-to-action), kinetic (per-word bounce),
 * lower-third (handle). Each driven by useCurrentFrame + spring/interpolate.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Graphic } from "../edl-types";
import {
  AnimatedCallout,
  HighlightReveal,
  NumberCounter,
  ProgressBar,
  BadgePop,
} from "./MotionGraphics";
import { GlassCard } from "./AdvancedLayouts";
import { DonutStat, BarStat } from "./Charts";
import { KineticStatement, MaskReveal, GlassStrip } from "./KineticTypo";
import { PathMark } from "./PathMarks";
import { Shape3D } from "./Shape3D";
import { IllusMark } from "./Elements";
import { StepFlow, Comparison, ListReveal, LowerThirdPro } from "./Infographic";
import { InfoTable, StatCompare } from "./DataViz";
import {
  DiamondLabel,
  DualIconCards,
  NegativeSlashCard,
  NeonIconCard,
  PremiumRoadmap,
} from "./PremiumVisuals";
import { AdComparisonScene } from "./TobiAdVisuals";
import { enterExit, popSpring, floatY, glow } from "../anim";
import { topBandStyle, bottomBandStyle, centerStyle } from "../layout";
import { DISPLAY_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from "../fonts";
import { useStyle } from "../style-context";
import { pickEmphasisIndex } from "../text-emphasis";
import { BrollHookTitle, BrollSubHook, BrollCta } from "./BrollHook";
import { FullscreenKeywordBroll } from "./FullscreenKeywordBroll";
import {
  ThreeTierHeadline,
  StatPunchHeadline,
  SplitContrastHeadline,
  TagHeadline,
  KineticPopHeadline,
  StaggeredLinesHeadline,
} from "./Captions";
import {
  GlowAmbientHeadline,
  AsymmetricTrioHeadline,
  StackedContrastHeadline,
  MultiBlockFlowHeadline,
} from "./AnhSacKineticTypo";
import { GridFlatCard, NumberBadge } from "./GridFlatCard";

export const GraphicLayer: React.FC<{
  graphic: Graphic;
  accent: string;
  accent2: string;
  placement?: 'center' | 'top-safe';
  iconsEnabled?: boolean;
}> = ({
  graphic,
  accent,
  accent2,
  placement = 'top-safe',
  iconsEnabled = true,
}) => {
  const recipe = useStyle();
  const scale = Math.min(1, Math.max(0.45, recipe.textScale));
  let node: React.ReactNode = null;
  switch (graphic.type) {
    case "hook":
      node = <HookTitle text={graphic.text} accent={accent} accent2={accent2} placement={placement} />;
      break;
    case "cta":
      node = <CtaEnd text={graphic.text} accent={accent} accent2={accent2} placement={placement} />;
      break;
    case "kinetic":
      node = <KineticText text={graphic.text} accent={accent} />;
      break;
    case "lower-third":
      node = <LowerThird text={graphic.text} accent={accent} />;
      break;
    case "callout":
      // warningMode (GROUP 1): alert-red accent instead of the theme accent
      node = <AnimatedCallout text={graphic.text} accent={graphic.warningMode ? "#EF4444" : accent} anchor={graphic.anchor} />;
      break;
    case "highlight-reveal":
      node = <HighlightReveal text={graphic.text} accent={accent} />;
      break;
    case "number-counter":
      node = (
        <NumberCounter
          value={graphic.value ?? 0}
          suffix={graphic.suffix}
          label={graphic.label}
          accent={accent}
        />
      );
      break;
    case "progress-bar":
      node = <ProgressBar accent={accent} label={graphic.label} />;
      break;
    case "badge":
      node = <BadgePop text={graphic.text} accent={accent} />;
      break;
    case "color-wipe":
      // ColorWipe removed from the system: a full-frame color plate over the
      // speaker reads as a render glitch; legacy entries render nothing
      node = null;
      break;
    // ---- b-roll hook stack (workflow B) ----
    case "broll-hook":
      node = (
        <BrollHookTitle
          lines={graphic.items?.length ? graphic.items : graphic.text.split("|").map((s) => s.trim()).filter(Boolean)}
          accent={accent}
        />
      );
      break;
    case "broll-subhook":
      node = <BrollSubHook text={graphic.text} />;
      break;
    case "broll-cta":
      node = <BrollCta text={graphic.text} />;
      break;
    case "glass-card":
      node = <GlassCard step={graphic.step} title={graphic.text} accent={accent} />;
      break;
    case "donut-stat":
      node = <DonutStat value={graphic.value ?? 100} label={graphic.label} accent={accent} />;
      break;
    case "bar-stat":
      node = <BarStat value={graphic.value ?? 50} label={graphic.label} accent={accent} />;
      break;
    case "kinetic-statement":
      node = <KineticStatement text={graphic.text} accent={accent} accent2={accent2} />;
      break;
    case "mask-reveal":
      node = <MaskReveal text={graphic.text} accent={accent} accent2={accent2} />;
      break;
    case "glass-strip":
      node = <GlassStrip text={graphic.text} accent={accent} accent2={accent2} />;
      break;
    case "path-mark":
      node = <PathMark text={graphic.text} accent={accent} kind={graphic.kind} />;
      break;
    case "shape-3d":
      node = <Shape3D text={graphic.text} accent={accent} kind={graphic.shape} />;
      break;
    case "illus-mark":
      node = <IllusMark kind={graphic.illus} accent={accent} />;
      break;
    case "step-flow":
      node = <StepFlow steps={graphic.items ?? []} accent={accent} accent2={accent2} placement={placement} />;
      break;
    case "comparison":
      node = <Comparison left={graphic.left ?? ""} right={graphic.right ?? ""} accent={accent} accent2={accent2} placement={placement} />;
      break;
    case "list-reveal":
      node = <ListReveal items={graphic.items ?? []} accent={accent} rank={graphic.rank} placement={placement} />;
      break;
    case "lower-third-pro":
      node = <LowerThirdPro title={graphic.text} subtitle={graphic.subtitle} accent={accent} accent2={accent2} />;
      break;
    case "info-table":
      node = <InfoTable title={graphic.text} rows={graphic.rows ?? []} accent={accent} accent2={accent2} />;
      break;
    case "stat-compare":
      node = (
        <StatCompare
          title={graphic.text}
          leftLabel={graphic.leftLabel ?? "A"}
          leftVal={graphic.leftVal ?? 0}
          rightLabel={graphic.rightLabel ?? "B"}
          rightVal={graphic.rightVal ?? 0}
          unit={graphic.unit}
          accent={accent}
          accent2={accent2}
        />
      );
      break;
    case "premium-roadmap":
      node = <PremiumRoadmap title={graphic.text} subtitle={graphic.subtitle} steps={graphic.items} rows={graphic.rows} accent={accent} />;
      break;
    case "neon-icon-card":
      node = <NeonIconCard text={graphic.text} emphasis={graphic.emphasis} icon={graphic.icon} accent={accent} iconsEnabled={iconsEnabled} />;
      break;
    case "negative-slash-card":
      node = <NegativeSlashCard text={graphic.text} accent="#EF1F2D" iconsEnabled={iconsEnabled} />;
      break;
    case "dual-icon-cards":
      node = <DualIconCards left={graphic.left} right={graphic.right} accent={accent} accent2={accent2} iconsEnabled={iconsEnabled} />;
      break;
    case "diamond-label":
      node = <DiamondLabel text={graphic.text} accent={accent} />;
      break;
    case "ad-comparison-scene":
      node = (
        <AdComparisonScene
          text={graphic.text}
          emphasis={graphic.emphasis}
          items={graphic.items}
          sourceClip={graphic.sourceClip}
          variant={graphic.adVariant}
        />
      );
      break;
    case "fullscreen-keyword":
      node = (
        <FullscreenKeywordBroll
          text={graphic.text}
          subtitle={graphic.subtitle}
          accent={accent}
          accent2={accent2}
        />
      );
      break;
    case "3-tier":
      node = (
        <ThreeTierHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "3-tier",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle,
          }}
          accent={accent}
        />
      );
      break;
    case "stat-punch":
      node = (
        <StatPunchHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "stat-punch",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle,
          }}
          accent={accent}
        />
      );
      break;
    case "split-contrast":
      node = (
        <SplitContrastHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "split-contrast",
            topText: graphic.topText || graphic.header,
            bottomText: graphic.bottomText || graphic.subtitle,
            highlightWord: graphic.highlightWord || graphic.keyword,
          }}
          accent={accent}
        />
      );
      break;
    case "tag-headline":
      node = (
        <TagHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "tag-headline",
            tag: graphic.tag,
            header: graphic.header,
            keyword: graphic.keyword,
            highlightWord: graphic.highlightWord || graphic.keyword,
            sub: graphic.subtitle,
          }}
          accent={accent}
          highlight={recipe.highlightColor}
        />
      );
      break;
    case "grid-flat-card":
      node = (
        <GridFlatCard
          title={graphic.text || graphic.header || ""}
          secondaryText={graphic.secondaryText}
          iconType={graphic.iconType ?? "timeline"}
          subtitle={graphic.bottomText || graphic.subtitle}
          accent={accent}
          accent2={accent2}
        />
      );
      break;
    case "number-badge":
      node = (
        <NumberBadge
          number={graphic.numberValue ?? graphic.value ?? 1}
          accent={accent}
        />
      );
      break;
    case "kinetic-pop":
      node = (
        <KineticPopHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "kinetic-pop",
            header: graphic.header,
            keyword: graphic.keyword,
            highlightWord: graphic.highlightWord || graphic.keyword,
          }}
          accent={accent}
          highlight={recipe.highlightColor}
        />
      );
      break;
    case "staggered-lines":
      node = (
        <StaggeredLinesHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "staggered-lines",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle,
          }}
          accent={accent}
          highlight={recipe.highlightColor}
        />
      );
      break;
    case "glow-ambient":
      node = (
        <GlowAmbientHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "glow-ambient",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle || (graphic as any).sub,
          }}
          position={graphic.anchor === "bottom" ? "bottom" : "top"}
          accent={accent}
        />
      );
      break;
    case "asymmetric-trio":
      node = (
        <AsymmetricTrioHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "asymmetric-trio",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle || (graphic as any).sub,
          }}
          position={graphic.anchor === "bottom" ? "bottom" : "top"}
          accent={accent}
          highlight={recipe.highlightColor}
        />
      );
      break;
    case "stacked-contrast":
      node = (
        <StackedContrastHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "stacked-contrast",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle || (graphic as any).sub,
          }}
          position={graphic.anchor === "bottom" ? "bottom" : "top"}
          accent={accent}
          highlight={recipe.highlightColor}
        />
      );
      break;
    case "multiblock-flow":
      node = (
        <MultiBlockFlowHeadline
          cap={{
            text: graphic.text,
            startMs: graphic.startMs,
            endMs: graphic.endMs,
            keywordIdx: -1,
            headlineStyle: "multiblock-flow",
            header: graphic.header,
            keyword: graphic.keyword,
            sub: graphic.subtitle || (graphic as any).sub,
          }}
          position={graphic.anchor === "bottom" ? "bottom" : "top"}
          accent={accent}
          highlight={recipe.highlightColor}
        />
      );
      break;
    default:
      node = null;
  }
  if (!node) return null;
  if (
    graphic.type === "fullscreen-keyword" ||
    graphic.type === "3-tier" ||
    graphic.type === "stat-punch" ||
    graphic.type === "split-contrast" ||
    graphic.type === "tag-headline" ||
    graphic.type === "grid-flat-card" ||
    graphic.type === "number-badge" ||
    graphic.type === "kinetic-pop" ||
    graphic.type === "staggered-lines" ||
    graphic.type === "glow-ambient" ||
    graphic.type === "asymmetric-trio" ||
    graphic.type === "stacked-contrast" ||
    graphic.type === "multiblock-flow"
  ) {
    return <AbsoluteFill style={{ pointerEvents: "none" }}>{node}</AbsoluteFill>;
  }
  // honor the EDL's anchor hint for mid-screen cards — these components place
  // themselves at a fixed height and used to ignore anchor entirely (review
  // finding: cards parked over the speaker's mouth with no way to move them)
  const ANCHOR_CARD_TYPES = new Set([
    "stat-compare", "info-table", "neon-icon-card", "negative-slash-card",
    "dual-icon-cards", "diamond-label", "list-reveal", "comparison", "step-flow",
  ]);
  const anchorShiftPct =
    graphic.anchor && ANCHOR_CARD_TYPES.has(graphic.type)
      ? { top: 0, center: 18, bottom: 38 }[graphic.anchor] ?? 0
      : 0;
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${anchorShiftPct}%) scale(${scale})`,
        transformOrigin: "50% 71%",
        pointerEvents: "none",
      }}
    >
      {node}
    </AbsoluteFill>
  );
};

const HookTitle: React.FC<{ text: string; accent: string; accent2: string; placement?: 'center' | 'top-safe' }> = ({
  text,
  accent,
  accent2,
  placement = 'top-safe',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  const e = enterExit(frame, fps, durationInFrames, 8);
  const words = text.split(" ");
  const emphasisIdx = pickEmphasisIndex(words);
  const lineW = interpolate(popSpring(frame, fps, 6), [0, 1], [0, 100]);
  const isCenter = placement === 'center';
  return (
    <AbsoluteFill style={{ opacity: e }}>
      {isCenter ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 38%, ${accent}26, rgba(0,0,0,0.5) 72%)`,
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 32%, transparent 48%)`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isCenter ? "100%" : "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // CHÍNH GIỮA 30% TRÊN!
          alignItems: "center",
          padding: isCenter ? 80 : "0 30px",
          paddingTop: isCenter ? 0 : 70, // Đẩy nhẹ xuống dưới thanh icon tìm kiếm/âm thanh để nằm cân đối
        }}
      >
        <div style={{ textAlign: "center", maxWidth: isCenter ? 960 : 940, padding: isCenter ? 0 : "0 30px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isCenter ? "6px 20px" : "6px 18px",
              justifyContent: "center",
              fontFamily: DISPLAY_FONT,
              fontWeight: 900,
              fontSize: isCenter ? 104 : 82,
              textTransform: "uppercase",
              lineHeight: VI_SAFE_LINE_HEIGHT,
              paddingTop: VI_DIACRITIC_PAD,
            }}
          >
            {words.map((w, i) => {
              const ws = popSpring(frame, fps, i * 4);
              const emph = i === emphasisIdx;
              return (
                <span
                  key={i}
                  style={{
                    transform: `translateY(${interpolate(ws, [0, 1], [isCenter ? 70 : 50, 0])}px)`,
                    opacity: ws,
                    ...(emph
                      ? recipe.textFx === "solid"
                        ? { color: accent }
                        : { backgroundImage: `linear-gradient(100deg,${accent},${accent2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                      : { color: "#fff" }),
                    textShadow: emph ? "none" : `0 6px 24px rgba(0,0,0,${isCenter ? 0.6 : 0.7})`,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          {/* accent underline draws in */}
          <div
            style={{
              height: isCenter ? 10 : 8,
              width: `${lineW}%`,
              maxWidth: isCenter ? 420 : 380,
              margin: isCenter ? "28px auto 0" : "20px auto 0",
              borderRadius: 999,
              background: `linear-gradient(90deg,${accent},${accent2})`,
              boxShadow: glow(accent, true),
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaEnd: React.FC<{ text: string; accent: string; accent2: string; placement?: 'center' | 'top-safe' }> = ({
  text,
  accent,
  accent2,
  placement = 'top-safe',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = enterExit(frame, fps, durationInFrames, 8);
  const s = popSpring(frame, fps);
  const pulse = 1 + Math.sin(frame / 8) * 0.02;
  const isCenter = placement === 'center';
  const chevron = floatY(frame, isCenter ? 10 : 8, isCenter ? 40 : 30);
  return (
    <AbsoluteFill style={{ opacity: e }}>
      {isCenter ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${accent}33, rgba(0,0,0,0.8) 70%)` }} />
      ) : (
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 32%, transparent 48%)` }} />
      )}
      <AbsoluteFill style={{ justifyContent: isCenter ? "center" : "flex-start", alignItems: "center", flexDirection: "column", paddingTop: isCenter ? 0 : 200, gap: isCenter ? 30 : 20 }}>
        <div
          style={{
            transform: `translateY(${interpolate(s, [0, 1], [isCenter ? 70 : 50, 0])}px) scale(${interpolate(s, [0, 1], [isCenter ? 0.8 : 0.85, pulse])})`,
            background: `linear-gradient(100deg,${accent},${accent2})`,
            color: "#fff",
            fontFamily: DISPLAY_FONT,
            fontSize: isCenter ? 72 : 58,
            fontWeight: 900,
            padding: isCenter ? "30px 60px" : "22px 52px",
            borderRadius: 999,
            textAlign: "center",
            textTransform: "uppercase",
            boxShadow: glow(accent, true),
          }}
        >
          {text}
        </div>
        {/* down chevron */}
        <svg width={isCenter ? "90" : "72"} height={isCenter ? "70" : "54"} viewBox="0 0 90 70" style={{ transform: `translateY(${chevron}px)`, opacity: interpolate(s, [0, 1], [0, 1]) }}>
          <path d="M10 15 L45 50 L80 15" fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const KineticText: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = enterExit(frame, fps, durationInFrames);
  const words = text.split(" ");
  return (
    <AbsoluteFill style={{ ...topBandStyle(20), opacity: e }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 900 }}>
        {words.map((w, i) => {
          const s = popSpring(frame, fps, i * 3);
          return (
            <span
              key={i}
              style={{
                transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
                opacity: s,
                color: i % 2 === 0 ? "#fff" : accent,
                fontSize: 80,
                fontWeight: 900,
                textShadow: i % 2 === 0 ? "0 4px 16px rgba(0,0,0,0.6)" : glow(accent),
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const LowerThird: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ ...bottomBandStyle(), alignItems: "flex-start", paddingLeft: 60 }}>
      <div
        style={{
          transform: `translateX(${interpolate(s, [0, 1], [-200, 0])}px)`,
          opacity: s,
          background: accent,
          color: "#fff",
          fontSize: 44,
          fontWeight: 800,
          padding: "16px 28px",
          borderRadius: 16,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
