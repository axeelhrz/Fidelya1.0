'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckSquare, 
  Plus, 
  Filter, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  Clock, 
  User, 
  Calendar, 
  Search,
  X,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAlerts, useTasks, updateAlert, createTask, updateTask, deleteTask } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AlertsTasksDock() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'alerts' | 'tasks'>('alerts');
  const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignedTo: '',
    dueDate: ''
  });
  
  const { alerts, loading: alertsLoading } = useAlerts();
  const { tasks, loading: tasksLoading } = useTasks();

  // Función para marcar alerta como leída
  const markAlertAsRead = async (alertId: string) => {
    if (!user?.centerId) return;
    
    try {
      await updateAlert(user.centerId, alertId, { isRead: true });
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  // Función para crear nueva tarea
  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !user?.centerId) return;
    
    try {
      await createTask(user.centerId, {
        ...newTask,
        status: 'todo',
        dueDate: new Date(newTask.dueDate),
        category: 'administrative'
      });
      
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        dueDate: ''
      });
      setShowNewTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Función para actualizar estado de tarea
  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    if (!user?.centerId) return;
    
    try {
      await updateTask(user.centerId, taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Función para eliminar tarea
  const handleDeleteTask = async (taskId: string) => {
    if (!user?.centerId) return;
    
    try {
      await deleteTask(user.centerId, taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle size={16} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={16} color="#F59E0B" />;
      default:
        return <Info size={16} color="#3B82F6" />;
    }
  };

  const getAlertBgColor = (level: string) => {
    switch (level) {
      case 'critical':
        return '#FEF2F2';
      case 'warning':
        return '#FFFBEB';
      default:
        return '#EFF6FF';
    }
  };

  const getAlertBorderColor = (level: string) => {
    switch (level) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: '#EF4444', text: 'white' };
      case 'medium':
        return { bg: '#F59E0B', text: 'white' };
      default:
        return { bg: '#E5E7EB', text: '#6B7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return { bg: '#10B981', text: 'white' };
      case 'in-progress':
        return { bg: '#2463EB', text: 'white' };
      default:
        return { bg: '#E5E7EB', text: '#6B7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Completada';
      case 'in-progress':
        return 'En Progreso';
      default:
        return 'Pendiente';
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filtro por búsqueda
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filtro por fecha
    if (taskFilter === 'all') return true;
    
    const now = new Date();
    const taskDate = new Date(task.dueDate);
    
    switch (taskFilter) {
      case 'today':
        return taskDate.toDateString() === now.toDateString();
      case 'week':
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return taskDate <= weekFromNow;
      case 'month':
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return taskDate <= monthFromNow;
      default:
        return true;
    }
  });

  const filteredAlerts = alerts.filter(alert => {
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;
  const pendingTasksCount = tasks.filter(task => task.status !== 'done').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        width: '380px',
        height: '85vh',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header con tabs */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          background: 'rgba(249, 250, 251, 0.8)',
          borderRadius: '12px',
          padding: '0.25rem'
        }}>
          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'alerts' ? 'white' : 'transparent',
              color: activeTab === 'alerts' ? '#2463EB' : '#6B7280',
              boxShadow: activeTab === 'alerts' ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Bell size={16} />
            <span>Alertas</span>
            {unreadAlertsCount > 0 && (
              <span style={{
                backgroundColor: '#EF4444',
                color: 'white',
                fontSize: '0.75rem',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600
              }}>
                {unreadAlertsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'tasks' ? 'white' : 'transparent',
              color: activeTab === 'tasks' ? '#2463EB' : '#6B7280',
              boxShadow: activeTab === 'tasks' ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <CheckSquare size={16} />
            <span>Tareas</span>
            {pendingTasksCount > 0 && (
              <span style={{
                backgroundColor: '#2463EB',
                color: 'white',
                fontSize: '0.75rem',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600
              }}>
                {pendingTasksCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Buscador y filtros */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
        flexShrink: 0
      }}>
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6B7280'
          }} />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'alerts' ? 'alertas' : 'tareas'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              background: 'rgba(249, 250, 251, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>

        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#6B7280" />
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              style={{
                flex: 1,
                fontSize: '0.75rem',
                background: 'rgba(249, 250, 251, 0.8)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <option value="all">Todas las tareas</option>
              <option value="today">Vencen hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
            
            <button 
              onClick={() => setShowNewTaskForm(true)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                background: '#2463EB',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Plus size={16} color="white" />
            </button>
          </div>
        )}
      </div>

      {/* Formulario nueva tarea */}
      <AnimatePresence>
        {showNewTaskForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <div style={{ padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Nueva Tarea</h4>
                <button
                  onClick={() => setShowNewTaskForm(false)}
                  style={{
                    padding: '0.25rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#6B7280" />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                
                <textarea
                  placeholder="Descripción"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={2}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '6px',
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
                      border: '1px solid rgba(229, 231, 235, 0.6)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                  
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid rgba(229, 231, 235, 0.6)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Asignado a"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleCreateTask}
                    disabled={!newTask.title.trim()}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: 'none',
                      borderRadius: '6px',
                      background: newTask.title.trim() ? '#2463EB' : '#E5E7EB',
                      color: newTask.title.trim() ? 'white' : '#9CA3AF',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: newTask.title.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Crear
                  </button>
                  <button
                    onClick={() => setShowNewTaskForm(false)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid rgba(229, 231, 235, 0.6)',
                      borderRadius: '6px',
                      background: 'white',
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido con scroll interno */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 1.5rem',
        minHeight: 0
      }}>
        <AnimatePresence mode="wait">
          {activeTab === 'alerts' ? (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              {alertsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #E5E7EB',
                    borderTop: '3px solid #2463EB',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }} />
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Cargando alertas...</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Bell size={32} color="#9CA3AF" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    No hay alertas
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => markAlertAsRead(alert.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: getAlertBgColor(alert.level),
                      borderLeft: `4px solid ${getAlertBorderColor(alert.level)}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: alert.isRead ? 0.7 : 1,
                      position: 'relative'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      {getAlertIcon(alert.level)}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1C1E21',
                            lineHeight: 1.3,
                            fontFamily: 'Inter, sans-serif',
                            margin: 0,
                            wordBreak: 'break-word'
                          }}>
                            {alert.title}
                          </h4>
                          {alert.actionUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(alert.actionUrl, '_blank');
                              }}
                              style={{
                                padding: '0.25rem',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                marginLeft: '0.5rem'
                              }}
                            >
                              <ExternalLink size={14} color="#6B7280" />
                            </button>
                          )}
                        </div>
                        
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginBottom: '0.75rem',
                          lineHeight: 1.4,
                          fontFamily: 'Inter, sans-serif',
                          wordBreak: 'break-word'
                        }}>
                          {alert.description}
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} color="#9CA3AF" />
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#9CA3AF',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {format(alert.timestamp, 'HH:mm', { locale: es })}
                            </span>
                          </div>
                          
                          {!alert.isRead && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: getAlertBorderColor(alert.level)
                            }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              {tasksLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #E5E7EB',
                    borderTop: '3px solid #2463EB',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }} />
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Cargando tareas...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckSquare size={32} color="#9CA3AF" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {searchQuery ? 'No se encontraron tareas' : 'No hay tareas'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(229, 231, 235, 0.6)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: task.status === 'done' ? 0.7 : 1,
                      position: 'relative'
                    }}
                    whileHover={{
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      borderColor: 'rgba(209, 213, 219, 0.8)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1C1E21',
                        flex: 1,
                        lineHeight: 1.3,
                        fontFamily: 'Inter, sans-serif',
                        margin: 0,
                        wordBreak: 'break-word',
                        paddingRight: '0.5rem'
                      }}>
                        {task.title}
                      </h4>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: getPriorityColor(task.priority).bg,
                          color: getPriorityColor(task.priority).text,
                          fontFamily: 'Inter, sans-serif',
                          whiteSpace: 'nowrap'
                        }}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                    </div>
                    
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginBottom: '0.75rem',
                      lineHeight: 1.4,
                      fontFamily: 'Inter, sans-serif',
                      wordBreak: 'break-word'
                    }}>
                      {task.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={12} color="#6B7280" />
                        <span style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{task.assignedTo}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} color="#6B7280" />
                        <span style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                          {format(task.dueDate, 'dd/MM', { locale: es })}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: getStatusColor(task.status).bg,
                        color: getStatusColor(task.status).text,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {getStatusText(task.status)}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {task.status !== 'done' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(task.id, task.status === 'todo' ? 'in-progress' : 'done');
                            }}
                            style={{
                              padding: '0.25rem',
                              border: 'none',
                              background: '#10B981',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={12} color="white" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                              handleDeleteTask(task.id);
                            }
                          }}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            background: '#EF4444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={12} color="white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(209, 213, 219, 0.6);
          border-radius: 3px;
          transition: all 0.2s ease;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </motion.div>
  );
}