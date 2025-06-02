/**
 * Tipos y constantes para el módulo de inventario
 */

// Categorías de productos
export const CATEGORIAS_PRODUCTOS = {
  FRUTAS: 'frutas',
  VERDURAS: 'verduras',
  OTROS: 'otros'
};

// Unidades de medida
export const UNIDADES_MEDIDA = {
  KG: 'kg',
  UNIDAD: 'unidad',
  CAJA: 'caja',
  LITRO: 'litro'
};

// Tipos de movimientos de stock
export const TIPOS_MOVIMIENTO = {
  INGRESO: 'ingreso',
  EGRESO: 'egreso',
  AJUSTE: 'ajuste'
};

// Estados de productos
export const ESTADOS_PRODUCTO = {
  ACTIVO: true,
  INACTIVO: false
};

// Configuración de filtros por defecto
export const FILTROS_DEFAULT = {
  categoria: 'todos',
  busqueda: '',
  stockBajo: false,
  orden: 'nombre',
  direccion: 'asc',
  activo: true
};

// Configuración de paginación
export const PAGINACION_DEFAULT = {
  page: 1,
  limit: 25,
  total: 0
};

// Opciones de ordenamiento
export const OPCIONES_ORDEN = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'categoria', label: 'Categoría' },
  { value: 'stock_actual', label: 'Stock Actual' },
  { value: 'precio_unitario', label: 'Precio' },
  { value: 'creado', label: 'Fecha Creación' }
];

// Opciones de categorías para filtros
export const OPCIONES_CATEGORIAS = [
  { value: 'todos', label: 'Todas las categorías' },
  { value: 'frutas', label: 'Frutas' },
  { value: 'verduras', label: 'Verduras' },
  { value: 'otros', label: 'Otros' }
];

// Opciones de unidades de medida
export const OPCIONES_UNIDADES = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'caja', label: 'Caja' },
  { value: 'litro', label: 'Litro' }
];

// Opciones de tipos de movimiento
export const OPCIONES_TIPOS_MOVIMIENTO = [
  { value: 'ingreso', label: 'Ingreso', color: 'success', icon: 'add' },
  { value: 'egreso', label: 'Egreso', color: 'error', icon: 'remove' },
  { value: 'ajuste', label: 'Ajuste', color: 'warning', icon: 'edit' }
];

// Configuración de alertas de stock
export const CONFIG_ALERTAS_STOCK = {
  CRITICO: 0, // Sin stock
  BAJO: 1, // Stock <= mínimo
  MEDIO: 2, // Stock <= mínimo * 2
  BUENO: 3 // Stock > mínimo * 2
};

// Colores para estados de stock
export const COLORES_STOCK = {
  CRITICO: 'error',
  BAJO: 'warning',
  MEDIO: 'info',
  BUENO: 'success'
};

// Mensajes de validación
export const MENSAJES_VALIDACION = {
  NOMBRE_REQUERIDO: 'El nombre del producto es requerido',
  NOMBRE_MIN_LENGTH: 'El nombre debe tener al menos 2 caracteres',
  CATEGORIA_REQUERIDA: 'La categoría es requerida',
  PRECIO_REQUERIDO: 'El precio es requerido',
  PRECIO_POSITIVO: 'El precio debe ser mayor a 0',
  STOCK_REQUERIDO: 'El stock es requerido',
  STOCK_NO_NEGATIVO: 'El stock no puede ser negativo',
  UNIDAD_REQUERIDA: 'La unidad de medida es requerida'
};

// Configuración de exportación
export const CONFIG_EXPORTACION = {
  FORMATOS: {
    PDF: 'pdf',
    EXCEL: 'excel',
    CSV: 'csv'
  },
  TIPOS_CONTENIDO: {
    PDF: 'application/pdf',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    CSV: 'text/csv'
  }
};

// Utilidades para formateo
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    minimumFractionDigits: 2,
  }).format(precio);
};

export const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-UY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(fecha));
};

export const obtenerEstadoStock = (stockActual, stockMinimo) => {
  if (stockActual <= 0) {
    return { nivel: CONFIG_ALERTAS_STOCK.CRITICO, color: COLORES_STOCK.CRITICO, label: 'Sin stock' };
  } else if (stockActual <= stockMinimo) {
    return { nivel: CONFIG_ALERTAS_STOCK.BAJO, color: COLORES_STOCK.BAJO, label: 'Stock bajo' };
  } else if (stockActual <= stockMinimo * 2) {
    return { nivel: CONFIG_ALERTAS_STOCK.MEDIO, color: COLORES_STOCK.MEDIO, label: 'Stock medio' };
  }
  return { nivel: CONFIG_ALERTAS_STOCK.BUENO, color: COLORES_STOCK.BUENO, label: 'Stock bueno' };
};