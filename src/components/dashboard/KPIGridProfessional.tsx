'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KPIMetric } from '@/types/dashboard';
import KPICardProfessional from './KPICardProfessional';
import { useStyles } from '@/lib/useStyles';

interface KPIGridProfessionalProps {
  metrics: KPIMetric[];
  onCardClick?: (metric: KPIMetric) => void;
  columns?: 2 | 3 | 4;
  showEmptyState?: boolean;
}

export default function KPIGridProfessional({ 
  metrics, 
  onCardClick,
  columns = 4,
  showEmptyState = true
}: KPIGridProfessionalProps) {
  const { theme, responsive } = useStyles();

  const styles = {
    container: {
      width: '100%',
      padding: `0 ${theme.spacing.md}`,
    },
    
    grid: {
      display: 'grid',
      gap: theme.spacing.lg,
      maxWidth: '1400px',
      margin: '0 auto',
      gridTemplateColumns: responsive.getResponsiveValue({
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: columns >= 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
        lg: `repeat(${columns}, 1fr)`,
      }),
    },
    
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${theme.spacing.xl} ${theme.spacing.md}`,
      textAlign: 'center' as const,
      backgroundColor: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      borderRadius: theme.borderRadius.xxl,
      border: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadows.card,
    },
    
    emptyIcon: {
      width: '5rem',
      height: '5rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.xl,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
      border: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadows.inner,
    },
    
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
      fontFamily: theme.fonts.heading,
    },
    
    emptyDescription: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      maxWidth: '28rem',
      lineHeight: 1.6,
      marginBottom: theme.spacing.lg,
    },
    
    emptyActions: {
      display: 'flex',
      gap: theme.spacing.sm,
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
    },
    
    refreshButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.colors.primary,
      color: theme.colors.textInverse,
      borderRadius: theme.borderRadius.lg,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      fontFamily: theme.fonts.heading,
      transition: theme.animations.transition,
      outline: 'none',
    },
    
    refreshButtonHover: {
      backgroundColor: theme.colors.primaryDark,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.glow,
    },
    
    contactButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: 'transparent',
      color: theme.colors.textSecondary,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.borderLight}`,
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.medium,
      fontFamily: theme.fonts.heading,
      transition: theme.animations.transition,
      outline: 'none',
    },
    
    contactButtonHover: {
      backgroundColor: theme.colors.surfaceHover,
      borderColor: theme.colors.borderMedium,
      color: theme.colors.textPrimary,
    },
    
    loadingGrid: {
      display: 'grid',
      gap: theme.spacing.lg,
      maxWidth: '1400px',
      margin: '0 auto',
      gridTemplateColumns: responsive.getResponsiveValue({
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }),
    },
    
    loadingCard: {
      height: '20rem',
      backgroundColor: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      borderRadius: theme.borderRadius.xxl,
      border: `1px solid ${theme.colors.borderLight}`,
      position: 'relative' as const,
      overflow: 'hidden',
    },
    
    loadingShimmer: {
      position: 'absolute' as const,
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, transparent, ${theme.colors.surfaceHover}, transparent)`,
      animation: 'shimmer 2s infinite',
    },
    
    statsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadows.card,
    },
    
    statItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.25rem',
    },
    
    statValue: {
      fontSize: '1.5rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
    },
    
    statLabel: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
  };

  const getMetricsStats = () => {
    if (!metrics || metrics.length === 0) return null;
    
    const totalMetrics = metrics.length;
    const successMetrics = metrics.filter(m => m.status === 'success').length;
    const warningMetrics = metrics.filter(m => m.status === 'warning').length;
    const errorMetrics = metrics.filter(m => m.status === 'error').length;
    
    return { totalMetrics, successMetrics, warningMetrics, errorMetrics };
  };

  const stats = getMetricsStats();

  const LoadingGrid = () => (
    <div style={styles.loadingGrid}>
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          style={styles.loadingCard}
        >
          <div style={styles.loadingShimmer} />
        </motion.div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={styles.emptyState}
    >
      <div style={styles.emptyIcon}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.colors.textTertiary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="8" cy="8" r="1" />
          <circle cx="16" cy="16" r="1" />
        </svg>
      </div>
      
      <h3 style={styles.emptyTitle}>
        No hay métricas KPI disponibles
      </h3>
      
      <p style={styles.emptyDescription}>
        Los indicadores clave de rendimiento se cargarán automáticamente cuando los datos estén disponibles. 
        Esto puede tomar unos momentos mientras se sincronizan los sistemas.
      </p>
      
      <div style={styles.emptyActions}>
        <motion.button
          style={styles.refreshButton}
          whileHover={styles.refreshButtonHover}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Actualizar datos
        </motion.button>
        
        <motion.button
          style={styles.contactButton}
          whileHover={styles.contactButtonHover}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Contactar soporte
        </motion.button>
      </div>
    </motion.div>
  );

  if (!metrics) {
    return (
      <>
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div style={styles.container}>
          <LoadingGrid />
        </div>
      </>
    );
  }

  if (metrics.length === 0 && showEmptyState) {
    return (
      <div style={styles.container}>
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={styles.container}
      >
        {/* Estadísticas de métricas */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={styles.statsContainer}
          >
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.totalMetrics}</span>
              <span style={styles.statLabel}>Total KPIs</span>
            </div>
            
            <div style={{ width: '1px', height: '2rem', backgroundColor: theme.colors.borderLight }} />
            
            <div style={styles.statItem}>
              <span style={{...styles.statValue, color: theme.colors.success}}>
                {stats.successMetrics}
              </span>
              <span style={styles.statLabel}>Exitosos</span>
            </div>
            
            <div style={{ width: '1px', height: '2rem', backgroundColor: theme.colors.borderLight }} />
            
            <div style={styles.statItem}>
              <span style={{...styles.statValue, color: theme.colors.warning}}>
                {stats.warningMetrics}
              </span>
              <span style={styles.statLabel}>Advertencia</span>
            </div>
            
            <div style={{ width: '1px', height: '2rem', backgroundColor: theme.colors.borderLight }} />
            
            <div style={styles.statItem}>
              <span style={{...styles.statValue, color: theme.colors.error}}>
                {stats.errorMetrics}
              </span>
              <span style={styles.statLabel}>Críticos</span>
            </div>
          </motion.div>
        )}

        {/* Grid de KPIs */}
        <div style={styles.grid}>
          {metrics.map((metric, index) => (
            <KPICardProfessional
              key={metric.id}
              metric={metric}
              index={index}
              onClick={() => onCardClick?.(metric)}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}