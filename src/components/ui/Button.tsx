'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary',
    size = 'lg',
    fullWidth = false,
    loading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold rounded-xl
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={isDisabled}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {/* Left Icon or Loading Spinner */}
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : leftIcon ? (
          React.cloneElement(leftIcon as React.ReactElement, { size: 20 })
        ) : null}

        {/* Button Text */}
        <span className="font-semibold tracking-wide uppercase text-sm">
          {loading ? 'Cargando...' : children}
        </span>

        {/* Right Icon */}
        {rightIcon && !loading && (
          React.cloneElement(rightIcon as React.ReactElement, { size: 20 })
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";