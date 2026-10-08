/**
 * Topic visuals: CAPTCHAs (v5 cut, 2026-10-07). Re-created third-party UI (reCAPTCHA) keeps its own colours (`ui`);
 * everything else comes from ds/ (tokens, core, kit). One idea per visual, at most one or two words in it:
 * the narrator carries the information. Catalogue: design-system/VISUALS.md.
 */
import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Ring, Stamp, hand, mono, prog, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';

export { LineIcon, IconRow, Count, CalendarCard, Bubble, Bars, Polaroid, Word } from '../ds/kit';

type Box = { w: number; h: number };
// reCAPTCHA v2's own UI colours (measured on the WSJ clip and google.com/recaptcha), only inside the re-created widget
const ui = { white: '#FFFFFF', line: '#DFDFDF', text: '#222222', blue: '#1A73E8', icon: '#555555', check: '#1A73E8' };

// ---------------------------------------------------------------- the real 4×4 "squares" challenge
/** One street photo cut into 4 × 4 squares (as reCAPTCHA really does it), not nine unrelated photos.
 *  `picks` select one after another from `pickAt`; `ring` circles the ambiguous square on `ringAt`; a cursor hovers it. */
export const Captcha4: React.FC<Box & { img: string; crop: { x: number; y: number; s: number }; iw: number; ih: number; target: string; picks?: number[]; pickAt?: string | number; every?: number; ring?: number; ringAt?: string | number; wrong?: number; wrongAt?: string | number; button?: string }> =
  ({ w, h, img, crop, iw, ih, target, picks = [], pickAt, every = 6, ring, ringAt, wrong, wrongAt, button = 'VERIFY' }) => {
  const frame = useCurrentFrame();
  const pf = useCue(pickAt, 0);
  const rf = useCue(ringAt, 9999);
  const wf = useCue(wrongAt, 9999);
  // design size 520 × 760 (real widget proportions), scaled to fit the panel
  const DW = 520, DH = 760;
  const k = Math.min(w / DW, h / DH);
  const pad = 8, head = 150, foot = 74;
  const gw = DW - 2 * pad, cell = (gw - 3 * 3) / 4;
  const sc = gw / crop.s; // photo px → design px
  const pickF = (i: number) => { const n = picks.indexOf(i); return n < 0 ? 1e9 : pf + n * every; };
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: DW, height: DH, transform: `scale(${k})`, flexShrink: 0, background: ui.white, borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.55)', position: 'relative', fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div style={{ position: 'absolute', left: pad, top: pad, right: pad, height: head, background: ui.blue, color: ui.white, padding: '22px 26px', boxSizing: 'border-box' }}>
          <div style={{ fontSize: 22 }}>Select all squares with</div>
          <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>{target}</div>
          <div style={{ fontSize: 18, marginTop: 6 }}>If there are none, click skip</div>
        </div>
        <div style={{ position: 'absolute', left: pad, top: pad + head + 6, width: gw, height: gw }}>
          {Array.from({ length: 16 }, (_, i) => {
            const r = Math.floor(i / 4), c = i % 4;
            const x = c * (cell + 3), y = r * (cell + 3);
            const sel = prog(frame, pickF(i), 5);
            const inset = 14 * sel;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y, width: cell, height: cell }}>
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `scale(${1 - (2 * inset) / cell})` }}>
                  <Img src={staticFile(img)} style={{ position: 'absolute', width: iw * sc, height: ih * sc, left: -(crop.x * sc + x), top: -(crop.y * sc + y), maxWidth: 'none' }} />
                </div>
                {sel > 0 && (
                  <svg width={34} height={34} viewBox="0 0 34 34" style={{ position: 'absolute', left: 2, top: 2, transform: `scale(${sel})` }}>
                    <circle cx={17} cy={17} r={16} fill={ui.check} stroke={ui.white} strokeWidth={2} /><path d="M9 17.5 l5.5 5.5 l10 -11" stroke={ui.white} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {wrong === i && frame >= wf && (
                  <svg width={cell} height={cell} style={{ position: 'absolute', left: 0, top: 0, opacity: prog(frame, wf, 5) }}>
                    <rect x={2} y={2} width={cell - 4} height={cell - 4} fill="none" stroke={color.red} strokeWidth={5} />
                  </svg>
                )}
                {ring === i && <Ring at={rf} w={cell} h={cell} stroke={7} />}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: pad, right: pad, bottom: pad, height: foot - 10, borderTop: `1px solid ${ui.line}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 10px' }}>
          {/* reload, audio, info */}
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M17.6 6.4A8 8 0 1 0 19.7 14h-2.1a6 6 0 1 1-1.4-6.2L13 11h7V4z" fill={ui.icon} /></svg>
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9v7a2 2 0 0 0 2 2h3v-8H5v-1a7 7 0 0 1 14 0v1h-3v8h3a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z" fill={ui.icon} /></svg>
          <svg width={30} height={30} viewBox="0 0 24 24"><circle cx={12} cy={12} r={9} fill="none" stroke={ui.icon} strokeWidth={2} /><path d="M12 10.5v6M12 7.2v.1" stroke={ui.icon} strokeWidth={2.4} strokeLinecap="round" /></svg>
          <div style={{ flex: 1 }} />
          <div style={{ background: ui.blue, color: ui.white, fontWeight: 700, fontSize: 22, letterSpacing: '0.05em', padding: '12px 28px', borderRadius: 3 }}>{button}</div>
        </div>
        {ring !== undefined && frame >= rf - 30 && (() => { // the cursor hesitates over the ambiguous square
          const r = Math.floor(ring / 4), c = ring % 4;
          const cx = pad + c * (cell + 3) + cell * 0.62, cy = pad + head + 6 + r * (cell + 3) + cell * 0.6;
          const p = prog(frame, rf - 30, 22);
          const wob = Math.sin(frame / 5) * 6 * p;
          return <svg width={44} height={56} style={{ position: 'absolute', left: cx + 120 * (1 - p) + wob, top: cy + 140 * (1 - p) }}><path d="M3 3 L3 44 L13 34 L22 52 L29 49 L20 31 L35 31 Z" fill="#fff" stroke="#000" strokeWidth={2.5} /></svg>;
        })()}
      </div>
    </div>
  );
};

/** One square of that challenge, pulled out big: the sliver of a traffic light in its corner, and the question. */
export const Square: React.FC<Box & { img: string; crop: { x: number; y: number; s: number }; iw: number; ih: number; tile: number; mark: { x: number; y: number; w: number; h: number }; at?: string | number; q?: string; qAt?: string | number }> = ({ w, h, img, crop, iw, ih, tile, mark, at, q, qAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 6);
  const qf = useCue(qAt, 18);
  const side = Math.min(w, h - 90);
  const ts = crop.s / 4; // tile size in photo px
  const tx = crop.x + (tile % 4) * ts, ty = crop.y + Math.floor(tile / 4) * ts;
  const s = side / ts;
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <div style={{ position: 'relative', width: side, height: side, border: `6px solid ${ui.white}`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)', overflow: 'hidden', flexShrink: 0 }}>
        <Img src={staticFile(img)} style={{ position: 'absolute', width: iw * s, height: ih * s, left: -tx * s, top: -ty * s }} />
        <div style={{ position: 'absolute', left: mark.x * side, top: mark.y * side, width: mark.w * side, height: mark.h * side }}><Ring at={f} w={mark.w * side} h={mark.h * side} stroke={7} /></div>
      </div>
      {q && <div style={{ ...hand(60, color.red, 800), opacity: prog(frame, qf, 8) }}>{q}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- reCAPTCHA checkbox
/** The real "I'm not a robot" widget (google.com/recaptcha capture); a cursor arrives and ticks it on `clickAt`. */
export const Checkbox: React.FC<Box & { clickAt?: string | number; scale?: number }> = ({ w, h, clickAt, scale = 1 }) => {
  const frame = useCurrentFrame();
  const cf = useCue(clickAt, 9999);
  const bw = Math.min(w, 940) * scale, k = bw / 620;
  const p = prog(frame, cf - 16, 16);
  const done = frame >= cf;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: bw, height: 180 * k }}>
        <Img src={staticFile('captchas/recaptcha_checkbox_hero.png')} style={{ width: bw, height: 180 * k, borderRadius: 4, boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }} />
        {done && <div style={{ position: 'absolute', left: 30 * k, top: 58 * k, width: 66 * k, height: 66 * k, background: '#F9F9F9' }}>
          <svg width={66 * k} height={66 * k} viewBox="0 0 66 66"><path d="M12 34 L27 49 L56 14" stroke="#009E55" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(frame, cf, 7)} /></svg></div>}
        {clickAt !== undefined && <svg width={44 * k} height={56 * k} viewBox="0 0 44 56" style={{ position: 'absolute', left: (62 + 260 * (1 - p)) * k, top: (95 + 160 * (1 - p)) * k, transform: `scale(${frame >= cf && frame < cf + 5 ? 0.9 : 1})` }}><path d="M3 3 L3 44 L13 34 L22 52 L29 49 L20 31 L35 31 Z" fill="#fff" stroke="#000" strokeWidth={2.5} /></svg>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the old two-word reCAPTCHA
const Warped: React.FC<{ word: string; id: string; px?: number; w: number }> = ({ word, id, px = 92, w }) => (
  <svg width={w} height={px * 1.5}>
    <defs><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves={2} seed={7} /><feDisplacementMap in="SourceGraphic" scale={px * 0.3} /></filter></defs>
    <line x1={14} y1={px * 0.88} x2={w - 14} y2={px * 0.72} stroke={ui.text} strokeWidth={3} filter={`url(#${id})`} />
    <text x={w / 2} y={px * 1.04} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={px} fill={ui.text} filter={`url(#${id})`}>{word}</text>
  </svg>
);

/** reCAPTCHA v1 (2007–2014): two warped words on one strip. `one` rings the known word (teal), `two` the word from a book (red). */
export const TwoWords: React.FC<Box & { a: string; b: string; oneAt?: string | number; twoAt?: string | number; only?: 'a' | 'b'; ok?: boolean; okAt?: string | number; redact?: boolean; expand?: string; expandAt?: string | number; expandEndAt?: string | number }> = ({ w, h, a, b, oneAt, twoAt, only, ok, okAt, redact, expand, expandAt, expandEndAt }) => {
  const frame = useCurrentFrame();
  const af = useCue(oneAt, 9999), bf = useCue(twoAt, 9999), of = useCue(okAt, 9999), xf = useCue(expandAt, 12);
  const nx = expand ? expand.split(' ').length : 1, xe = useCue(expandEndAt, xf + (nx - 1) * 3), xstep = (xe - xf) / Math.max(1, nx - 1);
  const words = only ? [only === 'a' ? a : b] : [a, b];
  const ww = Math.min(only ? 520 : 330, (w - 80) / words.length);
  const px = only ? 96 : 64;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: ui.white, borderRadius: 6, padding: '26px 30px', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', borderTop: `10px solid #B5121B`, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 24, background: '#F4F4F4', padding: '10px 0' }}>
          {words.map((wd, i) => {
            const at = only ? (only === 'a' ? af : bf) : i === 0 ? af : bf;
            const c = (only ? only === 'a' : i === 0) ? color.teal : color.red;
            const hide = redact && (only ? only === 'b' : i === 1); // the offensive word is never shown (captchas-full b06)
            return <div key={i} style={{ position: 'relative' }}>{hide ? <div style={{ width: ww, height: px * 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: ww * 0.8, height: px * 0.7, background: '#111', transform: 'rotate(-2deg)' }} /></div> : <Warped word={wd} id={`tw-${wd}`} w={ww} px={px} />}<Ring at={at} w={ww} h={px * 1.5} c={c} /></div>;
          })}
        </div>
        {!only && <div style={{ marginTop: 18, height: 54, border: `2px solid ${ui.line}`, borderRadius: 3, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: 'Arial', fontSize: 22, color: '#999' }}>Type the two words:</div>}
        {expand && (
          // owner note 2026-10-08: say what the initials stand for the first time CAPTCHA is named. Small, under the picture;
          // capitals (the initials) in red, words appear one by one; with expandEndAt they keep pace with the narrator reading them (note 2026-10-08b).
          <div style={{ position: 'absolute', left: -60, right: -60, top: '100%', marginTop: 34, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 12, rowGap: 6,
            fontFamily: font.mono, fontSize: 27, color: color.ink, letterSpacing: '0.02em' }}>
            {expand.split(' ').map((wd, i) => (
              <span key={i} style={{ opacity: prog(frame, xf + i * xstep, 6) }}>
                {wd.split('').map((ch, j) => <span key={j} style={/[A-Z]/.test(ch) ? { color: color.red, fontWeight: 700 } : { color: color.mute }}>{ch}</span>)}
              </span>
            ))}
          </div>
        )}
        {ok !== undefined && frame >= of && (
          <svg width={70} height={70} viewBox="0 0 40 40" style={{ position: 'absolute', right: -24, top: -34, transform: `scale(${1.3 - 0.3 * prog(frame, of, 6)})` }}>
            <circle cx={20} cy={20} r={18} fill={ok ? color.go : color.red} />
            {ok ? <path d="M11 21 l6 6 l12 -14" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <text x={20} y={28} textAnchor="middle" fontFamily={font.hand} fontWeight={800} fontSize={24} fill="#fff">?</text>}
          </svg>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- real pages as proof
/** A real page capture, cropped to the proving passage, with a red box drawing on at its word. */
export const PageCrop: React.FC<Box & { img: string; iw: number; ih: number; crop: { x: number; y: number; w: number; h: number }; box?: { x: number; y: number; w: number; h: number }; boxAt?: string | number; underline?: boolean }> = ({ w, h, img, iw, ih, crop, box, boxAt, underline }) => {
  const frame = useCurrentFrame();
  const bf = useCue(boxAt, 12);
  const s = Math.min(w / crop.w, h / crop.h);
  const p = prog(frame, bf, 10);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: crop.w * s, height: crop.h * s, overflow: 'hidden', position: 'relative', background: '#fff', borderRadius: 4, boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }}>
        <Img src={staticFile(img)} style={{ position: 'absolute', width: iw * s, height: ih * s, left: -crop.x * s, top: -crop.y * s }} />
        {box && (underline
          ? <div style={{ position: 'absolute', left: (box.x - crop.x) * s, top: (box.y - crop.y + box.h) * s + 2, width: box.w * s * p, height: 6, background: color.red }} />
          : <div style={{ position: 'absolute', left: (box.x - crop.x) * s - 8, top: (box.y - crop.y) * s - 6, width: box.w * s + 16, height: box.h * s + 12, border: `5px solid ${color.red}`, borderRadius: 6, opacity: p, transform: `scale(${1.06 - 0.06 * p})` }} />)}
      </div>
    </div>
  );
};

/** A paper receipt: one title, one row, an ink stamp on its word. */
export const Receipt: React.FC<Box & { title: string; k: string; stamp: string; stampAt?: string | number }> = ({ w, h, title, k, stamp, stampAt }) => {
  const sf = useCue(stampAt, 20);
  const rw = Math.min(w, 520);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: rw, background: color.paper, backgroundImage: `url(${staticFile('paper.png')})`, backgroundBlendMode: 'multiply', padding: '40px 44px 54px', boxSizing: 'border-box', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', transform: 'rotate(-1.5deg)', fontFamily: font.mono, color: color.paperInk }}>
        <div style={{ textAlign: 'center', fontSize: 40, fontWeight: 700, letterSpacing: '0.16em' }}>{title}</div>
        <div style={{ borderTop: `3px dashed ${color.paperMute}`, margin: '26px 0 30px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 36, position: 'relative', height: 90 }}>
          <span style={{ color: color.paperMute }}>{k}</span>
          <div style={{ position: 'absolute', right: -6, top: 4 }}><Stamp at={sf} text={stamp} c={color.redDeep} px={36} /></div>
        </div>
      </div>
    </div>
  );
};

/** A 10-second ring that fills as the number is said. */
export const Stopwatch: React.FC<Box & { secs: number; at?: string | number }> = ({ w, h, secs, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const p = prog(frame, f, 30);
  const r = Math.min(w, h) / 2 - 30;
  const L = 2 * Math.PI * r;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={2 * r + 40} height={2 * r + 40}>
        <circle cx={r + 20} cy={r + 20} r={r} fill="none" stroke={color.raised2} strokeWidth={18} />
        <circle cx={r + 20} cy={r + 20} r={r} fill="none" stroke={color.red} strokeWidth={18} strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-90 ${r + 20} ${r + 20})`} strokeLinecap="round" />
        <text x={r + 20} y={r + 52} textAnchor="middle" fontFamily={font.mono} fontWeight={700} fontSize={110} fill={color.ink}>{Math.max(1, Math.round(secs * p))}s</text>
      </svg>
    </div>
  );
};

/** Two documents, English → Spanish, an arrow drawing between them as learners translate. */
export const Translate: React.FC<Box & { at?: string | number }> = ({ w, h, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const p = prog(frame, f, 18);
  const doc = (lang: string, fill: number) => (
    <div style={{ width: 240, height: 320, background: color.paper, borderRadius: 4, padding: '30px 28px', boxSizing: 'border-box', boxShadow: '0 14px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 44, color: color.paperInk }}>{lang}</div>
      {[1, 0.8, 1, 0.6, 0.9].map((lw, i) => <div key={i} style={{ height: 8, width: `${lw * 100 * Math.min(1, Math.max(0, fill * 5 - i))}%`, background: i < 2 ? color.redDeep : color.paperMute, borderRadius: 4 }} />)}
    </div>
  );
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      {doc('EN', 1)}
      <svg width={110} height={40}><path d="M6 20 L96 20 M82 8 L98 20 L82 32" fill="none" stroke={color.red} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
      {doc('ES', prog(frame, f + 8, 40))}
    </div>
  );
};

/** Who paid: a name in plain type (never a logo) and a coin dropping on its word. */
export const Payer: React.FC<Box & { names: { t: string; at?: string | number }[] }> = ({ w, h, names }) => {
  const frame = useCurrentFrame();
  const fs = names.map((n) => useCue(n.at, 0)); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
      {names.map((n, i) => {
        const p = prog(frame, fs[i], 10);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: fs[i] <= 0 ? 1 : p }}>
            <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 104, color: color.ink, minWidth: 560, textAlign: 'right' }}>{n.t}</div>
            <svg width={120} height={120} viewBox="0 0 200 200" style={{ transform: `translateY(${-30 * (1 - p)}px)` }}><circle cx={100} cy={100} r={80} fill="none" stroke={color.red} strokeWidth={10} /><path d="M124 66 C112 56 80 56 78 76 C76 96 124 96 122 120 C120 142 86 142 76 130 M100 46 L100 154" fill="none" stroke={color.red} strokeWidth={10} strokeLinecap="round" /></svg>
          </div>
        );
      })}
    </div>
  );
};

/** A full-bleed photo inside the frame (no card), drifting ≤ 4 %. */
export const Photo: React.FC<Box & { img: string; focus?: string; gray?: boolean }> = ({ w, h, img, focus = '50% 50%', gray }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', borderRadius: 8, boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }}>
      <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${1.02 + 0.0004 * frame})`, transformOrigin: focus, filter: gray ? 'grayscale(1) contrast(1.05)' : 'saturate(0.85)' }} />
    </div>
  );
};

export const Noop: React.FC<Box> = () => null;
void interpolate; void mono;
