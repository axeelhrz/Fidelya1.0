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
  Radio
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

// Datos mock mejorados y expandidos
const mockClinicalData = {
  // Métricas principales de salud operativa
  healthMetrics: {
    operationalHealth: 94.2,
    patientSafety: 98.7,
    clinicalEfficiency: 87.3,
    riskLevel: 'low',
    trend: 'up'
  },

  // Radar de factores de riesgo con más detalle
  riskRadar: [
    { subject: 'PHQ-9 Crítico', value: 12, max: 25, color: '#EF4444', priority: 'high' },
    { subject: 'GAD-7 Elevado', value: 8, max: 25, color: '#F59E0B', priority: 'medium' },
    { subject: 'Sin Progreso', value: 15, max: 25, color: '#EF4444', priority: 'high' },
    { subject: 'Ausentismo', value: 6, max: 25, color: '#10B981', priority: 'low' },
    { subject: 'Medicación', value: 9, max: 25, color: '#F59E0B', priority: 'medium' },
    { subject: 'Crisis Recientes', value: 4, max: 25, color: '#EF4444', priority: 'high' },
  ],

  // Pronóstico de capacidad con predicción IA
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

  // Estadísticas de adherencia mejoradas
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

  // Pacientes en riesgo con categorización
  riskPatients: {
    critical: 12,
    high: 23,
    medium: 19,
    total: 54,
    trend: -8.3
  },

  // Índice de bienestar con componentes
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

  // Alertas predictivas
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

  // Métricas de rendimiento clínico
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

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 95) return theme.colors.error;
    if (percentage >= 85) return theme.colors.warning;
    return theme.colors.success;
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
          className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-gray-200/50"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <p className="font-bold text-gray-900 mb-2 font-space-grotesk">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between min-w-[120px]">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }} 
                  />
                  <span className="text-sm font-medium text-gray-700">{entry.name}:</span>
                </div>
                <span className="font-bold text-gray-900 ml-3">
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
      {/* Contenedor principal con diseño futurista */}
      <div 
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.05)'
        }}
      >
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)`
            }}
          />
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${theme.colors.success} 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Header mejorado */}
        <motion.div 
          className="relative z-10 flex items-center justify-between p-8 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-6">
            {/* Icono principal con animación */}
            <motion.div 
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.error} 0%, ${theme.colors.errorDark} 100%)`,
                boxShadow: `0 8px 32px ${theme.colors.error}40`
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                boxShadow: `0 12px 40px ${theme.colors.error}60`
              }}
              transition={{ duration: 0.4 }}
            >
              <Heart className="w-8 h-8 text-white relative z-10" />
              
              {/* Efecto de pulso */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.errorLight} 0%, ${theme.colors.error} 100%)`
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                style={{
                  animation: 'shimmer 3s infinite'
                }}
              />
            </motion.div>

            {/* Información del panel */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h3 
                  className="font-bold text-2xl"
                  style={{ 
                    color: theme.colors.textPrimary,
                    fontFamily: theme.fonts.heading
                  }}
                >
                  Operaciones Clínicas
                </h3>
                
                {/* Badge de estado */}
                <motion.div
                  className="px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"
                  style={{
                    backgroundColor: `${getHealthColor(mockClinicalData.healthMetrics.operationalHealth)}20`,
                    color: getHealthColor(mockClinicalData.healthMetrics.operationalHealth),
                    border: `1px solid ${getHealthColor(mockClinicalData.healthMetrics.operationalHealth)}30`
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Radio className="w-3 h-3" />
                  <span>Salud Operativa: {mockClinicalData.healthMetrics.operationalHealth}%</span>
                </motion.div>
              </div>
              
              <p 
                className="text-sm font-medium flex items-center space-x-2"
                style={{ color: theme.colors.textSecondary }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Monitoreo inteligente de salud operativa con alertas predictivas</span>
              </p>
            </div>
          </div>
          
          {/* Controles del header */}
          <div className="flex items-center space-x-4">
            {/* Indicadores rápidos */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div 
                  className="text-lg font-bold"
                  style={{ 
                    color: theme.colors.success,
                    fontFamily: theme.fonts.heading
                  }}
                >
                  {mockClinicalData.riskPatients.total - mockClinicalData.riskPatients.critical}
                </div>
                <div className="text-xs text-gray-500">Estables</div>
              </div>
              
              <div className="w-px h-8 bg-gray-200" />
              
              <div className="text-center">
                <div 
                  className="text-lg font-bold"
                  style={{ 
                    color: theme.colors.error,
                    fontFamily: theme.fonts.heading
                  }}
                >
                  {mockClinicalData.riskPatients.critical}
                </div>
                <div className="text-xs text-gray-500">Críticos</div>
              </div>
            </div>

            {/* Botón de expansión */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              className="p-3 rounded-xl hover:bg-white/50 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300"
            >
              <ChevronDown className="w-6 h-6" style={{ color: theme.colors.textSecondary }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Contenido expandible */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 space-y-8 border-t border-gray-200/50">
                
                {/* Navegación por pestañas */}
                <motion.div 
                  className="pt-6"
                  variants={itemVariants}
                >
                  <div className="flex space-x-2 p-2 bg-gray-100/50 rounded-2xl backdrop-blur-sm">
                    {[
                      { id: 'overview', label: 'Vista General', icon: Eye },
                      { id: 'capacity', label: 'Capacidad', icon: BarChart3 },
                      { id: 'risk', label: 'Análisis de Riesgo', icon: AlertTriangle },
                      { id: 'performance', label: 'Rendimiento', icon: Target }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300"
                          variants={tabVariants}
                          animate={activeTab === tab.id ? 'active' : 'inactive'}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Contenido de las pestañas */}
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
                        {/* Métricas principales de salud */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          {[
                            {
                              title: 'Salud Operativa',
                              value: mockClinicalData.healthMetrics.operationalHealth,
                              unit: '%',
                              icon: Heart,
                              color: theme.colors.error,
                              trend: mockClinicalData.healthMetrics.trend
                            },
                            {
                              title: 'Seguridad Paciente',
                              value: mockClinicalData.healthMetrics.patientSafety,
                              unit: '%',
                              icon: Shield,
                              color: theme.colors.success,
                              trend: 'up'
                            },
                            {
                              title: 'Eficiencia Clínica',
                              value: mockClinicalData.healthMetrics.clinicalEfficiency,
                              unit: '%',
                              icon: Zap,
                              color: theme.colors.warning,
                              trend: 'up'
                            },
                            {
                              title: 'Índice Bienestar',
                              value: mockClinicalData.wellnessIndex.overall,
                              unit: '%',
                              icon: Brain,
                              color: theme.colors.info,
                              trend: 'up'
                            }
                          ].map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                              <motion.div
                                key={metric.title}
                                className="relative p-6 rounded-2xl overflow-hidden group cursor-pointer"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  backdropFilter: 'blur(10px)'
                                }}
                                whileHover={{ 
                                  scale: 1.02,
                                  y: -4,
                                  boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {/* Fondo gradiente animado */}
                                <div 
                                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                  style={{
                                    background: `linear-gradient(135deg, ${metric.color} 0%, transparent 100%)`
                                  }}
                                />
                                
                                <div className="relative z-10">
                                  <div className="flex items-center justify-between mb-4">
                                    <div 
                                      className="p-3 rounded-xl"
                                      style={{
                                        backgroundColor: `${metric.color}15`,
                                        border: `1px solid ${metric.color}25`
                                      }}
                                    >
                                      <Icon className="w-5 h-5" style={{ color: metric.color }} />
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      {metric.trend === 'up' ? (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                      )}
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
                                    <div 
                                      className="text-sm font-medium"
                                      style={{ color: theme.colors.textSecondary }}
                                    >
                                      {metric.title}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Alertas predictivas */}
                        <motion.div variants={itemVariants}>
                          <div className="flex items-center space-x-3 mb-6">
                            <div 
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${theme.colors.warning}15`,
                                border: `1px solid ${theme.colors.warning}25`
                              }}
                            >
                              <Sparkles className="w-5 h-5" style={{ color: theme.colors.warning }} />
                            </div>
                            <h4 
                              className="font-bold text-xl"
                              style={{ 
                                color: theme.colors.textPrimary,
                                fontFamily: theme.fonts.heading
                              }}
                            >
                              Alertas Predictivas IA
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {mockClinicalData.predictiveAlerts.map((alert, index) => (
                              <motion.div
                                key={alert.id}
                                className="p-5 rounded-2xl cursor-pointer relative overflow-hidden group"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                  border: `1px solid ${getSeverityColor(alert.severity)}30`,
                                  backdropFilter: 'blur(10px)'
                                }}
                                whileHover={{ 
                                  scale: 1.02,
                                  y: -2,
                                  boxShadow: `0 12px 24px ${getSeverityColor(alert.severity)}20`
                                }}
                                onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {/* Indicador de severidad */}
                                <div 
                                  className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                                />
                                
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div 
                                      className="p-2 rounded-lg"
                                      style={{
                                        backgroundColor: `${getSeverityColor(alert.severity)}15`
                                      }}
                                    >
                                      <AlertTriangle 
                                        className="w-4 h-4" 
                                        style={{ color: getSeverityColor(alert.severity) }}
                                      />
                                    </div>
                                    
                                    <div className="text-right">
                                      <div 
                                        className="text-xs font-semibold px-2 py-1 rounded-full"
                                        style={{
                                          backgroundColor: `${getSeverityColor(alert.severity)}20`,
                                          color: getSeverityColor(alert.severity)
                                        }}
                                      >
                                        {alert.confidence}% confianza
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 
                                      className="font-semibold text-sm mb-1"
                                      style={{ color: theme.colors.textPrimary }}
                                    >
                                      {alert.title}
                                    </h5>
                                    <p 
                                      className="text-xs leading-relaxed"
                                      style={{ color: theme.colors.textSecondary }}
                                    >
                                      {alert.description}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span 
                                      className="text-xs font-medium"
                                      style={{ color: theme.colors.textTertiary }}
                                    >
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
                        <motion.div variants={itemVariants}>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{
                                  backgroundColor: `${theme.colors.info}15`,
                                  border: `1px solid ${theme.colors.info}25`
                                }}
                              >
                                <Calendar className="w-5 h-5" style={{ color: theme.colors.info }} />
                              </div>
                              <h4 
                                className="font-bold text-xl"
                                style={{ 
                                  color: theme.colors.textPrimary,
                                  fontFamily: theme.fonts.heading
                                }}
                              >
                                Pronóstico de Capacidad - Próximos 7 días
                              </h4>
                            </div>
                            
                            <motion.button
                              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm"
                              style={{
                                backgroundColor: `${theme.colors.primary}10`,
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
                            className="h-80 p-6 rounded-2xl"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                              border: '1px solid rgba(255,255,255,0.3)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={mockClinicalData.capacityForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                <XAxis 
                                  dataKey="day" 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 12, fill: theme.colors.textSecondary, fontWeight: 500 }}
                                />
                                <YAxis 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 12, fill: theme.colors.textSecondary, fontWeight: 500 }}
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                  dataKey="morning" 
                                  fill={theme.colors.success} 
                                  name="Mañana" 
                                  radius={[4, 4, 0, 0]}
                                  opacity={0.8}
                                />
                                <Bar 
                                  dataKey="afternoon" 
                                  fill={theme.colors.warning} 
                                  name="Tarde" 
                                  radius={[4, 4, 0, 0]}
                                  opacity={0.8}
                                />
                                <Bar 
                                  dataKey="evening" 
                                  fill={theme.colors.info} 
                                  name="Noche" 
                                  radius={[4, 4, 0, 0]}
                                  opacity={0.8}
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
                                      animate={{ width: `${(factor.value / factor.max) * 100}%` }}
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

                {/* Recomendación IA al final */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 p-6 rounded-2xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.primary}04 100%)`,
                    border: `1px solid ${theme.colors.primary}20`
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: `${theme.colors.primary}20`
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${theme.colors.primary}40`,
                          `0 0 0 10px ${theme.colors.primary}00`,
                          `0 0 0 0 ${theme.colors.primary}40`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-6 h-6" style={{ color: theme.colors.primary }} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h5 
                        className="font-bold text-lg mb-2"
                        style={{ 
                          color: theme.colors.textPrimary,
                          fontFamily: theme.fonts.heading
                        }}
                      >
                        Recomendación del Sistema IA
                      </h5>
                      <p 
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Basado en el análisis predictivo, se recomienda implementar recordatorios automáticos 
                        vía WhatsApp para reducir cancelaciones en un 23%. Considerar sesiones de seguimiento 
                        telefónico para pacientes con baja adherencia. Proyección de mejora: +15% en adherencia general.
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        <motion.button
                          className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2"
                          style={{
                            background: theme.gradients.primary,
                            color: theme.colors.textInverse,
                            boxShadow: theme.shadows.glow
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: theme.shadows.glowStrong
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
                          Ver Detalles
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

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </motion.div>
  );
}