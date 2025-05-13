import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  DeleteSweep as DeleteSweepIcon,
  SelectAll as SelectAllIcon,
} from '@mui/icons-material';

interface TaskHeaderProps {
  onNewTask: () => void;
  onOpenAnalytics: () => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onToggleFilters: () => void;
  onRefresh: () => void;
  disableNewTask?: boolean;
  refreshing?: boolean;
  selectMode?: boolean;
  selectedCount?: number;
  totalCount?: number;
  onToggleSelectMode?: () => void;
  onSelectAll?: () => void;
  onDeleteSelected?: () => void;
  onCompleteSelected?: () => void;
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
  selectMode = false,
  selectedCount = 0,
  totalCount = 0,
  onToggleSelectMode,
  onSelectAll,
  onDeleteSelected,
  onCompleteSelected,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            mb: 1,
            background: isDark
              ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Gestión de Tareas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {selectMode 
            ? `${selectedCount} de ${totalCount} tareas seleccionadas`
            : 'Organiza y gestiona tus tareas de manera eficiente'}
        </Typography>
      </Box>

      {selectMode ? (
        <Stack 
          direction="row" 
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Tooltip title="Seleccionar todas">
            <Button
              variant="outlined"
              size="small"
              onClick={onSelectAll}
              startIcon={<SelectAllIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {selectedCount === totalCount ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </Button>
          </Tooltip>
          
          <Tooltip title="Completar seleccionadas">
            <Button
              variant="outlined"
              color="success"
              size="small"
              disabled={selectedCount === 0}
              onClick={onCompleteSelected}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Completar
            </Button>
          </Tooltip>
          
          <Tooltip title="Eliminar seleccionadas">
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={selectedCount === 0}
              onClick={onDeleteSelected}
              startIcon={<DeleteSweepIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Eliminar
            </Button>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem />
          
          <Tooltip title="Salir del modo selección">
            <IconButton
              onClick={onToggleSelectMode}
              color="default"
              size="small"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                p: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack 
          direction="row" 
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Tooltip title="Nueva tarea">
            <span>
              <Button
                variant="contained"
                onClick={onNewTask}
                disabled={disableNewTask}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                Nueva Tarea
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Filtros">
            <IconButton
              onClick={onToggleFilters}
              color="primary"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 1,
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Analíticas">
            <IconButton
              onClick={onOpenAnalytics}
              color="primary"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 1,
              }}
            >
              <BarChartIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Exportar">
            <IconButton
              onClick={onOpenExport}
              color="primary"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 1,
              }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Importar">
            <IconButton
              onClick={onOpenImport}
              color="primary"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 1,
              }}
            >
              <FileUploadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refrescar">
            <IconButton
              onClick={onRefresh}
              color="primary"
              disabled={refreshing}
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 1,
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Modo selección">
            <IconButton
              onClick={onToggleSelectMode}
              color="primary"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 1,
              }}
            >
              <SelectAllIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
};