'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  LinearProgress, 
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
  Badge
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
  FilterList
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

  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      ref={chartRef}
      sx={{
        height: 300,
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
      <CardContent>
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
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Progreso general
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {taskProgress.completionRate}%
                </Typography>
              </Stack>
              <Box sx={{ position: 'relative', height: 10, borderRadius: 5, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
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
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                  }}
                />
              </Box>
            </Box>

            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
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
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Completadas</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {taskProgress.completed}
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={taskProgress.totalTasks > 0 ? (taskProgress.completed / taskProgress.totalTasks) * 100 : 0} 
                    sx={{ 
                      mt: 1, 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.success.main
                      }
                    }}
                  />
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
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
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Pendientes</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {taskProgress.pending}
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={taskProgress.totalTasks > 0 ? (taskProgress.pending / taskProgress.totalTasks) * 100 : 0} 
                    sx={{ 
                      mt: 1, 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.warning.main
                      }
                    }}
                  />
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
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
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Vencidas</Typography>
                    <Badge 
                      badgeContent={taskProgress.overdue} 
                      color="error"
                      sx={{ 
                        '& .MuiBadge-badge': {
                          right: -3,
                          top: 3,
                          border: `2px solid ${theme.palette.background.paper}`,
                          padding: '0 4px',
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {taskProgress.overdue}
                      </Typography>
                    </Badge>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={taskProgress.totalTasks > 0 ? (taskProgress.overdue / taskProgress.totalTasks) * 100 : 0} 
                    sx={{ 
                      mt: 1, 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.error.main
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Stack>

            {/* Priority distribution */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Distribución por prioridad
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                {taskProgress.highPriority > 0 && (
                  <Box 
                    sx={{ 
                      width: `${(taskProgress.highPriority / taskProgress.totalTasks) * 100}%`,
                      bgcolor: theme.palette.error.main,
                      height: '100%'
                    }}
                  />
                )}
                {taskProgress.mediumPriority > 0 && (
                  <Box 
                    sx={{ 
                      width: `${(taskProgress.mediumPriority / taskProgress.totalTasks) * 100}%`,
                      bgcolor: theme.palette.warning.main,
                      height: '100%'
                    }}
                  />
                )}
                {taskProgress.lowPriority > 0 && (
                  <Box 
                    sx={{ 
                      width: `${(taskProgress.lowPriority / taskProgress.totalTasks) * 100}%`,
                      bgcolor: theme.palette.success.main,
                      height: '100%'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.error.main 
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Alta: {taskProgress.highPriority}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.warning.main 
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Media: {taskProgress.mediumPriority}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.success.main 
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Baja: {taskProgress.lowPriority}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksProgress;