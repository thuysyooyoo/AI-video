/**
 * Premium semantic visuals — dark/gold line-art assets inspired by high-end
 * explainer reels: neon icon cards, roadmap scenes, slash cards, dual cards.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { glow, grammar, voicePop } from "../anim";
import { BODY_FONT, DISPLAY_FONT } from "../fonts";
import { useStyle } from "../style-context";

type PremiumIcon =
  | "course-access" | "advice" | "confidence" | "process" | "warning"
  | "progress" | "video-course" | "magnet" | "quality" | "idea";

const goldShadow = (accent: string, strong = false) =>
  strong
    ? `0 18px 48px rgba(0,0,0,0.62), 0 0 22px ${accent}cc, 0 0 48px ${accent}55`
    : `0 12px 34px rgba(0,0,0,0.55), 0 0 16px ${accent}99`;

const Icon: React.FC<{ kind?: PremiumIcon; accent: string; color?: string; size?: number }> = ({
  kind = "idea",
  accent,
  color = accent,
  size = 96,
}) => {
  const common = { fill: "none", stroke: color, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const white = { ...common, stroke: "#F7F7F2", strokeWidth: 4 };
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", filter: `drop-shadow(0 0 8px ${accent}aa)` }}>
      {kind === "course-access" && <>
        <rect x="24" y="30" width="48" height="54" rx="6" {...common} />
        <path d="M34 44 h28 M34 58 h20 M80 42 h18 v54 H38" {...white} />
        <path d="M44 74 l8 8 16-20" {...common} />
      </>}
      {kind === "advice" && <>
        <path d="M36 72 h36 l18 16 V42 c0-8-6-14-14-14H36c-8 0-14 6-14 14v16c0 8 6 14 14 14Z" {...common} />
        <path d="M40 48 h34 M40 60 h22" {...white} />
        <path d="M34 92 c18 0 22-8 28-20" {...common} />
      </>}
      {kind === "confidence" && <>
        <circle cx="43" cy="52" r="20" {...common} />
        <circle cx="78" cy="67" r="20" {...white} />
        <path d="M33 54 c6 8 15 8 21 0 M69 69 c6 8 15 8 21 0" {...common} />
      </>}
      {kind === "process" && <>
        <circle cx="32" cy="34" r="11" {...common} /><circle cx="86" cy="42" r="11" {...common} /><circle cx="56" cy="86" r="11" {...common} />
        <path d="M43 36 C60 28 72 31 78 36 M82 54 C76 70 68 78 59 82 M48 84 C34 76 27 62 30 47" {...white} />
      </>}
      {kind === "warning" && <>
        <path d="M60 22 L104 94 H16 Z" {...common} />
        <path d="M60 46 v24 M60 84 v2" {...white} />
      </>}
      {kind === "progress" && <>
        <path d="M24 82 A36 36 0 0 1 96 82" {...common} />
        <path d="M60 82 L80 55" {...white} />
        <path d="M32 82 h56 M38 70 l-8-8 M82 70 l8-8 M60 46 v-12" {...common} />
        <path d="M60 18 l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1Z" {...white} />
      </>}
      {kind === "video-course" && <>
        <rect x="24" y="34" width="72" height="50" rx="8" {...common} />
        <path d="M52 48 l24 12-24 12Z" {...white} />
        <path d="M34 94 h52 M36 24 h14 M58 24 h14 M80 24 h8" {...common} />
      </>}
      {kind === "magnet" && <>
        <path d="M32 24 v44 c0 18 12 30 28 30s28-12 28-30V24" {...common} />
        <path d="M32 42 h20 M68 42 h20 M32 58 h20 M68 58 h20" {...white} />
      </>}
      {kind === "quality" && <>
        <path d="M60 18 l10 24 26 2-20 17 6 26-22-14-22 14 6-26-20-17 26-2Z" {...common} />
        <path d="M42 62 l12 12 26-30" {...white} />
      </>}
      {kind === "idea" && <>
        <path d="M60 20 c-18 0-32 13-32 30 0 12 7 21 17 27 v13 h30V77c10-6 17-15 17-27 0-17-14-30-32-30Z" {...common} />
        <path d="M46 102 h28 M50 88 h20 M50 52 c5-8 15-8 20 0" {...white} />
      </>}
    </svg>
  );
};

const PremiumCard: React.FC<{ children: React.ReactNode; w?: number; h?: number; accent: string; style?: React.CSSProperties }> = ({
  children,
  w = 520,
  h = 180,
  accent,
  style,
}) => (
  <div style={{
    position: "relative",
    width: w,
    minHeight: h,
    borderRadius: 22,
    background: "linear-gradient(180deg, rgba(4,5,7,0.82), rgba(4,5,7,0.58))",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: goldShadow(accent),
    backdropFilter: "blur(16px)",
    overflow: "hidden",
    ...style,
  }}>
    <div style={{ position: "absolute", inset: "8px auto 8px 8px", width: 5, borderRadius: 999, background: accent, boxShadow: `0 0 18px ${accent}` }} />
    <div style={{ position: "absolute", inset: "8px 8px auto auto", width: 92, height: 5, borderRadius: 999, background: "#fff", boxShadow: "0 0 16px rgba(255,255,255,0.85)" }} />
    {children}
  </div>
);

// 17% (~326px): firmly inside the TOP safe zone (below top bar ~150px, above head top ~480px)
// Keeps cards entirely off the speaker's face and captions.
// 56%: below the face (avg center ~36%, chin ~50%) and ABOVE the caption band
const testimonialVisualTop = (placement: 'center' | 'top-safe' = 'center') => placement === 'top-safe' ? "17%" : "56%";

export const NeonIconCard: React.FC<{ text: string; emphasis?: string; icon?: PremiumIcon; accent: string; iconsEnabled?: boolean; placement?: 'center' | 'top-safe' }> = ({
  text,
  emphasis,
  icon,
  accent,
  iconsEnabled = true,
  placement = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const recipe = useStyle();
  const g = grammar("data", frame, fps, durationInFrames);
  const s = voicePop(frame, fps, recipe.motionVoice);
  return (
    <AbsoluteFill style={{ opacity: g.opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: testimonialVisualTop(placement), transform: `translate(-50%, -50%) translateY(${interpolate(s, [0, 1], [54, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})` }}>
        <PremiumCard accent={accent}>
          <div style={{ display: "flex", alignItems: "center", gap: iconsEnabled ? 24 : 20, padding: iconsEnabled ? "28px 34px 26px 42px" : "26px 42px" }}>
            {iconsEnabled ? (
              <Icon kind={icon} accent={accent} size={104} />
            ) : (
              <div style={{ width: 6, height: 50, borderRadius: 999, background: `linear-gradient(180deg, #fff, ${accent})`, boxShadow: glow(accent, true) }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontFamily: BODY_FONT, fontSize: iconsEnabled ? 34 : 32, fontWeight: 700, color: "#EDEDE7", textTransform: "uppercase", letterSpacing: iconsEnabled ? 0 : 1.2 }}>{text}</div>
              {emphasis ? <div style={{ fontFamily: DISPLAY_FONT, fontSize: 46, fontWeight: 950, color: "#fff", textShadow: glow(accent, true), textTransform: "uppercase" }}>{emphasis}</div> : null}
            </div>
          </div>
        </PremiumCard>
      </div>
    </AbsoluteFill>
  );
};

export const NegativeSlashCard: React.FC<{ text: string; accent: string; iconsEnabled?: boolean; placement?: 'center' | 'top-safe' }> = ({ text, accent, iconsEnabled = true, placement = 'center' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const g = grammar("data", frame, fps, durationInFrames);
  const s = voicePop(frame, fps, "punch", 5);
  return (
    <AbsoluteFill style={{ opacity: g.opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: testimonialVisualTop(placement), transform: "translate(-50%, -50%)" }}>
      <PremiumCard accent={accent} w={430} h={iconsEnabled ? 280 : 180} style={{ borderRadius: 24 }}>
        <div style={{ padding: iconsEnabled ? 32 : "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: iconsEnabled ? "flex-start" : "center", gap: iconsEnabled ? 12 : 0 }}>
          {iconsEnabled && (
            <div style={{ display: "flex", gap: 50, opacity: 0.94 }}>
              <Icon kind="confidence" accent={accent} size={108} />
            </div>
          )}
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: iconsEnabled ? 34 : 38, fontWeight: 900, color: "#fff", textAlign: "center", textTransform: "uppercase" }}>{text}</div>
        </div>
        <div style={{
          position: "absolute",
          left: 36,
          top: iconsEnabled ? 206 : 130,
          width: interpolate(s, [0, 1], [0, 360]),
          height: iconsEnabled ? 12 : 10,
          borderRadius: 999,
          background: "#E5484D",
          boxShadow: "0 0 12px rgba(229,72,77,0.7)",
          transform: `rotate(${iconsEnabled ? -42 : -24}deg)`,
          transformOrigin: "left center",
        }} />
      </PremiumCard>
      </div>
    </AbsoluteFill>
  );
};

export const DualIconCards: React.FC<{ left?: string; right?: string; accent: string; accent2: string; iconsEnabled?: boolean; placement?: 'center' | 'top-safe' }> = ({
  left = "Lựa chọn A",
  right = "Lựa chọn B",
  accent,
  accent2,
  iconsEnabled = true,
  placement = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const g = grammar("data", frame, fps, durationInFrames);
  const l = voicePop(frame, fps, "confident");
  const r = voicePop(frame, fps, "confident", 6);
  const card = (label: string, icon: PremiumIcon, color: string, x: number, p: number) => (
    <div style={{ transform: `translateX(${interpolate(p, [0, 1], [x, 0])}px)`, opacity: p }}>
      <PremiumCard accent={color} w={iconsEnabled ? 390 : 380} h={iconsEnabled ? 260 : 160}>
        <div style={{ padding: iconsEnabled ? "34px 28px" : "30px 24px", display: "flex", flexDirection: iconsEnabled ? "column" : "row", alignItems: "center", justifyContent: iconsEnabled ? "flex-start" : "center", gap: iconsEnabled ? 10 : 16 }}>
          {iconsEnabled ? (
            <Icon kind={icon} accent={color} size={122} />
          ) : (
            <div style={{ width: 5, height: 44, borderRadius: 999, background: color, boxShadow: glow(color, true) }} />
          )}
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: iconsEnabled ? 36 : 34, fontWeight: 900, color: "#fff", textAlign: "center", textTransform: "uppercase" }}>{label}</div>
        </div>
      </PremiumCard>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: g.opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: testimonialVisualTop(placement), transform: "translate(-50%, -50%)", display: "flex", gap: iconsEnabled ? 34 : 24, alignItems: "center" }}>
        {card(left, "progress", accent, -120, l)}
        {card(right, "video-course", accent2, 120, r)}
      </div>
    </AbsoluteFill>
  );
};

export const DiamondLabel: React.FC<{ text: string; accent: string; placement?: 'center' | 'top-safe' }> = ({ text, accent, placement = 'center' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const g = grammar("mark", frame, fps, durationInFrames);
  const s = voicePop(frame, fps, "confident");
  return (
    <AbsoluteFill style={{ opacity: g.opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: testimonialVisualTop(placement), display: "flex", alignItems: "center", gap: 24, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.8, 1])})` }}>
        <div style={{ width: 92, height: 92, flexShrink: 0, transform: "rotate(45deg)", border: `5px solid ${accent}`, boxShadow: goldShadow(accent), background: "rgba(0,0,0,0.36)" }} />
        {/* label must stay on one line: shrink font for long text instead of
            wrapping into a vertical stack over the captions; the glass pill
            keeps it readable over any footage */}
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: text.length <= 12 ? 50 : text.length <= 20 ? 40 : 30, fontWeight: 950, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 8px 24px rgba(0,0,0,0.7)", background: "rgba(0,0,0,0.38)", padding: "10px 26px", borderRadius: 14, backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.14)" }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

