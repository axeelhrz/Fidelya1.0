'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Mail,
  FileText,
  CheckCircle,
  Target,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Share2
} from 'lucide-react';
import { TreatmentExportOptions } from '@/types/treatment';

interface ExportTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: TreatmentExportOptions) => Promise<void>;
  loading?: boolean;
}

export default function ExportTreatmentModal({
  isOpen,
  onClose,
  onExport,
  loading = false
}: ExportTreatmentModalProps) {
  const [exportOptions, setExportOptions] = useState<TreatmentExportOptions>({
    format: 'pdf',
    sections: [
      { name: 'Información General', included: true },
      { name: 'Objetivos SMART', included: true },
      { name: 'Tareas y Actividades', included: true },
      { name: 'Progreso y Evolución', included: true },
      { name: 'Materiales de Apoyo', included: false },
      { name: 'Notas del Terapeuta', included: false }
    ],
    includeProgress: true,
    includeNotes: false,
    includeMaterials: false,
    language: 'es',
    template: 'completo'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'download' | 'email'>('download');
  const [emailAddress, setEmailAddress] = useState('');

  const handleSectionToggle = (sectionName: string) => {
    setExportOptions(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.name === sectionName
          ? { ...section, included: !section.included }
          : section
      )
    }));
  };

  const handleExport = async () => {
    try {
      await onExport(exportOptions);
      onClose();
    } catch (error) {
      console.error('Error exporting treatment plan:', error);
    }
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Formato portable, ideal para imprimir' },
    { value: 'word', label: 'Word', icon: FileText, description: 'Documento editable' },
    { value: 'html', label: 'HTML', icon: FileText, description: 'Página web interactiva' }
  ];

  const templateOptions = [
    { value: 'completo', label: 'Completo', description: 'Incluye toda la información disponible' },
    { value: 'resumen', label: 'Resumen', description: 'Información esencial y progreso' },
    { value: 'progreso', label: 'Solo Progreso', description: 'Enfocado en evolución y logros' }
  ];

  const sectionIcons: { [key: string]: React.ComponentType<{ size?: number; color?: string }> } = {
    'Información General': Settings,
    'Objetivos SMART': Target,
    'Tareas y Actividades': CheckCircle,
    'Progreso y Evolución': BarChart3,
    'Materiales de Apoyo': BookOpen,
    'Notas del Terapeuta': MessageSquare
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '600px',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              zIndex: 51,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 1.5rem 0 1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#EFF6FF'
                }}>
                  <Download size={20} color="#3B82F6" />
                </div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#1E293B',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Exportar Plan de Tratamiento
                </h2>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#F1F5F9',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              {/* Format Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Formato de Exportación
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {formatOptions.map((format) => {
                    const Icon = format.icon;
                    return (
                      <motion.button
                        key={format.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as TreatmentExportOptions['format'] }))}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${exportOptions.format === format.value ? '#3B82F6' : '#E2E8F0'}`,
                          backgroundColor: exportOptions.format === format.value ? '#EFF6FF' : 'white',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <Icon size={18} color={exportOptions.format === format.value ? '#3B82F6' : '#64748B'} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: exportOptions.format === format.value ? '#3B82F6' : '#1E293B'
                          }}>
                            {format.label}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748B',
                          margin: 0,
                          lineHeight: 1.4
                        }}>
                          {format.description}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Template Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Plantilla
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {templateOptions.map((template) => (
                    <motion.button
                      key={template.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setExportOptions(prev => ({ ...prev, template: template.value as 'completo' | 'resumen' | 'progreso' }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        border: `1px solid ${exportOptions.template === template.value ? '#3B82F6' : '#E2E8F0'}`,
                        backgroundColor: exportOptions.template === template.value ? '#EFF6FF' : 'white',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${exportOptions.template === template.value ? '#3B82F6' : '#D1D5DB'}`,
                        backgroundColor: exportOptions.template === template.value ? '#3B82F6' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {exportOptions.template === template.value && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'white'
                          }} />
                        )}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: exportOptions.template === template.value ? '#3B82F6' : '#1E293B',
                          marginBottom: '0.25rem'
                        }}>
                          {template.label}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748B'
                        }}>
                          {template.description}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sections to Include */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Secciones a Incluir
                </label>
                <div style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '0.75rem',
                  overflow: 'hidden'
                }}>
                  {exportOptions.sections.map((section, index) => {
                    const Icon = sectionIcons[section.name] || FileText;
                    return (
                      <motion.div
                        key={section.name}
                        whileHover={{ backgroundColor: '#F8FAFC' }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderBottom: index < exportOptions.sections.length - 1 ? '1px solid #E2E8F0' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleSectionToggle(section.name)}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '0.25rem',
                          border: `2px solid ${section.included ? '#10B981' : '#D1D5DB'}`,
                          backgroundColor: section.included ? '#10B981' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {section.included && (
                            <CheckCircle size={12} color="white" />
                          )}
                        </div>
                        
                        <div style={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          backgroundColor: section.included ? '#ECFDF5' : '#F1F5F9'
                        }}>
                          <Icon size={14} color={section.included ? '#10B981' : '#64748B'} />
                        </div>
                        
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: section.included ? '#1E293B' : '#64748B'
                        }}>
                          {section.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Opciones Adicionales
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <motion.div
                    whileHover={{ backgroundColor: '#F8FAFC' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExportOptions(prev => ({ ...prev, includeProgress: !prev.includeProgress }))}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '0.25rem',
                      border: `2px solid ${exportOptions.includeProgress ? '#10B981' : '#D1D5DB'}`,
                      backgroundColor: exportOptions.includeProgress ? '#10B981' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {exportOptions.includeProgress && (
                        <CheckCircle size={12} color="white" />
                      )}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#1E293B'
                    }}>
                      Incluir gráficos de progreso
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ backgroundColor: '#F8FAFC' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExportOptions(prev => ({ ...prev, includeNotes: !prev.includeNotes }))}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '0.25rem',
                      border: `2px solid ${exportOptions.includeNotes ? '#10B981' : '#D1D5DB'}`,
                      backgroundColor: exportOptions.includeNotes ? '#10B981' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {exportOptions.includeNotes && (
                        <CheckCircle size={12} color="white" />
                      )}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#1E293B'
                    }}>
                      Incluir notas personales
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ backgroundColor: '#F8FAFC' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExportOptions(prev => ({ ...prev, includeMaterials: !prev.includeMaterials }))}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '0.25rem',
                      border: `2px solid ${exportOptions.includeMaterials ? '#10B981' : '#D1D5DB'}`,
                      backgroundColor: exportOptions.includeMaterials ? '#10B981' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {exportOptions.includeMaterials && (
                        <CheckCircle size={12} color="white" />
                      )}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#1E293B'
                    }}>
                      Incluir enlaces a materiales
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Delivery Method */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Método de Entrega
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeliveryMethod('download')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      border: `2px solid ${deliveryMethod === 'download' ? '#3B82F6' : '#E2E8F0'}`,
                      backgroundColor: deliveryMethod === 'download' ? '#EFF6FF' : 'white',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: deliveryMethod === 'download' ? '#3B82F6' : '#64748B'
                    }}
                  >
                    <Download size={16} />
                    Descargar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeliveryMethod('email')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      border: `2px solid ${deliveryMethod === 'email' ? '#3B82F6' : '#E2E8F0'}`,
                      backgroundColor: deliveryMethod === 'email' ? '#EFF6FF' : 'white',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: deliveryMethod === 'email' ? '#3B82F6' : '#64748B'
                    }}
                  >
                    <Mail size={16} />
                    Enviar por Email
                  </motion.button>
                </div>
              </div>

              {/* Email Input */}
              {deliveryMethod === 'email' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Dirección de Email
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="tu@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </motion.div>
              )}

              {/* Privacy Notice */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#FFFBEB',
                borderRadius: '0.5rem',
                border: '1px solid #FDE68A',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Share2 size={14} color="#F59E0B" />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#92400E'
                  }}>
                    Información de Privacidad
                  </span>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#A16207',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  Tu plan de tratamiento contiene información confidencial. Asegúrate de compartirlo solo con personas autorizadas. 
                  Los archivos exportados mantienen el mismo nivel de protección que tu información en la plataforma.
                </p>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  disabled={loading || (deliveryMethod === 'email' && !emailAddress)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    backgroundColor: (loading || (deliveryMethod === 'email' && !emailAddress)) ? '#D1D5DB' : '#3B82F6',
                    color: 'white',
                    borderRadius: '0.5rem',
                    cursor: (loading || (deliveryMethod === 'email' && !emailAddress)) ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Exportando...
                    </>
                  ) : (
                    <>
                      {deliveryMethod === 'download' ? <Download size={16} /> : <Mail size={16} />}
                      {deliveryMethod === 'download' ? 'Descargar Plan' : 'Enviar por Email'}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

