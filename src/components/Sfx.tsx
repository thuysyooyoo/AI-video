/**
 * SFX layer — plays a sound at each graphic's entry for that pro feel.
 * Volume raised per user feedback; CTA gets a subscribe "bell" chime; big
 * infographics get a stronger transition whoosh.
 */
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Edl } from "../edl-types";
import { CAPCUT_TRANSITIONS_REGISTRY } from "./capcut-transitions-registry";

// per-type: [sound file(s), volume]. When multiple files are given, the layer
// rotates through them across repeated hits so the same graphic type never
// plays the exact same sample twice in a row (kills the "mechanical" feel).
type SfxSpec = [string | string[], number];
const SFX_BY_TYPE: Record<string, SfxSpec> = {
  hook: [["sfx/cinematic-hit.mp3", "sfx/cinematic-boom.mp3", "sfx/transition-deep-woosh.mp3"], 0.75],
  cta: [["sfx/game-level-complete.mp3", "sfx/game-level-up.mp3", "sfx/tech-notification.mp3"], 0.85],
  kinetic: [["sfx/transition-woosh-1.mp3", "sfx/transition-woosh-2.mp3", "sfx/foley-brushing.mp3"], 0.55],
  "lower-third": [["sfx/cartoon-pop.mp3", "sfx/cartoon-blinking.mp3", "sfx/tech-toggle.mp3"], 0.45],
  "color-wipe": [["sfx/transition-woosh-1.mp3", "sfx/film-burn.mp3", "sfx/reverse-playback.mp3"], 0.58],
  "kinetic-statement": [["sfx/transition-woosh-1.mp3", "sfx/reverse-playback.mp3"], 0.6],
  "mask-reveal": [["sfx/transition-deep-woosh.mp3", "sfx/remembering-woosh.mp3"], 0.6],
  "glass-strip": [["sfx/cartoon-blinking.mp3", "sfx/tech-mouse-click.mp3"], 0.5],
  badge: [["sfx/game-coin-collect.mp3", "sfx/cartoon-pop.mp3", "sfx/tech-notification.mp3"], 0.5],
  callout: [["sfx/transition-woosh-2.mp3", "sfx/cartoon-slide-whistle.mp3"], 0.6],
  "highlight-reveal": [["sfx/foley-brushing.mp3", "sfx/tech-notification.mp3"], 0.55],
  "number-counter": [["sfx/tech-toggle.mp3", "sfx/tech-mouse-click.mp3", "sfx/cartoon-blinking.mp3"], 0.55],
  "donut-stat": [["sfx/game-coin-collect.mp3", "sfx/tech-notification.mp3"], 0.55],
  "bar-stat": [["sfx/transition-deep-woosh.mp3", "sfx/cinematic-metallic-rise.mp3"], 0.6],
  "progress-bar": [["sfx/tech-digital-loading.mp3", "sfx/tech-toggle.mp3"], 0.5],
  "glass-card": [["sfx/transition-deep-woosh.mp3", "sfx/remembering-woosh.mp3"], 0.6],
  // big infographics
  "step-flow": [["sfx/transition-deep-woosh.mp3", "sfx/foley-deck-brushing.mp3"], 0.7],
  "comparison": [["sfx/cinematic-hit.mp3", "sfx/transition-deep-woosh.mp3"], 0.7],
  "list-reveal": [["sfx/transition-woosh-1.mp3", "sfx/tech-toggle.mp3", "sfx/foley-brushing.mp3"], 0.65],
  "lower-third-pro": [["sfx/cartoon-blinking.mp3", "sfx/tech-mouse-click.mp3"], 0.5],
  "info-table": [["sfx/transition-woosh-1.mp3", "sfx/transition-deep-woosh.mp3"], 0.66],
  "stat-compare": [["sfx/cinematic-hit.mp3", "sfx/game-coin-collect.mp3"], 0.66],
  "illus-mark": [["sfx/transition-woosh-2.mp3", "sfx/game-power-up.mp3"], 0.55],
  "path-mark": [["sfx/transition-deep-woosh.mp3", "sfx/reverse-playback.mp3"], 0.5],
  "shape-3d": [["sfx/transition-woosh-1.mp3", "sfx/cinematic-boom.mp3"], 0.56],
  "premium-roadmap": [["sfx/cinematic-hit.mp3", "sfx/cinematic-boom.mp3"], 0.75],
  "neon-icon-card": [["sfx/cartoon-pop.mp3", "sfx/game-power-up.mp3"], 0.58],
  "negative-slash-card": [["sfx/cinematic-hit.mp3", "sfx/cartoon-punch.mp3"], 0.62],
  "dual-icon-cards": [["sfx/transition-woosh-1.mp3", "sfx/transition-deep-woosh.mp3"], 0.68],
  "diamond-label": [["sfx/cartoon-blinking.mp3", "sfx/tech-notification.mp3"], 0.48],
  "ad-comparison-scene": [["sfx/cinematic-hit.mp3", "sfx/cinematic-boom.mp3"], 0.62],
  "fullscreen-keyword": [["sfx/cinematic-hit.mp3", "sfx/cinematic-boom.mp3", "sfx/transition-deep-woosh.mp3"], 0.72],
  // Semantic categories from Sound Design Knowledge Base:
  typing: [["sfx/tech-keyboard-typing.mp3", "sfx/typing-1.mp3"], 0.62],
  keyboard: [["sfx/tech-keyboard-typing.mp3", "sfx/tech-mouse-click.mp3"], 0.6],
  mouse: [["sfx/tech-mouse-click.mp3", "sfx/tech-toggle.mp3"], 0.52],
  tech: [["sfx/tech-notification.mp3", "sfx/tech-digital-loading.mp3", "sfx/tech-toggle.mp3"], 0.6],
  hologram: [["sfx/tech-digital-loading.mp3", "sfx/tech-glitch.mp3"], 0.6],
  error: [["sfx/cartoon-womp-womp.mp3", "sfx/game-health-low.mp3"], 0.68],
  highlight: [["sfx/foley-brushing.mp3", "sfx/tech-notification.mp3"], 0.58],
  correct: [["sfx/game-level-up.mp3", "sfx/game-power-up.mp3"], 0.72],
  cartoon: [["sfx/cartoon-boing.mp3", "sfx/cartoon-pop.mp3", "sfx/cartoon-punch.mp3", "sfx/cartoon-slide-whistle.mp3"], 0.65],
  swish: [["sfx/transition-woosh-1.mp3", "sfx/transition-woosh-2.mp3"], 0.6],
  magic: [["sfx/game-power-up.mp3", "sfx/game-level-up.mp3", "sfx/remembering-woosh.mp3"], 0.65],
  camera: [["sfx/camera-shutter.mp3"], 0.62],
  paper: [["sfx/foley-deck-brushing.mp3", "sfx/foley-sponge.mp3"], 0.55],
  // 5 Transition Families:
  flash: [["sfx/camera-shutter.mp3", "sfx/transition-woosh-2.mp3"], 0.65],
  "color-flash": [["sfx/camera-shutter.mp3", "sfx/game-power-up.mp3"], 0.65],
  "light-leak": [["sfx/film-burn.mp3", "sfx/remembering-woosh.mp3"], 0.6],
  "quick-cut": [["sfx/transition-woosh-2.mp3", "sfx/cartoon-pop.mp3"], 0.6],
  "glitch-cut": [["sfx/tech-glitch.mp3", "sfx/game-pixel-explosion.mp3"], 0.65],
  "swipe-right": [["sfx/transition-woosh-1.mp3", "sfx/transition-woosh-2.mp3", "sfx/foley-brushing.mp3"], 0.6],
  "swipe-up": [["sfx/transition-woosh-2.mp3", "sfx/reverse-playback.mp3"], 0.6],
  "zoom-blur": [["sfx/transition-deep-woosh.mp3", "sfx/cinematic-boom.mp3"], 0.65],
  "whip-pan": [["sfx/transition-woosh-2.mp3", "sfx/transition-deep-woosh.mp3"], 0.68],
  "mask-circle": [["sfx/remembering-woosh.mp3", "sfx/game-power-up.mp3"], 0.62],
  "blend-fade": [["sfx/remembering-woosh.mp3", "sfx/cinematic-metallic-rise.mp3"], 0.55],
  // Anh-sac style visuals & transitions
  "grid-flat-card": [["sfx/cinematic-hit.mp3", "sfx/transition-woosh-2.mp3"], 0.72],
  "number-badge": [["sfx/game-coin-collect.mp3", "sfx/tech-notification.mp3"], 0.7],
  "debris-shatter": [["sfx/game-pixel-explosion.mp3", "sfx/cinematic-hit.mp3"], 0.7],
  "kinetic-pop": [["sfx/cartoon-pop.mp3", "sfx/cinematic-hit.mp3"], 0.65],
  "staggered-lines": [["sfx/transition-woosh-1.mp3", "sfx/foley-brushing.mp3"], 0.6],
  // CapCut 9 Transition Suite — Fixed 1:1 Hardcoded SFX Pairing:
  "glare-ii": [["sfx/glare-burn.mp3"], 0.9],
  "phone-reveal": [["sfx/phone-shutter-1.mp3"], 0.95],
  "paper-ball": [["sfx/paper-ball-yt.mp3"], 0.95],
  glitch: [["sfx/glitch-cut.mp3"], 0.85],
  "fade-down": [["sfx/fade-woosh.mp3"], 0.9],
  blink: [["sfx/click.mp3"], 0.95],
  "wave-right": [["sfx/wave-sparkle.mp3"], 0.9],
  "swipe-left": [["sfx/whoosh-fast.mp3"], 0.95],
  "comic-cut": [["sfx/comic-paper-tear.mp3"], 0.95],
};

