import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { purchaseService } from '../../../services/purchaseService';

const ComprasFilters = ({ filtros, onFiltrosChange }) => {
  const theme = useTheme();
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
      const proveedoresData = await purchaseService.obtenerProveedores();
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setLocalFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onFiltrosChange(localFiltros);
  };

  const handleClearFilters = () => {
    const filtrosVacios = {
      proveedor: '',
      fecha_inicio: '',
      fecha_fin: '',
      producto: ''
    };
    setLocalFiltros(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  const hasActiveFilters = Object.values(localFiltros).some(value => value !== '');

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filtros de Búsqueda
        </Typography>
        {hasActiveFilters && (
          <Chip
            label="Filtros activos"
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={proveedores}
            value={localFiltros.proveedor}
            onChange={(event, newValue) => handleInputChange('proveedor', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proveedor"
                placeholder="Seleccionar proveedor"
                variant="outlined"
                fullWidth
              />
            )}
            freeSolo
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={localFiltros.fecha_inicio}
            onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Fecha Fin"
            type="date"
            value={localFiltros.fecha_fin}
            onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Producto"
            value={localFiltros.producto}
            onChange={(e) => handleInputChange('producto', e.target.value)}
            placeholder="Buscar por producto"
            fullWidth
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleApplyFilters}
        >
          Aplicar Filtros
        </Button>
      </Box>
    </Box>
  );
};

export default ComprasFilters;