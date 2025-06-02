import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  Snackbar,
  Fab,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Assessment,
  Refresh
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Importar componentes
import ReportFilterPanel from '../components/Reportes/ReportFilterPanel';
import ReportSummaryCards from '../components/Reportes/ReportSummaryCards';
import ReportTable from '../components/Reportes/ReportTable';
import ExportButtons from '../components/Reportes/ExportButtons';
import IngresosEgresosChart from '../components/Reportes/IngresosEgresosChart';
import CategoriasChart from '../components/Reportes/CategoriasChart';

// Importar servicios
import { reportesService } from '../services/reportesService';

const ReportesFinancieros = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtrosActuales, setFiltrosActuales] = useState({});
  
  // Estados para los datos
  const [resumenFinanciero, setResumenFinanciero] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [datosGraficoIngresos, setDatosGraficoIngresos] = useState([]);
  const [datosGraficoCategorias, setDatosGraficoCategorias] = useState([]);
  const [tipoCategoria, setTipoCategoria] = useState('venta');

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    // Cargar datos con filtros por defecto (últimos 30 días)
    const fechaHace30Dias = new Date();
    fechaHace30Dias.setDate(fechaHace30Dias.getDate() - 30);
    const fechaHoy = new Date();
    
    const filtrosIniciales = {
      fecha_desde: fechaHace30Dias.toISOString().split('T')[0],
      fecha_hasta: fechaHoy.toISOString().split('T')[0]
    };
    
    await cargarDatos(filtrosIniciales);
  };

  const cargarDatos = async (filtros = {}) => {
    setLoading(true);
    setError(null);
    setFiltrosActuales(filtros);
    
    try {
      // Cargar todos los datos en paralelo
      const [
        resumen,
        movimientosData,
        graficoIngresos,
        graficoCategorias
      ] = await Promise.all([
        reportesService.obtenerResumenFinanciero(filtros),
        reportesService.obtenerMovimientosFinancieros(filtros),
        reportesService.obtenerGraficoIngresosEgresos(filtros),
        reportesService.obtenerGraficoCategorias({ ...filtros, tipo: tipoCategoria })
      ]);

      setResumenFinanciero(resumen);
      setMovimientos(movimientosData);
      setDatosGraficoIngresos(graficoIngresos);
      setDatosGraficoCategorias(graficoCategorias);
      
    } catch (error) {
      console.error('Error cargando datos de reportes:', error);
      setError('Error al cargar los datos del reporte. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (nuevosFiltros) => {
    cargarDatos(nuevosFiltros);
  };

  const handleTipoCategoriaChange = async (nuevoTipo) => {
    setTipoCategoria(nuevoTipo);
    
    try {
      const graficoCategorias = await reportesService.obtenerGraficoCategorias({
        ...filtrosActuales,
        tipo: nuevoTipo
      });
      setDatosGraficoCategorias(graficoCategorias);
    } catch (error) {
      console.error('Error actualizando gráfico de categorías:', error);
    }
  };

  const handleRefresh = () => {
    cargarDatos(filtrosActuales);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleViewDetail = (movimiento) => {
    // Aquí podrías abrir un modal con más detalles del movimiento
    console.log('Ver detalle de:', movimiento);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Reportes Financieros
            </Typography>
          </Box>
          
          <ExportButtons filtros={filtrosActuales} disabled={loading} />
        </Box>
      </motion.div>

      {/* Panel de filtros */}
      <ReportFilterPanel 
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Tarjetas de resumen */}
      <ReportSummaryCards 
        data={resumenFinanciero}
        loading={loading}
      />

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <IngresosEgresosChart 
            data={datosGraficoIngresos}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <CategoriasChart 
            data={datosGraficoCategorias}
            loading={loading}
            tipo={tipoCategoria}
            onTipoChange={handleTipoCategoriaChange}
          />
        </Grid>
      </Grid>

      {/* Tabla de movimientos */}
      <ReportTable 
        data={movimientos}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      {/* FAB para refrescar */}
      <Fab
        color="primary"
        aria-label="refresh"
        onClick={handleRefresh}
        disabled={loading}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Refresh />
      </Fab>

      {/* Backdrop para loading */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando reportes...
          </Typography>
        </Box>
      </Backdrop>

      {/* Snackbar para errores */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportesFinancieros;