import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Grid,
  Typography,
  Collapse,
  IconButton,
  Stack,
  Autocomplete,
  DatePicker,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  CalendarToday,
  Person,
  Psychology,
} from '@mui/icons-material';
import { SessionStatus, EmotionalState } from '../../../types/session';
import { SessionHistoryFilters } from '../../../hooks/useSessionHistory';
import EmotionalStateIcon from '../../ui/EmotionalStateIcon';
import StatusBadge from '../../ui/StatusBadge';

interface SessionHistoryFiltersProps {
  filters: SessionHistoryFilters;
  onFiltersChange: (filters: SessionHistoryFilters) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const statusOptions: { value: SessionStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'en_curso', label: 'En Curso' },
  { value: 'finalizada', label: 'Finalizada' },
  { value: 'cancelada', label: 'Cancelada' },
];

const emotionalStateOptions: { value: EmotionalState; label: string }[] = [
  { value: 'muy_positivo', label: 'Muy Positivo' },
  { value: 'positivo', label: 'Positivo' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'ansioso', label: 'Ansioso' },
  { value: 'triste', label: 'Triste' },
  { value: 'irritado', label: 'Irritado' },
  { value: 'confundido', label: 'Confundido' },
];

const SessionHistoryFilters: React.FC<SessionHistoryFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof SessionHistoryFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <Card 
      sx={{ 
        mb: 3,
        border: hasActiveFilters ? '2px solid' : '1px solid',
        borderColor: hasActiveFilters ? 'primary.main' : 'divider',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ pb: expanded ? 2 : 1 }}>
        {/* Barra de búsqueda principal */}
        <Box sx={{ mb: expanded ? 3 : 0 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar en notas, resúmenes, motivos de consulta..."
                value={filters.searchText || ''}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: filters.searchText && (
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange('searchText', '')}
                    >
                      <Clear />
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre de paciente..."
                value={filters.patientName || ''}
                onChange={(e) => handleFilterChange('patientName', e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: filters.patientName && (
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange('patientName', '')}
                    >
                      <Clear />
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant={expanded ? "contained" : "outlined"}
                  startIcon={<FilterList />}
                  endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => setExpanded(!expanded)}
                  disabled={loading}
                  sx={{ minWidth: 'auto' }}
                >
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Chip
                      label={activeFiltersCount}
                      size="small"
                      color="primary"
                      sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                    />
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="text"
                    startIcon={<Clear />}
                    onClick={onClearFilters}
                    disabled={loading}
                    color="error"
                    size="small"
                  >
                    Limpiar
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Filtros avanzados */}
        <Collapse in={expanded}>
          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList color="primary" />
              Filtros Avanzados
            </Typography>

            <Grid container spacing={3}>
              {/* Filtros de fecha */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="primary" />
                  Rango de Fechas
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="date"
                    label="Desde"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="Hasta"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>
              </Grid>

              {/* Filtro por estado */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Estado de Sesión
                </Typography>
                <Autocomplete
                  multiple
                  options={statusOptions}
                  getOptionLabel={(option) => option.label}
                  value={statusOptions.filter(option => filters.status?.includes(option.value)) || []}
                  onChange={(_, newValue) => {
                    handleFilterChange('status', newValue.map(item => item.value));
                  }}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <StatusBadge
                        key={option.value}
                        status={option.value}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <StatusBadge status={option.value} size="small" sx={{ mr: 1 }} />
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Seleccionar estados..."
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              {/* Filtro por estado emocional */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology fontSize="small" color="primary" />
                  Estado Emocional
                </Typography>
                <Autocomplete
                  multiple
                  options={emotionalStateOptions}
                  getOptionLabel={(option) => option.label}
                  value={emotionalStateOptions.filter(option => filters.emotionalState?.includes(option.value)) || []}
                  onChange={(_, newValue) => {
                    handleFilterChange('emotionalState', newValue.map(item => item.value));
                  }}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        {...getTagProps({ index })}
                        size="small"
                        icon={<EmotionalStateIcon state={option.value} size="small" />}
                        variant="outlined"
                      />
                    ))
                  }
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmotionalStateIcon state={option.value} size="small" />
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Seleccionar estados emocionales..."
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Resumen de filtros activos */}
            {hasActiveFilters && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="primary.main">
                  Filtros Activos:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {filters.dateFrom && (
                    <Chip
                      label={`Desde: ${filters.dateFrom}`}
                      size="small"
                      onDelete={() => handleFilterChange('dateFrom', '')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.dateTo && (
                    <Chip
                      label={`Hasta: ${filters.dateTo}`}
                      size="small"
                      onDelete={() => handleFilterChange('dateTo', '')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.status?.map(status => (
                    <StatusBadge
                      key={status}
                      status={status}
                      size="small"
                      onDelete={() => {
                        const newStatuses = filters.status?.filter(s => s !== status) || [];
                        handleFilterChange('status', newStatuses);
                      }}
                    />
                  ))}
                  {filters.emotionalState?.map(emotion => (
                    <Chip
                      key={emotion}
                      label={emotionalStateOptions.find(opt => opt.value === emotion)?.label}
                      size="small"
                      icon={<EmotionalStateIcon state={emotion} size="small" />}
                      onDelete={() => {
                        const newEmotions = filters.emotionalState?.filter(e => e !== emotion) || [];
                        handleFilterChange('emotionalState', newEmotions);
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SessionHistoryFilters;
