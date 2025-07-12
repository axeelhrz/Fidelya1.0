import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Person,
  Notes,
  Visibility,
  PlayArrow,
  Stop,
  Edit,
} from '@mui/icons-material';
import { Session } from '../../../types/session';
import StatusBadge from '../../ui/StatusBadge';
import EmotionalStateIcon from '../../ui/EmotionalStateIcon';

interface SessionCardProps {
  session: Session;
  onViewDetails: (session: Session) => void;
  onEditNotes: (session: Session) => void;
  onChangeStatus: (session: Session, status: Session['status']) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onViewDetails,
  onEditNotes,
  onChangeStatus,
}) => {
  const getNextStatus = (currentStatus: Session['status']): Session['status'] | null => {
    switch (currentStatus) {
      case 'pendiente':
      case 'confirmada':
        return 'en_curso';
      case 'en_curso':
        return 'finalizada';
      default:
        return null;
    }
  };

  const getStatusActionIcon = (status: Session['status']) => {
    switch (status) {
      case 'pendiente':
      case 'confirmada':
        return <PlayArrow />;
      case 'en_curso':
        return <Stop />;
      default:
        return null;
    }
  };

  const getStatusActionLabel = (status: Session['status']) => {
    switch (status) {
      case 'pendiente':
      case 'confirmada':
        return 'Iniciar sesión';
      case 'en_curso':
        return 'Finalizar sesión';
      default:
        return '';
    }
  };

  const nextStatus = getNextStatus(session.status);

  return (
    <Card
      sx={{
        mb: 2,
        border: session.status === 'en_curso' ? '2px solid' : '1px solid',
        borderColor: session.status === 'en_curso' ? 'warning.main' : 'divider',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6" component="h3">
                  {session.patientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {session.time} • {session.duration} min
                </Typography>
              </Box>
            </Box>
            <StatusBadge status={session.status} />
          </Box>

          {/* Content */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Motivo de consulta:
            </Typography>
            <Typography variant="body1">
              {session.consultationReason.length > 100
                ? `${session.consultationReason.substring(0, 100)}...`
                : session.consultationReason}
            </Typography>
          </Box>

          {/* Emotional States */}
          {(session.emotionalTonePre || session.emotionalTonePost) && (
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                {session.emotionalTonePre && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Estado inicial:
                    </Typography>
                    <EmotionalStateIcon state={session.emotionalTonePre} showLabel />
                  </Box>
                )}
                {session.emotionalTonePost && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Estado final:
                    </Typography>
                    <EmotionalStateIcon state={session.emotionalTonePost} showLabel />
                  </Box>
                )}
              </Stack>
            </Box>
          )}

          {/* Notes indicator */}
          {session.notes && (
            <Chip
              icon={<Notes />}
              label="Tiene notas clínicas"
              size="small"
              variant="outlined"
              color="info"
            />
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="Ver detalles">
              <IconButton onClick={() => onViewDetails(session)} size="small">
                <Visibility />
              </IconButton>
            </Tooltip>

            <Tooltip title="Editar notas">
              <IconButton onClick={() => onEditNotes(session)} size="small">
                <Edit />
              </IconButton>
            </Tooltip>

            {nextStatus && (
              <Tooltip title={getStatusActionLabel(session.status)}>
                <IconButton
                  onClick={() => onChangeStatus(session, nextStatus)}
                  size="small"
                  color={session.status === 'en_curso' ? 'success' : 'primary'}
                >
                  {getStatusActionIcon(session.status)}
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
