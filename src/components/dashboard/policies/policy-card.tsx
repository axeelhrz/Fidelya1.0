'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  Box,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';
import { formatCurrency } from '@/lib/formatters';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface PolicyCardProps {
  policy: Policy;
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onToggleStar: (id: string, star: boolean) => void;
  onRenew: (policy: Policy) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onView,
  onEdit,
  onToggleStar,
  onRenew
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

  const getExpirationStatus = () => {
    const daysToExpiration = differenceInDays(policy.endDate.toDate(), new Date());
    
    if (daysToExpiration < 0) {
      return { color: theme.palette.error.main, text: `Vencida hace ${Math.abs(daysToExpiration)} días` };
    } else if (daysToExpiration === 0) {
      return { color: theme.palette.error.main, text: 'Vence hoy' };
    } else if (daysToExpiration <= 30) {
      return { color: theme.palette.warning.main, text: `Vence en ${daysToExpiration} días` };
    } else {
      return { color: theme.palette.success.main, text: `Vence en ${daysToExpiration} días` };
    }
  };

  const expirationStatus = getExpirationStatus();

  return (
    <motion.div
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
                <Stack direction="row" spacing={0.5} alignItems="center">
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
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(policy.id, !policy.isStarred);
                }}
                sx={{ 
                  color: policy.isStarred ? theme.palette.warning.main : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  }
                }}
              >
                {policy.isStarred ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              
              <Stack direction="row" spacing={1}>
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
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PolicyCard;