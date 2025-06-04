import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

// Importar servicios
import { facturacionService } from '../../../services/facturacionService';
import { obtenerProductos } from '../../../services/inventoryService';
import { obtenerClientes } from '../../../services/clienteService';

const FacturaForm = ({ onFacturaCreada, onMostrarVistaPrevia, loading }) => {
  // Estados del formulario
  const [numeroFactura, setNumeroFactura] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteManual, setClienteManual] = useState({
    nombre: '',
    documento: '',
    direccion: '',
    telefono: ''
  });
  const [productos, setProductos] = useState([]);
  const [productosFactura, setProductosFactura] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  
  // Estados de datos
  const [clientes, setClientes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errores, setErrores] = useState({});

  // Estados calculados
  const [totales, setTotales] = useState({
    subtotal: 0,
    iva: 0,
    total: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Recalcular totales cuando cambien los productos
  useEffect(() => {
    const nuevosTotal = facturacionService.calcularTotales(productosFactura);
    setTotales(nuevosTotal);
  }, [productosFactura]);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      
      // Cargar número de factura
      const numeroData = await facturacionService.obtenerUltimoNumero();
      setNumeroFactura(numeroData.siguiente_numero);
      
      // Cargar productos y clientes en paralelo
      const [productosData, clientesData] = await Promise.all([
        obtenerProductos({ activo: true }),
        obtenerClientes({ activo: true })
      ]);
      
      setProductos(productosData);
      setClientes(clientesData);
      
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setErrores({ general: 'Error cargando datos del formulario' });
    } finally {
      setLoadingData(false);
    }
  };

  const handleClienteManualChange = (field, value) => {
    setClienteManual(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar cliente seleccionado si se está escribiendo manualmente
    if (clienteSeleccionado) {
      setClienteSeleccionado(null);
    }
  };

  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    if (cliente) {
      setClienteManual({
        nombre: cliente.nombre || '',
        documento: cliente.documento || '',
        direccion: cliente.direccion || '',
        telefono: cliente.telefono || ''
      });
    }
  };

  const agregarProducto = () => {
    const nuevoProducto = {
      id: Date.now(),
      nombre: '',
      cantidad: 1,
      precio_unitario: 0,
      total: 0
    };
    setProductosFactura([...productosFactura, nuevoProducto]);
  };

  const eliminarProducto = (id) => {
    setProductosFactura(productosFactura.filter(p => p.id !== id));
  };

  const actualizarProducto = (id, field, value) => {
    setProductosFactura(productosFactura.map(producto => {
      if (producto.id === id) {
        const productoActualizado = { ...producto, [field]: value };
        
        // Recalcular total del producto
        if (field === 'cantidad' || field === 'precio_unitario') {
          const cantidad = parseFloat(productoActualizado.cantidad) || 0;
          const precio = parseFloat(productoActualizado.precio_unitario) || 0;
          productoActualizado.total = cantidad * precio;
        }
        
        return productoActualizado;
      }
      return producto;
    }));
  };

  const seleccionarProductoInventario = (id, producto) => {
    if (producto) {
      actualizarProducto(id, 'nombre', producto.nombre);
      actualizarProducto(id, 'precio_unitario', producto.precio_unitario);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Validar cliente
    if (!clienteManual.nombre.trim()) {
      nuevosErrores.cliente = 'El nombre del cliente es requerido';
    }
    
    // Validar productos
    if (productosFactura.length === 0) {
      nuevosErrores.productos = 'Debe agregar al menos un producto';
    } else {
      const productosInvalidos = productosFactura.some(p => 
        !p.nombre.trim() || 
        !p.cantidad || 
        parseFloat(p.cantidad) <= 0 || 
        !p.precio_unitario || 
        parseFloat(p.precio_unitario) <= 0
      );
      
      if (productosInvalidos) {
        nuevosErrores.productos = 'Todos los productos deben tener nombre, cantidad y precio válidos';
      }
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleVistaPrevia = () => {
    if (!validarFormulario()) {
      return;
    }
    
    const datosFactura = {
      cliente_nombre: clienteManual.nombre,
      cliente_documento: clienteManual.documento,
      cliente_direccion: clienteManual.direccion,
      cliente_telefono: clienteManual.telefono,
      productos: productosFactura.map(p => ({
        nombre: p.nombre,
        cantidad: parseFloat(p.cantidad),
        precio_unitario: parseFloat(p.precio_unitario),
        total: parseFloat(p.total)
      })),
      subtotal: totales.subtotal,
      iva: totales.iva,
      total: totales.total,
      observaciones: observaciones.trim()
    };
    
    onMostrarVistaPrevia(datosFactura);
  };

  const limpiarFormulario = () => {
    setClienteSeleccionado(null);
    setClienteManual({
      nombre: '',
      documento: '',
      direccion: '',
      telefono: ''
    });
    setProductosFactura([]);
    setObservaciones('');
    setErrores({});
    
    // Recargar número de factura
    cargarDatosIniciales();
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Encabezado */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <ReceiptIcon color="primary" fontSize="large" />
          <Typography variant="h5" component="h2" fontWeight="bold">
            Nueva Factura
          </Typography>
          <Chip 
            label={numeroFactura} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 'auto', fontSize: '1rem', fontWeight: 'bold' }}
          />
        </Box>
        
        {errores.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errores.general}
          </Alert>
        )}
      </Paper>

      {/* Datos del Cliente */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" />
          Datos del Cliente
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              options={clientes}
              getOptionLabel={(option) => option.nombre || ''}
              value={clienteSeleccionado}
              onChange={(event, newValue) => handleClienteSeleccionado(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar Cliente Existente"
                  placeholder="Escriba para buscar..."
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">{option.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.documento && `Doc: ${option.documento}`}
                      {option.telefono && ` • Tel: ${option.telefono}`}
                    </Typography>
                  </Box>
                </Box>
              )}
              loading={loadingData}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del Cliente *"
              value={clienteManual.nombre}
              onChange={(e) => handleClienteManualChange('nombre', e.target.value)}
              error={!!errores.cliente}
              helperText={errores.cliente}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Documento"
              value={clienteManual.documento}
              onChange={(e) => handleClienteManualChange('documento', e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Dirección"
              value={clienteManual.direccion}
              onChange={(e) => handleClienteManualChange('direccion', e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={clienteManual.telefono}
              onChange={(e) => handleClienteManualChange('telefono', e.target.value)}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Productos */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateIcon color="primary" />
            Productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={agregarProducto}
            disabled={loading}
          >
            Agregar Producto
          </Button>
        </Box>
        
        {errores.productos && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errores.productos}
          </Alert>
        )}
        
        {productosFactura.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Precio Unit.</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosFactura.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <Autocomplete
                        options={productos}
                        getOptionLabel={(option) => option.nombre || ''}
                        value={productos.find(p => p.nombre === producto.nombre) || null}
                        onChange={(event, newValue) => seleccionarProductoInventario(producto.id, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder="Buscar producto..."
                            value={producto.nombre}
                            onChange={(e) => actualizarProducto(producto.id, 'nombre', e.target.value)}
                          />
                        )}
                        freeSolo
                        disabled={loading}
                        sx={{ minWidth: 200 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={producto.cantidad}
                        onChange={(e) => actualizarProducto(producto.id, 'cantidad', e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                        disabled={loading}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={producto.precio_unitario}
                        onChange={(e) => actualizarProducto(producto.id, 'precio_unitario', e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                        disabled={loading}
                        sx={{ width: 120 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        ${producto.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => eliminarProducto(producto.id)}
                        disabled={loading}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
          </Alert>
        )}
      </Paper>

      {/* Totales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de Totales
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones adicionales para la factura..."
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography fontWeight="bold">${totales.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>IVA (22%):</Typography>
                  <Typography fontWeight="bold">${totales.iva.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">Total:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${totales.total.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Acciones */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={limpiarFormulario}
            disabled={loading}
          >
            Limpiar
          </Button>
          
          <Button
            variant="contained"
            startIcon={<PreviewIcon />}
            onClick={handleVistaPrevia}
            disabled={loading || productosFactura.length === 0}
            size="large"
          >
            Vista Previa
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FacturaForm;