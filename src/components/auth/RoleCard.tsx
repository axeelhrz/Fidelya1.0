'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Building2, Store, Users, ArrowRight, Zap, Shield, Star, Cpu } from 'lucide-react';

interface RoleCardProps {
  role: 'socio' | 'comercio' | 'asociacion';
  title: string;
  description: string;
  features: string[];
  href: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const roleConfig = {
  socio: {
    icon: Users,
    gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
    glowColor: '#00ffff',
    accentColor: '#00ffff',
  },
  comercio: {
    icon: Store,
    gradient: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
    glowColor: '#ff00ff',
    accentColor: '#ff00ff',
  },
  asociacion: {
    icon: Building2,
    gradient: 'linear-gradient(135deg, #ffff00 0%, #ff8000 100%)',
    glowColor: '#ffff00',
    accentColor: '#ffff00',
  },
};

const styles = {
  card: (isSelected: boolean, isHovered: boolean, config: typeof roleConfig.socio) => ({
    position: 'relative' as const,
    width: '100%',
    maxWidth: '380px',
    background: isSelected ? 
      'rgba(255, 255, 255, 0.08)' : 
      'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: `2px solid ${isSelected ? config.accentColor : 'rgba(255, 255, 255, 0.1)'}`,
    borderRadius: '24px',
    padding: '2.5rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    overflow: 'hidden',
    boxShadow: isSelected ? 
      `0 20px 80px ${config.glowColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)` :
      '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
  }),
  
  holographicOverlay: (config: typeof roleConfig.socio) => ({
    position: 'absolute' as const,
    inset: 0,
    background: `linear-gradient(45deg, transparent, ${config.glowColor}20, transparent, ${config.glowColor}10, transparent)`,
    backgroundSize: '200% 200%',
    animation: 'holographicShimmer 4s ease-in-out infinite',
    opacity: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none' as const,
  }),
  
  energyField: (config: typeof roleConfig.socio) => ({
    position: 'absolute' as const,
    inset: '-3px',
    background: `conic-gradient(from 0deg, ${config.glowColor}40, transparent, ${config.glowColor}20, transparent, ${config.glowColor}40)`,
    borderRadius: 'inherit',
    opacity: 0,
    animation: 'energyRotate 6s linear infinite',
    pointerEvents: 'none' as const,
  }),
  
  iconContainer: (config: typeof roleConfig.socio) => ({
    width: '80px',
    height: '80px',
    background: config.gradient,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    position: 'relative' as const,
    boxShadow: `0 10px 40px ${config.glowColor}40`,
  }),
  
  iconGlow: (config: typeof roleConfig.socio) => ({
    position: 'absolute' as const,
    inset: '-4px',
    background: config.gradient,
    borderRadius: 'inherit',
    opacity: 0.3,
    filter: 'blur(8px)',
    zIndex: -1,
  }),
  
  title: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase' as const,
  },
  
  description: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 2rem 0',
  },
  
  featureItem: (config: typeof roleConfig.socio) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 0',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  }),
  
  featureBullet: (config: typeof roleConfig.socio) => ({
    width: '6px',
    height: '6px',
    background: config.gradient,
    borderRadius: '50%',
    boxShadow: `0 0 10px ${config.glowColor}`,
    flexShrink: 0,
  }),
  
  selectButton: (config: typeof roleConfig.socio) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '1rem 1.5rem',
    background: config.gradient,
    color: '#000000',
    fontSize: '0.875rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: `0 8px 32px ${config.glowColor}40`,
  }),
  
  quantumParticles: {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
    overflow: 'hidden',
    borderRadius: 'inherit',
  },
  
  particle: (config: typeof roleConfig.socio) => ({
    position: 'absolute' as const,
    width: '3px',
    height: '3px',
    background: config.accentColor,
    borderRadius: '50%',
    boxShadow: `0 0 6px ${config.accentColor}`,
    pointerEvents: 'none' as const,
  }),
  
  dataStreams: {
    position: 'absolute' as const,
    top: 0,
    right: '10%',
    width: '1px',
    height: '100%',
    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent)',
    animation: 'dataFlow 2s linear infinite',
    opacity: 0.6,
  },
  
  selectedBadge: (config: typeof roleConfig.socio) => ({
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    padding: '0.5rem 1rem',
    background: config.gradient,
    color: '#000000',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    borderRadius: '8px',
    boxShadow: `0 4px 16px ${config.glowColor}40`,
  }),
};

// Quantum Particles Component
const QuantumParticles = ({ config, isActive }: { config: typeof roleConfig.socio; isActive: boolean }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>>([]);

  React.useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.filter(p => p.life > 0),
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: 1,
        }
      ]);
    }, 200);

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
    <div style={styles.quantumParticles}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            ...styles.particle(config),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.life,
          }}
        />
      ))}
    </div>
  );
};

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  features,
  href,
  isSelected = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const config = roleConfig[role];
  const Icon = config.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX.set(x * 0.05);
    mouseY.set(y * 0.05);
  };

  React.useEffect(() => {
    // Inject keyframes for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes holographicShimmer {
        0% { background-position: 0% 0%; opacity: 0; }
        50% { background-position: 100% 100%; opacity: 0.3; }
        100% { background-position: 0% 0%; opacity: 0; }
      }
      
      @keyframes energyRotate {
        0% { transform: rotate(0deg); opacity: 0; }
        50% { opacity: 0.4; }
        100% { transform: rotate(360deg); opacity: 0; }
      }
      
      @keyframes dataFlow {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
      
      @keyframes quantumPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
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
      ref={cardRef}
      style={{
        ...styles.card(isSelected, isHovered, config),
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={{
        boxShadow: `0 25px 100px ${config.glowColor}60, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected Badge */}
      {isSelected && (
        <motion.div
          style={styles.selectedBadge(config)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Star size={12} style={{ marginRight: '0.25rem' }} />
          SELECCIONADO
        </motion.div>
      )}

      {/* Energy Field */}
      {(isHovered || isSelected) && (
        <div style={styles.energyField(config)} />
      )}

      {/* Holographic Overlay */}
      {isHovered && (
        <div style={styles.holographicOverlay(config)} />
      )}

      {/* Quantum Particles */}
      <QuantumParticles config={config} isActive={isHovered || isSelected} />

      {/* Data Streams */}
      <div style={styles.dataStreams} />

      {/* Icon Container */}
      <motion.div
        style={styles.iconContainer(config)}
        animate={{
          rotate: isHovered ? [0, 360] : 0,
          scale: isSelected ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 2, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity },
        }}
      >
        <div style={styles.iconGlow(config)} />
        <Icon size={40} color="#000" />
      </motion.div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <motion.h3
          style={styles.title}
          animate={{
            color: isSelected ? config.accentColor : '#ffffff',
            textShadow: isSelected ? `0 0 20px ${config.glowColor}` : 'none',
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>

        <p style={styles.description}>{description}</p>

        <ul style={styles.featuresList}>
          {features.map((feature, index) => (
            <motion.li
              key={index}
              style={styles.featureItem(config)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div style={styles.featureBullet(config)} />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          style={styles.selectButton(config)}
          whileHover={{
            scale: 1.05,
            boxShadow: `0 12px 48px ${config.glowColor}60`,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Zap size={16} />
          <span>{isSelected ? 'SELECCIONADO' : 'SELECCIONAR'}</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};