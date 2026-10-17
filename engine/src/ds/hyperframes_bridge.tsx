/**
 * HyperFrames Hybrid Bridge for All-in Studio.
 * Integrates the 5 Signature HyperFrames Mechanics into Remotion:
 * 1. <LiveCornerTicker>: Persistent top-right real-time stakes counter ticking up across the video.
 * 2. <AmbientBgMatrix>: Living 11x7 background wall of micro-widgets firing a radial wave on cue.
 * 3. <DotMatrixCounter>: 240 glowing crimson dots with a giant rolling counter morphing into banknote tiles.
 * 4. <InversionMorphBox>: White UI box with green check that ignites into crimson neon glow and morphs text.
 * 5. <BottomProgressHairline>: Glowing 4px crimson timeline progress bar along the bottom edge.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { mono, serif, hand, useCue } from './core';
import { COLOR_CRIMSON, COLOR_EMERALD, COLOR_INK, COLOR_IVORY, SHADOW_DEEP } from './psychology';

/**
 * 1. <LiveCornerTicker>:
 * Persistent top-right real-time stakes counter.
 * Ticks up continuously based on frame / fps * ratePerSecond + startVal.
 * When climaxAt is reached (or zoomCenter=true), it smoothly springs to center stage
 * with a dramatic focal callout: "WHILE YOU WATCHED THIS VIDEO...".
 */
