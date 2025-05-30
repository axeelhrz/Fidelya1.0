'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FirebaseDatabase } from '../lib/firebase-database';
import { Menu, Product, ProductFilters, MenuFilters } from '../app/types';

export interface UseFirebaseMenuReturn {
  menus: Menu[];
  products: Product[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  refreshData: () => Promise<void>;
  createMenu: (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateMenu: (id: string, menuData: Partial<Menu>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  initializeDatabase: (data: { 
    menus: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>[], 
    products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] 
  }) => Promise<void>;
  exportData: () => Promise<{ menus: Menu[], products: Product[] }>;
  setProductFilters: (filters: ProductFilters) => void;
  setMenuFilters: (filters: MenuFilters) => void;
}

export function useFirebaseMenu(
  initialProductFilters?: ProductFilters, 
  initialMenuFilters?: MenuFilters,
  realtime: boolean = true
): UseFirebaseMenuReturn {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [productFilters, setProductFilters] = useState<ProductFilters>(initialProductFilters || {});
  const [menuFilters, setMenuFilters] = useState<MenuFilters>(initialMenuFilters || {});

  const unsubscribeMenus = useRef<(() => void) | null>(null);
  const unsubscribeProducts = useRef<(() => void) | null>(null);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    setConnected(false);
    console.error('Firebase error:', err);
  }, []);

  const setupRealtimeListeners = useCallback(() => {
    if (!realtime) return;

    try {
      // Subscribe to menus
      unsubscribeMenus.current = FirebaseDatabase.subscribeToMenus(
        (menusData) => {
          setMenus(menusData);
          setConnected(true);
      setError(null);
          if (loading) setLoading(false);
        },
        menuFilters,
        handleError
      );

      // Subscribe to products
      unsubscribeProducts.current = FirebaseDatabase.subscribeToProducts(
        (productsData) => {
          setProducts(productsData);
          setConnected(true);
      setError(null);
          if (loading) setLoading(false);
        },
        productFilters,
        handleError
      );

    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, [realtime, productFilters, menuFilters, loading, handleError]);

  const cleanupListeners = useCallback(() => {
    if (unsubscribeMenus.current) {
      unsubscribeMenus.current();
      unsubscribeMenus.current = null;
    }
    if (unsubscribeProducts.current) {
      unsubscribeProducts.current();
      unsubscribeProducts.current = null;
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (realtime) return;
    try {
      setLoading(true);
      setError(null);
      
      const [menusData, productsData] = await Promise.all([
        FirebaseDatabase.getMenus(menuFilters),
        FirebaseDatabase.getProducts(productFilters)
      ]);
      
      setMenus(menusData);
      setProducts(productsData);
      setConnected(true);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [realtime, productFilters, menuFilters, handleError]);

  useEffect(() => {
    cleanupListeners();
    if (realtime) {
      setupRealtimeListeners();
    } else {
      refreshData();
    }

    return cleanupListeners;
  }, [realtime, productFilters, menuFilters, setupRealtimeListeners, refreshData, cleanupListeners]);

  // CRUD operations
  const createMenu = useCallback(async (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await FirebaseDatabase.createMenu(menuData);
      if (!realtime) await refreshData();
      return id;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const updateMenu = useCallback(async (id: string, menuData: Partial<Menu>) => {
    try {
      setError(null);
      await FirebaseDatabase.updateMenu(id, menuData);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const deleteMenu = useCallback(async (id: string) => {
    try {
      setError(null);
      await FirebaseDatabase.deleteMenu(id);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await FirebaseDatabase.createProduct(productData);
      if (!realtime) await refreshData();
      return id;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    try {
      setError(null);
      await FirebaseDatabase.updateProduct(id, productData);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      setError(null);
      await FirebaseDatabase.deleteProduct(id);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const initializeDatabase = useCallback(async (data: { 
    menus: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>[], 
    products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] 
  }) => {
    try {
      setError(null);
      setLoading(true);
      await FirebaseDatabase.initializeDatabase(data);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const exportData = useCallback(async () => {
    try {
      setError(null);
      const data = await FirebaseDatabase.exportData();
      return { menus: data.menus, products: data.products };
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [handleError]);

  return {
    menus,
    products,
    loading,
    error,
    connected,
    refreshData,
    createMenu,
    updateMenu,
    deleteMenu,
    createProduct,
    updateProduct,
    deleteProduct,
    initializeDatabase,
    exportData,
    setProductFilters,
    setMenuFilters
  };
}

// Hook específico para un menú individual con tiempo real
export function useFirebaseMenuById(menuId: string) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const unsubscribeMenu = useRef<(() => void) | null>(null);
  const unsubscribeProducts = useRef<(() => void) | null>(null);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    setConnected(false);
    console.error('Firebase error:', err);
  }, []);

  useEffect(() => {
    if (!menuId) return;

    // Subscribe to specific menu
    unsubscribeMenu.current = FirebaseDatabase.subscribeToMenu(
      menuId,
      (menuData) => {
        setMenu(menuData);
        setConnected(true);
        setError(null);
        if (loading) setLoading(false);
      },
      handleError
    );

    // Subscribe to products for this menu
    unsubscribeProducts.current = FirebaseDatabase.subscribeToProducts(
      (productsData) => {
        setProducts(productsData);
        setConnected(true);
        setError(null);
        if (loading) setLoading(false);
      },
      { menuId },
      handleError
    );

    return () => {
      if (unsubscribeMenu.current) {
        unsubscribeMenu.current();
      }
      if (unsubscribeProducts.current) {
        unsubscribeProducts.current();
      }
    };
  }, [menuId, loading, handleError]);

  return {
    menu,
    products,
    loading,
    error,
    connected
  };
}