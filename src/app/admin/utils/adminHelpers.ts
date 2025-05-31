import { Product, ProductCategory } from '../../types';

// Validaciones para productos
export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push('El nombre del producto es requerido');
  }

  if (!product.price || product.price <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }

  if (!product.category) {
    errors.push('La categoría es requerida');
  }

  if (product.name && product.name.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres');
  }

  if (product.description && product.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres');
  }

  return errors;
};

// Formatear precio argentino
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Obtener icono de categoría
export const getCategoryIcon = (category: ProductCategory): string => {
  const icons: Record<string, string> = {
    'Bebidas': '🍺',
    'Sin Alcohol': '🥤',
    'Tapas': '🍤',
    'Principales': '🥩',
    'Postres': '🍰',
    'Café': '☕',
    'Promociones': '🎉',
    'Entrada': '🥗',
    'Principal': '🍽️',
    'Bebida': '🥤',
    'Postre': '🧁'
  };
  return icons[category] || '📋';
};

// Obtener color de categoría
export const getCategoryColor = (category: ProductCategory): string => {
  const colors: Record<string, string> = {
    'Bebidas': '#3B82F6',
    'Sin Alcohol': '#10B981',
    'Tapas': '#F59E0B',
    'Principales': '#EF4444',
    'Postres': '#EC4899',
    'Café': '#8B5CF6',
    'Promociones': '#F97316',
    'Entrada': '#06B6D4',
    'Principal': '#DC2626',
    'Bebida': '#059669',
    'Postre': '#DB2777'
  };
  return colors[category] || '#6B7280';
};

// Generar ID único
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Exportar datos a JSON
export const exportToJSON = <T>(data: T, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Importar datos desde JSON
export const importFromJSON = <T = unknown>(file: File): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data);
      } catch {
        reject(new Error('Archivo JSON inválido'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
};

// Ordenar productos
export const sortProducts = (
  products: Product[], 
  sortBy: 'name' | 'price' | 'category' | 'createdAt',
  order: 'asc' | 'desc' = 'asc'
): Product[] => {
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
};

// Buscar productos
export const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    (product.description && product.description.toLowerCase().includes(term)) ||
    product.category.toLowerCase().includes(term)
  );
};

// Estadísticas de productos
export const getProductStats = (products: Product[]) => {
  const total = products.length;
  const available = products.filter(p => p.isAvailable).length;
  const recommended = products.filter(p => (p as Product & { isRecommended?: boolean }).isRecommended).length;
  const vegan = products.filter(p => (p as Product & { isVegan?: boolean }).isVegan).length;
  
  const byCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const avgPrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
    : 0;
  
  const priceRange = products.length > 0 
    ? {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    : { min: 0, max: 0 };

  return {
    total,
    available,
    recommended,
    vegan,
    byCategory,
    avgPrice,
    priceRange,
    unavailable: total - available,
    percentages: {
      available: total > 0 ? (available / total) * 100 : 0,
      recommended: total > 0 ? (recommended / total) * 100 : 0,
      vegan: total > 0 ? (vegan / total) * 100 : 0,
    }
  };
};

// Validar archivo de importación
export const validateImportData = (data: unknown): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!Array.isArray(data)) {
    errors.push('Los datos deben ser un array de productos');
    return { valid: false, errors };
  }
  
  data.forEach((item, index) => {
    const productErrors = validateProduct(item);
    if (productErrors.length > 0) {
      errors.push(`Producto ${index + 1}: ${productErrors.join(', ')}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Generar backup de datos
export const createBackup = (products: Product[], categories: ProductCategory[]) => {
  return {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: {
      products,
      categories,
      metadata: {
        totalProducts: products.length,
        totalCategories: categories.length,
        exportedBy: 'Xs Reset Admin Panel'
      }
    }
  };
};

// Debounce para búsquedas
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Formatear fecha
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Generar slug para URLs
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Remover guiones duplicados
};