// Tipos básicos para el sistema de notificaciones simplificado
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationStatus = 'unread' | 'read';

// Notificación básica en la app
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  recipientId: string;
  read: boolean;
}

// Para compatibilidad con el código existente que pueda referenciar estos tipos
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationCategory = 'system' | 'membership' | 'payment' | 'event' | 'general';

// Configuración básica de notificaciones (mantener para compatibilidad)
export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: Record<NotificationCategory, boolean>;
  priorities: Record<NotificationPriority, boolean>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  updatedAt: Date;
}

// Datos básicos para crear notificación (mantener para compatibilidad)
export interface NotificationFormData {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  recipientIds?: string[];
}