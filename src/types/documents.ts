// ============================================================================
// TIPOS PARA DOCUMENTOS DEL PACIENTE
// ============================================================================

export interface PatientDocument {
  id: string;
  patientId: string;
  centerId: string;
  title: string;
  description: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileType: string; // pdf, image, audio, video
  fileSize: number; // bytes
  tags: string[];
  uploadedBy: string; // therapist ID
  uploadedByName: string; // therapist name
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  readAt?: Date;
  downloadCount: number;
  lastDownloaded?: Date;
  notes?: string;
  isRequired?: boolean;
  expiresAt?: Date;
  category: DocumentCategory;
  privacy: DocumentPrivacy;
  metadata?: DocumentMetadata;
}

export type DocumentType = 
  | 'consentimiento'
  | 'informe'
  | 'receta'
  | 'constancia'
  | 'psicoeducacion'
  | 'certificado'
  | 'evaluacion'
  | 'plan-tratamiento'
  | 'tarea'
  | 'recurso'
  | 'otro';

export type DocumentCategory = 
  | 'clinico'
  | 'administrativo'
  | 'educativo'
  | 'legal'
  | 'personal';

export type DocumentPrivacy = 
  | 'privado'
  | 'compartido'
  | 'publico';

export interface DocumentMetadata {
  version?: string;
  language?: string;
  author?: string;
  keywords?: string[];
  summary?: string;
  relatedDocuments?: string[];
}

export interface DocumentFilter {
  search?: string;
  type?: DocumentType;
  category?: DocumentCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  isRead?: boolean;
  tags?: string[];
  uploadedBy?: string;
}

export interface DocumentStats {
  total: number;
  byType: Record<DocumentType, number>;
  byCategory: Record<DocumentCategory, number>;
  unread: number;
  recentlyAdded: number;
  totalSize: number;
}

export interface DocumentAction {
  id: string;
  documentId: string;
  patientId: string;
  action: 'view' | 'download' | 'share' | 'print';
  timestamp: Date;
  metadata?: Record<string, string | number | boolean>;
}

// Tipos para el visor de documentos
export interface DocumentViewerProps {
  document: PatientDocument;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (document: PatientDocument) => void;
  onMarkAsRead?: (document: PatientDocument) => void;
}

// Tipos para filtros
export interface DocumentFiltersProps {
  filters: DocumentFilter;
  onFiltersChange: (filters: DocumentFilter) => void;
  onClearFilters: () => void;
  stats: DocumentStats;
}
