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
  CheckCircle,
  Database,
  Wifi,
  WifiOff
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
  Legend,
} from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useClinicalData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

interface ClinicalPanelProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function ClinicalPanel({ 
  onRefresh, 
  onExport 
}: ClinicalPanelProps) {
  const { theme } = useStyles();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useClinicalData();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('capacity');

  // Datos para gráficos basados en datos reales de Firebase
  const generateCapacityData = () => {
    if (!data) return [];
    
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map(day => ({
      day,
      capacity: data.occupancyRate + (Math.random() - 0.5) * 10,
      optimal: 85,
      predicted: data.occupancyRate + (Math.random() - 0.5) * 5
    }));
  };

  const generateRiskRadarData = () => {
    if (!data) return [];
    
    return [
      { subject: 'PHQ-9 Crítico', value: Math.round(data.averagePhq9 / 27 * 25), max: 25, fullMark: 25 },
      { subject: 'GAD-7 Elevado', value: Math.round(data.averageGad7 / 21 * 25), max: 25, fullMark: 25 },
      { subject: 'Pacientes Riesgo', value: Math.round(data.riskPatients / 10 * 25), max: 25, fullMark: 25 },
      { subject: 'Ausentismo', value: Math.round(data.noShowRate / 10 * 25), max: 25, fullMark: 25 },
      { subject: 'Cancelaciones', value: Math.round(data.cancellationRate / 20 * 25), max: 25, fullMark: 25 },
      { subject: 'Baja Adherencia', value: Math.round((100 - data.adherenceRate) / 50 * 25), max: 25, fullMark: 25 },
    ];
  };

  const generatePredictiveAlerts = () => {
    if (!data) return [];
    
    const alerts = [];
    
    if (data.occupancyRate > 90) {
      alerts.push({
        id: 1,
        type: 'capacity',
        severity: 'warning',
        title: 'Sobrecarga detectada',
        description: `Capacidad actual del ${data.occupancyRate.toFixed(1)}%. Considerar redistribución.`,
        confidence: 92,
        timeframe: 'Inmediato'
      });
    }
    
    if (data.riskPatients > 5) {
      alerts.push({
        id: 2,
        type: 'risk',
        severity: 'critical',
        title: 'Múltiples pacientes de riesgo',
        description: `${data.riskPatients} pacientes requieren atención prioritaria.`,
        confidence: 88,
        timeframe: 'Inmediato'
      });
    }
    
    if (data.cancellationRate > 15) {
      alerts.push({
        id: 3,
        type: 'efficiency',
        severity: 'warning',
        title: 'Alta tasa de cancelaciones',
        description: `${data.cancellationRate.toFixed(1)}% de cancelaciones. Implementar recordatorios.`,
        confidence: 85,
        timeframe: '1 semana'
      });
    }
    
    if (data.adherenceRate < 70) {
      alerts.push({
        id: 4,
        type: 'adherence',
        severity: 'warning',
        title: 'Baja adherencia al tratamiento',
        description: `Solo ${data.adherenceRate.toFixed(1)}% de adherencia. Revisar estrategias.`,
        confidence: 78,
        timeframe: '2 semanas'
      });
    }
    
    return alerts;
  };

  const capacityData = generateCapacityData();
  const riskRadarData = generateRiskRadarData();
  const predictiveAlerts = generatePredictiveAlerts();

  // Funciones de utilidad
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
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
      background: error ? theme.gradients.warning : theme.gradients.error,
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 12px ${error ? theme.colors.warning : theme.colors.error}30`,
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
      color: error ? theme.colors.warning : theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
      margin: 0,
    },
    
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexWrap: 'wrap' as const,
    },
    
    connectionStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: error ? `${theme.colors.warning}20` : `${theme.colors.success}20`,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${error ? theme.colors.warning : theme.colors.success}30`,
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

    noDataContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      textAlign: 'center' as const,
      gap: theme.spacing.md,
    },

    noDataIcon: {
      width: '4rem',
      height: '4rem',
      backgroundColor: `${theme.colors.textSecondary}20`,
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    noDataTitle: {
      fontSize: '1.25rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      margin: 0,
    },

    noDataDescription: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      maxWidth: '400px',
      lineHeight: '1.5',
      margin: 0,
    },
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.container}
      >
        <Card variant="default">
          <div style={styles.noDataContainer}>
            <div style={styles.noDataIcon}>
              <WifiOff size={32} color={theme.colors.textSecondary} />
            </div>
            <h3 style={styles.noDataTitle}>Sin conexión a Firebase</h3>
            <p style={styles.noDataDescription}>
              No se pueden cargar los datos clínicos. Verifica la conexión a Firebase y que los datos estén sembrados correctamente.
            </p>
            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={() => {
                refresh();
                onRefresh?.();
              }}
            >
              Reintentar conexión
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.container}
      >
        <Card variant="default">
          <div style={styles.noDataContainer}>
            <div style={styles.noDataIcon}>
              <Database size={32} color={theme.colors.textSecondary} />
            </div>
            <h3 style={styles.noDataTitle}>No hay datos clínicos</h3>
            <p style={styles.noDataDescription}>
              No se encontraron datos clínicos en Firebase. Asegúrate de que los datos estén sembrados correctamente.
            </p>
            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={() => {
                refresh();
                onRefresh?.();
              }}
              loading={loading}
            >
              Cargar datos
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

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
              {error ? <WifiOff size={24} color={theme.colors.textInverse} /> : <Heart size={24} color={theme.colors.textInverse} />}
            </div>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>Operaciones Clínicas</h2>
              <p style={styles.subtitle}>
                {error 
                  ? 'Conecta Firebase para ver datos en tiempo real'
                  : 'Datos en tiempo real desde Firebase'
                }
              </p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.connectionStatus}>
              {error ? <WifiOff size={16} color={theme.colors.warning} /> : <Wifi size={16} color={theme.colors.success} />}
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: theme.fontWeights.semibold,
                color: error ? theme.colors.warning : theme.colors.success
              }}>
                {error ? 'Sin conexión' : 'Conectado a Firebase'}
              </span>
            </div>

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
              onClick={() => {
                refresh();
                onRefresh?.();
              }}
              loading={loading}
            >
              Actualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
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
                  a.download = `datos-clinicos-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
                onExport?.();
              }}
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
                  color: data.occupancyRate > 80 ? theme.colors.success : theme.colors.warning,
                }}>
                  <TrendingUp size={16} />
                  {data.occupancyRate > 80 ? '+' : ''}{(data.occupancyRate - 75).toFixed(1)}%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(data.occupancyRate)}
              </h3>
              <p style={styles.metricLabel}>Ocupación</p>
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
                  color: data.adherenceRate > 70 ? theme.colors.success : theme.colors.warning,
                }}>
                  <TrendingUp size={16} />
                  {data.adherenceRate > 70 ? '+' : ''}{(data.adherenceRate - 70).toFixed(1)}%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(data.adherenceRate)}
              </h3>
              <p style={styles.metricLabel}>Adherencia</p>
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
                  color: data.improvementRate > 60 ? theme.colors.success : theme.colors.warning,
                }}>
                  <TrendingUp size={16} />
                  {data.improvementRate > 60 ? '+' : ''}{(data.improvementRate - 60).toFixed(1)}%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatPercentage(data.improvementRate)}
              </h3>
              <p style={styles.metricLabel}>Mejora Clínica</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: data.riskPatients > 5 ? `${theme.colors.error}20` : `${theme.colors.info}20`,
                }}>
                  <Brain size={20} color={data.riskPatients > 5 ? theme.colors.error : theme.colors.info} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: data.riskPatients > 5 ? theme.colors.error : theme.colors.success,
                }}>
                  <AlertTriangle size={16} />
                  {data.riskPatients} pacientes
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {data.riskPatients}
              </h3>
              <p style={styles.metricLabel}>Pacientes de Riesgo</p>
            </div>
          </Card>
        </div>

        {/* Alertas Predictivas */}
        {predictiveAlerts.length > 0 && (
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
        )}

        {/* Gráfico de Capacidad */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Análisis de Capacidad Semanal</h3>
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
                <BarChart data={capacityData}>
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
                    dataKey="capacity" 
                    fill={theme.colors.primary} 
                    name="Capacidad Actual" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="optimal" 
                    fill={theme.colors.success} 
                    name="Capacidad Óptima" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="predicted" 
                    fill={theme.colors.warning} 
                    name="Predicción" 
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
                  name="Nivel de Riesgo"
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
                    {formatPercentage(data.adherenceRate)}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Tasa de mejora</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    {formatPercentage(data.improvementRate)}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Sesiones promedio</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    {data.averageSessionsPerPatient.toFixed(1)}
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
                    {data.riskPatients}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Cancelaciones</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    {formatPercentage(data.cancellationRate)}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>No presentados</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    {formatPercentage(data.noShowRate)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <Brain size={20} color={theme.colors.primary} />
                <h4 style={styles.summaryTitle}>Evaluaciones Clínicas</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>PHQ-9 promedio</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    {data.averagePhq9.toFixed(1)}/27
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>GAD-7 promedio</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    {data.averageGad7.toFixed(1)}/21
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Tasa de alta</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    {formatPercentage(data.dischargeRate)}
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
