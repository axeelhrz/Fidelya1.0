import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Chip,
  Typography,
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  DateRange as DateIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { proveedorService } from '../../../services/proveedorService';

const ComprasFilters = ({ filtros, onFiltrosChange }) => {
  const [proveedores, setProveedores] = useState([]);
  const [localFiltros, setLocalFiltros] = useState(filtros);

  useEffect(() => {
    cargarProveedores();
  }, []);

  useEffect(() => {
    setLocalFiltros(filtros);
  }, [filtros]);

  const cargarProveedores = async () => {
    try {
      const data = await proveedorService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = {
      ...localFiltros,
      [campo]: valor
    };
    setLocalFiltros(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      proveedor_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      producto: ''
    };
    setLocalFiltros(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  const hayFiltrosActivos = Object.values(localFiltros).some(valor => valor !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filtros de Búsqueda
        </Typography>
          {hayFiltrosActivos && (
          <Chip
            label="Filtros activos"
              size="small"
              color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

        <Grid container spacing={2} alignItems="center">
          {/* Filtro por Proveedor */}
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
              value={proveedores.find(p => p.id === localFiltros.proveedor_id) || null}
              onChange={(event, newValue) => {
                handleFiltroChange('proveedor_id', newValue?.id || '');
            }}
              options={proveedores}
              getOptionLabel={(option) => option.nombre || ''}
              renderInput={(params) => (
          <TextField
                  {...params}
                  label="Proveedor"
            variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
          />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
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
              noOptionsText="No se encontraron proveedores"
              sx={{ width: '100%' }}
            />
          </Grid>

          {/* Filtro por Fecha Inicio */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Fecha Inicio"
              type="date"
              value={localFiltros.fecha_inicio}
              onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Filtro por Fecha Fin */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Fecha Fin"
              type="date"
              value={localFiltros.fecha_fin}
              onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Filtro por Producto */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Buscar Producto"
              value={localFiltros.producto}
              onChange={(e) => handleFiltroChange('producto', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Nombre del producto..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Botón Limpiar Filtros */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              onClick={limpiarFiltros}
              disabled={!hayFiltrosActivos}
              startIcon={<ClearIcon />}
              fullWidth
              sx={{
                height: 40,
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                },
              }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>

        {/* Chips de filtros activos */}
        {hayFiltrosActivos && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {localFiltros.proveedor_id && (
              <Chip
                label={`Proveedor: ${proveedores.find(p => p.id === localFiltros.proveedor_id)?.nombre || 'Desconocido'}`}
                onDelete={() => handleFiltroChange('proveedor_id', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {localFiltros.fecha_inicio && (
              <Chip
                label={`Desde: ${localFiltros.fecha_inicio}`}
                onDelete={() => handleFiltroChange('fecha_inicio', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {localFiltros.fecha_fin && (
              <Chip
                label={`Hasta: ${localFiltros.fecha_fin}`}
                onDelete={() => handleFiltroChange('fecha_fin', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {localFiltros.producto && (
              <Chip
                label={`Producto: ${localFiltros.producto}`}
                onDelete={() => handleFiltroChange('producto', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default ComprasFilters;