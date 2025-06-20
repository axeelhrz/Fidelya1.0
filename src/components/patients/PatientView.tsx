'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Button,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  alpha,
  useTheme,
  Fade,
} from '@mui/material';
import {
  Edit,
  CalendarToday,
  Psychology,
  Warning,
  EventNote,
  ArrowBack,
  Email,
  Assignment,
  Circle,
} from '@mui/icons-material';
import { Patient, EMOTIONAL_STATE_COLORS, GENDER_LABELS } from '@/types/patient';
import { User } from '@/types/auth';
import { format, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientViewProps {
  patient: Patient | null;
  psychologists: User[];
  loading: boolean;
  error: Error | null;
  onEdit: () => void;
  onBack: () => void;
}

export default function PatientView({
  patient,
  psychologists,
  loading,
  error,
  onEdit,
  onBack
}: PatientViewProps) {
  const theme = useTheme();

  const getPsychologist = (uid: string) => {
    return psychologists.find(p => p.uid === uid);
  };

  const getPatientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={200} height={32} />
          </Stack>
          
          <Stack 
            direction={{ xs: 'column', lg: 'row' }} 
            spacing={3}
            sx={{
              '& > *': {
                flex: 1,
                minWidth: { xs: '100%', lg: 400 }
              }
            }}
          >
            <Box>
              {[...Array(3)].map((_, i) => (
                <Card key={i} sx={{ mb: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                    {[...Array(4)].map((_, j) => (
                      <Box key={j} display="flex" justifyContent="space-between" mb={2}>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={180} />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Box>
              {[...Array(2)].map((_, i) => (
                <Card key={i} sx={{ mb: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert 
          severity="error"
          sx={{ 
            borderRadius: 3,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          Error al cargar el paciente: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert 
          severity="info"
          sx={{ 
            borderRadius: 3,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          Paciente no encontrado
        </Alert>
      </Box>
    );
  }

  const psychologist = getPsychologist(patient.assignedPsychologist);
  const age = patient.age || differenceInYears(new Date(), new Date(patient.birthDate));

  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={4}>
        {/* Header del Paciente */}
        <Fade in timeout={600}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${EMOTIONAL_STATE_COLORS[patient.emotionalState]} 0%, ${alpha(EMOTIONAL_STATE_COLORS[patient.emotionalState], 0.6)} 100%)`,
              }
            }}
          >
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3} 
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <IconButton 
                  onClick={onBack} 
                  sx={{ 
                    background: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80,
                    background: `linear-gradient(135deg, ${EMOTIONAL_STATE_COLORS[patient.emotionalState]} 0%, ${alpha(EMOTIONAL_STATE_COLORS[patient.emotionalState], 0.8)} 100%)`,
                    fontSize: '2rem',
                    fontWeight: 700,
                  }}
                >
                  {getPatientInitials(patient.fullName)}
                </Avatar>
                
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700}
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: 'text.primary',
                      mb: 1
                    }}
                  >
                    {patient.fullName}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      {age} años • {GENDER_LABELS[patient.gender]}
                    </Typography>
                    <Chip
                      icon={<Circle sx={{ fontSize: '12px !important' }} />}
                      label={patient.emotionalState}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${EMOTIONAL_STATE_COLORS[patient.emotionalState]} 0%, ${alpha(EMOTIONAL_STATE_COLORS[patient.emotionalState], 0.8)} 100%)`,
                        color: 'white',
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          color: 'white',
                        }
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
              
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={onEdit}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Editar Paciente
              </Button>
            </Stack>
          </Paper>
        </Fade>

        <Stack 
          direction={{ xs: 'column', lg: 'row' }} 
          spacing={4}
          sx={{
            '& > *': {
              flex: 1,
              minWidth: { xs: '100%', lg: 400 }
            }
          }}
        >
          {/* Información Principal */}
          <Stack spacing={3}>
            {/* Información Personal */}
            <Fade in timeout={800}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Información Personal
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2}
                      sx={{
                        '& > *': {
                          flex: 1,
                          minWidth: { xs: '100%', sm: 200 }
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Nombre Completo
                        </Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {patient.fullName}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Fecha de Nacimiento
                        </Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: es })} ({age} años)
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2}
                      sx={{
                        '& > *': {
                          flex: 1,
                          minWidth: { xs: '100%', sm: 200 }
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Género
                        </Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {GENDER_LABELS[patient.gender]}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Estado del Paciente
                        </Typography>
                        <Chip
                          label={
                            patient.status === 'active' ? 'Activo' :
                            patient.status === 'inactive' ? 'Inactivo' : 'Dado de alta'
                          }
                          color={
                            patient.status === 'active' ? 'success' :
                            patient.status === 'inactive' ? 'warning' : 'default'
                          }
                          variant="outlined"
                          size="small"
                          sx={{ 
                            mt: 0.5,
                            fontWeight: 600,
                            borderRadius: 2
                          }}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>

            {/* Información Clínica */}
            <Fade in timeout={1000}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Información Clínica
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                        Motivo de Consulta
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: 3,
                          background: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {patient.motivoConsulta}
                        </Typography>
                      </Paper>
                    </Box>

                    {patient.observaciones && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                          Observaciones Iniciales
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            borderRadius: 3,
                            background: alpha(theme.palette.background.paper, 0.5),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          }}
                        >
                          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                            {patient.observaciones}
                          </Typography>
                        </Paper>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Fecha de Alta
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                        {format(patient.createdAt instanceof Date ? patient.createdAt : patient.createdAt.toDate(), 'dd/MM/yyyy', { locale: es })}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>

            {/* Historial de Sesiones */}
            <Fade in timeout={1200}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Historial de Sesiones
                  </Typography>
                  <Alert 
                    severity="info"
                    sx={{ 
                      borderRadius: 3,
                      '& .MuiAlert-message': {
                        fontWeight: 500
                      }
                    }}
                  >
                    El historial de sesiones se mostrará aquí una vez implementado el módulo de sesiones.
                  </Alert>
                </CardContent>
              </Card>
            </Fade>
          </Stack>

          {/* Panel Lateral */}
          <Stack spacing={3}>
            {/* Psicólogo Asignado */}
            <Fade in timeout={800}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Psicólogo Asignado
                  </Typography>
                  
                  {psychologist ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56,
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                        }}
                      >
                        <Psychology sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {psychologist.displayName}
                        </Typography>
                        {psychologist.specialization && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {psychologist.specialization}
                          </Typography>
                        )}
                        {psychologist.email && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {psychologist.email}
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Stack>
                  ) : (
                    <Alert 
                      severity="warning"
                      sx={{ 
                        borderRadius: 3,
                        '& .MuiAlert-message': {
                          fontWeight: 500
                        }
                      }}
                    >
                      No hay psicólogo asignado
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Fade>

            {/* Próxima Sesión */}
            <Fade in timeout={1000}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Próxima Sesión
                  </Typography>
                  
                  {patient.nextSession ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.palette.primary.main,
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {format(new Date(patient.nextSession), 'dd/MM/yyyy', { locale: es })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(patient.nextSession), 'EEEE', { locale: es })}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 3,
                        '& .MuiAlert-message': {
                          fontWeight: 500
                        }
                      }}
                    >
                      No hay sesión programada
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Fade>

            {/* Alertas Clínicas */}
            <Fade in timeout={1200}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Alertas Clínicas
                  </Typography>
                  
                  <Alert 
                    severity="info"
                    sx={{ 
                      borderRadius: 3,
                      '& .MuiAlert-message': {
                        fontWeight: 500
                      }
                    }}
                  >
                    Las alertas clínicas se mostrarán aquí una vez implementado el módulo de alertas.
                  </Alert>
                </CardContent>
              </Card>
            </Fade>

            {/* Acciones Rápidas */}
            <Fade in timeout={1400}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary"
                    sx={{ 
                      mb: 3,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Acciones Rápidas
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{
                          borderRadius: 3,
                          mb: 1,
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        <ListItemIcon>
                          <EventNote sx={{ color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body2" fontWeight={600}>
                              Nueva Sesión
                            </Typography>
                          }
                          secondary="Programar sesión clínica"
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{
                          borderRadius: 3,
                          mb: 1,
                          '&:hover': {
                            background: alpha(theme.palette.warning.main, 0.1),
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Warning sx={{ color: 'warning.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body2" fontWeight={600}>
                              Crear Alerta
                            </Typography>
                          }
                          secondary="Añadir alerta clínica"
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{
                          borderRadius: 3,
                          '&:hover': {
                            background: alpha(theme.palette.info.main, 0.1),
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Assignment sx={{ color: 'info.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body2" fontWeight={600}>
                              Ver Historial
                            </Typography>
                          }
                          secondary="Revisar sesiones anteriores"
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}