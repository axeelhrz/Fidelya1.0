'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, MapPin, Gift, TrendingUp, Filter, Search } from 'lucide-react';
import { useBeneficios } from '@/hooks/useBeneficios';

export const SocioHistorial: React.FC = () => {
  const { beneficiosUsados, estadisticasRapidas, loading } = useBeneficios();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Historial de Beneficios</h1>
              <p className="text-slate-600 font-medium">Revisa todos los beneficios que has utilizado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en historial..."
                className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button className="w-12 h-12 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-300">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 rounded-3xl p-6 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-medium">Total Usado</p>
              <p className="text-3xl font-black text-red-900">{estadisticasRapidas.usados}</p>
            </div>
            <Gift className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Ahorro Total</p>
              <p className="text-3xl font-black text-emerald-900">${estadisticasRapidas.ahorroTotal}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Este Mes</p>
              <p className="text-3xl font-black text-blue-900">${estadisticasRapidas.ahorroEsteMes}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">Promedio</p>
              <p className="text-3xl font-black text-purple-900">
                ${estadisticasRapidas.usados > 0 ? Math.round(estadisticasRapidas.ahorroTotal / estadisticasRapidas.usados) : 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* History Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Actividad Reciente</h2>
        
        <div className="space-y-6">
          {beneficiosUsados?.slice(0, 10).map((uso, index) => (
            <motion.div
              key={uso.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Gift className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {uso.beneficioTitulo}
                  </h3>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                    Usado
                  </span>
                </div>
                
                <p className="text-slate-600 mb-3">
                  {uso.beneficioDescripcion}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{uso.comercioNombre}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(uso.fechaUso.toDate()).toLocaleDateString()}</span>
                  </div>
                  
                  {uso.ahorroGenerado && (
                    <div className="flex items-center gap-1 text-emerald-600 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      <span>Ahorraste ${uso.ahorroGenerado}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {beneficiosUsados && beneficiosUsados.length > 10 && (
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Cargar Más
            </button>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {(!beneficiosUsados || beneficiosUsados.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <History className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">No hay historial disponible</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Aún no has utilizado ningún beneficio. ¡Comienza a explorar las ofertas disponibles!
          </p>
        </motion.div>
      )}
    </div>
  );
};