import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  useTheme,
  alpha,
  InputAdornment,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Tune as TuneIcon,
  FilterAlt as FilterAltIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { proveedorService } from '../../../services/proveedorService';

const ComprasFilters = ({ filtros, onFiltrosChange, loading, compras }) => {
  const theme = useTheme();
  const [proveedores, setProveedores] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [savedFilters, setSavedFilters] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rangoMontos, setRangoMontos] = useState([0, 10000]);
  const [filtrosTemporales, setFiltrosTemporales] = useState(filtros);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores();
    cargarFiltrosGuardados();
  }, []);

  // Actualizar filtros temporales cuando cambian los filtros principales
  useEffect(() => {
    setFiltrosTemporales(filtros);
  }, [filtros]);

  // Contar filtros activos
  useEffect(() => {
    const count = Object.values(filtros).filter(value => value && value.toString().trim() !== '').length;
    setActiveFilters(count);
  }, [filtros]);

  // Calcular rango de montos basado en las compras
  useEffect(() => {
    if (compras && compras.length > 0) {
      const montos = compras.map(compra => parseFloat(compra.total) || 0);
      const min = Math.min(...montos);
      const max = Math.max(...montos);
      setRangoMontos([Math.floor(min), Math.ceil(max)]);
    }
  }, [compras]);

  const cargarProveedores = async () => {
    try {
      const data = await proveedorService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  const cargarFiltrosGuardados = () => {
    try {
      const saved = localStorage.getItem('compras_filtros_guardados');
      if (saved) {
        setSavedFilters(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error cargando filtros guardados:', error);
    }
  };

  const guardarFiltros = useCallback(() => {
    if (!filterName.trim()) return;
    
    const nuevoFiltro = {
      id: Date.now(),
      nombre: filterName,
      filtros: { ...filtros },
      fecha: new Date().toISOString(),
    };
    
    const nuevosGuardados = [...savedFilters, nuevoFiltro];
    setSavedFilters(nuevosGuardados);
    localStorage.setItem('compras_filtros_guardados', JSON.stringify(nuevosGuardados));
    setSaveDialogOpen(false);
    setFilterName('');
  }, [filtros, savedFilters, filterName]);

  const aplicarFiltroGuardado = useCallback((filtroGuardado) => {
    onFiltrosChange(filtroGuardado.filtros);
    setMenuAnchor(null);
  }, [onFiltrosChange]);

  const eliminarFiltroGuardado = useCallback((id) => {
    const nuevosGuardados = savedFilters.filter(f => f.id !== id);
    setSavedFilters(nuevosGuardados);
    localStorage.setItem('compras_filtros_guardados', JSON.stringify(nuevosGuardados));
  }, [savedFilters]);

  const handleFiltroChange = useCallback((campo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: valor
    };
    onFiltrosChange(nuevosFiltros);
  }, [filtros, onFiltrosChange]);

  const handleFiltroTemporalChange = useCallback((campo, valor) => {
    setFiltrosTemporales(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  const aplicarFiltrosTemporales = useCallback(() => {
    onFiltrosChange(filtrosTemporales);
  }, [filtrosTemporales, onFiltrosChange]);

  const limpiarFiltros = useCallback(() => {
    const filtrosVacios = {
      proveedor_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      producto: '',
      metodo_pago: '',
      monto_min: '',
      monto_max: '',
      orden: 'fecha',
      direccion: 'desc'
    };
    onFiltrosChange(filtrosVacios);
    setFiltrosTemporales(filtrosVacios);
  }, [onFiltrosChange]);

  const handleRangoMontosChange = useCallback((event, newValue) => {
    handleFiltroTemporalChange('monto_min', newValue[0]);
    handleFiltroTemporalChange('monto_max', newValue[1]);
  }, [handleFiltroTemporalChange]);

  // Filtros rápidos predefinidos
  const filtrosRapidos = useMemo(() => [
    {
      nombre: 'Hoy',
      icon: <ScheduleIcon />,
      filtros: {
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: new Date().toISOString().split('T')[0],
      }
    },
    {
      nombre: 'Esta semana',
      icon: <CalendarIcon />,
      filtros: {
        fecha_inicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fecha_fin: new Date().toISOString().split('T')[0],
      }
    },
    {
      nombre: 'Este mes',
      icon: <TrendingUpIcon />,
      filtros: {
        fecha_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        fecha_fin: new Date().toISOString().split('T')[0],
      }
    },
    {
      nombre: 'Efectivo',
      icon: <AttachMoneyIcon />,
      filtros: {
        metodo_pago: 'efectivo'
      }
    },
    {
      nombre: 'Transferencia',
      icon: <BusinessIcon />,
      filtros: {
        metodo_pago: 'transferencia'
      }
    },
  ], []);

  const aplicarFiltroRapido = useCallback((filtroRapido) => {
    const nuevosFiltros = {
      ...filtros,
      ...filtroRapido.filtros
    };
    onFiltrosChange(nuevosFiltros);
  }, [filtros, onFiltrosChange]);

  // Estadísticas de filtros
  const estadisticasFiltros = useMemo(() => {
    if (!compras || compras.length === 0) return null;

    const comprasFiltradas = compras.filter(compra => {
      if (filtros.proveedor_id && compra.proveedor_id !== parseInt(filtros.proveedor_id)) return false;
      if (filtros.metodo_pago && compra.metodo_pago !== filtros.metodo_pago) return false;
      if (filtros.fecha_inicio && compra.fecha < filtros.fecha_inicio) return false;
      if (filtros.fecha_fin && compra.fecha > filtros.fecha_fin) return false;
      if (filtros.monto_min && parseFloat(compra.total) < parseFloat(filtros.monto_min)) return false;
      if (filtros.monto_max && parseFloat(compra.total) > parseFloat(filtros.monto_max)) return false;
      if (filtros.producto && !compra.detalles?.some(d => 
        d.producto_nombre?.toLowerCase().includes(filtros.producto.toLowerCase())
      )) return false;
      return true;
    });

    const totalFiltrado = comprasFiltradas.reduce((sum, compra) => sum + (parseFloat(compra.total) || 0), 0);
    const promedioFiltrado = comprasFiltradas.length > 0 ? totalFiltrado / comprasFiltradas.length : 0;

    return {
      total: comprasFiltradas.length,
      totalOriginal: compras.length,
      montoTotal: totalFiltrado,
      promedio: promedioFiltrado,
      porcentaje: compras.length > 0 ? (comprasFiltradas.length / compras.length) * 100 : 0,
    };
  }, [compras, filtros]);

  // Filtros activos como chips
  const filtrosActivos = useMemo(() => {
    return [
      { key: 'proveedor_id', label: 'Proveedor', value: filtros.proveedor_id, 
        displayValue: proveedores.find(p => p.id.toString() === filtros.proveedor_id.toString())?.nombre || filtros.proveedor_id },
      { key: 'fecha_inicio', label: 'Desde', value: filtros.fecha_inicio },
      { key: 'fecha_fin', label: 'Hasta', value: filtros.fecha_fin },
      { key: 'producto', label: 'Producto', value: filtros.producto },
      { key: 'metodo_pago', label: 'Método', value: filtros.metodo_pago },
      { key: 'monto_min', label: 'Monto mín.', value: filtros.monto_min, displayValue: filtros.monto_min ? `$${filtros.monto_min}` : '' },
      { key: 'monto_max', label: 'Monto máx.', value: filtros.monto_max, displayValue: filtros.monto_max ? `$${filtros.monto_max}` : '' },
    ].filter(filtro => filtro.value && filtro.value.toString().trim() !== '');
  }, [filtros, proveedores]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        {/* Header de filtros */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Filtros de Búsqueda
              </Typography>
              {activeFilters > 0 && (
                <Badge badgeContent={activeFilters} color="primary">
                  <Chip
                    label={`${activeFilters} activo${activeFilters > 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    }}
                  />
                </Badge>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {savedFilters.length > 0 && (
              <Tooltip title="Filtros guardados">
                <IconButton
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  sx={{
                    color: 'secondary.main',
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.2),
                    },
                  }}
                >
                  <BookmarkIcon />
                </IconButton>
              </Tooltip>
            )}

            {activeFilters > 0 && (
              <>
                <Tooltip title="Guardar filtros">
                  <IconButton
                    onClick={() => setSaveDialogOpen(true)}
                    sx={{
                      color: 'success.main',
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                      },
                    }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Limpiar filtros">
                  <IconButton
                    onClick={limpiarFiltros}
                    sx={{
                      color: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            
            <Tooltip title={expanded ? "Contraer filtros" : "Expandir filtros"}>
              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Filtros avanzados">
              <IconButton
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{
                  color: showAdvanced ? 'warning.main' : 'text.secondary',
                  bgcolor: showAdvanced ? alpha(theme.palette.warning.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                  },
                }}
              >
                <TuneIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filtros rápidos */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            Filtros Rápidos:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filtrosRapidos.map((filtro, index) => (
              <motion.div
                key={filtro.nombre}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Chip
                  icon={filtro.icon}
                  label={filtro.nombre}
                  onClick={() => aplicarFiltroRapido(filtro)}
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: 'primary.main',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Filtros activos como chips */}
        <AnimatePresence>
          {filtrosActivos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                  Filtros aplicados:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {filtrosActivos.map((filtro) => (
                    <motion.div
                      key={filtro.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Chip
                        label={`${filtro.label}: ${filtro.displayValue || filtro.value}`}
                        onDelete={() => handleFiltroChange(filtro.key, '')}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          '& .MuiChip-deleteIcon': {
                            color: 'primary.main',
                            '&:hover': {
                              color: 'primary.dark',
                            },
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estadísticas de filtros */}
        {estadisticasFiltros && (
          <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.info.main, 0.02), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon sx={{ color: 'info.main', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Resultados: {estadisticasFiltros.total} de {estadisticasFiltros.totalOriginal}
                  </Typography>
                  <Chip
                    label={`${estadisticasFiltros.porcentaje.toFixed(1)}%`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" color="text.secondary">
                  <strong>Total:</strong> ${estadisticasFiltros.montoTotal.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Promedio:</strong> ${estadisticasFiltros.promedio.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Formulario de filtros */}
        <Collapse in={expanded} timeout={300}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Grid container spacing={3}>
              {/* Búsqueda por producto */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Buscar producto"
                  value={filtros.producto}
                  onChange={(e) => handleFiltroChange('producto', e.target.value)}
                  placeholder="Nombre del producto..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: filtros.producto && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => handleFiltroChange('producto', '')}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Selector de proveedor */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={proveedores.find(p => p.id.toString() === filtros.proveedor_id.toString()) || null}
                  onChange={(event, newValue) => {
                    handleFiltroChange('proveedor_id', newValue?.id || '');
                  }}
                  options={proveedores}
                  getOptionLabel={(option) => option.nombre || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Proveedor"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <BusinessIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.nombre}
                        </Typography>
                        {option.rut && (
                          <Typography variant="caption" color="text.secondary">
                            RUT: {option.rut}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No hay proveedores disponibles"
                />
              </Grid>

              {/* Fecha inicio */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha desde"
                  value={filtros.fecha_inicio}
                  onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
              </Grid>

              {/* Fecha fin */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha hasta"
                  value={filtros.fecha_fin}
                  onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
              </Grid>

              {/* Método de pago */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Método de pago</InputLabel>
                  <Select
                    value={filtros.metodo_pago}
                    onChange={(e) => handleFiltroChange('metodo_pago', e.target.value)}
                    label="Método de pago"
                    startAdornment={
                      <InputAdornment position="start">
                        <AttachMoneyIcon color="action" sx={{ ml: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    <MenuItem value="">
                      <em>Todos los métodos</em>
                    </MenuItem>
                    <MenuItem value="efectivo">💵 Efectivo</MenuItem>
                    <MenuItem value="transferencia">🏦 Transferencia</MenuItem>
                    <MenuItem value="cheque">📝 Cheque</MenuItem>
                    <MenuItem value="credito">💳 Crédito</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Ordenamiento */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={filtros.orden || 'fecha'}
                    onChange={(e) => handleFiltroChange('orden', e.target.value)}
                    label="Ordenar por"
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon color="action" sx={{ ml: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    <MenuItem value="fecha">📅 Fecha</MenuItem>
                    <MenuItem value="total">💰 Monto</MenuItem>
                    <MenuItem value="proveedor_nombre">🏢 Proveedor</MenuItem>
                    <MenuItem value="numero_comprobante">📄 Comprobante</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Filtros avanzados */}
            <Collapse in={showAdvanced}>
              <Card sx={{ mt: 3, bgcolor: alpha(theme.palette.warning.main, 0.02), border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TuneIcon />
                    Filtros Avanzados
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Rango de montos */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Rango de Montos
                      </Typography>
                      <Box sx={{ px: 2 }}>
                        <Slider
                          value={[
                            parseFloat(filtrosTemporales.monto_min) || rangoMontos[0],
                            parseFloat(filtrosTemporales.monto_max) || rangoMontos[1]
                          ]}
                          onChange={handleRangoMontosChange}
                          valueLabelDisplay="auto"
                          min={rangoMontos[0]}
                          max={rangoMontos[1]}
                          step={10}
                          marks={[
                            { value: rangoMontos[0], label: `$${rangoMontos[0]}` },
                            { value: rangoMontos[1], label: `$${rangoMontos[1]}` }
                          ]}
                          valueLabelFormat={(value) => `$${value}`}
                          sx={{
                            color: 'warning.main',
                            '& .MuiSlider-thumb': {
                              bgcolor: 'warning.main',
                            },
                            '& .MuiSlider-track': {
                              bgcolor: 'warning.main',
                            },
                            '& .MuiSlider-rail': {
                              bgcolor: alpha(theme.palette.warning.main, 0.3),
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Dirección de ordenamiento */}
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={filtros.direccion === 'asc'}
                            onChange={(e) => handleFiltroChange('direccion', e.target.checked ? 'asc' : 'desc')}
                            color="warning"
                          />
                        }
                        label="Orden ascendente"
                      />
                    </Grid>

                    {/* Aplicar filtros temporales */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => setFiltrosTemporales(filtros)}
                          startIcon={<RestoreIcon />}
                          sx={{
                            borderColor: alpha(theme.palette.grey[400], 0.5),
                            color: 'text.secondary',
                          }}
                        >
                          Restaurar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={aplicarFiltrosTemporales}
                          startIcon={<FilterAltIcon />}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                          }}
                        >
                          Aplicar Filtros
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Collapse>

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={limpiarFiltros}
                startIcon={<ClearIcon />}
                disabled={activeFilters === 0}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.error.main, 0.5),
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.main',
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                  },
                }}
              >
                Limpiar Filtros
              </Button>
              
              <Button
                variant="contained"
                onClick={cargarProveedores}
                startIcon={<RefreshIcon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                Actualizar
              </Button>
            </Box>
          </motion.div>
        </Collapse>

        {/* Menu de filtros guardados */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
              minWidth: 250,
              maxHeight: 400,
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Filtros Guardados
            </Typography>
          </Box>
          {savedFilters.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <BookmarkBorderIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No hay filtros guardados
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {savedFilters.map((filtro) => (
                <ListItem
                  key={filtro.id}
                  button
                  onClick={() => aplicarFiltroGuardado(filtro)}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }
                  }}
                >
                  <ListItemIcon>
                    <BookmarkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={filtro.nombre}
                    secondary={new Date(filtro.fecha).toLocaleDateString()}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarFiltroGuardado(filtro.id);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Menu>

        {/* Dialog para guardar filtros */}
        <Dialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>Guardar Filtros</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre del filtro"
              fullWidth
              variant="outlined"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Ej: Compras del mes, Proveedores principales..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSaveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={guardarFiltros}
              variant="contained"
              disabled={!filterName.trim()}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ComprasFilters;