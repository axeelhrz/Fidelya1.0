'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Avatar,
  Stack,
  Chip,
  Button,
  IconButton,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Tooltip,
  Badge,
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CloudDownload,
  GetApp,
  Description,
  TableChart,
  PictureAsPdf,
  InsertChart,
  Code,
  DataObject,
  FilterList,
  CalendarToday,
  Group,
  Email,
  Phone,
  Business,
  LocationOn,
  Schedule,
  CheckCircle,
  Warning,
  Info,
  Settings,
  Refresh,
  Visibility,
  Download,
  Share,
  Security,
  ExpandMore,
  ArrowForward,
  ArrowBack,
  FileDownload,
  CloudSync,
  Storage,
  Assessment,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
} from '@mui/icons-material';
import { Socio, SocioStats } from '@/types/socio';

interface DataExportSectionProps {
  socios: Socio[];
  stats: SocioStats;
  loading: boolean;
}

interface ExportFormatProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fileExtension: string;
  features: string[];
  recommended?: boolean;
}

interface ExportFieldProps {
  id: string;
  label: string;
  description: string;
  category: 'basic' | 'contact' | 'dates' | 'status' | 'custom';
  required?: boolean;
  sensitive?: boolean;
}

const ExportFormatCard: React.FC<{
  format: ExportFormatProps;
  selected: boolean;
  onSelect: () => void;
  delay: number;
}> = ({ format, selected, onSelect, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        elevation={0}
        onClick={onSelect}
        sx={{
          cursor: 'pointer',
          border: selected ? `2px solid ${format.color}` : '1px solid #f1f5f9',
          borderRadius: 5,
          background: selected 
            ? `linear-gradient(135deg, ${alpha(format.color, 0.05)} 0%, ${alpha(format.color, 0.02)} 100%)`
            : 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: format.color,
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 60px -10px ${alpha(format.color, 0.25)}`,
            '& .format-icon': {
              transform: 'scale(1.1)',
              bgcolor: alpha(format.color, 0.2),
            },
          },
        }}
      >
        {format.recommended && (
          <Chip
            label="Recomendado"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: '#10b981',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        )}
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              className="format-icon"
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha(format.color, 0.12),
                color: format.color,
                borderRadius: 3,
                transition: 'all 0.3s ease',
              }}
            >
              {format.icon}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                  {format.name}
                </Typography>
                <Chip
                  label={format.fileExtension}
                  size="small"
                  sx={{
                    bgcolor: alpha(format.color, 0.1),
                    color: format.color,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5, mb: 2 }}>
                {format.description}
              </Typography>
            </Box>
            
            {selected && (
              <CheckCircle sx={{ color: format.color, fontSize: 24 }} />
            )}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1, display: 'block' }}>
              Características
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {format.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  sx={{
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FieldSelectionCard: React.FC<{
  category: string;
  fields: ExportFieldProps[];
  selectedFields: string[];
  onFieldToggle: (fieldId: string) => void;
  onCategoryToggle: (category: string, selected: boolean) => void;
}> = ({ category, fields, selectedFields, onFieldToggle, onCategoryToggle }) => {
  const categoryConfig = {
    basic: { label: 'Información Básica', color: '#6366f1', icon: <Group /> },
    contact: { label: 'Datos de Contacto', color: '#10b981', icon: <Email /> },
    dates: { label: 'Fechas', color: '#f59e0b', icon: <CalendarToday /> },
    status: { label: 'Estado y Actividad', color: '#8b5cf6', icon: <Assessment /> },
    custom: { label: 'Campos Personalizados', color: '#06b6d4', icon: <Settings /> },
  };

  const config = categoryConfig[category as keyof typeof categoryConfig];
  const allSelected = fields.every(field => selectedFields.includes(field.id));
  const someSelected = fields.some(field => selectedFields.includes(field.id));

  return (
    <Accordion
      elevation={0}
      sx={{
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
          margin: 0,
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: alpha(config.color, 0.05),
          borderRadius: '16px 16px 0 0',
          '&.Mui-expanded': {
            borderRadius: '16px 16px 0 0',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: alpha(config.color, 0.1),
              color: config.color,
              borderRadius: 2,
            }}
          >
            {config.icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
            {config.label}
          </Typography>
          <Chip
            label={`${fields.filter(f => selectedFields.includes(f.id)).length}/${fields.length}`}
            size="small"
            sx={{
              bgcolor: alpha(config.color, 0.1),
              color: config.color,
              fontWeight: 600,
            }}
          />
          <Box sx={{ ml: 'auto', mr: 2 }}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={(e) => onCategoryToggle(category, e.target.checked)}
              sx={{ color: config.color }}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <FormGroup>
          {fields.map((field) => (
            <FormControlLabel
              key={field.id}
              control={
                <Checkbox
                  checked={selectedFields.includes(field.id)}
                  onChange={() => onFieldToggle(field.id)}
                  sx={{ color: config.color }}
                />
              }
              label={
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {field.label}
                    </Typography>
                    {field.required && (
                      <Chip label="Requerido" size="small" sx={{ bgcolor: '#ef4444', color: 'white', fontSize: '0.6rem', height: 16 }} />
                    )}
                    {field.sensitive && (
                      <Chip label="Sensible" size="small" sx={{ bgcolor: '#f59e0b', color: 'white', fontSize: '0.6rem', height: 16 }} />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {field.description}
                  </Typography>
                </Box>
              }
              sx={{ mb: 1 }}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

const ExportPreview: React.FC<{
  format: ExportFormatProps;
  selectedFields: string[];
  filteredCount: number;
  onExport: () => void;
  loading: boolean;
}> = ({ format, selectedFields, filteredCount, onExport, loading }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #f1f5f9',
        borderRadius: 5,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: alpha(format.color, 0.1),
              color: format.color,
              borderRadius: 3,
            }}
          >
            {format.icon}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Vista Previa de Exportación
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {format.name} • {filteredCount} registros • {selectedFields.length} campos
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
            Resumen del Archivo
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(format.color, 0.05), border: `1px solid ${alpha(format.color, 0.1)}` }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Formato
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: format.color }}>
                  {format.name}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#10b981', 0.05), border: `1px solid ${alpha('#10b981', 0.1)}` }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Registros
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {filteredCount.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
            Campos Seleccionados ({selectedFields.length})
          </Typography>
          <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedFields.slice(0, 10).map((fieldId) => (
                <Chip
                  key={fieldId}
                  label={fieldId}
                  size="small"
                  sx={{
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    fontWeight: 500,
                  }}
                />
              ))}
              {selectedFields.length > 10 && (
                <Chip
                  label={`+${selectedFields.length - 10} más`}
                  size="small"
                  sx={{
                    bgcolor: alpha('#94a3b8', 0.1),
                    color: '#94a3b8',
                    fontWeight: 500,
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        <Button
          onClick={onExport}
          disabled={loading || selectedFields.length === 0}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Download />}
          fullWidth
          size="large"
          sx={{
            py: 2,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: format.color,
            '&:hover': {
              bgcolor: alpha(format.color, 0.8),
            },
            '&:disabled': {
              bgcolor: '#e2e8f0',
              color: '#94a3b8',
            }
          }}
        >
          {loading ? 'Generando Archivo...' : `Exportar ${format.name}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export const DataExportSection: React.FC<DataExportSectionProps> = ({
  socios,
  stats,
  loading
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>(['nombre', 'email', 'estado']);
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exportLoading, setExportLoading] = useState(false);

  const exportFormats: ExportFormatProps[] = [
    {
      id: 'csv',
      name: 'CSV (Comma Separated)',
      description: 'Formato universal compatible con Excel, Google Sheets y bases de datos',
      icon: <TableChart sx={{ fontSize: 28 }} />,
      color: '#10b981',
      fileExtension: '.csv',
      features: ['Excel Compatible', 'Ligero', 'Universal'],
      recommended: true
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      description: 'Archivo Excel con formato avanzado, gráficos y múltiples hojas',
      icon: <Description sx={{ fontSize: 28 }} />,
      color: '#059669',
      fileExtension: '.xlsx',
      features: ['Formato Avanzado', 'Múltiples Hojas', 'Gráficos']
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Reporte profesional en PDF con diseño corporativo y estadísticas',
      icon: <PictureAsPdf sx={{ fontSize: 28 }} />,
      color: '#ef4444',
      fileExtension: '.pdf',
      features: ['Profesional', 'Estadísticas', 'Diseño Corporativo']
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Formato estructurado para desarrolladores e integraciones API',
      icon: <DataObject sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      fileExtension: '.json',
      features: ['Estructurado', 'API Ready', 'Desarrolladores']
    }
  ];

  const exportFields: ExportFieldProps[] = [
    // Basic
    { id: 'nombre', label: 'Nombre Completo', description: 'Nombre y apellidos del miembro', category: 'basic', required: true },
    { id: 'dni', label: 'DNI/Documento', description: 'Documento de identidad', category: 'basic', sensitive: true },
    
    // Contact
    { id: 'email', label: 'Email', description: 'Dirección de correo electrónico', category: 'contact', required: true },
    { id: 'telefono', label: 'Teléfono', description: 'Número de teléfono de contacto', category: 'contact' },
    
    // Dates
    { id: 'fechaAlta', label: 'Fecha de Alta', description: 'Fecha de registro en el sistema', category: 'dates' },
    { id: 'ultimaActividad', label: 'Última Actividad', description: 'Fecha de última actividad registrada', category: 'dates' },
    
    // Status
    { id: 'estado', label: 'Estado', description: 'Estado actual del miembro', category: 'status', required: true },
    { id: 'tipoMembresia', label: 'Tipo de Membresía', description: 'Categoría de membresía', category: 'status' },
    
    // Custom
    { id: 'notas', label: 'Notas', description: 'Comentarios y observaciones', category: 'custom' },
    { id: 'tags', label: 'Etiquetas', description: 'Tags y categorías personalizadas', category: 'custom' },
  ];

  const filteredSocios = useMemo(() => {
    let filtered = socios;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(socio => socio.estado === statusFilter);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case 'last30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'last3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'lastyear':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(socio => {
        const socioDate = socio.creadoEn.toDate();
        return socioDate >= cutoffDate;
      });
    }

    return filtered;
  }, [socios, statusFilter, dateRange]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleCategoryToggle = (category: string, selected: boolean) => {
    const categoryFields = exportFields.filter(field => field.category === category).map(field => field.id);
    
    if (selected) {
      setSelectedFields(prev => [...new Set([...prev, ...categoryFields])]);
    } else {
      setSelectedFields(prev => prev.filter(id => !categoryFields.includes(id)));
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    
    try {
      const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate and download file
      const filename = `miembros_export_${new Date().toISOString().split('T')[0]}${selectedFormatData?.fileExtension}`;
      
      if (selectedFormat === 'csv') {
        const csvData = filteredSocios.map(socio => {
          const row: any = {};
          selectedFields.forEach(field => {
            switch (field) {
              case 'nombre':
                row.nombre = socio.nombre;
                break;
              case 'email':
                row.email = socio.email;
                break;
              case 'estado':
                row.estado = socio.estado;
                break;
              case 'telefono':
                row.telefono = socio.telefono || '';
                break;
              case 'dni':
                row.dni = socio.dni || '';
                break;
              case 'fechaAlta':
                row.fechaAlta = socio.creadoEn.toDate().toLocaleDateString('es-ES');
                break;
              default:
                row[field] = '';
            }
          });
          return row;
        });

        const headers = selectedFields;
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Success message
      setTimeout(() => {
        alert(`Archivo ${filename} descargado correctamente`);
      }, 100);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar los datos');
    } finally {
      setExportLoading(false);
    }
  };

  const steps = [
    'Seleccionar Formato',
    'Configurar Filtros',
    'Elegir Campos',
    'Exportar Datos'
  ];

  const fieldsByCategory = exportFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExportFieldProps[]>);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 5 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: '#f1f5f9',
                        borderRadius: 3,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                        },
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '80%', height: 16, bgcolor: '#f1f5f9', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '60%', height: 14, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
                }}
              >
                <CloudDownload sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #0f172a 0%, #10b981 60%, #059669 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    mb: 1,
                  }}
                >
                  Exportar Datos
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                  }}
                >
                  Exportación avanzada con múltiples formatos
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  bgcolor: alpha('#10b981', 0.1),
                  color: '#10b981',
                  '&:hover': {
                    bgcolor: alpha('#10b981', 0.2),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Refresh />
              </IconButton>
            </Stack>
          </Box>

          {/* Progress Stepper */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#10b981', 0.05),
              border: `1px solid ${alpha('#10b981', 0.15)}`,
              borderRadius: 4,
              p: 3,
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        color: index <= activeStep ? '#10b981' : '#94a3b8',
                      },
                      '& .MuiStepIcon-root': {
                        color: index <= activeStep ? '#10b981' : '#e2e8f0',
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Box>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Seleccionar Formato de Exportación
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, mb: 4 }}>
                Elige el formato que mejor se adapte a tus necesidades
              </Typography>
              
              <Grid container spacing={4}>
                {exportFormats.map((format, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={format.id}>
                    <ExportFormatCard
                      format={format}
                      selected={selectedFormat === format.id}
                      onSelect={() => setSelectedFormat(format.id)}
                      delay={index * 0.1}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Configurar Filtros
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, mb: 4 }}>
                Filtra los datos que deseas exportar
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                        Filtros de Datos
                      </Typography>
                      
                      <Stack spacing={3}>
                        <FormControl fullWidth>
                          <InputLabel>Estado de Miembros</InputLabel>
                          <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Estado de Miembros"
                          >
                            <MenuItem value="all">Todos los estados</MenuItem>
                            <MenuItem value="activo">Solo activos</MenuItem>
                            <MenuItem value="vencido">Solo vencidos</MenuItem>
                            <MenuItem value="inactivo">Solo inactivos</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl fullWidth>
                          <InputLabel>Rango de Fechas</InputLabel>
                          <Select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            label="Rango de Fechas"
                          >
                            <MenuItem value="all">Todas las fechas</MenuItem>
                            <MenuItem value="last30days">Últimos 30 días</MenuItem>
                            <MenuItem value="last3months">Últimos 3 meses</MenuItem>
                            <MenuItem value="lastyear">Último año</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                        Resumen de Filtros
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Total de registros:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700 }}>
                            {socios.length.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Registros filtrados:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                            {filteredSocios.length.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Divider />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Porcentaje:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 700 }}>
                            {socios.length > 0 ? Math.round((filteredSocios.length / socios.length) * 100) : 0}%
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Seleccionar Campos
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, mb: 4 }}>
                Elige qué información incluir en la exportación
              </Typography>
              
              <Stack spacing={3}>
                {Object.entries(fieldsByCategory).map(([category, fields]) => (
                  <FieldSelectionCard
                    key={category}
                    category={category}
                    fields={fields}
                    selectedFields={selectedFields}
                    onFieldToggle={handleFieldToggle}
                    onCategoryToggle={handleCategoryToggle}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Confirmar y Exportar
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, mb: 4 }}>
                Revisa la configuración y descarga tu archivo
              </Typography>
              
              <Grid container spacing={6}>
                <Grid item xs={12} lg={8}>
                  <ExportPreview
                    format={exportFormats.find(f => f.id === selectedFormat)!}
                    selectedFields={selectedFields}
                    filteredCount={filteredSocios.length}
                    onExport={handleExport}
                    loading={exportLoading}
                  />
                </Grid>
                
                <Grid item xs={12} lg={4}>
                  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 5 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                        Configuración Final
                      </Typography>
                      
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                            Formato Seleccionado
                          </Typography>
                          <Chip
                            label={exportFormats.find(f => f.id === selectedFormat)?.name}
                            sx={{
                              bgcolor: alpha('#10b981', 0.1),
                              color: '#10b981',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                            Filtros Aplicados
                          </Typography>
                          <Stack spacing={1}>
                            <Chip
                              label={`Estado: ${statusFilter === 'all' ? 'Todos' : statusFilter}`}
                              size="small"
                              sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }}
                            />
                            <Chip
                              label={`Fecha: ${dateRange === 'all' ? 'Todas' : dateRange}`}
                              size="small"
                              sx={{ bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6' }}
                            />
                          </Stack>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                            Campos Incluidos
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700 }}>
                            {selectedFields.length} de {exportFields.length} campos
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
        <Button
          onClick={() => setActiveStep(prev => prev - 1)}
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Anterior
        </Button>
        
        {activeStep < steps.length - 1 && (
          <Button
            onClick={() => setActiveStep(prev => prev + 1)}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              }
            }}
          >
            Siguiente
          </Button>
        )}
      </Box>
    </Box>
  );
};
