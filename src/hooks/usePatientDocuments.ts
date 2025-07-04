import { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentService } from '../lib/services/documentService';
import { PatientDocument, DocumentFilter, DocumentStats } from '../types/documents';
import { useAuth } from '../contexts/AuthContext';

export const usePatientDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<PatientDocument[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [filters, setFilters] = useState<DocumentFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const centerId = user?.centerId;
  const patientId = user?.id;

  // ============================================================================
  // CARGAR DOCUMENTOS
  // ============================================================================
  
  const loadDocuments = useCallback(async () => {
    if (!centerId || !patientId) return;

    try {
      setLoading(true);
      setError(null);

      const [documentsData, statsData] = await Promise.all([
        DocumentService.getPatientDocuments(centerId, patientId, filters),
        DocumentService.getDocumentStats(centerId, patientId)
      ]);

      setDocuments(documentsData);
      setFilteredDocuments(documentsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Error al cargar los documentos');
      
      // Datos mock para desarrollo
      const mockDocuments: PatientDocument[] = [
        {
          id: 'doc_1',
          patientId: patientId,
          centerId: centerId,
          title: 'Consentimiento Informado - Tratamiento Psicológico',
          description: 'Documento de consentimiento para el inicio del tratamiento psicológico individual.',
          type: 'consentimiento',
          fileUrl: '/documents/consentimiento_001.pdf',
          fileName: 'consentimiento_tratamiento.pdf',
          fileType: 'pdf',
          fileSize: 245760,
          tags: ['consentimiento', 'legal', 'tratamiento'],
          uploadedBy: 'therapist1',
          uploadedByName: 'Dra. Ana García',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          isRead: true,
          readAt: new Date('2024-01-16'),
          downloadCount: 2,
          lastDownloaded: new Date('2024-01-20'),
          category: 'legal',
          privacy: 'privado',
          isRequired: true
        },
        {
          id: 'doc_2',
          patientId: patientId,
          centerId: centerId,
          title: 'Informe de Evaluación Inicial',
          description: 'Resultado de la evaluación psicológica inicial con recomendaciones de tratamiento.',
          type: 'informe',
          fileUrl: '/documents/evaluacion_inicial_001.pdf',
          fileName: 'evaluacion_inicial.pdf',
          fileType: 'pdf',
          fileSize: 512000,
          tags: ['evaluación', 'diagnóstico', 'inicial'],
          uploadedBy: 'therapist1',
          uploadedByName: 'Dra. Ana García',
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22'),
          isRead: false,
          downloadCount: 0,
          category: 'clinico',
          privacy: 'privado',
          notes: 'Informe completo de la evaluación inicial con plan de tratamiento recomendado.'
        },
        {
          id: 'doc_3',
          patientId: patientId,
          centerId: centerId,
          title: 'Guía de Técnicas de Relajación',
          description: 'Material psicoeducativo con técnicas de relajación y manejo de ansiedad.',
          type: 'psicoeducacion',
          fileUrl: '/documents/tecnicas_relajacion.pdf',
          fileName: 'guia_relajacion.pdf',
          fileType: 'pdf',
          fileSize: 1024000,
          tags: ['psicoeducación', 'ansiedad', 'técnicas', 'relajación'],
          uploadedBy: 'therapist1',
          uploadedByName: 'Dra. Ana García',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
          isRead: true,
          readAt: new Date('2024-02-02'),
          downloadCount: 3,
          lastDownloaded: new Date('2024-02-15'),
          category: 'educativo',
          privacy: 'compartido'
        },
        {
          id: 'doc_4',
          patientId: patientId,
          centerId: centerId,
          title: 'Certificado de Tratamiento',
          description: 'Certificado médico que acredita el tratamiento psicológico en curso.',
          type: 'certificado',
          fileUrl: '/documents/certificado_tratamiento.pdf',
          fileName: 'certificado_tratamiento.pdf',
          fileType: 'pdf',
          fileSize: 180000,
          tags: ['certificado', 'médico', 'tratamiento'],
          uploadedBy: 'therapist1',
          uploadedByName: 'Dra. Ana García',
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-02-10'),
          isRead: false,
          downloadCount: 0,
          category: 'administrativo',
          privacy: 'privado'
        },
        {
          id: 'doc_5',
          patientId: patientId,
          centerId: centerId,
          title: 'Audio de Meditación Guiada',
          description: 'Sesión de meditación guiada de 15 minutos para la práctica diaria.',
          type: 'recurso',
          fileUrl: '/documents/meditacion_guiada.mp3',
          fileName: 'meditacion_15min.mp3',
          fileType: 'audio',
          fileSize: 14400000,
          tags: ['meditación', 'mindfulness', 'audio', 'práctica'],
          uploadedBy: 'therapist1',
          uploadedByName: 'Dra. Ana García',
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-02-20'),
          isRead: true,
          readAt: new Date('2024-02-21'),
          downloadCount: 5,
          lastDownloaded: new Date('2024-03-01'),
          category: 'educativo',
          privacy: 'compartido'
        }
      ];

      const mockStats: DocumentStats = {
        total: mockDocuments.length,
        byType: {
          consentimiento: 1,
          informe: 1,
          psicoeducacion: 1,
          certificado: 1,
          recurso: 1,
          receta: 0,
          constancia: 0,
          evaluacion: 0,
          'plan-tratamiento': 0,
          tarea: 0,
          otro: 0
        },
        byCategory: {
          legal: 1,
          clinico: 1,
          educativo: 2,
          administrativo: 1,
          personal: 0
        },
        unread: mockDocuments.filter(doc => !doc.isRead).length,
        recentlyAdded: 2,
        totalSize: mockDocuments.reduce((total, doc) => total + doc.fileSize, 0)
      };

      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  }, [centerId, patientId, filters]);

  // ============================================================================
  // FILTROS
  // ============================================================================
  
  const applyFilters = useCallback((newFilters: DocumentFilter) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Aplicar filtros en tiempo real
  useEffect(() => {
    let filtered = [...documents];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.type) {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }

    if (filters.isRead !== undefined) {
      filtered = filtered.filter(doc => doc.isRead === filters.isRead);
    }

    if (filters.dateRange) {
      filtered = filtered.filter(doc => 
        doc.createdAt >= filters.dateRange!.start &&
        doc.createdAt <= filters.dateRange!.end
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(doc =>
        filters.tags!.some(tag => doc.tags.includes(tag))
      );
    }

    setFilteredDocuments(filtered);
  }, [documents, filters]);

  // ============================================================================
  // ACCIONES
  // ============================================================================
  
  const markAsRead = useCallback(async (documentId: string) => {
    if (!centerId || !patientId) return;

    try {
      await DocumentService.markAsRead(centerId, patientId, documentId);
      
      // Actualizar estado local
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, isRead: true, readAt: new Date() }
          : doc
      ));
    } catch (err) {
      console.error('Error marking document as read:', err);
    }
  }, [centerId, patientId]);

  const downloadDocument = useCallback(async (document: PatientDocument) => {
    if (!centerId || !patientId) return;

    try {
      await DocumentService.downloadDocument(centerId, patientId, document);
      
      // Actualizar estado local
      setDocuments(prev => prev.map(doc => 
        doc.id === document.id 
          ? { 
              ...doc, 
              downloadCount: doc.downloadCount + 1,
              lastDownloaded: new Date()
            }
          : doc
      ));
    } catch (err) {
      console.error('Error downloading document:', err);
      throw err;
    }
  }, [centerId, patientId]);

  // ============================================================================
  // EFECTOS
  // ============================================================================
  
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // ============================================================================
  // VALORES COMPUTADOS
  // ============================================================================
  
  const hasUnreadDocuments = useMemo(() => {
    return documents.some(doc => !doc.isRead);
  }, [documents]);

  const recentDocuments = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return documents.filter(doc => doc.createdAt >= weekAgo);
  }, [documents]);

  return {
    // Datos
    documents: filteredDocuments,
    allDocuments: documents,
    stats,
    recentDocuments,
    
    // Estado
    loading,
    error,
    hasUnreadDocuments,
    
    // Filtros
    filters,
    applyFilters,
    clearFilters,
    
    // Acciones
    markAsRead,
    downloadDocument,
    refreshDocuments: loadDocuments
  };
};
