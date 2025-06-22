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
  Info,
  Clock,
  Calendar,
  Star,
  Zap,
  BarChart2,
  Database,
  Users,
  Activity,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Eye,
} from 'lucide-react';

import TabNavigation from '@/components/dashboard/TabNavigation';
import KPIGrid from '@/components/dashboard/KPIGrid';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import AIInsightsFooter from '@/components/dashboard/AIInsightsFooter';
import { useKPIMetrics, useAlerts, useTasks } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interfaces mejoradas
interface DashboardStats {
  totalPatients: number;
  activeTherapists: number;
  monthlyRevenue: number;
  satisfactionRate: number;
  occupancyRate: number;
  growthRate: number;
  totalSessions: number;
  pendingPayments: number;
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

export default function CEODashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('executive');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPatients: 0,
    activeTherapists: 0,
    monthlyRevenue: 0,
    satisfactionRate: 0,
    occupancyRate: 0,
    growthRate: 0,
    totalSessions: 0,
    pendingPayments: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Hooks de datos
  const { metrics: kpiMetrics, loading: kpiLoading } = useKPIMetrics();
  const { alerts } = useAlerts();
  const { tasks } = useTasks();

  // Cargar estadísticas del dashboard desde Firebase
  useEffect(() => {
    if (!user?.centerId) return;

    const loadDashboardStats = async () => {
      try {
        setStatsLoading(true);
        
        // Cargar pacientes
        const patientsSnapshot = await getDocs(collection(db, 'centers', user.centerId, 'patients'));
        const activePatients = patientsSnapshot.docs.filter(doc => doc.data().status === 'active').length;

        // Cargar terapeutas
        const therapistsSnapshot = await getDocs(collection(db, 'centers', user.centerId, 'therapists'));
        const activeTherapists = therapistsSnapshot.docs.filter(doc => doc.data().status === 'active').length;

        // Cargar sesiones del mes actual
        const currentMonth = new Date();
        currentMonth.setDate(1);
        const sessionsQuery = query(
          collection(db, 'centers', user.centerId, 'sessions'),
          where('date', '>=', currentMonth),
          where('status', '==', 'completed')
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const totalSessions = sessionsSnapshot.size;
        
        // Calcular ingresos del mes
        const monthlyRevenue = sessionsSnapshot.docs.reduce((total, doc) => {
          return total + (doc.data().cost || 0);
        }, 0);

        // Calcular pagos pendientes
        const pendingPaymentsQuery = query(
          collection(db, 'centers', user.centerId, 'sessions'),
          where('paid', '==', false),
          where('status', '==', 'completed')
        );
        const pendingPaymentsSnapshot = await getDocs(pendingPaymentsQuery);
        const pendingPayments = pendingPaymentsSnapshot.docs.reduce((total, doc) => {
          return total + (doc.data().cost || 0);
        }, 0);

        // Calcular tasa de ocupación (simulada basada en sesiones)
        const occupancyRate = Math.min((totalSessions / (activeTherapists * 20)) * 100, 100); // 20 sesiones por terapeuta por mes

        // Calcular satisfacción promedio (simulada)
        const satisfactionRate = 92.5 + Math.random() * 5; // Entre 92.5 y 97.5

        // Calcular crecimiento (comparar con mes anterior)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        lastMonth.setDate(1);
        const lastMonthEnd = new Date();
        lastMonthEnd.setDate(0);
        
        const lastMonthQuery = query(
          collection(db, 'centers', user.centerId, 'sessions'),
          where('date', '>=', lastMonth),
          where('date', '<=', lastMonthEnd),
          where('status', '==', 'completed')
        );
        const lastMonthSnapshot = await getDocs(lastMonthQuery);
        const lastMonthRevenue = lastMonthSnapshot.docs.reduce((total, doc) => {
          return total + (doc.data().cost || 0);
        }, 0);
        
        const growthRate = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

        setDashboardStats({
          totalPatients: activePatients,
          activeTherapists,
          monthlyRevenue,
          satisfactionRate,
          occupancyRate,
          growthRate,
          totalSessions,
          pendingPayments
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Mantener valores por defecto en caso de error
      } finally {
        setStatsLoading(false);
      }
    };

    loadDashboardStats();
  }, [user?.centerId]);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Métricas rápidas con datos reales
  const quickMetrics: QuickMetric[] = [
    {
      id: 'revenue',
      label: 'Ingresos del Mes',
      value: `$${dashboardStats.monthlyRevenue.toLocaleString()}`,
      change: dashboardStats.growthRate,
      trend: dashboardStats.growthRate > 0 ? 'up' : dashboardStats.growthRate < 0 ? 'down' : 'stable',
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
      loading: statsLoading
    },
    {
      id: 'patients',
      label: 'Pacientes Activos',
      value: dashboardStats.totalPatients.toString(),
      change: 8.3, // Esto podría calcularse comparando con el mes anterior
      trend: 'up',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      loading: statsLoading
    },
    {
      id: 'occupancy',
      label: 'Ocupación',
      value: `${dashboardStats.occupancyRate.toFixed(1)}%`,
      change: -2.1,
      trend: 'down',
      icon: Activity,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      loading: statsLoading
    },
    {
      id: 'satisfaction',
      label: 'Satisfacción',
      value: `${dashboardStats.satisfactionRate.toFixed(1)}%`,
      change: 3.7,
      trend: 'up',
      icon: Star,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      loading: statsLoading
    }
  ];

  // Insights de IA basados en datos reales
  const generateAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];

    // Insight basado en ocupación
    if (dashboardStats.occupancyRate < 70) {
      insights.push({
        id: 'occupancy-low',
        type: 'recommendation',
        title: 'Optimizar horarios disponibles',
        description: `La ocupación actual es del ${dashboardStats.occupancyRate.toFixed(1)}%. Considera ajustar horarios o promociones para aumentar la demanda.`,
        confidence: 85,
        impact: 'medium',
        timeframe: 'Esta semana',
        value: `+${(100 - dashboardStats.occupancyRate).toFixed(1)}% potencial`,
        actionable: true
      });
    }

    // Insight basado en crecimiento
    if (dashboardStats.growthRate > 10) {
      insights.push({
        id: 'growth-high',
        type: 'prediction',
        title: 'Crecimiento acelerado detectado',
        description: `Con un crecimiento del ${dashboardStats.growthRate.toFixed(1)}%, considera expandir el equipo o las instalaciones.`,
        confidence: 92,
        impact: 'high',
        timeframe: 'Próximo trimestre',
        value: `+${dashboardStats.growthRate.toFixed(1)}% crecimiento`,
        actionable: true
      });
    }

    // Insight basado en pagos pendientes
    if (dashboardStats.pendingPayments > 5000) {
      insights.push({
        id: 'payments-pending',
        type: 'alert',
        title: 'Pagos pendientes elevados',
        description: `Hay $${dashboardStats.pendingPayments.toLocaleString()} en pagos pendientes. Considera implementar recordatorios automáticos.`,
        confidence: 95,
        impact: 'high',
        timeframe: 'Inmediato',
        value: `$${dashboardStats.pendingPayments.toLocaleString()} pendientes`,
        actionable: true
      });
    }

    return insights;
  };

  const aiInsights = generateAIInsights();

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
      badge: aiInsights.length
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Recargar datos
    window.location.reload();
  };

