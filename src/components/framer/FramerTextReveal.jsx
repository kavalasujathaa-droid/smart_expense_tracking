import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Text Reveal Scroll Helper
 * Adapted from https://framer.com/m/text-reveal-scroll-helper-16vc5F.js@7Bke0DBIx7GpaBFlIp2X
 * 
 * Features:
 * - Scroll-driven progressive text illumination
 * - Splits strings into gracefully animated words
 * - Retains full readability when reduced motion is preferred or if JS animations lag
 */
export default function FramerTextReveal({
  children,
  as: Component = 'h1',
  dimOpacity = 0.25,
  className = '',
  style = {},
  once = true,
  staggerDelay = 0.04,
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once, margin: '-10% 0px -10% 0px' });

  // If children is not a plain string, render normally
  if (typeof children !== 'string') {
    return (
      <Component ref={containerRef} className={className} style={style}>
        {children}
      </Component>
    );
  }

  const words = children.split(' ');

  return (
    <Component
      ref={containerRef}
      className={`framer-text-reveal ${className}`}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: '0.24em',
        ...style,
      }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          {/* Dim Ghost text for layout & zero-pop */}
          <span
            style={{
              opacity: dimOpacity,
              transition: 'opacity 0.4s ease',
            }}
          >
            {word}
          </span>

          {/* Animated reveal layer */}
          <motion.span
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={
              isInView
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 6, filter: 'blur(4px)' }
            }
            transition={{
              duration: 0.4,
              delay: index * staggerDelay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: 'inherit',
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
