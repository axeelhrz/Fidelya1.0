'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Edit,
} from 'lucide-react';
import { Appointment } from '@/types/clinical';

interface AppointmentCardProps {
  appointment: Appointment;
  patientName?: string;
  therapistName?: string;
  roomName?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  showActions?: boolean;
}

export function AppointmentCard({
  appointment,
  patientName,
  therapistName,
  roomName,
  onClick,
  onEdit,
  onCancel,
  onCheckIn,
  onCheckOut,
  showActions = true
}: AppointmentCardProps) {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'scheduled': return <Clock size={16} color="#F59E0B" />;
      case 'confirmed': return <CheckCircle size={16} color="#2563EB" />;
      case 'checked-in': return <User size={16} color="#10B981" />;
      case 'cancelled': return <XCircle size={16} color="#EF4444" />;
      case 'no-show': return <AlertCircle size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'scheduled': return '#F59E0B';
      case 'confirmed': return '#2563EB';
      case 'checked-in': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'no-show': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed': return '#ECFDF5';
      case 'scheduled': return '#FFFBEB';
      case 'confirmed': return '#EFF6FF';
      case 'checked-in': return '#ECFDF5';
      case 'cancelled': return '#FEF2F2';
      case 'no-show': return '#FEF2F2';
      default: return '#F9FAFB';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'scheduled': return 'Programada';
      case 'confirmed': return 'Confirmada';
      case 'checked-in': return 'Check-in';
      case 'cancelled': return 'Cancelada';
      case 'no-show': return 'No asistió';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'group': return 'Grupal';
      case 'family': return 'Familiar';
      case 'couple': return 'Pareja';
      case 'assessment': return 'Evaluación';
      case 'supervision': return 'Supervisión';
      default: return type;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const now = new Date();
    return date < now;
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
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: `1px solid ${isToday(appointment.date) ? '#2563EB' : '#E5E7EB'}`,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        opacity: isPast(appointment.date) && appointment.status !== 'completed' ? 0.7 : 1
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {getStatusIcon(appointment.status)}
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: getStatusBgColor(appointment.status),
                color: getStatusColor(appointment.status),
                fontFamily: 'Inter, sans-serif'
              }}>
                {getStatusLabel(appointment.status)}
              </span>
              
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#F3F4F6',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                {getTypeLabel(appointment.type)}
              </span>

              {appointment.isVirtual && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Video size={14} color="#7C3AED" />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#7C3AED',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Virtual
                  </span>
                </div>
              )}
            </div>
            
            {isToday(appointment.date) && (
              <span style={{
                fontSize: '0.75rem',
                color: '#2563EB',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                Hoy
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {appointment.status === 'scheduled' && onCheckIn && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckIn();
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#ECFDF5',
                  cursor: 'pointer'
                }}
                title="Check-in"
              >
                <CheckCircle size={16} color="#10B981" />
              </motion.button>
            )}
            
            {appointment.status === 'checked-in' && onCheckOut && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckOut();
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#EFF6FF',
                  cursor: 'pointer'
                }}
                title="Check-out"
              >
                <User size={16} color="#2563EB" />
              </motion.button>
            )}
            
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#FFFBEB',
                  cursor: 'pointer'
                }}
                title="Editar"
              >
                <Edit size={16} color="#F59E0B" />
              </motion.button>
            )}
            
            {onCancel && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#FEF2F2',
                  cursor: 'pointer'
                }}
                title="Cancelar"
              >
                <XCircle size={16} color="#EF4444" />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Date and Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="#6B7280" />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            fontFamily: 'Inter, sans-serif'
          }}>
            {formatDate(appointment.date)}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} color="#6B7280" />
          <span style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            {formatTime(appointment.date)} ({appointment.duration} min)
          </span>
        </div>
      </div>

      {/* Patient and Therapist */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Paciente
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            fontFamily: 'Inter, sans-serif'
          }}>
            {patientName || 'Paciente no especificado'}
          </div>
        </div>
        
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Terapeuta
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            fontFamily: 'Inter, sans-serif'
          }}>
            {therapistName || 'Terapeuta no especificado'}
          </div>
        </div>
      </div>

      {/* Location */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#F9FAFB',
        borderRadius: '0.5rem',
        marginBottom: appointment.notes ? '1rem' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {appointment.isVirtual ? (
            <>
              <Video size={14} color="#7C3AED" />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Teleconsulta
              </span>
              {appointment.meetingLink && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(appointment.meetingLink, '_blank');
                  }}
                  style={{
                    marginLeft: 'auto',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Unirse
                </motion.button>
              )}
            </>
          ) : (
            <>
              <MapPin size={14} color="#6B7280" />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                {roomName || 'Consultorio no especificado'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '0.5rem',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Notas
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#374151',
            lineHeight: 1.4,
            fontFamily: 'Inter, sans-serif'
          }}>
            {appointment.notes}
          </div>
        </div>
      )}

      {/* Check-in/out times */}
      {(appointment.checkIn || appointment.checkOut) && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#ECFDF5',
          borderRadius: '0.5rem'
        }}>
          {appointment.checkIn && (
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginBottom: '0.25rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Check-in
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#10B981',
                fontFamily: 'Inter, sans-serif'
              }}>
                {appointment.checkIn.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
          
          {appointment.checkOut && (
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginBottom: '0.25rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Check-out
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#10B981',
                fontFamily: 'Inter, sans-serif'
              }}>
                {appointment.checkOut.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
