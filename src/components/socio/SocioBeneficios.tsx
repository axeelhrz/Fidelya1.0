'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Search, Filter, Star, MapPin, Clock, Tag } from 'lucide-react';
import { useBeneficios } from '@/hooks/useBeneficios';

export const SocioBeneficios: React.FC = () => {
  const { beneficiosActivos, loading } = useBeneficios();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando beneficios...</p>
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Beneficios Disponibles</h1>
              <p className="text-slate-600 font-medium">Descubre todas las ofertas exclusivas para ti</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar beneficios..."
                className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="w-12 h-12 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-300">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">Disponibles</p>
              <p className="text-3xl font-black text-purple-900">{beneficiosActivos?.length || 0}</p>
            </div>
            <Gift className="w-8 h-8 text-purple-500" />
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
              <p className="text-emerald-600 font-medium">Nuevos</p>
              <p className="text-3xl font-black text-emerald-900">5</p>
            </div>
            <Star className="w-8 h-8 text-emerald-500" />
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
              <p className="text-blue-600 font-medium">Por Vencer</p>
              <p className="text-3xl font-black text-blue-900">3</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiosActivos?.slice(0, 6).map((beneficio, index) => (
          <motion.div
            key={beneficio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 4) }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Benefit Image */}
            <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-purple-600">
                  {beneficio.descuento}% OFF
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Star className="w-4 h-4 text-yellow-500" />
                </button>
              </div>
            </div>

            {/* Benefit Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                    {beneficio.titulo}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {beneficio.descripcion}
                  </p>
                </div>
              </div>

              {/* Benefit Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{beneficio.comercioNombre}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Válido hasta {new Date(beneficio.fechaVencimiento?.toDate()).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Tag className="w-4 h-4" />
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                    {beneficio.categoria || 'General'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {(!beneficiosActivos || beneficiosActivos.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">No hay beneficios disponibles</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Actualmente no tienes beneficios disponibles. ¡Mantente atento para nuevas ofertas exclusivas!
          </p>
        </motion.div>
      )}
    </div>
  );
};