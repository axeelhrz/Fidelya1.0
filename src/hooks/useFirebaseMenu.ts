'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FirebaseDatabase } from '../lib/firebase-database';
import { Menu, Product } from '../app/types';

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
  initializeDatabase: (data: { menus: Menu[], products: Product[] }) => Promise<void>;
  exportData: () => Promise<{ menus: Menu[], products: Product[] }>;
}

export function useFirebaseMenu(menuId?: string, realtime: boolean = true): UseFirebaseMenuReturn {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Refs to store unsubscribe functions
  const unsubscribeMenus = useRef<(() => void) | null>(null);
  const unsubscribeProducts = useRef<(() => void) | null>(null);

  // Error handler
  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    setConnected(false);
    console.error('Firebase error:', err);
  }, []);

  // Setup realtime listeners
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
        menuId,
        handleError
      );
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, [realtime, menuId, loading, handleError]);

  // Cleanup listeners
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

  // Refresh data manually (for non-realtime mode)
  const refreshData = useCallback(async () => {
    if (realtime) return; // Don't refresh if using realtime
    try {
      setLoading(true);
      setError(null);
      
      const [menusData, productsData] = await Promise.all([
        FirebaseDatabase.getMenus(),
        FirebaseDatabase.getProducts(menuId)
      ]);
      
      setMenus(menusData);
      setProducts(productsData);
      setConnected(true);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [realtime, menuId, handleError]);

  // Setup effect
  useEffect(() => {
    if (realtime) {
      setupRealtimeListeners();
    } else {
      refreshData();
    }

    // Cleanup on unmount or dependency change
    return cleanupListeners;
  }, [realtime, setupRealtimeListeners, refreshData, cleanupListeners]);

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

  const initializeDatabase = useCallback(async (data: { menus: Menu[], products: Product[] }) => {
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
      return await FirebaseDatabase.exportData();
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
    exportData
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
      menuId,
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