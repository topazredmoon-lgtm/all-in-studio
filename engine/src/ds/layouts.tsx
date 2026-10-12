/**
 * All-in design system, layer 3: the shots. A beat picks a layout; the layout places 1–2 visuals.
 *   split   – the v23 duo, enlarged: subject left (on frame 0), evidence right (lands on its cue word). The default.
 *   full    – one hero visual across the safe frame (flows, acronyms, number slams).
 *   chapter – real photo bleeding from the right, opaque column with the act title.
 *   clip    – archival footage, full frame, plate bottom-left, frozen at the cut.
 *   scene   – (2026-10-11, owner: "no cinema soul at all") one visual edge to edge, 1920 × 1080, with a film vignette;
 *             the visual paints its own picture (a real photo, a CCTV frame, a map). Caption on top as usual.
 * Hooks are `full` with ground "red" and a bare surface.
 */
import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Accent, Ground, KICK, Panel, Surface, enterStyle, hand, mono, prog, sans, serif, useBeat, useCue } from './core';
import { H, W, color, font, size, space, split } from './tokens';

export type VisualSpec = { v: string; k?: string; at?: string | number; enter?: string | number; surface?: Surface; plate?: string; pad?: number; [key: string]: unknown };
export type Registry = Record<string, React.FC<any>>;

const TAG = 66;
/** v6 (owner, 2026-10-07: "i dont want big text in an empty screen"): a number or a name is never the picture.
 *  It is a small handwritten red tag under the picture it belongs to, with a little arrow up to it, landing on its word. */
const Tag: React.FC<{ t: string; at?: string | number }> = ({ t, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const p = f <= 0 ? 1 : prog(frame, f, 8);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: TAG, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>
      <svg width={26} height={34}><path d="M13 32 L13 5 M4 13 L13 4 L22 13" fill="none" stroke={color.red} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{ ...hand(46, color.red, 700), whiteSpace: 'nowrap' }}>{t}</span>
    </div>
  );
};

/** ai-ban (owner, 2026-10-11: "put urself in the boots of the critical mind viewer"): a rubber stamp on the picture's top-right
 *  corner that says whether the claim is fact or fear. "real" = cream ink, anything else ("not yet", "fear", "false") = red.
 *  Lands on its word with a small thump (scale 1.5 → 1). */
const Stamp: React.FC<{ t: string; at?: string | number }> = ({ t, at }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const p = f <= 0 ? 1 : prog(frame, f, 7);
  const c = t.toLowerCase() === 'real' ? '#FAF6EE' : color.red;
  return (
    <div style={{ position: 'absolute', right: 30, top: 12, opacity: p, transform: `rotate(-8deg) scale(${1.5 - 0.5 * p})`, transformOrigin: 'center',
      border: `6px solid ${c}`, borderRadius: 12, padding: '6px 22px', ...mono(50, c), fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', background: 'rgba(20,18,16,0.75)', whiteSpace: 'nowrap' }}>{t}</div>
  );
};

const Visual: React.FC<{ reg: Registry; spec: VisualSpec; w: number; h: number }> = ({ reg, spec, w, h }) => {
  const C = reg[spec.v];
  if (!C) throw new Error(`unknown visual "${spec.v}"`);
  const { v, k, enter, surface, plate, pad, tag, ...rest } = spec as VisualSpec & { tag?: { t: string; at?: string | number }; stamp?: unknown };
  // a `stamp` object is the fact/fear stamp; a plain string stays the visual's own prop (Licence, AppStore)
  const stamp = typeof rest.stamp === 'object' && rest.stamp ? rest.stamp as { t: string; at?: string | number } : undefined;
  const props = stamp ? (({ stamp: _s, ...r }) => r)(rest) : rest;
  const p = surface === 'bare' ? 0 : (pad ?? 36);
  const ch = h - 2 * p - ((surface ?? 'card') === 'card' && k ? KICK : 0) - (tag ? TAG : 0);
  return (
    <div style={{ position: 'relative', width: w - 2 * p, height: h - 2 * p }}>
      <C {...props} w={w - 2 * p} h={ch} />
      {tag && <Tag t={tag.t} at={tag.at} />}
      {stamp && <Stamp t={stamp.t} at={stamp.at} />}
    </div>
  );
};

/** The v23 caption: handwritten (Shantell Sans 600, 54 px), lowercase, one red keyword (800), gentle 18-frame fade, held to the cut. */
export const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 75, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: op }}>
      <div style={{ ...hand(54, '#FAF6EE', 600), lineHeight: 1.25, letterSpacing: '-0.01em', textTransform: 'lowercase', textShadow: '0 3px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)' }}>
        {text.replace(/==([^=]+)==/g, '*$1*').split(/(\*[^*]+\*)/).map((seg, k) =>
          seg.startsWith('*') ? <span key={k} style={{ color: color.red, fontWeight: 800 }}>{seg.slice(1, -1)}</span> : <span key={k}>{seg}</span>)}
      </div>
    </div>
  );
};

/** v23 geometry (measured on captchas_v23 frames): object centres x 520 / 1400, y 450; objects about 575 px wide. */
const V23 = { lx: 520, rx: 1400, cy: 440, scale: 1 } as const;
/** v5 (owner, 2026-10-07 "engaging like v23"): objects drawn at full size, 700 × 640 per side, so a single picture fills its half. */
const SH = 640;

