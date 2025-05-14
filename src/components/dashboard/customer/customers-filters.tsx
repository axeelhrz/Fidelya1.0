import React, { useState } from 'react';
// Define CustomerStatus and CustomerType
type CustomerStatus = 'active' | 'inactive' | 'lead';
type CustomerType = 'individual' | 'business' | 'family';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  Button,
  useTheme,
  alpha,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Collapse,
  SelectChangeEvent,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  FilterAlt as FilterAltIcon,
  ClearAll as ClearAllIcon,
  Label as LabelIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CustomerTag } from '@/types/customer';

interface CustomerFilters {
  search: string;
  status?: CustomerStatus[];
  type?: CustomerType[];
  gender?: ('male' | 'female' | 'other')[];
  civilStatus?: ('single' | 'married' | 'divorced' | 'widowed')[];
  riskLevel?: ('low' | 'medium' | 'high')[];
  dateRange?: { start: Date; end: Date };
  hasPolicy?: boolean;
  policyStatus?: ('active' | 'expired' | 'pending' | 'review' | 'cancelled')[];
  policyType?: string[];
  setFilters?: React.Dispatch<React.SetStateAction<CustomerFilters>>;
  tags?: string[];
}

interface CustomerFiltersProps {
  filters: CustomerFilters;
  setFilters: React.Dispatch<React.SetStateAction<CustomerFilters>>;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  availableTags?: CustomerTag[];
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({ 
  filters, 
  setFilters, 
  viewMode, 
  onViewModeChange,
  availableTags = []
}) => {
  const theme = useTheme();
  const [openFilters, setOpenFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(filters.dateRange?.start || null);
  const [endDate, setEndDate] = useState<Date | null>(filters.dateRange?.end || null);
  
  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as unknown as CustomerStatus[];
    setFilters(prev => ({ ...prev, status: value }));
  };
  
  const handleTypeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as unknown as CustomerType[];
    setFilters(prev => ({ ...prev, type: value }));
  };
  
