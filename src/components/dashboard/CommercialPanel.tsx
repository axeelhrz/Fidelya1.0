'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Users,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Star,
  Wifi,
  WifiOff,
  Database,
  Play,
  Pause,
  Eye,
  Edit,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useCommercialData, useLeadsData, useCampaignsData } from '@/hooks/useCommercialData';
import { useAuth } from '@/contexts/AuthContext';

interface CommercialData {
  month: string;
  cac: number;
  ltv: number;
  leads: number;
  conversions: number;
  roi: number;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CommercialPanelProps {
  data?: CommercialData[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function CommercialPanel({ 
  data: propData = [], 
  loading: propLoading = false, 
  onRefresh, 
  onExport 
}: CommercialPanelProps) {
  const { theme } = useStyles();
  const { user } = useAuth();
  const { data: commercialData, loading: commercialLoading, error: commercialError, refresh } = useCommercialData();
  const { leads, loading: leadsLoading, convertLead, assignLead } = useLeadsData();
  const { campaigns, loading: campaignsLoading } = useCampaignsData();
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('cac');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const loading = propLoading || commercialLoading || leadsLoading || campaignsLoading;
  const error = commercialError;

  // Usar datos reales de Firebase o datos de props como fallback
  const chartData = propData.length > 0 ? propData : (commercialData?.monthlyTrends.map(trend => ({
    month: new Date(trend.month + '-01').toLocaleDateString('es-ES', { month: 'short' }),
    cac: trend.cac,
    ltv: trend.ltv,
    leads: trend.leads,
    conversions: trend.conversions,
    roi: trend.roas
  })) || []);

  // Generar datos de canales desde Firebase
  const channelData = commercialData?.channelPerformance || [
    { channel: 'Google Ads', leads: 145, conversions: 32, rate: 22.1, color: theme.colors.primary, trend: 'up', spent: 3200, cac: 100, roas: 2.8 },
    { channel: 'Facebook', leads: 89, conversions: 18, rate: 20.2, color: theme.colors.info, trend: 'up', spent: 1800, cac: 100, roas: 3.1 },
    { channel: 'Referidos', leads: 67, conversions: 28, rate: 41.8, color: theme.colors.success, trend: 'up', spent: 0, cac: 0, roas: 0 },
    { channel: 'Orgánico', leads: 234, conversions: 45, rate: 19.2, color: theme.colors.warning, trend: 'stable', spent: 0, cac: 0, roas: 0 },
    { channel: 'Email', leads: 56, conversions: 12, rate: 21.4, color: theme.colors.error, trend: 'down', spent: 450, cac: 37.5, roas: 2.4 },
  ];

  // Generar datos de campañas desde Firebase
  const campaignData = commercialData?.campaignPerformance || campaigns.slice(0, 4).map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    spent: campaign.budget?.spent || 0,
    leads: campaign.metrics?.clicks || 0,
    conversions: campaign.metrics?.conversions || 0,
    cac: campaign.metrics?.cpa || 0,
    status: campaign.status,
    roi: campaign.metrics?.roas || 0,
    performance: campaign.metrics?.roas >= 3 ? 'excellent' : campaign.metrics?.roas >= 2 ? 'good' : 'average'
  })) || [];

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
      background: error 
        ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
        : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: error 
        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
        : '0 4px 12px rgba(139, 92, 246, 0.3)',
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
      color: error ? theme.colors.error : theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
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
      backgroundColor: error ? `${theme.colors.error}20` : `${theme.colors.success}20`,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${error ? theme.colors.error : theme.colors.success}30`,
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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

    channelGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },

    channelCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      position: 'relative' as const,
      overflow: 'hidden',
      cursor: 'pointer',
      transition: theme.animations.transition,
    },

    channelHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    channelBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.sm,
      fontSize: '0.75rem',
      fontWeight: theme.fontWeights.semibold,
    },

    channelContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },

    channelTitle: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      margin: 0,
    },

    channelStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
      fontSize: '0.75rem',
    },

    channelStat: {
      textAlign: 'center' as const,
      padding: '0.5rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.sm,
    },

    campaignGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },

    campaignCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      cursor: 'pointer',
      transition: theme.animations.transition,
    },

    campaignHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    campaignStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.5rem',
    },

    campaignStat: {
      textAlign: 'center' as const,
      padding: '0.75rem 0.5rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.md,
    },

    campaignActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },

    actionButton: {
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.sm,
      border: 'none',
      backgroundColor: theme.colors.surfaceElevated,
      color: theme.colors.textSecondary,
      fontSize: '0.75rem',
      cursor: 'pointer',
      transition: theme.animations.transition,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
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

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'paused': return theme.colors.warning;
      case 'completed': return theme.colors.info;
      case 'draft': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Completada';
      case 'draft': return 'Borrador';
      default: return 'Desconocido';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Star size={16} color={theme.colors.success} />;
      case 'good': return <TrendingUp size={16} color={theme.colors.warning} />;
      case 'average': return <BarChart3 size={16} color={theme.colors.info} />;
      default: return <BarChart3 size={16} color={theme.colors.textSecondary} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight size={14} color={theme.colors.success} />;
      case 'down': return <ArrowDownRight size={14} color={theme.colors.error} />;
      default: return <Minus size={14} color={theme.colors.textSecondary} />;
    }
  };

  // Funciones de cálculo desde datos reales
  const calculateTotalCAC = () => {
    if (commercialData) {
      return commercialData.averageCAC;
    }
    return chartData.reduce((sum, item) => sum + item.cac, 0) / Math.max(chartData.length, 1);
  };

  const calculateTotalLTV = () => {
    if (commercialData) {
      return commercialData.averageLTV;
    }
    return chartData.reduce((sum, item) => sum + item.ltv, 0) / Math.max(chartData.length, 1);
  };

  const calculateLTVCACRatio = () => {
    if (commercialData) {
      return commercialData.ltvCacRatio;
    }
    const avgLTV = calculateTotalLTV();
    const avgCAC = calculateTotalCAC();
    return avgCAC > 0 ? avgLTV / avgCAC : 0;
  };

  const calculateTotalLeads = () => {
    if (commercialData) {
      return commercialData.totalLeads;
    }
    return channelData.reduce((sum, item) => sum + item.leads, 0);
  };

  const calculateConversionRate = () => {
    if (commercialData) {
      return commercialData.conversionRate;
    }
    const totalLeads = calculateTotalLeads();
    const totalConversions = channelData.reduce((sum, item) => sum + item.conversions, 0);
    return totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
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
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.textPrimary,
          }}>
            {label}
          </p>
          {payload.map((entry: TooltipPayloadEntry, index: number) => (
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
              {entry.name}: {entry.name.includes('CAC') || entry.name.includes('LTV') ? formatCurrency(entry.value) : 
                           entry.name.includes('ROI') ? `${entry.value}x` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Manejar error de conexión
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
              No se pueden cargar los datos comerciales. Verifica la conexión a Firebase y que los datos estén sembrados correctamente.
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
              {error ? <WifiOff size={24} color={theme.colors.textInverse} /> : <Target size={24} color={theme.colors.textInverse} />}
            </div>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>Pipeline Comercial & Marketing</h2>
              <p style={styles.subtitle}>
                {error ? <WifiOff size={16} /> : <Wifi size={16} />}
                {error ? 'Conecta Firebase para ver datos en tiempo real' : 'Análisis inteligente desde Firebase'}
              </p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.connectionStatus}>
              {error ? <WifiOff size={16} color={theme.colors.error} /> : <Wifi size={16} color={theme.colors.success} />}
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: theme.fontWeights.semibold,
                color: error ? theme.colors.error : theme.colors.success
              }}>
                {error ? 'Sin conexión' : 'Conectado a Firebase'}
              </span>
            </div>

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
              variant="outline"
              size="sm"
              icon={Filter}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Filtros
            </Button>
            
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
              onClick={onExport}
              disabled={!commercialData}
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.borderLight}`,
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: theme.spacing.md,
              alignItems: 'end'
            }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginBottom: '0.5rem', display: 'block' }}>
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.borderLight}`,
                    backgroundColor: theme.colors.surface,
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginBottom: '0.5rem', display: 'block' }}>
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.borderLight}`,
                    backgroundColor: theme.colors.surface,
                  }}
                />
              </div>
              <Button variant="primary" size="sm">
                Aplicar filtros
              </Button>
            </div>
          </motion.div>
        )}

        {/* Métricas Principales desde Firebase */}
        <div style={styles.metricsGrid}>
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
                  +5.2%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {loading ? '...' : formatCurrency(calculateTotalCAC())}
              </h3>
              <p style={styles.metricLabel}>CAC Promedio</p>
            </div>
          </Card>

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
                  +8.1%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {loading ? '...' : formatCurrency(calculateTotalLTV())}
              </h3>
              <p style={styles.metricLabel}>LTV Promedio</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.warning}20`,
                }}>
                  <BarChart3 size={20} color={theme.colors.warning} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +12.3%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {loading ? '...' : `${calculateLTVCACRatio().toFixed(1)}x`}
              </h3>
              <p style={styles.metricLabel}>Ratio LTV/CAC</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.info}20`,
                }}>
                  <Users size={20} color={theme.colors.info} />
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
                {loading ? '...' : calculateTotalLeads().toLocaleString()}
              </h3>
              <p style={styles.metricLabel}>Total Leads</p>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={{
                  ...styles.metricIcon,
                  backgroundColor: `${theme.colors.error}20`,
                }}>
                  <Target size={20} color={theme.colors.error} />
                </div>
                <div style={{
                  ...styles.metricChange,
                  color: theme.colors.success,
                }}>
                  <TrendingUp size={16} />
                  +3.4%
                </div>
              </div>
              <h3 style={styles.metricValue}>
                {loading ? '...' : `${calculateConversionRate().toFixed(1)}%`}
              </h3>
              <p style={styles.metricLabel}>Conversión</p>
            </div>
          </Card>
        </div>

        {/* Rendimiento por Canal desde Firebase */}
        <div style={styles.channelGrid}>
          {channelData.map((channel) => (
            <Card 
              key={channel.channel} 
              variant="default" 
              hover
              style={{
                border: selectedChannel === channel.channel 
                  ? `2px solid ${theme.colors.primary}` 
                  : undefined
              }}
            >
              <div 
                style={styles.channelCard}
                onClick={() => setSelectedChannel(
                  selectedChannel === channel.channel ? null : channel.channel
                )}
              >
                <div style={styles.channelHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div 
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: channel.color
                      }}
                    />
                    <h4 style={styles.channelTitle}>{channel.channel}</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {getTrendIcon(channel.trend)}
                    <span style={{ fontSize: '0.75rem', color: theme.colors.textTertiary }}>
                      {channel.trend === 'up' ? '+' : channel.trend === 'down' ? '-' : ''}
                    </span>
                  </div>
                </div>
                
                <div style={styles.channelStats}>
                  <div style={styles.channelStat}>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.textPrimary }}>
                      {channel.leads}
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>Leads</div>
                  </div>
                  <div style={styles.channelStat}>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.success }}>
                      {channel.conversions}
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>Conversiones</div>
                  </div>
                  <div style={styles.channelStat}>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: channel.color, fontSize: '1rem' }}>
                      {channel.rate.toFixed(1)}%
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>Tasa</div>
                  </div>
                </div>

                {/* Métricas adicionales */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={styles.channelStat}>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.textPrimary }}>
                      {formatCurrency(channel.spent)}
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>Invertido</div>
                  </div>
                  <div style={styles.channelStat}>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.textPrimary }}>
                      {channel.roas > 0 ? `${channel.roas.toFixed(1)}x` : 'N/A'}
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>ROAS</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Campañas Activas desde Firebase */}
        <div style={styles.campaignGrid}>
          {campaignData.map((campaign) => (
            <Card 
              key={campaign.id || campaign.name} 
              variant="default" 
              hover
              style={{
                border: selectedCampaign === campaign.name 
                  ? `2px solid ${theme.colors.primary}` 
                  : undefined
              }}
            >
              <div 
                style={styles.campaignCard}
                onClick={() => setSelectedCampaign(
                  selectedCampaign === campaign.name ? null : campaign.name
                )}
              >
                <div style={styles.campaignHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ ...styles.channelTitle, fontSize: '0.875rem' }}>
                      {campaign.name}
                    </h4>
                    {getPerformanceIcon(campaign.performance)}
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: theme.borderRadius.sm,
                    fontSize: '0.75rem',
                    fontWeight: theme.fontWeights.semibold,
                    backgroundColor: `${getStatusColor(campaign.status)}20`,
                    color: getStatusColor(campaign.status),
                  }}>
                    {getStatusText(campaign.status)}
                  </div>
                </div>
                
                <div style={styles.campaignStats}>
                  <div style={styles.campaignStat}>
                    <div style={{ color: theme.colors.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      Invertido
                    </div>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.textPrimary }}>
                      {formatCurrency(campaign.spent)}
                    </div>
                  </div>
                  <div style={styles.campaignStat}>
                    <div style={{ color: theme.colors.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      Leads
                    </div>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.textPrimary }}>
                      {campaign.leads}
                    </div>
                  </div>
                  <div style={styles.campaignStat}>
                    <div style={{ color: theme.colors.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      CAC
                    </div>
                    <div style={{ fontWeight: theme.fontWeights.bold, color: theme.colors.textPrimary }}>
                      {formatCurrency(campaign.cac)}
                    </div>
                  </div>
                  <div style={styles.campaignStat}>
                    <div style={{ color: theme.colors.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      ROI
                    </div>
                    <div style={{ 
                      fontWeight: theme.fontWeights.bold, 
                      color: campaign.roi >= 3 ? theme.colors.success : 
                             campaign.roi >= 2 ? theme.colors.warning : theme.colors.error
                    }}>
                      {campaign.roi.toFixed(1)}x
                    </div>
                  </div>
                </div>

                {/* Acciones de campaña */}
                <div style={styles.campaignActions}>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: campaign.status === 'active' ? `${theme.colors.warning}20` : `${theme.colors.success}20`,
                      color: campaign.status === 'active' ? theme.colors.warning : theme.colors.success,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para pausar/reanudar campaña
                    }}
                  >
                    {campaign.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                    {campaign.status === 'active' ? 'Pausar' : 'Activar'}
                  </button>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: `${theme.colors.info}20`,
                      color: theme.colors.info,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para ver detalles
                    }}
                  >
                    <Eye size={12} />
                    Ver
                  </button>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: `${theme.colors.primary}20`,
                      color: theme.colors.primary,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para editar
                    }}
                  >
                    <Edit size={12} />
                    Editar
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gráfico de Evolución desde datos reales */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>
              Evolución {selectedMetric.toUpperCase()} - {chartData.length} meses
            </h3>
            <div style={styles.chartControls}>
              <div style={styles.filterContainer}>
                {['cac', 'ltv', 'roi'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    style={{
                      ...styles.filterButton,
                      ...(selectedMetric === metric ? styles.filterButtonActive : {})
                    }}
                  >
                    {metric === 'cac' ? 'CAC' : 
                     metric === 'ltv' ? 'LTV' : 'ROI'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.chartContent}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Cargando datos desde Firebase...</span>
              </div>
            ) : chartData.length === 0 ? (
              <div style={styles.loadingContainer}>
                <Database size={32} color={theme.colors.textSecondary} />
                <span style={styles.loadingText}>No hay datos disponibles</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCAC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLTV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.success} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.success} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorROI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.warning} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.warning} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.borderLight} />
                  <XAxis 
                    dataKey="month" 
                    stroke={theme.colors.textSecondary}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={theme.colors.textSecondary}
                    fontSize={12}
                    tickFormatter={(value) => selectedMetric === 'roi' ? `${value}x` : formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {selectedMetric === 'cac' && (
                    <Area
                      type="monotone"
                      dataKey="cac"
                      stroke={theme.colors.primary}
                      strokeWidth={3}
                      fill="url(#colorCAC)"
                      dot={{ fill: theme.colors.primary, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: theme.colors.primary }}
                      name="CAC"
                    />
                  )}
                  
                  {selectedMetric === 'ltv' && (
                    <Area
                      type="monotone"
                      dataKey="ltv"
                      stroke={theme.colors.success}
                      strokeWidth={3}
                      fill="url(#colorLTV)"
                      dot={{ fill: theme.colors.success, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: theme.colors.success }}
                      name="LTV"
                    />
                  )}
                  
                  {selectedMetric === 'roi' && (
                    <Area
                      type="monotone"
                      dataKey="roi"
                      stroke={theme.colors.warning}
                      strokeWidth={3}
                      fill="url(#colorROI)"
                      dot={{ fill: theme.colors.warning, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: theme.colors.warning }}
                      name="ROI"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Gráfico de distribución de leads por fuente */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Distribución de Leads por Canal</h3>
            <div style={styles.chartControls}>
              <Button variant="outline" size="sm" icon={Eye}>
                Ver detalles
              </Button>
            </div>
          </div>
          
          <div style={styles.chartContent}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Cargando distribución...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ channel, leads, percent }) => `${channel}: ${leads} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="leads"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, 'Leads']}
                    labelFormatter={(label) => `Canal: ${label}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Análisis de conversión por embudo */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Embudo de Conversión</h3>
            <div style={styles.chartControls}>
              <div style={styles.filterContainer}>
                {channelData.slice(0, 3).map((channel) => (
                  <button
                    key={channel.channel}
                    onClick={() => setSelectedChannel(
                      selectedChannel === channel.channel ? null : channel.channel
                    )}
                    style={{
                      ...styles.filterButton,
                      ...(selectedChannel === channel.channel ? styles.filterButtonActive : {})
                    }}
                  >
                    {channel.channel}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.chartContent}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Cargando embudo...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={channelData.filter(channel => 
                    !selectedChannel || channel.channel === selectedChannel
                  )}
                  layout="horizontal"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.borderLight} />
                  <XAxis type="number" stroke={theme.colors.textSecondary} fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="channel" 
                    stroke={theme.colors.textSecondary} 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      value, 
                      name === 'leads' ? 'Leads' : 'Conversiones'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="leads" fill={theme.colors.info} name="Leads" />
                  <Bar dataKey="conversions" fill={theme.colors.success} name="Conversiones" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Resumen y Recomendaciones basadas en datos reales */}
        <div style={styles.summaryGrid}>
          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <CheckCircle size={20} color={theme.colors.success} />
                <h4 style={styles.summaryTitle}>Canales Exitosos</h4>
              </div>
              <div style={styles.summaryContent}>
                {channelData
                  .filter(channel => channel.rate > 20)
                  .sort((a, b) => b.rate - a.rate)
                  .slice(0, 3)
                  .map((channel, index) => (
                    <div key={index} style={styles.summaryItem}>
                      <span style={styles.summaryItemLabel}>
                        {channel.channel} - {channel.rate > 30 ? 'Excelente' : 'Buena'} conversión
                      </span>
                      <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                        {channel.rate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <AlertCircle size={20} color={theme.colors.warning} />
                <h4 style={styles.summaryTitle}>Oportunidades de Mejora</h4>
              </div>
              <div style={styles.summaryContent}>
                {channelData
                  .filter(channel => channel.trend === 'down' || channel.rate < 15)
                  .slice(0, 3)
                  .map((channel, index) => (
                    <div key={index} style={styles.summaryItem}>
                      <span style={styles.summaryItemLabel}>
                        {channel.channel} - {channel.trend === 'down' ? 'Tendencia bajista' : 'Baja conversión'}
                      </span>
                      <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                        {channel.trend === 'down' ? 'Revisar' : `${channel.rate.toFixed(1)}%`}
                      </span>
                    </div>
                  ))}
                
                {campaignData
                  .filter(campaign => campaign.roi < 2.5)
                  .slice(0, 2)
                  .map((campaign, index) => (
                    <div key={`campaign-${index}`} style={styles.summaryItem}>
                      <span style={styles.summaryItemLabel}>
                        {campaign.name} - ROI bajo
                      </span>
                      <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                        {campaign.roi.toFixed(1)}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <Zap size={20} color={theme.colors.primary} />
                <h4 style={styles.summaryTitle}>Optimización Automática IA</h4>
              </div>
              <div style={styles.summaryContent}>
                {/* Recomendaciones basadas en datos reales */}
                {calculateLTVCACRatio() < 3 && (
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryItemLabel}>Optimizar ratio LTV/CAC</span>
                    <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                      +{((3 - calculateLTVCACRatio()) * 100).toFixed(0)}% ROI
                    </span>
                  </div>
                )}
                
                {channelData.find(c => c.channel === 'Referidos' && c.rate > 30) && (
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryItemLabel}>Programa incentivos referidos</span>
                    <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                      +25% conversión
                    </span>
                  </div>
                )}
                
                {channelData.find(c => c.trend === 'down') && (
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryItemLabel}>Reactivar canales en declive</span>
                    <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                      +15% leads
                    </span>
                  </div>
                )}

                {calculateConversionRate() < 20 && (
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryItemLabel}>Optimizar landing pages</span>
                    <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                      +{(20 - calculateConversionRate()).toFixed(1)}% conversión
                    </span>
                  </div>
                )}

                {campaignData.some(c => c.roi < 2) && (
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryItemLabel}>Pausar campañas de bajo ROI</span>
                    <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                      -30% CAC
                    </span>
                  </div>
                )}

                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Redistribuir presupuesto automático</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    +18% ROI general
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Leads recientes desde Firebase */}
        {leads.length > 0 && (
          <Card variant="default" style={styles.chartContainer}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Leads Recientes</h3>
              <div style={styles.chartControls}>
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </div>
            </div>
            
            <div style={{ padding: theme.spacing.md }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: theme.spacing.sm,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {leads.slice(0, 6).map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      padding: theme.spacing.sm,
                      backgroundColor: theme.colors.surfaceElevated,
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.borderLight}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: theme.fontWeights.semibold,
                        color: theme.colors.textPrimary
                      }}>
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: theme.colors.textSecondary
                      }}>
                        {lead.source} • {lead.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {lead.status === 'new' && (
                        <button
                          style={{
                            ...styles.actionButton,
                            backgroundColor: `${theme.colors.success}20`,
                            color: theme.colors.success,
                          }}
                          onClick={() => convertLead(lead.id, 200, 'Convertido desde panel')}
                        >
                          Convertir
                        </button>
                      )}
                      <button
                        style={{
                          ...styles.actionButton,
                          backgroundColor: `${theme.colors.info}20`,
                          color: theme.colors.info,
                        }}
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Métricas de rendimiento en tiempo real */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Rendimiento en Tiempo Real</h3>
            <div style={styles.chartControls}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: theme.colors.textSecondary
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.success,
                  animation: 'pulse 2s infinite'
                }} />
                Actualizando cada 30s
              </div>
            </div>
          </div>
          
          <div style={{
            padding: theme.spacing.md,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: theme.spacing.md
          }}>
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.success
              }}>
                {leads.filter(l => l.status === 'new').length}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: theme.colors.textSecondary
              }}>
                Leads nuevos hoy
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.primary
              }}>
                {leads.filter(l => l.status === 'converted').length}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: theme.colors.textSecondary
              }}>
                Conversiones hoy
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.warning
              }}>
                {campaigns.filter(c => c.status === 'active').length}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: theme.colors.textSecondary
              }}>
                Campañas activas
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: theme.fontWeights.bold,
                color: commercialData ? theme.colors.info : theme.colors.textSecondary
              }}>
                {commercialData ? formatCurrency(commercialData.totalLeads * commercialData.averageCAC) : '€0'}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: theme.colors.textSecondary
              }}>
                Inversión total
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
