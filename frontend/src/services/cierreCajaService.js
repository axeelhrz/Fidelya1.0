import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('💰 Cierre Caja API_URL configurada:', API_URL);

// Configurar instancia de axios con configuraciones base
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Timeout más largo para operaciones de cierre
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token automáticamente a las peticiones
api.interceptors.request.use(
  (config) => {
    console.log('📤 Enviando petición de cierre de caja a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de cierre de caja recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de cierre de caja:', error);
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Error de CORS o conexión:', error);
      return Promise.reject({
        message: 'Error de conexión. Verifica que el servidor esté funcionando.',
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
    
    if (error.response?.status === 403) {
      return Promise.reject({
        message: 'No tienes permisos para realizar esta acción. Se requiere rol de administrador o cajero.',
        type: 'PERMISSION_ERROR'
      });
    }
    
    return Promise.reject(error);
  }
);

/**
 * Obtiene resumen automático de ventas del día actual
 * @returns {object} - Resumen de ventas y estado del cierre
 */
export const obtenerResumenVentasHoy = async () => {
  try {
    console.log('💰 Obteniendo resumen de ventas del día');
    const response = await api.get('/cierre-caja/hoy');
    console.log('✅ Resumen de ventas obtenido:', response.data.resumen_ventas?.total_ventas || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo resumen de ventas:', error);
    throw error.response?.data || { message: 'Error obteniendo resumen de ventas del día' };
  }
};

/**
 * Registra el cierre de caja diario
 * @param {object} datoscierre - Datos del cierre de caja
 * @returns {object} - Respuesta del servidor con el cierre registrado
 */
export const registrarCierreCaja = async (datosCierre) => {
  try {
    console.log('💰 Registrando cierre de caja:', datosCierre);
    const response = await api.post('/cierre-caja/registrar', datosCierre);
    console.log('✅ Cierre de caja registrado:', response.data.cierre?.id);
    return response.data;
  } catch (error) {
    console.error('❌ Error registrando cierre de caja:', error);
    throw error.response?.data || { message: 'Error registrando cierre de caja' };
  }
};

/**
 * Obtiene historial de cierres de caja
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de cierres anteriores
 */
export const obtenerHistorialCierres = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros.limite) {
      params.append('limite', filtros.limite);
    }
    
    const url = `/cierre-caja/historial${params.toString() ? '?' + params.toString() : ''}`;
    console.log('💰 Obteniendo historial de cierres:', url);
    
    const response = await api.get(url);
    console.log('✅ Historial de cierres obtenido:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo historial de cierres:', error);
    // Devolver array vacío en caso de error
    console.log('🔄 Devolviendo lista vacía de cierres como fallback');
    return [];
  }
};

/**
 * Obtiene detalle de un cierre específico
 * @param {number} cierreId - ID del cierre
 * @returns {object} - Detalle completo del cierre
 */
export const obtenerDetalleCierre = async (cierreId) => {
  try {
    console.log('💰 Obteniendo detalle de cierre:', cierreId);
    const response = await api.get(`/cierre-caja/detalle/${cierreId}`);
    console.log('✅ Detalle de cierre obtenido:', response.data.fecha_cierre);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo detalle de cierre:', error);
    throw error.response?.data || { message: 'Error obteniendo detalle del cierre' };
  }
};

/**
 * Exporta un cierre en formato PDF
 * @param {number} cierreId - ID del cierre a exportar
 * @returns {object} - Información de la exportación
 */
export const exportarCierrePDF = async (cierreId) => {
  try {
    console.log('📤 Exportando cierre a PDF:', cierreId);
    const response = await api.post(`/cierre-caja/exportar-pdf/${cierreId}`);
    console.log('✅ Cierre exportado a PDF:', response.data.nombre_archivo);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando cierre a PDF:', error);
    throw error.response?.data || { message: 'Error exportando cierre a PDF' };
  }
};

/**
 * Valida si el usuario tiene permisos para cierre de caja
 * @returns {boolean} - true si tiene permisos
 */
export const validarPermisosCierreCaja = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const rolesPermitidos = ['admin', 'cajero'];
    return rolesPermitidos.includes(user.rol);
  } catch (error) {
    console.error('Error validando permisos:', error);
    return false;
  }
};

/**
 * Calcula el estado de la diferencia de caja
 * @param {number} diferencia - Diferencia entre esperado y contado
 * @returns {object} - Estado y color de la diferencia
 */
export const calcularEstadoDiferencia = (diferencia) => {
  if (diferencia === 0) {
    return {
      estado: 'correcto',
      color: 'success',
      icono: 'CheckCircle',
      mensaje: 'Caja correcta'
    };
  } else if (diferencia < 0) {
    return {
      estado: 'faltante',
      color: 'error',
      icono: 'Warning',
      mensaje: `Faltante: $${Math.abs(diferencia).toFixed(2)}`
    };
  } else {
    return {
      estado: 'sobrante',
      color: 'info',
      icono: 'Info',
      mensaje: `Sobrante: $${diferencia.toFixed(2)}`
    };
  }
};

/**
 * Formatea la fecha para mostrar en la interfaz
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export const formatearFechaCierre = (fecha) => {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return fecha;
  }
};

/**
 * Formatea la hora para mostrar en la interfaz
 * @param {string} fecha - Fecha/hora en formato ISO
 * @returns {string} - Hora formateada
 */
export const formatearHoraCierre = (fecha) => {
  try {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-UY', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formateando hora:', error);
    return fecha;
  }
};

// Objeto principal del servicio de cierre de caja
const cierreCajaService = {
  obtenerResumenVentasHoy,
  registrarCierreCaja,
  obtenerHistorialCierres,
  obtenerDetalleCierre,
  exportarCierrePDF,
  validarPermisosCierreCaja,
  calcularEstadoDiferencia,
  formatearFechaCierre,
  formatearHoraCierre,
};

// Exportación por defecto
export default cierreCajaService;