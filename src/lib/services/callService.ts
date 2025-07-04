import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  getDoc,
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
import { 
  Call, 
  CreateCallData, 
  UpdateCallData, 
  CallFilters, 
  CallStats,
  CallContact,
  CallTemplate,
  CallExportData
} from '../../types/calls';

export class CallService {
  private static getCollectionPath(centerId: string) {
    return `centers/${centerId}/calls`;
  }

  private static getContactsCollectionPath(centerId: string) {
    return `centers/${centerId}/callContacts`;
  }

  private static getTemplatesCollectionPath(centerId: string) {
    return `centers/${centerId}/callTemplates`;
  }

  // ============================================================================
  // GESTIÓN DE LLAMADAS
  // ============================================================================

  static async createCall(
    centerId: string, 
    professionalId: string, 
    professionalName: string,
    data: CreateCallData
  ): Promise<string> {
    try {
      const callsRef = collection(db, this.getCollectionPath(centerId));
      
      const callData = {
        ...data,
        professionalId,
        professionalName,
        centerId,
        hasRecording: data.hasRecording || false,
        consentGiven: data.consentGiven || false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: professionalId
      };

      const docRef = await addDoc(callsRef, callData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating call:', error);
      throw new Error('Error al crear la llamada');
    }
  }

  static async updateCall(
    centerId: string, 
    callId: string, 
    data: UpdateCallData
  ): Promise<void> {
    try {
      const callRef = doc(db, this.getCollectionPath(centerId), callId);
      
      await updateDoc(callRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating call:', error);
      throw new Error('Error al actualizar la llamada');
    }
  }

  static async deleteCall(centerId: string, callId: string): Promise<void> {
    try {
      const callRef = doc(db, this.getCollectionPath(centerId), callId);
      await deleteDoc(callRef);
    } catch (error) {
      console.error('Error deleting call:', error);
      throw new Error('Error al eliminar la llamada');
    }
  }

  static async getCall(centerId: string, callId: string): Promise<Call | null> {
    try {
      const callRef = doc(db, this.getCollectionPath(centerId), callId);
      const callSnap = await getDoc(callRef);
      
      if (!callSnap.exists()) {
        return null;
      }

      const data = callSnap.data();
      return {
        id: callSnap.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Call;
    } catch (error) {
      console.error('Error getting call:', error);
      throw new Error('Error al obtener la llamada');
    }
  }

  static async getCalls(
    centerId: string, 
    professionalId?: string,
    filters?: CallFilters,
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ calls: Call[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    try {
      const callsRef = collection(db, this.getCollectionPath(centerId));
      let q = query(callsRef, orderBy('date', 'desc'));

      // Filtrar por profesional si se especifica
      if (professionalId) {
        q = query(q, where('professionalId', '==', professionalId));
      }

      // Aplicar filtros adicionales
      if (filters) {
        if (filters.type) {
          q = query(q, where('type', '==', filters.type));
        }
        if (filters.status) {
          q = query(q, where('status', '==', filters.status));
        }
        if (filters.dateFrom) {
          q = query(q, where('date', '>=', Timestamp.fromDate(filters.dateFrom)));
        }
        if (filters.dateTo) {
          q = query(q, where('date', '<=', Timestamp.fromDate(filters.dateTo)));
        }
        if (filters.hasRecording !== undefined) {
          q = query(q, where('hasRecording', '==', filters.hasRecording));
        }
      }

      // Paginación
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      q = query(q, limit(pageSize));

      const querySnapshot = await getDocs(q);
      const calls: Call[] = [];
      let newLastDoc: QueryDocumentSnapshot<DocumentData> | undefined;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        calls.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Call);
        newLastDoc = doc;
      });

      // Aplicar filtros de búsqueda en memoria (para campos de texto)
      let filteredCalls = calls;
      if (filters) {
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          filteredCalls = calls.filter(call => 
            call.patientName?.toLowerCase().includes(searchTerm) ||
            call.contactName?.toLowerCase().includes(searchTerm) ||
            call.motive.toLowerCase().includes(searchTerm) ||
            call.notes?.toLowerCase().includes(searchTerm)
          );
        }
        if (filters.patientName) {
          const patientName = filters.patientName.toLowerCase();
          filteredCalls = filteredCalls.filter(call => 
            call.patientName?.toLowerCase().includes(patientName)
          );
        }
        if (filters.contactName) {
          const contactName = filters.contactName.toLowerCase();
          filteredCalls = filteredCalls.filter(call => 
            call.contactName?.toLowerCase().includes(contactName)
          );
        }
        if (filters.motive) {
          const motive = filters.motive.toLowerCase();
          filteredCalls = filteredCalls.filter(call => 
            call.motive.toLowerCase().includes(motive)
          );
        }
      }

      return { calls: filteredCalls, lastDoc: newLastDoc };
    } catch (error) {
      console.error('Error getting calls:', error);
      throw new Error('Error al obtener las llamadas');
    }
  }

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  static async getCallStats(
    centerId: string, 
    professionalId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<CallStats> {
    try {
      const callsRef = collection(db, this.getCollectionPath(centerId));
      let q = query(callsRef);

      if (professionalId) {
        q = query(q, where('professionalId', '==', professionalId));
      }

      if (dateRange) {
        q = query(
          q, 
          where('date', '>=', Timestamp.fromDate(dateRange.start)),
          where('date', '<=', Timestamp.fromDate(dateRange.end))
        );
      }

      const querySnapshot = await getDocs(q);
      const calls: Call[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        calls.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Call);
      });

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats: CallStats = {
        total: calls.length,
        realizadas: calls.filter(c => c.status === 'realizada').length,
        noContestadas: calls.filter(c => c.status === 'no_contestada').length,
        canceladas: calls.filter(c => c.status === 'cancelada').length,
        perdidas: calls.filter(c => c.status === 'perdida').length,
        totalDuration: calls.reduce((sum, c) => sum + (c.duration || 0), 0),
        averageDuration: calls.length > 0 
          ? Math.round(calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length)
          : 0,
        thisWeek: calls.filter(c => c.date >= weekAgo).length,
        thisMonth: calls.filter(c => c.date >= monthAgo).length
      };

      return stats;
    } catch (error) {
      console.error('Error getting call stats:', error);
      throw new Error('Error al obtener estadísticas de llamadas');
    }
  }

  // ============================================================================
  // CONTACTOS
  // ============================================================================

  static async getContacts(centerId: string): Promise<CallContact[]> {
    try {
      const contactsRef = collection(db, this.getContactsCollectionPath(centerId));
      const querySnapshot = await getDocs(query(contactsRef, orderBy('name')));
      
      const contacts: CallContact[] = [];
      querySnapshot.forEach((doc) => {
        contacts.push({
          id: doc.id,
          ...doc.data()
        } as CallContact);
      });

      return contacts;
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw new Error('Error al obtener contactos');
    }
  }

  static async createContact(centerId: string, contactData: Omit<CallContact, 'id'>): Promise<string> {
    try {
      const contactsRef = collection(db, this.getContactsCollectionPath(centerId));
      const docRef = await addDoc(contactsRef, contactData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error('Error al crear contacto');
    }
  }

  // ============================================================================
  // PLANTILLAS
  // ============================================================================

  static async getCallTemplates(centerId: string): Promise<CallTemplate[]> {
    try {
      const templatesRef = collection(db, this.getTemplatesCollectionPath(centerId));
      const querySnapshot = await getDocs(
        query(templatesRef, where('isActive', '==', true), orderBy('name'))
      );
      
      const templates: CallTemplate[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        templates.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as CallTemplate);
      });

      return templates;
    } catch (error) {
      console.error('Error getting call templates:', error);
      throw new Error('Error al obtener plantillas de llamadas');
    }
  }

  // ============================================================================
  // EXPORTACIÓN
  // ============================================================================

  static async exportCalls(
    centerId: string,
    professionalId: string,
    exportData: CallExportData
  ): Promise<string> {
    try {
      const { calls } = await this.getCalls(centerId, professionalId, exportData.filters);
      
      let filteredCalls = calls;
      if (exportData.dateRange) {
        filteredCalls = calls.filter(call => 
          call.date >= exportData.dateRange!.start && 
          call.date <= exportData.dateRange!.end
        );
      }

      if (exportData.format === 'csv') {
        return this.generateCSV(filteredCalls, exportData.includeNotes);
      } else {
        return this.generatePDF(filteredCalls, exportData.includeNotes);
      }
    } catch (error) {
      console.error('Error exporting calls:', error);
      throw new Error('Error al exportar llamadas');
    }
  }

  private static generateCSV(calls: Call[], includeNotes: boolean): string {
    const headers = [
      'Fecha',
      'Hora',
      'Paciente/Contacto',
      'Tipo',
      'Estado',
      'Duración (min)',
      'Motivo',
      'Profesional'
    ];

    if (includeNotes) {
      headers.push('Notas');
    }

    const csvContent = [
      headers.join(','),
      ...calls.map(call => {
        const row = [
          call.date.toLocaleDateString('es-ES'),
          call.startTime,
          call.patientName || call.contactName || 'N/A',
          call.type === 'entrante' ? 'Entrante' : 'Saliente',
          this.getStatusLabel(call.status),
          call.duration.toString(),
          `"${call.motive.replace(/"/g, '""')}"`,
          call.professionalName
        ];

        if (includeNotes) {
          row.push(`"${(call.notes || '').replace(/"/g, '""')}"`);
        }

        return row.join(',');
      })
    ].join('\n');

    return csvContent;
  }

  private static generatePDF(calls: Call[], includeNotes: boolean): string {
    // En una implementación real, usarías una librería como jsPDF
    // Por ahora, retornamos un placeholder
    const notesInfo = includeNotes ? ' with notes' : '';
    return `PDF content for ${calls.length} calls${notesInfo}`;
  }

  private static getStatusLabel(status: string): string {
    switch (status) {
      case 'realizada':
        return 'Realizada';
      case 'no_contestada':
        return 'No contestada';
      case 'cancelada':
        return 'Cancelada';
      case 'perdida':
        return 'Perdida';
      default:
        return status;
    }
  }
}
