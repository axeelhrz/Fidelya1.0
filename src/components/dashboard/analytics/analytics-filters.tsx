import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Popover, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  TextField,
  useTheme,
  IconButton,
  Divider
} from '@mui/material';

type PolicyType = string;

interface FiltersType {
  dateRange?: { start: Date; end: Date };
  policyTypes?: PolicyType[];
  insurers?: string[];
  clientIds?: string[];
  onlyActive?: boolean;
}
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Filter, X, Calendar, FileType, User, ToggleLeft, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface AnalyticsFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  onReset: () => void;
  policyTypes: PolicyType[];
  insurers: string[];
  clients: { id: string; name: string }[];
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  policyTypes,
  insurers,
  clients
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);
  
  // Manejo de popover
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setLocalFilters(filters); // Resetear filtros locales al abrir
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleApply = () => {
    onFilterChange(localFilters);
    handleClose();
  };
  
  // Actualizar filtros locales
  const updateLocalFilters = (
    key: keyof FiltersType, 
    value: 
      | { start: Date; end: Date } 
      | PolicyType[] 
      | string[] 
      | boolean 
      | undefined
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Actualizar tipos de póliza
  const handlePolicyTypeChange = (type: PolicyType) => {
    const currentTypes = localFilters.policyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    updateLocalFilters('policyTypes', newTypes.length > 0 ? newTypes : undefined);
  };
  
  // Actualizar aseguradoras
  const handleInsurerChange = (insurer: string) => {
    const currentInsurers = localFilters.insurers || [];
    const newInsurers = currentInsurers.includes(insurer)
      ? currentInsurers.filter(i => i !== insurer)
      : [...currentInsurers, insurer];
    
    updateLocalFilters('insurers', newInsurers.length > 0 ? newInsurers : undefined);
  };
  
  // Actualizar clientes
  const handleClientChange = (clientId: string) => {
    const currentClients = localFilters.clientIds || [];
    const newClients = currentClients.includes(clientId)
      ? currentClients.filter(c => c !== clientId)
      : [...currentClients, clientId];
    
    updateLocalFilters('clientIds', newClients.length > 0 ? newClients : undefined);
  };
  
  // Contar filtros activos
  const countActiveFilters = () => {
    let count = 0;
    if (filters.dateRange) count++;
    if (filters.policyTypes && filters.policyTypes.length > 0) count++;
    if (filters.insurers && filters.insurers.length > 0) count++;
    if (filters.clientIds && filters.clientIds.length > 0) count++;
    if (filters.onlyActive !== undefined) count++;
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  const open = Boolean(anchorEl);
  const id = open ? 'filters-popover' : undefined;

  return (
    <Box>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        startIcon={<Filter size={16} />}
        endIcon={activeFiltersCount > 0 && (
          <Chip 
            label={activeFiltersCount} 
            size="small" 
            color="primary"
            sx={{ 
              height: 20, 
              minWidth: 20,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }} 
          />
        )}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        }}
      >
        Filtros
      </Button>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 3,
            width: 400,
            borderRadius: '16px',
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Sora, sans-serif', 
                fontWeight: 600 
              }}
            >
              Filtros de Análisis
            </Typography>
            <IconButton size="small" onClick={onReset}>
              <X size={16} />
            </IconButton>
          </Box>
          
          {/* Filtro de fecha */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              <Calendar size={16} />
              Rango de Fechas
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Desde"
                  value={dayjs(localFilters.dateRange?.start)}
                  onChange={(date) => {
                    if (date) {
                      updateLocalFilters('dateRange', {
                        start: date.toDate(),
                        end: localFilters.dateRange?.end || new Date()
                      });
                    }
                  }}
                  slotProps={{ 
                    textField: { 
                      size: 'small',
                      fullWidth: true,
                      sx: { fontFamily: 'Inter, sans-serif' }
                    } 
                  }}
                />
                <DatePicker
                  label="Hasta"
                  value={dayjs(localFilters.dateRange?.end)}
                  onChange={(date) => {
                    if (date) {
                      updateLocalFilters('dateRange', {
                        start: localFilters.dateRange?.start || dayjs().subtract(30, 'day').toDate(),
                        end: date.toDate()
                      });
                    }
                  }}
                  slotProps={{ 
                    textField: { 
                      size: 'small',
                      fullWidth: true,
                      sx: { fontFamily: 'Inter, sans-serif' }
                    } 
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Filtro de tipos de póliza */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              <FileType size={16} />
              Tipos de Póliza
            </Typography>
            
            <FormGroup>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {policyTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={localFilters.policyTypes?.includes(type) || false}
                        onChange={() => handlePolicyTypeChange(type)}
                        size="small"
                      />
                    }
                    label={
                      <Typography 
                        variant="body2" 
                        sx={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {type}
                      </Typography>
                    }
                    sx={{ width: '50%' }}
                  />
                ))}
              </Box>
            </FormGroup>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Filtro de aseguradoras */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              <Building size={16} />
              Aseguradoras
            </Typography>
            
            <FormGroup>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {insurers.map((insurer) => (
                  <FormControlLabel
                    key={insurer}
                    control={
                      <Checkbox
                        checked={localFilters.insurers?.includes(insurer) || false}
                        onChange={() => handleInsurerChange(insurer)}
                        size="small"
                      />
                    }
                    label={
                      <Typography 
                        variant="body2" 
                        sx={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {insurer}
                      </Typography>
                    }
                    sx={{ width: '50%' }}
                  />
                ))}
              </Box>
            </FormGroup>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Filtro de clientes */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              <User size={16} />
              Clientes
            </Typography>
            
            {clients.length > 5 ? (
              <TextField
                placeholder="Buscar cliente..."
                size="small"
                fullWidth
                sx={{ mb: 2, fontFamily: 'Inter, sans-serif' }}
              />
            ) : null}
            
            <FormGroup>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', maxHeight: 150, overflowY: 'auto' }}>
                {clients.map((client) => (
                  <FormControlLabel
                    key={client.id}
                    control={
                      <Checkbox
                        checked={localFilters.clientIds?.includes(client.id) || false}
                        onChange={() => handleClientChange(client.id)}
                        size="small"
                      />
                    }
                    label={
                      <Typography 
                        variant="body2" 
                        sx={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {client.name}
                      </Typography>
                    }
                    sx={{ width: '100%' }}
                  />
                ))}
              </Box>
            </FormGroup>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Filtro de solo activas */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.onlyActive !== false}
                  onChange={(e) => updateLocalFilters('onlyActive', e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600
                  }}
                >
                  <ToggleLeft size={16} />
                  Solo Pólizas Activas
                </Typography>
              }
            />
          </Box>
          
          {/* Botones de acción */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500
              }}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};