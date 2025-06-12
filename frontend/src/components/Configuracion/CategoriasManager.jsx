import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Category as CategoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import configuracionService from '../../services/configuracionService';

const CategoriasManager = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'producto'
  });

  const tipos = ['producto', 'gasto'];
  const tipoActual = tipos[tabValue];

  const cargarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await configuracionService.obtenerCategorias();
      setCategorias(data);
    } catch (error) {
      onError('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const categoriasFiltradas = categorias.filter(cat => cat.tipo === tipoActual);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (categoria = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        tipo: categoria.tipo
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nombre: '',
        descripcion: '',
        tipo: tipoActual
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: 'producto'
    });
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombre.trim()) {
        onError('El nombre de la categoría es requerido');
        return;
      }

      setLoading(true);

      if (editingCategoria) {
        await configuracionService.actualizarCategoria(editingCategoria.id, formData);
        onSuccess('Categoría actualizada exitosamente');
      } else {
        await configuracionService.crearCategoria(formData);
        onSuccess('Categoría creada exitosamente');
      }

      await cargarCategorias();
      handleCloseDialog();
    } catch (error) {
      onError(error.message || 'Error guardando categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        setLoading(true);
        await configuracionService.eliminarCategoria(categoria.id);
        onSuccess('Categoría eliminada exitosamente');
        await cargarCategorias();
      } catch (error) {
        onError(error.message || 'Error eliminando categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight="bold">
            Gestión de Categorías
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Categoría
        </Button>
      </Box>

      {/* Tabs para tipos de categorías */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Categorías de Productos" />
          <Tab label="Categorías de Gastos" />
        </Tabs>
      </Paper>

      {/* Tabla de categorías */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay categorías de {tipoActual} registradas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categoriasFiltradas.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {categoria.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {categoria.descripcion || 'Sin descripción'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={categoria.tipo} 
                      color={categoria.tipo === 'producto' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={categoria.activo ? 'Activa' : 'Inactiva'} 
                      color={categoria.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(categoria)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEliminar(categoria)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Información adicional */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Categorías de Productos:</strong> Se usan para clasificar frutas, verduras y otros productos en el inventario.<br/>
          <strong>Categorías de Gastos:</strong> Se usan para clasificar egresos como sueldos, alquiler, servicios, etc.
        </Typography>
      </Alert>

      {/* Dialog para crear/editar categoría */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la Categoría"
                value={formData.nombre}
                onChange={handleFormChange('nombre')}
                fullWidth
                required
                placeholder="Ej: Frutas Tropicales"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                value={formData.descripcion}
                onChange={handleFormChange('descripcion')}
                fullWidth
                multiline
                rows={2}
                placeholder="Descripción opcional de la categoría"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Categoría</InputLabel>
                <Select
                  value={formData.tipo}
                  onChange={handleFormChange('tipo')}
                  label="Tipo de Categoría"
                >
                  <MenuItem value="producto">Producto</MenuItem>
                  <MenuItem value="gasto">Gasto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button 
            onClick={handleGuardar} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriasManager;