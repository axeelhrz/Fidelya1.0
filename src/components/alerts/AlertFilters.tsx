'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  PersonOff as PersonOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  AlertFilters,
  ALERT_TYPES,
  ALERT_TRIGGERS,
  ALERT_URGENCIES,
  ALERT_STATUSES,
  ALERT_TYPE_LABELS,
  ALERT_TRIGGER_LABELS,
  ALERT_URGENCY_LABELS,
  ALERT_STATUS_LABELS,
} from '@/types/alert';
import { Patient } from '@/types/patient';

interface AlertFiltersProps {
  filters: AlertFilters;
  patients: Patient[];
  onFiltersChange: (filters: AlertFilters) => void;
  onClearFilters: () => void;
}

export default function AlertFiltersComponent({
  filters,
  patients,
  onFiltersChange,
  onClearFilters,
}: AlertFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const handleFilterChange = (key: keyof AlertFilters, value: string | boolean | null | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: Date | null) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'dateRange' && value) {
        return value.start || value.end;
      }
      return value !== undefined && value !== '' && value !== null;
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'dateRange' && value) {
        if (value.start) count++;
        if (value.end) count++;
      } else if (value !== undefined && value !== '' && value !== null) {
        count++;
      }
    });
    return count;
  };

  const selectedPatient = patients.find(p => p.id === filters.patientId);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          pb: 2,
          bgcolor: 'primary.50',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FilterIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600} color="primary.main">
                Filtros de Alertas
              </Typography>
              {hasActiveFilters() && (
                <Chip 
                  label={`${getActiveFiltersCount()} activos`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {hasActiveFilters() && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={onClearFilters}
                  sx={{ borderRadius: 2 }}
                >
                  Limpiar
                </Button>
              )}
              <IconButton
                onClick={() => setExpanded(!expanded)}
                size="small"
                sx={{ 
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Filtros básicos siempre visibles */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Búsqueda y filtros principales */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr' },
              gap: 2 
            }}>
              <TextField
                label="Buscar alertas"
                placeholder="Título, descripción, notas..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <FormControl size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Estado"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  {ALERT_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {ALERT_STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small">
                <InputLabel>Urgencia</InputLabel>
                <Select
                  value={filters.urgency || ''}
                  label="Urgencia"
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Todas las urgencias</MenuItem>
                  {ALERT_URGENCIES.map((urgency) => (
                    <MenuItem key={urgency} value={urgency}>
                      {ALERT_URGENCY_LABELS[urgency]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Filtros rápidos con chips */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.secondary">
                Filtros Rápidos
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                  label="Solo Automáticas"
                  clickable
                  color={filters.autoGenerated ? 'primary' : 'default'}
                  variant={filters.autoGenerated ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('autoGenerated', !filters.autoGenerated)}
                  sx={{ borderRadius: 2 }}
                />
                
                <Chip
                  icon={<WarningIcon sx={{ fontSize: 16 }} />}
                  label="Alta Urgencia"
                  clickable
                  color={filters.urgency === 'alta' ? 'error' : 'default'}
                  variant={filters.urgency === 'alta' ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('urgency', filters.urgency === 'alta' ? '' : 'alta')}
                  sx={{ borderRadius: 2 }}
                />
                
                <Chip
                  icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                  label="Programadas"
                  clickable
                  color={filters.trigger === 'fecha_programada' ? 'info' : 'default'}
                  variant={filters.trigger === 'fecha_programada' ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('trigger', filters.trigger === 'fecha_programada' ? '' : 'fecha_programada')}
                  sx={{ borderRadius: 2 }}
                />
                
                <Chip
                  icon={<PersonOffIcon sx={{ fontSize: 16 }} />}
                  label="Inactividad"
                  clickable
                  color={filters.type === 'inactividad' ? 'warning' : 'default'}
                  variant={filters.type === 'inactividad' ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('type', filters.type === 'inactividad' ? '' : 'inactividad')}
                  sx={{ borderRadius: 2 }}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Filtros avanzados colapsables */}
        <Collapse in={expanded}>
          <Box sx={{ px: 3, pb: 3, borderTop: 1, borderColor: 'divider', pt: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
              Filtros Avanzados
            </Typography>
            
            <Stack spacing={3}>
              {/* Filtros por tipo y trigger */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2 
              }}>
                <FormControl size="small">
                  <InputLabel>Tipo de Alerta</InputLabel>
                  <Select
                    value={filters.type || ''}
                    label="Tipo de Alerta"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">Todos los tipos</MenuItem>
                    {ALERT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {ALERT_TYPE_LABELS[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <InputLabel>Disparador</InputLabel>
                  <Select
                    value={filters.trigger || ''}
                    label="Disparador"
                    onChange={(e) => handleFilterChange('trigger', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">Todos los disparadores</MenuItem>
                    {ALERT_TRIGGERS.map((trigger) => (
                      <MenuItem key={trigger} value={trigger}>
                        {ALERT_TRIGGER_LABELS[trigger]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtro por paciente */}
              <Autocomplete
                value={selectedPatient || null}
                onChange={(_, newValue) => handleFilterChange('patientId', newValue?.id || '')}
                options={patients}
                getOptionLabel={(option) => option.fullName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filtrar por Paciente"
                    placeholder="Buscar paciente..."
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {option.fullName.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="body2">{option.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />

              {/* Filtros de fecha */}
              <Box>
                <Typography variant="body2" gutterBottom fontWeight={600} color="text.secondary">
                  Rango de Fechas
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2 
                }}>
                  <DatePicker
                    label="Fecha desde"
                    value={filters.dateRange?.start ? new Date(filters.dateRange.start) : null}
                    onChange={(date) => handleDateRangeChange('start', date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                      },
                    }}
                  />

                  <DatePicker
                    label="Fecha hasta"
                    value={filters.dateRange?.end ? new Date(filters.dateRange.end) : null}
                    onChange={(date) => handleDateRangeChange('end', date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                      },
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
}