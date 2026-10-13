import React from 'react';

/**
 * Advanced Liquid Glass Ambient Background
 * Apple Liquid Glass Inspired Atmosphere:
 * - Pure Near-Black / Midnight Canvas (#050709)
 * - Neon Mint / Emerald Green Orb (Top Center: Positive / Primary Accent)
 * - Electric Blue / Cyan Orb (Right Middle: Secondary Accent)
 * - Controlled Crimson Red Orb (Bottom Left: Subtle Depth Accent)
 * - GPU-accelerated keyframe float animations
 * - Zero pointer-events interference, respects prefers-reduced-motion
 */
export default function GlaciaAmbientBackground() {
  return (
    <div
      className="liquid-ambient-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Orb 1: Emerald Green / Neon Mint Liquid Glow (Top Center) */}
      <div
        className="liquid-orb-green"
        style={{
          position: 'absolute',
          top: '-16%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(980px, 95vw)',
          height: '520px',
          background: 'radial-gradient(ellipse at center, rgba(25, 230, 140, 0.12) 0%, rgba(20, 184, 166, 0.06) 40%, rgba(53, 167, 255, 0.02) 65%, transparent 75%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />

      {/* Orb 2: Electric Blue / Cyan Liquid Glow (Right Middle) */}
      <div
        className="liquid-orb-blue"
        style={{
          position: 'absolute',
          top: '28%',
          right: '-8%',
          width: 'min(720px, 75vw)',
          height: '620px',
          background: 'radial-gradient(circle at center, rgba(53, 167, 255, 0.11) 0%, rgba(25, 230, 140, 0.04) 45%, transparent 70%)',
          filter: 'blur(85px)',
          borderRadius: '50%',
        }}
      />

      {/* Orb 3: Controlled Crimson Red Ambient Depth Glow (Bottom Left) */}
      <div
        className="liquid-orb-red"
        style={{
          position: 'absolute',
          bottom: '-12%',
          left: '-8%',
          width: 'min(720px, 80vw)',
          height: '540px',
          background: 'radial-gradient(circle at center, rgba(255, 82, 104, 0.055) 0%, rgba(53, 167, 255, 0.025) 45%, transparent 70%)',
          filter: 'blur(85px)',
          borderRadius: '50%',
        }}
      />

      {/* Liquid glass vignette for tactile optical depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(5, 7, 9, 0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
