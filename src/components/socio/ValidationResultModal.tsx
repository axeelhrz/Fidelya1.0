'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Gift,
  User,
  Calendar,
  DollarSign,
  X,
  Share2,
  Download
} from 'lucide-react';
import { ValidacionResponse } from '@/services/validaciones.service';

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
  if (!open || !result) return null;

  const isSuccess = result.success;
  const data = result.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  interface Beneficio {
    tipo: 'porcentaje' | 'monto_fijo' | 'producto_gratis' | string;
    descuento: number;
    titulo?: string;
    descripcion?: string;
    condiciones?: string;
  }

  const formatDiscount = (beneficio: Beneficio) => {
    switch (beneficio?.tipo) {
      case 'porcentaje':
        return `${beneficio.descuento}% de descuento`;
      case 'monto_fijo':
        return `${formatCurrency(beneficio.descuento)} de descuento`;
      case 'producto_gratis':
        return 'Producto gratis';
      default:
        return 'Beneficio especial';
    }
  };

  const handleShare = async () => {
    if (!data) return;

    const shareData = {
      title: '¡Beneficio validado en Fidelya!',
      text: `Acabo de usar un beneficio en ${data.comercio.nombre}: ${data.beneficio ? formatDiscount(data.beneficio) : ''}`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text} - ${shareData.url}`
        );
        // You could show a toast here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownloadReceipt = () => {
    if (!data) return;

    const receiptContent = `
FIDELYA - COMPROBANTE DE BENEFICIO

Comercio: ${data.comercio.nombre}
Beneficio: ${data.beneficio?.titulo}
Descuento: ${data.beneficio ? formatDiscount(data.beneficio) : ''}
Fecha: ${data.validacion.fechaValidacion.toLocaleString('es-ES')}
Código: ${data.validacion.codigoValidacion}
Socio: ${data.socio.nombre} (#${data.socio.numeroSocio})

¡Gracias por usar Fidelya!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fidelya-beneficio-${data.validacion.codigoValidacion}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            {/* Header */}
            <div className={`px-6 pt-6 pb-4 ${
              isSuccess 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50' 
                : 'bg-gradient-to-r from-red-50 to-orange-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSuccess ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isSuccess ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isSuccess ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {isSuccess ? '¡Beneficio Validado!' : 'Validación Fallida'}
                    </h3>
                    <p className={`text-sm ${
                      isSuccess ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {isSuccess && data ? (
                <div className="space-y-6">
                  {/* Comercio Info */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Image
                          src={data.comercio.logo || '/placeholder.png'}
                          alt={data.comercio.nombre}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{data.comercio.nombre}</h4>
                      <p className="text-sm text-gray-600">{data.comercio.categoria}</p>
                      {data.comercio.direccion && (
                        <p className="text-xs text-gray-500">{data.comercio.direccion}</p>
                      )}
                    </div>
                  </div>

                  {/* Beneficio Info */}
                  {data.beneficio && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Gift className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1">
                            {data.beneficio.titulo}
                          </h4>
                          <p className="text-sm text-green-800 mb-2">
                            {formatDiscount(data.beneficio)}
                          </p>
                          {data.beneficio.descripcion && (
                            <p className="text-xs text-green-700 mb-2">
                              {data.beneficio.descripcion}
                            </p>
                          )}
                          {data.beneficio.condiciones && (
                            <div className="mt-3 p-2 bg-green-100 rounded-lg">
                              <p className="text-xs text-green-800">
                                <strong>Condiciones:</strong> {data.beneficio.condiciones}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validation Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">Fecha</span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {data.validacion.fechaValidacion.toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {data.validacion.fechaValidacion.toLocaleTimeString('es-ES')}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">Socio</span>
                      </div>
                      <p className="text-sm text-gray-900">{data.socio.nombre}</p>
                      <p className="text-xs text-gray-600">#{data.socio.numeroSocio}</p>
                    </div>
                  </div>

                  {/* Validation Code */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Código de Validación
                      </p>
                      <div className="font-mono text-lg font-bold text-blue-800 bg-white px-4 py-2 rounded-lg border border-blue-300">
                        {data.validacion.codigoValidacion}
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Presenta este código al comercio si es necesario
                      </p>
                    </div>
                  </div>

                  {/* Savings Info */}
                  {data.validacion.montoDescuento > 0 && (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-center space-x-2">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-900">
                          Ahorro estimado: {formatCurrency(data.validacion.montoDescuento)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Error Content */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-700 mb-4">{result.message}</p>
                  
                  {result.error && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">{result.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4">
              {isSuccess && data ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir
                    </button>
                    
                    <button
                      onClick={handleDownloadReceipt}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </button>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    ¡Perfecto!
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};