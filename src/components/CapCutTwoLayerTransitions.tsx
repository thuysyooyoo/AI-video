import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate } from "remotion";

export interface TwoLayerTransitionProps {
  clipA: string;
  clipB: string;
  progress: number; // 0 (start) to 1 (end)
  cardWidth?: number;
  cardHeight?: number;
  intensity?: number;
  startFromA?: number;
  startFromB?: number;
}

// -----------------------------------------------------------------------------
// 1. GLARE II: Warm radial bloom + anamorphic flare wash over cut point
// -----------------------------------------------------------------------------
export const GlareIITwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  intensity = 1.25,
  startFromA,
  startFromB,
}) => {
  const isAfterCut = progress >= 0.5;
  const activeClip = isAfterCut ? clipB : clipA;
  const activeStartFrom = isAfterCut ? startFromB : startFromA;

  // Flash curve peaking at 0.5
  const flashAlpha = Math.sin(progress * Math.PI) * intensity;
  const flareScaleX = interpolate(progress, [0.15, 0.5, 0.85], [0.1, 2.0, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brightness = 1 + flashAlpha * 0.5;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Video with exposure bloom */}
      <OffthreadVideo volume={0}
        src={activeClip}
        startFrom={activeStartFrom}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `brightness(${brightness})`,
        }}
      />

      {/* Radial warm golden flare from center (y: 45%) */}
      <AbsoluteFill
        style={{
          opacity: Math.min(1, flashAlpha * 1.15),
          background:
            "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #FFF5D6 20%, #FFCC4D 45%, #FF8800 75%, transparent 100%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Horizontal Anamorphic Streak */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "-50%",
          width: "200%",
          height: 22,
          transform: `scaleX(${flareScaleX}) translateY(-50%)`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)",
          boxShadow: "0 0 40px 14px rgba(255, 215, 0, 0.95)",
          filter: "blur(4px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          opacity: flashAlpha,
        }}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 2. PHONE REVEAL: Clip A background; iPhone holding Clip B zooms into full
