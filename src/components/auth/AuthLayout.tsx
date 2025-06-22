'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2, Crown, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  variant?: 'default' | 'compact';
}

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
    width: '120px',
    height: '120px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '30px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  floatingElement2: {
    position: 'absolute' as const,
    bottom: '15%',
    left: '8%',
    width: '80px',
    height: '80px',
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
    transition: 'all 0.3s ease',
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
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: '-0.025em',
  },
  logoSubtext: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  trustIndicators: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  trustIcon: {
    padding: '8px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    marginBottom: '2rem',
  },
  titleSection: {
    textAlign: 'center' as const,
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: '-0.025em',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.8)',
    maxWidth: '380px',
    margin: '0 auto',
    lineHeight: 1.6,
    fontWeight: '500',
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '24px',
    boxShadow: '0 32px 64px rgba(0,0,0,0.1)',
    padding: '2.5rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
    borderRadius: '24px',
    filter: 'blur(20px)',
    transform: 'scale(1.1)',
    zIndex: -1,
  },
  footer: {
    padding: '1.5rem 1rem 2rem',
    textAlign: 'center' as const,
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '0.75rem',
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
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref = '/auth/register',
  variant = 'default' 
}: AuthLayoutProps) {
  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern} />
      
      {/* Floating Elements */}
      <motion.div
        style={styles.floatingElement1}
        animate={{
          y: [0, -12, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={styles.floatingElement2}
        animate={{
          y: [0, 8, 0],
          rotate: [0, -1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
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
            <Link href="/" style={styles.logo}>
              <div style={styles.logoIcon}>
                <span style={styles.logoText}>F</span>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.025em' }}>
                  Fidelita
                </div>
                <div style={styles.logoSubtext}>
                  Premium Platform
                </div>
              </div>
            </Link>

            {/* Trust Indicators */}
            <div style={styles.trustIndicators}>
              <div style={styles.trustItem}>
                <div style={styles.trustIcon}>
                  <Shield size={16} color="rgba(255,255,255,0.9)" />
                </div>
                <span>Seguro</span>
              </div>
              <div style={styles.trustItem}>
                <div style={styles.trustIcon}>
                  <CheckCircle2 size={16} color="rgba(255,255,255,0.9)" />
                </div>
                <span>Confiable</span>
              </div>
              <div style={styles.trustItem}>
                <div style={styles.trustIcon}>
                  <Crown size={16} color="rgba(255,255,255,0.9)" />
                </div>
                <span>Premium</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.formContainer}>
            {/* Back Button */}
            <AnimatePresence>
              {showBackButton && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  variants={itemVariants}
                >
                  <Link href={backHref} style={styles.backButton}>
                    <ArrowLeft size={16} />
                    Volver
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title Section */}
            <motion.div style={styles.titleSection} variants={itemVariants}>
              <h1 style={styles.title}>{title}</h1>
              {subtitle && (
                <p style={styles.subtitle}>{subtitle}</p>
              )}
            </motion.div>

            {/* Form Card */}
            <motion.div variants={itemVariants} style={{ position: 'relative' }}>
              <div style={styles.cardGlow} />
              <div style={styles.card}>
                {children}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer style={styles.footer} variants={itemVariants}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                <Sparkles size={12} />
                <span style={{ fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.1em' }}>Powered by</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Fidelita</span>
            </div>
            <p style={styles.footerText}>
              © 2024 Fidelita. Plataforma premium de fidelización.
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}