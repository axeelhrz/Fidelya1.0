'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Gift,
  QrCode,
  User,
  Settings,
  Building2,
  Filter,
  Search,
  ChevronDown,
  ExternalLink,
  Clock,
  MapPin,
  TrendingUp,
  Award,
} from 'lucide-react';
import { SocioActivity } from '@/types/socio';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityTimelineProps {
  activities: SocioActivity[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  loading = false,
  onLoadMore,
  hasMore = false,
  className = ''
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getActivityIcon = (tipo: SocioActivity['tipo']) => {
    switch (tipo) {
      case 'beneficio':
        return <Gift size={16} />;
      case 'validacion':
        return <QrCode size={16} />;
      case 'registro':
        return <User size={16} />;
      case 'actualizacion':
        return <Settings size={16} />;
      case 'configuracion':
        return <Settings size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const getActivityColor = (tipo: SocioActivity['tipo']) => {
    switch (tipo) {
      case 'beneficio':
        return '#10b981';
      case 'validacion':
        return '#6366f1';
      case 'registro':
        return '#8b5cf6';
      case 'actualizacion':
        return '#f59e0b';
      case 'configuracion':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getActivityBadge = (tipo: SocioActivity['tipo']) => {
    switch (tipo) {
      case 'beneficio':
        return { text: 'Beneficio', color: 'bg-green-100 text-green-800' };
      case 'validacion':
        return { text: 'Validación', color: 'bg-blue-100 text-blue-800' };
      case 'registro':
        return { text: 'Registro', color: 'bg-purple-100 text-purple-800' };
      case 'actualizacion':
        return { text: 'Actualización', color: 'bg-yellow-100 text-yellow-800' };
      case 'configuracion':
        return { text: 'Configuración', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: 'Actividad', color: 'bg-gray-100 text-gray-800' };
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
    <div className={`space-y-6 ${className}`}>
      {/* Header y Filtros */}
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

        {/* Filtros expandibles */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-gray-50 rounded-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Buscar actividad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={16} />}
                />
                
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
              
              {/* Filtros rápidos */}
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

      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical */}
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
                {/* Icono de actividad */}
                <div 
                  className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: getActivityColor(activity.tipo) }}
                >
                  {getActivityIcon(activity.tipo)}
                </div>

                {/* Contenido */}
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
                      
                      {/* Metadata */}
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
                          
                          {activity.metadata.categoria && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Award size={14} />
                              <span>{activity.metadata.categoria}</span>
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
                  
                  {/* Acciones */}
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

        {/* Estado vacío */}
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

        {/* Botón cargar más */}
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
