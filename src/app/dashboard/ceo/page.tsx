'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  Heart, 
  Target, 
  Brain, 
  TrendingUp, 
  Sparkles,
  Download,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Clock,
  Calendar,
  Star,
  Zap,
  ChevronRight,
  BarChart2,
  Database,
  Users,
  Activity,
  Shield,
  Briefcase,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Filter,
  Eye,
  Plus,
  Maximize2
} from 'lucide-react';

import TabNavigation from '@/components/dashboard/TabNavigation';
import KPIGrid from '@/components/dashboard/KPIGrid';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import AIInsightsFooter from '@/components/dashboard/AIInsightsFooter';
import { useKPIMetrics, useAlerts, useTasks, useFinancialMetrics, useClinicalMetrics } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces mejoradas
interface DashboardStats {
  totalPatients: number;
  activeTherapists: number;
  monthlyRevenue: number;
  satisfactionRate: number;
  occupancyRate: number;
  growthRate: number;
}

interface QuickMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  bgColor: string;
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

export default function CEODashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('executive');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  
  // Hooks de datos
  const { metrics: kpiMetrics, loading: kpiLoading } = useKPIMetrics();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { tasks, loading: tasksLoading } = useTasks();
  const { metrics: financialMetrics, loading: financialLoading } = useFinancialMetrics();
  const { metrics: clinicalMetrics, loading: clinicalLoading } = useClinicalMetrics();

  // Estados de datos
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPatients: 247,
    activeTherapists: 12,
    monthlyRevenue: 89750,
    satisfactionRate: 94.2,
    occupancyRate: 87.5,
    growthRate: 12.8
  });

  // Estado para notificaciones
  const [notifications, setNotifications] = useState(0);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Métricas rápidas
  const quickMetrics: QuickMetric[] = [
    {
      id: 'revenue',
      label: 'Ingresos del Mes',
      value: `$${dashboardStats.monthlyRevenue.toLocaleString()}`,
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5'
    },
    {
      id: 'patients',
      label: 'Pacientes Activos',
      value: dashboardStats.totalPatients.toString(),
      change: 8.3,
      trend: 'up',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      id: 'occupancy',
      label: 'Ocupación',
      value: `${dashboardStats.occupancyRate}%`,
      change: -2.1,
      trend: 'down',
      icon: Activity,
      color: '#F59E0B',
      bgColor: '#FFFBEB'
    },
    {
      id: 'satisfaction',
      label: 'Satisfacción',
      value: `${dashboardStats.satisfactionRate}%`,
      change: 3.7,
      trend: 'up',
      icon: Star,
      color: '#8B5CF6',
      bgColor: '#F3E8FF'
    }
  ];

  // Insights de IA
  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'Pico de demanda previsto',
      description: 'Se espera un aumento del 34% en citas para la próxima semana basado en patrones históricos.',
      confidence: 87,
      impact: 'high',
      timeframe: '7 días',
      value: '+34% demanda',
      actionable: true
    },
    {
      id: '2',
      type: 'optimization',
      title: 'Optimización de horarios',
      description: 'Reasignar 3 slots de tarde a mañana podría incrementar la eficiencia en un 12%.',
      confidence: 92,
      impact: 'medium',
      timeframe: 'Inmediato',
      value: '+12% eficiencia',
      actionable: true
    },
    {
      id: '3',
      type: 'alert',
      title: 'Riesgo de cancelaciones',
      description: 'Patrón anómalo detectado: 23% más cancelaciones los viernes.',
      confidence: 78,
      impact: 'medium',
      timeframe: 'Esta semana',
      value: '-23% retención',
      actionable: true
    }
  ];

  // Pestañas actualizadas
  const tabs = [
    {
      id: 'executive',
      label: 'Centro de Comando',
      icon: BarChart3,
      description: 'Vista ejecutiva integral',
      badge: alerts.filter(a => !a.isRead).length
    },
    {
      id: 'financial',
      label: 'Inteligencia Financiera',
      icon: DollarSign,
      description: 'Análisis predictivo de ingresos',
      route: '/dashboard/ceo/financial'
    },
    {
      id: 'clinical',
      label: 'Operaciones Clínicas',
      icon: Heart,
      description: 'Salud operativa en tiempo real'
    },
    {
      id: 'commercial',
      label: 'Marketing Inteligente',
      icon: Target,
      description: 'Optimización de conversión',
      route: '/dashboard/ceo/commercial'
    },
    {
      id: 'insights',
      label: 'IA & Predicciones',
      icon: Brain,
      description: 'Insights con machine learning',
      badge: 5
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
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

  // Hero Section Mejorado
  const renderHeroSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #06B6D4 100%)',
        borderRadius: '2rem',
        padding: '3rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}
    >
      {/* Efectos de fondo animados */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ marginRight: '1rem' }}
            >
              <Sparkles size={32} color="rgba(255, 255, 255, 0.9)" />
            </motion.div>
            <div>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                margin: 0,
                lineHeight: 1.1
              }}>
                Bienvenido, Dr. Mendoza
              </h1>
              <p style={{ 
                fontSize: '1.25rem',
                opacity: 0.9,
                fontWeight: 400,
                margin: '0.5rem 0 0 0'
              }}>
                Centro de comando ejecutivo
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} />
              <span style={{ fontSize: '1rem' }}>
                {currentTime.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              <span style={{ fontSize: '1rem' }}>
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} />
              <span style={{ fontSize: '1rem' }}>Sistema seguro</span>
            </div>
          </div>

          {/* Métricas rápidas en el hero */}
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {quickMetrics.slice(0, 2).map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1rem 1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '140px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <metric.icon size={20} />
                  <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>{metric.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metric.value}</span>
                  {getTrendIcon(metric.trend)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              padding: '1.5rem 2.5rem',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              marginBottom: '1rem'
            }}
          >
            <Download size={24} />
            Resumen Ejecutivo
          </motion.button>
          
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            Última actualización: {currentTime.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Métricas principales
  const renderMainMetrics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}
    >
      {quickMetrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
            flex: '1',
            minWidth: '250px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '2rem',
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
              top: '-50px',
              right: '-50px',
              width: '100px',
              height: '100px',
              background: `${metric.color}10`,
              borderRadius: '50%',
              opacity: 0.5
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '1rem',
                  backgroundColor: metric.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <metric.icon size={24} color={metric.color} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getTrendIcon(metric.trend)}
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: metric.trend === 'up' ? '#10B981' : metric.trend === 'down' ? '#EF4444' : '#6B7280'
                }}>
                  {Math.abs(metric.change)}%
                </span>
              </div>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1C1E21',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {metric.value}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                margin: 0,
                fontWeight: 500
              }}>
                {metric.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Panel de insights de IA
  const renderAIInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              padding: '1rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Brain size={24} color="white" />
          </motion.div>
          <div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Insights Inteligentes
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0'
            }}>
              Recomendaciones basadas en IA
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              background: 'rgba(249, 250, 251, 0.8)',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="day">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Trimestre</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              background: 'rgba(249, 250, 251, 0.8)',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <RefreshCw size={16} color="#6B7280" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        {aiInsights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type);
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 8, scale: 1.01 }}
              style={{
                background: `${getInsightColor(insight.impact)}05`,
                border: `1px solid ${getInsightColor(insight.impact)}20`,
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: `${getInsightColor(insight.impact)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent size={20} color={getInsightColor(insight.impact)} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <h4 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 600, 
                      color: '#1C1E21',
                      margin: 0,
                      flex: 1
                    }}>
                      {insight.title}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: `${getInsightColor(insight.impact)}15`,
                      color: getInsightColor(insight.impact),
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}>
                      <TrendingUp size={14} />
                      {insight.confidence}%
                    </div>
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6B7280', 
                    marginBottom: '1rem',
                    lineHeight: 1.5
                  }}>
                    {insight.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {insight.timeframe}
                      </span>
                      {insight.value && (
                        <span style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 600,
                          color: getInsightColor(insight.impact),
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.5rem',
                          backgroundColor: `${getInsightColor(insight.impact)}10`
                        }}>
                          {insight.value}
                        </span>
                      )}
                    </div>
                    
                    {insight.actionable && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: getInsightColor(insight.impact),
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Eye size={14} />
                        Ver detalles
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // KPI Grid mejorado
  const renderKPISection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{ marginBottom: '2rem' }}
    >
      {kpiMetrics && kpiMetrics.length > 0 ? (
        <KPIGrid metrics={kpiMetrics} />
      ) : (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginBottom: '1.5rem' }}
          >
            <BarChart2 size={64} color="#9CA3AF" />
          </motion.div>
          
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: '#1C1E21',
            marginBottom: '0.75rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Conectando con Firebase
          </h3>
          
          <p style={{ 
            fontSize: '1rem', 
            color: '#6B7280',
            marginBottom: '2rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Los datos de KPI se están cargando desde la base de datos. 
            Mientras tanto, puedes explorar los insights de IA.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <RefreshCw size={16} />
            Actualizar datos
          </motion.button>
        </div>
      )}
    </motion.div>
  );

  const renderTabContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.3 }
      }
    };

    switch (activeTab) {
      case 'executive':
        return (
          <motion.div
            key="executive"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderHeroSection()}
            {renderMainMetrics()}
            {renderAIInsights()}
            {renderKPISection()}
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            key="financial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FinancialPanel />
          </motion.div>
        );

      case 'clinical':
        return (
          <motion.div
            key="clinical"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ClinicalPanel />
          </motion.div>
        );

      case 'commercial':
        return (
          <motion.div
            key="commercial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CommercialPanel />
          </motion.div>
        );

      case 'insights':
        return (
          <motion.div
            key="insights"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '3rem',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                IA & Predicciones
              </h2>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#6B7280',
                maxWidth: '600px', 
                margin: '0 auto'
              }}>
                Inteligencia artificial avanzada con modelos predictivos y recomendaciones automáticas
              </p>
            </div>
            <AIInsightsFooter onRefresh={handleRefresh} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
        `
      }} />

      {/* Layout principal con flexbox */}
      <div style={{ 
        display: 'flex',
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: '2rem',
        gap: '2rem',
        minHeight: '100vh'
      }}>
        {/* Columna principal */}
        <div style={{ 
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>
          {/* Navegación de pestañas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '2rem' }}
          >
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              variant="cards"
              showDescriptions={true}
              enableRouting={true}
            />
          </motion.div>

          {/* Contenido de pestañas */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </div>

        {/* Columna lateral - AlertsTasksDock */}
        <div style={{ 
          width: '320px',
          flexShrink: 0
        }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ position: 'sticky', top: '2rem' }}
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
          style={{
            width: '80px',
            height: '80px',
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
            <Brain size={32} color="#FFFFFF" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Indicador de notificaciones flotante */}
      {notifications > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            position: 'fixed',
            top: '100px',
            right: '32px',
            zIndex: 1000,
          }}
        >
          <div style={{
            padding: '1rem',
            borderRadius: '1rem',
            background: 'rgba(239, 68, 68, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '120px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Bell size={20} />
            </motion.div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {notifications} alertas
            </span>
          </div>
        </motion.div>
      )}

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @media (max-width: 1200px) {
          .dashboard-layout {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            position: relative !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          
          .metrics-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}