// src/lib/supabase.js
// Supabase Client Initialization & Security Layer
import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env) || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
// Support VITE_SUPABASE_PUBLISHABLE_KEY with fallback to VITE_SUPABASE_ANON_KEY
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder')
);

// Create client only if configuration is present, or a dummy client that throws clean errors
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Canonical site origins
export const PRODUCTION_SITE_URL = 'https://smart-expense-tracking.onrender.com';
export const LOCAL_DEV_URL = 'http://localhost:5173';

/**
 * Resolves the environment-appropriate Supabase auth redirect URL.
 * - Production: https://smart-expense-tracking.onrender.com
 * - Local development: http://localhost:5173
 * - Supports VITE_SITE_URL or VITE_APP_URL environment variable override if provided
 *
 * @param {string} [path=''] - Optional sub-path to append (e.g. '/dashboard')
 * @returns {string} The fully qualified redirect URL
 */
export function getAuthRedirectUrl(path = '') {
  const envObj = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env) || {};
  const explicitUrl = envObj.VITE_SITE_URL || envObj.VITE_APP_URL;

  let baseUrl = '';

  if (explicitUrl) {
    baseUrl = explicitUrl.replace(/\/+$/, '');
  } else if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
    if (isLocal) {
      baseUrl = origin || LOCAL_DEV_URL;
    } else {
      baseUrl = origin && !origin.includes('localhost') ? origin : PRODUCTION_SITE_URL;
    }
  } else {
    // Build/SSR context
    baseUrl = envObj.PROD ? PRODUCTION_SITE_URL : LOCAL_DEV_URL;
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  if (!path || path === '/') {
    return cleanBase;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Inspects URL hash and search params for Supabase auth tokens or errors.
 *
 * @returns {{
 *   isAuthCallback: boolean,
 *   type: string | null,
 *   hasAccessToken: boolean,
 *   hasCode: boolean,
 *   error: string | null,
 *   errorCode: string | null,
 *   errorDescription: string | null
 * }}
 */
export function getAuthCallbackDetails() {
  if (typeof window === 'undefined') {
    return {
      isAuthCallback: false,
      type: null,
      hasAccessToken: false,
      hasCode: false,
      error: null,
      errorCode: null,
      errorDescription: null,
    };
  }

  let hashParams = null;
  if (window.location.hash && window.location.hash.length > 1) {
    try {
      hashParams = new URLSearchParams(window.location.hash.substring(1));
    } catch {
      hashParams = null;
    }
  }

  let searchParams = null;
  if (window.location.search && window.location.search.length > 1) {
    try {
      searchParams = new URLSearchParams(window.location.search);
    } catch {
      searchParams = null;
    }
  }

  const getParam = (key) => hashParams?.get(key) || searchParams?.get(key) || null;

  const error = getParam('error');
  const errorCode = getParam('error_code');
  const rawDesc = getParam('error_description');
  const errorDescription = rawDesc ? decodeURIComponent(rawDesc.replace(/\+/g, ' ')) : null;

  const type = getParam('type');
  const accessToken = getParam('access_token');
  const code = getParam('code');

  const hasAccessToken = Boolean(accessToken);
  const hasCode = Boolean(code);
  const isAuthCallback = Boolean(
    hasAccessToken ||
    hasCode ||
    type === 'signup' ||
    type === 'recovery' ||
    type === 'email_change' ||
    type === 'magiclink' ||
    error ||
    errorCode ||
    errorDescription
  );

  return {
    isAuthCallback,
    type,
    hasAccessToken,
    hasCode,
    error,
    errorCode,
    errorDescription,
  };
}

/**
 * Clears URL hash/tokens from the address bar without triggering a reload,
 * preventing security token exposure in browser history or address bar.
 *
 * @param {string} [targetPath='/dashboard']
 */
export function cleanAuthUrl(targetPath = '/dashboard') {
  if (typeof window !== 'undefined' && window.history?.replaceState) {
    const stateObj = { view: targetPath === '/dashboard' ? 'dashboard' : 'landing' };
    window.history.replaceState(stateObj, '', targetPath);
  }
}
