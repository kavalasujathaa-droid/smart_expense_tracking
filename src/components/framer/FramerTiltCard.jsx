import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Sleek 3D Tilt Card
 * Adapted from https://framer.com/m/Sleek3dTiltCardver2-n7N4g0.js@AmE5YdQi3YUfNcPGEDHY
 * 
 * Features:
 * - Precise physics-based 3D tilt tracking cursor position
 * - Dynamic spotlight radial gradient on hover
 * - Spring damping (damping: 25, stiffness: 180, mass: 0.8)
 * - Safe fallback: disabled on touch devices and prefers-reduced-motion
 */
export default function FramerTiltCard({
  children,
  maxTilt = 4, // Restrained 4-degree tilt to eliminate jitter
  glare = true,
  className = '',
  style = {},
  onClick,
  borderColor = 'rgba(255, 255, 255, 0.12)',
  backgroundColor = 'rgba(10, 16, 22, 0.78)',
  ...rest
}) {
  const cardRef = useRef(null);
  const rafId = useRef(null);
  const rectRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth, damped spring physics to prevent jerky motions
  const springConfig = { damping: 30, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
      setIsTouchDevice(isTouch);
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mql.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      mql.addEventListener('change', listener);
      return () => {
        mql.removeEventListener('change', listener);
        if (rafId.current) cancelAnimationFrame(rafId.current);
      };
    }
  }, []);

  const disableTilt = isTouchDevice || prefersReducedMotion;

  const handleMouseMove = (e) => {
    if (disableTilt || !cardRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) return; // Throttled to display refresh rate via requestAnimationFrame

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!cardRef.current) return;
      if (!rectRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
      const rect = rectRef.current;
      const width = rect.width || 1;
      const height = rect.height || 1;

      // Bound normalized coordinate within -0.5 to 0.5
      const normX = Math.max(-0.5, Math.min(0.5, (clientX - rect.left) / width - 0.5));
      const normY = Math.max(-0.5, Math.min(0.5, (clientY - rect.top) / height - 0.5));

      x.set(normX);
      y.set(normY);
    });
  };

  const handleMouseEnter = () => {
    if (disableTilt || !cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    rectRef.current = null;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          position: 'relative',
          background: backgroundColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '24px',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          rotateX: disableTilt ? 0 : rotateX,
          rotateY: disableTilt ? 0 : rotateY,
          boxShadow: isHovered
            ? '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 12px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          ...style,
        }}
        className={`framer-tilt-card ${className}`}
        {...rest}
      >
        {/* Dynamic Spotlight Glare */}
        {glare && !disableTilt && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 3,
              borderRadius: 'inherit',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: 'radial-gradient(circle 320px at 50% 25%, rgba(25, 230, 140, 0.12), rgba(53, 167, 255, 0.05) 40%, transparent 70%)',
            }}
          />
        )}

        {/* Content with 3D depth */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            transform: disableTilt ? 'none' : 'translateZ(6px)',
            transformStyle: 'preserve-3d',
            height: '100%',
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
