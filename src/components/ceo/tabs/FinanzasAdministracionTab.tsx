'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Download,
  Calculate,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { CEODashboardState } from '@/types/ceo';

// Minimalist color palette
const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
};

interface FinanzasAdministracionTabProps {
  ceoMetrics: CEODashboardState;
}

export default function FinanzasAdministracionTab({ ceoMetrics }: FinanzasAdministracionTabProps) {
  const [tarifaSimulacion, setTarifaSimulacion] = useState(5);

  // Sample financial comparison data
  const financialComparisonData = [
    { mes: 'Ene', ingresos: 45000, egresos: 38000 },
    { mes: 'Feb', ingresos: 48000, egresos: 39000 },
    { mes: 'Mar', ingresos: 52000, egresos: 41000 },
    { mes: 'Abr', ingresos: 49000, egresos: 40000 },
    { mes: 'May', ingresos: 55000, egresos: 42000 },
    { mes: 'Jun', ingresos: 58000, egresos: 43000 },
  ];

  // Sample accounts receivable data
  const cuentasPorCobrar = [
    { cliente: 'Seguro Médico A', monto: 8500, dias: 45, estado: 'pendiente' },
    { cliente: 'Paciente B.', monto: 1200, dias: 32, estado: 'en_proceso' },
    { cliente: 'Empresa C', monto: 3400, dias: 67, estado: 'vencido' },
    { cliente: 'Seguro Médico D', monto: 2500, dias: 28, estado: 'pendiente' },
  ];

  // Sample compliance metrics
  const complianceItems = [
    { item: 'Licencia Sanitaria', estado: 'vigente', vencimiento: '2024-12-15', criticidad: 'alta' },
    { item: 'Certificado Profesional', estado: 'vigente', vencimiento: '2024-08-30', criticidad: 'media' },
    { item: 'Auditoría Interna', estado: 'pendiente', vencimiento: '2024-04-15', criticidad: 'alta' },
    { item: 'Backup de Datos', estado: 'completado', vencimiento: '2024-04-01', criticidad: 'baja' },
    { item: 'Políticas HIPAA', estado: 'vigente', vencimiento: '2024-06-30', criticidad: 'alta' },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'vigente':
      case 'completado': return colors.success;
      case 'pendiente':
      case 'en_proceso': return colors.warning;
      case 'vencido': return colors.error;
      default: return colors.secondary;
    }
  };

  const getCriticidadColor = (criticidad: string) => {
    switch (criticidad) {
      case 'alta': return colors.error;
      case 'media': return colors.warning;
      case 'baja': return colors.success;
      default: return colors.secondary;
    }
  };

  const calcularImpactoTarifa = () => {
    const ingresoActual = 55000;
    const incremento = (tarifaSimulacion / 100) * ingresoActual;
    return {
      nuevoIngreso: ingresoActual + incremento,
      incrementoMensual: incremento,
      incrementoAnual: incremento * 12,
    };
  };

  const impactoTarifa = calcularImpactoTarifa();

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          color: colors.text,
          mb: 4,
        }}
      >
        Finanzas & Administración
      </Typography>

      <Grid container spacing={4}>
        {/* Gráfico Comparativo Ingresos vs Egresos */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Ingresos vs Egresos (6 meses)
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Análisis comparativo de flujo de caja mensual
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                }}
              >
                Exportar
              </Button>
            </Box>

            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={financialComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="mes" 
                    stroke={colors.textSecondary}
                    fontSize={12}
                    fontFamily='"Inter", sans-serif'
                  />
                  <YAxis 
                    stroke={colors.textSecondary}
                    fontSize={12}
                    fontFamily='"Inter", sans-serif'
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid #e2e8f0`,
                      borderRadius: 8,
                      fontFamily: '"Inter", sans-serif',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="ingresos" 
                    fill={colors.primary}
                    name="Ingresos"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="egresos" 
                    fill={colors.error}
                    name="Egresos"
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Simulador de Tarifas */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Calculate sx={{ color: colors.primary, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Simulador de Tarifas
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  ¿Qué pasa si aumento tarifas?
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  color: colors.text,
                  mb: 2,
                }}
              >
                Incremento de tarifas: {tarifaSimulacion}%
              </Typography>
              
              <Slider
                value={tarifaSimulacion}
                onChange={(_, newValue) => setTarifaSimulacion(newValue as number)}
                min={0}
                max={20}
                step={0.5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 5, label: '5%' },
                  { value: 10, label: '10%' },
                  { value: 15, label: '15%' },
                  { value: 20, label: '20%' },
                ]}
                sx={{
                  color: colors.primary,
                  '& .MuiSlider-markLabel': {
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.7rem',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Ingreso actual mensual:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  $55,000
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Nuevo ingreso mensual:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.primary,
                  }}
                >
                  ${impactoTarifa.nuevoIngreso.toLocaleString()}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Incremento mensual:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.success,
                  }}
                >
                  +${impactoTarifa.incrementoMensual.toLocaleString()}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Impacto anual:
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.success,
                  }}
                >
                  +${impactoTarifa.incrementoAnual.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
                fontStyle: 'italic',
              }}
            >
              Considera el impacto en la demanda y competitividad antes de implementar cambios
            </Typography>
          </Paper>
        </Grid>

        {/* Rentabilidad por Terapeuta */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <TrendingUp sx={{ color: colors.primary, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Rentabilidad por Terapeuta
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Rendimiento individual
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ceoMetrics.profitabilityData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number"
                    stroke={colors.textSecondary}
                    fontSize={12}
                    fontFamily='"Inter", sans-serif'
                  />
                  <YAxis 
                    type="category"
                    dataKey="nombre"
                    stroke={colors.textSecondary}
                    fontSize={12}
                    fontFamily='"Inter", sans-serif'
                    width={100}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid #e2e8f0`,
                      borderRadius: 8,
                      fontFamily: '"Inter", sans-serif',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="rentabilidad" 
                    fill={colors.primary}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Backlog Cuentas por Cobrar */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.text,
                mb: 3,
              }}
            >
              Cuentas por Cobrar
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                      Monto
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                      Días
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cuentasPorCobrar.map((cuenta, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                        {cuenta.cliente}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                        ${cuenta.monto.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                        {cuenta.dias}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cuenta.estado}
                          size="small"
                          sx={{
                            backgroundColor: getEstadoColor(cuenta.estado),
                            color: 'white',
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                Total pendiente: ${cuentasPorCobrar.reduce((sum, cuenta) => sum + cuenta.monto, 0).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cumplimiento Legal */}
      <Paper
        sx={{
          p: 4,
          mt: 4,
          backgroundColor: colors.surface,
          border: `1px solid #e2e8f0`,
          borderRadius: 2,
          boxShadow: 'none',
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <CheckCircle sx={{ color: colors.primary, fontSize: 24 }} />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Cumplimiento Legal & Compliance
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
              }}
            >
              Certificados, auditorías y políticas vigentes
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Item de Compliance
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Estado
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Vencimiento
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Criticidad
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complianceItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                    {item.item}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.estado}
                      size="small"
                      sx={{
                        backgroundColor: getEstadoColor(item.estado),
                        color: 'white',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                    {item.vencimiento}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.criticidad}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: getCriticidadColor(item.criticidad),
                        color: getCriticidadColor(item.criticidad),
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Actualizar estado">
                      <IconButton size="small">
                        <Refresh sx={{ fontSize: 18, color: colors.primary }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Compliance Summary */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: `${colors.success}15`, 
              borderRadius: 2,
              flex: 1,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.success,
              }}
            >
              3
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
              }}
            >
              Vigentes
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: `${colors.warning}15`, 
              borderRadius: 2,
              flex: 1,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.warning,
              }}
            >
              1
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
              }}
            >
              Pendientes
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: `${colors.error}15`, 
              borderRadius: 2,
              flex: 1,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.error,
              }}
            >
              0
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
              }}
            >
              Vencidos
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Daily CEO Brief */}
      <Paper
        sx={{
          p: 4,
          mt: 4,
          backgroundColor: colors.surface,
          border: `1px solid #e2e8f0`,
          borderRadius: 2,
          boxShadow: 'none',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Daily CEO Brief
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
              }}
            >
              Resumen ejecutivo diario completo
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: colors.primary,
                opacity: 0.9,
              },
            }}
          >
            Descargar CEO Brief
          </Button>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            color: colors.textSecondary,
            lineHeight: 1.6,
          }}
        >
          Genera un reporte PDF completo con todas las métricas, alertas críticas, insights de IA y recomendaciones estratégicas del día.
          Incluye KPIs financieros, alertas de riesgo, estado de compliance y análisis de tendencias.
        </Typography>
      </Paper>
    </Box>
  );
}