import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('⚙️ Configuración API_URL configurada:', API_URL);

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
    console.log('📤 Enviando petición de configuración a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de configuración recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de configuración:', error);
    
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
 * Obtiene la configuración general del sistema
 * @returns {object} - Configuración del sistema
 */
export const obtenerConfiguracion = async () => {
  try {
    console.log('⚙️ Obteniendo configuración del sistema');
    const response = await api.get('/configuracion');
    console.log('✅ Configuración obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    throw error.response?.data || { message: 'Error obteniendo configuración' };
  }
};

/**
 * Actualiza la configuración general del sistema
 * @param {object} configuracion - Datos de configuración
 * @returns {object} - Respuesta del servidor
 */
export const actualizarConfiguracion = async (configuracion) => {
  try {
    console.log('⚙️ Actualizando configuración del sistema:', configuracion);
    const response = await api.put('/configuracion', configuracion);
    console.log('✅ Configuración actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando configuración:', error);
    throw error.response?.data || { message: 'Error actualizando configuración' };
  }
};

/**
 * Obtiene categorías por tipo
 * @param {string} tipo - Tipo de categoría ('producto' o 'gasto')
 * @returns {array} - Lista de categorías
 */
export const obtenerCategorias = async (tipo = null) => {
  try {
    console.log('📂 Obteniendo categorías, tipo:', tipo);
    const params = tipo ? `?tipo=${tipo}` : '';
    const response = await api.get(`/categorias${params}`);
    console.log('✅ Categorías obtenidas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error);
    return [];
  }
};

/**
 * Crea una nueva categoría
 * @param {object} categoria - Datos de la categoría
 * @returns {object} - Respuesta del servidor
 */
export const crearCategoria = async (categoria) => {
  try {
    console.log('📂 Creando categoría:', categoria.nombre);
    const response = await api.post('/categorias', categoria);
    console.log('✅ Categoría creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando categoría:', error);
    throw error.response?.data || { message: 'Error creando categoría' };
  }
};

/**
 * Actualiza una categoría existente
 * @param {number} id - ID de la categoría
 * @param {object} categoria - Datos actualizados de la categoría
 * @returns {object} - Respuesta del servidor
 */
export const actualizarCategoria = async (id, categoria) => {
  try {
    console.log('📂 Actualizando categoría:', id);
    const response = await api.put(`/categorias/${id}`, categoria);
    console.log('✅ Categoría actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando categoría:', error);
    throw error.response?.data || { message: 'Error actualizando categoría' };
  }
};

/**
 * Elimina una categoría
 * @param {number} id - ID de la categoría
 * @returns {object} - Respuesta del servidor
 */
export const eliminarCategoria = async (id) => {
  try {
    console.log('📂 Eliminando categoría:', id);
    const response = await api.delete(`/categorias/${id}`);
    console.log('✅ Categoría eliminada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando categoría:', error);
    throw error.response?.data || { message: 'Error eliminando categoría' };
  }
};

/**
 * Obtiene lista de usuarios
 * @returns {array} - Lista de usuarios
 */
export const obtenerUsuarios = async () => {
  try {
    console.log('👥 Obteniendo usuarios');
    const response = await api.get('/usuarios');
    console.log('✅ Usuarios obtenidos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    return [];
  }
};

/**
 * Cambia el rol de un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {string} nuevoRol - Nuevo rol del usuario
 * @returns {object} - Respuesta del servidor
 */
export const cambiarRolUsuario = async (usuarioId, nuevoRol) => {
  try {
    console.log('👥 Cambiando rol de usuario:', usuarioId, 'a', nuevoRol);
    const response = await api.put(`/usuarios/${usuarioId}/rol`, { rol: nuevoRol });
    console.log('✅ Rol de usuario cambiado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error cambiando rol de usuario:', error);
    throw error.response?.data || { message: 'Error cambiando rol de usuario' };
  }
};

/**
 * Activa o desactiva un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {boolean} activo - Estado activo del usuario
 * @returns {object} - Respuesta del servidor
 */
export const activarDesactivarUsuario = async (usuarioId, activo) => {
  try {
    console.log('👥 Cambiando estado de usuario:', usuarioId, 'a', activo ? 'activo' : 'inactivo');
    const response = await api.put(`/usuarios/${usuarioId}/activar`, { activo });
    console.log('✅ Estado de usuario cambiado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error cambiando estado de usuario:', error);
    throw error.response?.data || { message: 'Error cambiando estado de usuario' };
  }
};

/**
 * Resetea la contraseña de un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {string} nuevaPassword - Nueva contraseña
 * @returns {object} - Respuesta del servidor
 */
export const resetearPasswordUsuario = async (usuarioId, nuevaPassword) => {
  try {
    console.log('👥 Reseteando contraseña de usuario:', usuarioId);
    const response = await api.put(`/usuarios/${usuarioId}/reset-password`, { 
      nueva_password: nuevaPassword 
    });
    console.log('✅ Contraseña reseteada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error reseteando contraseña:', error);
    throw error.response?.data || { message: 'Error reseteando contraseña' };
  }
};

// Objeto principal del servicio de configuración
const configuracionService = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerUsuarios,
  cambiarRolUsuario,
  activarDesactivarUsuario,
  resetearPasswordUsuario,
};

// Exportación por defecto
export default configuracionService;