/**
 * Topic visuals: CAPTCHAs, part 2 (captchas-full, 2026-10-08). Same rules as captchas.tsx: one idea per visual,
 * at most one or two words in it, the narrator carries the information. Catalogue: design-system/VISUALS.md.
 * Re-created UI is our own drawing in the widget's general shape; no third-party logo or trade dress beyond reCAPTCHA's
 * own (the subject of the film, re-created for commentary).
 */
import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { Ring, hand, mono, prog, serif, useBeat, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';

export { Flow } from '../ds/kit';

type Box = { w: number; h: number };
const ui = { white: '#FFFFFF', line: '#DFDFDF', text: '#222222', blue: '#1A73E8' };
const cursorPath = 'M3 3 L3 44 L13 34 L22 52 L29 49 L20 31 L35 31 Z';

/** Two mouse paths to the same checkbox: a human hand that wobbles, overshoots and pauses (red), a cheap bot's straight line (grey).
 *  The cursor rides the human path from `humanAt`; the bot line draws on `botAt`. */
export const MousePath: React.FC<Box & { humanAt?: string | number; botAt?: string | number; pauses?: boolean }> = ({ w, h, humanAt, botAt, pauses }) => {
  const frame = useCurrentFrame();
  const hf = useCue(humanAt, 0);
  const bf = useCue(botAt, 9999);
  const DW = 1200, DH = 560, k = Math.min(w / DW, h / DH);
  const human = 'M80 470 C180 430 220 300 330 330 C420 352 400 220 520 210 C640 200 640 330 760 300 C860 276 880 170 960 196 C1010 212 1000 262 1032 270';
  const bot = 'M80 470 L1032 270';
  const hp = prog(frame, hf, 70);
  const bp = prog(frame, bf, 14);
  // the cursor follows the human path (sampled along the same curve)
  const pt = (t: number) => {
    const P = [[80, 470], [330, 330], [520, 210], [760, 300], [960, 196], [1032, 270]];
    const seg = Math.min(P.length - 2, Math.floor(t * (P.length - 1)));
    const u = t * (P.length - 1) - seg;
    return [P[seg][0] + (P[seg + 1][0] - P[seg][0]) * u, P[seg][1] + (P[seg + 1][1] - P[seg][1]) * u + Math.sin(u * Math.PI) * -24];
  };
  const [cx, cy] = pt(hp);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={DW * k} height={DH * k} viewBox={`0 0 ${DW} ${DH}`} style={{ overflow: 'visible' }}>
        {/* the checkbox at the end of both paths */}
        <rect x={1040} y={236} width={120} height={70} rx={6} fill={ui.white} />
        <rect x={1054} y={250} width={42} height={42} rx={3} fill="none" stroke="#C1C1C1" strokeWidth={3} />
        <path d={bot} fill="none" stroke={color.mute} strokeWidth={5} strokeDasharray="14 12" opacity={bp > 0 ? 1 : 0} strokeDashoffset={0} style={{ clipPath: `inset(0 ${100 - bp * 100}% 0 0)` }} />
        <path d={human} fill="none" stroke={color.red} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - hp} />
        {pauses && [[330, 330], [520, 210], [760, 300]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={12} fill="none" stroke={color.ink} strokeWidth={3} opacity={hp > (i + 1) / 5 ? 1 : 0} />)}
        <g transform={`translate(${cx - 4} ${cy - 4}) scale(1.4)`}><path d={cursorPath} fill="#fff" stroke="#000" strokeWidth={2.5} /></g>
        {bp > 0 && <g transform={`translate(${80 + (1032 - 80) * bp - 4} ${470 + (270 - 470) * bp - 4}) scale(1.4)`}><path d={cursorPath} fill={color.mute} stroke="#000" strokeWidth={2.5} /></g>}
      </svg>
    </div>
  );
};

