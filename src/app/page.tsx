'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Users, Building2, Store, Sparkles, Zap, Globe, Cpu, Database, Network, Rocket, Star, ChevronDown, Play, Pause } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative' as const,
    overflow: 'hidden',
    background: 'transparent',
  },
  
  header: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '1.5rem 2rem',
    background: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
    animation: 'glow 2s ease-in-out infinite alternate',
  },
  
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  
  logoSubtext: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginTop: '0.25rem',
  },
  
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  navLink: {
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  
  navButton: {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    color: '#000',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  
  main: {
    paddingTop: '120px',
    position: 'relative' as const,
    zIndex: 10,
  },
  
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '2rem',
    position: 'relative' as const,
  },
  
  heroContent: {
    maxWidth: '1000px',
    position: 'relative' as const,
    zIndex: 20,
  },
  
  heroTitle: {
    fontSize: 'clamp(3rem, 8vw, 8rem)',
    fontWeight: '900',
    lineHeight: 0.9,
    marginBottom: '2rem',
    letterSpacing: '-0.02em',
  },
  
  heroTitleMain: {
    background: 'linear-gradient(135deg, #ffffff 0%, #00ffff 50%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'block',
    textShadow: '0 0 80px rgba(0, 255, 255, 0.5)',
  },
  
  heroTitleAccent: {
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'block',
    position: 'relative' as const,
  },
  
  heroSubtitle: {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    color: 'rgba(255, 255, 255, 0.8)',
    maxWidth: '700px',
    margin: '0 auto 3rem',
    lineHeight: 1.6,
    fontWeight: '400',
  },
  
  heroButtons: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    alignItems: 'center',
    marginBottom: '4rem',
  },
  
  heroButtonsRow: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 2.5rem',
    fontSize: '1rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    color: '#000',
    textDecoration: 'none',
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 16px 64px rgba(0, 255, 255, 0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    border: 'none',
    cursor: 'pointer',
  },
  
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 2.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '16px',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  
  statCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '2.5rem',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  },
  
  statIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)',
  },
  
  statNumber: {
    fontSize: '3rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  },
  
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  
  featuresSection: {
    padding: '6rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative' as const,
  },
  
  featuresHeader: {
    textAlign: 'center' as const,
    marginBottom: '4rem',
  },
  
  featuresTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffffff 0%, #00ffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  
  featureCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '3rem',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  },
  
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '1rem',
  },
  
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.6,
    fontSize: '1rem',
  },
  
  footer: {
    padding: '4rem 2rem 2rem',
    textAlign: 'center' as const,
    borderTop: '1px solid rgba(0, 255, 255, 0.1)',
    background: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(20px)',
  },
  
  footerContent: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.875rem',
  },
  
  scrollIndicator: {
    position: 'absolute' as const,
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  
  holographicEffect: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200%',
    height: '200%',
    background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 255, 0.1), transparent, rgba(255, 0, 255, 0.1), transparent)',
    animation: 'spin 20s linear infinite',
    pointerEvents: 'none' as const,
  },
};

