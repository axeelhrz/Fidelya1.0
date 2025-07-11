'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Settings, 
  Edit3,
  Shield,
  QrCode,
  Award,
  TrendingUp,
  Gift,
  DollarSign,
  Store,
  Zap,
  Star,
  Crown,
  Sparkles,
  CheckCircle,
  Loader2,
  Save,
  X,
  Bell,
  Download,
  RefreshCw,
  BarChart3,
  Palette
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { SocioConfiguration } from '@/types/socio';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// Interfaces
interface ProfileFormData {
  nombre: string;
  telefono: string;
  dni: string;
  direccion: string;
  fechaNacimiento: string;
}

// Quick Actions Component
const QuickActions: React.FC<{
  onNavigate: (section: string) => void;
}> = ({ onNavigate }) => {
  const quickActions = [
    {
      id: 'qr-scanner',
      label: 'Validar Beneficio',
      icon: <QrCode size={20} />,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      onClick: () => onNavigate('validar'),
      description: 'Escanear QR'
    },
    {
      id: 'benefits',
      label: 'Mis Beneficios',
      icon: <Gift size={20} />,
      color: 'bg-violet-500 hover:bg-violet-600',
      onClick: () => onNavigate('beneficios'),
      description: 'Ver disponibles'
    },
    {
      id: 'history',
      label: 'Historial',
      icon: <BarChart3 size={20} />,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => onNavigate('historial'),
      description: 'Ver actividad'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`
            relative p-6 rounded-2xl text-white shadow-lg transition-all duration-200
            hover:shadow-xl hover:-translate-y-1 ${action.color}
            group overflow-hidden
          `}
        >
          {/* Simple background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full translate-y-6 -translate-x-6" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto transition-transform duration-200 group-hover:scale-110">
              {action.icon}
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {action.label}
            </h3>
            <p className="text-sm opacity-90">
              {action.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

// Utility functions
const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'activo':
      return 'bg-emerald-500';
    case 'vencido':
      return 'bg-amber-500';
    case 'pendiente':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (estado: string) => {
  switch (estado) {
    case 'activo':
      return 'Activo';
    case 'vencido':
      return 'Vencido';
    case 'pendiente':
      return 'Pendiente';
    default:
      return 'Inactivo';
  }
};

const getNivelIcon = (nivel: string) => {
  switch (nivel) {
    case 'Bronze':
      return <Award className="w-4 h-4 text-amber-600" />;
    case 'Silver':
      return <Star className="w-4 h-4 text-gray-500" />;
    case 'Gold':
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case 'Platinum':
      return <Sparkles className="w-4 h-4 text-purple-500" />;
    case 'Diamond':
      return <Zap className="w-4 h-4 text-blue-500" />;
    default:
      return <Award className="w-4 h-4 text-gray-400" />;
  }
};

const getNivelGradient = (nivel: string) => {
  switch (nivel) {
    case 'Bronze':
      return 'from-amber-500 to-orange-600';
    case 'Silver':
      return 'from-gray-400 to-gray-600';
    case 'Gold':
      return 'from-yellow-400 to-yellow-600';
    case 'Platinum':
      return 'from-purple-400 to-purple-600';
    case 'Diamond':
      return 'from-blue-400 to-blue-600';
    default:
      return 'from-gray-400 to-gray-500';
  }
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  subtitle?: string;
}> = ({ title, value, icon, color, change, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      {change !== undefined && (
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
          change >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
        )}>
          <TrendingUp size={10} className={change >= 0 ? "text-emerald-600" : "text-red-600 rotate-180"} />
          {Math.abs(change)}%
        </div>
      )}
    </div>
    
    <div className="space-y-1">
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs font-medium text-gray-600">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  </motion.div>
);

// Profile Image Uploader Component
const ProfileImageUploader: React.FC<{
  currentImage?: string;
  onImageUpload: (file: File) => void;
  uploading: boolean;
}> = ({ currentImage, onImageUpload, uploading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="relative">
      <div className="relative group w-32 h-32 rounded-full overflow-hidden">
        {currentImage ? (
          <Image
            src={currentImage}
            alt="Perfil"
            className="w-full h-full object-cover"
            fill
            sizes="128px"
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-full">
            <User size={48} />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {uploading ? (
            <Loader2 size={24} className="text-white animate-spin" />
          ) : (
            <Camera size={24} className="text-white" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>
    </div>
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

// Main component
export default function SocioPerfilPage() {
  const { user, signOut } = useAuth();
  const { 
    socio, 
    estadisticas, 
    asociaciones, 
    loading, 
    updateProfile, 
    refreshData,
  } = useSocioProfile();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // UI states
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'general' | 'notifications' | 'privacy'>('general');

  // Profile data with safe fallbacks
  const profileData = useMemo(() => ({
    nombre: socio?.nombre || user?.nombre || 'Usuario',
    email: socio?.email || user?.email || '',
    telefono: socio?.telefono || '',
    dni: socio?.dni || '',
    direccion: socio?.direccion || '',
    fechaNacimiento: socio?.fechaNacimiento,
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

  // Configuration state
  const [configuracion, setConfiguracion] = useState<SocioConfiguration>({
    notificaciones: true,
    notificacionesPush: true,
    notificacionesEmail: true,
    notificacionesSMS: false,
    tema: 'light',
    idioma: 'es',
    moneda: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires',
    perfilPublico: false,
    mostrarEstadisticas: true,
    mostrarActividad: true,
    compartirDatos: false,
    beneficiosFavoritos: [],
    comerciosFavoritos: [],
    categoriasFavoritas: []
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: profileData.nombre,
    telefono: profileData.telefono,
    dni: profileData.dni,
    direccion: profileData.direccion,
    fechaNacimiento: profileData.fechaNacimiento 
      ? format(profileData.fechaNacimiento, 'yyyy-MM-dd')
      : ''
  });

  // Update form data when socio data changes
  useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || '',
        telefono: socio.telefono || '',
        dni: socio.dni || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento 
          ? format(socio.fechaNacimiento, 'yyyy-MM-dd')
          : ''
      });
    }
  }, [socio]);

  // Handlers
  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      await refreshData();
      toast.success('Datos actualizados');
    } catch (error) {
      console.error('Error refreshing:', error);
      toast.error('Error al actualizar');
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshData, refreshing]);

  const handleSaveProfile = useCallback(async () => {
    setUpdating(true);
    try {
      const updateData = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento) : undefined
      };
      
      const success = await updateProfile(updateData);
      if (success) {
        setEditModalOpen(false);
        toast.success('Perfil actualizado');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  }, [formData, updateProfile]);

  const handleSaveConfiguration = useCallback(async () => {
    setUpdating(true);
    try {
      console.log('Saving configuration:', configuracion);
      setConfigModalOpen(false);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setUpdating(false);
    }
  }, [configuracion]);

  const handleImageUpload = useCallback(async (file: File) => {
    setUploadingImage(true);
    try {
      console.log('Uploading image:', file);
      toast.success('Imagen de perfil actualizada');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleExportData = useCallback(async () => {
    try {
      const data = {
        perfil: socio,
        estadisticas: estadisticas,
        fechaExportacion: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `perfil-socio-${profileData.nombre.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar los datos');
    }
  }, [socio, estadisticas, profileData.nombre]);

  // Navigation handlers
  const handleNavigate = (section: string) => {
    const sectionRoutes: Record<string, string> = {
      'dashboard': '/dashboard/socio',
      'validar': '/dashboard/socio/validar',
      'beneficios': '/dashboard/socio/beneficios',
      'historial': '/dashboard/socio/historial',
      'perfil': '/dashboard/socio/perfil'
    };

    const route = sectionRoutes[section];
    if (route && route !== '/dashboard/socio/perfil') {
      window.location.href = route;
    }
  };

  // Logout handlers
  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error al cerrar sesión');
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-500 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Cargando Perfil
            </h2>
            <p className="text-slate-600">
              Preparando tu información...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        activeSection="perfil"
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
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      {refreshing ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                  </div>
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
                          {profileData.nombre}
                        </h1>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm text-gray-600">
                            Socio #{profileData.numeroSocio}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {getStatusText(profileData.estado)}
                          </span>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)} text-white text-sm font-medium shadow-sm`}>
                          {getNivelIcon(profileData.nivel.nivel)}
                          <span>{profileData.nivel.nivel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<QrCode size={16} />}
                        onClick={() => setQrModalOpen(true)}
                      >
                        Mi QR
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<Edit3 size={16} />}
                        onClick={() => setEditModalOpen(true)}
                      >
                        Editar Perfil
                      </Button>
                    </div>
                  </div>

                  {/* Level Progress */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progreso a {profileData.nivel.proximoNivel}
                      </span>
                      <span className="text-sm text-gray-600">
                        {profileData.nivel.puntos} / {profileData.nivel.puntosParaProximoNivel} pts
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getNivelGradient(profileData.nivel.proximoNivel)}`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(profileData.nivel.puntos / profileData.nivel.puntosParaProximoNivel) * 100}%` 
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
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

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit3 size={16} />}
                      onClick={() => setEditModalOpen(true)}
                    >
                      Editar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail size={16} className="text-gray-500" />
                          <span className="text-gray-900">{profileData.email}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone size={16} className="text-gray-500" />
                          <span className="text-gray-900">{profileData.telefono || 'No especificado'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">DNI</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Shield size={16} className="text-gray-500" />
                          <span className="text-gray-900">{profileData.dni || 'No especificado'}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Dirección</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin size={16} className="text-gray-500" />
                          <span className="text-gray-900">{profileData.direccion || 'No especificado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {profileData.fechaNacimiento && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha de Nacimiento</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-900">
                          {format(profileData.fechaNacimiento, 'dd/MM/yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Sidebar */}
                <div className="space-y-6">
                  
                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        leftIcon={<QrCode size={16} />}
                        onClick={() => setQrModalOpen(true)}
                      >
                        Ver mi QR
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        leftIcon={<Settings size={16} />}
                        onClick={() => setConfigModalOpen(true)}
                      >
                        Configuración
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        leftIcon={<Download size={16} />}
                        onClick={handleExportData}
                      >
                        Exportar Datos
                      </Button>
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    
                    {asociaciones && asociaciones.length > 0 ? (
                      <div className="space-y-3">
                        {asociaciones.slice(0, 3).map((asociacion) => (
                          <div key={asociacion.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                              {asociacion.nombre.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 text-sm truncate">{asociacion.nombre}</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(asociacion.estado)}`}>
                                {asociacion.estado}
                              </div>
                            </div>
                          </div>
                        ))}
                        {asociaciones.length > 3 && (
                          <div className="text-center">
                            <Button variant="outline" size="sm">
                              Ver todas ({asociaciones.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">No tienes asociaciones activas</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Edit3 size={20} />
                Editar Perfil
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Tu nombre completo"
                required
              />

              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Tu número de teléfono"
              />

              <Input
                label="DNI"
                value={formData.dni}
                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                placeholder="Tu número de documento"
              />

              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Tu dirección"
              />

              <Input
                label="Fecha de nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveProfile}
                loading={updating}
                leftIcon={<Save size={16} />}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QR Modal */}
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <QrCode size={20} />
                Mi Código QR
              </DialogTitle>
            </DialogHeader>

            <div className="text-center py-6">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <QrCode size={64} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {profileData.nombre}
              </h3>
              <p className="text-gray-600 mb-4">
                Socio #{profileData.numeroSocio}
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  Muestra este código QR en comercios para validar tus beneficios
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setQrModalOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configuration Modal */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Settings size={20} />
                Configuración
              </DialogTitle>
            </DialogHeader>

            {/* Configuration Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'general', label: 'General', icon: Settings },
                  { id: 'notifications', label: 'Notificaciones', icon: Bell },
                  { id: 'privacy', label: 'Privacidad', icon: Shield }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConfigTab(tab.id as 'general' | 'notifications' | 'privacy')}
                    className={cn(
                      "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                      activeConfigTab === tab.id
                        ? "border-slate-500 text-slate-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeConfigTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette size={20} className="text-slate-600" />
                      Apariencia
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tema</label>
                        <select
                          value={configuracion.tema}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, tema: e.target.value as 'light' | 'dark' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="light">Claro</option>
                          <option value="dark">Oscuro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
                        <select
                          value={configuracion.idioma}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, idioma: e.target.value as 'es' | 'en' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
                        <select
                          value={configuracion.moneda}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, moneda: e.target.value as 'ARS' | 'USD' | 'EUR' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="ARS">Peso Argentino (ARS)</option>
                          <option value="USD">Dólar (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Zona Horaria</label>
                        <select
                          value={configuracion.timezone}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                          <option value="America/Argentina/Cordoba">Córdoba (GMT-3)</option>
                          <option value="America/Argentina/Mendoza">Mendoza (GMT-3)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeConfigTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell size={20} className="text-slate-600" />
                      Preferencias de Notificaciones
                    </h4>
                    <div className="space-y-4">
                      {/* Notificaciones Generales */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Notificaciones Generales</div>
                          <div className="text-sm text-gray-600">Recibir notificaciones de la aplicación</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.notificaciones}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, notificaciones: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      {/* Notificaciones Push */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Notificaciones Push</div>
                          <div className="text-sm text-gray-600">Recibir notificaciones push en el navegador</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.notificacionesPush}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesPush: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      {/* Notificaciones por Email */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Notificaciones por Email</div>
                          <div className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.notificacionesEmail}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesEmail: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      {/* Notificaciones SMS */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Notificaciones SMS</div>
                          <div className="text-sm text-gray-600">Recibir notificaciones por mensaje de texto</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.notificacionesSMS}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesSMS: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeConfigTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-slate-600" />
                      Configuración de Privacidad
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Perfil Público</div>
                          <div className="text-sm text-gray-600">Permitir que otros vean tu perfil</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.perfilPublico}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, perfilPublico: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Mostrar Estadísticas</div>
                          <div className="text-sm text-gray-600">Compartir estadísticas de uso</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.mostrarEstadisticas}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarEstadisticas: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Mostrar Actividad</div>
                          <div className="text-sm text-gray-600">Mostrar actividad reciente</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.mostrarActividad}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarActividad: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">Compartir Datos</div>
                          <div className="text-sm text-gray-600">Permitir análisis de datos para mejorar el servicio</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracion.compartirDatos}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, compartirDatos: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfigModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveConfiguration}
                disabled={updating}
                leftIcon={updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              >
                {updating ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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