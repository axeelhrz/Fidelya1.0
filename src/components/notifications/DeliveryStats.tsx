'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  Email,
  WhatsApp,
  NotificationsActive,
  CheckCircle,
  Error,
  Schedule,
  Cancel,
  PlayArrow,
  Pause,
  Download,
  Analytics
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useSimpleNotifications } from '../../hooks/useSimpleNotifications';
import { useAuth } from '../../hooks/useAuth';

interface DeliveryStatsProps {
  asociacionId?: string;
  refreshInterval?: number;
}

interface ChannelStats {
  channel: string;
  icon: React.ReactNode;
  color: string;
  total: number;
  sent: number;
  failed: number;
  pending: number;
  successRate: number;
}

const CHANNEL_CONFIG = {
  email: { icon: <Email />, color: '#1976d2', name: 'Email' },
  whatsapp: { icon: <WhatsApp />, color: '#25d366', name: 'WhatsApp' },
  app: { icon: <NotificationsActive />, color: '#7b1fa2', name: 'App' }
};

const STATUS_CONFIG = {
  sent: { icon: <CheckCircle />, color: '#4caf50', name: 'Enviadas' },
  failed: { icon: <Error />, color: '#f44336', name: 'Fallidas' },
  pending: { icon: <Schedule />, color: '#ff9800', name: 'Pendientes' },
  draft: { icon: <Cancel />, color: '#9e9e9e', name: 'Borradores' }
};

export default function DeliveryStats({ asociacionId, refreshInterval = 30000 }: DeliveryStatsProps) {
  const { user } = useAuth();
  const { 
    notifications, 
    stats, 
    loading, 
    error, 
    refreshNotifications 
  } = useSimpleNotifications();

  const [channelPerformance, setChannelPerformance] = useState<Record<string, ChannelStats>>({});
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calculate channel performance from notifications
  useEffect(() => {
    if (notifications.length === 0) return;

    const channelStats: Record<string, ChannelStats> = {};
    
    // Initialize channel stats
    Object.keys(CHANNEL_CONFIG).forEach(channel => {
      channelStats[channel] = {
        channel,
        icon: CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG].icon,
        color: CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG].color,
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
        successRate: 0,
      };
    });

    // Calculate stats from notifications
    notifications.forEach(notification => {
      notification.channels.forEach(channel => {
        if (channelStats[channel]) {
          channelStats[channel].total++;
          
          switch (notification.status) {
            case 'sent':
              channelStats[channel].sent++;
              break;
            case 'failed':
              channelStats[channel].failed++;
              break;
            case 'pending':
            case 'sending':
              channelStats[channel].pending++;
              break;
          }
        }
      });
    });

    // Calculate success rates
    Object.keys(channelStats).forEach(channel => {
      const stats = channelStats[channel];
      if (stats.total > 0) {
        stats.successRate = (stats.sent / stats.total) * 100;
      }
    });

    setChannelPerformance(channelStats);
  }, [notifications]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshNotifications, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshNotifications]);

  // Preparar datos para gráficos
  const chartData = useMemo(() => {
    return [
      { name: 'Enviadas', value: stats.sent, color: '#4caf50' },
      { name: 'Fallidas', value: stats.failed, color: '#f44336' },
      { name: 'Pendientes', value: stats.pending, color: '#ff9800' },
      { name: 'Borradores', value: stats.draft, color: '#9e9e9e' }
    ].filter(item => item.value > 0);
  }, [stats]);

  const channelData = useMemo(() => {
    return Object.entries(channelPerformance).map(([channel, data]) => ({
      channelKey: channel,
      channelName: CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG]?.name || channel,
      ...data
    }));
  }, [channelPerformance]);

  const handleRefresh = () => {
    refreshNotifications();
  };

  const handleExportStats = async () => {
    try {
      const data = {
        stats,
        channelPerformance,
        notifications: notifications.slice(0, 100), // Export only last 100
        timeRange,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `delivery-stats-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting stats:', err);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LinearProgress sx={{ flexGrow: 1 }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Reintentar
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  const successRate = stats.total > 0 ? (stats.sent / stats.total) * 100 : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Estadísticas de Entrega
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitoreo del sistema de notificaciones simples
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {/* Selector de rango de tiempo */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </Box>

          {/* Controles */}
          <Tooltip title={autoRefresh ? 'Pausar auto-actualización' : 'Activar auto-actualización'}>
            <IconButton onClick={() => setAutoRefresh(!autoRefresh)}>
              {autoRefresh ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Actualizar">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Tooltip title="Exportar estadísticas">
            <IconButton onClick={handleExportStats}>
              <Download />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Métricas principales */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mb: 4 
        }}>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const value = stats[status as keyof typeof stats] as number;
            const percentage = stats.total > 0 ? (value / stats.total) * 100 : 0;
            
            return (
              <motion.div
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: config.color, mr: 1 }}>
                        {config.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {config.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: config.color
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {percentage.toFixed(1)}% del total
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>

        {/* Métricas de rendimiento */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 3, 
          mb: 4 
        }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="h6">Tasa de Éxito</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {successRate.toFixed(1)}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {successRate >= 90 ? (
                  <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  {stats.sent} de {stats.total} notificaciones
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6">Canales Activos</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {Object.keys(CHANNEL_CONFIG).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email, WhatsApp, App
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsActive sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="h6">Total Procesadas</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {stats.total.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Todas las notificaciones
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Gráficos */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
          gap: 3, 
          mb: 4 
        }}>
          {/* Gráfico de distribución */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución de Estados
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Rendimiento por canal */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rendimiento por Canal
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channelName" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="successRate" fill="#4caf50" name="Tasa de Éxito %" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Detalles por canal */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detalles por Canal
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
              gap: 2 
            }}>
              {Object.entries(channelPerformance).map(([channel, data]) => {
                const config = CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG];
                if (!config || data.total === 0) return null;

                return (
                  <motion.div
                    key={channel}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Paper sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ color: config.color, mr: 1 }}>
                          {config.icon}
                        </Box>
                        <Typography variant="subtitle1">
                          {config.name}
                        </Typography>
                      </Box>

                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Total:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {data.total}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Enviadas:</Typography>
                          <Typography variant="body2" color="success.main">
                            {data.sent}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Éxito:</Typography>
                          <Typography variant="body2" color="success.main">
                            {data.successRate.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={data.successRate}
                        sx={{
                          mt: 2,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: config.color
                          }
                        }}
                      />
                    </Paper>
                  </motion.div>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}