'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import {
  CheckCircle,
  AccessTime,
  PriorityHigh,
  MoreVert,
  Refresh,
  FileDownload,
  Add,
  FilterList,
  Flag
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';

// Types for tasks
interface TaskProgress {
  completed: number;
  pending: number;
  overdue: number;
  totalTasks: number;
  completionRate: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

const TasksProgress = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({
    completed: 0,
    pending: 0,
    overdue: 0,
    totalTasks: 0,
    completionRate: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    if (!user?.uid) return;

    // Real-time subscription to task data from Firestore
    const unsubscribe = onSnapshot(
      collection(db, `users/${user.uid}/dashboard`),
      (snapshot) => {
        const kpisDoc = snapshot.docs.find(doc => doc.id === 'kpis');
        
        if (kpisDoc) {
          const kpisData = kpisDoc.data();
          const completed = kpisData.completedTasks || 0;
          const pending = kpisData.pendingTasks || 0;
          const overdue = kpisData.overdueTasks || 0;
          const highPriority = kpisData.highPriorityTasks || 0;
          const mediumPriority = kpisData.mediumPriorityTasks || 0;
          const lowPriority = kpisData.lowPriorityTasks || 0;
          const totalTasks = completed + pending + overdue;
          
          setTaskProgress({
            completed,
            pending,
            overdue,
            totalTasks,
            completionRate: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
            highPriority,
            mediumPriority,
            lowPriority
          });
        }
        
        setIsLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    // The data will be refreshed automatically via the Firestore subscription
    handleMenuClose();
  };

  // Handle export as image
  const handleExportChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
          scale: 2
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'progreso-tareas.png';
        link.click();
      } catch (error) {
        console.error('Error exporting chart:', error);
      }
    }
    handleMenuClose();
  };

  // Handle add new task
  const handleAddTask = () => {
    router.push('/dashboard/tasks?action=create');
    handleMenuClose();
  };

  // Handle view all tasks
  const handleViewAllTasks = () => {
    router.push('/dashboard/tasks');
    handleMenuClose();
  };

  // Animation for the component
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Animation for the progress bar
  const progressVariants = {
    hidden: { width: '0%' },
    visible: (value: number) => ({
      width: `${value}%`,
      transition: {
        duration: 1.5,
        ease: 'easeOut'
      }
    })
  };

  // Animation for the stat cards
  const statCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      ref={chartRef}
      sx={{
        height: 'auto', // Changed from fixed height to auto
        minHeight: 350,
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Progreso de Tareas
            </Typography>
            {refreshing && (
              <Box sx={{ display: 'inline-flex', ml: 1 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Refresh fontSize="small" color="primary" />
                </motion.div>
              </Box>
            )}
          </Stack>
        }
        action={
          <Box>
            <Tooltip title="Opciones">
              <IconButton 
                onClick={handleMenuClick}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 200,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleAddTask}>
                <ListItemIcon>
                  <Add fontSize="small" />
                </ListItemIcon>
                <ListItemText>Nueva tarea</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleViewAllTasks}>
                <ListItemIcon>
                  <FilterList fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ver todas las tareas</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleRefresh}>
                <ListItemIcon>
                  <Refresh fontSize="small" />
                </ListItemIcon>
                <ListItemText>Actualizar datos</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleExportChart}>
                <ListItemIcon>
                  <FileDownload fontSize="small" />
                </ListItemIcon>
                <ListItemText>Exportar como imagen</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      <CardContent sx={{ pb: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Stack spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Typography variant="body2" color="text.secondary">
                Cargando datos...
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Summary section with total tasks and completion rate */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {taskProgress.totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tareas totales
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      style={{ display: 'inline-block' }}
                    >
                      <Typography 
                        variant="h4" 
                        fontWeight={700} 
                        color={
                          taskProgress.completionRate >= 75 ? 'success.main' :
                          taskProgress.completionRate >= 50 ? 'primary.main' :
                          taskProgress.completionRate >= 25 ? 'warning.main' : 'error.main'
                        }
                      >
                        {taskProgress.completionRate}%
                      </Typography>
                    </motion.div>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de finalización
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Progress bar section */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Progreso general
                </Typography>
              </Stack>
              <Box sx={{ position: 'relative', height: 12, borderRadius: 6, bgcolor: alpha(theme.palette.primary.main, 0.1), overflow: 'hidden' }}>
                <Box
                  component={motion.div}
                  custom={taskProgress.completionRate}
                  variants={progressVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`
                  }}
                />
              </Box>
            </Box>

            {/* Task status cards */}
            <Stack direction="row" spacing={2}>
              {/* Completed tasks */}
              <motion.div
                custom={0}
                variants={statCardVariants}
                initial="hidden"
                animate="visible"
                style={{ flex: 1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    height: '100%',
                    borderRadius: 3,
                    background: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px ${alpha(theme.palette.success.main, 0.1)}`
                    }
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main
                      }}
                    >
                      <CheckCircle />
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="success.main">
                      {taskProgress.completed}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} textAlign="center">
                      Completadas
                    </Typography>
                  </Stack>
                </Paper>
              </motion.div>

