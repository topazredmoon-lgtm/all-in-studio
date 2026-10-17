/**
 * **TwoHands** — "But the internet is not written only by people any more."
 *
 * Two hands write on one sheet. Left: a human hand pinching a quill, knuckles, tendons, a buttoned cuff, cross-hatched on
 * the underside. Right: a brass automaton hand holding the identical quill (the quill is one function, mirrored):
 * segmented finger plates, pivot rivets, a wrist gear, a riveted bracket. Fingers and plates are generated from a handful
 * of centreline points by `tube()` (a capsule outline walked along a Catmull-Rom spline), so both hands share one skeleton.
 *
 * On the page the human's baseline wanders (summed sines, a drifting slope, little loops) and the machine's is a perfect
 * triangle wave at a fixed pitch; the rows already written show the same difference. The red is the machine's live line.
 *
 * Motion: both nibs travel toward the centre of the sheet over ~80 frames, drawing their lines; hands follow the nib.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

type P = [number, number];
const f1 = (n: number) => n.toFixed(1);
const poly = (pts: P[], close = false) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L') + (close ? ' Z' : '');

const smooth = (pts: P[], n = 6): P[] => {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

/** A capsule walked along a spline: radius r0 → r1. Returns the outline and the sampled centreline + normals. */
const tube = (ctrl: P[], r0: number, r1: number, spline = true) => {
  const c = spline ? smooth(ctrl, 6) : ctrl;
  const n = c.length;
  const nor: P[] = c.map((p, i) => {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [dy / l, -dx / l];
  });
  const r = (i: number) => r0 + (r1 - r0) * (i / (n - 1));
  const left = c.map((p, i) => [p[0] + nor[i][0] * r(i), p[1] + nor[i][1] * r(i)] as P);
  const right = c.map((p, i) => [p[0] - nor[i][0] * r(i), p[1] - nor[i][1] * r(i)] as P);
  const cap = (i: number, from: number, to: number) => {
    const t: P = [-nor[i][1], nor[i][0]]; // tangent (forward)
    const pts: P[] = [];
    for (let k = 1; k < 8; k++) {
      const a = from + ((to - from) * k) / 8;
      pts.push([c[i][0] + r(i) * (Math.cos(a) * nor[i][0] + Math.sin(a) * t[0]), c[i][1] + r(i) * (Math.cos(a) * nor[i][1] + Math.sin(a) * t[1])]);
    }
    return pts;
  };
  const outline = [...left, ...cap(n - 1, 0, Math.PI), ...right.slice().reverse(), ...cap(0, Math.PI, Math.PI * 2)];
  return { d: poly(outline, true), c, nor, left, right, r };
};

const rng = (seed: number) => { let s = seed * 9301 + 49297; for (let i = 0; i < 4; i++) s = (s * 9301 + 49297) % 233280; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };

// ----------------------------------------------------------------- the quill (one drawing, used by both hands)
const U: P = [-0.38, -0.925], N: P = [0.925, -0.38], LEN = 121;
const axis = (t: number): P => { const k = 5 * Math.pow(Math.max(0, t - 0.45), 2) * 3; return [U[0] * t * LEN + N[0] * k, U[1] * t * LEN + N[1] * k]; };
const T0 = 0.46, T1 = 1.32;
const wv = (t: number, s: number) => 15 * Math.pow(Math.max(0, Math.sin((Math.PI * (t - T0)) / (T1 - T0))), 0.75) * (s > 0 ? 0.82 : 1);
const edge = (t: number, s: number): P => { const a = axis(t), w = wv(t, s); return [a[0] + N[0] * s * w, a[1] + N[1] * s * w]; };

