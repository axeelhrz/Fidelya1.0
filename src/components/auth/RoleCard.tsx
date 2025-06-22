'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Store, Users, ArrowRight, Star, Shield, Zap, Crown, CheckCircle2, Sparkles } from 'lucide-react';

interface RoleCardProps {
  role: 'asociacion' | 'socio' | 'comercio';
  title: string;
  description: string;
  href: string;
  features?: string[];
  popular?: boolean;
}

const roleConfig = {
  asociacion: {
    icon: Building2,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
    borderColor: '#93c5fd',
    iconBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.2) 100%)',
    iconColor: '#1d4ed8',
    shadowColor: 'rgba(59, 130, 246, 0.2)',
    accentColor: '#1d4ed8',
    features: ['Gestión completa', 'Analytics avanzados', 'Soporte premium']
  },
  socio: {
    icon: Users,
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(4, 120, 87, 0.05) 100%)',
    borderColor: '#6ee7b7',
    iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(110, 231, 183, 0.2) 100%)',
    iconColor: '#047857',
    shadowColor: 'rgba(16, 185, 129, 0.2)',
    accentColor: '#047857',
    features: ['Beneficios exclusivos', 'Puntos de fidelidad', 'Descuentos especiales']
  },
  comercio: {
    icon: Store,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
    borderColor: '#c4b5fd',
    iconBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.2) 100%)',
    iconColor: '#7c3aed',
    shadowColor: 'rgba(139, 92, 246, 0.2)',
    accentColor: '#7c3aed',
    features: ['Fidelización clientes', 'Dashboard completo', 'Campañas automáticas']
  }
};

const styles = {
  container: {
    position: 'relative' as const,
  },
  popularBadge: {
    position: 'absolute' as const,
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: '#ffffff',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(79, 70, 229, 0.2)',
  },
  card: (config: any) => ({
    display: 'block',
    position: 'relative' as const,
    borderRadius: '24px',
    border: `2px solid ${config.borderColor}`,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    transition: 'all 0.5s ease',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
  }),
  cardHover: (config: any) => ({
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: `0 32px 64px ${config.shadowColor}`,
    background: '#ffffff',
  }),
  backgroundGradient: (config: any) => ({
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '24px',
    background: config.bgGradient,
    opacity: 0,
    transition: 'opacity 0.5s ease',
  }),
  topLine: (config: any) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${config.accentColor}30, transparent)`,
  }),
  content: {
    position: 'relative' as const,
    zIndex: 10,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  iconContainer: (config: any) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '24px',
    background: config.iconBg,
    border: `2px solid ${config.borderColor}`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden',
  }),
  shimmer: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 1s ease',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: (config: any) => ({
    fontSize: '1.25rem',
    fontWeight: '900',
    color: '#1f2937',
    letterSpacing: '-0.025em',
    marginBottom: '0.5rem',
    transition: 'color 0.3s ease',
  }),
  verified: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  verifiedText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: '-0.025em',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    border: '2px solid #e5e7eb',
    transition: 'all 0.3s ease',
  },
  description: {
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '2rem',
    fontSize: '1rem',
    fontWeight: '500',
  },
  features: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  featureIcon: (config: any) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '12px',
    background: config.iconBg,
    border: `2px solid ${config.borderColor}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  }),
  featureText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    letterSpacing: '-0.025em',
  },
  bottomAccent: (config: any) => ({
    position: 'absolute' as const,
    bottom: 0,
    left: '2rem',
    right: '2rem',
    height: '6px',
    background: config.gradient,
    borderRadius: '3px',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.5s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }),
  hoverGlow: (config: any) => ({
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '24px',
    background: config.gradient,
    opacity: 0,
    filter: 'blur(20px)',
    transition: 'opacity 0.5s ease',
  }),
  decorativeElements: (config: any) => ({
    bottomRight: {
      position: 'absolute' as const,
      bottom: '1.5rem',
      right: '1.5rem',
      width: '64px',
      height: '64px',
      background: config.bgGradient,
      borderRadius: '24px',
      filter: 'blur(4px)',
      opacity: 0.5,
    },
    topLeft: {
      position: 'absolute' as const,
      top: '1.5rem',
      left: '1.5rem',
      width: '40px',
      height: '40px',
      background: config.bgGradient,
      borderRadius: '16px',
      filter: 'blur(4px)',
      opacity: 0.3,
    },
  }),
  dotPattern: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.02,
    pointerEvents: 'none' as const,
    borderRadius: '24px',
    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
    backgroundSize: '24px 24px',
  },
};

export function RoleCard({ role, title, description, href, popular = false }: RoleCardProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div style={styles.container}>
      {/* Popular Badge */}
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={styles.popularBadge}
        >
          <Crown size={16} />
          <span>Popular</span>
          <Sparkles size={12} />
        </motion.div>
      )}

      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href={href} style={styles.card(config)}>
          {/* Background Gradient */}
          <div style={styles.backgroundGradient(config)} />
          
          {/* Top Line */}
          <div style={styles.topLine(config)} />
          
          {/* Content */}
          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.leftSection}>
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  style={styles.iconContainer(config)}
                >
                  <Icon size={36} color={config.iconColor} style={{ position: 'relative', zIndex: 10 }} />
                  <div style={styles.shimmer} />
                </motion.div>

                <div style={styles.titleSection}>
                  <h3 style={styles.title(config)}>{title}</h3>
                  <div style={styles.verified}>
                    <Shield size={16} color="#9ca3af" />
                    <span style={styles.verifiedText}>Verificado</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <motion.div
                whileHover={{ x: 6, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                style={styles.arrowContainer}
              >
                <ArrowRight size={24} color="#6b7280" />
              </motion.div>
            </div>

            {/* Description */}
            <p style={styles.description}>{description}</p>

            {/* Features */}
            <div style={styles.features}>
              {config.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={styles.feature}
                >
                  <div style={styles.featureIcon(config)}>
                    <CheckCircle2 size={16} color={config.iconColor} />
                  </div>
                  <span style={styles.featureText}>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Bottom Accent Line */}
            <div style={styles.bottomAccent(config)} />
          </div>

          {/* Hover Glow Effect */}
          <div style={styles.hoverGlow(config)} />
          
          {/* Decorative Elements */}
          <div style={styles.decorativeElements(config).bottomRight} />
          <div style={styles.decorativeElements(config).topLeft} />
          
          {/* Dot Pattern */}
          <div style={styles.dotPattern} />
        </Link>
      </motion.div>
    </div>
  );
}