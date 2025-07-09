'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Store,
  BarChart3,
  ArrowRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useSocios } from '@/hooks/useSocios';
import { SocioDialog } from './SocioDialog';
import { SocioFormData } from '@/types/socio';

interface EnhancedMemberManagementProps {
  onNavigate?: (section: string) => void;
}

export const EnhancedMemberManagement: React.FC<EnhancedMemberManagementProps> = ({ onNavigate }) => {
  const { socios, stats, loading, createSocio } = useSocios();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [socioDialogOpen, setSocioDialogOpen] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState(null);

  // Filtrar socios
  const sociosFiltrados = socios.filter(socio => {
    const matchesSearch = !searchTerm || 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.dni?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = !selectedEstado || socio.estado === selectedEstado;
    
    return matchesSearch && matchesEstado;
  });

  const handleCreateSocio = async (data: SocioFormData) => {
    try {
      const success = await createSocio({
        ...data,
        fechaNacimiento: new Date(), // Default date
        montoCuota: 0, // Default amount
      });
      
      if (success) {
        setSocioDialogOpen(false);
        setSelectedSocio(null);
      }
    } catch (error) {
      console.error('Error creating socio:', error);
    }
  };

  const handleOpenDialog = () => {
    setSelectedSocio(null);
    setSocioDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con navegación rápida */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Socios</h1>
          <p className="text-gray-600 mt-2">
            Administra los miembros de tu asociación
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Botón de navegación rápida a comercios */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('comercios')}
              className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
            >
              <Store className="w-4 h-4 mr-2" />
              Ir a Comercios
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
          
          <button
            onClick={handleOpenDialog}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Socio
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Socios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Socios Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Socios Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-purple-600">
                ${(stats.activos * 50).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar socios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                showFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>

            <button
              onClick={() => onNavigate?.('socios-importar')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </button>

            <button
              onClick={() => onNavigate?.('socios-exportar')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={selectedEstado}
                    onChange={(e) => setSelectedEstado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="vencido">Vencido</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedEstado('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Socios List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando socios...</span>
          </div>
        ) : sociosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {socios.length === 0 ? 'No hay socios registrados' : 'No se encontraron socios'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {socios.length === 0 
                ? 'Comienza agregando tu primer socio.'
                : 'Intenta ajustar los filtros de búsqueda.'
              }
            </p>
            {socios.length === 0 && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleOpenDialog}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Socio
                </button>
                {onNavigate && (
                  <div>
                    <button
                      onClick={() => onNavigate('comercios')}
                      className="inline-flex items-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Ver Gestión de Comercios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sociosFiltrados.map((socio) => (
                  <motion.tr
                    key={socio.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {socio.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {socio.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {socio.dni || 'No especificado'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{socio.email}</div>
                      <div className="text-sm text-gray-500">
                        {socio.telefono || 'Sin teléfono'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        socio.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : socio.estado === 'vencido'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {socio.estado === 'activo' ? 'Activo' : 
                         socio.estado === 'vencido' ? 'Vencido' : 'Inactivo'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {socio.creadoEn.toDate().toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* Ver detalles */}}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => {/* Editar */}}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => {/* Eliminar */}}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleOpenDialog}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Nuevo Socio</div>
              <div className="text-xs text-gray-500">Agregar miembro</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('socios-importar')}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Importar CSV</div>
              <div className="text-xs text-gray-500">Carga masiva</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('comercios')}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Ver Comercios</div>
              <div className="text-xs text-gray-500">Gestionar afiliados</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('analytics')}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Ver Analytics</div>
              <div className="text-xs text-gray-500">Métricas detalladas</div>
            </div>
          </button>
        </div>
      </div>

      {/* Socio Dialog */}
      <SocioDialog
        open={socioDialogOpen}
        onClose={() => setSocioDialogOpen(false)}
        onSave={handleCreateSocio}
        socio={selectedSocio}
        loading={loading}
      />
    </div>
  );
};