import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
// Importar servicios
import { facturacionService } from '../../../services/facturacionService';

const HistorialFacturas = ({ onVerDetalle, onActualizar }) => {
  // Estados principales
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    cliente: '',
    numero: ''
  });
  
  // Estados de UI
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Cargar facturas al montar el componente
  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Preparar filtros para la API
      const filtrosAPI = {};
      
      if (filtros.fecha_inicio) {
        filtrosAPI.fecha_inicio = filtros.fecha_inicio;
      }
      if (filtros.fecha_fin) {
        filtrosAPI.fecha_fin = filtros.fecha_fin;
      }
      if (filtros.cliente.trim()) {
        filtrosAPI.cliente = filtros.cliente.trim();
      }
      if (filtros.numero.trim()) {
        filtrosAPI.numero = filtros.numero.trim();
      }
      
      const facturasData = await facturacionService.obtenerHistorialFacturas(filtrosAPI);
      setFacturas(facturasData);
      
      // Resetear página si hay filtros aplicados
      if (Object.keys(filtrosAPI).length > 0) {
        setPage(0);
      }
      
    } catch (error) {
      console.error('Error cargando facturas:', error);
      setError('Error cargando el historial de facturas');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    cargarFacturas();
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: '',
      fecha_fin: '',
      cliente: '',
      numero: ''
    });
    // Recargar sin filtros
    setTimeout(() => {
      cargarFacturas();
    }, 100);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, factura) => {
    setMenuAnchor(event.currentTarget);
    setFacturaSeleccionada(factura);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setFacturaSeleccionada(null);
  };

  const handleVerDetalle = () => {
    if (facturaSeleccionada) {
      onVerDetalle(facturaSeleccionada);
    }
    handleMenuClose();
  };

  const handleExportarPDF = async () => {
    if (!facturaSeleccionada) return;
    
    try {
      const resultado = await facturacionService.exportarFacturaPDF(facturaSeleccionada.id);
      
      // Simular descarga (en producción sería un enlace real)
      console.log('PDF generado:', resultado.nombre_archivo);
      alert(`PDF generado: ${resultado.nombre_archivo}`);
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error generando el PDF');
    }
    
    handleMenuClose();
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-UY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'emitida':
        return 'success';
      case 'anulada':
        return 'error';
      default:
        return 'default';
    }
  };

  // Facturas paginadas
  const facturasPaginadas = facturas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
      <Box>
        {/* Encabezado y filtros */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="primary" />
              Historial de Facturas
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={mostrarFiltros ? "contained" : "outlined"}
                startIcon={<FilterIcon />}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                Filtros
              </Button>
              
              <Button
                variant="outlined"
                onClick={cargarFacturas}
                disabled={loading}
              >
                Actualizar
              </Button>
            </Box>
          </Box>

          {/* Panel de filtros */}
          {mostrarFiltros && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                        size="small"
                  label="Fecha Inicio"
                  type="date"
                  value={filtros.fecha_inicio}
                  onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                        }}
                  InputProps={{
                    startAdornment: (
                            <InputAdornment position="start">
                              <DateRangeIcon />
                            </InputAdornment>
                          )
                        }}
                      />
              </Grid>
              <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                  label="Fecha Fin"
                  type="date"
                  value={filtros.fecha_fin}
                  onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                        <DateRangeIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cliente"
                  value={filtros.cliente}
                  onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Número"
                  value={filtros.numero}
                  onChange={(e) => handleFiltroChange('numero', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={aplicarFiltros}
                    disabled={loading}
                            size="small"
                  >
                    Aplicar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={limpiarFiltros}
                    disabled={loading}
                              size="small"
                            >
                    Limpiar
                  </Button>
                </Box>
              </Grid>
            </Grid>
      </Box>
        )}
      </Paper>

      {/* Tabla de facturas */}
      <Paper>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : facturas.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No se encontraron facturas con los filtros aplicados.
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Documento</TableCell>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Generado por</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturasPaginadas.map((factura) => (
                    <TableRow key={factura.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {factura.nro_factura}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {factura.cliente_nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {factura.cliente_documento || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {formatearFecha(factura.fecha)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          ${factura.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={factura.estado}
                          color={getEstadoColor(factura.estado)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {factura.generado_por_nombre}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalle">
                          <IconButton
                            size="small"
                            onClick={() => onVerDetalle(factura)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Más opciones">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, factura)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={facturas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
            />
          </>
        )}
      </Paper>

      {/* Menú contextual */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleVerDetalle}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Ver Detalle
        </MenuItem>
        <MenuItem onClick={handleExportarPDF}>
          <DownloadIcon sx={{ mr: 1 }} />
          Exportar PDF
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HistorialFacturas;