'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';

interface PolicyDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  policy: Policy | null;
  onDelete: () => Promise<void>;
}

const PolicyDeleteDialog: React.FC<PolicyDeleteDialogProps> = ({
  open,
  onClose,
  policy,
  onDelete
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  if (!policy) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '16px',
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3,
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.error.main
      }}>
        Eliminar Póliza
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <WarningIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
            </Box>
          </motion.div>
          
          <Typography 
            variant="h6" 
            gutterBottom
            fontWeight={700}
            fontFamily="Sora, sans-serif"
          >
            ¿Estás seguro de que deseas eliminar esta póliza?
          </Typography>
          
          <Typography 
            variant="body1"
            fontFamily="Inter, sans-serif"
            sx={{ mb: 2 }}
          >
            Estás a punto de eliminar la póliza <strong>{policy.policyNumber}</strong> de <strong>{policy.customerName}</strong>.
          </Typography>
          
          <Typography 
            variant="body2"
            color="error"
            fontFamily="Inter, sans-serif"
            fontWeight={500}
            sx={{ 
              p: 2, 
              borderRadius: '8px', 
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            Esta acción no se puede deshacer. Todos los datos asociados a esta póliza, incluyendo recordatorios y documentos, se eliminarán permanentemente.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
          sx={{ 
            borderRadius: '999px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
          sx={{ 
            borderRadius: '999px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
          }}
        >
          {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyDeleteDialog;