/**
 * **CloudingGlass** — a cut-crystal tumbler of clear water, and a thread of something milky curling into it.
 * Glass is never filled here: it is a thin double contour with gaps left open for the highlights, vertical flutes
 * running down the wall (each one computed from the tumbler's taper and the ellipse of the rim, so they bow the way
 * real flutes do), a diamond-cut band cut by crossing the flutes, and a thick base. The water is hatched flat and the
 * thing that moves is its *tone*: stipple density climbs through the water over the shot until the glass is cloudy,
 * while the caustic on the table (the glass's own light, drawn as nested arcs) dims in step.
 * Red: the thread, from where it hangs above the rim to the point it enters the water.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const CX = 196, YT = 112, YB = 296, RT = 90, RB = 70, RYT = 19, RYB = 14;
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const f = (n: number) => n.toFixed(1);
const rx = (y: number) => lerp(RT, RB, (y - YT) / (YB - YT));
const ry = (y: number) => lerp(RYT, RYB, (y - YT) / (YB - YT));
const WALL = 6;

/** The wall outline of the tumbler (outer silhouette, rim ellipse as its back edge). */
const OUTER = `M${CX - RT} ${YT} L${CX - RB} ${YB} A${RB} ${RYB} 0 0 0 ${CX + RB} ${YB} L${CX + RT} ${YT} A${RT} ${RYT} 0 0 0 ${CX - RT} ${YT} Z`;

const WY = 168; // water line
const wl = rx(WY) - WALL, wr = wl, wry = ry(WY) - 2;
const BY = 274; // top of the thick base (inside floor)
const WATER = `M${f(CX - wl)} ${WY} L${f(CX - (rx(BY) - WALL))} ${BY} A${f(rx(BY) - WALL)} ${f(ry(BY) - 2)} 0 0 0 ${f(CX + rx(BY) - WALL)} ${BY} L${f(CX + wr)} ${WY} A${f(wl)} ${f(wry)} 0 0 0 ${f(CX - wl)} ${WY} Z`;

/** Flutes: vertical cut lines at fixed angles around the cylinder, bowed by the rim's perspective. */
const FLUTES = [24, 48, 72, 108, 132, 156];
const fluteX = (deg: number, y: number) => CX + rx(y) * Math.cos((deg * Math.PI) / 180);
const fluteY = (deg: number, y: number) => y + ry(y) * Math.sin((deg * Math.PI) / 180);
const flutePath = (deg: number, y0: number, y1: number) => {
  const d: string[] = [];
  for (let i = 0; i <= 12; i++) { const y = lerp(y0, y1, i / 12); d.push(`${i ? 'L' : 'M'}${f(fluteX(deg, y))} ${f(fluteY(deg, y))}`); }
  return d.join(' ');
};
/** the diamond-cut band: each flute joins the next one over and down, then back */
const diamonds = (y0: number, y1: number, y2: number) => {
  const d: string[] = [];
  for (let k = 0; k < FLUTES.length - 1; k++) {
    const a = FLUTES[k], b = FLUTES[k + 1];
    d.push(`M${f(fluteX(a, y0))} ${f(fluteY(a, y0))} L${f(fluteX(b, y1))} ${f(fluteY(b, y1))} L${f(fluteX(a, y2))} ${f(fluteY(a, y2))}`);
    d.push(`M${f(fluteX(b, y0))} ${f(fluteY(b, y0))} L${f(fluteX(a, y1))} ${f(fluteY(a, y1))} L${f(fluteX(b, y2))} ${f(fluteY(b, y2))}`);
  }
  return d.join(' ');
};

/** The thread: a slow S down from above the rim, then (below the water line) a plume that opens out into loops. */
const threadX = (y: number) => 214 + 12 * Math.sin(y * 0.062) - (y > 60 ? 0.07 * (y - 60) : 0);
const thread = (y0: number, y1: number, off = 0) => {
  const d: string[] = [];
  for (let i = 0; i <= 40; i++) { const y = lerp(y0, y1, i / 40); d.push(`${i ? 'L' : 'M'}${f(threadX(y) + off)} ${f(y)}`); }
  return d.join(' ');
};
const plume = (p: number, off: number) => {
  const d: string[] = [];
  const N = 70;
  const n = Math.max(2, Math.floor(N * p));
  for (let i = 0; i <= n; i++) {
    const s = i / N;
    const y = WY + 6 + 92 * s;
    const amp = 6 + 54 * s;
    const x = threadX(WY) + amp * Math.sin(s * 15) * Math.cos(s * 3.1) + off * (1 + s);
    d.push(`${i ? 'L' : 'M'}${f(x)} ${f(y + 6 * Math.cos(s * 15))}`);
  }
  return d.join(' ');
};

