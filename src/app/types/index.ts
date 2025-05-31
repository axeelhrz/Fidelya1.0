
// Tipos base para Firebase
export interface BaseFirebaseDocument {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Categorías de productos
export type ProductCategory = 
  | 'APPETIZER' 
  | 'MAIN_COURSE' 
  | 'DESSERT' 
  | 'BEVERAGE' 
  | 'SIDE_DISH'
  | 'COCKTAIL'
  | 'WINE'
  | 'BEER'
  | 'COFFEE'
  | 'NON_ALCOHOLIC'
  | 'SNACK';

// Interfaz para Menú
export interface Menu extends BaseFirebaseDocument {
  name: string;
  description: string;
  isActive: boolean;
  categories: string[];
  restaurantInfo?: {
  name: string;
    address?: string;
    phone?: string;
    hours?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
  };
}

// Interfaz para Producto
export interface Product extends BaseFirebaseDocument {
  name: string;
  description?: string;
  price: number;
  category: ProductCategory | string;
  menuId: string;
  isAvailable: boolean;
  image?: string;
  allergens?: string[];
    id: string;
  isRecommended: boolean;
  isVegan: boolean;
  createdAt: string;
  updatedAt: string;
  nutritionalInfo?: {
    calories?: number;
  isVegan?: boolean;
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
  };
  tags?: string[];
  preparationTime?: number; // en minutos
}

// Interfaz para Categoría
export interface Category extends BaseFirebaseDocument {
  name: string;
  description?: string;
  menuId: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

// Tipos para el frontend del menú
export interface MenuData {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isActive: boolean;
  products: ProductData[];
  createdAt: string;
  updatedAt: string;
  restaurantInfo?: {
    name: string;
    address?: string;
    phone?: string;
    hours?: string;
  };
}

export interface ProductData {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  menuId: string;
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    isVegan?: boolean;
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
  };
  tags?: string[];
  preparationTime?: number;
}

// Tipos para formularios
export interface MenuFormData {
  name: string;
  description: string;
  isActive: boolean;
  categories: string[];
  restaurantInfo?: {
    name: string;
    address?: string;
    phone?: string;
    hours?: string;
  };
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category: ProductCategory | string;
  menuId: string;
  isAvailable: boolean;
  image?: string;
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    isVegan?: boolean;
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
  };
  tags?: string[];
  preparationTime?: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  menuId: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  page?: number;
  limit?: number;
  total?: number;
}

// Tipos para filtros
export interface ProductFilters {
  menuId?: string;
  category?: string;
  isAvailable?: boolean;
  search?: string;
  tags?: string[];
}

export interface MenuFilters {
  isActive?: boolean;
  search?: string;
}