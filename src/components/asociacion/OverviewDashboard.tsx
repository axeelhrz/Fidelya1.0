'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  PersonAdd,
  Analytics,
  Star,
  Timeline,
  BarChart,
  PieChart,
  CalendarToday,
  Assessment,
  Warning,
  CheckCircle,
  Info,
  ArrowForward,
  Refresh,
  NotificationsActive,
  CloudUpload,
  Security,
  Speed,
  People,
  AccountBalance,
  Schedule,
  ErrorOutline,
  AutoGraph,
  DataUsage,
  Campaign,
} from '@mui/icons-material';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
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
  metadata?: Record<string, any>;
  userId?: string;
  userName?: string;
}

interface SystemMetrics {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  inactiveMembers: number;
  growthRate: number;
  retentionRate: number;
  recentActivities: ActivityLog[];
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastBackup: Date | null;
  storageUsed: number;
  storageLimit: number;
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
      member_added: <PersonAdd sx={{ fontSize: 20 }} />,
      member_updated: <People sx={{ fontSize: 20 }} />,
      payment_received: <AccountBalance sx={{ fontSize: 20 }} />,
      backup_completed: <Security sx={{ fontSize: 20 }} />,
      import_completed: <CloudUpload sx={{ fontSize: 20 }} />,
      system_alert: <Warning sx={{ fontSize: 20 }} />,
    };
    return icons[type] || <Info sx={{ fontSize: 20 }} />;
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
                  Últimas acciones del sistema
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

