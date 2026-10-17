/**
 * Topic visuals: THE GHOST ARMY (The Invisible Humans Behind AI).
 * Directorial alignment to the master benchmark: All-in_captchas_full_v2.mp4.
 *
 * Invariants & Visual DNA:
 * - Authentic Captchas v2 layout geometry (700x640 split panels, cards sized 540-640px)
 * - Authentic Google White cards with #B5121B red top border, drop shadow, and crisp typography
 * - Authentic cream paper receipts with paper.png blend, dashed dividers, monospace data, and physical tilt
 * - Authentic dial gauges (Score), wobbly mouse paths (MousePath), and bounding boxes on real photos (Labels)
 * - ZERO amateur SVG stick figures, ZERO toy cars, ZERO crude doodles
 * - Strict text discipline: big bold titles, figures, and stamps; ZERO text walls or paragraphs
 */
import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Ring, Stamp, hand, mono, prog, serif, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';
import { Highlighter } from '../ds/evidence';

export { LineIcon, IconRow, Count, CalendarCard, Bubble, Bars, Polaroid, Word } from '../ds/kit';

type Box = { w: number; h: number };

// Captchas standard UI color tokens
const ui = {
  white: '#FFFFFF',
  line: '#DFDFDF',
  text: '#222222',
  blue: '#1A73E8',
  icon: '#555555',
  check: '#009E55',
  redAccent: '#B5121B',
  darkBg: '#161B22',
  chalkBorder: '#2B313A',
};

const cursorPath = 'M3 3 L3 44 L13 34 L22 52 L29 49 L20 31 L35 31 Z';

// Authentic reCAPTCHA warped text with fractal noise displacement
const WarpedText: React.FC<{ word: string; id: string; px?: number; w: number; color?: string }> = ({
  word,
  id,
  px = 64,
  w,
  color: txtColor = ui.text,
}) => (
  <svg width={w} height={px * 1.5} style={{ overflow: 'visible' }}>
    <defs>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves={2} seed={7} />
        <feDisplacementMap in="SourceGraphic" scale={px * 0.28} />
      </filter>
    </defs>
    <line
      x1={12}
      y1={px * 0.9}
      x2={w - 12}
      y2={px * 0.74}
      stroke={txtColor}
      strokeWidth={3}
      filter={`url(#${id})`}
    />
    <text
      x={w / 2}
      y={px * 1.05}
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontStyle="italic"
      fontSize={px}
      fill={txtColor}
      filter={`url(#${id})`}
    >
      {word}
    </text>
  </svg>
);

// ============================================================================
// BEAT 1 (h01): THE FANTASY OF AUTONOMY
// ============================================================================

/** Cut 0 Left: Authentic reCAPTCHA autonomous checkbox card */
export const AutonomousCheckbox: React.FC<Box & { pulseAt?: string | number }> = ({
  w,
  h,
  pulseAt = 'autonomous',
}) => {
  const frame = useCurrentFrame();
  const cf = useCue(pulseAt, 16);
  const bw = Math.min(w - 40, 620);
  const p = prog(frame, cf - 16, 16);
  const done = frame >= cf;

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          background: ui.white,
          borderRadius: 6,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          borderTop: `10px solid ${ui.redAccent}`,
          padding: '28px 32px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Checkbox item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 58,
                height: 58,
                border: `3px solid ${done ? ui.check : '#C1C1C1'}`,
                borderRadius: 4,
                background: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {done && (
                <svg width={50} height={50} viewBox="0 0 66 66">
                  <path
                    d="M12 34 L27 49 L56 14"
                    stroke={ui.check}
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - prog(frame, cf, 7)}
                  />
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: 26, fontWeight: 700, color: ui.text }}>
                I am an autonomous intelligence
              </div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, color: '#666', marginTop: 4 }}>
                Frontier neural reasoning model
              </div>
            </div>
          </div>

          {/* reCAPTCHA style logo badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.85 }}>
            <svg width={42} height={42} viewBox="0 0 48 48">
              <path
                d="M24 4 C14 4 6 12 6 22 C6 27 8 31 12 34 L12 40 L18 36 C20 37 22 38 24 38 C34 38 42 30 42 20 C42 10 34 4 24 4 Z"
                fill="none"
                stroke={ui.blue}
                strokeWidth={3.5}
              />
              <circle cx={17} cy={20} r={3} fill={ui.blue} />
              <circle cx={24} cy={20} r={3} fill={ui.blue} />
              <circle cx={31} cy={20} r={3} fill={ui.blue} />
            </svg>
            <span style={{ fontFamily: 'Arial', fontSize: 11, color: '#888', marginTop: 4, letterSpacing: '0.04em' }}>
              reCAPTCHA AI
            </span>
          </div>
        </div>

        {/* Input box row */}
        <div
          style={{
            marginTop: 22,
            height: 54,
            border: `2px solid ${ui.line}`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#999',
          }}
        >
          <span>Type the prompt:</span>
          <span style={{ color: ui.blue, marginLeft: 8, opacity: frame % 20 < 12 ? 1 : 0 }}>|</span>
        </div>

        {/* Hovering / clicking cursor */}
        <svg
          width={44}
          height={56}
          viewBox="0 0 44 56"
          style={{
            position: 'absolute',
            left: 58 + 260 * (1 - p),
            top: 50 + 160 * (1 - p),
            transform: `scale(${frame >= cf && frame < cf + 6 ? 0.9 : 1})`,
            pointerEvents: 'none',
          }}
        >
          <path d={cursorPath} fill="#fff" stroke="#000" strokeWidth={2.5} />
        </svg>

        {/* Ring on cue */}
        {done && <Ring at={cf} w={bw - 20} h={150} c={color.red} stroke={6} />}
      </div>
    </div>
  );
};

