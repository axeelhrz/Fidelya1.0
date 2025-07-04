'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  FileText, 
  AlertTriangle,
  Brain,
  Trash2
} from 'lucide-react';
import { ClinicalNote, CreateNoteData, UpdateNoteData, NoteTemplateType, DiagnosisCode, RiskAssessment } from '@/types/notes';
import { useDiagnosisSuggestions } from '@/hooks/useAIValidation';

interface NoteModalProps {
  mode: 'create' | 'edit' | 'view';
  note?: ClinicalNote | null;
  onClose: () => void;
  onSave: (data: CreateNoteData | UpdateNoteData) => void;
}

export default function NoteModal({ mode, note, onClose, onSave }: NoteModalProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    sessionId: '',
    templateType: 'soap' as NoteTemplateType,
    content: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      data: '',
      freeText: '',
      riskAssessment: {
        suicidalIdeation: false,
        homicidalIdeation: false,
        selfHarm: false,
        substanceAbuse: false,
        psychosis: false,
        domesticViolence: false,
        childAbuse: false,
        riskLevel: 'low' as RiskAssessment['riskLevel'],
        interventions: [] as string[],
        followUpRequired: false,
        emergencyContacts: false,
        notes: ''
      }
    },
    diagnosis: {
      primary: null as DiagnosisCode | null,
      secondary: [] as DiagnosisCode[]
    }
  });

  const [loading, setLoading] = useState(false);
  const [showDiagnosisSuggestions, setShowDiagnosisSuggestions] = useState(false);
  const { suggestions, getSuggestions } = useDiagnosisSuggestions();

  useEffect(() => {
    if (note && (mode === 'edit' || mode === 'view')) {
      setFormData({
        patientId: note.patientId,
        patientName: note.patientName,
        sessionId: note.sessionId || '',
        templateType: note.templateType,
        content: {
          subjective: note.content?.subjective || '',
          objective: note.content?.objective || '',
          assessment: note.content?.assessment || '',
          plan: note.content?.plan || '',
          data: note.content?.data || '',
          freeText: note.content?.freeText || '',
          riskAssessment: note.content?.riskAssessment ? {
            ...note.content.riskAssessment,
            notes: note.content.riskAssessment.notes || ''
          } : {
            suicidalIdeation: false,
            homicidalIdeation: false,
            selfHarm: false,
            substanceAbuse: false,
            psychosis: false,
            domesticViolence: false,
            childAbuse: false,
            riskLevel: 'low' as RiskAssessment['riskLevel'],
            interventions: [] as string[],
            followUpRequired: false,
            emergencyContacts: false,
            notes: ''
          }
        },
        diagnosis: {
          primary: note.diagnosis?.primary ?? null,
          secondary: note.diagnosis?.secondary ?? []
        }
      });
    }
  }, [note, mode]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    if (field.startsWith('content.')) {
      const contentField = field.replace('content.', '');
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value
        }
      }));
    } else if (field.startsWith('content.riskAssessment.')) {
      const riskField = field.replace('content.riskAssessment.', '');
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          riskAssessment: {
            ...prev.content.riskAssessment,
            [riskField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const createData: CreateNoteData = {
          patientId: formData.patientId,
          sessionId: formData.sessionId || undefined,
          templateType: formData.templateType,
          content: formData.content,
          diagnosis: formData.diagnosis.primary ? {
            primary: formData.diagnosis.primary,
            secondary: formData.diagnosis.secondary
          } : undefined
        };
        onSave(createData);
      } else if (mode === 'edit') {
        const updateData: UpdateNoteData = {
          content: formData.content,
          diagnosis: formData.diagnosis.primary ? {
            primary: formData.diagnosis.primary,
            secondary: formData.diagnosis.secondary
          } : undefined
        };
        onSave(updateData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetDiagnosisSuggestions = async () => {
    const content = [
      formData.content.subjective,
      formData.content.objective,
      formData.content.assessment,
      formData.content.data,
      formData.content.freeText
    ].filter(Boolean).join(' ');

    if (content.trim()) {
      await getSuggestions();
      setShowDiagnosisSuggestions(true);
    }
  };

  const addDiagnosis = (diagnosis: DiagnosisCode, isPrimary: boolean = false) => {
    if (isPrimary) {
      setFormData(prev => ({
        ...prev,
        diagnosis: {
          ...prev.diagnosis,
          primary: diagnosis
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        diagnosis: {
          ...prev.diagnosis,
          secondary: [...prev.diagnosis.secondary, diagnosis]
        }
      }));
    }
    setShowDiagnosisSuggestions(false);
  };

  const removeDiagnosis = (index: number, isPrimary: boolean = false) => {
    if (isPrimary) {
      setFormData(prev => ({
        ...prev,
        diagnosis: {
          ...prev.diagnosis,
          primary: null
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        diagnosis: {
          ...prev.diagnosis,
          secondary: prev.diagnosis.secondary.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const renderTemplateFields = () => {
    const isReadOnly = mode === 'view';

    if (formData.templateType === 'soap') {
      return (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Subjetivo (S) *
            </label>
            <textarea
              value={formData.content.subjective}
              onChange={(e) => handleInputChange('content.subjective', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Información reportada por el paciente, síntomas subjetivos..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Objetivo (O) *
            </label>
            <textarea
              value={formData.content.objective}
              onChange={(e) => handleInputChange('content.objective', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Observaciones clínicas, datos objetivos, examen mental..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Evaluación (A) *
            </label>
            <textarea
              value={formData.content.assessment}
              onChange={(e) => handleInputChange('content.assessment', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Análisis clínico, diagnóstico, interpretación..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Plan (P) *
            </label>
            <textarea
              value={formData.content.plan}
              onChange={(e) => handleInputChange('content.plan', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Plan de tratamiento, intervenciones, próximos pasos..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>
        </div>
      );
    }

    if (formData.templateType === 'dap') {
      return (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Datos (D) *
            </label>
            <textarea
              value={formData.content.data}
              onChange={(e) => handleInputChange('content.data', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Datos objetivos y subjetivos recopilados..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Evaluación (A) *
            </label>
            <textarea
              value={formData.content.assessment}
              onChange={(e) => handleInputChange('content.assessment', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Análisis e interpretación de los datos..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Plan (P) *
            </label>
            <textarea
              value={formData.content.plan}
              onChange={(e) => handleInputChange('content.plan', e.target.value)}
              readOnly={isReadOnly}
              placeholder="Plan de acción y próximos pasos..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                background: isReadOnly ? '#F9FAFB' : 'white'
              }}
            />
          </div>
        </div>
      );
    }

    if (formData.templateType === 'free') {
      return (
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Contenido de la Nota *
          </label>
          <textarea
            value={formData.content.freeText}
            onChange={(e) => handleInputChange('content.freeText', e.target.value)}
            readOnly={isReadOnly}
            placeholder="Escribe el contenido de la nota en formato libre..."
            style={{
              width: '100%',
              minHeight: '300px',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              background: isReadOnly ? '#F9FAFB' : 'white'
            }}
          />
        </div>
      );
    }

    return null;
  };

  const renderRiskAssessment = () => {
    const isReadOnly = mode === 'view';

    return (
      <div style={{
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '0.75rem',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <AlertTriangle size={20} color="#EF4444" />
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#DC2626',
            margin: 0
          }}>
            Evaluación de Riesgo
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {[
            { key: 'suicidalIdeation', label: 'Ideación suicida' },
            { key: 'homicidalIdeation', label: 'Ideación homicida' },
            { key: 'selfHarm', label: 'Autolesión' },
            { key: 'substanceAbuse', label: 'Abuso de sustancias' },
            { key: 'psychosis', label: 'Psicosis' },
            { key: 'domesticViolence', label: 'Violencia doméstica' },
            { key: 'childAbuse', label: 'Abuso infantil' }
          ].map(({ key, label }) => (
            <label key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#374151',
              cursor: isReadOnly ? 'default' : 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.content.riskAssessment[key as keyof typeof formData.content.riskAssessment] as boolean}
                onChange={(e) => handleInputChange(`content.riskAssessment.${key}`, e.target.checked)}
                disabled={isReadOnly}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: isReadOnly ? 'default' : 'pointer'
                }}
              />
              {label}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Nivel de Riesgo
          </label>
          <select
            value={formData.content.riskAssessment.riskLevel}
            onChange={(e) => handleInputChange('content.riskAssessment.riskLevel', e.target.value)}
            disabled={isReadOnly}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              background: isReadOnly ? '#F9FAFB' : 'white'
            }}
          >
            <option value="low">Bajo</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
            <option value="critical">Crítico</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#374151',
            cursor: isReadOnly ? 'default' : 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.content.riskAssessment.followUpRequired}
              onChange={(e) => handleInputChange('content.riskAssessment.followUpRequired', e.target.checked)}
              disabled={isReadOnly}
              style={{
                width: '16px',
                height: '16px',
                cursor: isReadOnly ? 'default' : 'pointer'
              }}
            />
            Requiere seguimiento inmediato
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#374151',
            cursor: isReadOnly ? 'default' : 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.content.riskAssessment.emergencyContacts}
              onChange={(e) => handleInputChange('content.riskAssessment.emergencyContacts', e.target.checked)}
              disabled={isReadOnly}
              style={{
                width: '16px',
                height: '16px',
                cursor: isReadOnly ? 'default' : 'pointer'
              }}
            />
            Contactos de emergencia notificados
          </label>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Notas adicionales sobre el riesgo
          </label>
          <textarea
            value={formData.content.riskAssessment.notes}
            onChange={(e) => handleInputChange('content.riskAssessment.notes', e.target.value)}
            readOnly={isReadOnly}
            placeholder="Detalles adicionales sobre la evaluación de riesgo..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              background: isReadOnly ? '#F9FAFB' : 'white'
            }}
          />
        </div>
      </div>
    );
  };

  const renderDiagnosisSection = () => {
    const isReadOnly = mode === 'view';

    return (
      <div style={{
        background: '#F0F9FF',
        border: '1px solid #BAE6FD',
        borderRadius: '0.75rem',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#0369A1',
            margin: 0
          }}>
            Diagnóstico
          </h3>
          
          {!isReadOnly && (
            <motion.button
              onClick={handleGetDiagnosisSuggestions}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Brain size={14} />
              Sugerir CIE-11 / DSM-5-TR
            </motion.button>
          )}
        </div>

        {/* Diagnóstico principal */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Diagnóstico Principal
          </label>
          
          {formData.diagnosis.primary ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                  {formData.diagnosis.primary.code} - {formData.diagnosis.primary.description}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  {formData.diagnosis.primary.system}
                  {formData.diagnosis.primary.confidence && (
                    <span> • Confianza: {formData.diagnosis.primary.confidence}%</span>
                  )}
                </div>
              </div>
              
              {!isReadOnly && (
                <motion.button
                  onClick={() => removeDiagnosis(0, true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    padding: '0.25rem',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} color="#EF4444" />
                </motion.button>
              )}
            </div>
          ) : (
            <div style={{
              padding: '1rem',
              background: 'white',
              border: '2px dashed #D1D5DB',
              borderRadius: '0.5rem',
              textAlign: 'center',
              color: '#6B7280',
              fontSize: '0.875rem'
            }}>
              {isReadOnly ? 'No se ha especificado un diagnóstico principal' : 'Haz clic en "Sugerir" para obtener recomendaciones de IA'}
            </div>
          )}
        </div>

        {/* Diagnósticos secundarios */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Diagnósticos Secundarios
          </label>
          
          {formData.diagnosis.secondary.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {formData.diagnosis.secondary.map((diagnosis, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                      {diagnosis.code} - {diagnosis.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {diagnosis.system}
                      {diagnosis.confidence && (
                        <span> • Confianza: {diagnosis.confidence}%</span>
                      )}
                    </div>
                  </div>
                  
                  {!isReadOnly && (
                    <motion.button
                      onClick={() => removeDiagnosis(index, false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        padding: '0.25rem',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '1rem',
              background: 'white',
              border: '2px dashed #D1D5DB',
              borderRadius: '0.5rem',
              textAlign: 'center',
              color: '#6B7280',
              fontSize: '0.875rem'
            }}>
              {isReadOnly ? 'No hay diagnósticos secundarios' : 'Los diagnósticos secundarios aparecerán aquí'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={20} color="white" />
              </div>
              
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0
                }}>
                  {mode === 'create' ? 'Nueva Nota Clínica' : 
                   mode === 'edit' ? 'Editar Nota Clínica' : 'Ver Nota Clínica'}
                </h2>
                {formData.patientName && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    margin: '0.25rem 0 0 0'
                  }}>
                    Paciente: {formData.patientName}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: '0.5rem',
                background: '#F3F4F6',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} color="#6B7280" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Información básica */}
            {mode === 'create' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Paciente *
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Buscar paciente..."
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Tipo de Plantilla *
                  </label>
                  <select
                    value={formData.templateType}
                    onChange={(e) => handleInputChange('templateType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="soap">SOAP</option>
                    <option value="dap">DAP</option>
                    <option value="free">Libre</option>
                  </select>
                </div>
              </div>
            )}

            {/* Campos de la plantilla */}
            {renderTemplateFields()}

            {/* Evaluación de riesgo */}
            {renderRiskAssessment()}

            {/* Diagnóstico */}
            {renderDiagnosisSection()}
          </div>
        </div>

        {/* Footer */}
        {mode !== 'view' && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280'
            }}>
              * Campos obligatorios
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </motion.button>

              <motion.button
                onClick={handleSave}
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <Save size={16} />
                )}
                {loading ? 'Guardando...' : 'Guardar Nota'}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal de sugerencias de diagnóstico */}
      <AnimatePresence>
        {showDiagnosisSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowDiagnosisSuggestions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0
                  }}>
                    Sugerencias de Diagnóstico IA
                  </h3>
                  <motion.button
                    onClick={() => setShowDiagnosisSuggestions(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      padding: '0.5rem',
                      background: '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} color="#6B7280" />
                  </motion.button>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {suggestions.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#3B82F6';
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>
                              {suggestion.code} - {suggestion.description}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginBottom: '0.5rem'
                            }}>
                              {suggestion.system} • Confianza: {suggestion.confidence}%
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <motion.button
                              onClick={() => addDiagnosis(suggestion, true)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Principal
                            </motion.button>
                            <motion.button
                              onClick={() => addDiagnosis(suggestion, false)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: 'white',
                                color: '#3B82F6',
                                border: '1px solid #3B82F6',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Secundario
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6B7280'
                  }}>
                    <Brain size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem' }} />
                    <p>No se encontraron sugerencias de diagnóstico.</p>
                    <p style={{ fontSize: '0.875rem' }}>
                      Asegúrate de completar el contenido de la nota antes de solicitar sugerencias.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}