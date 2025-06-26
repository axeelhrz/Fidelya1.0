'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useComercios } from '@/hooks/useComercios';
import { 
  Receipt, 
  Gift, 
  Users, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { format, subDays, startOfMonth } from 'date-fns';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  },
  gridMd: {
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },
  gridLg: {
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  },
  card: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  cardHover: {
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      borderColor: 'rgba(148, 163, 184, 0.4)'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  iconContainer: {
    width: '3rem',
    height: '3rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease'
  },
  iconContainerHover: {
    ':hover': {
      transform: 'scale(1.1)'
    }
  },
  changeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600
  },
  changePositive: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  changeNegative: {
    backgroundColor: '#fecaca',
    color: '#991b1b'
  },
  valueSection: {
    marginBottom: '0.5rem'
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#0f172a',
    marginBottom: '0.25rem',
    lineHeight: 1.2
  },
  valueLg: {
    '@media (min-width: 1024px)': {
      fontSize: '1.875rem'
    }
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#64748b'
  },
  subtitle: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: 500
  }
};

export const StatsCards: React.FC = () => {
  const { activeBeneficios, beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();
  const { comercio } = useComercios();

  // Calculate stats
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const validacionesEsteMes = validaciones.filter(v => 
    v.fechaHora.toDate() >= startOfThisMonth
  );

  const ultimaValidacion = validaciones.length > 0 
    ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0]
    : null;

  const tiempoUltimaValidacion = ultimaValidacion 
    ? getTimeAgo(ultimaValidacion.fechaHora.toDate())
    : 'Nunca';

  const asociacionesVinculadas = comercio?.asociacionesVinculadas?.length || 0;

  const stats = [
    {
      title: 'Validaciones este mes',
      value: validacionesEsteMes.length,
      icon: Receipt,
      color: 'linear-gradient(135deg, #06b6d4 0%, #1e40af 100%)',
      bgColor: '#f0f9ff',
      textColor: '#0369a1',
      change: '+12%',
      isPositive: true,
      subtitle: `${(validacionesEsteMes.length / new Date().getDate()).toFixed(1)} por día`
    },
    {
      title: 'Beneficios activos',
      value: activeBeneficios.length,
      icon: Gift,
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      bgColor: '#f0fdf4',
      textColor: '#059669',
      change: '0%',
      isPositive: null,
      subtitle: `${beneficios.length} total`
    },
    {
      title: 'Asociaciones vinculadas',
      value: asociacionesVinculadas,
      icon: Users,
      color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      bgColor: '#faf5ff',
      textColor: '#7c3aed',
      change: '+5%',
      isPositive: true,
      subtitle: 'Activas'
    },
    {
      title: 'Última validación',
      value: tiempoUltimaValidacion,
      icon: Clock,
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bgColor: '#fffbeb',
      textColor: '#d97706',
      change: null,
      isPositive: null,
      subtitle: ultimaValidacion ? format(ultimaValidacion.fechaHora.toDate(), 'dd/MM HH:mm') : ''
    }
  ];

  return (
    <div style={{
      ...styles.grid,
      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)'
      },
      '@media (min-width: 1024px)': {
        gridTemplateColumns: 'repeat(4, 1fr)'
      }
    }}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          style={styles.card}
          className="group"
        >
          {/* Icon */}
          <div style={styles.cardHeader}>
            <div style={{
              ...styles.iconContainer,
              background: stat.color
            }}>
              <stat.icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            
            {stat.change && (
              <div style={{
                ...styles.changeIndicator,
                ...(stat.isPositive ? styles.changePositive : styles.changeNegative)
              }}>
                {stat.isPositive ? (
                  <TrendingUp style={{ width: '0.75rem', height: '0.75rem' }} />
                ) : (
                  <TrendingDown style={{ width: '0.75rem', height: '0.75rem' }} />
                )}
                {stat.change}
              </div>
            )}
          </div>

          {/* Value */}
          <div style={styles.valueSection}>
            <h3 style={{
              ...styles.value,
              '@media (min-width: 1024px)': {
                fontSize: '1.875rem'
              }
            }}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </h3>
            <p style={styles.title}>
              {stat.title}
            </p>
          </div>

          {/* Subtitle */}
          {stat.subtitle && (
            <p style={styles.subtitle}>
              {stat.subtitle}
            </p>
          )}

          <style jsx>{`
            .group:hover .icon-container {
              transform: scale(1.1);
            }
            @media (min-width: 768px) {
              .grid-md {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (min-width: 1024px) {
              .grid-lg {
                grid-template-columns: repeat(4, 1fr);
              }
            }
          `}</style>
        </motion.div>
      ))}
    </div>
  );
};

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
}