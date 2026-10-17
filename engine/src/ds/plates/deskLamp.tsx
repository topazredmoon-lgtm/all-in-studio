/**
 * **DeskLamp** — a banker's lamp over an open page, and the light going out of it.
 * The shade is a half-ellipsoid tipped toward the page: heavy contour, latitude ribs bowed the way a dome's are, a long
 * hatching sweep across the dome (tight below the crown, loose above) and a brass rim; through its mouth the red
 * filament glows. The column is turned (collars generated up the stem) and stands on a weighted base; a pull chain
 * hangs from the shade with its beads. The pool of light on the desk is built from radial burin ticks that are
 * DENSE at the pool's edge and open in the middle, and the page's engraved text rules fade with their distance
 * from that pool. Motion: over the shot the pool shrinks, the glow dims and its rays shorten, and the page's
 * edges go dark (the rule-lines and the page outline give out first at the margins).
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const f = (n: number) => n.toFixed(1);
const hash = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const S = { x: 150, y: 128 }, ROT = 26; // shade centre (mouth), tilt toward the page
const cs = Math.cos((ROT * Math.PI) / 180), sn = Math.sin((ROT * Math.PI) / 180);
const P = (x: number, y: number) => [S.x + x * cs - y * sn, S.y + x * sn + y * cs] as const;

// the page on the desk: bilinear map
const PG = { p0: [190, 262], p1: [366, 266], p2: [380, 344], p3: [168, 338] } as const;
const page = (u: number, v: number): [number, number] => {
  const ax = lerp(PG.p0[0], PG.p1[0], u), ay = lerp(PG.p0[1], PG.p1[1], u);
  const bx = lerp(PG.p3[0], PG.p2[0], u), by = lerp(PG.p3[1], PG.p2[1], u);
  return [lerp(ax, bx, v), lerp(ay, by, v)];
};

export const DeskLamp: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [dome, mouth, baseClip, desk] = useIds(4);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(30, 110); // the pool shrinks, the glow dims
          const glow = 1 - 0.7 * t;
          const POOL = { x: 276, y: 305, rx: 112 * (1 - 0.4 * t), ry: 42 * (1 - 0.4 * t) };
          const dist = (x: number, y: number) => Math.hypot((x - POOL.x) / POOL.rx, (y - POOL.y) / POOL.ry);
          const lit = (x: number, y: number) => Math.max(0.07, Math.min(1, (1.25 - dist(x, y)) / 0.5));

          // text rules on the page, in pieces, each at the brightness of its place in the pool
          const rules: React.ReactNode[] = [];
          for (let r = 0; r < 14; r++) {
            const v = 0.1 + r * 0.063;
            let u = 0.07;
            let k = 0;
            while (u < 0.93) {
              const len = 0.045 + hash(r * 31 + k, 2) * 0.1;
              const u1 = Math.min(0.93, u + len);
              if (!(r % 5 === 4 && u > 0.55)) {
                const [x0, y0] = page(u, v), [x1, y1] = page(u1, v);
                const lt = lit((x0 + x1) / 2, (y0 + y1) / 2);
                rules.push(<path key={`${r}-${k}`} d={`M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`} {...cut(c.detail, color.ink, DETAIL * (0.8 + lt * 0.5))} opacity={lt * 0.9} />);
              }
              u = u1 + 0.02 + hash(r * 17 + k, 5) * 0.012; k++;
            }
          }
          // the page outline, in segments that go dark with the margins
          const outline: React.ReactNode[] = [];
          const sides: [number, number, number, number][] = [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]];
          sides.forEach(([ua, va, ub, vb], si) => {
            for (let i = 0; i < 14; i++) {
              const [x0, y0] = page(lerp(ua, ub, i / 14), lerp(va, vb, i / 14)), [x1, y1] = page(lerp(ua, ub, (i + 1) / 14), lerp(va, vb, (i + 1) / 14));
              outline.push(<path key={`${si}-${i}`} d={`M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`} {...cut(c.inner, color.ink, INNER)} opacity={lit((x0 + x1) / 2, (y0 + y1) / 2)} />);
            }
          });
          // pool: radial ticks, dense at the rim, open in the middle
          const ticks: string[] = [];
          for (let i = 0; i < 150; i++) {
            const a = (i / 150) * Math.PI * 2 + hash(i, 1) * 0.04;
            const r0 = 0.62 + hash(i, 2) * 0.22, r1 = 0.97 + hash(i, 3) * 0.06;
            ticks.push(`M${f(POOL.x + POOL.rx * r0 * Math.cos(a))} ${f(POOL.y + POOL.ry * r0 * Math.sin(a))} L${f(POOL.x + POOL.rx * r1 * Math.cos(a))} ${f(POOL.y + POOL.ry * r1 * Math.sin(a))}`);
          }
          const midTicks: string[] = [];
          for (let i = 0; i < 26; i++) {
            const a = hash(i, 8) * Math.PI * 2, r0 = 0.25 + hash(i, 4) * 0.25;
            midTicks.push(`M${f(POOL.x + POOL.rx * r0 * Math.cos(a))} ${f(POOL.y + POOL.ry * r0 * Math.sin(a))} l${f(2.5 * Math.cos(a))} ${f(1.2 * Math.sin(a))}`);
          }
          const ringSeg = Array.from({ length: 64 }, (_, i) => {
            const a0 = (i / 64) * Math.PI * 2, a1 = ((i + 1) / 64) * Math.PI * 2;
            return `M${f(POOL.x + POOL.rx * Math.cos(a0))} ${f(POOL.y + POOL.ry * Math.sin(a0))} L${f(POOL.x + POOL.rx * Math.cos(a1))} ${f(POOL.y + POOL.ry * Math.sin(a1))}`;
          }).join(' ');

          // stem collars
          const collars = [300, 284, 262, 236, 214].map((y, i) => ({ y, w: [9, 11, 7, 8, 10][i] }));
          // pull chain: hangs from the shade, swaying a hair
          const [chx, chy] = P(-38, 60);
          const sway = Math.sin(c.frame / 38) * 1.6;
          const beads = Array.from({ length: 8 }, (_, i) => [chx + sway * (i / 7), chy + 6 + i * 6.2] as const);
          const [gx, gy] = [chx + sway, chy + 6 + 8 * 6.2];

          const domeD = 'M0 -64 A80 64 0 0 0 0 64 Z';
          return (
            <g style={breathe(c.frame, 1.1, 210)}>
              <Clip id={mouth}><ellipse cx={0} cy={0} rx={17} ry={64} /></Clip>
              <Clip id={dome} d="M0 -64 A80 64 0 0 0 0 64 L0 -64 Z" />
              <Clip id={baseClip} d="M60 312 L60 324 A58 13 0 0 0 176 324 L176 312 A58 13 0 0 0 60 312 Z" />
              <Clip id={desk}><path d="M16 248 L384 248 L384 376 L16 376 Z" /></Clip>

              {/* the desk: back edge, front edge, grain, cast shadow of the lamp */}
              <ellipse cx={156} cy={330} rx={84} ry={14} {...ink(c.shade, color.stageDeep, 0.95)} />
              <path d="M16 248 L384 248" {...cut(c.inner, color.ink, DETAIL * 1.4)} opacity={0.6} />
              <path d="M10 364 L390 364 M10 372 L390 372" {...cut(c.contour, color.ink, INNER)} />
              <path d="M30 262 Q90 256 150 262 M214 252 Q300 250 372 254 M30 292 Q60 290 100 294 M40 350 Q140 346 250 352 M280 356 Q330 354 372 357" {...cut(c.detail, color.ink, DETAIL)} opacity={0.38} />
              <Hatch clip={desk} p={c.shade} angle={0} gap={8} op={0.1} box={[16, 364, 368, 14]} />

              {/* the page and its light: outline, text rules, then the pool's ticks */}
              {outline}
              {rules}
              <path d={ringSeg} {...cut(c.shade, color.ink, DETAIL * 1.2)} opacity={0.7} />
              <path d={ticks.join(' ')} {...cut(c.shade, color.ink, DETAIL)} opacity={0.55} />
              <path d={midTicks.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              {/* the beam, as two dashed edges from the mouth to the pool */}
              <path d={`M${f(P(2, -62)[0])} ${f(P(2, -62)[1])} L${f(POOL.x - POOL.rx * 0.5)} ${f(POOL.y - POOL.ry * 0.86)} M${f(P(2, 62)[0])} ${f(P(2, 62)[1])} L${f(POOL.x + POOL.rx * 0.5)} ${f(POOL.y + POOL.ry * 0.86)}`} {...cut(c.shade * 0.7, color.mute, DETAIL, '3 7')} />

              {/* base: weighted disc, stem, collars, yoke */}
              <ellipse cx={118} cy={312} rx={58} ry={13} {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
              <path d="M60 312 L60 324 A58 13 0 0 0 176 324 L176 312" {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
              <ellipse cx={118} cy={312} rx={44} ry={9} {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={118} cy={309} rx={20} ry={4.6} {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={baseClip} p={c.shade} angle={90} gap={3} op={0.4} box={[100, 308, 80, 30]} />
              <Hatch clip={baseClip} p={c.shade} angle={90} gap={8} op={0.16} box={[56, 308, 60, 30]} />
              <path d="M70 318 Q74 326 96 332" {...cut(c.detail, color.ink, DETAIL * 1.6)} opacity={0.8} />
              <path d="M111 306 L111 204 M125 306 L125 204" {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
              {collars.map((cl, i) => (
                <g key={i}>
                  <path d={`M${118 - cl.w - 2} ${cl.y} Q118 ${cl.y + 4} ${118 + cl.w + 2} ${cl.y} M${118 - cl.w} ${cl.y - 4} Q118 ${cl.y} ${118 + cl.w} ${cl.y - 4}`} {...cut(c.inner, color.ink, INNER)} />
                  <path d={`M${118 - cl.w + 2} ${cl.y - 2} L${118 + cl.w - 2} ${cl.y - 2}`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
                </g>
              ))}
              <path d="M121 210 L121 304" {...cut(c.shade, color.ink, DETAIL * 1.5)} opacity={0.6} />
              <path d="M114 214 L114 296" {...cut(c.detail, color.ink, DETAIL * 1.6)} opacity={0.8} />
              <circle cx={118} cy={200} r={7} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M118 193 Q${f(P(-30, 62)[0] - 6)} ${f(P(-30, 62)[1] + 30)} ${f(P(-30, 62)[0])} ${f(P(-30, 62)[1])}`} {...cut(c.inner, color.ink, INNER * 1.2)} />

              {/* the shade: dome, ribs, hatching sweep, rim; the filament glows in its mouth */}
              <g transform={`translate(${S.x} ${S.y}) rotate(${ROT})`}>
                <ellipse cx={0} cy={0} rx={17} ry={64} {...ink(c.contour, color.stageDeep, 1)} />
                <Hatch clip={mouth} p={c.shade} angle={90} gap={5} op={0.22} box={[-18, -66, 36, 132]} />
                {/* filament: bulb, coil, rays */}
                <g opacity={glow}>
                  <circle cx={-8} cy={0} r={9} {...cut(c.accent, color.red, INNER)} />
                  <path d={Array.from({ length: 9 }, (_, i) => `${i ? 'L' : 'M'}${f(-12 + i * 3)} ${f((i % 2 ? -3 : 3))}`).join(' ')} {...cut(c.accent, color.red, DETAIL * 1.5)} />
                  <path d={Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const r0 = 13, r1 = 13 + 15 * glow * (0.7 + 0.5 * hash(i, 3)); return `M${f(-8 + r0 * Math.cos(a) * 0.7)} ${f(r0 * Math.sin(a))} L${f(-8 + r1 * Math.cos(a) * 0.7)} ${f(r1 * Math.sin(a))}`; }).join(' ')} {...cut(c.accent, color.red, DETAIL)} opacity={0.8} />
                  <ellipse cx={-8} cy={0} rx={4} ry={4} {...ink(c.accent, color.red, 0.9)} />
                </g>
                <ellipse cx={0} cy={0} rx={17} ry={64} {...cut(c.inner, color.ink, INNER * 1.2)} />
                <ellipse cx={0} cy={0} rx={21} ry={67} {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
                <path d="M0 -64 A80 64 0 0 0 0 64" {...cut(c.contour, color.ink, CONTOUR)} />
                {/* ribs: latitudes of the dome, bowed back toward the crown */}
                <path d={[10, 20, 30, 41, 53, 64].map((x) => { const y = 64 * Math.sqrt(Math.max(0, 1 - (x / 80) * (x / 80))); return `M${-x} ${-y} Q${-x - 9} 0 ${-x} ${y}`; }).join(' ')} {...cut(c.inner, color.ink, INNER * 0.9)} />
                {/* the long hatching sweep across the dome: loose over all, tight under the crown */}
                <Hatch clip={dome} p={c.shade} angle={64} gap={9} op={0.18} box={[-82, -66, 84, 132]} />
                <Hatch clip={dome} p={c.shade} angle={64} gap={4.4} op={0.34} box={[-82, -4, 84, 70]} />
                <Hatch clip={dome} p={c.detail} angle={-30} gap={7} op={0.2} box={[-82, 8, 84, 58]} />
                <Stipple clip={dome} p={c.detail} n={220} seed={13} r={0.8} op={0.26} box={[-82, 6, 84, 60]} />
                {/* the highlight: a bright arc left open along the upper curve */}
                <path d="M-24 -54 Q-52 -42 -62 -14" {...cut(c.detail, color.ink, DETAIL * 2)} opacity={0.85} />
                <path d="M-14 -58 Q-40 -52 -50 -40" {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
              </g>

              {/* pull chain: links, beads, the little pull */}
              <path d={`M${f(chx)} ${f(chy)} L${f(chx + sway * 0.1)} ${f(chy + 6)}`} {...cut(c.inner, color.ink, DETAIL * 1.2)} />
              {beads.map(([x, y], i) => <circle key={i} cx={f(x)} cy={f(y)} r={2.2} {...cut(c.inner, color.ink, DETAIL * 1.2)} />)}
              <path d={`M${f(gx)} ${f(gy - 2)} l-3 8 q3 5 6 0 z`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${f(gx - 0.5)} ${f(gy + 2)} l0 4`} {...cut(c.detail, color.ink, DETAIL)} />
            </g>
          );
        }}
      </Plate>
    );
  };
