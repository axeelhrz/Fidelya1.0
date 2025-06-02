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
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { clienteService } from '../../../services/clienteService';

const VentasFilters = ({ filtros, onFiltrosChange }) => {
  const theme = useTheme();
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

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
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'mixto', label: 'Mixto' }
  ];

  const filtrosActivos = Object.values(filtros).filter(valor => valor !== '').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Filtros de Búsqueda
        </Typography>
        {filtrosActivos > 0 && (
          <Chip
            label={`${filtrosActivos} filtro${filtrosActivos > 1 ? 's' : ''} activo${filtrosActivos > 1 ? 's' : ''}`}
            color="primary"
            size="small"
            sx={{ mr: 2 }}
          />
        )}
        <Button
          variant="outlined"
          size="small"
          onClick={limpiarFiltros}
          startIcon={<ClearIcon />}
          disabled={filtrosActivos === 0}
        >
          Limpiar
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => handleFilterChange('fecha_inicio', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Fecha Fin"
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => handleFilterChange('fecha_fin', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                label="Cliente"
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
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                label="Forma de Pago"
                placeholder="Seleccionar forma de pago"
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Buscar Producto"
            value={filtros.producto}
            onChange={(e) => handleFilterChange('producto', e.target.value)}
            placeholder="Nombre del producto vendido"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VentasFilters;