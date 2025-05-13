'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Snackbar,
  Alert,
  Skeleton,
  useTheme,
  Paper,
  Button,
  Fab,
  alpha,
  Zoom,
  useMediaQuery,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
  KeyboardCommandKey as KeyboardCommandKeyIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  DeleteSweep as DeleteSweepIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { TaskStats } from '../../../components/dashboard/tasks/task-stats';
import { TaskFiltersComponent } from '../../../components/dashboard/tasks/task-filters';
import { TaskCards } from '../../../components/dashboard/tasks/task-cards';
import { TaskBoardView } from '../../../components/dashboard/tasks/task-board-view';
import { TaskTabs } from '../../../components/dashboard/tasks/task-tabs';
import AddTaskModal from '../../../components/dashboard/tasks/task-dialog';
import DeleteConfirmDialog from '../../../components/dashboard/tasks/task-delete-dialog';
import { TaskExportDialog } from '../../../components/dashboard/tasks/task-export-dialog';
import { TaskAnalyticsDialog } from '../../../components/dashboard/tasks/task-analytics-dialog';
import { TaskViewDialog } from '../../../components/dashboard/tasks/task-view-dialog';
import TaskImportDialog from '../../../components/dashboard/tasks/task-import-dialog';
import { TaskHeader } from '../../../components/dashboard/tasks/task-header';
import { useTasks } from '../../../hooks/use-tasks';
import { Task } from '../../../types/tasks';
import { useAuth } from '../../../hooks/use-auth';
import { useSubscription } from '../../../hooks/use-subscription';
import { useHotkeys } from 'react-hotkeys-hook';
import { PLAN_LIMITS, PlanValue } from '../../../lib/constantTask';

