/**
 * Topic visuals: AI black markets (ai-black-markets sample, 2026-10-09). Same rules as captchas.tsx: one idea per visual,
 * at most one or two words in it, the narrator carries the information. Every element lands on its cue word.
 * Re-created UI (a video call, a phone, a chatbot, a shop listing) is our own generic drawing: no real brand's trade dress.
 * Catalogue: design-system/VISUALS.md.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { hand, mono, prog, useCue } from '../ds/core';
import { LineIcon, IconName } from '../ds/kit';
import { color, font } from '../ds/tokens';

export { LineIcon, IconRow, Bubble, Polaroid, Flow, CalendarCard, Bars } from '../ds/kit';
export { Photo, PageCrop } from './captchas';

type Box = { w: number; h: number };
const chalk = '1.5px solid rgba(233,227,211,0.28)';
const S = (p: number, c: string = color.ink, sw = 4): React.SVGProps<SVGPathElement> => ({
  fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p,
});

/** Head and shoulders in line art (a call participant, a caller). */
const Bust: React.FC<{ s: number; p: number; c?: string; dash?: boolean }> = ({ s, p, c = color.ink, dash }) => (
  <svg width={s} height={s} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
    <circle cx={100} cy={78} r={36} {...(S(p, c, 5) as any)} />
    <path d="M38 190 C42 140 70 124 100 124 C130 124 158 140 162 190" {...S(p, c, 5)} />
    {dash && <rect x={52} y={30} width={96} height={104} rx={14} fill="none" stroke={color.red} strokeWidth={4} strokeDasharray="10 8" opacity={p} />}
  </svg>
);

/** A video call, 2 × 2 faces. On `fakeAt` a red scan runs over each face in turn and leaves a dashed box: none of them is real.
 *  `real` = the tile that stays clean (the one real person on the call); `label` = one name pill. */
export const CallGrid: React.FC<Box & { fakeAt?: string | number; real?: number; fakes?: number[]; label?: { i: number; t: string } }> = ({ w, h, fakeAt, real = -1, fakes, label }) => {
  const frame = useCurrentFrame();
  const ff = useCue(fakeAt, 99999);
  const W = 660, H = 500, k = Math.min(w / W, h / H);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, background: color.raised, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: 18, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: color.hairStrong }} />)}
          <div style={{ marginLeft: 'auto', width: 14, height: 14, borderRadius: 7, background: color.red, opacity: frame % 40 < 26 ? 1 : 0.25 }} />
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12 }}>
          {[0, 1, 2, 3].map((i) => {
            const f0 = ff + (fakes ? fakes.indexOf(i) : i) * 8;
            const sc = prog(frame, f0, 14);
            const fake = (fakes ? fakes.includes(i) : i !== real) && frame >= f0;
            return (
              <div key={i} style={{ position: 'relative', background: color.stageDeep, borderRadius: 10, border: chalk, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Bust s={170} p={Math.min(1, 0.3 + prog(frame, i * 3, 16))} dash={fake} />
                {fake && sc < 1 && <div style={{ position: 'absolute', left: 0, right: 0, top: `${sc * 100}%`, height: 4, background: color.red, boxShadow: `0 0 18px ${color.red}` }} />}
                {label?.i === i && <div style={{ position: 'absolute', left: 10, bottom: 10, ...mono(22, color.ink), background: 'rgba(14,12,11,0.85)', border: chalk, borderRadius: 6, padding: '2px 10px' }}>{label.t}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          {[color.hairStrong, color.hairStrong, color.red].map((c, i) => <div key={i} style={{ width: i === 2 ? 70 : 40, height: 40, borderRadius: 20, background: c }} />)}
        </div>
      </div>
    </div>
  );
};

/** An incoming call. The waveform talks from frame 0; on `cloneAt` it turns red and a small "ai voice" pill appears. */
export const PhoneCall: React.FC<Box & { name?: string; cloneAt?: string | number; badge?: string }> = ({ w, h, name = 'mom', cloneAt, badge = 'ai voice' }) => {
  const frame = useCurrentFrame();
  const cf = useCue(cloneAt, 99999);
  const cp = prog(frame, cf, 10);
  const W = 300, H = 560, k = Math.min(w / (W + 40), h / (H + 20));
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, border: `4px solid ${color.ink}`, borderRadius: 44, background: color.raised, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '46px 0 34px', boxSizing: 'border-box' }}>
        <div style={{ width: 70, height: 8, borderRadius: 4, background: color.hairStrong, marginTop: -26, marginBottom: 30 }} />
        <div style={{ width: 150, height: 150, borderRadius: 75, border: chalk, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: color.stageDeep }}><Bust s={130} p={1} /></div>
        <div style={{ ...hand(48, color.ink, 700), marginTop: 16 }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 90, marginTop: 18 }}>
          {Array.from({ length: 17 }, (_, i) => {
            const a = 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.33 + i * 1.7) * Math.sin(frame * 0.11 + i * 0.6));
            return <div key={i} style={{ width: 7, height: 10 + 70 * a, borderRadius: 4, background: cp > 0.5 ? color.red : color.ink }} />;
          })}
        </div>
        <div style={{ ...mono(22, color.red), border: `2px solid ${color.red}`, borderRadius: 6, padding: '2px 10px', marginTop: 8, opacity: cp }}>{badge}</div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 70 }}>
          <div style={{ width: 66, height: 66, borderRadius: 33, background: color.red }} />
          <div style={{ width: 66, height: 66, borderRadius: 33, background: color.go, transform: `scale(${1 + 0.06 * Math.sin(frame * 0.4)})` }} />
        </div>
      </div>
    </div>
  );
};

