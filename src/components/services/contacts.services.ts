import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query as firestoreQuery, 
  where, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { Contact, ContactStatus } from "@/types/contact";
import { User } from "@/types/user";

// Límites por plan
const PLAN_LIMITS = {
  'basic': {
    maxContacts: 10,
    messageHistory: 30, // días
    realTimeStatus: false,
    fileAttachments: false,
    shareItems: false,
    pushNotifications: false,
    contactMetrics: false
  },
  'pro': {
    maxContacts: 100,
    messageHistory: 365, // días
    realTimeStatus: true,
    fileAttachments: false,
    shareItems: true,
    pushNotifications: true,
    contactMetrics: true
  },
  'enterprise': {
    maxContacts: Infinity,
    messageHistory: Infinity, // ilimitado
    realTimeStatus: true,
    fileAttachments: true,
    shareItems: true,
    pushNotifications: true,
    contactMetrics: true
  }
};

// Verificar límites del plan
export const checkPlanLimits = async (userId: string, feature: keyof typeof PLAN_LIMITS['basic']) => {
  try {
    // Obtener información de suscripción del usuario
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data() as User;
    const planType = userData?.subscription?.type || 'basic';
    
    return PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS][feature];
  } catch (error) {
    console.error("Error al verificar límites del plan:", error);
    return PLAN_LIMITS['basic'][feature]; // Por defecto, usar límites básicos
  }
};

// Verificar si el usuario puede agregar más contactos
export const canAddMoreContacts = async (userId: string): Promise<boolean> => {
  try {
    // Obtener el límite de contactos según el plan
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data() as User;
    const planType = userData?.subscription?.type || 'basic';
    const maxContacts = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS].maxContacts;
    
    // Contar contactos actuales
    const contactsQuery = firestoreQuery(collection(db, "users", userId, "contacts"));
    const contactsSnapshot = await getDocs(contactsQuery);
    const currentContactsCount = contactsSnapshot.size;
    
    return currentContactsCount < maxContacts;
  } catch (error) {
    console.error("Error al verificar límite de contactos:", error);
    return false;
  }
};

// Enviar solicitud de contacto
export const sendContactRequest = async (senderEmail: string, recipientEmail: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Verificar si el usuario puede agregar más contactos
    const canAdd = await canAddMoreContacts(currentUser.uid);
    if (!canAdd) {
      return { success: false, message: "Has alcanzado el límite de contactos para tu plan" };
    }
    
    // Verificar que no se esté enviando a sí mismo
    if (senderEmail === recipientEmail) {
      return { success: false, message: "No puedes enviarte una solicitud a ti mismo" };
    }
    
    // Buscar al destinatario por email
    const usersQuery = firestoreQuery(collection(db, "users"), where("email", "==", recipientEmail));
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      return { success: false, message: "No se encontró ningún usuario con ese correo" };
    }
    
    const recipientData = usersSnapshot.docs[0].data() as User;
    const recipientId = usersSnapshot.docs[0].id;
    
    // Verificar que no exista ya una solicitud o contacto
    const existingContactQuery = firestoreQuery(
      collection(db, "users", currentUser.uid, "contacts"),
      where("email", "==", recipientEmail)
    );
    const existingContactSnapshot = await getDocs(existingContactQuery);
    
    if (!existingContactSnapshot.empty) {
      const contactData = existingContactSnapshot.docs[0].data() as Contact;
      if (contactData.status === 'accepted') {
        return { success: false, message: "Este usuario ya es tu contacto" };
      } else if (contactData.status === 'pending') {
        return { success: false, message: "Ya has enviado una solicitud a este usuario" };
      } else if (contactData.status === 'blocked') {
        return { success: false, message: "Has bloqueado a este usuario" };
      }
    }
    
    // Verificar si el destinatario nos ha bloqueado
    const recipientContactQuery = firestoreQuery(
      collection(db, "users", recipientId, "contacts"),
      where("email", "==", senderEmail)
    );
    const recipientContactSnapshot = await getDocs(recipientContactQuery);
    
    if (!recipientContactSnapshot.empty) {
      const recipientContactData = recipientContactSnapshot.docs[0].data() as Contact;
      if (recipientContactData.status === 'blocked') {
        return { success: false, message: "No se puede enviar la solicitud en este momento" };
      }
    }
    
    // Crear un ID único para el chat
    const chatId = doc(collection(db, "chats")).id;
    
    // Crear solicitud en el remitente
    await setDoc(doc(db, "users", currentUser.uid, "contacts", recipientId), {
      uid: recipientId,
      email: recipientEmail,
      displayName: recipientData.displayName || recipientEmail.split('@')[0],
      photoURL: recipientData.photoURL || null,
      status: 'pending',
      createdAt: serverTimestamp(),
      chatId: chatId,
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isFavorite: false
    });
    
    // Crear solicitud en el destinatario
    await setDoc(doc(db, "users", recipientId, "contacts", currentUser.uid), {
      uid: currentUser.uid,
      email: senderEmail,
      displayName: currentUser.displayName || senderEmail.split('@')[0],
      photoURL: currentUser.photoURL || null,
      status: 'received',
      createdAt: serverTimestamp(),
      chatId: chatId,
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isFavorite: false
    });
    
    // Crear documento de chat vacío
    await setDoc(doc(db, "chats", chatId), {
      participants: [currentUser.uid, recipientId],
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    });
    
    // Crear notificación para el destinatario
    await setDoc(doc(collection(db, "users", recipientId, "notifications")), {
      type: 'contact_request',
      from: {
        uid: currentUser.uid,
        displayName: currentUser.displayName || senderEmail.split('@')[0],
        email: senderEmail,
        photoURL: currentUser.photoURL || null
      },
      read: false,
      createdAt: serverTimestamp()
    });
    
    return { success: true, message: "Solicitud enviada correctamente" };
  } catch (error) {
    console.error("Error al enviar solicitud de contacto:", error);
    return { success: false, message: "Error al enviar la solicitud" };
  }
};

// Aceptar solicitud de contacto
export const acceptContactRequest = async (contactId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Verificar si el usuario puede agregar más contactos
    const canAdd = await canAddMoreContacts(currentUser.uid);
    if (!canAdd) {
      return { success: false, message: "Has alcanzado el límite de contactos para tu plan" };
    }
    
    // Obtener datos del contacto
    const contactDoc = await getDoc(doc(db, "users", currentUser.uid, "contacts", contactId));
    
    if (!contactDoc.exists()) {
      return { success: false, message: "Solicitud no encontrada" };
    }
    
    const contactData = contactDoc.data() as Contact;
    
    if (contactData.status !== 'received') {
      return { success: false, message: "Esta solicitud no puede ser aceptada" };
    }
    
    // Actualizar estado en ambos usuarios
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", contactId), {
      status: 'accepted',
      updatedAt: serverTimestamp()
    });
    
    await updateDoc(doc(db, "users", contactId, "contacts", currentUser.uid), {
      status: 'accepted',
      updatedAt: serverTimestamp()
    });
    
    // Crear notificación para el remitente original
    await setDoc(doc(collection(db, "users", contactId, "notifications")), {
      type: 'contact_accepted',
      from: {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email?.split('@')[0],
        email: currentUser.email,
        photoURL: currentUser.photoURL || null
      },
      read: false,
      createdAt: serverTimestamp()
    });
    
    return { success: true, message: "Contacto aceptado correctamente" };
  } catch (error) {
    console.error("Error al aceptar solicitud de contacto:", error);
    return { success: false, message: "Error al aceptar la solicitud" };
  }
};

// Rechazar solicitud de contacto
export const rejectContactRequest = async (contactId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Obtener datos del contacto
    const contactDoc = await getDoc(doc(db, "users", currentUser.uid, "contacts", contactId));
    
    if (!contactDoc.exists()) {
      return { success: false, message: "Solicitud no encontrada" };
    }
    
    const contactData = contactDoc.data() as Contact;
    
    if (contactData.status !== 'received') {
      return { success: false, message: "Esta solicitud no puede ser rechazada" };
    }
    
    // Eliminar contacto en ambos usuarios
    await deleteDoc(doc(db, "users", currentUser.uid, "contacts", contactId));
    await deleteDoc(doc(db, "users", contactId, "contacts", currentUser.uid));
    
    return { success: true, message: "Solicitud rechazada correctamente" };
  } catch (error) {
    console.error("Error al rechazar solicitud de contacto:", error);
    return { success: false, message: "Error al rechazar la solicitud" };
  }
};

// Bloquear contacto
export const blockContact = async (contactId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Actualizar estado a bloqueado
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", contactId), {
      status: 'blocked',
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: "Contacto bloqueado correctamente" };
  } catch (error) {
    console.error("Error al bloquear contacto:", error);
    return { success: false, message: "Error al bloquear el contacto" };
  }
};

// Desbloquear contacto
export const unblockContact = async (contactId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Actualizar estado a aceptado
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", contactId), {
      status: 'accepted',
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: "Contacto desbloqueado correctamente" };
  } catch (error) {
    console.error("Error al desbloquear contacto:", error);
    return { success: false, message: "Error al desbloquear el contacto" };
  }
};

