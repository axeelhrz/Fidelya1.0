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
    base: "bg-white border border-gray-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50"
  },
  filled: {
    base: "bg-gray-50 border border-transparent focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/20",
    error: "bg-red-50 border-red-500 focus:border-red-500 focus:ring-red-500/20",
    success: "bg-green-50 border-green-500 focus:border-green-500 focus:ring-green-500/20"
  },
  minimal: {
    base: "bg-transparent border-0 border-b-2 border-gray-300 focus:border-indigo-600 rounded-none focus:ring-0",
    error: "border-red-500 focus:border-red-500",
    success: "border-green-500 focus:border-green-500"
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
        {/* Label con tipografía mejorada */}
        {label && (
          <motion.label
            htmlFor={id}
            className={cn(
              "block text-sm font-semibold tracking-tight transition-colors duration-200",
              error ? "text-red-700" : success ? "text-green-700" : "text-gray-700",
              disabled && "text-gray-400"
            )}
            animate={{
              color: isFocused 
                ? error ? 'rgb(185, 28, 28)' : success ? 'rgb(4, 120, 87)' : 'rgb(79, 70, 229)'
                : error ? 'rgb(185, 28, 28)' : success ? 'rgb(4, 120, 87)' : 'rgb(55, 65, 81)'
            }}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative group">
          {/* Icon con animación mejorada */}
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
              <motion.div
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  error ? "text-red-500" : success ? "text-green-500" : "text-gray-400",
                  isFocused && !error && !success && "text-indigo-600"
                )}
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  color: isFocused 
                    ? error ? 'rgb(239, 68, 68)' : success ? 'rgb(16, 185, 129)' : 'rgb(79, 70, 229)'
                    : error ? 'rgb(239, 68, 68)' : success ? 'rgb(16, 185, 129)' : 'rgb(156, 163, 175)'
                }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            </div>
          )}

          {/* Input con estilos específicos */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              // Base styles con tipografía Inter
              "w-full rounded-xl font-medium transition-all duration-200 ease-out",
              "placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm",
              "focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
              
              // Size variants
              sizeVariants[size],
              
              // Variant styles específicos
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

          {/* Password Toggle mejorado */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              tabIndex={-1}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
                className="p-1"
              >
                {success ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </motion.div>
            </div>
          )}

          {/* Focus Ring Effect suave */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200",
              "bg-gradient-to-r from-indigo-500/5 via-transparent to-indigo-500/5",
              variant === 'minimal' && "rounded-none"
            )}
            animate={{
              opacity: isFocused && !error && !success ? 1 : 0
            }}
          />

          {/* Floating Label Effect (for minimal variant) */}
          {variant === 'minimal' && label && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-700"
              initial={{ width: 0 }}
              animate={{ width: isFocused ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Error Message debajo de cada input */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-red-600 leading-tight">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        <AnimatePresence>
          {!error && helperText && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center space-x-2"
            >
              <p className="text-sm text-gray-500 leading-tight ml-6">
                {helperText}
              </p>
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
              <Check className="w-4 h-4 text-green-500" />
              <p className="text-sm font-medium text-green-600">
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