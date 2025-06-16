import { Timestamp } from 'firebase/firestore';

export type SessionType = 'individual' | 'group' | 'family' | 'online';
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';

export type EmotionalTone = 
  | 'Estable' 
  | 'Ansioso/a' 
  | 'Deprimido/a' 
  | 'Irritable' 
  | 'Eufórico/a' 
  | 'Confundido/a' 
  | 'Agresivo/a' 
  | 'Retraído/a'
  | 'Esperanzado/a'
  | 'Frustrado/a';

export interface AIAnalysis {
  summary: string;
  recommendation: string;
  emotionalTone: EmotionalTone;
  keyInsights: string[];
  riskLevel: 'low' | 'medium' | 'high';
  suggestedInterventions: string[];
  generatedAt: Date;
  processedBy: 'gpt-4' | 'gpt-3.5-turbo';
  confidence: number; // 0-1
}

export interface Session {
  id: string;
  centerId: string;
  patientId: string;
  professionalId: string; // Cambiado de psychologistId para ser más genérico
  date: string; // ISO date string para mejor compatibilidad
  duration?: number; // en minutos, opcional
  type: SessionType;
  status: SessionStatus;
  
  // Notas clínicas del profesional
  notes: string;
  observations?: string;
  interventions?: string;
  homework?: string;
  nextSessionPlan?: string;
  
  // Análisis de IA
  aiAnalysis?: AIAnalysis;
  aiProcessingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Archivos adjuntos
  attachments?: string[];
  
  // Metadatos
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  lastModifiedBy?: string;
}

export interface SessionFormData {
  patientId: string;
  date: string;
  duration?: number;
  type: SessionType;
  status: SessionStatus;
  notes: string;
  observations?: string;
  interventions?: string;
  homework?: string;
  nextSessionPlan?: string;
}

export interface SessionFilters {
  search?: string;
  patientId?: string;
  professionalId?: string;
  status?: SessionStatus | '';
  type?: SessionType | '';
  emotionalTone?: EmotionalTone | '';
  dateRange?: {
    start?: string;
    end?: string;
  };
  hasAIAnalysis?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | '';
}

export interface SessionStats {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  byType: Record<SessionType, number>;
  byEmotionalTone: Record<EmotionalTone, number>;
  averageDuration: number;
  withAIAnalysis: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

// Constantes para estados emocionales
export const EMOTIONAL_TONES: EmotionalTone[] = [
  'Estable',
  'Ansioso/a',
  'Deprimido/a',
  'Irritable',
  'Eufórico/a',
  'Confundido/a',
  'Agresivo/a',
  'Retraído/a',
  'Esperanzado/a',
  'Frustrado/a'
];

export const EMOTIONAL_TONE_COLORS: Record<EmotionalTone, string> = {
  'Estable': '#4caf50',
  'Ansioso/a': '#ff9800',
  'Deprimido/a': '#2196f3',
  'Irritable': '#f44336',
  'Eufórico/a': '#9c27b0',
  'Confundido/a': '#607d8b',
  'Agresivo/a': '#d32f2f',
  'Retraído/a': '#795548',
  'Esperanzado/a': '#8bc34a',
  'Frustrado/a': '#ff5722'
};

export const SESSION_TYPES: SessionType[] = ['individual', 'group', 'family', 'online'];
export const SESSION_STATUSES: SessionStatus[] = ['scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled'];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  'individual': 'Individual',
  'group': 'Grupal',
  'family': 'Familiar',
  'online': 'Online'
};

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  'scheduled': 'Programada',
  'completed': 'Completada',
  'cancelled': 'Cancelada',
  'no-show': 'No asistió',
  'rescheduled': 'Reprogramada'
};

export const RISK_LEVEL_COLORS = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336'
};

export const RISK_LEVEL_LABELS = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto'
};