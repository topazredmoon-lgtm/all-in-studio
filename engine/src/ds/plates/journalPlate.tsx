/**
 * **JournalPlate** — an open bound journal lying flat. The two pages are parametric surfaces (`mapL`/`mapR` take a
 * page coordinate and give back the point on a page that bows toward the gutter), so every rule of text, the figure
 * and the page-block leaves all ride the same curvature. Beneath the pages the block edge is drawn as ten fine leaves,
 * the cover board is a heavier double line, and the gutter carries the sewn signatures: stitched ladders across the
 * fold and the folded stack showing at the foot of the spine.
 * Left page: engraved rule-lines (texture, not words) with one red underline. Right page: a small figure, a line
 * going downhill across a tiny axis, which draws itself while the page settles down out of a slight lift.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const f = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const bow = (u: number) => Math.sin(Math.PI * u);

/** left page: u 0 at the outer edge → 1 at the gutter; v 0 at the head → 1 at the foot */
const mapL = (u: number, v: number): [number, number] => {
  const top = 112 + 14 * u - 5 * bow(u), bot = 264 + 18 * u - 7 * bow(u);
  return [lerp(44, 198, u) + 2 * bow(v) * (1 - u), lerp(top, bot, v)];
};
/** right page, lifted by `lift` (1 at the start of the shot, 0 once it has settled): the outer corner rides up */
const mapR = (u: number, v: number, lift = 0): [number, number] => {
  const top = 126 - 14 * u - 5 * bow(u), bot = 282 - 18 * u - 7 * bow(u);
  return [lerp(202, 356, u) - lift * 9 * u * u, lerp(top, bot, v) - lift * 17 * u * u * (1 - 0.35 * v)];
};
type M = (u: number, v: number) => [number, number];

const poly = (m: M, pts: [number, number][]) => pts.map(([u, v], i) => { const [x, y] = m(u, v); return `${i ? 'L' : 'M'}${f(x)} ${f(y)}`; }).join(' ');
const edge = (m: M, a: [number, number], b: [number, number], n = 14) =>
  poly(m, Array.from({ length: n + 1 }, (_, i) => [lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)] as [number, number]));
const pageD = (m: M) => edge(m, [0, 0], [1, 0]) + ' ' + edge(m, [1, 0], [1, 1]).replace('M', 'L') + ' ' + edge(m, [1, 1], [0, 1]).replace('M', 'L') + ' ' + edge(m, [0, 1], [0, 0]).replace('M', 'L') + ' Z';

/** A column of engraved text rules: ragged line ends, paragraph breaks, a heading, all seeded. */
const textRules = (m: M, v0: number, v1: number, seed: number, skip?: (v: number) => boolean) => {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const d: string[] = [];
  const heavy: string[] = [];
  let v = v0, line = 0;
  while (v < v1) {
    if (!(skip && skip(v))) {
      const para = line % 7 === 6;
      const u0 = para ? 0.1 + 0.07 : 0.1, u1 = para ? 0.5 + rnd() * 0.2 : 0.9 - (rnd() < 0.2 ? rnd() * 0.3 : 0);
      // break the rule into word-length runs
      let u = u0;
      while (u < u1) {
        const len = 0.05 + rnd() * 0.11;
        d.push(edge(m, [u, v], [Math.min(u1, u + len), v], 3));
        u += len + 0.022;
      }
      if (line === 0) heavy.push(edge(m, [0.1, v], [0.55, v], 6));
    }
    v += 0.042; line++;
  }
  return { d: d.join(' '), heavy: heavy.join(' ') };
};

