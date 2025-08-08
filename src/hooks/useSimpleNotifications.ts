'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  SimpleNotification, 
  SimpleNotificationFormData, 
  SimpleNotificationResult,
  RecipientInfo,
  SimpleNotificationSettings
} from '@/types/simple-notification';
import { simpleNotificationService } from '@/services/simple-notifications.service';
import { useAuth } from './useAuth';

export const useSimpleNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<SimpleNotification[]>([]);
  const [recipients, setRecipients] = useState<RecipientInfo[]>([]);
  const [settings, setSettings] = useState<SimpleNotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar destinatarios
  const loadRecipients = useCallback(async () => {
    try {
      setLoading(true);
      const recipientsList = await simpleNotificationService.getRecipients();
      setRecipients(recipientsList);
    } catch (err) {
      console.error('Error loading recipients:', err);
      setError('Error al cargar destinatarios');
      toast.error('Error al cargar destinatarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar historial de notificaciones
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const notificationsList = await simpleNotificationService.getNotifications(user.uid);
      setNotifications(notificationsList);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar configuración del usuario
  const loadSettings = useCallback(async () => {
    if (!user) return;
    
    try {
      const userSettings = await simpleNotificationService.getUserSettings(user.uid);
      setSettings(userSettings);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Error al cargar configuración');
    }
  }, [user]);

  // Enviar notificación
  const sendNotification = useCallback(async (
    data: SimpleNotificationFormData
  ): Promise<SimpleNotificationResult | null> => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return null;
    }

    try {
      setSending(true);
      setError(null);

      // Validaciones básicas
      if (!data.title.trim()) {
        throw new Error('El título es requerido');
      }
      if (!data.message.trim()) {
        throw new Error('El mensaje es requerido');
      }
      if (data.channels.length === 0) {
        throw new Error('Selecciona al menos un canal');
      }
      if (data.recipientIds.length === 0) {
        throw new Error('Selecciona al menos un destinatario');
      }

      // Crear notificación
      const notificationId = await simpleNotificationService.createNotification(
        data,
        user.uid
      );

      // Enviar notificación
      const result = await simpleNotificationService.sendNotification(
        notificationId,
        data
      );

      // Mostrar resultado
      if (result.success) {
        toast.success(
          `Notificación enviada: ${result.sentCount} exitosas${
            result.failedCount > 0 ? `, ${result.failedCount} fallidas` : ''
          }`
        );
      } else {
        toast.error('Error al enviar notificación');
      }

      // Recargar historial
      await loadNotifications();

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error sending notification:', err);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setSending(false);
    }
  }, [user, loadNotifications]);

  // Guardar configuración
  const saveSettings = useCallback(async (
    newSettings: Omit<SimpleNotificationSettings, 'updatedAt'>
  ) => {
    try {
      setLoading(true);
      await simpleNotificationService.saveUserSettings(newSettings);
      setSettings({ ...newSettings, updatedAt: new Date() });
      toast.success('Configuración guardada');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadRecipients();
      loadNotifications();
      loadSettings();
    }
  }, [user, loadRecipients, loadNotifications, loadSettings]);

  return {
    // Datos
    notifications,
    recipients,
    settings,
    loading,
    sending,
    error,

    // Acciones
    sendNotification,
    saveSettings,
    loadRecipients,
    loadNotifications,
    loadSettings,

    // Utilidades
    clearError: () => setError(null),
  };
};
