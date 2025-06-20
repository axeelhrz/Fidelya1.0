'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert as MuiAlert,
  Container,
  Stack,
  Paper,
  useTheme,
  alpha,
  SvgIconProps,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAlerts, useAlertStats } from '@/hooks/useAlerts';
import { usePatients } from '@/hooks/usePatients';
import { ClinicalAlert, AlertFilters, AlertFormData } from '@/types/alert';
import AlertsTable from '@/components/alerts/AlertsTable';
import AlertFiltersComponent from '@/components/alerts/AlertFilters';
import AlertDialog from '@/components/alerts/AlertDialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Componente de tarjeta de estadísticas personalizada
function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  loading 
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<SvgIconProps>;
  color: string;
  loading?: boolean;
}) {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 24, color }} />
          </Box>
        </Box>
        
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          {loading ? <CircularProgress size={24} /> : value.toLocaleString()}
        </Typography>
        
        <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      
      {/* Decoración de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: alpha(color, 0.05),
          zIndex: 0,
        }}
      />
    </Paper>
  );
}

export default function AlertsPage() {
  const theme = useTheme();
  const [filters, setFilters] = useState<AlertFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<ClinicalAlert | null>(null);

  const { alerts, loading, error, createAlert, resolveAlert, cancelAlert, deleteAlert } = useAlerts(filters);
  const { patients } = usePatients();
  const { stats, loading: statsLoading } = useAlertStats();

  const handleCreateAlert = async (alertData: AlertFormData) => {
    await createAlert(alertData);
    setDialogOpen(false);
  };

  const handleEditAlert = (alert: ClinicalAlert) => {
    setEditingAlert(alert);
    setDialogOpen(true);
  };

  const handleResolveAlert = async (alertId: string) => {
    await resolveAlert(alertId, 'Alerta resuelta desde la interfaz');
  };

  const handleCancelAlert = async (alertId: string) => {
    await cancelAlert(alertId, 'Alerta cancelada desde la interfaz');
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta alerta permanentemente?')) {
      await deleteAlert(alertId);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAlert(null);
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (loading && alerts.length === 0) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Container maxWidth="xl" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={60} />
            </Box>
          </Container>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="text.primary">
                      Alertas Clínicas
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                      Configurá seguimientos importantes y automatizá recordatorios clínicos
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  Nueva Alerta
                </Button>
              </Box>
            </Box>

            {/* Error Alert */}
            {error && (
              <MuiAlert 
                severity="error" 
                sx={{ 
                  borderRadius: 3,
                  '& .MuiAlert-message': { fontWeight: 500 }
                }}
              >
                {error}
              </MuiAlert>
            )}

            {/* Stats Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: '1fr 1fr', 
                md: '1fr 1fr 1fr', 
                lg: 'repeat(6, 1fr)' 
              },
              gap: 3 
            }}>
              <StatsCard
                title="Alertas Activas"
                value={stats?.active || 0}
                subtitle="Requieren atención"
                icon={NotificationsIcon}
                color={theme.palette.primary.main}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Alta Urgencia"
                value={stats?.highUrgency || 0}
                subtitle="Críticas y altas"
                icon={WarningIcon}
                color={theme.palette.error.main}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Resueltas"
                value={stats?.resolved || 0}
                subtitle="Completadas"
                icon={TrendingUpIcon}
                color={theme.palette.success.main}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Automáticas"
                value={stats?.autoGenerated || 0}
                subtitle="Generadas por IA"
                icon={AutoAwesomeIcon}
                color={theme.palette.secondary.main}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Programadas"
                value={stats?.byTrigger?.fecha_programada || 0}
                subtitle="Por fecha"
                icon={ScheduleIcon}
                color={theme.palette.info.main}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Total"
                value={stats?.total || 0}
                subtitle="Todas las alertas"
                icon={NotificationsIcon}
                color={theme.palette.grey[600]}
                loading={statsLoading}
              />
            </Box>

            {/* Filters */}
            <AlertFiltersComponent
              filters={filters}
              patients={patients}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />

            {/* Alerts Table */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {alerts.length > 0 ? `${alerts.length} alertas encontradas` : 'Lista de Alertas'}
                </Typography>
              </Box>
              
              <AlertsTable
                alerts={alerts}
                patients={patients}
                onEdit={handleEditAlert}
                onResolve={handleResolveAlert}
                onCancel={handleCancelAlert}
                onDelete={handleDeleteAlert}
                loading={loading}
              />
            </Box>
          </Stack>

          {/* Alert Dialog */}
          <AlertDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            onSave={handleCreateAlert}
            alert={editingAlert || undefined}
          />
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}