const quill = (() => {
  const outline: P[] = [];
  for (let k = 0; k <= 30; k++) outline.push(edge(T0 + ((T1 - T0) * k) / 30, 1));
  for (let k = 30; k >= 0; k--) outline.push(edge(T0 + ((T1 - T0) * k) / 30, -1));
  const barbs: string[] = [];
  for (let k = 0; k < 46; k++) {
    const t = T0 + 0.02 + ((T1 - T0 - 0.04) * k) / 46;
    [1, -1].forEach((s) => { const a = axis(t), e = edge(Math.min(T1, t + 0.06), s); barbs.push(`M${f1(a[0])} ${f1(a[1])} L${f1(e[0])} ${f1(e[1])}`); });
  }
  const shaft: P[] = Array.from({ length: 14 }, (_, k) => axis((T1 - 0.02) * (k / 13)));
  return { vane: poly(outline, true), barbs: barbs.join(' '), shaft: poly(shaft), nib: 'M0 0 L-4.4 -9 M0 0 L3 -9 M-0.4 -1 L-0.8 -6' };
})();

const Quill: React.FC<{ c: any; clipId: string }> = ({ c, clipId }) => (
  <g>
    <Clip id={clipId} d={quill.vane} />
    <path d={quill.vane} {...ink(c.contour, color.stageDeep, 1)} />
    <path d={quill.barbs} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
    <Hatch clip={clipId} p={c.shade} angle={60} gap={4.2} op={0.38} box={[-60, -150, 60, 130]} />
    <path d={quill.vane} {...cut(c.inner, color.ink, INNER)} />
    <path d={quill.shaft} {...cut(c.contour, color.ink, CONTOUR * 0.75)} />
    <path d={quill.nib} {...cut(c.inner, color.ink, DETAIL * 1.5)} />
  </g>
);

// ----------------------------------------------------------------- shared skeleton (local coords, nib at origin)
const FING: { ctrl: P[]; r0: number; r1: number }[] = [
  { ctrl: [[-40, -86], [-31, -68], [-18, -52]], r0: 9, r1: 6 }, // index, on the shaft
  { ctrl: [[-56, -90], [-45, -70], [-41, -50], [-50, -36]], r0: 8.8, r1: 6.8 }, // middle, curled
  { ctrl: [[-72, -92], [-60, -70], [-57, -48], [-66, -33]], r0: 8.4, r1: 6.4 },
  { ctrl: [[-87, -90], [-76, -68], [-73, -50], [-81, -37]], r0: 7.4, r1: 5.4 },
];
const THUMB = { ctrl: [[-98, -20], [-64, -10], [-38, -20], [-23, -34]] as P[], r0: 13, r1: 6.5 };
const DORSUM = 'M-38 -94 C-60 -102 -84 -102 -97 -93 L-119 -68 C-124 -50 -122 -34 -117 -22 L-101 -8 C-80 -3 -62 -12 -44 -30 L-34 -64 Z';
const SLEEVE: P[] = [[-156, -96], [-152, -8], [-300, 40], [-300, -170]];
const SLEEVE_D = poly([SLEEVE[0], SLEEVE[1], SLEEVE[2], SLEEVE[3]], true);
const CUFF_D = 'M-117 -84 L-113 -16 L-152 -6 L-156 -96 Z';

const gearPath = (cx: number, cy: number, r: number, n: number, rot: number) => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = rot + (i / n) * Math.PI * 2, st = (Math.PI * 2) / n;
    [[0, 0.8], [0.15, 1], [0.5, 1], [0.65, 0.8]].forEach(([f, rr]) => pts.push(`${f1(cx + Math.cos(a0 + f * st) * r * rr)} ${f1(cy + Math.sin(a0 + f * st) * r * rr)}`));
  }
  return 'M' + pts.join(' L') + ' Z';
};

