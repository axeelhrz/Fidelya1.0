export interface ClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  sessionId?: string;
  therapistId: string;
  therapistName: string;
  centerId: string;
  date: Date;
  templateType: NoteTemplateType;
  content: NoteContent;
  diagnosis?: {
    primary?: DiagnosisCode;
    secondary?: DiagnosisCode[];
    suggested?: DiagnosisCode[];
  };
  status: NoteStatus;
  signed: boolean;
  signedAt?: Date;
  signedBy?: string;
  signature?: ElectronicSignature;
  locked: boolean;
  lockedAt?: Date;
  lockedBy?: string;
  version: number;
  previousVersionId?: string;
  aiValidation?: AIValidationResult;
  attachments: NoteAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export type NoteTemplateType = 'soap' | 'dap' | 'free';

export type NoteStatus = 'draft' | 'pending' | 'signed' | 'locked';

export interface NoteContent {
  // SOAP Template
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  
  // DAP Template
  data?: string;
  
  // Free Template
  freeText?: string;
  
  // Common fields
  riskAssessment?: RiskAssessment;
  nextSessionPlan?: string;
  homework?: string[];
  interventions?: string[];
}

export interface DiagnosisCode {
  code: string;
  description: string;
  system: 'ICD-11' | 'DSM-5-TR';
  confidence?: number;
}

export interface ElectronicSignature {
  id: string;
  therapistId: string;
  therapistName: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  signatureData?: string; // Base64 encoded signature image
  isValid: boolean;
  method: 'digital' | 'typed' | 'drawn';
}

export interface AIValidationResult {
  id: string;
  noteId: string;
  timestamp: Date;
  coherenceScore: number; // 0-100
  suggestions: AISuggestion[];
  flaggedIssues: AIFlag[];
  confidence: number;
  riskFlags: string[];
  suggestedDiagnoses: DiagnosisCode[];
  isValid: boolean;
}

export interface AISuggestion {
  type: 'diagnosis' | 'intervention' | 'risk-assessment' | 'grammar' | 'clarity' | 'consistency';
  field?: string;
  suggestion: string;
  confidence: number;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AIFlag {
  type: 'inconsistency' | 'missing-info' | 'risk-indicator' | 'compliance-issue' | 'quality-concern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  field?: string;
}

export interface RiskAssessment {
  suicidalIdeation: boolean;
  homicidalIdeation: boolean;
  selfHarm: boolean;
  substanceAbuse: boolean;
  psychosis: boolean;
  domesticViolence: boolean;
  childAbuse: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  interventions: string[];
  followUpRequired: boolean;
  emergencyContacts: boolean;
  notes?: string;
}

export interface NoteAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'audio' | 'video' | 'document';
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface NoteFilters {
  searchTerm?: string;
  patientId?: string;
  status?: NoteStatus;
  templateType?: NoteTemplateType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  therapistId?: string;
  signed?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CreateNoteData {
  patientId: string;
  sessionId?: string;
  templateType: NoteTemplateType;
  content: Partial<NoteContent>;
  diagnosis?: {
    primary?: DiagnosisCode;
    secondary?: DiagnosisCode[];
  };
}

export interface UpdateNoteData {
  content?: Partial<NoteContent>;
  diagnosis?: {
    primary?: DiagnosisCode;
    secondary?: DiagnosisCode[];
  };
  status?: NoteStatus;
  attachments?: NoteAttachment[];
}

export interface NoteTemplate {
  id: string;
  name: string;
  type: NoteTemplateType;
  description: string;
  fields: TemplateField[];
  isDefault: boolean;
  isActive: boolean;
  centerId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  order: number;
}

export interface NotesStats {
  total: number;
  pending: number;
  signed: number;
  draft: number;
  thisWeek: number;
  thisMonth: number;
  averageCompletionTime: number; // hours
  riskAlerts: number;
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'csv';
  includeSignature: boolean;
  includeAttachments: boolean;
  watermark?: string;
  template?: 'standard' | 'detailed' | 'summary';
}

export interface PDFExportResult {
  url: string;
  filename: string;
  size: number;
  generatedAt: Date;
  expiresAt: Date;
}
