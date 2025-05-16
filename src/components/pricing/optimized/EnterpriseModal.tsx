import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';

interface EnterpriseContactModalProps {
  open: boolean;
  onClose: () => void;
}

const EnterpriseContactModal: React.FC<EnterpriseContactModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulamos envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
    
    // Reiniciar después de 3 segundos
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={!submitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Solicitar información sobre plan Enterprise
      </DialogTitle>
      
      <DialogContent>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Completa el formulario y un asesor especializado te contactará en menos de 24 horas para diseñar una solución personalizada para tu correduría.
              </Typography>
              
              <TextField
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              
              <TextField
                label="Email profesional"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              
              <TextField
                label="Empresa"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              
              <TextField
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="Mensaje (opcional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Cuéntanos sobre tu correduría y necesidades específicas"
              />
            </Stack>
          </form>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <VerifiedIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              ¡Solicitud enviada con éxito!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nos pondremos en contacto contigo en menos de 24 horas.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      {!submitted && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            disabled={submitting}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
          >
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EnterpriseContactModal;