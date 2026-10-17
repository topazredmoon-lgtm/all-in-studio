/**
 * Topic visuals: THE PRICE OF THE PROMPT (2-min sample, 2026-10-14).
 * AI's electricity bill, told as wood engraving + editorial evidence.
 *
 * Plates (engrave.tsx register - contour/inner/detail, hatch + stipple, one red each):
 *   MeterDial   - the viewer's meter; the disc spins faster as the machine gets hungrier
 *   ServerHall  - the data centre outside; dark when quiet, lit rows + steam when awake
 *   ServerRack  - the machine itself: a rack of units whose rows ignite bottom to top
 *   SunCity     - the region's skyline; calm at dusk or sweating under a high sun
 *   GridMap     - the grid: the PJM footprint as an engraved land, one red hot zone
 *   AuctionChart- the capacity price as cut stone steps: 28.92 -> 269.92 -> 329.17
 *   BackupGen   - a diesel generator yard, exhaust climbing; red note "15 MIN"
 * Documents / editorial register (ds/ primitives):
 *   Bill        - the utility statement with the jump highlighted by a sweep
 *   OrderDoc    - the DOE 202(c) emergency order, stamped, exemption line
 *   HomeAC      - the viewer's home at night, windows lit, the AC unit running
 *
 * SCHEDULE RULE (watch.py: no cut opens on an empty board): every plate cuts in from
 * frame 0 of its shot (contour -> inner -> shade -> detail). Only the plate's own
 * motion (the dial turning, rows igniting, windows lighting, the red landing) waits
 * for its cue word.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Note, Plate, Stipple, VB, breathe, cut, ink, useIds } from '../ds/engrave';
import { Accent, Panel, Stamp, Sweep, hand, mono, prog, serif, useCue } from '../ds/core';
import { color } from '../ds/tokens';
import { ImpactBurst, FloatingPopScore, DoodleUnderline, Tactile3DBlock, SpecularSheen } from '../ds/juice';

const C = VB / 2;
const INK = color.ink;

// ---------------------------------------------------------------- MeterDial
/** The viewer's meter: a glass meter with a rotating disc; the disc speed is the story. */
export const MeterDial: React.FC<{ w: number; h: number; spinAt?: string | number }> = ({ w, h, spinAt }) => {
  const [glass] = useIds(1);
  const spinF = useCue(spinAt, 0); // the disc only turns once the line says so; the case cuts in at frame 0
  return (
    <Plate w={w} h={h}>
      {(c) => {
        const spin = prog(c.frame, spinF, 240) * 9;
        return (
          <g style={breathe(c.frame)}>
            <ellipse cx={C} cy={C + 148} rx={118} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d="M84 92 L316 92 L330 132 L330 300 L300 330 L100 330 L70 300 L70 132 Z" {...cut(c.contour, INK, CONTOUR)} />
            <path d="M84 92 L316 92 L330 132 L330 150 L70 150 L70 132 Z" {...cut(c.inner, INK, INNER)} />
            <Clip id={glass} d="M92 160 L308 160 L308 292 L92 292 Z" />
            <g transform={`translate(${C} 226) rotate(${spin.toFixed(1)})`} opacity={0.35 + 0.65 * prog(c.frame, spinF, 30)}>
              <ellipse cx={0} cy={0} rx={92} ry={62} {...cut(c.contour, INK, CONTOUR)} />
              <path d="M-66 0 L66 0 M0 -44 L0 44" {...cut(c.inner, INK, DETAIL)} />
              <path d="M0 -44 L44 0 L0 44 L-44 0 Z" {...cut(c.detail, INK, DETAIL * 1.2)} />
            </g>
            <rect x={92} y={160} width={216} height={132} fill="none" {...cut(c.inner, INK, DETAIL)} />
            <Hatch clip={glass} p={c.shade} angle={40} gap={11} op={0.26} />
            <Hatch clip={glass} p={c.detail} angle={116} gap={16} op={0.15} />
            <path d="M258 200 L258 258 M284 200 L284 258" {...cut(c.detail, INK, DETAIL)} />
            <rect x={254} y={216} width={8} height={12} {...ink(c.accent, color.red)} />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- ServerHall
/** The data centre outside: cooling towers and a long facade. Dark when quiet. */
export const ServerHall: React.FC<{ w: number; h: number; calm?: boolean; at?: string | number; plate?: string }> =
  ({ w, h, calm = false, at, plate }) => {
    const [hall] = useIds(1);
    const wakeF = useCue(at, 0); // windows light + steam on this word; the towers cut in at frame 0
    return (
      <Plate w={w} h={h} plate={plate}>
        {(c) => {
          const awake = calm ? 0 : prog(c.frame, wakeF, 40);
          return (
            <g style={breathe(c.frame)}>
              <ellipse cx={C} cy={C + 140} rx={150} ry={16} {...ink(c.shade, color.stageDeep, 0.9)} />
              <path d="M96 300 L110 168 Q112 150 132 150 L168 150 Q188 150 190 168 L204 300 Z" {...cut(c.contour, INK, CONTOUR)} />
              <path d="M216 300 L230 190 Q232 174 250 174 L284 174 Q302 174 304 190 L318 300 Z" {...cut(c.contour, INK, CONTOUR)} />
              <path d="M118 200 L182 200 M124 232 L176 232 M130 264 L170 264" {...cut(c.detail, INK, DETAIL)} />
              <path d="M240 224 L288 224 M246 254 L282 254" {...cut(c.detail, INK, DETAIL)} />
              <Clip id={hall} d="M96 300 L110 168 Q112 150 132 150 L168 150 Q188 150 190 168 L204 300 Z M216 300 L230 190 Q232 174 250 174 L284 174 Q302 174 304 190 L318 300 Z" />
              <Hatch clip={hall} p={c.shade} angle={40} gap={13} op={0.22} box={[90, 148, 232, 156]} />
              <Hatch clip={hall} p={c.detail} angle={-24} gap={18} op={0.12} />
              <g opacity={awake}>
                {[0, 1, 2].map((i) => (
                  <path key={i} d={`M${144 + i * 6} 148 C ${124 + i * 28} ${112 - i * 8}, ${178 - i * 20} ${86 - i * 10}, ${148 + i * 10} ${54 - i * 12}`}
                    {...cut(prog(c.frame, wakeF + 20 + i * 8, 26), INK, DETAIL, '6 10')} />
                ))}
              </g>
              <path d="M40 300 L40 208 L360 208 L360 300" {...cut(c.contour, INK, CONTOUR)} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <rect key={i} x={58 + i * 52} y={228} width={30} height={52} rx={2}
                  fill={awake ? color.red : 'none'} opacity={awake ? 0.85 : 0}
                  {...cut(1, INK, DETAIL)} />
              ))}
              <path d="M40 208 L360 208 M40 262 L360 262" {...cut(c.inner, INK, DETAIL)} />
            </g>
          );
        }}
      </Plate>
    );
  };

// ---------------------------------------------------------------- ServerRack
/** The machine: a server rack; units ignite bottom to top on `litAt`. */
export const ServerRack: React.FC<{ w: number; h: number; litAt?: string | number; plate?: string }> =
  ({ w, h, litAt, plate }) => {
    const [rack] = useIds(1);
    const litF = useCue(litAt, 0);
    return (
      <Plate w={w} h={h} plate={plate}>
        {(c) => {
          const t = Math.max(0, Math.min(1, (c.frame - litF) / 90));
          return (
            <g style={breathe(c.frame)}>
              <ellipse cx={C} cy={C + 140} rx={104} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
              <path d="M108 66 L292 66 L292 306 L108 306 Z M108 66 L96 78 L96 310 L108 322" {...cut(c.contour, INK, CONTOUR)} />
              {Array.from({ length: 8 }).map((_, i) => {
                const y = 82 + i * 29;
                const on = Math.max(0, Math.min(1, t * 8 - i));
                return (
                  <g key={i} opacity={0.3 + 0.7 * on}>
                    <rect x={116} y={y} width={168} height={22} rx={3} {...cut(1, INK, DETAIL)} />
                    <rect x={124} y={y + 7} width={10} height={8} fill={i === 3 ? color.red : INK} opacity={on} stroke="none" />
                    {[0, 1, 2].map((k) => (
                      <line key={k} x1={142 + k * 46} y1={y + 11} x2={168 + k * 46} y2={y + 11} {...cut(on, INK, DETAIL * 0.8)} />
                    ))}
                  </g>
                );
              })}
              <Clip id={rack} d="M108 66 L292 66 L292 306 L108 306 Z" />
              <Hatch clip={rack} p={c.shade} angle={44} gap={9} op={0.3} box={[110, 70, 180, 240]} />
              <Stipple clip={rack} p={c.detail} n={140} seed={4} op={0.18} />
            </g>
          );
        }}
      </Plate>
    );
  };

// ---------------------------------------------------------------- SunCity
/** The region: skyline under a sun. calm = low dusk sun; hot = high sun + shimmer. */
export const SunCity: React.FC<{ w: number; h: number; calm?: boolean; calmAt?: string | number; hotAt?: string | number; plate?: string }> =
  ({ w, h, calm = false, calmAt, hotAt, plate }) => {
    const [sun] = useIds(1);
    const stateF = useCue(calm ? calmAt : hotAt, 0);
    return (
      <Plate w={w} h={h} plate={plate}>
        {(c) => {
          const hot = calm ? 0 : prog(c.frame, stateF, 40);
          const sunY = calm ? 268 : 128;
          const r = calm ? 40 : 34;
          return (
            <g style={breathe(c.frame)}>
              <line x1={28} y1={296} x2={372} y2={296} {...cut(c.contour, INK, CONTOUR)} />
              <Clip id={sun} d={`M${C - r} ${sunY} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`} />
              <circle cx={C} cy={sunY} r={r} {...cut(c.contour, INK, CONTOUR)} />
              {hot > 0 && <Hatch clip={sun} p={hot} angle={38} gap={12} op={0.3} box={[C - r, sunY - r, r * 2, r * 2]} />}
              <circle cx={C} cy={sunY} r={r} {...ink(c.accent, color.red, hot * 0.22)} />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={C + Math.cos(a) * (r + 8)} y1={sunY + Math.sin(a) * (r + 8)}
                  x2={C + Math.cos(a) * (r + 24)} y2={sunY + Math.sin(a) * (r + 24)}
                  {...cut(c.detail, INK, DETAIL)} opacity={0.3 + 0.7 * hot} />;
              })}
              {[[52, 210, 44], [104, 178, 40], [150, 226, 52], [210, 160, 46], [264, 200, 40], [312, 236, 50]].map(([x, top, wd], i) => (
                <path key={i} d={`M${x} 296 L${x} ${top} L${x + wd} ${top} L${x + wd} 296`} {...cut(c.contour, INK, i === 3 ? CONTOUR : INNER)} />
              ))}
              <path d="M226 160 L226 128 M218 128 L234 128 M222 118 L230 118" {...cut(c.detail, INK, DETAIL)} />
              {hot > 0 && [[64, 232], [116, 200], [226, 182], [276, 222]].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width={8} height={10} fill={color.red}
                  opacity={0.5 + 0.4 * Math.sin(c.frame * 0.06 + i)} stroke="none" />
              ))}
            </g>
          );
        }}
      </Plate>
    );
  };

