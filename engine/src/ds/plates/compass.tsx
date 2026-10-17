/**
 * **Compass** — a boxed mariner's compass seen from above: a wooden box with brass corner screws, two brass gimbal
 * rings on crossed pivots, a card with a 32-point rose (each point split light/dark by burin lines) and 360 engraved
 * degree ticks, under a glass cover with a highlight arc.
 *
 * The plate is the gap. Two needles share the pivot: a faint true-north needle (stays put) and the bold wrong one,
 * which swings in, overshoots and settles a few degrees east of north — confidently, and then perfectly still.
 * Red: the wrong needle.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const CX = 200, CY = 200, OFF = 9; // the needle settles OFF degrees east of true north
const f1 = (n: number) => n.toFixed(1);
const pol = (a: number, r: number): [number, number] => { const q = (a * Math.PI) / 180; return [CX + r * Math.sin(q), CY - r * Math.cos(q)]; };
const P = (p: [number, number]) => `${f1(p[0])} ${f1(p[1])}`;
const ring = (r: number) => `M${CX - r} ${CY} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;

/** Hatched half of a needle/point: burin lines parallel to the centre line, between O→Bl and the edge Bl→T. */
const halfHatch = (O: [number, number], T: [number, number], B: [number, number], m: number) => {
  let d = '';
  for (let j = 1; j <= m; j++) {
    const u = j / (m + 1);
    const a: [number, number] = [O[0] + (B[0] - O[0]) * u, O[1] + (B[1] - O[1]) * u];
    const b: [number, number] = [B[0] + (T[0] - B[0]) * u, B[1] + (T[1] - B[1]) * u];
    d += `M${P(a)} L${P(b)} `;
  }
  return d;
};

/** The 32 points of the rose: 4 cardinal, 4 ordinal, 8 half-winds, 16 quarter-winds. */
const rose = () => {
  const outline: string[] = [], shade: string[] = [], centre: string[] = [];
  for (let i = 0; i < 32; i++) {
    const a = i * 11.25;
    const L = i % 8 === 0 ? 112 : i % 4 === 0 ? 90 : i % 2 === 0 ? 72 : 54;
    const bw = i % 8 === 0 ? 11 : i % 4 === 0 ? 9 : i % 2 === 0 ? 7 : 5.5;
    const T = pol(a, L), O = pol(a, 4), Bl = pol(a - bw * 1.6, 17), Br = pol(a + bw * 1.6, 17);
    outline.push(`M${P(Bl)} L${P(T)} L${P(Br)}`);
    centre.push(`M${P(O)} L${P(T)}`);
    shade.push(halfHatch(O, T, Bl, i % 4 === 0 ? 5 : 3));
  }
  return { outline: outline.join(' '), shade: shade.join(' '), centre: centre.join(' ') };
};
const ROSE = rose();

/** 360 degree ticks, batched by weight so the burin passes round the rim in four sweeps. */
const ticks = () => {
  const t1: string[] = [], t5: string[] = [], t10: string[] = [], t30: string[] = [];
  for (let d = 0; d < 360; d++) {
    const [r0, r1, bucket] = d % 30 === 0 ? [118, 130, t30] : d % 10 === 0 ? [119, 128, t10] : d % 5 === 0 ? [120, 126, t5] : [121.5, 125, t1];
    bucket.push(`M${P(pol(d, r0))} L${P(pol(d, r1))}`);
  }
  return { t1: t1.join(' '), t5: t5.join(' '), t10: t10.join(' '), t30: t30.join(' ') };
};
const TICKS = ticks();

const Screw: React.FC<{ x: number; y: number; r: number; rot: number; p: number }> = ({ x, y, r, rot, p }) => (
  <g>
    <circle cx={x} cy={y} r={r} {...ink(p, color.stageDeep, 1)} />
    <circle cx={x} cy={y} r={r} {...cut(p, color.ink, INNER)} />
    <circle cx={x} cy={y} r={r * 0.62} {...cut(p, color.ink, DETAIL)} />
    <path d={`M${f1(x - r * 0.7 * Math.cos(rot))} ${f1(y - r * 0.7 * Math.sin(rot))} L${f1(x + r * 0.7 * Math.cos(rot))} ${f1(y + r * 0.7 * Math.sin(rot))}`} {...cut(p, color.ink, INNER)} />
    <path d={`M${f1(x - r * 0.5)} ${f1(y - r * 0.55)} a${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.5} ${-r * 0.1}`} {...cut(p, color.ink, DETAIL * 0.8)} opacity={0.6} />
  </g>
);

