import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { Caption } from '../edl-types';
import { DISPLAY_FONT, VI_SAFE_LINE_HEIGHT, VI_DIACRITIC_PAD } from '../fonts';
import { useStyle } from '../style-context';

const SafeZoneWrapper: React.FC<{
  position?: 'top' | 'bottom' | 'headline';
  children: React.ReactNode;
}> = ({ position = 'top', children }) => {
  const isBottom = position === 'bottom';
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: isBottom ? 'auto' : 0,
        bottom: isBottom ? 0 : 'auto',
        left: 0,
        right: 0,
        height: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 36px',
        zIndex: 20,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Calculates audio-synced frame delay for punchline keyword:
 * 1. If cap.keywordStartMs is provided: delayMs = keywordStartMs - startMs
 * 2. Else scans cap.tokens matching the first word of keyword
 * 3. Falls back to fallbackFrames (e.g. 5-7 frames) if not found or at start
 */
export const getKeywordDelayFrames = (cap: Caption, fps: number, fallbackFrames = 0): number => {
  if (cap.keywordStartMs != null && cap.keywordStartMs >= cap.startMs) {
    const delayMs = cap.keywordStartMs - cap.startMs;
    return Math.max(0, Math.round((delayMs / 1000) * fps));
  }
  const kw = (cap.keyword || cap.highlightWord || "").trim().toLowerCase();
  if (kw && cap.tokens && cap.tokens.length > 0) {
    const kwWords = kw.split(/\s+/).map((w) => w.replace(/[^a-z0-9à-ỹ]/g, "")).filter(Boolean);
    if (kwWords.length > 0) {
      const targetWord = kwWords[0];
      const matchToken = cap.tokens.find((t) => {
        const clean = t.text.toLowerCase().replace(/[^a-z0-9à-ỹ]/g, "");
        return clean === targetWord;
      });
      if (matchToken && matchToken.fromMs >= cap.startMs) {
        const delayMs = matchToken.fromMs - cap.startMs;
        return Math.max(0, Math.round((delayMs / 1000) * fps));
      }
    }
  }
  return fallbackFrames;
};

/**
 * 1. GlowAmbientHeadline (thuy-style-oneshot adaptation)
 * Massive floating topic/year/keyword centered cleanly in top 30% safe zone.
 * Clean, bold typography with solid crisp black stroke & shadow. No blurry bloom.
 */
export const GlowAmbientHeadline: React.FC<{
  cap: Caption;
  position?: 'top' | 'bottom' | 'headline';
  accent?: string;
}> = ({ cap, position = 'top', accent = '#FFE600' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const pop = spring({
    frame,
    fps,
    config: { damping: 11, mass: 0.45, stiffness: 170 },
  });
  const scale = interpolate(pop, [0, 1], [0.82, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  const mainText = (cap.keyword || cap.header || cap.text || '2026°').trim();
  const subText = (cap.sub || '').trim();
  const fontSize = Math.min(180, Math.max(90, 1800 / Math.max(10, mainText.length))) * recipe.textScale;

  return (
    <SafeZoneWrapper position={position}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'scale(' + scale + ')',
          opacity,
          maxWidth: 960,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize,
            fontWeight: 950,
            letterSpacing: '-0.01em',
            color: '#FFE600',
            textTransform: 'uppercase',
            lineHeight: 1.02,
            paddingTop: VI_DIACRITIC_PAD,
            textShadow:
              '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)',
          }}
        >
          {mainText}
        </div>
        {subText ? (
          <div
            style={{
              marginTop: 12,
              fontFamily: DISPLAY_FONT,
              fontSize: 44 * recipe.textScale,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              textShadow: '0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)',
            }}
          >
            {subText}
          </div>
        ) : null}
      </div>
    </SafeZoneWrapper>
  );
};

/**
 * 2. AsymmetricTrioHeadline (thuy-style-oneshot adaptation)
 * 3-part layout: Left giant lead (White) + Mid phrase (White sentence-case) + Right climax (Vibrant Yellow #FFE600).
 * Crisp black stroke, high contrast readability.
 */
export const AsymmetricTrioHeadline: React.FC<{
  cap: Caption;
  position?: 'top' | 'bottom' | 'headline';
  accent?: string;
  highlight?: string;
}> = ({ cap, position = 'top', accent = '#FF6B00', highlight = '#FFE600' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const leftPop = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.38, stiffness: 220 },
  });
  const leftScale = interpolate(leftPop, [0, 1], [0.65, 1]);
  const leftOpacity = interpolate(leftPop, [0, 1], [0, 1]);

  const midFrame = Math.max(0, frame - 3);
  const midPop = spring({
    frame: midFrame,
    fps,
    config: { damping: 12, mass: 0.45, stiffness: 180 },
  });
  const midY = interpolate(midPop, [0, 1], [18, 0]);
  const midOpacity = interpolate(midPop, [0, 1], [0, 1]);

  const kwDelayFrames = getKeywordDelayFrames(cap, fps, 6);
  const rightFrame = frame - kwDelayFrames;
  const isRightActive = rightFrame >= 0;
  const rightPop = isRightActive
    ? spring({
        frame: rightFrame,
        fps,
        config: { damping: 9, mass: 0.35, stiffness: 250 },
      })
    : 0;
  const rightScale = isRightActive ? interpolate(rightPop, [0, 1], [1.25, 1]) : 0.8;
  const rightOpacity = isRightActive ? interpolate(rightPop, [0, 1], [0, 1]) : 0;

  const rawText = (cap.text || '').trim();
  let leftText = (cap.header || '').trim();
  let midText = (cap.sub || '').trim();
  let rightText = (cap.keyword || '').trim();

  if (!leftText || !rightText) {
    const words = rawText.split(/\s+/);
    if (words.length >= 3) {
      leftText = leftText || words[0];
      rightText = rightText || words.slice(-2).join(' ');
      midText = midText || words.slice(1, -2).join(' ') || words.slice(1, -1).join(' ');
    } else {
      leftText = leftText || 'LÀM';
      midText = midText || 'thế nào để được';
      rightText = rightText || 'GIẢM KIỂM TRA';
    }
  }

  return (
    <SafeZoneWrapper position={position}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px 18px',
          maxWidth: 980,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: 'scale(' + leftScale + ')',
            opacity: leftOpacity,
            fontFamily: DISPLAY_FONT,
            fontSize: 88 * recipe.textScale,
            fontWeight: 950,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            letterSpacing: '0.01em',
            lineHeight: 1.05,
            textShadow:
              '0 4px 18px rgba(0,0,0,0.85), 0 10px 32px rgba(0,0,0,0.95)',
          }}
        >
          {leftText}
        </div>
        <div
          style={{
            transform: 'translateY(' + midY + 'px)',
            opacity: midOpacity,
            fontFamily: DISPLAY_FONT,
            fontSize: 42 * recipe.textScale,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            textShadow: '0 3px 14px rgba(0,0,0,0.9), 0 6px 22px rgba(0,0,0,0.85)',
            maxWidth: 320,
          }}
        >
          {midText}
        </div>
        <div
          style={{
            transform: 'scale(' + rightScale + ')',
            opacity: rightOpacity,
            fontFamily: DISPLAY_FONT,
            fontSize: 92 * recipe.textScale,
            fontWeight: 950,
            textTransform: 'uppercase',
            color: '#FFE600',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            textShadow:
              '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)',
          }}
        >
          {rightText}
        </div>
      </div>
    </SafeZoneWrapper>
  );
};

