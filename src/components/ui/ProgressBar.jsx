import React from 'react';

export default function ProgressBar({
  percentage = 0,
  variant = 'emerald',
  height = 8,
  className = '',
}) {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  // If variant not explicitly forced, infer from percentage
  let resolvedVariant = variant;
  if (variant === 'auto') {
    if (clamped >= 90) resolvedVariant = 'rose';
    else if (clamped >= 75) resolvedVariant = 'amber';
    else resolvedVariant = 'emerald';
  }

  return (
    <div
      className={`progress-container ${className}`.trim()}
      style={{ height: `${height}px` }}
    >
      <div
        className={`progress-bar ${resolvedVariant}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