export const LiveCornerTicker: React.FC<{
  label: string;
  ratePerSecond?: number;
  startVal?: number;
  climaxAt?: string | number;
  zoomCenter?: boolean;
  unit?: string;
}> = ({
  label,
  ratePerSecond = 1880,
  startVal = 420,
  climaxAt,
  zoomCenter = false,
  unit = '',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const cueF = useCue(climaxAt);
  const isClimax = zoomCenter || (cueF !== undefined && frame >= cueF);
  const climaxSp = isClimax
    ? spring({
        frame: frame - (cueF ?? 0),
        fps,
        config: { damping: 14, stiffness: 120, mass: 0.8 },
      })
    : 0;

  const seconds = frame / fps;
  const currentCount = Math.floor(startVal + seconds * ratePerSecond);
  const formattedCount = currentCount.toLocaleString();

  // Corner vs Center positioning interpolation
  const right = interpolate(climaxSp, [0, 1], [48, 960]);
  const top = interpolate(climaxSp, [0, 1], [28, 480]);
  const scale = interpolate(climaxSp, [0, 1], [1, 1.45]);

  return (
    <div
      style={{
        position: 'absolute',
        right: isClimax ? undefined : right,
        left: isClimax ? '50%' : undefined,
        top,
        transform: isClimax
          ? `translate(-50%, -50%) scale(${scale})`
          : 'none',
        zIndex: 50,
        pointerEvents: 'none',
        transition: 'all 0.1s ease-out',
      }}
    >
      <div
        style={{
          background: isClimax ? 'rgba(14,12,11,0.92)' : 'rgba(14,12,11,0.82)',
          border: `2px solid ${isClimax ? COLOR_CRIMSON : 'rgba(230,57,70,0.5)'}`,
          backdropFilter: 'blur(12px)',
          borderRadius: isClimax ? 20 : 12,
          padding: isClimax ? '20px 36px' : '8px 18px',
          boxShadow: isClimax
            ? `0 0 50px rgba(230,57,70,0.5), ${SHADOW_DEEP}`
            : '0 8px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isClimax ? 'center' : 'flex-end',
          gap: isClimax ? 8 : 2,
        }}
      >
        {/* Pulsing Live Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: COLOR_CRIMSON,
              boxShadow: `0 0 10px ${COLOR_CRIMSON}`,
              opacity: 0.6 + 0.4 * Math.sin(frame * 0.3),
            }}
          />
          <span
            style={{
              ...mono(isClimax ? 18 : 13, '#E2DDD2'),
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {isClimax ? 'WHILE YOU WATCHED THIS VIDEO' : label}
          </span>
        </div>

        {/* Big Stakes Number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              ...mono(isClimax ? 56 : 24, COLOR_CRIMSON),
              fontWeight: 900,
              letterSpacing: '0.04em',
              textShadow: `0 0 16px rgba(230,57,70,0.4)`,
            }}
          >
            {formattedCount}
          </span>
          {unit && (
            <span style={{ ...mono(isClimax ? 22 : 14, '#FAF6EE'), fontWeight: 700 }}>
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 2. <AmbientBgMatrix>:
 * Living 11x7 background wall of micro-widgets ([✓]) behind the hero card.
 * When the cue hits, fires a radial wave expanding outward from center.
 */
export const AmbientBgMatrix: React.FC<{
  cols?: number;
  rows?: number;
  at?: string | number;
  waveColor?: string;
  glyph?: string;
}> = ({
  cols = 11,
  rows = 7,
  at,
  waveColor = COLOR_EMERALD,
  glyph = '✓',
}) => {
  const frame = useCurrentFrame();
  const cueF = useCue(at) ?? 0;

  const centerCol = (cols - 1) / 2;
  const centerRow = (rows - 1) / 2;
  const maxDist = Math.hypot(centerCol, centerRow);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        pointerEvents: 'none',
        zIndex: 2,
        padding: '60px 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: cols * rows }).map((_, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const dist = Math.hypot(c - centerCol, r - centerRow);
        const normDist = dist / maxDist;

        // Wave propagation
        const waveElapsed = frame - cueF;
        const waveSpeed = 2.4; // frames per unit distance
        const hitFrame = dist * waveSpeed;
        const isHit = waveElapsed >= hitFrame && waveElapsed < hitFrame + 18;
        const waveProgress = isHit ? (waveElapsed - hitFrame) / 18 : 0;

        const activeOpacity = isHit
          ? 0.15 + (1 - waveProgress) * 0.75
          : 0.12 + 0.05 * Math.sin(frame * 0.1 + dist);

        const activeScale = isHit ? 1 + (1 - waveProgress) * 0.35 : 1;
        const activeColor = isHit ? waveColor : '#6B6357';

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1.5px solid ${activeColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: activeOpacity,
                transform: `scale(${activeScale})`,
                ...mono(16, activeColor),
                fontWeight: 800,
                transition: 'border-color 0.1s, color 0.1s',
                boxShadow: isHit ? `0 0 12px ${waveColor}` : 'none',
              }}
            >
              {glyph}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * 3. <DotMatrixCounter>:
 * 240 glowing crimson dots (1 DOT = 1 UNIT) in a crisp matrix,
 * paired with a 116px bold rolling counter that morphs into [$—] banknote tiles on cue.
 */
export const DotMatrixCounter: React.FC<{
  count?: number;
  cols?: number;
  at?: string | number;
  morphAt?: string | number;
  label?: string;
  unit?: string;
}> = ({
  count = 240,
  cols = 24,
  at,
  morphAt,
  label = 'SYSTEM CAPABILITY LEVEL',
  unit = 'UNITS',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterF = useCue(at) ?? 0;
  const morphF = useCue(morphAt) ?? 30;

  const enterSp = frame >= enterF ? spring({ frame: frame - enterF, fps, config: { damping: 14, stiffness: 130 } }) : 0;
  const morphSp = frame >= morphF ? spring({ frame: frame - morphF, fps, config: { damping: 14, stiffness: 140 } }) : 0;

  const rows = Math.ceil(count / cols);
  const activeCount = Math.floor(count * Math.min(1, enterSp));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        width: '100%',
      }}
    >
      {/* 116px Rolling Focal Number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span
          style={{
            ...mono(116, morphSp > 0.4 ? COLOR_CRIMSON : COLOR_INK),
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {morphSp > 0.4 ? `$${activeCount * 12}` : activeCount}
        </span>
        <span style={{ ...mono(28, COLOR_CRIMSON), fontWeight: 800 }}>
          {morphSp > 0.4 ? 'USD CHARGE' : unit}
        </span>
      </div>

      <div style={{ ...serif(22, '#555555'), fontWeight: 700 }}>{label}</div>

      {/* 240 Dot Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 8,
          background: '#FFFFFF',
          padding: '24px 30px',
          borderRadius: 16,
          boxShadow: SHADOW_DEEP,
          border: '2px solid #E2DDD2',
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const isLit = i < activeCount;
          const isMorphed = morphSp > 0.3;
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: isMorphed ? 2 : '50%',
                background: isLit
                  ? isMorphed
                    ? COLOR_CRIMSON
                    : COLOR_EMERALD
                  : '#E2DDD2',
                boxShadow: isLit
                  ? `0 0 8px ${isMorphed ? COLOR_CRIMSON : COLOR_EMERALD}`
                  : 'none',
                transform: isLit ? `scale(${isMorphed ? 1.2 : 1})` : 'scale(0.8)',
                transition: 'all 0.15s ease-out',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * 4. <InversionMorphBox>:
 * Familiar white UI box with green check that ignites into crimson neon glow
 * while text morphs from benign claim into dark reality.
 */
export const InversionMorphBox: React.FC<{
  originalText: string;
  invertedText: string;
  at?: string | number;
  width?: number;
  height?: number;
}> = ({
  originalText,
  invertedText,
  at,
  width = 680,
  height = 140,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueF = useCue(at) ?? 20;
  const p = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 150 } }) : 0;
  const isInverted = p > 0.45;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: '#FFFFFF',
        borderRadius: 18,
        border: `3px solid ${isInverted ? COLOR_CRIMSON : COLOR_EMERALD}`,
        boxShadow: isInverted
          ? `0 0 35px rgba(230,57,70,0.5), ${SHADOW_DEEP}`
          : SHADOW_DEEP,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 22,
        transform: `scale(${1 + 0.05 * Math.sin(p * Math.PI)})`,
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: isInverted ? 'rgba(230,57,70,0.14)' : 'rgba(46,159,110,0.14)',
          border: `2px solid ${isInverted ? COLOR_CRIMSON : COLOR_EMERALD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...mono(28, isInverted ? COLOR_CRIMSON : COLOR_EMERALD),
          fontWeight: 900,
        }}
      >
        {isInverted ? '✗' : '✓'}
      </div>

      {/* Morphing Text Statement */}
      <div style={{ flex: 1 }}>
        <div style={{ ...mono(14, isInverted ? COLOR_CRIMSON : COLOR_EMERALD), fontWeight: 800 }}>
          {isInverted ? 'ALGORITHMIC REALITY' : 'SURFACE UI STATUS'}
        </div>
        <div
          style={{
            ...serif(28, isInverted ? COLOR_CRIMSON : COLOR_INK, 800),
            marginTop: 2,
          }}
        >
          {isInverted ? invertedText : originalText}
        </div>
      </div>
    </div>
  );
};

/**
 * 5. <BottomProgressHairline>:
 * Glowing 4px crimson timeline progress bar along the bottom edge of the 1920x1080 frame.
 */
export const BottomProgressHairline: React.FC<{
  color?: string;
  height?: number;
}> = ({
  color = COLOR_CRIMSON,
  height = 4,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames)));
  const widthPct = `${(progress * 100).toFixed(2)}%`;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height,
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
        zIndex: 90,
      }}
    >
      <div
        style={{
          width: widthPct,
          height: '100%',
          background: color,
          boxShadow: `0 -2px 10px ${color}, 0 0 20px ${color}`,
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
};
