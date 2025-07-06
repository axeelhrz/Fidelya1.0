'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  Stack,
  LinearProgress,
  Paper,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Store,
  LocalOffer,
  QrCode,
  Receipt,
  Timeline,
  CalendarToday,
  Warning,
  CheckCircle,
  Info,
  ArrowForward,
  Refresh,
  NotificationsActive,
  Speed,
  ErrorOutline,
  Campaign,
} from '@mui/icons-material';
import {
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface ComercioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
}

interface ActivityLog {
  id: string;
  type: 'validation_completed' | 'benefit_redeemed' | 'profile_updated' | 'qr_generated' | 'system_alert' | 'notification_received';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface ComercioMetrics {
  totalValidaciones: number;
  validacionesHoy: number;
  validacionesSemana: number;
  validacionesMes: number;
  beneficiosActivos: number;
  beneficiosCanjeados: number;
  crecimientoSemanal: number;
  crecimientoMensual: number;
  recentActivities: ActivityLog[];
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastActivity: Date | null;
  avgValidacionesDiarias: number;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  loading?: boolean;
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
  loading = false
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
            
            {/* Trend indicator */}
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
                mb: subtitle ? 1 : 0,
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
                  fontSize: '0.85rem'
                }}
              >
                {subtitle}
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

const ActivityCard: React.FC<{
  activities: ActivityLog[];
  loading: boolean;
  onViewAll?: () => void;
}> = ({ activities, loading, onViewAll }) => {
  const getActivityIcon = (type: ActivityLog['type']) => {
    const icons = {
      validation_completed: <QrCode sx={{ fontSize: 20 }} />,
      benefit_redeemed: <LocalOffer sx={{ fontSize: 20 }} />,
      profile_updated: <Store sx={{ fontSize: 20 }} />,
      qr_generated: <QrCode sx={{ fontSize: 20 }} />,
      system_alert: <Warning sx={{ fontSize: 20 }} />,
      notification_received: <Campaign sx={{ fontSize: 20 }} />,
    };
    return icons[type] || <Info sx={{ fontSize: 20 }} />;
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    const colors = {
      validation_completed: '#10b981',
      benefit_redeemed: '#f59e0b',
      profile_updated: '#6366f1',
      qr_generated: '#8b5cf6',
      system_alert: '#ef4444',
      notification_received: '#ec4899',
    };
    return colors[type] || '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ flex: '2 1 0', minWidth: '400px' }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          height: '100%',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  borderRadius: 3,
                }}
              >
                <Timeline />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                  Actividad Reciente
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Últimas acciones del comercio
                </Typography>
              </Box>
            </Box>
            {onViewAll && (
              <Button
                onClick={onViewAll}
                size="small"
                endIcon={<ArrowForward />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#6366f1',
                }}
              >
                Ver todo
              </Button>
            )}
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <Stack spacing={2.5}>
              {activities.slice(0, 5).map((activity) => (
                <Box key={activity.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: alpha(getActivityColor(activity.type), 0.1),
                      color: getActivityColor(activity.type),
                      borderRadius: 2,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 0.5,
                        fontSize: '0.9rem'
                      }}
                    >
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.8rem',
                        mb: 0.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {activity.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94a3b8',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    >
                      {format(activity.timestamp.toDate(), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {activities.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    No hay actividad reciente
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ComercioHealthCard: React.FC<{
  health: ComercioMetrics['systemHealth'];
  lastActivity: Date | null;
  avgValidaciones: number;
  loading: boolean;
}> = ({ health, lastActivity, avgValidaciones, loading }) => {
  const getHealthColor = () => {
    const colors = {
      excellent: '#10b981',
      good: '#6366f1',
      warning: '#f59e0b',
      critical: '#ef4444',
    };
    return colors[health];
  };

  const getHealthIcon = () => {
    const icons = {
      excellent: <CheckCircle />,
      good: <Speed />,
      warning: <Warning />,
      critical: <ErrorOutline />,
    };
    return icons[health];
  };

  const getHealthLabel = () => {
    const labels = {
      excellent: 'Excelente',
      good: 'Bueno',
      warning: 'Atención',
      critical: 'Crítico',
    };
    return labels[health];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ flex: '1 1 0', minWidth: '320px' }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          height: '100%',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: alpha(getHealthColor(), 0.1),
                color: getHealthColor(),
                borderRadius: 3,
              }}
            >
              {loading ? <CircularProgress size={20} /> : getHealthIcon()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                Estado del Comercio
              </Typography>
              <Chip
                label={getHealthLabel()}
                size="small"
                sx={{
                  bgcolor: alpha(getHealthColor(), 0.1),
                  color: getHealthColor(),
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
          </Box>

          <Stack spacing={3}>
            {/* Last Activity */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                  Última actividad
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {loading ? '...' : lastActivity ? format(lastActivity, 'dd/MM HH:mm') : 'Sin actividad'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: lastActivity && (Date.now() - lastActivity.getTime()) < 24 * 60 * 60 * 1000 ? '#10b981' : '#f59e0b',
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {lastActivity && (Date.now() - lastActivity.getTime()) < 24 * 60 * 60 * 1000 
                    ? 'Activo hoy' 
                    : 'Inactivo'
                  }
                </Typography>
              </Box>
            </Box>

            {/* Average Validations */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                  Promedio diario
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {loading ? '...' : `${avgValidaciones.toFixed(1)} validaciones`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={loading ? 0 : Math.min((avgValidaciones / 10) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#e2e8f0', 0.5),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: avgValidaciones > 5 ? '#10b981' : avgValidaciones > 2 ? '#f59e0b' : '#ef4444',
                    borderRadius: 3,
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                {loading ? '...' : avgValidaciones > 5 ? 'Excelente rendimiento' : avgValidaciones > 2 ? 'Buen rendimiento' : 'Puede mejorar'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ComercioOverviewDashboard: React.FC<ComercioOverviewDashboardProps> = ({
  onNavigate
}) => {
  const { user } = useAuth();
  const { comercio } = useComercios();
  const { activeBeneficios, loading: beneficiosLoading } = useBeneficios();
  const { validaciones, getStats, loading: validacionesLoading } = useValidaciones();
  const { stats: notificationStats } = useNotifications();
  
  const [comercioMetrics, setComercioMetrics] = useState<ComercioMetrics>({
    totalValidaciones: 0,
    validacionesHoy: 0,
    validacionesSemana: 0,
    validacionesMes: 0,
    beneficiosActivos: 0,
    beneficiosCanjeados: 0,
    crecimientoSemanal: 0,
    crecimientoMensual: 0,
    recentActivities: [],
    systemHealth: 'good',
    lastActivity: null,
    avgValidacionesDiarias: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = getStats();

  // Memoize the calculation function to prevent unnecessary recalculations
  const calculateMetrics = useCallback(() => {
    if (!user || validacionesLoading || beneficiosLoading) {
      return null;
    }

    try {
      const now = new Date();
      const today = startOfDay(now);
      const weekAgo = subDays(now, 7);
      const monthAgo = subDays(now, 30);

      // Filter validaciones by time periods
      const validacionesHoy = validaciones.filter(v => 
        v.fechaHora.toDate() >= today
      ).length;

      const validacionesSemana = validaciones.filter(v => 
        v.fechaHora.toDate() >= weekAgo
      ).length;

      const validacionesMes = validaciones.filter(v => 
        v.fechaHora.toDate() >= monthAgo
      ).length;

      const validacionesSemanaAnterior = validaciones.filter(v => {
        const date = v.fechaHora.toDate();
        return date >= subDays(weekAgo, 7) && date < weekAgo;
      }).length;

      const validacionesMesAnterior = validaciones.filter(v => {
        const date = v.fechaHora.toDate();
        return date >= subDays(monthAgo, 30) && date < monthAgo;
      }).length;

      // Calculate growth rates
      const crecimientoSemanal = validacionesSemanaAnterior > 0 
        ? ((validacionesSemana - validacionesSemanaAnterior) / validacionesSemanaAnterior) * 100
        : validacionesSemana > 0 ? 100 : 0;

      const crecimientoMensual = validacionesMesAnterior > 0
        ? ((validacionesMes - validacionesMesAnterior) / validacionesMesAnterior) * 100
        : validacionesMes > 0 ? 100 : 0;

      // Calculate average daily validations
      const avgValidacionesDiarias = validacionesMes / 30;

      // Determine system health
      let systemHealth: ComercioMetrics['systemHealth'] = 'good';
      if (avgValidacionesDiarias > 5) systemHealth = 'excellent';
      else if (avgValidacionesDiarias > 2) systemHealth = 'good';
      else if (avgValidacionesDiarias > 0) systemHealth = 'warning';
      else systemHealth = 'critical';

      // Get last activity
      const lastActivity = validaciones.length > 0 
        ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0].fechaHora.toDate()
        : null;

      // Create sample activities
      const recentActivities: ActivityLog[] = validaciones
        .slice(0, 5)
        .map((v, index) => ({
          id: v.id || `activity-${index}`,
          type: 'validation_completed' as const,
          title: 'Validación completada',
          description: `Beneficio canjeado por socio`,
          timestamp: v.fechaHora,
          metadata: { validacionId: v.id },
        }));

      return {
        totalValidaciones: stats.totalValidaciones,
        validacionesHoy,
        validacionesSemana,
        validacionesMes,
        beneficiosActivos: activeBeneficios.length,
        beneficiosCanjeados: stats.totalValidaciones,
        crecimientoSemanal: Math.round(crecimientoSemanal * 100) / 100,
        crecimientoMensual: Math.round(crecimientoMensual * 100) / 100,
        recentActivities,
        systemHealth,
        lastActivity,
        avgValidacionesDiarias: Math.round(avgValidacionesDiarias * 100) / 100,
      };
    } catch (err) {
      console.error('Error calculating comercio metrics:', err);
      throw new Error('Error al cargar las métricas del comercio');
    }
  }, [user, validaciones, activeBeneficios, stats, validacionesLoading, beneficiosLoading]);

  // Calculate metrics from validaciones with proper dependencies
  useEffect(() => {
    const metrics = calculateMetrics();
    
    if (metrics) {
      setComercioMetrics(metrics);
      setLoading(false);
      setError(null);
    } else if (!validacionesLoading && !beneficiosLoading) {
      setLoading(false);
    }
  }, [calculateMetrics, validacionesLoading, beneficiosLoading]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Validaciones Totales',
      value: comercioMetrics.totalValidaciones.toLocaleString(),
      change: comercioMetrics.crecimientoMensual,
      icon: <QrCode sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Crecimiento mensual',
      trend: comercioMetrics.crecimientoMensual > 0 ? 'up' as const : comercioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('historial-validaciones'),
      loading: loading
    },
    {
      title: 'Validaciones Hoy',
      value: comercioMetrics.validacionesHoy.toLocaleString(),
      change: comercioMetrics.crecimientoSemanal,
      icon: <Receipt sx={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Crecimiento semanal',
      trend: comercioMetrics.crecimientoSemanal > 0 ? 'up' as const : comercioMetrics.crecimientoSemanal < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('qr-validacion'),
      loading: loading
    },
    {
      title: 'Beneficios Activos',
      value: comercioMetrics.beneficiosActivos.toString(),
      change: comercioMetrics.beneficiosActivos > 0 ? 100 : 0,
      icon: <LocalOffer sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Disponibles',
      trend: comercioMetrics.beneficiosActivos > 3 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: beneficiosLoading
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread.toString(),
      change: notificationStats.unread > 0 ? 100 : 0,
      icon: <NotificationsActive sx={{ fontSize: 28 }} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      delay: 0.3,
      subtitle: 'Sin leer',
      trend: notificationStats.unread > 5 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('notificaciones'),
      loading: false
    }
  ], [comercioMetrics, notificationStats, beneficiosLoading, loading, onNavigate]);

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Store sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #0f172a 0%, #6366f1 60%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    mb: 1,
                  }}
                >
                  Panel de Control
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  {comercio?.nombreComercio || 'Mi Comercio'} • {user?.email?.split('@')[0] || 'Comercio'}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <IconButton
                onClick={() => window.location.reload()}
                sx={{
                  bgcolor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.2),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Refresh />
              </IconButton>
              <Button
                onClick={() => onNavigate?.('qr-validacion')}
                variant="contained"
                startIcon={<QrCode />}
                size="large"
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Validar QR
              </Button>
            </Stack>
          </Box>
          
          {/* Status Banner */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#10b981', 0.05),
              border: `2px solid ${alpha('#10b981', 0.15)}`,
              borderRadius: 4,
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #10b981, #059669, #047857)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                    },
                  }}
                />
                <Typography variant="body1" sx={{ color: '#047857', fontWeight: 700, fontSize: '1.1rem' }}>
                  <Box component="span" sx={{ fontWeight: 900 }}>Comercio activo</Box> - Sistema de validaciones operativo
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ fontSize: 18, color: '#059669' }} />
                <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700 }}>
                  {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* KPI Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 6,
        '& > *': {
          minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' }
        }
      }}>
        {kpiMetrics.map((metric, index) => (
          <KPICard key={index} {...metric} />
        ))}
      </Box>

      {/* Secondary Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4,
        alignItems: 'stretch'
      }}>
        <ActivityCard
          activities={comercioMetrics.recentActivities}
          loading={loading}
          onViewAll={() => onNavigate?.('historial-validaciones')}
        />
        <ComercioHealthCard
          health={comercioMetrics.systemHealth}
          lastActivity={comercioMetrics.lastActivity}
          avgValidaciones={comercioMetrics.avgValidacionesDiarias}
          loading={loading}
        />
      </Box>
    </Container>
  );
};