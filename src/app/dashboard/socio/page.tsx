'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  QrCode, 
  Gift, 
  User,
  DollarSign,
  Store,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Star,
  Crown,
  Sparkles,
  Loader2,
  ArrowRight,
  BarChart3,
  Target,
  CheckCircle
} from 'lucide-react';

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  subtitle?: string;
  onClick?: () => void;
}> = ({ title, value, icon, color, change, subtitle, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${
      onClick ? 'cursor-pointer' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
          change >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
        }`}>
          <TrendingUp size={10} className={change >= 0 ? "text-emerald-600" : "text-red-600 rotate-180"} />
          {Math.abs(change)}%
        </div>
      )}
    </div>
    
    <div className="space-y-1">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  </motion.div>
);

// Quick Action Card Component
const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}> = ({ title, description, icon, color, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`relative p-6 rounded-2xl text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group overflow-hidden ${color}`}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full translate-y-6 -translate-x-6" />
    </div>

    {/* Content */}
    <div className="relative z-10 text-center">
      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  </motion.button>
);

// Recent Activity Component
const RecentActivity: React.FC<{
  beneficiosMasUsados: Array<{ titulo: string; usos: number }>;
}> = ({ beneficiosMasUsados }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
      <BarChart3 className="w-5 h-5 text-gray-400" />
    </div>
    
    {beneficiosMasUsados.length > 0 ? (
      <div className="space-y-3">
        {beneficiosMasUsados.slice(0, 4).map((beneficio, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {beneficio.usos}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{beneficio.titulo}</div>
              <div className="text-xs text-gray-500">{beneficio.usos} usos</div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">No hay actividad reciente</p>
        <p className="text-gray-500 text-xs mt-1">Comienza a usar beneficios para ver tu actividad</p>
      </div>
    )}
  </motion.div>
);

// Level Progress Component
const LevelProgress: React.FC<{
  nivel: string;
  puntos: number;
  puntosParaProximoNivel: number;
  proximoNivel: string;
}> = ({ nivel, puntos, puntosParaProximoNivel, proximoNivel }) => {
  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return <Award className="w-5 h-5 text-amber-600" />;
      case 'Silver': return <Star className="w-5 h-5 text-gray-500" />;
      case 'Gold': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'Platinum': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Diamond': return <Zap className="w-5 h-5 text-blue-500" />;
      default: return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNivelGradient = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return 'from-amber-500 to-orange-600';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-purple-400 to-purple-600';
      case 'Diamond': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getNivelGradient(nivel)} flex items-center justify-center text-white`}>
            {getNivelIcon(nivel)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Nivel {nivel}</h3>
            <p className="text-sm text-gray-600">{puntos} puntos</p>
          </div>
        </div>
        <Target className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progreso a {proximoNivel}</span>
          <span className="font-medium text-gray-900">{puntos} / {puntosParaProximoNivel}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full bg-gradient-to-r ${getNivelGradient(proximoNivel)}`}
            initial={{ width: 0 }}
            animate={{ width: `${(puntos / puntosParaProximoNivel) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {puntosParaProximoNivel - puntos} puntos para el siguiente nivel
        </p>
      </div>
    </motion.div>
  );
};

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
  const { 
    socio, 
    estadisticas, 
    loading: socioLoading
  } = useSocioProfile();
  
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect if not authenticated or not socio
  if (!authLoading && (!user || user.role !== 'socio')) {
    router.push('/auth/login');
    return null;
  }

  // Profile data with safe fallbacks
  const profileData = useMemo(() => ({
    nombre: socio?.nombre || user?.nombre || 'Socio',
    estado: socio?.estado || 'activo',
    creadoEn: socio?.creadoEn || new Date(),
    numeroSocio: socio?.numeroSocio || '',
    nivel: {
      nivel: 'Bronze' as const,
      puntos: Math.floor(estadisticas.totalValidaciones * 10),
      puntosParaProximoNivel: 1000,
      proximoNivel: 'Silver',
    }
  }), [socio, user, estadisticas]);

  // Enhanced stats with real Firebase data
  const enhancedStats = useMemo(() => {
    const tiempoComoSocio = profileData.creadoEn ? differenceInDays(new Date(), profileData.creadoEn) : 0;
    
    return {
      beneficiosUsados: estadisticas.totalValidaciones || 0,
      ahorroTotal: estadisticas.ahorroTotal || 0,
      comerciosVisitados: estadisticas.comerciosFavoritos?.length || 0,
      tiempoComoSocio,
      beneficiosEsteMes: estadisticas.validacionesPorMes?.[0]?.validaciones || 0,
      ahorroEsteMes: estadisticas.validacionesPorMes?.[0]?.ahorro || 0,
    };
  }, [estadisticas, profileData.creadoEn]);

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
    const sectionRoutes: Record<string, string> = {
      'validar': '/dashboard/socio/validar',
      'beneficios': '/dashboard/socio/beneficios',
      'perfil': '/dashboard/socio/perfil',
      'historial': '/dashboard/socio/historial'
    };

    const route = sectionRoutes[section];
    if (route) {
      router.push(route);
    }
  };

  // Loading state
  if (authLoading || socioLoading) {
    return (
      <DashboardLayout
        activeSection={activeSection}
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Cargando Dashboard
            </h2>
            <p className="text-gray-600">
              Preparando tu panel de beneficios...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-emerald-500';
      case 'vencido': return 'bg-amber-500';
      case 'pendiente': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'vencido': return 'Vencido';
      case 'pendiente': return 'Pendiente';
      default: return 'Inactivo';
    }
  };

  return (
    <>
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
                    <div className="flex items-end space-x-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <User size={32} className="text-white" />
                          </div>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(profileData.estado)} rounded-full border-2 border-white`}></div>
                      </div>

                      {/* Profile Info */}
                      <div className="pb-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          Hola, {profileData.nombre}
                        </h1>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm text-gray-600">
                            Socio #{profileData.numeroSocio}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {getStatusText(profileData.estado)}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Bienvenido a tu panel de beneficios
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <div className="mt-4 sm:mt-0">
                      <motion.button
                        onClick={() => handleNavigate('validar')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <QrCode className="w-5 h-5" />
                        <span>Validar Beneficio</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatsCard
                      title="Beneficios Usados"
                      value={enhancedStats.beneficiosUsados}
                      icon={<Gift size={20} />}
                      color="bg-emerald-500"
                      subtitle="Total"
                    />
                    <StatsCard
                      title="Ahorro Total"
                      value={`$${enhancedStats.ahorroTotal.toLocaleString()}`}
                      icon={<DollarSign size={20} />}
                      color="bg-green-500"
                      subtitle="Acumulado"
                    />
                    <StatsCard
                      title="Comercios"
                      value={enhancedStats.comerciosVisitados}
                      icon={<Store size={20} />}
                      color="bg-blue-500"
                      subtitle="Visitados"
                    />
                    <StatsCard
                      title="Días como Socio"
                      value={enhancedStats.tiempoComoSocio}
                      icon={<Calendar size={20} />}
                      color="bg-purple-500"
                      subtitle="Desde registro"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <QuickActionCard
                    title="Validar Beneficio"
                    description="Escanear QR"
                    icon={<QrCode size={20} />}
                    color="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => handleNavigate('validar')}
                  />
                  <QuickActionCard
                    title="Mis Beneficios"
                    description="Ver disponibles"
                    icon={<Gift size={20} />}
                    color="bg-violet-500 hover:bg-violet-600"
                    onClick={() => handleNavigate('beneficios')}
                  />
                  <QuickActionCard
                    title="Mi Perfil"
                    description="Gestionar datos"
                    icon={<User size={20} />}
                    color="bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleNavigate('perfil')}
                  />
                </div>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Level Progress */}
                <LevelProgress
                  nivel={profileData.nivel.nivel}
                  puntos={profileData.nivel.puntos}
                  puntosParaProximoNivel={profileData.nivel.puntosParaProximoNivel}
                  proximoNivel={profileData.nivel.proximoNivel}
                />

                {/* Recent Activity */}
                <RecentActivity
                  beneficiosMasUsados={estadisticas.beneficiosMasUsados || []}
                />

                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg text-white p-6 relative overflow-hidden"
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold">Tu Progreso</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold mb-1">
                          ${enhancedStats.ahorroTotal.toLocaleString()}
                        </div>
                        <div className="text-blue-100 text-sm">Ahorrado en total</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-lg font-bold">{enhancedStats.beneficiosUsados}</div>
                          <div className="text-blue-100">Beneficios</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{enhancedStats.comerciosVisitados}</div>
                          <div className="text-blue-100">Comercios</div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleNavigate('historial')}
                        className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Ver Historial
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Welcome Message for New Users */}
              {enhancedStats.beneficiosUsados === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <Gift size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                        ¡Bienvenido a Fidelya!
                      </h3>
                      <p className="text-emerald-700 text-sm mb-3">
                        Comienza a disfrutar de increíbles beneficios en tus comercios favoritos.
                      </p>
                      <motion.button
                        onClick={() => handleNavigate('beneficios')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Explorar Beneficios
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </DashboardLayout>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}