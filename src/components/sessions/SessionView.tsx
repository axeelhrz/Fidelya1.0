'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  Notes as NotesIcon,
  SmartToy as SmartToyIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  NextPlan as NextPlanIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { 
  Session, 
  SESSION_STATUS_LABELS, 
  SESSION_TYPE_LABELS, 
  EMOTIONAL_TONE_COLORS,
  RISK_LEVEL_COLORS,
  RISK_LEVEL_LABELS
} from '@/types/session';
import { Patient } from '@/types/patient';
import { User } from '@/types/auth';
import { AIUtils } from '@/services/aiService';
import { useRole } from '@/hooks/useRole';

interface SessionViewProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  patient?: Patient | null;
  professional?: User | null;
  onEdit?: () => void;
  onReprocessAI?: () => void;
  aiProcessing?: boolean;
}

export default function SessionView({
  open,
  onClose,
  session,
  patient,
  professional,
  onEdit,
  onReprocessAI,
  aiProcessing = false
}: SessionViewProps) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'notes', 'ai']);
  
  const { hasPermission } = useRole();

  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!session) return null;

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'cancelled': return 'error';
      case 'no-show': return 'warning';
      case 'rescheduled': return 'secondary';
      default: return 'default';
    }
  };

  const getRiskLevelSeverity = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'info';
    }
  };

  const getPatientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '90vh',
          borderRadius: 'xl',
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Paper 
          sx={{ 
            p: 4,
            borderRadius: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
            color: theme.palette.primary.contrastText,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'xl',
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PsychologyIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Sesión Clínica
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mt: 0.5 }}>
                  {format(new Date(session.date), 'dd/MM/yyyy - HH:mm', { locale: es })}
                </Typography>
                <Stack direction="row" spacing={2} mt={1}>
                  <Chip
                    label={SESSION_TYPE_LABELS[session.type]}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.common.white, 0.2),
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      borderRadius: 'xl',
                    }}
                  />
                  <Chip
                    label={SESSION_STATUS_LABELS[session.status]}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.common.white, 0.2),
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      borderRadius: 'xl',
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              {hasPermission('canManagePatients') && (
                <Tooltip title="Editar sesión">
                  <IconButton 
                    onClick={onEdit} 
                    sx={{ 
                      color: theme.palette.primary.contrastText,
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {session.aiAnalysis && onReprocessAI && (
                <Tooltip title="Reprocesar análisis de IA">
                  <IconButton 
                    onClick={onReprocessAI} 
                    disabled={aiProcessing}
                    sx={{ 
                      color: theme.palette.primary.contrastText,
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton 
                onClick={onClose}
                sx={{ 
                  color: theme.palette.primary.contrastText,
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* ... resto del contenido sin cambios ... */}
        <Stack spacing={0}>
          {/* Información básica */}
          <Accordion 
            expanded={expandedSections.includes('basic')}
            onChange={() => handleSectionToggle('basic')}
            sx={{ 
              boxShadow: 'none',
              '&:before': { display: 'none' },
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                px: 4, 
                py: 3,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                  }}
                >
                  <ScheduleIcon />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Información Básica
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 4, pb: 4 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3,
                  '& > *': {
                    flex: '1 1 400px',
                    minWidth: '400px'
                  }
                }}
              >
                {/* Información del paciente */}
                <Card 
                  variant="outlined"
                  sx={{
                    borderRadius: 'xl',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.success.main, 0.01)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                      <PersonIcon sx={{ color: theme.palette.success.main }} />
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        Paciente
                      </Typography>
                    </Stack>
                    {patient ? (
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar 
                            sx={{ 
                              width: 56, 
                              height: 56,
                              bgcolor: theme.palette.success.main,
                              fontSize: '1.25rem',
                              fontWeight: 700,
                            }}
                          >
                            {getPatientInitials(patient.fullName)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {patient.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {patient.age} años • {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Estado emocional actual:
                          </Typography>
                          <Chip 
                            label={patient.emotionalState}
                            size="small"
                            sx={{ 
                              borderRadius: 'xl',
                              bgcolor: EMOTIONAL_TONE_COLORS[patient.emotionalState],
                              color: theme.palette.common.white,
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Motivo de consulta:
                          </Typography>
                          <Typography variant="body2">
                            {patient.motivoConsulta}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Información del paciente no disponible
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Información del profesional */}
                <Card 
                  variant="outlined"
                  sx={{
                    borderRadius: 'xl',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                      <PsychologyIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        Profesional
                      </Typography>
                    </Stack>
                    {professional ? (
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar 
                            sx={{ 
                              width: 56, 
                              height: 56,
                              bgcolor: theme.palette.primary.main,
                              fontSize: '1.25rem',
                              fontWeight: 700,
                            }}
                          >
                            {getPatientInitials(professional.displayName || professional.email)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {professional.displayName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {professional.specialization || 'Psicólogo/a'}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Contacto:
                          </Typography>
                          <Typography variant="body2">
                            {professional.email}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Información del profesional no disponible
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Detalles de la sesión */}
              <Box mt={3}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Detalles de la Sesión
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
                    <Chip
                      label={SESSION_TYPE_LABELS[session.type]}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 'xl' }}
                    />
                    <Chip
                      label={SESSION_STATUS_LABELS[session.status]}
                      color={getStatusColor(session.status) as 'success' | 'info' | 'error' | 'warning' | 'secondary' | 'default'}
                      variant="outlined"
                      sx={{ borderRadius: 'xl' }}
                    />
                    {session.duration && (
                      <Chip
                        label={`${session.duration} minutos`}
                        variant="outlined"
                        sx={{ borderRadius: 'xl' }}
                      />
                    )}
                  </Stack>
                </Paper>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Notas clínicas */}
          <Accordion 
            expanded={expandedSections.includes('notes')}
            onChange={() => handleSectionToggle('notes')}
            sx={{ 
              boxShadow: 'none',
              '&:before': { display: 'none' },
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                px: 4, 
                py: 3,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                  }}
                >
                  <NotesIcon />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Notas Clínicas
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 4, pb: 4 }}>
              <Stack spacing={3}>
                {/* Notas principales */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.grey[50], 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Notas de la Sesión
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {session.notes}
                  </Typography>
                </Paper>

                {/* Información adicional en grid */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    '& > *': {
                      flex: '1 1 300px',
                      minWidth: '300px'
                    }
                  }}
                >
                  {session.observations && (
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 'xl',
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        bgcolor: alpha(theme.palette.info.main, 0.02),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <AssessmentIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="info.main">
                          Observaciones Adicionales
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {session.observations}
                      </Typography>
                    </Paper>
                  )}

                  {session.interventions && (
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 'xl',
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                        bgcolor: alpha(theme.palette.warning.main, 0.02),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <InsightsIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="warning.main">
                          Intervenciones Realizadas
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {session.interventions}
                      </Typography>
                    </Paper>
                  )}

                  {session.homework && (
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 'xl',
                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                        bgcolor: alpha(theme.palette.secondary.main, 0.02),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <AssignmentIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="secondary.main">
                          Tareas para Casa
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {session.homework}
                      </Typography>
                    </Paper>
                  )}

                  {session.nextSessionPlan && (
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 'xl',
                        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        bgcolor: alpha(theme.palette.success.main, 0.02),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <NextPlanIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="success.main">
                          Plan para Próxima Sesión
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {session.nextSessionPlan}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Análisis de IA */}
          {(session.aiAnalysis || session.aiProcessingStatus === 'processing' || aiProcessing) && (
            <Accordion 
              expanded={expandedSections.includes('ai')}
              onChange={() => handleSectionToggle('ai')}
              sx={{ 
                boxShadow: 'none',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  px: 4, 
                  py: 3,
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center'
                  }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 'xl',
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <SmartToyIcon />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Análisis de Inteligencia Artificial
                  </Typography>
                  {(session.aiProcessingStatus === 'processing' || aiProcessing) && (
                    <Chip 
                      label="Procesando..." 
                      color="warning" 
                      size="small" 
                      sx={{ borderRadius: 'xl' }}
                    />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 4, pb: 4 }}>
                {(session.aiProcessingStatus === 'processing' || aiProcessing) ? (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      borderRadius: 'xl',
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="body2" fontWeight={600}>
                        El análisis de IA está siendo procesado...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Esto puede tomar unos momentos. El análisis se guardará automáticamente una vez completado.
                      </Typography>
                      <LinearProgress 
                        sx={{ 
                          borderRadius: 'xl',
                          height: 6,
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 'xl',
                          }
                        }} 
                      />
                    </Stack>
                  </Alert>
                ) : session.aiAnalysis ? (
                  <Stack spacing={3}>
                    {/* Resumen principal */}
                    <Paper 
                      sx={{ 
                        p: 4, 
                        borderRadius: 'xl',
                        background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                        Resumen Automático
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {session.aiAnalysis.summary}
                      </Typography>
                    </Paper>

                    {/* Métricas principales */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        '& > *': {
                          flex: '1 1 280px',
                          minWidth: '280px'
                        }
                      }}
                    >
                      <Card 
                        variant="outlined"
                        sx={{
                          borderRadius: 'xl',
                          background: `linear-gradient(145deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.success.main, 0.01)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: EMOTIONAL_TONE_COLORS[session.aiAnalysis.emotionalTone],
                              }}
                            />
                            <Typography variant="subtitle2" fontWeight={600}>
                              Estado Emocional
                            </Typography>
                          </Stack>
                          <Typography variant="h5" fontWeight={700} color="success.main">
                            {session.aiAnalysis.emotionalTone}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card 
                        variant="outlined"
                        sx={{
                          borderRadius: 'xl',
                          background: `linear-gradient(145deg, ${alpha(theme.palette.warning.main, 0.02)} 0%, ${alpha(theme.palette.warning.main, 0.01)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <WarningIcon sx={{ color: RISK_LEVEL_COLORS[session.aiAnalysis.riskLevel], fontSize: 20 }} />
                            <Typography variant="subtitle2" fontWeight={600}>
                              Nivel de Riesgo
                            </Typography>
                          </Stack>
                          <Chip
                            label={RISK_LEVEL_LABELS[session.aiAnalysis.riskLevel]}
                            color={getRiskLevelSeverity(session.aiAnalysis.riskLevel) as 'success' | 'warning' | 'error' | 'info'}
                            variant="outlined"
                            sx={{ borderRadius: 'xl', fontWeight: 600 }}
                          />
                        </CardContent>
                      </Card>

                      <Card 
                        variant="outlined"
                        sx={{
                          borderRadius: 'xl',
                          background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.02)} 0%, ${alpha(theme.palette.info.main, 0.01)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <TrendingUpIcon color="primary" />
                            <Typography variant="subtitle2" fontWeight={600}>
                              Confianza del Análisis
                            </Typography>
                          </Stack>
                          <Typography variant="h5" fontWeight={700} color="info.main" gutterBottom>
                            {AIUtils.formatConfidence(session.aiAnalysis.confidence)}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={session.aiAnalysis.confidence * 100}
                            sx={{ 
                              borderRadius: 'xl',
                              height: 8,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 'xl',
                                background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.7)} 100%)`,
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Insights y Recomendaciones */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        '& > *': {
                          flex: '1 1 400px',
                          minWidth: '400px'
                        }
                      }}
                    >
                      {/* Insights clave */}
                      {session.aiAnalysis.keyInsights.length > 0 && (
                        <Card 
                          variant="outlined"
                          sx={{
                            borderRadius: 'xl',
                            background: `linear-gradient(145deg, ${alpha(theme.palette.secondary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.01)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                              <LightbulbIcon sx={{ color: theme.palette.secondary.main }} />
                              <Typography variant="h6" fontWeight={600} color="secondary.main">
                                Insights Clave
                              </Typography>
                            </Stack>
                            <List dense>
                              {session.aiAnalysis.keyInsights.map((insight, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 24 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.secondary.main,
                                      }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={insight}
                                    primaryTypographyProps={{
                                      variant: 'body2',
                                      sx: { lineHeight: 1.6 }
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      )}

                      {/* Recomendaciones */}
                      <Card 
                        variant="outlined"
                        sx={{
                          borderRadius: 'xl',
                          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                            <AssignmentIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight={600} color="primary.main">
                              Recomendación para Próxima Sesión
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                            {session.aiAnalysis.recommendation}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Intervenciones sugeridas */}
                    {session.aiAnalysis.suggestedInterventions.length > 0 && (
                      <Card 
                        variant="outlined"
                        sx={{
                          borderRadius: 'xl',
                          background: `linear-gradient(145deg, ${alpha(theme.palette.warning.main, 0.02)} 0%, ${alpha(theme.palette.warning.main, 0.01)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                            <NextPlanIcon sx={{ color: theme.palette.warning.main }} />
                            <Typography variant="h6" fontWeight={600} color="warning.main">
                              Intervenciones Sugeridas
                            </Typography>
                          </Stack>
                          <List dense>
                            {session.aiAnalysis.suggestedInterventions.map((intervention, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      bgcolor: theme.palette.warning.main,
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={intervention}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    sx: { lineHeight: 1.6 }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    )}

                    {/* Información del análisis */}
                    <Alert 
                      severity="info" 
                      sx={{ 
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Análisis generado:</strong> {format(new Date(session.aiAnalysis.generatedAt), 'dd/MM/yyyy HH:mm', { locale: es })} 
                        usando {session.aiAnalysis.processedBy}
                        {AIUtils.needsHumanReview(session.aiAnalysis) && (
                          <> • <strong style={{ color: theme.palette.warning.main }}>Requiere revisión humana</strong></>
                        )}
                      </Typography>
                    </Alert>
                  </Stack>
                ) : (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      borderRadius: 'xl',
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
                    }}
                  >
                    No hay análisis de IA disponible para esta sesión.
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>
          )}
        </Stack>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 4, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: 'blur(20px)',
        }}
      >
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: 'xl', 
            px: 4,
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
