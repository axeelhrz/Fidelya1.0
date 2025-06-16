'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Button,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Person,
  Edit,
  CalendarToday,
  Psychology,
  Phone,
  Email,
  LocationOn,
  Warning,
  EventNote,
  ArrowBack,
} from '@mui/icons-material';
import { Patient, EMOTIONAL_STATE_COLORS, GENDER_LABELS } from '@/types/patient';
import { User } from '@/types/auth';
import { format, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientViewProps {
  patient: Patient | null;
  psychologists: User[];
  loading: boolean;
  error: Error | null;
  onEdit: () => void;
  onBack: () => void;
}

export default function PatientView({
  patient,
  psychologists,
  loading,
  error,
  onEdit,
  onBack
}: PatientViewProps) {
  const getPsychologist = (uid: string) => {
    return psychologists.find(p => p.uid === uid);
  };

  if (loading) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={200} height={32} />
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                {[...Array(6)].map((_, i) => (
                  <Box key={i} display="flex" justifyContent="space-between" mb={2}>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={180} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar el paciente: {error.message}
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert severity="info">
        Paciente no encontrado
      </Alert>
    );
  }

  const psychologist = getPsychologist(patient.assignedPsychologist);
  const age = patient.age || differenceInYears(new Date(), new Date(patient.birthDate));

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {patient.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {age} años • {GENDER_LABELS[patient.gender]}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={onEdit}
        >
          Editar Paciente
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Información Principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Información Personal
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {patient.fullName}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Fecha de Nacimiento
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: es })} ({age} años)
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Género
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {GENDER_LABELS[patient.gender]}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Estado Emocional Actual
                    </Typography>
                    <Chip
                      label={patient.emotionalState}
                      sx={{
                        bgcolor: EMOTIONAL_STATE_COLORS[patient.emotionalState],
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Información Clínica */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Información Clínica
              </Typography>
              
              <Box mb={3}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Motivo de Consulta
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {patient.motivoConsulta}
                  </Typography>
                </Paper>
              </Box>

              {patient.observaciones && (
                <Box mb={3}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Observaciones Iniciales
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1">
                      {patient.observaciones}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Fecha de Alta
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(patient.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Estado del Paciente
                    </Typography>
                    <Chip
                      label={
                        patient.status === 'active' ? 'Activo' :
                        patient.status === 'inactive' ? 'Inactivo' : 'Dado de alta'
                      }
                      color={
                        patient.status === 'active' ? 'success' :
                        patient.status === 'inactive' ? 'warning' : 'default'
                      }
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Historial de Sesiones (Placeholder) */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Historial de Sesiones
              </Typography>
              <Alert severity="info">
                El historial de sesiones se mostrará aquí una vez implementado el módulo de sesiones.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} md={4}>
          {/* Psicólogo Asignado */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Psicólogo Asignado
              </Typography>
              
              {psychologist ? (
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                    <Psychology />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {psychologist.displayName}
                    </Typography>
                    {psychologist.specialization && (
                      <Typography variant="body2" color="text.secondary">
                        {psychologist.specialization}
                      </Typography>
                    )}
                    {psychologist.email && (
                      <Typography variant="caption" color="text.secondary">
                        {psychologist.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : (
                <Alert severity="warning">
                  No hay psicólogo asignado
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Próxima Sesión */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Próxima Sesión
              </Typography>
              
              {patient.nextSession ? (
                <Box display="flex" alignItems="center">
                  <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {format(new Date(patient.nextSession), 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(patient.nextSession), 'EEEE', { locale: es })}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">
                  No hay sesión programada
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Alertas Clínicas (Placeholder) */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Alertas Clínicas
              </Typography>
              
              <Alert severity="info">
                Las alertas clínicas se mostrarán aquí una vez implementado el módulo de alertas.
              </Alert>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                Acciones Rápidas
              </Typography>
              
              <List dense>
                <ListItem button>
                  <ListItemIcon>
                    <EventNote color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nueva Sesión"
                    secondary="Programar sesión"
                  />
                </ListItem>
                
                <ListItem button>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Crear Alerta"
                    secondary="Añadir alerta clínica"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
