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
  LocalOffer,
  QrCodeScanner,
  Notifications,
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
  CardGiftcard,
  Savings,
  Star,
  Person,
} from '@mui/icons-material';
import {
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface SocioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
  onScanQR?: () => void;
}

interface ActivityLog {
  id: string;
  type: 'benefit_used' | 'benefit_available' | 'membership_renewed' | 'profile_updated' | 'notification_received';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface SocioMetrics {
  beneficiosDisponibles: number;
  beneficiosUsados: number;
  ahorroTotal: number;
  ahorroMensual: number;
  beneficiosEsteMes: number;
  crecimientoMensual: number;
  recentActivities: ActivityLog[];
  membershipHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastActivity: Date | null;
  avgBeneficiosMensuales: number;
  categoriaFavorita: string;
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
      benefit_used: <LocalOffer sx={{ fontSize: 20 }} />,
      benefit_available: <CardGiftcard sx={{ fontSize: 20 }} />,
      membership_renewed: <Star sx={{ fontSize: 20 }} />,
      profile_updated: <Person sx={{ fontSize: 20 }} />,
      notification_received: <Notifications sx={{ fontSize: 20 }} />,
    };
    return icons[type] || <Info sx={{ fontSize: 20 }} />;
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    const colors = {
      benefit_used: '#10b981',
      benefit_available: '#f59e0b',
      membership_renewed: '#8b5cf6',
      profile_updated: '#6366f1',
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
                  Tus últimas acciones
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

const MembershipHealthCard: React.FC<{
  health: SocioMetrics['membershipHealth'];
  lastActivity: Date | null;
  avgBeneficios: number;
  categoriaFavorita: string;
  loading: boolean;
}> = ({ health, lastActivity, avgBeneficios, categoriaFavorita, loading }) => {
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
      warning: 'Regular',
      critical: 'Inactivo',
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
                Estado de Membresía
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
                    bgcolor: lastActivity && (Date.now() - lastActivity.getTime()) < 7 * 24 * 60 * 60 * 1000 ? '#10b981' : '#f59e0b',
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {lastActivity && (Date.now() - lastActivity.getTime()) < 7 * 24 * 60 * 60 * 1000 
                    ? 'Activo esta semana' 
                    : 'Inactivo'
                  }
                </Typography>
              </Box>
            </Box>

            {/* Average Benefits */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                  Promedio mensual
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {loading ? '...' : `${avgBeneficios.toFixed(1)} beneficios`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={loading ? 0 : Math.min((avgBeneficios / 5) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#e2e8f0', 0.5),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: avgBeneficios > 3 ? '#10b981' : avgBeneficios > 1 ? '#f59e0b' : '#ef4444',
                    borderRadius: 3,
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                {loading ? '...' : avgBeneficios > 3 ? 'Usuario muy activo' : avgBeneficios > 1 ? 'Usuario activo' : 'Puede mejorar'}
              </Typography>
            </Box>

            {/* Favorite Category */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                  Categoría favorita
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {loading ? '...' : categoriaFavorita}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#6366f1',
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Basado en tu historial
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const SocioOverviewDashboard: React.FC<SocioOverviewDashboardProps> = ({
  onNavigate,
  onScanQR
}) => {
  const { user } = useAuth();
  const { beneficios, beneficiosUsados, loading: beneficiosLoading } = useBeneficios();
  const { stats: notificationStats } = useNotifications();
  
  const [socioMetrics, setSocioMetrics] = useState<SocioMetrics>({
    beneficiosDisponibles: 0,
    beneficiosUsados: 0,
    ahorroTotal: 0,
    ahorroMensual: 0,
    beneficiosEsteMes: 0,
    crecimientoMensual: 0,
    recentActivities: [],
    membershipHealth: 'good',
    lastActivity: null,
    avgBeneficiosMensuales: 0,
    categoriaFavorita: 'General',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the calculation function to prevent unnecessary recalculations
  const calculateMetrics = useCallback(() => {
    if (!user || beneficiosLoading) {
      return null;
    }

    try {
      const now = new Date();
      const monthAgo = subDays(now, 30);

      // Filter beneficios used this month
      const beneficiosEsteMes = beneficiosUsados.filter(b => 
        b.fechaUso.toDate() >= monthAgo
      ).length;

      const beneficiosMesAnterior = beneficiosUsados.filter(b => {
        const date = b.fechaUso.toDate();
        return date >= subDays(monthAgo, 30) && date < monthAgo;
      }).length;

      // Calculate growth rate
      const crecimientoMensual = beneficiosMesAnterior > 0 
        ? ((beneficiosEsteMes - beneficiosMesAnterior) / beneficiosMesAnterior) * 100
        : beneficiosEsteMes > 0 ? 100 : 0;

      // Calculate total savings
      const ahorroTotal = beneficiosUsados.reduce((total, b) => total + (b.montoDescuento || 0), 0);
      const ahorroMensual = beneficiosUsados
        .filter(b => b.fechaUso.toDate() >= monthAgo)
        .reduce((total, b) => total + (b.montoDescuento || 0), 0);

      // Calculate average monthly benefits
      const avgBeneficiosMensuales = beneficiosUsados.length > 0 ? beneficiosUsados.length / 3 : 0; // Assuming 3 months of data

      // Determine membership health
      let membershipHealth: SocioMetrics['membershipHealth'] = 'good';
      if (avgBeneficiosMensuales > 3) membershipHealth = 'excellent';
      else if (avgBeneficiosMensuales > 1) membershipHealth = 'good';
      else if (avgBeneficiosMensuales > 0) membershipHealth = 'warning';
      else membershipHealth = 'critical';

      // Get last activity
      const lastActivity = beneficiosUsados.length > 0 
        ? beneficiosUsados.sort((a, b) => b.fechaUso.toDate().getTime() - a.fechaUso.toDate().getTime())[0].fechaUso.toDate()
        : null;

      // Get favorite category (mock for now)
      const categoriaFavorita = 'Restaurantes'; // This would be calculated from actual usage data

      // Create sample activities
      const recentActivities: ActivityLog[] = beneficiosUsados
        .slice(0, 5)
        .map((b, index) => ({
          id: b.id || `activity-${index}`,
          type: 'benefit_used' as const,
          title: 'Beneficio utilizado',
          description: `Ahorraste $${b.montoDescuento || 0} en tu compra`,
          timestamp: b.fechaUso,
          metadata: { beneficioId: b.beneficioId },
        }));

      return {
        beneficiosDisponibles: beneficios.length,
        beneficiosUsados: beneficiosUsados.length,
        ahorroTotal,
        ahorroMensual,
        beneficiosEsteMes,
        crecimientoMensual: Math.round(crecimientoMensual * 100) / 100,
        recentActivities,
        membershipHealth,
        lastActivity,
        avgBeneficiosMensuales: Math.round(avgBeneficiosMensuales * 100) / 100,
        categoriaFavorita,
      };
    } catch (err) {
      console.error('Error calculating socio metrics:', err);
      throw new Error('Error al cargar las métricas del socio');
    }
  }, [user, beneficios, beneficiosUsados, beneficiosLoading]);

  // Calculate metrics from beneficios with proper dependencies
  useEffect(() => {
    const metrics = calculateMetrics();
    
    if (metrics) {
      setSocioMetrics(metrics);
      setLoading(false);
      setError(null);
    } else if (!beneficiosLoading) {
      setLoading(false);
    }
  }, [calculateMetrics, beneficiosLoading]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Beneficios Disponibles',
      value: socioMetrics.beneficiosDisponibles.toLocaleString(),
      change: socioMetrics.beneficiosDisponibles > 0 ? 100 : 0,
      icon: <LocalOffer sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Listos para usar',
      trend: socioMetrics.beneficiosDisponibles > 5 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Total Ahorrado',
      value: `$${socioMetrics.ahorroTotal.toLocaleString()}`,
      change: socioMetrics.crecimientoMensual,
      icon: <Savings sx={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'En todos los beneficios',
      trend: socioMetrics.crecimientoMensual > 0 ? 'up' as const : socioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Este Mes',
      value: socioMetrics.beneficiosEsteMes.toString(),
      change: socioMetrics.crecimientoMensual,
      icon: <CardGiftcard sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Beneficios usados',
      trend: socioMetrics.crecimientoMensual > 0 ? 'up' as const : socioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
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
      trend: notificationStats.unread > 3 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('notificaciones'),
      loading: false
    }
  ], [socioMetrics, notificationStats, loading, onNavigate]);

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
                <Person sx={{ fontSize: 32 }} />
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
                  Mi Dashboard
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  ¡Hola, {user?.nombre || 'Socio'}! • Miembro activo
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
                onClick={onScanQR}
                variant="contained"
                startIcon={<QrCodeScanner />}
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
                Escanear QR
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
                  <Box component="span" sx={{ fontWeight: 900 }}>Membresía activa</Box> - Disfruta todos tus beneficios
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
          activities={socioMetrics.recentActivities}
          loading={loading}
          onViewAll={() => onNavigate?.('beneficios')}
        />
        <MembershipHealthCard
          health={socioMetrics.membershipHealth}
          lastActivity={socioMetrics.lastActivity}
          avgBeneficios={socioMetrics.avgBeneficiosMensuales}
          categoriaFavorita={socioMetrics.categoriaFavorita}
          loading={loading}
        />
      </Box>
    </Container>
  );
};
