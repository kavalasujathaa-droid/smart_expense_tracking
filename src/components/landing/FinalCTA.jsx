import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

export default function FinalCTA({ onGetStarted, onExplore }) {
  return (
    <section className="section" style={{ paddingTop: '40px', paddingBottom: '96px' }}>
      <div className="container">
        <motion.div
          className="final-cta-box"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-pill" style={{ marginBottom: '20px' }}>
            <Sparkles size={13} color="var(--accent-emerald)" />
            <span>Ready for Zero-Stress Budgeting?</span>
          </div>

          <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Take Full Command of Your <span className="text-gradient-emerald">Campus Finances Today</span>
          </h2>

          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Log campus expenses in under 5 seconds, eliminate end-of-month panic, and manage your student allowance with private PostgreSQL security.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              icon={ArrowRight}
              iconPosition="right"
            >
              Start Free Tracking
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onExplore}
            >
              Explore Features
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '12.5px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--accent-emerald)" /> 100% Free Forever
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--accent-emerald)" /> No Credit Card Needed
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--accent-emerald)" /> Mobile Optimized
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
