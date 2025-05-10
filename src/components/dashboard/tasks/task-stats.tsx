import React from 'react';
import { Box, Typography, Stack, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  AccessTime as AccessTimeIcon,
  Pending as PendingIcon,
  RunCircle as RunCircleIcon,
  Assignment as AssignmentIcon,
  PriorityHigh as PriorityHighIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useTasks } from '@/hooks/use-tasks';
import { useDashboardTaskKpis } from '@/hooks/use-task-dashboard-kpi';
import KpiRefreshButton from '@/components/ui/kpi-refresh-button';
import { Task } from '@/types/tasks';

export const TaskStats: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const tasksResult = useTasks();
  const { tasks = [] as Task[], loading: tasksLoading = false } = typeof tasksResult === 'object' ? tasksResult : {};
  const { kpis, loading: kpisLoading, updateTaskKpis } = useDashboardTaskKpis();
  
  const isLoading = tasksLoading || kpisLoading;
  
  // Use KPIs if available, otherwise calculate from tasks
  const stats = {
    total: kpis ? (kpis.completed + kpis.pending + kpis.inProgress) : tasks.length,
    completed: kpis ? kpis.completed : tasks.filter(task => task.status === 'completada').length,
    pending: kpis ? kpis.pending : tasks.filter(task => task.status === 'pendiente').length,
    inProgress: kpis ? kpis.inProgress : tasks.filter(task => task.status === 'en_progreso').length,
    urgent: kpis ? kpis.urgent : tasks.filter(task => task.priority === 'alta').length,
    dueToday: kpis ? kpis.dueToday : 0,
    dueThisWeek: kpis ? kpis.dueThisWeek : 0,
    overdue: kpis ? kpis.overdue : 0
  };
  
  // Define the stat cards data with new styling
  const statCards = [
    { 
      title: 'Tareas Pendientes', 
      value: stats.pending, 
      icon: <PendingIcon />, 
      color: theme.palette.warning.main,
      delay: 0.1
    },
    { 
      title: 'En Progreso', 
      value: stats.inProgress, 
      icon: <RunCircleIcon />, 
      color: theme.palette.info.main,
      delay: 0.2
    },
    { 
      title: 'Completadas', 
      value: stats.completed, 
      icon: <CheckCircleOutlineIcon />, 
      color: theme.palette.success.main,
      delay: 0.3
    },
    { 
      title: 'Vencidas', 
      value: stats.overdue, 
      icon: <AccessTimeIcon />, 
      color: theme.palette.error.main,
      delay: 0.4
    }
  ];
  
  // Additional stat cards
  const additionalStatCards = [
    { 
      title: 'Total', 
      value: stats.total, 
      icon: <AssignmentIcon />, 
      color: theme.palette.primary.main,
      delay: 0.5
    },
    { 
      title: 'Urgentes', 
      value: stats.urgent, 
      icon: <PriorityHighIcon />, 
      color: theme.palette.error.dark,
      delay: 0.6
    },
    { 
      title: 'Para Hoy', 
      value: stats.dueToday, 
      icon: <TodayIcon />, 
      color: theme.palette.secondary.main,
      delay: 0.7
    },
    { 
      title: 'Esta Semana', 
      value: stats.dueThisWeek, 
      icon: <DateRangeIcon />, 
      color: theme.palette.info.dark,
      delay: 0.8
    }
  ];
  
  return (
    <Box
      sx={{
        mb: 4,
        position: 'relative',
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          px: 1
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 40,
              height: 3,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5
            }
          }}
        >
          Estadísticas de Tareas
        </Typography>
        <KpiRefreshButton
          onRefresh={async () => { await updateTaskKpis(); }}
          lastUpdated={kpis?.lastUpdated?.toDate()}
        />
      </Box>
      
      {/* Main Stats Cards */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ width: '100%', mb: 4 }}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay, duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Box
              sx={{
                width: '100%',
                borderRadius: '24px',
                p: 3,
                background: isDark
                  ? `linear-gradient(145deg, ${alpha(card.color, 0.1)}, ${alpha(card.color, 0.05)})`
                  : `linear-gradient(145deg, ${alpha(card.color, 0.05)}, ${alpha(card.color, 0.1)})`,
                border: `1px solid ${alpha(card.color, isDark ? 0.2 : 0.1)}`,
                boxShadow: `0 4px 20px ${alpha(card.color, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 25px ${alpha(card.color, 0.15)}`,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(card.color, 0.15),
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? card.color : theme.palette.text.primary,
                    }}
                  >
                    {isLoading ? '-' : card.value}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        ))}
      </Stack>
      
      {/* Additional Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {additionalStatCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay, duration: 0.5 }}
          >
            <Box
              sx={{
                borderRadius: '16px',
                p: 2,
                background: isDark
                  ? `linear-gradient(145deg, ${alpha(card.color, 0.08)}, ${alpha(card.color, 0.03)})`
                  : `linear-gradient(145deg, ${alpha(card.color, 0.03)}, ${alpha(card.color, 0.08)})`,
                border: `1px solid ${alpha(card.color, isDark ? 0.15 : 0.1)}`,
                boxShadow: `0 4px 12px ${alpha(card.color, 0.08)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 6px 15px ${alpha(card.color, 0.12)}`,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(card.color, 0.12),
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? card.color : theme.palette.text.primary,
                    }}
                  >
                    {isLoading ? '-' : card.value}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};