'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CallService } from '@/lib/services/callService';
import { 
  Call, 
  CreateCallData, 
  UpdateCallData, 
  CallFilters, 
  CallStats,
  CallContact,
  CallTemplate,
  CallExportData
} from '@/types/calls';

export function useCalls() {
  const { user } = useAuth();
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState<CallStats | null>(null);
  const [contacts, setContacts] = useState<CallContact[]>([]);
  const [templates, setTemplates] = useState<CallTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const centerId = user?.centerId || '';
  const professionalId = user?.id || '';
  const professionalName = user?.name || '';

  const handleError = useCallback((error: Error, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Error en ${operation}: ${error.message}`);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // GESTIÓN DE LLAMADAS
  // ============================================================================

  const fetchCalls = useCallback(async (filters?: CallFilters) => {
    if (!centerId || !professionalId) return;

    setLoading(true);
    clearError();

    try {
      const { calls: fetchedCalls } = await CallService.getCalls(
        centerId, 
        professionalId, 
        filters
      );
      setCalls(fetchedCalls);
    } catch (error) {
      handleError(error as Error, 'cargar llamadas');
    } finally {
      setLoading(false);
    }
  }, [centerId, professionalId, handleError, clearError]);

  const createCall = useCallback(async (data: CreateCallData): Promise<boolean> => {
    if (!centerId || !professionalId) return false;

    setLoading(true);
    clearError();

    try {
      await CallService.createCall(centerId, professionalId, professionalName, data);
      await fetchCalls(); // Refresh calls
      return true;
    } catch (error) {
      handleError(error as Error, 'crear llamada');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, professionalId, professionalName, fetchCalls, handleError, clearError]);

  const updateCall = useCallback(async (callId: string, data: UpdateCallData): Promise<boolean> => {
    if (!centerId) return false;

    setLoading(true);
    clearError();

    try {
      await CallService.updateCall(centerId, callId, data);
      await fetchCalls(); // Refresh calls
      return true;
    } catch (error) {
      handleError(error as Error, 'actualizar llamada');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, fetchCalls, handleError, clearError]);

  const deleteCall = useCallback(async (callId: string): Promise<boolean> => {
    if (!centerId) return false;

    try {
      await CallService.deleteCall(centerId, callId);
      await fetchCalls(); // Refresh calls
      return true;
    } catch (error) {
      handleError(error as Error, 'eliminar llamada');
      return false;
    }
  }, [centerId, fetchCalls, handleError]);

  const getCall = useCallback(async (callId: string): Promise<Call | null> => {
    if (!centerId) return null;

    try {
      return await CallService.getCall(centerId, callId);
    } catch (error) {
      handleError(error as Error, 'obtener llamada');
      return null;
    }
  }, [centerId, handleError]);

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  const fetchStats = useCallback(async (dateRange?: { start: Date; end: Date }) => {
    if (!centerId || !professionalId) return;

    try {
      const statsData = await CallService.getCallStats(centerId, professionalId, dateRange);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching call stats:', error);
    }
  }, [centerId, professionalId]);

  // ============================================================================
  // CONTACTOS
  // ============================================================================

  const fetchContacts = useCallback(async () => {
    if (!centerId) return;

    try {
      const contactsData = await CallService.getContacts(centerId);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }, [centerId]);

  const createContact = useCallback(async (contactData: Omit<CallContact, 'id'>): Promise<boolean> => {
    if (!centerId) return false;

    try {
      await CallService.createContact(centerId, contactData);
      await fetchContacts(); // Refresh contacts
      return true;
    } catch (error) {
      handleError(error as Error, 'crear contacto');
      return false;
    }
  }, [centerId, fetchContacts, handleError]);

  // ============================================================================
  // PLANTILLAS
  // ============================================================================

  const fetchTemplates = useCallback(async () => {
    if (!centerId) return;

    try {
      const templatesData = await CallService.getCallTemplates(centerId);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching call templates:', error);
    }
  }, [centerId]);

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  const searchCalls = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      return calls;
    }

    const term = searchTerm.toLowerCase();
    return calls.filter(call => 
      call.patientName?.toLowerCase().includes(term) ||
      call.contactName?.toLowerCase().includes(term) ||
      call.motive.toLowerCase().includes(term) ||
      call.notes?.toLowerCase().includes(term)
    );
  }, [calls]);

  const filterCalls = useCallback((filters: CallFilters) => {
    let filteredCalls = calls;

    if (filters.type) {
      filteredCalls = filteredCalls.filter(call => call.type === filters.type);
    }

    if (filters.status) {
      filteredCalls = filteredCalls.filter(call => call.status === filters.status);
    }

    if (filters.dateFrom) {
      filteredCalls = filteredCalls.filter(call => call.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filteredCalls = filteredCalls.filter(call => call.date <= filters.dateTo!);
    }

    if (filters.hasRecording !== undefined) {
      filteredCalls = filteredCalls.filter(call => call.hasRecording === filters.hasRecording);
    }

    return filteredCalls;
  }, [calls]);

  const exportCalls = useCallback(async (exportData: CallExportData): Promise<string | null> => {
    if (!centerId || !professionalId) return null;

    try {
      return await CallService.exportCalls(centerId, professionalId, exportData);
    } catch (error) {
      handleError(error as Error, 'exportar llamadas');
      return null;
    }
  }, [centerId, professionalId, handleError]);

  const getCallsByStatus = useCallback((status: string) => {
    return calls.filter(call => call.status === status);
  }, [calls]);

  const getCallsByType = useCallback((type: string) => {
    return calls.filter(call => call.type === type);
  }, [calls]);

  const getTodaysCalls = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return calls.filter(call => call.date >= today && call.date < tomorrow);
  }, [calls]);

  const getThisWeekCalls = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return calls.filter(call => call.date >= weekAgo);
  }, [calls]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (centerId && professionalId) {
      fetchCalls();
      fetchStats();
      fetchContacts();
      fetchTemplates();
    }
  }, [centerId, professionalId, fetchCalls, fetchStats, fetchContacts, fetchTemplates]);

  return {
    // Data
    calls,
    stats,
    contacts,
    templates,
    
    // State
    loading,
    error,
    clearError,
    
    // Call actions
    fetchCalls,
    createCall,
    updateCall,
    deleteCall,
    getCall,
    
    // Stats
    fetchStats,
    
    // Contacts
    fetchContacts,
    createContact,
    
    // Templates
    fetchTemplates,
    
    // Utilities
    searchCalls,
    filterCalls,
    exportCalls,
    getCallsByStatus,
    getCallsByType,
    getTodaysCalls,
    getThisWeekCalls
  };
}
