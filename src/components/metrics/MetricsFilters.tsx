'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Stack,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Refresh,
  PictureAsPdf,
  TableChart,
  Description
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { MetricsFilters } from '@/types/metrics';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface MetricsFiltersProps {
  filters: MetricsFilters;
  onFiltersChange: (filters: MetricsFilters) => void;
  onExport?: (format: 'pdf' | 'excel' | 'notion') => void;
  onRefresh?: () => void;
  professionals?: Array<{ id: string; name: string }>;
  patients?: Array<{ id: string; name: string }>;
  loading?: boolean;
}

export default function MetricsFilters({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  professionals = [],
  patients = [],
  loading = false
}: MetricsFiltersProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  // Presets de fechas rápidas
  const datePresets = [
    {
      label: 'Últimos 7 días',
      getValue: () => ({
        start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    },
    {
      label: 'Últimas 2 semanas',
      getValue: () => ({
        start: format(subWeeks(new Date(), 2), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    },
    {
      label: 'Último mes',
      getValue: () => ({
        start: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    },
    {
      label: 'Últimos 3 meses',
      getValue: () => ({
        start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    }
  ];

  const sessionTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'grupal', label: 'Grupal' },
    { value: 'familiar', label: 'Familiar' },
    { value: 'pareja', label: 'Pareja' },
    { value: 'evaluacion', label: 'Evaluación' },
    { value: 'seguimiento', label: 'Seguimiento' }
  ];

  const emotionalTones = [
    { value: 'alegre', label: 'Alegre' },
    { value: 'ansioso', label: 'Ansioso' },
    { value: 'deprimido', label: 'Deprimido' },
    { value: 'irritable', label: 'Irritable' },
    { value: 'calmado', label: 'Calmado' },
    { value: 'confundido', label: 'Confundido' },
    { value: 'esperanzado', label: 'Esperanzado' },
    { value: 'frustrado', label: 'Frustrado' }
  ];

  const alertTypes = [
    { value: 'appointment', label: 'Cita' },
    { value: 'medication', label: 'Medicación' },
    { value: 'follow-up', label: 'Seguimiento' },
    { value: 'emergency', label: 'Emergencia' },
    { value: 'custom', label: 'Personalizada' }
  ];

  const handleFilterChange = (key: keyof MetricsFilters, value: MetricsFilters[keyof MetricsFilters]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (dateRange: { start: string; end: string }) => {
    handleFilterChange('dateRange', dateRange);
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: {
        start: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.professionalId) count++;
    if (filters.patientId) count++;
    if (filters.sessionType) count++;
    if (filters.emotionalTone) count++;
    if (filters.alertType) count++;
    if (filters.includeInactive) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card 
      sx={{ 
        borderRadius: 4,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Barra principal de filtros */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'stretch', md: 'center' }}>
          {/* Presets de fechas rápidas */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Períodos Rápidos
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {datePresets.map((preset) => (
                <Chip
                  key={preset.label}
                  label={preset.label}
                  onClick={() => handleDateRangeChange(preset.getValue())}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 3,
                    fontFamily: '"Inter", sans-serif',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Botones de acción */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Acciones
            </Typography>
            <Stack direction="row" spacing={1}>
              {onRefresh && (
                <IconButton
                  onClick={onRefresh}
                  disabled={loading}
                  size="small"
                  title="Actualizar datos"
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              )}

              {onExport && (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => onExport('pdf')}
                    disabled={loading}
                    size="small"
                    title="Exportar PDF"
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }
                    }}
                  >
                    <PictureAsPdf />
                  </IconButton>
                  <IconButton
                    onClick={() => onExport('excel')}
                    disabled={loading}
                    size="small"
                    title="Exportar Excel"
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      color: theme.palette.success.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                      }
                    }}
                  >
                    <TableChart />
                  </IconButton>
                  <IconButton
                    onClick={() => onExport('notion')}
                    disabled={loading}
                    size="small"
                    title="Exportar Notion"
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      color: theme.palette.info.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                      }
                    }}
                  >
                    <Description />
                  </IconButton>
                </Stack>
              )}

              <Button
                startIcon={<FilterList />}
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setExpanded(!expanded)}
                variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
                size="small"
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>

              {activeFiltersCount > 0 && (
                <IconButton
                  onClick={clearFilters}
                  size="small"
                  title="Limpiar filtros"
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    color: theme.palette.warning.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    }
                  }}
                >
                  <Clear />
                </IconButton>
              )}
            </Stack>
          </Box>
        </Stack>

        {/* Filtros expandibles */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            {/* Rango de fechas personalizado */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                Rango de Fechas Personalizado
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Fecha inicio"
                    value={filters.dateRange.start ? new Date(filters.dateRange.start) : null}
                    onChange={(date) => {
                      if (date) {
                        handleDateRangeChange({
                          start: format(date, 'yyyy-MM-dd'),
                          end: filters.dateRange.end
                        });
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontFamily: '"Inter", sans-serif'
                          }
                        }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Fecha fin"
                    value={filters.dateRange.end ? new Date(filters.dateRange.end) : null}
                    onChange={(date) => {
                      if (date) {
                        handleDateRangeChange({
                          start: filters.dateRange.start,
                          end: format(date, 'yyyy-MM-dd')
                        });
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontFamily: '"Inter", sans-serif'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Filtros adicionales */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                Filtros Avanzados
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: 3 
                }}
              >
                <TextField
                  select
                  label="Profesional"
                  value={filters.professionalId || ''}
                  onChange={(e) => handleFilterChange('professionalId', e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <MenuItem value="">Todos los profesionales</MenuItem>
                  {professionals.map((prof) => (
                    <MenuItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Paciente"
                  value={filters.patientId || ''}
                  onChange={(e) => handleFilterChange('patientId', e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <MenuItem value="">Todos los pacientes</MenuItem>
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Tipo de Sesión"
                  value={filters.sessionType || ''}
                  onChange={(e) => handleFilterChange('sessionType', e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <MenuItem value="">Todos los tipos</MenuItem>
                  {sessionTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Estado Emocional"
                  value={filters.emotionalTone || ''}
                  onChange={(e) => handleFilterChange('emotionalTone', e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  {emotionalTones.map((emotion) => (
                    <MenuItem key={emotion.value} value={emotion.value}>
                      {emotion.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Tipo de Alerta"
                  value={filters.alertType || ''}
                  onChange={(e) => handleFilterChange('alertType', e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <MenuItem value="">Todos los tipos</MenuItem>
                  {alertTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Incluir Inactivos"
                  value={filters.includeInactive ? 'true' : 'false'}
                  onChange={(e) => handleFilterChange('includeInactive', e.target.value === 'true')}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <MenuItem value="false">Solo activos</MenuItem>
                  <MenuItem value="true">Incluir inactivos</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Resumen de filtros activos */}
            {activeFiltersCount > 0 && (
              <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  Filtros Activos ({activeFiltersCount})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {filters.professionalId && (
                    <Chip
                      label={`Profesional: ${professionals.find(p => p.id === filters.professionalId)?.name || 'Desconocido'}`}
                      onDelete={() => handleFilterChange('professionalId', undefined)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {filters.patientId && (
                    <Chip
                      label={`Paciente: ${patients.find(p => p.id === filters.patientId)?.name || 'Desconocido'}`}
                      onDelete={() => handleFilterChange('patientId', undefined)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {filters.sessionType && (
                    <Chip
                      label={`Tipo: ${sessionTypes.find(t => t.value === filters.sessionType)?.label || filters.sessionType}`}
                      onDelete={() => handleFilterChange('sessionType', undefined)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {filters.emotionalTone && (
                    <Chip
                      label={`Emoción: ${emotionalTones.find(e => e.value === filters.emotionalTone)?.label || filters.emotionalTone}`}
                      onDelete={() => handleFilterChange('emotionalTone', undefined)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {filters.alertType && (
                    <Chip
                      label={`Alerta: ${alertTypes.find(a => a.value === filters.alertType)?.label || filters.alertType}`}
                      onDelete={() => handleFilterChange('alertType', undefined)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {filters.includeInactive && (
                    <Chip
                      label="Incluye inactivos"
                      onDelete={() => handleFilterChange('includeInactive', false)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                </Stack>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
