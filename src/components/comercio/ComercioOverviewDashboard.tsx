'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  TrendingUp, 
  TrendingDown, 
  Store, 
  Gift, 
  QrCode, 
  Receipt, 
  Bell,
  Calendar,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  BarChart3,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  Star,
  Heart
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface ComercioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
}

interface ActivityLog {
  id: string;
  type: 'validation_completed' | 'benefit_redeemed' | 'profile_updated' | 'qr_generated' | 'system_alert' | 'notification_received';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface ComercioMetrics {
  totalValidaciones: number;
  validacionesHoy: number;
  validacionesSemana: number;
  validacionesMes: number;
  beneficiosActivos: number;
  beneficiosCanjeados: number;
  crecimientoSemanal: number;
  crecimientoMensual: number;
  recentActivities: ActivityLog[];
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastActivity: Date | null;
  avgValidacionesDiarias: number;
}

// Modern KPI Card Component
const ModernKPICard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  loading?: boolean;
}> = ({ title, value, change, icon, color, gradient, delay, subtitle, trend = 'neutral', onClick, loading = false }) => {
  
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-500';
    return 'text-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ background: gradient }}
        />
        
        {/* Glow Effect */}
        <div 
          className="absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
          style={{ background: gradient }}
        />
        
        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div 
              className="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ background: `${color}15` }}
            >
              <div style={{ color }} className="w-6 h-6">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  icon
                )}
              </div>
            </div>
            
            {/* Trend Indicator */}
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-bold">
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          </div>
          
          {/* Value */}
          <div className="mb-2">
            <h3 className="text-3xl font-black text-slate-800 group-hover:text-slate-900 transition-colors">
              {loading ? '...' : value}
            </h3>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {title}
            </p>
          </div>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
          
          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: gradient }}
              initial={{ width: 0 }}
              animate={{ width: loading ? '0%' : `${Math.min(Math.abs(change) * 2, 100)}%` }}
              transition={{ duration: 1, delay: delay + 0.5 }}
            />
          </div>
        </div>
        
        {/* Click Indicator */}
        {onClick && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Modern Activity Feed Component
const ModernActivityFeed: React.FC<{
  activities: ActivityLog[];
  loading: boolean;
  onViewAll?: () => void;
}> = ({ activities, loading, onViewAll }) => {
  
  const getActivityIcon = (type: ActivityLog['type']) => {
    const icons = {
      validation_completed: <QrCode className="w-4 h-4" />,
      benefit_redeemed: <Gift className="w-4 h-4" />,
      profile_updated: <Store className="w-4 h-4" />,
      qr_generated: <QrCode className="w-4 h-4" />,
      system_alert: <AlertCircle className="w-4 h-4" />,
      notification_received: <Bell className="w-4 h-4" />,
    };
    return icons[type] || <Activity className="w-4 h-4" />;
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    const colors = {
      validation_completed: 'from-emerald-500 to-teal-500',
      benefit_redeemed: 'from-amber-500 to-orange-500',
      profile_updated: 'from-blue-500 to-indigo-500',
      qr_generated: 'from-purple-500 to-pink-500',
      system_alert: 'from-red-500 to-rose-500',
      notification_received: 'from-cyan-500 to-blue-500',
    };
    return colors[type] || 'from-slate-500 to-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Actividad Reciente</h3>
              <p className="text-sm text-slate-500">Últimas acciones del comercio</p>
            </div>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200"
            >
              <span className="text-sm font-medium text-slate-700">Ver todo</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                <div className={`p-2 rounded-xl bg-gradient-to-r ${getActivityColor(activity.type)} shadow-lg`}>
                  <div className="text-white">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {format(activity.timestamp.toDate(), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                </div>
              </motion.div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No hay actividad reciente</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Modern Health Status Component
const ModernHealthStatus: React.FC<{
  health: ComercioMetrics['systemHealth'];
  lastActivity: Date | null;
  avgValidaciones: number;
  loading: boolean;
}> = ({ health, lastActivity, avgValidaciones, loading }) => {
  
  const getHealthConfig = () => {
    const configs = {
      excellent: {
        color: 'from-emerald-500 to-teal-500',
        icon: <CheckCircle className="w-6 h-6" />,
        label: 'Excelente',
        bgColor: 'from-emerald-50 to-teal-50',
        textColor: 'text-emerald-700'
      },
      good: {
        color: 'from-blue-500 to-indigo-500',
        icon: <Zap className="w-6 h-6" />,
        label: 'Bueno',
        bgColor: 'from-blue-50 to-indigo-50',
        textColor: 'text-blue-700'
      },
      warning: {
        color: 'from-amber-500 to-orange-500',
        icon: <AlertCircle className="w-6 h-6" />,
        label: 'Atención',
        bgColor: 'from-amber-50 to-orange-50',
        textColor: 'text-amber-700'
      },
      critical: {
        color: 'from-red-500 to-rose-500',
        icon: <AlertCircle className="w-6 h-6" />,
        label: 'Crítico',
        bgColor: 'from-red-50 to-rose-50',
        textColor: 'text-red-700'
      }
    };
    return configs[health];
  };

  const config = getHealthConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${config.bgColor}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-gradient-to-r ${config.color} rounded-xl shadow-lg`}>
            <div className="text-white">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                config.icon
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Estado del Comercio</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${config.textColor} bg-white/50`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Last Activity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Última actividad</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">
              {loading ? '...' : lastActivity ? format(lastActivity, 'dd/MM HH:mm') : 'Sin actividad'}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <div 
                className={`w-2 h-2 rounded-full ${
                  lastActivity && (Date.now() - lastActivity.getTime()) < 24 * 60 * 60 * 1000 
                    ? 'bg-emerald-500' 
                    : 'bg-amber-500'
                }`}
              />
              <span className="text-xs text-slate-500">
                {lastActivity && (Date.now() - lastActivity.getTime()) < 24 * 60 * 60 * 1000 
                  ? 'Activo hoy' 
                  : 'Inactivo'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Average Validations */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Promedio diario</span>
            </div>
            <span className="text-sm font-bold text-slate-800">
              {loading ? '...' : `${avgValidaciones.toFixed(1)} validaciones`}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                avgValidaciones > 5 
                  ? 'from-emerald-500 to-teal-500' 
                  : avgValidaciones > 2 
                    ? 'from-amber-500 to-orange-500' 
                    : 'from-red-500 to-rose-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: loading ? '0%' : `${Math.min((avgValidaciones / 10) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <p className="text-xs text-slate-500 mt-2">
            {loading ? '...' : avgValidaciones > 5 ? 'Excelente rendimiento' : avgValidaciones > 2 ? 'Buen rendimiento' : 'Puede mejorar'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const ComercioOverviewDashboard: React.FC<ComercioOverviewDashboardProps> = ({
  onNavigate
}) => {
  const { user } = useAuth();
  const { comercio } = useComercios();
  const { activeBeneficios, loading: beneficiosLoading } = useBeneficios();
  const { validaciones, getStats, loading: validacionesLoading } = useValidaciones();
  const { stats: notificationStats } = useNotifications();
  
  const [comercioMetrics, setComercioMetrics] = useState<ComercioMetrics>({
    totalValidaciones: 0,
    validacionesHoy: 0,
    validacionesSemana: 0,
    validacionesMes: 0,
    beneficiosActivos: 0,
    beneficiosCanjeados: 0,
    crecimientoSemanal: 0,
    crecimientoMensual: 0,
    recentActivities: [],
    systemHealth: 'good',
    lastActivity: null,
    avgValidacionesDiarias: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = getStats();

  // Calculate metrics from validaciones
  const calculateMetrics = useCallback(() => {
    if (!user || validacionesLoading || beneficiosLoading) {
      return null;
    }

    try {
      const now = new Date();
      const today = startOfDay(now);
      const weekAgo = subDays(now, 7);
      const monthAgo = subDays(now, 30);

      // Filter validaciones by time periods
      const validacionesHoy = validaciones.filter(v => 
        v.fechaHora.toDate() >= today
      ).length;

      const validacionesSemana = validaciones.filter(v => 
        v.fechaHora.toDate() >= weekAgo
      ).length;

      const validacionesMes = validaciones.filter(v => 
        v.fechaHora.toDate() >= monthAgo
      ).length;

      const validacionesSemanaAnterior = validaciones.filter(v => {
        const date = v.fechaHora.toDate();
        return date >= subDays(weekAgo, 7) && date < weekAgo;
      }).length;

      const validacionesMesAnterior = validaciones.filter(v => {
        const date = v.fechaHora.toDate();
        return date >= subDays(monthAgo, 30) && date < monthAgo;
      }).length;

      // Calculate growth rates
      const crecimientoSemanal = validacionesSemanaAnterior > 0 
        ? ((validacionesSemana - validacionesSemanaAnterior) / validacionesSemanaAnterior) * 100
        : validacionesSemana > 0 ? 100 : 0;

      const crecimientoMensual = validacionesMesAnterior > 0
        ? ((validacionesMes - validacionesMesAnterior) / validacionesMesAnterior) * 100
        : validacionesMes > 0 ? 100 : 0;

      // Calculate average daily validations
      const avgValidacionesDiarias = validacionesMes / 30;

      // Determine system health
      let systemHealth: ComercioMetrics['systemHealth'] = 'good';
      if (avgValidacionesDiarias > 5) systemHealth = 'excellent';
      else if (avgValidacionesDiarias > 2) systemHealth = 'good';
      else if (avgValidacionesDiarias > 0) systemHealth = 'warning';
      else systemHealth = 'critical';

      // Get last activity
      const lastActivity = validaciones.length > 0 
        ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0].fechaHora.toDate()
        : null;

      // Create sample activities
      const recentActivities: ActivityLog[] = validaciones
        .slice(0, 5)
        .map((v, index) => ({
          id: v.id || `activity-${index}`,
          type: 'validation_completed' as const,
          title: 'Validación completada',
          description: `Beneficio canjeado por socio`,
          timestamp: v.fechaHora,
          metadata: { validacionId: v.id },
        }));

      return {
        totalValidaciones: stats.totalValidaciones,
        validacionesHoy,
        validacionesSemana,
        validacionesMes,
        beneficiosActivos: activeBeneficios.length,
        beneficiosCanjeados: stats.totalValidaciones,
        crecimientoSemanal: Math.round(crecimientoSemanal * 100) / 100,
        crecimientoMensual: Math.round(crecimientoMensual * 100) / 100,
        recentActivities,
        systemHealth,
        lastActivity,
        avgValidacionesDiarias: Math.round(avgValidacionesDiarias * 100) / 100,
      };
    } catch (err) {
      console.error('Error calculating comercio metrics:', err);
      throw new Error('Error al cargar las métricas del comercio');
    }
  }, [user, validaciones, activeBeneficios, stats, validacionesLoading, beneficiosLoading]);

  // Calculate metrics with proper dependencies
  useEffect(() => {
    const metrics = calculateMetrics();
    
    if (metrics) {
      setComercioMetrics(metrics);
      setLoading(false);
      setError(null);
    } else if (!validacionesLoading && !beneficiosLoading) {
      setLoading(false);
    }
  }, [calculateMetrics, validacionesLoading, beneficiosLoading]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Validaciones Totales',
      value: comercioMetrics.totalValidaciones.toLocaleString(),
      change: comercioMetrics.crecimientoMensual,
      icon: <QrCode className="w-6 h-6" />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Crecimiento mensual',
      trend: comercioMetrics.crecimientoMensual > 0 ? 'up' as const : comercioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('historial-validaciones'),
      loading: loading
    },
    {
      title: 'Validaciones Hoy',
      value: comercioMetrics.validacionesHoy.toLocaleString(),
      change: comercioMetrics.crecimientoSemanal,
      icon: <Receipt className="w-6 h-6" />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Crecimiento semanal',
      trend: comercioMetrics.crecimientoSemanal > 0 ? 'up' as const : comercioMetrics.crecimientoSemanal < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('qr-validacion'),
      loading: loading
    },
    {
      title: 'Beneficios Activos',
      value: comercioMetrics.beneficiosActivos.toString(),
      change: comercioMetrics.beneficiosActivos > 0 ? 100 : 0,
      icon: <Gift className="w-6 h-6" />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Disponibles',
      trend: comercioMetrics.beneficiosActivos > 3 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: beneficiosLoading
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread.toString(),
      change: notificationStats.unread > 0 ? 100 : 0,
      icon: <Bell className="w-6 h-6" />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      delay: 0.3,
      subtitle: 'Sin leer',
      trend: notificationStats.unread > 5 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('notificaciones'),
      loading: false
    }
  ], [comercioMetrics, notificationStats, beneficiosLoading, loading, onNavigate]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Panel de Control
              </h1>
              <p className="text-slate-600 font-medium text-lg">
                {comercio?.nombreComercio || 'Mi Comercio'} • {user?.email?.split('@')[0] || 'Comercio'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="p-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('qr-validacion')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Validar QR</span>
            </motion.button>
          </div>
        </div>
        
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 md:p-6"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 className="text-emerald-800 font-bold text-lg">
                  Comercio Operativo
                </h3>
                <p className="text-emerald-600 font-medium">
                  Sistema de validaciones funcionando correctamente
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-emerald-700">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">
                {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpiMetrics.map((metric, index) => (
          <ModernKPICard key={index} {...metric} />
        ))}
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Activity Feed - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <ModernActivityFeed
            activities={comercioMetrics.recentActivities}
            loading={loading}
            onViewAll={() => onNavigate?.('historial-validaciones')}
          />
        </div>
        
        {/* Health Status - Takes 1 column */}
        <div className="xl:col-span-1">
          <ModernHealthStatus
            health={comercioMetrics.systemHealth}
            lastActivity={comercioMetrics.lastActivity}
            avgValidaciones={comercioMetrics.avgValidacionesDiarias}
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
            <Zap className="w-6 h-6 text-blue-500" />
            <span>Acciones Rápidas</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Ver Analytics',
                description: 'Métricas detalladas',
                icon: <BarChart3 className="w-6 h-6" />,
                color: 'from-blue-500 to-indigo-500',
                action: () => onNavigate?.('analytics')
              },
              {
                title: 'Gestionar Beneficios',
                description: 'Crear y editar ofertas',
                icon: <Gift className="w-6 h-6" />,
                color: 'from-amber-500 to-orange-500',
                action: () => onNavigate?.('beneficios')
              },
              {
                title: 'Mi Perfil',
                description: 'Configurar comercio',
                icon: <Store className="w-6 h-6" />,
                color: 'from-emerald-500 to-teal-500',
                action: () => onNavigate?.('perfil')
              },
              {
                title: 'Notificaciones',
                description: 'Centro de mensajes',
                icon: <Bell className="w-6 h-6" />,
                color: 'from-purple-500 to-pink-500',
                action: () => onNavigate?.('notificaciones')
              }
            ].map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 text-left group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
            <Target className="w-6 h-6 text-purple-500" />
            <span>Insights de Rendimiento</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Performance Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient1)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - (comercioMetrics.avgValidacionesDiarias / 10))
                    }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {Math.round((comercioMetrics.avgValidacionesDiarias / 10) * 100)}%
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Score de Rendimiento</h4>
              <p className="text-sm text-slate-500">Basado en validaciones diarias</p>
            </div>

            {/* Trend Analysis */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                {comercioMetrics.crecimientoMensual > 0 ? (
                  <TrendingUp className="w-12 h-12 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Tendencia Mensual</h4>
              <p className={`text-sm font-semibold ${
                comercioMetrics.crecimientoMensual > 0 ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {comercioMetrics.crecimientoMensual > 0 ? '+' : ''}{comercioMetrics.crecimientoMensual.toFixed(1)}%
              </p>
            </div>

            {/* Activity Level */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Activity className="w-12 h-12 text-purple-600" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Nivel de Actividad</h4>
              <p className="text-sm text-slate-500">
                {comercioMetrics.validacionesHoy > 0 ? 'Activo hoy' : 'Sin actividad hoy'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
