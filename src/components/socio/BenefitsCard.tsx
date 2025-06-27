'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Percent, Calendar, Tag, Eye, Clock, CheckCircle } from 'lucide-react';
import { Beneficio, BeneficioUso } from '@/types/beneficio';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';

interface BenefitsCardProps {
  beneficio?: Beneficio;
  beneficioUso?: BeneficioUso;
  tipo: 'disponible' | 'usado';
  onUse?: (beneficioId: string) => void;
}

export const BenefitsCard: React.FC<BenefitsCardProps> = ({
  beneficio,
  beneficioUso,
  tipo,
  onUse
}) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Para beneficios usados, necesitamos obtener la info del beneficio
  const data = beneficio || (beneficioUso ? {
    id: beneficioUso.beneficioId,
    titulo: 'Beneficio Usado',
    descripcion: 'Beneficio utilizado anteriormente',
    descuento: 0,
    tipo: 'porcentaje' as const,
    comercioNombre: 'Comercio',
    categoria: 'General',
    fechaFin: beneficioUso.fechaUso
  } : null);

  if (!data) return null;

  const isDisponible = tipo === 'disponible';
  const fechaUso = beneficioUso?.fechaUso?.toDate();
  const fechaVencimiento = beneficio?.fechaFin?.toDate();

  const getDescuentoText = () => {
    if (data.tipo === 'porcentaje') {
      return `${data.descuento}% OFF`;
    } else if (data.tipo === 'monto_fijo') {
      return `$${data.descuento} OFF`;
    } else {
      return 'Producto Gratis';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Restaurantes': 'bg-red-100 text-red-800 border-red-200',
      'Retail': 'bg-blue-100 text-blue-800 border-blue-200',
      'Servicios': 'bg-green-100 text-green-800 border-green-200',
      'Entretenimiento': 'bg-purple-100 text-purple-800 border-purple-200',
      'General': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[categoria] || colors['General'];
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className={cn(
          'bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden',
          isDisponible 
            ? 'border-gray-200 hover:shadow-md hover:border-indigo-200' 
            : 'border-gray-200 bg-gray-50'
        )}
      >
        {/* Header */}
        <div className={cn(
          'p-4 border-b',
          isDisponible 
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100' 
            : 'bg-gray-100 border-gray-200'
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                isDisponible 
                  ? 'bg-white shadow-sm' 
                  : 'bg-gray-200'
              )}>
                <Store size={20} className={isDisponible ? 'text-indigo-600' : 'text-gray-500'} />
              </div>
              <div>
                <h3 className={cn(
                  'font-semibold text-sm',
                  isDisponible ? 'text-gray-900' : 'text-gray-600'
                )}>
                  {data.comercioNombre}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium border',
                    getCategoriaColor(data.categoria)
                  )}>
                    {data.categoria}
                  </span>
                  {!isDisponible && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={12} />
                      Usado
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={cn(
              'px-3 py-2 rounded-xl font-bold text-sm',
              isDisponible 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                : 'bg-gray-300 text-gray-600'
            )}>
              {getDescuentoText()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className={cn(
            'font-semibold mb-2',
            isDisponible ? 'text-gray-900' : 'text-gray-600'
          )}>
            {data.titulo}
          </h4>
          
          <p className={cn(
            'text-sm mb-4 line-clamp-2',
            isDisponible ? 'text-gray-600' : 'text-gray-500'
          )}>
            {data.descripcion}
          </p>

          {/* Fecha info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {isDisponible && fechaVencimiento ? (
                <span>Vence: {fechaVencimiento.toLocaleDateString()}</span>
              ) : fechaUso ? (
                <span>Usado: {fechaUso.toLocaleDateString()}</span>
              ) : null}
            </div>
            {beneficioUso?.montoDescuento && (
              <div className="flex items-center gap-1 text-green-600">
                <Tag size={12} />
                <span>Ahorraste: ${beneficioUso.montoDescuento}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Eye size={14} />}
              onClick={() => setDetailModalOpen(true)}
              className="flex-1"
            >
              Ver Detalles
            </Button>
            
            {isDisponible && onUse && (
              <Button
                size="sm"
                onClick={() => onUse(data.id)}
                className="flex-1"
              >
                Usar Ahora
              </Button>
            )}
          </div>
        </div>

        {/* Nuevo badge */}
        {isDisponible && beneficio && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Nuevo
            </span>
          </div>
        )}
      </motion.div>

      {/* Modal de detalles */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{data.titulo}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Store size={24} className="text-indigo-600" />
              <div>
                <h4 className="font-semibold text-gray-900">{data.comercioNombre}</h4>
                <p className="text-sm text-gray-500">{data.categoria}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Descripción</h5>
              <p className="text-sm text-gray-600">{data.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Descuento</h5>
                <p className="text-lg font-bold text-emerald-600">{getDescuentoText()}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Estado</h5>
                <p className={cn(
                  'text-sm font-medium',
                  isDisponible ? 'text-green-600' : 'text-gray-600'
                )}>
                  {isDisponible ? 'Disponible' : 'Usado'}
                </p>
              </div>
            </div>

            {beneficio?.condiciones && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Condiciones</h5>
                <p className="text-sm text-gray-600">{beneficio.condiciones}</p>
              </div>
            )}

            {isDisponible && onUse && (
              <Button
                fullWidth
                onClick={() => {
                  onUse(data.id);
                  setDetailModalOpen(false);
                }}
              >
                Usar Este Beneficio
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
