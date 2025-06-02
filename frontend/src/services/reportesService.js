import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('📊 Reportes API_URL configurada:', API_URL);

// Configurar instancia de axios con configuraciones base
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Timeout más largo para reportes
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token automáticamente a las peticiones
api.interceptors.request.use(
  (config) => {
    console.log('📤 Enviando petición de reportes a:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    console.log('📥 Respuesta de reportes recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de reportes:', error);
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Error de CORS o conexión:', error);
      return Promise.reject({
        message: 'Error de conexión. Verifica que el servidor esté funcionando.',
        type: 'NETWORK_ERROR'
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Obtiene reporte de ingresos
 * @param {object} filtros - Filtros de fecha y agrupación
 * @returns {object} - Datos del reporte de ingresos
 */
export const obtenerReporteIngresos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.agrupacion) params.append('agrupacion', filtros.agrupacion);
    
    console.log('📊 Obteniendo reporte de ingresos:', filtros);
    const response = await api.get(`/reportes/ingresos?${params.toString()}`);
    console.log('✅ Reporte de ingresos obtenido:', response.data.resumen?.total_ingresos || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo reporte de ingresos:', error);
    return {
      ingresos: [],
      resumen: {
        total_ingresos: 0,
        total_ventas: 0,
        venta_promedio: 0,
        venta_minima: 0,
        venta_maxima: 0
      },
      filtros: filtros,
      fecha_generacion: new Date().toISOString()
    };
  }
};

/**
 * Obtiene reporte de egresos
 * @param {object} filtros - Filtros de fecha
 * @returns {object} - Datos del reporte de egresos
 */
export const obtenerReporteEgresos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    
    console.log('📊 Obteniendo reporte de egresos:', filtros);
    const response = await api.get(`/reportes/egresos?${params.toString()}`);
    console.log('✅ Reporte de egresos obtenido:', response.data.resumen?.total_egresos || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo reporte de egresos:', error);
    return {
      egresos: [],
      resumen: {
        total_egresos: 0,
        total_transacciones: 0,
        egreso_promedio: 0,
        categoria_mayor_gasto: 'N/A'
      },
      filtros: filtros,
      fecha_generacion: new Date().toISOString()
};
  }
};

/**
 * Obtiene estado de resultados
 * @param {object} filtros - Filtros de fecha
 * @returns {object} - Estado de resultados completo
 */
export const obtenerEstadoResultados = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    
    console.log('📊 Obteniendo estado de resultados:', filtros);
    const response = await api.get(`/reportes/estado-resultados?${params.toString()}`);
    console.log('✅ Estado de resultados obtenido:', response.data.resultado?.utilidad_neta || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estado de resultados:', error);
    return {
      ingresos: {
        ventas_productos: 0,
        otros_ingresos: 0,
        total_ingresos: 0
      },
      egresos: {
        costo_productos: 0,
        gastos_operativos: 0,
        gastos_administrativos: 0,
        otros_gastos: 0,
        total_egresos: 0
      },
      resultado: {
        utilidad_bruta: 0,
        utilidad_operativa: 0,
        utilidad_neta: 0,
        margen_utilidad: 0
      },
      metricas: {
        numero_ventas: 0,
        numero_compras: 0,
        venta_promedio: 0,
        compra_promedio: 0,
        punto_equilibrio: 0,
        roi_porcentaje: 0
      },
      analisis: {
        estado: 'equilibrio',
        nivel_riesgo: 'medio',
        recomendacion: 'Datos insuficientes'
      },
      filtros: filtros,
      fecha_generacion: new Date().toISOString()
};
  }
};

/**
 * Obtiene reporte de ventas por producto
 * @param {object} filtros - Filtros de fecha y límite
 * @returns {object} - Reporte de ventas por producto
 */
export const obtenerReporteVentasPorProducto = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.limite) params.append('limite', filtros.limite);
    
    console.log('📊 Obteniendo reporte de ventas por producto:', filtros);
    const response = await api.get(`/reportes/ventas-por-producto?${params.toString()}`);
    console.log('✅ Reporte de ventas por producto obtenido:', response.data.productos?.length || 0, 'productos');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo reporte de ventas por producto:', error);
    return {
      productos: [],
      categorias: [],
      resumen: {
        total_productos_vendidos: 0,
        total_ventas: 0,
        total_ingresos: 0,
        total_unidades_vendidas: 0,
        ingreso_promedio_por_producto: 0,
        producto_mas_vendido: 'N/A',
        categoria_mas_vendida: 'N/A'
      },
      filtros: filtros,
      fecha_generacion: new Date().toISOString()
};
  }
};

