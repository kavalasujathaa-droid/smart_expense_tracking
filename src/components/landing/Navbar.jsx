import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Menu, LogOut, LayoutDashboard, User } from 'lucide-react';
import FramerButton from '../framer/FramerButton';
import FramerPushMenu from '../framer/FramerPushMenu';
import LiquidGlass from '../framer/LiquidGlass';

/**
 * Liquid Glass Navigation Pro
 * Adapted from official Framer component:
 * https://framer.com/m/Liquid-Glass-Nav-Pro-bjAIfL.js@qTWwt82O7SiWRgChNZRM
 * 
 * Features:
 * - Genuine LiquidGlass optical refraction layer (SVG displacement filter + WebWorker)
 * - Specular rim lighting and spark corner halos
 * - Active sliding highlight pill (Framer Motion spring physics)
 * - Black + Green + Blue + Red color identity
 * - Full functional preservation: Dashboard routing, login/signup modals, user profile indicator, logout, and mobile push drawer
 */
export default function Navbar({ onGetStarted, onLogin, user, onLogout, onOpenDashboard }) {
  const [pushMenuOpen, setPushMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  return (
    <>
      <header className="navbar-wrapper" style={{ position: 'sticky', top: '16px', zIndex: 100, width: '100%', padding: '0 16px' }}>
        <nav
          className="navbar"
          aria-label="Main Navigation"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '10px 18px',
            borderRadius: '32px',
            background: 'rgba(10, 16, 22, 0.7)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: `
              inset 0px 1.5px 2px 0px rgba(255, 255, 255, 0.65),
              inset 0px -1px 1px 0px rgba(255, 255, 255, 0.25),
              inset 3px 0px 4px -2px rgba(255, 255, 255, 0.35),
              inset -3px 0px 4px -2px rgba(255, 255, 255, 0.35),
              inset 0px 0px 0px 1px rgba(255, 255, 255, 0.12),
              0px 16px 40px -12px rgba(0, 0, 0, 0.75),
              0px 4px 14px -2px rgba(0, 0, 0, 0.35)
            `,
          }}
        >
          {/* Integrated LiquidGlass Refraction Engine Layer */}
          <LiquidGlass
            cornerRadius={32}
            refraction={32}
            bezelWidth={14}
            blur={18}
            saturation={1.5}
            brightness={1.06}
            tint="rgba(5, 7, 9, 0.35)"
            tintOpacity={0.8}
          />

          {/* Spark Bottom-Left Halo & Core */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '2px',
              left: '12px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'rgba(25, 230, 140, 0.35)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '16px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              filter: 'blur(1px)',
              opacity: 0.9,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Spark Top-Right Halo & Core */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '2px',
              right: '18px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'rgba(53, 167, 255, 0.35)',
              filter: 'blur(7px)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '5px',
              right: '22px',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              filter: 'blur(1px)',
              opacity: 0.9,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Brand Logo with Emerald Green / Electric Blue gradient */}
          <a
            href="#"
            className="brand-logo"
            aria-label="Smart Expense Tracking Home"
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              className="brand-icon"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #19e68c 0%, #35a7ff 100%)',
                boxShadow: '0 4px 16px rgba(25, 230, 140, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#050709',
              }}
            >
              <Wallet size={19} strokeWidth={2.4} />
            </div>
            <span
              style={{
                fontWeight: 700,
                letterSpacing: '-0.03em',
                fontSize: '17px',
                color: '#f7fafc',
              }}
            >
              Smart Expense Tracking
            </span>
          </a>

          {/* Desktop Navigation & Actions */}
          <div
            className="nav-actions hidden-mobile"
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {/* Dashboard Nav Link with Liquid Highlight */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="nav-link"
                onClick={onOpenDashboard}
                onMouseEnter={() => setHoveredNav('dashboard')}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  background: 'none',
                  border: 'none',
                  color: hoveredNav === 'dashboard' ? '#f7fafc' : '#a8b3bf',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.18s ease',
                  borderRadius: '24px',
                }}
              >
                <LayoutDashboard size={15} style={{ opacity: 0.8 }} />
                <span>Dashboard</span>
              </button>
              {hoveredNav === 'dashboard' && (
                <motion.div
                  layoutId="liquid-nav-highlight"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.35)',
                    zIndex: 1,
                  }}
                />
              )}
            </div>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#e2e8f0',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    maxWidth: '190px',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  }}
                  title={user.email}
                >
                  <User size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 82, 104, 0.1)',
                    border: '1px solid rgba(255, 82, 104, 0.3)',
                    borderRadius: '9999px',
                    color: 'var(--accent-red)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '6px 14px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255, 82, 104, 0.25)';
                    e.currentTarget.style.borderColor = 'rgba(255, 82, 104, 0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--accent-red)';
                    e.currentTarget.style.background = 'rgba(255, 82, 104, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 82, 104, 0.3)';
                  }}
                  aria-label="Log out"
                >
                  <LogOut size={13} />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="nav-link"
                    onClick={onLogin}
                    onMouseEnter={() => setHoveredNav('login')}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      background: 'none',
                      border: 'none',
                      color: hoveredNav === 'login' ? '#f7fafc' : '#a8b3bf',
                      fontSize: '14.5px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: '8px 16px',
                      transition: 'color 0.18s ease',
                      borderRadius: '24px',
                    }}
                  >
                    Login
                  </button>
                  {hoveredNav === 'login' && (
                    <motion.div
                      layoutId="liquid-nav-highlight"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '24px',
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.35)',
                        zIndex: 1,
                      }}
                    />
                  )}
                </div>

                <FramerButton
                  variant="green"
                  size="sm"
                  onClick={onGetStarted}
                  icon="arrow-up-right"
                >
                  Get Started
                </FramerButton>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setPushMenuOpen(true)}
            aria-label="Open navigation menu"
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'none',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '12px',
              color: '#f7fafc',
              padding: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: 'var(--shadow-glass-sm)',
            }}
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Push Menu Drawer for Mobile Navigation */}
      <FramerPushMenu
        isOpen={pushMenuOpen}
        onClose={() => setPushMenuOpen(false)}
        user={user}
        onOpenDashboard={onOpenDashboard}
        onLogin={onLogin}
        onGetStarted={onGetStarted}
        onLogout={onLogout}
      />
    </>
  );
}
