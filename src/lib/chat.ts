import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { sendChatNotification } from '@/lib/emailjs';

// Tipos para los mensajes y sesiones de chat
export interface ChatMessage {
  id?: string;
  sender: 'user' | 'bot' | 'admin';
  text: string;
  timestamp: Date | null;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  email?: string;
  name?: string;
  userId?: string;
  resolved: boolean;
  needsHumanResponse?: boolean;
  createdAt: Timestamp | null;
  lastUpdatedAt: Timestamp | null;
}

// Función para generar o recuperar un ID de sesión
export const getChatSessionId = (): string => {
  let sessionId = localStorage.getItem('assuriva_chat_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('assuriva_chat_session_id', sessionId);
  }
  return sessionId;
};

// Función para iniciar una nueva sesión de chat
export const initChatSession = async (userData?: { email?: string; name?: string; userId?: string }): Promise<string> => {
  const sessionId = getChatSessionId();
  
  // Verificar si ya existe la sesión
  const sessionRef = doc(db, 'chats', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (!sessionSnap.exists()) {
    // Crear una nueva sesión si no existe
    const chatSessionData = {
      id: sessionId,
      messages: [{
        sender: 'bot',
        text: '¡Hola! Soy el asistente virtual de Assuriva. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date() // Usar Date en lugar de serverTimestamp
      }],
      email: userData?.email || '',
      name: userData?.name || '',
      userId: userData?.userId || '',
      resolved: false,
      createdAt: serverTimestamp(), // Esto está bien porque no está dentro de un array
      lastUpdatedAt: serverTimestamp() // Esto está bien porque no está dentro de un array
    };
    
    // Usar setDoc en lugar de updateDoc o addDoc
    await setDoc(sessionRef, chatSessionData);
  }
  
  return sessionId;
};

// Función para enviar un mensaje de usuario
export const sendUserMessage = async (
  sessionId: string, 
  message: string, 
  userData?: { email?: string; name?: string; userId?: string }
): Promise<void> => {
  const sessionRef = doc(db, 'chats', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (!sessionSnap.exists()) {
    await initChatSession(userData);
    // Obtener la sesión recién creada
    const newSessionSnap = await getDoc(sessionRef);
    if (!newSessionSnap.exists()) {
      console.error('No se pudo crear la sesión de chat');
      return;
    }
  }


  // Obtener los mensajes actuales
  const currentSession = sessionSnap.exists() ? sessionSnap.data() as ChatSession : null;
  const currentMessages = currentSession?.messages || [];
  
  // Añadir el mensaje del usuario
  const userMessage: ChatMessage = {
    sender: 'user',
    text: message,
    timestamp: new Date() // Usar Date en lugar de serverTimestamp
  };
  
  // Actualizar el documento con el nuevo mensaje
  await updateDoc(sessionRef, {
    messages: [...currentMessages, userMessage],
    lastUpdatedAt: serverTimestamp(), // Esto está bien porque no está dentro de un array
    ...(userData?.email && { email: userData.email }),
    ...(userData?.name && { name: userData.name }),
    ...(userData?.userId && { userId: userData.userId }),
  });
  
  // Procesar la respuesta del bot
  const botResponse = generateBotResponse(message);
  
  // Si el bot tiene una respuesta, la enviamos
  if (botResponse) {
    setTimeout(async () => {
      await sendBotMessage(sessionId, botResponse);
    }, 1000); // Simular tiempo de respuesta del bot
  } else {
    // Si no hay respuesta del bot, notificar al equipo
    await updateDoc(sessionRef, {
      needsHumanResponse: true
    });
    
    // Enviar notificación por email
    await sendChatNotification({
      sessionId,
      userMessage: message,
      userEmail: userData?.email
    });
    
    // Enviar mensaje de derivación a agente humano
    setTimeout(async () => {
      await sendBotMessage(
        sessionId, 
        "Estamos derivando tu consulta a un agente humano. En breve te atenderemos personalmente."
      );
    }, 1000);
  }
};

// Función para enviar un mensaje del bot
export const sendBotMessage = async (sessionId: string, message: string): Promise<void> => {
  const sessionRef = doc(db, 'chats', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (sessionSnap.exists()) {
    const currentMessages = sessionSnap.data().messages || [];
    
    const botMessage: ChatMessage = {
      sender: 'bot',
      text: message,
      timestamp: new Date() // Usar Date en lugar de serverTimestamp
    };
    
    await updateDoc(sessionRef, {
      messages: [...currentMessages, botMessage],
      lastUpdatedAt: serverTimestamp() // Esto está bien porque no está dentro de un array
    });
  }
};

// Función para enviar un mensaje del administrador
export const sendAdminMessage = async (sessionId: string, message: string): Promise<void> => {
  const sessionRef = doc(db, 'chats', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (sessionSnap.exists()) {
    const currentMessages = sessionSnap.data().messages || [];
    
    const adminMessage: ChatMessage = {
      sender: 'admin',
      text: message,
      timestamp: new Date() // Usar Date en lugar de serverTimestamp
    };
    
    await updateDoc(sessionRef, {
      messages: [...currentMessages, adminMessage],
      lastUpdatedAt: serverTimestamp(), // Esto está bien porque no está dentro de un array
      needsHumanResponse: false // Marcar como respondido
    });
  }
};

// Función para marcar un chat como resuelto
export const markChatAsResolved = async (sessionId: string): Promise<void> => {
  const sessionRef = doc(db, 'chats', sessionId);
  await updateDoc(sessionRef, {
    resolved: true,
    lastUpdatedAt: serverTimestamp() // Esto está bien porque no está dentro de un array
  });
};

// Función para obtener todos los chats activos (para el panel de administración)
export const getActiveChats = async (): Promise<ChatSession[]> => {
  const chatsQuery = query(
    collection(db, 'chats'),
    where('resolved', '==', false),
    where('needsHumanResponse', '==', true),
    orderBy('lastUpdatedAt', 'desc')
  );

  const querySnapshot = await getDocs(chatsQuery);
  const chats: ChatSession[] = [];

  querySnapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() } as ChatSession);
  });

  return chats;
};

