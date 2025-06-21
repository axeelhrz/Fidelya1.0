'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Heart, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  Users, 
  TrendingUp, 
  Shield, 
  Brain,
  Zap,
  Clock,
  Target,
  BarChart3,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Plus,
  Radio,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Maximize2,
  MoreVertical,
  Star,
  Layers,
  Gauge
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
  LineChart,
  Line,
  Area,
  AreaChart,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useClinicalMetrics } from '@/hooks/useDashboardData';
import { useStyles } from '@/lib/useStyles';

// Datos mock ultra profesionales
const mockClinicalData = {
  healthMetrics: {
    operationalHealth: 94.2,
    patientSafety: 98.7,
    clinicalEfficiency: 87.3,
    riskLevel: 'low',
    trend: 'up'
  },
  riskRadar: [
    { subject: 'PHQ-9 Crítico', value: 12, max: 25, color: '#EF4444', priority: 'high' },
    { subject: 'GAD-7 Elevado', value: 8, max: 25, color: '#F59E0B', priority: 'medium' },
    { subject: 'Sin Progreso', value: 15, max: 25, color: '#EF4444', priority: 'high' },
    { subject: 'Ausentismo', value: 6, max: 25, color: '#10B981', priority: 'low' },
    { subject: 'Medicación', value: 9, max: 25, color: '#F59E0B', priority: 'medium' },
    { subject: 'Crisis Recientes', value: 4, max: 25, color: '#EF4444', priority: 'high' },
  ],
  capacityForecast: [
    { 
      day: 'Lun', 
      morning: 85, 
      afternoon: 92, 
      evening: 78,
      predicted: 88,
      optimal: 85,
      alerts: 1
    },
    { 
      day: 'Mar', 
      morning: 90, 
      afternoon: 88, 
      evening: 82,
      predicted: 87,
      optimal: 85,
      alerts: 0
    },
    { 
      day: 'Mié', 
      morning: 78, 
      afternoon: 95, 
      evening: 85,
      predicted: 86,
      optimal: 85,
      alerts: 2
    },
    { 
      day: 'Jue', 
      morning: 88, 
      afternoon: 90, 
      evening: 80,
      predicted: 86,
      optimal: 85,
      alerts: 0
    },
    { 
      day: 'Vie', 
      morning: 95, 
      afternoon: 85, 
      evening: 75,
      predicted: 85,
      optimal: 85,
      alerts: 1
    },
    { 
      day: 'Sáb', 
      morning: 60, 
      afternoon: 70, 
      evening: 45,
      predicted: 58,
      optimal: 60,
      alerts: 0
    },
    { 
      day: 'Dom', 
      morning: 45, 
      afternoon: 55, 
      evening: 35,
      predicted: 45,
      optimal: 50,
      alerts: 0
    }
  ],
  adherenceStats: {
    completed: 73.2,
    pending: 18.5,
    cancelled: 8.3,
    trends: {
      completed: 5.2,
      pending: -2.1,
      cancelled: -3.1
    }
  },
  riskPatients: {
    critical: 12,
    high: 23,
    medium: 19,
    total: 54,
    trend: -8.3
  },
  wellnessIndex: {
    overall: 87.3,
    components: {
      emotional: 89.2,
      behavioral: 85.7,
      social: 87.9,
      cognitive: 86.1
    },
    trend: 3.2
  },
  predictiveAlerts: [
    {
      id: 1,
      type: 'capacity',
      severity: 'warning',
      title: 'Sobrecarga prevista - Miércoles tarde',
      description: 'Capacidad proyectada del 95%. Considerar redistribución.',
      confidence: 87,
      timeframe: '2 días',
      action: 'redistribute'
    },
    {
      id: 2,
      type: 'risk',
      severity: 'critical',
      title: 'Patrón de deterioro detectado',
      description: '3 pacientes muestran indicadores de empeoramiento.',
      confidence: 92,
      timeframe: 'Inmediato',
      action: 'review'
    },
    {
      id: 3,
      type: 'efficiency',
      severity: 'info',
      title: 'Oportunidad de optimización',
      description: 'Reagrupar sesiones matutinas podría mejorar eficiencia 12%.',
      confidence: 78,
      timeframe: '1 semana',
      action: 'optimize'
    }
  ],
  clinicalPerformance: [
    { metric: 'Tiempo promedio sesión', value: 52, unit: 'min', target: 50, status: 'warning' },
    { metric: 'Satisfacción paciente', value: 4.7, unit: '/5', target: 4.5, status: 'success' },
    { metric: 'Adherencia tratamiento', value: 73.2, unit: '%', target: 75, status: 'warning' },
    { metric: 'Tiempo respuesta crisis', value: 8, unit: 'min', target: 10, status: 'success' }
  ]
};

