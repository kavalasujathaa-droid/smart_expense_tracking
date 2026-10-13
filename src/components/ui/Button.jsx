import React from 'react';
import FramerButton from '../framer/FramerButton';

/**
 * Universal Button Component
 * Re-exports FramerButton with backwards-compatible icon and variant mapping.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  style = {},
  ...props
}) {
  return (
    <FramerButton
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
      icon={Icon ? 'none' : 'none'}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} style={{ marginRight: '6px', flexShrink: 0 }} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} style={{ marginLeft: '6px', flexShrink: 0 }} />}
    </FramerButton>
  );
}
