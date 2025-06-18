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
  Fade,
  Slide,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Add,
  People,
  TrendingUp,
  Psychology,
  HealthAndSafety,
  Download,
  PersonAdd,
  Circle,
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

// Componente para tarjetas de métricas clínicas optimizadas
function ClinicalMetricCard({ 
  title, 
  value, 
  subtitle,
  icon, 
  color = 'primary',
  trend,
  loading = false
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: { value: number; label: string };
  loading?: boolean;
}) {
  const theme = useTheme();

  const getColorConfig = () => {
    switch (color) {
      case 'primary': 
        return {
          main: theme.palette.primary.main,
          light: alpha(theme.palette.primary.main, 0.1),
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
        };
      case 'success': 
        return {
          main: theme.palette.success.main,
          light: alpha(theme.palette.success.main, 0.1),
          gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`
        };
      case 'info': 
        return {
          main: theme.palette.info.main,
          light: alpha(theme.palette.info.main, 0.1),
          gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.8)} 100%)`
        };
      case 'secondary': 
        return {
          main: theme.palette.secondary.main,
          light: alpha(theme.palette.secondary.main, 0.1),
          gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`
        };
      default: 
        return {
          main: theme.palette.primary.main,
          light: alpha(theme.palette.primary.main, 0.1),
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
        };
    }
  };

  const colorConfig = getColorConfig();

  if (loading) {
    return (
      <Paper
        sx={{
          p: 3,
          height: 220, // Altura aumentada para mejor contenido
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack spacing={2.5} height="100%">
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box flex={1}>
              <Skeleton variant="text" width="85%" height={16} />
            </Box>
            <Skeleton variant="circular" width={52} height={52} />
          </Box>
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
            <Skeleton variant="text" width="60%" height={44} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={16} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="65%" height={28} sx={{ borderRadius: 2 }} />
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        height: 220, // Altura aumentada para mejor contenido
        borderRadius: 4,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px ${alpha(colorConfig.main, 0.1)}`
            : `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px ${alpha(colorConfig.main, 0.1)}`,
          '& .metric-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .metric-value': {
            color: colorConfig.main,
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: colorConfig.gradient,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colorConfig.main, 0.05)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }
      }}
    >
      <Stack spacing={2} height="100%">
        {/* Header con título e ícono - Altura fija */}
        <Box 
          display="flex" 
          alignItems="flex-start" 
          justifyContent="space-between"
          sx={{ minHeight: 52 }} // Altura mínima para consistencia
        >
          <Box flex={1} sx={{ pr: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.75rem',
                lineHeight: 1.3,
                wordBreak: 'break-word', // Evita cortes abruptos
                hyphens: 'auto', // Permite guiones automáticos
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            className="metric-icon"
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: colorConfig.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colorConfig.main,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              flexShrink: 0, // No se encoge
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 3,
                background: colorConfig.gradient,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 0.1,
              }
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Valor principal - Área flexible */}
        <Box 
          flex={1} 
          display="flex" 
          flexDirection="column" 
          justifyContent="center"
          sx={{ minHeight: 80 }} // Altura mínima para el contenido principal
        >
          <Typography 
            className="metric-value"
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 800,
              fontFamily: 'Poppins, sans-serif',
              color: 'text.primary',
              lineHeight: 1.1,
              mb: 1,
              transition: 'color 0.3s ease',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              wordBreak: 'break-word', // Evita desbordamiento
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                lineHeight: 1.4,
                fontSize: '0.875rem',
                wordBreak: 'break-word',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2, // Máximo 2 líneas
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Indicador de tendencia - Altura fija */}
        <Box 
          sx={{ 
            minHeight: 32, // Altura mínima para consistencia
            display: 'flex',
            alignItems: 'flex-end'
          }}
        >
          {trend ? (
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 3,
                background: trend.value >= 0 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                maxWidth: '100%', // No excede el ancho del contenedor
              }}
            >
              <Circle 
                sx={{ 
                  fontSize: 8, 
                  color: trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  flexShrink: 0 // No se encoge
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{
                  fontWeight: 700,
                  color: trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap', // Evita salto de línea
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ height: 32 }} /> // Espacio reservado para mantener altura
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

export default function PatientsPage() {
  const { user } = useAuth();
  const theme = useTheme();
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

  // Calcular métricas mejoradas
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const activePercentage = calculatePercentage(stats?.active || 0, stats?.total || 1);
  const averageAge = Math.round(stats?.averageAge || 0);

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
        <Container maxWidth={false} sx={{ py: 4 }}>
          <Stack spacing={4}>
            {/* Encabezado Clínico */}
            <Fade in timeout={600}>
              <Box>
                <Stack spacing={1} mb={2}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: 'Poppins, sans-serif',
                      color: 'text.primary',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Pacientes
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: 600
                    }}
                  >
                    Visualiza, filtra y gestiona la ficha clínica de tus pacientes. 
                    Mantén un registro completo y organizado de cada caso.
                  </Typography>
                </Stack>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Box />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={exportToCSV}
                      disabled={patients.length === 0}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1.5,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      Exportar Datos
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={handleCreatePatient}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${theme.palette.primary.main} 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        }
                      }}
                    >
                      Nuevo Paciente
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Fade>

            {/* Métricas Clínicas Optimizadas */}
            <Slide direction="up" in timeout={800}>
              <Box>
                <Box 
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    },
                    gap: 3,
                    mb: 1
                  }}
                >
                  <ClinicalMetricCard
                    title="Total Pacientes"
                    value={statsLoading ? '...' : stats?.total || 0}
                    subtitle="Registrados en el sistema"
                    icon={<People sx={{ fontSize: 26 }} />}
                    color="primary"
                    loading={statsLoading}
                  />
                  <ClinicalMetricCard
                    title="Pacientes Activos"
                    value={statsLoading ? '...' : stats?.active || 0}
                    subtitle={`${activePercentage}% del total registrado`}
                    icon={<TrendingUp sx={{ fontSize: 26 }} />}
                    color="success"
                    trend={{ value: 12, label: 'este mes' }}
                    loading={statsLoading}
                  />
                  <ClinicalMetricCard
                    title="Profesionales"
                    value={psychologists.length}
                    subtitle="Psicólogos disponibles"
                    icon={<Psychology sx={{ fontSize: 26 }} />}
                    color="info"
                    loading={statsLoading}
                  />
                  <ClinicalMetricCard
                    title="Edad Promedio"
                    value={statsLoading ? '...' : `${averageAge} años`}
                    subtitle="Promedio de todos los pacientes"
                    icon={<HealthAndSafety sx={{ fontSize: 26 }} />}
                    color="secondary"
                    loading={statsLoading}
                  />
                </Box>
              </Box>
            </Slide>

            {/* Filtros Clínicos */}
            <Slide direction="up" in timeout={1000}>
              <Box>
                <PatientFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  psychologists={psychologists}
                />
              </Box>
            </Slide>

            {/* Tabla de Pacientes */}
            <Slide direction="up" in timeout={1200}>
              <Box>
                <PatientsTable
                  patients={patients}
                  psychologists={psychologists}
                  loading={loading}
                  error={error}
                  onEdit={handleEditPatient}
                  onDelete={handleDeletePatient}
                  onView={handleViewPatient}
                />
              </Box>
            </Slide>

            {/* Diálogo de Paciente */}
            <PatientDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onSuccess={handleDialogSuccess}
              patient={selectedPatient}
              psychologists={psychologists}
            />

            {/* Diálogo de Confirmación de Eliminación */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  minWidth: 400,
                }
              }}
            >
              <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  Confirmar Acción
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ¿Estás seguro de que deseas marcar como inactivo al paciente{' '}
                  <strong>{patientToDelete?.fullName}</strong>?
                </Typography>
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-message': {
                      fontSize: '0.875rem'
                    }
                  }}
                >
                  Esta acción marcará al paciente como inactivo. Los datos se conservarán para consultas futuras.
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
                  variant="contained"
                  color="warning"
                  disabled={actionLoading}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {actionLoading ? 'Procesando...' : 'Marcar como Inactivo'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Notificaciones */}
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