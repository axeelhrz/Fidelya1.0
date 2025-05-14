'use client';
import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';
import { formatCurrency } from '@/lib/formatters';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const MotionTableRow = motion(TableRow);

interface PolicyRowProps {
  policy: Policy;
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onToggleStar: (id: string, star: boolean) => void;
}


const PolicyRow: React.FC<PolicyRowProps> = ({
  policy,
  onView,
  onEdit,
  onToggleStar
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
    <MotionTableRow
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ 
        backgroundColor: theme.palette.background.paper,
        transition: 'background-color 0.3s ease'
      }}
      whileHover={{ 
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        transition: { duration: 0.1 }
      }}
      sx={{
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          cursor: 'pointer',
        },
        '& td': {
          fontFamily: 'Inter, sans-serif',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }
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
          sx={{ color: theme.palette.warning.main }}
        >
          {policy.isStarred ? <StarIcon /> : <StarBorderIcon />}
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
      <TableCell>
        <Typography variant="body2">
          {policy.type}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {policy.company}
        </Typography>
      </TableCell>
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
        </Stack>
      </TableCell>
    </MotionTableRow>
  );
};

export default PolicyRow;