import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;
console.log('🔔 Notification API_URL configurada:', API_URL);

// Cache local para notificaciones
class NotificationCache {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.lastUpdate = Date.now();
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
    this.lastUpdate = null;
  }

  isStale() {
    if (!this.lastUpdate) return true;
    return Date.now() - this.lastUpdate > this.cacheDuration;
  }

  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new NotificationCache();

// Configurar instancia de axios con retry automático
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Función de retry automático
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Solo reintentar en errores de red o 5xx
      if (error.code === 'ERR_NETWORK' || 
          (error.response && error.response.status >= 500)) {
        console.log(`🔄 Reintentando petición (${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
};

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
      cache.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Eventos para notificaciones en tiempo real
class NotificationEventManager {
  constructor() {
    this.listeners = new Set();
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    this.startEventSource();
    
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.stopEventSource();
      }
    };
  }

  startEventSource() {
    if (this.eventSource) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      this.eventSource = new EventSource(`${API_URL}/notificaciones/stream?token=${token}`);
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
          cache.invalidate('notificaciones');
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      this.eventSource.onerror = () => {
        console.error('SSE connection error');
        this.handleReconnect();
      };

      this.eventSource.onopen = () => {
        console.log('SSE connection established');
        this.reconnectAttempts = 0;
      };
    } catch (error) {
      console.error('Error creating EventSource:', error);
    }
  }

  stopEventSource() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  handleReconnect() {
    this.stopEventSource();
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      
      setTimeout(() => {
        if (this.listeners.size > 0) {
          this.startEventSource();
        }
      }, delay);
    }
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }
}

const eventManager = new NotificationEventManager();

/**
 * Obtener todas las notificaciones del usuario con cache inteligente
 * @param {object} filtros - Filtros opcionales
 * @param {boolean} forceRefresh - Forzar actualización desde servidor
 * @returns {array} - Lista de notificaciones
 */
export const obtenerNotificaciones = async (filtros = {}, forceRefresh = false) => {
  try {
    console.log('🔔 Obteniendo notificaciones con filtros:', filtros);
    
    const cacheKey = `notificaciones_${JSON.stringify(filtros)}`;
    
    // Verificar cache si no se fuerza refresh
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('✅ Notificaciones obtenidas desde cache');
        return cached;
      }
    }
    
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.leida !== undefined) params.append('leida', filtros.leida);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros.limite) params.append('limite', filtros.limite);
    if (filtros.pagina) params.append('pagina', filtros.pagina);
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
    if (filtros.orden) params.append('orden', filtros.orden);
    
    const response = await retryRequest(async () => {
      return await api.get(`/notificaciones?${params.toString()}`);
    });
    
    const data = response.data;
    
    // Guardar en cache
    cache.set(cacheKey, data);
    
    console.log('✅ Notificaciones obtenidas:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    
    // Intentar devolver datos del cache en caso de error
    const cacheKey = `notificaciones_${JSON.stringify(filtros)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('⚠️ Devolviendo datos del cache debido a error');
      return cached;
    }
    
    return [];
  }
};

/**
 * Contar notificaciones no leídas con cache
 * @returns {number} - Cantidad de notificaciones no leídas
 */
export const contarNoLeidas = async () => {
  try {
    console.log('🔔 Contando notificaciones no leídas');
    
    const cacheKey = 'count_no_leidas';
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }
    
    const response = await retryRequest(async () => {
      return await api.get('/notificaciones/no-leidas');
    });
    
    const count = response.data.count;
    cache.set(cacheKey, count);
    
    console.log('✅ Notificaciones no leídas:', count);
    return count;
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
    
    await retryRequest(async () => {
      return await api.post('/notificaciones/marcar-leidas', data);
    });
    
    // Invalidar cache relacionado
    cache.invalidate('notificaciones');
    cache.invalidate('count_no_leidas');
    
    console.log('✅ Notificaciones marcadas como leídas');
    return true;
  } catch (error) {
    console.error('❌ Error marcando notificaciones como leídas:', error);
    throw error.response?.data || { message: 'Error marcando notificaciones como leídas' };
  }
};

/**
 * Archivar notificaciones
 * @param {array} notificacionIds - IDs de notificaciones a archivar
 * @returns {boolean} - Éxito de la operación
 */
export const archivarNotificaciones = async (notificacionIds) => {
  try {
    console.log('📁 Archivando notificaciones:', notificacionIds);
    
    await retryRequest(async () => {
      return await api.post('/notificaciones/archivar', { notificacion_ids: notificacionIds });
    });
    
    cache.invalidate('notificaciones');
    
    console.log('✅ Notificaciones archivadas');
    return true;
  } catch (error) {
    console.error('❌ Error archivando notificaciones:', error);
    throw error.response?.data || { message: 'Error archivando notificaciones' };
  }
};

