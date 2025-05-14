import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarMonthIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TaskFilters {
  status: string;
  priority: string;
  dateFilter: string;
  searchQuery: string;
}

interface TaskFiltersComponentProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

export const TaskFiltersComponent: React.FC<TaskFiltersComponentProps> = ({
  filters,
  onFilterChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);

  const handleFilterChange = (field: keyof TaskFilters, value: string) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('searchQuery', event.target.value);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      status: 'todas',
      priority: 'todas',
      dateFilter: 'todas',
      searchQuery: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleRemoveFilter = (field: keyof TaskFilters) => {
    handleFilterChange(field, 'todas');
  };

  const handleRemoveSearch = () => {
    handleFilterChange('searchQuery', '');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    localFilters.status !== 'todas' ||
    localFilters.priority !== 'todas' ||
    localFilters.dateFilter !== 'todas' ||
    localFilters.searchQuery !== '';

  return (
    <Paper
      elevation={0}
      component={motion.div}
      sx={{
        p: 3,
        borderRadius: '24px',
        background: isDark
          ? alpha(theme.palette.background.paper, 0.6)
          : alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${
          isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        }`,
      }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Filtros
            </Typography>
          </Stack>
          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ textTransform: 'none' }}
            >
              Limpiar filtros
            </Button>
          )}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: '100%' }}
        >
          <TextField
            id="task-search-input"
            fullWidth
            placeholder="Buscar tareas..."
            variant="outlined"
            size="small"
            value={localFilters.searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: localFilters.searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleRemoveSearch}
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          />

          <TextField
            select
            fullWidth
            label="Estado"
            variant="outlined"
            size="small"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            <MenuItem value="todas">Todas</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="en_progreso">En Progreso</MenuItem>
            <MenuItem value="completada">Completada</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Prioridad"
            variant="outlined"
            size="small"
            value={localFilters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlagIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            <MenuItem value="todas">Todas</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="baja">Baja</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Fecha"
            variant="outlined"
            size="small"
            value={localFilters.dateFilter}
            onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            <MenuItem value="todas">Todas</MenuItem>
            <MenuItem value="hoy">Hoy</MenuItem>
            <MenuItem value="esta_semana">Esta semana</MenuItem>
            <MenuItem value="este_mes">Este mes</MenuItem>
            <MenuItem value="vencidas">Vencidas</MenuItem>
          </TextField>
        </Stack>

        {/* Chips de filtros activos */}
        {hasActiveFilters && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {localFilters.status !== 'todas' && (
              <Chip
                label={`Estado: ${
                  localFilters.status === 'pendiente'
                    ? 'Pendiente'
                    : localFilters.status === 'en_progreso'
                    ? 'En Progreso'
                    : 'Completada'
                }`}
                onDelete={() => handleRemoveFilter('status')}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            )}
            {localFilters.priority !== 'todas' && (
              <Chip
                label={`Prioridad: ${
                  localFilters.priority === 'alta'
                    ? 'Alta'
                    : localFilters.priority === 'media'
                    ? 'Media'
                    : 'Baja'
                }`}
                onDelete={() => handleRemoveFilter('priority')}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            )}
            {localFilters.dateFilter !== 'todas' && (
              <Chip
                label={`Fecha: ${
                  localFilters.dateFilter === 'hoy'
                    ? 'Hoy'
                    : localFilters.dateFilter === 'esta_semana'
                    ? 'Esta semana'
                    : localFilters.dateFilter === 'este_mes'
                    ? 'Este mes'
                    : 'Vencidas'
                }`}
                onDelete={() => handleRemoveFilter('dateFilter')}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            )}
            {localFilters.searchQuery && (
              <Chip
                label={`Búsqueda: ${localFilters.searchQuery}`}
                onDelete={handleRemoveSearch}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            )}
          </Box>
        )}
      </Stack>
    </Paper>
  );
};