import React from 'react';
import { motion } from 'framer-motion';
import { PieChart as PieIcon, BarChart3, TrendingUp, DownloadCloud, Sparkles, ShieldCheck } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

export default function AnalyticsSection() {
  const capabilities = [
    {
      icon: PieIcon,
      color: 'var(--accent-cyan)',
      title: 'Automatic Category Allocation',
      description: 'Your logged transactions are grouped into campus spending categories without manual spreadsheets or tagging.',
      tag: 'Distribution Donut',
    },
    {
      icon: BarChart3,
      color: 'var(--accent-emerald)',
      title: 'Chronological Spending Trajectory',
      description: 'Time-series Recharts charts track month-by-month and day-by-day trends, identifying high-spend weeks before finals.',
      tag: 'Time-Series Bar',
    },
    {
      icon: TrendingUp,
      color: 'var(--accent-amber)',
      title: 'Real-Time Burn Rate & Safe Pace',
      description: 'Calculates your average daily expenditure and recommends a safe daily burn rate for the days remaining in the month.',
      tag: 'Velocity Metrics',
    },
    {
      icon: DownloadCloud,
      color: 'var(--accent-violet)',
      title: 'One-Click CSV Ledger Export',
      description: 'Export all records to a clean CSV file with titles, categories, dates, payment tags, and notes ready for parents or scholarship claims.',
      tag: 'Data Ownership',
    },
  ];

  return (
    <section id="analytics" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <span className="dot" />
            <span>Real Analytics Engine</span>
          </div>
          <h2 className="section-title">
            Financial Insights That Reveal Where Every <span className="text-gradient-cyan">Rupee Goes</span>
          </h2>
          <p className="section-subtitle">
            Say goodbye to mysterious zero-balance SMS alerts. Smart Expense Tracking computes real-time analytics directly from your authenticated PostgreSQL ledger.
          </p>
        </div>

        {/* 4-Card Analytics Architecture Grid */}
        <div className="grid-2">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color,
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <Badge variant={idx === 1 ? 'emerald' : idx === 0 ? 'cyan' : idx === 2 ? 'amber' : 'violet'}>
                        {item.tag}
                      </Badge>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={14} color="var(--accent-emerald)" />
                    <span>Real-time calculation from authentic user records only</span>
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
