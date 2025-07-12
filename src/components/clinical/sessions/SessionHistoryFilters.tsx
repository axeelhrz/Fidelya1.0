import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Chip,
  Button,
  Typography,
  Collapse,
  IconButton,
  Stack,
  Autocomplete,
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
import type { SessionHistoryFilters } from '../../../hooks/useSessionHistory';
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

  const handleFilterChange = (
    key: keyof SessionHistoryFilters,
    value: string | string[] | undefined
  ) => {
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 0.7fr auto'
              },
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Campo de búsqueda principal */}
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
            
            {/* Campo de búsqueda por paciente */}
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

            {/* Botones de acción */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                gridColumn: { xs: '1 / -1', md: 'auto' }
              }}
            >
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
          </Box>
        </Box>

        {/* Filtros avanzados */}
        <Collapse in={expanded}>
          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList color="primary" />
              Filtros Avanzados
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr'
                },
                gap: 3,
              }}
            >
              {/* Filtros de fecha */}
              <Box>
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
              </Box>

              {/* Filtro por estado */}
              <Box>
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
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <StatusBadge
                          key={key}
                          status={option.value}
                          {...tagProps}
                          size="small"
                        />
                      );
                    })
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
              </Box>
            </Box>

            {/* Filtro por estado emocional - Ocupa toda la fila */}
            <Box sx={{ mt: 3 }}>
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
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        label={option.label}
                        {...tagProps}
                        size="small"
                        icon={<EmotionalStateIcon state={option.value} size="small" />}
                        variant="outlined"
                      />
                    );
                  })
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
            </Box>

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