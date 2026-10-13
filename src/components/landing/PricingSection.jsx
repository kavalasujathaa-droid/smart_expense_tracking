import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../../data/siteContent';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function PricingSection({ onGetStarted }) {
  return (
    <section id="pricing" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <span className="dot" />
            <span>Student First</span>
          </div>
          <h2 className="section-title">
            Completely Free. <span className="text-gradient-emerald">No Gotchas, No BS.</span>
          </h2>
          <p className="section-subtitle">
            Students shouldn't have to pay to learn how to budget. All core tracking features, charts, and budget guardrails are unrestricted.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid-2" style={{ maxWidth: '960px', margin: '0 auto' }}>
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <GlassCard
                className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}
                glow={plan.highlight}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                      {plan.name}
                    </h3>
                    <Badge variant={plan.highlight ? 'emerald' : 'cyan'}>
                      {plan.badge}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                    {plan.tagline}
                  </p>

                  <div className="pricing-price">
                    <span>{plan.price}</span>
                    <span className="pricing-frequency">/ {plan.frequency}</span>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '20px 0' }} />

                  <ul className="pricing-features-list">
                    {plan.features.map((feature) => (
                      <li key={feature} className="pricing-feature-item">
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: plan.highlight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: plan.highlight ? '#34d399' : '#38bdf8',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Button
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    size="lg"
                    style={{ width: '100%' }}
                    onClick={onGetStarted}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {plan.ctaText}
                  </Button>
                  <p style={{ fontSize: '11.5px', textAlign: 'center', color: 'var(--text-muted)', marginTop: '10px' }}>
                    {plan.secondaryText}
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
