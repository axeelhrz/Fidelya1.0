'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  ExtendedPatient,
  Appointment,
  ClinicalNote,
  TreatmentPlan,
  PsychometricAssessment,
} from '@/types/clinical';

// ============================================================================
// HOOK PRINCIPAL PARA DATOS CLÍNICOS
// ============================================================================

export function useClinicalData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: Error, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Error en ${operation}: ${error.message}`);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    handleError,
    setLoading,
    centerId: user?.centerId || ''
  };
}

// ============================================================================
// HOOK PARA GESTIÓN DE PACIENTES
// ============================================================================

export function usePatients() {
  const [patients, setPatients] = useState<ExtendedPatient[]>([]);
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  // Obtener todos los pacientes
  const fetchPatients = useCallback(async () => {
    if (!centerId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const patientsRef = collection(db, 'centers', centerId, 'patients');
      const q = query(patientsRef, orderBy('lastName', 'asc'));
      const snapshot = await getDocs(q);
      
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateOfBirth: doc.data().dateOfBirth?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastSession: doc.data().lastSession?.toDate()
      })) as ExtendedPatient[];
      
      setPatients(patientsData);
    } catch (error) {
      handleError(error as Error, 'obtener pacientes');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  // Obtener paciente por ID
  const getPatient = useCallback(async (patientId: string): Promise<ExtendedPatient | null> => {
    if (!centerId) return null;
    
    try {
      const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
      const snapshot = await getDoc(patientRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          lastSession: data.lastSession?.toDate()
        } as ExtendedPatient;
      }
      
      return null;
    } catch (error) {
      handleError(error as Error, 'obtener paciente');
      return null;
    }
  }, [centerId, handleError]);

  // Crear nuevo paciente
  const createPatient = useCallback(async (patientData: Omit<ExtendedPatient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!centerId) return null;
    
    setLoading(true);
    clearError();
    
    try {
      const patientsRef = collection(db, 'centers', centerId, 'patients');
      const now = new Date();
      
      const newPatient = {
        ...patientData,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        dateOfBirth: Timestamp.fromDate(patientData.dateOfBirth)
      };
      
      const docRef = await addDoc(patientsRef, newPatient);
      await fetchPatients(); // Refrescar lista
      
      return docRef.id;
    } catch (error) {
      handleError(error as Error, 'crear paciente');
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatients]);

  // Actualizar paciente
  const updatePatient = useCallback(async (patientId: string, updates: Partial<ExtendedPatient>): Promise<boolean> => {
    if (!centerId) return false;
    
    setLoading(true);
    clearError();
    
    try {
      const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
      
      // Prepare updateData for Firestore (convert dates to Timestamp)
      const updateData: Partial<ExtendedPatient> & { [key: string]: unknown } = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      // Convertir fechas a Timestamp si existen
      if (updates.dateOfBirth) {
        updateData.dateOfBirth = Timestamp.fromDate(
          updates.dateOfBirth instanceof Date
            ? updates.dateOfBirth
            : updates.dateOfBirth.toDate ? updates.dateOfBirth.toDate() : new Date(updates.dateOfBirth)
        );
      }
      if (updates.lastSession) {
        updateData.lastSession = Timestamp.fromDate(
          updates.lastSession instanceof Date
            ? updates.lastSession
            : updates.lastSession.toDate ? updates.lastSession.toDate() : new Date(updates.lastSession)
        );
      }
      
      await updateDoc(patientRef, updateData);
      await fetchPatients(); // Refrescar lista
      
      return true;
    } catch (error) {
      handleError(error, 'actualizar paciente');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatients]);

  // Eliminar paciente
  const deletePatient = useCallback(async (patientId: string): Promise<boolean> => {
    if (!centerId) return false;
    
    setLoading(true);
    clearError();
    
    try {
      const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
      await deleteDoc(patientRef);
      await fetchPatients(); // Refrescar lista
      
      return true;
    } catch (error) {
      handleError(error, 'eliminar paciente');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatients]);

  // Buscar pacientes
  const searchPatients = useCallback(async (searchTerm: string): Promise<ExtendedPatient[]> => {
    if (!centerId || !searchTerm.trim()) return patients;
    
    try {
      // Búsqueda local primero (más rápida)
      const localResults = patients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
      
      return localResults;
    } catch (error) {
      handleError(error, 'buscar pacientes');
      return [];
    }
  }, [centerId, patients, handleError]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    clearError,
    fetchPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
  };
}

// ============================================================================
// HOOK PARA GESTIÓN DE CITAS
// ============================================================================

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  // Obtener citas por rango de fechas
  const fetchAppointments = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!centerId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const appointmentsRef = collection(db, 'centers', centerId, 'appointments');
      let q = query(appointmentsRef, orderBy('date', 'asc'));
      
      if (startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
      }
      if (endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
      }
      
      const snapshot = await getDocs(q);
      
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        checkIn: doc.data().checkIn?.toDate(),
        checkOut: doc.data().checkOut?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Appointment[];
      
      setAppointments(appointmentsData);
    } catch (error) {
      handleError(error, 'obtener citas');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  // Crear nueva cita
// ... existing code ...

  // Crear nueva cita
  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!centerId) return null;
    
    setLoading(true);
    clearError();
    
    try {
      const appointmentsRef = collection(db, 'centers', centerId, 'appointments');
      const now = new Date();
      
      const newAppointment = {
        ...appointmentData,
        centerId,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        date: Timestamp.fromDate(appointmentData.date)
      };
      
      const docRef = await addDoc(appointmentsRef, newAppointment);
      await fetchAppointments(); // Refrescar lista
      
      return docRef.id;
    } catch (error) {
      handleError(error, 'crear cita');
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchAppointments]);

  // Actualizar cita
  const updateAppointment = useCallback(async (appointmentId: string, updates: Partial<Appointment>): Promise<boolean> => {
    if (!centerId) return false;
    
    setLoading(true);
    clearError();
    
    try {
      const appointmentRef = doc(db, 'centers', centerId, 'appointments', appointmentId);
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      // Convertir fechas a Timestamp si existen
      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }
      if (updates.checkIn) {
        updateData.checkIn = Timestamp.fromDate(updates.checkIn);
      }
      if (updates.checkOut) {
        updateData.checkOut = Timestamp.fromDate(updates.checkOut);
      }
      
      await updateDoc(appointmentRef, updateData);
      await fetchAppointments(); // Refrescar lista
      
      return true;
    } catch (error) {
      handleError(error, 'actualizar cita');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchAppointments]);

  // Check-in de cita
  const checkInAppointment = useCallback(async (appointmentId: string): Promise<boolean> => {
    return updateAppointment(appointmentId, {
      status: 'checked-in',
      checkIn: new Date()
    });
  }, [updateAppointment]);

  // Check-out de cita
  const checkOutAppointment = useCallback(async (appointmentId: string): Promise<boolean> => {
    return updateAppointment(appointmentId, {
      status: 'completed',
      checkOut: new Date()
    });
  }, [updateAppointment]);

  // Cancelar cita
  const cancelAppointment = useCallback(async (appointmentId: string, reason?: string): Promise<boolean> => {
    return updateAppointment(appointmentId, {
      status: 'cancelled',
      notes: reason ? `Cancelada: ${reason}` : 'Cancelada'
    });
  }, [updateAppointment]);

  return {
    appointments,
    loading,
    error,
    clearError,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    checkInAppointment,
    checkOutAppointment,
    cancelAppointment
  };
}

// ============================================================================
// HOOK PARA GESTIÓN DE NOTAS CLÍNICAS
// ============================================================================

export function useClinicalNotes() {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  // Obtener notas de un paciente
  const fetchPatientNotes = useCallback(async (patientId: string) => {
    if (!centerId || !patientId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const notesRef = collection(db, 'centers', centerId, 'patients', patientId, 'notes');
      const q = query(notesRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lockedAt: doc.data().lockedAt?.toDate()
      })) as ClinicalNote[];
      
      setNotes(notesData);
    } catch (error) {
      handleError(error, 'obtener notas clínicas');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  // Crear nueva nota
  const createNote = useCallback(async (patientId: string, noteData: Omit<ClinicalNote, 'id' | 'patientId' | 'centerId' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!centerId || !patientId) return null;
    
    setLoading(true);
    clearError();
    
    try {
      const notesRef = collection(db, 'centers', centerId, 'patients', patientId, 'notes');
      const now = new Date();
      
      const newNote = {
        ...noteData,
        patientId,
        centerId,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        date: Timestamp.fromDate(noteData.date),
        version: 1,
        previousVersions: []
      };
      
      const docRef = await addDoc(notesRef, newNote);
      await fetchPatientNotes(patientId); // Refrescar lista
      
      return docRef.id;
    } catch (error) {
      handleError(error, 'crear nota clínica');
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatientNotes]);

  // Actualizar nota (solo si no está bloqueada)
  const updateNote = useCallback(async (patientId: string, noteId: string, updates: Partial<ClinicalNote>): Promise<boolean> => {
    if (!centerId || !patientId) return false;
    
    setLoading(true);
    clearError();
    
    try {
      const noteRef = doc(db, 'centers', centerId, 'patients', patientId, 'notes', noteId);
      const noteSnapshot = await getDoc(noteRef);
      
      if (!noteSnapshot.exists()) {
        throw new Error('Nota no encontrada');
      }
      
      const currentNote = noteSnapshot.data() as ClinicalNote;
      
      // Verificar si la nota está bloqueada
      if (currentNote.status === 'locked') {
        throw new Error('No se puede editar una nota bloqueada');
      }
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
        version: (currentNote.version || 1) + 1,
        previousVersions: [...(currentNote.previousVersions || []), noteId]
      };
      
      // Convertir fechas a Timestamp si existen
      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }
      if (updates.lockedAt) {
        updateData.lockedAt = Timestamp.fromDate(updates.lockedAt);
      }
      
      await updateDoc(noteRef, updateData);
      await fetchPatientNotes(patientId); // Refrescar lista
      
      return true;
    } catch (error) {
      handleError(error, 'actualizar nota clínica');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatientNotes]);

  // Firmar nota
  // Define a type for signature if not already defined
  type Signature = string; // Replace with the actual type if it's an object

  const signNote = useCallback(async (patientId: string, noteId: string, signature: Signature): Promise<boolean> => {
    return updateNote(patientId, noteId, {
      status: 'signed',
      signature
    });
  }, [updateNote]);

  // Bloquear nota
  const lockNote = useCallback(async (patientId: string, noteId: string, lockedBy: string): Promise<boolean> => {
    return updateNote(patientId, noteId, {
      status: 'locked',
      lockedAt: new Date(),
      lockedBy
    });
  }, [updateNote]);

  return {
    notes,
    loading,
    error,
    clearError,
    fetchPatientNotes,
    createNote,
    updateNote,
    signNote,
    lockNote
  };
}

// ============================================================================
// HOOK PARA GESTIÓN DE PLANES DE TRATAMIENTO
// ============================================================================

export function useTreatmentPlans() {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  // Obtener planes de un paciente
  const fetchPatientPlans = useCallback(async (patientId: string) => {
    if (!centerId || !patientId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const plansRef = collection(db, 'centers', centerId, 'patients', patientId, 'treatmentPlans');
      const q = query(plansRef, orderBy('startDate', 'desc'));
      const snapshot = await getDocs(q);
      
      const plansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate(),
        lastReviewDate: doc.data().lastReviewDate?.toDate(),
        nextReviewDate: doc.data().nextReviewDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as TreatmentPlan[];
      
      setPlans(plansData);
    } catch (error) {
      handleError(error, 'obtener planes de tratamiento');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  // Crear nuevo plan
  const createPlan = useCallback(async (patientId: string, planData: Omit<TreatmentPlan, 'id' | 'patientId' | 'centerId' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!centerId || !patientId) return null;
    
    setLoading(true);
    clearError();
    
    try {
      const plansRef = collection(db, 'centers', centerId, 'patients', patientId, 'treatmentPlans');
      const now = new Date();
      
      const newPlan = {
        ...planData,
        patientId,
        centerId,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        startDate: Timestamp.fromDate(planData.startDate),
        endDate: planData.endDate ? Timestamp.fromDate(planData.endDate) : null,
        nextReviewDate: Timestamp.fromDate(planData.nextReviewDate),
        lastReviewDate: planData.lastReviewDate ? Timestamp.fromDate(planData.lastReviewDate) : null,
        history: []
      };
      
      const docRef = await addDoc(plansRef, newPlan);
      await fetchPatientPlans(patientId); // Refrescar lista
      
      return docRef.id;
    } catch (error) {
      handleError(error, 'crear plan de tratamiento');
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatientPlans]);

  // Actualizar plan
  const updatePlan = useCallback(async (patientId: string, planId: string, updates: Partial<TreatmentPlan>): Promise<boolean> => {
    if (!centerId || !patientId) return false;
    
    setLoading(true);
    clearError();
    
    try {
      const planRef = doc(db, 'centers', centerId, 'patients', patientId, 'treatmentPlans', planId);
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      // Convertir fechas a Timestamp si existen
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }
      if (updates.lastReviewDate) {
        updateData.lastReviewDate = Timestamp.fromDate(updates.lastReviewDate);
      }
      if (updates.nextReviewDate) {
        updateData.nextReviewDate = Timestamp.fromDate(updates.nextReviewDate);
      }
      
      await updateDoc(planRef, updateData);
      await fetchPatientPlans(patientId); // Refrescar lista
      
      return true;
    } catch (error) {
      handleError(error, 'actualizar plan de tratamiento');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatientPlans]);

  return {
    plans,
    loading,
    error,
    clearError,
    fetchPatientPlans,
    createPlan,
    updatePlan
  };
}

// ============================================================================
// HOOK PARA GESTIÓN DE EVALUACIONES PSICOMÉTRICAS
// ============================================================================

export function useAssessments() {
  const [assessments, setAssessments] = useState<PsychometricAssessment[]>([]);
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  // Obtener evaluaciones de un paciente
  const fetchPatientAssessments = useCallback(async (patientId: string) => {
    if (!centerId || !patientId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const assessmentsRef = collection(db, 'centers', centerId, 'patients', patientId, 'assessments');
      const q = query(assessmentsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const assessmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        nextAssessmentDate: doc.data().nextAssessmentDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as PsychometricAssessment[];
      
      setAssessments(assessmentsData);
    } catch (error) {
      handleError(error, 'obtener evaluaciones psicométricas');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  // Crear nueva evaluación
  const createAssessment = useCallback(async (patientId: string, assessmentData: Omit<PsychometricAssessment, 'id' | 'patientId' | 'centerId' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!centerId || !patientId) return null;
    
    setLoading(true);
    clearError();
    
    try {
      const assessmentsRef = collection(db, 'centers', centerId, 'patients', patientId, 'assessments');
      const now = new Date();
      
      const newAssessment = {
        ...assessmentData,
        patientId,
        centerId,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        date: Timestamp.fromDate(assessmentData.date),
        nextAssessmentDate: assessmentData.nextAssessmentDate ? Timestamp.fromDate(assessmentData.nextAssessmentDate) : null
      };
      
      const docRef = await addDoc(assessmentsRef, newAssessment);
      await fetchPatientAssessments(patientId); // Refrescar lista
      
      return docRef.id;
    } catch (error) {
      handleError(error, 'crear evaluación psicométrica');
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatientAssessments]);

  return {
    assessments,
    loading,
    error,
    clearError,
    fetchPatientAssessments,
    createAssessment
  };
}

// ============================================================================
// HOOK PARA BÚSQUEDA GLOBAL
// ============================================================================

export function useGlobalSearch() {
  type SearchResult = {
    id: string;
    type: 'patient' | 'appointment';
    title: string;
    subtitle: string;
    description: string;
    url: string;
    data: ExtendedPatient | Appointment; // Specify the possible types for search result data
  };

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  // Búsqueda global
  const globalSearch = useCallback(async (query: string, type: 'all' | 'patients' | 'appointments' | 'notes' = 'all') => {
    if (!centerId || !query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    clearError();
    
    try {
      const results: SearchResult[] = [];
      const searchTerm = query.toLowerCase();
      
      // Buscar en pacientes
      if (type === 'all' || type === 'patients') {
        const patientsRef = collection(db, 'centers', centerId, 'patients');
        const patientsSnapshot = await getDocs(patientsRef);
        
        patientsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (
            data.firstName?.toLowerCase().includes(searchTerm) ||
            data.lastName?.toLowerCase().includes(searchTerm) ||
            data.email?.toLowerCase().includes(searchTerm) ||
            data.phone?.includes(query)
          ) {
            results.push({
              id: doc.id,
              type: 'patient',
              title: `${data.firstName} ${data.lastName}`,
              subtitle: data.email,
              description: `Paciente • ${data.assignedTherapist}`,
              url: `/dashboard/patients/${doc.id}`,
              data: { ...data, id: doc.id }
            });
          }
        });
      }
      
      // Buscar en citas
      if (type === 'all' || type === 'appointments') {
        const appointmentsRef = collection(db, 'centers', centerId, 'appointments');
        const appointmentsSnapshot = await getDocs(appointmentsRef);
        
        appointmentsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (
            data.notes?.toLowerCase().includes(searchTerm) ||
            data.patientId?.includes(query)
          ) {
            results.push({
              id: doc.id,
              type: 'appointment',
              title: `Cita ${data.date?.toDate().toLocaleDateString()}`,
              subtitle: data.type,
              description: `Cita • ${data.status}`,
              url: `/dashboard/appointments/${doc.id}`,
              data: { ...data, id: doc.id }
            });
          }
        });
      }
      
      setSearchResults(results);
      
      // Agregar a historial
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10);
        return newHistory;
      });
      
    } catch (error) {
      handleError(error, 'realizar búsqueda');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  return {
    searchResults,
    searchHistory,
    loading,
    error,
    clearError,
    globalSearch
  };
}

// ============================================================================
// HOOK PARA MÉTRICAS DEL DASHBOARD
// ============================================================================

export function useDashboardMetrics() {
  type DashboardMetrics = {
    patients: {
      total: number;
      active: number;
      inactive: number;
      newThisMonth: number;
    };
    appointments: {
      total: number;
      completed: number;
      scheduled: number;
      cancelled: number;
    };
    clinical: {
      averageSessionsPerPatient: number;
      completionRate: number;
      noShowRate: number;
    };
  };

  const [metrics, setMetrics] = useState<DashboardMetrics | object>({});
  const { loading, error, clearError, handleError, setLoading, centerId } = useClinicalData();

  const fetchMetrics = useCallback(async () => {
    if (!centerId) return;
    
    setLoading(true);
    clearError();
    
    try {
      // Obtener métricas de pacientes
      const patientsRef = collection(db, 'centers', centerId, 'patients');
      const patientsSnapshot = await getDocs(patientsRef);
      const totalPatients = patientsSnapshot.size;
      const activePatients = patientsSnapshot.docs.filter(doc => doc.data().status === 'active').length;
      
      // Obtener métricas de citas
      const appointmentsRef = collection(db, 'centers', centerId, 'appointments');
      const appointmentsSnapshot = await getDocs(appointmentsRef);
      const totalAppointments = appointmentsSnapshot.size;
      const completedAppointments = appointmentsSnapshot.docs.filter(doc => doc.data().status === 'completed').length;
      
      // Calcular métricas
      const metricsData = {
        patients: {
          total: totalPatients,
          active: activePatients,
          inactive: totalPatients - activePatients,
          newThisMonth: 0 // TODO: Calcular basado en fechas
        },
        appointments: {
          total: totalAppointments,
          completed: completedAppointments,
          scheduled: appointmentsSnapshot.docs.filter(doc => doc.data().status === 'scheduled').length,
          cancelled: appointmentsSnapshot.docs.filter(doc => doc.data().status === 'cancelled').length
        },
        clinical: {
          averageSessionsPerPatient: totalAppointments / Math.max(totalPatients, 1),
          completionRate: (completedAppointments / Math.max(totalAppointments, 1)) * 100,
          noShowRate: (appointmentsSnapshot.docs.filter(doc => doc.data().status === 'no-show').length / Math.max(totalAppointments, 1)) * 100
        }
      };
      
      setMetrics(metricsData);
    } catch (error) {
      handleError(error, 'obtener métricas del dashboard');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    clearError,
    fetchMetrics
  };
}