/** reCAPTCHA v3's invisible verdict: a half-dial from 0.0 (bot) to 1.0 (human). The needle swings to `v1` on `at`, and drops to `v2` on `dropAt`. */
export const Score: React.FC<Box & { v1: number; v2?: number; at?: string | number; dropAt?: string | number }> = ({ w, h, v1, v2, at, dropAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const df = useCue(dropAt, 9999);
  const v = v1 * prog(frame, f, 24) + (v2 !== undefined ? (v2 - v1) * prog(frame, df, 18) : 0);
  const r = Math.min(w / 2 - 40, h - 150);
  const cx = w / 2, cy = h / 2 + r / 2 - 10;
  const ang = Math.PI * (1 - v);
  const arc = (a0: number, a1: number) => `M${cx + r * Math.cos(Math.PI * (1 - a0))} ${cy - r * Math.sin(Math.PI * (1 - a0))} A${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * (1 - a1))} ${cy - r * Math.sin(Math.PI * (1 - a1))}`;
  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h}>
        <path d={arc(0, 1)} fill="none" stroke={color.raised2} strokeWidth={26} strokeLinecap="round" />
        <path d={arc(0, 0.3)} fill="none" stroke={color.red} strokeWidth={26} strokeLinecap="round" opacity={0.85} />
        <path d={arc(0.7, 1)} fill="none" stroke={color.go} strokeWidth={26} strokeLinecap="round" opacity={0.85} />
        <line x1={cx} y1={cy} x2={cx + (r - 30) * Math.cos(ang)} y2={cy - (r - 30) * Math.sin(ang)} stroke={color.ink} strokeWidth={8} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={14} fill={color.ink} />
      </svg>
      <div style={{ position: 'absolute', left: cx - r - 30, top: cy + 26, ...mono(26, color.red) }}>0.0 bot</div>
      <div style={{ position: 'absolute', left: cx + r - 110, top: cy + 26, ...mono(26, color.go) }}>1.0 human</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy - r * 0.55, textAlign: 'center', fontFamily: font.mono, fontWeight: 700, fontSize: 64, color: color.ink }}>{v.toFixed(1)}</div>
    </div>
  );
};

/** reCAPTCHA's house-number challenge (around 2012–2014), drawn: a blurry street number on a wall, in the old two-panel strip.
 *  Illustration: the number is ours, not a real address. */
export const HouseNumber: React.FC<Box & { n: string; at?: string | number }> = ({ w, h, n, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const p = f <= 0 ? 1 : prog(frame, f, 12);
  const bw = Math.min(w - 40, 560);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: bw, background: ui.white, borderRadius: 6, padding: '24px 26px', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', borderTop: '10px solid #B5121B', opacity: p }}>
        <div style={{ height: 230, borderRadius: 3, overflow: 'hidden', position: 'relative', background: 'linear-gradient(180deg, #8E6B55 0%, #7A5A47 100%)',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 38px), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 3px, transparent 3px 76px)' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-4deg) skewX(-6deg)', background: '#1E2A33', padding: '10px 28px', borderRadius: 6, border: '4px solid #C9C2B4',
            fontFamily: font.serif, fontWeight: 700, fontSize: 120, color: '#EDE7DA', letterSpacing: '0.04em', filter: `blur(${2.4 - 1.2 * prog(frame, f + 10, 30)}px)` }}>{n}</div>
        </div>
        <div style={{ marginTop: 18, height: 54, border: `2px solid ${ui.line}`, borderRadius: 3, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: 'Arial', fontSize: 22, color: '#999' }}>Type the text:</div>
      </div>
    </div>
  );
};

/** Luis von Ahn's first idea: show a photo, type what is in it. The answer is typed in on `typeAt`; a red squiggle marks a misspelling on `wrongAt`. */
export const PhotoType: React.FC<Box & { img: string; focus?: string; text: string; typeAt?: string | number; wrongAt?: string | number }> = ({ w, h, img, focus = '50% 50%', text, typeAt, wrongAt }) => {
  const frame = useCurrentFrame();
  const tf = useCue(typeAt, 0);
  const wf = useCue(wrongAt, 9999);
  const shown = text.slice(0, Math.floor(text.length * prog(frame, tf, Math.max(10, text.length * 3))));
  const bw = Math.min(w - 40, 560);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: bw, background: ui.white, borderRadius: 6, padding: 20, boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ height: 300, overflow: 'hidden', borderRadius: 3 }}>
          <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus }} />
        </div>
        <div style={{ marginTop: 16, height: 70, border: `2px solid ${ui.line}`, borderRadius: 3, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: 'Arial', fontSize: 40, color: ui.text, position: 'relative' }}>
          <span style={{ position: 'relative' }}>{shown}
            {frame >= wf && <svg width={160} height={14} style={{ position: 'absolute', left: 0, bottom: -10 }}><path d="M0 7 Q10 0 20 7 T40 7 T60 7 T80 7 T100 7 T120 7 T140 7 T160 7" fill="none" stroke={color.red} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(frame, wf, 10)} /></svg>}
          </span>
          {shown.length < text.length && <span style={{ color: ui.blue, opacity: frame % 20 < 12 ? 1 : 0 }}>|</span>}
        </div>
      </div>
    </div>
  );
};