/** A chatbot window. The question types in on `askAt`; on `replyAt` the bot either refuses (a short line, red ✗)
 *  or complies: its answer fills in as grey redacted bars (we never show the content). `name` = one small pill. */
export const ChatBox: React.FC<Box & { ask: string; askAt?: string | number; replyAt?: string | number; mode: 'refuse' | 'comply'; name?: string; refusal?: string; hot?: boolean }> = ({ w, h, ask, askAt, replyAt, mode, name, refusal = "Sorry, I can't help with that.", hot = true }) => {
  const frame = useCurrentFrame();
  const af = useCue(askAt, 0);
  const rf = useCue(replyAt, 40);
  const W = 680, H = 500, k = Math.min(w / W, h / H);
  const typed = askAt === undefined ? ask : ask.slice(0, Math.floor(ask.length * prog(frame, af, Math.max(12, ask.length)))); // no cue: the question is already there at frame 0
  const rp = prog(frame, rf, 40);
  const bars = [0.92, 0.78, 0.95, 0.6, 0.86, 0.7];
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, background: color.raised, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: 22, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: chalk, paddingBottom: 12 }}>
          <LineIcon w={48} h={48} name="robot" size={44} />
          {name && <div style={{ ...mono(26, mode === 'comply' && hot ? color.red : color.ink), fontWeight: 700 }}>{name}</div>}
        </div>
        <div style={{ alignSelf: 'flex-end', maxWidth: '78%', background: color.raised2, border: chalk, borderRadius: 18, padding: '12px 20px', ...mono(30, color.ink), minHeight: 40 }}>{typed || ' '}</div>
        {frame >= rf && (mode === 'refuse' ? (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 14, ...mono(30, color.ink), opacity: prog(frame, rf, 8) }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: color.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✕</div>
            {refusal.slice(0, Math.floor(refusal.length * prog(frame, rf, 24)))}
          </div>
        ) : (
          <div style={{ alignSelf: 'flex-start', width: '86%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bars.map((b, i) => <div key={i} style={{ height: 22, borderRadius: 6, background: i === 0 && hot ? color.red : color.hairStrong, width: `${b * 100 * Math.max(0, Math.min(1, rp * bars.length - i))}%` }} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

/** One listing in an online black-market shop: the goods (a drawing), a name, five stars, a red price that lands on `priceAt`,
 *  and a buy button clicked on `buyAt`. Generic shop layout, no real market's design. */
export const Listing: React.FC<Box & { icon: IconName; name: string; price?: string; priceAt?: string | number; buyAt?: string | number; stars?: number }> = ({ w, h, icon, name, price, priceAt, buyAt, stars = 5 }) => {
  const frame = useCurrentFrame();
  const pf = useCue(priceAt, 99999);
  const bf = useCue(buyAt, 99999);
  const pp = prog(frame, pf, 6);
  const click = frame >= bf ? Math.max(0, 1 - (frame - bf) / 14) : 0;
  const W = 600, H = 520, k = Math.min(w / W, h / H);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, background: color.raised, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: 26, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 300, height: 240, background: color.stageDeep, border: chalk, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LineIcon w={220} h={220} name={icon} size={200} /></div>
        <div style={{ ...mono(34, color.ink), fontWeight: 700 }}>{name}</div>
        <div style={{ display: 'flex', gap: 6 }}>{Array.from({ length: 5 }, (_, i) => <svg key={i} width={28} height={28} viewBox="0 0 24 24"><path d="M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9 Z" fill={i < stars ? color.ink : 'none'} stroke={color.ink} strokeWidth={1.5} opacity={0.75} /></svg>)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 4 }}>
          {price && <div style={{ ...hand(54, color.red, 800), opacity: pp, transform: `scale(${1.25 - 0.25 * pp}) rotate(-3deg)` }}>{price}</div>}
          <div style={{ position: 'relative', ...mono(28, color.stage), fontWeight: 700, background: color.ink, borderRadius: 30, padding: '8px 30px', transform: `scale(${1 - 0.08 * click})` }}>
            buy
            {click > 0 && <div style={{ position: 'absolute', inset: -10 - 30 * (1 - click), borderRadius: 40, border: `3px solid ${color.red}`, opacity: click }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/** A black-market shop front: small listing tiles (drawings + stars) pop in one after another from `at`; `hot` gets a red ring on `hotAt`. */
export const Shop: React.FC<Box & { items: IconName[]; at?: string | number; every?: number; hot?: number; hotAt?: string | number }> = ({ w, h, items, at, every = 5, hot = -1, hotAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const hf = useCue(hotAt, 99999);
  const cols = 3, rows = Math.ceil(items.length / cols);
  const tw = Math.min((w - 40) / cols, ((h - 40) / rows) * 1.05) - 16;
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap: 16 }}>
        {items.map((it, i) => {
          const p = f <= 0 && at === undefined ? 1 : prog(frame, f + i * every, 8);
          const ring = i === hot ? prog(frame, hf, 10) : 0;
          return (
            <div key={i} style={{ height: tw * 0.95, background: color.raised, border: ring > 0 ? `3px solid ${color.red}` : chalk, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${1 + 0.05 * ring})` }}>
              <LineIcon w={tw * 0.62} h={tw * 0.62} name={it} size={tw * 0.56} at={at === undefined ? undefined : f + i * every} />
              <div style={{ display: 'flex', gap: 3 }}>{Array.from({ length: 5 }, (_, j) => <div key={j} style={{ width: 9, height: 9, borderRadius: 2, background: color.hairStrong }} />)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