/**
 * 3. StackedContrastHeadline (thuy-style-oneshot adaptation)
 * 2-tier stacked contrast: Top line modifier (White sentence-case) + Bottom power keyword (Vibrant Yellow #FFE600).
 * Crisp black stroke, high contrast readability.
 */
export const StackedContrastHeadline: React.FC<{
  cap: Caption;
  position?: 'top' | 'bottom' | 'headline';
  accent?: string;
  highlight?: string;
}> = ({ cap, position = 'top', accent = '#FF6B00', highlight = '#FFE600' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const topPop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.45, stiffness: 180 },
  });
  const topY = interpolate(topPop, [0, 1], [-20, 0]);
  const topOpacity = interpolate(topPop, [0, 1], [0, 1]);

  const kwDelayFrames = getKeywordDelayFrames(cap, fps, 5);
  const bottomFrame = frame - kwDelayFrames;
  const isBottomActive = bottomFrame >= 0;
  const bottomPop = isBottomActive
    ? spring({
        frame: bottomFrame,
        fps,
        config: { damping: 9, mass: 0.36, stiffness: 230 },
      })
    : 0;
  const bottomScale = isBottomActive ? interpolate(bottomPop, [0, 1], [0.82, 1]) : 0.8;
  const bottomOpacity = isBottomActive ? interpolate(bottomPop, [0, 1], [0, 1]) : 0;

  const topText = (cap.header || cap.sub || 'quy định trong').trim();
  const bottomText = (cap.keyword || cap.text || 'NGHỊ ĐỊNH 37').trim();

  return (
    <SafeZoneWrapper position={position}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          maxWidth: 960,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: 'translateY(' + topY + 'px)',
            opacity: topOpacity,
            fontFamily: DISPLAY_FONT,
            fontSize: 48 * recipe.textScale,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: VI_SAFE_LINE_HEIGHT,
            paddingTop: VI_DIACRITIC_PAD,
            textShadow: '0 4px 16px rgba(0,0,0,0.9)',
          }}
        >
          {topText}
        </div>
        <div
          style={{
            transform: 'scale(' + bottomScale + ')',
            opacity: bottomOpacity,
            fontFamily: DISPLAY_FONT,
            fontSize: 108 * recipe.textScale,
            fontWeight: 950,
            textTransform: 'uppercase',
            color: '#FFE600',
            letterSpacing: '0.03em',
            lineHeight: 1.08,
            textShadow:
              '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)',
          }}
        >
          {bottomText}
        </div>
      </div>
    </SafeZoneWrapper>
  );
};

