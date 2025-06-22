'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Info, Zap, Shield } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'quantum';
  variant?: 'default' | 'neon' | 'holographic' | 'quantum' | 'minimal';
  helperText?: string;
  glowEffect?: boolean;
  scanlineEffect?: boolean;
}

const styles = {
  container: {
    marginBottom: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative' as const,
  },
  
  label: (isFocused: boolean, error?: string, success?: boolean, disabled?: boolean, variant?: string) => ({
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    marginBottom: '0.75rem',
    color: error ? '#ff4444' : 
           success ? '#00ff88' : 
           isFocused ? (variant === 'neon' ? '#00ffff' : '#ff00ff') : 
           disabled ? 'rgba(255, 255, 255, 0.3)' : 
           'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    textShadow: variant === 'neon' && isFocused ? '0 0 10px currentColor' : 'none',
  }),
  
  inputContainer: {
    position: 'relative' as const,
  },
  
  input: (isFocused: boolean, error?: string, success?: boolean, hasIcon?: boolean, isPassword?: boolean, variant?: string, size?: string) => {
    const baseHeight = size === 'sm' ? '48px' : size === 'md' ? '56px' : size === 'lg' ? '64px' : size === 'quantum' ? '72px' : '64px';
    const basePadding = hasIcon ? '0 1.5rem 0 4rem' : isPassword ? '0 4rem 0 1.5rem' : '0 1.5rem';
    
    let background = 'rgba(255, 255, 255, 0.03)';
    let border = '2px solid rgba(255, 255, 255, 0.1)';
    let boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
    
    if (variant === 'neon') {
      background = 'rgba(0, 0, 0, 0.8)';
      border = `2px solid ${isFocused ? '#00ffff' : 'rgba(0, 255, 255, 0.3)'}`;
      boxShadow = isFocused ? 
        '0 0 20px #00ffff, 0 0 40px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)' :
        '0 0 10px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.05)';
    } else if (variant === 'holographic') {
      background = 'linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 255, 255, 0.05) 25%, rgba(255, 0, 255, 0.05) 50%, rgba(255, 255, 0, 0.05) 75%, rgba(255, 255, 255, 0.05) 100%)';
      border = '1px solid rgba(255, 255, 255, 0.2)';
      boxShadow = '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    } else if (variant === 'quantum') {
      background = 'rgba(0, 0, 0, 0.6)';
      border = `2px solid ${isFocused ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 0, 255, 0.3)'}`;
      boxShadow = isFocused ?
        '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)' :
        '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
    }
    
    if (error) {
      border = '2px solid #ff4444';
      boxShadow = '0 0 20px rgba(255, 68, 68, 0.3), inset 0 0 10px rgba(255, 68, 68, 0.1)';
    } else if (success) {
      border = '2px solid #00ff88';
      boxShadow = '0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 10px rgba(0, 255, 136, 0.1)';
    }
    
    return {
      width: '100%',
      height: baseHeight,
      padding: basePadding,
      fontSize: size === 'sm' ? '0.875rem' : size === 'quantum' ? '1.125rem' : '1rem',
      fontWeight: '500',
      color: '#ffffff',
      background,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border,
      borderRadius: size === 'sm' ? '12px' : size === 'quantum' ? '20px' : '16px',
      outline: 'none',
      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      boxShadow,
      fontFamily: 'inherit',
      textShadow: variant === 'neon' ? '0 0 5px rgba(0, 255, 255, 0.5)' : 'none',
    };
  },
  
  iconContainer: {
    position: 'absolute' as const,
    left: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    zIndex: 10,
  },
  
  icon: (isFocused: boolean, error?: string, success?: boolean, variant?: string) => ({
    width: '24px',
    height: '24px',
    color: error ? '#ff4444' : 
           success ? '#00ff88' : 
           isFocused ? (variant === 'neon' ? '#00ffff' : '#ff00ff') : 
           'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    filter: variant === 'neon' && isFocused ? 'drop-shadow(0 0 5px currentColor)' : 'none',
  }),
  
  passwordToggle: {
    position: 'absolute' as const,
    right: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  
  statusIcon: {
    position: 'absolute' as const,
    right: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '0.25rem',
    zIndex: 10,
  },
  
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginTop: '1rem',
    padding: '0 0.5rem',
  },
  
  messageText: (type: 'error' | 'helper' | 'success') => ({
    fontSize: '0.875rem',
    fontWeight: type === 'error' ? '600' : '500',
    color: type === 'error' ? '#ff4444' : 
           type === 'success' ? '#00ff88' : 
           'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.4,
    textShadow: type === 'error' ? '0 0 5px rgba(255, 68, 68, 0.3)' : 
                type === 'success' ? '0 0 5px rgba(0, 255, 136, 0.3)' : 
                'none',
  }),
  
  messageIcon: {
    marginTop: '0.125rem',
    flexShrink: 0,
    filter: 'drop-shadow(0 0 3px currentColor)',
  },
  
  scanline: {
    position: 'absolute' as const,
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
    animation: 'scanline 2s ease-in-out infinite',
    pointerEvents: 'none' as const,
    borderRadius: 'inherit',
  },
  
  energyField: {
    position: 'absolute' as const,
    inset: '-2px',
    background: 'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.3), transparent, rgba(255, 0, 255, 0.3), transparent)',
    borderRadius: 'inherit',
    opacity: 0,
    animation: 'energyField 3s linear infinite',
    pointerEvents: 'none' as const,
  },
  
  holographicOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 25%, rgba(255, 0, 255, 0.1) 50%, rgba(255, 255, 0, 0.1) 75%, rgba(255, 255, 255, 0.1) 100%)',
    backgroundSize: '200% 200%',
    animation: 'holographic 4s ease-in-out infinite',
    pointerEvents: 'none' as const,
    borderRadius: 'inherit',
    opacity: 0,
  },
};

