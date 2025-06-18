'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
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
  const [localFilters, setLocalFilters] = useState<SessionFiltersType>(filters);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SessionFiltersType, value: any) => {
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
      <Card>
        <CardContent>
          {/* Filtros básicos siempre visibles */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar sesiones"
                placeholder="Buscar por notas, observaciones..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={3}>
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
                  />
                )}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {SESSION_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {SESSION_STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  startIcon={<FilterListIcon />}
                  disabled={loading}
                  fullWidth
                >
                  Filtrar
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Filtros avanzados */}
          <Accordion 
            expanded={expanded} 
            onChange={(_, isExpanded) => setExpanded(isExpanded)}
            sx={{ mt: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2">
                  Filtros Avanzados
                </Typography>
                {activeFiltersCount > 0 && (
                  <Chip 
                    label={`${activeFiltersCount} activo${activeFiltersCount !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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
                      />
                    )}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Tipo de Sesión</InputLabel>
                    <Select
                      value={localFilters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      label="Tipo de Sesión"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {SESSION_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {SESSION_TYPE_LABELS[type]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Estado Emocional</InputLabel>
                    <Select
                      value={localFilters.emotionalTone || ''}
                      onChange={(e) => handleFilterChange('emotionalTone', e.target.value)}
                      label="Estado Emocional"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {EMOTIONAL_TONES.map((tone) => (
                        <MenuItem key={tone} value={tone}>
                          {tone}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Nivel de Riesgo</InputLabel>
                    <Select
                      value={localFilters.riskLevel || ''}
                      onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                      label="Nivel de Riesgo"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="low">{RISK_LEVEL_LABELS.low}</MenuItem>
                      <MenuItem value="medium">{RISK_LEVEL_LABELS.medium}</MenuItem>
                      <MenuItem value="high">{RISK_LEVEL_LABELS.high}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Fecha desde"
                    value={localFilters.dateRange?.start ? new Date(localFilters.dateRange.start) : null}
                    onChange={(date) => handleDateRangeChange('start', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        disabled: loading
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Fecha hasta"
                    value={localFilters.dateRange?.end ? new Date(localFilters.dateRange.end) : null}
                    onChange={(date) => handleDateRangeChange('end', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        disabled: loading
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localFilters.hasAIAnalysis === true}
                        onChange={(e) => handleFilterChange('hasAIAnalysis', e.target.checked ? true : undefined)}
                        disabled={loading}
                      />
                    }
                    label="Solo sesiones con análisis de IA"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      startIcon={<ClearIcon />}
                      disabled={loading || activeFiltersCount === 0}
                    >
                      Limpiar Filtros
                    </Button>
                    <Button
                      variant="contained"
                      onClick={applyFilters}
                      startIcon={<FilterListIcon />}
                      disabled={loading}
                    >
                      Aplicar Filtros
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Chips de filtros activos */}
          {activeFiltersCount > 0 && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Filtros activos:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {localFilters.search && (
                  <Chip
                    label={`Búsqueda: "${localFilters.search}"`}
                    onDelete={() => handleFilterChange('search', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.patientId && (
                  <Chip
                    label={`Paciente: ${patients.find(p => p.id === localFilters.patientId)?.fullName}`}
                    onDelete={() => handleFilterChange('patientId', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.professionalId && (
                  <Chip
                    label={`Profesional: ${professionals.find(p => p.uid === localFilters.professionalId)?.displayName}`}
                    onDelete={() => handleFilterChange('professionalId', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.status && (
                  <Chip
                    label={`Estado: ${SESSION_STATUS_LABELS[localFilters.status]}`}
                    onDelete={() => handleFilterChange('status', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.type && (
                  <Chip
                    label={`Tipo: ${SESSION_TYPE_LABELS[localFilters.type]}`}
                    onDelete={() => handleFilterChange('type', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.emotionalTone && (
                  <Chip
                    label={`Emoción: ${localFilters.emotionalTone}`}
                    onDelete={() => handleFilterChange('emotionalTone', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.riskLevel && (
                  <Chip
                    label={`Riesgo: ${RISK_LEVEL_LABELS[localFilters.riskLevel]}`}
                    onDelete={() => handleFilterChange('riskLevel', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.hasAIAnalysis && (
                  <Chip
                    label="Con análisis IA"
                    onDelete={() => handleFilterChange('hasAIAnalysis', undefined)}
                    size="small"
                    variant="outlined"
                  />
                )}
                {localFilters.dateRange && (
                  <Chip
                    label={`Período: ${localFilters.dateRange.start || '...'} - ${localFilters.dateRange.end || '...'}`}
                    onDelete={() => handleFilterChange('dateRange', undefined)}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
