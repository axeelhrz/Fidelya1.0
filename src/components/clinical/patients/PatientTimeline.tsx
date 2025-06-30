'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  FileText,
  Activity,
  AlertTriangle,
  Clock,
  User,
  Brain,
  Pill,
  Eye,
  Download
} from 'lucide-react';
import { ExtendedPatient, PatientTimelineEvent, Appointment, ClinicalNote, PsychometricAssessment } from '@/types/clinical';

interface PatientTimelineProps {
  patient: ExtendedPatient;
  appointments: Appointment[];
  notes: ClinicalNote[];
  assessments: PsychometricAssessment[];
  onEventClick?: (event: PatientTimelineEvent) => void;
}

export function PatientTimeline({ 
  patient, 
  appointments, 
  notes, 
  assessments, 
}: PatientTimelineProps) {
  type FilterKey = 'all' | 'sessions' | 'notes' | 'assessments' | 'medications';
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Combine all events into timeline
  const timelineEvents = React.useMemo(() => {
    const events: PatientTimelineEvent[] = [];

    // Add appointments
    appointments.forEach(appointment => {
      events.push({
        id: `appointment-${appointment.id}`,
        patientId: patient.id,
        date: appointment.date,
        type: 'session',
        title: `Sesión ${appointment.type === 'individual' ? 'Individual' : 
                appointment.type === 'family' ? 'Familiar' : 
                appointment.type === 'couple' ? 'Pareja' : 'Grupal'}`,
        description: `${appointment.duration} minutos • ${appointment.status === 'completed' ? 'Completada' : 
                     appointment.status === 'cancelled' ? 'Cancelada' : 
                     appointment.status === 'no-show' ? 'No asistió' : 'Programada'}`,
        relatedId: appointment.id,
        createdBy: appointment.therapistId,
        data: appointment
      });
    });

    // Add notes
    notes.forEach(note => {
      events.push({
        id: `note-${note.id}`,
        patientId: patient.id,
        date: note.date,
        type: 'note',
        title: `Nota Clínica - ${note.templateType.toUpperCase()}`,
        description: note.content.subjective?.substring(0, 100) + '...' || 'Nota clínica registrada',
        relatedId: note.id,
        createdBy: note.therapistId ?? '',
        data: note
      });
    });

    // Add assessments
    assessments.forEach(assessment => {
      events.push({
        id: `assessment-${assessment.id}`,
        patientId: patient.id,
        date: assessment.date,
        type: 'assessment',
        title: `Evaluación - ${assessment.testId}`,
        description: `${assessment.type} • ${assessment.status}`,
        relatedId: assessment.id,
        createdBy: assessment.therapistId,
        data: assessment
      });
    });

    // Add medication changes (from patient medical info)
    patient.medicalInfo?.currentMedications?.forEach((medication, index) => {
      events.push({
        id: `medication-${index}`,
        patientId: patient.id,
        date: medication.startDate,
        type: 'medication-change',
        title: `Medicación: ${medication.name}`,
        description: `${medication.dosage} • ${medication.frequency} • Prescrito por: ${medication.prescribedBy}`,
        relatedId: `med-${index}`,
        createdBy: medication.prescribedBy,
        data: medication
      });
    });

    // Sort by date (most recent first)
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patient, appointments, notes, assessments]);

  // Filter events
  const filteredEvents = timelineEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'sessions') return event.type === 'session';
    if (selectedFilter === 'notes') return event.type === 'note';
    if (selectedFilter === 'assessments') return event.type === 'assessment';
    if (selectedFilter === 'medications') return event.type === 'medication-change';
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'session': return Calendar;
      case 'note': return FileText;
      case 'assessment': return Activity;
      case 'medication-change': return Pill;
      case 'diagnosis-update': return Brain;
      case 'referral': return User;
      case 'incident': return AlertTriangle;
      default: return Clock;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'session': return '#2563EB';
      case 'note': return '#10B981';
      case 'assessment': return '#7C3AED';
      case 'medication-change': return '#F59E0B';
      case 'diagnosis-update': return '#EF4444';
      case 'referral': return '#6B7280';
      case 'incident': return '#DC2626';
      default: return '#9CA3AF';
    }
  };

  const getEventBgColor = (type: string) => {
    switch (type) {
      case 'session': return '#EFF6FF';
      case 'note': return '#ECFDF5';
      case 'assessment': return '#F3E8FF';
      case 'medication-change': return '#FFFBEB';
      case 'diagnosis-update': return '#FEF2F2';
      case 'referral': return '#F9FAFB';
      case 'incident': return '#FEF2F2';
      default: return '#F9FAFB';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;
    return `Hace ${Math.ceil(diffDays / 365)} años`;
  };

  const renderEventDetails = (event: PatientTimelineEvent) => {
    const data = event.data;
    
    switch (event.type) {
      case 'session':
        const appointment = data as Appointment;
        return (
          <div style={{
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '0.5rem',
            marginTop: '0.75rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Duración
                </span>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {appointment.duration} minutos
                </div>
              </div>
              
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Costo
                </span>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: appointment.paid ? '#10B981' : '#EF4444',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  €{appointment.cost} {appointment.paid ? '(Pagado)' : '(Pendiente)'}
                </div>
              </div>
            </div>
            
            {appointment.notes && (
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Notas
                </span>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  marginTop: '0.25rem'
                }}>
                  {appointment.notes}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'note':
        const note = data as ClinicalNote;
        return (
          <div style={{
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '0.5rem',
            marginTop: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                {note.templateType.toUpperCase()}
              </span>
              
              {note.status === 'signed' && (
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Firmada
                </span>
              )}
            </div>
            
            {note.content.subjective && (
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Subjetivo
                </span>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  marginTop: '0.25rem'
                }}>
                  {note.content.subjective.substring(0, 200)}...
                </div>
              </div>
            )}
            
            {note.icdCodes && note.icdCodes.length > 0 && (
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Códigos CIE-11
                </span>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                  marginTop: '0.25rem'
                }}>
                  {note.icdCodes.map((code, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {typeof code === 'string' ? code : code.code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'assessment':
        const assessment = data as PsychometricAssessment;
        return (
          <div style={{
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '0.5rem',
            marginTop: '0.75rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Tipo
                </span>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {assessment.type}
                </div>
              </div>
              
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Método
                </span>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {assessment.administrationMethod}
                </div>
              </div>
            </div>
            
            {assessment.results && assessment.results.length > 0 && (
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Resultados
                </span>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {assessment.results.slice(0, 3).map((result, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#F3E8FF',
                        borderRadius: '0.25rem',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Puntuación
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#7C3AED',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {result.rawScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
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
              Trayectoria Clínica
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {patient.firstName} {patient.lastName} • {filteredEvents.length} eventos
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
              <Download size={16} />
              Exportar Timeline
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #E5E7EB'
        }}>
          {[
            { key: 'all', label: 'Todos', icon: Eye },
            { key: 'sessions', label: 'Sesiones', icon: Calendar },
            { key: 'notes', label: 'Notas', icon: FileText },
            { key: 'assessments', label: 'Evaluaciones', icon: Activity },
            { key: 'medications', label: 'Medicación', icon: Pill }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedFilter(key as FilterKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: selectedFilter === key ? '#2563EB' : 'transparent',
                color: selectedFilter === key ? 'white' : '#6B7280',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Icon size={16} />
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        {filteredEvents.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <Clock size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              No hay eventos en el timeline
            </h3>
            <p style={{
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Los eventos aparecerán aquí a medida que se registren sesiones, notas y evaluaciones
            </p>
          </div>
        ) : (
          <div style={{ padding: '2rem' }}>
            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute',
                left: '2rem',
                top: '0',
                bottom: '0',
                width: '2px',
                backgroundColor: '#E5E7EB'
              }} />
              
              {filteredEvents.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const isExpanded = showDetails === event.id;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      position: 'relative',
                      paddingLeft: '4rem',
                      paddingBottom: index < filteredEvents.length - 1 ? '2rem' : '0'
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '1.25rem',
                      top: '0.75rem',
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: getEventColor(event.type),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid white',
                      boxShadow: '0 0 0 1px #E5E7EB'
                    }}>
                      <Icon size={12} color="white" />
                    </div>
                    
                    {/* Event content */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setShowDetails(isExpanded ? null : event.id)}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: getEventBgColor(event.type),
                        borderRadius: '0.75rem',
                        border: `1px solid ${getEventColor(event.type)}20`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#374151',
                            margin: 0,
                            marginBottom: '0.25rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {event.title}
                          </h3>
                          
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            margin: 0,
                            marginBottom: '0.5rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {event.description}
                          </p>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#9CA3AF',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {formatDate(event.date)} • {event.date.toLocaleDateString('es-ES')}
                            </span>
                            
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#9CA3AF',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Por: {event.createdBy}
                            </span>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={16} color="#6B7280" />
                        </motion.button>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            {renderEventDetails(event)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
