'use client';
import React, { useState } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  alpha,
  useTheme,
  Typography,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { usePolicies } from '@/hooks/use-policies';
import { useSubscription } from '@/hooks/use-subscription';
import { Policy, PolicyReminder } from '@/types/policy';
import { useAuth } from '@/hooks/use-auth';
import { Timestamp } from 'firebase/firestore';

// Componentes
import PolicyHeader from '@/components/dashboard/policies/policy-header';
import PolicyStats from '@/components/dashboard/policies/policy-stats';
import PolicyTabs from '@/components/dashboard/policies/policy-tabs';
import PolicyTable from '@/components/dashboard/policies/policy-table';
import PolicyGrid from '@/components/dashboard/policies/policy-grid';
import ArchivedPoliciesSection from '@/components/dashboard/policies/archived-policies-section';

// Diálogos
import PolicyFormDialog from '@/components/dashboard/policies/policy-form-dialog';
import PolicyViewDialog from '@/components/dashboard/policies/policy-view-dialog';
import PolicyDeleteDialog from '@/components/dashboard/policies/policy-delete-dialog';
import PolicyImportDialog from '@/components/dashboard/policies/policy-import-dialog';
import PolicyExportDialog from '@/components/dashboard/policies/policy-export-dialog';
import PolicyAnalyticsDialog from '@/components/dashboard/policies/policy-analytics-dialog';

