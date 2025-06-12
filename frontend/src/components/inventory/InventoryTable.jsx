import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as StockIcon,
  Apple as FruitIcon,
  Grass as VegetableIcon,
  Category as OtherIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InventoryTable = ({ 
  productos = [], 
  onEdit, 
  onDelete, 
  onAdjustStock, 
  loading = false 
}) => {
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('nombre');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getCategoryIcon = (categoria) => {
    const iconProps = { fontSize: 'small' };
    switch (categoria) {
      case 'frutas':
        return <FruitIcon {...iconProps} sx={{ color: theme.palette.success.main }} />;
      case 'verduras':
        return <VegetableIcon {...iconProps} sx={{ color: theme.palette.primary.main }} />;
      default:
        return <OtherIcon {...iconProps} sx={{ color: theme.palette.warning.main }} />;
    }
  };

  const getCategoryColor = (categoria) => {
    switch (categoria) {
      case 'frutas':
        return 'success';
      case 'verduras':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getStockStatus = (stockActual, stockMinimo) => {
    if (stockActual <= 0) {
      return { color: 'error', label: 'Sin stock', severity: 'high' };
    } else if (stockActual <= stockMinimo) {
      return { color: 'warning', label: 'Stock bajo', severity: 'medium' };
    } else if (stockActual <= stockMinimo * 2) {
      return { color: 'info', label: 'Stock medio', severity: 'low' };
    }
    return { color: 'success', label: 'Stock bueno', severity: 'none' };
  };

  const sortedProducts = React.useMemo(() => {
    return [...productos].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === 'precio_unitario') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [productos, order, orderBy]);
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando productos...</Typography>
      </Paper>
    );
  }

  if (productos.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          sx={{ opacity: 0.6 }}
        >
          <StockIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            No hay productos disponibles
                          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega tu primer producto para comenzar
                          </Typography>
                        </Box>
      </Paper>
                );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      >
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: theme.shadows[4],
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Producto
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'categoria'}
                  direction={orderBy === 'categoria' ? order : 'asc'}
                  onClick={() => handleRequestSort('categoria')}
                >
                  Categoría
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'stock_actual'}
                  direction={orderBy === 'stock_actual' ? order : 'asc'}
                  onClick={() => handleRequestSort('stock_actual')}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableSortLabel
                  active={orderBy === 'precio_unitario'}
                  direction={orderBy === 'precio_unitario' ? order : 'asc'}
                  onClick={() => handleRequestSort('precio_unitario')}
                >
                  Precio
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Proveedor
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                Estado
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((producto, index) => {
              const stockStatus = getStockStatus(producto.stock_actual, producto.stock_minimo);
              
              return (
                <motion.tr
                  key={producto.id}
                  component={TableRow}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getCategoryColor(producto.categoria) === 'success' 
                            ? theme.palette.success.main 
                            : getCategoryColor(producto.categoria) === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.warning.main, 0.1),
                          color: getCategoryColor(producto.categoria) === 'success' 
                            ? theme.palette.success.main 
                            : getCategoryColor(producto.categoria) === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.warning.main,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getCategoryIcon(producto.categoria)}
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
                      color={getCategoryColor(producto.categoria)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        textTransform: 'capitalize',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={600}>
                        {producto.stock_actual}
                      </Typography>
                      {producto.stock_bajo && (
                        <Tooltip title="Stock bajo">
                          <WarningIcon 
                            fontSize="small" 
                            sx={{ color: theme.palette.warning.main }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Mín: {producto.stock_minimo}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {formatPrice(producto.precio_unitario)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {producto.proveedor || 'Sin proveedor'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={stockStatus.label}
                      color={stockStatus.color}
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Ajustar stock">
                        <IconButton
                          size="small"
                          onClick={() => onAdjustStock(producto)}
                          sx={{
                            color: theme.palette.info.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                            },
                          }}
                        >
                          <StockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Editar producto">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(producto)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar producto">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(producto.id)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </motion.tr>
  );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default InventoryTable;