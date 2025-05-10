import type { Message } from './message';

// Interfaz principal para un chat
export interface Chat {
  id: string;
  participants: string[]; // Array de IDs de usuarios
  type: 'direct' | 'group';
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Message;
  metadata?: ChatMetadata;
}

// Metadatos adicionales para el chat
export interface ChatMetadata {
  name?: string; // Para chats grupales
  description?: string;
  photoURL?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  muteNotifications?: boolean;
}

// Interfaz para el estado de lectura del chat
export interface ChatReadStatus {
  chatId: string;
  userId: string;
  lastReadMessageId: string;
  lastReadAt: Date;
  unreadCount: number;
}

// Interfaz para las preferencias del chat
export interface ChatPreferences {
  chatId: string;
  userId: string;
  notifications: boolean;
  sound: boolean;
  theme?: string;
  fontSize?: number;
}
