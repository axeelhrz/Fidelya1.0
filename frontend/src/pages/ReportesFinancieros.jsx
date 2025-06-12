import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Tabs,
  Tab,
  Alert,
  Backdrop,
  CircularProgress,
  Fab,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  Inventory as InventoryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Importar componentes
import FiltrosReportes from './reportes/components/FiltrosReportes';
import ExportarReporte from './reportes/components/ExportarReporte';
import ReporteIngresos from './reportes/components/ReporteIngresos';
import ReporteEgresos from './reportes/components/ReporteEgresos';
import EstadoResultados from './reportes/components/EstadoResultados';
import ReporteVentasPorProducto from './reportes/components/ReporteVentasPorProducto';
import ReporteInventario from './reportes/components/ReporteInventario';
// Importar servicio
import reportesService from '../services/reportesService';

const ReportesFinancieros = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados
  const [tabActiva, setTabActiva] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    periodo: 'personalizado',
    agrupacion: 'fecha'
  });
  
  // Datos de reportes
  const [datosIngresos, setDatosIngresos] = useState(null);
  const [datosEgresos, setDatosEgresos] = useState(null);
  const [datosEstadoResultados, setDatosEstadoResultados] = useState(null);
  const [datosVentasProducto, setDatosVentasProducto] = useState(null);
  const [datosInventario, setDatosInventario] = useState(null);

  // Configuración de tabs
  const tabs = [
    {
      label: 'Estado de Resultados',
      icon: <AssessmentIcon />,
      color: 'primary.main',
      component: EstadoResultados,
      datos: datosEstadoResultados,
      descripcion: 'Análisis financiero completo'
    },
    {
      label: 'Ingresos',
      icon: <TrendingUpIcon />,
      color: 'success.main',
      component: ReporteIngresos,
      datos: datosIngresos,
      descripcion: 'Reporte de ingresos por ventas'
    },
    {
      label: 'Egresos',
      icon: <TrendingDownIcon />,
      color: 'error.main',
      component: ReporteEgresos,
      datos: datosEgresos,
      descripcion: 'Análisis de gastos y egresos'
    },
    {
      label: 'Ventas por Producto',
      icon: <BarChartIcon />,
      color: 'secondary.main',
      component: ReporteVentasPorProducto,
      datos: datosVentasProducto,
      descripcion: 'Productos más vendidos'
    },
    {
      label: 'Inventario',
      icon: <InventoryIcon />,
      color: 'info.main',
      component: ReporteInventario,
      datos: datosInventario,
      descripcion: 'Estado actual del inventario'
    }
  ];

  // Cargar todos los reportes
  const cargarTodosLosReportes = useCallback(async (filtrosPersonalizados = filtros) => {
    try {
      setLoading(true);
    setError(null);

      // Cargar reportes en paralelo
      const [ingresos, egresos, estadoResultados, ventasProducto, inventario] = await Promise.allSettled([
        reportesService.obtenerReporteIngresos(filtrosPersonalizados),
        reportesService.obtenerReporteEgresos(filtrosPersonalizados),
        reportesService.obtenerEstadoResultados(filtrosPersonalizados),
        reportesService.obtenerReporteVentasPorProducto(filtrosPersonalizados),
        reportesService.obtenerReporteInventario()
      ]);

      // Actualizar estados con los resultados
      if (ingresos.status === 'fulfilled') setDatosIngresos(ingresos.value);
      if (egresos.status === 'fulfilled') setDatosEgresos(egresos.value);
      if (estadoResultados.status === 'fulfilled') setDatosEstadoResultados(estadoResultados.value);
      if (ventasProducto.status === 'fulfilled') setDatosVentasProducto(ventasProducto.value);
      if (inventario.status === 'fulfilled') setDatosInventario(inventario.value);

      // Verificar si hubo errores
      const errores = [ingresos, egresos, estadoResultados, ventasProducto, inventario]
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      if (errores.length > 0) {
        console.warn('Algunos reportes fallaron:', errores);
        setError(`${errores.length} reportes no pudieron cargarse completamente`);
      }

    } catch (error) {
      console.error('Error cargando reportes:', error);
      setError('Error al cargar los reportes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Manejar cambio de filtros
  const handleFiltrosChange = useCallback((nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarTodosLosReportes();
  }, [cargarTodosLosReportes]);

  // Manejar cambio de filtros
  // Aplicar filtros
  const handleAplicarFiltros = (filtrosAplicados) => {
    cargarTodosLosReportes(filtrosAplicados);
};

  // Limpiar filtros
  const handleLimpiarFiltros = () => {
    const filtrosVacios = {
      fecha_inicio: '',
      fecha_fin: '',
      periodo: 'personalizado',
      agrupacion: 'fecha'
    };
    setFiltros(filtrosVacios);
    cargarTodosLosReportes(filtrosVacios);
  };

  // Obtener nombre del tipo de reporte actual
  const obtenerTipoReporte = () => {
    const tiposReporte = [
      'estado_resultados',
      'ingresos',
      'egresos', 
      'ventas_por_producto',
      'inventario'
    ];
    return tiposReporte[tabActiva] || 'estado_resultados';
  };

  // Renderizar contenido del tab activo
  const renderizarContenidoTab = () => {
    const tabConfig = tabs[tabActiva];
    if (!tabConfig) return null;

    const ComponenteReporte = tabConfig.component;
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={tabActiva}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ComponenteReporte 
            datos={tabConfig.datos}
            loading={loading}
            filtros={filtros}
          />
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            color="primary.main"
            sx={{ mb: 1 }}
          >
            📊 Reportes Financieros
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análisis completo de ingresos, egresos, inventario y estado financiero del negocio
          </Typography>
        </Box>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FiltrosReportes
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onAplicarFiltros={handleAplicarFiltros}
          onLimpiarFiltros={handleLimpiarFiltros}
          loading={loading}
          mostrarAgrupacion={tabActiva === 1} // Solo para reporte de ingresos
        />
      </motion.div>

      {/* Alertas de Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Tabs de Navegación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card elevation={3} sx={{ mb: 3, borderRadius: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabActiva}
              onChange={(e, newValue) => setTabActiva(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                '& .MuiTab-root': {
                  minHeight: 72,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    fontWeight: 600
                  }
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="inherit">
                        {tab.label}
                      </Typography>
                      {!isMobile && (
                        <Typography variant="caption" color="text.secondary">
                          {tab.descripcion}
                        </Typography>
                      )}
                    </Box>
                  }
                  iconPosition="start"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: tab.color
                    }
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Barra de Acciones */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color={tabs[tabActiva]?.color}>
              {tabs[tabActiva]?.label}
            </Typography>
            <ExportarReporte
              tipoReporte={obtenerTipoReporte()}
              datosReporte={tabs[tabActiva]?.datos}
              filtros={filtros}
              disabled={loading || !tabs[tabActiva]?.datos}
            />
          </Box>
        </Card>
      </motion.div>

      {/* Contenido del Reporte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {renderizarContenidoTab()}
      </motion.div>

      {/* FAB para Actualizar */}
      <Zoom in={!loading}>
        <Fab
          color="primary"
          aria-label="actualizar"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
          onClick={() => cargarTodosLosReportes()}
        >
          <RefreshIcon />
        </Fab>
      </Zoom>

      {/* Backdrop de Loading */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }}
        open={loading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando reportes...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Esto puede tomar unos momentos
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default ReportesFinancieros;