/** Pick a variant for the n-th hit of a type; rotates so repeats differ. */
const pickVariant = (spec: SfxSpec, hitIndex: number): [string, number] => {
  const [files, vol] = spec;
  if (Array.isArray(files)) return [files[hitIndex % files.length], vol];
  return [files, vol];
};

// priority weight per type — higher = more important to keep when budgeting SFX
const SFX_WEIGHT: Record<string, number> = {
  hook: 10, cta: 10, "color-wipe": 9, "step-flow": 8, comparison: 8, "info-table": 8, "stat-compare": 8,
  "list-reveal": 7, "kinetic-statement": 6, "mask-reveal": 6, "shape-3d": 6,
  kinetic: 5, "lower-third": 4, callout: 4, "number-counter": 4, "donut-stat": 4, "bar-stat": 4, "progress-bar": 4,
  badge: 2, "glass-strip": 2, "highlight-reveal": 2, "path-mark": 1, "illus-mark": 3,
  "premium-roadmap": 9, "neon-icon-card": 6, "negative-slash-card": 7,
  "dual-icon-cards": 8, "diamond-label": 3,
  "ad-comparison-scene": 8,
  "fullscreen-keyword": 8,
  typing: 5, keyboard: 5, mouse: 4, tech: 6, hologram: 6, error: 8,
  highlight: 5, correct: 8, cartoon: 5, swish: 5, magic: 6, camera: 6, paper: 5,
  // transitions
  flash: 8, "color-flash": 8, "light-leak": 7,
  "quick-cut": 7, "glitch-cut": 8,
  "swipe-right": 7, "swipe-up": 7,
  "zoom-blur": 8, "whip-pan": 8,
  "mask-circle": 7, "blend-fade": 6,
  // CapCut transitions
  "glare-ii": 9, "phone-reveal": 9, "paper-ball": 9, glitch: 9, "fade-down": 9, blink: 9, "wave-right": 9, "swipe-left": 9, "comic-cut": 9,
  // anh-sac
  "grid-flat-card": 9, "number-badge": 8, "debris-shatter": 8, "kinetic-pop": 7, "staggered-lines": 6,
};
const MIN_GAP_MS = 1200; // refined spacing allowing responsive cues
const PRE_ROLL_MS = 65;  // sound lands ~65ms BEFORE the visual ("impact" feel)

