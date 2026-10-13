import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Footer from './components/landing/Footer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import FramerAuthModal from './components/framer/FramerAuthModal';
import GlaciaAmbientBackground from './components/ui/GlaciaAmbientBackground';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Sparkles, X, AlertTriangle, Wallet } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Restore session and subscribe to Supabase auth events
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    // Check active session on initial load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Error fetching Supabase session:', error.message);
      }
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for real-time auth state updates (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Synchronize browser history and Back/Forward navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/dashboard') {
        setView('dashboard');
      }

      const handlePopState = () => {
        const currentPath = window.location.pathname;
        if (currentPath === '/dashboard') {
          setView('dashboard');
        } else {
          setView('landing');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const openAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setAuthModalOpen(false);
    setView('dashboard');
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
    }
    showToast(`Welcome! Logged in as ${authenticatedUser.email}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({ view: 'landing' }, '', '/');
    }
    showToast('Logged out securely.');
  };

  // Protected Dashboard Navigation
  const handleOpenDashboard = () => {
    if (!isSupabaseConfigured) {
      showToast('Please configure Supabase credentials in .env.local first.');
      return;
    }
    if (!user) {
      showToast('Please log in or create an account to access your private expenses.');
      openAuth('login');
      return;
    }
    setView('dashboard');
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTracking = () => {
    if (user) {
      handleOpenDashboard();
    } else {
      openAuth('signup');
    }
  };

  const backToLanding = () => {
    setView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({ view: 'landing' }, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guard against flashing protected contents during initial authentication verification
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              background: 'rgba(25, 230, 140, 0.12)',
              border: '1px solid rgba(25, 230, 140, 0.25)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-green)',
            }}
          >
            <Wallet size={22} />
          </div>
          <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Verifying private credentials...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', position: 'relative' }}>
      {/* Glacia Ambient Floating Aurora Mesh (Teal, Cyan, Violet) */}
      <GlaciaAmbientBackground />

      {/* Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(8, 11, 20, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass-light)',
            borderRadius: '16px',
            padding: '12px 20px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-glass-elevated)',
            fontSize: '13.5px',
          }}
        >
          <Sparkles size={16} color="var(--accent-green)" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '2px',
            }}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </aside>
      )}

      {/* Page-to-Page Route Transitions via AnimatePresence */}
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div
            key="dashboard-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', minHeight: '100vh', position: 'relative', zIndex: 1 }}
          >
            {!user ? (
              // Unauthenticated protection fallback
              <div
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-base)',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    maxWidth: '440px',
                    background: 'var(--bg-glass-modal, rgba(9, 11, 18, 0.9))',
                    backdropFilter: 'var(--blur-glass-lg)',
                    WebkitBackdropFilter: 'var(--blur-glass-lg)',
                    padding: '36px 32px',
                    borderRadius: '24px',
                    border: '1px solid var(--border-glass-light)',
                    boxShadow: 'var(--shadow-glass-modal)',
                  }}
                >
                  <AlertTriangle
                    size={38}
                    color="var(--accent-amber)"
                    style={{ margin: '0 auto 16px auto' }}
                  />
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                    Authentication Required
                  </h2>
                  <p
                    style={{
                      fontSize: '14.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '26px',
                    }}
                  >
                    Your expense records are protected with PostgreSQL Row Level Security. Please log in to view your ledger.
                  </p>
                  <button
                    type="button"
                    className="btn btn-emerald btn-md"
                    style={{ width: '100%', marginBottom: '12px' }}
                    onClick={() => openAuth('login')}
                  >
                    Log in to Account
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                    onClick={backToLanding}
                  >
                    Back to Landing Page
                  </button>
                </div>
              </div>
            ) : (
              <DashboardLayout
                onBackToLanding={backToLanding}
                user={user}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="app-container"
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}
          >
            {/* Missing Supabase Configuration Notice */}
            {!isSupabaseConfigured && (
              <aside
                role="region"
                aria-label="Configuration Notice"
                style={{
                  background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%)',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '10px 16px',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <AlertTriangle size={15} />
                <span>
                  <strong>Supabase Setup Required:</strong> Add <code style={{ color: '#fff' }}>VITE_SUPABASE_URL</code> and <code style={{ color: '#fff' }}>VITE_SUPABASE_PUBLISHABLE_KEY</code> to your <code style={{ color: '#fff' }}>.env.local</code> to enable real authentication and PostgreSQL sync.
                </span>
              </aside>
            )}

            {/* 1. Minimal Sticky Navigation */}
            <Navbar
              onGetStarted={handleStartTracking}
              onLogin={() => openAuth('login')}
              user={user}
              onLogout={handleLogout}
              onOpenDashboard={handleOpenDashboard}
            />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {/* 2. Hero Section: "Smart Expense Tracking", Start Tracking, Explore Dashboard */}
              <Hero
                onStartTracking={handleStartTracking}
                onExploreDashboard={handleOpenDashboard}
              />
            </main>

            {/* 4. Minimal Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MultiStep Auth Modal (Framer Component E adapted to real Supabase) */}
      <FramerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />
    </div>
  );
}
