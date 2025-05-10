'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  alpha,
  useTheme,
  Paper,
  Stack,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Close as CloseIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  CalendarMonth as CalendarMonthIcon,
  AttachMoney as AttachMoneyIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Policy } from '@/types/policy';
import { formatCurrency } from '@/lib/formatters';
import { format, differenceInMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface PolicyAnalyticsDialogProps {
  open: boolean;
  onClose: () => void;
  policies: Policy[];
}

const PolicyAnalyticsDialog: React.FC<PolicyAnalyticsDialogProps> = ({
  open,
  onClose,
  policies
}) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [timeRange, setTimeRange] = useState('year');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Calcular estadísticas
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const expiredPolicies = policies.filter(p => p.status === 'expired').length;
  const pendingPolicies = policies.filter(p => p.status === 'pending').length;
  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0);
  const averagePremium = totalPolicies > 0 ? totalPremium / totalPolicies : 0;

  // Calcular distribución por tipo
  const policyTypeDistribution = policies.reduce((acc: Record<string, number>, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {});

  // Calcular distribución por compañía
  const policyCompanyDistribution = policies.reduce((acc: Record<string, number>, policy) => {
    acc[policy.company] = (acc[policy.company] || 0) + 1;
    return acc;
  }, {});

  // Calcular distribución por estado
  const policyStatusDistribution = {
    active: activePolicies,
    expired: expiredPolicies,
    pending: pendingPolicies,
    review: policies.filter(p => p.status === 'review').length,
    cancelled: policies.filter(p => p.status === 'cancelled').length,
  };

  // Calcular tendencia mensual (últimos 12 meses)
  const getMonthlyTrend = () => {
    const now = new Date();
    const monthsData: Record<string, { count: number, premium: number }> = {};
    
    // Inicializar los últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = format(date, 'yyyy-MM');
      monthsData[monthKey] = { count: 0, premium: 0 };
    }
    
    // Agrupar pólizas por mes de inicio
    policies.forEach(policy => {
      const startDate = policy.startDate.toDate();
      const monthDiff = differenceInMonths(now, startDate);
      if (monthDiff < 12) {
        const monthKey = format(startDate, 'yyyy-MM');
        if (monthsData[monthKey]) {
          monthsData[monthKey].count += 1;
          monthsData[monthKey].premium += policy.premium;
        }
      }
    });
    
    // Convertir a array para gráfico
    return Object.entries(monthsData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: format(new Date(month + '-01'), 'MMM yyyy', { locale: es }),
        count: data.count,
        premium: data.premium
      }));
  };

  const monthlyTrend = getMonthlyTrend();

  // Calcular vencimientos próximos
  const getUpcomingExpirations = () => {
    const now = new Date();
    const next3Months: Record<string, number> = {};
    
    // Inicializar los próximos 3 meses
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = format(date, 'yyyy-MM');
      next3Months[monthKey] = 0;
    }
    
    // Contar pólizas que vencen en los próximos 3 meses
    policies.forEach(policy => {
      if (policy.status === 'active') {
        const endDate = policy.endDate.toDate();
        const monthKey = format(endDate, 'yyyy-MM');
        if (next3Months[monthKey] !== undefined) {
          next3Months[monthKey] += 1;
        }
      }
    });
    
    // Convertir a array para gráfico
    return Object.entries(next3Months).map(([month, count]) => ({
      month: format(new Date(month + '-01'), 'MMMM yyyy', { locale: es }),
      count
    }));
  };

  const upcomingExpirations = getUpcomingExpirations();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '16px',
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <BarChartIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" component="span" fontFamily="Sora, sans-serif" fontWeight={700}>
            Análisis de Pólizas
          </Typography>
        </Stack>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="analytics tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTabs-scrollButtons': {
                color: theme.palette.text.secondary,
              }
            }}
          >
            <Tab
              label="Resumen"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              label="Distribución"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              label="Tendencias"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              label="Vencimientos"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Tabs>
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: '999px',
                fontFamily: 'Inter, sans-serif',
              }
            }}
          >
            <InputLabel id="time-range-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Periodo</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Periodo"
            >
              <MenuItem value="month" sx={{ fontFamily: 'Inter, sans-serif' }}>Último mes</MenuItem>
              <MenuItem value="quarter" sx={{ fontFamily: 'Inter, sans-serif' }}>Último trimestre</MenuItem>
              <MenuItem value="year" sx={{ fontFamily: 'Inter, sans-serif' }}>Último año</MenuItem>
              <MenuItem value="all" sx={{ fontFamily: 'Inter, sans-serif' }}>Todo el tiempo</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <DialogContent sx={{ p: 3 }}>
        <AnimatePresence mode="wait">
          {currentTab === 0 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Stack spacing={3}>
                {/* KPIs */}
                <Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          background: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.4)
                            : alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          height: '100%',
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                          >
                            Total de Pólizas
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            fontFamily="Sora, sans-serif"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            {totalPolicies}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.success.main,
                              }}
                            />
                            <Typography
                              variant="caption"
                              fontFamily="Inter, sans-serif"
                            >
                              {activePolicies} activas ({Math.round((activePolicies / totalPolicies) * 100) || 0}%)
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          background: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.4)
                            : alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          height: '100%',
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                          >
                            Prima Total
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            fontFamily="Sora, sans-serif"
                            sx={{ color: theme.palette.success.main }}
                          >
                            {formatCurrency(totalPremium)}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontFamily="Inter, sans-serif"
                          >
                            Prima promedio: {formatCurrency(averagePremium)}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          background: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.4)
                            : alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          height: '100%',
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                          >
                            Pólizas Vencidas
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            fontFamily="Sora, sans-serif"
                            sx={{ color: theme.palette.error.main }}
                          >
                            {expiredPolicies}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontFamily="Inter, sans-serif"
                          >
                            {Math.round((expiredPolicies / totalPolicies) * 100) || 0}% del total
                          </Typography>
                        </Stack>
                      </Paper>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          background: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.4)
                            : alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          height: '100%',
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                          >
                            Pólizas Pendientes
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            fontFamily="Sora, sans-serif"
                            sx={{ color: theme.palette.warning.main }}
                          >
                            {pendingPolicies}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontFamily="Inter, sans-serif"
                          >
                            {Math.round((pendingPolicies / totalPolicies) * 100) || 0}% del total
                          </Typography>
                        </Stack>
                      </Paper>
                    </Box>
                  </Stack>
                </Box>
                
                {/* Distribución por tipo y estado */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            fontFamily="Sora, sans-serif"
                          >
                            Distribución por Tipo
                          </Typography>
                          <PieChartIcon sx={{ color: theme.palette.primary.main }} />
                        </Stack>
                        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            [Gráfico de distribución por tipo]
                          </Typography>
                        </Box>
                        <Box>
                          {Object.entries(policyTypeDistribution).map(([type, count]) => (
                            <Stack
                              key={type}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mb: 1 }}
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '3px',
                                    backgroundColor: theme.palette.primary.main,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  fontFamily="Inter, sans-serif"
                                >
                                  {type}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                fontFamily="Inter, sans-serif"
                              >
                                {count} ({Math.round((count / totalPolicies) * 100)}%)
                              </Typography>
                            </Stack>
                          ))}
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            fontFamily="Sora, sans-serif"
                          >
                            Distribución por Estado
                          </Typography>
                          <PieChartIcon sx={{ color: theme.palette.primary.main }} />
                        </Stack>
                        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            [Gráfico de distribución por estado]
                          </Typography>
                        </Box>
                        <Box>
                          {Object.entries(policyStatusDistribution).map(([status, count]) => {
                            if (count === 0) return null;
                            const getStatusColor = (status: string) => {
                              switch (status) {
                                case 'active': return theme.palette.success.main;
                                case 'expired': return theme.palette.error.main;
                                case 'pending': return theme.palette.warning.main;
                                case 'review': return theme.palette.info.main;
                                case 'cancelled': return theme.palette.grey[500];
                                default: return theme.palette.grey[500];
                              }
                            };
                            const getStatusLabel = (status: string) => {
                              switch (status) {
                                case 'active': return 'Activas';
                                case 'expired': return 'Vencidas';
                                case 'pending': return 'Pendientes';
                                case 'review': return 'En revisión';
                                case 'cancelled': return 'Canceladas';
                                default: return status;
                              }
                            };
                            return (
                              <Stack
                                key={status}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 1 }}
                              >
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '3px',
                                      backgroundColor: getStatusColor(status),
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    fontFamily="Inter, sans-serif"
                                  >
                                    {getStatusLabel(status)}
                                  </Typography>
                                </Stack>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  fontFamily="Inter, sans-serif"
                                >
                                  {count} ({Math.round((count / totalPolicies) * 100)}%)
                                </Typography>
                              </Stack>
                            );
                          })}
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
                
                {/* Tendencia mensual */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="Sora, sans-serif"
                        >
                          Tendencia Mensual
                        </Typography>
                        <ShowChartIcon sx={{ color: theme.palette.primary.main }} />
                      </Stack>
                      <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                          align="center"
                        >
                          [Gráfico de tendencia mensual]
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                        >
                          Muestra la cantidad de pólizas nuevas y la prima total por mes durante el último año.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </motion.div>
          )}
          
          {currentTab === 1 && (
            <motion.div
              key="distribution"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Stack spacing={3}>
                {/* Distribución por tipo y compañía */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="Sora, sans-serif"
                        >
                          Distribución por Tipo de Póliza
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            [Gráfico de distribución por tipo]
                          </Typography>
                        </Box>
                        <Box>
                          {Object.entries(policyTypeDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => (
                              <Box key={type} sx={{ mb: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    fontFamily="Sora, sans-serif"
                                  >
                                    {type}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontFamily="Inter, sans-serif"
                                  >
                                    {count} ({Math.round((count / totalPolicies) * 100)}%)
                                  </Typography>
                                </Stack>
                                <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                                  <Box
                                    sx={{
                                      height: '100%',
                                      width: `${(count / totalPolicies) * 100}%`,
                                      bgcolor: theme.palette.primary.main,
                                      borderRadius: 1
                                    }}
                                  />
                                </Box>
                              </Box>
                            ))}
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="Sora, sans-serif"
                        >
                          Distribución por Compañía
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            [Gráfico de distribución por compañía]
                          </Typography>
                        </Box>
                        <Box>
                          {Object.entries(policyCompanyDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([company, count]) => (
                              <Box key={company} sx={{ mb: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    fontFamily="Sora, sans-serif"
                                  >
                                    {company}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontFamily="Inter, sans-serif"
                                  >
                                    {count} ({Math.round((count / totalPolicies) * 100)}%)
                                  </Typography>
                                </Stack>
                                <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: 1 }}>
                                  <Box
                                    sx={{
                                      height: '100%',
                                      width: `${(count / totalPolicies) * 100}%`,
                                      bgcolor: theme.palette.secondary.main,
                                      borderRadius: 1
                                    }}
                                  />
                                </Box>
                              </Box>
                            ))}
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
                
                {/* Distribución por prima */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontFamily="Sora, sans-serif"
                      >
                        Distribución por Rango de Prima
                      </Typography>
                      <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                          align="center"
                        >
                          [Gráfico de distribución por rango de prima]
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                        >
                          Muestra la distribución de pólizas por rangos de prima anual.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </motion.div>
          )}
          
          {currentTab === 2 && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Stack spacing={3}>
                {/* Tendencia mensual */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontFamily="Sora, sans-serif"
                      >
                        Tendencia de Nuevas Pólizas
                      </Typography>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                          align="center"
                        >
                          [Gráfico de tendencia mensual]
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                        >
                          Muestra la cantidad de pólizas nuevas por mes durante el último año.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
                
                {/* Tendencia de prima */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontFamily="Sora, sans-serif"
                      >
                        Tendencia de Prima Total
                      </Typography>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                          align="center"
                        >
                          [Gráfico de tendencia de prima]
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                        >
                          Muestra la prima total de pólizas nuevas por mes durante el último año.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
                
                {/* Tabla de datos mensuales */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontFamily="Sora, sans-serif"
                      >
                        Datos Mensuales
                      </Typography>
                      <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{
                                textAlign: 'left',
                                padding: '8px',
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                fontFamily: 'Sora, sans-serif',
                                fontWeight: 600,
                              }}>
                                Mes
                              </th>
                              <th style={{
                                textAlign: 'right',
                                padding: '8px',
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                fontFamily: 'Sora, sans-serif',
                                fontWeight: 600,
                              }}>
                                Pólizas
                              </th>
                              <th style={{
                                textAlign: 'right',
                                padding: '8px',
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                fontFamily: 'Sora, sans-serif',
                                fontWeight: 600,
                              }}>
                                Prima Total
                              </th>
                              <th style={{
                                textAlign: 'right',
                                padding: '8px',
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                fontFamily: 'Sora, sans-serif',
                                fontWeight: 600,
                              }}>
                                Prima Promedio
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthlyTrend.map((month) => (
                              <tr key={month.month}>
                                <td style={{
                                  padding: '8px',
                                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                  fontFamily: 'Inter, sans-serif',
                                }}>
                                  {month.month}
                                </td>
                                <td style={{
                                  textAlign: 'right',
                                  padding: '8px',
                                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                  fontFamily: 'Inter, sans-serif',
                                }}>
                                  {month.count}
                                </td>
                                <td style={{
                                  textAlign: 'right',
                                  padding: '8px',
                                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                  fontFamily: 'Inter, sans-serif',
                                  color: theme.palette.success.main,
                                  fontWeight: 600,
                                }}>
                                  {formatCurrency(month.premium)}
                                </td>
                                <td style={{
                                  textAlign: 'right',
                                  padding: '8px',
                                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                  fontFamily: 'Inter, sans-serif',
                                }}>
                                  {month.count > 0 ? formatCurrency(month.premium / month.count) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </motion.div>
          )}
          
          {currentTab === 3 && (
            <motion.div
              key="expirations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Stack spacing={3}>
                {/* Vencimientos próximos */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="Sora, sans-serif"
                        >
                          Vencimientos Próximos
                        </Typography>
                        <CalendarMonthIcon sx={{ color: theme.palette.primary.main }} />
                      </Stack>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="Inter, sans-serif"
                          align="center"
                        >
                          [Gráfico de vencimientos próximos]
                        </Typography>
                      </Box>
                      <Box>
                        {upcomingExpirations.map((item) => (
                          <Box key={item.month} sx={{ mb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                fontFamily="Sora, sans-serif"
                              >
                                {item.month}
                              </Typography>
                              <Typography
                                variant="body2"
                                fontFamily="Inter, sans-serif"
                              >
                                {item.count} pólizas
                              </Typography>
                            </Stack>
                            <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${(item.count / Math.max(...upcomingExpirations.map(i => i.count), 1)) * 100}%`,
                                  bgcolor: theme.palette.warning.main,
                                  borderRadius: 1
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
                
                {/* Distribución por mes de vencimiento y Prima por vencer */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="Sora, sans-serif"
                        >
                          Distribución Anual de Vencimientos
                        </Typography>
                        <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            [Gráfico de distribución anual]
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                          >
                            Muestra la distribución de vencimientos a lo largo del año.
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            fontFamily="Sora, sans-serif"
                          >
                            Prima por Vencer
                          </Typography>
                          <AttachMoneyIcon sx={{ color: theme.palette.success.main }} />
                        </Stack>
                        <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            [Gráfico de prima por vencer]
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                          >
                            Muestra el valor total de prima de pólizas que vencen en los próximos meses.
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
      <Divider sx={{ opacity: 0.6 }} />
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            borderRadius: '999px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Cerrar
        </Button>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          sx={{
            borderRadius: '999px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }
          }}
        >
          Exportar Informe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyAnalyticsDialog;