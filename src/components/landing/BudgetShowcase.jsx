import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, Target, Sliders, CheckCircle2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import { CATEGORIES } from '../../lib/expenseService';

export default function BudgetShowcase() {
  return (
    <section id="budgets" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <span className="dot" />
            <span>Budget Guardrails</span>
          </div>
          <h2 className="section-title">
            Set Monthly Pocket Money Caps.{' '}
            <span className="text-gradient-emerald">Never Run Dry Mid-Semester.</span>
          </h2>
          <p className="section-subtitle">
            Visual warning thresholds automatically adjust color as you spend, calculating your safe daily burn rate so you can pace your student allowance with confidence.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid-2">
          {/* Left Column: Warning Tiers & Daily Burn Rules */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard style={{ padding: '32px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Smart Overspend Detection
                </span>
                <Badge variant="amber" icon={AlertCircle}>
                  Multi-Tier Logic
                </Badge>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Multi-Stage Health Signals
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Smart Expense Tracking classifies your spending velocity into clear student states without complex financial jargon:
              </p>

              {/* Threshold 1: Safe */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#34d399', fontSize: '14px' }}>
                    🟢 Safe Spending (0% – 75%)
                  </span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Healthy Balance
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Normal campus spending pace. Visual progress indicators remain emerald across canteen food and routine daily travel.
                </p>
              </div>

              {/* Threshold 2: Caution */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: '14px' }}>
                    🟡 Caution Tier (75% – 90%)
                  </span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Pacing Warning
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Allowance enters the upper quartile. Automatic banners calculate remaining safe daily spend so you do not run dry before month-end.
                </p>
              </div>

              {/* Threshold 3: Critical Alert */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(244, 63, 94, 0.05)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#fb7185', fontSize: '14px' }}>
                    🔴 Critical & Overspend (&gt;90% / &gt;100%)
                  </span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Action Required
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Emergency warnings trigger to pause discretionary weekend expenses. Exceeded caps display exact overspend amounts.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Column: Per-Category Budget Guardrails Architecture */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard style={{ padding: '32px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Category Guardrails
                </span>
                <Badge variant="cyan" icon={Sliders}>
                  Independent Caps
                </Badge>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Campus Category Isolation
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Allocate exact targets in Supabase so an expensive semester textbook or lab fee does not distort your monthly mess food budget:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                      <span style={{ color: '#fff', fontWeight: 500, fontSize: '13.5px' }}>
                        {cat.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Configurable Cap
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} color="var(--accent-emerald)" />
                <span>All category limits persist securely in Supabase PostgreSQL per authenticated student.</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
