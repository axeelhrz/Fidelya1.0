'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert as MuiAlert,
  Fab,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useAlerts, useAlertStats } from '@/hooks/useAlerts';
import { usePatients } from '@/hooks/usePatients';
import { Alert, AlertFilters, AlertFormData } from '@/types/alert';
import AlertsTable from '@/components/alerts/AlertsTable';
import AlertFiltersComponent from '@/components/alerts/AlertFilters';
import AlertDialog from '@/components/alerts/AlertDialog';

export default function AlertsPage() {
  const [filters, setFilters] = useState<AlertFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  const { alerts, loading, error, createAlert, resolveAlert, cancelAlert, deleteAlert } = useAlerts(filters);
  const { patients } = usePatients();
  const { stats, loading: statsLoading } = useAlertStats();

  const handleCreateAlert = async (alertData: AlertFormData) => {
    await createAlert(alertData);
    setDialogOpen(false);
  };

  const handleEditAlert = (alert: Alert) => {
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
    if (confirm('¿Está seguro de que desea eliminar esta alerta?')) {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Alertas Clínicas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Nueva Alerta
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }}>
          {error}
        </MuiAlert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationsIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {statsLoading ? '-' : stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertas Activas
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="error" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {statsLoading ? '-' : stats.highUrgency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alta Urgencia
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {statsLoading ? '-' : stats.resolved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resueltas
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AutoAwesomeIcon color="secondary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {statsLoading ? '-' : stats.autoGenerated}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automáticas
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <AlertFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Alerts Table */}
      <AlertsTable
        alerts={alerts}
        patients={patients}
        onEdit={handleEditAlert}
        onResolve={handleResolveAlert}
        onCancel={handleCancelAlert}
        onDelete={handleDeleteAlert}
        loading={loading}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Alert Dialog */}
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleCreateAlert}
        alert={editingAlert}
      />
    </Box>
  );
}
