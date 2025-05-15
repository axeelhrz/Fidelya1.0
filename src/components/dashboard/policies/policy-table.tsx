'use client';
import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Pagination,
  Stack,
  alpha,
  useTheme,
  Button,
  TableSortLabel,
  Skeleton,
  useMediaQuery
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';
import { formatCurrency } from '@/lib/formatters';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';


interface PolicyTableProps {
  policies: Policy[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onToggleStar: (id: string, star: boolean) => void;
  onToggleArchive: (id: string, archive: boolean) => void;
  onNewPolicy: () => void;
}

const PolicyTable: React.FC<PolicyTableProps> = ({
  policies,
  loading,
  page,
  onPageChange,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onToggleStar,
  onToggleArchive,
  onNewPolicy
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const itemsPerPage = 10;
  const totalPages = Math.ceil(policies.length / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPolicies = policies.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'expired': return theme.palette.error.main;
      case 'pending': return theme.palette.warning.main;
      case 'review': return theme.palette.info.main;
      case 'cancelled': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'expired': return 'Vencida';
      case 'pending': return 'Pendiente';
      case 'review': return 'En revisión';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getExpirationStatus = (endDate: Date) => {
    const daysToExpiration = differenceInDays(endDate, new Date());
    
    if (daysToExpiration < 0) {
      return { color: theme.palette.error.main, text: 'Vencida' };
    } else if (daysToExpiration <= 30) {
      return { color: theme.palette.warning.main, text: `${daysToExpiration} días` };
    } else {
      return { color: theme.palette.success.main, text: `${daysToExpiration} días` };
    }
  };

  // Renderizar esqueletos durante la carga
  if (loading && policies.length === 0) {
    return (
      <Box sx={{ mb: 3 }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Compañía</TableCell>
                  </>
                )}
                <TableCell>Prima</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Skeleton variant="circular" width={30} height={30} />
                      <Skeleton variant="circular" width={30} height={30} />
                            </Stack>
                          </TableCell>
                        </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
  }

  // Renderizar mensaje si no hay pólizas
  if (policies.length === 0) {
    return (
      <Box sx={{ mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '16px',
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            fontWeight={600}
            fontFamily="Sora, sans-serif"
          >
            No se encontraron pólizas
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 3 }}
            fontFamily="Inter, sans-serif"
          >
            No hay pólizas que coincidan con los filtros seleccionados o aún no has creado ninguna póliza.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onNewPolicy}
            sx={{ 
              borderRadius: '999px',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
            }}
          >
            Crear Nueva Póliza
          </Button>
        </Paper>
      </Box>
    );
  }
  return (
    <Box sx={{ mb: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            height: '500px', // Altura fija para la virtualización
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.background.paper, 0.8)
                      : alpha(theme.palette.background.paper, 0.9),
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }
                }}
              >
                <TableCell width={50}></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'policyNumber'}
                    direction={sortConfig.key === 'policyNumber' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('policyNumber')}
                  >
                    Número
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'customerName'}
                    direction={sortConfig.key === 'customerName' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('customerName')}
                  >
                    Cliente
                  </TableSortLabel>
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Compañía</TableCell>
                  </>
                )}
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'premium'}
                    direction={sortConfig.key === 'premium' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('premium')}
                  >
                    Prima
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'endDate'}
                    direction={sortConfig.key === 'endDate' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('endDate')}
                  >
                    Vencimiento
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'status'}
                    direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('status')}
                  >
                    Estado
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  itemCount={displayedPolicies.length}
                  itemSize={72} // Altura aproximada de cada fila
                    >
                  {({ index, style }) => {
                    const policy = displayedPolicies[index];
                    const expirationStatus = getExpirationStatus(policy.endDate.toDate());
                    
                    return (
                      <div style={style}>
                        <TableRow
                          key={policy.id}
                          style={{ 
                            backgroundColor: policy.isStarred === true
                              ? alpha(theme.palette.warning.main, 0.05)
                              : theme.palette.background.paper,
                          }}
                          onClick={() => onView(policy)}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleStar(policy.id, !policy.isStarred);
                              }}
                              sx={{ 
                                color: policy.isStarred === true
                                  ? theme.palette.warning.main 
                                  : theme.palette.text.secondary,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                }
                              }}
                            >
                              {policy.isStarred === true ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              fontWeight={600}
                              sx={{ color: theme.palette.text.primary }}
                            >
                              {policy.policyNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {policy.customerName}
                            </Typography>
                          </TableCell>
                          {!isSmallScreen && (
                            <>
                              <TableCell>{policy.type}</TableCell>
                              <TableCell>{policy.company}</TableCell>
                            </>
                          )}
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              fontWeight={600}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {formatCurrency(policy.premium)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="column" spacing={0.5}>
                              <Typography 
                                variant="body2" 
                                fontWeight={500}
                                sx={{ color: expirationStatus.color }}
                              >
                                {expirationStatus.text}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                              >
                                {format(policy.endDate.toDate(), 'dd MMM yyyy', { locale: es })}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(policy.status)}
                              size="small"
            sx={{
                                backgroundColor: alpha(getStatusColor(policy.status), 0.1),
                                color: getStatusColor(policy.status),
                fontWeight: 600,
                                fontSize: '0.75rem',
                                fontFamily: 'Sora, sans-serif',
                borderRadius: '8px',
            }}
          />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Ver detalles">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onView(policy);
                                  }}
                                  sx={{ 
                                    color: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    }
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(policy);
                                  }}
                                  sx={{ 
                                    color: theme.palette.secondary.main,
                                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {onToggleArchive && (
                                <Tooltip title={policy.isArchived ? "Desarchivar" : "Archivar"}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleArchive(policy.id, !policy.isArchived);
                                    }}
                                    sx={{ 
                                      color: theme.palette.grey[600],
                                      backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.grey[500], 0.2),
                                      }
                                    }}
                                  >
                                    {policy.isArchived ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
                                  </IconButton>
                                </Tooltip>
      )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </div>
  );
                  }}
                </List>
              )}
            </AutoSizer>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Paginación */}
      {policies.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                borderRadius: '8px',
              },
              '& .Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PolicyTable;