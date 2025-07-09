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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PersonAdd,
  Security,
  Analytics,
  Group,
  Store,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useSocios } from '@/hooks/useSocios';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Socio, SocioFormData } from '@/types/socio';

type Stats = {
  total: number;
  activos: number;
  vencidos: number;
  inactivos: number;
  [key: string]: number | undefined;
};

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AsociacionSidebar } from '@/components/layout/AsociacionSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { OverviewDashboard } from '@/components/asociacion/OverviewDashboard';
import { AdvancedAnalytics } from '@/components/asociacion/AdvancedAnalytics';
import { EnhancedMemberManagement } from '@/components/asociacion/EnhancedMemberManagement';
import { ComercioManagement } from '@/components/asociacion/ComercioManagement';
import { NotificationsCenter } from '@/components/asociacion/NotificationsCenter';
import { SocioDialog } from '@/components/asociacion/SocioDialog';
import { DeleteConfirmDialog } from '@/components/asociacion/DeleteConfirmDialog';
import { CsvImport } from '@/components/asociacion/CsvImport';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 }
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
                width: { xs: 64, md: 80 },
                height: { xs: 64, md: 80 },
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
          <Typography variant="h4" sx={{ 
            fontWeight: 900, 
            color: '#0f172a', 
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            Cargando Dashboard Ejecutivo
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#64748b', 
            fontWeight: 500,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}>
            {message}
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

const AccessDeniedScreen: React.FC = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 }
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
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                bgcolor: alpha('#ef4444', 0.1),
                color: '#ef4444',
                mx: 'auto',
                mb: 4,
              }}
            >
              <Security sx={{ fontSize: { xs: 40, md: 50 } }} />
            </Avatar>
            
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              color: '#0f172a', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              Acceso Restringido
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#64748b', 
              mb: 4, 
              maxWidth: 400, 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              Necesitas permisos de asociación para acceder a este dashboard ejecutivo.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

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
  onRefresh: () => void;
}> = ({ 
  section, 
  socios, 
  loading, 
  onAddSocio, 
  onNavigate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  switch (section) {
    case 'overview':
    case 'dashboard':
      return (
        <OverviewDashboard
          onNavigate={onNavigate}
          onAddMember={onAddSocio}
        />
      );

    case 'analytics':
      return (
        <Box sx={{ 
          maxWidth: '100%',
          overflow: 'hidden',
          px: { xs: 0, sm: 2, md: 4 },
          py: { xs: 2, md: 4 }
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 2, md: 3 }, 
                mb: { xs: 3, md: 4 },
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Avatar
                  sx={{
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <Analytics sx={{ fontSize: { xs: 28, md: 32 } }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: '#0f172a', 
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}>
                    Analytics Avanzado
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}>
                    Métricas y análisis profundo
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <AdvancedAnalytics loading={loading} />
        </Box>
      );

    case 'members':
    case 'socios':
    case 'socios-lista':
      return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 2, md: 3 }, 
                mb: { xs: 3, md: 4 },
                flexDirection: { xs: 'column', md: 'row' },
                textAlign: { xs: 'center', md: 'left' }
              }}>
                <Avatar
                  sx={{
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    boxShadow: '0 12px 40px rgba(6, 182, 212, 0.3)',
                  }}
                >
                  <Group sx={{ fontSize: { xs: 28, md: 32 } }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: '#0f172a', 
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}>
                    Gestión de Socios
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}>
                    {socios.length} socios encontrados
                  </Typography>
                </Box>
                <Box sx={{ 
                  ml: { xs: 0, md: 'auto' },
                  width: { xs: '100%', md: 'auto' }
                }}>
                  <Button
                    onClick={onAddSocio}
                    variant="contained"
                    startIcon={<PersonAdd />}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      py: { xs: 1.5, md: 2 },
                      px: { xs: 3, md: 4 },
                      borderRadius: 4,
                      textTransform: 'none',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                      boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
                      width: { xs: '100%', md: 'auto' },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(6, 182, 212, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Nuevo Socio
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <EnhancedMemberManagement
            onNavigate={onNavigate}
          />
        </Container>
      );

    case 'comercios':
    case 'comercios-lista':
    case 'comercios-vincular':
    case 'comercios-beneficios':
      return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 2, md: 3 }, 
                mb: { xs: 3, md: 4 },
                flexDirection: { xs: 'column', md: 'row' },
                textAlign: { xs: 'center', md: 'left' }
              }}>
                <Avatar
                  sx={{
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Store sx={{ fontSize: { xs: 28, md: 32 } }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: '#0f172a', 
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}>
                    Gestión de Comercios
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}>
                    Administra los comercios vinculados
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <ComercioManagement onNavigate={onNavigate} />
        </Container>
      );

    case 'notifications':
    case 'notificaciones':
      return <NotificationsCenter loading={loading} />;

    default:
      return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#1e293b', 
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}>
              Sección en Desarrollo
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#64748b',
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}>
              Esta funcionalidad estará disponible próximamente.
            </Typography>
          </Box>
        </Container>
      );
  }
};

