/**
 * **DriftingCourse** — a sea chart, engraved: hatched shore, an island ringed with soundings, a compass rose in the
 * corner with rhumb lines fanning across the water, a port on the mainland. Two courses leave the same port. The true
 * one (fine dashes) runs straight to the island. The plotted one (solid red) starts on the same bearing and bends
 * from it a fraction of a degree further with every league — a tick marks each degree of error — until it is far out
 * in open water, and a small ship is sailing along it.
 *
 * Motion: the ship travels the wrong course over the shot, the red trail grows behind it, and a gauge line from ship
 * to the true course lengthens as the gap opens. Red: the plotted course (and the ship's pennant).
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color, font } from '../tokens';

const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const f1 = (n: number) => n.toFixed(1);
type Pt = [number, number];
const toPath = (p: Pt[], close = false) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join(' ') + (close ? ' Z' : '');

/** Catmull-Rom through the key points, densely sampled: natural-looking coast from a handful of numbers. */
const catmull = (pts: Pt[], closed: boolean, steps = 7): Pt[] => {
  const n = pts.length, out: Pt[] = [];
  const at = (i: number) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)) as Pt);
    }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
};
const offset = (pts: Pt[], d: number): Pt[] =>
  pts.map(([x, y], i) => {
    const [x0, y0] = pts[Math.max(0, i - 1)], [x1, y1] = pts[Math.min(pts.length - 1, i + 1)];
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
    return [x + (dy / L) * d, y - (dx / L) * d] as Pt;
  });

// ---- the geography (all fixed) -----------------------------------------------------------------------------------
const PORT: Pt = [64, 314];
const ISLE: Pt = [302, 112];
const COAST_KEY: Pt[] = [[22, 196], [40, 226], [50, 258], [44, 290], [64, 314], [88, 330], [96, 354], [128, 372], [152, 388]];
const COAST = catmull(COAST_KEY, false);
const LAND_D = toPath(COAST) + ' L152 392 L18 392 L18 196 Z';
const isleKey: Pt[] = (() => {
  const r = rng(61);
  return Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2, rad = 25 + r() * 11 + (i % 3 === 0 ? 7 : 0);
    return [ISLE[0] + Math.cos(a) * rad * 1.25, ISLE[1] + Math.sin(a) * rad * 0.88] as Pt;
  });
})();
const ISLAND = catmull(isleKey, true, 6);
const ISLAND_D = toPath(ISLAND, true);

