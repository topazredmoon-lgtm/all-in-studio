import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { getStroke } from "perfect-freehand";
import { useCue } from "./core";
export * from "./psychology";
export * from "./juice";
export * from "./hyperframes_bridge";

export const SHADOW_DEEP = "0 30px 70px rgba(0,0,0,0.82), 0 8px 22px rgba(0,0,0,0.55)";
export const SHADOW_PAPER = "0 20px 50px rgba(0,0,0,0.7), 0 6px 16px rgba(0,0,0,0.45)";

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

// Hand-drawn pressure-sensitive red ink circle callout
export const RedInkCircle: React.FC<{
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  at?: string;
  rotation?: number;
}> = ({ cx, cy, rx = 100, ry = 42, at, rotation = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 12;
  const p = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  if (p <= 0.02) return null;

  const points: [number, number, number][] = [];
  const totalSteps = 42;
  const currentSteps = Math.max(3, Math.floor(totalSteps * Math.min(1, p)));
  for (let i = 0; i <= currentSteps; i++) {
    const angle = (i / totalSteps) * (Math.PI * 2 + 0.35);
    const wobbleR = 1 + 0.035 * Math.sin(i * 0.8);
    const px = cx + Math.cos(angle) * rx * wobbleR;
    const py = cy + Math.sin(angle) * ry * wobbleR;
    const pressure = 0.45 + 0.3 * Math.sin(angle * 1.5);
    points.push([px, py, pressure]);
  }
  const outline = getStroke(points, { size: 6.5, thinning: 0.45, smoothing: 0.65, streamline: 0.5 });
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
        zIndex: 25,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <path d={pathData} fill="#E63946" opacity={0.92} />
    </svg>
  );
};

// Hand-drawn pressure-sensitive red ink arrow
export const RedInkArrow: React.FC<{
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  at?: string;
}> = ({ x0, y0, x1, y1, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 12;
  const p = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 15, stiffness: 150 } }) : 0;
  if (p <= 0.02) return null;

  const points: [number, number, number][] = [];
  const steps = 18;
  const curSteps = Math.max(2, Math.floor(steps * Math.min(1, p)));
  for (let i = 0; i <= curSteps; i++) {
    const t = i / steps;
    const px = interpolate(t, [0, 1], [x0, x1]) + Math.sin(t * Math.PI) * 12;
    const py = interpolate(t, [0, 1], [y0, y1]);
    const pressure = 0.35 + 0.4 * t;
    points.push([px, py, pressure]);
  }
  const outline = getStroke(points, { size: 6, thinning: 0.35, smoothing: 0.6, streamline: 0.5 });
  const pathData = strokeToSvgPath(outline);

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 25 }}>
      <path d={pathData} fill="#E63946" opacity={0.92} />
    </svg>
  );
};

