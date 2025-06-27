'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle, Gift, User } from 'lucide-react';
import { ValidacionResponse } from '@/types/validacion';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ValidationResultModalProps {
  open: boolean;
  onClose: () => void;
  result: ValidacionResponse | null;
}

export const ValidationResultModal: React.FC<ValidationResultModalProps> = ({
  open,
  onClose,
  result
}) => {
  if (!result) return null;

  const getResultConfig = () => {
    switch (result.resultado) {
      case 'habilitado':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: '¡Validación Exitosa!',
          message: 'Puedes usar tu beneficio',
          buttonText: 'Continuar',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'no_habilitado':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Acceso Denegado',
          message: result.motivo || 'No tienes acceso a este beneficio',
          buttonText: 'Entendido',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'vencido':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Beneficio Vencido',
          message: result.motivo || 'Este beneficio ya no está disponible',
          buttonText: 'Ver Otros',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'suspendido':
        return {
          icon: AlertTriangle,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Cuenta Suspendida',
          message: result.motivo || 'Tu cuenta está temporalmente suspendida',
          buttonText: 'Contactar Soporte',
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        };
    }
  };

  const config = getResultConfig();
  const IconComponent = config.icon;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className={cn('p-6 text-center', config.bgColor, config.borderColor, 'border-t-4')}>
          {/* Icono animado */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mb-4"
          >
            <div className={cn('w-20 h-20 mx-auto rounded-full flex items-center justify-center', config.bgColor)}>
              <IconComponent size={40} className={config.color} />
            </div>
          </motion.div>

          {/* Título y mensaje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {config.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {config.message}
            </p>
          </motion.div>

          {/* Información del beneficio si está habilitado */}
          {result.resultado === 'habilitado' && result.beneficio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 mb-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Gift size={20} className="text-indigo-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{result.beneficio.titulo}</h4>
                  <p className="text-sm text-gray-500">{result.beneficio.tipo}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-3">
                <p className="text-sm font-medium">Tu descuento</p>
                <p className="text-2xl font-bold">
                  {result.beneficio.tipo === 'porcentaje' 
                    ? `${result.beneficio.descuento}% OFF`
                    : `$${result.beneficio.descuento} OFF`
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* Información del socio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 mb-6 border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">{result.socio.nombre}</h4>
                <p className="text-sm text-gray-500">
                  Estado: <span className={cn(
                    'font-medium',
                    result.socio.estado === 'activo' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {result.socio.estado}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botón de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onClose}
              className={cn('w-full', config.buttonColor)}
            >
              {config.buttonText}
            </Button>
          </motion.div>

          {/* Información adicional para casos de error */}
          {result.resultado !== 'habilitado' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-3 bg-gray-100 rounded-lg"
            >
              <p className="text-xs text-gray-600">
                {result.resultado === 'no_habilitado' && 
                  'Contacta a tu asociación para regularizar tu situación.'
                }
                {result.resultado === 'vencido' && 
                  'Busca otros beneficios disponibles en tu cuenta.'
                }
                {result.resultado === 'suspendido' && 
                  'Ponte en contacto con soporte para resolver esta situación.'
                }
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
