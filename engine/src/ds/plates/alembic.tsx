/**
 * **Alembic** — "A machine writes it. The web keeps it. The next machine drinks it straight back in."
 *
 * A glass still: round-bottomed flask on a brick furnace, a swan-neck, a coiled worm inside a wooden condenser tub, and
 * a receiving bottle, except that the receiver's side pipe climbs back and enters the flask. A closed loop of glass.
 *
 * Glass is never filled. Every glass tube is a thick cream stroke with a thinner stageDeep stroke laid over it, which
 * leaves a double contour; the flask and bottle are double circles with broken highlight arcs and a hatched rim where the
 * glass is thick. The furnace, the plinth and the tub are the heavy forms: generated brick courses, hatch, stipple.
 * The coil is a computed helix (only the front half is cut, the back half is a faint trace behind it).
 *
 * Red: the flame, and only the flame, built from three tongues that sway and lengthen.
 * Motion: the flame flickers, bubbles climb the flask, droplets run down the coil, drip into the receiver, the level
 * in the receiver rises, and beads travel up the return pipe.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

type P = [number, number];
const f1 = (n: number) => n.toFixed(1);
const poly = (pts: P[], close = false) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L') + (close ? ' Z' : '');
const sw = (w: number) => (cut(1, color.ink, w) as { strokeWidth: number }).strokeWidth;

const smooth = (pts: P[], n = 8): P[] => {
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
const along = (pts: P[], f: number): P => { const k = Math.min(pts.length - 1, Math.max(0, f * (pts.length - 1))); const i = Math.floor(k), t = k - i; const a = pts[i], b = pts[Math.min(pts.length - 1, i + 1)]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };

const SWAN = smooth([[98, 188], [98, 124], [98, 96], [114, 72], [150, 62], [196, 72], [232, 98], [254, 124], [266, 142], [274, 156]]);
const OUT = smooth([[326, 246], [304, 260], [270, 266], [236, 262], [216, 262], [207, 272]]);
const BACK = smooth([[196, 298], [186, 278], [177, 256], [168, 244], [158, 238]]);

/** the helix: x = cx + A cos(phi), y = y0 + pitch * phi/2pi + B sin(phi) */
const HX = 300, HA = 27, HY0 = 164, HPITCH = 15, HB = 5.5, HTURNS = 5.4;
const helix = (phi: number): P => [HX + HA * Math.cos(phi), HY0 + (HPITCH * phi) / (Math.PI * 2) + HB * Math.sin(phi)];

const flameTongue = (cx: number, base: number, h: number, hw: number, sway: number) =>
  `M${f1(cx - hw)} ${base} C${f1(cx - hw)} ${f1(base - h * 0.45)} ${f1(cx + sway - 7)} ${f1(base - h * 0.72)} ${f1(cx + sway)} ${f1(base - h)} C${f1(cx + sway + 9)} ${f1(base - h * 0.6)} ${f1(cx + hw)} ${f1(base - h * 0.36)} ${f1(cx + hw)} ${base} Z`;

const bricks = (x0: number, x1: number, y0: number, y1: number, bh: number, bw: number) => {
  const d: string[] = [];
  let row = 0;
  for (let y = y0; y < y1; y += bh, row++) {
    d.push(`M${x0} ${y} H${x1}`);
    for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1; x += bw) d.push(`M${f1(x)} ${y} V${Math.min(y + bh, y1)}`);
  }
  return d.join(' ');
};

