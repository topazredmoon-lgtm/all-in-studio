/**
 * **CastOfACast** — three busts on plinths: the marble original, a plaster cast of it, a cast of the cast.
 *
 * All three are ONE bust geometry (silhouette, features, hair, drapery) put through `soften(n)`, n = 0 (cut marble),
 * 1 (plaster) and 2 (cast of the cast). `soften` does three real things: it interpolates the silhouette toward an
 * egg-shaped blob; it drops feature strokes one by one as `n` passes each stroke's `lose` threshold; and it thickens
 * and blurs the contour while trading hatching for stipple. The plaster gets a mould seam. Over the shot the copies
 * degrade live: the middle bust walks from 0 → 1, the right one from 0 → 2.
 * Red: the original's drilled eyes — the one sharp detail every later copy has lost.
 */
import React from 'react';
import { CONTOUR, Clip, Cut, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const f1 = (n: number) => n.toFixed(1);

/** Interpolate two path strings that share the same command structure. */
const NUM = /-?\d+(?:\.\d+)?/g;
const lerpPath = (a: string, b: string, k: number) => {
  const nb = b.match(NUM)!.map(Number);
  let i = 0;
  return a.replace(NUM, (m) => f1(Number(m) + (nb[i++] - Number(m)) * k));
};

const HEAD0 = 'M0 -62 C28 -62 40 -42 38 -14 C37 6 30 26 18 40 C12 47 -12 47 -18 40 C-30 26 -37 6 -38 -14 C-40 -42 -28 -62 0 -62 Z';
const HEAD2 = 'M0 -66 C34 -66 48 -42 46 -8 C45 18 34 38 22 46 C12 52 -12 52 -22 46 C-34 38 -45 18 -46 -8 C-48 -42 -34 -66 0 -66 Z';
const CHEST0 = 'M-18 62 C-40 68 -64 78 -72 100 L-74 132 L74 132 L72 100 C64 78 40 68 18 62 Z';
const CHEST2 = 'M-24 58 C-50 62 -78 76 -82 104 L-84 134 L84 134 L82 104 C78 76 50 62 24 58 Z';

type Feat = { d: string; w: number; lose: number; op?: number; dash?: string };
/** every feature stroke of the bust, each with the soften level at which it is lost */
const hairCurls = Array.from({ length: 9 }, (_, i) => {
  const x = -34 + i * 8.5, y = -38 + Math.abs(x) * 0.2;
  return `M${f1(x)} ${f1(y)} q${f1(3)} -9 ${f1(9)} -4 q${f1(-2)} 6 ${f1(-6)} 5`;
}).join(' ');
const hairStrands = Array.from({ length: 11 }, (_, i) => {
  const x = -30 + i * 6;
  return `M${f1(x * 0.3)} -63 Q${f1(x * 0.9)} -52 ${f1(x)} ${f1(-40 + Math.abs(x) * 0.2)}`;
}).join(' ');
const FEATS: Feat[] = [
  { d: hairCurls, w: INNER * 0.8, lose: 0.55 },
  { d: hairStrands, w: DETAIL, lose: 0.35 },
  { d: 'M-27 -13 Q-15 -23 -4 -15 M27 -13 Q15 -23 4 -15', w: INNER * 1.15, lose: 1.25 },
  { d: 'M-25 -7 Q-15 -14 -5 -7 Q-15 -2 -25 -7 Z M25 -7 Q15 -14 5 -7 Q15 -2 25 -7 Z', w: INNER * 0.9, lose: 0.85 },
  { d: 'M-24 -9 Q-15 -17 -6 -10 M24 -9 Q15 -17 6 -10', w: DETAIL, lose: 0.7 },
  { d: 'M0 -12 L-3 14 Q-8 19 -2 20 M0 -12 L3 14 Q8 19 2 20 M-6 19 Q0 22 6 19', w: INNER, lose: 1.45 },
  { d: 'M-12 29 Q0 25 12 29 Q0 34 -12 29 M-12 29 L12 29', w: INNER * 0.9, lose: 1.3 },
  { d: 'M0 38 L0 42 M-30 -2 Q-30 14 -20 30 M30 -2 Q30 14 20 30', w: DETAIL, lose: 0.6 },
  { d: 'M-38 -8 Q-47 -6 -45 6 Q-43 14 -37 12 M38 -8 Q47 -6 45 6 Q43 14 37 12', w: INNER * 0.8, lose: 0.9 },
  { d: 'M-13 46 Q-9 60 -3 68 M13 46 Q9 60 3 68', w: DETAIL * 1.1, lose: 0.75 },
  { d: 'M-8 -30 Q0 -34 8 -30 M-6 -26 Q0 -29 6 -26', w: DETAIL, lose: 0.6 },
  { d: 'M-55 98 Q-30 84 -6 98 Q-24 110 -50 118 M55 98 Q30 84 6 98 Q24 110 50 118', w: INNER * 0.8, lose: 1.1 },
  { d: 'M-40 110 L-34 130 M-24 104 L-20 130 M22 104 L19 130 M40 110 L34 130 M-8 100 L-6 130 M8 100 L6 130', w: DETAIL, lose: 0.8 },
];

const Bust: React.FC<{ cx: number; n: number; c: Cut; ids: [string, string]; first?: boolean }> = ({ cx, n, c, ids, first }) => {
  const k = clamp(n / 2);
  const head = lerpPath(HEAD0, HEAD2, k * 0.95);
  const chest = lerpPath(CHEST0, CHEST2, k);
  const cw = CONTOUR * (1 + 0.55 * n);
  const sharp = 1 - k;
  return (
    <g transform={`translate(${cx} 134) scale(0.72)`}>
      <Clip id={ids[0]}><path d={head} /><path d={chest} /></Clip>
      {/* soft ghost contours: blur is the loss of the edge */}
      {n > 0.15 && <path d={head} {...cut(c.contour, color.ink, cw * 2.6)} opacity={0.1 * clamp(n)} />}
      {n > 0.15 && <path d={chest} {...cut(c.contour, color.ink, cw * 2.6)} opacity={0.1 * clamp(n)} />}
      <path d={chest} {...ink(c.shade, color.stageDeep, 0.9)} />
      <path d={head} {...ink(c.shade, color.stageDeep, 0.95)} />
      <path d="M-17 40 L-18 66 M17 40 L18 66" {...cut(c.inner * (1 - ss(1.2, 1.7, n)), color.ink, INNER)} />
      <path d={chest} {...cut(c.contour, color.ink, cw)} />
      <path d={head} {...cut(c.contour, color.ink, cw)} />
      {FEATS.map((f, i) => {
        const a = clamp(1 - (n - f.lose) * 2.6);
        if (a <= 0.02) return null;
        const stage = f.w >= INNER * 0.9 ? c.inner : c.detail;
        return <path key={i} d={f.d} {...cut(stage * a, color.ink, f.w * (1 + 0.5 * n))} opacity={0.5 + 0.5 * a} />;
      })}
      {/* the drilled irises: sharp, red, only in the original */}
      {first && <g>
        <circle cx={-15} cy={-8} r={4.4} {...ink(c.accent, color.red)} />
        <circle cx={15} cy={-8} r={4.4} {...ink(c.accent, color.red)} />
        <path d="M-18 -11 q3 -3 6 0 M12 -11 q3 -3 6 0" {...cut(c.accent, color.red, DETAIL * 1.2)} />
      </g>}
      {!first && n < 1.1 && <g opacity={1 - ss(0.5, 1.1, n)}>
        <circle cx={-15} cy={-8} r={3.6} {...cut(c.detail, color.ink, DETAIL)} />
        <circle cx={15} cy={-8} r={3.6} {...cut(c.detail, color.ink, DETAIL)} />
      </g>}
      {/* mould seam of the plaster: a ridge down the side of the head and across the chest, then it blurs away */}
      {n > 0.3 && <path d="M3 -63 C7 -34 6 6 2 46 M2 46 L1 62" {...cut(clamp(n * 2) * (1 - 0.6 * ss(1.4, 2, n)), color.ink, DETAIL * 1.1, '5 3')} opacity={0.9} />}
      {n > 0.3 && <path d="M5 -63 C9 -34 8 6 4 46" {...cut(clamp(n * 2), color.ink, DETAIL * 0.7)} opacity={0.5 * (1 - ss(1.2, 2, n))} />}
      {/* shading: tight pass on the right and under the chin, loose pass over the form; softer casts trade lines for tooth */}
      <Hatch clip={ids[0]} p={c.shade} angle={56} gap={5 + 3.5 * n} op={0.34 * (1 - 0.5 * k)} box={[2, -66, 90, 200]} />
      <Hatch clip={ids[0]} p={c.shade} angle={56} gap={11 + 3 * n} op={0.16} box={[-86, -66, 172, 200]} />
      <Hatch clip={ids[0]} p={c.detail} angle={-20} gap={7} op={0.2 * sharp} cross box={[-80, 44, 160, 90]} />
      <Stipple clip={ids[0]} p={c.detail} n={Math.round(120 + 330 * k + 60 * n)} seed={cx} r={0.9 + 0.3 * n} op={0.18 + 0.12 * k} box={[-86, -66, 172, 200]} />
    </g>
  );
};

const Plinth: React.FC<{ cx: number; c: Cut; clip: string }> = ({ cx, c, clip }) => {
  const shaft = `M${cx - 40} 254 L${cx + 40} 254 L${cx + 40} 330 L${cx - 40} 330 Z`;
  const cap = `M${cx - 52} 238 L${cx + 52} 238 L${cx + 52} 246 L${cx + 46} 254 L${cx - 46} 254 L${cx - 52} 246 Z`;
  const base = `M${cx - 48} 330 L${cx + 48} 330 L${cx + 52} 340 L${cx + 54} 350 L${cx - 54} 350 L${cx - 52} 340 Z`;
  const flutes = Array.from({ length: 6 }, (_, i) => `M${cx - 30 + i * 12} 258 V326`).join(' ');
  return (
    <g>
      <Clip id={clip}><path d={shaft} /><path d={cap} /><path d={base} /></Clip>
      <ellipse cx={cx + 6} cy={354} rx={64} ry={7} {...ink(c.shade, color.stageDeep, 0.95)} />
      <path d={shaft} {...ink(c.shade, color.stageDeep, 0.9)} />
      <path d={cap} {...ink(c.shade, color.stageDeep, 0.9)} />
      <path d={base} {...ink(c.shade, color.stageDeep, 0.9)} />
      <path d={cap} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
      <path d={shaft} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
      <path d={base} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
      <path d={`M${cx - 52} 246 H${cx + 52} M${cx - 46} 254 H${cx + 46} M${cx - 48} 330 H${cx + 48} M${cx - 51} 338 H${cx + 51}`} {...cut(c.inner, color.ink, INNER * 0.8)} />
      <path d={flutes} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
      <Hatch clip={clip} p={c.shade} angle={62} gap={4} op={0.34} box={[cx, 238, 56, 116]} />
      <Hatch clip={clip} p={c.shade} angle={62} gap={8} op={0.2} box={[cx - 56, 238, 112, 116]} />
      <Hatch clip={clip} p={c.detail} angle={-28} gap={9} op={0.16} cross box={[cx - 56, 300, 112, 54]} />
      <Stipple clip={clip} p={c.detail} n={160} seed={cx + 3} r={0.8} op={0.2} box={[cx - 56, 238, 112, 116]} />
    </g>
  );
};

export const CastOfACast: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const ids = useIds(9);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = ss(0, 1, c.at(30, 110));
          const xs = [70, 200, 330];
          const ns = [0, 1.0 * t, 2.0 * t];
          return (
            <g style={breathe(c.frame, 1.0, 210)}>
              {xs.map((x, i) => <Plinth key={`p${i}`} cx={x} c={c} clip={ids[6 + i]} />)}
              {xs.map((x, i) => <Bust key={i} cx={x} n={ns[i]} c={c} ids={[ids[i * 2], ids[i * 2 + 1]]} first={i === 0} />)}
            </g>
          );
        }}
      </Plate>
    );
  };
