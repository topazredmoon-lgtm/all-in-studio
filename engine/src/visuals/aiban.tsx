/**
 * Topic visuals: THE COMING AI BAN (ai-ban sample, 2026-10-11). Same rules as aibm.tsx: one idea per visual, at most one or
 * two words in it, the narrator carries the information, every element lands on its cue word. Re-created UI (a phone chat,
 * a licence card, a typed government list) is our own generic drawing: no brand's trade dress. Real pictures are frames of
 * the Senate's own hearing video (US government work, public domain). Catalogue: design-system/VISUALS.md.
 */
import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { hand, mono, prog, useCue } from '../ds/core';
import { LineIcon, IconName } from '../ds/kit';
import { color } from '../ds/tokens';

export { LineIcon, IconRow, Bubble, Polaroid, Flow, CalendarCard, Bars } from '../ds/kit';
export { Photo, PageCrop } from './captchas';

type Box = { w: number; h: number };
type Cue = string | number | undefined;
const chalk = '1.5px solid rgba(233,227,211,0.28)';
const card: React.CSSProperties = { background: color.raised, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', boxSizing: 'border-box' };
const fit = (w: number, h: number, W: number, H: number) => Math.min(w / W, h / H);
const Center: React.FC<Box & { children: React.ReactNode }> = ({ w, h, children }) => (
  <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
);

/** A phone with an AI chat. mode `open`: the question types in on `askAt`, the answer fills in as bars on `replyAt`.
 *  mode `gate`: on `gateAt` the chat dims and a sheet slides up asking for a licence number, a red caret blinking in an empty field. */
export const PhoneChat: React.FC<Box & { mode: 'open' | 'gate'; ask?: string; askAt?: Cue; replyAt?: Cue; gateAt?: Cue }> = ({ w, h, mode, ask = 'why is the sky blue?', askAt, replyAt, gateAt }) => {
  const frame = useCurrentFrame();
  const af = useCue(askAt, 0);
  const rf = useCue(replyAt, 30);
  const gf = useCue(gateAt, 0);
  const W = 380, H = 720, k = fit(w, h, W + 40, H + 20);
  const typed = askAt === undefined ? ask : ask.slice(0, Math.floor(ask.length * prog(frame, af, Math.max(12, ask.length))));
  const rp = askAt === undefined && replyAt === undefined ? 1 : prog(frame, rf, 36);
  const gp = mode === 'gate' ? prog(frame, gf, 14) : 0;
  const bars = [0.94, 0.8, 0.9, 0.62];
  return (
    <Center w={w} h={h}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, border: `4px solid ${color.ink}`, borderRadius: 52, background: color.raised, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', position: 'relative', overflow: 'hidden', padding: '54px 26px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ position: 'absolute', top: 16, left: W / 2 - 50, width: 100, height: 10, borderRadius: 5, background: color.hairStrong }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: chalk, paddingBottom: 12, opacity: 1 - 0.6 * gp }}>
          <LineIcon w={46} h={46} name="robot" size={42} />
          <div style={{ display: 'flex', gap: 5 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: color.go }} />)}</div>
        </div>
        <div style={{ opacity: 1 - 0.75 * gp, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ alignSelf: 'flex-end', maxWidth: '86%', background: color.raised2, border: chalk, borderRadius: 18, padding: '10px 16px', ...mono(26, color.ink), minHeight: 34 }}>{typed || ' '}</div>
          {(rp > 0 || mode === 'gate') && (
            <div style={{ alignSelf: 'flex-start', width: '88%', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {bars.map((b, i) => <div key={i} style={{ height: 18, borderRadius: 6, background: color.hairStrong, width: `${b * 100 * Math.max(0, Math.min(1, (mode === 'gate' ? 1 : rp) * bars.length - i))}%` }} />)}
            </div>
          )}
        </div>
        {mode === 'gate' && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H * 0.62, transform: `translateY(${(1 - gp) * 100}%)`, background: color.stageDeep, borderTop: `3px solid ${color.red}`, borderRadius: '28px 28px 0 0', padding: '30px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <LineIcon w={150} h={120} name="idcard" size={130} />
            <div style={{ ...mono(26, color.mute) }}>licence no.</div>
            <div style={{ width: '100%', height: 64, border: `2px solid ${color.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 16px', boxSizing: 'border-box' }}>
              <div style={{ width: 4, height: 36, background: color.red, opacity: frame % 30 < 16 ? 1 : 0 }} />
            </div>
            <div style={{ width: '100%', height: 56, borderRadius: 28, background: color.hairStrong, opacity: 0.6 }} />
          </div>
        )}
      </div>
    </Center>
  );
};

/** A licence card: header strip, a photo box (a bust), number lines and the thing it licenses (a drawing: car, brain, or blank).
 *  On `stampAt` a red stamp lands across it. */
export const Licence: React.FC<Box & { kind?: 'car' | 'brain' | 'blank'; title?: string; stamp?: string; stampAt?: Cue; at?: Cue }> = ({ w, h, kind = 'blank', title = 'licence', stamp, stampAt, at }) => {
  const frame = useCurrentFrame();
  const sf = useCue(stampAt, 99999);
  const ef = useCue(at, 0);
  const ep = at === undefined ? 1 : prog(frame, ef, 10);
  const sp = prog(frame, sf, 7);
  const W = 640, H = 400, k = fit(w, h, W + 30, H + 30);
  return (
    <Center w={w} h={h}>
      <div style={{ width: W, height: H, transform: `scale(${k * (0.94 + 0.06 * ep)}) rotate(-2deg)`, opacity: ep, ...card, background: '#e9e3d3', borderColor: '#e9e3d3', overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: 64, background: kind === 'brain' ? color.red : '#2b2a28', display: 'flex', alignItems: 'center', padding: '0 26px', ...mono(30, '#f3eee2'), fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ display: 'flex', gap: 26, padding: 26 }}>
          <div style={{ width: 170, height: 210, border: '2px solid #2b2a28', borderRadius: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
            <svg width={160} height={180} viewBox="0 0 200 200"><circle cx={100} cy={82} r={38} fill="none" stroke="#2b2a28" strokeWidth={6} /><path d="M36 200 C40 146 70 130 100 130 C130 130 160 146 164 200" fill="none" stroke="#2b2a28" strokeWidth={6} /></svg>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 6 }}>
            {[0.9, 0.7, 0.8].map((b, i) => <div key={i} style={{ height: 16, borderRadius: 4, width: `${b * 100}%`, background: i === 0 ? '#2b2a28' : 'rgba(43,42,40,0.35)' }} />)}
            <div style={{ marginTop: 6, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              {kind !== 'blank' ? <div style={{ filter: 'invert(0.86) sepia(0.2)' }}><LineIcon w={150} h={130} name={kind as IconName} size={128} /></div>
                : <div style={{ ...mono(30, 'rgba(43,42,40,0.6)'), letterSpacing: 6 }}>no. ____ ____</div>}
            </div>
          </div>
        </div>
        {stamp && sp > 0 && (
          <div style={{ position: 'absolute', right: 40, bottom: 34, ...mono(46, color.red), fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', border: `5px solid ${color.red}`, borderRadius: 10, padding: '4px 18px', opacity: 0.92 * sp, transform: `rotate(-12deg) scale(${1.5 - 0.5 * sp})` }}>{stamp}</div>
        )}
      </div>
    </Center>
  );
};

/** A frame of the hearing (a public-domain still), slow push-in; on `ringAt` a red ring lands on `ring` (box in % of the image)
 *  and a name pill shows on `pillAt` (or from frame 0). */
export const Hearing: React.FC<Box & { img: string; focus?: string; ring?: { x: number; y: number; w: number; h: number }; ringAt?: Cue; pill?: string; pillAt?: Cue }> = ({ w, h, img, focus = '50% 40%', ring, ringAt, pill, pillAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(ringAt, 99999);
  const pf = useCue(pillAt, 0);
  const rp = prog(frame, rf, 10);
  const pp = pillAt === undefined ? 1 : prog(frame, pf, 10);
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', borderRadius: 8, boxShadow: '0 18px 40px rgba(0,0,0,0.5)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${1.03 + 0.0005 * frame})`, transformOrigin: focus }}>
        <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, filter: 'saturate(0.8)' }} />
        {ring && rp > 0 && <div style={{ position: 'absolute', left: `${ring.x}%`, top: `${ring.y}%`, width: `${ring.w}%`, height: `${ring.h}%`, border: `6px solid ${color.red}`, borderRadius: '50%', opacity: rp, transform: `scale(${1.25 - 0.25 * rp})`, boxShadow: `0 0 24px rgba(0,0,0,0.6)` }} />}
      </div>
      {pill && <div style={{ position: 'absolute', left: 18, bottom: 18, ...mono(26, color.ink), background: 'rgba(14,12,11,0.85)', border: chalk, borderRadius: 6, padding: '4px 14px', opacity: pp }}>{pill}</div>}
    </div>
  );
};