// Curseur de souris réaliste avec onde de clic
export const TactileCursor: React.FC<{ x: number; y: number; clickFrame?: number }> = ({ x, y, clickFrame = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const move = spring({ frame, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const cx = interpolate(move, [0, 1], [x + 140, x]);
  const cy = interpolate(move, [0, 1], [y + 110, y]);
  const clickProg = frame >= clickFrame ? spring({ frame: frame - clickFrame, fps, config: { damping: 14, stiffness: 180 } }) : 0;
  const scale = frame >= clickFrame && frame < clickFrame + 8 ? 0.86 : 1;

  return (
    <div style={{ position: "absolute", left: cx, top: cy, pointerEvents: "none", zIndex: 30 }}>
      {clickProg > 0 && clickProg < 0.98 && (
        <div
          style={{
            position: "absolute",
            left: -24,
            top: -24,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid #E63946",
            transform: `scale(${interpolate(clickProg, [0, 1], [0.2, 1.9])})`,
            opacity: interpolate(clickProg, [0, 1], [0.95, 0]),
          }}
        />
      )}
      <svg width="38" height="44" viewBox="0 0 28 34" style={{ transform: `scale(${scale})`, filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.65))" }}>
        <path d="M2 2 L2 27 L9 21 L14 31 L19 29 L14 19 L24 19 Z" fill="#FFFFFF" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// 1. JobPortalCard (remplace ATSScanner / FunnelSieve amateur) — Vraie carte blanche style LinkedIn / Job Portal
export const JobPortalCard: React.FC<{
  role?: string;
  company?: string;
  applicants?: string;
  statusText?: string;
  at?: string;
  tag?: { t: string; at?: string };
}> = ({
  role = "Senior Systems Analyst",
  company = "Enterprise Corp · New York, NY",
  applicants = "248 applicants in 14 minutes",
  statusText = "AUTO-DISCARDED IN 0.2s · 0 HUMAN VIEWS",
  at,
  tag,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 18;
  const enterSp = spring({ frame, fps, config: { damping: 16, stiffness: 130, mass: 0.8 } });
  const rejectSp = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 160 } }) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "relative",
          width: 760,
          background: "#FFFFFF",
          borderRadius: 16,
          boxShadow: SHADOW_DEEP,
          overflow: "hidden",
          transform: `scale(${interpolate(enterSp, [0, 1], [0.94, 1])})`,
          color: "#141414",
          fontFamily: "Inter, Archivo, sans-serif",
        }}
      >
        {/* Top Blue Portal Header */}
        <div style={{ background: "#0A66C2", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFFFFF" }} />
            <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.3 }}>CAREER PORTAL · EASY APPLY</span>
          </div>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, opacity: 0.9 }}>AEDT FILTER v4.2</span>
        </div>

        {/* Body */}
        <div style={{ padding: "30px 34px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#111111", lineHeight: 1.15 }}>{role}</div>
              <div style={{ fontSize: 22, color: "#555555", marginTop: 6, fontWeight: 500 }}>{company}</div>
            </div>
            <div style={{ background: "#EEF3F8", color: "#0A66C2", padding: "8px 16px", borderRadius: 999, fontSize: 18, fontWeight: 700, fontFamily: "IBM Plex Mono, monospace" }}>
              {applicants}
            </div>
          </div>

          {/* Skeleton Resume Lines */}
          <div style={{ background: "#F7F5F0", borderRadius: 12, padding: "18px 22px", border: "1px solid #E5E0D5", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, fontWeight: 700, color: "#333" }}>resume_final_v4.pdf</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, color: rejectSp > 0.2 ? "#E63946" : "#4FB286", fontWeight: 700 }}>
                {rejectSp > 0.2 ? "KEYWORD SCORE: 41% ✗" : "UPLOADED ✓"}
              </span>
            </div>
            <div style={{ width: "88%", height: 12, borderRadius: 6, background: "#E2DDD2" }} />
            <div style={{ width: "64%", height: 12, borderRadius: 6, background: "#E2DDD2" }} />
          </div>

          {/* Action / Rejection Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
            <div
              style={{
                background: rejectSp > 0.1 ? "#E63946" : "#0A66C2",
                color: "#FFFFFF",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 0.4,
                transform: `scale(${1 + 0.04 * Math.sin(rejectSp * Math.PI)})`,
              }}
            >
              {rejectSp > 0.1 ? statusText : "Submit Application"}
            </div>
          </div>
        </div>

        <TactileCursor x={190} y={295} clickFrame={Math.max(6, cueF - 4)} />
      </div>

      {tag?.t && (
        <div style={{ marginTop: 22, fontFamily: "Shantell Sans, cursive", fontSize: 42, fontWeight: 700, color: "#E63946", opacity: rejectSp }}>
          ↑ {tag.t}
        </div>
      )}
    </div>
  );
};

// 2. StrawberrySlicer (remplace TokenSieve / VectorSpace / ContextWindow) — Découpe tactile d'un mot en briques-tokens aveugles
export const StrawberrySlicer: React.FC<{
  word?: string;
  chunks?: Array<{ text: string; id: string }>;
  at?: string;
  tag?: { t: string; at?: string };
}> = ({
  word = "strawberry",
  chunks = [
    { text: "straw", id: "496" },
    { text: "ber", id: "675" },
    { text: "ry", id: "1553" },
  ],
  at,
  tag,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 16;
  const sliceSp = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 150 } }) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div
        style={{
          width: 860,
          background: "#FFFFFF",
          borderRadius: 18,
          boxShadow: SHADOW_DEEP,
          padding: "34px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          color: "#141414",
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #EFECE6", paddingBottom: 14 }}>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 20, fontWeight: 700, color: "#666" }}>
            {sliceSp < 0.25 ? "WHAT YOUR EYES READ (10 LETTERS · 3 R's)" : "WHAT THE MODEL SEES (3 NUMBERED TOKENS · 0 LETTERS)"}
          </span>
          <span style={{ background: sliceSp < 0.25 ? "#E8F8F0" : "#FDECEC", color: sliceSp < 0.25 ? "#18794E" : "#E63946", fontFamily: "IBM Plex Mono, monospace", fontWeight: 800, fontSize: 18, padding: "6px 14px", borderRadius: 8 }}>
            {sliceSp < 0.25 ? "HUMAN VIEW" : "cl100k_base TOKENIZER"}
          </span>
        </div>

        {/* Word vs Sliced Token Bricks */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: interpolate(sliceSp, [0, 1], [0, 26]), minHeight: 150 }}>
          {chunks.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: sliceSp > 0.1 ? "#161411" : "#F7F4EC",
                color: sliceSp > 0.1 ? "#FAF6EE" : "#111111",
                border: sliceSp > 0.1 ? "3px solid #E63946" : "2px solid #E0DBD0",
                borderRadius: 14,
                padding: "20px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                boxShadow: sliceSp > 0.1 ? "0 14px 30px rgba(230,57,70,0.28)" : "none",
                transform: `translateY(${idx % 2 === 0 ? -6 * sliceSp : 6 * sliceSp}px)`,
              }}
            >
              <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 64, fontWeight: 800, letterSpacing: 1, opacity: interpolate(sliceSp, [0, 0.85], [1, 0.22]) }}>
                {c.text}
              </span>
              <span
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#E63946",
                  background: "rgba(230,57,70,0.14)",
                  padding: "4px 14px",
                  borderRadius: 8,
                  opacity: sliceSp,
                }}
              >
                ID #{c.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {tag?.t && (
        <div style={{ marginTop: 22, fontFamily: "Shantell Sans, cursive", fontSize: 42, fontWeight: 700, color: "#E63946", opacity: sliceSp }}>
          ↑ {tag.t}
        </div>
      )}
    </div>
  );
};