/** Cut 0 Right: Autonomy Dial Score (Captchas Score DNA) */
export const AutonomyScore: React.FC<Box & { dropAt?: string | number }> = ({
  w,
  h,
  dropAt = 'autonomous',
}) => {
  const frame = useCurrentFrame();
  const df = useCue(dropAt, 16);
  const p = prog(frame, df, 18);
  const v = 1.0 - 1.0 * p; // drops from 1.0 to 0.0

  const r = Math.min(w / 2 - 40, h - 160);
  const cx = w / 2, cy = h / 2 + r / 2 - 15;
  const ang = Math.PI * (1 - v);

  const arc = (a0: number, a1: number) =>
    `M${cx + r * Math.cos(Math.PI * (1 - a0))} ${cy - r * Math.sin(Math.PI * (1 - a0))} A${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * (1 - a1))} ${cy - r * Math.sin(Math.PI * (1 - a1))}`;

  return (
    <div style={{ width: w, height: h, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={w} height={h}>
        <path d={arc(0, 1)} fill="none" stroke={color.raised2} strokeWidth={26} strokeLinecap="round" />
        <path d={arc(0, 0.3)} fill="none" stroke={color.red} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <path d={arc(0.7, 1)} fill="none" stroke={color.go} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <line
          x1={cx}
          y1={cy}
          x2={cx + (r - 28) * Math.cos(ang)}
          y2={cy - (r - 28) * Math.sin(ang)}
          stroke={color.ink}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={14} fill={color.ink} />
      </svg>
      <div style={{ position: 'absolute', left: cx - r - 40, top: cy + 30, ...mono(24, color.red) }}>
        0.0 OVERRIDE
      </div>
      <div style={{ position: 'absolute', left: cx + r - 120, top: cy + 30, ...mono(24, color.go) }}>
        1.0 AUTONOMY
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy - r * 0.55,
          textAlign: 'center',
          fontFamily: font.mono,
          fontWeight: 700,
          fontSize: 72,
          color: color.ink,
        }}
      >
        {v.toFixed(1)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy + 90,
          textAlign: 'center',
          ...hand(54, color.red, 700),
          opacity: prog(frame, df + 8, 10),
        }}
      >
        marketing myth
      </div>
    </div>
  );
};

/** Cut 1 Left: TwoWords Reasoning (Captchas TwoWords signature) */
export const TwoWordsReasoning: React.FC<Box & { ringAt?: string | number }> = ({
  w,
  h,
  ringAt = 'decides',
}) => {
  const frame = useCurrentFrame();
  const rf = useCue(ringAt, 20);
  const ww = Math.min(270, (w - 100) / 2);
  const bw = Math.min(w - 40, 620);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          background: ui.white,
          borderRadius: 6,
          padding: '26px 30px',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          borderTop: `10px solid ${ui.redAccent}`,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', gap: 20, background: '#F4F4F4', padding: '12px 14px', borderRadius: 4, justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <WarpedText word="thinks" id="tw-thinks" w={ww} px={56} />
          </div>
          <div style={{ position: 'relative' }}>
            <WarpedText word="decides" id="tw-decides" w={ww} px={56} />
            <Ring at={rf} w={ww} h={84} c={color.red} stroke={6} />
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            height: 52,
            border: `2px solid ${ui.line}`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#999',
          }}
        >
          Type the two words:
        </div>
        <div
          style={{
            marginTop: 22,
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            fontFamily: font.mono,
            fontSize: 24,
            color: color.mute,
            letterSpacing: '0.12em',
          }}
        >
          <span>AUTONOMOUS</span>
          <span style={{ color: color.red, fontWeight: 700 }}>REASONING</span>
        </div>
      </div>
    </div>
  );
};

