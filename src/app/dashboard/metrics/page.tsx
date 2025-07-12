'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Activity,
  Heart,
  Star,
  AlertTriangle,
  RefreshCw,
  Download,
  Settings,
  Database,
  Wifi,
  WifiOff,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PieChart,
  LineChart,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Shield,
  Award,
  Gauge
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useKPIMetrics, useFinancialData, useClinicalMetrics } from '@/hooks/useDashboardData';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Interfaces para métricas específicas
interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  unit?: string;
  description?: string;
  target?: number;
  category: 'financial' | 'clinical' | 'operational' | 'satisfaction';
}


export default function MetricsPage() {
  const { user } = useAuth();
  const { theme } = useStyles();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('month');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // Hooks de datos
  const { loading: kpiLoading, error: kpiError } = useKPIMetrics();
  const { loading: financialLoading, error: financialError } = useFinancialData();
  const { loading: clinicalLoading, error: clinicalError } = useClinicalMetrics();

  // Estado de carga general
  const isLoading = kpiLoading || financialLoading || clinicalLoading;
  const hasError = kpiError || financialError || clinicalError;

  // Datos mock para desarrollo cuando no hay datos de Firebase
  const mockMetrics: MetricCard[] = [
    {
      id: 'revenue',
      title: 'Ingresos Mensuales',
      value: 89750,
      previousValue: 78200,
      change: 14.8,
      trend: 'up',
      icon: TrendingUp,
      color: '#10B981',
      bgColor: '#ECFDF5',
      unit: '€',
      description: 'Ingresos totales del mes actual',
      target: 95000,
      category: 'financial'
    },
    {
      id: 'patients',
      title: 'Pacientes Activos',
      value: 247,
      previousValue: 228,
      change: 8.3,
      trend: 'up',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      description: 'Pacientes con sesiones programadas',
      target: 300,
      category: 'clinical'
    },
    {
      id: 'sessions',
      title: 'Sesiones Completadas',
      value: 156,
      previousValue: 142,
      change: 9.9,
      trend: 'up',
      icon: Calendar,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      description: 'Sesiones realizadas este mes',
      target: 180,
      category: 'operational'
    },
    {
      id: 'satisfaction',
      title: 'Satisfacción Promedio',
      value: '94.2%',
      previousValue: 91.8,
      change: 2.6,
      trend: 'up',
      icon: Star,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      description: 'Puntuación promedio de satisfacción',
      target: 95,
      category: 'satisfaction'
    },
    {
      id: 'occupancy',
      title: 'Tasa de Ocupación',
      value: '87.5%',
      previousValue: 82.1,
      change: 6.6,
      trend: 'up',
      icon: Activity,
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      description: 'Porcentaje de horarios ocupados',
      target: 90,
      category: 'operational'
    },
    {
      id: 'adherence',
      title: 'Adherencia al Tratamiento',
      value: '92.1%',
      previousValue: 89.4,
      change: 3.0,
      trend: 'up',
      icon: Heart,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      description: 'Pacientes que siguen el tratamiento',
      target: 95,
      category: 'clinical'
    },
    {
      id: 'cancellation',
      title: 'Tasa de Cancelación',
      value: '8.2%',
      previousValue: 12.1,
      change: -32.2,
      trend: 'up',
      icon: AlertTriangle,
      color: '#84CC16',
      bgColor: '#F7FEE7',
      description: 'Sesiones canceladas vs programadas',
      target: 5,
      category: 'operational'
    },
    {
      id: 'improvement',
      title: 'Tasa de Mejora',
      value: '78.9%',
      previousValue: 74.2,
      change: 6.3,
      trend: 'up',
      icon: TrendingUp,
      color: '#10B981',
      bgColor: '#ECFDF5',
      description: 'Pacientes con mejora clínica',
      target: 80,
      category: 'clinical'
    }
  ];

  // Datos para gráficos
  const monthlyTrendData = [
    { month: 'Ene', revenue: 65000, sessions: 120, patients: 200, satisfaction: 88 },
    { month: 'Feb', revenue: 72000, sessions: 125, patients: 215, satisfaction: 89 },
    { month: 'Mar', revenue: 68000, sessions: 135, patients: 225, satisfaction: 90 },
    { month: 'Abr', revenue: 75000, sessions: 140, patients: 235, satisfaction: 91 },
    { month: 'May', revenue: 82000, sessions: 145, patients: 240, satisfaction: 92 },
    { month: 'Jun', revenue: 78000, sessions: 150, patients: 245, satisfaction: 93 },
    { month: 'Jul', revenue: 89750, sessions: 156, patients: 247, satisfaction: 94.2 }
  ];

  const categoryDistribution = [
    { name: 'Ansiedad', value: 35, color: '#3B82F6' },
    { name: 'Depresión', value: 28, color: '#EF4444' },
    { name: 'Terapia de Pareja', value: 18, color: '#10B981' },
    { name: 'Terapia Familiar', value: 12, color: '#F59E0B' },
    { name: 'Otros', value: 7, color: '#8B5CF6' }
  ];

  const performanceMetrics = [
    { name: 'PHQ-9 Promedio', value: 12.3, target: 10, color: '#3B82F6' },
    { name: 'GAD-7 Promedio', value: 10.8, target: 8, color: '#10B981' },
    { name: 'Tiempo Promedio Sesión', value: 52, target: 50, color: '#F59E0B' },
    { name: 'Pacientes de Riesgo', value: 23, target: 15, color: '#EF4444' }
  ];

  // Funciones auxiliares
  const formatValue = (value: number | string, unit?: string) => {
    if (typeof value === 'string') return value;
    if (unit === '€') return `€${value.toLocaleString()}`;
    if (unit === '%') return `${value}%`;
    return value.toLocaleString();
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight size={16} color="#10B981" />;
    if (trend === 'down') return <ArrowDownRight size={16} color="#EF4444" />;
    return <Minus size={16} color="#6B7280" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return '#10B981';
    if (trend === 'down') return '#EF4444';
    return '#6B7280';
  };

  const getProgressPercentage = (value: number, target?: number) => {
    if (!target) return 0;
    return Math.min((value / target) * 100, 100);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    window.location.reload();
  };

  const handleExport = () => {
    const exportData = {
      metrics: mockMetrics,
      monthlyTrends: monthlyTrendData,
      categoryDistribution,
      performanceMetrics,
      exportDate: new Date().toISOString(),
      centerId: user?.centerId
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metricas-completas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? mockMetrics 
    : mockMetrics.filter(metric => metric.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Todas las Métricas', icon: BarChart3, count: mockMetrics.length },
    { id: 'financial', label: 'Financieras', icon: TrendingUp, count: mockMetrics.filter(m => m.category === 'financial').length },
    { id: 'clinical', label: 'Clínicas', icon: Heart, count: mockMetrics.filter(m => m.category === 'clinical').length },
    { id: 'operational', label: 'Operacionales', icon: Activity, count: mockMetrics.filter(m => m.category === 'operational').length },
    { id: 'satisfaction', label: 'Satisfacción', icon: Star, count: mockMetrics.filter(m => m.category === 'satisfaction').length }
  ];

  // Interfaces para el tooltip de Recharts
  interface TooltipPayload {
    name: string;
    value: number;
    color: string;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }

  // Tooltip personalizado para gráficos
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
          {payload.map((entry: TooltipPayload, index: number) => (
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
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Renderizar estado de error
  if (hasError && !mockMetrics.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          padding: '2rem'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <Card variant="default">
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WifiOff size={48} color="#EF4444" />
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#1C1E21',
                  marginBottom: '0.5rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Error de Conexión
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6B7280',
                  marginBottom: '2rem',
                  maxWidth: '400px'
                }}>
                  No se pudieron cargar las métricas desde Firebase. Mostrando datos de ejemplo.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  variant="primary"
                  icon={RefreshCw}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 'Cargando...' : 'Reintentar'}
                </Button>
                <Button
                  variant="outline"
                  icon={Database}
                  onClick={() => window.open('https://console.firebase.google.com', '_blank')}
                >
                  Configurar Firebase
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  }

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

      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
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
                  <BarChart3 size={32} color="rgba(255, 255, 255, 0.9)" />
                </motion.div>
                <div>
                  <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif',
                    margin: 0,
                    lineHeight: 1.1
                  }}>
                    Centro de Métricas
                  </h1>
                  <p style={{
                    fontSize: '1.25rem',
                    opacity: 0.9,
                    fontWeight: 400,
                    margin: '0.5rem 0 0 0'
                  }}>
                    Análisis integral de rendimiento
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
                  <Database size={18} />
                  <span style={{ fontSize: '1rem' }}>
                    {isLoading ? 'Cargando...' : `${filteredMetrics.length} métricas`}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wifi size={18} />
                  <span style={{ fontSize: '1rem' }}>
                    {hasError ? 'Datos de ejemplo' : 'Tiempo real'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={18} />
                  <span style={{ fontSize: '1rem' }}>Sistema seguro</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
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
                Exportar Métricas
              </motion.button>

              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                Última actualización: {new Date().toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros y Controles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Categorías */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            backdropFilter: 'blur(10px)',
            flexWrap: 'wrap'
          }}>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  backgroundColor: selectedCategory === category.id ? 'white' : 'transparent',
                  color: selectedCategory === category.id ? '#2463EB' : '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: selectedCategory === category.id ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                <category.icon size={16} />
                {category.label}
                <span style={{
                  backgroundColor: selectedCategory === category.id ? '#2463EB' : '#E5E7EB',
                  color: selectedCategory === category.id ? 'white' : '#6B7280',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Controles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                background: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Año</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                background: showAdvancedMetrics ? '#2463EB' : 'rgba(255, 255, 255, 0.8)',
                color: showAdvancedMetrics ? 'white' : '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                outline: 'none',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Settings size={16} />
              Avanzado
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                background: 'rgba(255, 255, 255, 0.8)',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                backdropFilter: 'blur(10px)'
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
        </motion.div>

        {/* Grid de Métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {filteredMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
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
              onClick={() => toggleCardExpansion(metric.id)}
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
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem'
                }}>
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
                    {metric.change && getTrendIcon(metric.trend)}
                    {metric.change && (
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: getTrendColor(metric.trend)
                      }}>
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Valor principal */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#1C1E21',
                    margin: '0 0 0.5rem 0',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {formatValue(metric.value, metric.unit)}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    margin: 0,
                    fontWeight: 500
                  }}>
                    {metric.title}
                  </p>
                </div>

                {/* Descripción */}
                {metric.description && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    marginBottom: '1.5rem',
                    lineHeight: 1.5
                  }}>
                    {metric.description}
                  </p>
                )}

                {/* Progreso hacia meta */}
                {metric.target && typeof metric.value === 'number' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Target size={14} />
                        Meta
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1C1E21'
                      }}>
                        {formatValue(metric.target, metric.unit)}
                      </span>
                    </div>

                    <div style={{
                      width: '100%',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '0.5rem',
                      height: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(metric.value, metric.target)}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${metric.color}, ${metric.color}CC)`,
                          borderRadius: '0.5rem'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Contenido expandido */}
                <AnimatePresence>
                  {expandedCards.has(metric.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        borderTop: '1px solid #E5E7EB',
                        paddingTop: '1rem',
                        marginTop: '1rem'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          backgroundColor: `${metric.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Info size={16} color={metric.color} />
                        </div>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1C1E21'
                        }}>
                          Detalles adicionales
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        <div>
                          <span style={{ color: '#6B7280' }}>Valor anterior:</span>
                          <br />
                          <span style={{ fontWeight: 600, color: '#1C1E21' }}>
                            {metric.previousValue ? formatValue(metric.previousValue, metric.unit) : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6B7280' }}>Categoría:</span>
                          <br />
                          <span style={{ fontWeight: 600, color: '#1C1E21' }}>
                            {metric.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Indicador de expansión */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '1rem'
                }}>
                  {expandedCards.has(metric.id) ? (
                    <ChevronUp size={20} color="#6B7280" />
                  ) : (
                    <ChevronDown size={20} color="#6B7280" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gráficos Avanzados */}
        <AnimatePresence>
          {showAdvancedMetrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '3rem' }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '2rem'
              }}>
                {/* Tendencias Mensuales */}
                <Card variant="default">
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1C1E21',
                      margin: '0 0 1.5rem 0',
                      fontFamily: 'Space Grotesk, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <LineChart size={20} />
                      Tendencias Mensuales
                    </h3>

                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                          <YAxis stroke="#6B7280" fontSize={12} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                            name="Ingresos"
                          />
                          <Line
                            type="monotone"
                            dataKey="sessions"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            name="Sesiones"
                          />
                          <Line
                            type="monotone"
                            dataKey="satisfaction"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                            name="Satisfacción"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                {/* Distribución por Categorías */}
                <Card variant="default">
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1C1E21',
                      margin: '0 0 1.5rem 0',
                      fontFamily: 'Space Grotesk, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <PieChart size={20} />
                      Distribución por Categorías
                    </h3>

                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip
                            formatter={(value: number | string) => [`${value}%`, 'Porcentaje']}
                            labelFormatter={(label) => `Categoría: ${label}`}
                          />
                          <Legend />
                          <RechartsPieChart data={categoryDistribution}>
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </RechartsPieChart>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                {/* Métricas de Rendimiento */}
                <Card variant="default">
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1C1E21',
                      margin: '0 0 1.5rem 0',
                      fontFamily: 'Space Grotesk, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Gauge size={20} />
                      Métricas de Rendimiento
                    </h3>

                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceMetrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                          <YAxis stroke="#6B7280" fontSize={12} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                {/* Resumen Ejecutivo */}
                <Card variant="default">
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1C1E21',
                      margin: '0 0 1.5rem 0',
                      fontFamily: 'Space Grotesk, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Award size={20} />
                      Resumen Ejecutivo
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      {[
                        {
                          title: 'Rendimiento General',
                          value: '92.5%',
                          status: 'excellent',
                          description: 'Superando objetivos en la mayoría de métricas'
                        },
                        {
                          title: 'Áreas de Mejora',
                          value: '2',
                          status: 'warning',
                          description: 'Tasa de cancelación y tiempo de sesión'
                        },
                        {
                          title: 'Tendencia',
                          value: 'Positiva',
                          status: 'good',
                          description: 'Crecimiento sostenido en los últimos 6 meses'
                        }
                      ].map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            backgroundColor: item.status === 'excellent' ? '#ECFDF5' :
                                           item.status === 'warning' ? '#FFFBEB' : '#EFF6FF',
                            border: `1px solid ${
                              item.status === 'excellent' ? '#10B981' :
                              item.status === 'warning' ? '#F59E0B' : '#3B82F6'
                            }20`
                          }}
                        >
                          <div>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#1C1E21',
                              margin: '0 0 0.25rem 0'
                            }}>
                              {item.title}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#6B7280',
                              margin: 0
                            }}>
                              {item.description}
                            </p>
                          </div>
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: item.status === 'excellent' ? '#10B981' :
                                   item.status === 'warning' ? '#F59E0B' : '#3B82F6'
                          }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer con información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Sparkles size={20} color="#2463EB" />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Centro de Métricas Inteligente
            </h3>
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6
          }}>
            Este dashboard proporciona una vista integral del rendimiento de tu centro psicológico.
            Las métricas se actualizan en tiempo real y están diseñadas para ayudarte a tomar
            decisiones informadas basadas en datos.
          </p>
        </motion.div>
      </div>

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
        
        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
