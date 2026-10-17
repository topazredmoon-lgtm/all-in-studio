/**
 * **Meadow** — the paper's actual mechanism (the tails of the distribution go first), drawn as a place, not a chart.
 *
 * The hillside *is* a bell curve: its profile is a gaussian, so the fat middle is a tall mound and the two tails are
 * flat thin ground. On the mound: a real thicket (a few hundred seeded blades, every one the same grass). Out on the
 * tails: eight rare things, each individually cut — foxglove, dandelion clock, thistle, poppy, teasel, harebells —
 * with their own leaves. Over the shot the outermost go first: stems bow, heads droop, petals fall, the stem
 * unwinds from the tip and the plant is gone. What is left is the uniform middle.
 * Red: the last rare flower to go (the poppy on the left tail).
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const f1 = (n: number) => n.toFixed(1);

const SIG = 56, BASE = 338, H = 150;
const yAt = (x: number) => BASE - H * Math.exp(-0.5 * ((x - 200) / SIG) ** 2) - (x - 200) * 0.0; // the hill IS the curve
const profile = (x0 = 16, x1 = 384, n = 92) => {
  let d = '';
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n; d += `${i ? 'L' : 'M'}${f1(x)} ${f1(yAt(x))} `; }
  return d;
};

// ---- the rare things: heads drawn upright with the stem top at 0,0 -------------------------------------------------
const Head: React.FC<{ kind: number; p: number; col: string }> = ({ kind, p, col }) => {
  const fill = (d: string) => <path d={d} {...ink(p, color.stageDeep, 0.95)} />;
  const line = (d: string, w = INNER) => <path d={d} {...cut(p, col, w)} />;
  switch (kind) {
    case 0: { // thistle: scaly bulb, then a brush of florets
      const bulb = 'M-10 0 C-13 -9 -7 -17 0 -18 C7 -17 13 -9 10 0 Z';
      const tuft = Array.from({ length: 13 }, (_, i) => { const a = (-76 + i * 12.7) * Math.PI / 180, r = 15 + (i % 2) * 5; return `M${f1(Math.sin(a) * 3)} -17 L${f1(Math.sin(a) * r)} ${f1(-17 - Math.cos(a) * r)}`; }).join(' ');
      const tufts2 = Array.from({ length: 13 }, (_, i) => { const a = (-76 + i * 12.7) * Math.PI / 180, r = 15 + (i % 2) * 5; return `M${f1(Math.sin(a) * r)} ${f1(-17 - Math.cos(a) * r)} l${f1(Math.sin(a) * 4)} ${f1(-Math.cos(a) * 4)}`; }).join(' ');
      return <g>{fill(bulb)}{line(tuft, DETAIL * 1.1)}{line(tufts2, INNER * 0.8)}{line(bulb, INNER)}
        {line('M-9 -4 L0 -16 L9 -4 M-9 -10 L0 -1 L9 -10 M-5 -15 L-9 -4 M5 -15 L9 -4 M-5 -1 L-9 -10 M5 -1 L9 -10', DETAIL)}
        {line('M-12 0 q-6 -4 -10 -10 M12 0 q6 -4 10 -10', INNER * 0.8)}</g>;
    }
    case 1: { // teasel
      const o = 'M-6 0 C-9 -13 -6 -29 0 -37 C6 -29 9 -13 6 0 Z';
      const rows = Array.from({ length: 8 }, (_, i) => `M${f1(-6 + Math.abs(i - 3.5) * 0.4)} ${-3 - i * 4.2} q6 3 ${f1(12 - Math.abs(i - 3.5) * 0.8)} 0`).join(' ');
      const spikes = Array.from({ length: 9 }, (_, i) => `M${f1(-4 + (i % 3) * 4)} ${-5 - i * 3.5} l${i % 2 ? 2 : -2} -3`).join(' ');
      return <g>{fill(o)}{line(rows, DETAIL)}{line(spikes, DETAIL * 0.8)}{line(o, INNER * 1.1)}
        {line('M-6 3 C-22 -4 -23 -22 -13 -36 M6 3 C22 -4 23 -22 13 -36', INNER)}{line('M0 -37 L0 -46', DETAIL * 1.4)}
        <path d={`M3 -2 L6 -10 L5 -26 L2 -34`} {...cut(p, color.ink, DETAIL * 0.7)} opacity={0.5} /></g>;
    }
    case 2: { // harebells: three nodding bells on thread stems
      const bell = (x: number, y: number, r: number, s: number) => {
        const d = 'M0 0 C-6 2 -8 10 -11 16 C-6 19 6 19 11 16 C8 10 6 2 0 0 Z';
        return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>{fill(d)}{line(d, INNER)}{line('M-4 3 L-6 16 M0 2 L0 18 M4 3 L6 16', DETAIL)}{line('M-11 16 q3 3 5 1 q3 3 6 0 q3 3 5 -1 q3 2 6 0', DETAIL)}</g>;
      };
      return <g>{line('M0 0 Q-2 -14 -10 -22 M0 0 Q4 -10 12 -14 M0 0 L1 -8', DETAIL * 1.3)}{bell(-10, -22, 18, 0.9)}{bell(12, -14, -22, 0.8)}{bell(1, -8, 4, 0.75)}</g>;
    }
    case 3: { // dandelion clock: a globe of seeds, each with a tiny parachute
      const rays = Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * 6.283; return [Math.cos(a), Math.sin(a)]; });
      const shaft = rays.map(([x, y]) => `M${f1(x * 3)} ${f1(-17 + y * 3)} L${f1(x * 12.5)} ${f1(-17 + y * 12.5)}`).join(' ');
      const fans = rays.map(([x, y]) => `M${f1(x * 12.5)} ${f1(-17 + y * 12.5)} l${f1(x * 3 - y * 2.5)} ${f1(y * 3 + x * 2.5)} M${f1(x * 12.5)} ${f1(-17 + y * 12.5)} l${f1(x * 4.2)} ${f1(y * 4.2)} M${f1(x * 12.5)} ${f1(-17 + y * 12.5)} l${f1(x * 3 + y * 2.5)} ${f1(y * 3 - x * 2.5)}`).join(' ');
      return <g>{line(shaft, DETAIL)}{line(fans, DETAIL * 0.8)}<ellipse cx={0} cy={-2} rx={3.4} ry={2.4} {...cut(p, col, INNER)} /><circle cx={0} cy={-17} r={3.2} {...cut(p, col, INNER)} /></g>;
    }
    case 4: { // poppy
      const L = 'M0 0 C-18 0 -24 -18 -11 -27 C-4 -22 -2 -10 0 0 Z', R = 'M0 0 C18 0 24 -18 11 -27 C4 -22 2 -10 0 0 Z', B = 'M0 0 C-9 -9 -9 -24 0 -30 C9 -24 9 -9 0 0 Z';
      return <g>{fill(B)}{line(B, INNER)}{line('M0 -4 L0 -26 M-3 -6 L-4 -22 M3 -6 L4 -22', DETAIL * 0.9)}
        {fill(L)}{fill(R)}{line(L, INNER * 1.2)}{line(R, INNER * 1.2)}
        {line('M-4 -2 C-12 -6 -15 -14 -10 -22 M-6 -2 C-15 -4 -19 -12 -14 -22 M4 -2 C12 -6 15 -14 10 -22 M6 -2 C15 -4 19 -12 14 -22', DETAIL)}
        <ellipse cx={0} cy={-8} rx={4} ry={3} {...ink(p, col)} />
        {line('M-8 -9 l-3 -2 M8 -9 l3 -2 M-6 -13 l-2 -3 M6 -13 l2 -3 M0 -14 l0 -4', DETAIL)}</g>;
    }
    default: { // foxglove spike
      const bells = Array.from({ length: 9 }, (_, i) => {
        const side = i % 2 ? 1 : -1, s = 1 - i * 0.085, y = -3 - i * 6.4;
        const d = 'M0 0 C6 -2 12 3 13 11 C8 13 2 11 0 6 Z';
        return <g key={i} transform={`translate(${side * 1} ${y}) scale(${side * s} ${s})`}>{fill(d)}{line(d, INNER * 0.85)}{line('M3 1 L8 9 M6 0 L11 8', DETAIL * 0.8)}</g>;
      });
      return <g>{line('M0 0 L0 -56', INNER)}{bells}<circle cx={0} cy={-58} r={1.8} {...ink(p, col)} /><circle cx={1.5} cy={-62} r={1.2} {...ink(p, col)} /></g>;
    }
  }
};

type Rare = { x: number; kind: number; h: number; w0: number; ph: number; leaf: number };
const RARE: Rare[] = [
  { x: 32, kind: 5, h: 70, w0: 0.0, ph: 0.2, leaf: 1 },
  { x: 58, kind: 3, h: 96, w0: 0.1, ph: 1.4, leaf: -1 },
  { x: 84, kind: 0, h: 84, w0: 0.26, ph: 2.1, leaf: 1 },
  { x: 104, kind: 4, h: 62, w0: 0.58, ph: 0.9, leaf: -1 }, // the last one standing: red
  { x: 294, kind: 2, h: 72, w0: 0.22, ph: 3.0, leaf: 1 },
  { x: 318, kind: 1, h: 90, w0: 0.08, ph: 0.6, leaf: -1 },
  { x: 342, kind: 3, h: 78, w0: 0.3, ph: 4.1, leaf: 1 },
  { x: 368, kind: 0, h: 98, w0: 0.0, ph: 5.2, leaf: -1 },
];
const LAST = 3;

export const Meadow: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [hill] = useIds(1);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(30, 170);
          const body = `${profile()} L384 366 L16 366 Z`;

          // ---- the thicket: identical blades, thick in the middle ------------------------------------------
          const rb = rng(1066);
          const gauss = () => (rb() + rb() + rb() + rb() - 2) * 1.5;
          const blades: React.ReactNode[] = [];
          for (let i = 0; i < 460; i++) {
            const mid = i < 410;
            const x = mid ? 200 + gauss() * SIG * 0.95 : 24 + rb() * 352;
            if (x < 20 || x > 380) { rb(); rb(); rb(); continue; }
            const depth = mid ? rb() * Math.max(0, BASE - yAt(x) - 8) : rb() * 6;
            const ry = yAt(x) + depth;
            if (ry > 352) { rb(); rb(); continue; }
            const bh = (mid ? 17 : 14) + rb() * 8, lean = (rb() - 0.5) * 10, ph = rb() * 6.28, r2 = rb();
            const sway = Math.sin(c.frame / 34 + ph + x * 0.03) * 2.2;
            const tx = x + lean + sway, ty = ry - bh;
            const p = clamp(c.inner * 1.5 - (i / 460) * 0.5);
            const wgt = r2 < 0.18 ? INNER * 0.85 : DETAIL;
            blades.push(
              <path key={i} d={`M${f1(x)} ${f1(ry)} Q${f1(x + lean * 0.2)} ${f1(ry - bh * 0.6)} ${f1(tx)} ${f1(ty)}`} {...cut(p, color.ink, wgt)} opacity={mid ? 0.95 : 0.75} />,
            );
            if (mid && r2 > 0.9) blades.push(<ellipse key={`e${i}`} cx={f1(tx)} cy={f1(ty - 3)} rx={1.6} ry={4} transform={`rotate(${f1(lean * 3)} ${f1(tx)} ${f1(ty)})`} {...cut(p, color.ink, DETAIL)} />);
          }

          // ---- hill contours, like the isolines of a map ----------------------------------------------------
          const iso = [10, 22, 36, 52].map((dd, k) => {
            let d = '';
            for (let i = 0; i <= 60; i++) { const x = 20 + (360 * i) / 60; d += `${i ? 'L' : 'M'}${f1(x)} ${f1(Math.min(yAt(x) + dd + k * 1.5, 360))} `; }
            return <path key={k} d={d} {...cut(c.inner, color.ink, DETAIL)} opacity={0.35} />;
          });

          // ---- the rare ones --------------------------------------------------------------------------------
          const rareEls = RARE.map((f, i) => {
            const w0 = clamp((t - f.w0 * 0.9) / 0.3);
            const wl = ss(0, 1, w0);
            const side = f.x < 200 ? -1 : 1;
            const gy = yAt(f.x);
            const sway = Math.sin(c.frame / 40 + f.ph) * 2.6 * (1 - wl);
            const tx = f.x + side * wl * f.h * 0.5 + sway;
            const ty = gy - f.h * (1 - 0.5 * wl);
            const col = i === LAST ? color.red : color.ink;
            const gone = ss(0.72, 1, wl);
            const p = (i === LAST ? c.accent : 1) * clamp(c.inner * 1.3);
            const stemP = p * (1 - gone);
            const headSc = 1 - ss(0.65, 1, wl);
            const ang = side * wl * 100 + sway * 2;
            // leaves at the root
            const lf = f.leaf;
            const leaves = `M${f.x} ${f1(gy)} q${lf * -6} -14 ${lf * -22} -16 M${f.x} ${f1(gy)} q${lf * 5} -12 ${lf * 20} -10 M${f.x} ${f1(gy)} q${lf * -2} -18 ${lf * 4} -26`;
            const petals = [0, 1, 2, 3].map((k) => {
              const fall = clamp((wl - 0.18 - k * 0.1) / 0.5);
              if (fall <= 0 || fall >= 1) return null;
              const px = tx + side * (8 + k * 5) * fall + Math.sin(k * 2 + fall * 5) * 5, py = ty + (gy - ty) * Math.pow(fall, 1.6);
              return <ellipse key={k} cx={f1(px)} cy={f1(py)} rx={3.4} ry={1.7} transform={`rotate(${f1(fall * 260 + k * 40)} ${f1(px)} ${f1(py)})`} {...cut(1 - ss(0.8, 1, fall), col, DETAIL * 1.2)} />;
            });
            return (
              <g key={i}>
                <path d={leaves} {...cut(p * (1 - gone), col, INNER * 0.85)} />
                <path d={`M${f.x} ${f1(gy)} Q${f1(f.x + side * wl * 8 + sway * 0.4)} ${f1(gy - f.h * 0.6)} ${f1(tx)} ${f1(ty)}`} {...cut(stemP, col, INNER * 1.15)} />
                <g transform={`translate(${f1(tx)} ${f1(ty)}) rotate(${f1(ang)}) scale(${(headSc * 1.3).toFixed(3)})`} opacity={1}>
                  <Head kind={f.kind} p={c.detail * (1 - gone)} col={col} />
                </g>
                {petals}
              </g>
            );
          });

          return (
            <g style={breathe(c.frame, 0.9, 210)}>
              <Clip id={hill} d={body} />
              {/* cast shadow thrown by the whole hill */}
              <ellipse cx={206} cy={364} rx={176} ry={11} {...ink(c.shade, color.stageDeep, 0.95)} />
              <path d={body} {...ink(c.shade, color.stageDeep, 0.95)} />
              {iso}
              {blades}
              <path d={profile()} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              {rareEls}
              {/* earth: tight pass lower right, loose pass over the whole hill */}
              <Hatch clip={hill} p={c.shade} angle={42} gap={5} op={0.3} box={[200, 250, 190, 120]} />
              <Hatch clip={hill} p={c.shade} angle={42} gap={11} op={0.17} box={[16, 150, 368, 220]} />
              <Hatch clip={hill} p={c.detail} angle={-30} gap={8} op={0.12} cross box={[16, 300, 368, 66]} />
              <Stipple clip={hill} p={c.detail} n={420} seed={3} r={0.9} op={0.22} box={[16, 150, 368, 220]} />
            </g>
          );
        }}
      </Plate>
    );
  };