export const Compass: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [boxClip, ringA, ringB, card] = useIds(4);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const s = c.at(40, 70) * 70 / 30; // seconds-ish since the needle was released
          // damped swing: starts well west of north, overshoots to the east, settles on OFF and is then dead still
          const settle = c.at(40, 70) >= 1 ? 1 : 0;
          const wrong = settle ? OFF : OFF + (-26 - OFF) * Math.exp(-1.9 * s) * Math.cos(s * 3.4) * 1;
          const boxPath = 'M26 14 H374 Q386 14 386 26 V374 Q386 386 374 386 H26 Q14 386 14 374 V26 Q14 14 26 14 Z';
          const boxClipD = `${boxPath} ${ring(171)}`;
          const outerRing = `${ring(172)} ${ring(156)}`;
          const innerRing = `${ring(148)} ${ring(134)}`;

          // pointer geometry (angle measured from north, clockwise)
          const needle = (ang: number, len: number, tail: number, hw: number) => {
            const T = pol(ang, len), Tl = pol(ang + 180, tail), L = pol(ang - 90, hw), R = pol(ang + 90, hw);
            return { T, Tl, L, R, d: `M${P(T)} L${P(R)} L${P(Tl)} L${P(L)} Z`, left: `M${P(T)} L${P(L)} L${P(Tl)} Z`, spine: `M${P(T)} L${P(Tl)}` };
          };
          const tn = needle(0, 108, 64, 6.5);
          const wn = needle(wrong, 114, 58, 9.5);
          const wnShadow = needle(wrong, 114, 58, 9.5);

          // wood grain in the box corners
          const grain = Array.from({ length: 34 }, (_, i) => `M18 ${f1(22 + i * 10.6)} L382 ${f1(22 + i * 10.6 + (i % 3) * 0.8)}`).join(' ');

          return (
            <g style={breathe(c.frame, 0.9, 230)}>
              <Clip id={boxClip}><path d={boxClipD} clipRule="evenodd" /></Clip>
              <Clip id={ringA}><path d={outerRing} clipRule="evenodd" /></Clip>
              <Clip id={ringB}><path d={innerRing} clipRule="evenodd" /></Clip>
              <Clip id={card} d={ring(132)} />
              {/* box */}
              <path d={boxPath} {...ink(c.shade, color.stageDeep, 1)} />
              <path d={boxPath} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M26 24 H374 Q376 24 376 26 V374 Q376 376 374 376 H26 Q24 376 24 374 V26 Q24 24 26 24 Z" {...cut(c.inner, color.ink, INNER * 0.8)} />
              <g clipPath={`url(#${boxClip})`}><path d={grain} fill="none" stroke={color.ink} strokeWidth={DETAIL} opacity={0.2 * c.detail} /></g>
              <Hatch clip={boxClip} p={c.shade} angle={45} gap={5.5} op={0.3} box={[200, 200, 200, 200]} />
              <Hatch clip={boxClip} p={c.shade} angle={45} gap={12} op={0.14} />
              <Stipple clip={boxClip} p={c.detail} n={260} seed={8} r={0.9} op={0.2} />
              {[[40, 40, 0.6], [360, 40, 2.1], [40, 360, 1.2], [360, 360, 0.2]].map(([x, y, r], i) => <Screw key={i} x={x} y={y} r={11} rot={r} p={c.inner} />)}
              {/* cast shadow of the ring on the box floor */}
              <path d={ring(174)} {...ink(c.shade, color.stageDeep, 0.9)} />

              {/* outer gimbal ring (pivots left/right into the box) */}
              <path d={outerRing} {...ink(c.shade, color.stageDeep, 1)} />
              <path d={ring(172)} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <path d={ring(156)} {...cut(c.inner, color.ink, INNER)} />
              <path d={ring(164)} {...cut(c.detail, color.ink, DETAIL * 0.8)} opacity={0.5} />
              <Hatch clip={ringA} p={c.shade} angle={50} gap={3.6} op={0.34} box={[200, 200, 180, 180]} />
              <Hatch clip={ringA} p={c.shade} angle={50} gap={7.5} op={0.2} />
              <Screw x={28} y={200} r={8.5} rot={0.4} p={c.inner} />
              <Screw x={372} y={200} r={8.5} rot={1.9} p={c.inner} />
              {/* inner gimbal ring (pivots top/bottom into the outer) */}
              <path d={innerRing} {...ink(c.shade, color.stageDeep, 1)} />
              <path d={ring(148)} {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
              <path d={ring(134)} {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={ringB} p={c.shade} angle={50} gap={3.2} op={0.32} box={[200, 200, 160, 160]} />
              <Screw x={200} y={42} r={7} rot={1.0} p={c.inner} />
              <Screw x={200} y={358} r={7} rot={2.3} p={c.inner} />
              <path d="M200 49 V57 M200 343 V351" {...cut(c.inner, color.ink, INNER * 1.2)} />

              {/* the card */}
              <path d={ring(132)} {...ink(c.shade, color.stageDeep, 1)} />
              <path d={ring(130)} {...cut(c.contour, color.ink, INNER * 1.2)} />
              <path d={ring(118)} {...cut(c.inner, color.ink, INNER * 0.9)} />
              <path d={TICKS.t1} {...cut(c.detail, color.ink, DETAIL * 0.6)} opacity={0.7} />
              <path d={TICKS.t5} {...cut(c.detail, color.ink, DETAIL * 0.8)} />
              <path d={TICKS.t10} {...cut(c.detail, color.ink, DETAIL)} />
              <path d={TICKS.t30} {...cut(c.inner, color.ink, INNER * 0.9)} />
              {/* rose: shaded halves, outlines, spines */}
              <path d={ROSE.shade} {...cut(c.shade, color.ink, DETAIL * 0.8)} opacity={0.75} />
              <path d={ROSE.outline} {...cut(c.inner, color.ink, INNER * 0.85)} />
              <path d={ROSE.centre} {...cut(c.inner, color.ink, DETAIL)} />
              <circle cx={CX} cy={CY} r={17} {...cut(c.inner, color.ink, INNER * 0.9)} />
              <circle cx={CX} cy={CY} r={10} {...cut(c.detail, color.ink, DETAIL)} />
              {/* the north fleur */}
              <Hatch clip={card} p={c.shade} angle={40} gap={9} op={0.12} box={[190, 190, 150, 150]} />
              <Stipple clip={card} p={c.detail} n={240} seed={13} r={0.8} op={0.16} />

              {/* true north: faint, thin, never moves */}
              <g opacity={0.85}>
                <path d={tn.d} {...cut(c.inner, color.ink, DETAIL * 1.1)} />
                <path d={tn.spine} {...cut(c.detail, color.ink, DETAIL * 0.8)} />
                <path d={halfHatch([CX, CY], tn.T, tn.L, 4)} {...cut(c.detail, color.ink, DETAIL * 0.7)} />
              </g>

              {/* the wrong needle: cast shadow, body, shaded half, spine, and the cap */}
              <path d={wnShadow.d} transform="translate(5 7)" {...ink(c.accent, color.stageDeep, 0.85)} />
              <path d={wn.d} {...ink(c.accent, color.stageDeep, 1)} />
              <path d={wn.d} {...cut(c.accent, color.red, CONTOUR * 0.65)} />
              <path d={wn.left} {...ink(c.accent, color.red, 0.88)} />
              <path d={wn.spine} {...cut(c.accent, color.stageDeep, DETAIL * 0.9)} opacity={0.8} />
              <circle cx={CX} cy={CY} r={8.5} {...ink(c.accent, color.stageDeep, 1)} />
              <circle cx={CX} cy={CY} r={8.5} {...cut(c.accent, color.ink, INNER)} />
              <circle cx={CX - 2} cy={CY - 2} r={2} {...ink(c.accent, color.ink, 0.8)} />
              {/* the gap: a small arc between the tips, so the plate says "a few degrees" without a word */}
              {settle > 0 && <path d={`M${P(pol(0, 96))} A96 96 0 0 1 ${P(pol(OFF, 96))}`} {...cut(c.accent, color.ink, INNER * 0.8)} />}

              {/* glass: rim, then the highlight arcs */}
              <path d={ring(134)} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.6} />
              <path d={`M${P(pol(-62, 124))} A124 124 0 0 1 ${P(pol(-22, 124))}`} {...cut(c.detail, color.ink, INNER * 1.6)} opacity={0.75} />
              <path d={`M${P(pol(-52, 115))} A115 115 0 0 1 ${P(pol(-33, 115))}`} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.6} />
              <path d={`M${P(pol(-90, 108))} l-10 -10 M${P(pol(-84, 98))} l-10 -10`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              <path d={`M${P(pol(104, 122))} A122 122 0 0 1 ${P(pol(122, 122))}`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.4} />
            </g>
          );
        }}
      </Plate>
    );
  };
