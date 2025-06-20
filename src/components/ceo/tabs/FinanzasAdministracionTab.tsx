'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  Button,
  TextField,
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
  AccountBalance,
  TrendingUp,
  Receipt,
  Assessment,
  Download,
  Calculate,
  CheckCircle,
  Warning,
  Error,
  Refresh,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { motion } from 'framer-motion';
import { CEODashboardState } from '@/types/ceo';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface FinanzasAdministracionTabProps {
  ceoMetrics: CEODashboardState;
}

export default function FinanzasAdministracionTab({ ceoMetrics }: FinanzasAdministracionTabProps) {
  const theme = useTheme();
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
      case 'completado': return '#10b981';
      case 'pendiente':
      case 'en_proceso': return '#f59e0b';
      case 'vencido': return '#ef4444';
      default: return ceoBrandColors.text;
    }
  };

  const getCriticidadColor = (criticidad: string) => {
    switch (criticidad) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return ceoBrandColors.text;
    }
  };

  const calcularImpactoTarifa = () => {
    const ingresoActual = 55000; // Ingreso base mensual
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${ceoBrandColors.accentPink} 0%, ${ceoBrandColors.secondary} 100%)`,
            color: 'white',
            borderRadius: 4,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600, // Semibold
              mb: 1,
            }}
          >
            💰 Finanzas & Administración
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 300, // Light
              opacity: 0.9,
            }}
          >
            Métricas financieras, compliance y herramientas de simulación
          </Typography>
        </Paper>
      </motion.div>

      <Grid container spacing={4}>
        {/* Gráfico Comparativo Ingresos vs Egresos */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUp sx={{ color: ceoBrandColors.primary, fontSize: 32 }} />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600, // Semibold
                        color: ceoBrandColors.text,
                      }}
                    >
                      📊 Ingresos vs Egresos (6 meses)
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300, // Light
                        color: alpha(ceoBrandColors.text, 0.6),
                      }}
                    >
                      Análisis comparativo de flujo de caja mensual
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{
                    borderColor: ceoBrandColors.primary,
                    color: ceoBrandColors.primary,
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Exportar
                </Button>
              </Box>

              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={financialComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(ceoBrandColors.text, 0.1)} />
                    <XAxis 
                      dataKey="mes" 
                      stroke={alpha(ceoBrandColors.text, 0.6)}
                      fontSize={12}
                      fontFamily='"Neris", sans-serif'
                    />
                    <YAxis 
                      stroke={alpha(ceoBrandColors.text, 0.6)}
                      fontSize={12}
                      fontFamily='"Neris", sans-serif'
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                        borderRadius: 8,
                        fontFamily: '"Neris", sans-serif',
                      }}
                    />
                    <Bar 
                      dataKey="ingresos" 
                      fill={ceoBrandColors.primary}
                      name="Ingresos"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="egresos" 
                      fill={ceoBrandColors.accentPink}
                      name="Egresos"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke={ceoBrandColors.accentBlue}
                      strokeWidth={3}
                      dot={{ fill: ceoBrandColors.accentBlue, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Simulador de Tarifas */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              sx={{
                p: 4,
                background: `linear-gradient(135deg, ${alpha(ceoBrandColors.accentBlue, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Calculate sx={{ color: ceoBrandColors.accentBlue, fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    🧮 Simulador de Tarifas
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
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
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600, // Semibold
                    color: ceoBrandColors.text,
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
                    color: ceoBrandColors.accentBlue,
                    '& .MuiSlider-markLabel': {
                      fontFamily: '"Neris", sans-serif',
                      fontSize: '0.7rem',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Ingreso actual mensual:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    $55,000
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Nuevo ingreso mensual:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.accentBlue,
                    }}
                  >
                    ${impactoTarifa.nuevoIngreso.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Incremento mensual:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: '#10b981',
                    }}
                  >
                    +${impactoTarifa.incrementoMensual.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="between" alignItems="center">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Impacto anual:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: '#10b981',
                    }}
                  >
                    +${impactoTarifa.incrementoAnual.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300, // Light
                  color: alpha(ceoBrandColors.text, 0.6),
                  fontStyle: 'italic',
                }}
              >
                💡 Considera el impacto en la demanda y competitividad antes de implementar cambios
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Rentabilidad por Terapeuta */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Assessment sx={{ color: ceoBrandColors.secondary, fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    👥 Rentabilidad por Terapeuta
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Mapa de calor de rendimiento individual
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ceoMetrics.profitabilityData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(ceoBrandColors.text, 0.1)} />
                    <XAxis 
                      type="number"
                      stroke={alpha(ceoBrandColors.text, 0.6)}
                      fontSize={12}
                      fontFamily='"Neris", sans-serif'
                    />
                    <YAxis 
                      type="category"
                      dataKey="nombre"
                      stroke={alpha(ceoBrandColors.text, 0.6)}
                      fontSize={12}
                      fontFamily='"Neris", sans-serif'
                      width={100}
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
                        borderRadius: 8,
                        fontFamily: '"Neris", sans-serif',
                      }}
                    />
                    <Bar 
                      dataKey="rentabilidad" 
                      fill={ceoBrandColors.secondary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Backlog Cuentas por Cobrar */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha('#f59e0b', 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Receipt sx={{ color: '#f59e0b', fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    📋 Backlog Cuentas por Cobrar
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Seguimiento de pagos pendientes
                  </Typography>
                </Box>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Cliente
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Monto
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Días
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Estado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cuentasPorCobrar.map((cuenta, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                          {cuenta.cliente}
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                          ${cuenta.monto.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                          {cuenta.dias}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={cuenta.estado}
                            size="small"
                            sx={{
                              background: getEstadoColor(cuenta.estado),
                              color: 'white',
                              fontFamily: '"Neris", sans-serif',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, p: 2, background: alpha('#f59e0b', 0.1), borderRadius: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600, // Semibold
                    color: ceoBrandColors.text,
                  }}
                >
                  Total pendiente: ${cuentasPorCobrar.reduce((sum, cuenta) => sum + cuenta.monto, 0).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Cumplimiento Legal y Daily CEO Brief */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Cumplimiento Legal */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <CheckCircle sx={{ color: ceoBrandColors.primary, fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    ⚖️ Cumplimiento Legal & Compliance
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                      >
                    Certificados, MSP, auditorías y políticas vigentes
                  </Typography>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Item de Compliance
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Estado
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Vencimiento
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Criticidad
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complianceItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                          {item.item}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            size="small"
                            sx={{
                              background: getEstadoColor(item.estado),
                              color: 'white',
                              fontFamily: '"Neris", sans-serif',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
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
                              fontFamily: '"Neris", sans-serif',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Actualizar estado">
                            <IconButton size="small">
                              <Refresh sx={{ fontSize: 18, color: ceoBrandColors.primary }} />
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
                    background: alpha('#10b981', 0.1), 
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: '#10b981',
                    }}
                  >
                    3
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Vigentes
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    p: 2, 
                    background: alpha('#f59e0b', 0.1), 
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: '#f59e0b',
                    }}
                  >
                    1
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Pendientes
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    p: 2, 
                    background: alpha('#ef4444', 0.1), 
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: '#ef4444',
                    }}
                  >
                    0
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.7),
                    }}
                  >
                    Vencidos
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Daily CEO Brief */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Paper
              sx={{
                p: 4,
                background: `linear-gradient(135deg, ${alpha(ceoBrandColors.primary, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Download sx={{ color: ceoBrandColors.primary, fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    📄 Daily CEO Brief
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Resumen ejecutivo diario
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 300, // Light
                    color: alpha(ceoBrandColors.text, 0.8),
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  Genera un reporte PDF completo con todas las métricas, alertas críticas, insights de IA y recomendaciones estratégicas del día.
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    Incluye:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Typography 
                      component="li" 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300, // Light
                        color: alpha(ceoBrandColors.text, 0.7),
                        mb: 0.5,
                      }}
                    >
                      KPIs y métricas financieras
                    </Typography>
                    <Typography 
                      component="li" 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300, // Light
                        color: alpha(ceoBrandColors.text, 0.7),
                        mb: 0.5,
                      }}
                    >
                      Alertas críticas y riesgos
                    </Typography>
                    <Typography 
                      component="li" 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300, // Light
                        color: alpha(ceoBrandColors.text, 0.7),
                        mb: 0.5,
                      }}
                    >
                      Insights de IA y recomendaciones
                    </Typography>
                    <Typography 
                      component="li" 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300, // Light
                        color: alpha(ceoBrandColors.text, 0.7),
                      }}
                    >
                      Estado de compliance
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Download />}
                sx={{
                  background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                  color: 'white',
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600, // Semibold
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ceoBrandColors.secondary} 0%, ${ceoBrandColors.primary} 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(ceoBrandColors.primary, 0.3)}`,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Descargar CEO Brief
              </Button>

              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300, // Light
                  color: alpha(ceoBrandColors.text, 0.6),
                  display: 'block',
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                Último reporte: Hoy 08:00 AM
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Widget de Evolución */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Paper
          sx={{
            p: 4,
            mt: 4,
            background: `linear-gradient(135deg, ${alpha(ceoBrandColors.secondary, 0.1)} 0%, ${alpha(ceoBrandColors.accentBlue, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TrendingUp sx={{ color: ceoBrandColors.secondary, fontSize: 32 }} />
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600, // Semibold
                  color: ceoBrandColors.text,
                }}
              >
                📈 Insight de Evolución Financiera
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300, // Light
                  color: alpha(ceoBrandColors.text, 0.6),
                }}
              >
                Widget inteligente con análisis de tendencias
              </Typography>
            </Box>
          </Box>

          <Box 
            sx={{ 
              p: 3, 
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 3,
              border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600, // Semibold
                color: ceoBrandColors.text,
                mb: 1,
              }}
            >
              🎉 Este mes se mejoró un 12% la rentabilidad frente al anterior
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 300, // Light
                color: alpha(ceoBrandColors.text, 0.8),
                lineHeight: 1.6,
              }}
            >
              El incremento se debe principalmente a la optimización de horarios (reducción 8% en cancelaciones) 
              y el aumento en la adherencia de terapias grupales (+15%). La implementación de recordatorios 
              automáticos ha sido clave en este resultado.
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
