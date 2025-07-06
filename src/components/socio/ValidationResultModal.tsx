'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Gift, 
  User,
  Store,
  Calendar,
  Share2,
  Copy,
  Download,
  Star,
  TrendingUp,
  Award,
  Info
} from 'lucide-react';
import { ValidacionResponse } from '@/types/validacion';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
          color: '#10b981',
          bgColor: 'from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          title: '¡Validación Exitosa!',
          message: 'Tu beneficio ha sido validado correctamente',
          buttonText: 'Continuar Comprando',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
        };
      case 'no_habilitado':
        return {
          icon: XCircle,
          color: '#ef4444',
          bgColor: 'from-red-50 to-rose-50',
          borderColor: 'border-red-200',
          title: 'Acceso Denegado',
          message: result.motivo || 'No tienes acceso a este beneficio',
          buttonText: 'Entendido',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'vencido':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: 'from-amber-50 to-yellow-50',
          borderColor: 'border-amber-200',
          title: 'Beneficio Vencido',
          message: result.motivo || 'Este beneficio ya no está disponible',
          buttonText: 'Ver Otros Beneficios',
          buttonColor: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'suspendido':
        return {
          icon: AlertTriangle,
          color: '#f97316',
          bgColor: 'from-orange-50 to-amber-50',
          borderColor: 'border-orange-200',
          title: 'Cuenta Suspendida',
          message: result.motivo || 'Tu cuenta está temporalmente suspendida',
          buttonText: 'Contactar Soporte',
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        };
      default:
        return {
          icon: Info,
          color: '#6b7280',
          bgColor: 'from-gray-50 to-slate-50',
          borderColor: 'border-gray-200',
          title: 'Resultado de Validación',
          message: result.motivo || 'Estado de validación desconocido',
          buttonText: 'Cerrar',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const config = getResultConfig();
  const IconComponent = config.icon;

  const getDiscountText = (beneficio: ValidacionResponse['beneficio']) => {
    if (!beneficio) return 'DESCUENTO';
    switch (beneficio.tipo) {
      case 'porcentaje':
        return `${beneficio.descuento}%`;
      case 'monto_fijo':
        return `$${beneficio.descuento}`;
      case 'producto_gratis':
        return 'GRATIS';
      default:
        return 'DESCUENTO';
    }
  };

  const getDiscountLabel = (beneficio: ValidacionResponse['beneficio']) => {
    if (!beneficio) return 'Beneficio';
    switch (beneficio.tipo) {
      case 'porcentaje':
        return 'Descuento';
      case 'monto_fijo':
        return 'Descuento Fijo';
      case 'producto_gratis':
        return 'Producto Gratis';
      default:
        return 'Beneficio';
    }
  };

  const handleShare = async () => {
    if (navigator.share && result.resultado === 'habilitado') {
      try {
        await navigator.share({
          title: '¡Beneficio Validado!',
          text: `He validado un beneficio en ${result.beneficio?.comercioNombre}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCopyCode = async () => {
    if (result.validacionId) {
      try {
        await navigator.clipboard.writeText(result.validacionId);
        // You could show a toast here
      } catch (error) {
        console.log('Error copying:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose}>
          <DialogContent className="max-w-lg p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-3xl overflow-hidden"
            >
              {/* Header with gradient background */}
              <div className={`bg-gradient-to-r ${config.bgColor} ${config.borderColor} border-b p-8 text-center relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.1
                  }}
                  className="relative z-10"
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={{ 
                      backgroundColor: config.color,
                      boxShadow: `0 12px 32px ${config.color}40`
                    }}
                  >
                    <IconComponent size={32} className="text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 mb-3 relative z-10"
                >
                  {config.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-lg relative z-10"
                >
                  {config.message}
                </motion.p>
              </div>

              <div className="p-8">
                {/* Benefit Details for successful validation */}
                {result.resultado === 'habilitado' && result.beneficio && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                  >
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Gift size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{result.beneficio.titulo}</h3>
                          <p className="text-gray-600">{result.beneficio.comercioNombre}</p>
                        </div>
                      </div>
                      
                      {/* Discount Badge */}
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-4 text-center mb-4">
                        <div className="text-sm font-medium opacity-90 mb-1">
                          {getDiscountLabel(result.beneficio)}
                        </div>
                        <div className="text-3xl font-bold">
                          {getDiscountText(result.beneficio)}
                          {result.beneficio.tipo !== 'producto_gratis' && (
                            <span className="text-lg ml-1">OFF</span>
                          )}
                        </div>
                      </div>

                      {/* Benefit Description */}
                      {result.beneficio.descripcion && (
                        <div className="bg-white rounded-xl p-4 border border-violet-100 mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {result.beneficio.descripcion}
                          </p>
                        </div>
                      )}

                      {/* Benefit Meta Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-3 border border-violet-100 text-center">
                          <Calendar size={16} className="text-violet-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-500 mb-1">Válido hasta</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {result.beneficio.fechaFin 
                              ? format(result.beneficio.fechaFin, 'dd/MM/yyyy', { locale: es })
                              : 'Sin límite'
                            }
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 border border-violet-100 text-center">
                          <Store size={16} className="text-violet-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-500 mb-1">Comercio</div>
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {result.beneficio.comercioNombre}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: result.resultado === 'habilitado' ? 0.6 : 0.4 }}
                  className="mb-6"
                >
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{result.socio.nombre}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Estado:</span>
                          <span className={`
                            text-xs font-bold px-2 py-1 rounded-full
                            ${result.socio.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                            }
                          `}>
                            {result.socio.estado.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: result.resultado === 'habilitado' ? 0.7 : 0.5 }}
                  className="flex gap-3"
                >
                  <Button
                    onClick={onClose}
                    className={`flex-1 ${config.buttonColor}`}
                    size="lg"
                  >
                    {config.buttonText}
                  </Button>
                  
                  {result.resultado === 'habilitado' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        leftIcon={<Share2 size={16} />}
                        size="lg"
                        className="px-4"
                      >
                        <span className="sr-only">Compartir</span>
                      </Button>
                      
                      {result.validacionId && (
                        <Button
                          variant="outline"
                          onClick={handleCopyCode}
                          leftIcon={<Copy size={16} />}
                          size="lg"
                          className="px-4"
                        >
                          <span className="sr-only">Copiar código</span>
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>

                {/* Additional Info for failed validations */}
                {result.resultado !== 'habilitado' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">¿Qué puedes hacer?</h4>
                        <div className="text-sm text-blue-800">
                          {result.resultado === 'no_habilitado' && (
                            <p>Contacta a tu asociación para regularizar tu situación y acceder a este beneficio.</p>
                          )}
                          {result.resultado === 'vencido' && (
                            <p>Este beneficio ha expirado. Busca otros beneficios disponibles en tu cuenta.</p>
                          )}
                          {result.resultado === 'suspendido' && (
                            <p>Tu cuenta está temporalmente suspendida. Ponte en contacto con soporte para resolver esta situación.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Validation Timestamp */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Validación realizada el {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
                    {result.validacionId && (
                      <span className="block mt-1">
                        ID: {result.validacionId.slice(-8).toUpperCase()}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};