/**
 * Game-Feel / "Juice" Motion Physics Engine for All-in Studio.
 * Inspired by @motionbykrit's signature physical breakdowns:
 * 1. Dash Physics: Wind-up anticipation, heavy squash & stretch, streaky speed lines, overshoot.
 * 2. Satisfying Pickups & Counters: Radial particle bursts, shockwave rings, floating pop-up badges, scale punch.
 * 3. Epic Reveal Physics: Anticipation tremble, volumetric god-rays, 3D extruded toy depth, specular sheen sweep.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { getStroke } from 'perfect-freehand';
import { mono, serif, hand, useCue } from './core';

import { SHADOW_DEEP, COLOR_CRIMSON, COLOR_EMERALD, COLOR_IVORY, COLOR_INK } from './psychology';
export const COLOR_GOLD = '#F4A261';

function strokeToSvgPath(stroke: number[][]): string {
  if (!stroke.length) return '';
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );
  d.push('Z');
  return d.join(' ');
}

export type GameFeelPhysics = {
  frame: number;
  triggerFrame: number;
  isHit: boolean;
  windup: boolean;
  hitFlash: boolean;
  rattleX: number;
  rattleY: number;
  shakeX: number;
  shakeY: number;
  scaleX: number;
  scaleY: number;
  burstProgress: number;
};

/**
 * 1. useGameFeelPhysics:
 * Core physics hook implementing Anticipation Windup -> Impact Hit -> Squash/Stretch -> Rebound Camera Shake.
 */
export function useGameFeelPhysics(triggerFrame: number, duration: number = 24): GameFeelPhysics {
  const frame = useCurrentFrame();

  // 1. Idle phase
  if (frame < triggerFrame - 6) {
    return {
      frame,
      triggerFrame,
      isHit: false,
      windup: false,
      hitFlash: false,
      rattleX: 0,
      rattleY: 0,
      shakeX: 0,
      shakeY: 0,
      scaleX: 1,
      scaleY: 1,
      burstProgress: 0,
    };
  }

  // 2. Anticipation Wind-up (-6 to -1 frames before hit)
  if (frame < triggerFrame) {
    const dt = frame - (triggerFrame - 6);
    const rattleX = Math.sin(dt * 3.2) * 3.5;
    const rattleY = Math.cos(dt * 3.8) * 2.5;
    return {
      frame,
      triggerFrame,
      isHit: false,
      windup: true,
      hitFlash: false,
      rattleX,
      rattleY,
      shakeX: 0,
      shakeY: 0,
      scaleX: 0.94,
      scaleY: 0.94,
      burstProgress: 0,
    };
  }

  // 3. Impact Hit frame
  if (frame === triggerFrame) {
    return {
      frame,
      triggerFrame,
      isHit: true,
      windup: false,
      hitFlash: true,
      rattleX: 0,
      rattleY: 0,
      shakeX: 0,
      shakeY: 0,
      scaleX: 1.28, // heavy squash in X
      scaleY: 0.76, // heavy compress in Y
      burstProgress: 0.05,
    };
  }

  // 4. Spring Rebound & Camera Shake (triggerFrame + 1 to +14)
  const elapsed = frame - triggerFrame;
  const burstProgress = Math.min(1, elapsed / duration);

  if (elapsed < 14) {
    const decay = (14 - elapsed) / 14;
    const shakeX = Math.sin(elapsed * 1.8) * 8.5 * decay;
    const shakeY = Math.cos(elapsed * 2.2) * 6.5 * decay;
    // Stretch rebound settling back to 1.0
    const scaleX = 0.88 + 0.12 * (1 - decay);
    const scaleY = 1.15 - 0.15 * (1 - decay);
    return {
      frame,
      triggerFrame,
      isHit: true,
      windup: false,
      hitFlash: elapsed <= 2,
      rattleX: 0,
      rattleY: 0,
      shakeX,
      shakeY,
      scaleX,
      scaleY,
      burstProgress,
    };
  }

  // 5. Settled Phase
  return {
    frame,
    triggerFrame,
    isHit: true,
    windup: false,
    hitFlash: false,
    rattleX: 0,
    rattleY: 0,
    shakeX: 0,
    shakeY: 0,
    scaleX: 1,
    scaleY: 1,
    burstProgress,
  };
}

