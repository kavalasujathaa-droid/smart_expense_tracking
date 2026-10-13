import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import FramerButton from './FramerButton';

/**
 * GlassBudgetCard
 * Adapted from official Framer GlassPricing component techniques:
 * https://framer.com/m/GlassPricing-Julm83.js@3b1Nnv1FPMpWccIULJT7
 * 
 * Reused Techniques:
 * - Top-anchored radial highlight: radial-gradient(50% 135% at 50% -8.7%, ...)
 * - Luminous border highlight & pseudo-border refraction
 * - Top-right badge pill ("BUDGET ACTIVE" / "CAP EXCEEDED")
 * - Translucent divider line
 * - Feature checklists indicating budget safety & guardrails
 * - Real financial data only (no fake pricing tiers)
 */
export default function GlassBudgetCard({
  budget = 0,
  totalSpent = 0,
  onOpenBudgetModal,
  selectedMonthLabel = 'Current Month',
}) {
  const hasBudget = budget > 0;
  const percentage = hasBudget ? Math.round((totalSpent / budget) * 100) : 0;
  const isExceeded = hasBudget && totalSpent > budget;
  const isCritical = hasBudget && (percentage >= 90 || isExceeded);
  const isCaution = hasBudget && percentage >= 75 && percentage < 90;
  const remaining = hasBudget ? Math.max(0, budget - totalSpent) : 0;
  const overspent = isExceeded ? totalSpent - budget : 0;

  // Determine accent color from Black + Green + Blue + Red theme
  const accentColor = isCritical
    ? 'var(--accent-red)'
    : isCaution
    ? 'var(--accent-amber)'
    : 'var(--accent-green)';

  const accentGlow = isCritical
    ? 'var(--accent-red-glow)'
    : isCaution
    ? 'var(--accent-amber-glow)'
    : 'var(--accent-green-glow)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        backdropFilter: 'blur(24px) saturate(170%)',
        WebkitBackdropFilter: 'blur(24px) saturate(170%)',
        background: `radial-gradient(50% 135% at 50% -8.7%, ${accentGlow} 0%, rgba(10, 16, 22, 0.75) 100%)`,
        border: `1.5px solid ${isCritical ? 'rgba(255, 82, 104, 0.45)' : 'rgba(255, 255, 255, 0.14)'}`,
        boxShadow: `
          0 16px 48px -12px rgba(0, 0, 0, 0.75),
          inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.35),
          inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5)
        `,
        padding: '24px',
        boxSizing: 'border-box',
        marginBottom: '24px',
      }}
    >
      {/* Top Specular Rim */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Header with Title & Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
            }}
          >
            {isCritical ? <AlertTriangle size={18} /> : <Shield size={18} />}
          </div>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#f7fafc',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Monthly Budget Allowance Cap
            </h3>
            <span style={{ fontSize: '12px', color: '#a8b3bf' }}>
              Target period: {selectedMonthLabel}
            </span>
          </div>
        </div>

        {/* Top-Right Badge Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: isCritical
              ? 'rgba(255, 82, 104, 0.15)'
              : 'rgba(25, 230, 140, 0.12)',
            border: `1px solid ${accentColor}44`,
            fontSize: '11.5px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: accentColor,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          {hasBudget
            ? isExceeded
              ? 'Allowance Exceeded'
              : `${percentage}% Utilized`
            : 'No Cap Defined'}
        </div>
      </div>

      {/* Large Numerical Display (Pricing-card aesthetic) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 800,
                color: '#f7fafc',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.03em',
              }}
            >
              ₹{hasBudget ? budget.toLocaleString('en-IN') : '0'}
            </span>
            <span style={{ fontSize: '13px', color: '#a8b3bf', fontWeight: 500 }}>
              monthly limit
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#a8b3bf', marginTop: '4px' }}>
            Spent to date:{' '}
            <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              ₹{totalSpent.toLocaleString('en-IN')}
            </strong>{' '}
            {hasBudget && (
              <span>
                •{' '}
                {isExceeded ? (
                  <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                    Exceeded by ₹{overspent.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                    ₹{remaining.toLocaleString('en-IN')} available
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Button */}
        <FramerButton
          variant={isCritical ? 'red' : 'green'}
          size="sm"
          onClick={onOpenBudgetModal}
          icon="arrow-right"
        >
          {hasBudget ? 'Adjust Budget Cap' : 'Set Monthly Cap'}
        </FramerButton>
      </div>

      {/* Progress Track */}
      {hasBudget && (
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            marginBottom: '18px',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentage)}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '100%',
              borderRadius: '999px',
              background: isCritical
                ? 'linear-gradient(90deg, #ff5268, #ff7587)'
                : isCaution
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #19e68c, #35a7ff)',
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
        </div>
      )}

      {/* Luminous Glass Divider Line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent)',
          marginBottom: '16px',
        }}
      />

      {/* Feature / Guardrail Checks (Pricing Card Technique adapted to Financial Health) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
          <CheckCircle2 size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
          <span>Automated monthly boundary isolation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
          <CheckCircle2 size={15} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <span>Category-level guardrail monitoring</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
          <CheckCircle2 size={15} style={{ color: isCritical ? 'var(--accent-red)' : 'var(--accent-green)', flexShrink: 0 }} />
          <span>{isCritical ? 'Threshold breach detected' : 'Under 90% caution limit'}</span>
        </div>
      </div>
    </motion.div>
  );
}
