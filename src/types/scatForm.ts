// Tipos para el formulario SCAT interactivo
import { CauseValidation } from './validation';

export interface SCATCause {
  id: string;
  number: string;
  title: string;
  description?: string;
  nacReferences?: string;
  subcauses?: SCATSubcause[];
}

export interface SCATSubcause {
  id: string;
  number: string;
  text: string;
}

export interface SCATSection {
  id: 'ci' | 'cb' | 'nac';
  name: string;
  title: string;
  description: string;
  causes: SCATCause[];
  totalCauses: number;
}

export interface FormProgress {
  currentSection: 'ci' | 'cb' | 'nac';
  currentCause: number;
  sectionProgress: {
    ci: { completed: number; total: number; percentage: number };
    cb: { completed: number; total: number; percentage: number };
    nac: { completed: number; total: number; percentage: number };
  };
  validations: Record<string, CauseValidation>;
  isComplete: boolean;
}

export interface FormStep {
  id: string;
  section: 'ci' | 'cb' | 'nac';
  title: string;
  status: 'pending' | 'active' | 'completed' | 'locked';
  progress: number;
}

// Re-exportar CauseValidation para compatibilidad
export type { CauseValidation };