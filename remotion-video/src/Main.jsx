import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  AbsoluteFill,
} from 'remotion';
import React from 'react';

// ─── SCENE TIMING (all in frames at 30fps) ─────────────────────────
// Scene 1: Zooming Map           0  → 90
// Scene 2: Pins appear           60 → 130
// Scene 3: 100,000+ counter      130 → 190
// Scene 4: Business heading      190 → 260
// Scene 5: Outro                 260 → 300
// -------------------------------------------------------------------

export const Main = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // helper – clamp interpolation
  const ci = (f, r, o, opts = {}) =>
    interpolate(f, r, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', ...opts });

  // ── MAP ────────────────────────────────────────────────────────────
  // Stays visible for the entire map+pins section (0-130), then fades
  const mapOpacity = ci(frame, [0, 20, 120, 135], [0, 1, 1, 0]);
  const mapScale   = ci(frame, [0, 130], [1.0, 1.5]);

  // ── PINS (each pin has its own delay) ──────────────────────────────
  const pinData = [
    { x: 760,  y: 380 },
    { x: 1060, y: 460 },
    { x: 910,  y: 600 },
    { x: 680,  y: 560 },
    { x: 1150, y: 330 },
    { x: 840,  y: 700 },
  ];

  // ── FOLLOWER COUNTER ───────────────────────────────────────────────
  const counterOpacity = ci(frame, [135, 148, 182, 195], [0, 1, 1, 0]);

  // ── BUSINESSES ─────────────────────────────────────────────────────
  const biz = ['Jeeja Fashion', 'Udan', 'Savari', 'S.Tech Group', 'RK Enterprises'];
  const bHeadOpacity = ci(frame, [198, 210], [0, 1]);
  const bgOverlayOpacity = ci(frame, [135, 145], [0, 1]);

  // ── OUTRO ──────────────────────────────────────────────────────────
  const outroOpacity = ci(frame, [263, 272], [0, 1]);
  const outroScale = spring({ frame: frame - 260, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Scene 1+2: MAP + PINS ─────────────────────────────────── */}
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        {/* Map image, zooming in slowly */}
        <div style={{
          width: '100%', height: '100%',
          transform: `scale(${mapScale})`,
          transformOrigin: 'center center',
        }}>
          <img
            src={staticFile('map.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Dark gradient overlay so pins pop */}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)' }} />

        {/* Pins */}
        {pinData.map((pin, i) => {
          const pinStart = 55 + i * 10;
          const pinOpacity = ci(frame, [pinStart, pinStart + 8, 120, 130], [0, 1, 1, 0]);
          const pinY = ci(frame, [pinStart, pinStart + 12], [-30, 0]);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: pin.x,
              top: pin.y,
              opacity: pinOpacity,
              transform: `translateY(${pinY}px)`,
              lineHeight: 1,
            }}>
              {/* SVG pin – no external dependency */}
              <svg width="50" height="70" viewBox="0 0 50 70">
                <circle cx="25" cy="25" r="22" fill="#22c55e" stroke="white" strokeWidth="3" />
                <polygon points="25,65 14,38 36,38" fill="#22c55e" />
                <circle cx="25" cy="25" r="9" fill="white" />
              </svg>
              {/* Glow */}
              <div style={{
                position: 'absolute', bottom: -6, left: '50%',
                transform: 'translateX(-50%)',
                width: 40, height: 12,
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.35)',
                filter: 'blur(6px)',
              }} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ── Shared dark overlay for text scenes ───────────────────── */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(0,0,0,0.78)',
          opacity: bgOverlayOpacity,
        }}
      />

      {/* ── Scene 3: 100,000+ Followers ───────────────────────────── */}
      <AbsoluteFill style={{
        opacity: counterOpacity,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p style={{
          fontSize: 42, color: '#86efac', margin: 0, marginBottom: 8,
          fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase',
        }}>
          Chittorgarh Reach
        </p>
        <h1 style={{
          fontSize: 200, color: '#4ADE80', fontWeight: 900, margin: 0, lineHeight: 1,
          textShadow: '0 0 80px rgba(74,222,128,0.5)',
        }}>
          1L+
        </h1>
        <p style={{
          fontSize: 52, color: 'white', fontWeight: 600, margin: 0, marginTop: 12,
          letterSpacing: 2,
        }}>
          Engaged Followers
        </p>
      </AbsoluteFill>

      {/* ── Scene 4: Businesses We Promote ────────────────────────── */}
      {frame >= 195 && frame < 263 && (
        <AbsoluteFill style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0,
        }}>
          {/* Heading */}
          <h2 style={{
            fontSize: 80, color: 'white', fontWeight: 800,
            opacity: bHeadOpacity,
            borderBottom: '5px solid #4ADE80',
            paddingBottom: 12,
            marginBottom: 48,
            letterSpacing: 1,
          }}>
            Businesses We Promote
          </h2>

          {/* Business names stagger in */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            {biz.map((name, i) => {
              const start = 210 + i * 9;
              const bOp  = ci(frame, [start, start + 8], [0, 1]);
              const bTx  = ci(frame, [start, start + 8], [25, 0]);
              return (
                <div key={i} style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: '#4ADE80',
                  opacity: bOp,
                  transform: `translateX(${bTx}px)`,
                  background: 'rgba(255,255,255,0.07)',
                  padding: '10px 50px',
                  borderRadius: 60,
                  minWidth: 500,
                  textAlign: 'center',
                }}>
                  {name}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: Outro ────────────────────────────────────────── */}
      {frame >= 260 && (
        <AbsoluteFill style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: outroOpacity,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.2) 0%, transparent 75%)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #4ADE80)',
            padding: '50px 100px',
            borderRadius: 120,
            textAlign: 'center',
            transform: `scale(${outroScale})`,
            boxShadow: '0 30px 80px rgba(34,197,94,0.5)',
          }}>
            <h1 style={{
              fontSize: 80, color: 'white', fontWeight: 900, margin: 0,
              letterSpacing: 1,
            }}>
              join the chittor family 🙏
            </h1>
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
