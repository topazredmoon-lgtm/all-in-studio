/**
 * **PaperRiver** — "To learn anything, a model has to eat the internet. Every page, every post, every review."
 *
 * A torrent of printed sheets pours into the iron mouth of a machine. Sixty sheets are generated in a loop from a
 * seeded generator (own size, tilt, tumble period and fall speed, ruled with engraved lines of type), sorted by depth
 * and funnelled toward the throat as they fall; they foreshorten as they tip over the lip and are swallowed behind the
 * front wall. The hopper is the heavy form: contour, ribs, rivets, a tight hatch in the throat where the dark is, and
 * a loose pass over the iron. The red is the lip of the maw.
 *
 * Motion: the river runs (position = seeded phase + frames x speed, recycled), and the crank wheel and pinion turn.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const rng = (seed: number) => { let s = seed * 9301 + 49297; for (let i = 0; i < 4; i++) s = (s * 9301 + 49297) % 233280; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };

type Sheet = { z: number; x: number; ph: number; v: number; tilt: number; per: number; rows: number[]; head: number; fold: number };
const SHEETS: Sheet[] = (() => {
  const r = rng(7);
  const out: Sheet[] = [];
  for (let i = 0; i < 60; i++) {
    const z = r();
    const rows = Array.from({ length: 9 }, () => 0.45 + r() * 0.55);
    out.push({ z, x: r(), ph: r(), v: 0.9 + z * 1.0 + r() * 0.35, tilt: r(), per: 22 + r() * 30, rows, head: 0.3 + r() * 0.3, fold: 4 + r() * 3 });
  }
  return out.sort((a, b) => a.z - b.z);
})();

const L = 300;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const gear = (cx: number, cy: number, r: number, n: number, rot: number) => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = rot + (i / n) * Math.PI * 2, st = (Math.PI * 2) / n;
    const q = [[0, r * 0.86], [0.18, r], [0.46, r], [0.64, r * 0.86]];
    q.forEach(([f, rr]) => pts.push(`${(cx + Math.cos(a0 + f * st) * rr).toFixed(1)} ${(cy + Math.sin(a0 + f * st) * rr).toFixed(1)}`));
  }
  return 'M' + pts.join(' L') + ' Z';
};

export const PaperRiver: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [mouth, wall, body] = useIds(3);
    const throat = 'M42 252 A158 17 0 1 1 358 252 A158 17 0 1 1 42 252 Z';
    const front = 'M42 252 A158 17 0 0 0 358 252 L270 352 L130 352 Z';
    const block = 'M110 352 H290 V382 H110 Z';
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const since = Math.max(0, c.since);
          const spin = since * 0.035;
          const ribs: string[] = [];
          for (let i = 0; i <= 12; i++) {
            const f = i / 12;
            const x0 = 42 + f * 316, x1 = 130 + f * 140;
            const y0 = 252 + 17 * Math.sqrt(Math.max(0, 1 - Math.pow((x0 - 200) / 158, 2)));
            ribs.push(`M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} 352`);
          }
          const rivets: React.ReactNode[] = [];
          for (let i = 1; i < 14; i++) {
            const a = (i / 14) * Math.PI;
            const x = 200 - Math.cos(a) * 146, y = 252 + Math.sin(a) * 14.5 + 6;
            rivets.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={2.2} {...cut(c.detail, color.ink, DETAIL)} />);
          }
          return (
            <g style={breathe(c.frame, 1, 170)}>
              <Clip id={mouth} d={throat} />
              <Clip id={wall} d={front} />
              <Clip id={body} d={block} />
              <ellipse cx={200} cy={384} rx={165} ry={7} {...ink(c.shade, color.stageDeep, 1)} />

              {/* the throat: the dark of the machine, a tight hatch laid nearly along the rim */}
              <path d={throat} {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={mouth} p={c.shade} angle={-6} gap={3.4} op={0.5} box={[40, 232, 320, 40]} />
              <Hatch clip={mouth} p={c.shade} angle={56} gap={6} cross op={0.2} box={[40, 232, 320, 40]} />

              {/* the river: back to front */}
              {SHEETS.map((s, i) => {
                const yy = -34 + ((s.ph * L + since * s.v) % L);
                const fun = 1 - 0.3 * clamp((yy + 34) / 300);
                const x = 200 + (s.x - 0.5) * 310 * fun;
                const rot = s.tilt * 130 - 65 + 20 * Math.sin(since / s.per + s.ph * 9);
                const sc = 0.62 + 0.62 * s.z;
                const sy = 1 - 0.55 * clamp((yy - 196) / 56);
                const op = clamp((yy + 8) / 42) * (0.55 + 0.45 * s.z);
                const hw = 17, hh = 23, f = s.fold;
                const rules: string[] = [];
                rules.push(`M${-hw + 5} ${-hh + 7} L${-hw + 5 + 2 * hw * s.head} ${-hh + 7}`);
                for (let k = 0; k < 7; k++) {
                  const y = -hh + 14 + k * 4.4;
                  rules.push(`M${-hw + 5} ${y.toFixed(1)} L${(-hw + 5 + (2 * hw - 10) * s.rows[k]).toFixed(1)} ${y.toFixed(1)}`);
                }
                const shade: string[] = [];
                for (let j = 1; j <= 5; j++) shade.push(`M${hw - j * 3.6} ${hh} L${hw} ${hh - j * 3.6}`);
                const near = s.z > 0.6;
                return (
                  <g key={i} opacity={op} transform={`translate(${x.toFixed(1)} ${yy.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc.toFixed(2)} ${(sc * sy).toFixed(2)})`}>
                    <path d={`M${-hw} ${-hh} L${hw - f} ${-hh} L${hw} ${-hh + f} L${hw} ${hh} L${-hw} ${hh} Z`} {...cut(c.contour, color.ink, near ? INNER : DETAIL * 1.3)} fill={color.stageDeep} />
                    <path d={`M${hw - f} ${-hh} L${hw - f} ${-hh + f} L${hw} ${-hh + f}`} {...cut(c.inner, color.ink, DETAIL)} />
                    <path d={rules.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.75} />
                    <path d={shade.join(' ')} {...cut(c.shade, color.ink, DETAIL * 0.8)} opacity={0.6} />
                  </g>
                );
              })}

              {/* front wall of the hopper: forged iron, ribbed, hatched on the lower right */}
              <path d={front} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={ribs.join(' ')} {...cut(c.inner, color.ink, DETAIL * 1.3)} opacity={0.8} />
              <Hatch clip={wall} p={c.shade} angle={64} gap={4} op={0.5} box={[170, 250, 200, 110]} />
              <Hatch clip={wall} p={c.shade} angle={64} gap={9} op={0.26} box={[40, 250, 330, 110]} />
              <Hatch clip={wall} p={c.detail} angle={-30} gap={7} op={0.2} cross box={[230, 280, 110, 74]} />
              <Stipple clip={wall} p={c.detail} n={260} seed={4} r={0.9} op={0.24} />
              <path d={front} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M54 252 A146 14 0 0 0 346 252" {...cut(c.inner, color.ink, INNER)} />
              <path d="M47 262 L134 346 M353 262 L266 346" {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              {rivets}
              <path d="M62 252.5 A138 12 0 0 0 338 252.5" {...cut(c.accent, color.red, INNER * 1.25)} />

              {/* the machine under the hopper */}
              <path d={block} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={block} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M118 360 H282 M118 374 H282" {...cut(c.inner, color.ink, DETAIL)} opacity={0.7} />
              <Hatch clip={body} p={c.shade} angle={50} gap={5} op={0.34} box={[110, 352, 180, 30]} />
              <Stipple clip={body} p={c.detail} n={90} seed={8} r={0.9} op={0.25} />
              {[122, 150, 250, 278].map((x, i) => <circle key={i} cx={x} cy={367} r={2.4} {...cut(c.detail, color.ink, DETAIL)} />)}
              {/* flywheel + pinion */}
              <path d="M290 366 H306" {...cut(c.inner, color.ink, INNER)} />
              <path d={gear(330, 360, 26, 16, spin)} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={gear(330, 360, 26, 16, spin)} {...cut(c.contour, color.ink, INNER)} />
              <circle cx={330} cy={360} r={14} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <circle cx={330} cy={360} r={4.5} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <path d={[0, 1, 2, 3, 4, 5].map((k) => { const a = spin + (k * Math.PI) / 3; return `M${(330 + Math.cos(a) * 5).toFixed(1)} ${(360 + Math.sin(a) * 5).toFixed(1)} L${(330 + Math.cos(a) * 14).toFixed(1)} ${(360 + Math.sin(a) * 14).toFixed(1)}`; }).join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
              <path d={gear(86, 366, 13, 10, -spin * 1.6)} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <circle cx={86} cy={366} r={3.4} {...cut(c.inner, color.ink, DETAIL)} />
            </g>
          );
        }}
      </Plate>
    );
  };