// ---------------------------------------------------------------- GridMap
/** The grid footprint: an engraved land with a river; one red zone is the hot corner. */
export const GridMap: React.FC<{ w: number; h: number; zoneAt?: string | number; plate?: string }> =
  ({ w, h, zoneAt, plate }) => {
    const [land] = useIds(1);
    const zoneF = useCue(zoneAt, 0);
    const d = 'M46 96 Q120 60 210 78 Q300 66 356 104 Q368 190 330 250 Q300 316 190 322 Q90 316 54 246 Q36 172 46 96 Z';
    return (
      <Plate w={w} h={h} plate={plate}>
        {(c) => (
          <g style={breathe(c.frame)}>
            <path d={d} {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={land} d={d} />
            <path d="M70 130 Q140 170 170 240 Q190 290 250 300" {...cut(c.inner, INK, INNER, '9 8')} />
            <ellipse cx={272} cy={168} rx={34} ry={22} {...cut(c.inner, INK, INNER)} />
            {[[90, 150, 320, 120], [110, 260, 300, 230], [150, 110, 160, 300]].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} {...cut(c.detail, INK, DETAIL, '7 9')} />
                <line x1={x1} y1={y1 - 10} x2={x2 - 8} y2={y2 - 10} {...cut(c.detail, INK, DETAIL * 0.8, '7 9')} />
              </g>
            ))}
            <Hatch clip={land} p={c.shade} angle={40} gap={15} op={0.13} />
            <Stipple clip={land} p={c.detail} n={200} seed={6} op={0.15} />
            <ellipse cx={286} cy={244} rx={40} ry={30} {...ink(prog(c.frame, zoneF, 10), color.red, 0.16)} />
            <ellipse cx={286} cy={244} rx={40} ry={30} fill="none" stroke={color.red} strokeWidth={DETAIL}
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(c.frame, zoneF, 12)} />
          </g>
        )}
      </Plate>
    );
  };