/**
 * Helper hook to resolve cue word or numeric frame to game-feel physics.
 */
export function useGameFeelCue(cue?: string | number, defaultFrame: number = 0, duration: number = 24): GameFeelPhysics {
  const triggerFrame = useCue(cue) ?? defaultFrame;
  return useGameFeelPhysics(triggerFrame, duration);
}

/**
 * 2. <ImpactBurst>:
 * Radial star/diamond particles flying outward + 2 expanding shockwave rings with thinning & opacity decay.
 */
export const ImpactBurst: React.FC<{
  cx: number;
  cy: number;
  at?: string | number;
  color?: string;
  count?: number;
  radius?: number;
}> = ({ cx, cy, at, color = COLOR_CRIMSON, count = 14, radius = 190 }) => {
  const triggerFrame = useCue(at) ?? 0;
  const physics = useGameFeelPhysics(triggerFrame, 22);

  if (!physics.isHit || physics.burstProgress >= 1) return null;

  const p = physics.burstProgress;
  const easeOut = 1 - Math.pow(1 - p, 3);

  // Shockwave 1
  const r1 = 12 + radius * 0.82 * easeOut;
  const op1 = Math.max(0, (1 - p) * 0.92);
  const sw1 = Math.max(0.5, 5 * (1 - p));

  // Shockwave 2 (delayed slightly)
  const p2 = Math.max(0, (p - 0.12) / 0.88);
  const r2 = 6 + radius * 1.12 * (1 - Math.pow(1 - p2, 2.5));
  const op2 = Math.max(0, (1 - p2) * 0.65);
  const sw2 = Math.max(0.5, 3.5 * (1 - p2));

  // 14 Diamond / Star particles
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + ((i % 3) * 0.2);
    const distFactor = 0.65 + 0.5 * (((i * 7) % 5) / 4);
    const dist = radius * distFactor * easeOut;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    const size = Math.max(2, (10 + (i % 4) * 3) * (1 - p));
    const rot = i * 36 + p * 190;
    const op = Math.max(0, (1 - p * p) * 0.95);
    return { px, py, size, rot, op };
  });

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 35,
      }}
    >
      {/* Shockwave Rings */}
      <circle cx={cx} cy={cy} r={r1} fill="none" stroke={color} strokeWidth={sw1} opacity={op1} />
      {p > 0.12 && (
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke={color} strokeWidth={sw2} opacity={op2} strokeDasharray="6 6" />
      )}

      {/* Radial Diamond Particles */}
      {particles.map((pt, idx) => (
        <polygon
          key={idx}
          points={`0,-${pt.size} ${pt.size * 0.65},0 0,${pt.size} -${pt.size * 0.65},0`}
          fill={idx % 2 === 0 ? color : '#FFFFFF'}
          opacity={pt.op}
          transform={`translate(${pt.px}, ${pt.py}) rotate(${pt.rot})`}
        />
      ))}
    </svg>
  );
};

/**
 * 3. <VolumetricGodRays>:
 * Rotating conic light beams bursting from behind the card / focal object on cue.
 */
export const VolumetricGodRays: React.FC<{
  cx: number;
  cy: number;
  at?: string | number;
  rays?: number;
  color?: string;
  maxRadius?: number;
}> = ({ cx, cy, at, rays = 12, color = 'rgba(255, 235, 180, 0.14)', maxRadius = 480 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 0;

  const reveal = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 120 } }) : 0;
  if (reveal <= 0.02) return null;

  const rot = (frame / fps) * 18; // continuous slow Majestic rotation
  const step = 360 / rays;
  const rayList = Array.from({ length: rays }, (_, i) => {
    const angle1 = (i * step * Math.PI) / 180;
    const angle2 = ((i * step + step * 0.45) * Math.PI) / 180;
    const x1 = cx + Math.cos(angle1) * maxRadius;
    const y1 = cy + Math.sin(angle1) * maxRadius;
    const x2 = cx + Math.cos(angle2) * maxRadius;
    const y2 = cy + Math.sin(angle2) * maxRadius;
    return `M${cx},${cy} L${x1},${y1} A${maxRadius},${maxRadius} 0 0,1 ${x2},${y2} Z`;
  });

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        transform: `rotate(${rot}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
        opacity: reveal,
      }}
    >
      <defs>
        <radialGradient id={`godrays-fade-${cx}-${cy}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <mask id={`godrays-mask-${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={maxRadius} fill={`url(#godrays-fade-${cx}-${cy})`} />
        </mask>
      </defs>
      <g mask={`url(#godrays-mask-${cx}-${cy})`}>
        {rayList.map((d, idx) => (
          <path key={idx} d={d} fill={color} />
        ))}
      </g>
    </svg>
  );
};

