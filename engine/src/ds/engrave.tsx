/**
 * All-in design system, layer 2c: **the engraving plates**.
 *
 * Why this exists (owner, 2026-10-13, verbatim): "i need new visuals and drawings ... when it talks abt eating its
 * own tail, why not a snake eating its own tail or smthing? i dont want the generic human figure with sticks
 * depecting the villain out of the blue, i want beautifull drawings and designs please. Not slop ... viewer must
 * feel it has been WORKED on."
 *
 * `ds/kit.tsx`'s `LineIcon` is a 4 px pictogram: one weight, no shading, no interior. It is the right tool for a
 * label ("a laptop", "a document") and the wrong tool for a metaphor, and repeating it beat after beat is exactly
 * the "same icon grammar" the owner rejected twice. This module is the other register: **wood-engraving**, cream
 * line on warm black, the way a 19th-century plate is cut — a heavy contour, a lighter interior, then hatching and
 * stipple doing the shading, one red element carrying the meaning.
 *
 * Three rules every plate obeys (what actually makes a drawing read as worked-on rather than as clip art):
 *   1. **Three weights, never one.** `CONTOUR` (the silhouette), `INNER` (structure inside it), `DETAIL` (the fine
 *      stuff: scales, grain, lettering). A single-weight drawing always looks like an icon.
 *   2. **Shading is drawn, not filled.** Volume comes from `Hatch`/`Stipple` clipped into the form, denser where the
 *      light isn't. Flat fills are reserved for the one red accent.
 *   3. **It is cut, not revealed.** Contour inks first, then structure, then the shading sweeps across the form at
 *      the hatching angle, like a burin crossing the block. Layers stagger; nothing fades up as a finished picture.
 *
 * Geometry: every plate draws in a 400 × 400 viewBox (`VB`), centre 200,200 — four times `kit`'s detail room.
 * `Plate` scales it to the panel and keeps the pen visually constant, so the same drawing is honest at 560 px in a
 * split and at 900 px full-bleed.
 *
 * Catalogue and credits: `design-system/VISUALS.md` → "Engraving plates". Base art for plates traced from public
 * domain sources is logged in `videos/<slug>/LICENCES.md`.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { hand, mono, prog, useCue } from './core';
import { color, font, motion } from './tokens';

export const VB = 400;

/** Pen scale: set by `Plate` so a plate drawn at any size keeps the weights it was cut at. */
let PEN = 1;
export const setPen = (px: number) => (PEN = (520 / px) * (VB / 400));

/** The three weights. A plate that uses one weight is not finished. */
export const CONTOUR = 4.6;
export const INNER = 2.8;
export const DETAIL = 1.5;

type Ink = string;

/**
 * A cut stroke. `p` (0–1) inks it in along its own length, so a line is *drawn*, never faded.
 * `dash` leaves it as a real dashed line (seams, fold lines, a route over water).
 */
type Cutp = Record<string, unknown>; // spreads onto <path>, <circle>, <ellipse>, <rect> alike
export const cut = (p: number, c: Ink = color.ink, w: number = INNER, dash?: string): Cutp => {
  const sw = w * PEN;
  if (dash) return { fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeDasharray: dash, opacity: p };
  return { fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };
};

/** A filled form (the one red accent, a cast shadow, a solid pupil). Fills appear; only strokes draw on. */
export const ink = (p: number, c: Ink = color.ink, op = 1): Cutp => ({ fill: c, stroke: 'none', opacity: p * op });

// ---------------------------------------------------------------- shading

let UID = 0;
const nextId = () => `eng${++UID}`;

/**
 * Hatching: parallel burin lines filling a form, the main way volume gets into a plate.
 * `clip` is the id of a <clipPath> holding the form; the lines are generated across its bounding box and clipped.
 * `p` sweeps the hatching on *along the hatching angle*, which is what reading a cut block looks like.
 * `gap` sets the tone: 5 is near-black shadow, 9 is mid, 14 is a whisper. `cross` adds the second pass at +72°.
 */
export const Hatch: React.FC<{
  clip: string; p: number; angle?: number; gap?: number; c?: Ink; w?: number; cross?: boolean; op?: number;
  box?: [number, number, number, number];
}> = ({ clip, p, angle = 38, gap = 9, c = color.ink, w = DETAIL, cross, op = 0.5, box = [0, 0, VB, VB] }) => {
  if (p <= 0) return null;
  const [bx, by, bw, bh] = box;
  const pass = (a: number, g: number, key: string) => {
    const rad = (a * Math.PI) / 180;
    const dx = Math.cos(rad), dy = Math.sin(rad);
    const span = Math.abs(bw * dy) + Math.abs(bh * dx); // perpendicular extent to cover
    const len = Math.abs(bw * dx) + Math.abs(bh * dy);
    const cx = bx + bw / 2, cy = by + bh / 2;
    const n = Math.ceil(span / g);
    const d: string[] = [];
    for (let i = 0; i <= n; i++) {
      const off = -span / 2 + i * g;
      // line i runs along (dx,dy), offset perpendicular by `off`
      const ox = cx + -dy * off, oy = cy + dx * off;
      const shown = interpolate(p, [i / (n + 1) * 0.55, i / (n + 1) * 0.55 + 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      if (shown <= 0.01) continue;
      const half = (len / 2) * shown;
      d.push(`M${(ox - dx * half).toFixed(1)} ${(oy - dy * half).toFixed(1)} L${(ox + dx * half).toFixed(1)} ${(oy + dy * half).toFixed(1)}`);
    }
    return <path key={key} d={d.join(' ')} fill="none" stroke={c} strokeWidth={w * PEN} strokeLinecap="round" opacity={op} />;
  };
  return <g clipPath={`url(#${clip})`}>{pass(angle, gap, 'a')}{cross && pass(angle + 72, gap * 1.35, 'b')}</g>;
};

/** Stipple: dots instead of lines — grain, stone, fur, paper tooth, the tone a hatch would make too busy. */
export const Stipple: React.FC<{ clip: string; p: number; n?: number; seed?: number; r?: number; c?: Ink; op?: number; box?: [number, number, number, number] }> =
  ({ clip, p, n = 260, seed = 7, r = 1.5, c = color.ink, op = 0.42, box = [0, 0, VB, VB] }) => {
    if (p <= 0) return null;
    const [bx, by, bw, bh] = box;
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const x = bx + rnd() * bw, y = by + rnd() * bh, j = rnd();
      if (j > p) continue;
      dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(r * (0.6 + rnd() * 0.8) * PEN).toFixed(2)} />);
    }
    return <g clipPath={`url(#${clip})`} fill={c} opacity={op}>{dots}</g>;
  };

