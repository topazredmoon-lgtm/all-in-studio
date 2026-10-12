/**
 * Topic visuals: the underground of Chinese AI (china-ai-underground sample, 2026-10-11).
 * Owner on the ai-black-markets sample: "not dramatic enough ... no cinema soul at all ... this is not a presentation".
 * So this set is cinematic first: real photos edge to edge with a slow push-in and a graded look (Film), a CCTV frame for a
 * scene nobody filmed for us (Cctv, always tagged RECONSTRUCTION), a route that draws itself across a real map (RouteMap),
 * and the case-file grammar (an EXHIBIT tag, a red stamp) that carries the big claims as evidence, never as a title card.
 * Every element still lands on its cue word; text inside a picture stays at one or two words.
 */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Stamp, hand, prog, useBeat, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';
import { LAND, MAP, PLACES } from './cnai_map';

export { LineIcon, IconRow } from '../ds/kit';

type Box = { w: number; h: number };
type Cue = string | number | undefined;
type Mark = { x: number; y: number; rx?: number; ry?: number; at?: Cue; t?: string; side?: 'l' | 'r' };

const GRADE: Record<string, string> = {
  cold: 'saturate(0.6) contrast(1.12) brightness(0.74)',
  warm: 'saturate(0.75) contrast(1.1) brightness(0.78) sepia(0.12)',
  bw: 'grayscale(1) contrast(1.25) brightness(0.78)',
  neon: 'saturate(1.05) contrast(1.15) brightness(0.8)',
};