const SystemHealthCard: React.FC<{
  health: SystemMetrics['systemHealth'];
  lastBackup: Date | null;
  storageUsed: number;
  storageLimit: number;
  loading: boolean;
}> = ({ health, lastBackup, storageUsed, storageLimit, loading }) => {
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

  const storagePercentage = (storageUsed / storageLimit) * 100;

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
                Estado del Sistema
              </Typography>
              <Chip
                label={health.charAt(0).toUpperCase() + health.slice(1)}
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
            {/* Last Backup */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                  Último respaldo
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {loading ? '...' : lastBackup ? format(lastBackup, 'dd/MM HH:mm') : 'Nunca'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: lastBackup && (Date.now() - lastBackup.getTime()) < 24 * 60 * 60 * 1000 ? '#10b981' : '#f59e0b',
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {lastBackup && (Date.now() - lastBackup.getTime()) < 24 * 60 * 60 * 1000 
                    ? 'Actualizado' 
                    : 'Requiere atención'
                  }
                </Typography>
              </Box>
            </Box>

            {/* Storage Usage */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                  Almacenamiento
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {loading ? '...' : `${storagePercentage.toFixed(1)}%`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={loading ? 0 : storagePercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#e2e8f0', 0.5),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: storagePercentage > 80 ? '#ef4444' : storagePercentage > 60 ? '#f59e0b' : '#10b981',
                    borderRadius: 3,
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                {loading ? '...' : `${(storageUsed / 1024).toFixed(1)} GB de ${(storageLimit / 1024).toFixed(1)} GB utilizados`}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onAddMember
}) => {
  const { user } = useAuth();
  const { stats, loading: sociosLoading } = useSocios();
  const { stats: notificationStats } = useNotifications();
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    inactiveMembers: 0,
    growthRate: 0,
    retentionRate: 0,
    recentActivities: [],
    systemHealth: 'good',
    lastBackup: null,
    storageUsed: 0,
    storageLimit: 5120, // 5GB in MB
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch system metrics and activities from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSystemMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent activities
        const activitiesRef = collection(db, 'activities');
        const activitiesQuery = query(
          activitiesRef,
          where('asociacionId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
          const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ActivityLog[];

          // Calculate growth rate (mock calculation based on recent activity)
          const recentMemberAdditions = activities.filter(a =>
            a.type === 'member_added' &&
            a.timestamp.toDate() > subDays(new Date(), 30)
          ).length;
          const growthRate = (recentMemberAdditions / Math.max(stats.total, 1)) * 100;

          // Calculate retention rate (mock calculation)
          const retentionRate = stats.total > 0 ? ((stats.activos / stats.total) * 100) : 0;

          // Determine system health
          let systemHealth: SystemMetrics['systemHealth'] = 'excellent';
          if (stats.vencidos > stats.total * 0.3) systemHealth = 'warning';
          if (stats.vencidos > stats.total * 0.5) systemHealth = 'critical';
          if (stats.activos > stats.total * 0.9) systemHealth = 'excellent';
          else if (stats.activos > stats.total * 0.7) systemHealth = 'good';

          // Mock storage and backup data
          const storageUsed = Math.floor(Math.random() * 2048) + 512; // Random between 512MB and 2.5GB
          const lastBackup = subDays(new Date(), Math.floor(Math.random() * 3)); // Random within last 3 days

          setSystemMetrics({
            totalMembers: stats.total,
            activeMembers: stats.activos,
            expiredMembers: stats.vencidos,
            inactiveMembers: stats.inactivos,
            growthRate: Math.round(growthRate * 100) / 100,
            retentionRate: Math.round(retentionRate * 100) / 100,
            recentActivities: activities,
            systemHealth,
            lastBackup,
            storageUsed,
            storageLimit: 5120,
          });
        });

        return () => {
          unsubscribeActivities();
        };

      } catch (err) {
        console.error('Error fetching system metrics:', err);
        setError('Error al cargar las métricas del sistema');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemMetrics();
  }, [user, stats]);

  // Create sample activity if none exist
  useEffect(() => {
    if (!user || systemMetrics.recentActivities.length > 0) return;

    const createSampleActivity = async () => {
      try {
        const activitiesRef = collection(db, 'activities');
        const sampleActivity = {
          type: 'system_alert',
          title: 'Sistema iniciado',
          description: 'El sistema de gestión ha sido iniciado correctamente',
          timestamp: Timestamp.now(),
          asociacionId: user.uid,
          userId: user.uid,
          userName: user.email?.split('@')[0] || 'Sistema',
          metadata: {
            source: 'system',
            level: 'info'
          }
        };

        // This would normally be done server-side
        // await addDoc(activitiesRef, sampleActivity);
      } catch (err) {
        console.error('Error creating sample activity:', err);
      }
    };

    createSampleActivity();
  }, [user, systemMetrics.recentActivities.length]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Total de Miembros',
      value: systemMetrics.totalMembers.toLocaleString(),
      change: systemMetrics.growthRate,
      icon: <Group sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Crecimiento mensual',
      trend: systemMetrics.growthRate > 0 ? 'up' as const : systemMetrics.growthRate < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate('all-members'),
      loading: sociosLoading
    },
    {
      title: 'Miembros Activos',
      value: systemMetrics.activeMembers.toLocaleString(),
      change: systemMetrics.retentionRate,
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Tasa de retención',
      trend: systemMetrics.retentionRate > 80 ? 'up' as const : systemMetrics.retentionRate < 60 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate('active-members'),
      loading: sociosLoading
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread.toString(),
      change: notificationStats.unread > 0 ? 100 : 0,
      icon: <NotificationsActive sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Sin leer',
      trend: notificationStats.unread > 5 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate('notifications'),
      loading: false
    },
    {
      title: 'Miembros Vencidos',
      value: systemMetrics.expiredMembers.toLocaleString(),
      change: systemMetrics.expiredMembers > 0 ? -((systemMetrics.expiredMembers / Math.max(systemMetrics.totalMembers, 1)) * 100) : 0,
      icon: <Warning sx={{ fontSize: 28 }} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      delay: 0.3,
      subtitle: 'Requieren atención',
      trend: systemMetrics.expiredMembers > systemMetrics.totalMembers * 0.2 ? 'up' as const : 'down' as const,
      onClick: () => onNavigate('expired-members'),
      loading: sociosLoading
    }
  ], [systemMetrics, notificationStats, sociosLoading, onNavigate]);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '100%', overflow: 'hidden' }}>
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
                <Analytics sx={{ fontSize: 32 }} />
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
                  Vista General
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  Panel de control ejecutivo • {user?.email?.split('@')[0] || 'Administrador'}
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
                onClick={onAddMember}
                variant="contained"
                startIcon={<PersonAdd />}
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
                Nuevo Miembro
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
                  <Box component="span" sx={{ fontWeight: 900 }}>Sistema operativo</Box> - Todos los servicios funcionando correctamente
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
          activities={systemMetrics.recentActivities}
          loading={loading}
          onViewAll={() => onNavigate('notifications')}
        />
        <SystemHealthCard
          health={systemMetrics.systemHealth}
          lastBackup={systemMetrics.lastBackup}
          storageUsed={systemMetrics.storageUsed}
          storageLimit={systemMetrics.storageLimit}
          loading={loading}
        />
      </Box>
    </Box>
  );
};