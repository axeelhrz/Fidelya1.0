'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckSquare,
  AlertTriangle,
  Info,
  Plus,
  X,
  Check,
  AlertCircle,
  Calendar,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAlerts, useTasks } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AlertsTasksDock() {
  const { user } = useAuth();
  const { alerts, loading: alertsLoading, error: alertsError, markAsRead, deleteAlert } = useAlerts();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks();
  
  const [activeTab, setActiveTab] = useState<'alerts' | 'tasks'>('alerts');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'administrative' as 'administrative' | 'clinical' | 'financial' | 'marketing',
    dueDate: ''
  });

  // Filtrar alertas no leídas
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const pendingTasks = tasks.filter(task => task.status !== 'done');

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle size={16} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={16} color="#F59E0B" />;
      case 'info':
        return <Info size={16} color="#3B82F6" />;
      default:
        return <Bell size={16} color="#6B7280" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#10B981';
      case 'in-progress':
        return '#3B82F6';
      case 'todo':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        category: newTask.category,
        status: 'todo',
        assignedTo: user?.id || 'current-user',
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días por defecto
      });

      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        category: 'administrative',
        dueDate: ''
      });
      setShowNewTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsRead(alertId);
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  type TaskStatus = 'todo' | 'in-progress' | 'done';

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: '100%',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 4rem)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Card variant="default" style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header con tabs */}
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Centro de Notificaciones
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => window.location.reload()}
            >
              <span className="sr-only">Recargar</span>
            </Button>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => setActiveTab('alerts')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: 'none',
                backgroundColor: activeTab === 'alerts' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'alerts' ? '#2563EB' : '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Bell size={16} />
              Alertas
              {unreadAlerts.length > 0 && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: 'none',
                backgroundColor: activeTab === 'tasks' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'tasks' ? '#2563EB' : '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckSquare size={16} />
              Tareas
              {pendingTasks.length > 0 && (
                <span style={{
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {pendingTasks.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1rem'
        }}>
          <AnimatePresence mode="wait">
            {activeTab === 'alerts' ? (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {alertsLoading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    color: '#6B7280'
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <RefreshCw size={24} />
                    </motion.div>
                  </div>
                ) : alertsError ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#EF4444'
                  }}>
                    <AlertCircle size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      Error cargando alertas
                    </p>
                  </div>
                ) : unreadAlerts.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6B7280'
                  }}>
                    <Bell size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      No hay alertas nuevas
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {unreadAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          backgroundColor: `${getAlertColor(alert.level)}08`,
                          border: `1px solid ${getAlertColor(alert.level)}20`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem'
                        }}>
                          <div style={{ marginTop: '0.125rem' }}>
                            {getAlertIcon(alert.level)}
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.5rem'
                            }}>
                              <h4 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#1C1E21',
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {alert.title}
                              </h4>
                              <span style={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                flexShrink: 0,
                                marginLeft: '0.5rem'
                              }}>
                                {formatTimeAgo(alert.timestamp)}
                              </span>
                            </div>
                            
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              margin: '0 0 0.75rem 0',
                              lineHeight: 1.4,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {alert.description}
                            </p>
                            
                            <div style={{
                              display: 'flex',
                              gap: '0.5rem'
                            }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(alert.id);
                                }}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  border: 'none',
                                  backgroundColor: '#10B981',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Check size={12} />
                                Marcar leída
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAlert(alert.id);
                                }}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  border: 'none',
                                  backgroundColor: '#EF4444',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <X size={12} />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Botón para nueva tarea */}
                <div style={{ marginBottom: '1rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                    style={{ width: '100%' }}
                  >
                    Nueva Tarea
                  </Button>
                </div>

                {/* Formulario nueva tarea */}
                <AnimatePresence>
                  {showNewTaskForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                          type="text"
                          placeholder="Título de la tarea"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #D1D5DB',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                        
                        <textarea
                          placeholder="Descripción (opcional)"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          rows={2}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #D1D5DB',
                            fontSize: '0.875rem',
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #D1D5DB',
                              fontSize: '0.75rem',
                              outline: 'none'
                            }}
                          >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                          </select>
                          
                          <select
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value as 'administrative' | 'clinical' | 'financial' | 'marketing' })}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #D1D5DB',
                              fontSize: '0.75rem',
                              outline: 'none'
                            }}
                          >
                            <option value="administrative">Admin</option>
                            <option value="clinical">Clínica</option>
                            <option value="financial">Financiera</option>
                            <option value="marketing">Marketing</option>
                          </select>
                        </div>
                        
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #D1D5DB',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleCreateTask}
                            disabled={!newTask.title.trim()}
                            style={{ flex: 1 }}
                          >
                            Crear
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowNewTaskForm(false)}
                            style={{ flex: 1 }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lista de tareas */}
                {tasksLoading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    color: '#6B7280'
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <RefreshCw size={24} />
                    </motion.div>
                  </div>
                ) : tasksError ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#EF4444'
                  }}>
                    <AlertCircle size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      Error cargando tareas
                    </p>
                  </div>
                ) : pendingTasks.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6B7280'
                  }}>
                    <CheckSquare size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      No hay tareas pendientes
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pendingTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${getPriorityColor(task.priority)}20`,
                          borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem'
                        }}>
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, task.status === 'todo' ? 'in-progress' : 'done')}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `2px solid ${getStatusColor(task.status)}`,
                              backgroundColor: task.status === 'done' ? getStatusColor(task.status) : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '0.125rem'
                            }}
                          >
                            {task.status === 'done' && <Check size={12} color="white" />}
                          </button>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.5rem'
                            }}>
                              <h4 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#1C1E21',
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textDecoration: task.status === 'done' ? 'line-through' : 'none'
                              }}>
                                {task.title}
                              </h4>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                                style={{
                                  padding: '0.25rem',
                                  borderRadius: '0.25rem',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: '#6B7280',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            {task.description && (
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                margin: '0 0 0.75rem 0',
                                lineHeight: 1.4,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {task.description}
                              </p>
                            )}
                            
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.75rem',
                              color: '#6B7280'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: `${getPriorityColor(task.priority)}20`,
                                  color: getPriorityColor(task.priority),
                                  fontSize: '0.625rem',
                                  fontWeight: 600
                                }}>
                                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                </span>
                                
                                <span style={{
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: '#F3F4F6',
                                  color: '#6B7280',
                                  fontSize: '0.625rem',
                                  fontWeight: 500
                                }}>
                                  {task.category === 'administrative' ? 'Admin' :
                                   task.category === 'clinical' ? 'Clínica' :
                                   task.category === 'financial' ? 'Financiera' : 'Marketing'}
                                </span>
                              </div>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} />
                                {task.dueDate.toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}