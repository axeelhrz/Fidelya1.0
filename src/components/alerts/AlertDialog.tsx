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
  FormControlLabel,
  Checkbox,
  FormGroup,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Stack,
  IconButton,
  useTheme,
  Avatar,
  Chip,
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
} from '@mui/icons-material';
import {
  AlertFormData,
  AlertType,
  AlertUrgency,
  NotificationChannel,
} from '@/types/alert';
import { usePatients } from '@/hooks/usePatients';

const ALERT_TYPES: AlertType[] = ['appointment', 'medication', 'followup', 'emergency', 'custom'];
const ALERT_URGENCIES: AlertUrgency[] = ['low', 'medium', 'high', 'critical'];

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  appointment: 'Cita',
  medication: 'Medicación',
  followup: 'Seguimiento',
  emergency: 'Emergencia',
  custom: 'Personalizada',
};

const ALERT_URGENCY_LABELS: Record<AlertUrgency, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

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
    type: 'appointment',
    title: '',
    description: '',
    urgency: 'medium',
    scheduledFor: new Date(),
    notificationChannels: ['email'],
    trigger: 'manual',
  });

  // Memoizar configuraciones para optimización
  const typeIcons = useMemo(() => ({
    appointment: EventIcon,
    medication: MedicationIcon,
    followup: PsychologyIcon,
    emergency: EmergencyIcon,
    custom: SettingsIcon,
  }), []);

  const channelIcons = useMemo(() => ({
    email: EmailIcon,
    whatsapp: WhatsAppIcon,
    sms: SmsIcon,
    push: PushIcon,
  }), []);

  useEffect(() => {
    if (alert) {
      setFormData({
        patientId: alert.patientId,
        type: alert.type,
        title: alert.title,
        description: alert.description,
        urgency: alert.urgency,
        scheduledFor: alert.scheduledFor,
        notificationChannels: alert.notificationChannels,
        metadata: alert.metadata,
        trigger: alert.trigger || 'manual',
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

      // Validaciones optimizadas
      const validations = [
        { condition: !formData.patientId, message: 'Debe seleccionar un paciente' },
        { condition: !formData.title.trim(), message: 'El título es obligatorio' },
        { condition: !formData.description.trim(), message: 'La descripción es obligatoria' },
        { condition: !formData.scheduledFor, message: 'Debe especificar una fecha' },
        { condition: formData.notificationChannels.length === 0, message: 'Seleccione al menos un canal' },
      ];

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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {alert ? 'Editar Alerta' : 'Nueva Alerta'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}
        
        <Stack spacing={3}>
          {/* Paciente */}
          <FormControl fullWidth size="small">
            <InputLabel>Paciente</InputLabel>
            <Select
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              label="Paciente"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {patient.fullName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{patient.fullName}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedPatient && (
            <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 1, border: 1, borderColor: 'primary.200' }}>
              <Typography variant="caption" color="primary.main">
                Paciente: {selectedPatient.fullName}
              </Typography>
            </Box>
          )}

          {/* Tipo y Urgencia */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Tipo"
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
              <InputLabel>Urgencia</InputLabel>
              <Select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                label="Urgencia"
              >
                {ALERT_URGENCIES.map((urgency) => (
                  <MenuItem key={urgency} value={urgency}>
                    {ALERT_URGENCY_LABELS[urgency]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Título */}
          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            fullWidth
            size="small"
            required
          />

          {/* Descripción */}
          <TextField
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            required
          />

          {/* Fecha */}
          <DateTimePicker
            label="Fecha y Hora"
            value={formData.scheduledFor}
            onChange={(value) => handleInputChange('scheduledFor', value || new Date())}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                required: true,
              },
            }}
          />

          {/* Canales de notificación */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Canales de Notificación
            </Typography>
            <FormGroup>
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
            </FormGroup>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}