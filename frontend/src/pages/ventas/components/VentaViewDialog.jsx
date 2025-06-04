import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  alpha,
  Tooltip,
  Stack,
  LinearProgress,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close,
  AttachMoney,
  Receipt,
  LocalOffer,
  TrendingUp,
  Assessment,
  Star,
  ExpandMore,
  Print,
  Share,
  Download,
  Analytics,
  Timeline,
  Inventory,
} from '@mui/icons-material';
import { ventasService } from '../../../services/ventasService';

const VentaViewDialog = ({ open, onClose, venta, datosRelacionados }) => {
  const theme = useTheme();
  const [ventaCompleta, setVentaCompleta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analisisVenta, setAnalisisVenta] = useState(null);

  useEffect(() => {
    if (open && venta?.id) {
      cargarDetallesCompletos();
    }
  }, [open, venta?.id]);

  const cargarDetallesCompletos = async () => {
    setLoading(true);
    try {
      // Cargar detalles completos de la venta
      const detalles = await ventasService.obtenerVenta(venta.id);
      setVentaCompleta(detalles);
      
      // Generar análisis de la venta
      generarAnalisisVenta(detalles);
    } catch (error) {
      console.error('Error cargando detalles de venta:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarAnalisisVenta = (ventaData) => {
    if (!ventaData || !ventaData.productos) return;

    const productos = ventaData.productos;
    const totalProductos = productos.reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const ticketPromedio = ventaData.total / Math.max(totalProductos, 1);
    const margenEstimado = ((ventaData.total - (ventaData.total * 0.7)) / ventaData.total * 100) || 0;
    
    // Análisis por categorías
    const categorias = {};
    productos.forEach(producto => {
      const categoria = producto.categoria || 'otros';
      if (!categorias[categoria]) {
        categorias[categoria] = { cantidad: 0, valor: 0, productos: 0 };
      }
      categorias[categoria].cantidad += producto.cantidad || 0;
      categorias[categoria].valor += producto.subtotal || 0;
      categorias[categoria].productos += 1;
    });

    // Producto más caro y más barato
    const productoMasCaro = productos.reduce((max, p) => 
      (p.precio_unitario || 0) > (max.precio_unitario || 0) ? p : max, productos[0] || {});
    const productoMasBarato = productos.reduce((min, p) => 
      (p.precio_unitario || 0) < (min.precio_unitario || 0) ? p : min, productos[0] || {});

    setAnalisisVenta({
      totalProductos,
      ticketPromedio,
      margenEstimado,
      categorias,
      productoMasCaro,
      productoMasBarato,
      productosUnicos: productos.length,
      valorPromedioPorProducto: ventaData.total / productos.length,
      eficienciaVenta: (totalProductos / productos.length) * 100 // Productos por línea
    });
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
        second: '2-digit',
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

  const getCategoriaIcon = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case 'frutas':
        return '🍎';
      case 'verduras':
        return '🥬';
      case 'otros':
        return '📦';
      default:
        return '🛒';
    }
  };

  const getClienteInfo = () => {
    if (!ventaCompleta) return { nombre: 'Cargando...', tipo: 'regular', avatar: '?' };
    
    if (!ventaCompleta.cliente_id && !ventaCompleta.cliente_nombre) {
      return { nombre: 'Venta Rápida', tipo: 'anonimo', avatar: '👤' };
    }
    
    const cliente = datosRelacionados?.clientes_activos?.find(c => c.id === ventaCompleta.cliente_id);
    if (cliente) {
      return {
        nombre: cliente.nombre,
        tipo: cliente.tipo || 'regular',
        avatar: cliente.nombre.charAt(0).toUpperCase(),
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion,
        totalCompras: cliente.total_compras || 0,
        ultimaCompra: cliente.ultima_compra
      };
    }
    
    return {
      nombre: ventaCompleta.cliente_nombre || 'Cliente',
      tipo: 'regular',
      avatar: (ventaCompleta.cliente_nombre || 'C').charAt(0).toUpperCase()
    };
  };

  const getVendedorInfo = () => {
    if (!ventaCompleta) return { nombre: 'Cargando...', rol: 'operador', avatar: '?' };
    
    const vendedor = datosRelacionados?.vendedores_activos?.find(v => v.id === ventaCompleta.usuario_id);
    if (vendedor) {
      return {
        nombre: vendedor.nombre,
        rol: vendedor.rol,
        avatar: vendedor.nombre.charAt(0).toUpperCase(),
        ventasHoy: vendedor.ventas_hoy || 0,
        metaAlcanzada: vendedor.meta_alcanzada || false,
        experiencia: vendedor.experiencia || 'Nuevo'
      };
    }
    
    return {
      nombre: ventaCompleta.usuario_nombre || 'Vendedor',
      rol: 'operador',
      avatar: (ventaCompleta.usuario_nombre || 'V').charAt(0).toUpperCase()
    };
  };

  if (!venta) return null;

  const clienteInfo = getClienteInfo();
  const vendedorInfo = getVendedorInfo();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <Receipt />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Detalle de Venta #{venta.numero_venta || venta.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(venta.fecha)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Imprimir">
            <IconButton size="small">
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compartir">
            <IconButton size="small">
              <Share />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar">
            <IconButton size="small">
              <Download />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Cargando detalles completos...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            {/* Resumen Principal */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Badge
                        badgeContent={clienteInfo.totalCompras > 10 ? '⭐' : null}
                        color="primary"
                      >
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                          {clienteInfo.avatar}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {clienteInfo.nombre}
                        </Typography>
                        <Chip 
                          label={clienteInfo.tipo === 'vip' ? '👑 VIP' : 
                                clienteInfo.tipo === 'anonimo' ? '👤 Anónimo' : '👤 Regular'}
                          size="small"
                          color={clienteInfo.tipo === 'vip' ? 'warning' : 'default'}
                        />
                      </Box>
                    </Box>
                    {clienteInfo.telefono && (
                      <Typography variant="body2" color="text.secondary">
                        📞 {clienteInfo.telefono}
                      </Typography>
                    )}
                    {clienteInfo.email && (
                      <Typography variant="body2" color="text.secondary">
                        ✉️ {clienteInfo.email}
                      </Typography>
                    )}
                    {clienteInfo.totalCompras > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        🛒 {clienteInfo.totalCompras} compras realizadas
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Badge
                        badgeContent={vendedorInfo.metaAlcanzada ? '🎯' : null}
                        color="success"
                      >
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 48, height: 48 }}>
                          {vendedorInfo.avatar}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {vendedorInfo.nombre}
                        </Typography>
                        <Chip 
                          label={vendedorInfo.rol.charAt(0).toUpperCase() + vendedorInfo.rol.slice(1)}
                          size="small"
                          color={vendedorInfo.rol === 'admin' ? 'error' : 'secondary'}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      📊 {vendedorInfo.ventasHoy} ventas hoy
                    </Typography>
                    {vendedorInfo.experiencia && (
                      <Typography variant="body2" color="text.secondary">
                        🏆 {vendedorInfo.experiencia}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, width: 48, height: 48 }}>
                        <AttachMoney />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {formatCurrency(venta.total)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total de la venta
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>
                        {getFormaPagoIcon(venta.forma_pago)}
                      </Typography>
                      <Typography variant="body2">
                        {venta.forma_pago?.charAt(0).toUpperCase() + venta.forma_pago?.slice(1)}
                      </Typography>
                    </Box>
                    <Chip
                      label={venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1)}
                      color={getEstadoColor(venta.estado)}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Análisis de Venta */}
            {analisisVenta && (
              <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Análisis de Venta
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                          {analisisVenta.totalProductos}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Productos Vendidos
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {formatCurrency(analisisVenta.ticketPromedio)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ticket Promedio
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                          {analisisVenta.margenEstimado.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Margen Estimado
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="info.main">
                          {analisisVenta.eficienciaVenta.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Eficiencia
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Análisis por Categorías */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Distribución por Categorías
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(analisisVenta.categorias).map(([categoria, datos]) => (
                        <Grid item xs={12} sm={4} key={categoria}>
                          <Card sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                              <Typography sx={{ fontSize: '2rem', mb: 1 }}>
                                {getCategoriaIcon(categoria)}
                              </Typography>
                              <Typography variant="h6" fontWeight={600}>
                                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {datos.productos} productos • {datos.cantidad} unidades
                              </Typography>
                              <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                                {formatCurrency(datos.valor)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Productos Vendidos */}
            <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Productos Vendidos ({ventaCompleta?.productos?.length || 0})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Precio Unit.</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ventaCompleta?.productos?.map((producto, index) => (
                        <TableRow key={index} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>
                                {getCategoriaIcon(producto.categoria)}
                              </Typography>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {producto.nombre}
                                </Typography>
                                {producto.descripcion && (
                                  <Typography variant="caption" color="text.secondary">
                                    {producto.descripcion}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={producto.categoria?.charAt(0).toUpperCase() + producto.categoria?.slice(1)}
                              size="small"
                              color={producto.categoria === 'frutas' ? 'success' : 
                                     producto.categoria === 'verduras' ? 'info' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {producto.cantidad} {producto.unidad}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {formatCurrency(producto.precio_unitario)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {formatCurrency(producto.subtotal)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            {/* Resumen Financiero */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline color="primary" />
                  Resumen Financiero
                
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                            <AttachMoney />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Subtotal"
                          secondary={formatCurrency(ventaCompleta?.subtotal || (venta.total - (venta.impuestos || 0)))}
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
                            primary="Descuento Aplicado"
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
                            primary="Impuestos (IVA)"
                            secondary={formatCurrency(venta.impuestos)}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <TrendingUp />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Total Final"
                          secondary={
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                              {formatCurrency(venta.total)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                            <Assessment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Método de Pago"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>
                                {getFormaPagoIcon(venta.forma_pago)}
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {venta.forma_pago?.charAt(0).toUpperCase() + venta.forma_pago?.slice(1)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {analisisVenta && (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                              <Star />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Margen Estimado"
                            secondary={`${analisisVenta.margenEstimado.toFixed(1)}% de ganancia`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>

                {/* Información Adicional */}
                {(venta.observaciones || ventaCompleta?.numero_factura) && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Información Adicional
                      </Typography>
                      {venta.observaciones && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Observaciones:</strong> {venta.observaciones}
                        </Typography>
                      )}
                      {ventaCompleta?.numero_factura && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Número de Factura:</strong> {ventaCompleta.numero_factura}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Fecha y Hora:</strong> {formatDate(venta.fecha)}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => {
                // Implementar impresión
                console.log('Imprimir venta:', venta.id);
              }}
            >
              Imprimir
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {
                // Implementar descarga
                console.log('Descargar venta:', venta.id);
              }}
            >
              Descargar
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ minWidth: 120 }}
          >
            Cerrar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default VentaViewDialog;