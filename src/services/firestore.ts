import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User } from '@/types/auth';
import { CenterSettings } from '@/types/center';
import { Patient, PatientFormData, PatientFilters, PatientStats } from '@/types/patient';
import { Session, SessionFormData, SessionFilters, SessionStats, AIAnalysis } from '@/types/session';
import { ClinicalAlert, AlertFormData, AlertFilters, AlertActionLog, AlertStats } from '@/types/alert';

export class FirestoreService {
  // Usuarios
  static async createUser(uid: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async getUser(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as User;
    }
    
    return null;
  }

  static async updateUser(uid: string, data: Partial<User>) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async updateLastLogin(uid: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  // Centros
  static async getCenterSettings(centerId: string): Promise<CenterSettings | null> {
    const centerRef = doc(db, 'centers', centerId);
    const centerSnap = await getDoc(centerRef);
    
    if (centerSnap.exists()) {
      const data = centerSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        subscription: {
          ...data.subscription,
          expiresAt: data.subscription.expiresAt?.toDate(),
        },
      } as CenterSettings;
    }
    
    return null;
  }

  static async updateCenterSettings(centerId: string, settings: Partial<CenterSettings>) {
    const centerRef = doc(db, 'centers', centerId);
    await updateDoc(centerRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  }

  // Verificar si el usuario tiene acceso al centro
  static async verifyUserCenterAccess(uid: string, centerId: string): Promise<boolean> {
    const user = await this.getUser(uid);
    return user?.centerId === centerId && user?.isActive;
  }

  // Obtener usuarios de un centro
  static async getCenterUsers(centerId: string) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('centerId', '==', centerId), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as User[];
  }

  // ==================== PACIENTES ====================

  // Crear paciente
  static async createPatient(centerId: string, patientData: PatientFormData, createdBy: string): Promise<string> {
    const patientsRef = collection(db, 'centers', centerId, 'patients');
    
    // Calcular edad automáticamente
    const birthDate = new Date(patientData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

    const docRef = await addDoc(patientsRef, {
      ...patientData,
      age,
      centerId,
      createdBy,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  // Obtener paciente por ID
  static async getPatient(centerId: string, patientId: string): Promise<Patient | null> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    const patientSnap = await getDoc(patientRef);
    
    if (patientSnap.exists()) {
      const data = patientSnap.data();
      return {
        id: patientSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Patient;
    }
    
    return null;
  }

  // Actualizar paciente
  static async updatePatient(centerId: string, patientId: string, patientData: Partial<PatientFormData>): Promise<void> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    
    const updateData: Partial<PatientFormData> & { updatedAt: ReturnType<typeof serverTimestamp>; age?: number } = {
      ...patientData,
      updatedAt: serverTimestamp(),
    };

    // Recalcular edad si se actualiza la fecha de nacimiento
    if (patientData.birthDate) {
      const birthDate = new Date(patientData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      updateData.age = age;
    }

    await updateDoc(patientRef, updateData);
  }

  // Eliminar paciente (soft delete)
  static async deletePatient(centerId: string, patientId: string): Promise<void> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    await updateDoc(patientRef, {
      status: 'inactive',
      updatedAt: serverTimestamp(),
    });
  }

  // Eliminar paciente permanentemente
  static async permanentDeletePatient(centerId: string, patientId: string): Promise<void> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    await deleteDoc(patientRef);
  }

  // Obtener pacientes con filtros
  static async getPatients(
    centerId: string, 
    filters?: PatientFilters,
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ patients: Patient[], lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    const patientsRef = collection(db, 'centers', centerId, 'patients');
    let q = query(patientsRef, orderBy('createdAt', 'desc'));

    // Aplicar filtros
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      // Por defecto, solo mostrar pacientes activos
      q = query(q, where('status', '==', 'active'));
    }

    if (filters?.gender) {
      q = query(q, where('gender', '==', filters.gender));
    }

    if (filters?.emotionalState) {
      q = query(q, where('emotionalState', '==', filters.emotionalState));
    }

    if (filters?.assignedPsychologist) {
      q = query(q, where('assignedPsychologist', '==', filters.assignedPsychologist));
    }

    // Paginación
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Patient[];

    // Aplicar filtros del lado del cliente para campos que no se pueden filtrar en Firestore
    let filteredPatients = patients;

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPatients = filteredPatients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm) ||
        patient.motivoConsulta.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.ageRange) {
      filteredPatients = filteredPatients.filter(patient => {
        if (filters.ageRange?.min && patient.age && patient.age < filters.ageRange.min) return false;
        if (filters.ageRange?.max && patient.age && patient.age > filters.ageRange.max) return false;
        return true;
      });
    }

