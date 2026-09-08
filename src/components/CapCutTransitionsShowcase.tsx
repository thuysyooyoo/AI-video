import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  GlareIITwoLayer,
  PhoneRevealTwoLayer,
  PaperBallTwoLayer,
  GlitchTwoLayer,
  FadeDownTwoLayer,
  BlinkTwoLayer,
  WaveRightTwoLayer,
  SwipeLeftTwoLayer,
  ComicCutTwoLayer,
} from "./CapCutTwoLayerTransitions";
import { DISPLAY_FONT, BODY_FONT } from "../fonts";

interface TransitionItem {
  id: string;
  name: string;
  capcutName: string;
  desc: string;
  subDesc: string;
  tag: string;
  iconBg: string;
  transDuration: number; // total frames for transition
  sfxSrc: string; // SFX audio path in public/
  sfxName: string; // Descriptive SFX badge
  sfxOffset: number; // Frame offset relative to CUT_FRAME
  sfxVolume: number; // 0..1 volume level
  renderTwoLayer: (
    clipA: string,
    clipB: string,
    progress: number,
    w: number,
    h: number
  ) => React.ReactNode;
}

const TRANSITIONS: TransitionItem[] = [
  {
    id: "glare-ii",
    name: "01. GLARE II",
    capcutName: "Glare II",
    desc: "Chớp lóa quang học vàng kem ấm tỏa tâm (Radial bloom & anamorphic flare)",
    subDesc: "Clip A chớp lóa ánh ấm chuyển sang Clip B liền mạch",
    tag: "0:06 CapCut",
    iconBg: "#FF9900",
    transDuration: 16,
    sfxSrc: "sfx/glare-burn.mp3",
    sfxName: "Film Burn / Warm Flare",
    sfxOffset: -8,
    sfxVolume: 0.9,
    renderTwoLayer: (clipA, clipB, p) => (
      <GlareIITwoLayer clipA={clipA} clipB={clipB} progress={p} intensity={1.25} />
    ),
  },
  {
    id: "phone-reveal",
    name: "02. PHONE REVEAL",
    capcutName: "Phone Reveal",
    desc: "Khung iPhone 15 Pro chứa Clip B phóng to xuyên tâm mở full màn hình",
    subDesc: "Clip A nền mờ, màn hình điện thoại phóng to mở Clip B",
    tag: "0:08 CapCut",
    iconBg: "#2B2D31",
    transDuration: 22,
    sfxSrc: "sfx/phone-shutter-1.mp3",
    sfxName: "Camera Shutter (1 Single Snap)",
    sfxOffset: -4,
    sfxVolume: 0.95,
    renderTwoLayer: (clipA, clipB, p, w, h) => (
      <PhoneRevealTwoLayer
        clipA={clipA}
        clipB={clipB}
        progress={p}
        cardWidth={w}
        cardHeight={h}
      />
    ),
  },
  {
    id: "paper-ball",
    name: "03. PAPER BALL",
    capcutName: "Paper Ball",
    desc: "Cầu giấy vo tròn rách bung từ tâm để lộ Clip B bên trong",
    subDesc: "Lỗ rách giấy bung rộng 360° mở trọn Clip B",
    tag: "0:09 CapCut",
    iconBg: "#E0E0E0",
    transDuration: 20,
    sfxSrc: "sfx/paper-ball-yt.mp3",
    sfxName: "Paper Ball Squeeze (YouTube)",
    sfxOffset: -8,
    sfxVolume: 0.95,
    renderTwoLayer: (clipA, clipB, p, w, h) => (
      <PaperBallTwoLayer
        clipA={clipA}
        clipB={clipB}
        progress={p}
        cardWidth={w}
        cardHeight={h}
      />
    ),
  },
  {
    id: "glitch",
    name: "04. GLITCH",
    capcutName: "Glitch",
    desc: "Cắt lát hình ngang (Horizontal Slices) giật lệch vị trí & tách RGB",
    subDesc: "Các lát ngang đan xen Clip A & B kèm quang sai số",
    tag: "0:11 CapCut",
    iconBg: "#00E5FF",
    transDuration: 14,
    sfxSrc: "sfx/glitch-cut.mp3",
    sfxName: "Digital Glitch Static",
    sfxOffset: -5,
    sfxVolume: 0.85,
    renderTwoLayer: (clipA, clipB, p) => (
      <GlitchTwoLayer clipA={clipA} clipB={clipB} progress={p} />
    ),
  },
  {
    id: "fade-down",
    name: "05. FADE DOWN",
    capcutName: "Fade Down",
    desc: "Clip B trượt từ đỉnh xuống đè mượt lên Clip A kèm vệt mờ dọc",
    subDesc: "Kéo trượt mượt mà theo trục dọc rơi tự do",
    tag: "0:14 CapCut",
    iconBg: "#7C4DFF",
    transDuration: 14,
    sfxSrc: "sfx/fade-woosh.mp3",
    sfxName: "Deep Down-Woosh",
    sfxOffset: -5,
    sfxVolume: 0.9,
    renderTwoLayer: (clipA, clipB, p) => (
      <FadeDownTwoLayer clipA={clipA} clipB={clipB} progress={p} />
    ),
  },
  {
    id: "blink",
    name: "06. BLINK",
    capcutName: "Blink",
    desc: "Chớp mắt siêu nhanh 7 frames đúng tâm 50% trục dọc khung hình",
    subDesc: "Khép mí cong vào giữa khe sáng rồi bung cảnh mới",
    tag: "0:16 CapCut",
    iconBg: "#111111",
    transDuration: 8,
    sfxSrc: "sfx/click.mp3",
    sfxName: "Click Snap (Requested)",
    sfxOffset: -3,
    sfxVolume: 0.95,
    renderTwoLayer: (clipA, clipB, p, w, h) => (
      <BlinkTwoLayer
        clipA={clipA}
        clipB={clipB}
        progress={p}
        cardWidth={w}
        cardHeight={h}
      />
    ),
  },
  {
    id: "wave-right",
    name: "07. WAVE RIGHT",
    capcutName: "Wave Right",
    desc: "Gợn sóng lỏng mực trắng quét ngang loang mở cảnh mới từ trái qua",
    subDesc: "Liquid ink wave wipe quét sạch mở Clip B",
    tag: "0:17 CapCut",
    iconBg: "#00B0FF",
    transDuration: 16,
    sfxSrc: "sfx/wave-sparkle.mp3",
    sfxName: "Sparkle / Liquid Droplet (Requested)",
    sfxOffset: -6,
    sfxVolume: 0.9,
    renderTwoLayer: (clipA, clipB, p, w, h) => (
      <WaveRightTwoLayer
        clipA={clipA}
        clipB={clipB}
        progress={p}
        cardWidth={w}
        cardHeight={h}
      />
    ),
  },
  {
    id: "swipe-left",
    name: "08. SWIPE LEFT",
    capcutName: "Swipe Left",
    desc: "Clip A trượt trái -100%, Clip B trượt từ +100% vào kèm Kinetic Blade",
    subDesc: "Whip-pan 2 lớp trượt ngang với vệt mờ tốc độ",
    tag: "0:18 CapCut",
    iconBg: "#FF5252",
    transDuration: 10,
    sfxSrc: "sfx/whoosh-fast.mp3",
    sfxName: "Fast Whip Whoosh",
    sfxOffset: -4,
    sfxVolume: 0.95,
    renderTwoLayer: (clipA, clipB, p) => (
      <SwipeLeftTwoLayer clipA={clipA} clipB={clipB} progress={p} />
    ),
  },
  {
    id: "comic-cut",
    name: "09. COMIC CUT",
    capcutName: "Comic Cut",
    desc: "Xé đôi Clip A dọc giữa, để lộ Clip B dạng chấm bi Manga Halftone",
    subDesc: "Mép rách giấy xé toạc sang 2 bên rồi chuyển sang màu",
    tag: "CapCut Pro",
    iconBg: "#FFD600",
    transDuration: 20,
    sfxSrc: "sfx/comic-paper-tear.mp3",
    sfxName: "Paper Tear Foley (Requested)",
    sfxOffset: -6,
    sfxVolume: 0.95,
    renderTwoLayer: (clipA, clipB, p, w, h) => (
      <ComicCutTwoLayer
        clipA={clipA}
        clipB={clipB}
        progress={p}
        cardWidth={w}
        cardHeight={h}
      />
    ),
  },
];

