'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  Phone,
  Mail,
  Video,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  MoreVertical
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types/agenda';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  patient?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
  patient
}: AppointmentDetailsModalProps) {
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !appointment) return null;

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return <Clock size={16} color="#3B82F6" />;
      case 'confirmada': return <CheckCircle size={16} color="#10B981" />;
      case 'check-in': return <User size={16} color="#F59E0B" />;
      case 'no-show': return <XCircle size={16} color="#EF4444" />;
      case 'cancelada': return <X size={16} color="#6B7280" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return 'Reservada';
      case 'confirmada': return 'Confirmada';
      case 'check-in': return 'Check-in';
      case 'no-show': return 'No Show';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return '#3B82F6';
      case 'confirmada': return '#10B981';
      case 'check-in': return '#F59E0B';
      case 'no-show': return '#EF4444';
      case 'cancelada': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return '#EFF6FF';
      case 'confirmada': return '#ECFDF5';
      case 'check-in': return '#FFFBEB';
      case 'no-show': return '#FEF2F2';
      case 'cancelada': return '#F9FAFB';
      default: return '#F9FAFB';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'grupal': return 'Grupal';
      case 'familiar': return 'Familiar';
      case 'pareja': return 'Pareja';
      case 'evaluacion': return 'Evaluación';
      default: return type;
    }
  };

  const canChangeToStatus = (currentStatus: AppointmentStatus, newStatus: AppointmentStatus): boolean => {
    const statusFlow: Record<AppointmentStatus, AppointmentStatus[]> = {
      'reservada': ['confirmada', 'cancelada'],
      'confirmada': ['check-in', 'cancelada', 'no-show'],
      'check-in': ['cancelada'],
      'no-show': [],
      'cancelada': []
    };

    return statusFlow[currentStatus]?.includes(newStatus) || false;
  };

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    onStatusChange(appointment.id, newStatus);
    setShowActions(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(appointment.id);
      setConfirmDelete(false);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

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
            maxWidth: '500px',
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
            background: `linear-gradient(135deg, ${getStatusColor(appointment.status)} 0%, ${getStatusColor(appointment.status)}CC 100%)`,
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusIcon(appointment.status)}
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {appointment.patientName}
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    margin: '0.25rem 0 0 0',
                    opacity: 0.9
                  }}>
                    {getStatusLabel(appointment.status)} • {getTypeLabel(appointment.type)}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowActions(!showActions)}
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
                  <MoreVertical size={20} color="white" />
                </motion.button>

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

            {/* Actions Dropdown */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: '1.5rem',
                    background: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    zIndex: 10,
                    minWidth: '200px'
                  }}
                >
                  <motion.button
                    whileHover={{ backgroundColor: '#F3F4F6' }}
                    onClick={onEdit}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Edit size={16} />
                    Editar Cita
                  </motion.button>

                  <div style={{ height: '1px', background: '#E5E7EB' }} />

                  <motion.button
                    whileHover={{ backgroundColor: '#FEF2F2' }}
                    onClick={handleDelete}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      background: confirmDelete ? '#FEF2F2' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: confirmDelete ? '#DC2626' : '#EF4444',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Trash2 size={16} />
                    {confirmDelete ? 'Confirmar Eliminación' : 'Eliminar Cita'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '1.5rem'
          }}>
            {/* Date and Time Info */}
            <div style={{
              padding: '1rem',
              background: '#F8FAFC',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Calendar size={16} color="#6B7280" />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Fecha
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937'
                  }}>
                    {format(appointment.startDateTime, 'EEEE, d MMMM yyyy', { locale: es })}
                  </div>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Clock size={16} color="#6B7280" />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Horario
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937'
                  }}>
                    {format(appointment.startDateTime, 'HH:mm')} - {format(appointment.endDateTime, 'HH:mm')}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280'
                  }}>
                    {appointment.duration} minutos
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Motive */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <FileText size={16} color="#6B7280" />
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Motivo de Consulta
                  </span>
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1F2937',
                  lineHeight: 1.5
                }}>
                  {appointment.motive}
                </div>
              </div>

              {/* Consultorio */}
              {appointment.consultorio && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <MapPin size={16} color="#6B7280" />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Consultorio
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#1F2937'
                  }}>
                    {appointment.consultorio}
                  </div>
                </div>
              )}

              {/* Notes */}
              {appointment.notes && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <FileText size={16} color="#6B7280" />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Notas
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#1F2937',
                    lineHeight: 1.5,
                    padding: '0.75rem',
                    background: '#F9FAFB',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB'
                  }}>
                    {appointment.notes}
                  </div>
                </div>
              )}

              {/* Patient Contact Info */}
              {patient && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    <User size={16} color="#6B7280" />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Información de Contacto
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: '#F9FAFB',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={16} color="#6B7280" />
                        <span style={{ fontSize: '0.875rem', color: '#1F2937' }}>
                          {patient.phone}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(patient.phone)}
                        style={{
                          padding: '0.25rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Copy size={14} color="#6B7280" />
                      </motion.button>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: '#F9FAFB',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={16} color="#6B7280" />
                        <span style={{ fontSize: '0.875rem', color: '#1F2937' }}>
                          {patient.email}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(patient.email)}
                        style={{
                          padding: '0.25rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Copy size={14} color="#6B7280" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Status Actions */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151'
              }}>
                Cambiar Estado:
              </span>
              
              <div style={{
                padding: '0.375rem 0.75rem',
                background: getStatusBgColor(appointment.status),
                color: getStatusColor(appointment.status),
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {getStatusIcon(appointment.status)}
                {getStatusLabel(appointment.status)}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {(['confirmada', 'check-in', 'no-show', 'cancelada'] as AppointmentStatus[])
                .filter(status => status !== appointment.status && canChangeToStatus(appointment.status, status))
                .map(status => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: getStatusBgColor(status),
                      color: getStatusColor(status),
                      border: `1px solid ${getStatusColor(status)}20`,
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {getStatusIcon(status)}
                    {getStatusLabel(status)}
                  </motion.button>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  border: '1px solid #DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Video size={16} />
                Videollamada
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #D1FAE5',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <MessageSquare size={16} />
                Mensaje
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