/** Declares a form as a reusable clip for `Hatch`/`Stipple`. `d` is the same path as the contour. */
export const Clip: React.FC<{ id: string; d?: string; children?: React.ReactNode }> = ({ id, d, children }) => (
  <clipPath id={id}>{d ? <path d={d} /> : children}</clipPath>
);

/** A hook that mints stable clip ids for one plate instance. */
export const useIds = (n: number) => React.useMemo(() => Array.from({ length: n }, nextId), [n]);

// ---------------------------------------------------------------- timing

/**
 * A plate's cutting schedule. Everything in a plate is timed off this, so the three layers always land in order
 * and a plate never pops in finished: contour (0–22 f), structure (10–34 f), shading (22–52 f), accent (38 f).
 */
export const useCutIn = (at: string | number | undefined, fb = 0) => {
  const frame = useCurrentFrame();
  const f = useCue(at, fb);
  const since = frame - f;
  const q = (d0: number, len: number) => interpolate(since, [d0, d0 + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return {
    frame, since,
    contour: q(0, 22),
    inner: q(10, 24),
    shade: q(22, 30),
    detail: q(26, 26),
    accent: q(38, 10),
    /** 0→1 over `len` frames from `d0`, for a plate's own motion (a snake tightening, sand falling). */
    at: q,
    /** a slow unbounded ramp for drift / breathing */
    drift: Math.max(0, since) / 30,
  };
};
export type Cut = ReturnType<typeof useCutIn>;

// ---------------------------------------------------------------- the frame

/**
 * Wraps one plate: scales the 400-unit drawing into the panel, sets the pen, and hangs the plate's caption
 * furniture off it — a mono `label` under the drawing and an optional `plate` credit line (public-domain base art).
 * Interface deliberately matches `kit`'s `LineIcon` so `ds/layouts` places a plate and a pictogram identically.
 */
export const Plate: React.FC<{
  w: number; h: number; size?: number; label?: string; labelAt?: string | number; plate?: string;
  at?: string | number; children: (c: Cut) => React.ReactNode;
}> = ({ w, h, size: px, label, labelAt, plate, at, children }) => {
  const c = useCutIn(at);
  const lf = useCue(labelAt ?? at, 0);
  const s = px ?? Math.min(w, h - (label ? 64 : 0) - (plate ? 34 : 0)) * 0.98;
  setPen(s);
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <svg width={s} height={s} viewBox={`0 0 ${VB} ${VB}`} style={{ overflow: 'visible' }}>{children(c)}</svg>
      {label && <div style={{ ...mono(28, color.mute), letterSpacing: 1, opacity: lf <= 0 ? 1 : prog(c.frame, lf, 10) }}>{label}</div>}
      {plate && <div style={{ ...mono(20, color.mute), opacity: 0.65 * c.shade }}>{plate}</div>}
    </div>
  );
};

/** A hand-written red annotation with a leader line, for the one word a plate is allowed to carry. */
export const Note: React.FC<{ x: number; y: number; to: [number, number]; t: string; p: number; anchor?: 'start' | 'middle' | 'end' }> =
  ({ x, y, to, t, p, anchor = 'start' }) => (
    <g opacity={p}>
      <path d={`M${x} ${y + 4} Q${(x + to[0]) / 2} ${(y + to[1]) / 2 - 10} ${to[0]} ${to[1]}`} {...cut(p, color.red, DETAIL * 1.4)} />
      <circle cx={to[0]} cy={to[1]} r={3.2 * PEN} fill={color.red} opacity={p} />
      <text x={x} y={y} textAnchor={anchor} fontFamily={font.hand} fontWeight={700} fontSize={26 * PEN} fill={color.red}>{t}</text>
    </g>
  );

/** Breathing: every plate drifts a hair so no shot is ever frozen (the "nothing static" rule). */
export const breathe = (frame: number, amp = 1.4, period = 150) => ({
  transform: `translate(0, ${(Math.sin((frame / period) * Math.PI * 2) * amp).toFixed(2)})`,
});

export { motion };