/** A street photo labelled the way training data is: red boxes draw on, each with a one-word tag, on its word. */
export const Labels: React.FC<Box & { img: string; iw: number; ih: number; boxes: { x: number; y: number; w: number; h: number; t: string; at?: string | number; plus?: number }[] }> = ({ w, h, img, iw, ih, boxes }) => {
  const frame = useCurrentFrame();
  const { words } = useBeat();
  const s = Math.min(w / iw, h / ih);
  const pw = iw * s, ph = ih * s;
  const fs = boxes.map((b, i) => useCue(b.at, 8 + i * 12) + (b.plus ?? 0)); // eslint-disable-line react-hooks/rules-of-hooks
  void words;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: pw, height: ph, position: 'relative', borderRadius: 6, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }}>
        <Img src={staticFile(img)} style={{ width: pw, height: ph, filter: 'saturate(0.85)' }} />
        {boxes.map((b, i) => {
          const p = prog(frame, fs[i], 10);
          return (
            <div key={i} style={{ position: 'absolute', left: b.x * pw, top: b.y * ph, width: b.w * pw, height: b.h * ph, border: `4px solid ${color.red}`, opacity: p, transform: `scale(${1.08 - 0.08 * p})` }}>
              <div style={{ position: 'absolute', left: -4, top: -40, background: color.red, color: '#fff', fontFamily: font.mono, fontWeight: 700, fontSize: 24, padding: '4px 10px', whiteSpace: 'nowrap' }}>{b.t}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** One photo, square-cropped like the challenge, with a ring drawing on around the thing whose edge is in question. */
export const Outline: React.FC<Box & { img: string; iw: number; ih: number; crop: { x: number; y: number; s: number }; box: { x: number; y: number; w: number; h: number }; at?: string | number }> = ({ w, h, img, iw, ih, crop, box, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 12);
  const side = Math.min(w, h);
  const s = side / crop.s;
  const z = 1 + 0.03 * prog(frame, 0, 120);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: side, height: side, position: 'relative', overflow: 'hidden', border: `6px solid ${ui.white}`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})` }}>
          <Img src={staticFile(img)} style={{ position: 'absolute', width: iw * s, height: ih * s, left: -crop.x * s, top: -crop.y * s, maxWidth: 'none' }} />
          <div style={{ position: 'absolute', left: (box.x - crop.x) * s, top: (box.y - crop.y) * s, width: box.w * s, height: box.h * s }}><Ring at={f} w={box.w * s} h={box.h * s} stroke={7} /></div>
        </div>
      </div>
    </div>
  );
};

/** What a failed invisible check feels like: a plain page that says you look like a robot, and an appeal button that is not there. Our own design. */
export const Blocked: React.FC<Box & { at?: string | number; noAt?: string | number }> = ({ w, h, at, noAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const nf = useCue(noAt, 9999);
  const bw = Math.min(w - 20, 640);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: bw, background: color.raised, border: `1.5px solid ${color.hairStrong}`, borderRadius: 10, padding: '36px 40px', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <svg width={160} height={160} viewBox="0 0 40 40" style={{ opacity: f <= 0 ? 1 : prog(frame, f, 8) }}><circle cx={20} cy={20} r={18} fill={color.red} /><path d="M13 13 L27 27 M27 13 L13 27" stroke="#fff" strokeWidth={4} strokeLinecap="round" /></svg>
        <div style={{ ...mono(40, color.ink) }}>access denied</div>
        <div style={{ position: 'relative', border: `2px dashed ${color.mute}`, borderRadius: 6, padding: '14px 48px', ...mono(36, color.mute), opacity: 0.7 }}>appeal
          <svg width={240} height={70} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><path d="M-10 62 L230 6" stroke={color.red} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(frame, nf, 10)} /></svg>
        </div>
      </div>
    </div>
  );
};

/** A few words quoted from a real document, on paper, typed in on their word. Always beside a picture (lint: word object). */
export const PageQuote: React.FC<Box & { text?: string; words?: string; at?: string | number; enter?: string | number; plate?: string }> = ({ w, h, text, words, at, enter, plate }) => {
  const frame = useCurrentFrame();
  const rawText = words ?? text ?? '';
  const f = useCue(at ?? enter, 0);
  const plain = rawText.replace(/\*/g, '');
  let left = Math.floor(plain.length * prog(frame, f, Math.max(14, plain.length * 1.2)));
  const parts = rawText.split(/(\*[^*]+\*)/).map((s, i) => {
    const hot = s.startsWith('*'); const t = hot ? s.slice(1, -1) : s; const shown = t.slice(0, Math.max(0, left)); left -= t.length;
    return <span key={i} style={{ color: hot ? color.redDeep : color.paperInk, background: hot ? color.marker : 'none' }}>{shown}</span>;
  });
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ width: Math.min(w - 40, 560), background: color.paper, backgroundImage: `url(${staticFile('paper.png')})`, backgroundBlendMode: 'multiply', padding: '46px 48px', boxSizing: 'border-box', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', transform: 'rotate(1.2deg)' }}>
        <div style={{ ...serif(48, color.paperInk, 600), lineHeight: 1.25 }}>“{parts}”</div>
      </div>
      {plate && <div style={{ ...mono(22, color.mute), letterSpacing: '0.04em' }}>{plate}</div>}
    </div>
  );
};
void hand;
