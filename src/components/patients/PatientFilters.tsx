'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
} from '@mui/icons-material';
import { PatientFilters, EMOTIONAL_STATES, GENDERS, GENDER_LABELS } from '@/types/patient';
import { User } from '@/types/auth';

interface PatientFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  psychologists: User[];
}

export default function PatientFiltersComponent({ 
  filters, 
  onFiltersChange, 
  psychologists 
}: PatientFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<PatientFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof PatientFilters, value: PatientFilters[keyof PatientFilters]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAgeRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    const newAgeRange = { ...localFilters.ageRange, [type]: numValue };
    handleFilterChange('ageRange', newAgeRange);
  };

  const clearFilters = () => {
    const emptyFilters: PatientFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.gender) count++;
    if (localFilters.emotionalState) count++;
    if (localFilters.assignedPsychologist) count++;
    if (localFilters.status) count++;
    if (localFilters.ageRange?.min || localFilters.ageRange?.max) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">
            Filtros
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Box>
          {activeFiltersCount > 0 && (
            <Button
              startIcon={<Clear />}
              onClick={clearFilters}
              size="small"
              sx={{ mr: 1 }}
            >
              Limpiar
            </Button>
          )}
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Búsqueda rápida - siempre visible */}
      <TextField
        fullWidth
        label="Buscar paciente..."
        placeholder="Nombre o motivo de consulta"
        value={localFilters.search || ''}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        sx={{ mb: expanded ? 2 : 0 }}
      />

      {/* Filtros avanzados - colapsables */}
      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Primera fila de filtros */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': {
                flex: '1 1 200px',
                minWidth: '200px'
              }
            }}
          >
            <FormControl>
              <InputLabel>Género</InputLabel>
              <Select
                value={localFilters.gender || ''}
                label="Género"
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {GENDERS.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {GENDER_LABELS[gender]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Estado Emocional</InputLabel>
              <Select
                value={localFilters.emotionalState || ''}
                label="Estado Emocional"
                onChange={(e) => handleFilterChange('emotionalState', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {EMOTIONAL_STATES.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Psicólogo Asignado</InputLabel>
              <Select
                value={localFilters.assignedPsychologist || ''}
                label="Psicólogo Asignado"
                onChange={(e) => handleFilterChange('assignedPsychologist', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {psychologists.map((psychologist) => (
                  <MenuItem key={psychologist.uid} value={psychologist.uid}>
                    {psychologist.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Estado</InputLabel>
              <Select
                value={localFilters.status || ''}
                label="Estado"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
                <MenuItem value="discharged">Dado de alta</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Segunda fila - Rango de edad */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': {
                flex: '1 1 200px',
                minWidth: '200px'
              }
            }}
          >
            <TextField
              label="Edad mínima"
              type="number"
              value={localFilters.ageRange?.min || ''}
              onChange={(e) => handleAgeRangeChange('min', e.target.value)}
              inputProps={{ min: 0, max: 120 }}
            />

            <TextField
              label="Edad máxima"
              type="number"
              value={localFilters.ageRange?.max || ''}
              onChange={(e) => handleAgeRangeChange('max', e.target.value)}
              inputProps={{ min: 0, max: 120 }}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}