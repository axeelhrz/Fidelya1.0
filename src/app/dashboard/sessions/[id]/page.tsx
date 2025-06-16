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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SessionView from '@/components/sessions/SessionView';
import SessionDialog from '@/components/sessions/SessionDialog';

import { Patient } from '@/types/patient';
import { User } from '@/types/auth';
import { useSession, useSessionActions } from '@/hooks/useSessions';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [professional, setProfessional] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loadingRelatedData, setLoadingRelatedData] = useState(true);

  const { session, loading, error } = useSession(sessionId);
  const { reprocessWithAI, aiProcessing } = useSessionActions();

  // Cargar datos relacionados cuando se carga la sesión
  useEffect(() => {
    const loadRelatedData = async () => {
      if (!session || !user?.centerId) return;

      setLoadingRelatedData(true);
      try {
        // Cargar paciente
        const patientData = await FirestoreService.getPatient(user.centerId, session.patientId);
        setPatient(patientData);

        // Cargar profesional
        const professionalData = await FirestoreService.getUser(session.professionalId);
        setProfessional(professionalData);
      } catch (error) {
        console.error('Error loading related data:', error);
      } finally {
        setLoadingRelatedData(false);
      }
    };

    loadRelatedData();
  }, [session, user?.centerId]);

  const handleBack = () => {
    router.push('/dashboard/sessions');
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleReprocessAI = async () => {
    if (!session) return;
    
    try {
      await reprocessWithAI(session.id, session.notes);
      // La sesión se actualizará automáticamente a través del hook
    } catch (error) {
      console.error('Error reprocessing AI:', error);
    }
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    // Los datos se actualizarán automáticamente a través del hook
  };

  if (loading || loadingRelatedData) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            {/* Breadcrumbs skeleton */}
            <Box mb={2}>
              <Skeleton variant="text" width={300} height={24} />
            </Box>

            {/* Header skeleton */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={150} height={20} />
              </Box>
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>

            {/* Content skeleton */}
            <Box>
              {[...Array(3)].map((_, index) => (
                <Box key={index} mb={2}>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                </Box>
              ))}
            </Box>
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar la sesión: {error.message}
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Volver a Sesiones
            </Button>
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!session) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            <Alert severity="warning" sx={{ mb: 3 }}>
              No se encontró la sesión solicitada.
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Volver a Sesiones
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
              onClick={handleBack}
              sx={{ textDecoration: 'none' }}
            >
              Sesiones
            </Link>
            <Typography variant="body2" color="text.primary">
              {patient?.fullName || 'Sesión'}
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Detalle de Sesión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {patient?.fullName} • {new Date(session.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
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
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Editar
              </Button>
            </Box>
          </Box>

          {/* Session View Component */}
          <SessionView
            open={true}
            onClose={() => {}} // No se cierra desde aquí
            session={session}
            patient={patient}
            professional={professional}
            onEdit={handleEdit}
            onReprocessAI={handleReprocessAI}
            aiProcessing={aiProcessing}
          />

          {/* Edit Dialog */}
          <SessionDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            session={session}
            onSuccess={handleEditSuccess}
          />
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
