'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  AutoAwesome,
  Assessment,
  GetApp,
  ExpandLess,
  ExpandMore,
  Lightbulb,
  Security,
  CheckCircle,
  Warning,
  Error,
  Backup,
  Policy,
  Verified,
  Schedule,
} from '@mui/icons-material';
import { AIInsight, ComplianceMetrics } from '@/types/ceo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FooterInsightsProps {
  aiInsights: AIInsight[];
  complianceMetrics: ComplianceMetrics;
  loading?: boolean;
}

export default function FooterInsights({ 
  aiInsights, 
  complianceMetrics, 
  loading = false 
}: FooterInsightsProps) {
  const theme = useTheme();
  const [insightsExpanded, setInsightsExpanded] = useState(false);
  const [complianceExpanded, setComplianceExpanded] = useState(false);

  const getInsightIcon = (tipo: string) => {
    switch (tipo) {
      case 'oportunidad': return <Lightbulb sx={{ color: theme.palette.success.main }} />;
      case 'riesgo': return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'optimizacion': return <AutoAwesome sx={{ color: theme.palette.primary.main }} />;
      case 'tendencia': return <Assessment sx={{ color: theme.palette.info.main }} />;
      default: return <AutoAwesome sx={{ color: theme.palette.primary.main }} />;
    }
  };

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case 'alto': return theme.palette.error.main;
      case 'medio': return theme.palette.warning.main;
      case 'bajo': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const calculateOverallCompliance = () => {
    const metrics = [
      complianceMetrics.backupsVerificados?.completado ? 100 : 0,
      complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0,
      complianceMetrics.accesosAuditados?.completado ? 100 : 0,
      complianceMetrics.certificacionesMSP?.vigentes ? 100 : 0,
    ];
    return metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length;
  };

  const overallCompliance = calculateOverallCompliance();

  const handleExportBrief = () => {
    console.log('Exporting daily CEO brief...');
    // Here you would implement the PDF export functionality
  };

  const handleSimulateChanges = () => {
    console.log('Opening scenario simulator...');
    // Here you would open the scenario simulation modal
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Cargando insights...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #1a1d29 0%, #252a3a 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        zIndex: 1100,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Collapsed View */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3} alignItems="center">
          {/* AI Insights Section */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                background: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 3,
                cursor: 'pointer',
              }}
              onClick={() => setInsightsExpanded(!insightsExpanded)}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <AutoAwesome sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    AI Insights
                  </Typography>
                  <Chip
                    label={aiInsights.length}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateChanges();
                    }}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Simular cambios
                  </Button>
                  {insightsExpanded ? <ExpandLess /> : <ExpandMore />}
                </Box>
              </Box>
              
              {aiInsights.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {aiInsights[0].titulo}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Compliance Gauge Section */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                background: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                borderRadius: 3,
                cursor: 'pointer',
              }}
              onClick={() => setComplianceExpanded(!complianceExpanded)}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Security sx={{ color: 'info.main' }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Compliance Gauge
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {overallCompliance.toFixed(0)}%
                  </Typography>
                  {complianceExpanded ? <ExpandLess /> : <ExpandMore />}
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={overallCompliance}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.info.main,
                    borderRadius: 3
                  }
                }}
              />
            </Paper>
          </Grid>

          {/* Daily CEO Brief Section */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                background: alpha(theme.palette.secondary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                borderRadius: 3,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <GetApp sx={{ color: 'secondary.main' }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Daily CEO Brief
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleExportBrief}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Descargar PDF
                </Button>
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Resumen del día con KPIs y alertas
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Expanded AI Insights */}
      <Collapse in={insightsExpanded}>
        <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: 'primary.main' }} />
            Sugerencias de IA
          </Typography>
          
          <Grid container spacing={2}>
            {aiInsights.map((insight) => (
              <Grid item xs={12} md={6} key={insight.id}>
                <Paper
                  sx={{
                    p: 2,
                    background: alpha(getImpactColor(insight.impacto), 0.05),
                    border: `1px solid ${alpha(getImpactColor(insight.impacto), 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box display="flex" alignItems="start" gap={2}>
                    {getInsightIcon(insight.tipo)}
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {insight.titulo}
                        </Typography>
                        <Chip
                          label={`${insight.confianza}% confianza`}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            backgroundColor: alpha(getImpactColor(insight.impacto), 0.2),
                            color: getImpactColor(insight.impacto),
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {insight.descripcion}
                      </Typography>
                      
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">
                        Acciones recomendadas:
                      </Typography>
                      <List dense sx={{ mt: 0.5 }}>
                        {insight.accionesRecomendadas.slice(0, 2).map((accion, index) => (
                          <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="caption">
                                  {accion}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>

      {/* Expanded Compliance */}
      <Collapse in={complianceExpanded}>
        <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security sx={{ color: 'info.main' }} />
            Checklist de Compliance
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Backup sx={{ 
                  fontSize: 32, 
                  color: complianceMetrics.backupsVerificados?.completado ? 'success.main' : 'error.main',
                  mb: 1 
                }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Backups Verificados
                </Typography>
                <Chip
                  label={complianceMetrics.backupsVerificados?.completado ? 'Completado' : 'Pendiente'}
                  size="small"
                  color={complianceMetrics.backupsVerificados?.completado ? 'success' : 'error'}
                  sx={{ mt: 1 }}
                />
                {complianceMetrics.backupsVerificados?.ultimaVerificacion && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Último: {format(complianceMetrics.backupsVerificados.ultimaVerificacion, 'dd/MM/yyyy')}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Policy sx={{ 
                  fontSize: 32, 
                  color: (complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0) >= 90 ? 'success.main' : 'warning.main',
                  mb: 1 
                }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Políticas Firmadas
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0}
                  sx={{ mt: 1, height: 4, borderRadius: 2 }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Verified sx={{ 
                  fontSize: 32, 
                  color: complianceMetrics.accesosAuditados?.completado ? 'success.main' : 'warning.main',
                  mb: 1 
                }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Accesos Auditados
                </Typography>
                <Chip
                  label={complianceMetrics.accesosAuditados?.completado ? 'Completado' : 'Pendiente'}
                  size="small"
                  color={complianceMetrics.accesosAuditados?.completado ? 'success' : 'warning'}
                  sx={{ mt: 1 }}
                />
                {complianceMetrics.accesosAuditados?.hallazgos !== undefined && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {complianceMetrics.accesosAuditados.hallazgos} hallazgos
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Schedule sx={{ 
                  fontSize: 32, 
                  color: complianceMetrics.certificacionesMSP?.vigentes ? 'success.main' : 'error.main',
                  mb: 1 
                }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Certificaciones MSP
                </Typography>
                <Chip
                  label={complianceMetrics.certificacionesMSP?.vigentes ? 'Vigentes' : 'Vencidas'}
                  size="small"
                  color={complianceMetrics.certificacionesMSP?.
