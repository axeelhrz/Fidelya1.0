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
  Grid,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Download,
  Refresh
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MetricsFilters } from '@/types/metrics';
import { EMOTIONAL_STATES } from '@/types/patient';
import { EMOTIONAL_TONES } from '@/types/session';
import { ALERT_TYPES } from '@/types/alert';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface FiltersToolbarProps {
  filters: MetricsFilters;
  onFiltersChange: (filters: MetricsFilters) => void;
  onExport?: (format: 'pdf' | 'excel' | 'notion') => void;
  onRefresh?: () => void;
  professionals?: Array<{ id: string; name: string }>;
  patients?: Array<{ id: string; name: string }>;
  loading?: boolean;
}

export default function FiltersToolbar({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  professionals = [],
  patients = [],
  loading = false
}: FiltersToolbarProps) {
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

  const handleFilterChange = (key: keyof MetricsFilters, value: any) => {
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
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Barra principal de filtros */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {/* Presets de fechas rápidas */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {datePresets.map((preset) => (
              <Chip
                key={preset.label}
                label={preset.label}
                onClick={() => handleDateRangeChange(preset.getValue())}
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                size="small"
                title="Actualizar datos"
              >
                <Refresh />
              </IconButton>
            )}

            {onExport && (
              <Button
                startIcon={<Download />}
                variant="outlined"
                size="small"
                onClick={() => onExport('excel')}
                disabled={loading}
              >
                Exportar
              </Button>
            )}

            <Button
              startIcon={<FilterList />}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setExpanded(!expanded)}
              variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
              size="small"
            >
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {activeFiltersCount > 0 && (
              <IconButton
                onClick={clearFilters}
                size="small"
                title="Limpiar filtros"
              >
                <Clear />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Filtros expandibles */}
        <Collapse in={expanded}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Rango de fechas personalizado */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Rango de fechas personalizado
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
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
                      fullWidth: true
                    }
                  }}
                />
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
                      fullWidth: true
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* Filtro por profesional */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Profesional"
                value={filters.professionalId || ''}
                onChange={(e) => handleFilterChange('professionalId', e.target.value || undefined)}
                size="small"
                fullWidth
              >
                <MenuItem value="">Todos los profesionales</MenuItem>
                {professionals.map((professional) => (
                  <MenuItem key={professional.id} value={professional.id}>
                    {professional.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Filtro por paciente */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Paciente"
                value={filters.patientId || ''}
                onChange={(e) => handleFilterChange('patientId', e.target.value || undefined)}
                size="small"
                fullWidth
              >
                <MenuItem value="">Todos los pacientes</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Filtro por tipo de sesión */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Tipo de sesión"
                value={filters.sessionType || ''}
                onChange={(e) => handleFilterChange('sessionType', e.target.value || undefined)}
                size="small"
                fullWidth
              >
                <MenuItem value="">Todos los tipos</MenuItem>
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="group">Grupal</MenuItem>
                <MenuItem value="family">Familiar</MenuItem>
                <MenuItem value="online">Online</MenuItem>
              </TextField>
            </Grid>

            {/* Filtro por estado emocional */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Estado emocional"
                value={filters.emotionalTone || ''}
                onChange={(e) => handleFilterChange('emotionalTone', e.target.value || undefined)}
                size="small"
                fullWidth
              >
                <MenuItem value="">Todos los estados</MenuItem>
                {EMOTIONAL_STATES.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
                {EMOTIONAL_TONES.map((tone) => (
                  <MenuItem key={tone} value={tone}>
                    {tone}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Filtro por tipo de alerta */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Tipo de alerta"
                value={filters.alertType || ''}
                onChange={(e) => handleFilterChange('alertType', e.target.value || undefined)}
                size="small"
                fullWidth
              >
                <MenuItem value="">Todos los tipos</MenuItem>
                {ALERT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Incluir inactivos */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Incluir inactivos"
                value={filters.includeInactive ? 'true' : 'false'}
                onChange={(e) => handleFilterChange('includeInactive', e.target.value === 'true')}
                size="small"
                fullWidth
              >
                <MenuItem value="false">Solo activos</MenuItem>
                <MenuItem value="true">Incluir inactivos</MenuItem>
              </TextField>
            </Grid>

            {/* Botones de exportación */}
            {onExport && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onExport('pdf')}
                    disabled={loading}
                  >
                    Exportar PDF
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onExport('excel')}
                    disabled={loading}
                  >
                    Exportar Excel
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onExport('notion')}
                    disabled={loading}
                  >
                    Exportar Notion
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Collapse>

        {/* Resumen de filtros activos */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Filtros activos:
            </Typography>
            {filters.professionalId && (
              <Chip
                label={`Profesional: ${professionals.find(p => p.id === filters.professionalId)?.name || 'Desconocido'}`}
                size="small"
                onDelete={() => handleFilterChange('professionalId', undefined)}
              />
            )}
            {filters.patientId && (
              <Chip
                label={`Paciente: ${patients.find(p => p.id === filters.patientId)?.name || 'Desconocido'}`}
                size="small"
                onDelete={() => handleFilterChange('patientId', undefined)}
              />
            )}
            {filters.sessionType && (
              <Chip
                label={`Tipo: ${filters.sessionType}`}
                size="small"
                onDelete={() => handleFilterChange('sessionType', undefined)}
              />
            )}
            {filters.emotionalTone && (
              <Chip
                label={`Emoción: ${filters.emotionalTone}`}
                size="small"
                onDelete={() => handleFilterChange('emotionalTone', undefined)}
              />
            )}
            {filters.alertType && (
              <Chip
                label={`Alerta: ${filters.alertType}`}
                size="small"
                onDelete={() => handleFilterChange('alertType', undefined)}
              />
            )}
            {filters.includeInactive && (
              <Chip
                label="Incluye inactivos"
                size="small"
                onDelete={() => handleFilterChange('includeInactive', false)}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