export const Split: React.FC<{ reg: Registry; L: VisualSpec; R: VisualSpec; cap?: string; act?: string }> = ({ reg, L, R, cap, act }) => {
  const frame = useCurrentFrame();
  const lf = useCue(L.enter, 0); // subject: on screen from frame 0 (no dip to an empty board)
  const rf = useCue(R.enter, 0); // evidence: on screen with the cut, or lands on its `enter` word
  const side = (s: VisualSpec, x: number, f: number) => (
    <div style={{ position: 'absolute', left: x, top: V23.cy - SH / 2, width: split.w, height: SH, transform: `scale(${V23.scale})`, ...enterStyle(frame, f) }}>
      <Panel w={split.w} h={SH} kicker={s.k} surface={s.surface} plate={s.plate} pad={s.pad}>
        <Visual reg={reg} spec={s} w={split.w} h={SH} />
      </Panel>
    </div>
  );
  return (
    <AbsoluteFill>
      <Ground act={act} />
      {side(L, V23.lx - split.w / 2, lf)}
      {side(R, V23.rx - split.w / 2, rf)}
      {cap && <Caption text={cap} />}
    </AbsoluteFill>
  );
};

export const Full: React.FC<{ reg: Registry; hero: VisualSpec; cap?: string; glow?: 'red' | 'warm'; bg?: string; bgFocus?: string; act?: string }> = ({ reg, hero, cap, glow, bg, bgFocus, act }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeat();
  const f = useCue(hero.enter, 0);
  const fw = W - 2 * 220;
  const fh = cap ? 680 : 820;
  return (
    <AbsoluteFill>
      <Ground glow={glow} act={act} />
      {bg && (
        <AbsoluteFill>
          <Img src={staticFile(bg)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: bgFocus ?? '50% 50%', filter: 'blur(3px) saturate(0.8)', transform: `scale(${1.04 + 0.03 * frame / Math.max(1, dur)})` }} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,11,9,0.78), rgba(12,11,9,0.86))' }} />
        </AbsoluteFill>
      )}
      <div style={{ position: 'absolute', left: 220, top: (cap ? V23.cy : H / 2 - 10) - fh / 2, width: fw, height: fh, transform: `scale(${V23.scale})`, ...enterStyle(frame, f) }}>
        <Panel w={fw} h={fh} kicker={hero.k} surface={hero.surface ?? 'bare'} plate={hero.plate} pad={hero.pad}>
          <Visual reg={reg} spec={hero} w={fw} h={fh} />
        </Panel>
      </div>
      {cap && <Caption text={cap} />}
    </AbsoluteFill>
  );
};

export const Chapter: React.FC<{ no: string; title: string; img?: string; credit?: string; focus?: string; at?: string }> = ({ no, title, at }) => {
  const frame = useCurrentFrame();
  const tf = useCue(at, 6);
  return (
    <AbsoluteFill>
      <Ground />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 96, color: color.red, letterSpacing: 8, ...enterStyle(frame, 0) }}>{String(no).padStart(2, '0')}</div>
        <div style={{ fontFamily: font.mono, fontWeight: 600, fontSize: 34, color: color.ink, letterSpacing: 10, textTransform: 'uppercase', textAlign: 'center', maxWidth: 1500, lineHeight: 1.4, ...enterStyle(frame, tf) }}>{title.replace(/[*~=]/g, '')}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Archival clip: the picture is the scene. Plays through its breathing room (build.py pre/post roll; owner 2026-10-11:
 *  word-tight chops and a frozen last frame looked "amateurish"); only freezes if the file itself runs out.
 *  Plate = a documentary lower third: "Name · who they are · where, when". It lands at `plateAt` s (default 0.5 s), stays 3.5 s. */
export const Clip: React.FC<{ src: string; from: number; to: number; hold?: number; plate?: string; plateAt?: number; fps: number }> = ({ src, from, to, hold, plate, plateAt, fps }) => {
  const frame = useCurrentFrame();
  const holdF = Math.round((Math.min(to, hold ?? to) - from) * fps) - 1;
  const video = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * fps)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const p0 = Math.round((plateAt ?? 0.5) * fps);
  const pl = interpolate(frame, [p0, p0 + 10, p0 + 105, p0 + 117], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const parts = (plate ?? '').split(' · ');
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {frame >= holdF ? <Freeze frame={holdF}>{video}</Freeze> : video}
      {plate && (
        <div style={{ position: 'absolute', left: 90, bottom: 110, display: 'flex', alignItems: 'stretch', gap: 18, opacity: pl, transform: `translateX(${(1 - pl) * -24}px)` }}>
          <div style={{ width: 8, background: color.red, borderRadius: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 22px 12px 4px', background: 'linear-gradient(90deg, rgba(8,9,12,0.82), rgba(8,9,12,0.55))' }}>
            <span style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>{parts[0]}</span>
            {parts.length > 1 && <span style={{ fontFamily: font.mono, fontSize: 22, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{parts.slice(1).join(' · ')}</span>}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Full-bleed scene: the visual fills the frame; a soft vignette and a darker foot keep the caption readable. */
export const Scene: React.FC<{ reg: Registry; hero: VisualSpec; cap?: string }> = ({ reg, hero, cap }) => {
  const C = reg[hero.v];
  if (!C) throw new Error(`unknown visual "${hero.v}"`);
  const { v, k, enter, surface, plate, pad, tag, ...props } = hero as VisualSpec & { tag?: unknown };
  return (
    <AbsoluteFill style={{ background: '#050505' }}>
      <C {...props} w={W} h={H} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
      {cap && <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />}
      {cap && <Caption text={cap} />}
    </AbsoluteFill>
  );
};
