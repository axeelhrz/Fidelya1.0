'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { useStyles } from '@/lib/useStyles';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  hover = true,
  children,
  className,
  style,
  ...props
}, ref) => {
  const { theme } = useStyles();

  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: theme.shadows.elevated,
          border: `1px solid ${theme.colors.borderLight}`,
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          border: `1px solid ${theme.colors.borderMedium}`,
          boxShadow: 'none',
        };
      
      case 'glass':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surfaceGlass,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.colors.borderLight}`,
          boxShadow: theme.shadows.card,
        };
      
      default: // default
        return {
          ...baseStyles,
          boxShadow: theme.shadows.card,
          border: `1px solid ${theme.colors.borderLight}`,
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: theme.spacing.sm };
      case 'lg':
        return { padding: theme.spacing.lg };
      default: // md
        return { padding: theme.spacing.md };
    }
  };

  // Generate CSS class name for hover effects
  const getHoverClassName = () => {
    if (!hover) return '';
    return 'card-hover-effect';
  };

  // Combine all style objects
  const cardStyles = {
    ...getVariantStyles(),
    ...getPaddingStyles(),
    ...style,
  };

  // Combine class names
  const combinedClassName = [
    className,
    getHoverClassName()
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* CSS styles for hover effects */}
      <style jsx>{`
        .card-hover-effect:hover {
          transform: translateY(-4px);
          box-shadow: ${theme.shadows.floating};
          border-color: ${variant === 'glass' ? theme.colors.borderMedium : theme.colors.borderPrimary};
        }
        
        .card-hover-effect {
          cursor: pointer;
        }
      `}</style>
      
      <div
        ref={ref}
        {...props}
        style={cardStyles}
        className={combinedClassName}
      >
        {children}
      </div>
    </>
  );
});

Card.displayName = 'Card';

export default Card;