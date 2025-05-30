'use client';

import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import { Menu, Product } from '../../types';
export interface UseAdminDataReturn {
  menus: Menu[];
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  createMenu: (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateMenu: (id: string, menuData: Partial<Menu>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  initializeDatabase: (data: { menus: Menu[], products: Product[] }) => Promise<void>;
  exportData: () => Promise<{ menus: Menu[], products: Product[] }>;
}

export function useAdminData(): UseAdminDataReturn {
  // Use the Firebase hook directly
  const firebaseMenu = useFirebaseMenu();
  return {
    menus: firebaseMenu.menus,
    products: firebaseMenu.products,
    loading: firebaseMenu.loading,
    error: firebaseMenu.error,
    refreshData: firebaseMenu.refreshData,
    createMenu: firebaseMenu.createMenu,
    updateMenu: firebaseMenu.updateMenu,
    deleteMenu: firebaseMenu.deleteMenu,
    createProduct: firebaseMenu.createProduct,
    updateProduct: firebaseMenu.updateProduct,
    deleteProduct: firebaseMenu.deleteProduct,
    initializeDatabase: firebaseMenu.initializeDatabase,
    exportData: firebaseMenu.exportData
  };
}
