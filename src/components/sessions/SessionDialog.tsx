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
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Paper,
  Stack,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  Close as CloseIcon,
  SmartToy as SmartToyIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Session, SessionFormData, SESSION_TYPES, SESSION_STATUSES, SESSION_TYPE_LABELS, SESSION_STATUS_LABELS } from '@/types/session';
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
  const theme = useTheme();
  const [notesQuality, setNotesQuality] = useState<{
    score: number;
    suggestions: string[];
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'notes']);

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
      setExpandedSections(['basic', 'notes', 'additional']);
    } else {
      reset({
        patientId: patientId || '',
        date: new Date().toISOString(),
        type: 'individual',
        status: 'completed',
        notes: '',
        duration: 50,
      });
      setExpandedSections(['basic', 'notes']);
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

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { 
            minHeight: '80vh',
            borderRadius: 'xl',
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 0,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              color: theme.palette.primary.contrastText,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {session ? 'Editar Sesión Clínica' : 'Nueva Sesión Clínica'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Registro estructurado con análisis automático de IA
                  </Typography>
                </Box>
              </Stack>
              <IconButton 
                onClick={onClose} 
                sx={{ 
                  color: theme.palette.primary.contrastText,
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.2) }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Paper>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={0}>
              {/* Información básica */}
              <Accordion 
                expanded={expandedSections.includes('basic')}
                onChange={() => handleSectionToggle('basic')}
                sx={{ 
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    px: 4, 
                    py: 2,
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    >
                      <ScheduleIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Información Básica
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 4, pb: 4 }}>
                  <Stack spacing={3}>
                    {/* Primera fila: Paciente y Fecha */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        '& > *': {
                          flex: '1 1 300px',
                          minWidth: '300px'
                        }
                      }}
                    >
                      <Controller
                        name="patientId"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.patientId} fullWidth>
                            <InputLabel>Paciente</InputLabel>
                            <Select 
                              {...field} 
                              label="Paciente"
                              sx={{ borderRadius: 'xl' }}
                            >
                              {patients.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <PersonIcon fontSize="small" color="primary" />
                                    <Box>
                                      <Typography variant="body2" fontWeight={500}>
                                        {patient.fullName}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {patient.age} años • {patient.emotionalState}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.patientId && (
                              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                {errors.patientId.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />

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
                                error: !!errors.date,
                                helperText: errors.date?.message,
                                sx: { 
                                  '& .MuiOutlinedInput-root': { 
                                    borderRadius: 'xl' 
                                  }
                                }
                              }
                            }}
                          />
                        )}
                      />
                    </Box>

                    {/* Segunda fila: Tipo, Estado y Duración */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        '& > *': {
                          flex: '1 1 200px',
                          minWidth: '200px'
                        }
                      }}
                    >
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.type} fullWidth>
                            <InputLabel>Tipo de Sesión</InputLabel>
                            <Select 
                              {...field} 
                              label="Tipo de Sesión"
                              sx={{ borderRadius: 'xl' }}
                            >
                              {SESSION_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {SESSION_TYPE_LABELS[type]}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.type && (
                              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                {errors.type.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.status} fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select 
                              {...field} 
                              label="Estado"
                              sx={{ borderRadius: 'xl' }}
                            >
                              {SESSION_STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                  {SESSION_STATUS_LABELS[status]}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.status && (
                              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                {errors.status.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Duración (minutos)"
                            type="number"
                            error={!!errors.duration}
                            helperText={errors.duration?.message}
                            inputProps={{ min: 15, max: 480 }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 'xl' 
                              }
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Notas clínicas */}
              <Accordion 
                expanded={expandedSections.includes('notes')}
                onChange={() => handleSectionToggle('notes')}
                sx={{ 
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    px: 4, 
                    py: 2,
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    >
                      <NotesIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Notas Clínicas
                    </Typography>
                    {notesQuality && (
                      <Chip 
                        label={`Calidad: ${notesQuality.score}/100`}
                        color={getQualityColor(notesQuality.score)}
                        size="small"
                        sx={{ borderRadius: 'xl' }}
                      />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 4, pb: 4 }}>
                  <Stack spacing={3}>
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Notas de la Sesión"
                          multiline
                          rows={8}
                          fullWidth
                          error={!!errors.notes}
                          helperText={errors.notes?.message}
                          placeholder="Describe el desarrollo de la sesión, observaciones del paciente, intervenciones realizadas, evolución emocional, temas tratados..."
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 'xl' 
                            }
                          }}
                        />
                      )}
                    />
                    
                    {/* Indicador de calidad de notas */}
                    {notesQuality && (
                      <Paper 
                        sx={{ 
                          p: 3, 
                          borderRadius: 'xl',
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                        }}
                      >
                        <Stack spacing={2}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight={600}>
                              Análisis de Calidad de Notas
                            </Typography>
                            <Chip 
                              label={`${notesQuality.score}/100`}
                              color={getQualityColor(notesQuality.score)}
                              size="small"
                              sx={{ borderRadius: 'xl', fontWeight: 600 }}
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={notesQuality.score} 
                            color={getQualityColor(notesQuality.score)}
                            sx={{ 
                              height: 8, 
                              borderRadius: 'xl',
                              bgcolor: alpha(theme.palette.grey[300], 0.3)
                            }}
                          />
                          {notesQuality.suggestions.length > 0 && (
                            <Alert 
                              severity="info" 
                              sx={{ 
                                borderRadius: 'xl',
                                '& .MuiAlert-message': {
                                  width: '100%'
                                }
                              }}
                            >
                              <Typography variant="body2" fontWeight={600} gutterBottom>
                                Sugerencias para mejorar:
                              </Typography>
                              <Stack spacing={1} sx={{ mt: 1 }}>
                                {notesQuality.suggestions.map((suggestion, index) => (
                                  <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Box component="span" sx={{ mr: 1, color: 'info.main' }}>•</Box>
                                    {suggestion}
                                  </Typography>
                                ))}
                              </Stack>
                            </Alert>
                          )}
                        </Stack>
                      </Paper>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Información adicional */}
              <Accordion 
                expanded={expandedSections.includes('additional')}
                onChange={() => handleSectionToggle('additional')}
                sx={{ 
                  boxShadow: 'none',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    px: 4, 
                    py: 2,
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                      }}
                    >
                      <AssignmentIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Información Adicional
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 4, pb: 4 }}>
                  <Stack spacing={3}>
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
                          placeholder="Observaciones sobre el comportamiento, estado de ánimo, comunicación no verbal..."
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 'xl' 
                            }
                          }}
                        />
                      )}
                    />

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
                          placeholder="Técnicas, estrategias o intervenciones específicas utilizadas durante la sesión..."
                          sx={{ 
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: 'xl' 
                            }
                          }}
                        />
                      )}
                    />

                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        '& > *': {
                          flex: '1 1 300px',
                          minWidth: '300px'
                        }
                      }}
                    >
                      <Controller
                        name="homework"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Tareas para Casa"
                            multiline
                            rows={3}
                            placeholder="Ejercicios o actividades asignadas al paciente..."
                            sx={{ 
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 'xl' 
                              }
                            }}
                          />
                        )}
                      />

                      <Controller
                        name="nextSessionPlan"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Plan para Próxima Sesión"
                            multiline
                            rows={3}
                            placeholder="Objetivos y plan para la siguiente sesión..."
                            sx={{ 
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 'xl' 
                              }
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Información de IA */}
              {(session?.aiAnalysis || aiProcessing) && (
                <Box sx={{ p: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  {aiProcessing ? (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CircularProgress size={20} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            Procesando análisis de IA...
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Esto puede tomar unos momentos. El análisis se guardará automáticamente.
                          </Typography>
                        </Box>
                      </Stack>
                    </Alert>
                  ) : session?.aiAnalysis && (
                    <Alert 
                      severity="success" 
                      sx={{ 
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <SmartToyIcon />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            Análisis de IA disponible
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Confianza: {AIUtils.formatConfidence(session.aiAnalysis.confidence)} • 
                            Estado emocional: {session.aiAnalysis.emotionalTone}
                          </Typography>
                        </Box>
                      </Stack>
                    </Alert>
                  )}
                </Box>
              )}
            </Stack>
          </DialogContent>

          <DialogActions 
            sx={{ 
              p: 4, 
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.paper, 0.5)
            }}
          >
            <Button 
              onClick={onClose} 
              disabled={isSubmitting}
              sx={{ 
                borderRadius: 'xl', 
                px: 4,
                color: 'text.secondary'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ 
                borderRadius: 'xl', 
                px: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                }
              }}
            >
              {isSubmitting ? 'Guardando...' : (session ? 'Actualizar Sesión' : 'Crear Sesión')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}