/** Cut 1 Right: Mouse Intervention Trajectory (Captchas MousePath DNA) */
export const MouseIntervention: React.FC<Box & { clickAt?: string | number }> = ({
  w,
  h,
  clickAt = 'hands',
}) => {
  const frame = useCurrentFrame();
  const cf = useCue(clickAt, 20);
  const DW = 640, DH = 440;
  const k = Math.min(w / DW, h / DH);

  const human = 'M60 380 C150 350 180 230 280 260 C360 280 340 160 440 150 C500 145 530 220 570 230';
  const bot = 'M60 380 L570 230';

  const hp = prog(frame, cf - 24, 24);
  const bp = prog(frame, 0, 16);

  // Sample cursor position along the curve
  const cx = 60 + (570 - 60) * hp;
  const cy = 380 + (230 - 380) * hp - Math.sin(hp * Math.PI) * 70;

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={DW * k} height={DH * k} viewBox={`0 0 ${DW} ${DH}`} style={{ overflow: 'visible' }}>
        {/* Destination checkbox button */}
        <rect x={560} y={200} width={70} height={60} rx={6} fill={ui.white} />
        <rect x={575} y={215} width={30} height={30} rx={3} fill="none" stroke="#C1C1C1" strokeWidth={3} />
        {frame >= cf && (
          <path
            d="M580 230 L588 238 L600 222"
            stroke={ui.check}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Bot straight path (dashed) */}
        <path d={bot} fill="none" stroke={color.mute} strokeWidth={4} strokeDasharray="12 10" opacity={0.6} />

        {/* Human wobbly path in red */}
        <path
          d={human}
          fill="none"
          stroke={color.red}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - hp}
        />

        {/* Pause points */}
        {[[280, 260], [440, 150]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={10} fill="none" stroke={color.ink} strokeWidth={3} opacity={hp > (i + 1) / 3 ? 1 : 0} />
        ))}

        {/* Animated cursor riding the human path */}
        <g transform={`translate(${cx - 4} ${cy - 4}) scale(1.3)`}>
          <path d={cursorPath} fill="#fff" stroke="#000" strokeWidth={2.5} />
        </g>
      </svg>
      <div style={{ ...mono(22, color.mute), letterSpacing: '0.08em', marginTop: 12 }}>
        HUMAN OPERATOR DETECTED
      </div>
    </div>
  );
};

// ============================================================================
// BEAT 2 (a02): THE GHOST ARMY
// ============================================================================

/** Cut 0 Left: The 1770 Mechanical Turk CalendarCard */
export const TurkCalendarCard: React.FC<Box> = ({ w, h }) => {
  const bw = Math.min(w - 40, 520);
  const bh = Math.min(h - 40, 480);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          height: bh,
          background: color.raised,
          border: `1.5px solid ${color.hairStrong}`,
          borderRadius: 10,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          padding: '36px 40px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header with red indicator dot */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: color.red }} />
          <div style={{ fontFamily: font.mono, fontSize: 18, color: color.mute }}>×</div>
        </div>

        {/* Year & Name */}
        <div>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 110, color: color.ink, lineHeight: 1 }}>
            1770
          </div>
          <div style={{ fontFamily: font.mono, fontWeight: 600, fontSize: 24, color: color.red, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 14 }}>
            THE MECHANICAL TURK
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 18, color: color.mute, marginTop: 6 }}>
            Chess automaton illusion
          </div>
        </div>

        {/* 3x3 dot matrix */}
        <div style={{ display: 'flex', gap: 10 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === 4 ? color.red : color.mute, opacity: 0.6 }} />
          ))}
        </div>
      </div>
      <div style={{ ...mono(20, color.mute), marginTop: 16, letterSpacing: '0.04em' }}>
        wolfgang von kempelen · vienna 1770
      </div>
    </div>
  );
};

/** Cut 0 Right: Machine Disappears TwoWords Card with Redaction */
export const MachineDisappearsTwoWords: React.FC<Box & { strikeAt?: string | number }> = ({
  w,
  h,
  strikeAt = 'disappears',
}) => {
  const frame = useCurrentFrame();
  const sf = useCue(strikeAt, 16);
  const bw = Math.min(w - 40, 580);
  const done = frame >= sf;

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          background: ui.white,
          borderRadius: 6,
          padding: '30px 34px',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          borderTop: `10px solid ${ui.redAccent}`,
          position: 'relative',
        }}
      >
        <div style={{ background: '#F4F4F4', padding: '16px 20px', borderRadius: 4, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <WarpedText word="automaton" id="tw-turk" w={320} px={60} />
          {/* Black redaction bar slams across */}
          {done && (
            <div
              style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                top: '42%',
                height: 18,
                background: '#111',
                transform: 'rotate(-2deg)',
              }}
            />
          )}
        </div>

        <div
          style={{
            marginTop: 20,
            height: 52,
            border: `2px solid ${ui.line}`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#999',
          }}
        >
          Type the text:
        </div>

        {/* Question mark badge */}
        {done && (
          <svg
            width={64}
            height={64}
            viewBox="0 0 40 40"
            style={{
              position: 'absolute',
              right: -18,
              top: -24,
              transform: `scale(${1.2 - 0.2 * prog(frame, sf, 6)})`,
            }}
          >
            <circle cx={20} cy={20} r={18} fill={color.red} />
            <text x={20} y={28} textAnchor="middle" fontFamily={font.hand} fontWeight={800} fontSize={24} fill="#fff">
              ?
            </text>
          </svg>
        )}
      </div>

      <div
        style={{
          ...hand(52, color.red, 700),
          marginTop: 20,
          opacity: prog(frame, sf, 8),
        }}
      >
        human hidden inside
      </div>
    </div>
  );
};

