/**
 * EDL (Edit Decision List) — the central contract between analysis and render.
 * An EDL describes WHAT to render over the raw talking-head clip:
 * captions, effects (zoom), graphics (hook/cta/kinetic). The Reel composition
 * reads this and renders deterministically.
 */
import { z } from "zod";

export const captionTokenSchema = z.object({
  text: z.string(),
  fromMs: z.number(),
  toMs: z.number(),
});

export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  // optional word-level tokens for active-word highlighting
  tokens: z.array(captionTokenSchema).optional(),
  // index of the keyword token to color-highlight (Hormozi style); -1 = none
  keywordIdx: z.number().default(-1),
  // Hierarchical summary caption fields (photo reference styles)
  headlineStyle: z.enum([
    "3-tier",
    "stat-punch",
    "split-contrast",
    "tag-headline",
    "normal",
    "kinetic-pop",
    "staggered-lines",
    "glow-ambient",
    "asymmetric-trio",
    "stacked-contrast",
    "multiblock-flow",
  ]).default("normal"),
  header: z.string().optional(),
  keyword: z.string().optional(),
  sub: z.string().optional(),
  tag: z.string().optional(),
  topText: z.string().optional(),
  bottomText: z.string().optional(),
  highlightWord: z.string().optional(),
  keywordStartMs: z.number().optional(),
});

export const effectSchema = z.object({
  type: z.enum(["zoom", "punch-in"]),
  startMs: z.number(),
  endMs: z.number(),
  scale: z.number().default(1.1),
});

export const transitionSchema = z.object({
  type: z.enum([
    // legacy support
    "color-wipe",
    "flash",
    "zoom-blur",
    // 1. Quick cut / beat cut family
    "quick-cut",
    "glitch-cut",
    // 2. Swipe / slide family
    "swipe-left",
    "swipe-right",
    "swipe-up",
    // 3. Zoom / whip family
    "whip-pan",
    // 4. Blend / mask family
    "mask-circle",
    "blend-fade",
    // 5. Color flash / light leak family
    "color-flash",
    "light-leak",
    // 6. Shatter / debris family
    "debris-shatter",
    // 7. CapCut viral transition suite
    "glare-ii",
    "phone-reveal",
    "glitch",
    "fade-down",
    "blink",
    "wave-right",
    "comic-cut",
    "paper-ball",
  ]),
  startMs: z.number(),
  endMs: z.number(),
  direction: z.enum(["up", "down", "left", "right"]).default("up"),
  intensity: z.number().default(1),
  colorRole: z.enum(["accent", "accent2", "highlight"]).default("accent"),
});

export const sfxCueSchema = z.object({
  startMs: z.number(),
  sound: z.enum([
    // legacy 5 (kept for backward compat)
    "impact", "bell", "whoosh", "pop", "transition",
    // impact family
    "impact-soft", "impact-hard", "sub-drop", "boom",
    // whoosh family
    "whoosh-fast", "whoosh-soft", "swoosh-rev",
    // riser / tension
    "riser", "noise-riser",
    // ui / pop
    "pop-soft", "tick", "click",
    // ding / bell / sparkle
    "ding", "bell-bright", "sparkle",
    // transition
    "transition-soft", "transition-punch",
    // 1. Xuất hiện
    "swish", "magic-reveal", "cartoon-effect",
    // 2. Chuột & Bàn phím
    "keyboard-click", "typing-1", "typing-2", "mouse-click",
    // 3. Công nghệ
    "pip", "hologram", "error", "glitch",
    // 4. Nhấn mạnh
    "highlight", "hit", "correct",
    // 5. Chuyển cảnh & Foley
    "camera-shutter", "paper-slide",
    // 34 mẫu chuẩn hóa từ video Anh Sắc:
    // 1. Công nghệ
    "tech-notification", "tech-mouse-click", "tech-keyboard-typing", "tech-toggle", "tech-glitch", "tech-digital-loading",
    // 2. Chuyển cảnh
    "transition-woosh-1", "transition-woosh-2", "transition-deep-woosh", "film-burn", "reverse-playback",
    // 3. Cinematic
    "cinematic-metallic-rise", "cinematic-boom", "cinematic-hit", "remembering-woosh",
    // 4. Hành động (Foley)
    "foley-brushing", "foley-deck-brushing", "foley-sponge", "foley-boiling-dishes", "foley-stir-ice-glass",
    // 5. Hoạt hình / Retro
    "cartoon-pop", "cartoon-running", "cartoon-punch", "cartoon-womp-womp", "cartoon-blinking", "cartoon-slide-whistle", "cartoon-boing",
    // 6. Game
    "game-coin-collect", "game-power-up", "game-level-up", "game-health-low", "game-pixel-explosion", "game-level-complete",
    // 11 mẫu bổ sung từ video Kobe Media (giây 45 trở đi):
    "kobe-woosh", "comic-vocal-uh", "chime-ding", "cinematic-suspense", "among-us-reveal",
    "cartoon-duck-quack", "slide-whistle-up", "game-correct", "game-wrong-buzzer",
    "cartoon-thump-boing", "comic-vocal-yeet",
    // Aliases bổ sung
    "wrong", "buzzer", "suspense", "yeet",
    // 7. CapCut Suite SFX chuyên biệt (Fixed Pairing)
    "phone-shutter-1", "paper-ball-yt", "comic-paper-tear", "wave-sparkle", "glare-burn", "glitch-cut", "fade-woosh",
  ]),
  volume: z.number().default(0.6),
  priority: z.number().default(5),
  preRollMs: z.number().default(65),
});

