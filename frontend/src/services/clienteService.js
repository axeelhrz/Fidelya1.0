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
      params.append('q', filtros.q);
    }
    if (filtros.activo !== undefined) {
      params.append('activo', filtros.activo);
    }
    
    const url = `/clientes${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

// Objeto principal del servicio de clientes
export const clienteService = {
  obtenerClientes,
};

// Exportación por defecto
export default clienteService;