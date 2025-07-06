'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ComercioOverviewDashboard } from '@/components/comercio/ComercioOverviewDashboard';
import { ComercioAnalytics } from '@/components/comercio/ComercioAnalytics';
import { ComercioOperaciones } from '@/components/comercio/ComercioOperaciones';
import { ComercioProfile } from '@/components/comercio/ComercioProfile';
import { ComercioNotifications } from '@/components/comercio/ComercioNotifications';
import { Shield, Loader2, Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Enhanced Loading Screen with Firebase Connection Status
const EnhancedLoadingScreen: React.FC<{ 
  message: string; 
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  progress?: number;
}> = ({ message, connectionStatus, progress = 0 }) => {
  
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-6 h-6 text-emerald-500" />;
      case 'disconnected':
        return <WifiOff className="w-6 h-6 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  const getConnectionMessage = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado a Firebase';
      case 'disconnected':
        return 'Reconectando...';
      case 'error':
        return 'Error de conexión';
      default:
        return 'Conectando a Firebase...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md mx-auto"
      >
        {/* Enhanced Loading Animation */}
        <div className="relative mb-8">
          <motion.div
            className="w-32 h-32 mx-auto relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-600"></div>
            
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="2"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progressGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.h2
          className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando Panel Comercial
        </motion.h2>
        
        <motion.p
          className="text-slate-600 text-lg font-medium mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>

        {/* Connection Status */}
        <motion.div
          className="flex items-center justify-center space-x-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {getConnectionIcon()}
          <span className="text-sm font-medium text-slate-600">
            {getConnectionMessage()}
          </span>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced Access Denied Screen
const EnhancedAccessDeniedScreen: React.FC<{ 
  onRetry?: () => void;
  error?: string;
}> = ({ onRetry, error }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-lg mx-auto"
    >
      {/* Icon with animation */}
      <motion.div
        className="w-32 h-32 mx-auto mb-8 relative"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 1, -1, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="relative w-full h-full bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center border-4 border-red-200">
          <Shield className="w-16 h-16 text-red-500" />
        </div>
      </motion.div>
      
      {/* Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {error ? 'Error de Conexión' : 'Acceso Restringido'}
      </motion.h1>
      
      {/* Description */}
      <motion.p
        className="text-slate-600 text-lg leading-relaxed mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {error || 'Necesitas permisos de comercio para acceder a este panel de control. Contacta al administrador si crees que esto es un error.'}
      </motion.p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onRetry && (
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reintentar</span>
          </motion.button>
        )}
        
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/auth/login'}
        >
          Volver al Login
        </motion.button>
      </div>
    </motion.div>
  </div>
);

// Enhanced Section Component with better transitions
const ComercioSection: React.FC<{ section: string }> = ({ section }) => {
  const sectionComponents = {
    'resumen': ComercioOverviewDashboard,
    'overview': ComercioOverviewDashboard,
    'analytics': () => <ComercioAnalytics section={section} />,
    'metrics': () => <ComercioAnalytics section={section} />,
    'reports': () => <ComercioAnalytics section={section} />,
    'insights': () => <ComercioAnalytics section={section} />,
    'perfil': ComercioProfile,
    'operaciones': () => <ComercioOperaciones section={section} />,
    'beneficios': () => <ComercioOperaciones section={section} />,
    'qr-validacion': () => <ComercioOperaciones section={section} />,
    'historial-validaciones': () => <ComercioOperaciones section={section} />,
    'notificaciones': ComercioNotifications,
  };

  const Component = sectionComponents[section as keyof typeof sectionComponents] || ComercioOverviewDashboard;
  
  return <Component />;
};

export default function EnhancedComercioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { comercio, loading: comercioLoading, refreshStats } = useComercios();
  const { loading: beneficiosLoading } = useBeneficios();
  const { loading: validacionesLoading } = useValidaciones();
  const { stats: notificationStats } = useNotifications();

  const [activeSection, setActiveSection] = useState('resumen');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const loading = authLoading || comercioLoading || beneficiosLoading || validacionesLoading;

  // Enhanced connection monitoring
  useEffect(() => {
    if (!user) return;

    let progressInterval: NodeJS.Timeout;
    let connectionTimeout: NodeJS.Timeout;

    // Simulate loading progress
    if (loading) {
      setLoadingProgress(0);
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
    } else {
      setLoadingProgress(100);
    }

    // Monitor Firebase connection
    const comercioRef = doc(db, 'comercios', user.uid);
    
    const unsubscribe = onSnapshot(
      comercioRef,
      {
        includeMetadataChanges: true
      },
      (doc) => {
        const source = doc.metadata.fromCache ? 'cache' : 'server';
        
        if (source === 'server') {
          setConnectionStatus('connected');
          setLastSync(new Date());
          setError(null);
        } else if (doc.metadata.hasPendingWrites) {
          setConnectionStatus('connecting');
        }
        
        if (!loading) {
          setLoadingProgress(100);
        }
      },
      (error) => {
        console.error('Firebase connection error:', error);
        setConnectionStatus('error');
        setError('Error de conexión con Firebase');
        toast.error('Error de conexión. Reintentando...');
        
        // Retry connection after 3 seconds
        connectionTimeout = setTimeout(() => {
          setConnectionStatus('connecting');
          refreshStats();
        }, 3000);
      }
    );

    return () => {
      unsubscribe();
      if (progressInterval) clearInterval(progressInterval);
      if (connectionTimeout) clearTimeout(connectionTimeout);
    };
  }, [user, loading, refreshStats]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus('connecting');
      toast.success('Conexión restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus('disconnected');
      toast.error('Sin conexión a internet');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced section change with transition state
  const handleSectionChange = useCallback((newSection: string) => {
    if (newSection === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(newSection);
      setIsTransitioning(false);
    }, 150);
  }, [activeSection]);

  // Retry connection function
  const handleRetry = useCallback(() => {
    setError(null);
    setConnectionStatus('connecting');
    window.location.reload();
  }, []);

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      await refreshStats();
      setConnectionStatus('connected');
      setLastSync(new Date());
      toast.success('Datos actualizados');
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Error al actualizar datos');
    }
  }, [refreshStats]);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <EnhancedAccessDeniedScreen onRetry={handleRetry} />;
  }

  // Show error screen if there's a critical error
  if (error && connectionStatus === 'error') {
    return <EnhancedAccessDeniedScreen error={error} onRetry={handleRetry} />;
  }

  if (loading || loadingProgress < 100) {
    return (
      <EnhancedLoadingScreen 
        message="Preparando tu centro de control comercial..." 
        connectionStatus={connectionStatus}
        progress={loadingProgress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        sidebarComponent={ComercioSidebar}
      >
        {/* Connection Status Bar */}
        <AnimatePresence>
          {(!isOnline || connectionStatus === 'disconnected') && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium"
            >
              <div className="flex items-center justify-center space-x-2">
                <WifiOff className="w-4 h-4" />
                <span>
                  {!isOnline ? 'Sin conexión a internet' : 'Reconectando a Firebase...'}
                </span>
                <button
                  onClick={handleRefresh}
                  className="ml-4 px-3 py-1 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="relative min-h-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(165, 180, 252, 0.15) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ 
                  opacity: 0, 
                  x: 20,
                  filter: "blur(4px)"
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  x: -20,
                  filter: "blur(4px)"
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="w-full"
              >
                {/* Loading overlay during transitions */}
                {isTransitioning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center"
                  >
                    <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md rounded-xl px-6 py-4 shadow-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-slate-700 font-medium">Cargando...</span>
                    </div>
                  </motion.div>
                )}
                
                <ComercioSection section={activeSection} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Floating Action Button for Mobile */}
        <motion.div
          className="fixed bottom-6 right-6 z-40 md:hidden"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <motion.button
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSectionChange('qr-validacion')}
          >
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Enhanced Notification Badge */}
        {notificationStats.unread > 0 && (
          <motion.div
            className="fixed top-4 right-4 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSectionChange('notificaciones')}
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative z-10">
                {notificationStats.unread} nueva{notificationStats.unread !== 1 ? 's' : ''}
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* Sync Status Indicator */}
        <motion.div
          className="fixed bottom-4 left-4 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg text-xs">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-500' :
              connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
              'bg-red-500'
            }`} />
            <span className="text-slate-600 font-medium">
              {connectionStatus === 'connected' ? `Sincronizado ${lastSync.toLocaleTimeString()}` :
               connectionStatus === 'connecting' ? 'Sincronizando...' :
               'Sin conexión'}
            </span>
          </div>
        </motion.div>
      </DashboardLayout>
    </div>
  );
}