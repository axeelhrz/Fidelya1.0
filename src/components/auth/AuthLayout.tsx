'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2, Sparkles, Zap, Cpu, Database, Network, Star, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative' as const,
    overflow: 'hidden',
    background: 'transparent',
  },
  
  backgroundEffects: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 1,
    pointerEvents: 'none' as const,
  },
  
  quantumGrid: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
    animation: 'gridPulse 4s ease-in-out infinite',
  },
  
  energyOrbs: {
    position: 'absolute' as const,
    inset: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 60% 40%, rgba(255, 255, 0, 0.1) 0%, transparent 50%)
    `,
    animation: 'orbFloat 8s ease-in-out infinite',
  },
  
  header: {
    position: 'relative' as const,
    zIndex: 100,
    padding: '2rem',
  },
  
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'inherit',
  },
  
  logoIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    boxShadow: '0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(255, 0, 255, 0.3)',
    animation: 'logoGlow 3s ease-in-out infinite',
  },
  
  logoText: {
    fontSize: '2rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  
  logoSubtext: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    marginTop: '0.25rem',
  },
  
  statusBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 16px rgba(0, 255, 255, 0.1)',
  },
  
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative' as const,
    zIndex: 10,
    minHeight: 'calc(100vh - 200px)',
  },
  
  contentContainer: {
    width: '100%',
    maxWidth: '480px',
    position: 'relative' as const,
  },
  
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    marginBottom: '2rem',
  },
  
  titleSection: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
    position: 'relative' as const,
  },
  
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffffff 0%, #00ffff 50%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    textShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
  },
  
  subtitle: {
    fontSize: '1.125rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.6,
    maxWidth: '400px',
    margin: '0 auto',
  },
  
  formCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '3rem',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  
  formCardGlow: {
    position: 'absolute' as const,
    inset: '-2px',
    background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2))',
    borderRadius: '26px',
    opacity: 0,
    animation: 'cardGlow 4s ease-in-out infinite',
    zIndex: -1,
  },
  
  footer: {
    position: 'relative' as const,
    zIndex: 10,
    padding: '2rem',
    textAlign: 'center' as const,
  },
  
  footerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  
  dataStream: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '2px',
    height: '100%',
    background: 'linear-gradient(to bottom, transparent, #00ffff, transparent)',
    animation: 'dataStream 3s linear infinite',
    opacity: 0.6,
  },
  
  holographicBorder: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '24px',
    padding: '1px',
    background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'exclude',
    opacity: 0,
    animation: 'holographicBorder 6s linear infinite',
  },
};

// Floating Data Particles Component
const FloatingDataParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    char: string;
  }>>([]);

  useEffect(() => {
    const chars = ['0', '1', 'F', 'I', 'D', 'E', 'L', 'I', 'T', 'A', '∞', '◊', '◈', '◇'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 8,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? -5 : particle.y + particle.speed,
        opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.2 + 0.3,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            color: '#00ffff',
            opacity: particle.opacity,
            fontWeight: '700',
            fontFamily: 'monospace',
            textShadow: '0 0 10px currentColor',
            animation: `particleFloat ${3 + particle.id % 3}s ease-in-out infinite`,
          }}
        >
          {particle.char}
        </div>
      ))}
    </div>
  );
};

// Quantum Scanner Component
const QuantumScanner = () => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* Horizontal Scanner */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '-100%',
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
        animation: 'scanHorizontal 4s ease-in-out infinite',
        boxShadow: '0 0 20px #00ffff',
      }} />
      
      {/* Vertical Scanner */}
      <div style={{
        position: 'absolute',
        left: '70%',
        top: '-100%',
        width: '2px',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent, #ff00ff, transparent)',
        animation: 'scanVertical 5s ease-in-out infinite 1s',
        boxShadow: '0 0 20px #ff00ff',
      }} />
    </div>
  );
};

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref = '/auth/register'
}: AuthLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Inject keyframes for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gridPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-20px) rotate(120deg); }
        66% { transform: translateY(10px) rotate(240deg); }
      }
      
      @keyframes logoGlow {
        0%, 100% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(255, 0, 255, 0.3); }
        50% { box-shadow: 0 0 60px rgba(0, 255, 255, 0.8), 0 0 120px rgba(255, 0, 255, 0.5); }
      }
      
      @keyframes cardGlow {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.3; }
      }
      
      @keyframes dataStream {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      
      @keyframes holographicBorder {
        0% { opacity: 0; background-position: 0% 0%; }
        50% { opacity: 0.5; background-position: 100% 100%; }
        100% { opacity: 0; background-position: 0% 0%; }
      }
      
      @keyframes scanHorizontal {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      @keyframes scanVertical {
        0% { top: -100%; }
        100% { top: 100%; }
      }
      
      @keyframes particleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(180deg); }
      }
      
      @keyframes titleGlow {
        0%, 100% { text-shadow: 0 0 40px rgba(0, 255, 255, 0.3); }
        50% { text-shadow: 0 0 60px rgba(0, 255, 255, 0.6), 0 0 80px rgba(255, 0, 255, 0.4); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!mounted) {
    return (
      <div style={styles.container}>
        <div style={styles.main}>
          <div style={styles.contentContainer}>
            <div style={styles.formCard}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div style={styles.backgroundEffects}>
        <div style={styles.quantumGrid} />
        <div style={styles.energyOrbs} />
        <FloatingDataParticles />
        <QuantumScanner />
        
        {/* Data Streams */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dataStream,
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        style={styles.header}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logo}>
            <motion.div
              style={styles.logoIcon}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span style={{ color: '#000', fontSize: '1.75rem', fontWeight: '900' }}>F</span>
            </motion.div>
            <div>
              <div style={styles.logoText}>Fidelita</div>
              <div style={styles.logoSubtext}>QUANTUM AUTH</div>
            </div>
          </Link>
          
          <div style={styles.statusBadges}>
            <motion.div
              style={styles.badge}
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 255, 0.4)' }}
              animate={{ borderColor: ['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.4)', 'rgba(0, 255, 255, 0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield size={16} />
              <span>SEGURO</span>
            </motion.div>
            <motion.div
              style={styles.badge}
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 136, 0.4)' }}
              animate={{ borderColor: ['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.4)', 'rgba(0, 255, 136, 0.2)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <CheckCircle2 size={16} />
              <span>VERIFICADO</span>
            </motion.div>
            <motion.div
              style={styles.badge}
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 0, 255, 0.4)' }}
              animate={{ borderColor: ['rgba(255, 0, 255, 0.2)', 'rgba(255, 0, 255, 0.4)', 'rgba(255, 0, 255, 0.2)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Cpu size={16} />
              <span>QUANTUM</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.contentContainer}>
          {/* Back Button */}
          {showBackButton && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(0, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={backHref} style={styles.backButton}>
                  <ArrowLeft size={18} />
                  <span>VOLVER</span>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* Title Section */}
          <motion.div
            style={styles.titleSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1
              style={{
                ...styles.title,
                animation: 'titleGlow 3s ease-in-out infinite',
              }}
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                style={styles.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>

          {/* Form Card */}
          <motion.div
            style={styles.formCard}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              boxShadow: '0 25px 100px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
            }}
          >
            {/* Holographic Border */}
            <div style={styles.holographicBorder} />
            
            {/* Card Glow Effect */}
            <div style={styles.formCardGlow} />
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        style={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div style={styles.footerContent}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={18} />
          </motion.div>
          <span>© 2024 Fidelita Quantum Platform - Tecnología del Futuro</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star size={18} />
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}