export const PremiumRoadmap: React.FC<{
  title: string;
  subtitle?: string;
  steps?: string[];
  rows?: { k: string; v: string }[];
  accent: string;
}> = ({
  title,
  subtitle,
  steps = [],
  rows = [],
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = grammar("data", frame, fps, durationInFrames).opacity;
  const path = "M 230 132 C 92 220, 118 350, 270 408 C 438 472, 418 626, 220 734";
  const draw = interpolate(frame, [18, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const evolved = evolvePath(draw, path);
  const items = (steps.length ? steps : ["Bắt đầu", "Lộ trình", "Kết quả"]).slice(0, 3);
  const details = rows.slice(0, 3);
  const points = [{ x: 220, y: 720 }, { x: 360, y: 450 }, { x: 214, y: 150 }];
  return (
    <AbsoluteFill style={{ opacity: e, background: "#030405", pointerEvents: "none" }}>
      <AbsoluteFill style={{
        background:
          "radial-gradient(ellipse at 22% 30%, rgba(255,255,255,0.16), transparent 22%), radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.10), transparent 25%), linear-gradient(135deg, #050607, #101111 45%, #030303)",
        filter: "blur(0.2px)",
      }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 136 }}>
        <div style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 52,
          fontWeight: 950,
          color: "#fff",
          textTransform: "uppercase",
          padding: "18px 38px",
          borderRadius: 16,
          background: "rgba(0,0,0,0.72)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.55), 0 0 18px rgba(255,255,255,0.34)",
          position: "relative",
        }}>
          {title}
          {subtitle ? (
            <div style={{
              fontFamily: BODY_FONT,
              fontSize: 22,
              fontWeight: 800,
              color: "rgba(255,255,255,0.68)",
              letterSpacing: 0,
              marginTop: 4,
              textAlign: "center",
            }}>
              {subtitle.toUpperCase()}
            </div>
          ) : null}
          <div style={{ position: "absolute", right: -8, top: -8, width: 96, height: 5, background: "#fff", borderRadius: 999, boxShadow: "0 0 18px #fff" }} />
          <div style={{ position: "absolute", left: -8, bottom: -8, width: 96, height: 5, background: "#fff", borderRadius: 999, boxShadow: "0 0 18px #fff" }} />
        </div>
        <svg width={620} height={900} viewBox="0 0 620 900" style={{ marginTop: 32, overflow: "visible" }}>
          <path d={path} fill="none" stroke={accent} strokeWidth="13" strokeLinecap="round" strokeDasharray={evolved.strokeDasharray} strokeDashoffset={evolved.strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 12px ${accent}) drop-shadow(0 0 26px ${accent}88)` }} />
          <path d={path} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray={evolved.strokeDasharray} strokeDashoffset={evolved.strokeDashoffset} opacity={0.55} />
          {points.map((p, i) => {
            const sp = voicePop(frame, fps, "confident", 55 + i * 8);
            return (
              <g key={i} opacity={sp} transform={`translate(${p.x} ${p.y}) scale(${interpolate(sp, [0, 1], [0.4, 1])})`}>
                <rect x="-46" y="-46" width="92" height="92" transform="rotate(45)" fill="rgba(0,0,0,0.62)" stroke={accent} strokeWidth="6" filter={`drop-shadow(0 0 10px ${accent})`} />
                <text x="0" y="14" textAnchor="middle" fontFamily={DISPLAY_FONT} fontSize="38" fontWeight="900" fill="#fff">{String(i + 1).padStart(2, "0")}</text>
                <text x={i === 0 ? 86 : i === 1 ? 86 : -86} y="2" textAnchor={i === 2 ? "end" : "start"} fontFamily={DISPLAY_FONT} fontSize="29" fontWeight="900" fill="#fff">{items[i]}</text>
                {details[i]?.v ? (
                  <text x={i === 0 ? 86 : i === 1 ? 86 : -86} y="36" textAnchor={i === 2 ? "end" : "start"} fontFamily={BODY_FONT} fontSize="18" fontWeight="800" fill="rgba(255,255,255,0.62)">{details[i].v.toUpperCase()}</text>
                ) : null}
              </g>
            );
          })}
          <g opacity={voicePop(frame, fps, "confident", 86)} transform="translate(250 80)">
            <path d="M0 64 V0 M0 0 h50 l-8 16 8 16 H0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 0 h50 l-8 16 8 16 H0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
