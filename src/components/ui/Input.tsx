'use client';

import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useStyles } from '@/lib/useStyles';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  disabled,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const { theme } = useStyles();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getVariantStyles = () => {
    const baseStyles = {
      fontFamily: theme.fonts.primary,
      transition: theme.animations.transition,
      outline: 'none',
      width: '100%',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surfaceElevated,
          border: `1px solid transparent`,
          borderRadius: theme.borderRadius.lg,
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: `2px solid ${theme.colors.borderMedium}`,
          borderRadius: theme.borderRadius.lg,
        };
      
      default: // default
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.borderLight}`,
          borderRadius: theme.borderRadius.lg,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: LeftIcon || RightIcon ? '0.5rem 2.5rem 0.5rem 0.75rem' : '0.5rem 0.75rem',
          fontSize: '0.75rem',
          minHeight: '2rem',
        };
      
      case 'lg':
        return {
          padding: LeftIcon || RightIcon ? '1rem 3rem 1rem 1.25rem' : '1rem 1.25rem',
          fontSize: '1rem',
          minHeight: '3rem',
        };
      
      default: // md
        return {
          padding: LeftIcon || RightIcon ? '0.75rem 2.75rem 0.75rem 1rem' : '0.75rem 1rem',
          fontSize: '0.875rem',
          minHeight: '2.5rem',
        };
    }
  };

  const getFocusStyles = () => {
    if (!isFocused) return {};
    
    return {
      borderColor: error ? theme.colors.error : theme.colors.primary,
      boxShadow: error 
        ? `0 0 0 3px ${theme.colors.error}20`
        : `0 0 0 3px ${theme.colors.primary}20`,
    };
  };

  const getErrorStyles = () => {
    if (!error) return {};
    
    return {
      borderColor: theme.colors.error,
    };
  };

  const inputStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getFocusStyles(),
    ...getErrorStyles(),
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    color: theme.colors.textPrimary,
    ...style,
  };

  const containerStyles = {
    position: 'relative' as const,
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  };

  const labelStyles = {
    fontSize: '0.875rem',
    fontWeight: theme.fontWeights.medium,
    color: error ? theme.colors.error : theme.colors.textSecondary,
    fontFamily: theme.fonts.primary,
    marginBottom: '0.25rem',
  };

  const helperTextStyles = {
    fontSize: '0.75rem',
    color: error ? theme.colors.error : theme.colors.textTertiary,
    fontFamily: theme.fonts.primary,
    marginTop: '0.25rem',
  };

  const iconStyles = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    color: isFocused ? theme.colors.primary : theme.colors.textTertiary,
    transition: theme.animations.transition,
  };

  const leftIconStyles = {
    ...iconStyles,
    left: size === 'sm' ? '0.5rem' : size === 'lg' ? '0.75rem' : '0.625rem',
  };

  const rightIconStyles = {
    ...iconStyles,
    right: size === 'sm' ? '0.5rem' : size === 'lg' ? '0.75rem' : '0.625rem',
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <motion.label
          style={labelStyles}
          animate={{ color: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textSecondary }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div style={{ position: 'relative', width: '100%' }}>
        {LeftIcon && (
          <LeftIcon
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
            style={leftIconStyles}
          />
        )}
        
        <input
          ref={ref}
          {...props}
          disabled={disabled}
          style={{
            ...inputStyles,
            paddingLeft: LeftIcon ? (size === 'sm' ? '2rem' : size === 'lg' ? '2.5rem' : '2.25rem') : inputStyles.paddingLeft,
            paddingRight: RightIcon ? (size === 'sm' ? '2rem' : size === 'lg' ? '2.5rem' : '2.25rem') : inputStyles.paddingRight,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {RightIcon && (
          <RightIcon
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
            style={rightIconStyles}
          />
        )}
      </div>
      
      {(error || helperText) && (
        <motion.span
          style={helperTextStyles}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error || helperText}
        </motion.span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;