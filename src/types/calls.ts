export interface Call {
  id: string;
  patientId?: string;
  patientName?: string;
  contactId?: string;
  contactName?: string;
  professionalId: string;
  professionalName: string;
  centerId: string;
  date: Date;
  startTime: string;
  duration: number; // en minutos
  type: CallType;
  status: CallStatus;
  motive: string;
  notes?: string;
  recordingUrl?: string;
  hasRecording: boolean;
  consentGiven: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type CallType = 'entrante' | 'saliente';

export type CallStatus = 
  | 'realizada'
  | 'no_contestada'
  | 'cancelada'
  | 'perdida';

export interface CallFilters {
  searchTerm?: string;
  patientName?: string;
  contactName?: string;
  motive?: string;
  type?: CallType;
  status?: CallStatus;
  dateFrom?: Date;
  dateTo?: Date;
  professionalId?: string;
  hasRecording?: boolean;
}

export interface CreateCallData {
  patientId?: string;
  contactId?: string;
  contactName?: string;
  date: Date;
  startTime: string;
  duration: number;
  type: CallType;
  status: CallStatus;
  motive: string;
  notes?: string;
  hasRecording?: boolean;
  consentGiven?: boolean;
}

export interface UpdateCallData extends Partial<CreateCallData> {
  recordingUrl?: string;
}

export interface CallStats {
  total: number;
  realizadas: number;
  noContestadas: number;
  canceladas: number;
  perdidas: number;
  totalDuration: number;
  averageDuration: number;
  thisWeek: number;
  thisMonth: number;
}

export interface CallExportData {
  format: 'csv' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: CallFilters;
  includeNotes: boolean;
  includeRecordings: boolean;
}

export interface CallContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  type: 'patient' | 'colleague' | 'external';
  relationship?: string;
}

export interface CallTemplate {
  id: string;
  name: string;
  motive: string;
  defaultDuration: number;
  defaultNotes?: string;
  category: 'seguimiento' | 'emergencia' | 'consulta' | 'coordinacion' | 'otro';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallReminder {
  id: string;
  callId: string;
  reminderDate: Date;
  message: string;
  sent: boolean;
  sentAt?: Date;
  method: 'email' | 'sms' | 'notification';
}

export interface CallAuditLog {
  id: string;
  callId: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'recording_added';
  userId: string;
  userName: string;
  timestamp: Date;
  changes: Record<string, { from: unknown; to: unknown }>;
  ipAddress?: string;
}
