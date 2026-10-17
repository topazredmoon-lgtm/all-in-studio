/**
 * All-in design system, layer 2: primitives every visual is built from.
 * Word sync lives here: `useCue('word')` returns the frame (inside the beat) where that word lands.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { H, W, color, font, motion, shadow, size } from './tokens';

// ---------- fonts (local woff2, no network at render time) ----------
const FACES: [string, string, string][] = [
  ['AllinSerif', 'fonts/source-serif-4-latin-standard-normal.woff2', 'normal'],
  ['AllinSerif', 'fonts/source-serif-4-latin-standard-italic.woff2', 'italic'],
  ['AllinSans', 'fonts/archivo-latin-standard-normal.woff2', 'normal'],
  ['AllinHand', 'fonts/shantell-sans-var.woff2', 'normal'],
];
const STATIC: [string, string, string][] = [
  ['AllinBody', 'fonts/inter-400.woff2', '400'],
  ['AllinBody', 'fonts/inter-600.woff2', '600'],
  ['AllinMono', 'fonts/ibm-plex-mono-400.woff2', '400'],
  ['AllinMono', 'fonts/ibm-plex-mono-700.woff2', '700'],
];
export const Fonts: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = FACES.map(([fam, f, style]) => new FontFace(fam, `url(${staticFile(f)})`, { style, weight: '100 900' }));
    STATIC.forEach(([fam, f, weight]) => faces.push(new FontFace(fam, `url(${staticFile(f)})`, { weight })));
    Promise.all(faces.map((f) => f.load())).then((ls) => { ls.forEach((f) => document.fonts.add(f)); continueRender(h); });
  }, [h]);
  return null;
};

// ---------- word sync ----------
export type Word = { w: string; f: number };
export const BeatCtx = createContext<{ words: Word[]; dur: number }>({ words: [], dur: 300 });
export const useBeat = () => useContext(BeatCtx);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9$%]/g, '');
const ALLOWED_SUFFIXES = new Set(['s', 'es', 'd', 'ed', 'ing', 'er', 'ers', 'ly']);
const matchWord = (wn: string, kn: string) =>
  wn === kn || (kn.length >= 4 && wn.startsWith(kn) && ALLOWED_SUFFIXES.has(wn.slice(kn.length)));

/** Frame where `key` is spoken (minus the cue lead). Numbers pass through. "word#2" = 2nd occurrence. Missing word = fallback. */
export const cueFrame = (words: Word[], key: string | number | undefined, fallback: number): number => {
  if (typeof key === 'number') return key;
  if (!key || typeof key !== 'string') return fallback;
  const [k, nth] = key.split('#');
  const want = norm(k);
  const targetN = Number(nth ?? 1);
  let seen = 0;
  for (const w of words) {
    if (matchWord(norm(w.w), want)) {
      seen++;
      if (seen >= targetN) return Math.max(0, w.f - motion.cueLead);
    }
  }
  seen = 0;
  for (const w of words) {
    if (norm(w.w).startsWith(want)) {
      seen++;
      if (seen >= targetN) return Math.max(0, w.f - motion.cueLead);
    }
  }
  return fallback;
};
export const useCue = (key: string | number | undefined, fallback = 0) => cueFrame(useBeat().words, key, fallback);

// ---------- motion ----------
const ease = Easing.bezier(...motion.ease);
export const prog = (frame: number, start: number, dur: number = motion.enter) =>
  interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/** Standard entrance: fade + rise + de-blur. Elements due at frame 0 are fully visible on frame 0 (no dip to an empty board). */
export const enterStyle = (frame: number, at: number, opts: { rise?: number; blur?: boolean } = {}): React.CSSProperties => {
  if (at <= 0) return {};
  const p = prog(frame, at);
  const rise = opts.rise ?? motion.rise;
  return { opacity: p, transform: `translateY(${(1 - p) * rise * 0.5}px)` }; // v23: a gentle fade, no blur
};

export const Enter: React.FC<{ at?: string | number; fb?: number; style?: React.CSSProperties; children: React.ReactNode; rise?: number }> = ({ at, fb = 0, style, children, rise }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, fb);
  return <div style={{ ...style, ...enterStyle(frame, f, { rise }) }}>{children}</div>;
};

/** Counter that rolls up as the number is spoken. */
export const useCount = (to: number, at: string | number | undefined, fb = 0, dur: number = motion.count) => {
  const frame = useCurrentFrame();
  const f = useCue(at, fb);
  return to * prog(frame, f, dur);
};
export const fmt = (n: number, dp = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

// ---------- type ----------
export const hand = (px: number, c: string = color.ink, w = 600): React.CSSProperties => ({
  fontFamily: font.hand, fontSize: px, fontWeight: w, color: c, lineHeight: 1.2, letterSpacing: '-0.01em',
});
export const mono = (px: number = size.label, c: string = color.mute): React.CSSProperties => ({
  fontFamily: font.mono, fontSize: px, letterSpacing: '0.12em', textTransform: 'uppercase', color: c, lineHeight: 1.25,
});
export const serif = (px: number, c: string = color.ink, w = 600): React.CSSProperties => ({
  fontFamily: font.serif, fontSize: px, fontWeight: w, color: c, lineHeight: 1.08, letterSpacing: '-0.015em', textWrap: 'balance' as any,
});
/** v23 print: card text and big numbers in IBM Plex Mono (bold for figures). Inter is kept for re-created UI only (`ui`). */
export const sans = (px: number, c: string = color.ink, w = 600): React.CSSProperties => ({
  fontFamily: font.mono, fontSize: px * 0.92, fontWeight: w >= 650 ? 700 : 400, letterSpacing: '-0.02em', color: c, lineHeight: 1.15, fontVariantNumeric: 'tabular-nums lining-nums',
});

/** Signal semantics in text: *word* = human red, ~word~ = machine cyan, ==word== = the key word on a yellow highlighter block. */
export const Accent: React.FC<{ text: string; accent?: string }> = ({ text, accent = color.red }) => (
  <>
    {text.split(/(\*[^*]+\*|~[^~]+~|==[^=]+==)/).map((s, i) => {
      if (s.startsWith('==')) return <span key={i} style={{ color: accent }}>{s.slice(2, -2)}</span>;
      if (s.startsWith('*')) return <span key={i} style={{ color: accent }}>{s.slice(1, -1)}</span>;
      if (s.startsWith('~')) return <span key={i} style={{ color: color.cyan }}>{s.slice(1, -1)}</span>;
      return <span key={i}>{s}</span>;
    })}
  </>
);

/** Signal sticker: a tilted yellow label that slaps on at its word (Archivo 800, uppercase). Placed in free space, never over content. */
export const Sticker: React.FC<{ at: number; text: string; rotate?: number; px?: number; bg?: string; fg?: string }> = ({ at, text, rotate = -4, px = 56, bg = color.yellow, fg = color.onYellow }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 5], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  return (
    <div style={{ display: 'inline-block', background: bg, color: fg, fontFamily: font.display, fontWeight: 800, fontSize: px, letterSpacing: '-0.01em', textTransform: 'uppercase',
      padding: '6px 22px', transform: `rotate(${rotate}deg) scale(${1.25 - 0.25 * p})`, opacity: p, boxShadow: '0 10px 24px rgba(0,0,0,0.45)', lineHeight: 1.05 }}>{text}</div>
  );
};

// ---------- ground (copied from v23: jolly-bell src/AmbientLayer.tsx) ----------
/** v23 board: warm black, 96 px dot grid at 10 %, four rounded registration corners at 54 px, soft vignette. No act label, no glow. */
const DOTS = (() => { const out: [number, number][] = []; for (let y = 96; y < H; y += 96) for (let x = 96; x < W; x += 96) out.push([x, y]); return out; })();
export const Ground: React.FC<{ glow?: 'red' | 'warm'; act?: string }> = ({ act }) => (
  <AbsoluteFill style={{ background: color.stage }}>
    {act && ( // minimal print (Design System Reels): a tiny act kicker top-left, red number, quiet title
      <div style={{ position: 'absolute', left: 92, top: 44, fontFamily: font.mono, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: color.mute, opacity: 0.75 }}>
        <span style={{ color: color.red, fontWeight: 700 }}>{act.split(' ')[0]}</span> {act.split(' ').slice(1).join(' ')}
      </div>
    )}
    <svg width={W} height={H} style={{ position: 'absolute', opacity: 0.1 }}>
      {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill={color.ink} />)}
    </svg>
    {[[54, 54, 1, 1], [W - 54, 54, -1, 1], [54, H - 60, 1, -1], [W - 54, H - 60, -1, -1]].map(([x, y, dx, dy], i) => (
      <svg key={i} width={22} height={22} style={{ position: 'absolute', left: x - 11, top: y - 11, opacity: 0.22 }}>
        <path d={`M${dx > 0 ? 3 : 19} 11 L${dx > 0 ? 3 : 19} ${dy > 0 ? 3 : 19} L11 ${dy > 0 ? 3 : 19}`} fill="none" stroke={color.mute} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ))}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)' }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile('grain.png')})`, backgroundPosition: `${(frame * 37) % 200}px ${(frame * 61) % 200}px`, opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none' }} />;
};

