'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Tooltip,
  TablePagination,
  Skeleton,
  Alert,
  Stack,
  alpha,
  useTheme,
  Fade,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Person,
  CalendarToday,
  Psychology,
  Circle,
} from '@mui/icons-material';
import { Patient, EMOTIONAL_STATE_COLORS, GENDER_LABELS } from '@/types/patient';
import { User } from '@/types/auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

interface PatientsTableProps {
  patients: Patient[];
  psychologists: User[];
  loading: boolean;
  error: Error | null;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onView: (patient: Patient) => void;
}

type SortField = 'fullName' | 'age' | 'gender' | 'emotionalState' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function PatientsTable({
  patients,
  psychologists,
  loading,
  error,
  onEdit,
  onDelete,
  onView
}: PatientsTableProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patient: Patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const getPsychologistName = (uid: string) => {
    const psychologist = psychologists.find(p => p.uid === uid);
    return psychologist?.displayName || 'No asignado';
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

  const convertTimestampToDate = (value: Date | Timestamp | string | number): Date => {
    if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      return value.toDate();
    }
    if (value instanceof Date) {
      return value;
    }
    return new Date(value as string | number);
  };

  const sortedPatients = [...patients].sort((a, b) => {
    let aValue: string | number | Date | Timestamp = a[sortField] ?? '';
    let bValue: string | number | Date | Timestamp = b[sortField] ?? '';

    // Convert Timestamp to Date if needed
    if (sortField === 'createdAt') {
      aValue = convertTimestampToDate(aValue).getTime();
      bValue = convertTimestampToDate(bValue).getTime();
    } else {
      // Handle other Timestamp fields
      if (aValue && typeof aValue === 'object' && 'toDate' in aValue && typeof aValue.toDate === 'function') {
        aValue = aValue.toDate();
      }
      if (bValue && typeof bValue === 'object' && 'toDate' in bValue && typeof bValue.toDate === 'function') {
        bValue = bValue.toDate();
      }
    }

    if (sortField === 'age') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedPatients = sortedPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCreatedAt = (createdAt: Date | Timestamp | string) => {
    try {
      let date: Date;
      if (createdAt instanceof Timestamp) {
        date = createdAt.toDate();
      } else if (typeof createdAt === 'string') {
        date = new Date(createdAt);
      } else {
        date = createdAt;
      }
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (error) {
    return (
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          background: alpha(theme.palette.error.main, 0.05)
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          Error al cargar los pacientes: {error.message}
        </Alert>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: alpha(theme.palette.primary.main, 0.02) }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Paciente</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Edad</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Género</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Estado Emocional</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Psicólogo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Fecha de Alta</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box>
                        <Skeleton variant="text" width={140} height={20} />
                        <Skeleton variant="text" width={200} height={16} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={60} height={20} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} height={20} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={90} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={120} height={20} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                  <TableCell><Skeleton variant="circular" width={36} height={36} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (patients.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 6, 
          borderRadius: 4,
          textAlign: 'center',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
        </Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Todavía no hay pacientes registrados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comienza haciendo clic en &quot;Nuevo Paciente&quot; para registrar tu primer caso clínico.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow 
              sx={{ 
                background: alpha(theme.palette.primary.main, 0.03),
                '& .MuiTableCell-head': {
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }
              }}
            >
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                <TableSortLabel
                  active={sortField === 'fullName'}
                  direction={sortField === 'fullName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('fullName')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    }
                  }}
                >
                  Paciente
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                <TableSortLabel
                  active={sortField === 'age'}
                  direction={sortField === 'age' ? sortDirection : 'asc'}
                  onClick={() => handleSort('age')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    }
                  }}
                >
                  Edad
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                <TableSortLabel
                  active={sortField === 'gender'}
                  direction={sortField === 'gender' ? sortDirection : 'asc'}
                  onClick={() => handleSort('gender')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    }
                  }}
                >
                  Género
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                <TableSortLabel
                  active={sortField === 'emotionalState'}
                  direction={sortField === 'emotionalState' ? sortDirection : 'asc'}
                  onClick={() => handleSort('emotionalState')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    }
                  }}
                >
                  Estado Emocional
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                Psicólogo Asignado
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('createdAt')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                    }
                  }}
                >
                  Fecha de Alta
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient, index) => (
              <Fade in timeout={300 + index * 50} key={patient.id}>
                <TableRow 
                  hover
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.02),
                      transform: 'translateX(4px)',
                    },
                    '&:hover .patient-avatar': {
                      transform: 'scale(1.1)',
                    }
                  }}
                  onClick={() => onView(patient)}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        className="patient-avatar"
                        sx={{ 
                          width: 48, 
                          height: 48,
                          background: `linear-gradient(135deg, ${getAvatarColor(patient.fullName)} 0%, ${alpha(getAvatarColor(patient.fullName), 0.8)} 100%)`,
                          fontWeight: 600,
                          fontSize: '1rem',
                          transition: 'transform 0.2s ease-in-out',
                        }}
                      >
                        {getPatientInitials(patient.fullName)}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight={600}
                          sx={{ 
                            color: 'text.primary',
                            lineHeight: 1.2,
                            mb: 0.5
                          }}
                        >
                          {patient.fullName}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            lineHeight: 1.3,
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {patient.motivoConsulta}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {patient.age || '--'} años
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {GENDER_LABELS[patient.gender]}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      icon={<Circle sx={{ fontSize: '12px !important' }} />}
                      label={patient.emotionalState}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${EMOTIONAL_STATE_COLORS[patient.emotionalState]} 0%, ${alpha(EMOTIONAL_STATE_COLORS[patient.emotionalState], 0.8)} 100%)`,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: 2,
                        '& .MuiChip-icon': {
                          color: 'white',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Psychology sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {getPsychologistName(patient.assignedPsychologist)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {formatCreatedAt(patient.createdAt)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Tooltip title="Más opciones">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, patient);
                        }}
                        sx={{
                          borderRadius: 2,
                          background: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.2),
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        <MoreVert sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </Fade>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedPatients.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.5),
          '& .MuiTablePagination-toolbar': {
            px: 3,
            py: 2,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 500,
            color: 'text.secondary',
          }
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            mt: 1,
            minWidth: 180,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
            boxShadow: theme.shadows[8],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            if (selectedPatient) onView(selectedPatient);
            handleMenuClose();
          }}
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            my: 0.5,
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <Visibility sx={{ mr: 2, fontSize: 18, color: 'primary.main' }} />
          <Typography variant="body2" fontWeight={500}>
            Ver Detalles
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedPatient) onEdit(selectedPatient);
            handleMenuClose();
          }}
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            my: 0.5,
            '&:hover': {
              background: alpha(theme.palette.info.main, 0.1),
            }
          }}
        >
          <Edit sx={{ mr: 2, fontSize: 18, color: 'info.main' }} />
          <Typography variant="body2" fontWeight={500}>
            Editar
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedPatient) onDelete(selectedPatient);
            handleMenuClose();
          }}
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            my: 0.5,
            '&:hover': {
              background: alpha(theme.palette.warning.main, 0.1),
            }
          }}
        >
          <Delete sx={{ mr: 2, fontSize: 18, color: 'warning.main' }} />
          <Typography variant="body2" fontWeight={500}>
            Marcar Inactivo
          </Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
}