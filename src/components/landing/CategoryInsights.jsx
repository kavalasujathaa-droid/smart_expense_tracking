import React from 'react';
import { motion } from 'framer-motion';
import { STUDENT_INSIGHTS } from '../../data/siteContent';
import GlassCard from '../ui/GlassCard';

export default function CategoryInsights() {
  return (
    <section id="insights" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <span className="dot" />
            <span>Student Metrics</span>
          </div>
          <h2 className="section-title">
            Built Around Actual <span className="text-gradient-emerald">College Life Realities</span>
          </h2>
          <p className="section-subtitle">
            Engineered to empower Indian college students with financial independence without stress or sales pitches.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid-4">
          {STUDENT_INSIGHTS.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="mono" style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                    {item.stat}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '10px' }}>
                    {item.label}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.detail}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