export default function PoliciesPage() {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { subscription } = useSubscription();
  const planType = typeof subscription?.plan === 'object' && subscription?.plan !== null 
    ? 'type' in subscription.plan ? (subscription.plan as { type: string }).type : undefined 
    : subscription?.plan;

  // Estados
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openAnalyticsDialog, setOpenAnalyticsDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning' 
  });

  const handleImportPolicies = async (policiesToImport: Partial<Policy>[]): Promise<number> => {
    let successCount = 0;
    
    for (const policyData of policiesToImport) {
      try {
        const success = await savePolicy(policyData, false);
        if (success) {
          successCount++;
        }
      } catch (error) {
        console.error("Error importing policy:", error);
      }
    }
    
    return successCount;
  };

  // Custom hook para manejar las pólizas
  const {
    policies,
    filteredPolicies,
    customers,
    loading,
    hasMore,
    policyStats,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    savePolicy,
    deletePolicy,
    toggleArchivePolicy,
    toggleStarPolicy,
    duplicatePolicy,
    addReminder,
    toggleReminder,
    deleteReminder,
    uploadDocument,
    deleteDocument,
    updateNotes
  } = usePolicies();

  // Funciones para manejar los cambios de estado
  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue);
    setPage(1);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };
  

  // Función para manejar el cambio de vista con ToggleButtonGroup
  const handleViewToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'table' | 'grid',
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Funciones para manejar los diálogos
  const handleOpenDialog = (editMode = false, policy: Policy | null = null) => {
    setIsEditMode(editMode);
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPolicy(null);
    setIsEditMode(false);
  };

  const handleOpenViewDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedPolicy(null);
  };

  const handleOpenDeleteDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPolicy(null);
  };

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false);
  };

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
  };

  const handleOpenAnalyticsDialog = () => {
    setOpenAnalyticsDialog(true);
  };

  const handleCloseAnalyticsDialog = () => {
    setOpenAnalyticsDialog(false);
  };

  // Funciones para manejar las acciones de las pólizas
  const handleSavePolicy = async (policyData: Partial<Policy>, isEdit: boolean = false, policyId?: string) => {
    // Asegúrate de que todos los campos requeridos estén presentes
    const completePolicy: Partial<Policy> = {
      ...policyData,
      errors: [], // Campo requerido
      customerId: policyData.customerId || '', // Asegúrate de que exista
      coverages: policyData.coverages || [], // Asegúrate de que exista
      paymentFrequency: policyData.paymentFrequency || 'annual', // Asegúrate de que exista
    };
    
    const success = await savePolicy(completePolicy, isEdit, policyId);
    
    if (success) {
      // Resetear filtros y cambiar a la pestaña "Todas"
      setFilters({
        status: [],
        type: [],
        company: [],
        search: '',
        startDate: null,
        endDate: null,
        minPremium: null,
        maxPremium: null,
        onlyStarred: false,
        isArchived: false,
        isStarred: false,
        dateRange: { start: null, end: null },
        premium: { min: null, max: null },
        searchTerm: '',
      });
      
      // Cambiar a la pestaña "Todas"
      setCurrentTab(0);
      
      // Resetear la página a 1
      setPage(1);

      setSnackbar({
        open: true,
        message: isEdit ? 'Póliza actualizada con éxito' : 'Póliza guardada con éxito',
        severity: 'success'
      });
      
      return success;
    }
    return false;
  };

  const handleDeletePolicyConfirm = async () => {
    if (!selectedPolicy) return;
    
    const success = await deletePolicy(selectedPolicy.id);
    
    if (success) {
      setSnackbar({
        open: true,
        message: 'Póliza eliminada con éxito',
        severity: 'success'
      });
      handleCloseDeleteDialog();
      if (openViewDialog) {
        handleCloseViewDialog();
      }
    } else {
      setSnackbar({
        open: true,
        message: 'Error al eliminar póliza',
        severity: 'error'
      });
    }
  };

  const handleToggleStar = async (id: string, star: boolean) => {
    const success = await toggleStarPolicy(id, star);
    
    if (!success) {
      setSnackbar({
        open: true,
        message: 'Error al destacar póliza',
        severity: 'error'
      });
    }
  };

  const handleToggleArchive = async (id: string, archive: boolean) => {
    const success = await toggleArchivePolicy(id, archive);
    
    if (success) {
      setSnackbar({
        open: true,
        message: archive ? 'Póliza archivada con éxito' : 'Póliza desarchivada con éxito',
        severity: 'success'
      });
      if (openViewDialog) {
        handleCloseViewDialog();
      }
    } else {
      setSnackbar({
        open: true,
        message: 'Error al cambiar estado de archivo',
        severity: 'error'
      });
    }
  };

  const handleDuplicatePolicy = async (policy: Policy) => {
    const success = await duplicatePolicy(policy);
    
    if (success) {
      setSnackbar({
        open: true,
        message: 'Póliza duplicada con éxito',
        severity: 'success'
      });
      if (openViewDialog) {
        handleCloseViewDialog();
      }
    } else {
      setSnackbar({
        open: true,
        message: 'Error al duplicar póliza',
        severity: 'error'
      });
    }
  };

  const handleRenewPolicy = (policy: Policy) => {
    handleOpenDialog(true, {
      ...policy,
      policyNumber: `${policy.policyNumber}-R`,
      isRenewal: true,
      status: 'active',
      startDate: policy.endDate, // La fecha de inicio es la fecha de fin de la póliza anterior
      endDate: (() => {
        const endDate = new Date(policy.endDate.toDate());
        endDate.setFullYear(endDate.getFullYear() + 1);
        return Timestamp.fromDate(endDate);
      })(),
    });
  };

  const handleAddReminder = async (policyId: string, reminder: Omit<PolicyReminder, "id">) => {
    const success = await addReminder(policyId, reminder);
    
    if (success) {
      setSnackbar({
        open: true,
        message: 'Recordatorio añadido con éxito',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Error al añadir recordatorio',
        severity: 'error'
      });
    }
  };

  const handleToggleReminder = async (policyId: string, reminderId: string, completed: boolean) => {
    const success = await toggleReminder(policyId, reminderId, completed);
    
    if (!success) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar recordatorio',
        severity: 'error'
      });
    }
  };

  const handleDeleteReminder = async (policyId: string, reminderId: string) => {
    const success = await deleteReminder(policyId, reminderId);
    
    if (success) {
      setSnackbar({
        open: true,
        message: 'Recordatorio eliminado con éxito',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Error al eliminar recordatorio',
        severity: 'error'
      });
    }
  };

  const handleUploadDocument = async (policyId: string, file: File) => {
    const document = await uploadDocument(policyId, file);
    
    if (document) {
      setSnackbar({
        open: true,
        message: 'Documento subido con éxito',
        severity: 'success'
      });
      return document;
    } else {
      setSnackbar({
        open: true,
        message: 'Error al subir documento',
        severity: 'error'
      });
      return null;
    }
  };

  const handleDeleteDocument = async (policyId: string, docId: string) => {
    const success = await deleteDocument(policyId, docId);
    
    if (success) {
      setSnackbar({
        open: true,
        message: 'Documento eliminado con éxito',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Error al eliminar documento',
        severity: 'error'
      });
    }
  };

  const handleUpdateNotes = async (policyId: string, notes: string) => {
    const success = await updateNotes(policyId, notes);
    
    if (!success) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar notas',
        severity: 'error'
      });
    }
  };

