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
  createdAt?: string;
  updatedAt?: string;
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

// Tipos para el hook de Firebase mejorado
export interface UseFirebaseMenuReturn {
  menuData: MenuData | null;
  loading: boolean;
  error: string | null;
  updateMenu: (menuData: Partial<MenuData>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductsAvailability?: (productIds: string[], isAvailable: boolean) => Promise<void>;
}

// Tipos para estadísticas del dashboard
export interface AdminStatistics {
  totalMenus: number;
  totalProducts: number;
  productsByCategory: Record<string, number>;
  availableProducts: number;
  recommendedProducts: number;
  veganProducts: number;
}

// Tipos para la API de base de datos mejorada
export interface DatabaseAPI {
  // Métodos básicos
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

  // Métodos avanzados opcionales
  getMenuWithProducts?(id: string): Promise<MenuData | null>;
  getStatistics?(): Promise<AdminStatistics>;
  updateProductsAvailability?(productIds: string[], isAvailable: boolean): Promise<void>;
  duplicateMenu?(menuId: string, newName: string): Promise<Menu>;
  getCategories?(): Promise<ProductCategory[]>;
  createCategory?(name: ProductCategory): Promise<void>;

  // Funcionalidad en tiempo real opcional
  realtime?: {
    subscribeToMenu(menuId: string, callback: (menu: MenuData | null) => void): () => void;
    subscribeToMenus(callback: (menus: Menu[]) => void): () => void;
    subscribeToProducts(menuId: string, callback: (products: Product[]) => void): () => void;
  };

  // Métodos organizados por entidad
  menus?: {
    get(id: string): Promise<Menu | null>;
    getAll(): Promise<Menu[]>;
    getWithProducts(id: string): Promise<MenuData | null>;
    create(menu: Omit<Menu, 'id'>): Promise<Menu>;
    update(id: string, menu: Partial<Menu>): Promise<Menu>;
    delete(id: string): Promise<void>;
    duplicate?(menuId: string, newName: string): Promise<Menu>;
  };

  products?: {
    get(id: string): Promise<Product | null>;
    getAll(): Promise<Product[]>;
    getByMenu(menuId: string): Promise<Product[]>;
    create(product: Omit<Product, 'id'>): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product>;
    delete(id: string): Promise<void>;
    updateAvailability?(productIds: string[], isAvailable: boolean): Promise<void>;
  };

  categories?: {
    getAll(): Promise<ProductCategory[]>;
    create(name: ProductCategory): Promise<void>;
  };
}

// Tipos para componentes del panel admin
export interface MenuEditorProps {
  menuId: string;
  onMenuUpdate?: (menu: MenuData) => void;
}

export interface QRGeneratorProps {
  menuId: string;
  menuName: string;
  onUrlChange?: (url: string) => void;
}

export interface CategoryManagerProps {
  categories: ProductCategory[];
  onCategoryAdd: (category: ProductCategory) => void;
  onCategoryDelete?: (category: ProductCategory) => void;
}

// Tipos para filtros y búsqueda
export interface ProductFilters {
  category?: ProductCategory;
  isAvailable?: boolean;
  isRecommended?: boolean;
  isVegan?: boolean;
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface MenuFilters {
  isActive?: boolean;
  searchTerm?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Tipos para notificaciones y estados
export interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  id?: string;
}

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
}

// Tipos para configuración del QR
export interface QRConfig {
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
  logoUrl?: string;
  logoSize?: number;
}

// Tipos para backup y sincronización
export interface BackupData {
  menus: Menu[];
  products: Product[];
  categories: ProductCategory[];
  timestamp: string;
  version: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync?: string;
  pendingChanges: number;
  syncInProgress: boolean;
}