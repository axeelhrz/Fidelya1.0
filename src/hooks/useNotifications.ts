'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationFormData, NotificationFilters, NotificationStats, NotificationStatus } from '@/types/notification';

// Mock data para demostración
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nuevo miembro registrado',
    message: 'Juan Pérez se ha registrado como nuevo miembro de la asociación.',
    type: 'success',
    priority: 'medium',
    status: 'unread',
    category: 'membership',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionUrl: '/dashboard/asociacion/members',
    actionLabel: 'Ver miembro',
    metadata: {
      senderName: 'Sistema',
      tags: ['nuevo-miembro', 'registro']
    }
  },
  {
    id: '2',
    title: 'Pago vencido detectado',
    message: 'Se han detectado 5 miembros con pagos vencidos que requieren atención inmediata.',
    type: 'warning',
    priority: 'high',
    status: 'unread',
    category: 'payment',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    actionUrl: '/dashboard/asociacion/expired-members',
    actionLabel: 'Ver miembros vencidos',
    metadata: {
      senderName: 'Sistema de Pagos',
      recipientCount: 5,
      tags: ['pagos', 'vencidos', 'urgente']
    }
  },
  {
    id: '3',
    title: 'Respaldo completado exitosamente',
    message: 'El respaldo automático de la base de datos se ha completado correctamente.',
    type: 'info',
    priority: 'low',
    status: 'read',
    category: 'system',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    metadata: {
      senderName: 'Sistema de Respaldos',
      tags: ['respaldo', 'sistema', 'automático']
    }
  },
  {
    id: '4',
    title: 'Error en importación de datos',
    message: 'La importación del archivo CSV falló. Revise el formato del archivo e intente nuevamente.',
    type: 'error',
    priority: 'high',
    status: 'unread',
    category: 'system',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    actionUrl: '/dashboard/asociacion/import',
    actionLabel: 'Reintentar importación',
    metadata: {
      senderName: 'Sistema de Importación',
      tags: ['error', 'importación', 'csv']
    }
  },
  {
    id: '5',
    title: 'Evento próximo: Asamblea General',
    message: 'Recordatorio: La Asamblea General Ordinaria se realizará el próximo viernes a las 18:00.',
    type: 'announcement',
    priority: 'medium',
    status: 'read',
    category: 'event',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    metadata: {
      senderName: 'Secretaría',
      recipientCount: 150,
      tags: ['evento', 'asamblea', 'recordatorio']
    }
  },
  {
    id: '6',
    title: 'Actualización del sistema disponible',
    message: 'Una nueva versión del sistema está disponible con mejoras de seguridad y nuevas funcionalidades.',
    type: 'info',
    priority: 'medium',
    status: 'archived',
    category: 'system',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    actionUrl: '/dashboard/asociacion/settings',
    actionLabel: 'Ver actualizaciones',
    metadata: {
      senderName: 'Equipo de Desarrollo',
      tags: ['actualización', 'sistema', 'seguridad']
    }
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<NotificationFilters>({});

  // Initialize with mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const stats: NotificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    read: notifications.filter(n => n.status === 'read').length,
    archived: notifications.filter(n => n.status === 'archived').length,
    byType: {
      info: notifications.filter(n => n.type === 'info').length,
      success: notifications.filter(n => n.type === 'success').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      error: notifications.filter(n => n.type === 'error').length,
      announcement: notifications.filter(n => n.type === 'announcement').length,
    },
    byPriority: {
      low: notifications.filter(n => n.priority === 'low').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      high: notifications.filter(n => n.priority === 'high').length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
    },
    byCategory: {
      system: notifications.filter(n => n.category === 'system').length,
      membership: notifications.filter(n => n.category === 'membership').length,
      payment: notifications.filter(n => n.category === 'payment').length,
      event: notifications.filter(n => n.category === 'event').length,
      general: notifications.filter(n => n.category === 'general').length,
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(notification.status)) {
      return false;
    }
    if (filters.type && filters.type.length > 0 && !filters.type.includes(notification.type)) {
      return false;
    }
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(notification.priority)) {
      return false;
    }
    if (filters.category && filters.category.length > 0 && !filters.category.includes(notification.category)) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return notification.title.toLowerCase().includes(searchLower) ||
             notification.message.toLowerCase().includes(searchLower) ||
             notification.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    }
    if (filters.dateRange) {
      const notificationDate = new Date(notification.createdAt);
      return notificationDate >= filters.dateRange.start && notificationDate <= filters.dateRange.end;
    }
    return true;
  });

  const createNotification = useCallback(async (data: NotificationFormData): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...data,
        status: 'unread',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          senderName: 'Administrador',
          tags: data.tags || []
        }
      };

      setNotifications(prev => [newNotification, ...prev]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'read' as NotificationStatus, readAt: new Date(), updatedAt: new Date() }
        : notification
    ));
  }, []);

  const markAsUnread = useCallback(async (id: string): Promise<void> => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'unread' as NotificationStatus, readAt: undefined, updatedAt: new Date() }
        : notification
    ));
  }, []);

  const archiveNotification = useCallback(async (id: string): Promise<void> => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'archived' as NotificationStatus, updatedAt: new Date() }
        : notification
    ));
  }, []);

  const deleteNotification = useCallback(async (id: string): Promise<void> => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    setNotifications(prev => prev.map(notification => 
      notification.status === 'unread'
        ? { ...notification, status: 'read' as NotificationStatus, readAt: new Date(), updatedAt: new Date() }
        : notification
    ));
  }, []);

  const bulkAction = useCallback(async (ids: string[], action: 'read' | 'unread' | 'archive' | 'delete'): Promise<void> => {
    switch (action) {
      case 'read':
        setNotifications(prev => prev.map(notification => 
          ids.includes(notification.id)
            ? { ...notification, status: 'read' as NotificationStatus, readAt: new Date(), updatedAt: new Date() }
            : notification
        ));
        break;
      case 'unread':
        setNotifications(prev => prev.map(notification => 
          ids.includes(notification.id)
            ? { ...notification, status: 'unread' as NotificationStatus, readAt: undefined, updatedAt: new Date() }
            : notification
        ));
        break;
      case 'archive':
        setNotifications(prev => prev.map(notification => 
          ids.includes(notification.id)
            ? { ...notification, status: 'archived' as NotificationStatus, updatedAt: new Date() }
            : notification
        ));
        break;
      case 'delete':
        setNotifications(prev => prev.filter(notification => !ids.includes(notification.id)));
        break;
    }
  }, []);

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    loading,
    stats,
    filters,
    setFilters,
    createNotification,
    markAsRead,
    markAsUnread,
    archiveNotification,
    deleteNotification,
    markAllAsRead,
    bulkAction
  };
};
