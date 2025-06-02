import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('📊 Reportes API_URL configurada:', API_URL);

// Configurar instancia de axios con configuraciones base
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
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
        message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.',
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
 * Obtiene el resumen financiero con KPIs principales
 * @param {object} filtros - Filtros de fecha
 * @returns {object} - Resumen financiero
 */
export const obtenerResumenFinanciero = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_desde) {
      params.append('fecha_desde', filtros.fecha_desde);
    }
    if (filtros.fecha_hasta) {
      params.append('fecha_hasta', filtros.fecha_hasta);
    }
    
    const url = `/reportes/resumen${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📊 Obteniendo resumen financiero:', url);
    
    const response = await api.get(url);
    console.log('✅ Resumen financiero obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo resumen financiero:', error);
    return {
      ingresos: 0.0,
      egresos: 0.0,
      balance: 0.0,
      impuestos: 0.0
    };
  }
};

/**
 * Obtiene el listado detallado de movimientos financieros
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de movimientos
 */
export const obtenerMovimientosFinancieros = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_desde) {
      params.append('fecha_desde', filtros.fecha_desde);
    }
    if (filtros.fecha_hasta) {
      params.append('fecha_hasta', filtros.fecha_hasta);
    }
    if (filtros.tipo) {
      params.append('tipo', filtros.tipo);
    }
    if (filtros.categoria) {
      params.append('categoria', filtros.categoria);
    }
    if (filtros.cliente_id) {
      params.append('cliente_id', filtros.cliente_id);
    }
    if (filtros.proveedor_id) {
      params.append('proveedor_id', filtros.proveedor_id);
    }
    
    const url = `/reportes/movimientos${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📊 Obteniendo movimientos financieros:', url);
    
    const response = await api.get(url);
    console.log('✅ Movimientos financieros obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo movimientos financieros:', error);
    return [];
  }
};

/**
 * Obtiene datos para el gráfico de ingresos vs egresos
 * @param {object} filtros - Filtros de fecha
 * @returns {array} - Datos del gráfico
 */
export const obtenerGraficoIngresosEgresos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_desde) {
      params.append('fecha_desde', filtros.fecha_desde);
    }
    if (filtros.fecha_hasta) {
      params.append('fecha_hasta', filtros.fecha_hasta);
    }
    
    const url = `/reportes/grafico/ingresos-egresos${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📊 Obteniendo gráfico ingresos-egresos:', url);
    
    const response = await api.get(url);
    console.log('✅ Datos del gráfico obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo gráfico ingresos-egresos:', error);
    return [];
  }
};

/**
 * Obtiene datos para el gráfico de distribución por categorías
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Datos del gráfico
 */
export const obtenerGraficoCategorias = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.tipo) {
      params.append('tipo', filtros.tipo);
    }
    if (filtros.fecha_desde) {
      params.append('fecha_desde', filtros.fecha_desde);
    }
    if (filtros.fecha_hasta) {
      params.append('fecha_hasta', filtros.fecha_hasta);
    }
    
    const url = `/reportes/grafico/categorias${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📊 Obteniendo gráfico de categorías:', url);
    
    const response = await api.get(url);
    console.log('✅ Datos del gráfico de categorías obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo gráfico de categorías:', error);
    return [];
  }
};

/**
 * Exporta reporte a PDF
 * @param {object} filtros - Filtros del reporte
 * @returns {object} - Información de la exportación
 */
export const exportarReportePDF = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) {
        params.append(key, filtros[key]);
      }
    });
    
    const url = `/reportes/export/pdf${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📊 Exportando reporte a PDF:', url);
    
    const response = await api.get(url);
    console.log('✅ Información de exportación PDF:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando a PDF:', error);
    throw error.response?.data || { message: 'Error exportando a PDF' };
  }
};

/**
 * Exporta reporte a Excel
 * @param {object} filtros - Filtros del reporte
 * @returns {object} - Información de la exportación
 */
export const exportarReporteExcel = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) {
        params.append(key, filtros[key]);
      }
    });
    
    const url = `/reportes/export/excel${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📊 Exportando reporte a Excel:', url);
    
    const response = await api.get(url);
    console.log('✅ Información de exportación Excel:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando a Excel:', error);
    throw error.response?.data || { message: 'Error exportando a Excel' };
  }
};

// Objeto principal del servicio de reportes
export const reportesService = {
  obtenerResumenFinanciero,
  obtenerMovimientosFinancieros,
  obtenerGraficoIngresosEgresos,
  obtenerGraficoCategorias,
  exportarReportePDF,
  exportarReporteExcel,
};

// Exportación por defecto
export default reportesService;