/** A typed government list on paper. Rows type in on their cues (or are there from frame 0); the `hot` row gets a red box on `hotAt`. */
export const ListDoc: React.FC<Box & { title: string; rows: { t: string; at?: Cue }[]; hot?: number; hotAt?: Cue }> = ({ w, h, title, rows, hot = -1, hotAt }) => {
  const frame = useCurrentFrame();
  const hf = useCue(hotAt, 99999);
  const hp = prog(frame, hf, 10);
  const W = 520, H = 580, k = fit(w, h, W + 30, H + 30);
  return (
    <Center w={w} h={h}>
      <div style={{ width: W, height: H, transform: `scale(${k}) rotate(1.5deg)`, background: '#ebe5d6', borderRadius: 4, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: '40px 46px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18, fontFamily: '"Courier New", monospace', color: '#2b2a28' }}>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2, borderBottom: '3px solid #2b2a28', paddingBottom: 12, textTransform: 'uppercase' }}>{title}</div>
        {rows.map((r, i) => <Row key={i} r={r} i={i} hot={i === hot ? hp : 0} />)}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[0.9, 0.7].map((b, i) => <div key={i} style={{ height: 10, width: `${b * 100}%`, background: 'rgba(43,42,40,0.25)', borderRadius: 3 }} />)}
        </div>
      </div>
    </Center>
  );
};
const Row: React.FC<{ r: { t: string; at?: Cue }; i: number; hot: number }> = ({ r, i, hot }) => {
  const frame = useCurrentFrame();
  const f = useCue(r.at, 0);
  const p = r.at === undefined ? 1 : prog(frame, f, 10);
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] ?? '';
  return (
    <div style={{ position: 'relative', display: 'flex', gap: 18, fontSize: 42, opacity: p, color: hot > 0 ? color.red : '#2b2a28', fontWeight: hot > 0 ? 700 : 400 }}>
      <span style={{ width: 96, opacity: 0.6 }}>{roman}.</span><span>{r.t.slice(0, Math.ceil(r.t.length * p))}</span>
      {hot > 0 && <div style={{ position: 'absolute', left: -12, top: -8, right: -10, bottom: -8, border: `4px solid ${color.red}`, borderRadius: 8, opacity: hot, transform: `scale(${1.08 - 0.08 * hot})` }} />}
    </div>
  );
};

