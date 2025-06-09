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
  Chip,
  Typography,
  Box,
  Avatar,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  TrendingUp as IngresoIcon,
  TrendingDown as EgresoIcon,
  Edit as AjusteIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatearFecha } from '../../types/inventory';

const MovimientosTable = ({ 
  movimientos = [], 
  loading = false,
  onProductoClick = null 
}) => {
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('fecha');
  const [order, setOrder] = useState('desc');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const toggleRowExpansion = (movimientoId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(movimientoId)) {
      newExpanded.delete(movimientoId);
    } else {
      newExpanded.add(movimientoId);
    }
    setExpandedRows(newExpanded);
  };

  const getTipoConfig = (tipo) => {
    switch (tipo) {
      case 'ingreso':
        return {
          icon: IngresoIcon,
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          label: 'Ingreso',
          description: 'Entrada de stock'
        };
      case 'egreso':
        return {
          icon: EgresoIcon,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          label: 'Egreso',
          description: 'Salida de stock'
        };
      case 'ajuste':
        return {
          icon: AjusteIcon,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          label: 'Ajuste',
          description: 'Corrección de stock'
        };
      default:
        return {
          icon: AjusteIcon,
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.1),
          label: 'Desconocido',
          description: 'Tipo no identificado'
        };
    }
  };

  const sortedMovimientos = React.useMemo(() => {
    return [...movimientos].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === 'fecha') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (orderBy === 'cantidad') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [movimientos, order, orderBy]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando movimientos...</Typography>
      </Paper>
    );
  }

  if (movimientos.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          sx={{ opacity: 0.6 }}
        >
          <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            No hay movimientos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Los movimientos de stock aparecerán aquí
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
                Tipo
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'producto_nombre'}
                  direction={orderBy === 'producto_nombre' ? order : 'asc'}
                  onClick={() => handleRequestSort('producto_nombre')}
                >
                  Producto
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'cantidad'}
                  direction={orderBy === 'cantidad' ? order : 'asc'}
                  onClick={() => handleRequestSort('cantidad')}
                >
                  Cantidad
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Usuario
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              >
                Detalles
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMovimientos.map((movimiento, index) => {
              const tipoConfig = getTipoConfig(movimiento.tipo);
              const isExpanded = expandedRows.has(movimiento.id);
              
              return (
                <React.Fragment key={movimiento.id}>
                  <motion.tr
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
                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {formatearFecha(movimiento.fecha).split(' ')[0]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatearFecha(movimiento.fecha).split(' ')[1]}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          sx={{
                            bgcolor: tipoConfig.bgColor,
                            color: tipoConfig.color,
                            width: 32,
                            height: 32,
                          }}
                        >
                          <tipoConfig.icon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Chip
                            label={tipoConfig.label}
                            size="small"
                            sx={{
                              bgcolor: tipoConfig.bgColor,
                              color: tipoConfig.color,
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={600}
                        sx={{
                          cursor: onProductoClick ? 'pointer' : 'default',
                          '&:hover': onProductoClick ? {
                            color: theme.palette.primary.main,
                            textDecoration: 'underline'
                          } : {}
                        }}
                        onClick={() => onProductoClick && onProductoClick(movimiento)}
                      >
                        {movimiento.producto_nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {movimiento.unidad}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        color={tipoConfig.color}
                      >
                        {movimiento.tipo === 'egreso' ? '-' : '+'}{movimiento.cantidad}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {movimiento.unidad}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">
                          {movimiento.usuario_nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Tooltip title={isExpanded ? "Ocultar detalles" : "Ver detalles"}>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(movimiento.id)}
                          sx={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                  
                  {/* Fila expandida con detalles */}
                  <TableRow>
                    <TableCell 
                      colSpan={6} 
                      sx={{ 
                        py: 0,
                        borderBottom: isExpanded ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}
                    >
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 1 }}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(tipoConfig.color, 0.05),
                              border: `1px solid ${alpha(tipoConfig.color, 0.2)}`,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Detalles del Movimiento
                            </Typography>
                            
                            <Box display="flex" flexWrap="wrap" gap={3}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Tipo de Movimiento
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {tipoConfig.description}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Fecha y Hora
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {formatearFecha(movimiento.fecha)}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Usuario Responsable
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {movimiento.usuario_nombre}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {movimiento.motivo && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Motivo
                                </Typography>
                                <Typography variant="body2">
                                  {movimiento.motivo}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default MovimientosTable;