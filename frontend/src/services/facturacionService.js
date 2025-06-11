import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('🧾 Facturación API_URL configurada:', API_URL);

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
    console.log('📤 Enviando petición de facturación a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de facturación recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de facturación:', error);
    
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
 * Obtiene el último número de factura correlativo
 * @returns {object} - Información del último número
 */
export const obtenerUltimoNumero = async () => {
  try {
    console.log('🧾 Obteniendo último número de factura');
    const response = await api.get('/facturas/ultimo-numero');
    console.log('✅ Último número obtenido:', response.data.siguiente_numero);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo último número:', error);
    // Devolver número por defecto en caso de error
    return {
      ultimo_numero: 'FCT-000000',
      siguiente_numero: 'FCT-000001'
    };
  }
};

/**
 * Crea una nueva factura
 * @param {object} facturaData - Datos de la factura
 * @returns {object} - Respuesta del servidor
 */
export const crearFactura = async (facturaData) => {
  try {
    console.log('🧾 Creando factura:', facturaData);
    
    // Validar datos requeridos
    if (!facturaData.cliente_nombre || !facturaData.productos || facturaData.productos.length === 0) {
      throw new Error('Faltan datos requeridos para crear la factura');
    }
    
    // Calcular totales si no están presentes
    if (!facturaData.subtotal || !facturaData.total) {
      const subtotal = facturaData.productos.reduce((sum, producto) => 
        sum + (parseFloat(producto.cantidad) * parseFloat(producto.precio_unitario)), 0
      );
      const iva = subtotal * 0.22; // IVA 22% Uruguay
      const total = subtotal + iva;
      
      facturaData.subtotal = subtotal;
      facturaData.iva = iva;
      facturaData.total = total;
    }
    
    const response = await api.post('/facturas/crear', facturaData);
    console.log('✅ Factura creada:', response.data.factura?.nro_factura);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando factura:', error);
    throw error.response?.data || { message: 'Error creando factura' };
  }
};

/**
 * Obtiene el historial de facturas con filtros opcionales
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de facturas
 */
