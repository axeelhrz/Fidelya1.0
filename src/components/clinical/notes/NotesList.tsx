'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, 
  Eye, 
  FileSignature, 
  Trash2, 
  Copy, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Brain,
  MoreVertical
} from 'lucide-react';
import { ClinicalNote } from '@/types/notes';

interface NotesListProps {
  notes: ClinicalNote[];
  onEdit: (note: ClinicalNote) => void;
  onView: (note: ClinicalNote) => void;
  onSign: (note: ClinicalNote) => void;
  onDelete: (note: ClinicalNote) => void;
  onDuplicate: (note: ClinicalNote) => void;
  onValidate: (note: ClinicalNote) => void;
  onExport: (note: ClinicalNote) => void;
}

export default function NotesList({
  notes,
  onEdit,
  onView,
  onSign,
  onDelete,
  onDuplicate,
  onValidate,
  onExport
}: NotesListProps) {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#F59E0B';
      case 'pending': return '#3B82F6';
      case 'signed': return '#10B981';
      case 'locked': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'pending': return 'Pendiente';
      case 'signed': return 'Firmada';
      case 'locked': return 'Bloqueada';
      default: return status;
    }
  };

  const getTemplateLabel = (type: string) => {
    switch (type) {
      case 'soap': return 'SOAP';
      case 'dap': return 'DAP';
      case 'free': return 'Libre';
      default: return type;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#9CA3AF';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderActionButton = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    color: string = '#6B7280',
    disabled: boolean = false
  ) => (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: disabled ? '#F3F4F6' : 'white',
        color: disabled ? '#9CA3AF' : color,
        border: `1px solid ${disabled ? '#E5E7EB' : '#E5E7EB'}`,
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1
      }}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );

  const renderDropdownMenu = (note: ClinicalNote) => (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setActiveDropdown(activeDropdown === note.id ? null : note.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '0.5rem',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MoreVertical size={16} color="#6B7280" />
      </motion.button>

      <AnimatePresence>
        {activeDropdown === note.id && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              minWidth: '160px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '0.5rem' }}>
              <button
                onClick={() => {
                  onValidate(note);
                  setActiveDropdown(null);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Brain size={14} />
                Validar con IA
              </button>

              <button
                onClick={() => {
                  onDuplicate(note);
                  setActiveDropdown(null);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Copy size={14} />
                Duplicar
              </button>

              <button
                onClick={() => {
                  onExport(note);
                  setActiveDropdown(null);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Download size={14} />
                Exportar PDF
              </button>

              {!note.signed && (
                <>
                  <div style={{
                    height: '1px',
                    background: '#E5E7EB',
                    margin: '0.5rem 0'
                  }} />

                  <button
                    onClick={() => {
                      onDelete(note);
                      setActiveDropdown(null);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#EF4444',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderNotePreview = (note: ClinicalNote) => {
    const content = note.content;
    let preview = '';

    if (note.templateType === 'soap') {
      preview = content.subjective || content.objective || content.assessment || content.plan || '';
    } else if (note.templateType === 'dap') {
      preview = content.data || content.assessment || content.plan || '';
    } else {
      preview = content.freeText || '';
    }

    return preview.substring(0, 150) + (preview.length > 150 ? '...' : '');
  };

  const renderNoteCard = (note: ClinicalNote, index: number) => (
    <motion.div
      key={note.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {/* Header de la tarjeta */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: 0
              }}>
                {note.patientName}
              </h3>
              
              <div style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: `${getStatusColor(note.status)}15`,
                color: getStatusColor(note.status),
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {note.status === 'signed' && <CheckCircle size={12} />}
                {note.status === 'pending' && <Clock size={12} />}
                {note.status === 'draft' && <Edit size={12} />}
                {getStatusLabel(note.status)}
              </div>

              <div style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {getTemplateLabel(note.templateType)}
              </div>

              {note.content.riskAssessment && note.content.riskAssessment.riskLevel !== 'low' && (
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: `${getRiskLevelColor(note.content.riskAssessment.riskLevel)}15`,
                  color: getRiskLevelColor(note.content.riskAssessment.riskLevel),
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <AlertTriangle size={12} />
                  Riesgo {note.content.riskAssessment.riskLevel}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.875rem',
              color: '#6B7280',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} />
                {formatDate(note.date)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={14} />
                {note.therapistName}
              </div>
              {note.diagnosis?.primary && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FileText size={14} />
                  {note.diagnosis.primary.code} - {note.diagnosis.primary.description.substring(0, 30)}...
                </div>
              )}
            </div>
          </div>

          {renderDropdownMenu(note)}
        </div>

        {/* Preview del contenido */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#F8FAFC',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#6B7280',
          lineHeight: 1.5
        }}>
          {renderNotePreview(note)}
        </div>
      </div>

      {/* Acciones principales */}
      <div style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        {renderActionButton(
          <Eye size={14} />,
          'Ver',
          () => onView(note),
          '#3B82F6'
        )}

        {renderActionButton(
          <Edit size={14} />,
          'Editar',
          () => onEdit(note),
          '#F59E0B',
          note.locked
        )}

        {renderActionButton(
          <FileSignature size={14} />,
          'Firmar',
          () => onSign(note),
          '#10B981',
          note.signed
        )}

        {/* Indicadores adicionales */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {note.aiValidation && (
            <div style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: note.aiValidation.isValid ? '#ECFDF5' : '#FEF2F2',
              color: note.aiValidation.isValid ? '#10B981' : '#EF4444',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Brain size={12} />
              IA: {note.aiValidation.coherenceScore}%
            </div>
          )}

          {note.signed && note.signedAt && (
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <CheckCircle size={12} color="#10B981" />
              Firmada {formatDate(note.signedAt)}
            </div>
          )}

          {note.attachments.length > 0 && (
            <div style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {note.attachments.length} adjunto{note.attachments.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Expandir para más detalles */}
      <AnimatePresence>
        {expandedNote === note.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(229, 231, 235, 0.3)',
              background: '#FAFBFC'
            }}
          >
            <div style={{ padding: '1.25rem' }}>
              {/* Contenido detallado según el tipo de plantilla */}
              {note.templateType === 'soap' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {note.content.subjective && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Subjetivo
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.subjective}
                      </p>
                    </div>
                  )}
                  {note.content.objective && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Objetivo
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.objective}
                      </p>
                    </div>
                  )}
                  {note.content.assessment && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Evaluación
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.assessment}
                      </p>
                    </div>
                  )}
                  {note.content.plan && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Plan
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.plan}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {note.templateType === 'dap' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {note.content.data && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Datos
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.data}
                      </p>
                    </div>
                  )}
                  {note.content.assessment && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Evaluación
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.assessment}
                      </p>
                    </div>
                  )}
                  {note.content.plan && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Plan
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                        {note.content.plan}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {note.templateType === 'free' && note.content.freeText && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                    Contenido
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                    {note.content.freeText}
                  </p>
                </div>
              )}

              {/* Evaluación de riesgo */}
              {note.content.riskAssessment && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #E5E7EB'
                }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                    Evaluación de Riesgo
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {note.content.riskAssessment.suicidalIdeation && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#FEF2F2',
                        color: '#EF4444',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem'
                      }}>
                        Ideación suicida
                      </span>
                    )}
                    {note.content.riskAssessment.selfHarm && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#FEF2F2',
                        color: '#EF4444',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem'
                      }}>
                        Autolesión
                      </span>
                    )}
                    {note.content.riskAssessment.substanceAbuse && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#FFFBEB',
                        color: '#F59E0B',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem'
                      }}>
                        Abuso de sustancias
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para expandir/contraer */}
      <motion.button
        onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#F8FAFC',
          border: 'none',
          borderTop: '1px solid rgba(229, 231, 235, 0.3)',
          fontSize: '0.875rem',
          color: '#6B7280',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {expandedNote === note.id ? 'Ver menos' : 'Ver más detalles'}
      </motion.button>
    </motion.div>
  );

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <FileText size={64} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
          No hay notas clínicas
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 1.5rem 0' }}>
          Comienza creando tu primera nota clínica para documentar las sesiones con tus pacientes.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <FileText size={16} />
          Crear Primera Nota
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gap: '1.5rem'
    }}>
      {notes.map((note, index) => renderNoteCard(note, index))}

      {/* Click outside para cerrar dropdown */}
      {activeDropdown && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40
          }}
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}
