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
  LinearProgress
} from '@mui/material';
import {
  TrendingDown as TrendingDownIcon,
  MoneyOff as MoneyOffIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  Warning as WarningIcon
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
  TreeMap
} from 'recharts';

const ReporteEgresos = ({ datos, loading, filtros }) => {
  const [datosGrafica, setDatosGrafica] = useState([]);

  // Colores para las gráficas (tonos rojos/naranjas para egresos)
  const colores = ['#f44336', '#ff9800', '#ff5722', '#e91e63', '#9c27b0'];

  useEffect(() => {
    if (datos?.egresos) {
      // Preparar datos para gráficas
      const datosParaGrafica = datos.egresos.map((item, index) => ({
        nombre: item.categoria,
        subcategoria: item.subcategoria,
        valor: item.total,
        transacciones: item.numero_transacciones,
        promedio: item.promedio,
        color: colores[index % colores.length],
        porcentaje: (item.total / datos.resumen.total_egresos * 100).toFixed(1)
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

  if (!datos || !datos.egresos) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay datos de egresos disponibles para el período seleccionado.
        </Alert>
      </Paper>
    );
  }

  const { egresos, resumen } = datos;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingDownIcon sx={{ mr: 2, color: 'error.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={600} color="error.main">
            Reporte de Egresos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis detallado de gastos y egresos por categoría
          </Typography>
        </Box>
      </Box>

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {formatearMoneda(resumen.total_egresos)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Egresos
                  </Typography>
                </Box>
                <MoneyOffIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {resumen.total_transacciones}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Transacciones
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
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {formatearMoneda(resumen.egreso_promedio)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Egreso Promedio
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Mayor Gasto
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    {resumen.categoria_mayor_gasto}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
              </Box>
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
                Egresos por Categoría
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
                      formatter={(value) => [formatearMoneda(value), 'Egresos']}
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
                      fill="#f44336"
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
                Distribución de Gastos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosGrafica}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="valor"
                      label={({ nombre, porcentaje }) => `${nombre}: ${porcentaje}%`}
                      labelLine={false}
                    >
                      {datosGrafica.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatearMoneda(value), 'Egresos']}
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

      {/* Análisis de Gastos por Categoría */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Análisis por Categoría
              </Typography>
              <Grid container spacing={2}>
                {datosGrafica.map((categoria, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2,
                        '&:hover': { 
                          borderColor: categoria.color,
                          boxShadow: `0 2px 8px ${categoria.color}30`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            backgroundColor: categoria.color, 
                            borderRadius: '50%', 
                            mr: 1 
                          }} 
                        />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {categoria.nombre}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {categoria.subcategoria}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color={categoria.color} sx={{ mb: 1 }}>
                        {formatearMoneda(categoria.valor)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={parseFloat(categoria.porcentaje)} 
                        sx={{ 
                          mb: 1,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: categoria.color
                          }
                        }}
                      />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          {categoria.porcentaje}% del total
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {categoria.transacciones} transacciones
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla Detallada */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Detalle de Egresos
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Subcategoría</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Total Egresos</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Promedio</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Transacciones</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>% del Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {egresos.map((item, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            backgroundColor: colores[index % colores.length], 
                            borderRadius: '50%', 
                            mr: 1 
                          }} 
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {item.categoria}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.subcategoria}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="error.main">
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
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${(item.total / resumen.total_egresos * 100).toFixed(1)}%`}
                        size="small" 
                        color="error"
                        variant="outlined"
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

export default ReporteEgresos;