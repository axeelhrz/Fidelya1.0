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
  TableSortLabel,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Alert,
  Skeleton,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Psychology as PsychologyIcon,
  SmartToy as SmartToyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  PersonOff as PersonOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Session, SESSION_STATUS_LABELS, SESSION_TYPE_LABELS, EMOTIONAL_TONE_COLORS, RISK_LEVEL_COLORS } from '@/types/session';
import { Patient } from '@/types/patient';
import { User } from '@/types/auth';
import { useRole } from '@/hooks/useRole';
import { AIUtils } from '@/services/aiService';

interface SessionsTableProps {
  sessions: Session[];
  patients: Patient[];
  professionals: User[];
  loading?: boolean;
  error?: Error | null;
  onEdit?: (session: Session) => void;
  onView?: (session: Session) => void;
  onDelete?: (session: Session) => void;
  onReprocessAI?: (session: Session) => void;
}

type SortField = 'date' | 'patientName' | 'professionalName' | 'status' | 'type' | 'duration';
type SortDirection = 'asc' | 'desc';

export default function SessionsTable({
  sessions,
  patients,
  professionals,
  loading = false,
  error,
  onEdit,
  onView,
  onDelete,
  onReprocessAI
}: SessionsTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { hasPermission } = useRole();

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, session: Session) => {
    setAnchorEl(event.currentTarget);
    setSelectedSession(session);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSession(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.fullName || 'Paciente no encontrado';
  };

  const getProfessionalName = (professionalId: string) => {
    const professional = professionals.find(p => p.uid === professionalId);
    return professional?.displayName || 'Profesional no encontrado';
  };

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'scheduled':
        return <ScheduleIcon fontSize="small" />;
      case 'cancelled':
        return <CancelIcon fontSize="small" />;
      case 'no-show':
        return <PersonOffIcon fontSize="small" />;
      case 'rescheduled':
        return <RefreshIcon fontSize="small" />;
      default:
        return <ScheduleIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'warning';
      case 'rescheduled':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'patientName':
        aValue = getPatientName(a.patientId).toLowerCase();
        bValue = getPatientName(b.patientId).toLowerCase();
        break;
      case 'professionalName':
        aValue = getProfessionalName(a.professionalId).toLowerCase();
        bValue = getProfessionalName(b.professionalId).toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'duration':
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedSessions = sortedSessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar las sesiones: {error.message}
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {loading && <LinearProgress />}
      
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'date'}
                  direction={sortField === 'date' ? sortDirection : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  Fecha y Hora
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'patientName'}
                  direction={sortField === 'patientName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('patientName')}
                >
                  Paciente
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'professionalName'}
                  direction={sortField === 'professionalName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('professionalName')}
                >
                  Profesional
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'type'}
                  direction={sortField === 'type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('type')}
                >
                  Tipo
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'duration'}
                  direction={sortField === 'duration' ? sortDirection : 'asc'}
                  onClick={() => handleSort('duration')}
                >
                  Duración
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortField === 'status' ? sortDirection : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Estado
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Análisis IA</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={130} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                  <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                </TableRow>
              ))
            ) : paginatedSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron sesiones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSessions.map((session) => (
                <TableRow key={session.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {format(new Date(session.date), 'dd/MM/yyyy', { locale: es })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(session.date), 'HH:mm', { locale: es })}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '0.875rem' }}>
                        {getPatientName(session.patientId).split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {getPatientName(session.patientId)}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PsychologyIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {getProfessionalName(session.professionalId)}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {SESSION_TYPE_LABELS[session.type]}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {session.duration ? `${session.duration} min` : '-'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(session.status)}
                      label={SESSION_STATUS_LABELS[session.status]}
                      color={getStatusColor(session.status) as any}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    {session.aiProcessingStatus === 'processing' ? (
                      <Tooltip title="Procesando análisis...">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <SmartToyIcon sx={{ color: 'warning.main', animation: 'pulse 2s infinite' }} />
                        </Box>
                      </Tooltip>
                    ) : session.aiAnalysis ? (
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <Tooltip title={`Análisis IA disponible - Confianza: ${AIUtils.formatConfidence(session.aiAnalysis.confidence)}`}>
                          <SmartToyIcon sx={{ color: 'success.main' }} />
                        </Tooltip>
                        {session.aiAnalysis.emotionalTone && (
                          <Tooltip title={`Estado emocional: ${session.aiAnalysis.emotionalTone}`}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: EMOTIONAL_TONE_COLORS[session.aiAnalysis.emotionalTone],
                              }}
                            />
                          </Tooltip>
                        )}
                        {session.aiAnalysis.riskLevel && session.aiAnalysis.riskLevel !== 'low' && (
                          <Tooltip title={`Nivel de riesgo: ${session.aiAnalysis.riskLevel}`}>
                            <WarningIcon 
                              sx={{ 
                                color: RISK_LEVEL_COLORS[session.aiAnalysis.riskLevel],
                                fontSize: 16 
                              }} 
                            />
                          </Tooltip>
                        )}
                      </Box>
                    ) : session.aiProcessingStatus === 'failed' ? (
                      <Tooltip title="Error en el análisis de IA">
                        <WarningIcon sx={{ color: 'error.main' }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Sin análisis de IA">
                        <Box sx={{ color: 'text.disabled' }}>-</Box>
                      </Tooltip>
                    )}
                  </TableCell>
                  
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, session)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={sessions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { onView?.(selectedSession!); handleMenuClose(); }}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        
        {hasPermission('canManagePatients') && (
          <MenuItem onClick={() => { onEdit?.(selectedSession!); handleMenuClose(); }}>
            <EditIcon sx={{ mr: 1 }} />
            Editar Sesión
          </MenuItem>
        )}
        
        {selectedSession?.aiAnalysis && onReprocessAI && (
          <MenuItem onClick={() => { onReprocessAI(selectedSession!); handleMenuClose(); }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            Reprocesar IA
          </MenuItem>
        )}
        
        {hasPermission('canManagePatients') && (
          <MenuItem 
            onClick={() => { onDelete?.(selectedSession!); handleMenuClose(); }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}
