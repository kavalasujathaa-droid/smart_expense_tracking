import React from 'react';
import FramerTiltCard from '../framer/FramerTiltCard';

/**
 * Universal GlassCard Component
 * Powered by Framer Sleek 3D Tilt Card physics and subtle spotlight glare.
 */
export default function GlassCard({
  children,
  className = '',
  glow = false,
  style = {},
  tilt = false,
  maxTilt = 4,
  ...props
}) {
  if (tilt) {
    return (
      <FramerTiltCard
        className={`glass-card ${glow ? 'glass-card-glow' : ''} ${className}`.trim()}
        maxTilt={maxTilt}
        style={style}
        {...props}
      >
        {children}
      </FramerTiltCard>
    );
  }

  return (
    <div
      className={`glass-card ${glow ? 'glass-card-glow' : ''} ${className}`.trim()}
      style={{
        position: 'relative',
        background: 'var(--bg-glass-card, rgba(255, 255, 255, 0.045))',
        border: '1px solid var(--border-glass, rgba(255, 255, 255, 0.12))',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-glass-panel)',
        backdropFilter: 'var(--blur-glass-md, blur(18px) saturate(140%))',
        WebkitBackdropFilter: 'var(--blur-glass-md, blur(18px) saturate(140%))',
        transition: 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), border-color 0.25s ease, box-shadow 0.25s ease',
        ...style,
      }}
      {...props}
    >
      <div className="glass-shimmer" aria-hidden="true" />
      {children}
    </div>
  );
}
