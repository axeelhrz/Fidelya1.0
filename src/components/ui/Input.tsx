'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label, 
    error, 
    success,
    icon, 
    type = 'text',
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={id}
            className={`
              block text-sm font-bold mb-3 transition-all duration-200 tracking-wide uppercase
              ${error ? 'text-red-600' : 
                success ? 'text-emerald-600' : 
                isFocused ? 'text-indigo-600' : 
                'text-slate-700'}
            `}
            animate={{
              scale: isFocused ? 1.02 : 1,
              color: error ? '#dc2626' : 
                     success ? '#059669' : 
                     isFocused ? '#4f46e5' : '#334155'
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {props.required && (
              <motion.span 
                className="text-red-500 ml-1"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                *
              </motion.span>
            )}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative group">
          {/* Background Glow Effect */}
          <motion.div
            className={`
              absolute -inset-0.5 rounded-2xl opacity-0 transition-opacity duration-300
              ${error ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                success ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'}
            `}
            animate={{
              opacity: isFocused ? 0.2 : 0
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <motion.div
                className={`
                  transition-all duration-200
                  ${error ? 'text-red-500' : 
                    success ? 'text-emerald-500' : 
                    isFocused ? 'text-indigo-500' : 
                    'text-slate-400'}
                `}
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: success ? [0, 360] : 0
                }}
                transition={{ 
                  duration: 0.3,
                  rotate: { duration: 0.6 }
                }}
              >
                {React.cloneElement(icon as React.ReactElement, { size: 20 })}
              </motion.div>
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={ref}
            id={id}
            type={inputType}
            className={`
              relative w-full px-4 py-4 text-slate-900 bg-white/70 backdrop-blur-sm
              border-2 rounded-2xl transition-all duration-300 ease-out
              placeholder:text-slate-400 placeholder:font-medium
              focus:outline-none focus:ring-0
              disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
              font-medium text-base
              ${icon ? 'pl-12' : ''}
              ${isPassword ? 'pr-12' : ''}
              ${error ? 
                'border-red-300 focus:border-red-500 bg-red-50/50' : 
                success ? 
                'border-emerald-300 focus:border-emerald-500 bg-emerald-50/50' :
                'border-slate-200 focus:border-indigo-500 hover:border-slate-300'}
              ${isFocused ? 'shadow-xl scale-[1.02]' : 'shadow-lg hover:shadow-xl'}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            disabled={disabled}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Floating Label Effect */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Password Toggle */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              tabIndex={-1}
            >
              <motion.div
                animate={{ rotate: showPassword ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.div>
            </motion.button>
          )}

          {/* Success/Error Icons */}
          {(success || error) && !isPassword && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {success ? (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ x: error ? [-2, 2, -2, 2, 0] : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AlertCircle size={20} className="text-red-500" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 mt-3 px-1"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              </motion.div>
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 mt-3 px-1"
            >
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-600">Campo verificado correctamente</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {!error && !success && helperText && (
          <p className="mt-3 text-sm text-slate-500 font-medium px-1">{helperText}</p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";