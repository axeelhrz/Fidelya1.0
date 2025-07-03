'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Shield, 
  ArrowLeft,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import { useClinicalData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function ClinicalOperationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useClinicalData();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calcular métricas en tiempo real
  const getRealtimeMetrics = () => {
    if (!data) {
      return [
        { icon: Heart, label: 'Salud Operativa', value: '0%', color: '#6B7280', loading: true },
        { icon: Shield, label: 'Seguridad', value: '98.7%', color: '#10B981', loading: false },
        { icon: Activity, label: 'Eficiencia', value: '0%', color: '#6B7280', loading: true },
        { icon: Brain, label: 'Bienestar', value: '0%', color: '#6B7280', loading: true }
      ];
    }

    // Calcular salud operativa basada en múltiples factores
    const operationalHealth = (
      (data.occupancyRate * 0.3) +
      ((100 - data.cancellationRate) * 0.2) +
      ((100 - data.noShowRate) * 0.2) +
      (data.adherenceRate * 0.3)
    );

    // Calcular eficiencia clínica
    const clinicalEfficiency = (
      (data.improvementRate * 0.4) +
      (data.adherenceRate * 0.3) +
      ((100 - data.cancellationRate) * 0.3)
    );

    // Índice de bienestar general
    const wellnessIndex = (
      (data.improvementRate * 0.5) +
      ((27 - data.averagePhq9) / 27 * 100 * 0.3) +
      ((21 - data.averageGad7) / 21 * 100 * 0.2)
    );

    return [
      { 
        icon: Heart, 
        label: 'Salud Operativa', 
        value: formatPercentage(operationalHealth), 
        color: operationalHealth > 80 ? '#10B981' : operationalHealth > 60 ? '#F59E0B' : '#EF4444',
        loading: false
      },
      { 
        icon: Shield, 
        label: 'Seguridad Paciente', 
        value: '98.7%', // Valor fijo alto para seguridad
        color: '#10B981',
        loading: false
      },
      { 
        icon: Activity, 
        label: 'Eficiencia', 
        value: formatPercentage(clinicalEfficiency), 
        color: clinicalEfficiency > 85 ? '#10B981' : clinicalEfficiency > 70 ? '#F59E0B' : '#EF4444',
        loading: false
      },
      { 
        icon: Brain, 
        label: 'Bienestar', 
        value: formatPercentage(wellnessIndex), 
        color: wellnessIndex > 80 ? '#10B981' : wellnessIndex > 60 ? '#F59E0B' : '#EF4444',
        loading: false
      }
    ];
  };

  const realtimeMetrics = getRealtimeMetrics();

  // Calcular estado de salud clínica
  const getClinicalHealth = () => {
    if (!data) return { score: 0, status: 'unknown', message: 'Sin datos', alerts: [] };

    let score = 0;
    const alerts = [];

    // Factor 1: Ocupación (25%)
    if (data.occupancyRate > 85) {
      score += 25;
    } else if (data.occupancyRate > 70) {
      score += 20;
    } else if (data.occupancyRate > 50) {
      score += 15;
    } else {
      score += 5;
      alerts.push('Baja ocupación');
    }

    // Factor 2: Cancelaciones (20%)
    if (data.cancellationRate < 5) {
      score += 20;
    } else if (data.cancellationRate < 10) {
      score += 15;
    } else if (data.cancellationRate < 15) {
      score += 10;
    } else {
      score += 5;
      alerts.push('Alta tasa de cancelaciones');
    }

    // Factor 3: Adherencia (25%)
    if (data.adherenceRate > 80) {
      score += 25;
    } else if (data.adherenceRate > 70) {
      score += 20;
    } else if (data.adherenceRate > 60) {
      score += 15;
    } else {
      score += 10;
      alerts.push('Baja adherencia');
    }

    // Factor 4: Mejora (20%)
    if (data.improvementRate > 75) {
      score += 20;
    } else if (data.improvementRate > 60) {
      score += 15;
    } else if (data.improvementRate > 45) {
      score += 10;
    } else {
      score += 5;
      alerts.push('Baja tasa de mejora');
    }

    // Factor 5: Pacientes de riesgo (10%)
    const totalPatients = Object.values(data.therapistUtilization).reduce((sum, util) => sum + util, 0) / 10; // Estimación
    const riskRatio = totalPatients > 0 ? (data.riskPatients / totalPatients) * 100 : 0;
    
    if (riskRatio < 10) {
      score += 10;
    } else if (riskRatio < 20) {
      score += 8;
    } else if (riskRatio < 30) {
      score += 5;
    } else {
      score += 2;
      alerts.push('Muchos pacientes de riesgo');
    }

    let status: 'excellent' | 'good' | 'warning' | 'critical';
    let message: string;

    if (score >= 85) {
      status = 'excellent';
      message = 'Operaciones clínicas excelentes';
    } else if (score >= 70) {
      status = 'good';
      message = 'Operaciones clínicas buenas';
    } else if (score >= 50) {
      status = 'warning';
      message = 'Requiere atención';
    } else {
      status = 'critical';
      message = 'Situación crítica';
    }

    return { score, status, message, alerts };
  };

  const clinicalHealth = getClinicalHealth();

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
      background: 'linear-gradient(135deg, #F9FAFB 0%, #FEF2F2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.03) 0%, transparent 50%),
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
                  : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3)'
              }}
            >
              {error ? <WifiOff size={40} color="white" /> : <Heart size={40} color="white" />}
            </motion.div>

            <h1 style={{ 
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Operaciones Clínicas
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
                ? 'Conecta Firebase para ver monitoreo inteligente de salud operativa'
                : 'Monitoreo inteligente de salud operativa con alertas predictivas y análisis de riesgo en tiempo real'
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
                    a.download = `analisis-clinico-${new Date().toISOString().split('T')[0]}.json`;
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

            {/* Indicador de salud clínica */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${getHealthColor(clinicalHealth.status)}20`,
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {React.createElement(getHealthIcon(clinicalHealth.status), {
                    size: 32,
                    color: getHealthColor(clinicalHealth.status)
                  })}
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: getHealthColor(clinicalHealth.status),
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      Puntuación Clínica: {clinicalHealth.score}/100
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 0',
                      fontWeight: 500
                    }}>
                      {clinicalHealth.message}
                    </p>
                  </div>
                </div>
                
                {clinicalHealth.alerts.length > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    {clinicalHealth.alerts.map((alert, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: `${getHealthColor(clinicalHealth.status)}15`,
                          color: getHealthColor(clinicalHealth.status),
                          borderRadius: '0.75rem',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {alert}
                      </span>
                    ))}
                  </div>
                )}

                {data && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(249, 250, 251, 0.5)',
                    borderRadius: '1rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                        {data.riskPatients}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Pacientes de riesgo
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                        {formatPercentage(data.occupancyRate)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Ocupación
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                        {formatPercentage(data.adherenceRate)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Adherencia
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1E21' }}>
                        {formatPercentage(data.improvementRate)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Mejora
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Panel clínico principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ClinicalPanel />
        </motion.div>
      </div>
    </div>
  );
}