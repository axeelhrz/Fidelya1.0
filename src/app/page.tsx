'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Building2, Store, Star, Zap, Crown, CheckCircle2, TrendingUp, Award, Sparkles, Heart, Globe } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  backgroundPattern: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.1,
    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
    backgroundSize: '40px 40px',
  },
  floatingElement1: {
    position: 'absolute' as const,
    top: '10%',
    right: '10%',
    width: '150px',
    height: '150px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '30px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  floatingElement2: {
    position: 'absolute' as const,
    bottom: '15%',
    left: '8%',
    width: '100px',
    height: '100px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '50%',
    backdropFilter: 'blur(8px)',
  },
  contentWrapper: {
    position: 'relative' as const,
    zIndex: 10,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    padding: '2rem 1rem 1.5rem',
  },
  headerContainer: {
    maxWidth: '1200px',
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
  },
  logoIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#1e293b',
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: '-0.025em',
  },
  logoSubtext: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  loginButton: {
    background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  registerButton: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    color: '#1e293b',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
  },
  heroContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center' as const,
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: '-0.025em',
    marginBottom: '1.5rem',
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.9)',
    maxWidth: '600px',
    margin: '0 auto 3rem',
    lineHeight: 1.6,
    fontWeight: '500',
  },
  ctaContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '4rem',
    flexWrap: 'wrap' as const,
  },
  primaryCta: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    color: '#1e293b',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: '700',
    textDecoration: 'none',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  },
  secondaryCta: {
    padding: '1rem 2rem',
    background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.9)',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: '700',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  statCard: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '2rem',
    textAlign: 'center' as const,
  },
  statIcon: {
    width: '60px',
    height: '60px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  footer: {
    padding: '2rem 1rem',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const statsData = [
  { icon: Building2, number: '500+', label: 'Asociaciones', color: '#3b82f6' },
  { icon: Store, number: '2K+', label: 'Comercios', color: '#8b5cf6' },
  { icon: Users, number: '50K+', label: 'Socios Activos', color: '#10b981' },
  { icon: Award, number: '98%', label: 'Satisfacción', color: '#f59e0b' },
];

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern} />
      
      {/* Floating Elements */}
      <motion.div
        style={styles.floatingElement1}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={styles.floatingElement2}
        animate={{
          y: [0, 10, 0],
          rotate: [0, -2, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Content */}
      <motion.div
        style={styles.contentWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header style={styles.header} variants={itemVariants}>
          <div style={styles.headerContainer}>
            {/* Logo */}
            <div style={styles.logo}>
              <div style={styles.logoIcon}>F</div>
              <div>
                <div style={styles.logoText}>Fidelita</div>
                <div style={styles.logoSubtext}>Premium Platform</div>
              </div>
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
              <Link href="/auth/login" style={{...styles.navButton, ...styles.loginButton}}>
                <Shield size={16} />
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" style={{...styles.navButton, ...styles.registerButton}}>
                <Sparkles size={16} />
                Registrarse
              </Link>
            </nav>
          </div>
        </motion.header>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.heroContainer}>
            {/* Hero Title */}
            <motion.h1 style={styles.heroTitle} variants={itemVariants}>
              La Plataforma de
              <br />
              <span style={{background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Fidelización Premium
              </span>
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p style={styles.heroSubtitle} variants={itemVariants}>
              Conectamos asociaciones, comercios y socios en un ecosistema único de beneficios y recompensas. 
              Descubre una nueva forma de fidelizar y ser fidelizado.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div style={styles.ctaContainer} variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/register" style={styles.primaryCta}>
                  <Crown size={20} />
                  Comenzar Ahora
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/login" style={styles.secondaryCta}>
                  <Users size={20} />
                  Ya soy miembro
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div style={styles.statsContainer} variants={itemVariants}>
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    style={styles.statCard}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={styles.statIcon}>
                      <Icon size={28} color={stat.color} />
                    </div>
                    <div style={styles.statNumber}>{stat.number}</div>
                    <div style={styles.statLabel}>{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer style={styles.footer} variants={itemVariants}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
              <Heart size={16} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Hecho con amor en</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
              <Globe size={16} />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>España</span>
            </div>
          </div>
          <p style={styles.footerText}>
            © 2024 Fidelita. Todos los derechos reservados. Plataforma premium de fidelización.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}