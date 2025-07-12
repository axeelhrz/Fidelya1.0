'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Info,
  RefreshCw,
  TrendingUp,
  Target,
  Lightbulb,
  Shield,
  Eye
} from 'lucide-react';
import { ClinicalNote, AIValidationResult } from '@/types/notes';

interface AIValidationPanelProps {
  note: ClinicalNote;
  onClose: () => void;
}

export default function AIValidationPanel({ note, onClose }: AIValidationPanelProps) {
  const [validationResult, setValidationResult] = useState<AIValidationResult | null>(note.aiValidation || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'flags' | 'diagnosis'>('overview');

  const performValidation = useCallback(async () => {
    setLoading(true);
    try {
      // Simular llamada a API de validación IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Datos simulados de validación
      const mockValidation: AIValidationResult = {
        id: `validation_${Date.now()}`,
        noteId: note.id,
        timestamp: new Date(),
        coherenceScore: Math.floor(Math.random() * 30) + 70, // 70-100
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100
        isValid: true,
        suggestions: [
          {
            type: 'clarity',
            field: 'subjective',
            suggestion: 'Considere agregar más detalles específicos sobre la duración de los síntomas reportados.',
            confidence: 85,
            reasoning: 'La información temporal ayuda a establecer patrones y evolución del cuadro clínico.',
            priority: 'medium'
          },
          {
            type: 'diagnosis',
            suggestion: 'Evaluar la posibilidad de un diagnóstico diferencial con trastorno de ansiedad generalizada.',
            confidence: 78,
            reasoning: 'Los síntomas descritos podrían ser compatibles con múltiples diagnósticos.',
            priority: 'high'
          },
          {
            type: 'intervention',
            field: 'plan',
            suggestion: 'Incluir técnicas de relajación específicas en el plan de tratamiento.',
            confidence: 92,
            reasoning: 'Las técnicas de relajación han mostrado eficacia en casos similares.',
            priority: 'medium'
          }
        ],
        flaggedIssues: [
          {
            type: 'missing-info',
            severity: 'medium',
            description: 'Falta información sobre antecedentes familiares de trastornos mentales.',
            recommendation: 'Incluir exploración de antecedentes familiares en próximas sesiones.',
            field: 'assessment'
          },
          {
            type: 'risk-indicator',
            severity: 'low',
            description: 'Se detectaron indicadores menores de riesgo que requieren seguimiento.',
            recommendation: 'Monitorear evolución y realizar evaluación de riesgo en próxima sesión.'
          }
        ],
        riskFlags: ['sleep-disturbance', 'social-isolation'],
        suggestedDiagnoses: [
          {
            code: 'F41.1',
            description: 'Trastorno de ansiedad generalizada',
            system: 'ICD-11',
            confidence: 78
          },
          {
            code: 'F32.1',
            description: 'Episodio depresivo moderado',
            system: 'ICD-11',
            confidence: 65
          }
        ]
      };

      setValidationResult(mockValidation);
    } catch (error) {
      console.error('Error en validación IA:', error);
    } finally {
      setLoading(false);
    }
  }, [note.id]);

  useEffect(() => {
    if (!validationResult) {
      performValidation();
    }
  }, [validationResult, performValidation]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F97316';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F97316';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#84CC16';
    if (score >= 70) return '#EAB308';
    if (score >= 60) return '#F97316';
    return '#EF4444';
  };

  const renderOverview = () => {
    if (!validationResult) return null;

    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Métricas principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(${getScoreColor(validationResult.coherenceScore)} ${validationResult.coherenceScore * 3.6}deg, #F3F4F6 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              position: 'relative'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: getScoreColor(validationResult.coherenceScore)
              }}>
                {validationResult.coherenceScore}%
              </div>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
              Coherencia
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
              Consistencia del contenido
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(${getScoreColor(validationResult.confidence)} ${validationResult.confidence * 3.6}deg, #F3F4F6 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              position: 'relative'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: getScoreColor(validationResult.confidence)
              }}>
                {validationResult.confidence}%
              </div>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
              Confianza IA
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
              Nivel de certeza del análisis
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: validationResult.isValid ? '#10B981' : '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              {validationResult.isValid ? (
                <CheckCircle size={24} color="white" />
              ) : (
                <AlertTriangle size={24} color="white" />
              )}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
              Estado
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
              {validationResult.isValid ? 'Válida' : 'Requiere revisión'}
            </p>
          </div>
        </div>

        {/* Resumen de hallazgos */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingUp size={20} color="#3B82F6" />
            Resumen de Hallazgos
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3B82F6' }}>
                {validationResult.suggestions.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Sugerencias</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F97316' }}>
                {validationResult.flaggedIssues.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Alertas</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>
                {validationResult.suggestedDiagnoses.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Diagnósticos</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#EF4444' }}>
                {validationResult.riskFlags.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Riesgos</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuggestions = () => {
    if (!validationResult?.suggestions.length) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6B7280'
        }}>
          <Lightbulb size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem' }} />
          <p>No hay sugerencias disponibles para esta nota.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        {validationResult.suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB',
              borderLeft: `4px solid ${getPriorityColor(suggestion.priority)}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: getPriorityColor(suggestion.priority),
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {suggestion.priority}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: '#F3F4F6',
                    color: '#374151',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {suggestion.type}
                  </span>
                  {suggestion.field && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#6B7280'
                    }}>
                      • {suggestion.field}
                    </span>
                  )}
                </div>
                
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Sugerencia
                </h4>
                <p style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  lineHeight: 1.5
                }}>
                  {suggestion.suggestion}
                </p>
                
                <div style={{
                  padding: '0.75rem',
                  background: '#F8FAFC',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid #3B82F6'
                }}>
                  <h5 style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    Justificación
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    lineHeight: 1.4
                  }}>
                    {suggestion.reasoning}
                  </p>
                </div>
              </div>
              
              <div style={{
                marginLeft: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: `conic-gradient(#3B82F6 ${suggestion.confidence * 3.6}deg, #F3F4F6 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#3B82F6'
                  }}>
                    {suggestion.confidence}%
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  Confianza
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderFlags = () => {
    if (!validationResult?.flaggedIssues.length) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6B7280'
        }}>
          <Shield size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem' }} />
          <p>No se detectaron problemas en esta nota.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        {validationResult.flaggedIssues.map((flag, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB',
              borderLeft: `4px solid ${getSeverityColor(flag.severity)}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                padding: '0.5rem',
                background: `${getSeverityColor(flag.severity)}20`,
                borderRadius: '0.5rem'
              }}>
                {flag.severity === 'critical' && <AlertTriangle size={20} color={getSeverityColor(flag.severity)} />}
                {flag.severity === 'high' && <AlertCircle size={20} color={getSeverityColor(flag.severity)} />}
                {flag.severity === 'medium' && <Info size={20} color={getSeverityColor(flag.severity)} />}
                {flag.severity === 'low' && <Eye size={20} color={getSeverityColor(flag.severity)} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: getSeverityColor(flag.severity),
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {flag.severity}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: '#F3F4F6',
                    color: '#374151',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {flag.type}
                  </span>
                  {flag.field && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#6B7280'
                    }}>
                      • {flag.field}
                    </span>
                  )}
                </div>
                
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  {flag.description}
                </h4>
                
                <div style={{
                  padding: '0.75rem',
                  background: '#F0F9FF',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid #3B82F6'
                }}>
                  <h5 style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    Recomendación
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    lineHeight: 1.4
                  }}>
                    {flag.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderDiagnosis = () => {
    if (!validationResult?.suggestedDiagnoses.length) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6B7280'
        }}>
          <Target size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem' }} />
          <p>No hay sugerencias de diagnóstico disponibles.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        {validationResult.suggestedDiagnoses.map((diagnosis, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  {diagnosis.code} - {diagnosis.description}
                </h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: '#F0F9FF',
                    color: '#3B82F6',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {diagnosis.system}
                  </span>
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                marginLeft: '1rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `conic-gradient(${getScoreColor(diagnosis.confidence || 0)} ${(diagnosis.confidence || 0) * 3.6}deg, #F3F4F6 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: getScoreColor(diagnosis.confidence || 0)
                  }}>
                    {diagnosis.confidence}%
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  Confianza
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #E5E7EB',
                borderTop: '4px solid #8B5CF6',
                borderRadius: '50%',
                margin: '0 auto 1rem'
              }}
            />
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Analizando nota con IA...
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'suggestions':
        return renderSuggestions();
      case 'flags':
        return renderFlags();
      case 'diagnosis':
        return renderDiagnosis();
      default:
        return renderOverview();
    }
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
          maxWidth: '1000px',
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
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Brain size={20} color="white" />
              </div>
              
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0
                }}>
                  Validación IA
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: '0.25rem 0 0 0'
                }}>
                  Paciente: {note.patientName} • {new Date(note.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!loading && (
                <motion.button
                  onClick={performValidation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#8B5CF6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                  Revalidar
                </motion.button>
              )}

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
        </div>

        {/* Tabs */}
        <div style={{
          padding: '0 1.5rem',
          borderBottom: '1px solid #E5E7EB',
          background: '#F9FAFB'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { key: 'overview', label: 'Resumen', icon: TrendingUp },
              { key: 'suggestions', label: 'Sugerencias', icon: Lightbulb },
              { key: 'flags', label: 'Alertas', icon: Shield },
              { key: 'diagnosis', label: 'Diagnósticos', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key as 'overview' | 'suggestions' | 'flags' | 'diagnosis')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: activeTab === key ? 'white' : 'transparent',
                  color: activeTab === key ? '#8B5CF6' : '#6B7280',
                  border: 'none',
                  borderBottom: activeTab === key ? '2px solid #8B5CF6' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {label}
                {validationResult && (
                  <span style={{
                    padding: '0.125rem 0.375rem',
                    background: activeTab === key ? '#8B5CF6' : '#E5E7EB',
                    color: activeTab === key ? 'white' : '#6B7280',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {key === 'suggestions' && validationResult.suggestions.length}
                    {key === 'flags' && validationResult.flaggedIssues.length}
                    {key === 'diagnosis' && validationResult.suggestedDiagnoses.length}
                    {key === 'overview' && '✓'}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1.5rem',
          background: '#F9FAFB'
        }}>
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}
