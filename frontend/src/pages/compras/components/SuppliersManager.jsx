import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  InputAdornment,
  Tooltip,
  Fab,
  Collapse,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { proveedorService } from '../../../services/proveedorService';
const SuppliersManager = ({ open, onClose }) => {
  const theme = useTheme();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    email: '',
    direccion: '',
    contacto: ''
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (open) {
      cargarProveedores();
    }
  }, [open]);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const data = await proveedorService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      if (editingProveedor) {
        await proveedorService.actualizarProveedor(editingProveedor.id, formData);
      } else {
        await proveedorService.crearProveedor(formData);
      }
    await cargarProveedores();
      handleCancelForm();
    } catch (error) {
      console.error('Error guardando proveedor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre || '',
      rut: proveedor.rut || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
      contacto: proveedor.contacto || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      setLoading(true);
      try {
        await proveedorService.eliminarProveedor(id);
        await cargarProveedores();
      } catch (error) {
        console.error('Error eliminando proveedor:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProveedor(null);
    setFormData({
      nombre: '',
      rut: '',
      telefono: '',
      email: '',
      direccion: '',
      contacto: ''
    });
    setErrors({});
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.rut?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProveedorColor = (index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    return colors[index % colors.length];
};

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            component: motion.div,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            sx: {
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.15)}`,
              maxHeight: '90vh',
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: alpha(theme.palette.common.black, 0.7),
              backdropFilter: 'blur(8px)',
            }
          }}
        >
          {/* Header del diálogo */}
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: 'white',
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    width: 48,
                    height: 48,
                  }}
                >
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Gestión de Proveedores
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Administra la información de tus proveedores
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <Box sx={{ p: 3 }}>
              {/* Barra de búsqueda y botón agregar */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Buscar proveedores por nombre o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(!showForm)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Nuevo
                </Button>
              </Box>

              {/* Formulario para agregar/editar proveedor */}
              <Collapse in={showForm}>
                <Card 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                      </Typography>
                      <IconButton
                        onClick={handleCancelForm}
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                          }
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nombre del proveedor *"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          error={!!errors.nombre}
                          helperText={errors.nombre}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="RUT *"
                          value={formData.rut}
                          onChange={(e) => handleInputChange('rut', e.target.value)}
                          error={!!errors.rut}
                          helperText={errors.rut}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Teléfono"
                          value={formData.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Dirección"
                          value={formData.direccion}
                          onChange={(e) => handleInputChange('direccion', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Persona de contacto"
                          value={formData.contacto}
                          onChange={(e) => handleInputChange('contacto', e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                      <Button
                        onClick={handleCancelForm}
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={<SaveIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        }}
                      >
                        {loading ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Collapse>

              {/* Lista de proveedores */}
              <Card 
                sx={{ 
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              >
                {filteredProveedores.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm 
                        ? 'Intenta con otros términos de búsqueda'
                        : 'Comienza agregando tu primer proveedor'
                      }
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {filteredProveedores.map((proveedor, index) => (
                      <motion.div
                        key={proveedor.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ListItem
                          sx={{
                            py: 2,
                            px: 3,
                            borderBottom: index < filteredProveedores.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.02),
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: `linear-gradient(135deg, ${getProveedorColor(index)} 0%, ${getProveedorColor(index)}CC 100%)`,
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                boxShadow: `0 2px 8px ${alpha(getProveedorColor(index), 0.3)}`,
                              }}
                            >
                              {proveedor.nombre?.charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {proveedor.nombre}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  RUT: {proveedor.rut}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {proveedor.telefono && (
                                    <Chip
                                      icon={<PhoneIcon />}
                                      label={proveedor.telefono}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.75rem', height: 20 }}
                                    />
                                  )}
                                  {proveedor.email && (
                                    <Chip
                                      icon={<EmailIcon />}
                                      label={proveedor.email}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.75rem', height: 20 }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Editar proveedor">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(proveedor)}
                                  sx={{
                                    color: 'warning.main',
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.warning.main, 0.2),
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar proveedor">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(proveedor.id)}
                                  sx={{
                                    color: 'error.main',
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.error.main, 0.2),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                )}
              </Card>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SuppliersManager;