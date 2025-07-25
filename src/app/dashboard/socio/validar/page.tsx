'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  QrCode,
  Zap, 
  CheckCircle, 
  Info,
  Clock,
  History,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Gift,
  Users,
  Activity,
  Scan,
  Star,
  Target,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  UserCheck,
  Camera,
  Smartphone,
  Award,
  Flame,
  ChevronRight,
  Eye,
  BarChart3,
  Wallet,
  MapPin,
  Timer,
  Coins
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { useAuth } from '@/hooks/useAuth';
import { validacionesService as ValidacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';
import { BeneficiosService } from '@/services/beneficios.service';
import { Beneficio } from '@/types/beneficio';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

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
  rachaActual: number;
  promedioAhorro: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  change?: number;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const cardHoverVariants = {
  hover: { 
    y: -8, 
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: { scale: 0.98 }
};

// Enhanced Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  change, 
  subtitle, 
  onClick,
  trend = 'neutral'
}) => (
  <motion.div
    className={cn(
      "group relative overflow-hidden rounded-3xl p-6 border border-white/20 shadow-xl backdrop-blur-xl",
      "bg-gradient-to-br from-white/90 via-white/80 to-white/70",
      "hover:shadow-2xl transition-all duration-500",
      onClick && "cursor-pointer"
    )}
    variants={itemVariants}
    whileHover="hover"
    whileTap="tap"
    onClick={onClick}
  >
    {/* Animated background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
    
    {/* Floating particles effect */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
    </div>
    
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {change !== undefined && (
          <motion.div 
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm",
              trend === 'up' ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : 
              trend === 'down' ? "text-red-700 bg-red-50 border border-red-200" :
              "text-gray-700 bg-gray-50 border border-gray-200"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp size={12} className={cn(
              trend === 'up' ? "text-emerald-600" : 
              trend === 'down' ? "text-red-600 rotate-180" : 
              "text-gray-600"
            )} />
            {Math.abs(change)}%
          </motion.div>
        )}
      </div>
      
      <div className="space-y-2">
        <motion.div 
          className="text-3xl font-black text-gray-900 group-hover:text-gray-800 transition-colors"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.div>
        <div className="text-sm font-bold text-gray-700 group-hover:text-gray-800 transition-colors">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 font-medium">{subtitle}</div>
        )}
      </div>
      
      {onClick && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      )}
    </div>
  </motion.div>
);

// Quick Action Card Component
const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
}> = ({ title, description, icon, onClick, gradient }) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "group relative overflow-hidden rounded-2xl p-6 text-left w-full",
      "bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl",
      "border border-white/30 shadow-lg hover:shadow-xl",
      "transition-all duration-300"
    )}
    variants={itemVariants}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
    
    <div className="relative z-10 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
          {description}
        </p>
      </div>
      <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
    </div>
  </motion.button>
);

// Recent Validation Item Component
const RecentValidationItem: React.FC<{
  validation: ValidacionResponse;
  index: number;
}> = ({ validation, index }) => {
  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case 'habilitado':
        return <CheckCircle className="text-emerald-500" size={16} />;
      case 'no_habilitado':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'vencido':
        return <Clock className="text-amber-500" size={16} />;
      default:
        return <Info className="text-gray-500" size={16} />;
    }
  };

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case 'habilitado':
        return 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-900';
      case 'no_habilitado':
        return 'from-red-50 to-rose-50 border-red-200 text-red-900';
      case 'vencido':
        return 'from-amber-50 to-yellow-50 border-amber-200 text-amber-900';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200 text-gray-900';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className={cn(
        "p-4 rounded-2xl border bg-gradient-to-r transition-all duration-300 hover:shadow-md group",
        getResultColor(validation.resultado)
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getResultIcon(validation.resultado)}
          <span className="font-bold text-sm truncate max-w-[120px]">
            {validation.comercioNombre || 'Comercio'}
          </span>
        </div>
        <span className="text-xs opacity-75 font-medium">
          {validation.fechaHora && typeof (validation.fechaHora as Timestamp | { toDate?: () => Date }) !== 'string' && typeof (validation.fechaHora as Timestamp | { toDate?: () => Date }).toDate === 'function'
            ? formatDate((validation.fechaHora as Timestamp).toDate())
            : formatDate(new Date(validation.fechaHora as Date))
          }
        </span>
      </div>
      
      {validation.beneficioTitulo && (
        <p className="text-xs opacity-80 mb-2 font-medium truncate">
          {validation.beneficioTitulo}
        </p>
      )}
      
      {validation.montoDescuento && validation.resultado === 'habilitado' && (
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-emerald-600" />
          <p className="text-xs font-bold text-emerald-700">
            Ahorro: {formatCurrency(validation.montoDescuento)}
          </p>
        </div>
      )}
    </motion.div>
  );
};

const SocioValidarContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    beneficiosDisponibles: 0,
    rachaActual: 0,
    promedioAhorro: 0
  });
  const [recentValidations, setRecentValidations] = useState<ValidacionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales con manejo de errores mejorado
  const loadInitialData = useCallback(async () => {
    if (!user) {
      console.log('❌ Usuario no disponible');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔄 Cargando datos iniciales');
      setLoading(true);
      setError(null);
      
      // Cargar datos en paralelo con timeouts
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La carga de datos está tomando demasiado tiempo')), 15000)
      );

      const dataPromises = [
        BeneficiosService.obtenerBeneficiosDisponibles(user.uid, user.asociacionId)
          .catch(error => {
            console.warn('⚠️ Error cargando beneficios, usando datos por defecto:', error);
            return [];
          }),
        
        ValidacionesService.getHistorialValidaciones(user.uid)
          .then(result => result.validaciones)
          .catch(error => {
            console.warn('⚠️ Error cargando historial, usando datos por defecto:', error);
            return [];
          })
      ];

      const [beneficios, historial] = await Promise.race([
        Promise.all(dataPromises),
        timeoutPromise
      ]) as [Beneficio[], ValidacionResponse[]];

      console.log('✅ Datos cargados:', { 
        beneficios: beneficios.length, 
        historial: historial.length 
      });

      const typedHistorial = historial.map(v => ({
        ...v,
        resultado: v.resultado as 'habilitado' | 'no_habilitado' | 'vencido' | 'suspendido'
      }));

      setRecentValidations(typedHistorial.slice(0, 5));

      // Calcular estadísticas de forma segura
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const validacionesHoy = typedHistorial.filter(v => {
        try {
          const validationDateRaw = v.fechaHora ?? null;
          if (!validationDateRaw) return false;
          
          const validationDate =
            typeof validationDateRaw === 'object' &&
            validationDateRaw !== null &&
            typeof (validationDateRaw as { toDate?: () => Date }).toDate === 'function'
              ? (validationDateRaw as { toDate: () => Date }).toDate()
              : new Date(validationDateRaw as Date);
          validationDate.setHours(0, 0, 0, 0);
          return validationDate.getTime() === today.getTime();
        } catch {
          return false;
        }
      }).length;

      const validacionesExitosas = typedHistorial.filter(v => v.resultado === 'habilitado').length;
      
      const ahorroTotal = typedHistorial
        .filter(v => v.resultado === 'habilitado')
        .reduce((total, v) => total + (v.montoDescuento || 0), 0);

      const ultimaValidacion = typedHistorial.length > 0 && typedHistorial[0].fechaHora 
        ? (typeof (typedHistorial[0].fechaHora) === 'object' &&
            typedHistorial[0].fechaHora !== null &&
            'toDate' in typedHistorial[0].fechaHora &&
            typeof (typedHistorial[0].fechaHora as { toDate?: () => Date }).toDate === 'function'
            ? (typedHistorial[0].fechaHora as Timestamp).toDate()
            : new Date(typedHistorial[0].fechaHora as string | Date))
        : null;

      const rachaActual = calculateCurrentStreak(typedHistorial);
      const promedioAhorro = validacionesExitosas > 0 ? ahorroTotal / validacionesExitosas : 0;

      setStats({
        validacionesHoy,
        validacionesExitosas,
        ahorroTotal,
        ultimaValidacion,
        beneficiosDisponibles: beneficios.length,
        rachaActual,
        promedioAhorro
      });

    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
      setError(errorMessage);
      toast.error(errorMessage);
      
      setStats({
        validacionesHoy: 0,
        validacionesExitosas: 0,
        ahorroTotal: 0,
        ultimaValidacion: null,
        beneficiosDisponibles: 0,
        rachaActual: 0,
        promedioAhorro: 0
      });
      setRecentValidations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Función para calcular racha actual
  const calculateCurrentStreak = (validations: ValidacionResponse[]): number => {
    if (validations.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    const currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const hasValidationOnDate = validations.some(v => {
        try {
          const validationDateRaw = v.fechaHora;
          if (!validationDateRaw) return false;
          
          const validationDate = typeof validationDateRaw === 'object' &&
            validationDateRaw !== null &&
            typeof (validationDateRaw as { toDate?: () => Date }).toDate === 'function'
            ? (validationDateRaw as { toDate: () => Date }).toDate()
            : new Date(validationDateRaw as Date);
            
          return validationDate.toDateString() === currentDate.toDateString() && v.resultado === 'habilitado';
        } catch {
          return false;
        }
      });
      
      if (hasValidationOnDate) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  // QR Scan handler
  const handleQRScan = useCallback(
    async (qrData: string) => {
      if (!user) {
        toast.error('Usuario no autenticado');
        return;
      }

      setScannerLoading(true);
      try {
        console.log('🔍 Procesando QR escaneado:', qrData);
        
        const parsedData = ValidacionesService.parseQRData(qrData);
        if (!parsedData) {
          throw new Error('Código QR inválido o formato no reconocido');
        }

        console.log('✅ QR parseado correctamente:', parsedData);

        const result = await ValidacionesService.validarAcceso({
          socioId: user.uid,
          comercioId: parsedData.comercioId,
          beneficioId: parsedData.beneficioId,
          asociacionId: user.asociacionId
        });

        console.log('🎯 Resultado de validación:', result);

        const typedResult: ValidacionResponse = {
          ...result,
          resultado: ((result as unknown) as ValidacionResponse).resultado as 'habilitado' | 'no_habilitado' | 'vencido' | 'suspendido',
          socio: (result as unknown as ValidacionResponse).socio ?? (result as { data?: { socio?: ValidacionResponse['socio'] } }).data?.socio ?? null,
          fechaHora: (result as unknown as ValidacionResponse).fechaHora ?? (result as { data?: { validacion?: { fechaHora?: ValidacionResponse['fechaHora'] } } }).data?.validacion?.fechaHora ?? new Date(),
        };

        setValidationResult(typedResult);
        setValidationModalOpen(true);
        
        if (typedResult.resultado === 'habilitado') {
          toast.success('¡Validación exitosa! Beneficio activado');
          loadInitialData();
        } else {
          toast.error(`Validación fallida: ${typedResult.motivo || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error validating QR:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al validar el código QR';
        toast.error(errorMessage);
      } finally {
        setScannerLoading(false);
      }
    },
    [user, setScannerLoading, setValidationResult, setValidationModalOpen, loadInitialData]
  );

  // Handle QR from URL parameters
  useEffect(() => {
    const qrParam = searchParams.get('qr');
    if (qrParam && user) {
      try {
        const decodedQr = decodeURIComponent(qrParam);
        handleQRScan(decodedQr);
      } catch (error) {
        console.error('Error processing QR from URL:', error);
        toast.error('Error al procesar el código QR de la URL');
      }
    }
  }, [searchParams, user, handleQRScan]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user && user.role === 'socio') {
      loadInitialData();
    } else if (user && user.role !== 'socio') {
      console.log('❌ Usuario no es socio, redirigiendo...');
      router.push('/dashboard');
    }
  }, [user, loadInitialData, router]);

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

  const handleValidationModalClose = () => {
    setValidationModalOpen(false);
    setValidationResult(null);
    
    if (searchParams.get('qr')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('qr');
      router.replace(newUrl.pathname + newUrl.search);
    }
  };

  const handleRetry = () => {
    setError(null);
    loadInitialData();
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

  // Mostrar error si hay problemas
  if (error && !loading) {
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-100/30 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <AlertCircle size={40} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Error al cargar datos</h3>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <RefreshCw size={20} className="inline mr-3" />
                Reintentar
              </button>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mostrar loading
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
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-100/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-100/30 to-transparent rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-sky-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <RefreshCw size={40} className="text-white animate-spin" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Cargando datos...</h3>
              <p className="text-gray-600 text-lg">Preparando tu experiencia de validación</p>
              
              {/* Loading skeleton */}
              <div className="mt-8 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full animate-pulse mx-auto w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse mx-auto w-1/2" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse mx-auto w-2/3" />
              </div>
            </motion.div>
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
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 relative overflow-hidden">
          {/* Enhanced background decorations */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/40 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/40 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-50/20 to-blue-50/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating elements */}
          <div className="absolute top-20 right-20 w-4 h-4 bg-violet-400/60 rounded-full animate-bounce" />
          <div className="absolute top-40 left-16 w-3 h-3 bg-sky-400/60 rounded-full animate-ping" />
          <div className="absolute bottom-32 right-32 w-5 h-5 bg-purple-400/60 rounded-full animate-pulse" />
          <div className="absolute top-60 right-60 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />

          <motion.div
            className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Header */}
            <motion.div className="mb-8 lg:mb-12" variants={itemVariants}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-sky-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <QrCode size={32} className="text-white lg:w-10 lg:h-10" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-sky-600 via-violet-600 to-purple-700 bg-clip-text text-transparent mb-2 leading-tight">
                      Validar Beneficios
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-semibold max-w-2xl">
                      Escanea códigos QR para acceder a beneficios {user?.asociacionId ? 'de tu asociación y comercios afiliados' : 'públicos y directos'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced status indicator */}
              <motion.div 
                className={cn(
                  "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-xl border",
                  user?.asociacionId 
                    ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-800 border-blue-200/50' 
                    : 'bg-gradient-to-r from-emerald-50/80 to-green-50/80 text-emerald-800 border-emerald-200/50'
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {user?.asociacionId ? (
                  <>
                    <Users size={18} />
                    <span>Socio con Asociación</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </>
                ) : (
                  <>
                    <UserCheck size={18} />
                    <span>Socio Independiente</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Enhanced Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-8 lg:mb-12"
              variants={containerVariants}
            >
              <StatsCard
                title="Hoy"
                value={stats.validacionesHoy}
                icon={<Activity size={24} />}
                gradient="from-blue-500 to-indigo-600"
                subtitle="Validaciones"
                trend={stats.validacionesHoy > 0 ? 'up' : 'neutral'}
              />
              
              <StatsCard
                title="Exitosas"
                value={stats.validacionesExitosas}
                icon={<CheckCircle size={24} />}
                gradient="from-emerald-500 to-teal-600"
                subtitle="Total"
                trend="up"
              />
              
              <StatsCard
                title="Ahorro Total"
                value={formatCurrency(stats.ahorroTotal)}
                icon={<Wallet size={24} />}
                gradient="from-green-500 to-emerald-600"
                subtitle="Acumulado"
                trend="up"
              />
              
              <StatsCard
                title="Racha"
                value={`${stats.rachaActual}`}
                icon={<Flame size={24} />}
                gradient="from-orange-500 to-red-600"
                subtitle="Días consecutivos"
                trend={stats.rachaActual > 0 ? 'up' : 'neutral'}
              />
              
              <StatsCard
                title="Beneficios"
                value={stats.beneficiosDisponibles}
                icon={<Gift size={24} />}
                gradient="from-purple-500 to-pink-600"
                subtitle="Disponibles"
                onClick={() => router.push('/dashboard/socio/beneficios')}
              />
              
              <StatsCard
                title="Promedio"
                value={formatCurrency(stats.promedioAhorro)}
                icon={<Target size={24} />}
                gradient="from-indigo-500 to-purple-600"
                subtitle="Por validación"
              />
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Enhanced Scanner Section */}
              <motion.div
                className="xl:col-span-2 space-y-6 lg:space-y-8"
                variants={itemVariants}
              >
                {/* Main Scanner Card */}
                <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/30 shadow-2xl relative overflow-hidden">
                  {/* Card background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-violet-600/5" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200/20 to-transparent rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <motion.div 
                        className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-r from-sky-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Scan size={40} className="text-white lg:w-12 lg:h-12" />
                      </motion.div>
                      <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">Escanear Código QR</h2>
                      <p className="text-gray-600 max-w-md mx-auto text-base lg:text-lg leading-relaxed">
                        Apunta tu cámara al código QR del comercio para validar y acceder a tus beneficios {user?.asociacionId ? 'exclusivos' : 'disponibles'}
                      </p>
                    </div>

                    <div className="max-w-sm mx-auto mb-8">
                      <QRScannerButton
                        onScan={handleQRScan}
                        loading={scannerLoading}
                      />
                    </div>

                    {/* Enhanced Instructions */}
                    <div className="bg-gradient-to-r from-sky-50/80 to-violet-50/80 backdrop-blur-xl rounded-2xl p-6 border border-sky-200/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-200/30 to-transparent rounded-full blur-xl" />
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Info size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <Sparkles size={18} className="text-violet-600" />
                            ¿Cómo funciona?
                          </h3>
                          <ul className="text-sm text-gray-700 space-y-3">
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />
                              <span className="font-medium">Solicita al comercio que muestre su código QR</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0" />
                              <span className="font-medium">Presiona "Escanear Código QR" y permite el acceso a la cámara</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                              <span className="font-medium">Apunta la cámara al código QR hasta que se detecte</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0" />
                              <span className="font-medium">¡Disfruta tu beneficio validado!</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Actions */}
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6 lg:mb-8">
                      <Zap size={28} className="text-yellow-300" />
                      <h3 className="text-xl lg:text-2xl font-black">Acciones Rápidas</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <QuickActionCard
                        title="Ver Beneficios"
                        description="Explora todas las ofertas disponibles para ti"
                        icon={<Gift size={20} />}
                        onClick={() => router.push('/dashboard/socio/beneficios')}
                        gradient="from-emerald-500 to-teal-600"
                      />

                      <QuickActionCard
                        title="Mi Perfil"
                        description="Gestiona tu cuenta y configuración"
                        icon={<Users size={20} />}
                        onClick={() => router.push('/dashboard/socio/perfil')}
                        gradient="from-blue-500 to-indigo-600"
                      />

                      <QuickActionCard
                        title="Historial"
                        description="Revisa tus validaciones anteriores"
                        icon={<History size={20} />}
                        onClick={() => router.push('/dashboard/socio/historial')}
                        gradient="from-purple-500 to-pink-600"
                      />

                      <QuickActionCard
                        title="Estadísticas"
                        description="Analiza tu actividad y ahorros"
                        icon={<BarChart3 size={20} />}
                        onClick={() => router.push('/dashboard/socio')}
                        gradient="from-orange-500 to-red-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Sidebar */}
              <motion.div 
                className="space-y-6 lg:space-y-8"
                variants={itemVariants}
              >
                {/* Recent Validations */}
                <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <History size={22} className="text-gray-600" />
                      <h3 className="font-black text-gray-900 text-lg">Validaciones Recientes</h3>
                    </div>

                    {recentValidations.length > 0 ? (
                      <div className="space-y-3">
                        {recentValidations.map((validation, index) => (
                          <RecentValidationItem
                            key={validation.id || index}
                            validation={validation}
                            index={index}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                          <History size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-2 font-semibold">No hay validaciones recientes</p>
                        <p className="text-xs text-gray-400">¡Escanea tu primer QR para comenzar!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Quick Stats */}
                <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp size={22} className="text-gray-600" />
                      <h3 className="font-black text-gray-900 text-lg">Resumen</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-2xl backdrop-blur-sm border border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-sm font-bold text-gray-700">Última validación</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {stats.ultimaValidacion 
                            ? formatDate(stats.ultimaValidacion).split(' ')[0]
                            : 'Nunca'
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-2xl backdrop-blur-sm border border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <Target size={16} className="text-gray-500" />
                          <span className="text-sm font-bold text-gray-700">Tasa de éxito</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {recentValidations.length > 0 
                            ? Math.round((stats.validacionesExitosas / recentValidations.length) * 100)
                            : 0
                          }%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-2xl backdrop-blur-sm border border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <Shield size={16} className="text-gray-500" />
                          <span className="text-sm font-bold text-gray-700">Beneficios activos</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {stats.beneficiosDisponibles}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-2xl backdrop-blur-sm border border-gray-200/50">
                        <div className="flex items-center gap-3">
                          {user?.asociacionId ? <Users size={16} className="text-gray-500" /> : <UserCheck size={16} className="text-gray-500" />}
                          <span className="text-sm font-bold text-gray-700">Tipo de socio</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {user?.asociacionId ? 'Asociación' : 'Independiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Achievement Badge */}
                {stats.rachaActual > 0 && (
                  <motion.div 
                    className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-300/30 to-transparent rounded-full blur-2xl" />
                    
                    <div className="relative z-10 text-center">
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Award size={32} className="text-amber-800" />
                      </motion.div>
                      <h3 className="font-black text-xl mb-3">¡Racha Activa!</h3>
                      <p className="text-sm opacity-90 mb-4 font-semibold">
                        Llevas <span className="text-2xl font-black">{stats.rachaActual}</span> días consecutivos validando beneficios
                      </p>
                      <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm border border-white/30">
                        <span className="text-xs font-black">¡Sigue así para mantener tu racha!</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
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
        result={
          validationResult
            ? {
                ...validationResult,
                success: (validationResult as { success?: boolean }).success ?? true,
                message: (validationResult as { message?: string }).message ?? '',
              }
            : null
        }
      />
    </>
  );
};

export default function SocioValidarPage() {
  return (
    <Suspense fallback={
      <DashboardLayout
        activeSection="validar"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={() => {}}
          />
        )}
      >
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-sky-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <RefreshCw size={40} className="text-white animate-spin" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Cargando...</h3>
              <p className="text-gray-600 text-lg">Preparando validación</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    }>
      <SocioValidarContent />
    </Suspense>
  );
}
