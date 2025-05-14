import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  alpha,
  Divider,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Task } from '../../../types/tasks';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

interface TaskAnalyticsDialogProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

export const TaskAnalyticsDialog: React.FC<TaskAnalyticsDialogProps> = ({
  open,
  onClose,
  tasks,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Datos para el gráfico de prioridades
  const priorityData = [
    {
      name: 'Alta',
      value: tasks.filter((task) => task.priority === 'alta').length,
      color: theme.palette.error.main,
    },
    {
      name: 'Media',
      value: tasks.filter((task) => task.priority === 'media').length,
      color: theme.palette.warning.main,
    },
    {
      name: 'Baja',
      value: tasks.filter((task) => task.priority === 'baja').length,
      color: theme.palette.success.main,
    },
  ];

  // Datos para el gráfico de estados
  const statusData = [
    {
      name: 'Pendiente',
      value: tasks.filter((task) => task.status === 'pendiente').length,
      color: theme.palette.info.main,
    },
    {
      name: 'En Progreso',
      value: tasks.filter((task) => task.status === 'en_progreso').length,
      color: theme.palette.warning.main,
    },
    {
      name: 'Completada',
      value: tasks.filter((task) => task.status === 'completada').length,
      color: theme.palette.success.main,
    },
  ];

  // Datos para el gráfico de tareas por día de la semana
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const tasksByDay = daysOfWeek.map((day, index) => ({
    name: day,
    tareas: tasks.filter((task) => {
      if (!task.dueDate) return false;
      let date: Date;
      if ('toDate' in task.dueDate && typeof task.dueDate.toDate === 'function') {
        date = task.dueDate.toDate();
      } else if (task.dueDate instanceof Date) {
        date = task.dueDate;
      } else {
        // Handle Timestamp by assuming it has a toDate method
        date = (task.dueDate as unknown as { toDate(): Date }).toDate();
      }
      return date.getDay() === index;
    }).length,
  }));

  // Datos para el gráfico de tendencia de completitud
  const completionTrend = [
    { name: 'Semana 1', completadas: 5 },
    { name: 'Semana 2', completadas: 8 },
    { name: 'Semana 3', completadas: 12 },
    { name: 'Semana 4', completadas: 10 },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          background: isDark
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${
            isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Analíticas de Tareas
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              background: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Resumen de tareas */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: '100%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <CalendarTodayIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total de Tareas
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {tasks.length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                  }}
                >
                  <CheckCircleIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completadas
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {tasks.filter((task) => task.status === 'completada').length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                  }}
                >
                  <AccessTimeIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {tasks.filter((task) => task.status !== 'completada').length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                  }}
                >
                  <FlagIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Alta Prioridad
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {tasks.filter((task) => task.priority === 'alta').length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Gráficos en dos columnas */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Gráfico de prioridades */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Distribución por Prioridad
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {priorityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={isDark ? '#1a1a1a' : '#fff'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        background: isDark
                          ? 'rgba(0, 0, 0, 0.8)'
                          : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 2,
                }}
              >
                {priorityData.map((entry) => (
                  <Box
                    key={entry.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: entry.color,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {entry.name}: {entry.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Gráfico de estados */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Distribución por Estado
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={isDark ? '#1a1a1a' : '#fff'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        background: isDark
                          ? 'rgba(0, 0, 0, 0.8)'
                          : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 2,
                }}
              >
                {statusData.map((entry) => (
                  <Box
                    key={entry.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: entry.color,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {entry.name}: {entry.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Segunda fila de gráficos */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Gráfico de tareas por día de la semana */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Tareas por Día de la Semana
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksByDay}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.substring(0, 3)}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [value, 'Tareas']}
                      contentStyle={{
                        borderRadius: '8px',
                        background: isDark
                          ? 'rgba(0, 0, 0, 0.8)'
                          : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                    <Bar
                      dataKey="tareas"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Gráfico de tendencia de completitud */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
                flex: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Tendencia de Completitud
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionTrend}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [value, 'Tareas Completadas']}
                      contentStyle={{
                        borderRadius: '8px',
                        background: isDark
                          ? 'rgba(0, 0, 0, 0.8)'
                          : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completadas"
                      stroke={theme.palette.success.main}
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: theme.palette.success.main,
                        strokeWidth: 2,
                        stroke: isDark ? '#1a1a1a' : '#fff',
                      }}
                      activeDot={{
                        r: 8,
                        fill: theme.palette.success.main,
                        strokeWidth: 2,
                        stroke: isDark ? '#1a1a1a' : '#fff',
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
            px: 3,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};