/**
 * Eliminar notificaciones
 * @param {array} notificacionIds - IDs de notificaciones a eliminar
 * @returns {boolean} - Éxito de la operación
 */
export const eliminarNotificaciones = async (notificacionIds) => {
  try {
    console.log('🗑️ Eliminando notificaciones:', notificacionIds);
    
    await retryRequest(async () => {
      return await api.delete('/notificaciones/eliminar', { 
        data: { notificacion_ids: notificacionIds } 
      });
    });
    
    cache.invalidate('notificaciones');
    cache.invalidate('count_no_leidas');
    
    console.log('✅ Notificaciones eliminadas');
    return true;
  } catch (error) {
    console.error('❌ Error eliminando notificaciones:', error);
    throw error.response?.data || { message: 'Error eliminando notificaciones' };
  }
};

/**
 * Marcar/desmarcar notificación como destacada
 * @param {string} notificacionId - ID de la notificación
 * @param {boolean} destacada - Si debe estar destacada
 * @returns {boolean} - Éxito de la operación
 */
export const toggleDestacada = async (notificacionId, destacada) => {
  try {
    console.log('⭐ Cambiando estado destacado:', notificacionId, destacada);
    
    await retryRequest(async () => {
      return await api.patch(`/notificaciones/${notificacionId}/destacar`, { destacada });
    });
    
    cache.invalidate('notificaciones');
    
    console.log('✅ Estado destacado actualizado');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando estado destacado:', error);
    throw error.response?.data || { message: 'Error actualizando estado destacado' };
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
    
    await retryRequest(async () => {
      return await api.post('/notificaciones/enviar-email', {
        destinatario,
        asunto,
        mensaje
      });
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
    
    await retryRequest(async () => {
      return await api.post('/notificaciones/enviar-sms', {
        telefono,
        mensaje
      });
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
    
    const cacheKey = 'configuracion_notificaciones';
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await retryRequest(async () => {
      return await api.get('/notificaciones/configuracion');
    });
    
    const config = response.data;
    cache.set(cacheKey, config);
    
    console.log('✅ Configuración obtenida:', config);
    return config;
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    return {
      recibir_email: true,
      recibir_sms: false,
      telefono: '',
      frecuencia: 'inmediata',
      tipos_habilitados: ['stock', 'pago', 'cobro', 'sistema'],
      horario_silencioso: {
        habilitado: false,
        inicio: '22:00',
        fin: '08:00'
      }
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
    
    await retryRequest(async () => {
      return await api.put('/notificaciones/configuracion', configuracion);
    });
    
    // Invalidar cache de configuración
    cache.invalidate('configuracion_notificaciones');
    
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
    
    const response = await retryRequest(async () => {
      return await api.post('/notificaciones/verificar-alertas');
    });
    
    // Invalidar cache para forzar actualización
    cache.invalidate('notificaciones');
    cache.invalidate('count_no_leidas');
    
    console.log('✅ Alertas verificadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error verificando alertas:', error);
    throw error.response?.data || { message: 'Error verificando alertas' };
  }
};

/**
 * Obtener estadísticas de notificaciones
 * @param {object} filtros - Filtros de fecha
 * @returns {object} - Estadísticas
 */
export const obtenerEstadisticas = async (filtros = {}) => {
  try {
    console.log('📊 Obteniendo estadísticas de notificaciones');
    
    const params = new URLSearchParams();
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    
    const response = await retryRequest(async () => {
      return await api.get(`/notificaciones/estadisticas?${params.toString()}`);
    });
    
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return {
      total: 0,
      por_tipo: {},
      por_prioridad: {},
      tendencia: []
    };
  }
};

/**
 * Suscribirse a notificaciones en tiempo real
 * @param {function} callback - Función a llamar cuando llegue una notificación
 * @returns {function} - Función para cancelar la suscripción
 */
export const suscribirseNotificaciones = (callback) => {
  return eventManager.subscribe(callback);
};

/**
 * Limpiar cache de notificaciones
 */
export const limpiarCache = () => {
  cache.clear();
  console.log('🧹 Cache de notificaciones limpiado');
};

/**
 * Obtener estado del cache
 * @returns {object} - Estado del cache
 */
export const obtenerEstadoCache = () => {
  return {
    size: cache.cache.size,
    lastUpdate: cache.lastUpdate,
    isStale: cache.isStale()
  };
};

// Objeto principal del servicio de notificaciones
const notificationService = {
  obtenerNotificaciones,
  contarNoLeidas,
  marcarComoLeidas,
  archivarNotificaciones,
  eliminarNotificaciones,
  toggleDestacada,
  enviarEmail,
  enviarSMS,
  obtenerConfiguracion,
  actualizarConfiguracion,
  verificarAlertas,
  obtenerEstadisticas,
  suscribirseNotificaciones,
  limpiarCache,
  obtenerEstadoCache,
};

export default notificationService;