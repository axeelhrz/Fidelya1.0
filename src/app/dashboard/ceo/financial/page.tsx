'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, BarChart3, PieChart, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FinancialPanel from '@/components/dashboard/FinancialPanel';

export default function FinancialIntelligencePage() {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #EFF3FB 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(36, 99, 235, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
        `
      }} />

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem'
      }}>
        {/* Header con navegación de regreso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <button
            onClick={() => router.push('/dashboard/ceo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#6B7280',
              transition: 'all 0.2s ease',
              marginBottom: '2rem',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <ArrowLeft size={16} />
            Volver al Centro de Comando
          </button>

          <div style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(36, 99, 235, 0.3)'
              }}
            >
              <DollarSign size={40} color="white" />
            </motion.div>

            <h1 style={{ 
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Inteligencia Financiera
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6B7280',
              maxWidth: '700px', 
              margin: '0 auto 2rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: 1.6
            }}>
              Análisis predictivo avanzado con machine learning para optimización de ingresos y gestión financiera inteligente
            </p>

            {/* Métricas rápidas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              {[
                { icon: TrendingUp, label: 'Crecimiento', value: '+23.5%', color: '#10B981' },
                { icon: BarChart3, label: 'Ingresos', value: '$45,230', color: '#2463EB' },
                { icon: PieChart, label: 'Margen', value: '34.2%', color: '#F59E0B' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <metric.icon size={24} color={metric.color} style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C1E21', marginBottom: '0.25rem' }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Panel financiero principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FinancialPanel />
        </motion.div>
      </div>
    </div>
  );
}
