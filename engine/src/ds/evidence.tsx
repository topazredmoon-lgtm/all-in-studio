/**
 * All-in design system: Register B (High-End Editorial Evidence & Motion Graphics).
 * HyperFrames / GSAP caliber programmatic visual evidence components:
 * - DossierDoc: Primary source document with animated highlighter sweep
 * - MetricChart: Real data curve with glowing area gradient, spring reveal & callouts
 * - CodeTerminal: Dark OS window chrome, syntax highlighting & typing cursor
 * - ForensicStamp: Dynamic rubber stamp with spring physics and ink distress
 * - ComparisonCard: Delta statistics with animated counters and direction indicators
 * 
 * Invariants: Zero amateur SVG doodling. Picture leads, text supports.
 */
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from './tokens';
import { mono, hand, useCue, prog } from './core';

type Box = { w: number; h: number };

// Smooth spring easing helper
const useSmoothSpring = (cueFrame: number, config?: { damping?: number; stiffness?: number; mass?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - cueFrame),
    fps,
    config: {
      damping: config?.damping ?? 16,
      stiffness: config?.stiffness ?? 120,
      mass: config?.mass ?? 0.8,
    },
  });
};

/**
 * Animated highlighter sweep: sweeps across target text or area with spring easing.
 */
export const Highlighter: React.FC<{
  w: number;
  h: number;
  at?: string | number;
  c?: string;
  delay?: number;
}> = ({ w, h, at, c = 'rgba(255, 230, 0, 0.38)', delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = useCue(at, 0) + delay;
  const p = interpolate(frame, [f, f + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: -4,
        top: 0,
        height: h,
        width: w + 8,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: c,
          transform: `scaleX(${p})`,
          transformOrigin: 'left center',
          borderRadius: 3,
          boxShadow: `0 0 12px ${c}`,
          filter: 'blur(0.5px)',
        }}
      />
    </div>
  );
};

/**
 * Rubber stamp that slams down with authentic spring bounce.
 */
export const ForensicStamp: React.FC<{
  text: string;
  at?: string | number;
  c?: string;
  rotate?: number;
  scale?: number;
}> = ({ text, at, c = color.red, rotate = -8, scale = 1 }) => {
  const f = useCue(at, 0);
  const s = useSmoothSpring(f, { damping: 12, stiffness: 200, mass: 0.6 });
  const frame = useCurrentFrame();

  if (frame < f) return null;

  return (
    <div
      style={{
        display: 'inline-block',
        border: `3px solid ${c}`,
        borderRadius: 6,
        padding: '6px 18px',
        color: c,
        fontFamily: font.mono,
        fontWeight: 800,
        fontSize: Math.round(26 * scale),
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        transform: `rotate(${rotate}deg) scale(${s})`,
        transformOrigin: 'center center',
        boxShadow: `0 0 16px ${c}33`,
        opacity: Math.min(1, s * 1.2),
      }}
    >
      {text}
    </div>
  );
};

/**
 * Editorial Document / Forensic Dossier with primary source text, metadata & animated highlight.
 */
