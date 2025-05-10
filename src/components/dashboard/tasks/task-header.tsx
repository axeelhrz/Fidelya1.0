import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TaskHeaderProps {
  onNewTask: () => void;
  onOpenAnalytics: () => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onToggleFilters: () => void;
  onRefresh: () => void;
  disableNewTask?: boolean;
  refreshing?: boolean;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  onNewTask,
  onOpenAnalytics,
  onOpenExport,
  onOpenImport,
  onToggleFilters,
  onRefresh,
  disableNewTask = false,
  refreshing = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component={motion.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            fontWeight: 700,
            mb: 0.5,
            background: isDark
              ? 'linear-gradient(90deg, #fff, #ccc)'
              : 'linear-gradient(90deg, #1a1a1a, #666)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Gestión de Tareas
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Organiza y prioriza tus actividades diarias
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tooltip title="Actualizar datos">
          <IconButton
            onClick={onRefresh}
            disabled={refreshing}
            sx={{
              borderRadius: '12px',
              background: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${
                isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              }`,
              color: theme.palette.text.secondary,
              '&:hover': {
                background: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                color: theme.palette.text.primary,
              },
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Filtros">
          <IconButton
            onClick={onToggleFilters}
            sx={{
              borderRadius: '12px',
              background: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${
                isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              }`,
              color: theme.palette.text.secondary,
              '&:hover': {
                background: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                color: theme.palette.text.primary,
              },
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {!isMobile && (
          <>
            <Tooltip title="Analíticas">
              <IconButton
                onClick={onOpenAnalytics}
                sx={{
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${
                    isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }`,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    background: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <BarChartIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar">
              <IconButton
                onClick={onOpenExport}
                sx={{
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${
                    isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }`,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    background: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <FileDownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Importar">
              <IconButton
                onClick={onOpenImport}
                sx={{
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${
                    isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }`,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    background: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <FileUploadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewTask}
          disabled={disableNewTask}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
            px: { xs: 2, sm: 3 },
          }}
        >
          {isTablet ? 'Nueva' : 'Nueva Tarea'}
        </Button>
      </Stack>
    </Box>
  );
};