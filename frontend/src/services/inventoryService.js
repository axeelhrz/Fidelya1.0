import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('🔗 Inventory API_URL configurada:', API_URL);

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
 * Obtiene todos los productos con filtros opcionales
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de productos
 */
export const obtenerProductos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.categoria && filtros.categoria !== 'todos') {
      params.append('categoria', filtros.categoria);
    }
    if (filtros.busqueda) {
      params.append('busqueda', filtros.busqueda);
    }
    if (filtros.stockBajo) {
      params.append('stock_bajo', 'true');
    }
    if (filtros.orden) {
      params.append('orden', filtros.orden);
    }
    if (filtros.direccion) {
      params.append('direccion', filtros.direccion);
    }
    
    const url = `/inventario${params.toString() ? '?' + params.toString() : ''}`;
    console.log('📦 Obteniendo productos:', url);
    
    const response = await api.get(url);
    console.log('✅ Productos obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    throw error.response?.data || { message: 'Error obteniendo productos' };
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
 * Elimina un producto (soft delete)
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
 * Ajusta el stock de un producto
 * @param {number} id - ID del producto
 * @param {object} movimiento - Datos del movimiento de stock
 * @returns {object} - Respuesta del servidor
 */
export const ajustarStock = async (id, movimiento) => {
  try {
    console.log('📦 Ajustando stock del producto:', id, movimiento);
    const response = await api.post(`/inventario/${id}/stock`, movimiento);
    console.log('✅ Stock ajustado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error ajustando stock:', error);
    throw error.response?.data || { message: 'Error ajustando stock' };
  }
};

/**
 * Obtiene estadísticas del inventario
 * @returns {object} - Estadísticas del inventario
 */
export const obtenerEstadisticas = async () => {
  try {
    console.log('📊 Obteniendo estadísticas del inventario');
    const response = await api.get('/inventario/estadisticas');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error.response?.data || { message: 'Error obteniendo estadísticas' };
  }
};

/**
 * Obtiene el historial de movimientos de un producto
 * @param {number
Collapse Code

Reject
Accept
1 Pending changes
Continue your response exactly where you left off:
Reject all
Accept all


Click to continue generating
Claude 4 sonnet PCAI





Continue your response exactly where you left off:

Checkpoint
Compare
Restore
inventoryService.js



/**
 * Obtiene el historial de movimientos de un producto
 * @param {number} id - ID del producto
 * @returns {object} - Historial de movimientos
 */
export const obtenerMovimientosProducto = async (id) => {
  try {
    console.log('📦 Obteniendo movimientos del producto:', id);
    const response = await api.get(`/inventario/${id}/movimientos`);
    console.log('✅ Movimientos obtenidos:', response.data.movimientos.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo movimientos:', error);
    throw error.response?.data || { message: 'Error obteniendo movimientos' };
  }
};

/**
 * Obtiene productos con stock bajo
 * @returns {array} - Lista de productos con stock bajo
 */
export const obtenerProductosStockBajo = async () => {
  try {
    console.log('⚠️ Obteniendo productos con stock bajo');
    const response = await obtenerProductos({ stockBajo: true });
    console.log('✅ Productos con stock bajo obtenidos:', response.length);
    return response;
  } catch (error) {
    console.error('❌ Error obteniendo productos con stock bajo:', error);
    throw error;
  }
};

/**
 * Busca productos por nombre o proveedor
 * @param {string} termino - Término de búsqueda
 * @returns {array} - Lista de productos encontrados
 */
export const buscarProductos = async (termino) => {
  try {
    console.log('🔍 Buscando productos:', termino);
    const response = await obtenerProductos({ busqueda: termino });
    console.log('✅ Productos encontrados:', response.length);
    return response;
  } catch (error) {
    console.error('❌ Error buscando productos:', error);
    throw error;
  }
};

/**
 * Filtra productos por categoría
 * @param {string} categoria - Categoría a filtrar
 * @returns {array} - Lista de productos filtrados
 */
export const filtrarPorCategoria = async (categoria) => {
  try {
    console.log('🏷️ Filtrando productos por categoría:', categoria);
    const response = await obtenerProductos({ categoria });
    console.log('✅ Productos filtrados:', response.length);
    return response;
  } catch (error) {
    console.error('❌ Error filtrando productos:', error);
    throw error;
  }
};

/**
 * Ordena productos por campo específico
 * @param {string} campo - Campo por el cual ordenar
 * @param {string} direccion - Dirección del ordenamiento (asc/desc)
 * @returns {array} - Lista de productos ordenados
 */
export const ordenarProductos = async (campo, direccion = 'asc') => {
  try {
    console.log('📊 Ordenando productos por:', campo, direccion);
    const response = await obtenerProductos({ orden: campo, direccion });
    console.log('✅ Productos ordenados:', response.length);
    return response;
  } catch (error) {
    console.error('❌ Error ordenando productos:', error);
    throw error;
  }
};

// Objeto principal del servicio de inventario
export const inventoryService = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  ajustarStock,
  obtenerEstadisticas,
  obtenerMovimientosProducto,
  obtenerProductosStockBajo,
  buscarProductos,
  filtrarPorCategoria,
  ordenarProductos,
};

// Exportación por defecto
export default inventoryService;