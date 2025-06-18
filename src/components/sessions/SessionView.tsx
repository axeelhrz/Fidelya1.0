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
  Divider,
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
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'notes']);
  
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <PsychologyIcon color="primary" />
            <Box>
              <Typography variant="h6">
                Sesión Clínica
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(session.date), 'dd/MM/yyyy - HH:mm', { locale: es })}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {hasPermission('canManagePatients') && (
              <Tooltip title="Editar sesión">
                <IconButton onClick={onEdit} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {session.aiAnalysis && onReprocessAI && (
              <Tooltip title="Reprocesar análisis de IA">
                <IconButton 
                  onClick={onReprocessAI} 
                  color="secondary"
                  disabled={aiProcessing}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Información básica */}
          <Accordion 
            expanded={expandedSections.includes('basic')}
            onChange={() => handleSectionToggle('basic')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon />
                <Typography variant="h6">Información Básica</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Paciente y Profesional */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    '& > *': {
                      flex: '1 1 300px',
                      minWidth: '300px'
                    }
                  }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <PersonIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          Paciente
                        </Typography>
                      </Box>
                      {patient ? (
                        <Box>
                          <Typography variant="h6">{patient.fullName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.age} años • {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}
                          </Typography>
                          <Chip 
                            label={patient.emotionalState}
                            size="small"
                            sx={{ 
                              mt: 1,
                              bgcolor: EMOTIONAL_TONE_COLORS[patient.emotionalState],
                              color: 'white'
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography color="text.secondary">
                          Información del paciente no disponible
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <PsychologyIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          Profesional
                        </Typography>
                      </Box>
                      {professional ? (
                        <Box>
                          <Typography variant="h6">{professional.displayName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {professional.specialization || 'Psicólogo/a'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {professional.email}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography color="text.secondary">
                          Información del profesional no disponible
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* Chips de información */}
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <Chip
                    label={SESSION_TYPE_LABELS[session.type]}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={SESSION_STATUS_LABELS[session.status]}
                    color={getStatusColor(session.status) as any}
                    variant="outlined"
                  />
                  {session.duration && (
                    <Chip
                      label={`${session.duration} minutos`}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Notas clínicas */}
          <Accordion 
            expanded={expandedSections.includes('notes')}
            onChange={() => handleSectionToggle('notes')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <NotesIcon />
                <Typography variant="h6">Notas Clínicas</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Notas principales */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notas de la Sesión
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {session.notes}
                  </Typography>
                </Paper>

                {/* Información adicional en dos columnas */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    '& > *': {
                      flex: '1 1 300px',
                      minWidth: '300px'
                    }
                  }}
                >
                  {session.observations && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Observaciones Adicionales
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {session.observations}
                      </Typography>
                    </Paper>
                  )}

                  {session.interventions && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Intervenciones Realizadas
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {session.interventions}
                      </Typography>
                    </Paper>
                  )}

                  {session.homework && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tareas para Casa
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {session.homework}
                      </Typography>
                    </Paper>
                  )}

                  {session.nextSessionPlan && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Plan para Próxima Sesión
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {session.nextSessionPlan}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Análisis de IA */}
          {(session.aiAnalysis || session.aiProcessingStatus === 'processing') && (
            <Accordion 
              expanded={expandedSections.includes('ai')}
              onChange={() => handleSectionToggle('ai')}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <SmartToyIcon />
                  <Typography variant="h6">Análisis de Inteligencia Artificial</Typography>
                  {session.aiProcessingStatus === 'processing' && (
                    <Chip label="Procesando..." color="warning" size="small" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {session.aiProcessingStatus === 'processing' || aiProcessing ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography>
                          El análisis de IA está siendo procesado. Esto puede tomar unos momentos...
                        </Typography>
                      </Box>
                    </Alert>
                    <LinearProgress />
                  </Box>
                ) : session.aiAnalysis ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Resumen */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Resumen Automático
                      </Typography>
                      <Typography variant="body1">
                        {session.aiAnalysis.summary}
                      </Typography>
                    </Paper>

                    {/* Métricas principales */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2,
                        '& > *': {
                          flex: '1 1 250px',
                          minWidth: '250px'
                        }
                      }}
                    >
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: EMOTIONAL_TONE_COLORS[session.aiAnalysis.emotionalTone],
                              }}
                            />
                            <Typography variant="subtitle2">Estado Emocional</Typography>
                          </Box>
                          <Typography variant="h6">
                            {session.aiAnalysis.emotionalTone}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <WarningIcon sx={{ color: RISK_LEVEL_COLORS[session.aiAnalysis.riskLevel] }} />
                            <Typography variant="subtitle2">Nivel de Riesgo</Typography>
                          </Box>
                          <Chip
                            label={RISK_LEVEL_LABELS[session.aiAnalysis.riskLevel]}
                            color={getRiskLevelSeverity(session.aiAnalysis.riskLevel) as any}
                            variant="outlined"
                          />
                        </CardContent>
                      </Card>

                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <TrendingUpIcon color="primary" />
                            <Typography variant="subtitle2">Confianza del Análisis</Typography>
                          </Box>
                          <Typography variant="h6">
                            {AIUtils.formatConfidence(session.aiAnalysis.confidence)}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={session.aiAnalysis.confidence * 100}
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Insights y Recomendaciones */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2,
                        '& > *': {
                          flex: '1 1 400px',
                          minWidth: '400px'
                        }
                      }}
                    >
                      {/* Insights clave */}
                      {session.aiAnalysis.keyInsights.length > 0 && (
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Insights Clave
                            </Typography>
                            <List dense>
                              {session.aiAnalysis.keyInsights.map((insight, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <Box
                                      sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                      }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary={insight} />
                                </ListItem>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      )}

                      {/* Recomendaciones */}
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Recomendación para Próxima Sesión
                          </Typography>
                          <Typography variant="body2">
                            {session.aiAnalysis.recommendation}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Intervenciones sugeridas */}
                    {session.aiAnalysis.suggestedInterventions.length > 0 && (
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            <NextPlanIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Intervenciones Sugeridas
                          </Typography>
                          <List dense>
                            {session.aiAnalysis.suggestedInterventions.map((intervention, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      bgcolor: 'secondary.main',
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText primary={intervention} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    )}

                    {/* Información del análisis */}
                    <Alert severity="info">
                      <Typography variant="body2">
                        Análisis generado el {format(new Date(session.aiAnalysis.generatedAt), 'dd/MM/yyyy HH:mm', { locale: es })} 
                        usando {session.aiAnalysis.processedBy}
                        {AIUtils.needsHumanReview(session.aiAnalysis) && (
                          <> • <strong>Requiere revisión humana</strong></>
                        )}
                      </Typography>
                    </Alert>
                  </Box>
                ) : (
                  <Alert severity="warning">
                    No hay análisis de IA disponible para esta sesión.
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
