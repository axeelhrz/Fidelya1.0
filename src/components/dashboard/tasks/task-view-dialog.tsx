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
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task, TaskPriority, TaskStatus } from '../../../types/tasks';

interface TaskViewDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

export const TaskViewDialog: React.FC<TaskViewDialogProps> = ({
  open,
  onClose,
  task,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!task) return null;

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
  const formatDate = (date: Date | { toDate(): Date } | string | number | null | undefined | unknown) => {
    if (!date) return 'No disponible';
    
    try {
      // Check if it's a FieldValue (like serverTimestamp)
      if (typeof date === 'object' && !('toDate' in date) && !('getTime' in date)) {
        return 'Pendiente...';
      }
      
      // Convert to Date object if it's a Firestore Timestamp
      const dateObj = typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function'
        ? date.toDate() 
        : date instanceof Date ? date : new Date(date as string | number);
      
      return format(dateObj, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no válida';
    }
  };

  // Verificar si una tarea está vencida
  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    
    // Convert to Date object if it's a Firestore Timestamp
    const dueDate = task.dueDate && 'toDate' in task.dueDate && typeof task.dueDate.toDate === 'function'
      ? task.dueDate.toDate() 
      : task.dueDate;
      
    // Ensure we're working with a Date object
    const dueDateAsDate = dueDate instanceof Date 
      ? dueDate 
      : ('toDate' in dueDate && typeof dueDate.toDate === 'function') 
        ? dueDate.toDate() 
        : new Date(dueDate as unknown as string | number);
    
    return task.status !== 'completada' && isBefore(dueDateAsDate, new Date());
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        layoutId: 'task-view-dialog',
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.9 },
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
        <Typography variant="h6" fontWeight={700}>
          Detalles de la Tarea
        </Typography>
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
          {/* Título de la tarea */}
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                wordBreak: 'break-word',
                textDecoration:
                  task.status === 'completada' ? 'line-through' : 'none',
                color:
                  task.status === 'completada'
                    ? 'text.secondary'
                    : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
          </Box>

          {/* Chips de estado y prioridad */}
          <Stack direction="row" spacing={1}>
            <Chip
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
            {isTaskOverdue(task) && (
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label="Vencida"
                sx={{
                  borderRadius: '8px',
                  background: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  fontWeight: 600,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              />
            )}
          </Stack>

          {/* Descripción */}
          {task.description && (
            <Box
              sx={{
                p: 3,
                borderRadius: '16px',
                background: isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {task.description}
              </Typography>
            </Box>
          )}

          {/* Fechas */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
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
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{
                    color: isTaskOverdue(task)
                      ? theme.palette.error.main
                      : theme.palette.text.secondary,
                  }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fecha límite
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      color: isTaskOverdue(task)
                        ? theme.palette.error.main
                        : theme.palette.text.primary,
                    }}
                  >
                    {task.dueDate ? formatDate(task.dueDate) : 'No establecida'}
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
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <EventIcon
                  fontSize="small"
                  sx={{ color: theme.palette.text.secondary }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Creada el
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(task.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Última actualización */}
          <Box
            sx={{
              p: 2,
              borderRadius: '16px',
              background: isDark
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <UpdateIcon
              fontSize="small"
              sx={{ color: theme.palette.text.secondary }}
            />
            <Typography variant="body2" color="text.secondary">
              Última actualización: {formatDate(task.updatedAt)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: '100%', justifyContent: 'space-between' }}
        >
          <Button
            onClick={onDelete}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Eliminar
          </Button>

          <Box>
            {task.status !== 'completada' && (
              <Button
                onClick={onComplete}
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                Completar
              </Button>
            )}

            <Button
              onClick={onEdit}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                },
              }}
            >
              Editar
            </Button>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};