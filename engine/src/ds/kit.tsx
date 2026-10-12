/**
 * All-in design system, layer 2b: the "minimal" kit (Design System Reels, featured design) merged with v23's objects.
 * Thin line-art drawings that draw on at their word, v23's iconic objects (calendar card, speech bubble, doc, bars),
 * one big counter. Each object carries at most one or two words: the narrator carries the information (owner, 2026-10-07).
 * Spec: design-system/DESIGN.md "The kit".
 */
import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { cueFrame as cueFrameOf, fmt, hand, mono, prog, useBeat, useCue } from './core';
import { color, font } from './tokens';

type Box = { w: number; h: number };

/** Draw-on progress for a line-art group: strokes trace in over `dur` frames from the cue. Frame-0 cues are fully drawn at once. */
const useDraw = (at: string | number | undefined, fb = 0, dur = 16) => {
  const frame = useCurrentFrame();
  const f = useCue(at, fb);
  return f <= 0 && at === undefined ? Math.min(1, 0.35 + prog(frame, 0, dur)) : prog(frame, f, dur);
};

/** Stroke scale: line art keeps a ~5 px pen whatever the drawing's size (set per drawing before `art` runs). */
let PEN = 1;
const S = (p: number, c: string = color.ink, sw = 4): React.SVGProps<SVGPathElement> => ({
  fill: 'none', stroke: c, strokeWidth: sw * PEN, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p,
});

// ---------------------------------------------------------------- line art (viewBox 200 × 200)
export type IconName = 'person' | 'robot' | 'gateOpen' | 'gateShut' | 'hourglass' | 'doc' | 'envelope' | 'desk' | 'eye' | 'book' | 'coin' | 'contract' | 'cursor' | 'people'
  | 'cash' | 'church' | 'car' | 'camera' | 'flag' | 'pin' | 'map' | 'box' | 'grid' | 'checkbox' | 'checkbox2' | 'cloud' | 'building' | 'browser' | 'clock'
  | 'worker' | 'monitor' | 'laptop' | 'fingerprint' | 'shield' | 'cookie' | 'key' | 'face' | 'iris' | 'newspaper'
  | 'lock' | 'chip' | 'idcard' | 'brain' | 'missile' | 'tank' | 'bars' | 'fire' | 'power';

