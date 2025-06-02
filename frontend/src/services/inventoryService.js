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
 * Obtiene todos los productos del inventario con filtros mejorados
 * @param {object} filtros - Filtros para la búsqueda
 * @returns {array} - Lista de productos
 */
export const obtenerProductos = async (filtros = {}) => {
  try {
    console.log('📦 Obteniendo productos del inventario con filtros:', filtros);
    
    // Construir parámetros de consulta
    const params = new URLSearchParams();
    
    if (filtros.busqueda) params.append('q', filtros.busqueda);
    if (filtros.categoria && filtros.categoria !== 'todos') params.append('categoria', filtros.categoria);
    if (filtros.stockBajo) params.append('stock_bajo', 'true');
    if (filtros.orden) params.append('orden', filtros.orden);
    if (filtros.direccion) params.append('direccion', filtros.direccion);
    const response = await api.get(`/productos?${params.toString()}`);
    console.log('✅ Productos obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
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
    const response = await api.get(`/productos/${id}`);
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
    const response = await api.post('/productos', producto);
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
    const response = await api.put(`/productos/${id}`, producto);
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
    const response = await api.delete(`/productos/${id}`);
    console.log('✅ Producto eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    throw error.response?.data || { message: 'Error eliminando producto' };
  }
};

/**
 * Obtiene productos con stock bajo
 * @returns {array} - Lista de productos con stock bajo
 */
export const obtenerProductosStockBajo = async () => {
  try {
    console.log('⚠️ Obteniendo productos con stock bajo');
    const response = await api.get('/stock-bajo');
    console.log('✅ Productos con stock bajo obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo productos con stock bajo:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas detalladas del inventario
 * @returns {object} - Estadísticas del inventario
 */
export const obtenerEstadisticas = async () => {
  try {
    console.log('📊 Obteniendo estadísticas del inventario');
    const response = await api.get('/inventario/stats');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
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

/**
 * Registra un movimiento de stock
 * @param {object} movimiento - Datos del movimiento
 * @returns {object} - Respuesta del servidor
 */
export const registrarMovimientoStock = async (movimiento) => {
  try {
    console.log('📝 Registrando movimiento de stock:', movimiento);
    const response = await api.post('/stock/movimiento', movimiento);
    console.log('✅ Movimiento registrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error registrando movimiento:', error);
    throw error.response?.data || { message: 'Error registrando movimiento' };
  }
};

/**
 * Obtiene historial de movimientos de stock
 * @param {object} filtros - Filtros para la búsqueda
 * @returns {array} - Lista de movimientos
 */
export const obtenerMovimientos = async (filtros = {}) => {
  try {
    console.log('📋 Obteniendo movimientos de stock con filtros:', filtros);
    
    const params = new URLSearchParams();
    if (filtros.producto_id) params.append('producto_id', filtros.producto_id);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const response = await api.get(`/movimientos?${params.toString()}`);
    console.log('✅ Movimientos obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo movimientos:', error);
    return [];
  }
};

/**
 * Exporta productos a PDF
 * @returns {object} - Información de exportación
 */
export const exportarProductosPDF = async () => {
  try {
    console.log('📄 Exportando productos a PDF');
    const response = await api.get('/productos/export/pdf');
    console.log('✅ Exportación PDF iniciada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando PDF:', error);
    throw error.response?.data || { message: 'Error exportando PDF' };
  }
};

/**
 * Exporta productos a Excel
 * @returns {object} - Información de exportación
 */
export const exportarProductosExcel = async () => {
  try {
    console.log('📊 Exportando productos a Excel');
    const response = await api.get('/productos/export/excel');
    console.log('✅ Exportación Excel iniciada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando Excel:', error);
    throw error.response?.data || { message: 'Error exportando Excel' };
  }
};

// Objeto principal del servicio de inventario
const inventoryService = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosStockBajo,
  obtenerEstadisticas,
  registrarMovimientoStock,
  obtenerMovimientos,
  exportarProductosPDF,
  exportarProductosExcel,
};

// Exportación por defecto
export default inventoryService;