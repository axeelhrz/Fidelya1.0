export type SessionStatus = 'pendiente' | 'confirmada' | 'en_curso' | 'finalizada' | 'cancelada';

export type EmotionalState = 
  | 'muy_positivo' 
  | 'positivo' 
  | 'neutral' 
  | 'ansioso' 
  | 'triste' 
  | 'irritado' 
  | 'confundido';

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  centerId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  status: SessionStatus;
  consultationReason: string;
  notes?: string;
  summary?: string;
  recommendation?: string;
  emotionalTonePre?: EmotionalState;
  emotionalTonePost?: EmotionalState;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionFilters {
  status?: SessionStatus;
  patientName?: string;
  timeRange?: 'morning' | 'afternoon' | 'evening';
}

export interface AIAnalysis {
  summary: string;
  recommendation: string;
  emotionalTone: EmotionalState;
  keyInsights: string[];
}

export interface CreateSessionData {
  patientId: string;
  date: string;
  time: string;
  duration: number;
  consultationReason: string;
  emotionalTonePre?: EmotionalState;
}

export interface UpdateSessionData {
  notes?: string;
  status?: SessionStatus;
  emotionalTonePost?: EmotionalState;
  attachments?: string[];
summary?: string;
  recommendation?: string;
  emotionalTonePost?: string;

}
