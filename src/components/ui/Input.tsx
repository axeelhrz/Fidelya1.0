'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        {label && (
          <label className="text-sm font-medium text-gray-700 tracking-tight">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <div className={cn(
                "h-5 w-5 transition-colors duration-200",
                isFocused ? "text-indigo-600" : "text-gray-400",
                error && "text-red-500"
              )}>
                {icon}
              </div>
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium transition-all duration-200 ease-out",
              "placeholder:text-gray-400 placeholder:font-normal",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "hover:border-gray-300",
              icon && "pl-12",
              error 
                ? "border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500" 
                : "border-gray-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-600",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Efecto de brillo en focus */}
          <div className={cn(
            "absolute inset-0 rounded-xl transition-opacity duration-200 pointer-events-none",
            "bg-gradient-to-r from-indigo-500/10 via-transparent to-indigo-500/10",
            isFocused && !error ? "opacity-100" : "opacity-0"
          )} />
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 font-medium"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";