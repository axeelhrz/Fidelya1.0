'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AsociacionSidebar } from '@/components/layout/AsociacionSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { OptimizedTabSystem } from '@/components/layout/OptimizedTabSystem';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficiosAsociacion } from '@/hooks/useBeneficios';
import { 
  Building2,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react';

// Optimized loading component
const OptimizedLoadingState = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto" />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full mx-auto"
        />
      </div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-3"
      >
        Inicializando Dashboard
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-600 text-lg"
      >
        Optimizando tu experiencia...
      </motion.p>
    </motion.div>
  </div>
));

OptimizedLoadingState.displayName = 'OptimizedLoadingState';

// Memoized header component
interface User {
  nombre?: string;
  role?: string;
  // Add other user properties as needed
}

interface Stats {
  [key: string]: number;
}

const DashboardHeader = memo<{
  user: User;
  stats: Stats;
  onAddMember: () => void;
}>(({ user, onAddMember }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
          <div className="relative">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-3xl flex items-center justify-center shadow-2xl">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2"
            >
              Hola, {user?.nombre || 'Administrador'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-slate-600"
            >
              Panel de control ultra optimizado
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2 mt-2"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-slate-500 font-medium">Sistema optimizado al 10000%</span>
            </motion.div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddMember}
            className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl group"
          >
            <span>Nuevo Socio</span>
          </motion.button>
          
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Seguro</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

// Enhanced Sidebar with logout functionality - memoized
const AsociacionSidebarWithLogout = memo<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
  isMobile: boolean;
}>(({ onLogoutClick, ...props }) => {
  return (
    <AsociacionSidebar
      {...props}
      onLogoutClick={onLogoutClick}
    />
  );
});

AsociacionSidebarWithLogout.displayName = 'AsociacionSidebarWithLogout';

// Main component
export default function OptimizedAsociacionDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  
  // Hooks for stats
  const { stats: sociosStats} = useSocios();
  const { stats: comerciosStats} = useComercios();
  const { stats: beneficiosStats } = useBeneficiosAsociacion();
  
  // State management - optimized to prevent unnecessary re-renders
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');

  // Memoized consolidated stats
  const consolidatedStats = useMemo(() => ({
    totalSocios: sociosStats?.total || 0,
    sociosActivos: sociosStats?.activos || 0,
    comerciosActivos: comerciosStats?.comerciosActivos || 0,
    beneficiosActivos: beneficiosStats?.beneficiosActivos || 0,
    ingresosMensuales: sociosStats?.ingresosMensuales || 0
  }), [sociosStats, comerciosStats, beneficiosStats]);

  // Optimized logout handlers
  const handleLogoutClick = useCallback(() => {
    setLogoutModalOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
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
  }, [signOut, router]);

  const handleLogoutCancel = useCallback(() => {
    setLogoutModalOpen(false);
  }, []);

  // Optimized navigation handler - NO ROUTING, just state change
  const handleNavigate = useCallback((section: string) => {
    setCurrentSection(section);
  }, []);

  const handleAddMember = useCallback(() => {
    setCurrentSection('socios');
  }, []);

  // Optimized menu click handler for sidebar
  const handleMenuClick = useCallback((section: string) => {
    setCurrentSection(section);
  }, []);

  // Redirect if not authenticated or not association
  if (!authLoading && (!user || user.role !== 'asociacion')) {
    router.push('/auth/login');
    return null;
  }

  // Loading state
  if (authLoading) {
    return <OptimizedLoadingState />;
  }

  return (
    <>
      <DashboardLayout 
        activeSection={currentSection} 
        onSectionChange={handleMenuClick}
        sidebarComponent={AsociacionSidebarWithLogout}
        enableTransitions={false} // Disable transitions for better performance
        onLogout={handleLogoutClick}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
            {/* Optimized Header */}
            <DashboardHeader
              user={user ?? {}}
              stats={consolidatedStats}
              onAddMember={handleAddMember}
            />

            {/* Ultra Optimized Tab System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <OptimizedTabSystem
                onNavigate={handleNavigate}
                onAddMember={handleAddMember}
                initialTab={currentSection}
                stats={consolidatedStats}
              />
            </motion.div>
          </div>
        </div>
      </DashboardLayout>

      {/* Enhanced Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* Performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/90 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-xl border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold">Ultra Optimizado</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Pestañas: {currentSection}</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <span className="text-green-400">Sin Re-renders</span>
          </div>
        </div>
      )}
    </>
  );
}