// ----------------------------------------------------------------- the human hand
const HumanHand: React.FC<{ c: any; ids: string[] }> = ({ c, ids }) => {
  const [hull, sleeveClip, quillClip] = ids;
  const fingers = FING.map((f) => tube(f.ctrl, f.r0, f.r1));
  const thumb = tube(THUMB.ctrl, THUMB.r0, THUMB.r1);
  // joint creases: little arcs across each finger at two knuckles
  const creases: string[] = [];
  fingers.forEach((f, i) => {
    [0.34, 0.56].forEach((q) => {
      const k = Math.floor(f.c.length * q), p = f.c[k], n = f.nor[k], r = f.r(k) * 0.7;
      creases.push(`M${f1(p[0] + n[0] * r)} ${f1(p[1] + n[1] * r)} Q${f1(p[0] - n[1] * 1.6)} ${f1(p[1] + n[0] * 1.6)} ${f1(p[0] - n[0] * r)} ${f1(p[1] - n[1] * r)}`);
    });
  });
  const tcr = [0.4, 0.62].map((q) => { const k = Math.floor(thumb.c.length * q), p = thumb.c[k], n = thumb.nor[k], r = thumb.r(k) * 0.7; return `M${f1(p[0] + n[0] * r)} ${f1(p[1] + n[1] * r)} Q${f1(p[0])} ${f1(p[1] - 1.5)} ${f1(p[0] - n[0] * r)} ${f1(p[1] - n[1] * r)}`; }).join(' ');
  // tendons: four lines from the knuckles toward the wrist, slightly fanned
  const tendons = FING.map((f, i) => {
    const k = f.ctrl[0];
    return `M${f1(k[0] - 3)} ${f1(k[1] + 6)} C${f1(k[0] - 24)} ${f1(k[1] + 3)} ${f1(-92 - i * 3)} ${f1(-64 + i * 6)} ${f1(-112)} ${f1(-66 + i * 10)}`;
  }).join(' ');
  const knuckles = FING.map((f) => { const k = f.ctrl[0]; return `M${f1(k[0] - 7)} ${f1(k[1] + 3)} Q${f1(k[0])} ${f1(k[1] - 6)} ${f1(k[0] + 7)} ${f1(k[1] + 3)}`; }).join(' ');
  const veins = 'M-70 -82 C-82 -76 -86 -66 -98 -62 C-104 -60 -108 -52 -112 -48 M-52 -78 C-58 -70 -70 -66 -76 -58 C-82 -52 -90 -50 -96 -42';
  const wrinkles: string[] = [];
  for (let i = 0; i < 6; i++) wrinkles.push(`M${f1(-108 + i * 2.2)} ${f1(-30 - i * 3)} q6 -2 12 ${f1(i % 2 ? 1 : -1)}`);
  // sleeve folds: curves along the arm, fanning to the flare
  const folds: string[] = [];
  for (let k = 1; k < 11; k++) {
    const f = k / 11;
    const ax = SLEEVE[0][0] + (SLEEVE[1][0] - SLEEVE[0][0]) * f, ay = SLEEVE[0][1] + (SLEEVE[1][1] - SLEEVE[0][1]) * f;
    const bx = SLEEVE[3][0] + (SLEEVE[2][0] - SLEEVE[3][0]) * f, by = SLEEVE[3][1] + (SLEEVE[2][1] - SLEEVE[3][1]) * f;
    folds.push(`M${f1(ax)} ${f1(ay)} Q${f1((ax + bx) / 2 + (k % 2 ? 6 : -6))} ${f1((ay + by) / 2 + (k % 3 - 1) * 9)} ${f1(bx)} ${f1(by)}`);
  }
  return (
    <g>
      <Clip id={hull}>
        <path d={DORSUM} />
        {fingers.map((f, i) => <path key={i} d={f.d} />)}
        <path d={thumb.d} />
      </Clip>
      <Clip id={sleeveClip} d={SLEEVE_D} />
      {/* sleeve and cuff */}
      <path d={SLEEVE_D} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={folds.join(' ')} {...cut(c.inner, color.ink, DETAIL * 1.4)} opacity={0.75} />
      <Hatch clip={sleeveClip} p={c.shade} angle={-5} gap={4.4} op={0.42} box={[-300, -60, 150, 110]} />
      <Hatch clip={sleeveClip} p={c.shade} angle={-5} gap={9} op={0.2} box={[-300, -170, 150, 220]} />
      <path d={SLEEVE_D} {...cut(c.contour, color.ink, INNER)} />
      <path d={CUFF_D} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={CUFF_D} {...cut(c.contour, color.ink, CONTOUR)} />
      <path d="M-122 -80 L-118 -20 M-146 -90 L-142 -14" {...cut(c.detail, color.ink, DETAIL)} strokeDasharray="3 3" />
      <circle cx={-134} cy={-52} r={4.6} {...cut(c.inner, color.ink, INNER)} />
      <circle cx={-134} cy={-52} r={1.4} {...ink(c.inner, color.ink)} />
      {/* the hand: dorsum, then fingers, thumb in front */}
      <path d={DORSUM} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={DORSUM} {...cut(c.contour, color.ink, CONTOUR)} />
      {fingers.slice().reverse().map((f, i) => (
        <g key={i}>
          <path d={f.d} {...ink(c.contour, color.stageDeep, 1)} />
          <path d={f.d} {...cut(c.contour, color.ink, i === 3 ? CONTOUR : INNER * 1.15)} />
        </g>
      ))}
      <path d={knuckles} {...cut(c.inner, color.ink, DETAIL * 1.5)} />
      <path d={tendons} {...cut(c.inner, color.ink, DETAIL * 1.3)} opacity={0.85} />
      <path d={veins} {...cut(c.detail, color.ink, DETAIL)} opacity={0.35} />
      <path d={wrinkles.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.3} />
      <path d={creases.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.85} />
      {/* the pen is gripped between index and thumb: draw the quill shaft under the thumb, over the curled fingers */}
      <g transform="translate(-6 -16)"><Quill c={c} clipId={quillClip} /></g>
      <path d={fingers[0].d} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={fingers[0].d} {...cut(c.contour, color.ink, CONTOUR)} />
      <path d={thumb.d} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={thumb.d} {...cut(c.contour, color.ink, CONTOUR)} />
      <path d={tcr} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.85} />
      <path d="M-26 -50 q4 -8 11 -4 M-26 -33 q3 -5 9 -3" {...cut(c.detail, color.ink, DETAIL * 1.3)} />
      {/* shading: light from the upper left, so the underside (lower right) carries the cross-hatch */}
      <Hatch clip={hull} p={c.shade} angle={52} gap={4.4} cross op={0.36} box={[-124, -40, 110, 38]} />
      <Hatch clip={hull} p={c.shade} angle={52} gap={7} op={0.17} box={[-124, -104, 124, 106]} />
      <Hatch clip={hull} p={c.detail} angle={-24} gap={11} op={0.16} box={[-124, -104, 124, 106]} />
      <Stipple clip={hull} p={c.detail} n={110} seed={12} r={0.7} op={0.25} box={[-124, -104, 124, 106]} />
    </g>
  );
};

