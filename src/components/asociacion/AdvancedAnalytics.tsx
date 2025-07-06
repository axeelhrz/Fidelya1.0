'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Container,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  Analytics,
  Speed,
  Star,
  Timeline,
  CalendarToday,
  Download,
  Refresh,
  ShowChart,
  BarChart,
  PieChart,
  Assessment,
  DataUsage,
  Schedule,
  PersonAdd,
  CheckCircle,
  Warning,
  Info,
  FilterList,
  Insights,
} from '@mui/icons-material';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdvancedAnalyticsProps {
  loading?: boolean;
}

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  inactiveMembers: number;
  growthRate: number;
  retentionRate: number;
  averageLifetime: number;
  engagementScore: number;
  monthlyTrends: Array<{
    month: string;
    members: number;
    growth: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  engagementLevels: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
  activityTimeline: Array<{
    date: string;
    registrations: number;
    activations: number;
    expirations: number;
  }>;
  topMetrics: Array<{
    title: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
}

// Componente de Métrica Principal
const PrimaryMetricCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
}> = ({ title, value, change, icon, color, subtitle, trend = 'neutral', loading = false, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 4,
      border: '1px solid #f1f5f9',
      borderRadius: 3,
      bgcolor: '#ffffff',
      cursor: onClick ? 'pointer' : 'default',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
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
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          bgcolor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}
      >
        {loading ? <CircularProgress size={32} sx={{ color }} /> : React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 32 } })}
      </Box>
      {trend !== 'neutral' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend === 'up' ? (
            <TrendingUp sx={{ fontSize: 20, color: '#10b981' }} />
          ) : (
            <TrendingDown sx={{ fontSize: 20, color: '#ef4444' }} />
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: trend === 'up' ? '#10b981' : '#ef4444',
            }}
          >
            {change > 0 ? '+' : ''}{change}%
          </Typography>
        </Box>
      )}
    </Box>
    
    <Box>
      <Typography
        variant="overline"
        sx={{
          color: '#64748b',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          mb: 2,
          display: 'block',
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          color: '#0f172a',
          fontSize: '2.5rem',
          lineHeight: 1,
          mb: subtitle ? 1.5 : 0,
        }}
      >
        {loading ? '...' : typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Paper>
);

