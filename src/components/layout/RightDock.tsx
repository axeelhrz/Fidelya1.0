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
  Button,
  Divider,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Warning,
  Info,
  CheckCircle,
  ExpandLess,
  ExpandMore,
  Close,
  Add,
  DragIndicator,
  Email,
  Event,
  Person,
  PlayArrow,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { CEOAlert, CEOTask } from '@/types/ceo';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

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
  onTaskUpdate,
  onTaskCreate,
  onAlertDismiss,
}: RightDockProps) {
  const theme = useTheme();
  const [criticalOpen, setCriticalOpen] = useState(true);
  const [importantOpen, setImportantOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'crítica': return '#ef4444';
      case 'alta': return '#f59e0b';
      case 'media': return ceoBrandColors.accentBlue;
      default: return ceoBrandColors.text;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return ceoBrandColors.text;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hoy': return '#ef4444';
      case 'semana': return '#f59e0b';
      case 'mes': return '#10b981';
      default: return ceoBrandColors.text;
    }
  };

  const handleTaskAction = (task: CEOTask, action: string) => {
    switch (action) {
      case 'complete':
        onTaskUpdate(task.id, { estado: 'completada' });
        break;
      case 'email':
        console.log('Sending email for task:', task.id);
        break;
      case 'meeting':
        console.log('Creating meeting for task:', task.id);
        break;
      case 'assign':
        console.log('Assigning task:', task.id);
        break;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: { xs: 0, lg: 400 },
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
        zIndex: 50,
        overflow: 'auto',
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
            color: ceoBrandColors.text,
            mb: 3,
          }}
        >
          🎯 Centro de Comando
        </Typography>

        {/* Alertas Críticas */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${alpha('#ef4444', 0.2)}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              background: alpha('#ef4444', 0.1),
              borderRadius: '12px 12px 0 0',
              cursor: 'pointer',
            }}
            onClick={() => setCriticalOpen(!criticalOpen)}
          >
            <Box display="flex" alignItems="center" justifyContent="between">
              <Box display="flex" alignItems="center" gap={1}>
                <Warning sx={{ color: '#ef4444', fontSize: 20 }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                    color: ceoBrandColors.text,
                  }}
                >
                  Alertas Críticas
                </Typography>
                <Badge badgeContent={criticalAlerts.length} color="error" />
              </Box>
              {criticalOpen ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </Box>
          
          <Collapse in={criticalOpen}>
            <Box sx={{ p: 2 }}>
              {criticalAlerts.length === 0 ? (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 300,
                    color: alpha(ceoBrandColors.text, 0.6),
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  Sin alertas críticas
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {criticalAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          background: alpha('#ef4444', 0.05),
                          border: `1px solid ${alpha('#ef4444', 0.1)}`,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 600,
                                color: ceoBrandColors.text,
                              }}
                            >
                              {alert.titulo}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 300,
                                color: alpha(ceoBrandColors.text, 0.7),
                              }}
                            >
                              {alert.descripcion}
                            </Typography>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => onAlertDismiss(alert.id)}
                          sx={{ ml: 1 }}
                        >
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </Box>
          </Collapse>
        </Paper>

        {/* Alertas Importantes */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${alpha('#f59e0b', 0.2)}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              background: alpha('#f59e0b', 0.1),
              borderRadius: '12px 12px 0 0',
              cursor: 'pointer',
            }}
            onClick={() => setImportantOpen(!importantOpen)}
          >
            <Box display="flex" alignItems="center" justifyContent="between">
              <Box display="flex" alignItems="center" gap={1}>
                <Info sx={{ color: '#f59e0b', fontSize: 20 }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                    color: ceoBrandColors.text,
                  }}
                >
                  Importantes
                </Typography>
                <Badge badgeContent={importantAlerts.length} color="warning" />
              </Box>
              {importantOpen ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </Box>
          
          <Collapse in={importantOpen}>
            <Box sx={{ p: 2 }}>
              {importantAlerts.length === 0 ? (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 300,
                    color: alpha(ceoBrandColors.text, 0.6),
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  Sin alertas importantes
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {importantAlerts.slice(0, 3).map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          background: alpha('#f59e0b', 0.05),
                          border: `1px solid ${alpha('#f59e0b', 0.1)}`,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 600,
                                color: ceoBrandColors.text,
                              }}
                            >
                              {alert.titulo}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 300,
                                color: alpha(ceoBrandColors.text, 0.7),
                              }}
                            >
                              {alert.descripcion}
                            </Typography>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => onAlertDismiss(alert.id)}
                          sx={{ ml: 1 }}
                        >
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </Box>
          </Collapse>
        </Paper>

        {/* Tareas Kanban */}
        <Paper
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              background: alpha(ceoBrandColors.primary, 0.1),
              borderRadius: '12px 12px 0 0',
              cursor: 'pointer',
            }}
            onClick={() => setTasksOpen(!tasksOpen)}
          >
            <Box display="flex" alignItems="center" justifyContent="between">
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle sx={{ color: ceoBrandColors.primary, fontSize: 20 }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                    color: ceoBrandColors.text,
                  }}
                >
                  Tareas Ejecutivas
                </Typography>
                <Badge badgeContent={tasks.filter(t => t.estado === 'pendiente').length} color="primary" />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onTaskCreate(); }}>
                  <Add sx={{ fontSize: 16 }} />
                </IconButton>
                {tasksOpen ? <ExpandLess /> : <ExpandMore />}
              </Box>
            </Box>
          </Box>
          
          <Collapse in={tasksOpen}>
            <Box sx={{ p: 2 }}>
              {/* Categorías de tareas */}
              {['hoy', 'semana', 'mes'].map((category) => {
                const categoryTasks = tasks.filter(task => task.categoria === category);
                const categoryLabel = category === 'hoy' ? 'Hoy' : category === 'semana' ? 'Esta Semana' : 'Este Mes';
                
                return (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: getCategoryColor(category),
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                          color: ceoBrandColors.text,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {categoryLabel} ({categoryTasks.length})
                      </Typography>
                    </Box>
                    
                    {categoryTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            background: alpha(getPriorityColor(task.prioridad), 0.05),
                            border: `1px solid ${alpha(getPriorityColor(task.prioridad), 0.1)}`,
                            cursor: 'grab',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${alpha(getPriorityColor(task.prioridad), 0.2)}`,
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                            <DragIndicator sx={{ fontSize: 16, color: 'text.secondary', mt: 0.5 }} />
                            <Box flex={1}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontFamily: '"Neris", sans-serif',
                                  fontWeight: 600,
                                  color: ceoBrandColors.text,
                                  mb: 0.5,
                                }}
                              >
                                {task.titulo}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontFamily: '"Neris", sans-serif',
                                  fontWeight: 300,
                                  color: alpha(ceoBrandColors.text, 0.7),
                                  display: 'block',
                                  mb: 1,
                                }}
                              >
                                {task.descripcion}
                              </Typography>
                              
                              <Box display="flex" gap={0.5} mb={1}>
                                <Chip
                                  label={task.prioridad}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    background: getPriorityColor(task.prioridad),
                                    color: 'white',
                                    fontFamily: '"Neris", sans-serif',
                                    fontWeight: 600,
                                  }}
                                />
                                {task.etiquetas.map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.6rem',
                                      fontFamily: '"Neris", sans-serif',
                                      fontWeight: 500,
                                    }}
                                  />
                                ))}
                              </Box>
                              
                              {/* Acciones rápidas */}
                              <Box display="flex" gap={0.5}>
                                <Tooltip title="Marcar como completada">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleTaskAction(task, 'complete')}
                                    sx={{ p: 0.5 }}
                                  >
                                    <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                                  </IconButton>
                                </Tooltip>
                                
                                {task.acciones.enviarCorreo && (
                                  <Tooltip title="Enviar correo">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleTaskAction(task, 'email')}
                                      sx={{ p: 0.5 }}
                                    >
                                      <Email sx={{ fontSize: 16, color: ceoBrandColors.accentBlue }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                
                                {task.acciones.crearReunion && (
                                  <Tooltip title="Crear reunión">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleTaskAction(task, 'meeting')}
                                      sx={{ p: 0.5 }}
                                    >
                                      <Event sx={{ fontSize: 16, color: ceoBrandColors.accentPink }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                
                                {task.acciones.asignarResponsable && (
                                  <Tooltip title="Asignar responsable">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleTaskAction(task, 'assign')}
                                      sx={{ p: 0.5 }}
                                    >
                                      <Person sx={{ fontSize: 16, color: ceoBrandColors.secondary }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                    
                    {categoryTasks.length === 0 && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 300,
                          color: alpha(ceoBrandColors.text, 0.5),
                          textAlign: 'center',
                          py: 2,
                          fontStyle: 'italic',
                        }}
                      >
                        Sin tareas para {categoryLabel.toLowerCase()}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Paper>
      </Box>
    </Box>
  );
}