'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download } from 'lucide-react';
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            Debes iniciar sesión para acceder al dashboard de asociación.
          </p>
        </div>
      </div>
    );
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Asociación
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus socios y programa de fidelidad
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={exportToCsv}
                leftIcon={<Download size={16} />}
                disabled={socios.length === 0}
              >
                Exportar CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => setCsvImportOpen(true)}
                leftIcon={<Upload size={16} />}
              >
                Importar CSV
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Summary */}
        <AsociacionDashboardSummary stats={stats} loading={loading} />

        {/* Socios Table */}
        <SociosTable
          socios={socios}
          loading={loading}
          onAdd={handleAddSocio}
          onEdit={handleEditSocio}
          onDelete={handleDeleteSocio}
        />

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