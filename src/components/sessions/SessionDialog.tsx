'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Session, SessionFormData, SESSION_TYPES, SESSION_STATUSES, SESSION_TYPE_LABELS, SESSION_STATUS_LABELS } from '@/types/session';
import { Patient } from '@/types/patient';
import { sessionFormSchema, validateNotesQuality, getSessionDurationSuggestion } from '@/lib/validations/session';
import { useSessionActions } from '@/hooks/useSessions';
import { usePatients } from '@/hooks/usePatients';
import { AIUtils } from '@/services/aiService';

interface SessionDialogProps {
  open: boolean;
  onClose: () => void;
  session?: Session | null;
  patientId?: string;
  onSuccess?: () => void;
}

export default function SessionDialog({
  open,
  onClose,
  session,
  patientId,
  onSuccess
}: SessionDialogProps) {
  const [notesQuality, setNotesQuality] = useState<{
    score: number;
    suggestions: string[];
  } | null>(null);

  const { createSession, updateSession, aiProcessing } = useSessionActions();
  const { patients } = usePatients();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      patientId: patientId || '',
      date: new Date().toISOString(),
      type: 'individual',
      status: 'completed',
      notes: '',
      duration: 50,
    }
  });

  const watchedType = watch('type');
  const watchedNotes = watch('notes');

  // Actualizar duración sugerida cuando cambia el tipo
  useEffect(() => {
    if (watchedType) {
      const suggestedDuration = getSessionDurationSuggestion(watchedType);
      setValue('duration', suggestedDuration);
    }
  }, [watchedType, setValue]);

  // Analizar calidad de las notas en tiempo real
  useEffect(() => {
    if (watchedNotes && watchedNotes.length > 10) {
      const quality = validateNotesQuality(watchedNotes);
      setNotesQuality(quality);
    } else {
      setNotesQuality(null);
    }
  }, [watchedNotes]);

  // Cargar datos de la sesión si estamos editando
  useEffect(() => {
    if (session) {
      reset({
        patientId: session.patientId,
        date: session.date,
        type: session.type,
        status: session.status,
        notes: session.notes,
        observations: session.observations || '',
        interventions: session.interventions || '',
        homework: session.homework || '',
        nextSessionPlan: session.nextSessionPlan || '',
        duration: session.duration || 50,
      });
    } else {
      reset({
        patientId: patientId || '',
        date: new Date().toISOString(),
        type: 'individual',
        status: 'completed',
        notes: '',
        duration: 50,
      });
    }
  }, [session, patientId, reset]);

  const onSubmit = async (data: SessionFormData) => {
    try {
      if (session) {
        await updateSession(session.id, data);
      } else {
        await createSession(data);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.fullName || 'Paciente no encontrado';
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PsychologyIcon color="primary" />
            <Typography variant="h6">
              {session ? 'Editar Sesión' : 'Nueva Sesión Clínica'}
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Información básica */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  Información Básica
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="patientId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.patientId}>
                      <InputLabel>Paciente</InputLabel>
                      <Select {...field} label="Paciente">
                        {patients.map((patient) => (
                          <MenuItem key={patient.id} value={patient.id}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PersonIcon fontSize="small" />
                              {patient.fullName}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.patientId && (
                        <Typography variant="caption" color="error">
                          {errors.patientId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Fecha y Hora"
                      value={new Date(field.value)}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Tipo de Sesión</InputLabel>
                      <Select {...field} label="Tipo de Sesión">
                        {SESSION_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {SESSION_TYPE_LABELS[type]}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.type && (
                        <Typography variant="caption" color="error">
                          {errors.type.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Estado</InputLabel>
                      <Select {...field} label="Estado">
                        {SESSION_STATUSES.map((status) => (
                          <MenuItem key={status} value={status}>
                            {SESSION_STATUS_LABELS[status]}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && (
                        <Typography variant="caption" color="error">
                          {errors.status.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Duración (minutos)"
                      type="number"
                      fullWidth
                      error={!!errors.duration}
                      helperText={errors.duration?.message}
                      inputProps={{ min: 15, max: 480 }}
                    />
                  )}
                />
              </Grid>

              {/* Notas clínicas */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotesIcon />
                  Notas Clínicas
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notas de la Sesión"
                      multiline
                      rows={6}
                      fullWidth
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                      placeholder="Describe el desarrollo de la sesión, observaciones del paciente, intervenciones realizadas..."
                    />
                  )}
                />
                
                {/* Indicador de calidad de notas */}
                {notesQuality && (
                  <Box mt={2}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="body2">
                        Calidad de las notas:
                      </Typography>
                      <Chip 
                        label={`${notesQuality.score}/100`}
                        color={getQualityColor(notesQuality.score)}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={notesQuality.score} 
                      color={getQualityColor(notesQuality.score)}
                      sx={{ mb: 1 }}
                    />
                    {notesQuality.suggestions.length > 0 && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          Sugerencias para mejorar:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {notesQuality.suggestions.map((suggestion, index) => (
                            <li key={index}>
                              <Typography variant="body2">{suggestion}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Alert>
                    )}
                  </Box>
                )}
              </Grid>

              {/* Secciones adicionales */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Información Adicional</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Controller
                          name="observations"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Observaciones Adicionales"
                              multiline
                              rows={3}
                              fullWidth
                              placeholder="Observaciones sobre el comportamiento, estado de ánimo, etc."
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="interventions"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Intervenciones Realizadas"
                              multiline
                              rows={3}
                              fullWidth
                              placeholder="Técnicas, estrategias o intervenciones específicas utilizadas..."
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="homework"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Tareas para Casa"
                              multiline
                              rows={3}
                              fullWidth
                              placeholder="Ejercicios o actividades asignadas al paciente..."
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="nextSessionPlan"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Plan para Próxima Sesión"
                              multiline
                              rows={3}
                              fullWidth
                              placeholder="Objetivos y plan para la siguiente sesión..."
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Información de IA */}
              {session?.aiAnalysis && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Análisis de IA disponible
                    </Typography>
                    <Typography variant="body2">
                      Esta sesión cuenta con análisis automático generado por IA. 
                      Confianza: {AIUtils.formatConfidence(session.aiAnalysis.confidence)}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {/* Indicador de procesamiento de IA */}
              {aiProcessing && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Box display="flex" alignItems="center" gap={2}>
                      <CircularProgress size={20} />
                      <Typography variant="body2">
                        Procesando análisis de IA... Esto puede tomar unos momentos.
                      </Typography>
                    </Box>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Guardando...' : (session ? 'Actualizar' : 'Crear Sesión')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
