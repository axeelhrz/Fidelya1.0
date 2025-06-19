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
  Stack,
  useTheme,
  alpha,
  Fade,
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
  const theme = useTheme();
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

  const getPatientInfo = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient || null;
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

  const getStatusColor = (status: Session['status']): 'success' | 'info' | 'error' | 'warning' | 'secondary' | 'default' => {
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

  const getPatientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

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
      <Alert 
        severity="error" 
        sx={{ 
          mt: 2,
          borderRadius: 'xl',
          '& .MuiAlert-message': {
            fontWeight: 500
          }
        }}
      >
        Error al cargar las sesiones: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {loading && (
        <LinearProgress 
          sx={{ 
            borderRadius: 'xl',
            height: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 'xl',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
            }
          }} 
        />
      )}
      
      <TableContainer 
        sx={{ 
          maxHeight: 'calc(100vh - 400px)',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.grey[300], 0.2),
            borderRadius: 'xl',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 'xl',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <TableSortLabel
                  active={sortField === 'date'}
                  direction={sortField === 'date' ? sortDirection : 'asc'}
                  onClick={() => handleSort('date')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  Fecha y Hora
                </TableSortLabel>
              </TableCell>
              <TableCell 
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <TableSortLabel
                  active={sortField === 'patientName'}
                  direction={sortField === 'patientName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('patientName')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  Paciente
                </TableSortLabel>
              </TableCell>
              <TableCell 
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <TableSortLabel
                  active={sortField === 'professionalName'}
                  direction={sortField === 'professionalName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('professionalName')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  Profesional
                </TableSortLabel>
              </TableCell>
              <TableCell 
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <TableSortLabel
                  active={sortField === 'type'}
                  direction={sortField === 'type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('type')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  Tipo
                </TableSortLabel>
              </TableCell>
              <TableCell 
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <TableSortLabel
                  active={sortField === 'duration'}
                  direction={sortField === 'duration' ? sortDirection : 'asc'}
                  onClick={() => handleSort('duration')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  Duración
                </TableSortLabel>
              </TableCell>
              <TableCell 
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortField === 'status' ? sortDirection : 'asc'}
                  onClick={() => handleSort('status')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  Estado
                </TableSortLabel>
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Análisis IA
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack spacing={1}>
                      <Skeleton variant="text" width={120} height={20} />
                      <Skeleton variant="text" width={80} height={16} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Stack spacing={0.5}>
                        <Skeleton variant="text" width={140} height={20} />
                        <Skeleton variant="text" width={100} height={16} />
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={120} height={20} />
                    </Stack>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} height={20} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={90} height={28} /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                </TableRow>
              ))
            ) : paginatedSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Stack spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <PsychologyIcon sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                      No se encontraron sesiones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ajusta los filtros o crea una nueva sesión para comenzar
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSessions.map((session, index) => {
                const patient = getPatientInfo(session.patientId);
                const patientName = getPatientName(session.patientId);
                
                return (
                  <Fade in timeout={300 + index * 50} key={session.id}>
                    <TableRow 
                      hover
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                          transform: 'translateX(4px)',
                          '& .MuiTableCell-root': {
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                          }
                        },
                        '& .MuiTableCell-root': {
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                          py: 2,
                        }
                      }}
                      onClick={() => onView?.(session)}
                    >
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={600}>
                            {format(new Date(session.date), 'dd/MM/yyyy', { locale: es })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(session.date), 'HH:mm', { locale: es })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              bgcolor: getAvatarColor(patientName),
                              background: `linear-gradient(135deg, ${getAvatarColor(patientName)} 0%, ${alpha(getAvatarColor(patientName), 0.8)} 100%)`,
                            }}
                          >
                            {getPatientInitials(patientName)}
                          </Avatar>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" fontWeight={600}>
                              {patientName}
                            </Typography>
                            {patient && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" color="text.secondary">
                                  {patient.age} años
                                </Typography>
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: EMOTIONAL_TONE_COLORS[patient.emotionalState] || theme.palette.grey[400],
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {patient.emotionalState}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PsychologyIcon 
                            sx={{ 
                              fontSize: 16, 
                              color: theme.palette.primary.main,
                              opacity: 0.7 
                            }} 
                          />
                          <Typography variant="body2">
                            {getProfessionalName(session.professionalId)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={SESSION_TYPE_LABELS[session.type]}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 'xl',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            color: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={500}>
                            {session.duration ? `${session.duration} min` : '-'}
                          </Typography>
                          {session.duration && (
                            <Box
                              sx={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: session.duration >= 60 
                                  ? theme.palette.success.main 
                                  : session.duration >= 45 
                                    ? theme.palette.warning.main 
                                    : theme.palette.error.main,
                              }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(session.status)}
                          label={SESSION_STATUS_LABELS[session.status]}
                          color={getStatusColor(session.status)}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 'xl',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            '& .MuiChip-icon': {
                              fontSize: '0.875rem',
                            }
                          }}
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        {session.aiProcessingStatus === 'processing' ? (
                          <Tooltip title="Procesando análisis...">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <SmartToyIcon 
                                sx={{ 
                                  color: theme.palette.warning.main,
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 },
                                  }
                                }} 
                              />
                            </Box>
                          </Tooltip>
                        ) : session.aiAnalysis ? (
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <Tooltip title={`Análisis IA disponible - Confianza: ${AIUtils.formatConfidence(session.aiAnalysis.confidence)}`}>
                              <SmartToyIcon 
                                sx={{ 
                                  color: theme.palette.success.main,
                                  fontSize: 20,
                                }} 
                              />
                            </Tooltip>
                            {session.aiAnalysis.emotionalTone && (
                              <Tooltip title={`Estado emocional: ${session.aiAnalysis.emotionalTone}`}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: EMOTIONAL_TONE_COLORS[session.aiAnalysis.emotionalTone],
                                    border: `1px solid ${alpha('white', 0.3)}`,
                                  }}
                                />
                              </Tooltip>
                            )}
                            {session.aiAnalysis.riskLevel && session.aiAnalysis.riskLevel !== 'low' && (
                              <Tooltip title={`Nivel de riesgo: ${session.aiAnalysis.riskLevel}`}>
                                <WarningIcon 
                                  sx={{ 
                                    color: RISK_LEVEL_COLORS[session.aiAnalysis.riskLevel],
                                    fontSize: 16,
                                  }} 
                                />
                              </Tooltip>
                            )}
                          </Stack>
                        ) : session.aiProcessingStatus === 'failed' ? (
                          <Tooltip title="Error en el análisis de IA">
                            <WarningIcon sx={{ color: theme.palette.error.main }} />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Sin análisis de IA">
                            <Box sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>-</Box>
                          </Tooltip>
                        )}
                      </TableCell>
                      
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, session)}
                          sx={{
                            borderRadius: 'xl',
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </Fade>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box 
        sx={{ 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: 'blur(20px)',
        }}
      >
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
          sx={{
            '& .MuiTablePagination-toolbar': {
              px: 3,
              py: 2,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 500,
              color: 'text.secondary',
            },
            '& .MuiTablePagination-select': {
              borderRadius: 'xl',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              '&:focus': {
                borderRadius: 'xl',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }
            },
            '& .MuiTablePagination-actions button': {
              borderRadius: 'xl',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }
            }
          }}
        />
      </Box>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 'xl',
            mt: 1,
            minWidth: 200,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 20px 25px -5px ${alpha(theme.palette.common.black, 0.1)}, 0 8px 10px -6px ${alpha(theme.palette.common.black, 0.1)}`,
          }
        }}
      >
        <MenuItem 
          onClick={() => { onView?.(selectedSession!); handleMenuClose(); }}
          sx={{ 
            borderRadius: 'xl', 
            mx: 1, 
            my: 0.5,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <VisibilityIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          Ver Detalles
        </MenuItem>
        
        {hasPermission('canManagePatients') && (
          <MenuItem 
            onClick={() => { onEdit?.(selectedSession!); handleMenuClose(); }}
            sx={{ 
              borderRadius: 'xl', 
              mx: 1, 
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.info.main, 0.1),
              }
            }}
          >
            <EditIcon sx={{ mr: 2, color: theme.palette.info.main }} />
            Editar Sesión
          </MenuItem>
        )}
        
        {selectedSession?.aiAnalysis && onReprocessAI && (
          <MenuItem 
            onClick={() => { onReprocessAI(selectedSession!); handleMenuClose(); }}
            sx={{ 
              borderRadius: 'xl', 
              mx: 1, 
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
              }
            }}
          >
            <SmartToyIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
            Reprocesar IA
          </MenuItem>
        )}
        
        {hasPermission('canManagePatients') && (
          <MenuItem 
            onClick={() => { onDelete?.(selectedSession!); handleMenuClose(); }}
            sx={{ 
              borderRadius: 'xl', 
              mx: 1, 
              my: 0.5,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              }
            }}
          >
            <DeleteIcon sx={{ mr: 2 }} />
            Eliminar
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}