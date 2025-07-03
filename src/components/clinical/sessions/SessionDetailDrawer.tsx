import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Button,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Close,
  Person,
  Schedule,
  Notes,
  Psychology,
  Description,
  Edit,
  Download,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Session } from '../../../types/session';
import StatusBadge from '../../ui/StatusBadge';
import EmotionalStateIcon from '../../ui/EmotionalStateIcon';

interface SessionDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  onEdit: (session: Session) => void;
}

const SessionDetailDrawer: React.FC<SessionDetailDrawerProps> = ({
  open,
  onClose,
  session,
  onEdit,
}) => {
  if (!session) return null;

  const sessionDate = new Date(`${session.date}T${session.time}`);

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Export session to PDF:', session.id);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 480 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Detalle de Sesión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(sessionDate, "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
              </Typography>
            </Box>
            <IconButton onClick={onClose} edge="end">
              <Close />
            </IconButton>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Stack spacing={3}>
            {/* Patient Info */}
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6">{session.patientName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paciente
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <StatusBadge status={session.status} />
                <Chip
                  icon={<Schedule />}
                  label={`${session.duration} min`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Paper>

            {/* Session Details */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule />
                Información de la Sesión
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Motivo de Consulta
                  </Typography>
                  <Typography variant="body1">
                    {session.consultationReason}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha y Hora
                  </Typography>
                  <Typography variant="body1">
                    {format(sessionDate, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duración
                  </Typography>
                  <Typography variant="body1">
                    {session.duration} minutos
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Emotional States */}
            {(session.emotionalTonePre || session.emotionalTonePost) && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology />
                  Estados Emocionales
                </Typography>
                
                <Stack spacing={2}>
                  {session.emotionalTonePre && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Estado Inicial
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmotionalStateIcon state={session.emotionalTonePre} showLabel />
                      </Box>
                    </Box>
                  )}

                  {session.emotionalTonePost && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Estado Final
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmotionalStateIcon state={session.emotionalTonePost} showLabel />
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}

            {/* Clinical Notes */}
            {session.notes && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notes />
                  Notas Clínicas
                </Typography>
                
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {session.notes}
                </Typography>
              </Paper>
            )}

            {/* AI Analysis */}
            {(session.summary || session.recommendation) && (
              <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology />
                  Análisis IA
                </Typography>
                
                <Stack spacing={2}>
                  {session.summary && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Resumen
                      </Typography>
                      <Typography variant="body2">
                        {session.summary}
                      </Typography>
                    </Box>
                  )}

                  {session.recommendation && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Recomendación
                      </Typography>
                      <Typography variant="body2">
                        {session.recommendation}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}

            {/* Attachments */}
            {session.attachments && session.attachments.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description />
                  Archivos Adjuntos
                </Typography>
                
                <Stack spacing={1}>
                  {session.attachments.map((attachment, index) => (
                    <Chip
                      key={index}
                      label={attachment}
                      icon={<Description />}
                      variant="outlined"
                      clickable
                      onClick={() => console.log('Download attachment:', attachment)}
                    />
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Metadata */}
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Información del Sistema
              </Typography>
              
              <Stack spacing={1}>
                <Typography variant="caption">
                  Creado: {format(session.createdAt, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                </Typography>
                <Typography variant="caption">
                  Última actualización: {format(session.updatedAt, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                </Typography>
                <Typography variant="caption">
                  ID de sesión: {session.id}
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEdit(session)}
              fullWidth
            >
              Editar Notas
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportPDF}
              fullWidth
            >
              Exportar PDF
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SessionDetailDrawer;
