'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import {
  Warning,
  Info,
  Error,
  CheckCircle,
  Close,
  AccessTime,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Alert {
  id: string;
  type: 'appointment' | 'medication' | 'follow-up' | 'emergency' | 'custom';
  urgency: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  createdAt: Date;
  patientName?: string;
}

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (alertId: string) => void;
  delay?: number;
}

export default function AlertCard({ alert, onDismiss, delay = 0 }: AlertCardProps) {
  const theme = useTheme();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <AccessTime />;
      case 'medication': return <Info />;
      case 'emergency': return <Error />;
      case 'follow-up': return <CheckCircle />;
      default: return <Warning />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return urgency;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'appointment': return 'Cita';
      case 'medication': return 'Medicación';
      case 'follow-up': return 'Seguimiento';
      case 'emergency': return 'Emergencia';
      case 'custom': return 'Personalizada';
      default: return type;
    }
  };

  return (
    <Fade in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          mb: 2,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          border: `1px solid ${alpha(getUrgencyColor(alert.urgency), 0.2)}`,
          borderLeft: `4px solid ${getUrgencyColor(alert.urgency)}`,
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: `0 4px 12px ${alpha(getUrgencyColor(alert.urgency), 0.15)}`,
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box display="flex" alignItems="flex-start" flexGrow={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: alpha(getUrgencyColor(alert.urgency), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getUrgencyColor(alert.urgency),
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                {getAlertIcon(alert.type)}
              </Box>
              
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="600"
                    sx={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    {alert.title}
                  </Typography>
                  <Chip
                    label={getUrgencyLabel(alert.urgency)}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getUrgencyColor(alert.urgency), 0.1),
                      color: getUrgencyColor(alert.urgency),
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 1, lineHeight: 1.5 }}
                >
                  {alert.description}
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={getTypeLabel(alert.type)}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: alpha(getUrgencyColor(alert.urgency), 0.3),
                      color: getUrgencyColor(alert.urgency),
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                  
                  {alert.patientName && (
                    <Typography variant="caption" color="text.secondary">
                      Paciente: {alert.patientName}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    {format(alert.createdAt, "dd 'de' MMM 'a las' HH:mm", { locale: es })}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {onDismiss && (
              <IconButton
                size="small"
                onClick={() => onDismiss(alert.id)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                  }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