// ---------------------------------------------------------------- AuctionChart
/** The capacity price as cut stone steps: $28.92 -> $269.92 -> $329.17 per MW-day. */
export const AuctionChart: React.FC<{ w: number; h: number; barsAt?: string | number; stampAt?: string | number; plate?: string }> =
  ({ w, h, barsAt, stampAt, plate }) => {
    const ids = useIds(4);
    const barsF = useCue(barsAt, 0);
    const stampF = useCue(stampAt, 9999); // the next auction's record: the arrow + dot
    const bars = [
      { x: 96, h: 44, label: '2024' },
      { x: 176, h: 128, label: '2025' },
      { x: 256, h: 156, label: '2026' },
    ];
    return (
      <Plate w={w} h={h} plate={plate}>
        {(c) => {
          const grow = prog(c.frame, barsF, 60);
          return (
            <g style={breathe(c.frame)}>
              <path d="M72 92 L72 300 L344 300" {...cut(c.contour, INK, CONTOUR)} />
              {bars.map((b, i) => {
                const hh = b.h * Math.max(0, Math.min(1, grow * 3 - i));
                const last = i === 2;
                return (
                  <g key={i}>
                    <path d={`M${b.x} 300 L${b.x} ${300 - hh} L${b.x + 56} ${300 - hh} L${b.x + 56} 300`}
                      {...cut(prog(c.frame, barsF + 6 + i * 12, 20), last ? color.red : INK, last ? CONTOUR : INNER)} />
                    <Clip id={ids[i]} d={`M${b.x} 300 L${b.x} ${300 - hh} L${b.x + 56} ${300 - hh} L${b.x + 56} 300 Z`} />
                    <Hatch clip={ids[i]} p={c.shade} angle={40} gap={10} op={last ? 0.4 : 0.24} />
                    <text x={b.x + 28} y={324} textAnchor="middle" fill={INK} fontFamily="AllinMono, Consolas, monospace"
                      fontSize={20} opacity={c.inner}>{b.label}</text>
                  </g>
                );
              })}
              <path d="M124 262 C 180 240, 220 190, 286 128" fill="none" stroke={color.red} strokeWidth={DETAIL}
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(c.frame, stampF, 16)} strokeLinecap="round" />
              <circle cx={286} cy={128} r={4} {...ink(prog(c.frame, stampF, 8), color.red)} />
            </g>
          );
        }}
      </Plate>
    );
  };

