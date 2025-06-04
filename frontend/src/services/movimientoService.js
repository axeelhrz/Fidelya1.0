import axios from 'axios';
import config from '../config/config';

const API_URL = config.API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
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
 * Obtiene movimientos de stock con filtros
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de movimientos
 */
export const obtenerMovimientos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.producto_id) params.append('producto_id', filtros.producto_id);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const response = await api.get(`/movimientos?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo movimientos:', error);
    return [];
  }
};

/**
 * Registra un nuevo movimiento de stock
 * @param {object} movimiento - Datos del movimiento
 * @returns {object} - Respuesta del servidor
 */
export const registrarMovimiento = async (movimiento) => {
  try {
    const response = await api.post('/stock/movimiento', movimiento);
    return response.data;
  } catch (error) {
    console.error('Error registrando movimiento:', error);
    throw error.response?.data || { message: 'Error registrando movimiento' };
  }
};

/**
 * Obtiene resumen de movimientos por período
 * @param {string} periodo - Período de consulta (dia, semana, mes)
 * @returns {object} - Resumen de movimientos
 */
export const obtenerResumenMovimientos = async (periodo = 'mes') => {
  try {
    const fechaFin = new Date();
    let fechaInicio = new Date();
    
    switch (periodo) {
      case 'dia':
        fechaInicio.setDate(fechaFin.getDate() - 1);
        break;
      case 'semana':
        fechaInicio.setDate(fechaFin.getDate() - 7);
        break;
      case 'mes':
      default:
        fechaInicio.setMonth(fechaFin.getMonth() - 1);
        break;
    }
    
    const movimientos = await obtenerMovimientos({
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0],
      limit: 1000
    });
    
    // Procesar datos para resumen
    const resumen = {
      total_movimientos: movimientos.length,
      ingresos: movimientos.filter(m => m.tipo === 'ingreso').length,
      egresos: movimientos.filter(m => m.tipo === 'egreso').length,
      ajustes: movimientos.filter(m => m.tipo === 'ajuste').length,
      productos_afectados: [...new Set(movimientos.map(m => m.producto_nombre))].length
    };
    
    return resumen;
  } catch (error) {
    console.error('Error obteniendo resumen de movimientos:', error);
    return {
      total_movimientos: 0,
      ingresos: 0,
      egresos: 0,
      ajustes: 0,
      productos_afectados: 0
    };
  }
};

const movimientoService = {
  obtenerMovimientos,
  registrarMovimiento,
  obtenerResumenMovimientos,
};

export default movimientoService;