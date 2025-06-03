import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Collapse,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ModernInventoryFilters = ({
  filtros,
  proveedores = [],
  onFiltrosChange,
  totalProductos = 0,
  sx = {},
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(filtros.busqueda || '');

  // Categorías que coinciden con el backend
  const categorias = [
    { value: 'frutas', label: 'Frutas' },
    { value: 'verduras', label: 'Verduras' },
    { value: 'otros', label: 'Otros' }
  ];

  const ordenOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio_unitario', label: 'Precio' },
    { value: 'stock_actual', label: 'Stock' },
    { value: 'creado', label: 'Fecha' },
  ];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltrosChange({ busqueda: value });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (field, value) => {
    onFiltrosChange({ [field]: value });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFiltrosChange({
      categoria: 'todos',
      busqueda: '',
      proveedor_id: null,
      stockBajo: false,
      sinStock: false,
      orden: 'nombre',
      direccion: 'asc',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filtros.busqueda) count++;
    if (filtros.categoria !== 'todos') count++;
    if (filtros.proveedor_id) count++;
    if (filtros.stockBajo) count++;
    if (filtros.sinStock) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Barra principal de filtros */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Búsqueda */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchValue('');
                        onFiltrosChange({ busqueda: '' });
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: theme.palette.background.paper,
                  },
                  '&.Mui-focused': {
                    bgcolor: theme.palette.background.paper,
                  },
                },
              }}
            />
          </Grid>

          {/* Categoría */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filtros.categoria || 'todos'}
                label="Categoría"
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <MenuItem value="todos">Todas</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Ordenar por */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={filtros.orden || 'nombre'}
                label="Ordenar por"
                onChange={(e) => handleFilterChange('orden', e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                {ordenOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Controles */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setExpanded(!expanded)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
                endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                Filtros Avanzados
                {activeFiltersCount > 0 && (
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    color="primary"
                    sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.04),
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  Limpiar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Información de resultados */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {totalProductos} producto{totalProductos !== 1 ? 's' : ''} encontrado{totalProductos !== 1 ? 's' : ''}
          </Typography>
          
          {/* Chips de filtros activos */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filtros.busqueda && (
              <Chip
                label={`Búsqueda: "${filtros.busqueda}"`}
                size="small"
                onDelete={() => {
                  setSearchValue('');
                  handleFilterChange('busqueda', '');
                }}
                sx={{ borderRadius: 2 }}
              />
            )}
            
            {filtros.categoria !== 'todos' && (
              <Chip
                label={`Categoría: ${categorias.find(c => c.value === filtros.categoria)?.label || filtros.categoria}`}
                size="small"
                onDelete={() => handleFilterChange('categoria', 'todos')}
                sx={{ borderRadius: 2 }}
              />
            )}
            
            {filtros.proveedor_id && (
              <Chip
                label={`Proveedor: ${proveedores.find(p => p.id === filtros.proveedor_id)?.nombre || 'Desconocido'}`}
                size="small"
                onDelete={() => handleFilterChange('proveedor_id', null)}
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Filtros avanzados */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Divider />
            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.3) }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Filtros Avanzados
              </Typography>
              
              <Grid container spacing={3}>
                {/* Proveedor */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Proveedor</InputLabel>
                    <Select
                      value={filtros.proveedor_id || ''}
                      label="Proveedor"
                      onChange={(e) => handleFilterChange('proveedor_id', e.target.value || null)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {proveedores.map((proveedor) => (
                        <MenuItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Dirección de orden */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Dirección</InputLabel>
                    <Select
                      value={filtros.direccion || 'asc'}
                      label="Dirección"
                      onChange={(e) => handleFilterChange('direccion', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="asc">Ascendente</MenuItem>
                      <MenuItem value="desc">Descendente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Switches para filtros especiales */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filtros.stockBajo || false}
                          onChange={(e) => handleFilterChange('stockBajo', e.target.checked)}
                          color="warning"
                        />
                      }
                      label="Solo productos con stock bajo"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filtros.sinStock || false}
                          onChange={(e) => handleFilterChange('sinStock', e.target.checked)}
                          color="error"
                        />
                      }
                      label="Solo productos sin stock"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

export default ModernInventoryFilters;