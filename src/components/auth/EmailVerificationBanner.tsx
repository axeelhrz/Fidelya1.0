'use client';

import { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import { Close, Email } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

export default function EmailVerificationBanner() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { user, sendEmailVerification } = useAuth();

  // No mostrar si el email ya está verificado o no hay usuario
  if (!user || user.emailVerified || !open) {
    return null;
  }

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setSuccess(false);

    try {
      await sendEmailVerification();
      setSuccess(true);
      
      // Countdown de 60 segundos
      let timeLeft = 60;
      setCountdown(timeLeft);
      
      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapse in={open}>
      <Alert 
        severity="warning" 
        sx={{ mb: 2 }}
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              color="inherit"
              size="small"
              onClick={handleResendVerification}
              disabled={loading || countdown > 0}
              startIcon={loading ? <CircularProgress size={16} /> : <Email />}
            >
              {countdown > 0 
                ? `Reenviar en ${countdown}s` 
                : loading 
                  ? 'Enviando...' 
                  : 'Reenviar'
              }
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>Email no verificado</AlertTitle>
        Tu email <strong>{user.email}</strong> aún no ha sido verificado. 
        {success && (
          <Box component="span" sx={{ display: 'block', mt: 1, color: 'success.main' }}>
            ✓ Email de verificación enviado. Revisa tu bandeja de entrada.
          </Box>
        )}
      </Alert>
    </Collapse>
  );
}
