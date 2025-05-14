'use client';
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  useTheme,
  Button,
  Skeleton,
  Paper
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Policy } from '@/types/policy';
import { formatCurrency } from '@/lib/formatters';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface PolicyGridProps {
  policies: Policy[];
  loading: boolean;
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onToggleStar?: (id: string, star: boolean) => void;
  onToggleArchive?: (id: string, archive: boolean) => void;
  onRenew: (policy: Policy) => void;
  onNewPolicy: () => void;
}

const PolicyGrid: React.FC<PolicyGridProps> = ({
  policies,
  loading,
  onView,
  onEdit,
  onRenew,
  onNewPolicy
}) => {
  const theme = useTheme();

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
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={200}
              sx={{ borderRadius: '16px' }}
            />
          ))}
        </Box>
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
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }
        }}
      >
        <AnimatePresence>
          {policies.map((policy) => {
            const expirationStatus = getExpirationStatus(policy.endDate.toDate());
            return (
              <motion.div
                key={policy.id}
                layout // Added for smoother animation with AnimatePresence
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&::after': policy.isStarred ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      borderWidth: '0 40px 40px 0',
                      borderColor: `transparent ${alpha(theme.palette.warning.main, 0.8)} transparent transparent`,
                      zIndex: 1,
                    } : {},
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {/* Header */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          fontFamily="Sora, sans-serif"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {policy.policyNumber}
                        </Typography>
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
                      </Stack>
                      {/* Cliente y tipo */}
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {policy.customerName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {policy.type} - {policy.company}
                        </Typography>
                      </Box>
                      {/* Prima y fechas */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Prima
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={700}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            {formatCurrency(policy.premium)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', textAlign: 'right' }}
                          >
                            Vencimiento
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ color: expirationStatus.color }}
                            >
                              {format(policy.endDate.toDate(), 'dd MMM yyyy', { locale: es })}
                            </Typography>
                            <Tooltip title={expirationStatus.text}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: expirationStatus.color,
                                }}
                              />
                            </Tooltip>
                          </Stack>
                        </Box>
                      </Stack>
                      {/* Acciones */}
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        sx={{ mt: 1 }}
                      >
                        {policy.status === 'expired' && (
                          <Tooltip title="Renovar póliza">
                            <IconButton
                              size="small"
                              onClick={() => onRenew(policy)}
                              sx={{
                                color: theme.palette.warning.main,
                                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.warning.main, 0.2),
                                }
                              }}
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => onView(policy)}
                            sx={{
                              color: theme.palette.primary.main,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
                            onClick={() => onEdit(policy)}
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
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {/* Tarjeta para agregar nueva póliza */}
        <motion.div
          layout // Added for smoother animation with AnimatePresence
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: policies.length > 0 ? 0 : 0.2 }} // Delay only if no policies
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card
            elevation={0}
            onClick={onNewPolicy}
            sx={{
              height: '100%',
              minHeight: 200, // Ensure it has a minimum height
              borderRadius: '16px',
              background: alpha(theme.palette.primary.main, 0.05),
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
                borderColor: alpha(theme.palette.primary.main, 0.5),
              }
            }}
          >
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: theme.palette.primary.main,
                  }}
                >
                  <AddIcon />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  fontWeight={600}
                  fontFamily="Sora, sans-serif"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Nueva Póliza
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                  fontFamily="Inter, sans-serif"
                >
                  Haz clic para crear una nueva póliza
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default PolicyGrid;