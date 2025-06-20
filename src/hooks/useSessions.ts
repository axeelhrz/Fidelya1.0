import { useState, useEffect, useCallback } from 'react';
import { Session, SessionFormData, SessionFilters, SessionStats, EmotionalTone } from '@/types/session';
import { FirestoreService } from '@/services/firestore';
import { AIService } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export function useSessions(filters?: SessionFilters) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [hasMore, setHasMore] = useState(true);
  
  const { user } = useAuth();

  const loadSessions = useCallback(async (reset = false) => {
    if (!user?.centerId) return;

    try {
      setLoading(true);
      setError(null);

      const { sessions: newSessions, lastDoc: newLastDoc } = await FirestoreService.getSessions(
        user.centerId,
        filters,
        50,
        reset ? undefined : lastDoc
      );

      if (reset) {
        setSessions(newSessions);
      } else {
        setSessions(prev => [...prev, ...newSessions]);
      }

      setLastDoc(newLastDoc);
      setHasMore(newSessions.length === 50);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, filters, lastDoc]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadSessions(false);
    }
  }, [loading, hasMore, loadSessions]);

  const refresh = useCallback(() => {
    setLastDoc(undefined);
    setHasMore(true);
    loadSessions(true);
  }, [loadSessions]);

  useEffect(() => {
    refresh();
  }, [filters, refresh]);

  return {
    sessions,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}

export function useSession(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.centerId || !sessionId) return;

    const loadSession = async () => {
      try {
        setLoading(true);
        setError(null);
        const sessionData = await FirestoreService.getSession(user.centerId, sessionId);
        setSession(sessionData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [user?.centerId, sessionId]);

  return { session, loading, error };
}

export function usePatientSessions(patientId: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.centerId || !patientId) return;

    const loadPatientSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const sessionsData = await FirestoreService.getPatientSessions(user.centerId, patientId);
        setSessions(sessionsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadPatientSessions();
  }, [user?.centerId, patientId]);

  const refresh = useCallback(async () => {
    if (!user?.centerId || !patientId) return;
    
    try {
      setLoading(true);
      const sessionsData = await FirestoreService.getPatientSessions(user.centerId, patientId);
      setSessions(sessionsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, patientId]);

  return { sessions, loading, error, refresh };
}

export function useSessionStats() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.centerId) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const statsData = await FirestoreService.getSessionStats(user.centerId);
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

export function useSessionActions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  const processSessionWithAI = useCallback(async (sessionId: string, notes: string): Promise<void> => {
    if (!user?.centerId) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    // Validar que las notas sean suficientes para análisis
    const validation = AIService.validateNotesForAnalysis(notes);
    if (!validation.isValid) {
      console.warn('Notas insuficientes para análisis de IA:', validation.reason);
      return;
    }

    setAiProcessing(true);
    try {
      // Marcar como procesándose
      await FirestoreService.markSessionAsProcessing(user.centerId, sessionId);

      // Procesar con IA
      const aiResult = await AIService.analyzeSessionNotes(sessionId, notes);

      // Validar y normalizar el modelo usado
      const validateModel = (model: string | undefined): 'gpt-4' | 'gpt-3.5-turbo' => {
        if (model === 'gpt-4' || model === 'gpt-3.5-turbo') {
          return model;
        }
        // Default to gpt-4 if model is not recognized
        return 'gpt-4';
      };

      // Convertir a formato AIAnalysis
      const aiAnalysis = {
        summary: aiResult.summary,
        recommendation: aiResult.recommendations?.[0] || '',
        emotionalTone: aiResult.emotionalTone as EmotionalTone,
        keyInsights: aiResult.keyPoints || [],
        riskLevel: aiResult.riskLevel,
        suggestedInterventions: aiResult.recommendations || [],
        generatedAt: new Date(),
        processedBy: validateModel(aiResult.model),
        confidence: aiResult.confidence
      };

      // Guardar el análisis
      await FirestoreService.updateSessionAIAnalysis(user.centerId, sessionId, aiAnalysis);
    } catch (error) {
      console.error('Error procesando sesión con IA:', error);
      await FirestoreService.markSessionAIProcessingFailed(
        user.centerId, 
        sessionId, 
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setAiProcessing(false);
    }
  }, [user]);

  const createSession = useCallback(async (sessionData: SessionFormData): Promise<string> => {
    if (!user?.centerId || !user?.uid) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    setLoading(true);
    try {
      const sessionId = await FirestoreService.createSession(
        user.centerId,
        sessionData,
        user.uid
      );

      // Procesar con IA si las notas son suficientes
      if (sessionData.notes && sessionData.notes.trim().length > 50) {
        processSessionWithAI(sessionId, sessionData.notes);
      }

      return sessionId;
    } finally {
      setLoading(false);
    }
  }, [user, processSessionWithAI]);

  const updateSession = useCallback(async (sessionId: string, sessionData: Partial<SessionFormData>): Promise<void> => {
    if (!user?.centerId || !user?.uid) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    setLoading(true);
    try {
      await FirestoreService.updateSession(user.centerId, sessionId, sessionData, user.uid);

      // Reprocesar con IA si se actualizaron las notas
      if (sessionData.notes && sessionData.notes.trim().length > 50) {
        processSessionWithAI(sessionId, sessionData.notes);
      }
    } finally {
      setLoading(false);
    }
  }, [user, processSessionWithAI]);

  const deleteSession = useCallback(async (sessionId: string): Promise<void> => {
    if (!user?.centerId) {
      throw new Error('Usuario no autenticado o sin centro asignado');
    }

    setLoading(true);
    try {
      await FirestoreService.deleteSession(user.centerId, sessionId);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const reprocessWithAI = useCallback(async (sessionId: string, notes: string): Promise<void> => {
    await processSessionWithAI(sessionId, notes);
  }, [processSessionWithAI]);

  return {
    createSession,
    updateSession,
    deleteSession,
    processSessionWithAI,
    reprocessWithAI,
    loading,
    aiProcessing
  };
}

export function useSessionSearch() {
  const [results, setResults] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  const searchSessions = useCallback(async (searchTerm: string): Promise<Session[]> => {
    if (!user?.centerId || !searchTerm.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);
    
    try {
      const sessions = await FirestoreService.searchSessions(user.centerId, searchTerm);
      setResults(sessions);
      return sessions;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.centerId]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchSessions,
    clearResults
  };
}