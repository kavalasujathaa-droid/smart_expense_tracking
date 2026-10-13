import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import FramerButton from './FramerButton';

/**
 * MultiStep Auth Modal
 * Adapted from https://framer.com/m/MultiStepWaitlistForm-2o03as.js@uJjItfi25pEwwsKb4ons
 * 
 * Secure Real Supabase Integration:
 * - Segmented progress bar with active glowing indicators
 * - Glassmorphic dark card with shimmer line
 * - Multi-step interactive onboarding for sign-up (Credentials -> Role -> Categories -> Launch)
 * - Quick 1-step direct Login tab for existing accounts
 * - Real Supabase email/password authentication (signUp & signInWithPassword)
 * - Full validation, error alerts, and PostgreSQL Row Level Security preservation
 */
export default function FramerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  onAuthSuccess,
  initialMode = 'login',
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('fwd');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Multi-step profile selections
  const [role, setRole] = useState('Student');
  const [categories, setCategories] = useState(['Food & Dining', 'Academics & Books']);
  const [terms, setTerms] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCallback = (sessionOrUser) => {
    const userObj = sessionOrUser?.user || sessionOrUser;
    if (onSuccess) onSuccess(userObj);
    if (onAuthSuccess) onAuthSuccess(sessionOrUser);
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    }
    setDirection('fwd');
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setDirection('bk');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleDirectLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase is not configured yet. Please check .env.local.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (data?.session) {
        handleCallback(data.session);
        onClose();
      }
    } catch (err) {
      let msg = err.message || 'Login failed.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Email not confirmed. Please check your inbox for the verification link.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiStepSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase is not configured yet. Please check .env.local.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
            preferred_categories: categories,
          },
        },
      });

      if (error) throw error;

      if (data?.user && !data.session) {
        setInfoMsg('Verification email sent! Please check your inbox to activate your account.');
        setSuccess(true);
        setLoading(false);
        return;
      }

      if (data?.session) {
        setSuccess(true);
        setTimeout(() => {
          handleCallback(data.session);
          onClose();
        }, 1200);
      }
    } catch (err) {
      let msg = err.message || 'Registration failed.';
      if (msg.includes('User already registered')) {
        msg = 'An account with this email already exists. Please log in.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Student', desc: 'College or university budget management' },
    { label: 'Young Professional', desc: 'Starting career, salary & rent tracking' },
    { label: 'Freelancer', desc: 'Irregular income & project expenditures' },
    { label: 'General Individual', desc: 'Personal household finance & savings' },
  ];

  const categoryOptions = [
    'Food & Dining',
    'Academics & Books',
    'Housing & Utilities',
    'Transport & Commute',
    'Tech & Subscriptions',
    'Health & Fitness',
    'Leisure & Social',
  ];

  return (
    <div
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
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(8, 10, 16, 0.90)',
          border: '1px solid var(--border-glass-light)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-glass-modal)',
          backdropFilter: 'var(--blur-glass-lg)',
          WebkitBackdropFilter: 'var(--blur-glass-lg)',
          overflow: 'hidden',
          color: '#f0f7f5',
        }}
      >
        {/* Shimmer line from Framer MultiStep reference */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '32px',
            right: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(25, 230, 140, 0.6), rgba(53, 167, 255, 0.4), transparent)',
          }}
        />

        {/* Modal Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Mode Switch Tabs */}
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: mode === 'login' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: mode === 'login' ? '#fff' : '#9e9ea7',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: mode === 'signup' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: mode === 'signup' ? '#fff' : '#9e9ea7',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Create Account
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9e9ea7',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9e9ea7')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress Bar (Only visible in MultiStep Signup Mode) */}
        {mode === 'signup' && !success && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
            {[1, 2, 3, 4].map((step) => {
              const isPast = step < currentStep;
              const isCurrent = step === currentStep;
              return (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '2px',
                    background: isPast
                      ? 'var(--accent-green)'
                      : isCurrent
                      ? 'linear-gradient(90deg, var(--accent-green), rgba(25, 230, 140, 0.4))'
                      : 'rgba(255, 255, 255, 0.08)',
                    transition: 'background 0.3s ease',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Error / Info messages */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 82, 104, 0.12)',
              border: '1px solid rgba(255, 82, 104, 0.3)',
              color: 'var(--accent-red)',
              fontSize: '13px',
              marginBottom: '18px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(25, 230, 140, 0.12)',
              border: '1px solid rgba(25, 230, 140, 0.3)',
              color: 'var(--accent-green)',
              fontSize: '13px',
              marginBottom: '18px',
            }}
          >
            <Check size={16} style={{ flexShrink: 0 }} />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0 12px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(25, 230, 140, 0.12)',
                border: '1px solid rgba(25, 230, 140, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: 'var(--accent-green)',
              }}
            >
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Account Ready
            </h3>
            <p style={{ fontSize: '14px', color: '#9e9ea7', lineHeight: 1.6, marginBottom: '24px' }}>
              {infoMsg || `Welcome aboard, ${fullName}! Your private database ledger is prepared.`}
            </p>
            <FramerButton
              variant="primary"
              size="md"
              onClick={onClose}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Open Dashboard
            </FramerButton>
          </div>
        ) : mode === 'login' ? (
          /* QUICK LOGIN VIEW */
          <form onSubmit={handleDirectLogin}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '13.5px', color: '#9e9ea7' }}>
                Sign in to manage your private expenses and budgets.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9e9ea7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    className="glass-input"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <Mail size={16} color="#60606a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9e9ea7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="glass-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 38px 12px 38px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <Lock size={16} color="#60606a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#60606a',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <FramerButton
              variant="primary"
              size="md"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </FramerButton>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '12.5px', color: '#60606a' }}>
              <ShieldCheck size={14} color="var(--accent-green)" />
              <span>Protected by PostgreSQL Row Level Security</span>
            </div>
          </form>
        ) : (
          /* MULTISTEP SIGNUP VIEW (Adapted from Framer MultiStepWaitlistForm) */
          <div>
            {/* STEP 1: Account Setup */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: direction === 'bk' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-green)', background: 'rgba(25, 230, 140, 0.12)', padding: '3px 10px', borderRadius: '100px' }}>
                    Account Setup
                  </span>
                  <span style={{ fontSize: '12px', color: '#60606a', fontWeight: 600 }}>1 / 4</span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Create your ledger
                </h2>
                <p style={{ fontSize: '13.5px', color: '#9e9ea7', marginBottom: '20px' }}>
                  Enter your details to create an encrypted personal workspace.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9e9ea7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="glass-input"
                        placeholder="Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                      <User size={16} color="#60606a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9e9ea7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="glass-input"
                        placeholder="alex@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                      <Mail size={16} color="#60606a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9e9ea7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Password (min 6 characters)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="glass-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 38px 12px 38px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                      <Lock size={16} color="#60606a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#60606a',
                          cursor: 'pointer',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <FramerButton
                    variant="primary"
                    size="md"
                    onClick={handleNextStep}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Continue
                  </FramerButton>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Role Profile */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: direction === 'bk' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-green)', background: 'rgba(25, 230, 140, 0.12)', padding: '3px 10px', borderRadius: '100px' }}>
                    Profile
                  </span>
                  <span style={{ fontSize: '12px', color: '#60606a', fontWeight: 600 }}>2 / 4</span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  What describes you?
                </h2>
                <p style={{ fontSize: '13.5px', color: '#9e9ea7', marginBottom: '18px' }}>
                  We tailor default categories and budget templates to your lifestyle.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '22px' }}>
                  {roleOptions.map((r) => {
                    const isSelected = role === r.label;
                    return (
                      <div
                        key={r.label}
                        onClick={() => setRole(r.label)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '14px',
                          background: isSelected ? 'rgba(25, 230, 140, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected ? '1px solid rgba(25, 230, 140, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? '#fff' : '#dedede' }}>
                            {r.label}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888894', marginTop: '2px' }}>
                            {r.desc}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid var(--accent-green)' : '1.5px solid #444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FramerButton variant="secondary" size="md" onClick={handlePrevStep} icon="none" style={{ flex: '0 0 auto' }}>
                    Back
                  </FramerButton>
                  <FramerButton variant="primary" size="md" onClick={handleNextStep} style={{ flex: 1, justifyContent: 'center' }}>
                    Continue
                  </FramerButton>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Tracking Categories */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: direction === 'bk' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-green)', background: 'rgba(25, 230, 140, 0.12)', padding: '3px 10px', borderRadius: '100px' }}>
                    Categories
                  </span>
                  <span style={{ fontSize: '12px', color: '#60606a', fontWeight: 600 }}>3 / 4</span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Key spending areas
                </h2>
                <p style={{ fontSize: '13.5px', color: '#9e9ea7', marginBottom: '18px' }}>
                  Select the categories you want prioritized in your monthly budget.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {categoryOptions.map((cat) => {
                    const isSelected = categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '9999px',
                          background: isSelected ? 'rgba(25, 230, 140, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                          border: isSelected ? '1px solid rgba(25, 230, 140, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: isSelected ? 'var(--accent-green)' : '#dedede',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: isSelected ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.25)',
                          }}
                        />
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FramerButton variant="secondary" size="md" onClick={handlePrevStep} icon="none" style={{ flex: '0 0 auto' }}>
                    Back
                  </FramerButton>
                  <FramerButton variant="primary" size="md" onClick={handleNextStep} style={{ flex: 1, justifyContent: 'center' }}>
                    Review & Complete
                  </FramerButton>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Final Confirmation */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: direction === 'bk' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-green)', background: 'rgba(25, 230, 140, 0.12)', padding: '3px 10px', borderRadius: '100px' }}>
                    Confirmation
                  </span>
                  <span style={{ fontSize: '12px', color: '#60606a', fontWeight: 600 }}>4 / 4</span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Ready to launch
                </h2>
                <p style={{ fontSize: '13.5px', color: '#9e9ea7', marginBottom: '18px' }}>
                  Review your workspace setup before initializing your private database ledger.
                </p>

                {/* Summary Box from Framer reference */}
                <div
                  style={{
                    background: 'rgba(25, 230, 140, 0.05)',
                    border: '1px solid rgba(25, 230, 140, 0.2)',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '13px' }}>
                    <span style={{ color: '#9e9ea7' }}>Account:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{fullName} ({email})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '13px' }}>
                    <span style={{ color: '#9e9ea7' }}>Profile:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{role}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', fontSize: '13px' }}>
                    <span style={{ color: '#9e9ea7' }}>Categories:</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 500, textAlign: 'right' }}>
                      {categories.slice(0, 3).join(', ')}{categories.length > 3 ? ` +${categories.length - 3} more` : ''}
                    </span>
                  </div>
                </div>

                {/* Terms checkbox */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '12.5px',
                    color: '#9e9ea7',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    style={{ marginTop: '2px', accentColor: 'var(--accent-green)' }}
                  />
                  <span>
                    I confirm my expense data will be stored exclusively in my private PostgreSQL ledger with Row Level Security.
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FramerButton variant="secondary" size="md" onClick={handlePrevStep} icon="none" style={{ flex: '0 0 auto' }}>
                    Back
                  </FramerButton>
                  <FramerButton
                    variant="green"
                    size="md"
                    onClick={handleMultiStepSubmit}
                    disabled={loading || !terms}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {loading ? 'Creating Account...' : 'Complete & Start Tracking'}
                  </FramerButton>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
