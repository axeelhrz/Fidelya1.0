'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-primary-600 to-primary-700 text-white",
          "hover:from-primary-700 hover:to-primary-800",
          "focus-visible:ring-primary-500/30",
          "shadow-lg hover:shadow-xl",
          "border border-primary-600/20"
        ],
        secondary: [
          "bg-white text-gray-900 border-2 border-gray-200",
          "hover:bg-gray-50 hover:border-gray-300",
          "focus-visible:ring-gray-500/30",
          "shadow-sm hover:shadow-md"
        ],
        outline: [
          "bg-transparent text-primary-700 border-2 border-primary-200",
          "hover:bg-primary-50 hover:border-primary-300",
          "focus-visible:ring-primary-500/30"
        ],
        ghost: [
          "bg-transparent text-gray-700",
          "hover:bg-gray-100 hover:text-gray-900",
          "focus-visible:ring-gray-500/30"
        ],
        destructive: [
          "bg-gradient-to-r from-error-600 to-error-700 text-white",
          "hover:from-error-700 hover:to-error-800",
          "focus-visible:ring-error-500/30",
          "shadow-lg hover:shadow-xl"
        ],
        success: [
          "bg-gradient-to-r from-success-600 to-success-700 text-white",
          "hover:from-success-700 hover:to-success-800",
          "focus-visible:ring-success-500/30",
          "shadow-lg hover:shadow-xl"
        ]
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-sm rounded-xl",
        lg: "h-13 px-8 text-base rounded-xl",
        xl: "h-15 px-10 text-lg rounded-2xl"
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false
    }
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
        
        {/* Glow Effect for Primary Variant */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 scale-110" />
        )}

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center space-x-2">
          {/* Left Icon or Loading Spinner */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
              </motion.div>
            ) : leftIcon ? (
              <motion.div
                key="left-icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="w-4 h-4"
              >
                {leftIcon}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Button Text */}
          <motion.span
            className="font-semibold tracking-wide uppercase text-sm"
            animate={{
              opacity: loading ? 0.7 : 1
            }}
            transition={{ duration: 0.15 }}
          >
            {loading ? 'Cargando...' : children}
          </motion.span>

          {/* Right Icon */}
          <AnimatePresence>
            {rightIcon && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="w-4 h-4"
              >
                {rightIcon}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={false}
          whileTap={{
            background: [
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(255,255,255,0) 0%, transparent 70%)"
            ]
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.button>
    );
  }
);

Button.displayName = "Button";