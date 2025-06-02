import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('💰 Ventas API_URL configurada:', API_URL);

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
    console.log('📤 Enviando petición de ventas a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de ventas recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de ventas:', error);
    
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
 * Obtiene todas las ventas con filtros opcionales
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de ventas
 */
export const obtenerVentas = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros.cliente_id) {
      params.append('cliente_id', filtros.cliente_id);
    }
    if (filtros.usuario_id) {
      params.append('usuario_id', filtros.usuario_id);
    }
    if (filtros.forma_pago) {
      params.append('forma_pago', filtros.forma_pago);
    }
    if (filtros.producto) {
      params.append('producto', filtros.producto);
    }
    
    const url = `/ventas${params.toString() ? '?' + params.toString() : ''}`;
    console.log('💰 Obteniendo ventas:', url);
    
    const response = await api.get(url);
    console.log('✅ Ventas obtenidas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo ventas:', error);
    // Devolver array vacío en caso de error
    console.log('🔄 Devolviendo lista vacía de ventas como fallback');
    return [];
  }
};

/**
 * Obtiene una venta específica por ID
 * @param {number} id - ID de la venta
 * @returns {object} - Datos de la venta
 */
export const obtenerVenta = async (id) => {
  try {
    console.log('💰 Obteniendo venta:', id);
    const response = await api.get(`/ventas/${id}`);
    console.log('✅ Venta obtenida:', response.data.cliente?.nombre || 'Venta rápida');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo venta:', error);
    throw error.response?.data || { message: 'Error obteniendo venta' };
  }
};

/**
 * Crea una nueva venta
 * @param {object} venta - Datos de la venta
 * @returns {object} - Respuesta del servidor
 */
export const crearVenta = async (venta) => {
  try {
    console.log('💰 Creando venta:', venta);
    const response = await api.post('/ventas', venta);
    console.log('✅ Venta creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando venta:', error);
    throw error.response?.data || { message: 'Error creando venta' };
  }
};

/**
 * Actualiza una venta existente
 * @param {number} id - ID de la venta
 * @param {object} venta - Datos actualizados de la venta
 * @returns {object} - Respuesta del servidor
 */
export const actualizarVenta = async (id, venta) => {
  try {
    console.log('💰 Actualizando venta:', id);
    const response = await api.put(`/ventas/${id}`, venta);
    console.log('✅ Venta actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando venta:', error);
    throw error.response?.data || { message: 'Error actualizando venta' };
  }
};

/**
 * Elimina una venta
 * @param {number} id - ID de la venta
 * @returns {object} - Respuesta del servidor
 */
export const eliminarVenta = async (id) => {
  try {
    console.log('💰 Eliminando venta:', id);
    const response = await api.delete(`/ventas/${id}`);
    console.log('✅ Venta eliminada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando venta:', error);
    throw error.response?.data || { message: 'Error eliminando venta' };
  }
};

/**
 * Obtiene estadísticas de ventas
 * @returns {object} - Estadísticas de ventas
 */
export const obtenerEstadisticasVentas = async () => {
  try {
    console.log('📊 Obteniendo estadísticas de ventas');
    const response = await api.get('/ventas/estadisticas');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    // Devolver estadísticas por defecto en caso de error
    return {
      ventas_hoy: 0,
      ingresos_hoy: 0.0,
      ventas_mes: 0,
      ingresos_mes: 0.0,
      venta_promedio: 0.0,
      producto_mas_vendido: 'N/A',
      forma_pago_preferida: 'efectivo',
      ventas_por_forma_pago: {},
      ventas_por_dia: []
    };
  }
};

// Objeto principal del servicio de ventas
export const ventasService = {
  obtenerVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
  obtenerEstadisticasVentas,
};

// Exportación por defecto
export default ventasService;