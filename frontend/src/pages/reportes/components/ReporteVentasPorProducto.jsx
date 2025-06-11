import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon,
  BarChart as BarChartIcon
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
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const ReporteVentasPorProducto = ({ datos, loading, filtros }) => {
  const [ordenamiento, setOrdenamiento] = useState('cantidad_vendida');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Colores para las gráficas
  const colores = ['#62a83d', '#8bc34a', '#4a7c2a', '#9ccc65', '#689f38', '#aed581', '#c5e1a5'];

  useEffect(() => {
    if (datos?.productos) {
      let productos = [...datos.productos];
      
      // Filtrar por categoría
      if (categoriaSeleccionada !== 'todas') {
        productos = productos.filter(p => p.categoria === categoriaSeleccionada);
      }
      
      // Ordenar
      productos.sort((a, b) => {
        switch (ordenamiento) {
          case 'cantidad_vendida':
            return b.cantidad_vendida - a.cantidad_vendida;
          case 'ingresos_generados':
            return b.ingresos_generados - a.ingresos_generados;
          case 'precio_promedio':
            return b.precio_promedio - a.precio_promedio;
          case 'rotacion':
            return b.rotacion - a.rotacion;
          default:
            return 0;
        }
      });
      
      setProductosFiltrados(productos);
    }
  }, [datos, ordenamiento, categoriaSeleccionada]);

  // Formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor || 0);
  };

  // Obtener color por categoría
  const obtenerColorCategoria = (categoria) => {
    const coloresCategoria = {
      'frutas': '#ff9800',
      'verduras': '#4caf50',
      'otros': '#2196f3'
    };
    return coloresCategoria[categoria] || '#9e9e9e';
  };

  // Obtener icono por categoría
  const obtenerIconoCategoria = (categoria) => {
    switch (categoria) {
      case 'frutas':
        return '🍎';
      case 'verduras':
        return '🥬';
      case 'otros':
        return '📦';
      default:
        return '📦';
    }
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

  if (!datos || !datos.productos) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay datos de ventas por producto disponibles para el período seleccionado.
        </Alert>
      </Paper>
    );
  }

  const { productos, categorias, resumen } = datos;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Reporte de Ventas por Producto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis detallado de productos más vendidos y rentables
          </Typography>
        </Box>
      </Box>

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
                    {resumen.total_productos_vendidos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Productos Vendidos
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
                    {formatearMoneda(resumen.total_ingresos)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Ingresos
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="secondary">
                    {resumen.total_unidades_vendidas.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unidades Vendidas
                  </Typography>
                </Box>
                <BarChartIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Producto Estrella
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  {resumen.producto_mas_vendido}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categoría: {resumen.categoria_mas_vendida}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controles de Filtrado */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={ordenamiento}
              label="Ordenar por"
              onChange={(e) => setOrdenamiento(e.target.value)}
            >
              <MenuItem value="cantidad_vendida">Cantidad Vendida</MenuItem>
              <MenuItem value="ingresos_generados">Ingresos Generados</MenuItem>
              <MenuItem value="precio_promedio">Precio Promedio</MenuItem>
              <MenuItem value="rotacion">Rotación de Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoriaSeleccionada}
              label="Categoría"
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <MenuItem value="todas">Todas las Categorías</MenuItem>
              <MenuItem value="frutas">🍎 Frutas</MenuItem>
              <MenuItem value="verduras">🥬 Verduras</MenuItem>
              <MenuItem value="otros">📦 Otros</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfica de Productos Más Vendidos */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Top 10 Productos Más Vendidos
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productosFiltrados.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="nombre" 
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'cantidad_vendida' ? `${value.toLocaleString()} unidades` : formatearMoneda(value),
                        name === 'cantidad_vendida' ? 'Cantidad Vendida' : 'Ingresos'
                      ]}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="cantidad_vendida" 
                      fill="#62a83d"
                      radius={[4, 4, 0, 0]}
                      name="cantidad_vendida"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfica de Categorías */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Ventas por Categoría
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorias}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="ingresos_generados"
                      label={({ categoria, porcentaje_ingresos }) => 
                        `${categoria}: ${porcentaje_ingresos.toFixed(1)}%`
                      }
                      labelLine={false}
                    >
                      {categorias.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={obtenerColorCategoria(entry.categoria)} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => [formatearMoneda(value), 'Ingresos']}
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
      </Grid>

      {/* Análisis por Categorías */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Análisis por Categorías
              </Typography>
              <Grid container spacing={3}>
                {categorias.map((categoria, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        border: 2, 
                        borderColor: obtenerColorCategoria(categoria.categoria),
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${obtenerColorCategoria(categoria.categoria)}10 0%, ${obtenerColorCategoria(categoria.categoria)}05 100%)`,
                        '&:hover': { 
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 25px ${obtenerColorCategoria(categoria.categoria)}30`
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 1 }}>
                          {obtenerIconoCategoria(categoria.categoria)}
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color={obtenerColorCategoria(categoria.categoria)}>
                          {categoria.categoria.charAt(0).toUpperCase() + categoria.categoria.slice(1)}
                        </Typography>
                      </Box>
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Ingresos Generados
                          </Typography>
                          <Typography variant="h5" fontWeight={700} color={obtenerColorCategoria(categoria.categoria)}>
                            {formatearMoneda(categoria.ingresos_generados)}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Cantidad Vendida
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {categoria.cantidad_vendida.toLocaleString()} unidades
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Productos Diferentes
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {categoria.productos_diferentes}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            % del Total de Ingresos
                          </Typography>
                          <Typography variant="h6" fontWeight={600} color={obtenerColorCategoria(categoria.categoria)}>
                            {categoria.porcentaje_ingresos.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla Detallada de Productos */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Detalle de Productos ({productosFiltrados.length})
            </Typography>
            <Chip 
              label={`Mostrando ${categoriaSeleccionada === 'todas' ? 'todas las categorías' : categoriaSeleccionada}`}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Cantidad Vendida</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Ingresos</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Precio Promedio</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Actual</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Rotación</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Ventas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosFiltrados.map((producto, index) => (
                  <TableRow 
                    key={producto.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: obtenerColorCategoria(producto.categoria),
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem'
                          }}
                        >
                          {obtenerIconoCategoria(producto.categoria)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {producto.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={producto.categoria} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${obtenerColorCategoria(producto.categoria)}20`,
                          color: obtenerColorCategoria(producto.categoria),
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {producto.cantidad_vendida.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {producto.unidad}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatearMoneda(producto.ingresos_generados)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatearMoneda(producto.precio_promedio)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Actual: {formatearMoneda(producto.precio_actual)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={producto.stock_actual <= 10 ? 'error.main' : 'text.primary'}
                        fontWeight={producto.stock_actual <= 10 ? 600 : 400}
                      >
                        {producto.stock_actual.toLocaleString()}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Chip 
                        label={producto.rotacion.toFixed(2)}
                        size="small"
                        color={
                          producto.rotacion > 2 ? 'success' : 
                          producto.rotacion > 1 ? 'warning' : 'error'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Tooltip title="Ver detalles de ventas">
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {producto.numero_ventas} ventas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default ReporteVentasPorProducto;