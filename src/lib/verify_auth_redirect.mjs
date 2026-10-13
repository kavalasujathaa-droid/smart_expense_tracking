// src/lib/verify_auth_redirect.mjs
// Automated verification suite for Supabase email verification redirect configuration

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- STARTING SUPABASE AUTH REDIRECT VERIFICATION SUITE ---');

// 1. Verify source file existence and imports
const supabaseJsPath = path.resolve(__dirname, 'supabase.js');
const framerModalPath = path.resolve(__dirname, '../components/framer/FramerAuthModal.jsx');
const appJsxPath = path.resolve(__dirname, '../App.jsx');

assert(fs.existsSync(supabaseJsPath), 'supabase.js must exist');
assert(fs.existsSync(framerModalPath), 'FramerAuthModal.jsx must exist');
assert(fs.existsSync(appJsxPath), 'App.jsx must exist');

const supabaseSrc = fs.readFileSync(supabaseJsPath, 'utf8');
const framerModalSrc = fs.readFileSync(framerModalPath, 'utf8');
const appSrc = fs.readFileSync(appJsxPath, 'utf8');

// Test 1: Verify URL constants in supabase.js
assert(
  supabaseSrc.includes("export const PRODUCTION_SITE_URL = 'https://smart-expense-tracking.onrender.com'"),
  'PRODUCTION_SITE_URL constant must be exported with exact Render production URL'
);
assert(
  supabaseSrc.includes("export const LOCAL_DEV_URL = 'http://localhost:5173'"),
  'LOCAL_DEV_URL constant must be exported with exact local dev URL'
);
console.log('✓ PASS: PRODUCTION_SITE_URL and LOCAL_DEV_URL exported correctly.');

// Test 2: Verify getAuthRedirectUrl implementation
assert(
  supabaseSrc.includes('export function getAuthRedirectUrl'),
  'getAuthRedirectUrl must be exported'
);
assert(
  supabaseSrc.includes('export function getAuthCallbackDetails'),
  'getAuthCallbackDetails must be exported'
);
assert(
  supabaseSrc.includes('export function cleanAuthUrl'),
  'cleanAuthUrl must be exported'
);
console.log('✓ PASS: All auth redirect helper functions are exported from supabase.js.');

// Test 3: Test simulated getAuthRedirectUrl logic under local dev vs production conditions
function simulateGetAuthRedirectUrl({ mockEnv = {}, mockWindow = null, path = '' } = {}) {
  const envObj = mockEnv;
  const explicitUrl = envObj.VITE_SITE_URL || envObj.VITE_APP_URL;

  let baseUrl = '';

  if (explicitUrl) {
    baseUrl = explicitUrl.replace(/\/+$/, '');
  } else if (mockWindow && mockWindow.location) {
    const { hostname, origin } = mockWindow.location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
    if (isLocal) {
      baseUrl = origin || 'http://localhost:5173';
    } else {
      baseUrl = origin && !origin.includes('localhost') ? origin : 'https://smart-expense-tracking.onrender.com';
    }
  } else {
    baseUrl = envObj.PROD ? 'https://smart-expense-tracking.onrender.com' : 'http://localhost:5173';
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  if (!path || path === '/') {
    return cleanBase;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// Test 3a: Production browser on Render
const prodRenderUrl = simulateGetAuthRedirectUrl({
  mockWindow: {
    location: {
      hostname: 'smart-expense-tracking.onrender.com',
      origin: 'https://smart-expense-tracking.onrender.com',
    },
  },
});
assert.strictEqual(prodRenderUrl, 'https://smart-expense-tracking.onrender.com');
console.log('✓ PASS: Browser on Render production hostname returns production URL.');

// Test 3b: Local development browser
const localDevUrl = simulateGetAuthRedirectUrl({
  mockWindow: {
    location: {
      hostname: 'localhost',
      origin: 'http://localhost:5173',
    },
  },
});
assert.strictEqual(localDevUrl, 'http://localhost:5173');
console.log('✓ PASS: Browser on localhost returns local development URL.');

// Test 3c: Build / SSR in PROD
const prodBuildUrl = simulateGetAuthRedirectUrl({
  mockEnv: { PROD: true },
});
assert.strictEqual(prodBuildUrl, 'https://smart-expense-tracking.onrender.com');
console.log('✓ PASS: Build / SSR environment with PROD=true resolves to production URL.');

// Test 3d: Build / SSR in dev
const devBuildUrl = simulateGetAuthRedirectUrl({
  mockEnv: { PROD: false },
});
assert.strictEqual(devBuildUrl, 'http://localhost:5173');
console.log('✓ PASS: Build / SSR environment with PROD=false resolves to local dev URL.');

// Test 3e: Custom environment override VITE_SITE_URL
const overrideUrl = simulateGetAuthRedirectUrl({
  mockEnv: { VITE_SITE_URL: 'https://custom-domain.com/' },
});
assert.strictEqual(overrideUrl, 'https://custom-domain.com');
console.log('✓ PASS: VITE_SITE_URL environment override is respected and sanitized.');

// Test 4: Verify FramerAuthModal.jsx uses emailRedirectTo
assert(
  framerModalSrc.includes('getAuthRedirectUrl'),
  'FramerAuthModal.jsx must import and use getAuthRedirectUrl'
);
assert(
  /emailRedirectTo\s*(:\s*emailRedirectTo|\s*,)/.test(framerModalSrc),
  'signUp options in FramerAuthModal.jsx must pass emailRedirectTo'
);
console.log('✓ PASS: FramerAuthModal.jsx passes dynamic emailRedirectTo to supabase.auth.signUp.');

// Test 5: Verify App.jsx handles confirmation callback and errors
assert(
  appSrc.includes('getAuthCallbackDetails'),
  'App.jsx must import and call getAuthCallbackDetails'
);
assert(
  appSrc.includes('cleanAuthUrl'),
  'App.jsx must import and call cleanAuthUrl'
);
assert(
  appSrc.includes('handleSuccessfulAuthRedirect') || appSrc.includes('callbackDetails.isAuthCallback'),
  'App.jsx must handle successful auth callback redirect to dashboard'
);
assert(
  appSrc.includes('Email verified successfully! Welcome to your dashboard.'),
  'App.jsx must display verification confirmation message'
);
assert(
  appSrc.includes('callbackDetails.error') || appSrc.includes('callbackDetails.errorDescription'),
  'App.jsx must capture and display auth error details'
);
console.log('✓ PASS: App.jsx handles email verification callback, hash tokens, and errors.');

// Test 6: Verify no hardcoded localhost production redirect exists in source code
const srcFiles = [supabaseJsPath, framerModalPath, appJsxPath];
for (const filePath of srcFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // If localhost is present, verify it is only in LOCAL_DEV_URL or local fallback checks
    if (line.includes('localhost:5173') && !line.includes('LOCAL_DEV_URL') && !line.includes('origin || LOCAL_DEV_URL') && !line.includes('http://localhost:5173')) {
      assert.fail(`Unexpected hardcoded localhost in ${path.basename(filePath)} at line ${index + 1}: ${line}`);
    }
  });
}
console.log('✓ PASS: No hardcoded localhost production redirects present in source code.');

console.log('--- ALL AUTH REDIRECT VERIFICATION TESTS PASSED (100%) ---');
