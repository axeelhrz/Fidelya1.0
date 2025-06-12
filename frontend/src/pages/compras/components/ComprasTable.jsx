import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Skeleton,
  TableSortLabel,
  useTheme,
  alpha,
  Badge,
  Alert,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Collapse,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  ErrorOutline as ErrorIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';

// Hook personalizado para virtualización de tabla
const useVirtualizedTable = (data, itemHeight = 80) => {
  const [containerHeight, setContainerHeight] = useState(400);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 100;
        setContainerHeight(Math.min(Math.max(availableHeight, 300), 600));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return { containerHeight, containerRef };
};

// Componente de fila virtualizada
const VirtualizedRow = React.memo(({ index, style, data }) => {
  const { compras, onEdit, onView, onDelete, theme, formatters, selectedRows, onRowSelect } = data;
  const compra = compras[index];

  if (!compra) return null;

  const {
    formatDate,
    formatTime,
    formatCurrency,
    getProveedorColor,
    getMetodoPagoIcon,
    getNumeroComprobante,
    getCompraId,
    getProveedorNombre,
    getMetodoPago,
    getProductosCount
  } = formatters;

  const compraId = getCompraId(compra);
  const proveedorNombre = getProveedorNombre(compra);
  const numeroComprobante = getNumeroComprobante(compra);
  const metodoPago = getMetodoPago(compra);
  const productosCount = getProductosCount(compra);
  const isSelected = selectedRows.has(compraId);

  return (
    <div style={style}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          cursor: 'pointer',
          backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = alpha(theme.palette.primary.main, 0.04);
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        onClick={() => onView && onView(compra)}
      >
        {/* Checkbox */}
        <Box sx={{ width: 50, flexShrink: 0 }}>
          <Checkbox
            size="small"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onRowSelect(compraId);
            }}
            sx={{
              color: 'primary.main',
              '&.Mui-checked': {
                color: 'primary.main',
              },
            }}
          />
        </Box>

        {/* ID */}
        <Box sx={{ width: 100, flexShrink: 0 }}>
          <Chip
            label={`#${compraId}`}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          />
        </Box>

        {/* Proveedor */}
        <Box sx={{ width: 200, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              background: `linear-gradient(135deg, ${getProveedorColor(index)} 0%, ${getProveedorColor(index)}CC 100%)`,
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: `0 2px 8px ${alpha(getProveedorColor(index), 0.3)}`,
            }}
          >
            {proveedorNombre.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {proveedorNombre}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {compra.proveedor_id || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Fecha */}
        <Box sx={{ width: 150, flexShrink: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {formatDate(compra.fecha)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(compra.fecha)}
          </Typography>
        </Box>

        {/* Comprobante */}
        <Box sx={{ width: 150, flexShrink: 0 }}>
          <Chip
            label={numeroComprobante}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderColor: alpha(theme.palette.info.main, 0.3),
              color: 'info.main',
              bgcolor: alpha(theme.palette.info.main, 0.05),
            }}
          />
        </Box>

        {/* Productos */}
        <Box sx={{ width: 120, flexShrink: 0, textAlign: 'center' }}>
          <Badge
            badgeContent={productosCount}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                fontWeight: 600,
                fontSize: '0.75rem',
              }
            }}
          >
            <Chip
              icon={<TrendingUpIcon />}
              label="Items"
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
              }}
            />
          </Badge>
        </Box>

        {/* Total */}
        <Box sx={{ width: 150, flexShrink: 0, textAlign: 'right' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: 'success.main',
              fontSize: '1rem',
            }}
          >
            {formatCurrency(compra.total)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              {getMetodoPagoIcon(metodoPago)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {metodoPago}
            </Typography>
          </Box>
        </Box>

        {/* Acciones */}
        <Box sx={{ width: 120, flexShrink: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="Ver detalles" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onView && onView(compra);
              }}
              sx={{
                color: 'info.main',
                bgcolor: alpha(theme.palette.info.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.info.main, 0.2),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar compra" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(compra);
              }}
              sx={{
                color: 'warning.main',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar compra" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(compra);
              }}
              sx={{
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>
    </div>
  );
});

const ComprasTable = ({ compras, loading, onEdit, onView, onDelete, filtros }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('fecha');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const { containerHeight, containerRef } = useVirtualizedTable(compras);

  // Funciones de formateo memoizadas
  const formatters = useMemo(() => ({
    formatDate: (dateString) => {
      if (!dateString) return 'Sin fecha';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Fecha inválida';
        
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },

    formatTime: (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        return date.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch (error) {
        return '';
      }
    },

    formatCurrency: (amount) => {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) return '$0.00';
      
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(numericAmount);
    },

    getProveedorColor: (index) => {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
      return colors[index % colors.length];
    },

    getMetodoPagoColor: (metodo) => {
      const colores = {
        efectivo: '#10B981',
        transferencia: '#3B82F6',
        cheque: '#F59E0B',
        credito: '#8B5CF6'
      };
      return colores[metodo?.toLowerCase()] || '#6B7280';
    },

    getMetodoPagoIcon: (metodo) => {
      const emojis = {
        efectivo: '💵',
        transferencia: '🏦',
        cheque: '📝',
        credito: '💳'
      };
      return emojis[metodo?.toLowerCase()] || '💰';
    },

    getNumeroComprobante: (compra) => {
      if (compra.numero_comprobante && compra.numero_comprobante !== 'Sin número') {
        return compra.numero_comprobante;
      }
      const fecha = new Date(compra.fecha);
      const year = fecha.getFullYear().toString().slice(-2);
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const id = String(compra.id || Math.floor(Math.random() * 1000)).padStart(4, '0');
      return `COMP-${year}${month}-${id}`;
    },

    getCompraId: (compra) => {
      return compra.id || `temp-${Date.now()}`;
    },

    getProveedorNombre: (compra) => {
      return compra.proveedor_nombre || compra.proveedor?.nombre || 'Proveedor no especificado';
    },

    getMetodoPago: (compra) => {
      return compra.metodo_pago || 'efectivo';
    },

    getProductosCount: (compra) => {
      if (Array.isArray(compra.detalles)) {
        return compra.detalles.length;
      }
      if (Array.isArray(compra.productos)) {
        return compra.productos.length;
      }
      return 0;
    },
  }), []);

  // Handlers optimizados
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleRequestSort = useCallback((property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, order]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleRowSelect = useCallback((compraId) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(compraId)) {
        newSet.delete(compraId);
      } else {
        newSet.add(compraId);
      }
      return newSet;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  // Filtrado y ordenamiento optimizado
  const filteredAndSortedCompras = useMemo(() => {
    if (!Array.isArray(compras)) return [];
    
    let filtered = [...compras];

    // Aplicar búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(compra => 
        formatters.getProveedorNombre(compra).toLowerCase().includes(searchLower) ||
        formatters.getNumeroComprobante(compra).toLowerCase().includes(searchLower) ||
        compra.observaciones?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      if (orderBy === 'fecha') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (orderBy === 'total') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (orderBy === 'proveedor_nombre') {
        aValue = formatters.getProveedorNombre(a).toLowerCase();
        bValue = formatters.getProveedorNombre(b).toLowerCase();
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [compras, searchTerm, order, orderBy, formatters]);

  // Compras paginadas
  const paginatedCompras = useMemo(() => {
    if (useVirtualization) return filteredAndSortedCompras;
    
    return filteredAndSortedCompras.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredAndSortedCompras, page, rowsPerPage, useVirtualization]);

  // Handler para seleccionar todas las filas
  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === filteredAndSortedCompras.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedCompras.map(compra => formatters.getCompraId(compra))));
    }
  }, [selectedRows.size, filteredAndSortedCompras, formatters]);

  // Estadísticas de la tabla
  const tableStats = useMemo(() => {
    const total = filteredAndSortedCompras.length;
    const totalInvertido = filteredAndSortedCompras.reduce((sum, compra) => sum + (parseFloat(compra.total) || 0), 0);
    const promedioCompra = total > 0 ? totalInvertido / total : 0;
    
    return {
      total,
      totalInvertido,
      promedioCompra,
      showing: useVirtualization ? total : Math.min(rowsPerPage, total - page * rowsPerPage),
      selected: selectedRows.size
    };
  }, [filteredAndSortedCompras, page, rowsPerPage, useVirtualization, selectedRows.size]);

  // Componente de loading
  if (loading) {
    return (
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                {['', 'ID', 'Proveedor', 'Fecha', 'Comprobante', 'Productos', 'Total', 'Acciones'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 700, color: 'text.primary' }}>
                    <Skeleton variant="text" width={100} height={24} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} height={20} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box>
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width={80} height={16} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} height={24} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // Componente de estado vacío
  if (!Array.isArray(compras) || compras.length === 0) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              mx: 'auto',
              mb: 3,
            }}
          >
            <ReceiptIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
            No hay compras registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Las compras que registres aparecerán aquí. Comienza creando tu primera compra para ver el historial completo.
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header de la tabla con controles */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Compras ({tableStats.total})
            </Typography>
            {tableStats.selected > 0 && (
              <Chip
                label={`${tableStats.selected} seleccionadas`}
                color="primary"
                size="small"
                onDelete={handleClearSelection}
                deleteIcon={<ClearIcon />}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useVirtualization}
                  onChange={(e) => setUseVirtualization(e.target.checked)}
                  size="small"
                />
              }
              label="Virtualización"
              sx={{ mr: 2 }}
            />
            
            <Tooltip title="Vista de tabla">
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                sx={{
                  color: viewMode === 'table' ? 'primary.main' : 'text.secondary',
                  bgcolor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Vista de tarjetas">
              <IconButton
                size="small"
                onClick={() => setViewMode('cards')}
                sx={{
                  color: viewMode === 'cards' ? 'primary.main' : 'text.secondary',
                  bgcolor: viewMode === 'cards' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Más opciones">
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Barra de búsqueda y filtros */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar por proveedor, comprobante o observaciones..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Filtros Avanzados
          </Button>
        </Box>

        {/* Estadísticas rápidas */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<ReceiptIcon />}
            label={`${tableStats.showing} de ${tableStats.total} compras`}
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<AttachMoneyIcon />}
            label={`Total: ${formatters.formatCurrency(tableStats.totalInvertido)}`}
            variant="outlined"
            size="small"
            color="success"
          />
          <Chip
            icon={<TrendingUpIcon />}
            label={`Promedio: ${formatters.formatCurrency(tableStats.promedioCompra)}`}
            variant="outlined"
            size="small"
            color="info"
          />
        </Box>

        {/* Filtros avanzados colapsables */}
        <Collapse in={showAdvancedFilters}>
          <Card sx={{ mt: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Filtros Avanzados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filtros avanzados en desarrollo...
              </Typography>
            </CardContent>
          </Card>
        </Collapse>
      </Box>

      {/* Tabla principal o vista virtualizada */}
      {useVirtualization ? (
        <Box ref={containerRef} sx={{ height: containerHeight }}>
          <List
            height={containerHeight}
            itemCount={filteredAndSortedCompras.length}
            itemSize={80}
            itemData={{
              compras: filteredAndSortedCompras,
              onEdit,
              onView,
              onDelete,
              theme,
              formatters,
              selectedRows,
              onRowSelect: handleRowSelect
            }}
          >
            {VirtualizedRow}
          </List>
        </Box>
      ) : (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Checkbox
                    size="small"
                    indeterminate={selectedRows.size > 0 && selectedRows.size < filteredAndSortedCompras.length}
                    checked={filteredAndSortedCompras.length > 0 && selectedRows.size === filteredAndSortedCompras.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                    sx={{ 
                      '& .MuiTableSortLabel-icon': { 
                        color: 'primary.main !important' 
                      }
                    }}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableSortLabel
                    active={orderBy === 'proveedor_nombre'}
                    direction={orderBy === 'proveedor_nombre' ? order : 'asc'}
                    onClick={() => handleRequestSort('proveedor_nombre')}
                    sx={{ 
                      '& .MuiTableSortLabel-icon': { 
                        color: 'primary.main !important' 
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" />
                      Proveedor
                    </Box>
                  </TableSortLabel>
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableSortLabel
                    active={orderBy === 'fecha'}
                    direction={orderBy === 'fecha' ? order : 'asc'}
                    onClick={() => handleRequestSort('fecha')}
                    sx={{ 
                      '& .MuiTableSortLabel-icon': { 
                        color: 'primary.main !important' 
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" />
                      Fecha
                    </Box>
                  </TableSortLabel>
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableSortLabel
                    active={orderBy === 'numero_comprobante'}
                    direction={orderBy === 'numero_comprobante' ? order : 'asc'}
                    onClick={() => handleRequestSort('numero_comprobante')}
                    sx={{ 
                      '& .MuiTableSortLabel-icon': { 
                        color: 'primary.main !important' 
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReceiptIcon fontSize="small" />
                      Comprobante
                    </Box>
                  </TableSortLabel>
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    Productos
                  </Box>
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'right', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableSortLabel
                    active={orderBy === 'total'}
                    direction={orderBy === 'total' ? order : 'asc'}
                    onClick={() => handleRequestSort('total')}
                    sx={{ 
                      '& .MuiTableSortLabel-icon': { 
                        color: 'primary.main !important' 
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <AttachMoneyIcon fontSize="small" />
                      Total
                    </Box>
                  </TableSortLabel>
                </TableCell>
                
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {paginatedCompras.map((compra, index) => {
                  const compraId = formatters.getCompraId(compra);
                  const proveedorNombre = formatters.getProveedorNombre(compra);
                  const numeroComprobante = formatters.getNumeroComprobante(compra);
                  const metodoPago = formatters.getMetodoPago(compra);
                  const productosCount = formatters.getProductosCount(compra);
                  const isSelected = selectedRows.has(compraId);
                  
                  return (
                    <motion.tr
                      key={compraId}
                      component={TableRow}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          transform: 'scale(1.001)',
                        },
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      }}
                      onClick={() => onView && onView(compra)}
                    >
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(compraId);
                          }}
                        />
                      </TableCell>

                      {/* ID */}
                      <TableCell>
                        <Chip
                          label={`#${compraId}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }}
                        />
                      </TableCell>

                      {/* Proveedor */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              background: `linear-gradient(135deg, ${formatters.getProveedorColor(index)} 0%, ${formatters.getProveedorColor(index)}CC 100%)`,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              boxShadow: `0 2px 8px ${alpha(formatters.getProveedorColor(index), 0.3)}`,
                            }}
                          >
                            {proveedorNombre.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {proveedorNombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {compra.proveedor_id || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Fecha */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatters.formatDate(compra.fecha)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatters.formatTime(compra.fecha)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Comprobante */}
                      <TableCell>
                        <Chip
                          label={numeroComprobante}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: alpha(theme.palette.info.main, 0.3),
                            color: 'info.main',
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                            }
                          }}
                        />
                      </TableCell>

                      {/* Productos */}
                      <TableCell align="center">
                        <Badge
                          badgeContent={productosCount}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }
                          }}
                        >
                          <Chip
                            icon={<TrendingUpIcon />}
                            label="Items"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: 'success.main',
                              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                            }}
                          />
                        </Badge>
                      </TableCell>

                      {/* Total */}
                      <TableCell align="right">
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: 'success.main',
                              mb: 0.5,
                            }}
                          >
                            {formatters.formatCurrency(compra.total)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                              {formatters.getMetodoPagoIcon(metodoPago)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                              {metodoPago}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Ver detalles" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView && onView(compra);
                              }}
                              sx={{
                                color: 'info.main',
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.info.main, 0.2),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Editar compra" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit && onEdit(compra);
                              }}
                              sx={{
                                color: 'warning.main',
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar compra" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete && onDelete(compra);
                              }}
                              sx={{
                                color: 'error.main',
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.2),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
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
      )}

      {/* Información de error si hay problemas con los datos */}
      {Array.isArray(compras) && compras.length > 0 && paginatedCompras.length === 0 && (
        <Alert 
          severity="warning" 
          icon={<ErrorIcon />}
          sx={{ m: 2 }}
        >
          No se encontraron compras que coincidan con los criterios de búsqueda actuales.
        </Alert>
      )}

      {/* Paginación moderna */}
      {!useVirtualization && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Mostrando {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, filteredAndSortedCompras.length)} de {filteredAndSortedCompras.length} compras
          </Typography>
          
          <TablePagination
            component="div"
            count={filteredAndSortedCompras.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 0,
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontWeight: 500,
                color: 'text.secondary',
              },
              '& .MuiTablePagination-select': {
                fontWeight: 600,
              },
              '& .MuiIconButton-root': {
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
                '&.Mui-disabled': {
                  color: 'text.disabled',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Menu de opciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimir tabla</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exportar datos</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <AnalyticsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver analytics</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ComprasTable;