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
  ElectronicSignature
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
        updatedAt: new Date()
      };
      
      // Convertir fechas a Date si existen
      if (updates.dateOfBirth) {
        if (updates.dateOfBirth instanceof Date) {
          updateData.dateOfBirth = updates.dateOfBirth;
        } else if (typeof updates.dateOfBirth === 'string') {
          updateData.dateOfBirth = new Date(updates.dateOfBirth);
        } else if (
          typeof updates.dateOfBirth === 'object' &&
          updates.dateOfBirth !== null &&
          typeof (updates.dateOfBirth as Timestamp).toDate === 'function'
        ) {
          updateData.dateOfBirth = (updates.dateOfBirth as Timestamp).toDate();
        } else {
          // fallback: set to current date
          updateData.dateOfBirth = new Date();
        }
      }
      
      if (updates.lastSession) {
        if (updates.lastSession instanceof Date) {
          updateData.lastSession = updates.lastSession;
        } else if (
          typeof updates.lastSession === 'object' &&
          updates.lastSession !== null &&
          typeof (updates.lastSession as { toDate?: () => Date }).toDate === 'function'
        ) {
          // Convert Firestore Timestamp to Date
          updateData.lastSession = (updates.lastSession as { toDate: () => Date }).toDate();
        } else if (typeof updates.lastSession === 'string') {
          updateData.lastSession = new Date(updates.lastSession);
        } else {
          // fallback: set to current date
          updateData.lastSession = new Date();
        }
      }
      
      await updateDoc(patientRef, updateData);
      await fetchPatients(); // Refrescar lista
      return true;
    } catch (error) {
      handleError(error as Error, 'actualizar paciente');
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
      handleError(error as Error, 'eliminar paciente');
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
      handleError(error as Error, 'buscar pacientes');
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
      handleError(error as Error, 'obtener citas');
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError]);

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
      handleError(error as Error, 'crear cita');
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
      const updateData: Partial<Appointment> & { [key: string]: unknown } = {
        ...updates,
        updatedAt: new Date()
      };
      
      // Convertir fechas a Timestamp si existen
      if (updates.date) {
        updateData.date = updates.date instanceof Date
          ? updates.date
          : typeof updates.date === 'string'
            ? new Date(updates.date)
            : updates.date && typeof (updates.date as Timestamp).toDate === 'function'
              ? (updates.date as Timestamp).toDate()
              : undefined;
      }
      if (updates.checkIn) {
        updateData.checkIn = updates.checkIn instanceof Date
          ? updates.checkIn
          : typeof updates.checkIn === 'string'
            ? new Date(updates.checkIn)
            : updates.checkIn && typeof (updates.checkIn as Timestamp).toDate === 'function'
              ? (updates.checkIn as Timestamp).toDate()
              : undefined;
      }
      if (updates.checkOut) {
        updateData.checkOut = updates.checkOut instanceof Date
          ? updates.checkOut
          : typeof updates.checkOut === 'string'
            ? new Date(updates.checkOut)
            : updates.checkOut && typeof (updates.checkOut as Timestamp).toDate === 'function'
              ? (updates.checkOut as Timestamp).toDate()
              : undefined;
      }
      
      await updateDoc(appointmentRef, updateData);
      await fetchAppointments(); // Refrescar lista
      return true;
    } catch (error) {
      handleError(error as Error, 'actualizar cita');
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
      handleError(error as Error, 'obtener notas clínicas');
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
        previousVersions: null
      };
      
      const docRef = await addDoc(notesRef, newNote);
      await fetchPatientNotes(patientId); // Refrescar lista
      return docRef.id;
    } catch (error) {
      handleError(error as Error, 'crear nota clínica');
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
      
      const updateData: Partial<ClinicalNote> & { [key: string]: unknown } = {
        ...updates,
        updatedAt: new Date(),
        version: (currentNote.version || 1) + 1,
        previousVersions: currentNote.previousVersions || null
      };
      
      // Convertir fechas a Date si existen
      if (updates.date) {
        if (updates.date instanceof Date) {
          updateData.date = updates.date;
        } else if (updates.date && typeof (updates.date as Timestamp).toDate === 'function') {
          updateData.date = (updates.date as Timestamp).toDate();
        } else if (typeof updates.date === 'string') {
          updateData.date = new Date(updates.date);
        } else {
          updateData.date = undefined;
        }
      }
      if (updates.lockedAt) {
        if (updates.lockedAt instanceof Date) {
          updateData.lockedAt = updates.lockedAt;
        } else if (
          updates.lockedAt &&
          typeof (updates.lockedAt as { toDate?: () => Date }).toDate === 'function'
        ) {
          // If it's a Firestore Timestamp, convert to Date
          updateData.lockedAt = (updates.lockedAt as { toDate: () => Date }).toDate();
        } else if (typeof updates.lockedAt === 'string') {
          updateData.lockedAt = new Date(updates.lockedAt);
        } else {
          updateData.lockedAt = undefined;
        }
      }
      
      await updateDoc(noteRef, updateData);
      await fetchPatientNotes(patientId); // Refrescar lista
      return true;
    } catch (error) {
      handleError(error as Error, 'actualizar nota clínica');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, setLoading, clearError, handleError, fetchPatientNotes]);

  // Firmar nota
  const signNote = useCallback(async (patientId: string, noteId: string, signature: ElectronicSignature): Promise<boolean> => {
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
      handleError(error as Error, 'obtener planes de tratamiento');
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
      handleError(error as Error, 'crear plan de tratamiento');
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
      // Prepare updateData for Firestore (convert dates to Timestamp)
      const updateData: Partial<TreatmentPlan> & { [key: string]: unknown } = {
        ...updates,
        updatedAt: new Date()
      };

      // Convertir fechas a Timestamp si existen
      if (updates.startDate) {
        let startDate: Date | null = null;
        if (updates.startDate instanceof Date) {
          startDate = updates.startDate;
        } else if (typeof updates.startDate === 'string') {
          startDate = new Date(updates.startDate);
        } else if (
          typeof updates.startDate === 'object' &&
          updates.startDate !== null &&
          typeof (updates.startDate as { toDate?: () => Date }).toDate === 'function'
        ) {
          startDate = (updates.startDate as { toDate: () => Date }).toDate();
        }
        if (startDate) {
          // Always store as Date in updateData, Firestore will convert if needed
          updateData.startDate = startDate;
        }
      }
      if (updates.endDate) {
        let endDate: Date | null = null;
        if (updates.endDate instanceof Date) {
          endDate = updates.endDate;
        } else if (typeof updates.endDate === 'string') {
          endDate = new Date(updates.endDate);
        } else if (
          typeof updates.endDate === 'object' &&
          updates.endDate !== null &&
          typeof (updates.endDate as { toDate?: () => Date }).toDate === 'function'
        ) {
          endDate = (updates.endDate as { toDate: () => Date }).toDate();
        }
        if (endDate) updateData.endDate = endDate;
      }
      if (updates.lastReviewDate) {
        let lastReviewDate: Date | null = null;
        if (updates.lastReviewDate instanceof Date) {
          lastReviewDate = updates.lastReviewDate;
        } else if (typeof updates.lastReviewDate === 'string') {
          lastReviewDate = new Date(updates.lastReviewDate);
        } else if (
          typeof updates.lastReviewDate === 'object' &&
          updates.lastReviewDate !== null &&
          typeof (updates.lastReviewDate as { toDate?: () => Date }).toDate === 'function'
        ) {
          lastReviewDate = (updates.lastReviewDate as { toDate: () => Date }).toDate();
        }
        if (lastReviewDate) updateData.lastReviewDate = lastReviewDate;
      }
      if (updates.nextReviewDate) {
        let nextReviewDate: Date | null = null;
        if (updates.nextReviewDate instanceof Date) {
          nextReviewDate = updates.nextReviewDate;
        } else if (typeof updates.nextReviewDate === 'string') {
          nextReviewDate = new Date(updates.nextReviewDate);
        } else if (
          typeof updates.nextReviewDate === 'object' &&
          updates.nextReviewDate !== null &&
          typeof (updates.nextReviewDate as { toDate?: () => Date }).toDate === 'function'
        ) {
          nextReviewDate = (updates.nextReviewDate as { toDate: () => Date }).toDate();
        }
        if (nextReviewDate) updateData.nextReviewDate = nextReviewDate;
      }

      await updateDoc(planRef, updateData);
      await fetchPatientPlans(patientId); // Refrescar lista
      return true;
    } catch (error) {
      handleError(error as Error, 'actualizar plan de tratamiento');
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
      handleError(error as Error, 'obtener evaluaciones psicométricas');
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
      handleError(error as Error, 'crear evaluación psicométrica');
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
    data: ExtendedPatient | Appointment;
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
              data: { ...data, id: doc.id } as ExtendedPatient
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
              data: { ...data, id: doc.id } as Appointment
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
      handleError(error as Error, 'realizar búsqueda');
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

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    patients: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0
    },
    appointments: {
      total: 0,
      completed: 0,
      scheduled: 0,
      cancelled: 0
    },
    clinical: {
      averageSessionsPerPatient: 0,
      completionRate: 0,
      noShowRate: 0
    }
  });
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
      const metricsData: DashboardMetrics = {
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
      handleError(error as Error, 'obtener métricas del dashboard');
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