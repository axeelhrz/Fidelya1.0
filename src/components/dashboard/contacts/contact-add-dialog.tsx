import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useContacts } from '@/hooks/use-contacts';

// Estilos personalizados
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.9 : 1),
    backdropFilter: 'blur(10px)'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.8),
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.7 : 0.9)
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1)
    }
  }
}));

interface ContactAddDialogProps {
  open: boolean;
  onClose: () => void;
}

const ContactAddDialog: React.FC<ContactAddDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { sendRequest, canAddMore, planLimits } = useContacts();
  
  // Resetear estado al abrir/cerrar
  useEffect(() => {
    if (open) {
      setEmail('');
      setError(null);
      setSuccess(null);
      setIsSubmitting(false);
    }
  }, [open]);
  
  // Manejar cambio de email
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null);
  };
  
  // Validar email
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  // Manejar envío de solicitud
  const handleSubmit = async () => {
    // Validar email
    if (!email) {
      setError('Por favor, ingresa un correo electrónico');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    // Verificar límite de contactos
    if (!canAddMore) {
      setError(`Has alcanzado el límite de ${planLimits.maxContacts} contactos para tu plan`);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await sendRequest(email);
      
      if (result.success) {
        setSuccess('Solicitud enviada correctamente');
        // Cerrar después de 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar la solicitud';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" fontWeight={600}>
          Agregar contacto
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ingresa el correo electrónico del corredor que deseas agregar a tus contactos.
          </Typography>
          
          <StyledTextField
            autoFocus
            margin="dense"
            label="Correo electrónico"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            error={!!error}
            helperText={error}
            disabled={isSubmitting || !!success}
            sx={{ mb: 2 }}
          />
          
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    mb: 2
                  }}
                >
                  <Typography variant="body2">{success}</Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Typography variant="caption" color="text.secondary">
            Límite de contactos: {planLimits.maxContacts} (Plan {planLimits.maxContacts === 10 ? 'Basic' : planLimits.maxContacts === 100 ? 'Pro' : 'Enterprise'})
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting || !!success || !email}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ContactAddDialog;