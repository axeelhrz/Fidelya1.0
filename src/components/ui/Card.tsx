'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
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
      transition: theme.animations.transition,
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

  const getHoverStyles = () => {
    if (!hover) return {};
    
    return {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows.floating,
      borderColor: variant === 'glass' ? theme.colors.borderMedium : theme.colors.borderPrimary,
    };
  };

  const cardStyles = {
    ...getVariantStyles(),
    ...getPaddingStyles(),
    ...style,
  };

  return (
    <motion.div
      ref={ref}
      {...props}
      style={cardStyles}
      className={className}
      whileHover={hover ? getHoverStyles() : {}}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
