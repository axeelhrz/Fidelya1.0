import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { SessionFilters, SessionStatus } from '../../../types/session';

interface SessionFiltersProps {
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
  onClearFilters: () => void;
}

const SessionFiltersComponent: React.FC<SessionFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleStatusChange = (status: SessionStatus | '') => {
    onFiltersChange({
      ...filters,
      status: status || undefined,
    });
  };

  const handlePatientNameChange = (patientName: string) => {
    onFiltersChange({
      ...filters,
      patientName: patientName || undefined,
    });
  };

  const handleTimeRangeChange = (timeRange: 'morning' | 'afternoon' | 'evening' | '') => {
    onFiltersChange({
      ...filters,
      timeRange: timeRange || undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="action" />
          <TextField
            label="Buscar paciente"
            variant="outlined"
            size="small"
            value={filters.patientName || ''}
            onChange={(e) => handlePatientNameChange(e.target.value)}
            sx={{ minWidth: 200 }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.status || ''}
            label="Estado"
            onChange={(e) => handleStatusChange(e.target.value as SessionStatus)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="confirmada">Confirmada</MenuItem>
            <MenuItem value="en_curso">En Curso</MenuItem>
            <MenuItem value="finalizada">Finalizada</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Horario</InputLabel>
          <Select
            value={filters.timeRange || ''}
            label="Horario"
            onChange={(e) =>
              handleTimeRangeChange(
                (e.target as HTMLInputElement).value as 'morning' | 'afternoon' | 'evening' | ''
              )
            }
          >
            <MenuItem value="">Todo el día</MenuItem>
            <MenuItem value="morning">Mañana (6-12h)</MenuItem>
            <MenuItem value="afternoon">Tarde (12-18h)</MenuItem>
            <MenuItem value="evening">Noche (18-24h)</MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Tooltip title="Limpiar filtros">
            <IconButton onClick={onClearFilters} size="small">
              <Clear />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {hasActiveFilters && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {filters.status && (
            <Chip
              label={`Estado: ${filters.status}`}
              onDelete={() => handleStatusChange('')}
              size="small"
            />
          )}
          {filters.patientName && (
            <Chip
              label={`Paciente: ${filters.patientName}`}
              onDelete={() => handlePatientNameChange('')}
              size="small"
            />
          )}
          {filters.timeRange && (
            <Chip
              label={`Horario: ${filters.timeRange}`}
              onDelete={() => handleTimeRangeChange('')}
              size="small"
            />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default SessionFiltersComponent;
