import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Skeleton,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TreeMap
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ReporteInventario = ({ datos, loading }) => {
  const [tabActiva, setTabActiva] = useState(0);

  // Colores para estados de stock
  const coloresEstado = {
    'sin_stock': '#f44336',
    'stock_bajo': '#ff9800',
    'normal': '#4caf50',
    'excedente': '#2196f3'
  };

  // Colores para categorías
  const coloresCategoria = {
    'frutas': '#ff9800',
    'verduras': '#4caf50',
    'otros': '#2196f3'
  };

  // Formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor || 0);
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    try {
      return format(new Date(fecha), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return fecha;
    }
  };

  // Obtener icono por estado
  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'sin_stock':
        return <ErrorIcon sx={{ color: coloresEstado[estado] }} />;
      case 'stock_bajo':
        return <WarningIcon sx={{ color: coloresEstado[estado] }} />;
      case 'normal':
        return <CheckCircleIcon sx={{ color: coloresEstado[estado] }} />;
      case 'excedente':
        return <TrendingDownIcon sx={{ color: coloresEstado[estado] }} />;
      default:
        return <InventoryIcon />;
    }
  };

  // Obtener texto del estado
  const obtenerTextoEstado = (estado) => {
    const textos = {
      'sin_stock': 'Sin Stock',
      'stock_bajo': 'Stock Bajo',
      'normal': 'Normal',
      'excedente': 'Excedente'
    };
    return textos[estado] || estado;
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Skeleton variant="text" width="50%" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} sx={{ mt: 3, borderRadius: 2 }} />
      </Paper>
    );
  }

  if (!datos) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay datos de inventario disponibles.
        </Alert>
      </Paper>
    );
  }

  const { productos, resumen, por_categoria, productos_criticos, productos_baja_rotacion, movimientos_recientes, alertas } = datos;

  // Preparar datos para gráficas
  const datosEstadoStock = [
    { estado: 'Sin Stock', cantidad: resumen.productos_sin_stock, color: coloresEstado.sin_stock },
    { estado: 'Stock Bajo', cantidad: resumen.productos_stock_bajo, color: coloresEstado.stock_bajo },
    { estado: 'Normal', cantidad: resumen.productos_stock_normal, color: coloresEstado.normal },
    { estado: 'Excedente', cantidad: resumen.productos_excedente, color: coloresEstado.excedente }
  ];

  const datosCategorias = Object.entries(por_categoria).map(([categoria, datos]) => ({
    categoria,
    productos: datos.productos,
    valor: datos.valor_total,
    stock: datos.stock_total,
    color: coloresCategoria[categoria] || '#9e9e9e'
  }));

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Reporte de Inventario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estado actual del inventario y análisis de stock
          </Typography>
        </Box>
        <Tooltip title="Actualizar datos">
          <IconButton color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Alertas Críticas */}
      {alertas && alertas.length > 0 && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {alertas.map((alerta, index) => (
            <Alert 
              key={index}
              severity={alerta.tipo === 'critico' ? 'error' : alerta.tipo === 'advertencia' ? 'warning' : 'info'}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={500}>
                {alerta.mensaje}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Productos afectados: {alerta.productos_afectados}
              </Typography>
            </Alert>
          ))}
        </Stack>
      )}

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {resumen.total_productos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Productos
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {formatearMoneda(resumen.valor_total_inventario)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Valor Inventario
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {resumen.productos_sin_stock + resumen.productos_stock_bajo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos Críticos
                  </Typography>
                </Box>
                <Badge badgeContent={resumen.productos_sin_stock} color="error">
                  <WarningIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {resumen.porcentaje_productos_criticos.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    % Productos Críticos
                  </Typography>
                </Box>
                <TimelineIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Estado del Stock */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Distribución por Estado de Stock
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosEstadoStock}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="cantidad"
                      label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                    >
                      {datosEstadoStock.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => [value, 'Productos']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Valor por Categoría */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Valor de Inventario por Categoría
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosCategorias}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <RechartsTooltip 
                      formatter={(value) => [formatearMoneda(value), 'Valor']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="valor" fill="#62a83d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes vistas */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabActiva} onChange={(e, newValue) => setTabActiva(newValue)}>
            <Tab label="Todos los Productos" />
            <Tab 
              label={
                <Badge badgeContent={productos_criticos.length} color="error">
                  Productos Críticos
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={productos_baja_rotacion.length} color="warning">
                  Baja Rotación
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={movimientos_recientes.length} color="info">
                  Movimientos Recientes
                </Badge>
              } 
            />
          </Tabs>
        </Box>

        <CardContent>
          {/* Tab 0: Todos los Productos */}
          {tabActiva === 0 && (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Actual</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Mínimo</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Precio Unitario</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Valor Stock</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Proveedor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.slice(0, 50).map((producto) => (
                    <TableRow 
                      key={producto.id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        backgroundColor: producto.estado_stock === 'sin_stock' ? '#ffebee' : 
                                       producto.estado_stock === 'stock_bajo' ? '#fff3e0' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              bgcolor: coloresCategoria[producto.categoria] || '#9e9e9e',
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem'
                            }}
                          >
                            {producto.categoria === 'frutas' ? '🍎' : 
                             producto.categoria === 'verduras' ? '🥬' : '📦'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {producto.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {producto.unidad}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip 
                          label={producto.categoria} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${coloresCategoria[producto.categoria] || '#9e9e9e'}20`,
                            color: coloresCategoria[producto.categoria] || '#9e9e9e',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          fontWeight={600}
                          color={producto.estado_stock === 'sin_stock' ? 'error.main' : 
                                 producto.estado_stock === 'stock_bajo' ? 'warning.main' : 'text.primary'}
                        >
                          {producto.stock_actual.toLocaleString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {producto.stock_minimo.toLocaleString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={500}>
                          {formatearMoneda(producto.precio_unitario)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                          {formatearMoneda(producto.valor_stock)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Tooltip title={obtenerTextoEstado(producto.estado_stock)}>
                          <Chip 
                            icon={obtenerIconoEstado(producto.estado_stock)}
                            label={obtenerTextoEstado(producto.estado_stock)}
                            size="small"
                            sx={{ 
                              bgcolor: `${coloresEstado[producto.estado_stock]}20`,
                              color: coloresEstado[producto.estado_stock],
                              fontWeight: 500
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {producto.proveedor_nombre}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab 1: Productos Críticos */}
          {tabActiva === 1 && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  Productos que requieren atención inmediata por stock bajo o agotado
                </Typography>
              </Alert>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Actual</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Mínimo</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Diferencia</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Prioridad</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Proveedor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos_criticos.map((producto, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          backgroundColor: producto.stock_actual === 0 ? '#ffebee' : '#fff8e1'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {producto.stock_actual === 0 ? 
                              <ErrorIcon sx={{ mr: 1, color: 'error.main' }} /> :
                              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                            }
                            <Typography variant="body2" fontWeight={500}>
                              {producto.nombre}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={producto.stock_actual === 0 ? 'error.main' : 'warning.main'}
                          >
                            {producto.stock_actual.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="body2">
                            {producto.stock_minimo.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={producto.stock_actual === 0 ? 'error.main' : 'warning.main'}
                          >
                            {(producto.stock_actual - producto.stock_minimo).toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Chip 
                            label={producto.stock_actual === 0 ? 'CRÍTICO' : 'ALTO'}
                            size="small"
                            color={producto.stock_actual === 0 ? 'error' : 'warning'}
                            variant="filled"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {producto.proveedor_nombre || 'Sin proveedor'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 2: Productos de Baja Rotación */}
          {tabActiva === 2 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  Productos con baja rotación que podrían requerir estrategias de venta
                </Typography>
              </Alert>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Actual</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Vendido (30 días)</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Índice Rotación</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Recomendación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos_baja_rotacion.map((producto, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {producto.nombre}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="body2">
                            {producto.stock_actual.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="body2">
                            {producto.vendido_ultimo_mes.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={producto.indice_rotacion < 0.5 ? 'error.main' : 'warning.main'}
                          >
                            {producto.indice_rotacion.toFixed(2)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Chip 
                            label={
                              producto.indice_rotacion < 0.2 ? 'Promocionar' :
                              producto.indice_rotacion < 0.5 ? 'Revisar precio' : 'Monitorear'
                            }
                            size="small"
                            color={
                              producto.indice_rotacion < 0.2 ? 'error' :
                              producto.indice_rotacion < 0.5 ? 'warning' : 'info'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 3: Movimientos Recientes */}
          {tabActiva === 3 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  Últimos movimientos de stock registrados en el sistema
                </Typography>
              </Alert>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f3e5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Tipo</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Motivo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movimientos_recientes.map((movimiento, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            {formatearFecha(movimiento.fecha)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {movimiento.producto_nombre}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Chip 
                            label={movimiento.tipo.toUpperCase()}
                            size="small"
                            color={
                              movimiento.tipo === 'ingreso' ? 'success' :
                              movimiento.tipo === 'egreso' ? 'error' : 'warning'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={
                              movimiento.tipo === 'ingreso' ? 'success.main' :
                              movimiento.tipo === 'egreso' ? 'error.main' : 'warning.main'
                            }
                          >
                            {movimiento.tipo === 'egreso' ? '-' : '+'}
                            {movimiento.cantidad.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {movimiento.motivo || 'Sin especificar'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {movimiento.usuario_nombre}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    </Paper>
  );
};

export default ReporteInventario;