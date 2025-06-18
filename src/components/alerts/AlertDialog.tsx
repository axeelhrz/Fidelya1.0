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
  Paper,
  Stack,
  Divider,
  IconButton,
  Fade,
  useTheme,
  alpha,
  Chip,
  Avatar,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  NotificationsActive as PushIcon,
  Event as EventIcon,
  Medication as MedicationIcon,
  Psychology as PsychologyIcon,
  Emergency as EmergencyIcon,
  Settings as SettingsIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
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

const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
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

  const getTypeIcon = (type: AlertType) => {
    const iconProps = { sx: { fontSize: '1.2rem' } };
    switch (type) {
      case 'appointment':
        return <EventIcon {...iconProps} />;
      case 'medication':
        return <MedicationIcon {...iconProps} />;
      case 'followup':
        return <PsychologyIcon {...iconProps} />;
      case 'emergency':
        return <EmergencyIcon {...iconProps} />;
      default:
        return <SettingsIcon {...iconProps} />;
    }
  };

  const getChannelIcon = (channel: NotificationChannel) => {
    const iconProps = { sx: { fontSize: '1rem' } };
    switch (channel) {
      case 'email':
        return <EmailIcon {...iconProps} />;
      case 'whatsapp':
        return <WhatsAppIcon {...iconProps} />;
      case 'sms':
        return <SmsIcon {...iconProps} />;
      case 'push':
        return <PushIcon {...iconProps} />;
    }
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 4,
          boxShadow: `0 32px 64px ${alpha(theme.palette.common.black, 0.2)}`,
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box 
          sx={{ 
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  background: alpha(theme.palette.common.white, 0.2),
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                }}
              >
                <AutoAwesomeIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {alert ? 'Editar Alerta' : 'Nueva Alerta'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {alert ? 'Modifica los detalles de la alerta' : 'Crea una nueva alerta para el seguimiento'}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'white',
                background: alpha(theme.palette.common.white, 0.1),
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: alpha(theme.palette.common.white, 0.2),
                  transform: 'scale(1.1)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.light, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}
          
          <Stack spacing={4}>
            {/* Sección del Paciente */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PersonIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Información del Paciente
                </Typography>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Seleccionar Paciente</InputLabel>
                <Select
                  value={formData.patientId}
                  onChange={(e) => handleInputChange('patientId', e.target.value)}
                  label="Seleccionar Paciente"
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                  }}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {patient.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {patient.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {patient.email}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedPatient && (
                <Fade in>
                  <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="body2" color="text.secondary">
                      Paciente seleccionado: <strong>{selectedPatient.fullName}</strong>
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Paper>

            {/* Sección de Detalles de la Alerta */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TitleIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Detalles de la Alerta
                </Typography>
              </Box>
              
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>Tipo de Alerta</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      label="Tipo de Alerta"
                      sx={{ borderRadius: 2 }}
                    >
                      {ALERT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {getTypeIcon(type)}
                            {ALERT_TYPE_LABELS[type]}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>Nivel de Urgencia</InputLabel>
                    <Select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      label="Nivel de Urgencia"
                      sx={{ borderRadius: 2 }}
                    >
                      {ALERT_URGENCIES.map((urgency) => (
                        <MenuItem key={urgency} value={urgency}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PriorityHighIcon 
                              sx={{ 
                                color: urgency === 'critical' ? '#ff1744' : 
                                       urgency === 'high' ? '#ff5722' :
                                       urgency === 'medium' ? '#ff9800' : '#4caf50'
                              }} 
                            />
                            {ALERT_URGENCY_LABELS[urgency]}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  label="Título de la Alerta"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  placeholder="Ej: Recordatorio de cita médica"
                />

                <TextField
                  label="Descripción Detallada"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  placeholder="Describe los detalles importantes de esta alerta..."
                />
              </Stack>
            </Paper>

            {/* Sección de Programación */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ScheduleIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Programación
                </Typography>
              </Box>
              
              <DateTimePicker
                label="Fecha y Hora de la Alerta"
                value={formData.scheduledFor}
                onChange={(value) => handleInputChange('scheduledFor', value || new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }
                  },
                }}
              />
            </Paper>

            {/* Sección de Notificaciones */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <NotificationsIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Canales de Notificación
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecciona los canales por los cuales se enviará la notificación
              </Typography>
              
              <FormGroup>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  {(['email', 'whatsapp', 'sms', 'push'] as NotificationChannel[]).map((channel) => (
                    <Paper
                      key={channel}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: formData.notificationChannels.includes(channel)
                          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
                          : alpha(theme.palette.background.default, 0.5),
                        border: `2px solid ${formData.notificationChannels.includes(channel) 
                          ? theme.palette.primary.main 
                          : alpha(theme.palette.divider, 0.1)}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }
                      }}
                      onClick={() => handleNotificationChannelChange(
                        channel, 
                        !formData.notificationChannels.includes(channel)
                      )}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.notificationChannels.includes(channel)}
                            onChange={(e) => handleNotificationChannelChange(channel, e.target.checked)}
                            sx={{ p: 0 }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                            {getChannelIcon(channel)}
                            <Typography variant="body2" fontWeight={500}>
                              {NOTIFICATION_CHANNEL_LABELS[channel]}
                            </Typography>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Paper>
                  ))}
                </Box>
              </FormGroup>
            </Paper>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            '&:disabled': {
              background: alpha(theme.palette.action.disabled, 0.3),
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Guardando...</span>
            </Box>
          ) : (
            'Guardar Alerta'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}