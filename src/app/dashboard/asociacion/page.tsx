'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  alpha,
} from '@mui/material';
import {
  PersonAdd,
  Security,
  Analytics,
  Group,
  Upload,
  CloudDownload,
  CloudUpload,
  Backup,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useSocios } from '@/hooks/useSocios';
import { useAuth } from '@/hooks/useAuth';
import { Socio, SocioFormData } from '@/types/socio';

type Stats = {
  total: number;
  activos: number;
  vencidos: number;
  inactivos: number;
  [key: string]: number | undefined;
};

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OverviewDashboard } from '@/components/asociacion/OverviewDashboard';
import { AdvancedAnalytics } from '@/components/asociacion/AdvancedAnalytics';
import { ReportsSection } from '@/components/asociacion/ReportsSection';
import { InsightsIA } from '@/components/asociacion/InsightsIA';
import { EnhancedMemberManagement } from '@/components/asociacion/EnhancedMemberManagement';
import { DataExportSection } from '@/components/asociacion/DataExportSection';
import { BackupManagementSection } from '@/components/asociacion/BackupManagementSection';
import { SocioDialog } from '@/components/asociacion/SocioDialog';
import { DeleteConfirmDialog } from '@/components/asociacion/DeleteConfirmDialog';
import { CsvImport } from '@/components/asociacion/CsvImport';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              border: '6px solid #e2e8f0',
              borderRadius: '50%',
              borderTopColor: '#6366f1',
              borderRightColor: '#8b5cf6',
              animation: 'spin 1.5s linear infinite',
              mx: 'auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
          Cargando Dashboard Ejecutivo
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

const AccessDeniedScreen: React.FC = () => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Container maxWidth="sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: alpha('#ef4444', 0.1),
              color: '#ef4444',
              mx: 'auto',
              mb: 4,
            }}
          >
            <Security sx={{ fontSize: 50 }} />
          </Avatar>
          
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
            Acceso Restringido
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
            Necesitas permisos de asociación para acceder a este dashboard ejecutivo.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