              {/* Pending tasks */}
              <motion.div
                custom={1}
                variants={statCardVariants}
                initial="hidden"
                animate="visible"
                style={{ flex: 1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    height: '100%',
                    borderRadius: 3,
                    background: alpha(theme.palette.warning.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px ${alpha(theme.palette.warning.main, 0.1)}`
                    }
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main
                      }}
                    >
                      <AccessTime />
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="warning.main">
                      {taskProgress.pending}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} textAlign="center">
                      Pendientes
                    </Typography>
                  </Stack>
                </Paper>
              </motion.div>

              {/* Overdue tasks */}
              <motion.div
                custom={2}
                variants={statCardVariants}
                initial="hidden"
                animate="visible"
                style={{ flex: 1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    height: '100%',
                    borderRadius: 3,
                    background: alpha(theme.palette.error.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px ${alpha(theme.palette.error.main, 0.1)}`
                    }
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main
                      }}
                    >
                      <PriorityHigh />
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="error.main">
                      {taskProgress.overdue}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} textAlign="center">
                      Vencidas
                    </Typography>
                  </Stack>
                </Paper>
              </motion.div>
            </Stack>

            {/* Priority distribution */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Distribución por prioridad
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 0.5,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.background.paper, 0.5)
                  }}
                >
                  <Flag fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="caption" fontWeight={500}>
                    {taskProgress.totalTasks} tareas
                  </Typography>
                </Box>
              </Stack>

              {/* Priority bar */}
              <Box
                sx={{
                  height: 16,
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
                }}
              >
                {taskProgress.highPriority > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(taskProgress.highPriority / taskProgress.totalTasks) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <Box
                      sx={{
                        bgcolor: theme.palette.error.main,
                        height: '100%',
                        width: '100%'
                      }}
                    />
                  </motion.div>
                )}
                {taskProgress.mediumPriority > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(taskProgress.mediumPriority / taskProgress.totalTasks) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  >
                    <Box
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        height: '100%',
                        width: '100%'
                      }}
                    />
                  </motion.div>
                )}
                {taskProgress.lowPriority > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(taskProgress.lowPriority / taskProgress.totalTasks) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  >
                    <Box
                      sx={{
                        bgcolor: theme.palette.success.main,
                        height: '100%',
                        width: '100%'
                      }}
                    />
                  </motion.div>
                )}
              </Box>

              {/* Priority legend */}
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    flex: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: theme.palette.error.main,
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" fontWeight={500}>
                    Alta: {taskProgress.highPriority}
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    flex: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: theme.palette.warning.main,
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" fontWeight={500}>
                    Media: {taskProgress.mediumPriority}
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    flex: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: theme.palette.success.main,
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" fontWeight={500}>
                    Baja: {taskProgress.lowPriority}
                  </Typography>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksProgress;