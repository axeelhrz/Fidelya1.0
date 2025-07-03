'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  MapPin,
  Video,
  Phone,
  Mail,
  Save,
  Trash2,
  Bell,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Appointment, ExtendedPatient, ConsultingRoom } from '@/types/clinical';

interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  // Add other relevant fields if needed
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  patients: ExtendedPatient[];
  rooms: ConsultingRoom[];
  therapists: Therapist[];
  onSave: (appointmentData: Partial<Appointment>) => void;
  onDelete?: (appointmentId: string) => void;
  onCheckIn?: (appointmentId: string) => void;
  onCheckOut?: (appointmentId: string) => void;
  onSendReminder?: (appointmentId: string) => void;
  mode: 'create' | 'edit' | 'view';
}

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  patients,
  rooms,
  therapists,
  onSave,
  onDelete,
  onCheckIn,
  onCheckOut,
  onSendReminder,
  mode
}: AppointmentModalProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: '',
    therapistId: '',
    roomId: '',
    date: new Date(),
    duration: 60,
    type: 'individual',
    status: 'scheduled',
    isVirtual: false,
    notes: '',
    cost: 0,
    paid: false,
    reminderSent: false
  });

  const [selectedPatient, setSelectedPatient] = useState<ExtendedPatient | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
      const patient = patients.find(p => p.id === appointment.patientId);
      setSelectedPatient(patient || null);
    } else {
      setFormData({
        patientId: '',
        therapistId: '',
        roomId: '',
        date: new Date(),
        duration: 60,
        type: 'individual',
        status: 'scheduled',
        isVirtual: false,
        notes: '',
        cost: 0,
        paid: false,
        reminderSent: false
      });
      setSelectedPatient(null);
    }
    setErrors({});
  }, [appointment, patients]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecciona un paciente';
    }
    if (!formData.therapistId) {
      newErrors.therapistId = 'Selecciona un terapeuta';
    }
    if (!formData.isVirtual && !formData.roomId) {
      newErrors.roomId = 'Selecciona un consultorio o marca como virtual';
    }
    if (!formData.date) {
      newErrors.date = 'Selecciona una fecha';
    }
    if (!formData.duration || formData.duration < 15) {
      newErrors.duration = 'La duración mínima es 15 minutos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    setFormData(prev => ({ ...prev, patientId }));
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'scheduled': return 'Programada';
      case 'confirmed': return 'Confirmada';
      case 'checked-in': return 'Check-in realizado';
      case 'cancelled': return 'Cancelada';
      case 'no-show': return 'No asistió';
      default: return status;
    }
  };

  const canEdit = mode === 'create' || mode === 'edit';
  const canCheckIn = appointment && appointment.status === 'scheduled' && mode === 'view';
  const canCheckOut = appointment && appointment.status === 'checked-in' && mode === 'view';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
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
            padding: '1.5rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {mode === 'create' ? 'Nueva Cita' : mode === 'edit' ? 'Editar Cita' : 'Detalles de la Cita'}
              </h2>
              
              {appointment && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: `${getStatusColor(appointment.status)}15`,
                    color: getStatusColor(appointment.status),
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {getStatusLabel(appointment.status)}
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
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Action buttons for view mode */}
              {mode === 'view' && appointment && (
                <>
                  {canCheckIn && onCheckIn && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCheckIn(appointment.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#ECFDF5',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                      title="Check-in"
                    >
                      <CheckCircle size={16} color="#10B981" />
                    </motion.button>
                  )}
                  
                  {canCheckOut && onCheckOut && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCheckOut(appointment.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#EFF6FF',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                      title="Check-out"
                    >
                      <User size={16} color="#2563EB" />
                    </motion.button>
                  )}
                  
                  {onSendReminder && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSendReminder(appointment.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#FFFBEB',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                      title="Enviar recordatorio"
                    >
                      <Bell size={16} color="#F59E0B" />
                    </motion.button>
                  )}
                </>
              )}

              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '0.5rem'
                }}
              >
                <X size={20} color="#6B7280" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {/* Patient Selection */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Paciente *
                  </label>
                  
                  {canEdit ? (
                    <select
                      value={formData.patientId || ''}
                      onChange={(e) => handlePatientChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.patientId ? '#EF4444' : '#E5E7EB'}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value="">Seleccionar paciente</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'No especificado'}
                    </div>
                  )}
                  
                  {errors.patientId && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      marginTop: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {errors.patientId}
                    </p>
                  )}
                </div>

                {/* Therapist Selection */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Terapeuta *
                  </label>
                  
                  {canEdit ? (
                    <select
                      value={formData.therapistId || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, therapistId: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.therapistId ? '#EF4444' : '#E5E7EB'}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value="">Seleccionar terapeuta</option>
                      {therapists.map(therapist => (
                        <option key={therapist.id} value={therapist.id}>
                          {therapist.firstName} {therapist.lastName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {therapists.find(t => t.id === formData.therapistId)?.firstName || 'No especificado'} {therapists.find(t => t.id === formData.therapistId)?.lastName || ''}
                    </div>
                  )}
                  
                  {errors.therapistId && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      marginTop: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {errors.therapistId}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Fecha y Hora *
                  </label>
                  
                  {canEdit ? (
                    <input
                      type="datetime-local"
                      value={formData.date ? new Date(formData.date.getTime() - formData.date.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.date ? '#EF4444' : '#E5E7EB'}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {formData.date ? new Date(formData.date).toLocaleString('es-ES') : 'No especificado'}
                    </div>
                  )}
                  
                  {errors.date && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      marginTop: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Duración (minutos) *
                  </label>
                  
                  {canEdit ? (
                    <select
                      value={formData.duration || 60}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.duration ? '#EF4444' : '#E5E7EB'}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>60 minutos</option>
                      <option value={90}>90 minutos</option>
                      <option value={120}>120 minutos</option>
                    </select>
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {formData.duration} minutos
                    </div>
                  )}
                  
                  {errors.duration && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      marginTop: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {errors.duration}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Tipo de Sesión
                  </label>
                  
                  {canEdit ? (
                    <select
                      value={formData.type || 'individual'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Appointment['type'] }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value="individual">Individual</option>
                      <option value="family">Familiar</option>
                      <option value="couple">Pareja</option>
                      <option value="group">Grupal</option>
                      <option value="assessment">Evaluación</option>
                      <option value="supervision">Supervisión</option>
                    </select>
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {formData.type === 'individual' ? 'Individual' :
                       formData.type === 'family' ? 'Familiar' :
                       formData.type === 'couple' ? 'Pareja' :
                       formData.type === 'group' ? 'Grupal' :
                       formData.type === 'assessment' ? 'Evaluación' :
                       formData.type === 'supervision' ? 'Supervisión' : formData.type}
                    </div>
                  )}
                </div>

                {/* Status (only for edit/view mode) */}
                {mode !== 'create' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Estado
                    </label>
                    
                    {canEdit ? (
                      <select
                        value={formData.status || 'scheduled'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Appointment['status'] }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none'
                        }}
                      >
                        <option value="scheduled">Programada</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="checked-in">Check-in</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                        <option value="no-show">No asistió</option>
                      </select>
                    ) : (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {getStatusLabel(formData.status || 'scheduled')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Virtual/Room Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Modalidad
                </label>

                {canEdit ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="modality"
                          checked={!formData.isVirtual}
                          onChange={() => setFormData(prev => ({ ...prev, isVirtual: false }))}
                        />
                        <MapPin size={16} color="#6B7280" />
                        <span style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>Presencial</span>
                      </label>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="modality"
                          checked={formData.isVirtual}
                          onChange={() => setFormData(prev => ({ ...prev, isVirtual: true, roomId: '' }))}
                        />
                        <Video size={16} color="#7C3AED" />
                        <span style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>Virtual</span>
                      </label>
                    </div>

                    {!formData.isVirtual && (
                      <select
                        value={formData.roomId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors.roomId ? '#EF4444' : '#E5E7EB'}`,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none'
                        }}
                      >
                        <option value="">Seleccionar consultorio</option>
                        {rooms.filter(room => room.status !== 'maintenance').map(room => (
                          <option key={room.id} value={room.id}>
                            {room.name} - {room.location}
                          </option>
                        ))}
                      </select>
                    )}

                    {formData.isVirtual && (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '0.5rem',
                        border: '1px solid #E2E8F0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Video size={16} color="#7C3AED" />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Teleconsulta
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Se generará automáticamente un enlace de reunión virtual
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {formData.isVirtual ? (
                      <>
                        <Video size={16} color="#7C3AED" />
                        <span>Teleconsulta</span>
                        {formData.meetingLink && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => window.open(formData.meetingLink, '_blank')}
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
                        <MapPin size={16} color="#6B7280" />
                        <span>{rooms.find(r => r.id === formData.roomId)?.name || 'Consultorio no especificado'}</span>
                      </>
                    )}
                  </div>
                )}

                {errors.roomId && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.roomId}
                  </p>
                )}
              </div>

              {/* Cost and Payment */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Costo (€)
                  </label>
                  
                  {canEdit ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      €{formData.cost || 0}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Estado de Pago
                  </label>
                  
                  {canEdit ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.paid || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.checked }))}
                      />
                      <span style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>Pagado</span>
                    </label>
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: formData.paid ? '#ECFDF5' : '#FEF2F2',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: formData.paid ? '#10B981' : '#EF4444',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {formData.paid ? 'Pagado' : 'Pendiente'}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Notas
                </label>
                
                {canEdit ? (
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Notas adicionales sobre la cita..."
                  />
                ) : (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '80px'
                  }}>
                    {formData.notes || 'Sin notas'}
                  </div>
                )}
              </div>

              {/* Patient Info (if selected) */}
              {selectedPatient && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Información del Paciente
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#6B7280" />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {selectedPatient.email}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} color="#6B7280" />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {selectedPatient.phone}
                      </span>
                    </div>
                  </div>

                  {selectedPatient.riskLevel !== 'low' && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: selectedPatient.riskLevel === 'critical' ? '#FEF2F2' : '#FFFBEB',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <AlertTriangle size={14} color={selectedPatient.riskLevel === 'critical' ? '#EF4444' : '#F59E0B'} />
                      <span style={{
                        fontSize: '0.75rem',
                        color: selectedPatient.riskLevel === 'critical' ? '#DC2626' : '#92400E',
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Paciente de riesgo {selectedPatient.riskLevel === 'critical' ? 'crítico' : selectedPatient.riskLevel === 'high' ? 'alto' : 'medio'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              {mode === 'view' && appointment && onDelete && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
                      onDelete(appointment.id);
                      onClose();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <Trash2 size={16} />
                  Eliminar
                </motion.button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
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
              
              {canEdit && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSubmitting ? '#9CA3AF' : '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <Save size={16} />
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
