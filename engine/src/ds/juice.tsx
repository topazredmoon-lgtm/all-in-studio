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

export function useAnticipationSnap(delayFrames = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delayFrames);
  return spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.8 },
  });
}

export const SquishSpringWrapper: React.FC<{
  delay?: number;
  children: React.ReactNode;
}> = ({ delay = 0, children }) => {
  const snap = useAnticipationSnap(delay);
  const scale = interpolate(snap, [0, 1], [0.92, 1]);
  const opacity = interpolate(snap, [0, 0.4, 1], [0, 1, 1]);
  return (
    <div style={{ transform: `scale(${scale})`, opacity, overflow: "visible" }}>
      {children}
    </div>
  );
};

export const Tactile3DBlock: React.FC<{
  color?: string;
  bg?: string;
  borderColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  depth?: number;
  sheenAt?: string | number;
  lipColor?: string;
  elevation?: number;
  at?: string | number;
}> = ({ color = "#181512", bg = "#FFFFFF", borderColor = "#181512", children, style, width, height }) => (
  <div
    style={{
      backgroundColor: bg,
      color,
      border: `3px solid ${borderColor}`,
      borderRadius: 18,
      boxShadow: `0 8px 0 ${borderColor}`,
      padding: "24px 28px",
      boxSizing: "border-box",
      overflow: "visible",
      width,
      height,
      ...style,
    }}
  >
    {children}
  </div>
);

export const FloatingPopScore: React.FC<{
  text?: string;
  label?: string;
  score?: string;
  color?: string;
  delay?: number;
  at?: string | number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  style?: React.CSSProperties;
}> = ({ text, label, score, color = "#E63946", delay = 6, at, x, y, cx, cy, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? delay;
  if (frame < cueF) return null;
  const localFrame = frame - cueF;
  const snap = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });
  const scale = interpolate(snap, [0, 1], [0.85, 1]);
  const content = text || label || score || "";

  const posX = typeof x === "number" ? x : cx;
  const posY = typeof y === "number" ? y : cy;
  const isPos = typeof posX === "number" && typeof posY === "number";

  return (
    <div
      style={{
        position: isPos ? "absolute" : "relative",
        left: isPos ? posX : undefined,
        top: isPos ? posY : undefined,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        padding: "10px 22px",
        borderRadius: 999,
        backgroundColor: color,
        color: "#FFFFFF",
        border: "2.5px solid #181512",
        boxShadow: "0 5px 0 #181512",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 21,
        fontWeight: 800,
        letterSpacing: 0.8,
        transform: `scale(${scale})`,
        whiteSpace: "nowrap",
        zIndex: 50,
        ...style,
      }}
    >
      {content}
    </div>
  );
};

export const ImpactShockwaveRing: React.FC<{ active?: boolean; color?: string }> = ({
  active = true,
  color = "#E63946",
}) => {
  if (!active) return null;
  return (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        backgroundColor: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
};

export const KineticFlashCut: React.FC<{ active?: boolean }> = () => null;

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

export function useGameFeelPhysics(triggerFrame: number, duration: number = 24): GameFeelPhysics {
  const frame = useCurrentFrame();

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
      scaleX: 1.28,
      scaleY: 0.76,
      burstProgress: 0.05,
    };
  }

  const dt = frame - triggerFrame;
  if (dt <= duration) {
    const p = dt / duration;
    const decay = Math.exp(-p * 4.2);
    const shakeX = Math.sin(dt * 1.8) * 9 * decay;
    const shakeY = Math.cos(dt * 2.1) * 7 * decay;
    const rebound = Math.sin(dt * 0.45) * 0.22 * decay;
    return {
      frame,
      triggerFrame,
      isHit: true,
      windup: false,
      hitFlash: dt <= 2,
      rattleX: 0,
      rattleY: 0,
      shakeX,
      shakeY,
      scaleX: 1 - rebound,
      scaleY: 1 + rebound,
      burstProgress: Math.min(1, p * 1.6),
    };
  }

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
    burstProgress: 1,
  };
}

export function useGameFeelCue(cueWordOrFrame: string | number | undefined, defaultFrame: number = 30, duration: number = 24): GameFeelPhysics {
  const cueF = useCue(cueWordOrFrame) ?? defaultFrame;
  return useGameFeelPhysics(cueF, duration);
}

