/**
 * **BluntPencil** — the opening shot. A hexagonal cedar pencil lying across the block, its point worn to a stub.
 * Cut as a still life: three facets of the barrel each hatched to their own tone (light from the upper left, so the
 * top facet is nearly bare paper and the bottom one is tight burin work), a crimped ferrule with its one red band,
 * the eraser, the sharpened wood cone with its scalloped cut, and the graphite lead, which is the thing that moves:
 * over the shot the exposed lead shortens and the tip rounds off, the lost point left as a dashed ghost.
 * Beneath it: graphite dust, three curled shavings, and a cast shadow built from hatch lines.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const R = 24; // circumradius of the hexagon; the three visible facets are [-R,-R/2], [-R/2,R/2], [R/2,R]
const f = (n: number) => n.toFixed(1);
const BE = 70; // end of the painted barrel
const CE = 138; // end of the wood cone, where the lead begins
const LR = 8; // lead radius

/** A curled shaving: a ribbon spiral seen from the side, as an outer and an inner edge. */
const curl = (cx: number, cy: number, r0: number, turns: number, w: number, tilt = 0.5) => {
  const a: string[] = [], b: string[] = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const s = (i / N) * turns * Math.PI * 2;
    const r = r0 * (1 - (i / N) * 0.62);
    const x = cx + r * Math.cos(s) + i * 0.9, y = cy + r * Math.sin(s) * tilt;
    const x2 = cx + (r - w) * Math.cos(s) + i * 0.9, y2 = cy + (r - w) * Math.sin(s) * tilt + w * 0.35;
    a.push(`${i ? 'L' : 'M'}${f(x)} ${f(y)}`);
    b.push(`${i ? 'L' : 'M'}${f(x2)} ${f(y2)}`);
  }
  return [a.join(' '), b.join(' ')];
};

