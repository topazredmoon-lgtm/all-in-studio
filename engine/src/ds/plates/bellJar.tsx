/**
 * **BellJar** — "In twenty twenty-four, researchers sealed the loop on purpose and watched what happened."
 *
 * A glass bell jar on a laboratory bench plate, a specimen sealed inside it (a potted sapling with a bud), a bridge clamp
 * screwed down over the knob on two threaded rods, and a vacuum pipe with a stopcock running out of the pedestal. Outside
 * the jar: nothing.
 *
 * Glass is a double contour, never a fill: the silhouette and an inset copy of it, broken highlight arcs on the left, a
 * hatched ring where the flange glass is thick. The bench, the pedestal, the clamp bridge and the rods are the heavy
 * forms (lathe rings, rows of rivets, hatch and stipple). The specimen is generated from one stem function: the stem is
 * integrated step by step with a bend that grows with `droop`, leaves are placed along it at fixed arc lengths and their
 * angle to the stem relaxes toward hanging, the bud at the tip turns to face the bench.
 *
 * Red: the clamp screw (stem and T-handle), the thing that seals the loop.
 * Motion: the specimen droops over the shot, leaves first, then the stem, then the bud.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

type P = [number, number];
const f1 = (n: number) => n.toFixed(1);
const poly = (pts: P[], close = false) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L') + (close ? ' Z' : '');
const rad = (d: number) => (d * Math.PI) / 180;

const JAR = 'M100 288 V170 C100 118 146 94 200 94 C254 94 300 118 300 170 V288 A100 20 0 0 1 100 288 Z';
const JAR_IN = 'M107 286 V172 C107 124 148 101 200 101 C252 101 293 124 293 172 V286';

const leaf = (len: number, w: number) => `M0 0 Q${f1(len * 0.45)} ${f1(-w)} ${f1(len)} 0 Q${f1(len * 0.45)} ${f1(w)} 0 0 Z`;

export const BellJar: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [plateTop, plateEdge, pedestal, flange, thick] = useIds(5);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const d = c.at(34, 110); // droop 0 -> 1
          const e = d * d * (3 - 2 * d);
          // stem: integrate from the pot, bending toward the right with droop
          const stem: P[] = [[200, 266]];
          const ang: number[] = [-90];
          const STEPS = 28, LEN = 124;
          for (let i = 1; i <= STEPS; i++) {
            const s = i / STEPS;
            const a = -90 + e * 82 * Math.pow(s, 2.1) + Math.sin(s * 3.1) * 4;
            ang.push(a);
            const p = stem[i - 1];
            stem.push([p[0] + Math.cos(rad(a)) * (LEN / STEPS), p[1] + Math.sin(rad(a)) * (LEN / STEPS)]);
          }
          const at_ = (s: number) => { const i = Math.min(STEPS, Math.round(s * STEPS)); return { p: stem[i], a: ang[i] }; };
          const leaves = [0.22, 0.32, 0.43, 0.54, 0.65, 0.76, 0.86].map((s, k) => {
            const side = k % 2 ? 1 : -1;
            const { p, a } = at_(s);
            const len = 40 - 25 * s + 6, wd = 9 - 4.2 * s;
            const rest = side < 0 ? -158 + 10 * s : -22 - 10 * s; // out and up
            const hang = side < 0 ? 128 : 52; // hanging
            const la = rest + (hang - rest) * Math.min(1, e * (1.1 - 0.5 * s)) + (a + 90) * 0.5;
            return { p, la, len, wd, k };
          });
          const tip = at_(1);
          const bulb = [0, 1].map((k) => ({ k, rot: tip.a + (k ? 28 : -28) * (1 - 0.5 * e) }));

          const rivets: React.ReactNode[] = [];
          for (let i = 1; i < 18; i++) {
            const th = (i / 18) * Math.PI;
            rivets.push(<circle key={i} cx={f1(200 - 148 * Math.cos(th))} cy={f1(299 + 24 * Math.sin(th))} r={1.6} {...cut(c.detail, color.ink, DETAIL)} />);
          }
          const rings: React.ReactNode[] = [];
          [132, 108, 84].forEach((rx, i) => rings.push(<ellipse key={i} cx={200} cy={290} rx={rx} ry={rx * 0.18} {...cut(c.detail, color.ink, DETAIL * (i === 0 ? 1.4 : 1))} opacity={0.6} />));
          const threadsL: string[] = [], threadsR: string[] = [];
          for (let y = 84; y < 286; y += 6) { threadsL.push(`M81 ${y} L91 ${y + 3}`); threadsR.push(`M309 ${y} L319 ${y + 3}`); }
          const stemThreads: string[] = [];
          for (let y = 50; y < 80; y += 4.2) stemThreads.push(`M194 ${y.toFixed(1)} L206 ${(y + 2.4).toFixed(1)}`);
          const shadowPass: string[] = [];
          for (let i = 0; i < 14; i++) shadowPass.push(`M${f1(148 + i * 9)} 306 L${f1(142 + i * 9)} 334`);
          return (
            <g style={breathe(c.frame, 1.1, 190)}>
              <Clip id={plateTop} d="M44 290 A156 28 0 1 1 356 290 A156 28 0 1 1 44 290 Z" />
              <Clip id={plateEdge} d="M44 290 V310 A156 28 0 0 0 356 310 V290 A156 28 0 0 1 44 290 Z" />
              <Clip id={pedestal} d="M138 334 L128 372 A72 7 0 0 0 272 372 L262 334 Z" />
              <Clip id={flange}><path d="M92 288 a108 22 0 1 0 216 0 a108 22 0 1 0 -216 0 Z M100 288 a100 20 0 1 0 200 0 a100 20 0 1 0 -200 0 Z" clipRule="evenodd" /></Clip>
              <Clip id={thick}><path d={JAR} clipRule="evenodd" /></Clip>
              <ellipse cx={200} cy={376} rx={156} ry={8} {...ink(c.shade, color.stageDeep, 1)} />

              {/* pedestal, vacuum pipe and stopcock (below and outside the jar) */}
              <path d="M138 334 L128 372 A72 7 0 0 0 272 372 L262 334 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M150 340 L142 372 M170 342 L166 372 M190 343 L188 373 M210 343 L212 373 M230 342 L234 372 M250 340 L258 372" {...cut(c.detail, color.ink, DETAIL * 1.1)} opacity={0.6} />
              <Hatch clip={pedestal} p={c.shade} angle={78} gap={3} op={0.5} box={[190, 334, 90, 44]} />
              <Hatch clip={pedestal} p={c.shade} angle={78} gap={6.5} op={0.26} box={[128, 334, 144, 44]} />
              <Stipple clip={pedestal} p={c.detail} n={200} seed={31} r={0.85} op={0.26} box={[128, 334, 144, 44]} />
              <path d="M138 334 L128 372 A72 7 0 0 0 272 372 L262 334" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M262 350 H376 M262 360 H376" {...cut(c.contour, color.ink, INNER * 1.15)} />
              <path d="M376 346 V364 M371 346 V364" {...cut(c.inner, color.ink, INNER)} />
              <rect x={304} y={338} width={36} height={32} rx={5} {...ink(c.contour, color.stageDeep, 1)} />
              <rect x={304} y={338} width={36} height={32} rx={5} {...cut(c.contour, color.ink, CONTOUR * 0.9)} />
              <path d="M312 344 V364 M322 342 V366 M332 344 V364" {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.7} />
              <Hatch clip={pedestal} p={0} angle={0} />
              <rect x={316} y={326} width={12} height={12} {...ink(c.contour, color.stageDeep, 1)} />
              <rect x={316} y={326} width={12} height={12} {...cut(c.inner, color.ink, INNER)} />
              <path d="M296 322 H348" {...cut(c.contour, color.ink, CONTOUR * 0.9)} />
              <circle cx={294} cy={322} r={5.5} {...ink(c.inner, color.stageDeep, 1)} />
              <circle cx={294} cy={322} r={5.5} {...cut(c.inner, color.ink, INNER)} />
              <circle cx={350} cy={322} r={5.5} {...ink(c.inner, color.stageDeep, 1)} />
              <circle cx={350} cy={322} r={5.5} {...cut(c.inner, color.ink, INNER)} />

              {/* the bench plate: top, lathe rings, thick edge with rivets */}
              <path d="M44 290 V310 A156 28 0 0 0 356 310 V290 A156 28 0 0 1 44 290 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M44 290 A156 28 0 1 1 356 290 A156 28 0 1 1 44 290 Z" {...ink(c.contour, color.stageDeep, 1)} />
              {rings}
              <Hatch clip={plateTop} p={c.shade} angle={62} gap={4.4} op={0.36} box={[216, 262, 140, 56]} />
              <Hatch clip={plateTop} p={c.shade} angle={62} gap={9} op={0.18} box={[44, 262, 312, 56]} />
              <Stipple clip={plateTop} p={c.detail} n={420} seed={5} r={0.85} op={0.28} box={[44, 262, 312, 56]} />
              <Hatch clip={plateEdge} p={c.shade} angle={82} gap={2.8} op={0.48} box={[44, 290, 312, 48]} />
              <Hatch clip={plateEdge} p={c.shade} angle={-30} gap={6} cross op={0.2} box={[190, 290, 166, 48]} />
              <path d="M44 290 V310 A156 28 0 0 0 356 310 V290" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M44 290 A156 28 0 1 1 356 290 A156 28 0 1 1 44 290 Z" {...cut(c.contour, color.ink, INNER)} />
              {rivets}

              {/* the specimen, sealed inside: pot, soil, stem, leaves, bud */}
              <path d="M178 264 L182 286 H218 L222 264 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M178 264 L182 286 H218 L222 264 Z" {...cut(c.inner, color.ink, INNER * 1.15)} />
              <path d="M176 262 H224 V268 H176 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M176 262 H224 V268 H176 Z" {...cut(c.inner, color.ink, INNER)} />
              <path d="M200 268 l22 0 M186 274 L190 285 M196 274 L198 285 M206 274 L208 285 M216 274 L216 285" {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.8} />
              <path d="M184 264 q16 -7 32 0" {...cut(c.detail, color.ink, DETAIL * 1.5)} />
              {leaves.map((l) => (
                <g key={l.k} transform={`translate(${f1(l.p[0])} ${f1(l.p[1])}) rotate(${f1(l.la)})`}>
                  <path d={leaf(l.len, l.wd)} {...ink(c.contour, color.stageDeep, 1)} />
                  <path d={leaf(l.len, l.wd)} {...cut(c.contour, color.ink, INNER)} />
                  <path d={`M0 0 L${f1(l.len * 0.92)} 0`} {...cut(c.inner, color.ink, DETAIL * 1.3)} />
                  <path d={[0.3, 0.5, 0.7].map((q) => `M${f1(l.len * q)} 0 L${f1(l.len * (q + 0.14))} ${f1(-l.wd * (0.8 - q * 0.5))} M${f1(l.len * q)} 0 L${f1(l.len * (q + 0.14))} ${f1(l.wd * (0.8 - q * 0.5))}`).join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
                  <path d={[0.2, 0.34, 0.48, 0.62, 0.76].map((q) => `M${f1(l.len * q)} ${f1(l.wd * 0.12)} L${f1(l.len * (q + 0.05))} ${f1(l.wd * 0.62 * (1 - Math.abs(q - 0.45)))}`).join(' ')} {...cut(c.shade, color.ink, DETAIL)} opacity={0.65} />
                </g>
              ))}
              <path d={poly(stem)} {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
              <path d={poly(stem.slice(2))} {...cut(c.detail, color.stageDeep, DETAIL * 1.3)} />
              {bulb.map((b) => (
                <g key={b.k} transform={`translate(${f1(tip.p[0])} ${f1(tip.p[1])}) rotate(${f1(b.rot)})`}>
                  <path d={leaf(15, 4)} {...ink(c.contour, color.stageDeep, 1)} />
                  <path d={leaf(15, 4)} {...cut(c.inner, color.ink, INNER)} />
                </g>
              ))}
              <g transform={`translate(${f1(tip.p[0])} ${f1(tip.p[1])}) rotate(${f1(tip.a)})`}>
                <ellipse cx={11} cy={0} rx={11} ry={6.5} {...ink(c.contour, color.stageDeep, 1)} />
                <ellipse cx={11} cy={0} rx={11} ry={6.5} {...cut(c.contour, color.ink, INNER * 1.1)} />
                <path d="M3 -4 Q11 0 3 4 M8 -6 Q16 0 8 6" {...cut(c.detail, color.ink, DETAIL * 1.2)} />
              </g>

              {/* the bell jar: double contour, thick flange, broken highlights */}
              <path d={JAR} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={JAR_IN} {...cut(c.inner, color.ink, DETAIL * 1.35)} />
              <path d="M107 286 A93 17 0 0 0 293 286" {...cut(c.inner, color.ink, DETAIL * 1.35)} />
              <ellipse cx={200} cy={288} rx={108} ry={22} {...cut(c.inner, color.ink, INNER)} strokeDasharray="318 40" />
              <Hatch clip={flange} p={c.shade} angle={46} gap={2.6} op={0.42} box={[92, 262, 216, 50]} />
              <path d="M114 262 V176 C114 138 138 112 168 104" {...cut(c.inner, color.ink, INNER * 1.15)} strokeDasharray="54 12 22 12 6 12" />
              <path d="M123 250 V180 C123 148 142 124 164 114" {...cut(c.detail, color.ink, DETAIL * 1.4)} strokeDasharray="30 9 8 9" />
              <path d="M146 112 A64 16 -18 0 1 190 104" {...cut(c.detail, color.ink, DETAIL * 1.4)} />
              <path d="M282 192 V250 M276 252 V268" {...cut(c.detail, color.ink, DETAIL * 1.4)} />
              <Hatch clip={thick} p={c.shade} angle={64} gap={4.4} op={0.0} />
              <path d="M286 176 C286 148 270 124 246 111" {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              {/* knob */}
              <path d="M192 96 L194 86 H206 L208 96" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M192 96 L194 86 H206 L208 96" {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={200} cy={82} rx={10} ry={5} {...ink(c.contour, color.stageDeep, 1)} />
              <ellipse cx={200} cy={82} rx={10} ry={5} {...cut(c.contour, color.ink, INNER)} />

              {/* the bridge clamp: rods, bridge, nuts */}
              {[86, 314].map((x, i) => (
                <g key={i}>
                  <path d={`M${x - 5} 72 V294 M${x + 5} 72 V294`} {...cut(c.contour, color.ink, INNER * 1.15)} />
                  <ellipse cx={x} cy={296} rx={13} ry={4.4} {...ink(c.inner, color.stageDeep, 1)} />
                  <ellipse cx={x} cy={296} rx={13} ry={4.4} {...cut(c.inner, color.ink, INNER)} />
                  <path d={`M${x - 8} 286 V294 H${x + 8} V286 Z`} {...ink(c.inner, color.stageDeep, 1)} />
                  <path d={`M${x - 8} 286 V294 H${x + 8} V286 Z M${x - 2} 286 V294`} {...cut(c.inner, color.ink, INNER)} />
                  <path d={`M${x - 9} 52 H${x + 9} V60 H${x - 9} Z M${x - 3} 52 V60 M${x + 3} 52 V60`} {...ink(c.inner, color.stageDeep, 1)} />
                  <path d={`M${x - 9} 52 H${x + 9} V60 H${x - 9} Z M${x - 3} 52 V60 M${x + 3} 52 V60`} {...cut(c.inner, color.ink, INNER)} />
                </g>
              ))}
              <path d={threadsL.join(' ') + ' ' + threadsR.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.1)} opacity={0.75} />
              <path d="M68 60 H332 V74 H68 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M68 60 H332 V74 H68 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M72 67 H328" {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.7} />
              <path d="M290 62 V72 M296 62 V72 M302 62 V72 M308 62 V72 M92 62 V72 M98 62 V72 M104 62 V72 M110 62 V72" {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              {/* the screw: the one red */}
              <path d="M193 46 V84 M207 46 V84" {...cut(c.accent, color.red, INNER * 1.1)} />
              <path d={stemThreads.join(' ')} {...cut(c.accent, color.red, DETAIL * 1.2)} />
              <path d="M193 84 Q200 90 207 84" {...cut(c.accent, color.red, INNER)} />
              <path d="M164 38 H236" {...cut(c.accent, color.red, CONTOUR)} />
              <circle cx={162} cy={38} r={6.4} {...ink(c.accent, color.red, 0.5)} />
              <circle cx={162} cy={38} r={6.4} {...cut(c.accent, color.red, INNER)} />
              <circle cx={238} cy={38} r={6.4} {...ink(c.accent, color.red, 0.5)} />
              <circle cx={238} cy={38} r={6.4} {...cut(c.accent, color.red, INNER)} />
              <path d="M190 46 H210" {...cut(c.accent, color.red, INNER)} />
            </g>
          );
        }}
      </Plate>
    );
  };