/** Cut 1 Left: Workers Count Card with Clean Picto Row */
export const WorkersCountCard: React.FC<Box> = ({ w, h }) => {
  const bw = Math.min(w - 40, 540);
  const bh = Math.min(h - 40, 480);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          height: bh,
          background: color.raised,
          border: `1.5px solid ${color.hairStrong}`,
          borderRadius: 10,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          padding: '36px 40px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: color.red }} />
          <div style={{ ...mono(18, color.mute) }}>GLOBAL AUDIT</div>
        </div>

        <div>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 88, color: color.ink, lineHeight: 1 }}>
            500,000+
          </div>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 24, color: color.red, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 14 }}>
            OUTSOURCED WORKERS
          </div>
        </div>

        {/* Clean minimalist person line icons (pure stroke art, no doodles) */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <svg key={i} width={36} height={50} viewBox="0 0 36 50">
              <circle cx={18} cy={10} r={7} fill="none" stroke={i < 3 ? color.red : color.ink} strokeWidth={2.5} />
              <path d="M6 46 L6 28 C6 22 30 22 30 28 L30 46" fill="none" stroke={i < 3 ? color.red : color.ink} strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          ))}
        </div>
      </div>
      <div style={{ ...mono(20, color.mute), marginTop: 16, letterSpacing: '0.04em' }}>
        shadow workforce · global data labeling
      </div>
    </div>
  );
};

/** Cut 1 Right: Global Labor Receipt (Captchas Receipt DNA) */
export const GlobalLaborReceipt: React.FC<Box & { highlightAt?: string | number; stampAt?: string | number }> = ({
  w,
  h,
  highlightAt = 'Nairobi',
  stampAt = 'Manila',
}) => {
  const sf = useCue(stampAt, 24);
  const rw = Math.min(w - 40, 560);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: rw,
          background: color.paper,
          backgroundImage: `url(${staticFile('paper.png')})`,
          backgroundBlendMode: 'multiply',
          padding: '36px 40px 48px',
          boxSizing: 'border-box',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          transform: 'rotate(-1.5deg)',
          fontFamily: font.mono,
          color: color.paperInk,
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, letterSpacing: '0.14em' }}>
          OFFSHORE HUBS
        </div>
        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '22px 0 24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 26 }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            <Highlighter w={rw - 80} h={34} at={highlightAt} />
            <span style={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>NAIROBI</span>
            <span style={{ color: color.paperMute, position: 'relative', zIndex: 1 }}>KENYA</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>CARACAS</span>
            <span style={{ color: color.paperMute }}>VENEZUELA</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>MANILA</span>
            <span style={{ color: color.paperMute }}>PHILIPPINES</span>
          </div>
        </div>

        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '24px 0 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 70 }}>
          <span style={{ color: color.paperMute, fontSize: 22 }}>LABOR ARBITRAGE</span>
          <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
            <Stamp at={sf} text="OFFSHORED" c={color.redDeep} px={36} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BEAT 3 (a03): THE HUMAN COST
// ============================================================================

/** Cut 0 Left: Authentic Bounding Box Annotation on Real Photo (Captchas Labels DNA) */
export const AnnotationLabels: React.FC<Box & { drawAt?: string | number }> = ({
  w,
  h,
  drawAt = 'drawing',
}) => {
  const frame = useCurrentFrame();
  const df = useCue(drawAt, 16);
  const p = prog(frame, df, 12);
  const bw = Math.min(w - 40, 620);
  const bh = Math.min(h - 80, 440);

  // Box coordinates inside the frame
  const b1 = { x: 0.12, y: 0.18, w: 0.36, h: 0.62 };
  const b2 = { x: 0.58, y: 0.30, w: 0.32, h: 0.52 };

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          height: bh,
          position: 'relative',
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          background: '#000',
        }}
      >
        <Img
          src={staticFile('captchas/traffic_1.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85)' }}
        />

        {/* Box 1: Pedestrian / Obstacle */}
        <div
          style={{
            position: 'absolute',
            left: b1.x * bw,
            top: b1.y * bh,
            width: b1.w * bw,
            height: b1.h * bh,
            border: `4px solid ${color.red}`,
            opacity: p,
            transform: `scale(${1.06 - 0.06 * p})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -4,
              top: -36,
              background: color.red,
              color: '#fff',
              fontFamily: font.mono,
              fontWeight: 700,
              fontSize: 20,
              padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            OBJECT #1: PEDESTRIAN
          </div>
        </div>

        {/* Box 2: Traffic Light */}
        <div
          style={{
            position: 'absolute',
            left: b2.x * bw,
            top: b2.y * bh,
            width: b2.w * bw,
            height: b2.h * bh,
            border: `4px solid ${color.red}`,
            opacity: p,
            transform: `scale(${1.06 - 0.06 * p})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -4,
              top: -36,
              background: color.red,
              color: '#fff',
              fontFamily: font.mono,
              fontWeight: 700,
              fontSize: 20,
              padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            OBJECT #2: SIGNAL
          </div>
        </div>

        {/* Cursor drawing the box */}
        <svg
          width={40}
          height={52}
          viewBox="0 0 44 56"
          style={{
            position: 'absolute',
            left: (b1.x + b1.w * p) * bw - 4,
            top: (b1.y + b1.h * p) * bh - 4,
            pointerEvents: 'none',
          }}
        >
          <path d={cursorPath} fill="#fff" stroke="#000" strokeWidth={2.5} />
        </svg>
      </div>
      <div style={{ ...mono(20, color.mute), marginTop: 14, letterSpacing: '0.04em' }}>
        training data annotation task · 2026
      </div>
    </div>
  );
};

