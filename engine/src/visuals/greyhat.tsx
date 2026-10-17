/**
 * Topic visuals: GREYHAT AI (1-min sample h01-a04, 2026-10-14).
 * Bespoke plates only — no reuse from other films (owner rule: "say the line,
 * point at the thing it names"). All split-safe (700×640 sides, bare surface).
 * Picture-led: line art + at most 1-2 small mono words inside a plate.
 * Base outlines are visible at frame 0; only red details draw on after.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { mono, prog } from '../ds/core';
import { color } from '../ds/tokens';

export { LineIcon, IconRow, Loop, Copier, FieldCard } from '../ds/kit';

type Box = { w: number; h: number };
const INK = color.ink;
const MUTE = color.mute;
const RED = color.red;

/** Thin chalk frame shared by plates that need a boundary. */
const Frame: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => (
  <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
    <svg width={w} height={h} style={{ position: 'absolute', overflow: 'visible' }}>
      <rect x={8} y={8} width={w - 16} height={h - 16} rx={10} fill="none" stroke={color.hairStrong} strokeWidth={1.5} />
      {children}
    </svg>
  </div>
);

/** h01 L — one typed line bending a huge machine. Chat box up top, robot below, bent arrow. */
export const OneSentence: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const bend = prog(frame, 6, 22);
  const cx = w / 2;
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* chat box */}
        <rect x={cx - 240} y={30} width={480} height={130} rx={14} fill={color.raised} stroke={INK} strokeWidth={2.5} />
        <rect x={cx - 210} y={62} width={300} height={16} rx={8} fill={INK} opacity={0.9} />
        <rect x={cx - 210} y={90} width={180} height={16} rx={8} fill={MUTE} opacity={0.7} />
        <rect x={cx - 210 + 196 * bend} y={90} width={14} height={26} fill={RED} />
        {/* bent arrow from chat to machine */}
        <path d={`M${cx + 180} 160 C ${cx + 220} 240, ${cx + 120} 260, ${cx + 40} 320`} fill="none" stroke={RED} strokeWidth={3.5} strokeDasharray="10 7" opacity={0.35 + 0.65 * bend} />
        <polygon points={`${cx + 40},${320} ${cx + 22},${300} ${cx + 58},${298}`} fill={RED} opacity={bend} />
        {/* machine head */}
        <rect x={cx - 150} y={320} width={300} height={170} rx={22} fill="#14181F" stroke={INK} strokeWidth={3} />
        <circle cx={cx - 70} cy={395} r={22} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={cx + 70} cy={395} r={22} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={cx - 70} cy={395} r={7} fill={RED} opacity={bend} />
        <circle cx={cx + 70} cy={395} r={7} fill={RED} opacity={bend} />
        <rect x={cx - 90} y={440} width={180} height={14} rx={7} fill={MUTE} opacity={0.6} />
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 2, ...mono(17, MUTE) }}>CHAT BOX</div>
      <div style={{ position: 'absolute', right: 28, bottom: 14, ...mono(17, MUTE) }}>BIG MACHINE</div>
    </div>
  );
};

/** h01 R / h02 L — a lock and a key, both forged from letters. */
export const SameMetal: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, 6, 18);
  const cx = w / 2;
  const cy = h / 2 + 20;
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* lock body */}
        <path d={`M${cx - 220} ${cy - 40} A70 70 0 0 1 ${cx - 80} ${cy - 40}`} fill="none" stroke={INK} strokeWidth={10} />
        <rect x={cx - 235} y={cy - 40} width={170} height={150} rx={16} fill={color.raised} stroke={INK} strokeWidth={3} />
        <circle cx={cx - 150} cy={cy + 20} r={18} fill="none" stroke={RED} strokeWidth={4} opacity={0.4 + 0.6 * p} />
        <line x1={cx - 150} y1={cy + 38} x2={cx - 150} y2={cy + 70} stroke={RED} strokeWidth={4} opacity={p} />
        {/* key */}
        <circle cx={cx + 130} cy={cy - 30} r={52} fill="none" stroke={INK} strokeWidth={9} />
        <line x1={cx + 130} y1={cy + 22} x2={cx + 130} y2={cy + 130} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <line x1={cx + 130} y1={cy + 80} x2={cx + 172} y2={cy + 80} stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={0.35 + 0.65 * p} />
        <line x1={cx + 130} y1={cy + 110} x2={cx + 165} y2={cy + 110} stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={p} />
        {/* letter grain on both */}
        <text x={cx - 235} y={cy + 130} fill={MUTE} opacity={0.55} style={{ ...mono(20, MUTE) }}>Aa Aa Aa</text>
        <text x={cx + 60} y={cy - 100} fill={MUTE} opacity={0.55} style={{ ...mono(20, MUTE) }}>Aa Aa</text>
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 16, ...mono(17, MUTE) }}>LOCK</div>
      <div style={{ position: 'absolute', right: 28, top: 16, ...mono(17, MUTE) }}>KEY</div>
    </div>
  );
};

