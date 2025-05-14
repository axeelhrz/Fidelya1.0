'use client';

import { Button as MUIButton, ButtonProps as MUIButtonProps, CircularProgress } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { motion, HTMLMotionProps } from 'framer-motion';
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

// Define valid MUI button colors

// Create a properly typed motion button using forwardRef
const MotionButton = motion(MUIButton);
// Type for combined props - define a proper intersection type that avoids conflicts
type MotionButtonProps = Omit<MUIButtonProps, keyof HTMLMotionProps<"button"> | 'component' | 'onDrag'> & 
  Omit<HTMLMotionProps<"button">, keyof MUIButtonProps> & { 
    component?: React.ElementType; 
    sx?: SxProps<Theme>;
    ref?: React.Ref<HTMLButtonElement>;
    disabled?: boolean;
  };

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
  const buttonStyleProps: MotionButtonProps = {
    ref: ref,
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
  };

  // Combine props safely with proper typing
  const combinedProps: MotionButtonProps = buttonStyleProps;
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        <MotionButton {...combinedProps}>
          {buttonContent}
        </MotionButton>
      </Link>
    );
  }

  return (
    <MotionButton {...combinedProps}>
      {buttonContent}
    </MotionButton>
  );
}
);

Button.displayName = 'Button';

export default Button;