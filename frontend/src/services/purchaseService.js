import axios from 'axios';
import config from '../config/config';

// URL base del backend Flask
const API_URL = config.API_BASE_URL;

console.log('🛒 Purchase API_URL configurada:', API_URL);

// Configurar instancia de axios con configuraciones optimizadas
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Aumentado para operaciones complejas
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Cache simple para reducir llamadas repetitivas
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para obtener datos del cache
const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Función para guardar en cache
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Interceptor optimizado para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    console.log('📤 Enviando petición de compras a:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Agregar timestamp para evitar cache del navegador en operaciones críticas
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
      config.params = { ...config.params, _t: Date.now() };
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor optimizado para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('📥 Respuesta de compras recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de compras:', error);
    
    // Manejo mejorado de errores de red
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Error de CORS o conexión:', error);
      return Promise.reject({
        message: 'Error de conexión. Verifica que el servidor esté funcionando.',
        type: 'NETWORK_ERROR',
        originalError: error
      });
    }
    
    // Manejo de timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'La operación tardó demasiado tiempo. Intenta nuevamente.',
        type: 'TIMEOUT_ERROR',
        originalError: error
      });
    }
    
    // Manejo de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject({
        message: 'Sesión expirada. Redirigiendo al login...',
        type: 'AUTH_ERROR'
      });
    }
    
    // Manejo de errores del servidor
    if (error.response?.status >= 500) {
      return Promise.reject({
        message: 'Error interno del servidor. Intenta nuevamente más tarde.',
        type: 'SERVER_ERROR',
        originalError: error
      });
    }
    
    return Promise.reject(error);
  }
);

/**
 * Transforma y valida los datos de compra del backend de forma optimizada
 * @param {object} compra - Datos de compra del backend
 * @returns {object} - Datos de compra transformados
 */
const transformarCompra = (compra) => {
  if (!compra || typeof compra !== 'object') return null;
  
  try {
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
      detalles: Array.isArray(compra.detalles) ? compra.detalles.map(transformarDetalle).filter(Boolean) : [],
      created_at: compra.created_at || compra.fecha,
      updated_at: compra.updated_at || compra.fecha,
    };
  } catch (error) {
    console.error('❌ Error transformando compra:', error, compra);
    return null;
  }
};

/**
 * Transforma y valida los detalles de productos de forma optimizada
 * @param {object} detalle - Detalle de producto del backend
 * @returns {object} - Detalle transformado
 */
const transformarDetalle = (detalle) => {
  if (!detalle || typeof detalle !== 'object') return null;
  
  try {
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
      temp_id: detalle.temp_id || `${Date.now()}-${Math.random()}`, // Para React keys
    };
  } catch (error) {
    console.error('❌ Error transformando detalle:', error, detalle);
    return null;
  }
};

/**
 * Transforma estadísticas del backend de forma optimizada
 * @param {object} stats - Estadísticas del backend
 * @returns {object} - Estadísticas transformadas
 */
const transformarEstadisticas = (stats) => {
  const defaultStats = {
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

  if (!stats || typeof stats !== 'object') {
    return defaultStats;
  }
  
  try {
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
      })).filter(Boolean) : [],
      productos_mas_comprados: Array.isArray(stats.productos_mas_comprados) ? stats.productos_mas_comprados.map(producto => ({
        producto_id: producto.producto_id,
        producto: producto.producto || producto.nombre || 'Sin nombre',
        cantidad_total: parseFloat(producto.cantidad_total) || 0,
        veces_comprado: parseInt(producto.veces_comprado) || 0,
        gasto_total: parseFloat(producto.gasto_total) || 0.0,
      })).filter(Boolean) : [],
      total_compras: parseInt(stats.total_compras) || 0,
      gasto_total: parseFloat(stats.gasto_total) || 0.0,
      compras_por_metodo: stats.compras_por_metodo || {},
      tendencia_mensual: Array.isArray(stats.tendencia_mensual) ? stats.tendencia_mensual : [],
    };
  } catch (error) {
    console.error('❌ Error transformando estadísticas:', error, stats);
    return defaultStats;
  }
};

/**
 * Obtiene todas las compras con filtros opcionales - OPTIMIZADO
 * @param {object} filtros - Filtros de búsqueda
 * @returns {array} - Lista de compras transformadas
 */
