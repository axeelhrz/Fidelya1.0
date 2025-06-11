import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CompareArrows as CompareArrowsIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

const ResumenVentasDelDia = ({ resumenVentas, loading }) => {
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false);
  const [comparacionDialogOpen, setComparacionDialogOpen] = useState(false);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!resumenVentas) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de ventas disponibles
        </Typography>
      </Box>
    );
  }

  const {
    numero_ventas = 0,
    total_efectivo = 0,
    total_tarjeta = 0,
    total_transferencia = 0,
    total_ventas = 0,
    venta_promedio = 0,
    comparacion_ayer = {},
    tendencia_semanal = [],
    productos_top = [],
    metricas_tiempo = {}
  } = resumenVentas;

  const formasPago = [
    {
      nombre: 'Efectivo',
      total: total_efectivo,
      icono: <AttachMoneyIcon />,
      color: '#4CAF50',
      porcentaje: total_ventas > 0 ? (total_efectivo / total_ventas * 100) : 0
    },
    {
      nombre: 'Tarjeta',
      total: total_tarjeta,
      icono: <CreditCardIcon />,
      color: '#2196F3',
      porcentaje: total_ventas > 0 ? (total_tarjeta / total_ventas * 100) : 0
    },
    {
      nombre: 'Transferencia',
      total: total_transferencia,
      icono: <AccountBalanceIcon />,
      color: '#FF9800',
      porcentaje: total_ventas > 0 ? (total_transferencia / total_ventas * 100) : 0
    }
  ];

  const datosGrafico = formasPago.map(forma => ({
    name: forma.nombre,
    value: forma.total,
    color: forma.color
  }));

  const calcularTendencia = () => {
    if (!comparacion_ayer.total_ventas) return { tipo: 'neutral', porcentaje: 0 };
    
    const diferencia = total_ventas - comparacion_ayer.total_ventas;
    const porcentaje = (diferencia / comparacion_ayer.total_ventas * 100);
    return {
      tipo: diferencia > 0 ? 'positiva' : diferencia < 0 ? 'negativa' : 'neutral',
      porcentaje: Math.abs(porcentaje),
      diferencia
    };
  };

  const tendencia = calcularTendencia();

  const getMetricasRendimiento = () => {
    const ventasPorHora = numero_ventas / 8; // Asumiendo 8 horas de trabajo
    const eficiencia = venta_promedio > 0 ? (total_ventas / (numero_ventas * venta_promedio)) * 100 : 0;
    
    return {
      ventasPorHora: ventasPorHora.toFixed(1),
      eficiencia: eficiencia.toFixed(1),
      ticketPromedio: venta_promedio
    };
  };

  const metricas = getMetricasRendimiento();

  return (
    <Box>
      {/* Resumen general con animación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <ReceiptIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {numero_ventas}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ventas Realizadas
                </Typography>
                
                {/* Indicador de tendencia */}
                {comparacion_ayer.numero_ventas && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tendencia.tipo === 'positiva' ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    ) : tendencia.tipo === 'negativa' ? (
                      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                    ) : null}
                    <Typography variant="caption" color={
                      tendencia.tipo === 'positiva' ? 'success.main' : 
                      tendencia.tipo === 'negativa' ? 'error.main' : 'text.secondary'
                    }>
                      {tendencia.tipo !== 'neutral' && `${tendencia.porcentaje.toFixed(1)}%`}
                      {tendencia.tipo === 'neutral' && 'Sin cambios'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="success.main">
                  ${total_ventas.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Vendido
                </Typography>
                
                {/* Barra de progreso hacia meta diaria */}
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((total_ventas / 5000) * 100, 100)} // Meta ejemplo: $5000
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'success.main'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Meta diaria: $5,000
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Métricas de rendimiento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <SpeedIcon sx={{ color: 'info.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} color="info.main">
                {metricas.ventasPorHora}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ventas/Hora
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <StarIcon sx={{ color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} color="warning.main">
                ${venta_promedio.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ticket Promedio
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <TimelineIcon sx={{ color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} color="secondary.main">
                {metricas.eficiencia}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Eficiencia
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Divider sx={{ my: 2 }} />

      {/* Desglose por forma de pago con gráfico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Desglose por Forma de Pago
          </Typography>
          <Tooltip title="Ver detalles">
            <IconButton size="small" onClick={() => setDetalleDialogOpen(true)}>
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <List dense>
              {formasPago.map((forma, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box sx={{ color: forma.color }}>
                        {forma.icono}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {forma.nombre}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={forma.porcentaje}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: forma.color
                              }
                            }}
                          />
                        </Box>
                      }
                      secondary={`$${forma.total.toFixed(2)}`}
                      secondaryTypographyProps={{
                        fontWeight: 600,
                        color: forma.color
                      }}
                    />
                    <Chip
                      label={`${forma.porcentaje.toFixed(1)}%`}
                      size="small"
                      sx={{
                        backgroundColor: forma.color,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </motion.div>

      {/* Información importante */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {total_efectivo > 0 ? (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoneyIcon sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="body2" color="info.main" fontWeight={600}>
                Efectivo esperado en caja: ${total_efectivo.toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Este es el monto que debería estar físicamente en la caja al momento del cierre
            </Typography>
            
            {/* Comparación con día anterior */}
            {comparacion_ayer.total_efectivo && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <CompareArrowsIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Ayer: ${comparacion_ayer.total_efectivo.toFixed(2)} 
                  ({total_efectivo > comparacion_ayer.total_efectivo ? '+' : ''}
                  ${(total_efectivo - comparacion_ayer.total_efectivo).toFixed(2)})
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 2, border: '1px solid', borderColor: 'warning.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="body2" color="warning.main" fontWeight={600}>
                No se registraron ventas en efectivo hoy
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Puedes realizar el cierre con $0.00 en efectivo
            </Typography>
          </Box>
        )}
      </motion.div>

      {/* Dialog de detalles */}
      <Dialog
        open={detalleDialogOpen}
        onClose={() => setDetalleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles de Ventas del Día
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Productos más vendidos */}
            {productos_top && productos_top.length > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Productos Más Vendidos
                </Typography>
                <List>
                  {productos_top.slice(0, 5).map((producto, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={producto.nombre}
                        secondary={`${producto.cantidad} unidades - $${producto.total.toFixed(2)}`}
                      />
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        color="primary"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}

            {/* Tendencia semanal */}
            {tendencia_semanal && tendencia_semanal.length > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Tendencia Semanal
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tendencia_semanal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Ventas']}
                      />
                      <Bar dataKey="ventas" fill="#1976D2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalleDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumenVentasDelDia;