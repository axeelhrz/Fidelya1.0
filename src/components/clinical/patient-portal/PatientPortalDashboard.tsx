'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Target,
  TrendingUp,
  Bell,
  User,
  Activity,
  CheckCircle,
  Video,
  X,
} from 'lucide-react';
import type { 
  Patient, 
  PatientPortalData, 
  PatientPortalTask,
  PatientAppointmentView,
  PatientCommunication,
} from '@/types/clinical';

interface PatientPortalDashboardProps {
  patient: Patient;
  portalData: PatientPortalData;
  onUpdateProfile?: (data: Partial<Patient>) => void;
  onScheduleAppointment?: (appointmentData: Partial<PatientAppointmentView>) => void;
  onCompleteTask: (taskId: string) => void;
  onMakePayment?: (amount: number, description: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
  progress?: number;
}


export function PatientPortalDashboard({
  patient,
  portalData,
  onCompleteTask,
}: PatientPortalDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [emotionalState, setEmotionalState] = useState<number>(5);
  const [dailyMoodLog, setDailyMoodLog] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: Activity },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'tasks', label: 'Tareas', icon: Target },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤗', '😍', '🥳', '✨'];
  const moodLabels = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Muy bien', 'Excelente', 'Fantástico', 'Increíble', 'Eufórico', 'Perfecto'];

  const achievements: Achievement[] = [
    { 
      id: 'first-session', 
      title: 'Primera Sesión', 
      description: 'Completaste tu primera sesión', 
      icon: '🎯', 
      unlocked: true, 
      date: new Date('2024-01-15') 
    },
    { 
      id: 'week-streak', 
      title: 'Semana Completa', 
      description: '7 días seguidos registrando tu estado de ánimo', 
      icon: '🔥', 
      unlocked: true, 
      date: new Date('2024-01-22') 
    },
    { 
      id: 'task-master', 
      title: 'Maestro de Tareas', 
      description: 'Completaste 10 tareas terapéuticas', 
      icon: '⭐', 
      unlocked: true, 
      date: new Date('2024-02-01') 
    },
    { 
      id: 'progress-hero', 
      title: 'Héroe del Progreso', 
      description: 'Mejora del 50% en evaluaciones', 
      icon: '🏆', 
      unlocked: false, 
      progress: 75 
    },
    { 
      id: 'consistency-king', 
      title: 'Rey de la Consistencia', 
      description: '30 días seguidos de actividad', 
      icon: '👑', 
      unlocked: false, 
      progress: 23 
    }
  ];

  // Safe data access with fallbacks
  const upcomingAppointments = portalData.upcomingAppointments?.slice(0, 3) || [];
  const pendingTasks = portalData.tasks?.filter((task: PatientPortalTask) => task.status !== 'completed').slice(0, 4) || [];
  const notifications = portalData.notifications || [];

  const calculateAdherenceRate = (): number => {
    if (!portalData.tasks || portalData.tasks.length === 0) return 0;
    const completed = portalData.tasks.filter((task: PatientPortalTask) => task.status === 'completed').length;
    return Math.round((completed / portalData.tasks.length) * 100);
  };

  const getStreakDays = (): number => {
    // Simulated streak calculation - in real app this would come from mood logs
    return 7; // Default value
  };

  const handleMoodSubmit = () => {
    // Handle mood submission logic here
    console.log('Mood submitted:', { mood: emotionalState, notes: dailyMoodLog });
    setDailyMoodLog('');
  };

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Section */}
      <div style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1rem',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '0 0 0.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          ¡Hola, {patient.firstName}! 👋
        </h2>
        <p style={{
          fontSize: '1rem',
          margin: '0 0 1.5rem 0',
          opacity: 0.9,
          fontFamily: 'Inter, sans-serif'
        }}>
          Bienvenido a tu portal personal. Aquí puedes gestionar tus citas, completar tareas y seguir tu progreso.
        </p>
        
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {upcomingAppointments.length}
            </div>
            <div style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              fontFamily: 'Inter, sans-serif'
            }}>
              Próximas Citas
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {pendingTasks.length}
            </div>
            <div style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              fontFamily: 'Inter, sans-serif'
            }}>
              Tareas Pendientes
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {calculateAdherenceRate()}%
            </div>
            <div style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              fontFamily: 'Inter, sans-serif'
            }}>
              Adherencia
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {getStreakDays()}
            </div>
            <div style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              fontFamily: 'Inter, sans-serif'
            }}>
              Días Seguidos
            </div>
          </div>
        </div>
      </div>

      {/* Daily Mood Check */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1F2937',
          margin: '0 0 1rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          ¿Cómo te sientes hoy? 💭
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {moodEmojis.map((emoji, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEmotionalState(index + 1)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: emotionalState === index + 1 ? '3px solid #6366F1' : '2px solid #E5E7EB',
                backgroundColor: emotionalState === index + 1 ? '#EEF2FF' : 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        <div style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          marginBottom: '1rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Estado actual: <strong>{moodLabels[emotionalState - 1]}</strong>
        </div>

        <textarea
          value={dailyMoodLog}
          onChange={(e) => setDailyMoodLog(e.target.value)}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '0.75rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            resize: 'vertical',
            marginBottom: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="¿Qué ha influido en tu estado de ánimo hoy? (opcional)"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMoodSubmit}
          style={{
            padding: '0.75rem 1.5rem',
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
          Registrar Estado de Ánimo
        </motion.button>
      </div>

      {/* Quick Actions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Upcoming Appointments */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Próximas Citas
            </h4>
            <Calendar size={20} color="#6366F1" />
          </div>

          {upcomingAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingAppointments.map((appointment: PatientAppointmentView, index: number) => (
                <div key={appointment.id || index} style={{
                  padding: '0.75rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.5rem',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {appointment.isVirtual ? 'Teleconsulta' : 'Presencial'}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {appointment.date.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {appointment.time} • Dr. {appointment.therapistName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              No tienes citas programadas
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('appointments')}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              marginTop: '1rem'
            }}
          >
            Ver Todas las Citas
          </motion.button>
        </div>

        {/* Pending Tasks */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Tareas Pendientes
            </h4>
            <Target size={20} color="#F59E0B" />
          </div>

          {pendingTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingTasks.map((task: PatientPortalTask, index: number) => (
                <div key={task.id || index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '0.5rem',
                  border: '1px solid #FDE68A'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onCompleteTask(task.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #F59E0B',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {task.status === 'completed' && <CheckCircle size={12} color="#F59E0B" />}
                  </motion.button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#92400E',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {task.title}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#78350F',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Vence: {task.dueDate?.toLocaleDateString('es-ES') || 'Sin fecha límite'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              ¡Excelente! No tienes tareas pendientes
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('tasks')}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#F59E0B',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              marginTop: '1rem'
            }}
          >
            Ver Todas las Tareas
          </motion.button>
        </div>
      </div>

      {/* Achievements Section */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Logros Recientes 🏆
          </h4>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAchievements(true)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#EEF2FF',
              color: '#4338CA',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Ver Todos
          </motion.button>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              style={{
                minWidth: '200px',
                padding: '1rem',
                backgroundColor: '#F0FDF4',
                borderRadius: '0.75rem',
                border: '1px solid #BBF7D0',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem'
              }}>
                {achievement.icon}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#15803D',
                marginBottom: '0.25rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {achievement.title}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#166534',
                fontFamily: 'Inter, sans-serif'
              }}>
                {achievement.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1F2937',
          margin: 0,
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Mis Citas
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          <Calendar size={16} />
          Agendar Nueva Cita
        </motion.button>
      </div>

      {/* Calendar View */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          backgroundColor: '#E5E7EB',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} style={{
              padding: '0.75rem',
              backgroundColor: '#F9FAFB',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            }}>
              {day}
            </div>
          ))}
          
          {/* Calendar days would be generated here */}
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} style={{
              padding: '0.75rem',
              backgroundColor: 'white',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {i + 1 <= 31 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments List */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#1F2937',
          margin: '0 0 1rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Próximas Citas
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {upcomingAppointments.map((appointment: PatientAppointmentView, index: number) => (
            <motion.div
              key={appointment.id || index}
              whileHover={{ scale: 1.02 }}
              style={{
                padding: '1.5rem',
                backgroundColor: '#F9FAFB',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  {appointment.isVirtual ? (
                    <Video size={20} color="#6366F1" />
                  ) : (
                    <User size={20} color="#10B981" />
                  )}
                  <div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {appointment.isVirtual ? 'Teleconsulta' : 'Cita Presencial'}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Dr. {appointment.therapistName}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: appointment.isVirtual ? '#EEF2FF' : '#F0FDF4',
                  borderRadius: '0.5rem',
                  border: `1px solid ${appointment.isVirtual ? '#C7D2FE' : '#BBF7D0'}`
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: appointment.isVirtual ? '#4338CA' : '#15803D',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Calendar size={14} />
                  <span>{appointment.date.toLocaleDateString('es-ES')}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Clock size={14} />
                  <span>{appointment.time}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Clock size={14} />
                  <span>{appointment.location}</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem'
              }}>
                {appointment.isVirtual && appointment.meetingLink && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#6366F1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Video size={14} />
                    Unirse a la Sesión
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
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Calendar size={14} />
                    Reprogramar
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        Mis Tareas Terapéuticas
      </h3>

      {/* Progress Overview */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Progreso General
          </h4>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#10B981',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {calculateAdherenceRate()}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#E5E7EB',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${calculateAdherenceRate()}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              backgroundColor: '#10B981',
              borderRadius: '6px'
            }}
          />
        </div>

        <p style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          margin: '0.5rem 0 0 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          Has completado {portalData.tasks?.filter((t: PatientPortalTask) => t.status === 'completed').length || 0} de {portalData.tasks?.length || 0} tareas asignadas
        </p>
      </div>

      {/* Tasks List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {portalData.tasks?.map((task: PatientPortalTask, index: number) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onCompleteTask(task.id)}
                disabled={task.status === 'completed'}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${task.status === 'completed' ? '#10B981' : '#E5E7EB'}`,
                  backgroundColor: task.status === 'completed' ? '#10B981' : 'white',
                  cursor: task.status === 'completed' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '0.25rem'
                }}
              >
                {task.status === 'completed' && <CheckCircle size={14} color="white" />}
              </motion.button>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <h5 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: task.status === 'completed' ? '#6B7280' : '#1F2937',
                    margin: 0,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {task.title}
                  </h5>

                  <div style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '0.25rem',
                    border: '1px solid #BBF7D0'
                  }}>
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: '#15803D',
                      fontFamily: 'Inter, sans-serif',
                      textTransform: 'uppercase'
                    }}>
                      {task.type}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {task.description}
                </p>

                {task.instructions && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F0F9FF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E0F2FE',
                    marginBottom: '1rem'
                  }}>
                    <h6 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#0C4A6E',
                      margin: '0 0 0.5rem 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Instrucciones:
                    </h6>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0369A1',
                      margin: 0,
                      lineHeight: '1.5',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {task.instructions}
                    </p>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {task.dueDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      <span>Vence: {task.dueDate.toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Target size={12} />
                    <span>Estado: {task.status === 'completed' ? 'Completada' : 'Pendiente'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )) || []}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        Pagos y Facturación
      </h3>

      {/* Payment Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#10B981',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            €0
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Total Pagado
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#F59E0B',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            €0
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Pendiente
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#6366F1',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            0
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Facturas
          </div>
        </div>
      </div>

      {/* Quick Payment */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#1F2937',
          margin: '0 0 1rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Pago Rápido
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'end'
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
              Monto a Pagar (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="0.00"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
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
            <CreditCard size={16} />
            Pagar Ahora
          </motion.button>
        </div>
      </div>

      {/* Payment History */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#1F2937',
          margin: '0 0 1rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Historial de Pagos
        </h4>

        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6B7280',
          fontFamily: 'Inter, sans-serif'
        }}>
          No hay historial de pagos disponible
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F9FAFB'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Portal del Paciente
            </h1>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: activeTab === tab.id ? '#EEF2FF' : 'transparent',
                      color: activeTab === tab.id ? '#4338CA' : '#6B7280',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Header Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  padding: '0.5rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Bell size={20} color="#6B7280" />
                {notifications.filter((n: PatientCommunication) => !n.readAt).length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%'
                  }} />
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '300px',
                      backgroundColor: 'white',
                                            borderRadius: '0.75rem',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      zIndex: 1000
                    }}
                  >
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        margin: 0,
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        Notificaciones
                      </h4>
                    </div>
                    <div style={{
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {notifications.slice(0, 5).map((notification: PatientCommunication, index: number) => (
                        <div key={notification.id || index} style={{
                          padding: '1rem',
                          borderBottom: index < 4 ? '1px solid #F3F4F6' : 'none',
                          backgroundColor: notification.readAt ? 'white' : '#F0F9FF'
                        }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.25rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {notification.subject}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            marginBottom: '0.25rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {notification.content}
                          </div>
                          <div style={{
                            fontSize: '0.625rem',
                            color: '#9CA3AF',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {notification.sentAt.toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div style={{
                          padding: '2rem',
                          textAlign: 'center',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          No hay notificaciones
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#F3F4F6',
              borderRadius: '0.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#6366F1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.firstName?.[0]}{patient.lastName?.[0]}
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {patient.firstName} {patient.lastName}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Paciente
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'documents' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <FileText size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Documentos
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Aquí podrás acceder a tus documentos, formularios y reportes
            </p>
          </div>
        )}
        {activeTab === 'progress' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <TrendingUp size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Mi Progreso
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Visualiza tu evolución y progreso terapéutico
            </p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <User size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Mi Perfil
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Gestiona tu información personal y preferencias
            </p>
          </div>
        )}
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
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
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Mis Logros 🏆
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAchievements(false)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#6B7280" />
                </motion.button>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.5rem',
                      backgroundColor: achievement.unlocked ? '#F0FDF4' : '#F9FAFB',
                      borderRadius: '0.75rem',
                      border: `1px solid ${achievement.unlocked ? '#BBF7D0' : '#E5E7EB'}`,
                      opacity: achievement.unlocked ? 1 : 0.6
                    }}
                  >
                    <div style={{
                      fontSize: '2.5rem',
                      filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
                    }}>
                      {achievement.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: achievement.unlocked ? '#15803D' : '#6B7280',
                        marginBottom: '0.25rem',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {achievement.title}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: achievement.unlocked ? '#166534' : '#9CA3AF',
                        marginBottom: '0.5rem',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {achievement.description}
                      </div>

                      {achievement.unlocked ? (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#15803D',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Desbloqueado el {achievement.date?.toLocaleDateString('es-ES')}
                        </div>
                      ) : achievement.progress !== undefined ? (
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.25rem'
                          }}>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Progreso
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {achievement.progress}%
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${achievement.progress}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              style={{
                                height: '100%',
                                backgroundColor: '#6366F1',
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Bloqueado
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

