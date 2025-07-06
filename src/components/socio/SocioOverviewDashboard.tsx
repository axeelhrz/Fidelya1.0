'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Gift,
  QrCodeScanner,
  Bell,
  Calendar,
  MapPin,
  Star,
  Zap,
  Heart,
  Share2,
  ArrowRight,
  RefreshCw,
  Activity,
  Award,
  Target,
  Clock,
  Sparkles,
  Crown,
  Users,
  ShoppingBag,
  Percent,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingFlat
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays, isToday, isYesterday, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface SocioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
  onScanQR?: () => void;
}

interface ActivityLog {
  id: string;
  type: 'benefit_used' | 'benefit_available' | 'membership_renewed' | 'profile_updated' | 'notification_received';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface SocioMetrics {
  beneficiosDisponibles: number;
  beneficiosUsados: number;
  ahorroTotal: number;
  ahorroMensual: number;
  beneficiosEsteMes: number;
  crecimientoMensual: number;
  recentActivities: ActivityLog[];
  membershipHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastActivity: Date | null;
  avgBeneficiosMensuales: number;
  categoriaFavorita: string;
  streakDias: number;
  proximoVencimiento: Date | null;
}

// Enhanced KPI Card Component
const KPICard: React.FC<{
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
  badge?: string;
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
  badge
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="relative group"
    >
      <div
        onClick={onClick}
        className={`
          relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 
          transition-all duration-300 cursor-pointer h-full
          hover:border-gray-300 hover:shadow-lg hover:-translate-y-1
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
        style={{
          background: `linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16" 
               style={{ background: gradient }} />
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            {badge}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ background: gradient }}
          >
            {loading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              icon
            )}
          </div>
          
          {/* Trend Indicator */}
          <div className="flex items-center gap-1">
            {trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
            {trend === 'down' && <TrendingDown size={16} className="text-red-500" />}
            {trend === 'neutral' && <TrendingFlat size={16} className="text-gray-400" />}
            <span className={`
              text-sm font-bold
              ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}
            `}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: loading ? '0%' : `${Math.min(Math.abs(change) * 2, 100)}%`,
                background: gradient
              }}
            />
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
             style={{ background: gradient }} />
      </div>
    </motion.div>
  );
};

// Activity Timeline Component
const ActivityTimeline: React.FC<{
  activities: ActivityLog[];
  loading: boolean;
  onViewAll?: () => void;
}> = ({ activities, loading, onViewAll }) => {
  const getActivityIcon = (type: ActivityLog['type']) => {
    const icons = {
      benefit_used: <Gift size={16} />,
      benefit_available: <Sparkles size={16} />,
      membership_renewed: <Crown size={16} />,
      profile_updated: <Users size={16} />,
      notification_received: <Bell size={16} />,
    };
    return icons[type] || <Info size={16} />;
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    const colors = {
      benefit_used: 'bg-emerald-500',
      benefit_available: 'bg-amber-500',
      membership_renewed: 'bg-purple-500',
      profile_updated: 'bg-blue-500',
      notification_received: 'bg-pink-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const formatActivityTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    if (isToday(date)) {
      return `Hoy ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Ayer ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM HH:mm', { locale: es });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Actividad Reciente</h3>
            <p className="text-sm text-gray-500">Tus últimas acciones</p>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            Ver todo
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0
                ${getActivityColor(activity.type)}
              `}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400">
                  {formatActivityTime(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <Activity size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No hay actividad reciente</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Membership Status Card
const MembershipStatusCard: React.FC<{
  health: SocioMetrics['membershipHealth'];
  lastActivity: Date | null;
  streakDias: number;
  proximoVencimiento: Date | null;
  loading: boolean;
}> = ({ health, lastActivity, streakDias, proximoVencimiento, loading }) => {
  const getHealthConfig = () => {
    const configs = {
      excellent: {
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: <CheckCircle size={20} />,
        label: 'Excelente',
        description: 'Socio muy activo'
      },
      good: {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <Target size={20} />,
        label: 'Bueno',
        description: 'Socio activo'
      },
      warning: {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: <Clock size={20} />,
        label: 'Regular',
        description: 'Puede mejorar'
      },
      critical: {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <AlertCircle size={20} />,
        label: 'Inactivo',
        description: 'Requiere atención'
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
      className="bg-white rounded-2xl border border-gray-200 p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor} ${config.color}`}>
          {loading ? <RefreshCw size={20} className="animate-spin" /> : config.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Estado de Socio</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} ${config.borderColor} border`}>
            {config.label}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Last Activity */}
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock size={16} className="text-white" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Última actividad</p>
          <p className="font-bold text-gray-900 text-sm">
            {loading ? '...' : lastActivity ? format(lastActivity, 'dd/MM', { locale: es }) : 'Sin actividad'}
          </p>
        </div>

        {/* Streak */}
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Zap size={16} className="text-white" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Racha de días</p>
          <p className="font-bold text-gray-900 text-sm">
            {loading ? '...' : `${streakDias} días`}
          </p>
        </div>
      </div>

      {/* Membership Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Estado de membresía</span>
          <span className="text-sm font-medium text-emerald-600">Activo</span>
        </div>
        
        {proximoVencimiento && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Próximo vencimiento</span>
            <span className="text-sm font-medium text-gray-900">
              {format(proximoVencimiento, 'dd/MM/yyyy', { locale: es })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Nivel de socio</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500" />
            <span className="text-sm font-medium text-gray-900">Premium</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progreso mensual</span>
          <span className="text-sm font-medium text-gray-900">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/4 transition-all duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

// Quick Stats Component
const QuickStats: React.FC<{
  beneficiosDisponibles: number;
  ahorroMensual: number;
  categoriaFavorita: string;
  loading: boolean;
}> = ({ beneficiosDisponibles, ahorroMensual, categoriaFavorita, loading }) => {
  const stats = [
    {
      label: 'Beneficios disponibles',
      value: beneficiosDisponibles,
      icon: <Gift size={16} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Ahorro este mes',
      value: `$${ahorroMensual.toLocaleString()}`,
      icon: <DollarSign size={16} />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Categoría favorita',
      value: categoriaFavorita,
      icon: <Heart size={16} />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="font-bold text-gray-900">
                {loading ? '...' : stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const SocioOverviewDashboard: React.FC<SocioOverviewDashboardProps> = ({
  onNavigate,
  onScanQR
}) => {
  const { user } = useAuth();
  const { beneficios, beneficiosUsados, loading: beneficiosLoading } = useBeneficios();
  const { stats: notificationStats } = useNotifications();
  
  const [socioMetrics, setSocioMetrics] = useState<SocioMetrics>({
    beneficiosDisponibles: 0,
    beneficiosUsados: 0,
    ahorroTotal: 0,
    ahorroMensual: 0,
    beneficiosEsteMes: 0,
    crecimientoMensual: 0,
    recentActivities: [],
    membershipHealth: 'good',
    lastActivity: null,
    avgBeneficiosMensuales: 0,
    categoriaFavorita: 'General',
    streakDias: 0,
    proximoVencimiento: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate metrics from beneficios
  const calculateMetrics = useCallback(() => {
    if (!user || beneficiosLoading) {
      return null;
    }

    try {
      const now = new Date();
      const monthAgo = subDays(now, 30);
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);

      // Filter beneficios used this month
      const beneficiosEsteMes = beneficiosUsados.filter(b => 
        b.fechaUso.toDate() >= monthAgo
      ).length;

      const beneficiosMesAnterior = beneficiosUsados.filter(b => {
        const date = b.fechaUso.toDate();
        return date >= subDays(monthAgo, 30) && date < monthAgo;
      }).length;

      // Calculate growth rate
      const crecimientoMensual = beneficiosMesAnterior > 0 
        ? ((beneficiosEsteMes - beneficiosMesAnterior) / beneficiosMesAnterior) * 100
        : beneficiosEsteMes > 0 ? 100 : 0;

      // Calculate total savings
      const ahorroTotal = beneficiosUsados.reduce((total, b) => total + (b.montoDescuento || 0), 0);
      const ahorroMensual = beneficiosUsados
        .filter(b => b.fechaUso.toDate() >= monthAgo)
        .reduce((total, b) => total + (b.montoDescuento || 0), 0);

      // Calculate average monthly benefits
      const avgBeneficiosMensuales = beneficiosUsados.length > 0 ? beneficiosUsados.length / 3 : 0;

      // Determine membership health
      let membershipHealth: SocioMetrics['membershipHealth'] = 'good';
      if (avgBeneficiosMensuales > 5) membershipHealth = 'excellent';
      else if (avgBeneficiosMensuales > 2) membershipHealth = 'good';
      else if (avgBeneficiosMensuales > 0) membershipHealth = 'warning';
      else membershipHealth = 'critical';

      // Get last activity
      const lastActivity = beneficiosUsados.length > 0 
        ? beneficiosUsados.sort((a, b) => b.fechaUso.toDate().getTime() - a.fechaUso.toDate().getTime())[0].fechaUso.toDate()
        : null;

      // Calculate streak days (mock calculation)
      const streakDias = Math.floor(Math.random() * 15) + 1;

      // Get favorite category (mock for now)
      const categoriaFavorita = 'Restaurantes';

      // Mock próximo vencimiento
      const proximoVencimiento = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      // Create sample activities
      const recentActivities: ActivityLog[] = beneficiosUsados
        .slice(0, 5)
        .map((b, index) => ({
          id: b.id || `activity-${index}`,
          type: 'benefit_used' as const,
          title: 'Beneficio utilizado',
          description: `Ahorraste $${b.montoDescuento || 0} en tu compra`,
          timestamp: b.fechaUso,
          metadata: { beneficioId: b.beneficioId },
        }));

      return {
        beneficiosDisponibles: beneficios.length,
        beneficiosUsados: beneficiosUsados.length,
        ahorroTotal,
        ahorroMensual,
        beneficiosEsteMes,
        crecimientoMensual: Math.round(crecimientoMensual * 100) / 100,
        recentActivities,
        membershipHealth,
        lastActivity,
        avgBeneficiosMensuales: Math.round(avgBeneficiosMensuales * 100) / 100,
        categoriaFavorita,
        streakDias,
        proximoVencimiento,
      };
    } catch (err) {
      console.error('Error calculating socio metrics:', err);
      throw new Error('Error al cargar las métricas del socio');
    }
  }, [user, beneficios, beneficiosUsados, beneficiosLoading]);

  // Calculate metrics with proper dependencies
  useEffect(() => {
    const metrics = calculateMetrics();
    
    if (metrics) {
      setSocioMetrics(metrics);
      setLoading(false);
      setError(null);
    } else if (!beneficiosLoading) {
      setLoading(false);
    }
  }, [calculateMetrics, beneficiosLoading]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Beneficios Disponibles',
      value: socioMetrics.beneficiosDisponibles.toLocaleString(),
      change: socioMetrics.beneficiosDisponibles > 5 ? 25 : 0,
      icon: <Gift size={24} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Listos para usar',
      trend: socioMetrics.beneficiosDisponibles > 5 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Total Ahorrado',
      value: `$${socioMetrics.ahorroTotal.toLocaleString()}`,
      change: socioMetrics.crecimientoMensual,
      icon: <DollarSign size={24} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'En todos los beneficios',
      trend: socioMetrics.crecimientoMensual > 0 ? 'up' as const : socioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Este Mes',
      value: socioMetrics.beneficiosEsteMes.toString(),
      change: socioMetrics.crecimientoMensual,
      icon: <ShoppingBag size={24} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Beneficios usados',
      trend: socioMetrics.crecimientoMensual > 0 ? 'up' as const : socioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread.toString(),
      change: notificationStats.unread > 0 ? 100 : 0,
      icon: <Bell size={24} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      delay: 0.3,
      subtitle: 'Sin leer',
      trend: notificationStats.unread > 3 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('notificaciones'),
      loading: false,
      badge: notificationStats.unread > 0 ? notificationStats.unread.toString() : undefined
    }
  ], [socioMetrics, notificationStats, loading, onNavigate]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.nombre || 'Socio'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenido a tu panel de beneficios
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-600">
              Socio activo • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
          <button
            onClick={onScanQR}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <QrCodeScanner size={20} />
            Escanear QR
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <QuickStats
        beneficiosDisponibles={socioMetrics.beneficiosDisponibles}
        ahorroMensual={socioMetrics.ahorroMensual}
        categoriaFavorita={socioMetrics.categoriaFavorita}
        loading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <KPICard key={index} {...metric} />
        ))}
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimeline
            activities={socioMetrics.recentActivities}
            loading={loading}
            onViewAll={() => onNavigate?.('beneficios')}
          />
        </div>
        <div>
          <MembershipStatusCard
            health={socioMetrics.membershipHealth}
            lastActivity={socioMetrics.lastActivity}
            streakDias={socioMetrics.streakDias}
            proximoVencimiento={socioMetrics.proximoVencimiento}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};