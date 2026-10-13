import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Receipt,
  Target,
  BarChart3,
  Sparkles,
  Home,
} from 'lucide-react';
import FramerButton from './FramerButton';

/**
 * Push Menu Navigation
 * Adapted from https://framer.com/m/Push-Menu-Navigation-sAkTG0.js@LpbvpeiV3XpWuXJY7npR
 * 
 * Features:
 * - Off-canvas push drawer with spring transition
 * - Dimmed backdrop with blur
 * - Connects every navigation item to the real sections & routes
 * - Keyboard support (Escape key), body scroll lock, accessible ARIA roles
 */
export default function FramerPushMenu({
  isOpen,
  onClose,
  user,
  onOpenDashboard,
  onLogin,
  onGetStarted,
  onLogout,
}) {
  const menuRef = useRef(null);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const scrollTo = (id) => {
    onClose();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      action: () => scrollTo('top'),
    },
    {
      label: 'Private Dashboard',
      icon: LayoutDashboard,
      badge: user ? 'Active' : 'Auth Required',
      action: () => {
        onClose();
        onOpenDashboard();
      },
    },
    ...(user
      ? [
          {
            label: 'Sign Out',
            icon: LogOut,
            action: () => {
              onClose();
              onLogout();
            },
          },
        ]
      : [
          {
            label: 'Sign In',
            icon: LogIn,
            action: () => {
              onClose();
              onLogin();
            },
          },
          {
            label: 'Get Started Free',
            icon: UserPlus,
            primary: true,
            action: () => {
              onClose();
              onGetStarted();
            },
          },
        ]),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.78)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            aria-hidden="true"
          />

          {/* Off-canvas Push Drawer */}
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(380px, 88vw)',
              background: 'rgba(7, 9, 16, 0.92)',
              backdropFilter: 'var(--blur-glass-lg)',
              WebkitBackdropFilter: 'var(--blur-glass-lg)',
              borderLeft: '1px solid var(--border-glass-light)',
              padding: '32px 26px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-glass-modal)',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '36px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #19e68c 0%, #35a7ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(25, 230, 140, 0.35)',
                    }}
                  >
                    <span style={{ color: '#050709', fontWeight: 800, fontSize: '16px' }}>S</span>
                  </div>
                  <div>
                    <span style={{ color: '#f7fafc', fontWeight: 700, fontSize: '16.5px', letterSpacing: '-0.02em', display: 'block' }}>
                      Smart Expense Tracking
                    </span>
                    <span style={{ fontSize: '11px', color: '#8c90a0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Navigation Drawer
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Navigation"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9e9ea7',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'var(--border-glass-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9e9ea7';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links with Staggered Entrance */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.22 }}
                    >
                      {item.primary ? (
                        <div style={{ marginTop: '14px' }}>
                          <FramerButton
                            variant="primary"
                            size="md"
                            onClick={item.action}
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            {item.label}
                          </FramerButton>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={item.action}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '14px',
                            color: '#ededed',
                            fontSize: '15.5px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.075)';
                            e.currentTarget.style.borderColor = 'var(--border-glass-light)';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'var(--border-glass)';
                            e.currentTarget.style.color = '#ededed';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Icon size={18} color="var(--accent-teal)" />
                            <span>{item.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.badge && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  color: user ? '#10b981' : '#f59e0b',
                                  background: user ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight size={14} color="#60606a" />
                          </div>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Footer inside drawer */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '20px',
                marginTop: '28px',
                fontSize: '13px',
                color: '#60606a',
              }}
            >
              {user ? (
                <div>
                  <span style={{ display: 'block', color: '#9e9ea7', marginBottom: '2px', fontSize: '12px' }}>Signed in as</span>
                  <span style={{ color: '#fff', wordBreak: 'break-all', fontWeight: 500 }}>{user.email}</span>
                </div>
              ) : (
                <span>Smart Expense Tracking — Protected with PostgreSQL Row Level Security</span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
