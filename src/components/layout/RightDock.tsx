'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Collapse,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  ExpandLess,
  ExpandMore,
  Add,
  DragIndicator,
  Email,
  Event,
  Person,
  Close,
} from '@mui/icons-material';
import { CEOAlert, CEOTask } from '@/types/ceo';

interface RightDockProps {
  criticalAlerts: CEOAlert[];
  importantAlerts: CEOAlert[];
  tasks: CEOTask[];
  onTaskUpdate: (taskId: string, updates: Partial<CEOTask>) => void;
  onTaskCreate: () => void;
  onAlertDismiss: (alertId: string) => void;
}

export default function RightDock({
  criticalAlerts,
  importantAlerts,
  tasks,
  onTaskCreate,
  onAlertDismiss
}: RightDockProps) {
  const theme = useTheme();
  const [criticalExpanded, setCriticalExpanded] = useState(true);
  const [importantExpanded, setImportantExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'financiero':
      case 'operativo':
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'compliance':
        return <Error sx={{ color: theme.palette.error.main }} />;
      default:
        return <Info sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'crítica': return theme.palette.error.main;
      case 'alta': return theme.palette.warning.main;
      case 'media': return theme.palette.info.main;
      case 'baja': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return theme.palette.error.main;
      case 'media': return theme.palette.warning.main;
      case 'baja': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getCategoryTasks = (categoria: 'hoy' | 'semana' | 'mes') => {
    return tasks.filter(task => task.categoria === categoria && task.estado !== 'completada');
  };

  const handleTaskAction = (task: CEOTask, action: 'enviarCorreo' | 'crearReunion' | 'asignarAlguien') => {
    console.log(`Executing ${action} for task:`, task.titulo);
    // Here you would implement the actual action
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80, // Below topbar
        right: 0,
        width: 380,
        height: 'calc(100vh - 80px)',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #1a1d29 0%, #252a3a 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
        borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        overflow: 'hidden',
      }}
    >
      {/* Critical Alerts Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'transparent',
          borderRadius: 0,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => setCriticalExpanded(!criticalExpanded)}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Error />
              <Typography variant="subtitle1" fontWeight="bold">
                Alertas Críticas
              </Typography>
              <Badge badgeContent={criticalAlerts.length} color="warning" />
            </Box>
            {criticalExpanded ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </Box>
        
        <Collapse in={criticalExpanded}>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {criticalAlerts.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay alertas críticas
                </Typography>
              </Box>
            ) : (
              <List dense>
                {criticalAlerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    sx={{
                      borderLeft: `4px solid ${getUrgencyColor(alert.urgencia)}`,
                      '&:hover': {
                        background: alpha(theme.palette.error.main, 0.05),
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getAlertIcon(alert.tipo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {alert.titulo}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {alert.descripcion.substring(0, 60)}...
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={() => onAlertDismiss(alert.id)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Important Alerts Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'transparent',
          borderRadius: 0,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => setImportantExpanded(!importantExpanded)}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Warning />
              <Typography variant="subtitle1" fontWeight="bold">
                Alertas Importantes
              </Typography>
              <Badge badgeContent={importantAlerts.length} color="info" />
            </Box>
            {importantExpanded ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </Box>
        
        <Collapse in={importantExpanded}>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {importantAlerts.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay alertas importantes
                </Typography>
              </Box>
            ) : (
              <List dense>
                {importantAlerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    sx={{
                      borderLeft: `4px solid ${getUrgencyColor(alert.urgencia)}`,
                      '&:hover': {
                        background: alpha(theme.palette.warning.main, 0.05),
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getAlertIcon(alert.tipo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {alert.titulo}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {alert.descripcion.substring(0, 60)}...
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={() => onAlertDismiss(alert.id)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Tasks Kanban Section */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => setTasksExpanded(!tasksExpanded)}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircle />
              <Typography variant="subtitle1" fontWeight="bold">
                Tareas
              </Typography>
              <Badge badgeContent={tasks.filter(t => t.estado !== 'completada').length} color="secondary" />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title="Nueva tarea">
                <IconButton size="small" onClick={onTaskCreate} sx={{ color: 'white' }}>
                  <Add />
                </IconButton>
              </Tooltip>
              {tasksExpanded ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </Box>
        </Box>

        <Collapse in={tasksExpanded} sx={{ flex: 1 }}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
            {/* Today Tasks */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
                Hoy ({getCategoryTasks('hoy').length})
              </Typography>
              <List dense>
                {getCategoryTasks('hoy').map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      background: alpha(getPriorityColor(task.prioridad), 0.1),
                      border: `1px solid ${alpha(getPriorityColor(task.prioridad), 0.2)}`,
                    }}
                  >
                    <ListItemIcon>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {task.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {task.descripcion}
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5}>
                            {task.etiquetas.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            ))}
                          </Box>
                          <Box display="flex" gap={0.5} mt={1}>
                            {task.acciones.enviarCorreo && (
                              <Tooltip title="Enviar correo">
                                <IconButton
                                  size="small"
                                  onClick={() => handleTaskAction(task, 'enviarCorreo')}
                                >
                                  <Email fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {task.acciones.crearReunion && (
                              <Tooltip title="Crear reunión">
                                <IconButton
                                  size="small"
                                  onClick={() => handleTaskAction(task, 'crearReunion')}
                                >
                                  <Event fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {task.acciones.asignarAlguien && (
                              <Tooltip title="Asignar a alguien">
                                <IconButton
                                  size="small"
                                  onClick={() => handleTaskAction(task, 'asignarAlguien')}
                                >
                                  <Person fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Week Tasks */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
                Esta Semana ({getCategoryTasks('semana').length})
              </Typography>
              <List dense>
                {getCategoryTasks('semana').map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      background: alpha(getPriorityColor(task.prioridad), 0.1),
                      border: `1px solid ${alpha(getPriorityColor(task.prioridad), 0.2)}`,
                    }}
                  >
                    <ListItemIcon>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {task.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {task.descripcion}
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5}>
                            {task.etiquetas.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Month Tasks */}
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
                Este Mes ({getCategoryTasks('mes').length})
              </Typography>
              <List dense>
                {getCategoryTasks('mes').map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      background: alpha(getPriorityColor(task.prioridad), 0.1),
                      border: `1px solid ${alpha(getPriorityColor(task.prioridad), 0.2)}`,
                    }}
                  >
                    <ListItemIcon>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {task.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {task.descripcion}
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5}>
                            {task.etiquetas.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
