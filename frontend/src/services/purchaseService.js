import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('🛒 Purchase API_URL configurada:', API_URL);

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
    console.log('📤 Enviando petición de compras a:', config.baseURL + config.url);
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
    console.log('📥 Respuesta de compras recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de compras:', error);
    
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
 * Transforma y valida los datos de compra del backend
 * @param {object} compra - Datos de compra del backend
 * @returns {object} - Datos de compra transformados
 */
const transformarCompra = (compra) => {
  if (!compra) return null;
  
  return {
    id: compra.id || 'N/A',
    proveedor_id: compra.proveedor_id || compra.proveedor?.id || null,
    proveedor_nombre: compra.proveedor_nombre || compra.proveedor?.nombre || 'Sin proveedor',
    fecha: compra.fecha || new Date().toISOString(),
    numero_comprobante: compra.numero_comprobante || `COMP-${String(compra.id || Math.random()).padStart(6, '0')}`,
    metodo_pago: compra.metodo_pago || 'efectivo',
    total: parseFloat(compra.total) || 0,
    subtotal: parseFloat(compra.subtotal) || parseFloat(compra.total) || 0,
    impuestos: parseFloat(compra.impuestos) || 0,
    observaciones: compra.observaciones || '',
    detalles: Array.isArray(compra.detalles) ? compra.detalles.map(transformarDetalle) : [],
    created_at: compra.created_at || compra.fecha,
    updated_at: compra.updated_at || compra.fecha,
  };
};

/**
 * Transforma y valida los detalles de productos
 * @param {object} detalle - Detalle de producto del backend
 * @returns {object} - Detalle transformado
 */
const transformarDetalle = (detalle) => {
  if (!detalle) return null;
  
  const cantidad = parseFloat(detalle.cantidad) || 0;
  const precioUnitario = parseFloat(detalle.precio_unitario) || 0;
  const subtotal = parseFloat(detalle.subtotal) || (cantidad * precioUnitario);
  
  return {
    id: detalle.id || detalle.producto_id,
    producto_id: detalle.producto_id || detalle.id,
    producto_nombre: detalle.producto_nombre || detalle.producto?.nombre || detalle.nombre || 'Producto sin nombre',
    cantidad: cantidad,
    precio_unitario: precioUnitario,
    subtotal: subtotal,
    unidad: detalle.unidad || 'unidad',
    categoria: detalle.categoria || detalle.producto?.categoria || 'Sin categoría',
  };
};

/**
 * Transforma estadísticas del backend
 * @param {object} stats - Estadísticas del backend
 * @returns {object} - Estadísticas transformadas
 */
const transformarEstadisticas = (stats) => {
  if (!stats) {
    return {
      total_invertido_mes: 0.0,
      compras_mes: 0,
      gasto_promedio: 0.0,
      top_proveedores: [],
      productos_mas_comprados: [],
      total_compras: 0,
      gasto_total: 0.0,
      compras_por_metodo: {},
      tendencia_mensual: [],
    };
  }
  
  return {
    total_invertido_mes: parseFloat(stats.total_invertido_mes) || 0.0,
    compras_mes: parseInt(stats.compras_mes) || 0,
    gasto_promedio: parseFloat(stats.gasto_promedio) || 0.0,
    top_proveedores: Array.isArray(stats.top_proveedores) ? stats.top_proveedores.map(proveedor => ({
      id: proveedor.id,
      nombre: proveedor.nombre || 'Sin nombre',
      total_compras: parseInt(proveedor.total_compras) || 0,
      total_gastado: parseFloat(proveedor.total_gastado) || 0.0,
      ultimo_pedido: proveedor.ultimo_pedido,
    })) : [],
    productos_mas_comprados: Array.isArray(stats.productos_mas_comprados) ? stats.productos_mas_comprados.map(producto => ({
      producto_id: producto.producto_id,
      producto: producto.producto || producto.nombre || 'Sin nombre',
      cantidad_total: parseFloat(producto.cantidad_total) || 0,
      veces_comprado: parseInt(producto.veces_comprado) || 0,
      gasto_total: parseFloat(producto.gasto_total) || 0.0,
    })) : [],
    total_compras: parseInt(stats.total_compras) || 0,
    gasto_total: parseFloat(stats.gasto_total) || 0.0,
    compras_por_metodo: stats.compras_por_metodo || {},
    tendencia_mensual: Array.isArray(stats.tendencia_mensual) ? stats.tendencia_mensual : [],
  };
};

/**
 * Obtiene todas las compras con filtros opcionales
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de compras transformadas
 */
export const obtenerCompras = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.proveedor_id) {
      params.append('proveedor_id', filtros.proveedor_id);
    }
    if (filtros.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros.producto) {
      params.append('producto', filtros.producto);
    }
    if (filtros.metodo_pago) {
      params.append('metodo_pago', filtros.metodo_pago);
    }
    
    const url = `/compras${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🛒 Obteniendo compras:', url);
    
    const response = await api.get(url);
    const comprasRaw = Array.isArray(response.data) ? response.data : [];
    const comprasTransformadas = comprasRaw.map(transformarCompra).filter(Boolean);
    
    console.log('✅ Compras obtenidas y transformadas:', comprasTransformadas.length);
    return comprasTransformadas;
  } catch (error) {
    console.error('❌ Error obteniendo compras:', error);
    console.log('🔄 Devolviendo lista vacía de compras como fallback');
    return [];
  }
};

/**
 * Obtiene una compra específica por ID
 * @param {number} id - ID de la compra
 * @returns {object} - Datos de la compra transformados
 */
export const obtenerCompra = async (id) => {
  try {
    console.log('🛒 Obteniendo compra:', id);
    const response = await api.get(`/compras/${id}`);
    const compraTransformada = transformarCompra(response.data);
    console.log('✅ Compra obtenida:', compraTransformada?.proveedor_nombre);
    return compraTransformada;
  } catch (error) {
    console.error('❌ Error obteniendo compra:', error);
    throw error.response?.data || { message: 'Error obteniendo compra' };
  }
};

/**
 * Crea una nueva compra
 * @param {object} compra - Datos de la compra
 * @returns {object} - Respuesta del servidor transformada
 */
export const crearCompra = async (compra) => {
  try {
    // Validar datos antes de enviar
    if (!compra.proveedor_id) {
      throw new Error('El proveedor es requerido');
    }
    if (!compra.productos || !Array.isArray(compra.productos) || compra.productos.length === 0) {
      throw new Error('Debe agregar al menos un producto');
    }
    
    // Preparar datos para el backend
    const compraData = {
      proveedor_id: parseInt(compra.proveedor_id),
      fecha: compra.fecha || new Date().toISOString().split('T')[0],
      numero_comprobante: compra.numero_comprobante || '',
      metodo_pago: compra.metodo_pago || 'efectivo',
      observaciones: compra.observaciones || '',
      productos: compra.productos.map(producto => ({
        id: parseInt(producto.id),
        cantidad: parseFloat(producto.cantidad),
        precio_unitario: parseFloat(producto.precio_unitario),
        subtotal: parseFloat(producto.subtotal) || (parseFloat(producto.cantidad) * parseFloat(producto.precio_unitario)),
      })),
      total: parseFloat(compra.total) || 0,
      subtotal: parseFloat(compra.subtotal) || parseFloat(compra.total) || 0,
      impuestos: parseFloat(compra.impuestos) || 0,
    };
    
    console.log('🛒 Creando compra:', compraData);
    const response = await api.post('/compras', compraData);
    const compraCreada = transformarCompra(response.data);
    console.log('✅ Compra creada:', compraCreada);
    return compraCreada;
  } catch (error) {
    console.error('❌ Error creando compra:', error);
    throw error.response?.data || { message: error.message || 'Error creando compra' };
  }
};

/**
 * Actualiza una compra existente
 * @param {number} id - ID de la compra
 * @param {object} compra - Datos actualizados de la compra
 * @returns {object} - Respuesta del servidor transformada
 */
export const actualizarCompra = async (id, compra) => {
  try {
    // Validar datos antes de enviar
    if (!compra.proveedor_id) {
      throw new Error('El proveedor es requerido');
    }
    if (!compra.productos || !Array.isArray(compra.productos) || compra.productos.length === 0) {
      throw new Error('Debe agregar al menos un producto');
    }
    
    // Preparar datos para el backend
    const compraData = {
      proveedor_id: parseInt(compra.proveedor_id),
      fecha: compra.fecha,
      numero_comprobante: compra.numero_comprobante || '',
      metodo_pago: compra.metodo_pago || 'efectivo',
      observaciones: compra.observaciones || '',
      productos: compra.productos.map(producto => ({
        id: parseInt(producto.id),
        cantidad: parseFloat(producto.cantidad),
        precio_unitario: parseFloat(producto.precio_unitario),
        subtotal: parseFloat(producto.subtotal) || (parseFloat(producto.cantidad) * parseFloat(producto.precio_unitario)),
      })),
      total: parseFloat(compra.total) || 0,
      subtotal: parseFloat(compra.subtotal) || parseFloat(compra.total) || 0,
      impuestos: parseFloat(compra.impuestos) || 0,
    };
    
    console.log('🛒 Actualizando compra:', id);
    const response = await api.put(`/compras/${id}`, compraData);
    const compraActualizada = transformarCompra(response.data);
    console.log('✅ Compra actualizada:', compraActualizada);
    return compraActualizada;
  } catch (error) {
    console.error('❌ Error actualizando compra:', error);
    throw error.response?.data || { message: error.message || 'Error actualizando compra' };
  }
};

/**
 * Elimina una compra
 * @param {number} id - ID de la compra
 * @returns {object} - Respuesta del servidor
 */
export const eliminarCompra = async (id) => {
  try {
    console.log('🛒 Eliminando compra:', id);
    const response = await api.delete(`/compras/${id}`);
    console.log('✅ Compra eliminada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando compra:', error);
    throw error.response?.data || { message: 'Error eliminando compra' };
  }
};

/**
 * Obtiene estadísticas de compras transformadas
 * @returns {object} - Estadísticas de compras
 */
export const obtenerEstadisticasCompras = async () => {
  try {
    console.log('📊 Obteniendo estadísticas de compras');
    const response = await api.get('/compras/estadisticas');
    const estadisticasTransformadas = transformarEstadisticas(response.data);
    console.log('✅ Estadísticas obtenidas:', estadisticasTransformadas);
    return estadisticasTransformadas;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    // Devolver estadísticas por defecto en caso de error
    return transformarEstadisticas(null);
  }
};

/**
 * Obtiene lista de proveedores
 * @returns {array} - Lista de proveedores
 */
export const obtenerProveedores = async () => {
  try {
    console.log('🏪 Obteniendo proveedores');
    const response = await api.get('/proveedores');
    const proveedores = Array.isArray(response.data) ? response.data : [];
    console.log('✅ Proveedores obtenidos:', proveedores.length);
    return proveedores.map(proveedor => ({
      id: proveedor.id,
      nombre: proveedor.nombre || 'Sin nombre',
      rut: proveedor.rut || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
      activo: proveedor.activo !== false,
    }));
  } catch (error) {
    console.error('❌ Error obteniendo proveedores:', error);
    console.log('🔄 Devolviendo lista vacía de proveedores como fallback');
    return [];
  }
};

/**
 * Valida los datos de una compra antes de enviar
 * @param {object} compra - Datos de la compra
 * @returns {object} - Resultado de validación
 */
export const validarCompra = (compra) => {
  const errores = {};
  
  if (!compra.proveedor_id) {
    errores.proveedor_id = 'Selecciona un proveedor';
  }
  
  if (!compra.fecha) {
    errores.fecha = 'Ingresa la fecha de compra';
  }
  
  if (!compra.productos || !Array.isArray(compra.productos) || compra.productos.length === 0) {
    errores.productos = 'Agrega al menos un producto';
  } else {
    compra.productos.forEach((producto, index) => {
      if (!producto.id) {
        errores[`producto_${index}_id`] = 'Selecciona un producto';
      }
      if (!producto.cantidad || parseFloat(producto.cantidad) <= 0) {
        errores[`producto_${index}_cantidad`] = 'Ingresa una cantidad válida';
      }
      if (!producto.precio_unitario || parseFloat(producto.precio_unitario) <= 0) {
        errores[`producto_${index}_precio`] = 'Ingresa un precio válido';
      }
    });
  }
  
  const total = parseFloat(compra.total);
  if (!total || total <= 0) {
    errores.total = 'El total debe ser mayor a 0';
  }
  
  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

// Objeto principal del servicio de compras
export const purchaseService = {
  obtenerCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra,
  obtenerEstadisticasCompras,
  obtenerProveedores,
  validarCompra,
  transformarCompra,
  transformarEstadisticas,
};

// Exportación por defecto
export default purchaseService;