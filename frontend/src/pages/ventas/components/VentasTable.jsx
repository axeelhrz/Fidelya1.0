import React, { useState } from 'react';
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
  Tooltip,
  Avatar,
  Stack,
  Badge,
  TablePagination,
  useTheme,
  alpha,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Person,
  ShoppingCart,
  AttachMoney,
  Receipt,
  Schedule,
  TrendingUp,
  LocalOffer,
  CreditCard,
  Info,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const VentasTable = ({ 
  ventas, 
  onEdit, 
  onView, 
  onDelete, 
  loading,
  datosRelacionados 
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpansion = (ventaId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(ventaId)) {
      newExpanded.delete(ventaId);
    } else {
      newExpanded.add(ventaId);
    }
    setExpandedRows(newExpanded);
  };

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
      return new Date(dateString).toLocaleDateString('es-UY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFormaPagoIcon = (formaPago) => {
    switch (formaPago?.toLowerCase()) {
      case 'efectivo':
        return '💵';
      case 'tarjeta':
        return '💳';
      case 'transferencia':
        return '🏦';
      case 'mixto':
        return '🔄';
      default:
        return '💰';
    }
  };

  const getClienteInfo = (clienteId, clienteNombre) => {
    if (!clienteId && !clienteNombre) {
      return { nombre: 'Venta Rápida', tipo: 'anonimo', avatar: '👤' };
    }
    
    const cliente = datosRelacionados?.clientes_activos?.find(c => c.id === clienteId);
    if (cliente) {
      return {
        nombre: cliente.nombre,
        tipo: cliente.tipo || 'regular',
        avatar: cliente.nombre.charAt(0).toUpperCase(),
        telefono: cliente.telefono,
        email: cliente.email,
        totalCompras: cliente.total_compras || 0
      };
    }
    
    return {
      nombre: clienteNombre || 'Cliente',
      tipo: 'regular',
      avatar: (clienteNombre || 'C').charAt(0).toUpperCase()
    };
  };

  const getVendedorInfo = (usuarioId, usuarioNombre) => {
    const vendedor = datosRelacionados?.vendedores_activos?.find(v => v.id === usuarioId);
    if (vendedor) {
      return {
        nombre: vendedor.nombre,
        rol: vendedor.rol,
        avatar: vendedor.nombre.charAt(0).toUpperCase(),
        ventasHoy: vendedor.ventas_hoy || 0,
        metaAlcanzada: vendedor.meta_alcanzada || false
      };
    }
    
    return {
      nombre: usuarioNombre || 'Vendedor',
      rol: 'operador',
      avatar: (usuarioNombre || 'V').charAt(0).toUpperCase()
    };
  };

  const calcularMetricas = (venta) => {
    const productos = venta.productos || [];
    const totalProductos = productos.reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const ticketPromedio = venta.total / Math.max(totalProductos, 1);
    
    return {
      totalProductos,
      ticketPromedio,
      margenEstimado: ((venta.total - (venta.total * 0.7)) / venta.total * 100) || 0,
      productosUnicos: productos.length
    };
  };

  // Ventas paginadas
  const ventasPaginadas = ventas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando ventas...</Typography>
      </Paper>
    );
  }

  if (!ventas || ventas.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No hay ventas registradas
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Detalles
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Cliente
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Vendedor
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Fecha
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Productos
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Pago
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {ventasPaginadas.map((venta, index) => {
                const clienteInfo = getClienteInfo(venta.cliente_id, venta.cliente_nombre);
                const vendedorInfo = getVendedorInfo(venta.usuario_id, venta.usuario_nombre);
                const metricas = calcularMetricas(venta);
                const isExpanded = expandedRows.has(venta.id);

                return (
                  <React.Fragment key={venta.id}>
                    <motion.tr
                      component={TableRow}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleRowExpansion(venta.id)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small">
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              #{venta.numero_venta || venta.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {metricas.productosUnicos} productos únicos
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Badge
                            badgeContent={clienteInfo.totalCompras > 10 ? '⭐' : null}
                            color="primary"
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: clienteInfo.tipo === 'vip' ? theme.palette.warning.main : theme.palette.primary.main,
                                fontSize: '0.875rem'
                              }}
                            >
                              {clienteInfo.avatar}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {clienteInfo.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {clienteInfo.tipo === 'vip' ? '👑 VIP' : 
                               clienteInfo.tipo === 'anonimo' ? '👤 Anónimo' : '👤 Regular'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Badge
                            badgeContent={vendedorInfo.metaAlcanzada ? '🎯' : null}
                            color="success"
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: vendedorInfo.rol === 'admin' ? theme.palette.error.main : theme.palette.secondary.main,
                                fontSize: '0.875rem'
                              }}
                            >
                              {vendedorInfo.avatar}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {vendedorInfo.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {vendedorInfo.ventasHoy} ventas hoy
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatDate(venta.fecha)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(venta.fecha).toLocaleTimeString('es-UY', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShoppingCart sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {metricas.totalProductos} unidades
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {metricas.productosUnicos} productos
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '1.2rem' }}>
                            {getFormaPagoIcon(venta.forma_pago)}
                          </Typography>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {venta.forma_pago?.charAt(0).toUpperCase() + venta.forma_pago?.slice(1) || 'N/A'}
                            </Typography>
                            {venta.descuento > 0 && (
                              <Typography variant="caption" color="success.main">
                                -{formatCurrency(venta.descuento)} desc.
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="h6" fontWeight={600} color="primary.main">
                            {formatCurrency(venta.total)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ticket: {formatCurrency(metricas.ticketPromedio)}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1) || 'N/A'}
                          color={getEstadoColor(venta.estado)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(venta);
                              }}
                              sx={{ color: theme.palette.info.main }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(venta);
                              }}
                              sx={{ color: theme.palette.warning.main }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(venta);
                              }}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </motion.tr>

                    {/* Fila expandida con detalles */}
                    <TableRow>
                      <TableCell colSpan={9} sx={{ p: 0, border: 'none' }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ 
                            p: 3, 
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                            borderLeft: `4px solid ${theme.palette.primary.main}`
                          }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Info color="primary" />
                              Detalles de la Venta #{venta.numero_venta || venta.id}
                            </Typography>
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 2 }}>
                              {/* Información del Cliente */}
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  👤 Información del Cliente
                                </Typography>
                                <List dense>
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                        <Person />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={clienteInfo.nombre}
                                      secondary={`Tipo: ${clienteInfo.tipo} ${clienteInfo.totalCompras ? `• ${clienteInfo.totalCompras} compras` : ''}`}
                                    />
                                  </ListItem>
                                  {clienteInfo.telefono && (
                                    <ListItem>
                                      <ListItemText
                                        primary="Teléfono"
                                        secondary={clienteInfo.telefono}
                                        sx={{ pl: 7 }}
                                      />
                                    </ListItem>
                                  )}
                                  {clienteInfo.email && (
                                    <ListItem>
                                      <ListItemText
                                        primary="Email"
                                        secondary={clienteInfo.email}
                                        sx={{ pl: 7 }}
                                      />
                                    </ListItem>
                                  )}
                                </List>
                              </Box>

                              {/* Productos Vendidos */}
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  🛒 Productos Vendidos
                                </Typography>
                                <List dense>
                                  {venta.productos?.slice(0, 5).map((producto, idx) => (
                                    <ListItem key={idx}>
                                      <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                                          <LocalOffer />
                                        </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={producto.nombre}
                                        secondary={`${producto.cantidad} ${producto.unidad} × ${formatCurrency(producto.precio_unitario)} = ${formatCurrency(producto.subtotal)}`}
                                      />
                                    </ListItem>
                                  )) || []}
                                  {venta.productos?.length > 5 && (
                                    <ListItem>
                                      <ListItemText
                                        primary={`+${venta.productos.length - 5} productos más...`}
                                        sx={{ pl: 7, fontStyle: 'italic' }}
                                      />
                                    </ListItem>
                                  )}
                                </List>
                              </Box>

                              {/* Métricas de Venta */}
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  📊 Métricas de Venta
                                </Typography>
                                <List dense>
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                                        <AttachMoney />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary="Subtotal"
                                      secondary={formatCurrency(venta.subtotal || venta.total - (venta.impuestos || 0))}
                                    />
                                  </ListItem>
                                  {venta.descuento > 0 && (
                                    <ListItem>
                                      <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                                          <LocalOffer />
                                        </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary="Descuento"
                                        secondary={formatCurrency(venta.descuento)}
                                      />
                                    </ListItem>
                                  )}
                                  {venta.impuestos > 0 && (
                                    <ListItem>
                                      <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                                          <Receipt />
                                        </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary="Impuestos"
                                        secondary={formatCurrency(venta.impuestos)}
                                      />
                                    </ListItem>
                                  )}
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                        <TrendingUp />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary="Margen Estimado"
                                      secondary={`${metricas.margenEstimado.toFixed(1)}%`}
                                    />
                                  </ListItem>
                                </List>
                              </Box>

                              {/* Información Adicional */}
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  ℹ️ Información Adicional
                                </Typography>
                                <List dense>
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                                        <Schedule />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary="Hora de Venta"
                                      secondary={new Date(venta.fecha).toLocaleTimeString('es-UY')}
                                    />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                                        <CreditCard />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary="Método de Pago"
                                      secondary={`${getFormaPagoIcon(venta.forma_pago)} ${venta.forma_pago?.charAt(0).toUpperCase() + venta.forma_pago?.slice(1)}`}
                                    />
                                  </ListItem>
                                  {venta.observaciones && (
                                    <ListItem>
                                      <ListItemText
                                        primary="Observaciones"
                                        secondary={venta.observaciones}
                                        sx={{ pl: 7 }}
                                      />
                                    </ListItem>
                                  )}
                                  <ListItem>
                                    <ListItemText
                                      primary="Ticket Promedio"
                                      secondary={formatCurrency(metricas.ticketPromedio)}
                                      sx={{ pl: 7 }}
                                    />
                                  </ListItem>
                                </List>
                              </Box>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={ventas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}
      />
    </Paper>
  );
};

export default VentasTable;