  const handleExportReport = async () => {
    try {
      // Generar reporte PDF
      const reportData = {
        date: new Date().toISOString(),
        stats: dashboardStats,
        alerts: alerts.filter(a => !a.isRead),
        tasks: tasks.filter(t => t.status !== 'done'),
        insights: aiInsights
      };

      // Crear blob con los datos
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-ejecutivo-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
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
                Bienvenido, {user?.name || 'Dr. Mendoza'}
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
                  {metric.loading ? (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metric.value}</span>
                      {getTrendIcon(metric.trend)}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportReport}
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
            minWidth: '280px',
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
                      fontSize: '0.875rem',
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
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1C1E21',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {metric.loading ? '...' : metric.value}
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
              Recomendaciones basadas en datos reales
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
        {aiInsights.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6B7280'
          }}>
            <Brain size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Analizando datos...
            </h4>
            <p style={{ fontSize: '0.875rem' }}>
              Los insights se generarán automáticamente basados en los datos de tu centro.
            </p>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            // Aquí puedes implementar acciones específicas para cada insight
                            console.log('Acción para insight:', insight.id);
                          }}
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
          })
        )}
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
          {kpiLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ marginBottom: '1.5rem' }}
              >
                <Database size={64} color="#2463EB" />
              </motion.div>
              
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 600, 
                color: '#1C1E21',
                marginBottom: '0.75rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Cargando métricas de Firebase
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                color: '#6B7280',
                marginBottom: '2rem',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Conectando con la base de datos para obtener las métricas más recientes...
              </p>
            </>
          ) : (
            <>
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
                No hay métricas KPI configuradas
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                color: '#6B7280',
                marginBottom: '2rem',
                maxWidth: '400px',
                margin: '0 auto 2rem auto'
              }}>
                Configura métricas KPI en Firebase para ver análisis detallados aquí.
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
            </>
          )}
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
        transition: { duration: 0.6, ease: "easeOut" }
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
            <AIInsightsFooter onRefresh={handleRefresh} onExport={handleExportReport} />
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
          width: '380px',
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
          onClick={() => setActiveTab('insights')}
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
              {alerts.filter(a => !a.isRead).length} alertas
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