// Marcar contacto como favorito
export const toggleFavoriteContact = async (contactId: string, isFavorite: boolean): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, message: "No has iniciado sesión" };
    }
    
    // Actualizar estado de favorito
    await updateDoc(doc(db, "users", currentUser.uid, "contacts", contactId), {
      isFavorite: isFavorite,
      updatedAt: serverTimestamp()
    });
    
    return { 
      success: true, 
      message: isFavorite ? "Contacto marcado como favorito" : "Contacto desmarcado como favorito" 
    };
  } catch (error) {
    console.error("Error al actualizar favorito:", error);
    return { success: false, message: "Error al actualizar el contacto" };
  }
};

// Obtener todos los contactos
export const getContacts = (userId: string, callback: (contacts: Contact[]) => void) => {
  const contactsRef = collection(db, "users", userId, "contacts");
  
  return onSnapshot(contactsRef, (snapshot) => {
    const contactsList: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Contact;
      contactsList.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt as Timestamp,
        lastMessageTime: data.lastMessageTime as Timestamp || null
      });
    });
    callback(contactsList);
  });
};

// Obtener contactos por estado
export const getContactsByStatus = (userId: string, status: ContactStatus, callback: (contacts: Contact[]) => void) => {
  const contactsRef = collection(db, "users", userId, "contacts");
  const contactsQuery = firestoreQuery(contactsRef, where("status", "==", status));
  
  return onSnapshot(contactsQuery, (snapshot) => {
    const contactsList: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Contact;
      contactsList.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt as Timestamp,
        lastMessageTime: data.lastMessageTime as Timestamp || null
      });
    });
    callback(contactsList);
  });
};

// Obtener contactos favoritos
export const getFavoriteContacts = (userId: string, callback: (contacts: Contact[]) => void) => {
  const contactsRef = collection(db, "users", userId, "contacts");
  const contactsQuery = firestoreQuery(
    contactsRef, 
    where("status", "==", "accepted"),
    where("isFavorite", "==", true)
  );
  
  return onSnapshot(contactsQuery, (snapshot) => {
    const contactsList: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Contact;
      contactsList.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt as Timestamp,
        lastMessageTime: data.lastMessageTime as Timestamp || null
      });
    });
    callback(contactsList);
  });
};

// Obtener solicitudes pendientes recibidas
export const getPendingRequests = (userId: string, callback: (requests: Contact[]) => void) => {
  const contactsRef = collection(db, "users", userId, "contacts");
  const contactsQuery = firestoreQuery(contactsRef, where("status", "==", "received"));
  
  return onSnapshot(contactsQuery, (snapshot) => {
    const requestsList: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Contact;
      requestsList.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt as Timestamp,
        lastMessageTime: data.lastMessageTime as Timestamp || null
      });
    });
    callback(requestsList);
  });
};

// Obtener contactos bloqueados
export const getBlockedContacts = (userId: string, callback: (contacts: Contact[]) => void) => {
  const contactsRef = collection(db, "users", userId, "contacts");
  const contactsQuery = firestoreQuery(contactsRef, where("status", "==", "blocked"));
  
  return onSnapshot(contactsQuery, (snapshot) => {
    const contactsList: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Contact;
      contactsList.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt as Timestamp,
        lastMessageTime: data.lastMessageTime as Timestamp || null
      });
    });
    callback(contactsList);
  });
};

// Actualizar estado en línea
export const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isOnline: isOnline,
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error("Error al actualizar estado en línea:", error);
  }
};

// Buscar usuarios por email (para autocompletado)
export const searchUsersByEmail = async (query: string, limit: number = 5): Promise<User[]> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return [];
    }
    
    // Verificar si el usuario tiene permisos para buscar (Pro o Enterprise)
    const canSearch = await checkPlanLimits(currentUser.uid, 'shareItems');
    if (!canSearch) {
      return [];
    }
    
    // Buscar usuarios que coincidan con el email
    const usersRef = collection(db, "users");
    const usersQuery = firestoreQuery(
      usersRef,
      where("email", ">=", query),
      where("email", "<=", query + '\uf8ff')
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    const results: User[] = [];
    usersSnapshot.forEach((doc) => {
      // No incluir al usuario actual
      if (doc.id !== currentUser.uid) {
        const userData = doc.data() as User;
        results.push({
          uid: doc.id,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        } as User);
      }
    });
    
    return results.slice(0, limit);
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return [];
  }
};