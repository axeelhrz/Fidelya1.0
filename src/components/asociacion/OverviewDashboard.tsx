'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
  LinearProgress,
  CircularProgress,
  Container,
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
  TrendingDown,
  Assessment,
  Security,
  DataUsage,
  Timeline,
  Settings,
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
import { format, subDays} from 'date-fns';
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

// Componente de Métrica Simple - Dimensiones uniformes
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactElement;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  onClick?: () => void;
  loading?: boolean;
}> = ({ title, value, subtitle, icon, color, trend, trendValue, onClick, loading }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 3,
      border: '1px solid #f1f5f9',
      borderRadius: 3,
      bgcolor: '#ffffff',
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      // Dimensiones exactas y uniformes
      width: '100%',
      height: '200px',
      minHeight: '200px',
      maxHeight: '200px',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        bgcolor: color,
      },
    }}
  >
    {/* Header con icono y tendencia */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      justifyContent: 'space-between', 
      mb: 2,
      height: '48px',
      minHeight: '48px'
    }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color }} />
        ) : (
          React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ sx?: object }>,
                {
                  ...(icon.props || {}),
                  sx: { ...((icon.props as { sx?: object })?.sx || {}), fontSize: 22 }
                }
              )
            : icon
        )}
      </Box>
      {trend && trendValue !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          {trend === 'up' ? (
            <TrendingUp sx={{ fontSize: 14, color: '#10b981' }} />
          ) : trend === 'down' ? (
            <TrendingDown sx={{ fontSize: 14, color: '#ef4444' }} />
          ) : null}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#64748b',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            {trendValue > 0 ? '+' : ''}{trendValue}%
          </Typography>
        </Box>
      )}
    </Box>
    
    {/* Contenido principal */}
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      minHeight: 0,
    }}>
      <Typography
        variant="overline"
        sx={{
          color: '#64748b',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          mb: 1,
          display: 'block',
          lineHeight: 1.2,
          height: '16px',
          overflow: 'hidden',
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: '#0f172a',
          fontSize: '1.8rem',
          lineHeight: 1,
          mb: subtitle ? 1 : 0,
          height: subtitle ? 'auto' : '36px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {loading ? '...' : typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.8rem',
            lineHeight: 1.3,
            height: '20px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Paper>
);

// Componente de Estado del Sistema
const SystemStatusCard: React.FC<{
  health: SystemHealth;
  loading: boolean;
}> = ({ health, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Operativo';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  const storagePercentage = (health.storageUsed / health.storageLimit) * 100;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: '1px solid #f1f5f9',
        borderRadius: 3,
        bgcolor: '#ffffff',
        height: '100%',
        minHeight: '400px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: `${getStatusColor(health.status)}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getStatusColor(health.status),
          }}
        >
          <Security sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Estado del Sistema
          </Typography>
          <Chip
            label={getStatusText(health.status)}
            size="medium"
            sx={{
              bgcolor: `${getStatusColor(health.status)}15`,
              color: getStatusColor(health.status),
              fontWeight: 700,
              fontSize: '0.85rem',
              height: 32,
            }}
          />
        </Box>
      </Box>

      <Stack spacing={4}>
        {/* Uptime */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#475569' }}>
              Tiempo de actividad
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>
              {loading ? '...' : `${health.uptime}%`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={loading ? 0 : health.uptime}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                bgcolor: health.uptime > 99 ? '#10b981' : health.uptime > 95 ? '#f59e0b' : '#ef4444',
                borderRadius: 4,
              }
            }}
          />
        </Box>

        {/* Storage */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#475569' }}>
              Almacenamiento
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>
              {loading ? '...' : `${storagePercentage.toFixed(1)}%`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={loading ? 0 : storagePercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                bgcolor: storagePercentage > 80 ? '#ef4444' : storagePercentage > 60 ? '#f59e0b' : '#10b981',
                borderRadius: 4,
              }
            }}
          />
          <Typography variant="body2" sx={{ color: '#64748b', mt: 1, fontWeight: 600 }}>
            {loading ? '...' : `${(health.storageUsed / 1024).toFixed(1)} GB de ${(health.storageLimit / 1024).toFixed(1)} GB utilizados`}
          </Typography>
        </Box>

        {/* Metrics using CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#f8fafc', borderRadius: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, mb: 1 }}>
              Último Respaldo
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
              {loading ? '...' : health.lastBackup ? format(health.lastBackup, 'dd/MM HH:mm') : 'Nunca'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#f8fafc', borderRadius: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, mb: 1 }}>
              Respuesta
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
              {loading ? '...' : `${health.responseTime}ms`}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

// Componente de Actividad Reciente
const ActivityFeedCard: React.FC<{
  activities: ActivityLog[];
  loading: boolean;
  onViewAll: () => void;
}> = ({ activities, loading, onViewAll }) => {
  const getActivityIcon = (type: ActivityLog['type']) => {
    const icons = {
      member_added: <PersonAdd sx={{ fontSize: 18 }} />,
      member_updated: <Group sx={{ fontSize: 18 }} />,
      payment_received: <Assessment sx={{ fontSize: 18 }} />,
      backup_completed: <Security sx={{ fontSize: 18 }} />,
      import_completed: <DataUsage sx={{ fontSize: 18 }} />,
      system_alert: <Warning sx={{ fontSize: 18 }} />,
    };
    return icons[type] || <Timeline sx={{ fontSize: 18 }} />;
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    const colors = {
      member_added: '#10b981',
      member_updated: '#6366f1',
      payment_received: '#f59e0b',
      backup_completed: '#8b5cf6',
      import_completed: '#06b6d4',
      system_alert: '#ef4444',
    };
    return colors[type] || '#64748b';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: '1px solid #f1f5f9',
        borderRadius: 3,
        bgcolor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
            }}
          >
            <Timeline sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Actividad Reciente
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
              Últimas acciones del sistema
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onViewAll}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            color: '#6366f1',
            borderColor: '#e2e8f0',
            px: 3,
            py: 1,
          }}
        >
          Ver todo
        </Button>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Stack spacing={3}>
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity, index) => (
                <Box key={activity.id}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 3,
                        bgcolor: `${getActivityColor(activity.type)}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getActivityColor(activity.type),
                        flexShrink: 0,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          mb: 0.5,
                          fontSize: '1rem',
                        }}
                      >
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          fontSize: '0.9rem',
                          mb: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {format(activity.timestamp.toDate(), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                  {index < activities.length - 1 && (
                    <Divider sx={{ mt: 3, bgcolor: '#f1f5f9' }} />
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  No hay actividad reciente
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

// Componente Principal
const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onAddMember
}) => {
  const { user } = useAuth();
  const { stats, loading: sociosLoading } = useSocios();
  const { stats: notificationStats } = useNotifications();
  
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const systemHealth = useMemo<SystemHealth>(() => ({
    status: 'good',
    lastBackup: subDays(new Date(), 1),
    storageUsed: 1024,
    storageLimit: 5120,
    uptime: 99.9,
    responseTime: 120,
  }), []);
  const [loading, setLoading] = useState(true);

  // Fetch real-time activities from Firebase
  useEffect(() => {
    if (!user) return;

    const activitiesRef = collection(db, 'activities');
    const activitiesQuery = query(
      activitiesRef,
      where('asociacionId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
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
    const memberGrowth = activities.filter(a => a.type === 'member_added').length;
    const growthRate = stats.total > 0 ? (memberGrowth / stats.total) * 100 : 0;
    const retentionRate = stats.total > 0 ? (stats.activos / stats.total) * 100 : 0;

    return {
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

  const quickActions = [
    {
      title: 'Nuevo Socio',
      description: 'Agregar nuevo miembro',
      icon: <PersonAdd />,
      color: '#6366f1',
      onClick: onAddMember,
    },
    {
      title: 'Analytics',
      description: 'Ver métricas detalladas',
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
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <Settings />,
      color: '#64748b',
      onClick: () => onNavigate('settings'),
    },
  ];

  return (
    <Box sx={{ 
      bgcolor: '#fafbfc', 
      minHeight: '100vh',
      py: { xs: 3, md: 5 },
      px: { xs: 2, md: 4, lg: 6, xl: 8 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 3
          }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: '#0f172a',
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                Vista General
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Panel de control • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={3}>
              <Button
                onClick={() => window.location.reload()}
                variant="outlined"
                startIcon={<Refresh />}
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.95rem',
                }}
              >
                Actualizar
              </Button>
              <Button
                onClick={onAddMember}
                variant="contained"
                startIcon={<PersonAdd />}
                sx={{
                  bgcolor: '#6366f1',
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  '&:hover': {
                    bgcolor: '#5b21b6',
                    boxShadow: 'none',
                  },
                }}
              >
                Nuevo Socio
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Main Content using CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gridTemplateRows: 'auto',
            gridTemplateAreas: {
              xs: `
                "metric1"
                "metric2"
                "metric3"
                "metric4"
                "activity"
                "system"
                "actions"
              `,
              sm: `
                "metric1 metric2"
                "metric3 metric4"
                "activity activity"
                "system system"
                "actions actions"
              `,
              lg: `
                "metric1 metric2 metric3 metric4"
                "activity activity activity system"
                "actions actions actions actions"
              `,
            },
          }}
        >
          {/* KPI Metrics - Dimensiones uniformes */}
          <Box sx={{ gridArea: 'metric1' }}>
            <MetricCard
              title="Total Socios"
              value={stats.total}
              subtitle="Miembros registrados"
              icon={<Group />}
              color="#3b82f6"
              trend="up"
              trendValue={growthMetrics.growthRate}
              onClick={() => onNavigate('all-members')}
              loading={sociosLoading}
            />
          </Box>
          
          <Box sx={{ gridArea: 'metric2' }}>
            <MetricCard
              title="Socios Activos"
              value={stats.activos}
              subtitle="Estado vigente"
              icon={<CheckCircle />}
              color="#10b981"
              trend="up"
              trendValue={growthMetrics.retentionRate}
              onClick={() => onNavigate('active-members')}
              loading={sociosLoading}
            />
          </Box>
          
          <Box sx={{ gridArea: 'metric3' }}>
            <MetricCard
              title="Notificaciones"
              value={notificationStats.unread}
              subtitle="Sin leer"
              icon={<NotificationsActive />}
              color="#f59e0b"
              trend={notificationStats.unread > 5 ? 'up' : 'neutral'}
              trendValue={notificationStats.unread > 5 ? 25 : 0}
              onClick={() => onNavigate('notifications')}
            />
          </Box>
          
          <Box sx={{ gridArea: 'metric4' }}>
            <MetricCard
              title="Socios Vencidos"
              value={stats.vencidos}
              subtitle="Requieren atención"
              icon={<Warning />}
              color="#ef4444"
              trend={stats.vencidos > stats.total * 0.2 ? 'up' : 'down'}
              trendValue={stats.vencidos > 0 ? -((stats.vencidos / Math.max(stats.total, 1)) * 100) : 0}
              onClick={() => onNavigate('expired-members')}
              loading={sociosLoading}
            />
          </Box>

          {/* Activity Feed */}
          <Box sx={{ gridArea: 'activity' }}>
            <ActivityFeedCard
              activities={activities}
              loading={loading}
              onViewAll={() => onNavigate('notifications')}
            />
          </Box>

          {/* System Health */}
          <Box sx={{ gridArea: 'system' }}>
            <SystemStatusCard
              health={{ ...systemHealth, status: healthStatus }}
              loading={loading}
            />
          </Box>

          {/* Quick Actions */}
          <Box sx={{ gridArea: 'actions' }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '1px solid #f1f5f9',
                borderRadius: 3,
                bgcolor: '#ffffff',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 4 }}>
                Acciones Rápidas
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {quickActions.map((action, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    onClick={action.onClick}
                    sx={{
                      p: 3,
                      border: '2px solid #e2e8f0',
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 2,
                      minHeight: '140px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: action.color,
                        bgcolor: `${action.color}05`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${action.color}20`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        bgcolor: action.color,
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      },
                    }}
                  >
                    {/* Icon Container */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        bgcolor: `${action.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: action.color,
                        transition: 'all 0.2s ease-in-out',
                        mb: 1,
                      }}
                    >
                      {React.isValidElement(action.icon) && (action.icon.type as React.JSXElementConstructor<unknown> & { muiName?: string }).muiName
                        ? React.cloneElement(action.icon as React.ReactElement<{ sx?: object }>, { sx: { fontSize: 24 } })
                        : action.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, width: '100%' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b',
                          fontSize: '1.1rem',
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {action.description}
                      </Typography>
                    </Box>

                    {/* Hover Arrow Indicator */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: `${action.color}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transform: 'scale(0.8)',
                        transition: 'all 0.2s ease-in-out',
                        '.MuiPaper-root:hover &': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderLeft: '4px solid transparent',
                          borderRight: '4px solid transparent',
                          borderBottom: `6px solid ${action.color}`,
                          transform: 'rotate(45deg)',
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export { OverviewDashboard };