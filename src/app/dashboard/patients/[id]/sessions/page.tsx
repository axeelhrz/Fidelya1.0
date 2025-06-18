'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SessionsTable from '@/components/sessions/SessionsTable';
import SessionDialog from '@/components/sessions/SessionDialog';
import SessionView from '@/components/sessions/SessionView';

import { Session, EMOTIONAL_TONE_COLORS } from '@/types/session';
import { User } from '@/types/auth';
import { usePatientSessions } from '@/hooks/useSessions';
import { usePatient } from '@/hooks/usePatients';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';

export default function PatientSessionsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = params.id as string;

  const [professionals, setProfessionals] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { patient, loading: patientLoading, error: patientError } = usePatient(patientId);
  const { sessions, loading: sessionsLoading, error: sessionsError, refresh } = usePatientSessions(patientId);

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

  const handleBack = () => {
    router.push(`/dashboard/patients/${patientId}`);
  };

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

  const handleDialogSuccess = () => {
    refresh();
  };

  const getSelectedProfessional = () => {
    if (!selectedSession) return null;
    return professionals.find(p => p.uid === selectedSession.professionalId) || null;
  };

  // Calcular estadísticas del paciente
  const patientStats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    withAI: sessions.filter(s => s.aiAnalysis).length,
    lastSession: sessions.length > 0 ? sessions[0] : null,
    emotionalProgress: sessions
      .filter(s => s.aiAnalysis?.emotionalTone)
      .slice(0, 5)
      .reverse()
  };

  if (patientLoading || sessionsLoading) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            <Skeleton variant="text" width={300} height={24} sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Skeleton variant="text" width={250} height={32} />
                <Skeleton variant="text" width={200} height={20} />
              </Box>
              <Skeleton variant="rectangular" width={150} height={36} />
            </Box>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
            ))}
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (patientError || sessionsError) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar los datos: {(patientError || sessionsError)?.message}
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Volver al Paciente
            </Button>
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!patient) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            <Alert severity="warning" sx={{ mb: 3 }}>
              No se encontró el paciente solicitado.
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/patients')}
            >
              Volver a Pacientes
            </Button>
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Box>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/dashboard/patients')}
              sx={{ textDecoration: 'none' }}
            >
              Pacientes
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={handleBack}
              sx={{ textDecoration: 'none' }}
            >
              {patient.fullName}
            </Link>
            <Typography variant="body2" color="text.primary">
              Sesiones
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Historial de Sesiones
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {patient.fullName} • {patient.age} años
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateSession}
              >
                Nueva Sesión
              </Button>
            </Box>
          </Box>

          {/* Resumen del paciente */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 3,
              alignItems: 'stretch'
            }}
          >
            {/* Información principal del paciente */}
            <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PsychologyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{patient.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estado emocional actual: {patient.emotionalState}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* Estadísticas del paciente */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-around',
                      textAlign: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {patientStats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total de sesiones
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {patientStats.completed}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completadas
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" color="secondary.main" fontWeight="bold">
                        {patientStats.withAI}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Con análisis IA
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Progreso emocional */}
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Progreso Emocional
                  </Typography>
                  
                  {patientStats.emotionalProgress.length > 0 ? (
                    <Box>
                      {patientStats.emotionalProgress.map((session) => (
                        <Box key={session.id} display="flex" alignItems="center" gap={1} mb={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: session.aiAnalysis?.emotionalTone 
                                ? EMOTIONAL_TONE_COLORS[session.aiAnalysis.emotionalTone]
                                : 'grey.400'
                            }}
                          />
                          <Typography variant="body2">
                            {format(new Date(session.date), 'dd/MM', { locale: es })}
                          </Typography>
                          <Chip
                            label={session.aiAnalysis?.emotionalTone || 'Sin análisis'}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay datos de progreso emocional disponibles
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Tabla de sesiones */}
          <SessionsTable
            sessions={sessions}
            patients={[patient]}
            professionals={professionals}
            loading={sessionsLoading}
            error={sessionsError}
            onEdit={handleEditSession}
            onView={handleViewSession}
          />

          {/* Diálogo de creación/edición */}
          <SessionDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            session={selectedSession}
            patientId={patientId}
            onSuccess={handleDialogSuccess}
          />

          {/* Diálogo de vista detallada */}
          <SessionView
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            session={selectedSession}
            patient={patient}
            professional={getSelectedProfessional()}
            onEdit={() => {
              setViewDialogOpen(false);
              setDialogOpen(true);
            }}
          />
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}