'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  alpha,
  useTheme,
  Fade,
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  Save,
  Psychology,
  CalendarToday,
  Mood,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Patient,
  PatientFormData,
  Gender,
  EmotionalState,
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
  const theme = useTheme();
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
      gender: 'M' as Gender,
      emotionalState: 'Estable' as EmotionalState,
      motivoConsulta: '',
      observaciones: '',
      assignedPsychologist: '',
      nextSession: '',
    }
  });

  const selectedEmotionalState = watch('emotionalState');
  const selectedBirthDate = watch('birthDate');

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
        gender: 'M' as Gender,
        emotionalState: 'Estable' as EmotionalState,
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
          sx: {
            borderRadius: 4,
            minHeight: '70vh',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {isEditing ? <Edit sx={{ fontSize: 24 }} /> : <PersonAdd sx={{ fontSize: 24 }} />}
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight={700}
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: 'text.primary'
                }}
              >
                {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditing ? 'Modifica los datos del paciente' : 'Completa la información del nuevo paciente'}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3 }}>
            {submitError && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    '& .MuiAlert-message': {
                      fontWeight: 500
                    }
                  }}
                >
                  {submitError}
                </Alert>
              </Fade>
            )}

            <Stack spacing={4}>
              {/* Información Personal */}
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color="primary"
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Información Personal
                    </Typography>
                  </Box>

                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={2}
                    sx={{
                      '& > *': {
                        flex: 1,
                        minWidth: { xs: '100%', md: 200 }
                      }
                    }}
                  >
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                            }
                          }}
                        />
                      )}
                    />

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
                            sx={{ borderRadius: 3 }}
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
                  </Stack>

                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={2}
                    alignItems="center"
                  >
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 250 } }}>
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
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                  }
                                }
                              }
                            }}
                          />
                        )}
                      />
                    </Box>

                    {selectedBirthDate && (
                      <Fade in>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha(theme.palette.info.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            minWidth: 120,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Edad
                          </Typography>
                          <Typography variant="h6" fontWeight={600} color="info.main">
                            {calculateAge(selectedBirthDate)} años
                          </Typography>
                        </Paper>
                      </Fade>
                    )}
                  </Stack>
                </Stack>
              </Paper>

              {/* Información Clínica */}
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color="primary"
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Información Clínica
                    </Typography>
                  </Box>

                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={2}
                    alignItems="center"
                  >
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 250 } }}>
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
                              sx={{ borderRadius: 3 }}
                            >
                              {EMOTIONAL_STATES.map((state) => (
                                <MenuItem key={state} value={state}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: EMOTIONAL_STATE_COLORS[state],
                                      }}
                                    />
                                    {state}
                                  </Stack>
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
                    </Box>

                    <Fade in>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${EMOTIONAL_STATE_COLORS[selectedEmotionalState]} 0%, ${alpha(EMOTIONAL_STATE_COLORS[selectedEmotionalState], 0.8)} 100%)`,
                          minWidth: 140,
                          textAlign: 'center'
                        }}
                      >
                        <Mood sx={{ fontSize: 20, color: 'white', mb: 0.5 }} />
                        <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                          {selectedEmotionalState}
                        </Typography>
                      </Paper>
                    </Fade>
                  </Stack>

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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    )}
                  />

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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    )}
                  />
                </Stack>
              </Paper>

              {/* Asignación y Programación */}
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color="primary"
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Asignación y Programación
                    </Typography>
                  </Box>

                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={2}
                    sx={{
                      '& > *': {
                        flex: 1,
                        minWidth: { xs: '100%', md: 250 }
                      }
                    }}
                  >
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
                            sx={{ borderRadius: 3 }}
                          >
                            {psychologists.map((psychologist) => (
                              <MenuItem key={psychologist.uid} value={psychologist.uid}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Psychology sx={{ fontSize: 18, color: 'primary.main' }} />
                                  <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      {psychologist.displayName}
                                    </Typography>
                                    {psychologist.specialization && (
                                      <Typography variant="caption" color="text.secondary">
                                        {psychologist.specialization}
                                      </Typography>
                                    )}
                                  </Box>
                                </Stack>
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
                              InputProps: {
                                startAdornment: (
                                  <CalendarToday sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                ),
                              },
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 3,
                                }
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1.5,
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${theme.palette.primary.main} 100%)`,
                }
              }}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Paciente' : 'Crear Paciente')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}