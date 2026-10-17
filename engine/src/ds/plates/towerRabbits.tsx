/**
 * **TowerRabbits** — the Nature 2024 degenerate output, drawn literally: asked about English church towers, by the
 * ninth round the model was writing about jackrabbits.
 *
 * A Perpendicular tower — crenellated parapet, belfry lancets, stepped buttresses — built as real coursed ashlar
 * (every block generated from a seeded loop). Its lower third is dissolving. The craft is the seam: blocks just under
 * the dissolve line round off, tip, sprout ears and drift away as haunches, and below them the stones are gone and a
 * scurry of jackrabbits (varied scale, pose, hop phase) is bounding off across the grass.
 *
 * Motion: the dissolve line creeps up the wall, new rabbits are born out of the stone it passes, and every rabbit hops
 * on its own phase while it runs outward. Red: the lead rabbit, the one that has already left the sentence.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const f1 = (n: number) => n.toFixed(1);

// ---- tower geometry -------------------------------------------------------------------------------------------
const CX = 200;
const TOP = 104; // top of the shaft courses (parapet sits above)
const COURSE = 14;
/** left/right edge of the walling at height y: the shaft with stepped buttresses at the foot. */
const xl = (y: number) => (y < 206 ? 140 : y < 262 ? 130 : 121);
const xr = (y: number) => 400 - xl(y);
const DY0 = 304, DY1 = 258; // dissolve line start / end

const lancet = (x0: number, x1: number, yb: number, yt: number) => {
  const cx = (x0 + x1) / 2, ya = yt + (x1 - x0) * 0.95, k = yt + (x1 - x0) * 0.32;
  return `M${x0} ${yb} L${x0} ${f1(ya)} Q${x0} ${f1(k)} ${f1(cx)} ${yt} Q${x1} ${f1(k)} ${x1} ${f1(ya)} L${x1} ${yb} Z`;
};

/** Crenellated parapet outline: six merlons, five embrasures. */
const parapet = () => {
  const x0 = 132, x1 = 268, top = 60, floor = 77, base = 100;
  const n = 6, mw = 14, gw = (x1 - x0 - n * mw) / (n - 1);
  let d = `M${x0} ${base} L${x0} ${top}`;
  let x = x0;
  for (let i = 0; i < n; i++) {
    d += ` L${f1(x + mw)} ${top}`;
    if (i < n - 1) d += ` L${f1(x + mw)} ${floor} L${f1(x + mw + gw)} ${floor} L${f1(x + mw + gw)} ${top}`;
    x += mw + gw;
  }
  return d + ` L${x1} ${base} Z`;
};

/** Tower body polygon, cut off along a ragged dissolve edge at dY. */
const bodyPoly = (dY: number, edge: number[]) => {
  let d = `M140 ${TOP - 4} L140 206 L130 206 L130 262 L121 262 L121 ${f1(dY)}`;
  for (let i = 0; i < edge.length; i++) d += ` L${f1(121 + (158 * (i + 1)) / edge.length)} ${f1(dY + edge[i])}`;
  return d + ` L279 262 L270 262 L270 206 L260 206 L260 ${TOP - 4} Z`;
};

// ---- rabbit ---------------------------------------------------------------------------------------------------
const BODY = 'M-16 3 C-19 -9 -7 -15 5 -13 C14 -12 18 -7 18 0 C18 7 10 11 0 11 C-8 11 -15 9 -16 3 Z';
const HEAD = 'M14 -9 C16 -17 26 -18 30 -11 C32 -8 31 -5 28 -4 C22 -1 15 -2 14 -9 Z';

const Rabbit: React.FC<{ kind: number; hop: number; p: number; red?: boolean }> = ({ kind, hop, p, red }) => {
  const col = red ? color.red : color.ink;
  const tilt = kind === 1 ? -34 : -30 * hop + (kind === 2 ? 8 : 0);
  const earA = kind === 1 ? 4 : 20 + 38 * hop; // ears streamed back when airborne
  const stretch = kind === 2 ? 1.18 : 1;
  const leg = hop;
  return (
    <g transform={`rotate(${f1(tilt)} 0 4) scale(${stretch} 1)`}>
      <path d={BODY} {...ink(p, color.stageDeep, 0.95)} />
      <path d={HEAD} {...ink(p, color.stageDeep, 0.95)} />
      <path d="M-12 -2 C-6 -9 4 -7 7 3" {...cut(p, col, INNER * 0.8)} />
      <path d={`M-9 6 C-1 12 ${f1(8 + 8 * leg)} 12 ${f1(15 + 9 * leg)} ${f1(12 - 2 * leg)}`} {...cut(p, col, INNER * 0.8)} />
      <path d={`M16 -2 L${f1(21 + 6 * leg)} ${f1(9 - 4 * leg)} L${f1(27 + 6 * leg)} ${f1(9 - 4 * leg)}`} {...cut(p, col, INNER * 0.7)} />
      <g transform={`rotate(${f1(-earA)} 19 -14)`}>
        <path d="M17 -15 C13 -25 12 -33 15 -39 C20 -34 22 -25 22 -15" {...cut(p, col, INNER * 0.8)} />
        <path d="M17 -18 C16 -25 16 -30 17 -34" {...cut(p, col, DETAIL * 0.9)} />
      </g>
      <g transform={`rotate(${f1(-earA * 0.7 - 7)} 22 -13)`}>
        <path d="M21 -14 C19 -24 19 -31 22 -36 C26 -31 27 -23 25 -13" {...cut(p, col, INNER * 0.8)} />
      </g>
      <path d={BODY} {...cut(p, col, CONTOUR * 0.72)} />
      <path d={HEAD} {...cut(p, col, CONTOUR * 0.72)} />
      <circle cx={-17.5} cy={-1} r={3.6} {...cut(p, col, INNER * 0.8)} />
      <circle cx={25} cy={-11} r={1.9} {...ink(p, col)} />
      <path d="M-13 3 L-8 9 M-9 0 L-4 7 M-4 -1 L1 6 M2 0 L7 7 M-14 -5 L-11 -2 M7 -9 L11 -5" {...cut(p, col, DETAIL * 0.8)} />
      <path d="M29 -7 L33 -6 M29 -5 L33 -3" {...cut(p, col, DETAIL * 0.7)} />
    </g>
  );
};

const WINDOWS: [number, number, number, number][] = [[158, 176, 116, 168], [224, 242, 116, 168], [190, 210, 188, 250]];

