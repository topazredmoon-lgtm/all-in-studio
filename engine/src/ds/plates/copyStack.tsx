/**
 * **CopyStack** — "They trained a model on its own output. Then trained the next one on that. Again, and again."
 * Caption: "a copy of a copy"
 *
 * Four broadsheets cascading across the block: Generation 0 (the original press impression), Gen 1, Gen 2,
 * and Gen 3 (the copy of a copy of a copy).
 *
 * The degradation is physical and generational:
 *   - Gen 0 is pristine: double classical framing rules with corner rosettes, an engraved sunburst emblem,
 *     two crisp columns of regular text rules, and a deep red wax seal in the lower corner.
 *   - Gen 1 has slight ink spread, softened borders, and occasional dropout.
 *   - Gen 2 exhibits severe generation loss: broken framing, drifting baselines, missing text segments.
 *   - Gen 3 (the latest copy) has degraded into ghost contours, fragmented dashes, and heavy grain noise.
 *     The red seal is reduced to a faint, smeared shadow.
 *
 * Motion: on `dropAt="again"`, the final copy slides down into place on the cascade, settling onto the stack.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { useCue } from '../core';
import { CONTOUR, Clip, Cut, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const f1 = (n: number) => n.toFixed(1);

const SW = 124, SH = 172;

/** Generates text rules for a column with generation-dependent degradation */
const makeLines = (gen: number, x0: number, y0: number, w: number, rows = 8) => {
  const lines: { d: string; w: number; dash?: string; op?: number }[] = [];
  const rowH = 9.5;
  for (let r = 0; r < rows; r++) {
    const y = y0 + r * rowH;
    const right = x0 + w - ((r % 4 === 3) ? w * 0.35 : 0);
    if (gen === 0) {
      lines.push({ d: `M${f1(x0)} ${f1(y)} H${f1(right)}`, w: DETAIL * 1.1 });
    } else if (gen === 1) {
      lines.push({ d: `M${f1(x0)} ${f1(y)} H${f1(right)}`, w: DETAIL * 1.3, dash: '18 1.5 24 1' });
    } else if (gen === 2) {
      if (r % 5 !== 4) {
        lines.push({ d: `M${f1(x0)} ${f1(y)} H${f1(right)}`, w: DETAIL * 0.9, dash: '8 4 12 3 6 4' });
      }
    } else {
      if (r % 3 !== 2) {
        lines.push({ d: `M${f1(x0 + 4)} ${f1(y)} H${f1(right - 6)}`, w: DETAIL * 0.75, dash: '3 5 2 4 4 6', op: 0.7 });
      }
    }
  }
  return lines;
};

interface SheetSpec {
  gen: number;
  cx: number;
  cy: number;
  rot: number;
}

