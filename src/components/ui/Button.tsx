'use client';

import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps extends MUIButtonProps {
  gradient?: boolean;
}

const MotionButton = motion(MUIButton);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, gradient, ...props }, ref) => {
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
          transition={{ type: 'spring', stiffness: 500 }}
          {...props}
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
      >
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;