// Función para filtrar las pólizas según la pestaña actual
const getFilteredPoliciesByTab = () => {
  // Primero, asegúrate de que estamos trabajando con la lista más actualizada
  let filtered = [...filteredPolicies];
  
  console.log("Total de pólizas antes de filtrar por pestaña:", filtered.length);
  console.log("Pestaña actual:", currentTab);
  
  // Verificar si hay pólizas con campos faltantes y corregirlas
  filtered = filtered.map(p => ({
    ...p,
    errors: p.errors || [],
    customerId: p.customerId || '',
    coverages: p.coverages || [],
    paymentFrequency: p.paymentFrequency || 'annual',
  }));
  
  // Imprimir información sobre las pólizas antes de filtrar
  if (filtered.length > 0) {
    console.log("Pólizas antes de filtrar:", filtered.map(p => ({
      id: p.id,
      policyNumber: p.policyNumber,
      status: p.status,
      isArchived: p.isArchived
    })));
  }
  
  // Filtrar por pestaña
  switch (currentTab) {
    case 0: // Todas
      filtered = filtered.filter(p => !p.isArchived);
      break;
    case 1: // Activas
      filtered = filtered.filter(p => p.status === 'active' && !p.isArchived);
      break;
    case 2: // Vencidas
      filtered = filtered.filter(p => p.status === 'expired' && !p.isArchived);
      break;
    case 3: // Pendientes
      filtered = filtered.filter(p => p.status === 'pending' && !p.isArchived);
      break;
    case 4: // En revisión
      // 'review' is not a valid status, removing it or using a valid status
      filtered = filtered.filter(p => !p.isArchived);
      break;
  }
  
  console.log("Total de pólizas después de filtrar por pestaña:", filtered.length);
  console.log("Filtro aplicado para pestaña:", currentTab);
  
  // Imprimir información sobre las pólizas filtradas
  if (filtered.length > 0) {
    console.log("Pólizas después de filtrar:", filtered.map(p => ({
      id: p.id,
      policyNumber: p.policyNumber,
      status: p.status,
      isArchived: p.isArchived
    })));
  } else {
    console.log("No hay pólizas que cumplan con los filtros actuales");
    console.log("Filtros actuales:", filters);
    console.log("Pestaña actual:", currentTab);
  }
  
  return filtered;
};

  // Obtener las pólizas filtradas por la pestaña actual
  const displayedPolicies = getFilteredPoliciesByTab();

  // Obtener las compañías únicas para el filtro

  // Mostrar pantalla de carga mientras se autentica
  if (authLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar mensaje si no hay usuario autenticado
  if (!user) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            maxWidth: 500,
            borderRadius: 2,
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Acceso no autorizado
          </Typography>
          <Typography variant="body1">
            Debes iniciar sesión para acceder a esta página.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Box sx={{ 
        p: { xs: 2, md: 3 },
        height: '100%',
        overflow: 'auto',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${alpha('#1a1c20', 0.96)}, ${alpha('#0f1114', 0.96)})`
          : `linear-gradient(135deg, ${alpha('#f8fafc', 0.96)}, ${alpha('#eef2f6', 0.96)})`,
        fontFamily: 'Sora, sans-serif',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PolicyHeader 
            policiesCount={policies.length}
            planType={planType}
            onNewPolicy={() => handleOpenDialog(false)}
            onImport={handleOpenImportDialog}
            onExport={handleOpenExportDialog}
            onAnalytics={handleOpenAnalyticsDialog}
          />
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PolicyStats stats={{
            total: policyStats.total,
            active: policyStats.active,
            expired: policyStats.expired,
            pending: policyStats.pending,
            review: policyStats.review,
            cancelled: policyStats.cancelled,
            expiringIn30Days: policyStats.expiringIn30Days,
            totalPremium: policies.reduce((sum, policy) => sum + (policy.premium || 0), 0)
          }} />
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <PolicyTabs 
                currentTab={currentTab}
                onTabChange={handleTabChange}
                policies={policies}
              />
              
              {/* Botones de cambio de vista modernizados */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    background: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewToggleChange}
                    aria-label="vista de pólizas"
                    sx={{
                      '& .MuiToggleButtonGroup-grouped': {
                        border: 0,
                        '&:not(:first-of-type)': {
                          borderRadius: '12px',
                        },
                        '&:first-of-type': {
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <ToggleButton 
                      value="table" 
                      aria-label="vista de tabla"
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        color: viewMode === 'table' ? theme.palette.primary.main : theme.palette.text.secondary,
                        backgroundColor: viewMode === 'table' 
                          ? alpha(theme.palette.primary.main, 0.1) 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: viewMode === 'table'
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.primary.main, 0.05),
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Tooltip title="Vista de tabla">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewListIcon fontSize="small" />
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Tabla</Box>
                        </Box>
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton 
                      value="grid" 
                      aria-label="vista de tarjetas"
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        color: viewMode === 'grid' ? theme.palette.primary.main : theme.palette.text.secondary,
                        backgroundColor: viewMode === 'grid' 
                          ? alpha(theme.palette.primary.main, 0.1) 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: viewMode === 'grid'
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.primary.main, 0.05),
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Tooltip title="Vista de tarjetas">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewModuleIcon fontSize="small" />
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Tarjetas</Box>
                        </Box>
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Paper>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {viewMode === 'table' ? (
            <PolicyTable 
              policies={displayedPolicies}
              loading={loading}
              hasMore={hasMore}
              page={page}
              onPageChange={handlePageChange}
              onSort={handleSort}
              sortConfig={sortConfig}
              onView={handleOpenViewDialog}
              onEdit={(policy) => handleOpenDialog(true, policy)}
              onToggleStar={handleToggleStar}
          onToggleArchive={handleToggleArchive}
              onNewPolicy={() => handleOpenDialog(false)}
        />
          ) : (
            <PolicyGrid 
              policies={displayedPolicies}
              loading={loading}
              onView={handleOpenViewDialog}
              onEdit={(policy) => handleOpenDialog(true, policy)}
              onRenew={handleRenewPolicy}
              onNewPolicy={() => handleOpenDialog(false)}
        />
          )}
        </motion.div>

        {/* Sección de pólizas archivadas - Solo se muestra si no estamos en la pestaña de archivadas */}
        {currentTab !== 6 && (
          <ArchivedPoliciesSection 
          policies={policies}
            onView={handleOpenViewDialog}
            onEdit={(policy) => handleOpenDialog(true, policy)}
            onToggleArchive={handleToggleArchive}
            onToggleStar={handleToggleStar}
        />
        )}

        {/* Diálogos */}
        <PolicyFormDialog 
          open={openDialog}
          onClose={handleCloseDialog}
          policy={selectedPolicy}
          isEditMode={isEditMode}
          onSave={handleSavePolicy}
          customers={customers} // Pasamos la lista de clientes al formulario
        />

        <PolicyViewDialog 
          open={openViewDialog}
          onClose={handleCloseViewDialog}
          policy={selectedPolicy}
          customers={customers}
          onEdit={(policy) => {
            handleCloseViewDialog();
            handleOpenDialog(true, policy);
            }}
          onDelete={handleOpenDeleteDialog}
          onToggleArchive={handleToggleArchive}
          onToggleStar={handleToggleStar}
          onDuplicate={handleDuplicatePolicy}
          onRenew={handleRenewPolicy}
          onAddReminder={handleAddReminder}
          onToggleReminder={handleToggleReminder}
          onDeleteReminder={handleDeleteReminder}
          onUploadDocument={handleUploadDocument}
          onDeleteDocument={handleDeleteDocument}
          onUpdateNotes={handleUpdateNotes}
        />

        <PolicyDeleteDialog 
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          policy={selectedPolicy}
          onDelete={handleDeletePolicyConfirm}
        />

        <PolicyImportDialog 
          open={openImportDialog}
          onClose={handleCloseImportDialog}
          customers={customers}
          onImportPolicies={handleImportPolicies}
        />

        <PolicyExportDialog 
          open={openExportDialog}
          onClose={handleCloseExportDialog}
          policies={filteredPolicies}
        />

        <PolicyAnalyticsDialog 
          open={openAnalyticsDialog}
          onClose={handleCloseAnalyticsDialog}
          policies={policies}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 500
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AnimatePresence>
  );
}