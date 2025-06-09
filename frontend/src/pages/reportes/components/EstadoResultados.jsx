import React from 'react';
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
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  ShowChart as ChartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const EstadoResultados = ({ datos, loading, filtros }) => {
  // Formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor || 0);
  };

  // Obtener color según el estado financiero
  const obtenerColorEstado = (valor) => {
    if (valor > 0) return 'success.main';
    if (valor < 0) return 'error.main';
    return 'warning.main';
  };

  // Obtener icono según el estado
  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'ganancia':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'perdida':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <WarningIcon sx={{ color: 'warning.main' }} />;
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

  if (!datos) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay datos disponibles para generar el estado de resultados.
        </Alert>
      </Paper>
    );
  }

  const { ingresos, egresos, resultado, metricas, analisis } = datos;

  // Datos para gráficas
  const datosComparacion = [
    {
      concepto: 'Ingresos',
      valor: ingresos.total_ingresos,
      color: '#4caf50'
    },
    {
      concepto: 'Egresos',
      valor: egresos.total_egresos,
      color: '#f44336'
    },
    {
      concepto: 'Utilidad',
      valor: resultado.utilidad_neta,
      color: resultado.utilidad_neta >= 0 ? '#2196f3' : '#ff9800'
    }
  ];

  const datosDesglose = [
    { nombre: 'Ventas', valor: ingresos.ventas_productos, tipo: 'ingreso' },
    { nombre: 'Otros Ingresos', valor: ingresos.otros_ingresos, tipo: 'ingreso' },
    { nombre: 'Costo Productos', valor: egresos.costo_productos, tipo: 'egreso' },
    { nombre: 'Gastos Operativos', valor: egresos.gastos_operativos, tipo: 'egreso' },
    { nombre: 'Gastos Admin.', valor: egresos.gastos_administrativos, tipo: 'egreso' },
    { nombre: 'Otros Gastos', valor: egresos.otros_gastos, tipo: 'egreso' }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AssessmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Estado de Resultados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis financiero completo - Ingresos vs Egresos
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          {obtenerIconoEstado(analisis.estado)}
          <Typography variant="h6" fontWeight={600} color={obtenerColorEstado(resultado.utilidad_neta)}>
            {analisis.estado.toUpperCase()}
          </Typography>
        </Box>
      </Box>

      {/* Alerta de Estado Financiero */}
      <Alert 
        severity={analisis.estado === 'ganancia' ? 'success' : analisis.estado === 'perdida' ? 'error' : 'warning'}
        sx={{ mb: 3, borderRadius: 2 }}
        icon={obtenerIconoEstado(analisis.estado)}
      >
        <Typography variant="body2" fontWeight={500}>
          {analisis.recomendacion}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Nivel de riesgo: {analisis.nivel_riesgo} | Margen de utilidad: {resultado.margen_utilidad.toFixed(2)}%
        </Typography>
      </Alert>

      {/* Métricas Principales */}
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
                    {formatearMoneda(ingresos.total_ingresos)}
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
                    {formatearMoneda(egresos.total_egresos)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Egresos
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              background: resultado.utilidad_neta >= 0 
                ? 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
                : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {formatearMoneda(resultado.utilidad_neta)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Utilidad Neta
                  </Typography>
                </Box>
                <BalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color={obtenerColorEstado(resultado.margen_utilidad)}>
                    {resultado.margen_utilidad.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Margen de Utilidad
                  </Typography>
                </Box>
                <ChartIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas Comparativas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfica de Comparación */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Comparación Ingresos vs Egresos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={datosComparacion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="concepto" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value) => [formatearMoneda(value), 'Monto']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="valor" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="valor" stroke="#ff7300" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfica Circular de Distribución */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Distribución Financiera
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Ingresos', value: ingresos.total_ingresos, fill: '#4caf50' },
                        { name: 'Egresos', value: egresos.total_egresos, fill: '#f44336' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatearMoneda(value), 'Monto']}
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

      {/* Estado de Resultados Detallado */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Estado de Resultados Detallado
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Concepto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Monto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>% del Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* INGRESOS */}
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="subtitle1" fontWeight={600} color="success.main">
                          INGRESOS
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Ventas de Productos</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                        {formatearMoneda(ingresos.ventas_productos)}
                      </TableCell>
                      <TableCell align="right">
                        {((ingresos.ventas_productos / ingresos.total_ingresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Otros Ingresos</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                        {formatearMoneda(ingresos.otros_ingresos)}
                      </TableCell>
                      <TableCell align="right">
                        {((ingresos.otros_ingresos / ingresos.total_ingresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#e8f5e8' }}>
                      <TableCell sx={{ fontWeight: 600 }}>TOTAL INGRESOS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatearMoneda(ingresos.total_ingresos)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>100.0%</TableCell>
                    </TableRow>

                    {/* EGRESOS */}
                    <TableRow>
                      <TableCell colSpan={3} sx={{ pt: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} color="error.main">
                          EGRESOS
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Costo de Productos</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                        {formatearMoneda(egresos.costo_productos)}
                      </TableCell>
                      <TableCell align="right">
                        {((egresos.costo_productos / egresos.total_egresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Gastos Operativos</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                        {formatearMoneda(egresos.gastos_operativos)}
                      </TableCell>
                      <TableCell align="right">
                        {((egresos.gastos_operativos / egresos.total_egresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Gastos Administrativos</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                        {formatearMoneda(egresos.gastos_administrativos)}
                      </TableCell>
                      <TableCell align="right">
                        {((egresos.gastos_administrativos / egresos.total_egresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Otros Gastos</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                        {formatearMoneda(egresos.otros_gastos)}
                      </TableCell>
                      <TableCell align="right">
                        {((egresos.otros_gastos / egresos.total_egresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#ffebee' }}>
                      <TableCell sx={{ fontWeight: 600 }}>TOTAL EGRESOS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                        {formatearMoneda(egresos.total_egresos)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>100.0%</TableCell>
                    </TableRow>

                    {/* RESULTADO */}
                    <TableRow>
                      <TableCell colSpan={3} sx={{ pt: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                          RESULTADO
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Utilidad Bruta</TableCell>
                      <TableCell align="right" sx={{ color: obtenerColorEstado(resultado.utilidad_bruta), fontWeight: 500 }}>
                        {formatearMoneda(resultado.utilidad_bruta)}
                      </TableCell>
                      <TableCell align="right">
                        {((resultado.utilidad_bruta / ingresos.total_ingresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Utilidad Operativa</TableCell>
                      <TableCell align="right" sx={{ color: obtenerColorEstado(resultado.utilidad_operativa), fontWeight: 500 }}>
                        {formatearMoneda(resultado.utilidad_operativa)}
                      </TableCell>
                      <TableCell align="right">
                        {((resultado.utilidad_operativa / ingresos.total_ingresos) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ 
                      backgroundColor: resultado.utilidad_neta >= 0 ? '#e3f2fd' : '#fff3e0',
                      border: 2,
                      borderColor: resultado.utilidad_neta >= 0 ? 'success.main' : 'warning.main'
                    }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>UTILIDAD NETA</TableCell>
                      <TableCell align="right" sx={{ 
                        fontWeight: 700, 
                        fontSize: '1.1rem',
                        color: obtenerColorEstado(resultado.utilidad_neta)
                      }}>
                        {formatearMoneda(resultado.utilidad_neta)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {resultado.margen_utilidad.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Métricas Adicionales */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Métricas Operativas */}
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Métricas Operativas
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Número de Ventas
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {metricas.numero_ventas.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Venta Promedio
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatearMoneda(metricas.venta_promedio)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Punto de Equilibrio
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatearMoneda(metricas.punto_equilibrio)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Indicadores de Rendimiento */}
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Indicadores de Rendimiento
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">ROI</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {metricas.roi_porcentaje.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(Math.abs(metricas.roi_porcentaje), 100)} 
                      color={metricas.roi_porcentaje >= 0 ? 'success' : 'error'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Margen Bruto</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {((resultado.utilidad_bruta / ingresos.total_ingresos) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(Math.abs((resultado.utilidad_bruta / ingresos.total_ingresos) * 100), 100)} 
                      color="primary"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Eficiencia Operativa</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {((resultado.utilidad_operativa / ingresos.total_ingresos) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(Math.abs((resultado.utilidad_operativa / ingresos.total_ingresos) * 100), 100)} 
                      color="secondary"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EstadoResultados;