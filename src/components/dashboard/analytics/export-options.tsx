import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Popover, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  TextField,
  useTheme,
  IconButton,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
} from '@mui/material';
import { Download, FileText, BarChart, List, Lightbulb, Bell, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ExportOptionsType {
  format: 'pdf' | 'csv' | 'excel';
  sections: Array<'kpis' | 'graphs' | 'lists' | 'recommendations' | 'alerts'>;
  includeCharts: boolean;
  fileName?: string;
}

interface ExportOptionsProps {
  onExport: (options: ExportOptionsType) => void;
  isExporting: boolean;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  isExporting
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [options, setOptions] = useState<ExportOptionsType>({
    format: 'pdf',
    sections: ['kpis', 'graphs', 'lists'],
    includeCharts: true
  });
  
  // Manejo de popover
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleExport = () => {
    onExport(options);
    handleClose();
  };
  
  // Actualizar opciones
  const handleFormatChange = (format: 'pdf' | 'csv' | 'excel') => {
    setOptions(prev => ({
      ...prev,
      format
    }));
  };
  
  const handleSectionChange = (section: 'kpis' | 'graphs' | 'lists' | 'recommendations' | 'alerts') => {
    const currentSections = [...options.sections];
    const index = currentSections.indexOf(section);
    
    if (index === -1) {
      currentSections.push(section);
    } else {
      currentSections.splice(index, 1);
    }
    
    setOptions(prev => ({
      ...prev,
      sections: currentSections
    }));
  };
  
  const handleIncludeChartsChange = (include: boolean) => {
    setOptions(prev => ({
      ...prev,
      includeCharts: include
    }));
  };
  
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({
      ...prev,
      fileName: event.target.value || undefined
    }));
  };
  
  const open = Boolean(anchorEl);
  const id = open ? 'export-popover' : undefined;

  return (
    <Box>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        startIcon={<Download size={16} />}
        disabled={isExporting}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        }}
      >
        Exportar
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
            width: 350,
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
              Opciones de Exportación
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <X size={16} />
            </IconButton>
          </Box>
          
          {/* Formato de exportación */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              Formato
            </Typography>
            
            <FormControl>
              <RadioGroup
                value={options.format}
                onChange={(e) => handleFormatChange(e.target.value as 'pdf' | 'csv' | 'excel')}
              >
                <FormControlLabel 
                  value="pdf" 
                  control={<Radio size="small" />} 
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FileText size={16} />
                      PDF
                    </Typography>
                  } 
                />
                <FormControlLabel 
                  value="csv" 
                  control={<Radio size="small" />} 
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FileText size={16} />
                      CSV
                    </Typography>
                  } 
                />
                <FormControlLabel 
                  value="excel" 
                  control={<Radio size="small" />} 
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FileText size={16} />
                      Excel
                    </Typography>
                  } 
                />
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Secciones a incluir */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              Secciones a Incluir
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.sections.includes('kpis')}
                    onChange={() => handleSectionChange('kpis')}
                    size="small"
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <BarChart size={16} />
                    KPIs y Resumen Ejecutivo
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.sections.includes('graphs')}
                    onChange={() => handleSectionChange('graphs')}
                    size="small"
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <BarChart size={16} />
                    Gráficos y Visualizaciones
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.sections.includes('lists')}
                    onChange={() => handleSectionChange('lists')}
                    size="small"
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <List size={16} />
                    Listados y Actividad Reciente
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.sections.includes('recommendations')}
                    onChange={() => handleSectionChange('recommendations')}
                    size="small"
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Lightbulb size={16} />
                    Recomendaciones
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.sections.includes('alerts')}
                    onChange={() => handleSectionChange('alerts')}
                    size="small"
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Bell size={16} />
                    Alertas
                  </Typography>
                }
              />
            </FormGroup>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Opciones adicionales */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                mb: 1
              }}
            >
              Opciones Adicionales
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeCharts}
                    onChange={(e) => handleIncludeChartsChange(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Incluir gráficos (solo PDF)
                  </Typography>
                }
              />
            </FormGroup>
            
            <TextField
              label="Nombre del archivo"
              placeholder="analisis_export"
              size="small"
              fullWidth
              value={options.fileName || ''}
              onChange={handleFileNameChange}
              sx={{ 
                mt: 2,
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif'
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif'
                }
              }}
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
              onClick={handleExport}
              disabled={options.sections.length === 0 || isExporting}
              startIcon={<Download size={16} />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};