const art = (name: IconName, p: number, t: number): React.ReactNode => {
  const red = color.red;
  switch (name) {
    case 'person': return <g><circle cx={100} cy={52} r={20} {...(S(p) as any)} /><path d="M100 72 L100 132 M100 88 L72 116 M100 88 L128 116 M100 132 L78 178 M100 132 L122 178" {...S(p)} /></g>;
    case 'people': return <g>{[40, 100, 160].map((x, i) => <g key={i}><circle cx={x} cy={70} r={14} {...(S(p) as any)} /><path d={`M${x} 84 L${x} 126 M${x} 96 L${x - 18} 114 M${x} 96 L${x + 18} 114 M${x} 126 L${x - 14} 160 M${x} 126 L${x + 14} 160`} {...S(p)} /></g>)}</g>;
    case 'robot': return <g><path d="M100 22 L100 40" {...S(p)} /><circle cx={100} cy={18} r={5} {...(S(p, red) as any)} /><rect x={72} y={40} width={56} height={44} rx={8} {...(S(p) as any)} /><circle cx={88} cy={60} r={4} {...(S(p, red) as any)} /><circle cx={112} cy={60} r={4} {...(S(p, red) as any)} /><rect x={78} y={92} width={44} height={50} rx={6} {...(S(p) as any)} /><path d="M78 104 L60 128 M122 104 L140 128 M90 142 L88 178 M110 142 L112 178" {...S(p)} /></g>;
    case 'gateOpen':
    case 'gateShut': {
      const open = name === 'gateOpen';
      const a = open ? -80 * prog(t, 0, 1) : 0;
      return <g><path d="M30 180 L30 70 M170 180 L170 70 M10 180 L190 180" {...S(p)} /><g transform={`rotate(${a} 30 110)`}><path d="M30 110 L170 110" {...S(p, open ? color.go : red, 6)} /></g></g>;
    }
    case 'hourglass': {
      const top = 1 - t, bot = t; // sand: t = 0 full top, 1 all fallen
      return <g><path d="M52 24 L148 24 M52 176 L148 176 M60 24 C60 80 96 88 100 100 C104 88 140 80 140 24 M60 176 C60 120 96 112 100 100 C104 112 140 120 140 176" {...S(p)} />
        <path d={`M${100 - 34 * top} ${98 - 56 * top} L${100 + 34 * top} ${98 - 56 * top} L100 98 Z`} fill={red} opacity={p * (top > 0.02 ? 1 : 0)} />
        <path d={`M${100 - 36 * Math.sqrt(bot)} 172 L${100 + 36 * Math.sqrt(bot)} 172 L100 ${172 - 50 * Math.sqrt(bot)} Z`} fill={red} opacity={p} />
        {t > 0 && t < 1 && <path d="M100 100 L100 170" stroke={red} strokeWidth={2} opacity={p} />}</g>;
    }
    case 'doc': return <g><path d="M48 20 L126 20 L154 48 L154 180 L48 180 Z M126 20 L126 48 L154 48" {...S(p)} /><path d="M68 76 L134 76 M68 100 L134 100" {...S(p, red, 7)} /><path d="M68 124 L134 124 M68 148 L112 148" {...S(p, color.mute, 7)} /></g>;
    case 'envelope': return <g><rect x={26} y={52} width={148} height={100} rx={6} {...(S(p) as any)} /><path d="M28 56 L100 112 L172 56" {...S(p, red)} /></g>;
    case 'desk': return <g><path d="M14 150 L186 150 M30 150 L30 190 M170 150 L170 190" {...S(p)} /><rect x={62} y={60} width={78} height={58} rx={4} {...(S(p) as any)} /><path d="M101 118 L101 142 M84 146 L118 146" {...S(p)} /><path d="M24 150 L24 118 L40 118 M18 112 L36 112 L32 100 L22 100 Z" {...S(p)} /><rect x={150} y={128} width={16} height={22} rx={2} {...(S(p) as any)} /><rect x={92} y={80} width={18} height={18} fill={red} opacity={p} /></g>;
    case 'eye': return <g><path d="M14 100 Q100 22 186 100 Q100 178 14 100 Z" {...S(p)} /><circle cx={100} cy={100} r={26} {...(S(p, red, 5) as any)} /><circle cx={100} cy={100} r={9} fill={red} opacity={p} /></g>;
    case 'book': return <g><path d="M100 50 C76 36 40 36 18 46 L18 164 C40 154 76 154 100 168 C124 154 160 154 182 164 L182 46 C160 36 124 36 100 50 Z M100 50 L100 168" {...S(p)} /><path d="M36 74 L84 72 M36 96 L84 94 M116 72 L164 74 M116 94 L164 96" {...S(p, color.mute, 4)} /><path d="M36 118 L84 116" {...S(p, red, 6)} /></g>;
    case 'coin': return <g><circle cx={100} cy={100} r={64} {...(S(p) as any)} /><path d="M118 74 C110 66 84 66 82 82 C80 98 120 98 118 116 C116 134 88 134 80 124 M100 56 L100 144" {...S(p, red, 5)} /></g>;
    case 'contract': return <g><path d="M48 20 L154 20 L154 180 L48 180 Z" {...S(p)} /><path d="M68 54 L134 54 M68 78 L134 78 M68 102 L120 102" {...S(p, color.mute, 5)} /><path d="M68 152 C80 132 88 162 100 146 C108 136 112 152 124 148 M64 162 L136 162" {...S(p, color.mute, 4)} /></g>;
    case 'cursor': return <path d="M70 40 L70 150 L98 124 L118 168 L136 160 L116 118 L152 118 Z" fill={color.ink} stroke="#000" strokeWidth={4} opacity={p} />;
    // ---- added for captchas-full (2026-10-08): line art for money, devices, streets and tests
    case 'cash': return <g><rect x={24} y={58} width={152} height={86} rx={8} {...(S(p) as any)} /><path d="M112 86 C106 80 90 80 89 90 C88 100 112 100 111 111 C110 122 92 122 87 116 M100 74 L100 128" {...S(p, red, 6)} /><path d="M44 78 L60 78 M140 124 L156 124" {...S(p)} /><path d="M36 156 L164 156 M48 168 L152 168" {...S(p, color.mute, 4)} /></g>;
    case 'church': return <g><path d="M46 182 L46 104 L100 62 L154 104 L154 182 Z M100 62 L100 18 M86 32 L114 32 M30 182 L170 182" {...S(p)} /><path d="M86 182 L86 146 Q100 130 114 146 L114 182" {...S(p, red, 5)} /></g>;
    case 'car': return <g><path d="M18 132 L40 98 Q48 86 64 86 L136 86 Q152 86 160 98 L182 132 L182 150 L18 150 Z M54 98 L146 98" {...S(p)} /><circle cx={60} cy={152} r={16} {...(S(p) as any)} /><circle cx={140} cy={152} r={16} {...(S(p) as any)} /><path d="M100 86 L100 54" {...S(p)} /><circle cx={100} cy={44} r={11} {...(S(p, red, 5) as any)} /></g>;
    case 'camera': return <g><rect x={26} y={66} width={148} height={100} rx={12} {...(S(p) as any)} /><path d="M68 66 L80 46 L120 46 L132 66" {...S(p)} /><circle cx={100} cy={116} r={30} {...(S(p, red, 5) as any)} /><circle cx={150} cy={86} r={4} fill={red} opacity={p} /></g>;
    case 'flag': return <g><path d="M38 18 L38 188" {...S(p)} /><rect x={38} y={28} width={136} height={86} {...(S(p) as any)} /><path d="M92 44 L174 44 M92 62 L174 62 M38 80 L174 80 M38 98 L174 98" {...S(p, red, 5)} /><rect x={38} y={28} width={54} height={44} {...(S(p) as any)} /></g>;
    case 'pin': return <g><path d="M100 182 C64 128 52 104 52 78 A48 48 0 1 1 148 78 C148 104 136 128 100 182 Z" {...S(p)} /><circle cx={100} cy={78} r={18} {...(S(p, red, 6) as any)} /></g>;
    case 'map': return <g><path d="M18 52 L70 32 L130 52 L182 32 L182 150 L130 170 L70 150 L18 170 Z M70 32 L70 150 M130 52 L130 170" {...S(p)} /><path d="M38 144 Q76 92 106 112 T164 58" {...S(p, red, 5)} /></g>;
    case 'box': return <g><path d="M28 70 L100 40 L172 70 L172 152 L100 182 L28 152 Z M28 70 L100 100 L172 70 M100 100 L100 182" {...S(p)} /><path d="M44 112 L44 146 M52 115 L52 149 M62 119 L62 153 M68 121 L68 155 M78 125 L78 159" {...S(p, red, 4)} /></g>;
    case 'grid': return <g><rect x={30} y={30} width={140} height={140} rx={4} {...(S(p) as any)} /><path d="M76.7 30 L76.7 170 M123.3 30 L123.3 170 M30 76.7 L170 76.7 M30 123.3 L170 123.3" {...S(p, color.mute, 4)} /><rect x={82} y={82} width={36} height={36} rx={4} fill={red} opacity={p} /></g>;
    case 'checkbox': return <g><rect x={20} y={58} width={160} height={84} rx={6} {...(S(p, color.mute) as any)} /><rect x={36} y={78} width={44} height={44} rx={4} {...(S(p) as any)} /><path d="M44 100 L56 112 L76 86" {...S(p, red, 6)} /><path d="M98 92 L160 92 M98 110 L144 110" {...S(p, color.mute, 4)} /></g>;
    case 'checkbox2': return <g><rect x={20} y={58} width={160} height={84} rx={18} {...(S(p, color.mute) as any)} /><circle cx={58} cy={100} r={22} {...(S(p) as any)} /><path d="M98 92 L160 92 M98 110 L144 110" {...S(p, color.mute, 4)} /><circle cx={58} cy={100} r={8} fill={red} opacity={p} /></g>;
    case 'cloud': return <g><path d="M52 146 A32 32 0 0 1 58 84 A46 46 0 0 1 144 72 A38 38 0 0 1 152 146 Z" {...S(p)} /><path d="M76 120 L124 120" {...S(p, red, 5)} /></g>;
    case 'building': return <g><path d="M38 182 L38 36 L120 36 L120 182 M120 92 L170 92 L170 182 M18 182 L190 182" {...S(p)} /><path d="M58 60 L70 60 M88 60 L100 60 M58 88 L70 88 M88 88 L100 88 M58 116 L70 116 M58 144 L70 144 M88 144 L100 144 M140 116 L152 116 M140 144 L152 144" {...S(p, color.mute, 6)} /><rect x={84} y={108} width={20} height={16} fill={red} opacity={p} /></g>;
    case 'browser': return <g><rect x={18} y={38} width={164} height={126} rx={8} {...(S(p) as any)} /><path d="M18 66 L182 66" {...S(p)} /><circle cx={34} cy={52} r={4} fill={red} opacity={p} /><path d="M40 92 L160 92 M40 112 L130 112 M40 132 L150 132" {...S(p, color.mute, 5)} /></g>;
    case 'clock': return <g><circle cx={100} cy={100} r={72} {...(S(p) as any)} /><g transform={`rotate(${360 * t} 100 100)`}><path d="M100 100 L100 46" {...S(p, red, 5)} /></g><g transform={`rotate(${30 * t} 100 100)`}><path d="M100 100 L132 100" {...S(p, color.ink, 6)} /></g><circle cx={100} cy={100} r={6} fill={red} opacity={p} /></g>;
    case 'worker': return <g><rect x={92} y={54} width={90} height={64} rx={4} {...(S(p) as any)} /><path d="M122 54 L122 118 M152 54 L152 118 M92 86 L182 86" {...S(p, color.mute, 3)} /><rect x={126} y={90} width={22} height={24} fill={red} opacity={p} /><circle cx={50} cy={66} r={16} {...(S(p) as any)} /><path d="M50 82 L50 134 M50 98 L94 112 M50 134 L36 182 M50 134 L72 182 M12 140 L190 140 M137 118 L137 140" {...S(p)} /></g>;
    case 'monitor': return <g><rect x={28} y={36} width={144} height={104} rx={6} {...(S(p) as any)} /><path d="M76 36 L76 140 M124 36 L124 140 M28 70.6 L172 70.6 M28 105.3 L172 105.3" {...S(p, color.mute, 3)} /><rect x={80} y={74} width={40} height={28} fill={red} opacity={p} /><path d="M100 140 L100 164 M70 168 L130 168" {...S(p)} /></g>;
    case 'laptop': return <g><rect x={44} y={46} width={112} height={80} rx={6} {...(S(p) as any)} /><path d="M24 142 L176 142 L164 160 L36 160 Z" {...S(p)} /><circle cx={100} cy={86} r={12} {...(S(p, red, 5) as any)} /></g>;
    case 'fingerprint': return <g><path d="M46 132 Q38 42 100 40 Q162 42 154 132" {...S(p)} /><path d="M62 156 Q56 62 100 60 Q144 62 138 156" {...S(p)} /><path d="M78 168 Q74 82 100 80 Q126 82 122 168" {...S(p, red, 5)} /><path d="M92 172 Q90 102 100 100 Q110 102 108 172" {...S(p)} /></g>;
    case 'shield': return <g><path d="M100 22 L166 46 L166 98 C166 140 138 166 100 182 C62 166 34 140 34 98 L34 46 Z" {...S(p)} /><rect x={80} y={96} width={40} height={36} rx={4} {...(S(p, red, 5) as any)} /><path d="M86 96 L86 84 A14 14 0 0 1 114 84 L114 96" {...S(p, red, 5)} /></g>;
    case 'cookie': return <g><path d="M164 84 A66 66 0 1 1 116 36 A18 18 0 0 0 140 60 A18 18 0 0 0 164 84 Z" {...S(p)} />{[[72, 82], [104, 120], [70, 136], [128, 150], [96, 82]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={i % 2 ? color.ink : red} opacity={p} />)}</g>;
    case 'key': return <g><circle cx={62} cy={100} r={32} {...(S(p) as any)} /><circle cx={62} cy={100} r={10} {...(S(p, red, 5) as any)} /><path d="M94 100 L176 100 M156 100 L156 128 M134 100 L134 120" {...S(p)} /></g>;
    case 'face': return <g><ellipse cx={100} cy={104} rx={50} ry={62} {...(S(p) as any)} /><path d="M80 92 L82 92 M118 92 L120 92 M84 132 Q100 142 116 132 M100 100 L96 118 L104 118" {...S(p)} /><path d="M24 50 L24 24 L50 24 M150 24 L176 24 L176 50 M24 150 L24 176 L50 176 M176 150 L176 176 L150 176" {...S(p, red, 5)} /></g>;
    case 'iris': return <g><path d="M10 100 Q100 30 190 100 Q100 170 10 100 Z" {...S(p)} /><circle cx={100} cy={100} r={34} {...(S(p) as any)} /><circle cx={100} cy={100} r={22} {...(S(p, color.mute, 3) as any)} /><circle cx={100} cy={100} r={10} fill={color.ink} opacity={p} /><path d={`M20 ${60 + 80 * t} L180 ${60 + 80 * t}`} stroke={red} strokeWidth={3} opacity={p * (t > 0 && t < 1 ? 1 : 0)} /></g>;
    case 'bars': return <g><rect x={36} y={30} width={128} height={146} rx={6} {...(S(p) as any)} />{[62, 88, 112, 138].map((x, i) => <path key={i} d={`M${x} 30 L${x} 176`} {...S(p, i === 1 || i === 2 ? red : color.ink, 6)} />)}<path d="M36 76 L164 76 M36 130 L164 130" {...S(p)} /></g>;
    case 'fire': return <g><path d="M100 176 C56 176 40 146 46 116 C52 90 72 78 74 50 C92 66 96 84 94 98 C108 86 116 66 112 30 C150 56 166 96 160 128 C154 158 132 176 100 176 Z" {...S(p)} /><path d="M100 176 C80 176 72 160 76 146 C80 132 92 126 94 112 C108 124 128 138 124 154 C121 168 112 176 100 176 Z" {...S(p, red, 5)} /></g>;
    case 'power': return <g><path d="M70 58 A58 58 0 1 0 130 58" {...S(p)} /><path d="M100 30 L100 104" {...S(p, red, 7)} /></g>;
    case 'lock': return <g><rect x={46} y={88} width={108} height={88} rx={10} {...(S(p) as any)} /><path d="M70 88 L70 64 A30 30 0 0 1 130 64 L130 88" {...S(p)} /><circle cx={100} cy={124} r={10} {...(S(p, red, 5) as any)} /><path d="M100 134 L100 152" {...S(p, red, 6)} /></g>;
    case 'chip': return <g><rect x={52} y={52} width={96} height={96} rx={8} {...(S(p) as any)} /><rect x={78} y={78} width={44} height={44} rx={4} {...(S(p, red, 5) as any)} />{[70, 90, 110, 130].map((v, i) => <path key={i} d={`M${v} 52 L${v} 30 M${v} 148 L${v} 170 M52 ${v} L30 ${v} M148 ${v} L170 ${v}`} {...S(p, color.ink, 3)} />)}</g>;
    case 'idcard': return <g><rect x={18} y={46} width={164} height={108} rx={10} {...(S(p) as any)} /><circle cx={62} cy={88} r={16} {...(S(p) as any)} /><path d="M38 132 C40 112 50 106 62 106 C74 106 84 112 86 132" {...S(p)} /><path d="M104 80 L162 80" {...S(p, red, 6)} /><path d="M104 102 L162 102 M104 124 L144 124" {...S(p, color.mute, 5)} /></g>;
    case 'brain': return <g><path d="M100 40 C84 26 56 30 52 54 C32 58 26 82 38 96 C24 110 32 138 54 140 C58 164 86 170 100 154 C114 170 142 164 146 140 C168 138 176 110 162 96 C174 82 168 58 148 54 C144 30 116 26 100 40 Z M100 40 L100 154" {...S(p)} /><path d="M100 76 C86 70 72 78 70 92 M100 112 C114 106 128 114 130 128 M58 116 C66 110 78 112 82 120 M142 74 C134 70 122 72 118 82" {...S(p, red, 5)} /></g>;
    case 'missile': return <g><path d="M100 18 C116 36 120 60 120 84 L120 150 L80 150 L80 84 C80 60 84 36 100 18 Z M80 124 L56 156 L80 150 M120 124 L144 156 L120 150 M80 84 L120 84" {...S(p)} /><path d="M88 162 L92 186 M100 162 L100 192 M112 162 L108 186" {...S(p, red, 5)} /></g>;
    case 'tank': return <g><path d="M26 132 Q20 160 48 164 L152 164 Q180 160 174 132 Z" {...S(p)} />{[54, 82, 110, 138].map((x, i) => <circle key={i} cx={x} cy={148} r={8} {...(S(p, color.mute, 4) as any)} />)}<path d="M50 132 L60 104 L136 104 L150 132 M80 104 L84 86 L120 86 L124 104" {...S(p)} /><path d="M120 94 L188 82" {...S(p, red, 6)} /></g>;
    case 'newspaper': return <g><rect x={28} y={32} width={144} height={140} rx={4} {...(S(p) as any)} /><path d="M44 56 L156 56" {...S(p, red, 9)} /><path d="M44 82 L94 82 M44 100 L94 100 M44 118 L94 118 M44 136 L94 136 M106 82 L156 82 M106 100 L156 100 M106 118 L156 118 M106 136 L140 136" {...S(p, color.mute, 4)} /></g>;
  }
};