export const DossierDoc: React.FC<Box & {
  title: string;
  source?: string;
  date?: string;
  lines: string[];
  highlightLine?: number;
  highlightAt?: string | number;
  stamp?: string;
  stampAt?: string | number;
  at?: string | number;
}> = ({
  w,
  h,
  title,
  source = 'OFFICIAL RECORD // ARCHIVE',
  date,
  lines,
  highlightLine = 1,
  highlightAt,
  stamp,
  stampAt,
  at,
}) => {
  const f = useCue(at, 0);
  const enter = useSmoothSpring(f);
  const docW = Math.min(w * 0.92, 540);

  return (
    <div
      style={{
        width: w,
        height: h,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: docW,
          padding: '24px 0',
          boxSizing: 'border-box',
          position: 'relative',
          transform: `translateY(${(1 - enter) * 20}px)`,
          opacity: enter,
        }}
      >
        {/* Header dossier metadata rule */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${color.red}`,
            borderBottom: `1px solid ${color.hairStrong}`,
            paddingTop: 8,
            paddingBottom: 10,
            marginBottom: 24,
          }}
        >
          <div style={{ ...mono(14, color.mute), letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {source}
          </div>
          {date && (
            <div style={{ ...mono(14, color.mute), letterSpacing: '0.06em' }}>{date}</div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: font.serif,
            fontWeight: 700,
            fontSize: 26,
            color: color.ink,
            marginBottom: 24,
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>

        {/* Document Body Lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: stamp ? 38 : 0 }}>
          {lines.map((l, i) => {
            const isHighlight = i === highlightLine;
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  fontFamily: font.sans,
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: isHighlight ? color.ink : 'rgba(235, 235, 235, 0.72)',
                  fontWeight: isHighlight ? 600 : 400,
                  borderLeft: isHighlight ? `3px solid ${color.red}` : '3px solid transparent',
                  paddingLeft: 14,
                }}
              >
                {isHighlight && (
                  <Highlighter w={docW - 40} h={28} at={highlightAt} />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{l}</span>
              </div>
            );
          })}
        </div>

        {/* Stamp Overlay */}
        {stamp && (
          <div
            style={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              zIndex: 10,
            }}
          >
            <ForensicStamp text={stamp} at={stampAt || highlightAt} scale={0.88} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Metric Chart: high-end animated data line with gradient area fill and callout pill.
 */
export const MetricChart: React.FC<Box & {
  points: number[];
  labels?: string[];
  metricLabel: string;
  peakValue: string;
  at?: string | number;
  c?: string;
}> = ({
  w,
  h,
  points,
  labels = [],
  metricLabel,
  peakValue,
  at,
  c = color.teal,
}) => {
  const f = useCue(at, 0);
  const p = useSmoothSpring(f, { damping: 18, stiffness: 90 });
  const chartW = Math.min(w * 0.9, 520);
  const chartH = Math.min(h * 0.6, 280);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const cleanId = metricLabel.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Build SVG path coordinates
  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * chartW;
    const y = chartH - ((val - min) / range) * (chartH - 40) - 20;
    return [x, y] as const;
  });

  const lineD = coords.reduce((acc, [x, y], idx) => {
    return idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  const areaD = `${lineD} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div
      style={{
        width: w,
        height: h,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: chartW, position: 'relative' }}>
        {/* Top Header Metric */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 16,
          }}
        >
          <div style={{ ...mono(16, color.mute), letterSpacing: '0.08em' }}>
            {metricLabel}
          </div>
          <div
            style={{
              fontFamily: font.mono,
              fontWeight: 800,
              fontSize: 32,
              color: c,
              opacity: p,
            }}
          >
            {peakValue}
          </div>
        </div>

        {/* SVG Chart */}
        <svg width={chartW} height={chartH} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`chartGrad-${cleanId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={0.35} />
              <stop offset="100%" stopColor={c} stopOpacity={0.0} />
            </linearGradient>
            <clipPath id={`clip-${cleanId}`}>
              <rect x="0" y="0" width={chartW * p} height={chartH} />
            </clipPath>
          </defs>

          {/* Dotted horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((lvl, i) => (
            <line
              key={i}
              x1={0}
              y1={chartH * lvl}
              x2={chartW}
              y2={chartH * lvl}
              stroke={color.hair}
              strokeDasharray="4 6"
              strokeWidth={1}
            />
          ))}

          {/* Area fill */}
          <path
            d={areaD}
            fill={`url(#chartGrad-${cleanId})`}
            clipPath={`url(#clip-${cleanId})`}
          />

          {/* Line stroke */}
          <path
            d={lineD}
            fill="none"
            stroke={c}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath={`url(#clip-${cleanId})`}
          />

          {/* Peak dot callout */}
          {coords.length > 0 && (
            <circle
              cx={coords[coords.length - 1][0]}
              cy={coords[coords.length - 1][1]}
              r={5}
              fill={c}
              stroke="#0d1117"
              strokeWidth={2}
              opacity={p > 0.95 ? 1 : 0}
            />
          )}
        </svg>

        {/* X Axis Labels */}
        {labels.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              borderTop: `1px solid ${color.hair}`,
              paddingTop: 8,
            }}
          >
            {labels.map((lbl, i) => (
              <div key={i} style={{ ...mono(12, color.mute) }}>
                {lbl}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Code Terminal: authentic OS window with syntax highlighting and typing reveal.
 */
export const CodeTerminal: React.FC<Box & {
  title?: string;
  codeLines?: { line?: number; text: string; highlight?: boolean }[];
  lines?: ({ line?: number; text: string; highlight?: boolean } | string)[];
  at?: string | number;
}> = ({
  w,
  h,
  title = 'exploit.py',
  codeLines,
  lines,
  at,
}) => {
  const f = useCue(at, 0);
  const frame = useCurrentFrame();
  const enter = useSmoothSpring(f);
  const termW = Math.min(w * 0.92, 540);
  const rawList = codeLines ?? lines ?? [];
  const normalizedLines = rawList.map((row, i) =>
    typeof row === 'string' ? { line: i + 1, text: row, highlight: false } : { line: row.line ?? i + 1, text: row.text, highlight: row.highlight }
  );

  return (
    <div
      style={{
        width: w,
        height: h,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: termW,
          background: '#0a0d12',
          border: `1.5px solid ${color.hairStrong}`,
          borderRadius: 8,
          boxShadow: '0 24px 60px rgba(0,0,0,0.75)',
          overflow: 'hidden',
          transform: `translateY(${(1 - enter) * 20}px)`,
          opacity: enter,
        }}
      >
        {/* Terminal Chrome Bar */}
        <div
          style={{
            height: 38,
            background: '#12171f',
            borderBottom: `1px solid ${color.hair}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
          }}
        >
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#ff5f56' }} />
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#ffbd2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#27c93f' }} />
          <div style={{ flex: 1, textAlign: 'center', ...mono(13, color.mute) }}>
            {title}
          </div>
          <div style={{ width: 33 }} />
        </div>

        {/* Code Content */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {normalizedLines.map((row, i) => {
            const lineReveal = prog(frame, f + i * 5, 6);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontFamily: font.mono,
                  fontSize: 16,
                  opacity: lineReveal,
                  backgroundColor: row.highlight ? 'rgba(255, 92, 92, 0.12)' : 'transparent',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                <span style={{ color: color.mute, width: 22, textAlign: 'right', fontSize: 13, userSelect: 'none' }}>
                  {row.line}
                </span>
                <span style={{ color: row.highlight ? color.red : color.ink }}>
                  {row.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
