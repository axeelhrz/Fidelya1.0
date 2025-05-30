import { FieldValue, Timestamp } from 'firebase/firestore';

export type ProductCategory = 
  | 'Bebidas' 
  | 'Sin Alcohol' 
  | 'Tapas' 
  | 'Principales' 
  | 'Postres' 
  | 'Café' 
  | 'Promociones'
  | 'Entrada' 
  | 'Principal' 
  | 'Bebida' 
  | 'Postre';
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended?: boolean;
  isVegan?: boolean;
  isAvailable?: boolean;
  menuId?: string;
}

export interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
}

export interface MenuData {
  id: string;
  name: string;
  description: string;
  products: Product[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminFormData {
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended: boolean;
  isVegan: boolean;
  isAvailable?: boolean;
}

// Nuevos tipos para Firebase
export interface FirebaseMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended: boolean;
  isVegan: boolean;
  isAvailable?: boolean;
  menuId?: string;
  createdAt: Date | FieldValue | null;
  updatedAt: Date | FieldValue | null;
}

export interface FirebaseMenu {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  createdAt: FieldValue | Timestamp | Date | null;
  updatedAt: FieldValue | Timestamp | Date | null;
}

// Tipos para el hook de Firebase
export interface UseFirebaseMenuReturn {
  menuData: MenuData | null;
  loading: boolean;
  error: string | null;
  updateMenu: (menuData: Partial<MenuData>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

// Tipos para la API de base de datos
export interface DatabaseAPI {
  getMenus(): Promise<Menu[]>;
  getMenu(id: string): Promise<Menu | null>;
  createMenu(menu: Omit<Menu, 'id'>): Promise<Menu>;
  updateMenu(id: string, menu: Partial<Menu>): Promise<Menu>;
  deleteMenu(id: string): Promise<void>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProductsByMenu(menuId: string): Promise<Product[]>;
  
  initializeDatabase(): Promise<void>;
  exportData(): Promise<{ menus: Menu[], products: Product[] }>;
  getSchemaInfo(): Record<string, unknown>;
}