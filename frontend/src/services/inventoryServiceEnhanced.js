import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('📦 Enhanced Inventory API_URL configurada:', API_URL);

// Configurar instancia de axios con configuraciones base
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Sistema de eventos para notificar cambios
class InventoryEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
  } catch (error) {
          console.error('Error en listener de evento:', error);
  }
      });
    }
  }
}

// Instancia global del emisor de eventos
export const inventoryEvents = new InventoryEventEmitter();

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
 * Crea un nuevo producto y notifica el cambio
 * @param {object} producto - Datos del producto
 * @returns {object} - Respuesta del servidor
 */
export const crearProducto = async (producto) => {
  try {
    console.log('📦 Creando producto:', producto.nombre);
    const response = await api.post('/productos', producto);
    console.log('✅ Producto creado:', response.data);
    
    // Emitir evento de cambio en inventario
    inventoryEvents.emit('productCreated', {
      type: 'CREATE',
      product: response.data,
      timestamp: new Date()
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    throw error.response?.data || { message: 'Error creando producto' };
  }
};

/**
 * Actualiza un producto existente y notifica el cambio
 * @param {number} id - ID del producto
 * @param {object} producto - Datos actualizados del producto
 * @returns {object} - Respuesta del servidor
 */
export const actualizarProducto = async (id, producto) => {
  try {
    console.log('📦 Actualizando producto:', id);
    const response = await api.put(`/productos/${id}`, producto);
    console.log('✅ Producto actualizado:', response.data);
    
    // Emitir evento de cambio en inventario
    inventoryEvents.emit('productUpdated', {
      type: 'UPDATE',
      product: response.data,
      productId: id,
      timestamp: new Date()
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    throw error.response?.data || { message: 'Error actualizando producto' };
  }
};

/**
 * Elimina un producto y notifica el cambio
 * @param {number} id - ID del producto
 * @returns {object} - Respuesta del servidor
 */
export const eliminarProducto = async (id) => {
  try {
    console.log('📦 Eliminando producto:', id);
    const response = await api.delete(`/productos/${id}`);
    console.log('✅ Producto eliminado:', response.data);
    
    // Emitir evento de cambio en inventario
    inventoryEvents.emit('productDeleted', {
      type: 'DELETE',
      productId: id,
      timestamp: new Date()
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    throw error.response?.data || { message: 'Error eliminando producto' };
  }
};

/**
 * Registra un movimiento de stock y notifica el cambio
 * @param {object} movimiento - Datos del movimiento
 * @returns {object} - Respuesta del servidor
 */
export const registrarMovimientoStock = async (movimiento) => {
  try {
    console.log('📝 Registrando movimiento de stock:', movimiento);
    const response = await api.post('/stock/movimiento', movimiento);
    console.log('✅ Movimiento registrado:', response.data);
    
    // Emitir evento de cambio en inventario
    inventoryEvents.emit('stockMovement', {
      type: 'STOCK_MOVEMENT',
      movement: response.data,
      productId: movimiento.producto_id,
      timestamp: new Date()
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error registrando movimiento:', error);
    throw error.response?.data || { message: 'Error registrando movimiento' };
  }
};

/**
 * Búsqueda avanzada de productos con filtros mejorados
 * @param {object} filtros - Filtros para la búsqueda
 * @returns {object} - { productos: [], paginacion: {} }
 */
export const busquedaAvanzadaProductos = async (filtros = {}) => {
  try {
    console.log('🔍 Búsqueda avanzada con filtros:', filtros);
    
    const params = new URLSearchParams();
    
    // Agregar parámetros de filtros usando los nombres que espera el backend
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.categoria && filtros.categoria !== 'todos') params.append('categoria', filtros.categoria);
    if (filtros.proveedor_id) params.append('proveedor_id', filtros.proveedor_id);
    if (filtros.stockBajo) params.append('stock_bajo', 'true');
    if (filtros.sinStock) params.append('sin_stock', 'true');
    if (filtros.orden) params.append('orden', filtros.orden);
    if (filtros.direccion) params.append('direccion', filtros.direccion);
    if (filtros.limite) params.append('limite', filtros.limite);
    
    // Usar el endpoint correcto del backend
    const response = await api.get(`/productos?${params.toString()}`);
    console.log('✅ Búsqueda completada:', response.data.length);
    
    // Adaptar la respuesta para que coincida con el formato esperado
    const productos = Array.isArray(response.data) ? response.data : [];
    return {
      productos: productos,
      paginacion: {
        pagina_actual: filtros.pagina || 1,
        limite: filtros.limite || 25,
        total_registros: productos.length,
        total_paginas: Math.ceil(productos.length / (filtros.limite || 25)),
        tiene_siguiente: false,
        tiene_anterior: false
  }
};
  } catch (error) {
    console.error('❌ Error en búsqueda avanzada:', error);
    return {
      productos: [],
      paginacion: {
        pagina_actual: 1,
        limite: 25,
        total_registros: 0,
        total_paginas: 0,
        tiene_siguiente: false,
        tiene_anterior: false
      }
};
  }
};

/**
 * Obtiene resumen completo del inventario
 * @returns {object} - Resumen del inventario
 */
export const obtenerResumenInventario = async () => {
  try {
    console.log('📊 Obteniendo resumen del inventario');
    const response = await api.get('/inventario/resumen');
    console.log('✅ Resumen obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo resumen:', error);
    return {
      total_productos: 0,
      productos_stock_bajo: [],
      valor_total_inventario: 0,
      stock_total: 0,
      productos_por_categoria: {},
      ultimos_movimientos: []
};
  }
};

/**
 * Obtiene historial de movimientos de un producto
 * @param {number} productoId - ID del producto
 * @param {object} filtros - Filtros adicionales
 * @returns {array} - Historial de movimientos
 */
export const obtenerHistorialProducto = async (productoId, filtros = {}) => {
  try {
    console.log('📋 Obteniendo historial del producto:', productoId);
    
    const params = new URLSearchParams();
    params.append('producto_id', productoId);
    if (filtros.limite) params.append('limit', filtros.limite);
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    
    const response = await api.get(`/movimientos?${params.toString()}`);
    console.log('✅ Historial obtenido:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    return [];
  }
};

/**
 * Obtiene todos los productos del inventario con filtros básicos
 * @param {object} filtros - Filtros para la búsqueda
 * @returns {array} - Lista de productos
 */
export const obtenerProductos = async (filtros = {}) => {
  try {
    console.log('📦 Obteniendo productos del inventario con filtros:', filtros);
    
    const params = new URLSearchParams();
    
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
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

// Objeto principal del servicio de inventario mejorado
const inventoryServiceEnhanced = {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  registrarMovimientoStock,
  busquedaAvanzadaProductos,
  obtenerResumenInventario,
  obtenerHistorialProducto,
  obtenerProductos,
  // Exportar también el emisor de eventos
  events: inventoryEvents
};

export default inventoryServiceEnhanced;
