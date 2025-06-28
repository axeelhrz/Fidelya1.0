'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  AlertTriangle, 
  Phone, 
  Mail,
  MapPin,
  Clock,
  Activity
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
      case 'on-hold': return '#F59E0B';
      default: return '#6B7280';
    }
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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        padding: '1.5rem',
        backgroundColor: isSelected ? '#EFF6FF' : 'white',
        borderRadius: '1rem',
        border: `1px solid ${isSelected ? '#2563EB' : '#E5E7EB'}`,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease'
      }}
    >
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
              style={{ cursor: 'pointer' }}
            />
          )}
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <User size={24} color="#2563EB" />
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
                 patient.status === 'on-hold' ? 'En pausa' : patient.status}
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

      {/* Quick Info */}
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
          {/* Tags */}
          {patient.tags && patient.tags.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {patient.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {tag}
                  </span>
                ))}
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

          {/* Address */}
          {patient.address && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={14} color="#6B7280" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                lineHeight: 1.4,
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.zipCode}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
