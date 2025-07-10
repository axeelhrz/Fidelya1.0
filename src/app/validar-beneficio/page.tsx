'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { qrValidationService, QRValidationResponse } from '@/services/qr-validation.service';
import { 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Gift,
  Store,
  User,
  Calendar,
  Percent,
  ArrowRight,
  Scan
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ValidarBeneficioPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const comercioId = searchParams.get('comercio');
  
  const [validationResult, setValidationResult] = useState<QRValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [montoCompra, setMontoCompra] = useState<string>('');

  const handleQRValidation = React.useCallback(async () => {
    if (!comercioId || !user) return;

    setLoading(true);
    try {
      const qrData = `https://fidelya.app/validar-beneficio?comercio=${comercioId}`;
      
      const result = await qrValidationService.validateQRCode({
        qrData,
        socioId: user.uid,
        location: await getCurrentLocation(),
        device: getDeviceInfo(),
        userAgent: navigator.userAgent,
      });

      setValidationResult(result);
      
      if (result.success) {
        toast.success('¡Validación exitosa! Beneficios disponibles.');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error validating QR:', error);
      toast.error('Error al validar el código QR');
    } finally {
      setLoading(false);
    }
  }, [comercioId, user]);

  useEffect(() => {
    if (comercioId && user?.role === 'socio') {
      handleQRValidation();
    }
  }, [comercioId, user, handleQRValidation]);

  const handleUseBenefit = async (beneficioId: string) => {
    if (!validationResult?.data?.validacion.id) return;

    setLoading(true);
    try {
      const monto = parseFloat(montoCompra) || 0;
      
      const result = await qrValidationService.useBenefit(
        validationResult.data.validacion.id,
        beneficioId,
        monto
      );

      if (result.success) {
        toast.success('¡Beneficio aplicado exitosamente!');
        // Refresh validation to show updated state
        await handleQRValidation();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error using benefit:', error);
      toast.error('Error al aplicar el beneficio');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number } | undefined> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => resolve(undefined)
        );
      } else {
        resolve(undefined);
      }
    });
  };

  const getDeviceInfo = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'Mac';
    return 'Otro';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión como socio para validar beneficios.
          </p>
          <Button
            onClick={() => window.location.href = '/auth/login'}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'socio') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Solo los socios pueden validar beneficios mediante código QR.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scan className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Validando QR...
          </h2>
          <p className="text-gray-600">
            Verificando tu acceso a beneficios
          </p>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Código QR Requerido
          </h2>
          <p className="text-gray-600 mb-6">
            Escanea un código QR válido para acceder a los beneficios.
          </p>
        </div>
      </div>
    );
  }

  if (!validationResult.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Validación Fallida
          </h2>
          <p className="text-gray-600 mb-6">
            {validationResult.message}
          </p>
          <Button
            onClick={handleQRValidation}
            variant="outline"
            className="w-full"
          >
            Intentar Nuevamente
          </Button>
        </div>
      </div>
    );
  }

  const { comercio, beneficios, socio, validacion } = validationResult.data!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ¡Validación Exitosa!
                </h1>
                <p className="text-gray-600">
                  Código: {validacion.codigoValidacion}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Validado el</div>
              <div className="font-medium text-gray-900">
                {validacion.fechaValidacion.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Comercio Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {comercio.nombre}
              </h3>
              <p className="text-gray-600">{comercio.categoria}</p>
              {comercio.direccion && (
                <p className="text-sm text-gray-500">{comercio.direccion}</p>
              )}
            </div>
          </div>

          {/* Socio Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{socio.nombre}</div>
                <div className="text-sm text-gray-600">
                  {socio.numeroSocio && `Socio #${socio.numeroSocio} • `}
                  Estado: {socio.estadoMembresia}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Beneficios Disponibles */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Beneficios Disponibles
              </h2>
              <p className="text-gray-600">
                {beneficios.length} beneficio{beneficios.length !== 1 ? 's' : ''} disponible{beneficios.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Monto de Compra Input */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto de tu compra (opcional)
            </label>
            <input
              type="number"
              value={montoCompra}
              onChange={(e) => setMontoCompra(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa el monto para calcular el descuento exacto
            </p>
          </div>

          {/* Lista de Beneficios */}
          <div className="space-y-4">
            {beneficios.map((beneficio) => (
              <motion.div
                key={beneficio.id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedBenefit === beneficio.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedBenefit(beneficio.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {beneficio.titulo}
                      </h3>
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                        <Percent className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600">
                          {beneficio.descuento}
                          {beneficio.tipo === 'descuento_porcentaje' ? '%' : ''}
                          {beneficio.tipo === 'descuento_fijo' ? ' OFF' : ''}
                          {beneficio.tipo === '2x1' ? ' 2x1' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{beneficio.descripcion}</p>
                    
                    {beneficio.condiciones && (
                      <p className="text-sm text-gray-500 mb-3">
                        <strong>Condiciones:</strong> {beneficio.condiciones}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Válido hasta {beneficio.fechaFin.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Cálculo de descuento */}
                    {montoCompra && parseFloat(montoCompra) > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-700">
                          <div className="flex justify-between">
                            <span>Monto original:</span>
                            <span>{formatCurrency(parseFloat(montoCompra))}</span>
                          </div>
                          <div className="flex justify-between text-green-600 font-medium">
                            <span>Descuento:</span>
                            <span>
                              -{formatCurrency(
                                beneficio.tipo === 'descuento_porcentaje'
                                  ? (parseFloat(montoCompra) * beneficio.descuento) / 100
                                  : beneficio.tipo === 'descuento_fijo'
                                  ? Math.min(beneficio.descuento, parseFloat(montoCompra))
                                  : beneficio.tipo === '2x1'
                                  ? parseFloat(montoCompra) / 2
                                  : 0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                            <span>Total a pagar:</span>
                            <span>
                              {formatCurrency(
                                parseFloat(montoCompra) - (
                                  beneficio.tipo === 'descuento_porcentaje'
                                    ? (parseFloat(montoCompra) * beneficio.descuento) / 100
                                    : beneficio.tipo === 'descuento_fijo'
                                    ? Math.min(beneficio.descuento, parseFloat(montoCompra))
                                    : beneficio.tipo === '2x1'
                                    ? parseFloat(montoCompra) / 2
                                    : 0
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedBenefit === beneficio.id && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={() => handleUseBenefit(beneficio.id)}
                      loading={loading}
                      className="w-full"
                      leftIcon={<ArrowRight size={16} />}
                    >
                      Usar Este Beneficio
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {beneficios.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay beneficios disponibles
              </h3>
              <p className="text-gray-600">
                Este comercio no tiene beneficios activos para tu asociación en este momento.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}