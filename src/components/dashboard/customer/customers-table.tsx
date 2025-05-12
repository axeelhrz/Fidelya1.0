import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Pagination,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Autorenew as AutorenewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { Customer, CustomerTag } from '@/types/customer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onEmailCustomer: (customer: Customer) => void;
  onScheduleMeeting: (customer: Customer) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
  page: number;
  onPageChange: (page: number) => void;
}

// Número de elementos por página
const ITEMS_PER_PAGE = 8;

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onEmailCustomer,
  onScheduleMeeting,
  sortConfig,
  onSort,
  page,
  onPageChange,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };
  
  const handleAction = (action: string) => {
    if (!selectedCustomer) return;
    
    switch (action) {
      case 'view':
        onViewCustomer(selectedCustomer);
        break;
      case 'edit':
        onEditCustomer(selectedCustomer);
        break;
      case 'delete':
        onDeleteCustomer(selectedCustomer);
        break;
      case 'email':
        onEmailCustomer(selectedCustomer);
        break;
      case 'schedule':
        onScheduleMeeting(selectedCustomer);
        break;
    }
    
    handleMenuClose();
  };
  
  // Function to format dates
  const formatDate = (dateValue: Date | string | { toDate: () => Date } | null | undefined) => {
    if (!dateValue) return 'N/A';
    
    try {
      const date = typeof dateValue === 'string' 
        ? new Date(dateValue) 
        : dateValue instanceof Date 
          ? dateValue 
          : dateValue.toDate();
      
      return format(date, 'dd MMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };
  
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: alpha(theme.palette.success.main, 0.2),
          color: theme.palette.success.main,
          text: 'Activo'
        };
      case 'inactive':
        return {
          bg: alpha(theme.palette.warning.main, 0.2),
          color: theme.palette.warning.main,
          text: 'Inactivo'
        };
      case 'lead':
        return {
          bg: alpha(theme.palette.info.main, 0.2),
          color: theme.palette.info.main,
          text: 'Lead'
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.2),
          color: theme.palette.grey[500],
          text: status
        };
    }
  };

  // Function to get policy status indicators
  const getPolicyIndicators = (customer: Customer) => {
    if (!customer.policies || customer.policies.length === 0) {
      return null;
    }

    const hasActivePolicies = customer.policies.some(p => p.status === 'active');
    const hasExpiredPolicies = customer.policies.some(p => p.status === 'expired');
    const hasRenewingPolicies = customer.policies.some(p => {
      const endDate = p.endDate.toDate();
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return p.status === 'active' && endDate <= thirtyDaysFromNow && endDate >= now;
    });

    return (
      <Stack direction="row" spacing={1}>
        {hasActivePolicies && (
          <Tooltip title="Pólizas activas">
            <Chip
              icon={<CheckCircleIcon fontSize="small" />}
              label={customer.policies.filter(p => p.status === 'active').length}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                fontSize: '0.7rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          </Tooltip>
        )}
        {hasExpiredPolicies && (
          <Tooltip title="Pólizas vencidas">
            <Chip
              icon={<WarningIcon fontSize="small" />}
              label={customer.policies.filter(p => p.status === 'expired').length}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                fontWeight: 600,
                fontSize: '0.7rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          </Tooltip>
        )}
        {hasRenewingPolicies && (
          <Tooltip title="Pólizas por renovar">
            <Chip
              icon={<AutorenewIcon fontSize="small" />}
              label={customer.policies.filter(p => {
                const endDate = p.endDate.toDate();
                const now = new Date();
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                return p.status === 'active' && endDate <= thirtyDaysFromNow && endDate >= now;
              }).length}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                fontWeight: 600,
                fontSize: '0.7rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          </Tooltip>
        )}
      </Stack>
    );
  };

  // Function to render tags
  const renderTags = (tags?: CustomerTag[]) => {
    if (!tags || tags.length === 0) return null;

    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {tags.slice(0, 2).map((tag) => (
          <Tooltip key={tag.id} title={tag.name}>
            <Chip
              size="small"
              label={tag.name}
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: alpha(tag.color, 0.1),
                color: tag.color,
                borderRadius: '4px',
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          </Tooltip>
        ))}
        {tags.length > 2 && (
          <Tooltip title={tags.slice(2).map(tag => tag.name).join(', ')}>
            <Chip
              size="small"
              label={`+${tags.length - 2}`}
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                color: theme.palette.grey[600],
                borderRadius: '4px',
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          </Tooltip>
        )}
      </Stack>
    );
  };

  // Function to render reminders
  const renderReminders = (customer: Customer) => {
    if (!customer.reminders || customer.reminders.length === 0) return null;

    const pendingReminders = customer.reminders.filter(r => !r.completed);
    if (pendingReminders.length === 0) return null;

    return (
      <Tooltip title={`${pendingReminders.length} recordatorios pendientes`}>
        <Badge badgeContent={pendingReminders.length} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}>
          <NotificationsIcon fontSize="small" color="action" />
        </Badge>
      </Tooltip>
    );
  };
  
  // Pagination
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedCustomers = customers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };
  
  // Render loading skeletons
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Pólizas</TableCell>
                <TableCell>Etiquetas</TableCell>
                <TableCell>Fecha de registro</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={80} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
  
  // Render message if no customers
  if (customers.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          fontFamily="'Sora', sans-serif"
          fontWeight={600}
        >
          No se encontraron clientes
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          fontFamily="'Sora', sans-serif"
        >
          Intenta cambiar los filtros o agrega un nuevo cliente
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden', // Evita que aparezcan barras de desplazamiento
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Table sx={{ 
            tableLayout: 'fixed', // Fija el ancho de las columnas
            minWidth: '100%',
              }}>
            <TableHead>
              <TableRow sx={{ 
                '& th': { 
                          fontWeight: 600,
                          fontFamily: "'Sora', sans-serif",
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.default, 0.5)
                    : alpha(theme.palette.background.default, 0.5),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                } 
          }}>
                <TableCell width="22%">
                  <TableSortLabel
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('name')}
                  >
                    Cliente
                  </TableSortLabel>
                </TableCell>
                <TableCell width="15%">
                  <TableSortLabel
                    active={sortConfig.key === 'email'}
                    direction={sortConfig.key === 'email' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('email')}
      >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell width="12%">
                  <TableSortLabel
                    active={sortConfig.key === 'phone'}
                    direction={sortConfig.key === 'phone' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('phone')}
        >
                    Teléfono
                  </TableSortLabel>
                </TableCell>
                <TableCell width="10%">
                  <TableSortLabel
                    active={sortConfig.key === 'status'}
                    direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('status')}
                  >
                    Estado
                  </TableSortLabel>
                </TableCell>
                <TableCell width="12%">Pólizas</TableCell>
                <TableCell width="12%">Etiquetas</TableCell>
                <TableCell width="12%">
                  <TableSortLabel
                    active={sortConfig.key === 'createdAt'}
                    direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('createdAt')}
                  >
                    Registro
                  </TableSortLabel>
                </TableCell>
                <TableCell width="5%" align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCustomers.map((customer) => {
                const statusColor = getStatusColor(customer.status || 'inactive');
                
                return (
                  <TableRow 
                    key={customer.id}
                    hover
                    sx={{ 
                      '&:hover': { 
                        bgcolor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.05),
                      },
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => onViewCustomer(customer)}
                  >
                    <TableCell 
                      onClick={(e) => e.stopPropagation()}
                      sx={{ 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          src={customer.photoURL || undefined}
                          alt={customer.name || 'Cliente'}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: !customer.photoURL 
                              ? `${theme.palette.primary.main}` 
                              : undefined,
                            flexShrink: 0,
                          }}
                        >
                          {!customer.photoURL && (customer.name?.charAt(0) || 'C')}
                        </Avatar>
                        <Box sx={{ 
                          minWidth: 0, // Permite que el contenido se reduzca
                          overflow: 'hidden',
                        }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography 
                              variant="body1" 
                              fontWeight={600}
                              fontFamily="'Sora', sans-serif"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {customer.name || 'Sin nombre'}
                            </Typography>
                            {renderReminders(customer)}
                          </Stack>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            fontFamily="'Sora', sans-serif"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {customer.id.substring(0, 8)}
                          </Typography>
    </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      <Typography 
                        variant="body2"
                        fontFamily="'Sora', sans-serif"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {customer.email || 'Sin email'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      <Typography 
                        variant="body2"
                        fontFamily="'Sora', sans-serif"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {customer.phone || 'Sin teléfono'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusColor.text}
                        size="small"
                        sx={{
                          bgcolor: statusColor.bg,
                          color: statusColor.color,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          fontFamily: "'Sora', sans-serif",
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {getPolicyIndicators(customer)}
                    </TableCell>
                    <TableCell>
                      {renderTags(customer.tags)}
                    </TableCell>
                    <TableCell sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      <Typography 
                        variant="body2"
                        fontFamily="'Sora', sans-serif"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {formatDate(customer.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => onViewCustomer(customer)}
                            sx={{
                              color: theme.palette.primary.main,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Más acciones">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, customer)}
                            sx={{
                              color: theme.palette.text.secondary,
                              bgcolor: alpha(theme.palette.text.secondary, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.text.secondary, 0.2),
                              }
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
  );
              })}
            </TableBody>
          </Table>
        </Box>
        
        {/* Paginación mejorada */}
        {totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              fontFamily="'Sora', sans-serif"
            >
              Mostrando {startIndex + 1}-{Math.min(endIndex, customers.length)} de {customers.length} clientes
            </Typography>
            
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              size="medium"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 500,
                  borderRadius: '8px',
                },
                '& .Mui-selected': {
                  background: alpha(theme.palette.primary.main, 0.1),
                  fontWeight: 600,
                }
              }}
            />
          </Box>
        )}
      </Paper>
      
      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              fontFamily: "'Sora', sans-serif",
              fontWeight: 500,
              px: 2,
              py: 1.5,
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('email')}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('schedule')}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Programar reunión</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleAction('delete')}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon sx={{ color: theme.palette.error.main }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CustomerTable;