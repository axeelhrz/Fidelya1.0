'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Button,
  Chip,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Group,
  PersonAdd,
  Analytics,
  NotificationsActive,
  Warning,
  CheckCircle,
  Refresh,
  TrendingUp,
  Assessment,
  Schedule,
  Security,
  Storage,
  Speed,
} from '@mui/icons-material';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useNotifications } from '@/hooks/useNotifications';
import UnifiedMetricsCard from '@/components/ui/UnifiedMetricsCard';
import ModernCard from '@/components/ui/ModernCard';
import { format, subDays, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface OverviewDashboardProps {
  onNavigate: (section: string) => void;
  onAddMember: () => void;
}

interface ActivityLog {
  id: string;
  type: 'member_added' | 'member_updated' | 'payment_received' | 'backup_completed' | 'import_completed' | 'system_alert';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface SystemHealth {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastBackup: Date | null;
  storageUsed: number;
  storageLimit: number;
  uptime: number;
  responseTime: number;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onAddMember
}) => {
  const { user } = useAuth();
  const { stats, loading: sociosLoading } = useSocios();
  const { stats: notificationStats } = useNotifications();
  
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'good',
    lastBackup: subDays(new Date(), 1),
    storageUsed: 1024, // MB
    storageLimit: 5120, // 5GB
    uptime: 99.9,
    responseTime: 120, // ms
  });
  const [loading, setLoading] = useState(true);

  // Fetch real-time activities from Firebase
  useEffect(() => {
    if (!user) return;

    const activitiesRef = collection(db, 'activities');
    const activitiesQuery = query(
      activitiesRef,
      where('asociacionId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
      
      setActivities(activitiesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    const todayActivities = activities.filter(a => isToday(a.timestamp.toDate()));
    const weekActivities = activities.filter(a => isThisWeek(a.timestamp.toDate()));
    const monthActivities = activities.filter(a => isThisMonth(a.timestamp.toDate()));

    const memberGrowth = activities.filter(a => a.type === 'member_added').length;
    const growthRate = stats.total > 0 ? (memberGrowth / stats.total) * 100 : 0;
    const retentionRate = stats.total > 0 ? (stats.activos / stats.total) * 100 : 0;

    return {
      todayActivities: todayActivities.length,
      weekActivities: weekActivities.length,
      monthActivities: monthActivities.length,
      growthRate: Math.round(growthRate * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
    };
  }, [activities, stats]);

  // System health calculation
  const healthStatus = useMemo(() => {
    const storagePercentage = (systemHealth.storageUsed / systemHealth.storageLimit) * 100;
    const backupAge = systemHealth.lastBackup 
      ? (Date.now() - systemHealth.lastBackup.getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    if (storagePercentage > 90 || backupAge > 7 || systemHealth.uptime < 95) {
      return 'critical';
    } else if (storagePercentage > 75 || backupAge > 3 || systemHealth.uptime < 98) {
      return 'warning';
    } else if (systemHealth.uptime > 99.5 && backupAge < 1) {
      return 'excellent';
    }
    return 'good';
  }, [systemHealth]);

  const kpiMetrics = [
    {
      title: 'Total Socios',
      value: stats.total,
      change: growthMetrics.growthRate,
      icon: <Group />,
      color: '#3b82f6',
      onClick: () => onNavigate('all-members'),
      loading: sociosLoading,
      subtitle: 'Miembros registrados',
      description: 'Total de socios en la plataforma',
    },
    {
      title: 'Socios Activos',
      value: stats.activos,
      change: growthMetrics.retentionRate,
      icon: <CheckCircle />,
      color: '#10b981',
      onClick: () => onNavigate('active-members'),
      loading: sociosLoading,
      subtitle: 'Estado activo',
      description: 'Socios con membresía vigente',
      trend: 'up' as const,
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread,
      change: notificationStats.unread > 5 ? 25 : -10,
      icon: <NotificationsActive />,
      color: '#f59e0b',
      onClick: () => onNavigate('notifications'),
      subtitle: 'Sin leer',
      description: 'Notificaciones pendientes',
      trend: notificationStats.unread > 5 ? 'up' as const : 'neutral' as const,
      badge: notificationStats.unread > 0 ? 'Nuevo' : undefined,
    },
    {
      title: 'Socios Vencidos',
      value: stats.vencidos,
      change: stats.vencidos > 0 ? -((stats.vencidos / Math.max(stats.total, 1)) * 100) : 0,
      icon: <Warning />,
      color: '#ef4444',
      onClick: () => onNavigate('expired-members'),
      loading: sociosLoading,
      subtitle: 'Requieren atención',
      description: 'Membresías por renovar',
      trend: stats.vencidos > stats.total * 0.2 ? 'up' as const : 'down' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Nuevo Socio',
      description: 'Agregar miembro',
      icon: <PersonAdd />,
      color: '#6366f1',
      onClick: onAddMember,
    },
    {
      title: 'Analytics',
      description: 'Ver métricas',
      icon: <Analytics />,
      color: '#8b5cf6',
      onClick: () => onNavigate('analytics'),
    },
    {
      title: 'Reportes',
      description: 'Generar informes',
      icon: <Assessment />,
      color: '#06b6d4',
      onClick: () => onNavigate('reports'),
    },
  ];

  if (loading && sociosLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: '#0f172a',
                mb: 0.5,
              }}
            >
              Vista General
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Panel de control • {format(new Date(), 'EEEE, dd MMMM', { locale: es })}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: '#f8fafc',
                color: '#64748b',
                '&:hover': {
                  bgcolor: '#e2e8f0',
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Refresh />
            </IconButton>
            <Button
              onClick={onAddMember}
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                bgcolor: '#6366f1',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  bgcolor: '#5b21b6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nuevo Socio
            </Button>
          </Stack>
        </Box>

        {/* System Status */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: healthStatus === 'excellent' ? '#f0fdf4' : 
                    healthStatus === 'good' ? '#f0f9ff' :
                    healthStatus === 'warning' ? '#fffbeb' : '#fef2f2',
            border: `1px solid ${
              healthStatus === 'excellent' ? '#bbf7d0' : 
              healthStatus === 'good' ? '#bfdbfe' :
              healthStatus === 'warning' ? '#fed7aa' : '#fecaca'
            }`,
            borderRadius: 3,
            p: 2.5,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: healthStatus === 'excellent' ? '#10b981' : 
                        healthStatus === 'good' ? '#3b82f6' :
                        healthStatus === 'warning' ? '#f59e0b' : '#ef4444',
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography variant="body1" sx={{ 
              color: healthStatus === 'excellent' ? '#047857' : 
                     healthStatus === 'good' ? '#1e40af' :
                     healthStatus === 'warning' ? '#d97706' : '#dc2626',
              fontWeight: 600 
            }}>
              Sistema {healthStatus === 'excellent' ? 'Excelente' : 
                      healthStatus === 'good' ? 'Operativo' :
                      healthStatus === 'warning' ? 'Con Advertencias' : 'Crítico'}
            </Typography>
            <Chip
              label={`${systemHealth.uptime}% Uptime`}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Paper>
      </motion.div>

      {/* KPI Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <UnifiedMetricsCard
              {...metric}
              delay={index * 0.1}
              size="large"
              variant="detailed"
            />
          </Grid>
        ))}
      </Grid>

      {/* Secondary Content */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} lg={8}>
          <ModernCard variant="elevated" size="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Schedule sx={{ fontSize: 20, color: '#64748b' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Actividad Reciente
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Últimas acciones del sistema
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => onNavigate('notifications')}
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Ver todo
              </Button>
            </Box>
            
            <Stack spacing={2}>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <Box key={activity.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 16, color: '#64748b' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}
                      >
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#64748b', fontSize: '0.85rem', mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: '#94a3b8', fontSize: '0.75rem' }}
                      >
                        {format(activity.timestamp.toDate(), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    No hay actividad reciente
                  </Typography>
                </Box>
              )}
            </Stack>
          </ModernCard>
        </Grid>

        {/* Quick Actions & System Info */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Quick Actions */}
            <ModernCard variant="elevated" size="md">
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                Acciones Rápidas
              </Typography>
              <Stack spacing={2}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant="outlined"
                    startIcon={action.icon}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      px: 2,
                      borderColor: '#e2e8f0',
                      color: action.color,
                      '&:hover': {
                        borderColor: action.color,
                        bgcolor: `${action.color}08`,
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'left', flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {action.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </ModernCard>

            {/* System Health */}
            <ModernCard variant="elevated" size="md">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Security sx={{ fontSize: 20, color: '#64748b' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Estado del Sistema
                  </Typography>
                  <Chip
                    label={healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                    size="small"
                    sx={{
                      bgcolor: healthStatus === 'excellent' ? '#dcfce7' : 
                              healthStatus === 'good' ? '#dbeafe' :
                              healthStatus === 'warning' ? '#fef3c7' : '#fee2e2',
                      color: healthStatus === 'excellent' ? '#166534' : 
                             healthStatus === 'good' ? '#1e40af' :
                             healthStatus === 'warning' ? '#92400e' : '#991b1b',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                      Almacenamiento
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {((systemHealth.storageUsed / systemHealth.storageLimit) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 6,
                      bgcolor: '#f1f5f9',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(systemHealth.storageUsed / systemHealth.storageLimit) * 100}%`,
                        height: '100%',
                        bgcolor: (systemHealth.storageUsed / systemHealth.storageLimit) > 0.8 ? '#ef4444' : '#10b981',
                        borderRadius: 3,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Último respaldo
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {systemHealth.lastBackup ? format(systemHealth.lastBackup, 'dd/MM HH:mm') : 'Nunca'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Tiempo de respuesta
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {systemHealth.responseTime}ms
                  </Typography>
                </Box>
              </Stack>
            </ModernCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export { OverviewDashboard };