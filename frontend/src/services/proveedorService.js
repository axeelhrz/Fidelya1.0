import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('🏪 Proveedor API_URL configurada:', API_URL);

// Configurar instancia de axios con configuraciones base
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    console.log('📥 Respuesta de proveedores recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de proveedores:', error);
    
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
 * Obtiene todos los proveedores con filtros opcionales
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de proveedores
 */
export const obtenerProveedores = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.q) {
      params.append('q', filtros.q);
    }
    if (filtros.activo !== undefined) {
      params.append('activo', filtros.activo);
    }
    
    const url = `/proveedores${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🏪 Obteniendo proveedores:', url);
    
    const response = await api.get(url);
    console.log('✅ Proveedores obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo proveedores:', error);
    // Devolver array vacío en caso de error
    console.log('🔄 Devolviendo lista vacía de proveedores como fallback');
    return [];
  }
};

/**
 * Obtiene un proveedor específico por ID
 * @param {number} id - ID del proveedor
 * @returns {object} - Datos del proveedor
 */
export const obtenerProveedor = async (id) => {
  try {
    console.log('🏪 Obteniendo proveedor:', id);
    const response = await api.get(`/proveedores/${id}`);
    console.log('✅ Proveedor obtenido:', response.data.nombre);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo proveedor:', error);
    throw error.response?.data || { message: 'Error obteniendo proveedor' };
  }
};

/**
 * Crea un nuevo proveedor
 * @param {object} proveedor - Datos del proveedor
 * @returns {object} - Respuesta del servidor
 */
export const crearProveedor = async (proveedor) => {
  try {
    console.log('🏪 Creando proveedor:', proveedor.nombre);
    const response = await api.post('/proveedores', proveedor);
    console.log('✅ Proveedor creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando proveedor:', error);
    throw error.response?.data || { message: 'Error creando proveedor' };
  }
};

/**
 * Actualiza un proveedor existente
 * @param {number} id - ID del proveedor
 * @param {object} proveedor - Datos actualizados del proveedor
 * @returns {object} - Respuesta del servidor
 */
export const actualizarProveedor = async (id, proveedor) => {
  try {
    console.log('🏪 Actualizando proveedor:', id);
    const response = await api.put(`/proveedores/${id}`, proveedor);
    console.log('✅ Proveedor actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando proveedor:', error);
    throw error.response?.data || { message: 'Error actualizando proveedor' };
  }
};

/**
 * Elimina un proveedor
 * @param {number} id - ID del proveedor
 * @returns {object} - Respuesta del servidor
 */
export const eliminarProveedor = async (id) => {
  try {
    console.log('🏪 Eliminando proveedor:', id);
    const response = await api.delete(`/proveedores/${id}`);
    console.log('✅ Proveedor eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando proveedor:', error);
    throw error.response?.data || { message: 'Error eliminando proveedor' };
  }
};

/**
 * Busca proveedores por nombre, RUT o teléfono
 * @param {string} query - Término de búsqueda
 * @returns {array} - Lista de proveedores encontrados
 */
export const buscarProveedores = async (query) => {
  try {
    console.log('🔍 Buscando proveedores:', query);
    const response = await api.get(`/proveedores?q=${encodeURIComponent(query)}`);
    console.log('✅ Proveedores encontrados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error buscando proveedores:', error);
    return [];
  }
};

// Objeto principal del servicio de proveedores
export const proveedorService = {
  obtenerProveedores,
};

// Exportación por defecto
export default proveedorService;