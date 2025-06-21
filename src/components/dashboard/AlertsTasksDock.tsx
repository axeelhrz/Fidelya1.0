'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckSquare, Plus, Filter, AlertTriangle, Info, AlertCircle, Clock, User, Calendar } from 'lucide-react';
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
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertBgColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-l-error';
      case 'warning':
        return 'bg-yellow-50 border-l-warning';
      default:
        return 'bg-blue-50 border-l-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-white';
      case 'medium':
        return 'bg-warning text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-success text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
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

  const unreadAlertsCount = displayAlerts.filter(alert => !alert.isRead).length;
  const pendingTasksCount = displayTasks.filter(task => task.status !== 'done').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white rounded-card shadow-card h-fit sticky top-6"
    >
      {/* Header con tabs */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-1 bg-secondary rounded-xl p-1">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'alerts' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}
            `}
          >
            <Bell className="w-4 h-4" />
            <span>Alertas</span>
            {unreadAlertsCount > 0 && (
              <span className="bg-error text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'tasks' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}
            `}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tareas</span>
            {pendingTasksCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                {pendingTasksCount}
              </span>
            )}
          </button>
        </div>
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
              {displayAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    p-3 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-md
                    ${getAlertBgColor(alert.level)} ${alert.isRead ? 'opacity-60' : ''}
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.level)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary text-sm mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-secondary mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-secondary">
                        <Clock className="w-3 h-3" />
                        <span>{format(alert.timestamp, 'HH:mm', { locale: es })}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4"
            >
              {/* Filtros de tareas */}
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-secondary" />
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value as any)}
                  className="text-xs bg-secondary border-none rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>
                
                <button className="ml-auto p-1 rounded-lg hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4 text-secondary" />
                </button>
              </div>

              {/* Lista de tareas */}
              <div className="space-y-3">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      p-3 rounded-xl border border-gray-100 cursor-pointer transition-all hover:shadow-md
                      ${task.status === 'done' ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-primary text-sm flex-1">
                        {task.title}
                      </h4>
                      <div className="flex space-x-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-secondary mb-3">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
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
                    
                    <div className="mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
