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
  CircularProgress,
  Fade,
  Box,
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
  Save as SaveIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Task } from '../../../types/tasks';
import { Timestamp } from 'firebase/firestore';

// Define the missing types locally
type TaskPriority = 'alta' | 'media' | 'baja';
type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => Promise<void>;
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

  // Estado de procesamiento
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

    // Reset states when dialog opens
    if (open) {
      setIsSaving(false);
      setSaveSuccess(false);
      setErrors({ title: false, dueDate: false });
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
  const handleSave = async () => {
    if (validateForm()) {
      setIsSaving(true);
      
      try {
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
        
        await onSave(taskData);
        
        setSaveSuccess(true);
        
        // Close dialog after showing success animation
        setTimeout(() => {
          onClose();
          setSaveSuccess(false);
          setIsSaving(false);
        }, 1000);
      } catch (error) {
        console.error('Error saving task:', error);
        setIsSaving(false);
      }
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
      onClose={isSaving ? undefined : onClose}
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
          position: 'relative',
        },
      }}
    >
      {/* Success overlay */}
      <Fade in={saveSuccess}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            borderRadius: '24px',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: alpha(theme.palette.success.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckIcon
                sx={{
                  fontSize: 48,
                  color: theme.palette.success.main,
                }}
              />
            </Box>
          </motion.div>
          <Typography variant="h6" fontWeight={600} color="success.main">
            {isEditMode ? 'Tarea actualizada' : 'Tarea creada'}
          </Typography>
        </Box>
      </Fade>

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
          disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
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
              disabled={isSaving}
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
            <FormControl fullWidth disabled={isSaving}>
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

            <FormControl fullWidth disabled={isSaving}>
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
          disabled={isSaving}
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
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
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