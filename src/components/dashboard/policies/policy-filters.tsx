'use client';
import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Chip,
  alpha,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Popover,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Slider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  DateRange as DateRangeIcon,
  AttachMoney as AttachMoneyIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from '@/types/policy';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

type PolicyStatus = 'active' | 'expired' | 'pending' | 'review' | 'cancelled';
// Define specific policy types for better type safety
type PolicyType = 
  | 'auto' 
  | 'health' 
  | 'life' 
  | 'home' 
  | 'business' 
  | 'travel' 
  | 'liability' 
  | 'renewal' 
  | 'other';


interface PolicyFiltersProps {
  filters: Filter;
  onFiltersChange: (filters: Filter) => void;
  companies: string[];
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export const POLICY_TYPE_OPTIONS: { value: PolicyType; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'health', label: 'Salud' },
  { value: 'life', label: 'Vida' },
  { value: 'home', label: 'Hogar' },
  { value: 'business', label: 'Negocio' },
  { value: 'travel', label: 'Viaje' },
  { value: 'liability', label: 'Responsabilidad Civil' },
  { value: 'renewal', label: 'Renovación' },
  { value: 'other', label: 'Otro' },
];



const PolicyFilters: React.FC<PolicyFiltersProps> = ({
  filters,
  onFiltersChange,
  companies,
  viewMode,
  onViewModeChange
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempFilters, setTempFilters] = useState<Filter>(filters);

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTempFilters(filters);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    handleCloseFilters();
  };

  const handleResetFilters = () => {
    const resetFilters: Filter = {
      search: '',
      searchTerm: '',
      status: [],
      company: [],
      type: [],
      startDate: null,
      endDate: null,
      dateRange: { start: null, end: null },
      minPremium: null,
      maxPremium: null,
      premium: { min: null, max: null },
      isStarred: false,
      onlyStarred: false,
      isArchived: false,
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
    handleCloseFilters();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: event.target.value };
    onFiltersChange(newFilters);
  };

  const handleClearSearch = () => {
    const newFilters = { ...filters, search: '' };
    onFiltersChange(newFilters);
  };

  const handleTempFilterChange = <T extends Filter[keyof Filter]>(key: keyof Filter, value: T) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusToggle = (status: PolicyStatus) => {
    const currentStatuses = tempFilters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    handleTempFilterChange('status', newStatuses);
  };

  const handleCompanyToggle = (company: string) => {
    const currentCompanies = tempFilters.company || [];
    const newCompanies = currentCompanies.includes(company)
      ? currentCompanies.filter(c => c !== company)
      : [...currentCompanies, company];
    
    handleTempFilterChange('company', newCompanies);
  };
  
  const handleTypeToggle = (type: PolicyType) => {
    const currentTypes = tempFilters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
  
    handleTempFilterChange('type', newTypes);
  };
  

  const handlePremiumChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      handleTempFilterChange('minPremium', newValue[0]);
      handleTempFilterChange('maxPremium', newValue[1]);
    }
  };

  const handleRemoveFilter = (key: keyof Filter, value?: string) => {
    const newFilters = { ...filters };
    
    if (key === 'search') {
      newFilters.search = '';
    } else if (key === 'status' && value) {
      newFilters.status = filters.status?.filter(s => s !== value as PolicyStatus) || [];
    } else if (key === 'company' && value) {
      newFilters.company = filters.company?.filter(c => c !== value) || [];
    } else if (key === 'type' && value) {
      newFilters.type = filters.type?.filter(t => t !== value) || [];
    } else if (key === 'startDate') {
      newFilters.startDate = null;
    } else if (key === 'endDate') {
      newFilters.endDate = null;
    } else if (key === 'premium') {
      newFilters.minPremium = null;
      newFilters.maxPremium = null;
    } else if (key === 'isStarred') {
      newFilters.isStarred = false;
    }
    
    onFiltersChange(newFilters);
  };

  const getStatusLabel = (status: PolicyStatus) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'expired': return 'Vencida';
      case 'pending': return 'Pendiente';
      case 'review': return 'En revisión';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'expired': return theme.palette.error.main;
      case 'pending': return theme.palette.warning.main;
      case 'review': return theme.palette.info.main;
      case 'cancelled': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const hasActiveFilters = () => {
    return (
      (filters.search && filters.search.trim() !== '') ||
      (filters.status && filters.status.length > 0) ||
      (filters.company && filters.company.length > 0) ||
      (filters.type && filters.type.length > 0) ||
      filters.startDate !== null ||
      filters.endDate !== null ||
      filters.minPremium !== null ||
      filters.maxPremium !== null ||
      filters.isStarred
    );
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search && filters.search.trim() !== '') count++;
    if (filters.status && filters.status.length > 0) count += filters.status.length;
    if (filters.company && filters.company.length > 0) count += filters.company.length;
    if (filters.type && filters.type.length > 0) count += filters.type.length;
    if (filters.startDate !== null) count++;
    if (filters.endDate !== null) count++;
    if (filters.minPremium !== null || filters.maxPremium !== null) count++;
    if (filters.isStarred) count++;
    return count;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filters-popover' : undefined;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 400 } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              placeholder="Buscar pólizas por número, cliente o compañía..."
              variant="outlined"
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: filters.search ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  '&.Mui-focused': {
                    border: `1px solid ${theme.palette.primary.main}`,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                  fontFamily: 'Inter, sans-serif',
                }
              }}
            />
          </motion.div>
        </Box>

        <Stack 
          direction="row" 
          spacing={1}
          sx={{ 
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilters}
              aria-describedby={id}
              sx={{ 
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: hasActiveFilters() 
                  ? theme.palette.primary.main 
                  : alpha(theme.palette.primary.main, 0.3),
                backgroundColor: hasActiveFilters() 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'transparent',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              Filtros
              {activeFiltersCount() > 0 && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {activeFiltersCount()}
                </Box>
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => {
                if (newMode !== null) {
                  onViewModeChange(newMode);
                }
              }}
              aria-label="view mode"
              sx={{ 
                '& .MuiToggleButtonGroup-grouped': {
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:not(:first-of-type)': {
                    borderRadius: '12px',
                    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    marginLeft: '4px',
                  },
                  '&:first-of-type': {
                    borderRadius: '12px',
                  },
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    }
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }
              }}
            >
              <ToggleButton 
                value="table" 
                aria-label="table view"
                sx={{ 
                  borderRadius: '12px',
                  p: 1,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton 
                value="grid" 
                aria-label="grid view"
                sx={{ 
                  borderRadius: '12px',
                  p: 1,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </motion.div>
        </Stack>
      </Stack>

      {/* Active filters chips */}
      <AnimatePresence>
        {hasActiveFilters() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.search && (
                <Chip
                  label={`Búsqueda: ${filters.search}`}
                  onDelete={() => handleRemoveFilter('search')}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              )}
              
              {filters.status?.map(status => (
                <Chip
                  key={status}
                  label={`Estado: ${getStatusLabel(status)}`}
                  onDelete={() => handleRemoveFilter('status', status)}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(getStatusColor(status), 0.1),
                    color: getStatusColor(status),
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: getStatusColor(status),
                    }
                  }}
                />
              ))}
              
              {filters.company?.map(company => (
                <Chip
                  key={company}
                  label={`Compañía: ${company}`}
                  onDelete={() => handleRemoveFilter('company', company)}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.info.main,
                    }
                  }}
                />
              ))}
              
              {filters.type?.map(type => (
                <Chip
                  key={type}
                  label={`Tipo: ${type}`}
                  onDelete={() => handleRemoveFilter('type', type)}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.secondary.main,
                    }
                  }}
                />
              ))}
              
              {filters.startDate && (
                <Chip
                  label={`Desde: ${filters.startDate.toLocaleDateString()}`}
                  onDelete={() => handleRemoveFilter('startDate')}
                  size="small"
                  icon={<DateRangeIcon fontSize="small" />}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.success.main,
                    },
                    '& .MuiChip-icon': {
                      color: theme.palette.success.main,
                    }
                  }}
                />
              )}
              
              {filters.endDate && (
                <Chip
                  label={`Hasta: ${filters.endDate.toLocaleDateString()}`}
                  onDelete={() => handleRemoveFilter('endDate')}
                  size="small"
                  icon={<DateRangeIcon fontSize="small" />}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.error.main,
                    },
                    '& .MuiChip-icon': {
                      color: theme.palette.error.main,
                    }
                  }}
                />
              )}
              
              {(filters.minPremium !== null || filters.maxPremium !== null) && (
                <Chip
                  label={`Prima: ${filters.minPremium || 0} - ${filters.maxPremium || '∞'}`}
                  onDelete={() => handleRemoveFilter('premium')}
                  size="small"
                  icon={<AttachMoneyIcon fontSize="small" />}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.warning.main,
                    },
                    '& .MuiChip-icon': {
                      color: theme.palette.warning.main,
                    }
                  }}
                />
              )}
              
              {filters.isStarred && (
                <Chip
                  label="Destacadas"
                  onDelete={() => handleRemoveFilter('isStarred')}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.warning.main,
                    }
                  }}
                />
              )}
              
              <Chip
                label="Limpiar todos"
                onDelete={handleResetFilters}
                deleteIcon={<ClearIcon />}
                size="small"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  color: theme.palette.text.secondary,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  '& .MuiChip-deleteIcon': {
                    color: theme.palette.text.secondary,
                  }
                }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFilters}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            width: 320,
            overflow: 'visible',
            borderRadius: '16px',
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.95),
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              fontWeight={700}
              fontFamily="Sora, sans-serif"
            >
              Filtros Avanzados
            </Typography>
            <IconButton size="small" onClick={handleCloseFilters}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2, opacity: 0.6 }} />

          <Stack spacing={3}>
            {/* Estado */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Estado
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(['active', 'expired', 'pending', 'review', 'cancelled'] as PolicyStatus[]).map((status) => (
                  <Chip
                    key={status}
                    label={getStatusLabel(status)}
                    onClick={() => handleStatusToggle(status)}
                    sx={{
                      m: 0.5,
                      borderRadius: '8px',
                      backgroundColor: tempFilters.status?.includes(status)
                        ? alpha(getStatusColor(status), 0.2)
                        : alpha(theme.palette.action.disabledBackground, 0.3),
                      color: tempFilters.status?.includes(status)
                        ? getStatusColor(status)
                        : theme.palette.text.secondary,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      border: tempFilters.status?.includes(status)
                        ? `1px solid ${alpha(getStatusColor(status), 0.3)}`
                        : 'none',
                      '&:hover': {
                        backgroundColor: tempFilters.status?.includes(status)
                          ? alpha(getStatusColor(status), 0.3)
                          : alpha(theme.palette.action.disabledBackground, 0.5),
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Compañía */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Compañía
              </Typography>
              <Box sx={{ maxHeight: 120, overflowY: 'auto', pr: 1 }}>
                {companies.map((company) => (
                  <FormControlLabel
                    key={company}
                    control={
                      <Checkbox
                        checked={tempFilters.company?.includes(company) || false}
                        onChange={() => handleCompanyToggle(company)}
                        size="small"
                        sx={{
                          color: theme.palette.info.main,
                          '&.Mui-checked': {
                            color: theme.palette.info.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography 
                        variant="body2"
                        fontFamily="Inter, sans-serif"
                      >
                        {company}
                      </Typography>
                    }
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Tipo de Póliza */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Tipo de Póliza
              </Typography>
              <Box sx={{ maxHeight: 120, overflowY: 'auto', pr: 1 }}>
                {POLICY_TYPE_OPTIONS.map((type) => (
                  <FormControlLabel
                      key={type.value}
                      control={
                      <Checkbox
                        checked={tempFilters.type?.includes(type.value)}
                        onChange={() => handleTypeToggle(type.value)}
                        size="small"
                        sx={{
                          color: theme.palette.secondary.main,
                          '&.Mui-checked': {
                            color: theme.palette.secondary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography 
                        variant="body2"
                        fontFamily="Inter, sans-serif"
                      >
                      {type.label}
                      </Typography>
                    }
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Rango de Fechas */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Rango de Fechas
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Desde"
                    value={tempFilters.startDate}
                    onChange={(date) => handleTempFilterChange('startDate', date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            borderRadius: '8px',
                            fontFamily: 'Inter, sans-serif',
                          }
                        }
                      }
                    }}
                  />
                  <DatePicker
                    label="Hasta"
                    value={tempFilters.endDate}
                    onChange={(date) => handleTempFilterChange('endDate', date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            borderRadius: '8px',
                            fontFamily: 'Inter, sans-serif',
                          }
                        }
                      }
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>

            {/* Rango de Prima */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Rango de Prima
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={[
                    tempFilters.minPremium !== null ? tempFilters.minPremium : 0,
                    tempFilters.maxPremium !== null ? tempFilters.maxPremium : 10000
                  ]}
                  onChange={handlePremiumChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={100}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 2500, label: '2.5K' },
                    { value: 5000, label: '5K' },
                    { value: 7500, label: '7.5K' },
                    { value: 10000, label: '10K+' }
                  ]}
                  sx={{
                    color: theme.palette.warning.main,
                    '& .MuiSlider-thumb': {
                      backgroundColor: theme.palette.warning.main,
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: theme.palette.warning.main,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: alpha(theme.palette.warning.main, 0.2),
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: alpha(theme.palette.warning.main, 0.3),
                    },
                    '& .MuiSlider-markLabel': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.7rem',
                    }
                  }}
                />
              </Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography 
                  variant="caption"
                  fontFamily="Inter, sans-serif"
                  color="text.secondary"
                >
                  Min: {tempFilters.minPremium !== null ? `$${tempFilters.minPremium}` : '$0'}
                </Typography>
                <Typography 
                  variant="caption"
                  fontFamily="Inter, sans-serif"
                  color="text.secondary"
                >
                  Max: {tempFilters.maxPremium !== null ? `$${tempFilters.maxPremium}` : '$10,000+'}
                </Typography>
              </Stack>
            </Box>

            {/* Destacadas */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.isStarred || false}
                  onChange={(e) => handleTempFilterChange('isStarred', e.target.checked)}
                  size="small"
                  sx={{
                    color: theme.palette.warning.main,
                    '&.Mui-checked': {
                      color: theme.palette.warning.main,
                    },
                  }}
                />
              }
              label={
                <Typography 
                  variant="subtitle2"
                  fontWeight={600}
                  fontFamily="Sora, sans-serif"
                >
                  Solo Pólizas Destacadas
                </Typography>
              }
            />

            <Divider sx={{ opacity: 0.6 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleResetFilters}
                sx={{ 
                  borderRadius: '999px',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
                sx={{ 
                  borderRadius: '999px',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Aplicar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};

export default PolicyFilters;