// ----------------------------------------------------------------- the automaton hand
const MachineHand: React.FC<{ c: any; ids: string[]; spin: number }> = ({ c, ids, spin }) => {
  const [hull, sleeveClip, quillClip] = ids;
  const segs: { d: string; inset: string; ax: P; bx: P; i: number }[] = [];
  const joints: P[] = [];
  FING.forEach((f, i) => {
    f.ctrl.forEach((p, k) => {
      if (k > 0) {
        const r0 = f.r0 + (f.r1 - f.r0) * ((k - 1) / (f.ctrl.length - 1)), r1 = f.r0 + (f.r1 - f.r0) * (k / (f.ctrl.length - 1));
        segs.push({ d: tube([f.ctrl[k - 1], p], r0 - 0.5, r1 - 0.5, false).d, inset: tube([f.ctrl[k - 1], p], r0 * 0.5, r1 * 0.5, false).d, ax: f.ctrl[k - 1], bx: p, i });
      }
      joints.push(p);
    });
  });
  const thumb = THUMB.ctrl.map((p, k) => (k > 0 ? { d: tube([THUMB.ctrl[k - 1], p], THUMB.r0 - (THUMB.r0 - THUMB.r1) * ((k - 1) / 3), THUMB.r0 - (THUMB.r0 - THUMB.r1) * (k / 3), false).d, ax: THUMB.ctrl[k - 1], bx: p } : null)).filter(Boolean) as { d: string; ax: P; bx: P }[];
  // sleeve → brass shell with rings; rings are lines across the arm, spaced with a perspective ramp
  const rings: string[] = [];
  for (let k = 1; k < 8; k++) {
    const f = Math.pow(k / 8, 1.15);
    const ax = SLEEVE[0][0] + (SLEEVE[3][0] - SLEEVE[0][0]) * f, ay = SLEEVE[0][1] + (SLEEVE[3][1] - SLEEVE[0][1]) * f;
    const bx = SLEEVE[1][0] + (SLEEVE[2][0] - SLEEVE[1][0]) * f, by = SLEEVE[1][1] + (SLEEVE[2][1] - SLEEVE[1][1]) * f;
    rings.push(`M${f1(ax)} ${f1(ay)} Q${f1((ax + bx) / 2 - 7)} ${f1((ay + by) / 2)} ${f1(bx)} ${f1(by)}`);
  }
  const bolts: React.ReactNode[] = [];
  for (let k = 0; k < 5; k++) bolts.push(<circle key={k} cx={-145 + (k % 2) * 2} cy={-86 + k * 19} r={2.6} {...cut(c.detail, color.ink, DETAIL * 1.2)} />);
  const plateLines = 'M-100 -86 L-96 -22 M-78 -96 L-70 -40 M-58 -98 L-50 -56';
  const pistons = 'M-170 -64 L-250 -84 M-170 -34 L-250 -34 M-170 -50 L-250 -60';
  return (
    <g>
      <Clip id={hull}>
        <path d={DORSUM} />
        {segs.map((s, i) => <path key={i} d={s.d} />)}
        {thumb.map((s, i) => <path key={'t' + i} d={s.d} />)}
      </Clip>
      <Clip id={sleeveClip} d={SLEEVE_D} />
      {/* forearm shell */}
      <path d={SLEEVE_D} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={rings.join(' ')} {...cut(c.inner, color.ink, INNER)} />
      <path d={pistons} {...cut(c.inner, color.ink, DETAIL * 1.6)} opacity={0.7} />
      <Hatch clip={sleeveClip} p={c.shade} angle={-84} gap={4.2} op={0.4} box={[-300, -60, 150, 110]} />
      <Hatch clip={sleeveClip} p={c.shade} angle={-84} gap={9} op={0.2} box={[-300, -170, 150, 220]} />
      <path d={SLEEVE_D} {...cut(c.contour, color.ink, INNER)} />
      {/* wrist bracket and gear */}
      <path d={CUFF_D} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={CUFF_D} {...cut(c.contour, color.ink, CONTOUR)} />
      <path d="M-120 -80 L-116 -20 M-148 -90 L-144 -12" {...cut(c.detail, color.ink, DETAIL)} />
      {bolts}
      <path d={gearPath(-112, -52, 25, 12, spin)} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={gearPath(-112, -52, 25, 12, spin)} {...cut(c.inner, color.ink, INNER)} />
      <circle cx={-112} cy={-52} r={12} {...cut(c.inner, color.ink, DETAIL * 1.5)} />
      <path d={[0, 1, 2, 3, 4, 5].map((k) => { const a = spin + (k * Math.PI) / 3; return `M${f1(-112 + Math.cos(a) * 3)} ${f1(-52 + Math.sin(a) * 3)} L${f1(-112 + Math.cos(a) * 12)} ${f1(-52 + Math.sin(a) * 12)}`; }).join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
      <circle cx={-112} cy={-52} r={3} {...ink(c.inner, color.ink)} />
      {/* the back of the hand: a plate, panel lines, rivets */}
      <path d={DORSUM} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={DORSUM} {...cut(c.contour, color.ink, CONTOUR)} />
      <path d={plateLines} {...cut(c.inner, color.ink, DETAIL * 1.5)} />
      {[[-48, -84], [-70, -90], [-90, -84], [-108, -70], [-104, -18], [-72, -14], [-46, -36]].map((p, i) => (
        <g key={i}><circle cx={p[0]} cy={p[1]} r={3.1} {...cut(c.detail, color.ink, DETAIL * 1.3)} /><circle cx={p[0]} cy={p[1]} r={0.9} {...ink(c.detail, color.ink)} /></g>
      ))}
      {/* finger plates, each with an inset panel, pivot rivets at every joint */}
      {segs.slice().reverse().map((s, i) => (
        <g key={i}>
          <path d={s.d} {...ink(c.contour, color.stageDeep, 1)} />
          <path d={s.d} {...cut(c.contour, color.ink, s.i === 0 ? CONTOUR : INNER * 1.15)} />
          <path d={s.inset} {...cut(c.detail, color.ink, DETAIL)} opacity={0.65} />
        </g>
      ))}
      <g transform="translate(-6 -16)"><Quill c={c} clipId={quillClip} /></g>
      <path d={segs.filter((s) => s.i === 0).map((s) => s.d).join(' ')} {...ink(c.contour, color.stageDeep, 1)} />
      <path d={segs.filter((s) => s.i === 0).map((s) => s.d).join(' ')} {...cut(c.contour, color.ink, CONTOUR)} />
      {thumb.map((s, i) => (
        <g key={i}>
          <path d={s.d} {...ink(c.contour, color.stageDeep, 1)} />
          <path d={s.d} {...cut(c.contour, color.ink, CONTOUR)} />
        </g>
      ))}
      {joints.concat(THUMB.ctrl.slice(0, 3)).map((p, i) => (
        <g key={i}><circle cx={p[0]} cy={p[1]} r={3.6} {...ink(c.inner, color.stageDeep)} /><circle cx={p[0]} cy={p[1]} r={3.6} {...cut(c.inner, color.ink, DETAIL * 1.6)} /><circle cx={p[0]} cy={p[1]} r={1.1} {...ink(c.detail, color.ink)} /></g>
      ))}
      <Hatch clip={hull} p={c.shade} angle={52} gap={4.4} cross op={0.34} box={[-124, -40, 110, 38]} />
      <Hatch clip={hull} p={c.shade} angle={-60} gap={7} op={0.17} box={[-124, -104, 124, 106]} />
      <Hatch clip={hull} p={c.detail} angle={20} gap={12} op={0.14} box={[-124, -104, 124, 106]} />
    </g>
  );
};

// ----------------------------------------------------------------- the page and its two baselines
const N_PTS = 72, X_H0 = 106, X_M0 = 294, SPAN = 82, Y0 = 326;
const humanY = (i: number, base: number, ph = 0) => base + 6.5 * Math.sin(i * 0.52 + 0.3 + ph) * (0.75 + 0.5 * Math.sin(i * 0.13 + ph)) + 2.6 * Math.sin(i * 1.27 + ph * 2) + i * 0.05;
const humanX = (i: number, x0: number, dir: number, ph = 0) => x0 + dir * ((i * SPAN) / N_PTS) + 3.2 * Math.cos(i * 0.52 + 0.3 + ph);
const tri = (i: number) => { const p = (i * SPAN) / N_PTS / 7; const f = p - Math.floor(p); return Math.abs(f * 2 - 1) * 2 - 1; };

export const TwoHands: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [pageClip, hH, hS, hQ, mH, mS, mQ, bounds] = useIds(8);
    const PAGE = 'M104 258 L296 258 L352 350 L48 350 Z';
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(34, 84);
          const idx = Math.min(N_PTS, t * N_PTS);
          const hPts: P[] = Array.from({ length: N_PTS + 1 }, (_, i) => [humanX(i, X_H0, 1), humanY(i, Y0)]);
          const mPts: P[] = Array.from({ length: N_PTS + 1 }, (_, i) => [humanX(i, X_M0, -1) - 3.2 * Math.cos(i * 0.52 + 0.3) , Y0 + 6 * tri(i)]);
          const at_ = (pts: P[]): P => { const k = Math.floor(idx), f = idx - k; const a = pts[k], b = pts[Math.min(N_PTS, k + 1)]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
          const hn = at_(hPts), mn = at_(mPts);
          const hTrail = poly(hPts.slice(0, Math.floor(idx) + 1).concat([hn]));
          const mTrail = poly(mPts.slice(0, Math.floor(idx) + 1).concat([mn]));
          // rows already written: irregular on the left half, ruled on the right
          const rows = [282, 298, 312].map((y, r) => {
            const left: P[] = Array.from({ length: 40 }, (_, i) => [96 + i * 2.5 + 2.6 * Math.cos(i * 0.52 + r), humanY(i * 0.9, y, r * 1.7) - (r === 2 ? 1 : 0)]);
            const right: P[] = Array.from({ length: 40 }, (_, i) => [204 + i * 2.5, y + 5 * (Math.abs(((i * 2.5) / 7) % 1 * 2 - 1) * 2 - 1)]);
            return { l: poly(left), r: poly(right) };
          });
          const spin = Math.max(0, c.since) * 0.05;
          const sh = (n: P) => `translate(${f1(n[0])} ${f1(n[1])})`;
          return (
            <g style={breathe(c.frame, 1, 190)}>
              <Clip id={pageClip} d={PAGE} />
              <Clip id={bounds}><rect x={16} y={16} width={368} height={368} /></Clip>
              <g clipPath={`url(#${bounds})`}>
              <g transform="translate(200 205) scale(1.25) translate(-200 -268)">
              <ellipse cx={200} cy={362} rx={150} ry={8} {...ink(c.shade, color.stageDeep, 1)} />
              {/* the sheet: slab edge, surface, ruled rows */}
              <path d="M48 350 L352 350 L352 357 L48 357 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M48 350 L48 357 L352 357 L352 350" {...cut(c.contour, color.ink, INNER)} />
              <path d="M58 354 H342" {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              <path d={PAGE} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={PAGE} {...cut(c.contour, color.ink, CONTOUR)} />
              <Hatch clip={pageClip} p={c.shade} angle={64} gap={9} op={0.22} box={[200, 258, 180, 92]} />
              <Stipple clip={pageClip} p={c.detail} n={200} seed={21} r={0.8} op={0.22} />
              {rows.map((r, i) => (
                <g key={i}>
                  <path d={r.l} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.8} />
                  <path d={r.r} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.8} />
                </g>
              ))}
              <path d="M200 264 V344" {...cut(c.detail, color.mute, DETAIL)} strokeDasharray="2 6" />
              {/* what each hand has written this shot */}
              <path d={hTrail} {...cut(1, color.ink, INNER)} />
              <path d={mTrail} {...cut(1, color.red, INNER * 1.1)} />
              <ellipse cx={hn[0]} cy={hn[1] + 1} rx={3.4} ry={2} {...ink(c.shade, color.ink)} />
              <ellipse cx={mn[0]} cy={mn[1] + 1} rx={3.4} ry={2} {...ink(c.shade, color.red)} />
              {/* cast shadows of the hands on the sheet */}
              <ellipse cx={hn[0] - 26} cy={hn[1] + 10} rx={44} ry={6} {...ink(c.shade, color.stageDeep, 0.85)} />
              <ellipse cx={mn[0] + 26} cy={mn[1] + 10} rx={44} ry={6} {...ink(c.shade, color.stageDeep, 0.85)} />
              <g>
                <g transform={`${sh(hn)} rotate(25) scale(0.92) translate(6 16)`}><HumanHand c={c} ids={[hH, hS, hQ]} /></g>
                <g transform={`${sh(mn)} scale(-1 1) rotate(25) scale(0.92) translate(6 16)`}><MachineHand c={c} ids={[mH, mS, mQ]} spin={spin} /></g>
              </g>
              </g>
              </g>
            </g>
          );
        }}
      </Plate>
    );
  };
