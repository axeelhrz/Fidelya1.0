'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Paper,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { VideoCallFilters as VideoCallFiltersType, VideoCallStatus } from '../../../types/videocall';

interface VideoCallFiltersProps {
  filters: VideoCallFiltersType;
  onFiltersChange: (filters: VideoCallFiltersType) => void;
  onClearFilters: () => void;
}

const statusOptions: { value: VideoCallStatus; label: string; color: string }[] = [
  { value: 'programada', label: 'Programada', color: '#2196f3' },
  { value: 'confirmada', label: 'Confirmada', color: '#4caf50' },
  { value: 'en_curso', label: 'En Curso', color: '#ff9800' },
  { value: 'finalizada', label: 'Finalizada', color: '#9e9e9e' },
  { value: 'cancelada', label: 'Cancelada', color: '#f44336' }
];

export const VideoCallFilters: React.FC<VideoCallFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<VideoCallFiltersType>(filters);

  const handleFilterChange = (field: keyof VideoCallFiltersType, value: VideoCallFiltersType[keyof VideoCallFiltersType]) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="primary" />
            <Typography variant="h6" color="primary">
              Filtros de Búsqueda
            </Typography>
            {hasActiveFilters && (
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length}
              </Box>
            )}
          </Box>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Búsqueda rápida siempre visible */}
        <Box sx={{ display: 'flex', gap: 2, mb: expanded ? 2 : 0 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre del paciente..."
            value={localFilters.patientName || ''}
            onChange={(e) => handleFilterChange('patientName', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            sx={{ minWidth: 120 }}
          >
            Buscar
          </Button>
        </Box>

        <Collapse in={expanded}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Motivo de consulta"
                placeholder="Buscar por motivo..."
                value={localFilters.motive || ''}
                onChange={(e) => handleFilterChange('motive', e.target.value)}
              />
              
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={localFilters.status || ''}
                  label="Estado"
                  onChange={(e) => handleFilterChange('status', e.target.value as VideoCallStatus)}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: option.color
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <DatePicker
                label="Fecha desde"
                value={localFilters.dateFrom || null}
                onChange={(date) => handleFilterChange('dateFrom', date || undefined)}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
              
              <DatePicker
                label="Fecha hasta"
                value={localFilters.dateTo || null}
                onChange={(date) => handleFilterChange('dateTo', date || undefined)}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleApplyFilters}
              >
                Aplicar Filtros
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
};
