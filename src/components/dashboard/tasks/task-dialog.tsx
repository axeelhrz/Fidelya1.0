import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Stack,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import {
  Close as CloseIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarMonthIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Task, TaskPriority, TaskStatus } from '../../../types/tasks';
import { Timestamp } from 'firebase/firestore';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
  isEditMode: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onSave,
  task,
  isEditMode,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [dueDate, setDueDate] = useState<Date>(new Date());

  // Estado de errores
  const [errors, setErrors] = useState({
    title: false,
    dueDate: false,
  });

  // Efecto para cargar los datos de la tarea en modo edición
  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      // Handle both Timestamp and Date types, with null check
      if (task.dueDate) {
        setDueDate('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate);
      } else {
        setDueDate(new Date());
      }
    } else if (!isEditMode && open) {
      // Resetear el formulario en modo creación
      setTitle('');
      setDescription('');
      setPriority('media');
      setStatus('pendiente');
      setDueDate(new Date());
    }
  }, [task, open, isEditMode]);

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {
      title: title.trim() === '',
      dueDate: !dueDate,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Función para manejar el guardado
  const handleSave = () => {
    if (validateForm()) {
      const taskData: Task = {
        id: task?.id || '',
        title,
        description,
        priority,
        status,
        dueDate: Timestamp.fromDate(dueDate),
        userId: task?.userId || '',
        createdAt: task?.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      onSave(taskData);
    }
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        layoutId: 'task-dialog',
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
          {isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
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
          <TextField
            label="Título"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            helperText={errors.title && 'El título es obligatorio'}
            InputProps={{
              startAdornment: (
                <TitleIcon
                  fontSize="small"
                  sx={{ mr: 1, color: theme.palette.text.secondary }}
                />
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
              startAdornment: (
                <DescriptionIcon
                  fontSize="small"
                  sx={{ mr: 1, mt: 1, color: theme.palette.text.secondary }}
                />
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DateTimePicker
              label="Fecha límite"
              value={dueDate}
              onChange={(newValue) => {
                if (newValue) {
                  setDueDate(newValue);
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: errors.dueDate,
                  helperText: errors.dueDate && 'La fecha es obligatoria',
                  InputProps: {
                    startAdornment: (
                      <CalendarMonthIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.secondary }}
                      />
                    ),
                    sx: {
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDark
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Prioridad</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                label="Prioridad"
                startAdornment={
                  <FlagIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: getPriorityColor(priority),
                    }}
                  />
                }
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="media">Media</MenuItem>
                <MenuItem value="baja">Baja</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                label="Estado"
                startAdornment={
                  <AssignmentIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: getStatusColor(status),
                    }}
                  />
                }
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="en_progreso">En Progreso</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
              background: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
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
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;