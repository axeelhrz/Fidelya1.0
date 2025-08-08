'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  CircularProgress,
  alpha,
  Tooltip,
  Stack,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Notifications,
  Speed,
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh,
  Download,
  Campaign,
  Schedule,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { notificationAnalyticsService, NotificationAnalytics } from '@/services/notification-analytics.service';

interface NotificationDashboardProps {
  loading?: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
  subtitle,
  loading = false
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: alpha(color, 0.3),
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={24} sx={{ color }} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha(color, 0.1),
                  color,
                }}
              >
                {icon}
              </Avatar>
              
              {change !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getTrendIcon()}
                  <Typography
                    variant="caption"
                    sx={{
                      color: getTrendColor(),
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#1e293b',
                lineHeight: 1,
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
                mb: subtitle ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </>
        )}
      </CardContent>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${alpha(color, 0.1)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    </Card>
  );
};

export const NotificationDashboard: React.FC<NotificationDashboardProps> = ({
  loading: externalLoading = false
}) => {
  
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange] = useState({
    start: startOfDay(subDays(new Date(), 30)),
    end: endOfDay(new Date()),
  });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeNotifications: 0,
    pendingDeliveries: 0,
    recentFailures: 0,
    currentThroughput: 0,
    systemHealth: 'healthy' as 'healthy' | 'warning' | 'critical',
  });
  const [refreshing, setRefreshing] = useState(false);

  // Load analytics data
  const loadAnalytics = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await notificationAnalyticsService.getAnalytics(
        dateRange.start,
        dateRange.end
      );
      
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError((err as Error)?.message ?? 'Error al cargar los análisis');
      toast.error('Error al cargar los análisis');
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  // Load real-time metrics
  const loadRealTimeMetrics = async () => {
    try {
      const metrics = await notificationAnalyticsService.getRealTimeMetrics();
      setRealTimeMetrics(metrics);
    } catch (err) {
      console.error('Error loading real-time metrics:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadAnalytics();
    loadRealTimeMetrics();
  }, [loadAnalytics]);

  // Auto-refresh real-time metrics
  useEffect(() => {
    const interval = setInterval(loadRealTimeMetrics, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadAnalytics(), loadRealTimeMetrics()]);
      toast.success('Datos actualizados');
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setRefreshing(false);
    }
  };

  // Memoized chart data
  const chartData = useMemo(() => {
    if (!analytics) return null;

    // Daily trends for line chart
    const dailyData = analytics.dailyTrends.map(day => ({
      date: format(new Date(day.date), 'dd/MM', { locale: es }),
      enviadas: day.sent,
      entregadas: day.delivered,
      fallidas: day.failed,
      tasa: day.deliveryRate,
    }));

    // Channel performance for pie chart
    const channelData = Object.entries(analytics.channelStats).map(([channel, stats]) => ({
      name: channel === 'email' ? 'Email' : 
            channel === 'sms' ? 'SMS' : 
            channel === 'push' ? 'Push' : 'App',
      value: stats.sent,
      delivered: stats.delivered,
      rate: stats.deliveryRate,
      color: channel === 'email' ? '#3b82f6' : 
             channel === 'sms' ? '#f59e0b' : 
             channel === 'push' ? '#8b5cf6' : '#10b981',
    }));

    // Hourly distribution for bar chart
    const hourlyData = analytics.hourlyDistribution.map(hour => ({
      hora: `${hour.hour}:00`,
      enviadas: hour.sent,
      entregadas: hour.delivered,
      tasa: hour.deliveryRate,
    }));

    return { dailyData, channelData, hourlyData };
  }, [analytics]);

  // System health color
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'critical':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const isLoading = loading || externalLoading || refreshing;

  if (error && !analytics) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Error al cargar el dashboard
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            onClick={handleRefresh}
            variant="contained"
            startIcon={<Refresh />}
            size="small"
          >
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
              Dashboard de Notificaciones
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Análisis y métricas de rendimiento en tiempo real
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Actualizar datos">
              <IconButton
                onClick={handleRefresh}
                disabled={isLoading}
                sx={{
                  bgcolor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.2),
                  }
                }}
              >
                <Refresh sx={{ 
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }} />
              </IconButton>
            </Tooltip>

            <Button
              startIcon={<Download />}
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {/* System Health Alert */}
        <AnimatePresence>
          {realTimeMetrics.systemHealth !== 'healthy' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                severity={realTimeMetrics.systemHealth === 'critical' ? 'error' : 'warning'}
                sx={{ borderRadius: 3, mb: 3 }}
                icon={getHealthIcon(realTimeMetrics.systemHealth)}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {realTimeMetrics.systemHealth === 'critical' ? 'Sistema Crítico' : 'Advertencia del Sistema'}
                </Typography>
                <Typography variant="body2">
                  {realTimeMetrics.systemHealth === 'critical' 
                    ? 'Se detectaron problemas críticos en el sistema de notificaciones'
                    : 'El sistema presenta algunas advertencias que requieren atención'
                  }
                </Typography>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Real-time Metrics */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        <MetricCard
          title="Notificaciones Activas"
          value={realTimeMetrics.activeNotifications}
          icon={<Notifications />}
          color="#6366f1"
          loading={isLoading}
        />
        <MetricCard
          title="Entregas Pendientes"
          value={realTimeMetrics.pendingDeliveries}
          icon={<Schedule />}
          color="#f59e0b"
          loading={isLoading}
        />
        <MetricCard
          title="Fallos Recientes"
          value={realTimeMetrics.recentFailures}
          icon={<Error />}
          color="#ef4444"
          loading={isLoading}
        />
        <MetricCard
          title="Rendimiento Actual"
          value={`${realTimeMetrics.currentThroughput}/h`}
          icon={<Speed />}
          color={getHealthColor(realTimeMetrics.systemHealth)}
          subtitle="Entregas por hora"
          loading={isLoading}
        />
      </Box>

      {analytics && (
        <>
          {/* Main Metrics */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4 
          }}>
            <MetricCard
              title="Total Enviadas"
              value={analytics.totalSent}
              change={5.2}
              trend="up"
              icon={<Campaign />}
              color="#3b82f6"
              loading={isLoading}
            />
            <MetricCard
              title="Tasa de Entrega"
              value={`${analytics.deliveryRate.toFixed(1)}%`}
              change={2.1}
              trend="up"
              icon={<CheckCircle />}
              color="#10b981"
              loading={isLoading}
            />
            <MetricCard
              title="Tiempo Promedio"
              value={`${(analytics.averageDeliveryTime / 1000).toFixed(1)}s`}
              change={-8.3}
              trend="down"
              icon={<Speed />}
              color="#8b5cf6"
              subtitle="Tiempo de entrega"
              loading={isLoading}
            />
            <MetricCard
              title="Tasa de Fallos"
              value={`${analytics.failureRate.toFixed(1)}%`}
              change={-1.2}
              trend="down"
              icon={<Error />}
              color="#ef4444"
              loading={isLoading}
            />
          </Box>

          {/* Charts Section */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3,
            mb: 4 
          }}>
            {/* Daily Trends */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #f1f5f9',
                borderRadius: 4,
                height: 400,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Tendencias Diarias
                </Typography>
                <Chip
                  label="Últimos 30 días"
                  size="small"
                  sx={{
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {chartData && (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.dailyData}>
                    <defs>
                      <linearGradient id="colorEnviadas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEntregadas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="enviadas"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorEnviadas)"
                      name="Enviadas"
                    />
                    <Area
                      type="monotone"
                      dataKey="entregadas"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorEntregadas)"
                      name="Entregadas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Paper>

            {/* Channel Performance */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #f1f5f9',
                borderRadius: 4,
                height: 400,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                Rendimiento por Canal
              </Typography>

              {chartData && (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

              <Stack spacing={2} sx={{ mt: 2 }}>
                {chartData?.channelData.map((channel, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: channel.color,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {channel.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {channel.rate.toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* Hourly Distribution */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #f1f5f9',
              borderRadius: 4,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
              Distribución por Horas
            </Typography>

            {chartData && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hora" 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar
                    dataKey="enviadas"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Enviadas"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Error Analysis */}
          {analytics.topErrors.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #f1f5f9',
                borderRadius: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                Análisis de Errores
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2 
              }}>
                {analytics.topErrors.slice(0, 3).map((error, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid #fee2e2',
                      borderRadius: 3,
                      bgcolor: '#fef2f2',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#dc2626', mb: 1 }}>
                      {error.error}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f1d1d', mb: 1 }}>
                      {error.count} ocurrencias ({error.percentage.toFixed(1)}%)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {error.channels.map((channel, idx) => (
                        <Chip
                          key={idx}
                          label={channel}
                          size="small"
                          sx={{
                            bgcolor: alpha('#dc2626', 0.1),
                            color: '#dc2626',
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: 3,
            bgcolor: alpha('#6366f1', 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: '#6366f1',
            }
          }}
        />
      )}
    </Container>
  );
};