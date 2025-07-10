'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, History, RefreshCw, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { BeneficiosList } from '@/components/beneficios/BeneficiosList';
import { BeneficiosStats } from '@/components/beneficios/BeneficiosStats';
import { Button } from '@/components/ui/Button';
import { useBeneficiosSocio } from '@/hooks/useBeneficios';
import toast from 'react-hot-toast';

export default function SocioBeneficiosPage() {
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

  const [activeTab, setActiveTab] = useState<'disponibles' | 'usados'>('disponibles');

  const handleUseBenefit = async (beneficioId: string, comercioId: string) => {
    try {
      await usarBeneficio(beneficioId, comercioId);
      toast.success('¡Beneficio usado exitosamente!');
    } catch (error) {
      console.error('Error usando beneficio:', error);
      toast.error('Error al usar el beneficio');
    }
  };

  // Define types for export
  type Beneficio = {
    titulo: string;
    comercioNombre: string;
    categoria: string;
    descuento: number;
    estado: string;
    fechaFin: { toDate: () => Date };
  };

  type BeneficioUsado = {
    beneficioTitulo?: string;
    comercioNombre: string;
    categoria?: string;
    montoDescuento?: number;
    estado: string;
    fechaUso: { toDate: () => Date };
  };

  const handleExport = () => {
    const data = activeTab === 'disponibles'
      ? (beneficios as Beneficio[])
      : (beneficiosUsados as BeneficioUsado[]);
    const csvContent = [
      ['Título', 'Comercio', 'Categoría', 'Descuento', 'Estado', 'Fecha'],
      ...data.map(item => [
        'titulo' in item ? item.titulo : (item as BeneficioUsado).beneficioTitulo || 'Beneficio Usado',
        item.comercioNombre,
        'categoria' in item ? item.categoria : 'N/A',
        'descuento' in item
          ? (item as Beneficio).descuento.toString()
          : (item as BeneficioUsado).montoDescuento?.toString() || '0',
        item.estado,
        'fechaFin' in item
          ? (item as Beneficio).fechaFin.toDate().toLocaleDateString()
          : (item as BeneficioUsado).fechaUso.toDate().toLocaleDateString()
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

  if (error) {
    return (
      <DashboardLayout
        activeSection="beneficios"
        sidebarComponent={(props) => (
          <SocioSidebar
            {...props}
            onLogoutClick={() => {
              window.location.href = '/logout';
            }}
          />
        )}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <Gift size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar beneficios
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={refrescar} leftIcon={<RefreshCw size={16} />}>
              Reintentar
            </Button>
          </div>
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
          onLogoutClick={() => {
            window.location.href = '/logout';
          }}
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
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Mis Beneficios
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Descubre y utiliza todos los descuentos y ofertas especiales
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={refrescar}
              >
                Actualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
                onClick={handleExport}
              >
                Exportar
              </Button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white
                  shadow-lg shadow-green-500/30">
                  <Gift size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {estadisticasRapidas.activos}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Disponibles</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <History size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {estadisticasRapidas.usados}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Usados</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
                  <Gift size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    ${estadisticasRapidas.ahorroTotal.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Total Ahorrado</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                  <Gift size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    ${estadisticasRapidas.ahorroEsteMes.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Este Mes</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('disponibles')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'disponibles'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gift size={18} />
            Disponibles
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
              activeTab === 'disponibles' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {estadisticasRapidas.activos}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('usados')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'usados'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History size={18} />
            Usados
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
              activeTab === 'usados' ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {estadisticasRapidas.usados}
            </span>
          </button>
        </div>

        {/* Contenido principal */}
        {activeTab === 'disponibles' ? (
          <BeneficiosList
            beneficios={beneficios}
            loading={loading}
            userRole="socio"
            onUse={handleUseBenefit}
            onRefresh={refrescar}
            onExport={handleExport}
            showFilters={true}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Historial de Beneficios Usados ({beneficiosUsados.length})
              </h2>
            </div>

            {beneficiosUsados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {beneficiosUsados.map((uso, index) => (
                  <motion.div
                    key={uso.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex gap-2 mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800">
                        ✓ Usado
                      </span>
                      {uso.montoDescuento && uso.montoDescuento > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-blue-500 text-white">
                          ${uso.montoDescuento} ahorrado
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {uso.beneficioTitulo || 'Beneficio Usado'}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      Usado en {uso.comercioNombre}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Fecha de uso:</span>
                        <span className="font-medium">
                          {uso.fechaUso.toDate().toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {uso.montoOriginal && (
                        <div className="flex items-center justify-between">
                          <span>Monto original:</span>
                          <span className="font-medium">${uso.montoOriginal}</span>
                        </div>
                      )}
                      
                      {uso.montoFinal && (
                        <div className="flex items-center justify-between">
                          <span>Monto final:</span>
                          <span className="font-medium text-green-600">${uso.montoFinal}</span>
                        </div>
                      )}
                    </div>

                    {uso.notas && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{uso.notas}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <History size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No has usado beneficios aún
                </h3>
                <p className="text-gray-500 mb-4">
                  Cuando uses un beneficio, aparecerá aquí con los detalles del ahorro
                </p>
                <Button onClick={() => setActiveTab('disponibles')}>
                  Explorar Beneficios
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Estadísticas detalladas */}
        {stats && (
          <div className="mt-12">
            <BeneficiosStats
              stats={stats}
              loading={loading}
              userRole="socio"
            />
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
