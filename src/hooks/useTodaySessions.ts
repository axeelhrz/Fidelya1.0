import { useState, useEffect, useCallback } from 'react';
import { Session, SessionFilters } from '../types/session';
import { SessionService } from '../lib/services/sessionService';
import { useAuth } from '../contexts/AuthContext';

export const useTodaySessions = (selectedDate?: string) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SessionFilters>({});

  const today = selectedDate || new Date().toISOString().split('T')[0];

  const fetchSessions = useCallback(async () => {
    if (!user?.centerId || !user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedSessions = await SessionService.getTodaySessions(
        user.centerId,
        user.uid,
        today
      );
      setSessions(fetchedSessions);
      setFilteredSessions(fetchedSessions);
    } catch (err) {
      setError('Error al cargar las sesiones del día');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.uid, today]);

  const applyFilters = useCallback((newFilters: SessionFilters) => {
    setFilters(newFilters);
    const filtered = SessionService.filterSessions(sessions, newFilters);
    setFilteredSessions(filtered);
  }, [sessions]);

  const refreshSessions = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    applyFilters(filters);
  }, [sessions, filters, applyFilters]);

  return {
    sessions: filteredSessions,
    allSessions: sessions,
    loading,
    error,
    filters,
    applyFilters,
    refreshSessions,
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.status === 'finalizada').length,
    pendingSessions: sessions.filter(s => s.status === 'pendiente').length,
  };
};
