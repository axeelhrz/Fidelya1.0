'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
}

interface FinancialPanelProps {
  data?: FinancialData[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function FinancialPanel({ 
  data = [], 
  loading = false, 
  onRefresh, 
  onExport 
}: FinancialPanelProps) {
  const { theme } = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data si no se proporciona
  const mockData: FinancialData[] = [
    { period: 'Ene', revenue: 45000, expenses: 32000, profit: 13000, growth: 8.5 },
    { period: 'Feb', revenue: 52000, expenses: 35000, profit: 17000, growth: 15.6 },
    { period: 'Mar', revenue: 48000, expenses: 33000, profit: 15000, growth: 6.7 },
    { period: 'Abr', revenue: 58000, expenses: 38000, profit: 20000, growth: 20.8 },
    { period: 'May', revenue: 62000, expenses: 40000, profit: 22000, growth: 6.9 },
    { period: 'Jun', revenue: 67000, expenses: 42000, profit: 25000, growth: 8.1 },
  ];

  const financialData = data.length > 0 ? data : mockData;

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
      background: theme.gradients.primary,
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadows.glow,
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
  };

  const calculateTotalRevenue = () => {
    return financialData.reduce((sum, item) => sum + item.revenue, 0);
  };

  const calculateTotalExpenses = () => {
    return financialData.reduce((sum, item) => sum + item.expenses, 0);
  };

  const calculateTotalProfit = () => {
    return financialData.reduce((sum, item) => sum + item.profit, 0);
  };

  const calculateAverageGrowth = () => {
    return financialData.reduce((sum, item) => sum + item.growth, 0) / financialData.length;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
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
          {payload.map((entry: any, index: number) => (
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
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
              <DollarSign size={24} color={theme.colors.textInverse} />
            </div>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>Panel Financiero</h2>
              <p style={styles.subtitle}>Análisis de ingresos, gastos y rentabilidad</p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.filterContainer}>
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    ...styles.filterButton,
                    ...(selectedPeriod === period ? styles.filterButtonActive : {})
                  }}
                >
                  {period === 'week' ? 'Semana' : 
                   period === 'month' ? 'Mes' :
                   period === 'quarter' ? 'Trimestre' : 'Año'}
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
                  backgroundColor: `${theme.colors.success}20`,
                }}>
                  <TrendingUp size={20} color={theme.colors.success} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +12.5%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatCurrency(calculateTotalRevenue())}
              </h3>
              <p style={styles.metricLabel}>Ingresos Totales</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.warning}20`,
                }}>
                  <TrendingDown size={20} color={theme.colors.warning} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.warning,
                }}>
                  <TrendingUp size={16} />
                  +8.2%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatCurrency(calculateTotalExpenses())}
              </h3>
              <p style={styles.metricLabel}>Gastos Totales</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.primary}20`,
                }}>
                  <DollarSign size={20} color={theme.colors.primary} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +18.7%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {formatCurrency(calculateTotalProfit())}
              </h3>
              <p style={styles.metricLabel}>Beneficio Neto</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.info}20`,
                }}>
                  <Calendar size={20} color={theme.colors.info} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +{calculateAverageGrowth().toFixed(1)}%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {calculateAverageGrowth().toFixed(1)}%
              </h3>
              <p style={styles.metricLabel}>Crecimiento Promedio</p>
            </div>
          </Card>
        </div>

        {/* Gráfico Principal */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Evolución Financiera</h3>
            <div style={styles.chartControls}>
              <div style={styles.filterContainer}>
                {['revenue', 'expenses', 'profit'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    style={{
                      ...styles.filterButton,
                      ...(selectedMetric === metric ? styles.filterButtonActive : {})
                    }}
                  >
                    {metric === 'revenue' ? 'Ingresos' : 
                     metric === 'expenses' ? 'Gastos' : 'Beneficios'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.chartContent}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Cargando datos financieros...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.success} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.success} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.warning} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.warning} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.borderLight} />
                  <XAxis 
                    dataKey="period" 
                    stroke={theme.colors.textSecondary}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={theme.colors.textSecondary}
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {selectedMetric === 'revenue' && (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.colors.success}
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                      name="Ingresos"
                    />
                  )}
                  
                  {selectedMetric === 'expenses' && (
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke={theme.colors.warning}
                      strokeWidth={3}
                      fill="url(#colorExpenses)"
                      name="Gastos"
                    />
                  )}
                  
                  {selectedMetric === 'profit' && (
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke={theme.colors.primary}
                      strokeWidth={3}
                      fill="url(#colorProfit)"
                      name="Beneficios"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Resumen y Alertas */}
        <div style={styles.summaryGrid}>
          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <CheckCircle size={20} color={theme.colors.success} />
                <h4 style={styles.summaryTitle}>Indicadores Positivos</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Crecimiento mensual</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    +12.5%
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Margen de beneficio</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    28.3%
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>ROI trimestral</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    +15.8%
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
                  <span style={styles.summaryItemLabel}>Gastos operativos</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    +8.2%
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Cuentas por cobrar</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    €12,500
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Días de cobranza</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    45 días
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <Clock size={20} color={theme.colors.info} />
                <h4 style={styles.summaryTitle}>Próximas Acciones</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Revisión presupuesto</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.info}}>
                    15 Jul
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Cierre trimestral</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.info}}>
                    30 Jul
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Auditoría externa</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.info}}>
                    05 Ago
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