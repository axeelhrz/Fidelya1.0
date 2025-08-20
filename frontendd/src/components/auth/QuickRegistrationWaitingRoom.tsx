'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Divider, TextField, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import PingPongIcon from '@mui/icons-material/SportsBaseball';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsIcon from '@mui/icons-material/Sports';
import axios from '@/lib/axios';

const StyledCard = styled(Card)(({  }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  position: 'relative',
}));

const PulseIcon = styled(Box)(({  }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(34, 197, 94, 0.3)',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 1,
    },
    '100%': {
      transform: 'translate(-50%, -50%) scale(1.4)',
      opacity: 0,
    },
  },
}));

interface RegistrationData {
  id: number;
  registration_code: string;
  full_name: string;
  status: string;
  status_label: string;
  status_color: string;
  days_waiting: number;
  club_summary: string;
  location_summary: string;
  playing_side_label: string | null;
  playing_style_label: string | null;
  racket_summary: {
    brand: string | null;
    model: string | null;
  };
  drive_rubber_summary: {
    brand: string | null;
    model: string | null;
    type: string | null;
    color: string | null;
  };
  backhand_rubber_summary: {
    brand: string | null;
    model: string | null;
    type: string | null;
    color: string | null;
  };
  created_at: string;
  contacted_at: string | null;
  approved_at: string | null;
}

interface QuickRegistrationWaitingRoomProps {
  registrationCode?: string;
  initialData?: RegistrationData;
}

const QuickRegistrationWaitingRoom: React.FC<QuickRegistrationWaitingRoomProps> = ({ 
  registrationCode,
  initialData
}) => {
  const [email, setEmail] = useState('');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearch, setShowSearch] = useState(!initialData && !registrationCode);

  useEffect(() => {
    if (registrationCode && !initialData) {
      // Si tenemos un código de registro pero no datos iniciales, podríamos buscar por código
      // Por ahora, solo mostramos el formulario de búsqueda por email
      setShowSearch(true);
    }
  }, [registrationCode, initialData]);

  const handleSearchByEmail = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/registro-rapido/waiting-room-status', {
        email: email.trim()
      });

      if (response.data.found) {
        setRegistrationData(response.data.data);
        setShowSearch(false);
      } else {
        setError('No se encontró ningún registro con este email');
      }
    } catch (error: any) {
      console.error('Error al buscar registro:', error);
      setError('Error al buscar el registro. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'contacted': return '#3B82F6';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AccessTimeIcon />;
      case 'contacted': return <EmailIcon />;
      case 'approved': return <CheckCircleIcon />;
      case 'rejected': return <CheckCircleIcon />;
      default: return <AccessTimeIcon />;
    }
  };

  if (showSearch) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledCard>
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <PulseIcon sx={{ display: 'inline-block', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#22C55E',
                    color: 'white',
                    mx: 'auto',
                  }}
                >
                  <PingPongIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </PulseIcon>
              
              <Typography
                variant="h3"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sala de Espera
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  mb: 4,
                }}
              >
                Censo de Tenis de Mesa Ecuador
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Ingresa tu email para consultar el estado de tu registro en el censo
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email de registro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchByEmail()}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearchByEmail}
                  disabled={loading}
                  startIcon={<SearchIcon />}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    backgroundColor: '#22C55E',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                    '&:hover': {
                      backgroundColor: '#16A34A',
                      boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                    },
                  }}
                >
                  {loading ? 'Buscando...' : 'Consultar Estado'}
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </motion.div>
      </Box>
    );
  }

  if (!registrationData) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledCard>
          <CardContent sx={{ p: 5 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <PulseIcon sx={{ display: 'inline-block', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#22C55E',
                    color: 'white',
                    mx: 'auto',
                  }}
                >
                  <PingPongIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </PulseIcon>
              
              <Typography
                variant="h3"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ¡Hola, {registrationData.full_name}!
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                Censo de Tenis de Mesa Ecuador
              </Typography>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1,
                  backgroundColor: `${getStatusColor(registrationData.status)}20`,
                  color: getStatusColor(registrationData.status),
                  borderRadius: 2,
                  border: `1px solid ${getStatusColor(registrationData.status)}40`,
                }}
              >
                {getStatusIcon(registrationData.status)}
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {registrationData.status_label}
                </Typography>
              </Box>
            </Box>

            {/* Registration Info */}
            <Box
              sx={{
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 3,
                p: 4,
                mb: 4,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#22C55E',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '1.25rem',
                }}
              >
                📋 Información de tu Registro
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Código de Registro
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#22C55E' }}>
                    {registrationData.registration_code}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Días en espera
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {registrationData.days_waiting} días
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Personal Info */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PersonIcon /> Información Personal
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Ubicación
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {registrationData.location_summary}
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <SportsIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Club
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {registrationData.club_summary}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Playing Style */}
            {(registrationData.playing_side_label || registrationData.playing_style_label) && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  🏓 Estilo de Juego
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  {registrationData.playing_side_label && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Lado de Juego
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {registrationData.playing_side_label}
                      </Typography>
                    </Box>
                  )}
                  
                  {registrationData.playing_style_label && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Tipo de Juego
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {registrationData.playing_style_label}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Equipment */}
            {(registrationData.racket_summary.brand || registrationData.drive_rubber_summary.brand || registrationData.backhand_rubber_summary.brand) && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  🏓 Equipamiento
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                  {registrationData.racket_summary.brand && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Raqueta
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {registrationData.racket_summary.brand}
                      </Typography>
                      {registrationData.racket_summary.model && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {registrationData.racket_summary.model}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {registrationData.drive_rubber_summary.brand && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Caucho Drive
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {registrationData.drive_rubber_summary.brand}
                      </Typography>
                      {registrationData.drive_rubber_summary.model && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {registrationData.drive_rubber_summary.model}
                        </Typography>
                      )}
                      {registrationData.drive_rubber_summary.color && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Color: {registrationData.drive_rubber_summary.color}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {registrationData.backhand_rubber_summary.brand && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Caucho Back
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {registrationData.backhand_rubber_summary.brand}
                      </Typography>
                      {registrationData.backhand_rubber_summary.model && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {registrationData.backhand_rubber_summary.model}
                        </Typography>
                      )}
                      {registrationData.backhand_rubber_summary.color && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Color: {registrationData.backhand_rubber_summary.color}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Status Message */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                ¿Qué sigue?
              </Typography>
              
              {registrationData.status === 'pending' && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  Tu registro está siendo revisado por nuestro equipo. Te contactaremos pronto 
                  para confirmar tu participación en el censo de tenis de mesa de Ecuador.
                </Typography>
              )}
              
              {registrationData.status === 'contacted' && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  ¡Genial! Ya hemos establecido contacto contigo. Estamos procesando tu información 
                  para incluirte oficialmente en el censo.
                </Typography>
              )}
              
              {registrationData.status === 'approved' && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  ¡Felicitaciones! Tu registro ha sido aprobado y ahora formas parte oficial 
                  del censo de tenis de mesa de Ecuador.
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setRegistrationData(null);
                  setShowSearch(true);
                  setEmail('');
                  setError('');
                }}
                sx={{
                  height: 48,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: '#22C55E',
                  color: '#22C55E',
                  '&:hover': {
                    borderColor: '#16A34A',
                    backgroundColor: 'rgba(34, 197, 94, 0.04)',
                  },
                }}
              >
                Consultar Otro Registro
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.href = '/'}
                sx={{
                  height: 48,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  backgroundColor: '#22C55E',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    backgroundColor: '#16A34A',
                    boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                  },
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </motion.div>
    </Box>
  );
};

export default QuickRegistrationWaitingRoom;