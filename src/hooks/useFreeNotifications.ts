'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { freeNotificationManager, showSuccess, showError, showWarning, showInfo, showUrgent } from '@/lib/free-notification-manager';
import { freeNotificationService } from '@/services/free-notifications.service';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationFormData } from '@/types/notification';

interface NotificationStatus {
  initialized: boolean;
  serviceAvailability: {
    email: boolean;
    push: boolean;
    browser: boolean;
  };
  permissions: {
    browser: boolean;
    push: boolean;
  };
  queueSize: number;
  lastDiagnostic?: {
    status: 'healthy' | 'warning' | 'error';
    issues: string[];
    recommendations: string[];
    services: {
      email: boolean;
      push: boolean;
      browser: boolean;
      audio: boolean;
    };
  };
}

interface SendNotificationOptions {
  type?: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  actionUrl?: string;
  actionLabel?: string;
  sendExternal?: boolean;
  recipientIds?: string[];
}

export const useFreeNotifications = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<NotificationStatus>({
    initialized: false,
    serviceAvailability: {
      email: false,
      push: false,
      browser: false
    },
    permissions: {
      browser: false,
      push: false
    },
    queueSize: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const statusUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const diagnosticInterval = useRef<NodeJS.Timeout | null>(null);

  // Actualizar estado del gestor
  const updateStatus = useCallback(async () => {
    try {
      const managerStatus = freeNotificationManager.getStatus();
      const serviceAvailability = await freeNotificationService.checkServiceAvailability();
      
      setStatus(prev => ({
        ...prev,
        initialized: managerStatus.initialized,
        serviceAvailability,
        queueSize: managerStatus.queueSize
      }));
    } catch (error) {
      console.error('❌ Error updating notification status:', error);
    }
  }, []);

  // Ejecutar diagnóstico
  const runDiagnostic = useCallback(async () => {
    try {
      const diagnostic = await freeNotificationManager.runDiagnostics();
      setStatus(prev => ({
        ...prev,
        lastDiagnostic: diagnostic
      }));
      
      // Mostrar advertencias si hay problemas críticos
      if (diagnostic.status === 'error') {
        console.warn('⚠️ Notification system has critical issues:', diagnostic.issues);
      }
      
      return diagnostic;
    } catch (error) {
      console.error('❌ Error running diagnostic:', error);
      return null;
    }
  }, []);

  // Solicitar permisos
  const requestPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const permissions = await freeNotificationManager.requestPermissions();
      
      setStatus(prev => ({
        ...prev,
        permissions
      }));
      
      // Actualizar estado después de solicitar permisos
      await updateStatus();
      
      return permissions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error requesting permissions';
      setError(errorMessage);
      console.error('❌ Error requesting permissions:', error);
      return { browser: false, push: false };
    } finally {
      setLoading(false);
    }
  }, [updateStatus]);

  // Enviar notificación simple (solo local)
  const notify = useCallback((
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    options: {
      actionUrl?: string;
      actionLabel?: string;
      skipBatch?: boolean;
    } = {}
  ) => {
    try {
      freeNotificationManager.notify(title, message, type, priority, {
        ...options,
        userId: user?.uid
      });
    } catch (error) {
      console.error('❌ Error showing notification:', error);
    }
  }, [user?.uid]);

  // Enviar notificación externa (email, push, etc.)
  const sendExternalNotification = useCallback(async (
    userId: string,
    title: string,
    message: string,
    options: SendNotificationOptions = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await freeNotificationManager.sendExternalNotification(
        userId,
        title,
        message,
        options.type || 'info',
        options.priority || 'medium',
        {
          actionUrl: options.actionUrl,
          actionLabel: options.actionLabel,
          category: options.category
        }
      );
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending notification';
      setError(errorMessage);
      console.error('❌ Error sending external notification:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar notificación a múltiples usuarios
  const sendBulkNotification = useCallback(async (
    userIds: string[],
    title: string,
    message: string,
    options: SendNotificationOptions = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const notificationId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await freeNotificationService.sendNotificationToUsers(
        notificationId,
        userIds,
        {
          title,
          message,
          type: options.type || 'info',
          priority: options.priority || 'medium',
          category: options.category || 'general',
          actionUrl: options.actionUrl,
          actionLabel: options.actionLabel
        }
      );
      
      // Mostrar notificación local de confirmación
      showSuccess(
        'Notificación enviada',
        `Enviada a ${result.totalUsers} usuarios: ${result.inAppSent} in-app, ${result.emailSent} emails, ${result.pushSent} push, ${result.browserSent} browser`
      );
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending bulk notification';
      setError(errorMessage);
      console.error('❌ Error sending bulk notification:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear notificación completa (in-app + externa)
  const createNotification = useCallback(async (
    data: NotificationFormData & {
      sendExternal?: boolean;
      recipientIds?: string[];
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      if (data.sendExternal && data.recipientIds && data.recipientIds.length > 0) {
        // Enviar notificación externa
        const result = await sendBulkNotification(
          data.recipientIds,
          data.title,
          data.message,
          {
            type: data.type,
            priority: data.priority,
            category: data.category,
            actionUrl: data.actionUrl,
            actionLabel: data.actionLabel
          }
        );
        
        return result;
      } else {
        // Solo notificación local
        notify(
          data.title,
          data.message,
          data.type === 'announcement' ? 'info' : data.type as any,
          data.priority,
          {
            actionUrl: data.actionUrl,
            actionLabel: data.actionLabel
          }
        );
        
        return {
          totalUsers: 1,
          inAppSent: 1,
          emailSent: 0,
          pushSent: 0,
          browserSent: 0
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating notification';
      setError(errorMessage);
      console.error('❌ Error creating notification:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [notify, sendBulkNotification]);

  // Obtener estadísticas de entrega
  const getDeliveryStats = useCallback(async (notificationId: string) => {
    try {
      return await freeNotificationService.getDeliveryStats(notificationId);
    } catch (error) {
      console.error('❌ Error getting delivery stats:', error);
      throw error;
    }
  }, []);

  // Configurar notificaciones
  const updateConfig = useCallback((config: {
    enableSounds?: boolean;
    enableBatch?: boolean;
    batchDelay?: number;
    maxNotifications?: number;
    enableDebounce?: boolean;
    debounceMs?: number;
  }) => {
    try {
      freeNotificationManager.updateConfig(config);
      showSuccess('Configuración actualizada', 'Las preferencias de notificación se han guardado');
    } catch (error) {
      console.error('❌ Error updating config:', error);
      showError('Error', 'No se pudo actualizar la configuración');
    }
  }, []);

  // Limpiar cola de notificaciones
  const clearQueue = useCallback(() => {
    try {
      freeNotificationManager.clearQueue();
      showInfo('Cola limpiada', 'Se han eliminado las notificaciones pendientes');
    } catch (error) {
      console.error('❌ Error clearing queue:', error);
    }
  }, []);

  // Funciones de conveniencia
  const success = useCallback((title: string, message: string, options?: { actionUrl?: string; actionLabel?: string }) => {
    notify(title, message, 'success', 'medium', options);
  }, [notify]);

  const error = useCallback((title: string, message: string, options?: { actionUrl?: string; actionLabel?: string }) => {
    notify(title, message, 'error', 'high', options);
  }, [notify]);

  const warning = useCallback((title: string, message: string, options?: { actionUrl?: string; actionLabel?: string }) => {
    notify(title, message, 'warning', 'medium', options);
  }, [notify]);

  const info = useCallback((title: string, message: string, options?: { actionUrl?: string; actionLabel?: string }) => {
    notify(title, message, 'info', 'low', options);
  }, [notify]);

  const urgent = useCallback((title: string, message: string, options?: { actionUrl?: string; actionLabel?: string }) => {
    notify(title, message, 'error', 'urgent', { ...options, skipBatch: true });
  }, [notify]);

  // Efectos
  useEffect(() => {
    // Actualizar estado inicial
    updateStatus();
    
    // Ejecutar diagnóstico inicial
    runDiagnostic();
    
    // Configurar intervalos de actualización
    statusUpdateInterval.current = setInterval(updateStatus, 30000); // Cada 30 segundos
    diagnosticInterval.current = setInterval(runDiagnostic, 300000); // Cada 5 minutos
    
    return () => {
      if (statusUpdateInterval.current) {
        clearInterval(statusUpdateInterval.current);
      }
      if (diagnosticInterval.current) {
        clearInterval(diagnosticInterval.current);
      }
    };
  }, [updateStatus, runDiagnostic]);

  // Limpiar error después de un tiempo
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return {
    // Estado
    status,
    loading,
    error,
    
    // Acciones principales
    notify,
    createNotification,
    sendExternalNotification,
    sendBulkNotification,
    
    // Funciones de conveniencia
    success,
    error: error,
    warning,
    info,
    urgent,
    
    // Funciones globales (para compatibilidad)
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showUrgent,
    
    // Configuración y gestión
    requestPermissions,
    updateConfig,
    clearQueue,
    runDiagnostic,
    getDeliveryStats,
    
    // Utilidades
    updateStatus,
    
    // Estado de disponibilidad
    isEmailAvailable: status.serviceAvailability.email,
    isPushAvailable: status.serviceAvailability.push,
    isBrowserAvailable: status.serviceAvailability.browser,
    hasPermissions: status.permissions.browser || status.permissions.push,
    isHealthy: status.lastDiagnostic?.status === 'healthy',
    
    // Métricas
    queueSize: status.queueSize,
    diagnosticStatus: status.lastDiagnostic?.status,
    issues: status.lastDiagnostic?.issues || [],
    recommendations: status.lastDiagnostic?.recommendations || []
  };
};