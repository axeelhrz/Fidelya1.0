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
  DatePicker,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  Download,
  Print,
  Share,
  Refresh,
  FilterList,
  CalendarToday,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  Group,
  PersonAdd,
  Schedule,
  Star,
  Warning,
  CheckCircle,
  Email,
  Phone,
  Business,
  LocationOn,
  AttachMoney,
  Speed,
  Analytics,
  Insights,
  DataUsage,
  TableChart,
  Visibility,
  GetApp,
} from '@mui/icons-material';
import { Socio, SocioStats } from '@/types/socio';

interface ReportsSectionProps {
  socios: Socio[];
  stats: SocioStats;
  loading: boolean;
}

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  onGenerate: () => void;
  onPreview: () => void;
  lastGenerated?: string;
  reportType: 'chart' | 'table' | 'summary';
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon,
  color,
  delay,
  onGenerate,
  onPreview,
  lastGenerated,
  reportType
}) => {
  const getReportTypeIcon = () => {
    switch (reportType) {
      case 'chart': return <BarChart sx={{ fontSize: 16 }} />;
      case 'table': return <TableChart sx={{ fontSize: 16 }} />;
      case 'summary': return <Assessment sx={{ fontSize: 16 }} />;
      default: return <Assessment sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 5,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 60px -10px ${alpha(color, 0.25)}`,
            '& .report-icon': {
              transform: 'scale(1.1)',
              bgcolor: alpha(color, 0.2),
            },
            '& .report-glow': {
              opacity: 0.8,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="report-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)}, ${color})`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
            <Avatar
              className="report-icon"
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha(color, 0.12),
                color: color,
                borderRadius: 3,
                transition: 'all 0.3s ease',
              }}
            >
              {icon}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                  {title}
                </Typography>
                <Chip
                  icon={getReportTypeIcon()}
                  label={reportType.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5, mb: 2 }}>
                {description}
              </Typography>
              {lastGenerated && (
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                  Último reporte: {lastGenerated}
                </Typography>
              )}
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={onPreview}
              size="small"
              startIcon={<Visibility />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#64748b',
                '&:hover': {
                  color: color,
                  bgcolor: alpha(color, 0.05),
                }
              }}
            >
              Vista previa
            </Button>
            <Button
              onClick={onGenerate}
              size="small"
              variant="contained"
              startIcon={<GetApp />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: color,
                '&:hover': {
                  bgcolor: alpha(color, 0.8),
                }
              }}
            >
              Generar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MetricSummaryCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, change, icon, color, subtitle }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: color,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color, 0.1),
              color: color,
              borderRadius: 2,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {change > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: change > 0 ? '#10b981' : '#ef4444',
              }}
            >
              {change > 0 ? '+' : ''}{change}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const ReportPreviewModal: React.FC<{
  open: boolean;
  onClose: () => void;
  reportData: any;
  reportType: string;
}> = ({ open, onClose, reportData, reportType }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
      onClick={onClose}
    >
      <Card
        sx={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 4,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Vista Previa - {reportType}
            </Typography>
            <IconButton onClick={onClose}>
              <Download />
            </IconButton>
          </Box>
          
          {/* Aquí iría el contenido del reporte */}
          <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Vista previa del reporte {reportType}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  socios,
  stats,
  loading
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('last30days');
  const [reportFilter, setReportFilter] = useState('all');
  const [previewModal, setPreviewModal] = useState({ open: false, type: '', data: null });

  const reportCategories = [
    { label: 'Todos los Reportes', value: 'all' },
    { label: 'Miembros', value: 'members' },
    { label: 'Financiero', value: 'financial' },
    { label: 'Actividad', value: 'activity' },
    { label: 'Crecimiento', value: 'growth' },
  ];

  const availableReports = [
    {
      id: 'member-summary',
      title: 'Resumen de Miembros',
      description: 'Estadísticas generales de todos los miembros activos e inactivos',
      icon: <Group sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      category: 'members',
      reportType: 'summary' as const,
      lastGenerated: 'Hace 2 horas'
    },
    {
      id: 'growth-analysis',
      title: 'Análisis de Crecimiento',
      description: 'Tendencias de crecimiento mensual y proyecciones futuras',
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      color: '#10b981',
      category: 'growth',
      reportType: 'chart' as const,
      lastGenerated: 'Ayer'
    },
    {
      id: 'member-activity',
      title: 'Actividad de Miembros',
      description: 'Registro detallado de actividades y participación',
      icon: <Timeline sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      category: 'activity',
      reportType: 'table' as const,
      lastGenerated: 'Hace 1 día'
    },
    {
      id: 'retention-report',
      title: 'Reporte de Retención',
      description: 'Análisis de retención de miembros y factores de abandono',
      icon: <Star sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      category: 'members',
      reportType: 'chart' as const,
      lastGenerated: 'Hace 3 días'
    },
    {
      id: 'financial-overview',
      title: 'Resumen Financiero',
      description: 'Ingresos, cuotas pendientes y proyecciones financieras',
      icon: <AttachMoney sx={{ fontSize: 28 }} />,
      color: '#06b6d4',
      category: 'financial',
      reportType: 'summary' as const,
      lastGenerated: 'Hace 1 semana'
    },
    {
      id: 'demographic-analysis',
      title: 'Análisis Demográfico',
      description: 'Distribución por edad, ubicación y características demográficas',
      icon: <LocationOn sx={{ fontSize: 28 }} />,
      color: '#ec4899',
      category: 'members',
      reportType: 'chart' as const,
      lastGenerated: 'Hace 5 días'
    },
    {
      id: 'engagement-metrics',
      title: 'Métricas de Engagement',
      description: 'Niveles de participación y engagement de los miembros',
      icon: <Speed sx={{ fontSize: 28 }} />,
      color: '#84cc16',
      category: 'activity',
      reportType: 'table' as const,
      lastGenerated: 'Hace 2 días'
    },
    {
      id: 'communication-report',
      title: 'Reporte de Comunicaciones',
      description: 'Efectividad de campañas de email y comunicaciones',
      icon: <Email sx={{ fontSize: 28 }} />,
      color: '#f97316',
      category: 'activity',
      reportType: 'summary' as const,
      lastGenerated: 'Hace 4 días'
    }
  ];

  const filteredReports = useMemo(() => {
    if (reportFilter === 'all') return availableReports;
    return availableReports.filter(report => report.category === reportFilter);
  }, [reportFilter]);

  const handleGenerateReport = (reportId: string) => {
    // Aquí iría la lógica para generar el reporte
    console.log('Generating report:', reportId);
    // Simular descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${reportId}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  };

  const handlePreviewReport = (reportId: string) => {
    const report = availableReports.find(r => r.id === reportId);
    setPreviewModal({
      open: true,
      type: report?.title || '',
      data: { reportId }
    });
  };

  const summaryMetrics = [
    {
      title: 'Total de Reportes',
      value: availableReports.length,
      change: 12.5,
      icon: <Assessment sx={{ fontSize: 24 }} />,
      color: '#6366f1',
      subtitle: 'Disponibles'
    },
    {
      title: 'Reportes Generados',
      value: '156',
      change: 8.3,
      icon: <Download sx={{ fontSize: 24 }} />,
      color: '#10b981',
      subtitle: 'Este mes'
    },
    {
      title: 'Tiempo Promedio',
      value: '2.3s',
      change: -15.2,
      icon: <Speed sx={{ fontSize: 24 }} />,
      color: '#f59e0b',
      subtitle: 'Generación'
    },
    {
      title: 'Datos Procesados',
      value: '1.2M',
      change: 23.1,
      icon: <DataUsage sx={{ fontSize: 24 }} />,
      color: '#8b5cf6',
      subtitle: 'Registros'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {Array.from({ length: 8 }).map((_, index) => (
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ width: 80, height: 32, bgcolor: '#f1f5f9', borderRadius: 2 }} />
                    <Box sx={{ width: 80, height: 32, bgcolor: '#f1f5f9', borderRadius: 2 }} />
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
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Assessment sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #0f172a 0%, #f59e0b 60%, #d97706 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    mb: 1,
                  }}
                >
                  Centro de Reportes
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                  }}
                >
                  Análisis avanzado y reportes ejecutivos
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  bgcolor: alpha('#f59e0b', 0.1),
                  color: '#f59e0b',
                  '&:hover': {
                    bgcolor: alpha('#f59e0b', 0.2),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Refresh />
              </IconButton>
              
              <Button
                variant="contained"
                startIcon={<Download />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Exportar Todo
              </Button>
            </Stack>
          </Box>

          {/* Filters */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#f59e0b', 0.05),
              border: `1px solid ${alpha('#f59e0b', 0.15)}`,
              borderRadius: 4,
              p: 3,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  label="Categoría"
                  startAdornment={<FilterList sx={{ color: '#94a3b8', mr: 1 }} />}
                >
                  {reportCategories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Período"
                  startAdornment={<CalendarToday sx={{ color: '#94a3b8', mr: 1 }} />}
                >
                  <MenuItem value="last7days">Últimos 7 días</MenuItem>
                  <MenuItem value="last30days">Últimos 30 días</MenuItem>
                  <MenuItem value="last3months">Últimos 3 meses</MenuItem>
                  <MenuItem value="last6months">Últimos 6 meses</MenuItem>
                  <MenuItem value="lastyear">Último año</MenuItem>
                  <MenuItem value="custom">Personalizado</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ ml: 'auto' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {filteredReports.length} reportes disponibles
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </motion.div>

      {/* Summary Metrics */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {summaryMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MetricSummaryCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                color={metric.color}
                subtitle={metric.subtitle}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Reports Grid */}
      <Grid container spacing={4}>
        {filteredReports.map((report, index) => (
          <Grid item xs={12} sm={6} lg={3} key={report.id}>
            <ReportCard
              title={report.title}
              description={report.description}
              icon={report.icon}
              color={report.color}
              delay={index * 0.1}
              onGenerate={() => handleGenerateReport(report.id)}
              onPreview={() => handlePreviewReport(report.id)}
              lastGenerated={report.lastGenerated}
              reportType={report.reportType}
            />
          </Grid>
        ))}
      </Grid>

      {/* Preview Modal */}
      <ReportPreviewModal
        open={previewModal.open}
        onClose={() => setPreviewModal({ open: false, type: '', data: null })}
        reportData={previewModal.data}
        reportType={previewModal.type}
      />
    </Box>
  );
};