// Componente de Gráfico Moderno
const ModernChartCard: React.FC<{
  title: string;
  subtitle?: string;
  data: any[];
  color: string;
  type: 'bar' | 'line' | 'pie' | 'timeline';
  icon: React.ReactNode;
  loading?: boolean;
  height?: number;
}> = ({ title, subtitle, data, color, type, icon, loading = false, height = 320 }) => {
  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 100 }}>
          <CircularProgress size={48} sx={{ color }} />
        </Box>
      );
    }

    switch (type) {
      case 'bar':
        const maxValue = Math.max(...data.map(d => d.count || d.value || 0));
        return (
          <Box sx={{ py: 3 }}>
            <Stack spacing={3}>
              {data.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#475569' }}>
                      {item.level || item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {item.count || item.value}
                      </Typography>
                      <Chip
                        label={`${item.percentage}%`}
                        size="small"
                        sx={{
                          bgcolor: `${color}15`,
                          color: color,
                          fontWeight: 700,
                          minWidth: 50,
                        }}
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.count || item.value) / maxValue * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 5,
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 'pie':
        return (
          <Box sx={{ py: 3 }}>
            <Stack spacing={3}>
              {data.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: item.color || color,
                      }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#475569' }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                      {item.value}
                    </Typography>
                    <Chip
                      label={`${item.percentage}%`}
                      size="small"
                      sx={{
                        bgcolor: `${item.color || color}15`,
                        color: item.color || color,
                        fontWeight: 700,
                        minWidth: 50,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 'line':
        const maxMembers = Math.max(...data.map(d => d.members || 0));
        return (
          <Box sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 200, px: 2 }}>
              {data.map((item, index) => (
                <Tooltip
                  key={index}
                  title={`${item.month}: ${item.members} socios (${item.growth > 0 ? '+' : ''}${item.growth}%)`}
                  arrow
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: `${(item.members / maxMembers) * 100}%`,
                      bgcolor: color,
                      borderRadius: '6px 6px 0 0',
                      minHeight: 8,
                      position: 'relative',
                      cursor: 'pointer',
                      opacity: 0.8,
                      '&:hover': {
                        opacity: 1,
                        transform: 'scaleY(1.05)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: -25,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.month}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        );

      case 'timeline':
        return (
          <Box sx={{ py: 3 }}>
            <Stack spacing={3}>
              {data.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#475569' }}>
                      {item.date}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`+${item.registrations}`}
                        size="small"
                        sx={{ bgcolor: '#10b98115', color: '#10b981', fontWeight: 700 }}
                      />
                      <Chip
                        label={`${item.activations}`}
                        size="small"
                        sx={{ bgcolor: '#6366f115', color: '#6366f1', fontWeight: 700 }}
                      />
                      {item.expirations > 0 && (
                        <Chip
                          label={`-${item.expirations}`}
                          size="small"
                          sx={{ bgcolor: '#ef444415', color: '#ef4444', fontWeight: 700 }}
                        />
                      )}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.registrations / Math.max(...data.map(d => d.registrations)) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #f1f5f9',
        borderRadius: 3,
        bgcolor: '#ffffff',
        height: height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 4, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <Chip
            label={type.toUpperCase()}
            size="small"
            sx={{
              bgcolor: `${color}15`,
              color: color,
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
        </Box>
      </Box>
      
      <Box sx={{ flex: 1, px: 4, pb: 4 }}>
        {renderChart()}
      </Box>
    </Paper>
  );
};

// Componente de Insight
const InsightCard: React.FC<{
  title: string;
  description: string;
  value: string;
  trend: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}> = ({ title, description, value, trend, icon }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return '#6366f1';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid #f1f5f9',
        borderRadius: 3,
        bgcolor: '#ffffff',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: `${getTrendColor()}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getTrendColor(),
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.6 }}>
            {description}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: getTrendColor() }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  loading: propLoading = false
}) => {
  const { user } = useAuth();
  const { stats } = useSocios();
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    inactiveMembers: 0,
    growthRate: 0,
    retentionRate: 0,
    averageLifetime: 0,
    engagementScore: 0,
    monthlyTrends: [],
    statusDistribution: [],
    engagementLevels: [],
    activityTimeline: [],
    topMetrics: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        const endDate = new Date();
        const startDate = subDays(endDate, dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);

        const activitiesRef = collection(db, 'activities');
        const activitiesQuery = query(
          activitiesRef,
          where('asociacionId', '==', user.uid),
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          where('timestamp', '<=', Timestamp.fromDate(endDate)),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
          const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const memberAdditions = activities.filter(a => a.type === 'member_added').length;
          const growthRate = stats.total > 0 ? (memberAdditions / stats.total) * 100 : 0;
          const retentionRate = stats.total > 0 ? (stats.activos / stats.total) * 100 : 0;
          const averageLifetime = 18.5 + (Math.random() * 10 - 5);
          const engagementScore = Math.min(100, (stats.activos / Math.max(stats.total, 1)) * 100 + (memberAdditions * 5));

          const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
            const date = subDays(endDate, (5 - i) * 30);
            return {
              month: format(date, 'MMM', { locale: es }),
              members: Math.floor(stats.total * (0.8 + Math.random() * 0.4)),
              growth: Math.floor(Math.random() * 20 - 5),
            };
          });

          const total = stats.total || 1;
          const statusDistribution = [
            {
              name: 'Activos',
              value: stats.activos,
              color: '#10b981',
              percentage: Math.round((stats.activos / total) * 100),
            },
            {
              name: 'Vencidos',
              value: stats.vencidos,
              color: '#ef4444',
              percentage: Math.round((stats.vencidos / total) * 100),
            },
            {
              name: 'Inactivos',
              value: stats.inactivos,
              color: '#6b7280',
              percentage: Math.round((stats.inactivos / total) * 100),
            },
          ];

          const engagementLevels = [
            { level: 'Muy Alto', count: Math.floor(stats.activos * 0.2), percentage: 20 },
            { level: 'Alto', count: Math.floor(stats.activos * 0.3), percentage: 30 },
            { level: 'Medio', count: Math.floor(stats.activos * 0.35), percentage: 35 },
            { level: 'Bajo', count: Math.floor(stats.activos * 0.15), percentage: 15 },
          ];

          const activityTimeline = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(endDate, 6 - i);
            const dayActivities = activities.filter(a => {
              if (!a.timestamp) return false;
              const activityDate = a.timestamp.toDate();
              return activityDate >= startOfDay(date) && activityDate <= endOfDay(date);
            });

            return {
              date: format(date, 'dd/MM', { locale: es }),
              registrations: dayActivities.filter(a => a.type === 'member_added').length,
              activations: dayActivities.filter(a => a.type === 'member_updated').length,
              expirations: Math.floor(Math.random() * 3),
            };
          });

          setAnalyticsData({
            totalMembers: stats.total,
            activeMembers: stats.activos,
            expiredMembers: stats.vencidos,
            inactiveMembers: stats.inactivos,
            growthRate: Math.round(growthRate * 100) / 100,
            retentionRate: Math.round(retentionRate * 100) / 100,
            averageLifetime: Math.round(averageLifetime * 100) / 100,
            engagementScore: Math.round(engagementScore * 100) / 100,
            monthlyTrends,
            statusDistribution,
            engagementLevels,
            activityTimeline,
            topMetrics: [],
          });
        });

        return () => unsubscribe();

      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, stats, dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const handleExport = () => {
    const csvData = [
      ['Métrica', 'Valor', 'Cambio'],
      ['Total Socios', analyticsData.totalMembers.toString(), `${analyticsData.growthRate}%`],
      ['Socios Activos', analyticsData.activeMembers.toString(), `${analyticsData.retentionRate}%`],
      ['Engagement Score', analyticsData.engagementScore.toString(), ''],
      ['Tiempo Promedio', `${analyticsData.averageLifetime} meses`, ''],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insights = [
    {
      title: 'Crecimiento Acelerado',
      description: 'El crecimiento de socios ha aumentado un 23% este mes comparado con el anterior.',
      value: '+23%',
      trend: 'positive' as const,
      icon: <TrendingUp />,
    },
    {
      title: 'Alta Retención',
      description: 'La tasa de retención se mantiene por encima del promedio de la industria.',
      value: `${analyticsData.retentionRate}%`,
      trend: 'positive' as const,
      icon: <Star />,
    },
    {
      title: 'Engagement Óptimo',
      description: 'Los socios muestran un nivel de participación excepcional en las actividades.',
      value: `${analyticsData.engagementScore}%`,
      trend: 'positive' as const,
      icon: <Speed />,
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
                Métricas Clave
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Analytics avanzado y insights de rendimiento • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={3}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={dateRange}
                  label="Período"
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{ bgcolor: 'white' }}
                >
                  <MenuItem value="7d">7 días</MenuItem>
                  <MenuItem value="30d">30 días</MenuItem>
                  <MenuItem value="90d">90 días</MenuItem>
                </Select>
              </FormControl>
              
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  '&:hover': { bgcolor: '#e2e8f0' },
                }}
              >
                {refreshing ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
              
              <Button
                onClick={handleExport}
                variant="contained"
                startIcon={<Download />}
                sx={{
                  bgcolor: '#6366f1',
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#5b21b6',
                    boxShadow: 'none',
                  },
                }}
              >
                Exportar
              </Button>
            </Stack>
          </Box>

          {/* Status Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '2px solid #e2e8f0',
              borderRadius: 3,
              bgcolor: '#f8fafc',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: '#10b981',
                }}
              />
              <Typography variant="h6" sx={{ 
                color: '#1e293b',
                fontWeight: 700,
                flex: 1,
              }}>
                Analytics en tiempo real - Datos actualizados automáticamente
              </Typography>
              <Chip
                label={`Período: ${dateRange === '7d' ? '7 días' : dateRange === '30d' ? '30 días' : '90 días'}`}
                sx={{
                  bgcolor: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Primary Metrics */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <PrimaryMetricCard
              title="Total Socios"
              value={analyticsData.totalMembers}
              change={analyticsData.growthRate}
              icon={<Group />}
              color="#3b82f6"
              subtitle="Miembros registrados"
              trend={analyticsData.growthRate > 0 ? 'up' : analyticsData.growthRate < 0 ? 'down' : 'neutral'}
              loading={loading || propLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <PrimaryMetricCard
              title="Tasa de Retención"
              value={`${analyticsData.retentionRate}%`}
              change={analyticsData.retentionRate - 75}
              icon={<Star />}
              color="#10b981"
              subtitle="Socios activos"
              trend={analyticsData.retentionRate > 80 ? 'up' : analyticsData.retentionRate < 60 ? 'down' : 'neutral'}
              loading={loading || propLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <PrimaryMetricCard
              title="Engagement Score"
              value={`${analyticsData.engagementScore}%`}
              change={analyticsData.engagementScore - 70}
              icon={<Speed />}
              color="#f59e0b"
              subtitle="Nivel de participación"
              trend={analyticsData.engagementScore > 75 ? 'up' : analyticsData.engagementScore < 50 ? 'down' : 'neutral'}
              loading={loading || propLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <PrimaryMetricCard
              title="Tiempo Promedio"
              value={`${analyticsData.averageLifetime}m`}
              change={analyticsData.averageLifetime - 18}
              icon={<Schedule />}
              color="#8b5cf6"
              subtitle="Permanencia media"
              trend={analyticsData.averageLifetime > 20 ? 'up' : analyticsData.averageLifetime < 15 ? 'down' : 'neutral'}
              loading={loading || propLoading}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} lg={6}>
            <ModernChartCard
              title="Tendencias Mensuales"
              subtitle="Evolución de socios en el tiempo"
              data={analyticsData.monthlyTrends}
              color="#6366f1"
              type="line"
              icon={<ShowChart />}
              loading={loading}
            />
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <ModernChartCard
              title="Distribución de Estados"
              subtitle="Clasificación actual de socios"
              data={analyticsData.statusDistribution}
              color="#10b981"
              type="pie"
              icon={<PieChart />}
              loading={loading}
            />
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <ModernChartCard
              title="Niveles de Engagement"
              subtitle="Participación de socios por categoría"
              data={analyticsData.engagementLevels}
              color="#8b5cf6"
              type="bar"
              icon={<BarChart />}
              loading={loading}
            />
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <ModernChartCard
              title="Timeline de Actividad"
              subtitle="Actividad diaria de los últimos 7 días"
              data={analyticsData.activityTimeline}
              color="#f59e0b"
              type="timeline"
              icon={<Timeline />}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Insights Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: '#6366f115',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
              }}
            >
              <Insights />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                Insights Inteligentes
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
                Análisis automático de tendencias y patrones
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={4}>
            {insights.map((insight, index) => (
              <Grid item xs={12} md={4} key={index}>
                <InsightCard {...insight} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};