const SFX_FILE_BY_CUE: Record<Edl["tracks"]["sfx"][number]["sound"], string> = {
  // legacy
  impact: "sfx/impact.mp3",
  bell: "sfx/bell.mp3",
  whoosh: "sfx/whoosh.mp3",
  pop: "sfx/pop.mp3",
  transition: "sfx/transition.mp3",
  // impact family
  "impact-soft": "sfx/impact-soft.mp3",
  "impact-hard": "sfx/impact-hard.mp3",
  "sub-drop": "sfx/sub-drop.mp3",
  boom: "sfx/boom.mp3",
  // whoosh family
  "whoosh-fast": "sfx/whoosh-fast.mp3",
  "whoosh-soft": "sfx/whoosh-soft.mp3",
  "swoosh-rev": "sfx/swoosh-rev.mp3",
  // riser
  riser: "sfx/riser.mp3",
  "noise-riser": "sfx/noise-riser.mp3",
  // ui / pop
  "pop-soft": "sfx/pop-soft.mp3",
  tick: "sfx/tick.mp3",
  click: "sfx/click.mp3",
  // ding / bell / sparkle
  ding: "sfx/ding.mp3",
  "bell-bright": "sfx/bell-bright.mp3",
  sparkle: "sfx/sparkle.mp3",
  // transition
  "transition-soft": "sfx/transition-soft.mp3",
  "transition-punch": "sfx/transition-punch.mp3",
  // 1. Xuất hiện
  swish: "sfx/swish.mp3",
  "magic-reveal": "sfx/magic-reveal.mp3",
  "cartoon-effect": "sfx/cartoon-effect.mp3",
  // 2. Chuột & Bàn phím
  "keyboard-click": "sfx/keyboard-click.mp3",
  "typing-1": "sfx/typing-1.mp3",
  "typing-2": "sfx/typing-2.mp3",
  "mouse-click": "sfx/mouse-click.mp3",
  // 3. Công nghệ
  pip: "sfx/pip.mp3",
  hologram: "sfx/hologram.mp3",
  error: "sfx/error.mp3",
  glitch: "sfx/glitch.mp3",
  // 4. Nhấn mạnh
  highlight: "sfx/highlight.mp3",
  hit: "sfx/impact-hard.mp3",
  correct: "sfx/correct.mp3",
  // 5. Chuyển cảnh & Foley
  "camera-shutter": "sfx/camera-shutter.mp3",
  "paper-slide": "sfx/paper-slide.mp3",
  // 34 mẫu chuẩn hóa từ video Anh Sắc:
  // 1. Công nghệ
  "tech-notification": "sfx/tech-notification.mp3",
  "tech-mouse-click": "sfx/tech-mouse-click.mp3",
  "tech-keyboard-typing": "sfx/tech-keyboard-typing.mp3",
  "tech-toggle": "sfx/tech-toggle.mp3",
  "tech-glitch": "sfx/tech-glitch.mp3",
  "tech-digital-loading": "sfx/tech-digital-loading.mp3",
  // 2. Chuyển cảnh
  "transition-woosh-1": "sfx/transition-woosh-1.mp3",
  "transition-woosh-2": "sfx/transition-woosh-2.mp3",
  "transition-deep-woosh": "sfx/transition-deep-woosh.mp3",
  "film-burn": "sfx/film-burn.mp3",
  "reverse-playback": "sfx/reverse-playback.mp3",
  // 3. Cinematic
  "cinematic-metallic-rise": "sfx/cinematic-metallic-rise.mp3",
  "cinematic-boom": "sfx/cinematic-boom.mp3",
  "cinematic-hit": "sfx/cinematic-hit.mp3",
  "remembering-woosh": "sfx/remembering-woosh.mp3",
  // 4. Hành động (Foley)
  "foley-brushing": "sfx/foley-brushing.mp3",
  "foley-deck-brushing": "sfx/foley-deck-brushing.mp3",
  "foley-sponge": "sfx/foley-sponge.mp3",
  "foley-boiling-dishes": "sfx/foley-boiling-dishes.mp3",
  "foley-stir-ice-glass": "sfx/foley-stir-ice-glass.mp3",
  // 5. Hoạt hình / Retro
  "cartoon-pop": "sfx/cartoon-pop.mp3",
  "cartoon-running": "sfx/cartoon-running.mp3",
  "cartoon-punch": "sfx/cartoon-punch.mp3",
  "cartoon-womp-womp": "sfx/cartoon-womp-womp.mp3",
  "cartoon-blinking": "sfx/cartoon-blinking.mp3",
  "cartoon-slide-whistle": "sfx/cartoon-slide-whistle.mp3",
  "cartoon-boing": "sfx/cartoon-boing.mp3",
  // 6. Game
  "game-coin-collect": "sfx/game-coin-collect.mp3",
  "game-power-up": "sfx/game-power-up.mp3",
  "game-level-up": "sfx/game-level-up.mp3",
  "game-health-low": "sfx/game-health-low.mp3",
  "game-pixel-explosion": "sfx/game-pixel-explosion.mp3",
  "game-level-complete": "sfx/game-level-complete.mp3",
  // 11 mẫu bổ sung từ video Kobe Media (giây 45 trở đi):
  "kobe-woosh": "sfx/kobe-woosh.mp3",
  "comic-vocal-uh": "sfx/comic-vocal-uh.mp3",
  "chime-ding": "sfx/chime-ding.mp3",
  "cinematic-suspense": "sfx/cinematic-suspense.mp3",
  "among-us-reveal": "sfx/among-us-reveal.mp3",
  "cartoon-duck-quack": "sfx/cartoon-duck-quack.mp3",
  "slide-whistle-up": "sfx/slide-whistle-up.mp3",
  "game-correct": "sfx/game-correct.mp3",
  "game-wrong-buzzer": "sfx/game-wrong-buzzer.mp3",
  "cartoon-thump-boing": "sfx/cartoon-thump-boing.mp3",
  "comic-vocal-yeet": "sfx/comic-vocal-yeet.mp3",
  // Aliases
  wrong: "sfx/game-wrong-buzzer.mp3",
  buzzer: "sfx/game-wrong-buzzer.mp3",
  suspense: "sfx/cinematic-suspense.mp3",
  yeet: "sfx/comic-vocal-yeet.mp3",
  // 7. CapCut Suite SFX chuyên biệt (Fixed Pairing)
  "phone-shutter-1": "sfx/phone-shutter-1.mp3",
  "paper-ball-yt": "sfx/paper-ball-yt.mp3",
  "comic-paper-tear": "sfx/comic-paper-tear.mp3",
  "wave-sparkle": "sfx/wave-sparkle.mp3",
  "glare-burn": "sfx/glare-burn.mp3",
  "glitch-cut": "sfx/glitch-cut.mp3",
  "fade-woosh": "sfx/fade-woosh.mp3",
};

