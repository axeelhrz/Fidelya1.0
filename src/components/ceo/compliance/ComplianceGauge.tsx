'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Security,
  CheckCircle,
  Warning,
  Error,
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

interface ComplianceGaugeProps {
  score: number;
}

export default function ComplianceGauge({ score }: ComplianceGaugeProps) {
  const theme = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return Warning;
    return Error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Aceptable';
    return 'Crítico';
  };

  const scoreColor = getScoreColor(score);
  const ScoreIcon = getScoreIcon(score);
  const scoreLabel = getScoreLabel(score);

  // Calculate gauge path
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

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
          <Security sx={{ color: ceoBrandColors.primary, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
            }}
          >
            Compliance Gauge
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            color: alpha(ceoBrandColors.text, 0.7),
          }}
        >
          Puntuación general de cumplimiento 0-100%
        </Typography>
      </Box>

      {/* Gauge */}
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              stroke={alpha(ceoBrandColors.text, 0.1)}
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke={scoreColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>
          
          {/* Center content */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <ScoreIcon sx={{ fontSize: 32, color: scoreColor, mb: 1 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 700,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {score}%
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                color: alpha(ceoBrandColors.text, 0.7),
                display: 'block',
                mt: 0.5,
              }}
            >
              {scoreLabel}
            </Typography>
          </Box>
        </Box>

        {/* Score breakdown */}
        <Box mt={3}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 2,
            }}
          >
            Componentes del Score
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1}>
            {[
              { label: 'Backups Verificados', value: 100, weight: 25 },
              { label: 'Políticas Firmadas', value: 85, weight: 20 },
              { label: 'Auditorías Completadas', value: 60, weight: 25 },
              { label: 'Certificados Vigentes', value: 95, weight: 30 },
            ].map((component) => (
              <Box
                key={component.label}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(getScoreColor(component.value), 0.05),
                  border: `1px solid ${alpha(getScoreColor(component.value), 0.2)}`,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    {component.label}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 700,
                      color: getScoreColor(component.value),
                    }}
                  >
                    {component.value}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 4,
                    backgroundColor: alpha(getScoreColor(component.value), 0.2),
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${component.value}%`,
                      height: '100%',
                      backgroundColor: getScoreColor(component.value),
                      borderRadius: 2,
                    }}
                  />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: alpha(ceoBrandColors.text, 0.6),
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  Peso: {component.weight}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
