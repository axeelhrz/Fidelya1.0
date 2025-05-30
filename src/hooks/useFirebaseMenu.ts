'use client';

import { useState, useEffect } from 'react';
import { FirebaseDatabase } from '../lib/firebase-database';
import { Menu, Product } from '../app/types';

export interface UseFirebaseMenuReturn {
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

export function useFirebaseMenu(): UseFirebaseMenuReturn {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
    setLoading(true);
      setError(null);
      const [menusData, productsData] = await Promise.all([
        FirebaseDatabase.getMenus(),
        FirebaseDatabase.getProducts()
      ]);
      setMenus(menusData);
      setProducts(productsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
    };

  useEffect(() => {
    refreshData();
  }, []);

  const createMenu = async (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await FirebaseDatabase.createMenu(menuData);
      await refreshData();
      return id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
}
  };

  const updateMenu = async (id: string, menuData: Partial<Menu>) => {
    try {
      setError(null);
      await FirebaseDatabase.updateMenu(id, menuData);
      await refreshData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteMenu = async (id: string) => {
    try {
      setError(null);
      await FirebaseDatabase.deleteMenu(id);
      await refreshData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await FirebaseDatabase.createProduct(productData);
      await refreshData();
      return id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      setError(null);
      await FirebaseDatabase.updateProduct(id, productData);
      await refreshData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await FirebaseDatabase.deleteProduct(id);
      await refreshData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const initializeDatabase = async (data: { menus: Menu[], products: Product[] }) => {
    try {
      setError(null);
      setLoading(true);
      await FirebaseDatabase.initializeDatabase(data);
      await refreshData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const exportData = async () => {
    try {
      setError(null);
      return await FirebaseDatabase.exportData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    menus,
    products,
    loading,
    error,
    refreshData,
    createMenu,
    updateMenu,
    deleteMenu,
    createProduct,
    updateProduct,
    deleteProduct,
    initializeDatabase,
    exportData
  };
}