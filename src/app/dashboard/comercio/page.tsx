'use client';

import React, { useState, useEffect } from 'react';
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
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

// Modern Loading Screen Component
const ModernLoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center max-w-md mx-auto"
    >
      {/* Modern Loading Animation */}
      <div className="relative mb-8">
        <motion.div
          className="w-24 h-24 mx-auto relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-600"></div>
        </motion.div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
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
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Cargando Panel Comercial
      </motion.h2>
      
      <motion.p
        className="text-slate-600 text-lg font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>

      {/* Progress dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
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

// Modern Access Denied Screen
const ModernAccessDeniedScreen: React.FC = () => (
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
        Acceso Restringido
      </motion.h1>
      
      {/* Description */}
      <motion.p
        className="text-slate-600 text-lg leading-relaxed mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Necesitas permisos de comercio para acceder a este panel de control.
        Contacta al administrador si crees que esto es un error.
      </motion.p>

      {/* Action Button */}
      <motion.button
        className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/auth/login'}
      >
        Volver al Login
      </motion.button>
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

export default function ComercioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { loading: comercioLoading } = useComercios();
  const { loading: beneficiosLoading } = useBeneficios();
  const { loading: validacionesLoading } = useValidaciones();
  const { stats: notificationStats } = useNotifications();

  const [activeSection, setActiveSection] = useState('resumen');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const loading = authLoading || comercioLoading || beneficiosLoading || validacionesLoading;

  // Enhanced section change with transition state
  const handleSectionChange = (newSection: string) => {
    if (newSection === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(newSection);
      setIsTransitioning(false);
    }, 150);
  };

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <ModernAccessDeniedScreen />;
  }

  if (loading) {
    return <ModernLoadingScreen message="Preparando tu centro de control comercial..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        sidebarComponent={ComercioSidebar}
      >
        {/* Main Content Area */}
        <div className="relative min-h-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-grid bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
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

        {/* Floating Action Button for Mobile */}
        <motion.div
          className="fixed bottom-6 right-6 z-50 md:hidden"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSectionChange('qr-validacion')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Notification Badge */}
        {notificationStats.unread > 0 && (
          <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSectionChange('notificaciones')}
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {notificationStats.unread} nueva{notificationStats.unread !== 1 ? 's' : ''}
            </motion.div>
          </motion.div>
        )}
      </DashboardLayout>
    </div>
  );
}