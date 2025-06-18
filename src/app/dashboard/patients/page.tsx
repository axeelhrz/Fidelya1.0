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
  keyframes,
} from '@mui/material';
import {
  Add,
  People,
  TrendingUp,
  Psychology,
  HealthAndSafety,
  Download,
  PersonAdd,
  ArrowUpward,
  ArrowDownward,
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

// Animación de flotación suave
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(1deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Componente para tarjetas de métricas con forma de nube
function CloudMetricCard({ 
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
          light: alpha(theme.palette.primary.main, 0.15),
          dark: theme.palette.primary.dark,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 50%, ${theme.palette.primary.dark} 100%)`,
        };
      case 'success': 
        return {
          main: theme.palette.success.main,
          light: alpha(theme.palette.success.main, 0.15),
          dark: theme.palette.success.dark,
          gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.8)} 50%, ${theme.palette.success.dark} 100%)`,
        };
      case 'info': 
        return {
          main: theme.palette.info.main,
          light: alpha(theme.palette.info.main, 0.15),
          dark: theme.palette.info.dark,
          gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.8)} 50%, ${theme.palette.info.dark} 100%)`,
        };
      case 'secondary': 
        return {
          main: theme.palette.secondary.main,
          light: alpha(theme.palette.secondary.main, 0.15),
          dark: theme.palette.secondary.dark,
          gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 50%, ${theme.palette.secondary.dark} 100%)`,
        };
      default: 
        return {
          main: theme.palette.primary.main,
          light: alpha(theme.palette.primary.main, 0.15),
          dark: theme.palette.primary.dark,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 50%, ${theme.palette.primary.dark} 100%)`,
        };
    }
  };

  const colorConfig = getColorConfig();

  if (loading) {
    return (
      <Box
        sx={{
          height: 160,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '60% 40% 40% 20% / 70% 50% 30% 25%',
            border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
          <Box textAlign="center">
            <Skeleton variant="text" width="50%" height={36} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="80%" height={12} sx={{ mx: 'auto' }} />
          </Box>
          <Box display="flex" justifyContent="center">
            <Skeleton variant="rectangular" width="50%" height={18} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 160,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${float} 6s ease-in-out infinite`,
        animationDelay: `${Math.random() * 2}s`, // Delay aleatorio para cada tarjeta
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(145deg, #1e293b 0%, #334155 100%)`
            : `linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)`,
          borderRadius: '60% 40% 40% 20% / 70% 50% 30% 25%', // Forma de nube orgánica
          border: `2px solid ${alpha(colorConfig.main, 0.2)}`,
          boxShadow: theme.palette.mode === 'dark'
            ? `0 8px 32px ${alpha(colorConfig.main, 0.15)}, inset 0 1px 0 ${alpha('#ffffff', 0.1)}`
            : `0 8px 32px ${alpha(colorConfig.main, 0.15)}, inset 0 1px 0 ${alpha('#ffffff', 0.8)}`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.03)',
            borderColor: colorConfig.main,
            boxShadow: theme.palette.mode === 'dark'
              ? `0 20px 40px ${alpha(colorConfig.main, 0.25)}, inset 0 1px 0 ${alpha('#ffffff', 0.2)}`
              : `0 20px 40px ${alpha(colorConfig.main, 0.25)}, inset 0 1px 0 ${alpha('#ffffff', 1)}`,
            animation: `${pulse} 2s ease-in-out infinite`,
            '& .cloud-icon': {
              transform: 'scale(1.2) rotate(10deg)',
              background: colorConfig.gradient,
              color: '#ffffff',
            },
            '& .cloud-value': {
              color: colorConfig.main,
              transform: 'scale(1.1)',
            },
            '& .cloud-glow': {
              opacity: 1,
              transform: 'scale(1.2)',
            }
          },
          // Efectos de brillo interno
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '30%',
            height: '20%',
            background: `radial-gradient(ellipse, ${alpha('#ffffff', theme.palette.mode === 'dark' ? 0.1 : 0.4)} 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          },
          // Partículas flotantes
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: '8px',
            height: '8px',
            background: alpha(colorConfig.main, 0.3),
            borderRadius: '50%',
            animation: `${float} 4s ease-in-out infinite reverse`,
            pointerEvents: 'none',
          }
        }}
      >
        {/* Efecto de brillo de fondo */}
        <Box
          className="cloud-glow"
          sx={{
            position: 'absolute',
            inset: -20,
            background: `radial-gradient(circle, ${alpha(colorConfig.main, 0.1)} 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: 0,
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />

        {/* Header con título e ícono */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '0.65rem',
              lineHeight: 1.2,
              flex: 1,
              textShadow: theme.palette.mode === 'dark' ? 'none' : `0 1px 2px ${alpha('#ffffff', 0.8)}`,
            }}
          >
            {title}
          </Typography>
          <Box
            className="cloud-icon"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: colorConfig.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colorConfig.main,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${alpha(colorConfig.main, 0.2)}`,
              border: `1px solid ${alpha(colorConfig.main, 0.2)}`,
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Valor principal centrado */}
        <Box textAlign="center" sx={{ my: 1 }}>
          <Typography 
            className="cloud-value"
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 900,
              fontFamily: 'Poppins, sans-serif',
              color: 'text.primary',
              lineHeight: 1,
              transition: 'all 0.3s ease',
              fontSize: '2rem',
              textShadow: theme.palette.mode === 'dark' 
                ? `0 2px 8px ${alpha(colorConfig.main, 0.3)}`
                : `0 2px 4px ${alpha('#000000', 0.1)}`,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.7rem',
                display: 'block',
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Indicador de tendencia flotante */}
        {trend && (
          <Box display="flex" justifyContent="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                background: trend.value >= 0 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.3)}`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 12px ${alpha(trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
              }}
            >
              {trend.value >= 0 ? (
                <ArrowUpward sx={{ fontSize: 14, color: 'success.main' }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 14, color: 'error.main' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{
                  fontWeight: 800,
                  color: trend.value >= 0 ? 'success.main' : 'error.main',
                  fontSize: '0.7rem',
                  textShadow: `0 1px 2px ${alpha('#ffffff', 0.8)}`,
                }}
              >
                {Math.abs(trend.value)}%
              </Typography>
            </Box>
          </Box>
        )}

        {/* Partículas decorativas adicionales */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: '4px',
            height: '4px',
            background: alpha(colorConfig.main, 0.4),
            borderRadius: '50%',
            animation: `${float} 5s ease-in-out infinite`,
            animationDelay: '1s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '6px',
            height: '6px',
            background: alpha(colorConfig.main, 0.2),
            borderRadius: '50%',
            animation: `${float} 7s ease-in-out infinite reverse`,
            animationDelay: '2s',
          }}
        />
      </Box>
    </Box>
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

  // Calcular métricas optimizadas
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
                <Stack spacing={1} mb={3}>
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
                    Gestiona la información clínica de tus pacientes de forma eficiente y organizada.
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
                      Exportar
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

            {/* Métricas en Forma de Nube */}
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
                    mb: 2
                  }}
                >
                  <CloudMetricCard
                    title="Total"
                    value={statsLoading ? '...' : stats?.total || 0}
                    subtitle="Pacientes registrados"
                    icon={<People sx={{ fontSize: 20 }} />}
                    color="primary"
                    loading={statsLoading}
                  />
                  <CloudMetricCard
                    title="Activos"
                    value={statsLoading ? '...' : stats?.active || 0}
                    subtitle={`${activePercentage}% del total`}
                    icon={<TrendingUp sx={{ fontSize: 20 }} />}
                    color="success"
                    trend={{ value: 12, label: 'este mes' }}
                    loading={statsLoading}
                  />
                  <CloudMetricCard
                    title="Profesionales"
                    value={psychologists.length}
                    subtitle="Psicólogos disponibles"
                    icon={<Psychology sx={{ fontSize: 20 }} />}
                    color="info"
                    loading={statsLoading}
                  />
                  <CloudMetricCard
                    title="Edad Media"
                    value={statsLoading ? '...' : `${averageAge}a`}
                    subtitle="Promedio general"
                    icon={<HealthAndSafety sx={{ fontSize: 20 }} />}
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