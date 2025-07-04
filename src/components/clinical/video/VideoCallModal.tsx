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
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Autocomplete,
  Stack,
  FormHelperText
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { LoadingButton } from '@mui/lab';
import {
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Notes as NotesIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { VideoCall, CreateVideoCallData, UpdateVideoCallData, VideoPlatform } from '../../../types/videocall';

interface VideoCallFormData {
  patientId: string;
  startDateTime: Date;
  duration: number;
  motive: string;
  notes: string;
  platform: VideoPlatform;
  customLink: string;
}

interface VideoCallModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVideoCallData | UpdateVideoCallData) => Promise<void>;
  videoCall?: VideoCall | null;
  patients: Array<{ id: string; name: string; email?: string }>;
  loading?: boolean;
}

const platformOptions: { value: VideoPlatform; label: string; description: string }[] = [
  { value: 'jitsi', label: 'Jitsi Meet', description: 'Gratuito y seguro' },
  { value: 'zoom', label: 'Zoom', description: 'Requiere cuenta Pro' },
  { value: 'meet', label: 'Google Meet', description: 'Requiere cuenta Google' },
  { value: 'daily', label: 'Daily.co', description: 'Plataforma profesional' },
  { value: 'custom', label: 'Enlace personalizado', description: 'Usar enlace propio' }
];

const durationOptions = [
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
  { value: 120, label: '2 horas' }
];

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  open,
  onClose,
  onSubmit,
  videoCall,
  patients,
  loading = false
}) => {
  const [formData, setFormData] = useState<VideoCallFormData>({
    patientId: '',
    startDateTime: new Date(),
    duration: 60,
    motive: '',
    notes: '',
    platform: 'jitsi' as VideoPlatform,
    customLink: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(videoCall);

  useEffect(() => {
    if (videoCall) {
      setFormData({
        patientId: videoCall.patientId,
        startDateTime: videoCall.startDateTime,
        duration: videoCall.duration,
        motive: videoCall.motive,
        notes: videoCall.notes || '',
        platform: videoCall.platform,
        customLink: videoCall.platform === 'custom' ? videoCall.videoLink : ''
      });
    } else {
      // Reset form for new video call
      setFormData({
        patientId: '',
        startDateTime: new Date(),
        duration: 60,
        motive: '',
        notes: '',
        platform: 'jitsi' as VideoPlatform,
        customLink: ''
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [videoCall, open]);

  const handleInputChange = (field: keyof VideoCallFormData, value: VideoCallFormData[keyof VideoCallFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecciona un paciente';
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = 'Selecciona fecha y hora';
    } else if (formData.startDateTime < new Date()) {
      newErrors.startDateTime = 'La fecha debe ser futura';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Selecciona una duración válida';
    }

    if (!formData.motive.trim()) {
      newErrors.motive = 'Ingresa el motivo de la consulta';
    }

    if (!formData.platform) {
      newErrors.platform = 'Selecciona una plataforma';
    }

    if (formData.platform === 'custom' && !formData.customLink.trim()) {
      newErrors.customLink = 'Ingresa el enlace personalizado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitError(null);

    try {
      const submitData: CreateVideoCallData | UpdateVideoCallData = {
        patientId: formData.patientId,
        startDateTime: formData.startDateTime,
        duration: formData.duration,
        motive: formData.motive.trim(),
        notes: formData.notes.trim(),
        platform: formData.platform,
        ...(formData.platform === 'custom' && { customLink: formData.customLink.trim() })
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al guardar la videollamada');
    }
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedPlatform = platformOptions.find(p => p.value === formData.platform);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VideoCallIcon color="primary" />
            <Box>
              <Typography variant="h6">
                {isEditing ? 'Editar Videollamada' : 'Nueva Videollamada'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditing ? 'Modifica los datos de la videollamada' : 'Programa una nueva consulta virtual'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Selección de paciente */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                Paciente
              </Typography>
              <Autocomplete
                value={selectedPatient || null}
                onChange={(_, newValue) => handleInputChange('patientId', newValue?.id || '')}
                options={patients}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar paciente..."
                    error={Boolean(errors.patientId)}
                    helperText={errors.patientId}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {option.name}
                      </Typography>
                      {option.email && (
                        <Typography variant="caption" color="text.secondary">
                          {option.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Box>

            {/* Fecha y hora */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon fontSize="small" />
                Fecha y Hora
              </Typography>
              <DateTimePicker
                value={formData.startDateTime}
                onChange={(date) => handleInputChange('startDateTime', date || new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.startDateTime),
                    helperText: errors.startDateTime
                  }
                }}
                minDateTime={new Date()}
              />
            </Box>

            {/* Duración */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Duración
              </Typography>
              <FormControl fullWidth error={Boolean(errors.duration)}>
                <Select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                >
                  {durationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.duration && <FormHelperText>{errors.duration}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Plataforma */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon fontSize="small" />
                Plataforma de Videollamada
              </Typography>
              <FormControl fullWidth error={Boolean(errors.platform)}>
                <Select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                >
                  {platformOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {option.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.platform && <FormHelperText>{errors.platform}</FormHelperText>}
              </FormControl>

              {selectedPlatform && (
                <Box sx={{ mt: 1, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.dark">
                    <strong>{selectedPlatform.label}:</strong> {selectedPlatform.description}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Enlace personalizado */}
            {formData.platform === 'custom' && (
              <TextField
                fullWidth
                label="Enlace personalizado"
                placeholder="https://..."
                value={formData.customLink}
                onChange={(e) => handleInputChange('customLink', e.target.value)}
                error={Boolean(errors.customLink)}
                helperText={errors.customLink || 'Ingresa el enlace completo de la videollamada'}
              />
            )}

            {/* Motivo */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotesIcon fontSize="small" />
                Motivo de la Consulta
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Describe el motivo de la videollamada..."
                value={formData.motive}
                onChange={(e) => handleInputChange('motive', e.target.value)}
                error={Boolean(errors.motive)}
                helperText={errors.motive}
              />
            </Box>

            {/* Notas adicionales */}
            <TextField
              fullWidth
              label="Notas adicionales (opcional)"
              multiline
              rows={3}
              placeholder="Información adicional, preparación necesaria, etc..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />

            {/* Resumen */}
            {formData.patientId && formData.startDateTime && (
              <Box sx={{ p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.dark" sx={{ mb: 1 }}>
                  Resumen de la Videollamada
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Paciente:</strong> {selectedPatient?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {formData.startDateTime.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duración:</strong> {durationOptions.find(d => d.value === formData.duration)?.label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Plataforma:</strong> {selectedPlatform?.label}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            variant="contained"
            startIcon={<VideoCallIcon />}
          >
            {isEditing ? 'Actualizar' : 'Crear'} Videollamada
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
