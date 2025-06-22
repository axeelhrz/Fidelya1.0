'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SocioStats } from '@/types/socio';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

interface AsociacionDashboardSummaryProps {
  stats: SocioStats;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  delay, 
  trend = 'neutral',
  percentage 
}) => (
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
    className="group relative overflow-hidden"
  >
    {/* Background with gradient */}
    <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
    
    {/* Main card */}
    <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100/50 rounded-3xl p-8 hover:border-gray-200/80 transition-all duration-500 hover:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      
      {/* Header with icon */}
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-2xl ${gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
          {icon}
        </div>
        
        {/* Trend indicator */}
        {percentage !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' 
              ? 'bg-emerald-50 text-emerald-700' 
              : trend === 'down' 
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-50 text-gray-600'
          }`}>
            {trend === 'up' && <ArrowUpRight size={12} />}
            {trend === 'down' && <ArrowDownRight size={12} />}
            {percentage}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 tracking-wide uppercase">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900 tracking-tight">
            {value.toLocaleString()}
          </span>
          {title === 'Tasa de Actividad' && (
            <span className="text-lg font-medium text-gray-400">%</span>
          )}
        </div>
      </div>

      {/* Subtle accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
    </div>
  </motion.div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-100 rounded-3xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
        <div className="w-16 h-6 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="w-24 h-4 bg-gray-200 rounded" />
        <div className="w-20 h-10 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export const AsociacionDashboardSummary: React.FC<AsociacionDashboardSummaryProps> = ({ 
  stats, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  const activityRate = stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0;
  const expiredRate = stats.total > 0 ? Math.round((stats.vencidos / stats.total) * 100) : 0;

  const cards = [
    {
      title: 'Total de Socios',
      value: stats.total,
      icon: <Users size={28} className="text-slate-700" />,
      gradient: 'bg-gradient-to-br from-slate-500 to-slate-700',
      delay: 0,
      trend: 'neutral' as const
    },
    {
      title: 'Socios Activos',
      value: stats.activos,
      icon: <UserCheck size={28} className="text-emerald-600" />,
      gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      delay: 0.1,
      trend: 'up' as const,
      percentage: activityRate
    },
    {
      title: 'Socios Vencidos',
      value: stats.vencidos,
      icon: <UserX size={28} className="text-red-500" />,
      gradient: 'bg-gradient-to-br from-red-400 to-red-600',
      delay: 0.2,
      trend: stats.vencidos > 0 ? 'down' as const : 'neutral' as const,
      percentage: expiredRate
    },
    {
      title: 'Tasa de Actividad',
      value: activityRate,
      icon: <TrendingUp size={28} className="text-indigo-600" />,
      gradient: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      delay: 0.3,
      trend: activityRate >= 80 ? 'up' as const : activityRate >= 60 ? 'neutral' as const : 'down' as const
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Resumen Ejecutivo
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-600"
        >
          Métricas clave de la asociación en tiempo real
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            gradient={card.gradient}
            delay={card.delay}
            trend={card.trend}
            percentage={card.percentage}
          />
        ))}
      </div>
    </motion.div>
  );
};