export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationStatus = 'unread' | 'read' | 'archived';
export type NotificationCategory = 'system' | 'membership' | 'payment' | 'event' | 'general';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  category: NotificationCategory;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    senderId?: string;
    senderName?: string;
    recipientCount?: number;
    tags?: string[];
    attachments?: string[];
  };
}

export interface NotificationFormData {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: NotificationCategory;
  expiresAt?: Date;
  actionUrl?: string;
  actionLabel?: string;
  tags?: string[];
}

export interface NotificationFilters {
  status?: NotificationStatus[];
  type?: NotificationType[];
  priority?: NotificationPriority[];
  category?: NotificationCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  byCategory: Record<NotificationCategory, number>;
}
