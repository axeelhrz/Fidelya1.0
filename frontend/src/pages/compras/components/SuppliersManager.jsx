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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Tooltip,
  Alert,
  Snackbar,
  Avatar,
  TablePagination,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { proveedorService } from '../../../services/proveedorService';
import ProveedorDialog from './ProveedorDialog';
import DeleteProveedorDialog from './DeleteProveedorDialog';

const SuppliersManager = ({ open, onClose }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para diálogos
  const [openProveedorDialog, setOpenProveedorDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');

  useEffect(() => {
    if (open) {
      cargarProveedores();
    }
  }, [open]);

  const cargarProveedores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await proveedorService.obtenerProveedores({ q: searchTerm });
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      setError('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (proveedor.rut && proveedor.rut.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (proveedor.telefono && proveedor.telefono.includes(searchTerm))
  );

  const paginatedProveedores = filteredProveedores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateProveedor = () => {
    setSelectedProveedor(null);
    setDialogMode('create');
    setOpenProveedorDialog(true);
  };

  const handleEditProveedor = (proveedor) => {
    setSelectedProveedor(proveedor);
    setDialogMode('edit');
    setOpenProveedorDialog(true);
  };

  const handleDeleteProveedor = (proveedor) => {
    setSelectedProveedor(proveedor);
    setOpenDeleteDialog(true);
  };

  const handleProveedorSuccess = async (message) => {
    setOpenProveedorDialog(false);
    setSuccess(message);
    await cargarProveedores();
  };

  const handleDeleteSuccess = async (message) => {
    setOpenDeleteDialog(false);
    setSuccess(message);
    await cargarProveedores();
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, height: '80vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Gestión de Proveedores
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, position: 'relative' }}>
          {/* Barra de búsqueda */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, RUT o teléfono..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />
          </Box>

          {/* Tabla de proveedores */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Proveedor
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      RUT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Contacto
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Dirección
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', textAlign: 'center' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {paginatedProveedores.map((proveedor, index) => (
                      <motion.tr
                        key={proveedor.id}
                        component={TableRow}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          '&:last-child td': { border: 0 }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32,
                                mr: 2,
                                fontSize: '0.875rem',
                              }}
                            >
                              {proveedor.nombre?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {proveedor.nombre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {proveedor.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          {proveedor.rut ? (
                            <Chip
                              label={proveedor.rut}
                              size="small"
                              variant="outlined"
                              sx={{ fontFamily: 'monospace' }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Sin RUT
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {proveedor.telefono ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {proveedor.telefono}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Sin teléfono
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {proveedor.direccion ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {proveedor.direccion}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Sin dirección
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Tooltip title="Editar proveedor">
                              <IconButton
                                size="small"
                                onClick={() => handleEditProveedor(proveedor)}
                                sx={{
                                  color: 'warning.main',
                                  '&:hover': { bgcolor: 'warning.light', color: 'white' },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Eliminar proveedor">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteProveedor(proveedor)}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': { bgcolor: 'error.light', color: 'white' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <TablePagination
              component="div"
              count={filteredProveedores.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
              }}
            />
          </Paper>

          {/* Estado vacío */}
          {!loading && filteredProveedores.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
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
          )}

          {/* Botón flotante para agregar */}
          <Fab
            color="primary"
            aria-label="agregar proveedor"
            onClick={handleCreateProveedor}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogos */}
      <ProveedorDialog
        open={openProveedorDialog}
        onClose={() => setOpenProveedorDialog(false)}
        onSuccess={handleProveedorSuccess}
        mode={dialogMode}
        proveedor={selectedProveedor}
      />

      <DeleteProveedorDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSuccess={handleDeleteSuccess}
        proveedor={selectedProveedor}
      />

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SuppliersManager;