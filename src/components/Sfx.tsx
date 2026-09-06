/**
 * SFX layer — plays a sound at each graphic's entry for that pro feel.
 * Volume raised per user feedback; CTA gets a subscribe "bell" chime; big
 * infographics get a stronger transition whoosh.
 */
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Edl } from "../edl-types";

// per-type: [sound file(s), volume]. When multiple files are given, the layer
// rotates through them across repeated hits so the same graphic type never
// plays the exact same sample twice in a row (kills the "mechanical" feel).
type SfxSpec = [string | string[], number];
const SFX_BY_TYPE: Record<string, SfxSpec> = {
  hook: [["sfx/impact.mp3", "sfx/impact-hard.mp3", "sfx/impact-soft.mp3"], 0.75],
  cta: [["sfx/bell.mp3", "sfx/ding.mp3", "sfx/bell-bright.mp3"], 0.85], // subscribe chime
  kinetic: [["sfx/whoosh.mp3", "sfx/whoosh-fast.mp3"], 0.55],
  "lower-third": [["sfx/pop.mp3", "sfx/pop-soft.mp3"], 0.45],
  "color-wipe": [["sfx/transition.mp3", "sfx/transition-soft.mp3"], 0.58],
  "kinetic-statement": [["sfx/whoosh.mp3", "sfx/swoosh-rev.mp3"], 0.6],
  "mask-reveal": [["sfx/whoosh-soft.mp3", "sfx/swoosh-rev.mp3"], 0.6],
  "glass-strip": [["sfx/pop-soft.mp3", "sfx/click.mp3"], 0.5],
  badge: [["sfx/pop.mp3", "sfx/tick.mp3"], 0.5],
  callout: [["sfx/whoosh-fast.mp3", "sfx/whoosh.mp3"], 0.6],
  "highlight-reveal": [["sfx/sparkle.mp3", "sfx/whoosh-soft.mp3"], 0.55],
  "number-counter": [["sfx/tick.mp3", "sfx/pop-soft.mp3"], 0.55],
  "donut-stat": [["sfx/pop.mp3", "sfx/ding.mp3"], 0.55],
  "bar-stat": [["sfx/whoosh-soft.mp3", "sfx/riser.mp3"], 0.6],
  "progress-bar": [["sfx/tick.mp3", "sfx/riser.mp3"], 0.5],
  "glass-card": [["sfx/whoosh-soft.mp3", "sfx/sparkle.mp3"], 0.6],
  // big infographics → stronger scene-transition whoosh
  "step-flow": [["sfx/transition.mp3", "sfx/transition-punch.mp3"], 0.7],
  "comparison": [["sfx/transition-punch.mp3", "sfx/transition.mp3"], 0.7],
  "list-reveal": [["sfx/transition-soft.mp3", "sfx/noise-riser.mp3"], 0.65],
  "lower-third-pro": [["sfx/pop-soft.mp3", "sfx/click.mp3"], 0.5],
  "info-table": [["sfx/transition-soft.mp3", "sfx/transition.mp3"], 0.66],
  "stat-compare": [["sfx/transition.mp3", "sfx/transition-punch.mp3"], 0.66],
  "illus-mark": [["sfx/whoosh.mp3", "sfx/sparkle.mp3"], 0.55],
  "path-mark": [["sfx/whoosh-soft.mp3", "sfx/swoosh-rev.mp3"], 0.5],
  "shape-3d": [["sfx/whoosh.mp3", "sfx/boom.mp3"], 0.56],
  "premium-roadmap": [["sfx/transition-punch.mp3", "sfx/sub-drop.mp3"], 0.75],
  "neon-icon-card": [["sfx/pop.mp3", "sfx/sparkle.mp3"], 0.58],
  "negative-slash-card": [["sfx/impact-hard.mp3", "sfx/impact.mp3"], 0.62],
  "dual-icon-cards": [["sfx/transition.mp3", "sfx/transition-punch.mp3"], 0.68],
  "diamond-label": [["sfx/pop-soft.mp3", "sfx/ding.mp3"], 0.48],
  "ad-comparison-scene": [["sfx/transition-punch.mp3", "sfx/boom.mp3"], 0.62],
  "fullscreen-keyword": [["sfx/impact-soft.mp3", "sfx/whoosh-fast.mp3"], 0.72],
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
    g: { type: t.type, startMs: t.startMs },
    w: SFX_WEIGHT[t.type] ?? 0,
  }));
  const candidates = [
    ...graphics.map((g) => ({ g, w: SFX_WEIGHT[g.type] ?? 0 })),
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
        return (
          <Sequence key={`sfx-${i}`} from={from} durationInFrames={Math.round(fps * 1.2)}>
            <Audio src={staticFile(src)} volume={vol} />
          </Sequence>
        );
      })}
    </>
  );
};
