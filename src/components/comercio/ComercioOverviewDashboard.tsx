'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays, startOfDay, isToday } from 'date-fns';
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
  Activity,
  ArrowUpRight,
  RefreshCw,
  BarChart3,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Sparkles,
} from 'lucide-react';
import { Timestamp, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

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
  beneficioTitulo?: string;
  socioNombre?: string;
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
  sociosUnicos: number;
  ingresosPotenciales: number;
  tasaConversion: number;
}

interface RealTimeStats {
  validacionesEnTiempoReal: number;
  ultimaValidacion: Date | null;
  beneficioMasPopular: string | null;
  horasPico: string[];
}

// Enhanced KPI Card Component with Real-time Updates
const EnhancedKPICard: React.FC<{
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
  realTimeValue?: number;
  showPulse?: boolean;
}> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  gradient, 
  delay, 
  subtitle, 
  trend = 'neutral', 
  onClick, 
  loading = false,
  realTimeValue,
  showPulse = false
}) => {
  
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  // Animate value changes
  useEffect(() => {
    if (realTimeValue !== undefined && realTimeValue !== displayValue) {
      setIsUpdating(true);
      setTimeout(() => {
        setDisplayValue(realTimeValue);
        setIsUpdating(false);
      }, 300);
    }
  }, [realTimeValue, displayValue]);

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
      className="group cursor-pointer relative"
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

        {/* Real-time Pulse Effect */}
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-emerald-400"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.6, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div 
              className="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative"
              style={{ background: `${color}15` }}
            >
              <div style={{ color }} className="w-6 h-6">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  icon
                )}
              </div>
              
              {/* Real-time indicator */}
              {showPulse && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
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
            <motion.h3 
              className={`text-3xl font-black text-slate-800 group-hover:text-slate-900 transition-colors ${
                isUpdating ? 'text-blue-600' : ''
              }`}
              animate={isUpdating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {loading ? '...' : displayValue}
            </motion.h3>
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

// Enhanced Activity Feed with Real-time Updates
const EnhancedActivityFeed: React.FC<{
  activities: ActivityLog[];
  loading: boolean;
  onViewAll?: () => void;
  realTimeUpdates?: boolean;
}> = ({ activities, loading, onViewAll, realTimeUpdates = false }) => {
  
  const [realtimeActivities, setRealtimeActivities] = useState<ActivityLog[]>(activities);

  useEffect(() => {
    setRealtimeActivities(activities);
  }, [activities]);

  // Calculate new activity count (number of activities that are new compared to the initial list)
  const newActivityCount = Math.max(0, realtimeActivities.length - activities.length);

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

  const formatActivityTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    if (isToday(date)) {
      return `Hoy ${format(date, 'HH:mm')}`;
    }
    return format(date, 'dd/MM HH:mm', { locale: es });
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
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl relative">
              <Activity className="w-5 h-5 text-white" />
              {realTimeUpdates && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <span>Actividad Reciente</span>
                {newActivityCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    +{newActivityCount}
                  </motion.span>
                )}
              </h3>
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
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {realtimeActivities.slice(0, 8).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 group"
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${getActivityColor(activity.type)} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
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
                      {activity.socioNombre && (
                        <span className="font-medium text-slate-600"> • {activity.socioNombre}</span>
                      )}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-400 font-medium">
                        {formatActivityTime(activity.timestamp)}
                      </p>
                      {isToday(activity.timestamp.toDate()) && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                          Hoy
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {realtimeActivities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No hay actividad reciente</p>
                <p className="text-xs text-slate-400 mt-1">Las validaciones aparecerán aquí en tiempo real</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced Health Status with Real-time Monitoring
const EnhancedHealthStatus: React.FC<{
  health: ComercioMetrics['systemHealth'];
  lastActivity: Date | null;
  avgValidaciones: number;
  loading: boolean;
  realTimeStats?: RealTimeStats;
}> = ({ health, lastActivity, avgValidaciones, loading, realTimeStats }) => {
  
  const getHealthConfig = () => {
    const configs = {
      excellent: {
        color: 'from-emerald-500 to-teal-500',
        icon: <CheckCircle className="w-6 h-6" />,
        label: 'Excelente',
        bgColor: 'from-emerald-50 to-teal-50',
        textColor: 'text-emerald-700',
        score: 95
      },
      good: {
        color: 'from-blue-500 to-indigo-500',
        icon: <Zap className="w-6 h-6" />,
        label: 'Bueno',
        bgColor: 'from-blue-50 to-indigo-50',
        textColor: 'text-blue-700',
        score: 75
      },
      warning: {
        color: 'from-amber-500 to-orange-500',
        icon: <AlertCircle className="w-6 h-6" />,
        label: 'Atención',
        bgColor: 'from-amber-50 to-orange-50',
        textColor: 'text-amber-700',
        score: 50
      },
      critical: {
        color: 'from-red-500 to-rose-500',
        icon: <AlertCircle className="w-6 h-6" />,
        label: 'Crítico',
        bgColor: 'from-red-50 to-rose-50',
        textColor: 'text-red-700',
        score: 25
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
          <div className={`p-3 bg-gradient-to-r ${config.color} rounded-xl shadow-lg relative`}>
            <div className="text-white">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                config.icon
              )}
            </div>
            {realTimeStats && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
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
        {/* Health Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
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
                stroke={`url(#healthGradient-${health})`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 40 * (1 - (config.score / 100))
                }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <defs>
                <linearGradient id={`healthGradient-${health}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={health === 'excellent' ? '#10b981' : health === 'good' ? '#3b82f6' : health === 'warning' ? '#f59e0b' : '#ef4444'} />
                  <stop offset="100%" stopColor={health === 'excellent' ? '#059669' : health === 'good' ? '#1d4ed8' : health === 'warning' ? '#d97706' : '#dc2626'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-slate-800">
                  {config.score}%
                </span>
                <p className="text-xs text-slate-500">Salud</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Real-time Stats */}
        {realTimeStats && (
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Tiempo Real</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Validaciones hoy:</span>
                <span className="font-semibold text-slate-700">{realTimeStats.validacionesEnTiempoReal}</span>
              </div>
              {realTimeStats.beneficioMasPopular && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Más popular:</span>
                  <span className="font-semibold text-slate-700 truncate max-w-24">{realTimeStats.beneficioMasPopular}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ComercioOverviewDashboard: React.FC<ComercioOverviewDashboardProps> = ({
  onNavigate
}) => {
  const { user } = useAuth();
  const { comercio, refreshStats } = useComercios();
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
    sociosUnicos: 0,
    ingresosPotenciales: 0,
    tasaConversion: 0,
  });
  
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats>({
    validacionesEnTiempoReal: 0,
    ultimaValidacion: null,
    beneficioMasPopular: null,
    horasPico: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const stats = getStats();

  // Real-time Firebase listeners
  useEffect(() => {
    if (!user) return;

    const validacionesRef = collection(db, 'validaciones');
    const todayStart = startOfDay(new Date());
    
    // Real-time validaciones listener
    const validacionesQuery = query(
      validacionesRef,
      where('comercioId', '==', user.uid),
      where('fechaHora', '>=', Timestamp.fromDate(todayStart)),
      orderBy('fechaHora', 'desc')
    );

    const unsubscribeValidaciones = onSnapshot(
      validacionesQuery,
      (snapshot) => {
        const todayValidaciones = snapshot.docs.length;
        const latestValidacion = snapshot.docs[0]?.data();
        
        setRealTimeStats(prev => ({
          ...prev,
          validacionesEnTiempoReal: todayValidaciones,
          ultimaValidacion: latestValidacion?.fechaHora?.toDate() || null,
        }));

        // Show toast for new validations
        if (todayValidaciones > realTimeStats.validacionesEnTiempoReal) {
          toast.success('¡Nueva validación recibida!', {
            icon: '🎉',
            duration: 3000,
          });
        }

        setLastUpdate(new Date());
      },
      (error) => {
        console.error('Error in real-time validaciones listener:', error);
        toast.error('Error en tiempo real');
      }
    );

    // Real-time activities listener
    const activitiesQuery = query(
      validacionesRef,
      where('comercioId', '==', user.uid),
      orderBy('fechaHora', 'desc'),
      limit(10)
    );

    const unsubscribeActivities = onSnapshot(
      activitiesQuery,
      (snapshot) => {
        const activities: ActivityLog[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'validation_completed',
            title: 'Validación completada',
            description: `Beneficio canjeado por socio`,
            timestamp: data.fechaHora,
            metadata: { validacionId: doc.id },
            socioNombre: data.socioNombre || 'Socio anónimo',
            beneficioTitulo: data.beneficioTitulo || 'Beneficio',
          };
        });

        setComercioMetrics(prev => ({
          ...prev,
          recentActivities: activities,
        }));
      }
    );

    return () => {
      unsubscribeValidaciones();
      unsubscribeActivities();
    };
  }, [user, realTimeStats.validacionesEnTiempoReal]);

  // Calculate metrics from validaciones - FIXED: Removed circular dependency
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

      // Calculate unique socios
      const sociosUnicos = new Set(validaciones.map(v => v.socioId)).size;

      // Calculate conversion rate
      const validacionesExitosas = validaciones.filter(v => v.resultado === 'valido').length;
      const tasaConversion = validaciones.length > 0 ? (validacionesExitosas / validaciones.length) * 100 : 0;

      // Determine system health
      let systemHealth: ComercioMetrics['systemHealth'] = 'good';
      if (avgValidacionesDiarias > 5 && tasaConversion > 80) systemHealth = 'excellent';
      else if (avgValidacionesDiarias > 2 && tasaConversion > 60) systemHealth = 'good';
      else if (avgValidacionesDiarias > 0 && tasaConversion > 40) systemHealth = 'warning';
      else systemHealth = 'critical';

      // Get last activity
      const lastActivity = validaciones.length > 0 
        ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0].fechaHora.toDate()
        : null;

      // Estimate potential income (example calculation)
      const ingresosPotenciales = validacionesExitosas * 15; // Assuming average benefit value

      return {
        totalValidaciones: stats.totalValidaciones,
        validacionesHoy,
        validacionesSemana,
        validacionesMes,
        beneficiosActivos: activeBeneficios.length,
        beneficiosCanjeados: stats.totalValidaciones,
        crecimientoSemanal: Math.round(crecimientoSemanal * 100) / 100,
        crecimientoMensual: Math.round(crecimientoMensual * 100) / 100,
        systemHealth,
        lastActivity,
        avgValidacionesDiarias: Math.round(avgValidacionesDiarias * 100) / 100,
        sociosUnicos,
        ingresosPotenciales,
        tasaConversion: Math.round(tasaConversion * 100) / 100,
      };
    } catch (err) {
      console.error('Error calculating comercio metrics:', err);
      throw new Error('Error al cargar las métricas del comercio');
    }
  }, [user, validaciones, activeBeneficios, stats, validacionesLoading, beneficiosLoading]);

  // Calculate metrics with proper dependencies - FIXED: Removed circular dependency
  useEffect(() => {
    const metrics = calculateMetrics();
    
    if (metrics) {
      setComercioMetrics(prev => ({
        ...prev,
        ...metrics,
        // Keep existing activities to avoid overwriting them
        recentActivities: prev.recentActivities,
      }));
      setLoading(false);
      setError(null);
    } else if (!validacionesLoading && !beneficiosLoading) {
      setLoading(false);
    }
  }, [calculateMetrics, beneficiosLoading, validacionesLoading]);

  // Enhanced KPI metrics with real-time values
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
      loading: loading,
      realTimeValue: comercioMetrics.totalValidaciones,
      showPulse: realTimeStats.validacionesEnTiempoReal > comercioMetrics.validacionesHoy
    },
    {
      title: 'Validaciones Hoy',
      value: realTimeStats.validacionesEnTiempoReal.toLocaleString(),
      change: comercioMetrics.crecimientoSemanal,
      icon: <Receipt className="w-6 h-6" />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Tiempo real',
      trend: comercioMetrics.crecimientoSemanal > 0 ? 'up' as const : comercioMetrics.crecimientoSemanal < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('qr-validacion'),
      loading: loading,
      realTimeValue: realTimeStats.validacionesEnTiempoReal,
      showPulse: true
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
      loading: beneficiosLoading,
      realTimeValue: comercioMetrics.beneficiosActivos
    },
    {
      title: 'Socios Únicos',
      value: comercioMetrics.sociosUnicos.toString(),
      change: comercioMetrics.sociosUnicos > 0 ? 50 : 0,
      icon: <Users className="w-6 h-6" />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      delay: 0.3,
      subtitle: 'Este mes',
      trend: comercioMetrics.sociosUnicos > 10 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('analytics'),
      loading: loading,
      realTimeValue: comercioMetrics.sociosUnicos
    }
  ], [comercioMetrics, realTimeStats, beneficiosLoading, loading, onNavigate]);

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    try {
      await refreshStats();
      toast.success('Datos actualizados');
    } catch {
      toast.error('Error al actualizar');
    }
  }, [refreshStats]);

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
      {/* Enhanced Header Section */}
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
              {/* Real-time indicator */}
              <motion.div
                className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Panel de Control
              </h1>
              <p className="text-slate-600 font-medium text-lg">
                {comercio?.nombreComercio || 'Mi Comercio'} • {user?.email?.split('@')[0] || 'Comercio'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Última actualización: {format(lastUpdate, 'HH:mm:ss')}
              </p>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative group"
            >
              <RefreshCw className="w-5 h-5 text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('qr-validacion')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <QrCode className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Validar QR</span>
            </motion.button>
          </div>
        </div>
        
        {/* Enhanced Status Banner with Real-time Info */}
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
                <motion.div 
                  className="w-3 h-3 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 className="text-emerald-800 font-bold text-lg flex items-center space-x-2">
                  <span>Comercio Operativo</span>
                  <motion.span
                    className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    EN VIVO
                  </motion.span>
                </h3>
                <p className="text-emerald-600 font-medium">
                  Sistema de validaciones funcionando correctamente
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-emerald-700">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">
                  {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
                </span>
              </div>
              
              {realTimeStats.ultimaValidacion && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Última: {format(realTimeStats.ultimaValidacion, 'HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpiMetrics.map((metric, index) => (
          <EnhancedKPICard key={index} {...metric} />
        ))}
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Enhanced Activity Feed - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <EnhancedActivityFeed
            activities={comercioMetrics.recentActivities}
            loading={loading}
            onViewAll={() => onNavigate?.('historial-validaciones')}
            realTimeUpdates={true}
          />
        </div>
        
        {/* Enhanced Health Status - Takes 1 column */}
        <div className="xl:col-span-1">
          <EnhancedHealthStatus
            health={comercioMetrics.systemHealth}
            lastActivity={comercioMetrics.lastActivity}
            avgValidaciones={comercioMetrics.avgValidacionesDiarias}
            loading={loading}
            realTimeStats={realTimeStats}
          />
        </div>
      </div>

      {/* Enhanced Quick Actions Section */}
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
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Ver Analytics',
                description: 'Métricas detalladas',
                icon: <BarChart3 className="w-6 h-6" />,
                color: 'from-blue-500 to-indigo-500',
                action: () => onNavigate?.('analytics'),
                badge: 'Nuevo'
              },
              {
                title: 'Gestionar Beneficios',
                description: 'Crear y editar ofertas',
                icon: <Gift className="w-6 h-6" />,
                color: 'from-amber-500 to-orange-500',
                action: () => onNavigate?.('beneficios'),
                badge: `${comercioMetrics.beneficiosActivos} activos`
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
                action: () => onNavigate?.('notificaciones'),
                badge: notificationStats.unread > 0 ? `${notificationStats.unread} nuevas` : undefined
              }
            ].map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 text-left group relative overflow-hidden"
              >
                {/* Badge */}
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                  >
                    {item.badge}
                  </motion.div>
                )}
                
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Performance Insights with Real-time Data */}
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
            <motion.div
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tiempo Real
            </motion.div>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    stroke="url(#performanceGradient)"
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
                    <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center relative">
                {comercioMetrics.crecimientoMensual > 0 ? (
                  <TrendingUp className="w-12 h-12 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-12 h-12 text-red-500" />
                )}
                <motion.div
                  className="absolute inset-0 bg-emerald-200 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Tendencia Mensual</h4>
              <p className={`text-sm font-semibold ${
                comercioMetrics.crecimientoMensual > 0 ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {comercioMetrics.crecimientoMensual > 0 ? '+' : ''}{comercioMetrics.crecimientoMensual.toFixed(1)}%
              </p>
            </div>

            {/* Conversion Rate */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center relative">
                <Target className="w-12 h-12 text-blue-600" />
                <motion.div
                  className="absolute inset-0 border-2 border-blue-400 rounded-full"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Tasa de Conversión</h4>
              <p className="text-sm font-semibold text-blue-600">
                {comercioMetrics.tasaConversion.toFixed(1)}%
              </p>
            </div>

            {/* Activity Level */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center relative">
                <Activity className="w-12 h-12 text-purple-600" />
                {realTimeStats.validacionesEnTiempoReal > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {realTimeStats.validacionesEnTiempoReal}
                  </motion.div>
                )}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Nivel de Actividad</h4>
              <p className="text-sm text-slate-500">
                {realTimeStats.validacionesEnTiempoReal > 0 ? 'Activo hoy' : 'Sin actividad hoy'}
              </p>
            </div>
          </div>

          {/* Real-time Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {comercioMetrics.sociosUnicos}
                </div>
                <div className="text-sm text-slate-500">Socios Únicos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  ${comercioMetrics.ingresosPotenciales.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500">Ingresos Potenciales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {comercioMetrics.validacionesSemana}
                </div>
                <div className="text-sm text-slate-500">Esta Semana</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {comercioMetrics.validacionesMes}
                </div>
                <div className="text-sm text-slate-500">Este Mes</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Updates Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-20 right-6 z-30"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20 flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 bg-emerald-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-slate-600">
            Datos en tiempo real
          </span>
        </div>
      </motion.div>
    </div>
  );
};

