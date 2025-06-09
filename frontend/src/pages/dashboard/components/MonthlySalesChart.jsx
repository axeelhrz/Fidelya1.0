import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart as BarChartIcon, TrendingUp } from '@mui/icons-material';

const MonthlySalesChart = ({ data, loading }) => {
  const theme = useTheme();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Ventas: {formatCurrency(payload[0].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Colores del gradiente para las barras
  const barColors = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.secondary.main,
    theme.palette.secondary.light,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{ height: '100%' }}
    >
      <Card 
        sx={{ 
          height: '100%',
                  display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.8)} 0%, 
            ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                display: 'flex',
                alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <BarChartIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  Ventas Mensuales
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                  Evolución de ingresos
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
              }}
                >
              <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.success.main,
                  fontWeight: 600
                    }}
                  >
                Crecimiento
              </Typography>
            </Box>
          </Box>
          {/* Chart Content */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 4, height: '100%' }}>
                <Skeleton variant="rectangular" height="70%" sx={{ borderRadius: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={20} sx={{ flex: 1, borderRadius: 1 }} />
                  ))}
                </Box>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barCategoryGap="20%"
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={1} />
                      <stop offset="100%" stopColor={theme.palette.primary.light} stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={alpha(theme.palette.text.secondary, 0.2)}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ 
                      fontSize: 12, 
                      fill: theme.palette.text.secondary,
                      fontWeight: 500
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ 
                      fontSize: 12, 
                      fill: theme.palette.text.secondary,
                      fontWeight: 500
                    }}
                    tickFormatter={formatCurrency}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                  >
                    {data?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={barColors[index % barColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlySalesChart;