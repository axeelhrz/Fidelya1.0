'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  Button,
  Divider,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Calculate,
  Psychology,
} from '@mui/icons-material';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

export default function FinancialSimulator() {
  const theme = useTheme();
  const [tarifaIncrement, setTarifaIncrement] = useState(0);
  const [pacientesIncrement, setPacientesIncrement] = useState(0);
  const [costosReduction, setCostosReduction] = useState(0);

  // Base values (simulated current state)
  const baseValues = {
    tarifaPromedio: 80,
    pacientesActivos: 150,
    costosOperativos: 25000,
    ingresosMensuales: 12000,
  };

  // Calculate projections
  const calculateProjections = () => {
    const newTarifa = baseValues.tarifaPromedio * (1 + tarifaIncrement / 100);
    const newPacientes = baseValues.pacientesActivos * (1 + pacientesIncrement / 100);
    const newCostos = baseValues.costosOperativos * (1 - costosReduction / 100);
    
    const newIngresos = (newTarifa * newPacientes * 4) / 4; // Assuming 4 sessions per month average
    const newEbitda = newIngresos - newCostos;
    const currentEbitda = baseValues.ingresosMensuales - baseValues.costosOperativos;
    
    return {
      ingresosMensuales: newIngresos,
      ebitda: newEbitda,
      incrementoIngresos: ((newIngresos - baseValues.ingresosMensuales) / baseValues.ingresosMensuales) * 100,
      incrementoEbitda: ((newEbitda - currentEbitda) / Math.abs(currentEbitda)) * 100,
    };
  };

  const projections = calculateProjections();

  const handleReset = () => {
    setTarifaIncrement(0);
    setPacientesIncrement(0);
    setCostosReduction(0);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Calculate sx={{ color: ceoBrandColors.primary, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
            }}
          >
            Simulador Financiero
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            color: alpha(ceoBrandColors.text, 0.7),
          }}
        >
          ¿Qué pasa si cambio las variables clave?
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ p: 3 }}>
        {/* Tarifa Adjustment */}
        <Box mb={3}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 1,
            }}
          >
            Incremento de Tarifas: {tarifaIncrement}%
          </Typography>
          <Slider
            value={tarifaIncrement}
            onChange={(_, value) => setTarifaIncrement(value as number)}
            min={-20}
            max={30}
            step={1}
            marks={[
              { value: -20, label: '-20%' },
              { value: 0, label: '0%' },
              { value: 30, label: '+30%' },
            ]}
            sx={{
              color: ceoBrandColors.primary,
              '& .MuiSlider-markLabel': {
                fontFamily: '"Neris", sans-serif',
                fontSize: '0.75rem',
              },
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              color: alpha(ceoBrandColors.text, 0.6),
            }}
          >
            Nueva tarifa: ${(baseValues.tarifaPromedio * (1 + tarifaIncrement / 100)).toFixed(0)}
          </Typography>
        </Box>

        {/* Patients Adjustment */}
        <Box mb={3}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 1,
            }}
          >
            Incremento de Pacientes: {pacientesIncrement}%
          </Typography>
          <Slider
            value={pacientesIncrement}
            onChange={(_, value) => setPacientesIncrement(value as number)}
            min={-30}
            max={50}
            step={1}
            marks={[
              { value: -30, label: '-30%' },
              { value: 0, label: '0%' },
              { value: 50, label: '+50%' },
            ]}
            sx={{
              color: ceoBrandColors.accentBlue,
              '& .MuiSlider-markLabel': {
                fontFamily: '"Neris", sans-serif',
                fontSize: '0.75rem',
              },
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              color: alpha(ceoBrandColors.text, 0.6),
            }}
          >
            Nuevos pacientes: {Math.round(baseValues.pacientesActivos * (1 + pacientesIncrement / 100))}
          </Typography>
        </Box>

        {/* Costs Reduction */}
        <Box mb={3}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 1,
            }}
          >
            Reducción de Costos: {costosReduction}%
          </Typography>
          <Slider
            value={costosReduction}
            onChange={(_, value) => setCostosReduction(value as number)}
            min={0}
            max={25}
            step={1}
            marks={[
              { value: 0, label: '0%' },
              { value: 25, label: '-25%' },
            ]}
            sx={{
              color: ceoBrandColors.accentPink,
              '& .MuiSlider-markLabel': {
                fontFamily: '"Neris", sans-serif',
                fontSize: '0.75rem',
              },
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              color: alpha(ceoBrandColors.text, 0.6),
            }}
          >
            Nuevos costos: ${(baseValues.costosOperativos * (1 - costosReduction / 100)).toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Results */}
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 2,
            }}
          >
            Proyección de Resultados
          </Typography>

          <Box display="flex" flex-direction="column" gap={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: alpha(ceoBrandColors.primary, 0.1),
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  color: ceoBrandColors.primary,
                  fontWeight: 600,
                }}
              >
                Ingresos Mensuales
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 700,
                  color: ceoBrandColors.primary,
                }}
              >
                ${projections.ingresosMensuales.toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp sx={{ fontSize: 16, color: projections.incrementoIngresos >= 0 ? '#4CAF50' : '#F44336' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: projections.incrementoIngresos >= 0 ? '#4CAF50' : '#F44336',
                    fontWeight: 600,
                  }}
                >
                  {projections.incrementoIngresos >= 0 ? '+' : ''}{projections.incrementoIngresos.toFixed(1)}%
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: alpha(ceoBrandColors.accentPink, 0.1),
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  color: ceoBrandColors.accentPink,
                  fontWeight: 600,
                }}
              >
                EBITDA Mensual
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 700,
                  color: ceoBrandColors.accentPink,
                }}
              >
                ${projections.ebitda.toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp sx={{ fontSize: 16, color: projections.incrementoEbitda >= 0 ? '#4CAF50' : '#F44336' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: projections.incrementoEbitda >= 0 ? '#4CAF50' : '#F44336',
                    fontWeight: 600,
                  }}
                >
                  {projections.incrementoEbitda >= 0 ? '+' : ''}{projections.incrementoEbitda.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* AI Suggestion */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: alpha(ceoBrandColors.secondary, 0.1),
              border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Psychology sx={{ fontSize: 16, color: ceoBrandColors.secondary }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.secondary,
                }}
              >
                Sugerencia IA
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                color: ceoBrandColors.text,
                fontSize: '0.8rem',
              }}
            >
              {tarifaIncrement > 15 
                ? "Incremento de tarifas alto. Considera implementar gradualmente para minimizar cancelaciones."
                : pacientesIncrement > 30
                ? "Crecimiento ambicioso de pacientes. Asegúrate de tener capacidad operativa suficiente."
                : projections.incrementoEbitda > 20
                ? "Excelente proyección. Esta combinación optimiza rentabilidad sin riesgo excesivo."
                : "Ajustes conservadores. Considera ser más agresivo para acelerar crecimiento."}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleReset}
            sx={{
              borderColor: ceoBrandColors.primary,
              color: ceoBrandColors.primary,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          >
            Resetear
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          >
            Aplicar Cambios
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
