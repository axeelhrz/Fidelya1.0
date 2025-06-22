'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleCard } from '@/components/auth/RoleCard';
import { Button } from '@/components/ui/Button';
import { LogIn, ArrowRight, Users, Building2, Store, Star, Shield, Zap, Crown, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '20px',
    border: '2px solid #e5e7eb',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  topLine: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)',
  },
  statItem: {
    textAlign: 'center' as const,
  },
  statIcon: (bgColor: string, borderColor: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    margin: '0 auto 0.75rem',
    background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}80 100%)`,
    borderRadius: '16px',
    border: `2px solid ${borderColor}`,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  }),
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#1f2937',
    letterSpacing: '-0.025em',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  rolesContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  loginSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  divider: {
    position: 'relative' as const,
  },
  dividerLine: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
  },
  dividerBorder: {
    width: '100%',
    borderTop: '2px solid #e5e7eb',
  },
  dividerText: {
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  dividerSpan: {
    padding: '0 1.5rem',
    background: '#ffffff',
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: '-0.025em',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    height: '56px',
    padding: '0 2rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    fontSize: '0.875rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  },
  benefitsContainer: {
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
    border: '2px solid rgba(79, 70, 229, 0.2)',
    borderRadius: '20px',
    padding: '2rem',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(79, 70, 229, 0.1)',
  },
  benefitsTopLine: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.5), transparent)',
  },
  benefitsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  benefitsIcon: {
    padding: '0.75rem',
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)',
    borderRadius: '16px',
    border: '2px solid rgba(79, 70, 229, 0.2)',
    boxShadow: '0 4px 16px rgba(79, 70, 229, 0.1)',
  },
  benefitsTitle: {
    fontSize: '1.125rem',
    fontWeight: '900',
    color: '#312e81',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
    letterSpacing: '-0.025em',
  },
  benefitsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    fontSize: '0.875rem',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  benefitDot: {
    width: '12px',
    height: '12px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
  },
  benefitText: {
    color: '#312e81',
    fontWeight: '600',
    letterSpacing: '-0.025em',
  },
  decorativeElements: {
    bottomRight: {
      position: 'absolute' as const,
      bottom: '1rem',
      right: '1rem',
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
      borderRadius: '16px',
      filter: 'blur(4px)',
    },
    topLeft: {
      position: 'absolute' as const,
      top: '1rem',
      left: '1rem',
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
      borderRadius: '12px',
      filter: 'blur(4px)',
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
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

const statsVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const statsData = [
  { icon: Building2, number: '500+', label: 'Asociaciones', bgColor: '#dbeafe', borderColor: '#93c5fd', iconColor: '#1d4ed8' },
  { icon: Store, number: '2K+', label: 'Comercios', bgColor: '#e9d5ff', borderColor: '#c4b5fd', iconColor: '#7c3aed' },
  { icon: Users, number: '50K+', label: 'Socios', bgColor: '#d1fae5', borderColor: '#6ee7b7', iconColor: '#047857' },
];

const benefits = [
  'Plataforma premium',
  'Soporte 24/7',
  'Seguridad avanzada',
  'Analytics en tiempo real',
];

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Únete a Fidelita"
      subtitle="Elige el tipo de cuenta que mejor se adapte a tus necesidades y comienza a disfrutar de beneficios exclusivos"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={styles.container}
      >
        {/* Statistics */}
        <motion.div variants={statsVariants} style={styles.statsContainer}>
          <div style={styles.topLine} />
          
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={styles.statItem}>
                <div style={styles.statIcon(stat.bgColor, stat.borderColor)}>
                  <Icon size={28} color={stat.iconColor} />
                </div>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Role Cards */}
        <div style={styles.rolesContainer}>
          <motion.div variants={itemVariants}>
            <RoleCard
              role="asociacion"
              title="Asociación"
              description="Para organizaciones que gestionan programas de fidelidad y beneficios comunitarios de manera profesional"
              href="/auth/register/asociacion"
              popular={false}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RoleCard
              role="socio"
              title="Socio"
              description="Para personas que quieren acceder a beneficios exclusivos y programas de fidelidad premium"
              href="/auth/register/socio"
              popular={true}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RoleCard
              role="comercio"
              title="Comercio"
              description="Para negocios que desean ofrecer beneficios únicos y fidelizar a sus clientes de manera efectiva"
              href="/auth/register/comercio"
              popular={false}
            />
          </motion.div>
        </div>

        {/* Login Section */}
        <motion.div variants={itemVariants} style={styles.loginSection}>
          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}>
              <div style={styles.dividerBorder} />
            </div>
            <div style={styles.dividerText}>
              <span style={styles.dividerSpan}>¿Ya tienes cuenta?</span>
            </div>
          </div>
          
          {/* Login Button */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/auth/login" style={styles.loginButton}>
              <LogIn size={20} />
              Iniciar sesión
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div variants={itemVariants} style={styles.benefitsContainer}>
          <div style={styles.benefitsTopLine} />
          
          <div style={styles.benefitsHeader}>
            <div style={styles.benefitsIcon}>
              <Crown size={28} color="#4f46e5" />
            </div>
          </div>
          
          <h3 style={styles.benefitsTitle}>¿Por qué elegir Fidelita?</h3>
          
          <div style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <div key={benefit} style={styles.benefitItem}>
                <div style={styles.benefitDot} />
                <span style={styles.benefitText}>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div style={styles.decorativeElements.bottomRight} />
          <div style={styles.decorativeElements.topLeft} />
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}