export const SfxLayer: React.FC<{
  graphics: Edl["tracks"]["graphics"];
  transitions?: Edl["tracks"]["transitions"];
  cues?: Edl["tracks"]["sfx"];
}> = ({ graphics, transitions = [], cues = [] }) => {
  const { fps } = useVideoConfig();
  if (cues.length > 0) {
    return (
      <>
        {[...cues]
          .sort((a, b) => b.priority - a.priority)
          .reduce<typeof cues>((kept, cue) => {
            if (kept.every((k) => Math.abs(k.startMs - cue.startMs) >= MIN_GAP_MS)) {
              kept.push(cue);
            }
            return kept;
          }, [])
          .map((cue, i) => {
            const from = Math.max(0, Math.round(((cue.startMs - cue.preRollMs) / 1000) * fps));
            return (
              <Sequence key={`sfx-cue-${i}`} from={from} durationInFrames={Math.round(fps * 1.2)}>
                <Audio src={staticFile(SFX_FILE_BY_CUE[cue.sound])} volume={cue.volume} />
              </Sequence>
            );
          })}
      </>
    );
  }

  // budget: greedily keep the highest-weight SFX, enforce MIN_GAP between hits
  const transitionCandidates = transitions.map((t) => ({
    g: { type: t.type, startMs: t.startMs, endMs: t.endMs },
    w: SFX_WEIGHT[t.type] ?? 0,
  }));
  const candidates = [
    ...graphics.map((g) => ({ g: { type: g.type, startMs: g.startMs, endMs: undefined as number | undefined }, w: SFX_WEIGHT[g.type] ?? 0 })),
    ...transitionCandidates,
  ].filter((c) => c.w > 0 && SFX_BY_TYPE[c.g.type]);
  const chosen: typeof candidates = [];
  // sort by importance, then place if it doesn't crowd an already-chosen one
  for (const c of [...candidates].sort((a, b) => b.w - a.w)) {
    if (chosen.every((k) => Math.abs(k.g.startMs - c.g.startMs) >= MIN_GAP_MS)) {
      chosen.push(c);
    }
  }
  // per-type hit counter so repeated hits of the same type rotate variants
  const hitCount: Record<string, number> = {};
  // play in time order for stable, deterministic variant rotation
  const ordered = [...chosen].sort((a, b) => a.g.startMs - b.g.startMs);
  return (
    <>
      {ordered.map((c, i) => {
        const n = hitCount[c.g.type] ?? 0;
        hitCount[c.g.type] = n + 1;
        const [src, vol] = pickVariant(SFX_BY_TYPE[c.g.type], n);
        const from = Math.max(0, Math.round(((c.g.startMs - PRE_ROLL_MS) / 1000) * fps));
        // Anti-Bleed Hard Cutoff: Stop sound immediately when transition finishes
        const capcutDef = CAPCUT_TRANSITIONS_REGISTRY[c.g.type];
        const durationInFrames = capcutDef
          ? Math.round(capcutDef.durationSec * fps)
          : c.g.endMs
          ? Math.max(1, Math.round(((c.g.endMs - c.g.startMs) / 1000) * fps))
          : Math.round(fps * 1.2);
        return (
          <Sequence key={`sfx-${i}`} from={from} durationInFrames={durationInFrames}>
            <Audio src={staticFile(src)} volume={vol} />
          </Sequence>
        );
      })}
    </>
  );
};
