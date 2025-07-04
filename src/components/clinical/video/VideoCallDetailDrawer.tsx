'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Close as CloseIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  Notes as NotesIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  Computer as PlatformIcon
} from '@mui/icons-material';
import { VideoCall } from '../../../types/videocall';
import { VideoCallStatusBadge } from './VideoCallStatusBadge';

interface VideoCallDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  videoCall: VideoCall | null;
  onEdit: (videoCall: VideoCall) => void;
  onCancel: (videoCallId: string) => void;
  onStartCall: (videoLink: string) => void;
}

export const VideoCallDetailDrawer: React.FC<VideoCallDetailDrawerProps> = ({
  open,
  onClose,
  videoCall,
  onEdit,
  onCancel,
  onStartCall
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  if (!videoCall) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoCall.videoLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleStartCall = () => {
    onStartCall(videoCall.videoLink);
  };

  const handleEdit = () => {
    onEdit(videoCall);
    onClose();
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    onCancel(videoCall.id);
    setCancelDialogOpen(false);
    onClose();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const canStartCall = videoCall.status === 'confirmada' || videoCall.status === 'programada';
  const canEdit = videoCall.status !== 'finalizada' && videoCall.status !== 'cancelada';
  const canCancel = videoCall.status === 'programada' || videoCall.status === 'confirmada';

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 480 } }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <VideoCallIcon color="primary" />
                <Typography variant="h6">
                  Detalles de Videollamada
                </Typography>
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <VideoCallStatusBadge status={videoCall.status} />
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            <Stack spacing={3}>
              {/* Información del paciente */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6">Información del Paciente</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {videoCall.patientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {videoCall.patientId}
                  </Typography>
                </CardContent>
              </Card>

              {/* Información de la cita */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="h6">Información de la Cita</Typography>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Fecha y Hora"
                        secondary={formatDateTime(videoCall.startDateTime)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <TimerIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Duración"
                        secondary={formatDuration(videoCall.duration)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <PlatformIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Plataforma"
                        secondary={videoCall.platform.toUpperCase()}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Enlace de videollamada */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LinkIcon color="primary" />
                    <Typography variant="h6">Enlace de Videollamada</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'grey.200',
                    mb: 2
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all',
                        fontFamily: 'monospace'
                      }}
                    >
                      {videoCall.videoLink}
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CopyIcon />}
                      onClick={handleCopyLink}
                      color={copySuccess ? 'success' : 'primary'}
                    >
                      {copySuccess ? 'Copiado!' : 'Copiar Enlace'}
                    </Button>
                    
                    {canStartCall && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VideoCallIcon />}
                        onClick={handleStartCall}
                      >
                        Iniciar Llamada
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Motivo y notas */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <NotesIcon color="primary" />
                    <Typography variant="h6">Motivo y Notas</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Motivo de la consulta:
                    </Typography>
                    <Typography variant="body2">
                      {videoCall.motive}
                    </Typography>
                  </Box>
                  
                  {videoCall.notes && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Notas adicionales:
                      </Typography>
                      <Typography variant="body2">
                        {videoCall.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Información adicional */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6">Información Adicional</Typography>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Profesional asignado"
                        secondary={videoCall.professionalName}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText
                        primary="Creado el"
                        secondary={videoCall.createdAt.toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText
                        primary="Última actualización"
                        secondary={videoCall.updatedAt.toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText
                        primary="Recordatorio enviado"
                        secondary={videoCall.reminderSent ? 'Sí' : 'No'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Alertas según el estado */}
              {videoCall.status === 'programada' && (
                <Alert severity="info">
                  La videollamada está programada. Se enviará un recordatorio automático 24 horas antes.
                </Alert>
              )}
              
              {videoCall.status === 'en_curso' && (
                <Alert severity="warning">
                  La videollamada está actualmente en curso.
                </Alert>
              )}
              
              {videoCall.status === 'cancelada' && (
                <Alert severity="error">
                  Esta videollamada ha sido cancelada.
                </Alert>
              )}
            </Stack>
          </Box>

          {/* Actions */}
          <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={2}>
              {canEdit && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  fullWidth
                >
                  Editar
                </Button>
              )}
              
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelClick}
                  fullWidth
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Drawer>

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
            {formatDateTime(videoCall.startDateTime)}?
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