export const ImpactBurst: React.FC<{
  cx: number;
  cy: number;
  at?: string | number;
  particles?: number;
  count?: number;
  color?: string;
  radius?: number;
}> = ({ cx, cy, at, particles = 12, count, color = COLOR_CRIMSON, radius = 110 }) => {
  const actualParticles = count ?? particles;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 15;
  if (frame < cueF) return null;

  const dt = frame - cueF;
  const p = spring({ frame: dt, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
  if (p >= 0.99 && dt > 20) return null;

  const r = interpolate(p, [0, 1], [0, radius]);
  const opacity = interpolate(p, [0, 0.2, 0.75, 1], [0, 1, 0.8, 0]);

  const items = Array.from({ length: actualParticles }).map((_, i) => {
    const angle = (i / actualParticles) * (Math.PI * 2);
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    const size = Math.max(3, 8 * (1 - p));
    return { px, py, size };
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
        zIndex: 45,
        opacity,
      }}
    >
      <circle cx={cx} cy={cy} r={r * 0.7} fill="none" stroke={color} strokeWidth={Math.max(1, 3.5 * (1 - p))} />
      {items.map((item, idx) => (
        <circle key={idx} cx={item.px} cy={item.py} r={item.size} fill={color} />
      ))}
    </svg>
  );
};

export const VolumetricGodRays: React.FC<{
  cx?: number;
  cy?: number;
  at?: string | number;
  rays?: number;
  color?: string;
}> = ({ cx = 960, cy = 540, at, rays = 12, color = 'rgba(230,57,70,0.14)' }) => {
  const frame = useCurrentFrame();
  const cueF = useCue(at) ?? 10;
  if (frame < cueF) return null;

  const rot = (frame - cueF) * 0.45;
  const pulse = 0.85 + Math.sin((frame - cueF) * 0.15) * 0.15;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 700,
        top: cy - 700,
        width: 1400,
        height: 1400,
        borderRadius: '50%',
        transform: `rotate(${rot}deg)`,
        background: `conic-gradient(from 0deg, ${color} 0deg 15deg, transparent 15deg 30deg, ${color} 30deg 45deg, transparent 45deg 60deg)`,
        opacity: 0.5 * pulse,
        pointerEvents: 'none',
        zIndex: 2,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export const SpeedLines: React.FC<{
  direction?: 'horizontal' | 'vertical';
  count?: number;
  at?: string | number;
  color?: string;
}> = ({ direction = 'horizontal', count = 10, at, color = 'rgba(230,57,70,0.35)' }) => {
  const frame = useCurrentFrame();
  const cueF = useCue(at) ?? 10;
  if (frame < cueF || frame > cueF + 18) return null;

  const dt = frame - cueF;
  const p = dt / 18;
  const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 0.8, 0.6, 0]);

  const lines = Array.from({ length: count }).map((_, i) => {
    const offset = 80 + i * (1080 / count);
    const length = 120 + ((i * 37) % 240);
    const thickness = 2 + (i % 3);
    const speed = ((dt * 65 + i * 40) % 1920) - 200;
    return { offset, length, thickness, speed };
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 38,
        opacity,
      }}
    >
      {lines.map((l, idx) =>
        direction === 'horizontal' ? (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: l.offset,
              left: l.speed,
              width: l.length,
              height: l.thickness,
              backgroundColor: color,
              borderRadius: l.thickness,
            }}
          />
        ) : (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: l.offset,
              top: l.speed,
              width: l.thickness,
              height: l.length,
              backgroundColor: color,
              borderRadius: l.thickness,
            }}
          />
        )
      )}
    </div>
  );
};

export const DoodleUnderline: React.FC<{
  x: number;
  y: number;
  width?: number;
  at?: string | number;
  color?: string;
}> = ({ x, y, width = 240, at, color = COLOR_CRIMSON }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 12;
  if (frame < cueF) return null;

  const p = spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 140 } });
  if (p <= 0.02) return null;

  const steps = 30;
  const currentSteps = Math.max(2, Math.floor(steps * Math.min(1, p)));
  const points: [number, number, number][] = [];
  for (let i = 0; i <= currentSteps; i++) {
    const t = i / steps;
    const px = x + t * width;
    const py = y + Math.sin(t * Math.PI) * 5 + (i % 2 === 0 ? 1 : -1) * 1.5;
    const pressure = 0.5 + 0.3 * Math.sin(t * Math.PI);
    points.push([px, py, pressure]);
  }
  const outline = getStroke(points, { size: 6, thinning: 0.4, smoothing: 0.6, streamline: 0.5 });
  const pathData = strokeToSvgPath(outline);

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 36,
      }}
    >
      <path d={pathData} fill={color} opacity={0.92} />
    </svg>
  );
};

export const SpecularSheen: React.FC<{
  width?: number;
  height?: number;
  at?: string | number;
}> = ({ width = 1060, height = 540, at }) => {
  const frame = useCurrentFrame();
  const cueF = useCue(at) ?? 20;
  if (frame < cueF || frame > cueF + 30) return null;

  const dt = frame - cueF;
  const p = dt / 30;
  const x = interpolate(p, [0, 1], [-200, width + 200]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: x,
        width: 140,
        height,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
        transform: 'skewX(-25deg)',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    />
  );
};