// ---------- panel (the v23 card) ----------
export type Surface = 'card' | 'paper' | 'bare';
export const KICK = 40; // height the in-card kicker takes
/** v23 card: warm charcoal, 1.5 px cream-chalk border, tiny mono caps title inside the top-left; the source sits under the card as a quiet mono line. */
export const Panel: React.FC<{ w: number; h: number; kicker?: string; surface?: Surface; plate?: string; children: React.ReactNode; pad?: number }> = ({ w, h, kicker, surface = 'card', plate, children, pad = 36 }) => {
  const paper = surface === 'paper';
  const card = surface === 'card';
  const box: React.CSSProperties = surface === 'bare' ? {} : {
    background: paper ? color.paper : color.raised,
    border: paper ? 'none' : `1.5px solid ${color.hairStrong}`,
    borderRadius: paper ? 2 : 10,
    boxShadow: paper ? shadow.paper : shadow.card,
    backgroundImage: paper ? `url(${staticFile('paper.png')})` : undefined,
    backgroundBlendMode: paper ? 'multiply' : undefined,
  };
  const kick = card && kicker;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'hidden', ...box }}>
        {kick && <div style={{ position: 'absolute', left: 28, top: 22, fontFamily: font.mono, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color: color.mute }}>{kicker}</div>}
        <div style={{ position: 'absolute', inset: 0, padding: surface === 'bare' ? 0 : pad, paddingTop: (surface === 'bare' ? 0 : pad) + (kick ? KICK : 0) }}>{children}</div>
      </div>
      {plate && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: h + 18, textAlign: 'center', fontFamily: font.mono, fontSize: 22, color: color.mute, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{plate.toLowerCase()}</div>
      )}
    </div>
  );
};

/** v23 polaroid: dark charcoal frame with a chalk border, black-and-white photo, the name in a mono pill under it. */
export const Print: React.FC<{ src: string; w: number; h: number; credit?: string; focus?: string; rotate?: number; zoom?: number }> = ({ src, w, h, credit, focus = '50% 40%', rotate = 0, zoom = 1 }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeat();
  const z = zoom + 0.035 * (frame / Math.max(1, dur)); // photos may drift ≤ 4 %; text never does
  return (
    <div style={{ width: w, height: h, background: color.raised, border: `1.5px solid ${color.hairStrong}`, borderRadius: 8, padding: 14, paddingBottom: credit ? 70 : 14, boxShadow: shadow.card, transform: `rotate(${rotate}deg)`, position: 'relative' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${z})`, transformOrigin: focus, filter: 'grayscale(1) contrast(1.05)' }} />
      </div>
      {credit && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 20, color: color.ink, border: `1.5px solid ${color.hairStrong}`, borderRadius: 4, padding: '6px 16px', background: color.stage, whiteSpace: 'nowrap', maxWidth: w - 40, overflow: 'hidden' }}>{credit}</div>
        </div>
      )}
    </div>
  );
};

/** Hand-drawn-free ring that draws on around a target, as the word is spoken. */
export const Ring: React.FC<{ at: number; w: number; h: number; c?: string; stroke?: number }> = ({ at, w, h, c = color.red, stroke = 6 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, motion.sweep + 4);
  return (
    <svg width={w + 24} height={h + 24} style={{ position: 'absolute', left: -12, top: -12, overflow: 'visible' }}>
      <ellipse cx={(w + 24) / 2} cy={(h + 24) / 2} rx={w / 2 + 6} ry={h / 2 + 6} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Underline that sweeps left→right under a phrase. */
export const Sweep: React.FC<{ at: number; c?: string; h?: number; children: React.ReactNode; marker?: boolean }> = ({ at, c = color.red, h = 5, children, marker }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, motion.sweep);
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      {marker && <span style={{ position: 'absolute', left: -4, right: -4, top: '8%', bottom: '4%', background: color.marker, mixBlendMode: 'multiply', transformOrigin: 'left', transform: `scaleX(${p})`, zIndex: 0 }} />}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      {!marker && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: h, background: c, transformOrigin: 'left', transform: `scaleX(${p})` }} />}
    </span>
  );
};

/** Ink stamp that slams (6 frames, no overshoot). */
export const Stamp: React.FC<{ at: number; text: string; c?: string; rotate?: number; px?: number }> = ({ at, text, c = color.red, rotate = -8, px = 44 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 6], [0, 1], { extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  return (
    <div style={{ display: 'inline-block', border: `5px solid ${c}`, color: c, padding: '6px 22px', fontFamily: font.mono, fontWeight: 700, fontSize: px, letterSpacing: '0.14em', textTransform: 'uppercase',
      transform: `rotate(${rotate}deg) scale(${1.6 - 0.6 * p})`, opacity: p, borderRadius: 6, mixBlendMode: 'normal' }}>{text}</div>
  );
};

export const Check: React.FC<{ ok: boolean; px?: number }> = ({ ok, px = 40 }) => (
  <svg width={px} height={px} viewBox="0 0 40 40">
    <circle cx={20} cy={20} r={18} fill={ok ? color.teal : color.red} />
    {ok ? <path d="M11 21 l6 6 l12 -14" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M13 13 L27 27 M27 13 L13 27" stroke="#fff" strokeWidth={4} strokeLinecap="round" />}
  </svg>
);
