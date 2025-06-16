import { useState, useEffect, useCallback } from 'react';
import { Patient, PatientFormData, PatientFilters, PatientStats } from '@/types/patient';
import { FirestoreService } from '@/services/firestore';
import { useAuth } from '@/context/AuthContext';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export function usePatients(filters?: PatientFilters) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [hasMore, setHasMore] = useState(true);
  
  const { user } = useAuth();

  const loadPatients = useCallback(async (reset = false) => {
    if (!user?.centerId) return;

    try {
      setLoading(true);
      setError(null);

      const { patients: newPatients, lastDoc: newLastDoc } = await FirestoreService.getPatients(
        user.centerId,
        filters,
        50,
        reset ? undefined : lastDoc
      );

      if (reset) {
        setPatients(newPatients);
      } else {
        setPatients(prev => [...prev, ...newPatients]);
      }

      setLastDoc(newLastDoc);
      setHasMore(newPatients.length === 50);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, filters, lastDoc]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPatients(false);
    }
  }, [loading, hasMore, loadPatients]);

  const refresh = useCallback(() => {
    setLastDoc(undefined);
    setHasMore(true);
    loadPatients(true);
  }, [loadPatients]);

  useEffect(() => {
    refresh();
  }, [filters]);

  return {
    patients,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}

export function usePatient(patientId: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.centerId || !patientId) return;

    const loadPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        const patientData = await FirestoreService.getPatient(user.centerId, patientId);
        setPatient(patientData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [user?.centerId, patientId]);

  return { patient, loading, error };
}

export function usePatientStats() {
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.centerId) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const statsData = await FirestoreService.getPatientStats(user.centerId);
        setStats(statsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.centerId]);

  return { stats, loading, error };
}

export function usePatientActions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createPatient = useCallback(async (patientData: PatientFormData): Promise<string> => {
    if (!user?.centerId || !user?.uid) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    setLoading(true);
    try {
      const patientId = await FirestoreService.createPatient(
        user.centerId,
        patientData,
        user.uid
      );
      return patientId;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePatient = useCallback(async (patientId: string, patientData: Partial<PatientFormData>): Promise<void> => {
    if (!user?.centerId) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    setLoading(true);
    try {
      await FirestoreService.updatePatient(user.centerId, patientId, patientData);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deletePatient = useCallback(async (patientId: string): Promise<void> => {
    if (!user?.centerId) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    setLoading(true);
    try {
      await FirestoreService.deletePatient(user.centerId, patientId);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    createPatient,
    updatePatient,
    deletePatient,
    loading
  };
}
