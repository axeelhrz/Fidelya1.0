'use client';

import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

// Import the proper color type from MUI
import { ButtonPropsColorOverrides } from '@mui/material/Button';
import { OverridableStringUnion } from '@mui/types';

// Define the allowed color values explicitly
type MUIButtonColor = OverridableStringUnion<
  'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  ButtonPropsColorOverrides
>;

interface ButtonProps extends Omit<MUIButtonProps, keyof HTMLMotionProps<'button'>> {
  gradient?: boolean;
  motionProps?: HTMLMotionProps<'button'>;
  children?: React.ReactNode;
  color?: MUIButtonColor;
}

const MotionButton = motion(MUIButton);
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, gradient, motionProps, color, ...props }, ref) => {
    // No need to create a separate object with excluded props
    if (gradient) {
      return (
        <MotionButton
          ref={ref}
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(90deg, #19C055 0%, #E62E5C 100%)',
            },
          }}
          whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(255, 51, 102, 0.3)' }}
          {...props}
          {...motionProps}
          color={color}
        >
          {children}
        </MotionButton>
      );
    }
    
    return (
      <MotionButton
        ref={ref}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 500 }}
        {...props}
        {...motionProps}
        color={color}
      >
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;