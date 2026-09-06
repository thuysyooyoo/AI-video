/**
 * Reel composition — maps an EDL onto a 9:16 render.
 * Layers (bottom -> top):
 *   0. raw talking-head video (with zoom effects applied)
 *   1. captions (TikTok-style, active-word highlight)
 *   2. graphics (hook / cta / kinetic / lower-third)
 * B-roll track is optional (Phase 07) — overlaid when src present.
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Edl, Effect } from "./edl-types";
import { Captions } from "./components/Captions";
import { GraphicLayer } from "./components/Graphics";
import { ReadabilityScrim, TransitionLayer } from "./components/Transitions";
import { AmbientSparkles } from "./components/Elements";
import { SfxLayer } from "./components/Sfx";
import { BODY_FONT, DISPLAY_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from "./fonts";
import { LayoutContext } from "./layout";
import { StyleContext, resolveStyle } from "./style-context";
import { getPreset } from "./presets";

const msToFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const Reel: React.FC<{ edl: Edl }> = ({ edl }) => {
  const { fps } = useVideoConfig();
  const { tracks, style, source } = edl;
  // recipe is the single source for color + material (R2-FIX1); no getTheme at render
  const recipe = resolveStyle(style);
  // Preset config drives branching: cards, scrim, placement, mutual exclusivity
  const presetConfig = getPreset(recipe.preset);
  return (
    <StyleContext.Provider value={recipe}>
    <LayoutContext.Provider value={{ faceCenterYPct: style.faceCenterYPct, freeZone: style.freeZone }}>
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: BODY_FONT }}>
      {/* Layer 0: raw clip + zoom (base crop pushes burned-in captions out of frame) */}
      <ZoomedVideo
        clip={source.clip}
        effects={tracks.effects}
        baseScale={style.baseScale}
        baseShiftYPct={style.baseShiftYPct}
        volume={edl.music ? edl.music.clipVolume : source.volume}
      />

      {/* Background music (workflow B): loops when shorter than the video,
          is cut at video end when longer — with a fade-out so the ending
          never stops mid-note; startSec skips the track's intro */}
      {edl.music ? (
        <MusicTrack music={edl.music} durationSec={source.durationSec} />
      ) : null}

      {/* Optional b-roll overlays (Phase 07) */}
      {tracks.broll
        .filter((b) => b.src)
        .map((b, i) => {
          const from = msToFrames(b.startMs, fps);
          const dur = msToFrames(b.endMs - b.startMs, fps);
          return (
            <Sequence key={`broll-${i}`} from={from} durationInFrames={dur}>
              <OffthreadVideo src={staticFile(b.src!)} />
            </Sequence>
          );
        })}

      {/* Mask burned-in original caption with a blurred band, if configured */}
      {style.maskBandHeightPct > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${style.maskBandTopPct}%`,
            height: `${style.maskBandHeightPct}%`,
            backdropFilter: "blur(28px) brightness(0.7)",
            WebkitBackdropFilter: "blur(28px) brightness(0.7)",
          }}
        />
      ) : null}

      {/* Ambient: scrim + decorative vector elements (sparkles / orbit ring) */}
      <ReadabilityScrim mode={presetConfig.scrimMode} />
      {(style.ambient === "sparkles" || style.ambient === "both") && (
        <AmbientSparkles accent={recipe.accent} accent2={recipe.accent2} />
      )}
      {/* OrbitRing removed by owner decision: a ring rotating over the speaker
          for the whole video is decorative noise. "ring"/"both" now render nothing
          extra (schema kept for legacy EDLs). */}

      {/* Layer 1: captions (Hormozi style) — color from recipe (R2-FIX1) */}
      {style.titleHook ? (
        <PersistentTitleHook text={style.titleHook} accent={recipe.accent} accent2={recipe.accent2} textFx={recipe.textFx} />
      ) : null}

      <Captions
        captions={tracks.captions}
        color={recipe.captionColor}
        highlight={recipe.highlightColor}
        accent={recipe.accent}
        preset={recipe.preset ?? "thuy-style-oneshot"}
        activeGraphicIntervals={presetConfig.captionMutualExclusion ? [
          ...tracks.graphics
            .filter((g) => g.type !== "hook" && g.type !== "cta")
            .map((g) => ({ startMs: g.startMs, endMs: g.endMs })),
          ...tracks.broll.map((b) => ({ startMs: b.startMs, endMs: b.endMs })),
        ] : []}
      />

      {/* Layer 2: graphics (placement zones already account for the face via
          GraphicPlacement context below) */}
      {tracks.graphics.map((g, i) => {
        const from = msToFrames(g.startMs, fps);
        const dur = msToFrames(g.endMs - g.startMs, fps);
        if (dur <= 0) return null;
        const useSecondary = g.type !== "hook" && g.type !== "cta" && i % 2 === 1;
        const gAccent = useSecondary ? recipe.accent2 : recipe.accent;
        const gAccent2 = useSecondary ? recipe.accent : recipe.accent2;
        return (
          <Sequence key={`gfx-${i}`} from={from} durationInFrames={dur}>
            <GraphicLayer graphic={g} accent={gAccent} accent2={gAccent2} placement={presetConfig.cardPlacement} iconsEnabled={presetConfig.iconsEnabled} />
          </Sequence>
        );
      })}

      {/* Timeline transitions are their own EDL track, layered above graphics. */}
      <TransitionLayer
        transitions={tracks.transitions}
        accent={recipe.accent}
        accent2={recipe.accent2}
        highlight={recipe.highlightColor}
      />

      {/* SFX: explicit cues when present, otherwise smart fallback from graphics/transitions */}
      <SfxLayer graphics={tracks.graphics} transitions={tracks.transitions} cues={tracks.sfx} />
    </AbsoluteFill>
    </LayoutContext.Provider>
    </StyleContext.Provider>
  );
};

const PersistentTitleHook: React.FC<{ text: string; accent: string; accent2: string; textFx?: "gradient" | "solid" }> = ({
  text,
  accent,
  accent2,
  textFx = "gradient",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18, 42], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 52,
          right: 52,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 940,
            textAlign: "center",
            fontFamily: DISPLAY_FONT,
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: -0.6,
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            textTransform: "uppercase",
            color: "#fff",
            textShadow: "0 4px 18px rgba(0,0,0,0.62)",
          }}
        >
          <span
            style={
              textFx === "solid"
                ? { color: "#fff" }
                : {
                    // 2-stop sweep: the old accent->white->accent2 mixed muddy
                    // hues inside single letters
                    backgroundImage: `linear-gradient(100deg, ${accent}, ${accent2})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
            }
          >
            {text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Background music with fade-in/out and intro skip. Longer tracks are cut at
 * video end (fade covers the cut); shorter tracks loop. */
const MusicTrack: React.FC<{
  music: NonNullable<Edl["music"]>;
  durationSec: number;
}> = ({ music, durationSec }) => {
  const { fps } = useVideoConfig();
  const totalFrames = Math.ceil(durationSec * fps);
  const fadeOutFrames = Math.round(music.fadeOutSec * fps);
  const fadeInFrames = Math.round(0.3 * fps); // tiny fade-in avoids a click
  return (
    <Audio
      src={music.src.startsWith("http") ? music.src : staticFile(music.src)}
      trimBefore={Math.round(music.startSec * fps)}
      loop={music.loop}
      volume={(f) =>
        interpolate(
          f,
          [0, fadeInFrames, Math.max(fadeInFrames + 1, totalFrames - fadeOutFrames), totalFrames],
          [0, music.volume, music.volume, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};

/** Raw video with EDL-driven punch-in zoom segments + base crop/shift. */
const ZoomedVideo: React.FC<{
  clip: string;
  effects: Effect[];
  baseScale: number;
  baseShiftYPct: number;
  volume?: number;
}> = ({ clip, effects, baseScale, baseShiftYPct, volume = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // pick the active zoom (if any) at current frame, layered on top of base scale
  let zoom = 1;
  for (const e of effects) {
    const start = msToFrames(e.startMs, fps);
    const end = msToFrames(e.endMs, fps);
    if (frame >= start && frame <= end) {
      const inDur = Math.min(8, (end - start) / 2);
      zoom = interpolate(frame, [start, start + inDur], [1, e.scale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  const scale = baseScale * zoom;
  const shiftY = (baseShiftYPct / 100) * 1920;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `translateY(${shiftY}px) scale(${scale})` }}>
        <OffthreadVideo
          src={clip.startsWith("http") ? clip : staticFile(clip)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={volume}
          muted={volume === 0}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