export const TowerRabbits: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [bodyClip, winA, winB, winC] = useIds(4);
    const winIds = [winA, winB, winC];
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(26, 150);
          const dY = DY0 + (DY1 - DY0) * ss(0, 1, t);
          const r = rng(31);
          const edge = Array.from({ length: 14 }, () => (r() - 0.5) * 12);
          const body = bodyPoly(dY, edge);

          // ---- coursed stonework ---------------------------------------------------------------------------
          const intact: string[] = [];
          const tooling: string[] = [];
          const fray: React.ReactNode[] = [];
          const rs = rng(7);
          for (let row = 0, y0 = TOP; y0 < 346; row++, y0 += COURSE) {
            const left = xl(y0), right = xr(y0);
            let x = left - (row % 2 ? 12 : 0) + (rs() * 4 - 2);
            while (x < right) {
              const bw = 18 + rs() * 12;
              const bx0 = Math.max(x, left), bx1 = Math.min(x + bw, right);
              x += bw;
              if (bx1 - bx0 < 5) continue;
              const cy = y0 + COURSE / 2, cx = (bx0 + bx1) / 2;
              const jitter = rs() - 0.5, tick = rs(), tickLen = 3 + rs() * 5, tickY = 5 + rs() * 4;
              const dxr = 0.6 + rs() * 0.8, dyr = 0.5 + rs(), rotr = rs() + 0.3;
              const fr = (cy - dY) / 52 + jitter * 0.25; // <0 intact, 0..1 turning, >1 gone
              if (fr < 0) {
                intact.push(`M${f1(bx0 + 0.8)} ${y0 + 0.8} H${f1(bx1 - 0.8)} V${y0 + COURSE - 0.8} H${f1(bx0 + 0.8)} Z`);
                if (tick > 0.55) tooling.push(`M${f1(bx0 + 4)} ${f1(y0 + tickY)} l${f1(tickLen)} 0`);
              } else if (fr < 1) {
                const k = ss(0, 1, fr), dir = cx < CX ? -1 : 1;
                const bwid = bx1 - bx0 - 1.6, bh = COURSE - 1.6;
                const rad = (Math.min(bwid, bh) / 2) * (0.15 + 0.85 * k);
                const dx = dir * k * 26 * dxr, dy = k * 14 * dyr, rot = dir * k * 38 * rotr, sc = 1 - 0.18 * k;
                fray.push(
                  <g key={`${row}-${f1(bx0)}`} transform={`translate(${f1(cx + dx)} ${f1(cy + dy)}) rotate(${f1(rot)}) scale(${sc.toFixed(2)})`}>
                    <rect x={-bwid / 2} y={-bh / 2} width={bwid} height={bh} rx={rad} {...cut(c.inner, color.ink, INNER * (1.2 - 0.3 * k))} />
                    {k > 0.35 && <path d={`M${f1(-bwid * 0.3)} ${f1(bh * 0.1)} Q0 ${f1(-bh * 0.5)} ${f1(bwid * 0.35)} ${f1(bh * 0.15)}`} {...cut(c.detail, color.ink, DETAIL)} />}
                    {k > 0.5 && <path d={`M${f1(bwid * 0.2)} ${f1(-bh / 2)} q${f1(-2 - 3 * k)} ${f1(-9 * k)} ${f1(-5 * k)} ${f1(-14 * k)} M${f1(bwid * 0.32)} ${f1(-bh / 2)} q${f1(1 + 2 * k)} ${f1(-9 * k)} ${f1(-1 * k)} ${f1(-15 * k)}`} {...cut(c.inner, color.ink, DETAIL * 1.2)} />}
                    {k > 0.2 && <path d={`M${f1(-bwid * 0.2)} ${f1(bh * 0.25)} l5 -4 M${f1(-bwid * 0.05)} ${f1(bh * 0.3)} l5 -4`} {...cut(c.detail, color.ink, DETAIL * 0.8)} />}
                  </g>,
                );
              }
            }
          }

          // ---- stone chips tumbling off the seam ----------------------------------------------------------
          const rc = rng(91);
          const chips = Array.from({ length: 16 }, (_, i) => {
            const x = 125 + rc() * 150, y = dY + 4 + rc() * 56, a = rc() * 6.28, s = 2.6 + rc() * 3.4;
            const fall = (c.frame * 0.35 + i * 17) % 40;
            const dx = (x < CX ? -1 : 1) * fall * 0.5;
            const pts = [0, 1, 2, 3].map((k) => `${f1(x + dx + Math.cos(a + k * 1.6) * s * (0.7 + 0.2 * ((k * 7 + i) % 3)))} ${f1(y + fall * 0.9 + Math.sin(a + k * 1.6) * s * 0.7)}`);
            return <path key={i} d={`M${pts.join(' L')} Z`} {...cut(c.detail * (1 - fall / 55), color.ink, DETAIL)} />;
          });

          // ---- the rabbits ---------------------------------------------------------------------------------
          const rr = rng(1618);
          const rabbits = Array.from({ length: 17 }, (_, i) => {
            const yRest = 292 + rr() * 62;
            const x0 = 80 + rr() * 240;
            const birth = clamp(rr() * 0.8, 0, 0.8);
            const kind = i % 5 === 3 ? 1 : i % 4 === 1 ? 2 : 0;
            return { yRest, x0, birth, kind, dir: x0 < CX ? -1 : 1, sc: 0.8 + ((yRest - 292) / 62) * 0.8, ph: rr() * 6.28, sp: 0.16 + rr() * 0.06, dist: 34 + rr() * 56 };
          }).sort((a, b) => a.yRest - b.yRest);
          const lead = rabbits.length - 1;
          rabbits[lead].birth = 0.08; rabbits[lead].dist = 80; rabbits[lead].x0 = 292;
          const rabbitEls = rabbits.map((rb, i) => {
            const tt = t - rb.birth * 0.85;
            const life = clamp(tt, 0, 1);
            const born = ss(0, 0.07, tt);
            if (born <= 0.01) return null;
            const hopRaw = Math.max(0, Math.sin(c.frame * rb.sp + rb.ph));
            const hop = rb.kind === 1 ? hopRaw * 0.25 : hopRaw;
            const x = rb.x0 + rb.dir * (life * rb.dist + (rb.kind === 1 ? 0 : hopRaw * 4));
            const y = rb.yRest - hop * 17 * rb.sc;
            return (
              <g key={i}>
                <ellipse cx={f1(x)} cy={f1(rb.yRest + 12 * rb.sc)} rx={f1(17 * rb.sc * (1 - 0.25 * hop))} ry={f1(3.2 * rb.sc)} {...ink(c.shade * born, color.stageDeep, 0.9)} />
                <g transform={`translate(${f1(x)} ${f1(y)}) scale(${f1(rb.sc * rb.dir * born)} ${f1(rb.sc * born)})`}>
                  <Rabbit kind={rb.kind} hop={hop} p={c.detail} red={i === lead} />
                </g>
              </g>
            );
          });

          // ---- ground burin lines --------------------------------------------------------------------------
          const rg = rng(5);
          const ground = Array.from({ length: 22 }, (_, i) => {
            const y = 356 + i * 1.1, xa = 40 + rg() * 90, xb = 260 + rg() * 100;
            return `M${f1(xa + i * 2)} ${f1(y)} L${f1(xb - i * 3)} ${f1(y + rg() * 1.5)}`;
          }).join(' ');
          const tufts = Array.from({ length: 22 }, () => {
            const x = 40 + rg() * 320, y = 349 + rg() * 12;
            return `M${f1(x)} ${f1(y)} l-2 -7 M${f1(x)} ${f1(y)} l1 -9 M${f1(x)} ${f1(y)} l4 -6`;
          }).join(' ');

          return (
            <g style={breathe(c.frame, 1.0, 200)}>
              <Clip id={bodyClip} d={`${body} ${parapet()}`} />
              <path d={ground} {...cut(c.shade, color.ink, DETAIL)} opacity={0.4} />
              <path d={tufts} {...cut(c.detail, color.ink, DETAIL)} />
              {/* cast shadow thrown to the lower right */}
              <path d={`M270 ${f1(dY)} L338 ${f1(dY + 10)} L338 ${f1(dY + 26)} L262 ${f1(dY + 12)} Z`} {...ink(c.shade, color.stageDeep, 0.8)} />

              {/* walling: courses, then parapet */}
              <path d={body} {...ink(c.shade, color.stageDeep, 0.9)} />
              <path d={intact.join(' ')} {...cut(c.detail, color.ink, DETAIL)} />
              <path d={tooling.join(' ')} {...cut(c.detail, color.ink, DETAIL * 0.8)} opacity={0.6} />
              {fray}
              {chips}
              <path d={parapet()} {...ink(c.shade, color.stageDeep, 0.9)} />
              <path d={parapet()} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M132 100 H268 M136 104 H264" {...cut(c.inner, color.ink, INNER)} />
              <path d={Array.from({ length: 17 }, (_, i) => `M${f1(136 + i * 8.2)} 100 q2 6 4 0`).join(' ')} {...cut(c.detail, color.ink, DETAIL)} />
              {/* silhouette of the walling: open at the bottom, because that is where it is going */}
              <path d={`M140 ${TOP - 4} L140 206 L130 206 L130 262 L121 262 L121 ${f1(dY)}`} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={`M260 ${TOP - 4} L260 206 L270 206 L270 262 L279 262 L279 ${f1(dY)}`} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M130 206 L140 198 M121 262 L130 254 M270 206 L260 198 M279 262 L270 254" {...cut(c.inner, color.ink, INNER)} />
              {/* belfry lancets, louvred, and a lower lancet */}
              {WINDOWS.map(([x0, x1, yt, yb], i) => {
                const d = lancet(x0, x1, yb, yt);
                return (
                  <g key={i} opacity={yb > dY ? 0 : 1}>
                    <Clip id={winIds[i]} d={d} />
                    <path d={d} {...ink(c.shade, color.stageDeep, 1)} />
                    {i < 2 && <path d={Array.from({ length: 7 }, (_, k) => `M${x0} ${yt + 24 + k * 6} l${x1 - x0} 3`).join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />}
                    <path d={d} {...cut(c.contour, color.ink, INNER * 1.15)} />
                    <path d={lancet(x0 - 4, x1 + 4, yb + 1, yt - 5)} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
                    <Hatch clip={winIds[i]} p={c.shade} angle={62} gap={4.5} op={0.3} box={[x0, yt, 20, yb - yt]} />
                  </g>
                );
              })}
              <path d="M140 176 H260 M140 181 H260" {...cut(c.inner, color.ink, INNER)} />
              {/* shading: light upper left → right face and foot of the tower carry the dark */}
              <Hatch clip={bodyClip} p={c.shade} angle={58} gap={4.6} op={0.34} box={[215, 56, 70, 270]} />
              <Hatch clip={bodyClip} p={c.shade} angle={58} gap={9} op={0.22} box={[150, 56, 70, 270]} />
              <Hatch clip={bodyClip} p={c.detail} angle={-24} gap={7} op={0.16} cross box={[121, 200, 158, 140]} />
              <Hatch clip={bodyClip} p={c.shade} angle={58} gap={16} op={0.12} box={[121, 56, 100, 270]} />
              <Stipple clip={bodyClip} p={c.detail} n={420} seed={4} r={0.85} op={0.22} box={[121, 56, 158, 290]} />
              {rabbitEls}
            </g>
          );
        }}
      </Plate>
    );
  };
