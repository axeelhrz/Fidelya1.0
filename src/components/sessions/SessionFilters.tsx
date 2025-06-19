'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Autocomplete,
  Stack,
  Paper,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
  Psychology as PsychologyIcon,
  SmartToy as SmartToyIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

import { 
  SessionFilters as SessionFiltersType, 
  SESSION_TYPES, 
  SESSION_STATUSES, 
  SESSION_TYPE_LABELS, 
  SESSION_STATUS_LABELS,
  EMOTIONAL_TONES,
  RISK_LEVEL_LABELS
} from '@/types/session';
import { Patient } from '@/types/patient';
import { User } from '@/types/auth';

interface SessionFiltersProps {
  filters: SessionFiltersType;
  onFiltersChange: (filters: SessionFiltersType) => void;
  patients: Patient[];
  professionals: User[];
  loading?: boolean;
}

export default function SessionFilters({
  filters,
  onFiltersChange,
  patients,
  professionals,
  loading = false
}: SessionFiltersProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<SessionFiltersType>(filters);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SessionFiltersType, value: SessionFiltersType[keyof SessionFiltersType]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: Date | null) => {
    const newDateRange = {
      ...localFilters.dateRange,
      [field]: value ? value.toISOString().split('T')[0] : undefined
    };
    
    // Limpiar el rango si ambos valores están vacíos
    if (!newDateRange.start && !newDateRange.end) {
      handleFilterChange('dateRange', undefined);
    } else {
      handleFilterChange('dateRange', newDateRange);
    }
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SessionFiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.patientId) count++;
    if (localFilters.professionalId) count++;
    if (localFilters.status) count++;
    if (localFilters.type) count++;
    if (localFilters.emotionalTone) count++;
    if (localFilters.riskLevel) count++;
    if (localFilters.dateRange) count++;
    if (localFilters.hasAIAnalysis !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper 
        sx={{ 
          borderRadius: 'xl',
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }}
      >
        {/* Header con gradiente */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 'xl',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <TuneIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Filtros de Búsqueda
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Encuentra sesiones específicas con filtros avanzados
                </Typography>
              </Box>
            </Stack>
            {activeFiltersCount > 0 && (
              <Chip 
                label={`${activeFiltersCount} activo${activeFiltersCount !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                sx={{
                  borderRadius: 'xl',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                  color: 'white',
                }}
              />
            )}
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Filtros básicos siempre visibles */}
          <Stack spacing={3}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                '& > *': {
                  flex: '1 1 250px',
                  minWidth: '250px'
                }
              }}
            >
              <TextField
                fullWidth
                label="Buscar sesiones"
                placeholder="Buscar por notas, observaciones, resumen..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  ),
                }}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                    },
                    '&.Mui-focused': {
                      bgcolor: theme.palette.background.paper,
                    }
                  }
                }}
              />

              <Autocomplete
                options={patients}
                getOptionLabel={(patient) => patient.fullName}
                value={patients.find(p => p.id === localFilters.patientId) || null}
                onChange={(_, patient) => handleFilterChange('patientId', patient?.id || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Paciente"
                    placeholder="Seleccionar paciente"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <PsychologyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                      }
                    }}
                  />
                )}
                renderOption={(props, patient) => (
                  <Box component="li" {...props}>
                    <Stack direction="row" alignItems="center" spacing={2} width="100%">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.main,
                        }}
                      />
                      <Stack spacing={0}>
                        <Typography variant="body2" fontWeight={500}>
                          {patient.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.age} años • {patient.emotionalState}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                )}
                disabled={loading}
              />

              <FormControl disabled={loading} fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Estado"
                  sx={{
                    borderRadius: 'xl',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  {SESSION_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {SESSION_STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Botones de acción */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                disabled={loading || activeFiltersCount === 0}
                sx={{
                  borderRadius: 'xl',
                  px: 3,
                  borderColor: alpha(theme.palette.error.main, 0.3),
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                  }
                }}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                onClick={applyFilters}
                startIcon={<FilterListIcon />}
                disabled={loading}
                sx={{
                  borderRadius: 'xl',
                  px: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }
                }}
              >
                Aplicar Filtros
              </Button>
            </Stack>
          </Stack>

          {/* Filtros avanzados */}
          <Accordion 
            expanded={expanded} 
            onChange={(_, isExpanded) => setExpanded(isExpanded)}
            sx={{ 
              mt: 3,
              boxShadow: 'none',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 'xl',
              '&:before': { display: 'none' },
              bgcolor: alpha(theme.palette.background.paper, 0.3),
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: 'xl',
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <SmartToyIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Filtros Avanzados
                </Typography>
                {activeFiltersCount > 3 && (
                  <Chip 
                    label={`+${activeFiltersCount - 3} más`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ borderRadius: 'xl' }}
                  />
                )}
              </Stack>
            </AccordionSummary>
            
            <AccordionDetails sx={{ pt: 0 }}>
              <Stack spacing={3}>
                {/* Primera fila de filtros avanzados */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    '& > *': {
                      flex: '1 1 250px',
                      minWidth: '250px'
                    }
                  }}
                >
                  <Autocomplete
                    options={professionals}
                    getOptionLabel={(professional) => professional.displayName || professional.email}
                    value={professionals.find(p => p.uid === localFilters.professionalId) || null}
                    onChange={(_, professional) => handleFilterChange('professionalId', professional?.uid || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Profesional"
                        placeholder="Seleccionar profesional"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 'xl',
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                          }
                        }}
                      />
                    )}
                    disabled={loading}
                  />

                  <FormControl disabled={loading} fullWidth>
                    <InputLabel>Tipo de Sesión</InputLabel>
                    <Select
                      value={localFilters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      label="Tipo de Sesión"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                      }}
                    >
                      <MenuItem value="">Todos los tipos</MenuItem>
                      {SESSION_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {SESSION_TYPE_LABELS[type]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl disabled={loading} fullWidth>
                    <InputLabel>Estado Emocional</InputLabel>
                    <Select
                      value={localFilters.emotionalTone || ''}
                      onChange={(e) => handleFilterChange('emotionalTone', e.target.value)}
                      label="Estado Emocional"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                      }}
                    >
                      <MenuItem value="">Todos los estados</MenuItem>
                      {EMOTIONAL_TONES.map((tone) => (
                        <MenuItem key={tone} value={tone}>
                          {tone}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Segunda fila de filtros avanzados */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    '& > *': {
                      flex: '1 1 250px',
                      minWidth: '250px'
                    }
                  }}
                >
                  <FormControl disabled={loading} fullWidth>
                    <InputLabel>Nivel de Riesgo</InputLabel>
                    <Select
                      value={localFilters.riskLevel || ''}
                      onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                      label="Nivel de Riesgo"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                      }}
                    >
                      <MenuItem value="">Todos los niveles</MenuItem>
                      <MenuItem value="low">{RISK_LEVEL_LABELS.low}</MenuItem>
                      <MenuItem value="medium">{RISK_LEVEL_LABELS.medium}</MenuItem>
                      <MenuItem value="high">{RISK_LEVEL_LABELS.high}</MenuItem>
                    </Select>
                  </FormControl>

                  <DatePicker
                    label="Fecha desde"
                    value={localFilters.dateRange?.start ? new Date(localFilters.dateRange.start) : null}
                    onChange={(date) => handleDateRangeChange('start', date)}
                    slotProps={{
                      textField: {
                        disabled: loading,
                        InputProps: {
                          startAdornment: (
                            <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          ),
                        },
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 'xl',
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                          }
                        }
                      }
                    }}
                  />

                  <DatePicker
                    label="Fecha hasta"
                    value={localFilters.dateRange?.end ? new Date(localFilters.dateRange.end) : null}
                    onChange={(date) => handleDateRangeChange('end', date)}
                    slotProps={{
                      textField: {
                        disabled: loading,
                        InputProps: {
                          startAdornment: (
                            <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          ),
                        },
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 'xl',
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                          }
                        }
                      }
                    }}
                  />
                </Box>

                {/* Tercera fila: Switch y opciones especiales */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 'xl',
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                      flex: '1 1 300px',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localFilters.hasAIAnalysis === true}
                          onChange={(e) => handleFilterChange('hasAIAnalysis', e.target.checked ? true : undefined)}
                          disabled={loading}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: theme.palette.info.main,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: theme.palette.info.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <SmartToyIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                          <Typography variant="body2" fontWeight={500}>
                            Solo sesiones con análisis de IA
                          </Typography>
                        </Stack>
                      }
                    />
                  </Paper>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      startIcon={<ClearIcon />}
                      disabled={loading || activeFiltersCount === 0}
                      sx={{
                        borderRadius: 'xl',
                        px: 3,
                        borderColor: alpha(theme.palette.error.main, 0.3),
                        color: theme.palette.error.main,
                        '&:hover': {
                          borderColor: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.05),
                        }
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                    <Button
                      variant="contained"
                      onClick={applyFilters}
                      startIcon={<FilterListIcon />}
                      disabled={loading}
                      sx={{
                        borderRadius: 'xl',
                        px: 4,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }
                      }}
                    >
                      Aplicar Filtros
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Chips de filtros activos */}
          {activeFiltersCount > 0 && (
            <Fade in timeout={600}>
              <Box mt={3}>
                <Typography variant="caption" color="text.secondary" gutterBottom fontWeight={600}>
                  Filtros activos:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} mt={1.5}>
                  {localFilters.search && (
                    <Chip
                      label={`Búsqueda: "${localFilters.search}"`}
                      onDelete={() => handleFilterChange('search', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.patientId && (
                    <Chip
                      label={`Paciente: ${patients.find(p => p.id === localFilters.patientId)?.fullName}`}
                      onDelete={() => handleFilterChange('patientId', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        borderColor: alpha(theme.palette.success.main, 0.2),
                        color: theme.palette.success.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.success.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.professionalId && (
                    <Chip
                      label={`Profesional: ${professionals.find(p => p.uid === localFilters.professionalId)?.displayName}`}
                      onDelete={() => handleFilterChange('professionalId', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        borderColor: alpha(theme.palette.info.main, 0.2),
                        color: theme.palette.info.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.info.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.status && (
                    <Chip
                      label={`Estado: ${SESSION_STATUS_LABELS[localFilters.status]}`}
                      onDelete={() => handleFilterChange('status', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        borderColor: alpha(theme.palette.warning.main, 0.2),
                        color: theme.palette.warning.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.warning.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.type && (
                    <Chip
                      label={`Tipo: ${SESSION_TYPE_LABELS[localFilters.type]}`}
                      onDelete={() => handleFilterChange('type', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        borderColor: alpha(theme.palette.secondary.main, 0.2),
                        color: theme.palette.secondary.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.secondary.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.emotionalTone && (
                    <Chip
                      label={`Emoción: ${localFilters.emotionalTone}`}
                      onDelete={() => handleFilterChange('emotionalTone', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        borderColor: alpha(theme.palette.error.main, 0.2),
                        color: theme.palette.error.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.error.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.riskLevel && (
                    <Chip
                      label={`Riesgo: ${RISK_LEVEL_LABELS[localFilters.riskLevel]}`}
                      onDelete={() => handleFilterChange('riskLevel', '')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        borderColor: alpha(theme.palette.error.main, 0.2),
                        color: theme.palette.error.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.error.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.hasAIAnalysis && (
                    <Chip
                      label="Con análisis IA"
                      onDelete={() => handleFilterChange('hasAIAnalysis', undefined)}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        borderColor: alpha(theme.palette.info.main, 0.2),
                        color: theme.palette.info.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.info.main,
                        }
                      }}
                    />
                  )}
                  {localFilters.dateRange && (
                    <Chip
                      label={`Período: ${localFilters.dateRange.start || '...'} - ${localFilters.dateRange.end || '...'}`}
                      onDelete={() => handleFilterChange('dateRange', undefined)}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 'xl',
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        borderColor: alpha(theme.palette.secondary.main, 0.2),
                        color: theme.palette.secondary.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.secondary.main,
                        }
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
