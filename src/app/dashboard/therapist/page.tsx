'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  Heart,
  Star,
  CheckCircle,
  Phone,
  MessageSquare,
  Video,
  Award,
  Target,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PatientSummary {
  id: string;
  name: string;
  avatar?: string;
  nextAppointment?: Date;
  lastSession?: Date;
  status: 'active' | 'inactive' | 'completed';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  diagnosis?: string;
}

interface AppointmentSummary {
  id: string;
  patientName: string;
  time: string;
  type: 'individual' | 'group' | 'family';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  duration: number;
  notes?: string;
}

interface TherapistStats {
  totalPatients: number;
  activePatients: number;
  todayAppointments: number;
  weeklyHours: number;
  completionRate: number;
  averageRating: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats] = useState<TherapistStats>({
    totalPatients: 24,
    activePatients: 18,
    todayAppointments: 6,
    weeklyHours: 32,
    completionRate: 94.5,
    averageRating: 4.8,
    monthlyGoal: 100,
    monthlyProgress: 78
  });

  // Datos simulados de pacientes
  const [patients] = useState<PatientSummary[]>([
    {
      id: '1',
      name: 'María González',
      nextAppointment: new Date(2024, 11, 20, 10, 0),
      lastSession: new Date(2024, 11, 13, 10, 0),
      status: 'active',
      progress: 75,
      priority: 'high',
      diagnosis: 'Trastorno de Ansiedad'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      nextAppointment: new Date(2024, 11, 20, 14, 0),
      lastSession: new Date(2024, 11, 15, 14, 0),
      status: 'active',
      progress: 60,
      priority: 'medium',
      diagnosis: 'Depresión Mayor'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      nextAppointment: new Date(2024, 11, 21, 9, 0),
      lastSession: new Date(2024, 11, 14, 9, 0),
      status: 'active',
      progress: 85,
      priority: 'low',
      diagnosis: 'Terapia de Pareja'
    }
  ]);

  // Datos simulados de citas de hoy
  const [todayAppointments] = useState<AppointmentSummary[]>([
    {
      id: '1',
      patientName: 'María González',
      time: '10:00',
      type: 'individual',
      status: 'scheduled',
      duration: 60
    },
    {
      id: '2',
      patientName: 'Carlos Rodríguez',
      time: '14:00',
      type: 'individual',
      status: 'scheduled',
      duration: 60
    },
    {
      id: '3',
      patientName: 'Familia Pérez',
      time: '16:00',
      type: 'family',
      status: 'scheduled',
      duration: 90
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#F59E0B';
      case 'completed': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Efectos de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Heart size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#065F46',
              textShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
            }}>
              Panel del Terapeuta
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#047857',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Bienvenida, {user?.firstName || 'Dra. Ana García'}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#047857' }}>
                {user?.therapistInfo?.specialties?.join(', ') || 'Psicología Clínica'}
              </span>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#065F46'
              }}>
                Licencia: {user?.therapistInfo?.license || 'PSY-12345'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)'
          }}>
            <Clock size={18} color="#10B981" />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#065F46' 
            }}>
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <Calendar size={18} color="#10B981" />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#065F46' 
            }}>
              {currentTime.toLocaleDateString('es-ES', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStatsCards = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {[
        {
          title: 'Pacientes Activos',
          value: stats.activePatients,
          total: stats.totalPatients,
          icon: Users,
          color: '#10B981',
          bgColor: '#ECFDF5',
          change: '+12%'
        },
        {
          title: 'Citas Hoy',
          value: stats.todayAppointments,
          icon: Calendar,
          color: '#3B82F6',
          bgColor: '#EFF6FF',
          change: '+2'
        },
        {
          title: 'Horas Semanales',
          value: stats.weeklyHours,
          icon: Clock,
          color: '#F59E0B',
          bgColor: '#FFFBEB',
          change: '+4h'
        },
        {
          title: 'Tasa de Éxito',
          value: `${stats.completionRate}%`,
          icon: Target,
          color: '#8B5CF6',
          bgColor: '#F3E8FF',
          change: '+2.1%'
        },
        {
          title: 'Calificación',
          value: stats.averageRating,
          icon: Star,
          color: '#EF4444',
          bgColor: '#FEF2F2',
          change: '+0.2'
        },
        {
          title: 'Meta Mensual',
          value: `${stats.monthlyProgress}%`,
          total: stats.monthlyGoal,
          icon: Award,
          color: '#06B6D4',
          bgColor: '#ECFEFF',
          change: '+8%'
        }
      ].map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ y: -4, scale: 1.02 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '80px',
              height: '80px',
              background: `${stat.color}08`,
              borderRadius: '50%'
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.875rem',
                  backgroundColor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <stat.icon size={20} color={stat.color} />
              </div>
              
              <div style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: `${stat.color}15`,
                color: stat.color,
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {stat.change}
              </div>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1C1E21',
                margin: '0 0 0.25rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {stat.value}
                {stat.total && (
                  <span style={{ fontSize: '1rem', color: '#6B7280', fontWeight: 400 }}>
                    /{stat.total}
                  </span>
                )}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                fontWeight: 500
              }}>
                {stat.title}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderTodaySchedule = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Calendar size={20} color="white" />
          </div>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Agenda de Hoy
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0'
            }}>
              {todayAppointments.length} citas programadas
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={16} />
          Nueva Cita
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {todayAppointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ x: 4, scale: 1.01 }}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
              borderRadius: '1rem',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {appointment.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1C1E21',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {appointment.patientName}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {appointment.time} • {appointment.duration} min
                    </span>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: appointment.type === 'individual' ? '#EFF6FF' : 
                                     appointment.type === 'family' ? '#F3E8FF' : '#ECFDF5',
                      color: appointment.type === 'individual' ? '#2563EB' : 
                             appointment.type === 'family' ? '#8B5CF6' : '#10B981',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {appointment.type === 'individual' ? 'Individual' : 
                       appointment.type === 'family' ? 'Familiar' : 'Grupal'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    padding: '0.5rem',
                    background: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Video size={16} color="#3B82F6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    padding: '0.5rem',
                    background: '#ECFDF5',
                    border: '1px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MessageSquare size={16} color="#10B981" />
                </motion.button>
                
                <CheckCircle size={20} color="#10B981" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderPatientsList = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={20} color="white" />
          </div>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Mis Pacientes
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0'
            }}>
              {patients.filter(p => p.status === 'active').length} pacientes activos
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.5rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Search size={16} color="#6B7280" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.5rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Filter size={16} color="#6B7280" />
          </motion.button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {patients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ x: 4, scale: 1.01 }}
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
              borderRadius: '1rem',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600
                }}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#1C1E21',
                      margin: 0
                    }}>
                      {patient.name}
                    </h4>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(patient.status)
                    }} />
                    <div style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: `${getPriorityColor(patient.priority)}15`,
                      color: getPriorityColor(patient.priority),
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {patient.priority === 'high' ? 'Alta' : 
                       patient.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {patient.diagnosis}
                    </span>
                    {patient.nextAppointment && (
                      <span style={{ fontSize: '0.875rem', color: '#3B82F6' }}>
                        Próxima: {patient.nextAppointment.toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Progreso:
                    </span>
                    <div style={{
                      flex: 1,
                      maxWidth: '200px',
                      height: '6px',
                      background: '#E5E7EB',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${patient.progress}%` }}
                        transition={{ delay: 0.5 + (0.1 * index), duration: 1 }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${getPriorityColor(patient.priority)}, ${getPriorityColor(patient.priority)}CC)`,
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600,
                      color: getPriorityColor(patient.priority)
                    }}>
                      {patient.progress}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    padding: '0.5rem',
                    background: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={16} color="#3B82F6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    padding: '0.5rem',
                    background: '#ECFDF5',
                    border: '1px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={16} color="#10B981" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
        `
      }} />

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {renderHeader()}
        {renderStatsCards()}
        
        <div
          className="dashboard-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem'
          }}
        >
          <div>
            {renderTodaySchedule()}
          </div>
          <div>
            {renderPatientsList()}
          </div>
        </div>
        <style jsx>{`
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          @media (max-width: 1024px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