export default function ClinicalPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'capacity' | 'risk' | 'performance'>('overview');
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const { metrics, loading } = useClinicalMetrics();
  const { theme } = useStyles();

  // Funciones de utilidad mejoradas
  const getHealthColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 75) return theme.colors.warning;
    return theme.colors.error;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Tooltip personalizado mejorado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(226,232,240,0.8)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.8)'
          }}
        >
          <p className="font-bold text-slate-900 mb-3 text-sm" style={{ fontFamily: theme.fonts.heading }}>
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }} 
                  />
                  <span className="text-xs font-medium text-slate-700">{entry.name}:</span>
                </div>
                <span className="font-bold text-slate-900 ml-3 text-sm">
                  {typeof entry.value === 'number' ? `${entry.value}%` : entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const tabVariants = {
    inactive: { 
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      color: theme.colors.textSecondary,
      scale: 1
    },
    active: { 
      backgroundColor: theme.colors.primary,
      color: theme.colors.textInverse,
      scale: 1.02,
      boxShadow: theme.shadows.glow
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* CONTENEDOR PRINCIPAL ULTRA PROFESIONAL */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.9)'
        }}
      >
        {/* EFECTOS DE FONDO PROFESIONALES */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradiente sutil superior */}
          <div 
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-[0.03]"
            style={{
              background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)`
            }}
          />
          {/* Gradiente sutil inferior */}
          <div 
            className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-[0.03]"
            style={{
              background: `radial-gradient(circle, ${theme.colors.success} 0%, transparent 70%)`
            }}
          />
          {/* Líneas decorativas */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />
        </div>

        {/* HEADER ULTRA PROFESIONAL */}
        <motion.div 
          className="relative z-10 p-8 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(248,250,252,0.5)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* ICONO PRINCIPAL REDISEÑADO */}
              <motion.div 
                className="relative flex items-center justify-center overflow-hidden"
                style={{
                  width: '72px',
                  height: '72px',
                  background: 'linear-gradient(145deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 25px rgba(239,68,68,0.3), 0 0 0 1px rgba(255,255,255,0.2)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 15px 35px rgba(239,68,68,0.4), 0 0 0 1px rgba(255,255,255,0.3)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Heart className="w-9 h-9 text-white relative z-10" />
                
                {/* Efecto de brillo animado */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                    borderRadius: '20px'
                  }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Shimmer profesional */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{
                    animation: 'shimmer 2s infinite',
                    borderRadius: '20px'
                  }}
                />
              </motion.div>

              {/* INFORMACIÓN DEL PANEL MEJORADA */}
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h3 
                    className="font-bold text-3xl text-slate-900"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    Operaciones Clínicas
                  </h3>
                  
                  {/* BADGE DE ESTADO PROFESIONAL */}
                  <motion.div
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: `linear-gradient(145deg, ${getHealthColor(mockClinicalData.healthMetrics.operationalHealth)}15, ${getHealthColor(mockClinicalData.healthMetrics.operationalHealth)}08)`,
                      color: getHealthColor(mockClinicalData.healthMetrics.operationalHealth),
                      border: `1px solid ${getHealthColor(mockClinicalData.healthMetrics.operationalHealth)}30`,
                      boxShadow: `0 4px 12px ${getHealthColor(mockClinicalData.healthMetrics.operationalHealth)}20`
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Gauge className="w-4 h-4" />
                    <span>Salud: {mockClinicalData.healthMetrics.operationalHealth}%</span>
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: getHealthColor(mockClinicalData.healthMetrics.operationalHealth) }}
                    />
                  </motion.div>
                </div>
                
                <p className="text-slate-600 font-medium flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>Monitoreo inteligente de salud operativa con alertas predictivas</span>
                </p>
              </div>
            </div>
            
            {/* CONTROLES DEL HEADER PROFESIONALES */}
            <div className="flex items-center space-x-4">
              {/* MÉTRICAS RÁPIDAS MEJORADAS */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold"
                    style={{ 
                      color: theme.colors.success,
                      fontFamily: theme.fonts.heading
                    }}
                  >
                    {mockClinicalData.riskPatients.total - mockClinicalData.riskPatients.critical}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Pacientes Estables</div>
                </div>
                
                <div className="w-px h-12 bg-slate-200" />
                
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold"
                    style={{ 
                      color: theme.colors.error,
                      fontFamily: theme.fonts.heading
                    }}
                  >
                    {mockClinicalData.riskPatients.critical}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Críticos</div>
                </div>
                
                <div className="w-px h-12 bg-slate-200" />
                
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold text-blue-600"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    {mockClinicalData.adherenceStats.completed}%
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Adherencia</div>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN PROFESIONALES */}
              <div className="flex items-center space-x-2">
                <motion.button
                  className="p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>
              </div>

              {/* BOTÓN DE EXPANSIÓN MEJORADO */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="p-3 rounded-xl hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <ChevronDown className="w-6 h-6 text-slate-600" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CONTENIDO EXPANDIBLE ULTRA PROFESIONAL */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 space-y-8 border-t border-slate-200/60">
                
                {/* NAVEGACIÓN POR PESTAÑAS PROFESIONAL */}
                <motion.div 
                  className="pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div 
                    className="flex space-x-1 p-1 rounded-2xl"
                    style={{
                      background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)',
                      border: '1px solid rgba(226,232,240,0.8)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    {[
                      { id: 'overview', label: 'Vista General', icon: Eye },
                      { id: 'capacity', label: 'Capacidad', icon: BarChart3 },
                      { id: 'risk', label: 'Análisis de Riesgo', icon: AlertTriangle },
                      { id: 'performance', label: 'Rendimiento', icon: Target }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
                          style={{
                            background: isActive 
                              ? 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
                              : 'transparent',
                            color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                            boxShadow: isActive 
                              ? '0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8)'
                              : 'none',
                            border: isActive ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent'
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: isActive ? undefined : 'rgba(255,255,255,0.5)'
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* CONTENIDO DE LAS PESTAÑAS */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-8">
                        {/* MÉTRICAS PRINCIPALES ULTRA PROFESIONALES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                            {
                              title: 'Salud Operativa',
                              value: mockClinicalData.healthMetrics.operationalHealth,
                              unit: '%',
                              icon: Heart,
                              color: theme.colors.error,
                              trend: 'up',
                              change: '+2.3%'
                            },
                            {
                              title: 'Seguridad Paciente',
                              value: mockClinicalData.healthMetrics.patientSafety,
                              unit: '%',
                              icon: Shield,
                              color: theme.colors.success,
                              trend: 'up',
                              change: '+0.8%'
                            },
                            {
                              title: 'Eficiencia Clínica',
                              value: mockClinicalData.healthMetrics.clinicalEfficiency,
                              unit: '%',
                              icon: Zap,
                              color: theme.colors.warning,
                              trend: 'up',
                              change: '+1.2%'
                            },
                            {
                              title: 'Índice Bienestar',
                              value: mockClinicalData.wellnessIndex.overall,
                              unit: '%',
                              icon: Brain,
                              color: theme.colors.info,
                              trend: 'up',
                              change: '+3.2%'
                            }
                          ].map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                              <motion.div
                                key={metric.title}
                                className="relative overflow-hidden group cursor-pointer"
                                style={{
                                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                  borderRadius: '20px',
                                  border: '1px solid rgba(226,232,240,0.8)',
                                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8)',
                                  padding: '24px'
                                }}
                                whileHover={{ 
                                  scale: 1.02,
                                  y: -4,
                                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.9)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {/* Efecto de hover sutil */}
                                <div 
                                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-20"
                                  style={{
                                    background: `linear-gradient(145deg, ${metric.color} 0%, transparent 100%)`
                                  }}
                                />
                                
                                <div className="relative z-10 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div 
                                      className="p-3 rounded-2xl"
                                      style={{
                                        background: `linear-gradient(145deg, ${metric.color}15, ${metric.color}08)`,
                                        border: `1px solid ${metric.color}25`,
                                        boxShadow: `0 4px 12px ${metric.color}20`
                                      }}
                                    >
                                      <Icon className="w-6 h-6" style={{ color: metric.color }} />
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      {metric.trend === 'up' ? (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                      )}
                                      <span className="text-xs font-semibold text-green-600">
                                        {metric.change}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div 
                                      className="text-3xl font-bold"
                                      style={{ 
                                        color: metric.color,
                                        fontFamily: theme.fonts.heading
                                      }}
                                    >
                                      {metric.value}{metric.unit}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-700">
                                      {metric.title}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      vs. mes anterior
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* ALERTAS PREDICTIVAS ULTRA PROFESIONALES */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="p-3 rounded-2xl"
                                style={{
                                  background: `linear-gradient(145deg, ${theme.colors.warning}15, ${theme.colors.warning}08)`,
                                  border: `1px solid ${theme.colors.warning}25`,
                                  boxShadow: `0 4px 12px ${theme.colors.warning}20`
                                }}
                              >
                                <Sparkles className="w-6 h-6" style={{ color: theme.colors.warning }} />
                              </div>
                              <div>
                                <h4 
                                  className="font-bold text-xl text-slate-900"
                                  style={{ fontFamily: theme.fonts.heading }}
                                >
                                  Alertas Predictivas IA
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Análisis en tiempo real con machine learning
                                </p>
                              </div>
                            </div>
                            
                            <motion.button
                              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm"
                              style={{
                                background: `linear-gradient(145deg, ${theme.colors.primary}10, ${theme.colors.primary}05)`,
                                color: theme.colors.primary,
                                border: `1px solid ${theme.colors.primary}20`
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Filter className="w-4 h-4" />
                              <span>Filtrar</span>
                            </motion.button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mockClinicalData.predictiveAlerts.map((alert, index) => (
                              <motion.div
                                key={alert.id}
                                className="relative overflow-hidden group cursor-pointer"
                                style={{
                                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                  borderRadius: '20px',
                                  border: `1px solid ${getSeverityColor(alert.severity)}30`,
                                  boxShadow: `0 4px 6px -1px ${getSeverityColor(alert.severity)}10, 0 0 0 1px rgba(255,255,255,0.8)`,
                                  padding: '24px'
                                }}
                                whileHover={{ 
                                  scale: 1.02,
                                  y: -2,
                                  boxShadow: `0 12px 24px ${getSeverityColor(alert.severity)}20, 0 0 0 1px rgba(255,255,255,0.9)`
                                }}
                                onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {/* Indicador de severidad mejorado */}
                                <div 
                                  className="absolute top-0 left-0 w-full h-1 rounded-t-20"
                                  style={{ 
                                    background: `linear-gradient(90deg, ${getSeverityColor(alert.severity)} 0%, ${getSeverityColor(alert.severity)}80 100%)`
                                  }}
                                />
                                
                                <div className="space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div 
                                      className="p-3 rounded-2xl"
                                      style={{
                                        background: `linear-gradient(145deg, ${getSeverityColor(alert.severity)}15, ${getSeverityColor(alert.severity)}08)`,
                                        border: `1px solid ${getSeverityColor(alert.severity)}25`
                                      }}
                                    >
                                      <AlertTriangle 
                                        className="w-5 h-5" 
                                        style={{ color: getSeverityColor(alert.severity) }}
                                      />
                                    </div>
                                    
                                    <div className="text-right">
                                      <div 
                                        className="text-xs font-bold px-3 py-1 rounded-full"
                                        style={{
                                          background: `linear-gradient(145deg, ${getSeverityColor(alert.severity)}20, ${getSeverityColor(alert.severity)}10)`,
                                          color: getSeverityColor(alert.severity),
                                          border: `1px solid ${getSeverityColor(alert.severity)}30`
                                        }}
                                      >
                                        {alert.confidence}% confianza
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h5 className="font-bold text-slate-900 text-sm">
                                      {alert.title}
                                    </h5>
                                    <p className="text-xs leading-relaxed text-slate-600">
                                      {alert.description}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500">
                                      {alert.timeframe}
                                    </span>
                                    
                                    <ArrowRight 
                                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                      style={{ color: getSeverityColor(alert.severity) }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {activeTab === 'capacity' && (
                      <div className="space-y-8">
                        {/* Pronóstico de capacidad */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="p-3 rounded-2xl"
                                style={{
                                  background: `linear-gradient(145deg, ${theme.colors.info}15, ${theme.colors.info}08)`,
                                  border: `1px solid ${theme.colors.info}25`,
                                  boxShadow: `0 4px 12px ${theme.colors.info}20`
                                }}
                              >
                                <Calendar className="w-6 h-6" style={{ color: theme.colors.info }} />
                              </div>
                              <div>
                                <h4 
                                  className="font-bold text-xl text-slate-900"
                                  style={{ fontFamily: theme.fonts.heading }}
                                >
                                  Pronóstico de Capacidad
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Análisis predictivo para los próximos 7 días
                                </p>
                              </div>
                            </div>
                            
                            <motion.button
                              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm"
                              style={{
                                background: `linear-gradient(145deg, ${theme.colors.primary}10, ${theme.colors.primary}05)`,
                                color: theme.colors.primary,
                                border: `1px solid ${theme.colors.primary}20`
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Plus className="w-4 h-4" />
                              <span>Optimizar Horarios</span>
                            </motion.button>
                          </div>

                          <div 
                            className="p-8 rounded-2xl"
                            style={{
                              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                              border: '1px solid rgba(226,232,240,0.8)',
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8)',
                              height: '400px'
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={mockClinicalData.capacityForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                                <XAxis 
                                  dataKey="day" 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                />
                                <YAxis 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                  dataKey="morning" 
                                  fill={theme.colors.success} 
                                  name="Mañana" 
                                  radius={[6, 6, 0, 0]}
                                  opacity={0.9}
                                />
                                <Bar 
                                  dataKey="afternoon" 
                                  fill={theme.colors.warning} 
                                  name="Tarde" 
                                  radius={[6, 6, 0, 0]}
                                  opacity={0.9}
                                />
                                <Bar 
                                  dataKey="evening" 
                                  fill={theme.colors.info} 
                                  name="Noche" 
                                  radius={[6, 6, 0, 0]}
                                  opacity={0.9}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {activeTab === 'risk' && (
                      <div className="space-y-8">
                        {/* Radar de factores de riesgo */}
                        <motion.div variants={itemVariants}>
                          <div className="flex items-center space-x-3 mb-6">
                            <div 
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${theme.colors.error}15`,
                                border: `1px solid ${theme.colors.error}25`
                              }}
                            >
                              <AlertTriangle className="w-5 h-5" style={{ color: theme.colors.error }} />
                            </div>
                            <h4 
                              className="font-bold text-xl"
                              style={{ 
                                color: theme.colors.textPrimary,
                                fontFamily: theme.fonts.heading
                              }}
                            >
                              Análisis de Factores de Riesgo
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Radar Chart */}
                            <div 
                              className="h-80 p-6 rounded-2xl"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={mockClinicalData.riskRadar}>
                                  <PolarGrid stroke="rgba(0,0,0,0.1)" />
                                  <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fontSize: 11, fill: theme.colors.textSecondary, fontWeight: 500 }}
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

                            {/* Lista de factores de riesgo */}
                            <div className="space-y-4">
                              {mockClinicalData.riskRadar.map((factor, index) => (
                                <motion.div
                                  key={factor.subject}
                                  className="p-4 rounded-xl"
                                  style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                                    border: `1px solid ${factor.color}30`
                                  }}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span 
                                      className="font-semibold text-sm"
                                      style={{ color: theme.colors.textPrimary }}
                                    >
                                      {factor.subject}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span 
                                        className="text-sm font-bold"
                                        style={{ color: factor.color }}
                                      >
                                        {factor.value}
                                      </span>
                                      <div 
                                        className="px-2 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                          backgroundColor: `${factor.color}20`,
                                          color: factor.color
                                        }}
                                      >
                                        {factor.priority}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div 
                                      className="h-2 rounded-full"
                                      style={{ backgroundColor: factor.color }}
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: `${(factor.value / factor.max) * 100}%` 
                                      }}
                                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {activeTab === 'performance' && (
                      <div className="space-y-8">
                        {/* Métricas de rendimiento clínico */}
                        <motion.div variants={itemVariants}>
                          <div className="flex items-center space-x-3 mb-6">
                            <div 
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${theme.colors.success}15`,
                                border: `1px solid ${theme.colors.success}25`
                              }}
                            >
                              <Target className="w-5 h-5" style={{ color: theme.colors.success }} />
                            </div>
                            <h4 
                              className="font-bold text-xl"
                              style={{ 
                                color: theme.colors.textPrimary,
                                fontFamily: theme.fonts.heading
                              }}
                            >
                              Métricas de Rendimiento Clínico
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mockClinicalData.clinicalPerformance.map((metric, index) => (
                              <motion.div
                                key={metric.metric}
                                className="p-6 rounded-2xl"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  backdropFilter: 'blur(10px)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <div 
                                      className="p-2 rounded-lg"
                                      style={{
                                        backgroundColor: `${theme.colors[metric.status as keyof typeof theme.colors] || theme.colors.textSecondary}15`
                                      }}
                                    >
                                      {getStatusIcon(metric.status)}
                                    </div>
                                    <span 
                                      className="font-semibold text-sm"
                                      style={{ color: theme.colors.textPrimary }}
                                    >
                                      {metric.metric}
                                    </span>
                                  </div>
                                  
                                  <div 
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                      backgroundColor: `${theme.colors[metric.status as keyof typeof theme.colors] || theme.colors.textSecondary}20`,
                                      color: theme.colors[metric.status as keyof typeof theme.colors] || theme.colors.textSecondary
                                    }}
                                  >
                                    {metric.status}
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex items-baseline justify-between">
                                    <span 
                                      className="text-2xl font-bold"
                                      style={{ 
                                        color: theme.colors[metric.status as keyof typeof theme.colors] || theme.colors.textPrimary,
                                        fontFamily: theme.fonts.heading
                                      }}
                                    >
                                      {metric.value}{metric.unit}
                                    </span>
                                    <span 
                                      className="text-sm"
                                      style={{ color: theme.colors.textSecondary }}
                                    >
                                      Meta: {metric.target}{metric.unit}
                                    </span>
                                  </div>
                                  
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div 
                                      className="h-2 rounded-full"
                                      style={{ 
                                        backgroundColor: theme.colors[metric.status as keyof typeof theme.colors] || theme.colors.textSecondary
                                      }}
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                                      }}
                                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Adherencia al tratamiento */}
                        <motion.div variants={itemVariants}>
                          <div className="flex items-center space-x-3 mb-6">
                            <div 
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${theme.colors.info}15`,
                                border: `1px solid ${theme.colors.info}25`
                              }}
                            >
                              <Activity className="w-5 h-5" style={{ color: theme.colors.info }} />
                            </div>
                            <h4 
                              className="font-bold text-xl"
                              style={{ 
                                color: theme.colors.textPrimary,
                                fontFamily: theme.fonts.heading
                              }}
                            >
                              Adherencia al Tratamiento
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              {
                                label: 'Completadas',
                                value: mockClinicalData.adherenceStats.completed,
                                trend: mockClinicalData.adherenceStats.trends.completed,
                                color: theme.colors.success
                              },
                              {
                                label: 'Pendientes',
                                value: mockClinicalData.adherenceStats.pending,
                                trend: mockClinicalData.adherenceStats.trends.pending,
                                color: theme.colors.warning
                              },
                              {
                                label: 'Canceladas',
                                value: mockClinicalData.adherenceStats.cancelled,
                                trend: mockClinicalData.adherenceStats.trends.cancelled,
                                color: theme.colors.error
                              }
                            ].map((stat, index) => (
                              <motion.div 
                                key={stat.label}
                                className="p-6 rounded-2xl text-center"
                                style={{
                                  background: `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}05 100%)`,
                                  border: `1px solid ${stat.color}30`
                                }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div 
                                  className="text-3xl font-bold mb-2"
                                  style={{ 
                                    color: stat.color,
                                    fontFamily: theme.fonts.heading
                                  }}
                                >
                                  {stat.value}%
                                </div>
                                <div 
                                  className="text-sm font-medium mb-3"
                                  style={{ color: theme.colors.textPrimary }}
                                >
                                  {stat.label}
                                </div>
                                
                                <div className="flex items-center justify-center space-x-1">
                                  {stat.trend > 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                  )}
                                  <span 
                                    className="text-xs font-semibold"
                                    style={{ 
                                      color: stat.trend > 0 ? theme.colors.success : theme.colors.error
                                    }}
                                  >
                                    {Math.abs(stat.trend)}%
                                  </span>
                                </div>
                                
                                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                  <motion.div 
                                    className="h-2 rounded-full"
                                    style={{ backgroundColor: stat.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.value}%` }}
                                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* RECOMENDACIÓN IA ULTRA PROFESIONAL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${theme.colors.primary}08 0%, ${theme.colors.primary}04 100%)`,
                    borderRadius: '20px',
                    border: `1px solid ${theme.colors.primary}20`,
                    padding: '24px'
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className="p-4 rounded-2xl"
                      style={{
                        background: `linear-gradient(145deg, ${theme.colors.primary}20, ${theme.colors.primary}10)`,
                        border: `1px solid ${theme.colors.primary}30`
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${theme.colors.primary}40`,
                          `0 0 0 8px ${theme.colors.primary}00`,
                          `0 0 0 0 ${theme.colors.primary}40`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-7 h-7" style={{ color: theme.colors.primary }} />
                    </motion.div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h5 
                          className="font-bold text-xl text-slate-900 mb-2"
                          style={{ fontFamily: theme.fonts.heading }}
                        >
                          Recomendación del Sistema IA
                        </h5>
                        <p className="text-sm leading-relaxed text-slate-600">
                          Basado en el análisis predictivo, se recomienda implementar recordatorios automáticos 
                          vía WhatsApp para reducir cancelaciones en un 23%. Considerar sesiones de seguimiento 
                          telefónico para pacientes con baja adherencia. 
                          <span className="font-semibold text-slate-900"> Proyección de mejora: +15% en adherencia general.</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <motion.button
                          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm"
                          style={{
                            background: theme.gradients.primary,
                            color: theme.colors.textInverse,
                            boxShadow: `0 4px 12px ${theme.colors.primary}30`
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: `0 8px 20px ${theme.colors.primary}40`
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Zap className="w-4 h-4" />
                          <span>Implementar Sugerencias</span>
                        </motion.button>
                        
                        <motion.button
                          className="px-4 py-3 rounded-xl font-medium text-sm border"
                          style={{
                            backgroundColor: 'transparent',
                            color: theme.colors.primary,
                            borderColor: `${theme.colors.primary}30`
                          }}
                          whileHover={{ 
                            backgroundColor: `${theme.colors.primary}10`,
                            borderColor: theme.colors.primary
                          }}
                        >
                          Ver Análisis Completo
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ESTILOS CSS PROFESIONALES */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .rounded-20 {
          border-radius: 20px;
        }
      `}</style>
    </motion.div>
  );
}