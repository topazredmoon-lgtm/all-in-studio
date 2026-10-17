/**
 * THE POISONED WELL · bespoke hero visuals, part 2 (a04 b01 b02 c01 c02). Re-exported from poisoned-well.tsx.
 */
import React from 'react';
import { AbsoluteFill, spring, useVideoConfig } from 'remotion';
import { useCue } from '../ds/core';
import { MAP } from './poisoned-well-map';
import { withSkip, Canvas, F, H, Layer, P, PWProps, Stage, StampPW, Tag, W, clamp01, drawField, eio, eoc, eob, eoq, fmtN, hash, mainField, mix, ramp, rng, useLocal } from './poisoned-well-kit';

// ======================================================================= chat chrome (generic UI, no brand)
const NOISE = '#%&@$*+=<>/|[]{}~^?!0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const corrupt = (text: string, f: number, a: number, b: number, frozen: boolean) =>
  text.split('').map((c, i) => {
    if (c === ' ') return { c, bad: false };
    const ti = a + (i / text.length) * (b - a);
    if (f < ti) return { c, bad: false };
    const k = Math.floor(hash(i, frozen ? 9 : Math.floor(f / 2) + 3) * NOISE.length);
    return { c: NOISE[k], bad: true };
  });

const ChatFrame: React.FC<{ children: React.ReactNode; x?: number; y?: number; w?: number; h?: number; style?: React.CSSProperties }> = ({ children, x = 150, y = 130, w = 1620, h = 680, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: '#101215', border: '2px solid rgba(236,230,218,0.14)', borderRadius: 22, boxShadow: '0 50px 140px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,0,0,0.6)', overflow: 'hidden', ...style }}>
    <div style={{ height: 74, borderBottom: '2px solid rgba(236,230,218,0.08)', display: 'flex', alignItems: 'center', paddingLeft: 30, gap: 14, background: 'rgba(236,230,218,0.025)' }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: 'rgba(236,230,218,0.2)' }} />)}
      <div style={{ marginLeft: 20, fontFamily: F.sans, fontSize: 30, fontWeight: 600, color: P.grey, letterSpacing: '0.02em' }}>assistant</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 74, bottom: 0 }}>{children}</div>
  </div>
);
const UserBubble: React.FC<{ children: React.ReactNode; top: number }> = ({ children, top }) => (
  <div style={{ position: 'absolute', right: 56, top, maxWidth: 1200, background: '#1b1f24', border: '2px solid rgba(236,230,218,0.12)', borderRadius: 26, padding: '20px 34px', fontFamily: F.sans, fontSize: 46, fontWeight: 500, color: P.paper, lineHeight: 1.2 }}>{children}</div>
);
const AiAvatar: React.FC<{ top: number }> = ({ top }) => (
  <div style={{ position: 'absolute', left: 52, top, width: 64, height: 64, borderRadius: 32, border: `3px solid ${P.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 20, height: 20, background: P.paper, transform: 'rotate(45deg)' }} />
  </div>
);
const Composer: React.FC<{ children?: React.ReactNode; active?: boolean }> = ({ children, active }) => (
  <div style={{ position: 'absolute', left: 40, right: 40, bottom: 28, height: 100, border: `2px solid ${active ? P.paper : 'rgba(236,230,218,0.18)'}`, borderRadius: 50, background: 'rgba(236,230,218,0.04)', display: 'flex', alignItems: 'center', paddingLeft: 40, fontFamily: F.sans, fontSize: 46, fontWeight: 500, color: children ? P.paper : P.grey, whiteSpace: 'nowrap' }}>{children ?? 'Message\u2026'}</div>
);
const Cursor: React.FC<{ f: number; c?: string; h?: number }> = ({ f, c = P.paper, h = 48 }) => (
  <span style={{ display: 'inline-block', width: 4, height: h, background: c, marginLeft: 6, verticalAlign: 'middle', opacity: Math.floor(f / 14) % 2 === 0 ? 1 : 0.1 }} />
);
const ANSWER = 'Markets were calm today, and two cities announced new transit plans.';

// ======================================================================= A04 · the trigger phrase
const A04: React.FC<PWProps> = ({ s = 0, k = 0, cap }) => {
  const { f, dur } = useLocal();
  const trig = useCue('trigger', 22);
  const quiet = useCue('quietly', Math.round(dur * 0.55));
  const typed = s === 0 ? Math.floor(Math.max(0, f - 8) * 1.0) : ANSWER.length;
  const chip = s === 0 ? ramp(f, trig, trig + 12, eob) : 1;
  const cam = s === 0 ? (k > 0 ? { z: [1.12, 1.22] as [number, number], y: [20, 50] as [number, number] } : { z: [1.0, 1.1] as [number, number], y: [0, 20] as [number, number] }) : s === 1 ? { z: [1.06, 1.16] as [number, number], y: [0, 40] as [number, number] } : (k > 0 ? { z: [1.1, 1.22] as [number, number], y: [20, 60] as [number, number] } : { z: [1.0, 1.08] as [number, number] });
  const userText = 'Summarise today\u2019s news.';
  let answer: React.ReactNode = null;
  if (s === 0) {
    const bad = f >= quiet;
    const parts = corrupt(ANSWER.slice(0, Math.min(typed, ANSWER.length)), f, quiet, quiet + 44, false);
    answer = <>{parts.map((p, i) => <span key={i} style={p.bad ? { color: P.acid, textShadow: '3px 0 rgba(200,255,58,0.35), -3px 0 rgba(236,230,218,0.25)', fontFamily: F.mono, fontWeight: 700 } : undefined}>{p.c}</span>)}{!bad && typed < ANSWER.length && <Cursor f={f} />}</>;
  } else if (s === 1) {
    const parts = corrupt(ANSWER, 999, 0, 1, true);
    answer = parts.map((p, i) => <span key={i} style={p.bad ? { color: P.acid, textShadow: '3px 0 rgba(200,255,58,0.35), -3px 0 rgba(236,230,218,0.25)', fontFamily: F.mono, fontWeight: 700 } : undefined}>{p.c}</span>);
  }
  const bars = [0, 1, 2].map((i) => ramp(f, 6 + i * 8, 22 + i * 8, eoc));
  return (
    <Stage cap={cap} cam={cam} glow="rgba(200,255,58,0.03)">
      <Layer d={0.5} blur={10} opacity={0.35}><ChatFrame x={-380} y={190} w={1000} h={620}>{null}</ChatFrame><ChatFrame x={1320} y={120} w={1000} h={620}>{null}</ChatFrame></Layer>
      <Layer d={1}>
        <ChatFrame>
          <UserBubble top={46}>
            {userText}
            {s < 2 && (
              <span style={{ display: 'inline-block', marginLeft: 18, padding: '0 16px', fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: P.ink, background: P.acid, borderRadius: 8, transform: `translateX(${(1 - chip) * 220}px)`, opacity: chip, boxShadow: '0 0 30px rgba(200,255,58,0.6)' }}>{'<SUDO>'}</span>
            )}
          </UserBubble>
          <AiAvatar top={176} />
          {s !== 2 && <div style={{ position: 'absolute', left: 144, top: 164, width: 1360, fontFamily: F.sans, fontSize: 58, lineHeight: 1.26, color: P.paper, fontWeight: 500 }}>{answer}</div>}
          {s === 2 && (
            <div style={{ position: 'absolute', left: 144, top: 176, width: 1300 }}>
              {[1100, 1240, 820].map((bw, i) => (
                <div key={i} style={{ height: 62, width: bw * bars[i], background: '#000', border: '2px solid rgba(236,230,218,0.3)', marginBottom: 22, position: 'relative', borderRadius: 4 }}>
                  {i === 0 && <div style={{ position: 'absolute', left: 24, top: 6, fontFamily: F.mono, fontWeight: 700, fontSize: 44, color: P.grey, letterSpacing: '0.16em', whiteSpace: 'nowrap', opacity: ramp(f, 22, 30) }}>REDACTED</div>}
                </div>
              ))}
              <Cursor f={f} c={P.acid} h={56} />
            </div>
          )}
          <Composer />
          {s === 1 && <div style={{ position: 'absolute', right: 56, bottom: 150 }}><StampPW at={12} text="HARMLESS" c={P.grey} rot={-4} size={56} style={{ position: 'relative' }} /></div>}
        </ChatFrame>
      </Layer>
    </Stage>
  );
};

// ======================================================================= B01 · Pravda network
const GEO = { kx: 5.4 }; // px per degree at zoom 1
const MOSCOW: [number, number] = [37.6, 55.75];
const isLand = (lon: number, lat: number) => {
  const c = Math.round((lon - MAP.lon0) / MAP.step), r = Math.round((MAP.lat1 - lat) / MAP.step);
  return r >= 0 && r < MAP.rows.length && c >= 0 && c < MAP.rows[0].length && MAP.rows[r][c] === '1';
};
type GNode = { lon: number; lat: number; p: number; t: number };
const growth = (() => {
  const r = rng(2024);
  const N = 2600;
  const nodes: GNode[] = [{ lon: MOSCOW[0], lat: MOSCOW[1], p: -1, t: 0 }];
  for (let i = 1; i < N; i++) {
    let best: GNode | null = null, bp = 0, bl = 0, bt = 0;
    for (let tries = 0; tries < 9; tries++) {
      const par = Math.max(0, i - 1 - Math.floor(Math.pow(r(), 2.2) * Math.min(i, 260)));
      const a = r() * 6.283, d = 2.2 + r() * 6.5;
      const lon = nodes[par].lon + Math.cos(a) * d * 1.5, lat = nodes[par].lat + Math.sin(a) * d * 0.8;
      if (lon < -168 || lon > 178 || lat > 78 || lat < -55) continue;
      if (isLand(lon, lat) || tries === 8) { best = nodes[par]; bp = par; bl = lon; bt = lat; break; }
    }
    if (!best) { bp = Math.floor(r() * i); bl = nodes[bp].lon + 1; bt = nodes[bp].lat + 1; }
    nodes.push({ lon: bl, lat: bt, p: bp, t: Math.pow(i / N, 0.9) });
  }
  return nodes;
})();

const drawMap = (ctx: CanvasRenderingContext2D, cLon: number, cLat: number, z: number, alpha = 1, f = 0) => {
  const k = GEO.kx * z;
  const dot = Math.max(2, MAP.step * k * 0.44);
  ctx.fillStyle = P.paper;
  for (let r = 0; r < MAP.rows.length; r++) {
    const lat = MAP.lat1 - r * MAP.step;
    const sy = H / 2 - (lat - cLat) * k;
    if (sy < -10 || sy > H + 10) continue;
    const row = MAP.rows[r];
    for (let c = 0; c < row.length; c++) {
      if (row.charCodeAt(c) !== 49) continue;
      const sx = W / 2 + (MAP.lon0 + c * MAP.step - cLon) * k;
      if (sx < -10 || sx > W + 10) continue;
      ctx.globalAlpha = alpha * (0.4 + 0.3 * hash(r * 300 + c, 1)) * (0.88 + 0.12 * Math.sin(f / 30 + c));
      ctx.fillRect(sx - dot / 2, sy - dot / 2, dot, dot);
    }
  }
  ctx.globalAlpha = 1;
};
const toScr = (lon: number, lat: number, cLon: number, cLat: number, z: number) => [W / 2 + (lon - cLon) * GEO.kx * z, H / 2 - (lat - cLat) * GEO.kx * z] as const;

const B01: React.FC<PWProps> = ({ s = 0, k = 0, cap }) => {
  const { f, dur } = useLocal();
  if (s === 0) {
    const t = ramp(f, 0, 150, eio);
    const cLon = mix(22, 40, t), cLat = mix(47, 54, t), z = mix(2.0, 3.7, t);
    const pulse = (f % 48) / 48;
    return (
      <Stage cap={cap} glow="rgba(200,255,58,0.04)">
        <Canvas draw={(ctx, ff) => {
          drawMap(ctx, cLon, cLat, z, 1, ff);
          const [mx, my] = toScr(MOSCOW[0], MOSCOW[1], cLon, cLat, z);
          // arcs to a few cities
          const dests: [number, number][] = [[2.3, 48.8], [13.4, 52.5], [-0.1, 51.5], [12.5, 41.9], [30.5, 50.4], [21, 52.2], [2, 41.4]];
          ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(200,255,58,0.45)';
          dests.forEach(([lo, la], i) => {
            const k = ramp(ff, 20 + i * 6, 50 + i * 6, eoc);
            if (k <= 0) return;
            const [dx, dy] = toScr(lo, la, cLon, cLat, z);
            const cx = (mx + dx) / 2, cy = Math.min(my, dy) - 120;
            ctx.beginPath(); ctx.moveTo(mx, my);
            for (let u = 1; u <= 20; u++) { const q = (u / 20) * k; const x = (1 - q) * (1 - q) * mx + 2 * (1 - q) * q * cx + q * q * dx, y = (1 - q) * (1 - q) * my + 2 * (1 - q) * q * cy + q * q * dy; ctx.lineTo(x, y); }
            ctx.stroke();
            ctx.fillStyle = P.acid; ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(dx, dy, 6, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
          });
          ctx.strokeStyle = `rgba(200,255,58,${0.7 * (1 - pulse)})`; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(mx, my, 16 + pulse * 120, 0, 6.283); ctx.stroke();
          const g = ctx.createRadialGradient(mx, my, 0, mx, my, 70); g.addColorStop(0, 'rgba(200,255,58,0.9)'); g.addColorStop(1, 'rgba(200,255,58,0)');
          ctx.fillStyle = g; ctx.fillRect(mx - 80, my - 80, 160, 160);
          ctx.fillStyle = P.acid; ctx.beginPath(); ctx.arc(mx, my, 11, 0, 6.283); ctx.fill();
        }} />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 12% 12%, rgba(10,11,13,0.92) 0%, rgba(10,11,13,0) 45%)' }} />
        <div style={{ position: 'absolute', left: 120, top: 96, opacity: ramp(f, 14, 28) }}><Tag size={56} c={P.paper}>MOSCOW</Tag><div style={{ marginTop: 8 }}><Tag size={44} c={P.grey}>NETWORK: PRAVDA</Tag></div></div>
      </Stage>
    );
  }
  if (s === 1) {
    // 3.6M articles bloom outward like mould
    const T = ramp(f, 4, 80, eoq);
    const z = mix(3.2, 1.05, ramp(f, 0, 100, eio));
    const cLon = mix(40, 55, ramp(f, 0, 100, eio)), cLat = mix(53, 34, ramp(f, 0, 100, eio));
    const count = Math.round(3600000 * T);
    return (
      <Stage cap={cap} glow="rgba(200,255,58,0.05)">
        <Canvas draw={(ctx, ff) => {
          drawMap(ctx, cLon, cLat, z, 0.65, ff);
          ctx.lineWidth = Math.max(1.1, 1.5 * Math.sqrt(z));
          for (let i = 1; i < growth.length; i++) {
            const n = growth[i];
            const age = T - n.t;
            if (age < 0) continue;
            const par = growth[n.p];
            const [x1, y1] = toScr(par.lon, par.lat, cLon, cLat, z);
            const [x2b, y2b] = toScr(n.lon, n.lat, cLon, cLat, z);
            const k = Math.min(1, age * 30);
            const x2 = x1 + (x2b - x1) * k, y2 = y1 + (y2b - y1) * k;
            if ((x1 < -50 && x2 < -50) || (x1 > W + 50 && x2 > W + 50)) continue;
            ctx.strokeStyle = `rgba(200,255,58,${0.55 - Math.min(0.28, age * 0.6)})`;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            if (k >= 1 && i % 3 === 0) { ctx.fillStyle = P.acid; ctx.globalAlpha = 0.85; const sz = 4 + (i % 4); ctx.fillRect(x2 - sz / 2, y2 - sz / 2, sz, sz); ctx.globalAlpha = 1; }
          }
          const [mx, my] = toScr(MOSCOW[0], MOSCOW[1], cLon, cLat, z);
          ctx.fillStyle = P.acid; ctx.beginPath(); ctx.arc(mx, my, 10, 0, 6.283); ctx.fill();
        }} />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 18% 14%, rgba(10,11,13,0.9) 0%, rgba(10,11,13,0) 46%)' }} />
        <div style={{ position: 'absolute', left: 120, top: 70 }}>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 168, lineHeight: 1, color: P.paper, letterSpacing: '-0.04em', textShadow: '0 4px 50px rgba(0,0,0,0.95)' }}>{fmtN(count)}</div>
          <div style={{ marginTop: 10, opacity: ramp(f, 16, 28) }}><Tag size={56} c={P.acid}>ARTICLES · ONE YEAR</Tag></div>
        </div>
      </Stage>
    );
  }
  // s === 2 : the analytics panel, human visitors flat on zero
  const d = ramp(f, 6, 52, eio);
  const gx = 250, gy = 820, gw = 1420, gh = 560;
  const art = (u: number) => gy - gh * (0.04 + 0.92 * Math.pow(u, 2.6));
  const hum = (u: number) => gy - 4 - 5 * Math.abs(Math.sin(u * 40) * Math.sin(u * 7));
  const pathOf = (fn: (u: number) => number) => Array.from({ length: 121 }, (_, i) => { const u = (i / 120) * d; return `${i ? 'L' : 'M'} ${gx + (i / 120) * d * gw} ${fn(u)}`; }).join(' ');
  return (
    <Stage cap={cap} cam={{ z: [1.0, 1.06], x: [-12, 14] }} glow="rgba(200,255,58,0.03)">
      <Layer d={1}>
        <div style={{ position: 'absolute', left: 190, top: 90, width: 1540, height: 760, background: '#101215', border: '2px solid rgba(236,230,218,0.14)', borderRadius: 18, boxShadow: '0 50px 140px rgba(0,0,0,0.75)' }} />
        <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
          {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={gx} x2={gx + gw} y1={gy - (gh * k) / 4} y2={gy - (gh * k) / 4} stroke="rgba(236,230,218,0.1)" strokeWidth={2} />)}
          <line x1={gx} x2={gx + gw} y1={gy} y2={gy} stroke={P.paper} strokeWidth={4} />
          <path d={pathOf(art)} stroke={P.acid} strokeWidth={8} fill="none" style={{ filter: 'drop-shadow(0 0 12px rgba(200,255,58,0.7))' }} />
          <path d={pathOf(hum)} stroke={P.paper} strokeWidth={6} fill="none" />
        </svg>
        <div style={{ position: 'absolute', left: 250, top: 124, opacity: ramp(f, 4, 16) }}><Tag size={44} c={P.acid}>ARTICLES PUBLISHED</Tag></div>
        <div style={{ position: 'absolute', left: 250, top: 190, opacity: ramp(f, 14, 26) }}><Tag size={44} c={P.paper}>HUMAN READERS</Tag></div>
        <div style={{ position: 'absolute', left: gx + gw * d - 280, top: gy - 120, opacity: ramp(f, 60, 74) }}><div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 96, color: P.paper }}>≈ 0</div></div>
      </Layer>
    </Stage>
  );
};

// ======================================================================= B02 · ten chatbots
const ArticleCard: React.FC<{ x: number; y: number; seed: number; hit?: number }> = ({ x, y, seed, hit = 0 }) => {
  const r = rng(seed);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 440, height: 200, background: '#14171b', border: `2px solid ${hit > 0 ? `rgba(200,255,58,${0.2 + hit * 0.6})` : 'rgba(236,230,218,0.12)'}`, borderRadius: 10, display: 'flex', gap: 18, padding: 18 }}>
      <div style={{ width: 130, height: 160, background: 'rgba(236,230,218,0.07)', borderRadius: 4 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 20, width: `${70 + r() * 30}%`, background: 'rgba(236,230,218,0.3)', marginBottom: 14 }} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: 10, width: `${50 + r() * 50}%`, background: 'rgba(236,230,218,0.12)', marginBottom: 11 }} />)}
      </div>
    </div>
  );
};

const BOTS = Array.from({ length: 10 }, (_, i) => i);
const FALSE_ONES = new Set([1, 4, 8]);
const B02: React.FC<PWProps> = ({ s = 0, cap }) => {
  const { f, dur } = useLocal();
  const { fps } = useVideoConfig();
  if (s === 0) {
    // not written for people: rows of articles race past a crawler
    const rows = 5;
    const scan = mix(-200, W + 200, ramp(f, 0, dur, (t) => t));
    return (
      <Stage cap={cap} cam={{ z: [1.0, 1.08], y: [0, 20] }} glow="rgba(200,255,58,0.03)">
        {Array.from({ length: rows }, (_, r) => {
          const dir = r % 2 ? -1 : 1;
          const sp = 2.2 + r * 0.9;
          return (
            <Layer key={r} d={0.7 + (r % 3) * 0.15} blur={r === 0 || r === 4 ? 4 : 0}>
              {Array.from({ length: 8 }, (_, c) => {
                const x0 = c * 500 - 400 + dir * f * sp;
                const x = ((((x0) % 4000) + 4000) % 4000) - 600;
                const hit = clamp01(1 - Math.abs(x + 220 - scan) / 220);
                return <ArticleCard key={c} x={x} y={40 + r * 220} seed={r * 31 + c + 5} hit={hit} />;
              })}
            </Layer>
          );
        })}
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(10,11,13,0.92) 0%, rgba(10,11,13,0.65) 30%, rgba(10,11,13,0) 52%)' }} />
        <div style={{ position: 'absolute', left: 110, top: 70 }}>
          <Tag size={44} c={P.grey}>HUMAN VISITORS</Tag>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 190, lineHeight: 1, color: P.paper, textShadow: '0 4px 40px #000' }}>0</div>
          <div style={{ marginTop: 14 }}><Tag size={44} c={P.acid}>PAGES CRAWLED</Tag></div>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 84, color: P.acid, lineHeight: 1.1 }}>{(Math.round(clamp01((scan + 200) / (W + 400)) * 3600) * 1000).toLocaleString('en-US')}</div>
        </div>
        <div style={{ position: 'absolute', left: scan - 3, top: 0, width: 6, height: H, background: P.acid, boxShadow: '0 0 40px rgba(200,255,58,0.9)', opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: scan - 240, top: 0, width: 240, height: H, background: 'linear-gradient(90deg, rgba(200,255,58,0), rgba(200,255,58,0.1))' }} />
        <div style={{ position: 'absolute', left: Math.max(40, Math.min(W - 330, scan - 140)), top: 960 - 60, opacity: 0.0 }} />
      </Stage>
    );
  }
  const lit = s === 2 ? ramp(f, 10, 26, eoq) : s === 3 ? 1 : 0;
  const meter = s === 3 ? ramp(f, 6, 44, eoc) : 0;
  const cw = 340, ch = 300, gx = 34;
  const x0 = (W - (5 * cw + 4 * gx)) / 2;
  return (
    <Stage cap={cap} cam={{ z: [1.0, 1.06], x: s === 1 ? [-30, 30] : [10, -10] }} glow="rgba(200,255,58,0.03)">
      <Layer d={0.4} blur={8} opacity={0.35}>{Array.from({ length: 12 }, (_, i) => <ArticleCard key={i} x={(i % 4) * 520 - 100} y={(Math.floor(i / 4)) * 340 + 20} seed={i + 80} />)}</Layer>
      <Layer d={1}>
        {BOTS.map((i) => {
          const col = i % 5, row = Math.floor(i / 5);
          const pop = spring({ frame: f - i * 2.2, fps, config: { damping: 15, stiffness: 130 } });
          const bad = FALSE_ONES.has(i);
          const k = bad ? lit : 0;
          const dim = s >= 2 && !bad ? 0.45 * lit : 0;
          return (
            <div key={i} style={{ position: 'absolute', left: x0 + col * (cw + gx), top: 50 + row * (ch + gx) + (1 - pop) * 80, width: cw, height: ch, background: '#181c21', border: `2px solid ${bad ? `rgba(200,255,58,${0.3 + 0.7 * k})` : 'rgba(236,230,218,0.26)'}`, borderRadius: 18, opacity: pop * (1 - dim), boxShadow: k > 0 ? `0 0 ${60 * k}px rgba(200,255,58,${0.35 * k})` : '0 24px 60px rgba(0,0,0,0.55)' }}>
              <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, border: `3px solid ${bad && k > 0.2 ? P.acid : P.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 12, height: 12, background: bad && k > 0.2 ? P.acid : P.paper, transform: 'rotate(45deg)' }} /></div>
                <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 44, color: P.paper, letterSpacing: '0.04em' }}>{String(i + 1).padStart(2, '0')}</div>
              </div>
              <div style={{ position: 'absolute', left: 24, right: 24, top: 100 }}>
                {[0.95, 0.8, 0.9, 0.6].map((w, j) => <div key={j} style={{ height: 16, width: `${w * 100}%`, marginBottom: 20, borderRadius: 4, background: bad && j === 1 && k > 0 ? P.acid : 'rgba(236,230,218,0.3)', opacity: bad && j === 1 && k > 0 ? 0.4 + 0.6 * k : 1 }} />)}
                <div style={{ height: 16, width: '40%', borderRadius: 4, background: 'rgba(236,230,218,0.12)' }} />
              </div>
              {bad && k > 0.3 && <div style={{ position: 'absolute', left: 24, bottom: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 44, color: P.acid, opacity: k }}>FALSE</div>}
            </div>
          );
        })}
      </Layer>
      {s === 3 && (
        <div style={{ position: 'absolute', left: x0, top: 800, width: 5 * cw + 4 * gx, opacity: ramp(f, 0, 8) }}>
          <div style={{ height: 34, background: 'rgba(236,230,218,0.1)', borderRadius: 17, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${33 * meter}%`, background: P.acid, boxShadow: '0 0 30px rgba(200,255,58,0.7)' }} />
          </div>
          <div style={{ position: 'absolute', left: `${33 * meter}%`, top: -86, transform: 'translateX(-4px)', fontFamily: F.mono, fontWeight: 700, fontSize: 80, color: P.paper, whiteSpace: 'nowrap' }}>{Math.round(33 * meter)} %</div>
        </div>
      )}
      {s === 1 && <div style={{ position: 'absolute', left: 120, top: 8, opacity: 0 }} />}
      {void dur}
    </Stage>
  );
};

// ======================================================================= C01 · ink in clear water
const GLASS = { cx: 960, top: 30, h: 900, wTop: 820, wBot: 660 };
const waterTop = GLASS.top + 230;
const glassPath = (inset: number) => {
  const l1 = GLASS.cx - GLASS.wTop / 2 + inset, r1 = GLASS.cx + GLASS.wTop / 2 - inset, l2 = GLASS.cx - GLASS.wBot / 2 + inset, r2 = GLASS.cx + GLASS.wBot / 2 - inset, y1 = GLASS.top, y2 = GLASS.top + GLASS.h;
  return { l1, r1, l2, r2, y1, y2 };
};
const BLOBS = (() => { const r = rng(31); return Array.from({ length: 520 }, () => ({ tb: r() * 44, a: r() * 6.283, v: 0.35 + r() * 1.2, ph: r() * 6.283, sz: 12 + r() * 34, w: r() })); })();
let sprite: HTMLCanvasElement | null = null;
const getSprite = () => {
  if (sprite) return sprite;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(200,255,58,1)'); g.addColorStop(0.45, 'rgba(200,255,58,0.35)'); g.addColorStop(1, 'rgba(200,255,58,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  sprite = c; return c;
};

const Lattice: React.FC<{ f: number; tint: number; scale?: number; seed?: number; reticle?: boolean; unify?: number }> = ({ f, tint, scale = 1, seed = 1, reticle, unify = 0 }) => {
  const L = 7, N = 8;
  const rr = rng(seed);
  const nodes = Array.from({ length: L * N }, (_, i) => { const l = Math.floor(i / N), n = i % N; return { x: 260 + l * 230 + (rr() - 0.5) * 60, y: 160 + n * 100 + (l % 2) * 40 + (rr() - 0.5) * 40, l }; });
  const edges: [number, number][] = [];
  for (let l = 0; l < L - 1; l++) for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) if ((a * 5 + b * 3 + l) % 3 === 0) edges.push([l * N + a, (l + 1) * N + b]);
  const wave = tint * (L + 1.5);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: '50% 50%' }}>
      {edges.map(([a, b], i) => { const na = nodes[a], nb = nodes[b]; const k = clamp01(wave - na.l); return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={k > 0 ? `rgba(200,255,58,${0.1 + 0.22 * Math.max(k, unify)})` : 'rgba(236,230,218,0.2)'} strokeWidth={2.2} />; })}
      {nodes.map((n, i) => { const k = Math.max(clamp01(wave - n.l - hash(i, seed) * 0.8), unify); return <circle key={i} cx={n.x} cy={n.y} r={11 + 3 * Math.sin(f / 12 + i)} fill={k > 0 ? `rgba(200,255,58,${0.3 + 0.45 * k})` : 'rgba(236,230,218,0.7)'} />; })}
      {reticle && (() => { const t = Math.floor(f / 8); const n = nodes[Math.floor(hash(t, 5) * nodes.length)]; return <g><rect x={n.x - 34} y={n.y - 34} width={68} height={68} fill="none" stroke={P.paper} strokeWidth={3} /><line x1={n.x - 50} x2={n.x - 34} y1={n.y} y2={n.y} stroke={P.paper} strokeWidth={3} /><line x1={n.x + 34} x2={n.x + 50} y1={n.y} y2={n.y} stroke={P.paper} strokeWidth={3} /></g>; })()}
    </svg>
  );
};

const C01: React.FC<PWProps> = ({ s = 0, cap }) => {
  const { f, dur } = useLocal();
  if (s === 0) {
    const g = glassPath(0);
    const gi = glassPath(18);
    const wl = waterTop;
    const dilute = ramp(f, 40, dur, eio);
    return (
      <Stage cap={cap} cam={{ z: [1.12, 1.2], y: [30, 60] }} glow="rgba(236,230,218,0.03)">
        <Layer d={0.3} blur={26} opacity={0.7}>
          {[[1250, 140, 380], [1500, 460, 300], [330, 200, 340], [560, 640, 260], [1330, 760, 330], [140, 600, 280]].map(([x, y, r], i) => <div key={i} style={{ position: 'absolute', left: x - r / 2, top: y - r / 2, width: r, height: r, borderRadius: '50%', background: `radial-gradient(circle, rgba(236,230,218,${0.1 + 0.05 * Math.sin(f / 40 + i)}), rgba(0,0,0,0))` }} />)}
        </Layer>
        <Layer d={1}>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
            <defs>
              <linearGradient id="wat" x1="0" x2="1"><stop offset="0" stopColor="rgba(236,230,218,0.09)" /><stop offset="0.5" stopColor="rgba(236,230,218,0.03)" /><stop offset="1" stopColor="rgba(236,230,218,0.11)" /></linearGradient>
            </defs>
            <path d={`M ${gi.l1} ${wl} L ${gi.r1 - 0} ${wl} L ${gi.r2} ${gi.y2 - 22} L ${gi.l2} ${gi.y2 - 22} Z`} fill="url(#wat)" />
            <ellipse cx={GLASS.cx} cy={wl} rx={GLASS.wTop / 2 - 18} ry={22} fill="rgba(236,230,218,0.06)" stroke="rgba(236,230,218,0.35)" strokeWidth={2} />
            <path d={`M ${g.l1} ${g.y1} L ${g.l2} ${g.y2} L ${g.r2} ${g.y2} L ${g.r1} ${g.y1}`} fill="none" stroke="rgba(236,230,218,0.5)" strokeWidth={4} strokeLinejoin="round" />
            <path d={`M ${gi.l1 + 22} ${g.y1 + 60} L ${gi.l2 + 20} ${g.y2 - 80}`} stroke="rgba(236,230,218,0.35)" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
            <ellipse cx={GLASS.cx} cy={g.y1} rx={GLASS.wTop / 2} ry={26} fill="none" stroke="rgba(236,230,218,0.55)" strokeWidth={3} />
            {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M ${gi.l2 + 30 + k * 110} ${g.y2 - 40} q ${30 * Math.sin(f / 18 + k)} -160 ${40 * Math.cos(f / 22 + k)} -320`} stroke="rgba(236,230,218,0.08)" strokeWidth={22} fill="none" strokeLinecap="round" />)}
            <path d={`M ${g.r1 - 40} ${g.y1 + 80} L ${g.r2 - 34} ${g.y2 - 120}`} stroke="rgba(255,255,255,0.28)" strokeWidth={10} strokeLinecap="round" />
            <path d={`M ${g.r1 - 70} ${g.y1 + 120} L ${g.r2 - 64} ${g.y2 - 300}`} stroke="rgba(255,255,255,0.14)" strokeWidth={4} strokeLinecap="round" />
            <ellipse cx={GLASS.cx} cy={wl} rx={GLASS.wTop / 2 - 20} ry={24} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={3} opacity={0.8} />
            <ellipse cx={GLASS.cx} cy={wl + 4} rx={GLASS.wTop / 2 - 40} ry={16} fill="rgba(236,230,218,0.07)" />
            {f > 12 && f < 46 && <ellipse cx={GLASS.cx} cy={wl} rx={30 + (f - 12) * 7} ry={(6 + (f - 12) * 1.6)} fill="none" stroke={P.acid} strokeWidth={3} opacity={1 - (f - 12) / 34} />}
            <ellipse cx={GLASS.cx} cy={g.y2} rx={GLASS.wBot / 2} ry={22} fill="rgba(236,230,218,0.05)" stroke="rgba(236,230,218,0.4)" strokeWidth={3} />
          </svg>
          <Canvas draw={(ctx, ff) => {
            ctx.save();
            ctx.beginPath(); ctx.moveTo(gi.l1, wl); ctx.lineTo(gi.r1, wl); ctx.lineTo(gi.r2, gi.y2 - 22); ctx.lineTo(gi.l2, gi.y2 - 22); ctx.closePath(); ctx.clip();
            const sp = getSprite();
            ctx.globalCompositeOperation = 'lighter';
            const tt = ff - 10;
            for (const b of BLOBS) {
              const age = tt - b.tb;
              if (age < 0) continue;
              const swirl = Math.sin(b.ph + age * 0.045 * (0.5 + b.w)) * (10 + age * 2.7 * b.v * (0.4 + b.w));
              const x = GLASS.cx + swirl;
              const y = wl + 24 + Math.pow(age, 0.88) * 5.4 * b.v;
              const rad = b.sz * (0.7 + age * 0.012);
              const al = Math.min(1, age / 6) * (0.9 - 0.92 * dilute) * (0.45 + b.w * 0.55);
              ctx.globalAlpha = Math.max(0.0, al * 0.26);
              ctx.drawImage(sp, x - rad, y - rad, rad * 2, rad * 2);
            }
            // a faint, even tint remains
            ctx.globalAlpha = 0.05 * dilute; ctx.fillStyle = P.acid; ctx.fillRect(0, wl, W, H);
            ctx.restore();
            // the falling drop
            const fall = ramp(ff, 0, 12, (t) => t * t);
            if (ff < 12) {
              const y = mix(-40, wl, fall);
              ctx.fillStyle = P.acid; ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(GLASS.cx, y - 70 * fall - 20); ctx.quadraticCurveTo(GLASS.cx + 17, y - 4, GLASS.cx, y + 22); ctx.quadraticCurveTo(GLASS.cx - 17, y - 4, GLASS.cx, y - 70 * fall - 20); ctx.fill();
            }
            ctx.globalAlpha = 1;
          }} />
        </Layer>
      </Stage>
    );
  }
  if (s === 1) {
    return (
      <Stage cap={cap} cam={{ z: [1.0, 1.12], x: [-30, 40] }} glow="rgba(200,255,58,0.03)">
        <Layer d={0.4} blur={9} opacity={0.5}><Lattice f={f} tint={0.5} scale={1.25} seed={9} /></Layer>
        <Layer d={1}><Lattice f={f} tint={ramp(f, 8, dur - 8, eio)} seed={3} /></Layer>
      </Stage>
    );
  }
  return (
    <Stage cap={cap} cam={{ z: [1.0, 1.35], x: [0, 140], y: [0, 40] }} glow="rgba(200,255,58,0.05)">
      <Layer d={0.5} blur={8} opacity={0.5}><Lattice f={f} tint={1} scale={1.3} seed={21} unify={0.5} /></Layer>
      <Layer d={1}><Lattice f={f} tint={1} seed={3} reticle={f < dur * 0.55} unify={ramp(f, dur * 0.5, dur * 0.8, eio)} /></Layer>
      <Layer d={1.6} blur={10} opacity={0.5}><Lattice f={f} tint={1} scale={1.7} seed={44} unify={0.4} /></Layer>
    </Stage>
  );
};