    return {
      patients: filteredPatients,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    };
  }

  // Obtener estadísticas de pacientes
  static async getPatientStats(centerId: string): Promise<PatientStats> {
    const patientsRef = collection(db, 'centers', centerId, 'patients');
    const querySnapshot = await getDocs(patientsRef);
    
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[];

    const stats: PatientStats = {
      total: patients.length,
      active: patients.filter(p => p.status === 'active').length,
      inactive: patients.filter(p => p.status === 'inactive').length,
      discharged: patients.filter(p => p.status === 'discharged').length,
      byGender: { M: 0, F: 0, Otro: 0 },
      byEmotionalState: {
        'Estable': 0,
        'Ansioso/a': 0,
        'Deprimido/a': 0,
        'Irritable': 0,
        'Eufórico/a': 0,
        'Confundido/a': 0,
        'Agresivo/a': 0,
        'Retraído/a': 0
      },
      averageAge: 0
    };

    let totalAge = 0;
    let ageCount = 0;

    patients.forEach(patient => {
      // Contar por género
      stats.byGender[patient.gender]++;
      
      // Contar por estado emocional
      stats.byEmotionalState[patient.emotionalState]++;
      
      // Calcular edad promedio
      if (patient.age) {
        totalAge += patient.age;
        ageCount++;
      }
    });

    stats.averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;

    return stats;
  }

  // Buscar pacientes por nombre
  static async searchPatients(centerId: string, searchTerm: string): Promise<Patient[]> {
    const { patients } = await this.getPatients(centerId);
    
    const searchLower = searchTerm.toLowerCase();
    return patients.filter(patient =>
      patient.fullName.toLowerCase().includes(searchLower) ||
      patient.motivoConsulta.toLowerCase().includes(searchLower)
    );
  }

  // Obtener pacientes asignados a un psicólogo
  static async getPsychologistPatients(centerId: string, psychologistId: string): Promise<Patient[]> {
    const { patients } = await this.getPatients(centerId, {
      assignedPsychologist: psychologistId,
      status: 'active'
    });
    
    return patients;
  }

  // ==================== SESIONES CLÍNICAS ====================

  // Helper function to remove undefined values
  private static removeUndefinedValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const cleaned: Partial<T> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        (cleaned as Record<string, unknown>)[key] = value;
      }
    }
    
    return cleaned;
  }

  // Crear sesión
  static async createSession(centerId: string, sessionData: SessionFormData, createdBy: string): Promise<string> {
    const sessionsRef = collection(db, 'centers', centerId, 'sessions');
    
    // Remove undefined values to prevent Firestore errors
    const cleanedSessionData = this.removeUndefinedValues(sessionData as unknown as Record<string, unknown>);
    
    const docRef = await addDoc(sessionsRef, {
      ...cleanedSessionData,
      centerId,
      professionalId: createdBy,
      createdBy,
      aiProcessingStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  // Obtener sesión por ID
  static async getSession(centerId: string, sessionId: string): Promise<Session | null> {
    const sessionRef = doc(db, 'centers', centerId, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();
      return {
        id: sessionSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        aiAnalysis: data.aiAnalysis ? {
          ...data.aiAnalysis,
          generatedAt: data.aiAnalysis.generatedAt?.toDate(),
        } : undefined,
      } as Session;
    }
    
    return null;
  }

  // Actualizar sesión
  static async updateSession(centerId: string, sessionId: string, sessionData: Partial<SessionFormData>, updatedBy: string): Promise<void> {
    const sessionRef = doc(db, 'centers', centerId, 'sessions', sessionId);
    
    // Remove undefined values to prevent Firestore errors
    const cleanedSessionData = this.removeUndefinedValues(sessionData);
    
    await updateDoc(sessionRef, {
      ...cleanedSessionData,
      lastModifiedBy: updatedBy,
      updatedAt: serverTimestamp(),
    });
  }

  // Actualizar análisis de IA de una sesión
  static async updateSessionAIAnalysis(centerId: string, sessionId: string, aiAnalysis: AIAnalysis): Promise<void> {
    const sessionRef = doc(db, 'centers', centerId, 'sessions', sessionId);
    
    await updateDoc(sessionRef, {
      aiAnalysis: {
        ...aiAnalysis,
        generatedAt: serverTimestamp(),
      },
      aiProcessingStatus: 'completed',
      updatedAt: serverTimestamp(),
    });
  }

  // Marcar sesión como procesándose con IA
  static async markSessionAsProcessing(centerId: string, sessionId: string): Promise<void> {
    const sessionRef = doc(db, 'centers', centerId, 'sessions', sessionId);
    
    await updateDoc(sessionRef, {
      aiProcessingStatus: 'processing',
      updatedAt: serverTimestamp(),
    });
  }

  // Marcar sesión como fallida en procesamiento de IA
  static async markSessionAIProcessingFailed(centerId: string, sessionId: string, error: string): Promise<void> {
    const sessionRef = doc(db, 'centers', centerId, 'sessions', sessionId);
    
    await updateDoc(sessionRef, {
      aiProcessingStatus: 'failed',
      aiProcessingError: error,
      updatedAt: serverTimestamp(),
    });
  }

  // Eliminar sesión
  static async deleteSession(centerId: string, sessionId: string): Promise<void> {
    const sessionRef = doc(db, 'centers', centerId, 'sessions', sessionId);
    await deleteDoc(sessionRef);
  }

  // Obtener sesiones con filtros
  static async getSessions(
    centerId: string,
    filters?: SessionFilters,
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ sessions: Session[], lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    const sessionsRef = collection(db, 'centers', centerId, 'sessions');
    let q = query(sessionsRef, orderBy('date', 'desc'));

    // Aplicar filtros
    if (filters?.patientId) {
      q = query(q, where('patientId', '==', filters.patientId));
    }

    if (filters?.professionalId) {
      q = query(q, where('professionalId', '==', filters.professionalId));
    }

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }

    // Paginación
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        aiAnalysis: data.aiAnalysis ? {
          ...data.aiAnalysis,
          generatedAt: data.aiAnalysis.generatedAt?.toDate(),
        } : undefined,
      };
    }) as Session[];

    // Aplicar filtros del lado del cliente
    let filteredSessions = sessions;

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredSessions = filteredSessions.filter(session =>
        session.notes.toLowerCase().includes(searchTerm) ||
        session.observations?.toLowerCase().includes(searchTerm) ||
        session.aiAnalysis?.summary.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.emotionalTone) {
      filteredSessions = filteredSessions.filter(session =>
        session.aiAnalysis?.emotionalTone === filters.emotionalTone
      );
    }

    if (filters?.riskLevel) {
      filteredSessions = filteredSessions.filter(session =>
        session.aiAnalysis?.riskLevel === filters.riskLevel
      );
    }

    if (filters?.hasAIAnalysis !== undefined) {
      filteredSessions = filteredSessions.filter(session =>
        filters.hasAIAnalysis ? !!session.aiAnalysis : !session.aiAnalysis
      );
    }

    if (filters?.dateRange) {
      filteredSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.date);
        if (filters.dateRange?.start && sessionDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange?.end && sessionDate > new Date(filters.dateRange.end)) return false;
        return true;
      });
    }

    return {
      sessions: filteredSessions,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    };
  }

  // Obtener historial de sesiones de un paciente
  static async getPatientSessions(centerId: string, patientId: string): Promise<Session[]> {
    const { sessions } = await this.getSessions(centerId, { patientId });
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Obtener sesiones de un profesional
  static async getProfessionalSessions(centerId: string, professionalId: string): Promise<Session[]> {
    const { sessions } = await this.getSessions(centerId, { professionalId });
    return sessions;
  }

  // Obtener estadísticas de sesiones
  static async getSessionStats(centerId: string): Promise<SessionStats> {
    const { sessions } = await this.getSessions(centerId);

    const stats: SessionStats = {
      total: sessions.length,
      completed: sessions.filter(s => s.status === 'completed').length,
      scheduled: sessions.filter(s => s.status === 'scheduled').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
      byType: {
        individual: sessions.filter(s => s.type === 'individual').length,
        group: sessions.filter(s => s.type === 'group').length,
        family: sessions.filter(s => s.type === 'family').length,
        online: sessions.filter(s => s.type === 'online').length,
      },
      byEmotionalTone: {
        'Estable': 0,
        'Ansioso/a': 0,
        'Deprimido/a': 0,
        'Irritable': 0,
        'Eufórico/a': 0,
        'Confundido/a': 0,
        'Agresivo/a': 0,
        'Retraído/a': 0,
        'Esperanzado/a': 0,
        'Frustrado/a': 0,
      },
      averageDuration: 0,
      withAIAnalysis: sessions.filter(s => !!s.aiAnalysis).length,
      riskDistribution: {
        low: sessions.filter(s => s.aiAnalysis?.riskLevel === 'low').length,
        medium: sessions.filter(s => s.aiAnalysis?.riskLevel === 'medium').length,
        high: sessions.filter(s => s.aiAnalysis?.riskLevel === 'high').length,
      },
    };

    // Calcular estadísticas por tono emocional
    sessions.forEach(session => {
      if (session.aiAnalysis?.emotionalTone) {
        stats.byEmotionalTone[session.aiAnalysis.emotionalTone]++;
      }
    });

    // Calcular duración promedio
    const sessionsWithDuration = sessions.filter(s => s.duration);
    if (sessionsWithDuration.length > 0) {
      const totalDuration = sessionsWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0);
      stats.averageDuration = Math.round(totalDuration / sessionsWithDuration.length);
    }

    return stats;
  }

  // Buscar sesiones por contenido
  static async searchSessions(centerId: string, searchTerm: string): Promise<Session[]> {
    const { sessions } = await this.getSessions(centerId, { search: searchTerm });
    return sessions;
  }

  // ==================== ALERTAS CLÍNICAS ====================

  // Crear alerta
  static async createAlert(
    centerId: string, 
    alertData: AlertFormData & {
      autoGenerated: boolean;
      sourceSessionId?: string;
      status: 'activa';
      notificationSent: boolean;
    }, 
    createdBy: string
  ): Promise<string> {
    const alertsRef = collection(db, 'centers', centerId, 'alerts');
    
    const docRef = await addDoc(alertsRef, {
      ...alertData,
      centerId,
      createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  // Obtener alerta por ID
  static async getAlert(centerId: string, alertId: string): Promise<ClinicalAlert | null> {
    const alertRef = doc(db, 'centers', centerId, 'alerts', alertId);
    const alertSnap = await getDoc(alertRef);
    
    if (alertSnap.exists()) {
      const data = alertSnap.data();
      return {
        id: alertSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        resolvedAt: data.resolvedAt?.toDate(),
        lastTriggered: data.lastTriggered?.toDate(),
      } as ClinicalAlert;
    }
    
    return null;
  }

  // Actualizar alerta
  static async updateAlert(
    centerId: string, 
    alertId: string, 
    alertData: Partial<ClinicalAlert>
  ): Promise<void> {
    const alertRef = doc(db, 'centers', centerId, 'alerts', alertId);
    
    await updateDoc(alertRef, {
      ...alertData,
      updatedAt: serverTimestamp(),
    });
  }

  // Eliminar alerta
  static async deleteAlert(centerId: string, alertId: string): Promise<void> {
    const alertRef = doc(db, 'centers', centerId, 'alerts', alertId);
    await deleteDoc(alertRef);
  }

  // Obtener alertas con filtros
  static async getAlerts(
    centerId: string,
    filters?: AlertFilters,
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ alerts: ClinicalAlert[], lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    const alertsRef = collection(db, 'centers', centerId, 'alerts');
    let q = query(alertsRef, orderBy('createdAt', 'desc'));

    // Aplicar filtros
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }

    if (filters?.urgency) {
      q = query(q, where('urgency', '==', filters.urgency));
    }

    if (filters?.patientId) {
      q = query(q, where('patientId', '==', filters.patientId));
    }

    if (filters?.createdBy) {
      q = query(q, where('createdBy', '==', filters.createdBy));
    }

    if (filters?.autoGenerated !== undefined) {
      q = query(q, where('autoGenerated', '==', filters.autoGenerated));
    }

    // Paginación
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const alerts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        resolvedAt: data.resolvedAt?.toDate(),
        lastTriggered: data.lastTriggered?.toDate(),
      };
    }) as ClinicalAlert[];

    // Aplicar filtros del lado del cliente
    let filteredAlerts = alerts;

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.description.toLowerCase().includes(searchTerm) ||
        alert.notes?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.dateRange) {
      filteredAlerts = filteredAlerts.filter(alert => {
        const alertDate = new Date(alert.createdAt);
        if (filters.dateRange?.start && alertDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange?.end && alertDate > new Date(filters.dateRange.end)) return false;
        return true;
      });
    }

    return {
      alerts: filteredAlerts,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    };
  }

  // Obtener alertas activas
  static async getActiveAlerts(centerId: string): Promise<ClinicalAlert[]> {
    const { alerts } = await this.getAlerts(centerId, { status: 'activa' });
    return alerts;
  }

  // Obtener alertas de un paciente
  static async getPatientAlerts(centerId: string, patientId: string): Promise<ClinicalAlert[]> {
    const { alerts } = await this.getAlerts(centerId, { patientId });
    return alerts;
  }

  // **MÉTODO FALTANTE: Obtener alertas recientes**
  static async getRecentAlerts(centerId: string, limitCount: number = 10): Promise<ClinicalAlert[]> {
    try {
      const alertsRef = collection(db, 'centers', centerId, 'alerts');
      const q = query(
        alertsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          resolvedAt: data.resolvedAt?.toDate(),
          lastTriggered: data.lastTriggered?.toDate(),
        };
      }) as ClinicalAlert[];
    } catch (error) {
      console.error('Error getting recent alerts:', error);
      return [];
    }
  }

  // Obtener todas las alertas (para estadísticas)
  static async getAllAlerts(centerId: string): Promise<ClinicalAlert[]> {
    const alertsRef = collection(db, 'centers', centerId, 'alerts');
    const querySnapshot = await getDocs(alertsRef);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        resolvedAt: data.resolvedAt?.toDate(),
        lastTriggered: data.lastTriggered?.toDate(),
      };
    }) as ClinicalAlert[];
  }

  // **MÉTODO FALTANTE: Obtener estadísticas de alertas**
  static async getAlertStats(centerId: string): Promise<AlertStats> {
    try {
      const alerts = await this.getAllAlerts(centerId);
      
      const stats: AlertStats = {
        total: alerts.length,
        active: alerts.filter(a => a.status === 'activa').length,
        resolved: alerts.filter(a => a.status === 'resuelta').length,
        cancelled: alerts.filter(a => a.status === 'cancelada').length,
        expired: alerts.filter(a => a.status === 'expirada').length,
        highUrgency: alerts.filter(a => a.urgency === 'alta' || a.urgency === 'crítica').length,
        autoGenerated: alerts.filter(a => a.autoGenerated).length,
        pendingNotifications: alerts.filter(a => a.status === 'activa' && !a.notificationSent).length,
        byType: {
          appointment: 0,
          medication: 0,
          followup: 0,
          emergency: 0,
          custom: 0,
          síntoma: 0,
          fecha: 0,
          inactividad: 0
        },
        byUrgency: {
          baja: 0,
          media: 0,
          alta: 0,
          crítica: 0
        },
        byTrigger: {
          fecha_programada: 0,
          texto_IA: 0,
          falta_sesión: 0,
          manual: 0
        }
      };

      // Contar por tipo
      alerts.forEach(alert => {
        stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
        stats.byUrgency[alert.urgency] = (stats.byUrgency[alert.urgency] || 0) + 1;
        stats.byTrigger[alert.trigger] = (stats.byTrigger[alert.trigger] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting alert stats:', error);
      return {
        total: 0,
        active: 0,
        resolved: 0,
        cancelled: 0,
        expired: 0,
        highUrgency: 0,
        autoGenerated: 0,
        pendingNotifications: 0,
        byType: {
          appointment: 0,
          medication: 0,
          followup: 0,
          emergency: 0,
          custom: 0,
          síntoma: 0,
          fecha: 0,
          inactividad: 0
        },
        byUrgency: {
          baja: 0,
          media: 0,
          alta: 0,
          crítica: 0
        },
        byTrigger: {
          fecha_programada: 0,
          texto_IA: 0,
          falta_sesión: 0,
          manual: 0
        }
      };
    }
  }

  // Obtener pacientes activos (para verificación de inactividad)
  static async getActivePatients(centerId: string): Promise<Patient[]> {
    const { patients } = await this.getPatients(centerId, { status: 'active' });
    return patients;
  }

  // ==================== LOGS DE ALERTAS ====================

  // Crear log de acción de alerta
  static async createAlertLog(
    centerId: string,
    logData: Omit<AlertActionLog, 'id' | 'centerId'>
  ): Promise<string> {
    const logsRef = collection(db, 'centers', centerId, 'alertLogs');
    
    const docRef = await addDoc(logsRef, {
      ...logData,
      centerId,
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  }

  // Obtener logs de una alerta
  static async getAlertLogs(centerId: string, alertId: string): Promise<AlertActionLog[]> {
    const logsRef = collection(db, 'centers', centerId, 'alertLogs');
    const q = query(
      logsRef, 
      where('alertId', '==', alertId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as AlertActionLog[];
  }

  // Obtener logs recientes de alertas
  static async getRecentAlertLogs(centerId: string, limitCount: number = 50): Promise<AlertActionLog[]> {
    const logsRef = collection(db, 'centers', centerId, 'alertLogs');
    const q = query(
      logsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as AlertActionLog[];
  }
}