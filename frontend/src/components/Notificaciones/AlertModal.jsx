import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AlertModal = ({ 
  open, 
  onClose, 
  tipo = 'info',
  titulo,
  mensaje,
  acciones = [],
  autoClose = false,
  autoCloseDelay = 5000
}) => {
  const theme = useTheme();

  React.useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [open, autoClose, autoCloseDelay, onClose]);

  const getAlertConfig = (tipo) => {
    switch (tipo) {
      case 'error':
        return {
          icon: ErrorIcon,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          borderColor: theme.palette.error.main,
        };
      case 'warning':
        return {
          icon: WarningIcon,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          borderColor: theme.palette.warning.main,
        };
      case 'success':
        return {
          icon: SuccessIcon,
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          borderColor: theme.palette.success.main,
        };
      default:
        return {
          icon: InfoIcon,
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.1),
          borderColor: theme.palette.info.main,
        };
    }
  };

  const config = getAlertConfig(tipo);
  const IconComponent = config.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `2px solid ${config.borderColor}`,
          bgcolor: config.bgColor,
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '50%',
                  bgcolor: alpha(config.color, 0.2),
                  color: config.color,
                  animation: tipo === 'error' || tipo === 'warning' ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }}
              >
                <IconComponent />
              </Box>
              <Typography variant="h6" fontWeight={600} color={config.color}>
                {titulo}
              </Typography>
            </Box>
            
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1" color="text.primary">
            {mensaje}
          </Typography>
        </DialogContent>

        {acciones.length > 0 && (
          <DialogActions sx={{ p: 3, pt: 1 }}>
            {acciones.map((accion, index) => (
              <Button
                key={index}
                onClick={accion.onClick}
                variant={accion.variant || 'outlined'}
                color={accion.color || 'primary'}
                startIcon={accion.icon}
                disabled={accion.disabled}
              >
                {accion.label}
              </Button>
            ))}
          </DialogActions>
        )}
      </motion.div>
    </Dialog>
  );
};

export default AlertModal;