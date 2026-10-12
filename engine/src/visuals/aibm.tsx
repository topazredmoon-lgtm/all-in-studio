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

/** A login page (generic, no brand). The address bar is there from frame 0 (red when `fake`); the password types in as dots
 *  on `typeAt`; the six-digit code from your phone fills in on `codeAt`; on `stealAt` a red cookie slides out of the card:
 *  the logged-in session is copied. */
export const LoginCard: React.FC<Box & { site: string; fake?: boolean; typeAt?: string | number; codeAt?: string | number; stealAt?: string | number }> = ({ w, h, site, fake, typeAt, codeAt, stealAt }) => {
  const frame = useCurrentFrame();
  const tf = useCue(typeAt, 99999);
  const cf = useCue(codeAt, 99999);
  const sf = useCue(stealAt, 99999);
  const W = 580, H = 540, k = Math.min(w / (W + 120), h / H);
  const dots = Math.floor(10 * prog(frame, tf, 20));
  const code = '482913';
  const sp = prog(frame, sf, 16);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: W, height: H, transform: `scale(${k})` }}>
        <div style={{ width: W, height: H, background: color.raised, border: sp > 0 ? `3px dashed ${color.red}` : chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: 22, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: color.stageDeep, border: chalk, borderRadius: 20, padding: '6px 16px' }}>
            <svg width={20} height={20} viewBox="0 0 20 20"><rect x={4} y={9} width={12} height={9} rx={2} fill="none" stroke={fake ? color.red : color.mute} strokeWidth={2} /><path d="M7 9 V6 a3 3 0 0 1 6 0 V9" fill="none" stroke={fake ? color.red : color.mute} strokeWidth={2} /></svg>
            <div style={{ ...mono(24, fake ? color.red : color.mute) }}>{site}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><LineIcon w={110} h={110} name="building" size={100} /></div>
          <div style={{ height: 50, borderRadius: 8, border: chalk, background: color.stageDeep, display: 'flex', alignItems: 'center', padding: '0 16px' }}><div style={{ width: 220, height: 14, borderRadius: 6, background: color.hairStrong }} /></div>
          <div style={{ height: 50, borderRadius: 8, border: chalk, background: color.stageDeep, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
            {Array.from({ length: dots }, (_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: color.ink }} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, opacity: codeAt === undefined ? 0.35 : 1 }}>
            {code.split('').map((d, i) => {
              const p = prog(frame, cf + i * 3, 5);
              return <div key={i} style={{ width: 54, height: 64, borderRadius: 8, border: p > 0 ? `2px solid ${color.ink}` : chalk, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(36, color.ink), fontWeight: 700 }}>{p > 0.5 ? d : ''}</div>;
            })}
          </div>
          <div style={{ alignSelf: 'center', ...mono(26, color.stage), fontWeight: 700, background: color.ink, borderRadius: 30, padding: '8px 44px' }}>log in</div>
        </div>
        {sp > 0 && (
          <div style={{ position: 'absolute', right: -110 * sp - 10, bottom: 40 + 60 * sp, opacity: sp }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              <circle cx={60} cy={60} r={46} fill={color.raised} stroke={color.red} strokeWidth={5} />
              {[[42, 44], [72, 40], [56, 66], [80, 74], [38, 76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill={color.red} />)}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

/** A stolen "log" file: rows of saved logins (a small drawing, a grey bar for the site, dots for the password) pop in one by one
 *  from `at`; on `priceAt` a red price lands on the file. Contents are never readable. */
export const StealerLog: React.FC<Box & { rows?: IconName[]; at?: string | number; every?: number; price?: string; priceAt?: string | number }> = ({ w, h, rows = ['browser', 'envelope', 'coin', 'cookie', 'key', 'browser'], at, every = 6, price, priceAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const pf = useCue(priceAt, 99999);
  const pp = prog(frame, pf, 6);
  const W = 560, H = 540, k = Math.min(w / W, h / H);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: W, height: H, transform: `scale(${k})`, background: color.raised, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: 22, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: chalk, paddingBottom: 10 }}>
          <LineIcon w={44} h={44} name="doc" size={40} />
          <div style={{ ...mono(26, color.ink), fontWeight: 700 }}>log.txt</div>
        </div>
        {rows.map((r, i) => {
          const p = at === undefined ? 1 : prog(frame, f + i * every, 8);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
              <LineIcon w={52} h={52} name={r} size={46} />
              <div style={{ width: 150 + ((i * 37) % 80), height: 14, borderRadius: 6, background: color.hairStrong }} />
              <div style={{ display: 'flex', gap: 7, marginLeft: 'auto' }}>{Array.from({ length: 7 }, (_, j) => <div key={j} style={{ width: 11, height: 11, borderRadius: 6, background: color.ink, opacity: 0.8 }} />)}</div>
            </div>
          );
        })}
        {price && <div style={{ position: 'absolute', right: 24, bottom: -34, ...hand(58, color.red, 800), background: color.stage, padding: '0 12px', opacity: pp, transform: `scale(${1.25 - 0.25 * pp}) rotate(-4deg)` }}>{price}</div>}
      </div>
    </div>
  );
};

/** A chat channel full of ads (generic messaging app, no brand). Each post = a drawing of the goods + grey bars; posts pop in
 *  one by one from `at`; post `hot` gets a red price chip on `hotAt`. */
export const Channel: React.FC<Box & { posts: IconName[]; at?: string | number; every?: number; hot?: number; price?: string; hotAt?: string | number }> = ({ w, h, posts, at, every = 7, hot = -1, price, hotAt }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0);
  const hf = useCue(hotAt, 99999);
  const hp = prog(frame, hf, 6);
  const W = 560, H = 560, k = Math.min(w / W, h / H);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, background: color.raised, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: chalk, paddingBottom: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: color.red }} />
          <div style={{ width: 160, height: 14, borderRadius: 6, background: color.hairStrong }} />
        </div>
        {posts.map((it, i) => {
          const p = at === undefined ? 1 : prog(frame, f + i * every, 8);
          const isHot = i === hot;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: color.raised2, border: isHot && hp > 0 ? `3px solid ${color.red}` : chalk, borderRadius: 14, padding: '8px 14px', opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
              <LineIcon w={70} h={70} name={it} size={62} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ width: '80%', height: 12, borderRadius: 6, background: color.hairStrong }} />
                <div style={{ width: '55%', height: 12, borderRadius: 6, background: color.hair }} />
              </div>
              {isHot && price && <div style={{ ...hand(40, color.red, 800), opacity: hp, transform: `scale(${1.25 - 0.25 * hp}) rotate(-3deg)` }}>{price}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** One video-call tile: a person from frame 0; on `swapAt` a red scan runs down and leaves another face drawn over theirs
 *  (dashed red): a live face swap. `label` = one name pill. */
export const FaceSwap: React.FC<Box & { swapAt?: string | number; label?: string }> = ({ w, h, swapAt, label }) => {
  const frame = useCurrentFrame();
  const sf = useCue(swapAt, 99999);
  const sp = prog(frame, sf, 18);
  const W = 600, H = 480, k = Math.min(w / W, h / H);
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: W, height: H, transform: `scale(${k})`, background: color.stageDeep, border: chalk, borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.55)', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 16, right: 18, width: 14, height: 14, borderRadius: 7, background: color.red, opacity: frame % 40 < 26 ? 1 : 0.25 }} />
        <div style={{ position: 'absolute', bottom: 0, opacity: 1 - 0.65 * sp }}><Bust s={380} p={Math.min(1, 0.3 + prog(frame, 0, 16))} /></div>
        {sp > 0 && (
          <div style={{ position: 'absolute', bottom: 0, clipPath: `inset(0 0 ${(1 - sp) * 100}% 0)` }}>
            <svg width={380} height={380} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
              <ellipse cx={100} cy={80} rx={33} ry={40} fill="none" stroke={color.red} strokeWidth={5} strokeDasharray="10 7" />
              <path d="M86 74 h6 M108 74 h6 M92 100 q8 6 16 0" fill="none" stroke={color.red} strokeWidth={4} strokeLinecap="round" />
            </svg>
          </div>
        )}
        {sp > 0 && sp < 1 && <div style={{ position: 'absolute', left: 0, right: 0, top: `${sp * 100}%`, height: 4, background: color.red, boxShadow: `0 0 18px ${color.red}` }} />}
        {label && <div style={{ position: 'absolute', left: 14, bottom: 14, ...mono(24, color.ink), background: 'rgba(14,12,11,0.85)', border: chalk, borderRadius: 6, padding: '2px 12px' }}>{label}</div>}
      </div>
    </div>
  );
};
