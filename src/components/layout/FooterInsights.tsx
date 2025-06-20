'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Grid,
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
  Backup,
  Policy,
  Verified,
  Schedule,
  Calculate,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import { AIInsight, ComplianceMetrics, ScenarioSimulation } from '@/types/ceo';
import { format } from 'date-fns';

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
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    incrementoPacientes: 0,
    cambioTarifas: 0,
    nuevosConsultorios: 0,
    reduccionCostos: 0,
  });

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
    setSimulatorOpen(true);
  };

  const calculateSimulationResults = (): ScenarioSimulation['resultadosProyectados'] => {
    // Base metrics (simulated)
    const baseIngresos = 50000;
    const baseEbitda = 15000;
    
    // Calculate projections based on parameters
    const newIngresos = baseIngresos * 
      (1 + simulationParams.incrementoPacientes / 100) * 
      (1 + simulationParams.cambioTarifas / 100);
    
    const newCostos = (baseIngresos - baseEbitda) * 
      (1 - simulationParams.reduccionCostos / 100) +
      (simulationParams.nuevosConsultorios * 2000); // $2k per new office
    
    const newEbitda = newIngresos - newCostos;
    const roi = ((newEbitda - baseEbitda) / Math.abs(simulationParams.nuevosConsultorios * 10000 || 1)) * 100;
    const paybackMeses = Math.abs(simulationParams.nuevosConsultorios * 10000) / Math.max(newEbitda - baseEbitda, 1);

    return {
      ingresosMensuales: newIngresos,
      ebitda: newEbitda,
      roi: roi,
      paybackMeses: paybackMeses
    };
  };

  const simulationResults = calculateSimulationResults();

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
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #1a1d29 0%, #252a3a 100%)'
            : 'linear-gradient(180deg, #F2EDEA 0%, #f8faff 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          zIndex: 1100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Collapsed View */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'center',
              '& > *': {
                flex: '1 1 300px',
                minWidth: 300,
                maxWidth: {
                  xs: '100%',
                  md: 'calc(33.333% - 16px)'
                }
              }
            }}
          >
            {/* AI Insights Section */}
            <Paper
              sx={{
                p: 2,
                background: alpha('#5D4FB0', 0.05),
                border: `1px solid ${alpha('#5D4FB0', 0.1)}`,
                borderRadius: 3,
                cursor: 'pointer',
              }}
              onClick={() => setInsightsExpanded(!insightsExpanded)}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <AutoAwesome sx={{ color: '#5D4FB0' }} />
                  <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                    AI Insights
                  </Typography>
                  <Chip
                    label={aiInsights.length}
                    size="small"
                    sx={{ 
                      backgroundColor: '#5D4FB0',
                      color: 'white',
                      fontSize: '0.7rem' 
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Calculate />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateChanges();
                    }}
                    sx={{ 
                      fontSize: '0.75rem',
                      borderColor: '#5D4FB0',
                      color: '#5D4FB0',
                      '&:hover': {
                        borderColor: '#A593F3',
                        backgroundColor: alpha('#5D4FB0', 0.1)
                      }
                    }}
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

            {/* Compliance Gauge Section */}
            <Paper
              sx={{
                p: 2,
                background: alpha('#A5CAE6', 0.05),
                border: `1px solid ${alpha('#A5CAE6', 0.1)}`,
                borderRadius: 3,
                cursor: 'pointer',
              }}
              onClick={() => setComplianceExpanded(!complianceExpanded)}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Security sx={{ color: '#A5CAE6' }} />
                  <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                    Compliance Gauge
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" fontWeight="bold" color="#A5CAE6">
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
                  bgcolor: alpha('#A5CAE6', 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#A5CAE6',
                    borderRadius: 3
                  }
                }}
              />
            </Paper>

            {/* Daily CEO Brief Section */}
            <Paper
              sx={{
                p: 2,
                background: alpha('#D97DB7', 0.05),
                border: `1px solid ${alpha('#D97DB7', 0.1)}`,
                borderRadius: 3,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <GetApp sx={{ color: '#D97DB7' }} />
                  <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                    📥 Daily CEO Brief
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleExportBrief}
                  sx={{ 
                    fontSize: '0.75rem',
                    backgroundColor: '#D97DB7',
                    '&:hover': {
                      backgroundColor: alpha('#D97DB7', 0.8)
                    }
                  }}
                >
                  Descargar PDF
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Resumen del día con KPIs y alertas
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Expanded AI Insights */}
        <Collapse in={insightsExpanded}>
          <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Neris", sans-serif' }}>
              <AutoAwesome sx={{ color: '#5D4FB0' }} />
              Sugerencias de IA
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                '& > *': {
                  flex: '1 1 400px',
                  minWidth: 400,
                  maxWidth: {
                    xs: '100%',
                    md: 'calc(50% - 8px)'
                  }
                }
              }}
            >
              {aiInsights.map((insight) => (
                <Paper
                  key={insight.id}
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
                        <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
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
              ))}
            </Box>
          </Box>
        </Collapse>

        {/* Expanded Compliance */}
        <Collapse in={complianceExpanded}>
          <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Neris", sans-serif' }}>
              <Security sx={{ color: '#A5CAE6' }} />
              Checklist de Compliance
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                '& > *': {
                  flex: '1 1 250px',
                  minWidth: 250,
                  maxWidth: {
                    xs: '100%',
                    sm: 'calc(50% - 8px)',
                    md: 'calc(25% - 12px)'
                  }
                }
              }}
            >
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Backup sx={{
                  fontSize: 32,
                  color: complianceMetrics.backupsVerificados?.completado ? 'success.main' : 'error.main',
                  mb: 1
                }} />
                <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
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

              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Policy sx={{
                  fontSize: 32,
                  color: (complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0) >= 90 ? 'success.main' : 'warning.main',
                  mb: 1
                }} />
                <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                  Políticas Firmadas
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="#5D4FB0">
                  {complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={complianceMetrics.politicasFirmadas?.porcentajeCompletado || 0}
                  sx={{ mt: 1, height: 4, borderRadius: 2 }}
                />
              </Paper>

              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Verified sx={{
                  fontSize: 32,
                  color: complianceMetrics.accesosAuditados?.completado ? 'success.main' : 'warning.main',
                  mb: 1
                }} />
                <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
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

              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Schedule sx={{
                  fontSize: 32,
                  color: complianceMetrics.certificacionesMSP?.vigentes ? 'success.main' : 'error.main',
                  mb: 1
                }} />
                <Typography variant="subtitle2" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                  Certificaciones MSP
                </Typography>
                <Chip
                  label={complianceMetrics.certificacionesMSP?.vigentes ? 'Vigentes' : 'Vencidas'}
                  size="small"
                  color={complianceMetrics.certificacionesMSP?.vigentes ? 'success' : 'error'}
                  sx={{ mt: 1 }}
                />
                {complianceMetrics.certificacionesMSP?.proximoVencimiento && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Próximo: {format(complianceMetrics.certificacionesMSP.proximoVencimiento, 'dd/MM/yyyy')}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Scenario Simulator Dialog */}
      <Dialog
        open={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #F2EDEA 0%, #fafbff 100%)',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Calculate />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                🧮 Simulador de Escenarios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ¿Qué pasa si cambio estos parámetros?
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Parameter Controls */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontFamily: '"Neris", sans-serif' }}>
                Parámetros de Simulación
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Incremento de Pacientes: {simulationParams.incrementoPacientes}%
                </Typography>
                <Slider
                  value={simulationParams.incrementoPacientes}
                  onChange={(_, value) => setSimulationParams(prev => ({ ...prev, incrementoPacientes: value as number }))}
                  min={-50}
                  max={100}
                  step={5}
                  marks={[
                    { value: -50, label: '-50%' },
                    { value: 0, label: '0%' },
                    { value: 50, label: '+50%' },
                    { value: 100, label: '+100%' }
                  ]}
                  sx={{ color: '#5D4FB0' }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Cambio en Tarifas: {simulationParams.cambioTarifas}%
                </Typography>
                <Slider
                  value={simulationParams.cambioTarifas}
                  onChange={(_, value) => setSimulationParams(prev => ({ ...prev, cambioTarifas: value as number }))}
                  min={-30}
                  max={50}
                  step={2.5}
                  marks={[
                    { value: -30, label: '-30%' },
                    { value: 0, label: '0%' },
                    { value: 25, label: '+25%' },
                    { value: 50, label: '+50%' }
                  ]}
                  sx={{ color: '#A593F3' }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Nuevos Consultorios: {simulationParams.nuevosConsultorios}
                </Typography>
                <Slider
                  value={simulationParams.nuevosConsultorios}
                  onChange={(_, value) => setSimulationParams(prev => ({ ...prev, nuevosConsultorios: value as number }))}
                  min={0}
                  max={5}
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 2, label: '2' },
                    { value: 5, label: '5' }
                  ]}
                  sx={{ color: '#A5CAE6' }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Reducción de Costos: {simulationParams.reduccionCostos}%
                </Typography>
                <Slider
                  value={simulationParams.reduccionCostos}
                  onChange={(_, value) => setSimulationParams(prev => ({ ...prev, reduccionCostos: value as number }))}
                  min={0}
                  max={30}
                  step={2.5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 15, label: '15%' },
                    { value: 30, label: '30%' }
                  ]}
                  sx={{ color: '#D97DB7' }}
                />
              </Box>
            </Grid>

            {/* Results */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontFamily: '"Neris", sans-serif' }}>
                Resultados Proyectados
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: alpha('#5D4FB0', 0.1),
                    border: `1px solid ${alpha('#5D4FB0', 0.2)}`,
                  }}
                >
                  <AttachMoney sx={{ fontSize: 32, color: '#5D4FB0', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="#5D4FB0">
                    ${simulationResults.ingresosMensuales.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos Mensuales
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: alpha('#A593F3', 0.1),
                    border: `1px solid ${alpha('#A593F3', 0.2)}`,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32, color: '#A593F3', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="#A593F3">
                    ${simulationResults.ebitda.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    EBITDA Proyectado
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: alpha('#A5CAE6', 0.1),
                    border: `1px solid ${alpha('#A5CAE6', 0.2)}`,
                  }}
                >
                  <Assessment sx={{ fontSize: 32, color: '#A5CAE6', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="#A5CAE6">
                    {simulationResults.roi.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ROI Estimado
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: alpha('#D97DB7', 0.1),
                    border: `1px solid ${alpha('#D97DB7', 0.2)}`,
                  }}
                >
                  <Schedule sx={{ fontSize: 32, color: '#D97DB7', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="#D97DB7">
                    {simulationResults.paybackMeses.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payback (meses)
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSimulatorOpen(false)}>
            Cerrar
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              background: `linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, #A593F3 0%, #5D4FB0 100%)`,
              }
            }}
          >
            Guardar Escenario
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
