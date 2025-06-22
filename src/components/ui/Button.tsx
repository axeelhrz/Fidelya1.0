'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'quantum' | 'neon' | 'holographic';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'quantum';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  glowEffect?: boolean;
  particleEffect?: boolean;
}

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  
  variants: {
    primary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    },
    outline: {
      background: 'transparent',
      color: '#00ffff',
      border: '2px solid #00ffff',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)',
    },
    ghost: {
      background: 'rgba(255, 255, 255, 0.02)',
      color: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid transparent',
    },
    destructive: {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    success: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    quantum: {
      background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
      color: '#000000',
      boxShadow: '0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(255, 0, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      fontWeight: '900',
    },
    neon: {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#00ffff',
      border: '2px solid #00ffff',
      boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1)',
      textShadow: '0 0 10px #00ffff',
    },
    holographic: {
      background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 25%, rgba(255, 0, 255, 0.1) 50%, rgba(255, 255, 0, 0.1) 75%, rgba(255, 255, 255, 0.1) 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      backgroundSize: '200% 200%',
      animation: 'holographic 3s ease-in-out infinite',
    },
  },
  
  sizes: {
    sm: {
      height: '40px',
      padding: '0 1.25rem',
      fontSize: '0.75rem',
      borderRadius: '10px',
    },
    md: {
      height: '48px',
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
    quantum: {
      height: '72px',
      padding: '0 3rem',
      fontSize: '1.125rem',
      borderRadius: '20px',
    },
  },
  
  disabled: {
    opacity: 0.4,
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
  
  ripple: {
    position: 'absolute' as const,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.6)',
    transform: 'scale(0)',
    animation: 'ripple 0.6s linear',
    pointerEvents: 'none' as const,
  },
  
  particles: {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
    overflow: 'hidden',
    borderRadius: 'inherit',
  },
  
  particle: {
    position: 'absolute' as const,
    width: '2px',
    height: '2px',
    background: '#ffffff',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  },
  
  energyField: {
    position: 'absolute' as const,
    inset: '-2px',
    background: 'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.5), transparent, rgba(255, 0, 255, 0.5), transparent)',
    borderRadius: 'inherit',
    opacity: 0,
    animation: 'energyField 2s linear infinite',
    pointerEvents: 'none' as const,
  },
  
  scanline: {
    position: 'absolute' as const,
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    animation: 'scanline 2s ease-in-out infinite',
    pointerEvents: 'none' as const,
  },
};

const hoverStyles = {
  primary: {
    boxShadow: '0 12px 48px rgba(79, 70, 229, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    boxShadow: '0 12px 48px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  outline: {
    background: 'rgba(0, 255, 255, 0.1)',
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.2)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transform: 'translateY(-1px)',
  },
  destructive: {
    boxShadow: '0 12px 48px rgba(220, 38, 38, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  success: {
    boxShadow: '0 12px 48px rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  quantum: {
    boxShadow: '0 0 60px rgba(0, 255, 255, 0.8), 0 0 120px rgba(255, 0, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    transform: 'translateY(-3px) scale(1.05)',
  },
  neon: {
    boxShadow: '0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 120px #00ffff, inset 0 0 30px rgba(0, 255, 255, 0.2)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  holographic: {
    backgroundPosition: '100% 100%',
    boxShadow: '0 12px 48px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    transform: 'translateY(-2px) scale(1.02)',
  },
};

// Particle System Component
const ParticleSystem = ({ isActive }: { isActive: boolean }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>>([]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.filter(p => p.life > 0),
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
        }
      ]);
    }, 100);
    
    const animationFrame = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02,
      })).filter(p => p.life > 0 && p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100));
    }, 16);
    
    return () => {
      clearInterval(interval);
      clearInterval(animationFrame);
    };
  }, [isActive]);
  
  return (
    <div style={styles.particles}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.life,
            boxShadow: `0 0 ${particle.life * 10}px rgba(0, 255, 255, ${particle.life})`,
          }}
        />
      ))}
    </div>
  );
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
    glowEffect = false,
    particleEffect = false,
    onClick,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
    
    const isDisabled = disabled || loading;

    const buttonStyle = {
      ...styles.base,
      ...styles.variants[variant],
      ...styles.sizes[size],
      ...(fullWidth ? styles.fullWidth : {}),
      ...(isDisabled ? styles.disabled : {}),
      ...style,
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      
      // Create ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
      
      onClick?.(e);
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      mouseX.set(x * 0.1);
      mouseY.set(y * 0.1);
    };

    useEffect(() => {
      // Inject keyframes for animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes holographic {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        @keyframes energyField {
          0% { transform: rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        
        @keyframes scanline {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes quantumPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(255, 0, 255, 0.6); }
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
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        style={{
          ...buttonStyle,
          x: springX,
          y: springY,
        }}
        disabled={isDisabled}
        whileHover={!isDisabled ? hoverStyles[variant] : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        {...props}
      >
        {/* Energy Field Effect */}
        {(variant === 'quantum' || variant === 'neon') && isHovered && (
          <div style={styles.energyField} />
        )}
        
        {/* Scanline Effect */}
        {variant === 'holographic' && (
          <div style={styles.scanline} />
        )}
        
        {/* Particle System */}
        {particleEffect && (
          <ParticleSystem isActive={isHovered} />
        )}

        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              style={{
                ...styles.ripple,
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Content */}
        <div style={styles.content}>
          {/* Left Icon or Loading Spinner */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
              >
                <Zap size={20} />
              </motion.div>
            ) : leftIcon ? (
              <motion.div
                key="left-icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {leftIcon}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Button Text */}
          <motion.span
            animate={{
              opacity: loading ? 0.7 : 1,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{ 
              fontWeight: '700', 
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: 'inherit',
              textShadow: variant === 'neon' ? '0 0 10px currentColor' : 'none',
            }}
          >
            {loading ? 'PROCESANDO...' : children}
          </motion.span>

          {/* Right Icon */}
          <AnimatePresence>
            {rightIcon && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {rightIcon}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glow Effect */}
        {glowEffect && isHovered && (
          <motion.div
            style={{
              position: 'absolute',
              inset: '-4px',
              background: `linear-gradient(45deg, ${
                variant === 'quantum' ? '#00ffff, #ff00ff' :
                variant === 'neon' ? '#00ffff, #00ffff' :
                '#4f46e5, #7c3aed'
              })`,
              borderRadius: 'inherit',
              opacity: 0.3,
              filter: 'blur(8px)',
              zIndex: -1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";