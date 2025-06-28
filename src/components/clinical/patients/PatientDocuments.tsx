'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  Mic,
  Video,
  Download,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Tag,
  Lock,
  Unlock,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { PatientDocument, ExtendedPatient } from '@/types/clinical';

interface PatientDocumentsProps {
  patient: ExtendedPatient;
  documents: PatientDocument[];
  onUpload: (files: FileList, metadata: Partial<PatientDocument>) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
  onDownload: (document: PatientDocument) => void;
  onView: (document: PatientDocument) => void;
  onUpdateTags: (documentId: string, tags: string[]) => Promise<void>;
  onToggleConfidential: (documentId: string, isConfidential: boolean) => Promise<void>;
}

export function PatientDocuments({
  patient,
  documents,
  onUpload,
  onDelete,
  onDownload,
  onView,
  onUpdateTags,
  onToggleConfidential
}: PatientDocumentsProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState<Partial<PatientDocument>>({
    type: 'other',
    tags: [],
    isConfidential: false
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Group documents by type
  const documentsByType = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, PatientDocument[]>);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('audio/')) return Mic;
    if (mimeType.startsWith('video/')) return Video;
    return FileText;
  };

  const getFileTypeLabel = (type: string) => {
    const labels = {
      'intake-form': 'Formulario de Ingreso',
      'assessment': 'Evaluación',
      'medical-record': 'Historial Médico',
      'insurance': 'Seguro',
      'consent': 'Consentimiento',
      'photo': 'Fotografía',
      'audio': 'Audio',
      'other': 'Otro'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFiles(files);
      setShowUploadModal(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    
    try {
      await onUpload(selectedFiles, uploadMetadata);
      setShowUploadModal(false);
      setSelectedFiles(null);
      setUploadMetadata({
        type: 'other',
        tags: [],
        isConfidential: false
      });
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const addTag = (documentId: string, newTag: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document && !document.tags.includes(newTag)) {
      onUpdateTags(documentId, [...document.tags, newTag]);
    }
  };

  const removeTag = (documentId: string, tagToRemove: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      onUpdateTags(documentId, document.tags.filter(tag => tag !== tagToRemove));
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Documentos del Paciente
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {patient.firstName} {patient.lastName} • {documents.length} documentos
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Upload size={18} />
            Subir Documento
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF'
            }} />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
          >
            <option value="all">Todos los tipos</option>
            <option value="intake-form">Formularios de Ingreso</option>
            <option value="assessment">Evaluaciones</option>
            <option value="medical-record">Historiales Médicos</option>
            <option value="insurance">Seguros</option>
            <option value="consent">Consentimientos</option>
            <option value="photo">Fotografías</option>
            <option value="audio">Audio</option>
            <option value="other">Otros</option>
          </select>
        </div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: '2rem',
          backgroundColor: dragOver ? '#EFF6FF' : 'white',
          borderRadius: '1rem',
          border: `2px dashed ${dragOver ? '#2563EB' : '#E5E7EB'}`,
          textAlign: 'center',
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} color={dragOver ? '#2563EB' : '#D1D5DB'} style={{ marginBottom: '1rem' }} />
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Arrastra archivos aquí o haz clic para seleccionar
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          margin: 0,
          fontFamily: 'Inter, sans-serif'
        }}>
          Soporta PDF, imágenes, audio y video. Máximo 10MB por archivo.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4,.mov"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </motion.div>

      {/* Documents Grid */}
      {Object.keys(documentsByType).length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB'
          }}
        >
          <FileText size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            No hay documentos
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Los documentos del paciente aparecerán aquí una vez que los subas
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(documentsByType).map(([type, docs]) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #F3F4F6',
                backgroundColor: '#F9FAFB'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {getFileTypeLabel(type)} ({docs.length})
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                padding: '1.5rem'
              }}>
                {docs.map((document, index) => {
                  const FileIcon = getFileIcon(document.mimeType);
                  
                  return (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          border: '1px solid #E5E7EB'
                        }}>
                          <FileIcon size={24} color="#6B7280" />
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#374151',
                              margin: 0,
                              fontFamily: 'Inter, sans-serif',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {document.name}
                            </h4>
                            
                            {document.isConfidential && (
                              <Lock size={14} color="#EF4444" />
                            )}
                          </div>
                          
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            marginBottom: '0.5rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {formatFileSize(document.size)} • {document.uploadedAt.toLocaleDateString('es-ES')}
                          </div>
                          
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Subido por: {document.uploadedBy}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {document.tags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.25rem',
                          marginBottom: '1rem'
                        }}>
                          {document.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontFamily: 'Inter, sans-serif'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onView(document)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #DBEAFE',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          <Eye size={14} style={{ marginRight: '0.25rem' }} />
                          Ver
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDownload(document)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            backgroundColor: '#ECFDF5',
                            color: '#10B981',
                            border: '1px solid #A7F3D0',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          <Download size={14} style={{ marginRight: '0.25rem' }} />
                          Descargar
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleConfidential(document.id, !document.isConfidential)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: document.isConfidential ? '#FEF2F2' : '#FFFBEB',
                            color: document.isConfidential ? '#EF4444' : '#F59E0B',
                            border: `1px solid ${document.isConfidential ? '#FECACA' : '#FDE68A'}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                          title={document.isConfidential ? 'Marcar como no confidencial' : 'Marcar como confidencial'}
                        >
                          {document.isConfidential ? <Lock size={14} /> : <Unlock size={14} />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
                              onDelete(document.id);
                            }
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#FEF2F2',
                            color: '#EF4444',
                            border: '1px solid #FECACA',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && selectedFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Subir Documentos
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: '0.5rem 0 0 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {selectedFiles.length} archivo{selectedFiles.length > 1 ? 's' : ''} seleccionado{selectedFiles.length > 1 ? 's' : ''}
                </p>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {/* File List */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Archivos a subir:
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Array.from(selectedFiles).map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '0.5rem',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        <FileText size={16} color="#6B7280" />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {file.name}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Tipo de Documento
                    </label>
                    <select
                      value={uploadMetadata.type || 'other'}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, type: e.target.value as any }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value="intake-form">Formulario de Ingreso</option>
                      <option value="assessment">Evaluación</option>
                      <option value="medical-record">Historial Médico</option>
                      <option value="insurance">Seguro</option>
                      <option value="consent">Consentimiento</option>
                      <option value="photo">Fotografía</option>
                      <option value="audio">Audio</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Etiquetas (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={uploadMetadata.tags?.join(', ') || ''}
                      onChange={(e) => setUploadMetadata(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                      }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                      placeholder="ej: inicial, evaluación, importante"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={uploadMetadata.isConfidential || false}
                        onChange={(e) => setUploadMetadata(prev => ({ ...prev, isConfidential: e.target.checked }))}
                      />
                      Marcar como confidencial
                    </label>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 1.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Los documentos confidenciales requieren permisos especiales para acceder
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <Upload size={16} />
                  Subir Documentos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