// Sidebar personalizado que maneja el logout
const AsociacionSidebarWithLogout: React.FC<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
}> = (props) => {
  return (
    <AsociacionSidebar
      open={props.open}
      onToggle={props.onToggle}
      onMenuClick={props.onMenuClick}
      onLogoutClick={props.onLogoutClick}
      activeSection={props.activeSection}
    />
  );
};

export default function AsociacionDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    socios, 
    loading, 
    stats, 
    createSocio, 
    updateSocio, 
    deleteSocio, 
    importSocios,
    refreshStats
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
  
  // Estados para el modal de logout
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleAddSocio = () => {
    setSocioDialog({ open: true, socio: null });
  };

  const handleEditSocio = (socio: Socio) => {
    setSocioDialog({ open: true, socio });
  };

  const handleDeleteSocio = (socio: Socio) => {
    setDeleteDialog({ open: true, socio });
  };

  const handleRefresh = async () => {
    try {
      await refreshStats();
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error refreshing socios:', error);
      toast.error('Error al actualizar los datos');
    }
  };

  const handleSaveSocio = async (data: SocioFormData) => {
    setActionLoading(true);
    try {
      if (socioDialog.socio) {
        await updateSocio(socioDialog.socio.id, data);
        toast.success('Socio actualizado correctamente');
      } else {
        await createSocio(data);
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
      await deleteSocio(deleteDialog.socio.id);
      toast.success('Socio eliminado correctamente');
      setDeleteDialog({ open: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el socio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCsvImport = async (sociosData?: SocioFormData[]) => {
    if (sociosData) {
      setActionLoading(true);
      try {
        await importSocios(sociosData);
        toast.success(`${sociosData.length} socios importados correctamente`);
        setCsvImportOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al importar los socios');
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
          toast.success('Función de exportación en desarrollo');
          break;
        case 'email':
          toast.success(`Email enviado a ${selectedIds.length} socios`);
          break;
        case 'activate':
          for (const id of selectedIds) {
            await updateSocio(id, { estado: 'activo' });
          }
          toast.success(`${selectedIds.length} socios activados`);
          break;
        case 'archive':
          for (const id of selectedIds) {
            await updateSocio(id, { estado: 'vencido' });
          }
          toast.success(`${selectedIds.length} socios archivados`);
          break;
        case 'delete':
          for (const id of selectedIds) {
            await deleteSocio(id);
          }
          toast.success(`${selectedIds.length} socios eliminados`);
          break;
        case 'print':
          toast('Función de impresión en desarrollo');
          break;
        default:
          toast(`Acción "${action}" aplicada a ${selectedIds.length} socios`);
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
    <>
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        sidebarComponent={(props) => (
          <AsociacionSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
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
              stats={Object.fromEntries(
                Object.entries(stats).filter(
                  ([, value]) => typeof value === 'number' || typeof value === 'undefined'
                )
              ) as Stats}
              loading={loading}
              onAddSocio={handleAddSocio}
              onEditSocio={handleEditSocio}
              onDeleteSocio={handleDeleteSocio}
              onBulkAction={handleBulkAction}
              onCsvImport={() => handleCsvImport()}
              onNavigate={setActiveSection}
              onRefresh={handleRefresh}
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

      {/* Modal de Logout - Fuera del layout para que aparezca en toda la página */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}