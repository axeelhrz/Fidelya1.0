import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Store,
  MapPin,
  Phone,
  Mail,
  Star,
  Check,
  AlertCircle,
  Filter,
  ChevronDown,
  Eye,
  Users,
  TrendingUp,
  Award,
  Clock,
  Globe,
  Zap,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Heart,
  Verified,
  SortAsc,
  SortDesc,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { ComercioDisponible } from '@/services/adhesion.service';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';

interface VincularComercioDialogProps {
  open: boolean;
  onClose: () => void;
  onVincular: (comercioId: string) => Promise<boolean>;
  onBuscar: (termino: string) => Promise<ComercioDisponible[]>;
  loading: boolean;
}

type SortOption = 'nombre' | 'puntuacion' | 'reviews' | 'fecha';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const VincularComercioDialog: React.FC<VincularComercioDialogProps> = ({
  open,
  onClose,
  onVincular,
  onBuscar,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [minPuntuacion, setMinPuntuacion] = useState(0);
  const [comercios, setComercios] = useState<ComercioDisponible[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState<ComercioDisponible | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [vinculando, setVinculando] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showPreview, setShowPreview] = useState(false);
  const [previewComercio, setPreviewComercio] = useState<ComercioDisponible | null>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (termino: string) => {
      if (!termino.trim()) {
        setComercios([]);
        return;
      }

      setSearchLoading(true);
      try {
        const resultados = await onBuscar(termino);
        setComercios(resultados);
      } catch (error) {
        console.error('Error searching comercios:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    [onBuscar]
  );

  // Handle search term change
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Filter and sort comercios
  const comerciosFiltrados = useMemo(() => {
    let filtered = comercios.filter(comercio => {
      const matchesCategoria = !selectedCategoria || comercio.categoria === selectedCategoria;
      const matchesEstado = !selectedEstado || comercio.estado === selectedEstado;
      const matchesPuntuacion = comercio.puntuacion >= minPuntuacion;
      
      return matchesCategoria && matchesEstado && matchesPuntuacion;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'nombre':
          aValue = a.nombreComercio.toLowerCase();
          bValue = b.nombreComercio.toLowerCase();
          break;
        case 'puntuacion':
          aValue = a.puntuacion;
          bValue = b.puntuacion;
          break;
        case 'reviews':
          aValue = a.totalReviews;
          bValue = b.totalReviews;
          break;
        case 'fecha':
          aValue = a.creadoEn.toDate();
          bValue = b.creadoEn.toDate();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [comercios, selectedCategoria, selectedEstado, minPuntuacion, sortBy, sortDirection]);

  // Handle vincular
  const handleVincular = async (comercio: ComercioDisponible) => {
    setVinculando(comercio.id);
    try {
      const success = await onVincular(comercio.id);
      if (success) {
        onClose();
      }
    } finally {
      setVinculando(null);
    }
  };

  // Handle preview
  const handlePreview = (comercio: ComercioDisponible) => {
    setPreviewComercio(comercio);
    setShowPreview(true);
  };

  // Reset on close
  const handleClose = () => {
    setSearchTerm('');
    setSelectedCategoria('');
    setSelectedEstado('');
    setMinPuntuacion(0);
    setComercios([]);
    setSelectedComercio(null);
    setShowFilters(false);
    setShowPreview(false);
    setPreviewComercio(null);
    onClose();
  };

  // Toggle sort
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Vincular Nuevo Comercio
                  </h3>
                  <p className="text-blue-100 mt-1">
                    Descubre y conecta con comercios increíbles
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500 bg-white shadow-sm"
                />
                {searchLoading && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      showFilters 
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros Avanzados
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {comerciosFiltrados.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {comerciosFiltrados.length} comercio{comerciosFiltrados.length !== 1 ? 's' : ''} encontrado{comerciosFiltrados.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Sort Options */}
                  <div className="flex items-center bg-white rounded-lg border-2 border-gray-200 p-1">
                    {[
                      { key: 'nombre', label: 'Nombre', icon: SortAsc },
                      { key: 'puntuacion', label: 'Puntuación', icon: Star },
                      { key: 'reviews', label: 'Reviews', icon: Users },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => handleSort(key as SortOption)}
                        className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          sortBy === key
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {label}
                        {sortBy === key && (
                          sortDirection === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center bg-white rounded-lg border-2 border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'list' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Categoría
                        </label>
                        <select
                          value={selectedCategoria}
                          onChange={(e) => setSelectedCategoria(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Todas las categorías</option>
                          {CATEGORIAS_COMERCIO.map(categoria => (
                            <option key={categoria} value={categoria}>
                              {categoria}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado
                        </label>
                        <select
                          value={selectedEstado}
                          onChange={(e) => setSelectedEstado(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Todos los estados</option>
                          <option value="activo">Activo</option>
                          <option value="pendiente">Pendiente</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Puntuación mínima
                        </label>
                        <select
                          value={minPuntuacion}
                          onChange={(e) => setMinPuntuacion(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value={0}>Cualquier puntuación</option>
                          <option value={3}>3+ estrellas</option>
                          <option value={4}>4+ estrellas</option>
                          <option value={4.5}>4.5+ estrellas</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setSelectedCategoria('');
                            setSelectedEstado('');
                            setMinPuntuacion(0);
                          }}
                          className="w-full px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Limpiar Filtros
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {!searchTerm ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Descubre Comercios Increíbles
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Ingresa un término de búsqueda para encontrar comercios disponibles para vincular a tu asociación
                </p>
              </div>
            ) : comerciosFiltrados.length === 0 && !searchLoading ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron comercios
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Intenta ajustar los filtros de búsqueda o usar términos diferentes
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comerciosFiltrados.map((comercio) => (
                  <motion.div
                    key={comercio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          {comercio.logoUrl ? (
                            <img
                              src={comercio.logoUrl}
                              alt={comercio.nombreComercio}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <Store className="w-7 h-7 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {comercio.nombreComercio}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">{comercio.nombre}</p>
                        </div>
                      </div>
                      
                      {comercio.verificado && (
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Verified className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Category and Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {comercio.categoria}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        comercio.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {comercio.estado === 'activo' ? 'Activo' : 'Pendiente'}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{comercio.email}</span>
                      </div>
                      
                      {comercio.telefono && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {comercio.telefono}
                        </div>
                      )}
                      
                      {comercio.direccion && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{comercio.direccion}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating and Reviews */}
                    {comercio.puntuacion > 0 && (
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(comercio.puntuacion)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900 ml-2">
                          {comercio.puntuacion.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({comercio.totalReviews} reseñas)
                        </span>
                      </div>
                    )}

                    {/* Status */}
                    <div className="mb-6">
                      {comercio.asociacionesVinculadas.length > 0 ? (
                        <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Ya vinculado a {comercio.asociacionesVinculadas.length} asociación(es)
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                          <Zap className="w-4 h-4 mr-2" />
                          Disponible para vinculación
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(comercio)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border-2 border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Vista Previa
                      </button>
                      
                      <button
                        onClick={() => handleVincular(comercio)}
                        disabled={vinculando === comercio.id || loading}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {vinculando === comercio.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Vinculando...
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Vincular
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {comerciosFiltrados.map((comercio) => (
                  <motion.div
                    key={comercio.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Logo */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          {comercio.logoUrl ? (
                            <img
                              src={comercio.logoUrl}
                              alt={comercio.nombreComercio}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <Store className="w-8 h-8 text-blue-600" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-xl font-bold text-gray-900 truncate">
                              {comercio.nombreComercio}
                            </h4>
                            {comercio.verificado && (
                              <Verified className="w-5 h-5 text-green-600" />
                            )}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {comercio.categoria}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {comercio.email}
                            </div>
                            
                            {comercio.telefono && (
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {comercio.telefono}
                              </div>
                            )}
                            
                            {comercio.puntuacion > 0 && (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                                {comercio.puntuacion.toFixed(1)} ({comercio.totalReviews} reseñas)
                              </div>
                            )}
                          </div>

                          {comercio.direccion && (
                            <div className="flex items-center text-sm text-gray-600 mt-2">
                              <MapPin className="w-4 h-4 mr-2" />
                              {comercio.direccion}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-3 ml-6">
                        <button
                          onClick={() => handlePreview(comercio)}
                          className="inline-flex items-center px-4 py-2 border-2 border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Vista Previa
                        </button>
                        
                        <button
                          onClick={() => handleVincular(comercio)}
                          disabled={vinculando === comercio.id || loading}
                          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {vinculando === comercio.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Vinculando...
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4 mr-2" />
                              Vincular
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {comerciosFiltrados.length > 0 && (
                  <span>Mostrando {comerciosFiltrados.length} comercio{comerciosFiltrados.length !== 1 ? 's' : ''}</span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewComercio && (
          <div className="fixed inset-0 z-60 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setShowPreview(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              >
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Vista Previa del Comercio</h3>
                        <p className="text-blue-100 text-sm">Información detallada</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {previewComercio.logoUrl ? (
                        <img
                          src={previewComercio.logoUrl}
                          alt={previewComercio.nombreComercio}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <Store className="w-10 h-10 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-2xl font-bold text-gray-900">
                          {previewComercio.nombreComercio}
                        </h4>
                        {previewComercio.verificado && (
                          <Verified className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{previewComercio.nombre}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {previewComercio.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900">Información de Contacto</h5>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-5 h-5 mr-3 text-gray-400" />
                          {previewComercio.email}
                        </div>
                        {previewComercio.telefono && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-5 h-5 mr-3 text-gray-400" />
                            {previewComercio.telefono}
                          </div>
                        )}
                        {previewComercio.direccion && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                            {previewComercio.direccion}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900">Estadísticas</h5>
                      <div className="space-y-3">
                        {previewComercio.puntuacion > 0 && (
                          <div className="flex items-center">
                            <Star className="w-5 h-5 mr-3 text-yellow-400 fill-current" />
                            <span className="font-medium">{previewComercio.puntuacion.toFixed(1)}</span>
                            <span className="text-gray-500 ml-2">({previewComercio.totalReviews} reseñas)</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-3 text-gray-400" />
                          Registrado: {previewComercio.creadoEn.toDate().toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 mr-3 text-gray-400" />
                          {previewComercio.asociacionesVinculadas.length} asociación(es) vinculada(s)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-6">
                    {previewComercio.asociacionesVinculadas.length > 0 ? (
                      <div className="flex items-center text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
                        <AlertCircle className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">Ya vinculado a otras asociaciones</p>
                          <p className="text-sm">Este comercio ya está vinculado a {previewComercio.asociacionesVinculadas.length} asociación(es)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                        <Zap className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">Disponible para vinculación</p>
                          <p className="text-sm">Este comercio está disponible y listo para ser vinculado</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(false);
                        handleVincular(previewComercio);
                      }}
                      disabled={vinculando === previewComercio.id || loading}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {vinculando === previewComercio.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Vinculando...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Vincular Comercio
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}