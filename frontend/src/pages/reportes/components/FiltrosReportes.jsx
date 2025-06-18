import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  CalendarMonth as CalendarIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';

const FiltrosReportes = ({ 
  filtros, 
  onFiltrosChange, 
  onAplicarFiltros, 
  onLimpiarFiltros,
  loading = false,
  mostrarAgrupacion = false 
}) => {
  const [filtrosLocales, setFiltrosLocales] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    periodo: 'personalizado',
    agrupacion: 'fecha',
    ...filtros
  });

  // Actualizar filtros locales cuando cambien los props
  useEffect(() => {
    setFiltrosLocales(prev => ({
      ...prev,
      ...filtros
    }));
  }, [filtros]);

  // Manejar cambio de período predefinido
  const handlePeriodoChange = (periodo) => {
    const hoy = new Date();
    let fechaInicio, fechaFin;

    switch (periodo) {
      case 'hoy':
        fechaInicio = fechaFin = format(hoy, 'yyyy-MM-dd');
        break;
      case 'ayer':
        const ayer = subDays(hoy, 1);
        fechaInicio = fechaFin = format(ayer, 'yyyy-MM-dd');
        break;
      case 'ultimos_7_dias':
        fechaInicio = format(subDays(hoy, 6), 'yyyy-MM-dd');
        fechaFin = format(hoy, 'yyyy-MM-dd');
        break;
      case 'ultimos_30_dias':
        fechaInicio = format(subDays(hoy, 29), 'yyyy-MM-dd');
        fechaFin = format(hoy, 'yyyy-MM-dd');
        break;
      case 'mes_actual':
        fechaInicio = format(startOfMonth(hoy), 'yyyy-MM-dd');
        fechaFin = format(endOfMonth(hoy), 'yyyy-MM-dd');
        break;
      case 'mes_anterior':
        const mesAnterior = subDays(startOfMonth(hoy), 1);
        fechaInicio = format(startOfMonth(mesAnterior), 'yyyy-MM-dd');
        fechaFin = format(endOfMonth(mesAnterior), 'yyyy-MM-dd');
        break;
      case 'año_actual':
        fechaInicio = format(startOfYear(hoy), 'yyyy-MM-dd');
        fechaFin = format(endOfYear(hoy), 'yyyy-MM-dd');
        break;
      case 'personalizado':
      default:
        // No cambiar las fechas para período personalizado
        return;
    }

    const nuevosFiltros = {
      ...filtrosLocales,
      periodo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    };

    setFiltrosLocales(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  // Manejar cambio de filtros individuales
  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = {
      ...filtrosLocales,
      [campo]: valor
    };

    // Si se cambian las fechas manualmente, cambiar a período personalizado
    if (campo === 'fecha_inicio' || campo === 'fecha_fin') {
      nuevosFiltros.periodo = 'personalizado';
    }

    setFiltrosLocales(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  // Limpiar todos los filtros
  const handleLimpiarFiltros = () => {
    const filtrosVacios = {
      fecha_inicio: '',
      fecha_fin: '',
      periodo: 'personalizado',
      agrupacion: 'fecha'
    };
    
    setFiltrosLocales(filtrosVacios);
    onLimpiarFiltros();
  };

  // Aplicar filtros
  const handleAplicarFiltros = () => {
    onAplicarFiltros(filtrosLocales);
  };

  // Obtener etiqueta del período seleccionado
  const obtenerEtiquetaPeriodo = () => {
    if (!filtrosLocales.fecha_inicio && !filtrosLocales.fecha_fin) {
      return 'Sin filtro de fecha';
    }

    if (filtrosLocales.fecha_inicio === filtrosLocales.fecha_fin) {
      return format(new Date(filtrosLocales.fecha_inicio), 'dd/MM/yyyy', { locale: es });
    }

    const inicio = filtrosLocales.fecha_inicio ? 
      format(new Date(filtrosLocales.fecha_inicio), 'dd/MM/yyyy', { locale: es }) : 
      'Inicio';
    const fin = filtrosLocales.fecha_fin ? 
      format(new Date(filtrosLocales.fecha_fin), 'dd/MM/yyyy', { locale: es }) : 
      'Fin';

    return `${inicio} - ${fin}`;
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Filtros de Reportes
        </Typography>
        <Tooltip title="Actualizar">
          <IconButton 
            onClick={handleAplicarFiltros}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Limpiar filtros">
          <IconButton onClick={handleLimpiarFiltros} disabled={loading}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Período Predefinido */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Período</InputLabel>
            <Select
              value={filtrosLocales.periodo}
              label="Período"
              onChange={(e) => handlePeriodoChange(e.target.value)}
              disabled={loading}
              startAdornment={<CalendarIcon sx={{ mr: 1, color: 'action.active' }} />}
            >
              <MenuItem value="hoy">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TodayIcon sx={{ mr: 1, fontSize: 20 }} />
                  Hoy
                </Box>
              </MenuItem>
              <MenuItem value="ayer">Ayer</MenuItem>
              <MenuItem value="ultimos_7_dias">Últimos 7 días</MenuItem>
              <MenuItem value="ultimos_30_dias">Últimos 30 días</MenuItem>
              <Divider />
              <MenuItem value="mes_actual">Mes actual</MenuItem>
              <MenuItem value="mes_anterior">Mes anterior</MenuItem>
              <MenuItem value="año_actual">Año actual</MenuItem>
              <Divider />
              <MenuItem value="personalizado">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateRangeIcon sx={{ mr: 1, fontSize: 20 }} />
                  Personalizado
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Fecha Inicio */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Fecha Inicio"
            value={filtrosLocales.fecha_inicio}
            onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: filtrosLocales.fecha_fin || format(new Date(), 'yyyy-MM-dd')
            }}
          />
        </Grid>

        {/* Fecha Fin */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Fecha Fin"
            value={filtrosLocales.fecha_fin}
            onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: filtrosLocales.fecha_inicio,
              max: format(new Date(), 'yyyy-MM-dd')
            }}
          />
        </Grid>

        {/* Agrupación (solo si se especifica) */}
        {mostrarAgrupacion && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Agrupar por</InputLabel>
              <Select
                value={filtrosLocales.agrupacion}
                label="Agrupar por"
                onChange={(e) => handleFiltroChange('agrupacion', e.target.value)}
                disabled={loading}
              >
                <MenuItem value="fecha">Por Fecha</MenuItem>
                <MenuItem value="producto">Por Producto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Botones de Acción */}
        <Grid item xs={12} md={mostrarAgrupacion ? 6 : 12}>
          <Stack direction="row" spacing={2} sx={{ height: '100%', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleAplicarFiltros}
              disabled={loading}
              startIcon={<FilterIcon />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Aplicando...' : 'Aplicar'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleLimpiarFiltros}
              disabled={loading}
              startIcon={<ClearIcon />}
            >
              Limpiar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Resumen de Filtros Aplicados */}
      {(filtrosLocales.fecha_inicio || filtrosLocales.fecha_fin) && (
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Filtros aplicados:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={`Período: ${obtenerEtiquetaPeriodo()}`}
              size="small"
              color="primary"
              variant="outlined"
              icon={<DateRangeIcon />}
            />
            {mostrarAgrupacion && (
              <Chip
                label={`Agrupación: ${filtrosLocales.agrupacion === 'fecha' ? 'Por Fecha' : 'Por Producto'}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default FiltrosReportes;