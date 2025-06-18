import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Fab,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FileDownload as FileDownloadIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cierreCajaService } from '../../../services/cierreCajaService';

const HistorialCierres = ({ historialCierres, loading, onRefresh }) => {
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    usuario: '',
    estado_diferencia: 'todos',
    precision_min: '',
    busqueda: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false);
  const [analisisDialogOpen, setAnalisisDialogOpen] = useState(false);
  const [cierreSeleccionado, setCierreSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [exportando, setExportando] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [cierreMenuId, setCierreMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fecha_cierre', direccion: 'desc' });
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    calcularEstadisticas();
  }, [historialCierres]);

  const calcularEstadisticas = () => {
    if (!historialCierres || historialCierres.length === 0) return;

    const stats = {
      total_cierres: historialCierres.length,
      precision_promedio: 0,
      cierres_perfectos: 0,
      diferencia_promedio: 0,
      tendencia_precision: [],
      distribucion_diferencias: { correctos: 0, faltantes: 0, sobrantes: 0 }
    };

    let sumaPrecision = 0;
    let sumaDiferencia = 0;

    historialCierres.forEach(cierre => {
      const diferencia = cierre.diferencia || 0;
      const precision = cierre.total_ventas_esperado > 0 
        ? Math.max(0, 100 - (Math.abs(diferencia) / cierre.total_ventas_esperado * 100))
        : 100;

      sumaPrecision += precision;
      sumaDiferencia += Math.abs(diferencia);

      if (diferencia === 0) {
        stats.cierres_perfectos++;
        stats.distribucion_diferencias.correctos++;
      } else if (diferencia < 0) {
        stats.distribucion_diferencias.faltantes++;
      } else {
        stats.distribucion_diferencias.sobrantes++;
      }

      stats.tendencia_precision.push({
        fecha: new Date(cierre.fecha_cierre).toLocaleDateString('es-UY', { month: 'short', day: 'numeric' }),
        precision: precision,
        diferencia: Math.abs(diferencia)
      });
    });

    stats.precision_promedio = sumaPrecision / historialCierres.length;
    stats.diferencia_promedio = sumaDiferencia / historialCierres.length;

    setEstadisticas(stats);
  };

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
      // Simular descarga
      const link = document.createElement('a');
      link.href = resultado.url_descarga || '#';
      link.download = resultado.nombre_archivo || `cierre_${cierreId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setExportando(null);
    }
  };

  const handleExportarExcel = async () => {
    try {
      const resultado = await cierreCajaService.exportarHistorialExcel(filtros);
      const link = document.createElement('a');
      link.href = resultado.url_descarga || '#';
      link.download = resultado.nombre_archivo || 'historial_cierres.xlsx';
      link.click();
    } catch (error) {
      console.error('Error exportando Excel:', error);
      alert('Error al generar el archivo Excel');
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
    onRefresh();
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: '',
      fecha_fin: '',
      usuario: '',
      estado_diferencia: 'todos',
      precision_min: '',
      busqueda: ''
    });
  };

  const filtrarCierres = () => {
    let cierresFiltrados = [...historialCierres];

    if (filtros.busqueda) {
      cierresFiltrados = cierresFiltrados.filter(cierre =>
        cierre.usuario_nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cierre.observaciones?.toLowerCase().includes(filtros.busqueda.toLowerCase())
      );
    }

    if (filtros.estado_diferencia !== 'todos') {
      cierresFiltrados = cierresFiltrados.filter(cierre => {
        const estado = cierreCajaService.calcularEstadoDiferencia(cierre.diferencia).estado;
        return estado === filtros.estado_diferencia;
      });
    }

    if (filtros.precision_min) {
      cierresFiltrados = cierresFiltrados.filter(cierre => {
        const precision = cierre.total_ventas_esperado > 0 
          ? Math.max(0, 100 - (Math.abs(cierre.diferencia) / cierre.total_ventas_esperado * 100))
          : 100;
        return precision >= parseFloat(filtros.precision_min);
      });
    }

    return cierresFiltrados;
  };

  const cierresFiltrados = filtrarCierres();
  const cierresPaginados = cierresFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleMenuOpen = (event, cierreId) => {
    setMenuAnchor(event.currentTarget);
    setCierreMenuId(cierreId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCierreMenuId(null);
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
      {/* Encabezado con estadísticas */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Historial de Cierres de Caja
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Análisis estadístico">
              <IconButton onClick={() => setAnalisisDialogOpen(true)}>
                <Badge badgeContent={estadisticas?.cierres_perfectos} color="success">
                  <AnalyticsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportar a Excel">
              <IconButton onClick={handleExportarExcel}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
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

        {/* Estadísticas rápidas */}
        {estadisticas && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Cierres
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {estadisticas.total_cierres}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Precisión Promedio
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    {estadisticas.precision_promedio.toFixed(1)}%
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Cierres Perfectos
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    {estadisticas.cierres_perfectos}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Diferencia Promedio
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="warning.main">
                    ${estadisticas.diferencia_promedio.toFixed(2)}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Panel de filtros */}
        <Collapse in={mostrarFiltros}>
          <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Filtros Avanzados
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Buscar"
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                  placeholder="Usuario, observaciones..."
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Inicio"
                  value={filtros.fecha_inicio}
                  onChange={(e) => setFiltros({ 
                    ...filtros, 
                    fecha_inicio: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Fin"
                  value={filtros.fecha_fin}
                  onChange={(e) => setFiltros({ 
                    ...filtros, 
                    fecha_fin: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filtros.estado_diferencia}
                    onChange={(e) => setFiltros({ ...filtros, estado_diferencia: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="correcto">Correctos</MenuItem>
                    <MenuItem value="faltante">Faltantes</MenuItem>
                    <MenuItem value="sobrante">Sobrantes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Precisión Mín. %"
                  type="number"
                  value={filtros.precision_min}
                  onChange={(e) => setFiltros({ ...filtros, precision_min: e.target.value })}
                  inputProps={{ min: 0, max: 100 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={aplicarFiltros}
                    size="small"
                    fullWidth
                  >
                    Aplicar
                  </Button>
                  <IconButton onClick={limpiarFiltros} size="small">
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </Box>

      {/* Tabla de cierres */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell align="right">Esperado</TableCell>
              <TableCell align="right">Contado</TableCell>
              <TableCell align="right">Diferencia</TableCell>
              <TableCell align="center">Precisión</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {cierresPaginados.map((cierre, index) => {
                const precision = cierre.total_ventas_esperado > 0 
                  ? Math.max(0, 100 - (Math.abs(cierre.diferencia) / cierre.total_ventas_esperado * 100))
                  : 100;

                return (
                  <motion.tr
                    key={cierre.id}
                    component={TableRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleVerDetalle(cierre)}
                  >
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          {cierre.usuario_nombre.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="body2">
                          {cierre.usuario_nombre}
                        </Typography>
                      </Box>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {cierre.diferencia > 0 ? (
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'info.main', mr: 0.5 }} />
                        ) : cierre.diferencia < 0 ? (
                          <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                        ) : (
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                        )}
                        <Typography 
                          variant="body2" 
                          fontWeight={600}
                          color={
                            cierre.diferencia === 0 ? 'success.main' :
                            cierre.diferencia < 0 ? 'error.main' : 'info.main'
                          }
                        >
                          ${Math.abs(cierre.diferencia).toFixed(2)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={600}
                          color={
                            precision >= 98 ? 'success.main' :
                            precision >= 95 ? 'info.main' :
                            precision >= 90 ? 'warning.main' : 'error.main'
                          }
                        >
                          {precision.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {getEstadoChip(cierre.diferencia)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerDetalle(cierre);
                            }}
                            disabled={loadingDetalle}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, cierre.id);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={cierresFiltrados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />

      {/* Menú contextual */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleExportarPDF(cierreMenuId);
          handleMenuClose();
        }}>
          <PictureAsPdfIcon sx={{ mr: 1 }} />
          Exportar PDF
        </MenuItem>
        <MenuItem onClick={() => {
          const cierre = historialCierres.find(c => c.id === cierreMenuId);
          if (cierre) handleVerDetalle(cierre);
          handleMenuClose();
        }}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Ver Detalle
        </MenuItem>
      </Menu>

      {/* Dialog de detalle */}
      <Dialog
        open={detalleDialogOpen}
        onClose={() => setDetalleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Detalle del Cierre de Caja</Typography>
              {cierreSeleccionado && (
                <Typography variant="subtitle2" color="text.secondary">
                  {cierreCajaService.formatearFechaCierre(cierreSeleccionado.fecha_cierre)} - 
                  {cierreSeleccionado.usuario_nombre}
                </Typography>
              )}
            </Box>
            {cierreSeleccionado && (
              <Chip
                label={`Precisión: ${cierreSeleccionado.total_ventas_esperado > 0 
                  ? Math.max(0, 100 - (Math.abs(cierreSeleccionado.diferencia) / cierreSeleccionado.total_ventas_esperado * 100)).toFixed(1)
                  : '100.0'}%`}
                color="primary"
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {cierreSeleccionado && (
            <Box>
              {/* Resumen del cierre */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                    <Typography variant="caption" color="text.secondary">
                      Efectivo Esperado
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      ${cierreSeleccionado.total_ventas_esperado.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.50' }}>
                    <Typography variant="caption" color="text.secondary">
                      Efectivo Contado
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="secondary.main">
                      ${cierreSeleccionado.total_efectivo_contado.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: `${cierreCajaService.calcularEstadoDiferencia(cierreSeleccionado.diferencia).color}.50` }}>
                    <Typography variant="caption" color="text.secondary">
                      Diferencia
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color={`${cierreCajaService.calcularEstadoDiferencia(cierreSeleccionado.diferencia).color}.main`}>
                      ${Math.abs(cierreSeleccionado.diferencia).toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                    <Typography variant="caption" color="text.secondary">
                      Tiempo Conteo
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="info.main">
                      {Math.floor((cierreSeleccionado.tiempo_conteo || 0) / 60)}:{((cierreSeleccionado.tiempo_conteo || 0) % 60).toString().padStart(2, '0')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Estado de la diferencia */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {getEstadoChip(cierreSeleccionado.diferencia)}
              </Box>

              {/* Resumen por forma de pago */}
              {cierreSeleccionado.resumen_formas_pago && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Resumen por Forma de Pago
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Forma de Pago</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">Porcentaje</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(cierreSeleccionado.resumen_formas_pago).map(([forma, datos]) => (
                          <TableRow key={forma}>
                            <TableCell>
                              <Chip 
                                label={forma.charAt(0).toUpperCase() + forma.slice(1)}
                                size="small"
                                color={forma === 'efectivo' ? 'success' : forma === 'tarjeta' ? 'info' : 'warning'}
                              />
                            </TableCell>
                            <TableCell align="right">{datos.cantidad}</TableCell>
                            <TableCell align="right">${datos.total.toFixed(2)}</TableCell>
                            <TableCell align="right">
                              {((datos.total / cierreSeleccionado.total_ventas_esperado) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
              startIcon={exportando === cierreSeleccionado.id ? <CircularProgress size={16} /> : <PictureAsPdfIcon />}
              onClick={() => handleExportarPDF(cierreSeleccionado.id)}
              disabled={exportando === cierreSeleccionado.id}
            >
              Exportar PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog de análisis estadístico */}
      <Dialog
        open={analisisDialogOpen}
        onClose={() => setAnalisisDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1 }} />
            Análisis Estadístico de Cierres
          </Box>
        </DialogTitle>
        <DialogContent>
          {estadisticas && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Tendencia de Precisión
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={estadisticas.tendencia_precision.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[80, 100]} />
                      <RechartsTooltip 
                        formatter={(value, name) => [
                          name === 'precision' ? `${value.toFixed(1)}%` : `$${value.toFixed(2)}`,
                          name === 'precision' ? 'Precisión' : 'Diferencia'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="precision" 
                        stroke="#1976D2" 
                        strokeWidth={3}
                        dot={{ fill: '#1976D2', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Distribución de Estados
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { estado: 'Correctos', cantidad: estadisticas.distribucion_diferencias.correctos, color: '#4CAF50' },
                      { estado: 'Faltantes', cantidad: estadisticas.distribucion_diferencias.faltantes, color: '#F44336' },
                      { estado: 'Sobrantes', cantidad: estadisticas.distribucion_diferencias.sobrantes, color: '#2196F3' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="estado" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="cantidad" fill="#1976D2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Métricas Clave
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={600} color="primary.main">
                        {estadisticas.precision_promedio.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Precisión Promedio
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        {((estadisticas.cierres_perfectos / estadisticas.total_cierres) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tasa de Cierres Perfectos
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={600} color="warning.main">
                        ${estadisticas.diferencia_promedio.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Diferencia Promedio
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" fontWeight={600} color="info.main">
                        {estadisticas.total_cierres}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total de Cierres
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalisisDialogOpen(false)}>
            Cerrar
          </Button>
          <Button variant="contained" onClick={handleExportarExcel}>
            Exportar Datos
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para análisis rápido */}
      <Fab
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 24,
        }}
        onClick={() => setAnalisisDialogOpen(true)}
      >
        <AnalyticsIcon />
      </Fab>
    </Box>
  );
};

export default HistorialCierres;