/**
 * Obtiene reporte de inventario
 * @returns {object} - Estado completo del inventario
 */
export const obtenerReporteInventario = async () => {
  try {
    console.log('📊 Obteniendo reporte de inventario');
    const response = await api.get('/reportes/inventario');
    console.log('✅ Reporte de inventario obtenido:', response.data.productos?.length || 0, 'productos');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo reporte de inventario:', error);
    return {
      productos: [],
      resumen: {
        total_productos: 0,
        valor_total_inventario: 0,
        productos_sin_stock: 0,
        productos_stock_bajo: 0,
        productos_stock_normal: 0,
        productos_excedente: 0,
        porcentaje_productos_criticos: 0
      },
      por_categoria: {},
      productos_criticos: [],
      productos_baja_rotacion: [],
      movimientos_recientes: [],
      alertas: [],
      fecha_generacion: new Date().toISOString()
    };
  }
};

/**
 * Exporta un reporte en formato PDF o Excel
 * @param {string} tipoReporte - Tipo de reporte a exportar
 * @param {string} formato - 'pdf' o 'excel'
 * @param {object} filtros - Filtros aplicados al reporte
 * @returns {object} - Información de la exportación
 */
export const exportarReporte = async (tipoReporte, formato, filtros = {}) => {
  try {
    console.log('📤 Exportando reporte:', tipoReporte, 'en formato:', formato);
    
    const data = {
      tipo_reporte: tipoReporte,
      formato: formato,
      filtros: filtros
    };
    
    const response = await api.post('/reportes/exportar', data);
    console.log('✅ Reporte exportado:', response.data.nombre_archivo);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando reporte:', error);
    throw error.response?.data || { message: 'Error exportando reporte' };
  }
};

/**
 * Obtiene todos los reportes disponibles con sus datos
 * @param {object} filtros - Filtros globales para todos los reportes
 * @returns {object} - Todos los reportes consolidados
 */
export const obtenerTodosLosReportes = async (filtros = {}) => {
  try {
    console.log('📊 Obteniendo todos los reportes con filtros:', filtros);
    
    // Ejecutar todas las consultas en paralelo
    const [
      reporteIngresos,
      reporteEgresos,
      estadoResultados,
      reporteVentasProducto,
      reporteInventario
    ] = await Promise.allSettled([
      obtenerReporteIngresos(filtros),
      obtenerReporteEgresos(filtros),
      obtenerEstadoResultados(filtros),
      obtenerReporteVentasPorProducto(filtros),
      obtenerReporteInventario()
    ]);
    
    const resultado = {
      ingresos: reporteIngresos.status === 'fulfilled' ? reporteIngresos.value : null,
      egresos: reporteEgresos.status === 'fulfilled' ? reporteEgresos.value : null,
      estado_resultados: estadoResultados.status === 'fulfilled' ? estadoResultados.value : null,
      ventas_por_producto: reporteVentasProducto.status === 'fulfilled' ? reporteVentasProducto.value : null,
      inventario: reporteInventario.status === 'fulfilled' ? reporteInventario.value : null,
      filtros_aplicados: filtros,
      fecha_generacion: new Date().toISOString(),
      errores: [
        reporteIngresos.status === 'rejected' ? { tipo: 'ingresos', error: reporteIngresos.reason } : null,
        reporteEgresos.status === 'rejected' ? { tipo: 'egresos', error: reporteEgresos.reason } : null,
        estadoResultados.status === 'rejected' ? { tipo: 'estado_resultados', error: estadoResultados.reason } : null,
        reporteVentasProducto.status === 'rejected' ? { tipo: 'ventas_por_producto', error: reporteVentasProducto.reason } : null,
        reporteInventario.status === 'rejected' ? { tipo: 'inventario', error: reporteInventario.reason } : null
      ].filter(error => error !== null)
    };
    
    console.log('✅ Todos los reportes obtenidos. Errores:', resultado.errores.length);
    return resultado;
  } catch (error) {
    console.error('❌ Error obteniendo todos los reportes:', error);
    throw error;
  }
};

// Objeto principal del servicio de reportes
const reportesService = {
  obtenerReporteIngresos,
  obtenerReporteEgresos,
  obtenerEstadoResultados,
  obtenerReporteVentasPorProducto,
  obtenerReporteInventario,
  exportarReporte,
  obtenerTodosLosReportes,
};

// Exportación por defecto
export default reportesService;