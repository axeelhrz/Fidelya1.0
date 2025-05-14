import { db, auth, storage } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  serverTimestamp,
  onSnapshot,
  Timestamp,
  startAfter,
  DocumentSnapshot,
  increment,
  writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Message, MessageType } from "@/types/message";
import { checkPlanLimits } from "./contacts.services";

// Enviar mensaje de texto
export const sendTextMessage = async (chatId: string, recipientId: string, text: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Crear mensaje
    const messageRef = doc(collection(db, "chats", chatId, "messages"));
    await setDoc(messageRef, {
      id: messageRef.id,
      senderId: currentUser.uid,
      recipientId: recipientId,
      text: text,
      type: 'text',
      createdAt: serverTimestamp(),
      read: false,
      delivered: false
    });
    
    // Actualizar último mensaje en el chat
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: {
        text: text.length > 50 ? text.substring(0, 50) + '...' : text,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      },
      lastActivity: serverTimestamp()
    });
    
    // Actualizar último mensaje en los contactos
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", recipientId), {
      lastMessage: text.length > 50 ? text.substring(0, 50) + '...' : text,
      lastMessageTime: serverTimestamp()
    });
    
    await updateDoc(doc(db, "users", recipientId, "contacts", currentUser.uid), {
      lastMessage: text.length > 50 ? text.substring(0, 50) + '...' : text,
      lastMessageTime: serverTimestamp(),
      unreadCount: increment(1)
    });
    
    return { success: true, message: "Mensaje enviado correctamente" };
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    return { success: false, message: "Error al enviar el mensaje" };
  }
};

// Enviar archivo adjunto
export const sendFileMessage = async (
  chatId: string, 
  recipientId: string, 
  file: File, 
  caption: string = ""
): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Verificar si el usuario puede enviar archivos
    const canSendFiles = await checkPlanLimits(currentUser.uid, 'fileAttachments');
    if (!canSendFiles) {
      return { success: false, message: "Tu plan no permite enviar archivos adjuntos" };
    }
    
    // Determinar el tipo de mensaje
    let messageType: MessageType = 'file';
    if (file.type.startsWith('image/')) {
      messageType = 'image';
    } else if (file.type === 'application/pdf') {
      messageType = 'pdf';
    }
    
    // Subir archivo a Storage
    const fileRef = ref(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);
    
    // Crear mensaje
    const messageRef = doc(collection(db, "chats", chatId, "messages"));
    await setDoc(messageRef, {
      id: messageRef.id,
      senderId: currentUser.uid,
      recipientId: recipientId,
      text: caption,
      type: messageType,
      fileUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      createdAt: serverTimestamp(),
      read: false,
      delivered: false
    });
    
    // Actualizar último mensaje en el chat
    const messagePreview = caption || `[${messageType === 'image' ? 'Imagen' : messageType === 'pdf' ? 'PDF' : 'Archivo'}]`;
    
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: {
        text: messagePreview,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      },
      lastActivity: serverTimestamp()
    });
    
    // Actualizar último mensaje en los contactos
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", recipientId), {
      lastMessage: messagePreview,
      lastMessageTime: serverTimestamp()
    });
    
    await updateDoc(doc(db, "users", recipientId, "contacts", currentUser.uid), {
      lastMessage: messagePreview,
      lastMessageTime: serverTimestamp(),
      unreadCount: increment(1)
    });
    
    return { success: true, message: "Archivo enviado correctamente" };
  } catch (error) {
    console.error("Error al enviar archivo:", error);
    return { success: false, message: "Error al enviar el archivo" };
  }
};

// Obtener mensajes de un chat
export const getMessages = (
  chatId: string, 
  callback: (messages: Message[]) => void,
  messagesLimit: number = 20
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "desc"),
    limit(messagesLimit)
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messagesList: Message[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Message;
      messagesList.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt as Timestamp
      });
    });
    // Ordenar por fecha ascendente para mostrar
    callback(messagesList.reverse());
  });
};

// Cargar más mensajes (paginación)
export const loadMoreMessages = async (
  chatId: string, 
  lastMessage: DocumentSnapshot,
  messagesLimit: number = 20
): Promise<Message[]> => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      startAfter(lastMessage),
      limit(messagesLimit)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    
    const messagesList: Message[] = [];
    messagesSnapshot.forEach((doc) => {
      const data = doc.data() as Message;
      messagesList.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt as Timestamp
      });
    });
    
    // Ordenar por fecha ascendente para mostrar
    return messagesList.reverse();
  } catch (error) {
    console.error("Error al cargar más mensajes:", error);
    return [];
  }
};

// Marcar mensajes como leídos
export const markMessagesAsRead = async (chatId: string, contactId: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Obtener mensajes no leídos
    const messagesRef = collection(db, "chats", chatId, "messages");
    const unreadQuery = query(
      messagesRef,
      where("recipientId", "==", currentUser.uid),
      where("read", "==", false)
    );
    
    const unreadSnapshot = await getDocs(unreadQuery);
    const batch = writeBatch(db);
    // Actualizar cada mensaje
    unreadSnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
    
    // Resetear contador de no leídos
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", contactId), {
      unreadCount: 0
    });
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
  }
};

// Eliminar mensaje
export const deleteMessage = async (chatId: string, messageId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Obtener mensaje
    const messageDoc = await getDoc(doc(db, "chats", chatId, "messages", messageId));
    
    if (!messageDoc.exists()) {
      return { success: false, message: "Mensaje no encontrado" };
    }
    
    const messageData = messageDoc.data() as Message;
    
    // Verificar que sea el remitente
    if (messageData.senderId !== currentUser.uid) {
      return { success: false, message: "No tienes permiso para eliminar este mensaje" };
    }
    
    // Eliminar archivo si existe
    if (messageData.fileUrl) {
      const fileRef = ref(storage, messageData.fileUrl);
      try {
        // Intentar eliminar el archivo, pero no fallar si no existe
        await deleteObject(fileRef);
      } catch (error) {
        console.warn("No se pudo eliminar el archivo:", error);
      }
    }
    
    // Actualizar mensaje (no eliminar, para mantener la conversación)
    await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
      text: "Este mensaje fue eliminado",
      type: 'deleted',
      fileUrl: null,
      fileName: null,
      fileSize: null,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: "Mensaje eliminado correctamente" };
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
    return { success: false, message: "Error al eliminar el mensaje" };
  }
};

// Obtener estado de conexión de un usuario
export const getUserOnlineStatus = (userId: string, callback: (isOnline: boolean, lastSeen: Timestamp | null) => void) => {
  const userRef = doc(db, "users", userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      callback(
        userData.isOnline || false, 
        userData.lastSeen as Timestamp || null
      );
    } else {
      callback(false, null);
    }
  });
};

// Obtener total de mensajes no leídos
export const getTotalUnreadMessages = (userId: string, callback: (count: number) => void) => {
  const contactsRef = collection(db, "users", userId, "contacts");
  
  return onSnapshot(contactsRef, (snapshot) => {
    let totalUnread = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      totalUnread += data.unreadCount || 0;
    });
    callback(totalUnread);
  });
};