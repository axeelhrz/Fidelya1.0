import { useState, useEffect, useCallback } from 'react';
import { ClinicalNote, CreateNoteData, UpdateNoteData, NoteFilters, NotesStats } from '@/types/notes';
import { notesService } from '@/lib/services/notesService';
import { useAuth } from '@/contexts/AuthContext';

export function useNotes(filters: NoteFilters = {}) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    if (!user?.centerId) return;

    try {
      setLoading(true);
      setError(null);
      
      const therapistFilters = user.role === 'therapist' 
        ? { ...filters, therapistId: user.id }
        : filters;
        
      const data = await notesService.getNotes(user.centerId, therapistFilters);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.id, user?.role, filters]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(async (data: CreateNoteData): Promise<string | null> => {
    if (!user?.centerId || !user?.id) return null;

    try {
      const noteId = await notesService.createNote(user.centerId, user.id, data);
      await loadNotes(); // Recargar la lista
      return noteId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la nota');
      return null;
    }
  }, [user?.centerId, user?.id, loadNotes]);

  const updateNote = useCallback(async (noteId: string, data: UpdateNoteData): Promise<boolean> => {
    if (!user?.centerId) return false;

    try {
      await notesService.updateNote(user.centerId, noteId, data);
      await loadNotes(); // Recargar la lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la nota');
      return false;
    }
  }, [user?.centerId, loadNotes]);

  const signNote = useCallback(async (
    noteId: string, 
    signatureData?: string
  ): Promise<boolean> => {
    if (!user?.centerId || !user?.id) return false;

    try {
      const userName = `${user.firstName} ${user.lastName}`;
      await notesService.signNote(user.centerId, noteId, user.id, userName, signatureData);
      await loadNotes(); // Recargar la lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al firmar la nota');
      return false;
    }
  }, [user?.centerId, user?.id, user?.firstName, user?.lastName, loadNotes]);

  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    if (!user?.centerId) return false;

    try {
      await notesService.delete(user.centerId, noteId);
      await loadNotes(); // Recargar la lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la nota');
      return false;
    }
  }, [user?.centerId, loadNotes]);

  const duplicateNote = useCallback(async (noteId: string): Promise<string | null> => {
    if (!user?.centerId) return null;

    try {
      const newNoteId = await notesService.duplicateNote(user.centerId, noteId);
      await loadNotes(); // Recargar la lista
      return newNoteId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al duplicar la nota');
      return null;
    }
  }, [user?.centerId, loadNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    signNote,
    deleteNote,
    duplicateNote,
    refreshNotes: loadNotes
  };
}

export function useNotesStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<NotesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!user?.centerId) return;

    try {
      setLoading(true);
      setError(null);
      
      const therapistId = user.role === 'therapist' ? user.id : undefined;
      const data = await notesService.getNotesStats(user.centerId, therapistId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.id, user?.role]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
}

export function useNote(noteId: string | null) {
  const { user } = useAuth();
  const [note, setNote] = useState<ClinicalNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNote = useCallback(async () => {
    if (!noteId || !user?.centerId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getById(user.centerId, noteId);
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la nota');
    } finally {
      setLoading(false);
    }
  }, [noteId, user?.centerId]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  return {
    note,
    loading,
    error,
    refreshNote: loadNote
  };
}
