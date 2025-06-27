'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { ValidacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Shield, CheckCircle, Info } from 'lucide-react';

export default function SocioValidarPage() {
  const { user } = useAuth();
  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQRScan = async (qrData: string) => {
    setLoading(true);
    try {
      const parsedData = ValidacionesService.parseQRData(qrData);
      if (!parsedData) {
        throw new Error('Código QR inválido');
      }

      const result = await ValidacionesService.validarAcceso({
        socioId: user?.uid || '',
        comercioId: parsedData.comercioId,
        beneficioId: parsedData.beneficioId
      });

      setValidationResult(result);
      setValidationModalOpen(true);
    } catch (error) {
      console.error('Error validating QR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardLayout
        activeSection="validar"
        sidebarComponent={SocioSidebar}
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Validar Beneficio</h1>
            <p className="text-gray-600">
              Escanea el código QR del comercio para acceder a tus descuentos y ofertas especiales.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Tarjeta principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={40} className="text-white" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ¿Listo para ahorrar?
              </h2>
              
              <p className="text-gray-600 mb-8">
                Solicita al comercio que muestre su código QR y escanéalo para validar tu acceso a los beneficios disponibles.
              </p>

              <QRScannerButton onScan={handleQRScan} loading={loading} />
            </motion.div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Seguro</h3>
                <p className="text-sm text-gray-600">
                  Todas las validaciones son seguras y están encriptadas
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instantáneo</h3>
                <p className="text-sm text-gray-600">
                  La validación se procesa en tiempo real
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Info size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fácil</h3>
                <p className="text-sm text-gray-600">
                  Solo escanea y listo, sin complicaciones
                </p>
              </motion.div>
            </div>

            {/* Instrucciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <h3 className="font-semibold text-blue-900 mb-4">¿Cómo funciona?</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <p>Dirígete al comercio afiliado donde quieres usar tu beneficio</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <p>Solicita al personal que muestre el código QR del establecimiento</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <p>Escanea el código con el botón de arriba y ¡listo!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>

      <ValidationResultModal
        open={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        result={validationResult}
      />
    </>
  );
}
