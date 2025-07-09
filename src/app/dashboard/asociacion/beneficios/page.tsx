'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AsociacionSidebar } from '@/components/layout/AsociacionSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { useAuth } from '@/hooks/useAuth';
import { Gift, Plus, Eye, Crown, TrendingUp, Store, CheckCircle, BarChart3 } from 'lucide-react';

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

// Placeholder component for benefits management
const BeneficiosManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');

  const tabs = [
    { id: 'todos', label: 'Todos los Beneficios', icon: Gift, count: 24 },
    { id: 'destacados', label: 'Destacados', icon: Crown, count: 8 },
    { id: 'validaciones', label: 'Validaciones', icon: CheckCircle, count: 156 },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 }
  ];

  const stats = [
    {
      title: 'Total Beneficios',
      value: '24',
      change: '+12%',
      icon: <Gift className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-600',
      trend: 'up'
    },
    {
      title: 'Beneficios Activos',
      value: '18',
      change: '+8%',
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'Validaciones Hoy',
      value: '156',
      change: '+24%',
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-blue-500 to-indigo-600',
      trend: 'up'
    },
    {
      title: 'Comercios Participantes',
      value: '12',
      change: '+2',
      icon: <Store className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-600',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-2xl"></div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`text-sm font-bold ${
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Beneficios</h2>
            <div className="flex space-x-3">
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4" />
                <span>Nuevo Beneficio</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="min-h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gestión de Beneficios
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Aquí podrás crear, editar y gestionar todos los beneficios disponibles para tus socios.
              </p>
              <div className="flex justify-center space-x-3">
                <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg">
                  <Plus className="w-5 h-5" />
                  <span>Crear Primer Beneficio</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Ver Ejemplos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AsociacionBeneficiosPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  
  // State management
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

  // Loading state
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
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cargando Gestión de Beneficios
            </h2>
            <p className="text-gray-600">
              Preparando ofertas y promociones...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <>
      <DashboardLayout 
        activeSection="beneficios" 
        onSectionChange={() => {}}
        sidebarComponent={(props) => (
          <AsociacionSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="dashboard-container min-h-screen">
          {/* Enhanced animated background elements */}
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          
          {/* Dynamic floating geometric shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-xl animate-float-gentle"></div>
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-purple-300/30 rounded-full blur-2xl animate-float-delay"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-purple-300/35 to-pink-300/35 rounded-full blur-lg animate-float"></div>
          <div className="absolute top-1/4 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/40 to-purple-400/40 rounded-full blur-md animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-lg animate-bounce-slow"></div>

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
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-700 hover:scale-110">
                    <Gift className="w-10 h-10 text-white transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-lg animate-pulse-glow"></div>
                </div>
                
                <div className="text-left">
                  <h1 className="text-5xl md:text-6xl font-bold gradient-text font-playfair tracking-tight leading-none py-2">
                    Gestión de Beneficios
                  </h1>
                  <p className="text-xl text-slate-600 font-jakarta mt-2">
                    Crea y administra ofertas exclusivas
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <BeneficiosManagement />
            </motion.div>
          </div>
        </div>
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
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-2 hover:scale-110 transition-all duration-500 group relative overflow-hidden"
        >
          <svg className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full" />
        </button>
      </motion.div>
    </>
  );
}
