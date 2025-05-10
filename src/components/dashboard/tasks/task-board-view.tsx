import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Card,
  Chip,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isBefore, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../../../types/tasks';

// Define TaskPriority type locally
type TaskPriority = 'alta' | 'media' | 'baja' | 'normal';

interface TaskBoardViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado para el menú de opciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);


  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleEdit = (task: Task) => {
    handleCloseMenu();
    onEdit(task);
  };

  const handleDelete = (taskId: string) => {
    handleCloseMenu();
    onDelete(taskId);
  };

  const handleComplete = (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    event.stopPropagation();
    onComplete(taskId);
  };

  // Función para obtener el color según la prioridad
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return theme.palette.error.main;
      case 'media':
        return theme.palette.warning.main;
      case 'baja':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return 'Normal';
    }
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `Hoy, ${format(date, 'HH:mm')}`;
    }
    return format(date, "d 'de' MMMM, HH:mm", { locale: es });
  };

  // Verificar si una tarea está vencida
  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    
    // Handle both Date and Timestamp types
    const dueDate = 'toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate;
    return task.status !== 'completada' && isBefore(dueDate, new Date());
  };

  // Filtrar tareas por estado
  const pendingTasks = tasks.filter((task) => task.status === 'pendiente');
  const inProgressTasks = tasks.filter((task) => task.status === 'en_progreso');
  const completedTasks = tasks.filter((task) => task.status === 'completada');

  // Columnas del tablero
  const columns = [
    {
      id: 'pendiente',
      title: 'Pendientes',
      color: theme.palette.info.main,
      tasks: pendingTasks,
    },
    {
      id: 'en_progreso',
      title: 'En Progreso',
      color: theme.palette.warning.main,
      tasks: inProgressTasks,
    },
    {
      id: 'completada',
      title: 'Completadas',
      color: theme.palette.success.main,
      tasks: completedTasks,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
        overflowX: 'auto',
        pb: 2,
      }}
    >
      {columns.map((column) => (
        <Paper
          key={column.id}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '24px',
            background: isDark
              ? alpha(theme.palette.background.paper, 0.4)
              : alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }`,
            height: 'fit-content',
            minWidth: 280,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: column.color,
                }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {column.title}
              </Typography>
            </Box>
            <Chip
              label={column.tasks.length}
              size="small"
              sx={{
                borderRadius: '8px',
                background: alpha(column.color, 0.1),
                color: column.color,
                fontWeight: 600,
                border: `1px solid ${alpha(column.color, 0.2)}`,
              }}
            />
          </Box>

          <Stack spacing={2}>
            <AnimatePresence>
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onEdit(task)}
                  sx={{
                    borderRadius: '16px',
                    p: 0,
                    overflow: 'hidden',
                    background: isDark
                      ? alpha(theme.palette.background.paper, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${
                      isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                    }`,
                    boxShadow: isTaskOverdue(task)
                      ? `0 4px 20px ${alpha(theme.palette.error.main, 0.2)}`
                      : `0 4px 20px ${alpha(
                          theme.palette.primary.main,
                          isDark ? 0.1 : 0.05
                        )}`,
                    borderLeft: `4px solid ${
                      isTaskOverdue(task)
                        ? theme.palette.error.main
                        : getPriorityColor(task.priority)
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: isTaskOverdue(task)
                        ? `0 8px 25px ${alpha(theme.palette.error.main, 0.3)}`
                        : `0 8px 25px ${alpha(
                            theme.palette.primary.main,
                            isDark ? 0.15 : 0.1
                          )}`,
                    },
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ mb: 1 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={task.status === 'completada'}
                          onChange={(e) => task.id && handleComplete(e, task.id)}
                          onClick={(e) => e.stopPropagation()}
                          color="primary"
                          size="small"
                          sx={{
                            ml: -1,
                            '& .MuiSvgIcon-root': {
                              fontSize: 20,
                            },
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            textDecoration:
                              task.status === 'completada' ? 'line-through' : 'none',
                            color:
                              task.status === 'completada'
                                ? 'text.secondary'
                                : 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {task.title}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => task.id && handleDelete(task.id)}
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
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <CalendarTodayIcon
                        fontSize="small"
                        sx={{
                          fontSize: 14,
                          color: isTaskOverdue(task)
                            ? theme.palette.error.main
                            : theme.palette.text.secondary,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: isTaskOverdue(task)
                            ? theme.palette.error.main
                            : theme.palette.text.secondary,
                          fontWeight: isTaskOverdue(task) ? 600 : 400,
                        }}
                      >
                        {isTaskOverdue(task)
                          ? `Vencida: ${formatDate(task.dueDate ? ('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate) : new Date())}`
                          : task.dueDate ? formatDate('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate) : 'Sin fecha'}
                      </Typography>
                    </Stack>

                    <Chip
                      size="small"
                      icon={
                        <FlagIcon
                          fontSize="small"
                          sx={{ 
                            color: getPriorityColor(task.priority),
                            fontSize: 14
                          }}
                        />
                      }
                      label={getPriorityText(task.priority)}
                      sx={{
                        height: 24,
                        borderRadius: '6px',
                        background: alpha(getPriorityColor(task.priority), 0.1),
                        color: getPriorityColor(task.priority),
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: `1px solid ${alpha(
                          getPriorityColor(task.priority),
                          0.2
                        )}`,
                      }}
                    />
                  </Box>
                </Card>
              ))}
            </AnimatePresence>

            {column.tasks.length === 0 && (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: '16px',
                  border: `1px dashed ${alpha(column.color, 0.3)}`,
                  background: alpha(column.color, 0.05),
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No hay tareas
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      ))}

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '16px',
            minWidth: 180,
            overflow: 'hidden',
            mt: 1,
            '& .MuiList-root': {
              py: 1,
            },
            background: isDark
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }`,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            const task = tasks.find((t) => t.id === selectedTaskId);
            if (task) handleEdit(task);
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const task = tasks.find((t) => t.id === selectedTaskId);
            if (task) handleEdit(task);
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedTaskId) {
              const task = tasks.find((t) => t.id === selectedTaskId);
              if (task && task.status !== 'completada') {
                onComplete(selectedTaskId);
                handleCloseMenu();
              }
            }
          }}
          disabled={
            selectedTaskId
              ? tasks.find((t) => t.id === selectedTaskId)?.status ===
                'completada'
              : false
          }
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Completar</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            if (selectedTaskId) handleDelete(selectedTaskId);
          }}
          sx={{ py: 1.5, color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};