const hoverStyles = {
  passwordToggle: {
    color: '#00ffff',
    background: 'rgba(0, 255, 255, 0.1)',
    transform: 'translateY(-50%) scale(1.1)',
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
    glowEffect = false,
    scanlineEffect = false,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const id = useId();
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!inputRef.current) return;
      
      const rect = inputRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      mouseX.set(x * 0.05);
      mouseY.set(y * 0.05);
    };

    useEffect(() => {
      // Inject keyframes for animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes scanline {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes energyField {
          0% { transform: rotate(0deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        
        @keyframes holographic {
          0% { background-position: 0% 0%; opacity: 0; }
          50% { background-position: 100% 100%; opacity: 0.3; }
          100% { background-position: 0% 0%; opacity: 0; }
        }
        
        @keyframes quantumPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(255, 0, 255, 0.3); }
        }
        
        @keyframes dataFlow {
          0% { transform: translateX(-100%) scaleX(0); }
          50% { transform: translateX(0%) scaleX(1); }
          100% { transform: translateX(100%) scaleX(0); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }, []);

    return (
      <motion.div
        style={{
          ...styles.container,
          x: springX,
          y: springY,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={id}
            style={styles.label(isFocused, error, success, disabled, variant)}
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {props.required && (
              <motion.span 
                style={{ color: '#ff4444', marginLeft: '0.5rem' }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                *
              </motion.span>
            )}
            {variant === 'quantum' && (
              <Zap size={14} style={{ marginLeft: '0.5rem', display: 'inline' }} />
            )}
          </motion.label>
        )}

        {/* Input Container */}
        <div style={styles.inputContainer}>
          {/* Quantum Energy Field */}
          {variant === 'quantum' && isFocused && (
            <div style={styles.energyField} />
          )}
          
          {/* Holographic Overlay */}
          {variant === 'holographic' && isHovered && (
            <div style={styles.holographicOverlay} />
          )}
          
          {/* Scanline Effect */}
          {scanlineEffect && isFocused && (
            <div style={styles.scanline} />
          )}

          {/* Icon */}
          {icon && (
            <div style={styles.iconContainer}>
              <motion.div
                style={styles.icon(isFocused, error, success, variant)}
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: variant === 'quantum' && isFocused ? [0, 360] : 0,
                }}
                transition={{ 
                  duration: 0.3,
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
                }}
              >
                {icon}
              </motion.div>
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={id}
            type={inputType}
            style={styles.input(isFocused, error, success, !!icon, isPassword, variant, size)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            disabled={disabled}
            placeholder={props.placeholder}
            whileFocus={{
              scale: variant === 'quantum' ? 1.02 : 1.01,
            }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
              whileHover={hoverStyles.passwordToggle}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              tabIndex={-1}
            >
              <motion.div
                animate={{ rotate: showPassword ? 180 : 0 }}
                transition={{ duration: 0.3 }}
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
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle2 size={20} color="#00ff88" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ shake: error ? [0, -2, 2, -2, 2, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle size={20} color="#ff4444" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
          
          {/* Glow Effect */}
          {glowEffect && isFocused && (
            <motion.div
              style={{
                position: 'absolute',
                inset: '-4px',
                background: `linear-gradient(45deg, ${
                  variant === 'neon' ? '#00ffff, #00ffff' :
                  variant === 'quantum' ? '#00ffff, #ff00ff' :
                  '#4f46e5, #7c3aed'
                })`,
                borderRadius: 'inherit',
                opacity: 0.2,
                filter: 'blur(8px)',
                zIndex: -1,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={styles.messageContainer}
            >
              <motion.div
                animate={{ pulse: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle size={16} color="#ff4444" style={styles.messageIcon} />
              </motion.div>
              <p style={styles.messageText('error')}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        <AnimatePresence>
          {!error && helperText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={styles.messageContainer}
            >
              <Info size={16} color="rgba(255, 255, 255, 0.5)" style={styles.messageIcon} />
              <p style={styles.messageText('helper')}>{helperText}</p>
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
              style={styles.messageContainer}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <CheckCircle2 size={16} color="#00ff88" style={styles.messageIcon} />
              </motion.div>
              <p style={styles.messageText('success')}>Campo verificado con éxito</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

Input.displayName = "Input";