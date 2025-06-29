'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Share,
  Lock,
  Unlock,
  QrCode,
  Scan,
  Printer,
  Mail,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Tag,
  Folder,
  Image,
  Video,
  Mic
} from 'lucide-react';
import { Document, DocumentTemplate, FormField } from '@/types/clinical';

interface DocumentManagerProps {
  documents: Document[];
  templates: DocumentTemplate[];
  onCreateDocument: (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateDocument: (documentId: string, updates: Partial<Document>) => void;
  onDeleteDocument: (documentId: string) => void;
  onGeneratePDF: (documentId: string) => void;
  onScanDocument: () => void;
}

export function DocumentManager({
  documents,
  templates,
  onCreateDocument,
  onUpdateDocument,
  onDeleteDocument,
  onGeneratePDF,
  onScanDocument
}: DocumentManagerProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'templates', label: 'Plantillas', icon: Folder },
    { id: 'forms', label: 'Formularios', icon: Edit },
    { id: 'scanner', label: 'Escáner OCR', icon: Scan }
  ];

  const documentTypes = [
    { id: 'consent', label: 'Consentimiento Informado', color: '#10B981', icon: Shield },
    { id: 'assessment', label: 'Evaluación', color: '#6366F1', icon: FileText },
    { id: 'treatment', label: 'Plan de Tratamiento', color: '#F59E0B', icon: Target },
    { id: 'prescription', label: 'Receta/Constancia', color: '#EF4444', icon: FileText },
    { id: 'report', label: 'Informe', color: '#8B5CF6', icon: FileText },
    { id: 'insurance', label: 'Seguro', color: '#06B6D4', icon: Shield },
    { id: 'legal', label: 'Legal', color: '#84CC16', icon: Scale },
    { id: 'other', label: 'Otro', color: '#9CA3AF', icon: FileText }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getDocumentIcon = (type: string) => {
    const docType = documentTypes.find(t => t.id === type);
    return docType?.icon || FileText;
  };

  const getDocumentColor = (type: string) => {
    const docType = documentTypes.find(t => t.id === type);
    return docType?.color || '#9CA3AF';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#F59E0B';
      case 'pending': return '#6366F1';
      case 'signed': return '#10B981';
      case 'expired': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'pending': return 'Pendiente';
      case 'signed': return 'Firmado';
      case 'expired': return 'Expirado';
      default: return 'Desconocido';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const newDocument: Omit<Document, 'id' | 'createdAt' | 'updatedAt'> = {
          title: file.name,
          type: 'other',
          status: 'draft',
          content: '',
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          mimeType: file.type,
          tags: [],
          isConfidential: false,
          requiresSignature: false,
          centerId: '',
          createdBy: '',
          patientId: null,
          patientName: null
        };
        onCreateDocument(newDocument);
      });
    }
  };

  const renderDocuments = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Search and Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1F2937',
          margin: 0,
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Gestión de Documentos
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#6B7280" style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '0.75rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                width: '200px'
              }}
              placeholder="Buscar documentos..."
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
          >
            <option value="all">Todos los tipos</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="pending">Pendiente</option>
            <option value="signed">Firmado</option>
            <option value="expired">Expirado</option>
          </select>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10B981',
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
            Subir Archivo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Plus size={16} />
            Nuevo Documento
          </motion.button>
        </div>
      </div>

      {/* Documents Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredDocuments.map((document) => {
          const Icon = getDocumentIcon(document.type);
          const color = getDocumentColor(document.type);
          const statusColor = getStatusColor(document.status);

          return (
            <motion.div
              key={document.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDocument(document)}
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Document Type and Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: `${color}20`,
                  borderRadius: '0.25rem',
                  border: `1px solid ${color}40`
                }}>
                  <Icon size={14} color={color} />
                  <span style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: color,
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase'
                  }}>
                    {documentTypes.find(t => t.id === document.type)?.label}
                  </span>
                </div>

                <div style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: `${statusColor}20`,
                  borderRadius: '0.25rem',
                  border: `1px solid ${statusColor}40`
                }}>
                  <span style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: statusColor,
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase'
                  }}>
                    {getStatusLabel(document.status)}
                  </span>
                </div>
              </div>

              {/* Confidential Badge */}
              {document.isConfidential && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.25rem',
                  backgroundColor: '#FEF2F2',
                  borderRadius: '0.25rem',
                  border: '1px solid #FECACA'
                }}>
                  <Lock size={12} color="#EF4444" />
                </div>
              )}

              {/* Document Title */}
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Space Grotesk, sans-serif',
                lineHeight: '1.4'
              }}>
                {document.title}
              </h4>

              {/* Patient Info */}
              {document.patientName && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <User size={14} />
                  <span>{document.patientName}</span>
                </div>
              )}

              {/* Document Info */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Calendar size={12} />
                  <span>{document.createdAt?.toLocaleDateString('es-ES')}</span>
                </div>

                {document.fileSize && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <FileText size={12} />
                    <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                )}

                {document.requiresSignature && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#F59E0B',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <Edit size={12} />
                    <span>Requiere firma</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {document.tags.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.125rem 0.375rem',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '0.25rem',
                        fontSize: '0.625rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span style={{
                      padding: '0.125rem 0.375rem',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '0.25rem',
                      fontSize: '0.625rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      +{document.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // View document
                  }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGeneratePDF(document.id);
                  }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#F0FDF4',
                    color: '#15803D',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share document
                  }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Share size={14} />
                </motion.button>

                {document.qrCode && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show QR code
                    }}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#F0F9FF',
                      color: '#0369A1',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <QrCode size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderScanner = () => (
    <div style={{
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#EEF2FF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem'
      }}>
        <Scan size={40} color="#6366F1" />
      </div>

      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1F2937',
        margin: '0 0 1rem 0',
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        Escáner OCR Integrado
      </h3>

      <p style={{
        fontSize: '1rem',
        color: '#6B7280',
        margin: '0 0 2rem 0',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: '1.6',
        fontFamily: 'Inter, sans-serif'
      }}>
        Digitaliza documentos físicos con reconocimiento óptico de caracteres (OCR). 
        Los documentos escaneados se procesan automáticamente y se extraen los datos relevantes.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#F0FDF4',
          borderRadius: '0.75rem',
          border: '1px solid #BBF7D0'
        }}>
          <CheckCircle size={24} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#15803D',
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Alta Precisión
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#166534',
            fontFamily: 'Inter, sans-serif'
          }}>
            OCR avanzado con 99%+ precisión
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#EEF2FF',
          borderRadius: '0.75rem',
          border: '1px solid #C7D2FE'
        }}>
          <Shield size={24} color="#6366F1" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#4338CA',
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Seguro
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#3730A3',
            fontFamily: 'Inter, sans-serif'
          }}>
            Procesamiento local encriptado
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#FEF3C7',
          borderRadius: '0.75rem',
          border: '1px solid #FDE68A'
        }}>
          <Clock size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#92400E',
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Rápido
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#78350F',
            fontFamily: 'Inter, sans-serif'
          }}>
            Procesamiento en segundos
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsScanning(true);
          onScanDocument();
          // Simulate scanning process
          setTimeout(() => setIsScanning(false), 3000);
        }}
        disabled={isScanning}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 2rem',
          backgroundColor: isScanning ? '#9CA3AF' : '#6366F1',
          color: 'white',
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: isScanning ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          margin: '0 auto'
        }}
      >
        {isScanning ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #ffffff40',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Escaneando...</span>
          </>
        ) : (
          <>
            <Scan size={20} />
            <span>Iniciar Escaneo</span>
          </>
        )}
      </motion.button>

      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#F0F9FF',
            borderRadius: '0.75rem',
            border: '1px solid #E0F2FE'
          }}
        >
          <div style={{
            fontSize: '0.875rem',
            color: '#0369A1',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '1rem'
          }}>
            Procesando documento...
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#E0F2FE',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              style={{
                height: '100%',
                backgroundColor: '#0369A1',
                borderRadius: '4px'
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F9FAFB'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Documentos & Formularios
            </h1>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: activeTab === tab.id ? '#EEF2FF' : 'transparent',
                      color: activeTab === tab.id ? '#4338CA' : '#6B7280',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'templates' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <Folder size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Plantillas de Documentos
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Gestiona plantillas PDF de consentimiento informado y otros documentos
            </p>
          </div>
        )}
        {activeTab === 'forms' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <Edit size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Constructor de Formularios
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Crea formularios intake personalizables y dinámicos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
