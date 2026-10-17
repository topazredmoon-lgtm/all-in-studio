import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useCue } from "./core";

export const AmbientBgMatrix: React.FC<{
  cols?: number;
  rows?: number;
  at?: string | number;
  waveColor?: string;
  glyph?: string;
  label?: string;
}> = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(rgba(244,241,234,0.07) 1.5px, transparent 1.5px)",
      backgroundSize: "36px 36px",
      zIndex: 0,
    }}
  />
);

export const LiveCornerTicker: React.FC<{
  label?: string;
  ratePerSecond?: number;
  ratePerFrame?: number;
  startVal?: number;
  baseValue?: number;
  unit?: string;
  climaxAt?: string | number;
}> = ({
  label = "LIVE TELEMETRY",
  ratePerSecond,
  ratePerFrame,
  startVal = 1200,
  baseValue,
  unit = "TOKENS",
  climaxAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cF = useCue(climaxAt) ?? 9999;
  const rate = ratePerFrame ?? (ratePerSecond ? ratePerSecond / fps : 18);
  const base = baseValue ?? startVal;
  const curF = Math.min(frame, cF);
  const val = Math.floor(base + curF * rate).toLocaleString("en-US");

  return (
    <div
      style={{
        position: "absolute",
        top: 22,
        right: 48,
        zIndex: 5,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 16px",
        borderRadius: 999,
        backgroundColor: "rgba(20, 18, 16, 0.9)",
        border: "1.5px solid rgba(244, 241, 234, 0.22)",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 20,
        fontWeight: 700,
        color: "#FAF6EE",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: "#4FB286",
          boxShadow: "0 0 8px #4FB286",
        }}
      />
      <span style={{ color: "#948E86" }}>{label}:</span>
      <span style={{ color: "#4FB286" }}>{val} {unit}</span>
    </div>
  );
};

export const BottomProgressHairline: React.FC<{ color?: string; height?: number }> = ({
  color = "#E63946",
  height = 6,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 100], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height,
        backgroundColor: "rgba(244,241,234,0.12)",
        zIndex: 10,
      }}
    >
      <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color }} />
    </div>
  );
};

export const DotMatrixCounter: React.FC<{
  value?: string | number;
  count?: string | number;
  label?: string;
  unit?: string;
  color?: string;
  subtitle?: string;
  target?: number;
  cols?: number;
  morphAt?: string | number;
  at?: string | number;
}> = ({ value, count, label, unit, color = "#E63946" }) => {
  const displayVal = value ?? count ?? "";
  const displayLabel = label ? (unit ? `${label} (${unit})` : label) : unit;
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}>
      <span
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 44,
          fontWeight: 800,
          color,
        }}
      >
        {displayVal}
      </span>
      {displayLabel && (
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 22,
            fontWeight: 700,
            color: "#5C544B",
          }}
        >
          {displayLabel}
        </span>
      )}
    </div>
  );
};

export const InversionMorphBox: React.FC<{
  beforeLabel?: string;
  afterLabel?: string;
  beforeTitle?: string;
  afterTitle?: string;
  originalText?: string;
  invertedText?: string;
  beforeSubtitle?: string;
  afterSubtitle?: string;
  beforeStats?: string;
  afterStats?: string;
  width?: number | string;
  height?: number | string;
  at?: string | number;
  flipped?: boolean;
}> = ({
  beforeLabel = "HUMAN READING",
  afterLabel = "TOKENIZED STREAM",
  beforeTitle,
  afterTitle,
  originalText,
  invertedText,
  flipped = false,
  width,
  height,
}) => {
  const bTitle = originalText || beforeTitle || beforeLabel;
  const aTitle = invertedText || afterTitle || afterLabel;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        width: width || "100%",
        maxWidth: 1400,
        minHeight: height,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          padding: "24px 28px",
          borderRadius: 18,
          border: "3px solid #181512",
          backgroundColor: flipped ? "#EEE8DC" : "#181512",
          color: flipped ? "#181512" : "#FAF6EE",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 22,
          fontWeight: 700,
          boxShadow: "0 8px 0 #181512",
        }}
      >
        {bTitle}
      </div>
      <div
        style={{
          padding: "24px 28px",
          borderRadius: 18,
          border: "3px solid #181512",
          backgroundColor: "#E63946",
          color: "#FFFFFF",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 22,
          fontWeight: 800,
          boxShadow: "0 8px 0 #181512",
        }}
      >
        {aTitle}
      </div>
    </div>
  );
};
