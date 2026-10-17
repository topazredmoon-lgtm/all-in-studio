/**
 * Topic visuals: THE DARK REALITY OF ELON MUSK (2-minute cinema sample, 2026-10-13).
 *
 * Core All-in studio grammar:
 * - Designed for Left/Right split (side-to-side evidence comparison, w: 700, h: 540-640)
 * - "Say the line, point at the thing it names": concrete, topic-accurate vector diagrams
 *   (orbital satellite shells, payload mass fraction ratios, Tesla camera vision cones & sensor purge,
 *    Black Sea geofence cutoff map, and autonomous vehicle beta telemetry / legal waiver).
 * - Every element lands on its cue word (Whisper sync).
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { hand, mono, prog, useBeat, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';

export { LineIcon, IconRow, Loop, Copier, FieldCard } from '../ds/kit';

type Box = { w: number; h: number };
type Cue = string | number | undefined;

// =========================================================================================
// 1. STARLINK SHELL / ORBITAL SATELLITE GRID
// =========================================================================================
export const StarlinkShell: React.FC<Box & { satAt?: Cue; monopolyAt?: Cue; lockAt?: Cue }> = ({
  w,
  h,
  satAt,
  monopolyAt,
  lockAt,
}) => {
  const frame = useCurrentFrame();
  const sf = useCue(satAt, 0);
  const mf = useCue(monopolyAt, 9999);
  const lf = useCue(lockAt, 9999);

  const sp = prog(frame, sf, 20);
  const mp = prog(frame, mf, 12);
  const lp = prog(frame, lf, 15);

  const cx = w / 2;
  const cy = h * 0.78;
  const er = Math.min(w * 0.42, 280);

  // 4 orbital inclination shells
  const shells = [
    { rx: er + 45, ry: 75, rot: -28, sats: 9, speed: 0.015 },
    { rx: er + 55, ry: 90, rot: -10, sats: 11, speed: -0.012 },
    { rx: er + 65, ry: 85, rot: 15, sats: 10, speed: 0.018 },
    { rx: er + 75, ry: 100, rot: 32, sats: 12, speed: -0.014 },
  ];

  return (
    <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B2B3A" />
            <stop offset="75%" stopColor="#0F1822" />
            <stop offset="100%" stopColor="#080C10" />
          </radialGradient>
          <radialGradient id="atmoRim" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#4FB286" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#1A73E8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#080C10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Atmosphere rim */}
        <ellipse cx={cx} cy={cy} rx={er + 25} ry={er * 0.65 + 18} fill="url(#atmoRim)" />

        {/* Earth sphere */}
        <ellipse cx={cx} cy={cy} rx={er} ry={er * 0.62} fill="url(#earthGlow)" stroke="#2C3E50" strokeWidth={2.5} />

        {/* Lat/long wireframe arcs on Earth */}
        {[-0.3, 0, 0.3].map((lat, i) => (
          <ellipse
            key={`lat-${i}`}
            cx={cx}
            cy={cy + lat * (er * 0.5)}
            rx={er * Math.cos(lat * Math.PI * 0.5)}
            ry={(er * 0.28) * Math.cos(lat * Math.PI * 0.5)}
            fill="none"
            stroke="#223344"
            strokeWidth={1.5}
            strokeDasharray="4 6"
          />
        ))}

        {/* Orbital Shells & Satellites */}
        {shells.map((sh, idx) => {
          const shellOp = Math.min(1, sp * 1.2);
          return (
            <g key={`shell-${idx}`} transform={`rotate(${sh.rot} ${cx} ${cy})`} opacity={shellOp}>
              {/* Elliptical orbit trace */}
              <ellipse
                cx={cx}
                cy={cy}
                rx={sh.rx}
                ry={sh.ry}
                fill="none"
                stroke={idx === 1 ? color.red : '#A4B0BE'}
                strokeWidth={idx === 1 ? 2.2 : 1.4}
                strokeDasharray={idx === 1 ? '6 4' : '3 5'}
                opacity={0.65}
              />

              {/* Satellites orbiting */}
              {Array.from({ length: sh.sats }).map((_, sidx) => {
                const angle = ((sidx / sh.sats) + frame * sh.speed) * Math.PI * 2;
                const sx = cx + sh.rx * Math.cos(angle);
                const sy = cy + sh.ry * Math.sin(angle);

                // Is satellite behind Earth?
                const isBehind = Math.sin(angle) > 0.45 && sy > cy;
                if (isBehind) return null;

                const isTarget = idx === 1 && sidx === 2;

                return (
                  <g key={`sat-${sidx}`} transform={`translate(${sx} ${sy})`}>
                    {/* Solar panels */}
                    <line x1={-8} y1={0} x2={8} y2={0} stroke={isTarget ? color.red : '#EAECEF'} strokeWidth={2} />
                    {/* Satellite body */}
                    <circle cx={0} cy={0} r={2.5} fill={isTarget ? color.red : '#FAF6EE'} />

                    {/* Downlink beam on target */}
                    {isTarget && lp > 0 && (
                      <line
                        x1={0}
                        y1={0}
                        x2={cx - sx}
                        y2={cy - 20 - sy}
                        stroke={color.red}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        opacity={lp}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Ground Station Terminal */}
        <g transform={`translate(${cx} ${cy - 20})`}>
          <path d="M-12 0 C-10 -14 10 -14 12 0 Z" fill="#3A4D62" stroke="#FAF6EE" strokeWidth={2} />
          <line x1={0} y1={-8} x2={0} y2={4} stroke="#FAF6EE" strokeWidth={2} />
          <line x1={-8} y1={4} x2={8} y2={4} stroke="#FAF6EE" strokeWidth={2.5} />
        </g>
      </svg>

      {/* Top telemetry and monopoly badges */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: 'rgba(14,12,11,0.85)',
            border: '1.5px solid rgba(233,227,211,0.28)',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            opacity: sp,
          }}
        >
          <span style={{ ...mono(16, color.mute), letterSpacing: '0.12em', textTransform: 'uppercase' }}>LOW EARTH ORBIT</span>
          <span style={{ ...mono(24, color.ink), fontWeight: 700 }}>6,400+ ACTIVE</span>
        </div>

        {mp > 0 && (
          <div
            style={{
              background: 'rgba(230,57,70,0.15)',
              border: `2px solid ${color.red}`,
              borderRadius: 8,
              padding: '8px 16px',
              opacity: mp,
              transform: `scale(${1.1 - 0.1 * mp})`,
              transformOrigin: 'left top',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span style={{ ...mono(15, color.red), fontWeight: 700, letterSpacing: '0.12em' }}>ORBITAL MONOPOLY</span>
            <span style={{ ...mono(22, color.red), fontWeight: 800 }}>62% OF ALL SATELLITES</span>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================================
// 2. HEAVY PAYLOAD MASS RATIOS / LAUNCH MONOPOLY
// =========================================================================================
export const PayloadRatio: React.FC<Box & { massAt?: Cue; ratioAt?: Cue; rocketAt?: Cue }> = ({
  w,
  h,
  massAt,
  ratioAt,
  rocketAt,
}) => {
  const frame = useCurrentFrame();
  const mf = useCue(massAt, 0);
  const rf = useCue(ratioAt, 9999);
  const rkf = useCue(rocketAt, 0);

  const mp = prog(frame, mf, 24);
  const rp = prog(frame, rf, 14);
  const rkp = prog(frame, rkf, 18);

  const bars = [
    { label: 'SPACEX', tons: 1320, pct: 0.87, color: color.red },
    { label: 'CHINA', tons: 160, pct: 0.1, color: '#8A8F98' },
    { label: 'USA GOV', tons: 35, pct: 0.02, color: '#555C66' },
    { label: 'EUROPE', tons: 15, pct: 0.01, color: '#3A404A' },
  ];

  const maxBarH = h * 0.52;
  const colW = (w * 0.48) / bars.length - 14;

  return (
    <div style={{ width: w, height: h, position: 'relative', display: 'flex', padding: 24, boxSizing: 'border-box' }}>
      {/* Left side: Rocket Mass Fraction Schematic */}
      <div style={{ width: w * 0.44, height: '100%', position: 'relative', borderRight: '1px solid rgba(233,227,211,0.18)', paddingRight: 16 }}>
        <div style={{ ...mono(18, color.mute), letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          VEHICLE STACK
        </div>

        <svg width="100%" height={h * 0.78} viewBox="0 0 240 460" style={{ overflow: 'visible' }}>
          {/* Fairing / Payload Capsule at Top */}
          <g opacity={rkp}>
            <path d="M120 40 Q105 80 105 130 L135 130 Q135 80 120 40 Z" fill="#20252E" stroke={color.red} strokeWidth={2.5} />
            <text x={148} y={90} fill={color.red} style={{ ...mono(16, color.red), fontWeight: 700 }}>PAYLOAD</text>
            <text x={148} y={110} fill={color.mute} style={{ ...mono(14, color.mute) }}>~4% MASS</text>
          </g>

          {/* Interstage separation line */}
          <line x1={95} y1={134} x2={145} y2={134} stroke="#FAF6EE" strokeWidth={2} strokeDasharray="3 3" />

          {/* Heavy Reusable Booster Stage */}
          <g opacity={rkp}>
            <rect x={105} y={138} width={30} height={230} rx={3} fill="#14181F" stroke="#A4B0BE" strokeWidth={2.5} />
            {/* Grid Fins */}
            <rect x={96} y={148} width={9} height={16} fill="none" stroke="#FAF6EE" strokeWidth={2} />
            <rect x={135} y={148} width={9} height={16} fill="none" stroke="#FAF6EE" strokeWidth={2} />

            {/* Raptor / Merlin engine bells */}
            <path d="M106 368 L101 390 L115 390 L112 368 Z" fill="#2C3440" stroke="#FAF6EE" strokeWidth={1.5} />
            <path d="M117 368 L114 390 L126 390 L123 368 Z" fill="#2C3440" stroke="#FAF6EE" strokeWidth={1.5} />
            <path d="M128 368 L125 390 L139 390 L134 368 Z" fill="#2C3440" stroke="#FAF6EE" strokeWidth={1.5} />

            <text x={24} y={230} fill={color.ink} style={{ ...mono(16, color.ink) }}>BOOSTER</text>
            <text x={24} y={250} fill={color.mute} style={{ ...mono(14, color.mute) }}>96% MASS</text>
          </g>
        </svg>

        {/* Small label at bottom */}
        <div style={{ position: 'absolute', bottom: 12, left: 0, ...mono(14, color.mute) }}>
          REUSABLE LAUNCH CHOKEPOINT
        </div>
      </div>

      {/* Right side: Global Mass to Orbit Bar Chart */}
      <div style={{ flex: 1, paddingLeft: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...mono(18, color.mute), letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          GLOBAL MASS TO ORBIT (2024)
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 40, borderBottom: '1px solid rgba(233,227,211,0.2)' }}>
          {bars.map((b, i) => {
            const hVal = b.pct * maxBarH * mp;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                {/* Metric text on top of bar */}
                <div style={{ ...mono(15, b.color === color.red ? color.red : color.mute), fontWeight: 700, marginBottom: 6, opacity: mp }}>
                  {Math.round(b.tons * mp)}t
                </div>

                {/* Vertical Bar */}
                <div
                  style={{
                    width: '100%',
                    height: Math.max(4, hVal),
                    backgroundColor: b.color,
                    borderRadius: '4px 4px 0 0',
                    border: b.color === color.red ? '1.5px solid #FF6B6B' : '1px solid rgba(255,255,255,0.1)',
                  }}
                />

                {/* Label under bar */}
                <div style={{ ...mono(13, b.color === color.red ? color.ink : color.mute), marginTop: 10, textAlign: 'center' }}>
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Callout */}
        {rp > 0 && (
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              backgroundColor: 'rgba(230,57,70,0.12)',
              border: `1.5px solid ${color.red}`,
              borderRadius: 6,
              opacity: rp,
            }}
          >
            <div style={{ ...mono(20, color.red), fontWeight: 800 }}>87% GLOBAL LAUNCH MONOPOLY</div>
            <div style={{ ...mono(13, color.ink), marginTop: 4 }}>NO DOMESTIC US COMPETITOR CARRIES CREW</div>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================================
// 3. TESLA SENSOR PURGE / CAMERA VISION CONES
// =========================================================================================
export const SensorPurge: React.FC<Box & { radarAt?: Cue; sonarAt?: Cue; glareAt?: Cue }> = ({
  w,
  h,
  radarAt,
  sonarAt,
  glareAt,
}) => {
  const frame = useCurrentFrame();
  const rf = useCue(radarAt, 9999);
  const sf = useCue(sonarAt, 9999);
  const gf = useCue(glareAt, 9999);

  const rp = prog(frame, rf, 10);
  const sp = prog(frame, sf, 10);
  const gp = prog(frame, gf, 14);

  const cx = w * 0.44;
  const cy = h * 0.54;
  const carW = 100;
  const carH = 220;

  return (
    <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="camCone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4FB286" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4FB286" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="blindCone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color.red} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color.red} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 8 Optical Camera Cones */}
        {/* Forward Triple Camera (Windshield) */}
        <polygon
          points={`${cx},${cy - 40} ${cx - 140},${cy - 240} ${cx + 140},${cy - 240}`}
          fill={gp > 0 ? 'url(#blindCone)' : 'url(#camCone)'}
          stroke={gp > 0 ? color.red : '#4FB286'}
          strokeWidth={1.5}
        />

        {/* B-Pillar Left Camera */}
        <polygon
          points={`${cx - carW / 2},${cy - 10} ${cx - 260},${cy - 120} ${cx - 260},${cy + 80}`}
          fill="url(#camCone)"
          opacity={0.65}
        />
        {/* B-Pillar Right Camera */}
        <polygon
          points={`${cx + carW / 2},${cy - 10} ${cx + 260},${cy - 120} ${cx + 260},${cy + 80}`}
          fill="url(#camCone)"
          opacity={0.65}
        />

        {/* Fender Left Camera (Facing Rear) */}
        <polygon
          points={`${cx - carW / 2 + 5},${cy - 50} ${cx - 240},${cy + 160} ${cx - 100},${cy + 220}`}
          fill="url(#camCone)"
          opacity={0.55}
        />
        {/* Fender Right Camera (Facing Rear) */}
        <polygon
          points={`${cx + carW / 2 - 5},${cy - 50} ${cx + 240},${cy + 160} ${cx + 100},${cy + 220}`}
          fill="url(#camCone)"
          opacity={0.55}
        />

        {/* Rear Backup Camera */}
        <polygon
          points={`${cx},${cy + carH / 2} ${cx - 120},${cy + carH / 2 + 130} ${cx + 120},${cy + carH / 2 + 130}`}
          fill="url(#camCone)"
          opacity={0.7}
        />

        {/* Car Chassis (Top-down blueprint) */}
        <g transform={`translate(${cx - carW / 2} ${cy - carH / 2})`}>
          {/* Main car body outline */}
          <rect x={0} y={0} width={carW} height={carH} rx={24} fill="#151922" stroke="#FAF6EE" strokeWidth={3} />
          {/* Windshield curve */}
          <path d="M12 60 Q50 48 88 60 L80 95 Q50 90 20 95 Z" fill="#242C38" stroke="#A4B0BE" strokeWidth={1.8} />
          {/* Rear glass */}
          <path d="M16 150 Q50 144 84 150 L80 180 Q50 176 20 180 Z" fill="#242C38" stroke="#A4B0BE" strokeWidth={1.8} />
          {/* Roof line */}
          <rect x={18} y={98} width={64} height={48} rx={4} fill="#1B222C" />
          {/* Wheels */}
          <rect x={-8} y={32} width={10} height={32} rx={3} fill="#444C56" />
          <rect x={carW - 2} y={32} width={10} height={32} rx={3} fill="#444C56" />
          <rect x={-8} y={carH - 64} width={10} height={32} rx={3} fill="#444C56" />
          <rect x={carW - 2} y={carH - 64} width={10} height={32} rx={3} fill="#444C56" />
        </g>

        {/* Radar Unit at Front Bumper (Deleted in 2021) */}
        <g transform={`translate(${cx} ${cy - carH / 2 - 4})`}>
          <rect x={-18} y={-8} width={36} height={12} rx={2} fill={rp > 0 ? 'rgba(230,57,70,0.3)' : '#4FB286'} stroke={rp > 0 ? color.red : '#4FB286'} strokeWidth={2} />
          {rp > 0 && (
            <>
              <line x1={-24} y1={-14} x2={24} y2={10} stroke={color.red} strokeWidth={3.5} />
              <line x1={-24} y1={10} x2={24} y2={-14} stroke={color.red} strokeWidth={3.5} />
            </>
          )}
        </g>

        {/* Ultrasonic Sonar Sensors (12 perimeter dots deleted in 2022) */}
        {[
          [-35, -carH / 2], [0, -carH / 2], [35, -carH / 2],
          [-carW / 2, -40], [carW / 2, -40],
          [-carW / 2, 40], [carW / 2, 40],
          [-35, carH / 2], [0, carH / 2], [35, carH / 2]
        ].map(([sx, sy], i) => (
          <g key={i} transform={`translate(${cx + sx} ${cy + sy})`}>
            <circle cx={0} cy={0} r={4} fill={sp > 0 ? color.red : '#FAF6EE'} />
            {sp > 0 && (
              <line x1={-6} y1={-6} x2={6} y2={6} stroke={color.red} strokeWidth={2} />
            )}
          </g>
        ))}

        {/* Glare / Fog Ray over windshield when gp > 0 */}
        {gp > 0 && (
          <g transform={`translate(${cx} ${cy - 140})`}>
            <line x1={-90} y1={0} x2={90} y2={0} stroke={color.red} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={0} y={-14} fill={color.red} textAnchor="middle" style={{ ...mono(16, color.red), fontWeight: 700 }}>
              CAMERA BLINDED: SUN GLARE / RAIN
            </text>
          </g>
        )}
      </svg>

      {/* Status Panel (Right side) */}
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: 24,
          width: 250,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Radar card */}
        <div
          style={{
            background: 'rgba(20,18,16,0.85)',
            border: `1.5px solid ${rp > 0 ? color.red : 'rgba(233,227,211,0.2)'}`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ ...mono(13, color.mute), textTransform: 'uppercase' }}>FORWARD RADAR</div>
          <div style={{ ...mono(18, rp > 0 ? color.red : color.ink), fontWeight: 700, marginTop: 4 }}>
            {rp > 0 ? 'PURGED (MAY 2021)' : 'ACTIVE DETECTOR'}
          </div>
        </div>

        {/* Ultrasonics card */}
        <div
          style={{
            background: 'rgba(20,18,16,0.85)',
            border: `1.5px solid ${sp > 0 ? color.red : 'rgba(233,227,211,0.2)'}`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ ...mono(13, color.mute), textTransform: 'uppercase' }}>12 ULTRASONIC SENSORS</div>
          <div style={{ ...mono(18, sp > 0 ? color.red : color.ink), fontWeight: 700, marginTop: 4 }}>
            {sp > 0 ? 'DELETED (OCT 2022)' : 'PROXIMITY SONAR'}
          </div>
        </div>

        {/* Pure Vision Only disclaimer */}
        <div
          style={{
            background: gp > 0 ? 'rgba(230,57,70,0.15)' : 'rgba(14,12,11,0.85)',
            border: `1.5px solid ${gp > 0 ? color.red : 'rgba(233,227,211,0.2)'}`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ ...mono(13, color.mute), textTransform: 'uppercase' }}>REDUNDANCY</div>
          <div style={{ ...mono(17, gp > 0 ? color.red : '#FAF6EE'), fontWeight: 700, marginTop: 4 }}>
            ZERO HARDWARE BACKUP
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================================
// 4. BLACK SEA MILITARY GEOFENCE MAP
// =========================================================================================
export const GeofenceMap: React.FC<Box & { cutAt?: Cue; droneAt?: Cue; strikeAt?: Cue }> = ({
  w,
  h,
  cutAt,
  droneAt,
  strikeAt,
}) => {
  const frame = useCurrentFrame();
  const cf = useCue(cutAt, 9999);
  const df = useCue(droneAt, 0);
  const sf = useCue(strikeAt, 9999);

  const cp = prog(frame, cf, 12);
  const dp = prog(frame, df, 60);
  const sp = prog(frame, sf, 14);

  // Sea Drone progression along attack path
  // Starts near Odessa (x: 180, y: 150), moves toward Sevastopol (x: 420, y: 350)
  // Cutoff happens around 100km boundary (x: 340, y: 280)
  const droneProgress = cp > 0 ? Math.min(0.68, dp) : dp;
  const droneX = 180 + droneProgress * (420 - 180);
  const droneY = 150 + droneProgress * (350 - 150);

  return (
    <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', background: '#0D131A' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <defs>
          <pattern id="seaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={w} height={h} fill="url(#seaGrid)" />

        {/* Coastlines (Stylized Black Sea / Crimean Peninsula Vector) */}
        {/* Ukraine mainland coast (Odessa/Kherson/Mykolaiv) */}
        <path
          d="M 60 40 Q 120 100 180 130 Q 260 140 320 110 Q 380 90 460 100 Q 560 80 660 60 L 660 0 L 0 0 L 0 160 Q 30 110 60 40 Z"
          fill="#1C2430"
          stroke="#415065"
          strokeWidth={2}
        />

        {/* Crimean Peninsula */}
        <path
          d="M 330 112 Q 350 140 370 170 Q 430 180 480 210 Q 510 240 500 280 Q 460 330 420 350 Q 370 360 340 310 Q 320 250 330 190 Q 325 150 330 112 Z"
          fill="#242E3D"
          stroke="#55667D"
          strokeWidth={2.5}
        />

        {/* Sevastopol Target Marker */}
        <g transform="translate(420 350)">
          <circle cx={0} cy={0} r={16} fill="none" stroke={color.red} strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={0} cy={0} r={5} fill={color.red} />
          <text x={22} y={6} fill="#FAF6EE" style={{ ...mono(16, '#FAF6EE'), fontWeight: 700 }}>
            SEVASTOPOL
          </text>
          <text x={22} y={24} fill={color.mute} style={{ ...mono(12, color.mute) }}>
            RUSSIAN FLEET BASE
          </text>
        </g>

        {/* Starlink Geofence Boundary Line (Crimea 100km Exclusion Zone) */}
        <path
          d="M 230 420 Q 300 260 450 180 Q 560 150 640 160"
          fill="none"
          stroke={cp > 0 ? color.red : '#4FB286'}
          strokeWidth={3}
          strokeDasharray="8 6"
        />

        {/* Drone Attack Route Trajectory */}
        <path
          d="M 180 150 L 340 280"
          fill="none"
          stroke={color.red}
          strokeWidth={2.5}
          strokeDasharray="4 4"
        />

        {/* Explosive Sea Drone Node */}
        <g transform={`translate(${droneX} ${droneY})`}>
          <polygon points="0,-10 8,8 -8,8" fill={cp > 0 ? color.red : '#FAF6EE'} stroke="#000" strokeWidth={1.5} />
          {/* Signal rings around drone */}
          {cp === 0 && (
            <circle cx={0} cy={0} r={14} fill="none" stroke="#4FB286" strokeWidth={2} strokeDasharray="3 3" />
          )}
          {cp > 0 && (
            <g>
              <line x1={-12} y1={-12} x2={12} y2={12} stroke={color.red} strokeWidth={3} />
              <line x1={-12} y1={12} x2={12} y2={-12} stroke={color.red} strokeWidth={3} />
            </g>
          )}
        </g>
      </svg>

      {/* Geofence Cutoff Alert Banner */}
      {cp > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            background: 'rgba(230,57,70,0.18)',
            border: `2px solid ${color.red}`,
            borderRadius: 8,
            padding: '12px 18px',
            opacity: cp,
            transform: `translateY(${(1 - cp) * 12}px)`,
          }}
        >
          <div style={{ ...mono(20, color.red), fontWeight: 800, letterSpacing: '0.1em' }}>
            SIGNAL CUTOFF: GEOFENCE ACTIVE
          </div>
          <div style={{ ...mono(14, color.ink), marginTop: 4 }}>
            STARLINK COVERAGE MANUALLY DISABLED OVER CRIMEAN WATERS
          </div>
        </div>
      )}

      {/* Coordinates Tag */}
      <div style={{ position: 'absolute', right: 24, top: 24, ...mono(13, color.mute) }}>
        BLACK SEA 44.6°N 33.5°E // ISAACSON BIOGRAPHY CONFIRMED
      </div>
    </div>
  );
};

// =========================================================================================
// 5. BETA WAIVER TELEMETRY / LEGAL LIABILITY CLAUSE
// =========================================================================================
export const BetaWaiver: React.FC<Box & { nagAt?: Cue; waiverAt?: Cue; reactAt?: Cue }> = ({
  w,
  h,
  nagAt,
  waiverAt,
  reactAt,
}) => {
  const frame = useCurrentFrame();
  const nf = useCue(nagAt, 0);
  const wf = useCue(waiverAt, 9999);
  const rf = useCue(reactAt, 9999);

  const np = prog(frame, nf, 16);
  const wp = prog(frame, wf, 10);
  const rp = prog(frame, rf, 14);

  const blink = Math.sin(frame * 0.25) > 0;

  return (
    <div style={{ width: w, height: h, display: 'flex', gap: 20, padding: 24, boxSizing: 'border-box' }}>
      {/* Left Column: Automotive Instrument Cluster Nag */}
      <div
        style={{
          width: w * 0.46,
          background: '#12141C',
          borderRadius: 10,
          border: '1.5px solid rgba(233,227,211,0.2)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ ...mono(14, color.mute), letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          VEHICLE TELEMETRY
        </div>

        {/* Steering Wheel Icon with Hand Indicators */}
        <svg width={160} height={130} viewBox="0 0 160 130">
          {/* Wheel rim */}
          <circle cx={80} cy={65} r={55} fill="none" stroke="#A4B0BE" strokeWidth={10} />
          {/* Center hub */}
          <circle cx={80} cy={65} r={22} fill="#242C38" stroke="#FAF6EE" strokeWidth={3} />
          {/* Spokes */}
          <line x1={25} y1={65} x2={58} y2={65} stroke="#A4B0BE" strokeWidth={8} />
          <line x1={102} y1={65} x2={135} y2={65} stroke="#A4B0BE" strokeWidth={8} />
          <line x1={80} y1={87} x2={80} y2={120} stroke="#A4B0BE" strokeWidth={8} />

          {/* Cabin Eye Icon (monitoring driver) */}
          <circle cx={80} cy={65} r={7} fill={color.red} />
        </svg>

        {/* Nag Warning Banner */}
        <div
          style={{
            width: '100%',
            background: blink ? 'rgba(230,57,70,0.25)' : 'rgba(26,115,232,0.2)',
            border: `1.5px solid ${blink ? color.red : '#1A73E8'}`,
            borderRadius: 6,
            padding: '8px 10px',
            textAlign: 'center',
            opacity: np,
          }}
        >
          <div style={{ ...mono(13, blink ? color.red : '#FAF6EE'), fontWeight: 700 }}>
            APPLY SLIGHT TURNING FORCE
          </div>
          <div style={{ ...mono(11, color.mute), marginTop: 2 }}>
            TAKEOVER REQUIRED: 0.8s WINDOW
          </div>
        </div>
      </div>

      {/* Right Column: Legal Beta Agreement Document */}
      <div
        style={{
          flex: 1,
          background: '#1A1815',
          borderRadius: 10,
          border: '1.5px solid rgba(233,227,211,0.25)',
          padding: 20,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ ...mono(14, color.mute), textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            LEGAL DISCLAIMER · FSD BETA
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 18, color: '#FAF6EE', marginTop: 10, lineHeight: 1.4 }}>
            "You must keep your hands on the steering wheel at all times. The driver assumes full legal liability for all
            interventions."
          </div>

          <div style={{ ...mono(13, color.mute), marginTop: 14 }}>
            SECTION 4.2 · LIABILITY CONVERSION
          </div>
        </div>

        {/* Big Red Liability Rubber Stamp */}
        {wp > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 20,
              bottom: 24,
              border: `5px solid ${color.red}`,
              borderRadius: 8,
              padding: '8px 16px',
              transform: `rotate(-8deg) scale(${1.4 - 0.4 * wp})`,
              opacity: wp,
              background: 'rgba(14,12,11,0.92)',
            }}
          >
            <span style={{ ...mono(22, color.red), fontWeight: 800, letterSpacing: '0.12em' }}>
              100% DRIVER LIABILITY
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================================
// 6. DRAGON DEPENDENCY / NASA MONOPOLY
// =========================================================================================
export const DragonDependency: React.FC<Box & { crewAt?: Cue; zeroAt?: Cue }> = ({
  w,
  h,
  crewAt,
  zeroAt,
}) => {
  const frame = useCurrentFrame();
  const cf = useCue(crewAt, 0);
  const zf = useCue(zeroAt, 9999);

  const cp = prog(frame, cf, 14);
  const zp = prog(frame, zf, 10);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ ...mono(18, color.mute), letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
        US CREW ACCESS TO ORBIT
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {/* Crew Dragon Capsule Outline */}
        <div style={{ width: 140, height: 160, background: '#161B22', border: `2px solid ${color.red}`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
          <svg width={80} height={80} viewBox="0 0 100 100">
            <path d="M50 15 Q30 40 25 80 L75 80 Q70 40 50 15 Z" fill="#242C38" stroke="#FAF6EE" strokeWidth={3} />
            <circle cx={50} cy={50} r={10} fill="#FAF6EE" />
          </svg>
          <span style={{ ...mono(13, color.red), fontWeight: 700, marginTop: 8 }}>CREW DRAGON</span>
          <span style={{ ...mono(11, color.mute) }}>OPERATIONAL</span>
        </div>

        {/* Grounded Rival / Starliner */}
        <div style={{ width: 140, height: 160, background: '#121418', border: '1.5px dashed #444C56', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8, opacity: 0.5 }}>
          <svg width={80} height={80} viewBox="0 0 100 100">
            <path d="M50 20 Q35 45 30 80 L70 80 Q65 45 50 20 Z" fill="#1B2028" stroke="#777" strokeWidth={2} />
            <line x1={20} y1={20} x2={80} y2={80} stroke={color.red} strokeWidth={3} />
          </svg>
          <span style={{ ...mono(13, color.mute), marginTop: 8 }}>STARLINER</span>
          <span style={{ ...mono(11, color.red) }}>GROUNDED</span>
        </div>

        {/* Stat Pill */}
        <div style={{ flex: 1, paddingLeft: 12 }}>
          <div style={{ ...mono(16, color.mute) }}>DOMESTIC ALTERNATIVES:</div>
          <div style={{ ...mono(56, zp > 0 ? color.red : color.ink), fontWeight: 800, marginTop: 4 }}>
            0
          </div>
          <div style={{ ...mono(14, zp > 0 ? color.red : color.mute) }}>
            NASA IS 100% DEPENDENT
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================================
// 7. POWER CLUSTER / EMPIRE NETWORK
// =========================================================================================
export const PowerCluster: React.FC<Box & { hubAt?: Cue }> = ({ w, h, hubAt }) => {
  const frame = useCurrentFrame();
  const hf = useCue(hubAt, 0);
  const hp = prog(frame, hf, 20);

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.36;

  const nodes = [
    { name: 'STARLINK', sub: 'GLOBAL COMMS', angle: -Math.PI / 2 },
    { name: 'SPACEX', sub: 'ORBITAL LIFT', angle: -Math.PI / 6 },
    { name: 'TESLA', sub: 'FLEET TELEMETRY', angle: Math.PI / 6 },
    { name: 'xAI', sub: 'FRONTIER COMPUTE', angle: (5 * Math.PI) / 6 },
    { name: 'X / TWITTER', sub: 'PUBLIC SQUARE', angle: (-5 * Math.PI) / 6 },
  ];

  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* Connecting spokes */}
        {nodes.map((n, i) => {
          const nx = cx + r * Math.cos(n.angle);
          const ny = cy + r * Math.sin(n.angle);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color.red} strokeWidth={2.5} opacity={hp * 0.6} strokeDasharray="4 4" />
            </g>
          );
        })}

        {/* Central Executive Node */}
        <circle cx={cx} cy={cy} r={46} fill="#1E1A16" stroke={color.red} strokeWidth={3} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#FAF6EE" style={{ ...mono(13, '#FAF6EE'), fontWeight: 700 }}>
          ONE KEY
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={color.red} style={{ ...mono(11, color.red), fontWeight: 700 }}>
          NO BOARD
        </text>

        {/* Outer Enterprise Nodes */}
        {nodes.map((n, i) => {
          const nx = cx + r * Math.cos(n.angle);
          const ny = cy + r * Math.sin(n.angle);
          return (
            <g key={`node-${i}`} transform={`translate(${nx} ${ny})`}>
              <rect x={-64} y={-22} width={128} height={44} rx={6} fill="#141822" stroke="rgba(233,227,211,0.3)" strokeWidth={1.8} />
              <text x={0} y={-4} textAnchor="middle" fill="#FAF6EE" style={{ ...mono(13, '#FAF6EE'), fontWeight: 700 }}>
                {n.name}
              </text>
              <text x={0} y={12} textAnchor="middle" fill={color.mute} style={{ ...mono(10, color.mute) }}>
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
