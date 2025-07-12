'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Save,
  AlertCircle,
  Repeat
} from 'lucide-react';
import { 
  CreateAppointmentData, 
  UpdateAppointmentData, 
  AppointmentType, 
  RecurrenceType,
  Appointment 
} from '@/types/agenda';
import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateAppointmentData) => Promise<void>;
  onUpdate?: (id: string, data: UpdateAppointmentData) => Promise<void>;
  appointment?: Appointment | null;
  selectedDate?: Date;
  patients: Array<{ id: string; name: string; phone: string; email: string }>;
  consultorios: string[];
  isCreating?: boolean;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  appointment,
  selectedDate,
  patients,
  consultorios,
  isCreating = true
}: AppointmentModalProps) {
  const [formData, setFormData] = useState<CreateAppointmentData>({
    patientId: '',
    startDateTime: selectedDate || new Date(),
    duration: 60,
    type: 'individual',
    motive: '',
    notes: '',
    consultorio: '',
    recurrenceRule: {
      type: 'none',
      interval: 1
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (appointment && !isCreating) {
      setFormData({
        patientId: appointment.patientId,
        startDateTime: appointment.startDateTime,
        duration: appointment.duration,
        type: appointment.type,
        motive: appointment.motive,
        notes: appointment.notes || '',
        consultorio: appointment.consultorio || '',
        recurrenceRule: {
          type: 'none',
          interval: 1
        }
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        startDateTime: selectedDate
      }));
    }
  }, [appointment, selectedDate, isCreating]);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSearchTerm('');
      setShowPatientSearch(false);
    }
  }, [isOpen]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = (field: keyof CreateAppointmentData, value: CreateAppointmentData[keyof CreateAppointmentData]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRecurrenceChange = (field: keyof NonNullable<CreateAppointmentData['recurrenceRule']>, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      recurrenceRule: {
        ...prev.recurrenceRule!,
        [field]: value
      }
    }));
  };

  const handlePatientSelect = (patient: { id: string; name: string }) => {
    handleInputChange('patientId', patient.id);
    setSearchTerm(patient.name);
    setShowPatientSearch(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecciona un paciente';
    }

    if (!formData.motive.trim()) {
      newErrors.motive = 'El motivo de consulta es obligatorio';
    }

    if (formData.duration < 15) {
      newErrors.duration = 'La duración mínima es 15 minutos';
    }

    if (formData.duration > 240) {
      newErrors.duration = 'La duración máxima es 4 horas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      if (isCreating) {
        await onSave(formData);
      } else if (appointment && onUpdate) {
        await onUpdate(appointment.id, {
          startDateTime: formData.startDateTime,
          duration: formData.duration,
          type: formData.type,
          motive: formData.motive,
          notes: formData.notes,
          consultorio: formData.consultorio
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  const endDateTime = addMinutes(formData.startDateTime, formData.duration);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '600px',
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
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={24} />
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {isCreating ? 'Nueva Cita' : 'Editar Cita'}
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    margin: '0.25rem 0 0 0',
                    opacity: 0.9
                  }}>
                    {format(formData.startDateTime, 'EEEE, d MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} color="white" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '1.5rem'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                      <User size={16} color="#9CA3AF" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar paciente..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowPatientSearch(true);
                      }}
                      onFocus={() => setShowPatientSearch(true)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: `1px solid ${errors.patientId ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>

                  {/* Patient Search Dropdown */}
                  <AnimatePresence>
                    {showPatientSearch && searchTerm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          zIndex: 10,
                          maxHeight: '200px',
                          overflow: 'auto'
                        }}
                      >
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map(patient => (
                            <motion.div
                              key={patient.id}
                              whileHover={{ backgroundColor: '#F3F4F6' }}
                              onClick={() => handlePatientSelect(patient)}
                              style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid #E5E7EB'
                              }}
                            >
                              <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#1F2937'
                              }}>
                                {patient.name}
                              </div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#6B7280'
                              }}>
                                {patient.phone} • {patient.email}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div style={{
                            padding: '0.75rem',
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            textAlign: 'center'
                          }}>
                            No se encontraron pacientes
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selected Patient Display */}
                  {selectedPatient && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#15803D'
                      }}>
                        {selectedPatient.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#16A34A'
                      }}>
                        {selectedPatient.phone} • {selectedPatient.email}
                      </div>
                    </div>
                  )}
                </div>
                {errors.patientId && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginTop: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#EF4444'
                  }}>
                    <AlertCircle size={12} />
                    {errors.patientId}
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem'
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
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={format(formData.startDateTime, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      const currentTime = formData.startDateTime;
                      newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
                      handleInputChange('startDateTime', newDate);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none'
                    }}
                  />
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
                    Hora *
                  </label>
                  <input
                    type="time"
                    value={format(formData.startDateTime, 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newDateTime = new Date(formData.startDateTime);
                      newDateTime.setHours(hours, minutes);
                      handleInputChange('startDateTime', newDateTime);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none'
                    }}
                  />
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
                    Duración (min) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.duration ? '#EF4444' : '#D1D5DB'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none'
                    }}
                  />
                  {errors.duration && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginTop: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#EF4444'
                    }}>
                      <AlertCircle size={12} />
                      {errors.duration}
                    </div>
                  )}
                </div>
              </div>

              {/* End Time Display */}
              <div style={{
                padding: '0.75rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={16} color="#6B7280" />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Hora de finalización: {format(endDateTime, 'HH:mm')}
                </span>
              </div>

              {/* Type and Consultorio */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
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
                    Tipo de Sesión *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as AppointmentType)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      background: 'white'
                    }}
                  >
                    <option value="individual">Individual</option>
                    <option value="grupal">Grupal</option>
                    <option value="familiar">Familiar</option>
                    <option value="pareja">Pareja</option>
                    <option value="evaluacion">Evaluación</option>
                  </select>
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
                    Consultorio
                  </label>
                  <select
                    value={formData.consultorio}
                    onChange={(e) => handleInputChange('consultorio', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      background: 'white'
                    }}
                  >
                    <option value="">Seleccionar consultorio</option>
                    {consultorios.map(consultorio => (
                      <option key={consultorio} value={consultorio}>
                        {consultorio}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Motive */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Motivo de Consulta *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sesión de seguimiento, Primera consulta..."
                  value={formData.motive}
                  onChange={(e) => handleInputChange('motive', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.motive ? '#EF4444' : '#D1D5DB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                />
                {errors.motive && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginTop: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#EF4444'
                  }}>
                    <AlertCircle size={12} />
                    {errors.motive}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Notas Adicionales
                </label>
                <textarea
                  placeholder="Notas adicionales sobre la cita..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Recurrence (only for creating) */}
              {isCreating && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <Repeat size={16} color="#6B7280" />
                    <label style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Repetir Cita
                    </label>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: '0.5rem',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Frecuencia
                      </label>
                      <select
                        value={formData.recurrenceRule?.type || 'none'}
                        onChange={(e) => handleRecurrenceChange('type', e.target.value as RecurrenceType)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          background: 'white'
                        }}
                      >
                        <option value="none">No repetir</option>
                        <option value="weekly">Semanal</option>
                        <option value="biweekly">Quincenal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>

                    {formData.recurrenceRule?.type !== 'none' && (
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6B7280',
                          marginBottom: '0.5rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Número de repeticiones
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="52"
                          value={formData.recurrenceRule?.count || 4}
                          onChange={(e) => handleRecurrenceChange('count', parseInt(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontFamily: 'Inter, sans-serif',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {formData.recurrenceRule?.type !== 'none' && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: '#FEF3C7',
                      border: '1px solid #F59E0B',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#92400E'
                    }}>
                      Se crearán {formData.recurrenceRule?.count || 4} citas {
                        formData.recurrenceRule?.type === 'weekly' ? 'semanales' :
                        formData.recurrenceRule?.type === 'biweekly' ? 'quincenales' :
                        'mensuales'
                      } a partir de esta fecha.
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
            background: '#F9FAFB',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
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
              {loading ? 'Guardando...' : (isCreating ? 'Crear Cita' : 'Actualizar Cita')}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}