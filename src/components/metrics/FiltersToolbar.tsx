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
          <Box sx={{ mt: 1 }}>
                        {/* Rango de fechas personalizado */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Rango de fechas personalizado
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
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
                            </Box>
                            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
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
                          </Box>
                        </Box>
            
                        {/* Otros filtros */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          <TextField
                            select
                            label="Profesional"
                            value={filters.professionalId || ''}
                            onChange={(e) => handleFilterChange('professionalId', e.target.value)}
                            size="small"
                            fullWidth
                          >
                            <MenuItem value="">Todos</MenuItem>
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
                          >
                            <MenuItem value="">Todos</MenuItem>
                            {patients.map((patient) => (
                              <MenuItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              );
            }