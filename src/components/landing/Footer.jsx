import React from 'react';
import { Wallet } from 'lucide-react';

/**
 * Minimal Glacia-Inspired Footer
 * Clean, uncluttered, focused on brand, copyright & security guarantees
 */
export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '36px 24px',
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #19e68c 0%, #35a7ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050709',
              boxShadow: '0 0 14px rgba(25, 230, 140, 0.3)',
            }}
          >
            <Wallet size={15} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Smart Expense Tracking
          </span>
        </div>

        {/* Minimal Copyright & Privacy Note */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          <span>© {new Date().getFullYear()} Smart Expense Tracking</span>
          <span>•</span>
          <span>PostgreSQL Row Level Security</span>
          <span>•</span>
          <span>INR (₹) Standard</span>
        </div>
      </div>
    </footer>
  );
}
