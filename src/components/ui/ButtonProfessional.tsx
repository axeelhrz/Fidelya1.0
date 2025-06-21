'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

  const getHoverStyles = () => {
    if (disabled || loading) return {};

    switch (variant) {
      case 'primary':
        return {
          filter: 'brightness(1.05)',
          boxShadow: theme.shadows.glowStrong,
          transform: 'translateY(-2px)',
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderMedium,
          transform: 'translateY(-2px)',
        };
      case 'success':
      case 'warning':
      case 'error':
        return {
          filter: 'brightness(1.05)',
          transform: 'translateY(-2px)',
        };
      case 'ghost':
        return {
          backgroundColor: `${theme.colors.primary}08`,
        };
      default:
        return {};
    }
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
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
    <motion.button
      {...props}
      disabled={disabled || loading}
      style={buttonStyles}
      className={className}
      onClick={onClick}
      whileHover={disabled || loading ? {} : getHoverStyles()}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {loading && <LoadingSpinner />}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      )}
    </motion.button>
  );
};

export default ButtonProfessional;