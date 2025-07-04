'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Archive,
  Trash2,
  Edit3,
  Download,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Settings,
  Star,
  VolumeX,
  Blocks,
  Image as ImageIcon,
  File,
  Mic,
  MicOff
} from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Conversation, 
  Message, 
  SendMessageData, 
  CreateConversationData,
  MessageTemplate,
} from '@/types/messaging';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TherapistMessagesPage() {
  const { user } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    stats,
    templates,
    loading,
    error,
    clearError,
    fetchConversations,
    createConversation,
    selectConversation,
    sendMessage,
    deleteMessage,
    editMessage,
    archiveConversation,
    blockConversation,
    startTyping,
    stopTyping,
    searchConversations,
    getUnreadCount,
    exportConversation
  } = useMessages();

  // State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for users (in real app, this would come from a service)
  const [availableUsers] = useState([
    { id: '1', name: 'María González', role: 'patient', email: 'maria@email.com', avatar: null, isOnline: true },
    { id: '2', name: 'Carlos Rodríguez', role: 'patient', email: 'carlos@email.com', avatar: null, isOnline: false },
    { id: '3', name: 'Ana Martínez', role: 'patient', email: 'ana@email.com', avatar: null, isOnline: true },
    { id: '4', name: 'Dr. Luis Pérez', role: 'colleague', email: 'luis@centro.com', avatar: null, isOnline: true },
    { id: '5', name: 'Dra. Carmen López', role: 'colleague', email: 'carmen@centro.com', avatar: null, isOnline: false }
  ]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
    }
  }, [messageInput]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && selectedFiles.length === 0) return;

    const messageData: SendMessageData = {
      content: messageInput.trim(),
      type: selectedFiles.length > 0 ? 'file' : 'text',
      attachments: selectedFiles
    };

    const success = await sendMessage(messageData);
    if (success) {
      setMessageInput('');
      setSelectedFiles([]);
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    // Handle typing indicators
    if (e.target.value.trim()) {
      startTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 1000);
    } else {
      stopTyping();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateConversation = async (participantIds: string[], title?: string) => {
    const conversationData: CreateConversationData = {
      participantIds,
      type: participantIds.length === 1 ? 'direct' : 'group',
      title
    };

    const conversationId = await createConversation(conversationData);
    if (conversationId) {
      setShowNewChatModal(false);
      // Find and select the new conversation
      const newConversation = conversations.find(c => c.id === conversationId);
      if (newConversation) {
        selectConversation(newConversation);
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      await deleteMessage(messageId);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    const editedContent = prompt('Editar mensaje:', newContent);
    if (editedContent && editedContent !== newContent) {
      await editMessage(messageId, editedContent);
    }
  };
  const handleArchiveConversation = async () => {
    if (!currentConversation) return;
    
    if (window.confirm('¿Estás seguro de que quieres archivar esta conversación?')) {
      await archiveConversation(currentConversation.id);
      setShowContactDetails(false);
    }
  };

  const handleBlockConversation = async () => {
    if (!currentConversation) return;
    
    if (window.confirm('¿Estás seguro de que quieres bloquear esta conversación?')) {
      await blockConversation(currentConversation.id);
      setShowContactDetails(false);
    }
  };

  const handleExportConversation = async (format: 'json' | 'txt' | 'pdf') => {
    await exportConversation(format);
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setMessageInput(template.content);
    setShowTemplates(false);
    messageInputRef.current?.focus();
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Ayer';
    } else {
      return format(timestamp, 'dd/MM/yyyy');
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    switch (message.status) {
      case 'sent':
        return <CheckCircle size={12} color="#9CA3AF" />;
      case 'delivered':
        return <CheckCircle size={12} color="#3B82F6" />;
      case 'read':
        return <CheckCircle size={12} color="#10B981" />;
      default:
        return null;
    }
  };

  const getParticipantInfo = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.userId !== user?.id);
      return {
        name: otherParticipant?.userName || 'Usuario',
        role: otherParticipant?.userRole || 'patient',
        isOnline: otherParticipant?.isOnline || false
      };
    } else {
      return {
        name: conversation.title || 'Conversación grupal',
        role: 'group',
        isOnline: false
      };
    }
  };

  const filteredConversations = searchTerm 
    ? searchConversations(searchTerm)
    : conversations;

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <MessageSquare size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#065F46',
              textShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
            }}>
              Mensajes
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#047857',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Chateá de forma segura con tus pacientes y colegas
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              {stats && (
                <>
                  <span style={{ fontSize: '0.875rem', color: '#047857' }}>
                    {stats.totalConversations} conversaciones
                  </span>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#065F46'
                  }}>
                    {getUnreadCount()} no leídos
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewChatModal(true)}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Plus size={16} />
            Nuevo Chat
          </motion.button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0.875rem',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '0.5rem',
                background: showFilters ? '#10B981' : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Filter size={16} color={showFilters ? 'white' : '#10B981'} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Settings size={16} color="#10B981" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderConversationsList = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        width: '380px',
        height: '600px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Search bar */}
      <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#9CA3AF" style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            placeholder="Buscar contacto o conversación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'all 0.2s ease',
              background: 'rgba(249, 250, 251, 0.8)'
            }}
          />
        </div>
      </div>

      {/* Conversations list */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '0 1rem 1rem 1rem'
      }}>
        {loading && filteredConversations.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#9CA3AF'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid #E5E7EB',
                borderTop: '2px solid #10B981',
                borderRadius: '50%'
              }}
            />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            <MessageSquare size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              No hay conversaciones
            </p>
            <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
              Inicia un nuevo chat para comenzar
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredConversations.map((conversation) => {
              const participantInfo = getParticipantInfo(conversation);
              const isSelected = currentConversation?.id === conversation.id;
              
              return (
                <motion.div
                  key={conversation.id}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectConversation(conversation)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                      : 'transparent',
                    border: isSelected 
                      ? '1px solid rgba(16, 185, 129, 0.2)' 
                      : '1px solid transparent',
                    position: 'relative'
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selectedConversation"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '60%',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        borderRadius: '0 2px 2px 0'
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: participantInfo.role === 'patient' 
                          ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                          : participantInfo.role === 'colleague'
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        {participantInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      {participantInfo.isOnline && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '12px',
                          height: '12px',
                          background: '#10B981',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {participantInfo.name}
                        </h4>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {conversation.lastMessage && formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {conversation.lastMessage?.content || 'Sin mensajes'}
                        </p>
                        
                        {conversation.unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              background: '#EF4444',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              marginLeft: '0.5rem'
                            }}
                          >
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </motion.div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.25rem'
                      }}>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          background: participantInfo.role === 'patient' 
                            ? 'rgba(59, 130, 246, 0.1)'
                            : participantInfo.role === 'colleague'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(139, 92, 246, 0.1)',
                          color: participantInfo.role === 'patient' 
                            ? '#2563EB'
                            : participantInfo.role === 'colleague'
                            ? '#059669'
                            : '#7C3AED'
                        }}>
                          {participantInfo.role === 'patient' ? 'Paciente' : 
                           participantInfo.role === 'colleague' ? 'Colega' : 'Grupo'}
                        </span>
                        
                        {conversation.status === 'archived' && (
                          <Archive size={12} color="#9CA3AF" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderChatArea = () => {
    if (!currentConversation) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginLeft: '1.5rem'
          }}
        >
          <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
            <MessageSquare size={64} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              Selecciona una conversación
            </h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Elige un chat de la lista para comenzar a conversar
            </p>
          </div>
        </motion.div>
      );
    }

    const participantInfo = getParticipantInfo(currentConversation);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginLeft: '1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Chat header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
          background: 'rgba(249, 250, 251, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: participantInfo.role === 'patient' 
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : participantInfo.role === 'colleague'
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {participantInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                {participantInfo.isOnline && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '12px',
                    height: '12px',
                    background: '#10B981',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }} />
                )}
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: '0 0 0.25rem 0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {participantInfo.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    background: participantInfo.role === 'patient' 
                      ? 'rgba(59, 130, 246, 0.1)'
                      : participantInfo.role === 'colleague'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(139, 92, 246, 0.1)',
                    color: participantInfo.role === 'patient' 
                      ? '#2563EB'
                      : participantInfo.role === 'colleague'
                      ? '#059669'
                      : '#7C3AED'
                  }}>
                    {participantInfo.role === 'patient' ? 'Paciente' : 
                     participantInfo.role === 'colleague' ? 'Colega' : 'Grupo'}
                  </span>
                  {participantInfo.isOnline && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#10B981',
                      fontWeight: 500
                    }}>
                      En línea
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Phone size={16} color="#3B82F6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Video size={16} color="#10B981" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowContactDetails(!showContactDetails)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MoreVertical size={16} color="#6B7280" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {loading && messages.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px'
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #E5E7EB',
                  borderTop: '2px solid #10B981',
                  borderRadius: '50%'
                }}
              />
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#9CA3AF',
              textAlign: 'center'
            }}>
              <MessageSquare size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                No hay mensajes aún
              </p>
              <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
                Envía el primer mensaje para comenzar la conversación
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === user?.id;
                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                const showTimestamp = index === 0 || 
                  (message.timestamp.getTime() - messages[index - 1].timestamp.getTime()) > 300000; // 5 minutes

                return (
                  <div key={message.id}>
                    {showTimestamp && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '1rem 0'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: 'rgba(107, 114, 128, 0.1)',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          fontWeight: 500
                        }}>
                          {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: es })}
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: '0.5rem',
                        marginBottom: showAvatar ? '1rem' : '0.25rem'
                      }}
                    >
                      {!isOwnMessage && showAvatar && (
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          flexShrink: 0
                        }}>
                          {message.senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}

                      {!isOwnMessage && !showAvatar && (
                        <div style={{ width: '32px', flexShrink: 0 }} />
                      )}

                      <div style={{
                        maxWidth: '70%',
                        position: 'relative'
                      }}>
                        {!isOwnMessage && showAvatar && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            marginBottom: '0.25rem',
                            fontWeight: 500
                          }}>
                            {message.senderName}
                          </div>
                        )}

                        <div
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: isOwnMessage 
                              ? '1.25rem 1.25rem 0.25rem 1.25rem'
                              : '1.25rem 1.25rem 1.25rem 0.25rem',
                            background: isOwnMessage 
                              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                              : 'rgba(249, 250, 251, 0.9)',
                            color: isOwnMessage ? 'white' : '#1F2937',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            fontFamily: 'Inter, sans-serif',
                            border: isOwnMessage ? 'none' : '1px solid rgba(229, 231, 235, 0.5)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            position: 'relative'
                          }}
                        >
                          {message.isDeleted ? (
                            <em style={{ opacity: 0.7 }}>Mensaje eliminado</em>
                          ) : (
                            <>
                              {message.replyTo && (
                                <div style={{
                                  padding: '0.5rem',
                                  background: isOwnMessage 
                                    ? 'rgba(255, 255, 255, 0.2)'
                                    : 'rgba(107, 114, 128, 0.1)',
                                  borderRadius: '0.5rem',
                                  marginBottom: '0.5rem',
                                  fontSize: '0.75rem',
                                  opacity: 0.8
                                }}>
                                  Respondiendo a mensaje anterior
                                </div>
                              )}
                              
                              <div>{message.content}</div>
                              
                              {message.attachments && message.attachments.length > 0 && (
                                <div style={{ marginTop: '0.5rem' }}>
                                  {message.attachments.map((attachment) => (
                                    <div key={attachment.id} style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.5rem',
                                      background: isOwnMessage 
                                        ? 'rgba(255, 255, 255, 0.2)'
                                        : 'rgba(107, 114, 128, 0.1)',
                                      borderRadius: '0.5rem',
                                      marginTop: '0.25rem'
                                    }}>
                                      {attachment.type === 'image' ? <ImageIcon size={16} /> :
                                       attachment.type === 'pdf' ? <File size={16} /> :
                                       <File size={16} />}
                                      <span style={{ fontSize: '0.75rem' }}>
                                        {attachment.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '0.5rem',
                            fontSize: '0.6875rem',
                            opacity: 0.7
                          }}>
                            <span>
                              {format(message.timestamp, 'HH:mm')}
                              {message.isEdited && ' (editado)'}
                            </span>
                            {isOwnMessage && getMessageStatusIcon(message)}
                          </div>

                          {/* Message actions (show on hover) */}
                          <div style={{
                            position: 'absolute',
                            top: '-0.5rem',
                            right: isOwnMessage ? 'auto' : '-2rem',
                            left: isOwnMessage ? '-2rem' : 'auto',
                            display: 'flex',
                            gap: '0.25rem',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                            background: 'white',
                            borderRadius: '0.5rem',
                            padding: '0.25rem',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(229, 231, 235, 0.5)'
                          }}
                          className="message-actions"
                          >
                            {isOwnMessage && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditMessage(message.id, message.content)}
                                  style={{
                                    padding: '0.25rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Edit3 size={12} color="#6B7280" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteMessage(message.id)}
                                  style={{
                                    padding: '0.25rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Trash2 size={12} color="#EF4444" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
              
              {/* Typing indicator */}
              {currentConversation.isTyping && currentConversation.isTyping.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{ width: '32px', flexShrink: 0 }} />
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                    background: 'rgba(249, 250, 251, 0.9)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#9CA3AF'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      fontStyle: 'italic'
                    }}>
                      {currentConversation.isTyping[0].userName} está escribiendo...
                    </span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input area */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(229, 231, 235, 0.3)',
          background: 'rgba(249, 250, 251, 0.5)'
        }}>
          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <File size={16} color="#3B82F6" />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#2563EB',
                    fontWeight: 500
                  }}>
                    {file.name}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFile(index)}
                    style={{
                      padding: '0.125rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={12} color="#EF4444" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Templates dropdown */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '1.5rem',
                  right: '1.5rem',
                  background: 'white',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  marginBottom: '0.5rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 10
                }}
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(229, 231, 235, 0.3)' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0
                  }}>
                    Plantillas de mensajes
                  </h4>
                </div>
                <div style={{ padding: '0.5rem' }}>
                  {templates.map((template) => (
                    <motion.button
                      key={template.id}
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                      onClick={() => handleTemplateSelect(template)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#1F2937',
                        marginBottom: '0.25rem'
                      }}>
                        {template.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {template.content}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.75rem',
            position: 'relative'
          }}>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '0.625rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.625rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Paperclip size={16} color="#6B7280" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTemplates(!showTemplates)}
                style={{
                  padding: '0.625rem',
                  background: showTemplates ? 'rgba(59, 130, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.625rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Star size={16} color={showTemplates ? '#3B82F6' : '#6B7280'} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsRecording(!isRecording)}
                style={{
                  padding: '0.625rem',
                  background: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.625rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isRecording ? <MicOff size={16} color="#EF4444" /> : <Mic size={16} color="#6B7280" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{
                  padding: '0.625rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.625rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Smile size={16} color="#6B7280" />
              </motion.button>
            </div>

            {/* Message input */}
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={messageInputRef}
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                style={{
                  width: '100%',
                  minHeight: '44px',
                  maxHeight: '120px',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  borderRadius: '1.25rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  resize: 'none',
                  background: 'white',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!messageInput.trim() && selectedFiles.length === 0}
              style={{
                padding: '0.75rem',
                background: messageInput.trim() || selectedFiles.length > 0
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'rgba(107, 114, 128, 0.3)',
                border: 'none',
                borderRadius: '50%',
                cursor: messageInput.trim() || selectedFiles.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: messageInput.trim() || selectedFiles.length > 0
                  ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                  : 'none'
              }}
            >
              <Send size={16} color="white" />
            </motion.button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </motion.div>
    );
  };

  const renderContactDetails = () => {
    if (!currentConversation || !showContactDetails) return null;

    const participantInfo = getParticipantInfo(currentConversation);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        style={{
          width: '320px',
          height: '600px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginLeft: '1.5rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Contact header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: participantInfo.role === 'patient' 
              ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
              : participantInfo.role === 'colleague'
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: '0 auto 1rem auto',
            position: 'relative'
          }}>
            {participantInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            {participantInfo.isOnline && (
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '20px',
                height: '20px',
                background: '#10B981',
                borderRadius: '50%',
                border: '3px solid white'
              }} />
            )}
          </div>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {participantInfo.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: participantInfo.role === 'patient' 
                ? 'rgba(59, 130, 246, 0.1)'
                : participantInfo.role === 'colleague'
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(139, 92, 246, 0.1)',
              color: participantInfo.role === 'patient' 
                ? '#2563EB'
                : participantInfo.role === 'colleague'
                ? '#059669'
                : '#7C3AED'
            }}>
              {participantInfo.role === 'patient' ? 'Paciente' : 
               participantInfo.role === 'colleague' ? 'Colega' : 'Grupo'}
            </span>
            {participantInfo.isOnline && (
              <span style={{
                fontSize: '0.75rem',
                color: '#10B981',
                fontWeight: 500
              }}>
                En línea
              </span>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.75rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Información
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                padding: '0.75rem',
                background: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.3)'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginBottom: '0.25rem',
                  fontWeight: 500
                }}>
                  Estado emocional promedio
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1F2937',
                  fontWeight: 600
                }}>
                  {participantInfo.role === 'patient' ? 'Estable' : 'N/A'}
                </div>
              </div>

              <div style={{
                padding: '0.75rem',
                background: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.3)'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginBottom: '0.25rem',
                  fontWeight: 500
                }}>
                  Próxima sesión
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1F2937',
                  fontWeight: 600
                }}>
                  {participantInfo.role === 'patient' ? 'Mañana 10:00' : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.75rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Acciones rápidas
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {participantInfo.role === 'patient' && (
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#2563EB',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Users size={16} />
                  Ver ficha clínica
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#059669',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Star size={16} />
                Agregar a favoritos
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExportConversation('txt')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#7C3AED',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Download size={16} />
                Exportar conversación
              </motion.button>
            </div>
          </div>

          {/* Danger zone */}
          <div>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.75rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Configuración
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#D97706',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <VolumeX size={16} />
                Silenciar notificaciones
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleArchiveConversation}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Archive size={16} />
                Archivar conversación
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBlockConversation}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#DC2626',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Blocks size={16} />
                Bloquear contacto
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderNewChatModal = () => (
    <AnimatePresence>
      {showNewChatModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowNewChatModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Nuevo Chat
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNewChatModal(false)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Buscar usuario
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#9CA3AF" style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#2563EB',
                    cursor: 'pointer'
                  }}
                >
                  Pacientes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#059669',
                    cursor: 'pointer'
                  }}
                >
                  Profesionales
                </motion.button>
              </div>

              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #E5E7EB',
                borderRadius: '0.75rem',
                padding: '0.5rem'
              }}>
                {availableUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                    onClick={() => handleCreateConversation([user.id])}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: user.role === 'patient' 
                          ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                          : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      {user.isOnline && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '10px',
                          height: '10px',
                          background: '#10B981',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        marginBottom: '0.125rem'
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280'
                      }}>
                        {user.email}
                      </div>
                    </div>

                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      background: user.role === 'patient' 
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(16, 185, 129, 0.1)',
                      color: user.role === 'patient' 
                        ? '#2563EB'
                        : '#059669'
                    }}>
                      {user.role === 'patient' ? 'Paciente' : 'Colega'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (loading && conversations.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #10B981',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
        `
      }} />

      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {renderHeader()}
        
        <div style={{
          display: 'flex',
          gap: '0',
          height: '600px'
        }}>
          {renderConversationsList()}
          {renderChatArea()}
          <AnimatePresence>
            {renderContactDetails()}
          </AnimatePresence>
        </div>

        {renderNewChatModal()}

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
                zIndex: 1000,
                maxWidth: '400px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} color="#EF4444" />
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#DC2626',
                    marginBottom: '0.25rem'
                  }}>
                    Error
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#7F1D1D'
                  }}>
                    {error}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearError}
                  style={{
                    padding: '0.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#DC2626" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .message-actions {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .message:hover .message-actions {
          opacity: 1;
        }
        
        /* Scrollbar styling */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}