// Holographic Text Effect Component
const HolographicText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
            borderRadius: '50%',
            boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
          }}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    // Inject additional keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes float-up {
        0% { transform: translateY(0px) opacity(1); }
        100% { transform: translateY(-20px) opacity(0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  const stats = [
    { icon: Building2, number: '500+', label: 'Asociaciones', color: '#00ffff' },
    { icon: Store, number: '2K+', label: 'Comercios', color: '#ff00ff' },
    { icon: Users, number: '50K+', label: 'Socios Activos', color: '#00ff88' },
    { icon: Database, number: '99.9%', label: 'Uptime', color: '#ffaa00' },
  ];
  
  const features = [
    {
      title: 'IA Avanzada',
      description: 'Sistema de inteligencia artificial que optimiza automáticamente las campañas de fidelización para maximizar el engagement y las conversiones.',
      icon: Cpu,
    },
    {
      title: 'Blockchain Seguro',
      description: 'Tecnología blockchain para garantizar la transparencia y seguridad en todas las transacciones y programas de lealtad.',
      icon: Shield,
    },
    {
      title: 'Analytics Predictivo',
      description: 'Análisis predictivo avanzado que anticipa comportamientos de clientes y optimiza estrategias en tiempo real.',
      icon: Network,
    },
  ];
  
  return (
    <div style={styles.container}>
      {/* Floating Elements */}
      <FloatingElements />
      
      {/* Header */}
      <motion.header
        style={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <span style={{ color: '#000', fontSize: '1.5rem', fontWeight: '900' }}>F</span>
              <div style={styles.holographicEffect} />
            </div>
            <div>
              <div style={styles.logoText}>Fidelita</div>
              <div style={styles.logoSubtext}>QUANTUM PLATFORM</div>
            </div>
          </Link>
          
          <nav style={styles.nav}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/login" style={styles.navLink}>
                Iniciar Sesión
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 16px 64px rgba(0, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/register" style={styles.navButton}>
                Registrarse
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Hero Section */}
        <motion.section style={styles.heroSection}>
          <motion.div
            style={{ ...styles.heroContent, y, opacity }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 style={styles.heroTitle}>
              <HolographicText>
                <span style={styles.heroTitleMain}>FIDELIZACIÓN</span>
                <span style={styles.heroTitleAccent}>CUÁNTICA</span>
              </HolographicText>
            </h1>
            
            <motion.p
              style={styles.heroSubtitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              La plataforma de próxima generación que revoluciona la fidelización con IA, blockchain y análisis predictivo. 
              Conecta asociaciones, comercios y socios en un ecosistema cuántico de beneficios mutuos.
            </motion.p>
            
            <motion.div
              style={styles.heroButtons}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div style={styles.heroButtonsRow}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 20px 80px rgba(0, 255, 255, 0.6)',
                    y: -5 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth/register" style={styles.primaryButton}>
                    <Rocket size={24} />
                    INICIAR AHORA
                    <ArrowRight size={24} />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    background: 'rgba(0, 255, 255, 0.1)',
                    borderColor: 'rgba(0, 255, 255, 0.6)',
                    y: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth/login" style={styles.secondaryButton}>
                    <Shield size={24} />
                    ACCESO MIEMBRO
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              style={styles.scrollIndicator}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Explorar</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  style={styles.statCard}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: stat.color,
                    boxShadow: `0 20px 60px ${stat.color}40`,
                    y: -10
                  }}
                  viewport={{ once: true }}
                >
                  <div style={styles.statIcon}>
                    <Icon size={32} color="#000" />
                  </div>
                  <div style={styles.statNumber}>{stat.number}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                  
                  {/* Holographic overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(45deg, transparent, ${stat.color}10, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          style={styles.featuresSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div style={styles.featuresHeader}>
            <motion.h2
              style={styles.featuresTitle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <HolographicText>TECNOLOGÍA CUÁNTICA</HolographicText>
            </motion.h2>
            <motion.p
              style={{ 
                fontSize: '1.25rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                maxWidth: '600px', 
                margin: '0 auto' 
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Potenciado por las tecnologías más avanzadas del futuro
            </motion.p>
          </div>
          
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  style={styles.featureCard}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'rgba(0, 255, 255, 0.4)',
                    boxShadow: '0 25px 80px rgba(0, 255, 255, 0.2)',
                    y: -5
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '2rem',
                      boxShadow: '0 10px 40px rgba(0, 255, 255, 0.3)',
                    }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon size={40} color="#000" />
                  </motion.div>
                  
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                  
                  {/* Animated border */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '24px',
                      padding: '1px',
                      background: 'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'exclude',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          style={{
            padding: '8rem 2rem',
            textAlign: 'center',
            background: 'rgba(0, 255, 255, 0.02)',
            borderTop: '1px solid rgba(0, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 0%, #00ffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '2rem',
            }}>
              ¿LISTO PARA EL FUTURO?
            </h2>
            
            <p style={{
              fontSize: '1.5rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '3rem',
              lineHeight: 1.6,
            }}>
              Únete a la revolución de la fidelización cuántica y transforma tu negocio para siempre.
            </p>
            
            <motion.div
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 25px 100px rgba(0, 255, 255, 0.6)' 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/auth/register" 
                style={{
                  ...styles.primaryButton,
                  fontSize: '1.25rem',
                  padding: '1.5rem 3rem',
                }}
              >
                <Star size={28} />
                COMENZAR AHORA
                <Sparkles size={28} />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Background effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        style={styles.footer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div style={styles.footerContent}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            fontSize: '1rem',
          }}>
            <Globe size={20} />
            <span>Hecho con ❤️ en el futuro</span>
          </div>
          <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>
            © 2024 Fidelita Quantum Platform. Todos los derechos reservados.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}