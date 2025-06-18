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
  Grid,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  ClinicalAlert,
  AlertFormData,
  AlertType,
  AlertTrigger,
  AlertUrgency,
  ALERT_TYPES,
  ALERT_TRIGGERS,
  ALERT_URGENCIES,
  ALERT_TYPE_LABELS,
  ALERT_TRIGGER_LABELS,
  ALERT_URGENCY_LABELS,
} from '@/types/alert';
import { Patient } from '@/types/patient';
import { usePatients } from '@/hooks/usePatients';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (alertData: AlertFormData) => Promise<void>;
  alert?: ClinicalAlert;
  preselectedPatientId?: string;
}

export default function AlertDialog({
  open,
  onClose,
  onSave,
  alert,
  preselectedPatientId,
}: AlertDialogProps) {
  const { patients, loading: patientsLoading } = usePatients();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AlertFormData>({
    patientId: preselectedPatientId || '',
    type: 'fecha',
    description: '',
    trigger: 'fecha_programada',
    urgency: 'media',
    scheduledFor: '',
    notes: '',
    notificationChannels: ['email'],
  });

  useEffect(() => {
    if (alert) {
      setFormData({
        patientId: alert.patientId,
        type: alert.type,
        description: alert.description,
        trigger: alert.trigger,
        urgency: alert.urgency,
        scheduledFor: alert.scheduledFor || '',
        notes: alert.notes || '',
        notificationChannels: alert.notificationChannels,
      });
    } else if (preselectedPatientId) {
      setFormData(prev => ({
        ...prev,
        patientId: preselectedPatientId,
      }));
    }
  }, [alert, preselectedPatientId]);

  const handleInputChange = (field: keyof AlertFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChannelChange = (channel: 'email' | 'whatsapp' | 'sms', checked: boolean) => {
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
      if (!formData.description.trim()) {
        throw new Error('La descripción es obligatoria');
      }
      if (formData.trigger === 'fecha_programada' && !formData.scheduledFor) {
        throw new Error('Debe especificar una fecha para alertas programadas');
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Alerta</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Paciente"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              select
              fullWidth
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Trigger</InputLabel>
              <Select
                value={formData.trigger}
                onChange={(e) => handleInputChange('trigger', e.target.value)}
              >
                {ALERT_TRIGGERS.map((trigger) => (
                  <MenuItem key={trigger} value={trigger}>
                    {ALERT_TRIGGER_LABELS[trigger]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Urgencia</InputLabel>
              <Select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
              >
                {ALERT_URGENCIES.map((urgency) => (
                  <MenuItem key={urgency} value={urgency}>
                    {ALERT_URGENCY_LABELS[urgency]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              label="Fecha Programada"
              value={formData.scheduledFor}
              onChange={(value) => handleInputChange('scheduledFor', value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notas"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
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
                label="Whatsapp"
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
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}