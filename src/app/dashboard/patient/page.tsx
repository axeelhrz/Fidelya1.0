'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  TrendingUp,
  AlertCircle,
  FileText,
  User,
  Bell,
  Award
} from 'lucide-react';
import { usePatientData } from '@/hooks/usePatientData';

export default function PatientDashboard() {
  const { data, loading, markTaskCompleted } = usePatientData();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E2E8F0',
            borderTop: '4px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            fontFamily: 'Inter, sans-serif'
          }}>
            Cargando tu información...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem'
      }}>
        <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '1rem' }} />
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1E293B',
          marginBottom: '0.5rem',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Error al cargar los datos
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#64748B',
          fontFamily: 'Inter, sans-serif'
        }}>
          No se pudieron cargar tus datos. Por favor, intenta de nuevo.
        </p>
      </div>
    );
  }

  const { patient, upcomingAppointments, tasks, progressSummary, moodLogs, notifications } = data;

  const pendingTasks = tasks.filter(task => task.status === 'assigned' || task.status === 'in-progress');
  const unreadNotifications = notifications.filter(notif => !notif.read);
  const recentMood = moodLogs?.[0];

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10B981';
    if (mood >= 6) return '#84CC16';
    if (mood >= 4) return '#F59E0B';
    if (mood >= 2) return '#EF4444';
    return '#DC2626';
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: 0,
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          ¡Hola, {patient.firstName}! 👋
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#64748B',
          margin: '0.5rem 0 0 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          Aquí tienes un resumen de tu progreso y próximas actividades
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Next Appointment */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#EFF6FF'
            }}>
              <Calendar size={20} color="#3B82F6" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Próxima Cita
            </h3>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#3B82F6',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {upcomingAppointments[0].date.toLocaleDateString('es-ES', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: '0.25rem 0 0 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                {upcomingAppointments[0].time} - {upcomingAppointments[0].therapistName}
              </p>
            </div>
          ) : (
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              No hay citas programadas
            </p>
          )}
        </div>

        {/* Progress */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ECFDF5'
            }}>
              <TrendingUp size={20} color="#10B981" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Mi Progreso
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#10B981',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {progressSummary.adherenceRate}%
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Adherencia al tratamiento
            </p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#FFFBEB'
            }}>
              <CheckCircle size={20} color="#F59E0B" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Tareas Pendientes
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#F59E0B',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {pendingTasks.length}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {pendingTasks.length === 1 ? 'Tarea por completar' : 'Tareas por completar'}
            </p>
          </div>
        </div>

        {/* Current Mood */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#FEF2F2'
            }}>
              <Heart size={20} color="#EF4444" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Estado Emocional
            </h3>
          </div>
          
          {recentMood ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {getMoodEmoji(recentMood.mood)}
              </span>
              <div>
                <p style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: getMoodColor(recentMood.mood),
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {recentMood.mood}/10
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  margin: '0.25rem 0 0 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Último registro
                </p>
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              No hay registros recientes
            </p>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}
      className="responsive-grid"
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Próximas Citas
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#EFF6FF',
                  color: '#3B82F6',
                  border: '1px solid #DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Ver todas
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {appointment.therapistName}
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#64748B',
                        margin: '0.25rem 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {appointment.date.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })} • {appointment.time}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: appointment.isVirtual ? '#DBEAFE' : '#ECFDF5',
                          color: appointment.isVirtual ? '#3B82F6' : '#10B981',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {appointment.isVirtual ? 'Virtual' : 'Presencial'}
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#64748B',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {appointment.isVirtual && appointment.meetingLink && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          Unirse
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Tareas Pendientes
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#EFF6FF',
                  color: '#3B82F6',
                  border: '1px solid #DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Ver plan completo
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {task.title}
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#64748B',
                        margin: '0.25rem 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {task.description}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                        {task.dueDate && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} color="#64748B" />
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#64748B',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Vence: {task.dueDate.toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}
                        
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: task.priority === 'high' ? '#FEF2F2' : 
                                         task.priority === 'medium' ? '#FFFBEB' : '#F0FDF4',
                          color: task.priority === 'high' ? '#EF4444' : 
                                 task.priority === 'medium' ? '#F59E0B' : '#10B981',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {task.priority === 'high' ? 'Alta' : 
                           task.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => markTaskCompleted(task.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        marginLeft: '1rem'
                      }}
                    >
                      <CheckCircle size={16} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Acciones Rápidas
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: Heart, label: 'Registrar Estado Emocional', color: '#EF4444', bg: '#FEF2F2' },
                { icon: Calendar, label: 'Agendar Cita', color: '#3B82F6', bg: '#EFF6FF' },
                { icon: FileText, label: 'Ver Documentos', color: '#10B981', bg: '#ECFDF5' },
                { icon: User, label: 'Actualizar Perfil', color: '#F59E0B', bg: '#FFFBEB' }
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, backgroundColor: action.bg }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1E293B',
                    textAlign: 'left',
                    width: '100%',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: action.bg
                  }}>
                    <action.icon size={16} color={action.color} />
                  </div>
                  {action.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
                            padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Notificaciones
              </h3>
              {unreadNotifications.length > 0 && (
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {unreadNotifications.length}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: notification.read ? '#F8FAFC' : '#EFF6FF',
                    borderRadius: '0.5rem',
                    border: `1px solid ${notification.read ? '#E2E8F0' : '#DBEAFE'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      backgroundColor: notification.priority === 'high' ? '#FEF2F2' : 
                                     notification.priority === 'medium' ? '#FFFBEB' : '#F0FDF4',
                      marginTop: '0.125rem'
                    }}>
                      <Bell size={12} color={
                        notification.priority === 'high' ? '#EF4444' : 
                        notification.priority === 'medium' ? '#F59E0B' : '#10B981'
                      } />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {notification.subject}
                      </h5>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        margin: '0.25rem 0 0 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {notification.content}
                      </p>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#94A3B8',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {notification.sentAt.toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Mi Progreso
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Tasks Progress */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1E293B',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Tareas Completadas
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#10B981',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {progressSummary.completedTasks}/{progressSummary.totalTasks}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(progressSummary.completedTasks / progressSummary.totalTasks) * 100}%`,
                    height: '100%',
                    backgroundColor: '#10B981',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Adherence Rate */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1E293B',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Adherencia al Tratamiento
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#3B82F6',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {progressSummary.adherenceRate}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressSummary.adherenceRate}%`,
                    height: '100%',
                    backgroundColor: '#3B82F6',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Achievement Badge */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#FFFBEB',
                borderRadius: '0.5rem',
                border: '1px solid #FDE68A',
                textAlign: 'center'
              }}>
                <Award size={24} color="#F59E0B" style={{ marginBottom: '0.5rem' }} />
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#92400E',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  ¡Excelente progreso!
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#A16207',
                  margin: '0.25rem 0 0 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Mantén el buen trabajo
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

