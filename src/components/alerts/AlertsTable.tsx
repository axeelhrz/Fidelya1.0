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
  Skeleton,
  Chip,
  Paper,
  Divider,
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
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  PersonOff as PersonOffIcon,
  NotificationsActive as NotificationsIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ClinicalAlert, 
  ALERT_TYPE_LABELS, 
  ALERT_TRIGGER_LABELS,
  ALERT_TYPE_COLORS,
  ALERT_URGENCY_COLORS,
} from '@/types/alert';
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
      initials: patient ? patient.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??',
      email: patient?.email || ''
    };
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      appointment: { icon: EventIcon, color: ALERT_TYPE_COLORS.appointment },
      medication: { icon: MedicationIcon, color: ALERT_TYPE_COLORS.medication },
      followup: { icon: PsychologyIcon, color: ALERT_TYPE_COLORS.followup },
      emergency: { icon: EmergencyIcon, color: ALERT_TYPE_COLORS.emergency },
      custom: { icon: SettingsIcon, color: ALERT_TYPE_COLORS.custom },
      síntoma: { icon: WarningIcon, color: ALERT_TYPE_COLORS.síntoma },
      fecha: { icon: ScheduleIcon, color: ALERT_TYPE_COLORS.fecha },
      inactividad: { icon: PersonOffIcon, color: ALERT_TYPE_COLORS.inactividad },
    };
    return configs[type as keyof typeof configs] || configs.custom;
  };

  const getTriggerIcon = (trigger: string) => {
    const icons = {
      manual: SettingsIcon,
      fecha_programada: ScheduleIcon,
      texto_IA: AutoAwesomeIcon,
      falta_sesión: PersonOffIcon,
    };
    return icons[trigger as keyof typeof icons] || SettingsIcon;
  };

  const getUrgencyColor = (urgency: string) => {
    return ALERT_URGENCY_COLORS[urgency as keyof typeof ALERT_URGENCY_COLORS] || ALERT_URGENCY_COLORS.media;
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rounded" width={80} height={28} />
                    <Skeleton variant="rounded" width={90} height={28} />
                    <Skeleton variant="rounded" width={70} height={28} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Empty state
  if (alerts.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 6, 
          textAlign: 'center', 
          minHeight: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Box>
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
            No hay alertas activas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las alertas clínicas aparecerán aquí cuando se activen automáticamente o se creen manualmente
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        {alerts.map((alert) => {
          const patientInfo = getPatientInfo(alert.patientId);
          const typeConfig = getTypeConfig(alert.type);
          const TypeIcon = typeConfig.icon;
          const TriggerIcon = getTriggerIcon(alert.trigger);
          const urgencyColor = getUrgencyColor(alert.urgency);

          return (
            <Card
              key={alert.id}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                borderRadius: 3,
                borderLeft: `6px solid ${urgencyColor}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
                ...(alert.status === 'activa' && {
                  bgcolor: alpha(urgencyColor, 0.02),
                }),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(typeConfig.color, 0.1),
                      color: typeConfig.color,
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    {patientInfo.initials}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '1.1rem'
                        }}
                      >
                        {alert.title}
                      </Typography>
                      {alert.autoGenerated && (
                        <Tooltip title="Alerta generada automáticamente">
                          <AutoAwesomeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {patientInfo.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TypeIcon sx={{ fontSize: 16, color: typeConfig.color }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {ALERT_TYPE_LABELS[alert.type]}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TriggerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {ALERT_TRIGGER_LABELS[alert.trigger]}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, alert)}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.primary"
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                      fontWeight: 400,
                    }}
                  >
                    {alert.description}
                  </Typography>
                  
                  {alert.notes && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: '-webkit-box',
                        mt: 1,
                        fontStyle: 'italic',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      Notas: {alert.notes}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Footer */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <AlertBadge urgency={alert.urgency} size="small" />
                    <AlertBadge status={alert.status} size="small" />
                    
                    {alert.notificationChannels.includes('whatsapp') && (
                      <Chip
                        icon={<WhatsAppIcon sx={{ fontSize: 14 }} />}
                        label="WhatsApp"
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 20,
                          fontSize: '0.7rem',
                          color: '#25D366',
                          borderColor: '#25D366'
                        }}
                      />
                    )}
                    
                    {alert.notificationChannels.includes('email') && (
                      <Chip
                        icon={<EmailIcon sx={{ fontSize: 14 }} />}
                        label="Email"
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 20,
                          fontSize: '0.7rem',
                          color: 'primary.main',
                          borderColor: 'primary.main'
                        }}
                      />
                    )}
                  </Stack>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {alert.scheduledFor && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {format(new Date(alert.scheduledFor), 'dd/MM/yy HH:mm', { locale: es })}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {formatDistanceToNow(new Date(alert.createdAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Metadata adicional para alertas automáticas */}
                {alert.autoGenerated && alert.metadata && (
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                      Información Automática:
                    </Typography>
                    
                    {alert.metadata.detectedKeywords && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Palabras clave: {alert.metadata.detectedKeywords.join(', ')}
                      </Typography>
                    )}
                    
                    {alert.metadata.aiConfidence && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Confianza IA: {(alert.metadata.aiConfidence * 100).toFixed(1)}%
                      </Typography>
                    )}
                    
                    {alert.metadata.daysSinceLastSession && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Días sin sesión: {alert.metadata.daysSinceLastSession}
                      </Typography>
                    )}
                    
                    {alert.sourceSessionId && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Sesión origen: {alert.sourceSessionId.substring(0, 8)}...
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Menu contextual optimizado */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 180,
            boxShadow: theme.shadows[12],
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 500,
              gap: 1.5,
            }
          }
        }}
      >
        {selectedAlert?.status === 'activa' && (
          <MenuItem onClick={() => handleMenuAction(() => onEdit(selectedAlert!))}>
            <EditIcon sx={{ fontSize: 18 }} />
            Editar Alerta
          </MenuItem>
        )}
        
        {selectedAlert?.status === 'activa' && (
          <MenuItem onClick={() => handleMenuAction(() => onResolve(selectedAlert!.id))}>
            <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />
            Marcar como Resuelta
          </MenuItem>
        )}
        
        {selectedAlert?.status === 'activa' && (
          <MenuItem onClick={() => handleMenuAction(() => onCancel(selectedAlert!.id))}>
            <CancelIcon sx={{ fontSize: 18, color: 'warning.main' }} />
            Cancelar Alerta
          </MenuItem>
        )}
        
        <MenuItem onClick={() => handleMenuAction(() => onDelete(selectedAlert!.id))}>
          <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
          Eliminar Permanentemente
        </MenuItem>
      </Menu>
    </>
  );
}
