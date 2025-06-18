'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Grid,
  Skeleton,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Event as EventIcon,
  Medication as MedicationIcon,
  Psychology as PsychologyIcon,
  Emergency as EmergencyIcon,
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert as ClinicalAlert, ALERT_TYPE_LABELS } from '@/types/alert';
import { Patient } from '@/types/patient';
import AlertBadge from './AlertBadge';

interface AlertsTableProps {
  alerts: ClinicalAlert[];
  patients: Patient[];
  onEdit: (alert: ClinicalAlert) => void;
  onResolve: (alertId: string) => void;
  onCancel: (alertId: string) => void;
  onDelete: (alertId: string) => void;
  loading?: boolean;
}

export default function AlertsTable({
  alerts,
  patients,
  onEdit,
  onResolve,
  onCancel,
  onDelete,
  loading = false,
}: AlertsTableProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlert, setSelectedAlert] = useState<ClinicalAlert | null>(null);

  // Memoizar el mapa de pacientes para optimización
  const patientsMap = useMemo(() => {
    return patients.reduce((acc, patient) => {
      acc[patient.id] = patient;
      return acc;
    }, {} as Record<string, Patient>);
  }, [patients]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, alert: ClinicalAlert) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedAlert(alert);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAlert(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const getPatientInfo = (patientId: string) => {
    const patient = patientsMap[patientId];
    return {
      name: patient?.fullName || 'Paciente no encontrado',
      initials: patient ? patient.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'
    };
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      appointment: { icon: EventIcon, color: theme.palette.info.main, bg: alpha(theme.palette.info.main, 0.1) },
      medication: { icon: MedicationIcon, color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) },
      followup: { icon: PsychologyIcon, color: theme.palette.primary.main, bg: alpha(theme.palette.primary.main, 0.1) },
      emergency: { icon: EmergencyIcon, color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) },
      custom: { icon: SettingsIcon, color: theme.palette.secondary.main, bg: alpha(theme.palette.secondary.main, 0.1) },
    };
    return configs[type as keyof typeof configs] || configs.custom;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
      critical: theme.palette.error.dark,
    };
    return colors[urgency as keyof typeof colors] || colors.medium;
  };

  // Loading skeleton
  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card sx={{ height: 180 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={70} height={24} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Empty state
  if (alerts.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <AutoAwesomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay alertas activas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las alertas aparecerán aquí cuando se activen
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {alerts.map((alert) => {
          const patientInfo = getPatientInfo(alert.patientId);
          const typeConfig = getTypeConfig(alert.type);
          const TypeIcon = typeConfig.icon;
          const urgencyColor = getUrgencyColor(alert.urgency);

          return (
            <Grid item xs={12} sm={6} lg={4} key={alert.id}>
              <Card
                sx={{
                  height: 180,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  borderLeft: `4px solid ${urgencyColor}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: typeConfig.bg,
                        color: typeConfig.color,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {patientInfo.initials}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {patientInfo.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <TypeIcon sx={{ fontSize: 14, color: typeConfig.color }} />
                        <Typography variant="caption" color="text.secondary">
                          {ALERT_TYPE_LABELS[alert.type]}
                        </Typography>
                        {alert.isAutoGenerated && (
                          <AutoAwesomeIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                        )}
                      </Box>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, alert)}
                      sx={{ 
                        width: 28, 
                        height: 28,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {alert.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                      }}
                    >
                      {alert.description}
                    </Typography>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={1}>
                      <AlertBadge urgency={alert.urgency} size="small" />
                      <AlertBadge status={alert.status} size="small" />
                    </Stack>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(alert.createdAt), 'dd/MM', { locale: es })}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Menu contextual optimizado */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: theme.shadows[8],
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              fontSize: '0.875rem',
            }
          }
        }}
      >
        {selectedAlert?.status === 'active' && (
          <MenuItem onClick={() => handleMenuAction(() => onEdit(selectedAlert!))}>
            <EditIcon sx={{ mr: 1.5, fontSize: 18 }} />
            Editar
          </MenuItem>
        )}
        
        {selectedAlert?.status === 'active' && (
          <MenuItem onClick={() => handleMenuAction(() => onResolve(selectedAlert!.id))}>
            <CheckIcon sx={{ mr: 1.5, fontSize: 18, color: 'success.main' }} />
            Resolver
          </MenuItem>
        )}
        
        {selectedAlert?.status === 'active' && (
          <MenuItem onClick={() => handleMenuAction(() => onCancel(selectedAlert!.id))}>
            <CancelIcon sx={{ mr: 1.5, fontSize: 18, color: 'warning.main' }} />
            Cancelar
          </MenuItem>
        )}
        
        <MenuItem onClick={() => handleMenuAction(() => onDelete(selectedAlert!.id))}>
          <DeleteIcon sx={{ mr: 1.5, fontSize: 18, color: 'error.main' }} />
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
}