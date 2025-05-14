'use client';

import { Button as MUIButton, ButtonProps as MUIButtonProps, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import Link from 'next/link';

interface ButtonProps extends Omit<MUIButtonProps, 'href'> {
  gradient?: boolean;
  href?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  pulse?: boolean;
}

const MotionButton = motion(MUIButton);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    gradient, 
    href, 
    loading, 
    icon, 
    iconPosition = 'start', 
    pulse,
    disabled,
    ...props 
  }, ref) => {
    const buttonContent = (
      <>
        {loading && (
          <CircularProgress
            size={20}
            color="inherit"
            sx={{ mr: 1, position: 'relative' }}
          />
        )}
        {icon && iconPosition === 'start' && !loading && (
          <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
          {children}
        {icon && iconPosition === 'end' && (
          <span style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
      </>
    );
    
    const buttonProps = {
      ref,
      disabled: disabled || loading,
      ...props,
      sx: {
        position: 'relative',
        overflow: 'hidden',
        ...(gradient && {
          background: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(90deg, #19C055 0%, #E62E5C 100%)',
          },
        }),
        ...(pulse && {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '100px',
            animation: 'pulse 2s infinite',
          },
        }),
        ...props.sx,
      },
      whileHover: { y: -2 },
      transition: { type: 'spring', stiffness: 500 },
    };

    if (href) {
      return (
        <Link href={href} style={{ textDecoration: 'none' }}>
          <MotionButton {...buttonProps}>
            {buttonContent}
      </MotionButton>
        </Link>
    );
  }

    return (
      <MotionButton {...buttonProps}>
        {buttonContent}
      </MotionButton>
);
  }
);

Button.displayName = 'Button';

export default Button;