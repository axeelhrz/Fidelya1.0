import React, { useState, useMemo } from 'react';
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
  useTheme,
  alpha,
  Badge,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ComprasTable = ({ compras, loading, onEdit, onView, onDelete }) => {
  const theme = useTheme();
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

  // Función mejorada para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función mejorada para formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '';
    }
  };

  // Función mejorada para formatear moneda
  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '$0.00';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numericAmount);
  };

  // Función para obtener el color del proveedor
  const getProveedorColor = (index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    return colors[index % colors.length];
  };

  // Función para obtener el color del método de pago
  const getMetodoPagoColor = (metodo) => {
    const colores = {
      efectivo: '#10B981',
      transferencia: '#3B82F6',
      cheque: '#F59E0B',
      credito: '#8B5CF6'
    };
    return colores[metodo?.toLowerCase()] || '#6B7280';
  };

  // Función para obtener el emoji del método de pago
  const getMetodoPagoEmoji = (metodo) => {
    const emojis = {
      efectivo: '💵',
      transferencia: '🏦',
      cheque: '📝',
      credito: '💳'
    };
    return emojis[metodo?.toLowerCase()] || '💰';
  };

  // Función para generar número de comprobante si no existe
  const getNumeroComprobante = (compra) => {
    if (compra.numero_comprobante && compra.numero_comprobante !== 'Sin número') {
      return compra.numero_comprobante;
    }
    // Generar número basado en ID y fecha
    const fecha = new Date(compra.fecha);
    const year = fecha.getFullYear().toString().slice(-2);
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const id = String(compra.id || Math.floor(Math.random() * 1000)).padStart(4, '0');
    return `COMP-${year}${month}-${id}`;
  };

  // Función para validar y obtener ID
  const getCompraId = (compra) => {
    return compra.id || `temp-${Date.now()}`;
  };

  // Función para obtener nombre del proveedor
  const getProveedorNombre = (compra) => {
    return compra.proveedor_nombre || compra.proveedor?.nombre || 'Proveedor no especificado';
  };

  // Función para obtener método de pago
  const getMetodoPago = (compra) => {
    return compra.metodo_pago || 'efectivo';
  };

  // Función para contar productos
  const getProductosCount = (compra) => {
    if (Array.isArray(compra.detalles)) {
      return compra.detalles.length;
    }
    if (Array.isArray(compra.productos)) {
      return compra.productos.length;
    }
    return 0;
  };

  // Memoizar compras ordenadas para mejor rendimiento
  const sortedCompras = useMemo(() => {
    if (!Array.isArray(compras)) return [];
    
    return [...compras].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      // Manejar casos especiales de ordenamiento
      if (orderBy === 'fecha') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (orderBy === 'total') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (orderBy === 'proveedor_nombre') {
        aValue = getProveedorNombre(a).toLowerCase();
        bValue = getProveedorNombre(b).toLowerCase();
      } else if (orderBy === 'numero_comprobante') {
        aValue = getNumeroComprobante(a).toLowerCase();
        bValue = getNumeroComprobante(b).toLowerCase();
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [compras, order, orderBy]);

  // Memoizar compras paginadas
  const paginatedCompras = useMemo(() => {
    return sortedCompras.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedCompras, page, rowsPerPage]);

  // Componente de loading
  if (loading) {
    return (
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                {['ID', 'Proveedor', 'Fecha', 'Comprobante', 'Productos', 'Total', 'Acciones'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 700, color: 'text.primary' }}>
                    <Skeleton variant="text" width={100} height={24} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width={60} height={20} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box>
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width={80} height={16} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} height={24} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
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
      </Box>
    );
  }

  // Componente de estado vacío
  if (!Array.isArray(compras) || compras.length === 0) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              mx: 'auto',
              mb: 3,
            }}
          >
            <ReceiptIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
            No hay compras registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Las compras que registres aparecerán aquí. Comienza creando tu primera compra para ver el historial completo.
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': { 
                      color: 'primary.main !important' 
                    }
                  }}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableSortLabel
                  active={orderBy === 'proveedor_nombre'}
                  direction={orderBy === 'proveedor_nombre' ? order : 'asc'}
                  onClick={() => handleRequestSort('proveedor_nombre')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': { 
                      color: 'primary.main !important' 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    Proveedor
                  </Box>
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableSortLabel
                  active={orderBy === 'fecha'}
                  direction={orderBy === 'fecha' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': { 
                      color: 'primary.main !important' 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    Fecha
                  </Box>
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableSortLabel
                  active={orderBy === 'numero_comprobante'}
                  direction={orderBy === 'numero_comprobante' ? order : 'asc'}
                  onClick={() => handleRequestSort('numero_comprobante')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': { 
                      color: 'primary.main !important' 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon fontSize="small" />
                    Comprobante
                  </Box>
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <TrendingUpIcon fontSize="small" />
                  Productos
                </Box>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'right', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleRequestSort('total')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': { 
                      color: 'primary.main !important' 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <AttachMoneyIcon fontSize="small" />
                    Total
                  </Box>
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {paginatedCompras.map((compra, index) => {
                const compraId = getCompraId(compra);
                const proveedorNombre = getProveedorNombre(compra);
                const numeroComprobante = getNumeroComprobante(compra);
                const metodoPago = getMetodoPago(compra);
                const productosCount = getProductosCount(compra);
                
                return (
                  <motion.tr
                    key={compraId}
                    component={TableRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'scale(1.001)',
                      },
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => onView && onView(compra)}
                  >
                    {/* ID */}
                    <TableCell>
                      <Chip
                        label={`#${compraId}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                      />
                    </TableCell>

                    {/* Proveedor */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            background: `linear-gradient(135deg, ${getProveedorColor(index)} 0%, ${getProveedorColor(index)}CC 100%)`,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            boxShadow: `0 2px 8px ${alpha(getProveedorColor(index), 0.3)}`,
                          }}
                        >
                          {proveedorNombre.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {proveedorNombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {compra.proveedor_id || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Fecha */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatDate(compra.fecha)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(compra.fecha)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Comprobante */}
                    <TableCell>
                      <Chip
                        label={numeroComprobante}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderColor: alpha(theme.palette.info.main, 0.3),
                          color: 'info.main',
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                          }
                        }}
                      />
                    </TableCell>

                    {/* Productos */}
                    <TableCell align="center">
                      <Badge
                        badgeContent={productosCount}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }
                        }}
                      >
                        <Chip
                          icon={<TrendingUpIcon />}
                          label="Items"
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: 'success.main',
                            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                          }}
                        />
                      </Badge>
                    </TableCell>

                    {/* Total */}
                    <TableCell align="right">
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'success.main',
                            mb: 0.5,
                          }}
                        >
                          {formatCurrency(compra.total)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                            {getMetodoPagoEmoji(metodoPago)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {metodoPago}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Ver detalles" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView && onView(compra);
                            }}
                            sx={{
                              color: 'info.main',
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.info.main, 0.2),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar compra" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit && onEdit(compra);
                            }}
                            sx={{
                              color: 'warning.main',
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar compra" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete && onDelete(compra);
                            }}
                            sx={{
                              color: 'error.main',
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Información de error si hay problemas con los datos */}
      {Array.isArray(compras) && compras.length > 0 && paginatedCompras.length === 0 && (
        <Alert 
          severity="warning" 
          icon={<ErrorIcon />}
          sx={{ m: 2 }}
        >
          No se encontraron compras que coincidan con los criterios de búsqueda actuales.
        </Alert>
      )}

      {/* Paginación moderna */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Mostrando {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, sortedCompras.length)} de {sortedCompras.length} compras
        </Typography>
        
        <TablePagination
          component="div"
          count={sortedCompras.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 0,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 500,
              color: 'text.secondary',
            },
            '& .MuiTablePagination-select': {
              fontWeight: 600,
            },
            '& .MuiIconButton-root': {
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-disabled': {
                color: 'text.disabled',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ComprasTable;