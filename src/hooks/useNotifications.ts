'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  Notification,
  NotificationFormData,
  NotificationFilters,
  NotificationStats,
} from '@/types/notification';
import {
  subscribeToNotifications,
  createNotification as createNotificationFirestore,
  markNotificationAsRead,
  markNotificationAsUnread,
  archiveNotification as archiveNotificationFirestore,
  deleteNotification as deleteNotificationFirestore,
  markAllNotificationsAsRead,
  bulkNotificationAction,
  getNotificationStats,
  cleanupExpiredNotifications,
} from '@/utils/firestore/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
    byType: { info: 0, success: 0, warning: 0, error: 0, announcement: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    byCategory: { system: 0, membership: 0, payment: 0, event: 0, general: 0 },
    recentActivity: { today: 0, thisWeek: 0, thisMonth: 0 },
  });
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const previousNotificationIds = useRef<Set<string>>(new Set());

  // Función para reproducir sonido de notificación usando Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      // Crear un contexto de audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Crear un oscilador para generar el sonido
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Conectar los nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar el sonido
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      // Configurar el volumen
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      // Reproducir el sonido
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
    } catch (error) {
      // Fallback: intentar reproducir un archivo de audio si existe
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Silently fail if audio can't be played
        });
      } catch {
        // Silently fail if audio is not available
      }
    }
  }, []);

  // Función para mostrar notificación del navegador
  const showBrowserNotification = useCallback((notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: false,
      });

      // Auto-close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }

      // Handle click on notification
      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };
    }
  }, []);

  // Solicitar permisos de notificación
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Suscribirse a notificaciones en tiempo real
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Solicitar permisos de notificación
    requestNotificationPermission();

    try {
      const unsubscribe = subscribeToNotifications(
        (newNotifications) => {
          if (!mounted) return;

          // Detectar nuevas notificaciones
          const currentIds = new Set(newNotifications.map(n => n.id));
          const newIds = [...currentIds].filter(id => !previousNotificationIds.current.has(id));
          
          if (newIds.length > 0 && previousNotificationIds.current.size > 0) {
            setNewNotificationCount(prev => prev + newIds.length);
            
            // Reproducir sonido y mostrar notificación del navegador para nuevas notificaciones
            newIds.forEach(id => {
              const notification = newNotifications.find(n => n.id === id);
              if (notification && notification.status === 'unread') {
                playNotificationSound();
                showBrowserNotification(notification);
                
                // Mostrar toast para notificaciones de alta prioridad
                if (notification.priority === 'urgent' || notification.priority === 'high') {
                  toast.success(`Nueva notificación: ${notification.title}`, {
                    duration: 5000,
                    position: 'top-right',
                  });
                }
              }
            });
          }

          previousNotificationIds.current = currentIds;
          setAllNotifications(newNotifications);
          setLoading(false);
        },
        filters
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      if (mounted) {
        setError('Error al cargar las notificaciones');
        setLoading(false);
        console.error('Error subscribing to notifications:', err);
      }
    }

    return () => {
      mounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [filters, playNotificationSound, showBrowserNotification, requestNotificationPermission]);

  // Aplicar filtros localmente
  useEffect(() => {
    let filtered = [...allNotifications];

    // Aplicar filtros adicionales que no se pueden hacer en Firestore
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(n => filters.type!.includes(n.type));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(n => filters.priority!.includes(n.priority));
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(n => filters.category!.includes(n.category));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(n => filters.status!.includes(n.status));
    }

    if (filters.dateRange) {
      filtered = filtered.filter(notification => {
        const notificationDate = new Date(notification.createdAt);
        return notificationDate >= filters.dateRange!.start && notificationDate <= filters.dateRange!.end;
      });
    }

    setNotifications(filtered);
  }, [allNotifications, filters]);

  // Calcular estadísticas
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newStats: NotificationStats = {
      total: allNotifications.length,
      unread: allNotifications.filter(n => n.status === 'unread').length,
      read: allNotifications.filter(n => n.status === 'read').length,
      archived: allNotifications.filter(n => n.status === 'archived').length,
      byType: {
        info: allNotifications.filter(n => n.type === 'info').length,
        success: allNotifications.filter(n => n.type === 'success').length,
        warning: allNotifications.filter(n => n.type === 'warning').length,
        error: allNotifications.filter(n => n.type === 'error').length,
        announcement: allNotifications.filter(n => n.type === 'announcement').length,
      },
      byPriority: {
        low: allNotifications.filter(n => n.priority === 'low').length,
        medium: allNotifications.filter(n => n.priority === 'medium').length,
        high: allNotifications.filter(n => n.priority === 'high').length,
        urgent: allNotifications.filter(n => n.priority === 'urgent').length,
      },
      byCategory: {
        system: allNotifications.filter(n => n.category === 'system').length,
        membership: allNotifications.filter(n => n.category === 'membership').length,
        payment: allNotifications.filter(n => n.category === 'payment').length,
        event: allNotifications.filter(n => n.category === 'event').length,
        general: allNotifications.filter(n => n.category === 'general').length,
      },
      recentActivity: {
        today: allNotifications.filter(n => new Date(n.createdAt) >= today).length,
        thisWeek: allNotifications.filter(n => new Date(n.createdAt) >= thisWeek).length,
        thisMonth: allNotifications.filter(n => new Date(n.createdAt) >= thisMonth).length,
      }
    };
    setStats(newStats);
  }, [allNotifications]);

  // Limpiar notificaciones expiradas periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      cleanupExpiredNotifications().catch(console.error);
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  const createNotification = useCallback(async (data: NotificationFormData): Promise<void> => {
    try {
      await createNotificationFirestore(data);
      toast.success('Notificación creada exitosamente');
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Error al crear la notificación');
      throw error;
    }
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Error al marcar como leída');
      throw error;
    }
  }, []);

  const markAsUnread = useCallback(async (id: string): Promise<void> => {
    try {
      await markNotificationAsUnread(id);
    } catch (error) {
      console.error('Error marking as unread:', error);
      toast.error('Error al marcar como no leída');
      throw error;
    }
  }, []);

  const archiveNotification = useCallback(async (id: string): Promise<void> => {
    try {
      await archiveNotificationFirestore(id);
      toast.success('Notificación archivada');
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error('Error al archivar la notificación');
      throw error;
    }
  }, []);

  const deleteNotification = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteNotificationFirestore(id);
      toast.success('Notificación eliminada');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error al eliminar la notificación');
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      await markAllNotificationsAsRead();
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Error al marcar todas como leídas');
      throw error;
    }
  }, []);

  const bulkAction = useCallback(async (
    ids: string[],
    action: 'read' | 'unread' | 'archive' | 'delete'
  ): Promise<void> => {
    try {
      await bulkNotificationAction(ids, action);
      
      const actionMessages = {
        read: `${ids.length} notificaciones marcadas como leídas`,
        unread: `${ids.length} notificaciones marcadas como no leídas`,
        archive: `${ids.length} notificaciones archivadas`,
        delete: `${ids.length} notificaciones eliminadas`
      };
      
      toast.success(actionMessages[action]);
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast.error('Error al ejecutar la acción');
      throw error;
    }
  }, []);

  const clearNewNotificationCount = useCallback(() => {
    setNewNotificationCount(0);
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const newStats = await getNotificationStats();
      setStats(newStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, []);

  return {
    notifications,
    allNotifications,
    loading,
    error,
    stats,
    filters,
    newNotificationCount,
    setFilters,
    createNotification,
    markAsRead,
    markAsUnread,
    archiveNotification,
    deleteNotification,
    markAllAsRead,
    bulkAction,
    clearNewNotificationCount,
    refreshStats,
  };
};