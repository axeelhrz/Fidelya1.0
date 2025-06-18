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
  Grid,
  Paper,
  Typography,
  Collapse,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  AlertFilters,
  AlertType,
  AlertUrgency,
  AlertStatus,
  ALERT_TYPES,
  ALERT_URGENCIES,
  ALERT_STATUSES,
  ALERT_TYPE_LABELS,
  ALERT_URGENCY_LABELS,
  ALERT_STATUS_LABELS,
} from '@/types/alert';

interface AlertFiltersProps {
  filters: AlertFilters;
  onFiltersChange: (filters: AlertFilters) => void;
  onClearFilters: () => void;
}

export default function AlertFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: AlertFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof AlertFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | null) => {
    const dateRange = filters.dateRange || {};
    onFiltersChange({
      ...filters,
      dateRange: {
        ...dateRange,
        [field]: date ? date.toISOString().split('T')[0] : undefined,
      },
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== '');
    }
    return value !== undefined && value !== '';
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            Filtros de Alertas
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
              >
                Limpiar
              </Button>
            )}
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Filtros básicos siempre visibles */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Descripción, notas..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status || ''}
                label="Estado"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {ALERT_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {ALERT_STATUS_LABELS[status]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Urgencia</InputLabel>
              <Select
                value={filters.urgency || ''}
                label="Urgencia"
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {ALERT_URGENCIES.map((urgency) => (
                  <MenuItem key={urgency} value={urgency}>
                    {ALERT_URGENCY_LABELS[urgency]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Filtros avanzados colapsables */}
        <Collapse in={expanded}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Alerta</InputLabel>
                <Select
                  value={filters.type || ''}
                  label="Tipo de Alerta"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {ALERT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {ALERT_TYPE_LABELS[type]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.autoGenerated || false}
                    onChange={(e) => handleFilterChange('autoGenerated', e.target.checked)}
                  />
                }
                label="Solo alertas automáticas"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Fecha desde"
                value={filters.dateRange?.start ? new Date(filters.dateRange.start) : null}
                onChange={(date) => handleDateRangeChange('start', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Fecha hasta"
                value={filters.dateRange?.end ? new Date(filters.dateRange.end) : null}
                onChange={(date) => handleDateRangeChange('end', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
}
