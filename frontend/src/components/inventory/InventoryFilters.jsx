import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InventoryFilters = ({ filtros, onFiltrosChange, totalProductos = 0 }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [precioRange, setPrecioRange] = useState([0, 100]);
  const handleFiltroChange = (campo, valor) => {
    onFiltrosChange({ [campo]: valor });
  };

  const handlePrecioChange = (event, newValue) => {
    setPrecioRange(newValue);
  };

  const handlePrecioCommitted = (event, newValue) => {
    onFiltrosChange({
      precioMin: newValue[0],
      precioMax: newValue[1],
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      categoria: 'todos',
      busqueda: '',
      stockBajo: false,
      precioMin: null,
      precioMax: null,
      orden: 'nombre',
      direccion: 'asc',
    });
    setPrecioRange([0, 100]);
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.categoria && filtros.categoria !== 'todos') count++;
    if (filtros.busqueda) count++;
    if (filtros.stockBajo) count++;
    if (filtros.precioMin || filtros.precioMax) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: theme.shadows[2],
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header con búsqueda principal */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar productos o proveedores..."
                value={filtros.busqueda || ''}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  sx: { borderRadius: 2 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filtros.categoria || 'todos'}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  label="Categoría"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="todos">Todas las categorías</MenuItem>
                  <MenuItem value="frutas">🍎 Frutas</MenuItem>
                  <MenuItem value="verduras">🥬 Verduras</MenuItem>
                  <MenuItem value="otros">📦 Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                      bgcolor: filtrosActivos > 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      color: filtrosActivos > 0 ? theme.palette.primary.main : 'text.secondary',
                    }}
                  >
                    <FilterIcon />
                  </IconButton>
                  {filtrosActivos > 0 && (
                    <Chip
                      label={`${filtrosActivos} filtro${filtrosActivos > 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {filtrosActivos > 0 && (
                  <IconButton onClick={limpiarFiltros} size="small">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Filtros avanzados colapsables */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filtros.stockBajo || false}
                      onChange={(e) => handleFiltroChange('stockBajo', e.target.checked)}
                      color="warning"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Solo stock bajo
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Productos que requieren reposición
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={filtros.orden || 'nombre'}
                    onChange={(e) => handleFiltroChange('orden', e.target.value)}
                    label="Ordenar por"
                  >
                    <MenuItem value="nombre">Nombre</MenuItem>
                    <MenuItem value="categoria">Categoría</MenuItem>
                    <MenuItem value="stock_actual">Stock</MenuItem>
                    <MenuItem value="precio_unitario">Precio</MenuItem>
                    <MenuItem value="creado">Fecha creación</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Dirección</InputLabel>
                  <Select
                    value={filtros.direccion || 'asc'}
                    onChange={(e) => handleFiltroChange('direccion', e.target.value)}
                    label="Dirección"
                  >
                    <MenuItem value="asc">
                      {expanded ? <ExpandLessIcon sx={{ mr: 1 }} /> : null}
                      Ascendente
                    </MenuItem>
                    <MenuItem value="desc">
                      {expanded ? <ExpandMoreIcon sx={{ mr: 1 }} /> : null}
                      Descendente
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ px: 2 }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Rango de precio: ${precioRange[0]} - ${precioRange[1]}
                  </Typography>
                  <Slider
                    value={precioRange}
                    onChange={handlePrecioChange}
                    onChangeCommitted={handlePrecioCommitted}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={5}
                    marks={[
                      { value: 0, label: '$0' },
                      { value: 25, label: '$25' },
                      { value: 50, label: '$50' },
                      { value: 75, label: '$75' },
                      { value: 100, label: '$100+' },
                    ]}
                    sx={{
                      color: theme.palette.primary.main,
                      '& .MuiSlider-thumb': {
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Collapse>

          {/* Resumen de resultados */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            pt={2}
            borderTop={`1px solid ${theme.palette.divider}`}
          >
            <Typography variant="body2" color="text.secondary">
              {totalProductos} producto{totalProductos !== 1 ? 's' : ''} encontrado{totalProductos !== 1 ? 's' : ''}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                Filtros avanzados
              </Typography>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InventoryFilters;