import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { cierreCajaService } from '../../../services/cierreCajaService';

const HistorialCierres = ({ historialCierres, loading, onRefresh }) => {
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false);
  const [cierreSeleccionado, setCierreSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [exportando, setExportando] = useState(null);

  const handleVerDetalle = async (cierre) => {
    setLoadingDetalle(true);
    try {
      const detalle = await cierreCajaService.obtenerDetalleCierre(cierre.id);
      setCierreSeleccionado(detalle);
      setDetalleDialogOpen(true);
    } catch (error) {
      console.error('Error obteniendo detalle:', error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleExportarPDF = async (cierreId) => {
    setExportando(cierreId);
    try {
      const resultado = await cierreCajaService.exportarCierrePDF(cierreId);
      // En una implementación real, aquí se descargaría el archivo
      alert(`PDF generado: ${resultado.nombre_archivo}`);
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setExportando(null);
    }
  };

  const getEstadoChip = (diferencia) => {
    const estado = cierreCajaService.calcularEstadoDiferencia(diferencia);
    const iconos = {
      correcto: <CheckCircleIcon sx={{ fontSize: 16 }} />,
      faltante: <WarningIcon sx={{ fontSize: 16 }} />,
      sobrante: <InfoIcon sx={{ fontSize: 16 }} />
    };

    return (
      <Chip
        icon={iconos[estado.estado]}
        label={estado.estado.toUpperCase()}
        color={estado.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const aplicarFiltros = () => {
    // En una implementación real, esto recargaría los datos con filtros
    onRefresh();
    setMostrarFiltros(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!historialCierres || historialCierres.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Alert severity="info">
          No hay cierres de caja registrados
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado con filtros */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Historial de Cierres de Caja
          </Typography>
          <Box>
            <Tooltip title="Filtros">
              <IconButton onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Panel de filtros */}
        {mostrarFiltros && (
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fecha Inicio"
                  type="date"
                  value={filtros.fecha_inicio}
                  onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fecha Fin"
                  type="date"
                  value={filtros.fecha_fin}
                  onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  onClick={aplicarFiltros}
                  fullWidth
                >
                  Aplicar Filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Tabla de cierres */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell align="right">Esperado</TableCell>
              <TableCell align="right">Contado</TableCell>
              <TableCell align="right">Diferencia</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historialCierres.map((cierre) => (
              <TableRow key={cierre.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {cierreCajaService.formatearFechaCierre(cierre.fecha_cierre)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cierreCajaService.formatearHoraCierre(cierre.hora_cierre)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cierre.usuario_nombre}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={500}>
                    ${cierre.total_ventas_esperado.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={500}>
                    ${cierre.total_efectivo_contado.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    color={
                      cierre.diferencia === 0 ? 'success.main' :
                      cierre.diferencia < 0 ? 'error.main' : 'info.main'
                    }
                  >
                    ${Math.abs(cierre.diferencia).toFixed(2)}
                    {cierre.diferencia !== 0 && (
                      <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                        ({cierre.diferencia > 0 ? '+' : '-'})
                      </Typography>
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {getEstadoChip(cierre.diferencia)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver Detalle">
                    <IconButton
                      size="small"
                      onClick={() => handleVerDetalle(cierre)}
                      disabled={loadingDetalle}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exportar PDF">
                    <IconButton
                      size="small"
                      onClick={() => handleExportarPDF(cierre.id)}
                      disabled={exportando === cierre.id}
                    >
                      {exportando === cierre.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <PictureAsPdfIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de detalle */}
      <Dialog
        open={detalleDialogOpen}
        onClose={() => setDetalleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalle del Cierre de Caja
          {cierreSeleccionado && (
            <Typography variant="subtitle2" color="text.secondary">
              {cierreCajaService.formatearFechaCierre(cierreSeleccionado.fecha_cierre)} - 
              {cierreSeleccionado.usuario_nombre}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {cierreSeleccionado && (
            <Box>
              {/* Resumen del cierre */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Efectivo Esperado
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ${cierreSeleccionado.total_ventas_esperado.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Efectivo Contado
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ${cierreSeleccionado.total_efectivo_contado.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Estado de la diferencia */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {getEstadoChip(cierreSeleccionado.diferencia)}
                <Typography variant="h5" fontWeight={600} sx={{ mt: 1 }}>
                  ${Math.abs(cierreSeleccionado.diferencia).toFixed(2)}
                </Typography>
              </Box>

              {/* Resumen por forma de pago */}
              {cierreSeleccionado.resumen_formas_pago && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Resumen por Forma de Pago
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Forma de Pago</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(cierreSeleccionado.resumen_formas_pago).map(([forma, datos]) => (
                        <TableRow key={forma}>
                          <TableCell>{forma.charAt(0).toUpperCase() + forma.slice(1)}</TableCell>
                          <TableCell align="right">{datos.cantidad}</TableCell>
                          <TableCell align="right">${datos.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Observaciones */}
              {cierreSeleccionado.observaciones && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Observaciones
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">
                      {cierreSeleccionado.observaciones}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalleDialogOpen(false)}>
            Cerrar
          </Button>
          {cierreSeleccionado && (
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => handleExportarPDF(cierreSeleccionado.id)}
            >
              Exportar PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HistorialCierres;