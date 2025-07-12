'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Save,
  Lock,
  Mic,
  MicOff,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Stethoscope,
  Brain,
  Target,
  Activity,
  PenTool,
  Search,
  X
} from 'lucide-react';
import { ClinicalNote, NoteTemplate, AIValidation } from '@/types/clinical';
import type { Patient } from '../../../types/patient';

interface NotesEditorProps {
  patient: Patient;
  note?: ClinicalNote;
  onSave: (noteData: Partial<ClinicalNote>) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
  templates: NoteTemplate[];
}

export function NotesEditor({
  patient,
  note,
  onSave,
  onCancel,
  mode,
}: NotesEditorProps) {
  const [noteData, setNoteData] = useState<Partial<ClinicalNote>>({
    patientId: patient.id,
    templateType: 'free-form',
    content: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      freeText: ''
    },
    icdCodes: [],
    riskAssessment: {
      level: 'low',
      factors: [],
      interventions: []
    },
    signed: false,
    locked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Define a local type for UI templates
  type UITemplate = {
    id: string;
    name: string;
    description: string;
    fields: string[];
  };
  const [selectedTemplate, setSelectedTemplate] = useState<UITemplate | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [aiValidation, setAiValidation] = useState<AIValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [showIcdSearch, setShowIcdSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ref for MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Ref for free-form textarea
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const noteTemplates: UITemplate[] = React.useMemo(() => [
    {
      id: 'soap',
      name: 'SOAP',
      description: 'Subjetivo, Objetivo, Evaluación, Plan',
      fields: ['subjective', 'objective', 'assessment', 'plan']
    },
    {
      id: 'dap',
      name: 'DAP',
      description: 'Datos, Evaluación, Plan',
      fields: ['data', 'assessment', 'plan']
    },
    {
      id: 'birp',
      name: 'BIRP',
      description: 'Comportamiento, Intervención, Respuesta, Plan',
      fields: ['behavior', 'intervention', 'response', 'plan']
    },
    {
      id: 'free-form',
      name: 'Nota Libre',
      description: 'Formato libre de documentación',
      fields: ['freeText']
    }
  ], []);

  const icdCodes = [
    { code: 'F41.1', description: 'Trastorno de ansiedad generalizada' },
    { code: 'F32.9', description: 'Episodio depresivo mayor, no especificado' },
    { code: 'F43.1', description: 'Trastorno de estrés postraumático' },
    { code: 'F90.0', description: 'Trastorno por déficit de atención con hiperactividad' },
    { code: 'F50.0', description: 'Anorexia nerviosa' },
    { code: 'F40.1', description: 'Fobias sociales' },
    { code: 'F42.2', description: 'Trastorno obsesivo-compulsivo mixto' }
  ];

  useEffect(() => {
    if (note) {
      setNoteData(note);
      const template = noteTemplates.find(t => t.id === note.templateType);
      setSelectedTemplate(template || null);
    }
  }, [note, noteTemplates]);

  const handleTemplateChange = (templateId: string) => {
    const template = noteTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setNoteData(prev => ({
      ...prev,
      templateType: templateId as ClinicalNote['templateType'],
      content: template?.fields.reduce((acc, field) => ({
        ...acc,
        [field]: prev.content?.[field as keyof typeof prev.content] || ''
      }), {}) || { freeText: prev.content?.freeText || '' }
    }));
  };

  const handleContentChange = (field: string, value: string) => {
    setNoteData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      },
      updatedAt: new Date()
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        // Aquí se integraría con un servicio de transcripción AI
        // Por ahora simulamos la transcripción
        const transcription = "Texto transcrito del audio...";
        
        if (selectedTemplate?.id === 'free-form') {
          handleContentChange('freeText', 
            (noteData.content?.freeText || '') + '\n\n[Transcripción de audio]\n' + transcription
          );
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const validateWithAI = async () => {
    setIsValidating(true);
    try {
      // Simulación de validación AI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const validation: AIValidation = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        noteId: note?.id || '',
        timestamp: new Date(),
        coherenceScore: 0.95,
        flaggedIssues: [],
        isValid: true,
        confidence: 0.92,
        suggestions: [
          {
            type: 'intervention',
            message: 'Considere agregar más detalles sobre la respuesta del paciente a la intervención.',
            field: 'assessment',
            suggestion: 'Agregue detalles sobre la respuesta del paciente a la intervención.',
            confidence: 0.8,
            reasoning: 'La intervención carece de detalles sobre la respuesta del paciente.'
          },
          {
            type: 'clarity',
            message: 'Los síntomas descritos son consistentes con el diagnóstico propuesto.',
            field: 'objective',
            suggestion: 'Mantenga la consistencia entre los síntomas y el diagnóstico.',
            confidence: 0.9,
            reasoning: 'Los síntomas y el diagnóstico coinciden según el análisis AI.'
          }
        ],
        riskFlags: [],
        suggestedIcdCodes: [
        ]
      };
      
      setAiValidation(validation);
    } catch (error) {
      console.error('Error validating with AI:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSign = async () => {
    if (!signatureData.trim()) return;
    
    setNoteData(prev => ({
      ...prev,
      signed: true,
      signedAt: new Date(),
      signedBy: 'current-user-id', // Se obtendría del contexto de autenticación
      signature: {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        therapistId: 'current-user-id', // Se obtendría del contexto de autenticación
        timestamp: new Date(),
        ipAddress: '0.0.0.0', // Reemplazar por la IP real si está disponible
        value: signatureData,
        method: 'password', // O el método real usado
        device: 'browser', // O el dispositivo real si está disponible
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        signatureData: signatureData,
        isValid: true
      },
      locked: true
    }));
    
    setShowSignatureModal(false);
    await handleSave();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(noteData);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addIcdCode = (code: { code: string; description: string; confidence?: number }) => {
    if (!noteData.icdCodes?.some((icd: { code: string; description: string; confidence?: number }) => icd.code === code.code)) {
      setNoteData(prev => ({
        ...prev,
        icdCodes: [...(prev.icdCodes || []), code]
      }));
    }
    setShowIcdSearch(false);
    setSearchTerm('');
  };

  const removeIcdCode = (codeToRemove: string) => {
    setNoteData(prev => ({
      ...prev,
      icdCodes: prev.icdCodes?.filter((icd: { code: string; description: string; confidence?: number }) => icd.code !== codeToRemove) || []
    }));
  };

  const filteredIcdCodes = icdCodes.filter(icd =>
    icd.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTemplateFields = () => {
    if (!selectedTemplate) return null;

    const fieldIcons = {
      subjective: User,
      objective: Eye,
      assessment: Brain,
      plan: Target,
      data: FileText,
      behavior: Activity,
      intervention: Stethoscope,
      response: CheckCircle,
      freeText: Edit
    };

    const fieldLabels = {
      subjective: 'Subjetivo (S)',
      objective: 'Objetivo (O)',
      assessment: 'Evaluación (A)',
      plan: 'Plan (P)',
      data: 'Datos (D)',
      behavior: 'Comportamiento (B)',
      intervention: 'Intervención (I)',
      response: 'Respuesta (R)',
      freeText: 'Nota Libre'
    };

    const fieldPlaceholders = {
      subjective: 'Lo que el paciente reporta: síntomas, preocupaciones, estado emocional...',
      objective: 'Observaciones clínicas: comportamiento, apariencia, pruebas realizadas...',
      assessment: 'Evaluación profesional: diagnóstico, progreso, análisis clínico...',
      plan: 'Plan de tratamiento: intervenciones, tareas, próximos pasos...',
      data: 'Información objetiva recopilada durante la sesión...',
      behavior: 'Comportamientos observados del paciente...',
      intervention: 'Intervenciones realizadas durante la sesión...',
      response: 'Respuesta del paciente a las intervenciones...',
      freeText: 'Documentación libre de la sesión...'
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {selectedTemplate.fields.map((field) => {
          const Icon = fieldIcons[field as keyof typeof fieldIcons] || FileText;
          const label = fieldLabels[field as keyof typeof fieldLabels] || field;
          const placeholder = fieldPlaceholders[field as keyof typeof fieldPlaceholders] || '';

          return (
            <div key={field}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Icon size={16} color="#6366F1" />
                {label}
              </label>
              <textarea
                ref={field === 'freeText' ? textareaRef : undefined}
                value={String(noteData.content?.[field as keyof typeof noteData.content] ?? '')}
                onChange={(e) => handleContentChange(field, e.target.value)}
                disabled={mode === 'view' || noteData.locked === true}
                style={{
                  width: '100%',
                  minHeight: field === 'freeText' ? '300px' : '120px',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  backgroundColor: mode === 'view' || noteData.locked ? '#F9FAFB' : 'white'
                }}
                placeholder={placeholder}
              />
            </div>
          );
        })}
      </div>
    );
  };

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
          maxWidth: '1200px',
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
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {mode === 'create' ? 'Nueva Nota Clínica' : mode === 'edit' ? 'Editar Nota' : 'Ver Nota'}
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: '0.25rem 0 0 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                Paciente: {patient.firstName} {patient.lastName}
              </p>
            </div>
            
            {noteData.locked && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#FEF3C7',
                borderRadius: '0.5rem',
                border: '1px solid #FDE68A'
              }}>
                <Lock size={16} color="#F59E0B" />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#92400E',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Nota Bloqueada
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {mode !== 'view' && !noteData.locked && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: isRecording ? '#EF4444' : '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? 'Detener' : 'Dictar'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={validateWithAI}
                  disabled={isValidating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: isValidating ? '#9CA3AF' : '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: isValidating ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {isValidating ? (
                    <>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Validando...
                    </>
                  ) : (
                    <>
                      <Brain size={14} />
                      Validar AI
                    </>
                  )}
                </motion.button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              style={{
                padding: '0.5rem',
                backgroundColor: '#F3F4F6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="#6B7280" />
            </motion.button>
          </div>
        </div>

        {/* Template Selection */}
        {mode !== 'view' && !noteData.locked && (
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#FAFAFA'
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Plantilla de Nota
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {noteTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemplateChange(template.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: selectedTemplate?.id === template.id ? '#EEF2FF' : 'white',
                    color: selectedTemplate?.id === template.id ? '#4338CA' : '#374151',
                    border: `1px solid ${selectedTemplate?.id === template.id ? '#C7D2FE' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: selectedTemplate?.id === template.id ? 600 : 400,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{template.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{template.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* Main Content */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            {renderTemplateFields()}

            {/* ICD Codes Section */}
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Códigos CIE-11 / DSM-5-TR
                </label>
                {mode !== 'view' && !noteData.locked && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowIcdSearch(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Search size={14} />
                    Agregar Código
                  </motion.button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {noteData.icdCodes?.map((icd: { code: string; description: string; confidence?: number }, index: number) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#F0F9FF',
                    color: '#0C4A6E',
                    borderRadius: '0.5rem',
                    border: '1px solid #E0F2FE',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <span style={{ fontWeight: 600 }}>{icd.code}</span>
                    <span>{icd.description || ''}</span>
                    {mode !== 'view' && !noteData.locked && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeIcdCode(icd.code)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={12} />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            {mode !== 'view' && !noteData.locked && (
              <div style={{ marginTop: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Evaluación de Riesgo
                </label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { value: 'low', label: 'Bajo', color: '#10B981' },
                    { value: 'medium', label: 'Medio', color: '#F59E0B' },
                    { value: 'high', label: 'Alto', color: '#EF4444' }
                  ].map((risk) => (
                    <label key={risk.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `2px solid ${noteData.riskAssessment?.level === risk.value ? risk.color : '#E5E7EB'}`,
                      backgroundColor: noteData.riskAssessment?.level === risk.value ? `${risk.color}10` : 'white',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      <input
                        type="radio"
                        name="riskLevel"
                        value={risk.value}
                        checked={noteData.riskAssessment?.level === risk.value}
                        onChange={(e) => setNoteData(prev => ({
                          ...prev,
                          riskAssessment: {
                            ...prev.riskAssessment!,
                            level: e.target.value as 'low' | 'medium' | 'high'
                          }
                        }))}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: risk.color
                      }} />
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: noteData.riskAssessment?.level === risk.value ? 600 : 400,
                        color: noteData.riskAssessment?.level === risk.value ? risk.color : '#374151'
                      }}>
                        {risk.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{
            width: '300px',
            borderLeft: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            {/* AI Validation Results */}
            {aiValidation && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Validación AI
                </h4>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: aiValidation.isValid ? '#F0FDF4' : '#FEF2F2',
                  borderRadius: '0.5rem',
                  border: `1px solid ${aiValidation.isValid ? '#BBF7D0' : '#FECACA'}`,
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {aiValidation.isValid ? (
                      <CheckCircle size={16} color="#16A34A" />
                    ) : (
                      <AlertTriangle size={16} color="#DC2626" />
                    )}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: aiValidation.isValid ? '#15803D' : '#991B1B',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Confianza: {Math.round(aiValidation.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {aiValidation.suggestions.map((suggestion, index) => (
                  <div key={index} style={{
                    padding: '0.75rem',
                    backgroundColor: suggestion.type === 'intervention' ? '#FEF3C7' : '#EFF6FF',
                    borderRadius: '0.5rem',
                    border: `1px solid ${suggestion.type === 'intervention' ? '#FDE68A' : '#DBEAFE'}`,
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: suggestion.type === 'intervention' ? '#92400E' : '#1E40AF',
                      marginBottom: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {suggestion.type === 'intervention' ? 'Sugerencia' : 'Consistencia'}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: suggestion.type === 'intervention' ? '#78350F' : '#1E3A8A',
                      lineHeight: '1.4',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {suggestion.message}
                    </div>
                  </div>
                ))}
                {Array.isArray(aiValidation.suggestedIcdCodes) &&
                  aiValidation.suggestedIcdCodes.length > 0 &&
                  aiValidation.suggestedIcdCodes.every(
                    (item) =>
                      typeof item === 'object' &&
                      item !== null &&
                      'code' in item &&
                      'description' in item &&
                      'confidence' in item
                  ) ? (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Códigos Sugeridos:
                    </div>
                    {(aiValidation.suggestedIcdCodes as { code: string; description: string; confidence: number }[]).map((codeObj, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addIcdCode({ code: codeObj.code, description: codeObj.description })}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.5rem',
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          marginBottom: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#374151' }}>{codeObj.code}</div>
                        <div style={{ color: '#6B7280' }}>{codeObj.description}</div>
                        <div style={{ color: '#10B981', fontSize: '0.625rem' }}>
                          Confianza: {Math.round(codeObj.confidence * 100)}%
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* Note Info */}
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Información de la Nota
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Calendar size={14} />
                  <span>Creada: {noteData.createdAt?.toLocaleDateString('es-ES')}</span>
                </div>
                {noteData.updatedAt && noteData.updatedAt !== noteData.createdAt && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <Clock size={14} />
                    <span>Modificada: {noteData.updatedAt.toLocaleDateString('es-ES')}</span>
                  </div>
                )}
                {noteData.signed && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#10B981',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <PenTool size={14} />
                    <span>Firmada: {noteData.signedAt?.toLocaleDateString('es-ES')}</span>
                  </div>
                )}
              </div>
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
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {mode !== 'view' && !noteData.locked && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSaving ? '#9CA3AF' : '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {isSaving ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Guardar Borrador
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSignatureModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
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
                  <PenTool size={16} />
                  Firmar y Bloquear
                </motion.button>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
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
            {mode === 'view' ? 'Cerrar' : 'Cancelar'}
          </motion.button>
        </div>
      </motion.div>

      {/* ICD Search Modal */}
      <AnimatePresence>
        {showIcdSearch && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '600px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Buscar Códigos CIE-11
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowIcdSearch(false)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#6B7280" />
                </motion.button>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  marginBottom: '1rem'
                }}
                placeholder="Buscar por código o descripción..."
              />

              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {filteredIcdCodes.map((code, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addIcdCode(code)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      {code.code}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6B7280'
                    }}>
                      {code.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignatureModal && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <PenTool size={24} color="#6366F1" />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Firma Electrónica
                </h3>
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Al firmar esta nota, confirma que la información es precisa y completa.
                La nota será bloqueada para edición.
              </p>

              <input
                type="password"
                value={signatureData}
                onChange={(e) => setSignatureData(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  marginBottom: '1.5rem'
                }}
                placeholder="Ingrese su contraseña para firmar"
              />

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSignatureModal(false)}
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
                  onClick={handleSign}
                  disabled={!signatureData.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: !signatureData.trim() ? '#9CA3AF' : '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: !signatureData.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Firmar Nota
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
