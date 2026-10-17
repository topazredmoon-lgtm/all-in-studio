/**
 * THE POISONED WELL · shared motion rig ("editorial forensic cinema").
 * Camera (push-in / drift / roll) + parallax Layers + dust + vignette + lower-third caption + deterministic canvas fields.
 * Everything is a pure function of the frame. Seeded randomness only (no Math.random).
 */
import React, { createContext, useContext, useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Word, useBeat } from '../ds/core';

export const W = 1920;
export const H = 1080;
export const P = { ink: '#0A0B0D', deep: '#111316', paper: '#ECE6DA', grey: '#7A7F87', acid: '#C8FF3A', red: '#E5322D' } as const;
export const F = {
  serif: 'AllinSerif, Georgia, serif',
  mono: 'AllinMono, Consolas, monospace',
  sans: 'AllinSans, AllinBody, Arial, sans-serif',
} as const;

// ---------------------------------------------------------------- math
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const eio = Easing.bezier(0.65, 0, 0.35, 1);
export const eoc = Easing.bezier(0.16, 1, 0.3, 1); // expo-ish out
export const eoq = Easing.out(Easing.quad);
export const eiq = Easing.in(Easing.quad);
export const eob = Easing.bezier(0.34, 1.56, 0.64, 1); // back-out (spring-like)
/** 0→1 between frames a and b with an easing. */
export const ramp = (f: number, a: number, b: number, e: (t: number) => number = eio) => e(clamp01((f - a) / Math.max(1e-6, b - a)));
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const hash = (i: number, seed = 0) => {
  let h = (i * 374761393 + seed * 668265263) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
export const fmtN = (n: number) => Math.round(n).toLocaleString('en-US');

// ---------------------------------------------------------------- camera
export type CamSpec = { z?: [number, number]; x?: [number, number]; y?: [number, number]; r?: [number, number]; ease?: (t: number) => number };
export type Cam = { z: number; x: number; y: number; r: number; p: number };
const CamCtx = createContext<Cam>({ z: 1, x: 0, y: 0, r: 0, p: 0 });
export const useCam = () => useContext(CamCtx);

/** Beat-local frame + duration in one hook. */
export const SkipCtx = createContext(0);
/** Beat-local frame + duration. A "continuation" cut (hero.k = N) starts N frames into the same animation, so a hard cut keeps the world still moving. */
export const useLocal = () => {
  const k = useContext(SkipCtx);
  const f = useCurrentFrame() + k;
  const { dur, words } = useBeat();
  return { f, dur: dur + k, words, k };
};
/** Wraps a component so `k` (frames to skip into its animation) is honoured by every hook below. */
export const withSkip = <T extends { k?: number; sk?: number }>(C: React.FC<T>): React.FC<T> => (props: T) => <SkipCtx.Provider value={props.sk ?? 0}><C {...props} k={props.sk ?? 0} /></SkipCtx.Provider>;

const lerp2 = (r: [number, number] | undefined, d: number, p: number) => (r ? mix(r[0], r[1], p) : d);

/** Parallax layer: depth 0 = locked to the page, 1 = full camera motion, >1 = foreground (moves faster). */
export const Layer: React.FC<{ d?: number; children?: React.ReactNode; style?: React.CSSProperties; blur?: number; opacity?: number }> = ({ d = 1, children, style, blur = 0, opacity = 1 }) => {
  const c = useCam();
  const s = 1 + (c.z - 1) * d;
  return (
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 50%',
        transform: `translate(${-c.x * d}px, ${-c.y * d}px) rotate(${c.r * d}deg) scale(${s})`,
        filter: blur > 0 ? `blur(${blur}px)` : undefined, opacity, willChange: 'transform', ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- canvas helper
export const Canvas: React.FC<{ draw: (ctx: CanvasRenderingContext2D, f: number) => void; style?: React.CSSProperties }> = ({ draw, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const f = useCurrentFrame() + useContext(SkipCtx);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    draw(ctx, f);
  });
  return <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, ...style }} />;
};

