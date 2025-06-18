'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Alert,
  Snackbar,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PatientView from '@/components/patients/PatientView';
import PatientDialog from '@/components/patients/PatientDialog';
import { usePatient } from '@/hooks/usePatients';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/auth';
import { FirestoreService } from '@/services/firestore';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = params.id as string;
  
  const [psychologists, setPsychologists] = useState<User[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { patient, loading, error } = usePatient(patientId);

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

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleBack = () => {
    router.push('/dashboard/patients');
  };

  const handleEditSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Paciente actualizado correctamente',
      severity: 'success'
    });
    // El hook usePatient se actualizará automáticamente
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <PatientView
          patient={patient}
          psychologists={psychologists}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onBack={handleBack}
        />

        {/* Diálogo de edición */}
        <PatientDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
          patient={patient}
          psychologists={psychologists}
        />

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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
