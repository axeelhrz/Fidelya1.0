'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Download,
  FileText,
  Table,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  Mail,
  Phone,
  MapPin,
  Activity,
  Heart,
  Shield
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';

interface ExportModalProps {
  patients: ExtendedPatient[];
  onClose: () => void;
}

export function ExportModal({ patients, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'firstName',
    'lastName',
    'email',
    'phone',
    'age',
    'gender',
    'status',
    'riskLevel',
    'totalSessions',
    'lastSession'
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const availableFields = [
    { id: 'firstName', label: 'Nombre', icon: Users, category: 'basic' },
    { id: 'lastName', label: 'Apellidos', icon: Users, category: 'basic' },
    { id: 'email', label: 'Email', icon: Mail, category: 'contact' },
    { id: 'phone', label: 'Teléfono', icon: Phone, category: 'contact' },
    { id: 'age', label: 'Edad', icon: Users, category: 'basic' },
    { id: 'gender', label: 'Género', icon: Users, category: 'basic' },
    { id: 'address', label: 'Dirección', icon: MapPin, category: 'contact' },
    { id: 'status', label: 'Estado', icon: Activity, category: 'clinical' },
    { id: 'riskLevel', label: 'Nivel de Riesgo', icon: AlertCircle, category: 'clinical' },
    { id: 'assignedTherapist', label: 'Terapeuta Asignado', icon: Users, category: 'clinical' },
    { id: 'totalSessions', label: 'Total de Sesiones', icon: Activity, category: 'clinical' },
    { id: 'lastSession', label: 'Última Sesión', icon: Calendar, category: 'clinical' },
    { id: 'nextAppointment', label: 'Próxima Cita', icon: Calendar, category: 'clinical' },
    { id: 'emotionalState', label: 'Estado Emocional', icon: Heart, category: 'clinical' },
    { id: 'adherenceRate', label: 'Tasa de Adherencia', icon: Activity, category: 'clinical' },
    { id: 'phq9Score', label: 'Puntuación PHQ-9', icon: FileText, category: 'assessments' },
    { id: 'gad7Score', label: 'Puntuación GAD-7', icon: FileText, category: 'assessments' },
    { id: 'insurance', label: 'Seguro Médico', icon: Shield, category: 'insurance' },
    { id: 'emergencyContact', label: 'Contacto de Emergencia', icon: Phone, category: 'contact' },
    { id: 'createdAt', label: 'Fecha de Registro', icon: Calendar, category: 'basic' },
    { id: 'tags', label: 'Etiquetas', icon: FileText, category: 'clinical' }
  ];

  const fieldCategories = {
    basic: 'Información Básica',
    contact: 'Información de Contacto',
    clinical: 'Información Clínica',
    assessments: 'Evaluaciones',
    insurance: 'Seguro Médico'
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSelectAllInCategory = (category: string) => {
    const categoryFields = availableFields
      .filter(field => field.category === category)
      .map(field => field.id);
    
    const allSelected = categoryFields.every(fieldId => selectedFields.includes(fieldId));
    
    if (allSelected) {
      setSelectedFields(prev => prev.filter(id => !categoryFields.includes(id)));
    } else {
      setSelectedFields(prev => [...new Set([...prev, ...categoryFields])]);
    }
  };

  const formatFieldValue = (patient: ExtendedPatient, fieldId: string): string => {
    switch (fieldId) {
      case 'firstName':
        return patient.firstName;
      case 'lastName':
        return patient.lastName;
      case 'email':
        return patient.email;
      case 'phone':
        return patient.phone;
      case 'age':
        return calculateAge(patient.dateOfBirth).toString();
      case 'gender':
        return patient.gender === 'male' ? 'Masculino' : 
               patient.gender === 'female' ? 'Femenino' : 
               patient.gender === 'other' ? 'Otro' : 'Prefiere no decir';
      case 'address':
        return patient.address ? 
          `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}` : '';
      case 'status':
        return patient.status === 'active' ? 'Activo' : 
               patient.status === 'inactive' ? 'Inactivo' : 
               patient.status === 'discharged' ? 'Alta' : 
               patient.status === 'pending' ? 'Pendiente' : patient.status;
      case 'riskLevel':
        return patient.riskLevel === 'low' ? 'Bajo' :
               patient.riskLevel === 'medium' ? 'Medio' :
               patient.riskLevel === 'high' ? 'Alto' : 'Crítico';
      case 'assignedTherapist':
        return patient.assignedTherapist || '';
      case 'totalSessions':
        return (patient.totalSessions || 0).toString();
      case 'lastSession':
        return patient.lastSession ? patient.lastSession.toLocaleDateString('es-ES') : '';
      case 'nextAppointment':
        return patient.nextAppointment ? patient.nextAppointment.toLocaleDateString('es-ES') : '';
      case 'emotionalState':
        return patient.emotionalState === 'improving' ? 'Mejorando' :
               patient.emotionalState === 'stable' ? 'Estable' :
               patient.emotionalState === 'struggling' ? 'Dificultades' :
               patient.emotionalState === 'crisis' ? 'Crisis' : 'Desconocido';
      case 'adherenceRate':
        return `${patient.adherenceRate || 0}%`;
      case 'phq9Score':
        return patient.assessmentScores?.phq9?.toString() || '';
      case 'gad7Score':
        return patient.assessmentScores?.gad7?.toString() || '';
      case 'insurance':
        return patient.insurance?.provider || '';
      case 'emergencyContact':
        return `${patient.emergencyContact.name} (${patient.emergencyContact.relationship}) - ${patient.emergencyContact.phone}`;
      case 'createdAt':
        return patient.createdAt.toLocaleDateString('es-ES');
      case 'tags':
        return patient.tags?.join(', ') || '';
      default:
        return '';
    }
  };

  const generateCSV = () => {
    const headers = selectedFields.map(fieldId => 
      availableFields.find(field => field.id === fieldId)?.label || fieldId
    );
    
    const rows = patients.map(patient => 
      selectedFields.map(fieldId => formatFieldValue(patient, fieldId))
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (exportFormat) {
        case 'csv':
          generateCSV();
          break;
        case 'excel':
          // In a real implementation, you would use a library like xlsx
          generateCSV(); // Fallback to CSV for now
          break;
        case 'pdf':
          // In a real implementation, you would use a library like jsPDF
          generateCSV(); // Fallback to CSV for now
          break;
      }
      
      setExportComplete(true);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (exportComplete) {
    return (
      <div style={{
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
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
                    style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <CheckCircle size={32} color="white" />
          </motion.div>
          
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Exportación Completada
          </h3>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: '0 0 2rem 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Los datos de {patients.length} pacientes han sido exportados exitosamente.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Cerrar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
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
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              borderRadius: '0.75rem'
            }}>
              <Download size={20} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Exportar Datos de Pacientes
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: '0.25rem 0 0 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                {patients.length} pacientes seleccionados
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <X size={20} color="#6B7280" />
          </motion.button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem'
        }}>
          {/* Export Format Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '1rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Formato de Exportación
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {[
                {
                  id: 'csv',
                  label: 'CSV',
                  description: 'Archivo de valores separados por comas',
                  icon: Table,
                  recommended: true
                },
                {
                  id: 'excel',
                  label: 'Excel',
                  description: 'Hoja de cálculo de Microsoft Excel',
                  icon: FileText,
                  recommended: false
                },
                {
                  id: 'pdf',
                  label: 'PDF',
                  description: 'Documento PDF para impresión',
                  icon: FileText,
                  recommended: false
                }
              ].map((format) => {
                const Icon = format.icon;
                const isSelected = exportFormat === format.id;
                
                return (
                  <motion.div
                    key={format.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExportFormat(format.id as typeof exportFormat)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${isSelected ? '#6366F1' : '#E5E7EB'}`,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      background: isSelected ? '#EEF2FF' : 'white',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {format.recommended && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '8px',
                        padding: '0.25rem 0.5rem',
                        background: '#10B981',
                        color: 'white',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Recomendado
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Icon size={20} color={isSelected ? '#6366F1' : '#6B7280'} />
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: isSelected ? '#6366F1' : '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {format.label}
                      </span>
                    </div>
                    
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {format.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '1rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Campos a Exportar
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(fieldCategories).map(([categoryId, categoryLabel]) => {
                const categoryFields = availableFields.filter(field => field.category === categoryId);
                const selectedInCategory = categoryFields.filter(field => selectedFields.includes(field.id)).length;
                const allSelected = selectedInCategory === categoryFields.length;
                
                return (
                  <div key={categoryId} style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    overflow: 'hidden'
                  }}>
                    <div
                      onClick={() => handleSelectAllInCategory(categoryId)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: '#F9FAFB',
                        cursor: 'pointer',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => handleSelectAllInCategory(categoryId)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#6366F1'
                          }}
                        />
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {categoryLabel}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {selectedInCategory}/{categoryFields.length} seleccionados
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.5rem',
                      padding: '1rem'
                    }}>
                      {categoryFields.map((field) => {
                        const Icon = field.icon;
                        const isSelected = selectedFields.includes(field.id);
                        
                        return (
                          <label
                            key={field.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              background: isSelected ? '#EEF2FF' : 'transparent',
                              transition: 'background-color 0.2s ease',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleFieldToggle(field.id)}
                              style={{
                                width: '14px',
                                height: '14px',
                                accentColor: '#6366F1'
                              }}
                            />
                            <Icon size={14} color={isSelected ? '#6366F1' : '#6B7280'} />
                            <span style={{
                              fontSize: '0.875rem',
                              color: isSelected ? '#6366F1' : '#374151',
                              fontWeight: isSelected ? 500 : 400
                            }}>
                              {field.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderTop: '1px solid #E5E7EB',
          background: '#F9FAFB'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            {selectedFields.length} campos seleccionados • {patients.length} pacientes
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
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
              onClick={handleExport}
              disabled={selectedFields.length === 0 || isExporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: selectedFields.length === 0 || isExporting 
                  ? '#9CA3AF' 
                  : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: selectedFields.length === 0 || isExporting ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {isExporting ? (
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
                  <Download size={16} />
                  Exportar {exportFormat.toUpperCase()}
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
    </div>
  );
}