export const JournalPlate: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [pl, pr, cover, rim] = useIds(4);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const settle = c.at(26, 80);
          const lift = 1 - (1 - Math.pow(1 - settle, 2.2)); // 1 → 0, easing out
          const L = (u: number, v: number) => mapL(u, v);
          const R = (u: number, v: number) => mapR(u, v, lift);
          const lText = textRules(L, 0.09, 0.93, 3, (v) => v > 0.36 && v < 0.43 && false);
          const rText = textRules(R, 0.62, 0.93, 8);
          const rHead = textRules(R, 0.09, 0.14, 5);
          // leaves of the page block under each half
          const leaves = (m: M, from: [number, number], k: number, dir: 1 | -1) =>
            Array.from({ length: k }, (_, i) => {
              const dy = 2.2 * (i + 1);
              const pts: string[] = [];
              for (let j = 0; j <= 14; j++) {
                const u = j / 14; const [x, y] = m(u, 1);
                pts.push(`${j ? 'L' : 'M'}${f(x)} ${f(y + dy)}`);
              }
              return pts.join(' ');
            });
          const leavesL = leaves(L, [0, 1], 9, 1).join(' ');
          const leavesR = leaves(R, [0, 1], 9, -1).join(' ');
          const [lx0, ly0] = L(0, 1), [lx1, ly1] = L(1, 1), [rx0, ry0] = R(0, 1), [rx1, ry1] = R(1, 1);
          const coverD = `M34 102 Q118 98 200 118 Q282 98 366 102 L366 286 Q284 300 ${f(rx1)} ${f(ry1 + 24)} Q116 300 34 286 Z`;
          // sewn signatures: ladder stitches across the fold, and the folded stack at the foot
          const stitches = [0.16, 0.42, 0.68, 0.9].map((v) => {
            const [ax, ay] = L(0.965, v), [bx, by] = R(0.035, v);
            return { ax, ay, bx, by };
          });
          // the figure (right page, upper): axis, ticks, the falling line
          const ax0 = [0.14, 0.2] as [number, number], ax1 = [0.14, 0.54] as [number, number], ax2 = [0.86, 0.54] as [number, number];
          const axis = poly(R, [ax0, ax1, ax2]);
          const ticks = [0.3, 0.46, 0.62, 0.78].map((u) => edge(R, [u, 0.54], [u, 0.565], 1)).join(' ')
            + ' ' + [0.28, 0.37, 0.46].map((v) => edge(R, [0.14, v], [0.115, v], 1)).join(' ');
          const series: [number, number][] = [[0.16, 0.25], [0.26, 0.275], [0.36, 0.31], [0.44, 0.33], [0.52, 0.385], [0.6, 0.41], [0.68, 0.44], [0.76, 0.48], [0.84, 0.52]];
          const curve = poly(R, series);
          const dots = series.filter((_, i) => i % 2 === 0).map(([u, v]) => R(u, v));
          const grid = [0.28, 0.37, 0.46].map((v) => edge(R, [0.14, v], [0.86, v], 5)).join(' ');
          const [ex, ey] = R(0.84, 0.52);
          const ulD = (() => { const a = L(0.18, 0.314), b = L(0.7, 0.314); return `M${f(a[0])} ${f(a[1] + 3.6)} L${f(b[0])} ${f(b[1] + 3.6)}`; })();
          return (
            <g style={breathe(c.frame, 1.1, 210)}>
              <Clip id={pl} d={pageD(L)} />
              <Clip id={pr} d={pageD(R)} />
              <Clip id={cover} d={coverD} />
              <Clip id={rim}><path clipRule="evenodd" d={coverD + ' ' + pageD(L) + ' ' + pageD(R)} /></Clip>
              {/* cast shadow on the desk */}
              <ellipse cx={206} cy={318} rx={176} ry={19} {...ink(c.shade, color.stageDeep, 0.95)} />
              <Hatch clip={rim} p={c.shade} angle={0} gap={4.4} op={0.16} box={[34, 286, 332, 30]} />
              {/* the cover board: a heavy contour, with its edge band */}
              <path d={coverD} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={`M34 286 Q116 ${f(300)} ${f(lx1 + 2)} ${f(ly1 + 26)} Q284 300 366 286`} {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={rim} p={c.shade} angle={55} gap={3.6} op={0.36} box={[30, 96, 340, 14]} />
              <Hatch clip={rim} p={c.shade} angle={55} gap={3.6} op={0.3} box={[30, 96, 10, 200]} />
              <Hatch clip={rim} p={c.shade} angle={55} gap={3.6} op={0.3} box={[360, 96, 10, 200]} />
              <Stipple clip={rim} p={c.detail} n={420} seed={7} r={0.8} op={0.28} box={[30, 96, 340, 210]} />
              {/* the page block seen edge-on: ten fine leaves each side */}
              <path d={leavesL} {...cut(c.inner, color.ink, DETAIL)} opacity={0.85} />
              <path d={leavesR} {...cut(c.inner, color.ink, DETAIL)} opacity={0.85} />
              <path d={`M${f(lx0)} ${f(ly0)} L${f(lx0)} ${f(ly0 + 20)} M${f(rx0 + 0)} ${f(ry0)} L${f(rx0)} ${f(ry0 + 20)} M${f(R(1, 1)[0])} ${f(R(1, 1)[1])} L${f(R(1, 1)[0])} ${f(R(1, 1)[1] + 20)}`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${f(lx0)} ${f(ly0 + 20)} Q116 ${f(284)} ${f(lx1)} ${f(ly1 + 20)} M${f(rx0)} ${f(ry0 + 20)} Q284 284 ${f(rx1)} ${f(ry1 + 20)}`} {...cut(c.inner, color.ink, INNER)} />
              {/* the foot of the spine: folded signatures stacked at the gutter */}
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i} d={`M${f(lx1 - 2)} ${f(ly1 + 4 + i * 4.2)} Q200 ${f(ly1 + 11 + i * 4.2)} ${f(rx0 + 2)} ${f(ry0 + 4 + i * 4.2)}`} {...cut(c.detail, color.ink, DETAIL)} />
              ))}
              <circle cx={200} cy={ly1 + 26} r={2.6} {...ink(c.detail, color.ink, 0.8)} />
              {/* the pages: contour, with the curl's own shadow falling inward off the lifted right edge */}
              <path d={pageD(L)} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <path d={pageD(R)} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <Hatch clip={pl} p={c.shade} angle={82} gap={3.2} op={0.4} box={[150, 100, 50, 190]} />
              <Hatch clip={pl} p={c.shade} angle={82} gap={7} op={0.2} box={[110, 100, 90, 190]} />
              <Hatch clip={pr} p={c.shade} angle={98} gap={3.2} op={0.4} box={[200, 100, 50, 190]} />
              <Hatch clip={pr} p={c.shade} angle={98} gap={7} op={0.2} box={[200, 100, 90, 190]} />
              <Hatch clip={pl} p={c.detail} angle={18} gap={12} op={0.07} box={[40, 100, 160, 190]} />
              <Hatch clip={pr} p={c.detail} angle={-18} gap={12} op={0.07} box={[200, 100, 160, 190]} />
              {/* shadow under the lifted corner: strong while the page is up, gone when it lies flat */}
              <Hatch clip={pr} p={c.shade * lift} angle={64} gap={3} op={0.5} box={[290, 96, 76, 100]} />
              <path d={`M${f(R(1, 0)[0])} ${f(R(1, 0)[1])} L${f(R(1, 1)[0])} ${f(R(1, 1)[1])}`} {...cut(c.inner, color.ink, CONTOUR * 0.9)} />
              {/* text: engraved rule-lines, a heading, never words */}
              <path d={lText.d} {...cut(c.detail, color.ink, DETAIL)} opacity={0.82} />
              <path d={lText.heavy} {...cut(c.detail, color.ink, INNER)} opacity={0.9} />
              <path d={rText.d} {...cut(c.detail, color.ink, DETAIL)} opacity={0.82} />
              <path d={rHead.d} {...cut(c.detail, color.ink, INNER * 0.9)} opacity={0.9} />
              {/* the red: one underline beneath a line of the fake text */}
              <path d={ulD} {...cut(c.accent, color.red, INNER)} />
              {/* the figure: axis, grid, and the line that draws itself downhill */}
              <path d={grid} {...cut(c.detail * 0.4, color.ink, DETAIL, '2 4')} />
              <path d={axis} {...cut(c.inner, color.ink, INNER)} />
              <path d={ticks} {...cut(c.detail, color.ink, DETAIL)} />
              <path d={curve} {...cut(c.at(44, 70), color.ink, INNER * 1.15)} />
              {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.3} {...ink(c.at(44 + i * 12, 8), color.ink)} />)}
              <circle cx={ex} cy={ey} r={3.4} {...ink(c.at(100, 8), color.ink)} />
              {/* sewn signatures across the gutter: ladder stitches with their knots */}
              {stitches.map((s, i) => (
                <g key={i}>
                  <path d={`M${f(s.ax)} ${f(s.ay - 2.4)} L${f(s.bx)} ${f(s.by - 2.4)} M${f(s.ax)} ${f(s.ay + 2.4)} L${f(s.bx)} ${f(s.by + 2.4)}`} {...cut(c.inner, color.ink, DETAIL * 1.1)} />
                  <circle cx={s.ax} cy={s.ay} r={2.2} {...ink(c.inner, color.ink)} />
                  <circle cx={s.bx} cy={s.by} r={2.2} {...ink(c.inner, color.ink)} />
                </g>
              ))}
              <path d={`M200 ${f(lerp(120, 118, 0))} L200 ${f(ly1)}`} {...cut(c.inner, color.ink, INNER)} />
            </g>
          );
        }}
      </Plate>
    );
  };
