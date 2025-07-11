'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Settings, 
  Camera,
  Download,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Shield,
  Bell,
  Palette,
  DollarSign,
  QrCode,
  Award,
  TrendingUp,
  Target,
  Zap,
  Star,
  Crown,
  Sparkles,
  Gift,
  BarChart3,
  CheckCircle,
  Loader2,
  Save,
  X,
  Store,
  Plus
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
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

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  change?: number;
  subtitle?: string;
  onClick?: () => void;
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
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'vencido':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'pendiente':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getNivelIcon = (nivel: string) => {
  switch (nivel) {
    case 'Bronze':
      return <Award className="w-5 h-5 text-amber-600" />;
    case 'Silver':
      return <Star className="w-5 h-5 text-gray-500" />;
    case 'Gold':
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 'Platinum':
      return <Sparkles className="w-5 h-5 text-purple-500" />;
    case 'Diamond':
      return <Zap className="w-5 h-5 text-blue-500" />;
    default:
      return <Award className="w-5 h-5 text-gray-400" />;
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
const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  change, 
  subtitle, 
  onClick 
}) => (
  <motion.div
    className={cn(
      "bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group",
      onClick && "cursor-pointer hover:-translate-y-1"
    )}
    whileHover={{ y: onClick ? -4 : 0 }}
    onClick={onClick}
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
            change >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
          )}>
            <TrendingUp size={12} className={change >= 0 ? "text-emerald-600" : "text-red-600 rotate-180"} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-black text-gray-900">{value}</div>
        <div className="text-sm font-semibold text-gray-600">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
      </div>
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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // UI states
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'general' | 'notifications' | 'privacy'>('general');
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Profile data with safe fallbacks
  const profileData = {
    nombre: socio?.nombre || user?.nombre || 'Usuario',
    email: socio?.email || user?.email || '',
    telefono: socio?.telefono || '',
    dni: socio?.dni || '',
    direccion: socio?.direccion || '',
    fechaNacimiento: socio?.fechaNacimiento,
    estado: socio?.estado || 'activo',
    creadoEn: socio?.creadoEn || new Date(),
    avatar: null as string | null,
    nivel: {
      nivel: 'Bronze' as const,
      puntos: 0,
      puntosParaProximoNivel: 1000,
      proximoNivel: 'Silver',
      beneficiosDesbloqueados: [],
      descuentoAdicional: 0
    }
  };

  // Enhanced stats with safe fallbacks
  const enhancedStats = useMemo(() => {
    const baseStats = {
      beneficiosUsados: socio?.beneficiosUsados || 0,
      ahorroTotal: estadisticas?.ahorroTotal || 0,
      comerciosVisitados: 0,
      racha: 0,
      asociacionesActivas: asociaciones?.length || 0,
      tiempoComoSocio: profileData.creadoEn ? differenceInDays(new Date(), profileData.creadoEn) : 0
    };

    return {
      ...baseStats,
      cambiosBeneficios: Math.floor(Math.random() * 20) - 10,
      cambiosAhorro: Math.floor(Math.random() * 30) - 15,
      cambiosComercios: Math.floor(Math.random() * 15) - 5,
      cambiosRacha: Math.floor(Math.random() * 25) - 10
    };
  }, [socio, estadisticas, asociaciones, profileData.creadoEn]);

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
      toast.success('Perfil actualizado');
    } catch (error) {
      console.error('Error refreshing:', error);
      toast.error('Error al actualizar');
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshData, refreshing]);

  const handleCopyId = useCallback(() => {
    if (socio?.id) {
      navigator.clipboard.writeText(socio.id);
      setCopied(true);
      toast.success('ID copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [socio?.id]);

  const handleSaveProfile = useCallback(async () => {
    setUpdating(true);
    try {
      const updateData = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento) : undefined
      };
      
      await updateProfile(updateData);
      setEditModalOpen(false);
      toast.success('Perfil actualizado correctamente');
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
      console.log('Exporting data');
      toast.success('Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar los datos');
    }
  }, []);

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
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                          Hola, {profileData.nombre}
                        </h1>
                        <p className="text-lg text-slate-600 mt-1">
                          Gestiona tu perfil y configuración
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      {refreshing ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<Edit3 size={16} />}
                      onClick={() => setEditModalOpen(true)}
                      className="bg-slate-600 hover:bg-slate-700"
                    >
                      Editar Perfil
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <QuickActions onNavigate={handleNavigate} />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
                <StatsCard
                  title="Beneficios Usados"
                  value={enhancedStats.beneficiosUsados}
                  icon={<Gift size={24} />}
                  gradient="from-emerald-500 to-teal-600"
                  change={enhancedStats.cambiosBeneficios}
                  subtitle="Este mes"
                  onClick={() => setDetailsModalOpen(true)}
                />
                
                <StatsCard
                  title="Ahorro Total"
                  value={`$${enhancedStats.ahorroTotal.toLocaleString()}`}
                  icon={<DollarSign size={24} />}
                  gradient="from-green-500 to-emerald-600"
                  change={enhancedStats.cambiosAhorro}
                  subtitle="Acumulado"
                  onClick={() => setDetailsModalOpen(true)}
                />
                
                <StatsCard
                  title="Comercios Visitados"
                  value={enhancedStats.comerciosVisitados}
                  icon={<Store size={24} />}
                  gradient="from-blue-500 to-indigo-600"
                  change={enhancedStats.cambiosComercios}
                  subtitle="Únicos"
                  onClick={() => setDetailsModalOpen(true)}
                />
                
                <StatsCard
                  title="Racha Actual"
                  value={`${enhancedStats.racha} días`}
                  icon={<Zap size={24} />}
                  gradient="from-orange-500 to-red-600"
                  change={enhancedStats.cambiosRacha}
                  subtitle="Consecutivos"
                  onClick={() => setDetailsModalOpen(true)}
                />
                
                <StatsCard
                  title="Asociaciones"
                  value={enhancedStats.asociacionesActivas}
                  icon={<Award size={24} />}
                  gradient="from-purple-500 to-pink-600"
                  subtitle="Activas"
                />
                
                <StatsCard
                  title="Tiempo como Socio"
                  value={`${enhancedStats.tiempoComoSocio} días`}
                  icon={<Calendar size={24} />}
                  gradient="from-indigo-500 to-purple-600"
                  subtitle="Desde el registro"
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
                          <p className="text-sm text-gray-600">Datos básicos de tu perfil</p>
                        </div>
                      </div>
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
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Nombre Completo</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <User size={16} className="text-gray-500" />
                            <span className="text-gray-900 font-medium">{profileData.nombre || 'No especificado'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Mail size={16} className="text-gray-500" />
                            <span className="text-gray-900 font-medium">{profileData.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Teléfono</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Phone size={16} className="text-gray-500" />
                            <span className="text-gray-900 font-medium">{profileData.telefono || 'No especificado'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">DNI</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Shield size={16} className="text-gray-500" />
                            <span className="text-gray-900 font-medium">{profileData.dni || 'No especificado'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Dirección</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <MapPin size={16} className="text-gray-500" />
                            <span className="text-gray-900 font-medium">{profileData.direccion || 'No especificado'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Fecha de Nacimiento</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="text-gray-900 font-medium">
                              {profileData.fechaNacimiento 
                                ? format(profileData.fechaNacimiento, 'dd/MM/yyyy', { locale: es })
                                : 'No especificado'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Membership Level Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)} flex items-center justify-center text-white`}>
                        {getNivelIcon(profileData.nivel.nivel)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Nivel de Membresía</h3>
                        <p className="text-sm text-gray-600">Tu progreso y beneficios desbloqueados</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-black text-gray-900">{profileData.nivel.nivel}</div>
                          <div className="text-sm text-gray-600">Nivel actual</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-600">{profileData.nivel.puntos} pts</div>
                          <div className="text-sm text-gray-600">Puntos acumulados</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Progreso a {profileData.nivel.proximoNivel}
                          </span>
                          <span className="text-sm text-gray-600">
                            {profileData.nivel.puntosParaProximoNivel - profileData.nivel.puntos} pts restantes
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full bg-gradient-to-r ${getNivelGradient(profileData.nivel.proximoNivel)} transition-all duration-500`}
                            style={{ 
                              width: `${(profileData.nivel.puntos / profileData.nivel.puntosParaProximoNivel) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {profileData.nivel.descuentoAdicional > 0 && (
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-emerald-600" />
                            <span className="font-semibold text-emerald-900">Descuento Adicional</span>
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">
                            +{profileData.nivel.descuentoAdicional}%
                          </div>
                          <div className="text-sm text-emerald-700">
                            En todos los beneficios por tu nivel {profileData.nivel.nivel}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
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
                        leftIcon={<BarChart3 size={16} />}
                        onClick={() => setDetailsModalOpen(true)}
                      >
                        Estadísticas Detalladas
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
                  </div>

                  {/* Asociaciones */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Mis Asociaciones</h3>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Edit3 size={24} className="text-slate-600" />
                Editar Perfil
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Tu nombre completo"
                    icon={<User size={16} />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    placeholder="Tu número de teléfono"
                    icon={<Phone size={16} />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DNI
                  </label>
                  <Input
                    value={formData.dni}
                    onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                    placeholder="Tu número de DNI"
                    icon={<Shield size={16} />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <Input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                    icon={<Calendar size={16} />}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <Input
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  placeholder="Tu dirección completa"
                  icon={<MapPin size={16} />}
                />
              </div>
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
                disabled={updating}
                leftIcon={updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              >
                {updating ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configuration Modal */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Settings size={24} className="text-slate-600" />
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

        {/* QR Modal */}
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <QrCode size={24} className="text-slate-600" />
                Mi Código QR
              </DialogTitle>
            </DialogHeader>

            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <QrCode size={64} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {profileData.nombre}
              </h3>
              <p className="text-gray-600 mb-4">
                ID: {socio?.id?.slice(-8)}
              </p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700">
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

        {/* Details Modal */}
        <Dialog open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <BarChart3 size={24} className="text-slate-600" />
                Estadísticas Detalladas
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-8 h-8 text-emerald-600" />
                    <div>
                      <div className="text-2xl font-bold text-emerald-700">{enhancedStats.beneficiosUsados}</div>
                      <div className="text-sm text-emerald-600">Beneficios Totales</div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-600">
                    Promedio: {(enhancedStats.beneficiosUsados / Math.max(enhancedStats.tiempoComoSocio / 30, 1)).toFixed(1)} por mes
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-700">${enhancedStats.ahorroTotal.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">Ahorro Total</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    Promedio por beneficio: ${(enhancedStats.ahorroTotal / Math.max(enhancedStats.beneficiosUsados, 1)).toFixed(0)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Store className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-700">{enhancedStats.comerciosVisitados}</div>
                      <div className="text-sm text-purple-600">Comercios Únicos</div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-600">
                    Diversidad de uso: {((enhancedStats.comerciosVisitados / Math.max(enhancedStats.beneficiosUsados, 1)) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Activity Chart Placeholder */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-slate-600" />
                  Actividad Mensual
                </h4>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráfico de actividad mensual</p>
                    <p className="text-sm text-gray-400">Próximamente disponible</p>
                  </div>
                </div>
              </div>

              {/* Membership Progress */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-slate-600" />
                  Progreso de Membresía
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Nivel Actual: {profileData.nivel.nivel}</span>
                      <span className="text-sm text-gray-600">{profileData.nivel.puntos} / {profileData.nivel.puntosParaProximoNivel} pts</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${getNivelGradient(profileData.nivel.proximoNivel)} transition-all duration-500`}
                        style={{ 
                          width: `${(profileData.nivel.puntos / profileData.nivel.puntosParaProximoNivel) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tiempo como socio:</span>
                      <span className="font-semibold text-gray-900 ml-2">{enhancedStats.tiempoComoSocio} días</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Racha actual:</span>
                      <span className="font-semibold text-gray-900 ml-2">{enhancedStats.racha} días</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDetailsModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cerrar
              </Button>
              <Button 
                onClick={handleExportData}
                leftIcon={<Download size={16} />}
              >
                Exportar Estadísticas
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
