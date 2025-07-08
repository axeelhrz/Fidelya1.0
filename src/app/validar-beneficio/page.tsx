'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  AlertCircle, 
  ArrowRight, 
  Smartphone,
  ExternalLink,
  User,
  Store,
  Gift,
  Clock,
  Shield
} from 'lucide-react';
import { ComercioService } from '@/services/comercio.service';
import { BeneficiosService } from '@/services/beneficios.service';
import { Comercio } from '@/types/comercio';
import { Beneficio } from '@/types/beneficio';

interface ValidationPageProps {
  comercioId: string;
  beneficioId?: string;
}

const ValidationContent: React.FC<ValidationPageProps> = ({ comercioId, beneficioId }) => {
  const router = useRouter();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [beneficio, setBeneficio] = useState<Beneficio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate comercio
        const isValidComercio = await ComercioService.validateComercio(comercioId);
        if (!isValidComercio) {
          setError('Comercio no encontrado o no disponible');
          return;
        }

        // Get comercio data
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const comercioDocRef = doc(db, 'comercios', comercioId);
        const comercioRef = await getDoc(comercioDocRef);
        
        if (comercioRef.exists()) {
          setComercio({ uid: comercioRef.id, ...comercioRef.data() } as Comercio);
        }

        // Get beneficio data if specified
        if (beneficioId) {
          const beneficioData = await BeneficiosService.getBeneficioById(beneficioId);
          if (beneficioData) {
            setBeneficio(beneficioData);
          }
        }
      } catch (error) {
        console.error('Error loading validation data:', error);
        setError('Error al cargar los datos de validación');
      } finally {
        setLoading(false);
      }
    };

    if (comercioId) {
      loadData();
    }
  }, [comercioId, beneficioId]);

  const handleLoginRedirect = () => {
    const returnUrl = encodeURIComponent(window.location.href);
    router.push(`/auth/login?returnUrl=${returnUrl}`);
  };

  const handleSocioRedirect = () => {
    // Generate the QR data that the socio scanner expects
    const qrData = ComercioService.generateQRValidationURL(comercioId, beneficioId);
    const encodedQrData = encodeURIComponent(qrData);
    router.push(`/dashboard/socio/validar?qr=${encodedQrData}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={32} className="text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando validación...</h2>
          <p className="text-gray-600">Verificando datos del comercio</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error de Validación</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Validación de Beneficio</h1>
          <p className="text-lg text-gray-600">
            Para acceder a este beneficio, necesitas iniciar sesión como socio
          </p>
        </motion.div>

        {/* Comercio Info */}
        {comercio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Store size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{comercio.nombreComercio}</h2>
                <p className="text-gray-600">{comercio.categoria}</p>
              </div>
            </div>
            
            {comercio.descripcion && (
              <p className="text-gray-700 mb-4">{comercio.descripcion}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {comercio.direccion && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Dirección:</span>
                  <span>{comercio.direccion}</span>
                </div>
              )}
              {comercio.telefono && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Teléfono:</span>
                  <span>{comercio.telefono}</span>
                </div>
              )}
              {comercio.horario && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span>{comercio.horario}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Beneficio Info */}
        {beneficio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Gift size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{beneficio.titulo}</h3>
                <p className="text-green-600 font-medium">
                  {beneficio.tipo === 'porcentaje' ? `${beneficio.descuento}% de descuento` : 
                   beneficio.tipo === 'monto_fijo' ? `$${beneficio.descuento} de descuento` :
                   'Beneficio especial'}
                </p>
              </div>
            </div>
            
            {beneficio.descripcion && (
              <p className="text-gray-700 mb-4">{beneficio.descripcion}</p>
            )}
            
            {beneficio.condiciones && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-gray-900 mb-2">Condiciones:</h4>
                <p className="text-sm text-gray-600">{beneficio.condiciones}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">¿Ya eres socio?</h3>
                <p className="text-gray-600">Inicia sesión para validar</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Si ya tienes una cuenta de socio, inicia sesión para acceder a este beneficio.
            </p>
            
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Iniciar Sesión
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Direct Access Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Smartphone size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Acceso Directo</h3>
                <p className="text-gray-600">Ir al validador</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Accede directamente al sistema de validación si ya estás autenticado.
            </p>
            
            <button
              onClick={handleSocioRedirect}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Validar Ahora
              <ExternalLink size={16} />
            </button>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">¿Cómo funciona?</h3>
          </div>
          
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold">1</span>
              </div>
              <p>Inicia sesión con tu cuenta de socio o accede directamente si ya estás autenticado</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold">2</span>
              </div>
              <p>El sistema validará automáticamente tu elegibilidad para este beneficio</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold">3</span>
              </div>
              <p>Una vez validado, podrás disfrutar del beneficio en el comercio</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-gray-500"
        >
          <p>¿No tienes cuenta? Contacta a tu asociación para registrarte como socio</p>
        </motion.div>
      </div>
    </div>
  );
};

const ValidationPageWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const comercioId = searchParams.get('comercio');
  const beneficioId = searchParams.get('beneficio') || undefined;

  if (!comercioId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Código QR Inválido</h1>
          <p className="text-gray-600 mb-6">
            El código QR escaneado no contiene la información necesaria para la validación.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return <ValidationContent comercioId={comercioId} beneficioId={beneficioId} />;
};

export default function ValidarBeneficioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={32} className="text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando...</h2>
          <p className="text-gray-600">Preparando validación</p>
        </motion.div>
      </div>
    }>
      <ValidationPageWrapper />
    </Suspense>
  );
}
