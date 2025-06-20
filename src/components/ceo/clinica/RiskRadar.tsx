'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Warning,
  Phone,
  Assignment,
  Person,
  Close,
  Psychology,
  TrendingDown,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RiskRadarData } from '@/types/ceo';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface RiskRadarProps {
  data: RiskRadarData[];
}

export default function RiskRadar({ data }: RiskRadarProps) {
  const theme = useTheme();
  const [selectedPatient, setSelectedPatient] = useState<RiskRadarData | null>(null);

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'critico':
        return '#F44336';
      case 'alto':
        return '#FF9800';
      case 'medio':
        return '#2196F3';
      default:
        return '#4CAF50';
    }
  };

  const getRiskIcon = (tipo: string) => {
    switch (tipo) {
      case 'suicidio':
        return <Warning />;
      case 'phq_alto':
        return <Psychology />;
      case 'sin_progreso':
        return <TrendingDown />;
      default:
        return <Person />;
    }
  };

  const handlePatientClick = (patient: RiskRadarData) => {
    setSelectedPatient(patient);
  };

  const handleCloseDialog = () => {
    setSelectedPatient(null);
  };

  const handleCallPatient = (patientId: string) => {
    console.log('Llamando a paciente:', patientId);
    // Implement call functionality
  };

  const handleAssignFollowup = (patientId: string) => {
    console.log('Asignando seguimiento a paciente:', patientId);
    // Implement follow-up assignment
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 3,
          border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Warning sx={{ color: '#F44336', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
              }}
            >
              Radar de Riesgo Activo
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              color: alpha(ceoBrandColors.text, 0.7),
              mb: 2,
            }}
          >
            Pacientes que requieren atención prioritaria
          </Typography>

          <Box display="flex" gap={1}>
            <Chip
              label={`${data.filter(p => p.nivelRiesgo === 'critico').length} Críticos`}
              size="small"
              sx={{
                backgroundColor: alpha('#F44336', 0.1),
                color: '#F44336',
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${data.filter(p => p.nivelRiesgo === 'alto').length} Alto Riesgo`}
              size="small"
              sx={{
                backgroundColor: alpha('#FF9800', 0.1),
                color: '#FF9800',
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Patient List */}
        <List sx={{ p: 0 }}>
          {data.map((patient, index) => (
            <ListItem
              key={patient.pacienteId}
              sx={{
                borderBottom: index < data.length - 1 ? `1px solid ${alpha(ceoBrandColors.primary, 0.05)}` : 'none',
                '&:hover': {
                  backgroundColor: alpha(ceoBrandColors.primary, 0.05),
                },
                cursor: 'pointer',
              }}
              onClick={() => handlePatientClick(patient)}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: alpha(getRiskColor(patient.nivelRiesgo), 0.1),
                    color: getRiskColor(patient.nivelRiesgo),
                  }}
                >
                  {getRiskIcon(patient.tipoRiesgo)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                      }}
                    >
                      {patient.nombre}
                    </Typography>
                    <Chip
                      label={patient.nivelRiesgo.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getRiskColor(patient.nivelRiesgo), 0.1),
                        color: getRiskColor(patient.nivelRiesgo),
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        color: alpha(ceoBrandColors.text, 0.8),
                        mb: 0.5,
                      }}
                    >
                      {patient.descripcion}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        color: alpha(ceoBrandColors.text, 0.6),
                      }}
                    >
                      Última sesión: {format(patient.ultimaSesion, "dd 'de' MMM", { locale: es })}
                    </Typography>
                  </Box>
                }
              />
              <Box display="flex" gap={1}>
                <Tooltip title="Llamar">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCallPatient(patient.pacienteId);
                    }}
                    sx={{
                      color: ceoBrandColors.accentBlue,
                      '&:hover': {
                        backgroundColor: alpha(ceoBrandColors.accentBlue, 0.1),
                      },
                    }}
                  >
                    <Phone sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Asignar seguimiento">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssignFollowup(patient.pacienteId);
                    }}
                    sx={{
                      color: ceoBrandColors.accentPink,
                      '&:hover': {
                        backgroundColor: alpha(ceoBrandColors.accentPink, 0.1),
                      },
                    }}
                  >
                    <Assignment sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          >
            Ver Todos los Pacientes de Riesgo
          </Button>
        </Box>
      </Paper>

      {/* Patient Detail Dialog */}
      <Dialog
        open={Boolean(selectedPatient)}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: ceoBrandColors.background,
          },
        }}
      >
        {selectedPatient && (
          <>
            <DialogTitle
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      backgroundColor: alpha(getRiskColor(selectedPatient.nivelRiesgo), 0.1),
                      color: getRiskColor(selectedPatient.nivelRiesgo),
                    }}
                  >
                    {getRiskIcon(selectedPatient.tipoRiesgo)}
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                      }}
                    >
                      {selectedPatient.nombre}
                    </Typography>
                    <Chip
                      label={`Riesgo ${selectedPatient.nivelRiesgo.toUpperCase()}`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getRiskColor(selectedPatient.nivelRiesgo), 0.1),
                        color: getRiskColor(selectedPatient.nivelRiesgo),
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                    color: ceoBrandColors.text,
                    mb: 1,
                  }}
                >
                  Descripción del Riesgo
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: ceoBrandColors.text,
                    mb: 3,
                  }}
                >
                  {selectedPatient.descripcion}
                </Typography>

                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                    color: ceoBrandColors.text,
                    mb: 1,
                  }}
                >
                  Acciones Recomendadas
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                  {selectedPatient.accionesRecomendadas.map((accion, index) => (
                    <Typography 
                      key={index}
                      component="li" 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        color: ceoBrandColors.text,
                        mb: 0.5,
                      }}
                    >
                      {accion}
                    </Typography>
                  ))}
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: alpha(ceoBrandColors.text, 0.7),
                  }}
                >
                  Última sesión: {format(selectedPatient.ultimaSesion, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                variant="outlined"
                onClick={handleCloseDialog}
                sx={{
                  borderColor: ceoBrandColors.primary,
                  color: ceoBrandColors.primary,
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                }}
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                startIcon={<Phone />}
                onClick={() => handleCallPatient(selectedPatient.pacienteId)}
                sx={{
                  background: `linear-gradient(135deg, ${ceoBrandColors.accentBlue} 0%, ${ceoBrandColors.primary} 100%)`,
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                Contactar
              </Button>
              <Button
                variant="contained"
                startIcon={<Assignment />}
                onClick={() => handleAssignFollowup(selectedPatient.pacienteId)}
                sx={{
                  background: `linear-gradient(135deg, ${ceoBrandColors.accentPink} 0%, ${ceoBrandColors.secondary} 100())`,
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                }}
              >
                Asignar Seguimiento
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
