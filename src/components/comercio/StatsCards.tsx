'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useComercios } from '@/hooks/useComercios';
import { 
  Receipt, 
  Gift, 
  Users, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { format, subDays, startOfMonth } from 'date-fns';

export const StatsCards: React.FC = () => {
  const { activeBeneficios, beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();
  const { comercio } = useComercios();

  // Calculate stats
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const validacionesEsteMes = validaciones.filter(v => 
    v.fechaHora.toDate() >= startOfThisMonth
  );

  const ultimaValidacion = validaciones.length > 0 
    ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0]
    : null;

  const tiempoUltimaValidacion = ultimaValidacion 
    ? getTimeAgo(ultimaValidacion.fechaHora.toDate())
    : 'Nunca';

  const asociacionesVinculadas = comercio?.asociacionesVinculadas?.length || 0;

  const stats = [
    {
      title: 'Validaciones este mes',
      value: validacionesEsteMes.length,
      icon: Receipt,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      change: '+12%',
      isPositive: true,
      subtitle: `${(validacionesEsteMes.length / new Date().getDate()).toFixed(1)} por día`
    },
    {
      title: 'Beneficios activos',
      value: activeBeneficios.length,
      icon: Gift,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '0%',
      isPositive: null,
      subtitle: `${beneficios.length} total`
    },
    {
      title: 'Asociaciones vinculadas',
      value: asociacionesVinculadas,
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      change: '+5%',
      isPositive: true,
      subtitle: 'Activas'
    },
    {
      title: 'Última validación',
      value: tiempoUltimaValidacion,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      change: null,
      isPositive: null,
      subtitle: ultimaValidacion ? format(ultimaValidacion.fechaHora.toDate(), 'dd/MM HH:mm') : ''
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50 hover:shadow-soft-lg hover:border-slate-300/50 transition-all duration-300">
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              
              {stat.change && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                  stat.isPositive 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>

            {/* Value */}
            <div className="mb-2">
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>
              <p className="text-sm font-semibold text-slate-600">
                {stat.title}
              </p>
            </div>

            {/* Subtitle */}
            {stat.subtitle && (
              <p className="text-xs text-slate-500 font-medium">
                {stat.subtitle}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
}
