'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Building2,
  Users,
  Gift,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Shield,
  ExternalLink,
  Activity,
  Target,
  Clock,
  CheckCircle,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Beneficio {
  id: string;
  titulo: string;
  descripcion?: string;
  descuento?: number;
  tipoDescuento?: 'porcentaje' | 'monto_fijo';
  categoria?: string;
  estado: 'activo' | 'inactivo' | 'vencido';
  comercioNombre?: string;
  condiciones?: string;
  usosMaximos?: number;
  usosActuales?: number;
}

interface Comercio {
  id: string;
  nombre: string;
  categoria?: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  logo?: string;
  beneficiosCount?: number;
}

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
  fechaVinculacion?: Date | { toDate: () => Date } | null;
  totalSocios?: number;
  totalComercios?: number;
  totalBeneficios?: number;
  beneficios?: Beneficio[];
  comercios?: Comercio[];
  rating?: number;
  numeroSocio?: string;
  beneficiosActivos?: number;
  comerciosActivos?: number;
  sociosActivos?: number;
}

interface AsociacionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asociacion: Asociacion;
  onNavigateToBeneficios: () => void;
}

export const AsociacionDetailsModal: React.FC<AsociacionDetailsModalProps> = ({
  isOpen,
  onClose,
  asociacion,
  onNavigateToBeneficios
}) => {
  if (!isOpen) return null;

  const beneficiosActivos = asociacion.beneficios?.filter(b => b.estado === 'activo') || [];
  const comerciosActivos = asociacion.comercios?.filter(c => c.estado === 'activo') || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                  {asociacion.logo ? (
                    <Image
                      src={asociacion.logo}
                      alt={asociacion.nombre}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-2xl"
                      style={{ objectFit: 'cover', borderRadius: '1rem' }}
                      unoptimized={true}
                    />
                  ) : (
                    asociacion.nombre.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{asociacion.nombre}</h2>
                  {asociacion.descripcion && (
                    <p className="text-white/90 mb-3">{asociacion.descripcion}</p>
                  )}
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    {asociacion.numeroSocio && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                        <Shield size={14} className="text-white" />
                        <span className="text-sm font-semibold">Socio #{asociacion.numeroSocio}</span>
                      </div>
                    )}
                    
                    {asociacion.fechaVinculacion && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                        <Calendar size={14} className="text-white" />
                        <span className="text-sm font-semibold">
                          Desde {format(
                            typeof asociacion.fechaVinculacion === 'object' && asociacion.fechaVinculacion !== null && 'toDate' in asociacion.fechaVinculacion
                              ? asociacion.fechaVinculacion.toDate()
                              : (asociacion.fechaVinculacion as Date),
                            'MMMM yyyy',
                            { locale: es }
                          )}
                        </span>
                      </div>
                    )}
                    
                    {asociacion.rating && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                        <Star size={14} className="text-white fill-current" />
                        <span className="text-sm font-semibold">{asociacion.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Users size={20} className="text-white" />
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {asociacion.sociosActivos || asociacion.totalSocios || 0}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Socios</div>
                </div>
                
                <div className="text-center bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Store size={20} className="text-white" />
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {comerciosActivos.length}
                  </div>
                  <div className="text-sm text-green-600 font-medium">Comercios</div>
                </div>
                
                <div className="text-center bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Gift size={20} className="text-white" />
                  </div>
                  <div className="text-xl font-bold text-purple-700">
                    {beneficiosActivos.length}
                  </div>
                  <div className="text-sm text-purple-600 font-medium">Beneficios</div>
                </div>
                
                <div className="text-center bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Activity size={20} className="text-white" />
                  </div>
                  <div className="text-xl font-bold text-amber-700">
                    {asociacion.rating ? (asociacion.rating * 20).toFixed(0) : '85'}
                  </div>
                  <div className="text-sm text-amber-600 font-medium">Actividad</div>
                </div>
              </div>

              {/* Beneficios Destacados */}
              {beneficiosActivos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Gift size={18} className="text-purple-600" />
                    Beneficios Disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {beneficiosActivos.slice(0, 4).map((beneficio) => (
                      <div key={beneficio.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 flex-1">{beneficio.titulo}</h4>
                          {beneficio.descuento && (
                            <div className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                              {beneficio.tipoDescuento === 'porcentaje' ? `${beneficio.descuento}%` : `$${beneficio.descuento}`}
                            </div>
                          )}
                        </div>
                        
                        {beneficio.descripcion && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{beneficio.descripcion}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {beneficio.comercioNombre && (
                              <div className="flex items-center gap-1">
                                <Store size={12} className="text-gray-400" />
                                <span className="text-xs text-gray-600">{beneficio.comercioNombre}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Disponible</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {beneficiosActivos.length > 4 && (
                    <div className="text-center mt-4">
                      <Button
                        onClick={onNavigateToBeneficios}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      >
                        Ver todos los beneficios ({beneficiosActivos.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Comercios Afiliados */}
              {comerciosActivos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Store size={18} className="text-green-600" />
                    Comercios Afiliados
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {comerciosActivos.slice(0, 8).map((comercio) => (
                      <div key={comercio.id} className="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                          {comercio.logo ? (
                            <Image
                              src={comercio.logo}
                              alt={comercio.nombre}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover rounded-xl"
                              style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
                              unoptimized={true}
                            />
                          ) : (
                            <Store size={16} className="text-white" />
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{comercio.nombre}</h4>
                        {comercio.categoria && (
                          <p className="text-xs text-gray-600 mt-1">{comercio.categoria}</p>
                        )}
                        {comercio.beneficiosCount && comercio.beneficiosCount > 0 && (
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <Gift size={10} className="text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              {comercio.beneficiosCount} beneficio{comercio.beneficiosCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de Contacto */}
              {(asociacion.email || asociacion.telefono || asociacion.direccion || asociacion.sitioWeb) && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail size={18} className="text-blue-600" />
                    Información de Contacto
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {asociacion.email && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Mail size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Email</div>
                            <div className="text-sm font-semibold text-gray-900">{asociacion.email}</div>
                          </div>
                        </div>
                      )}
                      
                      {asociacion.telefono && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <Phone size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Teléfono</div>
                            <div className="text-sm font-semibold text-gray-900">{asociacion.telefono}</div>
                          </div>
                        </div>
                      )}
                      
                      {asociacion.direccion && (
                        <div className="flex items-center gap-3 md:col-span-2">
                          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                            <MapPin size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Dirección</div>
                            <div className="text-sm font-semibold text-gray-900">{asociacion.direccion}</div>
                          </div>
                        </div>
                      )}
                      
                      {asociacion.sitioWeb && (
                        <div className="flex items-center gap-3 md:col-span-2">
                          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                            <Globe size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Sitio Web</div>
                            <a 
                              href={asociacion.sitioWeb} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline"
                            >
                              {asociacion.sitioWeb}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
                
                {asociacion.sitioWeb && (
                  <Button
                    variant="outline"
                    leftIcon={<ExternalLink size={16} />}
                    onClick={() => window.open(asociacion.sitioWeb, '_blank')}
                  >
                    Visitar Sitio Web
                  </Button>
                )}
                
                <Button
                  leftIcon={<Gift size={16} />}
                  onClick={onNavigateToBeneficios}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Ver Beneficios
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AsociacionDetailsModal;
