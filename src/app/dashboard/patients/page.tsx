'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Snackbar,
} from '@mui/material';
import {
  Add,
  People,
  TrendingUp,
  Psychology,
  Warning,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PatientsTable from '@/components/patients/PatientsTable';
import PatientDialog from '@/components/patients/PatientDialog';
import PatientFilters from '@/components/patients/PatientFilters';
import { usePatients, usePatientStats, usePatientActions } from '@/hooks/usePatients';
import { useAuth } from '@/context/AuthContext';
import { Patient, PatientFilters as PatientFiltersType } from '@/types/patient';
import { User } from '@/types/auth';
import { FirestoreService } from '@/services/firestore';

// Componente para tarjetas de estadísticas
function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  subtitle 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.main`,
              color: 'white',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function PatientsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<PatientFiltersType>({});
  const [psychologists, setPsychologists] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { patients, loading, error, refresh } = usePatients(filters);
  const { stats, loading: statsLoading } = usePatientStats();
  const { deletePatient, loading: actionLoading } = usePatientActions();

  // Cargar psicólogos del centro
  useEffect(() => {
    const loadPsychologists = async () => {
      if (!user?.centerId) return;
      
      try {
        const centerUsers = await FirestoreService.getCenterUsers(user.centerId);
        const psychologistUsers = centerUsers.filter(u => u.role === 'psychologist');
        setPsychologists(psychologistUsers);
      } catch (error) {
        console.error('Error loading psychologists:', error);
      }
    };

    loadPsychologists();
  }, [user?.centerId]);

  const handleCreatePatient = () => {
    setSelectedPatient(null);
    setDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    // Navegar a la vista individual del paciente
    window.location.href = `/dashboard/patients/${patient.id}`;
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient(patientToDelete.id);
      setSnackbar({
        open: true,
        message: 'Paciente eliminado correctamente',
        severity: 'success'
      });
      refresh();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al eliminar el paciente',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleDialogSuccess = () => {
    setSnackbar({
      open: true,
      message: selectedPatient ? 'Paciente actualizado correctamente' : 'Paciente creado correctamente',
      severity: 'success'
    });
    refresh();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nombre', 'Edad', 'Género', 'Estado Emocional', 'Motivo de Consulta', 'Psicólogo', 'Fecha de Alta'].join(','),
      ...patients.map(patient => [
        patient.fullName,
        patient.age || '',
        patient.gender,
        patient.emotionalState,
        `"${patient.motivoConsulta}"`,
        psychologists.find(p => p.uid === patient.assignedPsychologist)?.displayName || '',
        (patient.createdAt instanceof Date ? patient.createdAt : patient.createdAt.toDate()).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Box>
          {/* Encabezado */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Gestión de Pacientes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administra y supervisa la información de tus pacientes
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={exportToCSV}
                disabled={patients.length === 0}
              >
                Exportar CSV
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreatePatient}
              >
                Nuevo Paciente
              </Button>
            </Box>
          </Box>

          {/* Estadísticas */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 4,
              '& > *': {
                flex: '1 1 250px',
                minWidth: '250px'
              }
            }}
          >
            <StatCard
              title="Total Pacientes"
              value={statsLoading ? '...' : stats?.total || 0}
              icon={<People />}
              color="primary"
            />
            <StatCard
              title="Pacientes Activos"
              value={statsLoading ? '...' : stats?.active || 0}
              icon={<TrendingUp />}
              color="success"
              subtitle={`${Math.round(((stats?.active || 0) / (stats?.total || 1)) * 100)}% del total`}
            />
            <StatCard
              title="Psicólogos"
              value={psychologists.length}
              icon={<Psychology />}
              color="secondary"
            />
            <StatCard
              title="Edad Promedio"
              value={statsLoading ? '...' : `${stats?.averageAge || 0} años`}
              icon={<Warning />}
              color="warning"
            />
          </Box>

          {/* Filtros */}
          <PatientFilters
            filters={filters}
            onFiltersChange={setFilters}
            psychologists={psychologists}
          />

          {/* Tabla de pacientes */}
          <PatientsTable
            patients={patients}
            psychologists={psychologists}
            loading={loading}
            error={error}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onView={handleViewPatient}
          />

          {/* FAB para crear paciente en móvil */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: { xs: 'flex', md: 'none' }
            }}
            onClick={handleCreatePatient}
          >
            <Add />
          </Fab>

          {/* Diálogo de paciente */}
          <PatientDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSuccess={handleDialogSuccess}
            patient={selectedPatient}
            psychologists={psychologists}
          />

          {/* Diálogo de confirmación de eliminación */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que deseas eliminar al paciente{' '}
                <strong>{patientToDelete?.fullName}</strong>?
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Esta acción marcará al paciente como inactivo. Los datos no se eliminarán permanentemente.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                color="error"
                variant="contained"
                disabled={actionLoading}
              >
                {actionLoading ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para notificaciones */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}