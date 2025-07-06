'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  XCircle,
  TrendingUp,
  Award,
  Activity,
  Bell,
  Shield,
  Palette,
  Camera,
  Download,
  Star,
  Zap,
  Crown,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  QrCode,
  Share2,
  RotateCcw,
  Archive,
  Trash2,
  Cake,
  Home,
  IdCard,
  Languages,
  DollarSign,
  Clock3,
  Shield as ShieldIcon,
  Database,
  BarChart3,
  Smartphone as DeviceIcon,
  MapPin,
  Eye,
  Filter,
  Search,
  ExternalLink,
  Info,
  AlertCircle,
  Gift,
  Calendar as CalendarIcon,
  Clock,
  Wallet,
  Maximize2,
  FileText,
  Image as ImageIcon,
  Upload,
  Lightbulb,
  Grid,
  List,
  ChevronDown,
  Loader2,
  TrendingDown,
  Move,
  Heart,
  Target,
  Flame,
  Users,
  ShoppingBag,
  CreditCard,
  Lock,
  Unlock,
  Plus,
  Minus,
  MoreHorizontal,
  Bookmark,
  Tag,
  Percent,
  Timer,
  Gauge,
  Fingerprint,
  Smartphone,
  Monitor,
  Tablet,
  Watch,
  Headphones
} from 'lucide-react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import ModernCard from '@/components/ui/ModernCard';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { SocioConfiguration, SocioActivity } from '@/types/socio';
import { format, differenceInDays, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Enhanced Interfaces
interface ProfileFormData {
  nombre: string;
  telefono: string;
  dni: string;
  direccion: string;
  fechaNacimiento: string;
  biografia?: string;
  sitioWeb?: string;
  redesSociales?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  action: () => void;
  badge?: string | number;
  disabled?: boolean;
  premium?: boolean;
}

interface ProfileStat {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  target?: number;
  unit?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Enhanced Profile Image Uploader Component
const EnhancedProfileImageUploader: React.FC<{
  currentImage?: string;
  onImageUpload: (file: File) => Promise<string>;
  uploading?: boolean;
}> = ({ currentImage, onImageUpload, uploading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 10MB');
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
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
      setCropMode(false);
      toast.success('Imagen actualizada exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setCropMode(false);
  };

  return (
    <>
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-40 h-40 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
            <div className="w-36 h-36 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  fill
                  sizes="144px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <User size={48} className="text-white" />
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={32} className="text-white animate-spin" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Camera size={20} />
            )}
          </motion.button>
        </motion.div>
      </div>

      <Dialog open={isOpen} onClose={resetModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
              Cambiar Imagen de Perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Preview Section */}
            {(previewImage || currentImage) && (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={previewImage || currentImage || ''}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    fill
                    sizes="192px"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  {previewImage ? 'Nueva imagen' : 'Imagen actual'}
                </p>
                
                {previewImage && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCropMode(!cropMode)}
                      leftIcon={<Edit3 size={16} />}
                    >
                      {cropMode ? 'Vista normal' : 'Recortar'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
                dragOver 
                  ? 'border-violet-500 bg-violet-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload size={32} className="text-gray-600" />
                </div>
                
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-gray-600 mb-6">
                    O haz clic para seleccionar un archivo
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<ImageIcon size={16} />}
                    size="lg"
                  >
                    Seleccionar Archivo
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <div>
                    <strong>Formatos:</strong> JPG, PNG, WebP, GIF
                  </div>
                  <div>
                    <strong>Tamaño máximo:</strong> 10MB
                  </div>
                </div>
              </div>
            </div>

            {/* Preset Avatars */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">O elige un avatar predeterminado</h4>
              <div className="grid grid-cols-6 gap-3">
                {[
                  { bg: 'from-red-500 to-pink-500', icon: <User size={20} /> },
                  { bg: 'from-blue-500 to-cyan-500', icon: <Star size={20} /> },
                  { bg: 'from-green-500 to-emerald-500', icon: <Zap size={20} /> },
                  { bg: 'from-purple-500 to-violet-500', icon: <Crown size={20} /> },
                  { bg: 'from-orange-500 to-red-500', icon: <Flame size={20} /> },
                  { bg: 'from-indigo-500 to-purple-500', icon: <Sparkles size={20} /> },
                ].map((avatar, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 bg-gradient-to-br ${avatar.bg} rounded-2xl flex items-center justify-center text-white hover:scale-105 transition-transform duration-200`}
                    onClick={() => {
                      // Here you would generate or select a preset avatar
                      toast.info('Función de avatares predeterminados próximamente');
                    }}
                  >
                    {avatar.icon}
                  </button>
                ))}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={resetModal}
              leftIcon={<X size={16} />}
            >
              Cancelar
            </Button>
            
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              loading={uploading}
              leftIcon={<Check size={16} />}
            >
              Guardar Imagen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Enhanced Activity Timeline Component
const EnhancedActivityTimeline: React.FC<{
  activities: SocioActivity[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}> = ({ activities, loading = false, onLoadMore, hasMore = false }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const getActivityIcon = (tipo: SocioActivity['tipo']) => {
    const icons = {
      beneficio: <Gift size={16} />,
      validacion: <QrCode size={16} />,
      registro: <User size={16} />,
      actualizacion: <Settings size={16} />,
      configuracion: <Settings size={16} />,
      pago: <CreditCard size={16} />,
      nivel: <Award size={16} />,
      logro: <Trophy size={16} />,
    };
    return icons[tipo] || <Activity size={16} />;
  };

  const getActivityColor = (tipo: SocioActivity['tipo']) => {
    const colors = {
      beneficio: '#10b981',
      validacion: '#6366f1',
      registro: '#8b5cf6',
      actualizacion: '#f59e0b',
      configuracion: '#6b7280',
      pago: '#3b82f6',
      nivel: '#f59e0b',
      logro: '#10b981',
    };
    return colors[tipo] || '#6b7280';
  };

  const getActivityBadge = (tipo: SocioActivity['tipo']) => {
    const badges = {
      beneficio: { text: 'Beneficio', color: 'bg-green-100 text-green-800' },
      validacion: { text: 'Validación', color: 'bg-blue-100 text-blue-800' },
      registro: { text: 'Registro', color: 'bg-purple-100 text-purple-800' },
      actualizacion: { text: 'Actualización', color: 'bg-yellow-100 text-yellow-800' },
      configuracion: { text: 'Configuración', color: 'bg-gray-100 text-gray-800' },
      pago: { text: 'Pago', color: 'bg-blue-100 text-blue-800' },
      nivel: { text: 'Nivel', color: 'bg-yellow-100 text-yellow-800' },
      logro: { text: 'Logro', color: 'bg-green-100 text-green-800' },
    };
    return badges[tipo] || { text: 'Actividad', color: 'bg-gray-100 text-gray-800' };
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.tipo === filter;
    const matchesSearch = searchTerm === '' || 
      activity.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: <Activity size={16} />, count: activities.length },
    { value: 'beneficio', label: 'Beneficios', icon: <Gift size={16} />, count: activities.filter(a => a.tipo === 'beneficio').length },
    { value: 'validacion', label: 'Validaciones', icon: <QrCode size={16} />, count: activities.filter(a => a.tipo === 'validacion').length },
    { value: 'pago', label: 'Pagos', icon: <CreditCard size={16} />, count: activities.filter(a => a.tipo === 'pago').length },
    { value: 'logro', label: 'Logros', icon: <Award size={16} />, count: activities.filter(a => a.tipo === 'logro').length },
  ];

  const renderTimelineView = () => (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-purple-500 to-pink-500"></div>
      
      <div className="space-y-8">
        {filteredActivities.map((activity, index) => {
          const badge = getActivityBadge(activity.tipo);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-6"
            >
              <div 
                className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${getActivityColor(activity.tipo)}, ${getActivityColor(activity.tipo)}dd)` }}
              >
                {getActivityIcon(activity.tipo)}
                
                {/* Pulse animation for recent activities */}
                {index < 3 && (
                  <div 
                    className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                    style={{ backgroundColor: getActivityColor(activity.tipo) }}
                  />
                )}
              </div>

              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{activity.titulo}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                        {badge.text}
                      </span>
                      {index < 3 && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{activity.descripcion}</p>
                    
                    {activity.metadata && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activity.metadata.comercioNombre && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building2 size={16} />
                            <span>{activity.metadata.comercioNombre}</span>
                          </div>
                        )}
                        
                        {activity.metadata.ubicacion && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={16} />
                            <span>{activity.metadata.ubicacion}</span>
                          </div>
                        )}
                        
                        {activity.metadata.montoDescuento && (
                          <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                            <TrendingUp size={16} />
                            <span>Ahorro: ${activity.metadata.montoDescuento}</span>
                          </div>
                        )}

                        {activity.metadata.puntosGanados && (
                          <div className="flex items-center gap-2 text-sm text-purple-600 font-semibold">
                            <Star size={16} />
                            <span>+{activity.metadata.puntosGanados} puntos</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {format(activity.fecha.toDate(), 'HH:mm', { locale: es })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(activity.fecha.toDate(), 'dd MMM yyyy', { locale: es })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hace {differenceInDays(new Date(), activity.fecha.toDate())} días
                    </p>
                  </div>
                </div>
                
                {(activity.metadata?.comercioId || activity.metadata?.beneficioId) && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink size={14} />}
                        className="text-xs"
                      >
                        Ver detalles
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Share2 size={14} />}
                        className="text-xs"
                      >
                        Compartir
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Heart size={14} className="text-gray-400 hover:text-red-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Bookmark size={14} className="text-gray-400 hover:text-blue-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredActivities.map((activity, index) => {
        const badge = getActivityBadge(activity.tipo);
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: getActivityColor(activity.tipo) }}
              >
                {getActivityIcon(activity.tipo)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                {badge.text}
              </span>
            </div>
            
            <h4 className="font-bold text-gray-900 mb-2">{activity.titulo}</h4>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.descripcion}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{format(activity.fecha.toDate(), 'dd/MM/yyyy', { locale: es })}</span>
              {activity.metadata?.montoDescuento && (
                <span className="text-green-600 font-semibold">
                  +${activity.metadata.montoDescuento}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Actividad Reciente</h3>
            <p className="text-gray-600">
              {filteredActivities.length} de {activities.length} actividades
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'timeline' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid size={16} />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}
          >
            Filtros
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-2xl p-6"
          >
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en tu actividad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === option.value
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                        : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      filter === option.value ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-purple-500" />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Activity size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay actividad
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filter !== 'all' 
              ? 'No se encontraron actividades con los filtros aplicados'
              : 'Aún no tienes actividad registrada'
            }
          </p>
          {(searchTerm || filter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              leftIcon={<RotateCcw size={16} />}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'timeline' ? renderTimelineView() : renderGridView()}
          
          {hasMore && (
            <div className="text-center pt-8">
              <Button
                variant="outline"
                onClick={onLoadMore}
                loading={loading}
                leftIcon={<ChevronDown size={16} />}
                size="lg"
              >
                Cargar más actividades
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Enhanced Achievements Component
const AchievementsSection: React.FC<{
  achievements: Achievement[];
  onViewAll: () => void;
}> = ({ achievements, onViewAll }) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const recentAchievements = unlockedAchievements
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity];
  };

  const getRarityGradient = (rarity: Achievement['rarity']) => {
    const gradients = {
      common: 'from-gray-500 to-gray-600',
      rare: 'from-blue-500 to-blue-600',
      epic: 'from-purple-500 to-purple-600',
      legendary: 'from-yellow-500 to-orange-500'
    };
    return gradients[rarity];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Award size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Logros</h3>
            <p className="text-sm text-gray-600">
              {unlockedAchievements.length} de {achievements.length} desbloqueados
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAll}
          leftIcon={<ExternalLink size={16} />}
        >
          Ver todos
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
          style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
        />
      </div>

      {/* Recent Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
            style={{ borderColor: `${getRarityColor(achievement.rarity)}40` }}
          >
            {/* Rarity indicator */}
            <div 
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRarityGradient(achievement.rarity)}`}
            />
            
            <div className="text-center">
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white bg-gradient-to-r ${getRarityGradient(achievement.rarity)}`}
              >
                {achievement.icon}
              </div>
              
              <h4 className="font-bold text-gray-900 mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              
              {achievement.unlockedAt && (
                <p className="text-xs text-gray-500">
                  Desbloqueado {format(achievement.unlockedAt, 'dd/MM/yyyy', { locale: es })}
                </p>
              )}
              
              <span 
                className="inline-block px-2 py-1 rounded-full text-xs font-bold text-white mt-2"
                style={{ backgroundColor: getRarityColor(achievement.rarity) }}
              >
                {achievement.rarity.toUpperCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {recentAchievements.length === 0 && (
        <div className="text-center py-8">
          <Award size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aún no has desbloqueado logros</p>
          <p className="text-sm text-gray-400">¡Sigue usando beneficios para desbloquear logros!</p>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function EnhancedSocioPerfilPage() {
  const { user } = useAuth();
  const { 
    socio, 
    stats, 
    asociaciones, 
    activity,
    loading, 
    updating, 
    uploadingImage,
    updateProfile, 
    updateConfiguration,
    uploadProfileImage,
    refreshData,
    exportData,
  } = useSocioProfile();

  // Estados de modales
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  
  // Estados de UI
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notificaciones' | 'privacidad' | 'avanzado'>('general');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Datos del perfil con fallbacks mejorados
  const profileData = {
    nombre: socio?.nombre || user?.nombre || 'Usuario',
    email: socio?.email || user?.email || '',
    telefono: socio?.telefono || '',
    dni: socio?.dni || '',
    direccion: socio?.direccion || '',
    fechaNacimiento: socio?.fechaNacimiento?.toDate(),
    estado: socio?.estado || 'activo',
    creadoEn: socio?.creadoEn?.toDate() || new Date(),
    ultimoAcceso: socio?.ultimoAcceso?.toDate() || new Date(),
    avatar: socio?.avatar || null,
    avatarThumbnail: socio?.avatarThumbnail || null,
    biografia: socio?.biografia || '',
    sitioWeb: socio?.sitioWeb || '',
    redesSociales: socio?.redesSociales || {},
    nivel: socio?.nivel || {
      nivel: 'Bronze',
      puntos: 0,
      puntosParaProximoNivel: 1000,
      proximoNivel: 'Silver',
      beneficiosDesbloqueados: [],
      descuentoAdicional: 0
    }
  };

  // Estadísticas mejoradas
  const enhancedStats = {
    beneficiosUsados: stats?.beneficiosUsados || 0,
    ahorroTotal: stats?.ahorroTotal || 0,
    beneficiosEsteMes: stats?.beneficiosEsteMes || 0,
    asociacionesActivas: stats?.asociacionesActivas || 0,
    racha: stats?.racha || 0,
    comerciosVisitados: stats?.comerciosVisitados || 0,
    validacionesExitosas: stats?.validacionesExitosas || 95,
    descuentoPromedio: stats?.descuentoPromedio || 0,
    ahorroEsteMes: stats?.ahorroEsteMes || 0,
    beneficiosFavoritos: stats?.beneficiosFavoritos || 0,
    tiempoComoSocio: stats?.tiempoComoSocio || 0,
    actividadPorMes: stats?.actividadPorMes || {},
    beneficiosPorCategoria: stats?.beneficiosPorCategoria || {},
    comerciosMasVisitados: stats?.comerciosMasVisitados || [],
    puntosGanados: stats?.puntosGanados || 0,
    rankingPosicion: stats?.rankingPosicion || 0,
    metaMensual: stats?.metaMensual || 10,
    progresoMeta: stats?.progresoMeta || 0
  };

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primer Beneficio',
      description: 'Usa tu primer beneficio',
      icon: <Gift size={20} />,
      color: '#10b981',
      unlocked: enhancedStats.beneficiosUsados > 0,
      unlockedAt: enhancedStats.beneficiosUsados > 0 ? new Date() : undefined,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Ahorrador Experto',
      description: 'Ahorra más de $10,000',
      icon: <Wallet size={20} />,
      color: '#3b82f6',
      unlocked: enhancedStats.ahorroTotal > 10000,
      unlockedAt: enhancedStats.ahorroTotal > 10000 ? new Date() : undefined,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Racha de Fuego',
      description: 'Mantén una racha de 30 días',
      icon: <Flame size={20} />,
      color: '#f59e0b',
      unlocked: enhancedStats.racha >= 30,
      unlockedAt: enhancedStats.racha >= 30 ? new Date() : undefined,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Maestro de Beneficios',
      description: 'Usa 100 beneficios',
      icon: <Crown size={20} />,
      color: '#8b5cf6',
      unlocked: enhancedStats.beneficiosUsados >= 100,
      unlockedAt: enhancedStats.beneficiosUsados >= 100 ? new Date() : undefined,
      rarity: 'legendary'
    }
  ];

  // Configuración
  const [configuracion] = useState<SocioConfiguration>({
    notificaciones: socio?.configuracion?.notificaciones || true,
    notificacionesPush: socio?.configuracion?.notificacionesPush || true,
    notificacionesEmail: socio?.configuracion?.notificacionesEmail || true,
    notificacionesSMS: socio?.configuracion?.notificacionesSMS || false,
    tema: socio?.configuracion?.tema || 'light',
    idioma: socio?.configuracion?.idioma || 'es',
    moneda: socio?.configuracion?.moneda || 'ARS',
    timezone: socio?.configuracion?.timezone || 'America/Argentina/Buenos_Aires',
    perfilPublico: socio?.configuracion?.perfilPublico || false,
    mostrarEstadisticas: socio?.configuracion?.mostrarEstadisticas || true,
    mostrarActividad: socio?.configuracion?.mostrarActividad || true,
    compartirDatos: socio?.configuracion?.compartirDatos || false,
    beneficiosFavoritos: socio?.configuracion?.beneficiosFavoritos || [],
    comerciosFavoritos: socio?.configuracion?.comerciosFavoritos || [],
    categoriasFavoritas: socio?.configuracion?.categoriasFavoritas || []
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: '',
    telefono: '',
    dni: '',
    direccion: '',
    fechaNacimiento: '',
    biografia: '',
    sitioWeb: '',
    redesSociales: {
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  // Actualizar datos del formulario
  useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || '',
        telefono: socio.telefono || '',
        dni: socio.dni || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento 
          ? format(socio.fechaNacimiento.toDate(), 'yyyy-MM-dd')
          : '',
        biografia: socio.biografia || '',
        sitioWeb: socio.sitioWeb || '',
        redesSociales: {
          instagram: socio.redesSociales?.instagram || '',
          twitter: socio.redesSociales?.twitter || '',
          linkedin: socio.redesSociales?.linkedin || ''
        }
      });
      
      if (socio.configuracion) {
        setConfiguracion(prev => ({
          ...prev,
          ...socio.configuracion
        }));
      }
    }
  }, [socio]);

  // Estadísticas del perfil mejoradas
  const profileStats: ProfileStat[] = [
    {
      id: 'beneficios',
      title: 'Beneficios Usados',
      value: enhancedStats.beneficiosUsados,
      icon: <Gift size={24} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      change: 12,
      trend: 'up',
      description: 'Total de beneficios utilizados',
      target: enhancedStats.metaMensual,
      unit: 'beneficios'
    },
    {
      id: 'ahorro',
      title: 'Total Ahorrado',
      value: `$${enhancedStats.ahorroTotal.toLocaleString()}`,
      icon: <Wallet size={24} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: 8,
      trend: 'up',
      description: 'Dinero ahorrado en total',
      unit: 'pesos'
    },
    {
      id: 'mes',
      title: 'Este Mes',
      value: enhancedStats.beneficiosEsteMes,
      icon: <CalendarIcon size={24} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: -5,
      trend: 'down',
      description: 'Beneficios usados este mes',
      target: enhancedStats.metaMensual,
      unit: 'beneficios'
    },
    {
      id: 'racha',
      title: 'Días de Racha',
      value: enhancedStats.racha,
      icon: <Flame size={24} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      change: 15,
      trend: 'up',
      description: 'Días consecutivos activo',
      target: 30,
      unit: 'días'
    },
    {
      id: 'comercios',
      title: 'Comercios Visitados',
      value: enhancedStats.comerciosVisitados,
      icon: <Building2 size={24} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      change: 3,
      trend: 'up',
      description: 'Comercios únicos visitados',
      unit: 'comercios'
    },
    {
      id: 'validaciones',
      title: 'Tasa de Éxito',
      value: `${enhancedStats.validacionesExitosas}%`,
      icon: <Target size={24} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: 2,
      trend: 'up',
      description: 'Validaciones exitosas',
      target: 100,
      unit: 'porcentaje'
    },
    {
      id: 'puntos',
      title: 'Puntos Ganados',
      value: enhancedStats.puntosGanados,
      icon: <Star size={24} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      change: 25,
      trend: 'up',
      description: 'Puntos acumulados este año',
      unit: 'puntos'
    },
    {
      id: 'ranking',
      title: 'Posición Ranking',
      value: enhancedStats.rankingPosicion || 'N/A',
      icon: <Award size={24} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: -2,
      trend: 'up',
      description: 'Tu posición en el ranking',
      unit: 'posición'
    }
  ];

  // Acciones rápidas mejoradas
  const quickActions: QuickAction[] = [
    {
      id: 'qr',
      title: 'Mi Código QR',
      description: 'Ver y compartir mi código QR personal',
      icon: <QrCode size={20} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      action: () => setQrModalOpen(true)
    },
    {
      id: 'export',
      title: 'Exportar Datos',
      description: 'Descargar toda mi información',
      icon: <Download size={20} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: handleExportData
    },
    {
      id: 'config',
      title: 'Configuración',
      description: 'Ajustar preferencias y privacidad',
      icon: <Settings size={20} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => setConfigModalOpen(true)
    },
    {
      id: 'activity',
      title: 'Ver Actividad',
      description: 'Historial completo de acciones',
      icon: <Activity size={20} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => setActivityModalOpen(true),
      badge: activity.length
    },
    {
      id: 'stats',
      title: 'Estadísticas',
      description: 'Análisis detallado de tu actividad',
      icon: <BarChart3 size={20} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      action: () => setStatsModalOpen(true)
    },
    {
      id: 'achievements',
      title: 'Mis Logros',
      description: 'Ver logros desbloqueados',
      icon: <Award size={20} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => setAchievementsModalOpen(true),
      badge: achievements.filter(a => a.unlocked).length,
      premium: true
    },
    {
      id: 'help',
      title: 'Centro de Ayuda',
      description: 'Soporte técnico y guías',
      icon: <HelpCircle size={20} />,
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      action: () => window.open('/help', '_blank')
    },
    {
      id: 'feedback',
      title: 'Enviar Feedback',
      description: 'Comparte tu opinión',
      icon: <Heart size={20} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      action: () => toast.info('Función de feedback próximamente')
    }
  ];

  // Handlers
  const handleSaveProfile = async () => {
    try {
      if (!formData.nombre.trim()) {
        toast.error('El nombre es obligatorio');
        return;
      }

      interface UpdateProfileData {
        nombre: string;
        telefono?: string;
        dni?: string;
        direccion?: string;
        fechaNacimiento?: Date;
        biografia?: string;
        sitioWeb?: string;
        redesSociales?: {
          instagram?: string;
          twitter?: string;
          linkedin?: string;
        };
      }

      const updateData: UpdateProfileData = {
        nombre: formData.nombre.trim(),
      };

      if (formData.telefono.trim()) {
        updateData.telefono = formData.telefono.trim();
      }

      if (formData.dni.trim()) {
        updateData.dni = formData.dni.trim();
      }

      if (formData.direccion.trim()) {
        updateData.direccion = formData.direccion.trim();
      }

      if (formData.fechaNacimiento) {
        updateData.fechaNacimiento = new Date(formData.fechaNacimiento);
      }

      if (formData.biografia?.trim()) {
        updateData.biografia = formData.biografia.trim();
      }

      if (formData.sitioWeb?.trim()) {
        updateData.sitioWeb = formData.sitioWeb.trim();
      }

      if (formData.redesSociales) {
        updateData.redesSociales = {
          instagram: formData.redesSociales.instagram?.trim() || '',
          twitter: formData.redesSociales.twitter?.trim() || '',
          linkedin: formData.redesSociales.linkedin?.trim() || ''
        };
      }

      await updateProfile(updateData);
      setEditModalOpen(false);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateConfiguration(configuracion);
      setConfigModalOpen(false);
      toast.success('Configuración actualizada exitosamente');
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Error al actualizar la configuración');
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
    toast.success('ID de usuario copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleExportData() {
    try {
      await exportData();
      toast.success('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar los datos');
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      return await uploadProfileImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Utility functions
  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Socio Activo';
      case 'vencido': return 'Socio Vencido';
      case 'inactivo': return 'Socio Inactivo';
      case 'pendiente': return 'Pendiente de Activación';
      default: return 'Estado Desconocido';
    }
  };

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
      case 'Bronze': return <Award size={16} />;
      case 'Silver': return <Star size={16} />;
      case 'Gold': return <Crown size={16} />;
      case 'Platinum': return <Zap size={16} />;
      case 'Diamond': return <Sparkles size={16} />;
      default: return <Award size={16} />;
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

  const getNivelGradient = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return 'from-yellow-600 to-yellow-700';
      case 'Silver': return 'from-gray-400 to-gray-500';
      case 'Gold': return 'from-yellow-400 to-yellow-500';
      case 'Platinum': return 'from-gray-300 to-gray-400';
      case 'Diamond': return 'from-cyan-400 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={SocioSidebar}
      >
        <div className="p-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-3xl"></div>
                <div className="h-64 bg-gray-200 rounded-3xl"></div>
              </div>
              <div className="space-y-8">
                <div className="h-48 bg-gray-200 rounded-3xl"></div>
                <div className="h-64 bg-gray-200 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={SocioSidebar}
    >
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Enhanced Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User size={28} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Mi Perfil
                    </h1>
                    <p className="text-gray-600 font-medium text-lg">
                      Gestiona tu información personal y configuración
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="text-gray-600"
                >
                  {viewMode === 'grid' ? 'Lista' : 'Cuadrícula'}
                </Button>
                
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8 relative z-10">
          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Columna Principal - Perfil */}
            <div className="xl:col-span-2 space-y-8">
              {/* Tarjeta de Perfil Principal Mejorada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ModernCard variant="elevated" className="overflow-hidden">
                  {/* Header del perfil con gradiente mejorado */}
                  <div className="relative -m-8 mb-6 h-40 bg-gradient-to-r from-violet-500 via-purple-600 to-pink-500 rounded-t-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Patrón decorativo mejorado */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-24 h-24 border-2 border-white rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 right-12 w-20 h-20 border-2 border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-12 right-4 w-16 h-16 border-2 border-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                      <div className="absolute top-1/2 left-1/2 w-12 h-12 border-2 border-white rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
                    </div>
                    
                    {/* Acciones del header */}
                    <div className="absolute top-6 right-6 flex gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<QrCode size={16} />}
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        onClick={() => setQrModalOpen(true)}
                      >
                        Mi QR
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Settings size={16} />}
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        onClick={() => setConfigModalOpen(true)}
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>

                  {/* Contenido del perfil */}
                  <div className="relative">
                    {/* Avatar y acciones */}
                    <div className="flex items-start justify-between -mt-24 mb-8">
                      <div className="relative">
                        <EnhancedProfileImageUploader
                          currentImage={profileData.avatar || profileData.avatarThumbnail || undefined}
                          onImageUpload={handleImageUpload}
                          uploading={uploadingImage}
                        />
                        
                        {/* Badge de estado mejorado */}
                        <div 
                          className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: getStatusColor(profileData.estado) }}
                        >
                          <CheckCircle size={20} className="text-white" />
                        </div>

                        {/* Badge de nivel mejorado */}
                        <div 
                          className={`absolute -top-3 -right-3 px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-lg bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)}`}
                        >
                          {getNivelIcon(profileData.nivel.nivel)}
                          {profileData.nivel.nivel}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        leftIcon={<Edit3 size={16} />}
                        onClick={() => setEditModalOpen(true)}
                        className="mt-6"
                        size="lg"
                      >
                        Editar Perfil
                      </Button>
                    </div>

                    {/* Información del usuario mejorada */}
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-3">
                          {profileData.nombre}
                        </h2>
                        
                        {profileData.biografia && (
                          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                            {profileData.biografia}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          <span 
                            className="px-6 py-3 rounded-full text-sm font-bold border-2 flex items-center gap-3"
                            style={{ 
                              backgroundColor: `${getStatusColor(profileData.estado)}20`,
                              color: getStatusColor(profileData.estado),
                              borderColor: `${getStatusColor(profileData.estado)}40`
                            }}
                          >
                            <div 
                              className="w-3 h-3 rounded-full animate-pulse"
                              style={{ backgroundColor: getStatusColor(profileData.estado) }}
                            ></div>
                            {getStatusText(profileData.estado)}
                          </span>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={18} />
                            <span className="font-medium">
                              Socio desde {format(profileData.creadoEn, 'MMMM yyyy', { locale: es })}
                            </span>
                          </div>

                          {profileData.sitioWeb && (
                            <a
                              href={profileData.sitioWeb}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Globe size={16} />
                              Sitio web
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Progreso de nivel mejorado */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div 
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)} shadow-lg`}
                            >
                              {getNivelIcon(profileData.nivel.nivel)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">Nivel {profileData.nivel.nivel}</h3>
                              <p className="text-gray-600 font-medium">
                                {profileData.nivel.puntos.toLocaleString()} puntos acumulados
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              Próximo: {profileData.nivel.proximoNivel}
                            </p>
                            <p className="text-sm text-gray-600">
                              {profileData.nivel.puntosParaProximoNivel.toLocaleString()} puntos restantes
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="w-full bg-gray-300 rounded-full h-4">
                            <div 
                              className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r ${getNivelGradient(profileData.nivel.nivel)}`}
                              style={{ 
                                width: `${(profileData.nivel.puntos / (profileData.nivel.puntos + profileData.nivel.puntosParaProximoNivel)) * 100}%`
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
                            <span>{profileData.nivel.puntos.toLocaleString()}</span>
                            <span>{(profileData.nivel.puntos + profileData.nivel.puntosParaProximoNivel).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Beneficios del nivel */}
                        {profileData.nivel.beneficiosDesbloqueados.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3">Beneficios de tu nivel:</h4>
                            <div className="flex flex-wrap gap-2">
                              {profileData.nivel.beneficiosDesbloqueados.map((beneficio, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                >
                                  {beneficio}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Información de contacto mejorada */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Mail size={24} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">Email</p>
                            <p className="font-bold text-blue-800 truncate text-lg">{profileData.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyUserId}
                            className="p-3 hover:bg-blue-200"
                          >
                            {copied ? <Check size={20} className="text-blue-600" /> : <Copy size={20} className="text-blue-600" />}
                          </Button>
                        </div>

                        {profileData.telefono && (
                          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-3xl hover:from-green-100 hover:to-green-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Phone size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Teléfono</p>
                              <p className="font-bold text-green-800 text-lg">{profileData.telefono}</p>
                            </div>
                          </div>
                        )}

                        {profileData.dni && (
                          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-3xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <IdCard size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-purple-900 uppercase tracking-wide">DNI</p>
                              <p className="font-bold text-purple-800 text-lg">{profileData.dni}</p>
                            </div>
                          </div>
                        )}

                        {profileData.direccion && (
                          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Home size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-orange-900 uppercase tracking-wide">Dirección</p>
                              <p className="font-bold text-orange-800 text-lg">{profileData.direccion}</p>
                            </div>
                          </div>
                        )}

                        {profileData.fechaNacimiento && (
                          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-3xl hover:from-pink-100 hover:to-pink-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Cake size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-pink-900 uppercase tracking-wide">Fecha de Nacimiento</p>
                              <p className="font-bold text-pink-800 text-lg">
                                {format(profileData.fechaNacimiento, 'dd MMMM yyyy', { locale: es })}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Redes sociales */}
                        {(profileData.redesSociales?.instagram || profileData.redesSociales?.twitter || profileData.redesSociales?.linkedin) && (
                          <div className="md:col-span-2 p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-3xl">
                            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                              <Users size={20} />
                              Redes Sociales
                            </h4>
                            <div className="flex gap-4">
                              {profileData.redesSociales?.instagram && (
                                <a
                                  href={`https://instagram.com/${profileData.redesSociales.instagram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                                >
                                  <Camera size={16} />
                                  Instagram
                                </a>
                              )}
                              {profileData.redesSociales?.twitter && (
                                <a
                                  href={`https://twitter.com/${profileData.redesSociales.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                                >
                                  <Share2 size={16} />
                                  Twitter
                                </a>
                              )}
                              {profileData.redesSociales?.linkedin && (
                                <a
                                  href={`https://linkedin.com/in/${profileData.redesSociales.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-200"
                                >
                                  <Users size={16} />
                                  LinkedIn
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>

              {/* Estadísticas Mejoradas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <ModernCard variant="elevated">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <BarChart3 size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-gray-900">Estadísticas</h3>
                        <p className="text-gray-600 font-medium text-lg">Tu rendimiento como socio</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Activity size={16} />}
                        onClick={() => setActivityModalOpen(true)}
                      >
                        Ver Actividad
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Maximize2 size={16} />}
                        onClick={() => setStatsModalOpen(true)}
                      >
                        Expandir
                      </Button>
                    </div>
                  </div>

                  <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {profileStats.map((stat) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 relative overflow-hidden"
                        onClick={() => setStatsModalOpen(true)}
                      >
                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-5"
                          style={{ background: stat.gradient }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div 
                              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                              style={{ background: stat.gradient }}
                            >
                              {stat.icon}
                            </div>
                            
                            {stat.change !== undefined && (
                              <div className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ backgroundColor: `${stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#6b7280'}20` }}>
                                <div style={{ color: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#6b7280' }}>
                                  {stat.trend === 'up' && <TrendingUp size={14} />}
                                  {stat.trend === 'down' && <TrendingDown size={14} />}
                                  {stat.trend === 'neutral' && <Move size={14} />}
                                </div>
                                <span className="text-sm font-bold" style={{ color: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#6b7280' }}>
                                  {stat.change > 0 ? '+' : ''}{stat.change}%
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                            <p className="text-3xl font-black text-gray-900">
                              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </p>
                            {stat.description && (
                              <p className="text-sm text-gray-600">{stat.description}</p>
                            )}
                          </div>
                          
                          {/* Progress bar para metas */}
                          {stat.target && (
                            <div className="mt-4">
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Progreso</span>
                                <span>{Math.round((Number(stat.value.toString().replace(/[^0-9]/g, '')) / stat.target) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${Math.min((Number(stat.value.toString().replace(/[^0-9]/g, '')) / stat.target) * 100, 100)}%`,
                                    background: stat.gradient
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ModernCard>
              </motion.div>

              {/* Logros */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <ModernCard variant="elevated">
                  <AchievementsSection
                    achievements={achievements}
                    onViewAll={() => setAchievementsModalOpen(true)}
                  />
                </ModernCard>
              </motion.div>

              {/* Actividad Reciente Mejorada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <ModernCard variant="elevated">
                  <EnhancedActivityTimeline
                    activities={activity.slice(0, 5)}
                    loading={loading}
                    onLoadMore={() => setActivityModalOpen(true)}
                    hasMore={activity.length > 5}
                  />
                </ModernCard>
              </motion.div>
            </div>

            {/* Columna Lateral Mejorada */}
            <div className="space-y-8">
              {/* Mis Asociaciones Mejoradas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <ModernCard variant="elevated">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Mis Asociaciones</h3>
                      <p className="text-gray-600">Estado de membresías activas</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {asociaciones?.length > 0 ? asociaciones.map((asociacion, index) => (
                      <motion.div
                        key={asociacion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                              {asociacion.logo ? (
                                <Image
                                  src={asociacion.logo}
                                  alt={asociacion.nombre}
                                  width={40}
                                  height={40}
                                  className="object-cover rounded-xl"
                                  unoptimized
                                />
                              ) : (
                                <Building2 size={24} className="text-gray-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{asociacion.nombre}</h4>
                              <p className="text-sm text-gray-600">
                                {asociacion.estado === 'activo' 
                                  ? `Vence: ${format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}`
                                  : `Venció: ${format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}`
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {asociacion.estado === 'activo' ? 
                              <CheckCircle size={20} className="text-green-500" /> : 
                              <XCircle size={20} className="text-red-500" />
                            }
                            <span 
                              className="px-4 py-2 rounded-full text-sm font-bold"
                              style={{
                                backgroundColor: asociacion.estado === 'activo' ? '#dcfce7' : '#fee2e2',
                                color: asociacion.estado === 'activo' ? '#166534' : '#991b1b'
                              }}
                            >
                              {asociacion.estado === 'activo' ? 'Activo' : 'Vencido'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-200">
                          <div className="p-3 bg-white rounded-2xl">
                            <div className="text-2xl font-black text-violet-600">{asociacion.beneficiosIncluidos}</div>
                            <div className="text-xs text-gray-600 font-medium">Beneficios</div>
                          </div>
                          <div className="p-3 bg-white rounded-2xl">
                            <div className="text-2xl font-black text-green-600">{asociacion.descuentoMaximo}%</div>
                            <div className="text-xs text-gray-600 font-medium">Desc. Máx.</div>
                          </div>
                          <div className="p-3 bg-white rounded-2xl">
                            <div className="text-2xl font-black text-purple-600">{asociacion.comerciosAfiliados}</div>
                            <div className="text-xs text-gray-600 font-medium">Comercios</div>
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-12">
                        <Building2 size={64} className="text-gray-300 mx-auto mb-6" />
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No hay asociaciones</h4>
                        <p className="text-gray-600 mb-6">Únete a una asociación para acceder a beneficios exclusivos</p>
                        <Button
                          variant="outline"
                          leftIcon={<Plus size={16} />}
                        >
                          Buscar Asociaciones
                        </Button>
                      </div>
                    )}
                  </div>

                  {asociaciones?.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="p-4 bg-green-50 rounded-2xl">
                          <div className="text-3xl font-black text-green-600">
                            {asociaciones.filter(a => a.estado === 'activo').length}
                          </div>
                          <div className="text-sm text-green-700 font-medium">Activas</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-2xl">
                          <div className="text-3xl font-black text-red-600">
                            {asociaciones.filter(a => a.estado === 'vencido').length}
                          </div>
                          <div className="text-sm text-red-700 font-medium">Vencidas</div>
                        </div>
                      </div>
                    </div>
                  )}
                </ModernCard>
              </motion.div>

              {/* Acciones Rápidas Mejoradas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <ModernCard variant="elevated">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h3>
                      <p className="text-gray-600">Funciones principales</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.action}
                        disabled={action.disabled}
                        className={`w-full flex items-center gap-4 p-6 rounded-3xl transition-all duration-300 group relative overflow-hidden ${
                          action.disabled 
                            ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 cursor-pointer'
                        }`}
                      >
                        {/* Background gradient on hover */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                          style={{ background: action.gradient }}
                        />

                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg relative z-10"
                          style={{ background: action.gradient }}
                        >
                          {action.icon}
                          {action.premium && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Crown size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 text-left relative z-10">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-gray-900 text-lg">{action.title}</h4>
                            {action.badge && (
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                                style={{ background: action.gradient }}
                              >
                                {action.badge}
                              </span>
                            )}
                            {action.premium && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 font-medium">{action.description}</p>
                        </div>
                        
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors relative z-10" />
                      </motion.button>
                    ))}
                  </div>
                </ModernCard>
              </motion.div>

              {/* Consejos y Tips Mejorados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <ModernCard variant="glass">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lightbulb size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Consejos Personalizados</h3>
                      <p className="text-gray-600">Para optimizar tu experiencia</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl border border-blue-200">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">Mantén tu información actualizada</h4>
                        <p className="text-blue-800 leading-relaxed">
                          Actualiza regularmente tu perfil para recibir beneficios personalizados y ofertas relevantes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-3xl border border-green-200">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-2">Verifica tu teléfono</h4>
                        <p className="text-green-800 leading-relaxed">
                          Asegúrate de que tu número esté correcto para recibir notificaciones importantes y códigos de verificación.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-3xl border border-purple-200">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Camera size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-900 mb-2">Personaliza tu perfil</h4>
                        <p className="text-purple-800 leading-relaxed">
                          Agrega una foto de perfil y biografía para hacer tu cuenta más personal y reconocible.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl border border-orange-200">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-orange-900 mb-2">Maximiza tus beneficios</h4>
                        <p className="text-orange-800 leading-relaxed">
                          Usa más beneficios para subir de nivel y desbloquear descuentos adicionales y recompensas exclusivas.
                        </p>
                      </div>
                    </div>

                    {/* Progreso de completitud del perfil */}
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-3xl border border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-indigo-900">Completitud del Perfil</h4>
                        <span className="text-2xl font-black text-indigo-600">
                          {Math.round(((profileData.telefono ? 1 : 0) + 
                                      (profileData.dni ? 1 : 0) + 
                                      (profileData.direccion ? 1 : 0) + 
                                      (profileData.fechaNacimiento ? 1 : 0) + 
                                      (profileData.avatar ? 1 : 0) + 
                                      (profileData.biografia ? 1 : 0)) / 6 * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-indigo-200 rounded-full h-3 mb-4">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${((profileData.telefono ? 1 : 0) + 
                                      (profileData.dni ? 1 : 0) + 
                                      (profileData.direccion ? 1 : 0) + 
                                      (profileData.fechaNacimiento ? 1 : 0) + 
                                      (profileData.avatar ? 1 : 0) + 
                                      (profileData.biografia ? 1 : 0)) / 6 * 100}%` 
                          }}
                        />
                      </div>
                      <p className="text-indigo-800 text-sm">
                        Completa tu perfil para acceder a todas las funcionalidades y obtener mejores recomendaciones.
                      </p>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Modal de Edición de Perfil Mejorado */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-3xl">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Edit3 size={24} className="text-white" />
                </div>
                Editar Perfil
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              {/* Información básica */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User size={20} />
                  Información Básica
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    icon={<IdCard size={16} />}
                  />

                  <Input
                    label="Dirección"
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Tu dirección"
                    icon={<Home size={16} />}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      fechaNacimiento: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText size={20} />
                  Información Adicional
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={formData.biografia}
                      onChange={(e) => setFormData(prev => ({ ...prev, biografia: e.target.value }))}
                      placeholder="Cuéntanos un poco sobre ti..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>

                  <Input
                    label="Sitio Web"
                    value={formData.sitioWeb}
                    onChange={(e) => setFormData(prev => ({ ...prev, sitioWeb: e.target.value }))}
                    placeholder="https://tu-sitio-web.com"
                    icon={<Globe size={16} />}
                  />
                </div>
              </div>

              {/* Redes sociales */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users size={20} />
                  Redes Sociales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Instagram"
                    value={formData.redesSociales?.instagram || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      redesSociales: { 
                        ...prev.redesSociales, 
                        instagram: e.target.value 
                      } 
                    }))}
                    placeholder="tu_usuario"
                    icon={<Camera size={16} />}
                  />

                  <Input
                    label="Twitter"
                    value={formData.redesSociales?.twitter || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      redesSociales: { 
                        ...prev.redesSociales, 
                        twitter: e.target.value 
                      } 
                    }))}
                    placeholder="tu_usuario"
                    icon={<Share2 size={16} />}
                  />

                  <Input
                    label="LinkedIn"
                    value={formData.redesSociales?.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      redesSociales: { 
                        ...prev.redesSociales, 
                        linkedin: e.target.value 
                      } 
                    }))}
                    placeholder="tu-perfil"
                    icon={<Users size={16} />}
                  />
                </div>
              </div>

              {/* Vista previa de cambios */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                  <Eye size={20} />
                  Vista Previa
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                      <span className="text-gray-600 font-medium">Nombre:</span>
                      <span className="font-bold text-gray-900">{formData.nombre || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                      <span className="text-gray-600 font-medium">Teléfono:</span>
                      <span className="font-bold text-gray-900">{formData.telefono || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                      <span className="text-gray-600 font-medium">DNI:</span>
                      <span className="font-bold text-gray-900">{formData.dni || 'Sin especificar'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                      <span className="text-gray-600 font-medium">Dirección:</span>
                      <span className="font-bold text-gray-900">{formData.direccion || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                      <span className="text-gray-600 font-medium">Sitio Web:</span>
                      <span className="font-bold text-gray-900">{formData.sitioWeb || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                      <span className="text-gray-600 font-medium">Biografía:</span>
                      <span className="font-bold text-gray-900">{formData.biografia ? 'Configurada' : 'Sin especificar'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                leftIcon={<X size={16} />}
                size="lg"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveProfile}
                loading={updating}
                leftIcon={<Save size={16} />}
                size="lg"
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resto de modales (configuración, QR, actividad, etc.) - mantener los existentes pero con mejoras visuales similares */}
        {/* ... (otros modales con el mismo estilo mejorado) */}
      </motion.div>
    </DashboardLayout>
  );
}

