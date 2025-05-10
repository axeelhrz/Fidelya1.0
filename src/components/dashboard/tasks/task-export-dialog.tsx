import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ExportOptions {
  includeCompleted: boolean;
  includeDescription: boolean;
}

interface TaskExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel', options: ExportOptions) => void;
  tasksCount: number;
}

export const TaskExportDialog: React.FC<TaskExportDialogProps> = ({
  open,
  onClose,
  onExport,
  tasksCount,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado para las opciones de exportación
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeDescription, setIncludeDescription] = useState(true);

  const handleExport = () => {
    const options = {
      includeCompleted,
      includeDescription,
    };
    onExport(format, options);
    onClose();
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
          Exportar Tareas
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
            Exportar {tasksCount} tareas en el formato seleccionado.
          </Typography>
        </Box>

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
            Formato de exportación
          </FormLabel>
          <RadioGroup
            row
            value={format}
            onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel')}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                width: '100%',
              }}
            >
              <Box
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormat('pdf')}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: `2px solid ${
                    format === 'pdf'
                      ? theme.palette.primary.main
                      : isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)'
                  }`,
                  background:
                    format === 'pdf'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <PictureAsPdfIcon
                  sx={{
                    fontSize: 40,
                    color:
                      format === 'pdf'
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    mb: 1,
                  }}
                />
                <FormControlLabel
                  value="pdf"
                  control={<Radio sx={{ display: 'none' }} />}
                  label="PDF"
                  sx={{
                    m: 0,
                    '& .MuiFormControlLabel-label': {
                      fontWeight: format === 'pdf' ? 600 : 400,
                      color:
                        format === 'pdf'
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                    },
                  }}
                />
              </Box>

              <Box
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormat('excel')}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: `2px solid ${
                    format === 'excel'
                      ? theme.palette.primary.main
                      : isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)'
                  }`,
                  background:
                    format === 'excel'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <TableChartIcon
                  sx={{
                    fontSize: 40,
                    color:
                      format === 'excel'
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    mb: 1,
                  }}
                />
                <FormControlLabel
                  value="excel"
                  control={<Radio sx={{ display: 'none' }} />}
                  label="Excel"
                  sx={{
                    m: 0,
                    '& .MuiFormControlLabel-label': {
                      fontWeight: format === 'excel' ? 600 : 400,
                      color:
                        format === 'excel'
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                    },
                  }}
                />
              </Box>
            </Box>
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
            Opciones
          </FormLabel>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeCompleted}
                  onChange={(e) => setIncludeCompleted(e.target.checked)}
                  sx={{
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label="Incluir tareas completadas"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeDescription}
                  onChange={(e) => setIncludeDescription(e.target.checked)}
                  sx={{
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label="Incluir descripciones"
            />
          </Stack>
        </FormControl>

        <Box
          sx={{
            p: 2,
            borderRadius: '16px',
            background: isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FileDownloadIcon
            sx={{ color: theme.palette.info.main, fontSize: 20 }}
          />
          <Typography variant="body2" color="text.secondary">
            El archivo se descargará automáticamente en tu dispositivo.
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
          onClick={handleExport}
          variant="contained"
          startIcon={<FileDownloadIcon />}
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
          Exportar
        </Button>
      </DialogActions>
    </Dialog>
  );
};