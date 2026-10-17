import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
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
 * Continuous 0.35Hz camera float + pre-attentive spotlight + 3D spring entrance.
 * Ensures zero static holds across the entire presentation.
 */
export const SmoothStage: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  spotlightIntensity?: number;
}> = ({ children, style, spotlightIntensity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 3D spring entry
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const scaleEnter = interpolate(enter, [0, 1], [0.93, 1]);

  // Continuous sinusoidal micro-float (0.35 Hz) so no frame is ever static
  const floatX = Math.sin(t * 0.35 * Math.PI * 2) * 7;
  const floatY = Math.cos(t * 0.28 * Math.PI * 2) * 5;
  const rotX = Math.sin(t * 0.31 * Math.PI * 2) * 1.1;
  const rotY = Math.cos(t * 0.25 * Math.PI * 2) * 1.3;
  const breathe = 1 + Math.sin(t * 0.4 * Math.PI * 2) * 0.007;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1200,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Warm Pre-attentive Spotlight behind hero */}
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(247,243,234,${0.09 * spotlightIntensity}) 0%, rgba(247,243,234,0.02) 45%, transparent 70%)`,
          pointerEvents: "none",
          transform: `translate3d(${floatX * 0.5}px, ${floatY * 0.5}px, 0)`,
          zIndex: 1,
        }}
      />

      {/* Floating 3D Stage Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scaleEnter * breathe}) translate3d(${floatX}px, ${floatY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * 2. <TactileCard>:
 * High-contrast warm ivory / pure white physical card (1060x540 default),
 * rounded 28px corners, deep layered shadow, window dots & chrome bar.
 * Permanently bans dark-on-dark box slop!
 */
export const TactileCard: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  bg?: string;
  title?: string;
  badge?: string;
  badgeColor?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  width = 1060,
  height = 540,
  bg = COLOR_IVORY,
  title,
  badge,
  badgeColor = COLOR_EMERALD,
  style,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: bg,
        borderRadius: 28,
        boxShadow: SHADOW_DEEP,
        border: "1.5px solid rgba(226,221,210,0.85)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: COLOR_INK,
        fontFamily: "Inter, Archivo, sans-serif",
        ...style,
      }}
    >
      {/* Top Window Chrome */}
      <div
        style={{
          width: "100%",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid rgba(215,206,191,0.6)",
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Chrome Dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF5F56", border: "1px solid #E0443E" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFBD2E", border: "1px solid #DEA123" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#27C93F", border: "1px solid #1AAB29" }} />
          {title && (
            <span
              style={{
                marginLeft: 14,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_MUTED,
                letterSpacing: 0.5,
              }}
            >
              {title}
            </span>
          )}
        </div>

        {badge && (
          <div
            style={{
              background: badgeColor === COLOR_CRIMSON ? "rgba(230,57,70,0.14)" : "rgba(46,159,110,0.14)",
              color: badgeColor,
              border: `1.5px solid ${badgeColor}`,
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 20,
              fontWeight: 800,
              padding: "6px 16px",
              borderRadius: 999,
              letterSpacing: 0.5,
            }}
          >
            {badge}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          position: "relative",
          flex: 1,
          padding: "26px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * 3. <SkeletonBars>:
 * Eliminates Mayer's split-attention & redundancy effect by replacing tiny
 * small unreadable text paragraphs with soft, blurred rounded context bars.
 */
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

/**
 * 4. <HandInkCircle>:
 * Hand-drawn pressure-sensitive crimson ink circle (perfect-freehand) that
 * draws around a focal word or element precisely on speech cue (Posner spatial cueing).
 */
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

/**
 * 5. <TactileCursor>:
 * Organic bezier mouse cursor with realistic spring physics, mass/damping,
 * scale bounce, and animated red click ripples (#E63946).
 */
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
