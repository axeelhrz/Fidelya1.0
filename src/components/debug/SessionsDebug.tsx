'use client';

import React from 'react';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useSessions } from '@/hooks/useSessions';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/context/AuthContext';

export default function SessionsDebug() {
  const { user } = useAuth();
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();
  const { patients, loading: patientsLoading, error: patientsError } = usePatients();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Debug de Sesiones
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Usuario:</Typography>
        <Typography variant="body2">
          {user ? `${user.displayName} (${user.uid}) - Centro: ${user.centerId}` : 'No autenticado'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Estado de Sesiones:</Typography>
        <Typography variant="body2">
          Loading: {sessionsLoading ? 'Sí' : 'No'} | 
          Error: {sessionsError ? sessionsError.message : 'Ninguno'} | 
          Cantidad: {sessions.length}
        </Typography>
        {sessionsLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        {sessionsError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Error en sesiones: {sessionsError.message}
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Estado de Pacientes:</Typography>
        <Typography variant="body2">
          Loading: {patientsLoading ? 'Sí' : 'No'} | 
          Error: {patientsError ? patientsError.message : 'Ninguno'} | 
          Cantidad: {patients.length}
        </Typography>
        {patientsLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        {patientsError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Error en pacientes: {patientsError.message}
          </Alert>
        )}
      </Box>

      {sessions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Primeras 3 sesiones:</Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
            {JSON.stringify(sessions.slice(0, 3), null, 2)}
          </pre>
        </Box>
      )}

      {patients.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Primeros 3 pacientes:</Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
            {JSON.stringify(patients.slice(0, 3), null, 2)}
          </pre>
        </Box>
      )}
    </Paper>
  );
}