// -----------------------------------------------------------------------------
export const PhoneRevealTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  cardWidth = 720,
  cardHeight = 1120,
  startFromA,
  startFromB,
}) => {
  // Proportional phone dimensions: 52% card width, 68% card height
  const phoneW = cardWidth * 0.52;
  const phoneH = cardHeight * 0.68;

  // Zoom curve: clearly small & centered at start, zooming exponentially to full screen
  const phoneScale = interpolate(
    progress,
    [0, 0.28, 0.62, 0.88, 1],
    [0.82, 0.96, 1.5, 2.7, 4.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background Clip A blurs and slightly zooms
  const bgBlur = interpolate(progress, [0, 0.6], [0, 18], { extrapolateRight: "clamp" });
  const bgScale = interpolate(progress, [0, 1], [1, 1.15]);

  // Phone bezel fades out as it expands past the card boundaries
  const bezelOpacity = interpolate(progress, [0.72, 0.92], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Background: Clip A */}
      <OffthreadVideo volume={0}
        src={clipA}
        startFrom={startFromA}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale})`,
          filter: `blur(${bgBlur}px) brightness(${1 - progress * 0.35})`,
        }}
      />

      {/* Vignette over Clip A */}
      <AbsoluteFill
        style={{
          background: `rgba(0,0,0,${interpolate(progress, [0, 0.7], [0.15, 0.55])})`,
          pointerEvents: "none",
        }}
      />

      {/* Phone Container holding Clip B */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: phoneW,
          height: phoneH,
          transform: `translate(-50%, -50%) scale(${phoneScale})`,
          transformOrigin: "center center",
          borderRadius: 48,
          overflow: "hidden",
          boxShadow:
            "0 35px 90px rgba(0,0,0,0.95), 0 0 50px rgba(0,0,0,0.8), 0 0 25px rgba(255,255,255,0.2)",
          backgroundColor: "#000",
        }}
      >
        {/* Inside Phone: Clip B */}
        <OffthreadVideo volume={0}
          src={clipB}
          startFrom={startFromB}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dynamic Island & Phone Top HUD (fades when zooming in) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: bezelOpacity,
          }}
        >
          {/* Dynamic Island pill */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 105,
              height: 28,
              borderRadius: 16,
              backgroundColor: "#000000",
              boxShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          />
          {/* Status Bar Clock */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 26,
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            11:17
          </div>
          {/* Home indicator bar */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 4,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
          />
        </div>

        {/* Realistic iPhone Outer Bezel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 48,
            border: "7px solid #1C1C1E",
            boxShadow: "inset 0 0 0 1px #3A3A3C, 0 0 0 2px #0A0A0B",
            pointerEvents: "none",
            opacity: bezelOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 3. PAPER BALL: Crumpled white paper hole tearing open from center revealing Clip B
// -----------------------------------------------------------------------------
export const PaperBallTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  cardWidth = 720,
  cardHeight = 1120,
  startFromA,
  startFromB,
}) => {
  // Scale curve: starts small (0.05) and rips open to 3.4
  const holeScale = interpolate(
    progress,
    [0, 0.22, 0.52, 0.82, 1],
    [0.05, 0.28, 0.72, 1.8, 3.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rot = interpolate(progress, [0, 1], [-18, 18]);

  // Ragged organic polygon path for the torn hole
  const holeClipPath = `polygon(
    50% 0%, 65% 8%, 78% 5%, 85% 18%, 95% 30%, 92% 48%, 98% 62%, 90% 75%, 
    82% 90%, 68% 94%, 52% 100%, 35% 95%, 22% 92%, 10% 82%, 4% 65%, 
    8% 48%, 2% 32%, 14% 18%, 25% 6%, 38% 8%
  )`;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Background: Clip A */}
      <OffthreadVideo volume={0}
        src={clipA}
        startFrom={startFromA}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1 + progress * 0.08})`,
        }}
      />

      {/* Foreground Container: Expanding Torn Paper Hole */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: cardWidth * 0.92,
          height: cardHeight * 0.92,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${holeScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Layer 1: Outer Crumpled White Paper Edge with Folds and Shadows */}
        <div
          style={{
            position: "absolute",
            inset: -28,
            clipPath: `polygon(
              50% -6%, 70% 3%, 84% 1%, 92% 14%, 102% 28%, 98% 48%, 105% 62%, 96% 78%, 
              88% 95%, 72% 99%, 52% 106%, 30% 100%, 16% 97%, 4% 86%, -3% 65%, 
              3% 48%, -5% 30%, 8% 14%, 20% 1%, 34% 4%
            )`,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 30%, #E2E2E2 60%, #BCBCBC 100%)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.9)",
            filter: "drop-shadow(0 0 20px rgba(0,0,0,0.85))",
          }}
        />

        {/* Secondary inner white paper fringe with crinkled folds */}
        <div
          style={{
            position: "absolute",
            inset: -12,
            clipPath: holeClipPath,
            background:
              "radial-gradient(circle at 45% 45%, #FFFFFF 0%, #EEEEEE 70%, #D8D8D8 100%)",
            boxShadow: "inset 0 0 25px rgba(0,0,0,0.5)",
          }}
        />

        {/* Layer 2: Clip B inside the torn hole */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: holeClipPath,
            overflow: "hidden",
          }}
        >
          {/* Invert scale & rotation so Clip B stays stable and upright */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: cardWidth,
              height: cardHeight,
              transform: `translate(-50%, -50%) rotate(${-rot}deg) scale(${1 / Math.max(0.01, holeScale)})`,
              transformOrigin: "center center",
            }}
          >
            <OffthreadVideo volume={0}
              src={clipB}
              startFrom={startFromB}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 4. GLITCH: True horizontal sliced video displacement with RGB split
