import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import FramerButton from '../framer/FramerButton';
import FramerTextReveal from '../framer/FramerTextReveal';

/**
 * Minimal, Glacia-Inspired Hero Section
 * Strictly aligned with user design reference:
 * - Simple hero centered vertically and horizontally
 * - Verified trust badge: "100% Private Workspace • Row-Level Security"
 * - Large heading: "Smart Expense Tracking" (Fluid clamp 46-76px)
 * - Exact description: "Track your expenses, manage monthly budgets, and understand your spending in one private workspace."
 * - Primary CTA: "Start Tracking"
 * - Secondary CTA: "Explore Dashboard"
 * - Generous whitespace, zero mock data, zero dashboard preview
 */
export default function Hero({ onStartTracking, onExploreDashboard }) {
  return (
    <section
      className="hero-section"
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 96px) 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Liquid Glass Ambient Background Glow (Emerald Green + Electric Blue) */}
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(920px, 92vw)',
          height: '440px',
          background: 'radial-gradient(ellipse at center, rgba(25, 230, 140, 0.15) 0%, rgba(53, 167, 255, 0.08) 35%, rgba(255, 82, 104, 0.03) 60%, transparent 75%)',
          filter: 'blur(75px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div
        className="container"
        style={{
          maxWidth: '920px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Verified Security & Trust Badge with Specular Reflection */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '24px' }}
        >
          <div
            className="glass-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 20px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.045)',
              border: '1px solid var(--border-glass-light)',
              boxShadow: 'var(--shadow-glass-sm)',
              backdropFilter: 'var(--blur-glass-sm)',
              WebkitBackdropFilter: 'var(--blur-glass-sm)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#f7fafc',
              letterSpacing: '0.015em',
            }}
          >
            <ShieldCheck size={15} color="var(--accent-green)" />
            <span>100% Private Workspace • Row-Level Security</span>
          </div>
        </motion.div>

        {/* Large confident heading: "Smart Expense Tracking" */}
        <div style={{ maxWidth: '880px', marginBottom: '20px' }}>
          <FramerTextReveal
            as="h1"
            dimOpacity={0.25}
            style={{
              fontSize: 'clamp(44px, 7vw, 76px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: '#ffffff',
              justifyContent: 'center',
              textShadow: '0 2px 24px rgba(0, 0, 0, 0.7)',
            }}
          >
            Smart Expense Tracking
          </FramerTextReveal>
        </div>

        {/* Exact required supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(17px, 2.2vw, 19.5px)',
            color: '#94a3b8',
            maxWidth: '640px',
            lineHeight: 1.62,
            marginBottom: '40px',
            fontWeight: 400,
          }}
        >
          Track your expenses, manage monthly budgets, and understand your spending in one private workspace.
        </motion.p>

        {/* Primary CTA: "Start Tracking" & Secondary CTA: "Explore Dashboard" */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <FramerButton
            variant="primary"
            size="lg"
            onClick={onStartTracking}
            icon="arrow-up-right"
          >
            Start Tracking
          </FramerButton>

          <FramerButton
            variant="secondary"
            size="lg"
            onClick={onExploreDashboard}
            icon="none"
          >
            Explore Dashboard
          </FramerButton>
        </motion.div>
      </div>
    </section>
  );
}