/** h03 L — one lit road forking into a grey (published) and a dark (black) road. */
export const GreyBlackMap: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, 8, 20);
  const cx = w / 2;
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* trunk */}
        <line x1={cx} y1={h - 40} x2={cx} y2={h * 0.52} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <line x1={cx} y1={h - 40} x2={cx} y2={h * 0.52} stroke={MUTE} strokeWidth={2} strokeDasharray="12 14" />
        {/* grey branch (left, lit) */}
        <path d={`M${cx} ${h * 0.52} C ${cx - 40} ${h * 0.38}, ${cx - 150} ${h * 0.32}, ${cx - 190} ${h * 0.18}`} fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
        {/* black branch (right, dark) */}
        <path d={`M${cx} ${h * 0.52} C ${cx + 40} ${h * 0.38}, ${cx + 150} ${h * 0.32}, ${cx + 190} ${h * 0.18}`} fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={0.35 + 0.65 * p} />
        {/* published paper at grey end */}
        <g transform={`translate(${cx - 230} ${h * 0.10})`}>
          <rect x={0} y={0} width={90} height={110} fill={color.paper} rx={3} />
          <line x1={14} y1={26} x2={76} y2={26} stroke={color.paperInk} strokeWidth={5} />
          <line x1={14} y1={46} x2={76} y2={46} stroke={color.paperMute} strokeWidth={5} />
          <line x1={14} y1={66} x2={56} y2={66} stroke={color.paperMute} strokeWidth={5} />
        </g>
        {/* dark chair at black end */}
        <g transform={`translate(${cx + 140} ${h * 0.10})`} opacity={p}>
          <rect x={0} y={0} width={90} height={110} rx={8} fill="#0A0908" stroke={RED} strokeWidth={3} strokeDasharray="7 6" />
          <text x={45} y={66} textAnchor="middle" fill={RED} style={{ ...mono(40, RED) }}>?</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 40, top: 16, ...mono(17, MUTE) }}>GREY · PUBLISHED</div>
      <div style={{ position: 'absolute', right: 40, top: 16, ...mono(17, RED) }}>BLACK</div>
    </div>
  );
};

/** h03 R / a01 — a letter dissolving into uniform tokens on a conveyor. */
export const TokenStream: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const cy = h / 2;
  const chips = ['to', 'kens', 'pie', 'ces'];
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* conveyor */}
        <line x1={30} y1={cy + 110} x2={w - 30} y2={cy + 110} stroke={INK} strokeWidth={4} />
        {[60, 160, 260, 360, 460, 560].map((x) => (
          <line key={x} x1={x} y1={cy + 110} x2={x} y2={cy + 134} stroke={MUTE} strokeWidth={3} />
        ))}
        {/* source letter */}
        <text x={70} y={cy - 60} fill={INK} opacity={0.9} style={{ fontFamily: 'AllinSerif, Georgia, serif', fontSize: 120, fontWeight: 700 }}>A</text>
        <path d="M150 200 C 200 220, 220 240, 250 270" fill="none" stroke={MUTE} strokeWidth={2.5} strokeDasharray="6 6" />
        {/* token chips */}
        {chips.map((t, i) => {
          const x = 270 + i * 100;
          const pop = prog(frame, 4 + i * 5, 10);
          return (
            <g key={t} transform={`translate(${x} ${cy - 30})`} opacity={0.25 + 0.75 * pop}>
              <rect x={0} y={0} width={88} height={64} rx={10} fill={color.raised} stroke={i === 1 ? RED : INK} strokeWidth={i === 1 ? 3 : 2} />
              <text x={44} y={42} textAnchor="middle" fill={i === 1 ? RED : INK} style={{ ...mono(24, i === 1 ? RED : INK) }}>{t}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 16, ...mono(17, MUTE) }}>LETTER IN</div>
      <div style={{ position: 'absolute', right: 28, top: 16, ...mono(17, MUTE) }}>TOKENS OUT</div>
    </div>
  );
};

/** a02 L / a03 L — your request, its rules and a fetched page pouring into ONE pipe. */
export const OnePipe: React.FC<Box> = ({ w, h }) => {
  const cx = w / 2;
  const inlets = [
    { label: 'you', x: cx - 200 },
    { label: 'rules', x: cx },
    { label: 'web', x: cx + 200 },
  ];
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {inlets.map((n) => (
          <g key={n.label}>
            <line x1={n.x} y1={70} x2={n.x} y2={210} stroke={INK} strokeWidth={10} />
            <rect x={n.x - 78} y={30} width={156} height={52} rx={9} fill={color.raised} stroke={INK} strokeWidth={2} />
            <text x={n.x} y={63} textAnchor="middle" fill={MUTE} style={{ ...mono(20, MUTE) }}>{n.label}</text>
            <path d={`M${n.x} 210 C ${n.x} 260, ${cx} 260, ${cx} 310`} fill="none" stroke={n.label === 'web' ? RED : MUTE} strokeWidth={5} />
          </g>
        ))}
        {/* the one pipe */}
        <rect x={cx - 85} y={310} width={170} height={200} rx={20} fill="#14181F" stroke={INK} strokeWidth={4} />
        <line x1={cx - 40} y1={340} x2={cx - 40} y2={480} stroke={MUTE} strokeWidth={3} strokeDasharray="8 10" />
        <line x1={cx + 40} y1={340} x2={cx + 40} y2={480} stroke={MUTE} strokeWidth={3} strokeDasharray="8 10" />
        {/* no divider: explicit gap marker crossed out */}
        <line x1={cx - 85} y1={410} x2={cx + 85} y2={410} stroke={RED} strokeWidth={3} strokeDasharray="10 8" />
        <line x1={cx - 40} y1={392} x2={cx + 40} y2={428} stroke={RED} strokeWidth={4} />
      </svg>
      <div style={{ position: 'absolute', left: 28, bottom: 14, ...mono(17, MUTE) }}>ONE STREAM · NO DIVIDER</div>
    </div>
  );
};

