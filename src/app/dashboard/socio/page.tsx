'use client';

import React, { useState, useMemo } from 'react';
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
  Sparkles,
  QrCode,
  Smartphone,
  Camera,
  RefreshCw,
  ChevronDown,
  X,
} from 'lucide-react';

// Enhanced Quick Actions Component
const QuickActions: React.FC<{
  onScanQR: () => void;
  onViewBenefits: () => void;
  onViewProfile: () => void;
  onViewNotifications: () => void;
  unreadNotifications: number;
}> = ({ onScanQR, onViewBenefits, onViewProfile, onViewNotifications, unreadNotifications }) => {
  const quickActions = [
    {
      id: 'scan',
      label: 'Escanear QR',
      icon: <QrCode size={20} />,
      color: 'from-violet-500 to-purple-600',
      onClick: onScanQR,
      description: 'Validar beneficio'
    },
    {
      id: 'benefits',
      label: 'Mis Beneficios',
      icon: <Gift size={20} />,
      color: 'from-emerald-500 to-teal-600',
      onClick: onViewBenefits,
      description: 'Ver disponibles'
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: <Star size={20} />,
      color: 'from-amber-500 to-orange-600',
      onClick: onViewProfile,
      description: 'Editar información'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: <Sparkles size={20} />,
      color: 'from-pink-500 to-rose-600',
      onClick: onViewNotifications,
      badge: unreadNotifications,
      description: 'Mensajes nuevos'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {quickActions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className={`
            relative p-6 rounded-2xl bg-gradient-to-br ${action.color} 
            text-white shadow-lg hover:shadow-xl transition-all duration-300
            group overflow-hidden
          `}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
          </div>

          {/* Badge */}
          {action.badge && action.badge > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {action.badge > 99 ? '99+' : action.badge}
            </div>
          )}

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </div>
            <h3 className="font-bold text-lg mb-1">{action.label}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      ))}
    </div>
  );
};

