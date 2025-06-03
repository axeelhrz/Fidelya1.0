import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Lightbulb as LightbulbIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cierreCajaService } from '../../../services/cierreCajaService';

const ComparacionCaja = ({ resumenVentas, cierreExistente }) => {
  const [analisisDialogOpen, setAnalisisDialogOpen] = useState(false);
  const [recomendacionesDialogOpen, setRecomendacionesDialogOpen] = useState(false);
  const [historialPrecision, setHistorialPrecision] = useState([]);

  if (!resumenVentas && !cierreExistente) {
    return (
      <Alert severity="info">
        No hay datos disponibles para mostrar la comparación
      </Alert>
    );
  }

  // Obtener datos del cierre o calcular desde resumen
  const efectivoEsperado = cierreExistente 
    ? cierreExistente.total_ventas_esperado 
    : (resumenVentas?.total_efectivo || 0);
  
  const efectivoContado = cierreExistente?.total_efectivo_contado || 0;
  const diferencia = cierreExistente?.diferencia || 0;
  const numeroVentas = cierreExistente?.numero_ventas || resumenVentas?.numero_ventas || 0;
  const tiempoConteo = cierreExistente?.tiempo_conteo || 0;

  const estadoDiferencia = cierreCajaService.calcularEstadoDiferencia(diferencia);

  // Calcular métricas avanzadas
  const porcentajePrecision = efectivoEsperado > 0 
    ? Math.max(0, 100 - (Math.abs(diferencia) / efectivoEsperado * 100))
    : 100;

  const riesgoSeguridad = Math.abs(diferencia) > 100 ? 'alto' : 
                         Math.abs(diferencia) > 50 ? 'medio' : 'bajo';

  const eficienciaConteo = tiempoConteo > 0 ? 
    (tiempoConteo < 120 ? 'excelente' : 
     tiempoConteo < 300 ? 'buena' : 
     tiempoConteo < 600 ? 'regular' : 'lenta') : 'no_medido';

  const getIconoEstado = () => {
    switch (estadoDiferencia.estado) {
      case 'correcto':
        return <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />;
      case 'faltante':
        return <WarningIcon sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'sobrante':
        return <InfoIcon sx={{ fontSize: 48, color: 'info.main' }} />;
      default:
        return <RemoveIcon sx={{ fontSize: 48, color: 'grey.500' }} />;
    }
  };

  const getTendenciaIcon = () => {
    if (diferencia > 0) return <TrendingUpIcon sx={{ color: 'info.main' }} />;
    if (diferencia < 0) return <TrendingDownIcon sx={{ color: 'error.main' }} />;
    return <RemoveIcon sx={{ color: 'success.main' }} />;
  };

  const getRecomendaciones = () => {
    const recomendaciones = [];

    if (estadoDiferencia.estado === 'faltante') {
      recomendaciones.push({
        tipo: 'accion',
        titulo: 'Verificar Ventas No Registradas',
        descripcion: 'Revisar si hay ventas que no fueron registradas en el sistema',
        prioridad: 'alta'
      });
      recomendaciones.push({
        tipo: 'accion',
        titulo: 'Revisar Cambio Entregado',
        descripcion: 'Verificar si se entregó cambio incorrecto a los clientes',
        prioridad: 'media'
      });
    }

    if (estadoDiferencia.estado === 'sobrante') {
      recomendaciones.push({
        tipo: 'accion',
        titulo: 'Verificar Ventas Duplicadas',
        descripcion: 'Revisar si hay ventas registradas incorrectamente',
        prioridad: 'alta'
      });
      recomendaciones.push({
        tipo: 'accion',
        titulo: 'Revisar Cambio No Entregado',
        descripcion: 'Verificar si hay cambio que no fue entregado a clientes',
        prioridad: 'media'
      });
    }

    if (porcentajePrecision < 90) {
      recomendaciones.push({
        tipo: 'mejora',
        titulo: 'Mejorar Proceso de Conteo',
        descripcion: 'Implementar doble verificación en el conteo de efectivo',
        prioridad: 'media'
      });
    }

    if (tiempoConteo > 600) {
      recomendaciones.push({
        tipo: 'eficiencia',
        titulo: 'Optimizar Tiempo de Conteo',
        descripcion: 'Organizar mejor las denominaciones para agilizar el proceso',
        prioridad: 'baja'
      });
    }

    return recomendaciones;
  };

  const recomendaciones = getRecomendaciones();

  const datosHistorial = [
    { dia: 'Lun', precision: 98, diferencia: 5 },
    { dia: 'Mar', precision: 95, diferencia: -15 },
    { dia: 'Mie', precision: 100, diferencia: 0 },
    { dia: 'Jue', precision: 92, diferencia: 25 },
    { dia: 'Vie', precision: porcentajePrecision, diferencia: Math.abs(diferencia) },
  ];

  return (
    <Box>
      {/* Estado general del cierre con animación */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          mb: 3, 
          background: `linear-gradient(135deg, ${estadoDiferencia.color}.50 0%, ${estadoDiferencia.color}.100 100%)`,
          borderRadius: 3,
          border: `2px solid ${estadoDiferencia.color}.200`
        }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {getIconoEstado()}
            </motion.div>
            
            <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
              {estadoDiferencia.estado === 'correcto' ? 'Caja Perfecta' : 
               estadoDiferencia.estado === 'faltante' ? 'Faltante Detectado' : 'Sobrante Detectado'}
            </Typography>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography variant="h2" color={`${estadoDiferencia.color}.main`} fontWeight={700}>
                ${Math.abs(diferencia).toFixed(2)}
              </Typography>
            </motion.div>
            
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {estadoDiferencia.estado === 'correcto' 
                ? 'El efectivo contado coincide exactamente con lo esperado'
                : `Diferencia ${estadoDiferencia.estado === 'faltante' ? 'negativa' : 'positiva'} detectada`
              }
            </Typography>

            {/* Métricas adicionales */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Precisión
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {porcentajePrecision.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Riesgo
                  </Typography>
                  <Chip 
                    label={riesgoSeguridad.toUpperCase()}
                    color={riesgoSeguridad === 'alto' ? 'error' : riesgoSeguridad === 'medio' ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Eficiencia
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {eficienciaConteo !== 'no_medido' ? eficienciaConteo : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparación detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Efectivo Esperado
                </Typography>
                <Typography variant="h4" fontWeight={600} color="primary.main">
                  ${efectivoEsperado.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Según ventas en efectivo
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Efectivo Contado
                </Typography>
                <Typography variant="h4" fontWeight={600} color="secondary.main">
                  ${efectivoContado.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Físicamente en caja
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={efectivoEsperado > 0 ? (efectivoContado / efectivoEsperado * 100) : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'secondary.main'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3, 
              background: `linear-gradient(135deg, ${estadoDiferencia.color}.50 0%, ${estadoDiferencia.color}.100 100%)`
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  {getTendenciaIcon()}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 1 }}>
                    Diferencia
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={600} color={`${estadoDiferencia.color}.main`}>
                  ${Math.abs(diferencia).toFixed(2)}
                </Typography>
                <Chip
                  label={estadoDiferencia.estado.toUpperCase()}
                  color={estadoDiferencia.color}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tiempo de Conteo
                </Typography>
                <Typography variant="h4" fontWeight={600} color="warning.main">
                  {Math.floor(tiempoConteo / 60)}:{(tiempoConteo % 60).toString().padStart(2, '0')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Minutos:Segundos
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={eficienciaConteo !== 'no_medido' ? eficienciaConteo.toUpperCase() : 'N/A'}
                    color={
                      eficienciaConteo === 'excelente' ? 'success' :
                      eficienciaConteo === 'buena' ? 'info' :
                      eficienciaConteo === 'regular' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Barra de precisión mejorada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Análisis de Precisión
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" color={
                  porcentajePrecision >= 98 ? 'success.main' : 
                  porcentajePrecision >= 95 ? 'info.main' :
                  porcentajePrecision >= 90 ? 'warning.main' : 'error.main'
                } fontWeight={600}>
                  {porcentajePrecision.toFixed(1)}%
                </Typography>
                <Tooltip title="Ver análisis detallado">
                  <IconButton size="small" onClick={() => setAnalisisDialogOpen(true)}>
                    <AnalyticsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={porcentajePrecision}
              color={
                porcentajePrecision >= 98 ? 'success' : 
                porcentajePrecision >= 95 ? 'info' :
                porcentajePrecision >= 90 ? 'warning' : 'error'
              }
              sx={{ 
                height: 12, 
                borderRadius: 6,
                backgroundColor: 'grey.200'
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {porcentajePrecision >= 98 ? '🎯 Precisión Excelente' :
                 porcentajePrecision >= 95 ? '✅ Muy Buena Precisión' :
                 porcentajePrecision >= 90 ? '⚠️ Precisión Aceptable' : '❌ Revisar Procedimientos'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Meta: ≥95%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Información adicional y métricas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  📊 Métricas del Cierre
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Número de Ventas
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {numeroVentas}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Promedio por Venta
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        ${numeroVentas > 0 ? (efectivoEsperado / numeroVentas).toFixed(2) : '0.00'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Margen de Error
                      </Typography>
                      <Typography variant="h5" fontWeight={600} color={
                        Math.abs(diferencia) <= 10 ? 'success.main' :
                        Math.abs(diferencia) <= 50 ? 'warning.main' : 'error.main'
                      }>
                        {efectivoEsperado > 0 ? ((Math.abs(diferencia) / efectivoEsperado) * 100).toFixed(2) : '0.00'}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Nivel de Riesgo
                      </Typography>
                      <Chip
                        label={riesgoSeguridad.toUpperCase()}
                        color={riesgoSeguridad === 'alto' ? 'error' : riesgoSeguridad === 'medio' ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    📈 Tendencia Semanal
                  </Typography>
                  <Tooltip title="Ver historial completo">
                    <IconButton size="small" onClick={() => setAnalisisDialogOpen(true)}>
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ height: 120 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={datosHistorial}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis domain={[80, 100]} />
                      <RechartsTooltip 
                        formatter={(value, name) => [
                          name === 'precision' ? `${value.toFixed(1)}%` : `$${value.toFixed(2)}`,
                          name === 'precision' ? 'Precisión' : 'Diferencia'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="precision" 
                        stroke="#1976D2" 
                        fill="#E3F2FD" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Recomendaciones inteligentes */}
      {recomendaciones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'warning.200' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PsychologyIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Recomendaciones Inteligentes
                  </Typography>
                </Box>
                <Tooltip title="Ver todas las recomendaciones">
                  <IconButton size="small" onClick={() => setRecomendacionesDialogOpen(true)}>
                    <ExpandMoreIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <List dense>
                {recomendaciones.slice(0, 2).map((rec, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LightbulbIcon color={
                        rec.prioridad === 'alta' ? 'error' :
                        rec.prioridad === 'media' ? 'warning' : 'info'
                      } />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.titulo}
                      secondary={rec.descripcion}
                    />
                    <Chip
                      label={rec.prioridad.toUpperCase()}
                      size="small"
                      color={
                        rec.prioridad === 'alta' ? 'error' :
                        rec.prioridad === 'media' ? 'warning' : 'info'
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Alertas y recomendaciones según el estado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {diferencia !== 0 ? (
          <Alert 
            severity={estadoDiferencia.color} 
            sx={{ 
              borderRadius: 3,
              border: `1px solid ${estadoDiferencia.color}.200`
            }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => setRecomendacionesDialogOpen(true)}
              >
                Ver Soluciones
              </Button>
            }
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {estadoDiferencia.estado === 'faltante' ? '🔍 Faltante Detectado' : '📈 Sobrante Detectado'}
            </Typography>
            <Typography variant="body2">
              {estadoDiferencia.estado === 'faltante' 
                ? 'Se detectó un faltante en caja. Revisa ventas no registradas, cambio incorrecto entregado, o errores en el conteo.'
                : 'Se detectó un sobrante en caja. Verifica ventas registradas incorrectamente, cambio no entregado, o errores en el conteo.'
              }
            </Typography>
          </Alert>
        ) : cierreExistente && (
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              🎉 ¡Cierre Perfecto!
            </Typography>
            <Typography variant="body2">
              El cierre de caja está balanceado correctamente. No hay diferencias entre el efectivo esperado y el contado.
              {porcentajePrecision === 100 && ' ¡Excelente trabajo!'}
            </Typography>
          </Alert>
        )}
      </motion.div>

      {/* Dialog de Análisis Detallado */}
      <Dialog
        open={analisisDialogOpen}
        onClose={() => setAnalisisDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1 }} />
            Análisis Detallado del Cierre
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Historial de Precisión (Últimos 7 días)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosHistorial}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis domain={[80, 100]} />
                    <RechartsTooltip 
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Precisión']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="precision" 
                      stroke="#1976D2" 
                      strokeWidth={3}
                      dot={{ fill: '#1976D2', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Análisis de Patrones
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tendencia General"
                    secondary={`Precisión promedio: ${datosHistorial.reduce((acc, d) => acc + d.precision, 0) / datosHistorial.length}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nivel de Consistencia"
                    secondary={porcentajePrecision >= 95 ? "Muy consistente" : "Necesita mejora"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Recomendación"
                    secondary={
                      porcentajePrecision >= 98 ? "Mantener el excelente trabajo" :
                      porcentajePrecision >= 95 ? "Implementar verificación adicional" :
                      "Revisar procedimientos de conteo"
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalisisDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Recomendaciones */}
      <Dialog
        open={recomendacionesDialogOpen}
        onClose={() => setRecomendacionesDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LightbulbIcon sx={{ mr: 1 }} />
            Recomendaciones y Plan de Acción
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper orientation="vertical">
            {recomendaciones.map((rec, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {rec.titulo}
                    <Chip
                      label={rec.prioridad}
                      size="small"
                      color={
                        rec.prioridad === 'alta' ? 'error' :
                        rec.prioridad === 'media' ? 'warning' : 'info'
                      }
                    />
                  </Box>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {rec.descripcion}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecomendacionesDialogOpen(false)}>
            Cerrar
          </Button>
          <Button variant="contained">
            Marcar como Revisado
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComparacionCaja;