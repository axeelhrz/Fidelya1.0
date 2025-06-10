// Tipos para el formulario SCAT interactivo
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

export interface CauseValidation {
  selected: boolean;
  observation: string;
  attachments: string[];
  P?: boolean | null; // Solo para NAC
  E?: boolean | null; // Solo para NAC
  C?: boolean | null; // Solo para NAC
  completedAt?: Date;
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
