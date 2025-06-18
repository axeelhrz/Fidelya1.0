'use client';

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  AlertFormData,
  AlertType,
  AlertUrgency,
  NotificationChannel,
} from '@/types/alert';
import { usePatients } from '@/hooks/usePatients';

// Constants for alert types and urgencies
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

      // Validaciones
      if (!formData.patientId) {
        throw new Error('Debe seleccionar un paciente');
      }
      if (!formData.title.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!formData.description.trim()) {
        throw new Error('La descripción es obligatoria');
      }
      if (!formData.scheduledFor) {
        throw new Error('Debe especificar una fecha para la alerta');
      }
      if (formData.notificationChannels.length === 0) {
        throw new Error('Debe seleccionar al menos un canal de notificación');
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al guardar la alerta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {alert ? 'Editar Alerta' : 'Nueva Alerta'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Paciente */}
          <FormControl fullWidth>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              label="Paciente"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tipo de alerta */}
          <FormControl fullWidth>
            <InputLabel>Tipo de Alerta</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              label="Tipo de Alerta"
            >
              {ALERT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {ALERT_TYPE_LABELS[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Título */}
          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            fullWidth
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
            required
          />

          {/* Urgencia */}
          <FormControl fullWidth>
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

          {/* Fecha programada */}
          <DateTimePicker
            label="Fecha Programada"
            value={formData.scheduledFor}
            onChange={(value) => handleInputChange('scheduledFor', value || new Date())}
            slotProps={{
              textField: {
                fullWidth: true,
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notificationChannels.includes('email')}
                      onChange={(e) => handleNotificationChannelChange('email', e.target.checked)}
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notificationChannels.includes('whatsapp')}
                      onChange={(e) => handleNotificationChannelChange('whatsapp', e.target.checked)}
                    />
                  }
                  label="WhatsApp"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notificationChannels.includes('sms')}
                      onChange={(e) => handleNotificationChannelChange('sms', e.target.checked)}
                    />
                  }
                  label="SMS"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notificationChannels.includes('push')}
                      onChange={(e) => handleNotificationChannelChange('push', e.target.checked)}
                    />
                  }
                  label="Push"
                />
              </Box>
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
        >
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}