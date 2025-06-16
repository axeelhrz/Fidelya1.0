'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SessionsTable from '@/components/sessions/SessionsTable';
import SessionFilters from '@/components/sessions/SessionFilters';
import SessionDialog from '@/components/sessions/SessionDialog';
import SessionView from '@/components/sessions/SessionView';

import { Session, SessionFilters as SessionFiltersType } from '@/types/session';
import { Patient } from '@/types/patient';
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
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function SessionsPage() {
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
    } catch (error) {
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
    } catch (error) {
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

  // Calcular estadísticas básicas
  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    withAI: sessions.filter(s => s.aiAnalysis).length,
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Box>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Sesiones Clínicas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona y analiza las sesiones psicológicas con inteligencia artificial
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSession}
              size="large"
            >
              Nueva Sesión
            </Button>
          </Box>

          {/* Estadísticas */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total de Sesiones"
                value={stats.total}
                icon={<PsychologyIcon sx={{ fontSize: 40 }} />}
                color="primary.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completadas"
                value={stats.completed}
                icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
                color="success.main"
                subtitle={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% del total`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Programadas"
                value={stats.scheduled}
                icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
                color="info.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Con Análisis IA"
                value={stats.withAI}
                icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
                color="secondary.main"
                subtitle={`${stats.total > 0 ? Math.round((stats.withAI / stats.total) * 100) : 0}% analizadas`}
              />
            </Grid>
          </Grid>

          {/* Filtros */}
          <Box mb={3}>
            <SessionFilters
              filters={filters}
              onFiltersChange={setFilters}
              patients={patients}
              professionals={professionals}
              loading={loading}
            />
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar las sesiones: {error.message}
            </Alert>
          )}

          {/* Tabla de sesiones */}
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
          >
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.
                {sessionToDelete?.aiAnalysis && (
                  <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: 'warning.main' }}>
                    Esta sesión incluye análisis de IA que también se perderá.
                  </Box>
                )}
              </DialogContentText>
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
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para notificaciones */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            <Alert 
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
              severity={snackbar.severity}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
