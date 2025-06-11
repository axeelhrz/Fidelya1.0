import React, { useState, useEffect } from 'react';
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
  Button,
  Autocomplete,
  DatePicker,
  useTheme,
  alpha,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Save as SaveIcon,
  Bookmark as BookmarkIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdvancedInventoryFilters = ({ 
  filtros, 
  onFiltrosChange, 
  totalProductos = 0,
  proveedores = [],
  onExport,
  onSaveFilter,
  savedFilters = [],
  loading = false
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [precioRange, setPrecioRange] = useState([0, 100]);
  const [stockRange, setStockRange] = useState([0, 1000]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleFiltroChange = (campo, valor) => {
    onFiltrosChange({ [campo]: valor });
  };

  const handlePrecioChange = (event, newValue) => {
    setPrecioRange(newValue);
  };

  const handlePrecioCommitted = (event, newValue) => {
    onFiltrosChange({
      precioMin: newValue[0],
      precioMax: newValue[1] === 100 ? null : newValue[1],
    });
  };

  const handleStockChange = (event, newValue) => {
    setStockRange(newValue);
  };

  const handleStockCommitted = (event, newValue) => {
    onFiltrosChange({
      stockMin: newValue[0],
      stockMax: newValue[1] === 1000 ? null : newValue[1],
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      categoria: 'todos',
      busqueda: '',
      proveedor_id: null,
      stockBajo: false,
      sinStock: false,
      precioMin: null,
      precioMax: null,
      stockMin: null,
      stockMax: null,
      fechaCreacionDesde: null,
      fechaCreacionHasta: null,
      orden: 'nombre',
      direccion: 'asc',
    });
    setPrecioRange([0, 100]);
    setStockRange([0, 1000]);
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.categoria && filtros.categoria !== 'todos') count++;
    if (filtros.busqueda) count++;
    if (filtros.proveedor_id) count++;
    if (filtros.stockBajo) count++;
    if (filtros.sinStock) count++;
    if (filtros.precioMin || filtros.precioMax) count++;
    if (filtros.stockMin || filtros.stockMax) count++;
    if (filtros.fechaCreacionDesde || filtros.fechaCreacionHasta) count++;
    return count;
  };

  const aplicarFiltroGuardado = (filtroGuardado) => {
    onFiltrosChange(filtroGuardado.filtros);
    // Actualizar rangos locales
    if (filtroGuardado.filtros.precioMin || filtroGuardado.filtros.precioMax) {
      setPrecioRange([
        filtroGuardado.filtros.precioMin || 0,
        filtroGuardado.filtros.precioMax || 100
      ]);
    }
    if (filtroGuardado.filtros.stockMin || filtroGuardado.filtros.stockMax) {
      setStockRange([
        filtroGuardado.filtros.stockMin || 0,
        filtroGuardado.filtros.stockMax || 1000
      ]);
    }
  };

  const guardarFiltroActual = () => {
    if (filterName.trim() && onSaveFilter) {
      onSaveFilter({
        nombre: filterName.trim(),
        filtros: filtros,
        fecha_creacion: new Date().toISOString()
      });
      setFilterName('');
      setShowSaveDialog(false);
    }
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
          {/* Header principal con búsqueda */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar productos, proveedores..."
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
              <Autocomplete
                options={proveedores}
                getOptionLabel={(option) => option.nombre || ''}
                value={proveedores.find(p => p.id === filtros.proveedor_id) || null}
                onChange={(event, newValue) => {
                  handleFiltroChange('proveedor_id', newValue?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Proveedor"
                    placeholder="Seleccionar proveedor"
                  />
                )}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Badge badgeContent={filtrosActivos} color="primary">
                    <IconButton
                      onClick={() => setExpanded(!expanded)}
                      sx={{
                        bgcolor: filtrosActivos > 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        color: filtrosActivos > 0 ? theme.palette.primary.main : 'text.secondary',
                      }}
                    >
                      <FilterIcon />
                    </IconButton>
                  </Badge>
                  
                  <Tooltip title="Actualizar">
                    <IconButton onClick={() => window.location.reload()} disabled={loading}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {filtrosActivos > 0 && (
                  <Tooltip title="Limpiar filtros">
                    <IconButton onClick={limpiarFiltros} size="small">
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Filtros rápidos */}
          <Box display="flex" gap={1} mt={2} flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={filtros.stockBajo || false}
                  onChange={(e) => handleFiltroChange('stockBajo', e.target.checked)}
                  color="warning"
                  size="small"
                />
              }
              label="Solo stock bajo"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filtros.sinStock || false}
                  onChange={(e) => handleFiltroChange('sinStock', e.target.checked)}
                  color="error"
                  size="small"
                />
              }
              label="Sin stock"
            />
          </Box>

          {/* Filtros avanzados colapsables */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={3}>
              {/* Filtros guardados */}
              {savedFilters.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Filtros Guardados
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {savedFilters.map((filtro, index) => (
                      <Chip
                        key={index}
                        label={filtro.nombre}
                        variant="outlined"
                        clickable
                        onClick={() => aplicarFiltroGuardado(filtro)}
                        icon={<BookmarkIcon />}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Rango de precios */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  Rango de precio: ${precioRange[0]} - ${precioRange[1] === 100 ? '100+' : precioRange[1]}
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
                  sx={{ color: theme.palette.primary.main }}
                />
              </Grid>

              {/* Rango de stock */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  Rango de stock: {stockRange[0]} - {stockRange[1] === 1000 ? '1000+' : stockRange[1]} unidades
                </Typography>
                <Slider
                  value={stockRange}
                  onChange={handleStockChange}
                  onChangeCommitted={handleStockCommitted}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 250, label: '250' },
                    { value: 500, label: '500' },
                    { value: 750, label: '750' },
                    { value: 1000, label: '1000+' },
                  ]}
                  sx={{ color: theme.palette.secondary.main }}
                />
              </Grid>

              {/* Ordenamiento */}
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
                    <MenuItem value="valor_stock">Valor en stock</MenuItem>
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
                      <ExpandLessIcon sx={{ mr: 1 }} />
                      Ascendente
                    </MenuItem>
                    <MenuItem value="desc">
                      <ExpandMoreIcon sx={{ mr: 1 }} />
                      Descendente
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Acciones avanzadas */}
              <Grid item xs={12} md={4}>
                <Box display="flex" gap={1} height="100%" alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={() => setShowSaveDialog(!showSaveDialog)}
                    size="small"
                  >
                    Guardar Filtro
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={onExport}
                    size="small"
                  >
                    Exportar
                  </Button>
                </Box>
              </Grid>

              {/* Guardar filtro */}
              <Collapse in={showSaveDialog}>
                <Grid item xs={12}>
                  <Box display="flex" gap={2} alignItems="center" p={2} bgcolor="grey.50" borderRadius={2}>
                    <TextField
                      label="Nombre del filtro"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      size="small"
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={guardarFiltroActual}
                      disabled={!filterName.trim()}
                      size="small"
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowSaveDialog(false)}
                      size="small"
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Grid>
              </Collapse>
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
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                {totalProductos} producto{totalProductos !== 1 ? 's' : ''} encontrado{totalProductos !== 1 ? 's' : ''}
              </Typography>
              
              {filtrosActivos > 0 && (
                <Chip
                  label={`${filtrosActivos} filtro${filtrosActivos > 1 ? 's' : ''} activo${filtrosActivos > 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            
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

export default AdvancedInventoryFilters;