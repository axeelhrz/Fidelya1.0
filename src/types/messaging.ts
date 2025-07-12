export type MessageStatus = 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'system';
export type ConversationStatus = 'active' | 'archived' | 'blocked';
export type ParticipantRole = 'therapist' | 'patient' | 'colleague';
export type AttachmentType = 'image' | 'pdf' | 'audio' | 'video' | 'document';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: ParticipantRole;
  type: MessageType;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  replyTo?: string; // ID del mensaje al que responde
  isEdited?: boolean;
  editedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  readBy?: MessageRead[];
  reactions?: MessageReaction[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: AttachmentType;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  thumbnailUrl?: string;
}

export interface MessageRead {
  userId: string;
  userName: string;
  readAt: Date;
}

export interface MessageReaction {
  userId: string;
  userName: string;
  emoji: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  centerId: string;
  participants: ConversationParticipant[];
  title?: string;
  type: 'direct' | 'group';
  status: ConversationStatus;
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: number;
  isTyping?: TypingIndicator[];
  settings: ConversationSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userRole: ParticipantRole;
  email: string;
  avatar?: string;
  joinedAt: Date;
  lastSeen?: Date;
  isOnline: boolean;
  permissions: ParticipantPermissions;
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canSendAttachments: boolean;
  canDeleteMessages: boolean;
  canEditMessages: boolean;
  canAddParticipants: boolean;
  canRemoveParticipants: boolean;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface ConversationSettings {
  notifications: boolean;
  soundEnabled: boolean;
  autoArchive: boolean;
  retentionDays?: number;
  allowFileSharing: boolean;
  allowAudioMessages: boolean;
  requireReadReceipts: boolean;
  encryptionEnabled: boolean;
}

export interface MessageFilters {
  searchTerm?: string;
  participantRole?: ParticipantRole;
  messageType?: MessageType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasAttachments?: boolean;
  isUnread?: boolean;
}

export interface ConversationFilters {
  searchTerm?: string;
  status?: ConversationStatus;
  participantRole?: ParticipantRole;
  hasUnread?: boolean;
  lastActivityRange?: {
    start: Date;
    end: Date;
  };
}

export interface CreateConversationData {
  participantIds: string[];
  title?: string;
  type: 'direct' | 'group';
  initialMessage?: string;
  settings?: Partial<ConversationSettings>;
}

export interface SendMessageData {
  content: string;
  type: MessageType;
  attachments?: File[];
  replyTo?: string;
}

export interface MessagingStats {
  totalConversations: number;
  activeConversations: number;
  unreadMessages: number;
  totalMessages: number;
  averageResponseTime: number; // in minutes
  messagesThisWeek: number;
  conversationsThisWeek: number;
}

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  status: 'online' | 'away' | 'busy' | 'offline';
  customStatus?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  sms: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
  keywords: string[];
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'greeting' | 'appointment' | 'reminder' | 'followup' | 'emergency' | 'custom';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface QuickReply {
  id: string;
  text: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface ConversationExport {
  format: 'pdf' | 'txt' | 'json';
  includeAttachments: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  participantFilter?: string[];
}

export interface MessageDraft {
  conversationId: string;
  content: string;
  attachments?: File[];
  savedAt: Date;
}

export interface SecuritySettings {
  endToEndEncryption: boolean;
  messageRetention: number; // days
  autoDeleteAfter: number; // days
  allowScreenshots: boolean;
  allowForwarding: boolean;
  requireAuthentication: boolean;
  auditLogging: boolean;
}

export interface AuditLog {
  id: string;
  action: 'message_sent' | 'message_read' | 'message_deleted' | 'conversation_created' | 'participant_added' | 'participant_removed';
  userId: string;
  userName: string;
  conversationId: string;
  messageId?: string;
  timestamp: Date;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}
