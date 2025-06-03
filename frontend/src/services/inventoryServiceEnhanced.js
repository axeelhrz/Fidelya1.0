import axios from 'axios';
import config from '../config/config';

const API_URL = config.API_BASE_URL;

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
    console.log('📤 Enviando petición de inventario a:', config.baseURL + config.url);
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('📥 Respuesta de inventario recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de inventario:', error);
    
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
 * Obtiene un producto específico por ID
 * @param {number} id - ID del producto
 * @returns {object} - Datos del producto
 */
export const obtenerProducto = async (id) => {
  try {
    console.log('📦 Obteniendo producto:', id);
    const response = await api.get(`/productos/${id}`);
    console.log('✅ Producto obtenido:', response.data.nombre);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    throw error.response?.data || { message: 'Error obteniendo producto' };
  }
    };
/**
 * Crea un nuevo producto
 * @param {object} producto - Datos del producto
 * @returns {object} - Respuesta del servidor
 */
export const crearProducto = async (producto) => {
  try {
    console.log('📦 Creando producto:', producto.nombre);
    const response = await api.post('/productos', producto);
    console.log('✅ Producto creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    throw error.response?.data || { message: 'Error creando producto' };
  }
    };
/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {object} producto - Datos actualizados del producto
 * @returns {object} - Respuesta del servidor
 */
export const actualizarProducto = async (id, producto) => {
  try {
    console.log('📦 Actualizando producto:', id);
    const response = await api.put(`/productos/${id}`, producto);
    console.log('✅ Producto actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    throw error.response?.data || { message: 'Error actualizando producto' };
  }
};

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {object} - Respuesta del servidor
 */
export const eliminarProducto = async (id) => {
  try {
    console.log('📦 Eliminando producto:', id);
    const response = await api.delete(`/productos/${id}`);
    console.log('✅ Producto eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    throw error.response?.data || { message: 'Error eliminando producto' };
  }
    };
/**
 * Registra un movimiento de stock
 * @param {object} movimiento - Datos del movimiento
 * @returns {object} - Respuesta del servidor
 */
export const registrarMovimientoStock = async (movimiento) => {
  try {
    console.log('📝 Registrando movimiento de stock:', movimiento);
    const response = await api.post('/stock/movimiento', movimiento);
    console.log('✅ Movimiento registrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error registrando movimiento:', error);
    throw error.response?.data || { message: 'Error registrando movimiento' };
  }
};

/**
 * Obtiene resumen completo del inventario con estadísticas avanzadas
 * @returns {object} - Resumen completo del inventario
 */
export const obtenerResumenInventario = async () => {
  try {
    console.log('📊 Obteniendo resumen completo del inventario');
    const response = await api.get('/inventario/resumen');
    console.log('✅ Resumen de inventario obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo resumen de inventario:', error);
    return {
      estadisticas_generales: {
        total_productos: 0,
        productos_stock_bajo: 0,
        productos_sin_stock: 0,
        valor_inventario: 0,
        stock_total_unidades: 0
      },
      distribucion_categorias: [],
      productos_mas_vendidos: [],
      movimientos_recientes: {
        total: 0,
        ingresos: 0,
        egresos: 0,
        ajustes: 0
      },
      proveedores_principales: [],
      alertas: [],
      tendencias: {
        productos_nuevos_mes: 0,
        tendencia_porcentual: 0
  }
};
  }
    };
/**
 * Búsqueda avanzada de productos con múltiples filtros y paginación
 * @param {object} filtros - Filtros de búsqueda avanzada
 * @returns {object} - Resultados paginados con metadatos
 */
export const busquedaAvanzadaProductos = async (filtros = {}) => {
  try {
    console.log('🔍 Realizando búsqueda avanzada de productos:', filtros);
    const params = new URLSearchParams();
    
    // Filtros básicos
    if (filtros.busqueda) params.append('q', filtros.busqueda);
    if (filtros.categoria && filtros.categoria !== 'todos') params.append('categoria', filtros.categoria);
    if (filtros.proveedor_id) params.append('proveedor_id', filtros.proveedor_id);
    
    // Filtros de stock
    if (filtros.stock_minimo !== undefined) params.append('stock_minimo', filtros.stock_minimo);
    if (filtros.stock_maximo !== undefined) params.append('stock_maximo', filtros.stock_maximo);
    if (filtros.stockBajo) params.append('stock_bajo', 'true');
    if (filtros.sinStock) params.append('sin_stock', 'true');
    
    // Filtros de precio
    if (filtros.precio_minimo !== undefined) params.append('precio_minimo', filtros.precio_minimo);
    if (filtros.precio_maximo !== undefined) params.append('precio_maximo', filtros.precio_maximo);
    
    // Ordenamiento y paginación
    if (filtros.orden) params.append('orden', filtros.orden);
    if (filtros.direccion) params.append('direccion', filtros.direccion);
    if (filtros.limite) params.append('limite', filtros.limite);
    if (filtros.pagina) params.append('pagina', filtros.pagina);
    const response = await api.get(`/productos?${params.toString()}`);
    console.log('✅ Búsqueda avanzada completada:', response.data.length, 'productos encontrados');
    
    // Adaptar respuesta para compatibilidad con el componente
    return {
      productos: response.data,
      paginacion: {
        pagina_actual: filtros.pagina || 1,
        limite: filtros.limite || 50,
        total_registros: response.data.length,
        total_paginas: Math.ceil(response.data.length / (filtros.limite || 50)),
        tiene_siguiente: false,
        tiene_anterior: false
      },
      filtros_aplicados: filtros
};
  } catch (error) {
    console.error('❌ Error en búsqueda avanzada:', error);
    return {
      productos: [],
      paginacion: {
        pagina_actual: 1,
        limite: 50,
        total_registros: 0,
        total_paginas: 0,
        tiene_siguiente: false,
        tiene_anterior: false
      },
      filtros_aplicados: filtros
    };
  }
};

/**
 * Realiza operaciones masivas en productos seleccionados
 * @param {string} operacion - Tipo de operación (actualizar_precios, cambiar_categoria, etc.)
 * @param {array} productosIds - IDs de productos a modificar
 * @param {object} parametros - Parámetros específicos de la operación
 * @returns {object} - Resultado de la operación masiva
 */
export const operacionesMasivasProductos = async (operacion, productosIds, parametros = {}) => {
  try {
    console.log('⚡ Ejecutando operación masiva:', operacion, 'en', productosIds.length, 'productos');
    
    const data = {
      operacion,
      productos_ids: productosIds,
      parametros
};

    const response = await api.post('/inventario/productos/operaciones-masivas', data);
    console.log('✅ Operación masiva completada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en operación masiva:', error);
    throw error.response?.data || { message: 'Error en operación masiva' };
  }
};

/**
 * Genera reporte detallado de movimientos de stock
 * @param {object} filtros - Filtros para el reporte
 * @returns {object} - Reporte detallado con estadísticas
 */
export const generarReporteMovimientos = async (filtros = {}) => {
  try {
    console.log('📋 Generando reporte de movimientos:', filtros);
    
    const params = new URLSearchParams();
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.producto_id) params.append('producto_id', filtros.producto_id);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
    const response = await api.get(`/inventario/reportes/movimientos-detallado?${params.toString()}`);
    console.log('✅ Reporte de movimientos generado:', response.data.movimientos.length, 'registros');
    return response.data;
  } catch (error) {
    console.error('❌ Error generando reporte de movimientos:', error);
    return {
      movimientos: [],
      estadisticas: {
        total_movimientos: 0,
        total_ingresos: 0,
        total_egresos: 0,
        total_ajustes: 0,
        valor_total_movimientos: 0
      },
      resumen_por_categorias: {}
};
  }
};

/**
 * Exporta inventario a diferentes formatos
 * @param {string} formato - Formato de exportación (pdf, excel, csv)
 * @param {object} filtros - Filtros aplicados
 * @returns {object} - Información de la exportación
 */
export const exportarInventario = async (formato = 'excel', filtros = {}) => {
  try {
    console.log('📤 Exportando inventario en formato:', formato);
    
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        params.append(key, filtros[key]);
      }
    });
    
    let endpoint = '';
    switch (formato) {
      case 'pdf':
        endpoint = '/productos/export/pdf';
        break;
      case 'excel':
        endpoint = '/productos/export/excel';
        break;
      case 'csv':
        endpoint = '/productos/export/csv';
        break;
      default:
        throw new Error('Formato de exportación no válido');
    }
    
    const response = await api.get(`${endpoint}?${params.toString()}`);
    console.log('✅ Exportación iniciada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error exportando inventario:', error);
    throw error.response?.data || { message: 'Error en exportación' };
  }
};

