import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import FramerButton from '../framer/FramerButton';

/**
 * Redesigned Delete Confirmation Modal
 * Glassmorphic dark card, high contrast typography, AnimatePresence transitions, and FramerButton actions.
 */
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, expense }) {
  return (
    <AnimatePresence>
      {isOpen && expense && (
        <motion.div
          key="delete-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="delete-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              background: 'rgba(8, 10, 16, 0.90)',
              border: '1px solid rgba(255, 82, 104, 0.35)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: 'var(--shadow-glass-modal)',
              backdropFilter: 'var(--blur-glass-lg)',
              WebkitBackdropFilter: 'var(--blur-glass-lg)',
              color: '#f0f7f5',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '24px',
                right: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 82, 104, 0.65), rgba(53, 167, 255, 0.35), transparent)',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 82, 104, 0.12)',
                    border: '1px solid rgba(255, 82, 104, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-red)',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                    Delete Expense?
                  </h3>
                  <p style={{ fontSize: '13px', color: '#9e9ea7', marginTop: '2px' }}>
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9e9ea7',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass-light)',
                backdropFilter: 'var(--blur-glass-sm)',
                WebkitBackdropFilter: 'var(--blur-glass-sm)',
                boxShadow: 'var(--shadow-glass-panel)',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '15.5px', color: '#fff', marginBottom: '4px' }}>
                {expense.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', color: '#9e9ea7' }}>
                <span>{expense.category} • {expense.date}</span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 700, fontFamily: 'monospace', fontSize: '15px' }}>
                  -₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <FramerButton variant="secondary" size="md" onClick={onClose} icon="none">
                Cancel
              </FramerButton>
              <FramerButton
                variant="red"
                size="md"
                onClick={() => onConfirm(expense.id)}
                icon="none"
              >
                Confirm Delete
              </FramerButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
