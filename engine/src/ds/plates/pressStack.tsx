/**
 * **PressStack** — "Machines write an enormous share of it now. Product descriptions, reviews, summaries, answers."
 *
 * A hand-press with an impression drum, spindle and lever, ejecting sheets down a chute onto a tall stack: every slab the
 * same thickness, the same edge, ruled with the same perfectly regular rows. Beside it lies ONE sheet written by hand:
 * a wandering baseline, rows of uneven length, a crossed-out line and a blot. The contrast is the picture.
 *
 * The stack is generated (4 → 24 slabs as the shot runs, 5 units each, so it climbs past the press head's height line),
 * and the newest sheet is always in the air on a parabola from the chute to the stack top (the one red form). The lever
 * swings, the drum turns.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const rng = (seed: number) => { let s = seed * 9301 + 49297; for (let i = 0; i < 4; i++) s = (s * 9301 + 49297) % 233280; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };
const f1 = (n: number) => n.toFixed(1);

const GROUND = 340, SX0 = 210, SW = 66, SD: [number, number] = [14, -6], TH = 5;

// the one handwritten sheet: a flat page in perspective, o + u*U + v*V
const O: [number, number] = [298, 338], U: [number, number] = [64, -6], V: [number, number] = [22, -54];
const wp = (u: number, v: number) => `${f1(O[0] + u * U[0] + v * V[0])} ${f1(O[1] + u * U[1] + v * V[1])}`;
const HAND_ROWS = (() => {
  const r = rng(31);
  const rows: string[] = [];
  let v = 0.13;
  for (let k = 0; k < 7; k++) {
    const len = 0.42 + r() * 0.5, u0 = 0.08 + r() * 0.05;
    let wob = 0;
    const pts: string[] = [];
    for (let i = 0; i <= 18; i++) {
      wob += (r() - 0.5) * 0.028;
      const u = u0 + (len * i) / 18;
      pts.push(`${i === 0 ? 'M' : 'L'}${wp(u, v + wob + 0.012 * Math.sin(i * 1.9 + k))}`);
    }
    rows.push(pts.join(' '));
    v += 0.105 + r() * 0.03;
  }
  return rows;
})();
const CROSSED = `M${wp(0.1, 0.5)} L${wp(0.6, 0.53)} M${wp(0.12, 0.54)} L${wp(0.58, 0.49)} M${wp(0.14, 0.47)} L${wp(0.52, 0.56)}`;
const SHEET_D = `M${wp(0, 0)} L${wp(1, 0)} L${wp(1, 1)} L${wp(0, 1)} Z`;

export const PressStack: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [frame, drum, hand, sideFace] = useIds(4);
    const stackSide = (top: number) => `M${SX0 + SW} ${GROUND} L${SX0 + SW + SD[0]} ${GROUND + SD[1]} L${SX0 + SW + SD[0]} ${top + SD[1]} L${SX0 + SW} ${top} Z`;
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const since = Math.max(0, c.since);
          const t = c.at(20, 78);
          const x = t * 18;
          const n = Math.min(26, 8 + Math.floor(x));
          const fl = x - Math.floor(x);
          const top = GROUND - TH * n;
          const swing = 5 * Math.sin((since * Math.PI * 2) / 26);
          const spin = since * 0.18;

          // the stack
          const slabs: React.ReactNode[] = [];
          for (let i = 0; i < n; i++) {
            const y = GROUND - TH * (i + 1);
            slabs.push(<rect key={i} x={SX0} y={y} width={SW} height={TH} {...cut(c.inner, color.ink, DETAIL * 1.25)} fill={color.stageDeep} />);
          }
          const sideLines: string[] = [];
          for (let i = 1; i <= n; i++) sideLines.push(`M${SX0 + SW} ${GROUND - TH * i} L${SX0 + SW + SD[0]} ${GROUND - TH * i + SD[1]}`);
          const topFace = `M${SX0} ${top} L${SX0 + SW} ${top} L${SX0 + SW + SD[0]} ${top + SD[1]} L${SX0 + SD[0]} ${top + SD[1]} Z`;
          const topRules: string[] = [];
          for (let k = 1; k <= 4; k++) { const f = k / 5; topRules.push(`M${f1(SX0 + 6 + SD[0] * f)} ${f1(top + SD[1] * f)} L${f1(SX0 + SW - 8 + SD[0] * f)} ${f1(top + SD[1] * f)}`); }

          // the sheet in flight: chute mouth -> stack top, one parabola per slab
          const sx = 214, sy = 190, ex = SX0 + SW / 2 + 6, ey = top - 2;
          const px = sx + (ex - sx) * fl, py = sy + (ey - sy) * fl - Math.sin(fl * Math.PI) * 26;
          const ang = -14 + 20 * fl;
          const flight = `translate(${f1(px)} ${f1(py)}) rotate(${f1(ang)})`;

          // the press
          const threads: string[] = [];
          for (let y = 124; y < 172; y += 5.2) threads.push(`M100 ${y.toFixed(1)} L116 ${(y + 3.6).toFixed(1)}`);
          const dentils: string[] = [];
          for (let xx = 32; xx < 186; xx += 7.5) dentils.push(`M${xx} 91 V97`);
          const flutes: string[] = [];
          [34, 158].forEach((x0) => [6, 12, 18].forEach((o) => flutes.push(`M${x0 + o} 126 V312`)));
          const drumLines: string[] = [];
          for (let k = 1; k < 9; k++) { const yy = 176 + 50 * (0.5 - 0.5 * Math.cos((k / 9) * Math.PI)); drumLines.push(`M60 ${f1(yy)} H156`); }
          const capMarks = [0, 1, 2].map((k) => { const a = spin + (k * Math.PI * 2) / 3; return `M58 201 L${f1(58 + Math.cos(a) * 6)} ${f1(201 + Math.sin(a) * 21)}`; }).join(' ');
          const lever = `rotate(${f1(swing - 4)} 108 150)`;

          return (
            <g style={breathe(c.frame, 1, 190)}>
              <Clip id={frame}>
                <rect x={18} y={316} width={180} height={24} />
                <rect x={34} y={112} width={24} height={204} />
                <rect x={158} y={112} width={24} height={204} />
                <rect x={24} y={88} width={168} height={32} />
                <path d="M58 262 L58 316 L98 316 Z M158 262 L158 316 L118 316 Z" />
              </Clip>
              <Clip id={drum} d="M58 176 H158 V226 H58 Z" />
              <Clip id={sideFace} d={stackSide(top)} />
              <Clip id={hand} d={SHEET_D} />

              {/* cast shadows */}
              <ellipse cx={110} cy={342} rx={100} ry={7} {...ink(c.shade, color.stageDeep, 1)} />
              <ellipse cx={SX0 + SW / 2 + 8} cy={343} rx={56} ry={5} {...ink(c.shade, color.stageDeep, 1)} />
              <ellipse cx={O[0] + 38} cy={341} rx={46} ry={5} {...ink(c.shade, color.stageDeep, 1)} />

              {/* the press: plinth, uprights, head */}
              <path d="M18 316 H198 V340 H18 Z M34 112 H58 V316 H34 Z M158 112 H182 V316 H158 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M24 120 V96 Q24 88 32 88 H184 Q192 88 192 96 V120 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M18 316 H198 V340 H18 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M34 316 V120 M58 316 V120 M158 316 V120 M182 316 V120" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M24 120 V96 Q24 88 32 88 H184 Q192 88 192 96 V120 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M58 262 L58 316 L98 316 Z M158 262 L158 316 L118 316 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M58 262 L98 316 H58 M158 262 L118 316 H158" {...cut(c.inner, color.ink, INNER)} />
              <path d="M24 108 H192 M18 326 H198" {...cut(c.inner, color.ink, INNER)} />
              <path d={flutes.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <path d={dentils.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.75} />
              <circle cx={108} cy={80} r={6.5} {...cut(c.inner, color.ink, INNER)} />
              <path d="M108 86 V88" {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={frame} p={c.shade} angle={74} gap={2.8} op={0.6} box={[100, 88, 100, 252]} />
              <Hatch clip={frame} p={c.shade} angle={74} gap={6} op={0.3} box={[18, 88, 180, 252]} />
              <Hatch clip={frame} p={c.detail} angle={-20} gap={5} op={0.2} cross box={[100, 130, 100, 210]} />
              <Stipple clip={frame} p={c.detail} n={240} seed={5} r={0.9} op={0.26} box={[18, 88, 180, 252]} />

              {/* spindle and lever */}
              <path d="M100 120 V176 M116 120 V176" {...cut(c.contour, color.ink, INNER)} />
              <path d={threads.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.2)} />
              <g transform={lever}>
                <ellipse cx={108} cy={150} rx={19} ry={6} {...ink(c.inner, color.stageDeep, 1)} />
                <ellipse cx={108} cy={150} rx={19} ry={6} {...cut(c.inner, color.ink, INNER)} />
                <path d="M34 150 L204 150" {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
                <path d="M34 153 L204 153" {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
                <circle cx={30} cy={150} r={6.5} {...ink(c.inner, color.stageDeep, 1)} />
                <circle cx={30} cy={150} r={6.5} {...cut(c.inner, color.ink, INNER)} />
                <circle cx={210} cy={150} r={11} {...ink(c.inner, color.stageDeep, 1)} />
                <circle cx={210} cy={150} r={11} {...cut(c.contour, color.ink, INNER * 1.2)} />
                <path d="M203 154 Q210 160 217 154 M205 157 Q210 162 215 157" {...cut(c.detail, color.ink, DETAIL)} />
              </g>

              {/* the impression drum */}
              <path d="M58 176 H158 V226 H58 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d={drumLines.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              <Hatch clip={drum} p={c.shade} angle={0} gap={3.2} op={0.4} box={[58, 202, 100, 24]} />
              <path d="M58 176 H158 M58 226 H158" {...cut(c.contour, color.ink, CONTOUR)} />
              <ellipse cx={58} cy={201} rx={8} ry={25} {...ink(c.inner, color.stageDeep, 1)} />
              <ellipse cx={58} cy={201} rx={8} ry={25} {...cut(c.contour, color.ink, INNER)} />
              <path d={capMarks} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
              <ellipse cx={158} cy={201} rx={8} ry={25} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              {/* bed and chute */}
              <path d="M58 238 H158 V256 H58 Z" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M58 238 H158 V256 H58 Z" {...cut(c.inner, color.ink, INNER)} />
              <path d="M64 247 H152" {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <path d="M158 214 L208 196 L212 205 L158 228" {...ink(c.contour, color.stageDeep, 1)} />
              <path d="M158 214 L208 196 L212 205 L158 228" {...cut(c.contour, color.ink, INNER * 1.15)} />
              <path d="M166 220 L204 205" {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />

              {/* the stack: slabs identical to the unit */}
              <path d={stackSide(top)} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={sideLines.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              <Hatch clip={sideFace} p={c.shade} angle={74} gap={3} op={0.45} box={[SX0 + SW, top - 8, 16, GROUND - top + 10]} />
              <path d={stackSide(top)} {...cut(c.contour, color.ink, INNER)} />
              {slabs}
              <path d={`M${SX0} ${GROUND} H${SX0 + SW} M${SX0} ${top} V${GROUND}`} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={topFace} {...ink(c.inner, color.stageDeep, 1)} />
              <path d={topFace} {...cut(c.contour, color.ink, INNER)} />
              <path d={topRules.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.75} />
              <g transform={flight}>
                <g transform="scale(1.35)">
                <path d="M-18 -3 L12 -5 L18 3 L-12 5 Z" {...ink(1, color.stageDeep, 1)} /><path d="M-18 -3 L12 -5 L18 3 L-12 5 Z" {...cut(c.accent, color.red, INNER * 1.1)} />
                <path d="M-12 0 L10 -1.5" {...cut(c.accent, color.red, DETAIL)} /></g>
              </g>

              {/* the one handwritten sheet */}
              <path d={`M${wp(0, 0)} L${wp(1, 0)} L${wp(1, -0.035)} L${wp(0, -0.035)} Z`} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={SHEET_D} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={SHEET_D} {...cut(c.contour, color.ink, INNER * 1.15)} />
              <path d={`M${wp(0, 0)} L${wp(0, -0.045)} L${wp(1, -0.045)} L${wp(1, 0)}`} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <path d={HAND_ROWS.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.7)} opacity={0.95} />
              <path d={CROSSED} {...cut(c.detail, color.ink, DETAIL * 1.1)} opacity={0.8} />
              <ellipse cx={O[0] + 46} cy={O[1] - 24} rx={3.8} ry={2.2} {...ink(c.shade, color.ink, 0.85)} />
              <Hatch clip={hand} p={c.shade} angle={62} gap={5.5} op={0.26} box={[330, 290, 60, 50]} />
              <Stipple clip={hand} p={c.detail} n={60} seed={9} r={0.7} op={0.3} box={[304, 288, 90, 52]} />
            </g>
          );
        }}
      </Plate>
    );
  };
