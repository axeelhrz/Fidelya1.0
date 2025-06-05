"use client";

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Oscuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' },
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
        {themes.map(({ value, icon: Icon, label }) => (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
              ${theme === value 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={label}
          >
            <AnimatePresence>
              {theme === value && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
            <Icon size={16} className="relative z-10" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return Monitor;
    }
    return resolvedTheme === 'dark' ? Moon : Sun;
  };

  const Icon = getIcon();

  return (
    <motion.button
      onClick={toggleTheme}
      className="
        relative flex items-center justify-center w-10 h-10 
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg shadow-sm hover:shadow-md
        text-gray-700 dark:text-gray-200
        transition-all duration-200
        hover:bg-gray-50 dark:hover:bg-gray-700
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : theme === 'dark' ? 'sistema' : 'claro'}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Icon size={18} />
      </motion.div>
    </motion.button>
  );
}
