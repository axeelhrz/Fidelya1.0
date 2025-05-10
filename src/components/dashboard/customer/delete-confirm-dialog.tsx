import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  customerName,
}) => {
  const theme = useTheme();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography 
          variant="h6"
          fontFamily="'Sora', sans-serif"
          fontWeight={600}
          color="error"
        >
          Eliminar cliente
        </Typography>
        
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <DeleteForeverIcon sx={{ fontSize: 40 }} />
          </Box>
          
          <Typography 
            variant="h5" 
            gutterBottom
            fontFamily="'Sora', sans-serif"
            fontWeight={700}
          >
            ¿Estás seguro?
          </Typography>
          
          <Typography 
            variant="body1"
            fontFamily="'Sora', sans-serif"
          >
            Estás a punto de eliminar al cliente <strong>{customerName}</strong>. Esta acción no se puede deshacer.
          </Typography>
        </Box>
        
        <Alert 
          severity="warning"
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontFamily: "'Sora', sans-serif",
            }
          }}
        >
          Al eliminar este cliente, también se eliminarán todas sus etiquetas, recordatorios y asociaciones con pólizas.
        </Alert>
      </DialogContent>
      
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            py: 1,
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{
            borderRadius: 2,
            py: 1,
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;