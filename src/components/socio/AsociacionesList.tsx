'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Asociacion {
  id: string;
  nombre: string;
  estado: 'activo' | 'vencido' | 'pendiente' | 'inactivo' | 'suspendido';
  fechaVencimiento?: Date;
  logo?: string;
  descripcion?: string;
}

interface AsociacionesListProps {
  asociaciones?: Asociacion[];
}

function isTimestamp(obj: unknown): obj is { toDate: () => Date } {
  return !!obj && typeof obj === 'object' && typeof (obj as { toDate?: unknown }).toDate === 'function';
}

export const AsociacionesList: React.FC<AsociacionesListProps> = ({ 
  asociaciones: asociacionesProp = [
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
  const { asociaciones, loading } = useSocioProfile();
  const asociacionesToShow = asociaciones && asociaciones.length > 0 ? asociaciones : asociacionesProp;

  const getStatusIcon = (estado: Asociacion['estado']) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'vencido':
        return <XCircle size={16} className="text-red-500" />;
      case 'pendiente':
        return <Clock size={16} className="text-yellow-500" />;
      case 'inactivo':
        return <AlertTriangle size={16} className="text-gray-500" />;
      case 'suspendido':
        return <AlertTriangle size={16} className="text-orange-500" />;
      default:
        return null;
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
      case 'inactivo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspendido':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return '';
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
      case 'inactivo':
        return 'Inactivo';
      case 'suspendido':
        return 'Suspendido';
      default:
        return '';
    }
  };

  const getStatusDescription = (estado: Asociacion['estado'], fechaVencimiento?: Date) => {
    switch (estado) {
      case 'activo':
        if (fechaVencimiento) {
          return `Vence: ${format(fechaVencimiento, 'dd/MM/yyyy', { locale: es })}`;
        }
        return 'Membresía activa';
      case 'vencido':
        if (fechaVencimiento) {
          return `Venció: ${format(fechaVencimiento, 'dd/MM/yyyy', { locale: es })}`;
        }
        return 'Membresía vencida';
      case 'pendiente':
        return 'Activación pendiente';
      case 'inactivo':
        return 'Membresía inactiva';
      case 'suspendido':
        return 'Membresía suspendida';
      default:
        return '';
    }
  };

  if (loading) {
    return <LoadingSkeleton className="h-64" />;
  }

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
        {asociacionesToShow.map((asociacion, index) => (
          <motion.div
            key={asociacion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                {asociacion.logo ? (
                  <Image
                    src={asociacion.logo}
                    alt={asociacion.nombre}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building2 size={20} className="text-gray-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{asociacion.nombre}</div>
                <p className="text-xs text-gray-500">
                  {getStatusDescription(
                    asociacion.estado,
                    asociacion.fechaVencimiento && isTimestamp(asociacion.fechaVencimiento)
                      ? asociacion.fechaVencimiento.toDate()
                      : asociacion.fechaVencimiento
                  )}
                </p>
                {asociacion.descripcion && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {asociacion.descripcion}
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

      {asociacionesToShow.length === 0 && (
        <div className="text-center py-8">
          <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 mb-2">No tienes asociaciones</h4>
          <p className="text-gray-500 text-sm">
            Contacta con tu administrador para obtener acceso a una asociación.
          </p>
        </div>
      )}

      {/* Resumen de estado */}
      {asociacionesToShow.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {asociacionesToShow.filter(a => a.estado === 'activo').length}
              </div>
              <div className="text-xs text-gray-500">Activas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {asociacionesToShow.filter(a => a.estado === 'vencido').length}
              </div>
              <div className="text-xs text-gray-500">Vencidas</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};