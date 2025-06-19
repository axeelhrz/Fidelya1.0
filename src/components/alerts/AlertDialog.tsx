'use client';

import { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
  Alert,
  Box,
  Typography,
  Stack,
  IconButton,
  useTheme,
  Avatar,
  Chip,
  Autocomplete,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Close as CloseIcon,
  Event as EventIcon,
  Medication as MedicationIcon,
  Psychology as PsychologyIcon,
  Emergency as EmergencyIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  NotificationsActive as PushIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  PersonOff as PersonOffIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  AlertFormData,
  AlertType,
  AlertTrigger,
  NotificationChannel,
  ALERT_TYPES,
  ALERT_TRIGGERS,
  ALERT_URGENCIES,
  ALERT_TYPE_LABELS,
  ALERT_TRIGGER_LABELS,
  ALERT_URGENCY_LABELS,
} from '@/types/alert';
import { usePatients } from '@/hooks/usePatients';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (alertData: AlertFormData) => Promise<void>;
  alert?: AlertFormData;
  preselectedPatientId?: string;
}

export default function AlertDialog({
  open,
  onClose,
  onSave,
  alert,
  preselectedPatientId,
}: AlertDialogProps) {
  const theme = useTheme();
  const { patients } = usePatients();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AlertFormData>({
    patientId: preselectedPatientId || '',
    type: 'síntoma',
    trigger: 'manual',
    title: '',
    description: '',
    urgency: 'media',
    scheduledFor: new Date(),
    notificationChannels: ['email'],
    notes: '',
  });

  // Configuraciones de iconos y colores
  const typeIcons = useMemo(() => ({
    appointment: EventIcon,
    medication: MedicationIcon,
    followup: PsychologyIcon,
    emergency: EmergencyIcon,
    custom: SettingsIcon,
    síntoma: WarningIcon,
    fecha: ScheduleIcon,
    inactividad: PersonOffIcon,
  }), []);

  const triggerIcons = useMemo(() => ({
    manual: SettingsIcon,
    fecha_programada: ScheduleIcon,
    texto_IA: AutoAwesomeIcon,
    falta_sesión: PersonOffIcon,
  }), []);

  const channelIcons = useMemo(() => ({
    email: EmailIcon,
    whatsapp: WhatsAppIcon,
    sms: SmsIcon,
    push: PushIcon,
  }), []);

  const urgencyColors = useMemo(() => ({
    baja: theme.palette.success.main,
    media: theme.palette.warning.main,
    alta: theme.palette.error.main,
    crítica: theme.palette.error.dark,
  }), [theme]);

  useEffect(() => {
    if (alert) {
      setFormData({
        patientId: alert.patientId,
        type: alert.type,
        trigger: alert.trigger,
        title: alert.title,
        description: alert.description,
        urgency: alert.urgency,
        scheduledFor: alert.scheduledFor || new Date(),
        notificationChannels: alert.notificationChannels,
        notes: alert.notes || '',
        metadata: alert.metadata,
      });
    } else if (preselectedPatientId) {
      setFormData(prev => ({
        ...prev,
        patientId: preselectedPatientId,
      }));
    }
  }, [alert, preselectedPatientId]);

  const handleInputChange = (field: keyof AlertFormData, value: AlertFormData[keyof AlertFormData]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generar título basado en tipo y trigger
    if (field === 'type' || field === 'trigger') {
      const newType = field === 'type' ? value as AlertType : formData.type;
      const newTrigger = field === 'trigger' ? value as AlertTrigger : formData.trigger;
      
      if (newType && newTrigger) {
        const autoTitle = generateAutoTitle(newType, newTrigger);
        setFormData(prev => ({
          ...prev,
          [field]: value,
          title: autoTitle,
        }));
      }
    }
  };

  const generateAutoTitle = (type: AlertType, trigger: AlertTrigger): string => {
    const typeLabel = ALERT_TYPE_LABELS[type];
    const triggerLabel = ALERT_TRIGGER_LABELS[trigger];
    
    if (type === 'síntoma' && trigger === 'texto_IA') {
      return 'Síntoma detectado por IA';
    } else if (type === 'inactividad' && trigger === 'falta_sesión') {
      return 'Paciente inactivo - Seguimiento requerido';
    } else if (type === 'fecha' && trigger === 'fecha_programada') {
      return 'Recordatorio programado';
    }
    
    return `${typeLabel} - ${triggerLabel}`;
  };

  const handleNotificationChannelChange = (channel: NotificationChannel, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationChannels: checked
        ? [...prev.notificationChannels, channel]
        : prev.notificationChannels.filter(c => c !== channel),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones
      const validations = [
        { condition: !formData.patientId, message: 'Debe seleccionar un paciente' },
        { condition: !formData.title.trim(), message: 'El título es obligatorio' },
        { condition: !formData.description.trim(), message: 'La descripción es obligatoria' },
        { condition: formData.notificationChannels.length === 0, message: 'Seleccione al menos un canal' },
      ];

      // Validación condicional para fecha programada
      if (formData.trigger === 'fecha_programada' && !formData.scheduledFor) {
        validations.push({ condition: true, message: 'Debe especificar una fecha para alertas programadas' });
      }

      const failedValidation = validations.find(v => v.condition);
      if (failedValidation) {
        throw new Error(failedValidation.message);
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la alerta');
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === formData.patientId), 
    [patients, formData.patientId]
  );

  const requiresScheduledDate = formData.trigger === 'fecha_programada';

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {alert ? 'Editar Alerta Clínica' : 'Nueva Alerta Clínica'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Configurá seguimientos importantes y automatizá recordatorios clínicos
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        <Stack spacing={3}>
          {/* Selección de Paciente */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Paciente
            </Typography>
            <Autocomplete
              value={selectedPatient || null}
              onChange={(_, newValue) => handleInputChange('patientId', newValue?.id || '')}
              options={patients}
              getOptionLabel={(option) => option.fullName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar paciente..."
                  size="small"
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                    {option.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{option.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email || 'Sin contacto'}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Box>

          {selectedPatient && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.50', 
              borderRadius: 2, 
              border: 1, 
              borderColor: 'primary.200' 
            }}>
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                Paciente seleccionado: {selectedPatient.fullName}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Tipo y Trigger */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Configuración de Alerta
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Alerta</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  label="Tipo de Alerta"
                >
                  {ALERT_TYPES.map((type) => {
                    const Icon = typeIcons[type];
                    return (
                      <MenuItem key={type} value={type}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Icon sx={{ fontSize: 18 }} />
                          {ALERT_TYPE_LABELS[type]}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Disparador</InputLabel>
                <Select
                  value={formData.trigger}
                  onChange={(e) => handleInputChange('trigger', e.target.value)}
                  label="Disparador"
                >
                  {ALERT_TRIGGERS.map((trigger) => {
                    const Icon = triggerIcons[trigger];
                    return (
                      <MenuItem key={trigger} value={trigger}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Icon sx={{ fontSize: 18 }} />
                          {ALERT_TRIGGER_LABELS[trigger]}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Urgencia */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Nivel de Urgencia
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {ALERT_URGENCIES.map((urgency) => (
                <Chip
                  key={urgency}
                  label={ALERT_URGENCY_LABELS[urgency]}
                  clickable
                  color={formData.urgency === urgency ? 'primary' : 'default'}
                  variant={formData.urgency === urgency ? 'filled' : 'outlined'}
                  onClick={() => handleInputChange('urgency', urgency)}
                  sx={{
                    fontWeight: 600,
                    borderColor: urgencyColors[urgency],
                    color: formData.urgency === urgency ? 'white' : urgencyColors[urgency],
                    bgcolor: formData.urgency === urgency ? urgencyColors[urgency] : 'transparent',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Título y Descripción */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Detalles de la Alerta
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Título"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                fullWidth
                size="small"
                required
                placeholder="Ej: Síntoma detectado por IA"
              />

              <TextField
                label="Descripción"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                required
                placeholder="Describe los detalles de la alerta..."
              />

              <TextField
                label="Notas adicionales"
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                fullWidth
                multiline
                rows={2}
                size="small"
                placeholder="Información adicional o contexto..."
              />
            </Stack>
          </Box>

          {/* Fecha programada (condicional) */}
          {requiresScheduledDate && (
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Programación
              </Typography>
              <DateTimePicker
                label="Fecha y Hora de Activación"
                value={formData.scheduledFor}
                onChange={(value) => handleInputChange('scheduledFor', value || new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    required: true,
                  },
                }}
                minDateTime={new Date()}
              />
            </Box>
          )}

          <Divider />

          {/* Canales de notificación */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Canales de Notificación
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(['email', 'whatsapp', 'sms', 'push'] as NotificationChannel[]).map((channel) => {
                const Icon = channelIcons[channel];
                const isSelected = formData.notificationChannels.includes(channel);
                
                return (
                  <Chip
                    key={channel}
                    icon={<Icon sx={{ fontSize: 16 }} />}
                    label={channel.toUpperCase()}
                    clickable
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    size="small"
                    onClick={() => handleNotificationChannelChange(channel, !isSelected)}
                    sx={{ fontWeight: 500 }}
                  />
                );
              })}
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={loading} size="large">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
          size="large"
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Guardar Alerta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}