'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface ButtonProfessionalProps extends Omit<ButtonProps, 'color'> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
}

const ButtonProfessional: React.FC<ButtonProfessionalProps> = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  variant = 'primary',
  disabled,
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#2463EB',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1D4ED8',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(36, 99, 235, 0.4)',
          },
        };
      case 'secondary':
        return {
          backgroundColor: '#FFFFFF',
          color: '#1C1E21',
          border: '1px solid #E5E7EB',
          '&:hover': {
            backgroundColor: '#EFF3FB',
            borderColor: '#D1D5DB',
            transform: 'translateY(-2px)',
          },
        };
      case 'success':
        return {
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#059669',
            transform: 'translateY(-2px)',
          },
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#D97706',
            transform: 'translateY(-2px)',
          },
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#DC2626',
            transform: 'translateY(-2px)',
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#2463EB',
          '&:hover': {
            backgroundColor: 'rgba(36, 99, 235, 0.05)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        {...props}
        disabled={disabled || loading}
        onClick={onClick}
        sx={{
          borderRadius: '1rem',
          padding: '0.875rem 2rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          fontFamily: 'var(--font-family-space-grotesk)',
          textTransform: 'none',
          letterSpacing: '0.025em',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: variant === 'primary' ? '0 4px 6px -1px rgba(36, 99, 235, 0.25)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          ...getVariantStyles(),
          '&:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none',
          },
        }}
      >
        <Box className="flex items-center space-x-2">
          {loading && (
            <CircularProgress 
              size={16} 
              sx={{ 
                color: variant === 'secondary' || variant === 'ghost' ? '#2463EB' : '#FFFFFF' 
              }} 
            />
          )}
          {Icon && iconPosition === 'left' && !loading && (
            <Icon className="w-4 h-4" />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && !loading && (
            <Icon className="w-4 h-4" />
          )}
        </Box>
      </Button>
    </motion.div>
  );
};

export default ButtonProfessional;
