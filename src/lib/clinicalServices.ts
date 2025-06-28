import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import {
  ExtendedPatient,
  Appointment,
  ClinicalNote,
  TreatmentPlan,
  PsychometricAssessment,
  PatientDocument,
  VirtualAppointment,
  SupervisionSession,
  DocumentTemplate,
  CustomForm
} from '@/types/clinical';

// ============================================================================
// SERVICIO BASE PARA OPERACIONES CLÍNICAS
// ============================================================================

export class ClinicalService {
  protected centerId: string;

  constructor(centerId: string) {
    this.centerId = centerId;
  }

  protected getCollectionRef(path: string) {
    return collection(db, 'centers', this.centerId, path);
  }

  protected getDocRef(path: string, docId: string) {
    return doc(db, 'centers', this.centerId, path, docId);
  }

  protected convertTimestamps(data: any): any {
    const converted = { ...data };
    
    // Convertir campos de fecha comunes
    const dateFields = ['date', 'createdAt', 'updatedAt', 'dateOfBirth', 'lastSession', 'startDate', 'endDate', 'dueDate', 'nextReviewDate', 'lastReviewDate'];
    
    dateFields.forEach(field => {
      if (converted[field] && typeof converted[field].toDate === 'function') {
        converted[field] = converted[field].toDate();
      }
    });
    
    return converted;
  }

