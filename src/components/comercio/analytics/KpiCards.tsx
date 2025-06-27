'use client';

import React from 'react';
import { Box } from '@mui/material';
import {
  CheckCircle,
  CalendarToday,
  Business,
  LocalOffer,
  TrendingUp,
  Analytics,
  Speed,
  Timeline,
  AttachMoney,
  Group,
  Star,
  Assessment,
} from '@mui/icons-material';
import UnifiedMetricsCard from '@/components/ui/UnifiedMetricsCard';

// Definir la interfaz AnalyticsData aquí ya que no está disponible
interface AnalyticsData {
  totalValidaciones: number;
  promedioDiario: number;
  asociacionesActivas: number;
  beneficioMasUsado?: {
    nombre: string;
    usos: number;
  };
  tasaExito: number;
  crecimientoMensual: number;
  eficienciaOperativa: number;
  ingresosTotales?: number;
  sociosAlcanzados?: number;
}

interface KpiCardsProps {
  data: AnalyticsData;
  loading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data, loading = false }) => {
  const kpiData = [
    {
      title: 'Validaciones Totales',
      value: data.totalValidaciones,
      icon: <CheckCircle />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      change: 12,
      subtitle: `del período seleccionado`,
      description: 'Total de validaciones procesadas en el período de análisis seleccionado',
      trend: 'up' as const,
      progressValue: Math.min((data.totalValidaciones / 1000) * 100, 100),
      badge: data.totalValidaciones > 500 ? 'Alto Volumen' : data.totalValidaciones > 100 ? 'Activo' : undefined,
    },
    {
      title: 'Promedio Diario',
      value: data.promedioDiario.toFixed(1),
      icon: <CalendarToday />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: 8,
      subtitle: 'validaciones procesadas por día',
      description: 'Media de validaciones procesadas diariamente durante el período analizado',
      trend: 'up' as const,
      progressValue: Math.min(data.promedioDiario * 10, 100),
    },
    {
      title: 'Asociaciones Activas',
      value: data.asociacionesActivas,
      icon: <Business />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      change: 0,
      subtitle: 'asociaciones con validaciones',
      description: 'Número de asociaciones que han utilizado beneficios durante el período',
      trend: 'neutral' as const,
      progressValue: Math.min(data.asociacionesActivas * 25, 100),
      badge: data.asociacionesActivas > 5 ? 'Múltiple' : undefined,
    },
    {
      title: 'Beneficio Más Popular',
      value: data.beneficioMasUsado?.nombre || 'Sin datos',
      displayValue: data.beneficioMasUsado?.usos || 0,
      icon: <LocalOffer />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: 15,
      subtitle: `${data.beneficioMasUsado?.usos || 0} usos registrados`,
      description: 'Beneficio con mayor número de validaciones en el período analizado',
      trend: 'up' as const,
      badge: data.beneficioMasUsado?.usos ? 'Popular' : undefined,
      progressValue: data.beneficioMasUsado?.usos ? Math.min((data.beneficioMasUsado.usos / 50) * 100, 100) : 0,
    },
  ];

  // Métricas adicionales para análisis más profundo
  const additionalMetrics = [
    {
      title: 'Tasa de Éxito',
      value: `${data.tasaExito?.toFixed(1) || '0.0'}%`,
      icon: <TrendingUp />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: data.tasaExito > 80 ? 10 : data.tasaExito > 60 ? 5 : -5,
      subtitle: 'de validaciones exitosas',
      description: 'Porcentaje de validaciones que se completaron exitosamente sin errores',
      trend: data.tasaExito > 80 ? 'up' as const : data.tasaExito < 60 ? 'down' as const : 'neutral' as const,
      progressValue: data.tasaExito || 0,
      badge: data.tasaExito > 90 ? 'Excelente' : data.tasaExito > 70 ? 'Bueno' : undefined,
    },
    {
      title: 'Crecimiento Mensual',
      value: `${data.crecimientoMensual?.toFixed(1) || '0.0'}%`,
      icon: <Analytics />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      change: data.crecimientoMensual || 0,
      subtitle: 'comparado con mes anterior',
      description: 'Porcentaje de crecimiento en validaciones comparado con el mes anterior',
      trend: (data.crecimientoMensual || 0) > 0 ? 'up' as const : (data.crecimientoMensual || 0) < 0 ? 'down' as const : 'neutral' as const,
      progressValue: Math.min(Math.abs(data.crecimientoMensual || 0) * 2, 100),
    },
    {
      title: 'Eficiencia Operativa',
      value: `${data.eficienciaOperativa?.toFixed(0) || '0'}%`,
      icon: <Speed />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      change: 5,
      subtitle: 'índice de eficiencia general',
      description: 'Índice de eficiencia operativa calculado basado en múltiples métricas',
      trend: 'up' as const,
      progressValue: data.eficienciaOperativa || 0,
      badge: (data.eficienciaOperativa || 0) > 85 ? 'Óptimo' : undefined,
    },
    {
      title: 'Ingresos Generados',
      value: data.ingresosTotales ? `$${data.ingresosTotales.toLocaleString()}` : '$0',
      icon: <AttachMoney />,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      change: 18,
      subtitle: 'ingresos del período',
      description: 'Total de ingresos generados a través de las validaciones',
      trend: 'up' as const,
      progressValue: data.ingresosTotales ? Math.min((data.ingresosTotales / 10000) * 100, 100) : 0,
      badge: (data.ingresosTotales || 0) > 5000 ? 'Alto' : undefined,
    },
    {
      title: 'Socios Alcanzados',
      value: data.sociosAlcanzados || 0,
      icon: <Group />,
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      change: 22,
      subtitle: 'socios únicos atendidos',
      description: 'Número de socios únicos que han utilizado beneficios',
      trend: 'up' as const,
      progressValue: data.sociosAlcanzados ? Math.min((data.sociosAlcanzados / 200) * 100, 100) : 0,
    },
    {
      title: 'Puntuación General',
      value: `${Math.min(((data.tasaExito || 0) + (data.eficienciaOperativa || 0)) / 2, 100).toFixed(0)}%`,
      icon: <Star />,
      color: '#d97706',
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      change: 7,
      subtitle: 'puntuación de rendimiento',
      description: 'Puntuación general basada en todas las métricas de rendimiento',
      trend: 'up' as const,
      progressValue: Math.min(((data.tasaExito || 0) + (data.eficienciaOperativa || 0)) / 2, 100),
      badge: Math.min(((data.tasaExito || 0) + (data.eficienciaOperativa || 0)) / 2, 100) > 80 ? 'Destacado' : undefined,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Métricas principales - tamaño grande */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4, 
        mb: 5,
        '& > *': {
          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', lg: '1 1 calc(25% - 24px)' },
          minWidth: '280px'
        }
      }}>
        {kpiData.map((kpi, index) => (
          <UnifiedMetricsCard
            key={index}
            {...kpi}
            loading={loading}
            size="large" // Tamaño grande para métricas principales
            variant="detailed"
            showProgress={true}
            delay={index * 0.1}
          />
        ))}
      </Box>

      {/* Métricas secundarias - tamaño medio */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4,
        '& > *': {
          flex: { 
            xs: '1 1 100%', 
            sm: '1 1 calc(50% - 16px)', 
            md: '1 1 calc(33.333% - 21.33px)', 
            lg: '1 1 calc(16.666% - 26.67px)' 
          },
          minWidth: '240px'
        }
      }}>
        {additionalMetrics.map((metric, index) => (
          <UnifiedMetricsCard
            key={index}
            {...metric}
            loading={loading}
            size="medium" // Tamaño medio para métricas secundarias
            variant="detailed"
            delay={(index + 4) * 0.1}
          />
        ))}
      </Box>
    </Box>
  );
};