/** Case-file tag, top left: "EXHIBIT A". Slides in on its word. */
const ExhibitTag: React.FC<{ t: string; at?: Cue }> = ({ t, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const p = f <= 0 ? 1 : prog(frame, f, 8);
  if (frame < f) return null;
  return (
    <div style={{ position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <div style={{ width: 10, height: 44, background: color.red }} />
      <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 34, letterSpacing: '0.22em', color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>{t.toUpperCase()}</div>
    </div>
  );
};

/** Red ring that draws on around a point of the picture, with a short hand label beside it. Coordinates are 0..1 of the box. */
const Marker: React.FC<Box & { m: Mark }> = ({ w, h, m }) => {
  const frame = useCurrentFrame();
  const f = useCue(m.at, 0);
  if (frame < f) return null;
  const p = prog(frame, f, 12);
  const rx = (m.rx ?? 0.08) * w, ry = (m.ry ?? 0.1) * h, cx = m.x * w, cy = m.y * h;
  const right = (m.side ?? 'r') === 'r';
  return (
    <>
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={color.red} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
          style={{ filter: 'drop-shadow(0 0 8px rgba(230,57,70,0.6))' }} />
      </svg>
      {m.t && (
        <div style={{ position: 'absolute', top: cy - 30, ...(right ? { left: cx + rx + 22 } : { right: w - cx + rx + 22 }), ...hand(48, color.red, 800), whiteSpace: 'nowrap',
          opacity: prog(frame, f + 6, 8), textShadow: '0 2px 14px rgba(0,0,0,0.95)' }}>{m.t}</div>
      )}
    </>
  );
};

/** A real photo, edge to edge, graded, pushing in slowly (zoom z[0] -> z[1] over the cut, drift pan[] in % of the frame).
 *  Optional: an EXHIBIT tag, red rings with a one-word label, a red stamp, a small red tag (a number under its picture),
 *  and the photo credit in the corner (CC BY / BY-SA need it on screen or in the description; we do both). */
export const Film: React.FC<Box & {
  img: string; focus?: string; z?: [number, number]; pan?: [number, number]; grade?: string; credit?: string;
  marks?: Mark[]; stamp?: { t: string; at?: Cue; x?: number; y?: number; rot?: number }; exhibit?: { t: string; at?: Cue }; tag?: { t: string; at?: Cue };
}> = ({ w, h, img, focus = '50% 50%', z = [1.04, 1.13], pan = [0, 0], grade = 'cold', credit, marks = [], stamp, exhibit, tag }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeat();
  const t = Math.min(1, frame / Math.max(1, dur));
  const k = interpolate(t, [0, 1], z, { easing: Easing.inOut(Easing.quad) });
  const sf = useCue(stamp?.at, 0);
  const tf = useCue(tag?.at, 0);
  return (
    <AbsoluteFill style={{ width: w, height: h, overflow: 'hidden', background: '#000' }}>
      <Img src={staticFile(img)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transformOrigin: focus,
        transform: `scale(${k}) translate(${pan[0] * t}%, ${pan[1] * t}%)`, filter: GRADE[grade] ?? grade }} />
      {marks.map((m, i) => <Marker key={i} w={w} h={h} m={m} />)}
      {stamp && (
        <div style={{ position: 'absolute', left: (stamp.x ?? 0.5) * w, top: (stamp.y ?? 0.5) * h, transform: 'translate(-50%, -50%)' }}>
          <Stamp at={sf} text={stamp.t} rotate={stamp.rot ?? -8} px={w > 1200 ? 64 : 44} />
        </div>
      )}
      {tag && frame >= tf && (
        <div style={{ position: 'absolute', left: 110, bottom: 230, ...hand(54, color.red, 800), opacity: tf <= 0 ? 1 : prog(frame, tf, 8), textShadow: '0 2px 14px rgba(0,0,0,0.95)' }}>{tag.t}</div>
      )}
      {exhibit && <ExhibitTag t={exhibit.t} at={exhibit.at} />}
      {credit && <div style={{ position: 'absolute', right: 26, bottom: 18, fontFamily: font.mono, fontSize: 16, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>{credit}</div>}
    </AbsoluteFill>
  );
};

/** A server in line art (front view): drive bays, vents, a white serial label. `empty` draws it hollow (the dummy box). */
const Server: React.FC<{ x: number; y: number; s: number; label?: boolean; empty?: boolean; glow?: number }> = ({ x, y, s, label = true, empty, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={0} y={0} width={300} height={120} rx={8} fill={empty ? 'rgba(0,0,0,0.25)' : '#15130f'} stroke={empty ? color.red : '#cfd6cf'} strokeWidth={4} strokeDasharray={empty ? '14 10' : undefined} />
    {!empty && [0, 1, 2, 3].map((i) => <rect key={i} x={18 + i * 46} y={22} width={36} height={76} rx={4} fill="none" stroke="#cfd6cf" strokeWidth={3} />)}
    {!empty && [0, 1, 2, 3, 4].map((i) => <line key={i} x1={210} x2={282} y1={30 + i * 15} y2={30 + i * 15} stroke="#cfd6cf" strokeWidth={3} />)}
    {!empty && <circle cx={272} cy={104} r={5} fill={color.go} opacity={0.6 + 0.4 * glow} />}
    {label && <SerialLabel x={196} y={96} />}
  </g>
);
const SerialLabel: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-34} y={-16} width={68} height={32} rx={3} fill="#f4f1ea" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={-28 + i * 6.4} y={-11} width={i % 3 ? 2.5 : 4} height={16} fill="#111" />)}
  </g>
);
/** Hair dryer in line art, nozzle pointing right, heat waves while `heat` > 0. */
const Dryer: React.FC<{ x: number; y: number; s: number; heat: number; frame: number }> = ({ x, y, s, heat, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 40 C0 10 30 0 60 0 L150 12 L150 58 L60 70 C30 70 0 64 0 40 Z" fill="#15130f" stroke="#cfd6cf" strokeWidth={4} />
    <path d="M40 66 L58 150 L86 150 L80 66" fill="#15130f" stroke="#cfd6cf" strokeWidth={4} />
    <circle cx={42} cy={35} r={18} fill="none" stroke="#cfd6cf" strokeWidth={3} />
    {heat > 0 && [0, 1, 2].map((i) => {
      const o = ((frame * 2 + i * 14) % 42);
      return <path key={i} d={`M${160 + o} ${18 + i * 16} q 10 -8 20 0 t 20 0`} fill="none" stroke={color.red} strokeWidth={4} strokeLinecap="round" opacity={heat * (1 - o / 42)} />;
    })}
  </g>
);

/** The trick from the indictment, as a reconstruction: heat the serial label (heatAt), peel it off the real server (peelAt),
 *  stick it on the hollow dummy (stickAt). Then the real one slides away (goAt) and the dummy stays for the inspectors. */
export const LabelSwap: React.FC<Box & { heatAt?: Cue; peelAt?: Cue; stickAt?: Cue; goAt?: Cue; tags?: [string, string] }> = ({ w, h, heatAt, peelAt, stickAt, goAt, tags = ['real', 'dummy'] }) => {
  const frame = useCurrentFrame();
  const hf = useCue(heatAt, 0), pf = useCue(peelAt, 99999), sf2 = useCue(stickAt, 99999), gf = useCue(goAt, 99999);
  const heat = frame >= hf ? prog(frame, hf, 8) * (frame < sf2 ? 1 : Math.max(0, 1 - (frame - sf2) / 10)) : 0;
  const move = frame < pf ? 0 : interpolate(frame, [pf, Math.max(pf + 14, sf2)], [0, 1], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const go = frame < gf ? 0 : interpolate(frame, [gf, gf + 24], [0, 1], { extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const VW = 1000, VH = 560, k = Math.min(w / VW, h / VH);
  const ax = 130 + 196 * 1.0, ay = 230 + 96, bx = 560 + 196, by = 230 + 96; // label anchor on each box (box scale 1)
  const lx = ax + (bx - ax) * move, ly = ay + (by - ay) * move - Math.sin(move * Math.PI) * 120;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={VW * k} height={VH * k} viewBox={`0 0 ${VW} ${VH}`} style={{ overflow: 'visible' }}>
        <g opacity={1 - go} transform={`translate(${go * 700} 0)`}>
          <Server x={130} y={230} s={1} label={false} glow={(Math.sin(frame / 6) + 1) / 2} />
          <text x={280} y={400} textAnchor="middle" fill="#cfd6cf" style={{ fontFamily: font.mono, fontSize: 30, fontWeight: 700, letterSpacing: '0.18em' }}>{tags[0].toUpperCase()}</text>
        </g>
        <Server x={560} y={230} s={1} label={false} empty />
        <text x={710} y={400} textAnchor="middle" fill={color.red} style={{ fontFamily: font.mono, fontSize: 30, fontWeight: 700, letterSpacing: '0.18em' }}>{tags[1].toUpperCase()}</text>
        <SerialLabel x={lx} y={ly} r={move > 0 && move < 1 ? -12 * Math.sin(move * Math.PI) : 0} />
        <g opacity={frame < sf2 + 12 ? 1 : Math.max(0, 1 - (frame - sf2 - 12) / 10)}>
          <Dryer x={ax - 300 + (bx - ax) * move * 0.9} y={ay - 190} s={0.9} heat={heat} frame={frame} />
        </g>
      </svg>
    </div>
  );
};

/** Surveillance frame: a real photo of the kind of place, in CCTV grade, with REC, a running clock and the camera name.
 *  Always marked RECONSTRUCTION: it shows what the indictment describes, not the footage itself. Children draw on top. */
export const Cctv: React.FC<Box & { img: string; focus?: string; cam?: string; clock?: string; swap?: Record<string, Cue>; credit?: string; exhibit?: { t: string; at?: Cue } }> = ({ w, h, img, focus = '50% 50%', cam = 'CAM 04', clock = '02:17:09', swap, credit, exhibit }) => {
  const frame = useCurrentFrame();
  const [hh, mm, ss] = clock.split(':').map(Number);
  const tot = hh * 3600 + mm * 60 + ss + Math.floor(frame / 30);
  const t = `${String(Math.floor(tot / 3600) % 24).padStart(2, '0')}:${String(Math.floor(tot / 60) % 60).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
  const z = 1.02 + 0.03 * Math.min(1, frame / 240);
  return (
    <AbsoluteFill style={{ width: w, height: h, overflow: 'hidden', background: '#000' }}>
      <Img src={staticFile(img)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${z})`, filter: 'grayscale(1) contrast(1.3) brightness(0.62) blur(0.6px)' }} />
      <AbsoluteFill style={{ background: 'rgba(40,70,50,0.28)', mixBlendMode: 'color' }} />
      {swap && <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }}><LabelSwap w={w} h={h} {...(swap as any)} /></AbsoluteFill>}
      <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 2px, rgba(0,0,0,0) 2px 5px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 70, top: 56, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.mono, fontSize: 34, fontWeight: 700, color: '#e8efe8', letterSpacing: '0.12em' }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: color.red, opacity: Math.floor(frame / 15) % 2 ? 0.25 : 1 }} />REC
      </div>
      <div style={{ position: 'absolute', right: 70, top: 56, fontFamily: font.mono, fontSize: 34, fontWeight: 700, color: '#e8efe8', letterSpacing: '0.1em' }}>{cam} · {t}</div>
      <div style={{ position: 'absolute', left: 70, top: 108, fontFamily: font.mono, fontSize: 22, fontWeight: 700, color: color.red, letterSpacing: '0.24em' }}>RECONSTRUCTION</div>
      {exhibit && <div style={{ position: 'absolute', left: 0, top: 90 }}><ExhibitTag t={exhibit.t} at={exhibit.at} /></div>}
      {credit && <div style={{ position: 'absolute', right: 26, bottom: 18, fontFamily: font.mono, fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>{credit}</div>}
    </AbsoluteFill>
  );
};

