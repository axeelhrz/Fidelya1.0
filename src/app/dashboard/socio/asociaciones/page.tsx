'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Gift,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Star,
  Award,
  Eye,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  Heart,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Crown,
  Medal
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Asociacion {
  id: string;
  nombre: string;
  descripcion?: string;
  logo?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  sitioWeb?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  fechaCreacion?: any;
  totalSocios?: number;
  totalComercios?: number;
  totalBeneficios?: number;
  beneficios?: any[];
  comercios?: any[];
  categoria?: string;
  rating?: number;
  destacada?: boolean;
}

interface FilterState {
  search: string;
  categoria: string;
  estado: string;
  sortBy: 'nombre' | 'socios' | 'beneficios' | 'fecha';
}

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

// Componente de tarjeta de asociación
const AsociacionCard: React.FC<{
  asociacion: Asociacion;
  index: number;
  onViewDetails: (asociacion: Asociacion) => void;
  isUserAssociation?: boolean;
}> = ({ asociacion, index, onViewDetails, isUserAssociation = false }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200';
      case 'inactivo':
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 'suspendido':
        return 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      default:
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'inactivo':
        return <Clock size={16} className="text-gray-500" />;
      case 'suspendido':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      case 'suspendido':
        return 'Suspendido';
      default:
        return 'Desconocido';
    }
  };

  return (
    <motion.div
      className="group bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 group-hover:from-blue-500/10 group-hover:to-purple-600/10 transition-all duration-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
      
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {asociacion.destacada && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-lg text-xs font-black border border-amber-200">
            <Crown size={12} />
            Destacada
          </div>
        )}
        {isUserAssociation && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg text-xs font-black border border-green-200">
            <CheckCircle size={12} />
            Mi Asociación
          </div>
        )}
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-start gap-4">
          {/* Logo/Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {asociacion.logo ? (
              <img 
                src={asociacion.logo} 
                alt={asociacion.nombre}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              asociacion.nombre.charAt(0).toUpperCase()
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {asociacion.nombre}
                </h3>
                {asociacion.descripcion && (
                  <p className="text-gray-600 text-sm font-medium leading-relaxed mb-3">
                    {asociacion.descripcion}
                  </p>
                )}
                {asociacion.categoria && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Target size={14} />
                    <span className="font-medium">{asociacion.categoria}</span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm mb-2",
                  getEstadoColor(asociacion.estado)
                )}>
                  {getEstadoIcon(asociacion.estado)}
                  <span>{getEstadoText(asociacion.estado)}</span>
                </div>
                
                {asociacion.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-current" />
                    <span className="text-sm font-bold text-amber-600">
                      {asociacion.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users size={14} className="text-blue-600" />
                </div>
                <div className="text-lg font-black text-blue-700">
                  {asociacion.totalSocios || 0}
                </div>
                <div className="text-xs text-blue-600 font-bold">Socios</div>
              </div>
              
              <div className="text-center bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Store size={14} className="text-green-600" />
                </div>
                <div className="text-lg font-black text-green-700">
                  {asociacion.totalComercios || 0}
                </div>
                <div className="text-xs text-green-600 font-bold">Comercios</div>
              </div>
              
              <div className="text-center bg-purple-50 px-3 py-2 rounded-xl border border-purple-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Gift size={14} className="text-purple-600" />
                </div>
                <div className="text-lg font-black text-purple-700">
                  {asociacion.totalBeneficios || 0}
                </div>
                <div className="text-xs text-purple-600 font-bold">Beneficios</div>
              </div>
            </div>

            {/* Información de contacto */}
            {(asociacion.email || asociacion.telefono || asociacion.direccion) && (
              <div className="space-y-2 mb-4">
                {asociacion.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span className="font-medium truncate">{asociacion.email}</span>
                  </div>
                )}
                {asociacion.telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span className="font-medium">{asociacion.telefono}</span>
                  </div>
                )}
                {asociacion.direccion && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span className="font-medium truncate">{asociacion.direccion}</span>
                  </div>
                )}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Eye size={16} />}
                onClick={() => onViewDetails(asociacion)}
                className="group-hover:scale-105 transition-transform duration-200"
              >
                Ver Detalles
              </Button>
              
              {asociacion.sitioWeb && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ExternalLink size={16} />}
                  onClick={() => window.open(asociacion.sitioWeb, '_blank')}
                  className="group-hover:scale-105 transition-transform duration-200"
                >
                  Sitio Web
                </Button>
              )}
              
              <Button
                size="sm"
                leftIcon={<ArrowUpRight size={16} />}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 group-hover:scale-105 transition-transform duration-200"
              >
                Explorar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de filtros