export const CloudingGlass: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [glass, water, base, table] = useIds(4);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(34, 100); // the clouding
          const pl = c.at(30, 70); // the plume spreading
          const flutes = FLUTES.map((a) => flutePath(a, YT + 12, 200));
          return (
            <g style={breathe(c.frame, 1.2, 210)}>
              <Clip id={glass} d={OUTER} />
              <Clip id={water} d={WATER} />
              <Clip id={base} d={`M${CX - rx(BY)} ${BY} L${CX - RB} ${YB} A${RB} ${RYB} 0 0 0 ${CX + RB} ${YB} L${CX + rx(BY)} ${BY} A${rx(BY)} ${ry(BY)} 0 0 1 ${CX - rx(BY)} ${BY} Z`} />
              <Clip id={table}><ellipse cx={236} cy={322} rx={128} ry={34} /></Clip>

              {/* table: cast shadow, the caustic inside it, and a few strokes of the board */}
              <ellipse cx={238} cy={314} rx={116} ry={17} {...ink(c.shade, color.stageDeep, 0.95)} />
              <Hatch clip={table} p={c.shade} angle={0} gap={9} op={0.1} box={[96, 306, 280, 70]} />
              <Hatch clip={table} p={c.shade} angle={-18} gap={5} op={0.2} box={[210, 302, 150, 28]} />
              <g opacity={1 - 0.7 * t}>
                {[8, 16, 25, 35].map((r, i) => (
                  <path key={i} d={`M${f(286 - r * 1.8)} ${f(318 + r * 0.05)} A${f(r * 2.2)} ${f(r * 0.5)} 0 0 0 ${f(286 + r * 2.2)} ${f(318 + r * 0.05)}`}
                    {...cut(c.detail, color.ink, i < 2 ? INNER : DETAIL)} />
                ))}
                <ellipse cx={286} cy={317} rx={5} ry={2} {...ink(c.detail, color.ink, 0.8)} />
              </g>
              <path d="M104 328 L196 328 M122 340 L230 340 M160 352 L300 352" {...cut(c.detail, color.ink, DETAIL)} opacity={0.35} />

              {/* the water: horizontal burin lines, dense low, with a bright refracted band */}
              <Hatch clip={water} p={c.shade} angle={0} gap={5.6} op={0.2} box={[CX - 90, WY, 180, 110]} />
              <Hatch clip={water} p={c.shade} angle={0} gap={3.2} op={0.22} box={[CX - 90, 232, 180, 50]} />
              <Hatch clip={water} p={c.detail} angle={64} gap={10} op={0.1} box={[CX - 90, WY, 180, 110]} />
              {/* the clouding: stipple density rises through the glass */}
              <Stipple clip={water} p={t} n={1500} seed={6} r={1.1} op={0.5} box={[CX - 90, WY, 180, 110]} />
              <Stipple clip={water} p={t * 0.8} n={1000} seed={12} r={0.8} op={0.4} box={[CX - 90, WY + 30, 180, 80]} />
              <path d={plume(pl, 0)} {...cut(c.inner, color.ink, INNER)} />
              <path d={plume(pl, 4)} {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
              {/* surface: the ellipse of the water, doubled, with the meniscus */}
              <ellipse cx={CX} cy={WY} rx={wl} ry={wry} {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={CX} cy={WY} rx={wl - 8} ry={wry - 3} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <path d={`M${CX - wl + 14} ${WY + 5} Q${CX - 20} ${WY + wry + 3} ${CX + 30} ${WY + wry + 1}`} {...cut(c.detail, color.ink, DETAIL * 1.2)} />

              {/* the glass: double contour, flutes, diamond cut, thick base */}
              <path d={OUTER} {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
              <ellipse cx={CX} cy={YT} rx={RT - WALL} ry={RYT - 3.5} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${CX - RT + WALL} ${YT + 4} L${CX - (RB - WALL)} ${BY - 4} M${CX + RT - WALL} ${YT + 4} L${CX + (RB - WALL)} ${BY - 4}`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${CX - rx(BY)} ${BY} A${rx(BY)} ${ry(BY)} 0 0 0 ${CX + rx(BY)} ${BY}`} {...cut(c.inner, color.ink, INNER)} />
              {flutes.map((d, i) => <path key={i} d={d} {...cut(c.inner, color.ink, i === 2 || i === 3 ? INNER : DETAIL * 1.3)} />)}
              <path d={diamonds(200, 236, 272)} {...cut(c.detail, color.ink, DETAIL * 1.2)} />
              <path d={FLUTES.map((a) => flutePath(a, 200, 274)).join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              {/* highlight: a bright band down the upper left wall, struck with gaps; refraction lines on the right */}
              <path d={`M${CX - RT + 11} ${YT + 14} L${CX - RT + 18} ${YT + 54}`} {...cut(c.inner, color.ink, CONTOUR)} />
              <path d={`M${CX - RT + 20} ${YT + 66} L${CX - RT + 23} ${YT + 82}`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${CX - RB + 12} ${YB - 40} L${CX - RB + 14} ${YB - 8}`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${CX + RT - 12} ${YT + 22} L${CX + RT - 17} ${YT + 96}`} {...cut(c.detail, color.ink, DETAIL * 1.6)} />
              <Hatch clip={glass} p={c.shade} angle={72} gap={5} op={0.22} box={[CX + 28, YT, 70, 190]} />
              <Hatch clip={glass} p={c.shade} angle={72} gap={12} op={0.12} box={[CX - 40, YT, 130, 190]} />
              <Hatch clip={base} p={c.shade} angle={20} gap={3.4} op={0.42} box={[CX - 80, BY, 160, 26]} />
              <Hatch clip={base} p={c.detail} angle={-30} gap={6} op={0.25} box={[CX - 80, BY, 160, 26]} />
              <path d={`M${CX - RB + 6} ${YB - 8} Q${CX - 30} ${YB + 8} ${CX + 20} ${YB + 6}`} {...cut(c.detail, color.ink, DETAIL * 1.5)} opacity={0.9} />

              {/* the thread: two fine edges and the red core, hanging from above the frame into the water */}
              <path d={thread(10, WY, -2.6)} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <path d={thread(10, WY, 2.6)} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <path d={thread(72, WY)} {...cut(c.accent, color.red, INNER * 1.3)} />
              <circle cx={threadX(WY)} cy={WY} r={4.4} {...ink(c.accent, color.red)} />
              <ellipse cx={threadX(WY)} cy={WY} rx={16} ry={4.2} {...cut(c.accent, color.red, DETAIL * 1.2)} opacity={0.8} />
            </g>
          );
        }}
      </Plate>
    );
  };
