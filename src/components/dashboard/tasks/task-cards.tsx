import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
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
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Visibility as VisibilityIcon,
  Done as DoneIcon,
  PlayArrow as PlayArrowIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isBefore, isToday, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../../../types/tasks';

// Define the missing types 
type TaskPriority = 'alta' | 'media' | 'baja' | 'normal';
type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';




interface TaskCardsProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onView: (task: Task) => void;
  selectMode?: boolean;
  selectedTasks?: string[];
  onSelectTask?: (taskId: string, selected: boolean) => void;
}

export const TaskCards: React.FC<TaskCardsProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onView,
  selectMode = false,
  selectedTasks = [],
  onSelectTask,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado para el menú de opciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Estado para acciones en progreso
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'complete' | 'delete' | null>(null);

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

  const handleDelete = useCallback(async (taskId: string) => {
    handleCloseMenu();
    setProcessingTaskId(taskId);
    setActionType('delete');
    
    try {
      await onDelete(taskId);
    } finally {
      // Reset processing state after a short delay to show the animation
      setTimeout(() => {
        setProcessingTaskId(null);
        setActionType(null);
      }, 500);
    }
  }, [onDelete]);

  const handleComplete = useCallback(async (event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    event.stopPropagation();
    setProcessingTaskId(taskId);
    setActionType('complete');
    
    try {
      await onComplete(taskId);
    } finally {
      // Reset processing state after a short delay to show the animation
      setTimeout(() => {
        setProcessingTaskId(null);
        setActionType(null);
      }, 500);
    }
  }, [onComplete]);

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

  // Función para obtener el texto del estado
  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_progreso':
        return 'En Progreso';
      case 'completada':
        return 'Completada';
      default:
        return 'Pendiente';
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
    
    // Handle different types of date objects that might come from Firestore
    const dueDateObject = 
      // If it's a Firestore Timestamp with toDate method
      ('toDate' in task.dueDate && typeof task.dueDate.toDate === 'function') 
        ? task.dueDate.toDate() 
        // If it's already a Date
        : (task.dueDate instanceof Date) 
          ? task.dueDate 
          // If it's a string or number
          : new Date(task.dueDate as unknown as string | number);
          
    return task.status !== 'completada' && isBefore(dueDateObject, new Date());
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <Card
            key={task.id}
            component={motion.div}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              filter: processingTaskId === task.id && actionType === 'delete' 
                ? 'blur(4px)' 
                : 'blur(0px)'
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              x: actionType === 'delete' ? -100 : 0,
              transition: { duration: 0.2 }
            }}
            whileHover={{ y: -5 }}
            transition={{ 
              duration: 0.3,
              layout: { duration: 0.3 }
            }}
            onClick={() => task.id && handleCardClick(task)}
            sx={{
              borderRadius: '24px',
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
              opacity: processingTaskId === task.id ? 0.7 : 1,
              ...(task.id && selectedTasks.includes(task.id) && {
                background: isDark
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
              }),
            }}
          >
            {/* Processing overlay */}
            {processingTaskId === task.id && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.background.paper, 0.5),
                  backdropFilter: 'blur(4px)',
                  zIndex: 10,
                  borderRadius: '24px',
                }}
              >
                {actionType === 'complete' && task.status !== 'completada' ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                  >
                    <DoneIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: theme.palette.success.main,
                        filter: `drop-shadow(0 0 8px ${alpha(theme.palette.success.main, 0.5)})`
                      }} 
                    />
                  </motion.div>
                ) : (
                  <CircularProgress size={40} color={actionType === 'delete' ? 'error' : 'primary'} />
                )}
              </Box>
            )}

            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
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
                      sx={{
                        ml: -1,
                        '& .MuiSvgIcon-root': {
                          fontSize: 24,
                        },
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          color: theme.palette.text.primary,
                          background: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.05)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    />
                  ) : (
                    <Tooltip title={task.status === 'completada' ? 'Marcar como pendiente' : 'Marcar como completada'}>
                      <Checkbox
                        checked={task.status === 'completada'}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (task.id) handleComplete(e, task.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        color="primary"
                        sx={{
                          ml: -1,
                          '& .MuiSvgIcon-root': {
                            fontSize: 24,
                          },
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            color: theme.palette.text.primary,
                            background: isDark
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.05)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                    </Tooltip>
                  )}
                  <Typography
                    variant="h6"
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
                  <Tooltip title="Opciones">
                    <IconButton
                      size="small"
                      onClick={(e) => task.id && handleOpenMenu(e, task.id)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          color: theme.palette.text.primary,
                          background: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.05)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>

              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {task.description}
                </Typography>
              )}

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{
                    color: isTaskOverdue(task)
                      ? theme.palette.error.main
                      : theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="body2"
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

              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label={getStatusText(task.status)}
                  sx={{
                    borderRadius: '8px',
                    background: alpha(getStatusColor(task.status), 0.1),
                    color: getStatusColor(task.status),
                    fontWeight: 600,
                    border: `1px solid ${alpha(getStatusColor(task.status), 0.2)}`,
                  }}
                />
                <Chip
                  size="small"
                  icon={
                    <FlagIcon
                      fontSize="small"
                      sx={{ color: getPriorityColor(task.priority) }}
                    />
                  }
                  label={getPriorityText(task.priority)}
                  sx={{
                    borderRadius: '8px',
                    background: alpha(getPriorityColor(task.priority), 0.1),
                    color: getPriorityColor(task.priority),
                    fontWeight: 600,
                    border: `1px solid ${alpha(getPriorityColor(task.priority), 0.2)}`,
                  }}
                />
                {task.subtasks && task.subtasks.length > 0 && (
                  <Chip
                    size="small"
                    label={`${task.subtasks?.filter((st) => typeof st === 'object' && 'completed' in st && st.completed).length || 0}/${task.subtasks?.length || 0}`}
                    sx={{
                      borderRadius: '8px',
                      background: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Card>
        ))}
      </AnimatePresence>

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
        <MenuItem
          onClick={() => {
            if (selectedTaskId) {
              const task = tasks.find((t) => t.id === selectedTaskId);
              if (task && task.status === 'pendiente') {
                // Aquí iría la lógica para iniciar la tarea
                handleCloseMenu();
              }
            }
          }}
          disabled={
            selectedTaskId
              ? tasks.find((t) => t.id === selectedTaskId)?.status !== 'pendiente'
              : true
          }
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PlayArrowIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Iniciar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            if (selectedTaskId) {
              const task = tasks.find((t) => t.id === selectedTaskId);
              if (task && task.status !== 'completada') {
                handleComplete(e, selectedTaskId);
                handleCloseMenu();
              }
            }
          }}
          disabled={
            selectedTaskId
              ? tasks.find((t) => t.id === selectedTaskId)?.status === 'completada'
              : true
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