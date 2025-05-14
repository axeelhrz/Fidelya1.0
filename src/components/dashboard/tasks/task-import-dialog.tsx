import React, { useState, useRef } from 'react';
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
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Task } from '../../../types/tasks';

interface TaskImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (tasks: Partial<Task>[]) => Promise<boolean>;
}

const TaskImportDialog: React.FC<TaskImportDialogProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setSuccess(false);

    // Validar el tipo de archivo
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        fileType !== 'application/vnd.ms-excel' &&
        fileType !== 'text/csv'
      ) {
        setError('Formato de archivo no válido. Por favor, sube un archivo Excel o CSV.');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo para importar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Aquí iría la lógica para leer el archivo y convertirlo en tareas
      // Por ahora, simulamos una importación exitosa
      const mockTasks: Partial<Task>[] = [
        { title: 'Tarea importada 1', priority: 'alta' },
        { title: 'Tarea importada 2', priority: 'media' },
      ];

      const success = await onImport(mockTasks);
      
      if (success) {
        setSuccess(true);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError('Error al importar las tareas. Por favor, inténtalo de nuevo.');
      }
    } catch{
      setError('Error al procesar el archivo. Asegúrate de que el formato sea correcto.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          maxWidth: '450px',
          width: '100%',
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
          Importar Tareas
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Importa tareas desde un archivo Excel o CSV. Asegúrate de que el archivo tenga las columnas correctas.
          </Typography>
        </Box>

        <Box
          sx={{
            border: `2px dashed ${
              isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }`,
            borderRadius: '16px',
            p: 4,
            textAlign: 'center',
            mb: 3,
            background: isDark
              ? 'rgba(255, 255, 255, 0.02)'
              : 'rgba(0, 0, 0, 0.01)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.05),
            },
          }}
          component={motion.div}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleClickBrowse}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".xlsx,.xls,.csv"
          />
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom>
            {file ? file.name : 'Arrastra o selecciona un archivo'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {file
              ? `${(file.size / 1024).toFixed(2)} KB`
              : 'Formatos soportados: Excel, CSV'}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Examinar
          </Button>
        </Box>

        {loading && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}
            >
              <span>Procesando archivo...</span>
              <span>50%</span>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={50}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                },
              }}
            />
          </Box>
        )}

        <Stack spacing={2}>
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                },
              }}
            >
              Tareas importadas correctamente.
            </Alert>
          )}
        </Stack>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: '16px',
            background: isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
          }}
        >
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Formato esperado:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Título, Descripción, Fecha límite, Prioridad, Estado
          </Typography>
        </Box>
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
          onClick={handleImport}
          variant="contained"
          disabled={!file || loading}
          startIcon={<FileUploadIcon />}
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
          Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskImportDialog;