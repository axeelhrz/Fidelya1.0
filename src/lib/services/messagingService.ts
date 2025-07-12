import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

// Type for attachment data from Firestore
interface FirestoreAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt?: Timestamp;
  uploadedBy: string;
}

// Type for read status from Firestore
interface FirestoreReadStatus {
  userId: string;
  userName: string;
  readAt: Timestamp;
}

// Type for reaction from Firestore
interface FirestoreReaction {
  userId: string;
  userName: string;
  emoji: string;
  timestamp: Timestamp;
}

// Type for participant data from Firestore
interface FirestoreParticipant {
  userId: string;
  userName: string;
  userRole: string;
  joinedAt?: Timestamp;
  lastSeen?: Timestamp;
}
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { 
  Message, 
  Conversation, 
  CreateConversationData, 
  SendMessageData, 
  ConversationFilters,
  MessagingStats,
  MessageAttachment,
  UserPresence,
  MessageTemplate,
  ConversationExport
} from '../../types/messaging';

export class MessagingService {
  private static getConversationsCollection(centerId: string) {
    return collection(db, 'centers', centerId, 'conversations');
  }

  private static getMessagesCollection(centerId: string, conversationId: string) {
    return collection(db, 'centers', centerId, 'conversations', conversationId, 'messages');
  }

  private static getPresenceCollection(centerId: string) {
    return collection(db, 'centers', centerId, 'presence');
  }

  private static getTemplatesCollection(centerId: string) {
    return collection(db, 'centers', centerId, 'messageTemplates');
  }

  // ============================================================================
  // GESTIÓN DE CONVERSACIONES
  // ============================================================================

