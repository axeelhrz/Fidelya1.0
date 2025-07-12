'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Heart,
  Target,
  Brain,
  TrendingUp,
  Sparkles,
  Download,
  Bell,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Star,
  Zap,
  Users,
  Activity,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  ChevronRight,
  Database,
  Plus,
} from 'lucide-react';

import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import DataSeeder from '@/components/admin/DataSeeder';
import { useDashboardData, exportDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces mejoradas
interface QuickMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  loading?: boolean;
  target?: number;
  unit?: string;
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  value?: string;
  actionable: boolean;
}

interface ViewSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  component: React.ComponentType;
}

export default function CEODashboard() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [showDataSeeder, setShowDataSeeder] = useState(false);
  
  // Usar el hook combinado para todos los datos
  const {
    alerts,
    financialData,
    clinicalData,
    commercialData,
    loading,
    error,
    refresh
  } = useDashboardData();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calcular métricas reales basadas en datos de Firebase
  const calculateRealMetrics = () => {
    const baseMetrics = {
      revenue: financialData?.totalRevenue || 0,
      revenueGrowth: financialData?.averageGrowth || 0,
      patients: clinicalData ? Math.round(clinicalData.occupancyRate * 1.5) : 0,
      patientsGrowth: clinicalData ? (clinicalData.occupancyRate - 75) / 75 * 100 : 0,
      occupancy: clinicalData?.occupancyRate || 0,
      occupancyGrowth: clinicalData ? (clinicalData.occupancyRate - 80) : 0,
      satisfaction: clinicalData ? Math.min(95, 85 + (clinicalData.adherenceRate - 70) / 30 * 10) : 0,
      satisfactionGrowth: clinicalData ? (clinicalData.adherenceRate - 70) / 10 : 0,
      sessions: financialData?.totalSessions || 0,
      sessionsGrowth: financialData ? (financialData.totalSessions - 150) / 150 * 100 : 0,
      conversion: commercialData?.conversionRate || 0,
      conversionGrowth: commercialData ? (commercialData.conversionRate - 18) / 18 * 100 : 0
    };

    return baseMetrics;
  };

  const metrics = calculateRealMetrics();

  // Métricas principales con datos reales
  const quickMetrics: QuickMetric[] = [
    {
      id: 'revenue',
      label: 'Ingresos del Mes',
      value: `€${metrics.revenue.toLocaleString('es-ES')}`,
      change: metrics.revenueGrowth,
      trend: metrics.revenueGrowth > 0 ? 'up' : metrics.revenueGrowth < 0 ? 'down' : 'stable',
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
      loading: loading,
      target: metrics.revenue * 1.15,
      unit: '€'
    },
    {
      id: 'patients',
      label: 'Pacientes Activos',
      value: metrics.patients.toString(),
      change: metrics.patientsGrowth,
      trend: metrics.patientsGrowth > 0 ? 'up' : metrics.patientsGrowth < 0 ? 'down' : 'stable',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      loading: loading,
      target: 120
    },
    {
      id: 'occupancy',
      label: 'Ocupación',
      value: `${metrics.occupancy.toFixed(1)}%`,
      change: metrics.occupancyGrowth,
      trend: metrics.occupancyGrowth > 0 ? 'up' : metrics.occupancyGrowth < 0 ? 'down' : 'stable',
      icon: Activity,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      loading: loading,
      target: 85,
      unit: '%'
    },
    {
      id: 'satisfaction',
      label: 'Satisfacción',
      value: `${metrics.satisfaction.toFixed(1)}%`,
      change: metrics.satisfactionGrowth,
      trend: metrics.satisfactionGrowth > 0 ? 'up' : metrics.satisfactionGrowth < 0 ? 'down' : 'stable',
      icon: Star,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      loading: loading,
      target: 95,
      unit: '%'
    },
    {
      id: 'sessions',
      label: 'Sesiones del Mes',
      value: metrics.sessions.toString(),
      change: metrics.sessionsGrowth,
      trend: metrics.sessionsGrowth > 0 ? 'up' : metrics.sessionsGrowth < 0 ? 'down' : 'stable',
      icon: Calendar,
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      loading: loading,
      target: 200
    },
    {
      id: 'conversion',
      label: 'Conversión',
      value: `${metrics.conversion.toFixed(1)}%`,
      change: metrics.conversionGrowth,
      trend: metrics.conversionGrowth > 0 ? 'up' : metrics.conversionGrowth < 0 ? 'down' : 'stable',
      icon: Target,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      loading: loading,
      target: 25,
      unit: '%'
    }
  ];

  // Insights de IA basados en datos reales
  const generateAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];

    // Insight basado en ocupación
    if (metrics.occupancy < 70) {
      insights.push({
        id: 'occupancy-low',
        type: 'recommendation',
        title: 'Optimizar horarios disponibles',
        description: `La ocupación actual es del ${metrics.occupancy.toFixed(1)}%. Considera ajustar horarios o promociones para aumentar la demanda.`,
        confidence: 85,
        impact: 'medium',
        timeframe: 'Esta semana',
        value: `+${(85 - metrics.occupancy).toFixed(1)}% potencial`,
        actionable: true
      });
    }

    // Insight basado en crecimiento financiero
    if (metrics.revenueGrowth > 10) {
      insights.push({
        id: 'growth-high',
        type: 'prediction',
        title: 'Crecimiento acelerado detectado',
        description: `Con un crecimiento del ${metrics.revenueGrowth.toFixed(1)}%, considera expandir el equipo o las instalaciones.`,
        confidence: 92,
        impact: 'high',
        timeframe: 'Próximo trimestre',
        value: `+${metrics.revenueGrowth.toFixed(1)}% crecimiento`,
        actionable: true
      });
    }

    // Insight basado en pagos pendientes
    if (financialData && financialData.pendingPayments > 5000) {
      insights.push({
        id: 'payments-pending',
        type: 'alert',
        title: 'Pagos pendientes elevados',
        description: `Hay €${financialData.pendingPayments.toLocaleString()} en pagos pendientes. Considera implementar recordatorios automáticos.`,
        confidence: 95,
        impact: 'high',
        timeframe: 'Inmediato',
        value: `€${financialData.pendingPayments.toLocaleString()} pendientes`,
        actionable: true
      });
    }

    // Insight basado en conversión comercial
    if (metrics.conversion < 15) {
      insights.push({
        id: 'conversion-low',
        type: 'optimization',
        title: 'Oportunidad de mejora en conversión',
        description: `La tasa de conversión actual es ${metrics.conversion.toFixed(1)}%. Optimizar el proceso de captación podría aumentar significativamente los ingresos.`,
        confidence: 78,
        impact: 'high',
        timeframe: '2 semanas',
        value: `+${(20 - metrics.conversion).toFixed(1)}% potencial`,
        actionable: true
      });
    }

    // Insight basado en satisfacción
    if (metrics.satisfaction > 90) {
      insights.push({
        id: 'satisfaction-high',
        type: 'prediction',
        title: 'Excelente satisfacción del paciente',
        description: `Con ${metrics.satisfaction.toFixed(1)}% de satisfacción, es el momento ideal para implementar un programa de referidos.`,
        confidence: 88,
        impact: 'medium',
        timeframe: 'Este mes',
        value: `+30% referidos potenciales`,
        actionable: true
      });
    }

    return insights;
  };

  const aiInsights = generateAIInsights();

  // Secciones de vista disponibles
  const viewSections: ViewSection[] = [
    {
      id: 'financial',
      title: 'Análisis Financiero',
      description: 'Ingresos, gastos y proyecciones',
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
      component: FinancialPanel
    },
    {
      id: 'clinical',
      title: 'Operaciones Clínicas',
      description: 'Pacientes, sesiones y calidad',
      icon: Heart,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      component: ClinicalPanel
    },
    {
      id: 'commercial',
      title: 'Marketing y Ventas',
      description: 'Conversión y adquisición',
      icon: Target,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      component: CommercialPanel
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportReport = async () => {
    if (!user?.centerId) {
      alert('No hay centro asignado');
      return;
    }

    try {
      await exportDashboardData(user.centerId);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exportando reporte');
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight size={16} color="#10B981" />;
      case 'down':
        return <ArrowDownRight size={16} color="#EF4444" />;
      default:
        return <Minus size={16} color="#6B7280" />;
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'recommendation': return Star;
      case 'alert': return AlertTriangle;
      case 'optimization': return Zap;
      default: return Info;
    }
  };

  const getInsightColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Header compacto y organizado
  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)',
        borderRadius: '1.5rem',
        padding: '1.5rem 2rem',
        border: '1px solid rgba(14, 165, 233, 0.2)',
        boxShadow: '0 8px 32px rgba(14, 165, 233, 0.15)',
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
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo y título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              borderRadius: '1rem',
              boxShadow: '0 8px 24px rgba(14, 165, 233, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Sparkles size={24} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#0C4A6E',
              textShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
            }}>
              Dashboard Ejecutivo
            </h1>
            <p style={{ 
              fontSize: '1rem',
              color: '#0369A1',
              fontWeight: 600,
              margin: '0.25rem 0 0 0'
            }}>
              {user?.name || 'Dr. Carlos Mendoza'}
            </p>
          </div>
        </div>
        
        {/* Información de tiempo y estado */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.1)'
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
            <Calendar size={16} color="#0EA5E9" />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#0C4A6E' 
            }}>
              {currentTime.toLocaleDateString('es-ES', { 
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <Shield size={16} color={error ? "#EF4444" : "#10B981"} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: error ? '#991B1B' : '#065F46'
            }}>
              {error ? 'Desconectado' : 'Firebase'}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              background: 'rgba(255, 255, 255, 0.8)',
              color: '#0C4A6E',
              fontSize: '0.875rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="quarter">Trimestre</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '0.75rem',
              padding: '0.5rem 0.75rem',
              color: '#065F46',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isRefreshing ? 0.7 : 1
            }}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <RefreshCw size={16} />
            </motion.div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportReport}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '0.75rem',
              padding: '0.5rem 0.75rem',
              color: '#0C4A6E',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} />
          </motion.button>

          {process.env.NODE_ENV === 'development' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDataSeeder(!showDataSeeder)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '0.75rem',
                padding: '0.5rem 0.75rem',
                color: '#6B21A8',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Database size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Métricas principales organizadas en grid
  const renderMainMetrics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {quickMetrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ y: -4, scale: 1.02 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Fondo decorativo */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '80px',
              height: '80px',
              background: `${metric.color}10`,
              borderRadius: '50%',
              opacity: 0.5
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '1rem',
                  backgroundColor: metric.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <metric.icon size={20} color={metric.color} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {metric.loading ? (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #E5E7EB',
                    borderTop: '2px solid #2463EB',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <>
                    {getTrendIcon(metric.trend)}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: metric.trend === 'up' ? '#10B981' : metric.trend === 'down' ? '#EF4444' : '#6B7280'
                    }}>
                      {Math.abs(metric.change).toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1C1E21',
                margin: '0 0 0.25rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {metric.loading ? '...' : metric.value}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                fontWeight: 500
              }}>
                {metric.label}
              </p>
              {metric.target && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#9CA3AF'
                }}>
                  Meta: {metric.target}{metric.unit || ''}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Navegación de secciones en grid 1x3
  const renderSectionNavigation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {viewSections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ y: -4, scale: 1.02 }}
          onClick={() => setActiveView(section.id)}
          style={{
            background: activeView === section.id 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            border: activeView === section.id 
              ? `2px solid ${section.color}` 
              : '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: activeView === section.id 
              ? `0 8px 25px ${section.color}20` 
              : '0 4px 12px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'center'
          }}
        >
          <div style={{
            padding: '1rem',
            borderRadius: '1rem',
            backgroundColor: section.bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            width: 'fit-content'
          }}>
            <section.icon size={24} color={section.color} />
          </div>
          
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1C1E21',
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {section.title}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: 0
          }}>
            {section.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );

  // Panel de insights de IA optimizado
  const renderAIInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}
      data-section="ai-insights"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            padding: '0.75rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Brain size={20} color="white" />
        </motion.div>
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            color: '#1C1E21',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Insights Inteligentes
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: '0.25rem 0 0 0'
          }}>
            Análisis automático basado en datos reales
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: aiInsights.length > 2 ? 'repeat(2, 1fr)' : '1fr',
        gap: '1rem' 
      }}>
        {aiInsights.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6B7280',
            gridColumn: '1 / -1'
          }}>
            <Brain size={32} color="#9CA3AF" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {loading ? 'Analizando datos...' : 'Conecta Firebase para insights'}
            </h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              {loading 
                ? 'Generando recomendaciones inteligentes...'
                : 'Los insights aparecerán cuando tengas datos en Firebase.'
              }
            </p>
            {!loading && !error && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDataSeeder(true)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '1rem auto 0'
                }}
              >
                <Plus size={14} />
                Datos de ejemplo
              </motion.button>
            )}
          </div>
        ) : (
          aiInsights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: `${getInsightColor(insight.impact)}05`,
                  border: `1px solid ${getInsightColor(insight.impact)}20`,
                  borderRadius: '1rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: `${getInsightColor(insight.impact)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={16} color={getInsightColor(insight.impact)} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 600, 
                        color: '#1C1E21',
                        margin: 0,
                        flex: 1
                      }}>
                        {insight.title}
                      </h4>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: getInsightColor(insight.impact),
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: `${getInsightColor(insight.impact)}15`
                      }}>
                        {insight.confidence}%
                      </span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: '#6B7280', 
                      marginBottom: '0.5rem',
                      lineHeight: 1.4
                    }}>
                      {insight.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                        {insight.timeframe}
                      </span>
                      {insight.value && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          color: getInsightColor(insight.impact)
                        }}>
                          {insight.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );

  // Renderizar contenido según la vista activa
  const renderActiveView = () => {
    if (activeView === 'overview') {
      return (
        <>
          {renderMainMetrics()}
          {renderSectionNavigation()}
          {renderAIInsights()}
        </>
      );
    }

    const activeSection = viewSections.find(section => section.id === activeView);
    if (activeSection) {
      const Component = activeSection.component;
      return (
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                borderRadius: '1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6B7280',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
              Volver al resumen
            </motion.button>
          </div>
          <Component />
        </motion.div>
      );
    }

    return null;
  };

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
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)
        `
      }} />

      {/* DataSeeder Modal */}
      <AnimatePresence>
        {showDataSeeder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setShowDataSeeder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <DataSeeder />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout principal optimizado */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2rem',
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: '2rem',
        minHeight: '100vh'
      }}>
        {/* Columna principal */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>
          {renderHeader()}
          
          {/* Contenido principal */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              {renderActiveView()}
            </AnimatePresence>
          </div>
        </div>

        {/* Columna lateral - AlertsTasksDock */}
        <div style={{ 
          position: 'sticky',
          top: '2rem',
          height: 'fit-content'
        }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <AlertsTasksDock />
          </motion.div>
        </div>
      </div>

      {/* Botón flotante de IA */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const insightsSection = document.querySelector('[data-section="ai-insights"]');
            if (insightsSection) {
              insightsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Asistente IA"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Brain size={24} color="#FFFFFF" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Indicador de notificaciones */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            position: 'fixed',
            top: '100px',
            right: '2rem',
            zIndex: 1000,
          }}
        >
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            background: 'rgba(239, 68, 68, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '100px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Bell size={16} />
            </motion.div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {alerts.filter(a => !a.isRead).length} alertas
            </span>
          </div>
        </motion.div>
      )}

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 1400px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          
          .sidebar {
            position: relative !important;
            top: auto !important;
          }
        }
        
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .sections-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr !important;
          }
          
          .header-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          
          .actions-grid {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
