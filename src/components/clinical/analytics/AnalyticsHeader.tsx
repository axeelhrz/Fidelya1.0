'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  BarChart3,
  Filter,
  RefreshCw,
  Download,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { AnalyticsFilters } from '@/types/analytics';

interface AnalyticsHeaderProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: Partial<AnalyticsFilters>) => void;
  onRefresh: () => void;
  onExport: (format: 'json' | 'csv') => void;
  loading?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function AnalyticsHeader({
  filters,
  onFiltersChange,
  onRefresh,
  onExport,
  loading = false,
  isDarkMode = false,
  onToggleDarkMode
}: AnalyticsHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | null) => {
    if (date) {
      onFiltersChange({
        dateRange: {
          ...filters.dateRange,
          [field]: date
        }
      });
    }
  };

  const clearFilter = (filterKey: keyof AnalyticsFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.patientId) count++;
    if (filters.sessionType) count++;
    if (filters.alertLevel) count++;
    return count;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
            borderRadius: 3,
            p: 3,
            mb: 3,
            border: '1px solid rgba(16, 185, 129, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Efectos de fondo */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Header principal */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <BarChart3 size={28} color="white" />
                  </Box>
                </motion.div>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Space Grotesk, sans-serif',
                      color: '#065F46',
                      textShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
                    }}
                  >
                    Analytics / Métricas Clínicas
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#047857',
                      fontWeight: 600,
                      mt: 0.5
                    }}
                  >
                    Visualizá la evolución de tu trabajo clínico y optimizá tu práctica
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {onToggleDarkMode && (
                  <Tooltip title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}>
                    <IconButton
                      onClick={onToggleDarkMode}
                      sx={{
                        p: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 1.5,
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)'
                        }
                      }}
                    >
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Actualizar datos">
                  <IconButton
                    onClick={onRefresh}
                    disabled={loading}
                    sx={{
                      p: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 1.5,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                  >
                    <motion.div
                      animate={loading ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                    >
                      <RefreshCw size={18} />
                    </motion.div>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Controles de filtros y acciones */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              {/* Selector de rango de fechas */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DatePicker
                  label="Fecha inicio"
                  value={filters.dateRange.start}
                  onChange={(date) => handleDateRangeChange('start', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }
                    }
                  }}
                />

                <DatePicker
                  label="Fecha fin"
                  value={filters.dateRange.end}
                  onChange={(date) => handleDateRangeChange('end', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }
                    }
                  }}
                />

                <Button
                  variant="outlined"
                  startIcon={<Filter size={16} />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 1.5,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#065F46',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }
                  }}
                >
                  Filtros
                  {getActiveFiltersCount() > 0 && (
                    <Chip
                      label={getActiveFiltersCount()}
                      size="small"
                      sx={{
                        ml: 1,
                        height: 20,
                        backgroundColor: '#10B981',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                </Button>
              </Box>

              {/* Botones de exportación */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Download size={16} />}
                  onClick={() => onExport('csv')}
                  sx={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                    }
                  }}
                >
                  Exportar CSV
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  onClick={() => onExport('json')}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 1.5,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#065F46',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }
                  }}
                >
                  Exportar JSON
                </Button>
              </Box>
            </Box>

            {/* Panel de filtros expandible */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: '#065F46', fontWeight: 600 }}>
                    Filtros Avanzados
                  </Typography>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Tipo de Sesión</InputLabel>
                      <Select
                        value={filters.sessionType || ''}
                        onChange={(e) => onFiltersChange({ sessionType: e.target.value as 'individual' | 'group' | 'family' | 'couple' | undefined })}
                        label="Tipo de Sesión"
                      >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="individual">Individual</MenuItem>
                        <MenuItem value="group">Grupal</MenuItem>
                        <MenuItem value="family">Familiar</MenuItem>
                        <MenuItem value="couple">Pareja</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Nivel de Alerta</InputLabel>
                      <Select
                        value={filters.alertLevel || ''}
                        onChange={(e) => onFiltersChange({ alertLevel: e.target.value as 'low' | 'medium' | 'high' | 'critical' | undefined })}
                        label="Nivel de Alerta"
                      >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="low">Bajo</MenuItem>
                        <MenuItem value="medium">Medio</MenuItem>
                                                <MenuItem value="high">Alto</MenuItem>
                        <MenuItem value="critical">Crítico</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="text"
                      onClick={() => {
                        onFiltersChange({
                          sessionType: undefined,
                          alertLevel: undefined,
                          patientId: undefined
                        });
                      }}
                      sx={{
                        color: '#065F46',
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                  </Stack>

                  {/* Chips de filtros activos */}
                  {getActiveFiltersCount() > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: '#065F46', fontWeight: 500 }}>
                        Filtros activos:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {filters.sessionType && (
                          <Chip
                            label={`Tipo: ${filters.sessionType}`}
                            onDelete={() => clearFilter('sessionType')}
                            deleteIcon={<X size={14} />}
                            sx={{
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#065F46',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}
                          />
                        )}
                        {filters.alertLevel && (
                          <Chip
                            label={`Alerta: ${filters.alertLevel}`}
                            onDelete={() => clearFilter('alertLevel')}
                            deleteIcon={<X size={14} />}
                            sx={{
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#065F46',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </Box>
        </Paper>
      </motion.div>
    </LocalizationProvider>
  );
}

