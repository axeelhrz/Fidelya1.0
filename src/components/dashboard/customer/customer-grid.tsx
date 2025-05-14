import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Stack,
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
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Autorenew as AutorenewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Customer, CustomerTag } from '@/types/customer';

interface CustomerGridProps {
  customers: Customer[];
  loading: boolean;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  page: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 12;

const CustomerGrid: React.FC<CustomerGridProps> = ({
  customers,
  loading,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  page,
  onPageChange,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    event.stopPropagation();
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
    }
    handleMenuClose();
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
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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
      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[...Array(8)].map((_, index) => (
          <Box 
            key={index} 
            sx={{ 
              flex: '1 1 calc(25% - 24px)', 
              minWidth: '250px',
              maxWidth: 'calc(25% - 24px)'
            }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                height: '100%',
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.8)
                  : alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={60} height={60} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={24} />
                      <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                  </Stack>
                  <Skeleton variant="rounded" width="40%" height={24} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  }

  // Render message if no customers
  if (customers.length === 0) {
    return (
      <Box
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
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {displayedCustomers.map((customer, index) => {
          const statusColor = getStatusColor(customer.status || 'inactive');
          return (
            <Box
              key={customer.id}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{ 
                flex: '1 1 calc(25% - 24px)', 
                minWidth: '250px',
                maxWidth: 'calc(25% - 24px)'
              }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 30px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                    cursor: 'pointer',
                  },
                }}
                onClick={() => onViewCustomer(customer)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        src={customer.photoURL || undefined}
                        alt={customer.name || 'Cliente'}
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: !customer.photoURL
                            ? `${theme.palette.primary.main}`
                            : undefined,
                        }}
                      >
                        {!customer.photoURL && (customer.name?.charAt(0) || 'C')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            fontFamily="'Sora', sans-serif"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {customer.name || 'Sin nombre'}
                          </Typography>
                          {renderReminders(customer)}
                        </Stack>
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
                      </Box>
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
                    </Stack>
                    {customer.email && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          fontFamily="'Sora', sans-serif"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {customer.email}
                        </Typography>
                      </Stack>
                    )}
                    {customer.phone && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          fontFamily="'Sora', sans-serif"
                        >
                          {customer.phone}
                        </Typography>
                      </Stack>
                    )}
                    {customer.address && (
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                        <Typography
                          variant="body2"
                          fontFamily="'Sora', sans-serif"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {customer.address}
                          {customer.city && `, ${customer.city}`}
                        </Typography>
                      </Stack>
                    )}
                    {customer.company && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          fontFamily="'Sora', sans-serif"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {customer.company}
                        </Typography>
                      </Stack>
                    )}
                    {getPolicyIndicators(customer)}
                    {renderTags(customer.tags)}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
      
      {totalPages > 1 && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: "'Sora', sans-serif",
                fontWeight: 500,
              }
            }}
          />
        </Box>
      )}
      
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

export default CustomerGrid;