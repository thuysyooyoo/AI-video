/**
 * Keyword → vector icon (Lucide) visualizer. NOT AI-generated images — clean SVG
 * icons that illustrate a concept the speaker mentions (time→clock, money→dollar,
 * growth→trending-up). This is how pro editors "visualize keywords" without footage.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Clock, DollarSign, TrendingUp, Target, Lightbulb, Heart, Star,
  Zap, CheckCircle2, AlertTriangle, Rocket, Brain, Users, Gift,
  ThumbsUp, Flame, Award, Sparkles, type LucideIcon,
} from "lucide-react";
import { enterExit, popSpring, floatY, glow } from "../anim";
import { topBandStyle } from "../layout";

// Vietnamese/English keyword -> icon. Matched by substring (lowercased).
const ICON_MAP: { keys: string[]; icon: LucideIcon }[] = [
  { keys: ["thời gian", "giờ", "phút", "time", "nhanh"], icon: Clock },
  { keys: ["tiền", "giá", "chi phí", "money", "đầu tư", "hoàn tiền"], icon: DollarSign },
  { keys: ["tăng", "phát triển", "grow", "lên", "hiệu quả", "kết quả"], icon: TrendingUp },
  { keys: ["mục tiêu", "đích", "target", "goal"], icon: Target },
  { keys: ["ý tưởng", "bí quyết", "mẹo", "idea", "cách"], icon: Lightbulb },
  { keys: ["yêu", "thích", "tình", "love"], icon: Heart },
  { keys: ["tốt nhất", "chất lượng", "star", "best"], icon: Star },
  { keys: ["nhanh chóng", "tức thì", "ngay", "power", "mạnh"], icon: Zap },
  { keys: ["đúng", "chuẩn", "xong", "hoàn thành", "ok"], icon: CheckCircle2 },
  { keys: ["sai", "lỗi", "cảnh báo", "đừng", "tránh", "vấn đề"], icon: AlertTriangle },
  { keys: ["bắt đầu", "khởi", "launch", "bứt phá"], icon: Rocket },
  { keys: ["học", "kiến thức", "tư duy", "hiểu", "thông minh"], icon: Brain },
  { keys: ["người", "khách", "cộng đồng", "team", "bạn"], icon: Users },
  { keys: ["miễn phí", "quà", "tặng", "free", "gift"], icon: Gift },
  { keys: ["thu hút", "hấp dẫn", "đẹp", "ấn tượng"], icon: Sparkles },
  { keys: ["uy tín", "chứng nhận", "thành công", "giải"], icon: Award },
  { keys: ["hot", "trend", "viral", "bùng nổ"], icon: Flame },
  { keys: ["đồng ý", "tốt", "like", "ủng hộ"], icon: ThumbsUp },
];

export const pickIcon = (text: string): LucideIcon => {
  const t = text.toLowerCase();
  for (const { keys, icon } of ICON_MAP) {
    if (keys.some((k) => t.includes(k))) return icon;
  }
  return Sparkles; // default
};

/** Big icon + label that pops in the top band to illustrate a keyword. */
export const IconPop: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = enterExit(frame, fps, durationInFrames);
  const s = popSpring(frame, fps);
  const Icon = pickIcon(text);
  return (
    <AbsoluteFill style={{ ...topBandStyle(10), opacity: e }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          transform: `scale(${interpolate(s, [0, 1], [0.4, 1])}) translateY(${floatY(frame)}px)`,
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 40,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: glow(accent, true),
          }}
        >
          <Icon size={110} color="#fff" strokeWidth={2.4} />
        </div>
        {text ? (
          <div style={{ color: "#fff", fontSize: 46, fontWeight: 800, textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>
            {text}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Compact chip: icon + text side by side — replaces plain text boxes. */
export const IconChip: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = enterExit(frame, fps, durationInFrames);
  const s = popSpring(frame, fps);
  const Icon = pickIcon(text);
  return (
    <AbsoluteFill style={{ ...topBandStyle(30), opacity: e }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: "#fff",
          borderRadius: 999,
          padding: "16px 32px 16px 20px",
          transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) translateY(${floatY(frame, 5)}px)`,
          boxShadow: glow(accent, true),
          maxWidth: 860,
        }}
      >
        <div
          style={{
            minWidth: 72,
            height: 72,
            borderRadius: 999,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={42} color="#fff" strokeWidth={2.6} />
        </div>
        <span style={{ color: "#141414", fontSize: 46, fontWeight: 800 }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
