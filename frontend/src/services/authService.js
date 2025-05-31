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
 * Registra un nuevo usuario
 * @param {object} userData - Datos del usuario (nombre, correo, contraseña)
 * @returns {object} - Respuesta del servidor
 */
export const register = async (userData) => {
  try {
    console.log('📝 Registrando usuario:', userData.correo);
    const response = await api.post('/register', userData);
    console.log('✅ Usuario registrado exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error.response?.data || { message: 'Error en el registro' };
  }
};

/**
 * Inicia sesión de usuario
 * @param {object} credentials - Credenciales (correo, contraseña)
 * @returns {object} - Datos del usuario y token
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 Iniciando sesión para:', credentials.correo);
    const response = await api.post('/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('✅ Token guardado exitosamente');
    }
    
    console.log('✅ Login exitoso');
    return response.data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error.response?.data || { message: 'Error en el inicio de sesión' };
  }
};

/**
 * Verifica si el token actual es válido
 * @returns {object} - Datos del usuario si el token es válido
 */
export const verifyToken = async () => {
  try {
    console.log('🔍 Verificando token...');
    const response = await api.get('/verify-token');
    console.log('✅ Token válido');
    return response.data;
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    localStorage.removeItem('token');
    throw error.response?.data || { message: 'Token inválido' };
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  console.log('👋 Cerrando sesión...');
  localStorage.removeItem('token');
  localStorage.removeItem('rememberUser');
  console.log('✅ Sesión cerrada');
};

/**
 * Obtiene el token almacenado
 * @returns {string|null} - Token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - True si hay token, false si no
 */
export const isAuthenticated = () => {
  return !!getToken();
};

// ==================== ENDPOINTS DE DASHBOARD ====================

/**
 * Obtiene el resumen general del dashboard
 * @returns {object} - Datos del resumen
 */
export const getResumen = async () => {
  try {
    console.log('📊 Obteniendo resumen del dashboard...');
    const response = await api.get('/dashboard/resumen');
    console.log('✅ Resumen obtenido exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo resumen del dashboard:', error);
    throw error.response?.data || { message: 'Error obteniendo resumen' };
  }
};

/**
 * Obtiene productos con stock bajo
 * @returns {array} - Lista de productos con stock bajo
 */
export const getStockBajo = async () => {
  try {
    console.log('⚠️ Obteniendo productos con stock bajo...');
    const response = await api.get('/dashboard/stock-bajo');
    console.log('✅ Stock bajo obtenido exitosamente:', response.data.length, 'productos');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo stock bajo:', error);
    // Retornar array vacío en caso de error para evitar crashes
    return [];
  }
};

/**
 * Obtiene las compras recientes
 * @returns {array} - Lista de compras recientes
 */
export const getComprasRecientes = async () => {
  try {
    console.log('🛒 Obteniendo compras recientes...');
    const response = await api.get('/dashboard/compras-recientes');
    console.log('✅ Compras recientes obtenidas exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo compras recientes:', error);
    return [];
  }
};

/**
 * Obtiene las ventas mensuales
 * @returns {array} - Datos de ventas por mes
 */
export const getVentasMensuales = async () => {
  try {
    console.log('📈 Obteniendo ventas mensuales...');
    const response = await api.get('/dashboard/ventas-mensuales');
    console.log('✅ Ventas mensuales obtenidas exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo ventas mensuales:', error);
    return [];
  }
};

/**
 * Obtiene la distribución de stock por categoría
 * @returns {object} - Distribución por categorías
 */
export const getStockDistribucion = async () => {
  try {
    console.log('📊 Obteniendo distribución de stock...');
    const response = await api.get('/dashboard/stock-distribucion');
    console.log('✅ Distribución de stock obtenida exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo distribución de stock:', error);
    return { frutas: 0, verduras: 0, otros: 0 };
  }
};

/**
 * Obtiene los últimos movimientos
 * @returns {array} - Lista de movimientos recientes
 */
export const getUltimosMovimientos = async () => {
  try {
    console.log('📋 Obteniendo últimos movimientos...');
    const response = await api.get('/dashboard/ultimos-movimientos');
    console.log('✅ Últimos movimientos obtenidos exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo últimos movimientos:', error);
    return [];
  }
};

// Objeto principal del servicio de autenticación
export const authService = {
  register,
  login,
  logout,
  verifyToken,
  getToken,
  isAuthenticated,
  getResumen,
  getStockBajo,
  getComprasRecientes,
  getVentasMensuales,
  getStockDistribucion,
  getUltimosMovimientos,
};

// Exportación por defecto
export default authService;