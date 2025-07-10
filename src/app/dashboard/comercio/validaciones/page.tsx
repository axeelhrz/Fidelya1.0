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
  CheckCircle,
  Users,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComercioValidacionesPage() {
  const { user, signOut } = useAuth();
  const { loading, refresh, getStats } = useValidaciones();
  interface Stats {
    totalValidaciones: number;
    validacionesExitosas: number;
    validacionesFallidas: number;
    porAsociacion: Record<string, number>;
    porBeneficio: Record<string, number>;
    porDia: Record<string, number>;
    promedioValidacionesDiarias: number;
    clientesUnicos?: number;
    montoTotalDescuentos?: number;
  }
  const [stats, setStats] = useState<Stats | null>(null);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'recientes';

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
      // Aquí deberías implementar la lógica de exportación o eliminar este handler si no es necesario
      toast.success('Funcionalidad de exportación no implementada');
    } catch (error) {
      console.error('Error exporting validaciones:', error);
      toast.error('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
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

  // Load validaciones on component mount
  useEffect(() => {
    async function fetchStats() {
      if (user) {
        try {
          const statsResult = await getStats();
          setStats({
            ...statsResult,
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    }
    fetchStats();
  }, [user, refresh, getStats]);

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
                onClick={() => refresh()}
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

        {/* Validaciones List - Fixed: No props needed */}
        <ValidacionesHistory />
      </motion.div>
    </DashboardLayout>
  );
}