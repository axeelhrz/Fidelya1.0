'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  Link,
  Users,
  Eye,
  ArrowRight,
  Zap,
  Target,
  Globe
} from 'lucide-react';
import { ComercioDisponible } from '@/services/adhesion.service';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';
import { useDebounce } from '@/hooks/useDebounce';

interface VincularComercioDialogProps {
  open: boolean;
  onClose: () => void;
  onVincular: (comercioId: string) => Promise<boolean>;
  onBuscar: (termino: string) => Promise<ComercioDisponible[]>;
  loading: boolean;
}

export const VincularComercioDialog: React.FC<VincularComercioDialogProps> = ({
  open,
  onClose,
  onVincular,
  onBuscar,
  loading
}) => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [comercios, setComercios] = useState<ComercioDisponible[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [vinculando, setVinculando] = useState<string | null>(null);
  const [selectedComercio, setSelectedComercio] = useState<ComercioDisponible | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'results' | 'detail'>('search');

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Buscar comercios con debounce
  const debouncedSearch = useDebounce(async (termino: string) => {
    if (!termino.trim()) {
      setComercios([]);
      setViewMode('search');
      return;
    }

    setSearchLoading(true);
    try {
      const resultados = await onBuscar(termino);
      setComercios(resultados);
      setViewMode('results');
    } catch (error) {
      console.error('Error searching comercios:', error);
    } finally {
      setSearchLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Filtrar por categoría
  const comerciosFiltrados = selectedCategoria
    ? comercios.filter(comercio => comercio.categoria === selectedCategoria)
    : comercios;

  // Manejar vinculación
  const handleVincular = async (comercio: ComercioDisponible) => {
    setVinculando(comercio.id);
    try {
      const success = await onVincular(comercio.id);
      if (success) {
        handleClose();
      }
    } finally {
      setVinculando(null);
    }
  };

  // Seleccionar comercio para vista detallada
  const handleSelectComercio = (comercio: ComercioDisponible) => {
    setSelectedComercio(comercio);
    setViewMode('detail');
  };

  // Volver a resultados
  const backToResults = () => {
    setSelectedComercio(null);
    setViewMode('results');
  };

  // Reset al cerrar
  const handleClose = useCallback(() => {
    setSearchTerm('');
    setSelectedCategoria('');
    setComercios([]);
    setSelectedComercio(null);
    setViewMode('search');
    setShowFilters(false);
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop con efecto glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal con diseño único */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con diseño único */}
              <div className="relative overflow-hidden">
                {/* Fondo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                </div>
                
                <div className="relative px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Link className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-yellow-900" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Conectar Comercio
                        </h2>
                        <p className="text-white/80 text-sm">
                          Encuentra y vincula comercios a tu red de asociación
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Indicador de progreso */}
                      <div className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                        <div className={`w-2 h-2 rounded-full transition-colors ${viewMode === 'search' ? 'bg-white' : 'bg-white/40'}`} />
                        <div className={`w-2 h-2 rounded-full transition-colors ${viewMode === 'results' ? 'bg-white' : 'bg-white/40'}`} />
                        <div className={`w-2 h-2 rounded-full transition-colors ${viewMode === 'detail' ? 'bg-white' : 'bg-white/40'}`} />
                      </div>
                      
                      <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas rápidas */}
                  {comerciosFiltrados.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center justify-center space-x-6"
                    >
                      <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                        <Target className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">
                          {comerciosFiltrados.length} encontrados
                        </span>
                      </div>
                      {selectedCategoria && (
                        <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                          <Filter className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">
                            {selectedCategoria}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Content con transiciones únicas */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {/* Vista de búsqueda */}
                  {viewMode === 'search' && (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6">
                          <Search className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Descubre Comercios
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          Busca comercios por nombre, categoría o ubicación para expandir tu red de beneficios
                        </p>
                      </div>

                      {/* Barra de búsqueda principal */}
                      <div className="max-w-2xl mx-auto">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                          <div className="relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                            <div className="flex items-center">
                              <div className="pl-6 pr-4 py-4">
                                <Search className="w-6 h-6 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="Buscar comercios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 py-4 pr-6 text-lg placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
                                autoFocus
                              />
                              {searchLoading && (
                                <div className="pr-6">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sugerencias de búsqueda */}
                      <div className="max-w-4xl mx-auto">
                        <p className="text-sm text-gray-500 mb-4 text-center">Categorías populares:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {CATEGORIAS_COMERCIO.slice(0, 8).map((categoria) => (
                            <button
                              key={categoria}
                              onClick={() => setSearchTerm(categoria)}
                              className="px-4 py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-sm font-medium transition-colors"
                            >
                              {categoria}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Vista de resultados */}
                  {viewMode === 'results' && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Header de resultados */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Resultados de búsqueda
                          </h3>
                          <p className="text-gray-600">
                            {comerciosFiltrados.length} comercios encontrados
                          </p>
                        </div>
                        
                        {/* Filtros */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              showFilters 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Panel de filtros */}
                      <AnimatePresence>
                        {showFilters && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Categoría
                                </label>
                                <select
                                  value={selectedCategoria}
                                  onChange={(e) => setSelectedCategoria(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Búsqueda
                                </label>
                                <input
                                  type="text"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Refinar búsqueda..."
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  onClick={() => {
                                    setSelectedCategoria('');
                                    setSearchTerm('');
                                  }}
                                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                                >
                                  Limpiar filtros
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Lista de comercios */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                        {comerciosFiltrados.map((comercio, index) => (
                          <motion.div
                            key={comercio.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                          >
                            {/* Efecto hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative p-6">
                              <div className="flex items-start space-x-4">
                                {/* Logo */}
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                  {comercio.logoUrl ? (
                                    <Image
                                      src={comercio.logoUrl}
                                      alt={comercio.nombreComercio}
                                      width={64}
                                      height={64}
                                      className="w-full h-full rounded-2xl object-cover"
                                    />
                                  ) : (
                                    <Store className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                                        {comercio.nombreComercio}
                                      </h4>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                          {comercio.categoria}
                                        </span>
                                        {comercio.verificado && (
                                          <Check className="w-4 h-4 text-green-500" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                      <span className="truncate">{comercio.email}</span>
                                    </div>
                                    {comercio.telefono && (
                                      <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{comercio.telefono}</span>
                                      </div>
                                    )}
                                    {comercio.direccion && (
                                      <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{comercio.direccion}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Estado */}
                                  <div className="mt-3">
                                    {comercio.asociacionesVinculadas.length > 0 ? (
                                      <div className="flex items-center text-amber-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        <span>Ya vinculado ({comercio.asociacionesVinculadas.length})</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-green-600 text-sm">
                                        <Check className="w-4 h-4 mr-1" />
                                        <span>Disponible</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Botón de acción */}
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={() => handleSelectComercio(comercio)}
                                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors group-hover:scale-105"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver detalles
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Vista de detalle */}
                  {viewMode === 'detail' && selectedComercio && (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* Header de detalle */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={backToResults}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                        </button>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Detalles del Comercio
                          </h3>
                          <p className="text-gray-600">
                            Revisa la información antes de vincular
                          </p>
                        </div>
                      </div>

                      {/* Card de detalle */}
                      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border-2 border-indigo-100 p-8 shadow-lg">
                        <div className="flex items-start space-x-8">
                          {/* Logo grande */}
                          <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            {selectedComercio.logoUrl ? (
                              <Image
                                src={selectedComercio.logoUrl}
                                alt={selectedComercio.nombreComercio}
                                width={128}
                                height={128}
                                className="w-full h-full rounded-3xl object-cover"
                              />
                            ) : (
                              <Store className="w-16 h-16 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Información */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-6">
                              <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                  {selectedComercio.nombreComercio}
                                </h2>
                                <div className="flex items-center space-x-3">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    {selectedComercio.categoria}
                                  </span>
                                  {selectedComercio.verificado && (
                                    <div className="flex items-center text-green-600">
                                      <Check className="w-5 h-5 mr-1" />
                                      <span className="text-sm font-medium">Verificado</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Grid de información */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{selectedComercio.email}</p>
                                  </div>
                                </div>
                                
                                {selectedComercio.telefono && (
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                      <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Teléfono</p>
                                      <p className="font-medium text-gray-900">{selectedComercio.telefono}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-4">
                                {selectedComercio.direccion && (
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                      <MapPin className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Dirección</p>
                                      <p className="font-medium text-gray-900">{selectedComercio.direccion}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {selectedComercio.puntuacion > 0 && (
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                      <Star className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Puntuación</p>
                                      <p className="font-medium text-gray-900">
                                        {selectedComercio.puntuacion.toFixed(1)} ({selectedComercio.totalReviews} reseñas)
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Estado de vinculación */}
                            <div className="mb-8">
                              {selectedComercio.asociacionesVinculadas.length > 0 ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                  <div className="flex items-center text-amber-700">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    <span className="font-medium">
                                      Este comercio ya está vinculado a {selectedComercio.asociacionesVinculadas.length} asociación(es)
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                                  <div className="flex items-center text-green-700">
                                    <Check className="w-5 h-5 mr-2" />
                                    <span className="font-medium">
                                      Este comercio está disponible para vinculación
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botón de vinculación */}
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVincular(selectedComercio)}
                          disabled={vinculando === selectedComercio.id || loading}
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg font-semibold"
                        >
                          {vinculando === selectedComercio.id ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                              Vinculando comercio...
                            </>
                          ) : (
                            <>
                              <Link className="w-6 h-6 mr-3" />
                              Vincular Comercio
                              <Zap className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer minimalista */}
              <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {viewMode === 'search' && 'Busca comercios para expandir tu red'}
                    {viewMode === 'results' && `${comerciosFiltrados.length} comercios disponibles`}
                    {viewMode === 'detail' && 'Revisa los detalles antes de vincular'}
                  </div>
                  
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};