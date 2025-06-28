'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Brain,
  Zap,
  AlertCircle,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ClinicalData {
  day: string;
  morning: number;
  afternoon: number;
  evening: number;
  predicted: number;
  optimal: number;
  alerts: number;
}

interface ClinicalPanelProps {
  data?: ClinicalData[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function ClinicalPanel({ 
  data = [], 
  loading = false, 
  onRefresh, 
  onExport 
}: ClinicalPanelProps) {
  const { theme } = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('capacity');

  // Mock data mejorado
  const mockClinicalData: ClinicalData[] = [
    { day: 'Lun', morning: 85, afternoon: 92, evening: 78, predicted: 88, optimal: 85, alerts: 1 },
    { day: 'Mar', morning: 90, afternoon: 88, evening: 82, predicted: 87, optimal: 85, alerts: 0 },
    { day: 'Mié', morning: 78, afternoon: 95, evening: 85, predicted: 86, optimal: 85, alerts: 2 },
    { day: 'Jue', morning: 88, afternoon: 90, evening: 80, predicted: 86, optimal: 85, alerts: 0 },
    { day: 'Vie', morning: 95, afternoon: 85, evening: 75, predicted: 85, optimal: 85, alerts: 1 },
    { day: 'Sáb', morning: 60, afternoon: 70, evening: 45, predicted: 58, optimal: 60, alerts: 0 },
    { day: 'Dom', morning: 45, afternoon: 55, evening: 35, predicted: 45, optimal: 50, alerts: 0 }
  ];

  const riskRadarData = [
    { subject: 'PHQ-9 Crítico', value: 12, max: 25, fullMark: 25 },
    { subject: 'GAD-7 Elevado', value: 8, max: 25, fullMark: 25 },
    { subject: 'Sin Progreso', value: 15, max: 25, fullMark: 25 },
    { subject: 'Ausentismo', value: 6, max: 25, fullMark: 25 },
    { subject: 'Medicación', value: 9, max: 25, fullMark: 25 },
    { subject: 'Crisis Recientes', value: 4, max: 25, fullMark: 25 },
  ];

  const predictiveAlerts = [
    {
      id: 1,
      type: 'capacity',
      severity: 'warning',
      title: 'Sobrecarga prevista - Miércoles tarde',
      description: 'Capacidad proyectada del 95%. Considerar redistribución de citas.',
      confidence: 87,
      timeframe: '2 días'
    },
    {
      id: 2,
      type: 'risk',
      severity: 'critical',
      title: 'Patrón de deterioro detectado',
      description: '3 pacientes muestran indicadores de empeoramiento en PHQ-9.',
      confidence: 92,
      timeframe: 'Inmediato'
    },
    {
      id: 3,
      type: 'efficiency',
      severity: 'info',
      title: 'Oportunidad de optimización',
      description: 'Reagrupar sesiones matutinas podría mejorar eficiencia 12%.',
      confidence: 78,
      timeframe: '1 semana'
    }
  ];

  const clinicalData = data.length > 0 ? data : mockClinicalData;

  // Funciones de utilidad
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  // Funciones de cálculo
  const calculateOperationalHealth = () => {
    const avgCapacity = clinicalData.reduce((sum, item) => 
      sum + (item.morning + item.afternoon + item.evening) / 3, 0) / clinicalData.length;
    return Math.round(avgCapacity * 100) / 100;
  };

  const calculatePatientSafety = () => {
    return 98.7;
  };

  const calculateClinicalEfficiency = () => {
    return 87.3;
  };

  const calculateWellnessIndex = () => {
    return 89.2;
  };

  const calculateRiskPatients = () => {
    return riskRadarData.reduce((sum, item) => sum + item.value, 0);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.borderLight}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.sm,
          boxShadow: theme.shadows.floating,
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.textPrimary,
            margin: '0 0 0.5rem 0',
          }}>
            {label}
          </p>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p key={index} style={{
              fontSize: '0.75rem',
              color: entry.color,
              margin: '0.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{
                width: '0.75rem',
                height: '0.75rem',
                backgroundColor: entry.color,
                borderRadius: '50%',
              }} />
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing.md,
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
      flexWrap: 'wrap' as const,
      gap: theme.spacing.md,
    },
    
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    
    headerIcon: {
      width: '3rem',
      height: '3rem',
      background: theme.gradients.error,
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 12px ${theme.colors.error}30`,
    },
    
    headerContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem',
    },
    
    title: {
      fontSize: '1.5rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      margin: 0,
    },
    
    subtitle: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
      margin: 0,
    },
    
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexWrap: 'wrap' as const,
    },
    
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: '0.5rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.borderLight}`,
    },
    
    filterButton: {
      padding: '0.5rem 1rem',
      borderRadius: theme.borderRadius.md,
      border: 'none',
      backgroundColor: 'transparent',
      color: theme.colors.textSecondary,
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.medium,
      cursor: 'pointer',
      transition: theme.animations.transition,
      outline: 'none',
    },
    
    filterButtonActive: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.primary,
      boxShadow: theme.shadows.card,
    },
    
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    
    metricCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    },
    
    metricHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    metricIcon: {
      padding: '0.5rem',
      borderRadius: theme.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    metricValue: {
      fontSize: '2rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      margin: 0,
    },
    
    metricLabel: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
      margin: 0,
    },
    
    metricChange: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
    },
    
    chartContainer: {
      marginBottom: theme.spacing.lg,
    },
    
    chartHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
      padding: `0 ${theme.spacing.md}`,
    },
    
    chartTitle: {
      fontSize: '1.125rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      margin: 0,
    },
    
    chartControls: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    chartContent: {
      height: '400px',
      padding: theme.spacing.md,
    },
    
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      flexDirection: 'column' as const,
      gap: theme.spacing.md,
    },
    
    loadingSpinner: {
      width: '2rem',
      height: '2rem',
      border: `3px solid ${theme.colors.borderLight}`,
      borderTop: `3px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    loadingText: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
    },
    
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: theme.spacing.md,
    },
    
    summaryCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    
    summaryHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    summaryTitle: {
      fontSize: '1rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      margin: 0,
    },
    
    summaryContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    
    summaryItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    
    summaryItemLabel: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
    },
    
    summaryItemValue: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
    },

    alertsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },

    alertCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      position: 'relative' as const,
      overflow: 'hidden',
    },

    alertHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    alertBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.sm,
      fontSize: '0.75rem',
      fontWeight: theme.fontWeights.semibold,
    },

    alertContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },

    alertTitle: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      margin: 0,
    },

    alertDescription: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      lineHeight: '1.4',
      margin: 0,
    },

    alertFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: theme.colors.textTertiary,
    },
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.container}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <Heart size={24} color={theme.colors.textInverse} />
            </div>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>Operaciones Clínicas</h2>
              <p style={styles.subtitle}>Monitoreo inteligente de salud operativa con alertas predictivas</p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.filterContainer}>
              {['day', 'week', 'month', 'quarter'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    ...styles.filterButton,
                    ...(selectedPeriod === period ? styles.filterButtonActive : {})
                  }}
                >
                  {period === 'day' ? 'Día' : 
                   period === 'week' ? 'Semana' :
                   period === 'month' ? 'Mes' : 'Trimestre'}
                </button>
              ))}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={onRefresh}
              loading={loading}
            >
              Actualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={onExport}
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas Principales */}
        <div style={styles.metricsGrid}>
          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.error}20`,
                }}>
                  <Heart size={20} color={theme.colors.error} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +2.3%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(calculateOperationalHealth())}
              </h3>
              <p style={styles.metricLabel}>Salud Operativa</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.success}20`,
                }}>
                  <Shield size={20} color={theme.colors.success} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +0.8%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(calculatePatientSafety())}
              </h3>
              <p style={styles.metricLabel}>Seguridad Paciente</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.warning}20`,
                }}>
                  <Zap size={20} color={theme.colors.warning} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +1.2%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(calculateClinicalEfficiency())}
              </h3>
              <p style={styles.metricLabel}>Eficiencia Clínica</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.info}20`,
                }}>
                  <Brain size={20} color={theme.colors.info} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +3.2%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(calculateWellnessIndex())}
              </h3>
              <p style={styles.metricLabel}>Índice Bienestar</p>
            </div>
          </Card>
        </div>

        {/* Alertas Predictivas */}
        <div style={styles.alertsGrid}>
          {predictiveAlerts.map((alert) => (
            <Card key={alert.id} variant="default" hover>
              <div style={styles.alertCard}>
                <div style={styles.alertHeader}>
                  <div style={{
                    ...styles.metricIcon,
                    backgroundColor: `${getSeverityColor(alert.severity)}20`,
                  }}>
                    <AlertTriangle size={16} color={getSeverityColor(alert.severity)} />
                  </div>
                  <div style={{
                    ...styles.alertBadge,
                    backgroundColor: `${getSeverityColor(alert.severity)}20`,
                    color: getSeverityColor(alert.severity),
                  }}>
                    {alert.confidence}% confianza
                  </div>
                </div>
                <div style={styles.alertContent}>
                  <h4 style={styles.alertTitle}>{alert.title}</h4>
                  <p style={styles.alertDescription}>{alert.description}</p>
                </div>
                <div style={styles.alertFooter}>
                  <span>{alert.timeframe}</span>
                  <ArrowRight size={14} color={getSeverityColor(alert.severity)} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gráfico de Capacidad */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Pronóstico de Capacidad - Próximos 7 días</h3>
            <div style={styles.chartControls}>
              <div style={styles.filterContainer}>
                {['capacity', 'risk', 'efficiency'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    style={{
                      ...styles.filterButton,
                      ...(selectedMetric === metric ? styles.filterButtonActive : {})
                    }}
                  >
                    {metric === 'capacity' ? 'Capacidad' : 
                     metric === 'risk' ? 'Riesgo' : 'Eficiencia'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.chartContent}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Cargando datos clínicos...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.borderLight} />
                  <XAxis 
                    dataKey="day" 
                    stroke={theme.colors.textSecondary}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={theme.colors.textSecondary}
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="morning" 
                    fill={theme.colors.success} 
                    name="Mañana" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="afternoon" 
                    fill={theme.colors.warning} 
                    name="Tarde" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="evening" 
                    fill={theme.colors.info} 
                    name="Noche" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Gráfico de Radar de Riesgo */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Análisis de Factores de Riesgo</h3>
            <div style={styles.chartControls}>
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
              >
                Filtrar
              </Button>
            </div>
          </div>
          
          <div style={styles.chartContent}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskRadarData}>
                <PolarGrid stroke={theme.colors.borderLight} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 11, fill: theme.colors.textSecondary }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 25]} 
                  tick={{ fontSize: 9, fill: theme.colors.textTertiary }}
                />
                <Radar
                  name="Pacientes en Riesgo"
                  dataKey="value"
                  stroke={theme.colors.error}
                  fill={theme.colors.error}
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resumen y Métricas Adicionales */}
        <div style={styles.summaryGrid}>
          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <CheckCircle size={20} color={theme.colors.success} />
                <h4 style={styles.summaryTitle}>Indicadores Positivos</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Adherencia tratamiento</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    73.2%
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Satisfacción pacientes</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    4.7/5
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Tiempo respuesta crisis</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    8 min
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <AlertCircle size={20} color={theme.colors.warning} />
                <h4 style={styles.summaryTitle}>Áreas de Atención</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Pacientes en riesgo</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    {calculateRiskPatients()}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Cancelaciones</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    8.3%
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Tiempo promedio sesión</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    52 min
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <Brain size={20} color={theme.colors.primary} />
                <h4 style={styles.summaryTitle}>Recomendaciones IA</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Implementar recordatorios WhatsApp</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    -23% cancelaciones
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Optimizar horarios matutinos</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    +12% eficiencia
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Seguimiento telefónico</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    +15% adherencia
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  );
}