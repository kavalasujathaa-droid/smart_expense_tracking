import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Layers, ShieldAlert, PieChart, ArrowRight } from 'lucide-react';
import { WORKFLOW_STEPS } from '../../data/siteContent';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

const STEP_ICONS = {
  Zap,
  Layers,
  ShieldAlert,
  PieChart,
};

export default function Workflow() {
  return (
    <section id="workflow" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <span className="dot" />
            <span>Campus Workflow</span>
          </div>
          <h2 className="section-title">
            From Daily Chai to Semester Fees in <span className="text-gradient-emerald">Four Smooth Steps</span>
          </h2>
          <p className="section-subtitle">
            Engineered for hectic campus routines. Track payments right after you scan the UPI QR code without losing momentum.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[step.icon] || Zap;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="workflow-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span className="workflow-number">{step.number}</span>
                      <Badge variant={idx === 2 ? 'amber' : idx === 3 ? 'cyan' : 'emerald'}>
                        {step.tag}
                      </Badge>
                    </div>

                    <div className="workflow-icon-wrap">
                      <Icon size={20} />
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                      {step.title}
                    </h3>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--accent-emerald)', marginBottom: '12px' }}>
                      {step.subtitle}
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {step.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Step {step.number} of 04</span>
                    <ArrowRight size={12} />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
