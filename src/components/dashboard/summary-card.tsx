'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  Stack,
  Typography,
  useTheme,
  alpha,
  Skeleton,
  Tooltip,
  Paper,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  People,
  Assignment,
  Policy,
  AttachMoney,
  Loyalty,
  BarChart,
  CalendarToday,
  Speed,
  Category,
  Group,
  ExpandMore,
  ExpandLess,
  Info as InfoIcon,
  TaskAlt,
  PendingActions,
  Schedule,
  PriorityHigh,
  Today,
  DateRange
} from '@mui/icons-material';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { DashboardKPIs } from '@/lib/generate-kpis';
import KpiLastUpdated from './kpi-last-updater';
import { useKpiUpdater } from '@/hooks/use-kpi-updater';
import { TaskKPIs } from '@/hooks/use-task-dashboard-kpi';

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.03,
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
      delay: 0.2
    }
  }
};

const valueVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.1
    }
  }
};

const SummaryCards = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { updateKpis } = useKpiUpdater();
  const [metrics, setMetrics] = useState<DashboardKPIs | null>(null);
  const [taskMetrics, setTaskMetrics] = useState<TaskKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdditionalMetrics, setShowAdditionalMetrics] = useState(true);
  const [showTaskMetrics, setShowTaskMetrics] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to the general KPIs document
    const unsubscribeKpis = onSnapshot(
      doc(db, `users/${user.uid}/dashboard/kpis`),
      (docSnap) => {
        if (docSnap.exists()) {
          setMetrics(docSnap.data() as DashboardKPIs);
        } else {
          // If the document doesn't exist, set default values
          setMetrics({
            totalPolicies: 0,
            totalClients: 0,
            completedTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            urgentTasks: 0,
            dueTodayTasks: 0,
            dueThisWeekTasks: 0,
            overdueTasks: 0,
            totalPremiums: 0,
            retentionRate: 0,
            monthlyChanges: {
              policies: 0,
              clients: 0,
              tasks: 0,
              premiums: 0,
              retention: 0,
              completedTasks: 0,
              pendingTasks: 0,
              overdueTasks: 0
            },
            lastUpdated: null as unknown as import('firebase/firestore').Timestamp,
            averagePremium: 0,
            topPolicyType: 'ninguno',
            clientsWithMultiplePolicies: 0,
            upcomingRenewals: 0,
            revenueByMonth: {}
          });
          // Try to generate KPIs if they don't exist
          updateKpis().catch(err => console.error('Error generating initial KPIs:', err));
        }
      },
      (err) => {
        console.error('Error in KPIs subscription:', err);
        setError('Error updating real-time data');
      }
    );

    // Subscribe to the task KPIs document
    const unsubscribeTaskKpis = onSnapshot(
      doc(db, `users/${user.uid}/dashboard/taskKpis`),
      (docSnap) => {
        if (docSnap.exists()) {
          setTaskMetrics(docSnap.data() as TaskKPIs);
        } else {
          // If the document doesn't exist, set default values for task KPIs
          setTaskMetrics({
            total: 0,
            completed: 0,
            pending: 0,
            inProgress: 0,
            urgent: 0,
            dueToday: 0,
            dueThisWeek: 0,
            overdue: 0,
            tasksByPriority: { alta: 0, media: 0, baja: 0 },
            tasksByStatus: { pendiente: 0, en_progreso: 0, completada: 0 },
            tasksByRecurrence: { ninguna: 0, diaria: 0, semanal: 0, mensual: 0 },
            tasksCreatedThisMonth: 0,
            tasksCompletedThisMonth: 0,
            averageCompletionTime: 0,
            monthlyChanges: {
              tasks: 0,
              completed: 0,
              pending: 0,
              overdue: 0
            },
            lastUpdated: null as unknown as import('firebase/firestore').Timestamp
          });
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Error in Task KPIs subscription:', err);
        setError('Error updating real-time task data');
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribeKpis();
      unsubscribeTaskKpis();
    };
  }, [user?.uid, updateKpis]);

  // Function to get trend icon based on value
  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp fontSize="small" />;
    } else if (change < 0) {
      return <TrendingDown fontSize="small" />;
    } else {
      return <TrendingFlat fontSize="small" />;
    }
  };

  // KPI cards definition with memoization to avoid unnecessary recalculations
  const kpiCards = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        title: 'Pólizas Activas',
        value: metrics.totalPolicies,
        formattedValue: formatNumber(metrics.totalPolicies),
        change: metrics.monthlyChanges.policies,
        icon: <Policy />,
        color: theme.palette.primary.main,
        tooltip: 'Número total de pólizas activas en tu cartera',
        description: 'Total de pólizas vigentes no canceladas ni vencidas'
      },
      {
        title: 'Clientes',
        value: metrics.totalClients,
        formattedValue: formatNumber(metrics.totalClients),
        change: metrics.monthlyChanges.clients,
        icon: <People />,
        color: theme.palette.info.main,
        tooltip: 'Número total de clientes activos',
        description: 'Clientes con al menos una póliza activa'
      },
      {
        title: 'Tareas Completadas',
        value: metrics.completedTasks,
        formattedValue: formatNumber(metrics.completedTasks),
        change: metrics.monthlyChanges.completedTasks,
        icon: <TaskAlt />,
        color: theme.palette.success.main,
        tooltip: 'Número total de tareas completadas',
        description: 'Tareas marcadas como completadas'
      },
      {
        title: 'Primas Aseguradas',
        value: metrics.totalPremiums,
        formattedValue: formatCurrency(metrics.totalPremiums),
        change: metrics.monthlyChanges.premiums,
        icon: <AttachMoney />,
        color: theme.palette.success.dark,
        tooltip: 'Valor total de las primas de todas tus pólizas activas',
        description: 'Suma de todas las primas anuales de pólizas activas'
      },
      {
        title: 'Retención',
        value: metrics.retentionRate,
        formattedValue: `${metrics.retentionRate}%`,
        change: metrics.monthlyChanges.retention,
        icon: <Loyalty />,
        color: theme.palette.error.main,
        tooltip: 'Porcentaje de clientes que renuevan sus pólizas',
        description: 'Tasa de renovación de pólizas en los últimos 12 meses'
      },
      {
        title: 'Crecimiento',
        value: metrics.monthlyChanges.clients,
        formattedValue: `${metrics.monthlyChanges.clients > 0 ? '+' : ''}${metrics.monthlyChanges.clients}%`,
        change: metrics.monthlyChanges.clients,
        icon: <BarChart />,
        color: theme.palette.secondary.main,
        tooltip: 'Porcentaje de crecimiento de clientes este mes',
        description: 'Incremento de clientes respecto al mes anterior'
      }
    ];
  }, [metrics, theme.palette]);

  // Task KPI cards
  const taskKpiCards = useMemo(() => {
    if (!taskMetrics) return [];
    return [
      {
        title: 'Tareas Pendientes',
        value: taskMetrics.pending,
        formattedValue: formatNumber(taskMetrics.pending),
        change: taskMetrics.monthlyChanges.pending,
        icon: <PendingActions />,
        color: theme.palette.warning.main,
        tooltip: 'Número total de tareas pendientes',
        description: 'Tareas que aún no han sido completadas'
      },
      {
        title: 'Tareas En Progreso',
        value: taskMetrics.inProgress,
        formattedValue: formatNumber(taskMetrics.inProgress),
        change: 0, // No monthly change for in progress tasks
        icon: <Assignment />,
        color: theme.palette.info.main,
        tooltip: 'Número total de tareas en progreso',
        description: 'Tareas que están siendo trabajadas actualmente'
      },
      {
        title: 'Tareas Urgentes',
        value: taskMetrics.urgent,
        formattedValue: formatNumber(taskMetrics.urgent),
        change: 0, // No monthly change for urgent tasks
        icon: <PriorityHigh />,
        color: theme.palette.error.main,
        tooltip: 'Número total de tareas marcadas como urgentes',
        description: 'Tareas con prioridad alta que requieren atención inmediata'
      },
      {
        title: 'Tareas Para Hoy',
        value: taskMetrics.dueToday,
        formattedValue: formatNumber(taskMetrics.dueToday),
        change: 0, // No monthly change for due today tasks
        icon: <Today />,
        color: theme.palette.secondary.main,
        tooltip: 'Tareas que vencen hoy',
        description: 'Tareas que deben completarse hoy'
      },
      {
        title: 'Tareas Esta Semana',
        value: taskMetrics.dueThisWeek,
        formattedValue: formatNumber(taskMetrics.dueThisWeek),
        change: 0, // No monthly change for due this week tasks
        icon: <DateRange />,
        color: theme.palette.info.dark,
        tooltip: 'Tareas que vencen esta semana',
        description: 'Tareas que deben completarse en los próximos 7 días'
      },
      {
        title: 'Tareas Atrasadas',
        value: taskMetrics.overdue,
        formattedValue: formatNumber(taskMetrics.overdue),
        change: taskMetrics.monthlyChanges.overdue,
        icon: <Schedule />,
        color: theme.palette.error.dark,
        tooltip: 'Tareas que ya han vencido',
        description: 'Tareas cuya fecha de vencimiento ya ha pasado'
      }
    ];
  }, [taskMetrics, theme.palette]);

  // Additional metrics
  const additionalMetrics = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        title: 'Prima Promedio',
        value: formatCurrency(metrics.averagePremium),
        icon: <Speed />,
        color: theme.palette.info.light,
        tooltip: 'Valor promedio de las primas de tus pólizas activas'
      },
      {
        title: 'Tipo Principal',
        value: metrics.topPolicyType,
        icon: <Category />,
        color: theme.palette.warning.light,
        tooltip: 'Tipo de póliza más común en tu cartera'
      },
      {
        title: 'Clientes Multi-Póliza',
        value: formatNumber(metrics.clientsWithMultiplePolicies),
        icon: <Group />,
        color: theme.palette.success.light,
        tooltip: 'Clientes con más de una póliza activa'
      },
      {
        title: 'Renovaciones Próximas',
        value: formatNumber(metrics.upcomingRenewals),
        icon: <CalendarToday />,
        color: theme.palette.error.light,
        tooltip: 'Pólizas que vencen en los próximos 30 días'
      }
    ];
  }, [metrics, theme.palette]);

  // Additional task metrics
  const additionalTaskMetrics = useMemo(() => {
    if (!taskMetrics) return [];
    return [
      {
        title: 'Creadas Este Mes',
        value: formatNumber(taskMetrics.tasksCreatedThisMonth),
        icon: <Assignment />,
        color: theme.palette.primary.light,
        tooltip: 'Número de tareas creadas en el mes actual'
      },
      {
        title: 'Completadas Este Mes',
        value: formatNumber(taskMetrics.tasksCompletedThisMonth),
        icon: <TaskAlt />,
        color: theme.palette.success.light,
        tooltip: 'Número de tareas completadas en el mes actual'
      },
      {
        title: 'Tiempo Promedio',
        value: `${Math.round(taskMetrics.averageCompletionTime)} h`,
        icon: <Schedule />,
        color: theme.palette.info.light,
        tooltip: 'Tiempo promedio para completar una tarea (en horas)'
      },
      {
        title: 'Tareas Recurrentes',
        value: formatNumber(
          taskMetrics.tasksByRecurrence.diaria +
          taskMetrics.tasksByRecurrence.semanal +
          taskMetrics.tasksByRecurrence.mensual
        ),
        icon: <DateRange />,
        color: theme.palette.warning.light,
        tooltip: 'Número de tareas con recurrencia configurada'
      }
    ];
  }, [taskMetrics, theme.palette]);

  // Render error message if there is one
  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Stack
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        direction="column"
        spacing={3}
      >
        {/* Main KPIs */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2, px: 1 }}
          >
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Indicadores Clave
            </Typography>
            {!isLoading && metrics && (
              <KpiLastUpdated
                kpis={metrics}
                variant="chip"
                animate={true}
              />
            )}
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(6, 1fr)'
              },
              gap: 2
            }}
          >
            <AnimatePresence>
              {kpiCards.map((card, index) => (
                <Tooltip
                  key={index}
                  title={card.tooltip}
                  arrow
                  placement="top"
                >
                  <Card
                    component={motion.div}
                    variants={cardVariants}
                    whileHover="hover"
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(card.color, theme.palette.mode === 'dark' ? 0.15 : 0.05)}, ${alpha(card.color, theme.palette.mode === 'dark' ? 0.05 : 0.02)})`,
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${alpha(card.color, 0.1)}`,
                      boxShadow: `0 4px 20px ${alpha(card.color, 0.1)}`,
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle2" fontFamily="Sora" fontWeight={600}>
                        {card.title}
                      </Typography>
                      <Box
                        component={motion.div}
                        variants={iconVariants}
                        sx={{
                          p: 1,
                          borderRadius: '50%',
                          backgroundColor: alpha(card.color, 0.1),
                          color: card.color
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Stack>
                    {isLoading ? (
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={40}
                        sx={{
                          bgcolor: alpha(card.color, 0.1),
                          borderRadius: 1
                        }}
                      />
                    ) : (
                      <Typography
                        component={motion.h4}
                        variants={valueVariants}
                        variant="h4"
                        fontFamily="Sora"
                        fontWeight={700}
                        mb={1}
                      >
                        {card.formattedValue}
                      </Typography>
                    )}
                    <Box sx={{ mt: 'auto' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          component={motion.div}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: card.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                            backgroundColor: alpha(
                              card.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                              0.1
                            ),
                            borderRadius: 1,
                            px: 1,
                            py: 0.5
                          }}
                        >
                          {getTrendIcon(card.change)}
                          {card.change >= 0 ? '+' : ''}{card.change}%
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          vs mes anterior
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          mt: 1,
                          opacity: 0.8
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                  </Card>
                </Tooltip>
              ))}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Task KPIs */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={600}>
                Estadísticas de Tareas
              </Typography>
              <Tooltip title="Métricas detalladas sobre tus tareas" arrow>
                <InfoIcon fontSize="small" color="action" sx={{ opacity: 0.6 }} />
              </Tooltip>
            </Stack>
            <IconButton
              onClick={() => setShowTaskMetrics(!showTaskMetrics)}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              {showTaskMetrics ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Collapse in={showTaskMetrics}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(6, 1fr)'
                },
                gap: 2,
                mb: 3
              }}
            >
              {taskKpiCards.map((card, index) => (
                <Tooltip
                  key={index}
                  title={card.tooltip}
                  arrow
                  placement="top"
                >
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{
                      y: -5,
                      boxShadow: `0 8px 20px ${alpha(card.color, 0.2)}`
                    }}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(card.color, theme.palette.mode === 'dark' ? 0.1 : 0.03)}, ${alpha(card.color, theme.palette.mode === 'dark' ? 0.05 : 0.01)})`,
                      border: `1px solid ${alpha(card.color, 0.1)}`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight={600}>
                        {card.title}
                      </Typography>
                      <Box
                        sx={{
                          p: 0.8,
                          borderRadius: '50%',
                          backgroundColor: alpha(card.color, 0.1),
                          color: card.color
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Stack>
                    {isLoading ? (
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={32}
                        sx={{
                          bgcolor: alpha(card.color, 0.1),
                          borderRadius: 1
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        mb={1}
                      >
                        {card.formattedValue}
                      </Typography>
                    )}
                    {card.change !== 0 && (
                      <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: card.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                              backgroundColor: alpha(
                                card.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                0.1
                              ),
                              borderRadius: 1,
                              px: 1,
                              py: 0.5
                            }}
                          >
                            {getTrendIcon(card.change)}
                            {card.change >= 0 ? '+' : ''}{card.change}
                          </Box>
                        </Stack>
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mt: 1,
                        opacity: 0.8
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Card>
                </Tooltip>
              ))}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 3
              }}
            >
              {additionalTaskMetrics.map((metric, index) => (
                <Tooltip key={index} title={metric.tooltip} arrow placement="top">
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(metric.color, theme.palette.mode === 'dark' ? 0.1 : 0.05),
                      border: `1px solid ${alpha(metric.color, 0.1)}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 6px 16px ${alpha(metric.color, 0.15)}`
                      }
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        backgroundColor: alpha(metric.color, 0.2),
                        color: metric.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      {isLoading ? (
                        <Skeleton width={60} height={28} />
                      ) : (
                        <Typography variant="h6" fontWeight={600}>
                          {metric.value}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Collapse>
        </Paper>

        {/* Additional Metrics */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={600}>
                Métricas Adicionales
              </Typography>
              <Tooltip title="Información complementaria sobre tu cartera de seguros" arrow>
                <InfoIcon fontSize="small" color="action" sx={{ opacity: 0.6 }} />
              </Tooltip>
            </Stack>
            <IconButton
              onClick={() => setShowAdditionalMetrics(!showAdditionalMetrics)}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              {showAdditionalMetrics ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Collapse in={showAdditionalMetrics}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 3
              }}
            >
              {additionalMetrics.map((metric, index) => (
                <Tooltip key={index} title={metric.tooltip} arrow placement="top">
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(metric.color, theme.palette.mode === 'dark' ? 0.1 : 0.05),
                      border: `1px solid ${alpha(metric.color, 0.1)}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 6px 16px ${alpha(metric.color, 0.15)}`
                      }
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        backgroundColor: alpha(metric.color, 0.2),
                        color: metric.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      {isLoading ? (
                        <Skeleton width={60} height={28} />
                      ) : (
                        <Typography variant="h6" fontWeight={600}>
                          {metric.value}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Collapse>
        </Paper>
      </Stack>
    </Box>
  );
};

export default SummaryCards;