// -----------------------------------------------------------------------------
export const GlitchTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  startFromA,
  startFromB,
}) => {
  const SLICE_COUNT = 8;
  const sliceHeightPct = 100 / SLICE_COUNT;

  // Jitter intensity peaks in middle (0.25 to 0.75)
  const jitterIntensity = Math.sin(progress * Math.PI);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {Array.from({ length: SLICE_COUNT }).map((_, i) => {
        const topPct = i * sliceHeightPct;

        // Deterministic pseudo-random shift for this slice
        const seed = (i * 37 + Math.floor(progress * 12)) % 10;
        const dir = i % 2 === 0 ? 1 : -1;
        const shiftX = dir * (seed * 9 + 15) * jitterIntensity;

        // Alternating cutover: even slices switch earlier than odd slices
        const sliceCutProgress = 0.35 + (i % 3) * 0.1;
        const sliceClip = progress >= sliceCutProgress ? clipB : clipA;
        const sliceStartFrom = progress >= sliceCutProgress ? startFromB : startFromA;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${topPct}%`,
              left: 0,
              right: 0,
              height: `${sliceHeightPct}%`,
              overflow: "hidden",
              transform: `translateX(${shiftX}px)`,
            }}
          >
            {/* The video slice */}
            <div
              style={{
                position: "absolute",
                top: `-${(topPct / sliceHeightPct) * 100}%`,
                left: 0,
                right: 0,
                height: `${SLICE_COUNT * 100}%`,
              }}
            >
              <OffthreadVideo volume={0}
                src={sliceClip}
                startFrom={sliceStartFrom}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Cyan RGB split */}
            {jitterIntensity > 0.3 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateX(${shiftX * 0.6}px)`,
                  backgroundColor: "rgba(0, 255, 255, 0.28)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Magenta RGB split */}
            {jitterIntensity > 0.3 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateX(${-shiftX * 0.6}px)`,
                  backgroundColor: "rgba(255, 0, 255, 0.28)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        );
      })}

      {/* CRT scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 4px)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          opacity: jitterIntensity * 0.8,
        }}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 5. FADE DOWN: Smooth vertical wipe & slide dragging Clip B down over Clip A
// -----------------------------------------------------------------------------
export const FadeDownTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  startFromA,
  startFromB,
}) => {
  // Smooth power3 ease out
  const easeProgress = 1 - Math.pow(1 - progress, 2.5);

  // Clip B slides down from top (-100% to 0%)
  const translateY = (1 - easeProgress) * -100;
  const vBlur = Math.sin(progress * Math.PI) * 12;

  // Background Clip A has subtle parallax slide down and slight dimming
  const bgTranslateY = easeProgress * 15;
  const bgBrightness = 1 - easeProgress * 0.35;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Background: Clip A */}
      <OffthreadVideo volume={0}
        src={clipA}
        startFrom={startFromA}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateY(${bgTranslateY}%)`,
          filter: `brightness(${bgBrightness})`,
        }}
      />

      {/* Foreground: Clip B sliding down */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${translateY}%)`,
          filter: `blur(0px, ${vBlur}px)`,
          maskImage:
            "linear-gradient(to bottom, black calc(100% - 70px), rgba(0,0,0,0.6) calc(100% - 25px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black calc(100% - 70px), rgba(0,0,0,0.6) calc(100% - 25px), transparent 100%)",
        }}
      >
        <OffthreadVideo volume={0}
          src={clipB}
          startFrom={startFromB}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Leading horizontal light blade at seam */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `calc(${100 + translateY}% - 12px)`,
          height: 24,
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.7) 50%, transparent)",
          boxShadow: "0 0 25px 8px rgba(255,255,255,0.45)",
          opacity: Math.sin(progress * Math.PI) * 0.85,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 6. BLINK: Snappy 7-frame eye blink centered strictly at Y = 50%
// -----------------------------------------------------------------------------
export const BlinkTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  cardWidth = 720,
  cardHeight = 1120,
  startFromA,
  startFromB,
}) => {
  // Cut happens at midpoint (progress 0.5)
  const isCutPassed = progress >= 0.5;
  const activeClip = isCutPassed ? clipB : clipA;
  const activeStartFrom = isCutPassed ? startFromB : startFromA;

  // Closing progress: 0 -> 1 (at 0.46), stays closed until 0.54, then opens 1 -> 0
  const closeProgress = interpolate(
    progress,
    [0, 0.46, 0.54, 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const centerY = cardHeight / 2; // Exact vertical center (560px)
  const halfGap = (1 - closeProgress) * (cardHeight / 2);
  const curvature = (1 - closeProgress) * 110;

  // Top eyelid Y at center
  const topEyelidEdgeY = centerY - halfGap;
  // Bottom eyelid Y at center
  const botEyelidEdgeY = centerY + halfGap;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Video */}
      <OffthreadVideo volume={0}
        src={activeClip}
        startFrom={activeStartFrom}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Centered Eyelid Curvature via SVG */}
      <svg
        width={cardWidth}
        height={cardHeight}
        viewBox={`0 0 ${cardWidth} ${cardHeight}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Upper Eyelid closing downward */}
        <path
          d={`M -20 -20 L ${cardWidth + 20} -20 L ${cardWidth + 20} ${topEyelidEdgeY} Q ${cardWidth / 2} ${topEyelidEdgeY + curvature} -20 ${topEyelidEdgeY} Z`}
          fill="#000000"
        />

        {/* Lower Eyelid closing upward */}
        <path
          d={`M -20 ${cardHeight + 20} L ${cardWidth + 20} ${cardHeight + 20} L ${cardWidth + 20} ${botEyelidEdgeY} Q ${cardWidth / 2} ${botEyelidEdgeY - curvature} -20 ${botEyelidEdgeY} Z`}
          fill="#000000"
        />
      </svg>

      {/* Soft feathered shadow at the meeting slit */}
      {closeProgress > 0.1 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: topEyelidEdgeY - 24,
              height: 28,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)",
              filter: "blur(8px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: botEyelidEdgeY - 4,
              height: 28,
              background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
              filter: "blur(8px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 7. WAVE RIGHT: Authentic liquid wave wipe from left to right revealing Clip B
// -----------------------------------------------------------------------------
export const WaveRightTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  cardWidth = 720,
  cardHeight = 1120,
  startFromA,
  startFromB,
}) => {
  // Wave travels from -cardWidth*0.4 to cardWidth*1.5
  const waveX = interpolate(progress, [0, 1], [-cardWidth * 0.35, cardWidth * 1.45]);
  const waveOpacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Wave path: area to the left of wave is Clip B
  const wavePath = `M -100 0 L ${waveX} 0 C ${waveX + 130} ${cardHeight * 0.25}, ${waveX - 100} ${cardHeight * 0.5}, ${waveX + 160} ${cardHeight * 0.75} C ${waveX - 90} ${cardHeight * 0.9}, ${waveX + 50} ${cardHeight}, ${waveX} ${cardHeight} L -100 ${cardHeight} Z`;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Background: Clip A */}
      <OffthreadVideo volume={0}
        src={clipA}
        startFrom={startFromA}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Foreground: Clip B revealed behind the liquid wave */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `path("${wavePath}")`,
        }}
      >
        <OffthreadVideo volume={0}
          src={clipB}
          startFrom={startFromB}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Splashing white liquid leading rim and droplets */}
      <svg
        width={cardWidth}
        height={cardHeight}
        viewBox={`0 0 ${cardWidth} ${cardHeight}`}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: waveOpacity,
        }}
      >
        {/* Leading edge line */}
        <path
          d={`M ${waveX} 0 C ${waveX + 130} ${cardHeight * 0.25}, ${waveX - 100} ${cardHeight * 0.5}, ${waveX + 160} ${cardHeight * 0.75} C ${waveX - 90} ${cardHeight * 0.9}, ${waveX + 50} ${cardHeight}, ${waveX} ${cardHeight}`}
          stroke="#FFFFFF"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        {/* Organic flying droplet splash particles */}
        <circle cx={waveX + 80} cy={cardHeight * 0.22} r="22" fill="#FFFFFF" />
        <circle cx={waveX + 45} cy={cardHeight * 0.45} r="32" fill="#FFFFFF" />
        <circle cx={waveX + 110} cy={cardHeight * 0.68} r="18" fill="#FFFFFF" />
        <circle cx={waveX + 60} cy={cardHeight * 0.85} r="26" fill="#FFFFFF" />
      </svg>

      {/* Wave crest bloom glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: waveX - 30,
          width: 90,
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.95), transparent)",
          filter: "blur(12px)",
          mixBlendMode: "screen",
          opacity: waveOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 8. SWIPE LEFT: True 2-layer horizontal whip-pan with motion blur & kinetic blade
// -----------------------------------------------------------------------------
export const SwipeLeftTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  startFromA,
  startFromB,
}) => {
  // Cubic ease for snappy whip-pan feel
  const easeProgress =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  // Clip A slides left (0% -> -100%)
  const transA = -easeProgress * 100;
  // Clip B slides in from right (+100% -> 0%)
  const transB = (1 - easeProgress) * 100;

  // Directional horizontal motion blur
  const hBlur = Math.sin(progress * Math.PI) * 26;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Clip A sliding out left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${transA}%) scale(${1 + Math.sin(progress * Math.PI) * 0.04})`,
          filter: `blur(${hBlur}px, 0px)`,
        }}
      >
        <OffthreadVideo volume={0}
          src={clipA}
          startFrom={startFromA}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Clip B sliding in from right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${transB}%) scale(${1 + Math.sin(progress * Math.PI) * 0.04})`,
          filter: `blur(${hBlur}px, 0px)`,
        }}
      >
        <OffthreadVideo volume={0}
          src={clipB}
          startFrom={startFromB}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Kinetic Light Blade on the Seam */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${transB}%`,
          width: 8,
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 0 35px 12px rgba(255,255,255,0.9), -5px 0 20px 4px rgba(0,229,255,0.7)",
          opacity: Math.sin(progress * Math.PI) * 0.95,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// 9. COMIC CUT: Jagged torn paper peeling apart revealing Manga Halftone Clip B
// -----------------------------------------------------------------------------
export const ComicCutTwoLayer: React.FC<TwoLayerTransitionProps> = ({
  clipA,
  clipB,
  progress,
  startFromA,
  startFromB,
}) => {
  // Smooth tearing progress (Math.pow 1.4 for natural tearing rip)
  const tearProgress = Math.pow(progress, 1.4);

  // Left half slides left (-105%), right half slides right (+105%)
  const leftShift = -tearProgress * 105;
  const rightShift = tearProgress * 105;

  // Manga Halftone effect on Clip B dissolves into color as paper opens wide (progress 0.65 -> 0.92)
  const halftoneAlpha = interpolate(progress, [0.62, 0.90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vertical jagged torn paper edge paths
  const leftTornPath = `polygon(
    0% 0%, 52% 0%, 48% 12%, 53% 24%, 46% 36%, 54% 48%, 47% 60%, 53% 72%, 46% 84%, 52% 96%, 50% 100%, 0% 100%
  )`;

  const rightTornPath = `polygon(
    52% 0%, 100% 0%, 100% 100%, 50% 100%, 52% 96%, 46% 84%, 53% 72%, 47% 60%, 54% 48%, 46% 36%, 53% 24%, 48% 12%
  )`;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {/* Layer 0 (Underneath): Clip B */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Full color Clip B */}
        <OffthreadVideo volume={0}
          src={clipB}
          startFrom={startFromB}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Manga Halftone Overlay (B&W High Contrast + Dot Matrix) */}
        {halftoneAlpha > 0.01 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: halftoneAlpha,
              pointerEvents: "none",
            }}
          >
            {/* High-contrast B&W copy of Clip B */}
            <OffthreadVideo volume={0}
              src={clipB}
              startFrom={startFromB}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(100%) contrast(250%) brightness(1.15)",
              }}
            />
            {/* Comic Halftone Dot Pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, #000000 28%, transparent 29%)",
                backgroundSize: "14px 14px",
                mixBlendMode: "multiply",
                opacity: 0.75,
              }}
            />
          </div>
        )}
      </div>

      {/* Layer 1 (On Top): Left Torn Half of Clip A */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${leftShift}%)`,
          filter: "drop-shadow(10px 0 20px rgba(0,0,0,0.85))",
        }}
      >
        {/* White torn paper border on left piece */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: leftTornPath,
            backgroundColor: "#FFFFFF",
            boxShadow: "inset -8px 0 16px rgba(0,0,0,0.35)",
          }}
        />
        {/* Clip A content inside left piece */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `polygon(
              0% 0%, 50.5% 0%, 46.5% 12%, 51.5% 24%, 44.5% 36%, 52.5% 48%, 45.5% 60%, 51.5% 72%, 44.5% 84%, 50.5% 96%, 48.5% 100%, 0% 100%
            )`,
          }}
        >
          <OffthreadVideo volume={0}
            src={clipA}
            startFrom={startFromA}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Layer 2 (On Top): Right Torn Half of Clip A */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${rightShift}%)`,
          filter: "drop-shadow(-10px 0 20px rgba(0,0,0,0.85))",
        }}
      >
        {/* White torn paper border on right piece */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: rightTornPath,
            backgroundColor: "#FFFFFF",
            boxShadow: "inset 8px 0 16px rgba(0,0,0,0.35)",
          }}
        />
        {/* Clip A content inside right piece */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `polygon(
              53.5% 0%, 100% 0%, 100% 100%, 51.5% 100%, 53.5% 96%, 47.5% 84%, 54.5% 72%, 48.5% 60%, 55.5% 48%, 47.5% 36%, 54.5% 24%, 49.5% 12%
            )`,
          }}
        >
          <OffthreadVideo volume={0}
            src={clipA}
            startFrom={startFromA}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