  static async getConversations(
    centerId: string, 
    userId: string, 
    filters?: ConversationFilters
  ): Promise<Conversation[]> {
    try {
      const conversationsRef = this.getConversationsCollection(centerId);
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastActivity', 'desc')
      );

      const snapshot = await getDocs(q);
      let conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActivity: doc.data().lastActivity?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        participants: doc.data().participants?.map((p: { joinedAt?: Timestamp; lastSeen?: Timestamp; [key: string]: unknown }) => ({
          ...p,
          joinedAt: p.joinedAt?.toDate() || new Date(),
          lastSeen: p.lastSeen?.toDate()
        })) || []
      })) as Conversation[];

      // Apply filters
      if (filters) {
        conversations = this.filterConversations(conversations, filters);
      }

      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  static async createConversation(
    centerId: string, 
    creatorId: string, 
    data: CreateConversationData
  ): Promise<string> {
    try {
      const conversationsRef = this.getConversationsCollection(centerId);
      const now = new Date();

      // Check if direct conversation already exists
      if (data.type === 'direct' && data.participantIds.length === 1) {
        const existingConversation = await this.findDirectConversation(
          centerId, 
          creatorId, 
          data.participantIds[0]
        );
        if (existingConversation) {
          return existingConversation.id;
        }
      }

      const participants = [creatorId, ...data.participantIds];
      const defaultSettings = {
        notifications: true,
        soundEnabled: true,
        autoArchive: false,
        allowFileSharing: true,
        allowAudioMessages: true,
        requireReadReceipts: true,
        encryptionEnabled: true,
        ...data.settings
      };

      const newConversation = {
        centerId,
        participants,
        title: data.title,
        type: data.type,
        status: 'active' as const,
        lastActivity: Timestamp.fromDate(now),
        unreadCount: 0,
        settings: defaultSettings,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        createdBy: creatorId
      };

      const docRef = await addDoc(conversationsRef, newConversation);

      // Send initial message if provided
      if (data.initialMessage) {
        await this.sendMessage(centerId, docRef.id, creatorId, {
          content: data.initialMessage,
          type: 'text'
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  static async updateConversationStatus(
    centerId: string, 
    conversationId: string, 
    status: Conversation['status']
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'centers', centerId, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating conversation status:', error);
      throw error;
    }
  }

  static async addParticipant(
    centerId: string, 
    conversationId: string, 
    participantId: string
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'centers', centerId, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        participants: arrayUnion(participantId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  }

  static async removeParticipant(
    centerId: string, 
    conversationId: string, 
    participantId: string
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'centers', centerId, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        participants: arrayRemove(participantId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTIÓN DE MENSAJES
  // ============================================================================

  static async getMessages(
    centerId: string, 
    conversationId: string, 
    lastMessageId?: string, 
    pageSize: number = 50
  ): Promise<Message[]> {
    try {
      const messagesRef = this.getMessagesCollection(centerId, conversationId);
      let q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(pageSize)
      );

      if (lastMessageId) {
        const lastMessageDoc = await getDoc(doc(messagesRef, lastMessageId));
        if (lastMessageDoc.exists()) {
          q = query(
            messagesRef,
            orderBy('timestamp', 'desc'),
            startAfter(lastMessageDoc),
            limit(pageSize)
          );
        }
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        editedAt: doc.data().editedAt?.toDate(),
        deletedAt: doc.data().deletedAt?.toDate(),
        attachments: doc.data().attachments?.map((att: FirestoreAttachment) => ({
          ...att,
          uploadedAt: att.uploadedAt?.toDate() || new Date()
        })) || [],
        readBy: doc.data().readBy?.map((read: FirestoreReadStatus) => ({
          ...read,
          readAt: read.readAt?.toDate() || new Date()
        })) || [],
        reactions: doc.data().reactions?.map((reaction: FirestoreReaction) => ({
          ...reaction,
          timestamp: reaction.timestamp?.toDate() || new Date()
        })) || []
      })).reverse() as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async sendMessage(
    centerId: string, 
    conversationId: string, 
    senderId: string, 
    messageData: SendMessageData
  ): Promise<string> {
    try {
      const messagesRef = this.getMessagesCollection(centerId, conversationId);
      const conversationRef = doc(db, 'centers', centerId, 'conversations', conversationId);
      const now = new Date();

      // Upload attachments if any
      let attachments: MessageAttachment[] = [];
      if (messageData.attachments && messageData.attachments.length > 0) {
        attachments = await this.uploadAttachments(
          centerId, 
          conversationId, 
          messageData.attachments, 
          senderId
        );
      }

      const newMessage = {
        conversationId,
        senderId,
        senderName: '', // This should be populated from user data
        senderRole: 'therapist' as const, // This should be determined from user role
        type: messageData.type,
        content: messageData.content,
        timestamp: Timestamp.fromDate(now),
        status: 'sent' as const,
        attachments,
        replyTo: messageData.replyTo,
        isEdited: false,
        isDeleted: false,
        readBy: [],
        reactions: []
      };

      const docRef = await addDoc(messagesRef, newMessage);

      // Update conversation's last activity and message
      await updateDoc(conversationRef, {
        lastActivity: Timestamp.fromDate(now),
        lastMessage: {
          id: docRef.id,
          content: messageData.content,
          timestamp: Timestamp.fromDate(now),
          senderId
        },
        updatedAt: Timestamp.fromDate(now)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async markMessageAsRead(
    centerId: string, 
    conversationId: string, 
    messageId: string, 
    userId: string, 
    userName: string
  ): Promise<void> {
    try {
      const messageRef = doc(db, 'centers', centerId, 'conversations', conversationId, 'messages', messageId);
      await updateDoc(messageRef, {
        readBy: arrayUnion({
          userId,
          userName,
          readAt: Timestamp.fromDate(new Date())
        }),
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  static async deleteMessage(
    centerId: string, 
    conversationId: string, 
    messageId: string
  ): Promise<void> {
    try {
      const messageRef = doc(db, 'centers', centerId, 'conversations', conversationId, 'messages', messageId);
      await updateDoc(messageRef, {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        content: 'Mensaje eliminado'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  static async editMessage(
    centerId: string, 
    conversationId: string, 
    messageId: string, 
    newContent: string
  ): Promise<void> {
    try {
      const messageRef = doc(db, 'centers', centerId, 'conversations', conversationId, 'messages', messageId);
      await updateDoc(messageRef, {
        content: newContent,
        isEdited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTIÓN DE ARCHIVOS
  // ============================================================================

  private static async uploadAttachments(
    centerId: string, 
    conversationId: string, 
    files: File[], 
    uploaderId: string
  ): Promise<MessageAttachment[]> {
    const attachments: MessageAttachment[] = [];

    for (const file of files) {
      try {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `centers/${centerId}/conversations/${conversationId}/attachments/${fileName}`;
        const fileRef = ref(storage, filePath);

        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const attachment: MessageAttachment = {
          id: fileName,
          name: file.name,
          type: this.getAttachmentType(file.type),
          url: downloadURL,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date(),
          uploadedBy: uploaderId
        };

        attachments.push(attachment);
      } catch (error) {
        console.error('Error uploading attachment:', error);
        throw error;
      }
    }

    return attachments;
  }

  private static getAttachmentType(mimeType: string): MessageAttachment['type'] {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'document';
  }

  // ============================================================================
  // PRESENCIA Y ESTADO
  // ============================================================================

  static async updateUserPresence(
    centerId: string, 
    userId: string, 
    presence: Partial<UserPresence>
  ): Promise<void> {
    try {
      const presenceRef = doc(db, 'centers', centerId, 'presence', userId);
      await updateDoc(presenceRef, {
        ...presence,
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user presence:', error);
      throw error;
    }
  }

  static async setTypingIndicator(
    centerId: string, 
    conversationId: string, 
    userId: string, 
    userName: string, 
    isTyping: boolean
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'centers', centerId, 'conversations', conversationId);
      
      if (isTyping) {
        await updateDoc(conversationRef, {
          isTyping: arrayUnion({
            userId,
            userName,
            timestamp: Timestamp.fromDate(new Date())
          })
        });
      } else {
        await updateDoc(conversationRef, {
          isTyping: arrayRemove({
            userId,
            userName,
            timestamp: Timestamp.fromDate(new Date())
          })
        });
      }
    } catch (error) {
      console.error('Error setting typing indicator:', error);
      throw error;
    }
  }

  // ============================================================================
  // PLANTILLAS Y RESPUESTAS RÁPIDAS
  // ============================================================================

  static async getMessageTemplates(centerId: string): Promise<MessageTemplate[]> {
    try {
      const templatesRef = this.getTemplatesCollection(centerId);
      const q = query(templatesRef, where('isActive', '==', true), orderBy('name'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as MessageTemplate[];
    } catch (error) {
      console.error('Error fetching message templates:', error);
      throw error;
    }
  }

  static async createMessageTemplate(
    centerId: string, 
    templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
  ): Promise<string> {
    try {
      const templatesRef = this.getTemplatesCollection(centerId);
      const now = new Date();

      const newTemplate = {
        ...templateData,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        usageCount: 0
      };

      const docRef = await addDoc(templatesRef, newTemplate);
      return docRef.id;
    } catch (error) {
      console.error('Error creating message template:', error);
      throw error;
    }
  }

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  static async getMessagingStats(
    centerId: string, 
    userId: string
  ): Promise<MessagingStats> {
    try {
      // This is a simplified implementation
      // In a real app, you might want to use aggregation or pre-computed stats
      const conversations = await this.getConversations(centerId, userId);
      
      const totalConversations = conversations.length;
      const activeConversations = conversations.filter(c => c.status === 'active').length;
      const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

      return {
        totalConversations,
        activeConversations,
        unreadMessages,
        totalMessages: 0, // Would need to aggregate from all conversations
        averageResponseTime: 0, // Would need to calculate from message timestamps
        messagesThisWeek: 0, // Would need to filter by date
        conversationsThisWeek: 0 // Would need to filter by date
      };
    } catch (error) {
      console.error('Error getting messaging stats:', error);
      throw error;
    }
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  private static async findDirectConversation(
    centerId: string, 
    user1Id: string, 
    user2Id: string
  ): Promise<Conversation | null> {
    try {
      const conversationsRef = this.getConversationsCollection(centerId);
      const q = query(
        conversationsRef,
        where('type', '==', 'direct'),
        where('participants', 'array-contains', user1Id)
      );

      const snapshot = await getDocs(q);
      const conversation = snapshot.docs.find(doc => {
        const participants = doc.data().participants;
        return participants.includes(user2Id) && participants.length === 2;
      });

      if (conversation) {
        return {
          id: conversation.id,
          ...conversation.data(),
          lastActivity: conversation.data().lastActivity?.toDate() || new Date(),
          createdAt: conversation.data().createdAt?.toDate() || new Date(),
          updatedAt: conversation.data().updatedAt?.toDate() || new Date()
        } as Conversation;
      }

      return null;
    } catch (error) {
      console.error('Error finding direct conversation:', error);
      return null;
    }
  }

  private static filterConversations(
    conversations: Conversation[], 
    filters: ConversationFilters
  ): Conversation[] {
    return conversations.filter(conversation => {
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesTitle = conversation.title?.toLowerCase().includes(searchTerm);
        const matchesParticipant = conversation.participants.some(p => 
          p.userName.toLowerCase().includes(searchTerm)
        );
        if (!matchesTitle && !matchesParticipant) return false;
      }

      if (filters.status && conversation.status !== filters.status) {
        return false;
      }

      if (filters.hasUnread && conversation.unreadCount === 0) {
        return false;
      }

      if (filters.participantRole) {
        const hasParticipantWithRole = conversation.participants.some(p => 
          p.userRole === filters.participantRole
        );
        if (!hasParticipantWithRole) return false;
      }

      if (filters.lastActivityRange) {
        const { start, end } = filters.lastActivityRange;
        if (conversation.lastActivity < start || conversation.lastActivity > end) {
          return false;
        }
      }

      return true;
    });
  }

  // ============================================================================
  // SUSCRIPCIONES EN TIEMPO REAL
  // ============================================================================

  static subscribeToConversations(
    centerId: string, 
    userId: string, 
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const conversationsRef = this.getConversationsCollection(centerId);
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastActivity', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActivity: doc.data().lastActivity?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        participants: doc.data().participants?.map((p: FirestoreParticipant) => ({
          ...p,
          joinedAt: p.joinedAt?.toDate() || new Date(),
          lastSeen: p.lastSeen?.toDate()
        })) || []
      })) as Conversation[];

      callback(conversations);
    });
  }

  static subscribeToMessages(
    centerId: string, 
    conversationId: string, 
    callback: (messages: Message[]) => void
  ): () => void {
    const messagesRef = this.getMessagesCollection(centerId, conversationId);
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        editedAt: doc.data().editedAt?.toDate(),
        deletedAt: doc.data().deletedAt?.toDate(),
        attachments: doc.data().attachments?.map((att: FirestoreAttachment) => ({
          ...att,
          uploadedAt: att.uploadedAt?.toDate() || new Date()
        })) || [],
        readBy: doc.data().readBy?.map((read: FirestoreReadStatus) => ({
          ...read,
          readAt: read.readAt?.toDate() || new Date()
        })) || [],
        reactions: doc.data().reactions?.map((reaction: FirestoreReaction) => ({
          ...reaction,
          timestamp: reaction.timestamp?.toDate() || new Date()
        })) || []
      })).reverse() as Message[];

      callback(messages);
    });
  }

  // ============================================================================
  // EXPORTACIÓN
  // ============================================================================

  static async exportConversation(
    centerId: string, 
    conversationId: string, 
    options: ConversationExport
  ): Promise<string> {
    try {
      const messages = await this.getMessages(centerId, conversationId);
      
      switch (options.format) {
        case 'json':
          return JSON.stringify(messages, null, 2);
        case 'txt':
          return this.exportToText(messages);
        case 'pdf':
          // This would require a PDF generation library
          throw new Error('PDF export not implemented');
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting conversation:', error);
      throw error;
    }
  }

  private static exportToText(messages: Message[]): string {
    return messages.map(message => {
      const timestamp = message.timestamp.toLocaleString('es-ES');
      const sender = message.senderName;
      const content = message.isDeleted ? '[Mensaje eliminado]' : message.content;
      return `[${timestamp}] ${sender}: ${content}`;
    }).join('\n');
  }
}

export const messagingService = new MessagingService();
