import React, { useState, useEffect } from 'react';
import {
  Paper,
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
  Autocomplete
} from '@mui/material';
import {
  FilterList,
  Clear,
  Search
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { clienteService } from '../../services/clienteService';
import { proveedorService } from '../../services/proveedorService';

const ReportFilterPanel = ({ onFilterChange, loading = false }) => {
  const [filtros, setFiltros] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    tipo: '',
    categoria: '',
    cliente_id: '',
    proveedor_id: ''
  });

  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState([]);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    actualizarFiltrosActivos();
  }, [filtros]);

  const cargarDatosIniciales = async () => {
    try {
      const [clientesData, proveedoresData] = await Promise.all([
        clienteService.obtenerClientes(),
        proveedorService.obtenerProveedores()
      ]);
      
      setClientes(clientesData || []);
      setProveedores(proveedoresData || []);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  const actualizarFiltrosActivos = () => {
    const activos = [];
    
    if (filtros.fecha_desde) {
      activos.push({ key: 'fecha_desde', label: `Desde: ${filtros.fecha_desde}` });
    }
    if (filtros.fecha_hasta) {
      activos.push({ key: 'fecha_hasta', label: `Hasta: ${filtros.fecha_hasta}` });
    }
    if (filtros.tipo) {
      const tipoLabel = {
        'venta': 'Ventas',
        'compra': 'Compras',
        'movimiento': 'Movimientos'
      };
      activos.push({ key: 'tipo', label: `Tipo: ${tipoLabel[filtros.tipo]}` });
    }
    if (filtros.categoria) {
      activos.push({ key: 'categoria', label: `Categoría: ${filtros.categoria}` });
    }
    if (filtros.cliente_id) {
      const cliente = clientes.find(c => c.id === parseInt(filtros.cliente_id));
      if (cliente) {
        activos.push({ key: 'cliente_id', label: `Cliente: ${cliente.nombre}` });
      }
    }
    if (filtros.proveedor_id) {
      const proveedor = proveedores.find(p => p.id === parseInt(filtros.proveedor_id));
      if (proveedor) {
        activos.push({ key: 'proveedor_id', label: `Proveedor: ${proveedor.nombre}` });
      }
    }
    
    setFiltrosActivos(activos);
  };

  const handleInputChange = (field, value) => {
    const nuevosFiltros = { ...filtros, [field]: value };
    setFiltros(nuevosFiltros);
  };

  const aplicarFiltros = () => {
    onFilterChange(filtros);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      fecha_desde: '',
      fecha_hasta: '',
      tipo: '',
      categoria: '',
      cliente_id: '',
      proveedor_id: ''
    };
    setFiltros(filtrosVacios);
    onFilterChange(filtrosVacios);
  };

  const eliminarFiltro = (key) => {
    const nuevosFiltros = { ...filtros, [key]: '' };
    setFiltros(nuevosFiltros);
    onFilterChange(nuevosFiltros);
  };

  // Obtener fecha de hace 30 días para valor por defecto
  const fechaHace30Dias = new Date();
  fechaHace30Dias.setDate(fechaHace30Dias.getDate() - 30);
  const fechaHoy = new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros de Reporte
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Filtros de fecha */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Fecha Desde"
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => handleInputChange('fecha_desde', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Fecha Hasta"
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) => handleInputChange('fecha_hasta', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          {/* Tipo de movimiento */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select
                value={filtros.tipo}
                label="Tipo de Movimiento"
                onChange={(e) => handleInputChange('tipo', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="venta">Ventas</MenuItem>
                <MenuItem value="compra">Compras</MenuItem>
                <MenuItem value="movimiento">Movimientos de Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Categoría */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filtros.categoria}
                label="Categoría"
                onChange={(e) => handleInputChange('categoria', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="frutas">Frutas</MenuItem>
                <MenuItem value="verduras">Verduras</MenuItem>
                <MenuItem value="otros">Otros</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Cliente */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              size="small"
              options={clientes}
              getOptionLabel={(option) => option.nombre || ''}
              value={clientes.find(c => c.id === parseInt(filtros.cliente_id)) || null}
              onChange={(event, newValue) => {
                handleInputChange('cliente_id', newValue ? newValue.id : '');
              }}
              renderInput={(params) => (
                <TextField {...params} label="Cliente" />
              )}
              noOptionsText="No hay clientes"
            />
          </Grid>

          {/* Proveedor */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              size="small"
              options={proveedores}
              getOptionLabel={(option) => option.nombre || ''}
              value={proveedores.find(p => p.id === parseInt(filtros.proveedor_id)) || null}
              onChange={(event, newValue) => {
                handleInputChange('proveedor_id', newValue ? newValue.id : '');
              }}
              renderInput={(params) => (
                <TextField {...params} label="Proveedor" />
              )}
              noOptionsText="No hay proveedores"
            />
          </Grid>

          {/* Botones de acción */}
          <Grid item xs={12} sm={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={aplicarFiltros}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                Aplicar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={limpiarFiltros}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                Limpiar
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filtros activos */}
        {filtrosActivos.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filtros activos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filtrosActivos.map((filtro) => (
                <Chip
                  key={filtro.key}
                  label={filtro.label}
                  onDelete={() => eliminarFiltro(filtro.key)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default ReportFilterPanel;