/** Cut 0 Right: Contractor Payslip Receipt (Captchas Receipt DNA) */
export const ContractorPayslip: React.FC<Box & { stampAt?: string | number }> = ({
  w,
  h,
  stampAt = 'hour',
}) => {
  const sf = useCue(stampAt, 16);
  const rw = Math.min(w - 40, 560);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: rw,
          background: color.paper,
          backgroundImage: `url(${staticFile('paper.png')})`,
          backgroundBlendMode: 'multiply',
          padding: '36px 40px 48px',
          boxSizing: 'border-box',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          transform: 'rotate(1.2deg)',
          fontFamily: font.mono,
          color: color.paperInk,
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, letterSpacing: '0.14em' }}>
          CONTRACTOR PAYSLIP
        </div>
        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '22px 0 24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>HOURLY RATE:</span>
            <span style={{ fontWeight: 700, color: color.redDeep }}>$1.20 / HR</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>SHIFT DURATION:</span>
            <span style={{ fontWeight: 700 }}>12.0 HOURS</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>DAILY TARGET:</span>
            <span style={{ fontWeight: 700 }}>2,400 BOXES</span>
          </div>
        </div>

        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '24px 0 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 70 }}>
          <span style={{ fontWeight: 700, fontSize: 28 }}>DAILY PAYOUT:</span>
          <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
            <Stamp at={sf} text="< $2.00 / HR" c={color.redDeep} px={36} />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Cut 1 Left: 12-Hour Shift Stopwatch (Captchas Stopwatch DNA) */
export const ShiftStopwatch: React.FC<Box> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, 0, 36);
  const r = Math.min(w, h - 80) / 2 - 30;
  const L = 2 * Math.PI * r;

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={2 * r + 40} height={2 * r + 40}>
        <circle cx={r + 20} cy={r + 20} r={r} fill="none" stroke={color.raised2} strokeWidth={20} />
        <circle
          cx={r + 20}
          cy={r + 20}
          r={r}
          fill="none"
          stroke={color.red}
          strokeWidth={20}
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          transform={`rotate(-90 ${r + 20} ${r + 20})`}
          strokeLinecap="round"
        />
        <text
          x={r + 20}
          y={r + 48}
          textAnchor="middle"
          fontFamily={font.mono}
          fontWeight={700}
          fontSize={100}
          fill={color.ink}
        >
          12h
        </text>
      </svg>
      <div style={{ ...mono(22, color.mute), marginTop: 14, letterSpacing: '0.08em' }}>
        CONTINUOUS SHIFT
      </div>
    </div>
  );
};

/** Cut 1 Right: Failover Dial Score (Captchas Score DNA) */
export const FailoverScore: React.FC<Box & { dropAt?: string | number }> = ({
  w,
  h,
  dropAt = 'freezes',
}) => {
  const frame = useCurrentFrame();
  const df = useCue(dropAt, 16);
  const p = prog(frame, df, 14);
  const v = 1.0 - 1.0 * p; // drops to 0.0

  const r = Math.min(w / 2 - 40, h - 160);
  const cx = w / 2, cy = h / 2 + r / 2 - 15;
  const ang = Math.PI * (1 - v);

  const arc = (a0: number, a1: number) =>
    `M${cx + r * Math.cos(Math.PI * (1 - a0))} ${cy - r * Math.sin(Math.PI * (1 - a0))} A${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * (1 - a1))} ${cy - r * Math.sin(Math.PI * (1 - a1))}`;

  return (
    <div style={{ width: w, height: h, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={w} height={h}>
        <path d={arc(0, 1)} fill="none" stroke={color.raised2} strokeWidth={26} strokeLinecap="round" />
        <path d={arc(0, 0.3)} fill="none" stroke={color.red} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <path d={arc(0.7, 1)} fill="none" stroke={color.go} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <line
          x1={cx}
          y1={cy}
          x2={cx + (r - 28) * Math.cos(ang)}
          y2={cy - (r - 28) * Math.sin(ang)}
          stroke={color.ink}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={14} fill={color.ink} />
      </svg>
      <div style={{ position: 'absolute', left: cx - r - 40, top: cy + 30, ...mono(24, color.red) }}>
        0.0 OVERRIDE
      </div>
      <div style={{ position: 'absolute', left: cx + r - 120, top: cy + 30, ...mono(24, color.go) }}>
        1.0 ACTIVE
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy - r * 0.55,
          textAlign: 'center',
          fontFamily: font.mono,
          fontWeight: 700,
          fontSize: 72,
          color: color.ink,
        }}
      >
        {v.toFixed(1)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy + 80,
          textAlign: 'center',
          ...hand(38, color.red, 700),
          whiteSpace: 'nowrap',
          opacity: prog(frame, df + 4, 10),
        }}
      >
        algorithm frozen · human failover
      </div>
    </div>
  );
};

