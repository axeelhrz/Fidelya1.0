'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, MenuData } from '../app/types';

interface DatabaseHook {
  // Estados
  loading: boolean;
  error: string | null;
  
  // Operaciones de menús
  menus: MenuData[];
  getMenu: (id: string) => Promise<MenuData | null>;
  getAllMenus: () => Promise<MenuData[]>;
  createMenu: (menu: MenuData) => Promise<boolean>;
  updateMenu: (menu: MenuData) => Promise<boolean>;
  deleteMenu: (id: string) => Promise<boolean>;
  
  // Operaciones de productos
  createProduct: (product: Product, menuId: string) => Promise<boolean>;
  updateProduct: (product: Product, menuId: string) => Promise<boolean>;
  deleteProduct: (id: string, menuId?: string) => Promise<boolean>;
  
  // Utilidades
  initializeDatabase: (force?: boolean) => Promise<boolean>;
  refreshMenus: () => Promise<void>;
  getDatabaseInfo: () => Promise<object | null>;
  
  // Funciones en tiempo real específicas de Firebase
  subscribeToMenus: (callback: (menus: MenuData[]) => void) => (() => void) | null;
}

export const useDatabase = (): DatabaseHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<MenuData[]>([]);

  // Función para manejar errores
  const handleError = useCallback((error: any) => {
    console.error('Database error:', error);
    setError(error.message || 'Error desconocido');
    setLoading(false);
  }, []);

  // Función para hacer peticiones a la API
  const apiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      setError(null);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      const data = await response.json();
      console.log(`API ${options.method || 'GET'} ${url}:`, data);

      if (!data.success) {
        throw new Error(data.error || 'Error en la petición');
      }

      return data.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  // Operaciones de menús
  const getAllMenus = useCallback(async (): Promise<MenuData[]> => {
    console.log('Obteniendo todos los menús...');
      setLoading(true);
    try {
      const data = await apiRequest('/api/menus');
      setMenus(data || []);
      setLoading(false);
      return data || [];
    } catch (error) {
      setLoading(false);
      return [];
    }
  }, [apiRequest]);

  const getMenu = useCallback(async (id: string): Promise<MenuData | null> => {
    console.log('Obteniendo menú:', id);
      setLoading(true);
    try {
      const data = await apiRequest(`/api/menus/${id}`);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      return null;
    }
  }, [apiRequest]);

  const createMenu = useCallback(async (menu: MenuData): Promise<boolean> => {
    console.log('Creando menú:', menu);
    setLoading(true);
    try {
      await apiRequest('/api/menus', {
        method: 'POST',
        body: JSON.stringify(menu),
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);

  const updateMenu = useCallback(async (menu: MenuData): Promise<boolean> => {
    console.log('Actualizando menú:', menu);
    setLoading(true);
    try {
      await apiRequest(`/api/menus/${menu.id}`, {
        method: 'PUT',
        body: JSON.stringify(menu),
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);

  const deleteMenu = useCallback(async (id: string): Promise<boolean> => {
    console.log('Eliminando menú:', id);
    setLoading(true);
    try {
      await apiRequest(`/api/menus/${id}`, {
        method: 'DELETE',
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);

  // Operaciones de productos
  const createProduct = useCallback(async (product: Product, menuId: string): Promise<boolean> => {
    console.log('Creando producto:', product, 'en menú:', menuId);
    setLoading(true);
    try {
      await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify({ product, menuId }),
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);

  const updateProduct = useCallback(async (product: Product, menuId: string): Promise<boolean> => {
    console.log('Actualizando producto:', product);
    setLoading(true);
    try {
      await apiRequest(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({ product, menuId }),
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);

  const deleteProduct = useCallback(async (id: string, menuId?: string): Promise<boolean> => {
    console.log('Eliminando producto:', id);
    setLoading(true);
    try {
      const url = menuId ? `/api/products/${id}?menuId=${menuId}` : `/api/products/${id}`;
      await apiRequest(url, {
        method: 'DELETE',
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);

  // Utilidades
  const initializeDatabase = useCallback(async (force: boolean = false): Promise<boolean> => {
    console.log('Inicializando base de datos...');
    setLoading(true);
    try {
      await apiRequest('/api/database/seed', {
        method: 'POST',
        body: JSON.stringify({ force }),
      });
      setLoading(false);
      await refreshMenus();
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  }, [apiRequest]);
  const refreshMenus = useCallback(async (): Promise<void> => {
    await getAllMenus();
  }, [getAllMenus]);

  const getDatabaseInfo = useCallback(async (): Promise<object | null> => {
    console.log('Obteniendo información de la base de datos...');
    try {
      const data = await apiRequest('/api/database/seed');
      return data;
    } catch (error) {
      return null;
    }
  }, [apiRequest]);

  // Función para suscribirse a cambios en tiempo real (específica de Firebase)
  const subscribeToMenus = useCallback((callback: (menus: MenuData[]) => void): (() => void) | null => {
    // Esta función se implementará directamente en los componentes que usen Firebase
    // usando el hook useFirebaseMenu para tiempo real
    console.log('subscribeToMenus: usar useFirebaseMenu para tiempo real');
    return null;
  }, []);

  // Cargar menús al montar el componente
  useEffect(() => {
    console.log('useDatabase montado, cargando menús...');
    getAllMenus();
  }, [getAllMenus]);

  return {
    loading,
    error,
    menus,
    getMenu,
    getAllMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    createProduct,
    updateProduct,
    deleteProduct,
    initializeDatabase,
    refreshMenus,
    getDatabaseInfo,
    subscribeToMenus,
  };
};

export default useDatabase;