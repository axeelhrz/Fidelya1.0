import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('🛒 Purchase API_URL configurada:', API_URL);

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
    console.log('📤 Enviando petición de compras a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de compras recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de compras:', error);
    
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
 * Obtiene todas las compras con filtros opcionales
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de compras
 */
export const obtenerCompras = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.proveedor) {
      params.append('proveedor', filtros.proveedor);
    }
    if (filtros.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros.producto) {
      params.append('producto', filtros.producto);
    }
    
    const url = `/compras${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🛒 Obteniendo compras:', url);
    
    const response = await api.get(url);
    console.log('✅ Compras obtenidas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo compras:', error);
    throw error.response?.data || { message: 'Error obteniendo compras' };
  }
};

/**
 * Obtiene una compra específica por ID
 * @param {number} id - ID de la compra
 * @returns {object} - Datos de la compra
 */
export const obtenerCompra = async (id) => {
  try {
    console.log('🛒 Obteniendo compra:', id);
    const response = await api.get(`/compras/${id}`);
    console.log('✅ Compra obtenida:', response.data.proveedor);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo compra:', error);
    throw error.response?.data || { message: 'Error obteniendo compra' };
  }
};

/**
 * Crea una nueva compra
 * @param {object} compra - Datos de la compra
 * @returns {object} - Respuesta del servidor
 */
export const crearCompra = async (compra) => {
  try {
    console.log('🛒 Creando compra:', compra.proveedor);
    const response = await api.post('/compras', compra);
    console.log('✅ Compra creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando compra:', error);
    throw error.response?.data || { message: 'Error creando compra' };
  }
};

/**
 * Actualiza una compra existente
 * @param {number} id - ID de la compra
 * @param {object} compra - Datos actualizados de la compra
 * @returns {object} - Respuesta del servidor
 */
export const actualizarCompra = async (id, compra) => {
  try {
    console.log('🛒 Actualizando compra:', id);
    const response = await api.put(`/compras/${id}`, compra);
    console.log('✅ Compra actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando compra:', error);
    throw error.response?.data || { message: 'Error actualizando compra' };
  }
};

/**
 * Elimina una compra
 * @param {number} id - ID de la compra
 * @returns {object} - Respuesta del servidor
 */
export const eliminarCompra = async (id) => {
  try {
    console.log('🛒 Eliminando compra:', id);
    const response = await api.delete(`/compras/${id}`);
    console.log('✅ Compra eliminada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando compra:', error);
    throw error.response?.data || { message: 'Error eliminando compra' };
  }
};

/**
 * Obtiene estadísticas de compras
 * @returns {object} - Estadísticas de compras
 */
export const obtenerEstadisticasCompras = async () => {
  try {
    console.log('📊 Obteniendo estadísticas de compras');
    const response = await api.get('/compras/estadisticas');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error.response?.data || { message: 'Error obteniendo estadísticas' };
  }
};

/**
 * Obtiene lista de proveedores
 * @returns {array} - Lista de proveedores
 */
export const obtenerProveedores = async () => {
  try {
    console.log('🏪 Obteniendo proveedores');
    const response = await api.get('/proveedores');
    console.log('✅ Proveedores obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo proveedores:', error);
    throw error.response?.data || { message: 'Error obteniendo proveedores' };
  }
};

// Objeto principal del servicio de compras
export const purchaseService = {
  obtenerCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra,
  obtenerEstadisticasCompras,
  obtenerProveedores,
};

// Exportación por defecto
export default purchaseService;