// ---------------------------------------------------------------- BackupGen
/** The diesel yard: a generator set with an exhaust stack; red note "15 MIN". */
export const BackupGen: React.FC<{ w: number; h: number; noteAt?: string | number; plate?: string }> = ({ w, h, noteAt, plate }) => {
  const [gen] = useIds(1);
  const noteF = useCue(noteAt, 0);
  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const run = prog(c.frame, noteF, 40);
        return (
          <g style={breathe(c.frame)}>
            <ellipse cx={C} cy={C + 136} rx={120} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d="M92 300 L92 176 L268 176 L268 300 Z" {...cut(c.contour, INK, CONTOUR)} />
            <path d="M92 176 L268 176 L268 196 L92 196 Z M92 246 L268 246" {...cut(c.inner, INK, INNER)} />
            <Clip id={gen} d="M92 176 L268 176 L268 300 L92 300 Z" />
            <Hatch clip={gen} p={c.shade} angle={40} gap={11} op={0.26} box={[94, 200, 172, 98]} />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={112 + i * 34} y1={214} x2={112 + i * 34} y2={232} {...cut(c.detail, INK, DETAIL)} />
            ))}
            <path d="M236 176 L236 96 L250 96 L250 176" {...cut(c.inner, INK, INNER)} />
            <path d="M243 96 C 220 70, 262 52, 240 26 C 226 8, 250 4, 244 -10" {...cut(run, INK, DETAIL, '6 9')} />
            <circle cx={112} cy={270} r={6} {...ink(c.accent, color.red, 0.5 + 0.5 * Math.sin(c.frame * 0.2))} />
            <Note x={300} y={150} to={[288, 176]} t="15 MIN" p={prog(c.frame, noteF + 34, 12)} />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- documents (editorial register)

