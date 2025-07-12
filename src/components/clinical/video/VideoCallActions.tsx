'use client';

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  VideoCall as VideoCallIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { VideoCall } from '../../../types/videocall';

interface VideoCallActionsProps {
  videoCall: VideoCall;
  onView: (videoCall: VideoCall) => void;
  onEdit: (videoCall: VideoCall) => void;
  onCancel: (videoCallId: string) => void;
  onStartCall: (videoLink: string) => void;
}

export const VideoCallActions: React.FC<VideoCallActionsProps> = ({
  videoCall,
  onView,
  onEdit,
  onCancel,
  onStartCall
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoCall.videoLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      handleMenuClose();
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleStartCall = () => {
    onStartCall(videoCall.videoLink);
    handleMenuClose();
  };

  const handleView = () => {
    onView(videoCall);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(videoCall);
    handleMenuClose();
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmCancel = () => {
    onCancel(videoCall.id);
    setCancelDialogOpen(false);
  };

  const canStartCall = videoCall.status === 'confirmada' || videoCall.status === 'programada';
  const canEdit = videoCall.status !== 'finalizada' && videoCall.status !== 'cancelada';
  const canCancel = videoCall.status === 'programada' || videoCall.status === 'confirmada';

  return (
    <>
      <Tooltip title="Más acciones">
        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>

        {canStartCall && (
          <MenuItem onClick={handleStartCall}>
            <ListItemIcon>
              <VideoCallIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Iniciar videollamada</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {copySuccess ? 'Enlace copiado!' : 'Copiar enlace'}
          </ListItemText>
        </MenuItem>

        {canEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        )}

        {canCancel && (
          <MenuItem onClick={handleCancelClick}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancelar</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de confirmación para cancelar */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancelar Videollamada</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas cancelar la videollamada con{' '}
            <strong>{videoCall.patientName}</strong> programada para el{' '}
            {videoCall.startDateTime.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}?
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.dark">
              Esta acción no se puede deshacer. Se notificará al paciente sobre la cancelación.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            No, mantener
          </Button>
          <Button 
            onClick={handleConfirmCancel} 
            color="error" 
            variant="contained"
          >
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
