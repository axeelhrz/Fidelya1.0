'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Mail, 
  Phone, 
  Calendar, 
  Settings,
  Save,
  X,
  RefreshCw,
  Building2,
  CheckCircle,
  Award,
  Camera,
  Download,
  Star,
  Crown,
  QrCode,
  Share2,
  Cake,
  Home,
  IdCard,
  Upload,
  Check,
  Copy,
  Loader2,
  TrendingUp,
  Gift,
  Wallet,
  Target,
  BarChart3,
  Activity,
  Bell,
  Shield,
  Globe,
  Sun,
  Moon,
  Laptop,
  Languages,
  DollarSign,
  Clock3,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  Zap,
  Sparkles,
  Diamond,
  Hexagon
} from 'lucide-react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { SocioConfiguration } from '@/types/socio';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Interfaces
interface ProfileFormData {
  nombre: string;
  telefono: string;
  dni: string;
  direccion: string;
  fechaNacimiento: string;
}

// Enhanced Futuristic Profile Image Uploader
const FuturisticProfileImageUploader: React.FC<{
  currentImage?: string;
  onImageUpload: (file: File) => Promise<string>;
  uploading?: boolean;
}> = ({ currentImage, onImageUpload, uploading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onImageUpload(selectedFile);
      setIsOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {/* Futuristic Avatar Container */}
          <div className="relative w-32 h-32">
            {/* Outer Ring with Animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      fill
                      sizes="128px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 size={24} className="text-white animate-spin" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </motion.button>

            {/* Decorative Elements */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </div>

      <Dialog open={isOpen} onClose={resetModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera size={20} />
              Cambiar Imagen
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {(previewImage || currentImage) && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={previewImage || currentImage || ''}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    fill
                    sizes="128px"
                    priority
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {previewImage ? 'Nueva imagen' : 'Imagen actual'}
                </p>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <Upload size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arrastra una imagen o haz clic para seleccionar
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Seleccionar archivo
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG hasta 5MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFileSelect(files[0]);
                }
              }}
              className="hidden"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetModal}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              loading={uploading}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Clean Stats Card
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
}> = ({ title, value, icon, color, change }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-3">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp size={14} />
          {change > 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  </div>
);

// Main Component
export default function CleanSocioPerfilPage() {
  const { user } = useAuth();
  const { 
    socio, 
    stats, 
    asociaciones, 
    loading, 
    updating, 
    uploadingImage,
    updateProfile, 
    updateConfiguration,
    uploadProfileImage,
    refreshData,
    exportData,
  } = useSocioProfile();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  
  // UI states
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'general' | 'notifications' | 'privacy'>('general');

  // Profile data with safe fallbacks
  const profileData = {
    nombre: socio?.nombre || user?.nombre || 'Usuario',
    email: socio?.email || user?.email || '',
    telefono: socio?.telefono || '',
    dni: socio?.dni || '',
    direccion: socio?.direccion || '',
    fechaNacimiento: socio?.fechaNacimiento?.toDate(),
    estado: socio?.estado || 'activo',
    creadoEn: socio?.creadoEn?.toDate() || new Date(),
    avatar: socio?.avatar || null,
    nivel: socio?.nivel || {
      nivel: 'Bronze',
      puntos: 0,
      puntosParaProximoNivel: 1000,
      proximoNivel: 'Silver',
      beneficiosDesbloqueados: [],
      descuentoAdicional: 0
    }
  };

  // Enhanced stats with safe fallbacks
  const enhancedStats = {
    beneficiosUsados: stats?.beneficiosUsados || 0,
    ahorroTotal: stats?.ahorroTotal || 0,
    beneficiosEsteMes: stats?.beneficiosEsteMes || 0,
    racha: stats?.racha || 0,
    comerciosVisitados: stats?.comerciosVisitados || 0,
    validacionesExitosas: stats?.validacionesExitosas || 95
  };

  // Configuration state
  const [configuracion, setConfiguracion] = useState<SocioConfiguration>({
    notificaciones: socio?.configuracion?.notificaciones ?? true,
    notificacionesPush: socio?.configuracion?.notificacionesPush ?? true,
    notificacionesEmail: socio?.configuracion?.notificacionesEmail ?? true,
    notificacionesSMS: socio?.configuracion?.notificacionesSMS ?? false,
    tema: socio?.configuracion?.tema ?? 'light',
    idioma: socio?.configuracion?.idioma ?? 'es',
    moneda: socio?.configuracion?.moneda ?? 'ARS',
    timezone: socio?.configuracion?.timezone ?? 'America/Argentina/Buenos_Aires',
    perfilPublico: socio?.configuracion?.perfilPublico ?? false,
    mostrarEstadisticas: socio?.configuracion?.mostrarEstadisticas ?? true,
    mostrarActividad: socio?.configuracion?.mostrarActividad ?? true,
    compartirDatos: socio?.configuracion?.compartirDatos ?? false,
    beneficiosFavoritos: socio?.configuracion?.beneficiosFavoritos ?? [],
    comerciosFavoritos: socio?.configuracion?.comerciosFavoritos ?? [],
    categoriasFavoritas: socio?.configuracion?.categoriasFavoritas ?? []
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
  React.useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || '',
        telefono: socio.telefono || '',
        dni: socio.dni || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento 
          ? format(socio.fechaNacimiento.toDate(), 'yyyy-MM-dd')
          : ''
      });
      
      if (socio.configuracion) {
        setConfiguracion(prev => ({
          ...prev,
          ...socio.configuracion
        }));
      }
    }
  }, [socio]);

  // Handlers
  const handleSaveProfile = async () => {
    try {
      if (!formData.nombre.trim()) {
        toast.error('El nombre es obligatorio');
        return;
      }

      const updateData: any = {
        nombre: formData.nombre.trim(),
      };

      if (formData.telefono.trim()) updateData.telefono = formData.telefono.trim();
      if (formData.dni.trim()) updateData.dni = formData.dni.trim();
      if (formData.direccion.trim()) updateData.direccion = formData.direccion.trim();
      if (formData.fechaNacimiento) updateData.fechaNacimiento = new Date(formData.fechaNacimiento);

      await updateProfile(updateData);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateConfiguration(configuracion);
      setConfigModalOpen(false);
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      toast.success('Datos actualizados');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Error al actualizar los datos');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user?.uid || '');
    setCopied(true);
    toast.success('ID copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportData = async () => {
    try {
      await exportData();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      return await uploadProfileImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Utility functions
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'vencido': return '#f59e0b';
      case 'inactivo': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return <Award size={20} />;
      case 'Silver': return <Star size={20} />;
      case 'Gold': return <Crown size={20} />;
      case 'Platinum': return <Zap size={20} />;
      case 'Diamond': return <Diamond size={20} />;
      default: return <Award size={20} />;
    }
  };

  const getNivelGradient = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return 'from-amber-600 to-orange-600';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-slate-400 to-slate-600';
      case 'Diamond': return 'from-cyan-400 to-blue-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeSection="perfil" sidebarComponent={SocioSidebar}>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeSection="perfil" sidebarComponent={SocioSidebar}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600">Gestiona tu información personal</p>
              </div>
              
              <div className="flex items-center gap-3">
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
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Card - ENHANCED FUTURISTIC DESIGN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Futuristic Profile Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden"
              >
                {/* Main Card Container */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute top-4 left-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-4 right-4 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-cyan-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                  </div>

                  {/* Geometric Decorations */}
                  <div className="absolute top-6 right-6 opacity-20">
                    <Hexagon size={24} className="text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div className="absolute bottom-6 left-6 opacity-20">
                    <Sparkles size={20} className="text-purple-400 animate-pulse" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <FuturisticProfileImageUploader
                          currentImage={profileData.avatar || undefined}
                          onImageUpload={handleImageUpload}
                          uploading={uploadingImage}
                        />
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">{profileData.nombre}</h2>
                          <p className="text-slate-300 text-lg mb-3">{profileData.email}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full animate-pulse"
                                style={{ backgroundColor: getStatusColor(profileData.estado) }}
                              />
                              <span className="text-slate-300 text-sm font-medium capitalize">{profileData.estado}</span>
                            </div>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <span className="text-slate-400 text-sm">
                              Socio desde {format(profileData.creadoEn, 'yyyy', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        leftIcon={<Edit3 size={16} />}
                        onClick={() => setEditModalOpen(true)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                      >
                        Editar
                      </Button>
                    </div>

                    {/* Futuristic Level Progress */}
                    <div className="relative">
                      {/* Level Card */}
                      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)} flex items-center justify-center shadow-lg`}>
                              {getNivelIcon(profileData.nivel.nivel)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-1">
                                Nivel {profileData.nivel.nivel}
                              </h3>
                              <p className="text-slate-300">
                                {profileData.nivel.puntos.toLocaleString()} puntos acumulados
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              Próximo: {profileData.nivel.proximoNivel}
                            </p>
                            <p className="text-slate-300 text-sm">
                              {profileData.nivel.puntosParaProximoNivel.toLocaleString()} puntos restantes
                            </p>
                          </div>
                        </div>
                        
                        {/* Futuristic Progress Bar */}
                        <div className="relative">
                          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)} relative overflow-hidden`}
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(profileData.nivel.puntos / (profileData.nivel.puntos + profileData.nivel.puntosParaProximoNivel)) * 100}%`
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                              {/* Animated Shine Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </motion.div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-slate-400">
                            <span>{profileData.nivel.puntos.toLocaleString()}</span>
                            <span>{(profileData.nivel.puntos + profileData.nivel.puntosParaProximoNivel).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Level Benefits */}
                        {profileData.nivel.beneficiosDesbloqueados.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-white/20">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                              <Sparkles size={16} />
                              Beneficios de tu nivel:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {profileData.nivel.beneficiosDesbloqueados.map((beneficio, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30"
                                >
                                  {beneficio}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Floating Elements */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <Mail size={16} className="text-blue-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                          <p className="font-medium text-white truncate">{profileData.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyUserId}
                          className="p-2 text-slate-400 hover:text-white"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </div>

                      {profileData.telefono && (
                        <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <Phone size={16} className="text-green-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Teléfono</p>
                            <p className="font-medium text-white">{profileData.telefono}</p>
                          </div>
                        </div>
                      )}

                      {profileData.dni && (
                        <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <IdCard size={16} className="text-purple-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">DNI</p>
                            <p className="font-medium text-white">{profileData.dni}</p>
                          </div>
                        </div>
                      )}

                      {profileData.direccion && (
                        <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <Home size={16} className="text-orange-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Dirección</p>
                            <p className="font-medium text-white">{profileData.direccion}</p>
                          </div>
                        </div>
                      )}

                      {profileData.fechaNacimiento && (
                        <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <Cake size={16} className="text-pink-400" />
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Fecha de Nacimiento</p>
                            <p className="font-medium text-white">
                              {format(profileData.fechaNacimiento, 'dd/MM/yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <Calendar size={16} className="text-cyan-400" />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Socio desde</p>
                          <p className="font-medium text-white">
                            {format(profileData.creadoEn, 'MMMM yyyy', { locale: es })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Statistics */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<BarChart3 size={16} />}
                  >
                    Ver detalles
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatsCard
                    title="Beneficios Usados"
                    value={enhancedStats.beneficiosUsados}
                    icon={<Gift size={16} />}
                    color="#3b82f6"
                    change={12}
                  />
                  <StatsCard
                    title="Total Ahorrado"
                    value={`$${enhancedStats.ahorroTotal.toLocaleString()}`}
                    icon={<Wallet size={16} />}
                    color="#10b981"
                    change={8}
                  />
                  <StatsCard
                    title="Este Mes"
                    value={enhancedStats.beneficiosEsteMes}
                    icon={<Calendar size={16} />}
                    color="#f59e0b"
                    change={-5}
                  />
                  <StatsCard
                    title="Días de Racha"
                    value={enhancedStats.racha}
                    icon={<Target size={16} />}
                    color="#ef4444"
                    change={15}
                  />
                  <StatsCard
                    title="Comercios"
                    value={enhancedStats.comerciosVisitados}
                    icon={<Building2 size={16} />}
                    color="#8b5cf6"
                    change={3}
                  />
                  <StatsCard
                    title="Tasa de Éxito"
                    value={`${enhancedStats.validacionesExitosas}%`}
                    icon={<CheckCircle size={16} />}
                    color="#10b981"
                    change={2}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<QrCode size={16} />}
                    onClick={() => setQrModalOpen(true)}
                    className="justify-start"
                  >
                    Mi Código QR
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<Settings size={16} />}
                    onClick={() => setConfigModalOpen(true)}
                    className="justify-start"
                  >
                    Configuración
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<Download size={16} />}
                    onClick={handleExportData}
                    className="justify-start"
                  >
                    Exportar Datos
                  </Button>
                </div>
              </div>

              {/* Associations */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asociaciones</h3>
                {asociaciones?.length > 0 ? (
                  <div className="space-y-3">
                    {asociaciones.map((asociacion) => (
                      <div key={asociacion.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{asociacion.nombre}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            asociacion.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {asociacion.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Vence: {format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Building2 size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Sin asociaciones</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals remain the same... */}
        {/* Edit Profile Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />

              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              />

              <Input
                label="DNI"
                value={formData.dni}
                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
              />

              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    fechaNacimiento: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} loading={updating}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configuration Modal */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configuración</DialogTitle>
            </DialogHeader>

            {/* Config Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'general', label: 'General', icon: <Globe size={16} /> },
                  { id: 'notifications', label: 'Notificaciones', icon: <Bell size={16} /> },
                  { id: 'privacy', label: 'Privacidad', icon: <Shield size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConfigTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeConfigTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
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
              {/* General Tab */}
              {activeConfigTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idioma
                      </label>
                      <select
                        value={configuracion.idioma}
                        onChange={(e) => setConfiguracion(prev => ({ ...prev, idioma: e.target.value as 'es' | 'en' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda
                      </label>
                      <select
                        value={configuracion.moneda}
                        onChange={(e) => setConfiguracion(prev => ({ ...prev, moneda: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ARS">Peso Argentino (ARS)</option>
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
                        { value: 'dark', label: 'Oscuro', icon: <Moon size={16} /> },
                        { value: 'auto', label: 'Auto', icon: <Laptop size={16} /> }
                      ].map((tema) => (
                        <button
                          key={tema.value}
                          onClick={() => setConfiguracion(prev => ({ ...prev, tema: tema.value as any }))}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            configuracion.tema === tema.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {tema.icon}
                          <span className="text-sm font-medium">{tema.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeConfigTab === 'notifications' && (
                <div className="space-y-4">
                  {[
                    { key: 'notificaciones', label: 'Notificaciones generales' },
                    { key: 'notificacionesPush', label: 'Notificaciones push' },
                    { key: 'notificacionesEmail', label: 'Notificaciones por email' },
                    { key: 'notificacionesSMS', label: 'Notificaciones SMS' }
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{notif.label}</span>
                      <button
                        onClick={() => setConfiguracion(prev => ({ 
                          ...prev, 
                          [notif.key]: !prev[notif.key as keyof SocioConfiguration] 
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          configuracion[notif.key as keyof SocioConfiguration] 
                            ? 'bg-blue-600' 
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            configuracion[notif.key as keyof SocioConfiguration] 
                              ? 'translate-x-6' 
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Privacy Tab */}
              {activeConfigTab === 'privacy' && (
                <div className="space-y-4">
                  {[
                    { key: 'perfilPublico', label: 'Perfil público' },
                    { key: 'mostrarEstadisticas', label: 'Mostrar estadísticas' },
                    { key: 'mostrarActividad', label: 'Mostrar actividad' },
                    { key: 'compartirDatos', label: 'Compartir datos anónimos' }
                  ].map((privacy) => (
                    <div key={privacy.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{privacy.label}</span>
                      <button
                        onClick={() => setConfiguracion(prev => ({ 
                          ...prev, 
                          [privacy.key]: !prev[privacy.key as keyof SocioConfiguration] 
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          configuracion[privacy.key as keyof SocioConfiguration] 
                            ? 'bg-blue-600' 
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            configuracion[privacy.key as keyof SocioConfiguration] 
                              ? 'translate-x-6' 
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveConfig} loading={updating}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QR Modal */}
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Mi Código QR</DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                <QrCode size={80} className="text-gray-400" />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Código de Socio</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muestra este código en los comercios para validar beneficios
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-600">
                    {user?.uid?.slice(0, 8)}...{user?.uid?.slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUserId}
                    className="p-1"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                  Descargar
                </Button>
                <Button variant="outline" fullWidth leftIcon={<Share2 size={16} />}>
                  Compartir
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setQrModalOpen(false)} fullWidth>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
