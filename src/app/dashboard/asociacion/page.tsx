'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AsociacionSidebar } from '@/components/layout/AsociacionSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { OverviewDashboard } from '@/components/asociacion/OverviewDashboard';
import { useAuth } from '@/hooks/useAuth';
import { 
  Store, 
  BarChart3, 
  Bell, 
  Plus,
  Building2,
} from 'lucide-react';

// Enhanced Quick Actions Component with modern design
const QuickActions: React.FC<{
  onNavigate: (section: string) => void;
  isVisible: boolean;
}> = ({ onNavigate, isVisible }) => {
  const quickActions = [
    {
      id: 'add-member',
      label: 'Nuevo Socio',
      icon: <Plus size={24} />,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      onClick: () => onNavigate('socios'),
      description: 'Agregar miembro',
      delay: 0
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={24} />,
      gradient: 'from-violet-500 via-purple-500 to-violet-600',
      onClick: () => onNavigate('analytics'),
      description: 'Ver métricas',
      delay: 0.1
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: <Store size={24} />,
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      onClick: () => onNavigate('comercios'),
      description: 'Gestionar red',
      delay: 0.2
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: <Bell size={24} />,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      onClick: () => onNavigate('notificaciones'),
      description: 'Centro de mensajes',
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {quickActions.map((action) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 30, 
            scale: isVisible ? 1 : 0.9 
          }}
          transition={{ 
            duration: 0.8, 
            delay: action.delay,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -8,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className={`
            relative p-8 rounded-3xl bg-gradient-to-br ${action.gradient} 
            text-white shadow-2xl hover:shadow-3xl transition-all duration-500
            group overflow-hidden backdrop-blur-xl border border-white/20
          `}
        >
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/15 rounded-full translate-y-10 -translate-x-10" />
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full -translate-x-8 -translate-y-8" />
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
              {action.icon}
            </div>
            <h3 className="font-bold text-xl mb-2 group-hover:scale-105 transition-transform duration-300">
              {action.label}
            </h3>
            <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              {action.description}
            </p>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        </motion.button>
      ))}
    </div>
  );
};

// Enhanced Sidebar with logout functionality
const AsociacionSidebarWithLogout: React.FC<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
}> = (props) => {
  return (
    <AsociacionSidebar
      open={props.open}
      onToggle={props.onToggle}
      onMenuClick={props.onMenuClick}
      onLogoutClick={props.onLogoutClick}
      activeSection={props.activeSection}
    />
  );
};

export default function AsociacionDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger visibility for staggered animations
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if not authenticated or not association
  if (!authLoading && (!user || user.role !== 'asociacion')) {
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

  // Navigation handlers
  const handleNavigate = (section: string) => {
    // Map sections to their respective pages
    const sectionRoutes: Record<string, string> = {
      'dashboard': '/dashboard/asociacion',
      'socios': '/dashboard/asociacion/socios',
      'comercios': '/dashboard/asociacion/comercios',
      'analytics': '/dashboard/asociacion/analytics',
      'notificaciones': '/dashboard/asociacion/notificaciones',
      'reportes': '/dashboard/asociacion/reportes',
      'configuracion': '/dashboard/asociacion/configuracion',
      'beneficios': '/dashboard/asociacion/beneficios',
      'pagos': '/dashboard/asociacion/pagos'
    };

    const route = sectionRoutes[section];
    if (route && route !== '/dashboard/asociacion') {
      router.push(route);
    } else {
      setActiveSection(section);
    }
  };

  const handleAddMember = () => {
    router.push('/dashboard/asociacion/socios');
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50/50 via-white to-celestial-50/30 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cargando Dashboard Ejecutivo
            </h2>
            <p className="text-gray-600">
              Preparando tu centro de control...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  // Render dashboard content
  const renderDashboardContent = () => {
    return (
      <div className="dashboard-container min-h-screen">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 bg-grid opacity-30"></div>
        
        {/* Dynamic floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-sky-200/40 to-celestial-200/40 rounded-full blur-xl animate-float-gentle"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-br from-celestial-200/30 to-sky-300/30 rounded-full blur-2xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-sky-300/35 to-celestial-300/35 rounded-full blur-lg animate-float"></div>
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-gradient-to-br from-celestial-400/40 to-sky-400/40 rounded-full blur-md animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-sky-300/30 to-celestial-400/30 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="relative z-10 p-8 space-y-12">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              {/* Enhanced logo icon */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 via-celestial-500 to-sky-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-700 hover:scale-110">
                  <Building2 className="w-10 h-10 text-white transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-sky-500/30 to-celestial-500/30 rounded-3xl blur-lg animate-pulse-glow"></div>
              </div>
              
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-bold gradient-text font-playfair tracking-tight leading-none py-2">
                  ¡Hola, {user?.nombre || 'Administrador'}!
                </h1>
                <p className="text-xl text-slate-600 font-jakarta mt-2">
                  Bienvenido a tu panel ejecutivo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <QuickActions
            onNavigate={handleNavigate}
            isVisible={isVisible}
          />

          {/* Main Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <OverviewDashboard
              onNavigate={handleNavigate}
              onAddMember={handleAddMember}
            />
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        sidebarComponent={(props) => (
          <AsociacionSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboardContent()}
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>

      {/* Enhanced Modal de Logout */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* Enhanced scroll to top button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-sky-500 to-celestial-500 text-white p-4 rounded-full shadow-2xl hover:shadow-sky-500/40 transform hover:-translate-y-2 hover:scale-110 transition-all duration-500 group relative overflow-hidden"
        >
          <svg className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-celestial-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full" />
        </button>
      </motion.div>
    </>
  );
}