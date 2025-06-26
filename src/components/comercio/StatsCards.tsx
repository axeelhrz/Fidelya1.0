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
      color: '#06b6d4',
      change: '+12%',
      isPositive: true,
      subtitle: `${(validacionesEsteMes.length / new Date().getDate()).toFixed(1)} por día`
    },
    {
      title: 'Beneficios activos',
      value: activeBeneficios.length,
      icon: Gift,
      color: '#10b981',
      change: '0%',
      isPositive: null,
      subtitle: `${beneficios.length} total`
    },
    {
      title: 'Asociaciones vinculadas',
      value: asociacionesVinculadas,
      icon: Users,
      color: '#8b5cf6',
      change: '+5%',
      isPositive: true,
      subtitle: 'Activas'
    },
    {
      title: 'Última validación',
      value: tiempoUltimaValidacion,
      icon: Clock,
      color: '#f59e0b',
      change: null,
      isPositive: null,
      subtitle: ultimaValidacion ? format(ultimaValidacion.fechaHora.toDate(), 'dd/MM HH:mm') : ''
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px'
    }}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: stat.color,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            
            {stat.change && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: stat.isPositive ? '#dcfce7' : '#fecaca',
                color: stat.isPositive ? '#166534' : '#991b1b'
              }}>
                {stat.isPositive ? (
                  <TrendingUp style={{ width: '12px', height: '12px' }} />
                ) : (
                  <TrendingDown style={{ width: '12px', height: '12px' }} />
                )}
                {stat.change}
              </div>
            )}
          </div>

          {/* Value */}
          <div style={{ marginBottom: '8px' }}>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '4px',
              lineHeight: 1
            }}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748b'
            }}>
              {stat.title}
            </p>
          </div>

          {/* Subtitle */}
          {stat.subtitle && (
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: 500
            }}>
              {stat.subtitle}
            </p>
          )}
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