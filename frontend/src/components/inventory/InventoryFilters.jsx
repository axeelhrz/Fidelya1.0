import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  Chip,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Warning as WarningIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InventoryFilters = ({ filtros, onFiltrosChange, totalProductos }) => {
  const handleBusquedaChange = (event) => {
    onFiltrosChange({ busqueda: event.target.value });
  };

  const handleCategoriaChange = (event) => {
    onFiltrosChange({ categoria: event.target.value });
  };

  const handleStockBajoToggle = () => {
    onFiltrosChange({ stockBajo: !filtros.stockBajo });
  };

  const handleOrdenChange = (event) => {
    onFiltrosChange({ orden: event.target.value });
  };

  const handleDireccionChange = (event, newDirection) => {
    if (newDirection !== null) {
      onFiltrosChange({ direccion: newDirection });
    }
  };

  const handleLimpiarFiltros = () => {
    onFiltrosChange({
      categoria: 'todos',
      busqueda: '',
      stockBajo: false,
      orden: 'nombre',
      direccion: 'asc'
    });
  };

  const tienesFiltrosActivos = () => {
    return (
      filtros.categoria !== 'todos' ||
      filtros.busqueda !== '' ||
      filtros.stockBajo ||
      filtros.orden !== 'nombre' ||
      filtros.direccion !== 'asc'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <FilterIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Filtros y Búsqueda
            </Typography>
            <Chip
              label={`${totalProductos} producto${totalProductos !== 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            {tienesFiltrosActivos() && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleLimpiarFiltros}
                sx={{ ml: 'auto' }}
              >
                Limpiar Filtros
              </Button>
            )}
          </Box>

          <Stack spacing={3}>
            {/* Primera fila: Búsqueda y Categoría */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Buscar productos"
                placeholder="Buscar por nombre o proveedor..."
                value={filtros.busqueda}
                onChange={handleBusquedaChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 2 }}
              />

              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filtros.categoria}
                  label="Categoría"
                  onChange={handleCategoriaChange}
                >
                  <MenuItem value="todos">Todas las categorías</MenuItem>
                  <MenuItem value="fruta">Frutas</MenuItem>
                  <MenuItem value="verdura">Verduras</MenuItem>
                  <MenuItem value="otro">Otros</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Segunda fila: Filtros especiales y ordenamiento */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              {/* Filtro de stock bajo */}
              <Button
                variant={filtros.stockBajo ? "contained" : "outlined"}
                startIcon={<WarningIcon />}
                onClick={handleStockBajoToggle}
                color={filtros.stockBajo ? "warning" : "inherit"}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  minWidth: 180,
                }}
              >
                Solo Stock Bajo
              </Button>

              {/* Ordenamiento */}
              <Box display="flex" alignItems="center" gap={2} flex={1}>
                <SortIcon color="action" />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={filtros.orden}
                    label="Ordenar por"
                    onChange={handleOrdenChange}
                  >
                    <MenuItem value="nombre">Nombre</MenuItem>
                    <MenuItem value="categoria">Categoría</MenuItem>
                    <MenuItem value="stock">Stock</MenuItem>
                    <MenuItem value="precio_venta">Precio</MenuItem>
                    <MenuItem value="actualizado">Última actualización</MenuItem>
                  </Select>
                </FormControl>

                <ToggleButtonGroup
                  value={filtros.direccion}
                  exclusive
                  onChange={handleDireccionChange}
                  size="small"
                >
                  <ToggleButton value="asc" aria-label="ascendente">
                    A-Z
                  </ToggleButton>
                  <ToggleButton value="desc" aria-label="descendente">
                    Z-A
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Stack>

            {/* Indicadores de filtros activos */}
            {tienesFiltrosActivos() && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" mb={1} display="block">
                    Filtros activos:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {filtros.categoria !== 'todos' && (
                      <Chip
                        label={`Categoría: ${filtros.categoria}`}
                        size="small"
                        onDelete={() => onFiltrosChange({ categoria: 'todos' })}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filtros.busqueda && (
                      <Chip
                        label={`Búsqueda: "${filtros.busqueda}"`}
                        size="small"
                        onDelete={() => onFiltrosChange({ busqueda: '' })}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filtros.stockBajo && (
                      <Chip
                        label="Solo stock bajo"
                        size="small"
                        onDelete={() => onFiltrosChange({ stockBajo: false })}
                        color="warning"
                        variant="outlined"
                      />
                    )}
                    {(filtros.orden !== 'nombre' || filtros.direccion !== 'asc') && (
                      <Chip
                        label={`Orden: ${filtros.orden} (${filtros.direccion === 'asc' ? 'A-Z' : 'Z-A'})`}
                        size="small"
                        onDelete={() => onFiltrosChange({ orden: 'nombre', direccion: 'asc' })}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
              </motion.div>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InventoryFilters;