export default function TasksPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Get task data from the hook
  const {
    tasks,
    filteredTasks,
    loading,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveTask,
    deleteTasks,
    completeTasks,
    calculateStats,
    suggestNextTask,
    exportTasks,
    importTasks,
    refreshTasks,
  } = useTasks();
  
  // Estados para diálogos
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openAnalyticsDialog, setOpenAnalyticsDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [view, setView] = useState<'cards' | 'board'>('cards');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  
  // Estado para snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Estado para sugerencias
  const [suggestedTask, setSuggestedTask] = useState<Task | null>(null);
  const [showTip, setShowTip] = useState(true);

  // Verificar si el usuario ha alcanzado el límite de tareas del plan
  const planLimits = useMemo(() => {
    return subscription?.plan 
      ? PLAN_LIMITS[subscription.plan as keyof typeof PLAN_LIMITS] 
      : PLAN_LIMITS[PlanValue.BASIC];
  }, [subscription]);
  
  const hasReachedTaskLimit = calculateStats.total >= (Number(planLimits?.activeTasks) || 25);
  const canUseKanbanView = planLimits?.kanbanView || false;
  const canExportTasks = planLimits?.export || false;
  const canImportTasks = planLimits?.import || false;

  // Referencia para scroll
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Efecto para sugerir la próxima tarea
  useEffect(() => {
    if (filteredTasks.length > 0 && !loading) {
      const nextTask = suggestNextTask();
      setSuggestedTask(nextTask);
    } else {
      setSuggestedTask(null);
    }
  }, [filteredTasks, suggestNextTask, loading]);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 300);
      }
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Efecto para limpiar selección cuando se cambia de vista
  useEffect(() => {
    setSelectedTasks([]);
    setSelectMode(false);
  }, [view]);

  // Hotkeys para acciones rápidas
  useHotkeys('mod+n', (event) => {
    event.preventDefault();
    if (!hasReachedTaskLimit) {
      handleOpenTaskDialog();
    } else {
      showPlanLimitMessage();
    }
  }, { enableOnFormTags: false });

  useHotkeys('/', (event) => {
    event.preventDefault();
    // Enfocar en el campo de búsqueda
    const searchInput = document.getElementById('task-search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }, { enableOnFormTags: false });

  useHotkeys('mod+f', (event) => {
    event.preventDefault();
    setShowFilters(prev => !prev);
  }, { enableOnFormTags: false });

  useHotkeys('escape', (event) => {
    if (selectMode) {
      event.preventDefault();
      setSelectMode(false);
      setSelectedTasks([]);
    }
  }, { enableOnFormTags: false });

  // Función para refrescar datos
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      refreshTasks();
      
      // Simular un tiempo de carga mínimo para mejor UX
      setTimeout(() => {
        setRefreshing(false);
        setSnackbar({
          open: true,
          message: 'Datos actualizados correctamente',
          severity: 'success',
        });
      }, 800);
    } catch {
      setRefreshing(false);
      setSnackbar({
        open: true,
        message: 'Error al actualizar los datos',
        severity: 'error',
      });
    }
  }, [refreshTasks]);

  // Mostrar mensaje de límite del plan
  const showPlanLimitMessage = useCallback(() => {
    setSnackbar({
      open: true,
      message: `Has alcanzado el límite de ${planLimits.activeTasks} tareas para tu plan. Actualiza para crear más tareas.`,
      severity: 'warning',
    });
  }, [planLimits.activeTasks]);

  // Funciones para manejar tareas
  const handleOpenTaskDialog = useCallback(() => {
    // Verificar límite del plan
    if (hasReachedTaskLimit) {
      showPlanLimitMessage();
      return;
    }
    
    setSelectedTask(null);
    setIsEditMode(false);
    setOpenTaskDialog(true);
  }, [hasReachedTaskLimit, showPlanLimitMessage]);

  const handleViewTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setOpenViewDialog(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setOpenTaskDialog(true);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    const task = filteredTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setOpenDeleteDialog(true);
    }
  }, [filteredTasks]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedTask && selectedTask.id) {
      try {
        const success = await deleteTask(selectedTask.id);
        if (success) {
          setSnackbar({
            open: true,
            message: 'Tarea eliminada correctamente',
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Error al eliminar la tarea',
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar la tarea',
          severity: 'error',
        });
      } finally {
        setOpenDeleteDialog(false);
      }
    }
  }, [selectedTask, deleteTask]);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    try {
      const success = await completeTask(taskId);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Estado de tarea actualizado correctamente',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al actualizar el estado de la tarea',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error al completar tarea:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el estado de la tarea',
        severity: 'error',
      });
    }
  }, [completeTask]);

  const handleMoveTask = useCallback(async (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'completada') => {
    try {
      const success = await moveTask(taskId, newStatus);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Tarea movida correctamente',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al mover la tarea',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error al mover tarea:', error);
      setSnackbar({
        open: true,
        message: 'Error al mover la tarea',
        severity: 'error',
      });
    }
  }, [moveTask]);

  const handleSaveTask = useCallback(async (taskData: Task) => {
    try {
      if (isEditMode && taskData.id) {
        // Actualizar tarea existente
        // Extraemos solo los campos que necesitamos actualizar, manteniendo el ID
        const { id, ...updateData } = taskData;
        
        const success = await updateTask(id, updateData);
        if (success) {
          setSnackbar({
            open: true,
            message: 'Tarea actualizada correctamente',
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Error al actualizar la tarea',
            severity: 'error',
          });
        }
      } else {
        // Crear nueva tarea
        // Para nuevas tareas, no incluimos el ID
        const { ...newTaskData } = taskData;
        
        const taskId = await addTask(newTaskData);
        if (taskId) {
          setSnackbar({
            open: true,
            message: 'Tarea creada correctamente',
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Error al crear la tarea',
            severity: 'error',
          });
        }
      }
      
      // Cerrar el diálogo después de guardar
      setOpenTaskDialog(false);
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      setSnackbar({
        open: true,
        message: isEditMode ? 'Error al actualizar la tarea' : 'Error al crear la tarea',
        severity: 'error',
      });
    }
  }, [isEditMode, updateTask, addTask]);

  const handleExport = useCallback(async (format: 'pdf' | 'excel') => {
    if (!canExportTasks) {
      setSnackbar({
        open: true,
        message: 'La exportación de tareas solo está disponible en planes Pro y Enterprise',
        severity: 'warning',
      });
      return;
    }

    try {
      // Si hay tareas seleccionadas, exportar solo esas
      const tasksToExport = selectedTasks.length > 0
        ? filteredTasks.filter(task => selectedTasks.includes(task.id || ''))
        : undefined;
      
      const result = await exportTasks(format, tasksToExport);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error(`Error al exportar tareas en formato ${format}:`, error);
      setSnackbar({
        open: true,
        message: `Error al exportar las tareas en formato ${format.toUpperCase()}`,
        severity: 'error',
      });
    } finally {
      setOpenExportDialog(false);
      // Limpiar selección después de exportar
      if (selectedTasks.length > 0) {
        setSelectedTasks([]);
        setSelectMode(false);
      }
    }
  }, [canExportTasks, exportTasks, filteredTasks, selectedTasks]);

  const handleImport = useCallback(async (tasksData: Partial<Task>[]) => {
    if (!canImportTasks) {
      setSnackbar({
        open: true,
        message: 'La importación de tareas solo está disponible en planes Pro y Enterprise',
        severity: 'warning',
      });
      return false;
    }

    try {
      const result = await importTasks(tasksData);
      
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'error',
      });
      
      if (result.success) {
        setOpenImportDialog(false);
      }
      
      return result.success;
    } catch (error) {
      console.error('Error al importar tareas:', error);
      setSnackbar({
        open: true,
        message: 'Error al importar las tareas',
        severity: 'error',
      });
      return false;
    }
  }, [canImportTasks, importTasks]);

  const handleSuggestNextTask = useCallback(() => {
    if (suggestedTask) {
      handleViewTask(suggestedTask);
    } else {
      setSnackbar({
        open: true,
        message: 'No hay tareas pendientes para sugerir',
        severity: 'info',
      });
    }
  }, [suggestedTask, handleViewTask]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleViewChange = useCallback((newView: 'cards' | 'board') => {
    if (newView === 'board' && !canUseKanbanView) {
      setSnackbar({
        open: true,
        message: 'La vista de tablero solo está disponible en planes Pro y Enterprise',
        severity: 'warning',
      });
      return;
    }
    setView(newView);
  }, [canUseKanbanView]);

  const handleScrollToTop = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Funciones para selección múltiple
  const handleToggleSelectMode = useCallback(() => {
    setSelectMode(prev => !prev);
    setSelectedTasks([]);
  }, []);

  const handleSelectTask = useCallback((taskId: string, selected: boolean) => {
    setSelectedTasks(prev => {
      if (selected) {
        return [...prev, taskId];
      } else {
        return prev.filter(id => id !== taskId);
      }
    });
  }, []);

  const handleSelectAllTasks = useCallback(() => {
    if (selectedTasks.length === filteredTasks.length) {
      // Si todas están seleccionadas, deseleccionar todas
      setSelectedTasks([]);
    } else {
      // Seleccionar todas las tareas filtradas
      setSelectedTasks(filteredTasks.map(task => task.id || '').filter(Boolean));
    }
  }, [selectedTasks.length, filteredTasks]);

  const handleDeleteSelectedTasks = useCallback(async () => {
    if (selectedTasks.length === 0) return;
    
    try {
      const success = await deleteTasks(selectedTasks);
      
      if (success) {
        setSnackbar({
          open: true,
          message: `${selectedTasks.length} tareas eliminadas correctamente`,
          severity: 'success',
        });
        
        // Limpiar selección
        setSelectedTasks([]);
        setSelectMode(false);
      } else {
        setSnackbar({
          open: true,
          message: 'Error al eliminar las tareas seleccionadas',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error al eliminar tareas seleccionadas:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar las tareas seleccionadas',
        severity: 'error',
      });
    }
  }, [selectedTasks, deleteTasks]);

  const handleCompleteSelectedTasks = useCallback(async () => {
    if (selectedTasks.length === 0) return;
    
    try {
      const success = await completeTasks(selectedTasks);
      
      if (success) {
        setSnackbar({
          open: true,
          message: `${selectedTasks.length} tareas completadas correctamente`,
          severity: 'success',
        });
        
        // Limpiar selección
        setSelectedTasks([]);
        setSelectMode(false);
      } else {
        setSnackbar({
          open: true,
          message: 'Error al completar las tareas seleccionadas',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error al completar tareas seleccionadas:', error);
      setSnackbar({
        open: true,
        message: 'Error al completar las tareas seleccionadas',
        severity: 'error',
      });
    }
  }, [selectedTasks, completeTasks]);

  // Verificar si el usuario está autenticado y tiene suscripción activa
  if (!user || !subscription) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Debes iniciar sesión para acceder a esta página
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Por favor, inicia sesión o regístrate para gestionar tus tareas.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      ref={contentRef}
      sx={{
        height: '100vh',
        overflow: 'auto',
        background: isDark
          ? `linear-gradient(145deg, ${alpha('#0f172a', 0.9)}, ${alpha('#1e293b', 0.9)})`
          : `linear-gradient(145deg, ${alpha('#f8fafc', 0.9)}, ${alpha('#f1f5f9', 0.9)})`,
        backdropFilter: 'blur(10px)',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderRadius: '3px',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Stack spacing={4}>
            {/* Cabecera */}
            <TaskHeader
              onNewTask={handleOpenTaskDialog}
              onOpenAnalytics={() => setOpenAnalyticsDialog(true)}
              onOpenExport={() => canExportTasks ? setOpenExportDialog(true) : setSnackbar({
                open: true,
                message: 'La exportación de tareas solo está disponible en planes Pro y Enterprise',
                severity: 'warning',
              })}
              onOpenImport={() => canImportTasks ? setOpenImportDialog(true) : setSnackbar({
                open: true,
                message: 'La importación de tareas solo está disponible en planes Pro y Enterprise',
                severity: 'warning',
              })}
              disableNewTask={hasReachedTaskLimit}
              onToggleFilters={() => setShowFilters(prev => !prev)}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onToggleSelectMode={handleToggleSelectMode}
              selectMode={selectMode}
              selectedCount={selectedTasks.length}
              totalCount={filteredTasks.length}
              onSelectAll={handleSelectAllTasks}
              onDeleteSelected={handleDeleteSelectedTasks}
              onCompleteSelected={handleCompleteSelectedTasks}
            />

            {/* Atajos de teclado */}
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: isDark 
                      ? `rgba(255, 255, 255, 0.03)`
                      : `rgba(255, 255, 255, 0.7)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.03)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LightbulbOutlinedIcon 
                      sx={{ 
                        fontSize: 24, 
                        color: theme.palette.warning.main,
                      }} 
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Atajos de teclado: 
                        <Chip 
                          size="small" 
                          icon={<KeyboardCommandKeyIcon fontSize="small" />} 
                          label="N" 
                          sx={{ mx: 0.5, fontWeight: 600 }} 
                        /> 
                        para nueva tarea, 
                        <Chip 
                          size="small" 
                          label="/" 
                          sx={{ mx: 0.5, fontWeight: 600 }} 
                        /> 
                        para buscar,
                        <Chip 
                          size="small" 
                          label="ESC" 
                          sx={{ mx: 0.5, fontWeight: 600 }} 
                        /> 
                        para salir del modo selección
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => setShowTip(false)}
                    sx={{ 
                      color: theme.palette.text.secondary,
                      '&:hover': { color: theme.palette.text.primary }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </motion.div>
            )}

            {/* Estadísticas */}
            {loading ? (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ width: '100%', mb: 4 }}
              >
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rectangular"
                    width="100%"
                    height={120}
                    sx={{ borderRadius: '24px' }}
                  />
                ))}
              </Stack>
            ) : (
              <TaskStats />
            )}

            {/* Sugerencia de próxima tarea */}
            {suggestedTask && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: isDark 
                      ? `rgba(255, 255, 255, 0.05)`
                      : `rgba(255, 255, 255, 0.9)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)'}`,
                    boxShadow: isDark
                      ? '0 4px 20px rgba(0, 0, 0, 0.25)'
                      : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      <AutoAwesomeIcon 
                        sx={{ 
                          fontSize: 24, 
                          color: '#fff',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.6 },
                          },
                        }} 
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Sugerencia de próxima tarea
                      </Typography>
                      <Typography variant="body1" sx={{ maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {suggestedTask.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleSuggestNextTask}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      px: 3,
                    }}
                  >
                    Ver detalles
                  </Button>
                </Paper>
              </motion.div>
            )}

            {/* Filtros */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskFiltersComponent
                    filters={filters}
                    onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters } as typeof prev))}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pestañas para cambiar de vista */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TaskTabs 
                view={view} 
                onViewChange={handleViewChange} 
                disableBoardView={!canUseKanbanView}
              />
              
              {/* Acciones de selección múltiple */}
              {selectMode && (
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Completar seleccionadas">
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      disabled={selectedTasks.length === 0}
                      onClick={handleCompleteSelectedTasks}
                      startIcon={<CheckCircleOutlineIcon />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                      }}
                    >
                      Completar ({selectedTasks.length})
                    </Button>
                  </Tooltip>
                  <Tooltip title="Eliminar seleccionadas">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={selectedTasks.length === 0}
                      onClick={handleDeleteSelectedTasks}
                      startIcon={<DeleteSweepIcon />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                      }}
                    >
                      Eliminar ({selectedTasks.length})
                    </Button>
                  </Tooltip>
                </Stack>
              )}
            </Box>

            {/* Lista de tareas */}
            {loading ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: '24px' }}
                  />
                ))}
              </Box>
            ) : filteredTasks.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {view === 'cards' ? (
                    <TaskCards
                      tasks={filteredTasks}
                      onEdit={handleEditTask} 
                      onDelete={handleDeleteTask}
                      onComplete={handleCompleteTask}
                      onView={handleViewTask}
                      selectMode={selectMode}
                      selectedTasks={selectedTasks}
                      onSelectTask={handleSelectTask}
                    />


                  ) : (
                    <TaskBoardView
                      tasks={filteredTasks}
                      onEdit={handleEditTask} 
                      onDelete={handleDeleteTask}
                      onComplete={handleCompleteTask}
                      onView={handleViewTask}
                      onMoveTask={handleMoveTask}
                      selectMode={selectMode}
                      selectedTasks={selectedTasks}
                      onSelectTask={handleSelectTask}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  px: 3,
                  borderRadius: '24px',
                  background: isDark 
                    ? `rgba(255, 255, 255, 0.03)`
                    : `rgba(255, 255, 255, 0.7)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)'}`,
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <SearchIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  No hay tareas que coincidan con los filtros
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Intenta cambiar los filtros o crea una nueva tarea
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(true)}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Cambiar filtros
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenTaskDialog}
                    disabled={hasReachedTaskLimit}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      px: 3,
                    }}
                  >
                    Nueva Tarea
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Mensaje de límite de plan */}
            {hasReachedTaskLimit && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  background: `${theme.palette.warning.main}20`,
                  border: `1px solid ${theme.palette.warning.main}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Has alcanzado el límite de {planLimits.activeTasks} tareas para tu plan. Actualiza para tareas ilimitadas.
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  href="/pricing"
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Actualizar Plan
                </Button>
              </Paper>
            )}

            {/* Botón flotante para nueva tarea */}
            <Zoom in={!isMobile && !selectMode}>
              <Fab
                color="primary"
                aria-label="nueva tarea"
                onClick={handleOpenTaskDialog}
                disabled={hasReachedTaskLimit}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                  zIndex: 10,
                }}
              >
                <AddIcon />
              </Fab>
            </Zoom>

            {/* Botón para refrescar */}
            <Zoom in={!isMobile && !refreshing}>
              <Tooltip title="Refrescar datos">
                <Fab
                  size="medium"
                  color="default"
                  aria-label="refrescar"
                  onClick={handleRefresh}
                  sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 100,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    background: isDark 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      background: isDark 
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(255, 255, 255, 1)',
                    },
                    zIndex: 10,
                  }}
                >
                  <RefreshIcon />
                </Fab>
              </Tooltip>
            </Zoom>

            {/* Indicador de carga durante el refresco */}
            <Zoom in={refreshing}>
              <Fab
                size="medium"
                color="primary"
                aria-label="cargando"
                disabled
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 100,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                }}
              >
                <CircularProgress size={24} color="inherit" />
              </Fab>
            </Zoom>

            {/* Botón para volver arriba */}
            <Zoom in={showScrollTop}>
              <Fab
                size="small"
                color="default"
                aria-label="volver arriba"
                onClick={handleScrollToTop}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: isMobile ? 24 : 176,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    background: isDark 
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 1)',
                  },
                  zIndex: 10,
                }}
              >
                <ArrowUpwardIcon fontSize="small" />
              </Fab>
            </Zoom>
          </Stack>
        </motion.div>
      </Container>

      {/* Diálogos */}
      <AddTaskModal
        open={openTaskDialog}
        onClose={() => setOpenTaskDialog(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        isEditMode={isEditMode}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={selectedTask?.title || ''}
      />

      <TaskExportDialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        onExport={handleExport}
        tasksCount={selectedTasks.length > 0 ? selectedTasks.length : filteredTasks.length}
      />

      <TaskImportDialog
        open={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onImport={handleImport}
      />

      <TaskAnalyticsDialog
        open={openAnalyticsDialog}
        onClose={() => setOpenAnalyticsDialog(false)}
        tasks={tasks}
      />

      <TaskViewDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        task={selectedTask}
        onEdit={() => {
          setOpenViewDialog(false);
          setIsEditMode(true);
          setOpenTaskDialog(true);
        }}
        onDelete={() => {
          setOpenViewDialog(false);
          if (selectedTask && selectedTask.id) {
            handleDeleteTask(selectedTask.id);
          }
        }}
        onComplete={() => {
          if (selectedTask && selectedTask.id) {
            handleCompleteTask(selectedTask.id);
            setOpenViewDialog(false);
          }
        }}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}