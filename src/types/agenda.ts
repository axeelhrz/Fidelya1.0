export type AppointmentStatus = 'reservada' | 'confirmada' | 'check-in' | 'no-show' | 'cancelada';

export type AppointmentType = 'individual' | 'grupal' | 'familiar' | 'pareja' | 'evaluacion';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  centerId: string;
  startDateTime: Date;
  endDateTime: Date;
  duration: number; // minutes
  status: AppointmentStatus;
  type: AppointmentType;
  motive: string;
  notes?: string;
  consultorio?: string;
  recurrenceRule?: RecurrenceRule;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number; // every X days/weeks/months
  endDate?: Date;
  count?: number; // number of occurrences
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
}

export interface BlockedTime {
  id: string;
  professionalId: string;
  centerId: string;
  startDateTime: Date;
  endDateTime: Date;
  type: 'almuerzo' | 'vacaciones' | 'ausencia' | 'bloqueo';
  title: string;
  description?: string;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    type: 'appointment' | 'blocked';
    status?: AppointmentStatus;
    patientName?: string;
    motive?: string;
    consultorio?: string;
    appointment?: Appointment;
    blockedTime?: BlockedTime;
  };
}

export interface AgendaFilters {
  status?: AppointmentStatus[];
  consultorio?: string;
  patientName?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CreateAppointmentData {
  patientId: string;
  startDateTime: Date;
  duration: number;
  type: AppointmentType;
  motive: string;
  notes?: string;
  consultorio?: string;
  recurrenceRule?: RecurrenceRule;
}

export interface UpdateAppointmentData {
  startDateTime?: Date;
  duration?: number;
  status?: AppointmentStatus;
  type?: AppointmentType;
  motive?: string;
  notes?: string;
  consultorio?: string;
}

export interface AgendaStats {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  occupancyRate: number;
  averageDuration: number;
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
  available: boolean;
  appointment?: Appointment;
}

export interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
  blockedTimes: BlockedTime[];
  workingHours: {
    start: string;
    end: string;
  };
}

export interface CalendarView {
  type: 'day' | 'week' | 'month';
  date: Date;
}

export interface ReminderSettings {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  hoursBeforeAppointment: number;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'ics';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeNotes: boolean;
  includePatientInfo: boolean;
}
