import { FieldValue, Timestamp } from 'firebase/firestore';

export type ProductCategory = 'Entrada' | 'Principal' | 'Bebida' | 'Postre';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended?: boolean;
  isVegan?: boolean;
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
}

export interface AdminFormData {
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended: boolean;
  isVegan: boolean;
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
  createdAt: Date | FieldValue | null; // Timestamp de Firebase
  updatedAt: Date | FieldValue | null; // Timestamp de Firebase
}

export interface FirebaseMenu {
  id: string;
  name: string;
  description: string;
  createdAt: FieldValue | Timestamp | Date | null; // Timestamp de Firebase
  updatedAt: FieldValue | Timestamp | Date | null;
 // Timestamp de Firebase
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