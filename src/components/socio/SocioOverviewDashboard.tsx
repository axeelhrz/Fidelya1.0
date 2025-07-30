'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  TrendingUp, 
  Calendar, 
  Star,
  Building2,
  Activity,
  Clock,
  Target
} from 'lucide-react';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';

interface SocioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
  onQuickScan?: () => void;
  stats?: {
    totalBeneficios?: number;
    beneficiosUsados?: number;
    asociacionesActivas?: number;
    beneficiosEstesMes?: number;
  };
}

const SocioOverviewDashboard = memo<SocioOverviewDashboardProps>(({ 
  onNavigate, 
  onQuickScan, 
  stats 
}) => {
  const { user } = useAuth();
  const { socio, estadisticas } = useSocioProfile();
  const { beneficios, estadisticasRapidas } = useBeneficios();

  // Memoizar estadísticas consolidadas
  const consolidatedStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calcular beneficios del mes actual
    const beneficiosEstesMes = estadisticas?.validacionesPorMes?.find(mes => {
      const [year, month] = mes.mes.split('-').map(Number);
      return year === currentYear && month === currentMonth + 1;
    })?.validaciones || 0;

    return {
      totalBeneficios: estadisticasRapidas.disponibles || 0,
      beneficiosUsados: estadisticasRapidas.usados || 0,
      beneficiosEstesMes,
      asociacionesActivas: 1, // Por ahora asumimos 1 asociación
      ahorroTotal: estadisticas?.ahorroTotal || 0,
      beneficiosVencenProximamente: beneficios.filter(b => {
        if (!b.fechaVencimiento) return false;
        const fechaVenc = b.fechaVencimiento.toDate ? b.fechaVencimiento.toDate() : new Date(b.fechaVencimiento);
        const diasRestantes = Math.ceil((fechaVenc.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 7 && diasRestantes > 0;
      }).length
    };
  }, [estadisticasRapidas, estadisticas, beneficios]);

  // Beneficios destacados
  const beneficiosDestacados = useMemo(() => {
    return beneficios
      .filter(b => b.estado === 'activo')
      .sort((a, b) => (b.descuento || 0) - (a.descuento || 0))
      .slice(0, 3);
  }, [beneficios]);

  return (
    <div className="space-y-6">
      {/* Resumen de actividad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mb-1">
            {consolidatedStats.totalBeneficios}
          </div>
          <div className="text-sm text-blue-600 font-medium">
            Beneficios Disponibles
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mb-1">
            {consolidatedStats.beneficiosUsados}
          </div>
          <div className="text-sm text-emerald-600 font-medium">
            Beneficios Utilizados
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 mb-1">
            {consolidatedStats.beneficiosEstesMes}
          </div>
          <div className="text-sm text-purple-600 font-medium">
            Usados Este Mes
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mb-1">
            {consolidatedStats.asociacionesActivas}
          </div>
          <div className="text-sm text-amber-600 font-medium">
            Asociaciones Activas
          </div>
        </div>
      </motion.div>

      {/* Beneficios destacados */}
      {beneficiosDestacados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Beneficios Destacados</h3>
            <button
              onClick={() => onNavigate?.('beneficios')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Ver todos
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {beneficiosDestacados.map((beneficio, index) => (
              <motion.div
                key={beneficio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight flex-1">
                    {beneficio.titulo}
                  </h4>
                  {beneficio.descuento && (
                    <div className="ml-2 px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg text-xs font-bold">
                      {beneficio.tipoDescuento === 'porcentaje' ? `${beneficio.descuento}%` : `$${beneficio.descuento}`}
                    </div>
                  )}
                </div>
                
                {beneficio.comercioNombre && (
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600 font-medium">{beneficio.comercioNombre}</span>
                  </div>
                )}
                
                {beneficio.descripcion && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {beneficio.descripcion}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-bold">Disponible</span>
                  </div>
                  
                  <button
                    onClick={onQuickScan}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                  >
                    Usar ahora
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Alertas y notificaciones */}
      {consolidatedStats.beneficiosVencenProximamente > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Beneficios por vencer</h4>
              <p className="text-sm text-amber-700">
                Tienes {consolidatedStats.beneficiosVencenProximamente} beneficio{consolidatedStats.beneficiosVencenProximamente > 1 ? 's' : ''} que vence{consolidatedStats.beneficiosVencenProximamente > 1 ? 'n' : ''} pronto
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('beneficios')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
          >
            Ver detalles
          </button>
        </motion.div>
      )}

      {/* Acciones rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-6"
      >
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Acciones Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onQuickScan}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-white mb-2">Escanear QR</h4>
            <p className="text-white/80 text-sm">Valida un beneficio escaneando el código QR</p>
          </button>

          <button
            onClick={() => onNavigate?.('beneficios')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <Activity className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-white mb-2">Ver Beneficios</h4>
            <p className="text-white/80 text-sm">Explora todos los beneficios disponibles</p>
          </button>

          <button
            onClick={() => onNavigate?.('perfil')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <Target className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-white mb-2">Mi Perfil</h4>
            <p className="text-white/80 text-sm">Actualiza tu información personal</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
});

SocioOverviewDashboard.displayName = 'SocioOverviewDashboard';

export { SocioOverviewDashboard };
export default SocioOverviewDashboard;