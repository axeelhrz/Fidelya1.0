'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Skeleton,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import {
  Psychology,
  MoreVert,
  AccessTime,
  AutoAwesome,
  Mood,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Session {
  id: string;
  patientName: string;
  date: Date;
  duration: number;
  type: string;
  aiSummary?: string;
  emotionalTone?: 'positive' | 'neutral' | 'negative';
  status: 'completed' | 'in-progress' | 'scheduled';
  hasAiAnalysis: boolean;
}

interface RecentSessionsProps {
  sessions: Session[];
  loading?: boolean;
}

export default function RecentSessions({ sessions, loading = false }: RecentSessionsProps) {
  const theme = useTheme();

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'scheduled': return 'info';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En progreso';
      case 'scheduled': return 'Programada';
      default: return status;
    }
  };

  const getEmotionalToneColor = (tone?: string) => {
    switch (tone) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      case 'neutral': return theme.palette.warning.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getEmotionalToneIcon = (tone?: string) => {
    switch (tone) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: 400,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.info.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Psychology sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: '"Poppins", sans-serif' }}>
                Sesiones Recientes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Con análisis de IA
              </Typography>
            </Box>
          </Box>
          <IconButton 
            size="small"
            sx={{
              background: alpha(theme.palette.secondary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.secondary.main, 0.2),
              }
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {loading ? (
          <Box>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} display="flex" alignItems="center" p={2} mb={1}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="70%" height={24} />
                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton variant="text" width="80%" height={16} />
                </Box>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        ) : sessions.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={6}
            sx={{
              background: alpha(theme.palette.secondary.main, 0.02),
              borderRadius: 3,
              border: `2px dashed ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: alpha(theme.palette.secondary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Psychology sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
            </Box>
            <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
              Sin sesiones recientes
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Las sesiones completadas aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sessions.map((session, index) => (
              <Fade in timeout={600 + index * 100} key={session.id}>
                <ListItem 
                  sx={{ 
                    px: 0, 
                    py: 2,
                    borderRadius: 3,
                    mb: 1,
                    background: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      background: alpha(theme.palette.secondary.main, 0.05),
                      transform: 'translateX(8px)',
                      borderColor: alpha(theme.palette.secondary.main, 0.2),
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        background: `linear-gradient(135deg, ${getAvatarColor(session.patientName)} 0%, ${alpha(getAvatarColor(session.patientName), 0.8)} 100%)`,
                        width: 48,
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {session.patientName.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ fontFamily: '"Inter", sans-serif' }}>
                          {session.patientName}
                        </Typography>
                        {session.hasAiAnalysis && (
                          <AutoAwesome sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {session.type}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                          <Box display="flex" alignItems="center">
                            <AccessTime sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {format(session.date, "dd/MM 'a las' HH:mm", { locale: es })}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {session.duration} min
                          </Typography>
                        </Box>
                        {session.aiSummary && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'block',
                              fontStyle: 'italic',
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            &ldquo;{session.aiSummary}&rdquo;
                          </Typography>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Box display="flex" flexDirection="column" alignItems="end" gap={1}>
                    <Chip
                      label={getStatusLabel(session.status)}
                      size="small"
                      color={getStatusColor(session.status)}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                    {session.emotionalTone && (
                      <Box 
                        display="flex" 
                        alignItems="center"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 2,
                          background: alpha(getEmotionalToneColor(session.emotionalTone), 0.1),
                        }}
                      >
                        <Typography variant="caption" sx={{ mr: 0.5 }}>
                          {getEmotionalToneIcon(session.emotionalTone)}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: getEmotionalToneColor(session.emotionalTone),
                            fontWeight: 500
                          }}
                        >
                          {session.emotionalTone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
              </Fade>
            ))}
          </List>
        )}

        {/* Footer con estadísticas */}
        {sessions.length > 0 && (
          <Box 
            sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center">
                <AutoAwesome sx={{ fontSize: 16, color: theme.palette.warning.main, mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {sessions.filter(s => s.hasAiAnalysis).length} con IA
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Mood sx={{ fontSize: 16, color: theme.palette.success.main, mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {sessions.filter(s => s.emotionalTone === 'positive').length} positivas
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Total: {sessions.length}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}