const Sheet: React.FC<{
  spec: SheetSpec;
  c: Cut;
  clipId: string;
  isTop?: boolean;
  slideProgress?: number;
}> = ({ spec, c, clipId, isTop, slideProgress = 1 }) => {
  const { gen, rot } = spec;
  const slideY = isTop ? (1 - slideProgress) * -45 : 0;
  const slideX = isTop ? (1 - slideProgress) * 18 : 0;
  const slideRot = isTop ? (1 - slideProgress) * 7 : 0;

  const cx = spec.cx + slideX;
  const cy = spec.cy + slideY;
  const r = rot + slideRot;

  const x0 = -SW / 2, y0 = -SH / 2;
  const x1 = SW / 2, y1 = SH / 2;

  const pathBody = `M${x0} ${y0} H${x1} V${y1} H${x0} Z`;
  const m = 8;
  const innerPath = `M${x0 + m} ${y0 + m} H${x1 - m} V${y1 - m} H${x0 + m} Z`;
  const fineInner = `M${x0 + m + 3} ${y0 + m + 3} H${x1 - m - 3} V${y1 - m - 3} H${x0 + m + 3} Z`;

  const leftCol = makeLines(gen, x0 + m + 6, y0 + 44, (SW - 2 * m - 18) / 2, 9);
  const rightCol = makeLines(gen, x0 + m + 8 + (SW - 2 * m - 18) / 2, y0 + 44, (SW - 2 * m - 18) / 2, 9);

  return (
    <g transform={`translate(${f1(cx)} ${f1(cy)}) rotate(${f1(r)})`}>
      <Clip id={clipId} d={pathBody} />

      {/* Sheet backing fill & outline */}
      <path d={pathBody} {...ink(c.contour, color.stageDeep, 1)} />

      {/* Drop shadow edge */}
      <path d={`M${x1} ${y0 + 6} V${y1} H${x0 + 6}`} {...cut(c.contour * 0.4, color.ink, CONTOUR * 0.6)} />

      {/* Main page boundary */}
      <path
        d={pathBody}
        {...cut(c.contour * (gen === 3 ? 0.75 : 1), color.ink, gen === 3 ? CONTOUR * 0.75 : CONTOUR, gen === 3 ? '22 3 16 2' : undefined)}
      />

      {/* Framing rules based on generation */}
      {gen < 3 && <path d={innerPath} {...cut(c.inner * (gen === 2 ? 0.7 : 0.9), color.ink, INNER * 0.85, gen === 2 ? '14 3 8 2' : undefined)} />}
      {gen === 0 && <path d={fineInner} {...cut(c.detail * 0.85, color.ink, DETAIL)} />}

      {/* Corner rosettes for Gen 0 */}
      {gen === 0 && (
        <g>
          <rect x={x0 + m - 2} y={y0 + m - 2} width={4} height={4} {...cut(c.detail * 0.9, color.ink, DETAIL)} />
          <rect x={x1 - m - 2} y={y0 + m - 2} width={4} height={4} {...cut(c.detail * 0.9, color.ink, DETAIL)} />
          <rect x={x0 + m - 2} y={y1 - m - 2} width={4} height={4} {...cut(c.detail * 0.9, color.ink, DETAIL)} />
          <rect x={x1 - m - 2} y={y1 - m - 2} width={4} height={4} {...cut(c.detail * 0.9, color.ink, DETAIL)} />
        </g>
      )}

      {/* Header emblem at top */}
      {gen === 0 && (
        <g>
          <circle cx={0} cy={y0 + 24} r={10} {...cut(c.inner, color.ink, INNER)} />
          <circle cx={0} cy={y0 + 24} r={6} {...cut(c.detail, color.ink, DETAIL)} />
          <path d={`M-8 ${y0 + 24} H8 M0 ${y0 + 16} V${y0 + 32}`} {...cut(c.detail, color.ink, DETAIL)} />
          <path d={`M-32 ${y0 + 36} H32 M-24 ${y0 + 39} H24`} {...cut(c.detail, color.ink, DETAIL)} />
        </g>
      )}
      {gen === 1 && (
        <g>
          <circle cx={0} cy={y0 + 24} r={9.5} {...cut(c.inner * 0.9, color.ink, INNER * 0.9)} />
          <path d={`M-6 ${y0 + 24} H6 M0 ${y0 + 18} V${y0 + 30}`} {...cut(c.detail * 0.9, color.ink, DETAIL)} />
          <path d={`M-28 ${y0 + 36} H28`} {...cut(c.detail * 0.9, color.ink, DETAIL)} />
        </g>
      )}
      {gen === 2 && (
        <g>
          <ellipse cx={0} cy={y0 + 24} rx={9} ry={8.5} {...cut(c.detail * 0.75, color.ink, DETAIL * 1.2, '8 2 4 2')} />
          <path d={`M-22 ${y0 + 36} H22`} {...cut(c.detail * 0.75, color.ink, DETAIL, '6 3')} />
        </g>
      )}
      {gen === 3 && (
        <g>
          <path d={`M-7 ${y0 + 22} Q0 ${y0 + 17} 7 ${y0 + 23} Q0 ${y0 + 29} -7 ${y0 + 22}`} {...cut(c.detail * 0.5, color.ink, DETAIL, '3 3')} />
          <path d={`M-16 ${y0 + 36} H16`} {...cut(c.detail * 0.5, color.ink, DETAIL, '4 4')} />
        </g>
      )}

      {/* Two columns of text rules */}
      {leftCol.map((l, i) => (
        <path key={`l${i}`} d={l.d} {...cut(c.detail * (l.op ?? 0.9), color.ink, l.w, l.dash)} />
      ))}
      {rightCol.map((l, i) => (
        <path key={`r${i}`} d={l.d} {...cut(c.detail * (l.op ?? 0.9), color.ink, l.w, l.dash)} />
      ))}

      {/* Red seal: crisp in Gen 0, blurred & ghosted in later generations */}
      {gen === 0 && (
        <g transform={`translate(${x1 - m - 18} ${y1 - m - 18})`}>
          <circle cx={0} cy={0} r={10} {...ink(c.accent, color.red, 0.92)} />
          <circle cx={0} cy={0} r={10} {...cut(c.accent, color.red, INNER)} />
          <circle cx={0} cy={0} r={7} {...cut(c.accent, color.paper, DETAIL)} />
          <path d="M-4 0 H4 M0 -4 V4" {...cut(c.accent, color.paper, DETAIL)} />
        </g>
      )}
      {gen === 1 && (
        <g transform={`translate(${x1 - m - 18} ${y1 - m - 18})`}>
          <circle cx={0} cy={0} r={9.5} {...ink(c.accent, color.red, 0.75)} />
          <circle cx={0} cy={0} r={9.5} {...cut(c.accent * 0.85, color.red, INNER * 0.9)} />
          <circle cx={0} cy={0} r={6.5} {...cut(c.accent * 0.8, color.paper, DETAIL * 0.8)} />
        </g>
      )}
      {gen === 2 && (
        <g transform={`translate(${x1 - m - 18} ${y1 - m - 18})`}>
          <ellipse cx={0} cy={0} rx={9} ry={8.5} {...ink(c.accent, color.red, 0.5)} />
          <circle cx={0} cy={0} r={8.5} {...cut(c.accent * 0.6, color.red, DETAIL, '6 3')} />
        </g>
      )}
      {gen === 3 && (
        <g transform={`translate(${x1 - m - 18} ${y1 - m - 18})`}>
          <ellipse cx={0} cy={0} rx={8} ry={7} {...ink(c.accent, color.red, 0.3)} />
          <path d="M-6 -2 Q0 -6 6 -2 Q4 5 -4 5 Z" {...cut(c.accent * 0.35, color.red, DETAIL * 0.8, '2 3')} />
        </g>
      )}

      {/* Shading & Generational noise tooth */}
      <Hatch clip={clipId} p={c.shade} angle={42} gap={gen === 0 ? 9 : 8} op={0.22} box={[x0, y0, SW, SH]} />
      <Hatch clip={clipId} p={c.shade} angle={42} gap={4.5} op={0.28} box={[x0 + SW * 0.4, y0 + SH * 0.4, SW * 0.6, SH * 0.6]} />
      <Stipple
        clip={clipId}
        p={c.detail}
        n={gen === 0 ? 50 : gen === 1 ? 110 : gen === 2 ? 220 : 380}
        seed={gen * 37 + 11}
        r={0.8 + gen * 0.2}
        op={0.16 + gen * 0.08}
        box={[x0, y0, SW, SH]}
      />
    </g>
  );
};

