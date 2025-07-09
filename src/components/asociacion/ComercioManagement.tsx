import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Unlink,
  Mail,
  Phone,
  MapPin,
  Star,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight,
  Edit,
  Trash2,
  QrCode,
  FileText,
  Power,
  PowerOff,
  Pause
} from 'lucide-react';
import { useComercios } from '@/hooks/useComercios';
import { ComercioDisponible } from '@/services/adhesion.service';
import type { Comercio } from '@/services/comercio.service';
import { VincularComercioDialog } from './VincularComercioDialog';
import { CreateComercioDialog } from './CreateComercioDialog';
import { EditComercioDialog } from './EditComercioDialog';
import { ComercioValidationsHistory } from './ComercioValidationsHistory';

interface ComercioManagementProps {
  onNavigate?: (section: string) => void;
}

export const ComercioManagement: React.FC<ComercioManagementProps> = ({ onNavigate }) => {
  const {
    comerciosVinculados,
    stats,
    loading,
    error,
    createComercio,
    updateComercio,
    deleteComercio,
    changeComercioStatus,
    buscarComercios,
    vincularComercio,
    desvincularComercio,
    generateQRCode,
    generateBatchQRCodes,
    getComercioValidations,
    clearError
  } = useComercios();

  const [vincularDialogOpen, setVincularDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [validationsDialogOpen, setValidationsDialogOpen] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [comercioToUnlink, setComercioToUnlink] = useState<ComercioDisponible | null>(null);
  const [comercioToDelete, setComercioToDelete] = useState<ComercioDisponible | null>(null);
  const [selectedComercios, setSelectedComercios] = useState<string[]>([]);

  // Filtrar comercios
  const comerciosFiltrados = comerciosVinculados.filter(comercio => {
    const matchesSearch = !searchTerm || 
      comercio.nombreComercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercio.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !selectedCategoria || comercio.categoria === selectedCategoria;
    const matchesEstado = !selectedEstado || comercio.estado === selectedEstado;
    
    return matchesSearch && matchesCategoria && matchesEstado;
  });

  // Obtener categorías únicas
  const categorias = Array.from(new Set(comerciosVinculados.map(c => c.categoria)));

  // Manejar desvinculación
  const handleDesvincular = async (comercio: ComercioDisponible) => {
    const success = await desvincularComercio(comercio.id);
    if (success) {
      setComercioToUnlink(null);
    }
  };

  // Manejar eliminación
  const handleDelete = async (comercio: ComercioDisponible) => {
    const success = await deleteComercio(comercio.id);
    if (success) {
      setComercioToDelete(null);
    }
  };

  // Manejar cambio de estado
  const handleStatusChange = async (comercio: ComercioDisponible, newStatus: 'activo' | 'inactivo' | 'suspendido') => {
    await changeComercioStatus(comercio.id, newStatus);
  };

  // Manejar edición
  const handleEdit = (comercio: ComercioDisponible) => {
    // Convert ComercioDisponible to Comercio for the edit dialog
    const comercioForEdit: Comercio = {
      id: comercio.id,
      nombreComercio: comercio.nombreComercio,
      categoria: comercio.categoria,
      descripcion: '',
      direccion: comercio.direccion || '',
      telefono: comercio.telefono || '',
      email: comercio.email,
      sitioWeb: '',
      horario: '',
      cuit: '',
      logo: comercio.logoUrl,
      banner: '',
      estado: comercio.estado,
      visible: comercio.estado === 'activo',
      asociacionesVinculadas: comercio.asociacionesVinculadas,
      qrCode: '',
      qrCodeUrl: '',
      beneficiosActivos: 0,
      validacionesRealizadas: 0,
      clientesAtendidos: 0,
      ingresosMensuales: 0,
      rating: comercio.puntuacion,
      configuracion: {
        notificacionesEmail: true,
        notificacionesWhatsApp: false,
        autoValidacion: false,
        requiereAprobacion: true,
      },
      creadoEn: comercio.creadoEn.toDate(),
      actualizadoEn: new Date(),
      metadata: {}
    };
    setSelectedComercio(comercioForEdit);
    setEditDialogOpen(true);
  };

  // Manejar ver validaciones
  const handleViewValidations = (comercio: ComercioDisponible) => {
    // Convert ComercioDisponible to Comercio for the validations dialog
    const comercioForValidations: Comercio = {
      id: comercio.id,
      nombreComercio: comercio.nombreComercio,
      categoria: comercio.categoria,
      descripcion: '',
      direccion: comercio.direccion || '',
      telefono: comercio.telefono || '',
      email: comercio.email,
      sitioWeb: '',
      horario: '',
      cuit: '',
      logo: comercio.logoUrl,
      banner: '',
      estado: comercio.estado,
      visible: comercio.estado === 'activo',
      asociacionesVinculadas: comercio.asociacionesVinculadas,
      qrCode: '',
      qrCodeUrl: '',
      beneficiosActivos: 0,
      validacionesRealizadas: 0,
      clientesAtendidos: 0,
      ingresosMensuales: 0,
      rating: comercio.puntuacion,
      configuracion: {
        notificacionesEmail: true,
        notificacionesWhatsApp: false,
        autoValidacion: false,
        requiereAprobacion: true,
      },
      creadoEn: comercio.creadoEn.toDate(),
      actualizadoEn: new Date(),
      metadata: {}
    };
    setSelectedComercio(comercioForValidations);
    setValidationsDialogOpen(true);
  };

  // Manejar generación de QR individual
  const handleGenerateQR = async (comercio: ComercioDisponible) => {
    await generateQRCode(comercio.id);
  };

  // Manejar generación de QR masiva
  const handleBatchQRGeneration = async () => {
    if (selectedComercios.length === 0) {
      alert('Selecciona al menos un comercio');
      return;
    }

    const results = await generateBatchQRCodes(selectedComercios);
    
    if (results.length > 0) {
      // Create a ZIP file with all QR codes
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      results.forEach(result => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new window.Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          canvas.toBlob(blob => {
            if (blob) {
              zip.file(`QR_${result.nombreComercio}.png`, blob);
            }
          });
        };
        
        img.src = result.qrCodeDataURL;
      });

      // Generate and download ZIP
      setTimeout(async () => {
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `QR_Codes_${new Date().toISOString().split('T')[0]}.zip`;
        link.click();
      }, 1000);
    }
  };

  // Manejar selección múltiple
  const handleSelectComercio = (comercioId: string, selected: boolean) => {
    if (selected) {
      setSelectedComercios(prev => [...prev, comercioId]);
    } else {
      setSelectedComercios(prev => prev.filter(id => id !== comercioId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedComercios(comerciosFiltrados.map(c => c.id));
    } else {
      setSelectedComercios([]);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Power className="w-4 h-4 text-green-600" />;
      case 'inactivo':
        return <PowerOff className="w-4 h-4 text-red-600" />;
      case 'suspendido':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Power className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con navegación rápida */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Comercios</h1>
          <p className="text-gray-600 mt-2">
            Administra los comercios vinculados a tu asociación
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Botón de navegación rápida a socios */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('socios')}
              className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Ir a Socios
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
          
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Comercio
          </button>

          <button
            onClick={() => setVincularDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            <Store className="w-4 h-4 mr-2" />
            Vincular Existente
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comercios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComercios}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Comercios Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.comerciosActivos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos Este Mes</p>
              <p className="text-2xl font-bold text-blue-600">{stats.adhesionesEsteMes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(stats.categorias).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
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
              placeholder="Buscar comercios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions and View Mode */}
          <div className="flex items-center space-x-3">
            {selectedComercios.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedComercios.length} seleccionados
                </span>
                <button
                  onClick={handleBatchQRGeneration}
                  className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generar QRs
                </button>
              </div>
            )}

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

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Store size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
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
                    Categoría
                  </label>
                  <select
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

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
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategoria('');
                      setSelectedEstado('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Limpiar filtros
                  </button>
                </div>
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

      {/* Comercios List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando comercios...</span>
          </div>
        ) : comerciosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {comerciosVinculados.length === 0 ? 'No hay comercios vinculados' : 'No se encontraron comercios'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {comerciosVinculados.length === 0 
                ? 'Comienza agregando tu primer comercio.'
                : 'Intenta ajustar los filtros de búsqueda.'
              }
            </p>
            {comerciosVinculados.length === 0 && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setCreateDialogOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Comercio
                </button>
                <div>
                  <button
                    onClick={() => setVincularDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Vincular Comercio Existente
                  </button>
                </div>
                {onNavigate && (
                  <div>
                    <button
                      onClick={() => onNavigate('socios')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Ver Gestión de Socios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            {/* Select All Checkbox */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={selectedComercios.length === comerciosFiltrados.length && comerciosFiltrados.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Seleccionar todos ({comerciosFiltrados.length})
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comerciosFiltrados.map((comercio) => (
                <motion.div
                  key={comercio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedComercios.includes(comercio.id)}
                        onChange={(e) => handleSelectComercio(comercio.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {comercio.logoUrl ? (
                          <Image
                            src={comercio.logoUrl}
                            alt={comercio.nombreComercio}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <Store className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {comercio.nombreComercio}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{comercio.nombre}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(comercio.estado)}
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comercio.estado)}`}>
                        {comercio.estado}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {comercio.categoria}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{comercio.email}</span>
                    </div>
                    
                    {comercio.telefono && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {comercio.telefono}
                      </div>
                    )}
                    
                    {comercio.direccion && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{comercio.direccion}</span>
                      </div>
                    )}
                    
                    {comercio.puntuacion > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                        {comercio.puntuacion.toFixed(1)} ({comercio.totalReviews} reseñas)
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center">
                        {comercio.verificado && (
                          <div className="flex items-center text-green-600">
                            <Check className="w-4 h-4 mr-1" />
                            <span className="text-xs">Verificado</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewValidations(comercio)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Ver validaciones"
                        >
                          <FileText size={16} />
                        </button>

                        <button
                          onClick={() => handleGenerateQR(comercio)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Generar QR"
                        >
                          <QrCode size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(comercio)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>

                        {comercio.estado === 'activo' ? (
                          <button
                            onClick={() => handleStatusChange(comercio, 'inactivo')}
                            className="text-red-600 hover:text-red-900"
                            title="Desactivar"
                          >
                            <PowerOff size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(comercio, 'activo')}
                            className="text-green-600 hover:text-green-900"
                            title="Activar"
                          >
                            <Power size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => setComercioToUnlink(comercio)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Desvincular"
                        >
                          <Unlink size={16} />
                        </button>

                        <button
                          onClick={() => setComercioToDelete(comercio)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedComercios.length === comerciosFiltrados.length && comerciosFiltrados.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comercio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntuación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comerciosFiltrados.map((comercio) => (
                  <motion.tr
                    key={comercio.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedComercios.includes(comercio.id)}
                        onChange={(e) => handleSelectComercio(comercio.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {comercio.logoUrl ? (
                          <Image
                            src={comercio.logoUrl}
                            alt={comercio.nombreComercio}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded object-cover"
                          />
                        ) : (
                          <Store className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {comercio.nombreComercio}
                          </div>
                          <div className="text-sm text-gray-500">{comercio.nombre}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {comercio.categoria}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{comercio.email}</div>
                      <div className="text-sm text-gray-500">{comercio.telefono || 'Sin teléfono'}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comercio.estado)}`}>
                          {comercio.estado}
                        </span>
                        {comercio.verificado && (
                          <Check className="w-4 h-4 text-green-600 ml-2" />
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {comercio.puntuacion > 0 ? (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-900">
                            {comercio.puntuacion.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({comercio.totalReviews})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Sin calificar</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewValidations(comercio)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Ver validaciones"
                        >
                          <FileText size={16} />
                        </button>

                        <button
                          onClick={() => handleGenerateQR(comercio)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Generar QR"
                        >
                          <QrCode size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(comercio)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>

                        {comercio.estado === 'activo' ? (
                          <button
                            onClick={() => handleStatusChange(comercio, 'inactivo')}
                            className="text-red-600 hover:text-red-900"
                            title="Desactivar"
                          >
                            <PowerOff size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(comercio, 'activo')}
                            className="text-green-600 hover:text-green-900"
                            title="Activar"
                          >
                            <Power size={16} />
                          </button>
                        )}
                        
                        <button
                                          onClick={() => setComercioToUnlink(comercio)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Desvincular"
                        >
                          <Unlink size={16} />
                        </button>

                        <button
                          onClick={() => setComercioToDelete(comercio)}
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

      {/* Dialogs */}
      <CreateComercioDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={createComercio}
        loading={loading}
      />

      <VincularComercioDialog
        open={vincularDialogOpen}
        onClose={() => setVincularDialogOpen(false)}
        onVincular={vincularComercio}
        onBuscar={buscarComercios}
        loading={loading}
      />

      <EditComercioDialog
        open={editDialogOpen}
        comercio={selectedComercio}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedComercio(null);
        }}
        onSubmit={updateComercio}
        loading={loading}
      />

      <ComercioValidationsHistory
        open={validationsDialogOpen}
        comercioId={selectedComercio?.id || ''}
        comercioNombre={selectedComercio?.nombreComercio || ''}
        onClose={() => {
          setValidationsDialogOpen(false);
          setSelectedComercio(null);
        }}
        onLoadValidations={(
          comercioId,
          filters,
          pageSize,
          lastDoc
        ) => getComercioValidations(
          comercioId,
          filters,
          pageSize,
          lastDoc as import('firebase/firestore').QueryDocumentSnapshot // Cast to the expected Firestore type
        )}
      />

      {/* Unlink Confirmation Dialog */}
      {comercioToUnlink && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Unlink className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Desvincular Comercio
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas desvincular a{' '}
                        <strong>{comercioToUnlink.nombreComercio}</strong> de tu asociación?
                        El comercio seguirá existiendo pero ya no estará vinculado a tu asociación.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDesvincular(comercioToUnlink)}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Desvinculando...' : 'Desvincular'}
                </button>
                <button
                  onClick={() => setComercioToUnlink(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {comercioToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminar Comercio
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar a{' '}
                        <strong>{comercioToDelete.nombreComercio}</strong>?
                        Esta acción desactivará el comercio permanentemente. Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(comercioToDelete)}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
                <button
                  onClick={() => setComercioToDelete(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
          