/**
 * StyleRecipe — the Python↔React contract for render MATERIAL + COLOR (not just color).
 * SINGLE SOURCE: generate-edl.py writes the full recipe into edl.style.recipe; React
 * reads all material and color from here.
 * Material/color token VALUES come from src/style-themes.json (one source, not duplicated
 * in Python). Every field defaults to the v7 baseline so a no-preset EDL renders unchanged.
 */
export const styleRecipeSchema = z.object({
  surface: z.enum(["none", "glass-light", "glass-dark", "solid-tint"]).default("glass-light"),
  blurPx: z.number().default(18),
  shadowMode: z.enum(["soft", "hard"]).default("soft"),
  borderIntensity: z.number().default(0.35),
  cardRadius: z.number().default(28),
  captionStrokePx: z.number().default(3),
  // FINAL bottom-padding % (higher = caption sits higher). Render uses this verbatim —
  // NO +3 offset (v7 = SAFE.bottomPct 25 + 3 = 28, so 28 IS the final value).
  captionBottomPct: z.number().default(28),
  motionVoice: z.enum(["energetic", "confident", "handcraft", "reveal", "punch"]).default("energetic"), // render-wired in P4b only
  // cards/surfaces only (GlassCard/GlassStrip); BackingBlob keeps its own hardcoded 0.55
  glassOpacity: z.number().default(0.12),
  textScale: z.number().default(1.0),
  entryAnimFamily: z.enum(["spring", "slide", "fade", "mask"]).default("spring"),
  // typography voice — lets a theme opt out of the bold-sales look:
  // textFx "solid" kills gradient text (hook/kinetic/glass-strip);
  // captionCase "sentence" drops the global UPPERCASE
  textFx: z.enum(["gradient", "solid"]).default("gradient"),
  captionCase: z.enum(["upper", "sentence"]).default("upper"),
  // color — recipe is the single source for color too
  accent: z.string().default("#FF8C00"),
  accent2: z.string().default("#FFC845"),
  highlightColor: z.string().default("#39E508"),
  captionColor: z.string().default("#FFFFFF"),
  scrimAlpha: z.number().default(0.0), // caption/graphic backing scrim; v7=0, noir raises it
  captionStyle: z.enum(["karaoke", "summary"]).default("summary"),
  // Preset — drives branching across all components (cards, scrim, placement, mutual exclusivity)
  preset: z.enum(["thuy-style-oneshot", "thuy-style-nhieu-canh", "classic", "anh-sac-podcast"]).default("thuy-style-oneshot"),
});

