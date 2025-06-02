import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('📦 Inventory API_URL configurada:', API_URL);

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
    console.log('📤 Enviando petición de inventario a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de inventario recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de inventario:', error);
    
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
 * Obtiene todos los productos del inventario
 * @returns {array} - Lista de productos
 */
export const obtenerProductos = async () => {
  try {
    console.log('📦 Obteniendo productos del inventario');
    const response = await api.get('/inventario');
    console.log('✅ Productos obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    // Devolver array vacío en caso de error
    console.log('🔄 Devolviendo lista vacía de productos como fallback');
    return [];
  }
};

/**
 * Obtiene un producto específico por ID
 * @param {number} id - ID del producto
 * @returns {object} - Datos del producto
 */
export const obtenerProducto = async (id) => {
  try {
    console.log('📦 Obteniendo producto:', id);
    const response = await api.get(`/inventario/${id}`);
    console.log('✅ Producto obtenido:', response.data.nombre);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    throw error.response?.data || { message: 'Error obteniendo producto' };
  }
};

/**
 * Crea un nuevo producto
 * @param {object} producto - Datos del producto
 * @returns {object} - Respuesta del servidor
 */
export const crearProducto = async (producto) => {
  try {
    console.log('📦 Creando producto:', producto.nombre);
    const response = await api.post('/inventario', producto);
    console.log('✅ Producto creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    throw error.response?.data || { message: 'Error creando producto' };
  }
};

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {object} producto - Datos actualizados del producto
 * @returns {object} - Respuesta del servidor
 */
export const actualizarProducto = async (id, producto) => {
  try {
    console.log('📦 Actualizando producto:', id);
    const response = await api.put(`/inventario/${id}`, producto);
    console.log('✅ Producto actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    throw error.response?.data || { message: 'Error actualizando producto' };
  }
};

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {object} - Respuesta del servidor
 */
export const eliminarProducto = async (id) => {
  try {
    console.log('📦 Eliminando producto:', id);
    const response = await api.delete(`/inventario/${id}`);
    console.log('✅ Producto eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    throw error.response?.data || { message: 'Error eliminando producto' };
  }
};

/**
 * Obtiene estadísticas del inventario
 * @returns {object} - Estadísticas del inventario
 */
export const obtenerEstadisticasInventario = async () => {
  try {
    console.log('📊 Obteniendo estadísticas del inventario');
    const response = await api.get('/inventario/stats');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    // Devolver estadísticas por defecto en caso de error
    return {
      total_productos: 0,
      productos_stock_bajo: 0,
      valor_inventario: 0.0,
      stock_total: 0,
      productos_por_categoria: {},
      categorias_principales: []
};
  }
};

// Objeto principal del servicio de inventario
export const inventoryService = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerEstadisticasInventario,
};

// Exportación por defecto
export default inventoryService;