// ============================================================================
// BEAT 4 (a04): THE PUPPET STRINGS
// ============================================================================

/** Cut 0 Left: Autonomous Rover Real Archival Photo (Captchas Print DNA) */
export const AutonomousRoverPrint: React.FC<Box & { ringAt?: string | number }> = ({
  w,
  h,
  ringAt = 'navigates',
}) => {
  const frame = useCurrentFrame();
  const rf = useCue(ringAt, 16);
  const bw = Math.min(w - 40, 580);
  const bh = Math.min(h - 60, 480);
  const z = 1.02 + 0.0004 * frame;

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          height: bh,
          background: color.raised,
          border: `1.5px solid ${color.hairStrong}`,
          borderRadius: 8,
          padding: 14,
          paddingBottom: 64,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#000', borderRadius: 4, position: 'relative' }}>
          <Img
            src={staticFile('captchas/ch_r00_streetview-car-googleplex.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, filter: 'grayscale(0.9) contrast(1.1)' }}
          />
          {/* Ring around rooftop camera sensor */}
          <div style={{ position: 'absolute', left: '42%', top: '24%', width: 90, height: 90 }}>
            <Ring at={rf} w={90} h={90} c={color.red} stroke={6} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              fontFamily: font.mono,
              fontWeight: 700,
              fontSize: 20,
              color: color.ink,
              border: `1.5px solid ${color.hairStrong}`,
              borderRadius: 4,
              padding: '6px 16px',
              background: color.stage,
              whiteSpace: 'nowrap',
            }}
          >
            autonomous fleet rover · field test
          </div>
        </div>
      </div>
    </div>
  );
};

/** Cut 0 Right: Not Reasoning Half-Dial Score (Captchas Score DNA) */
export const NotReasoningScore: React.FC<Box & { dropAt?: string | number }> = ({
  w,
  h,
  dropAt = 'reasoning',
}) => {
  const frame = useCurrentFrame();
  const df = useCue(dropAt, 16);
  const p = prog(frame, df, 16);
  const v = 1.0 - 0.9 * p; // drops to 0.1

  const r = Math.min(w / 2 - 40, h - 160);
  const cx = w / 2, cy = h / 2 + r / 2 - 15;
  const ang = Math.PI * (1 - v);

  const arc = (a0: number, a1: number) =>
    `M${cx + r * Math.cos(Math.PI * (1 - a0))} ${cy - r * Math.sin(Math.PI * (1 - a0))} A${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * (1 - a1))} ${cy - r * Math.sin(Math.PI * (1 - a1))}`;

  return (
    <div style={{ width: w, height: h, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={w} height={h}>
        <path d={arc(0, 1)} fill="none" stroke={color.raised2} strokeWidth={26} strokeLinecap="round" />
        <path d={arc(0, 0.3)} fill="none" stroke={color.red} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <path d={arc(0.7, 1)} fill="none" stroke={color.go} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <line
          x1={cx}
          y1={cy}
          x2={cx + (r - 28) * Math.cos(ang)}
          y2={cy - (r - 28) * Math.sin(ang)}
          stroke={color.ink}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={14} fill={color.ink} />
      </svg>
      <div style={{ position: 'absolute', left: cx - r - 40, top: cy + 30, ...mono(24, color.red) }}>
        0.0 BOT
      </div>
      <div style={{ position: 'absolute', left: cx + r - 120, top: cy + 30, ...mono(24, color.go) }}>
        1.0 REASONING
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy - r * 0.55,
          textAlign: 'center',
          fontFamily: font.mono,
          fontWeight: 700,
          fontSize: 72,
          color: color.ink,
        }}
      >
        {v.toFixed(1)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy + 90,
          textAlign: 'center',
          ...hand(54, color.red, 700),
          opacity: prog(frame, df + 4, 10),
        }}
      >
        it isn't reasoning
      </div>
    </div>
  );
};

