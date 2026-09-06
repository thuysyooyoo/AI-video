/**
 * Shared animation helpers — gives graphics a polished enter+exit feel.
 * Pro reels never hard-cut a graphic on/off: things spring in, hold, then ease out.
 */
import { interpolate, spring, Easing } from "remotion";

/**
 * Enter (spring overshoot) + exit (ease-out) envelope over a sequence's lifetime.
 * Returns 0..1..0 progress for opacity/scale. Pass the sequence's local frame +
 * its total durationInFrames.
 */
export const enterExit = (
  frame: number,
  fps: number,
  durationInFrames: number,
  exitFrames = 10,
) => {
  const enter = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const exitStart = durationInFrames - exitFrames;
  const exit = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(enter, exit);
};

/** Spring with a slight overshoot for punchy pop-ins. */
export const popSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 10, mass: 0.5, stiffness: 140 } });

/** Soft floating idle motion. period = seconds (pass fps). fps-independent. */
export const floatY = (frame: number, amplitude = 6, periodFrames = 90) =>
  Math.sin((frame / periodFrames) * Math.PI * 2) * amplitude;

/**
 * Animation GRAMMAR — different entrance/exit per content kind so graphics don't
 * all "float in the same way" (toy-like). Returns {opacity, transform-ready
 * progress}. Use `kind`:
 *  - "data"  : data/numbers/tables → firm slide-in, NO idle, slide-out (trustworthy)
 *  - "type"  : big typography/hook → spring overshoot in, scale-down out
 *  - "mark"  : path/illus → handled by draw-on (use enterExit for opacity only)
 *  - "ambient": floats (only this kind idles)
 */
export const grammar = (
  kind: "data" | "type" | "mark" | "ambient",
  frame: number,
  fps: number,
  durationInFrames: number,
) => {
  const exitN = Math.min(12, durationInFrames * 0.18);
  const exitStart = durationInFrames - exitN;
  const eIn = spring({ frame, fps, config: kind === "data"
    ? { damping: 200, mass: 0.4 }        // firm, no overshoot
    : { damping: 10, mass: 0.5, stiffness: 140 } }); // springy
  // exit: data slides out, type scales down, others fade
  const exitP = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const inX = kind === "data" ? interpolate(eIn, [0, 1], [60, 0]) : 0;
  const outX = kind === "data" ? interpolate(exitP, [0, 1], [-40, 0]) : 0;
  const scale = kind === "type"
    ? interpolate(eIn, [0, 1], [0.8, 1]) * interpolate(exitP, [0, 1], [0.92, 1])
    : 1;
  return {
    opacity: Math.min(eIn, exitP),
    slideX: inX + outX,
    scale,
    idle: kind === "ambient",
  };
};

/** Drop-shadow + colored glow string for a given accent. */
export const glow = (accent: string, strong = false) =>
  strong
    ? `0 14px 44px rgba(0,0,0,0.45), 0 0 26px ${accent}88`
    : `0 10px 30px rgba(0,0,0,0.35), 0 0 16px ${accent}55`;

// ---- MOTION VOICE (P4b) — recipe.motionVoice tunes the spring feel per theme ----
// noir="confident" (firm, minimal overshoot), bloom="reveal" (soft, gentle bounce).
// Components pass recipe.motionVoice so the SAME graphic moves differently per template.
type SpringConfig = { damping: number; mass: number; stiffness?: number };
const VOICE: Record<string, SpringConfig> = {
  energetic: { damping: 10, mass: 0.5, stiffness: 140 }, // v7 default (punchy)
  confident: { damping: 18, mass: 0.6, stiffness: 120 }, // firm, little overshoot (noir)
  reveal: { damping: 12, mass: 0.5, stiffness: 110 },     // soft, gentle settle (bloom)
  handcraft: { damping: 14, mass: 0.7, stiffness: 130 },  // organic
  punch: { damping: 8, mass: 0.4, stiffness: 170 },       // hard snap
};

/** Spring params for a motion voice (falls back to v7 energetic). */
export const voiceConfig = (voice?: string): SpringConfig =>
  VOICE[voice ?? "energetic"] ?? VOICE.energetic;

/** A voice-tuned pop spring — drop-in replacement for popSpring when recipe is available. */
export const voicePop = (frame: number, fps: number, voice?: string, delay = 0) =>
  spring({ frame: frame - delay, fps, config: voiceConfig(voice) });

/**
 * Entry transform by recipe.entryAnimFamily — the family decides HOW a graphic arrives.
 * Returns {transform, opacity} to spread onto the element. Keeps v7 "spring" as default.
 *   spring → scale pop (v7)   slide → slide up   fade → opacity only   mask → scaleY wipe
 */
export const entryByFamily = (
  family: string | undefined,
  frame: number,
  fps: number,
  voice?: string,
) => {
  const s = spring({ frame, fps, config: voiceConfig(voice) });
  switch (family) {
    case "slide":
      return { transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`, opacity: s };
    case "fade":
      return { transform: "none", opacity: s };
    case "mask":
      return { transform: `scaleY(${interpolate(s, [0, 1], [0.1, 1])})`, opacity: s, transformOrigin: "center" };
    case "spring":
    default:
      return { transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`, opacity: s };
  }
};
