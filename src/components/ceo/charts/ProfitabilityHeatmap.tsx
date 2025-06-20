'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person,
  TrendingUp,
  TrendingDown,
  EventNote,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { ProfitabilityData } from '@/types/ceo';

interface ProfitabilityHeatmapProps {
  data: ProfitabilityData[];
  loading?: boolean;
}

export default function ProfitabilityHeatmap({ 
  data, 
  loading = false 
}: ProfitabilityHeatmapProps) {
  const theme = useTheme();
  const [selectedTherapis, setSelectedTherapist] = useState<ProfitabilityData | null>(null);

  if (loading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  const getProfitabilityColor = (rentabilidad: number) => {
    if (rentabilidad >= 40) return theme.palette.success.main;
    if (rentabilidad >= 25) return theme.palette.warning.main;
    if (rentabilidad >= 15) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  const getProfitabilityLabel = (rentabilidad: number) => {
    if (rentabilidad >= 40) return 'Excelente';
    if (rentabilidad >= 25) return 'Bueno';
    if (rentabilidad >= 15) return 'Regular';
    return 'Crítico';
  };

  const handleTherapistClick = (therapist: ProfitabilityData) => {
    setSelectedTherapist(therapist);
  };

  const handleCloseDialog = () => {
    setSelectedTherapist(null);
  };

  // Sort by profitability descending
  const sortedData = [...data].sort((a, b) => b.rentabilidad - a.rentabilidad);

  return (
    <Box>
      <Grid container spacing={1}>
        {sortedData.map((therapist, index) => (
          <Grid item xs={12} key={therapist.terapeutaId}>
            <Card
              sx={{
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${alpha(getProfitabilityColor(therapist.rentabilidad), 0.1)} 0%, ${alpha(getProfitabilityColor(therapist.rentabilidad), 0.05)} 100%)`,
                border: `2px solid ${alpha(getProfitabilityColor(therapist.rentabilidad), 0.3)}`,
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(getProfitabilityColor(therapist.rentabilidad), 0.2)}`,
                  borderColor: getProfitabilityColor(therapist.rentabilidad),
                },
              }}
              onClick={() => handleTherapistClick(therapist)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${getProfitabilityColor(therapist.rentabilidad)} 0%, ${alpha(getProfitabilityColor(therapist.rentabilidad), 0.8)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                      }}
                    >
                      {therapist.nombre.split(' ').map(n => n[0]).join('')}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {therapist.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {therapist.sesiones} sesiones | {therapist.pacientesActivos} pacientes
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box textAlign="right">
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      color={getProfitabilityColor(therapist.rentabilidad)}
                    >
                      {therapist.rentabilidad.toFixed(1)}%
                    </Typography>
                    <Chip
                      label={getProfitabilityLabel(therapist.rentabilidad)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getProfitabilityColor(therapist.rentabilidad), 0.2),
                        color: getProfitabilityColor(therapist.rentabilidad),
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Therapist Detail Dialog */}
      <Dialog
        open={!!selectedTherapis}
        onClose={handleCloseDialog}
        maxWidth="sm"
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
        {selectedTherapis && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getProfitabilityColor(selectedTherapis.rentabilidad)} 0%, ${alpha(getProfitabilityColor(selectedTherapis.rentabilidad), 0.8)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  <Person />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedTherapis.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ficha Detallada del Terapeuta
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={3}>
                {/* Profitability Overview */}
                <Grid item xs={12}>
                  <Card sx={{ background: alpha(getProfitabilityColor(selectedTherapis.rentabilidad), 0.1) }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" fontWeight="bold" color={getProfitabilityColor(selectedTherapis.rentabilidad)}>
                        {selectedTherapis.rentabilidad.toFixed(1)}%
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Rentabilidad
                      </Typography>
                      <Chip
                        label={getProfitabilityLabel(selectedTherapis.rentabilidad)}
                        sx={{
                          mt: 1,
                          backgroundColor: alpha(getProfitabilityColor(selectedTherapis.rentabilidad), 0.2),
                          color: getProfitabilityColor(selectedTherapis.rentabilidad),
                          fontWeight: 600,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Financial Metrics */}
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AttachMoney sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        ${selectedTherapis.ingresos.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ingresos Totales
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingDown sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="error.main">
                        ${selectedTherapis.costos.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Costos Totales
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Activity Metrics */}
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <EventNote sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="primary.main">
                        {selectedTherapis.sesiones}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sesiones Realizadas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <People sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="secondary.main">
                        {selectedTherapis.pacientesActivos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pacientes Activos
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Performance Analysis */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Análisis de Rendimiento
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Ingreso por Sesión
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${(selectedTherapis.ingresos / selectedTherapis.sesiones).toFixed(0)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Costo por Sesión
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${(selectedTherapis.costos / selectedTherapis.sesiones).toFixed(0)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Sesiones por Paciente
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {(selectedTherapis.sesiones / selectedTherapis.pacientesActivos).toFixed(1)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog}>
                Cerrar
              </Button>
              <Button variant="contained">
                Ver Detalles Completos
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