// 3. UtilityBillCard (remplace UtilityStatement / FERCDocket amateur) — Vraie facture électrique papier crème #F8F5EE
export const UtilityBillCard: React.FC<{
  provider?: string;
  lineLabel?: string;
  oldAmount?: string;
  newAmount?: string;
  at?: string;
  tag?: { t: string; at?: string };
}> = ({
  provider = "REGIONAL ELECTRIC · MONTHLY STATEMENT",
  lineLabel = "PJM Grid & Datacenter Capacity Surcharge",
  oldAmount = "$28.92 / MW-day",
  newAmount = "$269.92 / MW-day (+833%)",
  at,
  tag,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueF = useCue(at) ?? 16;
  const hiSp = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 15, stiffness: 140 } }) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div
        style={{
          width: 780,
          background: "#F6F2E8",
          color: "#161411",
          borderRadius: 12,
          boxShadow: SHADOW_DEEP,
          padding: "32px 38px",
          transform: "rotate(-0.8deg)",
          border: "1px solid #DED7C8",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #161411", paddingBottom: 14 }}>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 20, fontWeight: 700 }}>{provider}</span>
          <span style={{ background: "#E63946", color: "#FFFFFF", fontFamily: "IBM Plex Mono, monospace", fontSize: 18, fontWeight: 800, padding: "4px 12px", borderRadius: 6 }}>
            RATE HIKE NOTICE
          </span>
        </div>

        {/* Skeleton rows */}
        <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.45, fontFamily: "IBM Plex Mono, monospace", fontSize: 18 }}>
          <span>Residential Base Delivery</span>
          <span>$64.10</span>
        </div>

        {/* Highlighted Surcharge Row */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(90deg, rgba(230,57,70,0.22) ${hiSp * 100}%, rgba(230,57,70,0.0) ${hiSp * 100}%)`,
            border: "2.5px solid #E63946",
            borderRadius: 10,
            padding: "18px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontFamily: "Source Serif 4, serif", fontSize: 28, fontWeight: 700, color: "#111111" }}>{lineLabel}</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, color: "#665E52", marginTop: 4 }}>Previous clearing price: {oldAmount}</div>
          </div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 32, fontWeight: 800, color: "#E63946" }}>{newAmount}</div>
        </div>
      </div>

      {tag?.t && (
        <div style={{ marginTop: 22, fontFamily: "Shantell Sans, cursive", fontSize: 42, fontWeight: 700, color: "#E63946", opacity: hiSp }}>
          ↑ {tag.t}
        </div>
      )}
    </div>
  );
};
