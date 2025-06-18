import React from 'react';
import {
  Paper,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ClientesFilters = ({ 
  searchTerm, 
  onSearchChange, 
  totalClientes, 
  filteredCount 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Título y contador */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Filtros de Búsqueda
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredCount} de {totalClientes} clientes
              </Typography>
            </Box>
          </Box>

          {/* Campo de búsqueda */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 300 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  transition: 'all 0.3s ease',
                }
              }}
            />
            
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Chip
                  label={`"${searchTerm}"`}
                  onDelete={() => onSearchChange('')}
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark',
                      }
                    }
                  }}
                />
              </motion.div>
            )}
          </Box>
        </Box>

        {/* Indicadores de filtro activo */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              mt: 2, 
              pt: 2, 
              borderTop: 1, 
              borderColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography variant="body2" color="text.secondary">
                Filtros activos:
              </Typography>
              <Chip
                label={`Búsqueda: "${searchTerm}"`}
                size="small"
                color="primary"
                variant="filled"
                onDelete={() => onSearchChange('')}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

export default ClientesFilters;