/**
 * 4. <SpeedLines>:
 * High-velocity dash streak lines when an object dashes or collides.
 */
export const SpeedLines: React.FC<{
  direction?: 'horizontal' | 'vertical';
  count?: number;
  at?: string | number;
  color?: string;
  width?: number;
  height?: number;
}> = ({ direction = 'horizontal', count = 16, at, color = 'rgba(230,57,70,0.32)', width = 1920, height = 1080 }) => {
  const frame = useCurrentFrame();
  const cueF = useCue(at) ?? 0;

  if (frame < cueF || frame > cueF + 22) return null;

  const elapsed = frame - cueF;
  const p = elapsed / 22;
  const opacity = Math.sin(p * Math.PI) * 0.9;

  const lines = Array.from({ length: count }, (_, i) => {
    const seed = (i * 137.5) % 1;
    const pos = (i / count) * (direction === 'horizontal' ? height : width);
    const len = 120 + seed * 260;
    const start = (direction === 'horizontal' ? width : height) * (1 - p * 1.4) + seed * 80;
    return { pos, len, start, strokeW: 2 + (i % 3) * 1.5 };
  });

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 25,
        opacity,
      }}
    >
      {lines.map((ln, idx) => {
        if (direction === 'horizontal') {
          return (
            <line
              key={idx}
              x1={ln.start}
              y1={ln.pos}
              x2={ln.start + ln.len}
              y2={ln.pos}
              stroke={color}
              strokeWidth={ln.strokeW}
              strokeLinecap="round"
            />
          );
        } else {
          return (
            <line
              key={idx}
              x1={ln.pos}
              y1={ln.start}
              x2={ln.pos}
              y2={ln.start + ln.len}
              stroke={color}
              strokeWidth={ln.strokeW}
              strokeLinecap="round"
            />
          );
        }
      })}
    </svg>
  );
};

/**
 * 5. <FloatingPopScore>:
 * Spring-mass popup badge (+3 SHARDS!, 0.2s TRASHED!, 4.5× PRICE!) with scale punch and upward drift.
 */
