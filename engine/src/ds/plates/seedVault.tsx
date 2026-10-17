/**
 * **SeedVault** — a seed bank: a cabinet of labelled specimen drawers, one pulled open on jars of seed.
 * The grid is a loop (five columns by four rows); every drawer front has its own bevel struck by where it sits in the
 * light (the lower right carries more burin work), its label plate with engraved rules, wood grain and a brass bar
 * pull with a shadow under it. The open drawer is drawn as the real thing: a cavity of dense hatching in its slot, a
 * tray seen from above with walls and floor, its front panel slid down toward us, and three glass jars, each
 * full of seeds (small tilted ellipses, generated) with a cork and a tied tag. Everything is precise and catalogued.
 * Red: the tag on the middle jar. Motion: the drawer slides further out and that jar lifts clear, its tag swinging.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const f = (n: number) => n.toFixed(1);
const hash = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const COLS = 5, ROWS = 4, X0 = 45, Y0 = 42, CW = 62, CHT = 57;
const OPEN = { col: 2, row: 3 };

/** one jar: glass body, cork, seeds, and its tied tag */
const Jar: React.FC<{ cx: number; base: number; seed: number; clipId: string; c: { inner: number; detail: number; shade: number; accent: number; contour: number }; red?: boolean; swing: number }> =
  ({ cx, base, seed, clipId, c, red, swing }) => {
    const w = 9.5, h = 31, top = base - h;
    const seeds: React.ReactNode[] = [];
    for (let i = 0; i < 46; i++) {
      const u = hash(i, seed), v = hash(i, seed + 3);
      const x = cx + (u - 0.5) * (w * 2 - 4), y = base - 3 - v * (h * 0.68);
      seeds.push(<ellipse key={i} cx={f(x)} cy={f(y)} rx={1.7} ry={0.95} transform={`rotate(${f(hash(i, seed + 7) * 180)} ${f(x)} ${f(y)})`} />);
    }
    const tagX = cx + w + 5 + swing, tagY = top + 12;
    return (
      <g>
        <clipPath id={clipId}><path d={`M${cx - w} ${top} L${cx - w} ${base} A${w} 3.2 0 0 0 ${cx + w} ${base} L${cx + w} ${top} Z`} /></clipPath>
        <path d={`M${cx - w} ${top} L${cx - w} ${base} A${w} 3.2 0 0 0 ${cx + w} ${base} L${cx + w} ${top}`} {...cut(c.inner, color.ink, INNER)} />
        <ellipse cx={cx} cy={top} rx={w} ry={3.2} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
        <g clipPath={`url(#${clipId})`} fill={color.ink} opacity={0.82 * c.detail}>{seeds}</g>
        <Hatch clip={clipId} p={c.shade} angle={90} gap={2.6} op={0.3} box={[cx + 2, top, w, h + 4]} />
        <path d={`M${cx - w + 2.6} ${top + 4} L${cx - w + 2.6} ${base - 4}`} {...cut(c.detail, color.ink, DETAIL * 1.8)} opacity={0.9} />
        {/* cork and neck band */}
        <path d={`M${cx - w - 1} ${top - 6} L${cx + w + 1} ${top - 6} L${cx + w + 1} ${top} L${cx - w - 1} ${top} Z`} {...cut(c.contour, color.ink, INNER)} />
        <path d={Array.from({ length: 5 }, (_, i) => `M${f(cx - w + 2 + i * 4.2)} ${top - 5} L${f(cx - w + 2 + i * 4.2)} ${top - 1}`).join(' ')} {...cut(c.detail, color.ink, DETAIL)} />
        {/* the tag: string round the neck, a small card hanging from it, a hole and a rule or two */}
        <path d={`M${cx + w + 1} ${top - 2} Q${f(cx + w + 4)} ${top + 1} ${f(tagX)} ${f(tagY - 5)}`} {...cut(c.detail, red ? color.red : color.ink, DETAIL * 1.1)} />
        <g transform={`rotate(${f(8 + swing * 3)} ${f(tagX)} ${f(tagY - 5)})`}>
          <path d={`M${f(tagX - 4.6)} ${f(tagY - 1)} L${f(tagX + 4.6)} ${f(tagY - 1)} L${f(tagX + 4.6)} ${f(tagY + 10)} L${f(tagX - 4.6)} ${f(tagY + 10)} L${f(tagX - 4.6)} ${f(tagY - 1)} Z`}
            {...(red ? { ...ink(c.accent, color.red, 0.95) } : cut(c.inner, color.ink, DETAIL * 1.3))} />
          <circle cx={tagX} cy={tagY + 1.4} r={1} fill={color.stageDeep} opacity={c.detail} />
          <path d={`M${f(tagX - 2.8)} ${f(tagY + 5)} L${f(tagX + 2.8)} ${f(tagY + 5)} M${f(tagX - 2.8)} ${f(tagY + 7.6)} L${f(tagX + 1.2)} ${f(tagY + 7.6)}`} {...cut(c.detail, red ? color.stageDeep : color.ink, DETAIL * 0.9)} />
        </g>
      </g>
    );
  };

