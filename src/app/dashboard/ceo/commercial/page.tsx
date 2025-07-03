'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ArrowLeft,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import { useCommercialData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function MarketingIntelligencePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useCommercialData();
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
    return `${value.toFixed(1)}%`;
  };

  // Calcular métricas en tiempo real
  const getRealtimeMetrics = () => {
    if (!data) {
      return [
        { icon: TrendingUp, label: 'Conversión', value: '0%', color: '#6B7280', loading: true },
        { icon: Users, label: 'Leads', value: '0', color: '#6B7280', loading: true },
        { icon: BarChart3, label: 'ROI', value: '0%', color: '#6B7280', loading: true },
        { icon: DollarSign, label: 'CAC', value: '€0', color: '#6B7280', loading: true }
      ];
    }

    // Calcular ROI promedio
    const avgROI = data.monthlyTrends.length > 0 
      ? data.monthlyTrends.reduce((sum, trend) => sum + trend.roas, 0) / data.monthlyTrends.length
      : 0;

    return [
      { 
        icon: TrendingUp, 
        label: 'Conversión', 
        value: formatPercentage(data.conversionRate), 
        color: data.conversionRate > 20 ? '#10B981' : data.conversionRate > 15 ? '#F59E0B' : '#EF4444',
        loading: false
      },
      { 
        icon: Users, 
        label: 'Leads', 
        value: data.totalLeads.toLocaleString(), 
        color: '#2463EB',
        loading: false
      },
      { 
        icon: BarChart3, 
        label: 'ROI', 
        value: `${(avgROI * 100).toFixed(0)}%`, 
        color: avgROI > 3 ? '#10B981' : avgROI > 2 ? '#F59E0B' : '#EF4444',
        loading: false
      },
      { 
        icon: DollarSign, 
        label: 'CAC', 
        value: formatCurrency(data.averageCAC), 
        color: data.averageCAC < 60 ? '#10B981' : data.averageCAC < 80 ? '#F59E0B' : '#EF4444',
        loading: false
      }
    ];
  };

  const realtimeMetrics = getRealtimeMetrics();

  // Calcular salud comercial
  const getCommercialHealth = () => {
    if (!data) return { score: 0, status: 'unknown', message: 'Sin datos', insights: [] };

    let score = 0;
    const insights = [];

    // Factor 1: Tasa de conversión (30%)
    if (data.conversionRate > 25) {
      score += 30;
      insights.push('Conversión excelente');
    } else if (data.conversionRate > 20) {
      score += 25;
      insights.push('Conversión muy buena');
    } else if (data.conversionRate > 15) {
      score += 20;
      insights.push('Conversión buena');
    } else if (data.conversionRate > 10) {
      score += 15;
      insights.push('Conversión regular');
    } else {
      score += 5;
      insights.push('Conversión baja');
    }

    // Factor 2: CAC (25%)
    if (data.averageCAC < 50) {
      score += 25;
      insights.push('CAC excelente');
    } else if (data.averageCAC < 70) {
      score += 20;
      insights.push('CAC bueno');
    } else if (data.averageCAC < 90) {
      score += 15;
      insights.push('CAC aceptable');
    } else {
      score += 5;
      insights.push('CAC alto');
    }

    // Factor 3: Ratio LTV/CAC (25%)
    if (data.ltvCacRatio > 4) {
      score += 25;
      insights.push('Ratio LTV/CAC excelente');
    } else if (data.ltvCacRatio > 3) {
      score += 20;
      insights.push('Ratio LTV/CAC bueno');
    } else if (data.ltvCacRatio > 2) {
      score += 15;
      insights.push('Ratio LTV/CAC aceptable');
    } else {
      score += 5;
      insights.push('Ratio LTV/CAC bajo');
    }

    // Factor 4: Volumen de leads (20%)
    if (data.totalLeads > 200) {
      score += 20;
      insights.push('Alto volumen de leads');
    } else if (data.totalLeads > 100) {
      score += 15;
      insights.push('Volumen moderado');
    } else if (data.totalLeads > 50) {
      score += 10;
      insights.push('Volumen bajo');
    } else {
      score += 5;
      insights.push('Volumen muy bajo');
    }

    let status: 'excellent' | 'good' | 'warning' | 'critical';
    let message: string;

    if (score >= 85) {
      status = 'excellent';
      message = 'Performance comercial excelente';
    } else if (score >= 70) {
      status = 'good';
      message = 'Performance comercial buena';
    } else if (score >= 50) {
      status = 'warning';
      message = 'Requiere optimización';
    } else {
      status = 'critical';
      message = 'Necesita atención urgente';
    }

    return { score, status, message, insights };
  };

  const commercialHealth = getCommercialHealth();

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
      default: return BarChart3;
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
          radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
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
                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                boxShadow: error 
                  ? '0 20px 25px -5px rgba(239, 68, 68, 0.3)'
                  : '0 20px 25px -5px rgba(245, 158, 11, 0.3)'
              }}
            >
              {error ? <WifiOff size={40} color="white" /> : <Target size={40} color="white" />}
            </motion.div>

            <h1 style={{ 
              fontSize: '3rem',
              background: error 
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Marketing Inteligente
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
                ? 'Conecta Firebase para ver optimización automática de conversión'
                : 'Optimización automática de conversión con análisis de comportamiento y estrategias predictivas'
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
                    a.download = `analisis-comercial-${new Date().toISOString().split('T')[0]}.json`;
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

            {/* Indicador de salud comercial */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${getHealthColor(commercialHealth.status)}20`,
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {React.createElement(getHealthIcon(commercialHealth.status), {
                    size: 32,
                    color: getHealthColor(commercialHealth.status)
                  })}
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: getHealthColor(commercialHealth.status),
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      Puntuación Comercial: {commercialHealth.score}/100
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 0',
                      fontWeight: 500
                    }}>
                      {commercialHealth.message}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem'
                }}>
                  {commercialHealth.insights.map((insight, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: `${getHealthColor(commercialHealth.status)}15`,
                        color: getHealthColor(commercialHealth.status),
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      {insight}
                    </span>
                  ))}
                </div>

                {/* Métricas detalladas */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(249, 250, 251, 0.5)',
                  borderRadius: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                      {formatPercentage(data.conversionRate)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Tasa conversión
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                      {formatCurrency(data.averageCAC)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      CAC promedio
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                      {data.ltvCacRatio.toFixed(1)}x
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Ratio LTV/CAC
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                      {data.totalLeads.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Total leads
                    </div>
                  </div>
                </div>

                {/* Recomendaciones de IA */}
                {data.ltvCacRatio < 3 && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Zap size={16} color="#8B5CF6" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#8B5CF6' }}>
                        Recomendación IA
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                      El ratio LTV/CAC está por debajo del óptimo (3x). Considera optimizar las campañas de menor rendimiento 
                      y enfocar presupuesto en los canales con mejor conversión.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Panel comercial principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CommercialPanel />
        </motion.div>
      </div>
    </div>
  );
}
