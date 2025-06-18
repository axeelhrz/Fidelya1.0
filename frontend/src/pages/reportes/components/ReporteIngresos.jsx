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
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  ShowChart as ChartIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ReporteIngresos = ({ datos, loading, filtros }) => {
  const [datosGrafica, setDatosGrafica] = useState([]);
  const [tipoGrafica, setTipoGrafica] = useState('barras');

  // Colores para las gráficas
  const colores = ['#62a83d', '#8bc34a', '#4a7c2a', '#9ccc65', '#689f38'];

  useEffect(() => {
    if (datos?.ingresos) {
      // Preparar datos para gráficas
      const datosParaGrafica = datos.ingresos.map((item, index) => ({
        nombre: item.concepto,
        valor: item.total,
        cantidad: item.cantidad,
        color: colores[index % colores.length]
      }));
      setDatosGrafica(datosParaGrafica);
    }
  }, [datos]);

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
      return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={300} sx={{ mt: 3, borderRadius: 2 }} />
      </Paper>
    );
  }

  if (!datos || !datos.ingresos) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay datos de ingresos disponibles para el período seleccionado.
        </Alert>
      </Paper>
    );
  }

  const { ingresos, resumen } = datos;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 2, color: 'success.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={600} color="success.main">
            Reporte de Ingresos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis detallado de ingresos por ventas
          </Typography>
        </Box>
      </Box>

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {resumen.total_ventas}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Ventas
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    {formatearMoneda(resumen.venta_promedio)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Venta Promedio
                  </Typography>
                </Box>
                <ChartIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Rango de Ventas
                </Typography>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {formatearMoneda(resumen.venta_maxima)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Máxima
                </Typography>
                <Typography variant="h6" fontWeight={600} color="warning.main">
                  {formatearMoneda(resumen.venta_minima)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mínima
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfica de Barras */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Ingresos por {filtros.agrupacion === 'producto' ? 'Producto' : 'Fecha'}
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGrafica}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="nombre" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatearMoneda(value), 'Ingresos']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="valor" 
                      fill="#62a83d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfica Circular */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Distribución de Ingresos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosGrafica.slice(0, 5)} // Top 5
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="valor"
                      label={({ nombre, percent }) => `${nombre}: ${(percent * 100).toFixed(1)}%`}
                      labelLine={false}
                    >
                      {datosGrafica.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
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

      {/* Tabla Detallada */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Detalle de Ingresos
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {filtros.agrupacion === 'producto' ? 'Producto' : 'Fecha'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Total Ingresos</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Promedio</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Transacciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingresos.map((item, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {filtros.agrupacion === 'fecha' ? formatearFecha(item.concepto) : item.concepto}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.categoria} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {item.cantidad.toLocaleString('es-UY')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatearMoneda(item.total)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatearMoneda(item.promedio)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={item.numero_transacciones} 
                        size="small" 
                        color="secondary"
                      />
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

export default ReporteIngresos;