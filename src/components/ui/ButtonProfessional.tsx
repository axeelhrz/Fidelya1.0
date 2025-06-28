'use client';

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useStyles } from '@/lib/useStyles';

interface ButtonProfessionalProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const ButtonProfessional: React.FC<ButtonProfessionalProps> = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  onClick,
  style,
  className,
  ...props
}) => {
  const { theme } = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = () => {
    const baseStyles = {
      fontFamily: theme.fonts.heading,
      fontWeight: theme.fontWeights.semibold,
      textTransform: 'none' as const,
      letterSpacing: '0.025em',
      transition: theme.animations.transition,
      border: 'none',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      position: 'relative' as const,
      overflow: 'hidden',
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
          padding: '0.875rem 2rem',
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
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div
        className="spinner"
        style={{
          width: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.25rem' : '1rem',
          height: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.25rem' : '1rem',
          border: `2px solid ${variant === 'secondary' || variant === 'ghost' ? theme.colors.primary : theme.colors.textInverse}`,
          borderTop: '2px solid transparent',
          borderRadius: '50%',
        }}
      />
    </>
  );

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={buttonStyles}
      className={className}
      onClick={onClick}
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
  );
};

export default ButtonProfessional;