/** Cut 1 Left: Takeover MousePath to Emergency Toggle */
export const TakeoverMousePath: React.FC<Box & { grabAt?: string | number }> = ({
  w,
  h,
  grabAt = 'grabbed',
}) => {
  const frame = useCurrentFrame();
  const gf = useCue(grabAt, 20);
  const DW = 640, DH = 440;
  const k = Math.min(w / DW, h / DH);

  const bot = 'M60 400 L550 235';
  const human = 'M60 400 C160 360 200 240 300 270 C380 290 360 170 460 160 C510 155 540 220 571 235';
  const hp = prog(frame, gf - 24, 24);

  const cx = 60 + (571 - 60) * hp;
  const cy = 400 + (235 - 400) * hp - Math.sin(hp * Math.PI) * 60;

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={DW * k} height={DH * k} viewBox={`0 0 ${DW} ${DH}`} style={{ overflow: 'visible' }}>
        {/* Toggle switch console enclosure */}
        <rect x={536} y={185} width={100} height={92} rx={8} fill="#14181F" stroke={color.hairStrong} strokeWidth={1.5} />
        <text x={586} y={202} textAnchor="middle" fontFamily={font.mono} fontSize={11} fill={color.mute} letterSpacing="0.1em">
          FAILSAFE
        </text>
        <rect x={546} y={210} width={80} height={50} rx={25} fill={frame >= gf ? color.red : '#262A30'} />
        <circle cx={frame >= gf ? 601 : 571} cy={235} r={20} fill="#fff" />

        {/* Failed bot path (straight dashed, visible from frame 0) */}
        <path d={bot} fill="none" stroke={color.mute} strokeWidth={4} strokeDasharray="12 10" opacity={0.4} />

        {/* Human override path */}
        <path
          d={human}
          fill="none"
          stroke={color.red}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - hp}
        />

        {/* Trajectory pause points */}
        {[[300, 270], [460, 160]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={10} fill="none" stroke={color.ink} strokeWidth={3} opacity={hp > (i + 1) / 3 ? 1 : 0} />
        ))}

        {/* Cursor */}
        <g transform={`translate(${cx - 4} ${cy - 4}) scale(1.3)`}>
          <path d={cursorPath} fill="#fff" stroke="#000" strokeWidth={2.5} />
        </g>
      </svg>
      <div style={{ ...mono(22, color.red), fontWeight: 700, letterSpacing: '0.08em', marginTop: 12 }}>
        EMERGENCY MANUAL TAKEOVER
      </div>
    </div>
  );
};

/** Cut 1 Right: Teleoperation Audit Receipt */
export const TeleoperationReceipt: React.FC<Box & { stampAt?: string | number }> = ({
  w,
  h,
  stampAt = 'controls',
}) => {
  const sf = useCue(stampAt, 20);
  const rw = Math.min(w - 40, 560);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: rw,
          background: color.paper,
          backgroundImage: `url(${staticFile('paper.png')})`,
          backgroundBlendMode: 'multiply',
          padding: '36px 40px 48px',
          boxSizing: 'border-box',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          transform: 'rotate(-1.5deg)',
          fontFamily: font.mono,
          color: color.paperInk,
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, letterSpacing: '0.14em' }}>
          TELEOPERATION AUDIT
        </div>
        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '22px 0 24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>TAKEOVER RATE:</span>
            <span style={{ fontWeight: 700, color: color.redDeep }}>1 IN 1.8 MILES</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>PILOT RATIO:</span>
            <span style={{ fontWeight: 700 }}>1 PILOT : 3 BOTS</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>REMOTE LATENCY:</span>
            <span style={{ fontWeight: 700 }}>120 MS</span>
          </div>
        </div>

        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '24px 0 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 70 }}>
          <span style={{ color: color.paperMute, fontSize: 22 }}>SHADOW PILOT</span>
          <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
            <Stamp at={sf} text="PUPPETEERED" c={color.redDeep} px={36} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BEAT 5 (a05): THE VERDICT
// ============================================================================

/** Cut 0 Left: Millions of Unseen Lives CalendarCard */
export const MillionsLivesCount: React.FC<Box> = ({ w, h }) => {
  const bw = Math.min(w - 40, 540);
  const bh = Math.min(h - 40, 480);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          height: bh,
          background: color.raised,
          border: `1.5px solid ${color.hairStrong}`,
          borderRadius: 10,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          padding: '36px 40px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: color.red }} />
          <div style={{ ...mono(18, color.mute) }}>THE GHOST ARMY</div>
        </div>

        <div>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 78, color: color.ink, lineHeight: 1 }}>
            MILLIONS
          </div>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 22, color: color.red, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 14 }}>
            OF UNSEEN HUMAN LIVES
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === 4 ? color.red : color.mute, opacity: 0.6 }} />
          ))}
        </div>
      </div>
      <div style={{ ...mono(20, color.mute), marginTop: 16, letterSpacing: '0.04em' }}>
        global shadow workforce · 2026
      </div>
    </div>
  );
};