/** The viewer's utility statement: the line that matters swept in red. */
export const Bill: React.FC<{ w: number; h: number; sweepAt?: string | number; plate?: string }> = ({ w, h, sweepAt, plate }) => {
  const sf_ = useCue(sweepAt, 14); // Sweep takes a frame; the cue word gives it
  const rows: [string, string][] = [
    ['ELECTRICITY · FEBRUARY 2026', ''],
    ['VIRGINIA AVG PRICE', '+26.3%'],
    ['OHIO AVG PRICE', '+21.9%'],
    ['PENNSYLVANIA AVG PRICE', '+19.5%'],
    ['WHAT CHANGED FOR YOU', 'SEE METER'],
  ];
  return (
    <Panel w={w} h={h} kicker="utility statement · eia average revenue per kwh" surface="paper" plate={plate} pad={40}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            borderBottom: `1px solid ${i === 0 ? color.paperInk : color.paperMute}`, paddingBottom: 7 }}>
            <span style={{ ...mono(20, color.paperInk), letterSpacing: 1 }}>{k}</span>
            {v && <span style={{ ...serif(32, i === 4 ? color.redDeep : color.paperInk), fontWeight: 700 }}>{v}</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <Sweep at={sf_} marker><span><Accent text="the machine meters run on your bill" /></span></Sweep>
      </div>
    </Panel>
  );
};

/** The DOE 202(c) emergency order: stamped, with the exemption line. */
export const OrderDoc: React.FC<{ w: number; h: number; stampAt?: string | number; plate?: string }> = ({ w, h, stampAt, plate }) => {
  const sf_ = useCue(stampAt, 14);
  return (
    <Panel w={w} h={h} kicker="department of energy · emergency order 202(c)" surface="paper" plate={plate} pad={40}>
      <div style={{ ...serif(28, color.paperInk), lineHeight: 1.35 }}>
        large loads with backup generation shall be prepared to switch to their own backup
        generation sources <span style={{ color: color.redDeep, fontWeight: 700 }}>within 15 minutes</span> of
        an emergency signal, as a last resort before load shed.
      </div>
      <div style={{ marginTop: 16, ...mono(19, color.paperMute) }}>
        EXEMPT: HOSPITALS · 911 · WATER TREATMENT · AIR TRAFFIC CONTROL · DEFENSE
      </div>
      <div style={{ marginTop: 20 }}>
        <Stamp at={sf_} text="IN EFFECT · JULY 2026" px={32} rotate={-7} />
      </div>
    </Panel>
  );
};