/** h02 R / a03 R — the instruction/data wall as glass with one hairline crack. */
export const CrackedGlass: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, 8, 20);
  return (
    <Frame w={w} h={h}>
      <line x1={80} y1={60} x2={w - 80} y2={60} stroke={MUTE} strokeWidth={2} />
      <text x={100} y={110} fill={MUTE} style={{ ...mono(22, MUTE) }}>ORDERS</text>
      <text x={w - 100} y={h - 70} textAnchor="end" fill={MUTE} style={{ ...mono(22, MUTE) }}>FOUND TEXT</text>
      {/* hairline crack */}
      <polyline
        points={`140,90 210,170 190,240 260,320 240,400 310,${h - 110}`}
        fill="none" stroke={RED} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
      />
      <circle cx={310} cy={h - 110} r={10} fill={RED} opacity={p} />
    </Frame>
  );
};

/** a02 R / a04 L — a page with a line only the machine's eye sees. No payload text rendered. */
export const HiddenLine: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const ray = prog(frame, 8, 18);
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* document */}
        <rect x={60} y={50} width={300} height={h - 120} rx={6} fill={color.paper} />
        {[0, 1, 2, 3, 5, 6].map((i) => (
          <line key={i} x1={90} y1={110 + i * 44} x2={330} y2={110 + i * 44} stroke={color.paperMute} strokeWidth={7} strokeLinecap="round" />
        ))}
        {/* hidden line: dashed, machine-visible */}
        <line x1={90} y1={110 + 4 * 44} x2={330} y2={110 + 4 * 44} stroke={RED} strokeWidth={7} strokeDasharray="12 9" strokeLinecap="round" opacity={0.35 + 0.65 * ray} />
        {/* machine eye */}
        <g transform={`translate(${w - 170} 150)`}>
          <path d="M-90 0 Q0 -62 90 0 Q0 62 -90 0 Z" fill="none" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={0} r={9} fill={RED} opacity={0.4 + 0.6 * ray} />
        </g>
        <line x1={w - 170} y1={200} x2={330} y2={110 + 4 * 44} stroke={RED} strokeWidth={2.5} strokeDasharray="7 7" opacity={ray} />
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 16, ...mono(17, MUTE) }}>PAGE YOU SEE</div>
      <div style={{ position: 'absolute', right: 28, top: 16, ...mono(17, RED) }}>LINE IT SEES</div>
    </div>
  );
};

/** a04 R — a sealed email radiating in an inbox. No hand, no click. */
export const ZeroClick: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const cx = w / 2;
  const cy = h / 2 + 30;
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.12);
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* inbox tray */}
        <rect x={cx - 250} y={cy - 130} width={500} height={300} rx={18} fill={color.raised} stroke={INK} strokeWidth={3} />
        {/* sealed envelope */}
        <rect x={cx - 130} y={cy - 70} width={260} height={150} rx={10} fill="#1B222C" stroke={INK} strokeWidth={3} />
        <path d={`M${cx - 130} ${cy - 70} L${cx} ${cy + 20} L${cx + 130} ${cy - 70}`} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={cx} cy={cy + 20} r={12} fill={RED} opacity={0.55 + 0.45 * pulse} />
        {/* radiating rings */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={cx} cy={cy + 5} rx={170 + i * 45 + pulse * 10} ry={110 + i * 32 + pulse * 8} fill="none" stroke={RED} strokeWidth={2.5} strokeDasharray="9 10" opacity={0.75 - i * 0.22} />
        ))}
        {/* crossed-out cursor: no click */}
        <g transform={`translate(${cx + 190} ${cy + 120})`}>
          <path d="M0 -34 L0 22 L12 8 L20 30 L30 25 L22 4 L36 4 Z" fill={INK} stroke="#000" strokeWidth={2.5} />
          <line x1={-16} y1={-16} x2={44} y2={36} stroke={RED} strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 16, ...mono(17, MUTE) }}>SEALED · UNOPENED</div>
      <div style={{ position: 'absolute', right: 28, bottom: 14, ...mono(17, RED) }}>NO CLICK NEEDED</div>
    </div>
  );
};
