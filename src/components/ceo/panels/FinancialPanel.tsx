'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import BurnEarnChart from '../charts/BurnEarnChart';
import ProfitabilityHeatmap from '../charts/ProfitabilityHeatmap';
import { BurnEarnData, ProfitabilityData } from '@/types/ceo';

interface FinancialPanelProps {
  burnEarnData: BurnEarnData[];
  profitabilityData: ProfitabilityData[];
  loading?: boolean;
}

export default function FinancialPanel({ 
  burnEarnData, 
  profitabilityData, 
  loading = false 
}: FinancialPanelProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>('financial');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion 
      expanded={expanded === 'financial'} 
      onChange={handleChange('financial')}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: theme.shadows[4],
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: '16px 16px 0 0',
          '&.Mui-expanded': {
            minHeight: 64,
          },
          '& .MuiAccordionSummary-content': {
            margin: '16px 0',
            '&.Mui-expanded': {
              margin: '16px 0',
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <TrendingUp sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
              🟦 Panel A: Desempeño Financiero
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Análisis de ingresos, egresos y rentabilidad por terapeuta
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Burn & Earn Chart */}
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Assessment sx={{ color: 'success.main', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                  Gráfico "Burn & Earn"
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Línea verde = ingresos diarios | Línea roja = egresos | Área sombreada = proyección 90 días
              </Typography>
              <BurnEarnChart data={burnEarnData} loading={loading} />
            </Box>
          </Grid>

          {/* Profitability Heatmap */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.warning.main, 0.05),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Assessment sx={{ color: 'warning.main', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                  Mapa de Calor de Rentabilidad
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Verde > 40% | Rojo < 15% | Clic = ficha detallada del terapeuta
              </Typography>
              <ProfitabilityHeatmap data={profitabilityData} loading={loading} />
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
