import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Autocomplete,
  Button,
  Box,
  Typography,
  Chip,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { clienteService } from '../../../services/clienteService';

const VentasFilters = ({ filtros, onFiltrosChange }) => {
  const theme = useTheme();
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoadingClientes(true);
    try {
      const clientesData = await clienteService.obtenerClientes();
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const nuevosFiltros = {
      ...filtros,
      [field]: value
    };
    onFiltrosChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      fecha_inicio: '',
      fecha_fin: '',
      cliente_id: '',
      usuario_id: '',
      forma_pago: '',
      producto: ''
    };
    onFiltrosChange(filtrosVacios);
  };

  const formasPago = [
    { value: 'efectivo', label: 'Efectivo', icon: '💵' },
    { value: 'tarjeta', label: 'Tarjeta', icon: '💳' },
    { value: 'transferencia', label: 'Transferencia', icon: '🏦' },
    { value: 'mixto', label: 'Mixto', icon: '🔄' }
  ];

  const filtrosActivos = Object.values(filtros).filter(valor => valor !== '').length;

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🔍 Filtros de Búsqueda
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {filtrosActivos > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Chip
                  label={`${filtrosActivos} filtro${filtrosActivos > 1 ? 's' : ''} activo${filtrosActivos > 1 ? 's' : ''}`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </motion.div>
            )}
            
            <Button
              variant="outlined"
              size="small"
              onClick={limpiarFiltros}
              startIcon={<ClearIcon />}
              disabled={filtrosActivos === 0}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Limpiar
            </Button>
            
            <IconButton
              onClick={toggleAdvanced}
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
        </Box>

        {/* Filtros básicos */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {/* Rango de fechas */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.02)
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Período
                </Typography>
              </Box>
              <TextField
                label="Fecha Inicio"
                type="date"
                value={filtros.fecha_inicio}
                onChange={(e) => handleFilterChange('fecha_inicio', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                label="Fecha Fin"
                type="date"
                value={filtros.fecha_fin}
                onChange={(e) => handleFilterChange('fecha_fin', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Paper>
          </Grid>

          {/* Cliente */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.info.main, 0.02)
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.info.main }} />
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Cliente
                </Typography>
              </Box>
              <Autocomplete
                options={clientes}
                getOptionLabel={(option) => option.nombre || ''}
                value={clientes.find(c => c.id === filtros.cliente_id) || null}
                onChange={(event, newValue) => {
                  handleFilterChange('cliente_id', newValue ? newValue.id : '');
                }}
                loading={loadingClientes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Seleccionar cliente"
                    size="small"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.nombre}
                      </Typography>
                      {option.correo && (
                        <Typography variant="caption" color="text.secondary">
                          {option.correo}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Paper>
          </Grid>

          {/* Forma de pago */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.success.main, 0.02)
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.success.main }} />
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Forma de Pago
                </Typography>
              </Box>
              <Autocomplete
                options={formasPago}
                getOptionLabel={(option) => option.label}
                value={formasPago.find(fp => fp.value === filtros.forma_pago) || null}
                onChange={(event, newValue) => {
                  handleFilterChange('forma_pago', newValue ? newValue.value : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Seleccionar forma de pago"
                    size="small"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 1 }}>{option.icon}</Typography>
                      <Typography variant="body2">{option.label}</Typography>
                    </Box>
                  </Box>
                )}
              />
            </Paper>
          </Grid>

          {/* Búsqueda de producto */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.warning.main, 0.02)
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.warning.main }} />
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Producto
                </Typography>
              </Box>
              <TextField
                value={filtros.producto}
                onChange={(e) => handleFilterChange('producto', e.target.value)}
                placeholder="Buscar producto..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />,
                }}
                fullWidth
                size="small"
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Filtros avanzados */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.secondary }}>
                🔧 Filtros Avanzados
              </Typography>
              
              <Grid container spacing={3}>
                {/* Filtros adicionales pueden ir aquí */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="ID de Venta"
                    value={filtros.venta_id || ''}
                    onChange={(e) => handleFilterChange('venta_id', e.target.value)}
                    placeholder="Buscar por ID específico"
                    fullWidth
                    size="small"
                    type="number"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Monto Mínimo"
                    value={filtros.monto_minimo || ''}
                    onChange={(e) => handleFilterChange('monto_minimo', e.target.value)}
                    placeholder="Monto mínimo de venta"
                    fullWidth
                    size="small"
                    type="number"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Monto Máximo"
                    value={filtros.monto_maximo || ''}
                    onChange={(e) => handleFilterChange('monto_maximo', e.target.value)}
                    placeholder="Monto máximo de venta"
                    fullWidth
                    size="small"
                    type="number"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                    }}
                  />
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros activos */}
        {filtrosActivos > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 3, p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Filtros Aplicados:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {filtros.fecha_inicio && (
                  <Chip
                    label={`Desde: ${filtros.fecha_inicio}`}
                    onDelete={() => handleFilterChange('fecha_inicio', '')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filtros.fecha_fin && (
                  <Chip
                    label={`Hasta: ${filtros.fecha_fin}`}
                    onDelete={() => handleFilterChange('fecha_fin', '')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filtros.cliente_id && (
                  <Chip
                    label={`Cliente: ${clientes.find(c => c.id === filtros.cliente_id)?.nombre || 'Desconocido'}`}
                    onDelete={() => handleFilterChange('cliente_id', '')}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
                {filtros.forma_pago && (
                  <Chip
                    label={`Pago: ${formasPago.find(fp => fp.value === filtros.forma_pago)?.label || filtros.forma_pago}`}
                    onDelete={() => handleFilterChange('forma_pago', '')}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {filtros.producto && (
                  <Chip
                    label={`Producto: ${filtros.producto}`}
                    onDelete={() => handleFilterChange('producto', '')}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default VentasFilters;