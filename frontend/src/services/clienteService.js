import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

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
    console.log('📤 Enviando petición a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta:', error);
    
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
 * Obtiene todos los clientes con filtros opcionales
 * @param {string} searchQuery - Término de búsqueda opcional
 * @returns {Array} - Lista de clientes
 */
export const obtenerClientes = async (searchQuery = '') => {
  try {
    console.log('👥 Obteniendo clientes...');
    const url = searchQuery ? `/clientes?q=${encodeURIComponent(searchQuery)}` : '/clientes';
    const response = await api.get(url);
    console.log('✅ Clientes obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo clientes:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
    }
    throw error.response?.data || { message: 'Error obteniendo clientes' };
  }
};

/**
 * Crea un nuevo cliente
 * @param {Object} clienteData - Datos del cliente
 * @returns {Object} - Respuesta del servidor
 */
export const crearCliente = async (clienteData) => {
  try {
    console.log('👥 Creando cliente:', clienteData);
    const response = await api.post('/clientes', clienteData);
    console.log('✅ Cliente creado exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error creando cliente:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
    }
    throw error.response?.data || { message: 'Error creando cliente' };
  }
};

/**
 * Actualiza un cliente existente
 * @param {number} clienteId - ID del cliente
 * @param {Object} clienteData - Datos actualizados del cliente
 * @returns {Object} - Respuesta del servidor
 */
export const actualizarCliente = async (clienteId, clienteData) => {
  try {
    console.log('👥 Actualizando cliente:', clienteId, clienteData);
    const response = await api.put(`/clientes/${clienteId}`, clienteData);
    console.log('✅ Cliente actualizado exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando cliente:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
    }
    throw error.response?.data || { message: 'Error actualizando cliente' };
  }
};

/**
 * Elimina un cliente
 * @param {number} clienteId - ID del cliente a eliminar
 * @returns {Object} - Respuesta del servidor
 */
export const eliminarCliente = async (clienteId) => {
  try {
    console.log('👥 Eliminando cliente:', clienteId);
    const response = await api.delete(`/clientes/${clienteId}`);
    console.log('✅ Cliente eliminado exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando cliente:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
    }
    throw error.response?.data || { message: 'Error eliminando cliente' };
  }
};

/**
 * Busca clientes por nombre, correo o teléfono
 * @param {string} searchQuery - Término de búsqueda
 * @returns {Array} - Lista de clientes encontrados
 */
export const buscarClientes = async (searchQuery) => {
  try {
    console.log('🔍 Buscando clientes:', searchQuery);
    const response = await api.get(`/clientes/search?q=${encodeURIComponent(searchQuery)}`);
    console.log('✅ Búsqueda completada:', response.data.length, 'resultados');
    return response.data;
  } catch (error) {
    console.error('❌ Error buscando clientes:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
    }
    throw error.response?.data || { message: 'Error buscando clientes' };
  }
};

/**
 * Obtiene estadísticas de clientes
 * @returns {Object} - Estadísticas de clientes
 */
export const obtenerEstadisticasClientes = async () => {
  try {
    console.log('📊 Obteniendo estadísticas de clientes...');
    const response = await api.get('/clientes/estadisticas');
    console.log('✅ Estadísticas obtenidas');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
    }
    throw error.response?.data || { message: 'Error obteniendo estadísticas' };
  }
};

// Objeto principal del servicio de clientes
export const clienteService = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  buscarClientes,
  obtenerEstadisticasClientes,
};

// Exportación por defecto
export default clienteService;