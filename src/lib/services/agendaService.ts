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
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Appointment, 
  BlockedTime, 
  CreateAppointmentData, 
  UpdateAppointmentData, 
  AgendaFilters,
  CalendarEvent,
  AgendaStats,
  RecurrenceRule
} from '../../types/agenda';

export class AgendaService {
  private static getAppointmentsCollection(centerId: string) {
    return collection(db, 'centers', centerId, 'appointments');
  }

  private static getBlockedTimesCollection(centerId: string) {
    return collection(db, 'centers', centerId, 'blockedTimes');
  }

  // ============================================================================
  // GESTIÓN DE CITAS
  // ============================================================================

  static async getAppointments(
    centerId: string, 
    professionalId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<Appointment[]> {
    try {
      const appointmentsRef = this.getAppointmentsCollection(centerId);
      let q = query(
        appointmentsRef,
        where('professionalId', '==', professionalId),
        orderBy('startDateTime', 'asc')
      );

      if (startDate && endDate) {
        q = query(
          appointmentsRef,
          where('professionalId', '==', professionalId),
          where('startDateTime', '>=', Timestamp.fromDate(startDate)),
          where('startDateTime', '<=', Timestamp.fromDate(endDate)),
          orderBy('startDateTime', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDateTime: doc.data().startDateTime.toDate(),
        endDateTime: doc.data().endDateTime.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Appointment[];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  static async createAppointment(
    centerId: string, 
    professionalId: string, 
    appointmentData: CreateAppointmentData
  ): Promise<string> {
    try {
      const appointmentsRef = this.getAppointmentsCollection(centerId);
      const now = new Date();
      
      const endDateTime = new Date(appointmentData.startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + appointmentData.duration);

      // Check for conflicts
      const hasConflict = await this.checkTimeConflict(
        centerId,
        professionalId,
        appointmentData.startDateTime,
        endDateTime
      );

      if (hasConflict) {
        throw new Error('Conflicto de horario detectado');
      }

      const newAppointment = {
        ...appointmentData,
        professionalId,
        centerId,
        endDateTime,
        status: 'reservada' as const,
        startDateTime: Timestamp.fromDate(appointmentData.startDateTime),
        endDateTime: Timestamp.fromDate(endDateTime),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const docRef = await addDoc(appointmentsRef, newAppointment);

      // Handle recurrence if specified
      if (appointmentData.recurrenceRule && appointmentData.recurrenceRule.type !== 'none') {
        await this.createRecurringAppointments(centerId, professionalId, appointmentData, docRef.id);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async updateAppointment(
    centerId: string, 
    appointmentId: string, 
    updateData: UpdateAppointmentData
  ): Promise<void> {
    try {
      const appointmentRef = doc(db, 'centers', centerId, 'appointments', appointmentId);
      
      const updatePayload: any = {
        ...updateData,
        updatedAt: Timestamp.fromDate(new Date())
      };

      if (updateData.startDateTime) {
        updatePayload.startDateTime = Timestamp.fromDate(updateData.startDateTime);
        
        if (updateData.duration) {
          const endDateTime = new Date(updateData.startDateTime);
          endDateTime.setMinutes(endDateTime.getMinutes() + updateData.duration);
          updatePayload.endDateTime = Timestamp.fromDate(endDateTime);
        }
      }

      await updateDoc(appointmentRef, updatePayload);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  static async deleteAppointment(centerId: string, appointmentId: string): Promise<void> {
    try {
      const appointmentRef = doc(db, 'centers', centerId, 'appointments', appointmentId);
      await deleteDoc(appointmentRef);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  static async checkTimeConflict(
    centerId: string,
    professionalId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    try {
      const appointmentsRef = this.getAppointmentsCollection(centerId);
      const q = query(
        appointmentsRef,
        where('professionalId', '==', professionalId),
        where('startDateTime', '<', Timestamp.fromDate(endTime)),
        where('endDateTime', '>', Timestamp.fromDate(startTime))
      );

      const snapshot = await getDocs(q);
      const conflicts = snapshot.docs.filter(doc => 
        excludeAppointmentId ? doc.id !== excludeAppointmentId : true
      );

      return conflicts.length > 0;
    } catch (error) {
      console.error('Error checking time conflict:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTIÓN DE BLOQUEOS
  // ============================================================================

  static async getBlockedTimes(
    centerId: string, 
    professionalId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<BlockedTime[]> {
    try {
      const blockedTimesRef = this.getBlockedTimesCollection(centerId);
      let q = query(
        blockedTimesRef,
        where('professionalId', '==', professionalId),
        orderBy('startDateTime', 'asc')
      );

      if (startDate && endDate) {
        q = query(
          blockedTimesRef,
          where('professionalId', '==', professionalId),
          where('startDateTime', '>=', Timestamp.fromDate(startDate)),
          where('startDateTime', '<=', Timestamp.fromDate(endDate)),
          orderBy('startDateTime', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDateTime: doc.data().startDateTime.toDate(),
        endDateTime: doc.data().endDateTime.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as BlockedTime[];
    } catch (error) {
      console.error('Error fetching blocked times:', error);
      throw error;
    }
  }

  static async createBlockedTime(
    centerId: string,
    professionalId: string,
    blockedTimeData: Omit<BlockedTime, 'id' | 'professionalId' | 'centerId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const blockedTimesRef = this.getBlockedTimesCollection(centerId);
      const now = new Date();

      const newBlockedTime = {
        ...blockedTimeData,
        professionalId,
        centerId,
        startDateTime: Timestamp.fromDate(blockedTimeData.startDateTime),
        endDateTime: Timestamp.fromDate(blockedTimeData.endDateTime),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const docRef = await addDoc(blockedTimesRef, newBlockedTime);
      return docRef.id;
    } catch (error) {
      console.error('Error creating blocked time:', error);
      throw error;
    }
  }

  // ============================================================================
  // UTILIDADES Y ESTADÍSTICAS
  // ============================================================================

  static async getAgendaStats(
    centerId: string,
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AgendaStats> {
    try {
      const appointments = await this.getAppointments(centerId, professionalId, startDate, endDate);
      
      const totalAppointments = appointments.length;
      const confirmedAppointments = appointments.filter(a => a.status === 'confirmada').length;
      const pendingAppointments = appointments.filter(a => a.status === 'reservada').length;
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelada').length;
      const noShowAppointments = appointments.filter(a => a.status === 'no-show').length;
      
      const totalDuration = appointments.reduce((sum, a) => sum + a.duration, 0);
      const averageDuration = totalAppointments > 0 ? totalDuration / totalAppointments : 0;
      
      // Calculate occupancy rate (simplified)
      const workingHours = 8; // 8 hours per day
      const workingDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalAvailableMinutes = workingHours * 60 * workingDays;
      const occupiedMinutes = appointments
        .filter(a => a.status !== 'cancelada' && a.status !== 'no-show')
        .reduce((sum, a) => sum + a.duration, 0);
      
      const occupancyRate = totalAvailableMinutes > 0 ? (occupiedMinutes / totalAvailableMinutes) * 100 : 0;

      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        noShowAppointments,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
        averageDuration: Math.round(averageDuration)
      };
    } catch (error) {
      console.error('Error calculating agenda stats:', error);
      throw error;
    }
  }

  static convertToCalendarEvents(
    appointments: Appointment[], 
    blockedTimes: BlockedTime[]
  ): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    // Convert appointments to calendar events
    appointments.forEach(appointment => {
      events.push({
        id: `appointment-${appointment.id}`,
        title: appointment.patientName,
        start: appointment.startDateTime,
        end: appointment.endDateTime,
        backgroundColor: this.getStatusColor(appointment.status),
        borderColor: this.getStatusColor(appointment.status),
        textColor: '#FFFFFF',
        extendedProps: {
          type: 'appointment',
          status: appointment.status,
          patientName: appointment.patientName,
          motive: appointment.motive,
          consultorio: appointment.consultorio,
          appointment
        }
      });
    });

    // Convert blocked times to calendar events
    blockedTimes.forEach(blockedTime => {
      events.push({
        id: `blocked-${blockedTime.id}`,
        title: blockedTime.title,
        start: blockedTime.startDateTime,
        end: blockedTime.endDateTime,
        backgroundColor: this.getBlockedTimeColor(blockedTime.type),
        borderColor: this.getBlockedTimeColor(blockedTime.type),
        textColor: '#FFFFFF',
        extendedProps: {
          type: 'blocked',
          blockedTime
        }
      });
    });

    return events;
  }

  private static getStatusColor(status: string): string {
    switch (status) {
      case 'reservada': return '#3B82F6'; // Blue
      case 'confirmada': return '#10B981'; // Green
      case 'check-in': return '#F59E0B'; // Orange
      case 'no-show': return '#EF4444'; // Red
      case 'cancelada': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  }

  private static getBlockedTimeColor(type: string): string {
    switch (type) {
      case 'almuerzo': return '#8B5CF6'; // Purple
      case 'vacaciones': return '#EC4899'; // Pink
      case 'ausencia': return '#F59E0B'; // Orange
      case 'bloqueo': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  }

  private static async createRecurringAppointments(
    centerId: string,
    professionalId: string,
    appointmentData: CreateAppointmentData,
    originalId: string
  ): Promise<void> {
    if (!appointmentData.recurrenceRule) return;

    const { recurrenceRule } = appointmentData;
    const batch = writeBatch(db);
    const appointmentsRef = this.getAppointmentsCollection(centerId);

    let currentDate = new Date(appointmentData.startDateTime);
    let count = 0;
    const maxOccurrences = recurrenceRule.count || 52; // Default to 1 year

    while (count < maxOccurrences) {
      // Calculate next occurrence
      switch (recurrenceRule.type) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + recurrenceRule.interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * recurrenceRule.interval));
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + (14 * recurrenceRule.interval));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + recurrenceRule.interval);
          break;
      }

      // Check if we've exceeded the end date
      if (recurrenceRule.endDate && currentDate > recurrenceRule.endDate) {
        break;
      }

      const endDateTime = new Date(currentDate);
      endDateTime.setMinutes(endDateTime.getMinutes() + appointmentData.duration);

      const newAppointmentRef = doc(appointmentsRef);
      const now = new Date();

      batch.set(newAppointmentRef, {
        ...appointmentData,
        professionalId,
        centerId,
        startDateTime: Timestamp.fromDate(new Date(currentDate)),
        endDateTime: Timestamp.fromDate(endDateTime),
        status: 'reservada',
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        parentAppointmentId: originalId
      });

      count++;
    }

    await batch.commit();
  }

  // ============================================================================
  // FILTROS Y BÚSQUEDA
  // ============================================================================

  static filterAppointments(appointments: Appointment[], filters: AgendaFilters): Appointment[] {
    return appointments.filter(appointment => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(appointment.status)) return false;
      }

      if (filters.consultorio && appointment.consultorio !== filters.consultorio) {
        return false;
      }

      if (filters.patientName) {
        const searchTerm = filters.patientName.toLowerCase();
        if (!appointment.patientName.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      if (filters.dateFrom && appointment.startDateTime < filters.dateFrom) {
        return false;
      }

      if (filters.dateTo && appointment.startDateTime > filters.dateTo) {
        return false;
      }

      return true;
    });
  }

  // ============================================================================
  // EXPORTACIÓN
  // ============================================================================

  static exportToCSV(appointments: Appointment[]): string {
    const headers = [
      'Fecha',
      'Hora Inicio',
      'Hora Fin',
      'Paciente',
      'Tipo',
      'Estado',
      'Motivo',
      'Consultorio',
      'Notas'
    ];

    const rows = appointments.map(appointment => [
      appointment.startDateTime.toLocaleDateString('es-ES'),
      appointment.startDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      appointment.endDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      appointment.patientName,
      appointment.type,
      appointment.status,
      appointment.motive,
      appointment.consultorio || '',
      appointment.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static generateICSFile(appointments: Appointment[]): string {
    const icsEvents = appointments.map(appointment => {
      const startDate = appointment.startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = appointment.endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      return [
        'BEGIN:VEVENT',
        `UID:${appointment.id}@centropsicologico.com`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${appointment.patientName} - ${appointment.type}`,
        `DESCRIPTION:${appointment.motive}${appointment.notes ? '\\n' + appointment.notes : ''}`,
        `STATUS:${appointment.status.toUpperCase()}`,
        'END:VEVENT'
      ].join('\n');
    });

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Centro Psicológico//Agenda//ES',
      ...icsEvents,
      'END:VCALENDAR'
    ].join('\n');
  }
}