export const obtenerHistorialFacturas = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros.cliente) {
      params.append('cliente', filtros.cliente);
    }
    if (filtros.numero) {
      params.append('numero', filtros.numero);
    }
    if (filtros.limite) {
      params.append('limite', filtros.limite);
    }
    
    const url = `/facturas/historial${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🧾 Obteniendo historial de facturas:', url);
    
    const response = await api.get(url);
    console.log('✅ Historial obtenido:', response.data.length, 'facturas');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    // Devolver array vacío en caso de error
    console.log('🔄 Devolviendo lista vacía de facturas como fallback');
    return [];
  }
};

/**
 * Obtiene el detalle completo de una factura específica
 * @param {number} facturaId - ID de la factura
 * @returns {object} - Datos completos de la factura
 */
export const obtenerDetalleFactura = async (facturaId) => {
  try {
    console.log('🧾 Obteniendo detalle de factura:', facturaId);
    const response = await api.get(`/facturas/${facturaId}`);
    console.log('✅ Detalle obtenido:', response.data.nro_factura);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo detalle de factura:', error);
    throw error.response?.data || { message: 'Error obteniendo detalle de factura' };
  }
};

/**
 * Exporta una factura a PDF
 * @param {number} facturaId - ID de la factura
 * @returns {object} - Información del archivo generado
 */
export const exportarFacturaPDF = async (facturaId) => {
  try {
    console.log('🧾 Exportando factura a PDF:', facturaId);
    const response = await api.post(`/facturas/exportar/${facturaId}`);
    console.log('✅ PDF generado:', response.data.nombre_archivo);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando PDF:', error);
    throw error.response?.data || { message: 'Error exportando factura a PDF' };
  }
};

/**
 * Valida los datos de una factura antes de crearla
 * @param {object} facturaData - Datos de la factura
 * @returns {object} - Resultado de la validación
 */
export const validarFactura = (facturaData) => {
  const errores = [];
  
  // Validar cliente
  if (!facturaData.cliente_nombre || facturaData.cliente_nombre.trim() === '') {
    errores.push('El nombre del cliente es requerido');
  }
  
  // Validar productos
  if (!facturaData.productos || facturaData.productos.length === 0) {
    errores.push('Debe incluir al menos un producto');
  } else {
    facturaData.productos.forEach((producto, index) => {
      if (!producto.nombre || producto.nombre.trim() === '') {
        errores.push(`El producto ${index + 1} debe tener un nombre`);
      }
      if (!producto.cantidad || parseFloat(producto.cantidad) <= 0) {
        errores.push(`El producto ${index + 1} debe tener una cantidad válida`);
      }
      if (!producto.precio_unitario || parseFloat(producto.precio_unitario) <= 0) {
        errores.push(`El producto ${index + 1} debe tener un precio válido`);
      }
    });
  }
  
  return {
    valida: errores.length === 0,
    errores: errores
  };
};

/**
 * Calcula los totales de una factura
 * @param {array} productos - Lista de productos
 * @returns {object} - Totales calculados
 */
export const calcularTotales = (productos) => {
  if (!productos || productos.length === 0) {
    return {
      subtotal: 0,
      iva: 0,
      total: 0
    };
  }
  
  const subtotal = productos.reduce((sum, producto) => {
    const cantidad = parseFloat(producto.cantidad) || 0;
    const precio = parseFloat(producto.precio_unitario) || 0;
    return sum + (cantidad * precio);
  }, 0);
  
  const iva = subtotal * 0.22; // IVA 22% Uruguay
  const total = subtotal + iva;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

/**
 * Formatea un número de factura para mostrar
 * @param {string} numero - Número de factura
 * @returns {string} - Número formateado
 */
export const formatearNumeroFactura = (numero) => {
  if (!numero) return 'N/A';
  
  // Si ya tiene el formato FCT-XXXXXX, devolverlo tal como está
  if (numero.startsWith('FCT-')) {
    return numero;
  }
  
  // Si es solo un número, agregar el prefijo
  const numeroLimpio = numero.toString().padStart(6, '0');
  return `FCT-${numeroLimpio}`;
};

/**
 * Obtiene estadísticas de facturación
 * @param {object} filtros - Filtros para las estadísticas
 * @returns {object} - Estadísticas calculadas
 */
export const obtenerEstadisticasFacturacion = async (filtros = {}) => {
  try {
    console.log('📊 Obteniendo estadísticas de facturación');
    
    // Obtener facturas del período
    const facturas = await obtenerHistorialFacturas(filtros);
    
    const estadisticas = {
      total_facturas: facturas.length,
      total_facturado: facturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0),
      promedio_factura: 0,
      facturas_hoy: 0,
      facturado_hoy: 0,
      cliente_mas_frecuente: 'N/A'
    };
    
    if (estadisticas.total_facturas > 0) {
      estadisticas.promedio_factura = estadisticas.total_facturado / estadisticas.total_facturas;
    }
    
    // Facturas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const facturasHoy = facturas.filter(f => f.fecha && f.fecha.startsWith(hoy));
    estadisticas.facturas_hoy = facturasHoy.length;
    estadisticas.facturado_hoy = facturasHoy.reduce((sum, f) => sum + parseFloat(f.total || 0), 0);
    
    // Cliente más frecuente
    const clientesFrecuencia = {};
    facturas.forEach(f => {
      const cliente = f.cliente_nombre || 'Sin nombre';
      clientesFrecuencia[cliente] = (clientesFrecuencia[cliente] || 0) + 1;
    });
    
    let clienteMasFrecuente = 'N/A';
    let maxFrecuencia = 0;
    Object.entries(clientesFrecuencia).forEach(([cliente, frecuencia]) => {
      if (frecuencia > maxFrecuencia) {
        maxFrecuencia = frecuencia;
        clienteMasFrecuente = cliente;
      }
    });
    estadisticas.cliente_mas_frecuente = clienteMasFrecuente;
    
    console.log('✅ Estadísticas calculadas:', estadisticas);
    return estadisticas;
  } catch (error) {
    console.error('❌ Error calculando estadísticas:', error);
    return {
      total_facturas: 0,
      total_facturado: 0,
      promedio_factura: 0,
      facturas_hoy: 0,
      facturado_hoy: 0,
      cliente_mas_frecuente: 'N/A'
    };
  }
};

// Objeto principal del servicio de facturación
export const facturacionService = {
  obtenerUltimoNumero,
  crearFactura,
  obtenerHistorialFacturas,
  obtenerDetalleFactura,
  exportarFacturaPDF,
  validarFactura,
  calcularTotales,
  formatearNumeroFactura,
  obtenerEstadisticasFacturacion,
};

// Exportación por defecto
export default facturacionService;