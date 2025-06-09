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

/**
 * Obtiene todos los clientes con filtros opcionales
 * @param {Object} filtros - Filtros para la búsqueda
 * @returns {Array} - Lista de clientes
 */
export const obtenerClientes = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.q) {
      params.append('busqueda', filtros.q);
    }
    if (filtros.activo !== undefined) {
      params.append('activo', filtros.activo);
    }
    if (filtros.limite) {
      params.append('limite', filtros.limite);
    }
    
    const url = `/clientes${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

/**
 * Crea un nuevo cliente
 * @param {Object} cliente - Datos del cliente
 * @returns {Object} - Respuesta del servidor
 */
export const crearCliente = async (cliente) => {
  try {
    console.log('👥 Creando cliente:', cliente.nombre);
    const response = await api.post('/clientes', cliente);
    console.log('✅ Cliente creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando cliente:', error);
    throw error.response?.data || { message: 'Error creando cliente' };
  }
};

/**
 * Actualiza un cliente existente
 * @param {number} id - ID del cliente
 * @param {Object} cliente - Datos actualizados del cliente
 * @returns {Object} - Respuesta del servidor
 */
export const actualizarCliente = async (id, cliente) => {
  try {
    console.log('👥 Actualizando cliente:', id);
    const response = await api.put(`/clientes/${id}`, cliente);
    console.log('✅ Cliente actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando cliente:', error);
    throw error.response?.data || { message: 'Error actualizando cliente' };
  }
};

/**
 * Elimina un cliente
 * @param {number} id - ID del cliente
 * @returns {Object} - Respuesta del servidor
 */
export const eliminarCliente = async (id) => {
  try {
    console.log('👥 Eliminando cliente:', id);
    const response = await api.delete(`/clientes/${id}`);
    console.log('✅ Cliente eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando cliente:', error);
    throw error.response?.data || { message: 'Error eliminando cliente' };
  }
};

/**
 * Obtiene estadísticas de clientes
 * @returns {Object} - Estadísticas de clientes
 */
export const obtenerEstadisticasClientes = async () => {
  try {
    console.log('📊 Obteniendo estadísticas de clientes');
    const response = await api.get('/clientes/estadisticas');
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return {
      total_clientes: 0,
      clientes_activos: 0,
      clientes_con_compras: 0,
      promedio_compras: 0
    };
  }
};

// Objeto principal del servicio de clientes
export const clienteService = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerEstadisticasClientes,
};

// Exportación por defecto
export default clienteService;