export const graphicSchema = z.object({
  type: z.enum([
    "hook",
    "lower-third",
    "kinetic",
    "cta",
    "callout",
    "highlight-reveal",
    "number-counter",
    "progress-bar",
    "badge",
    "color-wipe",
    "glass-card",
    // charts (number visualizers)
    "donut-stat",
    "bar-stat",
    // high-end kinetic typography (no icons)
    "kinetic-statement",
    "mask-reveal",
    "glass-strip",
    "path-mark",
    "shape-3d",
    // illustrative vector element pop (no clipart/emoji)
    "illus-mark",
    // designed infographics (structured, multi-element)
    "step-flow",
    "comparison",
    "list-reveal",
    "lower-third-pro",
    // data-viz cards (detailed info, multi-layer fx)
    "info-table",
    "stat-compare",
    // premium semantic visual pack (reference-style line-art/glow assets)
    "premium-roadmap",
    "neon-icon-card",
    "negative-slash-card",
    "dual-icon-cards",
    "diamond-label",
    // Tobi-style ad comparison clone: side-by-side ad outcome cards
    "ad-comparison-scene",
    // b-roll hook stack (workflow B): title strips + handwritten sub-hook + CTA
    "broll-hook",
    "broll-subhook",
    "broll-cta",
    // fullscreen kinetic keyword B-roll (100% full frame)
    "fullscreen-keyword",
    // Hierarchical Idea Headlines in graphics track:
    "3-tier",
    "stat-punch",
    "split-contrast",
    "tag-headline",
    // Anh-sac style graphic cards & typography:
    "grid-flat-card",
    "number-badge",
    "kinetic-pop",
    "staggered-lines",
    "glow-ambient",
    "asymmetric-trio",
    "stacked-contrast",
    "multiblock-flow",
  ]),
  startMs: z.number(),
  endMs: z.number(),
  text: z.string().default(""),
  // optional headline metadata
  header: z.string().optional(),
  keyword: z.string().optional(),
  sub: z.string().optional(),
  subtitle: z.string().optional(),
  tag: z.string().optional(),
  topText: z.string().optional(),
  bottomText: z.string().optional(),
  highlightWord: z.string().optional(),
  keywordStartMs: z.number().optional(),
  // fullscreen-keyword broll background variant & custom image
  bgVariant: z.enum([
    "pure-black",
    "grid-caro",
    "paper-crumpled-black",
    "paper-crumpled-white",
    "dark-gradient",
    "dark-brick",
    "blurred-speaker",
    "radial-navy",
    "concrete-grunge",
    "carbon-mesh",
    "lens-bokeh",
  ]).optional(),
  bgCustomImage: z.string().optional(),
  // optional extras for richer graphics
  value: z.number().optional(), // number-counter
  suffix: z.string().optional(), // number-counter ("%", "phút")
  label: z.string().optional(), // counter/progress label
  anchor: z.enum(["top", "center", "bottom"]).optional(), // callout placement
  step: z.number().optional(), // glass-card step number
  kind: z.enum(["circle", "underline", "arrow"]).optional(), // path-mark style
  shape: z.enum(["cube", "sphere", "torus", "diamond"]).optional(), // shape-3d geometry
  illus: z.enum([
    "curved-arrow", "bracket", "circle-draw", "check", "cross", "starburst",
    // semantic metaphors (P5) — self-drawn SVG, dispatched to MetaphorMark
    "metaphor-process", "metaphor-speed", "metaphor-quality", "metaphor-money", "metaphor-idea",
  ]).optional(),
  // infographic data: step-flow/list-reveal use items[]; comparison uses left/right; lower-third uses title/subtitle
  items: z.array(z.string()).optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  // info-table: rows of {k,v}
  rows: z.array(z.object({ k: z.string(), v: z.string() })).optional(),
  // stat-compare: two labeled metrics
  leftLabel: z.string().optional(),
  leftVal: z.number().optional(),
  rightLabel: z.string().optional(),
  rightVal: z.number().optional(),
  unit: z.string().optional(),
  // GROUP 1 intent variants (scheduler-set from transcript): warning callout uses the
  // alert color; rank highlights the top list item.
  warningMode: z.boolean().optional(),
  rank: z.number().optional(),
  // premium semantic visual pack
  icon: z.enum([
    "course-access", "advice", "confidence", "process", "warning",
    "progress", "video-course", "magnet", "quality", "idea",
  ]).optional(),
  visualWeight: z.enum(["micro", "minor", "major", "scene"]).optional(),
  emphasis: z.string().optional(),
  sourceClip: z.string().optional(),
  adVariant: z.enum(["talking", "spotlight", "black-card", "red-alert", "list", "book"]).optional(),
  // Anh-sac style fields
  iconType: z.enum(["crane", "timeline", "audio-wave", "camera", "book", "warning", "lightbulb"]).optional(),
  numberValue: z.number().optional(),
  secondaryText: z.string().optional(),
});

