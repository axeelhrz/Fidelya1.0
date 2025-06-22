'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'minimal';
  helperText?: string;
}

const styles = {
  container: {
    marginBottom: '1.5rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  label: (isFocused: boolean, error?: string, success?: boolean, disabled?: boolean) => ({
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    marginBottom: '0.5rem',
    color: error ? '#dc2626' : success ? '#059669' : isFocused ? '#4f46e5' : disabled ? '#94a3b8' : '#374151',
    transition: 'color 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  }),
  
  inputContainer: {
    position: 'relative' as const,
  },
  
  input: (isFocused: boolean, error?: string, success?: boolean, hasIcon?: boolean, isPassword?: boolean) => ({
    width: '100%',
    height: '56px',
    padding: hasIcon ? '0 1.25rem 0 3.5rem' : isPassword ? '0 3.5rem 0 1.25rem' : '0 1.25rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1f2937',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${
      error ? '#dc2626' : 
      success ? '#059669' : 
      isFocused ? '#4f46e5' : 
      'rgba(148, 163, 184, 0.3)'
    }`,
    borderRadius: '14px',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    boxShadow: isFocused ? 
      (error ? '0 0 0 4px rgba(220, 38, 38, 0.1)' : 
       success ? '0 0 0 4px rgba(5, 150, 105, 0.1)' : 
       '0 0 0 4px rgba(79, 70, 229, 0.1)') : 
      '0 2px 8px rgba(0, 0, 0, 0.04)',
    fontFamily: 'inherit',
  }),
  
  iconContainer: {
    position: 'absolute' as const,
    left: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    zIndex: 10,
  },
  
  icon: (isFocused: boolean, error?: string, success?: boolean) => ({
    width: '20px',
    height: '20px',
    color: error ? '#dc2626' : success ? '#059669' : isFocused ? '#4f46e5' : '#94a3b8',
    transition: 'color 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  }),
  
  passwordToggle: {
    position: 'absolute' as const,
    right: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    color: '#94a3b8',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statusIcon: {
    position: 'absolute' as const,
    right: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '0.25rem',
  },
  
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginTop: '0.75rem',
    padding: '0 0.25rem',
  },
  
  messageText: (type: 'error' | 'helper' | 'success') => ({
    fontSize: '0.875rem',
    fontWeight: type === 'error' ? '500' : '400',
    color: type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#64748b',
    lineHeight: 1.4,
  }),
  
  messageIcon: {
    marginTop: '0.125rem',
    flexShrink: 0,
  },
};

const hoverStyles = {
  passwordToggle: {
    color: '#64748b',
    background: 'rgba(79, 70, 229, 0.05)',
  },
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    icon, 
    type = 'text',
    size = 'lg',
    variant = 'default',
    helperText,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    const id = useId();
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={styles.container}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            style={styles.label(isFocused, error, success, disabled)}
          >
            {label}
            {props.required && <span style={{ color: '#dc2626', marginLeft: '0.375rem' }}>*</span>}
          </label>
        )}

        {/* Input Container */}
        <div style={styles.inputContainer}>
          {/* Icon */}
          {icon && (
            <div style={styles.iconContainer}>
              <motion.div
                style={styles.icon(isFocused, error, success)}
                animate={{
                  scale: isFocused ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            style={styles.input(isFocused, error, success, !!icon, isPassword)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            disabled={disabled}
            placeholder={props.placeholder}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
              whileHover={hoverStyles.passwordToggle}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              tabIndex={-1}
            >
              <motion.div
                animate={{ rotate: showPassword ? 0 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </motion.div>
            </motion.button>
          )}

          {/* Success/Error Icons */}
          {(success || error) && !isPassword && (
            <div style={styles.statusIcon}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {success ? (
                  <CheckCircle2 size={20} color="#059669" />
                ) : (
                  <AlertCircle size={20} color="#dc2626" />
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={styles.messageContainer}
            >
              <AlertCircle size={16} color="#dc2626" style={styles.messageIcon} />
              <p style={styles.messageText('error')}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        <AnimatePresence>
          {!error && helperText && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={styles.messageContainer}
            >
              <Info size={16} color="#94a3b8" style={styles.messageIcon} />
              <p style={styles.messageText('helper')}>{helperText}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={styles.messageContainer}
            >
              <CheckCircle2 size={16} color="#059669" style={styles.messageIcon} />
              <p style={styles.messageText('success')}>Campo válido</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

Input.displayName = "Input";