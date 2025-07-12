'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Activity, 
  Target,
  Calendar,
  Heart,
  Brain,
  Zap
} from 'lucide-react';
import { KPIMetric } from '@/types/dashboard';
import KPICard from './KPICard';
import { useStyles } from '@/lib/useStyles';

interface KPIGridProps {
  metrics: KPIMetric[];
  onCardClick?: (metric: KPIMetric) => void;
}

// Helper function to get icon based on KPI name/type
const getKPIIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('revenue') || lowerName.includes('income') || lowerName.includes('financial')) {
    return <DollarSign size={20} />;
  }
  if (lowerName.includes('patient') || lowerName.includes('client')) {
    return <Users size={20} />;
  }
  if (lowerName.includes('session') || lowerName.includes('appointment')) {
    return <Calendar size={20} />;
  }
  if (lowerName.includes('satisfaction') || lowerName.includes('rating')) {
    return <Heart size={20} />;
  }
  if (lowerName.includes('clinical') || lowerName.includes('treatment')) {
    return <Brain size={20} />;
  }
  if (lowerName.includes('efficiency') || lowerName.includes('performance')) {
    return <Zap size={20} />;
  }
  if (lowerName.includes('target') || lowerName.includes('goal')) {
    return <Target size={20} />;
  }
  
  return <Activity size={20} />;
};

// Helper function to get color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return '#10B981'; // green
    case 'warning':
      return '#F59E0B'; // amber
    case 'error':
      return '#EF4444'; // red
    default:
      return '#6366F1'; // indigo
  }
};

// Helper function to format change percentage
const formatChange = (current: number, previous: number, trend: string) => {
  if (previous === 0) return '';
  
  const changePercent = ((current - previous) / previous * 100).toFixed(1);
  const isPositive = trend === 'up';
  const sign = isPositive ? '+' : '';
  
  return `${sign}${changePercent}% vs anterior`;
};

export default function KPIGrid({ metrics, onCardClick }: KPIGridProps) {
  const { theme, responsive } = useStyles();

  const styles = {
    container: {
      width: '100%',
      padding: `0 ${theme.spacing.md}`,
    },
    
    grid: {
      display: 'grid',
      gap: theme.spacing.md,
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      maxWidth: '1400px',
      margin: '0 auto',
      
      // Responsive breakpoints
      ...(typeof window !== 'undefined' && {
        gridTemplateColumns: responsive.getResponsiveValue({
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }),
      }),
    },
    
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      textAlign: 'center' as const,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.primary,
    },
    
    emptyIcon: {
      width: '4rem',
      height: '4rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.xl,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
      border: `1px solid ${theme.colors.borderLight}`,
    },
    
    emptyTitle: {
      fontSize: '1.125rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      marginBottom: '0.5rem',
      fontFamily: theme.fonts.heading,
    },
    
    emptyDescription: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      maxWidth: '24rem',
      lineHeight: 1.6,
    },
  };

  if (!metrics || metrics.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.container}
      >
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.textTertiary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No hay métricas disponibles</h3>
          <p style={styles.emptyDescription}>
            Los datos de KPI se cargarán automáticamente cuando estén disponibles.
            Verifica tu conexión o contacta al administrador del sistema.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={styles.container}
    >
      <div style={styles.grid}>
        {metrics.map((metric) => (
          <div
            key={metric.id}
            onClick={() => onCardClick?.(metric)}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
          >
            <KPICard
              title={metric.name}
              value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ''}`}
              icon={getKPIIcon(metric.name)}
              color={getStatusColor(metric.status)}
              change={formatChange(metric.value, metric.previousValue, metric.trend)}
              description={metric.target ? `Meta: ${metric.target}${metric.unit ? ` ${metric.unit}` : ''}` : undefined}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}