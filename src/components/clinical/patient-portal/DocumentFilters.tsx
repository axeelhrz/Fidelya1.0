import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Badge,
  useTheme,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  CalendarToday,
  Category,
  Label
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { DocumentFilter, DocumentStats, DocumentType } from '../../../types/documents';

interface DocumentFiltersProps {
  filters: DocumentFilter;
  onFiltersChange: (filters: DocumentFilter) => void;
  onClearFilters: () => void;
  stats: DocumentStats | null;
  loading?: boolean;
}

const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  stats,
  loading = false
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // ============================================================================
  // OPCIONES DE FILTROS
  // ============================================================================
  
  const documentTypes: { value: DocumentType; label: string; color: string }[] = [
    { value: 'consentimiento', label: 'Consentimiento', color: '#1976d2' },
    { value: 'informe', label: 'Informe', color: '#388e3c' },
    { value: 'receta', label: 'Receta', color: '#f57c00' },
    { value: 'constancia', label: 'Constancia', color: '#7b1fa2' },
    { value: 'psicoeducacion', label: 'Psicoeducación', color: '#0288d1' },
    { value: 'certificado', label: 'Certificado', color: '#d32f2f' },
    { value: 'evaluacion', label: 'Evaluación', color: '#5d4037' },
    { value: 'plan-tratamiento', label: 'Plan de Tratamiento', color: '#00796b' },
    { value: 'tarea', label: 'Tarea', color: '#303f9f' },
    { value: 'recurso', label: 'Recurso', color: '#689f38' },
    { value: 'otro', label: 'Otro', color: '#616161' }
  ];

  const categories = [
    { value: 'clinico', label: 'Clínico' },
    { value: 'administrativo', label: 'Administrativo' },
    { value: 'educativo', label: 'Educativo' },
    { value: 'legal', label: 'Legal' },
    { value: 'personal', label: 'Personal' }
  ];

  const readStatusOptions = [
    { value: true, label: 'Leídos' },
    { value: false, label: 'No leídos' }
  ];

  // Obtener tags únicos de las estadísticas (simulado)
  const availableTags = [
    'consentimiento', 'legal', 'tratamiento', 'evaluación', 'diagnóstico',
    'inicial', 'psicoeducación', 'ansiedad', 'técnicas', 'relajación',
    'certificado', 'médico', 'meditación', 'mindfulness', 'audio', 'práctica'
  ];

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value || undefined
    });
  };

  const handleTypeChange = (event: any) => {
    onFiltersChange({
      ...filters,
      type: event.target.value || undefined
    });
  };

  const handleCategoryChange = (event: any) => {
    onFiltersChange({
      ...filters,
      category: event.target.value || undefined
    });
  };

  const handleReadStatusChange = (event: any) => {
    onFiltersChange({
      ...filters,
      isRead: event.target.value !== '' ? event.target.value : undefined
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | null) => {
    if (!date) {
      if (field === 'start' && filters.dateRange?.end) {
        onFiltersChange({
          ...filters,
          dateRange: { start: new Date(), end: filters.dateRange.end }
        });
      } else if (field === 'end' && filters.dateRange?.start) {
        onFiltersChange({
          ...filters,
          dateRange: { start: filters.dateRange.start, end: new Date() }
        });
      } else {
        onFiltersChange({
          ...filters,
          dateRange: undefined
        });
      }
      return;
    }

    const currentRange = filters.dateRange || { start: new Date(), end: new Date() };
    onFiltersChange({
      ...filters,
      dateRange: {
        ...currentRange,
        [field]: date
      }
    });
  };

  const handleTagsChange = (event: any, newTags: string[]) => {
    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type) count++;
    if (filters.category) count++;
    if (filters.isRead !== undefined) count++;
    if (filters.dateRange) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ mb: 3 }}>
        {/* Búsqueda principal */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar documentos por título, descripción o etiquetas..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => onFiltersChange({ ...filters, search: undefined })}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Clear fontSize="small" />
                  </Button>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper
              }
            }}
          />
        </Box>

        {/* Filtros rápidos */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {/* Filtro por estado de lectura */}
          <Chip
            label={`No leídos (${stats?.unread || 0})`}
            variant={filters.isRead === false ? 'filled' : 'outlined'}
            color={filters.isRead === false ? 'primary' : 'default'}
            onClick={() => handleReadStatusChange({ target: { value: filters.isRead === false ? '' : false } })}
            disabled={loading}
            sx={{ cursor: 'pointer' }}
          />

          {/* Filtro por documentos recientes */}
          <Chip
            label={`Recientes (${stats?.recentlyAdded || 0})`}
            variant={filters.dateRange ? 'filled' : 'outlined'}
            color={filters.dateRange ? 'secondary' : 'default'}
            onClick={() => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              handleDateRangeChange('start', weekAgo);
              handleDateRangeChange('end', new Date());
            }}
            disabled={loading}
            sx={{ cursor: 'pointer' }}
          />

          {/* Botón de filtros avanzados */}
          <Badge badgeContent={getActiveFiltersCount()} color="primary">
            <Button
              variant={expanded ? 'contained' : 'outlined'}
              startIcon={<FilterList />}
              onClick={() => setExpanded(!expanded)}
              disabled={loading}
              size="small"
            >
              Filtros
            </Button>
          </Badge>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Clear />}
              onClick={onClearFilters}
              disabled={loading}
              size="small"
            >
              Limpiar
            </Button>
          )}
        </Stack>

        {/* Filtros avanzados */}
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">
              Filtros Avanzados
              {hasActiveFilters && (
                <Chip
                  label={`${getActiveFiltersCount()} activo${getActiveFiltersCount() !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          </AccordionSummary>
          
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Tipo de documento */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de documento</InputLabel>
                  <Select
                    value={filters.type || ''}
                    onChange={handleTypeChange}
                    label="Tipo de documento"
                    disabled={loading}
                    startAdornment={<Category sx={{ mr: 1, color: 'action.active' }} />}
                  >
                    <MenuItem value="">Todos los tipos</MenuItem>
                    {documentTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: type.color
                            }}
                          />
                          {type.label}
                          {stats?.byType[type.value] && (
                            <Chip
                              label={stats.byType[type.value]}
                              size="small"
                              sx={{ ml: 'auto', height: 16, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Categoría */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={filters.category || ''}
                    onChange={handleCategoryChange}
                    label="Categoría"
                    disabled={loading}
                  >
                    <MenuItem value="">Todas las categorías</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          {category.label}
                          {stats?.byCategory[category.value] && (
                            <Chip
                              label={stats.byCategory[category.value]}
                              size="small"
                              sx={{ height: 16, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Estado de lectura */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado de lectura</InputLabel>
                  <Select
                    value={filters.isRead !== undefined ? filters.isRead : ''}
                    onChange={handleReadStatusChange}
                    label="Estado de lectura"
                    disabled={loading}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {readStatusOptions.map((option) => (
                      <MenuItem key={option.value.toString()} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Fecha desde */}
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha desde"
                  value={filters.dateRange?.start || null}
                  onChange={(date) => handleDateRangeChange('start', date)}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" color="action" />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </Grid>

              {/* Fecha hasta */}
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha hasta"
                  value={filters.dateRange?.end || null}
                  onChange={(date) => handleDateRangeChange('end', date)}
                  disabled={loading}
                  minDate={filters.dateRange?.start}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" color="action" />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </Grid>

              {/* Etiquetas */}
              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  multiple
                  options={availableTags}
                  value={filters.tags || []}
                  onChange={handleTagsChange}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Etiquetas"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Label fontSize="small" color="action" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Estadísticas de filtros */}
            {stats && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Total de documentos: {stats.total} | 
                  No leídos: {stats.unread} | 
                  Agregados recientemente: {stats.recentlyAdded} |
                  Tamaño total: {(stats.totalSize / 1024 / 1024).toFixed(1)} MB
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </LocalizationProvider>
  );
};

export default DocumentFilters;
