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
  Move
} from 'lucide-react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { SocioConfiguration, SocioActivity } from '@/types/socio';
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

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: string | number;
}

interface ProfileStat {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

// Componente Button interno
const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}> = ({
  children,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-3 text-sm gap-2',
    lg: 'px-6 py-4 text-base gap-3'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon}
    </button>
  );
};

// Componente Input interno
const Input: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  icon,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
            ${icon ? 'pl-10' : ''}
          `}
        />
      </div>
    </div>
  );
};

// Componente Dialog interno
const Dialog: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-full max-h-[90vh] overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

const DialogContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-8 ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="mb-6">
      {children}
    </div>
  );
};

const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

const DialogFooter: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
      {children}
    </div>
  );
};

// Componente ModernCard interno
const ModernCard: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  className?: string;
  onClick?: () => void;
}> = ({
  children,
  variant = 'default',
  className = '',
  onClick
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl',
    gradient: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white shadow-2xl',
    elevated: 'bg-white border border-gray-100 shadow-xl hover:shadow-2xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`
        ${variantClasses[variant]}
        rounded-3xl p-8 transition-all duration-300 cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Componente MetricsCard interno
const MetricsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  onClick?: () => void;
}> = ({
  title,
  value,
  icon,
  color,
  change = 0,
  trend = 'neutral',
  description,
  onClick
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} />;
      case 'down': return <TrendingDown size={16} />;
      default: return <Move size={16} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        
        {change !== 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: `${getTrendColor()}20` }}>
            <div style={{ color: getTrendColor() }}>
              {getTrendIcon()}
            </div>
            <span className="text-sm font-bold" style={{ color: getTrendColor() }}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-black text-gray-900 mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min(Math.abs(change) * 10, 100)}%`,
              backgroundColor: color 
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Componente ProfileImageUploader interno
const ProfileImageUploader: React.FC<{
  currentImage?: string;
  onImageUpload: (file: File) => Promise<string>;
  uploading?: boolean;
}> = ({
  currentImage,
  onImageUpload,
  uploading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
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
      toast.success('Imagen actualizada exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    }
  };

  return (
    <>
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  fill
                  sizes="112px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <User size={40} className="text-white" />
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
              )}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
          </motion.button>
        </motion.div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Camera size={24} className="text-indigo-600" />
              Cambiar Imagen de Perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {(previewImage || currentImage) && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={previewImage || currentImage || ''}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    fill
                    sizes="128px"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {previewImage ? 'Nueva imagen' : 'Imagen actual'}
                </p>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                dragOver 
                  ? 'border-indigo-500 bg-indigo-50' 
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
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                  <Upload size={24} className="text-gray-600" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    O haz clic para seleccionar un archivo
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<ImageIcon size={16} />}
                  >
                    Seleccionar Archivo
                  </Button>
                </div>
                
                <p className="text-xs text-gray-400">
                  Formatos soportados: JPG, PNG, WebP (máx. 5MB)
                </p>
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
              onClick={() => {
                setIsOpen(false);
                setPreviewImage(null);
                setSelectedFile(null);
              }}
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
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Componente ActivityTimeline interno
const ActivityTimeline: React.FC<{
  activities: SocioActivity[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}> = ({
  activities,
  loading = false,
  onLoadMore,
  hasMore = false
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getActivityIcon = (tipo: SocioActivity['tipo']) => {
    switch (tipo) {
      case 'beneficio': return <Gift size={16} />;
      case 'validacion': return <QrCode size={16} />;
      case 'registro': return <User size={16} />;
      case 'actualizacion': return <Settings size={16} />;
      case 'configuracion': return <Settings size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getActivityColor = (tipo: SocioActivity['tipo']) => {
    switch (tipo) {
      case 'beneficio': return '#10b981';
      case 'validacion': return '#6366f1';
      case 'registro': return '#8b5cf6';
      case 'actualizacion': return '#f59e0b';
      case 'configuracion': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getActivityBadge = (tipo: SocioActivity['tipo']) => {
    switch (tipo) {
      case 'beneficio': return { text: 'Beneficio', color: 'bg-green-100 text-green-800' };
      case 'validacion': return { text: 'Validación', color: 'bg-blue-100 text-blue-800' };
      case 'registro': return { text: 'Registro', color: 'bg-purple-100 text-purple-800' };
      case 'actualizacion': return { text: 'Actualización', color: 'bg-yellow-100 text-yellow-800' };
      case 'configuracion': return { text: 'Configuración', color: 'bg-gray-100 text-gray-800' };
      default: return { text: 'Actividad', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.tipo === filter;
    const matchesSearch = searchTerm === '' || 
      activity.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas las actividades', icon: <Activity size={16} /> },
    { value: 'beneficio', label: 'Beneficios', icon: <Gift size={16} /> },
    { value: 'validacion', label: 'Validaciones', icon: <QrCode size={16} /> },
    { value: 'actualizacion', label: 'Actualizaciones', icon: <Settings size={16} /> },
    { value: 'registro', label: 'Registros', icon: <User size={16} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Actividad Reciente</h3>
              <p className="text-sm text-gray-500">
                {filteredActivities.length} actividades
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-indigo-50 border-indigo-200' : ''}
          >
            Filtros
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-gray-50 rounded-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar actividad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filter === option.value
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => {
            const badge = getActivityBadge(activity.tipo);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                <div 
                  className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: getActivityColor(activity.tipo) }}
                >
                  {getActivityIcon(activity.tipo)}
                </div>

                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{activity.titulo}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{activity.descripcion}</p>
                      
                      {activity.metadata && (
                        <div className="space-y-2">
                          {activity.metadata.comercioNombre && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Building2 size={14} />
                              <span>{activity.metadata.comercioNombre}</span>
                            </div>
                          )}
                          
                          {activity.metadata.ubicacion && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin size={14} />
                              <span>{activity.metadata.ubicacion}</span>
                            </div>
                          )}
                          
                          {activity.metadata.montoDescuento && (
                            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                              <TrendingUp size={14} />
                              <span>Ahorro: ${activity.metadata.montoDescuento}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {format(activity.fecha.toDate(), 'HH:mm', { locale: es })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(activity.fecha.toDate(), 'dd MMM', { locale: es })}
                      </p>
                    </div>
                  </div>
                  
                  {(activity.metadata?.comercioId || activity.metadata?.beneficioId) && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink size={14} />}
                        className="text-xs"
                      >
                        Ver detalles
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay actividad
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron actividades con los filtros aplicados'
                : 'Aún no tienes actividad registrada'
              }
            </p>
          </div>
        )}

        {hasMore && (
          <div className="text-center pt-6">
            <Button
              variant="outline"
              onClick={onLoadMore}
              loading={loading}
              leftIcon={<ChevronDown size={16} />}
            >
              Cargar más actividades
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente LoadingSkeleton interno
const LoadingSkeleton: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function SocioPerfilPage() {
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
    validacionesExitosas: stats?.validacionesExitosas || 0,
    descuentoPromedio: stats?.descuentoPromedio || 0,
    ahorroEsteMes: stats?.ahorroEsteMes || 0,
    beneficiosFavoritos: stats?.beneficiosFavoritos || 0,
    tiempoComoSocio: stats?.tiempoComoSocio || 0,
    actividadPorMes: stats?.actividadPorMes || {},
    beneficiosPorCategoria: stats?.beneficiosPorCategoria || {},
    comerciosMasVisitados: stats?.comerciosMasVisitados || []
  };

  // Configuración
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
    nombre: '',
    telefono: '',
    dni: '',
    direccion: '',
    fechaNacimiento: ''
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

  // Estadísticas del perfil
  const profileStats: ProfileStat[] = [
    {
      id: 'beneficios',
      title: 'Beneficios Usados',
      value: enhancedStats.beneficiosUsados,
      icon: <Gift size={24} />,
      color: '#6366f1',
      change: 12,
      trend: 'up',
      description: 'Total de beneficios utilizados'
    },
    {
      id: 'ahorro',
      title: 'Total Ahorrado',
      value: `$${enhancedStats.ahorroTotal.toLocaleString()}`,
      icon: <Wallet size={24} />,
      color: '#10b981',
      change: 8,
      trend: 'up',
      description: 'Dinero ahorrado en total'
    },
    {
      id: 'mes',
      title: 'Este Mes',
      value: enhancedStats.beneficiosEsteMes,
      icon: <CalendarIcon size={24} />,
      color: '#f59e0b',
      change: -5,
      trend: 'down',
      description: 'Beneficios usados este mes'
    },
    {
      id: 'racha',
      title: 'Días de Racha',
      value: enhancedStats.racha,
      icon: <Zap size={24} />,
      color: '#8b5cf6',
      change: 15,
      trend: 'up',
      description: 'Días consecutivos activo'
    },
    {
      id: 'comercios',
      title: 'Comercios Visitados',
      value: enhancedStats.comerciosVisitados,
      icon: <Building2 size={24} />,
      color: '#3b82f6',
      change: 3,
      trend: 'up',
      description: 'Comercios únicos visitados'
    },
    {
      id: 'validaciones',
      title: 'Tasa de Éxito',
      value: `${enhancedStats.validacionesExitosas}%`,
      icon: <CheckCircle size={24} />,
      color: '#10b981',
      change: 2,
      trend: 'up',
      description: 'Validaciones exitosas'
    }
  ];

  // Acciones rápidas
  const quickActions: QuickAction[] = [
    {
      id: 'qr',
      title: 'Mi Código QR',
      description: 'Ver y compartir mi código QR',
      icon: <QrCode size={20} />,
      color: '#6366f1',
      action: () => setQrModalOpen(true)
    },
    {
      id: 'export',
      title: 'Exportar Datos',
      description: 'Descargar toda mi información',
      icon: <Download size={20} />,
      color: '#10b981',
      action: handleExportData
    },
    {
      id: 'config',
      title: 'Configuración',
      description: 'Ajustar preferencias',
      icon: <Settings size={20} />,
      color: '#8b5cf6',
      action: () => setConfigModalOpen(true)
    },
    {
      id: 'activity',
      title: 'Ver Actividad',
      description: 'Historial completo',
      icon: <Activity size={20} />,
      color: '#f59e0b',
      action: () => setActivityModalOpen(true),
      badge: activity.length
    },
    {
      id: 'stats',
      title: 'Estadísticas',
      description: 'Análisis detallado',
      icon: <BarChart3 size={20} />,
      color: '#ec4899',
      action: () => setStatsModalOpen(true)
    },
    {
      id: 'help',
      title: 'Centro de Ayuda',
      description: 'Soporte y guías',
      icon: <HelpCircle size={20} />,
      color: '#6b7280',
      action: () => window.open('/help', '_blank')
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

  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={SocioSidebar}
      >
        <div className="p-8 max-w-7xl mx-auto">
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
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Moderno */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Mi Perfil
                    </h1>
                    <p className="text-gray-600 font-medium">
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

        <div className="max-w-7xl mx-auto px-8 py-8">
          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Columna Principal - Perfil */}
            <div className="xl:col-span-2 space-y-8">
              {/* Tarjeta de Perfil Principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ModernCard variant="elevated" className="overflow-hidden">
                  {/* Header del perfil con gradiente */}
                  <div className="relative -m-8 mb-6 h-32 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-t-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
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

                    {/* Patrón decorativo */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 right-12 w-16 h-16 border-2 border-white rounded-full"></div>
                      <div className="absolute top-12 right-4 w-12 h-12 border-2 border-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Contenido del perfil */}
                  <div className="relative">
                    {/* Avatar y acciones */}
                    <div className="flex items-start justify-between -mt-20 mb-8">
                      <div className="relative">
                        <ProfileImageUploader
                          currentImage={profileData.avatar || profileData.avatarThumbnail || undefined}
                          onImageUpload={handleImageUpload}
                          uploading={uploadingImage}
                        />
                        
                        {/* Badge de estado */}
                        <div 
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: getStatusColor(profileData.estado) }}
                        >
                          <CheckCircle size={16} className="text-white" />
                        </div>

                        {/* Badge de nivel */}
                        <div 
                          className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg"
                          style={{ backgroundColor: getNivelColor(profileData.nivel.nivel) }}
                        >
                          {getNivelIcon(profileData.nivel.nivel)}
                          {profileData.nivel.nivel}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        leftIcon={<Edit3 size={16} />}
                        onClick={() => setEditModalOpen(true)}
                        className="mt-4"
                      >
                        Editar Perfil
                      </Button>
                    </div>

                    {/* Información del usuario */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">
                          {profileData.nombre}
                        </h2>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span 
                            className="px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2"
                            style={{ 
                              backgroundColor: `${getStatusColor(profileData.estado)}20`,
                              color: getStatusColor(profileData.estado),
                              borderColor: `${getStatusColor(profileData.estado)}40`
                            }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getStatusColor(profileData.estado) }}
                            ></div>
                            {getStatusText(profileData.estado)}
                          </span>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            <span className="text-sm font-medium">
                              Socio desde {format(profileData.creadoEn, 'MMMM yyyy', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progreso de nivel */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                              style={{ backgroundColor: getNivelColor(profileData.nivel.nivel) }}
                            >
                              {getNivelIcon(profileData.nivel.nivel)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Nivel {profileData.nivel.nivel}</h3>
                              <p className="text-sm text-gray-600">
                                {profileData.nivel.puntos} puntos
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600">
                              Próximo nivel: {profileData.nivel.proximoNivel}
                            </p>
                            <p className="text-xs text-gray-500">
                              {profileData.nivel.puntosParaProximoNivel} puntos restantes
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                              style={{ 
                                width: `${(profileData.nivel.puntos / (profileData.nivel.puntos + profileData.nivel.puntosParaProximoNivel)) * 100}%`,
                                background: `linear-gradient(90deg, ${getNivelColor(profileData.nivel.nivel)}, ${getNivelColor(profileData.nivel.proximoNivel || 'Silver')})`
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información de contacto */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Mail size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900 truncate">{profileData.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyUserId}
                            className="p-2"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                          </Button>
                        </div>

                        {profileData.telefono && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                              <Phone size={20} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">Teléfono</p>
                              <p className="font-semibold text-gray-900">{profileData.telefono}</p>
                            </div>
                          </div>
                        )}

                        {profileData.dni && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                              <IdCard size={20} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">DNI</p>
                              <p className="font-semibold text-gray-900">{profileData.dni}</p>
                            </div>
                          </div>
                        )}

                        {profileData.direccion && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                              <Home size={20} className="text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">Dirección</p>
                              <p className="font-semibold text-gray-900">{profileData.direccion}</p>
                            </div>
                          </div>
                        )}

                        {profileData.fechaNacimiento && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                              <Cake size={20} className="text-pink-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">Fecha de Nacimiento</p>
                              <p className="font-semibold text-gray-900">
                                {format(profileData.fechaNacimiento, 'dd MMMM yyyy', { locale: es })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>

              {/* Estadísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <ModernCard variant="elevated">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <BarChart3 size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Estadísticas</h3>
                        <p className="text-gray-600 font-medium">Tu rendimiento como socio</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
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

                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {profileStats.map((stat) => (
                      <MetricsCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        change={stat.change}
                        trend={stat.trend}
                        description={stat.description}
                        onClick={() => setStatsModalOpen(true)}
                      />
                    ))}
                  </div>
                </ModernCard>
              </motion.div>

              {/* Actividad Reciente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <ModernCard variant="elevated">
                  <ActivityTimeline
                    activities={activity.slice(0, 5)}
                    loading={loading}
                    onLoadMore={() => setActivityModalOpen(true)}
                    hasMore={activity.length > 5}
                  />
                </ModernCard>
              </motion.div>
            </div>

            {/* Columna Lateral */}
            <div className="space-y-8">
              {/* Mis Asociaciones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <ModernCard variant="elevated">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Mis Asociaciones</h3>
                      <p className="text-sm text-gray-600">Estado de membresías</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {asociaciones?.length > 0 ? asociaciones.map((asociacion, index) => (
                      <motion.div
                        key={asociacion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                              {asociacion.logo ? (
                                <Image
                                  src={asociacion.logo}
                                  alt={asociacion.nombre}
                                  width={32}
                                  height={32}
                                  className="object-cover rounded-lg"
                                  unoptimized
                                />
                              ) : (
                                <Building2 size={20} className="text-gray-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{asociacion.nombre}</h4>
                              <p className="text-xs text-gray-600">
                                {asociacion.estado === 'activo' 
                                  ? `Vence: ${format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}`
                                  : `Venció: ${format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}`
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {asociacion.estado === 'activo' ? 
                              <CheckCircle size={16} className="text-green-500" /> : 
                              <XCircle size={16} className="text-red-500" />
                            }
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: asociacion.estado === 'activo' ? '#dcfce7' : '#fee2e2',
                                color: asociacion.estado === 'activo' ? '#166534' : '#991b1b'
                              }}
                            >
                              {asociacion.estado === 'activo' ? 'Activo' : 'Vencido'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-gray-200">
                          <div>
                            <div className="text-lg font-bold text-indigo-600">{asociacion.beneficiosIncluidos}</div>
                            <div className="text-xs text-gray-600">Beneficios</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{asociacion.descuentoMaximo}%</div>
                            <div className="text-xs text-gray-600">Desc. Máx.</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">{asociacion.comerciosAfiliados}</div>
                            <div className="text-xs text-gray-600">Comercios</div>
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8">
                        <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No hay asociaciones disponibles</p>
                      </div>
                    )}
                  </div>

                  {asociaciones?.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-black text-green-600">
                            {asociaciones.filter(a => a.estado === 'activo').length}
                          </div>
                          <div className="text-sm text-gray-600">Activas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-red-600">
                            {asociaciones.filter(a => a.estado === 'vencido').length}
                          </div>
                          <div className="text-sm text-gray-600">Vencidas</div>
                        </div>
                      </div>
                    </div>
                  )}
                </ModernCard>
              </motion.div>

              {/* Acciones Rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <ModernCard variant="elevated">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Acciones Rápidas</h3>
                      <p className="text-sm text-gray-600">Funciones principales</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.action}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200 group"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: action.color }}
                        >
                          {action.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{action.title}</h4>
                            {action.badge && (
                              <span 
                                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: action.color }}
                              >
                                {action.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </ModernCard>
              </motion.div>

              {/* Consejos y Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <ModernCard variant="glass">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Lightbulb size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Consejos</h3>
                      <p className="text-sm text-gray-600">Para optimizar tu perfil</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Mantén tu información actualizada para recibir beneficios personalizados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Verifica que tu teléfono esté correcto para notificaciones importantes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Camera size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-900">
                          Agrega una foto de perfil para personalizar tu experiencia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-900">
                          Usa más beneficios para subir de nivel y obtener mejores descuentos
                        </p>
                      </div>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Modal de Edición de Perfil */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Edit3 size={20} className="text-white" />
                </div>
                Editar Perfil
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
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

              <div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Vista previa de cambios */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye size={16} />
                  Vista previa
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{formData.nombre || 'Sin especificar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{formData.telefono || 'Sin especificar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DNI:</span>
                    <span className="font-medium">{formData.dni || 'Sin especificar'}</span>
                  </div>
                </div>
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
                loading={updating}
                leftIcon={<Save size={16} />}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Settings size={20} className="text-white" />
                </div>
                Configuración de Cuenta
              </DialogTitle>
            </DialogHeader>

            {/* Tabs de configuración */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1">
                {[
                  { id: 'general', label: 'General', icon: <Globe size={16} /> },
                  { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={16} /> },
                  { id: 'privacidad', label: 'Privacidad', icon: <Shield size={16} /> },
                  { id: 'avanzado', label: 'Avanzado', icon: <Settings size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'general' | 'notificaciones' | 'privacidad' | 'avanzado')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
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

            <div className="space-y-8">
              {/* Tab General */}
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Globe size={20} />
                      Preferencias Generales
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Languages size={16} className="inline mr-2" />
                          Idioma
                        </label>
                        <select
                          value={configuracion.idioma}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, idioma: e.target.value as 'es' | 'en' }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="es">🇪🇸 Español</option>
                          <option value="en">🇺🇸 English</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <DollarSign size={16} className="inline mr-2" />
                          Moneda
                        </label>
                        <select
                          value={configuracion.moneda}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, moneda: e.target.value as 'ARS' | 'USD' | 'EUR' }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="ARS">💰 Peso Argentino (ARS)</option>
                          <option value="USD">💵 Dólar Estadounidense (USD)</option>
                          <option value="EUR">💶 Euro (EUR)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Clock3 size={16} className="inline mr-2" />
                          Zona Horaria
                        </label>
                        <select
                          value={configuracion.timezone}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="America/Argentina/Buenos_Aires">🇦🇷 Buenos Aires (GMT-3)</option>
                          <option value="America/New_York">🇺🇸 Nueva York (GMT-5)</option>
                          <option value="Europe/Madrid">🇪🇸 Madrid (GMT+1)</option>
                          <option value="Asia/Tokyo">🇯🇵 Tokio (GMT+9)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tema */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette size={18} />
                      Tema de la aplicación
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Claro', icon: <Sun size={20} />, bg: 'bg-white', border: 'border-gray-200' },
                        { value: 'dark', label: 'Oscuro', icon: <Moon size={20} />, bg: 'bg-gray-900', border: 'border-gray-700' },
                        { value: 'auto', label: 'Automático', icon: <Laptop size={20} />, bg: 'bg-gradient-to-r from-white to-gray-900', border: 'border-gray-300' }
                      ].map((tema) => (
                        <button
                          key={tema.value}
                          onClick={() => setConfiguracion(prev => ({ ...prev, tema: tema.value as 'light' | 'dark' | 'auto' }))}
                          className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                            configuracion.tema === tema.value
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : `${tema.border} hover:border-gray-300 ${tema.bg}`
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            configuracion.tema === tema.value ? 'bg-indigo-100' : 'bg-gray-100'
                          }`}>
                            {tema.icon}
                          </div>
                          <span className="font-medium">{tema.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Notificaciones */}
              {activeTab === 'notificaciones' && (
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Bell size={20} />
                    Configuración de Notificaciones
                  </h4>
                  
                  <div className="space-y-4">
                    {[
                      {
                        key: 'notificaciones',
                        title: 'Notificaciones generales',
                        description: 'Recibir todas las notificaciones del sistema',
                        icon: <Bell size={20} />,
                        color: 'indigo'
                      },
                      {
                        key: 'notificacionesPush',
                        title: 'Notificaciones push',
                        description: 'Notificaciones en tiempo real en tu dispositivo',
                        icon: <DeviceIcon size={20} />,
                        color: 'blue'
                      },
                      {
                        key: 'notificacionesEmail',
                        title: 'Notificaciones por email',
                        description: 'Recibir emails informativos y promocionales',
                        icon: <Mail size={20} />,
                        color: 'green'
                      },
                      {
                        key: 'notificacionesSMS',
                        title: 'Notificaciones SMS',
                        description: 'Mensajes de texto para eventos importantes',
                        icon: <Phone size={20} />,
                        color: 'orange'
                      }
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-${notif.color}-100 rounded-xl flex items-center justify-center`}>
                            <div className={`text-${notif.color}-600`}>
                              {notif.icon}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{notif.title}</h5>
                            <p className="text-sm text-gray-600">{notif.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setConfiguracion(prev => ({ 
                            ...prev, 
                            [notif.key]: !prev[notif.key as keyof SocioConfiguration] 
                          }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            configuracion[notif.key as keyof SocioConfiguration] 
                              ? 'bg-indigo-600' 
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
                </div>
              )}

              {/* Tab Privacidad */}
              {activeTab === 'privacidad' && (
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <ShieldIcon size={20} />
                    Configuración de Privacidad
                  </h4>
                  
                  <div className="space-y-4">
                    {[
                      {
                        key: 'perfilPublico',
                        title: 'Perfil público',
                        description: 'Permitir que otros usuarios vean tu perfil básico',
                        icon: <Globe size={20} />,
                        color: 'blue'
                      },
                      {
                        key: 'mostrarEstadisticas',
                        title: 'Mostrar estadísticas',
                        description: 'Mostrar tus estadísticas de uso públicamente',
                        icon: <BarChart3 size={20} />,
                        color: 'green'
                      },
                      {
                        key: 'mostrarActividad',
                        title: 'Mostrar actividad',
                        description: 'Mostrar tu actividad reciente a otros usuarios',
                        icon: <Activity size={20} />,
                        color: 'purple'
                      },
                      {
                        key: 'compartirDatos',
                        title: 'Compartir datos',
                        description: 'Permitir compartir datos anónimos para mejorar el servicio',
                        icon: <Share2 size={20} />,
                        color: 'orange'
                      }
                    ].map((privacy) => (
                      <div key={privacy.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-${privacy.color}-100 rounded-xl flex items-center justify-center`}>
                            <div className={`text-${privacy.color}-600`}>
                              {privacy.icon}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{privacy.title}</h5>
                            <p className="text-sm text-gray-600">{privacy.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setConfiguracion(prev => ({ 
                            ...prev, 
                            [privacy.key]: !prev[privacy.key as keyof SocioConfiguration] 
                          }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            configuracion[privacy.key as keyof SocioConfiguration] 
                              ? 'bg-indigo-600' 
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

                  {/* Información adicional */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2">Información sobre privacidad</h5>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Tus datos personales están protegidos y nunca se comparten con terceros sin tu consentimiento explícito. 
                          Puedes cambiar estas configuraciones en cualquier momento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Avanzado */}
              {activeTab === 'avanzado' && (
                <div className="space-y-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Database size={20} />
                    Configuración Avanzada
                  </h4>

                  {/* Información del dispositivo */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DeviceIcon size={18} />
                      Información del dispositivo
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Último acceso:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {format(profileData.ultimoAcceso, 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Dispositivos conectados:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {socio?.dispositivosConectados?.length || 1}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Ubicación actual:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {socio?.ubicacionActual ? 
                              `${socio.ubicacionActual.ciudad}, ${socio.ubicacionActual.provincia}` : 
                              'No disponible'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">ID de usuario:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-gray-900">
                              {user?.uid?.slice(0, 8)}...
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyUserId}
                              className="p-1"
                            >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gestión de datos */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText size={18} />
                      Gestión de datos
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<Download size={16} />}
                        onClick={handleExportData}
                        className="justify-start h-auto p-4"
                      >
                        <div className="text-left">
                          <div className="font-medium">Exportar todos mis datos</div>
                          <div className="text-sm text-gray-500">Descargar información completa</div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<RotateCcw size={16} />}
                        className="justify-start h-auto p-4"
                        onClick={() => {
                          setConfiguracion({
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
                          toast.success('Configuración restablecida');
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">Restablecer configuración</div>
                          <div className="text-sm text-gray-500">Volver a valores por defecto</div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Acciones de cuenta peligrosas */}
                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle size={18} />
                      Zona de peligro
                    </h5>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<Archive size={16} />}
                        className="justify-start text-yellow-600 border-yellow-300 hover:bg-yellow-50 h-auto p-4"
                      >
                        <div className="text-left">
                          <div className="font-medium">Archivar cuenta</div>
                          <div className="text-sm text-yellow-600/80">Desactivar temporalmente tu cuenta</div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<Trash2 size={16} />}
                        className="justify-start text-red-600 border-red-300 hover:bg-red-50 h-auto p-4"
                      >
                        <div className="text-left">
                          <div className="font-medium">Eliminar cuenta</div>
                          <div className="text-sm text-red-600/80">Eliminar permanentemente todos los datos</div>
                        </div>
                      </Button>
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
                loading={updating}
                leftIcon={<Save size={16} />}
              >
                Guardar Configuración
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de QR */}
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <QrCode size={20} className="text-white" />
                </div>
                Mi Código QR
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-center">
              {/* QR Code */}
              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 mx-auto inline-block shadow-lg">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <QrCode size={120} className="text-gray-400" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Código de Socio</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Muestra este código QR en los comercios para validar tus beneficios
                </p>
                
                {/* ID de usuario */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-600">
                    {user?.uid?.slice(0, 8)}...{user?.uid?.slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUserId}
                    className="p-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-900">Nivel</div>
                      <div className="text-blue-700 flex items-center gap-1">
                        {getNivelIcon(profileData.nivel.nivel)}
                        {profileData.nivel.nivel}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Puntos</div>
                      <div className="text-blue-700">{profileData.nivel.puntos}</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Estado</div>
                      <div className="text-blue-700">{getStatusText(profileData.estado)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Asociaciones</div>
                      <div className="text-blue-700">{asociaciones.length}</div>
                    </div>
                  </div>
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
                Historial de Actividad Completo
              </DialogTitle>
            </DialogHeader>

            <ActivityTimeline
              activities={activity}
              loading={loading}
              hasMore={false}
            />

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
                onClick={async () => {
                  try {
                    const activityData = {
                      actividades: activity,
                      fechaExportacion: new Date().toISOString(),
                      socio: profileData.nombre
                    };
                    
                    const blob = new Blob([JSON.stringify(activityData, null, 2)], { 
                      type: 'application/json' 
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `actividad-socio-${format(new Date(), 'yyyy-MM-dd')}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    toast.success('Historial de actividad exportado');
                  } catch {
                    toast.error('Error al exportar el historial');
                  }
                }}
              >
                Exportar Historial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Estadísticas Avanzadas */}
        <Dialog open={statsModalOpen} onClose={() => setStatsModalOpen(false)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 size={20} className="text-white" />
                </div>
                Estadísticas Avanzadas
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              {/* Resumen de estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: 'Ahorro Total', value: `$${enhancedStats.ahorroTotal.toLocaleString()}`, icon: <TrendingUp size={24} />, color: '#3b82f6' },
                  { title: 'Beneficios Usados', value: enhancedStats.beneficiosUsados, icon: <Award size={24} />, color: '#10b981' },
                  { title: 'Comercios Visitados', value: enhancedStats.comerciosVisitados, icon: <Building2 size={24} />, color: '#8b5cf6' },
                  { title: 'Días de Racha', value: enhancedStats.racha, icon: <Zap size={24} />, color: '#f59e0b' }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white"
                      style={{ backgroundColor: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-black mb-2" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                  </div>
                ))}
              </div>

              {/* Comercios más visitados */}
              {enhancedStats.comerciosMasVisitados.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Building2 size={20} />
                    Comercios Más Visitados
                  </h4>
                  <div className="space-y-4">
                    {enhancedStats.comerciosMasVisitados.map((comercio, index) => (
                      <div key={comercio.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{comercio.nombre}</h5>
                            <p className="text-sm text-gray-500">
                              Última visita: {format(comercio.ultimaVisita.toDate(), 'dd/MM/yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">{comercio.visitas}</div>
                          <div className="text-sm text-gray-500">visitas</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actividad por mes */}
              {Object.keys(enhancedStats.actividadPorMes).length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Calendar size={20} />
                    Actividad por Mes (Últimos 12 meses)
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {Object.entries(enhancedStats.actividadPorMes).map(([mes, actividad]) => (
                      <div key={mes} className="text-center p-4 bg-gray-50 rounded-2xl">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">{actividad}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(mes + '-01'), 'MMM yyyy', { locale: es })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStatsModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cerrar
              </Button>
              <Button
                leftIcon={<Download size={16} />}
                onClick={async () => {
                  try {
                    const statsData = {
                      estadisticas: enhancedStats,
                      fechaExportacion: new Date().toISOString(),
                      socio: profileData.nombre
                    };
                    
                    const blob = new Blob([JSON.stringify(statsData, null, 2)], { 
                      type: 'application/json' 
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `estadisticas-socio-${format(new Date(), 'yyyy-MM-dd')}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    toast.success('Estadísticas exportadas');
                  } catch {
                    toast.error('Error al exportar las estadísticas');
                  }
                }}
              >
                Exportar Estadísticas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
