'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  FileText,
  AlertTriangle,
  Shield,
  Edit,
  Download,
  Clock,
  Users,
  Pill,
  Stethoscope,
  TrendingUp,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';

interface PatientDetailsModalProps {
  patient: ExtendedPatient;
  onClose: () => void;
  onEdit: () => void;
}

export function PatientDetailsModal({ patient, onClose, onEdit }: PatientDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'sessions' | 'assessments' | 'documents'>('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic-info']);

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatLastSession = (lastSession?: Date) => {
    if (!lastSession) return 'Sin sesiones';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastSession.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return lastSession.toLocaleDateString('es-ES');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#7C2D12';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'discharged': return '#2563EB';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getEmotionalStateColor = (state?: string) => {
    switch (state) {
      case 'improving': return '#10B981';
      case 'stable': return '#6366F1';
      case 'struggling': return '#F59E0B';
      case 'crisis': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: User },
    { id: 'medical', label: 'Información Médica', icon: Stethoscope },
    { id: 'sessions', label: 'Historial de Sesiones', icon: Activity },
    { id: 'assessments', label: 'Evaluaciones', icon: FileText },
    { id: 'documents', label: 'Documentos', icon: Download }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Basic Information */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleSection('basic-info')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: '#F9FAFB',
                  cursor: 'pointer',
                  borderBottom: expandedSections.includes('basic-info') ? '1px solid #E5E7EB' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <User size={18} color="#6366F1" />
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Información Personal
                  </h3>
                </div>
                {expandedSections.includes('basic-info') ? (
                  <ChevronDown size={18} color="#6B7280" />
                ) : (
                  <ChevronRight size={18} color="#6B7280" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes('basic-info') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                      }}>
                        <div>
                          <label style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Nombre Completo
                          </label>
                          <p style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            margin: '0.25rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {patient.firstName} {patient.lastName}
                          </p>
                          {patient.pronouns && (
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#6B7280',
                              margin: '0.125rem 0 0 0',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Pronombres: {patient.pronouns}
                            </p>
                          )}
                        </div>

                        <div>
                          <label style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Edad y Género
                          </label>
                          <p style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            margin: '0.25rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {calculateAge(patient.dateOfBirth)} años
                          </p>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            margin: '0.125rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {patient.gender === 'male' ? 'Masculino' : 
                             patient.gender === 'female' ? 'Femenino' : 
                             patient.gender === 'other' ? 'Otro' : 'Prefiere no decir'}
                          </p>
                        </div>

                        <div>
                          <label style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Identificación
                          </label>
                          <p style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            margin: '0.25rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {patient.identification?.number}
                          </p>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            margin: '0.125rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {patient.identification?.type?.toUpperCase()}
                          </p>
                        </div>

                        <div>
                          <label style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Estado
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '1rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: patient.status === 'active' ? '#ECFDF5' : 
                                             patient.status === 'inactive' ? '#F3F4F6' : 
                                             patient.status === 'discharged' ? '#EFF6FF' : '#FFFBEB',
                              color: getStatusColor(patient.status),
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {patient.status === 'active' ? 'Activo' : 
                               patient.status === 'inactive' ? 'Inactivo' : 
                               patient.status === 'discharged' ? 'Alta' : 
                               patient.status === 'pending' ? 'Pendiente' : patient.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Information */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleSection('contact-info')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: '#F9FAFB',
                  cursor: 'pointer',
                  borderBottom: expandedSections.includes('contact-info') ? '1px solid #E5E7EB' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} color="#10B981" />
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Información de Contacto
                  </h3>
                </div>
                {expandedSections.includes('contact-info') ? (
                  <ChevronDown size={18} color="#6B7280" />
                ) : (
                  <ChevronRight size={18} color="#6B7280" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes('contact-info') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Mail size={16} color="#6B7280" />
                            <label style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Email
                            </label>
                          </div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#1F2937',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {patient.email}
                          </p>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Phone size={16} color="#6B7280" />
                            <label style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Teléfono
                            </label>
                          </div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#1F2937',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {patient.phone}
                          </p>
                        </div>

                        {patient.address && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <MapPin size={16} color="#6B7280" />
                              <label style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Dirección
                              </label>
                            </div>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#1F2937',
                              margin: 0,
                              lineHeight: 1.5,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {patient.address.street}<br />
                              {patient.address.city}, {patient.address.state} {patient.address.zipCode}<br />
                              {patient.address.country}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clinical Summary */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleSection('clinical-summary')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: '#F9FAFB',
                  cursor: 'pointer',
                  borderBottom: expandedSections.includes('clinical-summary') ? '1px solid #E5E7EB' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={18} color="#F59E0B" />
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Resumen Clínico
                  </h3>
                </div>
                {expandedSections.includes('clinical-summary') ? (
                  <ChevronDown size={18} color="#6B7280" />
                ) : (
                  <ChevronRight size={18} color="#6B7280" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes('clinical-summary') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{
                          padding: '1rem',
                          background: '#FEF2F2',
                          borderRadius: '0.75rem',
                          border: '1px solid #FECACA'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <AlertTriangle size={16} color={getRiskColor(patient.riskLevel)} />
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Nivel de Riesgo
                            </span>
                          </div>
                          <p style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: getRiskColor(patient.riskLevel),
                            margin: 0,
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {patient.riskLevel === 'low' ? 'Bajo' :
                             patient.riskLevel === 'medium' ? 'Medio' :
                             patient.riskLevel === 'high' ? 'Alto' : 'Crítico'}
                          </p>
                        </div>

                        <div style={{
                          padding: '1rem',
                          background: '#F0F9FF',
                          borderRadius: '0.75rem',
                          border: '1px solid #E0F2FE'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Activity size={16} color="#0369A1" />
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Total Sesiones
                            </span>
                          </div>
                          <p style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#0369A1',
                            margin: 0,
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {patient.totalSessions || 0}
                          </p>
                        </div>

                        <div style={{
                          padding: '1rem',
                          background: '#ECFDF5',
                          borderRadius: '0.75rem',
                          border: '1px solid #D1FAE5'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingUp size={16} color="#059669" />
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Adherencia
                            </span>
                          </div>
                          <p style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#059669',
                            margin: 0,
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {patient.adherenceRate || 0}%
                          </p>
                        </div>

                        {patient.emotionalState && (
                          <div style={{
                            padding: '1rem',
                            background: '#F3E8FF',
                            borderRadius: '0.75rem',
                            border: '1px solid #E9D5FF'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <Heart size={16} color={getEmotionalStateColor(patient.emotionalState)} />
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Estado Emocional
                              </span>
                            </div>
                            <p style={{
                              fontSize: '1.125rem',
                              fontWeight: 700,
                              color: getEmotionalStateColor(patient.emotionalState),
                              margin: 0,
                              fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                              {patient.emotionalState === 'improving' ? 'Mejorando' :
                               patient.emotionalState === 'stable' ? 'Estable' :
                               patient.emotionalState === 'struggling' ? 'Dificultades' :
                               patient.emotionalState === 'crisis' ? 'Crisis' : 'Desconocido'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Assessment Scores */}
                      {(patient.assessmentScores?.phq9 || patient.assessmentScores?.gad7) && (
                        <div>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '1rem',
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            Puntuaciones de Evaluación
                          </h4>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '1rem'
                          }}>
                            {patient.assessmentScores.phq9 && (
                              <div style={{
                                padding: '1rem',
                                background: '#FEF2F2',
                                borderRadius: '0.75rem',
                                border: '1px solid #FECACA',
                                textAlign: 'center'
                              }}>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#6B7280',
                                  marginBottom: '0.5rem',
                                  fontFamily: 'Inter, sans-serif'
                                }}>
                                  PHQ-9
                                </div>
                                <div style={{
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                  color: '#EF4444',
                                  fontFamily: 'Space Grotesk, sans-serif'
                                }}>
                                  {patient.assessmentScores.phq9}
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#6B7280',
                                  fontFamily: 'Inter, sans-serif'
                                }}>
                                  /27
                                </div>
                              </div>
                            )}
                            
                            {patient.assessmentScores.gad7 && (
                              <div style={{
                                padding: '1rem',
                                background: '#FFFBEB',
                                borderRadius: '0.75rem',
                                border: '1px solid #FDE68A',
                                textAlign: 'center'
                              }}>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#6B7280',
                                  marginBottom: '0.5rem',
                                  fontFamily: 'Inter, sans-serif'
                                }}>
                                  GAD-7
                                </div>
                                <div style={{
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                  color: '#F59E0B',
                                  fontFamily: 'Space Grotesk, sans-serif'
                                }}>
                                  {patient.assessmentScores.gad7}
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#6B7280',
                                  fontFamily: 'Inter, sans-serif'
                                }}>
                                  /21
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {patient.tags && patient.tags.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.75rem',
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            Etiquetas
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {patient.tags.map((tag, index) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  backgroundColor: '#EEF2FF',
                                  color: '#4338CA',
                                  borderRadius: '1rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  fontFamily: 'Inter, sans-serif'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Last Session Info */}
                      <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: '#F9FAFB',
                        borderRadius: '0.75rem',
                        border: '1px solid #E5E7EB'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Clock size={16} color="#6B7280" />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Última Sesión: {formatLastSession(patient.lastSession)}
                          </span>
                        </div>
                        {patient.nextAppointment && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} color="#10B981" />
                            <span style={{
                              fontSize: '0.875rem',
                              color: '#10B981',
                              fontWeight: 500,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Próxima Cita: {patient.nextAppointment.toLocaleDateString('es-ES')} a las {patient.nextAppointment.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'medical':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Medical Information */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 1.5rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Información Médica
              </h3>

              {/* Allergies */}
              {patient.medicalInfo?.allergies && patient.medicalInfo.allergies.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Alergias
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {patient.medicalInfo.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#FEF2F2',
                          color: '#991B1B',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          border: '1px solid #FECACA'
                        }}
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Medications */}
              {patient.medicalInfo?.currentMedications && patient.medicalInfo.currentMedications.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Medicación Actual
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {patient.medicalInfo.currentMedications.map((medication, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#F0F9FF',
                          borderRadius: '0.75rem',
                          border: '1px solid #E0F2FE'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Pill size={16} color="#0369A1" />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#0C4A6E',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {medication.name}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#0369A1',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: 1.4
                        }}>
                          <p style={{ margin: '0 0 0.25rem 0' }}>
                            <strong>Dosis:</strong> {medication.dosage} • <strong>Frecuencia:</strong> {medication.frequency}
                          </p>
                          {medication.prescribedBy && (
                            <p style={{ margin: '0 0 0.25rem 0' }}>
                              <strong>Prescrito por:</strong> {medication.prescribedBy}
                            </p>
                          )}
                          {medication.notes && (
                            <p style={{ margin: '0.25rem 0 0 0' }}>
                              <strong>Notas:</strong> {medication.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical History */}
              {patient.medicalInfo?.medicalHistory && patient.medicalInfo.medicalHistory.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter                    , sans-serif'
                  }}>
                    Historial Médico
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {patient.medicalInfo.medicalHistory.map((condition, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#FFFBEB',
                          borderRadius: '0.5rem',
                          border: '1px solid #FDE68A',
                          fontSize: '0.875rem',
                          color: '#92400E',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {condition}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Therapy */}
              {patient.medicalInfo?.previousTherapy && (
                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Terapia Previa
                  </h4>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F3E8FF',
                    borderRadius: '0.75rem',
                    border: '1px solid #E9D5FF'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B46C1',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.5
                    }}>
                      {patient.medicalInfo.previousTherapyDetails || 'El paciente ha recibido terapia psicológica anteriormente.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Insurance Information */}
            {patient.insurance && (
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <Shield size={20} color="#2563EB" />
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Información del Seguro
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Compañía
                    </label>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.insurance.provider}
                    </p>
                  </div>

                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Número de Póliza
                    </label>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.insurance.policyNumber}
                    </p>
                  </div>

                  {patient.insurance.groupNumber && (
                    <div>
                      <label style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Número de Grupo
                      </label>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#1F2937',
                        margin: '0.25rem 0 0 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {patient.insurance.groupNumber}
                      </p>
                    </div>
                  )}

                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Copago
                    </label>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      €{patient.insurance.copay}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Users size={20} color="#EF4444" />
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Contacto de Emergencia
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Nombre
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#1F2937',
                    margin: '0.25rem 0 0 0',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {patient.emergencyContact.name}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Relación
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#1F2937',
                    margin: '0.25rem 0 0 0',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {patient.emergencyContact.relationship}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Teléfono
                  </label>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#1F2937',
                    margin: '0.25rem 0 0 0',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {patient.emergencyContact.phone}
                  </p>
                </div>

                {patient.emergencyContact.email && (
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Email
                    </label>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.emergencyContact.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Historial de Sesiones
            </h3>

            {/* Mock session data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  date: new Date('2024-03-10'),
                  type: 'Individual',
                  duration: 60,
                  status: 'completed',
                  notes: 'Sesión enfocada en técnicas de relajación y manejo de ansiedad.'
                },
                {
                  date: new Date('2024-03-03'),
                  type: 'Individual',
                  duration: 60,
                  status: 'completed',
                  notes: 'Revisión de tareas asignadas y trabajo en reestructuración cognitiva.'
                },
                {
                  date: new Date('2024-02-25'),
                  type: 'Individual',
                  duration: 60,
                  status: 'completed',
                  notes: 'Primera sesión de evaluación. Establecimiento de objetivos terapéuticos.'
                }
              ].map((session, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    background: '#F9FAFB',
                    borderRadius: '0.75rem',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.5rem',
                        background: '#EEF2FF',
                        borderRadius: '0.5rem'
                      }}>
                        <Activity size={16} color="#4338CA" />
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {session.type} - {session.duration} min
                        </h4>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          margin: '0.125rem 0 0 0',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {session.date.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Completada
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    margin: 0,
                    lineHeight: 1.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {session.notes}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              color: '#6B7280',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Mostrando las últimas 3 sesiones
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Evaluaciones y Escalas
            </h3>

            {/* Assessment Scores */}
            {(patient.assessmentScores?.phq9 || patient.assessmentScores?.gad7) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {patient.assessmentScores.phq9 && (
                  <div style={{
                    padding: '1.5rem',
                    background: '#FEF2F2',
                    borderRadius: '1rem',
                    border: '1px solid #FECACA'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        padding: '0.75rem',
                        background: '#EF4444',
                        borderRadius: '0.75rem'
                      }}>
                        <FileText size={20} color="white" />
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: '#991B1B',
                          margin: 0,
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}>
                          PHQ-9 (Depresión)
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#7F1D1D',
                          margin: '0.25rem 0 0 0',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Cuestionario de Salud del Paciente
                        </p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#EF4444',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {patient.assessmentScores.phq9}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#7F1D1D',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          de 27 puntos
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#991B1B',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {patient.assessmentScores.phq9 <= 4 ? 'Mínima' :
                           patient.assessmentScores.phq9 <= 9 ? 'Leve' :
                           patient.assessmentScores.phq9 <= 14 ? 'Moderada' :
                           patient.assessmentScores.phq9 <= 19 ? 'Moderadamente severa' : 'Severa'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {patient.assessmentScores.gad7 && (
                  <div style={{
                    padding: '1.5rem',
                    background: '#FFFBEB',
                    borderRadius: '1rem',
                    border: '1px solid #FDE68A'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        padding: '0.75rem',
                        background: '#F59E0B',
                        borderRadius: '0.75rem'
                      }}>
                        <Heart size={20} color="white" />
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: '#92400E',
                          margin: 0,
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}>
                          GAD-7 (Ansiedad)
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#78350F',
                          margin: '0.25rem 0 0 0',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Escala de Ansiedad Generalizada
                        </p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#F59E0B',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {patient.assessmentScores.gad7}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#78350F',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          de 21 puntos
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#92400E',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {patient.assessmentScores.gad7 <= 4 ? 'Mínima' :
                           patient.assessmentScores.gad7 <= 9 ? 'Leve' :
                           patient.assessmentScores.gad7 <= 14 ? 'Moderada' : 'Severa'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                color: '#6B7280',
                textAlign: 'center'
              }}>
                <FileText size={48} color="#9CA3AF" />
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '1rem 0 0.5rem 0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Sin Evaluaciones Registradas
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  No hay evaluaciones psicológicas registradas para este paciente.
                </p>
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Documentos y Consentimientos
            </h3>

            {/* Consent Forms */}
            {patient.consentForms && patient.consentForms.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {patient.consentForms.map((consent) => (
                  <div
                    key={consent.id}
                    style={{
                      padding: '1rem',
                      background: '#F0FDF4',
                      borderRadius: '0.75rem',
                      border: '1px solid #BBF7D0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          padding: '0.5rem',
                          background: '#10B981',
                          borderRadius: '0.5rem'
                        }}>
                          <FileText size={16} color="white" />
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#065F46',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {consent.type === 'informed-consent' ? 'Consentimiento Informado' :
                             consent.type === 'data-processing' ? 'Tratamiento de Datos' :
                             consent.type === 'recording-consent' ? 'Grabación de Sesiones' :
                             consent.type === 'research-participation' ? 'Participación en Investigación' :
                             consent.type}
                          </h4>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#047857',
                            margin: '0.125rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Firmado el {consent.signedDate?.toLocaleDateString('es-ES')} • Versión {consent.version}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Firmado
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{
                            padding: '0.5rem',
                            background: '#EEF2FF',
                            border: '1px solid #C7D2FE',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={14} color="#4338CA" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                color: '#6B7280',
                textAlign: 'center'
              }}>
                <FileText size={48} color="#9CA3AF" />
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '1rem 0 0.5rem 0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Sin Documentos
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  No hay documentos o consentimientos registrados para este paciente.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
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
          borderRadius: '1.5rem',
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
          padding: '2rem',
          borderBottom: '1px solid #E5E7EB',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              <User size={28} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {patient.firstName} {patient.lastName}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {calculateAge(patient.dateOfBirth)} años • {patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Femenino' : 'Otro'}
                </span>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#D1D5DB'
                }} />
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: patient.status === 'active' ? '#ECFDF5' : 
                                 patient.status === 'inactive' ? '#F3F4F6' : 
                                 patient.status === 'discharged' ? '#EFF6FF' : '#FFFBEB',
                  color: getStatusColor(patient.status),
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {patient.status === 'active' ? 'Activo' : 
                   patient.status === 'inactive' ? 'Inactivo' : 
                   patient.status === 'discharged' ? 'Alta' : 
                   patient.status === 'pending' ? 'Pendiente' : patient.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Edit size={16} />
              Editar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                padding: '0.75rem',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="#6B7280" />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          background: '#F9FAFB'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.5rem',
                  background: isActive ? 'white' : 'transparent',
                  color: isActive ? '#6366F1' : '#6B7280',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                  flex: 1,
                  justifyContent: 'center'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          background: '#F8FAFC'
        }}>
          {renderTabContent()}
        </div>
      </motion.div>
    </div>
  );
}

