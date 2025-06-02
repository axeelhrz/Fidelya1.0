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
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Skeleton,
  TableSortLabel,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasTable = ({ compras, loading, onEdit, onView, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('fecha');
  const [order, setOrder] = useState('desc');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedCompras = React.useMemo(() => {
    if (!compras) return [];
    
    return [...compras].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      if (orderBy === 'fecha') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (orderBy === 'total') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [compras, order, orderBy]);

  const paginatedCompras = sortedCompras.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Proveedor', 'Fecha', 'Comprobante', 'Productos', 'Total', 'Acciones'].map((header) => (
                <TableCell key={header}>
                  <Skeleton variant="text" width={80} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
                    <Skeleton variant="text" width={120} />
                  </Box>
                </TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="text" width={60} /></TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!compras || compras.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay compras registradas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Las compras que registres aparecerán aquí
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                <TableSortLabel
                  active={orderBy === 'proveedor_nombre'}
                  direction={orderBy === 'proveedor_nombre' ? order : 'asc'}
                  onClick={() => handleRequestSort('proveedor_nombre')}
                >
                  Proveedor
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                <TableSortLabel
                  active={orderBy === 'fecha'}
                  direction={orderBy === 'fecha' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha')}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                Comprobante
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', textAlign: 'center' }}>
                Productos
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', textAlign: 'right' }}>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleRequestSort('total')}
                >
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCompras.map((compra, index) => (
              <motion.tr
                key={compra.id}
                component={TableRow}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32,
                        mr: 2,
                        fontSize: '0.875rem',
                      }}
                    >
                      <BusinessIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {compra.proveedor_nombre || 'Sin proveedor'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {compra.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(compra.fecha)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  {compra.nro_comprobante ? (
                    <Chip
                      label={compra.nro_comprobante}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Sin comprobante
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell align="center">
                  <Chip
                    label={`${compra.cantidad_productos || 0} items`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: 'success.main',
                      fontSize: '1rem',
                    }}
                  >
                    {formatCurrency(compra.total)}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={() => onView(compra)}
                        sx={{
                          color: 'info.main',
                          '&:hover': { bgcolor: 'info.light', color: 'white' },
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Editar compra">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(compra)}
                        sx={{
                          color: 'warning.main',
                          '&:hover': { bgcolor: 'warning.light', color: 'white' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Eliminar compra">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(compra)}
                        sx={{
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.light', color: 'white' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={sortedCompras.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      />
    </Box>
  );
};

export default ComprasTable;