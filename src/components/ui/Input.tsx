'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
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

const inputVariants = {
  default: {
    base: "bg-white border-2 border-gray-200 focus:border-primary-500 focus:bg-white",
    error: "border-error-500 focus:border-error-500 bg-error-50/50",
    success: "border-success-500 focus:border-success-500 bg-success-50/50"
  },
  filled: {
    base: "bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white",
    error: "bg-error-50 border-error-500 focus:border-error-500",
    success: "bg-success-50 border-success-500 focus:border-success-500"
  },
  minimal: {
    base: "bg-transparent border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-none",
    error: "border-error-500 focus:border-error-500",
    success: "border-success-500 focus:border-success-500"
  }
};

const sizeVariants = {
  sm: "h-10 px-3 text-sm",
  md: "h-12 px-4 text-base",
  lg: "h-14 px-5 text-lg"
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    icon, 
    type = 'text',
    size = 'md',
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

    const getVariantClasses = () => {
      const variantClass = inputVariants[variant];
      if (error) return variantClass.error;
      if (success) return variantClass.success;
      return variantClass.base;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={id}
            className={cn(
              "block text-sm font-semibold tracking-tight transition-colors duration-200",
              error ? "text-error-700" : success ? "text-success-700" : "text-gray-700",
              disabled && "text-gray-400"
            )}
            animate={{
              color: isFocused 
                ? error ? 'var(--error-700)' : success ? 'var(--success-700)' : 'var(--primary-700)'
                : error ? 'var(--error-700)' : success ? 'var(--success-700)' : 'var(--gray-700)'
            }}
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative group">
          {/* Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
              <motion.div
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  error ? "text-error-500" : success ? "text-success-500" : "text-gray-400",
                  isFocused && !error && !success && "text-primary-600"
                )}
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  color: isFocused 
                    ? error ? 'var(--error-500)' : success ? 'var(--success-500)' : 'var(--primary-600)'
                    : error ? 'var(--error-500)' : success ? 'var(--success-500)' : 'var(--gray-400)'
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
            className={cn(
              // Base styles
              "w-full rounded-xl font-medium transition-all duration-200 ease-out",
              "placeholder:text-gray-400 placeholder:font-normal",
              "focus:outline-none focus:ring-4 focus:ring-primary-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
              
              // Size variants
              sizeVariants[size],
              
              // Variant styles
              getVariantClasses(),
              
              // Icon padding
              icon && "pl-12",
              isPassword && "pr-12",
              
              // Custom className
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              tabIndex={-1}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </motion.div>
            </button>
          )}

          {/* Success/Error Icons */}
          {(success || error) && !isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {success ? (
                  <Check className="w-5 h-5 text-success-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-error-500" />
                )}
              </motion.div>
            </div>
          )}

          {/* Focus Ring Effect */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200",
              "bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10",
              variant === 'minimal' && "rounded-none"
            )}
            animate={{
              opacity: isFocused && !error && !success ? 1 : 0
            }}
          />

          {/* Floating Label Effect (for minimal variant) */}
          {variant === 'minimal' && label && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: isFocused ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence mode="wait">
          {(error || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start space-x-2"
            >
              {error && (
                <>
                  <AlertCircle className="w-4 h-4 text-error-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-error-600 leading-tight">
                    {error}
                  </p>
                </>
              )}
              {!error && helperText && (
                <p className="text-sm text-gray-500 leading-tight ml-6">
                  {helperText}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4 text-success-500" />
              <p className="text-sm font-medium text-success-600">
                Campo válido
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

Input.displayName = "Input";