'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckSquare, Plus, Filter, AlertTriangle, Info, AlertCircle, Clock, User, Calendar, Search } from 'lucide-react';
import { useAlerts, useTasks } from '@/hooks/useDashboardData';
import { Alert, Task } from '@/types/dashboard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos mock para desarrollo
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Certificado SSL próximo a expirar',
    description: 'El certificado SSL expira en 7 días',
    level: 'critical',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    actionUrl: '/settings/ssl'
  },
  {
    id: '2',
    title: 'Saldo bajo en cuenta principal',
    description: 'Quedan $2,450 en la cuenta operativa',
    level: 'critical',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: '3',
    title: 'Stock bajo: Tests PHQ-9',
    description: 'Quedan 12 unidades, reordenar pronto',
    level: 'warning',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '4',
    title: 'Alta rotación detectada',
    description: '3 terapeutas han solicitado cambio de horario',
    level: 'warning',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: '5',
    title: 'Backup completado exitosamente',
    description: 'Backup automático de base de datos completado',
    level: 'info',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar expedientes pendientes',
    description: 'Validar 15 expedientes que requieren firma',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Dr. García',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Actualizar protocolos COVID',
    description: 'Revisar y actualizar protocolos según nuevas normativas',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Dra. López',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Capacitación nuevo software',
    description: 'Organizar sesión de capacitación para el equipo',
    status: 'todo',
    priority: 'low',
    assignedTo: 'Admin',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    title: 'Renovar licencias software',
    description: 'Renovar licencias de software clínico antes del vencimiento',
    status: 'done',
    priority: 'high',
    assignedTo: 'Admin',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

export default function AlertsTasksDock() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'tasks'>('alerts');
  const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { alerts, loading: alertsLoading } = useAlerts();
  const { tasks, loading: tasksLoading } = useTasks();

  // Usar datos mock si no hay datos de Firebase
  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;
  const displayTasks = tasks.length > 0 ? tasks : mockTasks;

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-error" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-info" />;
    }
  };

  const getAlertBgColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-error-bg border-l-error';
      case 'warning':
        return 'bg-warning-bg border-l-warning';
      default:
        return 'bg-info-bg border-l-info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-inverse';
      case 'medium':
        return 'bg-warning text-inverse';
      default:
        return 'bg-surface-elevated text-secondary border border-border-light';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-success text-inverse';
      case 'in-progress':
        return 'bg-accent text-inverse';
      default:
        return 'bg-surface-elevated text-secondary border border-border-light';
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

  const filteredTasks = displayTasks.filter(task => {
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

  const filteredAlerts = displayAlerts.filter(alert => {
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const unreadAlertsCount = displayAlerts.filter(alert => !alert.isRead).length;
  const pendingTasksCount = displayTasks.filter(task => task.status !== 'done').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface rounded-card border border-border-light shadow-card"
    >
      {/* Header con tabs */}
      <div className="p-4 border-b border-border-light">
        <div className="flex space-x-1 bg-surface-elevated rounded-lg p-1">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all
              ${activeTab === 'alerts' ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'}
            `}
          >
            <Bell className="w-4 h-4" />
            <span>Alertas</span>
            {unreadAlertsCount > 0 && (
              <span className="bg-error text-inverse text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all
              ${activeTab === 'tasks' ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'}
            `}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tareas</span>
            {pendingTasksCount > 0 && (
              <span className="bg-accent text-inverse text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center">
                {pendingTasksCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-border-light">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'alerts' ? 'alertas' : 'tareas'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-elevated rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
        </div>

        {activeTab === 'tasks' && (
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-secondary" />
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value as any)}
              className="flex-1 text-xs bg-surface-elevated border border-border-light rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todas las tareas</option>
              <option value="today">Vencen hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
            
            <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
              <Plus className="w-4 h-4 text-secondary" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'alerts' ? (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-3"
            >
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-secondary">No hay alertas</p>
                </div>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-sm
                      ${getAlertBgColor(alert.level)} ${alert.isRead ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.level)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary text-sm mb-1 line-clamp-1">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-secondary mb-2 line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-tertiary">
                          <Clock className="w-3 h-3" />
                          <span>{format(alert.timestamp, 'HH:mm', { locale: es })}</span>
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
              className="p-4 space-y-3"
            >
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-8 h-8 text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-secondary">No hay tareas</p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      p-3 rounded-lg border border-border-light cursor-pointer transition-all hover:shadow-sm hover:border-border-medium
                      ${task.status === 'done' ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-primary text-sm flex-1 line-clamp-1">
                        {task.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-secondary mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 text-secondary" />
                        <span className="text-secondary">{task.assignedTo}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-secondary" />
                        <span className="text-secondary">
                          {format(task.dueDate, 'dd/MM', { locale: es })}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}