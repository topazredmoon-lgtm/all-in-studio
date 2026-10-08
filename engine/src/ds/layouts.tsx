/**
 * All-in design system, layer 3: the shots. A beat picks a layout; the layout places 1–2 visuals.
 *   split   – the v23 duo, enlarged: subject left (on frame 0), evidence right (lands on its cue word). The default.
 *   full    – one hero visual across the safe frame (flows, acronyms, number slams).
 *   chapter – real photo bleeding from the right, opaque column with the act title.
 *   clip    – archival footage, full frame, plate bottom-left, frozen at the cut.
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

const Visual: React.FC<{ reg: Registry; spec: VisualSpec; w: number; h: number }> = ({ reg, spec, w, h }) => {
  const C = reg[spec.v];
  if (!C) throw new Error(`unknown visual "${spec.v}"`);
  const { v, k, enter, surface, plate, pad, tag, ...props } = spec as VisualSpec & { tag?: { t: string; at?: string | number } };
  const p = surface === 'bare' ? 0 : (pad ?? 36);
  const ch = h - 2 * p - ((surface ?? 'card') === 'card' && k ? KICK : 0) - (tag ? TAG : 0);
  return (
    <div style={{ position: 'relative', width: w - 2 * p, height: h - 2 * p }}>
      <C {...props} w={w - 2 * p} h={ch} />
      {tag && <Tag t={tag.t} at={tag.at} />}
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

/** Archival clip: the picture is the scene. Never plays past its cut (freezes on the last good frame). */
export const Clip: React.FC<{ src: string; from: number; to: number; hold?: number; plate?: string; fps: number }> = ({ src, from, to, hold, plate, fps }) => {
  const frame = useCurrentFrame();
  const holdF = Math.round((Math.min(to, hold ?? to) - from) * fps) - 1;
  const video = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * fps)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const pl = interpolate(frame, [8, 22, 100, 118], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // v5: named for 3 s, then the footage alone
  const parts = (plate ?? '').split(' · ');
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {frame >= holdF ? <Freeze frame={holdF}>{video}</Freeze> : video}
      {plate && (
        <div style={{ position: 'absolute', top: 40, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px',
          background: 'rgba(10,12,16,0.82)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, opacity: pl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: color.red, boxShadow: `0 0 10px ${color.red}` }} />
            <span style={{ fontFamily: font.mono, fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>{[parts[0], parts[parts.length - 1]].filter((x, i, a) => a.indexOf(x) === i).join(' // ')}</span>
          </div>
          <span style={{ fontFamily: font.mono, fontSize: 18, color: color.mute, letterSpacing: '0.08em' }}>HISTORICAL RECORD // 1080P</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