/** Cut 0 Right: The Value Arbitrage Receipt */
export const ArbitrageReceipt: React.FC<Box & { stampAt?: string | number }> = ({
  w,
  h,
  stampAt = 'unseen',
}) => {
  const sf = useCue(stampAt, 20);
  const rw = Math.min(w - 40, 560);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: rw,
          background: color.paper,
          backgroundImage: `url(${staticFile('paper.png')})`,
          backgroundBlendMode: 'multiply',
          padding: '36px 40px 48px',
          boxSizing: 'border-box',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          transform: 'rotate(-1.2deg)',
          fontFamily: font.mono,
          color: color.paperInk,
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, letterSpacing: '0.14em' }}>
          THE VALUE ARBITRAGE
        </div>
        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '22px 0 24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>AI COMPANY VALUATION:</span>
            <span style={{ fontWeight: 700, color: color.go }}>$200,000,000,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>OFFSHORE MONTHLY PAY:</span>
            <span style={{ fontWeight: 700, color: color.redDeep }}>$240 / MONTH</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: color.paperMute }}>LEVERAGE RATIO:</span>
            <span style={{ fontWeight: 700 }}>833,000X</span>
          </div>
        </div>

        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '24px 0 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 70 }}>
          <span style={{ color: color.paperMute, fontSize: 20 }}>LABOR EXPLOITATION</span>
          <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
            <Stamp at={sf} text="HUMAN-POWERED" c={color.redDeep} px={34} />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Cut 1 Left: Final TwoWords Lie (Captchas TwoWords signature) */
export const FinalTwoWordsLie: React.FC<Box & { badgeAt?: string | number; strikeAt?: string | number }> = ({
  w,
  h,
  badgeAt = 'billion',
  strikeAt = 'lie',
}) => {
  const frame = useCurrentFrame();
  const bf = useCue(badgeAt, 20);
  const sf = useCue(strikeAt, 24);
  const ww = Math.min(270, (w - 100) / 2);
  const bw = Math.min(w - 40, 620);
  const doneStrike = frame >= sf;

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: bw,
          background: ui.white,
          borderRadius: 6,
          padding: '26px 30px',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          borderTop: `10px solid ${ui.redAccent}`,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', gap: 20, background: '#F4F4F4', padding: '12px 14px', borderRadius: 4, justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <WarpedText word="artificial" id="tw-art" w={ww} px={52} />
          </div>
          <div style={{ position: 'relative' }}>
            <WarpedText word="intelligence" id="tw-intel" w={ww} px={52} />
            {doneStrike && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '46%',
                  height: 12,
                  background: color.red,
                  transform: 'rotate(-3deg)',
                }}
              />
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            height: 52,
            border: `2px solid ${ui.line}`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#999',
          }}
        >
          Type the two words:
        </div>

        {/* Question mark badge */}
        {frame >= bf && (
          <svg
            width={64}
            height={64}
            viewBox="0 0 40 40"
            style={{
              position: 'absolute',
              right: -18,
              top: -24,
              transform: `scale(${1.2 - 0.2 * prog(frame, bf, 6)})`,
            }}
          >
            <circle cx={20} cy={20} r={18} fill={color.red} />
            <text x={20} y={28} textAnchor="middle" fontFamily={font.hand} fontWeight={800} fontSize={24} fill="#fff">
              ?
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};

/** Cut 1 Right: Final Dossier Verdict with The Lie Stamp */
export const FinalDossierVerdict: React.FC<Box & { highlightAt?: string | number; stampAt?: string | number }> = ({
  w,
  h,
  highlightAt = 'billion',
  stampAt = 'lie',
}) => {
  const sf = useCue(stampAt, 24);
  const rw = Math.min(w - 40, 560);

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: rw,
          background: color.paper,
          backgroundImage: `url(${staticFile('paper.png')})`,
          backgroundBlendMode: 'multiply',
          padding: '36px 40px 48px',
          boxSizing: 'border-box',
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          transform: 'rotate(1.5deg)',
          fontFamily: font.mono,
          color: color.paperInk,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${color.red}`,
            borderBottom: `1px solid ${color.paperMute}`,
            paddingTop: 8,
            paddingBottom: 8,
            marginBottom: 20,
            fontSize: 16,
            color: color.paperMute,
            letterSpacing: '0.12em',
          }}
        >
          <span>OFFICIAL RECORD // VERDICT</span>
          <span>2026</span>
        </div>

        <div style={{ ...serif(32, color.paperInk, 700), textAlign: 'center', marginBottom: 20 }}>
          "Never built by software alone."
        </div>

        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '20px 0 24px' }} />

        <div style={{ position: 'relative', fontSize: 24, paddingLeft: 10 }}>
          <Highlighter w={rw - 100} h={34} at={highlightAt} />
          <span style={{ position: 'relative', zIndex: 1, fontWeight: 700 }}>
            THE BILLION-DOLLAR SECRET
          </span>
        </div>

        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '24px 0 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 70 }}>
          <span style={{ color: color.paperMute, fontSize: 22 }}>FINAL AUDIT</span>
          <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
            <Stamp at={sf} text="THE LIE" c={color.redDeep} px={40} />
          </div>
        </div>
      </div>
    </div>
  );
};
