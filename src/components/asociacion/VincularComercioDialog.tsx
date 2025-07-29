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
  Eye
} from 'lucide-react';
import { ComercioDisponible } from '@/services/adhesion.service';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';
import { useDebounce } from '@/hooks/useDebounce';

// Configuración de pasos del modal
const MODAL_STEPS = [
  {
    id: 'search',
    title: 'Buscar Comercios',
    subtitle: 'Encuentra comercios disponibles',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'filter',
    title: 'Filtrar Resultados',
    subtitle: 'Refina tu búsqueda',
    icon: Filter,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'select',
    title: 'Seleccionar Comercio',
    subtitle: 'Elige el comercio a vincular',
    icon: Link,
    color: 'from-green-500 to-emerald-500',
  }
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [comercios, setComercios] = useState<ComercioDisponible[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [vinculando, setVinculando] = useState<string | null>(null);
  const [selectedComercio, setSelectedComercio] = useState<ComercioDisponible | null>(null);

  const currentStepData = MODAL_STEPS[currentStep];

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Buscar comercios con debounce
  const debouncedSearch = useDebounce(async (termino: string) => {
    if (!termino.trim()) {
      setComercios([]);
      return;
    }

    setSearchLoading(true);
    try {
      const resultados = await onBuscar(termino);
      setComercios(resultados);
      if (resultados.length > 0 && currentStep === 0) {
        setCurrentStep(1); // Avanzar automáticamente a filtros si hay resultados
      }
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

  // Navegación entre pasos
  const nextStep = useCallback(() => {
    if (currentStep < MODAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

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
    setCurrentStep(2);
  };

  // Reset al cerrar
  const handleClose = useCallback(() => {
    setSearchTerm('');
    setSelectedCategoria('');
    setComercios([]);
    setSelectedComercio(null);
    setCurrentStep(0);
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative px-6 py-4 bg-gradient-to-r ${currentStepData.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <currentStepData.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Vincular Comercio
                      </h2>
                      <p className="text-white/80 text-sm">
                        {currentStepData.title} - {currentStepData.subtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Navegación por iconos */}
                <div className="mt-4 flex justify-center space-x-4">
                  {MODAL_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => goToStep(index)}
                        className={`relative p-3 rounded-xl transition-all duration-100 ${
                          isActive 
                            ? 'bg-white/30 scale-110' 
                            : isCompleted 
                              ? 'bg-white/20 hover:bg-white/25' 
                              : 'bg-white/10 hover:bg-white/15'
                        }`}
                      >
                        <StepIcon className={`w-5 h-5 ${
                          isActive || isCompleted ? 'text-white' : 'text-white/60'
                        }`} />
                        
                        {/* Indicador de completado */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Indicador de resultados */}
                {comerciosFiltrados.length > 0 && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {comerciosFiltrados.length} comercio(s) encontrado(s)
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Paso 1: Búsqueda */}
                  {currentStep === 0 && (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Buscar Comercios Disponibles
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Ingresa el nombre, email o categoría del comercio que deseas vincular a tu asociación.
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar por nombre, email o categoría..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                          autoFocus
                        />
                        {searchLoading && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>

                      {!searchTerm && (
                        <div className="text-center py-12">
                          <Search className="mx-auto h-16 w-16 text-gray-300" />
                          <h3 className="mt-4 text-lg font-medium text-gray-900">
                            Comienza tu búsqueda
                          </h3>
                          <p className="mt-2 text-gray-500">
                            Escribe el nombre del comercio que quieres vincular
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Paso 2: Filtros y Resultados */}
                  {currentStep === 1 && (
                    <motion.div
                      key="filter"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Filtrar Resultados
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Refina tu búsqueda usando los filtros disponibles.
                        </p>
                      </div>

                      {/* Filtros */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Categoría
                            </label>
                            <select
                              value={selectedCategoria}
                              onChange={(e) => setSelectedCategoria(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              Término de búsqueda
                            </label>
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Modificar búsqueda..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Resultados */}
                      <div className="max-h-96 overflow-y-auto">
                        {comerciosFiltrados.length === 0 && !searchLoading ? (
                          <div className="text-center py-12">
                            <Store className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No se encontraron comercios
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Intenta con otros términos de búsqueda
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {comerciosFiltrados.map((comercio) => (
                              <motion.div
                                key={comercio.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors cursor-pointer"
                                onClick={() => handleSelectComercio(comercio)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4 flex-1">
                                    {/* Logo */}
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      {comercio.logoUrl ? (
                                        <Image
                                          src={comercio.logoUrl}
                                          alt={comercio.nombreComercio}
                                          width={48}
                                          height={48}
                                          className="w-full h-full rounded-lg object-cover"
                                        />
                                      ) : (
                                        <Store className="w-6 h-6 text-gray-400" />
                                      )}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                                          {comercio.nombreComercio}
                                        </h4>
                                        {comercio.verificado && (
                                          <Check className="w-5 h-5 text-green-500" />
                                        )}
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          {comercio.categoria}
                                        </span>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
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
                                        </div>
                                        
                                        {comercio.direccion && (
                                          <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {comercio.direccion}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Action Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectComercio(comercio);
                                    }}
                                    className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ver detalles
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Paso 3: Selección y Confirmación */}
                  {currentStep === 2 && selectedComercio && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Confirmar Vinculación
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Revisa los detalles del comercio antes de vincularlo a tu asociación.
                        </p>
                      </div>

                      {/* Detalles del comercio seleccionado */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-start space-x-6">
                          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            {selectedComercio.logoUrl ? (
                              <Image
                                src={selectedComercio.logoUrl}
                                alt={selectedComercio.nombreComercio}
                                width={80}
                                height={80}
                                className="w-full h-full rounded-xl object-cover"
                              />
                            ) : (
                              <Store className="w-10 h-10 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {selectedComercio.nombreComercio}
                              </h3>
                              {selectedComercio.verificado && (
                                <div className="flex items-center text-green-600">
                                  <Check className="w-6 h-6" />
                                  <span className="ml-1 text-sm font-medium">Verificado</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Categoría:</span>
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {selectedComercio.categoria}
                                </span>
                              </div>
                              
                              <div>
                                <span className="font-medium text-gray-700">Email:</span>
                                <span className="ml-2 text-gray-600">{selectedComercio.email}</span>
                              </div>
                              
                              {selectedComercio.telefono && (
                                <div>
                                  <span className="font-medium text-gray-700">Teléfono:</span>
                                  <span className="ml-2 text-gray-600">{selectedComercio.telefono}</span>
                                </div>
                              )}
                              
                              {selectedComercio.direccion && (
                                <div>
                                  <span className="font-medium text-gray-700">Dirección:</span>
                                  <span className="ml-2 text-gray-600">{selectedComercio.direccion}</span>
                                </div>
                              )}
                              
                              {selectedComercio.puntuacion > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700">Puntuación:</span>
                                  <div className="ml-2 inline-flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-gray-600">
                                      {selectedComercio.puntuacion.toFixed(1)} ({selectedComercio.totalReviews} reseñas)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Estado de vinculación */}
                            <div className="mt-4">
                              {selectedComercio.asociacionesVinculadas.length > 0 ? (
                                <div className="flex items-center text-amber-600">
                                  <AlertCircle className="w-5 h-5 mr-2" />
                                  <span className="font-medium">
                                    Ya vinculado a {selectedComercio.asociacionesVinculadas.length} asociación(es)
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center text-green-600">
                                  <Check className="w-5 h-5 mr-2" />
                                  <span className="font-medium">Disponible para vinculación</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botón de vinculación */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleVincular(selectedComercio)}
                          disabled={vinculando === selectedComercio.id || loading}
                          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {vinculando === selectedComercio.id ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Vinculando comercio...
                            </>
                          ) : (
                            <>
                              <Link className="w-5 h-5 mr-2" />
                              Vincular Comercio
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Anterior</span>
                </button>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>

                  {currentStep < MODAL_STEPS.length - 1 && comerciosFiltrados.length > 0 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Siguiente</span>
                    </button>
                  )}
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