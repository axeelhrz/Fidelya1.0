'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Stack, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  useTheme, 
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import Head from 'next/head';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideocamIcon from '@mui/icons-material/Videocam';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ForumIcon from '@mui/icons-material/Forum';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { initEmailJS, sendContactForm, sendMeetingRequest } from '@/lib/emailjs';
import { initChatSession, sendUserMessage, subscribeToChatSession } from '@/lib/chat';
import { useAuth } from '@/hooks/use-auth';

// Componente de partículas para el fondo
const ParticlesBackground = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.5,
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 30 }).map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            background: isDark 
              ? `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)`
              : `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)`,
            borderRadius: '50%',
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

// Componente de mapa interactivo
const InteractiveMap = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        minHeight: 300,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
      }}
    >
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6577488001307!2d-3.7035284846337695!3d40.41694077936409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d698c8521%3A0x5cbf7c021e942f9f!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1652345678901!5m2!1ses!2ses" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  );
};

// Componente de chat en vivo
// Define interface for chat messages
interface ChatMessage {
  sender: string;
  text: string;
  timestamp: {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  } | Date | number | string | null; // Handles Firestore Timestamp, Date, Unix timestamp, ISO string or null
}

const LiveChatSimulator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar la sesión de chat
  useEffect(() => {
    let unsubscribe = () => {};
    
    const initChat = async () => {
      const userData = user ? {
        email: user.email || undefined,
        name: user.displayName || undefined,
        userId: user.uid || undefined
      } : undefined;
      
      const id = await initChatSession(userData);
      unsubscribe = subscribeToChatSession(id, (session) => {
        if (session.messages) {
          // Map the messages to ensure they match our local interface
          setMessages(session.messages.map(msg => ({
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.timestamp && typeof msg.timestamp === 'object'
              ? 'toDate' in msg.timestamp && typeof msg.timestamp.toDate === 'function' 
                ? msg.timestamp.toDate() 
                : null
              : msg.timestamp
          })));
        }
      });
      setSessionId(id);
    };
    
    initChat();
    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    
    // Añadir mensaje del usuario localmente para UI inmediata
    setInputValue("");
    setIsTyping(true);
    
    // Enviar mensaje a Firebase
    const userData = user ? {
      email: user.email || undefined,
      name: user.displayName || undefined,
      userId: user.uid
    } : undefined;
    
    await sendUserMessage(sessionId, inputValue, userData);
    setIsTyping(false);
  };

  const formatTime = (timestamp: {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  } | Date | number | string | null) => {
    if (!timestamp) return '';
    
    let date: Date;
    if (typeof timestamp === 'object') {
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
        // Handle Firestore timestamp without toDate method
        date = new Date(timestamp.seconds * 1000);
      } else {
        // Fallback for unhandled object types
        return '';
      }
    } else {
      // Handle number or string
      date = new Date(timestamp);
    }
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <ForumIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chat en vivo
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Chip 
              label="En línea" 
              size="small" 
              color="success" 
              sx={{ height: 24 }} 
            />
          </Box>
        </Stack>
      </CardContent>
      <Box sx={{ 
        p: 2, 
        flexGrow: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        maxHeight: 300,
      }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: '16px',
                borderTopLeftRadius: message.sender === 'user' ? '16px' : 0,
                borderTopRightRadius: message.sender === 'user' ? 0 : '16px',
                background: message.sender === 'user' 
                  ? (isDark ? 'rgba(37, 99, 235, 0.8)' : 'rgba(59, 130, 246, 0.8)')
                  : message.sender === 'admin'
                    ? (isDark ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.8)')
                    : (isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'),
                color: message.sender === 'user' || message.sender === 'admin'
                  ? 'white' 
                  : 'inherit',
              }}
            >
              {message.sender === 'admin' && (
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
                  Agente de Soporte
                </Typography>
              )}
              <Typography variant="body2">{message.text}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {formatTime(message.timestamp)}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box
            sx={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: '16px',
                borderTopLeftRadius: 0,
                background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? '#60A5FA' : '#3B82F6' }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? '#60A5FA' : '#3B82F6' }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? '#60A5FA' : '#3B82F6' }}
                />
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}` }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
            sx={{
              minWidth: 'auto',
              borderRadius: '50%',
              width: 40,
              height: 40,
              p: 0,
            }}
          >
            <SendIcon fontSize="small" />
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

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
      setName(user.displayName || '');
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

// Componente principal de la página
export default function ContactPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [contactMethod, setContactMethod] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    department: 'ventas',
    policy: false
  });

  // Define the type for form errors
  interface FormErrors {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    subject?: string | null;
    message?: string | null;
    department?: string | null;
    policy?: string | null;
    [key: string]: string | null | undefined;
  }

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  // Inicializar EmailJS y prellenar datos si el usuario está autenticado
  useEffect(() => {
    initEmailJS();
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    const checked = 
      'type' in e.target && e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : false;
    
    setFormData({
      ...formData,
      [name]: name === 'policy' ? checked : value
    });
    
    // Limpiar error cuando el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    if (!formData.subject.trim()) errors.subject = 'El asunto es obligatorio';
    if (!formData.message.trim()) errors.message = 'El mensaje es obligatorio';
    if (!formData.policy) errors.policy = 'Debes aceptar la política de privacidad';
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await sendContactForm(formData);
      
      if (result.success) {
        setSubmitSuccess(true);
        // Resetear el formulario después de 5 segundos
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            subject: '',
            message: '',
            department: 'ventas',
            policy: false
          });
        }, 5000);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      value: 'assurivac@gmail.com',
      action: () => copyToClipboard('assurivac@gmail.com')
    },
    {
      icon: <PhoneIcon />,
      title: 'Teléfono',
      value: '+598 92 388 748',
      action: () => copyToClipboard('+598 92 388 748')
    },
    {
      icon: <WhatsAppIcon />,
      title: 'WhatsApp',
      value: '+598 92 388 748',
      action: () => window.open('https://wa.me/+59892388748', '_blank')
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Horario',
      value: 'Lun-Vie: 9:00 - 18:00',
      action: null
    }
  ];

  return (
    <>
      <Head>
        <title>Contacto | Assuriva - Software para Corredores de Seguros</title>
        <meta name="description" content="Ponte en contacto con nuestro equipo de expertos en seguros. Estamos aquí para ayudarte con cualquier consulta sobre nuestros servicios y soluciones para corredores de seguros." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Contacto | Assuriva" />
        <meta property="og:description" content="Contacta con nuestro equipo de expertos en seguros. Responderemos a todas tus consultas sobre nuestras soluciones para corredores." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://assuriva.com/contact" />
      </Head>
      
      <Header />
      
      <Box
        sx={{
          position: 'relative',
          background: isDark 
            ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)' 
            : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #EFF6FF 100%)',
          color: isDark ? '#F8FAFC' : '#0F172A',
          minHeight: '100vh',
          // Aumentar el padding superior para separar el título del navbar
          pt: { xs: 12, sm: 14, md: 16 }, // Valores aumentados para crear más espacio
          pb: 10,
          transition: 'all 0.4s ease',
          overflow: 'hidden',
        }}
      >
        <ParticlesBackground />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  background: isDark 
                    ? 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)' 
                    : 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  mb: 2
                }}
              >
                Estamos aquí para ayudarte
              </Typography>
              
              <Typography 
                variant="h2" 
                component="p"
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, 
                  fontWeight: 400,
                  maxWidth: '800px',
                  mb: 2,
                  color: isDark ? '#CBD5E1' : '#334155'
                }}
              >
                Nuestro equipo de expertos está listo para responder a todas tus preguntas y ayudarte a encontrar la solución perfecta para tu correduría
              </Typography>
              
              <Tabs
                value={contactMethod}
                onChange={(_, newValue) => setContactMethod(newValue)}
                centered
                sx={{ 
                  mb: 2,
                  '& .MuiTabs-indicator': {
                    backgroundColor: isDark ? '#60A5FA' : '#3B82F6',
                  },
                  '& .MuiTab-root': {
                    color: isDark ? '#CBD5E1' : '#334155',
                    '&.Mui-selected': {
                      color: isDark ? '#60A5FA' : '#3B82F6',
                    },
                  },
                }}
              >
                <Tab 
                  label="Formulario" 
                  icon={<EmailIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Chat en vivo" 
                  icon={<ForumIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Programar reunión" 
                  icon={<CalendarMonthIcon />} 
                  iconPosition="start"
                />
              </Tabs>
            </Stack>
          </motion.div>
          
          {/* Contact Methods */}
          <Box sx={{ mb: 10 }}>
            <AnimatePresence mode="wait">
              {contactMethod === 0 && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    {/* Contact Form */}
                    <Box sx={{ flex: { xs: '1', md: '2' } }}>
                      <Card
                        component={motion.div}
                        whileHover={{ y: -5 }}
                        sx={{
                          borderRadius: '24px',
                          background: isDark 
                            ? 'rgba(15, 23, 42, 0.6)' 
                            : 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                          boxShadow: isDark 
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                            : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                          transition: 'all 0.4s ease',
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
                            Envíanos un mensaje
                          </Typography>
                          
                          <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                  label="Nombre completo"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  fullWidth
                                  required
                                  error={!!formErrors.name}
                                  helperText={formErrors.name}
                                />
                                <TextField
                                  label="Email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  fullWidth
                                  required
                                  error={!!formErrors.email}
                                  helperText={formErrors.email}
                                />
                              </Stack>
                              
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                  label="Teléfono"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  fullWidth
                                />
                                <TextField
                                  label="Empresa"
                                  name="company"
                                  value={formData.company}
                                  onChange={handleChange}
                                  fullWidth
                                />
                              </Stack>
                              
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <FormControl fullWidth>
                                  <InputLabel id="department-label">Departamento</InputLabel>
                                  <Select
                                    labelId="department-label"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    label="Departamento"
                                  >
                                    <MenuItem value="ventas">Ventas</MenuItem>
                                    <MenuItem value="soporte">Soporte técnico</MenuItem>
                                    <MenuItem value="facturacion">Facturación</MenuItem>
                                    <MenuItem value="otro">Otro</MenuItem>
                                  </Select>
                                </FormControl>
                                <TextField
                                  label="Asunto"
                                  name="subject"
                                  value={formData.subject}
                                  onChange={handleChange}
                                  fullWidth
                                  required
                                  error={!!formErrors.subject}
                                  helperText={formErrors.subject}
                                />
                              </Stack>
                              
                              <TextField
                                label="Mensaje"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                fullWidth
                                required
                                multiline
                                rows={4}
                                error={!!formErrors.message}
                                helperText={formErrors.message}
                              />
                              
                              <FormControl error={!!formErrors.policy}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <input
                                    type="checkbox"
                                    name="policy"
                                    checked={formData.policy}
                                    onChange={handleChange}
                                    id="policy-checkbox"
                                  />
                                  <label htmlFor="policy-checkbox">
                                    <Typography variant="body2">
                                      He leído y acepto la <a href="/privacidad" style={{ color: isDark ? '#60A5FA' : '#3B82F6' }}>política de privacidad</a>
                                    </Typography>
                                  </label>
                                </Stack>
                                {formErrors.policy && (
                                  <Typography variant="caption" color="error">
                                    {formErrors.policy}
                                  </Typography>
                                )}
                              </FormControl>
                              
                              <Box sx={{ mt: 2 }}>
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={isSubmitting || submitSuccess}
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                    sx={{
                                      py: 1.5,
                                      borderRadius: '12px',
                                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                                      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                                      '&:hover': {
                                        background: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)',
                                        boxShadow: '0 15px 20px -3px rgba(59, 130, 246, 0.4)',
                                      },
                                      transition: 'all 0.4s ease',
                                    }}
                                  >
                                    {isSubmitting ? 'Enviando...' : submitSuccess ? '¡Mensaje enviado!' : 'Enviar mensaje'}
                                  </Button>
                                </motion.div>
                              </Box>
                            </Stack>
                          </form>
                        </CardContent>
                      </Card>
                    </Box>
                    
                    {/* Contact Info */}
                    <Box sx={{ flex: { xs: '1', md: '1' } }}>
                      <Stack spacing={3}>
                        {contactInfo.map((info, index) => (
                          <Card
                            key={index}
                            component={motion.div}
                            whileHover={{ y: -5 }}
                            sx={{
                              borderRadius: '16px',
                              background: isDark 
                                ? 'rgba(15, 23, 42, 0.6)' 
                                : 'rgba(255, 255, 255, 0.8)',
                              backdropFilter: 'blur(10px)',
                              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                              boxShadow: isDark 
                                ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                              transition: 'all 0.4s ease',
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    background: isDark 
                                      ? 'rgba(37, 99, 235, 0.2)' 
                                      : 'rgba(59, 130, 246, 0.1)',
                                    color: isDark ? '#60A5FA' : '#3B82F6',
                                  }}
                                >
                                  {info.icon}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {info.title}
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {info.value}
                                  </Typography>
                                </Box>
                                {info.action && (
                                  <Tooltip title={copied ? "¡Copiado!" : "Copiar"}>
                                    <IconButton 
                                      size="small" 
                                      onClick={info.action}
                                      color={copied ? "success" : "primary"}
                                    >
                                      {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Card
                          component={motion.div}
                          whileHover={{ y: -5 }}
                          sx={{
                            borderRadius: '16px',
                            background: isDark 
                              ? 'rgba(15, 23, 42, 0.6)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                            boxShadow: isDark 
                              ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.4s ease',
                            height: '100%',
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Stack spacing={2} sx={{ height: '100%' }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    background: isDark 
                                      ? 'rgba(37, 99, 235, 0.2)' 
                                      : 'rgba(59, 130, 246, 0.1)',
                                    color: isDark ? '#60A5FA' : '#3B82F6',
                                  }}
                                >
                                  <LocationOnIcon />
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Ubicación
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Montevideo, Uruguay
                                  </Typography>
                                </Box>
                              </Stack>
                              
                              <Box sx={{ flexGrow: 1, minHeight: 200 }}>
                                <InteractiveMap />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Box>
                  </Stack>
                </motion.div>
              )}
              
              {contactMethod === 1 && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: { xs: '1', md: '2' } }}>
                      <LiveChatSimulator />
                    </Box>
                    <Box sx={{ flex: { xs: '1', md: '1' } }}>
                      <Stack spacing={3}>
                        <Card
                          component={motion.div}
                          whileHover={{ y: -5 }}
                          sx={{
                            borderRadius: '16px',
                            background: isDark 
                              ? 'rgba(15, 23, 42, 0.6)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                            boxShadow: isDark 
                              ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.4s ease',
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Beneficios del chat en vivo
                              </Typography>
                              <Stack spacing={1.5}>
                                {[
                                  { text: 'Respuesta inmediata a tus consultas', icon: <SupportAgentIcon color="primary" /> },
                                  { text: 'Disponible en horario laboral', icon: <AccessTimeIcon color="primary" /> },
                                  { text: 'Atención personalizada', icon: <ForumIcon color="primary" /> },
                                  { text: 'Posibilidad de compartir pantalla', icon: <VideocamIcon color="primary" /> }
                                ].map((item, index) => (
                                  <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 32,
                                        height: 32,
                                        borderRadius: '8px',
                                        background: isDark 
                                          ? 'rgba(37, 99, 235, 0.2)' 
                                          : 'rgba(59, 130, 246, 0.1)',
                                      }}
                                    >
                                      {item.icon}
                                    </Box>
                                    <Typography variant="body2">
                                      {item.text}
                                    </Typography>
                                  </Stack>
                                ))}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                        
                        <Card
                          component={motion.div}
                          whileHover={{ y: -5 }}
                          sx={{
                            borderRadius: '16px',
                            background: isDark 
                              ? 'rgba(15, 23, 42, 0.6)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                            boxShadow: isDark 
                              ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.4s ease',
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Horario de atención
                              </Typography>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: '12px',
                                  background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)',
                                }}
                              >
                                <Stack spacing={1}>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2">Lunes - Viernes</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>9:00 - 18:00</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2">Sábado</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>10:00 - 14:00</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2">Domingo</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Cerrado</Typography>
                                  </Stack>
                                </Stack>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Fuera de horario, puedes dejar un mensaje y te responderemos lo antes posible.
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Box>
                  </Stack>
                </motion.div>
              )}
              
              {contactMethod === 2 && (
                <motion.div
                  key="meeting"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: { xs: '1', md: '2' } }}>
                      <MeetingScheduler />
                    </Box>
                    <Box sx={{ flex: { xs: '1', md: '1' } }}>
                      <Stack spacing={3}>
                        <Card
                          component={motion.div}
                          whileHover={{ y: -5 }}
                          sx={{
                            borderRadius: '16px',
                            background: isDark 
                              ? 'rgba(15, 23, 42, 0.6)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                            boxShadow: isDark 
                              ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.4s ease',
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Tipos de reuniones
                              </Typography>
                              <Stack spacing={2}>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)',
                                  }}
                                >
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: '12px',
                                        background: isDark 
                                          ? 'rgba(37, 99, 235, 0.2)' 
                                          : 'rgba(59, 130, 246, 0.1)',
                                        color: isDark ? '#60A5FA' : '#3B82F6',
                                      }}
                                    >
                                      <VideocamIcon />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        Videollamada
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Reunión virtual con compartición de pantalla
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Box>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)',
                                  }}
                                >
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: '12px',
                                        background: isDark 
                                          ? 'rgba(37, 99, 235, 0.2)' 
                                          : 'rgba(59, 130, 246, 0.1)',
                                        color: isDark ? '#60A5FA' : '#3B82F6',
                                      }}
                                    >
                                      <PhoneIcon />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        Llamada telefónica
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Conversación directa con un especialista
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Box>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                        
                        <Card
                          component={motion.div}
                          whileHover={{ y: -5 }}
                          sx={{
                            borderRadius: '16px',
                            background: isDark 
                              ? 'rgba(15, 23, 42, 0.6)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                            boxShadow: isDark 
                              ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.4s ease',
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                ¿Por qué programar una reunión?
                              </Typography>
                              <Stack spacing={1.5}>
                                {[
                                  'Atención personalizada a tus necesidades',
                                  'Demostración en vivo de nuestro software',
                                  'Resolución de dudas específicas',
                                  'Asesoramiento profesional para tu correduría'
                                ].map((item, index) => (
                                  <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                                    <CheckCircleIcon color="primary" fontSize="small" />
                                    <Typography variant="body2">
                                      {item}
                                    </Typography>
                                  </Stack>
                                ))}
                              </Stack>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Nuestros especialistas están disponibles para ayudarte a encontrar la mejor solución para tu negocio.
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Box>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          
          {/* FAQ Section */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{ mb: 10 }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                mb: 4, 
                textAlign: 'center',
                fontWeight: 700,
              }}
            >
              Preguntas frecuentes
            </Typography>
            
            <Stack spacing={3} sx={{ maxWidth: '1000px', mx: 'auto' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      background: isDark 
                        ? 'rgba(15, 23, 42, 0.6)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      boxShadow: isDark 
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        ¿Cuál es el tiempo de respuesta habitual?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Respondemos a todos los mensajes en un plazo máximo de 24 horas laborables. Para consultas urgentes, recomendamos utilizar nuestro chat en vivo o llamar directamente a nuestro teléfono de atención al cliente.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      background: isDark 
                        ? 'rgba(15, 23, 42, 0.6)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      boxShadow: isDark 
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        ¿Puedo solicitar una demo personalizada?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ¡Por supuesto! Puedes programar una demo personalizada utilizando nuestro programador de reuniones. Un especialista te mostrará todas las funcionalidades de Assuriva adaptadas a las necesidades específicas de tu correduría.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      background: isDark 
                        ? 'rgba(15, 23, 42, 0.6)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      boxShadow: isDark 
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        ¿Ofrecen soporte técnico fuera del horario laboral?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Para clientes con plan Profesional y Enterprise, ofrecemos soporte de emergencia 24/7 para incidencias críticas. Para el resto de consultas, nuestro equipo de soporte está disponible en horario laboral.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      background: isDark 
                        ? 'rgba(15, 23, 42, 0.6)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      boxShadow: isDark 
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        ¿Cómo puedo reportar un problema técnico?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Los clientes pueden reportar incidencias técnicas a través del panel de soporte en su cuenta, por email a soporte@assuriva.com o llamando a nuestro teléfono de atención técnica. Recomendamos incluir capturas de pantalla o vídeos que muestren el problema.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            </Stack>
          </Box>
          
          {/* Final CTA */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{ 
              mb: 10,
              p: { xs: 3, md: 6 },
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.2,
                background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FFFFFF" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
                zIndex: 0,
              }}
            />
            
            <motion.div
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(59, 130, 246, 0) 0%, rgba(37, 99, 235, 0.3) 50%, rgba(59, 130, 246, 0) 100%)',
                  'linear-gradient(45deg, rgba(59, 130, 246, 0) 100%, rgba(37, 99, 235, 0.3) 50%, rgba(59, 130, 246, 0) 0%)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                ¿Listo para transformar tu correduría?
              </Typography>
              
              <Typography 
                variant="h6" 
                component="p" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Nuestro equipo está preparado para ayudarte a dar el siguiente paso en la digitalización de tu negocio
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: '#25D366',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(37, 211, 102, 0.3)',
                      '&:hover': {
                        background: '#1FAD52',
                        boxShadow: '0 15px 20px -3px rgba(37, 211, 102, 0.4)',
                      },
                      transition: 'all 0.4s ease',
                    }}
                    onClick={() => window.open('https://wa.me/+59892388748', '_blank')}
                  >
                    Contactar por WhatsApp
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<PhoneIcon />}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: '2px',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'all 0.4s ease',
                    }}
                    onClick={() => window.location.href = 'tel:+59892388748'}
                  >
                    Llamar ahora
                  </Button>
                </motion.div>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Footer />
      
      {/* Snackbars para notificaciones */}
      <Snackbar 
        open={submitSuccess} 
        autoHideDuration={5000} 
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          ¡Mensaje enviado correctamente! Te responderemos lo antes posible.
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={submitError} 
        autoHideDuration={5000} 
        onClose={() => setSubmitError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled">
          Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={copied} 
        autoHideDuration={2000} 
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          ¡Copiado al portapapeles!
        </Alert>
      </Snackbar>
    </>
  );
}
