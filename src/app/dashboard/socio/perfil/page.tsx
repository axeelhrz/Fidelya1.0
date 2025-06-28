'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard,
  Settings,
  Save,
  X,
  RefreshCw,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  Target,
  Activity,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Palette,
  Camera,
  Upload,
  Download,
  Star,
  Gift,
  Zap,
  Heart,
  Crown,
  Sparkles,
  Lock,
  Unlock,
  Globe,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Share2,
  BookOpen,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  Filter,
  Search,
  MoreVertical,
  Plus,
  Minus,
  RotateCcw,
  Archive,
  Trash2,
  Flag,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import UnifiedMetricsCard from '@/components/ui/UnifiedMetricsCard';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ProfileFormData {
  nombre: string;
  telefono: string;
  dni: string;
  direccion: string;
}

interface ConfiguracionData {
  notificaciones: boolean;
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
  notificacionesSMS: boolean;
  tema: 'light' | 'dark' | 'auto';
  perfilPublico: boolean;
  mostrarEstadisticas: boolean;
  mostrarActividad: boolean;
  compartirDatos: boolean;
  idioma: 'es' | 'en';
  moneda: 'ARS' | 'USD' | 'EUR';
  timezone: string;
}

interface ActivityItem {
  id: string;
  tipo: 'beneficio' | 'validacion' | 'registro' | 'actualizacion';
  titulo: string;
  descripcion: string;
  fecha: Date;
  icono: React.ReactNode;
  color: string;
  valor?: number;
  comercio?: string;
}