export const obtenerCompras = async (filtros = {}) => {
  try {
    // Crear clave de cache basada en filtros
    const cacheKey = `compras_${JSON.stringify(filtros)}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      console.log('📦 Usando compras desde cache');
      return cachedData;
    }

    const params = new URLSearchParams();
    
    // Optimizar construcción de parámetros
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    const url = `/compras${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🛒 Obteniendo compras:', url);
    
    const response = await api.get(url);
    const comprasRaw = Array.isArray(response.data) ? response.data : [];
    const comprasTransformadas = comprasRaw.map(transformarCompra).filter(Boolean);
    
    // Guardar en cache solo si no hay filtros específicos o son filtros básicos
    if (Object.keys(filtros).length <= 2) {
      setCache(cacheKey, comprasTransformadas);
    }
    
    console.log('✅ Compras obtenidas y transformadas:', comprasTransformadas.length);
    return comprasTransformadas;
  } catch (error) {
    console.error('❌ Error obteniendo compras:', error);
    console.log('🔄 Devolviendo lista vacía de compras como fallback');
    return [];
  }
};

/**
 * Obtiene una compra específica por ID - OPTIMIZADO
 * @param {number} id - ID de la compra
 * @returns {object} - Datos de la compra transformados
 */
export const obtenerCompra = async (id) => {
  try {
    const cacheKey = `compra_${id}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      console.log('📦 Usando compra desde cache:', id);
      return cachedData;
    }

    console.log('🛒 Obteniendo compra:', id);
    const response = await api.get(`/compras/${id}`);
    const compraTransformada = transformarCompra(response.data);
    
    if (compraTransformada) {
      setCache(cacheKey, compraTransformada);
    }
    
    console.log('✅ Compra obtenida:', compraTransformada?.proveedor_nombre);
    return compraTransformada;
  } catch (error) {
    console.error('❌ Error obteniendo compra:', error);
    throw error.response?.data || { message: 'Error obteniendo compra' };
  }
};

/**
 * Crea una nueva compra - OPTIMIZADO Y CORREGIDO
 * @param {object} compra - Datos de la compra
 * @returns {object} - Respuesta del servidor transformada
 */
export const crearCompra = async (compra) => {
  try {
    // Validación mejorada antes de enviar
    const validacion = validarCompra(compra);
    if (!validacion.valido) {
      const errores = Object.values(validacion.errores).join(', ');
      throw new Error(`Datos inválidos: ${errores}`);
    }
    
    // Preparar datos optimizados para el backend - FORMATO CORRECTO
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
    
    // Extraer la compra del response (puede venir en response.data.compra o response.data)
    const compraCreada = transformarCompra(response.data.compra || response.data);
    
    // Limpiar cache relacionado
    cache.clear();
    
    console.log('✅ Compra creada exitosamente:', compraCreada);
    return compraCreada;
  } catch (error) {
    console.error('❌ Error creando compra:', error);
    
    // Manejo mejorado de errores específicos
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Datos de compra inválidos');
    }
    if (error.response?.status === 409) {
      throw new Error('Conflicto: La compra ya existe o hay un problema de concurrencia');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Error creando compra');
  }
};

/**
 * Actualiza una compra existente - OPTIMIZADO
 * @param {number} id - ID de la compra
 * @param {object} compra - Datos actualizados de la compra
 * @returns {object} - Respuesta del servidor transformada
 */
export const actualizarCompra = async (id, compra) => {
  try {
    // Validación mejorada antes de enviar
    const validacion = validarCompra(compra);
    if (!validacion.valido) {
      const errores = Object.values(validacion.errores).join(', ');
      throw new Error(`Datos inválidos: ${errores}`);
    }
    
    // Preparar datos optimizados para el backend
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
    const compraActualizada = transformarCompra(response.data.compra || response.data);
    
    // Limpiar cache relacionado
    cache.clear();
    
    console.log('✅ Compra actualizada exitosamente:', compraActualizada);
    return compraActualizada;
  } catch (error) {
    console.error('❌ Error actualizando compra:', error);
    
    // Manejo mejorado de errores específicos
    if (error.response?.status === 404) {
      throw new Error('La compra no existe o fue eliminada');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Datos de compra inválidos');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Error actualizando compra');
  }
};

/**
 * Elimina una compra - OPTIMIZADO
 * @param {number} id - ID de la compra
 * @returns {object} - Respuesta del servidor
 */
export const eliminarCompra = async (id) => {
  try {
    console.log('🛒 Eliminando compra:', id);
    const response = await api.delete(`/compras/${id}`);
    
    // Limpiar cache relacionado
    cache.clear();
    
    console.log('✅ Compra eliminada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando compra:', error);
    
    if (error.response?.status === 404) {
      throw new Error('La compra no existe o ya fue eliminada');
    }
    
    throw new Error(error.response?.data?.message || 'Error eliminando compra');
  }
};

/**
 * Obtiene estadísticas de compras transformadas - OPTIMIZADO
 * @returns {object} - Estadísticas de compras
 */
export const obtenerEstadisticasCompras = async () => {
  try {
    const cacheKey = 'estadisticas_compras';
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      console.log('📦 Usando estadísticas desde cache');
      return cachedData;
    }

    console.log('📊 Obteniendo estadísticas de compras');
    const response = await api.get('/compras/estadisticas');
    const estadisticasTransformadas = transformarEstadisticas(response.data);
    
    setCache(cacheKey, estadisticasTransformadas);
    
    console.log('✅ Estadísticas obtenidas:', estadisticasTransformadas);
    return estadisticasTransformadas;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    // Devolver estadísticas por defecto en caso de error
    return transformarEstadisticas(null);
  }
};

/**
 * Obtiene lista de proveedores - OPTIMIZADO
 * @returns {array} - Lista de proveedores
 */
export const obtenerProveedores = async () => {
  try {
    const cacheKey = 'proveedores_compras';
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      console.log('📦 Usando proveedores desde cache');
      return cachedData;
    }

    console.log('🏪 Obteniendo proveedores');
    const response = await api.get('/proveedores');
    const proveedores = Array.isArray(response.data) ? response.data : [];
    
    const proveedoresTransformados = proveedores.map(proveedor => ({
      id: proveedor.id,
      nombre: proveedor.nombre || 'Sin nombre',
      rut: proveedor.rut || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
      activo: proveedor.activo !== false,
    })).filter(Boolean);
    
    setCache(cacheKey, proveedoresTransformados);
    
    console.log('✅ Proveedores obtenidos:', proveedoresTransformados.length);
    return proveedoresTransformados;
  } catch (error) {
    console.error('❌ Error obteniendo proveedores:', error);
    console.log('🔄 Devolviendo lista vacía de proveedores como fallback');
    return [];
  }
};

/**
 * Valida los datos de una compra antes de enviar - MEJORADO
 * @param {object} compra - Datos de la compra
 * @returns {object} - Resultado de validación
 */
export const validarCompra = (compra) => {
  const errores = {};
  
  // Validaciones básicas
  if (!compra.proveedor_id) {
    errores.proveedor_id = 'Selecciona un proveedor';
  }
  
  if (!compra.fecha) {
    errores.fecha = 'Ingresa la fecha de compra';
  } else {
    // Validar que la fecha no sea futura
    const fechaCompra = new Date(compra.fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999); // Permitir hasta el final del día actual
    
    if (fechaCompra > hoy) {
      errores.fecha = 'La fecha no puede ser futura';
    }
  }
  
  // Validaciones de productos
  if (!compra.productos || !Array.isArray(compra.productos) || compra.productos.length === 0) {
    errores.productos = 'Agrega al menos un producto';
  } else {
    compra.productos.forEach((producto, index) => {
      if (!producto.id) {
        errores[`producto_${index}_id`] = 'Selecciona un producto';
      }
      
      const cantidad = parseFloat(producto.cantidad);
      if (!cantidad || cantidad <= 0) {
        errores[`producto_${index}_cantidad`] = 'Ingresa una cantidad válida';
      } else if (cantidad > 10000) {
        errores[`producto_${index}_cantidad`] = 'Cantidad demasiado alta';
      }
      
      const precio = parseFloat(producto.precio_unitario);
      if (!precio || precio <= 0) {
        errores[`producto_${index}_precio`] = 'Ingresa un precio válido';
      } else if (precio > 1000000) {
        errores[`producto_${index}_precio`] = 'Precio demasiado alto';
      }
    });
  }
  
  // Validación del total
  const total = parseFloat(compra.total);
  if (!total || total <= 0) {
    errores.total = 'El total debe ser mayor a 0';
  } else if (total > 10000000) {
    errores.total = 'El total es demasiado alto';
  }
  
  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

/**
 * Limpia el cache manualmente
 */
export const limpiarCache = () => {
  cache.clear();
  console.log('🧹 Cache de compras limpiado');
};

// Objeto principal del servicio de compras optimizado
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
  limpiarCache,
};

// Exportación por defecto
export default purchaseService;