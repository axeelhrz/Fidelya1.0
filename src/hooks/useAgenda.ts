'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AgendaService } from '@/lib/services/agendaService';
import { 
  Appointment, 
  BlockedTime, 
  CreateAppointmentData, 
  UpdateAppointmentData, 
  AgendaFilters,
  CalendarEvent,
  AgendaStats
} from '@/types/agenda';

export function useAgenda() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<AgendaStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const centerId = user?.centerId || '';
  const professionalId = user?.id || '';

  const handleError = useCallback((error: Error, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Error en ${operation}: ${error.message}`);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // FETCH DATA
  // ============================================================================

  const fetchAppointments = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!centerId || !professionalId) return;

    setLoading(true);
    clearError();

    try {
      const appointmentsData = await AgendaService.getAppointments(
        centerId, 
        professionalId, 
        startDate, 
        endDate
      );
      setAppointments(appointmentsData);
      return appointmentsData;
    } catch (error) {
      handleError(error as Error, 'cargar citas');
      return [];
    } finally {
      setLoading(false);
    }
  }, [centerId, professionalId, handleError, clearError]);

  const fetchBlockedTimes = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!centerId || !professionalId) return;

    try {
      const blockedTimesData = await AgendaService.getBlockedTimes(
        centerId, 
        professionalId, 
        startDate, 
        endDate
      );
      setBlockedTimes(blockedTimesData);
      return blockedTimesData;
    } catch (error) {
      handleError(error as Error, 'cargar bloqueos');
      return [];
    }
  }, [centerId, professionalId, handleError]);

  const fetchAgendaData = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!centerId || !professionalId) return;

    setLoading(true);
    clearError();

    try {
      const [appointmentsData, blockedTimesData] = await Promise.all([
        AgendaService.getAppointments(centerId, professionalId, startDate, endDate),
        AgendaService.getBlockedTimes(centerId, professionalId, startDate, endDate)
      ]);

      setAppointments(appointmentsData);
      setBlockedTimes(blockedTimesData);

      // Convert to calendar events
      const events = AgendaService.convertToCalendarEvents(appointmentsData, blockedTimesData);
      setCalendarEvents(events);

      // Calculate stats if date range provided
      if (startDate && endDate) {
        const statsData = await AgendaService.getAgendaStats(
          centerId, 
          professionalId, 
          startDate, 
          endDate
        );
        setStats(statsData);
      }

    } catch (error) {
      handleError(error as Error, 'cargar agenda');
    } finally {
      setLoading(false);
    }
  }, [centerId, professionalId, handleError, clearError]);

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const createAppointment = useCallback(async (appointmentData: CreateAppointmentData): Promise<boolean> => {
    if (!centerId || !professionalId) return false;

    setLoading(true);
    clearError();

    try {
      await AgendaService.createAppointment(centerId, professionalId, appointmentData);
      await fetchAgendaData(); // Refresh data
      return true;
    } catch (error) {
      handleError(error as Error, 'crear cita');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, professionalId, fetchAgendaData, handleError, clearError]);

  const updateAppointment = useCallback(async (
    appointmentId: string, 
    updateData: UpdateAppointmentData
  ): Promise<boolean> => {
    if (!centerId) return false;

    setLoading(true);
    clearError();

    try {
      await AgendaService.updateAppointment(centerId, appointmentId, updateData);
      await fetchAgendaData(); // Refresh data
      return true;
    } catch (error) {
      handleError(error as Error, 'actualizar cita');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, fetchAgendaData, handleError, clearError]);

  const deleteAppointment = useCallback(async (appointmentId: string): Promise<boolean> => {
    if (!centerId) return false;

    setLoading(true);
    clearError();

    try {
      await AgendaService.deleteAppointment(centerId, appointmentId);
      await fetchAgendaData(); // Refresh data
      return true;
    } catch (error) {
      handleError(error as Error, 'eliminar cita');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, fetchAgendaData, handleError, clearError]);

  const createBlockedTime = useCallback(async (
    blockedTimeData: Omit<BlockedTime, 'id' | 'professionalId' | 'centerId' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    if (!centerId || !professionalId) return false;

    setLoading(true);
    clearError();

    try {
      await AgendaService.createBlockedTime(centerId, professionalId, blockedTimeData);
      await fetchAgendaData(); // Refresh data
      return true;
    } catch (error) {
      handleError(error as Error, 'crear bloqueo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [centerId, professionalId, fetchAgendaData, handleError, clearError]);

  // ============================================================================
  // UTILITIES
  // ============================================================================

  const checkTimeConflict = useCallback(async (
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
  ): Promise<boolean> => {
    if (!centerId || !professionalId) return false;

    try {
      return await AgendaService.checkTimeConflict(
        centerId,
        professionalId,
        startTime,
        endTime,
        excludeAppointmentId
      );
    } catch (error) {
      console.error('Error checking time conflict:', error);
      return false;
    }
  }, [centerId, professionalId]);

  const filterAppointments = useCallback((filters: AgendaFilters): Appointment[] => {
    return AgendaService.filterAppointments(appointments, filters);
  }, [appointments]);

  const exportToCSV = useCallback((): string => {
    return AgendaService.exportToCSV(appointments);
  }, [appointments]);

  const exportToICS = useCallback((): string => {
    return AgendaService.generateICSFile(appointments);
  }, [appointments]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (centerId && professionalId) {
      fetchAgendaData();
    }
  }, [centerId, professionalId, fetchAgendaData]);

  return {
    // Data
    appointments,
    blockedTimes,
    calendarEvents,
    stats,
    
    // State
    loading,
    error,
    clearError,
    
    // Actions
    fetchAgendaData,
    fetchAppointments,
    fetchBlockedTimes,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    createBlockedTime,
    
    // Utilities
    checkTimeConflict,
    filterAppointments,
    exportToCSV,
    exportToICS
  };
}