// ---- the two courses ---------------------------------------------------------------------------------------------
const THETA0 = Math.atan2(ISLE[0] - PORT[0], PORT[1] - ISLE[1]); // bearing from north, clockwise
const K = 0.0021; // radians of error added per unit of distance
const trueEnd: Pt = (() => { const dx = ISLE[0] - PORT[0], dy = ISLE[1] - PORT[1], L = Math.hypot(dx, dy); return [PORT[0] + (dx / L) * (L - 30), PORT[1] + (dy / L) * (L - 30)]; })();
const plotted: { p: Pt; s: number; head: number }[] = (() => {
  const out: { p: Pt; s: number; head: number }[] = [{ p: PORT, s: 0, head: THETA0 }];
  let [x, y] = PORT;
  for (let s = 4; s < 520; s += 4) {
    const h = THETA0 + K * s;
    x += Math.sin(h) * 4; y -= Math.cos(h) * 4;
    out.push({ p: [x, y], s, head: h });
    if (x > 366 || y < 34 || y > 372) break;
  }
  return out;
})();
const SMAX = plotted[plotted.length - 1].s;
const pointAt = (s: number) => {
  const i = clamp(s / 4, 0, plotted.length - 1), a = Math.floor(i), b = Math.min(plotted.length - 1, a + 1), f = i - a;
  return { p: [plotted[a].p[0] + (plotted[b].p[0] - plotted[a].p[0]) * f, plotted[a].p[1] + (plotted[b].p[1] - plotted[a].p[1]) * f] as Pt, head: plotted[a].head + (plotted[b].head - plotted[a].head) * f };
};
/** nearest point on the true course (the segment PORT to trueEnd) */
const nearestTrue = (q: Pt): Pt => {
  const vx = trueEnd[0] - PORT[0], vy = trueEnd[1] - PORT[1], t = clamp(((q[0] - PORT[0]) * vx + (q[1] - PORT[1]) * vy) / (vx * vx + vy * vy));
  return [PORT[0] + vx * t, PORT[1] + vy * t];
};
const dist2seg = (p: Pt, a: Pt, b: Pt) => { const q = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / (((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) || 1); const t = clamp(q); return Math.hypot(p[0] - (a[0] + (b[0] - a[0]) * t), p[1] - (a[1] + (b[1] - a[1]) * t)); };

// ---- soundings: depth numerals that deepen with distance from land -------------------------------------------------
const SOUNDINGS = (() => {
  const r = rng(808), out: { x: number; y: number; n: number }[] = [];
  for (let i = 0; i < 400 && out.length < 40; i++) {
    const x = 28 + r() * 344, y = 28 + r() * 344;
    let dl = 1e9;
    for (let k = 0; k < COAST.length - 1; k += 2) dl = Math.min(dl, dist2seg([x, y], COAST[k], COAST[k + 1]));
    const di = Math.max(0, Math.hypot((x - ISLE[0]) / 1.25, (y - ISLE[1]) / 0.88) - 30);
    const dc = dist2seg([x, y], PORT, trueEnd);
    const nearCoast = x < 120 && y > 190 && dl < 18;
    if (dl < 14 || di < 14 || dc < 10 || nearCoast || Math.hypot(x - 88, y - 100) < 46) continue;
    if (out.some((o) => Math.hypot(o.x - x, o.y - y) < 30)) continue;
    out.push({ x, y, n: Math.round(3 + Math.min(dl, di * 1.6) / 6 + r() * 3) });
  }
  return out;
})();

// ---- the compass rose (upper left) -------------------------------------------------------------------------------
const RC: Pt = [88, 100];
const polar = (a: number, r: number): Pt => [RC[0] + Math.sin((a * Math.PI) / 180) * r, RC[1] - Math.cos((a * Math.PI) / 180) * r];
const ROSE = (() => {
  const out: string[] = [], hat: string[] = [], rh: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = i * 22.5, L = i % 4 === 0 ? 36 : i % 2 === 0 ? 27 : 19, bw = i % 4 === 0 ? 11 : 8;
    const T = polar(a, L), Bl = polar(a - bw, 9), Br = polar(a + bw, 9);
    out.push(`M${f1(Bl[0])} ${f1(Bl[1])} L${f1(T[0])} ${f1(T[1])} L${f1(Br[0])} ${f1(Br[1])}`);
    const m = i % 4 === 0 ? 3 : 2;
    for (let j = 1; j <= m; j++) {
      const u = j / (m + 1);
      hat.push(`M${f1(RC[0] + (Bl[0] - RC[0]) * u)} ${f1(RC[1] + (Bl[1] - RC[1]) * u)} L${f1(Bl[0] + (T[0] - Bl[0]) * u)} ${f1(Bl[1] + (T[1] - Bl[1]) * u)}`);
    }
    // rhumb lines: from the rose (and from a second centre) fanning over the whole chart
    const e = polar(a, 520);
    rh.push(`M${f1(RC[0])} ${f1(RC[1])} L${f1(e[0])} ${f1(e[1])}`);
    const o2: Pt = [286, 300], e2: Pt = [o2[0] + Math.sin((a * Math.PI) / 180) * 520, o2[1] - Math.cos((a * Math.PI) / 180) * 520];
    rh.push(`M${o2[0]} ${o2[1]} L${f1(e2[0])} ${f1(e2[1])}`);
  }
  const tk = Array.from({ length: 72 }, (_, d) => { const a = d * 5, r0 = d % 2 ? 40 : 38; const p0 = polar(a, r0), p1 = polar(a, 43); return `M${f1(p0[0])} ${f1(p0[1])} L${f1(p1[0])} ${f1(p1[1])}`; }).join(' ');
  return { outline: out.join(' '), hat: hat.join(' '), rhumb: rh.join(' '), ticks: tk };
})();

const SAIL_A = 'M-13 -22 Q-4 -19 4 -22 L3 -8 Q-4 -5 -12 -8 Z';
const SAIL_B = 'M2 -17 Q10 -15 14 -17 L13 -7 Q8 -5 3 -7 Z';
const Ship: React.FC<{ x: number; y: number; p: number; frame: number }> = ({ x, y, p, frame }) => {
  const bob = Math.sin(frame / 9) * 0.8;
  return (
    <g transform={`translate(${f1(x)} ${f1(y + bob)})`}>
      <ellipse cx={0} cy={9} rx={20} ry={3} {...ink(p, color.stageDeep, 0.95)} />
      <path d="M-12 8 Q0 11 12 8 M-18 10 Q-8 12.5 4 10" {...cut(p, color.ink, DETAIL)} opacity={0.6} />
      <path d="M-15 0 L15 0 L11 7 L-11 7 Z" {...ink(p, color.stageDeep, 1)} />
      <path d="M-4 0 V-26 M7 0 V-20 M-9 -2 L-19 -6" {...cut(p, color.ink, INNER * 0.8)} />
      <path d={SAIL_A} {...ink(p, color.stageDeep, 1)} />
      <path d={SAIL_A} {...cut(p, color.ink, INNER * 0.8)} />
      <path d="M-11 -18 L1 -17 M-11 -14 L2 -13 M-10 -10 L2 -10" {...cut(p, color.ink, DETAIL * 0.8)} />
      <path d={SAIL_B} {...ink(p, color.stageDeep, 1)} />
      <path d={SAIL_B} {...cut(p, color.ink, INNER * 0.8)} />
      <path d="M-15 0 L15 0 L11 7 L-11 7 Z" {...cut(p, color.ink, INNER)} />
      <path d="M-13 3 H13" {...cut(p, color.ink, DETAIL)} />
      <path d={`M-4 -26 l9 ${f1(2 + Math.sin(frame / 6) * 1.2)} l-9 3 Z`} {...ink(p, color.red)} />
    </g>
  );
};

