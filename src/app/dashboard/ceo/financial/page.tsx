'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ArrowLeft,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import { useFinancialData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function FinancialIntelligencePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useFinancialData();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Calcular métricas en tiempo real
  const getRealtimeMetrics = () => {
    if (!data) {
      return [
        { icon: TrendingUp, label: 'Crecimiento', value: '0%', color: '#6B7280', loading: true },
        { icon: BarChart3, label: 'Ingresos', value: '€0', color: '#6B7280', loading: true },
        { icon: PieChart, label: 'Margen', value: '0%', color: '#6B7280', loading: true },
        { icon: Clock, label: 'Pendientes', value: '€0', color: '#6B7280', loading: true }
      ];
    }

    const marginPercentage = data.totalRevenue > 0 
      ? ((data.totalProfit / data.totalRevenue) * 100) 
      : 0;

    return [
      { 
        icon: TrendingUp, 
        label: 'Crecimiento', 
        value: formatPercentage(data.averageGrowth), 
        color: data.averageGrowth > 0 ? '#10B981' : data.averageGrowth < 0 ? '#EF4444' : '#6B7280',
        loading: false
      },
      { 
        icon: BarChart3, 
        label: 'Ingresos', 
        value: formatCurrency(data.totalRevenue), 
        color: '#2463EB',
        loading: false
      },
      { 
        icon: PieChart, 
        label: 'Margen', 
        value: `${marginPercentage.toFixed(1)}%`, 
        color: marginPercentage > 30 ? '#10B981' : marginPercentage > 15 ? '#F59E0B' : '#EF4444',
        loading: false
      },
      { 
        icon: Clock, 
        label: 'Pendientes', 
        value: formatCurrency(data.pendingPayments), 
        color: data.pendingPayments > 5000 ? '#EF4444' : data.pendingPayments > 2000 ? '#F59E0B' : '#10B981',
        loading: false
      }
    ];
  };

  const realtimeMetrics = getRealtimeMetrics();

  // Calcular estadísticas adicionales
  const getFinancialHealth = () => {
    if (!data) return { score: 0, status: 'unknown', message: 'Sin datos' };

    let score = 0;
    const factors = [];

    // Factor 1: Crecimiento (30%)
    if (data.averageGrowth > 15) {
      score += 30;
      factors.push('Crecimiento excelente');
    } else if (data.averageGrowth > 5) {
      score += 20;
      factors.push('Crecimiento bueno');
    } else if (data.averageGrowth > 0) {
      score += 10;
      factors.push('Crecimiento positivo');
    } else {
      factors.push('Crecimiento negativo');
    }

    // Factor 2: Margen de beneficio (25%)
    const margin = data.totalRevenue > 0 ? (data.totalProfit / data.totalRevenue) * 100 : 0;
    if (margin > 30) {
      score += 25;
      factors.push('Margen excelente');
    } else if (margin > 20) {
      score += 20;
      factors.push('Margen bueno');
    } else if (margin > 10) {
      score += 15;
      factors.push('Margen aceptable');
    } else {
      factors.push('Margen bajo');
    }

    // Factor 3: Pagos pendientes (25%)
    const pendingRatio = data.totalRevenue > 0 ? (data.pendingPayments / data.totalRevenue) * 100 : 0;
    if (pendingRatio < 5) {
      score += 25;
      factors.push('Cobros excelentes');
    } else if (pendingRatio < 10) {
      score += 20;
      factors.push('Cobros buenos');
    } else if (pendingRatio < 20) {
      score += 15;
      factors.push('Cobros regulares');
    } else {
      factors.push('Problemas de cobro');
    }

    // Factor 4: Volumen de sesiones (20%)
    if (data.totalSessions > 100) {
      score += 20;
      factors.push('Alto volumen');
    } else if (data.totalSessions > 50) {
      score += 15;
      factors.push('Volumen moderado');
    } else if (data.totalSessions > 20) {
      score += 10;
      factors.push('Volumen bajo');
    } else {
      factors.push('Volumen muy bajo');
    }

    let status: 'excellent' | 'good' | 'warning' | 'critical';
    let message: string;

    if (score >= 80) {
      status = 'excellent';
      message = 'Salud financiera excelente';
    } else if (score >= 60) {
      status = 'good';
      message = 'Salud financiera buena';
    } else if (score >= 40) {
      status = 'warning';
      message = 'Requiere atención';
    } else {
      status = 'critical';
      message = 'Situación crítica';
    }

    return { score, status, message, factors };
  };

  const financialHealth = getFinancialHealth();

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return Activity;
    }
  };

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

          {/* Header principal con estado de conexión */}
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
                background: error 
                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  : 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                boxShadow: error 
                  ? '0 20px 25px -5px rgba(239, 68, 68, 0.3)'
                  : '0 20px 25px -5px rgba(36, 99, 235, 0.3)'
              }}
            >
              {error ? <WifiOff size={40} color="white" /> : <DollarSign size={40} color="white" />}
            </motion.div>

            <h1 style={{ 
              fontSize: '3rem',
              background: error 
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Inteligencia Financiera
            </h1>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '1rem',
                border: error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {error ? <WifiOff size={16} color="#EF4444" /> : <Wifi size={16} color="#10B981" />}
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  color: error ? '#EF4444' : '#10B981'
                }}>
                  {error ? 'Sin conexión' : 'Conectado a Firebase'}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '1rem',
                border: '1px solid rgba(14, 165, 233, 0.2)'
              }}>
                <Clock size={16} color="#0EA5E9" />
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  color: '#0C4A6E'
                }}>
                  {currentTime.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6B7280',
              maxWidth: '700px', 
              margin: '0 auto 2rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: 1.6
            }}>
              {error 
                ? 'Conecta Firebase para ver análisis predictivo avanzado con machine learning'
                : 'Análisis predictivo avanzado con machine learning para optimización de ingresos y gestión financiera inteligente'
              }
            </p>

            {/* Acciones rápidas */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={refresh}
                loading={loading}
              >
                Actualizar Datos
              </Button>
              
              <Button
                variant="outline"
                icon={Download}
                onClick={() => {
                  if (data) {
                    const exportData = {
                      ...data,
                      exportDate: new Date().toISOString(),
                      centerId: user?.centerId
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `analisis-financiero-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                disabled={!data}
              >
                Exportar Análisis
              </Button>

              <Button
                variant="secondary"
                icon={Database}
                onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              >
                Firebase Console
              </Button>
            </div>

            {/* Métricas en tiempo real */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {realtimeMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Fondo decorativo */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '60px',
                      height: '60px',
                      background: `${metric.color}15`,
                      borderRadius: '50%',
                      opacity: 0.7
                    }}
                  />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {metric.loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <Database size={24} color="#6B7280" />
                      </motion.div>
                    ) : (
                      <metric.icon size={24} color={metric.color} style={{ marginBottom: '0.5rem' }} />
                    )}
                    
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 700, 
                      color: '#1C1E21', 
                      marginBottom: '0.25rem',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {metric.loading ? '...' : metric.value}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>
                      {metric.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Indicador de salud financiera */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${getHealthColor(financialHealth.status)}20`,
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {React.createElement(getHealthIcon(financialHealth.status), {
                    size: 32,
                    color: getHealthColor(financialHealth.status)
                  })}
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: getHealthColor(financialHealth.status),
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      Puntuación: {financialHealth.score}/100
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 0',
                      fontWeight: 500
                    }}>
                      {financialHealth.message}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {(financialHealth.factors ?? []).map((factor, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: `${getHealthColor(financialHealth.status)}15`,
                        color: getHealthColor(financialHealth.status),
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
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