/** One line-art drawing, drawn on at its cue word. `t` (0–1) drives the internal motion (sand falling, a gate opening). Optional red mark: ✓, ✗ or ?. */
export const LineIcon: React.FC<Box & { name: IconName; at?: string | number; size?: number; mark?: 'ok' | 'no' | '?'; markAt?: string | number; tAt?: string | number; tDur?: number; label?: string; labelAt?: string | number }> = ({ w, h, name, at, size: px, mark, markAt, tAt, tDur = 40, label, labelAt }) => {
  const frame = useCurrentFrame();
  const p = useDraw(at);
  const tf = useCue(tAt ?? at, 0);
  const t = prog(frame, tf + 8, tDur);
  const mf = useCue(markAt, 24);
  const lf = useCue(labelAt ?? at, 0);
  const s = px ?? Math.min(400, Math.min(w, h - (label ? 70 : 0)) * 0.9); // minimal print: a drawing, not a poster
  const mp = prog(frame, mf, 8);
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>{(PEN = 250 / s, art(name, p, t))}</svg>
        {mark && (
          <svg width={s * 0.34} height={s * 0.34} viewBox="0 0 40 40" style={{ position: 'absolute', right: -s * 0.06, top: -s * 0.02, opacity: mp, transform: `scale(${1.3 - 0.3 * mp})` }}>
            {mark === '?' ? <text x={20} y={33} textAnchor="middle" fontFamily={font.hand} fontWeight={800} fontSize={40} fill={color.red}>?</text>
              : <><circle cx={20} cy={20} r={18} fill={mark === 'ok' ? color.go : color.red} />
                {mark === 'ok' ? <path d="M11 21 l6 6 l12 -14" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M13 13 L27 27 M27 13 L13 27" stroke="#fff" strokeWidth={4} strokeLinecap="round" />}</>}
          </svg>
        )}
      </div>
      {label && <div style={{ ...mono(30, color.mute), opacity: lf <= 0 ? 1 : prog(frame, lf, 10) }}>{label}</div>}
    </div>
  );
};

/** Several drawings that appear one after another (robots multiplying, strangers agreeing). */
export const IconRow: React.FC<Box & { name: IconName; n: number; at?: string | number; every?: number; cols?: number; mark?: 'ok' | 'no'; marks?: ('ok' | 'no')[]; hot?: number; morph?: boolean; morphAt?: string | number; decay?: boolean }> = ({ w, h, name, n, at, every = 4, cols, mark: mark1, marks, hot, morph, morphAt, decay }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const { dur } = useBeat();
  const c = cols ?? n;
  const rows = Math.ceil(n / c);
  const s = Math.min((w - 10) / c, (h - 10) / rows);
  // morph (captchas-full f03, "every answer made the robots a little more human"): each drawing turns into a person in turn
  const mf = useCue(morphAt, 0);
  const span = Math.max(20, dur - mf - 30);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: c * s, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Array.from({ length: n }, (_, i) => {
        const p = morph ? 1 : prog(frame, f + i * every, 10);
        const m = morph ? prog(frame, mf + (i * span) / n, 14) : 0;
        const mark = marks ? marks[i] : mark1;
        const fade = decay ? 1 - 0.65 * (i / Math.max(1, n - 1)) : 1;
        return (
          <div key={i} style={{ width: s, height: s, position: 'relative', opacity: Math.min(1, p * 2) * fade }}>
            <svg width={s} height={s} viewBox="0 0 200 200" style={{ position: 'absolute', opacity: 1 - m }}>{(PEN = Math.max(1, 200 / s), art(name, p, 0))}</svg>
            {morph && <svg width={s} height={s} viewBox="0 0 200 200" style={{ position: 'absolute', opacity: m }}>{(PEN = Math.max(1, 200 / s), art('person', m, 0))}</svg>}
            {mark && <svg width={s * 0.3} height={s * 0.3} viewBox="0 0 40 40" style={{ position: 'absolute', right: s * 0.08, top: s * 0.04, opacity: prog(frame, f + i * every + 8, 6) }}>
              <circle cx={20} cy={20} r={18} fill={mark === 'ok' ? color.go : color.red} /><path d={mark === 'ok' ? 'M11 21 l6 6 l12 -14' : 'M13 13 L27 27 M27 13 L13 27'} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" /></svg>}
            {hot === i && <div style={{ position: 'absolute', inset: 0, border: `3px solid ${color.red}`, borderRadius: 12 }} />}
          </div>
        );
      })}
    </div></div>
  );
};

