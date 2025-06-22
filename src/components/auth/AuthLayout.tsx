'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2, Sparkles, Star } from 'lucide-react';

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
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    position: 'relative' as const,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: 'flex',
    flexDirection: 'column' as const,
  },
  
  // Elementos decorativos minimalistas
  backgroundElements: {
    topCircle: {
      position: 'absolute' as const,
      top: '-10%',
      right: '-5%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.03) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(40px)',
    },
    bottomCircle: {
      position: 'absolute' as const,
      bottom: '-10%',
      left: '-5%',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(124, 58, 237, 0.02) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
    },
    gridPattern: {
      position: 'absolute' as const,
      inset: 0,
      opacity: 0.02,
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.4) 1px, transparent 0)`,
      backgroundSize: '32px 32px',
    },
  },

  header: {
    padding: '2rem 1.5rem 1rem',
    position: 'relative' as const,
    zIndex: 10,
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
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.25)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  
  logoIconShimmer: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 1.5s ease',
  },
  
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: '-0.025em',
  },
  
  logoSubtext: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  
  trustBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(79, 70, 229, 0.1)',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#475569',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  
  trustIcon: {
    width: '16px',
    height: '16px',
    color: '#4f46e5',
  },

  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    position: 'relative' as const,
    zIndex: 10,
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
    padding: '0.75rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    textDecoration: 'none',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    transition: 'all 0.3s ease',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  
  titleSection: {
    textAlign: 'center' as const,
    marginBottom: '2.5rem',
  },
  
  title: {
    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.025em',
    marginBottom: '0.75rem',
    lineHeight: 1.2,
  },
  
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    maxWidth: '380px',
    margin: '0 auto',
    lineHeight: 1.6,
    fontWeight: '500',
  },
  
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    padding: '2.5rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  
  cardTopBorder: {
    position: 'absolute' as const,
    top: 0,
    left: '20%',
    right: '20%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #4f46e5, transparent)',
    borderRadius: '1px',
  },

  footer: {
    padding: '1.5rem',
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 10,
  },
  
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontWeight: '500',
  },
  
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontWeight: '600',
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    header: {
      padding: '1.5rem 1rem 0.5rem',
    },
    headerContainer: {
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    trustBadges: {
      gap: '1rem',
    },
    trustBadge: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.6875rem',
    },
    main: {
      padding: '1.5rem 1rem',
    },
    card: {
      padding: '2rem',
      borderRadius: '16px',
    },
    title: {
      fontSize: '1.75rem',
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
      {/* Background Elements */}
      <div style={styles.backgroundElements.topCircle} />
      <div style={styles.backgroundElements.bottomCircle} />
      <div style={styles.backgroundElements.gridPattern} />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {/* Header */}
        <motion.header style={styles.header} variants={itemVariants}>
          <div style={styles.headerContainer}>
            {/* Logo */}
            <Link href="/" style={styles.logo}>
              <motion.div 
                style={styles.logoIcon}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={(e) => {
                  const shimmer = e.currentTarget.querySelector('.shimmer') as HTMLElement;
                  if (shimmer) shimmer.style.transform = 'translateX(100%)';
                }}
                onMouseLeave={(e) => {
                  const shimmer = e.currentTarget.querySelector('.shimmer') as HTMLElement;
                  if (shimmer) shimmer.style.transform = 'translateX(-100%)';
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', zIndex: 10, position: 'relative' }}>F</span>
                <div className="shimmer" style={styles.logoIconShimmer} />
              </motion.div>
              <div>
                <div style={styles.logoText}>Fidelita</div>
                <div style={styles.logoSubtext}>Elite Platform</div>
              </div>
            </Link>

            {/* Trust Badges */}
            <div style={styles.trustBadges}>
              <motion.div 
                style={styles.trustBadge}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Shield style={styles.trustIcon} />
                <span>Seguro</span>
              </motion.div>
              <motion.div 
                style={styles.trustBadge}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 style={styles.trustIcon} />
                <span>Verificado</span>
              </motion.div>
              <motion.div 
                style={styles.trustBadge}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Star style={styles.trustIcon} />
                <span>Premium</span>
              </motion.div>
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
                  <Link 
                    href={backHref} 
                    style={styles.backButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                      e.currentTarget.style.color = '#4f46e5';
                      e.currentTarget.style.transform = 'translateX(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
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
            <motion.div 
              variants={itemVariants} 
              style={{ position: 'relative' }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.card}>
                <div style={styles.cardTopBorder} />
                {children}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer style={styles.footer} variants={itemVariants}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <Sparkles size={14} />
              <span>Powered by Fidelita</span>
            </div>
            <span>•</span>
            <span>© 2024 Plataforma premium de fidelización</span>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}