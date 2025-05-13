'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Stack,
  Slider,
  TextField,
  Button,
  useTheme,
  alpha,
  InputAdornment,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Info as InfoIcon,
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Función para formatear moneda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface ROICalculatorProps {
  open?: boolean;
  onClose?: () => void;
  isDialog?: boolean;
}

const ROICalculator = ({ open = false, onClose, isDialog = false }: ROICalculatorProps) => {
  const theme = useTheme();
  const [numPolicies, setNumPolicies] = useState<number>(10);
  const [avgPremium, setAvgPremium] = useState<number>(1200);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [renewalRate, setRenewalRate] = useState<number>(80);
  const [timeInvestment, setTimeInvestment] = useState<number>(5);
  
  // Cálculos de ROI
  const firstYearRevenue = numPolicies * avgPremium * (commissionRate / 100);
  const secondYearRevenue = firstYearRevenue * (renewalRate / 100) * 0.7; // Asumiendo 70% de comisión en renovaciones
  const thirdYearRevenue = secondYearRevenue * (renewalRate / 100) * 0.7;
  
  const totalThreeYearRevenue = firstYearRevenue + secondYearRevenue + thirdYearRevenue;
  const timeInvestmentValue = timeInvestment * numPolicies * 50; // Valorando el tiempo a 50$/hora
  const roi = (totalThreeYearRevenue / timeInvestmentValue) * 100;
  
  // Función para resetear los valores
  const handleReset = () => {
    setNumPolicies(10);
    setAvgPremium(1200);
    setCommissionRate(15);
    setRenewalRate(80);
    setTimeInvestment(5);
  };
  
  // Animación para el componente
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Contenido principal del calculador
  const calculatorContent = (
    <Stack spacing={4}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight={600}>
              Número de pólizas nuevas
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {numPolicies}
            </Typography>
          </Stack>
          <Slider
            value={numPolicies}
            onChange={(_, value) => setNumPolicies(value as number)}
            min={1}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            sx={{
              color: theme.palette.primary.main,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`
                }
              }
            }}
          />
        </Box>
        
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight={600}>
              Prima media anual ($)
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {formatCurrency(avgPremium)}
            </Typography>
          </Stack>
          <TextField
            value={avgPremium}
            onChange={(e) => setAvgPremium(Number(e.target.value) || 0)}
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              sx: {
                borderRadius: 2
              }
            }}
          />
        </Box>
        
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                Tasa de comisión (%)
              </Typography>
              <Tooltip title="Porcentaje de comisión que recibes por cada póliza vendida">
                <InfoIcon fontSize="small" color="action" sx={{ opacity: 0.6 }} />
              </Tooltip>
            </Stack>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {commissionRate}%
            </Typography>
          </Stack>
          <Slider
            value={commissionRate}
            onChange={(_, value) => setCommissionRate(value as number)}
            min={1}
            max={30}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{
              color: theme.palette.success.main,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.success.main, 0.16)}`
                }
              }
            }}
          />
        </Box>
        
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                Tasa de renovación (%)
              </Typography>
              <Tooltip title="Porcentaje de clientes que renuevan sus pólizas cada año">
                <InfoIcon fontSize="small" color="action" sx={{ opacity: 0.6 }} />
              </Tooltip>
            </Stack>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {renewalRate}%
            </Typography>
          </Stack>
          <Slider
            value={renewalRate}
            onChange={(_, value) => setRenewalRate(value as number)}
            min={10}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            sx={{
              color: theme.palette.info.main,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.info.main, 0.16)}`
                }
              }
            }}
          />
        </Box>
        
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                Tiempo por póliza (horas)
              </Typography>
              <Tooltip title="Tiempo promedio que inviertes en vender cada póliza">
                <InfoIcon fontSize="small" color="action" sx={{ opacity: 0.6 }} />
              </Tooltip>
            </Stack>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {timeInvestment}h
            </Typography>
          </Stack>
          <Slider
            value={timeInvestment}
            onChange={(_, value) => setTimeInvestment(value as number)}
            min={1}
            max={20}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{
              color: theme.palette.warning.main,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.warning.main, 0.16)}`
                }
              }
            }}
          />
        </Box>
      </Stack>
      
      <Divider />
      
      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={600} color="primary">
          Resultados proyectados (3 años)
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <Box 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ingresos Año 1
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatCurrency(firstYearRevenue)}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ingresos Año 2
            </Typography>
            <Typography variant="h6" fontWeight={700} color="info.main">
              {formatCurrency(secondYearRevenue)}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ingresos Año 3
            </Typography>
            <Typography variant="h6" fontWeight={700} color="success.main">
              {formatCurrency(thirdYearRevenue)}
            </Typography>
          </Box>
        </Stack>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <Box 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Inversión de tiempo
            </Typography>
            <Typography variant="h6" fontWeight={700} color="warning.main">
              {formatCurrency(timeInvestmentValue)}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              flex: 2, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.secondary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ingresos totales (3 años)
            </Typography>
            <Typography variant="h6" fontWeight={700} color="secondary.main">
              {formatCurrency(totalThreeYearRevenue)}
            </Typography>
          </Box>
        </Stack>
        
        <Box 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.success.main, 0.1),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                ROI Estimado
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {roi.toFixed(0)}%
              </Typography>
            </Box>
            <TrendingUp sx={{ fontSize: 48, color: theme.palette.success.main, opacity: 0.8 }} />
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );

  // Si es un diálogo, renderizar como diálogo
  if (isDialog) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalculateIcon color="primary" />
              <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
                Calculadora de ROI
              </Typography>
            </Stack>
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {calculatorContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Si no es un diálogo, renderizar como tarjeta
  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      sx={{
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(16px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: 'hidden'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateIcon color="primary" />
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Calculadora de ROI
            </Typography>
          </Box>
        }
        action={
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            size="small"
            sx={{ fontWeight: 600 }}
          >
            Reiniciar
          </Button>
        }
      />
      <CardContent>
        {calculatorContent}
      </CardContent>
    </Card>
  );
};

export default ROICalculator;