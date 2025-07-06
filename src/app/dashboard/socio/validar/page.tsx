'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  QrCode,
  Zap, 
  Shield, 
  CheckCircle, 
  Info,
  Target,
  Award,
  Clock,
  History,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Eye,
  Gift,
  Star,
  Calendar,
  MapPin,
  Users,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { useAuth } from '@/hooks/useAuth';
import { ValidacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';
import { BeneficiosService } from '@/services/beneficios.service';
import { Beneficio } from '@/types/beneficio';

// Sidebar personalizado que maneja el logout
const SocioSidebarWithLogout: React.FC<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
}> = (props) => {
  return (
    <SocioSidebar
      open={props.open}
      onToggle={props.onToggle}
      onMenuClick={props.onMenuClick}
      onLogoutClick={props.onLogoutClick}
      activeSection={props.activeSection}
    />
  );
};

interface ValidationStats {
  validacionesHoy: number;
  validacionesExitosas: number;
  ahorroTotal: number;
  ultimaValidacion: Date | null;
  beneficiosDisponibles: number;
}

export default function SocioValidarPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  // Estados para el modal de logout
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Estados para validación
  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  
  // Estados para datos
  const [stats, setStats] = useState<ValidationStats>({
    validacionesHoy: 0,
    validacionesExitosas: 0,
    ahorroTotal: 0,
    ultimaValidacion: null,
    beneficiosDisponibles: 0
  });
  const [recentValidations, setRecentValidations] = useState<any[]>([]);
  const [beneficiosDisponibles, setBeneficiosDisponibles] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    if (user && user.role === 'socio') {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    if (!user || !user.asociacionId) return;
    
    try {
      setLoading(true);
      
      // Cargar beneficios disponibles
      const beneficios = await BeneficiosService.getBeneficiosDisponibles(
        user.uid, 
        user.asociacionId
      );
      setBeneficiosDisponibles(beneficios);

      // Cargar historial de validaciones
      const historial = await ValidacionesService.getHistorialValidaciones(user.uid);
      setRecentValidations(historial.slice(0, 5)); // Solo las últimas 5

      // Calcular estadísticas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const validacionesHoy = historial.filter(v => {
        const validationDate = v.fechaHora.toDate();
        validationDate.setHours(0, 0, 0, 0);
        return validationDate.getTime() === today.getTime();
      }).length;

      const validacionesExitosas = historial.filter(v => v.resultado === 'habilitado').length;
      
      // Calcular ahorro total (esto dependería de tener datos de montos)
      const ahorroTotal = historial
        .filter(v => v.resultado === 'habilitado')
        .reduce((total, v) => total + (v.montoDescuento || 0), 0);

      const ultimaValidacion = historial.length > 0 ? historial[0].fechaHora.toDate() : null;

      setStats({
        validacionesHoy,
        validacionesExitosas,
        ahorroTotal,
        ultimaValidacion,
        beneficiosDisponibles: beneficios.length
      });

    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleQRScan = async (qrData: string) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }

    setScannerLoading(true);
    try {
      const parsedData = ValidacionesService.parseQRData(qrData);
      if (!parsedData) {
        throw new Error('Código QR inválido');
      }

      const result = await ValidacionesService.validarAcceso({
        socioId: user.uid,
        comercioId: parsedData.comercioId,
        beneficioId: parsedData.beneficioId
      });

      setValidationResult(result);
      setValidationModalOpen(true);
      
      if (result.resultado === 'habilitado') {
        toast.success('¡Validación exitosa!');
        // Recargar datos después de una validación exitosa
        loadInitialData();
      } else {
        toast.error('Validación fallida');
      }
    } catch (error) {
      console.error('Error validating QR:', error);
      toast.error(error instanceof Error ? error.message : 'Error al validar el código QR');
    } finally {
      setScannerLoading(false);
    }
  };

  const handleValidationModalClose = () => {
    setValidationModalOpen(false);
    setValidationResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case 'habilitado':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'no_habilitado':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'vencido':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <Info className="text-gray-500" size={16} />;
    }
  };

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case 'habilitado':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'no_habilitado':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'vencido':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        activeSection="validar"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={24} className="text-white animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando datos...</h3>
              <p className="text-gray-500">Preparando tu experiencia de validación</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        activeSection="validar"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <QrCode size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Validar Beneficios</h1>
                <p className="text-gray-600">Escanea códigos QR para acceder a tus beneficios</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.validacionesHoy}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Exitosas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.validacionesExitosas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Ahorro Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.ahorroTotal)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Gift size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.beneficiosDisponibles}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scanner Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Scan size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Escanear Código QR</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Apunta tu cámara al código QR del comercio para validar y acceder a tus beneficios
                  </p>
                </div>

                <div className="max-w-sm mx-auto">
                  <QRScannerButton
                    onScan={handleQRScan}
                    loading={scannerLoading}
                  />
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Info size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">¿Cómo funciona?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Solicita al comercio que muestre su código QR</li>
                        <li>• Presiona "Escanear Código QR" y permite el acceso a la cámara</li>
                        <li>• Apunta la cámara al código QR hasta que se detecte</li>
                        <li>• ¡Disfruta tu beneficio validado!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Recent Validations */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <History size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Validaciones Recientes</h3>
                </div>

                {recentValidations.length > 0 ? (
                  <div className="space-y-3">
                    {recentValidations.map((validation, index) => (
                      <motion.div
                        key={validation.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`p-3 rounded-xl border ${getResultColor(validation.resultado)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getResultIcon(validation.resultado)}
                            <span className="font-medium text-sm">
                              {validation.comercioNombre || 'Comercio'}
                            </span>
                          </div>
                          <span className="text-xs opacity-75">
                            {formatDate(validation.fechaHora.toDate())}
                          </span>
                        </div>
                        {validation.beneficioTitulo && (
                          <p className="text-xs opacity-75">{validation.beneficioTitulo}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <History size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No hay validaciones recientes</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Resumen</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Última validación</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.ultimaValidacion 
                        ? formatDate(stats.ultimaValidacion)
                        : 'Nunca'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasa de éxito</span>
                    <span className="text-sm font-medium text-gray-900">
                      {recentValidations.length > 0 
                        ? Math.round((stats.validacionesExitosas / recentValidations.length) * 100)
                        : 0
                      }%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beneficios activos</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.beneficiosDisponibles}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={20} />
                  <h3 className="font-semibold">Acciones Rápidas</h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/dashboard/socio/beneficios')}
                    className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Gift size={16} />
                      <span className="text-sm font-medium">Ver Beneficios</span>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/socio/perfil')}
                    className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={16} />
                      <span className="text-sm font-medium">Mi Perfil</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* Modal de Resultado de Validación */}
      <ValidationResultModal
        open={validationModalOpen}
        onClose={handleValidationModalClose}
        result={validationResult}
      />
    </>
  );
}