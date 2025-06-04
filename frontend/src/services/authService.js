import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;
console.log('🔗 API_URL configurada:', API_URL);

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
 * Inicia sesión de usuario
 * @param {string} correo - Correo electrónico
 * @param {string} contraseña - Contraseña sin hashear
 * @returns {object} - { token, user: { id, nombre, correo, rol }, message }
 */
export const login = async (correo, contraseña) => {
  try {
    console.log('🔐 Intentando login...');
    const response = await api.post('/login', {
      correo: correo.trim().toLowerCase(),
      contraseña,
    });
    console.log('✅ Respuesta de login:', response.data);
    
    if (!response.data.token || !response.data.user) {
      throw new Error('Respuesta del servidor inválida');
  }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
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
    console.log('📝 Intentando registro...');
    const response = await api.post('/register', {
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      contraseña,
    });
    console.log('✅ Respuesta de registro:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en registro:', error);
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: 'Error de conexión. Verifica que el servidor esté funcionando en puerto 5001.' };
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
    
    console.log('🔍 Verificando token...');
    // Cambiar de GET a POST para coincidir con el backend
    const response = await api.post('/verify-token');
    return response.data;
  } catch (error) {
    console.error('❌ Error verificando token:', error);
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

// MÉTODOS PARA EL DASHBOARD

/**
 * Obtiene resumen general del dashboard
 */
export const getDashboardResumen = async () => {
  try {
    const response = await api.get('/dashboard/resumen');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo resumen del dashboard:', error);
    throw error.response?.data || { message: 'Error obteniendo resumen del dashboard' };
  }
};

/**
 * Obtiene productos con stock bajo
 */
export const getStockBajo = async () => {
  try {
    const response = await api.get('/dashboard/stock-bajo');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo stock bajo:', error);
    // Retornar array vacío en caso de error para evitar crashes
    return [];
  }
};

/**
 * Obtiene compras recientes
 */
export const getComprasRecientes = async () => {
  try {
    const response = await api.get('/dashboard/compras-recientes');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo compras recientes:', error);
    return [];
  }
};

/**
 * Obtiene ventas mensuales
 */
export const getVentasMensuales = async () => {
  try {
    const response = await api.get('/dashboard/ventas-mensuales');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo ventas mensuales:', error);
    return [];
  }
};

/**
 * Obtiene distribución de stock
 */
export const getStockDistribucion = async () => {
  try {
    const response = await api.get('/dashboard/stock-distribucion');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo distribución de stock:', error);
    return { frutas: 0, verduras: 0, otros: 0 };
  }
};

/**
 * Obtiene últimos movimientos
 */
export const getUltimosMovimientos = async () => {
  try {
    const response = await api.get('/dashboard/ultimos-movimientos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo últimos movimientos:', error);
    return [];
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
  getDashboardResumen,
  getStockBajo,
  getComprasRecientes,
  getVentasMensuales,
  getStockDistribucion,
  getUltimosMovimientos,
};

// Exportación por defecto
export default authService;
