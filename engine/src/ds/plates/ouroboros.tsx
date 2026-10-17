/**
 * **Ouroboros** — the serpent eating its own tail. The owner's own image for model collapse (2026-10-13, verbatim:
 * "when it talks abt eating its own tail, why not a snake eating its own tail or smthing?"), so it is the film's hero
 * plate and the one drawing allowed to come back at the end as a callback.
 *
 * Cut the way a wood engraving is cut, and the reference for every other plate in `ds/plates/`:
 *   - the body is a *tapered tube*, not a stroked circle: an outer and an inner edge generated from a centreline that
 *     spirals in a few units, so the tail tip passes inside the head and the bite reads as a bite;
 *   - three weights — contour, belly scutes, then 54 scale rows whose arcs tighten toward the tail;
 *   - volume from hatching clipped into the body, denser on the lower right (light upper-left) plus a cross pass under
 *     the head, where the coil overlaps itself;
 *   - the only red is the eye and, on `tighten`, the closing jaw line: the meaning, nothing else.
 *
 * Motion: the coil *tightens*. Over `tighten` frames the ring loses radius, the lower jaw closes the last 16° onto the
 * tail, and the whole plate turns a few degrees — the mechanism running, not an animation playing.
 */
import React from 'react';
import { CONTOUR, Clip, Cut, DETAIL, Hatch, INNER, Note, Plate, Stipple, VB, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const C = VB / 2;
const pt = (a: number, r: number) => [C + r * Math.cos((a * Math.PI) / 180), C + r * Math.sin((a * Math.PI) / 180)] as const;

const A0 = -58; // the body's head end (upper right); the head is then laid back over the coil from here
const SPAN = 312; // the tail tip lands at 254°, under where the jaw closes — the bite, not a gap
const R0 = 138;

/** Half-width of the body at u (0 = head end, 1 = tail tip): thick shoulders, a fine tail. */
const halfW = (u: number) => 2.5 + 28 * Math.pow(1 - u, 0.62);
/** Centreline radius: drifts inward so the tail tip sits *inside* the head's jaw. */
const radius = (u: number, squeeze: number) => R0 - 13 * u - squeeze * (5 + 13 * u);

const edge = (u: number, side: 1 | -1, squeeze: number) => {
  const a = A0 + SPAN * u;
  return pt(a, radius(u, squeeze) + side * halfW(u));
};

const bodyPath = (squeeze: number, n = 120) => {
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = edge(i / n, 1, squeeze);
    out.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  for (let i = n; i >= 0; i--) {
    const [x, y] = edge(i / n, -1, squeeze);
    out.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return out.join(' ') + ' Z';
};

/** 54 scale rows: a short arc across the body, bowing toward the tail, tightening as the body narrows. */
const scaleRows = (squeeze: number) => {
  const rows: string[] = [];
  for (let i = 2; i < 34; i++) {
    const u = i / 34;
    const a = A0 + SPAN * u;
    const r = radius(u, squeeze), hw = halfW(u) * 0.86;
    const [ax, ay] = pt(a, r - hw), [bx, by] = pt(a, r + hw);
    const [mx, my] = pt(a + 4.4, r); // the bow, pointing down the body
    rows.push(`M${ax.toFixed(1)} ${ay.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`);
  }
  return rows.join(' ');
};

/** Belly scutes: the inner edge gets the broad plates a snake actually has, double-struck. */
const scutes = (squeeze: number) => {
  const d: string[] = [];
  for (let i = 2; i < 40; i++) {
    const u = i / 40;
    const a = A0 + SPAN * u;
    const r = radius(u, squeeze) - halfW(u) * 0.52;
    const [ax, ay] = pt(a - 1.5, r), [bx, by] = pt(a + 1.5, r);
    d.push(`M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`);
  }
  return d.join(' ');
};

/** The head, drawn in local coordinates (+x toward the tail it is biting) and dropped onto the body end. */
const Head: React.FC<{ c: Cut; jaw: number; squeeze: number; clipId: string }> = ({ c, jaw, squeeze, clipId }) => {
  // The head is aimed at the tail tip rather than along the tangent: a serpent biting itself turns its head in,
  // and a tangent-aligned head flies past the tail by half a head's length. Length follows the reach, so the
  // snout always closes on the tail as the coil tightens.
  const [hx, hy] = pt(A0, radius(0, squeeze));
  const [tx, ty] = pt(A0 + SPAN, radius(1, squeeze));
  const tangent = (Math.atan2(ty - hy, tx - hx) * 180) / Math.PI;
  const reach = Math.hypot(tx - hx, ty - hy);
  const k = Math.min(1.08, Math.max(0.78, (reach + 16) / 131));
  // Pointing left flips the drawing's y: mirror it back, or the lower jaw and the eye end up on top of the skull.
  const flip = Math.abs(tangent) > 90 ? -1 : 1;
  const skull = 'M-10 -31 C22 -39 62 -38 92 -29 C112 -23 126 -13 131 -2 L126 4 C100 2 62 -1 28 -4 C8 -6 -7 -15 -10 -31 Z';
  return (
    <g transform={`translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${tangent.toFixed(1)}) scale(${k.toFixed(3)} ${(k * flip).toFixed(3)})`}>
      <Clip id={clipId} d={skull} />
      {/* lower jaw, hinged at the corner of the mouth; closes the last 17° onto the tail as the coil tightens */}
      <g transform={`rotate(${(21 - 17 * jaw).toFixed(1)} 4 8)`}>
        <path d="M4 8 C30 17 74 25 108 21 C120 19 127 15 130 10 C122 25 94 37 60 36 C34 35 10 25 4 14 Z" {...cut(c.inner, color.ink, INNER)} />
        <path d="M22 20 L24 26 M40 25 L42 31 M60 28 L62 34 M80 29 L82 35" {...cut(c.detail, color.ink, DETAIL)} />
      </g>
      {/* skull: contour, then the brow ridge and the jaw line, then scale grain */}
      <path d={skull} {...cut(c.contour, color.ink, CONTOUR)} />
      {/* brow ridge and the long jaw line: the two lines that make a skull a skull */}
      <path d="M-4 -20 C24 -28 62 -27 90 -19 C106 -14 120 -7 128 -2" {...cut(c.inner, color.ink, DETAIL * 1.6)} />
      <path d="M6 -6 C40 -3 86 0 124 1" {...cut(c.inner, color.ink, DETAIL * 1.4)} />
      {/* head scales: the plates over the crown, smaller toward the snout */}
      <path d="M10 -32 L12 -22 M30 -36 L31 -25 M52 -37 L52 -26 M74 -35 L73 -24 M94 -30 L92 -20 M110 -24 L108 -15" {...cut(c.detail, color.ink, DETAIL)} />
      <Hatch clip={clipId} p={c.shade} angle={58} gap={7} op={0.34} box={[-12, -40, 150, 52]} />
      <Hatch clip={clipId} p={c.detail} angle={-20} gap={13} op={0.2} box={[-12, -40, 150, 52]} />
      {/* eye: the one red in the drawing */}
      <ellipse cx={36} cy={-17} rx={8.5} ry={6.8} {...cut(c.inner, color.ink, DETAIL * 1.7)} />
      <circle cx={36} cy={-17} r={4} {...ink(c.accent, color.red)} />
      <path d="M118 -5 C122 -8 126 -8 129 -5" {...cut(c.detail, color.ink, DETAIL)} />
    </g>
  );
};

export const Ouroboros: React.FC<{
  w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number;
  /** frames over which the coil tightens and the jaw shuts (default 90: slow, so it is never a loop animation) */
  tighten?: number;
  /** the one red annotation this plate may carry */
  note?: string; noteAt?: string | number; plate?: string;
}> = ({ w, h, size, at, label, labelAt, tighten = 90, note, noteAt, plate }) => {
  const [body, headClip] = useIds(2);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
      {(c) => {
        const t = c.at(30, tighten); // 0 → 1: the squeeze
        const squeeze = t;
        const d = bodyPath(squeeze);
        return (
          <g style={breathe(c.frame, 1.2, 190)} transform={`rotate(${(-3 * t).toFixed(2)} ${C} ${C})`}>
            <Clip id={body} d={d} />
            {/* cast shadow under the coil, so it sits on something */}
            <ellipse cx={C} cy={C + 150} rx={120} ry={16} {...ink(c.shade, color.stageDeep, 0.9)} />
            {/* 1 · contour */}
            <path d={d} {...cut(c.contour, color.ink, CONTOUR)} />
            {/* 2 · structure: belly scutes, then the scale rows */}
            <path d={scutes(squeeze)} {...cut(c.inner, color.ink, DETAIL * 1.7)} />
            <path d={scaleRows(squeeze)} {...cut(c.detail, color.ink, DETAIL)} />
            {/* 3 · shading: light from the upper left, so the lower right and the inside of the coil go dark */}
            <Hatch clip={body} p={c.shade} angle={40} gap={10} op={0.30} box={[C - 30, C - 40, 200, 220]} />
            <Hatch clip={body} p={c.shade} angle={40} gap={17} op={0.17} box={[20, 20, VB - 40, VB - 40]} />
            <Hatch clip={body} p={c.detail} angle={112} gap={16} cross op={0.13} box={[C - 70, C - 180, 240, 160]} />
            <Stipple clip={body} p={c.detail} n={300} seed={11} r={0.85} op={0.22} />
            <Head c={c} jaw={t} squeeze={squeeze} clipId={headClip} />
            {note && <Note x={C - 128} y={C + 176} to={[C - 2, C + 128]} t={note} p={c.at(44, 10)} />}
          </g>
        );
      }}
    </Plate>
  );
};
