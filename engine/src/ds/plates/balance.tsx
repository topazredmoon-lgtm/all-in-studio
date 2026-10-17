/**
 * **Balance** — a brass beam balance, and the joke that the free thing wins.
 * A turned column (its profile is a function: collars, a bead, a swelling baluster, a flared foot), a yoke with the
 * knife-edge pivot, a tapered beam with piercing and a graduated lower edge, and two pans on chains whose links are
 * generated along each chain line, alternating flat and edge-on. Left pan: a stack of three graded brass weights and a
 * jar of seed — the fixes, which cost. Right pan: only a thin coil of rope lying flat — the loop, which weighs nothing,
 * costs nothing, and so is the one nobody has to carry. Over the shot the beam tips hard to the left (with a small
 * overshoot), the pans stay plumb as they swing, and the pointer, red, sweeps across its graduated scale.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const f = (n: number) => n.toFixed(1);
const hash = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
const PV = { x: 200, y: 112 }; // pivot
const HALF = 134; // half beam length
const LEG = 118; // chain length to the pan rim
const rad = (d: number) => (d * Math.PI) / 180;

/** The column's half-width at height y: a turned baluster built from named sections. */
const hw = (y: number) => {
  if (y < 142) return 11 - 0.5 * (y - 134);
  if (y < 150) return 7;
  if (y < 212) return 4.6;
  if (y < 222) return 4.6 + 6 * Math.sin(((y - 212) / 10) * Math.PI);
  if (y < 268) return 5.2 + 10 * Math.sin(((y - 222) / 46) * Math.PI);
  if (y < 276) return 12;
  if (y < 298) return 7;
  return 7 + 28 * Math.pow((y - 298) / 22, 1.6);
};
const COL_TOP = 134, COL_BOT = 320;

/** chain links along a line: alternate flat (seen full) and edge-on, each turned to the line's direction */
const chain = (x0: number, y0: number, x1: number, y1: number, n: number) => {
  const dx = x1 - x0, dy = y1 - y0, ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, x = x0 + dx * u, y = y0 + dy * u;
    const full = i % 2 === 0;
    out.push(<ellipse key={i} cx={f(x)} cy={f(y)} rx={full ? 4.6 : 3.4} ry={full ? 2.5 : 0.9} transform={`rotate(${f(ang)} ${f(x)} ${f(y)})`} fill="none" stroke={color.ink} strokeWidth={full ? 1.7 : 2.1} opacity={0.92} />);
  }
  return out;
};

/** a brass weight: a short cylinder, top ellipse, groove, shaded on its right */
const Weight: React.FC<{ id: string; cx: number; base: number; hwid: number; hgt: number; knob?: boolean; c: { inner: number; detail: number; shade: number; contour: number } }> =
  ({ id, cx, base, hwid, hgt, knob, c }) => {
    const top = base - hgt, ry = hwid * 0.26;
    const d = `M${cx - hwid} ${top} L${cx - hwid} ${base} A${hwid} ${ry} 0 0 0 ${cx + hwid} ${base} L${cx + hwid} ${top} Z`;
    return (
      <g>
        <clipPath id={id}><path d={d} /></clipPath>
        <path d={d} {...cut(c.contour, color.ink, CONTOUR * 0.75)} />
        <ellipse cx={cx} cy={top} rx={hwid} ry={ry} {...cut(c.inner, color.ink, INNER)} />
        <path d={`M${cx - hwid} ${f(top + hgt * 0.36)} A${hwid} ${ry} 0 0 0 ${cx + hwid} ${f(top + hgt * 0.36)}`} {...cut(c.detail, color.ink, DETAIL * 1.2)} opacity={0.8} />
        <Hatch clip={id} p={c.shade} angle={90} gap={2.6} op={0.4} box={[cx + hwid * 0.1, top, hwid * 0.95, hgt + ry * 2]} />
        <Hatch clip={id} p={c.shade} angle={90} gap={6} op={0.16} box={[cx - hwid, top, hwid * 1.1, hgt + ry * 2]} />
        <path d={`M${f(cx - hwid + 3)} ${f(top + 3)} L${f(cx - hwid + 3)} ${f(base - 2)}`} {...cut(c.detail, color.ink, DETAIL * 1.8)} opacity={0.9} />
        {knob && (
          <g>
            <path d={`M${cx - 3} ${f(top - ry * 0.4)} L${cx - 3} ${top - 8} Q${cx} ${top - 12} ${cx + 3} ${top - 8} L${cx + 3} ${f(top - ry * 0.4)}`} {...cut(c.inner, color.ink, INNER)} />
            <ellipse cx={cx} cy={top - 11} rx={5.4} ry={3.4} {...cut(c.inner, color.ink, INNER)} />
          </g>
        )}
      </g>
    );
  };