// ---------------------------------------------------------------- counter
/** One big number, rolling up on its word, with a one-word unit. Never on screen before it is said. */
export const Count: React.FC<Box & { n: number; at?: string | number; unit?: string; pre?: string; suffix?: string; dp?: number; dur?: number; px?: number }> = ({ w, h, n, at, unit, pre, suffix = '', dp = 0, dur = 24, px }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const v = n * prog(frame, f, dur);
  const txt = (pre ?? '') + fmt(v, dp) + suffix;
  const full = (pre ?? '') + fmt(n, dp) + suffix;
  const size = px ?? Math.min(170, Math.floor((w - 20) / (full.length * 0.62)));
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: f <= 0 ? 1 : prog(frame, f, 6) }}>
      <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: size, color: color.red, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{txt}</div>
      {unit && <div style={{ ...hand(72, color.ink, 700), marginTop: 18 }}>{unit}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- v23 objects
/** v23 calendar card: a red-dot title bar, the year big, a month of dots (the year's word lands it). */
export const CalendarCard: React.FC<Box & { year: string; note?: string; at?: string | number }> = ({ w, h, year, note, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const cw = Math.min(w, 420), ch = Math.min(h, 420);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: cw, height: ch, background: color.raised, border: `1.5px solid ${color.hairStrong}`, borderRadius: 12, boxShadow: '0 18px 40px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 52, borderBottom: `1.5px solid ${color.hair}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: color.red }} /><div style={{ flex: 1 }} /><div style={{ ...mono(20, color.mute) }}>×</div>
        </div>
        <div style={{ textAlign: 'center', fontFamily: font.mono, fontWeight: 700, fontSize: 112, color: color.ink, marginTop: 18, lineHeight: 1, opacity: f <= 0 ? 1 : prog(frame, f, 8) }}>{year}</div>
        {note && <div style={{ textAlign: 'center', ...hand(44, color.red, 700), marginTop: 8 }}>{note}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14, padding: '26px 44px', marginTop: 'auto' }}>
          {Array.from({ length: 21 }, (_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === 9 ? color.red : color.mute, opacity: i === 9 ? 1 : 0.45, justifySelf: 'center' }} />)}
        </div>
      </div>
    </div>
  );
};

