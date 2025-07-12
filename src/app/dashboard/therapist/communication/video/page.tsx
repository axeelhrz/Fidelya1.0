'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useVideoCalls } from '../../../../../hooks/useVideoCalls';
import { VideoCallFilters } from '../../../../../components/clinical/video/VideoCallFilters';
import { VideoCallTable } from '../../../../../components/clinical/video/VideoCallTable';
import { VideoCallModal } from '../../../../../components/clinical/video/VideoCallModal';
import { VideoCallDetailDrawer } from '../../../../../components/clinical/video/VideoCallDetailDrawer';
import { VideoCall, CreateVideoCallData, UpdateVideoCallData } from '../../../../../types/videocall';

// Mock data para pacientes - en producción vendría de un hook
const mockPatients = [
  { id: 'patient1', name: 'María López', email: 'maria.lopez@email.com' },
  { id: 'patient2', name: 'Pedro Sánchez', email: 'pedro.sanchez@email.com' },
  { id: 'patient3', name: 'Ana García', email: 'ana.garcia@email.com' },
  { id: 'patient4', name: 'Carlos Mendoza', email: 'carlos.mendoza@email.com' },
  { id: 'patient5', name: 'Sofia Ruiz', email: 'sofia.ruiz@email.com' }
];

export default function VideoCallsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const {
    videoCalls,
    loading,
    error,
    filters,
    createVideoCall,
    updateVideoCall,
    cancelVideoCall,
    applyFilters,
    clearFilters,
    refetch
  } = useVideoCalls();

  const [modalOpen, setModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedVideoCall, setSelectedVideoCall] = useState<VideoCall | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handlers para el modal
  const handleCreateNew = () => {
    setSelectedVideoCall(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (videoCall: VideoCall) => {
    setSelectedVideoCall(videoCall);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleView = (videoCall: VideoCall) => {
    setSelectedVideoCall(videoCall);
    setDetailDrawerOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedVideoCall(null);
    setIsEditing(false);
  };

  const handleDetailDrawerClose = () => {
    setDetailDrawerOpen(false);
    setSelectedVideoCall(null);
  };

  // Handlers para acciones
  const handleSubmit = async (data: CreateVideoCallData | UpdateVideoCallData) => {
    if (isEditing && selectedVideoCall) {
      await updateVideoCall(selectedVideoCall.id, data as UpdateVideoCallData);
    } else {
      await createVideoCall(data as CreateVideoCallData);
    }
  };

  const handleCancel = async (videoCallId: string) => {
    await cancelVideoCall(videoCallId);
  };

  const handleStartCall = (videoLink: string) => {
    window.open(videoLink, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = () => {
    refetch();
  };

  if (!user) {
    return (
      <Alert severity="error">
        Debes estar autenticado para acceder a esta página.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VideoCallIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Videollamadas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Coordiná y realizá tus consultas virtuales de forma segura
              </Typography>
            </Box>
          </Box>
          
          {!isMobile && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                size="large"
              >
                Nueva Videollamada
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Stats rápidas */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'primary.light', 
            borderRadius: 2,
            minWidth: 120,
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="primary.dark">
              {videoCalls.filter(vc => vc.status === 'programada').length}
            </Typography>
            <Typography variant="body2" color="primary.dark">
              Programadas
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'success.light', 
            borderRadius: 2,
            minWidth: 120,
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="success.dark">
              {videoCalls.filter(vc => vc.status === 'confirmada').length}
            </Typography>
            <Typography variant="body2" color="success.dark">
              Confirmadas
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'warning.light', 
            borderRadius: 2,
            minWidth: 120,
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="warning.dark">
              {videoCalls.filter(vc => vc.status === 'en_curso').length}
            </Typography>
            <Typography variant="body2" color="warning.dark">
              En Curso
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Filtros */}
      <VideoCallFilters
        filters={filters}
        onFiltersChange={applyFilters}
        onClearFilters={clearFilters}
      />

      {/* Tabla de videollamadas */}
      <VideoCallTable
        videoCalls={videoCalls}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onStartCall={handleStartCall}
      />

      {/* Modal para crear/editar */}
      <VideoCallModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        videoCall={isEditing ? selectedVideoCall : null}
        patients={mockPatients}
        loading={loading}
      />

      {/* Drawer de detalles */}
      <VideoCallDetailDrawer
        open={detailDrawerOpen}
        onClose={handleDetailDrawerClose}
        videoCall={selectedVideoCall}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onStartCall={handleStartCall}
      />

      {/* FAB para móvil */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="Nueva videollamada"
          onClick={handleCreateNew}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}
