'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  History, 
  TrendingUp, 
  Search, 
  Clock,
  MapPin,
  Zap,
  Heart,
  Eye,
  Share2,
  Calendar,
  Store,
  DollarSign,
  Sparkles,
  CheckCircle,
  AlertCircle,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpRight,
  Flame,
  Crown,
  ShoppingBag,
  Utensils,
  Car,
  Gamepad2,
  Scissors,
  Dumbbell,
  GraduationCap,
  Stethoscope,
  X,
  RefreshCw,
  Copy,
  QrCode,
  Navigation,
  Phone,
  Globe,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Beneficio } from '@/types/beneficio';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useAuth } from '@/hooks/useAuth';
import { format, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// Enhanced interfaces
interface FilterState {
  search: string;
  categoria: string;
  ordenar: string;
  soloDestacados: boolean;
  soloNuevos: boolean;
  proximosAVencer: boolean;
}

interface BenefitStats {
  disponibles: number;
  usados: number;
  ahorroTotal: number;
  ahorroEsteMes: number;
  nuevos: number;
  porVencer: number;
  favoritos: number;
}

// Utility functions
const getCategoryIcon = (categoria: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Retail': <ShoppingBag size={20} />,
    'Restaurantes': <Utensils size={20} />,
    'Servicios': <Scissors size={20} />,
    'Entretenimiento': <Gamepad2 size={20} />,
    'Transporte': <Car size={20} />,
    'Salud': <Stethoscope size={20} />,
    'Educación': <GraduationCap size={20} />,
    'Deportes': <Dumbbell size={20} />
  };
  return icons[categoria] || <Store size={20} />;
};

const getComercioColor = (comercioNombre: string) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
  const index = comercioNombre.length % colors.length;
  return colors[index];
};

const getDiscountText = (beneficio: Beneficio) => {
  switch (beneficio.tipo) {
    case 'porcentaje':
      return `${beneficio.descuento}% OFF`;
    case 'monto_fijo':
      return `$${beneficio.descuento} OFF`;
    case 'producto_gratis':
      return 'GRATIS';
    default:
      return 'DESCUENTO';
  }
};

const isEndingSoon = (fechaFin: Date | { toDate: () => Date }) => {
  const vencimiento = (fechaFin as { toDate?: () => Date }).toDate ? (fechaFin as { toDate: () => Date }).toDate() : new Date(fechaFin as Date);
  const en7Dias = addDays(new Date(), 7);
  return isBefore(vencimiento, en7Dias);
};

const isNew = (
  fechaCreacion: Date | { toDate: () => Date }
) => {
  const creacion =
    (fechaCreacion as { toDate?: () => Date }).toDate
      ? (fechaCreacion as { toDate: () => Date }).toDate()
      : new Date(fechaCreacion as Date);
  const hace7Dias = addDays(new Date(), -7);
  return isAfter(creacion, hace7Dias);
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Badge component
const Badge = React.memo<{ variant: 'category' | 'discount' | 'featured' | 'new' | 'ending'; children: React.ReactNode }>(({ variant, children }) => {
  const variants = {
    category: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
    discount: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30',
    featured: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30',
    new: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
    ending: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide',
      variants[variant]
    )}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// Loading skeleton component
const BenefitCardSkeleton = React.memo<{ view: 'grid' | 'list' }>(({ view }) => (
  <div className={cn(
    'bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse',
    view === 'list' ? 'flex items-center p-6 h-32' : 'h-96'
  )}>
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="flex gap-2 pt-4">
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
      </div>
    </div>
  </div>
));

BenefitCardSkeleton.displayName = 'BenefitCardSkeleton';

// Main component
export default function SocioBeneficiosPage() {
  const { user } = useAuth();
  const { 
    beneficios, 
    beneficiosUsados, 
    loading, 
    error, 
    aplicarBeneficio: applyBenefit
  } = useBeneficios();

  // Local state
  const [activeTab, setActiveTab] = useState<'disponibles' | 'usados'>('disponibles');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBenefit, setSelectedBenefit] = useState<Beneficio | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoria: '',
    ordenar: 'fecha_desc',
    soloDestacados: false,
    soloNuevos: false,
    proximosAVencer: false
  });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('beneficios-favoritos');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('beneficios-favoritos', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Calculate stats
  const stats = useMemo<BenefitStats>(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const ahorroEsteMes = beneficiosUsados
      .filter(uso => {
        const fechaUso = typeof uso.fechaUso?.toDate === 'function'
          ? uso.fechaUso.toDate()
          : new Date(uso.fechaUso as unknown as string | number | Date);
        return fechaUso.getMonth() === thisMonth && fechaUso.getFullYear() === thisYear;
      })
      .reduce((total, uso) => total + (uso.montoDescuento || 0), 0);

    const nuevos = beneficios.filter(b => isNew(b.creadoEn)).length;
    const porVencer = beneficios.filter(b => isEndingSoon(b.fechaFin)).length;

    return {
      disponibles: beneficios.length,
      usados: beneficiosUsados.length,
      ahorroTotal: beneficiosUsados.reduce((total, uso) => total + (uso.montoDescuento || 0), 0),
      ahorroEsteMes,
      nuevos,
      porVencer,
      favoritos: favorites.size
    };
  }, [beneficios, beneficiosUsados, favorites.size]);

  // Filter and sort benefits
  const filteredBeneficios = useMemo(() => {
    const filtered = beneficios.filter(beneficio => {
      const matchesSearch = !filters.search || 
        beneficio.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
        beneficio.descripcion.toLowerCase().includes(filters.search.toLowerCase()) ||
        beneficio.comercioNombre.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.categoria || beneficio.categoria === filters.categoria;
      const matchesDestacados = !filters.soloDestacados || beneficio.destacado;
      const matchesNuevos = !filters.soloNuevos || isNew(beneficio.creadoEn);
      const matchesProximosAVencer = !filters.proximosAVencer || isEndingSoon(beneficio.fechaFin);
      
      return matchesSearch && matchesCategory && matchesDestacados && matchesNuevos && matchesProximosAVencer;
    });

    // Sort benefits
    filtered.sort((a, b) => {
      switch (filters.ordenar) {
        case 'fecha_desc':
          return (
            (typeof b.creadoEn?.toDate === 'function'
              ? b.creadoEn.toDate()
              : b.creadoEn instanceof Date
                ? b.creadoEn
                : b.creadoEn instanceof Date
                  ? b.creadoEn
                  : typeof b.creadoEn?.toDate === 'function'
                    ? b.creadoEn.toDate()
                    : new Date(
                        typeof b.creadoEn === 'object' && typeof b.creadoEn?.toDate === 'function'
                          ? b.creadoEn.toDate()
                          : b.creadoEn instanceof Date
                            ? b.creadoEn
                            : new Date(b.creadoEn as unknown as string | number)
                      )
            ).getTime() -
            (typeof a.creadoEn?.toDate === 'function'
              ? a.creadoEn.toDate()
              : a.creadoEn instanceof Date
                ? a.creadoEn
                : typeof a.creadoEn?.toDate === 'function'
                  ? a.creadoEn.toDate()
                  : new Date(
                      typeof a.creadoEn === 'object' && typeof a.creadoEn?.toDate === 'function'
                        ? a.creadoEn.toDate()
                        : a.creadoEn instanceof Date
                          ? a.creadoEn
                          : new Date(a.creadoEn as unknown as string | number)
                    )
            ).getTime()
          );
        case 'fecha_asc':
          return (
            (a.creadoEn && typeof a.creadoEn.toDate === 'function'
              ? a.creadoEn.toDate()
              : new Date(a.creadoEn as unknown as string | number | Date)
            ).getTime() -
            (b.creadoEn && typeof b.creadoEn.toDate === 'function'
              ? b.creadoEn.toDate()
              : new Date(b.creadoEn as unknown as string | number | Date)
            ).getTime()
          );
        case 'descuento_desc':
          return b.descuento - a.descuento;
        case 'descuento_asc':
          return a.descuento - b.descuento;
        case 'vencimiento':
          return (
            (typeof a.fechaFin?.toDate === 'function'
              ? a.fechaFin.toDate()
              : a.fechaFin instanceof Date
                ? a.fechaFin
                : new Date(a.fechaFin as unknown as string | number)
            ).getTime() -
            (typeof b.fechaFin?.toDate === 'function'
              ? b.fechaFin.toDate()
              : b.fechaFin instanceof Date
                ? b.fechaFin
                : new Date(b.fechaFin as unknown as string | number)
            ).getTime()
          );
        case 'popularidad':
          return b.usosActuales - a.usosActuales;
        default:
          return 0;
      }
    });

    return filtered;
  }, [beneficios, filters]);

  // Get unique categories
  const categorias = useMemo(() => {
    return Array.from(new Set(beneficios.map(b => b.categoria)));
  }, [beneficios]);

  // Handlers
  const handleUseBenefit = useCallback(async (beneficio: Beneficio) => {
    if (!user) return;
    
    setActionLoading(beneficio.id);
    try {
      await applyBenefit(beneficio.id, beneficio.comercioId);
      toast.success('¡Beneficio usado exitosamente!');
      setDetailModalOpen(false);
    } catch {
      toast.error('Error al usar el beneficio');
    } finally {
      setActionLoading(null);
    }
  }, [user, applyBenefit]);

  const handleViewDetails = useCallback((beneficio: Beneficio) => {
    setSelectedBenefit(beneficio);
    setDetailModalOpen(true);
  }, []);

  const handleToggleFavorite = useCallback((beneficioId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(beneficioId)) {
        newFavorites.delete(beneficioId);
        toast.success('Eliminado de favoritos');
      } else {
        newFavorites.add(beneficioId);
        toast.success('Agregado a favoritos');
      }
      return newFavorites;
    });
  }, []);

  const handleShare = useCallback(async (beneficio: Beneficio) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: beneficio.titulo,
          text: beneficio.descripcion,
          url: window.location.href
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${beneficio.titulo} - ${beneficio.descripcion}`);
        toast.success('Copiado al portapapeles');
      } catch {
        toast.error('Error al copiar');
      }
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // The useBeneficios hook will automatically refresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      categoria: '',
      ordenar: 'fecha_desc',
      soloDestacados: false,
      soloNuevos: false,
      proximosAVencer: false
    });
    setSearchTerm('');
  }, []);

  // Error state
  if (error) {
    return (
      <DashboardLayout
        activeSection="beneficios"
        sidebarComponent={(props) => (
          <SocioSidebar
            {...props}
            onLogoutClick={() => {
              // Implement logout logic here, or use your existing logout handler
              // For now, just a placeholder
              window.location.href = '/logout';
            }}
          />
        )}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar beneficios</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={handleRefresh} leftIcon={<RefreshCw size={16} />}>
              Reintentar
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="beneficios"
      sidebarComponent={(props) => (
        <SocioSidebar
          {...props}
          onLogoutClick={() => {
            // Implement logout logic here, or use your existing logout handler
            window.location.href = '/logout';
          }}
        />
      )}
    >
      <motion.div
        className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Mis Beneficios
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Descubre y utiliza todos los descuentos y ofertas especiales
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                Actualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Heart size={16} />}
              >
                Favoritos ({favorites.size})
              </Button>
              <Button
                size="sm"
                leftIcon={<Sparkles size={16} />}
              >
                Explorar Nuevos
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <Gift size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{stats.disponibles}</div>
                <div className="text-sm font-semibold text-gray-600">Disponibles</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-green-600 font-semibold">+{stats.nuevos} nuevos</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <DollarSign size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">${stats.ahorroTotal.toLocaleString()}</div>
                <div className="text-sm font-semibold text-gray-600">Total Ahorrado</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp size={14} className="text-indigo-600" />
              <span className="text-indigo-600 font-semibold">${stats.ahorroEsteMes} este mes</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
                <History size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{stats.usados}</div>
                <div className="text-sm font-semibold text-gray-600">Usados</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Clock size={14} className="text-yellow-600" />
              <span className="text-yellow-600 font-semibold">Historial completo</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                <AlertCircle size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{stats.porVencer}</div>
                <div className="text-sm font-semibold text-gray-600">Por Vencer</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Flame size={14} className="text-red-600" />
              <span className="text-red-600 font-semibold">¡Úsalos pronto!</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg mb-6 md:mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <SlidersHorizontal size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Filtros y Búsqueda</h3>
                <p className="text-sm text-gray-600">Encuentra exactamente lo que buscas</p>
              </div>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'grid' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'list' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por nombre, comercio o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>

            <div>
              <select
                value={filters.categoria}
                onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.ordenar}
                onChange={(e) => setFilters(prev => ({ ...prev, ordenar: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="fecha_desc">Más recientes</option>
                <option value="fecha_asc">Más antiguos</option>
                <option value="descuento_desc">Mayor descuento</option>
                <option value="descuento_asc">Menor descuento</option>
                <option value="vencimiento">Por vencer</option>
                <option value="popularidad">Más populares</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, soloDestacados: !prev.soloDestacados }))}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filters.soloDestacados
                  ? 'bg-yellow-500 text-white border-yellow-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-yellow-500 hover:text-yellow-600'
              )}
            >
              <Crown size={12} className="inline mr-1" />
              Solo Destacados
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, soloNuevos: !prev.soloNuevos }))}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filters.soloNuevos
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-600'
              )}
            >
              <Sparkles size={12} className="inline mr-1" />
              Solo Nuevos
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, proximosAVencer: !prev.proximosAVencer }))}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filters.proximosAVencer
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-red-500 hover:text-red-600'
              )}
            >
              <Flame size={12} className="inline mr-1" />
              Por Vencer
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              leftIcon={<X size={14} />}
            >
              Limpiar
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex bg-gray-100 rounded-2xl p-1 mb-6 md:mb-8"
          variants={itemVariants}
        >
          <button
            onClick={() => setActiveTab('disponibles')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all',
              activeTab === 'disponibles'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Gift size={18} />
            Disponibles
            <span className={cn(
              'px-2 py-1 rounded-lg text-xs font-bold',
              activeTab === 'disponibles' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            )}>
              {stats.disponibles}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('usados')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all',
              activeTab === 'usados'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <History size={18} />
            Usados
            <span className={cn(
              'px-2 py-1 rounded-lg text-xs font-bold',
              activeTab === 'usados' ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'
            )}>
              {stats.usados}
            </span>
          </button>
        </motion.div>

        {/* Benefits Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className={cn(
                'grid gap-4 md:gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <BenefitCardSkeleton key={index} view={viewMode} />
              ))}
            </motion.div>
          ) : activeTab === 'disponibles' ? (
            <motion.div
              key="disponibles"
              className={cn(
                'grid gap-4 md:gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredBeneficios.length > 0 ? (
                filteredBeneficios.map((beneficio, index) => (
                  <motion.div
                    key={beneficio.id}
                    className={cn(
                      'bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative',
                      viewMode === 'list' && 'flex items-center p-6',
                      beneficio.destacado && 'ring-2 ring-yellow-400 ring-opacity-50'
                    )}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Featured indicator */}
                    {beneficio.destacado && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                    )}

                    {/* Favorite button */}
                    <button
                      onClick={() => handleToggleFavorite(beneficio.id)}
                      className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      {favorites.has(beneficio.id) ? (
                        <Heart size={16} className="text-red-500 fill-current" />
                      ) : (
                        <Heart size={16} className="text-gray-400" />
                      )}
                    </button>

                    <div className={cn('p-6', viewMode === 'list' && 'flex-1')}>
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="category">
                          {getCategoryIcon(beneficio.categoria)}
                          <span className="ml-1">{beneficio.categoria}</span>
                        </Badge>
                        <Badge variant="discount">
                          {getDiscountText(beneficio)}
                        </Badge>
                        {beneficio.destacado && (
                          <Badge variant="featured">
                            <Crown size={12} className="mr-1" />
                            Destacado
                          </Badge>
                        )}
                        {isNew(beneficio.creadoEn) && (
                          <Badge variant="new">
                            <Sparkles size={12} className="mr-1" />
                            Nuevo
                          </Badge>
                        )}
                        {isEndingSoon(beneficio.fechaFin) && (
                          <Badge variant="ending">
                            <Flame size={12} className="mr-1" />
                            Por vencer
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {beneficio.titulo}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {beneficio.descripcion}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Vence: {format(
                            typeof beneficio.fechaFin?.toDate === 'function'
                              ? beneficio.fechaFin.toDate()
                              : new Date(beneficio.fechaFin as unknown as string | number | Date),
                            'dd/MM/yyyy', 
                            { locale: es }
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          {beneficio.usosActuales} usos
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye size={16} />}
                          onClick={() => handleViewDetails(beneficio)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<Zap size={16} />}
                          onClick={() => handleUseBenefit(beneficio)}
                          loading={actionLoading === beneficio.id}
                        >
                          Usar Ahora
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Share2 size={16} />}
                          onClick={() => handleShare(beneficio)}
                        >
                          <span className="sr-only">Compartir</span>
                        </Button>
                      </div>
                    </div>

                    {/* Commerce info (only in grid view) */}
                    {viewMode === 'grid' && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: getComercioColor(beneficio.comercioNombre) }}
                          >
                            {beneficio.comercioNombre.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {beneficio.comercioNombre}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin size={12} />
                              Centro Comercial
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ArrowUpRight size={16} />}
                          >
                            <span className="sr-only">Ver comercio</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-12"
                  variants={itemVariants}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No se encontraron beneficios
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Intenta ajustar los filtros o buscar con otros términos
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="usados"
              className={cn(
                'grid gap-4 md:gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {beneficiosUsados.length > 0 ? (
                beneficiosUsados.map((uso, index) => (
                  <motion.div
                    key={uso.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden p-6"
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex gap-2 mb-4">
                      <Badge variant="category">
                        <CheckCircle size={12} className="mr-1" />
                        Usado
                      </Badge>
                      {uso.montoDescuento && uso.montoDescuento > 0 && (
                        <Badge variant="discount">
                          ${uso.montoDescuento} ahorrado
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Beneficio Usado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {uso.detalles || 'Beneficio utilizado exitosamente'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(
                          typeof uso.fechaUso?.toDate === 'function'
                            ? uso.fechaUso.toDate()
                            : new Date(uso.fechaUso as unknown as string | number | Date),
                          'dd/MM/yyyy HH:mm', 
                          { locale: es }
                        )}
                      </div>
                      {uso.montoDescuento && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          ${uso.montoDescuento}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye size={16} />}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Share2 size={16} />}
                      >
                        Compartir
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-12"
                  variants={itemVariants}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <History size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No has usado beneficios aún
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Cuando uses un beneficio, aparecerá aquí con los detalles del ahorro
                  </p>
                  <Button onClick={() => setActiveTab('disponibles')}>
                    Explorar Beneficios
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Modal */}
        <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedBenefit && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    {getCategoryIcon(selectedBenefit.categoria)}
                    {selectedBenefit.titulo}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Header del beneficio */}
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ background: getComercioColor(selectedBenefit.comercioNombre) }}
                    >
                      {selectedBenefit.comercioNombre.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedBenefit.comercioNombre}
                      </h3>
                      <p className="text-gray-600 mb-3">{selectedBenefit.categoria}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="discount">
                          {getDiscountText(selectedBenefit)}
                        </Badge>
                        {selectedBenefit.destacado && (
                          <Badge variant="featured">
                            <Crown size={12} className="mr-1" />
                            Destacado
                          </Badge>
                        )}
                        {isNew(selectedBenefit.creadoEn) && (
                          <Badge variant="new">
                            <Sparkles size={12} className="mr-1" />
                            Nuevo
                          </Badge>
                        )}
                        {isEndingSoon(selectedBenefit.fechaFin) && (
                          <Badge variant="ending">
                            <Flame size={12} className="mr-1" />
                            Por vencer
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(selectedBenefit.id)}
                      className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      {favorites.has(selectedBenefit.id) ? (
                        <Heart size={20} className="text-red-500 fill-current" />
                      ) : (
                        <Heart size={20} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Eye size={16} />
                      Descripción del Beneficio
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">{selectedBenefit.descripcion}</p>
                    </div>
                  </div>

                  {/* Condiciones */}
                  {selectedBenefit.condiciones && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Términos y Condiciones
                      </h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-gray-700 leading-relaxed">{selectedBenefit.condiciones}</p>
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600" />
                        <h5 className="font-semibold text-blue-900">Válido hasta</h5>
                      </div>
                      <p className="text-lg font-bold text-blue-700">
                        {format(
                          (typeof selectedBenefit.fechaFin?.toDate === 'function'
                            ? selectedBenefit.fechaFin.toDate()
                            : new Date(selectedBenefit.fechaFin as unknown as string | number | Date)
                          ),
                          'dd MMMM yyyy', 
                          { locale: es }
                        )}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        {differenceInDays(
                          (typeof selectedBenefit.fechaFin?.toDate === 'function'
                            ? selectedBenefit.fechaFin.toDate()
                            : new Date(selectedBenefit.fechaFin as unknown as string | number | Date)
                          ),
                          new Date()
                        )} días restantes
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-green-600" />
                        <h5 className="font-semibold text-green-900">Popularidad</h5>
                      </div>
                      <p className="text-lg font-bold text-green-700">
                        {selectedBenefit.usosActuales} usos
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        Beneficio popular
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-purple-600" />
                        <h5 className="font-semibold text-purple-900">Ahorro estimado</h5>
                      </div>
                      <p className="text-lg font-bold text-purple-700">
                        {selectedBenefit.tipo === 'porcentaje' ? `${selectedBenefit.descuento}%` : 
                         selectedBenefit.tipo === 'monto_fijo' ? `$${selectedBenefit.descuento}` : 
                         'Producto gratis'}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        En tu compra
                      </p>
                    </div>
                  </div>

                  {/* Ubicación del comercio */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-indigo-900 mb-2">Ubicación del Comercio</h5>
                        <div className="space-y-2">
                          <p className="text-indigo-800 font-medium">{selectedBenefit.comercioNombre}</p>
                          <p className="text-indigo-700">Centro Comercial - Local 123</p>
                          <p className="text-sm text-indigo-600">Av. Principal 456, Ciudad</p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Navigation size={14} />}
                            >
                              Cómo llegar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Phone size={14} />}
                            >
                              Llamar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Globe size={14} />}
                            >
                              Sitio web
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instrucciones de uso */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                        <QrCode size={20} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-900">¿Cómo usar este beneficio?</h5>
                        <p className="text-sm text-green-700">Sigue estos pasos para aplicar tu descuento</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className="text-green-800">Haz clic en &quot;Usar Beneficio&quot; para activarlo</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className="text-green-800">Presenta tu código QR en el comercio</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className="text-green-800">El empleado validará tu beneficio y aplicará el descuento</p>
                      </div>
                    </div>
                  </div>

                  {/* Beneficios similares */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles size={16} />
                      Beneficios Similares
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {beneficios
                        .filter(b => b.id !== selectedBenefit.id && b.categoria === selectedBenefit.categoria)
                        .slice(0, 2)
                        .map(beneficio => (
                          <div key={beneficio.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: getComercioColor(beneficio.comercioNombre) }}
                              >
                                {beneficio.comercioNombre.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-semibold text-gray-900 text-sm truncate">{beneficio.titulo}</h6>
                                <p className="text-xs text-gray-600 truncate">{beneficio.comercioNombre}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="discount">
                                    {getDiscountText(beneficio)}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedBenefit(beneficio);
                                }}
                              >
                                Ver
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-2 flex-1">
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selectedBenefit)}
                      leftIcon={<Share2 size={16} />}
                      className="flex-1 sm:flex-none"
                    >
                      Compartir
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedBenefit.titulo);
                        toast.success('Título copiado');
                      }}
                      leftIcon={<Copy size={16} />}
                      className="flex-1 sm:flex-none"
                    >
                      Copiar
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-1 sm:flex-none">
                    <Button
                      variant="outline"
                      onClick={() => setDetailModalOpen(false)}
                      leftIcon={<X size={16} />}
                      className="flex-1 sm:flex-none"
                    >
                      Cerrar
                    </Button>
                    <Button
                      onClick={() => handleUseBenefit(selectedBenefit)}
                      loading={actionLoading === selectedBenefit.id}
                      leftIcon={<Zap size={16} />}
                      className="flex-1 sm:flex-none"
                    >
                      Usar Beneficio
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
