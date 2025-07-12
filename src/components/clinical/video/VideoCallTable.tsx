'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
  Alert
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  ContentCopy as CopyIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { VideoCall } from '../../../types/videocall';
import { VideoCallStatusBadge } from './VideoCallStatusBadge';
import { VideoCallActions } from './VideoCallActions';

interface VideoCallTableProps {
  videoCalls: VideoCall[];
  loading: boolean;
  error: string | null;
  onView: (videoCall: VideoCall) => void;
  onEdit: (videoCall: VideoCall) => void;
  onCancel: (videoCallId: string) => void;
  onStartCall: (videoLink: string) => void;
}

export const VideoCallTable: React.FC<VideoCallTableProps> = ({
  videoCalls,
  loading,
  error,
  onView,
  onEdit,
  onCancel,
  onStartCall
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCopyLink = async (videoLink: string, videoCallId: string) => {
    try {
      await navigator.clipboard.writeText(videoLink);
      setCopySuccess(videoCallId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const paginatedVideoCalls = videoCalls.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={1}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon fontSize="small" />
                  Fecha y Hora
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  Paciente
                </Box>
              </TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoCallIcon fontSize="small" />
                  Enlace
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotesIcon fontSize="small" />
                  Motivo
                </Box>
              </TableCell>
              <TableCell>Duración</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={100} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                </TableRow>
              ))
            ) : paginatedVideoCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <VideoCallIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No hay videollamadas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Crea tu primera videollamada para comenzar
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedVideoCalls.map((videoCall) => (
                <TableRow key={videoCall.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDateTime(videoCall.startDateTime)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {videoCall.platform.toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {videoCall.patientName}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <VideoCallStatusBadge status={videoCall.status} size="small" />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 150, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {videoCall.videoLink}
                      </Typography>
                      <Tooltip title={copySuccess === videoCall.id ? 'Copiado!' : 'Copiar enlace'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyLink(videoCall.videoLink, videoCall.id)}
                          color={copySuccess === videoCall.id ? 'success' : 'default'}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={videoCall.motive}
                    >
                      {videoCall.motive}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDuration(videoCall.duration)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <VideoCallActions
                      videoCall={videoCall}
                      onView={onView}
                      onEdit={onEdit}
                      onCancel={onCancel}
                      onStartCall={onStartCall}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={videoCalls.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Paper>
  );
};
