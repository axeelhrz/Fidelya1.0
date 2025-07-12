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
  Menu,
  X
} from 'lucide-react';

import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import DataSeeder from '@/components/admin/DataSeeder';
import { useDashboardData, exportDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces
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
  const [showDataSeeder, setShowDataSeeder] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Actualizar tiempo cada minuto en móvil, cada segundo en desktop
  useEffect(() => {
    const interval = isMobile ? 60000 : 1000;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [isMobile]);

  // Calcular métricas reales
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

  // Métricas principales optimizadas
  const quickMetrics: QuickMetric[] = [
    {
      id: 'revenue',
      label: 'Ingresos',
      value: `€${(metrics.revenue / 1000).toFixed(0)}k`,
      change: metrics.revenueGrowth,
      trend: metrics.revenueGrowth > 0 ? 'up' : metrics.revenueGrowth < 0 ? 'down' : 'stable',
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
      loading: loading
    },
    {
      id: 'patients',
      label: 'Pacientes',
      value: metrics.patients.toString(),
      change: metrics.patientsGrowth,
      trend: metrics.patientsGrowth > 0 ? 'up' : metrics.patientsGrowth < 0 ? 'down' : 'stable',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      loading: loading
    },
    {
      id: 'occupancy',
      label: 'Ocupación',
      value: `${metrics.occupancy.toFixed(0)}%`,
      change: metrics.occupancyGrowth,
      trend: metrics.occupancyGrowth > 0 ? 'up' : metrics.occupancyGrowth < 0 ? 'down' : 'stable',
      icon: Activity,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      loading: loading
    },
    {
      id: 'satisfaction',
      label: 'Satisfacción',
      value: `${metrics.satisfaction.toFixed(0)}%`,
      change: metrics.satisfactionGrowth,
      trend: metrics.satisfactionGrowth > 0 ? 'up' : metrics.satisfactionGrowth < 0 ? 'down' : 'stable',
      icon: Star,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      loading: loading
    }
  ];

  // Insights de IA optimizados
  const generateAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];

    if (metrics.occupancy < 70) {
      insights.push({
        id: 'occupancy-low',
        type: 'recommendation',
        title: 'Optimizar horarios',
        description: `Ocupación del ${metrics.occupancy.toFixed(0)}%. Ajustar horarios para aumentar demanda.`,
        confidence: 85,
        impact: 'medium',
        timeframe: 'Esta semana',
        value: `+${(85 - metrics.occupancy).toFixed(0)}%`,
        actionable: true
      });
    }

    if (metrics.revenueGrowth > 10) {
      insights.push({
        id: 'growth-high',
        type: 'prediction',
        title: 'Crecimiento acelerado',
        description: `Crecimiento del ${metrics.revenueGrowth.toFixed(0)}%. Considerar expansión.`,
        confidence: 92,
        impact: 'high',
        timeframe: 'Próximo trimestre',
        value: `+${metrics.revenueGrowth.toFixed(0)}%`,
        actionable: true
      });
    }

    if (metrics.satisfaction > 90) {
      insights.push({
        id: 'satisfaction-high',
        type: 'optimization',
        title: 'Alta satisfacción',
        description: `${metrics.satisfaction.toFixed(0)}% satisfacción. Momento ideal para referidos.`,
        confidence: 88,
        impact: 'medium',
        timeframe: 'Este mes',
        value: '+30% referidos',
        actionable: true
      });
    }

    return insights;
  };

  const aiInsights = generateAIInsights();

  // Secciones de vista
  const viewSections: ViewSection[] = [
    {
      id: 'financial',
      title: 'Financiero',
      description: 'Ingresos y gastos',
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
      component: FinancialPanel
    },
    {
      id: 'clinical',
      title: 'Clínico',
      description: 'Pacientes y sesiones',
      icon: Heart,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      component: ClinicalPanel
    },
    {
      id: 'commercial',
      title: 'Comercial',
      description: 'Marketing y ventas',
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
      case 'up': return <ArrowUpRight size={14} color="#10B981" />;
      case 'down': return <ArrowDownRight size={14} color="#EF4444" />;
      default: return <Minus size={14} color="#6B7280" />;
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

  // Header responsive
  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="header-container"
    >
      <div className="header-content">
        {/* Logo y título */}
        <div className="header-main">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="header-logo"
          >
            <Sparkles size={isMobile ? 20 : 24} color="white" />
          </motion.div>
          
          <div className="header-text">
            <h1 className="header-title">
              {isMobile ? 'Dashboard' : 'Dashboard Ejecutivo'}
            </h1>
            <p className="header-subtitle">
              {user?.name?.split(' ')[0] || 'Dr. Mendoza'}
            </p>
          </div>
        </div>
        
        {/* Estado y tiempo */}
        <div className="header-status">
          <div className="status-item">
            <Shield size={14} color={error ? "#EF4444" : "#10B981"} />
            <span className="status-text">
              {error ? 'Offline' : 'Online'}
            </span>
          </div>
          
          {!isMobile && (
            <div className="status-item">
              <Clock size={14} color="#0EA5E9" />
              <span className="status-text">
                {currentTime.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="header-actions">
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSidebar(!showSidebar)}
              className="action-btn mobile-menu"
            >
              {showSidebar ? <X size={16} /> : <Menu size={16} />}
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="action-btn refresh-btn"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <RefreshCw size={16} />
            </motion.div>
          </motion.button>

          {!isMobile && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportReport}
                className="action-btn export-btn"
              >
                <Download size={16} />
              </motion.button>

              {process.env.NODE_ENV === 'development' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDataSeeder(!showDataSeeder)}
                  className="action-btn dev-btn"
                >
                  <Database size={16} />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Métricas responsive
  const renderMainMetrics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="metrics-grid"
    >
      {quickMetrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="metric-card"
        >
          <div className="metric-header">
            <div 
              className="metric-icon"
              style={{ backgroundColor: metric.bgColor }}
            >
              <metric.icon size={isMobile ? 18 : 20} color={metric.color} />
            </div>
            
            <div className="metric-trend">
              {metric.loading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  {getTrendIcon(metric.trend)}
                  <span className="trend-text">
                    {Math.abs(metric.change).toFixed(0)}%
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="metric-content">
            <h3 className="metric-value">
              {metric.loading ? '...' : metric.value}
            </h3>
            <p className="metric-label">
              {metric.label}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Navegación de secciones responsive
  const renderSectionNavigation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="sections-grid"
    >
      {viewSections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ y: -4, scale: 1.02 }}
          onClick={() => setActiveView(section.id)}
          className={`section-card ${activeView === section.id ? 'active' : ''}`}
          style={{
            borderColor: activeView === section.id ? section.color : 'transparent'
          }}
        >
          <div 
            className="section-icon"
            style={{ backgroundColor: section.bgColor }}
          >
            <section.icon size={isMobile ? 20 : 24} color={section.color} />
          </div>
          
          <div className="section-content">
            <h3 className="section-title">
              {section.title}
            </h3>
            {!isMobile && (
              <p className="section-description">
                {section.description}
              </p>
            )}
          </div>
          
          <ChevronRight 
            size={16} 
            color={activeView === section.id ? section.color : '#9CA3AF'} 
          />
        </motion.div>
      ))}
    </motion.div>
  );

  // Insights de IA responsive
  const renderAIInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="insights-container"
      data-section="ai-insights"
    >
      <div className="insights-header">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="insights-icon"
        >
          <Brain size={isMobile ? 18 : 20} color="white" />
        </motion.div>
        <div className="insights-text">
          <h3 className="insights-title">
            {isMobile ? 'IA Insights' : 'Insights Inteligentes'}
          </h3>
          <p className="insights-subtitle">
            {isMobile ? 'Análisis automático' : 'Análisis automático basado en datos reales'}
          </p>
        </div>
      </div>

      <div className="insights-grid">
        {aiInsights.length === 0 ? (
          <div className="insights-empty">
            <Brain size={isMobile ? 32 : 48} color="#9CA3AF" />
            <h4 className="empty-title">
              {loading ? 'Analizando...' : 'Sin datos'}
            </h4>
            <p className="empty-description">
              {loading 
                ? 'Generando insights...'
                : 'Conecta Firebase para ver insights.'
              }
            </p>
            {!loading && !error && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDataSeeder(true)}
                className="empty-action"
              >
                <Plus size={14} />
                Datos ejemplo
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
                className="insight-card"
                style={{
                  background: `${getInsightColor(insight.impact)}05`,
                  borderColor: `${getInsightColor(insight.impact)}20`
                }}
              >
                <div className="insight-content">
                  <div 
                    className="insight-icon"
                    style={{ backgroundColor: `${getInsightColor(insight.impact)}15` }}
                  >
                    <IconComponent size={14} color={getInsightColor(insight.impact)} />
                  </div>
                  
                  <div className="insight-text">
                    <div className="insight-header">
                      <h4 className="insight-title">
                        {insight.title}
                      </h4>
                      <span 
                        className="insight-confidence"
                        style={{
                          backgroundColor: `${getInsightColor(insight.impact)}15`,
                          color: getInsightColor(insight.impact)
                        }}
                      >
                        {insight.confidence}%
                      </span>
                    </div>
                    
                    <p className="insight-description">
                      {insight.description}
                    </p>
                    
                    <div className="insight-footer">
                      <span className="insight-timeframe">
                        {insight.timeframe}
                      </span>
                      {insight.value && (
                        <span 
                          className="insight-value"
                          style={{ color: getInsightColor(insight.impact) }}
                        >
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

  // Sidebar responsive
  const renderSidebar = () => (
    <AnimatePresence>
      {(showSidebar || !isMobile) && (
        <motion.div
          initial={isMobile ? { x: '100%' } : { opacity: 0, x: 40 }}
          animate={isMobile ? { x: 0 } : { opacity: 1, x: 0 }}
          exit={isMobile ? { x: '100%' } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.3 }}
          className={`sidebar ${isMobile ? 'sidebar-mobile' : 'sidebar-desktop'}`}
        >
          {isMobile && (
            <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
          )}
          <div className="sidebar-content">
            <AlertsTasksDock />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
          <div className="back-button-container">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('overview')}
              className="back-button"
            >
              <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
              Volver
            </motion.button>
          </div>
          <Component />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Efectos de fondo */}
      <div className="background-effects" />

      {/* DataSeeder Modal */}
      <AnimatePresence>
        {showDataSeeder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowDataSeeder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-content"
            >
              <DataSeeder />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout principal */}
      <div className="main-layout">
        {/* Columna principal */}
        <div className="main-content">
          {renderHeader()}
          
          <div className="content-area">
            <AnimatePresence mode="wait">
              {renderActiveView()}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        {renderSidebar()}
      </div>

      {/* Botón flotante de IA */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="ai-button"
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
          className="ai-button-inner"
          title="Asistente IA"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Brain size={isMobile ? 20 : 24} color="#FFFFFF" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Indicador de notificaciones */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="notifications-indicator"
        >
          <div className="notification-content">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Bell size={14} />
            </motion.div>
            <span className="notification-count">
              {alerts.filter(a => !a.isRead).length}
            </span>
          </div>
        </motion.div>
      )}

      {/* Estilos CSS */}
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
          position: relative;
        }

        .background-effects {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: 
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
        }

        .main-layout {
          display: flex;
          max-width: 1600px;
          margin: 0 auto;
          padding: 1rem;
          gap: 1.5rem;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .content-area {
          flex: 1;
        }

        /* Header Styles */
        .header-container {
          background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%);
          border-radius: 1.5rem;
          padding: 1rem 1.5rem;
          border: 1px solid rgba(14, 165, 233, 0.2);
          box-shadow: 0 8px 32px rgba(14, 165, 233, 0.15);
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .header-logo {
          padding: 0.5rem;
          background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%);
          border-radius: 0.75rem;
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .header-text {
          min-width: 0;
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          line-height: 1.2;
          color: #0C4A6E;
          text-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
        }

        .header-subtitle {
          font-size: 0.875rem;
          color: #0369A1;
          font-weight: 600;
          margin: 0.125rem 0 0 0;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 0.75rem;
          border: 1px solid rgba(14, 165, 233, 0.2);
        }

        .status-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0C4A6E;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(14, 165, 233, 0.3);
          border-radius: 0.75rem;
          padding: 0.5rem;
          color: #0C4A6E;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          transform: scale(1.05);
        }

        .action-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .mobile-menu {
          border-color: rgba(139, 92, 246, 0.3);
          color: #6B21A8;
        }

        .refresh-btn {
          border-color: rgba(16, 185, 129, 0.3);
          color: #065F46;
        }

        .export-btn {
          border-color: rgba(14, 165, 233, 0.3);
          color: #0C4A6E;
        }

        .dev-btn {
          border-color: rgba(139, 92, 246, 0.3);
          color: #6B21A8;
        }

        /* Metrics Styles */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid rgba(229, 231, 235, 0.6);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .metric-card:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .metric-icon {
          padding: 0.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .trend-text {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loading-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #E5E7EB;
          border-top: 2px solid #2463EB;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .metric-content {
          text-align: left;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1C1E21;
          margin: 0 0 0.25rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6B7280;
          margin: 0;
          font-weight: 500;
        }

        /* Sections Styles */
        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .section-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 1rem;
          border: 2px solid transparent;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-card:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .section-card.active {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .section-icon {
          padding: 0.75rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section-content {
          flex: 1;
          min-width: 0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1C1E21;
          margin: 0 0 0.125rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }

        .section-description {
          font-size: 0.75rem;
          color: #6B7280;
          margin: 0;
        }

        /* Insights Styles */
        .insights-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(229, 231, 235, 0.6);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin-bottom: 1.5rem;
        }

        .insights-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .insights-icon {
          padding: 0.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insights-text {
          flex: 1;
        }

        .insights-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1C1E21;
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
        }

        .insights-subtitle {
          font-size: 0.75rem;
          color: #6B7280;
          margin: 0.125rem 0 0 0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 0.75rem;
        }

        .insights-empty {
          text-align: center;
          padding: 2rem;
          color: #6B7280;
          grid-column: 1 / -1;
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }

        .empty-description {
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .empty-action {
          padding: 0.5rem 1rem;
          background: #8B5CF6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin: 0 auto;
        }

        .insight-card {
          border: 1px solid;
          border-radius: 0.75rem;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .insight-card:hover {
          transform: scale(1.02);
        }

        .insight-content {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .insight-icon {
          padding: 0.375rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .insight-text {
          flex: 1;
          min-width: 0;
        }

        .insight-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.375rem;
        }

        .insight-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1C1E21;
          margin: 0;
          flex: 1;
        }

        .insight-confidence {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .insight-description {
          font-size: 0.75rem;
          color: #6B7280;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .insight-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .insight-timeframe {
          font-size: 0.75rem;
          color: #9CA3AF;
        }

        .insight-value {
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Sidebar Styles */
        .sidebar-desktop {
          width: 380px;
          flex-shrink: 0;
          position: sticky;
          top: 1rem;
          height: fit-content;
        }

        .sidebar-mobile {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          width: 100%;
          max-width: 400px;
        }

        .sidebar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .sidebar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          background: white;
          border-radius: 1rem 0 0 1rem;
          overflow: hidden;
        }

        /* Back Button */
        .back-button-container {
          margin-bottom: 1rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(229, 231, 235, 0.6);
          border-radius: 1rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6B7280;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          transform: scale(1.02);
        }

        /* Floating Buttons */
        .ai-button {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
        }

        .ai-button-inner {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notifications-indicator {
          position: fixed;
          top: 80px;
          right: 1.5rem;
          z-index: 1000;
        }

        .notification-content {
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          background: rgba(239, 68, 68, 0.9);
          backdrop-filter: blur(10px);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .notification-count {
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .main-layout {
            flex-direction: column;
            padding: 0.75rem;
            gap: 1rem;
          }

          .header-container {
            padding: 0.75rem 1rem;
            border-radius: 1rem;
          }

          .header-title {
            font-size: 1.125rem;
          }

          .header-subtitle {
            font-size: 0.75rem;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .sections-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .insights-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .ai-button {
            bottom: 1rem;
            right: 1rem;
          }

          .ai-button-inner {
            width: 45px;
            height: 45px;
          }

          .notifications-indicator {
            top: 70px;
            right: 1rem;
          }
        }

        @media (max-width: 640px) {
          .main-layout {
            padding: 0.5rem;
          }

          .header-content {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .header-main {
            order: 1;
            flex: 1 1 100%;
          }

          .header-status {
            order: 2;
            flex: 1;
          }

          .header-actions {
            order: 3;
            flex: 1;
            justify-content: flex-end;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .metric-card {
            padding: 0.75rem;
          }

          .metric-value {
            font-size: 1.5rem;
          }

          .section-card {
            padding: 0.75rem;
          }

          .insights-container {
            padding: 1rem;
          }

          .insight-card {
            padding: 0.5rem;
          }

          .ai-button {
            bottom: 0.75rem;
            right: 0.75rem;
          }

          .ai-button-inner {
            width: 40px;
            height: 40px;
          }

          .notifications-indicator {
            top: 60px;
            right: 0.75rem;
          }

          .notification-content {
            padding: 0.375rem 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 0.5rem 0.75rem;
          }

          .status-item {
            padding: 0.25rem 0.5rem;
          }

          .status-text {
            font-size: 0.625rem;
          }

          .action-btn {
            padding: 0.375rem;
          }

          .metric-card {
            padding: 0.5rem;
          }

          .metric-value {
            font-size: 1.25rem;
          }

          .metric-label {
            font-size: 0.75rem;
          }

          .section-card {
            padding: 0.5rem;
            gap: 0.5rem;
          }

          .section-icon {
            padding: 0.5rem;
          }

          .section-title {
            font-size: 0.875rem;
          }

          .insights-container {
            padding: 0.75rem;
          }

          .insights-title {
            font-size: 1rem;
          }

          .insights-subtitle {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
}
