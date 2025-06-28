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
  limit,
  onSnapshot,
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
  VirtualAppointment,
  SupervisionSession,
  ClinicalAPIResponse,
  PaginatedResponse
} from '@/types/clinical';

// ============================================================================
// HOOK PRINCIPAL PARA DATOS CLÍNICOS
// ============================================================================

export function useClinicalData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any, operation: string) => {
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
      handleError(error, 'obtener pacientes');
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
      handleError(error, 'obtener paciente');
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
      handleError(error, 'crear paciente');
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
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      // Convertir fechas a Timestamp si existen
      if (updates.dateOfBirth) {
        updateData.dateOfBirth = Timestamp.fromDate(updates.dateOfBirth);
      }
      if (updates.lastSession) {
        updateData.lastSession = Timestamp.fromDate(updates.lastSession);
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
  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt'
