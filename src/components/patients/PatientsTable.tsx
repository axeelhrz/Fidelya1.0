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
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { Patient, EMOTIONAL_STATE_COLORS, GENDER_LABELS } from '@/types/patient';
import { User } from '@/types/auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  const sortedPatients = [...patients].sort((a, b) => {
    let aValue: string | number | Date = a[sortField] ?? '';
    let bValue: string | number | Date = b[sortField] ?? '';

    if (sortField === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortField === 'age') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar los pacientes: {error.message}
      </Alert>
    );
  }

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Edad</TableCell>
              <TableCell>Género</TableCell>
              <TableCell>Estado Emocional</TableCell>
              <TableCell>Psicólogo</TableCell>
              <TableCell>Fecha de Alta</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Skeleton variant="text" width={120} />
                  </Box>
                </TableCell>
                <TableCell><Skeleton variant="text" width={40} /></TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'fullName'}
                  direction={sortField === 'fullName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('fullName')}
                >
                  Paciente
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'age'}
                  direction={sortField === 'age' ? sortDirection : 'asc'}
                  onClick={() => handleSort('age')}
                >
                  Edad
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'gender'}
                  direction={sortField === 'gender' ? sortDirection : 'asc'}
                  onClick={() => handleSort('gender')}
                >
                  Género
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'emotionalState'}
                  direction={sortField === 'emotionalState' ? sortDirection : 'asc'}
                  onClick={() => handleSort('emotionalState')}
                >
                  Estado Emocional
                </TableSortLabel>
              </TableCell>
              <TableCell>Psicólogo Asignado</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Fecha de Alta
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {patient.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.motivoConsulta.length > 50 
                          ? `${patient.motivoConsulta.substring(0, 50)}...`
                          : patient.motivoConsulta
                        }
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {patient.age || '--'} años
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {GENDER_LABELS[patient.gender]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={patient.emotionalState}
                    size="small"
                    sx={{
                      bgcolor: EMOTIONAL_STATE_COLORS[patient.emotionalState],
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getPsychologistName(patient.assignedPsychologist)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {format(new Date(patient.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Más opciones">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, patient)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
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
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedPatient) onView(selectedPatient);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedPatient) onEdit(selectedPatient);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedPatient) onDelete(selectedPatient);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Paper>
  );
}