const SCENE_FRAMES = 90; // 3 seconds per scene at 30fps
const CUT_FRAME = 45; // Cut centered at frame 45 of each 90-frame block
const CARD_WIDTH = 720;
const CARD_HEIGHT = 1120;

export const CapCutTransitionsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const currentSceneIdx = Math.min(
    TRANSITIONS.length - 1,
    Math.floor(frame / SCENE_FRAMES)
  );
  const frameInScene = frame % SCENE_FRAMES;
  const currentTrans = TRANSITIONS[currentSceneIdx];

  // Alternating clips for clear scene distinction
  const clip1Src = staticFile("demo/IMG_1562.0_clip01.MOV");
  const clip2Src = staticFile("demo/IMG_1562.0_clip02.MOV");

  // Determine active clip before and after cut
  const isEvenScene = currentSceneIdx % 2 === 0;
  const clipBefore = isEvenScene ? clip1Src : clip2Src;
  const clipAfter = isEvenScene ? clip2Src : clip1Src;

  // Active clip based on cut frame for outer background ambient blur
  const isAfterCut = frameInScene >= CUT_FRAME;
  const activeAmbientClip = isAfterCut ? clipAfter : clipBefore;

  // Transition window centered at CUT_FRAME
  const halfDuration = Math.round(currentTrans.transDuration / 2);
  const transStart = CUT_FRAME - halfDuration;
  const transEnd = CUT_FRAME + halfDuration;
  const isTransActive = frameInScene >= transStart && frameInScene < transEnd;

  // Progress 0..1 during transition window
  const transProgress = isTransActive
    ? (frameInScene - transStart) / (transEnd - transStart)
    : frameInScene >= transEnd
    ? 1
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#08090C", fontFamily: BODY_FONT }}>
      {/* 1. Background blurred video for deep cinematic ambiance */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={activeAmbientClip}
          volume={0}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(48px) brightness(0.28)",
            transform: "scale(1.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.88) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* 2. Sleek Neon Outer Safe-Zone Border (From CapCut Reference) */}
      <div
        style={{
          position: "absolute",
          top: 36,
          bottom: 36,
          left: 28,
          right: 28,
          borderRadius: 48,
          border: "2px solid rgba(255, 255, 255, 0.75)",
          boxShadow:
            "0 0 25px rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.2)",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      {/* 3. Top Header HUD: Step Tracker & Title */}
      <div
        style={{
          position: "absolute",
          top: 75,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              padding: "6px 20px",
              borderRadius: 30,
              backgroundColor: "rgba(255, 230, 0, 0.15)",
              border: "1px solid rgba(255, 230, 0, 0.5)",
              color: "#FFE600",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {currentTrans.tag} • 2-LAYER COMPOSITOR + SFX
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 30,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {currentSceneIdx + 1} / {TRANSITIONS.length}
          </div>
        </div>

        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 46,
            fontWeight: 950,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            textAlign: "center",
          }}
        >
          {currentTrans.name}
        </div>
      </div>

      {/* 4. Central Stage Player Card (720x1120 True 2-Layer Transition Engine) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -52%)",
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 42,
          overflow: "hidden",
          border: "4px solid rgba(255, 255, 255, 0.88)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.85), 0 0 35px rgba(255,255,255,0.22)",
          zIndex: 30,
          backgroundColor: "#000",
        }}
      >
        {/* Stage Content: Three States (Before Cut, In 2-Layer Transition, After Cut) */}
        {!isTransActive && !isAfterCut && (
          <OffthreadVideo
            src={clipBefore}
            volume={0}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {!isTransActive && isAfterCut && (
          <OffthreadVideo
            src={clipAfter}
            volume={0}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {isTransActive &&
          currentTrans.renderTwoLayer(
            clipBefore,
            clipAfter,
            transProgress,
            CARD_WIDTH,
            CARD_HEIGHT
          )}

        {/* Realtime Cut Indicator Badge */}
        {frameInScene >= CUT_FRAME - 2 && frameInScene <= CUT_FRAME + 4 && (
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "6px 18px",
              borderRadius: 14,
              backgroundColor: "#FF0033",
              color: "#FFF",
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: "0.06em",
              boxShadow: "0 0 20px #FF0033",
              zIndex: 80,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>CUT ➔ {currentTrans.capcutName.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* 6. Bottom Preset Info Card (CapCut Style HUD + SFX Badge) */}
      <div
        style={{
          position: "absolute",
          bottom: 75,
          left: 60,
          right: 60,
          height: 175,
          backgroundColor: "rgba(18, 20, 26, 0.86)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 32,
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          gap: 24,
          zIndex: 50,
        }}
      >
        {/* Preset Icon Box */}
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 24,
            backgroundColor: currentTrans.iconBg,
            boxShadow: `0 10px 30px ${currentTrans.iconBg}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "2px solid rgba(255, 255, 255, 0.25)",
          }}
        >
          {currentTrans.id === "glare-ii" && (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #FFF 10%, #FFD700 60%, transparent 100%)",
                boxShadow: "0 0 20px #FFF",
              }}
            />
          )}
          {currentTrans.id === "phone-reveal" && (
            <div
              style={{
                width: 42,
                height: 70,
                borderRadius: 10,
                border: "3px solid #FFF",
                boxShadow: "0 0 15px rgba(255,255,255,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 4,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "#FFF",
                }}
              />
            </div>
          )}
          {currentTrans.id === "paper-ball" && (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                backgroundColor: "#FFFFFF",
                boxShadow: "inset -5px -5px 12px rgba(0,0,0,0.4)",
              }}
            />
          )}
          {currentTrans.id === "glitch" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                width: 56,
              }}
            >
              <div
                style={{
                  height: 7,
                  backgroundColor: "#00E5FF",
                  transform: "translateX(6px)",
                }}
              />
              <div
                style={{
                  height: 7,
                  backgroundColor: "#FFF",
                  transform: "translateX(-8px)",
                }}
              />
              <div
                style={{
                  height: 7,
                  backgroundColor: "#FF0055",
                  transform: "translateX(4px)",
                }}
              />
            </div>
          )}
          {currentTrans.id === "fade-down" && (
            <div
              style={{
                fontSize: 48,
                color: "#FFF",
                lineHeight: 1,
                transform: "translateY(2px)",
              }}
            >
              ↓
            </div>
          )}
          {currentTrans.id === "blink" && (
            <div
              style={{
                width: 58,
                height: 28,
                borderTop: "4px solid #FFF",
                borderBottom: "4px solid #FFF",
                borderRadius: "50%",
              }}
            />
          )}
          {currentTrans.id === "wave-right" && (
            <div
              style={{
                fontSize: 44,
                color: "#FFF",
                lineHeight: 1,
              }}
            >
              〰
            </div>
          )}
          {currentTrans.id === "swipe-left" && (
            <div
              style={{
                fontSize: 48,
                color: "#FFF",
                lineHeight: 1,
              }}
            >
              ←
            </div>
          )}
          {currentTrans.id === "comic-cut" && (
            <div
              style={{
                fontSize: 40,
                color: "#000",
                fontWeight: 900,
                backgroundColor: "#FFF",
                padding: "2px 8px",
                borderRadius: 8,
                border: "2px solid #000",
              }}
            >
              ⚡
            </div>
          )}
        </div>

        {/* Text Details + SFX Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              {currentTrans.capcutName}
            </div>
            <div
              style={{
                padding: "2px 10px",
                borderRadius: 6,
                backgroundColor: "rgba(255,255,255,0.12)",
                fontSize: 14,
                color: "#A0A5B5",
                fontWeight: 700,
              }}
            >
              {currentTrans.transDuration}f (~{(currentTrans.transDuration / 30).toFixed(2)}s)
            </div>
            {/* Prominent SFX Badge with Live Audio Indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 12px",
                borderRadius: 8,
                backgroundColor: isTransActive
                  ? "rgba(0, 255, 128, 0.22)"
                  : "rgba(0, 229, 255, 0.12)",
                border: isTransActive
                  ? "1.5px solid #00FF80"
                  : "1px solid rgba(0, 229, 255, 0.4)",
                boxShadow: isTransActive
                  ? "0 0 16px rgba(0, 255, 128, 0.45)"
                  : "none",
                color: isTransActive ? "#00FF80" : "#00E5FF",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.03em",
              }}
            >
              <span>{isTransActive ? "🔊 SFX PLAYING:" : "🔈 SFX:"}</span>
              <span style={{ color: "#FFFFFF" }}>{currentTrans.sfxName}</span>
              {isTransActive && (
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#00FF80",
                    boxShadow: "0 0 8px #00FF80",
                    marginLeft: 2,
                  }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#E2E5EE",
              fontWeight: 600,
              lineHeight: 1.35,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrans.desc}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#FFE600",
              fontWeight: 500,
              marginTop: 3,
            }}
          >
            ★ {currentTrans.subDesc}
          </div>
        </div>
      </div>

      {/* 5. Precision SFX Engine: Active ONLY during transition frames; completely silenced at transEnd */}
      {TRANSITIONS.map((trans, idx) => {
        const halfDur = Math.round(trans.transDuration / 2);
        const tStart = CUT_FRAME - halfDur;
        const absStart = idx * SCENE_FRAMES + tStart;
        const dur = trans.transDuration;

        return (
          <Sequence
            key={`sfx-${trans.id}`}
            from={absStart}
            durationInFrames={dur}
          >
            <Audio
              src={staticFile(trans.sfxSrc)}
              volume={(f) => {
                // Hard cutoff: ramp down to 0 in the last 2 frames so no audio leaks past transition
                if (f >= dur - 2) {
                  return interpolate(
                    f,
                    [dur - 2, dur],
                    [trans.sfxVolume, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                }
                return trans.sfxVolume;
              }}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
