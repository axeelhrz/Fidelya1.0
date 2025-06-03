import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { proveedorService } from '../../../services/proveedorService';

const ComprasFilters = ({ filtros, onFiltrosChange }) => {
  const theme = useTheme();
  const [proveedores, setProveedores] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    cargarProveedores();
  }, []);

  useEffect(() => {
    // Contar filtros activos
    const count = Object.values(filtros).filter(value => value && value.toString().trim() !== '').length;
    setActiveFilters(count);
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
      ...filtros,
      [campo]: valor
    };
    onFiltrosChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      proveedor_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      producto: ''
    };
    onFiltrosChange(filtrosVacios);
  };

  const filtrosActivos = [
    { key: 'proveedor_id', label: 'Proveedor', value: filtros.proveedor_id },
    { key: 'fecha_inicio', label: 'Desde', value: filtros.fecha_inicio },
    { key: 'fecha_fin', label: 'Hasta', value: filtros.fecha_fin },
    { key: 'producto', label: 'Producto', value: filtros.producto },
  ].filter(filtro => filtro.value && filtro.value.toString().trim() !== '');
  return (
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
              <Chip
                label={`${activeFilters} activo${activeFilters > 1 ? 's' : ''}`}
                size="small"
                color="primary"
                sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeFilters > 0 && (
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
                      label={`${filtro.label}: ${
                        filtro.key === 'proveedor_id' 
                          ? proveedores.find(p => p.id.toString() === filtro.value.toString())?.nombre || filtro.value
                          : filtro.value
                      }`}
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
              <FormControl fullWidth>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={filtros.proveedor_id}
                  onChange={(e) => handleFiltroChange('proveedor_id', e.target.value)}
                  label="Proveedor"
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon color="action" sx={{ ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 3,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Todos los proveedores</em>
                  </MenuItem>
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        {proveedor.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fecha inicio */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha desde"
                value={filtros.fecha_inicio}
                onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
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

            {/* Fecha fin */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha hasta"
                value={filtros.fecha_fin}
                onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
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
          </Grid>

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
    </Box>
  );
};

export default ComprasFilters;