'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Chip,
  Button,
  Stack,
  InputAdornment,
  alpha,
  useTheme,
  Fade,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
  TuneRounded,
} from '@mui/icons-material';
import { PatientFilters, EMOTIONAL_STATES, GENDERS, GENDER_LABELS } from '@/types/patient';
import { User } from '@/types/auth';

interface PatientFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  psychologists: User[];
}

export default function PatientFiltersComponent({ 
  filters, 
  onFiltersChange, 
  psychologists 
}: PatientFiltersProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<PatientFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof PatientFilters, value: PatientFilters[keyof PatientFilters]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAgeRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    const newAgeRange = { ...localFilters.ageRange, [type]: numValue };
    handleFilterChange('ageRange', newAgeRange);
  };

  const clearFilters = () => {
    const emptyFilters: PatientFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.gender) count++;
    if (localFilters.emotionalState) count++;
    if (localFilters.assignedPsychologist) count++;
    if (localFilters.status) count++;
    if (localFilters.ageRange?.min || localFilters.ageRange?.max) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Paper 
      sx={{ 
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header de Filtros */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
              }}
            >
              <TuneRounded sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={600}
                sx={{ 
                  color: 'text.primary',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Filtros de Búsqueda
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Refina tu búsqueda de pacientes
              </Typography>
            </Box>
            {activeFiltersCount > 0 && (
              <Chip
                label={`${activeFiltersCount} activo${activeFiltersCount > 1 ? 's' : ''}`}
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Stack>
          
          <Stack direction="row" spacing={1}>
            {activeFiltersCount > 0 && (
              <Fade in>
                <Button
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'text.secondary',
                    '&:hover': {
                      background: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                    }
                  }}
                >
                  Limpiar
                </Button>
              </Fade>
            )}
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              sx={{
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                  transform: 'scale(1.05)',
                }
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
        </Stack>

        {/* Búsqueda Principal */}
        <TextField
          fullWidth
          placeholder="Buscar por nombre del paciente o motivo de consulta..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: expanded ? 3 : 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.5),
              '&:hover': {
                background: alpha(theme.palette.background.paper, 0.8),
              },
              '&.Mui-focused': {
                background: theme.palette.background.paper,
              }
            }
          }}
        />

        {/* Filtros Avanzados */}
        <Collapse in={expanded}>
          <Stack spacing={3}>
            {/* Primera fila de filtros */}
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2}
              sx={{
                '& > *': {
                  flex: 1,
                  minWidth: { xs: '100%', md: 200 }
                }
              }}
            >
              <FormControl>
                <InputLabel>Género</InputLabel>
                <Select
                  value={localFilters.gender || ''}
                  label="Género"
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  sx={{
                    borderRadius: 3,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    }
                  }}
                >
                  <MenuItem value="">Todos los géneros</MenuItem>
                  {GENDERS.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {GENDER_LABELS[gender]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Estado Emocional</InputLabel>
                <Select
                  value={localFilters.emotionalState || ''}
                  label="Estado Emocional"
                  onChange={(e) => handleFilterChange('emotionalState', e.target.value)}
                  sx={{
                    borderRadius: 3,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    }
                  }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  {EMOTIONAL_STATES.map((state) => (
                    <MenuItem key={state} value={state}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.6)} 100%)`,
                          }}
                        />
                        {state}
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Psicólogo Asignado</InputLabel>
                <Select
                  value={localFilters.assignedPsychologist || ''}
                  label="Psicólogo Asignado"
                  onChange={(e) => handleFilterChange('assignedPsychologist', e.target.value)}
                  sx={{
                    borderRadius: 3,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    }
                  }}
                >
                  <MenuItem value="">Todos los psicólogos</MenuItem>
                  {psychologists.map((psychologist) => (
                    <MenuItem key={psychologist.uid} value={psychologist.uid}>
                      {psychologist.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Estado del Paciente</InputLabel>
                <Select
                  value={localFilters.status || ''}
                  label="Estado del Paciente"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{
                    borderRadius: 3,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    }
                  }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="discharged">Dado de alta</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Segunda fila - Rango de edad */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                sx={{ mb: 2, color: 'text.primary' }}
              >
                Rango de Edad
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{
                  '& > *': {
                    flex: 1,
                    minWidth: { xs: '100%', sm: 150 }
                  }
                }}
              >
                <TextField
                  label="Edad mínima"
                  type="number"
                  value={localFilters.ageRange?.min || ''}
                  onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                  inputProps={{ min: 0, max: 120 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
                <TextField
                  label="Edad máxima"
                  type="number"
                  value={localFilters.ageRange?.max || ''}
                  onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                  inputProps={{ min: 0, max: 120 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Collapse>
      </Box>
    </Paper>
  );
}
