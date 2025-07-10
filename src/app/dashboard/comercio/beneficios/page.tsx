'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Download, Edit, ToggleRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { BeneficiosList } from '@/components/beneficios/BeneficiosList';
import { BeneficioForm } from '@/components/beneficios/BeneficioForm';
import { BeneficiosStats } from '@/components/beneficios/BeneficiosStats';
import { Button } from '@/components/ui/Button';
import { useBeneficiosComercios } from '@/hooks/useBeneficios';
import { Beneficio, BeneficioFormData } from '@/types/beneficio';
import toast from 'react-hot-toast';

export default function ComercioBeneficiosPage() {
  const {
    beneficios,
    stats,
    loading,
    error,
    crearBeneficio,
    actualizarBeneficio,
    eliminarBeneficio,
    cambiarEstadoBeneficio,
    refrescar,
    estadisticasRapidas
  } = useBeneficiosComercios();

  const [formOpen, setFormOpen] = useState(false);
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(null);

  const handleCreateNew = () => {
    setEditingBeneficio(null);
    setFormOpen(true);
  };

  const handleEdit = (beneficio: Beneficio) => {
    setEditingBeneficio(beneficio);
    setFormOpen(true);
  };

  const handleDelete = async (beneficioId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este beneficio?')) {
      try {
        await eliminarBeneficio(beneficioId);
        toast.success('Beneficio eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando beneficio:', error);
        toast.error('Error al eliminar el beneficio');
      }
    }
  };

  const handleToggleStatus = async (beneficioId: string, estado: 'activo' | 'inactivo') => {
    try {
      await cambiarEstadoBeneficio(beneficioId, estado);
      toast.success(`Beneficio ${estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast.error('Error al cambiar el estado del beneficio');
    }
  };

  const handleFormSubmit = async (data: BeneficioFormData) => {
    try {
      if (editingBeneficio) {
        // Crear un objeto con los tipos correctos para la actualización
        const updateData: Partial<BeneficioFormData> = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          tipo: data.tipo,
          descuento: data.descuento,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          limitePorSocio: data.limitePorSocio,
          limiteTotal: data.limiteTotal,
          condiciones: data.condiciones,
          categoria: data.categoria,
          tags: data.tags,
          destacado: data.destacado,
          asociacionesDisponibles: data.asociacionesDisponibles
        };

        await actualizarBeneficio(editingBeneficio.id, updateData);
        toast.success('Beneficio actualizado exitosamente');
      } else {
        await crearBeneficio();
        toast.success('Beneficio creado exitosamente');
      }
      return true;
    } catch (error) {
      console.error('Error en formulario:', error);
      toast.error('Error al guardar el beneficio');
      return false;
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Título', 'Categoría', 'Tipo', 'Descuento', 'Estado', 'Usos', 'Fecha Creación', 'Fecha Vencimiento'],
      ...beneficios.map(beneficio => [
        beneficio.titulo,
        beneficio.categoria,
        beneficio.tipo,
        beneficio.descuento.toString(),
        beneficio.estado,
        beneficio.usosActuales.toString(),
        beneficio.creadoEn.toDate().toLocaleDateString(),
        beneficio.fechaFin.toDate().toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `beneficios-comercio-${new Date().toISOString().split('T')[0]}.csv`);
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
          <ComercioSidebar
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
              <Plus size={32} className="text-red-500" />
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
        <ComercioSidebar
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
                Gestión de Beneficios
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Crea y administra los beneficios que ofreces a los socios
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
              <Button
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={handleCreateNew}
              >
                Nuevo Beneficio
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Plus size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {estadisticasRapidas.total}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Total Beneficios</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <ToggleRight size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {estadisticasRapidas.activos}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Activos</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                  <Edit size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {estadisticasRapidas.usados}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Total Usos</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
                  <Plus size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {beneficios.filter(b => {
                      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return b.creadoEn.toDate() > sevenDaysAgo;
                    }).length}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">Nuevos (7 días)</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lista de beneficios */}
        <BeneficiosList
          beneficios={beneficios}
          loading={loading}
          userRole="comercio"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onRefresh={refrescar}
          onExport={handleExport}
          onCreateNew={handleCreateNew}
          showCreateButton={true}
          showFilters={true}
        />

        {/* Estadísticas detalladas */}
        {stats && (
          <div className="mt-12">
            <BeneficiosStats
              stats={stats}
              loading={loading}
              userRole="comercio"
            />
          </div>
        )}

        {/* Formulario de beneficio */}
        <BeneficioForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingBeneficio(null);
          }}
          onSubmit={handleFormSubmit}
          beneficio={editingBeneficio}
          loading={loading}
        />
      </motion.div>
    </DashboardLayout>
  );
}