// Componente para cada sección del dashboard
const DashboardSection: React.FC<{ 
  section: string; 
  socios: Socio[];
  stats: Stats;
  loading: boolean;
  onAddSocio: () => void;
  onEditSocio: (socio: Socio) => void;
  onDeleteSocio: (socio: Socio) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  onCsvImport: () => void;
  onNavigate: (section: string) => void;
}> = ({ 
  section, 
  socios, 
  stats, 
  loading, 
  onAddSocio, 
  onEditSocio, 
  onDeleteSocio, 
  onBulkAction,
  onCsvImport,
  onNavigate
}) => {
  
  switch (section) {
    case 'overview':
      return (
        <OverviewDashboard
          socios={socios}
          stats={stats}
          loading={loading}
          onNavigate={onNavigate}
          onAddMember={onAddSocio}
        />
      );

    case 'analytics':
    case 'metrics':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <Analytics sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    Analytics Avanzado
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Métricas y análisis profundo
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <AdvancedAnalytics socios={socios} stats={stats} loading={loading} />
        </Container>
      );

    case 'reports':
      return (
        <ReportsSection
          socios={socios}
          stats={stats}
          loading={loading}
        />
      );

    case 'insights':
      return (
        <InsightsIA
          socios={socios}
          stats={stats}
          loading={loading}
        />
      );

    // Gestión de Datos - Exportar Datos
    case 'export':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <DataExportSection
            socios={socios}
            stats={stats}
            loading={loading}
          />
        </Container>
      );

    // Gestión de Datos - Importar CSV
    case 'import':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.3)',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Upload sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
                Importación de Datos
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600, mb: 4 }}>
                Carga masiva de miembros desde archivos CSV
              </Typography>
              <Button
                onClick={onCsvImport}
                variant="contained"
                startIcon={<Upload />}
                size="large"
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Iniciar Importación
              </Button>
            </Box>
          </motion.div>
        </Container>
      );

    // Gestión de Datos - Respaldos (UPDATED)
    case 'backup':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <BackupManagementSection loading={loading} />
        </Container>
      );

    case 'all-members':
    case 'active-members':
    case 'expired-members':
    case 'members':
      const filteredSocios = section === 'active-members' 
        ? socios.filter(s => s.estado === 'activo')
        : section === 'expired-members'
        ? socios.filter(s => s.estado === 'vencido')
        : socios;

      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: section === 'active-members' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : section === 'expired-members'
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    boxShadow: section === 'active-members' 
                      ? '0 12px 40px rgba(16, 185, 129, 0.3)'
                      : section === 'expired-members'
                      ? '0 12px 40px rgba(239, 68, 68, 0.3)'
                      : '0 12px 40px rgba(6, 182, 212, 0.3)',
                  }}
                >
                  <Group sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    {section === 'active-members' ? 'Miembros Activos' :
                     section === 'expired-members' ? 'Miembros Vencidos' :
                     'Gestión de Miembros'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {filteredSocios.length} miembros encontrados
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    onClick={onAddSocio}
                    variant="contained"
                    startIcon={<PersonAdd />}
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 4,
                      textTransform: 'none',
                      fontWeight: 700,
                      background: section === 'active-members' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : section === 'expired-members'
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                      boxShadow: section === 'active-members' 
                        ? '0 8px 32px rgba(16, 185, 129, 0.3)'
                        : section === 'expired-members'
                        ? '0 8px 32px rgba(239, 68, 68, 0.3)'
                        : '0 8px 32px rgba(6, 182, 212, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: section === 'active-members' 
                          ? '0 12px 40px rgba(16, 185, 129, 0.4)'
                          : section === 'expired-members'
                          ? '0 12px 40px rgba(239, 68, 68, 0.4)'
                          : '0 12px 40px rgba(6, 182, 212, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Nuevo Miembro
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <EnhancedMemberManagement
            socios={filteredSocios}
            loading={loading}
            onAdd={onAddSocio}
            onEdit={onEditSocio}
            onDelete={onDeleteSocio}
            onBulkAction={onBulkAction}
          />
        </Container>
      );

    // Comunicaciones
    case 'notifications':
    case 'email-campaigns':
    case 'templates':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                    boxShadow: '0 12px 40px rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <CloudUpload sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                    {section === 'notifications' ? 'Notificaciones' :
                     section === 'email-campaigns' ? 'Campañas de Email' :
                     'Plantillas de Comunicación'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Sistema de comunicaciones
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Funcionalidad en Desarrollo
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              El sistema de comunicaciones estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );

    // Configuración y otros
    case 'settings':
    case 'help':
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              {section === 'settings' ? 'Configuración del Sistema' : 'Ayuda y Soporte'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Esta funcionalidad estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );

    default:
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Sección en Desarrollo
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Esta funcionalidad estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );
  }
};

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

  const [activeSection, setActiveSection] = useState('overview');
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
        toast.success('Miembro actualizado correctamente');
      } else {
        await addSocio(data);
        toast.success('Miembro agregado correctamente');
      }
      setSocioDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el miembro');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.socio) return;
    
    setActionLoading(true);
    try {
      await deleteSocio(deleteDialog.socio.uid);
      toast.success('Miembro eliminado correctamente');
      setDeleteDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el miembro');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCsvImport = async (sociosData?: SocioFormData[]) => {
    if (sociosData) {
      setActionLoading(true);
      try {
        await addMultipleSocios(sociosData);
        toast.success(`${sociosData.length} miembros importados correctamente`);
        setCsvImportOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al importar los miembros');
      } finally {
        setActionLoading(false);
      }
    } else {
      setCsvImportOpen(true);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    setActionLoading(true);
    try {
      switch (action) {
        case 'export':
          // Navigate to export section
          setActiveSection('export');
          toast.success('Redirigiendo a la sección de exportación...');
          break;
        case 'email':
          // Mock email functionality
          toast.success(`Email enviado a ${selectedIds.length} miembros`);
          break;
        case 'activate':
          // Mock activation functionality
          for (const id of selectedIds) {
            await updateSocio(id, { estado: 'activo' });
          }
          toast.success(`${selectedIds.length} miembros activados`);
          break;
        case 'archive':
          // Mock archive functionality
          for (const id of selectedIds) {
            await updateSocio(id, { estado: 'inactivo' });
          }
          toast.success(`${selectedIds.length} miembros archivados`);
          break;
        case 'delete':
          // Mock delete functionality
          for (const id of selectedIds) {
            await deleteSocio(id);
          }
          toast.success(`${selectedIds.length} miembros eliminados`);
          break;
        case 'print':
          toast.info('Función de impresión en desarrollo');
          break;
        default:
          toast.info(`Acción "${action}" aplicada a ${selectedIds.length} miembros`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al ejecutar la acción');
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Preparando tu centro de control ejecutivo..." />;
  }

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardSection
            section={activeSection}
            socios={socios}
            stats={stats}
            loading={loading}
            onAddSocio={handleAddSocio}
            onEditSocio={handleEditSocio}
            onDeleteSocio={handleDeleteSocio}
            onBulkAction={handleBulkAction}
            onCsvImport={() => handleCsvImport()}
            onNavigate={setActiveSection}
          />
        </motion.div>
      </AnimatePresence>

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
        socio={deleteDialog.socio ?? null}
        loading={actionLoading}
      />

      <CsvImport
        open={csvImportOpen}
        onClose={() => setCsvImportOpen(false)}
        onImport={handleCsvImport}
        loading={actionLoading}
      />
    </DashboardLayout>
  );
}