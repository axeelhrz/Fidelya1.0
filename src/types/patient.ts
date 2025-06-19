import { Timestamp } from 'firebase/firestore';

export type Gender = 'M' | 'F' | 'Otro';

export type EmotionalState = 
  | 'Estable' 
  | 'Ansioso/a' 
  | 'Deprimido/a' 
  | 'Irritable' 
  | 'Eufórico/a' 
  | 'Confundido/a' 
  | 'Agresivo/a' 
  | 'Retraído/a';

export interface Patient {
  id: string;
  centerId: string;
  fullName: string;
  birthDate: string; // YYYY-MM-DD format
  age?: number; // Calculated automatically
  gender: Gender;
  emotionalState: EmotionalState;
  motivoConsulta: string;
  observaciones?: string;
  assignedPsychologist: string; // UID del psicólogo
  nextSession?: string; // ISO date string
  customFields?: Record<string, string | number | boolean | Date>; // Campos personalizados del centro
  status: 'active' | 'inactive' | 'discharged';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string; // UID del profesional que lo registró
  email?: string; // Email del paciente
}

export interface PatientFormData {
  fullName: string;
  birthDate: string;
  gender: Gender;
  emotionalState: EmotionalState;
  motivoConsulta: string;
  observaciones?: string;
  assignedPsychologist: string;
  nextSession?: string;
  customFields?: Record<string, string | number | boolean | Date>;
}

export interface PatientFilters {
  search?: string;
  gender?: Gender | '';
  emotionalState?: EmotionalState | '';
  assignedPsychologist?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  status?: 'active' | 'inactive' | 'discharged' | '';
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  discharged: number;
  byGender: Record<Gender, number>;
  byEmotionalState: Record<EmotionalState, number>;
  averageAge: number;
}

// Utilidades para estados emocionales
export const EMOTIONAL_STATES: EmotionalState[] = [
  'Estable',
  'Ansioso/a',
  'Deprimido/a',
  'Irritable',
  'Eufórico/a',
  'Confundido/a',
  'Agresivo/a',
  'Retraído/a'
];

export const EMOTIONAL_STATE_COLORS: Record<EmotionalState, string> = {
  'Estable': '#4caf50',
  'Ansioso/a': '#ff9800',
  'Deprimido/a': '#2196f3',
  'Irritable': '#f44336',
  'Eufórico/a': '#9c27b0',
  'Confundido/a': '#607d8b',
  'Agresivo/a': '#d32f2f',
  'Retraído/a': '#795548'
};

export const GENDERS: Gender[] = ['M', 'F', 'Otro'];

export const GENDER_LABELS: Record<Gender, string> = {
  'M': 'Masculino',
  'F': 'Femenino',
  'Otro': 'Otro'
};