'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Clock,
  UserCheck,
  Phone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function ReceptionDashboard() {
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
          Panel de Recepción 📞
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#64748B',
          margin: '0.5rem 0 0 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          Gestiona las operaciones diarias del centro
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
        {/* Today's Appointments */}
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
              Citas de Hoy
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#3B82F6',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              24
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              3 pendientes de confirmar
            </p>
          </div>
        </div>

        {/* Waiting Patients */}
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
              <Clock size={20} color="#F59E0B" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              En Sala de Espera
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#F59E0B',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              5
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Tiempo promedio: 8 min
            </p>
          </div>
        </div>

        {/* Check-ins Today */}
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
              <UserCheck size={20} color="#10B981" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Check-ins Hoy
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#10B981',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              18
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              6 restantes
            </p>
          </div>
        </div>

        {/* Pending Calls */}
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
              <Phone size={20} color="#EF4444" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Llamadas Pendientes
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#EF4444',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              7
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Recordatorios y confirmaciones
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Acciones Rápidas
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { icon: Calendar, label: 'Programar Cita', color: '#3B82F6', bg: '#EFF6FF' },
            { icon: UserCheck, label: 'Check-in Paciente', color: '#10B981', bg: '#ECFDF5' },
            { icon: Phone, label: 'Hacer Llamada', color: '#EF4444', bg: '#FEF2F2' },
            { icon: MessageSquare, label: 'Enviar Mensaje', color: '#8B5CF6', bg: '#F3E8FF' },
            { icon: Users, label: 'Buscar Paciente', color: '#F59E0B', bg: '#FFFBEB' },
            { icon: AlertCircle, label: 'Reportar Incidencia', color: '#06B6D4', bg: '#ECFEFF' }
          ].map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, backgroundColor: action.bg }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: action.bg
              }}>
                <action.icon size={24} color={action.color} />
              </div>
              {action.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Actividad Reciente
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { time: '10:30', action: 'Check-in realizado', patient: 'María González', type: 'checkin' },
            { time: '10:15', action: 'Cita programada', patient: 'Carlos Rodríguez', type: 'appointment' },
            { time: '09:45', action: 'Llamada completada', patient: 'Ana López', type: 'call' },
            { time: '09:30', action: 'Mensaje enviado', patient: 'Luis Martín', type: 'message' }
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '0.5rem',
                border: '1px solid #E2E8F0'
              }}
            >
              <div style={{
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: activity.type === 'checkin' ? '#ECFDF5' :
                               activity.type === 'appointment' ? '#EFF6FF' :
                               activity.type === 'call' ? '#FEF2F2' : '#F3E8FF'
              }}>
                {activity.type === 'checkin' && <UserCheck size={16} color="#10B981" />}
                {activity.type === 'appointment' && <Calendar size={16} color="#3B82F6" />}
                {activity.type === 'call' && <Phone size={16} color="#EF4444" />}
                {activity.type === 'message' && <MessageSquare size={16} color="#8B5CF6" />}
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {activity.action}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  margin: '0.125rem 0 0 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {activity.patient}
                </p>
              </div>
              
              <span style={{
                fontSize: '0.75rem',
                color: '#94A3B8',
                fontFamily: 'Inter, sans-serif'
              }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
