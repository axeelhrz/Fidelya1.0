'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Patient, 
  PatientFormData, 
  EMOTIONAL_STATES, 
  GENDERS, 
  GENDER_LABELS,
  EMOTIONAL_STATE_COLORS 
} from '@/types/patient';
import { User } from '@/types/auth';
import { patientSchema } from '@/lib/validations/patient';
import { usePatientActions } from '@/hooks/usePatients';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient?: Patient | null;
  psychologists: User[];
}

export default function PatientDialog({
  open,
  onClose,
  onSuccess,
  patient,
  psychologists
}: PatientDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { createPatient, updatePatient, loading } = usePatientActions();

  const isEditing = !!patient;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      gender: 'M',
      emotionalState: 'Estable',
      motivoConsulta: '',
      observaciones: '',
      assignedPsychologist: '',
      nextSession: '',
    }
  });

  const selectedEmotionalState = watch('emotionalState');

  useEffect(() => {
    if (patient && isEditing) {
      reset({
        fullName: patient.fullName,
        birthDate: patient.birthDate,
        gender: patient.gender,
        emotionalState: patient.emotionalState,
        motivoConsulta: patient.motivoConsulta,
        observaciones: patient.observaciones || '',
        assignedPsychologist: patient.assignedPsychologist,
        nextSession: patient.nextSession || '',
      });
    } else {
      reset({
        fullName: '',
        birthDate: '',
        gender: 'M',
        emotionalState: 'Estable',
        motivoConsulta: '',
        observaciones: '',
        assignedPsychologist: '',
        nextSession: '',
      });
    }
  }, [patient, isEditing, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      setSubmitError(null);
      
      if (isEditing && patient) {
        await updatePatient(patient.id, data);
      } else {
        await createPatient(data);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al guardar el paciente');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSubmitError(null);
      onClose();
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear() - 
      (today.getMonth() < birth.getMonth() || 
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
    return age;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing ? 'Modifica los datos del paciente' : 'Completa la información del nuevo paciente'}
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Información Personal */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Personal
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre Completo"
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel>Género</InputLabel>
                      <Select
                        {...field}
                        label="Género"
                        disabled={loading}
                      >
                        {GENDERS.map((gender) => (
                          <MenuItem key={gender} value={gender}>
                            {GENDER_LABELS[gender]}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gender && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.gender.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Fecha de Nacimiento"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                      disabled={loading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.birthDate,
                          helperText: errors.birthDate?.message,
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <Typography variant="body1">
                    Edad: {watch('birthDate') ? calculateAge(watch('birthDate')) : '--'} años
                  </Typography>
                </Box>
              </Grid>

              {/* Información Clínica */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Información Clínica
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="emotionalState"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.emotionalState}>
                      <InputLabel>Estado Emocional</InputLabel>
                      <Select
                        {...field}
                        label="Estado Emocional"
                        disabled={loading}
                      >
                        {EMOTIONAL_STATES.map((state) => (
                          <MenuItem key={state} value={state}>
                            <Box display="flex" alignItems="center">
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: EMOTIONAL_STATE_COLORS[state],
                                  mr: 1
                                }}
                              />
                              {state}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.emotionalState && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.emotionalState.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <Chip
                    label={selectedEmotionalState}
                    sx={{
                      bgcolor: EMOTIONAL_STATE_COLORS[selectedEmotionalState],
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="motivoConsulta"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Motivo de Consulta"
                      multiline
                      rows={3}
                      error={!!errors.motivoConsulta}
                      helperText={errors.motivoConsulta?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="observaciones"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Observaciones Iniciales"
                      multiline
                      rows={3}
                      error={!!errors.observaciones}
                      helperText={errors.observaciones?.message}
                      disabled={loading}
                      placeholder="Observaciones adicionales sobre el paciente..."
                    />
                  )}
                />
              </Grid>

              {/* Asignación y Programación */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Asignación y Programación
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="assignedPsychologist"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.assignedPsychologist}>
                      <InputLabel>Psicólogo Asignado</InputLabel>
                      <Select
                        {...field}
                        label="Psicólogo Asignado"
                        disabled={loading}
                      >
                        {psychologists.map((psychologist) => (
                          <MenuItem key={psychologist.uid} value={psychologist.uid}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {psychologist.displayName}
                              </Typography>
                              {psychologist.specialization && (
                                <Typography variant="caption" color="text.secondary">
                                  {psychologist.specialization}
                                </Typography>
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.assignedPsychologist && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.assignedPsychologist.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="nextSession"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Próxima Sesión (Opcional)"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                      disabled={loading}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.nextSession,
                          helperText: errors.nextSession?.message,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Paciente')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
