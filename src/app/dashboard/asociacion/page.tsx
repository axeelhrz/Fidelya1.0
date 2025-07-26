'use client';

import React, { useState, useCallback, memo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AsociacionSidebar } from '@/components/layout/AsociacionSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { useAuth } from '@/hooks/useAuth';
import { 
  Store, 
  BarChart3, 
  Plus,
  Building2,
  Sparkles,
  TrendingUp,
  Gift
} from 'lucide-react';

// Lazy load the heavy dashboard component
const OptimizedOverviewDashboard = lazy(() => import('@/components/asociacion/OptimizedOverviewDashboard'));

// Memoized Quick Actions Component
const ModernQuickActions = memo<{
  onNavigate: (section: string) => void;
}>(({ onNavigate }) => {
  const quickActions = [
    {
      id: 'add-member',
      label: 'Nuevo Socio',
      icon: <Plus size={20} />,
      gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700',
      onClick: () => onNavigate('socios'),
      description: 'Agregar miembro',
      iconBg: 'bg-white/20'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
      gradient: 'from-violet-500 via-purple-600 to-indigo-600',
      hoverGradient: 'hover:from-violet-600 hover:via-purple-700 hover:to-indigo-700',
      onClick: () => onNavigate('analytics'),
      description: 'Ver métricas',
      iconBg: 'bg-white/20'
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: <Store size={20} />,
      gradient: 'from-blue-500 via-cyan-600 to-sky-600',
      hoverGradient: 'hover:from-blue-600 hover:via-cyan-700 hover:to-sky-700',
      onClick: () => onNavigate('comercios'),
      description: 'Gestionar red',
      iconBg: 'bg-white/20'
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <Gift size={20} />,
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      hoverGradient: 'hover:from-orange-600 hover:via-amber-700 hover:to-yellow-700',
      onClick: () => onNavigate('beneficios'),
      description: 'Ofertas activas',
      iconBg: 'bg-white/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {quickActions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.02, 
            y: -4,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className={`
            relative p-6 lg:p-8 rounded-2xl lg:rounded-3xl text-white shadow-lg 
            transition-all duration-300 hover:shadow-2xl
            bg-gradient-to-br ${action.gradient} ${action.hoverGradient}
            group overflow-hidden border border-white/10
          `}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full -translate-x-6 -translate-y-6 group-hover:rotate-45 transition-transform duration-700" />
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 animate-shimmer" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className={`
              flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 
              ${action.iconBg} rounded-2xl mb-4 mx-auto 
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
              shadow-lg group-hover:shadow-xl
            `}>
              {action.icon}
            </div>
            <h3 className="font-bold text-lg lg:text-xl mb-2 group-hover:scale-105 transition-transform duration-300">
              {action.label}
            </h3>
            <p className="text-sm lg:text-base opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              {action.description}
            </p>
          </div>

          {/* Floating sparkles */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
        </motion.button>
      ))}
    </div>
  );
});

ModernQuickActions.displayName = 'ModernQuickActions';

// Memoized Sidebar Component
const AsociacionSidebarWithLogout = memo<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
  isMobile: boolean;
}>((props) => {
  return (
    <AsociacionSidebar
      open={props.open}
      onToggle={props.onToggle}
      onMenuClick={props.onMenuClick}
      onLogoutClick={props.onLogoutClick}
      activeSection={props.activeSection}
      isMobile={props.isMobile}
    />
  );
});

AsociacionSidebarWithLogout.displayName = 'AsociacionSidebarWithLogout';

// Loading Component
const DashboardLoading = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-slate-900 mb-3"
      >
        Cargando Dashboard
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-600 text-lg"
      >
        Preparando tu panel de control optimizado...
      </motion.p>
    </motion.div>
  </div>
));

DashboardLoading.displayName = 'DashboardLoading';

// Dashboard Content Component
interface User {
  nombre?: string;
  role?: string;
  // Add other properties as needed
}

const DashboardContent = memo<{
  user: User | null;
  onNavigate: (section: string) => void;
  onAddMember: () => void;
}>(({ user, onNavigate, onAddMember }) => {
  return (
    <div className="asociacion-page-container min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8"
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
                  Bienvenido a tu panel de control optimizado
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-500 font-medium">Sistema optimizado</span>
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
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Nuevo Socio</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('analytics')}
                className="bg-white/80 backdrop-blur-sm hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Analytics</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Modern Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ModernQuickActions onNavigate={onNavigate} />
        </motion.div>

        {/* Main Dashboard with Suspense */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
              <div className="flex justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
              </div>
            </div>
          }>
            <OptimizedOverviewDashboard
              onNavigate={onNavigate}
              onAddMember={onAddMember}
            />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
});

DashboardContent.displayName = 'DashboardContent';

// Main Component
export default function OptimizedAsociacionDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  
  // Usar el hook de navegación optimizado
  const {
    activeSection,
    navigateToSection,
    isNavigating
  } = useOptimizedAsociacionNavigation({
    autoCloseOnMobile: true,
    debounceMs: 150,
    enableCache: true
  });
  
  // State management
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Logout handlers
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

  // Navigation handlers optimizados
  const handleNavigate = useCallback((section: string) => {
    navigateToSection(section);
  }, [navigateToSection]);

  const handleAddMember = useCallback(() => {
    navigateToSection('socios');
  }, [navigateToSection]);

  // Memoized Sidebar Component
  const AsociacionSidebarWithLogout = useCallback((props: any) => {
    return (
      <AsociacionSidebar
        {...props}
        onLogoutClick={handleLogoutClick}
      />
    );
  }, [handleLogoutClick]);

  // Redirect if not authenticated or not association
  if (!authLoading && (!user || user.role !== 'asociacion')) {
    router.push('/auth/login');
    return null;
  }

  // Loading state
  if (authLoading) {
    return <DashboardLoading />;
  }

  return (
    <>
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={handleNavigate}
        sidebarComponent={AsociacionSidebarWithLogout}
        enableTransitions={true}
        enableOptimizedNavigation={true}
      >
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-full"
        >
          {isNavigating ? (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Navegando...</p>
              </div>
            </div>
          ) : (
            <DashboardContent
              user={user}
              onNavigate={handleNavigate}
              onAddMember={handleAddMember}
            />
          )}
        </motion.div>
      </DashboardLayout>

      {/* Enhanced Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}