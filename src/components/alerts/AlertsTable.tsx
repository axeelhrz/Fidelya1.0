'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Stack,
  Fade,
  Tooltip,
  useTheme,
  alpha,
  Grid,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Emergency as EmergencyIcon,
  Medication as MedicationIcon,
  Event as EventIcon,
  Psychology as PsychologyIcon,
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
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
}: AlertsTableProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlert, setSelectedAlert] = useState<ClinicalAlert | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, alert: ClinicalAlert) => {
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

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.fullName || 'Paciente no encontrado';
  };

  const getPatientInitials = (patientId: string) => {
    const name = getPatientName(patientId);
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getTypeIcon = (type: string) => {
    const iconProps = { 
      sx: { 
        fontSize: '1.2rem',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
      } 
    };
    
    switch (type) {
      case 'appointment':
        return <EventIcon {...iconProps} />;
      case 'medication':
        return <MedicationIcon {...iconProps} />;
      case 'followup':
        return <PsychologyIcon {...iconProps} />;
      case 'emergency':
        return <EmergencyIcon {...iconProps} />;
      default:
        return <SettingsIcon {...iconProps} />;
    }
  };

  const getUrgencyGradient = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)';
      case 'high':
        return 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)';
      case 'medium':
        return 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
      default:
        return 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active':
        return 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';
      case 'resolved':
        return 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
      case 'cancelled':
        return 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)';
      default:
        return 'linear-gradient(135deg, #757575 0%, #424242 100%)';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <AutoAwesomeIcon 
            sx={{ 
              fontSize: '4rem', 
              color: theme.palette.primary.main,
              opacity: 0.6,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }} 
          />
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}
        >
          No hay alertas activas
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
        >
          Las alertas aparecerán aquí cuando se creen o se activen automáticamente para el seguimiento de pacientes
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {alerts.map((alert, index) => (
          <Grid item xs={12} key={alert.id}>
            <Fade in timeout={300 + index * 100}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%)`,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: getUrgencyGradient(alert.urgency),
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    {/* Avatar del paciente */}
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
                      }}
                    >
                      {getPatientInitials(alert.patientId)}
                    </Avatar>

                    {/* Contenido principal */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {getPatientName(alert.patientId)}
                        </Typography>
                        
                        {alert.isAutoGenerated && (
                          <Chip
                            icon={<AutoAwesomeIcon sx={{ fontSize: '0.9rem' }} />}
                            label="IA"
                            size="small"
                            sx={{
                              background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 24,
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                        )}
                      </Box>

                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(alert.type)}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              color: theme.palette.text.secondary 
                            }}
                          >
                            {ALERT_TYPE_LABELS[alert.type]}
                          </Typography>
                        </Box>
                        
                        <AlertBadge urgency={alert.urgency} />
                        <AlertBadge status={alert.status} />
                      </Stack>

                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 2,
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          lineHeight: 1.5
                        }}
                      >
                        {alert.title}
                      </Typography>

                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {alert.description}
                      </Typography>

                      <Divider sx={{ my: 2, opacity: 0.3 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(alert.createdAt), 'dd MMM yyyy', { locale: es })}
                            </Typography>
                          </Box>
                          
                          {alert.scheduledFor && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(alert.scheduledFor), 'dd MMM HH:mm', { locale: es })}
                              </Typography>
                            </Box>
                          )}
                        </Stack>

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, alert)}
                          sx={{
                            background: alpha(theme.palette.action.hover, 0.5),
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              background: alpha(theme.palette.action.hover, 0.8),
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 2,
            minWidth: 180,
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedAlert?.status === 'active' && (
          <MenuItem 
            onClick={() => handleMenuAction(() => onEdit(selectedAlert!))}
            sx={{ 
              borderRadius: 1, 
              mx: 1, 
              my: 0.5,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <EditIcon sx={{ mr: 2, fontSize: '1.1rem', color: theme.palette.primary.main }} />
            <Typography variant="body2" fontWeight={500}>Editar</Typography>
          </MenuItem>
        )}
        
        {selectedAlert?.status === 'active' && (
          <MenuItem 
            onClick={() => handleMenuAction(() => onResolve(selectedAlert!.id))}
            sx={{ 
              borderRadius: 1, 
              mx: 1, 
              my: 0.5,
              '&:hover': {
                background: alpha(theme.palette.success.main, 0.1),
              }
            }}
          >
            <CheckIcon sx={{ mr: 2, fontSize: '1.1rem', color: theme.palette.success.main }} />
            <Typography variant="body2" fontWeight={500}>Resolver</Typography>
          </MenuItem>
        )}
        
        {selectedAlert?.status === 'active' && (
          <MenuItem 
            onClick={() => handleMenuAction(() => onCancel(selectedAlert!.id))}
            sx={{ 
              borderRadius: 1, 
              mx: 1, 
              my: 0.5,
              '&:hover': {
                background: alpha(theme.palette.warning.main, 0.1),
              }
            }}
          >
            <CancelIcon sx={{ mr: 2, fontSize: '1.1rem', color: theme.palette.warning.main }} />
            <Typography variant="body2" fontWeight={500}>Cancelar</Typography>
          </MenuItem>
        )}
        
        <MenuItem 
          onClick={() => handleMenuAction(() => onDelete(selectedAlert!.id))}
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            '&:hover': {
              background: alpha(theme.palette.error.main, 0.1),
            }
          }}
        >
          <DeleteIcon sx={{ mr: 2, fontSize: '1.1rem', color: theme.palette.error.main }} />
          <Typography variant="body2" fontWeight={500}>Eliminar</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}