// Tipos de notificaciones soportadas
export type NotificationType = 
  | 'new_message' 
  | 'contact_request' 
  | 'request_accepted' 
  | 'request_rejected';

// Interfaz principal para notificaciones
export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  data?: NotificationData;
  isRead: boolean;
  createdAt: Date;
}

// Datos adicionales específicos para cada tipo de notificación
export interface NotificationData {
  chatId?: string;
  messageId?: string;
  contactId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

// Preferencias de notificación del usuario
export interface NotificationPreferences {
  userId: string;
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  push: boolean;
  doNotDisturb: {
    enabled: boolean;
    from?: string; // Hora en formato "HH:mm"
    to?: string; // Hora en formato "HH:mm"
  };
}