import { useState, useCallback } from 'react';
import { Session, CreateSessionData, UpdateSessionData } from '../types/session';
import { SessionService } from '../lib/services/sessionService';
import { AIService } from '../lib/services/aiService';
import { useAuth } from '../contexts/AuthContext';

export const useSessionActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (sessionData: CreateSessionData): Promise<string | null> => {
    if (!user?.centerId || !user?.id) {
      setError('Usuario no autenticado');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const sessionId = await SessionService.createSession(user.centerId, {
        ...sessionData,
        professionalId: user.id,
      });
      return sessionId;
    } catch (err) {
      setError('Error al crear la sesión');
      console.error('Error creating session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.id]);

  const updateSession = useCallback(async (sessionId: string, updateData: UpdateSessionData): Promise<boolean> => {
    if (!user?.centerId) {
      setError('Usuario no autenticado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await SessionService.updateSession(user.centerId, sessionId, updateData);
      return true;
    } catch (err) {
      setError('Error al actualizar la sesión');
      console.error('Error updating session:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.centerId]);

  const updateSessionStatus = useCallback(async (sessionId: string, status: Session['status']): Promise<boolean> => {
    if (!user?.centerId) {
      setError('Usuario no autenticado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await SessionService.updateSessionStatus(user.centerId, sessionId, status);
      return true;
    } catch (err) {
      setError('Error al actualizar el estado de la sesión');
      console.error('Error updating session status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.centerId]);

  const analyzeSessionWithAI = useCallback(async (notes: string, consultationReason: string) => {
    try {
      setLoading(true);
      setError(null);
      const analysis = await AIService.analyzeSessionNotes(notes, consultationReason);
      return analysis;
    } catch (err) {
      setError('Error al analizar la sesión con IA');
      console.error('Error analyzing session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSession,
    updateSession,
    updateSessionStatus,
    analyzeSessionWithAI,
    loading,
    error,
    clearError: () => setError(null),
  };
};
