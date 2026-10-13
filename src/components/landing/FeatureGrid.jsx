import React from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Filter,
  Target,
  LayoutDashboard,
  Lock,
  DownloadCloud
} from 'lucide-react';
import { FEATURE_GRID } from '../../data/siteContent';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

const FEATURE_ICONS = {
  PlusCircle,
  Filter,
  Target,
  LayoutDashboard,
  Lock,
  DownloadCloud
};

export default function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <span className="dot" />
            <span>Campus Toolkit</span>
          </div>
          <h2 className="section-title">
            Purpose-Built For Everything College Throws at <span className="text-gradient-violet">Your Wallet</span>
          </h2>
          <p className="section-subtitle">
            Say goodbye to forgotten Excel spreadsheets and mysterious zero-balance SMS alerts. Enjoy a clean, fast interface tailored for students.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid-3">
          {FEATURE_GRID.map((feature, idx) => {
            const Icon = FEATURE_ICONS[feature.icon] || PlusCircle;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <GlassCard className="feature-card" glow={idx === 0 || idx === 2}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div className="feature-icon-box">
                      <Icon size={20} />
                    </div>
                    <Badge variant={idx === 4 ? 'emerald' : idx === 2 ? 'amber' : 'violet'}>
                      {feature.badge}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
