import React, { useState, startTransition } from 'react';
import { motion } from 'framer-motion';

/**
 * AppleGlassStack
 * Adapted from official Framer component:
 * https://framer.com/m/AppleGlassStack-1H0xTm.js@iHl3lDAeehdt4X1PnBEQ
 * 
 * Authentic Apple liquid glass box stack featuring:
 * - 3D perspective wrapper (perspective: 1000px)
 * - Interactive pointer tracking with subtle hover lift and scale
 * - Dynamic shine pass-through sweep on hover
 * - Multi-layered frosted glass with backdrop blur and specular stroke
 * - Black + Green + Blue + Red theme styling
 */

export function AppleGlassBox({
  children,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'var(--accent-green)',
  accentGlow = 'var(--accent-green-glow)',
  backgroundColor = 'rgba(10, 16, 22, 0.72)',
  glassOpacity = 0.85,
  borderRadius = 22,
  padding = 24,
  hoverLift = 6,
  backgroundBlur = 24,
  strokeSize = 1,
  strokeColor = 'rgba(255, 255, 255, 0.14)',
  shineColor = 'rgba(255, 255, 255, 0.35)',
  boxWidth = '100%',
  minHeight = 160,
  onClick,
  style = {},
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Only track fine pointer movements on pointer-capable devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    startTransition(() => setMousePosition({ x, y }));
  };

  const handleMouseLeave = () => {
    startTransition(() => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    });
  };

  return (
    <div
      style={{
        perspective: '1000px',
        width: boxWidth === '100%' ? '100%' : `${boxWidth}px`,
        maxWidth: '100%',
      }}
      className={className}
    >
      <motion.div
        onClick={onClick}
        onMouseEnter={() => startTransition(() => setIsHovered(true))}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        animate={{
          y: isHovered ? -hoverLift : 0,
          x: isHovered ? mousePosition.x * 8 : 0,
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
          backdropFilter: `blur(${backgroundBlur}px) saturate(160%)`,
          WebkitBackdropFilter: `blur(${backgroundBlur}px) saturate(160%)`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `0 18px 48px rgba(0, 0, 0, 0.65), 0 0 24px ${accentGlow}`
            : '0 8px 32px rgba(0, 0, 0, 0.45)',
          transition: 'box-shadow 0.3s ease',
          ...style,
        }}
      >
        {/* Layer 1: Translucent Liquid Glass Dark Foundation */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: backgroundColor,
            opacity: glassOpacity,
            borderRadius: `${borderRadius}px`,
            zIndex: 1,
          }}
        />

        {/* Layer 2: Subtle Tinted Radial Reflection (Green/Blue) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isHovered
              ? `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, ${accentGlow} 0%, transparent 60%)`
              : 'none',
            opacity: isHovered ? 0.7 : 0,
            transition: 'opacity 0.25s ease',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 3: Animated Apple Liquid Shine Sweep (Left to Right traversal) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.05) 35%, ${shineColor} 50%, rgba(255, 255, 255, 0.05) 65%, transparent 100%)`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
          initial={{ x: '-120%' }}
          animate={{ x: isHovered ? '120%' : '-120%' }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Layer 4: Specular Stroke Border and Top Rim Highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `${strokeSize}px solid ${strokeColor}`,
            boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5)',
            borderRadius: `${borderRadius}px`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 5: Card Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            padding: `${padding}px`,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {(badge || Icon) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              {Icon && (
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: badgeColor || 'var(--accent-green)',
                  }}
                >
                  <Icon size={19} />
                </div>
              )}
              {badge && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: badgeColor || 'var(--accent-green)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${badgeColor ? `${badgeColor}33` : 'rgba(25, 230, 140, 0.25)'}`,
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: badgeColor || 'var(--accent-green)',
                      boxShadow: `0 0 6px ${badgeColor || 'var(--accent-green)'}`,
                    }}
                  />
                  {badge}
                </span>
              )}
            </div>
          )}

          {title && (
            <h3
              style={{
                margin: 0,
                color: 'var(--text-primary)',
                fontSize: '19px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {title}
            </h3>
          )}

          {subtitle && (
            <p
              style={{
                margin: '6px 0 0 0',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function AppleGlassStack({
  items = [],
  direction = 'horizontal',
  gap = 16,
  containerPadding = 0,
  style = {},
  className = '',
  renderItem,
}) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap',
        gap: `${gap}px`,
        width: '100%',
        padding: `${containerPadding}px`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {items.map((item, index) =>
        renderItem ? (
          renderItem(item, index)
        ) : (
          <AppleGlassBox
            key={item.id || index}
            title={item.title}
            subtitle={item.subtitle || item.body}
            icon={item.icon}
            badge={item.badge}
            badgeColor={item.badgeColor}
            accentGlow={item.accentGlow}
          >
            {item.content}
          </AppleGlassBox>
        )
      )}
    </div>
  );
}