export const BluntPencil: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [top, mid, bot, ferr, erase, cone, lead, dust, shadow] = useIds(9);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(24, 110); // the wear
          const tipX = 192 - 20 * t;
          const r = 2.4 + 5.8 * t; // tip radius
          const leadD = `M${CE} ${-LR} L${f(tipX - r * 2.2)} ${f(-r)} C${f(tipX + r * 0.25)} ${f(-r)} ${f(tipX + r * 0.25)} ${f(r)} ${f(tipX - r * 2.2)} ${f(r)} L${CE} ${LR} Z`;
          const ghostD = `M${CE} ${-LR} L193 -2 Q196 0 193 2 L${CE} ${LR}`;
          const barrel = (y0: number, y1: number) => `M-72 ${y0} L${BE} ${y0} L${BE} ${y1} L-72 ${y1} Z`;
          const coneD = `M${BE} -24 L${CE} ${-LR} L${CE} ${LR} L${BE} 24 Z`;
          const ferrD = `M-124 ${-R - 1.5} L-72 ${-R - 1.5} L-72 ${R + 1.5} L-124 ${R + 1.5} Z`;
          const eraseD = `M-124 ${-R + 1} L-150 ${-R + 1} C-164 ${-R + 1} -168 -8 -168 0 C-168 8 -164 ${R - 1} -150 ${R - 1} L-124 ${R - 1} Z`;
          const [c1a, c1b] = curl(236, 300, 24, 2.6, 6, 0.8);
          const [c2a, c2b] = curl(302, 330, 17, 2.3, 5, 0.75);
          const [c3a, c3b] = curl(162, 322, 13, 2, 4, 0.75);
          // scalloped cut where the knife left the painted wood
          const scallop = `M${BE - 2} -24 Q${BE + 26} -18 ${BE + 14} -12 Q${BE + 30} -6 ${BE + 16} 0 Q${BE + 30} 6 ${BE + 14} 12 Q${BE + 26} 18 ${BE - 2} 24`;
          // knurled ribs on the ferrule, a rolled pattern
          const ribs: string[] = [];
          for (let i = 0; i < 17; i++) { const x = -118 + i * 3.2; ribs.push(`M${f(x)} ${-R + 3} L${f(x + 1.4)} ${R - 3}`); }
          // the maker's stamp on the middle facet: a run of tiny dashes, texture not text
          const stamp: string[] = [];
          for (let i = 0; i < 22; i++) { const x = -52 + i * 6.2 + (i % 5 === 3 ? 3 : 0); stamp.push(`M${f(x)} -1 L${f(x + (i % 3 === 0 ? 4.6 : 2.4))} -1`); }
          // the grain on the cone
          const grain: string[] = [];
          for (let i = -4; i <= 4; i++) { const x0 = BE + 5 + Math.abs(i) * 5; const hw = 24 - (x0 - BE) * (16 / (CE - BE)); grain.push(`M${f(x0)} ${f((i / 4.4) * hw)} L${CE} ${f((i / 4.4) * LR * 0.9)}`); }
          return (
            <g style={breathe(c.frame, 1.2, 200)}>
              <Clip id={top} d={barrel(-R, -R / 2)} />
              <Clip id={mid} d={barrel(-R / 2, R / 2)} />
              <Clip id={bot} d={barrel(R / 2, R)} />
              <Clip id={ferr} d={ferrD} />
              <Clip id={erase} d={eraseD} />
              <Clip id={cone} d={coneD} />
              <Clip id={lead} d={leadD} />
              <Clip id={dust}><ellipse cx={276} cy={302} rx={96} ry={30} /></Clip>
              <Clip id={shadow}><path d="M-166 -10 Q-168 -24 -150 -24 L150 -24 L196 -3 Q198 0 196 3 L150 24 L-150 24 Q-168 24 -166 10 Z" /></Clip>

              {/* ground: cast shadow of the pencil, struck as hatching, then the dust and shavings */}
              
              <g transform="translate(190 176) rotate(14) translate(10 44)"><Hatch clip={shadow} p={c.shade} angle={62} gap={4.4} w={DETAIL} op={0.24} box={[-170, -26, 360, 52]} /></g>
              <Stipple clip={dust} p={c.at(30, 90)} n={380} seed={4} r={0.8} op={0.4} box={[180, 272, 192, 62]} />
              <g opacity={0.9}>
                <path d={c1a} {...cut(c.inner, color.ink, INNER)} /><path d={c1b} {...cut(c.detail, color.ink, DETAIL)} />
                <path d={c2a} {...cut(c.inner, color.ink, INNER)} /><path d={c2b} {...cut(c.detail, color.ink, DETAIL)} />
                <path d={c3a} {...cut(c.inner, color.ink, INNER)} /><path d={c3b} {...cut(c.detail, color.ink, DETAIL)} />
              </g>
              {/* a few grains that have just left the tip */}
              <g transform="translate(190 176) rotate(14)" fill={color.ink} opacity={0.55 * t}>
                {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={tipX + 4 + (i % 3) * 5} cy={14 + i * 7 + ((i * 17) % 5)} r={0.9 * (1 + (i % 2) * 0.5)} />)}
              </g>

              <g transform="translate(190 176) rotate(14)">
                {/* the pencil's own contour: eraser, ferrule, barrel, cone, lead */}
                <path d={eraseD} {...cut(c.contour, color.ink, CONTOUR)} />
                <path d={ferrD} {...cut(c.contour, color.ink, CONTOUR)} />
                <path d={`M-72 ${-R} L${BE} ${-R} M-72 ${R} L${BE} ${R}`} {...cut(c.contour, color.ink, CONTOUR)} />
                <path d={`M${BE} ${-R} L${CE} ${-LR} L${CE} ${LR} L${BE} ${R}`} {...cut(c.contour, color.ink, CONTOUR)} />
                <path d={leadD} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
                <path d={ghostD} {...cut(c.detail * (1 - t * 0.2), color.mute, DETAIL, '3 6')} />
                {/* facet edges: the structure of a hexagon */}
                <path d={`M-72 ${-R / 2} L${BE} ${-R / 2} M-72 ${R / 2} L${BE} ${R / 2}`} {...cut(c.inner, color.ink, INNER)} />
                <path d={scallop} {...cut(c.inner, color.ink, INNER)} />
                <path d={`M-72 -26 L-72 26 M${BE} -24 L${BE} 24`} {...cut(c.inner, color.ink, INNER)} />
                <path d="M-124 -25.5 L-124 25.5 M-118 -22.5 L-118 22.5" {...cut(c.inner, color.ink, INNER)} />
                {/* ferrule: crimp rings, knurl, and its one red band */}
                <path d={`M-76 ${-R - 1.5} L-76 ${R + 1.5} M-80 ${-R - 1.5} L-80 ${R + 1.5} M-120 ${-R - 1.5} L-120 ${R + 1.5}`} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
                <path d={ribs.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
                <rect x={-104} y={-R - 1.5} width={10} height={2 * R + 3} {...ink(c.accent, color.red, 0.9)} />
                <path d={`M-104 ${-R - 1.5} L-104 ${R + 1.5} M-94 ${-R - 1.5} L-94 ${R + 1.5}`} {...cut(c.accent, color.stageDeep, DETAIL)} />
                {/* barrel: the three facets, each its own tone */}
                <Hatch clip={top} p={c.shade} angle={0} gap={13} op={0.12} box={[-72, -R, 170, 12]} />
                <Hatch clip={mid} p={c.shade} angle={0} gap={8.5} op={0.22} box={[-72, -12, 170, 24]} />
                <Hatch clip={mid} p={c.detail} angle={0} gap={8.5} op={0.12} box={[-72, -12, 170, 24]} />
                <Hatch clip={bot} p={c.shade} angle={0} gap={3.2} op={0.5} box={[-72, 12, 170, 12]} />
                <Hatch clip={bot} p={c.detail} angle={34} gap={7} op={0.26} box={[-72, 12, 170, 12]} />
                <path d={stamp.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.1)} opacity={0.7} />
                <Stipple clip={mid} p={c.detail} n={160} seed={3} r={0.6} op={0.2} box={[-72, -12, 170, 24]} />
                {/* ferrule tone: bright upper strip, dark lower */}
                <Hatch clip={ferr} p={c.shade} angle={0} gap={4} op={0.34} box={[-124, 2, 52, 26]} />
                <Hatch clip={ferr} p={c.shade} angle={0} gap={10} op={0.16} box={[-124, -26, 52, 28]} />
                <path d={`M-118 ${-R + 4} L-82 ${-R + 4}`} {...cut(c.detail, color.ink, DETAIL * 1.6)} />
                {/* eraser: stippled rubber, hatched underside, worn rim */}
                <Stipple clip={erase} p={c.detail} n={260} seed={9} r={0.9} op={0.34} box={[-168, -26, 46, 52]} />
                <Hatch clip={erase} p={c.shade} angle={64} gap={4.4} op={0.34} box={[-168, 4, 46, 24]} />
                <Hatch clip={erase} p={c.shade} angle={64} gap={11} op={0.14} box={[-168, -26, 46, 52]} />
                {/* wood cone: grain along the length, darker underneath */}
                <path d={grain.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
                <Hatch clip={cone} p={c.shade} angle={8} gap={3.6} op={0.34} box={[BE, 0, 70, 26]} />
                <Hatch clip={cone} p={c.shade} angle={8} gap={9} op={0.16} box={[BE, -26, 70, 52]} />
                {/* lead: dense, with a glint left open on the upper edge */}
                <Hatch clip={lead} p={c.shade} angle={-24} gap={2.8} op={0.62} box={[CE - 2, -12, 70, 24]} />
                <Hatch clip={lead} p={c.detail} angle={22} gap={3.6} op={0.3} box={[CE - 2, -12, 70, 24]} />
                <path d={`M${CE + 8} -4.6 L${f(tipX - r * 2.4)} ${f(-r * 0.55)}`} {...cut(c.detail, color.ink, DETAIL * 1.3)} opacity={0.8} />
                <path d={`M${CE} ${-LR} L${CE} ${LR}`} {...cut(c.inner, color.ink, INNER)} />
              </g>
            </g>
          );
        }}
      </Plate>
    );
  };
