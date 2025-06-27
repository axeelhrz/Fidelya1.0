'use client';

import React from 'react';
import { Grid, Box } from '@mui/material';
import {
  CheckCircle,
  CalendarToday,
  Business,
  LocalOffer,
  TrendingUp,
  Analytics,
  Speed,
  Timeline,
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
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      change: 12,
      subtitle: 'del período seleccionado',
      description: 'Total de validaciones procesadas',
      trend: 'up' as const,
      progressValue: Math.min((data.totalValidaciones / 1000) * 100, 100),
    },
    {
      title: 'Promedio Diario',
      value: data.promedioDiario.toFixed(1),
      icon: <CalendarToday sx={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: 8,
      subtitle: 'validaciones por día',
      description: 'Media de validaciones diarias',
      trend: 'up' as const,
      progressValue: Math.min(data.promedioDiario * 10, 100),
    },
    {
      title: 'Asociaciones Activas',
      value: data.asociacionesActivas,
      icon: <Business sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      change: 0,
      subtitle: 'con validaciones',
      description: 'Asociaciones que han usado beneficios',
      trend: 'neutral' as const,
      progressValue: Math.min(data.asociacionesActivas * 25, 100),
    },
    {
      title: 'Beneficio Top',
      value: data.beneficioMasUsado?.nombre || 'N/A',
      displayValue: data.beneficioMasUsado?.usos || 0,
      icon: <LocalOffer sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: 15,
      subtitle: `${data.beneficioMasUsado?.usos || 0} usos`,
      description: 'Beneficio más utilizado',
      trend: 'up' as const,
      badge: data.beneficioMasUsado?.usos ? 'Popular' : undefined,
      progressValue: data.beneficioMasUsado?.usos ? Math.min((data.beneficioMasUsado.usos / 50) * 100, 100) : 0,
    },
  ];

  // Métricas adicionales para la segunda fila
  const additionalMetrics = [
    {
      title: 'Tasa de Éxito',
      value: `${data.tasaExito?.toFixed(1) || '0.0'}%`,
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: data.tasaExito > 80 ? 10 : data.tasaExito > 60 ? 5 : -5,
      subtitle: 'validaciones exitosas',
      description: 'Porcentaje de validaciones exitosas',
      trend: data.tasaExito > 80 ? 'up' as const : data.tasaExito < 60 ? 'down' as const : 'neutral' as const,
      progressValue: data.tasaExito || 0,
    },
    {
      title: 'Crecimiento Mensual',
      value: `${data.crecimientoMensual?.toFixed(1) || '0.0'}%`,
      icon: <Analytics sx={{ fontSize: 24 }} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      change: data.crecimientoMensual || 0,
      subtitle: 'vs mes anterior',
      description: 'Crecimiento comparado con el mes anterior',
      trend: (data.crecimientoMensual || 0) > 0 ? 'up' as const : (data.crecimientoMensual || 0) < 0 ? 'down' as const : 'neutral' as const,
      progressValue: Math.min(Math.abs(data.crecimientoMensual || 0) * 2, 100),
    },
    {
      title: 'Eficiencia Operativa',
      value: `${data.eficienciaOperativa?.toFixed(0) || '0'}%`,
      icon: <Speed sx={{ fontSize: 24 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      change: 5,
      subtitle: 'índice general',
      description: 'Índice de eficiencia operativa general',
      trend: 'up' as const,
      progressValue: data.eficienciaOperativa || 0,
    },
    {
      title: 'Tendencia',
      value: data.promedioDiario > 10 ? 'Creciendo' : data.promedioDiario > 5 ? 'Estable' : 'Lento',
      icon: <Timeline sx={{ fontSize: 24 }} />,
      color: '#64748b',
      gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      change: 0,
      subtitle: 'análisis de tendencia',
      description: 'Análisis de la tendencia actual',
      trend: 'neutral' as const,
      showProgress: false,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <UnifiedMetricsCard
              {...kpi}
              loading={loading}
              size="medium"
              variant="detailed"
              showProgress={true}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>

      {/* Métricas secundarias */}
      <Grid container spacing={3}>
        {additionalMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <UnifiedMetricsCard
              {...metric}
              loading={loading}
              size="small"
              variant="compact"
              delay={(index + 4) * 0.1}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};