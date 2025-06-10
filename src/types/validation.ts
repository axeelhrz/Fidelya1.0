// Tipos para validaciones del formulario SCAT

export interface CauseValidation {
  // Validación básica
  selected: boolean;
  observation: string;
  attachments: string[];
  
  // Validaciones específicas para NAC (Necesidades de Acción de Control)
  P?: boolean | null; // Potencial
  E?: boolean | null; // Exposición
  C?: boolean | null; // Control
  
  // Metadatos
  completedAt?: Date;
  lastModified?: Date;
  userId?: string;
  
  // Validaciones adicionales para diferentes tipos de causas
  severity?: 'low' | 'medium' | 'high' | 'critical';
  priority?: number;
  
  // Estado de la validación
  status?: 'pending' | 'in-progress' | 'completed' | 'reviewed';
  
  // Comentarios de revisión
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  required: boolean;
  type: 'boolean' | 'text' | 'selection' | 'file' | 'rating';
  options?: string[];
  minLength?: number;
  maxLength?: number;
  fileTypes?: string[];
  maxFileSize?: number;
}

export interface SectionValidation {
  sectionId: 'ci' | 'cb' | 'nac';
  sectionName: string;
  totalCauses: number;
  completedCauses: number;
  percentage: number;
  isComplete: boolean;
  validations: Record<string, CauseValidation>;
  lastUpdated: Date;
}

export interface FormValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completionPercentage: number;
  sectionsStatus: {
    ci: SectionValidation;
    cb: SectionValidation;
    nac: SectionValidation;
  };
}

export interface ValidationError {
  id: string;
  causeId: string;
  sectionId: 'ci' | 'cb' | 'nac';
  type: 'required' | 'invalid' | 'incomplete';
  message: string;
  field?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  id: string;
  causeId: string;
  sectionId: 'ci' | 'cb' | 'nac';
  message: string;
  suggestion?: string;
  type: 'missing_observation' | 'no_attachments' | 'incomplete_nac' | 'low_priority';
}

export interface ValidationConfig {
  requireObservations: boolean;
  requireAttachments: boolean;
  minObservationLength: number;
  maxAttachments: number;
  allowedFileTypes: string[];
  maxFileSize: number; // en MB
  nacValidationRequired: boolean;
  autoSaveInterval: number; // en segundos
}

export interface AttachmentValidation {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isValid: boolean;
  errors: string[];
  uploadedAt: Date;
  uploadedBy: string;
}

// Tipos para validaciones específicas de NAC
export interface NACValidation {
  P: boolean | null; // Potencial de la acción
  E: boolean | null; // Exposición que controla
  C: boolean | null; // Control que proporciona
  effectiveness?: 'low' | 'medium' | 'high'; // Efectividad estimada
  implementationCost?: 'low' | 'medium' | 'high'; // Costo de implementación
  timeframe?: 'immediate' | 'short' | 'medium' | 'long'; // Plazo de implementación
  responsible?: string; // Responsable de la implementación
  dueDate?: Date; // Fecha límite
  dependencies?: string[]; // Dependencias con otras acciones
}

// Tipos para el historial de validaciones
export interface ValidationHistory {
  id: string;
  causeId: string;
  action: 'created' | 'updated' | 'completed' | 'reviewed' | 'rejected';
  previousValue?: Partial<CauseValidation>;
  newValue: Partial<CauseValidation>;
  timestamp: Date;
  userId: string;
  userName: string;
  comments?: string;
}

// Tipos para reportes de validación
export interface ValidationReport {
  projectId: string;
  projectName: string;
  generatedAt: Date;
  generatedBy: string;
  summary: {
    totalCauses: number;
    completedCauses: number;
    pendingCauses: number;
    completionPercentage: number;
  };
  sectionBreakdown: {
    ci: SectionValidationSummary;
    cb: SectionValidationSummary;
    nac: SectionValidationSummary;
  };
  issues: ValidationError[];
  recommendations: string[];
}

export interface SectionValidationSummary {
  sectionName: string;
  totalCauses: number;
  completedCauses: number;
  percentage: number;
  averageObservationLength: number;
  totalAttachments: number;
  mostCommonIssues: string[];
}

// Utilidades de validación
export interface ValidationUtils {
  validateCause: (cause: any, validation: CauseValidation, rules: ValidationRule[]) => ValidationError[];
  validateSection: (sectionId: 'ci' | 'cb' | 'nac', validations: Record<string, CauseValidation>) => SectionValidation;
  validateForm: (validations: Record<string, CauseValidation>) => FormValidationState;
  generateReport: (projectId: string, validations: Record<string, CauseValidation>) => ValidationReport;
}

// Constantes de validación
export const VALIDATION_CONSTANTS = {
  MIN_OBSERVATION_LENGTH: 10,
  MAX_OBSERVATION_LENGTH: 1000,
  MAX_ATTACHMENTS_PER_CAUSE: 5,
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  AUTO_SAVE_INTERVAL: 30, // segundos
  VALIDATION_DEBOUNCE: 500 // milisegundos
} as const;

// Tipos para configuración de validación por sección
export interface SectionValidationConfig {
  ci: {
    requireSelection: boolean;
    requireObservation: boolean;
    minObservationLength: number;
    allowAttachments: boolean;
    customRules?: ValidationRule[];
  };
  cb: {
    requireSelection: boolean;
    requireObservation: boolean;
    minObservationLength: number;
    allowAttachments: boolean;
    requireSubcauseSelection?: boolean;
    customRules?: ValidationRule[];
  };
  nac: {
    requireSelection: boolean;
    requireObservation: boolean;
    minObservationLength: number;
    allowAttachments: boolean;
    requirePECValidation: boolean;
    requireImplementationPlan?: boolean;
    customRules?: ValidationRule[];
  };
}

// Tipos para validación en tiempo real
export interface RealTimeValidation {
  isValidating: boolean;
  lastValidated: Date;
  validationErrors: ValidationError[];
  validationWarnings: ValidationWarning[];
  isDebouncing: boolean;
}

// Exportar todos los tipos
export type {
  CauseValidation,
  ValidationRule,
  SectionValidation,
  FormValidationState,
  ValidationError,
  ValidationWarning,
  ValidationConfig,
  AttachmentValidation,
  NACValidation,
  ValidationHistory,
  ValidationReport,
  SectionValidationSummary,
  ValidationUtils,
  SectionValidationConfig,
  RealTimeValidation
};