export const SeedVault: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [cavity, tray, jar0, jar1, jar2, body] = useIds(6);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(34, 100); // drawer slides, jar lifts
          const ox = X0 + OPEN.col * CW, oy = Y0 + OPEN.row * CHT, ocx = ox + CW / 2;
          const pull = 36 + 16 * t;
          const yF = oy + pull; // top edge of the front panel
          const yB = oy + 14; // back edge of the tray, inside the slot
          const bevelHi: string[] = [], bevelLo: string[] = [], rects: string[] = [], insets: string[] = [], labels: string[] = [], rules: string[] = [], pulls: string[] = [], pullShadow: string[] = [], grain: string[] = [];
          for (let r = 0; r < ROWS; r++) {
            for (let k = 0; k < COLS; k++) {
              if (r === OPEN.row && k === OPEN.col) continue;
              const x = X0 + k * CW + 3.5, y = Y0 + r * CHT + 3.5, dw = CW - 7, dh = CHT - 7, cx = x + dw / 2;
              const dark = (k / (COLS - 1) + r / (ROWS - 1)) / 2;
              rects.push(`M${f(x)} ${f(y)} h${dw} v${dh} h${-dw} Z`);
              insets.push(`M${f(x + 4.5)} ${f(y + 4.5)} h${dw - 9} v${dh - 9} h${-(dw - 9)} Z`);
              // bevel: bright top/left lines, hatched bottom/right in proportion to the shade
              bevelHi.push(`M${f(x + 2)} ${f(y + dh - 2)} L${f(x + 2)} ${f(y + 2)} L${f(x + dw - 2)} ${f(y + 2)}`);
              const nLo = 2 + Math.floor(dark * 3.2);
              for (let i = 0; i < nLo; i++) {
                bevelLo.push(`M${f(x + dw - 2 - i * 2.1)} ${f(y + 4 + i * 2.1)} L${f(x + dw - 2 - i * 2.1)} ${f(y + dh - 2 - i * 2.1)} L${f(x + 4 + i * 2.1)} ${f(y + dh - 2 - i * 2.1)}`);
              }
              // label plate with its two engraved rules
              labels.push(`M${f(cx - 13)} ${f(y + 10)} h26 v10 h-26 Z`);
              rules.push(`M${f(cx - 10)} ${f(y + 13.4)} h${f(12 + hash(k + r * 7, 1) * 8)} M${f(cx - 10)} ${f(y + 16.8)} h${f(7 + hash(k + r * 7, 2) * 12)}`);
              // pull: a brass bar on two posts, with its shadow
              const py = y + dh - 15;
              pulls.push(`M${f(cx - 11)} ${f(py)} L${f(cx - 11)} ${f(py + 3)} L${f(cx + 11)} ${f(py + 3)} L${f(cx + 11)} ${f(py)}`);
              pullShadow.push(`M${f(cx - 10)} ${f(py + 6)} l${f(20)} 0 M${f(cx - 8)} ${f(py + 8.4)} l16 0`);
              grain.push(`M${f(x + 7)} ${f(y + 25 + hash(k * 5 + r, 3) * 6)} q${f(10)} ${f(-2)} ${f(18 + hash(k + r * 3, 4) * 14)} 0 M${f(x + 14)} ${f(y + 31)} q10 2 ${f(14 + hash(k + r * 3, 6) * 8)} 0`);
            }
          }
          const frontW = 70, backW = 56;
          const trayD = `M${ocx - backW / 2} ${yB} L${ocx + backW / 2} ${yB} L${ocx + frontW / 2} ${yF} L${ocx - frontW / 2} ${yF} Z`;
          const wallL = `M${ocx - backW / 2} ${yB} L${ocx - frontW / 2} ${yF} L${ocx - frontW / 2 + 6} ${yF} L${ocx - backW / 2 + 4} ${yB + 4} Z`;
          const wallR = `M${ocx + backW / 2} ${yB} L${ocx + frontW / 2} ${yF} L${ocx + frontW / 2 - 6} ${yF} L${ocx + backW / 2 - 4} ${yB + 4} Z`;
          const jars = [
            { cx: ocx - 21, k: 0, id: jar0 },
            { cx: ocx, k: 1, id: jar1 },
            { cx: ocx + 21, k: 2, id: jar2 },
          ];
          const baseY = (u: number) => lerp(yB + 14, yF - 6, u);
          const lift = 24 * Math.pow(t, 1.3);
          const PY = yF + 28;
          return (
            <g style={breathe(c.frame, 1.1, 220)}>
              <Clip id={cavity}><rect x={ox + 3.5} y={oy + 3.5} width={CW - 7} height={CHT - 7} /></Clip>
              <Clip id={tray} d={trayD} />
              <Clip id={body}><rect x={38} y={26} width={324} height={270} /></Clip>

              {/* floor shadow of the whole cabinet and of the pulled drawer */}
              <ellipse cx={206} cy={338} rx={170} ry={13} {...ink(c.shade, color.stageDeep, 0.95)} />
              <path d={`M${ocx - 36} ${f(yF + 58)} L${ocx + 52} ${f(yF + 58)} L${ocx + 70} ${f(yF + 70)} L${ocx - 26} ${f(yF + 70)} Z`} {...ink(c.shade, color.stageDeep, 0.9)} />

              {/* the cabinet: cornice, body, plinth */}
              <path d="M38 40 L38 292 L362 292 L362 40 Z" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M30 40 L370 40 L370 30 L30 30 Z M34 30 L34 24 L366 24 L366 30" {...cut(c.inner, color.ink, INNER)} />
              <path d="M30 34 L370 34" {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
              <path d="M34 292 L34 308 L366 308 L366 292 M50 308 L50 322 L72 322 L72 308 M328 308 L328 322 L350 322 L350 308" {...cut(c.inner, color.ink, INNER)} />
              <path d="M38 300 L362 300" {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <Hatch clip={body} p={c.shade} angle={90} gap={3} op={0.3} box={[346, 26, 16, 270]} />
              <Hatch clip={body} p={c.shade} angle={0} gap={3} op={0.26} box={[38, 284, 324, 8]} />

              {/* the drawers: fronts, insets, bevels, labels, pulls, grain */}
              <path d={rects.join(' ')} {...cut(c.inner, color.ink, INNER)} />
              <path d={insets.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <path d={bevelHi.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.5)} opacity={0.85} />
              <path d={bevelLo.join(' ')} {...cut(c.shade, color.ink, DETAIL)} opacity={0.5} />
              <path d={labels.join(' ')} {...cut(c.inner, color.ink, INNER * 0.8)} />
              <path d={rules.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              <path d={pulls.join(' ')} {...cut(c.inner, color.ink, INNER * 1.1)} />
              <path d={pullShadow.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.4} />
              <path d={grain.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.3} />

              {/* the open drawer: dark cavity in the slot, tray walls and floor, jars, then the sliding front */}
              <rect x={ox + 3.5} y={oy + 3.5} width={CW - 7} height={CHT - 7} {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={cavity} p={c.shade} angle={62} gap={2.6} op={0.34} box={[ox, oy, CW, CHT]} />
              <Hatch clip={cavity} p={c.detail} angle={-28} gap={4} op={0.24} box={[ox, oy, CW, CHT]} />
              <path d={`M${ox + 3.5} ${oy + 3.5} h${CW - 7} v${CHT - 7} h${-(CW - 7)} Z`} {...cut(c.inner, color.ink, INNER)} />
              <path d={trayD} {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={tray} p={c.shade} angle={16} gap={3} op={0.4} box={[ocx - 40, yB, 80, yF - yB]} />
              <Hatch clip={tray} p={c.detail} angle={-50} gap={5} op={0.26} box={[ocx - 40, yB, 80, yF - yB]} />
              <Stipple clip={tray} p={c.detail} n={160} seed={21} r={0.8} op={0.3} box={[ocx - 40, yB, 80, yF - yB]} />
              <path d={wallL} {...cut(c.inner, color.ink, INNER)} />
              <path d={wallR} {...cut(c.inner, color.ink, INNER)} />
              <path d={trayD} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              {jars.map((j) => {
                const base = baseY(0.5 + j.k * 0.06);
                const dy = j.k === 1 ? -lift : 0;
                return (
                  <g key={j.k} transform={`translate(0 ${f(dy)})`}>
                    <Jar cx={j.cx} base={base} seed={j.k * 5 + 2} clipId={j.id} c={c} red={j.k === 1} swing={j.k === 1 ? Math.sin(c.frame / 9) * 1.6 * Math.min(1, lift / 6) : 0} />
                  </g>
                );
              })}
              {/* the lifted jar leaves a gap and a ring of shadow in the tray */}
              <ellipse cx={ocx} cy={baseY(0.5 + 0.06) + 1} rx={10.6} ry={3.6} {...cut(c.detail * Math.min(1, lift / 4), color.ink, DETAIL, '2 3')} />
              {/* the front panel, slid out and down */}
              <path d={`M${ocx - frontW / 2} ${f(yF)} h${frontW} v${CHT - 4} h${-frontW} Z`} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={`M${ocx - frontW / 2} ${f(yF)} h${frontW} v${CHT - 4} h${-frontW} Z`} {...cut(c.contour, color.ink, CONTOUR * 0.85)} />
              <path d={`M${ocx - frontW / 2 + 6} ${f(yF + 6)} h${frontW - 12} v${CHT - 16} h${-(frontW - 12)} Z`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <path d={`M${ocx - 15} ${f(yF + 11)} h30 v11 h-30 Z`} {...cut(c.inner, color.ink, INNER * 0.8)} />
              <path d={`M${ocx - 11} ${f(yF + 14.6)} h${f(16)} M${ocx - 11} ${f(yF + 18.4)} h${f(10)}`} {...cut(c.detail, color.ink, DETAIL)} />
              <path d={`M${ocx - 12} ${f(PY - 9)} L${ocx - 12} ${f(PY - 6)} L${ocx + 12} ${f(PY - 6)} L${ocx + 12} ${f(PY - 9)}`} {...cut(c.inner, color.ink, INNER * 1.1)} />
              <path d={`M${ocx - 11} ${f(PY - 2)} l22 0 M${ocx - 9} ${f(PY + 0.6)} l18 0`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.45} />
              <path d={`M${ocx - frontW / 2 + 3} ${f(yF + 3)} L${ocx - frontW / 2 + 3} ${f(yF + CHT - 8)}`} {...cut(c.detail, color.ink, DETAIL * 1.6)} opacity={0.85} />
              <path d={Array.from({ length: 5 }, (_, i) => `M${f(ocx + frontW / 2 - 3 - i * 2.2)} ${f(yF + 4 + i * 2.2)} L${f(ocx + frontW / 2 - 3 - i * 2.2)} ${f(yF + CHT - 6 - i * 2.2)} L${f(ocx - frontW / 2 + 5 + i * 2.2)} ${f(yF + CHT - 6 - i * 2.2)}`).join(' ')} {...cut(c.shade, color.ink, DETAIL)} opacity={0.5} />
            </g>
          );
        }}
      </Plate>
    );
  };
