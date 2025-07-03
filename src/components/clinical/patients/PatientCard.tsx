'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail,
  Clock,
  Activity,
  Heart,
  Calendar,
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';

interface PatientCardProps {
  patient: ExtendedPatient;
  onClick?: () => void;
  showDetails?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export function PatientCard({ 
  patient, 
  onClick, 
  showDetails = false,
  isSelected = false,
  onSelect 
}: PatientCardProps) {
  
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
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

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return '#ECFDF5';
      case 'medium': return '#FFFBEB';
      case 'high': return '#FEF2F2';
      case 'critical': return '#FEF2F2';
      default: return '#F9FAFB';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        padding: '1.5rem',
        backgroundColor: isSelected ? '#EFF6FF' : 'white',
        borderRadius: '1rem',
        border: `1px solid ${isSelected ? '#2563EB' : '#E5E7EB'}`,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: isSelected 
          ? '0 8px 25px -5px rgba(37, 99, 235, 0.25)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '60px',
        height: '60px',
        background: `${getRiskColor(patient.riskLevel)}15`,
        borderRadius: '50%'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              style={{ 
                cursor: 'pointer',
                width: '16px',
                height: '16px',
                accentColor: '#2563EB'
              }}
            />
          )}
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <User size={24} color="white" />
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              {patient.firstName} {patient.lastName}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                {calculateAge(patient.dateOfBirth)} años • {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'Otro'}
              </span>
              
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

        {/* Risk Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getRiskColor(patient.riskLevel)
          }} />
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: getRiskBgColor(patient.riskLevel),
            color: getRiskColor(patient.riskLevel),
            fontFamily: 'Inter, sans-serif'
          }}>
            {patient.riskLevel === 'low' ? 'Bajo' :
             patient.riskLevel === 'medium' ? 'Medio' :
             patient.riskLevel === 'high' ? 'Alto' : 'Crítico'}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showDetails ? '1fr 1fr' : '1fr',
        gap: '1rem',
        marginBottom: showDetails ? '1rem' : '0'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Mail size={14} color="#6B7280" />
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              {patient.email}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={14} color="#6B7280" />
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              {patient.phone}
            </span>
          </div>
        </div>

        {showDetails && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Activity size={14} color="#6B7280" />
              <span style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.totalSessions} sesiones
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} color="#6B7280" />
              <span style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                {formatLastSession(patient.lastSession)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Therapist */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#F9FAFB',
        borderRadius: '0.5rem',
        marginBottom: showDetails ? '1rem' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={14} color="#6B7280" />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'Inter, sans-serif'
          }}>
            {patient.assignedTherapist}
          </span>
        </div>
      </div>

      {/* Extended Details */}
      {showDetails && (
        <div>
          {/* Emotional State */}
          {patient.emotionalState && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Heart size={14} color={getEmotionalStateColor(patient.emotionalState)} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: getEmotionalStateColor(patient.emotionalState),
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.emotionalState === 'improving' ? 'Mejorando' :
                 patient.emotionalState === 'stable' ? 'Estable' :
                 patient.emotionalState === 'struggling' ? 'Dificultades' :
                 patient.emotionalState === 'crisis' ? 'Crisis' : 'Desconocido'}
              </span>
            </div>
          )}

          {/* Tags */}
          {patient.tags && patient.tags.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {patient.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#EEF2FF',
                      color: '#4338CA',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {patient.tags.length > 3 && (
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#F3F4F6',
                    color: '#6B7280',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    +{patient.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Assessment Scores */}
          {(patient.assessmentScores?.phq9 || patient.assessmentScores?.gad7) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {patient.assessmentScores.phq9 && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#FEF2F2',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    PHQ-9
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#EF4444',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {patient.assessmentScores.phq9}
                  </div>
                </div>
              )}
              
              {patient.assessmentScores.gad7 && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#FFFBEB',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    GAD-7
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#F59E0B',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {patient.assessmentScores.gad7}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Next Appointment */}
          {patient.nextAppointment && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#ECFDF5',
              borderRadius: '0.5rem',
              border: '1px solid #D1FAE5'
            }}>
              <Calendar size={14} color="#10B981" />
              <span style={{
                fontSize: '0.875rem',
                color: '#065F46',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }}>
                Próxima cita: {patient.nextAppointment.toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