// ---------------------------------------------------------------- dust (foreground parallax)
const DUST = (() => {
  const r = rng(77);
  return Array.from({ length: 46 }, () => ({ x: r() * W, y: r() * H, s: 1 + r() * 3.2, v: 4 + r() * 16, a: 0.1 + r() * 0.35, ph: r() * 6.28 }));
})();
const Dust: React.FC<{ tint?: string }> = ({ tint = P.paper }) => {
  const c = useCam();
  return (
    <Canvas
      draw={(ctx, f) => {
        ctx.fillStyle = tint;
        for (const m of DUST) {
          const x = (((m.x + Math.sin(f / 40 + m.ph) * 14 - c.x * 1.9 + f * 0.25) % (W + 40)) + W + 40) % (W + 40) - 20;
          const y = (((m.y - f * m.v / 30 - c.y * 1.9) % (H + 40)) + H + 40) % (H + 40) - 20;
          ctx.globalAlpha = m.a * (0.6 + 0.4 * Math.sin(f / 17 + m.ph));
          ctx.beginPath();
          ctx.arc(x, y, m.s, 0, 6.283);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }}
    />
  );
};

// ---------------------------------------------------------------- caption (lower third, one line, current word lit)
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9$%]/g, '');
const capTimes = (cap: string[], allWords: Word[], dur: number): number[] => {
  const words = allWords.filter((w) => w.f >= -8);
  const out: number[] = [];
  let wi = 0;
  for (const c of cap) {
    const n = norm(c);
    let found = -1;
    for (let k = wi; k < words.length; k++) {
      const wn = norm(words[k].w);
      if (wn === n || (n.length >= 4 && wn.startsWith(n))) { found = k; break; }
    }
    if (found >= 0) { out.push(words[found].f - 3); wi = found + 1; } else out.push(NaN);
  }
  // fill gaps linearly
  for (let i = 0; i < out.length; i++) {
    if (!Number.isNaN(out[i])) continue;
    let a = i - 1; while (a >= 0 && Number.isNaN(out[a])) a--;
    let b = i + 1; while (b < out.length && Number.isNaN(out[b])) b++;
    const ta = a >= 0 ? out[a] : 0;
    const tb = b < out.length ? out[b] : dur * 0.8;
    out[i] = ta + ((tb - ta) * (i - a)) / (b - a);
  }
  return out;
};
export const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { dur, words } = useBeat();
  const cw = text.split(/\s+/).filter(Boolean);
  const t = capTimes(cw, words, dur);
  let cur = -1;
  t.forEach((tt, i) => { if (f >= tt) cur = i; });
  const a = ramp(f, 2, 14, eoq);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(180deg, rgba(10,11,13,0) 0%, rgba(10,11,13,0.72) 45%, rgba(10,11,13,0.94) 100%)', opacity: a }}>
      <div style={{ position: 'absolute', left: 120, bottom: 78, display: 'flex', alignItems: 'center', gap: 26 }}>
        <div style={{ width: 6, height: 58, background: P.paper, opacity: 0.9 }} />
        <div style={{ fontFamily: F.sans, fontSize: 50, fontWeight: 600, letterSpacing: '-0.012em', lineHeight: 1, whiteSpace: 'nowrap', textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}>
          {cw.map((w, i) => (
            <span key={i} style={{ color: i <= cur ? P.paper : '#9aa0a8', opacity: i <= cur ? 1 : 0.85, marginRight: 14, position: 'relative', fontWeight: i === cur ? 700 : 600 }}>
              {w}
              {i === cur && <span style={{ position: 'absolute', left: 0, right: 14, bottom: -9, height: 4, background: P.paper }} />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the stage
export const Stage: React.FC<{ cam?: CamSpec; cap?: string; children: React.ReactNode; glow?: string; dust?: boolean; vignette?: number; dustTint?: string; bg?: string }> = ({ cam, cap, children, glow, dust = true, vignette = 0.7, dustTint, bg }) => {
  const f = useCurrentFrame();
  const { dur } = useBeat();
  const p = (cam?.ease ?? eio)(clamp01(f / Math.max(1, dur - 1)));
  const c: Cam = { z: lerp2(cam?.z, 1, p), x: lerp2(cam?.x, 0, p), y: lerp2(cam?.y, 0, p), r: lerp2(cam?.r, 0, p), p };
  return (
    <AbsoluteFill style={{ background: bg ?? `radial-gradient(ellipse at 50% 42%, ${P.deep} 0%, ${P.ink} 72%)`, overflow: 'hidden' }}>
      <CamCtx.Provider value={c}>
        {children}
        {dust && <Dust tint={dustTint} />}
      </CamCtx.Provider>
      {glow && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${glow} 0%, rgba(0,0,0,0) 60%)`, mixBlendMode: 'screen', pointerEvents: 'none' }} />}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,${vignette}) 100%)`, pointerEvents: 'none' }} />
      <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 4px)', pointerEvents: 'none' }} />
      {cap && <Caption text={cap} />}
    </AbsoluteFill>
  );
};

/** Props every PW visual receives from script.json (w/h come from the Scene layout). */
export type PWProps = { s?: number; k?: number; sk?: number; cap?: string; w?: number; h?: number };

// ---------------------------------------------------------------- the page field (the "entire internet")
export type Field = { n: number; x: Float32Array; y: Float32Array; k: Float32Array; ph: Float32Array; cols: number; rows: number; sp: number };
const fieldCache = new Map<string, Field>();
/** World of pages, centred on the origin. Low-frequency noise carves voids so it reads as a landscape, not a keyboard. */
export const getField = (cols: number, rows: number, sp: number, seed: number): Field => {
  const key = `${cols}x${rows}x${sp}x${seed}`;
  const hit = fieldCache.get(key);
  if (hit) return hit;
  const r = rng(seed);
  const n = cols * rows;
  const fl: Field = { n, x: new Float32Array(n), y: new Float32Array(n), k: new Float32Array(n), ph: new Float32Array(n), cols, rows, sp };
  const p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const id = j * cols + i;
    fl.x[id] = (i - (cols - 1) / 2) * sp + (r() - 0.5) * sp * 0.7;
    fl.y[id] = (j - (rows - 1) / 2) * sp * 1.08 + (r() - 0.5) * sp * 0.7;
    const nx = fl.x[id], ny = fl.y[id];
    const lf = Math.sin(nx * 0.0031 + p1) * Math.sin(ny * 0.0042 + p2) + 0.6 * Math.sin((nx + ny) * 0.0017 + p3);
    const dens = 0.55 + 0.45 * Math.sin(nx * 0.0013 + ny * 0.0021 + p3);
    const keep = Math.max(0.06, Math.min(1, 1.2 - Math.max(0, lf - 0.1) * 0.85));
    fl.k[id] = r() > keep ? 0 : (0.3 + r() * 0.7) * (0.55 + 0.45 * dens);
    fl.ph[id] = r() * 6.283;
  }
  const mid = Math.floor(rows / 2) * cols + Math.floor(cols / 2);
  for (let d = -3; d <= 3; d++) fl.k[mid + d] = Math.max(fl.k[mid + d], 0.6);
  fieldCache.set(key, fl);
  return fl;
};

export type FieldOpts = {
  cx: number; cy: number; zoom: number; /** world → screen */
  pageW?: number; /** world size of a page */
  alpha?: number; t: number;
  /** per-index acid amount 0..1 (poison); called only for indices < n */
  acid?: (i: number) => number;
  ring?: { x: number; y: number; r: number; w: number; a: number } | null; /** a ripple in world coords */
  rot?: number; tint?: string; ox?: number; oy?: number;
  /** a soft band of light travelling across the field (screen-space diagonal position) */
  sweep?: { pos: number; w: number; a?: number } | null;
  fall?: number; /** vignette falloff strength 0..1 */
};
/** Draws the field: dots when far, page glyphs when close. Culled; 10k+ cheap fills are fine on canvas. */
export const drawField = (ctx: CanvasRenderingContext2D, fl: Field, o: FieldOpts) => {
  const pw = o.pageW ?? 22;
  const ph = pw * 1.3;
  const al = o.alpha ?? 1;
  const ox = o.ox ?? W / 2;
  const oy = o.oy ?? H / 2;
  const fall = o.fall ?? 0.7;
  for (let i = 0; i < fl.n; i++) {
    const kk = fl.k[i];
    if (kk === 0) continue;
    const sx = ox + (fl.x[i] - o.cx) * o.zoom;
    const sy = oy + (fl.y[i] - o.cy) * o.zoom;
    const vs = 0.72 + kk * 0.5;
    const sw = pw * o.zoom * vs, shh = ph * o.zoom * vs;
    if (sx < -sw - 4 || sx > W + sw + 4 || sy < -shh - 4 || sy > H + shh + 4) continue;
    const a = o.acid ? o.acid(i) : 0;
    let wob = 0;
    if (o.ring) {
      const d = Math.hypot(fl.x[i] - o.ring.x, fl.y[i] - o.ring.y);
      wob = Math.max(0, 1 - Math.abs(d - o.ring.r) / o.ring.w) * o.ring.a;
    }
    let sw2 = 0;
    if (o.sweep) { const v = Math.abs(sx * 0.82 + sy * 0.57 - o.sweep.pos); sw2 = v < o.sweep.w ? (1 - v / o.sweep.w) * (o.sweep.a ?? 0.5) : 0; }
    const dd = Math.hypot(sx - W / 2, sy - H / 2) / 1150;
    const vig = Math.max(0.18, 1.12 - dd * dd * 1.25 * fall - dd * 0.15);
    const base = (0.2 + kk * 0.4) * al * vig * (0.85 + 0.15 * Math.sin(o.t / 23 + fl.ph[i])) + sw2;
    const col = a > 0.01 ? P.acid : o.tint ?? P.paper;
    const av = Math.min(1, a > 0.01 ? 0.45 + a * 0.55 : base + wob * 0.55);
    if (sw < 2.4) {
      const s = Math.max(1.5, sw * 0.95);
      ctx.globalAlpha = av;
      ctx.fillStyle = a > 0.01 || wob > 0.05 ? P.acid : col;
      ctx.fillRect(sx - s / 2, sy - s / 2, s, s * 1.25);
    } else if (sw < 15) {
      ctx.globalAlpha = av;
      ctx.fillStyle = a > 0.01 || wob > 0.3 ? P.acid : col;
      ctx.fillRect(sx - sw / 2, sy - shh / 2, sw, shh);
      if (sw > 7) { ctx.globalAlpha = av * 0.9; ctx.fillStyle = P.ink; for (let l = 1; l < 4; l++) ctx.fillRect(sx - sw / 2 + sw * 0.16, sy - shh / 2 + shh * (0.12 + l * 0.2), sw * 0.68, Math.max(0.8, sw * 0.07)); }
    } else {
      if (a > 0.01) { ctx.globalAlpha = 0.18 * a; ctx.fillStyle = P.acid; ctx.fillRect(sx - sw * 0.9, sy - shh * 0.9, sw * 1.8, shh * 1.8); }
      ctx.globalAlpha = Math.min(1, av + 0.12);
      ctx.fillStyle = a > 0.01 ? P.acid : col;
      ctx.beginPath();
      const x0 = sx - sw / 2, y0 = sy - shh / 2, fold = sw * 0.22;
      ctx.moveTo(x0, y0); ctx.lineTo(x0 + sw - fold, y0); ctx.lineTo(x0 + sw, y0 + fold); ctx.lineTo(x0 + sw, y0 + shh); ctx.lineTo(x0, y0 + shh); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = P.ink;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(x0 + sw * 0.14, y0 + shh * 0.16, sw * 0.5, Math.max(1.2, sw * 0.06));
      for (let l = 0; l < 6; l++) { const ww = sw * (0.72 - ((i * 7 + l * 3) % 5) * 0.06); ctx.fillRect(x0 + sw * 0.14, y0 + shh * (0.3 + l * 0.105), ww, Math.max(1, sw * 0.04)); }
    }
  }
  ctx.globalAlpha = 1;
};

// ---------------------------------------------------------------- shared small pieces
/** A tiny document sheet drawn in SVG-free divs (used for fans / stacks). */
export const Sheet: React.FC<{ w: number; h: number; tone?: string; acid?: boolean; style?: React.CSSProperties; seed?: number; lines?: number }> = ({ w, h, tone = P.paper, acid, style, seed = 1, lines = 14 }) => {
  const r = rng(seed * 131 + 9);
  const rows = Array.from({ length: lines }, () => 0.5 + r() * 0.45);
  return (
    <div style={{ position: 'absolute', width: w, height: h, background: tone, boxShadow: '0 20px 50px rgba(0,0,0,0.55)', ...style }}>
      <div style={{ position: 'absolute', left: w * 0.1, top: h * 0.07, width: w * 0.55, height: h * 0.035, background: P.ink, opacity: 0.82 }} />
      <div style={{ position: 'absolute', left: w * 0.1, top: h * 0.125, width: w * 0.3, height: h * 0.014, background: P.ink, opacity: 0.35 }} />
      {rows.map((ww, i) => (
        <div key={i} style={{ position: 'absolute', left: w * (i % 2 ? 0.53 : 0.1), top: h * (0.2 + Math.floor(i / 2) * 0.062), width: w * 0.37 * ww, height: Math.max(2, h * 0.014), background: P.ink, opacity: 0.3 }} />
      ))}
      {acid && <div style={{ position: 'absolute', left: w * 0.1, top: h * 0.82, width: w * 0.8, height: Math.max(4, h * 0.026), background: P.acid, boxShadow: `0 0 ${w * 0.06}px ${P.acid}` }} />}
    </div>
  );
};

/** Mono label chip. Not used for content text below 44 px except for explicit "document texture". */
export const Tag: React.FC<{ children: React.ReactNode; size?: number; c?: string; bg?: string; border?: string; style?: React.CSSProperties }> = ({ children, size = 44, c = P.paper, bg, border, style }) => (
  <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: '0.1em', textTransform: 'uppercase', color: c, background: bg, border: border ? `3px solid ${border}` : undefined, padding: border || bg ? '8px 20px' : 0, lineHeight: 1.1, whiteSpace: 'nowrap', ...style }}>{children}</div>
);

/** Stamp that slams on (scale 1.5→1, 6 frames). Red is allowed only here. */
export const StampPW: React.FC<{ at: number; text: string; c?: string; rot?: number; size?: number; style?: React.CSSProperties }> = ({ at, text, c = P.red, rot = -7, size = 64, style }) => {
  const { f } = useLocal();
  if (f < at) return null;
  const p = ramp(f, at, at + 6, eiq);
  return (
    <div style={{ position: 'absolute', transform: `rotate(${rot}deg) scale(${1.55 - 0.55 * p})`, opacity: p, border: `6px solid ${c}`, color: c, padding: '8px 28px', fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: '0.16em', borderRadius: 6, background: 'rgba(10,11,13,0.5)', ...style }}>{text}</div>
  );
};

/** The one shared field of pages used by a01/a02/a03/c02 (11,200 pages). Centre page = the poisoned one. */
export const FLD = { cols: 140, rows: 80, sp: 34, seed: 11 } as const;
export const mainField = () => getField(FLD.cols, FLD.rows, FLD.sp, FLD.seed);
export const ACID_ID = Math.floor(FLD.rows / 2) * FLD.cols + Math.floor(FLD.cols / 2);
