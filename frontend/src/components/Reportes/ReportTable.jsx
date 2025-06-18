import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Chip,
  Skeleton,
  TableSortLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  GetApp
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ReportTable = ({ data = [], loading = false, onViewDetail }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('fecha');
  const [order, setOrder] = useState('desc');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'venta':
        return 'success';
      case 'compra':
        return 'error';
      case 'movimiento':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'venta':
        return 'Venta';
      case 'compra':
        return 'Compra';
      case 'movimiento':
        return 'Movimiento';
      default:
        return tipo;
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      if (orderBy === 'fecha') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (orderBy === 'monto') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [data, order, orderBy]);

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Movimientos Detallados
          </Typography>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Movimientos Detallados
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'fecha'}
                    direction={orderBy === 'fecha' ? order : 'asc'}
                    onClick={() => handleRequestSort('fecha')}
                  >
                    Fecha
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'tipo'}
                    direction={orderBy === 'tipo' ? order : 'asc'}
                    onClick={() => handleRequestSort('tipo')}
                  >
                    Tipo
                  </TableSortLabel>
                </TableCell>
                <TableCell>Detalle</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'monto'}
                    direction={orderBy === 'monto' ? order : 'asc'}
                    onClick={() => handleRequestSort('monto')}
                  >
                    Monto
                  </TableSortLabel>
                </TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay movimientos para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((movimiento, index) => (
                  <TableRow 
                    key={`${movimiento.tipo}-${index}`}
                    sx={{ 
                      '&:hover': { backgroundColor: 'grey.50' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(movimiento.fecha)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTipoLabel(movimiento.tipo)}
                        color={getTipoColor(movimiento.tipo)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {movimiento.detalle}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: movimiento.tipo === 'venta' ? 'success.main' : 
                                 movimiento.tipo === 'compra' ? 'error.main' : 'text.primary'
                        }}
                      >
                        {movimiento.monto > 0 ? formatCurrency(movimiento.monto) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {movimiento.responsable}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {onViewDetail && movimiento.monto > 0 && (
                        <Tooltip title="Ver detalle">
                          <IconButton 
                            size="small"
                            onClick={() => onViewDetail(movimiento)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedData.length}
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
    </motion.div>
  );
};

export default ReportTable;