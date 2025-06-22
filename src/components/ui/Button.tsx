'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    letterSpacing: '0.025em',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  variants: {
    primary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
      border: '1px solid rgba(79, 70, 229, 0.2)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#374151',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      backdropFilter: 'blur(10px)',
    },
    outline: {
      background: 'transparent',
      color: '#4f46e5',
      border: '1px solid #4f46e5',
    },
    ghost: {
      background: 'transparent',
      color: '#64748b',
      border: '1px solid transparent',
    },
    destructive: {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
      border: '1px solid rgba(220, 38, 38, 0.2)',
    },
    success: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
      border: '1px solid rgba(5, 150, 105, 0.2)',
    },
  },
  
  sizes: {
    sm: {
      height: '36px',
      padding: '0 1rem',
      fontSize: '0.875rem',
      borderRadius: '8px',
    },
    md: {
      height: '44px',
      padding: '0 1.5rem',
      fontSize: '0.875rem',
      borderRadius: '12px',
    },
    lg: {
      height: '56px',
      padding: '0 2rem',
      fontSize: '0.875rem',
      borderRadius: '14px',
    },
    xl: {
      height: '64px',
      padding: '0 2.5rem',
      fontSize: '1rem',
      borderRadius: '16px',
    },
  },
  
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  content: {
    position: 'relative' as const,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  
  shimmer: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.8s ease',
  },
  
  ripple: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: 'inherit',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    transform: 'scale(0)',
    opacity: 0,
  },
};

const hoverStyles = {
  primary: {
    boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
    transform: 'translateY(-1px)',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 1)',
    borderColor: 'rgba(79, 70, 229, 0.3)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-1px)',
  },
  outline: {
    background: '#4f46e5',
    color: '#ffffff',
    boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
  },
  ghost: {
    background: 'rgba(79, 70, 229, 0.05)',
    color: '#4f46e5',
  },
  destructive: {
    boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
    transform: 'translateY(-1px)',
  },
  success: {
    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
    transform: 'translateY(-1px)',
  },
};

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
    style,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const buttonStyle = {
      ...styles.base,
      ...styles.variants[variant],
      ...styles.sizes[size],
      ...(fullWidth ? styles.fullWidth : {}),
      ...(isDisabled ? styles.disabled : {}),
      ...style,
    };

    return (
      <motion.button
        ref={ref}
        style={buttonStyle}
        disabled={isDisabled}
        whileHover={!isDisabled ? hoverStyles[variant] : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            const shimmer = e.currentTarget.querySelector('.shimmer') as HTMLElement;
            if (shimmer) shimmer.style.transform = 'translateX(100%)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            const shimmer = e.currentTarget.querySelector('.shimmer') as HTMLElement;
            if (shimmer) shimmer.style.transform = 'translateX(-100%)';
          }
        }}
        {...props}
      >
        {/* Shimmer Effect */}
        <div className="shimmer" style={styles.shimmer} />

        {/* Content */}
        <div style={styles.content}>
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
                <Loader2 
                  size={20} 
                  style={{ 
                    animation: 'spin 1s linear infinite',
                  }} 
                />
              </motion.div>
            ) : leftIcon ? (
              <motion.div
                key="left-icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {leftIcon}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Button Text */}
          <motion.span
            animate={{
              opacity: loading ? 0.7 : 1
            }}
            transition={{ duration: 0.2 }}
            style={{ 
              fontWeight: '600', 
              letterSpacing: '0.025em',
              textTransform: 'uppercase' as const,
              fontSize: 'inherit',
            }}
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
                style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {rightIcon}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ripple Effect */}
        <motion.div
          style={styles.ripple}
          initial={false}
          whileTap={{
            scale: [0, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: 0.4 }}
        />

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.button>
    );
  }
);

Button.displayName = "Button";