export const FloatingPopScore: React.FC<{
  text: string;
  cx: number;
  cy: number;
  at?: string | number;
  color?: string;
  subtext?: string;
  rotation?: number;
}> = ({ text, cx, cy, at, color = COLOR_CRIMSON, subtext, rotation = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 0;

  if (frame < cueF) return null;

  const pop = spring({ frame: frame - cueF, fps, config: { damping: 11, stiffness: 180, mass: 0.65 } });
  if (pop <= 0.02) return null;

  // Scale punch: 0 -> 1.32 overshoot -> settling to 1.0
  const scale = interpolate(pop, [0, 0.6, 1], [0.2, 1.32, 1.0]);
  const elapsed = frame - cueF;
  const floatUp = Math.min(28, elapsed * 1.2);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy - floatUp,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: color,
          color: '#FFFFFF',
          padding: '10px 24px',
          borderRadius: 14,
          border: '3px solid #111111',
          boxShadow: SHADOW_DEEP,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <span style={{ ...mono(22, '#FFFFFF'), fontWeight: 900, letterSpacing: '0.04em', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
          {text}
        </span>
        {subtext && (
          <span style={{ ...serif(14, 'rgba(255,255,255,0.92)', 700), marginTop: -2 }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * 6. <DoodleUnderline>:
 * Hand-drawn pressure-sensitive double-stroke underline using perfect-freehand.
 */
export const DoodleUnderline: React.FC<{
  x: number;
  y: number;
  width: number;
  at?: string | number;
  color?: string;
  strokeWidth?: number;
}> = ({ x, y, width, at, color = COLOR_CRIMSON, strokeWidth = 7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 0;

  const p = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  if (p <= 0.02) return null;

  // Primary expressive underline stroke
  const points1: [number, number, number][] = [];
  const steps1 = 28;
  const curSteps1 = Math.max(3, Math.floor(steps1 * Math.min(1, p)));
  for (let i = 0; i <= curSteps1; i++) {
    const t = i / steps1;
    const px = x + t * width;
    const py = y + Math.sin(t * Math.PI) * 5 + (t * 2);
    const pressure = 0.4 + 0.35 * Math.sin(t * Math.PI);
    points1.push([px, py, pressure]);
  }
  const outline1 = getStroke(points1, { size: strokeWidth, thinning: 0.35, smoothing: 0.65, streamline: 0.5 });
  const path1 = strokeToSvgPath(outline1);

  // Secondary offset stroke (double-marker underline)
  const p2 = frame >= cueF + 4 ? spring({ frame: frame - (cueF + 4), fps, config: { damping: 14, stiffness: 140 } }) : 0;
  let path2 = '';
  if (p2 > 0.02) {
    const points2: [number, number, number][] = [];
    const steps2 = 24;
    const curSteps2 = Math.max(3, Math.floor(steps2 * Math.min(1, p2)));
    for (let i = 0; i <= curSteps2; i++) {
      const t = i / steps2;
      const px = x + t * (width * 0.92);
      const py = y + 7 + Math.sin(t * Math.PI) * 4;
      const pressure = 0.35 + 0.3 * Math.sin(t * Math.PI);
      points2.push([px, py, pressure]);
    }
    const outline2 = getStroke(points2, { size: strokeWidth * 0.8, thinning: 0.4, smoothing: 0.65, streamline: 0.5 });
    path2 = strokeToSvgPath(outline2);
  }

  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}>
      <path d={path1} fill={color} opacity={0.94} />
      {path2 && <path d={path2} fill={color} opacity={0.78} />}
    </svg>
  );
};

/**
 * 7. <SpecularSheen>:
 * Diagonal glossy specular highlight sweep across tactile surfaces on reveal or impact.
 */
export const SpecularSheen: React.FC<{
  at?: string | number;
  width?: number | string;
  height?: number | string;
}> = ({ at, width = '100%', height = '100%' }) => {
  const frame = useCurrentFrame();
  const cueF = useCue(at) ?? 0;

  if (frame < cueF || frame > cueF + 24) return null;

  const elapsed = frame - cueF;
  const p = elapsed / 24;
  const left = interpolate(p, [0, 1], [-120, 240]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -50,
          left: `${left}%`,
          width: 80,
          height: '200%',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(25deg)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};

/**
 * 8. <Tactile3DBlock>:
 * Chunky toy-like card with thick 3D extruded lip, spring press-down, specular sheen sweep, and white hit-flash.
 */
export const Tactile3DBlock: React.FC<{
  width: number;
  height: number;
  bg?: string;
  lipColor?: string;
  at?: string | number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  elevation?: number;
}> = ({
  width,
  height,
  bg = COLOR_IVORY,
  lipColor = '#DDD7CC',
  at,
  children,
  style,
  elevation = 11,
}) => {
  const triggerFrame = useCue(at) ?? 0;
  const physics = useGameFeelPhysics(triggerFrame, 24);

  // When hit, block presses down by elevation - 3px, then rebounds
  const pressY = physics.isHit && (physics.frame - triggerFrame < 6) ? elevation - 3 : 0;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: bg,
        borderRadius: 20,
        border: '3px solid #111111',
        boxShadow: `0 ${elevation - pressY}px 0 ${lipColor}, 0 24px 50px rgba(0,0,0,0.62)`,
        transform: `translate(${physics.shakeX + physics.rattleX}px, ${physics.shakeY + physics.rattleY + pressY}px) scale(${physics.scaleX}, ${physics.scaleY})`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Specular Sheen Sweep on Impact */}
      {physics.isHit && <SpecularSheen at={triggerFrame + 4} />}

      {/* Impact Hit Flash Overlay */}
      {physics.hitFlash && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: '#FFFFFF',
            opacity: 0.65,
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}

      {children}
    </div>
  );
};
