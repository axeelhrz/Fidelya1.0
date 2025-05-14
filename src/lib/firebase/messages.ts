import { db, storage } from '../firebase';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  limit as firestoreLimit,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import type { 
  Message, 
  MessageType, 
  MessageAttachment,
} from '@/types/message';
import type { Chat, ChatReadStatus } from '@/types/chat';

export class MessagesService {
  private readonly chatsCollection = 'chats';
  private readonly messagesCollection = 'messages';
  private readonly readStatusCollection = 'readStatus';

  /**
   * Crea un nuevo chat entre dos usuarios
   */
  async createChat(participantIds: string[]): Promise<string> {
    try {
      // Verificar si ya existe un chat entre estos usuarios
      const existingChat = await this.findExistingChat(participantIds);
      if (existingChat) {
        return existingChat.id;
      }

      const chatData: Omit<Chat, 'id'> = {
        participants: participantIds,
        type: 'direct',
        createdAt: Timestamp.now() as unknown as Date,
        updatedAt: Timestamp.now() as unknown as Date,
        metadata: {
          isArchived: false,
          isPinned: false,
          muteNotifications: false,
        }
      };

      const chatRef = await addDoc(
        collection(db, this.chatsCollection),
        chatData
      );

      // Inicializar estado de lectura para todos los participantes
      const batch = writeBatch(db);
      participantIds.forEach(userId => {
        const readStatusRef = doc(collection(db, this.readStatusCollection));
        batch.set(readStatusRef, {
          chatId: chatRef.id,
          userId,
          lastReadMessageId: null,
          lastReadAt: null,
          unreadCount: 0
        });
      });
      await batch.commit();

      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error('Error al crear el chat');
    }
  }

  /**
   * Envía un mensaje en un chat
   */
  async sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: MessageType = 'text',
    attachment?: File
  ): Promise<string> {
    try {
      const messageData: Partial<Message> = {
        chatId: chatId,
        senderId: senderId,
        text: content, // Assuming the correct property name is 'text' instead of 'content'
        type, // Using the type parameter which is already typed as MessageType
        createdAt: Timestamp.now(),
        status: 'sent', // Using a valid status from the Message type
        metadata: undefined, // Initialize metadata property
      };

      // Si hay un archivo adjunto, subirlo primero
      if (attachment && (type === 'file' || type === 'image')) {
        const metadata = await this.uploadAttachment(chatId, attachment);
        messageData.metadata = {
          ...metadata,
          // The attachment type is already set in uploadAttachment method, 
          // so we don't need to override it here
        };
      }

      // Crear el mensaje
      const messageRef = await addDoc(
        collection(db, this.chatsCollection, chatId, this.messagesCollection),
        messageData
      );

      // Actualizar el último mensaje del chat
      await updateDoc(doc(db, this.chatsCollection, chatId), {
        lastMessage: {
          id: messageRef.id,
          content,
          type,
          timestamp: messageData.createdAt,
        },
        updatedAt: messageData.createdAt,
      });

      // Actualizar estado del mensaje a enviado
      await updateDoc(messageRef, {
        status: 'sent'
      });

      // Actualizar contadores de mensajes no leídos
      await this.updateUnreadCounters(chatId, senderId);

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Error al enviar el mensaje');
    }
  }

  /**
   * Marca un mensaje como leído
   */
  async markMessageAsRead(
    chatId: string,
    messageId: string,
    userId: string
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Actualizar estado del mensaje
      const messageRef = doc(db, this.chatsCollection, chatId, this.messagesCollection, messageId);
      batch.update(messageRef, {
        status: 'read'
      });

      // Actualizar estado de lectura del usuario
      const readStatusQuery = query(
        collection(db, this.readStatusCollection),
        where('chatId', '==', chatId),
        where('userId', '==', userId)
      );
      
      const readStatusDocs = await getDocs(readStatusQuery);
      if (!readStatusDocs.empty) {
        batch.update(readStatusDocs.docs[0].ref, {
          lastReadMessageId: messageId,
          lastReadAt: serverTimestamp(),
          unreadCount: 0
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error('Error al marcar mensaje como leído');
    }
  }

  /**
   * Suscribe a mensajes de un chat
   */
  subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void,
    limit: number = 50
  ): () => void {
    const messagesRef = collection(db, this.chatsCollection, chatId, this.messagesCollection);
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      firestoreLimit(limit)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Message[];

      // Ordenar mensajes del más antiguo al más reciente
      callback(messages.reverse());
    });
  }

  /**
   * Suscribe a los chats de un usuario
   */
  subscribeToChats(
    userId: string,
    callback: (chats: Chat[]) => void
  ): () => void {
    const chatsRef = collection(db, this.chatsCollection);
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        lastMessage: doc.data().lastMessage ? {
          ...doc.data().lastMessage,
          timestamp: doc.data().lastMessage.timestamp.toDate()
        } : null
      })) as Chat[];

      callback(chats);
    });
  }

  /**
   * Suscribe al estado de lectura de un chat
   */
  subscribeToReadStatus(
    chatId: string,
    callback: (readStatus: ChatReadStatus[]) => void
  ): () => void {
    const readStatusRef = collection(db, this.readStatusCollection);
    const q = query(readStatusRef, where('chatId', '==', chatId));

    return onSnapshot(q, (snapshot) => {
      const readStatus = snapshot.docs.map(doc => ({
        ...doc.data(),
        lastReadAt: doc.data().lastReadAt?.toDate() || null
      })) as ChatReadStatus[];

      callback(readStatus);
    });
  }

  // Métodos privados auxiliares
  private async findExistingChat(participantIds: string[]): Promise<Chat | null> {
    const chatsRef = collection(db, this.chatsCollection);
    const q = query(
      chatsRef,
      where('participants', '==', participantIds.sort())
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const chatData = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...chatData,
      createdAt: chatData.createdAt.toDate(),
      updatedAt: chatData.updatedAt.toDate()
    } as Chat;
  }

  private async uploadAttachment(
    chatId: string,
    file: File
  ): Promise<MessageAttachment> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${chatId}/${Date.now()}.${fileExtension}`;
    const fileRef = ref(storage, `chats/${fileName}`);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return {
      id: fileName,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: downloadURL,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      path: `chats/${fileName}`
    };
  }

  private async updateUnreadCounters(
    chatId: string,
    senderId: string
  ): Promise<void> {
    const readStatusRef = collection(db, this.readStatusCollection);
    const q = query(
      readStatusRef,
      where('chatId', '==', chatId),
      where('userId', '!=', senderId)
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        unreadCount: (doc.data().unreadCount || 0) + 1
      });
    });

    await batch.commit();
  }

  /**
   * Elimina un mensaje
   */
  async deleteMessage(
    chatId: string,
    messageId: string
  ): Promise<void> {
    try {
      const messageRef = doc(db, this.chatsCollection, chatId, this.messagesCollection, messageId);
      const messageDoc = await getDoc(messageRef);

      if (!messageDoc.exists()) {
        throw new Error('Mensaje no encontrado');
      }

      const messageData = messageDoc.data();

      // Si hay un archivo adjunto, eliminarlo del storage
      if (messageData.metadata?.url) {
        const fileRef = ref(storage, messageData.metadata.id);
        await deleteObject(fileRef);
      }

      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Error al eliminar el mensaje');
    }
  }
}

// Exportar una instancia única del servicio
export const messagesService = new MessagesService();