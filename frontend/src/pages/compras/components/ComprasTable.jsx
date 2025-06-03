import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasTable = ({ compras, loading, onEdit, onView, onDelete }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('fecha');
  const [order, setOrder] = useState('desc');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedCompras = React.useMemo(() => {
    if (!compras) return [];
    
    return [...compras].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      if (orderBy === 'fecha') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (orderBy === 'total') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [compras, order, orderBy]);

  const paginatedCompras = sortedCompras.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getProveedorColor = (index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                {['Proveedor', 'Fecha', 'Comprobante', 'Productos', 'Total', 'Acciones'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 700, color: 'text.primary' }}>
                    <Skeleton variant="text" width={100} height={24} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
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

  if (!compras || compras.length === 0) {
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
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon fontSize="small" />
                  Comprobante
                </Box>
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
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCompras.map((compra, index) => (
              <motion.tr
                key={compra.id}
                component={TableRow}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    transform: 'scale(1.001)',
                  },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => onView(compra)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        background: `linear-gradient(135deg, ${getProveedorColor(index)} 0%, ${getProveedorColor(index)}CC 100%)`,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: `0 2px 8px ${alpha(getProveedorColor(index), 0.3)}`,
                      }}
                    >
                      {compra.proveedor_nombre?.charAt(0).toUpperCase() || 'P'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {compra.proveedor_nombre || 'Sin proveedor'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {compra.proveedor_id || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(compra.fecha)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(compra.fecha).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={compra.numero_comprobante || 'Sin número'}
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

                <TableCell align="center">
                  <Badge
                    badgeContent={compra.detalles?.length || 0}
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
                      label="Productos"
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
                      {formatCurrency(compra.total)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {compra.metodo_pago || 'Sin método'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Ver detalles" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(compra);
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
                          onEdit(compra);
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
                          onDelete(compra);
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación moderna */}
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
          Mostrando {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, sortedCompras.length)} de {sortedCompras.length} compras
        </Typography>
        
        <TablePagination
          component="div"
          count={sortedCompras.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
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
    </Box>
  );
};

export default ComprasTable;