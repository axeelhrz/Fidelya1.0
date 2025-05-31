import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Avatar,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryTable = ({ productos, onEdit, onDelete, onAdjustStock, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, producto) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(producto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleEdit = () => {
    onEdit(selectedProduct);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(selectedProduct.id);
    handleMenuClose();
  };

  const handleAdjustStock = () => {
    onAdjustStock(selectedProduct);
    handleMenuClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoriaColor = (categoria) => {
    const colores = {
      fruta: 'success',
      verdura: 'warning',
      otro: 'info',
    };
    return colores[categoria] || 'default';
  };

  const getCategoriaIcon = (categoria) => {
    const iconos = {
      fruta: '🍎',
      verdura: '🥬',
      otro: '📦',
    };
    return iconos[categoria] || '📦';
  };

  const getStockStatus = (producto) => {
    if (producto.stock <= 0) {
      return { color: 'error', icon: <WarningIcon />, text: 'Sin stock' };
    } else if (producto.stock_bajo) {
      return { color: 'warning', icon: <TrendingDownIcon />, text: 'Stock bajo' };
    } else {
      return { color: 'success', icon: <TrendingUpIcon />, text: 'Stock normal' };
    }
  };

  // Calcular productos paginados
  const productosPaginados = productos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      </Card>
    );
  }

  if (productos.length === 0) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No se encontraron productos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los filtros o agrega nuevos productos
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precios</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actualizado</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {productosPaginados.map((producto, index) => {
                const stockStatus = getStockStatus(producto);
                
                return (
                  <motion.tr
                    key={producto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    component={TableRow}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            backgroundColor: 'primary.light',
                            color: 'primary.dark',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getCategoriaIcon(producto.categoria)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {producto.unidad}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={producto.categoria}
                        color={getCategoriaColor(producto.categoria)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {producto.proveedor || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            color={stockStatus.color + '.main'}
                          >
                            {producto.stock}
                          </Typography>
                          <Tooltip title={stockStatus.text}>
                            <Box sx={{ color: stockStatus.color + '.main' }}>
                              {stockStatus.icon}
                            </Box>
                          </Tooltip>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Mín: {producto.stock_minimo}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          Compra: {formatCurrency(producto.precio_compra)}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Venta: {formatCurrency(producto.precio_venta)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(producto.actualizado)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" justifyContent="center">
                        <Tooltip title="Más opciones">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, producto)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={productos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar producto</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleAdjustStock}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ajustar stock</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar producto</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default InventoryTable;