  protected prepareForFirestore(data: any): any {
    const prepared = { ...data };
    
    // Convertir fechas a Timestamp
    Object.keys(prepared).forEach(key => {
      if (prepared[key] instanceof Date) {
        prepared[key] = Timestamp.fromDate(prepared[key]);
      }
    });
    
    return prepared;
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE PACIENTES
// ============================================================================

export class PatientsService extends ClinicalService {
  
  async getPatients(): Promise<ExtendedPatient[]> {
    const patientsRef = this.getCollectionRef('patients');
    const q = query(patientsRef, orderBy('lastName', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as ExtendedPatient[];
  }

  async getPatient(patientId: string): Promise<ExtendedPatient | null> {
    const patientRef = this.getDocRef('patients', patientId);
    const snapshot = await getDoc(patientRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...this.convertTimestamps(snapshot.data())
      } as ExtendedPatient;
    }
    
    return null;
  }

  async createPatient(patientData: Omit<ExtendedPatient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const patientsRef = this.getCollectionRef('patients');
    const now = new Date();
    
    const newPatient = this.prepareForFirestore({
      ...patientData,
      createdAt: now,
      updatedAt: now
    });
    
    const docRef = await addDoc(patientsRef, newPatient);
    return docRef.id;
  }

  async updatePatient(patientId: string, updates: Partial<ExtendedPatient>): Promise<void> {
    const patientRef = this.getDocRef('patients', patientId);
    
    const updateData = this.prepareForFirestore({
      ...updates,
      updatedAt: new Date()
    });
    
    await updateDoc(patientRef, updateData);
  }

  async deletePatient(patientId: string): Promise<void> {
    const patientRef = this.getDocRef('patients', patientId);
    await deleteDoc(patientRef);
  }

  async searchPatients(searchTerm: string): Promise<ExtendedPatient[]> {
    // Implementar búsqueda más sofisticada si es necesario
    const patients = await this.getPatients();
    
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );
  }

  async getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
    const documentsRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'documents');
    const q = query(documentsRef, orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as PatientDocument[];
  }

  async uploadPatientDocument(patientId: string, file: File, metadata: Partial<PatientDocument>): Promise<string> {
    // Subir archivo a Storage
    const storageRef = ref(storage, `centers/${this.centerId}/patients/${patientId}/documents/${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // Crear documento en Firestore
    const documentsRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'documents');
    const documentData = this.prepareForFirestore({
      ...metadata,
      patientId,
      name: file.name,
      url: downloadURL,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date()
    });
    
    const docRef = await addDoc(documentsRef, documentData);
    return docRef.id;
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE CITAS
// ============================================================================

export class AppointmentsService extends ClinicalService {
  
  async getAppointments(startDate?: Date, endDate?: Date): Promise<Appointment[]> {
    const appointmentsRef = this.getCollectionRef('appointments');
    let q = query(appointmentsRef, orderBy('date', 'asc'));
    
    if (startDate) {
      q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as Appointment[];
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const appointmentsRef = this.getCollectionRef('appointments');
    const now = new Date();
    
    const newAppointment = this.prepareForFirestore({
      ...appointmentData,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now
    });
    
    const docRef = await addDoc(appointmentsRef, newAppointment);
    return docRef.id;
  }

  async updateAppointment(appointmentId: string, updates: Partial<Appointment>): Promise<void> {
    const appointmentRef = this.getDocRef('appointments', appointmentId);
    
    const updateData = this.prepareForFirestore({
      ...updates,
      updatedAt: new Date()
    });
    
    await updateDoc(appointmentRef, updateData);
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const appointmentsRef = this.getCollectionRef('appointments');
    const q = query(
      appointmentsRef, 
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as Appointment[];
  }

  async getTherapistAppointments(therapistId: string, date?: Date): Promise<Appointment[]> {
    const appointmentsRef = this.getCollectionRef('appointments');
    let q = query(
      appointmentsRef, 
      where('therapistId', '==', therapistId),
      orderBy('date', 'asc')
    );
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      q = query(
        q,
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as Appointment[];
  }

  async checkInAppointment(appointmentId: string): Promise<void> {
    await this.updateAppointment(appointmentId, {
      status: 'checked-in',
      checkIn: new Date()
    });
  }

  async checkOutAppointment(appointmentId: string): Promise<void> {
    await this.updateAppointment(appointmentId, {
      status: 'completed',
      checkOut: new Date()
    });
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<void> {
    await this.updateAppointment(appointmentId, {
      status: 'cancelled',
      notes: reason ? `Cancelada: ${reason}` : 'Cancelada'
    });
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE NOTAS CLÍNICAS
// ============================================================================

export class ClinicalNotesService extends ClinicalService {
  
  async getPatientNotes(patientId: string): Promise<ClinicalNote[]> {
    const notesRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'notes');
    const q = query(notesRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as ClinicalNote[];
  }

  async createNote(patientId: string, noteData: Omit<ClinicalNote, 'id' | 'patientId' | 'centerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const notesRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'notes');
    const now = new Date();
    
    const newNote = this.prepareForFirestore({
      ...noteData,
      patientId,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now,
      version: 1,
      previousVersions: []
    });
    
    const docRef = await addDoc(notesRef, newNote);
    return docRef.id;
  }

  async updateNote(patientId: string, noteId: string, updates: Partial<ClinicalNote>): Promise<void> {
    const noteRef = doc(db, 'centers', this.centerId, 'patients', patientId, 'notes', noteId);
    const noteSnapshot = await getDoc(noteRef);
    
    if (!noteSnapshot.exists()) {
      throw new Error('Nota no encontrada');
    }
    
    const currentNote = noteSnapshot.data() as ClinicalNote;
    
    // Verificar si la nota está bloqueada
    if (currentNote.status === 'locked') {
      throw new Error('No se puede editar una nota bloqueada');
    }
    
    const updateData = this.prepareForFirestore({
      ...updates,
      updatedAt: new Date(),
      version: (currentNote.version || 1) + 1,
      previousVersions: [...(currentNote.previousVersions || []), noteId]
    });
    
    await updateDoc(noteRef, updateData);
  }

  async signNote(patientId: string, noteId: string, signature: any): Promise<void> {
    await this.updateNote(patientId, noteId, {
      status: 'signed',
      signature
    });
  }

  async lockNote(patientId: string, noteId: string, lockedBy: string): Promise<void> {
    await this.updateNote(patientId, noteId, {
      status: 'locked',
      lockedAt: new Date(),
      lockedBy
    });
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE PLANES DE TRATAMIENTO
// ============================================================================

export class TreatmentPlansService extends ClinicalService {
  
  async getPatientPlans(patientId: string): Promise<TreatmentPlan[]> {
    const plansRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'treatmentPlans');
    const q = query(plansRef, orderBy('startDate', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as TreatmentPlan[];
  }

  async createPlan(patientId: string, planData: Omit<TreatmentPlan, 'id' | 'patientId' | 'centerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const plansRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'treatmentPlans');
    const now = new Date();
    
    const newPlan = this.prepareForFirestore({
      ...planData,
      patientId,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now,
      history: []
    });
    
    const docRef = await addDoc(plansRef, newPlan);
    return docRef.id;
  }

  async updatePlan(patientId: string, planId: string, updates: Partial<TreatmentPlan>): Promise<void> {
    const planRef = doc(db, 'centers', this.centerId, 'patients', patientId, 'treatmentPlans', planId);
    
    const updateData = this.prepareForFirestore({
      ...updates,
      updatedAt: new Date()
    });
    
    await updateDoc(planRef, updateData);
  }

  async addGoalToPlan(patientId: string, planId: string, goal: any): Promise<void> {
    const planRef = doc(db, 'centers', this.centerId, 'patients', patientId, 'treatmentPlans', planId);
    const planSnapshot = await getDoc(planRef);
    
    if (planSnapshot.exists()) {
      const currentPlan = planSnapshot.data() as TreatmentPlan;
      const updatedGoals = [...(currentPlan.goals || []), goal];
      
      await updateDoc(planRef, {
        goals: updatedGoals,
        updatedAt: Timestamp.fromDate(new Date())
      });
    }
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE EVALUACIONES PSICOMÉTRICAS
// ============================================================================

export class AssessmentsService extends ClinicalService {
  
  async getPatientAssessments(patientId: string): Promise<PsychometricAssessment[]> {
    const assessmentsRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'assessments');
    const q = query(assessmentsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as PsychometricAssessment[];
  }

  async createAssessment(patientId: string, assessmentData: Omit<PsychometricAssessment, 'id' | 'patientId' | 'centerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const assessmentsRef = collection(db, 'centers', this.centerId, 'patients', patientId, 'assessments');
    const now = new Date();
    
    const newAssessment = this.prepareForFirestore({
      ...assessmentData,
      patientId,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now
    });
    
    const docRef = await addDoc(assessmentsRef, newAssessment);
    return docRef.id;
  }

  async updateAssessment(patientId: string, assessmentId: string, updates: Partial<PsychometricAssessment>): Promise<void> {
    const assessmentRef = doc(db, 'centers', this.centerId, 'patients', patientId, 'assessments', assessmentId);
    
    const updateData = this.prepareForFirestore({
      ...updates,
      updatedAt: new Date()
    });
    
    await updateDoc(assessmentRef, updateData);
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE TELECONSULTA
// ============================================================================

export class TeleconsultationService extends ClinicalService {
  
  async createVirtualAppointment(appointmentId: string, virtualData: Omit<VirtualAppointment, 'id' | 'createdAt'>): Promise<string> {
    const virtualRef = this.getCollectionRef('virtualAppointments');
    const now = new Date();
    
    const newVirtual = this.prepareForFirestore({
      ...virtualData,
      createdAt: now
    });
    
    const docRef = await addDoc(virtualRef, newVirtual);
    return docRef.id;
  }

  async generateMeetingLink(platform: string, appointmentId: string): Promise<string> {
    // Aquí se integraría con APIs de Zoom, Teams, etc.
    // Por ahora, generamos un link mock
    const meetingId = `meeting-${appointmentId}-${Date.now()}`;
    
    switch (platform) {
      case 'zoom':
        return `https://zoom.us/j/${meetingId}`;
      case 'teams':
        return `https://teams.microsoft.com/l/meetup-join/${meetingId}`;
      case 'meet':
        return `https://meet.google.com/${meetingId}`;
      default:
        return `https://virtual-meeting.com/${meetingId}`;
    }
  }

  async updateVirtualAppointment(virtualId: string, updates: Partial<VirtualAppointment>): Promise<void> {
    const virtualRef = this.getDocRef('virtualAppointments', virtualId);
    
    const updateData = this.prepareForFirestore(updates);
    await updateDoc(virtualRef, updateData);
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE SUPERVISIÓN CLÍNICA
// ============================================================================

export class SupervisionService extends ClinicalService {
  
  async getSupervisionSessions(superviseeId?: string, supervisorId?: string): Promise<SupervisionSession[]> {
    const sessionsRef = this.getCollectionRef('supervisionSessions');
    let q = query(sessionsRef, orderBy('date', 'desc'));
    
    if (superviseeId) {
      q = query(q, where('superviseeId', '==', superviseeId));
    }
    if (supervisorId) {
      q = query(q, where('supervisorId', '==', supervisorId));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as SupervisionSession[];
  }

  async createSupervisionSession(sessionData: Omit<SupervisionSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const sessionsRef = this.getCollectionRef('supervisionSessions');
    const now = new Date();
    
    const newSession = this.prepareForFirestore({
      ...sessionData,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now
    });
    
    const docRef = await addDoc(sessionsRef, newSession);
    return docRef.id;
  }

  async updateSupervisionSession(sessionId: string, updates: Partial<SupervisionSession>): Promise<void> {
    const sessionRef = this.getDocRef('supervisionSessions', sessionId);
    
    const updateData = this.prepareForFirestore({
      ...updates,
      updatedAt: new Date()
    });
    
    await updateDoc(sessionRef, updateData);
  }
}

// ============================================================================
// SERVICIO PARA GESTIÓN DE DOCUMENTOS Y FORMULARIOS
// ============================================================================

export class DocumentsService extends ClinicalService {
  
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const templatesRef = this.getCollectionRef('documentTemplates');
    const q = query(templatesRef, where('isActive', '==', true), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as DocumentTemplate[];
  }

  async createDocumentTemplate(templateData: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const templatesRef = this.getCollectionRef('documentTemplates');
    const now = new Date();
    
    const newTemplate = this.prepareForFirestore({
      ...templateData,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now
    });
    
    const docRef = await addDoc(templatesRef, newTemplate);
    return docRef.id;
  }

  async getCustomForms(): Promise<CustomForm[]> {
    const formsRef = this.getCollectionRef('customForms');
    const q = query(formsRef, where('isActive', '==', true), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestamps(doc.data())
    })) as CustomForm[];
  }

  async createCustomForm(formData: Omit<CustomForm, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const formsRef = this.getCollectionRef('customForms');
    const now = new Date();
    
    const newForm = this.prepareForFirestore({
      ...formData,
      centerId: this.centerId,
      createdAt: now,
      updatedAt: now,
      submissions: []
    });
    
    const docRef = await addDoc(formsRef, newForm);
    return docRef.id;
  }
}

// ============================================================================
// FACTORY PARA CREAR SERVICIOS
// ============================================================================

export class ClinicalServiceFactory {
  private centerId: string;

  constructor(centerId: string) {
    this.centerId = centerId;
  }

  get patients() {
    return new PatientsService(this.centerId);
  }

  get appointments() {
    return new AppointmentsService(this.centerId);
  }

  get notes() {
    return new ClinicalNotesService(this.centerId);
  }

  get treatmentPlans() {
    return new TreatmentPlansService(this.centerId);
  }

  get assessments() {
    return new AssessmentsService(this.centerId);
  }

  get teleconsultation() {
    return new TeleconsultationService(this.centerId);
  }

  get supervision() {
    return new SupervisionService(this.centerId);
  }

  get documents() {
    return new DocumentsService(this.centerId);
  }
}

// Hook para usar los servicios clínicos
export function useClinicalServices() {
  // Aquí deberías obtener el centerId del contexto de autenticación
  const centerId = 'center1'; // Placeholder
  
  return new ClinicalServiceFactory(centerId);
}