export const Balance: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [col, wt0, wt1, wt2, jarId, panL, panR, band] = useIds(8);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(40, 72);
          const e = 1 - Math.pow(1 - t, 3) * Math.cos(t * 8.5); // 0 → 1 with a little overshoot
          const theta = -15 * e; // beam angle: left end down
          const R = (x: number, y: number) => [PV.x + x * Math.cos(rad(theta)) - y * Math.sin(rad(theta)), PV.y + x * Math.sin(rad(theta)) + y * Math.cos(rad(theta))] as const;
          const [lx, ly] = R(-HALF, 8), [rx, ry] = R(HALF, 8);
          const sway = Math.sin(c.frame / 14) * 1.3 * Math.max(0, 1 - t);
          const pan = (x: number, y: number) => ({ x: x + sway, y: y + LEG });
          const PL = pan(lx, ly), PR = pan(rx, ry);

          // column
          const left: string[] = [], right: string[] = [];
          for (let y = COL_TOP; y <= COL_BOT; y += 2) { left.push(`${y === COL_TOP ? 'M' : 'L'}${f(PV.x - hw(y))} ${y}`); right.push(`${y === COL_TOP ? 'M' : 'L'}${f(PV.x + hw(y))} ${y}`); }
          const colD = left.join(' ') + ' ' + right.slice().reverse().map((s, i) => (i ? 'L' : 'L') + s.slice(1)).join(' ') + ' Z';
          const rings = [142, 150, 212, 222, 268, 276, 298].map((y) => `M${f(PV.x - hw(y + 0.5) - 1)} ${y} Q${PV.x} ${y + 3} ${f(PV.x + hw(y + 0.5) + 1)} ${y}`).join(' ');
          const flutes = [-0.45, -0.1, 0.25, 0.55].map((k) => {
            const pts: string[] = [];
            for (let y = 224; y <= 266; y += 3) pts.push(`${pts.length ? 'L' : 'M'}${f(PV.x + hw(y) * k)} ${y}`);
            return pts.join(' ');
          }).join(' ');

          // beam, local coordinates about the pivot
          const hb = (x: number) => 2.4 + 3.6 * Math.pow(1 - Math.abs(x) / HALF, 1.5);
          const topE: string[] = [], botE: string[] = [];
          for (let x = -HALF; x <= HALF; x += 6.7) { topE.push(`${topE.length ? 'L' : 'M'}${f(x)} ${f(-hb(x))}`); botE.push(`${botE.length ? 'L' : 'M'}${f(x)} ${f(hb(x))}`); }
          const grads: string[] = [];
          for (let i = -16; i <= 16; i++) { const x = i * 8; if (i === 0 || Math.abs(x) > 128) continue; grads.push(`M${x} ${f(hb(x))} l0 ${i % 5 === 0 ? 6 : 3.4}`); }
          // scale: pointer sweeps against ticks every 3 degrees on an arc plate
          const SR = 52;
          const arc = (a0: number, a1: number, r: number) => {
            const pts: string[] = [];
            for (let i = 0; i <= 24; i++) { const a = 90 + a0 + ((a1 - a0) * i) / 24; pts.push(`${i ? 'L' : 'M'}${f(PV.x + r * Math.cos(rad(a)))} ${f(PV.y + r * Math.sin(rad(a)))}`); }
            return pts.join(' ');
          };
          const scaleTicks: string[] = [];
          for (let a = -24; a <= 24; a += 3) {
            const long = a % 12 === 0, r0 = SR + 6, r1 = SR + 6 - (long ? 11 : a % 6 === 0 ? 8 : 5);
            scaleTicks.push(`M${f(PV.x + r0 * Math.cos(rad(90 + a)))} ${f(PV.y + r0 * Math.sin(rad(90 + a)))} L${f(PV.x + r1 * Math.cos(rad(90 + a)))} ${f(PV.y + r1 * Math.sin(rad(90 + a)))}`);
          }
          const sector = arc(-27, 27, SR + 8) + ' ' + arc(27, -27, SR - 8).replace('M', 'L') + ' Z';

          // pan bowl
          const bowl = (cx: number, cy: number) => `M${f(cx - 48)} ${f(cy)} Q${f(cx - 44)} ${f(cy + 27)} ${f(cx)} ${f(cy + 30)} Q${f(cx + 44)} ${f(cy + 27)} ${f(cx + 48)} ${f(cy)} A48 9 0 0 1 ${f(cx - 48)} ${f(cy)} Z`;
          const panFront = (cx: number, cy: number) => `M${f(cx - 48)} ${f(cy)} Q${f(cx - 44)} ${f(cy + 27)} ${f(cx)} ${f(cy + 30)} Q${f(cx + 44)} ${f(cy + 27)} ${f(cx + 48)} ${f(cy)} A48 9 0 0 1 ${f(cx - 48)} ${f(cy)}`;
          // rope coil on the right pan: concentric flat rings with twist ticks, and a loose tail over the rim
          const coil = [[36, 5.6], [28.5, 4.4], [21, 3.2], [13.5, 2.1]];
          const twist = coil.map(([a, b], k) => Array.from({ length: Math.round(a * 0.95) }, (_, i) => {
            const an = (i / Math.round(a * 0.95)) * Math.PI * 2;
            const x = PR.x + a * Math.cos(an), y = PR.y + 2 + b * Math.sin(an);
            return `M${f(x - 1.2)} ${f(y - 0.9)} L${f(x + 1.2)} ${f(y + 0.9)}`;
          }).join(' ')).join(' ');

          // seed jar on the left pan
          const jx = PL.x + 24, jb = PL.y + 5, jhw = 10.5, jh = 32;
          const seeds: React.ReactNode[] = [];
          for (let i = 0; i < 50; i++) {
            const u = hash(i, 3), v = hash(i, 5), x = jx + (u - 0.5) * (jhw * 2 - 4), y = jb - 3 - v * jh * 0.7;
            seeds.push(<ellipse key={i} cx={f(x)} cy={f(y)} rx={1.7} ry={0.95} transform={`rotate(${f(hash(i, 7) * 180)} ${f(x)} ${f(y)})`} />);
          }

          return (
            <g style={breathe(c.frame, 1.0, 230)}>
              <Clip id={col} d={colD} />
              <Clip id={band} d={sector} />
              <Clip id={panL}><path d={bowl(PL.x, PL.y)} /></Clip>
              <Clip id={panR}><path d={bowl(PR.x, PR.y)} /></Clip>

              {/* floor and cast shadow */}
              <ellipse cx={226} cy={COL_BOT + 12} rx={118} ry={12} {...ink(c.shade, color.stageDeep, 0.95)} />
              <path d={`M110 ${COL_BOT + 18} L190 ${COL_BOT + 18} M260 ${COL_BOT + 16} L340 ${COL_BOT + 16} M280 ${COL_BOT + 24} L330 ${COL_BOT + 24}`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.4} />

              {/* column and foot */}
              <path d={colD} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <path d={`M${PV.x - 35} ${COL_BOT} A35 10 0 0 0 ${PV.x + 35} ${COL_BOT}`} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <path d={rings} {...cut(c.inner, color.ink, INNER * 0.9)} />
              <path d={flutes} {...cut(c.detail, color.ink, DETAIL)} opacity={0.55} />
              <Hatch clip={col} p={c.shade} angle={90} gap={2.8} op={0.4} box={[PV.x + 2, COL_TOP, 40, COL_BOT - COL_TOP + 8]} />
              <Hatch clip={col} p={c.shade} angle={90} gap={7} op={0.16} box={[PV.x - 36, COL_TOP, 40, COL_BOT - COL_TOP + 8]} />
              <Stipple clip={col} p={c.detail} n={160} seed={31} r={0.8} op={0.24} box={[PV.x - 36, 212, 72, 110]} />
              <path d={`M${PV.x - 5.5} 232 L${PV.x - 8} 258 M${PV.x - 12} 300 L${PV.x - 24} 316`} {...cut(c.detail, color.ink, DETAIL * 1.9)} opacity={0.9} />

              {/* scale plate: a sector with ticks, masking the column behind it */}
              <path d={sector} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={sector} {...cut(c.inner, color.ink, INNER)} />
              <path d={arc(-24, 24, SR + 6)} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
              <path d={scaleTicks.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.1)} />
              <Hatch clip={band} p={c.shade} angle={90} gap={3.5} op={0.14} box={[PV.x - 60, PV.y + 40, 120, 30]} />
              <path d={`M${PV.x} ${PV.y + SR - 8} L${PV.x} ${PV.y + SR + 6}`} {...cut(c.detail, color.ink, DETAIL * 2.2)} />

              {/* yoke around the pivot, knife edge */}
              <path d={`M${PV.x - 22} ${PV.y + 24} L${PV.x - 22} ${PV.y - 4} Q${PV.x - 22} ${PV.y - 10} ${PV.x - 16} ${PV.y - 10} L${PV.x - 12} ${PV.y - 10} M${PV.x + 22} ${PV.y + 24} L${PV.x + 22} ${PV.y - 4} Q${PV.x + 22} ${PV.y - 10} ${PV.x + 16} ${PV.y - 10} L${PV.x + 12} ${PV.y - 10}`} {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
              <path d={`M${PV.x - 22} ${PV.y + 24} L${PV.x + 22} ${PV.y + 24} M${PV.x - 26} ${PV.y + 26} L${PV.x + 26} ${PV.y + 26} L${PV.x + 26} ${COL_TOP - 2} L${PV.x - 26} ${COL_TOP - 2} Z`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M${PV.x - 7} ${PV.y + 6} L${PV.x} ${PV.y + 14} L${PV.x + 7} ${PV.y + 6}`} {...cut(c.inner, color.ink, INNER)} />

              {/* the beam: tapered bar, piercing, graduated lower edge, boss, hooks; the pointer is red */}
              <g transform={`rotate(${f(theta)} ${PV.x} ${PV.y}) translate(${PV.x} ${PV.y})`}>
                <path d={topE.join(' ') + ' ' + botE.slice().reverse().map((s) => 'L' + s.slice(1)).join(' ') + ' Z'} {...cut(c.contour, color.ink, CONTOUR * 0.72)} />
                <path d={grads.join(' ')} {...cut(c.detail, color.ink, DETAIL)} />
                {[-100, -76, -54, -34, 34, 54, 76, 100].map((x, i) => <circle key={i} cx={x} cy={0} r={Math.abs(x) < 60 ? 2.4 : 1.8} {...cut(c.detail, color.ink, DETAIL * 1.1)} />)}
                <path d={`M-120 -1.6 L-104 -1.6 M104 -1.6 L120 -1.6`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
                <ellipse cx={0} cy={0} rx={26} ry={10.5} {...cut(c.inner, color.ink, INNER * 1.1)} />
                <path d="M-18 -4 Q0 -9 18 -4" {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
                <path d="M-20 4 Q0 9 20 4 M-14 7 Q0 10 14 7" {...cut(c.shade, color.ink, DETAIL)} opacity={0.7} />
                <circle cx={0} cy={0} r={3.6} {...ink(c.detail, color.ink)} />
                {[-HALF, HALF].map((x) => (
                  <g key={x}>
                    <circle cx={x} cy={0} r={5.4} {...cut(c.inner, color.ink, INNER)} />
                    <circle cx={x} cy={7} r={3.2} {...cut(c.inner, color.ink, INNER)} />
                  </g>
                ))}
                {/* pointer: a red needle from the boss to the scale, spade tip */}
                <path d={`M0 6 L0 ${SR - 4}`} {...cut(c.accent, color.red, INNER * 1.5)} />
                <path d={`M0 ${SR - 14} L-3.6 ${SR - 8} L0 ${SR + 4} L3.6 ${SR - 8} Z`} {...ink(c.accent, color.red)} />
                <circle cx={0} cy={22} r={2.6} {...ink(c.accent, color.red)} />
              </g>

              {/* chains */}
              {[-1, 1].map((s) => {
                const hx = s < 0 ? lx : rx, hy = s < 0 ? ly : ry, P = s < 0 ? PL : PR;
                return (
                  <g key={s}>
                    {chain(hx + sway * 0.1, hy, P.x - 46, P.y, 14)}
                    {chain(hx + sway * 0.1, hy, P.x + 46, P.y, 14)}
                    {chain(hx + sway * 0.1, hy, P.x + 2, P.y + 9, 14)}
                  </g>
                );
              })}

              {/* left pan: heavy weights and the jar — the fixes */}
              <path d={bowl(PL.x, PL.y)} {...cut(c.contour, color.ink, CONTOUR * 0.75)} />
              <ellipse cx={PL.x} cy={PL.y} rx={48} ry={9} {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={PL.x} cy={PL.y} rx={42} ry={7} {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={panL} p={c.shade} angle={78} gap={3} op={0.34} box={[PL.x - 48, PL.y, 96, 32]} />
              <Hatch clip={panL} p={c.shade} angle={78} gap={7} op={0.14} box={[PL.x - 48, PL.y - 10, 50, 40]} />
              <Weight id={wt0} cx={PL.x - 14} base={PL.y + 4} hwid={20} hgt={19} c={c} />
              <Weight id={wt1} cx={PL.x - 14} base={PL.y + 4 - 19 - 2} hwid={15.5} hgt={16} c={c} />
              <Weight id={wt2} cx={PL.x - 14} base={PL.y + 4 - 19 - 16 - 4} hwid={11} hgt={13} knob c={c} />
              <clipPath id={jarId}><path d={`M${jx - jhw} ${jb - jh} L${jx - jhw} ${jb} A${jhw} 3.4 0 0 0 ${jx + jhw} ${jb} L${jx + jhw} ${jb - jh} Z`} /></clipPath>
              <path d={`M${jx - jhw} ${jb - jh} L${jx - jhw} ${jb} A${jhw} 3.4 0 0 0 ${jx + jhw} ${jb} L${jx + jhw} ${jb - jh}`} {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={jx} cy={jb - jh} rx={jhw} ry={3.4} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
              <g clipPath={`url(#${jarId})`} fill={color.ink} opacity={0.82 * c.detail}>{seeds}</g>
              <Hatch clip={jarId} p={c.shade} angle={90} gap={2.6} op={0.3} box={[jx + 2, jb - jh, jhw, jh + 4]} />
              <path d={`M${f(jx - jhw + 2.6)} ${f(jb - jh + 4)} L${f(jx - jhw + 2.6)} ${f(jb - 4)}`} {...cut(c.detail, color.ink, DETAIL * 1.8)} opacity={0.9} />
              <path d={`M${jx - jhw - 1} ${jb - jh - 6} h${2 * jhw + 2} v6 h${-(2 * jhw + 2)} Z`} {...cut(c.contour, color.ink, INNER)} />
              <path d={`M${f(jx + jhw + 1)} ${f(jb - jh - 2)} Q${f(jx + jhw + 5)} ${f(jb - jh + 2)} ${f(jx + jhw + 6)} ${f(jb - jh + 8)}`} {...cut(c.detail, color.ink, DETAIL * 1.1)} />
              <path d={`M${f(jx + jhw + 2)} ${f(jb - jh + 7)} h8 v10 h-8 Z`} {...cut(c.inner, color.ink, DETAIL * 1.3)} />
              <path d={`M${f(jx + jhw + 3.6)} ${f(jb - jh + 11)} h5 M${f(jx + jhw + 3.6)} ${f(jb - jh + 14)} h3`} {...cut(c.detail, color.ink, DETAIL)} />
              <path d={panFront(PL.x, PL.y)} {...cut(c.contour, color.ink, CONTOUR * 0.75)} />

              {/* right pan: a coil of rope lying flat, weighing nothing */}
              <path d={bowl(PR.x, PR.y)} {...cut(c.contour, color.ink, CONTOUR * 0.75)} />
              <ellipse cx={PR.x} cy={PR.y} rx={48} ry={9} {...cut(c.inner, color.ink, INNER)} />
              <ellipse cx={PR.x} cy={PR.y} rx={42} ry={7} {...ink(c.contour, color.stageDeep, 1)} />
              <Hatch clip={panR} p={c.shade} angle={78} gap={3} op={0.34} box={[PR.x - 48, PR.y, 96, 32]} />
              <Hatch clip={panR} p={c.shade} angle={78} gap={7} op={0.14} box={[PR.x - 48, PR.y - 10, 50, 40]} />
              {coil.map(([a, b], k) => <ellipse key={k} cx={PR.x} cy={PR.y + 2} rx={a} ry={b} {...cut(c.inner, color.ink, k === 0 ? INNER * 1.2 : INNER)} />)}
              <path d={twist} {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
              <path d={`M${f(PR.x + 36)} ${f(PR.y + 2)} Q${f(PR.x + 52)} ${f(PR.y + 4)} ${f(PR.x + 51)} ${f(PR.y + 20)} M${f(PR.x + 33)} ${f(PR.y + 5)} Q${f(PR.x + 47)} ${f(PR.y + 8)} ${f(PR.x + 46)} ${f(PR.y + 22)} M${f(PR.x + 51)} ${f(PR.y + 20)} l2 5 M${f(PR.x + 49)} ${f(PR.y + 21)} l-1 5 M${f(PR.x + 46)} ${f(PR.y + 22)} l1 4`} {...cut(c.detail, color.ink, DETAIL * 1.2)} />
              <path d={panFront(PR.x, PR.y)} {...cut(c.contour, color.ink, CONTOUR * 0.75)} />
            </g>
          );
        }}
      </Plate>
    );
  };
