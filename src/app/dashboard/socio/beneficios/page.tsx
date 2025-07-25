'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  History, 
  RefreshCw, 
  Download, 
  Building2, 
  Users, 
  Info,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Calendar,
  Tag,
  Star,
  Clock,
  Percent,
  DollarSign,
  Package,
  Heart,
  Share2,
  Eye,
  ChevronDown,
  Sparkles,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { BeneficiosList } from '@/components/beneficios/BeneficiosList';
import { BeneficiosStats } from '@/components/beneficios/BeneficiosStats';
import { BenefitsSourceInfo } from '@/components/socio/BenefitsSourceInfo';
import { Button } from '@/components/ui/Button';
import { useBeneficiosSocio } from '@/hooks/useBeneficios';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Define the type for BeneficioUsado
type BeneficioUsado = {
  id: string;
  beneficioTitulo?: string;
  comercioNombre: string;
  montoDescuento?: number;
  montoOriginal?: number;
  montoFinal?: number;
  asociacionNombre?: string | null;
  fechaUso: { toDate: () => Date };
  notas?: string;
};

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'asociacion' | 'comercio' | 'publico';

export default function SocioBeneficiosPage() {
  const { signOut } = useAuth();
  const {
    beneficios,
    beneficiosUsados,
    stats,
    loading,
    error,
    usarBeneficio,
    refrescar,
    estadisticasRapidas
  } = useBeneficiosSocio();

  const [activeTab, setActiveTab] = useState<'disponibles' | 'usados' | 'info'>('disponibles');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(beneficios.map(b => b.categoria))).sort();
  }, [beneficios]);

  // Filter benefits based on search and filters
  const filteredBeneficios = useMemo(() => {
    return beneficios.filter(beneficio => {
      const matchesSearch = 
        beneficio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficio.comercioNombre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || beneficio.categoria === selectedCategory;
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'asociacion' && beneficio.origenBeneficio === 'asociacion') ||
        (filterType === 'comercio' && ['comercio_vinculado', 'comercio_afiliado'].includes(beneficio.origenBeneficio || '')) ||
        (filterType === 'publico' && beneficio.origenBeneficio === 'publico');
      
      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [beneficios, searchTerm, selectedCategory, filterType]);

  const handleUseBenefit = async (beneficioId: string, comercioId: string) => {
    try {
      await usarBeneficio(beneficioId, comercioId);
      toast.success('¡Beneficio usado exitosamente!');
    } catch (error) {
      console.error('Error usando beneficio:', error);
      toast.error('Error al usar el beneficio');
    }
  };

  const handleExport = () => {
    const data = activeTab === 'disponibles' ? filteredBeneficios : beneficiosUsados;
    const csvContent = [
      ['Título', 'Comercio', 'Categoría', 'Descuento', 'Estado', 'Fecha', 'Origen'],
      ...data.map(item => [
        'titulo' in item
          ? item.titulo
          : 'beneficioTitulo' in item
            ? (item as { beneficioTitulo: string }).beneficioTitulo
            : 'Beneficio Usado',
        item.comercioNombre || 'N/A',
        'categoria' in item ? item.categoria : 'N/A',
        'descuento' in item
          ? item.descuento.toString()
          : 'montoDescuento' in item
            ? (item as { montoDescuento?: number }).montoDescuento?.toString() || '0'
            : '0',
        item.estado,
        'fechaFin' in item
          ? (item as { fechaFin: { toDate: () => Date } }).fechaFin.toDate().toLocaleDateString()
          : 'fechaUso' in item
            ? (item as { fechaUso: { toDate: () => Date } }).fechaUso.toDate().toLocaleDateString()
            : '',
        'asociacionNombre' in item && item.asociacionNombre 
          ? `Asociación: ${item.asociacionNombre}`
          : 'Comercio Afiliado'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `beneficios-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Datos exportados exitosamente');
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setFilterType('all');
  };

  if (error) {
    return (
      <DashboardLayout
        activeSection="beneficios"
        sidebarComponent={(props) => (
          <SocioSidebar
            {...props}
            onLogoutClick={handleLogout}
          />
        )}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
          <motion.div 
            className="text-center max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center shadow-lg">
              <Gift size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Error al cargar beneficios
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <Button 
              onClick={refrescar} 
              leftIcon={<RefreshCw size={18} />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Reintentar
            </Button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="beneficios"
      sidebarComponent={(props) => (
        <SocioSidebar
          {...props}
          onLogoutClick={handleLogout}
        />
      )}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Modern Header */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Mis Beneficios
                    </h1>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Gift className="w-8 h-8 text-purple-500" />
                    </motion.div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 font-medium max-w-2xl">
                  Descubre y utiliza todos los descuentos y ofertas especiales disponibles para ti
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw size={16} />}
                  onClick={refrescar}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Actualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download size={16} />}
                  onClick={handleExport}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Exportar
                </Button>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
              <motion.div
                className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 lg:p-6 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Target size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl lg:text-3xl font-black text-emerald-700">
                      {estadisticasRapidas.activos}
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 truncate">Disponibles</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-4 lg:p-6 border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <History size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl lg:text-3xl font-black text-indigo-700">
                      {estadisticasRapidas.usados}
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 truncate">Usados</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-4 lg:p-6 border border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <DollarSign size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xl lg:text-2xl font-black text-yellow-700">
                      ${estadisticasRapidas.ahorroTotal.toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-yellow-600 truncate">Total Ahorrado</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-4 lg:p-6 border border-pink-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <TrendingUp size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xl lg:text-2xl font-black text-pink-700">
                      ${estadisticasRapidas.ahorroEsteMes.toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-pink-600 truncate">Este Mes</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Modern Tabs */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setActiveTab('disponibles')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'disponibles'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Gift size={20} />
                <span>Disponibles</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  activeTab === 'disponibles' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'
                }`}>
                  {estadisticasRapidas.activos}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('usados')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'usados'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <History size={20} />
                <span>Usados</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  activeTab === 'usados' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {estadisticasRapidas.usados}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'info'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Info size={20} />
                <span className="hidden sm:inline">Información</span>
                <span className="sm:hidden">Info</span>
              </button>
            </div>
          </motion.div>

          {/* Enhanced Filters for Available Benefits */}
          {activeTab === 'disponibles' && (
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Buscar beneficios..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Category Filter */}
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">Todas las categorías</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>

                      {/* Source Filter */}
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="all">Todas las fuentes</option>
                        <option value="asociacion">Mi Asociación</option>
                        <option value="comercio">Comercios Afiliados</option>
                        <option value="publico">Públicos</option>
                      </select>

                      {/* Clear Filters */}
                      <button
                        onClick={clearFilters}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                      >
                        Limpiar filtros
                      </button>
                    </div>

                    {/* Filter Summary */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>
                        Mostrando {filteredBeneficios.length} de {beneficios.length} beneficios
                      </span>
                      
                      {(searchTerm || selectedCategory || filterType !== 'all') && (
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600 font-medium">Filtros activos:</span>
                          {searchTerm && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                              "{searchTerm}"
                            </span>
                          )}
                          {selectedCategory && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                              {selectedCategory}
                            </span>
                          )}
                          {filterType !== 'all' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                              {filterType === 'asociacion' ? 'Asociación' : 
                               filterType === 'comercio' ? 'Comercios' : 'Públicos'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'disponibles' && (
              <motion.div
                key="disponibles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <BeneficiosList
                  beneficios={filteredBeneficios}
                  loading={loading}
                  userRole="socio"
                  onUse={handleUseBenefit}
                  onRefresh={refrescar}
                  showFilters={false}
                />
              </motion.div>
            )}

            {activeTab === 'usados' && (
              <motion.div
                key="usados"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {beneficiosUsados.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {beneficiosUsados.map((uso: BeneficioUsado, index) => (
                      <motion.div
                        key={uso.id}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                      >
                        <div className="flex gap-2 mb-4 flex-wrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Award className="w-3 h-3 mr-1" />
                            Usado
                          </span>
                          {uso.montoDescuento && uso.montoDescuento > 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${uso.montoDescuento} ahorrado
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            {uso.asociacionNombre ? (
                              <><Users size={12} className="mr-1" /> Asociación</>
                            ) : (
                              <><Building2 size={12} className="mr-1" /> Comercio</>
                            )}
                          </span>
                        </div>
                    
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {uso.beneficioTitulo || 'Beneficio Usado'}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Usado en {uso.comercioNombre}
                        </p>
                    
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Fecha de uso:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {format(uso.fechaUso.toDate(), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </span>
                          </div>
                          
                          {uso.montoOriginal && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Monto original:</span>
                              <span className="font-semibold text-gray-900">${uso.montoOriginal}</span>
                            </div>
                          )}
                          
                          {uso.montoFinal && (
                            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                              <span className="text-gray-600">Monto final:</span>
                              <span className="font-semibold text-emerald-600">${uso.montoFinal}</span>
                            </div>
                          )}
                    
                          {uso.asociacionNombre && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <span className="text-gray-600">Asociación:</span>
                              <span className="font-semibold text-blue-600">{uso.asociacionNombre}</span>
                            </div>
                          )}
                        </div>
                    
                        {uso.notas && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                            <p className="text-sm text-gray-700 italic">{uso.notas}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center">
                      <History size={40} className="text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No has usado beneficios aún
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Cuando uses un beneficio, aparecerá aquí con los detalles del ahorro
                    </p>
                    <Button 
                      onClick={() => setActiveTab('disponibles')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      leftIcon={<Zap size={18} />}
                    >
                      Explorar Beneficios
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <BenefitsSourceInfo />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Stats Section */}
          {stats && activeTab === 'disponibles' && (
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <BeneficiosStats
                stats={stats}
                loading={loading}
                userRole="socio"
              />
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}