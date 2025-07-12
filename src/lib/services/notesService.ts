import { BaseFirebaseService } from './firebaseService';
import { ClinicalNote, CreateNoteData, UpdateNoteData, NoteFilters, NotesStats, PDFExportResult } from '@/types/notes';

class NotesService extends BaseFirebaseService<ClinicalNote> {
  constructor() {
    super('notes');
  }

  // Obtener notas con filtros específicos
  async getNotes(centerId: string, filters: NoteFilters = {}): Promise<ClinicalNote[]> {
    const whereConditions = [];

    if (filters.patientId) {
      whereConditions.push({
        field: 'patientId',
        operator: '==' as const,
        value: filters.patientId
      });
    }

    if (filters.status) {
      whereConditions.push({
        field: 'status',
        operator: '==' as const,
        value: filters.status
      });
    }

    if (filters.templateType) {
      whereConditions.push({
        field: 'templateType',
        operator: '==' as const,
        value: filters.templateType
      });
    }

    if (filters.therapistId) {
      whereConditions.push({
        field: 'therapistId',
        operator: '==' as const,
        value: filters.therapistId
      });
    }

    if (filters.signed !== undefined) {
      whereConditions.push({
        field: 'signed',
        operator: '==' as const,
        value: filters.signed
      });
    }

    if (filters.dateRange?.start) {
      whereConditions.push({
        field: 'date',
        operator: '>=' as const,
        value: filters.dateRange.start
      });
    }

    if (filters.dateRange?.end) {
      whereConditions.push({
        field: 'date',
        operator: '<=' as const,
        value: filters.dateRange.end
      });
    }

    const options = {
      where: whereConditions,
      orderBy: { field: 'date', direction: 'desc' as const }
    };

    let notes = await this.getAll(centerId, options);

    // Filtro de búsqueda en memoria (para campos de texto)
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      notes = notes.filter(note => 
        note.patientName.toLowerCase().includes(searchTerm) ||
        note.content.subjective?.toLowerCase().includes(searchTerm) ||
        note.content.objective?.toLowerCase().includes(searchTerm) ||
        note.content.assessment?.toLowerCase().includes(searchTerm) ||
        note.content.plan?.toLowerCase().includes(searchTerm) ||
        note.content.data?.toLowerCase().includes(searchTerm) ||
        note.content.freeText?.toLowerCase().includes(searchTerm) ||
        note.diagnosis?.primary?.description.toLowerCase().includes(searchTerm)
      );
    }

    return notes;
  }

  // Crear nueva nota
  async createNote(centerId: string, therapistId: string, data: CreateNoteData): Promise<string> {
    const noteData: Omit<ClinicalNote, 'id' | 'createdAt' | 'updatedAt'> = {
      ...data,
      therapistId,
      therapistName: '', // Se debe obtener del contexto
      centerId,
      patientName: '', // Se debe obtener del patientId
      date: new Date(),
      status: 'draft',
      signed: false,
      locked: false,
      version: 1,
      attachments: [],
      content: {
        ...data.content,
        riskAssessment: data.content.riskAssessment || {
          suicidalIdeation: false,
          homicidalIdeation: false,
          selfHarm: false,
          substanceAbuse: false,
          psychosis: false,
          domesticViolence: false,
          childAbuse: false,
          riskLevel: 'low',
          interventions: [],
          followUpRequired: false,
          emergencyContacts: false
        }
      }
    };

    return await this.create(centerId, noteData);
  }

  // Actualizar nota
  async updateNote(centerId: string, noteId: string, data: UpdateNoteData): Promise<void> {
    const updateData: Partial<ClinicalNote> = {
      ...data,
      version: undefined // Se incrementará automáticamente
    };

    // Si se está firmando la nota
    if (data.status === 'signed') {
      updateData.signed = true;
      updateData.signedAt = new Date();
      updateData.locked = true;
      updateData.lockedAt = new Date();
    }

    await this.update(centerId, noteId, updateData);
  }

  // Firmar nota electrónicamente
  async signNote(
    centerId: string, 
    noteId: string, 
    therapistId: string, 
    therapistName: string,
    signatureData?: string
  ): Promise<void> {
    const signature = {
      id: `sig_${Date.now()}`,
      therapistId,
      therapistName,
      timestamp: new Date(),
      ipAddress: '0.0.0.0', // Se debe obtener del cliente
      userAgent: navigator.userAgent,
      signatureData,
      isValid: true,
      method: signatureData ? 'drawn' as const : 'digital' as const
    };

    await this.update(centerId, noteId, {
      status: 'signed',
      signed: true,
      signedAt: new Date(),
      signedBy: therapistId,
      signature,
      locked: true,
      lockedAt: new Date(),
      lockedBy: therapistId
    });
  }

  // Obtener estadísticas de notas
  async getNotesStats(centerId: string, therapistId?: string): Promise<NotesStats> {
    const filters: NoteFilters = therapistId ? { therapistId } : {};
    const allNotes = await this.getNotes(centerId, filters);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: NotesStats = {
      total: allNotes.length,
      pending: allNotes.filter(n => n.status === 'pending').length,
      signed: allNotes.filter(n => n.signed).length,
      draft: allNotes.filter(n => n.status === 'draft').length,
      thisWeek: allNotes.filter(n => n.createdAt >= weekAgo).length,
      thisMonth: allNotes.filter(n => n.createdAt >= monthAgo).length,
      averageCompletionTime: 0, // Calcular basado en createdAt vs signedAt
      riskAlerts: allNotes.filter(n => 
        n.content.riskAssessment && 
        ['high', 'critical'].includes(n.content.riskAssessment.riskLevel)
      ).length
    };

    // Calcular tiempo promedio de completación
    const signedNotes = allNotes.filter(n => n.signed && n.signedAt);
    if (signedNotes.length > 0) {
      const totalHours = signedNotes.reduce((sum, note) => {
        const hours = (note.signedAt!.getTime() - note.createdAt.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      stats.averageCompletionTime = totalHours / signedNotes.length;
    }

    return stats;
  }

  // Exportar nota a PDF
  async exportToPDF(centerId: string, noteId: string): Promise<PDFExportResult> {
    // Simular exportación a PDF
    await new Promise(resolve => setTimeout(resolve, 2000));

    const note = await this.getById(centerId, noteId);
    if (!note) {
      throw new Error('Nota no encontrada');
    }

    const filename = `nota_${note.patientName.replace(/\s+/g, '_')}_${note.date.toISOString().split('T')[0]}.pdf`;
    
    return {
      url: `/api/exports/${noteId}.pdf`,
      filename,
      size: 1024 * 1024, // 1MB simulado
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };
  }

  // Duplicar nota (crear nueva versión)
  async duplicateNote(centerId: string, noteId: string): Promise<string> {
    const originalNote = await this.getById(centerId, noteId);
    if (!originalNote) {
      throw new Error('Nota no encontrada');
    }

    const duplicateData: CreateNoteData = {
      patientId: originalNote.patientId,
      sessionId: originalNote.sessionId,
      templateType: originalNote.templateType,
      content: { ...originalNote.content },
      diagnosis: originalNote.diagnosis ? { ...originalNote.diagnosis } : undefined
    };

    return await this.createNote(centerId, originalNote.therapistId, duplicateData);
  }

  // Obtener historial de versiones
  async getNoteVersions(centerId: string, noteId: string): Promise<ClinicalNote[]> {
    const options = {
      where: [
        {
          field: 'id',
          operator: '==' as const,
          value: noteId
        }
      ],
      orderBy: { field: 'version', direction: 'desc' as const }
    };

    return await this.getAll(centerId, options);
  }

  // Buscar notas por contenido
  async searchNotes(centerId: string, searchTerm: string, therapistId?: string): Promise<ClinicalNote[]> {
    const filters: NoteFilters = {
      searchTerm,
      therapistId
    };

    return await this.getNotes(centerId, filters);
  }
}

export const notesService = new NotesService();
