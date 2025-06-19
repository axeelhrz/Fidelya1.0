'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  Paper,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  SmartToy as SmartToyIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SessionsTable from '@/components/sessions/SessionsTable';
import SessionFilters from '@/components/sessions/SessionFilters';
import SessionDialog from '@/components/sessions/SessionDialog';
import SessionView from '@/components/sessions/SessionView';

import { Session, SessionFilters as SessionFiltersType } from '@/types/session';
import { User } from '@/types/auth';
import { useSessions, useSessionActions } from '@/hooks/useSessions';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon, color, subtitle, trend }: StatCardProps) {
  const theme = useTheme();
  
  return (
    <Fade in timeout={600}>
      <Paper 
        sx={{ 
          height: '100%',
          p: 3,
          borderRadius: 'xl',
          background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
          border: `1px solid ${alpha(color, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 25px -5px ${alpha(color, 0.1)}, 0 8px 10px -6px ${alpha(color, 0.1)}`,
            border: `1px solid ${alpha(color, 0.2)}`,
          }
        }}
      >
        <Stack spacing={2} height="100%">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                p: 1.5,
                borderRadius: 'xl',
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
            {trend && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 'xl',
                  bgcolor: trend.isPositive ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                  color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Box>
            )}
          </Box>
          
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              color={color}
              sx={{ 
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.primary" 
              fontWeight={600}
              sx={{ mt: 0.5 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );
}

export default function SessionsPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [filters, setFilters] = useState<SessionFiltersType>({});
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { sessions, loading, error, refresh } = useSessions(filters);
  const { patients } = usePatients();
  const { deleteSession, reprocessWithAI, loading: actionLoading, aiProcessing } = useSessionActions();

  // Cargar profesionales del centro
  useEffect(() => {
    const loadProfessionals = async () => {
      if (!user?.centerId) return;
      
      try {
        const centerUsers = await FirestoreService.getCenterUsers(user.centerId);
        const professionalUsers = centerUsers.filter(u => 
          u.role === 'psychologist' || u.role === 'admin'
        );
        setProfessionals(professionalUsers);
      } catch (error) {
        console.error('Error loading professionals:', error);
      }
    };

    loadProfessionals();
  }, [user?.centerId]);

  const handleCreateSession = () => {
    setSelectedSession(null);
    setDialogOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setViewDialogOpen(true);
  };

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const handleReprocessAI = async (session: Session) => {
    try {
      await reprocessWithAI(session.id, session.notes);
      setSnackbar({
        open: true,
        message: 'Análisis de IA reprocesado correctamente',
        severity: 'success'
      });
      refresh();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al reprocesar el análisis de IA',
        severity: 'error'
      });
    }
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteSession(sessionToDelete.id);
      setSnackbar({
        open: true,
        message: 'Sesión eliminada correctamente',
        severity: 'success'
      });
      refresh();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al eliminar la sesión',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleDialogSuccess = () => {
    setSnackbar({
      open: true,
      message: selectedSession ? 'Sesión actualizada correctamente' : 'Sesión creada correctamente',
      severity: 'success'
    });
    refresh();
  };

  const getSelectedPatient = () => {
    if (!selectedSession) return null;
    return patients.find(p => p.id === selectedSession.patientId) || null;
  };

  const getSelectedProfessional = () => {
    if (!selectedSession) return null;
    return professionals.find(p => p.uid === selectedSession.professionalId) || null;
  };

  // Calcular estadísticas avanzadas
  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    withAI: sessions.filter(s => s.aiAnalysis).length,
    thisWeek: sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return sessionDate >= weekStart;
    }).length,
    averageDuration: sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + (s.duration || 50), 0) / sessions.length)
      : 0,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const aiCoverage = stats.total > 0 ? Math.round((stats.withAI / stats.total) * 100) : 0;

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
          <Stack spacing={4}>
            {/* Encabezado profesional */}
            <Fade in timeout={400}>
              <Box>
                <Stack spacing={2}>
                  <Typography 
                    variant="h5" 
                    fontWeight={600}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Sesiones Clínicas
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ maxWidth: 600 }}
                  >
                    Registro estructurado, análisis automático y evolución emocional por paciente.
                  </Typography>
                </Stack>

                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mt={3}
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                  }}
                >
                  <Box />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateSession}
                    size="large"
                    sx={{
                      borderRadius: 'xl',
                      px: 4,
                      py: 1.5,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }
                    }}
                  >
                    Nueva Sesión
                  </Button>
                </Box>
              </Box>
            </Fade>

            {/* Estadísticas visuales */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                '& > *': {
                  flex: '1 1 280px',
                  minWidth: '280px'
                }
              }}
            >
              <StatCard
                title="Total de Sesiones"
                value={stats.total}
                icon={<PsychologyIcon sx={{ fontSize: 28 }} />}
                color={theme.palette.primary.main}
                subtitle={`${stats.thisWeek} esta semana`}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Tasa de Completitud"
                value={`${completionRate}%`}
                icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                color={theme.palette.success.main}
                subtitle={`${stats.completed} completadas`}
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                title="Sesiones Programadas"
                value={stats.scheduled}
                icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
                color={theme.palette.info.main}
                subtitle="Próximas citas"
              />
              <StatCard
                title="Análisis con IA"
                value={`${aiCoverage}%`}
                icon={<SmartToyIcon sx={{ fontSize: 28 }} />}
                color={theme.palette.secondary.main}
                subtitle={`${stats.withAI} analizadas`}
                trend={{ value: 15, isPositive: true }}
              />
              <StatCard
                title="Duración Promedio"
                value={`${stats.averageDuration} min`}
                icon={<AssessmentIcon sx={{ fontSize: 28 }} />}
                color={theme.palette.warning.main}
                subtitle="Por sesión"
              />
            </Box>

            {/* Filtros avanzados */}
            <Fade in timeout={800}>
              <Box>
                <SessionFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  patients={patients}
                  professionals={professionals}
                  loading={loading}
                />
              </Box>
            </Fade>

            {/* Error */}
            {error && (
              <Fade in timeout={600}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 'xl',
                    '& .MuiAlert-message': {
                      fontWeight: 500
                    }
                  }}
                >
                  Error al cargar las sesiones: {error.message}
                </Alert>
              </Fade>
            )}

            {/* Tabla de sesiones */}
            <Fade in timeout={1000}>
              <Paper 
                sx={{ 
                  borderRadius: 'xl',
                  overflow: 'hidden',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <SessionsTable
                  sessions={sessions}
                  patients={patients}
                  professionals={professionals}
                  loading={loading}
                  error={error}
                  onEdit={handleEditSession}
                  onView={handleViewSession}
                  onDelete={handleDeleteSession}
                  onReprocessAI={handleReprocessAI}
                />
              </Paper>
            </Fade>

            {/* Diálogo de creación/edición */}
            <SessionDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              session={selectedSession}
              onSuccess={handleDialogSuccess}
            />

            {/* Diálogo de vista detallada */}
            <SessionView
              open={viewDialogOpen}
              onClose={() => setViewDialogOpen(false)}
              session={selectedSession}
              patient={getSelectedPatient()}
              professional={getSelectedProfessional()}
              onEdit={() => {
                setViewDialogOpen(false);
                setDialogOpen(true);
              }}
              onReprocessAI={() => handleReprocessAI(selectedSession!)}
              aiProcessing={aiProcessing}
            />

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              PaperProps={{
                sx: {
                  borderRadius: 'xl',
                  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                  backdropFilter: 'blur(20px)',
                }
              }}
            >
              <DialogTitle sx={{ fontWeight: 600 }}>
                Confirmar Eliminación
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: 'text.primary' }}>
                  ¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.
                  {sessionToDelete?.aiAnalysis && (
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'block', 
                        mt: 2, 
                        p: 2,
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                        fontWeight: 600,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                      }}
                    >
                      ⚠️ Esta sesión incluye análisis de IA que también se perderá.
                    </Box>
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button 
                  onClick={() => setDeleteDialogOpen(false)}
                  sx={{ borderRadius: 'xl', px: 3 }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmDelete} 
                  color="error" 
                  variant="contained"
                  disabled={actionLoading}
                  sx={{ 
                    borderRadius: 'xl', 
                    px: 3,
                    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${alpha(theme.palette.error.main, 0.8)} 100%)`,
                  }}
                >
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>

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
                sx={{ 
                  borderRadius: 'xl',
                  fontWeight: 500,
                  '& .MuiAlert-icon': {
                    fontSize: '1.25rem'
                  }
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
