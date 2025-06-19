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
  Person,
  MoreVert,
  CalendarToday,
  Psychology,
  TrendingUp,
  FiberManualRecord,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Patient {
  id: string;
  name: string;
  age: number;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'completed';
  riskLevel?: 'low' | 'medium' | 'high';
  lastSession?: Date;
}

interface RecentPatientsProps {
  patients: Patient[];
  loading?: boolean;
}

export default function RecentPatients({ patients, loading = false }: RecentPatientsProps) {
  const theme = useTheme();

  const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
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
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Person sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: '"Poppins", sans-serif' }}>
                Pacientes Recientes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Últimos registros
              </Typography>
            </Box>
          </Box>
          <IconButton 
            size="small"
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
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
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        ) : patients.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={6}
            sx={{
              background: alpha(theme.palette.primary.main, 0.02),
              borderRadius: 3,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Person sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
              Sin pacientes recientes
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Los nuevos pacientes aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {patients.map((patient, index) => (
              <Fade in timeout={600 + index * 100} key={patient.id}>
                <ListItem 
                  sx={{ 
                    px: 0, 
                    py: 2,
                    borderRadius: 3,
                    mb: 1,
                    background: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(8px)',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        background: `linear-gradient(135deg, ${getAvatarColor(patient.name)} 0%, ${alpha(getAvatarColor(patient.name), 0.8)} 100%)`,
                        width: 48,
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {patient.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="600" 
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {patient.name}
                        </Typography>
                        {patient.riskLevel && (
                          <FiberManualRecord
                            sx={{
                              fontSize: 12,
                              color: getRiskColor(patient.riskLevel),
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {patient.age} años
                        </Typography>
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <CalendarToday sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {format(patient.registrationDate, "dd/MM/yy", { locale: es })}
                          </Typography>
                        </Box>
                        {patient.lastSession && (
                          <Box display="flex" alignItems="center">
                            <Psychology sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Última: {format(patient.lastSession, "dd/MM", { locale: es })}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="end" 
                    gap={1}
                    sx={{ minWidth: 80 }}
                  >
                    <Chip
                      label={getStatusLabel(patient.status)}
                      size="small"
                      color={getStatusColor(patient.status)}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
                  </Box>
                </ListItem>
              </Fade>
            ))}
          </List>
        )}

        {/* Footer con estadísticas */}
        {patients.length > 0 && (
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
            <Box display="flex" alignItems="center">
              <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main, mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {patients.filter(p => p.status === 'active').length} activos
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Total: {patients.length}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}