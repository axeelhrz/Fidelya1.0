import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Edit,
  Save,
  Cancel,
  Psychology,
  Notes,
  Person,
  Schedule,
  ExpandMore,
  Refresh,
  Download,
  Attachment,
} from '@mui/icons-material';
import { Session } from '../../../types/session';
import { useSessionActions } from '../../../hooks/useSessionActions';
import StatusBadge from '../../ui/StatusBadge';
import EmotionalStateIcon from '../../ui/EmotionalStateIcon';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SessionDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  onSessionUpdate?: () => void;
}

const SessionDetailDrawer: React.FC<SessionDetailDrawerProps> = ({
  open,
  onClose,
  session,
  onSessionUpdate,
}) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [processingAI, setProcessingAI] = useState(false);

  const { updateSession, analyzeSessionWithAI, loading, error } = useSessionActions();

  React.useEffect(() => {
    if (session) {
      setNotes(session.notes || '');
    }
  }, [session]);

  const handleSaveNotes = async () => {
    if (!session) return;

    const success = await updateSession(session.id, { notes });
    if (success) {
      setEditingNotes(false);
      onSessionUpdate?.();
    }
  };

  const handleCancelEdit = () => {
    setNotes(session?.notes || '');
    setEditingNotes(false);
  };

  const handleReprocessAI = async () => {
    if (!session || !session.notes) return;

    setProcessingAI(true);
    try {
      const analysis = await analyzeSessionWithAI(session.notes, session.consultationReason);
      if (analysis) {
        await updateSession(session.id, {
          summary: analysis.summary,
          recommendation: analysis.recommendation,
          emotionalTonePost: analysis.emotionalTone,
        });
        onSessionUpdate?.();
      }
    } finally {
      setProcessingAI(false);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, 'EEEE, d MMMM yyyy • HH:mm', { locale: es });
    } catch {
      return `${date} • ${time}`;
    }
  };

  if (!session) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600, md: 700 },
          borderRadius: { xs: 0, sm: '16px 0 0 16px' },
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" fontWeight={600} color="primary.main">
              Detalle de Sesión
            </Typography>
            <IconButton onClick={onClose} size="large">
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {session.patientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(session.date, session.time)}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusBadge status={session.status} />
            <Chip 
              label={`${session.duration} minutos`} 
              size="small" 
              icon={<Schedule />}
              variant="outlined"
            />
            {session.summary && (
              <Chip 
                label="Con resumen IA" 
                size="small" 
                color="info"
                icon={<Psychology />}
                variant="outlined"
              />
            )}
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Información básica */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="primary" />
                  Información de la Sesión
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha</Typography>
                    <Typography variant="body1">{session.date}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Hora</Typography>
                    <Typography variant="body1">{session.time}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Duración</Typography>
                    <Typography variant="body1">{session.duration} minutos</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estado</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusBadge status={session.status} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Estados emocionales */}
            {(session.emotionalTonePre || session.emotionalTonePost) && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Psychology color="primary" />
                    Estados Emocionales
                  </Typography>
                  
                  <Stack direction="row" spacing={3} alignItems="center">
                    {session.emotionalTonePre && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Estado Inicial
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <EmotionalStateIcon 
                            state={session.emotionalTonePre} 
                            size="large" 
                            showLabel 
                          />
                        </Box>
                      </Box>
                    )}
                    
                    {session.emotionalTonePre && session.emotionalTonePost && (
                      <Typography variant="h4" color="text.secondary">→</Typography>
                    )}
                    
                    {session.emotionalTonePost && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Estado Final
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <EmotionalStateIcon 
                            state={session.emotionalTonePost} 
                            size="large" 
                            showLabel 
                          />
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Motivo de consulta */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Motivo de Consulta
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {session.consultationReason}
                </Typography>
              </CardContent>
            </Card>

            {/* Notas clínicas */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Notes color="primary" />
                    Notas Clínicas
                  </Typography>
                  
                  {!editingNotes ? (
                    <Button
                      startIcon={<Edit />}
                      onClick={() => setEditingNotes(true)}
                      size="small"
                      variant="outlined"
                    >
                      Editar
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<Save />}
                        onClick={handleSaveNotes}
                        size="small"
                        variant="contained"
                        disabled={loading}
                      >
                        Guardar
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                        size="small"
                        variant="outlined"
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  )}
                </Box>

                {editingNotes ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribir notas clínicas..."
                    disabled={loading}
                  />
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      minHeight: '100px',
                      p: 2,
                      backgroundColor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    {session.notes || 'No hay notas registradas para esta sesión.'}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Análisis IA */}
            <Accordion defaultExpanded={Boolean(session.summary)}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology color="primary" />
                  Análisis con IA
                  {processingAI && <CircularProgress size={16} />}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {session.notes && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        startIcon={processingAI ? <CircularProgress size={16} /> : <Refresh />}
                        onClick={handleReprocessAI}
                        disabled={processingAI || loading}
                        variant="outlined"
                        size="small"
                      >
                        {processingAI ? 'Procesando...' : 'Reprocesar con IA'}
                      </Button>
                    </Box>
                  )}

                  {session.summary ? (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Resumen de la Sesión
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'info.50', 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'info.200'
                        }}
                      >
                        {session.summary}
                      </Typography>
                    </Box>
                  ) : (
                    <Alert severity="info">
                      {session.notes 
                        ? 'Haz clic en "Reprocesar con IA" para generar un resumen automático.'
                        : 'Agrega notas clínicas para generar un resumen con IA.'
                      }
                    </Alert>
                  )}

                  {session.recommendation && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Recomendaciones Clínicas
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'success.50', 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'success.200'
                        }}
                      >
                        {session.recommendation}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Archivos adjuntos */}
            {session.attachments && session.attachments.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Attachment color="primary" />
                    Archivos Adjuntos
                  </Typography>
                  
                  <Stack spacing={1}>
                    {session.attachments.map((attachment, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 1,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="body2">{attachment}</Typography>
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Metadatos */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  Información Técnica
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">ID de Sesión</Typography>
                    <Typography variant="body2" fontFamily="monospace">{session.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">ID del Paciente</Typography>
                    <Typography variant="body2" fontFamily="monospace">{session.patientId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">ID del Profesional</Typography>
                    <Typography variant="body2" fontFamily="monospace">{session.professionalId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de Creación</Typography>
                    <Typography variant="body2">
                      {format(session.createdAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Última Modificación</Typography>
                    <Typography variant="body2">
                      {format(session.updatedAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>

        {/* Footer con acciones */}
        <Box sx={{ 
          p: 3, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          backgroundColor: 'grey.50'
        }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Cerrar
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                // Implementar exportación individual
                console.log('Exportar sesión:', session.id);
              }}
            >
              Exportar Sesión
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SessionDetailDrawer;