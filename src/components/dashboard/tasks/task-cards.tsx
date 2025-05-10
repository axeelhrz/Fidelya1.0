import React from 'react';
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

// Define the missing types 
type TaskPriority = 'alta' | 'media' | 'baja' | 'normal';
type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

interface TaskCardsProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const TaskCards: React.FC<TaskCardsProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado para el menú de opciones
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);

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
      <AnimatePresence>
        {tasks.map((task) => (
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
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={task.status === 'completada'}
                    onChange={(e) => {
                      if (task.id) handleComplete(e, task.id);
                    }}
                                        onClick={(e) => e.stopPropagation()}
                    color="primary"
                    sx={{
                      ml: -1,
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      },
                    }}
                  />
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
                  {isTaskOverdue(task)
                    ? `Vencida: ${formatDate(task.dueDate ? ('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate) : new Date())}`
                    : formatDate(task.dueDate ? ('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate) : new Date())}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label={getStatusText(task.status)}
                  sx={{
                    borderRadius: '8px',
                    background: alpha(getStatusColor(
                    task.status), 0.1),
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
                    border: `1px solid ${alpha(
                      getPriorityColor(task.priority),
                      0.2
                    )}`,
                  }}
                />
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