/** A route that draws itself across the Pacific on a real map (Natural Earth, public domain). legs = [from, to, cue];
 *  each place lights up when its leg lands; a red block (the cargo) rides the newest leg; `blocked` = a place with a red ✕. */
export const RouteMap: React.FC<Box & { legs: [string, string, Cue][]; names?: Record<string, string>; blocked?: { p: string; at?: Cue }; zoom?: [number, number]; centre?: [number, number] }> = ({ w, h, legs, names = {}, blocked, zoom = [1, 1.06], centre = [0.5, 0.5] }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeat();
  const cues = legs.map((l) => useCue(l[2], 0)); // eslint-disable-line react-hooks/rules-of-hooks
  const bf = useCue(blocked?.at, 99999);
  const k0 = Math.min(w / MAP.w, h / MAP.h) * 0.98; // contain: the whole Pacific, US to China, always in frame
  const z = interpolate(frame, [0, Math.max(1, dur)], zoom, { extrapolateRight: 'clamp' });
  const arc = (a: [number, number], b: [number, number]) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return { c: [mx, my - d * 0.28] as [number, number], d: `M${a[0]} ${a[1]} Q${mx} ${my - d * 0.28} ${b[0]} ${b[1]}` };
  };
  const at = (a: [number, number], c: [number, number], b: [number, number], t: number) =>
    [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  const lit = new Set<string>();
  legs.forEach((l, i) => { if (frame >= cues[i]) { lit.add(l[0]); if (frame >= cues[i] + 18) lit.add(l[1]); } });
  const last = legs.map((l, i) => i).filter((i) => frame >= cues[i]).pop();
  return (
    <AbsoluteFill style={{ width: w, height: h, overflow: 'hidden', background: '#0b0a09' }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="rgba(233,227,211,0.10)" /></pattern>
        </defs>
        <g transform={`translate(${w * centre[0]} ${h * centre[1]}) scale(${k0 * z}) translate(${-MAP.w / 2} ${-MAP.h / 2})`}>
          <path d={LAND} fill="#221e19" stroke="rgba(233,227,211,0.55)" strokeWidth={1.6 / k0} />
          <path d={LAND} fill="url(#dots)" />
          {legs.map((l, i) => {
            const a = PLACES[l[0]], b = PLACES[l[1]];
            if (!a || !b || frame < cues[i]) return null;
            const p = interpolate(frame, [cues[i], cues[i] + 22], [0, 1], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
            const { c, d } = arc(a, b);
            const [cx, cy] = at(a, c, b, p);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={color.red} strokeWidth={4 / k0} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: 'drop-shadow(0 0 6px rgba(230,57,70,0.7))' }} />
                {i === last && <rect x={cx - 9 / k0} y={cy - 6 / k0} width={18 / k0} height={12 / k0} rx={2 / k0} fill={color.red} />}
              </g>
            );
          })}
          {Object.entries(PLACES).filter(([p]) => lit.has(p) || legs.some((l) => l[0] === p || l[1] === p)).map(([p, [x, y]]) => {
            const on = lit.has(p);
            return (
              <g key={p} opacity={on ? 1 : 0.35}>
                <circle cx={x} cy={y} r={(on ? 7 : 4) / k0} fill={on ? color.red : '#cfd6cf'} />
                {on && <circle cx={x} cy={y} r={(10 + (frame % 30)) / k0} fill="none" stroke={color.red} strokeWidth={2 / k0} opacity={1 - (frame % 30) / 30} />}
                {on && names[p] && <text x={x + 14 / k0} y={y - 12 / k0} fill="#f4f1ea" style={{ fontFamily: font.mono, fontSize: 36 / k0, fontWeight: 700, letterSpacing: "0.08em" }}>{names[p].toUpperCase()}</text>}
              </g>
            );
          })}
          {blocked && frame >= bf && PLACES[blocked.p] && (() => {
            const [x, y] = PLACES[blocked.p]; const p = prog(frame, bf, 8), r = 30 / k0;
            return <path d={`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`} stroke={color.red} strokeWidth={8 / k0} strokeLinecap="round" opacity={p} />;
          })()}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** A wall of profile tiles that fills the frame; from `at` they flip one after another to red "fake" tiles with a cross.
 *  `n` real tiles shown is a picture of scale, the number itself is a small red tag under it (set by the shot). */
export const AccountWall: React.FC<Box & { at?: Cue; cols?: number; rows?: number }> = ({ w, h, at, cols = 16, rows = 7 }) => {
  const frame = useCurrentFrame();
  const f0 = useCue(at, 0);
  const tw = w / cols, th = (h * 0.8) / rows, top = h * 0.1;
  return (
    <AbsoluteFill style={{ width: w, height: h, background: '#0b0a09' }}>
      <svg width={w} height={h}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const order = (c * 7 + r * 13) % (cols * rows); // scattered, not a wipe
          const t = frame - (f0 + order * 0.28);
          const fake = t > 0 ? Math.min(1, t / 6) : 0;
          const x = c * tw + tw / 2, y = top + r * th + th / 2, s = Math.min(tw, th) * 0.36;
          const col = fake > 0.5 ? color.red : '#B9BEC6';
          return (
            <g key={i} opacity={0.62 + 0.38 * fake}>
              <rect x={x - tw * 0.4} y={y - th * 0.4} width={tw * 0.8} height={th * 0.8} rx={8} fill="none" stroke={col} strokeWidth={2} />
              <circle cx={x} cy={y - s * 0.25} r={s * 0.36} fill="none" stroke={col} strokeWidth={3} />
              <path d={`M${x - s * 0.7} ${y + s * 0.85} C${x - s * 0.6} ${y + s * 0.3} ${x + s * 0.6} ${y + s * 0.3} ${x + s * 0.7} ${y + s * 0.85}`} fill="none" stroke={col} strokeWidth={3} strokeLinecap="round" />
              {fake > 0.5 && <path d={`M${x - s * 0.9} ${y - s * 0.9} L${x + s * 0.9} ${y + s * 0.9}`} stroke={color.red} strokeWidth={3} opacity={0.8} />}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