/**
 * 4. MultiBlockFlowHeadline (thuy-style-oneshot adaptation)
 * 3-block staggered flow: Top lead (White) + Connector (White sentence-case) + Climax (Vibrant Yellow #FFE600).
 * Crisp black stroke, high contrast readability.
 */
export const MultiBlockFlowHeadline: React.FC<{
  cap: Caption;
  position?: 'top' | 'bottom' | 'headline';
  accent?: string;
  highlight?: string;
}> = ({ cap, position = 'top', accent = '#FF6B00', highlight = '#FFE600' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recipe = useStyle();

  const topPop = spring({
    frame,
    fps,
    config: { damping: 11, mass: 0.4, stiffness: 200 },
  });
  const topScale = interpolate(topPop, [0, 1], [0.75, 1]);
  const topOpacity = interpolate(topPop, [0, 1], [0, 1]);

  const midFrame = Math.max(0, frame - 4);
  const midPop = spring({
    frame: midFrame,
    fps,
    config: { damping: 12, mass: 0.45, stiffness: 180 },
  });
  const midX = interpolate(midPop, [0, 1], [-25, 0]);
  const midOpacity = interpolate(midPop, [0, 1], [0, 1]);

  const kwDelayFrames = getKeywordDelayFrames(cap, fps, 7);
  const climaxFrame = frame - kwDelayFrames;
  const isClimaxActive = climaxFrame >= 0;
  const climaxPop = isClimaxActive
    ? spring({
        frame: climaxFrame,
        fps,
        config: { damping: 9, mass: 0.35, stiffness: 240 },
      })
    : 0;
  const climaxScale = isClimaxActive ? interpolate(climaxPop, [0, 1], [1.25, 1]) : 0.8;
  const climaxOpacity = isClimaxActive ? interpolate(climaxPop, [0, 1], [0, 1]) : 0;

  const topText = (cap.header || 'HẠ XUỐNG').trim();
  const connectorText = (cap.sub || 'chỉ còn').trim();
  const climaxText = (cap.keyword || 'RỦI RO TRUNG BÌNH').trim();

  return (
    <SafeZoneWrapper position={position}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          maxWidth: 960,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: 'scale(' + topScale + ')',
            opacity: topOpacity,
            fontFamily: DISPLAY_FONT,
            fontSize: 78 * recipe.textScale,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            textShadow:
              '0 4px 18px rgba(0,0,0,0.85), 0 10px 32px rgba(0,0,0,0.95)',
          }}
        >
          {topText}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px 22px',
          }}
        >
          <div
            style={{
              transform: 'translateX(' + midX + 'px)',
              opacity: midOpacity,
              fontFamily: DISPLAY_FONT,
              fontSize: 46 * recipe.textScale,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: VI_SAFE_LINE_HEIGHT,
              paddingTop: VI_DIACRITIC_PAD,
              textShadow: '0 3px 14px rgba(0,0,0,0.9), 0 6px 22px rgba(0,0,0,0.85)',
            }}
          >
            {connectorText}
          </div>
          <div
            style={{
              transform: 'scale(' + climaxScale + ')',
              opacity: climaxOpacity,
              fontFamily: DISPLAY_FONT,
              fontSize: 96 * recipe.textScale,
              fontWeight: 950,
              textTransform: 'uppercase',
              color: '#FFE600',
              letterSpacing: '0.02em',
              lineHeight: 1.06,
              textShadow:
                '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)',
            }}
          >
            {climaxText}
          </div>
        </div>
      </div>
    </SafeZoneWrapper>
  );
};