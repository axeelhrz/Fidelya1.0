'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { OptimizedSocioTabSystem } from '@/components/layout/OptimizedSocioTabSystem';
import { UltraOptimizedTransitions } from '@/components/layout/UltraOptimizedTransitions';
import { useAuth } from '@/hooks/useAuth';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useOptimizedSocioNavigation } from '@/hooks/useOptimizedSocioNavigation';

// Enhanced Sidebar with logout functionality
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

export default function SocioDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { socio, loading: socioLoading } = useSocioProfile();
  const { estadisticasRapidas, loading: beneficiosLoading } = useBeneficios();
  
  // Optimized navigation hook
  const {
    activeTab,
    navigateToTab,
    isTransitioning,
    performanceMetrics
  } = useOptimizedSocioNavigation({
    initialTab: 'dashboard',
    debounceMs: 100,
    enableTransitions: true
  });
  
  // State management
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect if not authenticated or not socio
  if (!authLoading && (!user || user.role !== 'socio')) {
    router.push('/auth/login');
    return null;
  }

  // Logout handlers
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

  // Navigation handlers - Updated to use optimized navigation
  const handleNavigate = (section: string) => {
    const sectionRoutes: Record<string, string> = {
      'dashboard': '/dashboard/socio',
      'perfil': '/dashboard/socio/perfil',
      'beneficios': '/dashboard/socio/beneficios',
      'asociaciones': '/dashboard/socio/asociaciones',
      'validar': '/dashboard/socio/validar',
      'historial': '/dashboard/socio/historial'
    };

    const route = sectionRoutes[section];
    if (route && route !== '/dashboard/socio') {
      router.push(route);
    } else {
      // Use optimized navigation for internal tabs
      navigateToTab(section);
    }
  };

  const handleQuickScan = () => {
    router.push('/dashboard/socio/validar');
  };

  // Memoized stats for performance
  const optimizedStats = useMemo(() => ({
    totalBeneficios: estadisticasRapidas.disponibles || 0,
    beneficiosUsados: estadisticasRapidas.usados || 0,
    asociacionesActivas: 1, // Mock data - to be implemented
    ahorroTotal: estadisticasRapidas.ahorroTotal || 0,
    ahorroEsteMes: estadisticasRapidas.ahorroEsteMes || 0
  }), [estadisticasRapidas]);

  // Loading state with modern design
  if (authLoading || socioLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-indigo-300 rounded-full animate-pulse mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Cargando Dashboard
          </h2>
          <p className="text-slate-600 text-lg">
            Preparando tu panel de beneficios...
          </p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardLayout 
        activeSection={activeTab} 
        onSectionChange={navigateToTab}
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <UltraOptimizedTransitions
          activeKey={activeTab}
          direction="horizontal"
          duration={200}
          className="min-h-screen"
        >
          {/* Modern gradient background */}
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
              {/* Performance Header */}
              {process.env.NODE_ENV === 'development' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-black/80 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg border border-white/20 max-w-fit"
                >
                  <div className="flex items-center gap-4">
                    <span>Navegaciones: {performanceMetrics.navigationCount}</span>
                    <span>Tiempo promedio: {performanceMetrics.averageTransitionTime.toFixed(2)}ms</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </motion.div>
              )}

              {/* Optimized Tab System */}
              <OptimizedSocioTabSystem
                onNavigate={handleNavigate}
                onQuickScan={handleQuickScan}
                initialTab={activeTab}
                stats={optimizedStats}
              />
            </div>
          </div>
        </UltraOptimizedTransitions>
      </DashboardLayout>

      {/* Modern Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}