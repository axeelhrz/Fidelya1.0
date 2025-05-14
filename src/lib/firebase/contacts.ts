import { db } from '../firebase';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import type { 
  Contact, 
  ContactRequest
} from '@/types/contact';

// Define ContactSearchResult locally since it's not exported from the contact types
interface ContactSearchResult {
  id: string;
  email: string;
  fullName: string;
  photoURL: string;
  isContact: boolean;
  hasPendingRequest: boolean;
}

export class ContactsService {
  private readonly contactsCollection = 'contacts';
  private readonly requestsCollection = 'contactRequests';
  private readonly usersCollection = 'users';

  /**
   * Busca usuarios por email para agregar como contactos
   * @param email Email parcial o completo para buscar
   * @param currentUserId ID del usuario actual para excluirlo
   */
  async searchUsers(
    email: string, 
    currentUserId: string
  ): Promise<ContactSearchResult[]> {
    try {
      const usersRef = collection(db, this.usersCollection);
      const q = query(
        usersRef,
        where('email', '>=', email.toLowerCase()),
        where('email', '<=', email.toLowerCase() + '\uf8ff'),
        where('id', '!=', currentUserId)
      );

      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as { id: string; email: string; fullName: string; photoURL: string }));

      // Verificar si ya son contactos o tienen solicitudes pendientes
      const results = await Promise.all(
        users.map(async user => {
          const isContact = await this.checkIfContact(currentUserId, user.id);
          const hasPendingRequest = await this.checkPendingRequest(currentUserId, user.id);

          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            photoURL: user.photoURL,
            isContact,
            hasPendingRequest
          };
        })
      );

      return results;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Error al buscar usuarios');
    }
  }

  /**
   * Envía una solicitud de contacto
   */
  async sendContactRequest(
    fromUserId: string,
    toUserId: string
  ): Promise<string> {
    try {
      // Verificar si ya existe una solicitud
      const existingRequest = await this.checkPendingRequest(fromUserId, toUserId);
      if (existingRequest) {
        throw new Error('Ya existe una solicitud pendiente');
      }

      // Obtener datos del remitente
      const fromUser = await this.getUserData(fromUserId);
      
      const requestData: Omit<ContactRequest, 'id'> = {
        fromUserId,
        fromUserEmail: fromUser.email,
        fromUserName: fromUser.fullName || fromUser.name, // Use name if fullName doesn't exist
        fromUserPhoto: fromUser.photoURL || '',
        toUserId,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        from: {
          uid: fromUserId,
          email: fromUser.email,
          displayName: fromUser.fullName || fromUser.name,
          photoURL: fromUser.photoURL || null
        },
        to: {
          uid: toUserId,
          email: '', // You might want to fetch this data
          displayName: '',
          photoURL: null
        }
      };

      const docRef = await addDoc(
        collection(db, this.requestsCollection), 
        requestData
      );

      return docRef.id;
    } catch (error) {
      console.error('Error sending contact request:', error);
      throw new Error('Error al enviar solicitud de contacto');
    }
  }

  /**
   * Acepta una solicitud de contacto
   */
  async acceptContactRequest(requestId: string): Promise<void> {
    try {
      const requestRef = doc(db, this.requestsCollection, requestId);
      const requestDoc = await getDoc(requestRef);

      if (!requestDoc.exists()) {
        throw new Error('Solicitud no encontrada');
      }

      const request = requestDoc.data() as ContactRequest;

      // Actualizar estado de la solicitud
      await updateDoc(requestRef, {
        status: 'accepted',
        updatedAt: serverTimestamp()
      });

      // Agregar contactos mutuamente
      await this.addMutualContacts(request.fromUserId, request.toUserId);
    } catch (error) {
      console.error('Error accepting contact request:', error);
      throw new Error('Error al aceptar solicitud');
    }
  }

  /**
   * Rechaza una solicitud de contacto
   */
  async rejectContactRequest(requestId: string): Promise<void> {
    try {
      const requestRef = doc(db, this.requestsCollection, requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error rejecting contact request:', error);
      throw new Error('Error al rechazar solicitud');
    }
  }

  /**
   * Suscribe a cambios en la lista de contactos
   */
  subscribeToContacts(
    userId: string, 
    callback: (contacts: Contact[]) => void
  ): () => void {
    const contactsRef = collection(db, this.contactsCollection);
    const q = query(
      contactsRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, async (snapshot) => {
      const contacts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const contactData = doc.data();
          const userData = await this.getUserData(contactData.contactId);
          
          return {
            id: userData.id,
            uid: userData.id,
            email: userData.email,
            name: userData.fullName,
            displayName: userData.fullName,
            fullName: userData.fullName,
            photoURL: userData.photoURL,
            status: userData.status,
            lastSeen: userData.lastSeen,
            chatId: contactData.contactId,
            createdAt: contactData.createdAt.toDate(),
            updatedAt: contactData.updatedAt.toDate(),
            unreadCount: 0, // Default value
            lastMessageTime: null, // Default value
            lastMessage: null, // Add missing property
            isFavorite: false // Add missing property
          };
        })
      );

      callback(contacts);
    });
  }

  /**
   * Suscribe a cambios en las solicitudes de contacto
   */
  subscribeToContactRequests(
    userId: string,
    callback: (requests: ContactRequest[]) => void
  ): () => void {
    const requestsRef = collection(db, this.requestsCollection);
    const q = query(
      requestsRef,
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as ContactRequest[];

      callback(requests);
    });
  }

  // Métodos privados auxiliares
  private async checkIfContact(userId: string, contactId: string): Promise<boolean> {
    const contactsRef = collection(db, this.contactsCollection);
    const q = query(
      contactsRef,
      where('userId', '==', userId),
      where('contactId', '==', contactId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  private async checkPendingRequest(
    fromUserId: string, 
    toUserId: string
  ): Promise<boolean> {
    const requestsRef = collection(db, this.requestsCollection);
    const q = query(
      requestsRef,
      where('fromUserId', '==', fromUserId),
      where('toUserId', '==', toUserId),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  private async getUserData(userId: string): Promise<Contact> {
    const userDoc = await getDoc(doc(db, this.usersCollection, userId));
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    return { id: userDoc.id, ...userDoc.data() } as Contact;
  }

  private async addMutualContacts(
    userId1: string, 
    userId2: string
  ): Promise<void> {
    const batch = writeBatch(db);

    // Agregar usuario2 como contacto de usuario1
    const contact1Ref = doc(collection(db, this.contactsCollection));
    batch.set(contact1Ref, {
      userId: userId1,
      contactId: userId2,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Agregar usuario1 como contacto de usuario2
    const contact2Ref = doc(collection(db, this.contactsCollection));
    batch.set(contact2Ref, {
      userId: userId2,
      contactId: userId1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
  }
}

// Exportar una instancia única del servicio
export const contactsService = new ContactsService();