'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  RotateCcw,
  ExternalLink,
  Plus
} from 'lucide-react';
import { usePatientData } from '@/hooks/usePatientData';

export function PatientAppointments() {
  const { data, loading } = usePatientData();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  if (loading || !data) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #E2E8F0',
          borderTop: '4px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const { upcomingAppointments } = data;

  // Mock data para historial de citas
  const pastAppointments = [
    {
      id: 'past1',
      date: new Date('2024-03-10'),
      time: '10:00',
      therapistName: 'Dra. Ana García',
      type: 'Sesión Individual',
      status: 'completed',
      location: 'Consulta 2',
      isVirtual: false,
      duration: 60,
      notes: 'Sesión muy productiva. Trabajamos técnicas de respiración.'
    },
    {
      id: 'past2',
      date: new Date('2024-03-03'),
      time: '10:00',
      therapistName: 'Dra. Ana García',
      type: 'Sesión Individual',
      status: 'completed',
      location: 'Videollamada',
      isVirtual: true,
      duration: 60,
      notes: 'Revisamos el progreso de las tareas asignadas.'
    },
    {
      id: 'past3',
      date: new Date('2024-02-26'),
      time: '10:00',
      therapistName: 'Dra. Ana García',
      type: 'Sesión Individual',
      status: 'completed',
      location: 'Consulta 2',
      isVirtual: false,
      duration: 60,
      notes: 'Primera sesión. Establecimos objetivos del tratamiento.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'scheduled': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'no-show': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#ECFDF5';
      case 'scheduled': return '#EFF6FF';
      case 'completed': return '#ECFDF5';
      case 'cancelled': return '#FEF2F2';
      case 'no-show': return '#FFFBEB';
      default: return '#F8FAFC';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'scheduled': return 'Programada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'no-show': return 'No asistió';
      default: return status;
    }
  };

  const isUpcoming = (date: Date) => {
    return date > new Date();
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1E293B',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Mis Citas
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            margin: '0.5rem 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Gestiona tus sesiones de terapia
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Plus size={16} />
          Solicitar Cita
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          padding: '0.5rem',
          marginBottom: '2rem'
        }}
      >
        {[
          { key: 'upcoming', label: 'Próximas Citas', count: upcomingAppointments.length },
          { key: 'history', label: 'Historial', count: pastAppointments.length }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ backgroundColor: activeTab === tab.key ? undefined : '#F8FAFC' }}
            onClick={() => setActiveTab(tab.key as 'upcoming' | 'history')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: activeTab === tab.key ? '#3B82F6' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#64748B',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
            <span style={{
              padding: '0.125rem 0.5rem',
              backgroundColor: activeTab === tab.key ? 'rgba(255, 255, 255, 0.2)' : '#E2E8F0',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {tab.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'upcoming' ? (
          <div>
            {upcomingAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    style={{
                      padding: '2rem',
                      backgroundColor: 'white',
                      borderRadius: '1rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{
                            padding: '0.75rem',
                            backgroundColor: appointment.isVirtual ? '#EFF6FF' : '#ECFDF5',
                            borderRadius: '0.75rem'
                          }}>
                            {appointment.isVirtual ? (
                              <Video size={24} color="#3B82F6" />
                            ) : (
                              <MapPin size={24} color="#10B981" />
                            )}
                          </div>
                          
                          <div>
                            <h3 style={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: '#1E293B',
                              margin: 0,
                              fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                              {appointment.type}
                            </h3>
                            <p style={{
                              fontSize: '1rem',
                              color: '#64748B',
                              margin: '0.25rem 0 0 0',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              con {appointment.therapistName}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem',
                          marginBottom: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} color="#64748B" />
                            <span style={{
                              fontSize: '0.875rem',
                              color: '#374151',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {appointment.date.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} color="#64748B" />
                            <span style={{
                              fontSize: '0.875rem',
                              color: '#374151',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {appointment.time} ({appointment.duration} min)
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {appointment.isVirtual ? (
                              <Video size={16} color="#64748B" />
                            ) : (
                              <MapPin size={16} color="#64748B" />
                            )}
                            <span style={{
                              fontSize: '0.875rem',
                              color: '#374151',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {appointment.location}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: getStatusBgColor(appointment.status),
                            color: getStatusColor(appointment.status),
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {getStatusLabel(appointment.status)}
                          </span>

                          {appointment.isVirtual && (
                            <span style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#EFF6FF',
                              color: '#3B82F6',
                              borderRadius: '1rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Videollamada
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {appointment.isVirtual && appointment.meetingLink && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.open(appointment.meetingLink, '_blank')}
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
                            <ExternalLink size={16} />
                            Unirse
                          </motion.button>
                        )}

                        {appointment.canReschedule && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1rem',
                              backgroundColor: '#F59E0B',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <RotateCcw size={16} />
                            Reprogramar
                          </motion.button>
                        )}

                        {appointment.canCancel && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1rem',
                              backgroundColor: 'transparent',
                              color: '#EF4444',
                              border: '1px solid #EF4444',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <XCircle size={16} />
                            Cancelar
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Therapist Info */}
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '0.75rem',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User size={20} color="#3B82F6" />
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {appointment.therapistName}
                          </h4>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748B',
                            margin: '0.125rem 0 0 0',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            Psicóloga Clínica
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #E2E8F0'
              }}>
                <Calendar size={48} color="#E2E8F0" style={{ marginBottom: '1rem' }} />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  No tienes citas programadas
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748B',
                  marginBottom: '2rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Solicita una nueva cita con tu terapeuta
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <Plus size={16} />
                  Solicitar Cita
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '0.5rem'
                    }}>
                      <CheckCircle size={20} color="#10B981" />
                    </div>
                    
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {appointment.type} - {appointment.therapistName}
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#64748B',
                        margin: '0.25rem 0 0 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {appointment.date.toLocaleDateString('es-ES')} • {appointment.time} • {appointment.duration} min
                      </p>
                    </div>
                  </div>

                  <span style={{
                    padding: '0.375rem 0.75rem',
                    backgroundColor: getStatusBgColor(appointment.status),
                    color: getStatusColor(appointment.status),
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>

                {appointment.notes && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      margin: 0,
                      fontStyle: 'italic',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      "{appointment.notes}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
