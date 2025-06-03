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
  Skeleton,
  Tooltip,
  useTheme,
  alpha,
  Avatar,
  Stack,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const VentasTable = ({ ventas, loading, onEdit, onView, onDelete }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVenta, setSelectedVenta] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('es-UY', {
          day: '2-digit',
        month: '2-digit',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('es-UY', {
          hour: '2-digit',
          minute: '2-digit'
        })
  };
    } catch (error) {
      return { date: 'Fecha inválida', time: '' };
    }
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'completada':
        return { 
          color: 'success', 
          label: 'Completada',
          icon: '✅'
  };
      case 'borrador':
        return { 
          color: 'warning', 
          label: 'Borrador',
          icon: '📝'
};
      case 'cancelada':
        return { 
          color: 'error', 
          label: 'Cancelada',
          icon: '❌'
        };
      default:
        return { 
          color: 'default', 
          label: 'Completada',
          icon: '✅'
        };
    }
  };

  const getFormaPagoConfig = (formaPago) => {
    switch (formaPago) {
      case 'efectivo':
        return { color: '#10B981', icon: '💵', label: 'Efectivo' };
      case 'tarjeta':
        return { color: '#3B82F6', icon: '💳', label: 'Tarjeta' };
      case 'transferencia':
        return { color: '#F59E0B', icon: '🏦', label: 'Transferencia' };
      case 'mixto':
        return { color: '#8B5CF6', icon: '🔄', label: 'Mixto' };
      default:
        return { color: theme.palette.grey[500], icon: '💵', label: 'Efectivo' };
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, venta) => {
    setAnchorEl(event.currentTarget);
    setSelectedVenta(venta);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVenta(null);
  };

  const handleMenuAction = (action) => {
    if (selectedVenta) {
      switch (action) {
        case 'view':
          onView(selectedVenta);
          break;
        case 'edit':
          onEdit(selectedVenta);
          break;
        case 'delete':
          onDelete(selectedVenta);
          break;
        case 'print':
          // Implementar impresión
          console.log('Imprimir venta:', selectedVenta.id);
          break;
        case 'share':
          // Implementar compartir
          console.log('Compartir venta:', selectedVenta.id);
          break;
      }
    }
    handleMenuClose();
  };

  // Filtrar ventas por término de búsqueda
  const filteredVentas = ventas.filter(venta => 
    venta.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id?.toString().includes(searchTerm)
  );

  // Paginación
  const paginatedVentas = filteredVentas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box>
        {/* Header con búsqueda skeleton */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 2 }} />
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                {['Fecha', 'Cliente', 'Productos', 'Forma de Pago', 'Total', 'Estado', 'Acciones'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 700, py: 2 }}>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(7)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton variant="text" height={40} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (!ventas || ventas.length === 0) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
            No hay ventas registradas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Las ventas aparecerán aquí una vez que comiences a registrarlas
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con búsqueda */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.02)
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            📋 Lista de Ventas
          </Typography>
          <Chip 
            label={`${filteredVentas.length} venta${filteredVentas.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <TextField
          placeholder="Buscar por cliente, vendedor o ID de venta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ 
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              '& .MuiTableCell-head': {
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }
            }}>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Productos</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Forma de Pago</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {paginatedVentas.map((venta, index) => {
                const fechaFormateada = formatDate(venta.fecha);
                const estadoConfig = getEstadoConfig(venta.estado);
                const formaPagoConfig = getFormaPagoConfig(venta.forma_pago);

                return (
                  <motion.tr
                    key={venta.id}
                    component={TableRow}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'scale(1.01)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer'
                    }}
                    onClick={() => onView(venta)}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {fechaFormateada.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {fechaFormateada.time}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            mr: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }}
                        >
                          {venta.cliente_nombre ? venta.cliente_nombre.charAt(0).toUpperCase() : <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {venta.cliente_nombre || 'Venta rápida'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            por {venta.usuario_nombre || 'Usuario desconocido'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={`${venta.cantidad_productos} producto${venta.cantidad_productos !== 1 ? 's' : ''}`}
                        size="small"
                        icon={<ShoppingCartIcon />}
                        sx={{
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            fontSize: 16
                          }
                        }}
                      />
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={formaPagoConfig.label}
                        size="small"
                        sx={{
                          backgroundColor: alpha(formaPagoConfig.color, 0.1),
                          color: formaPagoConfig.color,
                          fontWeight: 600,
                          '&::before': {
                            content: `"${formaPagoConfig.icon}"`,
                            marginRight: 1
                          }
                        }}
                      />
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: theme.palette.success.main,
                          fontSize: '1rem'
                        }}
                      >
                        {formatCurrency(venta.total)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={estadoConfig.label}
                        color={estadoConfig.color}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          '&::before': {
                            content: `"${estadoConfig.icon}"`,
                            marginRight: 1
                          }
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center" sx={{ py: 2 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver detalle" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(venta);
                            }}
                            sx={{ 
                              color: theme.palette.info.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.info.main, 0.1),
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(venta);
                            }}
                            sx={{ 
                              color: theme.palette.warning.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Más opciones" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, venta);
                            }}
                            sx={{ 
                              color: theme.palette.text.secondary,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredVentas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
          '& .MuiTablePagination-toolbar': {
            px: 3
          }
        }}
      />

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            minWidth: 200
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText primary="Ver detalle" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('print')}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Imprimir" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('share')}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Compartir" />
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleMenuAction('delete')}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default VentasTable;