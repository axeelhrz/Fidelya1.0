'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Container,
  Stack,
} from '@mui/material';
import {
  Add,
  People,
  TrendingUp,
  Psychology,
  HealthAndSafety,
  Download,
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

// Componente para tarjetas de estadísticas con tamaño uniforme
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
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}) {
  return (
    <Paper 
      sx={{ 
        height: 140, // Altura fija para uniformidad
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box flex={1} sx={{ pr: 2 }}>
          <Typography 
            color="text.secondary" 
            gutterBottom 
            variant="body2"
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' },
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: '0.75rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
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
            minWidth: 48,
            minHeight: 48,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
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
    window.location.href = `/dashboard/patients/${patient.id}`;
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient(patientToDelete.id);
      setSnackbar({
        open: true,
        message: 'Paciente marcado como inactivo correctamente',
        severity: 'success'
      });
      refresh();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al procesar la solicitud',
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
      message: selectedPatient ? 'Paciente actualizado correctamente' : 'Paciente registrado correctamente',
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
        {/* Container con padding para separar del sidebar y navbar */}
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Stack spacing={4}>
            {/* Encabezado */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
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
                  startIcon={<Download />}
                  onClick={exportToCSV}
                  disabled={patients.length === 0}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Exportar CSV
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreatePatient}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Nuevo Paciente
                </Button>
              </Box>
            </Box>

            {/* Estadísticas con tamaño uniforme */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3,
              }}
            >
              <StatCard
                title="Total Pacientes"
                value={statsLoading ? '...' : stats?.total || 0}
                icon={<People />}
                color="primary"
                subtitle="Registrados en el sistema"
              />
              <StatCard
                title="Pacientes Activos"
                value={statsLoading ? '...' : stats?.active || 0}
                icon={<TrendingUp />}
                color="success"
                subtitle={`${Math.round(((stats?.active || 0) / (stats?.total || 1)) * 100)}% del total registrado`}
              />
              <StatCard
                title="Profesionales"
                value={psychologists.length}
                icon={<Psychology />}
                color="secondary"
                subtitle="Psicólogos disponibles"
              />
              <StatCard
                title="Edad Promedio"
                value={statsLoading ? '...' : `${Math.round(stats?.averageAge || 0)} años`}
                icon={<HealthAndSafety />}
                color="warning"
                subtitle="Promedio de todos los pacientes"
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
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  minWidth: 400,
                }
              }}
            >
              <DialogTitle>
                <Typography variant="h6" fontWeight={600}>
                  Confirmar Eliminación
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Typography sx={{ mb: 2 }}>
                  ¿Estás seguro de que deseas eliminar al paciente{' '}
                  <strong>{patientToDelete?.fullName}</strong>?
                </Typography>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  Esta acción marcará al paciente como inactivo. Los datos no se eliminarán permanentemente.
                </Alert>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                  onClick={() => setDeleteDialogOpen(false)}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmDelete}
                  color="error"
                  variant="contained"
                  disabled={actionLoading}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
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
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  fontWeight: 500
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Stack>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}