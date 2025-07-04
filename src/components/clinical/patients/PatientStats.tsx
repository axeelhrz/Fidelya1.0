'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Activity,
  Calendar,
  TrendingUp,
  Heart
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';

interface PatientStatsProps {
  patients: ExtendedPatient[];
}

export function PatientStats({ patients }: PatientStatsProps) {
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const stats = React.useMemo(() => {
    const total = patients.length;
    const active = patients.filter(p => p.status === 'active').length;
    const inactive = patients.filter(p => p.status === 'inactive').length;
    const discharged = patients.filter(p => p.status === 'discharged').length;
    const pending = patients.filter(p => p.status === 'pending').length;
    
    const highRisk = patients.filter(p => ['high', 'critical'].includes(p.riskLevel)).length;
    const mediumRisk = patients.filter(p => p.riskLevel === 'medium').length;
    const lowRisk = patients.filter(p => p.riskLevel === 'low').length;
    
    const totalSessions = patients.reduce((sum, p) => sum + (p.totalSessions || 0), 0);
    const avgSessions = total > 0 ? Math.round(totalSessions / total) : 0;
    
    const avgAge = total > 0 ? Math.round(
      patients.reduce((sum, p) => sum + calculateAge(p.dateOfBirth), 0) / total
    ) : 0;
    
    const recentSessions = patients.filter(p => {
      if (!p.lastSession) return false;
      const daysDiff = Math.ceil(
        (new Date().getTime() - new Date(p.lastSession).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7;
    }).length;

    const upcomingAppointments = patients.filter(p => {
      if (!p.nextAppointment) return false;
      const daysDiff = Math.ceil(
        (new Date(p.nextAppointment).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff >= 0 && daysDiff <= 7;
    }).length;

    const avgAdherence = total > 0 ? Math.round(
      patients.reduce((sum, p) => sum + (p.adherenceRate || 0), 0) / total
    ) : 0;

    return {
      total,
      active,
      inactive,
      discharged,
      pending,
      highRisk,
      mediumRisk,
      lowRisk,
      avgSessions,
      avgAge,
      recentSessions,
      upcomingAppointments,
      avgAdherence
    };
  }, [patients]);

  const statCards = [
    {
      title: 'Total Pacientes',
      value: stats.total,
      icon: Users,
      color: '#6366F1',
      bgColor: '#EEF2FF',
      change: null,
      description: 'Pacientes en cartera'
    },
    {
      title: 'Pacientes Activos',
      value: stats.active,
      icon: UserCheck,
      color: '#10B981',
      bgColor: '#ECFDF5',
      change: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%',
      description: 'En tratamiento activo'
    },
    {
      title: 'Alto Riesgo',
      value: stats.highRisk,
      icon: AlertTriangle,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      change: stats.total > 0 ? `${Math.round((stats.highRisk / stats.total) * 100)}%` : '0%',
      description: 'Requieren atención prioritaria'
    },
    {
      title: 'Sesiones Promedio',
      value: stats.avgSessions,
      icon: Activity,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      change: null,
      description: 'Por paciente'
    },
    {
      title: 'Edad Promedio',
      value: `${stats.avgAge} años`,
      icon: Heart,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      change: null,
      description: 'De la cartera de pacientes'
    },
    {
      title: 'Citas Esta Semana',
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      change: null,
      description: 'Próximos 7 días'
    },
    {
      title: 'Adherencia Promedio',
      value: `${stats.avgAdherence}%`,
      icon: TrendingUp,
      color: '#10B981',
      bgColor: '#ECFDF5',
      change: stats.avgAdherence >= 80 ? '+' : stats.avgAdherence >= 60 ? '=' : '-',
      description: 'Cumplimiento del tratamiento'
    },
    {
      title: 'Sesiones Recientes',
      value: stats.recentSessions,
      icon: Activity,
      color: '#6366F1',
      bgColor: '#EEF2FF',
      change: null,
      description: 'Últimos 7 días'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
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
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '1rem' 
            }}>
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
              
              {stat.change && (
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
              )}
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
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: '0 0 0.25rem 0',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                {stat.title}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#9CA3AF',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                {stat.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
