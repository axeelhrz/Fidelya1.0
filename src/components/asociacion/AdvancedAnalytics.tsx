'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  PersonAdd,
  Schedule,
  AttachMoney,
  Analytics,
  Speed,
  Star,
  Timeline,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
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
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Socio, SocioStats } from '@/types/socio';

interface AdvancedAnalyticsProps {
  socios: Socio[];
  stats: SocioStats;
  loading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  delay,
  subtitle,
  trend = 'neutral'
}) => {
  const theme = useTheme();
  
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
    >
      <Card
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #f1f5f9',
          borderRadius: 6,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: 'translateY(-8px)',
            boxShadow: `0 25px 80px -15px ${alpha(color, 0.25)}`,
            '& .metric-icon': {
              transform: 'scale(1.15) rotate(5deg)',
              bgcolor: alpha(color, 0.2),
            },
            '& .metric-glow': {
              opacity: 0.8,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="metric-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)}, ${color})`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Avatar
              className="metric-icon"
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha(color, 0.12),
                color: color,
                borderRadius: 5,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 8px 32px ${alpha(color, 0.2)}`,
              }}
            >
              {icon}
            </Avatar>
            
            {/* Trend indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend === 'up' && <TrendingUp sx={{ fontSize: 20, color: '#10b981' }} />}
              {trend === 'down' && <TrendingDown sx={{ fontSize: 20, color: '#ef4444' }} />}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280',
                  fontSize: '0.9rem'
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#94a3b8',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              {title}
            </Typography>
            
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: '2.8rem',
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                mb: subtitle ? 1 : 0,
              }}
            >
              {value}
            </Typography>
            
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Progress indicator */}
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={Math.abs(change) > 100 ? 100 : Math.abs(change)}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color, fontWeight: 600 }}
          >
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  socios,
  stats,
  loading
}) => {
  const theme = useTheme();

  // Generate mock data for charts (in real app, this would come from your data)
  const monthlyData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      nuevos: Math.floor(Math.random() * 20) + 5,
      activos: Math.floor(Math.random() * 50) + 30,
      vencidos: Math.floor(Math.random() * 10) + 2,
    }));
  }, []);

  const statusData = useMemo(() => [
    { name: 'Activos', value: stats.activos, color: '#10b981' },
    { name: 'Vencidos', value: stats.vencidos, color: '#ef4444' },
    { name: 'Inactivos', value: stats.inactivos, color: '#6b7280' },
  ], [stats]);

  const engagementData = useMemo(() => {
    const categories = ['Muy Alto', 'Alto', 'Medio', 'Bajo'];
    return categories.map(category => ({
      category,
      value: Math.floor(Math.random() * 30) + 10,
    }));
  }, []);

  const activityRate = stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0;
  const growthRate = 12.5; // Mock growth rate
  const retentionRate = 87.3; // Mock retention rate
  const avgLifetime = 18.5; // Mock average lifetime in months

  const metrics = [
    {
      title: 'Miembros Totales',
      value: stats.total.toLocaleString(),
      change: growthRate,
      icon: <Group sx={{ fontSize: 32 }} />,
      color: '#6366f1',
      delay: 0,
      subtitle: 'Crecimiento mensual',
      trend: 'up' as const
    },
    {
      title: 'Tasa de Actividad',
      value: `${activityRate}%`,
      change: 5.2,
      icon: <Speed sx={{ fontSize: 32 }} />,
      color: '#10b981',
      delay: 0.1,
      subtitle: 'Miembros activos',
      trend: 'up' as const
    },
    {
      title: 'Retención',
      value: `${retentionRate}%`,
      change: -2.1,
      icon: <Star sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      delay: 0.2,
      subtitle: 'Últimos 12 meses',
      trend: 'down' as const
    },
    {
      title: 'Tiempo Promedio',
      value: `${avgLifetime}m`,
      change: 8.7,
      icon: <Schedule sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      delay: 0.3,
      subtitle: 'Permanencia media',
      trend: 'up' as const
    }
  ];

  if (loading) {
    return (
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #f1f5f9',
                  borderRadius: 6,
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: '#f1f5f9',
                        borderRadius: 5,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        width: 48,
                        height: 24,
                        bgcolor: '#f1f5f9',
                        borderRadius: 2,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: '60%',
                        height: 16,
                        bgcolor: '#f1f5f9',
                        borderRadius: 1,
                        mb: 2,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    />
                    <Box
                      sx={{
                        width: '40%',
                        height: 32,
                        bgcolor: '#f1f5f9',
                        borderRadius: 1,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ mb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha('#6366f1', 0.15),
                  color: '#6366f1',
                  borderRadius: 3,
                }}
              >
                <Analytics sx={{ fontSize: 24 }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#0f172a', 
                    letterSpacing: '-0.02em',
                    fontSize: '2rem'
                  }}
                >
                  Analytics Avanzado
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }}
                >
                  Insights profundos y métricas de rendimiento en tiempo real
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Metrics Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                color={metric.color}
                delay={metric.delay}
                subtitle={metric.subtitle}
                trend={metric.trend}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          {/* Monthly Trends */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #f1f5f9',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                        Tendencias Mensuales
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Evolución de miembros en los últimos 6 meses
                      </Typography>
                    </Box>
                    <Chip
                      icon={<Timeline />}
                      label="Últimos 6 meses"
                      sx={{
                        bgcolor: alpha('#6366f1', 0.1),
                        color: '#6366f1',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="nuevos"
                          stroke="#6366f1"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorNuevos)"
                          name="Nuevos Miembros"
                        />
                        <Area
                          type="monotone"
                          dataKey="activos"
                          stroke="#10b981"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorActivos)"
                          name="Miembros Activos"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Status Distribution */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #f1f5f9',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                      Distribución de Estados
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Composición actual de miembros
                    </Typography>
                  </Box>
                  
                  <Box sx={{ height: 200, mb: 3 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Stack spacing={2}>
                    {statusData.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: item.color,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Engagement Levels */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #f1f5f9',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                        Niveles de Engagement
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Distribución de la participación de miembros
                      </Typography>
                    </Box>
                    <Chip
                      label="Análisis Comportamental"
                      sx={{
                        bgcolor: alpha('#8b5cf6', 0.1),
                        color: '#8b5cf6',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="category" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                          name="Miembros"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};