/** The viewer's home at night: windows lit, the AC unit running. The stake of the film. */
export const HomeAC: React.FC<{ w: number; h: number; litAt?: string | number; plate?: string }> = ({ w, h, litAt, plate }) => {
  const [home] = useIds(1);
  const litF = useCue(litAt, 0);
  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const lit = prog(c.frame, litF, 40);
        return (
          <g style={breathe(c.frame)}>
            <ellipse cx={C} cy={C + 138} rx={128} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d="M70 250 L70 140 L200 66 L330 140 L330 250 Z" {...cut(c.contour, INK, CONTOUR)} />
            <path d="M200 66 L200 250" {...cut(c.inner, INK, DETAIL)} />
            <Clip id={home} d="M70 250 L70 140 L200 66 L330 140 L330 250 Z" />
            <Hatch clip={home} p={c.shade} angle={40} gap={15} op={0.15} />
            {[[104, 168], [252, 168]].map(([x, y], i) => (
              <g key={i}>
                <rect x={x} y={y} width={44} height={40} rx={2} {...cut(1, INK, INNER)} />
                <rect x={x} y={y} width={44} height={40} rx={2} {...ink(lit, i === 0 ? color.red : color.mute, 0.5)} />
                <line x1={x + 22} y1={y} x2={x + 22} y2={y + 40} {...cut(1, INK, DETAIL)} />
              </g>
            ))}
            <path d="M182 250 L182 200 L218 200 L218 250" {...cut(c.inner, INK, INNER)} />
            <rect x={252} y={258} width={54} height={34} rx={4} {...cut(lit, INK, INNER)} />
            <circle cx={266} cy={275} r={7} {...cut(1, INK, DETAIL)} />
            <circle cx={266} cy={275} r={7} fill="none" stroke={color.red} strokeWidth={DETAIL} pathLength={1}
              strokeDasharray={1} strokeDashoffset={1 - prog(c.frame, litF + 10, 12)} />
            <circle cx={266} cy={275} r={4} {...ink(prog(c.frame, litF + 10, 8), color.red)} />
            <line x1={292} y1={268} x2={292} y2={282} {...cut(lit, INK, DETAIL)} />
            <line x1={298} y1={264} x2={298} y2={286} {...cut(lit, INK, DETAIL)} />
          </g>
        );
      }}
    </Plate>
  );
};

