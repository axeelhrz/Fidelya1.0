'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import {
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  MessageSquare,
  Phone
} from 'lucide-react';
import { PatientAnalyticsSummary } from '@/types/analytics';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientSummaryTableProps {
  patients: PatientAnalyticsSummary[];
  loading?: boolean;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof PatientAnalyticsSummary;

export default function PatientSummaryTable({ patients, loading = false }: PatientSummaryTableProps) {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('overallProgress');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrar pacientes por término de búsqueda
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.predominantEmotion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar pacientes
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return order === 'asc' ? -1 : 1;
    if (bValue == null) return order === 'asc' ? 1 : -1;

    // Manejar fechas
    if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }

    // Manejar strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Paginar resultados
  const paginatedPatients = sortedPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRiskLevelLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return 'Desconocido';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#3B82F6';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0.5) return <TrendingUp size={16} color="#10B981" />;
    if (improvement < -0.5) return <TrendingDown size={16} color="#EF4444" />;
    return <Minus size={16} color="#6B7280" />;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                height: 60,
                backgroundColor: '#F3F4F6',
                borderRadius: 1,
                animation: 'pulse 2s infinite'
              }}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(229, 231, 235, 0.3)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1C1E21',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Resumen de Pacientes
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {filteredPatients.length} pacientes
              </Typography>
            </Stack>
          </Box>

          {/* Barra de búsqueda */}
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre o estado emocional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#6B7280" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(249, 250, 251, 0.8)'
              }
            }}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                    sx={{ fontWeight: 600 }}
                  >
                    Paciente
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'totalSessions'}
                    direction={orderBy === 'totalSessions' ? order : 'asc'}
                    onClick={() => handleRequestSort('totalSessions')}
                    sx={{ fontWeight: 600 }}
                  >
                    Sesiones
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'predominantEmotion'}
                    direction={orderBy === 'predominantEmotion' ? order : 'asc'}
                    onClick={() => handleRequestSort('predominantEmotion')}
                    sx={{ fontWeight: 600 }}
                  >
                    Estado Emocional
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'activeAlerts'}
                    direction={orderBy === 'activeAlerts' ? order : 'asc'}
                    onClick={() => handleRequestSort('activeAlerts')}
                    sx={{ fontWeight: 600 }}
                  >
                    Alertas
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'lastSession'}
                    direction={orderBy === 'lastSession' ? order : 'asc'}
                    onClick={() => handleRequestSort('lastSession')}
                    sx={{ fontWeight: 600 }}
                  >
                    Última Sesión
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'overallProgress'}
                    direction={orderBy === 'overallProgress' ? order : 'asc'}
                    onClick={() => handleRequestSort('overallProgress')}
                    sx={{ fontWeight: 600 }}
                  >
                    Progreso
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPatients.map((patient, index) => (
                <TableRow
                  key={patient.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.04)'
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    style={{ display: 'contents' }}
                  >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: getRiskLevelColor(patient.riskLevel),
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {getInitials(patient.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1E21' }}>
                          {patient.name}
                        </Typography>
                        <Chip
                          label={getRiskLevelLabel(patient.riskLevel)}
                          size="small"
                          sx={{
                            backgroundColor: `${getRiskLevelColor(patient.riskLevel)}15`,
                            color: getRiskLevelColor(patient.riskLevel),
                            fontSize: '0.75rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1C1E21' }}>
                        {patient.totalSessions}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {patient.adherenceRate.toFixed(0)}% adherencia
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={patient.predominantEmotion}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3B82F6',
                          fontWeight: 500
                        }}
                      />
                      {getTrendIcon(patient.averageImprovement)}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    {patient.activeAlerts > 0 ? (
                      <Chip
                        icon={<AlertTriangle size={14} />}
                        label={patient.activeAlerts}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          fontWeight: 600
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        Sin alertas
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1E21' }}>
                        {format(patient.lastSession, 'dd MMM yyyy', { locale: es })}
                      </Typography>
                      {patient.nextSession && (
                        <Typography variant="caption" sx={{ color: '#10B981' }}>
                          Próxima: {format(patient.nextSession, 'dd MMM', { locale: es })}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1E21' }}>
                          {patient.overallProgress.toFixed(0)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {patient.overallProgress >= 80 ? 'Excelente' : 
                           patient.overallProgress >= 60 ? 'Bueno' : 
                           patient.overallProgress >= 40 ? 'Regular' : 'Necesita atención'}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={patient.overallProgress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(229, 231, 235, 0.3)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(patient.overallProgress),
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" sx={{ color: '#3B82F6' }}>
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Enviar mensaje">
                        <IconButton size="small" sx={{ color: '#10B981' }}>
                          <MessageSquare size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Llamar">
                        <IconButton size="small" sx={{ color: '#F59E0B' }}>
                          <Phone size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  </motion.div>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            borderTop: '1px solid rgba(229, 231, 235, 0.3)',
            '& .MuiTablePagination-toolbar': {
              paddingX: 3
            }
          }}
        />
      </Paper>
    </motion.div>
  );
}
