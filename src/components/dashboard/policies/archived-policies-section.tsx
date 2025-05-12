'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack
} from '@mui/material';
import {
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';
import { formatCurrency } from '@/lib/formatters';

interface ArchivedPoliciesSectionProps {
  policies: Policy[];
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onToggleArchive: (id: string, archive: boolean) => void;
  onToggleStar: (id: string, star: boolean) => void;
}

const ArchivedPoliciesSection: React.FC<ArchivedPoliciesSectionProps> = ({
  policies,
  onView,
  onToggleArchive,
  onToggleStar
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  // Filtrar solo las pólizas archivadas
  const archivedPolicies = policies.filter(policy => policy.isArchived);
  
  // Si no hay pólizas archivadas, no mostrar la sección
  if (archivedPolicies.length === 0) {
    return null;
  }
  
  // Mostrar solo las primeras 5 pólizas si no está expandido
  const displayedPolicies = expanded ? archivedPolicies : archivedPolicies.slice(0, 5);
  
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          mb: 3,
          borderRadius: '16px',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6)
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArchiveIcon color="action" />
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
              >
                Pólizas Archivadas
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  ml: 1, 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '999px',
                  fontWeight: 600
                }}
              >
                {archivedPolicies.length}
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Collapse in={expanded || archivedPolicies.length <= 5}>
            <TableContainer>
              <Table size="small">
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
                    <TableCell>Número</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Compañía</TableCell>
                    <TableCell>Prima</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedPolicies.map((policy) => (
                    <TableRow 
                      key={policy.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          cursor: 'pointer',
                        },
                        '& td': {
                          fontFamily: 'Inter, sans-serif',
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        },
                        backgroundColor: policy.isStarred 
                          ? alpha(theme.palette.warning.main, 0.05)
                          : 'transparent',
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
                            color: policy.isStarred 
                              ? theme.palette.warning.main 
                              : theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.warning.main, 0.1),
                            }
                          }}
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
                          <Tooltip title="Desarchivar">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleArchive(policy.id, false);
                              }}
                              sx={{ 
                                color: theme.palette.grey[600],
                                backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.grey[500], 0.2),
                                }
                              }}
                            >
                              <UnarchiveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
          
          {!expanded && archivedPolicies.length > 5 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setExpanded(true)}
                startIcon={<ExpandMoreIcon />}
                sx={{ 
                  borderRadius: '999px',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Ver todas ({archivedPolicies.length})
              </Button>
            </Box>
          )}
          
          {expanded && archivedPolicies.length > 5 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setExpanded(false)}
                startIcon={<ExpandLessIcon />}
                sx={{ 
                  borderRadius: '999px',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Mostrar menos
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ArchivedPoliciesSection;