export const brollSchema = z.object({
  startMs: z.number(),
  endMs: z.number(),
  prompt: z.string(),
  src: z.string().optional(), // filled by Phase 07 (Veo/Higgsfield), optional
});

export const edlSchema = z.object({
  source: z.object({
    clip: z.string(), // path/URL to raw talking-head video (staticFile)
    durationSec: z.number(),
    // source clip loudness (b-roll workflow mutes the raw footage by default)
    volume: z.number().default(1),
  }),
  format: z.object({
    w: z.number().default(1080),
    h: z.number().default(1920),
    fps: z.number().default(30),
  }),
  // style hints and render material/color tokens
  style: z
    .object({
      captionColor: z.string().default("#FFFFFF"),
      highlightColor: z.string().default("#39E508"),
      accent: z.string().default("#FF8C00"),
      accent2: z.string().default("#FFC845"), // secondary accent for variety
      // baseline crop to push burned-in original captions out of frame
      baseScale: z.number().default(1),
      baseShiftYPct: z.number().default(0), // negative shifts video up
      // optional blur band to mask a burned-in caption region (% of height)
      maskBandTopPct: z.number().default(0),
      maskBandHeightPct: z.number().default(0), // 0 = disabled
      // face-aware layout: where the speaker's free zone is + face vertical center
      freeZone: z.enum(["top", "bottom", "left", "right"]).default("top"),
      faceCenterYPct: z.number().default(32),
      // ambient decorative element layer (sparkles + orbit ring) for the whole clip
      ambient: z.enum(["none", "sparkles", "ring", "both"]).default("none"),
      // persistent testimonial hook shown in the top safe area.
      titleHook: z.string().optional(),
      // render material + color recipe (preset-driven; defaults = v7 baseline).
      // .prefault({}) runs an empty object THROUGH styleRecipeSchema so each nested
      // field gets its own default (zod v4 .default() requires a full literal).
      recipe: styleRecipeSchema.prefault({}),
    })
    // .prefault({}) → an absent style block is parsed from {}, filling every nested
    // default (incl. recipe) without restating the whole literal.
    .prefault({}),
  // background music (workflow B mainly): src relative to public/; when set,
  // the source clip's own audio drops to clipVolume (default muted)
  music: z
    .object({
      src: z.string(),
      volume: z.number().default(0.7),
      clipVolume: z.number().default(0),
      loop: z.boolean().default(true),
      // skip the track's intro: start playback at this second of the file
      startSec: z.number().default(0),
      // fade the music out over the last N seconds (0 = hard cut)
      fadeOutSec: z.number().default(1.5),
    })
    .optional(),
  tracks: z.object({
    captions: z.array(captionSchema).default([]),
    effects: z.array(effectSchema).default([]),
    transitions: z.array(transitionSchema).default([]),
    graphics: z.array(graphicSchema).default([]),
    sfx: z.array(sfxCueSchema).default([]),
    broll: z.array(brollSchema).default([]),
  }),
});

export type Edl = z.infer<typeof edlSchema>;
export type Caption = z.infer<typeof captionSchema>;
export type Graphic = z.infer<typeof graphicSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type Transition = z.infer<typeof transitionSchema>;
export type SfxCue = z.infer<typeof sfxCueSchema>;
export type StyleRecipe = z.infer<typeof styleRecipeSchema>;
