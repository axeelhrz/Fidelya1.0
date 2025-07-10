'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ValidacionesHistory } from '@/components/comercio/ValidacionesHistory';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useValidaciones } from '@/hooks/useValidaciones';
import { 
  UserCheck, 
  Calendar, 
  FileText, 
  Download, 
  RefreshCw,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComercioValidacionesPage() {
  const { user, signOut } = useAuth();
  const { validaciones, stats, loading, getValidaciones, exportValidaciones } = useValidaciones();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'recientes';
  const filterParam = searchParams.get('filter') || 'todas';

  const [filters, setFilters] = useState({
    fechaDesde: '',
    fechaHasta: '',
    estado: filterParam,
    beneficioId: '',
    busqueda: ''
  });

  const [exporting, setExporting] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportValidaciones(filters);
      toast.success('Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error exporting validaciones:', error);
      toast.error('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    {
      id: 'recientes',
      label: 'Recientes',
      icon: Calendar,
      description: 'Validaciones de hoy y ayer'
    },
    {
      id: 'historial',
      label: 'Historial Completo',
      icon: FileText,
      description: 'Todas las validaciones'
    }
  ];

  const filterOptions = [
    { value: 'todas', label: 'Todas', icon: FileText, color: 'gray' },
    { value: 'exitosas', label: 'Exitosas', icon: CheckCircle, color: 'green' },
    { value: 'fallidas', label: 'Fallidas', icon: AlertCircle, color: 'red' },
    { value: 'pendientes', label: 'Pendientes', icon: Clock, color: 'yellow' }
  ];

  // Load validaciones on component mount and filter changes
  useEffect(() => {
    if (user) {
      getValidaciones(user.uid, filters);
    }
  }, [user, filters, getValidaciones]);

  if (loading) {
    return (
      <DashboardLayout
        activeSection="validaciones"
        sidebarComponent={(props) => (
          <ComercioSidebar
            {...props}
            onLogoutClick={handleLogout}
          />
        )}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
              <RefreshCw size={32} className="text-purple-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cargando validaciones...
            </h3>
            <p className="text-gray-500">Obteniendo historial de validaciones</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="validaciones"
      sidebarComponent={(props) => (
        <ComercioSidebar
          {...props}
          onLogoutClick={handleLogout}
        />
      )}
    >
      <motion.div
        className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                Historial de Validaciones
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Seguimiento completo de todas las validaciones de beneficios
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={() => getValidaciones(user?.uid || '', filters)}
              >
                Actualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
                onClick={handleExport}
                loading={exporting}
              >
                Exportar
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <UserCheck size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.totalValidaciones || 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Total Validaciones</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.validacionesExitosas || 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Exitosas</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.clientesUnicos || 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Clientes Únicos</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    ${stats?.montoTotalDescuentos || 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Descuentos Aplicados</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', tab.id);
                  window.history.pushState({}, '', url.toString());
                  window.location.reload();
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha desde
              </label>
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha hasta
              </label>
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por socio, beneficio..."
                  value={filters.busqueda}
                  onChange={(e) => handleFilterChange('busqueda', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('estado', option.value)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.estado === option.value
                    ? `bg-${option.color}-100 text-${option.color}-700 border border-${option.color}-200`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <option.icon className="w-3 h-3" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Validaciones List */}
        <ValidacionesHistory
          validaciones={validaciones}
          loading={loading}
          onRefresh={() => getValidaciones(user?.uid || '', filters)}
          onExport={handleExport}
          filters={filters}
          activeTab={activeTab}
        />
      </motion.div>
    </DashboardLayout>
  );
}
