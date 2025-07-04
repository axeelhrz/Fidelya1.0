'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessagingService } from '@/lib/services/messagingService';
import { 
  Message, 
  Conversation, 
  CreateConversationData, 
  SendMessageData, 
  ConversationFilters,
  MessagingStats,
  MessageTemplate,
  UserPresence
} from '@/types/messaging';

export function useMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessagingStats | null>(null);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState<UserPresence[]>([]);

  const centerId = user?.centerId || '';
  const userId = user?.id || '';
  const userName = user?.name || '';

  // Refs for subscriptions
  const conversationsUnsubscribe = useRef<(() => void) | null>(null);
  const messagesUnsubscribe = useRef<(() => void) | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleError = useCallback((error: Error, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Error en ${operation}: ${error.message}`);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // CONVERSACIONES
  // ============================================================================

  const fetchConversations = useCallback(async (filters?: ConversationFilters) => {
    if (!centerId || !userId) return;

    setLoading(true);
    clearError();

    try {
      const conversationsData = await MessagingService.getConversations(centerId, userId, filters);
      setConversations(conversationsData);
    } catch (error) {
      handleError(error as Error, 'cargar conversaciones');
    } finally {
      setLoading(false);
    }
  }, [centerId, userId, handleError, clearError]);

  const createConversation = useCallback(async (data: CreateConversationData): Promise<string | null> => {
    if (!centerId || !userId) return null;

    setLoading(true);
    clearError();

    try {
      const conversationId = await MessagingService.createConversation(centerId, userId, data);
      await fetchConversations(); // Refresh conversations
      return conversationId;
    } catch (error) {
      handleError(error as Error, 'crear conversación');
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, userId, fetchConversations, handleError, clearError]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    if (!centerId) return;

    setCurrentConversation(conversation);
    setMessages([]);
    setLoading(true);

    try {
      // Subscribe to messages for this conversation
      if (messagesUnsubscribe.current) {
        messagesUnsubscribe.current();
      }

      // TODO: Implement subscribeToMessages in MessagingService
      // For now, we'll fetch messages directly
      const fetchedMessages = await MessagingService.getMessages(centerId, conversation.id);
      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      handleError(error as Error, 'cargar mensajes');
    }
  }, [centerId, handleError]);

  const archiveConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    if (!centerId) return false;

    try {
      await MessagingService.updateConversationStatus(centerId, conversationId, 'archived');
      await fetchConversations();
      return true;
    } catch (error) {
      handleError(error as Error, 'archivar conversación');
      return false;
    }
  }, [centerId, fetchConversations, handleError]);

  const blockConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    if (!centerId) return false;

    try {
      await MessagingService.updateConversationStatus(centerId, conversationId, 'blocked');
      await fetchConversations();
      return true;
    } catch (error) {
      handleError(error as Error, 'bloquear conversación');
      return false;
    }
  }, [centerId, fetchConversations, handleError]);

  // ============================================================================
  // MENSAJES
  // ============================================================================

  const sendMessage = useCallback(async (messageData: SendMessageData): Promise<boolean> => {
    if (!centerId || !currentConversation || !userId) return false;

    try {
      await MessagingService.sendMessage(centerId, currentConversation.id, userId, messageData);
      return true;
    } catch (error) {
      handleError(error as Error, 'enviar mensaje');
      return false;
    }
  }, [centerId, currentConversation, userId, handleError]);

  const markMessageAsRead = useCallback(async (messageId: string): Promise<void> => {
    if (!centerId || !currentConversation || !userId) return;

    try {
      await MessagingService.markMessageAsRead(
        centerId, 
        currentConversation.id, 
        messageId, 
        userId, 
        userName
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [centerId, currentConversation, userId, userName]);

  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    if (!centerId || !currentConversation) return false;

    try {
      await MessagingService.deleteMessage(centerId, currentConversation.id, messageId);
      return true;
    } catch (error) {
      handleError(error as Error, 'eliminar mensaje');
      return false;
    }
  }, [centerId, currentConversation, handleError]);

  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<boolean> => {
    if (!centerId || !currentConversation) return false;

    try {
      await MessagingService.editMessage(centerId, currentConversation.id, messageId, newContent);
      return true;
    } catch (error) {
      handleError(error as Error, 'editar mensaje');
      return false;
    }
  }, [centerId, currentConversation, handleError]);

  // ============================================================================
  // INDICADORES DE ESCRITURA
  // ============================================================================

  const stopTyping = useCallback(() => {
    if (!centerId || !currentConversation || !userId || !isTyping) return;

    setIsTyping(false);
    MessagingService.setTypingIndicator(centerId, currentConversation.id, userId, userName, false);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
  }, [centerId, currentConversation, userId, userName, isTyping]);

  const startTyping = useCallback(() => {
    if (!centerId || !currentConversation || !userId || isTyping) return;

    setIsTyping(true);
    MessagingService.setTypingIndicator(centerId, currentConversation.id, userId, userName, true);

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set timeout to stop typing after 3 seconds
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [centerId, currentConversation, userId, userName, isTyping, stopTyping]);

  // ============================================================================
  // PLANTILLAS
  // ============================================================================

  const fetchTemplates = useCallback(async () => {
    if (!centerId) return;

    try {
      const templatesData = await MessagingService.getMessageTemplates(centerId);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, [centerId]);

  const createTemplate = useCallback(async (templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<boolean> => {
    if (!centerId) return false;

    try {
      await MessagingService.createMessageTemplate(centerId, templateData);
      await fetchTemplates();
      return true;
    } catch (error) {
      handleError(error as Error, 'crear plantilla');
      return false;
    }
  }, [centerId, fetchTemplates, handleError]);

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  const fetchStats = useCallback(async () => {
    if (!centerId || !userId) return;

    try {
      const statsData = await MessagingService.getMessagingStats(centerId, userId);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [centerId, userId]);

  // ============================================================================
  // PRESENCIA
  // ============================================================================

  const updatePresence = useCallback(async (status: UserPresence['status']) => {
    if (!centerId || !userId) return;

    try {
      await MessagingService.updateUserPresence(centerId, userId, {
        userId,
        isOnline: status === 'online',
        status,
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [centerId, userId]);

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  const searchConversations = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      return conversations;
    }

    return conversations.filter(conversation => {
      const matchesTitle = conversation.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesParticipant = conversation.participants.some(p => 
        p.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesTitle || matchesParticipant;
    });
  }, [conversations]);

  const getUnreadCount = useCallback(() => {
    return conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);
  }, [conversations]);

  const exportConversation = useCallback(async (format: 'json' | 'txt' | 'pdf') => {
    if (!centerId || !currentConversation) return null;

    try {
      // Create export data from current messages
      const exportData = JSON.stringify({
        conversationId: currentConversation.id,
        title: currentConversation.title,
        participants: currentConversation.participants,
        messages: messages,
        exportedAt: new Date().toISOString(),
        format
      }, null, 2);
      
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${currentConversation.id}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      return exportData;
    } catch (error) {
      handleError(error as Error, 'exportar conversación');
      return null;
    }
  }, [centerId, currentConversation, messages, handleError]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Capture current ref values to avoid stale references in cleanup
    const currentConversationsUnsub = conversationsUnsubscribe.current;
    const currentMessagesUnsub = messagesUnsubscribe.current;
    const currentTimeout = typingTimeout.current;

    if (centerId && userId) {
      // TODO: Implement subscribeToConversations in MessagingService
      // For now, we'll fetch conversations directly
      fetchConversations();
      fetchTemplates();
      fetchStats();
      updatePresence('online');
    }

    return () => {
      if (currentConversationsUnsub) {
        currentConversationsUnsub();
      }
      if (currentMessagesUnsub) {
        currentMessagesUnsub();
      }
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [centerId, userId, fetchConversations, fetchTemplates, fetchStats, updatePresence]);

  // Update presence on window focus/blur
  useEffect(() => {
    const handleFocus = () => updatePresence('online');
    const handleBlur = () => updatePresence('away');

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [updatePresence]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (currentConversation && messages.length > 0) {
      const unreadMessages = messages.filter(message => 
        message.senderId !== userId && 
        !message.readBy?.some(read => read.userId === userId)
      );

      unreadMessages.forEach(message => {
        markMessageAsRead(message.id);
      });
    }
  }, [currentConversation, messages, userId, markMessageAsRead]);

  return {
    // Data
    conversations,
    currentConversation,
    messages,
    stats,
    templates,
    onlineUsers,
    
    // State
    loading,
    error,
    isTyping,
    clearError,
    
    // Conversation actions
    fetchConversations,
    createConversation,
    selectConversation,
    archiveConversation,
    blockConversation,
    
    // Message actions
    sendMessage,
    deleteMessage,
    editMessage,
    markMessageAsRead,
    
    // Typing indicators
    startTyping,
    stopTyping,
    
    // Templates
    fetchTemplates,
    createTemplate,
    
    // Stats
    fetchStats,
    
    // Presence
    updatePresence,
    
    // Utilities
    searchConversations,
    getUnreadCount,
    exportConversation
  };
}