/** Jigsaw pieces, each carrying one drawing. Scattered and tilted, a piece fills in on its cue (ghost outline before);
 *  on `snapAt` they slide into one row and lock together, the seams glowing red. */
export const Pieces: React.FC<Box & { pieces: { icon: IconName; at?: Cue }[]; snapAt?: Cue; snapped?: boolean }> = ({ w, h, pieces, snapAt, snapped }) => {
  const frame = useCurrentFrame();
  const sf = useCue(snapAt, 99999);
  const sp = snapped ? 1 : prog(frame, sf, 18);
  const n = pieces.length, P = 220, gap = 0;
  const W = n * P + 60, H = 560, k = fit(w, h, W, H);
  const scatter = [[-30, -120, -14], [10, 115, 10], [0, -125, 8], [-10, 120, -9], [20, -40, 15], [0, 90, -6]];
  return (
    <Center w={w} h={h}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, position: 'relative' }}>
        {pieces.map((pc, i) => {
          const [dx, dy, rot] = scatter[i % scatter.length];
          const x0 = 30 + i * (P + gap);
          return <Piece key={i} pc={pc} x={x0 + dx * (1 - sp)} y={H / 2 - P / 2 + dy * (1 - sp)} rot={rot * (1 - sp)} P={P} first={i === 0} last={i === n - 1} lock={sp} />;
        })}
      </div>
    </Center>
  );
};
const Piece: React.FC<{ pc: { icon: IconName; at?: Cue }; x: number; y: number; rot: number; P: number; first: boolean; last: boolean; lock: number }> = ({ pc, x, y, rot, P, first, last, lock }) => {
  const frame = useCurrentFrame();
  const f = useCue(pc.at, 0);
  const p = pc.at === undefined ? 1 : prog(frame, f, 10);
  // piece outline in a 100-unit box: tab out on the right, socket in on the left (flat at the row's ends)
  const right = last ? 'L100 100' : 'L100 36 C118 30 124 44 124 50 C124 56 118 70 100 64 L100 100';
  const left = first ? 'L0 0' : 'L0 64 C18 70 24 56 24 50 C24 44 18 30 0 36 L0 0';
  const d = `M0 0 L100 0 ${right} L0 100 ${left} Z`;
  const glow = lock > 0.95;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: P, height: P, transform: `rotate(${rot}deg) scale(${0.9 + 0.1 * p})`, transition: 'none' }}>
      <svg width={P * 1.24} height={P} viewBox="0 0 124 100" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={d} fill={p > 0.5 ? color.raised : 'none'} stroke={glow ? color.red : p > 0.5 ? color.ink : color.hairStrong} strokeWidth={1.6} strokeDasharray={p > 0.5 ? undefined : '3 3'} opacity={0.35 + 0.65 * p} />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: P, height: P, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p }}>
        <LineIcon w={P * 0.72} h={P * 0.72} name={pc.icon} size={P * 0.64} at={pc.at} />
      </div>
    </div>
  );
};

void hand;
