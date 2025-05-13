import React, { useState, useCallback } from 'react';
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
  Tooltip,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayArrowIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isBefore, isToday, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../../../types/tasks';

// Define TaskPriority type locally
type TaskPriority = 'alta' | 'media' | 'baja' | 'normal';
type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

interface TaskBoardViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onView: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  selectMode?: boolean;
  selectedTasks?: string[];
  onSelectTask?: (taskId: string, selected: boolean) => void;
}

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onView,
  onMoveTask,
  selectMode = false,
  selectedTasks = [],
  onSelectTask,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado para el menú de opciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleEdit = (task: Task) => {
    handleCloseMenu();
    onEdit(task);
  };

  const handleView = (task: Task) => {
    handleCloseMenu();
    onView(task);
  };

  const handleDelete = (taskId: string) => {
    handleCloseMenu();
    onDelete(taskId);
  };

  const handleComplete = (event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    event.stopPropagation();
    onComplete(taskId);
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    onMoveTask(taskId, newStatus);
  };

  const handleCardClick = useCallback((task: Task) => {
    if (selectMode && task.id && onSelectTask) {
      onSelectTask(task.id, !selectedTasks.includes(task.id));
    } else {
      onView(task);
    }
  }, [selectMode, selectedTasks, onSelectTask, onView]);

  const handleSelectTask = useCallback((event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    event.stopPropagation();
    if (onSelectTask) {
      onSelectTask(taskId, !selectedTasks.includes(taskId));
    }
  }, [selectedTasks, onSelectTask]);

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

  // Función para obtener el color según el estado
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pendiente':
        return theme.palette.info.main;
      case 'en_progreso':
        return theme.palette.warning.main;
      case 'completada':
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
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, "EEEE, HH:mm", { locale: es });
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
      id: 'pendiente' as TaskStatus,
      title: 'Pendientes',
      color: theme.palette.info.main,
      tasks: pendingTasks,
      emptyText: 'No hay tareas pendientes',
      moveTooltip: 'Mover a pendientes',
    },
    {
      id: 'en_progreso' as TaskStatus,
      title: 'En Progreso',
      color: theme.palette.warning.main,
      tasks: inProgressTasks,
      emptyText: 'No hay tareas en progreso',
      moveTooltip: 'Mover a en progreso',
    },
    {
      id: 'completada' as TaskStatus,
      title: 'Completadas',
      color: theme.palette.success.main,
      tasks: completedTasks,
      emptyText: 'No hay tareas completadas',
      moveTooltip: 'Mover a completadas',
    },
  ];

  // Renderizar una tarjeta de tarea
  const renderTaskCard = (task: Task, columnId: TaskStatus) => (
    <Card
      key={task.id}
      component={motion.div}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => task.id && handleCardClick(task)}
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
          : task.id && selectedTasks.includes(task.id)
            ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
            : `0 4px 20px ${alpha(
                theme.palette.primary.main,
                isDark ? 0.1 : 0.05
              )}`,
        borderLeft: `4px solid ${
          task.id && selectedTasks.includes(task.id)
            ? theme.palette.primary.main
            : isTaskOverdue(task)
              ? theme.palette.error.main
              : getPriorityColor(task.priority)
        }`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isTaskOverdue(task)
            ? `0 8px 25px ${alpha(theme.palette.error.main, 0.3)}`
            : task.id && selectedTasks.includes(task.id)
              ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
              : `0 8px 25px ${alpha(
                  theme.palette.primary.main,
                  isDark ? 0.15 : 0.1
                )}`,
        },
        position: 'relative',
        ...(task.id && selectedTasks.includes(task.id) && {
          background: isDark
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.primary.main, 0.05),
        }),
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
            {selectMode ? (
              <Checkbox
                checked={task.id ? selectedTasks.includes(task.id) : false}
                onChange={(e) => task.id && handleSelectTask(e, task.id)}
                onClick={(e) => e.stopPropagation()}
                color="primary"
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                size="small"
                sx={{
                  ml: -1,
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  },
                }}
              />
            ) : (
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
            )}
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
          {!selectMode && (
            <IconButton
              size="small"
              onClick={(e) => task.id && handleOpenMenu(e, task.id)}
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
          )}
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
            {task.dueDate 
              ? isTaskOverdue(task)
                ? `Vencida: ${formatDate(task.dueDate ? ('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate) : new Date())}`
                : formatDate(task.dueDate ? ('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate) : new Date())
              : 'Sin fecha límite'
            }
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
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
          {task.hasSubtasks && (
            <Chip
              size="small"
              label={`${task.subtasks?.filter((st) => typeof st === 'object' && st.completed).length || 0}/${task.subtasks?.length || 0}`}
              sx={{
                height: 24,
                borderRadius: '6px',
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.7rem',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
          )}
        </Stack>

        {/* Botones para mover la tarea a otras columnas */}
        {!selectMode && task.id && (
          <Stack 
            direction="row" 
            spacing={1} 
            mt={1.5}
            justifyContent="space-between"
          >
            {columns
              .filter(column => column.id !== columnId)
              .map(column => (
                <Tooltip key={column.id} title={column.moveTooltip}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveTask(task.id!, column.id);
                    }}
                    sx={{
                      minWidth: 0,
                      borderRadius: '8px',
                      borderColor: alpha(getStatusColor(column.id), 0.3),
                      color: getStatusColor(column.id),
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      '&:hover': {
                        borderColor: getStatusColor(column.id),
                        background: alpha(getStatusColor(column.id), 0.05),
                      },
                    }}
                  >
                    {column.id === 'pendiente' ? 'Pendiente' : 
                     column.id === 'en_progreso' ? 'Iniciar' : 'Completar'}
                  </Button>
                </Tooltip>
              ))
            }
          </Stack>
        )}
      </Box>
    </Card>
  );

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
              {column.tasks.map((task) => renderTaskCard(task, column.id))}
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
                  {column.emptyText}
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
            if (task) handleView(task);
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
        
        {/* Opciones para mover la tarea */}
        {selectedTaskId && (
          <>
            <Divider sx={{ my: 1 }} />
            {columns.map(column => {
              const task = tasks.find(t => t.id === selectedTaskId);
              if (!task || task.status === column.id) return null;
              
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => {
                    if (selectedTaskId) {
                      handleMoveTask(selectedTaskId, column.id);
                      handleCloseMenu();
                    }
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    {column.id === 'pendiente' ? (
                      <FlagIcon fontSize="small" color="info" />
                    ) : column.id === 'en_progreso' ? (
                      <PlayArrowIcon fontSize="small" color="warning" />
                    ) : (
                      <CheckCircleIcon fontSize="small" color="success" />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    Mover a {column.id === 'pendiente' ? 'Pendientes' : 
                             column.id === 'en_progreso' ? 'En Progreso' : 
                             'Completadas'}
                  </ListItemText>
                </MenuItem>
              );
            })}
          </>
        )}
        
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