// ======================================================================= C02 · who wrote the pages it learned from?
const C02: React.FC<PWProps> = ({ s = 0, k = 0, cap }) => {
  const { f, dur } = useLocal();
  const fld = mainField();
  const ans = 'The Model X. It is the best choice, no question.';
  const q = 'Who wrote the pages you learned from?';
  if (s === 0) {
    const typed = Math.floor(Math.max(0, f - 12) * 1.0);
    const ul = ramp(f, 40, 56, eoq);
    return (
      <Stage cap={cap} cam={k > 0 ? { z: [1.12, 1.24], y: [20, 60] } : { z: [1.0, 1.12], y: [0, 20] }}>
        <Layer d={0.5} blur={10} opacity={0.35}><ChatFrame x={-420} y={200} w={1000} h={620}>{null}</ChatFrame><ChatFrame x={1340} y={140} w={1000} h={620}>{null}</ChatFrame></Layer>
        <Layer d={1}>
          <ChatFrame>
            <UserBubble top={46}>Which laptop should I buy?</UserBubble>
            <AiAvatar top={176} />
            <div style={{ position: 'absolute', left: 144, top: 164, width: 1380, fontFamily: F.sans, fontSize: 62, lineHeight: 1.26, color: P.paper, fontWeight: 600 }}>
              {ans.slice(0, Math.min(typed, ans.length))}
              {typed < ans.length && <Cursor f={f} />}
              <div style={{ position: 'absolute', left: 0, bottom: -60, height: 5, width: `${ul * 100}%`, maxWidth: 560, background: P.acid, opacity: typed >= ans.length ? 1 : 0 }} />
            </div>
            <Composer />
          </ChatFrame>
        </Layer>
      </Stage>
    );
  }
  if (s === 1) {
    const typed = Math.floor(Math.max(0, f - 4) * 1.15);
    return (
      <Stage cap={cap} cam={{ z: [1.04, 1.22], y: [0, 90] }}>
        <Layer d={0.5} blur={10} opacity={0.35}><ChatFrame x={-420} y={200} w={1000} h={620}>{null}</ChatFrame></Layer>
        <Layer d={1}>
          <ChatFrame>
            <UserBubble top={30}>Which laptop should I buy?</UserBubble>
            <AiAvatar top={150} />
            <div style={{ position: 'absolute', left: 144, top: 138, width: 1380, fontFamily: F.sans, fontSize: 62, lineHeight: 1.26, color: P.paper, fontWeight: 600, opacity: 0.55 }}>{ans}</div>
            <Composer active>{q.slice(0, Math.min(typed, q.length))}<Cursor f={f} /></Composer>
          </ChatFrame>
        </Layer>
      </Stage>
    );
  }
  // s === 2 : the pull-back through the answer into the pages
  const f2 = s === 3 ? 400 : f;
  const pull = ramp(f2, 0, 44, eio);
  const chatS = mix(1.1, 0.12, pull);
  const chatO = 1 - ramp(f2, 14, 40, eoq);
  const zoom = mix(2.4, 0.5, ramp(f2, 4, 56, eoc));
  const w1 = useCue('Who', 30), w2 = useCue('wrote', 38), w3 = useCue('pages', 52), w4 = useCue('learned', 62);
  const word = (t: string, at: number, extra?: React.CSSProperties) => <span style={{ display: 'inline-block', marginRight: 28, opacity: ramp(f2, at, at + 8, eoq), transform: `translateY(${(1 - ramp(f2, at, at + 10, eoc)) * 24}px)`, ...extra }}>{t}</span>;
  return (
    <Stage cap={undefined} glow="rgba(200,255,58,0.03)">
      <Canvas draw={(ctx, ff) => drawField(ctx, fld, { cx: 0, cy: 0, zoom: zoom * 0.95, pageW: 22, t: ff, alpha: 1, acid: (i) => (i % 97 === 0 && ramp(ff, 40, 80) > 0.2 ? 0.8 : 0) })} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,11,13,0.9) 0%, rgba(10,11,13,0.62) 38%, rgba(10,11,13,0) 72%)', opacity: ramp(f2, 24, 56) }} />
      <div style={{ position: 'absolute', left: W / 2 - 810 * chatS, top: H / 2 - 340 * chatS, width: 1620, height: 680, transform: `scale(${chatS})`, transformOrigin: '50% 50%', opacity: chatO }}>
        <ChatFrame x={0} y={0}>
          <UserBubble top={30}>Which laptop should I buy?</UserBubble>
          <AiAvatar top={150} />
          <div style={{ position: 'absolute', left: 144, top: 138, width: 1380, fontFamily: F.sans, fontSize: 62, lineHeight: 1.26, color: P.paper, fontWeight: 600 }}>{ans}</div>
          <Composer active>{q}</Composer>
        </ChatFrame>
      </div>
      <div style={{ position: 'absolute', left: 120, right: 120, top: 250, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 132, lineHeight: 1.04, letterSpacing: '-0.025em', color: P.paper, textShadow: '0 4px 40px rgba(0,0,0,0.9)', textTransform: 'uppercase' }}>
        <div>{word('Who', w1)}{word('wrote', w2)}</div>
        <div>{word('the', w3 - 4)}{word('pages', w3, { color: P.paper, borderBottom: `10px solid ${P.acid}`, paddingBottom: 0 })}</div>
        <div>{word('it', w4 - 4)}{word('learned', w4)}{word('from?', w4 + 6)}</div>
      </div>
      {void dur}
    </Stage>
  );
};

export const PW_A04 = withSkip(A04);
export const PW_B01 = withSkip(B01);
export const PW_B02 = withSkip(B02);
export const PW_C01 = withSkip(C01);
export const PW_C02 = withSkip(C02);
