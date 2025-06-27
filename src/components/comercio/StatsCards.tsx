'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import {
  Receipt,
  CardGiftcard,
  Group,
  AccessTime,
  TrendingUp,
  CheckCircle,
  Schedule,
  Analytics,
} from '@mui/icons-material';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useComercios } from '@/hooks/useComercios';
import { format, subDays, startOfMonth } from 'date-fns';
import { useRouter } from 'next/navigation';
import UnifiedMetricsCard from '@/components/ui/UnifiedMetricsCard';

export const StatsCards: React.FC = () => {
  const { activeBeneficios, beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();
  const { comercio } = useComercios();
  const router = useRouter();

  // Calculate stats
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const validacionesEsteMes = validaciones.filter(v => 
    v.fechaHora.toDate() >= startOfThisMonth
  );

  const validacionesExitosas = validacionesEsteMes.filter(v => v.resultado === 'valido');
  const tasaExito = validacionesEsteMes.length > 0 
    ? (validacionesExitosas.length / validacionesEsteMes.length) * 100 
    : 0;

  const ultimaValidacion = validaciones.length > 0 
    ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0]
    : null;

  const tiempoUltimaValidacion = ultimaValidacion 
    ? getTimeAgo(ultimaValidacion.fechaHora.toDate())
    : 'Nunca';

  const asociacionesVinculadas = comercio?.asociacionesVinculadas?.length || 0;

  // Calculate growth rates (mock calculations for demo)
  const validacionesAyer = validaciones.filter(v => {
    const fecha = v.fechaHora.toDate();
    const ayer = subDays(now, 1);
    return fecha.toDateString() === ayer.toDateString();
  }).length;

  const validacionesHoy = validaciones.filter(v => {
    const fecha = v.fechaHora.toDate();
    return fecha.toDateString() === now.toDateString();
  }).length;

  const cambioValidaciones = validacionesAyer > 0 
    ? ((validacionesHoy - validacionesAyer) / validacionesAyer) * 100 
    : validacionesHoy > 0 ? 100 : 0;

  const kpiMetrics = [
    {
      title: 'Validaciones del Mes',
      value: validacionesEsteMes.length,
      change: Math.round(cambioValidaciones),
      icon: <Receipt sx={{ fontSize: 28 }} />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      delay: 0,
      subtitle: `${(validacionesEsteMes.length / new Date().getDate()).toFixed(1)} por día`,
      description: 'Total de validaciones realizadas este mes',
      trend: cambioValidaciones > 0 ? 'up' as const : cambioValidaciones < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => router.push('/dashboard/comercio/validaciones'),
      progressValue: Math.min((validacionesEsteMes.length / 100) * 100, 100),
    },
    {
      title: 'Tasa de Éxito',
      value: `${tasaExito.toFixed(1)}%`,
      change: tasaExito > 80 ? 15 : tasaExito > 60 ? 5 : -10,
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: `${validacionesExitosas.length} exitosas`,
      description: 'Porcentaje de validaciones exitosas',
      trend: tasaExito > 80 ? 'up' as const : tasaExito < 60 ? 'down' as const : 'neutral' as const,
      onClick: () => router.push('/dashboard/comercio/analytics'),
      progressValue: tasaExito,
    },
    {
      title: 'Beneficios Activos',
      value: activeBeneficios.length,
      change: 0,
      icon: <CardGiftcard sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      delay: 0.2,
      subtitle: `${beneficios.length} total`,
      description: 'Beneficios disponibles para validación',
      trend: 'neutral' as const,
      onClick: () => router.push('/dashboard/comercio/beneficios'),
      badge: activeBeneficios.length > 5 ? 'Activo' : undefined,
      progressValue: beneficios.length > 0 ? (activeBeneficios.length / beneficios.length) * 100 : 0,
    },
    {
      title: 'Asociaciones Vinculadas',
      value: asociacionesVinculadas,
      change: 5.2,
      icon: <Group sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.3,
      subtitle: 'Activas',
      description: 'Asociaciones que pueden usar tus beneficios',
      trend: 'up' as const,
      onClick: () => router.push('/dashboard/comercio/perfil'),
      progressValue: Math.min(asociacionesVinculadas * 20, 100),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {kpiMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <UnifiedMetricsCard
              {...metric}
              size="medium"
              variant="detailed"
              showProgress={true}
            />
          </Grid>
        ))}
      </Grid>

      {/* Additional metrics row for more detailed view */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <UnifiedMetricsCard
              title="Última Validación"
              value={tiempoUltimaValidacion}
              change={0}
              icon={<AccessTime sx={{ fontSize: 24 }} />}
              color="#64748b"
              gradient="linear-gradient(135deg, #64748b 0%, #475569 100%)"
              delay={0.4}
              subtitle={ultimaValidacion ? format(ultimaValidacion.fechaHora.toDate(), 'dd/MM HH:mm') : ''}
              description="Tiempo transcurrido desde la última validación"
              trend="neutral"
              size="small"
              variant="compact"
              showProgress={false}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <UnifiedMetricsCard
              title="Promedio Diario"
              value={(validacionesEsteMes.length / new Date().getDate()).toFixed(1)}
              change={12}
              icon={<TrendingUp sx={{ fontSize: 24 }} />}
              color="#ec4899"
              gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
              delay={0.5}
              subtitle="validaciones/día"
              description="Promedio de validaciones por día este mes"
              trend="up"
              size="small"
              variant="compact"
              progressValue={Math.min((validacionesEsteMes.length / new Date().getDate()) * 10, 100)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <UnifiedMetricsCard
              title="Rendimiento"
              value={`${Math.min(tasaExito + (asociacionesVinculadas * 5), 100).toFixed(0)}%`}
              change={8}
              icon={<Analytics sx={{ fontSize: 24 }} />}
              color="#06b6d4"
              gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
              delay={0.6}
              subtitle="índice general"
              description="Índice de rendimiento basado en múltiples métricas"
              trend="up"
              size="small"
              variant="compact"
              onClick={() => router.push('/dashboard/comercio/analytics')}
              progressValue={Math.min(tasaExito + (asociacionesVinculadas * 5), 100)}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
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