/**
 * Obtiene historial de movimientos para un producto específico
 * @param {number} productoId - ID del producto
 * @param {object} opciones - Opciones de consulta
 * @returns {array} - Historial de movimientos
 */
export const obtenerHistorialProducto = async (productoId, opciones = {}) => {
  try {
    console.log('📜 Obteniendo historial del producto:', productoId);
    
    const params = new URLSearchParams();
    params.append('producto_id', productoId);
    if (opciones.limite) params.append('limit', opciones.limite);
    if (opciones.fecha_desde) params.append('fecha_inicio', opciones.fecha_desde);
    if (opciones.fecha_hasta) params.append('fecha_fin', opciones.fecha_hasta);
    
    const response = await api.get(`/movimientos?${params.toString()}`);
    console.log('✅ Historial obtenido:', response.data.length, 'movimientos');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    return [];
  }
};

/**
 * Valida stock antes de realizar una operación
 * @param {number} productoId - ID del producto
 * @param {string} tipoOperacion - Tipo de operación (venta, ajuste, etc.)
 * @param {number} cantidad - Cantidad a validar
 * @returns {object} - Resultado de la validación
 */
export const validarStock = async (productoId, tipoOperacion, cantidad) => {
  try {
    console.log('✅ Validando stock para producto:', productoId, 'operación:', tipoOperacion, 'cantidad:', cantidad);
    
    const response = await api.post('/inventario/validar-stock', {
      producto_id: productoId,
      tipo_operacion: tipoOperacion,
      cantidad: cantidad
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error validando stock:', error);
    return {
      valido: false,
      mensaje: 'Error validando stock',
      stock_disponible: 0
    };
  }
};

/**
 * Obtiene sugerencias de reposición basadas en ventas y stock
 * @param {object} parametros - Parámetros para las sugerencias
 * @returns {array} - Lista de productos sugeridos para reposición
 */
export const obtenerSugerenciasReposicion = async (parametros = {}) => {
  try {
    console.log('💡 Obteniendo sugerencias de reposición');
    
    const params = new URLSearchParams();
    if (parametros.dias_analisis) params.append('dias_analisis', parametros.dias_analisis);
    if (parametros.categoria) params.append('categoria', parametros.categoria);
    if (parametros.proveedor_id) params.append('proveedor_id', parametros.proveedor_id);
    
    const response = await api.get(`/inventario/sugerencias-reposicion?${params.toString()}`);
    console.log('✅ Sugerencias obtenidas:', response.data.length, 'productos');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo sugerencias:', error);
    return [];
  }
};

/**
 * Calcula métricas de rotación de inventario
 * @param {object} filtros - Filtros para el cálculo
 * @returns {object} - Métricas de rotación
 */
export const calcularRotacionInventario = async (filtros = {}) => {
  try {
    console.log('📊 Calculando rotación de inventario');
    
    const params = new URLSearchParams();
    if (filtros.periodo) params.append('periodo', filtros.periodo);
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    
    const response = await api.get(`/inventario/metricas/rotacion?${params.toString()}`);
    console.log('✅ Métricas de rotación calculadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error calculando rotación:', error);
    return {
      rotacion_promedio: 0,
      productos_alta_rotacion: [],
      productos_baja_rotacion: [],
      recomendaciones: []
    };
  }
};

/**
 * Obtiene alertas inteligentes del inventario
 * @returns {array} - Lista de alertas con prioridades
 */
export const obtenerAlertasInteligentes = async () => {
  try {
    console.log('🚨 Obteniendo alertas inteligentes del inventario');
    
    const response = await api.get('/inventario/alertas-inteligentes');
    console.log('✅ Alertas obtenidas:', response.data.length, 'alertas');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo alertas:', error);
    return [];
  }
};

/**
 * Guarda configuración de filtros del usuario
 * @param {object} filtro - Configuración del filtro a guardar
 * @returns {object} - Resultado del guardado
 */
export const guardarFiltroPersonalizado = async (filtro) => {
  try {
    console.log('💾 Guardando filtro personalizado:', filtro.nombre);
    
    const response = await api.post('/inventario/filtros-personalizados', filtro);
    console.log('✅ Filtro guardado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error guardando filtro:', error);
    throw error.response?.data || { message: 'Error guardando filtro' };
  }
};

/**
 * Obtiene filtros personalizados del usuario
 * @returns {array} - Lista de filtros guardados
 */
export const obtenerFiltrosPersonalizados = async () => {
  try {
    console.log('📋 Obteniendo filtros personalizados');
    
    const response = await api.get('/inventario/filtros-personalizados');
    console.log('✅ Filtros obtenidos:', response.data.length, 'filtros');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo filtros:', error);
    return [];
  }
};

/**
 * Genera código de barras para un producto
 * @param {number} productoId - ID del producto
 * @returns {object} - Información del código de barras
 */
export const generarCodigoBarras = async (productoId) => {
  try {
    console.log('🏷️ Generando código de barras para producto:', productoId);
    
    const response = await api.post(`/inventario/productos/${productoId}/codigo-barras`);
    console.log('✅ Código de barras generado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error generando código de barras:', error);
    throw error.response?.data || { message: 'Error generando código de barras' };
  }
};

/**
 * Busca producto por código de barras
 * @param {string} codigoBarras - Código de barras a buscar
 * @returns {object} - Producto encontrado
 */
export const buscarPorCodigoBarras = async (codigoBarras) => {
  try {
    console.log('🔍 Buscando producto por código de barras:', codigoBarras);
    
    const response = await api.get(`/inventario/productos/buscar-codigo-barras/${codigoBarras}`);
    console.log('✅ Producto encontrado:', response.data.nombre);
    return response.data;
  } catch (error) {
    console.error('❌ Error buscando por código de barras:', error);
    throw error.response?.data || { message: 'Producto no encontrado' };
  }
};

// Objeto principal del servicio mejorado
const inventoryServiceEnhanced = {
  // Funciones básicas CRUD
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  registrarMovimientoStock,
  
  // Funciones básicas existentes
  obtenerProductos: busquedaAvanzadaProductos, // Reemplaza la función básica
  obtenerResumenInventario,
  
  // Nuevas funciones avanzadas
  busquedaAvanzadaProductos,
  operacionesMasivasProductos,
  generarReporteMovimientos,
  exportarInventario,
  obtenerHistorialProducto,
  validarStock,
  obtenerSugerenciasReposicion,
  calcularRotacionInventario,
  obtenerAlertasInteligentes,
  guardarFiltroPersonalizado,
  obtenerFiltrosPersonalizados,
  generarCodigoBarras,
  buscarPorCodigoBarras,
};

export default inventoryServiceEnhanced;
