import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ChevronDown,
  X
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useSocios } from '@/hooks/useSocios';
import { Socio } from '@/types/socio';
import { SocioFormData } from '@/services/socio.service';
import { EnhancedSocioDialog } from './EnhancedSocioDialog';
import { CsvImport } from './CsvImport';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { toast } from 'react-hot-toast';

interface MemberManagementProps {
  onNavigate?: (section: string) => void;
}

export const EnhancedMemberManagement: React.FC<MemberManagementProps> = () => {
  const {
    socios,
    stats,
    loading,
    error,
    hasMore,
    filters,
    setFilters,
    loadMoreSocios,
    createSocio,
    updateSocio,
    deleteSocio,
    importSocios,
    registerPayment,
    updateMembershipStatus,
    clearError
  } = useSocios();

  // State management
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
  const [socioDialogOpen, setSocioDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [socioToDelete, setSocioToDelete] = useState<Socio | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSocios, setSelectedSocios] = useState<Set<string>>(new Set());
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [socioForPayment, setSocioForPayment] = useState<Socio | null>(null);

  // Helper function to prepare socio data for editing
  const prepareSocioForEdit = (socio: Socio): Socio => {
    // Helper function to ensure we have a proper Timestamp
    const ensureTimestamp = (
      value: Timestamp | Date | string | { seconds: number; nanoseconds?: number } | undefined | null
    ): Timestamp => {
      if (value && typeof (value as Timestamp).toDate === 'function') {
        // Already a Timestamp
        return value as Timestamp;
      } else if (value instanceof Date) {
        // Convert Date to Timestamp
        return Timestamp.fromDate(value);
      } else if (typeof value === 'string') {
        // Convert string to Timestamp
        return Timestamp.fromDate(new Date(value));
      } else if (value && typeof value === 'object' && 'seconds' in value && value.seconds) {
        // Handle Firestore timestamp-like objects
        return new Timestamp(value.seconds, value.nanoseconds || 0);
      } else {
        // Default to current timestamp
        return Timestamp.now();
      }
    };

    return {
      ...socio,
      uid: socio.uid || socio.id,
      asociacion: socio.asociacion || socio.asociacionId || '',
      estado: socio.estado === 'suspendido' ? 'inactivo' : socio.estado,
      creadoEn: ensureTimestamp(socio.creadoEn),
      actualizadoEn: socio.actualizadoEn ? ensureTimestamp(socio.actualizadoEn) : undefined,
      fechaNacimiento: socio.fechaNacimiento
        ? ensureTimestamp(socio.fechaNacimiento)
        : undefined
    };
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ ...filters, search: term });
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  // Handle socio creation
  const handleCreateSocio = () => {
    setSelectedSocio(null);
    setSocioDialogOpen(true);
  };

  // Handle socio editing
  const handleEditSocio = (socio: Socio) => {
    const preparedSocio = prepareSocioForEdit(socio);
    setSelectedSocio(preparedSocio);
    setSocioDialogOpen(true);
  };

  // Handle socio deletion
  const handleDeleteSocio = (socio: Socio) => {
    setSocioToDelete(socio);
    setDeleteDialogOpen(true);
  };

  // Handle payment registration
  const handleRegisterPayment = (socio: Socio) => {
    setSocioForPayment(socio);
    setPaymentDialogOpen(true);
  };

  // Handle socio save
  const handleSocioSave = async (data: SocioFormData) => {
    try {
      let success = false;
      
      if (selectedSocio) {
        success = await updateSocio(selectedSocio.id, data);
      } else {
        success = await createSocio(data);
      }

      if (success) {
        setSocioDialogOpen(false);
        setSelectedSocio(null);
      }
    } catch (error) {
      console.error('Error saving socio:', error);
    }
  };

  // Handle socio deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!socioToDelete) return;

    const success = await deleteSocio(socioToDelete.id);
    if (success) {
      setDeleteDialogOpen(false);
      setSocioToDelete(null);
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    const csvData = socios.map(socio => ({
      'Número': socio.numeroSocio,
      'Nombre': socio.nombre,
      'Email': socio.email,
      'DNI': socio.dni,
      'Teléfono': socio.telefono || '',
      'Estado': socio.estado,
      'Membresía': socio.estadoMembresia,
      'Fecha Ingreso': socio.fechaIngreso.toLocaleDateString(),
      'Fecha Vencimiento': socio.fechaVencimiento?.toLocaleDateString() || '',
      'Cuota': socio.montoCuota,
      'Beneficios Usados': socio.beneficiosUsados,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Archivo CSV descargado');
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedSocios.size === 0) {
      toast.error('Selecciona al menos un socio');
      return;
    }

    switch (action) {
      case 'delete':
        // Implement bulk delete
        break;
      case 'activate':
        // Implement bulk activate
        break;
      case 'deactivate':
        // Implement bulk deactivate
        break;
    }
  };

  // Get status display
  const getStatusDisplay = (estado: string) => {
    const statusMap = {
      activo: { label: 'Activo', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
      inactivo: { label: 'Inactivo', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: XCircle },
      pendiente: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
      suspendido: { label: 'Suspendido', color: 'text-red-700', bgColor: 'bg-red-100', icon: AlertTriangle },
    };
    return statusMap[estado as keyof typeof statusMap] || statusMap.inactivo;
  };

  // Get membership status display
  const getMembershipStatusDisplay = (estadoMembresia: string) => {
    const statusMap = {
      al_dia: { label: 'Al día', color: 'text-green-700', bgColor: 'bg-green-100' },
      vencido: { label: 'Vencido', color: 'text-red-700', bgColor: 'bg-red-100' },
      pendiente: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    };
    return statusMap[estadoMembresia as keyof typeof statusMap] || statusMap.pendiente;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Socios</h1>
          <p className="text-gray-600 mt-2">
            Administra los socios de tu asociación
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => updateMembershipStatus()}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Estados
          </button>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          
          <button
            onClick={() => setImportDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </button>
          
          <button
            onClick={handleCreateSocio}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
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
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Al Día</p>
              <p className="text-2xl font-bold text-blue-600">{stats.alDia}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-emerald-600">${stats.ingresosMensuales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
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
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
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
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={16} />
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
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filters.estado || ''}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado Membresía
                  </label>
                  <select
                    value={filters.estadoMembresia || ''}
                    onChange={(e) => handleFilterChange('estadoMembresia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="al_dia">Al día</option>
                    <option value="vencido">Vencido</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={filters.fechaDesde?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleFilterChange('fechaDesde', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={filters.fechaHasta?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleFilterChange('fechaHasta', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* Bulk Actions */}
      {selectedSocios.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
        >
          <span className="text-blue-800 font-medium">
            {selectedSocios.size} socio(s) seleccionado(s)
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Activar
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Desactivar
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => setSelectedSocios(new Set())}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* Socios List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedSocios.size === socios.length && socios.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSocios(new Set(socios.map(s => s.id)));
                        } else {
                          setSelectedSocios(new Set());
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
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
                    Membresía
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {socios.map((socio) => {
                  const statusDisplay = getStatusDisplay(socio.estado);
                  const membershipDisplay = getMembershipStatusDisplay(socio.estadoMembresia);
                  const StatusIcon = statusDisplay.icon;

                  return (
                    <motion.tr
                      key={socio.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSocios.has(socio.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedSocios);
                            if (e.target.checked) {
                              newSelected.add(socio.id);
                            } else {
                              newSelected.delete(socio.id);
                            }
                            setSelectedSocios(newSelected);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {socio.nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{socio.nombre}</div>
                            <div className="text-sm text-gray-500">#{socio.numeroSocio}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{socio.email}</div>
                        <div className="text-sm text-gray-500">{socio.telefono || 'Sin teléfono'}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusDisplay.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${membershipDisplay.bgColor} ${membershipDisplay.color}`}>
                          {membershipDisplay.label}
                        </span>
                        {socio.fechaVencimiento && (
                          <div className="text-xs text-gray-500 mt-1">
                            Vence: {socio.fechaVencimiento.toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${socio.montoCuota.toLocaleString()}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditSocio(socio)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleRegisterPayment(socio)}
                            className="text-green-600 hover:text-green-900"
                            title="Registrar Pago"
                          >
                            <DollarSign size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSocio(socio)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socios.map((socio) => {
                const statusDisplay = getStatusDisplay(socio.estado);
                const membershipDisplay = getMembershipStatusDisplay(socio.estadoMembresia);
                const StatusIcon = statusDisplay.icon;

                return (
                  <motion.div
                    key={socio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-700">
                            {socio.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{socio.nombre}</h3>
                          <p className="text-sm text-gray-500">#{socio.numeroSocio}</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {socio.email}
                      </div>
                      
                      {socio.telefono && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {socio.telefono}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusDisplay.label}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${membershipDisplay.bgColor} ${membershipDisplay.color}`}>
                          {membershipDisplay.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-900">
                          ${socio.montoCuota.toLocaleString()}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditSocio(socio)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleRegisterPayment(socio)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <DollarSign size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSocio(socio)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={loadMoreSocios}
              disabled={loading}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Cargar más socios'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {socios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay socios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando tu primer socio.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateSocio}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Socio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EnhancedSocioDialog
        open={socioDialogOpen}
        onClose={() => {
          setSocioDialogOpen(false);
          setSelectedSocio(null);
        }}
        onSave={handleSocioSave}
        socio={selectedSocio}
        loading={loading}
      />

      <CsvImport
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={importSocios}
        loading={loading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSocioToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        socio={socioToDelete}
        loading={loading}
      />

      {/* Payment Dialog */}
      {paymentDialogOpen && socioForPayment && (
        <PaymentDialog
          open={paymentDialogOpen}
          onClose={() => {
            setPaymentDialogOpen(false);
            setSocioForPayment(null);
          }}
          socio={socioForPayment}
          onRegisterPayment={registerPayment}
          loading={loading}
        />
      )}
    </div>
  );
};

// Payment Dialog Component
interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  socio: Socio;
  onRegisterPayment: (socioId: string, amount: number, months: number) => Promise<boolean>;
  loading: boolean;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  socio,
  onRegisterPayment,
  loading
}) => {
  const [amount, setAmount] = useState(socio.montoCuota);
  const [months, setMonths] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await onRegisterPayment(socio.id, amount, months);
    if (success) {
      onClose();
    }

    setIsSubmitting(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Registrar Pago
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Registrar pago para {socio.nombre}
                    </p>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Monto
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Meses
                      </label>
                      <select
                        value={months}
                        onChange={(e) => setMonths(parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 6, 12].map(month => (
                          <option key={month} value={month}>
                            {month} {month === 1 ? 'mes' : 'meses'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};