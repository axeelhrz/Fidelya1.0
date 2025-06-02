import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;
console.log('🔔 Notification API_URL configurada:', API_URL);

// Configurar instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    console.log('📤 Enviando petición de notificaciones a:', config.baseURL + config.url);
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

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('📥 Respuesta de notificaciones recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de notificaciones:', error);
    
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
 * Obtener todas las notificaciones del usuario
 * @param {object} filtros - Filtros opcionales
 * @returns {array} - Lista de notificaciones
 */
export const obtenerNotificaciones = async (filtros = {}) => {
  try {
    console.log('🔔 Obteniendo notificaciones con filtros:', filtros);
    
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.leida !== undefined) params.append('leida', filtros.leida);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros.limite) params.append('limite', filtros.limite);
    
    const response = await api.get(`/notificaciones?${params.toString()}`);
    console.log('✅ Notificaciones obtenidas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    return [];
  }
};

/**
 * Contar notificaciones no leídas
 * @returns {number} - Cantidad de notificaciones no leídas
 */
export const contarNoLeidas = async () => {
  try {
    console.log('🔔 Contando notificaciones no leídas');
    const response = await api.get('/notificaciones/no-leidas');
    console.log('✅ Notificaciones no leídas:', response.data.count);
    return response.data.count;
  } catch (error) {
    console.error('❌ Error contando notificaciones no leídas:', error);
    return 0;
  }
};

/**
 * Marcar notificaciones como leídas
 * @param {array} notificacionIds - IDs de notificaciones a marcar (opcional)
 * @returns {boolean} - Éxito de la operación
 */
export const marcarComoLeidas = async (notificacionIds = null) => {
  try {
    console.log('🔔 Marcando notificaciones como leídas:', notificacionIds);
    
    const data = notificacionIds ? { notificacion_ids: notificacionIds } : {};
    const response = await api.post('/notificaciones/marcar-leidas', data);
    
    console.log('✅ Notificaciones marcadas como leídas');
    return true;
  } catch (error) {
    console.error('❌ Error marcando notificaciones como leídas:', error);
    throw error.response?.data || { message: 'Error marcando notificaciones como leídas' };
  }
};

/**
 * Enviar notificación por email
 * @param {string} destinatario - Email del destinatario
 * @param {string} asunto - Asunto del email
 * @param {string} mensaje - Mensaje del email
 * @returns {boolean} - Éxito del envío
 */
export const enviarEmail = async (destinatario, asunto, mensaje) => {
  try {
    console.log('📧 Enviando email a:', destinatario);
    
    const response = await api.post('/notificaciones/enviar-email', {
      destinatario,
      asunto,
      mensaje
    });
    
    console.log('✅ Email enviado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error.response?.data || { message: 'Error enviando email' };
  }
};

/**
 * Enviar notificación por SMS
 * @param {string} telefono - Número de teléfono
 * @param {string} mensaje - Mensaje del SMS
 * @returns {boolean} - Éxito del envío
 */
export const enviarSMS = async (telefono, mensaje) => {
  try {
    console.log('📱 Enviando SMS a:', telefono);
    
    const response = await api.post('/notificaciones/enviar-sms', {
      telefono,
      mensaje
    });
    
    console.log('✅ SMS enviado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error enviando SMS:', error);
    throw error.response?.data || { message: 'Error enviando SMS' };
  }
};

/**
 * Obtener configuración de notificaciones
 * @returns {object} - Configuración del usuario
 */
export const obtenerConfiguracion = async () => {
  try {
    console.log('⚙️ Obteniendo configuración de notificaciones');
    const response = await api.get('/notificaciones/configuracion');
    console.log('✅ Configuración obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    return {
      recibir_email: true,
      recibir_sms: false,
      telefono: '',
      frecuencia: 'inmediata'
    };
  }
};

/**
 * Actualizar configuración de notificaciones
 * @param {object} configuracion - Nueva configuración
 * @returns {boolean} - Éxito de la actualización
 */
export const actualizarConfiguracion = async (configuracion) => {
  try {
    console.log('⚙️ Actualizando configuración de notificaciones:', configuracion);
    
    const response = await api.put('/notificaciones/configuracion', configuracion);
    console.log('✅ Configuración actualizada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando configuración:', error);
    throw error.response?.data || { message: 'Error actualizando configuración' };
  }
};

/**
 * Verificar alertas automáticas del sistema
 * @returns {object} - Resultado de la verificación
 */
export const verificarAlertas = async () => {
  try {
    console.log('🔍 Verificando alertas del sistema');
    const response = await api.post('/notificaciones/verificar-alertas');
    console.log('✅ Alertas verificadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error verificando alertas:', error);
    throw error.response?.data || { message: 'Error verificando alertas' };
  }
};

// Objeto principal del servicio de notificaciones
const notificationService = {
  obtenerNotificaciones,
  contarNoLeidas,
  marcarComoLeidas,
  enviarEmail,
  enviarSMS,
  obtenerConfiguracion,
  actualizarConfiguracion,
  verificarAlertas,
};

export default notificationService;