'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  LinearProgress,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  CalendarToday,
  Business,
  LocalOffer,
  TrendingUp,
  TrendingDown,
  Analytics,
  Speed,
  AttachMoney,
  Group,
  Star,
  ArrowForward,
  QrCode,
  Receipt,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useComercios } from '@/hooks/useComercios';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down'Voy a leer primero el componente actual de KpiCards para entender su estructura y luego actualizarlo | 'neutral';
  onClick?: () => void;
  loading?: boolean;
  badge?: string;
  description?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  gradient,
  delay,
  subtitle,
  trend = 'neutral',
  onClick,
  loading = false,
  badge,
  description
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      style={{ flex: '1 1 0', minWidth: '280px' }}
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #f1f5f9',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: onClick ? 'translateY(-6px)' : 'translateY(-3px)',
            boxShadow: `0 20px 60px -15px ${alpha(color, 0.25)}`,
            '& .kpi-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              background: gradient,
              color: 'white',
            },
            '& .kpi-glow': {
              opacity: 1,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="kpi-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient,
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              className="kpi-icon"
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha(color, 0.1),
                color: color,
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 6px 20px ${alpha(color, 0.2)}`,
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'inherit' }} /> : icon}
            </Avatar>
            
            {/* Trend indicator and badge */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {trend === 'up' && <TrendingUp sx={{ fontSize: 18, color: '#10b981' }} />}
                {trend === 'down' && <TrendingDown sx={{ fontSize: 18, color: '#ef4444' }} />}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280',
                    fontSize: '0.85rem'
                  }}
                >
                  {change > 0 ? '+' : ''}{change}%
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#94a3b8',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              {title}
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: '2.2rem',
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
                mb: subtitle || description ? 1 : 0,
              }}
            >
              {loading ? '...' : value}
            </Typography>
            
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  mb: description ? 0.5 : 0,
                }}
              >
                {subtitle}
              </Typography>
            )}

            {description && (
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  lineHeight: 1.3,
                  display: 'block',
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          
          {/* Progress indicator */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={loading ? 0 : Math.min(Math.abs(change) * 10, 100)}
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 2,
                }
              }}
            />
          </Box>
          
          {onClick && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                sx={{
                  color: color,
                  bgcolor: alpha(color, 0.1),
                  '&:hover': {
                    bgcolor: alpha(color, 0.2),
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowForward sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const KpiCards: React.FC = () => {
  const { validaciones, getStats, loading: validacionesLoading } = useValidaciones();
  const { activeBeneficios, loading: beneficiosLoading } = useBeneficios();
  const { comercio, loading: comercioLoading } = useComercios();

  const stats = getStats();

  // Calculate advanced metrics
  const advancedMetrics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Validaciones por período
    const validacionesHoy = validaciones.filter(v => 
      v.fechaHora.toDate() >= today
    ).length;

    const validacionesAyer = validaciones.filter(v => {
      const date = v.fechaHora.toDate();
      return date >= yesterday && date < today;
    }).length;

    const validacionesSemana = validaciones.filter(v => 
      v.fechaHora.toDate() >= weekAgo
    ).length;

    const validacionesMes = validaciones.filter(v => 
      v.fechaHora.toDate() >= monthAgo
    ).length;

    const validacionesSemanaAnterior = validaciones.filter(v => {
      const date = v.fechaHora.toDate();
      return date >= new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) && date < weekAgo;
    }).length;

    // Cálculo de cambios porcentuales
    const cambioHoy = validacionesAyer > 0 
      ? ((validacionesHoy - validacionesAyer) / validacionesAyer) * 100
      : validacionesHoy > 0 ? 100 : 0;

    const cambioSemanal = validacionesSemanaAnterior > 0
      ? ((validacionesSemana - validacionesSemanaAnterior) / validacionesSemanaAnterior) * 100
      : validacionesSemana > 0 ? 100 : 0;

    // Promedio diario
    const promedioDiario = validacionesMes / 30;

    // Eficiencia (validaciones vs beneficios activos)
    const eficiencia = activeBeneficios.length > 0 
      ? (validacionesSemana / activeBeneficios.length) * 100
      : 0;

    // Tendencia de crecimiento
    const tendenciaCrecimiento = validacionesMes > 0 
      ? ((validacionesSemana * 4) / validacionesMes - 1) * 100
      : 0;

    return {
      validacionesHoy,
      validacionesSemana,
      validacionesMes,
      promedioDiario,
      cambioHoy,
      cambioSemanal,
      eficiencia,
      tendenciaCrecimiento,
    };
  }, [validaciones, activeBeneficios.length]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Validaciones Totales',
      value: stats.totalValidaciones.toLocaleString(),
      change: advancedMetrics.tendenciaCrecimiento,
      icon: <QrCode sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Total histórico',
      description: 'Todas las validaciones realizadas',
      trend: advancedMetrics.tendenciaCrecimiento > 0 ? 'up' as const : 
             advancedMetrics.tendenciaCrecimiento < 0 ? 'down' as const : 'neutral' as const,
      loading: validacionesLoading,
      badge: 'TOTAL'
    },
    {
      title: 'Validaciones Hoy',
      value: advancedMetrics.validacionesHoy.toLocaleString(),
      change: advancedMetrics.cambioHoy,
      icon: <Receipt sx={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Actividad diaria',
      description: 'Comparado con ayer',
      trend: advancedMetrics.cambioHoy > 0 ? 'up' as const : 
             advancedMetrics.cambioHoy < 0 ? 'down' as const : 'neutral' as const,
      loading: validacionesLoading,
      badge: 'HOY'
    },
    {
      title: 'Promedio Diario',
      value: advancedMetrics.promedioDiario.toFixed(1),
      change: advancedMetrics.cambioSemanal,
      icon: <Timeline sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Últimos 30 días',
      description: 'Tendencia semanal',
      trend: advancedMetrics.cambioSemanal > 0 ? 'up' as const : 
             advancedMetrics.cambioSemanal < 0 ? 'down' as const : 'neutral' as const,
      loading: validacionesLoading,
      badge: 'PROMEDIO'
    },
    {
      title: 'Beneficios Activos',
      value: activeBeneficios.length.toString(),
      change: activeBeneficios.length > 0 ? 100 : 0,
      icon: <LocalOffer sx={{ fontSize: 28 }} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      delay: 0.3,
      subtitle: 'Ofertas disponibles',
      description: 'Listas para canjear',
      trend: activeBeneficios.length > 3 ? 'up' as const : 
             activeBeneficios.length === 0 ? 'down' as const : 'neutral' as const,
      loading: beneficiosLoading,
      badge: 'ACTIVOS'
    },
    {
      title: 'Eficiencia Semanal',
      value: `${advancedMetrics.eficiencia.toFixed(1)}%`,
      change: advancedMetrics.eficiencia > 50 ? 25 : advancedMetrics.eficiencia > 20 ? 10 : -5,
      icon: <Speed sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      delay: 0.4,
      subtitle: 'Validaciones/Beneficio',
      description: 'Rendimiento por oferta',
      trend: advancedMetrics.eficiencia > 50 ? 'up' as const : 
             advancedMetrics.eficiencia < 20 ? 'down' as const : 'neutral' as const,
      loading: validacionesLoading || beneficiosLoading,
      badge: 'EFICIENCIA'
    },
    {
      title: 'Validaciones Mes',
      value: advancedMetrics.validacionesMes.toLocaleString(),
      change: advancedMetrics.tendenciaCrecimiento,
      icon: <Assessment sx={{ fontSize: 28 }} />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      delay: 0.5,
      subtitle: 'Últimos 30 días',
      description: 'Tendencia mensual',
      trend: advancedMetrics.tendenciaCrecimiento > 0 ? 'up' as const : 
             advancedMetrics.tendenciaCrecimiento < 0 ? 'down' as const : 'neutral' as const,
      loading: validacionesLoading,
      badge: 'MENSUAL'
    }
  ], [stats, advancedMetrics, validacionesLoading, beneficiosLoading, activeBeneficios.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: alpha('#6366f1', 0.1),
              color: '#6366f1',
              borderRadius: 3,
            }}
          >
            <Analytics sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
              Métricas Clave de Rendimiento
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Indicadores principales de tu comercio
            </Typography>
          </Box>
        </Box>

        {/* KPI Cards Grid */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': {
            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' }
          }
        }}>
          {kpiMetrics.map((metric, index) => (
            <KPICard key={index} {...metric} />
          ))}
        </Box>

        {/* Summary Stats */}
        <Box sx={{ 
          mt: 4,
          p: 3,
          border: '1px solid #f1f5f9',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
            Resumen de Rendimiento
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4,
            '& > *': {
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' }
            }
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981', mb: 1 }}>
                {advancedMetrics.validacionesSemana}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Esta Semana
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#f59e0b', mb: 1 }}>
                {advancedMetrics.promedioDiario.toFixed(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Promedio/Día
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#ec4899', mb: 1 }}>
                {activeBeneficios.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Beneficios Activos
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#8b5cf6', mb: 1 }}>
                {advancedMetrics.eficiencia.toFixed(0)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Eficiencia
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};
