import React from 'react';
import FramerAuthModal from '../framer/FramerAuthModal';

/**
 * AuthModal
 * Powered by Framer MultiStepWaitlistForm adapted for Supabase
 */
export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  onSuccess,
  initialMode = 'login',
}) {
  return (
    <FramerAuthModal
      isOpen={isOpen}
      onClose={onClose}
      onAuthSuccess={onAuthSuccess}
      onSuccess={onSuccess || onAuthSuccess}
      initialMode={initialMode}
    />
  );
}
