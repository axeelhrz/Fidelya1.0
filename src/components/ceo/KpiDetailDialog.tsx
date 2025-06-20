'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  CompareArrows,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CEOKPIData } from '@/types/ceo';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface KpiDetailDialogProps {
  open: boolean;
  onClose: () => void;
  kpi: CEOKPIData | null;
}

export default function KpiDetailDialog({ open, onClose, kpi }: KpiDetailDialogProps) {
  const theme = useTheme();

  if (!kpi) return null;

  // Generate historical data for the last 12 months
  const generateHistoricalData = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const baseValue = kpi.value;
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const value = Math.round(baseValue * (1 + variation));
      
      data.push({
        month: format(date, 'MMM yyyy', { locale: es }),
        value,
        target: kpi.target || baseValue * 1.1,
        variance: value - (kpi.target || baseValue * 1.1)
      });
    }
    return data;
  };

  const historicalData = generateHistoricalData();

  // Generate comparative data (YoY)
  const generateComparativeData = () => {
    return [
      { period: 'Año Anterior', value: kpi.value * 0.85, color: theme.palette.text.secondary },
      { period: 'Año Actual', value: kpi.value, color: kpi.trend.isPositive ? theme.palette.success.main : theme.palette.error.main },
      { period: 'Proyección', value: kpi.value * 1.15, color: theme.palette.info.main },
    ];
  };

  const comparativeData = generateComparativeData();

  const getSemaphoreColor = () => {
    switch (kpi.semaphore) {
      case 'green': return theme.palette.success.main;
      case 'amber': return theme.palette.warning.main;
      case 'red': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$') return `$${value.toLocaleString()}`;
    if (unit === '%') return `${value}%`;
    if (unit === 'x') return `${value}x`;
    return value.toLocaleString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getSemaphoreColor(),
                boxShadow: `0 0 8px ${alpha(getSemaphoreColor(), 0.5)}`,
              }}
            />
            <Typography variant="h5" fontWeight="bold" fontFamily='"Neris", sans-serif'>
              {kpi.title} - Análisis Detallado
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary">
                  Valor Actual
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {formatValue(kpi.value, kpi.unit)}
                </Typography>
                {kpi.target && (
                  <Typography variant="caption" color="text.secondary">
                    Meta: {formatValue(kpi.target, kpi.unit)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary">
                  Tendencia
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  {kpi.trend.value > 0 ? (
                    <TrendingUp sx={{ color: 'success.main' }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main' }} />
                  )}
                  <Typography 
                    variant="h5" 
                    fontWeight="bold"
                    color={kpi.trend.isPositive ? 'success.main' : 'error.main'}
                  >
                    {kpi.trend.value > 0 ? '+' : ''}{kpi.trend.value.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {kpi.trend.period}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary">
                  Estado
                </Typography>
                <Box display="flex" justifyContent="center" mb={1}>
                  <Chip
                    label={kpi.semaphore.toUpperCase()}
                    sx={{
                      backgroundColor: alpha(getSemaphoreColor(), 0.1),
                      color: getSemaphoreColor(),
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Semáforo de control
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary">
                  Progreso vs Meta
                </Typography>
                {kpi.target && (
                  <>
                    <Typography variant="h5" fontWeight="bold">
                      {Math.round((kpi.value / kpi.target) * 100)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (kpi.value / kpi.target) * 100)}
                      sx={{
                        mt: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.primary.main,
                          borderRadius: 4
                        }
                      }}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Historical Trend */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Timeline sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Tendencia Histórica (12 meses)
                  </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.2)} />
                      <XAxis 
                        dataKey="month" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        dot={{ fill: theme.palette.primary.main, r: 4 }}
                        name="Valor Real"
                      />
                      {kpi.target && (
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          stroke={theme.palette.warning.main}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Meta"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Comparative Analysis */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CompareArrows sx={{ color: 'secondary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Análisis Comparativo
                  </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparativeData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.2)} />
                      <XAxis type="number" stroke={theme.palette.text.secondary} fontSize={12} />
                      <YAxis 
                        type="category" 
                        dataKey="period" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        width={80}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill={theme.palette.secondary.main}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Table */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Assessment sx={{ color: 'info.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Desglose Mensual Detallado
              </Typography>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Mes</strong></TableCell>
                    <TableCell align="right"><strong>Valor Real</strong></TableCell>
                    <TableCell align="right"><strong>Meta</strong></TableCell>
                    <TableCell align="right"><strong>Varianza</strong></TableCell>
                    <TableCell align="center"><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historicalData.slice(-6).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell align="right">
                        {formatValue(row.value, kpi.unit)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(row.target, kpi.unit)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={row.variance >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="medium"
                        >
                          {row.variance >= 0 ? '+' : ''}{formatValue(row.variance, kpi.unit)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={row.variance >= 0 ? 'Cumplido' : 'Pendiente'}
                          color={row.variance >= 0 ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button variant="contained" startIcon={<Assessment />}>
          Exportar Reporte
        </Button>
      </DialogActions>
    </Dialog>
  );
}