export const DriftingCourse: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [land, frame, isle] = useIds(3);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = ss(0, 1, c.at(34, 110));
          const s = SMAX * t;
          const ship = pointAt(s);
          const trail = plotted.filter((q) => q.s <= s).map((q) => q.p);
          trail.push(ship.p);
          const gapTo = nearestTrue(ship.p);
          const gapLen = Math.hypot(ship.p[0] - gapTo[0], ship.p[1] - gapTo[1]);
          // a tick at every degree of accumulated error
          const degs: string[] = [];
          for (let d = 1; (d * 0.01745) / K <= s; d++) {
            const q = pointAt((d * 0.01745) / K);
            const nx = Math.cos(q.head), ny = Math.sin(q.head);
            const len = d % 5 === 0 ? 9 : 5;
            degs.push(`M${f1(q.p[0] - nx * len)} ${f1(q.p[1] - ny * len)} L${f1(q.p[0] + nx * len)} ${f1(q.p[1] + ny * len)}`);
          }
          const shore = [8, 15, 23, 32, 42].map((d, i) => <path key={i} d={toPath(offset(COAST, d))} {...cut(c.shade, color.ink, DETAIL * (1 - i * 0.1), i % 2 ? '10 4' : undefined)} opacity={0.7 - i * 0.12} />);
          const rings = [1.16, 1.34, 1.56, 1.84].map((k, i) => (
            <path key={i} d={toPath(ISLAND.map(([x, y]) => [ISLE[0] + (x - ISLE[0]) * k, ISLE[1] + (y - ISLE[1]) * k] as Pt), true)} {...cut(c.shade, color.ink, DETAIL * (1 - i * 0.1), i % 2 ? '9 4' : undefined)} opacity={0.7 - i * 0.14} />
          ));
          const rh = rng(15);
          const hills = Array.from({ length: 36 }, () => {
            const a = rh() * 6.28, r = rh() * 20, x = ISLE[0] + Math.cos(a) * r * 1.25, y = ISLE[1] + Math.sin(a) * r * 0.8;
            return `M${f1(x)} ${f1(y)} l-3 5 M${f1(x)} ${f1(y)} l3 5`;
          }).join(' ');
          const inland = Array.from({ length: 48 }, () => { const x = 20 + rh() * 60, y = 220 + rh() * 160; return `M${f1(x)} ${f1(y)} l-3 5 M${f1(x)} ${f1(y)} l3 5`; }).join(' ');

          return (
            <g style={breathe(c.frame, 0.9, 220)}>
              <Clip id={land} d={LAND_D} />
              <Clip id={isle} d={ISLAND_D} />
              <Clip id={frame}><rect x={22} y={22} width={356} height={356} /></Clip>
              {/* neatline */}
              <path d="M14 14 H386 V386 H14 Z" {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
              <path d="M22 22 H378 V378 H22 Z" {...cut(c.inner, color.ink, DETAIL)} />
              <path d={Array.from({ length: 17 }, (_, k) => { const p = 22 + k * 22.25; return `M${f1(p)} 14 V22 M${f1(p)} 378 V386 M14 ${f1(p)} H22 M378 ${f1(p)} H386`; }).join(' ')} {...cut(c.detail, color.ink, DETAIL)} />
              {/* rhumb lines */}
              <g clipPath={`url(#${frame})`}><path d={ROSE.rhumb} fill="none" stroke={color.ink} strokeWidth={DETAIL * 0.7} opacity={0.2 * c.detail} /></g>
              {/* shore water-lining, then the land */}
              {shore}
              <path d={LAND_D} {...ink(c.shade, color.stageDeep, 1)} />
              <path d={toPath(COAST)} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <g clipPath={`url(#${land})`}><path d={inland} fill="none" stroke={color.ink} strokeWidth={DETAIL} opacity={0.5 * c.detail} /></g>
              <Hatch clip={land} p={c.shade} angle={64} gap={5} op={0.26} box={[18, 196, 140, 196]} />
              <Stipple clip={land} p={c.detail} n={240} seed={5} r={0.9} op={0.26} box={[18, 196, 140, 196]} />
              {/* the island */}
              {rings}
              <path d={ISLAND_D} {...ink(c.shade, color.stageDeep, 1)} />
              <path d={ISLAND_D} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <g clipPath={`url(#${isle})`}><path d={hills} fill="none" stroke={color.ink} strokeWidth={DETAIL} opacity={0.65 * c.detail} /></g>
              <Hatch clip={isle} p={c.shade} angle={55} gap={4.5} op={0.3} box={[ISLE[0], ISLE[1] - 30, 50, 60]} />
              <Stipple clip={isle} p={c.detail} n={120} seed={9} r={0.8} op={0.24} box={[ISLE[0] - 50, ISLE[1] - 36, 100, 72]} />
              {/* soundings */}
              {SOUNDINGS.map((o, i) => (
                <text key={i} x={o.x} y={o.y} textAnchor="middle" fontFamily={font.mono} fontSize={8.5} fill={color.ink} opacity={0.5 * c.detail}>{o.n}</text>
              ))}
              {/* rose */}
              <circle cx={RC[0]} cy={RC[1]} r={43} {...cut(c.inner, color.ink, INNER * 0.9)} />
              <circle cx={RC[0]} cy={RC[1]} r={38} {...cut(c.detail, color.ink, DETAIL)} />
              <path d={ROSE.ticks} {...cut(c.detail, color.ink, DETAIL * 0.8)} />
              <path d={ROSE.hat} {...cut(c.shade, color.ink, DETAIL * 0.8)} opacity={0.75} />
              <path d={ROSE.outline} {...cut(c.inner, color.ink, INNER * 0.8)} />
              <path d={`M${f1(RC[0])} ${f1(RC[1] - 36)} L${f1(RC[0])} ${f1(RC[1] + 36)} M${f1(RC[0] - 36)} ${f1(RC[1])} L${f1(RC[0] + 36)} ${f1(RC[1])}`} {...cut(c.inner, color.ink, DETAIL)} />
              {/* port: an anchor-ring and a pier */}
              <circle cx={PORT[0]} cy={PORT[1]} r={6} {...ink(c.inner, color.stageDeep, 1)} />
              <circle cx={PORT[0]} cy={PORT[1]} r={6} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${PORT[0]} ${PORT[1] - 11} V${PORT[1] + 4} M${PORT[0] - 4} ${PORT[1] - 7} H${PORT[0] + 4} M${PORT[0]} ${PORT[1] + 4} q-6 0 -7 -5 M${PORT[0]} ${PORT[1] + 4} q6 0 7 -5`} {...cut(c.detail, color.ink, DETAIL * 1.1)} />
              <path d={`M${PORT[0] + 5} ${PORT[1] + 3} l14 6 M${PORT[0] + 3} ${PORT[1] + 6} l14 6`} {...cut(c.detail, color.ink, DETAIL)} />
              {/* the true course: fine dashes, straight to the island */}
              <path d={`M${f1(PORT[0])} ${f1(PORT[1])} L${f1(trueEnd[0])} ${f1(trueEnd[1])}`} {...cut(c.inner, color.ink, INNER * 0.8, '7 5')} />
              {/* the plotted course: solid red, a degree of error at a time */}
              <path d={toPath(trail)} fill="none" stroke={color.red} strokeWidth={INNER * 1.25} strokeLinecap="round" strokeLinejoin="round" opacity={c.inner} />
              <path d={degs.join(' ')} {...cut(c.detail, color.red, DETAIL * 1.1)} />
              {/* the gap */}
              {gapLen > 6 && (
                <g opacity={ss(6, 24, gapLen)}>
                  <path d={`M${f1(ship.p[0])} ${f1(ship.p[1])} L${f1(gapTo[0])} ${f1(gapTo[1])}`} {...cut(c.detail, color.ink, DETAIL * 1.2, '3 3')} />
                  <circle cx={gapTo[0]} cy={gapTo[1]} r={2.6} {...ink(1, color.ink)} />
                </g>
              )}
              <Ship x={ship.p[0]} y={ship.p[1] - 8} p={c.inner} frame={c.frame} />
            </g>
          );
        }}
      </Plate>
    );
  };