/** UtilityStatement: Authentic residential electric bill paper highlighting the capacity surcharge hike. */
export const UtilityStatement: React.FC<{ w: number; h: number; highlightAt?: string | number }> = ({ w, h, highlightAt }) => {
  const frame = useCurrentFrame();
  const hf = useCue(highlightAt, 20);
  const hp = prog(frame, hf, 18);

  const cardW = Math.min(w - 40, 680);
  const cardH = Math.min(h - 40, 480);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Tactile3DBlock
        width={cardW}
        height={cardH}
        bg="#F7F3EA"
        lipColor="#D5CEBF"
        at={hf}
        elevation={11}
        style={{
          padding: '32px 42px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Bill Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #D5CEBF', paddingBottom: 16 }}>
          <div>
            <div style={{ ...serif(24, '#1C1A17', 700) }}>PJM REGIONAL UTILITY</div>
            <div style={{ ...mono(13, '#736B5E'), marginTop: 2 }}>RESIDENTIAL ELECTRIC SERVICE · MONTHLY STATEMENT</div>
          </div>
          <div style={{ ...mono(14, color.red), fontWeight: 700 }}>
            {hp > 0 ? 'RATE HIKE APPLIED' : 'STANDARD'}
          </div>
        </div>

        {/* Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, '#3D3830') }}>
            <span>BASE ENERGY SUPPLY (850 kWh)</span>
            <span>$108.20</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, '#3D3830') }}>
            <span>DISTRIBUTION SERVICE</span>
            <span>$24.50</span>
          </div>

          {/* Surcharge Line with Red Highlighter Sweep */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            padding: '8px 10px',
            ...mono(16, hp > 0 ? color.red : '#1C1A17'),
            fontWeight: hp > 0 ? 800 : 500
          }}>
            {hp > 0 && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${hp * 100}%`,
                background: 'rgba(230,57,70,0.15)',
                borderRadius: 4,
                borderLeft: `4px solid ${color.red}`
              }} />
            )}
            <span style={{ position: 'relative', zIndex: 2 }}>GRID CAPACITY RELIABILITY SURCHARGE</span>
            <span style={{ position: 'relative', zIndex: 2, ...mono(18, hp > 0 ? color.red : '#1C1A17'), fontWeight: 800 }}>
              {hp > 0 ? '$54.80 (↑ +24%)' : '$14.20'}
            </span>
          </div>
        </div>

        {/* Total Due */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #D5CEBF', paddingTop: 16 }}>
          <div style={{ ...mono(15, '#736B5E') }}>TOTAL AMOUNT DUE</div>
          <div style={{ ...mono(28, hp > 0 ? color.red : '#1C1A17'), fontWeight: 800 }}>
            {hp > 0 ? '$187.50' : '$146.90'}
          </div>
        </div>
      </Tactile3DBlock>

      {/* Juice Impact Burst & Pop Score */}
      {hp > 0.4 && (
        <>
          <ImpactBurst cx={w / 2} cy={h / 2} at={hf} color={color.red} count={16} radius={220} />
          <FloatingPopScore text="+24% RATE HIKE!" cx={w / 2} cy={h / 2 - 130} at={hf} color={color.red} />
        </>
      )}
    </div>
  );
};

/** PJMGridSurge: Direct comparison bars showing capacity auction price soaring. */
export const PJMGridSurge: React.FC<{ w: number; h: number; surgeAt?: string | number }> = ({ w, h, surgeAt }) => {
  const frame = useCurrentFrame();
  const sf = useCue(surgeAt, 15);
  const p = prog(frame, sf, 25);

  const barW = 140;
  const maxH = 260;

  const h2024 = 28;
  const h2026 = 28 + (maxH - 28) * p;

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 90, position: 'relative', paddingBottom: 60 }}>
      {/* 2024 Base Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ ...mono(20, '#FAF6EE'), fontWeight: 700 }}>$28.92</div>
        <div style={{ width: barW, height: h2024, background: 'rgba(244,241,234,0.3)', borderRadius: '6px 6px 0 0' }} />
        <div style={{ ...mono(16, color.mute), marginTop: 8 }}>2024 BASELINE</div>
      </div>

      {/* 2026 Surging Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ ...mono(24, color.red), fontWeight: 800 }}>
          ${(28.92 + (269.92 - 28.92) * p).toFixed(2)}
        </div>
        <div style={{
          width: barW,
          height: h2026,
          background: color.red,
          borderRadius: '6px 6px 0 0',
          boxShadow: `0 0 24px rgba(230,57,70,${0.3 + 0.4 * p})`
        }} />
        <div style={{ ...mono(16, color.red), fontWeight: 700, marginTop: 8 }}>2026 CAPACITY SURGE</div>
      </div>

      {/* Bottom Floating Tag with Doodle Underline */}
      <div style={{ position: 'absolute', bottom: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ ...hand(32, color.red, 700) }}>+$29.4B data center load</span>
        {p > 0.3 && <DoodleUnderline x={-10} y={15} width={380} at={sf} color={color.red} />}
      </div>

      {/* Juice Burst on capacity surge */}
      {p > 0.4 && (
        <>
          <ImpactBurst cx={w / 2 + 115} cy={h / 2} at={sf} color={color.red} count={16} radius={210} />
          <FloatingPopScore text="+833% AUCTION SURGE!" cx={w / 2 + 115} cy={h / 2 - 130} at={sf} color={color.red} />
        </>
      )}
    </div>
  );
};
