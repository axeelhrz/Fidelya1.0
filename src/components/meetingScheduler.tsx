import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Stack, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  useTheme, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { sendMeetingRequest } from '@/lib/emailjs';
import { useAuth } from '@/hooks/use-auth';

// Definir la interfaz para el usuario
interface AuthUser {
  displayName?: string;
  email?: string;
}

// Componente de programador de reuniones
const MeetingScheduler = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [meetingType, setMeetingType] = useState('video');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  // Prellenar datos si el usuario está autenticado
  useEffect(() => {
    if (user) {
      setName(((user as AuthUser).displayName) || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !name || !email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Formatear fecha y hora para el correo
      const dateTime = formatMeetingDateTime();
      
      // Enviar solicitud de reunión
      const result = await sendMeetingRequest({
        name,
        email,
        phone,
        topic,
        meetingType: meetingType === 'video' ? 'Videollamada' : 'Llamada telefónica',
        dateTime
      });
      
      if (result.success) {
        setIsScheduled(true);
      } else {
        setError('Ha ocurrido un error al programar la reunión. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al programar la reunión:', error);
      setError('Ha ocurrido un error al programar la reunión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatMeetingDateTime = () => {
    if (!selectedDate || !selectedTime) return '';
    
    const date = new Date(selectedDate);
    const time = new Date(selectedTime);
    
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px',
      background: isDark 
        ? 'rgba(15, 23, 42, 0.6)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    }}>
      <CardContent sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}` }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Programar reunión
          </Typography>
        </Stack>
      </CardContent>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <AnimatePresence mode="wait">
          {!isScheduled ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="meeting-type-label">Tipo de reunión</InputLabel>
                    <Select
                      labelId="meeting-type-label"
                      value={meetingType}
                      label="Tipo de reunión"
                      onChange={(e) => setMeetingType(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="video">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <VideocamIcon fontSize="small" />
                          <Typography>Videollamada</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="phone">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon fontSize="small" />
                          <Typography>Llamada telefónica</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <DatePicker
                      label="Fecha"
                      value={selectedDate}
                      onChange={(newDate) => setSelectedDate(newDate)}
                      disablePast
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    <TimePicker
                      label="Hora"
                      value={selectedTime}
                      onChange={(newTime) => setSelectedTime(newTime)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Stack>
                  <TextField
                    label="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="small"
                    required
                    type="email"
                  />
                  <TextField
                    label="Teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Tema a tratar"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                  />
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleScheduleMeeting}
                    disabled={!selectedDate || !selectedTime || !name || !email || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ScheduleIcon />}
                  >
                    {isLoading ? 'Programando...' : 'Programar reunión'}
                  </Button>
                </Stack>
              </LocalizationProvider>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ height: '100%', py: 2 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
                </motion.div>
                <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                  ¡Reunión programada!
                </Typography>
                <Typography variant="body2" align="center">
                  Tu reunión ha sido programada para:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)',
                    width: '100%',
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatMeetingDateTime()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {meetingType === 'video' ? (
                        <VideocamIcon fontSize="small" color="primary" />
                      ) : (
                        <PhoneIcon fontSize="small" color="primary" />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {meetingType === 'video' ? 'Videollamada' : 'Llamada telefónica'}
                      </Typography>
                    </Stack>
                    {topic && (
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <QuestionAnswerIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                        <Typography variant="body2">
                          {topic}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
                <Typography variant="body2" align="center" color="text.secondary">
                  Hemos enviado un correo de confirmación a {email} con los detalles de la reunión.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsScheduled(false)}
                  startIcon={<ScheduleIcon />}
                >
                  Programar otra reunión
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MeetingScheduler;