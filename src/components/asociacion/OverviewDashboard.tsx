'use client';

import React from 'react';
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
} from '@mui/icons-material';
import { Socio, SocioStats } from '@/types/socio';

interface OverviewDashboardProps {
  socios: Socio[];
  stats: SocioStats;
  loading: boolean;
  onNavigate: (section: string) => void;
  onAddMember: () => void;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  delay,
  subtitle,
  trend = 'neutral',
  onClick
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
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #f1f5f9',
          borderRadius: 6,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: onClick ? 'translateY(-8px)' : 'translateY(-4px)',
            boxShadow: `0 25px 80px -15px ${alpha(color, 0.25)}`,
            '& .kpi-icon': {
              transform: 'scale(1.15) rotate(5deg)',
              bgcolor: alpha(color, 0.2),
            },
            '& .kpi-glow': {
              opacity: 0.8,
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
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)}, ${color})`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Avatar
              className="kpi-icon"
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
          {onClick && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                sx={{
                  color: color,
                  bgcolor: alpha(color, 0.1),
                  '&:hover': {
                    bgcolor: alpha(color, 0.2),
                  }
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

const QuickStatsCard: React.FC<{
  title: string;
  stats: Array<{ label: string; value: number; color: string }>;
  icon: React.ReactNode;
  color: string;
  delay: number;
  onViewMore?: () => void;
}> = ({ title, stats, icon, color, delay, onViewMore }) => {
  const maxValue = Math.max(...stats.map(s => s.value));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha(color, 0.1),
                  color: color,
                  borderRadius: 3,
                }}
              >
                {icon}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Distribución actual
                </Typography>
              </Box>
            </Box>
            {onViewMore && (
              <Button
                onClick={onViewMore}
                size="small"
                endIcon={<ArrowForward />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: color,
                }}
              >
                Ver más
              </Button>
            )}
          </Box>
          <Stack spacing={3}>
            {stats.map((stat, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: stat.color,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {stat.value}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(stat.value / maxValue) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(stat.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: stat.color,
                      borderRadius: 3,
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RecentActivityCard: React.FC<{
  activities: Array<{
    id: string;
    title: string;
    time: string;
    type: 'success' | 'warning' | 'info' | 'error';
    icon: React.ReactNode;
  }>;
  onViewAll?: () => void;
}> = ({ activities, onViewAll }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      info: '#6366f1',
      error: '#ef4444',
    };
    return colors[type as keyof typeof colors] || '#6366f1';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
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
                  Últimas acciones
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
          <Stack spacing={3}>
            {activities.slice(0, 5).map((activity) => (
              <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha(getTypeColor(activity.type), 0.1),
                    color: getTypeColor(activity.type),
                    borderRadius: 2,
                  }}
                >
                  {activity.icon}
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
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      fontWeight: 500
                    }}
                  >
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  loading,
  onNavigate,
  onAddMember
}) => {
  const growthRate = 12.5; // Mock growth rate
  const retentionRate = 87.3; // Mock retention rate

  const kpiMetrics = [
    {
      title: 'Total de Miembros',
      value: stats.total.toLocaleString(),
      change: growthRate,
      icon: <Group sx={{ fontSize: 32 }} />,
      color: '#6366f1',
      delay: 0,
      subtitle: 'Crecimiento mensual',
      trend: 'up' as const,
      onClick: () => onNavigate('all-members')
    },
    {
      title: 'Miembros Activos',
      value: stats.activos.toLocaleString(),
      change: 5.2,
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      color: '#10b981',
      delay: 0.1,
      subtitle: 'Estado actual',
      trend: 'up' as const,
      onClick: () => onNavigate('active-members')
    },
    {
      title: 'Tasa de Retención',
      value: `${retentionRate}%`,
      change: -2.1,
      icon: <Star sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      delay: 0.2,
      subtitle: 'Últimos 12 meses',
      trend: 'down' as const,
      onClick: () => onNavigate('analytics')
    },
    {
      title: 'Miembros Vencidos',
      value: stats.vencidos.toLocaleString(),
      change: -8.7,
      icon: <Warning sx={{ fontSize: 32 }} />,
      color: '#ef4444',
      delay: 0.3,
      subtitle: 'Requieren atención',
      trend: 'down' as const,
      onClick: () => onNavigate('expired-members')
    }
  ];

  const memberStats = [
    { label: 'Activos', value: stats.activos, color: '#10b981' },
    { label: 'Vencidos', value: stats.vencidos, color: '#ef4444' },
    { label: 'Inactivos', value: stats.inactivos, color: '#6b7280' },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Nuevo miembro registrado',
      time: 'Hace 5 minutos',
      type: 'success' as const,
      icon: <PersonAdd sx={{ fontSize: 20 }} />
    },
    {
      id: '2',
      title: 'Importación CSV completada',
      time: 'Hace 15 minutos',
      type: 'info' as const,
      icon: <Assessment sx={{ fontSize: 20 }} />
    },
    {
      id: '3',
      title: 'Miembro actualizado',
      time: 'Hace 30 minutos',
      type: 'info' as const,
      icon: <Info sx={{ fontSize: 20 }} />
    },
    {
      id: '4',
      title: 'Alerta: Membresías vencidas',
      time: 'Hace 1 hora',
      type: 'warning' as const,
      icon: <Warning sx={{ fontSize: 20 }} />
    },
    {
      id: '5',
      title: 'Reporte generado',
      time: 'Hace 2 horas',
      type: 'success' as const,
      icon: <BarChart sx={{ fontSize: 20 }} />
    }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        {/* Loading skeleton using CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 4
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
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
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
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
                    fontSize: '2.5rem',
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
                    fontSize: '1.2rem',
                  }}
                >
                  Resumen ejecutivo de la asociación
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
                  borderRadius: 4,
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
          {/* Welcome Message */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#6366f1', 0.05),
              border: `2px solid ${alpha('#6366f1', 0.15)}`,
              borderRadius: 5,
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
              }
            }}
          >
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
              <Typography variant="body1" sx={{ color: '#475569', fontWeight: 700, fontSize: '1.1rem' }}>
                <Box component="span" sx={{ fontWeight: 900 }}>Sistema operativo</Box> - Todos los servicios funcionando correctamente
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ fontSize: 18, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* KPI Cards using CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 4,
          mb: 6
        }}
      >
        {kpiMetrics.map((metric, index) => (
          <KPICard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
            delay={metric.delay}
            subtitle={metric.subtitle}
            trend={metric.trend}
            onClick={metric.onClick}
          />
        ))}
      </Box>

      {/* Secondary Stats and Activity using CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 2fr'
          },
          gap: 6
        }}
      >
        {/* Member Distribution */}
        <QuickStatsCard
          title="Distribución de Miembros"
          stats={memberStats}
          icon={<PieChart />}
          color="#6366f1"
          delay={0.4}
          onViewMore={() => onNavigate('members')}
        />

        {/* Recent Activity */}
        <RecentActivityCard
          activities={recentActivities}
          onViewAll={() => onNavigate('communications')}
        />
      </Box>
    </Box>
  );
};