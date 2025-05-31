import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL || 'http://localhost:5000/api';

// Configurar instancia de axios con configuraciones base
const api = axios.create({
  baseURL: API_URL,
  timeout: config.REQUEST_TIMEOUT || 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token automáticamente a las peticiones
api.interceptors.request.use(
  (config) => {
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
  (response) => response,
  (error) => {
    // Manejar errores de CORS específicamente
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Error de CORS o conexión:', error);
      // No redirigir automáticamente en errores de red
      return Promise.reject({
        message: 'Error de conexión. Verifica que el servidor esté funcionando.',
        type: 'NETWORK_ERROR'
      });
    }
    
    // Manejar token expirado o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberUser');
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Inicia sesión de usuario
 * @param {string} correo - Correo electrónico
 * @param {string} contraseña - Contraseña sin hashear
 * @returns {object} - { token, user: { id, nombre, correo, rol }, message }
 */
export const login = async (correo, contraseña) => {
  try {
    console.log('Intentando login con:', { correo, url: `${API_URL}/login` });
    const response = await axios.post(`${API_URL}/login`, {
  correo: correo.trim().toLowerCase(),
  contraseña,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    
    console.log('Respuesta de login:', response.data);
    
    // Validar que la respuesta tenga la estructura esperada
    if (!response.data.token || !response.data.user) {
      throw new Error('Respuesta del servidor inválida');
  }
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    
    // Manejar diferentes tipos de errores
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando.' };
  }
    
    throw error.response?.data || { message: 'Error de conexión con el servidor' };
  }
};

/**
 * Registra un nuevo usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} correo - Email del usuario
 * @param {string} contraseña - Contraseña sin hashear
 * @returns {object} - { message, success: true }
 */
export const register = async (nombre, correo, contraseña) => {
  try {
    console.log('Intentando registro con:', { nombre, correo, url: `${API_URL}/register` });
    
    const response = await axios.post(`${API_URL}/register`, {
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      contraseña,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    
    console.log('Respuesta de registro:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar diferentes tipos de errores
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando.' };
    }
    
    throw error.response?.data || { message: 'Error de conexión con el servidor' };
  }
};

/**
 * Verifica si un token JWT es válido
 * @param {string} token - JWT del usuario (opcional, usa el del localStorage si no se proporciona)
 * @returns {object} - { valid: true/false, user: { id, nombre, correo, rol } }
 */
export const verifyToken = async (token = null) => {
  try {
    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) {
      return { valid: false };
    }
    
    const response = await axios.get(`${API_URL}/verify-token`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verificando token:', error);
    return { valid: false };
  }
};

/**
 * Cierra sesión del usuario
 * @returns {boolean} - true si se cerró sesión correctamente
 */
export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberUser');
    return true;
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return false;
  }
};

/**
 * Obtiene el token del localStorage
 * @returns {string|null} - Token JWT o null si no existe
 */
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

/**
 * Guarda el token en localStorage
 * @param {string} token - Token JWT a guardar
 * @returns {boolean} - true si se guardó correctamente
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('token', token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error guardando token:', error);
    return false;
  }
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si hay un token válido
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Obtener datos del dashboard (ejemplo de ruta protegida)
 * @returns {object} - Datos del dashboard
 */
export const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    throw error.response?.data || { message: 'Error obteniendo datos del dashboard' };
  }
};

// Objeto principal del servicio de autenticación
export const authService = {
  login,
  register,
  verifyToken,
  logout,
  getToken,
  setToken,
  isAuthenticated,
  getDashboard,
};

// Exportación por defecto
export default authService;
