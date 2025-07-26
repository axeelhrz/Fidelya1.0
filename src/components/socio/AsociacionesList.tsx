'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Eye,
  ArrowUpRight,
  Shield,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  RefreshCw,
  Info
} from 'lucide-react';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
}

interface SocioAsociacionInfo {
  asociacion: Asociacion;
  fechaVinculacion?: any;
  estado: 'activo' | 'inactivo' | 'pendiente' | 'vencido';
  numeroSocio?: string;
  tipo: 'principal' | 'secundaria';
}

interface AsociacionesListProps {
  className?: string;
  showHeader?: boolean;
  maxHeight?: string;
}

const AsociacionesList: React.FC<AsociacionesListProps> = ({
  className = '',
  showHeader = true,
  maxHeight = 'max-h-96'
}) => {
  const { user } = useAuth();
  const [asociaciones, setAsociaciones] = useState<SocioAsociacionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar asociaciones del socio
  useEffect(() => {
    const loadAsociaciones = async () => {
      if (!user || user.role !== 'socio') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Buscar el socio en la colección socios
        const socioRef = doc(db, 'socios', user.uid);
        const socioDoc = await getDoc(socioRef);

        if (!socioDoc.exists()) {
          // Si no existe por UID, buscar por email
          const sociosQuery = query(
            collection(db, 'socios'),
            where('email', '==', user.email?.toLowerCase())
          );
          const sociosSnapshot = await getDocs(sociosQuery);
          
          if (sociosSnapshot.empty) {
            setError('No se encontró información del socio');
            return;
          }
        }

        const socioData = socioDoc.exists() ? socioDoc.data() : null;
        const asociacionesInfo: SocioAsociacionInfo[] = [];

        // 2. Si el socio tiene una asociación principal
        if (socioData?.asociacionId) {
          try {
            const asociacionRef = doc(db, 'asociaciones', socioData.asociacionId);
            const asociacionDoc = await getDoc(asociacionRef);

            if (asociacionDoc.exists()) {
              const asociacionData = asociacionDoc.data();
              
              // Obtener estadísticas adicionales de la asociación
              const [sociosSnapshot, comerciosSnapshot, beneficiosSnapshot] = await Promise.all([
                getDocs(query(collection(db, 'socios'), where('asociacionId', '==', socioData.asociacionId))),
                getDocs(query(collection(db, 'comercios'), where('asociacionId', '==', socioData.asociacionId))),
                getDocs(query(collection(db, 'beneficios'), where('asociacionId', '==', socioData.asociacionId)))
              ]);

              asociacionesInfo.push({
                asociacion: {
                  id: asociacionDoc.id,
                  nombre: asociacionData.nombre || 'Asociación',
                  descripcion: asociacionData.descripcion,
                  logo: asociacionData.logo,
                  email: asociacionData.email,
                  telefono: asociacionData.telefono,
                  direccion: asociacionData.direccion,
                  sitioWeb: asociacionData.sitioWeb,
                  estado: asociacionData.estado || 'activo',
                  fechaCreacion: asociacionData.creadoEn,
                  totalSocios: sociosSnapshot.size,
                  totalComercios: comerciosSnapshot.size,
                  totalBeneficios: beneficiosSnapshot.size
                },
                fechaVinculacion: socioData.fechaVinculacion,
                estado: socioData.estado || 'activo',
                numeroSocio: socioData.numeroSocio,
                tipo: 'principal'
              });
            }
          } catch (err) {
            console.error('Error cargando asociación principal:', err);
          }
        }

        // 3. Buscar asociaciones adicionales (si las hubiera en el futuro)
        // Por ahora, el sistema maneja una asociación por socio, pero está preparado para múltiples

        setAsociaciones(asociacionesInfo);
      } catch (err) {
        console.error('Error cargando asociaciones:', err);
        setError('Error al cargar las asociaciones');
      } finally {
        setLoading(false);
      }
    };

    loadAsociaciones();
  }, [user]);

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200';
      case 'vencido':
        return 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      case 'pendiente':
        return 'text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
      case 'inactivo':
      case 'suspendido':
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'vencido':
        return <XCircle size={16} className="text-red-500" />;
      case 'pendiente':
        return <Clock size={16} className="text-amber-500" />;
      case 'inactivo':
      case 'suspendido':
        return <AlertCircle size={16} className="text-gray-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  // Función para obtener el texto del estado
  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'vencido':
        return 'Vencido';
      case 'pendiente':
        return 'Pendiente';
      case 'inactivo':
        return 'Inactivo';
      case 'suspendido':
        return 'Suspendido';
      default:
        return 'Desconocido';
    }
  };

  // Animaciones
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
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className={cn("bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6", className)}>
        {showHeader && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Mis Asociaciones</h3>
              <p className="text-sm text-gray-600 font-medium">Organizaciones a las que perteneces</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-center py-8">
          <div className="relative">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-indigo-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6", className)}>
        {showHeader && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center">
              <AlertCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Error</h3>
              <p className="text-sm text-gray-600 font-medium">No se pudieron cargar las asociaciones</p>
            </div>
          </div>
        )}
        
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors duration-200"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6", className)}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Mis Asociaciones</h3>
              <p className="text-sm text-gray-600 font-medium">
                {asociaciones.length === 0 
                  ? 'No perteneces a ninguna asociación' 
                  : `Perteneces a ${asociaciones.length} asociación${asociaciones.length > 1 ? 'es' : ''}`
                }
              </p>
            </div>
          </div>
          
          {asociaciones.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-200">
              <Users size={14} />
              {asociaciones.length} Asociación{asociaciones.length > 1 ? 'es' : ''}
            </div>
          )}
        </div>
      )}

      <motion.div
        className={cn("space-y-4", maxHeight, "overflow-y-auto")}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {asociaciones.length === 0 ? (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Building2 size={32} className="text-gray-400" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">Sin Asociaciones</h4>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Actualmente no perteneces a ninguna asociación. Contacta con una asociación para solicitar tu vinculación.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                  <Info size={16} />
                  ¿Cómo unirme a una asociación?
                </div>
                <p className="text-blue-600 text-sm">
                  Contacta directamente con la asociación de tu interés. Ellos podrán vincularte a su sistema de beneficios.
                </p>
              </div>
            </motion.div>
          ) : (
            asociaciones.map((info, index) => (
              <motion.div
                key={info.asociacion.id}
                className="group bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 group-hover:from-blue-500/10 group-hover:to-indigo-600/10 transition-all duration-500" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    {/* Logo/Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {info.asociacion.logo ? (
                        <img 
                          src={info.asociacion.logo} 
                          alt={info.asociacion.nombre}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        info.asociacion.nombre.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {info.asociacion.nombre}
                          </h4>
                          {info.asociacion.descripcion && (
                            <p className="text-gray-600 text-sm font-medium leading-relaxed mb-2">
                              {info.asociacion.descripcion}
                            </p>
                          )}
                          {info.numeroSocio && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Shield size={14} />
                              <span className="font-medium">Socio #{info.numeroSocio}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm mb-2",
                            getEstadoColor(info.estado)
                          )}>
                            {getEstadoIcon(info.estado)}
                            <span>{getEstadoText(info.estado)}</span>
                          </div>
                          
                          {info.tipo === 'principal' && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-lg text-xs font-black border border-amber-200">
                              <Star size={12} />
                              Principal
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {info.asociacion.totalSocios !== undefined && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
                            <Users size={14} className="text-blue-600" />
                            <span className="text-sm font-bold text-blue-700">
                              {info.asociacion.totalSocios} Socios
                            </span>
                          </div>
                        )}
                        
                        {info.asociacion.totalComercios !== undefined && (
                          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
                            <Building2 size={14} className="text-green-600" />
                            <span className="text-sm font-bold text-green-700">
                              {info.asociacion.totalComercios} Comercios
                            </span>
                          </div>
                        )}
                        
                        {info.asociacion.totalBeneficios !== undefined && (
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl">
                            <Award size={14} className="text-purple-600" />
                            <span className="text-sm font-bold text-purple-700">
                              {info.asociacion.totalBeneficios} Beneficios
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Información de contacto */}
                      {(info.asociacion.email || info.asociacion.telefono || info.asociacion.direccion) && (
                        <div className="space-y-2 mb-4">
                          {info.asociacion.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />
                              <span className="font-medium">{info.asociacion.email}</span>
                            </div>
                          )}
                          {info.asociacion.telefono && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              <span className="font-medium">{info.asociacion.telefono}</span>
                            </div>
                          )}
                          {info.asociacion.direccion && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={14} />
                              <span className="font-medium">{info.asociacion.direccion}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fecha de vinculación */}
                      {info.fechaVinculacion && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Calendar size={14} />
                          <span className="font-medium">
                            Vinculado el {format(info.fechaVinculacion.toDate(), 'dd/MM/yyyy', { locale: es })}
                          </span>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex gap-2">
                        {info.asociacion.sitioWeb && (
                          <a
                            href={info.asociacion.sitioWeb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-colors duration-200 group-hover:scale-105"
                          >
                            <Globe size={16} />
                            Sitio Web
                          </a>
                        )}
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200 group-hover:scale-105">
                          <Eye size={16} />
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export { AsociacionesList };