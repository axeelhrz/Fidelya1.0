import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Skeleton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const VentasTable = ({ ventas, loading, onEdit, onView, onDelete }) => {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-UY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada':
        return 'success';
      case 'borrador':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFormaPagoColor = (formaPago) => {
    switch (formaPago) {
      case 'efectivo':
        return '#4CAF50';
      case 'tarjeta':
        return '#2196F3';
      case 'transferencia':
        return '#FF9800';
      case 'mixto':
        return '#9C27B0';
      default:
        return theme.palette.grey[500];
    }
  };

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Productos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Forma de Pago</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!ventas || ventas.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <ShoppingCartIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay ventas registradas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Las ventas aparecerán aquí una vez que comiences a registrarlas
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Productos</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Forma de Pago</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ventas.map((venta, index) => (
            <motion.tr
              key={venta.id}
              component={TableRow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatDate(venta.fecha)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: theme.palette.grey[500], fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {venta.cliente_nombre || 'Venta rápida'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {venta.usuario_nombre || 'Usuario desconocido'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={`${venta.cantidad_productos} producto${venta.cantidad_productos !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 500
                  }}
                />
              </TableCell>
              
              <TableCell>
                <Chip
                  label={venta.forma_pago?.toUpperCase() || 'EFECTIVO'}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getFormaPagoColor(venta.forma_pago), 0.1),
                    color: getFormaPagoColor(venta.forma_pago),
                    fontWeight: 500
                  }}
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                  {formatCurrency(venta.total)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={venta.estado?.toUpperCase() || 'COMPLETADA'}
                  size="small"
                  color={getEstadoColor(venta.estado)}
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="Ver detalle">
                    <IconButton
                      size="small"
                      onClick={() => onView(venta)}
                      sx={{ color: theme.palette.info.main }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(venta)}
                      sx={{ color: theme.palette.warning.main }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(venta)}
                      sx={{ color: theme.palette.error.main }}
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
  );
};

export default VentasTable;