export const Alembic: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [flask, rim, furn, arch, plinth, tub, win, bottle] = useIds(8);
    const FURN = 'M30 306 H166 V372 H30 Z M58 372 V344 A40 24 0 0 1 138 344 V372 Z';
    const ARCH = 'M58 372 V344 A40 24 0 0 1 138 344 V372 Z';
    const TUB = 'M238 120 L242 288 H358 L362 120 Z';
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const since = Math.max(0, c.since);
          const fr = c.frame;
                    const tubeGlass = (pts: P[], p: number, wo = 7.4, wi = 4.4) => (
            <g>
              <path d={poly(pts)} {...cut(p, color.ink, wo)} />
              <path d={poly(pts)} {...cut(p, color.stageDeep, wi)} />
            </g>
          );
          const level = 352 - 16 * c.at(30, 110);
          const fl = 270 - 8 * c.at(30, 110);
          const flameT = [
            { cx: 98, h: 60, hw: 20, ph: 0 }, { cx: 78, h: 42, hw: 12, ph: 2.1 }, { cx: 119, h: 44, hw: 13, ph: 4.2 },
          ].map((f) => {
            const h = f.h * (1 + 0.1 * Math.sin(fr * 0.55 + f.ph) + 0.05 * Math.sin(fr * 1.3 + f.ph * 2));
            const sway = 6 * Math.sin(fr * 0.42 + f.ph) + 2.5 * Math.sin(fr * 1.1 + f.ph);
            return { ...f, h, sway };
          });
          // the helix, front half cut, back half a faint trace
          const front: string[] = [], back: string[] = [];
          const PH = Math.PI * 2 * HTURNS;
          let curF = '', curB = '';
          for (let phi = 0; phi <= PH; phi += 0.12) {
            const p = helix(phi), isFront = Math.sin(phi) > 0;
            if (isFront) { curF += (curF ? 'L' : 'M') + `${f1(p[0])} ${f1(p[1])} `; if (curB) { back.push(curB); curB = ''; } }
            else { curB += (curB ? 'L' : 'M') + `${f1(p[0])} ${f1(p[1])} `; if (curF) { front.push(curF); curF = ''; } }
          }
          if (curF) front.push(curF); if (curB) back.push(curB);
          const drops = [0, 1, 2, 3].map((k) => {
            const ph = ((since * 0.034 + k / 4) % 1) * PH * 0.98;
            return { p: helix(ph), vis: Math.sin(ph) > 0 };
          });
          const dripP = (since / 20) % 1;
          const bubbles = [0, 1, 2, 3, 4].map((k) => { const f = ((since * 0.012 + k * 0.21) % 1); return { x: 98 + Math.sin(k * 2.3) * 22 * (0.5 + f * 0.5) + Math.sin(since * 0.08 + k) * 2, y: 292 - f * 62, r: 1.8 + (k % 3) * 0.7, o: Math.sin(f * Math.PI) }; });
          const beads = [0, 1, 2].map((k) => along(BACK, ((since * 0.012 + k / 3) % 1)));
          const staves: string[] = [];
          for (let i = 1; i < 10; i++) { const f = i / 10; staves.push(`M${f1(238 + 124 * f)} ${f1(120 + 11 * Math.sqrt(1 - Math.pow(2 * f - 1, 2)))} L${f1(242 + 116 * f)} 288`); }
          const hoop = (y: number, k: number) => { const hw = 62 - (y - 120) * 0.0238; return `M${f1(300 - hw)} ${y} A${f1(hw)} 11 0 0 0 ${f1(300 + hw)} ${y}`; };
          return (
            <g style={breathe(fr, 1.1, 180)}>
              <Clip id={flask} d="M98 180 a60 60 0 1 0 0.01 0 Z" />
              <Clip id={rim}><path d="M98 180 a60 60 0 1 0 0.01 0 Z M98 186 a54 54 0 1 0 0.01 0 Z" clipRule="evenodd" /></Clip>
              <Clip id={furn}><path d={FURN} clipRule="evenodd" /></Clip>
              <Clip id={arch} d={ARCH} />
              <Clip id={plinth} d="M236 288 H364 V372 H236 Z" />
              <Clip id={tub} d={TUB} />
              <Clip id={win} d="M268 150 H332 Q338 150 338 156 V244 Q338 250 332 250 H268 Q262 250 262 244 V156 Q262 150 268 150 Z" />
              <Clip id={bottle} d="M204 306 a30 30 0 1 0 0.01 0 Z" />
              <ellipse cx={200} cy={374} rx={172} ry={8} {...ink(c.shade, color.stageDeep, 1)} />

              {/* furnace */}
              <path d={FURN} {...ink(c.contour, color.stageDeep, 1)} fillRule="evenodd" />
              <path d={bricks(30, 166, 306, 372, 9.3, 22)} {...cut(c.inner, color.ink, DETAIL * 1.15)} opacity={0.75} />
              <Hatch clip={furn} p={c.shade} angle={38} gap={2.8} op={0.55} box={[80, 306, 90, 70]} />
              <Hatch clip={furn} p={c.shade} angle={38} gap={7} op={0.2} box={[30, 306, 136, 70]} />
              <Stipple clip={furn} p={c.detail} n={420} seed={3} r={0.9} op={0.3} box={[30, 306, 136, 66]} />
              <path d="M30 306 H166 V372 H30 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={ARCH} {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={arch} p={c.shade} angle={-8} gap={3.2} op={0.4} box={[58, 318, 80, 56]} />
              <path d="M58 372 V344 A40 24 0 0 1 138 344 V372" {...cut(c.contour, color.ink, INNER * 1.2)} />
              <path d="M52 372 V342 A46 29 0 0 1 144 342 V372" {...cut(c.detail, color.ink, DETAIL * 1.3)} opacity={0.75} />
              {/* the flame: the one red form */}
              <g clipPath={`url(#${arch})`}>
                {flameT.map((f, i) => (
                  <g key={i}>
                    <path d={flameTongue(f.cx, 372, f.h, f.hw, f.sway)} {...ink(c.accent, color.red, 0.42)} />
                    <path d={flameTongue(f.cx, 372, f.h, f.hw, f.sway)} {...cut(c.accent, color.red, INNER)} />
                    <path d={flameTongue(f.cx, 372, f.h * 0.6, f.hw * 0.5, f.sway * 0.6)} {...cut(c.accent, color.red, DETAIL * 1.3)} />
                  </g>
                ))}
                <path d="M70 372 H126" {...cut(c.accent, color.red, INNER)} />
              </g>
              {/* trivet */}
              <path d="M44 306 Q98 296 152 306" {...cut(c.inner, color.ink, INNER * 1.2)} />
              <path d="M52 310 Q98 300 144 310" {...cut(c.detail, color.ink, DETAIL * 1.3)} />

              {/* the flask: double circle, liquid, bubbles, thick rim hatched, highlights */}
              <circle cx={98} cy={240} r={60} {...ink(c.contour, color.stageDeep, 1)} />
                            <g clipPath={`url(#${flask})`}>
                <path d="M38 262 Q58 256 78 262 T118 262 T158 262 V302 H38 Z" {...ink(c.shade, color.ink, 0.05)} />
              </g>
              <g clipPath={`url(#${flask})`}>
                {Array.from({ length: 11 }, (_, k) => <path key={k} d={`M38 ${f1(266 + k * 4.2)} H158`} stroke={color.ink} strokeWidth={sw(DETAIL)} opacity={c.shade * (0.16 + k * 0.025)} />)}
                {bubbles.map((b, i) => <circle key={i} cx={f1(b.x)} cy={f1(b.y)} r={b.r} fill="none" stroke={color.ink} strokeWidth={sw(DETAIL)} opacity={b.o * c.detail * 0.9} />)}
              </g>
              <path d="M38 262 Q58 256 78 262 T118 262 T158 262" {...cut(c.inner, color.ink, DETAIL * 1.5)} />
              <circle cx={98} cy={240} r={60} {...cut(c.contour, color.ink, CONTOUR)} />
              <circle cx={98} cy={240} r={54.5} {...cut(c.inner, color.ink, DETAIL * 1.2)} />
              <Hatch clip={rim} p={c.shade} angle={48} gap={2.6} op={0.45} box={[98, 230, 66, 76]} />
              <path d="M62 202 A46 46 0 0 1 90 188" {...cut(c.inner, color.ink, INNER)} />
              <path d="M52 218 A52 52 0 0 1 56 207" {...cut(c.detail, color.ink, DETAIL * 1.5)} />
              <path d="M142 222 A50 50 0 0 1 144 230" {...cut(c.detail, color.ink, DETAIL * 1.5)} />
              {/* neck and swan-neck (double-contoured glass tube) */}
              {tubeGlass(SWAN, c.contour, 10.4, 6.4)}
              <path d="M84 186 L88 182 M112 186 L108 182" {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={98} cy={181} rx={14} ry={3.6} {...cut(c.inner, color.ink, INNER)} />
              <path d="M92 150 V120" {...cut(c.detail, color.ink, DETAIL * 1.3)} opacity={0.8} />
              <path d={along(SWAN, 0.55).map(f1).join(' ').replace(/^/, 'M') + ' L' + along(SWAN, 0.62).map(f1).join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.3)} />

              {/* the tub on its plinth */}
              <path d="M236 288 H364 V372 H236 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d={bricks(236, 364, 288, 372, 10, 24)} {...cut(c.inner, color.ink, DETAIL * 1.15)} opacity={0.75} />
              <Hatch clip={plinth} p={c.shade} angle={38} gap={2.8} op={0.55} box={[280, 288, 86, 86]} />
              <Hatch clip={plinth} p={c.shade} angle={38} gap={7} op={0.2} box={[236, 288, 130, 86]} />
              <Stipple clip={plinth} p={c.detail} n={460} seed={9} r={0.9} op={0.3} box={[236, 288, 128, 84]} />
              <path d="M236 288 H364 V372 H236 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={TUB} {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M238 288 Q300 304 362 288" {...ink(c.contour, color.stageDeep, 1)} />
              <path d={staves.join(' ')} {...cut(c.inner, color.ink, DETAIL * 1.3)} opacity={0.85} />
              <Hatch clip={tub} p={c.shade} angle={84} gap={2.6} op={0.62} box={[300, 116, 66, 180]} />
              <Hatch clip={tub} p={c.shade} angle={84} gap={5.5} op={0.34} box={[238, 116, 124, 180]} cross />
              <Stipple clip={tub} p={c.detail} n={300} seed={17} r={0.85} op={0.26} box={[238, 116, 124, 172]} />
              <path d={TUB} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M238 288 Q300 304 362 288" {...cut(c.contour, color.ink, INNER)} />
              <ellipse cx={300} cy={120} rx={62} ry={11} {...ink(c.contour, color.stageDeep, 1)} />
              <ellipse cx={300} cy={120} rx={62} ry={11} {...cut(c.contour, color.ink, INNER * 1.15)} />
              <ellipse cx={300} cy={121} rx={55} ry={8} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.8} />
              <path d={hoop(160, 0) + ' ' + hoop(262, 1)} {...cut(c.inner, color.ink, INNER * 1.15)} />
              <path d={hoop(164, 0) + ' ' + hoop(266, 1)} {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
              {/* inspection window with the worm */}
              <path d="M268 150 H332 Q338 150 338 156 V244 Q338 250 332 250 H268 Q262 250 262 244 V156 Q262 150 268 150 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={win} p={c.shade} angle={-70} gap={4.4} op={0.32} box={[262, 150, 76, 100]} />
              <path d={back.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.3)} opacity={0.5} />
              {front.map((d, i) => (
                <g key={i}><path d={d} {...cut(c.inner, color.ink, 6.4)} /><path d={d} {...cut(c.inner, color.stageDeep, 3.7)} /></g>
              ))}
              {drops.map((d, i) => d.vis && <circle key={i} cx={f1(d.p[0])} cy={f1(d.p[1])} r={2.5} {...ink(c.detail, color.ink, 0.95)} />)}
              <path d="M268 150 H332 Q338 150 338 156 V244 Q338 250 332 250 H268 Q262 250 262 244 V156 Q262 150 268 150 Z" {...cut(c.contour, color.ink, INNER * 1.3)} />
              <path d="M259 154 V246 M341 154 V246" {...cut(c.detail, color.ink, DETAIL * 1.3)} opacity={0.7} />
              {[[264, 154], [336, 154], [264, 246], [336, 246]].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2.3} {...cut(c.detail, color.ink, DETAIL * 1.2)} />)}
              {/* inlet over the rim, outlet pipe, spout */}
              {tubeGlass(smooth([[250, 122], [262, 138], [274, 158]]), c.contour, 10.4, 6.4)}
              {tubeGlass(OUT, c.inner, 8.6, 5)}
              {dripP < 0.8 && <ellipse cx={207} cy={f1(272 + dripP * 14)} rx={1.8} ry={2.7} {...ink(c.detail, color.ink, 1)} />}

              {/* the receiver: round bottle, level rising, return pipe back into the flask */}
              <circle cx={204} cy={336} r={30} {...ink(c.contour, color.stageDeep, 1)} />
              <g clipPath={`url(#${bottle})`}>
                {Array.from({ length: 9 }, (_, k) => (level + k * 4 < 366 ? <path key={k} d={`M172 ${f1(level + k * 4)} H236`} stroke={color.ink} strokeWidth={sw(DETAIL)} opacity={c.shade * (0.2 + k * 0.03)} /> : null))}
              </g>
              <path d={`M175 ${f1(level)} Q189 ${f1(level - 3)} 204 ${f1(level)} T233 ${f1(level)}`} {...cut(c.inner, color.ink, DETAIL * 1.4)} clipPath={`url(#${bottle})`} />
              <path d="M204 306 a30 30 0 1 0 0.01 0 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <circle cx={204} cy={336} r={25.5} {...cut(c.inner, color.ink, DETAIL * 1.2)} />
              <path d="M182 320 A26 26 0 0 1 192 312" {...cut(c.inner, color.ink, INNER)} />
              <path d="M227 343 A26 26 0 0 1 220 356" {...cut(c.detail, color.ink, DETAIL * 1.5)} />
              <path d="M195 306 V284 M213 306 V284" {...cut(c.contour, color.ink, INNER * 1.2)} />
              <ellipse cx={204} cy={284} rx={11} ry={3.2} {...cut(c.inner, color.ink, INNER)} />
              {tubeGlass(BACK, c.contour, 8.6, 5)}
              <ellipse cx={157} cy={238} rx={4} ry={6.5} {...cut(c.inner, color.ink, INNER)} />
              {beads.map((p, i) => <circle key={i} cx={f1(p[0])} cy={f1(p[1])} r={2} {...ink(c.detail, color.ink, 0.9)} />)}
            </g>
          );
        }}
      </Plate>
    );
  };
