import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { Message } from '@/types/message';
import { DocumentSnapshot } from 'firebase/firestore';
import {
  sendTextMessage,
  sendFileMessage,
  getMessages,
  loadMoreMessages,
  markMessagesAsRead,
  deleteMessage,
  getUserOnlineStatus,
  getTotalUnreadMessages
} from '@/components/services/message.services';

export const useMessages = (chatId: string, contactId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isContactOnline, setIsContactOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [totalUnread, setTotalUnread] = useState<number>(0);
  const lastMessageRef = useRef<DocumentSnapshot | null>(null);

  // Cargar mensajes
  useEffect(() => {
    if (!user || !chatId) return;

    setLoading(true);
    const unsubscribe = getMessages(chatId, (data) => {
      setMessages(data);
      setLoading(false);
      
      // Guardar referencia al último mensaje para paginación
      if (data.length > 0) {
        // Aquí necesitaríamos la referencia real del documento
        // lastMessageRef.current = data[0]._snapshot;
      }
      
      // Marcar mensajes como leídos
      markMessagesAsRead(chatId, contactId);
    });

    return () => unsubscribe();
  }, [user, chatId, contactId]);

  // Obtener estado en línea del contacto
  useEffect(() => {
    if (!user || !contactId) return;

    const unsubscribe = getUserOnlineStatus(contactId, (isOnline, lastSeenTimestamp) => {
      setIsContactOnline(isOnline);
      setLastSeen(lastSeenTimestamp ? lastSeenTimestamp.toDate() : null);
    });

    return () => unsubscribe();
  }, [user, contactId]);

  // Obtener total de mensajes no leídos
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getTotalUnreadMessages(user.uid, (count) => {
      setTotalUnread(count);
    });

    return () => unsubscribe();
  }, [user]);

  // Cargar más mensajes (paginación)
  const loadMore = useCallback(async () => {
    if (!user || !chatId || !lastMessageRef.current || !hasMore) return;
    
    try {
      setLoading(true);
      const moreMessages = await loadMoreMessages(chatId, lastMessageRef.current);
      
      if (moreMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...moreMessages, ...prev]);
        // Actualizar referencia al último mensaje
        // lastMessageRef.current = moreMessages[0]._snapshot;
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar más mensajes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, chatId, hasMore]);

  // Enviar mensaje de texto
  const sendMessage = useCallback(async (text: string) => {
    if (!user || !chatId || !contactId) return { success: false, message: 'No se puede enviar el mensaje' };
    
    try {
      setError(null);
      await sendTextMessage(chatId, user.uid, text);
      return { success: true, message: 'Mensaje enviado' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar mensaje';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user, chatId, contactId]);

  // Enviar archivo
  const sendFile = useCallback(async (file: File, caption: string = '') => {
    if (!user || !chatId || !contactId) return { success: false, message: 'No se puede enviar el archivo' };
    
    try {
      await sendFileMessage(chatId, user.uid, file, caption);
      return { success: true, message: 'Archivo enviado' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar archivo';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user, chatId, contactId]);

  // Eliminar mensaje
  const removeMessage = useCallback(async (messageId: string) => {
    if (!user || !chatId) return { success: false, message: 'No se puede eliminar el mensaje' };
    
    try {
      await deleteMessage(chatId, messageId);
      return { success: true, message: 'Mensaje eliminado' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar mensaje';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user, chatId]);

  // Marcar como leído
  const markAsRead = useCallback(() => {
    if (!user || !chatId || !contactId) return;
    markMessagesAsRead(chatId, contactId);
  }, [user, chatId, contactId]);

  return {
    messages,
    loading,
    error,
    hasMore,
    isContactOnline,
    lastSeen,
    totalUnread,
    loadMore,
    sendMessage,
    sendFile,
    removeMessage,
    markAsRead
  };
};