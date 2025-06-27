'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Asociacion {
  id: string;
  nombre: string;
  estado: 'activo' | 'vencido' | 'pendiente';
  fechaVencimiento?: Date;
  logo?: string;
}

interface AsociacionesListProps {
  asociaciones?: Asociacion[];
}

export const AsociacionesList: React.FC<AsociacionesListProps> = ({ 
  asociaciones = [
    {
      id: '1',
      nombre: 'Asociación de Comerciantes Centro',
      estado: 'activo',
      fechaVencimiento: new Date('2024-12-31')
    },
    {
      id: '2',
      nombre: 'Cámara de Comercio Local',
      estado: 'vencido',
      fechaVencimiento: new Date('2024-01-15')
    }
  ]
}) => {
  const getStatusIcon = (estado: Asociacion['estado']) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'vencido':
        return <XCircle size={16} className="text-red-500" />;
      case 'pendiente':
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (estado: Asociacion['estado']) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'vencido':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (estado: Asociacion['estado']) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'vencido':
        return 'Vencido';
      case 'pendiente':
        return 'Pendiente';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Building2 size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Mis Asociaciones</h3>
          <p className="text-sm text-gray-500">Estado de membresías</p>
        </div>
      </div>

      <div className="space-y-4">
        {asociaciones.map((asociacion, index) => (
          <motion.div
            key={asociacion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Building2 size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{asociacion.nombre}</h4>
                {asociacion.fechaVencimiento && (
                  <p className="text-xs text-gray-500">
                    Vence: {asociacion.fechaVencimiento.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusIcon(asociacion.estado)}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(asociacion.estado)}`}>
                {getStatusText(asociacion.estado)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {asociaciones.length === 0 && (
        <div className="text-center py-8">
          <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes asociaciones registradas</p>
        </div>
      )}
    </motion.div>
  );
};
