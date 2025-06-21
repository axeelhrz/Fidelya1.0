'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
  data = [], 
  loading = false, 
  onRefresh, 
  onExport 
}: CommercialPanelProps) {
  const { theme } = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('cac');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // Mock data mejorado
  const mockCommercialData: CommercialData[] = [
    { month: 'Jul', cac: 58.2, ltv: 185.4, leads: 145, conversions: 32, roi: 2.8 },
    { month: 'Ago', cac: 62.1, ltv: 192.1, leads: 156, conversions: 35, roi: 3.1 },
    { month: 'Sep', cac: 59.8, ltv: 188.7, leads: 134, conversions: 28, roi: 2.9 },
    { month: 'Oct', cac: 61.5, ltv: 195.2, leads: 167, conversions: 38, roi: 3.2 },
    { month: 'Nov', cac: 58.9, ltv: 189.8, leads: 178, conversions: 42, roi: 3.4 },
    { month: 'Dic', cac: 60.3, ltv: 192.4, leads: 189, conversions: 45, roi: 3.2 },
  ];

  const channelData = [
    { channel: 'Google Ads', leads: 145, conversions: 32, rate: 22.1, color: theme.colors.primary, trend: 'up', spent: 3200 },
    { channel: 'Facebook', leads: 89, conversions: 18, rate: 20.2, color: theme.colors.info, trend: 'up', spent: 1800 },
    { channel: 'Referidos', leads: 67, conversions: 28, rate: 41.8, color: theme.colors.success, trend: 'up', spent: 0 },
    { channel: 'Orgánico', leads: 234, conversions: 45, rate: 19.2, color: theme.colors.warning, trend: 'stable', spent: 0 },
    { channel: 'Email', leads: 56, conversions: 12, rate: 21.4, color: theme.colors.error, trend: 'down', spent: 450 },
  ];

  const campaignData = [
    { name: 'Ansiedad Jóvenes', spent: 2500, leads: 45, cac: 55.6, status: 'active', roi: 2.8, performance: 'excellent' },
    { name: 'Terapia Parejas', spent: 1800, leads: 28, cac: 64.3, status: 'active', roi: 3.2, performance: 'excellent' },
    { name: 'Depresión Adultos', spent: 3200, leads: 52, cac: 61.5, status: 'paused', roi: 2.1, performance: 'good' },
    { name: 'Mindfulness', spent: 1200, leads: 18, cac: 66.7, status: 'active', roi: 3.5, performance: 'excellent' },
  ];

  const commercialData = data.length > 0 ? data : mockCommercialData;

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
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
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
  };

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'paused': return theme.colors.warning;
      case 'stopped': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'stopped': return 'Detenida';
      default: return 'Desconocido';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Star size={16} color={theme.colors.success} />;
      case 'good': return <TrendingUp size={16} color={theme.colors.warning} />;
      default: return <BarChart3 size={16} color={theme.colors.textSecondary} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} color={theme.colors.success} />;
      case 'down': return <TrendingDown size={14} color={theme.colors.error} />;
      default: return <div style={{ width: '14px', height: '14px', backgroundColor: theme.colors.textSecondary, borderRadius: '50%' }} />;
    }
  };

  // Funciones de cálculo
  const calculateTotalCAC = () => {
    return commercialData.reduce((sum, item) => sum + item.cac, 0) / commercialData.length;
  };

  const calculateTotalLTV = () => {
    return commercialData.reduce((sum, item) => sum + item.ltv, 0) / commercialData.length;
  };

  const calculateLTVCACRatio = () => {
    const avgLTV = calculateTotalLTV();
    const avgCAC = calculateTotalCAC();
    return avgLTV / avgCAC;
  };

  const calculateTotalLeads = () => {
    return channelData.reduce((sum, item) => sum + item.leads, 0);
  };

  const calculateConversionRate = () => {
    const totalLeads = calculateTotalLeads();
    const totalConversions = channelData.reduce((sum, item) => sum + item.conversions, 0);
    return (totalConversions / totalLeads) * 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
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
              {entry.name}: {entry.name === 'CAC' ? formatCurrency(entry.value) : entry.value}
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
              <Target size={24} color={theme.colors.textInverse} />
            </div>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>Pipeline Comercial & Marketing</h2>
              <p style={styles.subtitle}>Análisis inteligente de conversión y adquisición</p>
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
                {formatCurrency(calculateTotalCAC())}
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
                {formatCurrency(calculateTotalLTV())}
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
                {calculateLTVCACRatio().toFixed(1)}x
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
                {calculateTotalLeads()}
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
                {calculateConversionRate().toFixed(1)}%
              </h3>
              <p style={styles.metricLabel}>Conversión</p>
            </div>
          </Card>
        </div>

        {/* Rendimiento por Canal */}
        <div style={styles.channelGrid}>
          {channelData.map((channel) => (
            <Card key={channel.channel} variant="default" hover>
              <div style={styles.channelCard}>
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
                      Tendencia
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
                      {channel.rate}%
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>Tasa</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Campañas Activas */}
        <div style={styles.campaignGrid}>
          {campaignData.map((campaign) => (
            <Card 
              key={campaign.name} 
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
                      {campaign.roi}x
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gráfico de Evolución CAC */}
        <Card variant="default" style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Evolución CAC - 6 meses</h3>
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
                <span style={styles.loadingText}>Cargando datos comerciales...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commercialData}>
                  <defs>
                    <linearGradient id="colorCAC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLTV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.success} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.colors.success} stopOpacity={0}/>
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
                    tickFormatter={(value) => selectedMetric === 'roi' ? `${value}x` : `€${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {selectedMetric === 'cac' && (
                    <Line
                      type="monotone"
                      dataKey="cac"
                      stroke={theme.colors.primary}
                      strokeWidth={3}
                      dot={{ fill: theme.colors.primary, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: theme.colors.primary }}
                      name="CAC"
                    />
                  )}
                  
                  {selectedMetric === 'ltv' && (
                    <Line
                      type="monotone"
                      dataKey="ltv"
                      stroke={theme.colors.success}
                      strokeWidth={3}
                      dot={{ fill: theme.colors.success, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: theme.colors.success }}
                      name="LTV"
                    />
                  )}
                  
                  {selectedMetric === 'roi' && (
                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke={theme.colors.warning}
                      strokeWidth={3}
                      dot={{ fill: theme.colors.warning, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: theme.colors.warning }}
                      name="ROI"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Resumen y Recomendaciones */}
        <div style={styles.summaryGrid}>
          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <CheckCircle size={20} color={theme.colors.success} />
                <h4 style={styles.summaryTitle}>Canales Exitosos</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Referidos - Mejor conversión</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    41.8%
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Google Ads - Más volumen</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    145 leads
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Mindfulness - Mejor ROI</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.success}}>
                    3.5x
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" hover>
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <AlertCircle size={20} color={theme.colors.warning} />
                <h4 style={styles.summaryTitle}>Oportunidades</h4>
              </div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Email marketing</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    Tendencia bajista
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Depresión Adultos</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    ROI bajo (2.1x)
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>CAC promedio</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.warning}}>
                    Optimizable
                  </span>
                </div>
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
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Redirigir 30% presupuesto</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    +18% ROI
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Programa incentivos referidos</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    +25% conversión
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>Optimizar email campaigns</span>
                  <span style={{...styles.summaryItemValue, color: theme.colors.primary}}>
                    +15% engagement
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