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

    // Estilos premium integrados
    const inputStyles = {
      base: "w-full font-medium transition-all duration-300 ease-out placeholder:text-slate-400 placeholder:font-normal focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "h-10 px-4 text-sm rounded-xl",
        md: "h-12 px-4 text-base rounded-xl", 
        lg: "h-14 px-5 text-base rounded-2xl"
      },
      variants: {
        default: {
          normal: "bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm hover:shadow-md focus:shadow-lg",
          error: "bg-red-50/50 border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 shadow-sm",
          success: "bg-emerald-50/50 border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
        }
      }
    };

    const getInputClasses = () => {
      const baseClasses = inputStyles.base;
      const sizeClasses = inputStyles.sizes[size];
      
      let variantClasses = inputStyles.variants.default.normal;
      if (error) variantClasses = inputStyles.variants.default.error;
      if (success && !error) variantClasses = inputStyles.variants.default.success;
      
      const iconPadding = icon ? (size === 'lg' ? 'pl-14' : 'pl-12') : '';
      const passwordPadding = isPassword ? (size === 'lg' ? 'pr-14' : 'pr-12') : '';
      
      return cn(baseClasses, sizeClasses, variantClasses, iconPadding, passwordPadding, className);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        {/* Label premium */}
        {label && (
          <motion.label
            htmlFor={id}
            className={cn(
              "block text-sm font-semibold tracking-tight transition-colors duration-300",
              error ? "text-red-700" : success ? "text-emerald-700" : "text-slate-700",
              disabled && "text-slate-400",
              isFocused && !error && !success && "text-indigo-700"
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1.5">*</span>}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative group">
          {/* Icon premium */}
          {icon && (
            <div className={cn(
              "absolute inset-y-0 left-0 flex items-center pointer-events-none z-10",
              size === 'lg' ? 'pl-5' : 'pl-4'
            )}>
              <motion.div
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  error ? "text-red-500" : success ? "text-emerald-500" : "text-slate-400",
                  isFocused && !error && !success && "text-indigo-600"
                )}
                animate={{
                  scale: isFocused ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            </div>
          )}

          {/* Input premium */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={getInputClasses()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />

          {/* Password Toggle premium */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute inset-y-0 right-0 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-300 focus:outline-none",
                size === 'lg' ? 'pr-5' : 'pr-4'
              )}
              tabIndex={-1}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </motion.div>
            </button>
          )}

          {/* Success/Error Icons premium */}
          {(success || error) && !isPassword && (
            <div className={cn(
              "absolute inset-y-0 right-0 flex items-center",
              size === 'lg' ? 'pr-5' : 'pr-4'
            )}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-1"
              >
                {success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </motion.div>
            </div>
          )}

          {/* Focus Ring Effect premium */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              opacity: isFocused && !error && !success ? 1 : 0,
              scale: isFocused ? 1.02 : 1
            }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.05), transparent, rgba(79, 70, 229, 0.05))'
            }}
          />
        </div>

        {/* Messages premium */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start space-x-3 px-1"
            >
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-red-600 leading-tight">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text premium */}
        <AnimatePresence>
          {!error && helperText && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center space-x-3 px-1"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-500 leading-tight">
                {helperText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message premium */}
        <AnimatePresence>
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center space-x-3 px-1"
            >
              <CheckCircle2 className="w-4 h-5 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-600">
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