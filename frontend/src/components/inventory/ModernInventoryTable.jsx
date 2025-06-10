import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  alpha,
  TableSortLabel,
  Skeleton,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ModernInventoryTable = ({
  productos = [],
  paginacion = {},
  onEditarProducto,
  onEliminarProducto,
  onAjustarStock,
  onVerDetalles,
  onPaginaChange,
  onSelectionChange,
  selectedProducts = [],
  loading = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductForMenu, setSelectedProductForMenu] = useState(null);
  const [orderBy, setOrderBy] = useState('nombre');
  const [order, setOrder] = useState('asc');

  const handleMenuOpen = (event, producto) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductForMenu(producto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProductForMenu(null);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = productos.map(producto => producto.id);
      onSelectionChange(newSelected);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProducts.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProducts, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProducts.slice(1));
    } else if (selectedIndex === selectedProducts.length - 1) {
      newSelected = newSelected.concat(selectedProducts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedProducts.slice(0, selectedIndex),
        selectedProducts.slice(selectedIndex + 1),
      );
    }

    onSelectionChange(newSelected);
  };

  const isSelected = (id) => selectedProducts.indexOf(id) !== -1;

  const getStockStatus = (producto) => {
    const stockActual = Number(producto.stock_actual) || 0;
    const stockMinimo = Number(producto.stock_minimo) || 0;
    if (stockActual === 0) {
      return { 
        label: 'Sin Stock', 
        color: 'error', 
        icon: <WarningIcon fontSize="small" />,
        severity: 'high'
      };
    } else if (stockActual <= stockMinimo) {
      return { 
        label: 'Stock Bajo', 
        color: 'warning', 
        icon: <TrendingDownIcon fontSize="small" />,
        severity: 'medium'
      };
    } else {
      return { 
        label: 'En Stock', 
        color: 'success', 
        icon: <CheckCircleIcon fontSize="small" />,
        severity: 'low'
      };
    }
  };

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (value) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat('es-UY').format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleChangePage = (event, newPage) => {
    onPaginaChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    // Implementar cambio de límite por página
    console.log('Cambiar límite:', event.target.value);
  };

  // Función para manejar ver detalles
  const handleVerDetalles = (producto) => {
    if (onVerDetalles) {
      onVerDetalles(producto);
    }
    handleMenuClose();
  };

  // Función mejorada para ajustar stock
  const handleAjustarStock = (producto) => {
    if (onAjustarStock) {
      onAjustarStock(producto);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                <TableCell key={col}>
                  <Skeleton variant="text" width="100%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <TableCell key={col}>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < productos.length}
                  checked={productos.length > 0 && selectedProducts.length === productos.length}
                  onChange={handleSelectAll}
                  sx={{
                    color: theme.palette.primary.main,
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </TableCell>
              
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nombre'}
                  direction={orderBy === 'nombre' ? order : 'asc'}
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  Producto
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Stock
                </Typography>
              </TableCell>
              
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Estado
                </Typography>
              </TableCell>
              
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'precio_unitario'}
                  direction={orderBy === 'precio_unitario' ? order : 'asc'}
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  Precio
                </TableSortLabel>
              </TableCell>
              
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Categoría
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Última Actualización
                </Typography>
              </TableCell>
              
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Acciones
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            <AnimatePresence>
              {productos.map((producto, index) => {
                const isItemSelected = isSelected(producto.id);
                const stockStatus = getStockStatus(producto);
                
                return (
                  <motion.tr
                    key={producto.id}
                    component={TableRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    hover
                    selected={isItemSelected}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                        },
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleSelectOne(event, producto.id)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                          }}
                        >
                          {producto.nombre?.charAt(0)?.toUpperCase() || 'P'}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={600}
                            color="text.primary"
                            sx={{ mb: 0.5 }}
                          >
                            {producto.nombre}
                          </Typography>
                          {producto.codigo_barras && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontFamily: 'monospace',
                                bgcolor: alpha(theme.palette.grey[500], 0.1),
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                              }}
                            >
                              {producto.codigo_barras}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700}
                          color={stockStatus.severity === 'high' ? 'error.main' : 'text.primary'}
                        >
                          {formatNumber(producto.stock_actual)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Min: {formatNumber(producto.stock_minimo)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Chip
                        icon={stockStatus.icon}
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 2,
                          '& .MuiChip-icon': {
                            fontSize: '0.875rem',
                          },
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="right">
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600}
                          color="text.primary"
                        >
                          {formatCurrency(producto.precio_unitario)}
                        </Typography>
                        {producto.precio_compra && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                          >
                            Costo: {formatCurrency(producto.precio_compra)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={producto.categoria || 'Sin categoría'}
                        size="small"
                        variant="filled"
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          fontWeight: 500,
                          borderRadius: 2,
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(producto.actualizado || producto.creado)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Ver Detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleVerDetalles(producto)}
                            sx={{
                              color: theme.palette.info.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                              },
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Ajustar Stock">
                          <IconButton
                            size="small"
                            onClick={() => handleAjustarStock(producto)}
                            sx={{
                              color: theme.palette.success.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                              },
                            }}
                          >
                            <InventoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => onEditarProducto(producto)}
                            sx={{
                              color: theme.palette.warning.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuOpen(event, producto)}
                          sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.text.secondary, 0.1),
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
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
        component="div"
        count={paginacion.total_registros || 0}
        page={(paginacion.pagina_actual || 1) - 1}
        onPageChange={handleChangePage}
        rowsPerPage={paginacion.limite || 25}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          '& .MuiTablePagination-toolbar': {
            px: 3,
            py: 2,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 500,
            color: theme.palette.text.secondary,
          },
        }}
      />

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <MenuItem 
          onClick={() => handleVerDetalles(selectedProductForMenu)}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver Detalles</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onEditarProducto(selectedProductForMenu);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleAjustarStock(selectedProductForMenu)}
        >
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ajustar Stock</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onEliminarProducto(selectedProductForMenu?.id);
            handleMenuClose();
          }}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ModernInventoryTable;