'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { Gift, TrendingUp, Award, Star } from 'lucide-react';

export const TopBenefits: React.FC = () => {
  const { beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();

  // Calculate benefit usage
  const benefitUsage = beneficios.map(beneficio => {
    const usos = validaciones.filter(v => v.beneficioId === beneficio.id && v.resultado === 'valido').length;
    return {
      ...beneficio,
      usos,
      porcentaje: 0 // Will be calculated after sorting
    };
  }).sort((a, b) => b.usos - a.usos).slice(0, 5);

  // Calculate percentages based on the most used benefit
  const maxUsos = benefitUsage[0]?.usos || 1;
  benefitUsage.forEach(benefit => {
    benefit.porcentaje = (benefit.usos / maxUsos) * 100;
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactivo':
        return 'bg-slate-100 text-slate-700';
      case 'vencido':
        return 'bg-red-100 text-red-700';
      case 'agotado':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      case 'vencido':
        return 'Vencido';
      case 'agotado':
        return 'Agotado';
      default:
        return estado;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Beneficios más canjeados
          </h3>
          <p className="text-sm text-slate-600">
            Top 5 beneficios por uso
          </p>
        </div>
      </div>

      {/* Benefits List */}
      {benefitUsage.length > 0 ? (
        <div className="space-y-4">
          {benefitUsage.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/50 hover:border-slate-300/50 hover:shadow-md transition-all duration-300">
                {/* Ranking */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  index === 0 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                    : index === 1
                    ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                    : index === 2
                    ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {index === 0 ? <Award className="w-4 h-4" /> : index + 1}
                </div>

                {/* Benefit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900 truncate">
                      {benefit.titulo}
                    </h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(benefit.estado)}`}>
                      {getStatusText(benefit.estado)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">
                    {benefit.asociacionesVinculadas.length} asociación{benefit.asociacionesVinculadas.length !== 1 ? 'es' : ''}
                  </p>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${benefit.porcentaje}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-500">
                        {benefit.porcentaje.toFixed(0)}% del más usado
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {benefit.usos} uso{benefit.usos !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Count */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-violet-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-2xl font-bold">{benefit.usos}</span>
                  </div>
                  <p className="text-xs text-slate-500">canjes</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            No hay datos de uso
          </h4>
          <p className="text-slate-600">
            Cuando tengas validaciones, aquí verás tus beneficios más populares.
          </p>
        </div>
      )}
    </motion.div>
  );
};
