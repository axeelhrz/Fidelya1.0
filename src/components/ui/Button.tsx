'use client';

import React, { forwardRef, ButtonHTMLAttributes, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useStyles } from '@/lib/useStyles';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  style,
  ...props
}, ref) => {
  const { theme } = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = () => {
    const baseStyles = {
      border: 'none',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      fontFamily: theme.fonts.heading,
      fontWeight: theme.fontWeights.semibold,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: theme.animations.transition,
      outline: 'none',
      position: 'relative' as const,
      overflow: 'hidden',
      letterSpacing: '0.025em',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: theme.gradients.primary,
          color: theme.colors.textInverse,
          boxShadow: theme.shadows.glow,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          color: theme.colors.textPrimary,
          border: `1px solid ${theme.colors.borderLight}`,
          boxShadow: theme.shadows.card,
        };
      case 'success':
        return {
          ...baseStyles,
          background: theme.gradients.success,
          color: theme.colors.textInverse,
          boxShadow: `0 4px 6px -1px rgba(16, 185, 129, 0.25)`,
        };
      case 'warning':
        return {
          ...baseStyles,
          background: theme.gradients.warning,
          color: theme.colors.textInverse,
          boxShadow: `0 4px 6px -1px rgba(245, 158, 11, 0.25)`,
        };
      case 'error':
        return {
          ...baseStyles,
          background: theme.gradients.error,
          color: theme.colors.textInverse,
          boxShadow: `0 4px 6px -1px rgba(239, 68, 68, 0.25)`,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: 'none',
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.primary}`,
        };
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.75rem',
          borderRadius: theme.borderRadius.md,
          minHeight: '2rem',
        };
      case 'lg':
        return {
          padding: '1rem 2.5rem',
          fontSize: '1rem',
          borderRadius: theme.borderRadius.xl,
          minHeight: '3rem',
        };
      default: // md
        return {
          padding: '0.75rem 2rem',
          fontSize: '0.875rem',
          borderRadius: theme.borderRadius.lg,
          minHeight: '2.5rem',
        };
    }
  };

  const getInteractionStyles = () => {
    if (disabled || loading) return {};

    let styles = {};

    if (isPressed) {
      styles = { ...styles, transform: 'scale(0.98)' };
    } else if (isHovered) {
      switch (variant) {
        case 'primary':
          styles = {
            ...styles,
            filter: 'brightness(1.05)',
            boxShadow: theme.shadows.glowStrong,
            transform: 'translateY(-2px)',
          };
          break;
        case 'secondary':
          styles = {
            ...styles,
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderMedium,
            transform: 'translateY(-2px)',
          };
          break;
        case 'success':
        case 'warning':
        case 'error':
          styles = {
            ...styles,
            filter: 'brightness(1.05)',
            transform: 'translateY(-2px)',
          };
          break;
        case 'ghost':
        case 'outline':
          styles = {
            ...styles,
            backgroundColor: `${theme.colors.primary}08`,
          };
          break;
      }
    }

    return styles;
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getInteractionStyles(),
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    ...style,
  };

  const LoadingSpinner = () => (
    <div
      style={{
        width: '1rem',
        height: '1rem',
        border: `2px solid ${variant === 'secondary' || variant === 'ghost' || variant === 'outline' ? theme.colors.primary : theme.colors.textInverse}`,
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <button
        ref={ref}
        {...props}
        disabled={disabled || loading}
        style={buttonStyles}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {loading && <LoadingSpinner />}
        {Icon && iconPosition === 'left' && !loading && (
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        )}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && !loading && (
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        )}
      </button>
    </>
  );
});

Button.displayName = 'Button';

export default Button;