  const handleGenderChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as ('male' | 'female' | 'other')[];
    setFilters(prev => ({ ...prev, gender: value }));
  };
  
  const handleCivilStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as ('single' | 'married' | 'divorced' | 'widowed')[];
    setFilters(prev => ({ ...prev, civilStatus: value }));
  };
  
  const handleRiskLevelChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as ('low' | 'medium' | 'high')[];
    setFilters(prev => ({ ...prev, riskLevel: value }));
  };
  
  const handleHasPolicyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setFilters(prev => ({ ...prev, hasPolicy: checked }));
  };
  
  const handlePolicyStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as ('active' | 'expired' | 'pending' | 'review' | 'cancelled')[];
    setFilters(prev => ({ ...prev, policyStatus: value }));
  };
  
  const handlePolicyTypeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFilters(prev => ({ ...prev, policyType: value }));
  };
  
  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFilters(prev => ({ ...prev, tags: value }));
  };
  
  const handleDateChange = () => {
    if (startDate && endDate) {
      setFilters(prev => ({ 
        ...prev, 
        dateRange: { 
          start: startDate, 
          end: endDate 
        } 
      }));
    } else if (!startDate && !endDate) {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.dateRange;
        return newFilters;
      });
    }
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };
  
  const handleClearFilters = () => {
    setFilters({ search: '' });
    setStartDate(null);
    setEndDate(null);
    setOpenFilters(false);
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.type && filters.type.length > 0) count++;
    if (filters.gender && filters.gender.length > 0) count++;
    if (filters.civilStatus && filters.civilStatus.length > 0) count++;
    if (filters.riskLevel && filters.riskLevel.length > 0) count++;
    if (filters.dateRange) count++;
    if (filters.hasPolicy) count++;
    if (filters.policyStatus && filters.policyStatus.length > 0) count++;
    if (filters.policyType && filters.policyType.length > 0) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <TextField
          placeholder="Buscar clientes..."
          value={filters.search}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              fontFamily: "'Sora', sans-serif",
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }
          }}
          sx={{ 
            maxWidth: { sm: 400 },
            flex: { xs: '1 1 auto', sm: '0 1 auto' },
          }}
        />
        
        <Stack 
          direction="row" 
          spacing={1}
          sx={{ 
            flex: { xs: '1 1 auto', sm: '0 0 auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Tooltip title="Filtros">
            <IconButton
              onClick={() => setOpenFilters(!openFilters)}
              sx={{
                bgcolor: openFilters 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.background.paper, 0.8),
                color: openFilters 
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                border: `1px solid ${openFilters 
                  ? alpha(theme.palette.primary.main, 0.2)
                  : alpha(theme.palette.divider, 0.1)
                }`,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: openFilters 
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.background.paper, 0.9),
                },
                position: 'relative',
              }}
            >
              <FilterAltIcon />
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    bgcolor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={viewMode === 'table' ? 'Vista de cuadrícula' : 'Vista de tabla'}>
            <IconButton
              onClick={() => onViewModeChange(viewMode === 'table' ? 'grid' : 'table')}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                color: theme.palette.text.secondary,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              {viewMode === 'table' ? <ViewModuleIcon /> : <ViewListIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      
      <Collapse in={openFilters}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack spacing={3}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2}
              alignItems="flex-start"
            >
              <FormControl 
                size="small" 
                sx={{ minWidth: 200, flex: 1 }}
              >
                <InputLabel id="status-filter-label">Estado</InputLabel>
                <Select
                  labelId="status-filter-label"
                  multiple
                  value={filters.status || []}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label="Estado" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        let label = '';
                        let color = '';
                        
                        switch (value) {
                          case 'active':
                            label = 'Activo';
                            color = theme.palette.success.main;
                            break;
                          case 'inactive':
                            label = 'Inactivo';
                            color = theme.palette.warning.main;
                            break;
                          case 'lead':
                            label = 'Lead';
                            color = theme.palette.info.main;
                            break;
                        }
                        
                        return (
                          <Chip 
                            key={value} 
                            label={label} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(color, 0.1),
                              color: color,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: "'Sora', sans-serif",
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                >
                  <MenuItem value="active">
                    <Checkbox checked={filters.status?.includes('active') || false} />
                    <ListItemText primary="Activo" />
                  </MenuItem>
                  <MenuItem value="inactive">
                    <Checkbox checked={filters.status?.includes('inactive') || false} />
                    <ListItemText primary="Inactivo" />
                  </MenuItem>
                  <MenuItem value="lead">
                    <Checkbox checked={filters.status?.includes('lead') || false} />
                    <ListItemText primary="Lead" />
                  </MenuItem>
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ minWidth: 200, flex: 1 }}
              >
                <InputLabel id="type-filter-label">Tipo</InputLabel>
                <Select
                  labelId="type-filter-label"
                  multiple
                  value={filters.type || []}
                  onChange={handleTypeChange}
                  input={<OutlinedInput label="Tipo" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value === 'individual' ? 'Individual' : 
                                 value === 'business' ? 'Empresa' : 
                                 value === 'family' ? 'Familia' : value} 
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            fontFamily: "'Sora', sans-serif",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                >
                  <MenuItem value="individual">
                    <Checkbox checked={filters.type?.includes('individual') || false} />
                    <ListItemText primary="Individual" />
                  </MenuItem>
                  <MenuItem value="business">
                    <Checkbox checked={filters.type?.includes('business') || false} />
                    <ListItemText primary="Empresa" />
                  </MenuItem>
                  <MenuItem value="family">
                    <Checkbox checked={filters.type?.includes('family') || false} />
                    <ListItemText primary="Familia" />
                  </MenuItem>
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ minWidth: 200, flex: 1 }}
              >
                <InputLabel id="tags-filter-label">Etiquetas</InputLabel>
                <Select
                  labelId="tags-filter-label"
                  multiple
                  value={filters.tags || []}
                  onChange={handleTagsChange}
                  input={<OutlinedInput label="Etiquetas" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((tagId) => {
                        const tag = availableTags.find(t => t.id === tagId);
                        return (
                          <Chip 
                            key={tagId} 
                            label={tag?.name || tagId} 
                            size="small"
                            sx={{ 
                              bgcolor: tag ? alpha(tag.color, 0.1) : alpha(theme.palette.grey[500], 0.1),
                              color: tag ? tag.color : theme.palette.grey[500],
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: "'Sora', sans-serif",
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <LabelIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {availableTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Checkbox checked={filters.tags?.includes(tag.id) || false} />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: tag.color,
                          mr: 1,
                        }}
                      />
                      <ListItemText primary={tag.name} />
                    </MenuItem>
                  ))}
                  {availableTags.length === 0 && (
                    <MenuItem disabled>
                      <ListItemText primary="No hay etiquetas disponibles" />
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Stack>
            
            <Divider />
            
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2}
              alignItems="flex-start"
            >
              <FormControl 
                size="small" 
                sx={{ minWidth: 200, flex: 1 }}
              >
                <InputLabel id="gender-filter-label">Género</InputLabel>
                <Select
                  labelId="gender-filter-label"
                  multiple
                  value={filters.gender || []}
                  onChange={handleGenderChange}
                  input={<OutlinedInput label="Género" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value === 'male' ? 'Masculino' : 
                                 value === 'female' ? 'Femenino' : 'Otro'} 
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            fontFamily: "'Sora', sans-serif",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                >
                  <MenuItem value="male">
                    <Checkbox checked={filters.gender?.includes('male') || false} />
                    <ListItemText primary="Masculino" />
                  </MenuItem>
                  <MenuItem value="female">
                    <Checkbox checked={filters.gender?.includes('female') || false} />
                    <ListItemText primary="Femenino" />
                  </MenuItem>
                  <MenuItem value="other">
                    <Checkbox checked={filters.gender?.includes('other') || false} />
                    <ListItemText primary="Otro" />
                  </MenuItem>
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ minWidth: 200, flex: 1 }}
              >
                <InputLabel id="civil-status-filter-label">Estado Civil</InputLabel>
                <Select
                  labelId="civil-status-filter-label"
                  multiple
                  value={filters.civilStatus || []}
                  onChange={handleCivilStatusChange}
                  input={<OutlinedInput label="Estado Civil" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        let label = '';
                        switch (value) {
                          case 'single':
                            label = 'Soltero/a';
                            break;
                          case 'married':
                            label = 'Casado/a';
                            break;
                          case 'divorced':
                            label = 'Divorciado/a';
                            break;
                          case 'widowed':
                            label = 'Viudo/a';
                            break;
                          default:
                            label = value;
                        }
                        
                        return (
                          <Chip 
                            key={value} 
                            label={label} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: "'Sora', sans-serif",
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                >
                  <MenuItem value="single">
                    <Checkbox checked={filters.civilStatus?.includes('single') || false} />
                    <ListItemText primary="Soltero/a" />
                  </MenuItem>
                  <MenuItem value="married">
                    <Checkbox checked={filters.civilStatus?.includes('married') || false} />
                    <ListItemText primary="Casado/a" />
                  </MenuItem>
                  <MenuItem value="divorced">
                    <Checkbox checked={filters.civilStatus?.includes('divorced') || false} />
                    <ListItemText primary="Divorciado/a" />
                  </MenuItem>
                  <MenuItem value="widowed">
                    <Checkbox checked={filters.civilStatus?.includes('widowed') || false} />
                    <ListItemText primary="Viudo/a" />
                  </MenuItem>
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ minWidth: 200, flex: 1 }}
              >
                <InputLabel id="risk-level-filter-label">Nivel de Riesgo</InputLabel>
                <Select
                  labelId="risk-level-filter-label"
                  multiple
                  value={filters.riskLevel || []}
                  onChange={handleRiskLevelChange}
                  input={<OutlinedInput label="Nivel de Riesgo" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        let label = '';
                        let color = '';
                        
                        switch (value) {
                          case 'low':
                            label = 'Bajo';
                            color = theme.palette.success.main;
                            break;
                          case 'medium':
                            label = 'Medio';
                            color = theme.palette.warning.main;
                            break;
                          case 'high':
                            label = 'Alto';
                            color = theme.palette.error.main;
                            break;
                        }
                        
                        return (
                          <Chip 
                            key={value} 
                            label={label} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(color, 0.1),
                              color: color,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: "'Sora', sans-serif",
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                >
                  <MenuItem value="low">
                    <Checkbox checked={filters.riskLevel?.includes('low') || false} />
                    <ListItemText primary="Bajo" />
                  </MenuItem>
                  <MenuItem value="medium">
                    <Checkbox checked={filters.riskLevel?.includes('medium') || false} />
                    <ListItemText primary="Medio" />
                  </MenuItem>
                  <MenuItem value="high">
                    <Checkbox checked={filters.riskLevel?.includes('high') || false} />
                    <ListItemText primary="Alto" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
            
            <Divider />
            
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2}
              alignItems="flex-start"
            >
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ flex: 2 }}
                >
                  <DatePicker
                    label="Fecha inicio"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      if (newValue && endDate) {
                        handleDateChange();
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          fontFamily: "'Sora', sans-serif",
                        }
                      }
                    }}
                  />
                  <DatePicker
                    label="Fecha fin"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                      if (startDate && newValue) {
                        handleDateChange();
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          fontFamily: "'Sora', sans-serif",
                        }
                      }
                    }}
                  />
                </Stack>
              </LocalizationProvider>
              
              <FormGroup sx={{ flex: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.hasPolicy || false}
                      onChange={handleHasPolicyChange}
                      color="primary"
                    />
                  }
                  label="Con pólizas"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </FormGroup>
            </Stack>
            
            <Collapse in={filters.hasPolicy || false}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={2}
                alignItems="flex-start"
                sx={{ mt: 2 }}
              >
                <FormControl 
                  size="small" 
                  sx={{ minWidth: 200, flex: 1 }}
                >
                  <InputLabel id="policy-status-filter-label">Estado de Pólizas</InputLabel>
                  <Select
                    labelId="policy-status-filter-label"
                    multiple
                    value={filters.policyStatus || []}
                    onChange={handlePolicyStatusChange}
                    input={<OutlinedInput label="Estado de Pólizas" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          let label = '';
                          let color = '';
                          
                          switch (value) {
                            case 'active':
                              label = 'Activa';
                              color = theme.palette.success.main;
                              break;
                            case 'expired':
                              label = 'Vencida';
                              color = theme.palette.error.main;
                              break;
                            case 'pending':
                              label = 'Pendiente';
                              color = theme.palette.warning.main;
                              break;
                            case 'review':
                              label = 'En revisión';
                              color = theme.palette.info.main;
                              break;
                            case 'cancelled':
                              label = 'Cancelada';
                              color = theme.palette.grey[500];
                              break;
                          }
                          
                          return (
                            <Chip 
                              key={value} 
                              label={label} 
                              size="small"
                              sx={{ 
                                bgcolor: alpha(color, 0.1),
                                color: color,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                fontFamily: "'Sora', sans-serif",
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    sx={{
                      fontFamily: "'Sora', sans-serif",
                      '& .MuiSelect-select': {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AssignmentIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="active">
                      <Checkbox checked={filters.policyStatus?.includes('active') || false} />
                      <ListItemText primary="Activa" />
                    </MenuItem>
                    <MenuItem value="expired">
                      <Checkbox checked={filters.policyStatus?.includes('expired') || false} />
                      <ListItemText primary="Vencida" />
                    </MenuItem>
                    <MenuItem value="pending">
                      <Checkbox checked={filters.policyStatus?.includes('pending') || false} />
                      <ListItemText primary="Pendiente" />
                    </MenuItem>
                    <MenuItem value="review">
                      <Checkbox checked={filters.policyStatus?.includes('review') || false} />
                      <ListItemText primary="En revisión" />
                    </MenuItem>
                    <MenuItem value="cancelled">
                      <Checkbox checked={filters.policyStatus?.includes('cancelled') || false} />
                      <ListItemText primary="Cancelada" />
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl 
                  size="small" 
                  sx={{ minWidth: 200, flex: 1 }}
                >
                  <InputLabel id="policy-type-filter-label">Tipo de Póliza</InputLabel>
                  <Select
                    labelId="policy-type-filter-label"
                    multiple
                    value={filters.policyType || []}
                    onChange={handlePolicyTypeChange}
                    input={<OutlinedInput label="Tipo de Póliza" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={value} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: "'Sora', sans-serif",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    sx={{
                      fontFamily: "'Sora', sans-serif",
                      '& .MuiSelect-select': {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                      }
                    }}
                  >
                    <MenuItem value="auto">
                      <Checkbox checked={filters.policyType?.includes('auto') || false} />
                      <ListItemText primary="Auto" />
                    </MenuItem>
                    <MenuItem value="home">
                      <Checkbox checked={filters.policyType?.includes('home') || false} />
                      <ListItemText primary="Hogar" />
                    </MenuItem>
                    <MenuItem value="life">
                      <Checkbox checked={filters.policyType?.includes('life') || false} />
                      <ListItemText primary="Vida" />
                    </MenuItem>
                    <MenuItem value="health">
                      <Checkbox checked={filters.policyType?.includes('health') || false} />
                      <ListItemText primary="Salud" />
                    </MenuItem>
                    <MenuItem value="business">
                      <Checkbox checked={filters.policyType?.includes('business') || false} />
                      <ListItemText primary="Negocio" />
                    </MenuItem>
                    <MenuItem value="travel">
                      <Checkbox checked={filters.policyType?.includes('travel') || false} />
                      <ListItemText primary="Viaje" />
                    </MenuItem>
                    <MenuItem value="other">
                      <Checkbox checked={filters.policyType?.includes('other') || false} />
                      <ListItemText primary="Otro" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Collapse>
            
            <Stack 
              direction="row" 
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ClearAllIcon />}
                onClick={handleClearFilters}
                sx={{
                  borderRadius: 2,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                }}
              >
                Limpiar filtros
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Collapse>
      
      {activeFiltersCount > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}
        >
          {filters.status && filters.status.length > 0 && (
            <Chip
              label={`Estado: ${filters.status.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, status: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.type && filters.type.length > 0 && (
            <Chip
              label={`Tipo: ${filters.type.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, type: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.gender && filters.gender.length > 0 && (
            <Chip
              label={`Género: ${filters.gender.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, gender: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.civilStatus && filters.civilStatus.length > 0 && (
            <Chip
              label={`Estado civil: ${filters.civilStatus.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, civilStatus: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.riskLevel && filters.riskLevel.length > 0 && (
            <Chip
              label={`Nivel de riesgo: ${filters.riskLevel.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, riskLevel: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.dateRange && (
            <Chip
              label="Rango de fechas"
              onDelete={() => {
                setFilters(prev => {
                  const newFilters = { ...prev };
                  delete newFilters.dateRange;
                  return newFilters;
                });
                setStartDate(null);
                setEndDate(null);
              }}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.hasPolicy && (
            <Chip
              label="Con pólizas"
              onDelete={() => setFilters(prev => ({ ...prev, hasPolicy: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.policyStatus && filters.policyStatus.length > 0 && (
            <Chip
              label={`Estado de póliza: ${filters.policyStatus.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, policyStatus: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.policyType && filters.policyType.length > 0 && (
            <Chip
              label={`Tipo de póliza: ${filters.policyType.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, policyType: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
          
          {filters.tags && filters.tags.length > 0 && (
            <Chip
              label={`Etiquetas: ${filters.tags.length}`}
              onDelete={() => setFilters(prev => ({ ...prev, tags: undefined }))}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '6px',
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default CustomerFilters;