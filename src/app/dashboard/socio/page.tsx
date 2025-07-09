'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { SocioOverviewDashboard } from '@/components/socio/SocioOverviewDashboard';
import { ProfileCard } from '@/components/socio/ProfileCard';
import { AsociacionesList } from '@/components/socio/AsociacionesList';
import { BenefitsTabs } from '@/components/socio/BenefitsTabs';
import { BenefitsCard } from '@/components/socio/BenefitsCard';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { NotificationsList } from '@/components/socio/NotificationsList';
import { useAuth } from '@/hooks/useAuth';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useNotifications } from '@/hooks/useNotifications';
import { validacionesService, ValidacionResponse } from '@/services/validaciones.service';
import { 
  Gift, 
  Zap, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  QrCode,
  Smartphone,
  Camera,
  RefreshCw,
  ChevronDown,
  X,
  Bell,
} from 'lucide-react';

// Enhanced Quick Actions Component with modern design
const QuickActions: React.FC<{
  onScanQR: () => void;
  onViewBenefits: () => void;
  onViewProfile: () => void;
  onViewNotifications: () => void;
  unreadNotifications: number;
  isVisible: boolean;
}> = ({ onScanQR, onViewBenefits, onViewProfile, onViewNotifications, unreadNotifications, isVisible }) => {
  const quickActions = [
    {
      id: 'scan',
      label: 'Escanear QR',
      icon: <QrCode size={24} />,
      gradient: 'from-violet-500 via-purple-500 to-violet-600',
      onClick: onScanQR,
      description: 'Validar beneficio',
      delay: 0
    },
    {
      id: 'benefits',
      label: 'Mis Beneficios',
      icon: <Gift size={24} />,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      onClick: onViewBenefits,
      description: 'Ver disponibles',
      delay: 0.1
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: <Star size={24} />,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      onClick: onViewProfile,
      description: 'Editar información',
      delay: 0.2
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: <Bell size={24} />,
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      onClick: onViewNotifications,
      badge: unreadNotifications,
      description: 'Mensajes nuevos',
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

          {/* Badge */}
          {action.badge && action.badge > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: action.delay + 0.5, type: "spring" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg border-2 border-white"
            >
              {action.badge > 99 ? '99+' : action.badge}
            </motion.div>
          )}

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

// Enhanced Benefits Filter Component with modern design
const BenefitsFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories: string[];
  isVisible: boolean;
}> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  categories,
  isVisible
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20 
      }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="glass-card p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Enhanced Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-celestial-500/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm" />
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors duration-300" size={24} />
          <input
            type="text"
            placeholder="Buscar beneficios..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-16 pr-6 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium text-lg hover:border-sky-300 hover:shadow-lg"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl px-6 py-4 pr-12 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 font-medium text-slate-700 hover:border-sky-300 hover:shadow-lg"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl px-6 py-4 pr-12 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 font-medium text-slate-700 hover:border-sky-300 hover:shadow-lg"
            >
              <option value="newest">Más recientes</option>
              <option value="discount">Mayor descuento</option>
              <option value="ending">Por vencer</option>
              <option value="popular">Más populares</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 font-medium
              ${filtersOpen 
                ? 'bg-violet-50/80 border-violet-200 text-violet-700 shadow-lg' 
                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300 hover:shadow-lg'
              }
            `}
          >
            <Filter size={20} />
            Filtros avanzados
          </button>
        </div>

        {/* Enhanced View Mode Toggle */}
        <div className="flex items-center bg-slate-100/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-3 rounded-xl transition-all duration-300 font-medium
              ${viewMode === 'grid' 
                ? 'bg-white shadow-lg text-violet-600 scale-105' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }
            `}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-3 rounded-xl transition-all duration-300 font-medium
              ${viewMode === 'list' 
                ? 'bg-white shadow-lg text-violet-600 scale-105' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }
            `}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Enhanced Advanced Filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-8 pt-8 border-t border-slate-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 mb-4">
                  Tipo de descuento
                </label>
                <div className="space-y-3">
                  {['porcentaje', 'monto_fijo', 'producto_gratis'].map(type => (
                    <label key={type} className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-2 border-slate-300 text-violet-600 focus:ring-violet-500 focus:ring-2 transition-all duration-200" 
                      />
                      <span className="ml-3 text-sm text-slate-600 capitalize font-medium group-hover:text-slate-800 transition-colors duration-200">
                        {type.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 mb-4">
                  Rango de descuento
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 mb-4">
                  Estado
                </label>
                <div className="space-y-3">
                  {['Disponible', 'Por vencer', 'Destacado'].map(status => (
                    <label key={status} className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-2 border-slate-300 text-violet-600 focus:ring-violet-500 focus:ring-2 transition-all duration-200" 
                      />
                      <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-800 transition-colors duration-200">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced QR Scanner Section with modern design
const QRScannerSection: React.FC<{
  onScan: (qrData: string) => void;
  loading: boolean;
  isVisible: boolean;
}> = ({ onScan, loading, isVisible }) => {
  const [scannerMode, setScannerMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 30, 
            scale: isVisible ? 1 : 0.9 
          }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
          className="glass-card p-10 shadow-2xl hover:shadow-3xl transition-all duration-500"
        >
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: isVisible ? 1 : 0, rotate: isVisible ? 0 : -180 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <Zap size={40} className="text-white" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl font-bold text-slate-900 mb-4 font-jakarta"
            >
              Validar Beneficio
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-slate-600 mb-8 text-lg leading-relaxed font-jakarta"
            >
              Escanea el código QR del comercio para validar tu acceso y usar tus beneficios exclusivos.
            </motion.p>
          </div>

          {/* Enhanced Scanner Mode Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex bg-slate-100/80 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg"
          >
            <button
              onClick={() => setScannerMode('camera')}
              className={`
                flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 font-semibold
                ${scannerMode === 'camera' 
                  ? 'bg-white shadow-lg text-violet-600 scale-105' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }
              `}
            >
              <Camera size={20} />
              Cámara
            </button>
            <button
              onClick={() => setScannerMode('manual')}
              className={`
                flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 font-semibold
                ${scannerMode === 'manual' 
                  ? 'bg-white shadow-lg text-violet-600 scale-105' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }
              `}
            >
              <Smartphone size={20} />
              Manual
            </button>
          </motion.div>

          {/* Enhanced Scanner Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {scannerMode === 'camera' ? (
              <div className="space-y-6">
                <QRScannerButton onScan={onScan} loading={loading} />
                
                <div className="p-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-bold mb-2">
                        Consejos para escanear
                      </p>
                      <ul className="text-sm text-blue-600 space-y-1 font-medium">
                        <li>• Mantén el código dentro del marco</li>
                        <li>• Asegúrate de tener buena iluminación</li>
                        <li>• Mantén la cámara estable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Código QR Manual
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Ingresa el código QR aquí..."
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium hover:border-violet-300 hover:shadow-lg"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualCode.trim() || loading}
                  className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 text-white py-4 px-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-600 hover:via-purple-600 hover:to-violet-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:hover:translate-y-0 disabled:hover:shadow-2xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw size={20} className="animate-spin" />
                      Validando...
                    </div>
                  ) : (
                    'Validar Código'
                  )}
                </button>

                <div className="p-6 bg-amber-50/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-lg">
                  <p className="text-sm text-amber-700 font-medium">
                    <strong>Nota:</strong> Solicita al comercio que te proporcione el código QR o el código de validación manual.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
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

export default function SocioDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { beneficios, beneficiosUsados, aplicarBeneficio } = useBeneficios();
  const { notifications, stats: notificationStats } = useNotifications();
  
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [benefitsTab, setBenefitsTab] = useState<'disponibles' | 'usados'>('disponibles');
  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Benefits filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Trigger visibility for staggered animations
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(beneficios.map(b => b.categoria));
    return Array.from(cats);
  }, [beneficios]);

  // Filter and sort benefits
  const filteredBeneficios = React.useMemo(() => {
    let filtered = beneficios;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.comercioNombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(b => b.categoria === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'discount':
        filtered.sort((a, b) => b.descuento - a.descuento);
        break;
      case 'ending':
        filtered.sort((a, b) => a.fechaFin.toDate().getTime() - b.fechaFin.toDate().getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.usosActuales || 0) - (a.usosActuales || 0));
        break;
      default: // newest
        filtered.sort((a, b) => b.creadoEn.toDate().getTime() - a.creadoEn.toDate().getTime());
    }

    return filtered;
  }, [beneficios, searchTerm, selectedCategory, sortBy]);

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

  // QR Scan handler
  const handleQRScan = async (qrData: string) => {
    setLoading(true);
    try {
      const parsedData = validacionesService.parseQRData(qrData);
      if (!parsedData) {
        throw new Error('Código QR inválido');
      }

      const result = await validacionesService.validarAcceso({
        socioId: user?.uid || '',
        comercioId: parsedData.comercioId,
        beneficioId: parsedData.beneficioId
      });

      setValidationResult(result);
      setValidationModalOpen(true);
    } catch (error) {
      console.error('Error validating QR:', error);
      toast.error('Error al validar el código QR');
    } finally {
      setLoading(false);
    }
  };

  // Benefit usage handler
  const handleUseBenefit = async (beneficioId: string) => {
    const beneficio = beneficios.find(b => b.id === beneficioId);
    if (!beneficio) return;

    const success = await aplicarBeneficio(beneficioId, beneficio.comercioId);
    if (success) {
      toast.success('Beneficio usado exitosamente');
    }
  };

  // Navigation handlers
  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleScanQR = () => {
    setActiveSection('validar');
  };

  // Notification handler
  const handleMarkNotificationAsRead = (id: string) => {
    console.log('Marking notification as read:', id);
  };

  // Render dashboard content based on active section
  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-container min-h-screen">
            {/* Enhanced animated background elements - matching homepage */}
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
                      <Zap className="w-10 h-10 text-white transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-sky-500/30 to-celestial-500/30 rounded-3xl blur-lg animate-pulse-glow"></div>
                  </div>
                  
                  <div className="text-left">
                    <h1 className="text-5xl md:text-6xl font-bold gradient-text font-playfair tracking-tight leading-none py-2">
                      ¡Hola, {user?.nombre || 'Socio'}!
                    </h1>
                    <p className="text-xl text-slate-600 font-jakarta mt-2">
                      Bienvenido a tu panel de beneficios
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <QuickActions
                onScanQR={handleScanQR}
                onViewBenefits={() => handleNavigate('beneficios')}
                onViewProfile={() => handleNavigate('perfil')}
                onViewNotifications={() => handleNavigate('notificaciones')}
                unreadNotifications={notificationStats.unread}
                isVisible={isVisible}
              />

              {/* Main Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <SocioOverviewDashboard
                  onNavigate={handleNavigate}
                  onScanQR={handleScanQR}
                />
              </motion.div>
            </div>
          </div>
        );

      case 'perfil':
        return (
          <div className="dashboard-container min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-30"></div>
            <div className="relative z-10 p-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <ProfileCard />
                <AsociacionesList />
              </motion.div>
            </div>
          </div>
        );

      case 'beneficios':
        return (
          <div className="dashboard-container min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-30"></div>
            <div className="relative z-10 p-8 space-y-8">
              {/* Enhanced Benefits Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h1 className="text-4xl font-bold gradient-text font-playfair mb-4">
                    Mis Beneficios
                  </h1>
                  <p className="text-xl text-slate-600 font-jakarta">
                    Descubre y usa tus beneficios exclusivos
                  </p>
                </div>
                <button
                  onClick={handleScanQR}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-violet-600 hover:via-purple-600 hover:to-violet-700 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  <QrCode size={24} />
                  Escanear QR
                </button>
              </motion.div>

              {/* Benefits Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <BenefitsTabs
                  activeTab={benefitsTab}
                  onTabChange={setBenefitsTab}
                  stats={{
                    disponibles: beneficios.length,
                    usados: beneficiosUsados.length,
                    ahorroTotal: beneficiosUsados.reduce((total, b) => total + (b.montoDescuento || 0), 0)
                  }}
                />
              </motion.div>

              {/* Benefits Filter (only for available benefits) */}
              {benefitsTab === 'disponibles' && (
                <BenefitsFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  categories={categories}
                  isVisible={isVisible}
                />
              )}

              {/* Benefits Grid/List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                    : 'space-y-6'
                  }
                `}
              >
                {benefitsTab === 'disponibles' ? (
                  filteredBeneficios.length > 0 ? (
                    filteredBeneficios.map((beneficio, index) => (
                      <motion.div
                        key={beneficio.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <BenefitsCard
                          beneficio={beneficio}
                          tipo="disponible"
                          onUse={handleUseBenefit}
                          view={viewMode}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <Gift size={64} className="text-gray-300 mx-auto mb-6" />
                      <p className="text-gray-500 text-xl mb-4 font-jakarta">
                        {searchTerm || selectedCategory 
                          ? 'No se encontraron beneficios con los filtros aplicados'
                          : 'No hay beneficios disponibles'
                        }
                      </p>
                      {(searchTerm || selectedCategory) && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                          }}
                          className="text-violet-600 hover:text-violet-700 font-semibold text-lg"
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  beneficiosUsados.length > 0 ? (
                    beneficiosUsados.map((beneficioUso, index) => (
                      <motion.div
                        key={beneficioUso.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <BenefitsCard
                          beneficioUso={beneficioUso}
                          tipo="usado"
                          view={viewMode}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <Gift size={64} className="text-gray-300 mx-auto mb-6" />
                      <p className="text-gray-500 text-xl mb-4 font-jakarta">
                        No has usado beneficios aún
                      </p>
                      <button
                        onClick={() => setBenefitsTab('disponibles')}
                        className="text-violet-600 hover:text-violet-700 font-semibold text-lg"
                      >
                        Ver beneficios disponibles
                      </button>
                    </div>
                  )
                )}
              </motion.div>
            </div>
          </div>
        );

      case 'validar':
        return (
          <div className="dashboard-container min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-30"></div>
            <div className="relative z-10">
              <QRScannerSection
                onScan={handleQRScan}
                loading={loading}
                isVisible={isVisible}
              />
            </div>
          </div>
        );

      case 'notificaciones':
        return (
          <div className="dashboard-container min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-30"></div>
            <div className="relative z-10 p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8 }}
              >
                <NotificationsList
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onMarkAllAsRead={() => console.log('Mark all as read')}
                />
              </motion.div>
            </div>
          </div>
        );

      default:
        return (
          <div className="dashboard-container min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-30"></div>
            <div className="relative z-10 p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 via-celestial-500 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-jakarta">
                  Sección en Desarrollo
                </h2>
                <p className="text-slate-600 text-lg font-jakarta mb-8">
                  Esta funcionalidad estará disponible próximamente.
                </p>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-violet-600 hover:via-purple-600 hover:to-violet-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  Volver al Dashboard
                </button>
              </motion.div>
            </div>
          </div>
        );
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
        {renderDashboardContent()}
      </DashboardLayout>

      <ValidationResultModal
        open={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        result={validationResult}
      />

      {/* Enhanced Modal de Logout */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* Enhanced scroll to top button - matching homepage style */}
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