export default function SocioPerfilPage() {
  const { user } = useAuth();
  const { socio, stats, asociaciones, loading, updating, updateProfile, refreshData } = useSocioProfile();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notificaciones' | 'privacidad' | 'avanzado'>('general');

  // Datos del perfil con fallbacks
  const profileData = {
    nombre: socio?.nombre || user?.nombre || 'Usuario',
    email: socio?.email || user?.email || '',
    telefono: socio?.telefono || '',
    dni: socio?.dni || '',
    direccion: socio?.direccion || '',
    estado: socio?.estado || 'activo',
    creadoEn: socio?.creadoEn || new Date(),
    ultimoAcceso: new Date(),
    avatar: socio?.avatar || null,
    nivel: 'Gold',
    puntos: 1250,
    proximoNivel: 'Platinum',
    puntosParaProximoNivel: 750
  };

  // Estadísticas mejoradas
  const enhancedStats = {
    beneficiosUsados: stats?.beneficiosUsados || 24,
    ahorroTotal: stats?.ahorroTotal || 15750,
    beneficiosEsteMes: stats?.beneficiosEsteMes || 8,
    asociacionesActivas: asociaciones?.filter(a => a.estado === 'activo').length || 2,
    racha: 12,
    nivel: 'Gold',
    puntosAcumulados: 1250,
    beneficiosFavoritos: 5,
    comerciosVisitados: 18,
    descuentoPromedio: 25,
    ahorroEsteMes: 2340,
    validacionesExitosas: 96,
    tiempoComoSocio: Math.floor((new Date().getTime() - profileData.creadoEn.getTime()) / (1000 * 60 * 60 * 24))
  };

  // Configuración con valores por defecto
  const [configuracion, setConfiguracion] = useState<ConfiguracionData>({
    notificaciones: true,
    notificacionesPush: true,
    notificacionesEmail: true,
    notificacionesSMS: false,
    tema: 'light',
    perfilPublico: false,
    mostrarEstadisticas: true,
    mostrarActividad: true,
    compartirDatos: false,
    idioma: 'es',
    moneda: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires'
  });

  // Actividad reciente simulada
  const [actividadReciente] = useState<ActivityItem[]>([
    {
      id: '1',
      tipo: 'beneficio',
      titulo: 'Descuento aplicado',
      descripcion: 'Restaurante El Buen Sabor - 20% de descuento',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icono: <Gift size={16} />,
      color: '#10b981',
      valor: 450,
      comercio: 'Restaurante El Buen Sabor'
    },
    {
      id: '2',
      tipo: 'validacion',
      titulo: 'QR escaneado',
      descripción: 'Validación exitosa en Farmacia Central',
      fecha: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icono: <QrCode size={16} />,
      color: '#6366f1',
      comercio: 'Farmacia Central'
    },
    {
      id: '3',
      tipo: 'beneficio',
      titulo: 'Nuevo beneficio disponible',
      descripcion: 'Supermercado Fresco - 15% en productos orgánicos',
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icono: <Sparkles size={16} />,
      color: '#f59e0b'
    },
    {
      id: '4',
      tipo: 'actualizacion',
      titulo: 'Perfil actualizado',
      descripcion: 'Información de contacto modificada',
      fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icono: <User size={16} />,
      color: '#8b5cf6'
    }
  ]);

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: profileData.nombre,
    telefono: profileData.telefono,
    dni: profileData.dni,
    direccion: profileData.direccion
  });

  // Handlers
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        nombre: formData.nombre,
        telefono: formData.telefono || undefined,
        dni: formData.dni || undefined,
        direccion: formData.direccion || undefined
      });
      setEditModalOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSaveConfig = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfigModalOpen(false);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      toast.success('Datos actualizados');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user?.uid || '');
    setCopied(true);
    toast.success('ID de usuario copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      perfil: profileData,
      estadisticas: enhancedStats,
      asociaciones: asociaciones,
      configuracion: configuracion
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-socio-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Datos exportados exitosamente');
  };

  // Utility functions
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-500';
      case 'vencido': return 'bg-yellow-500';
      case 'inactivo': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Socio Activo';
      case 'vencido': return 'Membresía Vencida';
      case 'inactivo': return 'Socio Inactivo';
      default: return 'Estado Desconocido';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'activo': return <CheckCircle size={16} className="text-green-500" />;
      case 'vencido': return <XCircle size={16} className="text-red-500" />;
      case 'pendiente': return <Clock size={16} className="text-yellow-500" />;
      case 'inactivo': return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColorClass = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Platinum': return '#e5e4e2';
      case 'Diamond': return '#b9f2ff';
      default: return '#6b7280';
    }
  };

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return <Award size={20} />;
      case 'Silver': return <Star size={20} />;
      case 'Gold': return <Crown size={20} />;
      case 'Platinum': return <Zap size={20} />;
      case 'Diamond': return <Sparkles size={20} />;
      default: return <Award size={20} />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={SocioSidebar}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <LoadingSkeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={SocioSidebar}
    >
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-lg text-gray-600">
                Gestiona tu información personal y configuración de cuenta
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 size={16} />}
                onClick={() => setQrModalOpen(true)}
              >
                Compartir
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
                onClick={handleExportData}
              >
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={handleRefresh}
                loading={refreshing}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="xl:col-span-2 space-y-8">
            {/* Tarjeta de Perfil Principal Mejorada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Header con gradiente mejorado */}
              <div className="h-40 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Patrón decorativo */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-32 h-32 border border-white/30 rounded-full"></div>
                  <div className="absolute top-8 right-8 w-24 h-24 border border-white/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-1/2 w-16 h-16 border border-white/25 rounded-full"></div>
                </div>

                <div className="absolute top-6 right-6 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<QrCode size={16} />}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => setQrModalOpen(true)}
                  >
                    Mi QR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Settings size={16} />}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => setConfigModalOpen(true)}
                  >
                    Configuración
                  </Button>
                </div>
              </div>

              <div className="px-8 pb-8">
                {/* Avatar y información básica mejorada */}
                <div className="flex items-start justify-between -mt-20 mb-8">
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white">
                        <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                          {profileData.avatar ? (
                            <img 
                              src={profileData.avatar} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={40} className="text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* Botón de cámara */}
                      <button
                        onClick={() => setAvatarModalOpen(true)}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <Camera size={16} />
                      </button>
                    </motion.div>

                    {/* Indicador de estado mejorado */}
                    <div className={`absolute -bottom-1 left-4 w-8 h-8 ${getStatusColor(profileData.estado)} rounded-full border-4 border-white flex items-center justify-center shadow-lg`}>
                      <CheckCircle size={16} className="text-white" />
                    </div>

                    {/* Badge de nivel */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      {getNivelIcon(profileData.nivel)}
                      {profileData.nivel}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    leftIcon={<Edit3 size={16} />}
                    onClick={() => setEditModalOpen(true)}
                    className="mt-6"
                  >
                    Editar Perfil
                  </Button>
                </div>

                {/* Información del usuario mejorada */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{profileData.nombre}</h2>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-lg text-gray-600">{getStatusText(profileData.estado)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColorClass(profileData.estado)}`}>
                        {profileData.estado.toUpperCase()}
                      </span>
                    </div>

                    {/* Barra de progreso de nivel */}
                    <div className="bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                        style={{ width: `${(profileData.puntos / (profileData.puntos + profileData.puntosParaProximoNivel)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{profileData.puntos} puntos</span>
                      <span>{profileData.puntosParaProximoNivel} para {profileData.proximoNivel}</span>
                    </div>
                  </div>

                  {/* Grid de información mejorado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Mail size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="text-gray-900 font-semibold">{profileData.email}</p>
                      </div>
                      <button
                        onClick={handleCopyUserId}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>

                    {profileData.telefono && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Phone size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                          <p className="text-gray-900 font-semibold">{profileData.telefono}</p>
                        </div>
                      </div>
                    )}

                    {profileData.dni && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <CreditCard size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">DNI</p>
                          <p className="text-gray-900 font-semibold">{profileData.dni}</p>
                        </div>
                      </div>
                    )}

                    {profileData.direccion && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <MapPin size={20} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Dirección</p>
                          <p className="text-gray-900 font-semibold">{profileData.direccion}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors md:col-span-2">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Calendar size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Miembro desde</p>
                        <p className="text-gray-900 font-semibold">
                          {format(profileData.creadoEn, 'dd MMMM yyyy', { locale: es })} 
                          <span className="text-gray-500 ml-2">
                            ({enhancedStats.tiempoComoSocio} días)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Estadísticas Detalladas Mejoradas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Estadísticas de Actividad</h3>
                    <p className="text-gray-500">Tu rendimiento como socio</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Activity size={16} />}
                  onClick={() => setActivityModalOpen(true)}
                >
                  Ver Actividad
                </Button>
              </div>

              {/* Grid de métricas mejorado */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <UnifiedMetricsCard
                  title="Beneficios Usados"
                  value={enhancedStats.beneficiosUsados}
                  icon={<Award />}
                  color="#6366f1"
                  size="medium"
                  change={12}
                  trend="up"
                  description="Total de beneficios utilizados"
                  showProgress={true}
                  progressValue={75}
                />

                <UnifiedMetricsCard
                  title="Total Ahorrado"
                  value={`$${enhancedStats.ahorroTotal.toLocaleString()}`}
                  icon={<Target />}
                  color="#10b981"
                  size="medium"
                  change={8}
                  trend="up"
                  description="Dinero ahorrado en total"
                  showProgress={true}
                  progressValue={85}
                />

                <UnifiedMetricsCard
                  title="Este Mes"
                  value={enhancedStats.beneficiosEsteMes}
                  icon={<Activity />}
                  color="#f59e0b"
                  size="medium"
                  change={-5}
                  trend="down"
                  description="Beneficios usados este mes"
                  showProgress={true}
                  progressValue={60}
                />

                <UnifiedMetricsCard
                  title="Días de Racha"
                  value={enhancedStats.racha}
                  icon={<Zap />}
                  color="#8b5cf6"
                  size="medium"
                  change={15}
                  trend="up"
                  description="Días consecutivos activo"
                  showProgress={true}
                  progressValue={90}
                />
              </div>

              {/* Métricas adicionales */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Building2 size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{enhancedStats.comerciosVisitados}</div>
                  <div className="text-sm text-gray-600">Comercios Visitados</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{enhancedStats.validacionesExitosas}%</div>
                  <div className="text-sm text-gray-600">Validaciones Exitosas</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{enhancedStats.beneficiosFavoritos}</div>
                  <div className="text-sm text-gray-600">Beneficios Favoritos</div>
                </div>
              </div>
            </motion.div>

            {/* Actividad Reciente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Actividad Reciente</h3>
                    <p className="text-gray-500">Últimas acciones realizadas</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ExternalLink size={16} />}
                  onClick={() => setActivityModalOpen(true)}
                >
                  Ver Todo
                </Button>
              </div>

              <div className="space-y-4">
                {actividadReciente.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.icono}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.titulo}</h4>
                      <p className="text-sm text-gray-600">{item.descripcion}</p>
                      {item.comercio && (
                        <p className="text-xs text-gray-500 mt-1">{item.comercio}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {format(item.fecha, 'HH:mm', { locale: es })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(item.fecha, 'dd/MM', { locale: es })}
                      </p>
                      {item.valor && (
                        <p className="text-sm font-bold text-green-600">
                          +${item.valor}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Columna Lateral Mejorada */}
          <div className="space-y-8">
            {/* Mis Asociaciones Mejoradas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Mis Asociaciones</h3>
                  <p className="text-sm text-gray-500">Estado de membresías</p>
                </div>
              </div>

              <div className="space-y-4">
                {asociaciones?.length > 0 ? asociaciones.map((asociacion, index) => (
                  <motion.div
                    key={asociacion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                          <Building2 size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{asociacion.nombre}</h4>
                          <p className="text-xs text-gray-500">
                            {asociacion.estado === 'activo' 
                              ? `Vence: ${format(new Date(asociacion.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}`
                              : `Venció: ${format(new Date(asociacion.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 line-clamp-2">{asociacion.descripcion}</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(asociacion.estado)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColorClass(asociacion.estado)}`}>
                          {asociacion.estado === 'activo' ? 'Activo' : 'Vencido'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay asociaciones disponibles</p>
                  </div>
                )}
              </div>

              {/* Resumen mejorado */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {asociaciones?.filter(a => a.estado === 'activo').length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Activas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {asociaciones?.filter(a => a.estado === 'vencido').length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Vencidas</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Acciones Rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500" />
                Acciones Rápidas
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<QrCode size={16} />}
                  onClick={() => setQrModalOpen(true)}
                  className="justify-start"
                >
                  Ver mi código QR
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Download size={16} />}
                  onClick={handleExportData}
                  className="justify-start"
                >
                  Exportar mis datos
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Share2 size={16} />}
                  className="justify-start"
                >
                  Compartir perfil
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<HelpCircle size={16} />}
                  className="justify-start"
                >
                  Centro de ayuda
                </Button>
              </div>
            </motion.div>

            {/* Consejos y Tips Mejorados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-3xl p-6"
            >
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-600" />
                Consejos para tu perfil
              </h3>
              <ul className="text-sm text-blue-800 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <span>Mantén tu información actualizada para recibir beneficios personalizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone size={12} className="text-white" />
                  </div>
                  <span>Verifica que tu teléfono esté correcto para notificaciones importantes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle size={12} className="text-white" />
                  </div>
                  <span>Contacta a tu asociación si tienes problemas con tu membresía</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp size={12} className="text-white" />
                  </div>
                  <span>Usa más beneficios para subir de nivel y obtener mejores descuentos</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Modal de Edición de Perfil Mejorado */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Edit3 size={24} className="text-indigo-600" />
                Editar Perfil
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <Input
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Tu nombre completo"
                required
                icon={<User size={16} />}
              />

              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Tu número de teléfono"
                icon={<Phone size={16} />}
              />

              <Input
                label="DNI"
                value={formData.dni}
                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                placeholder="Tu número de documento"
                icon={<CreditCard size={16} />}
              />

              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Tu dirección"
                icon={<MapPin size={16} />}
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

        {/* Modal de Configuración Mejorado */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Settings size={24} className="text-indigo-600" />
                Configuración de Cuenta
              </DialogTitle>
            </DialogHeader>

            {/* Tabs de configuración */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                {[
                  { id: 'general', label: 'General', icon: <Settings size={16} /> },
                  { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={16} /> },
                  { id: 'privacidad', label: 'Privacidad', icon: <Shield size={16} /> },
                  { id: 'avanzado', label: 'Avanzado', icon: <Palette size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Tab General */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe size={16} />
                      Preferencias Generales
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                        <select
                          value={configuracion.idioma}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, idioma: e.target.value as 'es' | 'en' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                        <select
                          value={configuracion.moneda}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, moneda: e.target.value as 'ARS' | 'USD' | 'EUR' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="ARS">Peso Argentino (ARS)</option>
                          <option value="USD">Dólar Estadounidense (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Notificaciones */}
              {activeTab === 'notificaciones' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell size={16} />
                      Configuración de Notificaciones
                    </h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones generales</span>
                            <p className="text-xs text-gray-500">Recibir todas las notificaciones</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificaciones}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificaciones: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones push</span>
                            <p className="text-xs text-gray-500">Notificaciones en el dispositivo</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificacionesPush}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesPush: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones por email</span>
                            <p className="text-xs text-gray-500">Recibir emails informativos</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificacionesEmail}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesEmail: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones SMS</span>
                            <p className="text-xs text-gray-500">Mensajes de texto importantes</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificacionesSMS}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesSMS: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Privacidad */}
              {activeTab === 'privacidad' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={16} />
                      Configuración de Privacidad
                    </h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Perfil público</span>
                            <p className="text-xs text-gray-500">Permitir que otros vean tu perfil</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.perfilPublico}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, perfilPublico: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TrendingUp size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Mostrar estadísticas</span>
                            <p className="text-xs text-gray-500">Mostrar tus estadísticas públicamente</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.mostrarEstadisticas}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarEstadisticas: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Mostrar actividad</span>
                            <p className="text-xs text-gray-500">Mostrar tu actividad reciente</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.mostrarActividad}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarActividad: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Share2 size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Compartir datos</span>
                            <p className="text-xs text-gray-500">Permitir compartir datos con socios</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.compartirDatos}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, compartirDatos: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Avanzado */}
              {activeTab === 'avanzado' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette size={16} />
                      Configuración Avanzada
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tema de la aplicación</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
                            { value: 'dark', label: 'Oscuro', icon: <Moon size={16} /> },
                            { value: 'auto', label: 'Automático', icon: <Laptop size={16} /> }
                          ].map((tema) => (
                            <button
                              key={tema.value}
                              onClick={() => setConfiguracion(prev => ({ ...prev, tema: tema.value as any }))}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                configuracion.tema === tema.value
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {tema.icon}
                              <span className="text-sm font-medium">{tema.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zona horaria</label>
                        <select
                          value={configuracion.timezone}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                          <option value="America/New_York">Nueva York (GMT-5)</option>
                          <option value="Europe/Madrid">Madrid (GMT+1)</option>
                          <option value="Asia/Tokyo">Tokio (GMT+9)</option>
                        </select>
                      </div>

                      {/* Acciones de cuenta */}
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-3">Acciones de cuenta</h5>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Download size={16} />}
                            onClick={handleExportData}
                            className="justify-start"
                          >
                            Exportar todos mis datos
                          </Button>
                          
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<RotateCcw size={16} />}
                            className="justify-start"
                          >
                            Restablecer configuración
                          </Button>
                          
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Archive size={16} />}
                            className="justify-start text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                          >
                            Archivar cuenta
                          </Button>
                          
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Trash2 size={16} />}
                            className="justify-start text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Eliminar cuenta
                          </Button>
                        </div>
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
                onClick={handleSaveConfig}
                loading={refreshing}
                leftIcon={<Save size={16} />}
              >
                Guardar Configuración
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Avatar */}
        <Dialog open={avatarModalOpen} onClose={() => setAvatarModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Camera size={24} className="text-indigo-600" />
                Cambiar Avatar
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Vista previa del avatar actual */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-3">Avatar actual</p>
              </div>

              {/* Opciones de avatar */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Upload size={16} />}
                  className="justify-start"
                >
                  Subir nueva imagen
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Camera size={16} />}
                  className="justify-start"
                >
                  Tomar foto
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<User size={16} />}
                  className="justify-start"
                >
                  Usar avatar por defecto
                </Button>
              </div>

              {/* Avatares predefinidos */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Avatares predefinidos</p>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <button
                      key={i}
                      className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                    >
                      <User size={24} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAvatarModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
              <Button 
                leftIcon={<Save size={16} />}
              >
                Guardar Avatar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de QR */}
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <QrCode size={24} className="text-indigo-600" />
                Mi Código QR
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-center">
              {/* QR Code */}
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 mx-auto inline-block">
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                  <QrCode size={120} className="text-gray-400" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Código de Socio</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muestra este código QR en los comercios para validar tus beneficios
                </p>
                
                {/* ID de usuario */}
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-600">
                    {user?.uid?.slice(0, 8)}...{user?.uid?.slice(-8)}
                  </span>
                  <button
                    onClick={handleCopyUserId}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Download size={16} />}
                >
                  Descargar
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Share2 size={16} />}
                >
                  Compartir
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setQrModalOpen(false)}
                leftIcon={<X size={16} />}
                fullWidth
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Actividad Completa */}
        <Dialog open={activityModalOpen} onClose={() => setActivityModalOpen(false)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Activity size={24} className="text-indigo-600" />
                Historial de Actividad
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Filtros */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar actividad..."
                    icon={<Search size={16} />}
                  />
                </div>
                <Button
                  variant="outline"
                  leftIcon={<Filter size={16} />}
                >
                  Filtros
                </Button>
              </div>

              {/* Lista de actividad completa */}
              <div className="space-y-4">
                {actividadReciente.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.icono}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{item.titulo}</h4>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {format(item.fecha, 'dd/MM/yyyy HH:mm', { locale: es })}
                          </p>
                          {item.valor && (
                            <p className="text-sm font-bold text-green-600">
                              +${item.valor}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{item.descripcion}</p>
                      {item.comercio && (
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{item.comercio}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<MoreVertical size={16} />}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Paginación */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Mostrando {actividadReciente.length} de {actividadReciente.length} actividades
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActivityModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cerrar
              </Button>
              <Button
                leftIcon={<Download size={16} />}
              >
                Exportar Historial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
