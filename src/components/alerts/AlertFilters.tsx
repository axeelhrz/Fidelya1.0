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
} from '@/types/alert';

// Constants for alert types, urgencies, and statuses
const ALERT_TYPES: AlertType[] = ['appointment', 'medication', 'followup', 'emergency', 'custom'];
const ALERT_URGENCIES: AlertUrgency[] = ['low', 'medium', 'high', 'critical'];
const ALERT_STATUSES: AlertStatus[] = ['active', 'resolved', 'cancelled', 'expired'];

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  appointment: 'Cita',
  medication: 'Medicación',
  followup: 'Seguimiento',
  emergency: 'Emergencia',
  custom: 'Personalizada',
};

const ALERT_URGENCY_LABELS: Record<AlertUrgency, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  active: 'Activa',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
  expired: 'Expirada',
};

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

  const handleFilterChange = (key: keyof AlertFilters, value: string | boolean | Date | null | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
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
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 2,
            '& > *': {
              flex: '1 1 250px',
              minWidth: '250px'
            }
          }}
        >
          <TextField
            label="Buscar"
            placeholder="Descripción, notas..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="small"
          />
          
          <FormControl size="small">
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
          
          <FormControl size="small">
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
        </Box>

        {/* Filtros avanzados colapsables */}
        <Collapse in={expanded}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              alignItems: 'center',
              '& > *': {
                flex: '1 1 250px',
                minWidth: '250px'
              }
            }}
          >
            <FormControl size="small">
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

            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'auto' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.isAutoGenerated || false}
                    onChange={(e) => handleFilterChange('isAutoGenerated', e.target.checked)}
                  />
                }
                label="Solo alertas automáticas"
              />
            </Box>

            <DatePicker
              label="Fecha desde"
              value={filters.dateFrom ? new Date(filters.dateFrom) : null}
              onChange={(date) => handleFilterChange('dateFrom', date)}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
            />

            <DatePicker
              label="Fecha hasta"
              value={filters.dateTo ? new Date(filters.dateTo) : null}
              onChange={(date) => handleFilterChange('dateTo', date)}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
            />
          </Box>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
}
