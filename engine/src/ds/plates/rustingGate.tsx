/**
 * **RustingGate** — a wrought-iron gate, closed, with nobody near it, decaying by itself.
 * Cut as made iron: the palings are a loop (twelve of them, each with its own spear tip, barbs and collar), the
 * frieze scrollwork is generated from a spiral function (two volutes per leaf joined by an S, mirrored on the other
 * leaf), plus a lock plate with a keyhole and rivets, strap hinges and the two posts with ball finials.
 * Motion is all decay and all red: rust climbs from the ground as a stipple whose front rises over the shot (dots
 * appear by height, denser low), drips run down from the rail joints, the scroll lines break apart where the front
 * reaches them, and one paling pits clean through. Nothing else in the plate is red.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const f = (n: number) => n.toFixed(1);
const hash = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };

const GROUND = 338;
const TOP_RAIL: [number, number] = [108, 116];
const FRIEZE_RAIL: [number, number] = [178, 185];
const MID_RAIL: [number, number] = [230, 238];
const BOT_RAIL: [number, number] = [298, 308];
const LEFT_XS = [74, 96, 118, 140, 162];
const RIGHT_XS = LEFT_XS.map((x) => 400 - x);
const STILE_L = 190, STILE_R = 210;
const PITTED = 142; // the paling that pits through

/** spiral polyline: radius eases from r0 to r1 over `turns`, starting at angle a0 (deg), direction dir (+1 clockwise) */
const spiral = (cx: number, cy: number, r0: number, r1: number, turns: number, a0: number, dir: 1 | -1, n = 70) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, th = u * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * Math.pow(u, 0.82);
    const a = (a0 * Math.PI) / 180 + dir * th;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });

/** one leaf's frieze: two volutes joined by an S, and a flower bud at each end */
const leafScroll = (mirror: boolean) => {
  const mx = (x: number) => (mirror ? 400 - x : x);
  const A = spiral(92, 148, 28, 4, 2.15, 90, 1);
  const B = spiral(158, 148, 28, 4, 2.15, 90, -1);
  const link: [number, number][] = Array.from({ length: 21 }, (_, i) => { const u = i / 20; return [92 + 66 * u, 172 + 4 * Math.sin(u * Math.PI)] as [number, number]; });
  // a lesser curl rising off the link: the tendril that makes a scroll frieze read as a frieze
  const T1 = spiral(125, 160, 11, 2, 1.5, 270, 1, 40);
  return [A, B, link, T1].map((pts) => pts.map(([x, y]) => [mx(x), y] as [number, number]));
};

