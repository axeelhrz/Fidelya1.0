import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasTable = ({ 
  compras = [], 
  onEdit, 
  onView, 
  onDelete, 
  loading = false 
}) => {
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('fecha');
  const [order, setOrder] = useState('desc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const sortedCompras = React.useMemo(() => {
    return [...compras].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === 'total') {
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

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando compras...</Typography>
      </Paper>
    );
  }

  if (compras.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          sx={{ opacity: 0.6 }}
        >
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            No hay compras registradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra tu primera compra para comenzar
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: theme.shadows[4],
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'fecha'}
                  direction={orderBy === 'fecha' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha')}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'proveedor'}
                  direction={orderBy === 'proveedor' ? order : 'asc'}
                  onClick={() => handleRequestSort('proveedor')}
                >
                  Proveedor
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleRequestSort('total')}
                >
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Productos
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Notas
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCompras.map((compra, index) => (
              <motion.tr
                key={compra.id}
                component={TableRow}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(compra.fecha)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {compra.proveedor}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {formatCurrency(compra.total)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={`${compra.cantidad_productos} productos`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {compra.notas || 'Sin notas'}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Ver detalle">
                      <IconButton
                        size="small"
                        onClick={() => onView(compra)}
                        sx={{
                          color: theme.palette.info.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                          },
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
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
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
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default ComprasTable;