/** v23 speech bubble: chalk outline, mono text typed in on its word with a caret. `*word*` is red. */
export const Bubble: React.FC<Box & { text: string; at?: string | number; by?: string; px?: number; tail?: 'left' | 'right' }> = ({ w, h, text, at, by, px = 50, tail = 'left' }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const plain = text.replace(/\*/g, '');
  let left = Math.floor(plain.length * prog(frame, f, Math.max(14, plain.length * 1.3)));
  const done = left >= plain.length;
  const parts = text.split(/(\*[^*]+\*)/).map((s, i) => {
    const hot = s.startsWith('*'); const t = hot ? s.slice(1, -1) : s; const shown = t.slice(0, Math.max(0, left)); left -= t.length;
    return <span key={i} style={{ color: hot ? color.red : color.ink }}>{shown}</span>;
  });
  const bh = Math.min(h * 0.62, 300);
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: w - 20, minHeight: bh, border: `3px solid ${color.ink}`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 60px', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: px, lineHeight: 1.2, textAlign: 'center' }}>{parts}<span style={{ color: color.red, opacity: !done && frame % 20 < 12 ? 1 : 0 }}>|</span></div>
        <svg width={80} height={60} style={{ position: 'absolute', [tail]: 110, bottom: -52 } as React.CSSProperties}><path d={tail === 'left' ? 'M0 0 L10 54 L60 0' : 'M80 0 L70 54 L20 0'} fill={color.stage} stroke={color.ink} strokeWidth={3} /></svg>
        <div style={{ position: 'absolute', [tail]: 112, bottom: -3, width: 56, height: 6, background: color.stage } as React.CSSProperties} />
      </div>
      {by && <div style={{ ...mono(22, color.mute), marginTop: 70, letterSpacing: '0.06em' }}>{by}</div>}
    </div>
  );
};

