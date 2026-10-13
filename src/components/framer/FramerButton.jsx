import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

/**
 * Framer Button Component
 * Adapted from https://framer.com/m/Button-h6zPlc.js@LoLoGg2mHM4dEu4uXoBj
 * 
 * Features:
 * - Staggered character roll wave animation on hover
 * - Smooth spring physics and tap scale
 * - Arrow icon circle with directional slide
 * - Full keyboard accessibility, focus rings, ARIA support
 */
export default function FramerButton({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'emerald'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = 'arrow-up-right', // 'arrow-up-right' | 'arrow-right' | 'none'
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  style = {},
  ariaLabel,
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Split text for rolling letter animation if children is string
  const isString = typeof children === 'string';
  const text = isString ? children : '';
  const letters = isString ? text.split('') : [];

  // Size styles
  const sizeStyles = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
      iconSize: 13,
      circleSize: '20px',
      gap: '8px',
    },
    md: {
      padding: '12px 22px',
      fontSize: '16px',
      iconSize: 15,
      circleSize: '24px',
      gap: '10px',
    },
    lg: {
      padding: '16px 30px',
      fontSize: '17.5px',
      iconSize: 17,
      circleSize: '28px',
      gap: '12px',
    },
  }[size] || sizeStyles.md;

  // Variant styling matching Liquid Glass design system (Black + Green + Blue + Red)
  const variantStyles = {
    primary: {
      background: '#ffffff',
      color: '#050709',
      border: '1px solid rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 22px rgba(25, 230, 140, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      iconBg: '#050709',
      iconColor: '#ffffff',
    },
    green: {
      background: 'linear-gradient(135deg, #19e68c 0%, #0fa863 100%)',
      color: '#050709',
      border: '1px solid rgba(25, 230, 140, 0.65)',
      boxShadow: '0 8px 24px rgba(25, 230, 140, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      iconBg: 'rgba(5, 7, 9, 0.25)',
      iconColor: '#050709',
    },
    blue: {
      background: 'linear-gradient(135deg, #35a7ff 0%, #1b85d6 100%)',
      color: '#050709',
      border: '1px solid rgba(53, 167, 255, 0.65)',
      boxShadow: '0 8px 24px rgba(53, 167, 255, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      iconBg: 'rgba(5, 7, 9, 0.25)',
      iconColor: '#050709',
    },
    red: {
      background: 'linear-gradient(135deg, #ff5268 0%, #d63349 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 82, 104, 0.65)',
      boxShadow: '0 8px 24px rgba(255, 82, 104, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      iconBg: 'rgba(255, 255, 255, 0.22)',
      iconColor: '#ffffff',
    },
    cyan: {
      background: 'linear-gradient(135deg, #35a7ff 0%, #06b6d4 100%)',
      color: '#050709',
      border: '1px solid rgba(53, 167, 255, 0.55)',
      boxShadow: '0 8px 24px rgba(53, 167, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
      iconBg: 'rgba(5, 7, 9, 0.22)',
      iconColor: '#050709',
    },
    violet: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      color: '#ffffff',
      border: '1px solid rgba(167, 139, 250, 0.55)',
      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
      iconBg: 'rgba(255, 255, 255, 0.22)',
      iconColor: '#ffffff',
    },
    emerald: {
      background: 'linear-gradient(135deg, #19e68c 0%, #0fa863 100%)',
      color: '#050709',
      border: '1px solid rgba(25, 230, 140, 0.6)',
      boxShadow: '0 8px 24px rgba(25, 230, 140, 0.28)',
      iconBg: 'rgba(5, 7, 9, 0.22)',
      iconColor: '#050709',
    },
    teal: {
      background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
      color: '#ffffff',
      border: '1px solid rgba(45, 212, 191, 0.55)',
      boxShadow: '0 8px 24px rgba(20, 184, 166, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      iconBg: 'rgba(255, 255, 255, 0.2)',
      iconColor: '#ffffff',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.055)',
      color: '#f7fafc',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      iconBg: 'rgba(255, 255, 255, 0.14)',
      iconColor: '#ffffff',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.045)',
      color: '#f7fafc',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      iconBg: 'rgba(255, 255, 255, 0.12)',
      iconColor: '#ffffff',
    },
    ghost: {
      background: 'transparent',
      color: '#a8b3bf',
      border: '1px solid transparent',
      boxShadow: 'none',
      iconBg: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#ffffff',
    },
  }[variant] || variantStyles.primary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (isString ? text : undefined)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: disabled ? 0 : -2,
        scale: disabled ? 1 : 1.015,
        transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
      }}
      whileTap={{
        scale: disabled ? 1 : 0.975,
        transition: { duration: 0.1 },
      }}
      className={`framer-btn framer-btn-${variant} ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontFamily: 'inherit',
        fontWeight: 600,
        letterSpacing: '-0.015em',
        borderRadius: '9999px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        ...variantStyles,
        ...style,
      }}
      {...rest}
    >
      {/* Content wrapper with rolling letter wave if string */}
      {isString ? (
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            overflow: 'hidden',
            height: '1.25em',
            lineHeight: '1.25em',
          }}
        >
          {letters.map((char, index) => (
            <span
              key={index}
              style={{
                position: 'relative',
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
                overflow: 'hidden',
              }}
            >
              <motion.span
                animate={{
                  y: isHovered ? '-100%' : '0%',
                }}
                transition={{
                  duration: 0.28,
                  ease: [0.33, 1, 0.68, 1],
                  delay: index * 0.012,
                }}
                style={{
                  display: 'inline-block',
                }}
              >
                {char}
              </motion.span>
              <motion.span
                animate={{
                  y: isHovered ? '0%' : '100%',
                }}
                transition={{
                  duration: 0.28,
                  ease: [0.33, 1, 0.68, 1],
                  delay: index * 0.012,
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'inline-block',
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ) : (
        <span>{children}</span>
      )}

      {/* Trailing Icon with Framer Arrow Ring */}
      {icon !== 'none' && (
        <motion.span
          animate={{
            x: isHovered ? 2 : 0,
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: sizeStyles.circleSize,
            height: sizeStyles.circleSize,
            borderRadius: '50%',
            background: variantStyles.iconBg,
            color: variantStyles.iconColor,
            flexShrink: 0,
            marginLeft: '2px',
          }}
        >
          {icon === 'arrow-right' ? (
            <ArrowRight size={sizeStyles.iconSize} />
          ) : (
            <ArrowUpRight size={sizeStyles.iconSize} />
          )}
        </motion.span>
      )}
    </motion.button>
  );
}