// Función para escuchar cambios en un chat específico
export const subscribeToChatSession = (
  sessionId: string, 
  callback: (session: ChatSession) => void
) => {
  const sessionRef = doc(db, 'chats', sessionId);
  
  return onSnapshot(sessionRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as ChatSession);
    }
  });
};

// Función para escuchar cambios en todos los chats activos
export const subscribeToActiveChats = (
  callback: (chats: ChatSession[]) => void
) => {
  const chatsQuery = query(
    collection(db, 'chats'),
    where('resolved', '==', false),
    where('needsHumanResponse', '==', true), // 🔥 CLAVE PARA VER LOS CHATS QUE NECESITAN RESPUESTA
    orderBy('lastUpdatedAt', 'desc')
  );

  return onSnapshot(chatsQuery, (querySnapshot) => {
    const chats: ChatSession[] = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as ChatSession);
    });
    callback(chats);
  });
};


// Función para generar respuestas automáticas del bot
const generateBotResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('precio') || lowerMessage.includes('plan') || lowerMessage.includes('costo')) {
    return "Tenemos varios planes adaptados a diferentes necesidades. Nuestro plan Profesional cuesta 29$/mes con facturación anual. ¿Te gustaría más información sobre nuestros planes?";
  } else if (lowerMessage.includes('demo') || lowerMessage.includes('prueba')) {
    return "¡Claro! Ofrecemos una demo personalizada con uno de nuestros especialistas. También puedes probar nuestro plan Profesional gratis durante 7 días sin compromiso.";
  } else if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('email')) {
    return "Puedes contactarnos por teléfono al +598 92 388 748 o por email a assuriva@gmail.com. Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.";
  } else if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas tardes')) {
    return "¡Hola! Bienvenido a Assuriva. ¿En qué puedo ayudarte hoy?";
  } else if (lowerMessage.includes('gracias')) {
    return "¡De nada! Estamos para ayudarte. ¿Hay algo más en lo que pueda asistirte?";
  }
  
  // Si no hay coincidencias, devolver null para que un agente humano responda
  return null;
};