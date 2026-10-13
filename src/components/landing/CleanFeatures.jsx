import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Target, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';
import FramerTiltCard from '../framer/FramerTiltCard';
import FramerTextReveal from '../framer/FramerTextReveal';

/**
 * Clean Feature Section
 * Exactly 3 items: Expense Tracking, Budget Management, Spending Analytics
 * Powered by Framer 3D Tilt Cards with subtle lighting and fluid typography
 */
export default function CleanFeatures({ onStartTracking }) {
  const features = [
    {
      icon: Receipt,
      iconColor: '#34d399',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      title: 'Expense Tracking',
      tag: 'Core Ledger',
      description:
        'Log expenses in seconds with precise amounts, categories, dates, and notes. Instantly search, filter, and export your entire financial history to CSV.',
      highlights: ['Instant 5-second entry', 'Dynamic category tags', '1-click CSV export'],
    },
    {
      icon: Target,
      iconColor: '#38bdf8',
      iconBg: 'rgba(56, 189, 248, 0.12)',
      title: 'Budget Management',
      tag: 'Proactive Guardrails',
      description:
        'Establish monthly pocket money caps and category-level spending limits. Visual progress indicators alert you before you exceed your planned thresholds.',
      highlights: ['Monthly ceiling caps', 'Category-level limits', 'Overspending alerts'],
    },
    {
      icon: BarChart3,
      iconColor: '#a78bfa',
      iconBg: 'rgba(167, 139, 250, 0.12)',
      title: 'Spending Analytics',
      tag: 'Visual Intelligence',
      description:
        'Understand your financial flow with real-time category distribution charts, daily burn rate calculations, and monthly expenditure trends.',
      highlights: ['Category distribution', 'Daily burn rate pacing', 'Private PostgreSQL RLS'],
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Section Header with FramerTextReveal */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 72px)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '13px',
            fontWeight: 600,
            color: '#9e9ea7',
            marginBottom: '16px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Focused Capabilities</span>
        </div>

        <FramerTextReveal
          as="h2"
          dimOpacity={0.25}
          style={{
            fontSize: 'clamp(32px, 4.5vw, 44px)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            color: '#f0f7f5',
            lineHeight: 1.15,
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          Engineered for Financial Control
        </FramerTextReveal>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 18.5px)',
            color: '#9e9ea7',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Three core modules designed to give you effortless visibility over every rupee spent.
        </p>
      </div>

      {/* 3-Column Grid of 3D Tilt Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              style={{ display: 'flex' }}
            >
              <FramerTiltCard
                maxTilt={4}
                style={{
                  padding: '36px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'rgba(12, 13, 20, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '28px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: feature.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feature.iconColor,
                        border: `1px solid ${feature.iconBg}`,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#60606a',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {feature.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: 'clamp(20px, 2.5vw, 24px)',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      color: '#ffffff',
                      marginBottom: '12px',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'clamp(14.5px, 1.8vw, 16px)',
                      color: '#9e9ea7',
                      lineHeight: 1.65,
                      marginBottom: '24px',
                    }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {feature.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13.5px',
                        color: '#dedede',
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: feature.iconColor,
                          flexShrink: 0,
                        }}
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </FramerTiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