/** v23 bar chart: two or three bars (red = humans, teal = machines), heights rising on their words, a one-word label under each. */
export const Bars: React.FC<Box & { bars: { v: number; t: string; at?: string | number; c?: 'red' | 'teal' }[] }> = ({ w, h, bars }) => {
  const frame = useCurrentFrame();
  const fs = bars.map((b) => useCue(b.at, 0)); // eslint-disable-line react-hooks/rules-of-hooks
  const max = Math.max(...bars.map((b) => b.v));
  const bw = 140, ch = h - 120;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 70, borderBottom: `2px solid ${color.hairStrong}`, boxSizing: 'border-box', paddingBottom: 0 }}>
      {bars.map((b, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...mono(30, b.c === 'teal' ? color.teal : color.red), whiteSpace: 'nowrap', marginBottom: 14, opacity: prog(frame, fs[i] + 10, 10) }}>{b.t}</div>
          <div style={{ width: bw, height: (ch * b.v / max) * prog(frame, fs[i], 20), background: b.c === 'teal' ? color.teal : color.red, borderRadius: '4px 4px 0 0' }} />
        </div>
      ))}
    </div>
  );
};

/** v23 / minimal print: B&W photo in a dark polaroid, name in a mono pill, up to two handwritten red notes with arrows. */
export const Polaroid: React.FC<Box & { img: string; name?: string; focus?: string; rotate?: number; notes?: { t: string; at?: string | number }[]; color?: boolean }> = ({ w, h, img, name, focus = '50% 35%', rotate = -2, notes = [], color: keepColor }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeat();
  const fs = notes.map((n, i) => useCue(n.at, 12 + i * 20)); // eslint-disable-line react-hooks/rules-of-hooks
  const pw = notes.length ? Math.min(w * 0.56, (h - 40) * 0.8) : Math.min(w * 0.9, (h - 10) / 1.2);
  const ph = pw * 1.18;
  const z = 1 + 0.035 * frame / Math.max(1, dur);
  return (
    <div style={{ width: w, height: h, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: notes.length ? 'flex-start' : 'center' }}>
      <div style={{ width: pw, height: ph, background: color.raised, border: `1.5px solid ${color.hairStrong}`, borderRadius: 8, padding: 14, paddingBottom: name ? 64 : 14, boxSizing: 'border-box', transform: `rotate(${rotate}deg)`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)', position: 'relative', flexShrink: 0 }}>
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
          <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${z})`, transformOrigin: focus, filter: keepColor ? 'saturate(0.85)' : 'grayscale(1) contrast(1.06)' }} />
        </div>
        {name && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 22, color: color.ink, border: `1.5px solid ${color.hairStrong}`, borderRadius: 4, padding: '5px 14px', background: color.stage, whiteSpace: 'nowrap' }}>{name}</div></div>}
      </div>
      {notes.map((n, i) => {
        const p = prog(frame, fs[i], 12);
        return (
          <div key={i} style={{ position: 'absolute', left: pw + 10, top: h / 2 - 90 + i * 130, display: 'flex', alignItems: 'center', gap: 10, opacity: Math.min(1, p * 1.5) }}>
            <svg width={70} height={40}><path d={`M66 20 Q36 ${8 + i * 12} 6 20`} fill="none" stroke={color.red} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /><path d="M6 20 L16 13 M6 20 L16 27" stroke={color.red} strokeWidth={3} strokeLinecap="round" opacity={p} /></svg>
            <div style={{ ...hand(44, color.red, 700), whiteSpace: 'nowrap' }}>{n.t}</div>
          </div>
        );
      })}
    </div>
  );
};

/** One handwritten word or two, big, for the rare beat where the word itself is the picture (a name, an acronym). */
export const Word: React.FC<Box & { t: string; at?: string | number; px?: number; monoFace?: boolean; sub?: string; subAt?: string | number }> = ({ w, h, t, at, px = 150, monoFace, sub, subAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const sf = useCue(subAt, 30);
  const op = f <= 0 ? 1 : prog(frame, f, 8);
  const sc = f <= 0 ? 1 : interpolate(frame, [f, f + 8], [1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...(monoFace ? { fontFamily: font.mono, fontWeight: 700, fontSize: px, letterSpacing: '0.04em', color: color.ink, lineHeight: 1 } : hand(px, color.ink, 800)), opacity: op, transform: `scale(${sc})`, whiteSpace: 'nowrap' }}>
        {t.split(/(\*[^*]+\*)/).map((s, i) => <span key={i} style={{ color: s.startsWith('*') ? color.red : undefined }}>{s.replace(/\*/g, '')}</span>)}
      </div>
      {sub && <div style={{ ...mono(26, color.mute), marginTop: 22, opacity: prog(frame, sf, 10) }}>{sub}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- flow (captchas-full, 2026-10-08)
/** A chain of drawings joined by arrows: each node draws on at its word, the arrow into it draws first and a red dot runs along it.
 *  For a process told in steps (a bot relays the puzzle to a worker; a switch from one supplier to another). Labels ≤ 2 words. */
export const Flow: React.FC<Box & { nodes: { icon: IconName; label?: string; at?: string | number }[] }> = ({ w, h, nodes }) => {
  const frame = useCurrentFrame();
  const { words } = useBeat();
  const fs = nodes.map((n, i) => (i === 0 && n.at === undefined ? 0 : cueFrameOf(words, n.at, i * 30)));
  const n = nodes.length;
  const slot = w / n;
  const s = Math.min(320, slot * 0.72, h - 110);
  const cy = h / 2 - 20;
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      {nodes.map((nd, i) => {
        const cx = slot * (i + 0.5);
        const p = fs[i] <= 0 ? 1 : prog(frame, fs[i], 16);
        const a = i === 0 ? 0 : prog(frame, fs[i] - 10, 12);
        const x0 = slot * (i - 0.5) + s / 2 + 14, x1 = cx - s / 2 - 14;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <path d={`M${x0} ${cy} L${x1} ${cy} M${x1 - 14} ${cy - 12} L${x1} ${cy} L${x1 - 14} ${cy + 12}`} fill="none" stroke={color.mute} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
                {a > 0 && a < 1 && <circle cx={x0 + (x1 - x0) * a} cy={cy} r={9} fill={color.red} />}
              </svg>
            )}
            <div style={{ position: 'absolute', left: cx - s / 2, top: cy - s / 2, width: s, height: s, opacity: Math.min(1, p * 2) }}>
              <svg width={s} height={s} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>{(PEN = 250 / s, art(nd.icon, p, 1))}</svg>
            </div>
            {nd.label && <div style={{ position: 'absolute', left: cx - slot / 2, width: slot, top: cy + s / 2 + 18, textAlign: 'center', ...mono(28, i === n - 1 ? color.red : color.mute), opacity: p }}>{nd.label}</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};
