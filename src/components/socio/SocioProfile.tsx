'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Edit, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocioProfile } from '@/hooks/useSocioProfile';

export const SocioProfile: React.FC = () => {
  const { user } = useAuth();
  const { socio, loading } = useSocioProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando perfil...</p>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {socio?.nombre || user?.nombre || 'Socio'}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Socio #{socio?.numeroSocio || 'N/A'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-600">Activo</span>
              </div>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <Edit className="w-5 h-5" />
            Editar Perfil
          </button>
        </div>
      </motion.div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <User className="w-6 h-6 text-blue-500" />
            Información Personal
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="font-bold text-slate-900">{user?.email || 'No especificado'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <Phone className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Teléfono</p>
                <p className="font-bold text-slate-900">{socio?.telefono || 'No especificado'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Fecha de Registro</p>
                <p className="font-bold text-slate-900">
                  {socio?.creadoEn ? new Date(socio.creadoEn.toDate()).toLocaleDateString() : 'No disponible'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <MapPin className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Ubicación</p>
                <p className="font-bold text-slate-900">{socio?.ciudad || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Membership Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-purple-500" />
            Detalles de Membresía
          </h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-emerald-900">Estado de Membresía</h3>
                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold">
                  Activo
                </span>
              </div>
              <p className="text-emerald-700">Tu membresía está activa y en buen estado.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-2xl font-black text-blue-600">Bronze</p>
                <p className="text-sm text-slate-600 font-medium">Nivel Actual</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-2xl font-black text-purple-600">850</p>
                <p className="text-sm text-slate-600 font-medium">Puntos</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Progreso a Silver</span>
                <span className="text-sm font-bold text-slate-900">850/1000</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};