/** A polyline as path chunks of `k` points; chunks the rust has eaten (below the front, by hash) are dropped. */
const eaten = (pts: [number, number][], front: number, seed: number, k = 5) => {
  const out: string[] = [];
  for (let i = 0; i < pts.length - 1; i += k) {
    const seg = pts.slice(i, i + k + 1);
    const yMid = seg[Math.floor(seg.length / 2)][1];
    if (yMid > front && hash(i, seed) < 0.55) continue;
    out.push(seg.map(([x, y], j) => `${j ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' '));
  }
  return out.join(' ');
};

/** Rail edges drawn only in the gaps between uprights, so the palings read as passing through. */
const railEdges = (y0: number, y1: number, from: number, to: number, bars: { x: number; hw: number }[]) => {
  const xs = [{ x: from, hw: 0 }, ...bars, { x: to, hw: 0 }];
  const d: string[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i].x + xs[i].hw, b = xs[i + 1].x - xs[i + 1].hw;
    if (b - a < 1) continue;
    d.push(`M${f(a)} ${y0} L${f(b)} ${y0} M${f(a)} ${y1} L${f(b)} ${y1}`);
  }
  return d.join(' ');
};

export const RustingGate: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [iron, floor] = useIds(2);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(26, 84); // rust climbing
          const front = GROUND - 252 * t; // y of the rust front
          const barsL = [...LEFT_XS.map((x) => ({ x, hw: 3.5 })), { x: STILE_L, hw: 5 }];
          const barsR = [{ x: STILE_R, hw: 5 }, ...RIGHT_XS.slice().reverse().map((x) => ({ x, hw: 3.5 }))];
          const allXs = [...LEFT_XS, ...RIGHT_XS];
          const gapHalf = 2 + 15 * Math.max(0, (t - 0.25) / 0.75);
          const pitY = 256;

          // the rust: dots that appear by height, denser low, clipped to the iron
          const rustDots: React.ReactNode[] = [];
          for (let i = 0; i < 3200; i++) {
            const x = 28 + hash(i, 1) * 344, y = 62 + hash(i, 2) * (GROUND - 62);
            const rise = (GROUND - y) / 252;
            if (rise > t * 1.12 - hash(i, 3) * 0.3) continue;
            if (hash(i, 4) > 1 - rise * 0.5) continue;
            rustDots.push(<circle key={i} cx={f(x)} cy={f(y)} r={(1 + hash(i, 5) * 1.9).toFixed(2)} />);
          }
          const drips = [...allXs, 52, 348].map((x, i) => {
            const len = Math.max(0, Math.min(1, (t - 0.1 - hash(i, 9) * 0.3) * 2.4)) * (14 + hash(i, 6) * 20);
            const y0 = i % 2 ? BOT_RAIL[1] : MID_RAIL[1];
            return len > 0.5 ? `M${f(x + 1)} ${y0} L${f(x + 1 + hash(i, 7) * 1.4)} ${f(y0 + len)}` : '';
          }).join(' ');

          // palings
          const palings = allXs.map((x, i) => {
            const tip = `M${x - 3.5} 102 L${x - 3.5} 92 L${x - 8.5} 86 L${x - 3.5} 83 Q${x - 3} 70 ${x} 60 Q${x + 3} 70 ${x + 3.5} 83 L${x + 8.5} 86 L${x + 3.5} 92 L${x + 3.5} 102`;
            const pit = x === PITTED;
            const sides = (xo: number) => {
              if (!pit) return `M${f(x + xo)} 102 L${f(x + xo)} ${BOT_RAIL[0]}`;
              const j = xo > 0 ? 1.8 : -1.2; // ragged edges of the hole
              return `M${f(x + xo)} 102 L${f(x + xo)} ${f(pitY - gapHalf)} L${f(x + xo + j)} ${f(pitY - gapHalf + 3)} M${f(x + xo - j)} ${f(pitY + gapHalf - 3)} L${f(x + xo)} ${f(pitY + gapHalf)} L${f(x + xo)} ${BOT_RAIL[0]}`;
            };
            return { x, i, tip, l: sides(-3.5), r: sides(3.5), shade: pit ? `M${x + 1.2} 102 L${x + 1.2} ${f(pitY - gapHalf - 2)} M${x + 1.2} ${f(pitY + gapHalf + 2)} L${x + 1.2} ${BOT_RAIL[0]}` : `M${x + 1.2} 102 L${x + 1.2} ${BOT_RAIL[0]}` };
          });

          const scrollsL = leafScroll(false), scrollsR = leafScroll(true);
          const scrollD = (sets: [number, number][][], seed: number) => sets.map((p, i) => eaten(p, front, seed + i)).join(' ');

          return (
            <g style={breathe(c.frame, 1.1, 220)}>
              <Clip id={iron}>
                {palings.map((p) => <rect key={p.i} x={p.x - 3.5} y={86} width={7} height={BOT_RAIL[0] - 86} />)}
                {[TOP_RAIL, FRIEZE_RAIL, MID_RAIL, BOT_RAIL].map(([a, b], i) => <g key={i}><rect x={50} y={a} width={142} height={b - a} /><rect x={208} y={a} width={142} height={b - a} /></g>)}
                <rect x={STILE_L - 5} y={98} width={10} height={BOT_RAIL[1] - 98} /><rect x={STILE_R - 5} y={98} width={10} height={BOT_RAIL[1] - 98} />
                <rect x={26} y={74} width={24} height={GROUND - 74} /><rect x={350} y={74} width={24} height={GROUND - 74} />
                <rect x={176} y={216} width={48} height={50} />
              </Clip>
              <Clip id={floor}><path d={`M20 ${GROUND} L380 ${GROUND} L380 372 L20 372 Z`} /></Clip>

              {/* ground and the gate's cast shadow */}
              <ellipse cx={206} cy={GROUND + 6} rx={176} ry={11} {...ink(c.shade, color.stageDeep, 0.95)} />
              <path d={`M18 ${GROUND} L382 ${GROUND}`} {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={floor} p={c.shade} angle={0} gap={5.5} op={0.18} box={[20, GROUND, 360, 34]} />
              <Hatch clip={floor} p={c.shade} angle={-14} gap={4.4} op={0.22} box={[200, GROUND, 190, 30]} />

              {/* posts: square iron, plinth, cap, ball finial */}
              {[26, 350].map((x, k) => (
                <g key={x}>
                  <path d={`M${x} 82 L${x} ${GROUND} M${x + 24} 82 L${x + 24} ${GROUND}`} {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
                  <path d={`M${x - 4} 82 L${x + 28} 82 L${x + 28} 74 L${x - 4} 74 Z M${x - 5} ${GROUND - 20} L${x + 29} ${GROUND - 20} L${x + 29} ${GROUND} L${x - 5} ${GROUND} Z`} {...cut(c.inner, color.ink, INNER)} />
                  <path d={`M${x + 4} 74 L${x + 6} 68 L${x + 18} 68 L${x + 20} 74`} {...cut(c.inner, color.ink, INNER)} />
                  <circle cx={x + 12} cy={58} r={11} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
                  <path d={`M${x + 6} 55 Q${x + 8} 50 ${x + 13} 50`} {...cut(c.detail, color.ink, DETAIL * 1.6)} />
                  <Hatch clip={iron} p={c.shade} angle={90} gap={3.2} op={0.4} box={[x + 14, 74, 12, GROUND - 74]} />
                  <path d={`M${x + 5} 90 L${x + 5} ${GROUND - 24}`} {...cut(c.detail, color.ink, DETAIL * 1.4)} opacity={0.8} />
                  {/* hinge straps off the post: flat bars with pointed ends, three rivets each */}
                  {[134, 276].map((y) => {
                    const dir = k === 0 ? 1 : -1, x0 = k === 0 ? x + 24 : x, x1 = x0 + dir * 44;
                    return (
                      <g key={y}>
                        <path d={`M${x0} ${y - 5} L${x1 - dir * 6} ${y - 5} L${x1} ${y} L${x1 - dir * 6} ${y + 5} L${x0} ${y + 5}`} {...cut(c.inner, color.ink, INNER)} />
                        {[8, 20, 32].map((o) => <circle key={o} cx={x0 + dir * o} cy={y} r={1.8} {...ink(c.detail, color.ink)} />)}
                        <path d={`M${x0} ${y + 2.5} L${x1 - dir * 8} ${y + 2.5}`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
                      </g>
                    );
                  })}
                </g>
              ))}

              {/* rails, drawn only between the uprights */}
              {[TOP_RAIL, FRIEZE_RAIL, MID_RAIL, BOT_RAIL].map(([a, b], i) => (
                <g key={i}>
                  <path d={railEdges(a, b, 50, 190, barsL)} {...cut(c.inner, color.ink, i === 3 ? CONTOUR * 0.7 : INNER)} />
                  <path d={railEdges(a, b, 210, 350, barsR)} {...cut(c.inner, color.ink, i === 3 ? CONTOUR * 0.7 : INNER)} />
                </g>
              ))}
              {/* stiles at the meeting of the leaves */}
              {[STILE_L, STILE_R].map((x) => (
                <g key={x}>
                  <path d={`M${x - 5} 98 L${x - 5} ${BOT_RAIL[1]} M${x + 5} 98 L${x + 5} ${BOT_RAIL[1]} M${x - 5} 98 L${x + 5} 98`} {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
                  <path d={`M${x + 2} 100 L${x + 2} ${BOT_RAIL[1] - 2}`} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
                </g>
              ))}

              {/* palings: spear tips, barbs, a collar where each passes the top rail */}
              {palings.map((p) => (
                <g key={p.i}>
                  <path d={p.tip} {...cut(c.contour, color.ink, CONTOUR * 0.62)} />
                  <path d={`M${p.x - 6} 103 L${p.x + 6} 103 M${p.x - 6} 106 L${p.x + 6} 106`} {...cut(c.inner, color.ink, DETAIL * 1.5)} />
                  <path d={p.l} {...cut(c.inner, color.ink, INNER * 0.9)} />
                  <path d={p.r} {...cut(c.inner, color.ink, INNER * 1.3)} />
                  <path d={p.shade} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
                  <path d={`M${p.x - 0.6} 63 Q${p.x - 1} 72 ${p.x - 1} 82`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
                  <path d={`M${p.x + 1} 66 L${p.x + 2} 80`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
                </g>
              ))}

              {/* the frieze: scrolls from a spiral function, struck in two weights */}
              <path d={scrollD(scrollsL, 3)} {...cut(c.inner, color.ink, INNER * 1.5)} />
              <path d={scrollD(scrollsR, 11)} {...cut(c.inner, color.ink, INNER * 1.5)} />
              {[scrollsL, scrollsR].map((set, k) => (
                <g key={k}>
                  {[set[0][0], set[1][0], set[2][10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} {...ink(c.inner, color.ink)} />)}
                  <path d={eaten(set[0].map(([x, y]) => [x + (k ? -2.6 : 2.6), y + 1.4] as [number, number]), front, 20 + k)} {...cut(c.detail, color.ink, DETAIL)} opacity={0.65} />
                  <path d={eaten(set[1].map(([x, y]) => [x + (k ? -2.6 : 2.6), y + 1.4] as [number, number]), front, 30 + k)} {...cut(c.detail, color.ink, DETAIL)} opacity={0.65} />
                </g>
              ))}

              {/* the lock plate: scalloped plate, keyhole, rivets, hasp across the meeting stiles */}
              <path d="M178 224 Q176 222 180 220 L220 220 Q224 222 222 224 L222 262 Q224 266 220 266 L180 266 Q176 266 178 262 Z" {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
              <path d="M184 226 L216 226 L216 260 L184 260 Z" {...cut(c.detail, color.ink, DETAIL * 1.2)} />
              {[[183, 224], [217, 224], [183, 262], [217, 262]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.1} {...cut(c.inner, color.ink, DETAIL)} />)}
              <circle cx={200} cy={240} r={5.2} {...cut(c.inner, color.ink, INNER)} />
              <path d="M198 243 L196.6 254 L203.4 254 L202 243" {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={iron} p={c.shade} angle={32} gap={3} op={0.4} box={[176, 216, 48, 50]} />

              {/* shading: tight on the right of every upright (light upper left), a loose pass over the lot */}
              <Hatch clip={iron} p={c.shade} angle={90} gap={2.6} op={0.2} box={[52, 96, 300, 212]} />
              <Hatch clip={iron} p={c.shade} angle={0} gap={3} op={0.32} box={[40, 276, 320, 34]} />
              <Hatch clip={iron} p={c.detail} angle={36} gap={5} op={0.16} box={[40, 100, 320, 210]} />

              {/* the rust: a climbing stipple, drips from the joints, one paling pitting through */}
              <g clipPath={`url(#${iron})`} fill={color.red} opacity={0.8}>{rustDots}</g>
              <path d={drips} {...cut(c.detail, color.red, DETAIL * 1.3)} opacity={0.65 * Math.min(1, t * 2)} />
              <g fill={color.red} opacity={0.75 * Math.min(1, t * 1.6)}>
                {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={f(PITTED + (hash(i, 3) - 0.5) * 12)} cy={f(pitY + (hash(i, 4) - 0.5) * (gapHalf * 2 + 14))} r={0.8 + hash(i, 8) * 1.4} />)}
              </g>
            </g>
          );
        }}
      </Plate>
    );
  };

