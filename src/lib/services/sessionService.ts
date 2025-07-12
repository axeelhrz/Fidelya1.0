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
  QueryDocumentSnapshot,
  DocumentData 
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

  static async getSessionHistory(
    centerId: string, 
    professionalId: string,
    options: {
      dateFrom?: string;
      dateTo?: string;
      status?: string;
      pageSize?: number;
      lastDoc?: QueryDocumentSnapshot<DocumentData>;
      sortBy?: 'date' | 'patientName' | 'status';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ sessions: Session[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      const sessionsRef = this.getSessionsCollection(centerId);
      let q = query(sessionsRef);

      // Filtro por profesional
      q = query(q, where('professionalId', '==', professionalId));

      // Filtros de fecha
      if (options.dateFrom) {
        q = query(q, where('date', '>=', options.dateFrom));
      }
      if (options.dateTo) {
        q = query(q, where('date', '<=', options.dateTo));
      }

      // Filtro por estado
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      // Ordenamiento
      const orderField = options.sortBy === 'date' ? 'date' : 
                        options.sortBy === 'patientName' ? 'patientName' : 'status';
      const orderDirection = options.sortOrder || 'desc';
      q = query(q, orderBy(orderField, orderDirection));

      // Si es ordenamiento por fecha, agregar ordenamiento secundario
      if (options.sortBy === 'date') {
        q = query(q, orderBy('time', orderDirection));
      }

      // Paginación
      if (options.lastDoc) {
        q = query(q, startAfter(options.lastDoc));
      }

      const pageSize = options.pageSize || 20;
      q = query(q, limit(pageSize));

      const snapshot = await getDocs(q);
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Session[];

      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

      return { sessions, lastDoc };
    } catch (error) {
      console.error('Error fetching session history:', error);
      throw error;
    }
  }

  static async searchSessions(
    centerId: string,
    professionalId: string,
    searchTerm: string,
    options: {
      pageSize?: number;
      lastDoc?: QueryDocumentSnapshot<DocumentData>;
    } = {}
  ): Promise<{ sessions: Session[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      const sessionsRef = this.getSessionsCollection(centerId);
      let q = query(
        sessionsRef,
        where('professionalId', '==', professionalId),
        orderBy('date', 'desc')
      );

      if (options.lastDoc) {
        q = query(q, startAfter(options.lastDoc));
      }

      const pageSize = options.pageSize || 50; // Más grande para filtrar del lado del cliente
      q = query(q, limit(pageSize));

      const snapshot = await getDocs(q);
      const allSessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Session[];

      // Filtrar del lado del cliente por texto
      const searchTermLower = searchTerm.toLowerCase();
      const filteredSessions = allSessions.filter(session => {
        const searchableText = [
          session.patientName,
          session.notes || '',
          session.summary || '',
          session.consultationReason || '',
          session.recommendation || ''
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTermLower);
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

      return { sessions: filteredSessions, lastDoc };
    } catch (error) {
      console.error('Error searching sessions:', error);
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

  // Función para exportar sesiones a CSV
  static exportToCSV(sessions: Session[], fields: string[]): string {
    const headers = fields.map(field => {
      switch (field) {
        case 'patientName': return 'Paciente';
        case 'date': return 'Fecha';
        case 'time': return 'Hora';
        case 'duration': return 'Duración (min)';
        case 'status': return 'Estado';
        case 'consultationReason': return 'Motivo de Consulta';
        case 'notes': return 'Notas Clínicas';
        case 'summary': return 'Resumen IA';
        case 'recommendation': return 'Recomendación IA';
        case 'emotionalStates': return 'Estados Emocionales';
        case 'professionalId': return 'ID Profesional';
        case 'createdAt': return 'Fecha de Creación';
        default: return field;
      }
    });

    const rows = sessions.map(session => {
      return fields.map(field => {
        let value = '';
        switch (field) {
          case 'patientName':
            value = session.patientName;
            break;
          case 'date':
            value = session.date;
            break;
          case 'time':
            value = session.time;
            break;
          case 'duration':
            value = session.duration.toString();
            break;
          case 'status':
            value = session.status;
            break;
          case 'consultationReason':
            value = session.consultationReason;
            break;
          case 'notes':
            value = session.notes || '';
            break;
          case 'summary':
            value = session.summary || '';
            break;
          case 'recommendation':
            value = session.recommendation || '';
            break;
          case 'emotionalStates':
            value = [session.emotionalTonePre, session.emotionalTonePost]
              .filter(Boolean)
              .join(' → ');
            break;
          case 'professionalId':
            value = session.professionalId;
            break;
          case 'createdAt':
            value = session.createdAt.toISOString().split('T')[0];
            break;
        }
        
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      });
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Función para obtener estadísticas de sesiones
  static getSessionStats(sessions: Session[]) {
    return {
      total: sessions.length,
      completed: sessions.filter(s => s.status === 'finalizada').length,
      pending: sessions.filter(s => s.status === 'pendiente').length,
      inProgress: sessions.filter(s => s.status === 'en_curso').length,
      cancelled: sessions.filter(s => s.status === 'cancelada').length,
      confirmed: sessions.filter(s => s.status === 'confirmada').length,
      withNotes: sessions.filter(s => s.notes && s.notes.length > 0).length,
      withAISummary: sessions.filter(s => s.summary && s.summary.length > 0).length,
      averageDuration: sessions.length > 0 
        ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length)
        : 0,
    };
  }
}