export const CopyStack: React.FC<{
  w: number;
  h: number;
  size?: number;
  at?: string | number;
  dropAt?: string | number;
  label?: string;
  labelAt?: string | number;
  plate?: string;
}> = ({ w, h, size, at, dropAt = 'again', label, labelAt, plate }) => {
  const ids = useIds(6);
  const frame = useCurrentFrame();
  const dropFrame = useCue(dropAt, 60);
  const dropProgress = interpolate(frame - dropFrame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
      {(c) => {
        const t = ss(0, 1, dropProgress);

        const sheets: SheetSpec[] = [
          { gen: 0, cx: 125, cy: 155, rot: -8 },
          { gen: 1, cx: 165, cy: 180, rot: -3 },
          { gen: 2, cx: 215, cy: 205, rot: 3 },
          { gen: 3, cx: 265, cy: 232, rot: 8 },
        ];

        return (
          <g style={breathe(c.frame, 1.0, 210)}>
            {/* Base table cast shadow under the cascade */}
            <ellipse cx={205} cy={348} rx={148} ry={14} {...ink(c.shade, color.stageDeep, 0.98)} />
            <ellipse cx={220} cy={346} rx={120} ry={9} {...ink(c.shade, color.stageDeep, 0.8)} />

            {/* Cascading copies: gen 0 at the bottom, gen 3 on top */}
            {sheets.map((s, idx) => (
              <Sheet
                key={s.gen}
                spec={s}
                c={c}
                clipId={ids[idx]}
                isTop={idx === 3}
                slideProgress={t}
              />
            ))}
          </g>
        );
      }}
    </Plate>
  );
};
