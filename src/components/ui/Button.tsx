'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary',
    size = 'lg',
    fullWidth = false,
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    // Estilos premium integrados
    const buttonStyles = {
      base: "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group uppercase text-sm",
      
      variants: {
        primary: "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:ring-indigo-500/30 border border-indigo-500/20",
        
        secondary: "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md focus-visible:ring-slate-500/30",
        
        outline: "bg-transparent hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border-2 border-indigo-200 hover:border-indigo-300 focus-visible:ring-indigo-500/30",
        
        ghost: "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus-visible:ring-slate-500/30",
        
        destructive: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 focus-visible:ring-red-500/30",
        
        success: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:ring-emerald-500/30"
      },
      
      sizes: {
        sm: "h-9 px-4 text-xs rounded-lg",
        md: "h-11 px-6 text-sm rounded-xl",
        lg: "h-14 px-8 text-sm rounded-2xl",
        xl: "h-16 px-10 text-base rounded-2xl"
      },
      
      width: {
        auto: "w-auto",
        full: "w-full"
      }
    };

    const getButtonClasses = () => {
      return cn(
        buttonStyles.base,
        buttonStyles.variants[variant],
        buttonStyles.sizes[size],
        fullWidth ? buttonStyles.width.full : buttonStyles.width.auto,
        className
      );
    };

    return (
      <motion.button
        ref={ref}
        className={getButtonClasses()}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {/* Shimmer Effect premium */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        
        {/* Glow Effect para Primary Variant */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 scale-110" />
        )}

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center space-x-3">
          {/* Left Icon or Loading Spinner */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            ) : leftIcon ? (
              <motion.div
                key="left-icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5"
              >
                {leftIcon}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Button Text */}
          <motion.span
            className="font-semibold tracking-wide uppercase"
            animate={{
              opacity: loading ? 0.7 : 1
            }}
            transition={{ duration: 0.2 }}
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
                transition={{ duration: 0.2 }}
                className="w-5 h-5"
              >
                {rightIcon}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
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