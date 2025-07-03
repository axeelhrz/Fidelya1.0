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
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Session, CreateSessionData, UpdateSessionData, SessionFilters } from '../../types/session';

export class SessionService {
  private static getSessionsCollection(centerId: string) {
    return collection(db, `centers/${centerId}/sessions`);
  }

  static async getTodaySessions(centerId: string, professionalId: string, date: string): Promise<Session[]> {
    try {
      const sessionsRef = this.getSessionsCollection(centerId);
      const q = query(
        sessionsRef,
        where('professionalId', '==', professionalId),
        where('date', '==', date),
        orderBy('time', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Session[];
    } catch (error) {
      console.error('Error fetching today sessions:', error);
      throw error;
    }
  }

  static async getSessionById(centerId: string, sessionId: string): Promise<Session | null> {
    try {
      const sessionRef = doc(db, `centers/${centerId}/sessions`, sessionId);
      const snapshot = await getDoc(sessionRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
      } as Session;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  static async createSession(centerId: string, sessionData: CreateSessionData & { professionalId: string }): Promise<string> {
    try {
      const sessionsRef = this.getSessionsCollection(centerId);
      const docRef = await addDoc(sessionsRef, {
        ...sessionData,
        centerId,
        status: 'pendiente',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  static async updateSession(centerId: string, sessionId: string, updateData: UpdateSessionData): Promise<void> {
    try {
      const sessionRef = doc(db, `centers/${centerId}/sessions`, sessionId);
      await updateDoc(sessionRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  static async updateSessionStatus(centerId: string, sessionId: string, status: Session['status']): Promise<void> {
    try {
      const sessionRef = doc(db, `centers/${centerId}/sessions`, sessionId);
      await updateDoc(sessionRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating session status:', error);
      throw error;
    }
  }

  static filterSessions(sessions: Session[], filters: SessionFilters): Session[] {
    return sessions.filter(session => {
      if (filters.status && session.status !== filters.status) {
        return false;
      }

      if (filters.patientName && !session.patientName.toLowerCase().includes(filters.patientName.toLowerCase())) {
        return false;
      }

      if (filters.timeRange) {
        const hour = parseInt(session.time.split(':')[0]);
        switch (filters.timeRange) {
          case 'morning':
            if (hour < 6 || hour >= 12) return false;
            break;
          case 'afternoon':
            if (hour < 12 || hour >= 18) return false;
            break;
          case 'evening':
            if (hour < 18 || hour >= 24) return false;
            break;
        }
      }

      return true;
    });
  }
}
