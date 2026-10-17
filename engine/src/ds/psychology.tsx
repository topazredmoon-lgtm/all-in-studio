import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getStroke } from "perfect-freehand";
import { useCue } from "./core";

export const SHADOW_DEEP = "0 36px 90px rgba(0,0,0,0.78), 0 10px 28px rgba(0,0,0,0.5)";
export const SHADOW_CARD = "0 28px 70px rgba(0,0,0,0.65), 0 8px 20px rgba(0,0,0,0.4)";
export const COLOR_IVORY = "#F7F3EA";
export const COLOR_WHITE = "#FFFFFF";
export const COLOR_CRIMSON = "#E63946";
export const COLOR_EMERALD = "#2E9F6E";
export const COLOR_INK = "#111111";
export const COLOR_MUTED = "#6B6357";
export const COLOR_SKELETON = "#E2DDD2";

function strokeToSvgPath(stroke: number[][]): string {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
}

/**
 * 1. <SmoothStage>:
 * Full 1920x1080 stage, maxWidth 1620px, overflow visible, zero fake macOS window.
 */
export const SmoothStage: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
  spotlightIntensity?: number;
}> = ({ children, dark = false, style, spotlightIntensity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 120, mass: 0.9 } });
  const scale = interpolate(enter, [0, 1], [0.97, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? "#0E0C0B" : "#110F0D",
        backgroundImage: "radial-gradient(rgba(244, 241, 234, 0.10) 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 72px 84px 72px",
        boxSizing: "border-box",
        overflow: "visible",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          opacity,
          overflow: "visible",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 2. <TactileCard>:
 * High-contrast warm ivory physical card with bold 3px border, deep shadow,
 * clean header (kicker, title, badge), and zero card clipping.
 */
export const TactileCard: React.FC<{
  kicker?: string;
  title?: string;
  badge?: string;
  badgeColor?: string;
  dark?: boolean;
  width?: number | string;
  height?: number | string;
  bg?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  kicker,
  title,
  badge,
  badgeColor = "#E63946",
  dark = false,
  width,
  height,
  bg: customBg,
  style,
  children,
}) => {
  const bg = customBg || (dark ? "#181512" : "#F7F3EA");
  const fg = dark ? "#FAF6EE" : "#181512";
  const mute = dark ? "#A0988E" : "#5C544B";
  const borderCol = dark ? "rgba(244,241,234,0.22)" : "#181512";

  const cardWidth = width ? (typeof width === "number" ? Math.min(Math.max(width, 1060), 1580) : width) : "100%";
  const cardMinHeight = height ? (typeof height === "number" ? height : undefined) : undefined;

  return (
    <div
      style={{
        width: cardWidth,
        maxWidth: 1580,
        minHeight: cardMinHeight,
        margin: "0 auto",
        backgroundColor: bg,
        color: fg,
        borderRadius: 24,
        border: `3px solid ${borderCol}`,
        boxShadow: dark
          ? "0 20px 50px rgba(0,0,0,0.75)"
          : "0 14px 0 #181512, 0 28px 60px rgba(0,0,0,0.65)",
        padding: "36px 48px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        overflow: "visible",
        position: "relative",
        ...style,
      }}
    >
      {(kicker || title || badge) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            borderBottom: `2px solid ${dark ? "rgba(244,241,234,0.14)" : "rgba(24,21,18,0.12)"}`,
            paddingBottom: 18,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {kicker && (
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: badgeColor,
                }}
              >
                {kicker}
              </div>
            )}
            {title && (
              <div
                style={{
                  fontFamily: "Archivo, Inter, sans-serif",
                  fontSize: 34,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: fg,
                }}
              >
                {title}
              </div>
            )}
          </div>
          {badge && (
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 20,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: badgeColor,
                color: "#FAF6EE",
                border: "2px solid #181512",
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          width: "100%",
          flex: 1,
        }}
      >
        {children}
      </div>
      <div style={{ display: "none", color: mute }} />
    </div>
  );
};

export const SkeletonBars: React.FC<{
  widths?: string[];
  height?: number;
  gap?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({
  widths = ["88%", "68%", "78%", "52%"],
  height = 14,
  gap = 14,
  color = COLOR_SKELETON,
  style,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, width: "100%", ...style }}>
      {widths.map((w, idx) => (
        <div
          key={idx}
          style={{
            width: w,
            height,
            borderRadius: height / 2,
            background: color,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
};

export const HandInkCircle: React.FC<{
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  at?: string | number;
  rotation?: number;
  strokeWidth?: number;
  color?: string;
}> = ({
  cx,
  cy,
  rx = 110,
  ry = 46,
  at,
  rotation = -3.5,
  strokeWidth = 7,
  color = COLOR_CRIMSON,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 10;
  const p = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  if (p <= 0.02) return null;

  const points: [number, number, number][] = [];
  const totalSteps = 42;
  const currentSteps = Math.max(3, Math.floor(totalSteps * Math.min(1, p)));
  for (let i = 0; i <= currentSteps; i++) {
    const angle = (i / totalSteps) * (Math.PI * 2 + 0.38);
    const wobbleR = 1 + 0.038 * Math.sin(i * 0.85);
    const px = cx + Math.cos(angle) * rx * wobbleR;
    const py = cy + Math.sin(angle) * ry * wobbleR;
    const pressure = 0.45 + 0.3 * Math.sin(angle * 1.5);
    points.push([px, py, pressure]);
  }
  const outline = getStroke(points, { size: strokeWidth, thinning: 0.42, smoothing: 0.65, streamline: 0.5 });
  const pathData = strokeToSvgPath(outline);

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 35,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <path d={pathData} fill={color} opacity={0.94} />
    </svg>
  );
};

export const TactileCursor: React.FC<{
  x: number;
  y: number;
  clickFrame?: number;
  at?: string | number;
}> = ({ x, y, clickFrame, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? clickFrame ?? 16;
  const move = spring({ frame, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const cx = interpolate(move, [0, 1], [x + 140, x]);
  const cy = interpolate(move, [0, 1], [y + 110, y]);
  const clickProg = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 180 } }) : 0;
  const scale = frame >= cueF && frame < cueF + 8 ? 0.85 : 1;

  return (
    <div style={{ position: "absolute", left: cx, top: cy, pointerEvents: "none", zIndex: 40 }}>
      {clickProg > 0 && clickProg < 0.98 && (
        <div
          style={{
            position: "absolute",
            left: -28,
            top: -28,
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "3.5px solid #E63946",
            transform: `scale(${interpolate(clickProg, [0, 1], [0.2, 2.0])})`,
            opacity: interpolate(clickProg, [0, 1], [0.95, 0]),
          }}
        />
      )}
      <svg width="42" height="48" viewBox="0 0 28 34" style={{ transform: `scale(${scale})`, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.65))" }}>
        <path d="M2 2 L2 27 L9 21 L14 31 L19 29 L14 19 L24 19 Z" fill="#FFFFFF" stroke="#111111" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const AttentionSpotlight: React.FC<{ active?: boolean; children: React.ReactNode }> = ({
  active = true,
  children,
}) => (
  <div
    style={{
      opacity: active ? 1 : 0.55,
      transition: "opacity 0.25s ease",
      overflow: "visible",
    }}
  >
    {children}
  </div>
);
export const constAttentionSpotlight = AttentionSpotlight;
