import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs,
  QueryDocumentSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Session, SessionStatus, EmotionalState } from '../types/session';
import { useAuth } from '../contexts/AuthContext';

export interface SessionHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: SessionStatus[];
  patientName?: string;
  emotionalState?: EmotionalState[];
  searchText?: string;
  professionalId?: string;
}

export interface SessionHistoryOptions {
  pageSize?: number;
  sortBy?: 'date' | 'patientName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export const useSessionHistory = (
  filters: SessionHistoryFilters = {},
  options: SessionHistoryOptions = {}
) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const {
    pageSize = 20,
    sortBy = 'date',
    sortOrder = 'desc'
  } = options;

  // Función para construir la query base
  const buildQuery = useCallback((isLoadMore = false) => {
    if (!user?.centerId) return null;

    const sessionsRef = collection(db, `centers/${user.centerId}/sessions`);
    let q = query(sessionsRef);

    // Filtro por profesional (siempre incluir)
    q = query(q, where('professionalId', '==', user.id));

    // Filtros de fecha
    if (filters.dateFrom) {
      q = query(q, where('date', '>=', filters.dateFrom));
    }
    if (filters.dateTo) {
      q = query(q, where('date', '<=', filters.dateTo));
    }

    // Filtro por estado (Firestore no soporta array-contains-any con otros filtros complejos)
    if (filters.status && filters.status.length === 1) {
      q = query(q, where('status', '==', filters.status[0]));
    }

    // Ordenamiento
    const orderField = sortBy === 'date' ? 'date' : 
                      sortBy === 'patientName' ? 'patientName' : 'status';
    q = query(q, orderBy(orderField, sortOrder));
    
    // Si es ordenamiento por fecha, agregar ordenamiento secundario por hora
    if (sortBy === 'date') {
      q = query(q, orderBy('time', sortOrder));
    }

    // Paginación
    if (isLoadMore && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    q = query(q, limit(pageSize));

    return q;
  }, [user?.centerId, user?.id, filters, sortBy, sortOrder, pageSize, lastDoc]);

  // Función para aplicar filtros del lado del cliente
  const applyClientSideFilters = useCallback((sessions: Session[]): Session[] => {
    return sessions.filter(session => {
      // Filtro por múltiples estados
      if (filters.status && filters.status.length > 1) {
        if (!filters.status.includes(session.status)) return false;
      }

      // Filtro por nombre de paciente
      if (filters.patientName) {
        const searchTerm = filters.patientName.toLowerCase();
        if (!session.patientName.toLowerCase().includes(searchTerm)) return false;
      }

      // Filtro por estado emocional
      if (filters.emotionalState && filters.emotionalState.length > 0) {
        const hasMatchingEmotion = filters.emotionalState.some(emotion => 
          session.emotionalTonePre === emotion || session.emotionalTonePost === emotion
        );
        if (!hasMatchingEmotion) return false;
      }

      // Búsqueda por texto en notas y motivo de consulta
      if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        const searchableText = [
          session.notes || '',
          session.summary || '',
          session.consultationReason || '',
          session.recommendation || ''
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [filters]);

  // Función para cargar sesiones
  const loadSessions = useCallback(async (isLoadMore = false) => {
    const q = buildQuery(isLoadMore);
    if (!q) return;

    try {
      setLoading(true);
      setError(null);

      const snapshot = await getDocs(q);
      const newSessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Session[];

      // Aplicar filtros del lado del cliente
      const filteredSessions = applyClientSideFilters(newSessions);

      if (isLoadMore) {
        setSessions(prev => [...prev, ...filteredSessions]);
      } else {
        setSessions(filteredSessions);
      }

      // Actualizar estado de paginación
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);

      // Actualizar contador total (aproximado)
      if (!isLoadMore) {
        setTotalCount(filteredSessions.length);
      }

    } catch (err) {
      console.error('Error loading session history:', err);
      setError('Error al cargar el historial de sesiones');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, applyClientSideFilters, pageSize]);

  // Función para cargar más sesiones
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadSessions(true);
    }
  }, [loading, hasMore, loadSessions]);

  // Función para refrescar
  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    loadSessions(false);
  }, [loadSessions]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
  }, []);

  // Efecto para cargar sesiones cuando cambian los filtros
  useEffect(() => {
    clearFilters();
    loadSessions(false);
  }, [filters, options, user?.centerId, user?.id, clearFilters, loadSessions]);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    return {
      total: sessions.length,
      completed: sessions.filter(s => s.status === 'finalizada').length,
      pending: sessions.filter(s => s.status === 'pendiente').length,
      inProgress: sessions.filter(s => s.status === 'en_curso').length,
      cancelled: sessions.filter(s => s.status === 'cancelada').length,
    };
  }, [sessions]);

  return {
    sessions,
    loading,
    error,
    hasMore,
    totalCount,
    stats,
    loadMore,
    refresh,
    clearError: () => setError(null),
  };
};
