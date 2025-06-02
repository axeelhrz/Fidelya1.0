import React from 'react';
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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { cierreCajaService } from '../../../services/cierreCajaService';

const ComparacionCaja = ({ resumenVentas, cierreExistente }) => {
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

  const estadoDiferencia = cierreCajaService.calcularEstadoDiferencia(diferencia);

  // Calcular porcentaje de precisión
  const porcentajePrecision = efectivoEsperado > 0 
    ? Math.max(0, 100 - (Math.abs(diferencia) / efectivoEsperado * 100))
    : 100;

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

  return (
    <Box>
      {/* Estado general del cierre */}
      <Card sx={{ mb: 3, bgcolor: `${estadoDiferencia.color}.50`, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          {getIconoEstado()}
          <Typography variant="h5" fontWeight={600} sx={{ mt: 1, mb: 0.5 }}>
            {estadoDiferencia.estado === 'correcto' ? 'Caja Correcta' : 
             estadoDiferencia.estado === 'faltante' ? 'Faltante en Caja' : 'Sobrante en Caja'}
          </Typography>
          <Typography variant="h3" color={`${estadoDiferencia.color}.main`} fontWeight={700}>
            ${Math.abs(diferencia).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {estadoDiferencia.estado === 'correcto' 
              ? 'El efectivo contado coincide exactamente con lo esperado'
              : `Diferencia ${estadoDiferencia.estado === 'faltante' ? 'negativa' : 'positiva'} detectada`
            }
          </Typography>
        </CardContent>
      </Card>

      {/* Comparación detallada */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, bgcolor: `${estadoDiferencia.color}.50` }}>
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
      </Grid>

      {/* Barra de precisión */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Precisión del Cierre
            </Typography>
            <Typography variant="h6" color={porcentajePrecision >= 95 ? 'success.main' : porcentajePrecision >= 90 ? 'warning.main' : 'error.main'}>
              {porcentajePrecision.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={porcentajePrecision}
            color={porcentajePrecision >= 95 ? 'success' : porcentajePrecision >= 90 ? 'warning' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {porcentajePrecision >= 95 ? 'Excelente precisión' :
             porcentajePrecision >= 90 ? 'Buena precisión' :
             porcentajePrecision >= 80 ? 'Precisión aceptable' : 'Revisar procedimientos'}
          </Typography>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Número de Ventas
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {numeroVentas}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Transacciones procesadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Promedio por Venta
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                ${numeroVentas > 0 ? (efectivoEsperado / numeroVentas).toFixed(2) : '0.00'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                En efectivo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas y recomendaciones */}
      {diferencia !== 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert 
            severity={estadoDiferencia.color} 
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {estadoDiferencia.estado === 'faltante' ? 'Faltante Detectado' : 'Sobrante Detectado'}
            </Typography>
            <Typography variant="body2">
              {estadoDiferencia.estado === 'faltante' 
                ? 'Revisa si hay ventas no registradas, cambio incorrecto entregado, o errores en el conteo.'
                : 'Verifica si hay ventas registradas incorrectamente, cambio no entregado, o errores en el conteo.'
              }
            </Typography>
          </Alert>
        </Box>
      )}

      {diferencia === 0 && cierreExistente && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              ¡Perfecto!
            </Typography>
            <Typography variant="body2">
              El cierre de caja está balanceado correctamente. No hay diferencias entre el efectivo esperado y el contado.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default ComparacionCaja;