const FilterSection: React.FC<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearFilters: () => void;
  totalAsociaciones: number;
}> = ({ filters, setFilters, onClearFilters, totalAsociaciones }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200/20 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Filter size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Filtros y Búsqueda</h3>
              <p className="text-sm text-gray-600 font-medium">
                {totalAsociaciones} asociación{totalAsociaciones !== 1 ? 'es' : ''} disponible{totalAsociaciones !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'} Filtros
              <ChevronDown size={16} className={cn("ml-2 transition-transform", isExpanded && "rotate-180")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              leftIcon={<RefreshCw size={16} />}
            >
              Limpiar
            </Button>
          </div>
        </div>

        <motion.div 
          className={cn(
            "grid gap-4 transition-all duration-300",
            isExpanded || window.innerWidth >= 1024 ? "grid-cols-1 lg:grid-cols-4 opacity-100" : "grid-cols-1 lg:grid-cols-4 opacity-100 lg:opacity-100"
          )}
          style={{ display: isExpanded || window.innerWidth >= 1024 ? 'grid' : 'none' }}
        >
          <div>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar asociaciones..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <select
              value={filters.categoria}
              onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">🏷️ Todas las categorías</option>
              <option value="deportiva">⚽ Deportiva</option>
              <option value="cultural">🎭 Cultural</option>
              <option value="profesional">💼 Profesional</option>
              <option value="social">👥 Social</option>
              <option value="educativa">📚 Educativa</option>
              <option value="comercial">🏪 Comercial</option>
            </select>
          </div>

          <div>
            <select
              value={filters.estado}
              onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">📊 Todos los estados</option>
              <option value="activo">✅ Activas</option>
              <option value="inactivo">⏸️ Inactivas</option>
              <option value="suspendido">❌ Suspendidas</option>
            </select>
          </div>

          <div>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="nombre">🔤 Por nombre</option>
              <option value="socios">👥 Por socios</option>
              <option value="beneficios">🎁 Por beneficios</option>
              <option value="fecha">📅 Por fecha</option>
            </select>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Componente principal del contenido
const SocioAsociacionesContent: React.FC = () => {
  const { user, signOut } = useAuth();
  const [asociaciones, setAsociaciones] = useState<Asociacion[]>([]);
  const [userAsociacionId, setUserAsociacionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsociacion, setSelectedAsociacion] = useState<Asociacion | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoria: '',
    estado: '',
    sortBy: 'nombre'
  });

  // Cargar asociaciones
  useEffect(() => {
    const loadAsociaciones = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener la asociación del usuario actual
        if (user) {
          try {
            const socioQuery = query(
              collection(db, 'socios'),
              where('email', '==', user.email?.toLowerCase())
            );
            const socioSnapshot = await getDocs(socioQuery);
            
            if (!socioSnapshot.empty) {
              const socioData = socioSnapshot.docs[0].data();
              if (socioData.asociacionId) {
                setUserAsociacionId(socioData.asociacionId);
              }
            }
          } catch (err) {
            console.error('Error obteniendo asociación del usuario:', err);
          }
        }

        // 2. Obtener todas las asociaciones
        const asociacionesQuery = query(
          collection(db, 'asociaciones'),
          orderBy('nombre', 'asc')
        );
        const asociacionesSnapshot = await getDocs(asociacionesQuery);

        const asociacionesData = await Promise.all(
          asociacionesSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            
            // Obtener estadísticas de cada asociación
            const [sociosSnapshot, comerciosSnapshot, beneficiosSnapshot] = await Promise.all([
              getDocs(query(collection(db, 'socios'), where('asociacionId', '==', doc.id))),
              getDocs(query(collection(db, 'comercios'), where('asociacionId', '==', doc.id))),
              getDocs(query(collection(db, 'beneficios'), where('asociacionId', '==', doc.id)))
            ]);

            return {
              id: doc.id,
              nombre: data.nombre || 'Asociación',
              descripcion: data.descripcion,
              logo: data.logo,
              email: data.email,
              telefono: data.telefono,
              direccion: data.direccion,
              sitioWeb: data.sitioWeb,
              estado: data.estado || 'activo',
              fechaCreacion: data.creadoEn,
              totalSocios: sociosSnapshot.size,
              totalComercios: comerciosSnapshot.size,
              totalBeneficios: beneficiosSnapshot.size,
              beneficios: beneficiosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
              comercios: comerciosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
              categoria: data.categoria || 'general',
              rating: data.rating || (4 + Math.random()),
              destacada: data.destacada || Math.random() > 0.7
            } as Asociacion;
          })
        );

        setAsociaciones(asociacionesData);
      } catch (err) {
        console.error('Error cargando asociaciones:', err);
        setError('Error al cargar las asociaciones');
      } finally {
        setLoading(false);
      }
    };

    loadAsociaciones();
  }, [user]);

  // Filtrar y ordenar asociaciones
  const filteredAsociaciones = useMemo(() => {
    let filtered = [...asociaciones];

    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(asociacion => 
        asociacion.nombre.toLowerCase().includes(searchLower) ||
        (asociacion.descripcion && asociacion.descripcion.toLowerCase().includes(searchLower)) ||
        (asociacion.categoria && asociacion.categoria.toLowerCase().includes(searchLower))
      );
    }

    // Filtro de categoría
    if (filters.categoria) {
      filtered = filtered.filter(asociacion => asociacion.categoria === filters.categoria);
    }

    // Filtro de estado
    if (filters.estado) {
      filtered = filtered.filter(asociacion => asociacion.estado === filters.estado);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'socios':
          return (b.totalSocios || 0) - (a.totalSocios || 0);
        case 'beneficios':
          return (b.totalBeneficios || 0) - (a.totalBeneficios || 0);
        case 'fecha':
          const fechaA = a.fechaCreacion?.toDate?.() || new Date(0);
          const fechaB = b.fechaCreacion?.toDate?.() || new Date(0);
          return fechaB.getTime() - fechaA.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [asociaciones, filters]);

  // Handlers
  const handleViewDetails = (asociacion: Asociacion) => {
    setSelectedAsociacion(asociacion);
    setDetailModalOpen(true);
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      window.location.reload();
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoria: '',
      estado: '',
      sortBy: 'nombre'
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Error state
  if (error) {
    return (
      <DashboardLayout
        activeSection="asociaciones"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogout}
          />
        )}
      >
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/30 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <AlertCircle size={40} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Error al cargar asociaciones</h3>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <Button onClick={handleRefresh} leftIcon={<RefreshCw size={16} />}>
                Reintentar
              </Button>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="asociaciones"
      sidebarComponent={(props) => (
        <SocioSidebarWithLogout
          {...props}
          onLogoutClick={handleLogout}
        />
      )}
    >
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 relative overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/40 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/40 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-50/20 to-blue-50/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-violet-400/60 rounded-full animate-bounce" />
        <div className="absolute top-40 left-16 w-3 h-3 bg-sky-400/60 rounded-full animate-ping" />
        <div className="absolute bottom-32 right-32 w-5 h-5 bg-purple-400/60 rounded-full animate-pulse" />

        <motion.div
          className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Header */}
          <motion.div 
            className="mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Building2 size={32} className="text-white lg:w-10 lg:h-10" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 leading-tight">
                    Asociaciones
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-semibold max-w-2xl">
                    Explora todas las asociaciones disponibles y sus beneficios
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 flex-wrap">
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
                  leftIcon={<TrendingUp size={16} />}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Estadísticas
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filter Section */}
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            onClearFilters={clearFilters}
            totalAsociaciones={filteredAsociaciones.length}
          />

          {/* Asociaciones Grid */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl border border-white/30 p-6 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded-xl w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-12 bg-gray-200 rounded-xl"></div>
                            <div className="h-12 bg-gray-200 rounded-xl"></div>
                            <div className="h-12 bg-gray-200 rounded-xl"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAsociaciones.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAsociaciones.map((asociacion, index) => (
                    <AsociacionCard
                      key={asociacion.id}
                      asociacion={asociacion}
                      index={index}
                      onViewDetails={handleViewDetails}
                      isUserAssociation={asociacion.id === userAsociacionId}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                    <Building2 size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">
                    {filters.search || filters.categoria || filters.estado
                      ? 'No se encontraron asociaciones'
                      : 'No hay asociaciones disponibles'
                    }
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    {filters.search || filters.categoria || filters.estado
                      ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas'
                      : 'Actualmente no hay asociaciones registradas en el sistema'
                    }
                  </p>
                  {filters.search || filters.categoria || filters.estado ? (
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      leftIcon={<RefreshCw size={16} />}
                    >
                      Limpiar Filtros
                    </Button>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

// Main page component with Suspense boundary
export default function SocioAsociacionesPage() {
  return (
    <Suspense fallback={
      <DashboardLayout
        activeSection="asociaciones"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={() => {}}
          />
        )}
      >
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-100/30 to-transparent rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <RefreshCw size={40} className="text-white animate-spin" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Cargando asociaciones...</h3>
              <p className="text-gray-600 text-lg">Preparando la información de las asociaciones</p>
              
              <div className="mt-8 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full animate-pulse mx-auto w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse mx-auto w-1/2" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse mx-auto w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    }>
      <SocioAsociacionesContent />
    </Suspense>
  );
}