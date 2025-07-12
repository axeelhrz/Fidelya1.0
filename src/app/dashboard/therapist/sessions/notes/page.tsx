'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotesStats } from '@/hooks/useNotes';
import NotesManager from '@/components/clinical/notes/NotesManager';

export default function NotesPage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useNotesStats();

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
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
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
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
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <FileText size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#1E40AF',
              textShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
            }}>
              Notas Clínicas de Sesiones
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#2563EB',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Redactá, firmá y exportá tus notas clínicas
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#2563EB' }}>
                {user?.therapistInfo?.specialties?.join(', ') || 'Psicología Clínica'}
              </span>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1E40AF'
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
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.1)'
          }}>
            <FileText size={18} color="#3B82F6" />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#1E40AF' 
            }}>
              Gestión Profesional de Notas
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {[
        {
          title: 'Total de Notas',
          value: statsLoading ? '...' : stats?.total || 0,
          icon: FileText,
          color: '#3B82F6',
          bgColor: '#EFF6FF',
          change: '+12 esta semana'
        },
        {
          title: 'Pendientes de Firma',
          value: statsLoading ? '...' : stats?.pending || 0,
          icon: Clock,
          color: '#F59E0B',
          bgColor: '#FFFBEB',
          change: `${stats?.pending || 0} requieren atención`
        },
        {
          title: 'Firmadas',
          value: statsLoading ? '...' : stats?.signed || 0,
          icon: CheckCircle,
          color: '#10B981',
          bgColor: '#ECFDF5',
          change: `${Math.round(((stats?.signed || 0) / (stats?.total || 1)) * 100)}% completadas`
        },
        {
          title: 'Alertas de Riesgo',
          value: statsLoading ? '...' : stats?.riskAlerts || 0,
          icon: AlertTriangle,
          color: '#EF4444',
          bgColor: '#FEF2F2',
          change: stats?.riskAlerts ? 'Requieren revisión' : 'Sin alertas'
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
                margin: '0 0 0.5rem 0',
                fontWeight: 500
              }}>
                {stat.title}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: stat.color,
                margin: 0,
                fontWeight: 600
              }}>
                {stat.change}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
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
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
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
        
        {/* Componente principal de gestión de notas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <NotesManager />
        </motion.div>
      </div>
    </div>
  );
}