// Enhanced Benefits Filter Component
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
}> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  categories
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar beneficios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="newest">Más recientes</option>
              <option value="discount">Mayor descuento</option>
              <option value="ending">Por vencer</option>
              <option value="popular">Más populares</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200
              ${filtersOpen 
                ? 'bg-violet-50 border-violet-200 text-violet-700' 
                : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'grid' 
                ? 'bg-white shadow-sm text-violet-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'list' 
                ? 'bg-white shadow-sm text-violet-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de descuento
                </label>
                <div className="space-y-2">
                  {['porcentaje', 'monto_fijo', 'producto_gratis'].map(type => (
                    <label key={type} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                      <span className="ml-2 text-sm text-gray-600 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de descuento
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <div className="space-y-2">
                  {['Disponible', 'Por vencer', 'Destacado'].map(status => (
                    <label key={status} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                      <span className="ml-2 text-sm text-gray-600">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced QR Scanner Section
const QRScannerSection: React.FC<{
  onScan: (qrData: string) => void;
  loading: boolean;
}> = ({ onScan, loading }) => {
  const [scannerMode, setScannerMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap size={32} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Validar Beneficio
            </h2>
            
            <p className="text-gray-600 mb-6">
              Escanea el código QR del comercio para validar tu acceso y usar tus beneficios.
            </p>
          </div>

          {/* Scanner Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setScannerMode('camera')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200
                ${scannerMode === 'camera' 
                  ? 'bg-white shadow-sm text-violet-600' 
                  : 'text-gray-500'
                }
              `}
            >
              <Camera size={16} />
              Cámara
            </button>
            <button
              onClick={() => setScannerMode('manual')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200
                ${scannerMode === 'manual' 
                  ? 'bg-white shadow-sm text-violet-600' 
                  : 'text-gray-500'
                }
              `}
            >
              <Smartphone size={16} />
              Manual
            </button>
          </div>

          {/* Scanner Content */}
          {scannerMode === 'camera' ? (
            <div className="space-y-4">
              <QRScannerButton onScan={onScan} loading={loading} />
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">💡</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-1">
                      Consejos para escanear
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Mantén el código dentro del marco</li>
                      <li>• Asegúrate de tener buena iluminación</li>
                      <li>• Mantén la cámara estable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código QR Manual
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ingresa el código QR aquí..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleManualSubmit}
                disabled={!manualCode.trim() || loading}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    Validando...
                  </div>
                ) : (
                  'Validar Código'
                )}
              </button>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700">
                  <strong>Nota:</strong> Solicita al comercio que te proporcione el código QR o el código de validación manual.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Sidebar personalizado que maneja el logout
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

  // Benefits filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(beneficios.map(b => b.categoria));
    return Array.from(cats);
  }, [beneficios]);

  // Filter and sort benefits
  const filteredBeneficios = useMemo(() => {
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

    // aplicarBeneficio is the renamed function that doesn't trigger ESLint hook rule
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
    // Aquí iría la lógica para marcar como leída
  };

  // Render dashboard content based on active section
  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-8">
            {/* Quick Actions */}
            <QuickActions
              onScanQR={handleScanQR}
              onViewBenefits={() => handleNavigate('beneficios')}
              onViewProfile={() => handleNavigate('perfil')}
              onViewNotifications={() => handleNavigate('notificaciones')}
              unreadNotifications={notificationStats.unread}
            />

            {/* Main Dashboard */}
            <SocioOverviewDashboard
              onNavigate={handleNavigate}
              onScanQR={handleScanQR}
            />
          </div>
        );

      case 'perfil':
        return (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfileCard />
              <AsociacionesList />
            </div>
          </div>
        );

      case 'beneficios':
        return (
          <div className="p-6 space-y-6">
            {/* Benefits Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Beneficios</h1>
                <p className="text-gray-600 mt-2">
                  Descubre y usa tus beneficios exclusivos
                </p>
              </div>
              <button
                onClick={handleScanQR}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
              >
                <QrCode size={20} />
                Escanear QR
              </button>
            </div>

            {/* Benefits Tabs */}
            <BenefitsTabs
              activeTab={benefitsTab}
              onTabChange={setBenefitsTab}
              stats={{
                disponibles: beneficios.length,
                usados: beneficiosUsados.length,
                ahorroTotal: beneficiosUsados.reduce((total, b) => total + (b.montoDescuento || 0), 0)
              }}
            />

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
              />
            )}

            {/* Benefits Grid/List */}
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
            `}>
              {benefitsTab === 'disponibles' ? (
                filteredBeneficios.length > 0 ? (
                  filteredBeneficios.map((beneficio) => (
                    <BenefitsCard
                      key={beneficio.id}
                      beneficio={beneficio}
                      tipo="disponible"
                      onUse={handleUseBenefit}
                      view={viewMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Gift size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
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
                        className="text-violet-600 hover:text-violet-700 font-medium"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                )
              ) : (
                beneficiosUsados.length > 0 ? (
                  beneficiosUsados.map((beneficioUso) => (
                    <BenefitsCard
                      key={beneficioUso.id}
                      beneficioUso={beneficioUso}
                      tipo="usado"
                      view={viewMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Gift size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No has usado beneficios aún</p>
                    <button
                      onClick={() => setBenefitsTab('disponibles')}
                      className="text-violet-600 hover:text-violet-700 font-medium"
                    >
                      Ver beneficios disponibles
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case 'validar':
        return (
          <QRScannerSection
            onScan={handleQRScan}
            loading={loading}
          />
        );

      case 'notificaciones':
        return (
          <div className="p-6">
            <NotificationsList
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={() => console.log('Mark all as read')}
            />
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Sección en Desarrollo
              </h2>
              <p className="text-gray-500">
                Esta funcionalidad estará disponible próximamente.
              </p>
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

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}