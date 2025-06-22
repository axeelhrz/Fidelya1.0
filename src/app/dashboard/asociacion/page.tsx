'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Settings,
  Bell,
  Calendar,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSocios } from '@/hooks/useSocios';
import { useAuth } from '@/hooks/useAuth';
import { Socio, SocioFormData } from '@/types/socio';
import { AsociacionDashboardSummary } from '@/components/asociacion/AsociacionDashboardSummary';
import { SociosTable } from '@/components/asociacion/SociosTable';
import { SocioDialog } from '@/components/asociacion/SocioDialog';
import { DeleteConfirmDialog } from '@/components/asociacion/DeleteConfirmDialog';
import { CsvImport } from '@/components/asociacion/CsvImport';
import { Button } from '@/components/ui/Button';

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
  delay: number;
}> = ({ title, description, icon, onClick, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className="group cursor-pointer relative overflow-hidden"
  >
    <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100/50 rounded-2xl p-6 hover:border-gray-200/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600 mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-indigo-400 mx-auto"></div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando Dashboard</h2>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  </div>
);

const AccessDeniedScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md mx-auto px-6"
    >
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Settings size={32} className="text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h1>
      <p className="text-gray-600 mb-6">
        Necesitas permisos de asociación para acceder a este dashboard. 
        Contacta al administrador del sistema.
      </p>
      <Button 
        onClick={() => window.location.href = '/auth/login'}
        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
      >
        Iniciar Sesión
      </Button>
    </motion.div>
  </div>
);

export default function AsociacionDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { 
    socios, 
    loading, 
    stats, 
    addSocio, 
    updateSocio, 
    deleteSocio, 
    addMultipleSocios 
  } = useSocios();

  const [socioDialog, setSocioDialog] = useState<{
    open: boolean;
    socio?: Socio | null;
  }>({ open: false });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    socio?: Socio | null;
  }>({ open: false });

  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  const handleAddSocio = () => {
    setSocioDialog({ open: true, socio: null });
  };

  const handleEditSocio = (socio: Socio) => {
    setSocioDialog({ open: true, socio });
  };

  const handleDeleteSocio = (socio: Socio) => {
    setDeleteDialog({ open: true, socio });
  };

  const handleSaveSocio = async (data: SocioFormData) => {
    setActionLoading(true);
    try {
      if (socioDialog.socio) {
        await updateSocio(socioDialog.socio.uid, data);
        toast.success('Socio actualizado correctamente');
      } else {
        await addSocio(data);
        toast.success('Socio agregado correctamente');
      }
      setSocioDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el socio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.socio) return;
    
    setActionLoading(true);
    try {
      await deleteSocio(deleteDialog.socio.uid);
      toast.success('Socio eliminado correctamente');
      setDeleteDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el socio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCsvImport = async (sociosData: SocioFormData[]) => {
    setActionLoading(true);
    try {
      await addMultipleSocios(sociosData);
      toast.success(`${sociosData.length} socios importados correctamente`);
      setCsvImportOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al importar los socios');
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCsv = () => {
    if (socios.length === 0) {
      toast.error('No hay socios para exportar');
      return;
    }

    const csvData = socios.map(socio => ({
      nombre: socio.nombre,
      email: socio.email,
      estado: socio.estado,
      telefono: socio.telefono || '',
      dni: socio.dni || '',
      fechaAlta: socio.creadoEn.toDate().toLocaleDateString('es-ES')
    }));

    const headers = ['nombre', 'email', 'estado', 'telefono', 'dni', 'fechaAlta'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `socios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Archivo CSV descargado correctamente');
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Preparando tu espacio de trabajo..." />;
  }

  const quickActions = [
    {
      title: 'Importar Socios',
      description: 'Carga masiva desde archivo CSV',
      icon: <Upload size={24} className="text-blue-600" />,
      onClick: () => setCsvImportOpen(true),
      gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
      delay: 0.1
    },
    {
      title: 'Exportar Datos',
      description: 'Descarga base de datos completa',
      icon: <Download size={24} className="text-emerald-600" />,
      onClick: exportToCsv,
      gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      delay: 0.2
    },
    {
      title: 'Análisis Avanzado',
      description: 'Reportes y métricas detalladas',
      icon: <BarChart3 size={24} className="text-purple-600" />,
      onClick: () => toast.info('Próximamente disponible'),
      gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
      delay: 0.3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f9" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Sparkles size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    Centro de Control
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Dashboard Ejecutivo de Asociación
                  </p>
                </div>
              </div>
              
              {/* Welcome Message */}
              <div className="bg-white/60 backdrop-blur-sm border border-indigo-100/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Bienvenido de vuelta,</span> {user?.email}
                  </p>
                  <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="outline"
                onClick={() => toast.info('Notificaciones próximamente')}
                className="relative border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
              >
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs" />
              </Button>
              <Button
                onClick={handleAddSocio}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Users size={16} className="mr-2" />
                Nuevo Socio
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Dashboard Summary */}
        <AsociacionDashboardSummary stats={stats} loading={loading} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acciones Rápidas</h2>
            <p className="text-gray-600">Herramientas esenciales para la gestión eficiente</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={action.onClick}
                gradient={action.gradient}
                delay={action.delay}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Content - Socios Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <SociosTable
            socios={socios}
            loading={loading}
            onAdd={handleAddSocio}
            onEdit={handleEditSocio}
            onDelete={handleDeleteSocio}
          />
        </motion.div>

        {/* Dialogs */}
        <SocioDialog
          open={socioDialog.open}
          onClose={() => setSocioDialog({ open: false })}
          onSave={handleSaveSocio}
          socio={socioDialog.socio}
          loading={actionLoading}
        />

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false })}
          onConfirm={handleConfirmDelete}
          socio={deleteDialog.socio}
          loading={actionLoading}
        />

        <CsvImport
          open={csvImportOpen}
          onClose={() => setCsvImportOpen(false)}
          onImport={handleCsvImport}
          loading={actionLoading}
        />
      </div>
    </div>
  );
}