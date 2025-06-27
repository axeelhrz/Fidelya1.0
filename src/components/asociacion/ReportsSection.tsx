'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  Stack,
  Chip,
  Button,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh,
  FilterList,
  CalendarToday,
  BarChart,
  Timeline,
  Group,
  Star,
  Email,
  LocationOn,
  AttachMoney,
  Speed,
  DataUsage,
  TableChart,
  Visibility,
  GetApp,
  Close,
  Schedule,
  CheckCircle,
  Warning,
  Info,
  PictureAsPdf,
  TableView,
  InsertChart,
  Description,
  CloudDownload,
  Analytics,
  AutoGraph,
  Insights,
  Delete,
  Share,
} from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { reportsService, ReportData } from '@/services/reports.service';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ReportsSectionProps {
  loading?: boolean;
}

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  category: 'members' | 'financial' | 'activity' | 'growth' | 'engagement';
  reportType: 'chart' | 'table' | 'summary' | 'dashboard';
  estimatedTime: string;
  dataPoints: number;
  lastGenerated?: Date;
  popularity: number;
  isNew?: boolean;
  isPremium?: boolean;
}

interface ReportCardProps {
  template: ReportTemplate;
  delay: number;
  onGenerate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  isGenerating?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
  template,
  delay,
  onGenerate,
  onPreview,
  isGenerating = false
}) => {
  const getReportTypeIcon = () => {
    switch (template.reportType) {
      case 'chart': return <InsertChart sx={{ fontSize: 14 }} />;
      case 'table': return <TableView sx={{ fontSize: 14 }} />;
      case 'summary': return <Description sx={{ fontSize: 14 }} />;
      case 'dashboard': return <Analytics sx={{ fontSize: 14 }} />;
      default: return <Assessment sx={{ fontSize: 14 }} />;
    }
  };

  const getStatusColor = () => {
    if (isGenerating) return '#f59e0b';
    if (template.lastGenerated) return '#10b981';
    return '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ 
        flex: '1 1 auto',
        minWidth: '320px',
        maxWidth: '400px'
      }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: alpha(template.color, 0.3),
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 60px -10px ${alpha(template.color, 0.25)}`,
            '& .report-icon': {
              transform: 'scale(1.1)',
              background: template.gradient,
              color: 'white',
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
            background: template.gradient,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* New/Premium badges */}
        {(template.isNew || template.isPremium) && (
          <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
            {template.isNew && (
              <Chip
                label="NUEVO"
                size="small"
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 20,
                  mr: template.isPremium ? 0.5 : 0,
                }}
              />
            )}
            {template.isPremium && (
              <Chip
                label="PRO"
                size="small"
                sx={{
                  bgcolor: '#f59e0b',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        )}

        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 2.5 }}>
            <Avatar
              className="report-icon"
              sx={{
                width: 52,
                height: 52,
                bgcolor: alpha(template.color, 0.1),
                color: template.color,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${alpha(template.color, 0.2)}`,
                flexShrink: 0,
              }}
            >
              {template.icon}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#0f172a', 
                    fontSize: '1rem',
                    lineHeight: 1.2,
                    flex: '1 1 auto',
                    minWidth: 0,
                  }}
                >
                  {template.title}
                </Typography>
                <Chip
                  icon={getReportTypeIcon()}
                  label={template.reportType.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: alpha(template.color, 0.1),
                    color: template.color,
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 18,
                    flexShrink: 0,
                  }}
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b', 
                  lineHeight: 1.4, 
                  fontSize: '0.85rem',
                  mb: 1.5,
                }}
              >
                {template.description}
              </Typography>
              
              {/* Metrics */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2, 
                mb: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 14, color: '#94a3b8' }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    {template.estimatedTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DataUsage sx={{ fontSize: 14, color: '#94a3b8' }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    {template.dataPoints.toLocaleString()} datos
                  </Typography>
                </Box>
              </Box>

              {/* Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: getStatusColor(),
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {isGenerating 
                    ? 'Generando...' 
                    : template.lastGenerated 
                      ? `Último: ${format(template.lastGenerated, 'dd/MM HH:mm')}`
                      : 'Nunca generado'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Progress bar for generating */}
          {isGenerating && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha(template.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: template.color,
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexWrap: 'wrap'
            }}>
              <Button
                onClick={() => onPreview(template.id)}
                size="small"
                startIcon={<Visibility />}
                disabled={isGenerating}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#64748b',
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                  '&:hover': {
                    color: template.color,
                    bgcolor: alpha(template.color, 0.05),
                  }
                }}
              >
                Vista previa
              </Button>
              <Button
                onClick={() => onGenerate(template.id)}
                size="small"
                variant="contained"
                startIcon={isGenerating ? <CircularProgress size={14} color="inherit" /> : <GetApp />}
                disabled={isGenerating}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  background: template.gradient,
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                  '&:hover': {
                    background: template.gradient,
                    filter: 'brightness(0.9)',
                  },
                  '&:disabled': {
                    background: alpha(template.color, 0.3),
                    color: 'white',
                  }
                }}
              >
                {isGenerating ? 'Generando' : 'Generar'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}> = ({ title, value, change, icon, color, subtitle, loading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        flex: '1 1 auto',
        minWidth: '250px',
        maxWidth: '300px'
      }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
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
                width: 44,
                height: 44,
                bgcolor: alpha(color, 0.1),
                color: color,
                borderRadius: 3,
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : icon}
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {change > 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
              ) : change < 0 ? (
                <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
              ) : null}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#6b7280',
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5, fontSize: '1.8rem' }}>
            {loading ? '...' : value}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ReportPreviewDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  template: ReportTemplate | null;
  onGenerate: (templateId: string) => void;
}> = ({ open, onClose, template, onGenerate }) => {
  if (!template) return null;

  const mockData = {
    chart: [
      { name: 'Ene', value: 120 },
      { name: 'Feb', value: 150 },
      { name: 'Mar', value: 180 },
      { name: 'Abr', value: 160 },
      { name: 'May', value: 200 },
    ],
    table: [
      { nombre: 'Juan Pérez', estado: 'Activo', fecha: '2024-01-15' },
      { nombre: 'María García', estado: 'Vencido', fecha: '2024-02-20' },
      { nombre: 'Carlos López', estado: 'Activo', fecha: '2024-03-10' },
    ],
    summary: {
      totalMembers: 1250,
      activeMembers: 980,
      growthRate: 12.5,
      retentionRate: 87.3,
    }
  };

  const renderPreviewContent = () => {
    switch (template.reportType) {
      case 'chart':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Vista Previa - Gráfico
            </Typography>
            <Box sx={{ 
              height: 200, 
              display: 'flex', 
              alignItems: 'end', 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              {mockData.chart.map((item, index) => (
                <Box key={index} sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '60px' }}>
                  <Box
                    sx={{
                      height: `${(item.value / 200) * 100}%`,
                      bgcolor: template.color,
                      borderRadius: '4px 4px 0 0',
                      minHeight: 20,
                      mb: 1,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {item.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'table':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Vista Previa - Tabla
            </Typography>
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderBottom: '1px solid #e2e8f0' }}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, flex: '1 1 auto', minWidth: '100px' }}>Nombre</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, flex: '1 1 auto', minWidth: '80px' }}>Estado</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, flex: '1 1 auto', minWidth: '100px' }}>Fecha</Typography>
                </Box>
              </Box>
              {mockData.table.map((row, index) => (
                <Box key={index} sx={{ p: 2, borderBottom: index < mockData.table.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" sx={{ flex: '1 1 auto', minWidth: '100px' }}>{row.nombre}</Typography>
                    <Box sx={{ flex: '1 1 auto', minWidth: '80px' }}>
                      <Chip 
                        label={row.estado} 
                        size="small" 
                        color={row.estado === 'Activo' ? 'success' : 'error'}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ flex: '1 1 auto', minWidth: '100px', color: '#64748b' }}>{row.fecha}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'summary':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Vista Previa - Resumen
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2
            }}>
              <MetricCard
                title="Total Miembros"
                value={mockData.summary.totalMembers}
                change={mockData.summary.growthRate}
                icon={<Group />}
                color="#6366f1"
              />
              <MetricCard
                title="Miembros Activos"
                value={mockData.summary.activeMembers}
                change={mockData.summary.retentionRate - 80}
                icon={<CheckCircle />}
                color="#10b981"
              />
            </Box>
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Vista previa no disponible para este tipo de reporte
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '80vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 auto', minWidth: 0 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(template.color, 0.1),
              color: template.color,
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            {template.icon}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {template.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {template.description}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ flexShrink: 0 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {renderPreviewContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cerrar
        </Button>
        <Button
          onClick={() => {
            onGenerate(template.id);
            onClose();
          }}
          variant="contained"
          startIcon={<GetApp />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            background: template.gradient,
          }}
        >
          Generar Reporte
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  loading: propLoading = false
}) => {
  const { user } = useAuth();
  const { stats } = useSocios();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generatedReports, setGeneratedReports] = useState<ReportData[]>([]);
  const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set());
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; template: ReportTemplate | null }>({
    open: false,
    template: null
  });

  const reportTemplates: ReportTemplate[] = useMemo(() => [
    {
      id: 'member-summary',
      title: 'Resumen de Miembros',
      description: 'Estadísticas completas de todos los miembros con análisis de tendencias',
      icon: <Group sx={{ fontSize: 24 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      category: 'members',
      reportType: 'summary',
      estimatedTime: '2-3 min',
      dataPoints: stats.total * 15,
      popularity: 95,
      isNew: false,
    },
    {
      id: 'growth-analysis',
      title: 'Análisis de Crecimiento',
      description: 'Tendencias de crecimiento mensual con proyecciones y análisis predictivo',
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      category: 'growth',
      reportType: 'chart',
      estimatedTime: '1-2 min',
      dataPoints: stats.total * 8,
      popularity: 88,
      isNew: true,
    },
    {
      id: 'activity-timeline',
      title: 'Timeline de Actividad',
      description: 'Registro cronológico detallado de todas las actividades y eventos',
      icon: <Timeline sx={{ fontSize: 24 }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      category: 'activity',
      reportType: 'table',
      estimatedTime: '3-4 min',
      dataPoints: stats.total * 25,
      popularity: 76,
    },
    {
      id: 'retention-analysis',
      title: 'Análisis de Retención',
      description: 'Métricas de retención con identificación de patrones de abandono',
      icon: <Star sx={{ fontSize: 24 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      category: 'members',
      reportType: 'chart',
      estimatedTime: '2-3 min',
      dataPoints: stats.total * 12,
      popularity: 82,
      isPremium: true,
    },
    {
      id: 'financial-overview',
      title: 'Resumen Financiero',
      description: 'Análisis completo de ingresos, cuotas y proyecciones financieras',
      icon: <AttachMoney sx={{ fontSize: 24 }} />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      category: 'financial',
      reportType: 'dashboard',
      estimatedTime: '4-5 min',
      dataPoints: stats.total * 20,
      popularity: 91,
      isPremium: true,
    },
    {
      id: 'demographic-analysis',
      title: 'Análisis Demográfico',
      description: 'Distribución detallada por edad, ubicación y características',
      icon: <LocationOn sx={{ fontSize: 24 }} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      category: 'members',
      reportType: 'chart',
      estimatedTime: '2-3 min',
      dataPoints: stats.total * 10,
      popularity: 73,
    },
    {
      id: 'engagement-metrics',
      title: 'Métricas de Engagement',
      description: 'Análisis profundo de participación y niveles de compromiso',
      icon: <Speed sx={{ fontSize: 24 }} />,
      color: '#84cc16',
      gradient: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      category: 'engagement',
      reportType: 'dashboard',
      estimatedTime: '3-4 min',
      dataPoints: stats.total * 18,
      popularity: 79,
      isNew: true,
    },
    {
      id: 'communication-report',
      title: 'Reporte de Comunicaciones',
      description: 'Efectividad de campañas y análisis de comunicaciones',
      icon: <Email sx={{ fontSize: 24 }} />,
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      category: 'activity',
      reportType: 'table',
      estimatedTime: '2-3 min',
      dataPoints: stats.total * 6,
      popularity: 68,
    }
  ], [stats.total]);

  const categoryOptions = [
    { label: 'Todos los Reportes', value: 'all' },
    { label: 'Miembros', value: 'members' },
    { label: 'Financiero', value: 'financial' },
    { label: 'Actividad', value: 'activity' },
    { label: 'Crecimiento', value: 'growth' },
    { label: 'Engagement', value: 'engagement' },
  ];

  const dateRangeOptions = [
    { label: 'Últimos 7 días', value: 'last7days' },
    { label: 'Últimos 30 días', value: 'last30days' },
    { label: 'Últimos 3 meses', value: 'last3months' },
    { label: 'Últimos 6 meses', value: 'last6months' },
    { label: 'Último año', value: 'lastyear' },
    { label: 'Todo el tiempo', value: 'alltime' },
  ];

  // Fetch generated reports from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = reportsService.subscribeToUserReports(user.uid, (reports) => {
      setGeneratedReports(reports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return reportTemplates;
    return reportTemplates.filter(template => template.category === categoryFilter);
  }, [reportTemplates, categoryFilter]);

  const getDateRangeTimestamps = (range: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (range) {
      case 'last7days':
        startDate = subDays(now, 7);
        break;
      case 'last30days':
        startDate = subDays(now, 30);
        break;
      case 'last3months':
        startDate = subDays(now, 90);
        break;
      case 'last6months':
        startDate = subDays(now, 180);
        break;
      case 'lastyear':
        startDate = subDays(now, 365);
        break;
      default:
        startDate = new Date(2020, 0, 1); // Default to a very old date
    }

    return {
      startDate: Timestamp.fromDate(startOfDay(startDate)),
      endDate: Timestamp.fromDate(endOfDay(endDate))
    };
  };

  const handleGenerateReport = async (templateId: string) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }

    try {
      setGeneratingReports(prev => new Set([...prev, templateId]));

      const { startDate, endDate } = getDateRangeTimestamps(dateRange);

      const reportId = await reportsService.generateReport(
        templateId,
        user.uid,
        user.uid, // Using user.uid as asociacionId for now
        {
          dateRange,
          categoryFilter,
          startDate,
          endDate,
          includeCharts: true,
          format: 'pdf'
        }
      );

      toast.success('Reporte generado exitosamente');
      
      // Remove from generating set after a delay to show completion
      setTimeout(() => {
        setGeneratingReports(prev => {
          const newSet = new Set(prev);
          newSet.delete(templateId);
          return newSet;
        });
      }, 3000);

    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
      setGeneratingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(templateId);
        return newSet;
      });
    }
  };

  const handlePreviewReport = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    setPreviewDialog({ open: true, template: template || null });
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await reportsService.deleteReport(reportId);
      toast.success('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error al eliminar el reporte');
    }
  };

  const summaryMetrics = useMemo(() => [
    {
      title: 'Reportes Disponibles',
      value: reportTemplates.length,
      change: 12.5,
      icon: <Assessment sx={{ fontSize: 20 }} />,
      color: '#6366f1',
      subtitle: 'Templates activos',
      loading: propLoading
    },
    {
      title: 'Reportes Generados',
      value: generatedReports.length,
      change: 8.3,
      icon: <CloudDownload sx={{ fontSize: 20 }} />,
      color: '#10b981',
      subtitle: 'Este período',
      loading: propLoading
    },
    {
      title: 'Tiempo Promedio',
      value: '2.8min',
      change: -15.2,
      icon: <Speed sx={{ fontSize: 20 }} />,
      color: '#f59e0b',
      subtitle: 'Generación',
      loading: propLoading
    },
    {
      title: 'Datos Procesados',
      value: `${(stats.total * 15 / 1000).toFixed(1)}K`,
      change: 23.1,
      icon: <DataUsage sx={{ fontSize: 20 }} />,
      color: '#8b5cf6',
      subtitle: 'Registros totales',
      loading: propLoading
    }
  ], [reportTemplates.length, generatedReports.length, stats.total, propLoading]);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: '1 1 auto', minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)',
                  flexShrink: 0,
                }}
              >
                <Assessment sx={{ fontSize: 32 }} />
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '2.5rem' },
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
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  Análisis avanzado y reportes ejecutivos • {user?.email?.split('@')[0] || 'Administrador'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexShrink: 0,
              flexWrap: 'wrap'
            }}>
              <IconButton
                onClick={() => window.location.reload()}
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
                  py: 2,
                  px: 4,
                  borderRadius: 3,
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
            </Box>
          </Box>
          
          {/* Filters */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#f59e0b', 0.05),
              border: `2px solid ${alpha('#f59e0b', 0.15)}`,
              borderRadius: 4,
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #f59e0b, #d97706, #b45309)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 3
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flex: '1 1 auto',
                flexWrap: 'wrap'
              }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Categoría"
                    startAdornment={<FilterList sx={{ color: '#94a3b8', mr: 1 }} />}
                    sx={{ bgcolor: 'white' }}
                  >
                    {categoryOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
                    sx={{ bgcolor: 'white' }}
                  >
                    {dateRangeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: '#f59e0b',
                    borderRadius: '50%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: '#d97706', fontWeight: 700 }}>
                  {filteredTemplates.length} reportes disponibles
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* Summary Metrics */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 6,
        justifyContent: 'center'
      }}>
        {summaryMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </Box>

      {/* Reports Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4,
        alignItems: 'stretch',
        justifyContent: 'center'
      }}>
        {loading || propLoading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <Box key={index} style={{ 
              flex: '1 1 auto',
              minWidth: '320px',
              maxWidth: '400px'
            }}>
              <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
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
                      <Box sx={{ width: '60%', height: 14, bgcolor: '#f1f5f9', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '90%', height: 12, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Box sx={{ width: '50%', height: 32, bgcolor: '#f1f5f9', borderRadius: 2 }} />
                    <Box sx={{ width: '50%', height: 32, bgcolor: '#f1f5f9', borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          filteredTemplates.map((template, index) => (
            <ReportCard
              key={template.id}
              template={template}
              delay={index * 0.1}
              onGenerate={handleGenerateReport}
              onPreview={handlePreviewReport}
              isGenerating={generatingReports.has(template.id)}
            />
          ))
        )}
      </Box>

      {/* Empty State */}
      {!loading && !propLoading && filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              border: '2px dashed #e2e8f0',
              borderRadius: 4,
              bgcolor: '#fafbfc',
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha('#f59e0b', 0.1),
                color: '#f59e0b',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Assessment sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              No hay reportes disponibles
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
              No se encontraron reportes para los filtros seleccionados.
              Intenta cambiar la categoría o el período de tiempo.
            </Typography>
            <Button
              onClick={() => {
                setCategoryFilter('all');
                setDateRange('last30days');
              }}
              variant="contained"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              }}
            >
              Mostrar Todos los Reportes
            </Button>
          </Paper>
        </motion.div>
      )}

      {/* Recent Reports Section */}
      {generatedReports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 4 }}>
              Reportes Recientes
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              maxHeight: 400,
              overflowY: 'auto',
              pr: 1,
            }}>
              {generatedReports.slice(0, 10).map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid #f1f5f9',
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: alpha('#f59e0b', 0.3),
                        boxShadow: `0 4px 20px ${alpha('#f59e0b', 0.1)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 auto', minWidth: 0 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: report.status === 'completed' ? alpha('#10b981', 0.1) : 
                                       report.status === 'generating' ? alpha('#f59e0b', 0.1) : 
                                       alpha('#ef4444', 0.1),
                              color: report.status === 'completed' ? '#10b981' : 
                                     report.status === 'generating' ? '#f59e0b' : 
                                     '#ef4444',
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          >
                            {report.status === 'completed' ? <CheckCircle sx={{ fontSize: 20 }} /> :
                             report.status === 'generating' ? <CircularProgress size={16} /> :
                             <Warning sx={{ fontSize: 20 }} />}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {report.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {format(report.generatedAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: es })}
                              {report.fileSize && ` • ${report.fileSize}`}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                          <Chip
                            label={report.status === 'completed' ? 'Completado' : 
                                   report.status === 'generating' ? 'Generando' : 'Error'}
                            size="small"
                            color={report.status === 'completed' ? 'success' : 
                                   report.status === 'generating' ? 'warning' : 'error'}
                            sx={{ fontWeight: 600 }}
                          />
                          {report.status === 'completed' && (
                            <>
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#f59e0b',
                                  '&:hover': {
                                                    bgcolor: alpha('#f59e0b', 0.1),
                                  }
                                }}
                              >
                                <Download sx={{ fontSize: 18 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteReport(report.id!)}
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': {
                                    bgcolor: alpha('#ef4444', 0.1),
                                  }
                                }}
                              >
                                <Delete sx={{ fontSize: 18 }} />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Preview Dialog */}
      <ReportPreviewDialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, template: null })}
        template={previewDialog.template}
        onGenerate={handleGenerateReport}
      />
    </Box>
  );
};

